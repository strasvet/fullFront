const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const multer = require("multer");
const listFiles = require("../list-files");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");

const app = express();



app.set("view engine", "ejs");

/*function sendBookInfo(response, book) {
    response.send(`Book: ${book.author} "${book.title}"`);
}*/

function sendAlbumsList(request, response) {
    listFiles("pic", (f, stats) => stats.isDirectory()).then(a => response.send(a));
}

function sendPhotosList(request, response) {
    listFiles(`pic/${request.params.album}`, (f) => f => /\.jpe?g$/i.exec(f)).then(
        a => response.send(a), console.error);
}

function sendFile(request, response) {
    listFiles(`pic/${request.params.album}`, (f) => f === `${request.params.file}` && /\.jpe?g$/i.exec(f)).then(a =>
        response.sendFile(__dirname + "/pic/" + `${request.params.album}/${request.params.file}`), console.error);
}

//app.use(bodyParser.urlencoded({extended: false}), bodyParser.json()); //extended false = key=value; true=

const sessionConfig = {saveUninitialized: true, resave: false, secret: "abc"};
app.use(session(sessionConfig));
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}), bodyParser.json());
app.use(express.static("./public"));

app.use((request, response, next) => {
    response.set("Access-Control-Allow-Headers", "Content-type");
    response.set("Access-Control-Allow-Origin", "*");
    next();
})


app.get("/", (request, response) => response.redirect("myPage.html"));
app.get("/album", sendAlbumsList);
app.get("/album/:album", sendPhotosList);
app.get("/album/:album/:file", sendFile);
app.use(passport.initialize());
app.use(passport.session());

app.use((request,response, next)=> {
    response.locals.isAuthenticated = request.isAuthenticated();
    next();
});

let users;

mongodb.MongoClient.connect("mongodb://levbase:levbase21@ds139251.mlab.com:39251/levbase", {useNewUrlParser: true}).then(client=>{
    console.log("Connected to mlab MongoDB");
    users = client.db("levbase").collection("users");
});
/*
passport.use(new LocalStrategy((username, password, cb) =>
                                                //this.null,err.null/user, cb.error
    users.findOne({username, password}).then(cb.bind(null, null), cb)));
*/


//mean

//mongo db - server
//express - server
//angular -client
//nodeJS - server

//mysql, postregSQL


// return delete poprobivat udalit
passport.use(new LocalStrategy(function (username, password, done) {
    users.findOne({username:username},function (err, user) {
        if(err){return done(err);}
        if(!user){return done(null, false, { message: 'Incorrect username.' });}

        if(user){
        return bcrypt.compare(password, user.password,(error,result)=>{
            if(result === true){
                //console.log(user.password);
                return done(null,user);
            }else{
                //console.log('user.password from error: ',user.password);
                //console.log("result: ",result);
                return done(null, false, { message: 'Incorrect password.' });
            }})
        }
        //and this works, but not chek passHash
        //if(user){return done(null,user);}

        //if (!user.validPassword(password)){return done(null, false, { message: 'Incorrect password.' });}
        return done(null, false, { message: 'Incorrect password.' });
    });
}));

/*users.findOne({username}).then(user=>bcrypt.compare(password, user.password,(error,result)=>{
    if(result === true){
        return user;
    }else if(result === false){
        console.log("found user,but password incorrect");
    }else{
        return error;
    }
}),error)));*/

passport.serializeUser((u, cb) => cb(null, u._id));
function deserializeUser(userId, callback) {
    users.findOne({_id: new mongodb.ObjectID(userId)}).then(u => u? callback(null,u): callback(new Error("User not found"), callback));  //v mongo db Id v vide object
}
passport.deserializeUser(deserializeUser);
const storageConfig = {
    destination: (request, file, cb) => cb(null, `pic/${request.body.album}`),
    filename: (request, file, cb) => cb(null, file.originalname)
};
const mimeTypes = ["image/jpeg", "image/png"];

function fileFilterM(request, file, callback) {
    (file.mimetype === "image/jpeg") ? callback(null, true) : callback("JPEG file expected")
}

const multerConfig = {storage: multer.diskStorage(storageConfig), fileFilterM};

const upload = multer(multerConfig).single("photo");//vozvrashaey vinkcuu kotoraya prinimaet request\response

function photoAdded(request, response, error) {
    if (error) {
        constructor.error(error);
        request.flash("error", `Error adding photo: ${error}`);
        //request.attr("error", "Error adding photo");
        //request.flash("error"); - udalyaet oshibku
        response.redirect("addPhoto.html");
    } else {
        request.flash("success", "Photo addes successfully");
        response.redirect("/myPage.html");
    }
}

//
app.post("/addPhoto", (request, response) => upload(request, response, photoAdded.bind(null, request, response)));
app.get("/myPage.html", (request, response) => response.render("myPage"));
app.get("/addPhoto.html", (request, response) => {request.isAuthenticated() ? response.render("addPhoto"): response.render("login")});
app.get("/login.html", (request, response) => response.render("login"));

const authConfig = {successRedirect: "myPage.html", successFlash: "Welcome!",
    failureRedirect: "login.html", failureFlash: "Invalid credentials"};

const authenticator = passport.authenticate("local", authConfig);
app.post("/login", authenticator);

function logout(request, response){
    request.session.destroy(()=> response.redirect("/")); //unichtozayem seesion
}
app.get("/logout",logout);
app.get("/register.html",(request,response)=>response.render("register"));

function registerNewUser(error, foundUser){
    if(error || foundUser){
        this.request.flash("error", error || `Found user: ${foundUser.username} already exits/is already in use`);
        this.response.redirect("back");
    }else{
        bcrypt.hash(this.request.body.password, 12, ((error,hash)=>{
            if(!error){
                //saveuserTobase
                const insertableUser = {"username":this.request.body.username,"password":hash};
                //insert one return results:id
                users.insertOne({username:insertableUser.username,password:insertableUser.password}, userInsertionFinished.bind(this));
            } else{
                return error;
            }
        }));



    }

}
function userInsertionFinished(error){
    if(error){
        this.request.flash("error", error);
        this.response.redirect("back");
    }else{
        authenticator(this.request, this.response, this.next);
    }
}
app.post("/register",(request,response,next)=>{
        users.findOne({username: request.body.username},registerNewUser.bind({request,response,next}));
});
app.listen(8000);









