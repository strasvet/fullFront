const listFiles =require("./list-files");

//listFiles("temp", f=> f[0] == "s").then(console.log);
listFiles("temp", f=> f.slice(0,5) == "stam.").then(console.log);