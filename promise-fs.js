const fs = require("fs");

function executeStat(path, resolve, reject) {
    fs.stat(path,(error,stats)=>error ? reject(error):resolve(stats));
}

function executeReadDir(path,resolve,reject){
    fs.readdir(path,(error,files)=> error ? reject(error): resolve(files));


}
//exports.stat = path => new Promise((resolve,reject)=>executeStat(path,resolve,reject));
exports.stat = path => new Promise(executeStat.bind(null,path));
exports.readdir = path => new Promise(executeReadDir.bind(null,path));



