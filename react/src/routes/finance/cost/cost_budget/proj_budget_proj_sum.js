/**
 * 作者：李杰双
 * 创建日期：2017/10/30
 * 邮件：282810545@qq.com
 * 文件说明：项目全成本汇总页面
 */

import React from 'react';
import { connect } from 'dva';
import { Table, Button, Select, Spin, message, Tooltip } from 'antd';
import exportExl from '../../../../components/commonApp/exportExl'
import Styles from '../../../../components/cost/cost_budget.less'
import OUComponent from './OUComponent'
import Cookies from 'js-cookie'
import {TagDisplay} from '../costCommon.js'
const Option = Select.Option;
function tdAddClassName(columns) {
  columns.forEach((i,index)=>{
    if(i.dataIndex&&!i.fixed){
      if(i.title!=='项目周期(月)'){
        if(!i.render){
          columns[index].render=(text)=><div style={{textAlign:'right'}}>{parseFloat(text)===0?'-':text}</div>
        }

      }

    }else if(i.children){
      tdAddClassName(columns[index].children)
    }
  })

}
const yearArr=[(new Date().getFullYear()-3).toString(),(new Date().getFullYear()-2).toString(),(new Date().getFullYear()-1).toString(),(new Date().getFullYear()).toString()]
class Proj_budget_proj_sum extends React.Component{
  state={
    currPro:'',
    dataReady:false,
    year:new Date().getFullYear().toString()
  }
  columnList=[
    {
      title:'序号',
      dataIndex:'num',
      width:60,
      fixed:'left',
      // render:(text)=><Tooltip placement="top" title={text}>
      //   <div  style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:137}}>{text}</div>
      // </Tooltip>
    },
    {
      title:'ou',
      dataIndex:'ou',
      width:80,
      fixed:'left'
    },
    {
      title:'归属部门',
      dataIndex:'dept_name',
      width:80,
      fixed:'left',
      render:(text)=>{
        return (text||'').includes('-') ?text.split('-')[1]:text;
      },
    },
    {
      title:'项目编号',
      dataIndex:'proj_code',
      width:115,
      fixed:'left'
    },
    {
      title:'PMS编号',
      dataIndex:'pms_code',
      width:115,
      fixed:'left'
    },
    {
      title:'项目名称',
      dataIndex:'proj_name',
      width:100,
      fixed:'left',
      // render:(text)=><Tooltip placement="top" title={text}>
      //   <div  style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:137}}>{text}</div>
      // </Tooltip>
    },
    {
      title:'项目状态',
      dataIndex:'proj_tag',
      width:80,
      fixed:'left',
      render:(text)=><TagDisplay proj_tag={text}/>
    },
    {
      title:'基本信息',
      children:[
        {
          title:'投资替代额(万元)',
          dataIndex:'replace_money',
          width:150,
        },
        {
          title:'结算后投资替代额(万元)',
          dataIndex:'replace_money_use',
          width:150,
        },
        {
          title:'预估工作量-对内(人/月)',
          dataIndex:'fore_workload',
          width:150,
        },
        {
          title:'年化人数',
          dataIndex:'hum_num',
          width:150,
        },
      ]
    },
    {
      title:'预算执行情况',
      children:[
        {
          title:'全成本全年预算(万元)',
          dataIndex:'budget_fee_year',
          width:150,
        },
        {
          title:'全成本全年实际发生(万元)',
          dataIndex:'total_year_fee',
          width:150,
        },
        {
          title:'全成本预算执行百分比',
          dataIndex:'budget_rate',
          width:150,
          render:(text)=>{
            if(parseFloat(text)>100)
              return(<div style={{textAlign:'right',color:'red'}}>{text}</div>);
            else{
              return(<div style={{textAlign:'right'}}>{text}</div>)
            }
          }
        },
        {
          title:'人工成本预算(万元)',
          dataIndex:'labour_budget',
          width:150,
        },
        {
          title:'人工成本全年已发生(万元)',
          dataIndex:'labour_cost',
          width:150,
        },
        {
          title:'人工成本全年执行百分比',
          dataIndex:'labour_rate',
          width:150,
          render:(text)=>{
            if(parseFloat(text)>100)
              return(<div style={{textAlign:'right',color:'red'}}>{text}</div>);
            else{
              return(<div style={{textAlign:'right'}}>{text}</div>)
            }
          }
        },
        {
          title:'差旅全年预算(万元)',
          dataIndex:'travel_budget',
          width:150,
        },
        {
          title:'差旅全年已发生(万元)',
          dataIndex:'travel_cost',
          width:150,
        },
        {
          title:'差旅全年执行百分比',
          dataIndex:'travel_rate',
          width:150,
          render:(text)=>{
            if(parseFloat(text)>100)
              return(<div style={{textAlign:'right',color:'red'}}>{text}</div>);
            else{
              return(<div style={{textAlign:'right'}}>{text}</div>)
            }
          }
        },
      ]
    },
    {
      title:'成本指标',
      children:[
        {
          title:'年人均产能(万元)',
          dataIndex:'year_per_capacity',
          width:150,
        },
        {
          title:'年人均全成本(万元)',
          dataIndex:'year_per_cost',
          width:150,
        },
        {
          title:'年人均差旅(万元)',
          dataIndex:'year_per_travel',
          width:150,
        },
        {
          title:'投入产出比',
          dataIndex:'income_rate',
          width:150,
          render:(text)=>{
            if(parseFloat(text)< 1 )
              return(<div style={{textAlign:'right',color:'red'}}>{text}</div>);
            else{
              return(<div style={{textAlign:'right'}}>{text}</div>)
            }
          }
        },
      ]
    },
    {
      title:'人工成本分布情况',
      children:[
        {
          title:'人工成本全年预算-总院（万元）',
          dataIndex:'labour_budget_benbu',
          width:150,
        },
        {
          title:'人工成本全年已发生-总院（万元）',
          dataIndex:'labour_cost_benbu',
          width:150,
        },
        {
          title:'人工成本全年预算-哈尔滨（万元）',
          dataIndex:'labour_budget_haerbin',
          width:150,
        },
        {
          title:'人工成本全年已发生-哈尔滨（万元）',
          dataIndex:'labour_cost_haerbin',
          width:150,
        },
        {
          title:'人工成本全年预算-济南（万元）',
          dataIndex:'labour_budget_jinan',
          width:150,
        },
        {
          title:'人工成本全年已发生-济南（万元）',
          dataIndex:'labour_cost_jinan',
          width:150,
        },
        {
          title:'人工成本全年预算-广州（万元）',
          dataIndex:'labour_budget_guangzhou',
          width:150,
        },
        {
          title:'人工成本全年已发生-广州（万元）',
          dataIndex:'labour_cost_guangzhou',
          width:150,
        },
        {
          title:'人工成本全年预算-西安（万元）',
          dataIndex:'labour_budget_xian',
          width:150,
        },
        {
          title:'人工成本全年已发生-西安（万元）',
          dataIndex:'labour_cost_xian',
          width:150,
        },
        {
          title:'人工成本全年预算-南京（万元）',
          dataIndex:'labour_budget_nanjing',
          width:150,
        },
        {
          title:'人工成本全年已发生-南京（万元）',
          dataIndex:'labour_cost_nanjing',
          width:150,
        },
      ]
    },
    {
      title:'差旅分布情况',
      children:[
        {
          title:'差旅全年预算-总院（万元）',
          dataIndex:'travel_budget_benbu',
          width:150,
        },
        {
          title:'差旅全年已发生-总院（万元）',
          dataIndex:'travel_cost_benbu',
          width:150,
        },
        {
          title:'差旅全年预算-哈尔滨（万元）',
          dataIndex:'travel_budget_haerbin',
          width:150,
        },
        {
          title:'差旅全年已发生-哈尔滨（万元）',
          dataIndex:'travel_cost_haerbin',
          width:150,
        },
        {
          title:'差旅全年预算-济南（万元）',
          dataIndex:'travel_budget_jinan',
          width:150,
        },
        {
          title:'差旅全年已发生-济南（万元）',
          dataIndex:'travel_cost_jinan',
          width:150,
        },
        {
          title:'差旅全年预算-广州（万元）',
          dataIndex:'travel_budget_guangzhou',
          width:150,
        },
        {
          title:'差旅全年已发生-广州（万元）',
          dataIndex:'travel_cost_guangzhou',
          width:150,
        },
        {
          title:'差旅全年预算-西安（万元）',
          dataIndex:'travel_budget_xian',
          width:150,
        },
        {
          title:'差旅全年已发生-西安（万元）',
          dataIndex:'travel_cost_xian',
          width:150,
        },
        {
          title:'差旅全年预算-南京（万元）',
          dataIndex:'travel_budget_nanjing',
          width:150,
        },
        {
          title:'差旅全年已发生-南京（万元）',
          dataIndex:'travel_cost_nanjing',
          width:150,
        },
      ]
    }
  ]
  onChange=(key)=>(value)=>{
    this.state[key]=value
    this.searchHandle()
  }
  searchHandle=()=>{
    let {ou, year}= this.state
    if(!ou){
      message.error('请选择OU！')
    }
    if(!year){
      message.error('请选择年份！')
    }
    this.props.dispatch({
      type:'proj_budget_proj_sum/search_proc',
      arg_ou:this.state.ou==='联通软件研究院'?undefined:this.state.ou,
      arg_year:this.state.year
    })

  }
  exportTable=()=>{
    let thead=document.querySelector('#table1 .ant-table-scroll .ant-table-header table thead').cloneNode(true);
    let tbody=document.querySelector('#table1 .ant-table-scroll .ant-table-body table tbody').cloneNode(true);
    let expTable=document.createElement('table')
    expTable.appendChild(thead)
    expTable.appendChild(tbody)
    exportExl()(expTable,`全成本汇总-${this.state.ou}-${this.state.year}年`)
  }
  render(){
    let {list, loading, v_remarks, v_remarks_month} = this.props;
    if(list.length){
      list.forEach((i,index)=>i.num = index+1)
    }
    tdAddClassName(this.columnList)
    return(
      <Spin spinning={loading||!this.state.dataReady}>
      <div className={Styles.wrap}>
        <div className={Styles.searchTitle}>
          <OUComponent value={this.state.ou} argrouterurl={'/full_cost_total'} onChange={this.onChange('ou')} dataReady={(state,value)=>{
            this.setState({dataReady:state,ou:Cookies.get('OU')},()=>this.searchHandle());

          }}/>
          <span>
            年份：&nbsp;<Select value={this.state.year} onChange={this.onChange('year')} style={{width:200}} placeholder='请选择年份'>
            {
              yearArr.map((i,index)=><Option key={index} value={i}>{i}</Option>)

            }
            </Select>
          </span>

          {/*<Button type='primary' onClick={this.searchHandle}>查询</Button>*/}
          <Button disabled={!list.length} type='primary' onClick={this.exportTable}>导出</Button>
        </div>
        <div className={Styles.marks}>
          <h3>{v_remarks_month}</h3>
          {
            v_remarks?<p>注：{v_remarks}</p>:null
          }
        </div>
        <div className={Styles.orderTable_small} style={{minHeight:'500px'}} id='table1'>
          {
            list.length
              ?<Table rowKey='proj_code'   columns={this.columnList} dataSource={list}  pagination={false} scroll={{ x: 6180,y:400}} />
              :null

          }
        </div>

      </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  const { list, v_remarks, v_remarks_month} = state.proj_budget_proj_sum;

  return {
    list,
    v_remarks,
    v_remarks_month,
    loading: state.loading.models.proj_budget_proj_sum,
  };
}
export default connect(mapStateToProps)(Proj_budget_proj_sum)

