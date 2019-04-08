const express = require('express'),
      User    = require('../models/userModel'),
      Menu    = require('../models/menuModel'),
      passport= require('passport'),
      multer  = require('multer'), 
      Blog    = require('../models/blogModel'),
      Icerik  = require('../models/icerikModel'),
      upload  = multer(),
      router  = express.Router();




router.get("/admin",isLoggedIn,(req,res)=>{
    Menu.find({},(err,blnMenu)=>{
        if (err) {
            console.log(err);
        }
    }).then((blnMenu)=>{   
        Blog.find({},(err,blnBlog)=>{
            if (err) {
                console.log(err);
            } 
            res.render('admin/index',{blnMenu:blnMenu,blnBlog:blnBlog});
        });
    });

   
});

router.get("/admin/login",(req,res)=>{
    res.render('admin/login');
});

router.post("/admin/login",passport.authenticate("local",{
    successRedirect : "/admin",
    failureRedirect: "/admin/login"
}),(req,res)=>{});

router.get("/admin/signup",(req,res)=>{
    res.render("admin/signup");
});

router.post("/admin/signup",(req,res)=>{
    let newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if (err) {
            console.log(err);
            res.redirect('/admin/signup');
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/admin");
        });
    });
});

router.get("/admin/logout",(req,res)=>{
    req.logout();
    res.redirect("/admin/login");
});

//Menü işlemleri
router.get("/admin/menu-ekle",isLoggedIn,(req,res)=>{
    res.render("admin/menuAdd");
});
var Storagemenu = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null,"./public/menuImages")
    },
    filename: function(req, file, callback){
        callback(null,file.fieldname + "__" + Date.now() +"__" +  file.originalname);
    }
});
var yukleme = multer({storage:Storagemenu}).single("menuimage");

router.post("/admin/menu-ekle",isLoggedIn,(req,res)=>{
    yukleme(req, res, (err)=>{
        if(err){
            console.log(err);
            return res.end("Biseyler yanlis gitti");
        } 
        else{
            let menuName = req.body.menuname;
            let menuComSentence = req.body.menucomsentence;
            let menuImageName = req.file.filename;
            let newMenu = {
                menuName : menuName,
                menuComSentence: menuComSentence,
                menuImageName:menuImageName
            }
            Menu.create(newMenu)
            .then((newMenu)=>{
            })
            .catch((err)=>{
                console.log(err);
            })
            return  res.redirect("/admin/menu-ekle");
        }
    })  
});

router.get("/admin/menu-goruntule",isLoggedIn,(req,res)=>{
    Menu.find({},(err,menuler)=>{
        if (err) {
            console.log(err);
            res.redirect("/admin");
        }
        res.render("admin/menuShow",{menuler:menuler});
    })
});

router.get("/admin/menu-duzenle/:id",isLoggedIn,(req,res)=>{
    Menu.findById(req.params.id,(err,findingMenu)=>{
        if (err) {
            console.log(err);
            res.redirect("/admin");
        } else {
            res.render("admin/menuUpdate",{findingMenu:findingMenu});
        }
    });
});
router.put("/admin/menuler/:id",isLoggedIn,(req,res)=>{
    yukleme(req, res, (err)=>{
        if(err){
            console.log(err);
            return res.end("Biseyler yanlis gitti");
        } 
        else{
            let menuName = req.body.menuname;
            let menuImageName = req.file.filename;
            let newMenu = {
                menuName : menuName,
                menuImageName:menuImageName
            }
            Menu.findByIdAndUpdate(req.params.id,newMenu,(err,gncMenu)=>{
                if (err) {
                    console.log(err);
                } else {
                    console.log(gncMenu);
                }
            });
            return  res.redirect("/admin/menu-ekle");
        }
    })  
});

router.delete("/admin/menuler/:id",isLoggedIn,(req,res)=>{
    Menu.findByIdAndRemove(req.params.id,(err)=>{
        if (err) {
            console.log(err);
        }
        else{
        res.redirect("/admin/menu-goruntule");
        }
    })
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/admin/login");
}
//Blog Admin işlemleri
var Storageblog = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null,"./public/blogImages")
    },
    filename: function(req, file, callback){
        callback(null,file.fieldname + "__" + Date.now() +"__" +  file.originalname);
    }
});
var yuklemeBlog = multer({storage:Storageblog}).single("comImage");
router.get("/admin/blog-ekle",isLoggedIn,(req,res)=>{
    res.render("admin/blogAdd");
});


router.post("/admin/blog-ekle",isLoggedIn,(req,res)=>{
    yuklemeBlog(req, res, (err)=>{
        if(err){
            console.log(err);
            return res.end("Biseyler yanlis gitti");
        } 
        else{
            let title = req.body.blogTitle;
            let comSentence = req.body.blogComSen;
            let comImage = req.file.filename;
            let blog = req.body.blog;
            
            let newBlog = {
                title:title,
                comSentence:comSentence,
                comImage:comImage,
                blog:blog
            }
            Blog.create(newBlog)
            .then((newBlog)=>{
                console.log(newBlog);
            })
            .catch((err)=>{
                console.log("===========Error=============");
                console.log(err);
                res.send(err);
            });
            return  res.redirect("/admin/blog-ekle");
        }
    })  
});

router.get("/admin/blog-goruntule",isLoggedIn,(req,res)=>{
    Blog.find({},(err,bloglar)=>{
        if (err) {
            console.log(err);
            res.redirect("/admin");
        }
        res.render("admin/blogShow",{bloglar:bloglar});
    })
});

router.get("/admin/blog-duzenle/:id",isLoggedIn,(req,res)=>{
    Blog.findById(req.params.id,(err,bulunanBlog)=>{
        if (err) {
            console.log(err);
            res.redirect("/admin");
        } else {
            res.render("admin/blogUpdate",{bulunanBlog:bulunanBlog});
        }
        
    });
});

router.put("/admin/bloglar/:id",isLoggedIn,(req,res)=>{
    yuklemeBlog(req, res, (err)=>{
        if(err){
            console.log(err);
            return res.end("Biseyler yanlis gitti");
        } 
        else{
            let title = req.body.blogTitle;
            let comSentence = req.body.blogComSen;
            let comImage = req.file.filename;
            let blog = req.body.blog;
            
            let newBlog = {
                title:title,
                comSentence:comSentence,
                comImage:comImage,
                blog:blog
            }
            Blog.findByIdAndUpdate(req.params.id,newBlog,(err,gncBlog)=>{
                if (err) {
                    console.log(err);
                } else {
                    console.log(gncBlog);
                }
            });
            return  res.redirect("/admin/blog-goruntule");
        }
    })  
});

router.delete("/admin/bloglar/:id",isLoggedIn,(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if (err) {
            console.log(err);
        }
        else{
        res.redirect("/admin/blog-goruntule");
        }
    })
});
// İçerik İşelemleri
router.get("/admin/icerik-ekle",isLoggedIn,(req,res)=>{
    Menu.find({},(err,blnMenu)=>{
        if (err) {
            console.log(err);
        }
        res.render("admin/icerikAdd",{blnMenu:blnMenu});
    })
 
});

router.post("/admin/icerik-ekle",isLoggedIn,(req,res)=>{
    let icerikTitle = req.body.data.icerikTitle;
    let icerik      = req.body.data.icerik;
    let menu = { id:req.body.data.menuid,menuName:req.body.data.menuname};

    let newIcerik = {
        icerikTitle:icerikTitle,
        icerik:icerik,
        menu:menu
    }
    Icerik.create(newIcerik)
    .then((newIcerik)=>{
        console.log(newIcerik);
    })
    .catch((err)=>{
        console.log("===========Error=============");
        console.log(err);
        res.send(err);
    });
    return  res.redirect("/admin/icerik-ekle");

});

router.get("/admin/icerik-goruntule",isLoggedIn,(req,res)=>{
    Icerik.find({},(err,blnIcerik)=>{
        if (err) {
            console.log(err);
        }
        res.render("admin/icerikShow",{blnIcerik:blnIcerik});
    });
});

router.get("/admin/icerik-duzenle/:id",isLoggedIn,(req,res)=>{
    Icerik.findById(req.params.id,(err,blnIcerik)=>{
        if (err) {
            console.log(err);
        }
        Menu.find({},(err,blnMenu)=>{
            res.render("admin/icerikUpdate",{blnIcerik:blnIcerik,blnMenu:blnMenu});
        });
      
    });
});

router.put("/admin/icerikler/:id",isLoggedIn,(req,res)=>{
    let icerikTitle = req.body.data.icerikTitle;
    let icerik      = req.body.data.icerik;
    let menu = { id:req.body.data.menuid,menuName:req.body.data.menuname};

    let newIcerik = {
        icerikTitle:icerikTitle,
        icerik:icerik,
        menu:menu
    }
    Icerik.findByIdAndUpdate(req.params.id,newIcerik,(err,gncIcerik)=>{
        if (err) {
            console.log(err);
        } else {
            res.redirect("/admin/icerik-goruntule");
        }
    });
});

router.delete("/admin/icerikler/:id",isLoggedIn,(req,res)=>{
    Icerik.findByIdAndRemove(req.params.id,(err)=>{
        if (err) {
            console.log(err);
        }
        res.redirect("/admin/icerik-goruntule");
    });
});


module.exports = router;