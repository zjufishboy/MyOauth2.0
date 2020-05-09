import React, {
  useState,
  useEffect,
} from "react";
import "./index.css";

const config = {
  url: {
    app: "test.fishstar.xyz",
    auth: "account.fishstar.xyz",
    callback: "test.fishstar.xyz/callback"
  },
  testUrl: {
    app: "localhost:4002",
    auth: "localhost:4001",
    callback: "localhost:4002/callback"
  },
  protocol: "http",
  envLevel: 0
}
const info = {
  response_type: "code",                 //返回模式：code
  client_id: 0,                          //Appid
  redirect_uri:config.envLevel===0?config.testUrl.app:config.url.app, //重定向uri
  scope: "read"                          //申请权限
}
const url = `${config.protocol}://${config.envLevel===0?config.testUrl.auth:config.url.auth}/?response_type=${info.response_type}&client_ID=${info.client_id}&redirect_uri=${info.redirect_uri}&scope=${info.scope}`

const Index = () => {
  // const [username,setUsername]=useState("");
  const [token, setToken] = useState(
    ""
  );
  const [uid, setUid] = useState(
    ""
  );
  useEffect(() => {
    //第一次发起token检测
    //若正常则表示用户登录状态正常
    //否则需要重新登录
    let token = localStorage.getItem("token");
    if (token === null) {
      //无遗留信息
      //首次登录
      setToken("");
    }
    else if (token != null) {
      fetch(`${config.protocol}://${config.envLevel===0?config.testUrl.auth:config.url.auth}/userinfo`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        mode: 'cors',
        body: JSON.stringify({
          token: token
        }),
      })
        .then(res => res.json())
        .then(res => {
          if (res.status) {
            if (token != null)
              setToken(token)
            setUid(res.uid)
          }
          else {
            setToken("")
          }
        })
    }




  }, []);
  const loginByOauth = () => {
    window.location.href = url;
  };
  return (
    <div className="Index">
      <div>{`Token:${token}`}</div>
      {token === "" &&
        <button onClick={loginByOauth}>
          授权登录
          </button>}
      {!(token === "") && <div>已登录：{uid}</div>}
    </div>
  );
};

export default Index;
