/**
 * 作者：窦阳春
 * 日期：2020-09-21
 * 邮箱：douyc@itnova.com.cn
 * 功能：我的审核首页
 */
import React, { Component } from 'react'
import { connect } from 'dva';
import { Tabs, Spin, Table, Pagination, Button, Modal, message} from 'antd';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
import styles from '../../carsManage/carsManage.less'
import { routerRedux } from 'dva/router';

class judgeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: '1',
      selectedRowKeys: []
    }
  }
  changeTab = (key) => {
    this.setState({
      tab: key
    })
    key == '1' ? this.props.dispatch({type: 'judgeIndex/init'}) : this.props.dispatch({type: 'judgeIndex/doList'})
  }
  columns = [
    {
    title: '',
    dataIndex: 'createName',
    key: 'createName',
    render: (text, record) => {
      let flag = this.invalidTime(record.useTime);
      return (
        <div>
          {flag ? <span className={styles.judgeSpan}>[车辆管理] &nbsp;来自&nbsp;</span> : <span><b>[车辆管理]</b> &nbsp;来自 &nbsp;</span>}
          {/* {!flag ? <span><b style={{color: '#fff', fontSize: 10, backgroundColor: '#FA7252', borderRadius: '5px'}}>已取消用车</b>  &nbsp;</span> : ''} */}
          {flag ? <span className={styles.judgeSpan}>{record.createName} &nbsp;提交的 &nbsp;</span> : <span><b>{record.createName} </b>&nbsp;提交的 &nbsp;</span>}
          {flag ? <span className={styles.judgeSpan}>{record.title+'申请'} &nbsp;需审批 &nbsp;用车时间：</span>: <span><b>{record.title}申请</b>  &nbsp;需审批 &nbsp;用车时间：</span>} 
          {flag ? <span className={styles.judgeSpan}>{record.useTime.slice(0, -5)}</span> : <span style={{color: '#f00'}}>{record.useTime.slice(0, -5)}</span>}
          &nbsp; {flag ? record.userCount ? <span className={styles.judgeSpan}>{'人数：' + record.userCount}</span> : ''
          : record.userCount ? <span>人数：<span style={{color: '#f00'}}>{record.userCount}</span></span>: '' }
        </div>
      )
    }
  }, {
    title: '',
    className: 'right',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (text, record) => {
      return (
        <span>
          {/* <b style={{color: '#fff', fontSize: 10, backgroundColor: '#FA7252', borderRadius: '5px'}}>已取消用车</b> &nbsp;
          <a onClick={(e)=> {this.gotoDelete(e, record.demandId)}}>确认</a> &nbsp; */}
          <a onClick={(e)=> {this.gotoDelete(e, record.demandId)}}>删除</a> &nbsp;
          {record.approvalLinkTime}<div>{this.invalidTime(record.useTime) ? <span className={styles.judgeSpan}>{record.updateTime}</span> : record.updateTime}</div>
        </span>
      )
    }
  }];
  columns2 = [{
    title: '标题',
    dataIndex: 'createName',
    key: 'createName',
    render: (text, record) => {
      return (
        <div>
          [车辆管理] &nbsp;您已{record.state == '3' ? ' 退回'
          : record.state == '2' ? ' 通过' : ''} &nbsp;{record.createName} &nbsp;提交的 &nbsp;{record.title}申请 &nbsp;
        </div>
      )
    }
  }, {
    title: '日期',
    className: 'right',
    dataIndex: 'approvalLinkTime',
    key: 'approvalLinkTime',
  }];
  rowClick = (record, index, flag) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/carsManage/myJudge/judgePage',
      query: {
        title: record.carsType,
        demandId: record.demandId,
        flag
      }
    }))
  }
  pageChange = (page) => {
    this.props.dispatch({
      type: 'judgeIndex/init', page
    })
  }
  pageChange2 = (page) => {
    this.props.dispatch({
      type: 'judgeIndex/doList', page
    })
  }
  invalidTime(useTime) { //计算失效时间是否大于24小时
    var date = useTime.substr(0, useTime.indexOf(':')-2);
    var time = useTime.substr(useTime.indexOf(':')-2);
    var dateArr = date.split('-');
    var timeArr = time.split(':');
    var useTimeArr = [...dateArr, ...timeArr];
    var d = new Date();
    d.setFullYear(Number(useTimeArr[0]));
    d.setMonth(useTimeArr[1]-1);
    d.setDate(useTimeArr[2]);
    d.setHours(useTimeArr[3]);
    d.setMinutes(useTimeArr[4]);
    d.setSeconds(useTimeArr[5].substr(0,useTimeArr[5].indexOf('.')));
    var nowDate = new Date();
    return nowDate-Number(d) >= 86400000 ? true : false
  }
  // onSelectChange = selectedRowKeys => {
  //   this.setState({ selectedRowKeys });
  // };
  gotoDelete = (e, demandId) => {
    e.stopPropagation();
    this.props.dispatch({
      type: 'judgeIndex/deleteTodo', idArr: [demandId]
    })
  }
  rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      let idArr = []
      selectedRows.map((v=> {idArr.push(v.demandId)}))
      // console.log(idArr, 'idArr');
      this.setState({selectedRowKeys: idArr})
    },
    getCheckboxProps: record => ({
      disabled: this.invalidTime(record.useTime) == false, 
    }),
  }; 
  showConfirm = () => {
    let that = this; 
    if(this.state.selectedRowKeys.length == 0) {
      message.destroy();
      message.info("请选中要删除的申请！")
      return
    }else{
      confirm({
        title: '确定批量删除所选失效申请?',
        content: '',
        onOk() {
          that.props.dispatch({type: 'judgeIndex/deleteTodo', idArr: that.state.selectedRowKeys})
        }
      });
    }
  }
  render() {
    const {tab} = this.state
    const {todoList, doList, allCount, allCount2, pageCurrent, pageCurrent2} = this.props;
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
         <h2 style = {{textAlign:'center',marginBottom:30}}>{tab=='1' ? '我的待办' : '我的已办'}</h2>
         <Tabs defaultActiveKey={tab} onChange={this.changeTab}>
          <TabPane tab="我的待办" key="1">
            <span>共{allCount}条待办记录</span> &nbsp;
            <Button size="default" type="primary"  onClick={this.showConfirm}>批量删除</Button>
            <Table style={{marginTop: 5}}
              className={styles.judgeTab}
              dataSource = {todoList}
              columns = {this.columns} 
              pagination = {false}
              onRowClick = {(record, index)=>this.rowClick(record, index, 'todoList')}
              rowSelection={this.rowSelection}
            />
            <Pagination 
              defaultCurrent={1} 
              total={parseInt(allCount)} 
              style = {{textAlign: 'center', marginTop: 10}}
              onChange={this.pageChange} 
              current={pageCurrent} />
          </TabPane>
          <TabPane tab="我的已办" key="2">
            <p>共{allCount2}条待办记录</p>
            <Table
              showHeader={false}
              className={styles.judgeTab2}
              dataSource = {doList}
              columns = {this.columns2}
              pagination = {false}
              onRowClick = {(record, index)=>this.rowClick(record, index, 'doList')}
            />
            <Pagination
              defaultCurrent={1} 
              total={parseInt(allCount2)} 
              style = {{textAlign: 'center', marginTop: 10}}
              onChange={this.pageChange2} 
              current={pageCurrent2} />
          </TabPane>
        </Tabs>
        </div>
     </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.judgeIndex, 
    ...state.judgeIndex
  };
}

export default connect(mapStateToProps)(judgeIndex);
