$(function () {
    if ($("#source").val() === undefined){
        console.log("no")
    }
    else {
        console.log($("#source").val())
    }
    var orderKeys = ["Editeur","Editeur et archives ouvertes","Archives ouvertes","Accès fermé"]

    function chainedAjax(a) {
        $.ajax({
            type: "GET",
            url: "./agg/docs/oa_type_normalized?level=" + $("#source").val() + "&id=" + $("#id").val(),
            dataType: 'json',
            success: function(data) {
                final_array = a.concat(object2array(data));
                console.log(final_array)
                return nestedDonut("oa_obs_nesteddonut",final_array)
            }
          });
    }

    $.ajax({
        type: "GET",
        url: "/agg/docs/is_oa?level=" + $("#source").val() + "&id=" + $("#id").val(),
        dataType: 'json',
        success: function (data) {
            return donut3D("oadonut", object2array(data))
        }
    });
    $.ajax({
        type: "GET",
        url: "/agg/docs/oa_status?level=" + $("#source").val() + "&id=" + $("#id").val(),
        dataType: 'json',
        success: function (data) {
            return semicircle("oasemicircle",object2array(data).filter(function (d) {
                return d.key != "closed"
            }))
        }
    });
    $.ajax({
        type: "GET",
        url: "/group/docs/year,is_oa_normalized?level=" + $("#source").val() + "&id=" + $("#id").val(),
        dataType: 'json',
        success: function (data) {
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
            return stackedarea("docyearstacked", object2array(data).map(function (d) {
                return flatObject(d)
            })),
            stackedbar100percent("docyearstackedrelative", result,uniqueKeys)
        }
    });
    // details
    $("#gridContainer").dxDataGrid({
        dataSource: new DevExpress.data.CustomStore(
            {
                //key: "doc_id",
                loadMode: "raw",
                load: function () {
                    return $.ajax({
                        type: "GET",
                        url: "/detail/docs?level=" + $("#source").val() + "&id=" + $("#id").val(),
                        dataType: 'json',
                        success: function (data) {
                            return data
                        }
                    });
                }
            }
        ),
        repaintChangesOnly: true,
        showBorders: true,
        columnAutoWidth: true,
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
            fileName: "docs_" + $("#source").val() + "_" + $("#id").val()
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
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columns: [
            {
                dataField: "doi",
                caption: "DOI",
                alignment: "left"
            },
            {
                dataField: "genre",
                caption: "Type doc"
            },
            {
                dataField: "title",
                caption: "Titre",
                visible: false
            },
            {
                dataField: "year",
                caption: "Date"
            },
            {
                dataField: "crossref_publisher",
                caption: "Editeur"
            }, {
                dataField: "journal_name",
                caption: "Journal"
            }, {
                dataField: "journal_issn_l",
                caption: "Journal ISSN"
            }, {
                dataField: "is-referenced-by-count",
                caption: "Nombre de citations"
            }, {
                dataField: "is_oa_normalized",
                caption: "OA"
            }, {
                dataField: "oa_status",
                caption: "OA statut"
            },  {
                dataField: "oa_type_normalized",
                caption: "OA Type"
            },
            {
                dataField: "oa_repo_normalized",
                caption: "Localisations"
            },
            {
                dataField: "funders",
                caption: "Financements"
            },
        ]
    });
})
