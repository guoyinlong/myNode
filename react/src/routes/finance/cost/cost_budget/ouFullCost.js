/**
 * 作者：陈红华
 * 创建日期：2017-10-25
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本第五部分：项目全成本管理-OU/部门项目全成本预算完成情况汇总页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import moment from 'moment';
import tableStyle from '../../../../components/common/table.less';
import styles from '../feeManager/costmainten.less';
import commonStyle from '../costCommon.css';
import exportExl from '../../../../components/commonApp/exportExl';
import { Select,DatePicker,Row,Col,Button,Modal,Table,Popconfirm,Spin } from 'antd';
const Option = Select.Option;
const { MonthPicker} = DatePicker;
import {getOU} from '../costCommon.js';
import { rightControl } from '../../../../components/finance/rightControl';
import * as config from '../../../../services/finance/costServiceConfig.js';

class OuFullCost extends React.Component {
  state={
    OUs:[],
    OU:Cookie.get("OU"),
    stateParam:'1',//统计类型：默认为月统计
  };
  // 查询
  ouFullCostQuery=(item)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'ouFullCost/ouFullCostQuery',
      formData:!rightControl(config.OuFullCostPublish,this.props.rightCtrl)
              &&!rightControl(config.OuFullCostUnpublish,this.props.rightCtrl)
              &&!rightControl(config.OuFullCostCreate,this.props.rightCtrl)
            ?{'arguserid': Cookie.get('userid'),...item,'argstatecode':0}
            :{'arguserid': Cookie.get('userid'),...item}
    });
  }
  // 改变OU时
  OUhandleChange=(value)=>{
    let {dataList}=this.props;
    const {stateParam}=this.state;
    let yearMonth=this.state.yearMonth||this.props.lastDate;
    this.setState({OU:value})
    let formData={
      'argyear': new Date(yearMonth).getFullYear(),
      'argmonth': new Date(yearMonth).getMonth()+1,
      'argou': value,
      'argtotaltype':stateParam
    }
    this.ouFullCostQuery(formData);
  }
  // 改变年月
  onChangeDatePicker=(date, dateString)=>{
    const {OU,stateParam}=this.state;
    this.setState({yearMonth:dateString})
    let formData={
      'argyear': new Date(dateString).getFullYear(),
      'argmonth': new Date(dateString).getMonth()+1,
      'argou': OU,
      'argtotaltype':stateParam
    }
    this.ouFullCostQuery(formData);
  }
  // 改变统计类型
  stateParamChange=(value)=>{
    const {OU}=this.state;
    let yearMonth=this.state.yearMonth||this.props.lastDate;
    this.setState({stateParam:value})
    let formData={
      'argyear': new Date(yearMonth).getFullYear(),
      'argmonth': new Date(yearMonth).getMonth()+1,
      'argou': OU,
      'argtotaltype':value
    }
    this.ouFullCostQuery(formData);
  }
  // 点击发布按钮or撤销发布按钮；tag=>0:发布，1：撤销发布
  ouFullCostPublish=(tag)=>{
    const {OU,stateParam}=this.state;
    let yearMonth=this.state.yearMonth||this.props.lastDate;
    let {dispatch}=this.props;
    dispatch({
      type:tag=='0'?'ouFullCost/ouFullCostPublish':'ouFullCost/ouFullCostUnpublish',
      formData:{
        'arguserid': Cookie.get('userid'),
        'argyear': new Date(yearMonth).getFullYear(),
        'argmonth': new Date(yearMonth).getMonth()+1,
        'argou': OU,
        'argtotaltype':stateParam
      }
    });
  }
  // 点击生成按钮
  ouFullCostCreate=()=>{
    const {OU,stateParam}=this.state;
    let yearMonth=this.state.yearMonth||this.props.lastDate;
    let {dispatch}=this.props;
    dispatch({
      type:'ouFullCost/ouFullCostCreate',
      formData:{
        'argmoduleid':window.sessionStorage.financeCostModuleId,
        'argtenantid':Cookie.get('tenantid'),
        'arguserid': Cookie.get('userid'),
        'argyear': new Date(yearMonth).getFullYear(),
        'argmonth': new Date(yearMonth).getMonth()+1,
        'argou': OU,
        'argtotaltype':stateParam
      }
    });
  }
  //点击导入年化人数按钮
  import_year_men=()=>{
    let yearMonth=this.state.yearMonth||this.props.lastDate;
    let {dispatch}=this.props;
    dispatch({
      type:'ouFullCost/import_year_men',
      formData:{
        'argyear': new Date(yearMonth).getFullYear(),
        'argmonth': new Date(yearMonth).getMonth()+1,
        'argou': this.state.OU
      }
    });
  }
  // 点击导出按钮
  exportTable=()=>{
    let {OU}=this.state;
    let yearMonth=this.state.yearMonth||this.props.lastDate;
    var tableId=document.querySelector("#exportTable table");
    var tableName=OU+yearMonth+'OU/部门项目全成本预算完成情况汇总表';
    exportExl()(tableId,tableName)
  }
  // 限制月份的选择
  disabledDate=(value)=>{
    if(value){
      let lastDate =!rightControl(config.OuFullCostPublish,this.props.rightCtrl)
                    &&!rightControl(config.OuFullCostUnpublish,this.props.rightCtrl)
                    &&!rightControl(config.OuFullCostCreate,this.props.rightCtrl)
                  ? moment(this.props.lastDate).valueOf()
                  : moment().valueOf();
      return value.valueOf() > lastDate
    }
  };

  // 页面初始化查询
  componentWillMount(){
    const {dispatch}=this.props;
    let {OU,stateParam}=this.state;
    var OUData=getOU('/ou_full_cost_mgt');
    OUData.then((data)=>{
      this.setState({
        OUs:data.DataRows,
      })
      if(data.DataRows){
        // 获取权限并进行查询
        dispatch({
          type:'ouFullCost/getRightContrl',
          formDataRight:{
            argtenantid:Cookie.get('tenantid'),
            arguserid:Cookie.get('userid'),
            argmoduleid:window.sessionStorage['financeCostModuleId']
          },
          formDataQuery:{
            'arguserid': Cookie.get('userid'),
            'argou': OU,
            'argtotaltype':stateParam //统计类型
          }
        })

        // 查询统计类型
        dispatch({
          type:'ouFullCost/stateParamQuery',
          formData:{
            'argstatetype': 2,
            'argstatemode': 5
          }
        })
      }
    })
  }
  render(){
    const {stateParamList,columns,dataList,columnsWidth,state_code,loading,rightCtrl}=this.props;
    let state_name;
    if(state_code=='0'){
      state_name='已发布';
    }else if(state_code=='2'){
      state_name='待审核';
    }else if(state_code=='999'){
      state_name='待生成';
    }
    return(
      <Spin spinning={ loading }>
        <div className={commonStyle.container}>
          <span>OU：
            <Select value={this.state.OU} onChange={this.OUhandleChange}  style={{ width: 200}}>
              {this.state.OUs.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)}
            </Select>
          </span>
          <span style={{display:'inline-block',margin:'0 20px'}}>
            月份：
            <MonthPicker onChange={this.onChangeDatePicker} disabledDate={this.disabledDate} value={moment(this.state.yearMonth?this.state.yearMonth:this.props.lastDate, 'YYYY-MM')} allowClear={false} />
          </span>
          <span style={{display:'inline-block',marginRight:'20px'}}>
            统计类型：
            <Select value={stateParamList[0]?this.state.stateParam||stateParamList[0].state_code:null} onChange={this.stateParamChange} style={{minWidth:'125px'}}>
              {stateParamList.map((i,index)=><Option key={index} value={i.state_code}>{i.state_name}</Option>)}
            </Select>
          </span>

          {
            rightControl(config.OuFullCostCreate,rightCtrl) ?
              <Popconfirm title="确定生成本月数据吗?" onConfirm={this.ouFullCostCreate}  okText="确定" cancelText="取消">
                <Button type="primary" disabled={state_code=='2'||state_code=='999'?false:true} >生成</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }
          {
            rightControl(config.OuFullCostPublish,rightCtrl) ?
              <Popconfirm title="确定发布本月数据吗?" onConfirm={()=>this.ouFullCostPublish('0')}  okText="确定" cancelText="取消">
                <Button type="primary" disabled={state_code=='2'?false:true} >发布</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }

          {
            rightControl(config.OuFullCostUnpublish,rightCtrl) ?
              <Popconfirm title="确定撤销本月数据吗?" onConfirm={()=>this.ouFullCostPublish('1')}  okText="确定" cancelText="取消">
                <Button type="primary" disabled={state_code=='0'?false:true} >撤销</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }

          <Button type="primary" disabled={dataList[0]?false:true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
          <Popconfirm title="确定导入本月年化人数吗?" onConfirm={this.import_year_men} okText="确定" cancelText="取消">&nbsp;&nbsp;
            <Button type="primary" disabled={state_code=='0'?false:true}>导入年化人数</Button>
          </Popconfirm>
          <div className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{marginTop:'15px'}}>
            <p style={{height:'15px'}}>
              <span style={{float:'left'}}>状态：<span style={{color:'red'}}>{state_name}</span></span>
              <span style={{float:'right'}}>金额单位：元</span>
            </p>
            <Table columns={columns} dataSource={dataList} scroll={{ x: columnsWidth, y: 400 }} pagination={false}/>
          </div>
          <div id='exportTable' className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{display:"none"}}>
            <Table columns={columns} dataSource={dataList} pagination={false} />
          </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  const {dataList,stateParamList,columns,columnsWidth,lastDate,state_code,rightCtrl,loading }=state.ouFullCost;
  return {
    dataList,
    stateParamList,
    columns,
    columnsWidth,
    lastDate,
    state_code,
    rightCtrl,
    loading:state.loading.models.ouFullCost || loading ,
  };
}
export default connect(mapStateToProps)(OuFullCost);
