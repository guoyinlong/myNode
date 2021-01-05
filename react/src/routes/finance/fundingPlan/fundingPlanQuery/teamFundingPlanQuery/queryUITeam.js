/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：指标查询UI页面
 */

import React from 'react'
import { Table,Input,Button,Icon,DatePicker,Spin } from 'antd'
import styles from '../../../../../components/employer/employer.less'
import TableSearch from '../../../../../components/finance/tableSearch'
import tableStyle from '../../../../../components/finance/table.less'
import { MoneyComponent } from '../../../../../components/finance/FormatData'
import { detailName } from '../../../../../components/finance/detailName'
import moment from 'moment';
import { stateCodeFill} from '../../common'
const { MonthPicker } = DatePicker;
export  default  class SearchUI extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }
  onChangeDatePickerOne=(date, dateString)=>{
    if (dateString!==''){
      let planYear = dateString.split("-")[0];
      let planMonth = dateString.split("-")[1];
      const {dispatch}=this.props.data;
      dispatch({
        type:'fundingPlanQuery/query',
        id:this.props.data.id,
        flag : '2',
        planYear,
        planMonth,
      });
    }
  };
  render(){
    let {list}=this.props;
    const column = [
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
        title:'资金计划',
        dataIndex:"funds_plan",
        width:'150px',
        //render : text =>MoneyComponent(text)
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
      // {
      //   title:'资金计划调整',
      //   dataIndex:"fundsAdjust",
      //   width:'130px',
      //   //render : text =>MoneyComponent(text)
      // },
      {
        title:'调整后资金计划',
        dataIndex:"funds_current_amount",
        width:'150px',
        //render : text =>MoneyComponent(text)
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
    const  needSearch=['funds_type','apply_username','subject_name'];
    return(
      <Spin tip="加载中..." spinning={this.props.data.loading}>
        <div>
          <div style={{overflow:'hidden'}}>
            <span>{'年月：'}
              <MonthPicker onChange={this.onChangeDatePickerOne} value={moment(this.props.data.planYear+'-'+this.props.data.planMonth,'YYYY-MM')}/>
          </span>&nbsp;&nbsp;
            <div style={{textAlign:'right',color:'red',marginRight:'100px'}}>金额单位：元</div>
          </div>
          <div style={{marginTop:'-23px'}}><TableSearch columns = {column} dataSource={list} needSearch={needSearch} scroll={{ x: 1520 }}/></div>
        </div>
      </Spin>
    )
  }
}

