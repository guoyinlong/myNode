/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：直播评价详情页面
 */

import SearchDetail from '../search/searchDetailFirst'
import {Button,Input,InputNumber,Tooltip,Popconfirm} from  'antd'
import message from '../../../components/commonApp/message'
import * as service from '../../../services/employer/value';
import ValueSubmit from '../../../components/employer/ValueSubmit'
import {splitEnter} from '../../../utils/func'
const { TextArea } = Input;
export default class CheckDetail extends SearchDetail{
  constructor(props){
    super(props)
    this.state.noScore=true
    this.state.hasNull
    this.state.subState
    this.state.scoreDetails = true
  }
  disabled={
    totalScore:true
  };
  /**
   * 功能：组件渲染完后执行操作
   * 作者：陈莲
   * 创建日期：2017-10-28
   */
  async componentDidMount(){
    await super.componentDidMount()
    await this.init();
    let {list}=this.state
   if(list.some(item=>item.finish)&&list.some(item=>item.state=="3"))
    this.timer = setInterval(() => this.save(), 600000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
  /**
   * 功能：初始话操作
   * 作者：陈莲
   * 创建日期：2017-10-28
   */
  init = async() =>{
    let {list} = this.state;
    let res = 0;
    let hasNull=false;
    let subState=true
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
        subState = subState && list[s].finish;
      }
    }

    this.setState({
      total_score:res.toFixed(2),
      hasNull,
      subState
    })
  }
  /**
   * 作者：李杰双
   * 功能：计算所有kpi的得分和
   */
  calcSum=(index)=>()=>{
    let{list}=this.state
    let res=0
    let hasNull=false
    for(let s =0;s<list.length;s++){
      let input=document.querySelector('#score'+s);
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
   * 作者：李杰双
   * 功能：保存打分数据
   */
  save=async()=>{
    let postData=[];
    const {list , hasNull}=this.state
    let scores=list.map((i,index)=>document.querySelector('#score'+index).value)
    scores.map((i,index)=>{
      if (i){
        let data={update:{score:i},condition:{id:list[index].id}}
        postData.push(data)
      }

    })
    try{
      let res=await service.tempkpiupdate({
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
   * 作者：李杰双
   * 功能：提交打分数据
   */
  submit=async()=>{

    const { list } =this.state
    let kpis=list.map((i,index)=>{
      return {id:i.id,score:document.querySelector('#score'+index).value}
    })

    let postData={
      kpis:JSON.stringify(kpis),
      arg_row_count:list.length+'',
      arg_proj_id:list[0].proj_id,
      arg_year:list[0].year,
      arg_season:list[0].season,
      arg_staff_id:list[0].staff_id,
    };

    try{
      let res=await service.empkpivaluatenoaffirm(postData)
      if(res.RetCode==='1'){
        message.success('提交成功！')
        this.props.history.goBack()
      }else{
        message.error('提交失败')
      }
    }catch (e){
      message.error(e.message)
    }


  }
  /**
   * 作者：李杰双
   * 功能：撤销打分数据
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
   * 作者：李杰双
   * 功能：动态生成打分的组件
   */
  getScoreComponent(record,index){
    return <Tooltip placement="topLeft" arrowPointAtCenter
                    key={record.id}
                    title={
                      record.finish?
                        parseFloat(record.target_score)?
                          `评分范围0~${record.target_score},精确到2位小数`:
                          `评分范围-100~+5,精确到2位小数`:
                        '未填写完成情况,不能评分'
                    }
    >
      <span>{record.score ?
        <InputNumber style={{'border':"1.5px solid green",'height':'25px','width': '100px','fontSize': 'x-large'}}
                     disabled={!record.finish||record.state==='6'}
                     id={'score'+index}
                     min={parseFloat(record.target_score)?0:-100}
                     max={parseFloat(record.target_score)?parseFloat(record.target_score):5}
                     step={0.1} precision={2} defaultValue={(record.score)}
                     onBlur={this.calcSum(index)}
                     size="small"
                     width={'40px'}
        />
        :
        <InputNumber style={{'border':"1.5px solid coral",'height':'25px','width': '100px','fontSize': 'x-large'}}
                     disabled={!record.finish||record.state==='6'}
                     id={'score'+index}
                     min={parseFloat(record.target_score)?0:-100}
                     max={parseFloat(record.target_score)?parseFloat(record.target_score):5}
                     step={0.1} precision={2} defaultValue={(record.score)}
                     onBlur={this.calcSum(index)}
                     size="small"
                     width={'40px'}
        />
    }</span>

    </Tooltip>
  }


  getTotal(data){
    let res=0;
    for(let i of data){
      res+=parseFloat(i.target_score)
    }
    return res.toFixed(2)
  }

  render(){
    const {list,total_score,hasNull,subState}=this.state
    //this.init()
    return(
      <div style={{minHeight:'calc(100vh - 231px)',position:'relative'}}>
        {
          list.length &&
          <div  style={{position:'absolute',top:'60px',right:'30px',backgroundColor:'rgb(240,247,253)',fontSize:'16px',lineHeight:'28px',fontWeight:'700',padding:'20px'}}>
            <div>得分：{total_score}</div>
            <div>总目标分值：{list.length?this.getTotal(list):'0'}</div>
          </div>
        }
        {super.render()}
        <ValueSubmit list={list} total_score={total_score}
                     cancelValue={list.length&&list[0].state==='6'} submitValue={list.length&&list[0].state != '6'}  title="确定提交指标评价结果吗？"
                     subState={!(!subState || hasNull)} donotTips={hasNull?"尚有指标未评价,不可提交！":"填写所有的'完成情况'后可提交！"}
                     save={this.save} submit={this.submit} revert={this.revert} />
      </div>
    )
  }
}
