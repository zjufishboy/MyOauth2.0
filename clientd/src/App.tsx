import React, {
  useState,
  useEffect,
  createRef,
} from "react";
import "./App.css";

const getQueryVariable = (
  v: string
) => {
  let query = window.location.search.substring(
    1
  );
  let vars = query.split("&");
  for (
    let i = 0;
    i < vars.length;
    i++
  ) {
    let pair = vars[i].split("=");
    if (pair[0] === v) {
      return pair[1];
    }
  }
  return "";
};
const getUrlParam = () => {
  return {
    response_type: getQueryVariable(
      "response_type"
    ),
    client_ID: parseInt(
      getQueryVariable("client_ID")
    ),
    redirect_uri: getQueryVariable(
      "redirect_uri"
    ),
    scope: getQueryVariable("scope"),
  };
};
const App = () => {
  const [
    username,
    setUsername,
  ] = useState("");
  const [
    password,
    setPassword,
  ] = useState("");
  const [isErr,setIsErr]=useState(false);
  const refusername = createRef<
    HTMLInputElement
  >();
  const refpassword = createRef<
    HTMLInputElement
  >();
  useEffect(() => {
    //第一次发起token检测
    //若正常则表示用户登录状态正常
    //否则需要重新登录

    // console.log(getUrlParam());
  }, []);
  const login = () => {
    console.log("start to auth");
    let info=getUrlParam()
    console.log(info)
    fetch("http://www.fishstar.xyz:4003", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      mode: 'cors',
      body: JSON.stringify({
        username: username,
        password: password,
        ...info
      }),
    })
    .then(res => res.json())
    .then((res: { status: boolean, code?: string }) => { 
      if(!res.status)
        setIsErr(true);
      else{
        setIsErr(false);
        console.log(res)
        window.location.href=`${info.redirect_uri}/callback?code=${res.code}`;
      }
    })
  };
  const register = () => {
    console.log("start to auth");
    let info=getUrlParam()
    console.log(info)
    fetch("http://www.fishstar.xyz:4003/register", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      mode: 'cors',
      body: JSON.stringify({
        username: username,
        password: password,
        ...info
      }),
    })
    .then(res => res.json())
    .then((res: { status: boolean, code?: string }) => { 
      if(!res.status)
        setIsErr(true);
      else{
        setIsErr(false);
        console.log(res)
        window.location.href=`${info.redirect_uri}/callback?code=${res.code}`;
      }
    })
  };
  const handleChange1 = () => {
    if (refusername.current !== null)
      setUsername(
        refusername.current.value
      );
  };
  const handleChange2 = () => {
    if (refpassword.current !== null)
      setPassword(
        refpassword.current.value
      );
  };
  return (
   <div className="AppOutSide">
      <div className="App">
      <p style={{fontSize:"0.28rem"}}>游鱼星用户登陆授权</p>
      <input
        type="text"
        placeholder="用户名"
        ref={refusername}
        onChange={handleChange1}
        className="inputs"
      />
      <input
        type="password"
        placeholder="密码"
        ref={refpassword}
        onChange={handleChange2}
        className="inputs"
      />
      <div className="buttonOutSide">
      <button onClick={login} className="buttonLeft">
        登录
      </button>
      <button onClick={register} className="buttonRight">
        注册
      </button>
      </div>
      {isErr&&<div style={{fontSize:"0.14rem",color:"red"}}>登录错误</div>}
    </div>
   </div>
  );
};

export default App;
