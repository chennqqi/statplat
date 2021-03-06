/**
 * Created by yang on 17/4/18.
 */

/*
 审核结果

 */
import React, {Component} from "react";
import {
  Row, Col,
  Menu, Dropdown, Icon,
  Input, Button,
  Upload, message,
} from "antd";
import "../../less/examResult.less";
import {api} from "../api.js";
import {domain} from "../api.js";

//url字符串处理函数
function dealUrl(url) {
  //获取第一次出现?的下标
  let first = url.indexOf("?");
  let _str = url.substr(first + 1, url.length); //截取问号?之后的内容
  let _arr = _str.split("&"); //用&分割字符串
  let newObj = {};
  for (let i = 0; i < _arr.length; i++) {
    //将_arr数组中的字符串元素,用=分割成字符串数组,并选择第2个元素
    let eleKey = _arr[i].split("=")[0];
    let eleValue = _arr[i].split("=")[1];
    newObj[eleKey] = eleValue;
  }
  return newObj;
}

var objData = {};
var pageTag; //分辨上上个页面是哪一个页面 : 提测/上线/合板
var work_id,
  flag; //flag为0 隐藏 ,即display:none
let rows;
let filename; // string
export default class ExamResult extends Component {
  //状态初始化 -- 下拉列表dropdown的初始化数据
  constructor(props) {
    super();
    this.state = {
      dropData: "通过",
      reporter_ctx: "",
      _file:""
    };
  }

  ////下拉列表-点击事件处理
  menuOnclick(e) {
    this.setState({
      dropData: e.key,
    });
  }

  //输入框 - onChange事件
  onChange(e) {
    objData[e.target.name] = e.target.value;
    this.setState(objData);
  }

  empty() {
    return (
      <Row class="">
        <Col span={6} className="test-link-css border-top-no border-right-css">
          <span>{ "无" }</span>
        </Col>
        <Col span={18} className="test-link-css border-top-no">
          <span>{ "无" }</span>
        </Col>
      </Row>
    );
  };

  render() {
    //解析从评估结果页面跳转过来的url
    let url = window.location.href;
    let obj = dealUrl(url);
    pageTag = obj["pageTag"];
    work_id = obj["work_id"];
    if(objData!=undefined){
      if(objData.node==3 && objData.check_result==1){
        flag = 0; //按钮隐藏
      }else if (objData.node==5 && objData.check_result==1){
        flag = 0; //按钮隐藏
      }else{
        flag = 1;
      }
    }
    
    //log记录的解析显示
    if(objData._log != undefined){
      if (objData._log.length > 0) {
        let count = 0;
        rows = objData._log.map((value)=> {
          count++;
          return (
            <Row class="" key={ count }>
              <Col span={6} className="test-link-css border-top-no border-right-css">
                <span>{value.user}</span>
              </Col>
              <Col span={18} className="test-link-css border-top-no">
                <span>{value.comment}</span>
              </Col>
            </Row>
          );
        });
      } else {
        rows = this.empty();
      }
    }

    //下拉菜单 - menu - 提测邮件
    const dropData = ["通过", "未通过"];
    const dropMenu = (
      <Menu onClick={this.menuOnclick.bind(this)}>
        <Menu.Item key={dropData[0]}>
          <p>{dropData[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[1]}>
          <p>{dropData[1]}</p>
        </Menu.Item>
      </Menu>
    );

    //审核结果文件上传
    var _this = this;
    const props = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
          filename = info.fileList[0].response.data.filename;
          _this.setState({
            _file:filename
          });
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div>
        <div>
          <Row className="row-margin-bottom">
            <Col span={11}></Col>
            <Col span={6} className="title-txt">审核结果</Col>
          </Row>
          <Row>
            <Col span={4} className="test-link-css border-bottom-css border-right-css">
              提交人
            </Col>
            <Col span={8} className="test-link-css border-bottom-css border-right-css">
              主要描述
            </Col>
            <Col span={6} className="test-link-css border-bottom-css border-right-css">
              审核结果
            </Col>
            <Col span={6} className="test-link-css border-bottom-css">
              附件
            </Col>
          </Row>
          <Row>
            <Col span={4} className="test-link-css border-right-css">
              <Input placeholder="v_chenxiaoer" name="reporter_ctx" value={ this.state.reporter_ctx }
                     onChange={this.onChange.bind(this)}/>
            </Col>
            <Col span={8} className="test-link-css border-right-css">
              <Input placeholder="上线-提测-合板,,," name="comment" onChange={this.onChange.bind(this)}/>
            </Col>
            <Col span={6} className="test-link-css border-right-css dropdown-list-css">
              <div>
                <Dropdown overlay={dropMenu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={6} className="test-link-css">
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 上传审核截图
                </Button>
              </Upload>
              <span>
                <a href={(this.state._file=="")?"":(domain+this.state._file)} target="_Blank">
                  {(this.state._file=="" || this.state._file===null)?"":"查看审核截图"}</a>
              </span>
            </Col>
          </Row>
          <Row style={{ display:(flag==0?"none":"block") }} className="jira-css row-btn-css">
            <Col span={12} className="submit-btn">
              <Button
                onClick={ ()=>{ window.location="index.html#/reportList" } }
              >关闭</Button>
            </Col>
            <Col span={12} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{
                                        //是否审核通过
                                        let if_pass = this.state.dropData=="通过" ? 1 : 0;
                                        objData["if_pass"] = if_pass;
                                        //审核时上传的文件
                                        objData["file"] = (filename==undefined)?"":filename;
                                        if(pageTag == "checkin"){
                                            //提交 提测报告审核信息
                                            api.postCheckreportForCheckin(objData).then(data=>{
                                                if(data.status == 200){
                                                    alert("success");
                                                    window.location="index.html#/reportList?exam_result=1";
                                                }else if(data.status == 500){
                                                    alert(data.message);
                                                }
                                            });
                                        }else if(pageTag == "online"){
                                            //提交 上线报告审核信息
                                            api.postCheckreportForOnline(objData).then(data=>{
                                                if(data.status == 200){
                                                    alert("success");
                                                    window.location="index.html#/reportList?exam_result=1";
                                                }else if(data.status == 500){
                                                    alert(data.message);
                                                }
                                            });
                                        }else if(pageTag == "merge"){
                                            //提交 合板报告审核信息
                                            api.postCheckreportForMerge(objData).then(data=>{
                                                if(data.status == 200){
                                                    alert("success");
                                                    window.location="index.html#/reportList?exam_result=1";
                                                }else if(data.status == 500){
                                                    alert(data.message);
                                                }
                                            });
                                        }
                                    } }
              >提交</Button>
            </Col>
          </Row>
        </div>

        <div>
          <Row className="row-margin-bottom row-margin-top">
            <Col span={11}></Col>
            <Col span={6} className="title-txt">Log记录</Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css">
              提交审核人
            </Col>
            <Col span={18} className="test-link-css">
              主要描述
            </Col>
          </Row>
          <ul>
            {rows}
          </ul>
        </div>

      </div>
    );
  }

  componentDidMount() {
    //获取项目信息 --  取到测试人员的ctx
    api.getNewProject(work_id).then(data=> {
      console.log(data);
      //取到测试人员的ctx,显示到页面上
      objData["reporter_ctx"] = data.data.tester_ctx;
      objData["work_id"] = work_id;
      //节点node和审核结果check_result
      objData["node"] = data.data.node;
      objData["check_result"] = data.data.check_result;
      this.setState(objData);
    });

    //log记录日志
    if(pageTag == "checkin"){
      api.getCheckreportForCheckin(work_id).then(data=> {
        //console.log(data);
        objData["_log"] = data.data.loglist; //log记录日志
        this.setState(objData);
      });
    }else if(pageTag == "online"){
      api.getCheckreportForOnline(work_id).then(data=> {
        objData["_log"] = data.data.loglist; //log记录日志
        this.setState(objData);
      });
    }else if(pageTag == "merge"){
      api.getCheckreportForMerge(work_id).then(data=> {
        objData["_log"] = data.data.loglist; //log记录日志
        this.setState(objData);
      });
    }
  }
}