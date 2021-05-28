//jshint esversion:6
const express = require("express");
const date = require(__dirname+"/date.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const items =[];


app.get("/", (req, res) => {
  
  let day = date.getDate();

  res.render("list", { dayOfTheWeek: day, newTodo : items });

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
