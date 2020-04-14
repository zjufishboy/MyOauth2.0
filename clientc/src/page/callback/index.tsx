import React, { useEffect } from 'react';
import './index.css';
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
const getCode = () => getQueryVariable("code")
export const Callback = () => {
    useEffect(() => {
        let code = getCode();
        fetch("http://localhost:4004/", {
        headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          mode: 'cors',
          body: JSON.stringify({
            code:parseInt(code)
          }),})
        .then(res=>res.json())
        .then((res:{status:boolean,token?:string})=>{if(res.status&&res.token){
            localStorage.setItem("token",res.token)
            window.location.href="http://test.fishstar.xyz/"
        }
        else{
            console.log("error!");
        }
    })
    }, [])
    return (
        <div className="">
        </div>
    );
}