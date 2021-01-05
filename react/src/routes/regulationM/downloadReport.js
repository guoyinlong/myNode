/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度下载统计
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip ,Input,Button,Upload,Spin} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
const { MonthPicker, RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM-DD';
import Cookie from 'js-cookie';
import styles from './ruleRegulation/regulationM.less';

const dataSource = [{
    key: '1',
    name: '综合行政规章制度',
    type: '综合行政',
    uploadTime: '2018-07-06',
    uploadDept: '办公室',
    level: '集团级',
    downloadNum: '10',
  }, {
    key: '2',
    name: '综合行政规章制度',
    type: '综合行政',
    uploadTime: '2018-07-06',
    uploadDept: '办公室',
    level: '集团级',
    downloadNum: '10',
  }];

class DownloadReport extends React.Component{
  state = {
    startTime:moment().format('YYYY-MM-DD'),
    endTime:moment().format('YYYY-MM-DD'),
  };
  disabledDate = (current) => {return current && current.valueOf() < Date.parse('2017-01-01') && current.valueOf() > Date.now();}

  getStartTime = (date,dateString) => {
    const {dispatch} = this.props;

    if(dateString == undefined || dateString == null || dateString == ''){
      message.info("请选择开始时间");
      return;
    }
    this.setState({
      startTime: dateString
    },()=>{
      if(dateString > this.state.endTime){
        message.info("开始时间不能大于结束时间");
        return;
      }
      var data = {
        arg_download_time_start: this.state.startTime,
        arg_download_time_end: this.state.endTime,
        arg_page_size:10,
      }
      dispatch({
        type:'downloadReport/regulationtopdownquery',
        data,
      })
    })

  }

  getEndTime = (date,dateString) =>{
    const {dispatch} = this.props;
    if(dateString == undefined || dateString == null || dateString == ''){
      message.info("请选择结束时间");
      return;
    }

    this.setState({
      endTime: dateString
    },()=>{
      if(dateString < this.state.startTime){
        message.info("结束时间不能小于开始时间");
        return;
      }
      var data = {
        arg_download_time_start: this.state.startTime,
        arg_download_time_end: this.state.endTime,
        arg_page_size:10,
      }
      dispatch({
        type:'downloadReport/regulationtopdownquery',
        data,
      })
    })

  }

  showOperation = (record) => {
    if(record.category2_name){
      return (
        <span>{record.category1_name}-{record.category2_name}</span>
      )
    }
    else{
      return (
        <span>{record.category1_name}</span>
      )
    }
  }

  showSeceret = (record) => {
    if(record === '0'){
      return(
        <div>无</div>
      )
    }else if (record === '1'){
      return(
        <div>普通商业秘密</div>
      )
    }
  }

  columns = [
    {
      title: '名称',
      dataIndex: 'title',
      width:300,
    },
    {
      title: '制度类别',
      width:150,
      render:(record) => this.showOperation(record)

    },
    {
      title: '性质',
      dataIndex: 'kind_name',
      width:100,
    },
    {
      title: '体系',
      dataIndex: 'sys_name',
      width:100,
    },
    {
      title: '级别',
      dataIndex: 'level_name',
      width:100,
    },
    {
      title: '密级',
      dataIndex: 'is_secret',
      width:100,
      render:(record) => this.showSeceret(record),
    },
    {
      title: '上传时间',
      width:150,
      dataIndex: 'publish_date',

    },
    {
      title: '上传部门',
      width:150,
      dataIndex: 'record_belong_orgname',
    },

    {
      title: '下载量',
      width:100,
      dataIndex: 'downloadtimes',
    },
  ];



  render(){
    const {topList} = this.props;
    return(
       <Spin tip="加载中..." spinning={this.props.loading}>
         <div  className = {styles.pageContainer}>
          <h2 style = {{textAlign:'center'}}>下载统计</h2>
          <div style = {{marginTop:20}}>
          <div style = {{marginTop:35}} className = {styles.lightInfo}>下载量排名TOP 10</div>
            <span style = {{fontSize:15}}>查询时间段：</span>&nbsp;&nbsp;
            <DatePicker defaultValue={moment(new Date(), monthFormat)} onChange={this.getStartTime} disabledDate={this.disabledDate} format={monthFormat} style = {{marginBottom:10}}/> ~ &nbsp;
            <DatePicker defaultValue={moment(new Date(), monthFormat)} onChange={this.getEndTime}  disabledDate={this.disabledDate} format={monthFormat} style = {{marginBottom:10}}/>
          </div>
          <Table columns={this.columns} dataSource={topList} pagination={false} className={styles.orderTable} style = {{marginTop:20}}/>
         </div>
       </Spin>
    );
  }

}

function mapStateToProps (state) {
  const {query,topList} = state.downloadReport;  //lumj
  return {
    loading: state.loading.models.downloadReport,
    query,
    topList
  };
}


export default connect(mapStateToProps)(DownloadReport);
