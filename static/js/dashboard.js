$(function(){ 
  //if ($("#source").val() === undefined){
if ($("#source").val() == "uca"){
    console.log("uca")
    url_datagrid = config.url_subpath+"/api/publications"
}
else if ($("#source").val() == "structures") {
  url_datagrid = config.url_subpath+"/api/publications?ids=" + $("#ids").val()
}
else if ($("#source").val() == "publishers") {
  url_datagrid = config.url_subpath+"/api/publications?prefixs=" + $("#prefixs").val()
}
else {
    console.log("error : no source")
}
var store = new DevExpress.data.CustomStore({
  key: "doi",
  load: function () {
    return $.ajax({
      method: 'GET',
      url: url_datagrid,
      success: function (response) { return response.data;},
      error : function(response) {console.log(response.statusText);}
  })					
          }      
});
//datagrid
$("#gridContainer").dxDataGrid({
  dataSource: store,
  repaintChangesOnly: true,
  showBorders: true,
  columnAutoWidth: true,
  width: '100%',
  rowAlternationEnabled: true,
  allowColumnResizing: true,
  allowColumnReordering: true,
  paging: {
      pageSize: 10
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
    emptyPanelText: "Drag & Drop des entêtes de colonnes pour effectuer des regroupements",
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
          dataField: "year",
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
          caption: "Revue",
          width: 150
      }, {
          dataField: "journal_issn_l",
          caption: "Revue ISSN",
          width: 100,
          visible: false
      },
      {
        dataField: "journal_is_in_doaj",
        caption: "Revue dans DOAJ",
        width: 100
    },
       {
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
          caption: "Hébergement (types)",
          width: 150,
      },
      {
        dataField: "oa_host_domain",
        caption: "Hébergement (plateformes)",
        width: 150,
    },
      {caption: "Données Crossref",
       columns:[
        {
          dataField: "funder",
          caption: "Financements",
          width: 250,
      },
      {
        dataField: "is-referenced-by-count",
        caption: "Nombre de citations",
        alignment: "left",
        dataType: 'number',
        width: 100,
    },
       ]},
 
      {caption:"Données Dissemin",
      columns: [
        {
          dataField: "dsm_oa_classification",
          caption: "OA Classification",
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
          caption: "Published Policy",
          width: 100,
        }
      ]
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