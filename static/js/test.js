$(function(){ 
var orderKeys = ["Editeur","Editeur et archives ouvertes","Archives ouvertes","Accès fermé"]

    $.ajax({
      type: "GET",
      url: "/group/publis/oa_type_normalized,is-referenced-by-count",
      dataType: 'json',
      success: function(data) {
        console.log(object2array(data).map(function(d){          
          return {"global_key":d["key"],"max":Math.max(...Object.values(d["value"])),
          "mix":Math.min(...Object.values(d["value"])),"mean":Math.avg(...Object.values(d["value"]))}
        }))
          //console.log(object2array(data))
        result = object2array(data).map(function (d) {
          return flatObject(d)
      })
  }
  })
})