const express = require('express');
const mongoose = require('mongoose');
const bodyPar = require('body-parser');
const _ = require("lodash");
// const date = require(__dirname+"/date.js")
const app =express();
// const items =["Buy Food","Cook Food", "Eat Food"];
// let workItem =[];
app.use(bodyPar.urlencoded({extended : true}));

app.set("view engine", "ejs");
app.use(express.static('public'));
app.listen(3000, function(){
  console.log("Running on Port 3000");
})
// mongoose.connect('mongodb://127.0.0.1:27017/toDoListDB');
mongoose.connect('mongodb+srv://anuj1302:anuj1302@cluster0.0azkbfm.mongodb.net/toDoListDB');
const itemSchema = new mongoose.Schema({
  name : String
});
const Item = mongoose.model('Item', itemSchema);
const item1 = new Item({
  name : "Welcome to our ToDo List"
});
const item2 = new Item({
  name : "Press + To add new Items in the list"
});
const item3 = new Item({
  name : "<-- Hit this to delete this item"
});
const arr = [item1, item2, item3];
// Item.insertMany(arr);
app.get("/", function(req, res){
  // var today = new Date();
  // var options = {
  //   weekday : "long",
  //   day : "numeric",
  //   month : "long",
  //   year : "numeric"
  // };
  // var day = today.toLocaleDateString("hi-IN", options);


  // let day = date.getdate();
  // console.log(day);

  Item.find().then(function(newArr){
      if(newArr.length ===0){
        Item.insertMany(arr);
        res.redirect("/");
      }
      else{
        res.render("list", {ListTitle: "Today",  AddnewItem: newArr});
      }
  })

});
const listSchema = new mongoose.Schema({
  name : String,
  items : [itemSchema]
});
const List = mongoose.model("List", listSchema);

// app.get("/work", function(req, res){
//   res.render("list", {ListTitle : "Work List", AddnewItem: workItem});
// })
app.get("/:collectionlist", function(req, res){
  const collection = _.capitalize(req.params.collectionlist);
  // console.log(collection);
  List.findOne({name : collection}).then(function(listzz){
    if(!listzz){
      const list = new List({
        name : collection,
        items : arr
      })
      list.save();
      res.redirect("/"+collection)
    }
    else{
      res.render("list", {ListTitle : listzz.name, AddnewItem: listzz.items});
    }
  })

})

app.post("/", function(req, res){

  var itemName = req.body.inp;
  const listName = req.body.list;
  const item = new Item({
    name : itemName
  })
  if(listName === 'Today'){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name : listName}).then(function(listzzz){
      listzzz.items.push(item);
      listzzz.save();
      res.redirect("/"+listName);
    });
  }
})
app.post("/delete", function(req,res){
  const deletebyId = req.body.checkbox;
  const selectlist = req.body.ListName;

  if(selectlist === 'Today'){
    Item.deleteOne({_id: deletebyId }).then(result => console.log(result))
      .catch(err => console.log(err));
      res.redirect("/")
  }else{
    List.findOneAndUpdate({name: selectlist}, {$pull: {items: {_id: deletebyId}}}, {new : true}).then(updatedDoc => {
    // Handle the updated document
  })
  .catch(err => {
    // Handle any errors
  });
  res.redirect("/"+selectlist)
  }

})

app.get("/about", function(req, res){
  res.render("about")
})
