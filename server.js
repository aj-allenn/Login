const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");


const signupEvent = new EventEmitter();

signupEvent.on("userSignup", (user) => {
    // console.log("\nSIGNUP EVENT");
    // console.log("Name :", user.name);
    // console.log("Email:", user.email);
    // console.log("Password:", user.password);

  let users=[];
  if(fs.existsSync("users.json")){
    const data =fs.readFileSync("users.json","utf-8")
    if(data){
        users=JSON.parse(data)
    }
  }

  //new user//

     users.push(user);
    fs.writeFileSync("users.json",JSON.stringify(users,null,2));


    // fs.writeFileSync("users.json",JSON.stringify(user),(err,data)=>{
    //     if(err){
    //         res.writeHead(500,{"Content-Type":"text/plain"})
    //         res.end()
    //     }else{
    //         res.writeHead(200,{"Content-Type":"text/application"})
    //         res.end(data)
    //     }
    // });
});



const viewsDir = path.join(__dirname, "view");
const publicDir = path.join(__dirname, "public");

function serveView(file, res) {
    fs.readFile(path.join(viewsDir, file), (err, data) => {
        if (err) return res.end("Page missing");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

function servePublic(file, res) {

    const ext = path.extname(file);

    let type = "text/plain";

    if (ext === ".css") type = "text/css";
    if (ext === ".js") type = "text/javascript";

    fs.readFile(path.join(publicDir, file), (err, data) => {
        if (err) return res.end("File missing");
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {

    console.log(req.method, req.url);

    if (req.url.startsWith("/public/")) {
        return servePublic(req.url.replace("/public/", ""), res);
    }

    if (req.method === "GET") {
        if (req.url === "/") return serveView("home.html", res);
        if (req.url === "/login") return serveView("login.html", res);
        if (req.url === "/signup") return serveView("signup.html", res);
        if (req.url === "/display") return serveView("display.html", res);
        if (req.url === "/users") 

            {

            let users = [];

            if (fs.existsSync("users.json")) {
                users = JSON.parse(
                    fs.readFileSync("users.json", "utf-8") || "[]"
                );
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(users));
        }
    }

    if (req.method === "POST" && req.url === "/signup") {
         console.log(req.body,"req.body data");
         
        let buffers = [];

        req.on("data", (chunk) =>{ 
            buffers.push(chunk)
            console.log(chunk);
        });

        req.on("end", () => {

            const raw = Buffer.concat(buffers).toString();
           
            const data = JSON.parse(raw);

            const { name, email, password, confirm } = data;

            // if (password !== confirm) {
            //     res.writeHead(400, { "Content-Type": "text/plain" });
            //     return res.end("Passwords do not match");
            // }

            const user = {
                name,
                email,
                password
            };

            signupEvent.emit("userSignup", user);

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Signup successful");

        });
    }

});

server.listen(5000, () => {
    console.log("\nServer running at http://localhost:5000");
});
