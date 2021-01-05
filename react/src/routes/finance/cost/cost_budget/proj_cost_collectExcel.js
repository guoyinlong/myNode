/**
 * 作者：李杰双
 * 日期：2017/11/7
 * 邮件：282810545@qq.com
 * 文件说明：全成本分类汇总表
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Button, Select, Spin, message, DatePicker,Tooltip } from 'antd';
import exportExl from '../../../../components/commonApp/exportExl'
import Styles from '../../../../components/cost/cost_budget.less'
import OUComponent from './OUComponent'
import ConstData from '../../../../utils/config'
import moment from 'moment'
import Cookies from 'js-cookie'
import {TagDisplay} from '../costCommon.js'
const { MonthPicker } = DatePicker;

const Option = Select.Option;

const StartYearMonth ='2016-01';
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
class Proj_budget_proj_sum extends React.Component{
  state={
    currPro:'',
    dataReady:false
  };
  columnList=[
    {
      title:'序号',
      dataIndex:'key',
      width:50,
      fixed:'left',
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 0,
            },
          };
        }
        return<div>{text}</div>
      },
    },
    {
      title:'项目类别',
      dataIndex:'项目类别',
      width:80,
      fixed:'left',
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 7,
            },
          };
        }
        return text

      }
    },
    {
      title:'OU',
      dataIndex:'OU',
      width:100,
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 0,
            },
          };
        }
        return text
      },
      fixed:'left',
    },
    {
      title:'项目编码',
      dataIndex:'项目编码',
      width:120,
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 0,
            },
          };
        }
        return text
      },
      fixed:'left'
    },
    {
      title:'PMS编码',
      dataIndex:'pms_code',
      width:110,
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 0,
            },
          };
        }
        return text || ''
      },
      fixed:'left'
    },
    {
      title:'项目名称',
      dataIndex:'项目名称',
      width:150,
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 0,
            },
          };
        }
        return text
      },
      fixed:'left'
    },
    {
      title:'项目状态',
      dataIndex:'proj_tag',
      width:80,
      fixed:'left',
      render:(text, record)=>{
        if(record.flag){
          return {
            children: <div style={{textAlign:'center'}}>{record.flag}</div>,
            props: {
              colSpan: 0,
            },
          };
        }
        return <TagDisplay proj_tag={text}/>
      },
    },
    {
      title:'基本信息',
      children:[
        {
          title:'投资替代额(万元)',
          dataIndex:'投资替代额（万元）',
          width:150,
        },
        {
          title:'结算后投资替代额(万元)',
          dataIndex:'实际投资替代额',
          width:150,
        },
        {
          title:'预估工作量-对内(人/月)',
          dataIndex:'全年预计工作量（人月）',
          width:150,
        },
        {
          title:'项目周期(月)',
          dataIndex:'项目周期(月)',
          width:200,
        },
        {
          title:'年化人数',
          dataIndex:'年化人数',
          width:150,
        },
      ]
    },
    {
      title:'预算执行情况',
      children:[
        {
          title:'全成本',
          children:[
            {
              title:'全成本预算(万元)',
              dataIndex:'全成本全年预算（万元）',
              width:150,
            },
            {
              title:'全成本实际发生(万元)',
              dataIndex:'全成本全年实际发生（万元）',
              width:150,
            },
            {
              title:'全成本预算执行百分比',
              dataIndex:'全成本预算执行百分比',
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
          title:'其中：①人工成本',
          children:[
            {
              title:'人工成本预算（万元）',
              dataIndex:'人工成本预算（万元）',
              width:150,
            },
            {
              title:'人工成本已发生（万元）',
              dataIndex:'人工成本全年已发生（万元）',
              width:150,
            },
            {
              title:'完成百分比',
              dataIndex:'人工成本完成百分比',
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
          title:'其中：②差旅费',
          children:[
            {
              title:'差旅预算（万元）',
              dataIndex:'差旅预算（万元）',
              width:150,
            },
            {
              title:'差旅已发生（万元）',
              dataIndex:'差旅已发生（万元）',
              width:150,
            },
            {
              title:'差旅执行百分比',
              dataIndex:'差旅执行百分比',
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
        }

      ]
    },
    {
      title:'主要指标',
      children:[
        {
          title:'模拟利润',
          dataIndex:'模拟利润',
          width:150,
        },
        {
          title:'投入产出比',
          dataIndex:'投入产出比',
          width:150,
          render:(text)=>{
            if(parseFloat(text)<1)
              return(<div style={{textAlign:'right',color:'red'}}>{text}</div>);
            else{
              return(<div style={{textAlign:'right'}}>{text}</div>)
            }
          }
        },
        {
          title:'人均产能（万元）',
          dataIndex:'人均产能（万元）',
          width:150,
        },
        {
          title:'人均全成本（万元）',
          dataIndex:'人均全成本（万元）',
          width:150,
        },
        {
          title:'人均差旅（万元）',
          dataIndex:'人均差旅（万元）',
          width:150,
        },

      ]
    }
  ];
  onDateChangeB=(value)=>{
    this.props.dispatch({
      type:'proj_cost_collectExcel/collectionServlet',
      argou:this.props.ouName,
      beginTime:value,
      endTime:this.props.endTime
    })
  };
  onDateChangeE=(value)=>{
    this.props.dispatch({
      type:'proj_cost_collectExcel/collectionServlet',
      argou:this.props.ouName,
      beginTime:this.props.beginTime,
      endTime:value
    })
  };
  ouInitChangeHandle=(ou)=>{
    this.props.dispatch({
      type:'proj_cost_collectExcel/search_month',
      argou:ou,
    })
  };
  //改变ou
  ouChangeHandle=(ou)=>{
    this.props.dispatch({
      type:'proj_cost_collectExcel/collectionServlet',
      argou:ou,
      beginTime:this.props.beginTime,
      endTime:this.props.endTime,
    })
  };
  //统计类型改变
  stateParamChange=(value)=>{
    let {dispatch} = this.props;
    dispatch({
      type:'proj_cost_collectExcel/changeStateParam',
      stateParam:value,
      ou:this.props.ouName,
    });
  };
  exportTable=()=>{
    let thead=document.querySelector('#table1 .ant-table-scroll .ant-table-header table thead').cloneNode(true);
    let tbody=document.querySelector('#table1 .ant-table-scroll .ant-table-body table tbody').cloneNode(true);
    let expTable=document.createElement('table');
    expTable.appendChild(thead);
    expTable.appendChild(tbody);
    exportExl()(expTable,`全成本分类汇总-${this.props.ouName}-${this.props.beginTime.format('YYYY-MM')}至${this.props.endTime.format('YYYY-MM')}`)
  };
  disabledDate=(currentDate)=>{

    // let { months} = this.props;
    // let {total_month, total_year}=months[0];
    // console.log(total_month)
    //console.log(dateRes);
    // debugger;
    // return dateRes.isAfter(total_year+'-'+total_month)||dateRes.isBefore(StartYearMonth)
    if(currentDate){
      let lastDate =  moment().valueOf();
      return currentDate.valueOf() > lastDate
    }
  };
  render(){
    let {list, loading, v_remarks, v_remarks_month, ouName} = this.props;
    tdAddClassName(this.columnList);
    let dataList=[];
    list.forEach(i=>{
      //debugger
      if(i['数据集']){
        i['数据集'].forEach(k=>{
          dataList.push(k)
        })
      }
      if(i['小计']){
        dataList.push({...i['小计'][0],flag:'小计'})
      }
      if(i['合计']){
        dataList.push({...i['合计'],flag:'合计'})
      }


    });
//手动给每一个list一个key，不然表格数据会报错
    if (dataList.length) {
      dataList.forEach((i, index) => {
        i.key = index+1;
      })
    }

    return(
      <Spin spinning={loading||!this.state.dataReady || this.props.loading }>
        <div className={Styles.wrap}>
          <div className={Styles.searchTitle}>
            <OUComponent
              value={ouName}
              argrouterurl={'/full_cost_subtotal'}
              onChange={this.ouChangeHandle}
              dataReady={(state)=>{this.setState({dataReady:state,ou:Cookies.get('OU')},()=>this.ouInitChangeHandle(Cookies.get('OU')))}}
            />
            <span style={{display:'inline-block',marginRight:'20px'}}>统计类型：
            <Select
              value={this.props.stateParam}
              onChange={this.stateParamChange}
              style={{minWidth:'125px'}}
            >
              <Option key="1" value="1">月统计</Option>
              <Option key="2" value="2">年统计</Option>
              <Option key="3" value="3">项目至今统计</Option>
              <Option key="4" value="4">自定义</Option>
            </Select>
          </span>
            {
              this.props.stateParam !== '3' ?
                <span>
                  开始时间：&nbsp;
                      <MonthPicker
                        value={this.props.beginTime}
                        disabledDate={this.disabledDate}
                        onChange={this.onDateChangeB}
                        disabled={!(this.props.stateParam ==='4')}
                        placeholder="请选择年月"
                        allowClear={false}
                        className={Styles.dateInput}
                      />
                </span>
                :
                null
            }
            <span>
              结束时间：&nbsp;
              <MonthPicker
                value={this.props.endTime}
                disabledDate={this.disabledDate}
                onChange={this.onDateChangeE}
                disabled={!(this.props.stateParam ==='4')}
                placeholder="请选择年月"
                allowClear={false}
                className={Styles.dateInput}
              />
            </span>

            {/*<Button type='primary' onClick={this.searchHandle}>查询</Button>*/}
            <div style={{marginTop:'10px',textAlign:'right'}}><Button disabled={!list.length} type='primary' onClick={this.exportTable}>导出</Button></div>
          </div>
          <div className={Styles.marks}>
            <h3>{v_remarks_month}</h3>
            {
              v_remarks?<p>注：{v_remarks}</p>:null
            }

          </div>
          <div className={Styles.orderTable_small} style={{paddingTop:'20px',minHeight:'500px'}} id='table1'>
            {
              list.length
                ?
                <div>
                  <Table rowClassName={(record)=>{
                    if (record.flag){
                      return Styles.hjTr
                    }
                    return ''
                  }
                  }    columns={this.columnList} dataSource={dataList}  pagination={false} scroll={{ x: 3590,y:400}} />
                  <p style={{marginTop:"20px"}}>
                    <p>注：</p>
                    <p>项目至今统计：预算数为项目总预算，即平台中所填预算总和。</p>
                    <p>自定义：预算数为统计区间内的年度预算数加和，以前年份取12月预算。</p>
                  </p>
                </div>
                :null

            }
          </div>

        </div>
      </Spin>
    )
  }
}
function mapStateToProps(state) {
  //const { list, v_remarks, v_remarks_month, months, argou, ouName} = state.proj_cost_collectExcel;

  return {
    loading: state.loading.models.proj_cost_collectExcel,
    ...state.proj_cost_collectExcel,
  };
}
export default connect(mapStateToProps)(Proj_budget_proj_sum)
