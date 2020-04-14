"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
//lib
var port = 4003;
var mongodbUrl = "mongodb://localhost:39000/";
var checkUser = function (username, password) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongodbUrl, { useUnifiedTopology: true }, function (err, db) {
            var t = db.db("myOauth2_0");
            t.collection("User").find({ username: username, password: password }).toArray(function (err, result) {
                if (err)
                    throw err;
                db.close();
                if (result.length > 0)
                    resolve({ status: true });
                else
                    resolve({ status: false });
            });
        });
    });
};
// const checkToken=(client_id,uid)=>{
// }
//config
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//prepare
//
app.get("/token", function (req, res) {
});
app.post("/", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    checkUser(username, password).then(function (result) {
        console.log(result);
        if (result.status) {
            //检查是否存在clientid和user的有效token组
            //若无，则创建，并返回E(authcode)
            //若有，则返回E(authcode)
            res.send({ status: true, code: "123456" });
        }
        else {
            res.send({ status: false });
        }
    });
});
//route
app.listen(port, function () { console.log("serverA start to listen on port[" + port + "]"); });
