//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
var items =[];

app.get("/", (req, res) => {
  
  var options = {
    weekday : 'long',
    month : 'long',
    day : 'numeric'
  }
  var today = new Date();
  today.setDate(today.getDate());
  var todayIs = today.toLocaleDateString("en-US", options);

  res.render("list", { dayOfTheWeek: todayIs, newTodo : items });

});

app.post("/", (req, res)=>{
  var item = req.body.newTodo;
  items.push(item);
  res.redirect('/');
});


app.get("/about", (req,res) =>{
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
