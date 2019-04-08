const express           = require("express"),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      passport          =  require("passport"),
      methodOverride		= require('method-override'),
      expressSession    = require("express-session"),
      LocalStrategy     = require("passport-local"),
      User              = require('./models/userModel'),
      Blog              = require('./models/blogModel'),
      app               = express();

//App Config
mongoose.connect('mongodb://localhost/denemeBlog');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Passport Config
app.use(expressSession({
    secret:"Guvenlik cumlesi",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Share current user info within all routes
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

//Routes
const adminRoutes = require('./routes/adminRoutes');
const indexRoutes = require("./routes/indexRoutes");

//Routes using
app.use(adminRoutes);
app.use(indexRoutes);




const server = app.listen(5000,(err)=>{
    if (err) {
        console.log(err);
    } else {
        console.log("Port : %d",server.address().port);
    }
})