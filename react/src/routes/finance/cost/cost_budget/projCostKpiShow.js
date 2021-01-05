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
import { Select,DatePicker,Row,Col,Button,Modal,Table,Spin } from 'antd';
import exportExl from '../../../../components/commonApp/exportExl';
const Option = Select.Option;
const { MonthPicker} = DatePicker;
import {getOU} from '../costCommon.js';
import config from '../../../../utils/config';

/**
 * 作者：陈红华
 * 创建日期：2017-11-01
 * 功能：获取OU对应的1，2，3，4
 */
 // function getArgou (value){//value为ou的名字
 //  //  let argou;
 //   if(value==config.OU_NAME_CN){
 //      return 1;
 //   }else if(value==config.OU_HQ_NAME_CN){
 //      return 2;
 //   }else if(value==config.OU_JINAN_NAME_CN){
 //      return 3;
 //   }else if(value==config.OU_HAERBIN_NAME_CN){
 //      return 4;
 //   }
 // }

class ProjCostKpiShow extends React.Component {
  state={
    OUs:[],
    OU:Cookie.get("OU"),
  };
  // 改变OU时
  OUhandleChange=(value)=>{
    const {dispatch}=this.props;
    this.setState({OU:value});
    dispatch({
      type:'projCostKpiShow/projCostKpiShowQuery',
      argou : value,
      beginTime:this.props.beginTime,
      endTime:this.props.endTime,
    });
  };
  //统计类型改变
  stateParamChange=(value)=>{
    let {dispatch} = this.props;
    dispatch({
      type:'projCostKpiShow/changeStateParam',
      stateParam:value,
      argou:this.state.OU,
      beginTime:this.props.beginTime,
      endTime:this.props.endTime,
    });
  };
  onDateChangeB=(value)=>{
    this.props.dispatch({
      type:'projCostKpiShow/projCostKpiShowQuery',
      argou:this.state.OU,
      beginTime:value,
      endTime:this.props.endTime,
    })
  };
  onDateChangeE=(value)=>{
    this.props.dispatch({
      type:'projCostKpiShow/projCostKpiShowQuery',
      argou:this.state.OU,
      beginTime:this.props.beginTime,
      endTime:value,
    })
  };
  // 点击导出按钮
  exportTable=()=>{

    let {OU}=this.state;
    let tableId=document.querySelector("#exportTableProj table");
    let tableName=OU+this.props.beginTime.format('YYYY-MM')+'至'+this.props.endTime.format('YYYY-MM')+'项目全成本指标展示';
    exportExl()(tableId,tableName);
    // let argou=getArgou(OU);
    // let year=new Date(yearMonth).getFullYear();
    // let month=new Date(yearMonth).getMonth()+1;
    // var exporturl='/microservice/cosservice/exportprogresschart/allcost/exportProgressChartServlet?'+'argou='+argou+'&argyear='+year+'&argmonth='+month;
    // window.open(exporturl);
  };
  // 控制时间控件的可选范围
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment(this.props.lastDate).valueOf();
      return value.valueOf() > lastDate
    }
  };
  // 页面初始化查询
  componentWillMount(){
    const {dispatch}=this.props;
    let { OU }=this.state;
    let OUData=getOU('/full_cost_progress_chart');
    OUData.then((data)=>{
      this.setState({OUs:data.DataRows});
      if(data.DataRows){
        //let argou=getArgou(OU);
        dispatch({
          type:'projCostKpiShow/projCostKpiShowLastDate',
          formData:{
            argou : OU
          }
        });
      }
    })
  }
  render(){
    const {dataList,columns,columnsWidth,loading,RetVal}=this.props;
    if(dataList && dataList.length){
      dataList.forEach((i,index)=>i.num = index+1);
    }
    return(
      <Spin spinning={loading || this.props.loading }>
        <div className={commonStyle.container}>
          <span style={{display:'inline-block',marginRight:'20px'}}>OU：
            <Select value={this.state.OU} onChange={this.OUhandleChange}  style={{ width: 200}}>
              {this.state.OUs.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)}
            </Select>
          </span>
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
            this.props.stateParam !== '3'?
              <span style={{display:'inline-block',marginRight:'20px'}}>
                开始时间：&nbsp;
                <MonthPicker
                  value={this.props.beginTime}
                  disabledDate={this.disabledDate}
                  onChange={this.onDateChangeB}
                  disabled={!(this.props.stateParam ==='4')}
                  placeholder="请选择年月"
                  allowClear={false}
                  className={styles.dateInput}
                />
              </span>
              :
              null
          }
          <span style={{display:'inline-block'}}>
                结束时间：&nbsp;
              <MonthPicker
                value={this.props.endTime}
                disabledDate={this.disabledDate}
                onChange={this.onDateChangeE}
                disabled={!(this.props.stateParam ==='4')}
                placeholder="请选择年月"
                allowClear={false}
                className={styles.dateInput}
              />
          </span>&nbsp;&nbsp;
          <Button type="primary" onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
          <div className={styles.costmaintenTable+' '+tableStyle.orderTable_smallSize} style={{marginTop:'15px'}}>
            <p style={{overflow:'hidden'}}>
              <span style={{float:'left'}}>{RetVal?'注：'+RetVal:''}</span>
              <span style={{float:'right'}}>金额单位：万元</span>
            </p>
            <Table columns={columns} dataSource={dataList} scroll={{ x: columnsWidth, y: 400 }} pagination={false} />
            <div id="exportTableProj" style={{display:"none"}}>
              <Table columns={columns} dataSource={dataList}  pagination={false}/>
            </div>
          </div>
          {
            dataList && dataList.length !== 0 ?
              <p style={{marginTop:"20px"}}>
                <p>注：</p>
                <p>项目至今统计：预算数为项目总预算，即平台中所填预算总和。</p>
                <p>自定义：预算数为统计区间内的年度预算数加和，以前年份取12月预算。</p>
              </p>
              :
              null
          }

        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  //console.log(state.loading.models.projCostKpiShow);
  return {
    loading:state.loading.models.projCostKpiShow,
    ...state.projCostKpiShow,
    //loaing:state.loading.effects['projCostKpiShow/projCostKpiShowQuery']
  };
}
export default connect(mapStateToProps)(ProjCostKpiShow);
