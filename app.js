//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://JuanUrdaneta:admin@cluster0.cyltp.mongodb.net/todolistDB", { useUnifiedTopology: true, useNewUrlParser: true });


//Items Schema and Model MONGOOSE

const itemsSchema = new mongoose.Schema({
  name : String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name : "Welcome!"
});


const item2 = new Item({
  name : "Press the + button to add a new item"
});

const item3 = new Item({
  name : "<--- Press this button to delete an item"
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const defaultItems = [item1, item2, item3];


app.get("/", (req, res) => {

  //GETTING THE ITEMS FROM THE DATABASE
  Item.find({}, (err, foundItems) =>{
    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else{
          console.log("Items added succesfully!");
        }
      });
      res.redirect("/");      
    } else{
      res.render("list", { listTitle: "Today", newTodo : foundItems });
    }
    });
});

app.post("/", (req, res)=>{
  const itemName = req.body.newTodo;
  const listName = req.body.list;
  console.log(listName);

  const newItem = new Item({
    name : itemName
  })

  if(listName == "Today"){
    newItem.save().then(res.redirect("/"));
  } else {
    List.findOne({name: listName}, (err, foundList) =>{
      if(!err){
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+listName);
      }
    })
  }


});

app.post("/delete", (req, res) =>{
  const checkedId = req.body.checkBox;
  const listName = req.body.listName;

  if(listName == "Today"){
    Item.findByIdAndRemove(checkedId, (err) =>{
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    })
  } else{
    List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checkedId}}}, (err, foundList)=>{
          if(!err){
            res.redirect("/"+listName);
          }
    });
  }


})

app.get("/:customListName", (req, res) =>{
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);


  List.findOne({name: customListName}, (err, foundList)=>{
    if(!err){
      if(!foundList){
        // IF THE LIST DOESNT EXISTS, THEN WE CREATE A NEW LIST
        const list = new List({
        name : customListName,
        items: defaultItems
        })
        list.save()
        res.redirect("/"+customListName);
      } else{
        // IF THE LIST ALREADY EXIST THEN WE SHOW THE LIST
        res.render("list", { listTitle: foundList.name, newTodo : foundList.items });

      }
    }
    
  })

});

app.get("/about", (req,res) =>{
  res.render("about");
});

//IF PORT IS ON HEROKU THEN USE THEIR PORT, ELSE JUST USE LOCALHOST:3000

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, () => {
  console.log("Server started succesfully");
});
