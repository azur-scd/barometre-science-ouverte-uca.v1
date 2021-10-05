function object2array (obj){
    //transfo d'un objet {key1:value1,key2:value2...} à un array [{key:key1,value:value1},{key:key1,value:value2}...]
    var arr = []
    Object.keys(obj).forEach(function(key){
     var value = obj[key];
     arr.push({"key":key,"value":value})});
     return arr;
}

function flatObject (obj) {
   return Object.assign(
        {}, 
        ...function _flatten(o) { 
          return [].concat(...Object.keys(o)
            .map(k => 
              typeof o[k] === 'object' ?
                _flatten(o[k]) : 
                ({[k]: o[k]})
            )
          );
        }(obj)
      )
}