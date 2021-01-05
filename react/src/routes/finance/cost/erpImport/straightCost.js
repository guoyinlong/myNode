/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本erp成本导入-直接成本
 */
import React from 'react';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Input,Select,DatePicker,Row,Col,Button,Modal,Table,Popconfirm, Icon,Spin  } from 'antd';
const Option = Select.Option;
const { MonthPicker} = DatePicker;
import tableStyle from '../../../../components/common/table.less';
import styles from '../feeManager/costmainten.less';
import commonStyle from '../costCommon.css';
import {getOU,HideTextComp,MoneyComponent} from '../costCommon.js';
import exportExl from '../../../../components/commonApp/exportExl';
import { rightControl } from '../../../../components/finance/rightControl';
import * as config from '../../../../services/finance/costServiceConfig.js';
import EditItem from './editComponent.js';
import {TagDisplay} from '../costCommon.js'
class StraightCost extends React.PureComponent {
  state={
    OUs:[],
    OU:Cookie.get('OU')
  }
  // 查询
  straightQuery=(item)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'straightCost/straightSearch',
      formData:!rightControl(config.StraightRelease,this.props.rightCtrl)
              &&!rightControl(config.StraightCancelRelease,this.props.rightCtrl)
            ?{...item,'argstatecode':0}
            :{...item}
    });
  }
  // 月份改变时，进行查询
  onChangeDatePicker=(date, dateString)=>{
    this.setState({month:dateString})
    let formData={
      ou:this.state.OU,
      total_year_month:dateString
    }
    this.straightQuery(formData);
  }
    // ou改变时，进行查询
  OUhandleChange=(value)=>{
    this.setState({OU:value})
    let formData={
      ou:value,
      total_year_month:this.state.month||this.props.lastDate
    }
    this.straightQuery(formData);
  }
  // 点击导出按钮
  exportExcel=()=>{
    let {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    let tableId=document.querySelector("#exportTable table");
    let tableName=OU+month+'直接成本数据表';
    exportExl()(tableId,tableName)
  }
  // 同步操作
  syn=()=>{
    const {dispatch}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'straightCost/syn',
      searchPostData:{
        ou:OU,
        total_year_month:month
      }
    })
  };
  // 点击发布按钮操作
  issueData=()=>{
    const {dispatch}=this.props;
    let {tableId,dataList}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'straightCost/straightRelease',
      formData:{
        // transjsonarray:JSON.stringify([{
        //   update: {state_code:0},
        //   condition:{table_id:tableId || dataList[0].table_id}
        // }])
        arg_ou:OU,
        arg_batch_num:tableId || dataList[0].table_id,
      },
      searchFormData:{
        ou:OU,
        total_year_month:month
      }
    })
  }
  // 点击撤销发布按钮
  cancelIssue=()=>{
    const {dispatch}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'straightCost/straightCancelRelease',
      formData:{
        ou:OU,
        total_year_month:month
      }
    })
  }
  // 限制月份的选择
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  }
  componentWillMount(){
    const {dispatch}=this.props;
    let {OU}=this.state;
    let OUData=getOU('/straight_cost_mgt');
    OUData.then((data)=>{
      this.setState({
        OUs:data.DataRows,
      })
      if(data.DataRows.length!==0){
        // 查询最新有数据的月份，成功后进行查询直接成本数据
        // dispatch({
        //   type:'straightCost/searchDateIndirectStraight',
        //   formData:{
        //     argou:OU
        //   }
        // })

        // 根据权限进行查询
        dispatch({
          type:'straightCost/getRightCtrl',
          formDataRight:{
            argtenantid:Cookie.get('tenantid'),
            arguserid:Cookie.get('userid'),
            argmoduleid:window.sessionStorage['financeCostModuleId']
          },
          formDataQuery:{
            'argou': OU,
          }
        })
      }
    })
  }
  onCellChange = (dataIndex,record,history) => {
    const {dispatch}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'straightCost/updatefee',
      projCode : record.proj_code,
      feeName : dataIndex,
      deptName : record.dept_name,
      batchNum : record.table_id,
      feeValue : record['changedNewValue'] || history,
      searchPostData:{
        ou:OU,
        total_year_month:month
      }
    })
  };
  itemChange = (item) =>(e) => {
    let value = e.target.value;
    let isMinus = false;
    //如果以 — 开头
    if (value.indexOf('-') === 0) {
      isMinus = true;
    }

    //先将非数值去掉
    value = value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if(isMinus === true){
      value = '-' + value;
    }
    // if(this.props.changeValue){
    //   this.props.changeValue(value,this.props.feeName,this.props.record);
    // }
   item['changedNewValue'] = value;
  };
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  };
  render(){
    const {dataList,loading,rightCtrl}=this.props;
    let scrollX=0;
    let columns = [];
    if(dataList.length!=0){
      columns = [
        // { title: 'OU', width: 160, dataIndex: 'ou', key: 'ou', fixed: 'left' },
        {title:'序号',dataIndex:'key',width: 50,fixed: 'left',align: 'center'},
        { title: '部门', width: 100, dataIndex: 'dept_name', key: 'dept_name', fixed: 'left',render:(text)=><div>{text?text.split('-')[1]:text}</div>},
        { title: '项目编码',width: 120, dataIndex: 'proj_code', key: 'proj_code', fixed: 'left' },
        {title: 'pms编码',width: 120,dataIndex: 'pms_code',fixed: 'left'},
        {title: '项目状态',width: 90,dataIndex: 'proj_tag',fixed: 'left',align: 'center',render:(text)=><div style={{textAlign: 'center'}}><TagDisplay  proj_tag={text}/></div>},
        { title: '项目名称',width: 160, dataIndex: 'proj_name', key: 'proj_name', fixed: 'left'},
      ];
      for(let i=0;i<dataList[0].fee_name.length;i++){
        columns.push({
          title: dataList[0].fee_name[i],
          width:160,
          //render:(text,record)=><MoneyComponent text={record.fee[i]}/>this.state.value,this.props.feeName,this.props.record
          render: (text, item) => (
            <EditItem isEdit={false} show={<MoneyComponent text={item.fee[i]}/>}
                      edit={<Input
                        defaultValue={item.fee[i]} maxLength = "200"
                        onChange={this.itemChange(item)}
                      />}
                      disabled={dataList[0]&&dataList[0].state_code=='0'?true:false}
                      onOk={()=> this.onCellChange(dataList[0].fee_name[i],item,item.fee[i])}
                      onCancel={()=>this.itemCancel(item,dataList[0].fee_name[i],item.fee[i])}
            />
          ),
        });
      }
      columns.push({
        title: '项目成本合计',
        dataIndex:'sum_fee',
        width: 160,
        // fixed: 'right',
        render:(text)=><MoneyComponent text={text}/>
      });
      scrollX+=(dataList[0].fee_name.length)*160 + 800
    }
    return(
      <Spin spinning={loading}>
        <div className={commonStyle.container}>
          <span>部门/OU：
            <Select value={this.state.OU} onChange={this.OUhandleChange}  style={{minWidth:'180px'}}>
              {this.state.OUs.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)}
            </Select>
          </span>
          <span style={{display:'inline-block',margin:'0 20px'}}>
            月份：
            <MonthPicker onChange={this.onChangeDatePicker} value={moment(this.state.month?this.state.month:this.props.lastDate, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate}/>
          </span>
          {
            rightControl(config.StraightRelease,rightCtrl) ?
              <Popconfirm title="确定同步数据吗?" onConfirm={this.syn}  okText="确定" cancelText="取消">
                <Button type="primary" disabled={dataList[0]&&dataList[0].state_code=='0'?true:false}>同步</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }
          {
            rightControl(config.StraightRelease,rightCtrl) ?
              <Popconfirm title="确定发布数据吗?" onConfirm={this.issueData}  okText="确定" cancelText="取消">
                <Button type="primary"  disabled={dataList[0]&&dataList[0].state_code=='2'?false:true}>发布</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }

          {
            rightControl(config.StraightCancelRelease,rightCtrl) ?
              <Popconfirm title="确定撤销数据吗?" onConfirm={this.cancelIssue}  okText="确定" cancelText="取消">
                <Button type="primary"  disabled={dataList[0]&&dataList[0].state_code=='0'?false:true}>撤销</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }

          <Button type="primary" onClick={this.exportExcel} disabled={dataList[0]?false:true}>导出</Button>&nbsp;&nbsp;

          <div className={styles.costmaintenTable+' '+tableStyle.orderTable_smallSize} style={{marginTop:'15px'}}>
            <p style={{height:'15px'}}>
              <span style={{float:'left'}}>状态：<span style={{color:'red'}}>{dataList[0]?dataList[0].state_name:''}</span></span>
              <span style={{float:'right'}}>金额单位：元</span>
            </p>
            <Table  columns={columns} dataSource={dataList} scroll={{ x: scrollX, y: 500 }} pagination={false}  />
          </div>
          <div id='exportTable' className={styles.costmaintenTable+' '+tableStyle.orderTable_smallSize} style={{display:"none"}}>
            <Table columns={columns} dataSource={dataList} pagination={false}/>
          </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  const {dataList,lastDate,rightCtrl,tableId}=state.straightCost;
  return {
    dataList:dataList,
    lastDate,
    loading:state.loading.models.straightCost,
    rightCtrl,
    tableId,
  };
}

export default connect(mapStateToProps)(StraightCost);
