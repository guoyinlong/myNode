/**
 * 文件说明：中层指标填写完成情况页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-01
 */
import React from 'react';
import { connect } from 'dva';
import Style from '../../../components/employer/searchDetail.less'
import style from '../../../components/employer/employer.less'
import Project_kpiBox from '../../../components/employer/kpiItem'
import Report from '../../../components/employer/Report'
import {EVAL_PLUS_MINUS_SCORE} from '../../../utils/config'
import * as service from '../../../services/leader/leaderservices';
import message from '../../../components/commonApp/message'
import EditItem from '../../../components/employer/editComponent'
import { Input ,Popconfirm ,Button} from 'antd';
const { TextArea } = Input;
import { EVAL_FIXED_KPI_CHECKER_ID } from '../../../utils/config'

/**
 * 功能：特殊字符处理
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-01
 * @param text 待处理字符串
 */
function splitEnter(text){
  if(text)
    return <p style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>
};

/**
 * 功能：指标目标分值求和
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-01
 * @param data 待求和指标集
 * @returns {number} 指标目标分值总和
 */
function weightSum(data) {
  let sum = 0;
  if(data && data.length){
    data.map((i) =>{
      let kpi_score = 0;
      if(i.target_score && i.kpi_type != EVAL_PLUS_MINUS_SCORE){
        kpi_score = parseFloat(i.target_score);
      }
      sum+=kpi_score;
    })
  }
  return sum;
}

/**
 * 功能：中层指标详情
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-01
 */
class KpiFinish extends React.Component {

  state={
    title:'绩效考核指标',
    dataSource:[],
    totalScore:'',
    kpiTypes:[],
    query:this.props.location.query
  }

  /**
   * 功能：页面渲染完成后操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   */
  componentDidMount(){
    this.init()
  }

  /**
   * 功能：父组件变化后操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param nextProps 父组件参数
   */
  componentWillReceiveProps(){
    this.init()
  }

  /**
   * 功能：修改
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item
   * @param key
   */
  kpiItemChange=(item,key)=>(e)=>{
    let value;
    if(e.target){
      value=e.target.value
      item[key]=value
    }
  }

  /**
   * 功能：修改后保存修改项
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item
   * @param key
   */
  kpiItemSave = (item,key)=>(e)=>{
    let {dataSource}=this.state
    this.setState({
      dataSource:[...dataSource]
    })
    const {dispatch,leaderSonKpiList} = this.props;
    let updateFinish = [];
    updateFinish.push({"update":{"finish":item.finish},"condition":{"uuid":item.uuid}});
    if(item.tag === '1'){
      //有子指标
      for(let j = 0 ; leaderSonKpiList && leaderSonKpiList.length && j < leaderSonKpiList.length;j++){
        let m = leaderSonKpiList[j];
        if(m.last_id == item.uuid){
          updateFinish.push({"update":{"finish":item.finish},"condition":{"uuid":m.uuid}});
        }
      }
    }
    dispatch({
      type:'leaderSearch/saveKpiFinish',
      finish:updateFinish
    })

  }
  /**
   * 功能：修改后保存修改项
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item
   * @param key
   * @param history
   */
  kpiItemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  }
  /**
   * 功能：对每条kpi记录填写完成情况操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item 待编辑指标记录
   */
  processKpi = (item) => {
    //const {,edit,flag,perf_emp_type,emp_type} = this.props;
    if(item.state != 7 && item.checker_id != EVAL_FIXED_KPI_CHECKER_ID){
      item.renderfinish = (finish, item) => <EditItem isEdit={!finish} show={finish ? splitEnter(finish) : ''} edit={<TextArea autosize = {true} defaultValue={finish} placeholder="字数200字以下..." maxLength = "200" onChange={this.kpiItemChange(item, 'finish')}/>} onOk={this.kpiItemSave(item, 'finish')}  onCancel={this.kpiItemCancel(item,'finish',item.finish)}/>
    }
  }
  /**
   * 功能：初始化页面数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   */
  init =() =>{
    const {list,leaderKpiList} = this.props;
    if(list && list.length){
      list.map((i,index)=>i.key=index)
    }

    //获取kpi_type
    let kpi_types=new Set();
    if(leaderKpiList && leaderKpiList.length){
      leaderKpiList.forEach(i=>{
        kpi_types.add(i.kpi_type)
      })
    }

    for(let j = 0; leaderKpiList && j < leaderKpiList.length; j++){
      this.processKpi(leaderKpiList[j])
    }

    this.setState({
      dataSource:leaderKpiList,
      kpiTypes:Array.from(kpi_types),
      totalScore:weightSum(leaderKpiList),
      loading:false
    })
  }
  /**
   * 功能：保存/提交指标完成情况
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param kpiColl 指标集
   * @param tag 操作类型，0：保存  1：提交
   */
  saveFinish = async() => {
    const {leaderSonKpiList} = this.props;
    const {dataSource} = this.state;
    let updateFinish = [];
    let hasNull = false;
    for(let i = 0; i < dataSource.length;i++){
      let k = dataSource[i];
      if(k.state != '7' && k.checker_id != EVAL_FIXED_KPI_CHECKER_ID){
        if(k.finish == undefined || k.finish == null || k.finish == ''){
          k.finish = '';
          hasNull = true;
        }
        updateFinish.push({"update":{"finish":k.finish},"condition":{"uuid":k.uuid}});
        if(k.tag === '1'){
          //有子指标
          for(let j = 0 ; leaderSonKpiList && leaderSonKpiList.length && j < leaderSonKpiList.length;j++){
            let m = leaderSonKpiList[j];
            if(m.last_id == k.uuid){
              updateFinish.push({"update":{"finish":k.finish},"condition":{"uuid":m.uuid}});
            }
          }
        }
      }

    }

    try{
      let res=await service.leaderKpiUpdate({
        transjsonarray:JSON.stringify(updateFinish)
      })
      if(res.RetCode==='1'){
        if(hasNull){
          message.success(splitEnter("保存成功！<br/><span style='color: #DE5939'>请注意：您当前尚有指标未填写完成情况！</span>"),5);
        }else{
          message.success('保存成功！')
        }
      }else{
        message.error('保存失败')
      }
    }catch (e){
      message.error(e.message)
    }
  }

  render(){
    const{list}=this.props;
    const { kpiTypes, dataSource,totalScore} = this.state;
    return(
      <div>
      <div className={Style.wrap}>
        {dataSource && dataSource.length?
          <div>
            <Project_kpiBox project={list} kpiTpyes={kpiTypes} list={dataSource} noScore totalScore={totalScore}/>
            {/*<PageSubmit title={'确定提交指标完成情况吗？'}  save={this.saveFinish} submit={this.saveFinish}/>*/}
            <div className={style.div_submit}>
              <Popconfirm title={"确认保存填写情况吗？"} onConfirm={this.saveFinish} okText="确定" cancelText="取消">
                <Button type="primary">保存</Button>
              </Popconfirm>
            </div>
          </div>
          :null}
      </div>
      {/* <div className={Style.wrap} style={{marginTop:'10px'}}>
        <Report is_edit = "true" staff_id = {query.staff_id} year={query.year} ></Report>
      </div> */}
    </div>
    )
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-01
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { year,list,leaderKpiList,leaderSonKpiList} = state.leaderSearch;
  if(leaderKpiList && leaderKpiList.length){
    leaderKpiList.map((i,index)=>i.key=index)
  }
  if(leaderSonKpiList && leaderSonKpiList.length){
    leaderSonKpiList.map((i,index)=>i.key=index)
  }

  return {
    year,
    list,
    leaderKpiList,
    leaderSonKpiList,
    loading: state.loading.models.leaderSearch,
  };
}
export default connect(mapStateToProps)(KpiFinish)
