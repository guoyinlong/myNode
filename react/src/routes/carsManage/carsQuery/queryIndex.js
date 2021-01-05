/**
 * 作者：窦阳春
 * 日期：2020-09-16
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车记录
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import { Table, Pagination , DatePicker, Select, Spin, Popconfirm, Button, message } from 'antd';
const {RangePicker} = DatePicker;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
import Cookie from 'js-cookie';
const {Option} = Select;    
import styles from '../../carsManage/carsManage.less'
import { routerRedux } from 'dva/router';

class queryIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  saveChange = (flag, value, time) => {
    this.props.dispatch({
      type: 'queryIndex/saveValue',
      value,
      flag,
      time
    })
  } 
  gotoModify = (record) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/carsManage/carsApply/carsApplyModify',
      query: {
        demandId: record.demandId,
        type: record.type,
        flag: 'modify'
      }
    }))
  }
  gotoDetail = (record) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/carsManage/carsQuery/applyDetails',
      query: record
    }))
  }
  delApply = (record) => {
    this.props.dispatch({
      type: 'queryIndex/delApply',
      record
    })
  }
  abolishApply = (record) => {
    this.props.dispatch({
      type: 'queryIndex/abolishApply',
      record
    })
  }
  cancelApply = (record) => {
    message.info("确定取消！")
  }
  queryHistory = () => {
    this.props.dispatch({
      type: 'queryIndex/init', page: 1
    })
  }
  empty = () => {
    this.props.dispatch({
      type: 'queryIndex/empty',
    })
  }
  columns = [{
    title: '序号',
    dataIndex: 'key',
    key: 'key',
  },{
    title: '用车申请类型',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '用车单位',
    dataIndex: 'deptName',
    key: 'deptName',
  }, {
    title: '用车需求人',
    dataIndex: 'userName',
    key: 'userName',
  },{
    title: '用车时间',
    dataIndex: 'useTime',
    key: 'useTime',
  },{
    title: '状态',
    dataIndex: 'stateTxt',
    key: 'stateTxt',
  }, {
    title: '操作',
    dataIndex: 'opera',
    key: 'opera',
    render:(text,record) => {
      if (record.state == '0') {
      return (
        <div>
          <Button size="small" type="primary" onClick={() =>this.gotoModify(record)}>修改</Button>
          {
            record.createId == Cookie.get('userid') ?
            <Popconfirm title = '确定删除' onConfirm = {()=>this.delApply( record )}>
              <Button type = "primary" size="small" style = {{marginLeft : '3px'}}>删除</Button>
            </Popconfirm> : ''
          }
        </div>
      )}else if(record.state == '1') {
        return (
        <div>
          <Button size="small" type="primary" onClick={() =>this.gotoDetail(record)}>详情</Button>
          {
            record.createId == Cookie.get('userid') ?
            <Popconfirm title = '确定作废' onConfirm = {()=>this.abolishApply( record )}>
              <Button type = "primary" size="small" style = {{marginLeft : '3px'}}>作废</Button>
            </Popconfirm> : ''
          }
        </div>)
      }else if(record.state == '4') {
        return (
        <div>
          <Button size="small" type="primary" onClick={() =>this.gotoDetail(record)}>详情</Button>
        </div>)
      }else if(record.state == '2'){
        return (
        <div>
          <Button size="small" type="primary" onClick={() =>this.gotoDetail(record)}>详情</Button> 
          {/* {
            record.createId == Cookie.get('userid') ?
            <Popconfirm title = '确定取消' onConfirm = {()=>this.cancelApply( record )}>
              <Button type = "primary" size="small" style = {{marginLeft : '3px'}}>取消用车</Button>
            </Popconfirm> : ''
          } */}
        </div>)
      }else if(record.state == '3') {
        return (
        <div>
          <Button size="small" type="primary" onClick={() =>this.gotoDetail(record)}>详情</Button>
          {
            record.createId == Cookie.get('userid') ?
            <Popconfirm title = '确定删除' onConfirm = {()=>this.delApply( record )}>
              <Button type = "primary" size="small" style = {{marginLeft : '3px'}}>删除</Button>
            </Popconfirm> : ''
          }
        </div>)
      }
    }
  }];
  changePage = (page) => {
    this.props.dispatch({
      type: 'queryIndex/init',
      page
    })
  }
  render() {
    const {startTime, endTime, tableData, carsApplyType, state, pageCurrent, allCount} = this.props;
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
         <h2 style = {{textAlign:'center',marginBottom:30}}>用车记录</h2>
         <div style={{marginBottom: 10}}>
          用车时间：
          <RangePicker style={{width: 200}}
            format = {dateFormat}
            value={ 
              this.props.startTime === '' || this.props.endTime==='' ? null 
            : [moment(startTime, dateFormat), moment(endTime, dateFormat)]}
            placeholder={['开始时间', '结束时间']}
            onChange={(value, dataString)=>this.saveChange(value, dataString, 'time')}
            /> &nbsp;
            用车申请类型：
            <Select value={carsApplyType} style={{ width: 200 }}  onChange={(value)=>this.saveChange('carsApplyType',value)}>
              <Option key={5} value={''}>全部</Option>
              <Option key={0} value={'0'}>正常业务支撑用车</Option>
              <Option key={1} value={'1'}>因公出差接送站用车</Option>
              <Option key={2} value={'2'}>个人特殊事宜临时用车</Option>
            </Select> &nbsp;
            状态：
            <Select value={state} style={{ width: 200 }}  onChange={(value)=>this.saveChange('state',value)}>
              <Option key={5} value={''}>全部</Option>
              <Option key={0} value={'0'}>草稿</Option>
              <Option key={1} value={'1'}>待审批</Option>
              <Option key={2} value={'2'}>审批通过</Option>
              <Option key={3} value={'3'}>审批退回</Option>
              <Option key={4} value={'4'}>作废</Option>
              {/* <Option key={5} value={'5'}>已取消用车</Option> */}
            </Select> &nbsp;
            <div  style={{float: 'right', padding: '2px 0px'}}>
              <Button type='primary'  onClick={this.empty}>清空</Button> &nbsp;
              <Button type='primary'  onClick={this.queryHistory}>查询</Button>
            </div>
         </div>
          <Table 
            style = {{clear: 'both'}}
            className={styles.orderTable}
            dataSource={tableData} columns={this.columns}
            pagination = {false}/>
          <Pagination 
            className = {styles.paginationStyle}
            defaultCurrent={1} 
            current = {pageCurrent}
            total={allCount}
            onChange={this.changePage}/>
        </div>
     </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.queryIndex, 
    ...state.queryIndex
  };
}

export default connect(mapStateToProps)(queryIndex);
