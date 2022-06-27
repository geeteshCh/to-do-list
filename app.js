const express=require('express');
const bodyParser=require('body-parser');

app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

items=["hello"];
workItems=[];

app.get("/", function(req, res){
    var now = new Date();
    var today=now.getDay();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today  = new Date();
    

    today=today.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
    res.render("list", {Today: today ,  Items: items, Path: "/"});
})
app.post("/", function(req, res){
    var item=req.body.newItem;
        items.push(item);
        res.redirect("/");
})

app.get("/work", function(req, res){
    res.render("list", {Today: "workList" ,  Items: workItems, Path: "/work"});
})

app.post("/work", function(req, res){
    var item=req.body.newItem;
        workItems.push(item);
        res.redirect("/work");
})


const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});