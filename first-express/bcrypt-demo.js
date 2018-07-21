const bcrypt = require("bcrypt");

//bcrypt.hash("root", 12, (error,hash)=> console.log(hash));

//bcrypt.compare("root", "$2b$12$YEgBbZqLLk0Nz6L9v9MOVuF/7kULXxreN0OE7XwCSEEoZ0pBSBy3e",console.log);
bcrypt.compare("root", "$2b$12$YEgBbZqLLk0Nz6L9v9MOVuF/7kULXxreN0OE7XwCSEEoZ0pBSBy3e",(error,result)=> console.log(result));
