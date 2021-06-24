//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true, useNewUrlParser: true });


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
      res.render("list", { dayOfTheWeek: "Today", newTodo : foundItems });
    }
    });
});

app.post("/", (req, res)=>{
  let item = req.body.newTodo;
  items.push(item);
  res.redirect('/');
});

app.get("/about", (req,res) =>{
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
