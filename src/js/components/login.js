/**
 * Created by luye on 09/05/2017.
 */
import React from 'react';
import {api} from "../api.js";
import '../../less/login.less'

export default class Login extends React.Component {
  constructor() {
    super();
  }

  login(e) {
    if (e.target.tagName === 'INPUT' && e.keyCode !== 13) {
      return;
    }
    const proxyLogin = new Proxy(localStorage, {
      set: function (target, propkey, value) {
        if (propkey === 'add') {
          target.setItem('uid', value.uid);
          target.setItem('pwd', value.pwd);
        }
        return true;
      }
    });
    console.log(localStorage);
    let param = {};
    const elements = e.target.parentElement.querySelectorAll('input');
    Array.from(elements, function (item) {
      if (param.uid === undefined) {
        param.uid = item.value;
      }
      else {
        param.pwd = item.value;
      }
    });
    let token = param.uid + ':' + param.pwd;
    const buf = new Buffer(token);
    token = buf.toString('base64');
    param.authorization = 'Basic ' + token;
    api.postLogin(param).then(data=> {
      if (Object.is(data.message, 'OK')) {
        proxyLogin.add = {
          uid: param.uid,
          pwd: param.pwd
        };
        window.location.href = "index.html#/";
      }
      else {
        alert('用户名或密码错误!');
        proxyLogin.add = {
          uid: '',
          pwd: ''
        };
        Array.from(elements, function (item) {
          item.value = '';
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div class="login">
          用户名:<br/>
          <input type="text"/>
          <br/>
          密码:<br/>
          <input type="password" onKeyDown={this.login}/>
          <br></br>
          <button onClick={this.login}>提交</button>
        </div>
      </div>
    )
  }
}