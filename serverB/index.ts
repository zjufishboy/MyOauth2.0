import express =require('express');
import cors =require('cors');
import bodyParser =require('body-parser');
import fetch from 'node-fetch';
//lib

const port=4004;
const info={
    client_id:0,                          //Appid
    client_secret:"123456",
    redirect_uri:"http://localhost:4003", //重定向uri
  }
const getUrl=(code:string)=>{
    return `http://localhost:4003/token?client_ID=${info.client_id}&client_secret=${info.client_secret}&code=${code}&redirect_uri=${info.redirect_uri}`;
}

//config

const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



//prepare


//
app.get("/oauth/authorize",(req, res) => res.send('Hello World!'))
app.post("/",(req, res) => {
    let {code}=req.body;
    let url=getUrl(code);
    console.log("url",url)
    fetch(url)
    .then(result=>result.json())
    .then(result=>{res.send(result)})
})
//route

app.listen(port,()=>{console.log(`serverB start to listen on port[${port}]`)})