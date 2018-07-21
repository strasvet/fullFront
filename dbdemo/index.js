const mysql = require("mysql");

const mysqlClient = mysql.createConnection({host:"localhost",user: "root",password: "root", database:"albums"});

/*
mysqlClient.query("SELECT * from albums", (error, rows) => {
    for(const r of rows){
        console.log(`Album[id=${r.album_id},name=${r.album_name}]`);
    }
});
*/
/*

mysqlClient.query("SELECT * FROM photos", (error,rows) =>{
    for (const r of rows){
        console.log(r.photo_filename);
    }
})
*/


/*
mysqlClient.query("SELECT * FROM photos WHERE album_id IN (SELECT album_id FROM albums WHERE album_name='Prague')", (error,rows)=>{
    for (const r of rows){
        console.log(r.photo_filename);
    }
})
*/

/*mysqlClient.query("SELECT * FROM photos NATURAL JOIN albums WHERE album_name='Prague'", (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        console.log(r.photo_filename);
    }
})*/

/*mysqlClient.query("SELECT photo_filename, album_name FROM photos INNER JOIN albums ON photos.album_id=albums.album_id", (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        console.log(r.photo_filename, r.album_name);
    }
})*/

/*
mysqlClient.query("SELECT * FROM photos, albums WHERE photos.album_id=albums.album_id AND albums.album_id=1", (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        //console.log(r.photo_filename, r.album_name);
        console.log(r.album_name, r.photo_filename);
    }
})*/
/*
let albumId = "1";
mysqlClient.query("SELECT * FROM photos WHERE album_id="+albumId, (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        //console.log(r.photo_filename, r.album_name);
        console.log(r.photo_filename);
    }
})*/

//protiv SQL injection
/*
let albumId = "1";
mysqlClient.query("SELECT * FROM photos WHERE album_id=?",[albumId], (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        //console.log(r.photo_filename, r.album_name);
        console.log(r.photo_filename);
    }
})*/

/*let albumId = "1 OR TRUE; #";
//SQL INJECTION!!!
mysqlClient.query("SELECT * FROM photos WHERE album_id="+ albumId, (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        //console.log(r.photo_filename, r.album_name);
        console.log(r.photo_filename);
    }
})*/
/*
mysqlClient.query("INSERT photos VAlUES(?,?)",[1,"abc.jpg"]);

let albumId = "1";
//SQL INJECTION!!!
mysqlClient.query("SELECT * FROM photos WHERE album_id=?", [albumId], (error,rows)=>{
    if(error){
        console.error(error);
    }
    for (const r of rows){
        //console.log(r.photo_filename, r.album_name);
        console.log(r.photo_filename);
    }
})*/

//For server: one connections is not enough!!!

const pool = mysql.createPool({connectionLimit:10, host:"localhost",user: "root",password: "root", database:"albums"});

//pool.query(.....) //the same as with one connection
