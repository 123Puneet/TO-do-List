
exports.getdate = function(){
  var today = new Date();
  var options = {
    weekday : "long",
    day : "numeric",
    month : "long",
    year : "numeric"
  };
  return  today.toLocaleDateString("en-UK", options);

}

exports.getDay= function(){
  let today = new Date();
  let options = {
    weekday : "long"
  };
  return today.toLocaleDateString("en-UK", options);
}
