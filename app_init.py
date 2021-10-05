from flask import Flask, jsonify, abort, render_template,url_for,request
from flask_caching import Cache
from flask_cors import CORS, cross_origin
import pandas as pd
import requests
import csv
import json
import ast

cache = Cache(config={'CACHE_TYPE': 'simple'})

app = Flask(__name__)
cache.init_app(app)
CORS(app)

app.config.from_object('config')
port = app.config['PORT']

#file_affs = "static/data/df_affiliations.csv"
df_structures = pd.read_json("static/data/df_structures.json",encoding="utf-8")
#file_affs2docs = "static/data/joel/df_corpus.csv"
df_corpus = pd.read_csv("static/data/df_corpus.csv",sep = ',',encoding="utf-8")
#file_docs = "static/data/df_doi_oa.csv"
df_doi_oa = pd.read_csv("static/data/df_doi_oa.csv",sep = ',',encoding="utf-8")

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
    import pandas as pd
    if source == "structures":
        records = df_structures
    else:
        records = pd.read_csv("static/data/df_"+source+".csv",sep = ',',encoding="utf-8").fillna('').to_dict(orient='records')  
    return render_template('list.html',source=source,len=len(records),records=records) 

'''@app.route('/dashboard/<source>/<ids>', methods = ['GET'])
def dashboard(source,ids=None):
    import pandas as pd
    if source == "uca":
        return render_template('dashboard.html',source="uca",names="UCA",data=df_publications)
    if source == "affiliations":
        selected_s =  ",".join([','.join(df_affiliations[df_affiliations.id == int(p)]["affiliation-name"]) for p in list(ids.split(","))])
        return render_template('dashboard.html',ids=str(ids),source="affiliations",names=selected_s,data=doi_synthetics(request.args.get('ids')))'''

@app.route('/dashboard/<source>', methods = ['GET'])
def dashboard(source,ids=None):
    """source param is : 'structures' or 'uca'"""
    import pandas as pd
    if source == "uca":
        total_records = df_doi_oa.shape[0]
        return render_template('dashboard.html',source="uca",names="UCA",total_records=total_records)
    if source == "structures":
        if request.args.get('ids') is not None:
            ids = request.args.get('ids')
            total_records = doi_synthetics(ids).shape[0]
            selected_s =  ",".join([','.join(df_structures[df_structures.id == int(p)]["affiliation-name"]) for p in list(ids.split(","))])
            return render_template('dashboard.html',ids=ids,source="structures",names=selected_s,total_records=total_records)
        else:
            print("no ids submitted")

#routing for API
@app.route('/api/publications', methods = ['GET'])
@cache.cached(timeout=50)
def publis(): 
    import pandas as pd
    if 'ids' in request.args:
        if request.args.get('level') == "structures":
            records = doi_synthetics(request.args.get('ids')) #?level=aff/auth&id=
    else:
        records = df_doi_oa 
    records = records.fillna('')
    return jsonify(records.to_dict(orient='records'))

#idem df["key"].value_counts()
@app.route('/agg/publications/<key>', methods = ['GET'])
@cache.cached(timeout=50)
def aggPublis(key):   
    import pandas as pd
    if 'ids' in request.args:
        if request.args.get('level') == "structures":
            records = doi_synthetics(ids=str(request.args.get('ids'))) #?level=aff/auth&id=
    else:
        records = df_doi_oa 
    values = records[key].value_counts().keys().tolist()
    counts = records[key].value_counts().tolist()
    value_dict = dict(zip(values, counts))
    return jsonify(value_dict)  

#idem df.groupby['key1,key2'].size()
@app.route('/group/publications/<keys>', methods = ['GET'])
@cache.cached(timeout=50)
def groupPublis(keys):   
    import pandas as pd
    if 'ids' in request.args:
        if request.args.get('level') == "structures":
            records = doi_synthetics(ids=str(request.args.get('ids')))  #?level=aff/auth&id=
    else:
        records = df_doi_oa
    l = keys.split(',')
    g = records.groupby(l).size().unstack().fillna(0)
    #10 most represented publishers
    if "publisher_by_doiprefix" in keys:
        filter_sort_index = records['publisher_by_doiprefix'].value_counts().nlargest(10).keys()
        grouped = g[g.index.isin(filter_sort_index)].reindex(filter_sort_index)
    else:
        grouped = g
    return jsonify(grouped.to_dict('index'))

if __name__ == '__main__':
    app.run(debug=True,port=port)  