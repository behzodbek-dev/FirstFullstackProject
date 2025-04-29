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
        let registerData = '';
        req.on("data", chunk => {
            registerData += chunk;
        });
        req.on("end", () => {
            registerData = JSON.parse(registerData);
            if(!(registerData.email) || !(registerData.password) || !registerData){
                res.statusCode = 400;
                res.setHeader("Content-type", "application/json");
                return res.end(JSON.stringify({status: 400, message: "Email and password required !"}));
            }
            else{
                if(emailRegex.test(registerData.email)){
                    const userObj = users.find(({email}) => email == registerData.email);
                    if(userObj){
                        if(userObj.password == registerData.password){
                            res.statusCode = 200;
                            res.setHeader("Content-type", "application/json");
                            res.end(JSON.stringify({status: 200, message: "User succesfully registered !"}));
                        }
                        else{
                            res.statusCode = 404;
                            res.setHeader("Content-type", "application/json");
                            return res.end(JSON.stringify({status: 404, message: "User not found !"}));
                        }
                    }
                    else{
                        res.statusCode = 404;
                        res.setHeader("Content-type", "application/json");
                        res.end(JSON.stringify({status: 404, message: "User not found !"}));
                    }
                }
                else{
                    res.statusCode = 400;
                    res.setHeader("Content-type", "application/json");
                    return res.end(JSON.stringify({status: 400, message: "Email isn't valid !"}));
                };
            };
        });
    };
    if(url == "/user/login" && method == "POST"){
        let loginData = "";
        req.on("data", chunk => {
            loginData += chunk;
        });
        req.on("end", () => {
            loginData = JSON.parse(loginData);
            if(!(loginData.email) || !(loginData.password) || !(loginData.username) || !loginData){
                res.statusCode = 400;
                res.setHeader("Content-type", "application/json");
                res.end(JSON.stringify({status: 400, message: "Email, password and username is required !"}));
            }
            else{
                if(emailRegex.test(loginData.email)){
                    const checkEmail = users.some(({email}) => email == loginData.email);
                    if(!checkEmail){
                        loginData.id = users.length ? users.at(-1).id + 1 : 1;
                        users.push(loginData);
                        fs.writeFileSync(path.join(process.cwd(), "db", "users.json"), JSON.stringify(users, null, 4));
                        res.statusCode = 201;
                        res.setHeader("Content-type", "application/json");
                        res.end(JSON.stringify({status: 201, message: "User successfuly logined !"}));
                    }
                    else{
                        res.statusCode = 409;
                        res.setHeader("Content-type", "application/json");
                        res.end(JSON.stringify({status: 409, message: "This user already exists !"}));
                    };
                }
                else{
                    res.statusCode = 400;
                    res.setHeader("Content-type", "application/json");
                    res.end(JSON.stringify({status: 400, message: "Email isn't valid !"}));
                };
            };
        });
    };
});

server.listen(PORT, console.log(`Server is running on ${PORT} port`));