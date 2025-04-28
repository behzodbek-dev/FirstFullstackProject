const http = require("node:http");
const PORT = 3000;
const fs = require("node:fs");
const path = require("node:path");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let users = JSON.parse(fs.readFileSync(path.join(process.cwd(), "db", "users.json"), "utf-8")) || [];

const server = http.createServer((req, res) => {
    const url = req.url.trim().toLowerCase();
    const method = req.method.trim().toUpperCase();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    
    if(method == "OPTIONS") return res.end("");
    if(url == "/users" && method == "GET") return res.end(JSON.stringify(users));
    if(url == "/user/register" && method == "POST"){
        let data = '';
        req.on("data", chunk => {
            data += chunk;
        });
        req.on("end", () => {
            data = JSON.parse(data);
            if(!(data.email) || !(data.password)){
                res.statusCode = 400;
                res.setHeader("Content-type", "application/json");
                return res.end(JSON.stringify({status: 400, message: "Email and password required !"}));
            }
            else{
                if(emailRegex.test(data.email)){
                    const userObj = users.find(({email}) => email == data.email);
                    if(userObj.password == data.password){
                        res.statusCode = 200;
                        res.setHeader("Content-type", "application/json");
                        res.end(JSON.stringify({status: 200, message: "User succesfully registered !"}));
                    }
                    else{
                        res.statusCode = 409;
                        res.setHeader("Content-type", "application/json");
                        return res.end(JSON.stringify({status: 409, message: "Email or password is wrong !"}));
                    }; 
                }
                else{
                    res.statusCode = 400;
                    res.setHeader("Content-type", "application/json");
                    return res.end(JSON.stringify({status: 400, message: "Email isn't valid !"}));
                };
            };
        });
    };
});

server.listen(PORT, console.log(`Server is running on ${PORT} port`));