/**
 * 作者：窦阳春
 * 日期：2020-09-17 
 * 邮箱：douyc@itnova.com.cn
 * 功能：生产统计报告
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import { Table, Card, Input, Select, Radio, Modal, Collapse, Button, Spin } from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;    
const { Panel } = Collapse;
const { TextArea } = Input;
const {Option} = Select;    
import Statistics from './statistics.js' //统计图
import styles from '../../carsManage/carsManage.less'

class buildReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  saveChange = (flag, value) => {
    this.props.dispatch({
      type: 'buildReport/saveValue',
      flag,
      value: flag == 'remarks' ? value.substring(0, 200) : value
    })
  }
  showConfirm = () => {
    let that = this; 
    confirm({
      title: '确定生成统计报告?',
      content: '',
      onOk() {
        that.props.dispatch({
          type: 'buildReport/toBuildReport'
        })
      }
    });
  }
  getYearData = () => {
    var myDate = new Date();       
    var thisYear = myDate.getFullYear();  // 获取当年年份
    var Section = thisYear - 2020;  // 声明一个变量 获得当前年份至想获取年份差 
    var arrYear = []; // 声明一个空数组 把遍历出的年份添加到数组里
    for(var i = 0;i<=Section;i++){
        arrYear.push(thisYear--)
    }
    return arrYear
  }
  toShowReport = () => {
    this.props.dispatch({
      type: 'buildReport/toShowReport'
    })
  }
  columns = [
    {
      key: 'key',
      dataIndex: 'key',
      title: '序号'
    },
    {
      key: 'carByName',
      dataIndex: 'carByName',
      title: '用车人'
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: '用车次数'
    },
  ]
  render() {
    const {radioValue, quarterCheck, yearCheck, monthCheck, statistics, statisticsTable, remarks, pageFlag, title} = this.props;
    const panelList = statisticsTable.map((item, index1) => {
      item.key = index1+1;
      item.staff!=undefined ? item.staff.map((i, index2)=>{i.key=index2+1}) : null
      const path = (
        <Panel
        header = {
          <div>
            <span>{item.deptName}</span>
            <span style = {{float: 'right', paddingRight: 15}}>用车次数：<span style={{color: '#f00'}}>{item.useCount}</span></span>
          </div>
        }
        key = {index1+''}
        >
          <Table 
          className={styles.orderTable}
          dataSource = {item.carForUsers}
          columns={this.columns}
          pagination = {false}
          />
        </Panel>
      )
      return path
    })
    let yearList = this.getYearData().map((item, i) => {
      return <Option key={i} value={item+''}>{item}</Option>
    })
    let monthData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    let monthList = monthData.map((item, i)=> {
    return <Option key={i} value={item}>{item}</Option>
    })
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
          {pageFlag !== 'showPage' ? 
         <div>
         <h2 style = {{textAlign:'center',marginBottom:30}}>生成用车统计报告</h2>
           <b>创建</b> &nbsp;
           <RadioGroup onChange={(e)=>this.saveChange('radioValue', e.target.value)} value={radioValue}>
            <Radio value={0}> 年度</Radio>
            <Radio value={1}> 季度</Radio>
            <Radio value={2}> 月度</Radio>
           </RadioGroup>
           <b>报告</b> &nbsp;
           <span style={{color: '#f00'}}>*</span>
           年份： &nbsp;
           <Select value={yearCheck} style={{ minWidth: '8%' }}  onChange={(value)=>this.saveChange('yearCheck',value)}>
             {yearList}
           </Select> &nbsp;
           {
             radioValue == 1 || radioValue == 2 ?
            <span>
            <span style={{color: '#f00'}}>*</span>
            季度： &nbsp; 
            <Select value={quarterCheck} style={{ minWidth: '11%' }}  onChange={(value)=>this.saveChange('quarterCheck',value)}>
              <Option key={'1'} value={'第一季度'}>第一季度</Option>
              <Option key={'2'} value={'第二季度'}>第二季度</Option>
              <Option key={'3'} value={'第三季度'}>第三季度</Option>
              <Option key={'4'} value={'第四季度'}>第四季度</Option>
            </Select> &nbsp;
            </span> : ''
           }
           {
             radioValue == 2 ?
            <span>
            <span style={{color: '#f00'}}>*</span>
            月度： &nbsp;
            <Select value={monthCheck} style={{ minWidth: '7%' }}  onChange={(value)=>this.saveChange('monthCheck',value)}>
              {monthList}
            </Select> &nbsp;
            </span> : ''
           }
           <Button type="primary" onClick={this.toShowReport} style={{float: 'right'}}>展示统计报告</Button>
           <hr style={{margin: '10px 0', clear: 'both'}}/>
           { statisticsTable.length>0 ?
              <Button type="primary" onClick={this.showConfirm} style={{float: 'right', zIndex: 10000}}>生成统计报告</Button> : ''}
           </div>
           : ''}
           {pageFlag !== 'showPage' ? 
           <span style={{fontWeight: 900, fontSize: 16, lineHeight: '35px',}}>
             软研院
             {
              radioValue == 0 ?  `${yearCheck}年用车统计报告`
              : radioValue == 1 ? `${yearCheck}年${quarterCheck}用车统计报告`
              : radioValue == 2 ? `${yearCheck}年${quarterCheck}${monthCheck}月份用车统计报告`
              : ''
              }
            </span> : ''}
           { statisticsTable.length>0 ?
             <div>
               {pageFlag == 'showPage' ? <h2 style={{textAlign:'center',marginBottom:30}}>{title}</h2> : ''}
               {
               <div id={styles.textDisabled}>
                 <div style={{float: 'left', width: '2%' }}>备注：</div>
                 <TextArea style={{margin: '6px 0', width: '98%'}}
                  disabled={pageFlag !== 'showPage' ? false : true}
                  value={remarks} 
                  onChange={(e)=>this.saveChange('remarks', e.target.value)}/>
               </div> 
               }
              <Card title={<span>单位：次</span>}>
              <Statistics statisticsData = {statistics}/>
              </Card>
              <Collapse style={{marginTop: 10}}>{panelList}</Collapse>
            </div> : ''
           }
        </div>
     </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.buildReport, 
    ...state.buildReport
  };
}

export default connect(mapStateToProps)(buildReport);
