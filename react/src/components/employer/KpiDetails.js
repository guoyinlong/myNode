/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：kpi指标组件
 */
import React from 'react';
import { Icon,Popconfirm,Input,InputNumber} from 'antd';
import {EVAL_COMP_EVAL_KPI,EVAL_PROJ_EVAL_KPI,EVAL_CORE_BP_KPI} from '../../utils/config'
import Style from './searchDetail.less'
import EmpList from '../commonApp/empList'
import {EVAL_EMP_FIXED_KPI_TYPE,EVAL_MGR_FIXED_KPI_TYPE} from '../../utils/config'
import Project_kpiBox from '../../components/employer/kpiItem'
import EditItem from '../../components/employer/editComponent'
const { TextArea } = Input;

function splitEnter(text){
  if(text)
    return <p style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>
};

function weightSum(data) {
  let sum = 0;
  if(data && data.length){
    data.map((i,index) =>{
      i.key = index;
      let kpi_score = 0;
      if(i.target_score){
        kpi_score = parseFloat(i.target_score);
      }
      sum+=kpi_score;
    })
  }
  return sum.toFixed(2);
}

class KpiDetails extends React.Component {
  index = 0;
  state={
    opFlag:'0',//1:新增指标   2:修改指标
    title:this.props.list.proj_name ? EVAL_COMP_EVAL_KPI : EVAL_PROJ_EVAL_KPI,
    dataSource:[],
    target_score:'',
    checker_id:'',
    checker_name:'',
    totalScore:'0',
    kpiTypes:[]
  }

  //新增指标按钮事件
  addKpiClick =(kpi_type) => {
   // console.log("this.props.list",this.props.list)
    //第一添加的时候取的是tpt里的mgr_id，等有数据（这里应该要页面刷新才会生效）后取的是empkpiproj里的里的mgr_id
    //但是empkpiproj里的mgr_id没给返，所以前端考虑一下从projListOrigin里面拿一下试试
    const projListOrigin =this.props.projListOrigin
    //let projListOrigin =undefined
    //-----------------------------------------------------------------------
    const {proj_id} = this.props.list;
    let orgList;
    (projListOrigin||[]).forEach((item)=>{  //这里注意指标补录页面的添加指标也走这里
    if(item.proj_id==proj_id){
     orgList=item
    }
    })
    const {dataSource} = this.state;
    let key = dataSource.length;
    /** 原来的逻辑 2020-05-05 */
    // let kpi = {key:key,"proj_id":proj_id,"kpi_type":kpi_type,"kpi_name":'',"kpi_content":'',"formula":'',"finish":'',
    //   "target_score":'', "checker_id":(this.propsp.list.mgr_id||this.props.list.checker_id) || this.state.checker_id,
    //   "checker_name":(this.props.list.mgr_name||this.props.list.checker_name) || this.state.checker_name,"isEdit":'true'};
     // console.log("this.state",this.state)
      let kpi = {key:key,"proj_id":proj_id,"kpi_type":kpi_type,"kpi_name":'',"kpi_content":'',"formula":'',"finish":'',
      "target_score":'', "checker_id":(this.props.list.mgr_id||(orgList?orgList.mgr_id:"")||this.props.list.checker_id) || this.state.checker_id,
      "checker_name":(this.props.list.mgr_name||(orgList?orgList.mgr_name:"")||this.props.list.checker_name) || this.state.checker_name,"isEdit":'true'};

    //kpi.render=(kpi_name,item)=><div>{this.editKpi(kpi.kpi_name,kpi)}</div>
    this.processKpi(kpi);
    this.state.dataSource.push(kpi)
    this.setState({
      dataSource:[...dataSource]
    })
    this.props.list.empKpis = dataSource;
  };
  //删除指标按钮点击事件
  deleteKpiClick = (item) =>{
    this.state.dataSource.splice(item.key,1);
    this.reloadData();
  };
  cancel = () =>{
  }

  componentDidMount(){
    this.init()
  }
  componentWillReceiveProps(){
    this.init()
  }
  componentshouldupdate(){
    return true
  }

  kpiItemChange=(item,key)=>(e)=>{
    let value;
    if(key==='target_score'){
      item[key]=e
      return
    }
    if(e.target){
      value=e.target.value
      item[key]=value
    }else if(e.userid){
      item["checker_id"]=e.userid
      item["checker_name"]=e.username
    }
  }
  //修改后保存修改项
  kpiItemSave=(item,key)=>(e)=>{
    let {dataSource,totalScore}=this.state
    if(key === 'target_score'){
      totalScore = weightSum(dataSource);
    }
    this.setState({
      dataSource:[...dataSource],
      totalScore
    })
  }

  //修改后保存修改项
  kpiItemCancel=(item,key,history)=>(e)=>{
    if(key==='checker_name'){
      if(history){
        item.checker_id=history.split('-')[0]
        item.checker_name=history.split('-')[1]
      }else{
        item.checker_id=''
        item.checker_name=''
      }

      return
    }
    item[key]=history

  }

  //初始化数据，赋值给dataSource
  init =() =>{
    const {checkerList,edit,list} = this.props; // list 是某个项目
    if(list && list.length){
      list.map((i,index)=>i.key=index)
    }
    if(list && list.types && list.types.length){
      list.types.map((i,index)=>i.key=index)
    }
    if(checkerList && checkerList.length){
      checkerList.map((i,index)=>i.key=index)
    }
    if(edit == 'true'){
      for(let j = 0; list && list.empKpis && j < list.empKpis.length; j++){
        list.empKpis[j].key = j;
        this.processKpi(list.empKpis[j])
      }
    }
    if(list && list.empKpis && list.allTypes){
      /**2020-08 三季度新增 */
      let arr=[],hash={}; 

     for(let i=0;i<list.empKpis.length;i++){
      let obj={
        kpi_type:list.empKpis[i].kpi_type,
        WORDBOOK_NAME:list.empKpis[i].kpi_type
      }
      arr.push(obj)
     }
     let empkpi_arr = arr.reduce((cur,next) => {  //去重
      hash[next.kpi_type] ? "" : hash[next.kpi_type] = true && cur.push(next);
      return cur;
  },[])
    /**2020-08 三季度新增 */
      this.setState({
        dataSource:[...list.empKpis],
       //kpiTypes:this.initKpiTypes(list.allTypes),
      kpiTypes:this.initKpiTypes(list.allTypes,empkpi_arr),/**2020-08 三季度新增 */
        totalScore:weightSum(list.empKpis)
      })
    }

  }

  //对每条kpi记录生产修改项、保存/取消操作
  processKpi = (item) => {
    const {checkerList,edit,flag,perf_emp_type,emp_type} = this.props;
    /**2020-08 三季度新增 */
    let finish_arry=[6,7,8,9,10]
    //可编辑，非固定指标
    if (flag == 2 && !finish_arry.includes(Number(item.state))) { //退出团队后，指标评价之后审核状态为评价完成时 不可再编辑/**2020-08 三季度新增 */
      item.renderfinish = (finish, item) => <EditItem isEdit={!finish} show={finish ? splitEnter(finish) : ''} 
      edit={<TextArea autosize = {true} defaultValue={finish} onChange={this.kpiItemChange(item, 'finish')}/>}
      onOk={this.kpiItemSave(item, 'finish')}  onCancel={this.kpiItemCancel(item,'finish',item.finish)}/>
    }
    if(item.isEdit == 'true') {
      //可编辑，非固定指标
      /*if (edit && flag == 2) {
        item.renderfinish = (finish, item) => <EditItem isEdit={!finish} show={finish ? splitEnter(finish) : ''} edit={<TextArea rows={2} defaultValue={finish}
               onChange={this.kpiItemChange(item, 'finish')}/>} onOk={this.kpiItemSave(item, 'finish')}  onCancel={this.kpiItemCancel(item,'finish',item.finish)}/>
      }*/
      if (edit && flag != 2) {  // edit 是字符串的,此处的edit永远是true（服）
        if (!item) {
          return
        }
        item.renderkpi_name=(kpi_name,item)=>{
          return(
            <div>
              <Popconfirm title="确定删除该项指标吗?" onConfirm={()=>this.deleteKpiClick(item)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <Icon className={Style.delKpi} type='shijuan-shanchuzhibiao' />
              </Popconfirm>
              <EditItem isEdit={!kpi_name} show={kpi_name} edit={<Input placeholder='请输入指标名称' style={{width:'100%'}}  defaultValue={kpi_name} onChange={this.kpiItemChange(item,'kpi_name')}/>} onOk={this.kpiItemSave(item,'kpi_name')} onCancel={this.kpiItemCancel(item,'kpi_name',item.kpi_name)}/>
            </div>
          )
        }
        item.renderkpi_content=(kpi_content,item)=><EditItem isEdit={!kpi_content} show={splitEnter(kpi_content)} edit={<TextArea rows={2}  defaultValue={kpi_content} onChange={this.kpiItemChange(item,'kpi_content')}/>} onOk={this.kpiItemSave(item,'kpi_content')} onCancel={this.kpiItemCancel(item,'kpi_content',item.kpi_content)}/>
        item.renderformula=(formula,item)=><EditItem isEdit={!formula} show={splitEnter(formula)} edit={<TextArea rows={4}  defaultValue={formula} onChange={this.kpiItemChange(item,'formula')}/>} onOk={this.kpiItemSave(item,'formula')} onCancel={this.kpiItemCancel(item,'formula',item.formula)}/>
        if(perf_emp_type != '0' || (perf_emp_type == '0' && emp_type != '0')){
          item.renderchecker_name=(checker_name,item)=><EditItem isEdit={!checker_name} show={checker_name} edit={<EmpList list={checkerList} style={{width:'200px'}}  onChange={this.kpiItemChange(item,'checker_name')} defaultValue={checker_name}/>} onOk={this.kpiItemSave(item,'checker_name')} onCancel={this.kpiItemCancel(item,'checker_name',item.checker_id+'-'+item.checker_name)}/>
        }
         item.renderScore=(score,item)=>{
          return <div>目标分值：<EditItem style={{width:'135px'}} isEdit={!item.target_score} show={(item.target_score === undefined || item.target_score === null || item.target_score === '') ? undefined: item.target_score.toString()} edit={
            <InputNumber min={0} max={100} defaultValue={item.target_score} onChange={this.kpiItemChange(item,'target_score')} />
          } onOk={this.kpiItemSave(item,'target_score')} onCancel={this.kpiItemCancel(item,'target_score',item.target_score)}/></div>
        }
      }
    }
  }

  //删除数据后重新计算key值,防止删除较前记录后，再次删除较后记录时，超出数组长度范围
  reloadData = () =>{
    const {list} = this.props;  // list 是一个项目
    const {dataSource} = this.state;

    this.setState({
      dataSource:[],
      //totalScore:sum,
    },() => {
      for(let i = 0; dataSource && i < dataSource.length; i++){
        dataSource[i].key = i;
      }
      let sum = weightSum(dataSource);
      this.setState({
        dataSource:[...dataSource],
        totalScore:sum,
      })
      list.empKpis = dataSource;
      })
  }

  //初始化获取所有指标类型，全部展示以便可以添加指标
  //empkpi_type是empkpiquery服务查到的数据里的kpi_type
  initKpiTypes = (list,empkpi_type) =>{
    let {hasproj,proj_length}=this.props
    let match=false,falg=false;
     list.forEach((item)=>{
       //console.log("item",item)
      match=empkpi_type.some(k=>item.WORDBOOK_NAME==k.WORDBOOK_NAME)
       if(match){
        falg=true
       }
    })
    //退出团队后仍然能填写完成情况
    //包含规则，empkpi_type的类型包含list里的类型那么就以projlist里的empkpis的kpi_type为准,
    //这里的kpi_type为是在添加指标是指标填写时候的type
   if(falg&&hasproj<2&&proj_length!=hasproj&&empkpi_type.length>list.length){ 
      list=empkpi_type
    }
   //如果和查到的类型不匹配，那么就按照添加指标是指标填写时候的kpi_type来显示
   if(!falg&&empkpi_type.length!=0){ //是综合绩效的时候emkpis的数据是空的empkpi_type也是空的
    list=empkpi_type
   }
    const {edit} = this.props;
    for(let i = 0; list && i < list.length;i++){
      list[i].kpi_type = list[i].kpi_type || list[i].WORDBOOK_NAME;
      //debugger
      if(edit === 'true' && this.props.flag !== '2' && list[i].kpi_type != EVAL_EMP_FIXED_KPI_TYPE && list[i].kpi_type != EVAL_MGR_FIXED_KPI_TYPE&&list[i].kpi_type !=EVAL_CORE_BP_KPI ){//被当做固定指标的不可添加
        list[i].render=(kpi_type)=><div>{this.addKpi(list[i].kpi_type)}</div>
      }
    }
    //alert("转换后types:"+JSON.stringify(list))
    return list;
  }

  //添加指标
  addKpi =(kpi_type) => {
    return (
      <div>
        <div>{kpi_type}
          <div className={Style.addKpi} onClick={(e)=>{
            e.stopPropagation()
            return this.addKpiClick(kpi_type)
          }}><span>+</span>{'添加指标'}</div>
        </div>
      </div>
    )
  }

  render(){
    const{list}=this.props;
    const { kpiTypes, dataSource,totalScore} = this.state;
    // 每一个项目的组件 Project_kpiBox
    return(
      <div style={{marginTop:40}}>
        <Project_kpiBox project={list} kpiTpyes={kpiTypes} list={dataSource} noScore totalScore={totalScore}/>
      </div>
    )
  }
}

export default KpiDetails;
