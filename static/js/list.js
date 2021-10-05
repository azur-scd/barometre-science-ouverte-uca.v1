$("#btn").dxButton({
  text: "Get selection",
  onClick: ()=> {
   var selectedRowKeys = treeList.getSelectedRowKeys();
   var selected2send = Array.from(
    new Set(Array.from(getAllChildren(selectedRowKeys)))).filter(function(d){return d != 1 & d != 2 & d != 3}).join(",")
    window.open("/dashboard/structures?ids="+selected2send, "_blank");
  console.log(Array.from(
    new Set(Array.from(getAllChildren(selectedRowKeys)))).filter(function(d){return d != 1 & d != 2 & d != 3}).join(","));
}
});
function* getAllChildren(arr) {
  for (var i in arr) {
    yield arr[i];
    var node = treeList.getNodeByKey(arr[i]);
    if (node.hasChildren) { 
      var childrenKeys= node.children.map(ii=>{return ii.key});
      var resArray = Array.from(getAllChildren(childrenKeys));
      for (ii in resArray) {
        yield resArray[ii];
      }
    }
  }
};

var store = new DevExpress.data.CustomStore({
  key: "id",
  load: function () {
    return $.ajax({
      method: 'GET',
      url: "/api/structures/",
      success: function (response) { return response.data;},
      error : function(response) {console.log(response.statusText);}
  })					
          }      
});

var treeList = $("#affDatagrid").dxTreeList({
  dataSource: "/static/data/df_structures.json",
  //or dataSource: store,
  keyExpr: "id",
  parentIdExpr: "parent_id",
  showRowLines: false,
  showBorders: false,
  allowColumnResizing: true,
  columnResizingMode: "nextColumn",
  selection: {
      mode: "multiple",
      recursive: true
  },
sorting: {
      mode: "multiple"
  },
searchPanel: {
      visible: true
  },
  columns: [{ 
          dataField: "affiliation-name",
          caption: "Structures",
          cellTemplate: function(container, options) {
            var currentStruct = options.data;
             console.log(currentStruct)
            container
            .append("<span>"+ currentStruct['affiliation-name'] + "</span>")
            .append("<br >")
            if(currentStruct.id != 1 & currentStruct.id != 2 & currentStruct.id != 3) {
            //Scopus
              container
              .append("<a href='' target='_blanck'>Scopus ID : " + currentStruct.affiliation_id + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
              .append("\n")           
           /* .append($("<span>", { "class": "uk-badge", text: 'Scopus ID : ' + currentStruct.affiliation_id }))
            .append("\n")*/
            //Idref
            if(currentStruct.ppn_valide !== 'nan' & currentStruct.ppn_valide !== null) {
              container
              .append("<a href='https://www.idref.fr/"+currentStruct.ppn_valide + "' target='_blanck'>Idref : " + currentStruct.ppn_valide + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
              .append("\n")
            }	
            //HAL
            if(currentStruct.HAL !== 'nan' & currentStruct.HAL !== null) {
              container
              .append("<a href='https://aurehal.archives-ouvertes.fr/structure/read/id/"+currentStruct.HAL + "' target='_blanck'>IdHAL : " + currentStruct.HAL + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
              .append("\n")
             }
             //RNSR
            if(currentStruct.RNSR !== 'nan' & currentStruct.RNSR !== null) {
            container
            .append("<a href='https://appliweb.dgri.education.fr/rnsr/ChoixCriteres.jsp?PUBLIC=OK' target='_blanck'>RNSR : " + currentStruct.RNSR + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
             .append("\n")
              }
             //BnF
            if(currentStruct.BNF !== 'nan' & currentStruct.BNF !== null) {
              container
              .append("<a href='http://catalogue.bnf.fr"+currentStruct.BNF + "' target='_blanck'>BnF : " + currentStruct.BNF + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
              .append("\n")
              }
             //VIAF
            if(currentStruct.VIAF !== 'nan' & currentStruct.VIAF !== null) {
               container
                .append("<a href='http://viaf.org/viaf/"+currentStruct.VIAF + "' target='_blanck'>VIAF : " + currentStruct.VIAF + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
                .append("\n")
               }
            //ISNI
            if(currentStruct.ISNI !== 'nan' & currentStruct.ISNI !== null) {
                container
                 .append("<a href='https://isni.oclc.org/xslt/DB=1.2/SET=2/TTL=1/CMD?ACT=SRCH&IKT=6102&SRT=LST_nd&TRM=ISN%3A"+currentStruct.ISNI + "' target='_blanck'>ISNI : " + currentStruct.ISNI + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></a>")
                .append("\n")
    }
            }
          }
      },
     /* {
      dataField: "id",
      caption: "Alignements",
      allowSorting: false,
      alignment: "left",
      //maxWidth: 100,
      cellTemplate: function(container, options) {
          var currentStruct = options.data;
          if(currentStruct.id != 1 & currentStruct.id != 2 & currentStruct.id != 3) {
       container
      .append($("<span>", { "class": "uk-badge", text: 'Scopus ID : ' + currentStruct.affiliation_id }))
      .append("\n")
    if(currentStruct.ppn_valide !== 'nan' & currentStruct.ppn_valide !== null) {
      container
       //.append($("<span>", { "class": "uk-badge", text: 'Idref : ' + currentStruct.ppn_valide }))
      .append("<a href='https://www.idref.fr/"+currentStruct.ppn_valide + "' target='_blanck'><span class='uk-badge'>Idref : " + currentStruct.ppn_valide + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></span></a>")
      .append("\n")
    }	
  if(currentStruct.HAL !== 'nan' & currentStruct.HAL !== null) {
      container
      .append("<a href='https://aurehal.archives-ouvertes.fr/structure/read/id/"+currentStruct.HAL + "' target='_blanck'><span class='uk-badge'>IdHAL : " + currentStruct.HAL + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></span></a>")
      .append("\n")
  }
  if(currentStruct.RNSR !== 'nan' & currentStruct.RNSR !== null) {
              container
      .append("<a href='https://appliweb.dgri.education.fr/rnsr/ChoixCriteres.jsp?PUBLIC=OK' target='_blanck'><span class='uk-badge'>RNSR : " + currentStruct.RNSR + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></span></a>")
      .append("\n")
  }
  if(currentStruct.BNF !== 'nan' & currentStruct.BNF !== null) {
              container
      .append("<a href='http://catalogue.bnf.fr"+currentStruct.BNF + "' target='_blanck'><span class='uk-badge'>BnF : " + currentStruct.BNF + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></span></a>")
      .append("\n")
  }
  if(currentStruct.VIAF !== 'nan' & currentStruct.VIAF !== null) {
              container
      .append("<a href='http://viaf.org/viaf/"+currentStruct.VIAF + "' target='_blanck'><span class='uk-badge'>VIAF : " + currentStruct.VIAF + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></span></a>")
      .append("\n")
  }
  if(currentStruct.ISNI !== 'nan' & currentStruct.ISNI !== null) {
              container
      .append("<a href='https://isni.oclc.org/xslt/DB=1.2/SET=2/TTL=1/CMD?ACT=SRCH&IKT=6102&SRT=LST_nd&TRM=ISN%3A"+currentStruct.ISNI + "' target='_blanck'><span class='uk-badge'>ISNI : " + currentStruct.ISNI + "<span class='uk-margin-small-right uk-icon' uk-icon='link'></span></span></a>")
      .append("\n")
  }
          
      }
  }
}*/,
  {
    dataField: "document-count-period",
    width: 80,
    sortOrder: "desc",
      }
  ],
  expandedRowKeys: [1, 2, 3]
}).dxTreeList("instance");