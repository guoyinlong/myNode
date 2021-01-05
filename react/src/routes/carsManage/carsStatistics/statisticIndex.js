import React, { Component } from 'react'
import {connect } from 'dva';
import { Table, Input, Spin, Pagination, Button } from 'antd';
import { routerRedux } from 'dva/router';
const Search = Input.Search;  
import styles from '../../carsManage/carsManage.less'

class statisticIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  columns = [{
    title: '序号',
    dataIndex: 'key',
    key: 'key',
  },{
    title: '报告名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '报告类型',
    dataIndex: 'typeTxt',
    key: 'typeTxt',
  }, {
    title: '用车次数',
    dataIndex: 'count',
    key: 'count',
  }];
  buildReport = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/carsManage/carsStatistics/buildReport'
    }))
  }
  rowClick = (record) => {
    record.pageFlag = 'showPage'
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/carsManage/carsStatistics/showReport',
      query: {
        record: JSON.stringify(record)
      }
    }))
  }
  serchReport = () => {
    this.props.dispatch({
      type: 'statisticIndex/init'
    })
  }
  pageChange = (page) => {
    this.props.dispatch({
      type: 'statisticIndex/init', page
    })
  }
  saveChange = (flag, value) => {
    this.props.dispatch({
      type: 'statisticIndex/saveValue', flag, value
    })
  }
  render() {
    const {tableData, pageCurrent, allCount, reportValue} = this.props;
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
         <h2 style = {{textAlign:'center',marginBottom:30}}>年度/季度/月度用车数据统计</h2>
         <div style = {{marginBottom: 10}}>
          <Search
            placeholder="报告名称"
            style={{ width: 300 }}
            value = {reportValue}
            onChange = {(e)=>this.saveChange('reportValue', e.target.value)}
            onSearch={this.serchReport}
          />
          <Button type="primary" onClick={this.buildReport} style={{marginLeft: '30px'}}>新建报告</Button>
         </div>
         <Table
          className={styles.orderTable}
          dataSource = {tableData}
          columns = {this.columns}
          onRowClick = {this.rowClick}
          pagination = {false}
         />
         <Pagination key={"589"} 
           defaultCurrent={1} 
           total={parseInt(allCount)} 
           style = {{textAlign: 'center', marginTop: 10}}
           onChange={this.pageChange} 
           current={pageCurrent} />
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.statisticIndex, 
    ...state.statisticIndex
  };
}

export default connect(mapStateToProps)(statisticIndex);
