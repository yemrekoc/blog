const  express = require('express'),
       Blog    = require('../models/blogModel'),
       Menu    = require('../models/menuModel'),
       Icerik  = require('../models/icerikModel'),
       router  = express.Router();


router.get('/',(req,res)=>{
    Blog.find({},(err,foundBlogs)=>{
        if (err) {
            console.log(err);
        } 
        Menu.findOne({'menuName':"Ana Sayfa"},(err,foundMenus)=>{
            if (err) {
                console.log(err);
            } 
            res.render("home/index",{foundBlogs:foundBlogs,foundMenus,foundMenus});
        });
    });
});

router.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{

        res.render("home/blog",{foundBlog:foundBlog});
    });

});

router.get('/resume',(req,res)=>{
    res.render("resume/resume");
});

module.exports = router;