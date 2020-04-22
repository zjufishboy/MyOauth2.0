import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");
import mongodb = require("mongodb");
import stringRandom = require('string-random');
const MongoClient = mongodb.MongoClient;
//lib

const port = 4003;
const mongodbUrl =
  "mongodb://127.0.0.1:39000/";
  const addUser=function(username,password){
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongodbUrl, { useUnifiedTopology: true }, function (err, db) {
            var t = db.db("myOauth2_0");
            t.collection("User").find().toArray((err,result)=>{
                let id=result.length
                t.collection("User").insertOne({ id:id,username: username, password: password,signature:"the other info"},(err)=>{
                  if(err)
                    throw err;
                  resolve({status:true,uid:id})
                })
            })
            
        });
    });
}
const checkUser = (
  username: string,
  password: string
) => {
  console.log("checkUser:", {
    username,
    password,
  });
  return new Promise(
    (resolve, reject) => {
      MongoClient.connect(
        mongodbUrl,
        { useUnifiedTopology: true },
        (err, db) => {
          let t = db.db("myOauth2_0");
          t.collection("User")
            .find({
              username,
              password,
            })
            .toArray((err, result) => {
              // 返回集合中所有数据
              if (err) throw err;
              db.close();
              if (result.length > 0)
                resolve({
                  status: true,
                  uid: result[0].uid,
                });
              else
                resolve({
                  status: false,
                });
            });
        }
      );
    }
  );
};
const checkToken = (
  client_ID: number,
  uid: number
) => {
  return new Promise(
    (resolve, reject) => {
      MongoClient.connect(
        mongodbUrl,
        { useUnifiedTopology: true },
        (err, db) => {
          let t = db.db("myOauth2_0");
          t.collection("Token")
            .find({
              client_ID,
              uid,
              token_time: {
                $gte: new Date(),
              },
            })
            .toArray((err, result) => {
              // 返回集合中所有数据
              if (err) throw err;
              db.close();
              console.log(
                "token vaild",
                result
              );
              if (result.length > 0)
                resolve({
                  status: true,
                  authcode:
                    result[0].authCode,
                });
              else {
                //不存在有效的token，需要重新申请
                ApplyNewToken(
                  client_ID,
                  uid
                ).then(
                  (result: {
                    status: boolean;
                    authCode?: string;
                  }) => {
                    if (result.status) {
                      resolve({
                        status: true,
                        authCode:
                          result.authCode,
                      });
                    }
                  }
                );
              }
            });
        }
      );
    }
  );
};

const getAuthCode = () => {
  //todo:生成一个随机的authcode
  let authCode=stringRandom(32)
  //todo:加密authcode
  return authCode;
};
const getToken = () => {
  //todo:随机生成token
  let token= stringRandom(32)
  return token;
};

const ApplyNewToken = (
  client_ID: number,
  uid: number
) => {
  return new Promise(
    (resolve, reject) => {
      MongoClient.connect(
        mongodbUrl,
        { useUnifiedTopology: true },
        (err, db) => {
          let t = db.db("myOauth2_0");
          let authCode = getAuthCode();
          let token = getToken();
          let curDate = new Date();
          let data = {
            client_ID,
            uid,
            authCode,
            token_time: new Date(
              curDate.getTime() +
                3600000
            ),
            token,
          };
          t.collection(
            "Token"
          ).insertOne(
            data,
            (err, result) => {
              if (err) throw err;
              db.close();
              resolve({
                status: true,
                authCode: authCode,
              });
              console.log(
                "applyNewToken",
                {
                  status: true,
                  authCode: authCode,
                }
              );
            }
          );
        }
      );
    }
  );
};

const CheckApp = (
  client_ID: number,
  client_secret: string,
  code: string
) => {
  return new Promise(
    (resolve, reject) => {
      MongoClient.connect(
        mongodbUrl,
        { useUnifiedTopology: true },
        (err, db) => {
          let t = db.db("myOauth2_0");
          t.collection("App")
            .find({
              client_ID,
              client_secret,
            })
            .toArray((err, result) => {
              if (err) throw err;
              db.close();
              checkAuthCode(client_ID,code).then((res:{status:boolean,token?:string})=>{
                  if(res.status){
                    resolve({status:true,token:res.token});
                  }
                  else{
                    resolve({status:false});
                  }
              })
              
            });
        }
      );
    }
  );
};

const checkAuthCode=(client_ID:number,code:string)=>{
    
    return new Promise(
        (resolve,reject)=>{
            MongoClient.connect(
                mongodbUrl,
                {useUnifiedTopology:true},
                (err,db)=>{
                    let t=db.db("myOauth2_0");
                    console.log("checkAuthCode:",client_ID,code);
                    t.collection("Token").find({
                        authCode:code,
                        client_ID:client_ID,
                        token_time: {
                            $gte: new Date(),
                        },
                    }).toArray(
                        (err, result) => {
                            console.log("checkAuthCode:",result);
                            if (err) throw err;
                            db.close();
                            if(result.length>0){
                                let token=result[0].token;
                                resolve({status:true,token});
                            }
                            else{
                                resolve({status:false})
                            }    
                        });
                });
        });
}

const checkTokenValid=(token:string)=>{
    return new Promise(
        (resolve,reject)=>{
            MongoClient.connect(
                mongodbUrl,
                {useUnifiedTopology:true},
                (err,db)=>{
                    let t=db.db("myOauth2_0");
                    t.collection("Token").find({
                        token,
                        token_time: {
                            $gte: new Date(),
                        },
                    }).toArray(
                        (err, result) => {
                            if (err) throw err;
                            console.log("checkTokenValid:",result);
                            db.close();
                            if(result.length>0){
                                let uid=result[0].uid;
                                //这里应该返回资源，这里返回了
                                resolve({status:true,uid});
                            }
                            else{
                                resolve({status:false})
                            }    
                        });
                });
        });
}

//config

const app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//prepare

//

interface query{
    client_ID:string,
    client_secret:string,
    code:string
}
app.get("/token", (req:{query:query}, res) => {
  let {client_ID,client_secret,code}=req.query;
  console.log(req.query)
  CheckApp(parseInt(client_ID),client_secret,code)
  .then((result)=>{res.send(result)});
});

app.post("/", (req, res) => {
  let {
    username,
    password,
    client_ID,
  } = req.body;
  checkUser(username, password).then(
    (result: {
      status: boolean;
      uid?: number;
    }) => {
      console.log("checkUser:", result);
      if (result.status) {
        //检查是否存在clientid和user的有效token组
        //若无，则创建，并返回E(authcode)
        //若有，则返回E(authcode)
        checkToken(
          client_ID,
          result.uid
        ).then(
          (result: {
            status: boolean;
            authcode?: string;
          }) => {
            if (result.status) {
              res.send({
                status: true,
                code: result.authcode,
              });
            } else {
              res.send({
                status: false,
              });
            }
          }
        );
        // res.send({status:true,code:"123456"})
      } else {
        res.send({ status: false });
      }
    }
  );
});
app.post("/register", (req, res) => {
  let {
    username,
    password,
    client_ID,
  } = req.body;
  addUser(username, password).then(
    (result: {
      status: boolean;
      uid?: number;
    }) => {
      console.log("checkUser:", result);
      if (result.status) {
        //检查是否存在clientid和user的有效token组
        //若无，则创建，并返回E(authcode)
        //若有，则返回E(authcode)
        checkToken(
          client_ID,
          result.uid
        ).then(
          (result: {
            status: boolean;
            authcode?: string;
          }) => {
            if (result.status) {
              res.send({
                status: true,
                code: result.authcode,
              });
            } else {
              res.send({
                status: false,
              });
            }
          }
        );
        // res.send({status:true,code:"123456"})
      } else {
        res.send({ status: false });
      }
    }
  );
});

app.post("/userinfo",(req,res)=>{
    let token=req.body.token;
    checkTokenValid(token)
    .then(result=>res.send(result))
})

//route

app.listen(port, () => {
  console.log(
    `serverA start to listen on port[${port}]`
  );
});
