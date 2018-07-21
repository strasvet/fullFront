const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const multer = require("multer");
const listFiles = require("../list-files");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongodb = require("mongodb");

const app = express();



app.set("view engine", "ejs");

/*function sendBookInfo(response, book) {
    response.send(`Book: ${book.author} "${book.title}"`);
}*/

function sendAlbumsList(request, response) {
    listFiles("pic", (f, stats) => stats.isDirectory()).then(a => response.send(a));
}

const flt = [".jpeg", ".jpg", ".png"];

function sendPhotosList(request, response) {
    //eto vse params posle /album/
    //listFiles(`pic/${request.params.album}`, (f) => f.endsWith(".jpg")).then(
    listFiles(`pic/${request.params.album}`, (f) => f => /\.jpe?g$/i.exec(f)).then(
        //listFiles(`pic/${request.params.album}`, (f) => flt.includes(f.substring(f.lastIndexOf(".")))).then(
        a => response.send(a), console.error);
}

function sendFile(request, response) {
    //eto vse params posle /album/
    // \.jpg$ - $ - v konce, \. - ekraniruem tochku \ ? - mozet bit mozet ne bit
    // \.jpe?g$ - $ - v konce, \. - ekraniruem tochku \ e? - mozet bit mozet ne bit /i - nezavisimiy registr
    // \.jpe?g$/i

    //const pathF = `pic/${request.params.album}/${request.params.file}`;
    //listFiles(`pic/${request.params.album}`, (f) => f === `${request.params.file}` && f.endsWith(".jpg")).then(a =>
    //listFiles(`pic/${request.params.album}`, (f) => f === `${request.params.file}` && flt.includes(f.substring(f.lastIndexOf(".")))).then(a =>
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
//app.get("/hello", (request, response) => response.send("Hello,world!"));
//app.get("/book", (request, response) => sendBookInfo(response, request.query));
//app.post("/book", (request, response) => sendBookInfo(response, request.body));
app.get("/album", sendAlbumsList);
app.get("/album/:album", sendPhotosList);
app.get("/album/:album/:file", sendFile);
//http://localhost:8000/book?author=Tolstoy&title=books!
//request.query = {author: "",title:""}
app.use(passport.initialize());
app.use(passport.session());

app.use((request,response, next)=> {
    response.locals.isAuthenticated = request.isAuthenticated();
    next();
});
//const users = [{id: "1", username: "abc", password: "123"}, {id: "2", username: "root", password: "root"}];
//const users = [{id: 1, username: "abc", password: "123"}, {id: 2, username: "root", password: "root"}];
let users;

mongodb.MongoClient.connect("mongodb://levbase:levbase21@ds139251.mlab.com:39251/levbase", {useNewUrlParser: true}).then(client=>{
    console.log("Connected to mlab MongoDB");
    users = client.db("levbase").collection("users");
});
passport.use(new LocalStrategy((username, password, cb) =>
                                                    //this, oshibok net
                                                //user podstavitsya is promise then()
    //users.findOne({username, password}).then(cb.bind(null, null), cb)));
    users.findOne({username, password}).then(cb.bind(null, null), cb)));

    //description
    //users.findOne({username, password}).then(users=>cb(null,user).catch(onError));
    //users.findOne({username, password}).then(onSuccess).catch(onError));
    //users.findOne({username, password}).then(onSuccess, onError));


//const usersByUsername = users.reduce((acc,v)=>{acc[v.username] = v; return acc;}, {}); //sozdali noviy massiv username{userObj}
//{
//userByName = {};
//usersByName["abc"] = {id:"1",username: "abc", password:"123"};
//usersByName["abc"] = {id:"1",username: "abc", password:"123"};
//}


/*
//-------
function addToMap(keyFieldName, map, value) {
    map[value[keyFieldName]] = value;
    return map;
}
const usersByUsername = users.reduce(addToMap.bind(null, "username"), {});
const usersById = users.reduce(addToMap.bind(null, "id"), {});
passport.use(new LocalStrategy((username, password, cb) => {
    const u = usersByUsername[username];
    (u && (u.password === password)) ? cb(null, u) : cb(null, false);
}));
//----
*/

//---
//passport.serializeUser((u, cb) => cb(null, u.id));
passport.serializeUser((u, cb) => cb(null, u._id));
//passport.deserializeUser((id, cb) => usersById[id] ? cb(null, usersById[id]) : cb(new Error("User not found")));
function deserializeUser(userId, callback) {
    //null - oshibka, user : inache // sozdaem error i , vizivaem
    users.findOne({_id: new mongodb.ObjectID(userId)}).then(u => u? callback(null,u): callback(new Error("User not found"), callback));  //v mongo db Id v vide object
}
passport.deserializeUser(deserializeUser);
//alternate variant/
//app.get("/album/:album/:file",(request, response)=>response.sendFile(`${request.params.album}/${request.params.file}`));

const storageConfig = {
    destination: (request, file, cb) => cb(null, `pic/${request.body.album}`),
    filename: (request, file, cb) => cb(null, file.originalname)
};

const mimeTypes = ["image/jpeg", "image/png"];

/*
const multerConfig = {                  //est li oshibka - null//file-type
    //destination: ""
    //fileFilter: (request, file, cb)=> cb(null,file.mimetype == "image/jpeg"),
    fileFilter: (request, file, cb)=> cb(null,mimeTypes.includes(file.mimetype)),
    storage: multer.diskStorage(storageConfig)
};*/
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
//app.post("/addPhoto", (request, response) => upload(null, request, response));

app.get("/myPage.html", (request, response) => response.render("myPage"));
//app.get("/addPhoto.html", (request, response) => response.render("addPhoto"));
//app.get("/addPhoto.html", (request, response) => {response.locals.isAuthenticated = request.isAuthenticated() ? response.render("addPhoto"): response.render("login")});
app.get("/addPhoto.html", (request, response) => {request.isAuthenticated() ? response.render("addPhoto"): response.render("login")});
app.get("/login.html", (request, response) => response.render("login"));

const authConfig = {successRedirect: "myPage.html", successFlash: "Welcome!",
    failureRedirect: "login.html", failureFlash: "Invalid credentials"};

const authenticator = passport.authenticate("local", authConfig);
app.post("/login", authenticator);
/*

app.get("/logout", function (req,res) { //v etom sluchae seesiya sohranyaetsya
    req.logout();
    res.redirect('/');
});
*/


function logout(request, response){
    request.session.destroy(()=> response.redirect("/")); //unichtozayem seesion
}
app.get("/logout",logout);
app.get("/register.html",(request,response)=>response.render("register"));
/*
function registerNewUser(request, response, next){
    const username = request.body.username;
    const password = request.body.password;
    if(usersByUsername[username]){
        request.flash("error", "Username"+`${username}` + username +" already exits/is already in use");
        response.redirect("back");
    } else {
     //const newUser = {id:users.length, username:username, password:password};
     const newUser = {id:users.length, username, password};

     usersByUsername[username] = newUser;
     //usersById[newUser["id"]] = newUser;
     // delete newUser.id // udalyaet id key and value
     usersById[newUser.id] = newUser;
     users.push(newUser);
     authenticator(request,response,next);
    }
}*/

function registerNewUser(error, foundUser){
    if(error || foundUser){
        this.request.flash("error", error || `Found user: ${foundUser.username} already exits/is already in use`);
        this.response.redirect("back");
    }else{
        const {username,password} = this.request.body;
        users.insertOne({username,password}, userInsertionFinished.bind(this));
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
/*app.post("/register",(request,response, next)=>{
    registerNewUser(request,response);
    authenticator(request,response,next);
});*/

//app.post("/register",registerNewUser())

app.post("/register",(request,response,next)=>{
        users.findOne({username: request.body.username},registerNewUser.bind({request,response,next}));
});

app.listen(8000);









