#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify, abort, render_template,url_for,request
from flask_caching import Cache
from flask_cors import CORS, cross_origin
import pandas as pd
import requests
import plotly
import pybso.charts as charts
import charts_functions as cf
#import csv
import json
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk import bigrams
from nltk.tokenize import RegexpTokenizer
from nltk.stem import WordNetLemmatizer
import itertools
#mport scipy
#import scipy.sparse as sp
import networkx as nx
from networkx.readwrite import json_graph

cache = Cache(config={'CACHE_TYPE': 'simple'})

app = Flask(__name__)
cache.init_app(app)
CORS(app)

app.config.from_object('config')
port = app.config['PORT']

#util for using zip in html template
app.jinja_env.globals.update(zip=zip)

## Variables
df_structures = pd.read_json("static/data/df_structures.json",encoding="utf-8")
df_corpus = pd.read_csv("static/data/df_corpus.csv",sep = ',',encoding="utf-8")
df_doi_oa = pd.read_csv("static/data/df_doi_oa.csv",sep = ',',encoding="utf-8")
oa_functions_fig = [charts.oa_rate,charts.oa_rate_by_year,charts.oa_rate_by_publisher,charts.oa_rate_by_type,charts.oa_by_status]
oa_functions_str = ["oa_rate","oa_rate_by_year","oa_rate_by_publisher","oa_rate_by_type","oa_by_status"]
oa_titles = ["Proportion des publications en accès ouvert","Evolution du taux d'accès ouvert aux publications","Taux d'accès ouvert aux publications par éditeur","Répartition des publications par type de publications et par accès","Part Open Access : Evolution du type d'accès ouvert"]
dashboard_functions_fig = [cf.oa_by_year,cf.citations_by_oa]
dashboard_functions_str = ["oa_by_year","citations_by_oa"]
dashboard_titles = ["Evolution du nombre de publications et de la part de l'accès ouvert","Nombre de citations par type d'accès (ouvert vs fermé)"]

def doi_synthetics(ids=None):
    if ids is None:
        data = df_doi_oa
    else:
        selected = list(ids.split(","))
        print(selected)
        list_doc = df_corpus[df_corpus["aff_internal_id"].isin(selected)]["doi"].unique().tolist()
        list_doc = list(map(str, list_doc))
        print(len(list_doc))
        data = df_doi_oa[df_doi_oa['doi'].isin(list_doc)]
        #d = df_docs[(df_docs['doi'].isin(list_doc)) & (df_docs["doi"].notna())]
    return data

def toLower(row):
    return str.lower(row['title']).strip()

tokenizer = RegexpTokenizer(r'\w+')
def tokenize(row):
    return [token for token in tokenizer.tokenize(row['title_lower_stop_words'].strip()) if ((token != u"") & (len(token)>2))]

lemmatizer = WordNetLemmatizer()
def lemmatize(row):
    return [lemmatizer.lemmatize(word) for word in row['title_lower_stop_words_token']]

def text_process(d):
    stop_en = set(stopwords.words('english')) 
    stop_fr = set(stopwords.words('french'))
    #df = d[d.title.notna()][["doi","title"]].sample(n=50)
    df = d[d.title.notna()][["doi","title"]]
    df["title_lower"] = df.apply(toLower,axis=1)
    df['title_lower_stop_words'] = df['title_lower'].apply(lambda x: ' '.join([word for word in x.split() if ((word not in (stop_en)) & (word not in (stop_fr)))]))
    df['title_lower_stop_words_token'] = df.apply(tokenize,axis=1)
    df['title_lower_stop_words_token_lemme'] = df.apply(lemmatize,axis=1)
    titles = df['title_lower_stop_words_token_lemme'].to_list()
    data = list(itertools.chain.from_iterable(titles))
    bi_grams = list(bigrams(data))
    bigram_freq = nltk.FreqDist(bi_grams).most_common(len(bi_grams))
    bigram_df = pd.DataFrame(bigram_freq,columns=['bigram', 'count'])
    return bigram_df

def network(df):
    d_bigram = text_process(df)
    d = d_bigram.head(200).set_index('bigram').T.to_dict('records')
    # Create network plot 
    G = nx.Graph()
    # Create connections between nodes
    for k, v in d[0].items():
        G.add_edge(k[0], k[1], weight=(v * 10))
    data = json_graph.node_link_data(G)
    H = json_graph.node_link_graph(data)
    return data

#routing for pages
@app.route('/')
def homePage():
    import pandas as pd
    return render_template('home.html')

@app.route('/test')
def testPage():
    import pandas as pd
    import plotly
    import pybso.charts as charts
    #fig = charts.oa_rate(inpath=file_docs)
    fig = charts.oa_rate(dataframe=df_doi_oa)
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return render_template('test.html',plot=graphJSON)

@app.route('/list/<source>', methods = ['GET'])
def readySource(source):
    """source param is : 'structures' or 'doi_oa' oy maybe later 'authors'"""
    if source == "structures":
        records = df_structures
    else:
        records = pd.read_csv("static/data/df_"+source+".csv",sep = ',',encoding="utf-8").fillna('').to_dict(orient='records')  
    return render_template('list.html',source=source,len=len(records),records=records) 

@app.route('/dashboard/<source>', methods = ['GET'])
def dashboard(source,ids=None):
    """source param is : 'structures' or 'uca'"""
    if source == "uca":
        total_records = df_doi_oa.shape[0]
        oaGraphsJSON = [json.dumps(f(dataframe=df_doi_oa,publisher_field="publisher_by_doiprefix"), cls=plotly.utils.PlotlyJSONEncoder) for f in oa_functions_fig]
        dashboardGraphsJSON = [json.dumps(f(df_doi_oa), cls=plotly.utils.PlotlyJSONEncoder) for f in dashboard_functions_fig]
        #dashboardNetworkJSON = json.dumps(network(df_doi_oa),separators=(',', ':'),indent=4)
        dashboardNetworkJSON = json.dumps(network(df_doi_oa))
        return render_template('dashboard.html',source="uca",names="UCA",total_records=total_records,oa_functions=oa_functions_str,oa_plots=oaGraphsJSON,oa_titles=oa_titles,dashboard_functions=dashboard_functions_str,dashboard_plots=dashboardGraphsJSON,dashboard_titles=dashboard_titles,dashboard_network=dashboardNetworkJSON)
    if source == "structures":
        if request.args.get('ids') is not None:
            ids = request.args.get('ids')
            total_records = doi_synthetics(ids).shape[0]
            selected_s =  ",".join([','.join(df_structures[df_structures.id == int(p)]["affiliation-name"]) for p in list(ids.split(","))])
            oaGraphsJSON = [json.dumps(f(dataframe=doi_synthetics(ids),publisher_field="publisher_by_doiprefix"), cls=plotly.utils.PlotlyJSONEncoder) for f in oa_functions_fig]
            dashboardGraphsJSON = [json.dumps(f(doi_synthetics(ids)), cls=plotly.utils.PlotlyJSONEncoder) for f in dashboard_functions_fig]
            dashboardNetworkJSON = json.dumps(network(doi_synthetics(ids)))
            return render_template('dashboard.html',ids=ids,source="structures",names=selected_s,total_records=total_records,oa_functions=oa_functions_str,oa_plots=oaGraphsJSON,oa_titles=oa_titles,dashboard_functions=dashboard_functions_str,dashboard_plots=dashboardGraphsJSON,dashboard_titles=dashboard_titles,dashboard_network=dashboardNetworkJSON)
        else:
            print("no ids submitted")

#routing for API
@app.route('/api/publications', methods = ['GET'])
def publis(): 
    if 'ids' in request.args:
        df = doi_synthetics(request.args.get('ids'))
    else:
        df = df_doi_oa
    if 'view' in request.args:
        if request.args.get('view') == "oa_rate":
            records= pd.crosstab(df["is_oa_normalized"], df["oa_host_type_normalized"])
        if request.args.get('view') == "oa_rate_by_year":
            records= pd.crosstab(df["year"], df["oa_host_type_normalized"])
        if request.args.get('view') == "oa_rate_by_publisher":
            records= pd.crosstab(df["publisher_by_doiprefix"], df["oa_host_type_normalized"])
        if request.args.get('view') == "oa_rate_by_type":
            records= pd.crosstab(df["genre"], df["oa_host_type_normalized"])
        if request.args.get('view') == "oa_by_status":
            records= pd.crosstab(df["year"], df["oa_status_normalized"])
        if request.args.get('view') == "oa_by_year":
            records= pd.crosstab(df["year"], df["is_oa_normalized"])
        return jsonify(records.fillna('').to_dict(orient='index'))
    elif 'crosskeys' in request.args:
        l = request.args.get('crosskeys').split(',')
        records = pd.crosstab(df[l[0]], df[l[1]])
        return jsonify(records.fillna('').to_dict(orient='index'))
    else:
        records = df
        return jsonify(records.fillna('').to_dict(orient='records'))

@app.route('/api/structures/', defaults={'ids': ''})
@app.route('/api/structures/<ids>', methods = ['GET'])
def struct(ids):
    if ids == '':
        records = df_structures
    else:
        selected = list(ids.split(","))
        records = df_structures[df_structures["id"].isin(selected)]
    return jsonify(records.fillna('').to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True,port=port)  