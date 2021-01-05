/**
 *  作者: 张枫
 *  创建日期: 2018-11-09
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：首页-质量管理-质量汇总页面。
 */
import React from 'react';
import { connect } from 'dva';
import {Card ,Col ,Row,Button,Table,Select } from 'antd';
import { DatePicker } from 'antd';
import style from './quality.less'; //引入样式文件
import moment from 'moment';
import SmellSum from './smellSum';
import BugSum from './bugSum.js';
import VulSum from './vulSum.js';
import Sum from './sum';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
class QualitySum extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    time : moment().format('YYYY-MM-DD'),
    graUid:''
  };
  sumGroupQuery = (value)=>{
    this.props.dispatch({
      type : 'qualitySummary/sumGroupQuery',
      group: value
    });
  };
  columns = [{
    key : '',
    dataIndex:'name',
    title :'姓名',
    width : '10%',
    render : (text)=>{
    return (
      <div>{text}</div>
    )}
  },{
    key :'',
    title :'问题数量(个)',
    width : '10%',
    dataIndex : 'value',
    render :(text)=>{
    return(
      <div>{text}</div>
    )}
  }];
  // 设定详细查询小组
  setDetailsGroup = (value)=>{
    this.props.dispatch({
      type : 'qualitySummary/setDetailsGroup',
      group: value
    });
  };
  // 设定查询日期
  setTime = (date,dateString)=>{

    this.props.dispatch({
      type : 'qualitySummary/setTime',
      dateString: dateString
    })
  };
  // 不可选择日期
  disabledDate = (current) => {
    return current && current.valueOf() > moment().endOf('day');;
  }
  render(){
    const {sumData} = this.props;
    const groupList = this.props.group.map((item)=>{
      return(
        <Option key = {item}>{item}</Option>
      )
    });
    return (
      <div>
        <Card title = {<div>代码质量汇总  <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>（实时数据）</span></div> } bordered = {false}
        >
          <span>小组：</span>
          <Select defaultValue = "all" onChange = {this.sumGroupQuery} style = {{width:150}}>
            {groupList}
          </Select>
          <Row style = {{paddingTop:'40'}}>
            <Col span = {20}>
              <Sum sumData = {this.props.sumData}/>
            </Col>
            <Col span = {4}>
              <Table
                columns = {this.columns}
                dataSource = {sumData.DataRows}
                pagination = {false}
                style = {{paddingTop:'35px'}}
                className={style.tableStyle}
              />
            </Col>
          </Row>
        </Card>
        &nbsp; &nbsp; &nbsp;
        <Card title = {<div>代码质量详细 <span style={{ marginTop: '30px',fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>(截至每周五21:00批量扫描后数据)</span></div>} bordered = {false}>
          <div>
            <span>小组：</span>
            <Select defaultValue = "all" onChange = {this.setDetailsGroup} style = {{width:150}}>
              {groupList}
            </Select>
            <span style = {{paddingLeft : '15px'}}>日期：</span>
            <MonthPicker
              disabledDate = {this.disabledDate}
              onChange = {this.setTime}
              placeholder={this.props.dParam.arg_req_month}
              format={monthFormat}
              style = {{width:150}}
            />
          </div>
          <Row  style = {{paddingTop:'50px'}}>
            <Col span = {24}>
              <BugSum
                bugData = {this.props.bugDetails}
              />
            </Col>
          </Row>
          <Row style = {{marginTop:'50'}}>
            <Col span = {24}>
              <VulSum vulData = {this.props.vulDetails}/>
            </Col>
          </Row>
          <Row style = {{marginTop:'50'}}>
            <Col span = {24}>
              <SmellSum smellData = {this.props.smellDetails}/>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
   loading:state.loading.models.qualitySummary,
   ...state.qualitySummary
   }

}

export default connect(mapStateToProps)(QualitySum);
