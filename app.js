var express = require('express'),
    methodOverride = require('method-override'),
    // expressSanitizer = require('express-sanitizer'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');


// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restblog", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressSanitizer);
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));

//Mongoose/Model config
var blogScheam = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now },
})
var Blog = mongoose.model('Blog', blogScheam);

//RESTFUL ROUTES
// Blog.create({
//     title: "First blog",
//     image: "http://images6.fanpop.com/image/photos/35800000/space-best-club-ever-35883904-1920-1080.jpg",
//     body: "This is the first blog created to test if mongoose is working correctly",
// });


app.get('/', (req, res) => {
    res.redirect('/blogs');
});

//INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { blogs: blogs });
        }
    });

});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});


//CREATE ROUTE
app.post("/blogs", (req, res) => {
    //Create blog
    //req.body.blogs.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            //redirect to all blogs
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    //req.body.blogs.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    //destroy
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    //redirect
});

app.listen(3000, () => {
    console.log("Server has started");
});