$(function(){ 
  //if ($("#source").val() === undefined){
    if ($("#source").val() == "uca"){
    console.log("uca")
    url_oadonut = "/agg/publications/is_oa_normalized"
    url_oasemicircle = "/agg/publications/oa_status_normalized"
    url_oastacked = "/group/publications/date,is_oa_normalized"
    url_oaboxplot = "/group/publications/oa_host_type_normalized,is-referenced-by-count"
    url_obsstacked = "/group/publications/date,oa_host_type_normalized"
    url_obsnestedpie1 = "/agg/publications/is_oa_normalized"
    url_obsnestedpie2 = "/agg/publications/oa_host_type_normalized"
    url_obsstackedhorizontal = "/group/publications/publisher_by_doiprefix,oa_host_type_normalized"
    url_obstreemap = "/group/publications/oa_host_type_normalized,genre"
    url_datagrid = "/api/publications"
}
else {
    console.log($("#source").val())
    url_oadonut = "/agg/publications/is_oa_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_oasemicircle = "/agg/publications/oa_status_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_oastacked = "/group/publications/date,is_oa_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_obsstacked = "/group/publications/date,oa_host_type_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_obsnestedpie1 = "/agg/publications/is_oa_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_obsnestedpie2 = "/agg/publications/oa_host_type_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_obsstackedhorizontal = "/group/publications/publisher_by_doiprefix,oa_host_type_normalized?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_obstreemap = "/group/publications/oa_host_type_normalized,genre?level=" + $("#source").val() + "&ids=" + $("#ids").val()
    url_datagrid = "/api/publications?level=" + $("#source").val() + "&ids=" + $("#ids").val()
}
  var orderKeys = ["Accès fermé","Editeur","Editeur et archives ouvertes","Archives ouvertes"]

  //général
  $.ajax({
    type: "GET",
    url: url_oadonut,
    dataType: 'json',
    success: function(data) {
     return donut3D("oadonut",object2array(data))  
    }
  });
  $.ajax({
    type: "GET",
    url: url_oasemicircle,
    dataType: 'json',
    success: function(data) {
     return semicircle("oasemicircle",object2array(data).filter(function(d){return d.key != "closed"}))  
    }
  });
  $.ajax({
    type: "GET",
    url: url_oastacked,
    dataType: 'json',
    success: function(data) {
      result = object2array(data).map(function (d) {
        return flatObject(d)
    })
    //for key chart stackedbar
    var uniqueKeys = Object.keys(result.reduce(function(o, result) {
        return Object.assign(o, result);
      }, {}))
      .filter(function(d){return d != "key"}) //only Editeur, Archives ouvertes...
      .sort(function(a, b) {
        return orderKeys.indexOf(a) - orderKeys.indexOf(b);
      }) // order appearance of stacked
     /*return stackedBar("docyearstacked","Evolution annuelle en valeurs absolues (avec part OA)",object2array(data).map(function(d) {return flatObject(d)})),
     stackedbar100percent ("docyearstackedrelative","Evolution annuelle de la part OA en valeurs relatives",object2array(data).map(function(d) {return flatObject(d)}))*/
     return stackedarea("docyearstacked",result),
     stackedbar100percent ("docyearstackedrelative",result,uniqueKeys)
    }
  });
//Général citations

//OA observatoire
function chainedAjax(a) {
  $.ajax({
      type: "GET",
      url: url_obsnestedpie2,
      dataType: 'json',
      success: function(data) {
          final_array = a.concat(object2array(data));
          //console.log(final_array)
          return nestedDonut("oa_obs_nesteddonut",final_array)
      }
    });
}
$.ajax({
  type: "GET",
  url: url_obsnestedpie1,
  dataType: 'json',
  success: function(data) {
   arr = object2array(data).map(function(d){return {"global_key":d["key"],"global_value":d["value"]}})
   chainedAjax(arr)
  }
});

$.ajax({
  type: "GET",
  url:  url_obsstacked,
  dataType: 'json',
  success: function (data) {
      result = object2array(data).map(function (d) {
          return flatObject(d)
      })
      //for key chart
      var uniqueKeys = Object.keys(result.reduce(function(o, result) {
          return Object.assign(o, result);
        }, {}))
        .filter(function(d){return d != "key"}) //only Editeur, Archives ouvertes...
        .sort(function(a, b) {
          return orderKeys.indexOf(a) - orderKeys.indexOf(b);
        }) // order appearance of stacked
       //console.log(uniqueKeys)
      stackedbar100percent("oa_obs_stackedrelative", result,uniqueKeys)
  }
});

$.ajax({
    type: "GET",
    url:  url_obsstackedhorizontal,
    dataType: 'json',
    success: function (data) {
        result = object2array(data).map(function (d) {
            return flatObject(d)
        })
        //for key chart
        var uniqueKeys = Object.keys(result.reduce(function(o, result) {
            return Object.assign(o, result);
          }, {}))
          .filter(function(d){return d != "key"}) //only Editeur, Archives ouvertes...
          .sort(function(a, b) {
            return orderKeys.indexOf(a) - orderKeys.indexOf(b);
          }) // order appearance of stacked
         //console.log(uniqueKeys)
         stackedbar100percentHorizontal("oa_obs_stackedrelative_publisher", result,uniqueKeys)
    }
  });

$.ajax({
    type: "GET",
    url: url_obstreemap,
    dataType: 'json',
    success: function(data) {
        //console.log(data)
        return treeMap("oa_obs_treemap",data)  
    }
  });
//datagrid
$("#gridContainer").dxDataGrid({
  dataSource: new DevExpress.data.CustomStore(
      {
          key: "doi",
          loadMode: "raw",
          load: function () {
              return $.ajax({
                  type: "GET",
                  url: url_datagrid,
                  dataType: 'json',
                  success: function (data) {
                    console.log(url_datagrid)
                      return data
                  }
              });
          }
      }
  ),
  repaintChangesOnly: true,
  showBorders: true,
  columnAutoWidth: true,
  width: '100%',
  rowAlternationEnabled: true,
  allowColumnResizing: true,
  allowColumnReordering: true,
  paging: {
      pageSize: 20
  },
  pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [
          5,
          10,
          20,
          50,
          100
      ],
      showInfo: true
  },
  "export": {
      enabled: true,
      fileName: "publications"
  },
  headerFilter: {
      visible: true
  },
  filterRow: {
      visible: true,
      applyFilter: "auto"
  },
  filterPanel: {
      visible: true
  },
  searchPanel: {
      visible: true
  },
  groupPanel: {
    emptyPanelText: "Drag & Drop colonnes pour effectuer des regroupements",
    visible: true
},
  columnChooser: {
      enabled: true,
      mode: "select"
  },
  columns: [
      {
          dataField: "doi",
          caption: "DOI",
          alignment: "left",
          width: 150,
          cellTemplate: function(container, options) {
            var currentDoc = options.data;
            container
             .append("<a href='http://dx.doi.org/"+currentDoc.doi + "' target='_blanck'>" + currentDoc.doi + "</a>")
          }
      },
      {
        dataField: "source_id",
        caption: "ID source",
        alignment: "left",
        width: 150,
        cellTemplate: function(container, options) {
          var currentDoc = options.data;
          if(currentDoc.source_id.includes("SCOPUS")) {
          container
           .append("<a href='"+currentDoc.source_id + "' target='_blanck'>" + currentDoc.source_id + "</a>")
        }
      }
    },
      {
          dataField: "genre",
          caption: "Type doc",
          width: 100,
      },
      {
          dataField: "title",
          caption: "Titre",
          width: 250
      },
      {
          dataField: "date",
          caption: "Date",
          width: 80,
      },
      {
        dataField: "corresponding",
        caption: "Corresponding auteur (si UCA)",
        width: 250,
      },
      {
        dataField: "all_authors",
        caption: "Auteurs (UCA)",
        width: 250,
      },
      {
          dataField: "publisher_by_doiprefix",
          caption: "Editeur",
          width: 150,
      }, {
          dataField: "journal_name",
          caption: "Journal",
          width: 150,
          visible: false
      }, {
          dataField: "journal_issn_l",
          caption: "Journal ISSN",
          width: 100,
          visible: false
      }, /*{
          dataField: "is-referenced-by-count",
          caption: "Nombre de citations",
          alignment: "left",
          dataType: 'number',
          width: 50,
      }, */{
          dataField: "is_oa_normalized",
          caption: "OA",
          width: 100,
      }, {
          dataField: "oa_status_normalized",
          caption: "OA statut",
          width: 100,
      },  {
          dataField: "oa_host_type_normalized",
          caption: "OA Type",
          width: 200,
      },
      {
          dataField: "oa_repo_normalized",
          caption: "Hébergement",
          width: 150,
      },
      /*{
          dataField: "funders",
          caption: "Financements",
          width: 250,
      },*/
      {
        dataField: "dsm_oa_classification",
        caption: "Dissemin OA Classification",
        width: 100,
      },
      {
        dataField: "dsm_policy_preprint",
        caption: "Preprint Policy",
        width: 100,
      },
      {
        dataField: "dsm_policy_postprint",
        caption: "Postprint Policy",
        width: 100,
      },
      {
        dataField: "dsm_policy_published",
        caption: "Version publiée Policy",
        width: 100,
      },
  ],
  summary: {
    groupItems: [{
        column: "doi",
        summaryType: "count",
        alignByColumn: true,
        displayFormat: "{0} publications",
    }, {
        column: "is-referenced-by-count",
        summaryType: "avg",
        showInGroupFooter: false,
        alignByColumn: true,
        displayFormat: "{0} citations en moyenne",
    }]
}
});
})