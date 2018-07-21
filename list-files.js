const promiseFs = require("./promise-fs");

/*

function filterFiles(directoryPath,fileFilter, files) {
    const cb =function(v,i){return fileFilter(v,this[i]);};
    const result = Promise.all(files.map(f=>promiseFs.stat(`${directoryPath}/${f}`))).then(a=> files.filter(cb,a),); //directoryPath+"/"+f
    return result;
}
*/

function filterFiles(directoryPath, fileFilter, files) {
    const cb = function (v, i) {
        return fileFilter(v, this[i]);
    };
    const result = Promise.all(files.map(f => promiseFs.stat(`${directoryPath}/${f}`))).then(a => files.filter(cb, a),); //directoryPath+"/"+f
    return result;
}


//filterFiles("C:\\WebStormProject\\1.06.201",(f,stats)=> stats.isFile(), ["stam","calculator.js","person-test.js"]).then(console.log, console.error);

//exports.listFiles =
module.exports = (directoryPath, fileFilter)=> promiseFs.readdir(directoryPath).then(filterFiles.bind(null,directoryPath,fileFilter));