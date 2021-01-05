/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：指标查询UI页面
 */

import React from 'react'
import { Table,Input,Button,Icon,Select,DatePicker, Modal } from 'antd'
import styles from '../query.less'
import tableStyle from '../../../../components/finance/table.less'
import AdjustAccount from './adjustAccount'
import exportExl from '../exportExl';
const Option = Select.Option;
const {MonthPicker} =DatePicker;
export  default  class SearchUI extends React.Component{
  changeState = (...arg) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'commonSearch/changeState',
      arg,
    })
  };
  changeStateHasService = (value,key) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'commonSearch/changeStateHasService',
      value,
      key
    })
  };
  queryData=()=>{
    const { dispatch }= this.props;
    dispatch({
      type:'commonSearch/queryData',
    })
  };
  clearQuery=()=>{
    const { dispatch }= this.props;
    dispatch({
      type:'commonSearch/clearQuery',
    })
  };
  expExl=()=>{
    let tab=document.querySelector(`#table1 table`);
    exportExl()(tab,'报销情况表');
  };

  // 图表生成打开
  chartGenerateOpen = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'commonSearch/save',
      payload: {
        chartGenerateVisible: true
      }
    })
  }
  // 生成图表选择框
  getChartSelect = () => {
    const {chartMonth} = this.props;
    return (
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 20
          }}
        >图表生成</div>
        <div>
          <span>月份：</span>
          <Select
            value={chartMonth}
            onChange={this.chartSelect}
            style={{
              width: 150
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(v => <Option key={v + ''}>{v}</Option>)}
          </Select>
        </div>
      </div>
    )
  }
  // 图表时间选择
  chartSelect = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'commonSearch/save',
      payload: {
        chartMonth: e
      }
    })
  }
  // 图表生成确认
  charGenerateOk = () => {
    const {dispatch, chartMonth} = this.props;
    dispatch({
      type: 'commonSearch/fundingExpenseGenerate',
      payload: {
        arg_month: chartMonth
      }
    });
    dispatch({
      type: 'commonSearch/save',
      payload: {
        chartGenerateVisible: false
      }
    })
  }
  // 图表生成取消
  charGenerateCancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'commonSearch/save',
      payload: {
        chartGenerateVisible: false
      }
    })
  }

  render(){
    let { list,loading,yearMonthBegin,yearMonthEnd,planCode,applyUser,team,dept,ou,flag,departInfo,deptInfo,ouList,deptList,teamList,busId,busNameList, chartGenerateVisible }=this.props;
    return(
      <div className={styles.wrap}>
        <div className={styles.title}>
          <div>
            开始时间：
            <MonthPicker onChange={(value) => this.changeState(value, 'yearMonthBegin')} value={yearMonthBegin}/>
          </div>
          <div>
            结束时间：
            <MonthPicker onChange={(value) => this.changeState(value, 'yearMonthEnd')} value={yearMonthEnd}/>
          </div>
          {
            flag ==='4'?
              <div>
                OU：
                <Select onChange={(value) => this.changeStateHasService(value, 'ou')} style={{width: '200px'}}
                        value={ou}>
                  {ouList.map((i)=>{return(<Option value={i.ou_name} key={i.ou_name}>{i.ou_name}</Option>)})}
                </Select>
              </div>
              :
              ''
          }
          {
            flag ==='3'|| flag ==='4'?
              <div>
                部门名称：
                <Select onChange={(value) => this.changeState(value, 'dept')} style={{width: '200px'}}
                        value={dept}>
                  {deptList.map((i,index)=><Option key={index} value={i.deptname}>{i.deptname.includes('-') && i.deptname.split('-')[1]}</Option>)}
                </Select>
              </div>
              :
              ''
          }
          {
            flag ==='2'?
              <div>
                小组名称：
                <Select onChange={(value) => this.changeState(value, 'team')} style={{width: '200px'}}
                        value={team}>
                  {teamList.map((i,index)=><Option key={index} value={i.team_name}>{i.team_name}</Option>)}
                </Select>
              </div>
              :
              ''
          }
          {
            flag==='1' || flag==='2' || flag ==='3'|| flag ==='4'?
              <div>
                姓名：
                <Input onChange={(e) => this.changeState(e.target.value, 'applyUser')} style={{width: '100px'}} value={applyUser}/>
              </div>
              :
              ''
          }
          <div>
            凭证编号：
            <Input onChange={(e) => this.changeState(e.target.value, 'planCode')} style={{width: '150px'}} value={planCode}/>
          </div>
          {
            //2 部门，3分院，4 总院
            flag === '2' || flag === '3' || flag === '4'?
              <div>
                业务大类：
                <Select onChange={(value) => this.changeState(value, 'busId')} style={{minWidth: '300px'}}
                        value={busId}
                        dropdownMatchSelectWidth={false}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option key='all' value=''>{'全部'}</Option>
                  {busNameList.map((i,index)=><Option key={index} value={i.bus_id}>{i.bus_name}</Option>)}
                </Select>
              </div>
              :
              null
          }
        </div>
        {
          //0 个人，1小组
          flag === '0' || flag === '1'?
            <div>
              业务大类：
              <Select onChange={(value) => this.changeState(value, 'busId')} style={{minWidth: '300px'}}
                      value={busId}
                      dropdownMatchSelectWidth={false}
                      showSearch
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option key='all' value=''>{'全部'}</Option>
                {busNameList.map((i,index)=><Option key={index} value={i.bus_id}>{i.bus_name}</Option>)}
              </Select>
            </div>
            :
            null
        }
        <div style={{textAlign: 'right', margin: '5px 0'}}>
          <Button onClick={this.queryData} type="primary">查询</Button>&nbsp;&nbsp;
          <Button onClick={this.clearQuery} type="primary">重置</Button>&nbsp;&nbsp;
          <Button onClick={this.expExl} type="primary">导出</Button>
        </div>
        {
          flag === '4' || flag === '3' ?
            <div>
              <Button type='primary' onClick={()=>this.refs.adjustAccount.showModal()} style={{marginLeft:'10px',marginBottom:'10px'}}>调账</Button>
              <Button type='primary' onClick={this.chartGenerateOpen} style={{marginLeft:'10px',marginBottom:'10px'}}>图表生成</Button>
              <Modal
                visible={chartGenerateVisible}
                onOk={this.charGenerateOk}
                onCancel={this.charGenerateCancel}
                width={400}
              >
                {this.getChartSelect()}
              </Modal>
            </div>
            :
            null
        }
        <div style={{float:'right',fontSize:'16px'}}>{this.props.tag !== '' ? this.props.tag : ''}</div>
        <Table
          rowKey="index_num"
          columns={this.getHeader()}
          dataSource={list}
          className={tableStyle.financeTable}
          loading={loading}/>
        <div id="table1" style={{display:"none"}}>
          <Table rowKey='index_num'  columns={this.getHeader()} dataSource={list} pagination={false}/>
        </div>
        <AdjustAccount ref="adjustAccount"  teamNames={departInfo} depts={deptInfo} dispatch={this.props.dispatch} ouList={ouList}/>
      </div>
    )
  }
}

