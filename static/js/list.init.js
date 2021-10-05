$('#search_aff').on("keyup", function () {
    var search = this.value;
    console.log(search)
    $(".list_aff").show().filter(function () {
      return $(".name_aff", this).text().indexOf(search) < 0;
  }).hide(); 
  });