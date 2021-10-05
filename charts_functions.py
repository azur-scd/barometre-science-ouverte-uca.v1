#!/usr/bin/env python
# -*- coding: utf-8 -*-
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

colors = {'Accès fermé': 'grey',
          'Accès ouvert': '#3288BD',
          'Archive ouverte': 'rgb(122,230,212)',
          'Editeur': 'rgb(241,225,91)',
          'Editeur et archive ouverte':'rgb(211,240,140)'}
list_order = ['Accès fermé','Accès ouvert','Editeur et archive ouverte', 'Archive ouverte', 'Editeur']

def oa_by_year(df):
    df.year = df.year.astype(str)
    dc = pd.crosstab(df["year"], df["is_oa_normalized"])
    x=sorted(df[df.year.notna()].year.unique().tolist())
    fig = go.Figure()
    #stackgroup='one'
    for i in dc.columns:
        fig.add_trace(go.Scatter(x=x, y=dc[i],name=i,fillcolor=colors[i],mode='none',stackgroup='one'))
    return fig

def citations_by_oa(df):
    fig = go.Figure()
    for i in df[df["is_oa_normalized"].notna()]["is_oa_normalized"].unique():
        fig.add_trace(go.Box(y=df[(df["is-referenced-by-count"] < 50) & (df["is-referenced-by-count"].notna()) & (df["is_oa_normalized"] == i)]["is-referenced-by-count"],name=i,marker_color=colors[i]))
    return fig
