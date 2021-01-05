/**
 * 作者:陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-28
 * 文件说明：中层指标评价详情页面
 */
import SearchDetail from '../../employer/search/searchDetailFirst'
import {InputNumber,Tooltip,Button} from  'antd'
import Style from '../../../components/employer/searchDetail.less'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import message from '../../../components/commonApp/message'
import * as service from '../../../services/leader/leaderservices';
import ValueSubmit from '../../../components/employer/ValueSubmit'
import CheckSubmit from '../../../components/employer/CheckSubmit'
import Report from '../../../components/employer/Report'
import {splitEnter} from '../../../utils/func'
/**
 * 功能：中层指标评价详情页面
 * 作者:陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-28
 */
class valueDetail extends SearchDetail{
  constructor(props){
    super(props)
    this.state.noScore=true
    this.state.hasNull
    this.state.scoreDetails = true
    this.state.reason
    this.state.isValue = true
  }
  disabled={
    totalScore:true
  };

  /**
   * 功能：组件渲染完后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  async componentDidMount(){
    this.setState({
      kpi_types:[],
      projects:[],
      list:[],
      loading:true,
      total_score:'0',
      hasNull:false
    })
    await this.init();
  }
  /**
   * 功能：父组件变化后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  async componentWillReceiveProps(){
    this.setState({
      kpi_types:[],
      projects:[],
      list:[],
      loading:true,
      total_score:'0',
      hasNull:false
    })
    await this.init();
  }
  /**
   * 功能：获取中层考核数据，以及初始化
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  init = async() =>{
    try{

      let query=this.props.location.query;
      let condition;
      if(query.level == '1'){
        condition = {"staff_id":query.staff_id,"year":query.year,"checker_id":query.checker_id,"tag":'0'}
      }else{
        condition = {"staff_id":query.staff_id,"year":query.year,"second_checker_id":query.checker_id}
      }
      let projects=(await service.leaderScoreSearch({
        transjsonarray:JSON.stringify(
          {"condition":
            {"staff_id":query.staff_id,"year":query.year}
          }
        )
      })).DataRows;
      let list=(await service.leaderKpiSearch({
        transjsonarray:JSON.stringify({condition:condition,sequence:[{"sort_num":"0"},{"kpi_content":"0"},{"kpi_target":"0"}]})
      })).DataRows
      if(!list.length){
        throw new Error('查询结果为空！请返回')
      }
      //获取kpi_type
      let kpi_types=new Set();
      list.forEach(i=>{
        kpi_types.add(i.kpi_type)
      })
      let res = 0;
      let hasNull=false;
      if(list && list.length){
        for(let s =0;s<list.length;s++){
          let score=list[s].score;
          if(score === undefined || score === null || score === ''){
            hasNull = true;
          }
          res+=parseFloat(score?score:0);
          if(!list[s].renderScore){
            list[s].renderScore=(score,item)=><div>{this.getScoreComponent(item,s)}/{item.target_score}</div>
          }
        }
      }

      this.setState({
        kpi_types:Array.from(kpi_types),
        projects,
        list,
        loading:false,
        total_score:res.toFixed(2),
        hasNull
      })
    }catch (e){
      message.error(e.message)
      this.setState({
        loading:false
      })
    }
  }
  /**
   * 功能：计算所有kpi的得分和
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  calcSum=(index)=>()=>{
    let{list}=this.state
    let res=0
    let hasNull=false
    for(let s =0;s<list.length;s++){
      //let input=document.querySelector('#score'+s);
      let input=document.querySelector('#score'+list[s].staff_id+s);
      if(input.value === undefined || input.value === null || input.value === ''){
        hasNull = true;
      }
      list[s].score=input?input.value:0;
      res+=parseFloat(input?input.value?input.value:0:0);
    }
    this.setState({
      total_score:res.toFixed(2),
      hasNull,
      list:[...list]
    })
  }
  /**
   * 功能：保存打分数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  save=async()=>{
    let postData=[];
    const {list , hasNull}=this.state
    //let scores=list.map((i,index)=>document.querySelector('#score'+index).value)
    let scores=list.map((i,index)=>document.querySelector('#score'+i.staff_id+index).value)
    //debugger
    scores.map((i,index)=>{
      if (i && list[index].state != 7){
        let data={update:{score:i},condition:{uuid:list[index].uuid}}
        postData.push(data)
      }

    })
    try{
      let res=await service.leaderKpiUpdate({
        transjsonarray:JSON.stringify(postData)
      })
      if(res.RetCode==='1'){
        if(hasNull){
          message.success(splitEnter("保存成功！<br/><span style='color: #DE5939'>请注意：您当前尚有未评价指标！</span>"),5);
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
  /**
   * 功能：提交打分数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  submit=async()=>{
    const {dispatch}=this.props;
    let kpis=[];
    const { list } =this.state
    //let scores=list.map((i,index)=>document.querySelector('#score'+index).value)
    let scores=list.map((i,index)=>document.querySelector('#score'+i.staff_id+index).value)

    scores.map((i,index)=>{
      if (i && list[index].state != 7){
        //let data={uuid:list[index].uuid,score:document.querySelector('#score'+index).value}
        let data={uuid:list[index].uuid,score:document.querySelector('#score'+list[index].staff_id+index).value}
        kpis.push(data)
      }
    })
    /*let kpis=list.map((i,index)=>{
      if(list[index].state != 7)
      return {uuid:i.uuid,score:document.querySelector('#score'+index).value}
    })*/

    let postData={
      kpis:JSON.stringify(kpis),
      arg_year:list[0].year,
      arg_staff_id:list[0].staff_id
    };

    try{
      let res=await service.leaderKpiValue(postData)
      if(res.RetCode==='1'){
        message.success('提交成功！')
        this.props.history.goBack()

        dispatch({
          type:'leaderValue/toValueLeaderAutoSearch',
          query:{"flag":'0'}
        })

      }else{
        message.error('提交失败')
      }
    }catch (e){
      message.error(e.message)
    }
  }
  /**
   * 功能：撤销打分数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  revert=async()=>{
    const { list } =this.state
    let k=list[0]

    try{
      let res=await service.empkpievaluateundo({
        arg_checker_id:k.checker_id ,
        arg_year:k.year,
        arg_season:k.season ,
        arg_staff_id:k.staff_id
        ,arg_proj_id:k.proj_id||null
      })
      if(res.RetCode==='1'){
        message.success('撤销成功！')
        this.componentDidMount()

      }else{
        message.warning(res.RetVal)
      }
    }catch (e){
      message.error(e.message)
    }
  }
  /**
   * 功能：动态生成打分的组件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  getScoreComponent(record,index){
    const {level} = this.props.location.query;
    return <Tooltip placement="topLeft" arrowPointAtCenter
                    key={record.id}
                    title={
                      level == 1?(record.finish ? (record.state != '7'?(record.state != '5'?
                        parseFloat(record.target_score)?(parseFloat(record.target_score)>0?(
                          `评分范围0~${record.target_score},精确到2位小数`)
                          :`评分范围${record.target_score}~0,精确到2位小数`)
                          :`评分范围-100~+5,精确到2位小数`
                        :`评分待审核`)
                        :`评分已完成`) : '未填写完成情况,不能评分')
                        :`专业化指标分管领导无打分权限，请审核！`
                    }
    >
      <span>{record.score ?
        <InputNumber style={{'border':"1.5px solid green",'height':'25px','width': '100px','fontSize': 'x-large'}}
          disabled={level == 2 || record.state==='7' || record.state === '5'}
          id={'score'+record.staff_id+index}
          min={parseFloat(record.target_score)?parseFloat(record.target_score)>0?0:parseFloat(record.target_score):-100}
          max={parseFloat(record.target_score)?parseFloat(record.target_score)>0?parseFloat(record.target_score):0:5}
          step={0.1} precision={2} defaultValue={(record.score)}
          onBlur={this.calcSum(index)}
          size="small"
          autocomplete="off"
        />
        :
        <InputNumber style={{'border':"1.5px solid coral",'height':'25px','width': '100px','fontSize': 'x-large'}}
          disabled={!record.finish || level == 2 || record.state==='7' || record.state === '5'}
          id={'score'+record.staff_id+index}
          min={parseFloat(record.target_score)?parseFloat(record.target_score)>0?0:parseFloat(record.target_score):-100}
          max={parseFloat(record.target_score)?parseFloat(record.target_score)>0?parseFloat(record.target_score):0:5}
          step={0.1} precision={2} defaultValue={(record.score)}
          onBlur={this.calcSum(index)}
          size="small"
          autocomplete="off"
        />
    }



      </span>

    </Tooltip>
  }
  /**
   * 功能：kpi审核不通过
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  revocation=async()=>{
    const {dispatch} = this.props;
    let reason=this.state.reason||'';
    if(!reason.trim()){
      message.error('请输入不通过理由！');
      return
    }
    const { list } =this.state
    let kpis=list.map((i,index)=>{
      return {uuid:i.uuid,reason:reason}
    })

    let postData={
      kpis:JSON.stringify(kpis),
      arg_year:list[0].year,
      arg_staff_id:list[0].staff_id
    };

    try{
      let res=await service.leaderKpiValueCheckUnPass(postData)
      if(res.RetCode==='1'){
        message.success('不通过成功！')
        this.props.history.goBack()
        //this.handleCancel()
        dispatch({
          type:'leaderValue/toValueLeaderAutoSearch',
          query:{"flag":'1'}
        })
      }else{
        message.error('提交失败')
        //this.handleCancel()
      }
    }catch (e){
      message.error(e.message)
      //this.handleCancel()
    }

  }
  /**
   * 功能：kpi审核通过
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  passHandle=async()=>{
    const { list } =this.state
    const {dispatch} = this.props;
    let kpis=list.map((i,index)=>{
      return {uuid:i.uuid}
    })

    let postData={
      kpis:JSON.stringify(kpis),
      arg_year:list[0].year,
      arg_staff_id:list[0].staff_id
    };

    try{
      let res=await service.leaderKpiValueCheckPass(postData)
      if(res.RetCode==='1'){
        message.success('审核通过成功！')
        this.props.history.goBack()
        dispatch({
          type:'leaderValue/toValueLeaderAutoSearch',
          query:{"flag":'1'}
        })
      }else{
        message.error('提交失败')
      }
    }catch (e){
      message.error(e.message)
    }
  }
  /**
   * 功能：更新不通过理由
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-28
   */
  seasonHandle=(e)=>{
    this.setState({
      reason:e.target.value
    })
  }
  /**
   * 功能：返回按钮
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-04
   */
   goback= () =>{
    const{dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/value'
    }));
  }
  render(){
    const {list,total_score,hasNull,reason}=this.state
    const {level,state,staff_id,year} = this.props.location.query;
    return(
      <div style={{minHeight:'calc(100vh - 231px)'}}>
        <Button type="primary" style={{"position": "relative",
          "marginRight": "48px",
          "marginTop": "37px",
          "float": "right",
          "marginLeft": "22px"}} onClick={this.goback}>返回</Button>
        {super.render()}

        {level == 1?
          <ValueSubmit list={list} total_score={total_score}
                       cancelValue={false} submitValue={list.length && (state != '5' && state != '7')}  title="确定提交指标评价结果吗？"
                       subState={!hasNull} donotTips="尚有指标未评价,不可提交！"
                       save={this.save} submit={this.submit} revert={this.revert} />
          :
          <CheckSubmit list = {list} total_score={total_score} title="确定审核通过指标评价结果吗？" subState = {list.length&&list[0].state==='5' ? "0" : "2"} reason = {reason}
                       passHandle = {this.passHandle} revocation = {this.revocation} seasonHandle = {this.seasonHandle}/>

        }
        <div className={Style.wrap} style={{marginTop:'10px',minHeight:'auto'}}>
          <Report staff_id = {staff_id} year={year} ></Report>
        </div>
      </div>
    )
  }
}
//可撤销时subState
//subState = {list.state == '7' ?'1':'0'}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-05
 * @param state 状态树
 */
function mapStateToProps(state) {
  /*const { stage} = state.leaderValue;*/
  return {
    //stage,
    loading: state.loading.models.leaderValue,
  };
}
export default connect(mapStateToProps)(valueDetail)

