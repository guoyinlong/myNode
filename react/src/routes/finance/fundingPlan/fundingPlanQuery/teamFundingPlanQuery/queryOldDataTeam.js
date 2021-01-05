/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：指标查询UI页面
 */

import React from 'react'
import { DatePicker,Spin,Select,Table  } from 'antd'
import { detailName } from '../../../../../components/finance/detailName'
import { MoneyComponent } from '../../../../../components/finance/FormatData'
import moment from 'moment';
import { stateCodeFill} from '../../common'
const { MonthPicker } = DatePicker;
const Option = Select.Option;
export  default  class SearchUI extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }

  column = [
    {
      title:'年度',
      width:'100px',
      fixed:'left',
      dataIndex:'plan_year'
    },
    {
      title:'月份',
      width:'100px',
      fixed:'left',
      dataIndex:'plan_month',
    },
    {
      title:'姓名',
      width:'100px',
      fixed:'left',
      dataIndex:'apply_username'
    },
    {
      title:'资金类型',
      dataIndex:'funds_type',
      width:'120px',
      render: (text) => {return(text ==='1'?'自购':text==='2'?'公众':'他购')},
    },
    {
      title:'科目名称',
      dataIndex:"subject_name",
      width:'200px',
      render:(text,record)=>detailName(text,record.childRows)
    },
    {
      title:'具体付款事项描述',
      dataIndex:"spe_pay_description",
      width:'200px',
    },
    {
      title:'资金计划',
      dataIndex:"funds_plan",
      width:'150px',
    },
    {
      title:'填报状态',
      dataIndex:"fill_state_code",
      width:'150px',
      render:(text,record)=>stateCodeFill(text,record)
    },
    {
      title:'填报阶段备注',
      dataIndex:"remark1",
      width:'150px'
    },
    {
      title:'调整后资金计划',
      dataIndex:"funds_current_amount",
      width:'150px',
    },
    {
      title:'调整阶段状态',
      dataIndex:"adjust_state_code",
      width:'150px',
      render:(text,record)=>stateCodeFill(text,record)
    },
    {
      title:'调整阶段备注',
      dataIndex:"remark2",
    },
  ];
  onChangeDatePickerOne=(date, dateString)=>{
    if (dateString!==''){
      let planYearOld = dateString.split("-")[0];
      let planMonthOld = dateString.split("-")[1];
      const {dispatch}=this.props.data;
      dispatch({
        type:'fundingPlanQuery/queryOld',
        id:this.props.data.id,
        flag : '2',
        planYearOld,
        planMonthOld,
      });
    }
  };
  changeState = (...arg) =>{
    const { dispatch } = this.props;
    dispatch({
      type : 'fundingPlanQuery/changeState',
      arg,
    })
  };
  render(){
    let {list}=this.props;
    let  {loading,beginPlanTimeOld,endPlanTimeOld,feeList} = this.props.data;
    return(
      <Spin tip="加载中..." spinning={loading}>
        <div>
          <div>
            <span>
              开始时间：
              <MonthPicker onChange={(value)=>this.changeState(value,'beginPlanTimeOld')} value={beginPlanTimeOld}/>
            </span>
            <span>
              结束时间：
              <MonthPicker onChange={(value)=>this.changeState(value,'endPlanTimeOld')} value={endPlanTimeOld}/>
            </span>
            <span>
              资金类型：
               <Select onChange={(value)=>this.changeState(value,'planType')}>
                 <Option key="个人">个人</Option>
                 <Option key="他购">他购</Option>
                 <Option key="公共">公共</Option>
              </Select>
            </span>
            <span>
              科目名称：
              <Select onChange={(value)=>this.changeState(value,'feeName')}>
                {feeList.map((i)=>{<Option key={i.key}>{i.value}</Option>})}
              </Select>
            </span>
            <div style={{textAlign:'right',color:'red'}}>金额单位：元</div>
          </div>
          <div>
            <Table columns = {this.column} dataSource={list} scroll={{ x: 1720 }}/>
          </div>
        </div>
      </Spin>
    )
  }
}

