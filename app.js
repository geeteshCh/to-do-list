// BOILERPLATE
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const _ = require('lodash');

app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/todoDb');


// SCHEMAS
const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items : [itemSchema]
})

const List = mongoose.model('List', listSchema);


// ROUTES



const item1 = new Item({
    name: "secret item"
})

// item1.save();

app.get("/", function(req, res){
    var now = new Date();
    var today=now.getDay();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today  = new Date();
    
    today=today.toLocaleDateString("en-US", options);
    var lists=[];
    List.find({}, function(err, foundLists){
        if(err){
            console.log(err);
        }
        else{
            for(var i=0;i<foundLists.length;i++){
                lists.push(foundLists[i].name);
            }
            console.log(lists);
            Item.find({}, function(err, foundItems){
                res.render("list", {Today: today ,  Items: foundItems, Path: "/",Lists:lists});
            })
        }
    })
    
    // Saturday, September 17, 2016
    
})

app.post("/", function(req, res){
    Item.insertMany([{name: req.body.newItem}], function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("item added sucessfully");
        }
    });
        res.redirect("/");
})

app.post("/delete", function(req, res){
    Item.deleteOne({_id: req.body.checkbox}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("item deleted Sucessfully");
        }
    });
    res.redirect("/");
})



app.get("/:id", function(req, res){
    var route = _.capitalize(req.params.id);
    var itemNames=[];
    List.find({name: route}, function(err, foundList){
        if(!foundList.length)
        {
            const list=new List({
                name: route,
                items: []
            });
            list.save();
            
            res.render("list", {Today: route,  Items: itemNames, Path:"/"+route});
        }    
        else{
            var foundItems=foundList[0].items;
            console.log(foundItems);
            for(var i=0;i<foundItems.length;i++){
                itemNames.push(foundItems[i]);
            }
            console.log(itemNames);
            res.render("list", {Today: route,  Items: itemNames, Path:"/"+route});
         }      
    });
    
})

app.post("/:id", function(req, res){
    var item=req.body.newItem;
    var route = req.params.id;
        List.find({name: route}, function(err, foundList){
            foundList[0].items.push({name: item});
            foundList[0].save();
        })
        res.redirect("/"+route);
})


app.post("/delete/:id", function(req, res){
    var itemId=req.body.checkbox;
    var route = req.params.id;
    List.find({name: route}, function(err, foundList){
        if(err){
            console.log(err);
        }
        else{
            var listItems=foundList[0].items;
            var index = listItems.indexOf({_id: itemId});
            listItems.splice(index, 1);
            foundList[0].save();
            console.log("item deleted Sucessfully");
            console.log(listItems);
            res.redirect("/"+route);
        }
    })
    
})
const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});