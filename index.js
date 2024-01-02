import express from "express";
import axios from "axios"
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
let auto = 100;
const port = 3000;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//Weather:>>
// API PARAMS
const myAPIKEY = "e7704bc895b4a8d2dfd4a29d404285b6";
const myLat = 32.032581;
const myLon = 34.888409;
// Temp Convertor
function kelToC(kel) {
    return kel - 273.15;
}
//<<

function Todo(title, body) {
    this.idNum = auto++;
    this.title = title;
    this.body = body;
    this.done = false;
    this.editBarHidden = true;
}
let ex1 = new Todo("example1", "this is example");
let ex2 = new Todo("example2", "this is example");
let ex3 = new Todo("example3", "this is example");
let theName;
let todos = [];
todos.push(ex1, ex2, ex3);

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const respond = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${myLat}&lon=${myLon}&appid=${myAPIKEY}`);
        const result = respond.data.current;

        let myDate = new Date();
        res.render("index.ejs", {
            myDay: days[myDate.getDay()],
            myDate: `${myDate.getDate()}.${myDate.getMonth() + 1}.${myDate.getFullYear()}`,
            myTemp: Math.floor(kelToC(result.temp)),
            myWeather: result.weather[0].main,
        })
    }
    catch (error) {
        console.log(error);
    }

});


app.post("/add-todo", (req, res) => {
    let todo = new Todo(req.body["title"], req.body["body"]);
    todos.push(todo);
    res.redirect("/home");
})

app.post("/home-done", (req, res) => {
    let index = parseInt(req.body["theId"]);
    for (let i = 0; i < todos.length; i++)
        if (todos[i]["idNum"] === index) {
            todos[i]["done"] = true;
            break;
        }
    res.redirect("/home");

})

app.post("/home-todo", (req, res) => {
    let index = parseInt(req.body["theId"]);
    for (let i = 0; i < todos.length; i++)
        if (todos[i]["idNum"] === index) {
            todos[i]["done"] = false;
            break;
        }
    res.redirect("/home");

})

app.get("/home", async (req, res) => {

    try {
        const respond = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${myLat}&lon=${myLon}&appid=${myAPIKEY}`);
        const result = respond.data.current;
        let myDate = new Date();
        res.render("todos.ejs", {
            userName: theName,
            myDay: days[myDate.getDay()],
            myDate: `${myDate.getDate()}.${myDate.getMonth() + 1}.${myDate.getFullYear()}`,
            todoArr: todos,
            myTemp: Math.floor(kelToC(result.temp)),
            myWeather: result.weather[0].main,
        });
    }
    catch (error) {
        console.log(error);
    }
});

app.post("/home", (req, res) => {
    theName = req.body["name"];
    res.redirect("/home");
});


app.post("/home-del", (req, res) => {
    let myDel = parseInt(req.body["theId"]);
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].idNum === myDel) {
            myDel = i;
            todos.splice(myDel, 1);
        }
    }
    res.redirect("/home");
});

app.post("/home-edit", (req, res) => {

    let myId = parseInt(req.body["theId"]);
    let myIndex;

    for (let i = 0; i < todos.length; i++)
        if (todos[i]["idNum"] === myId) {
            myIndex = i;
            break;
        }
    todos[myIndex]["editBarHidden"] = !todos[myIndex]["editBarHidden"];
    res.redirect("/home");
})

app.post("/save-changes", (req, res) => {

    let myId = parseInt(req.body["theId"]);
    let myindex;
    for (let i = 0; i < todos.length; i++)
        if (todos[i]["idNum"] === myId) {
            myindex = i;
            break;
        }
    console.log(todos[myindex]);
    todos[myindex]["body"] = req.body["altBody"];
    todos[myindex]["title"] = req.body["altTitle"];
    todos[myindex]["editBarHidden"] = true;

    res.redirect("/home");

});


app.get("/about-me.html", (req, res) => {
    res.sendFile(__dirname + "/views/about-me.html")
})



app.listen(port, () => {
    console.log("server up in port: " + port);
})
