/**
 * Created by yang on 17/4/10.
 */
/*
 准入报告列表
 */
import React, {Component} from "react";
import {
  Input,
  Select,
  Icon,
  Row, Col,
  Menu, Dropdown,
  Button,
  DatePicker,
} from 'antd';
import moment from 'moment';
import "../../less/reportList.less";
import {api} from "../api.js";
import $ from "jquery";
import LuyeTable from "./luyeTable/luyeTable.js";

//时间日期选择
const {MonthPicker, RangePicker} = DatePicker;
function onChange(date, dateString) {
  console.log(date);
  console.log(dateString);
}
//获取当前时间
function getNowTime(date) {
  let y, m, d;
  y = date.getFullYear();
  m = date.getMonth() + 1;
  d = date.getDate();
  return ( y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) );
}

var currDate,currTime;//当前时间
currDate = new Date();
currTime = getNowTime(currDate);
export default class ReportList extends Component {
  //状态初始化 -- input输入框 和 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      name: "xuqiu",
      reporter_name: "reporter",
      date_begin:"2017-04-18",
      date_end:currTime,
      dep1: "dep1",
      dep2: "dep2",
      dep3: "dep3",
      dropData: "未通过",
    };
  }

  //时间日期选择  -- 提交时间事件处理
  onChange(date, dateString) {
    console.log(date);
    console.log(dateString);
    //更改提交时间的状态
    this.setState({
      date_begin:dateString[0],
      date_end:dateString[1],
    });
  }

  //下拉列表-事件处理
  menuOnclick(e) {
    console.log('click', e.key);
    this.setState({
      dropData: e.key,
    });
  }

  //输入框 -- onChange事件处理
  handleChange(e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    //
    this.setState(obj);
    console.log(this.state);

  }

  render() {
    //下拉菜单 - menu
    const dropData = ["通过", "未通过", "待审核", "自动通过"];
    const dropMenu = (
      <Menu onClick={this.menuOnclick.bind(this)}>
        <Menu.Item key={dropData[0]}>
          <p>{dropData[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[1]}>
          <p>{dropData[1]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[2]}>
          <p>{dropData[2]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[3]}>
          <p>{dropData[3]}</p>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="需求名称" defaultValue={this.state.name} name="name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="报告人姓名" defaultValue={this.state.reporter_name} name="reporter_name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={12}>
            <span className="date-submit0">提交时间</span>
            <div className="div-date-submit0">
              <RangePicker defaultValue={[moment(this.state.date_begin),moment(this.state.date_end)]}
                           onChange={this.onChange.bind(this)}/>
            </div>
          </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="一级部门" defaultValue={this.state.dep1} name="dep1"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="二级部门" defaultValue={this.state.dep2} name="dep2"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="三级部门" defaultValue={this.state.dep3} name="dep3"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6} className="exam-result">
            <span>审核结果</span>
            <div>
              <Dropdown overlay={dropMenu} trigger={["click"]}>
                <a className="ant-dropdown-link" href="#">
                  {this.state.dropData}
                  <Icon type="down"/>
                </a>
              </Dropdown>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6}></Col>
          <Col span={6}><Button style={{marginLeft: 4}} type="primary"
                                onClick={()=>window.location = 'index.html#/newProject'}>新建项目</Button></Col>
          <Col span={6}><Button style={{marginLeft: 4}} type="primary"
                                onClick={ ()=>{
                                  this.getTbData();
                                } }
                          >查  询</Button></Col>
        </Row>
        <div id="tb-div"></div>
      </div>
    );
  }

   getTbData(){
    console.log(this.state);
     //调用接口函数
    api.getReportList(this.state).then( data => {
      console.log("reportList get success");
      console.log(data);
      console.log(data.data);
      let arr = data.data;
      let typeStr = "", nodeStr = "",
        check_noteStr="",check_resultStr="",
        _nUrl="";
      let nodeUrl = "index.html#/@@";
      for(let i=0; i<arr.length; i++){
        //项目类型
        arr[i]["typeStr"] = (arr[i].type == 0)?"App类":"非App类";
        //节点类型
        if(arr[i].node == 0){
          nodeStr = "新项目";
          _nUrl = "newCheckInReport";
        }else if(arr[i].node == 1){
          nodeStr = "提测";
          _nUrl = "newCheckInReport";
        }else if(arr[i].node == 2){
          nodeStr = "上线";
          _nUrl = "newOnlineReport";
        }else if(arr[i].node == 3){
          nodeStr = "合板";
          _nUrl = "newMergeReport";
        }
        arr[i]["nodeStr"] = nodeStr;
        arr[i]["_nUrl"] = _nUrl;
        //评估结果
        if(arr[i].check_note == 0){
          check_noteStr = "待评估";
        }else if(arr[i].check_note == 1){
          check_noteStr = "蓝灯";
        }else if(arr[i].check_note == 2){
          check_noteStr = "绿灯";
        }else if(arr[i].check_note == 3){
          check_noteStr = "黄灯";
        }else if(arr[i].check_note == 4){
          check_noteStr = "红灯";
        }
        arr[i]["check_noteStr"] = check_noteStr;
        //审核结果
        if(arr[i].check_result == 0){
          check_resultStr = "待审核";
        }else if(arr[i].check_result == 1){
          check_resultStr = "通过";
        }else if(arr[i].check_result == 2){
          check_resultStr = "未通过";
        }
        arr[i]["check_resultStr"] = check_resultStr;
      };
      console.log(arr);
      //表格数据渲染
      var tbParam = {
        el:$("#tb-div"),
        data:arr,
        columns:[{cname:"报告ID",cdata:"id"},
          {cname:"需求名称",cdata:"name"},
          {cname:"需求ID",cdata:"jira_id"},
          {cname:"项目类型",cdata:"typeStr"},
          {cname:"报告人姓名",cdata:"tester_ctx"},
          {cname:"节点",cdata:"nodeStr",type:"a", url:nodeUrl, params:["_nUrl"]},
          {cname:"评估结果",cdata:"check_noteStr"},
          {cname:"审核结果",cdata:"check_resultStr"},
          {cname:"一级部门",cdata:"dep1_name"},
          {cname:"二级部门",cdata:"dep2_name"},
          {cname:"三级部门",cdata:"dep3_name"},
          {cname:"提交时间",cdata:"create_time"},
        ],
        managePageSize:true,
      };
      let tb = new LuyeTable(tbParam);

    } );
  }

  componentDidMount(){

  }
}
