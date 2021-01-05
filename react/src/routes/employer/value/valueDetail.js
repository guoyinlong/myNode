/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：直播评价详情页面
 */

import SearchDetail from '../search/searchDetail'
import {Button,Input,InputNumber,Tooltip} from  'antd'
import message from '../../../components/commonApp/message'
import * as service from '../../../services/employer/value';
import style from '../../../components/employer/employer.less'

const { TextArea } = Input;

export default class CheckDetail extends SearchDetail{
  constructor(props){
    super(props)
    this.state.scores=[]
  }
  disabled={
    totalScore:true
  };
  getTotal(data){
    let res=0
    for(let i of data){
      res+=parseFloat(i.target_score)
    }
    return res
  }
  // checkScore=(index,target_score)=>(num)=>{
  //   //let score=typeof num==='string'?num.replace(/[^0-9.]/g,''):num;
  //   debugger
  //   let scores=[...this.state.scores]
  //   scores[index]=num
  //   this.setState({
  //     scores
  //   })
  //
  // }
  calcSum=(e)=>{
    //let ve.target.value
    let{list}=this.state
    //let target=this.getTotal(list)
    //total_score=parseFloat(total_score)
    let res=0
    for(let s =0;s<list.length;s++){
      let input=document.querySelector('#score'+s);
      //debugger
      res+=parseFloat(input?input.value:0);
    }

    this.setState({total_score:res.toFixed(2)})
  }
  getTHead=(rowArr)=>{
    return [
      {
        title:'',
        dataIndex:'kpi_type',
        width:'2%',
        render:(text,row,index)=>{

          return {
            children:text,
            props:{
              rowSpan:rowArr[index]
            }
          }
        }
      },
      {
        title:'分项名称',
        dataIndex:'kpi_name',
        width:'10%',
      },
      {
        title:'计算定义/完成目标',
        dataIndex:'kpi_content',
        width:'30%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'评价标准/计分办法',
        dataIndex:'formula',
        width:'30%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'目标分值',
        dataIndex:'target_score',
      },
      {
        title:'指标完成情况',
        dataIndex:'finish',
        width:'15%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'打分',
        dataIndex:'score',
        render:(text,record,index)=>{
          return <Tooltip placement="topLeft" arrowPointAtCenter
                          title={
                            record.finish?
                              parseFloat(record.target_score)?
                                `评分范围0-${record.target_score},精确到2位小数`:
                                `评分范围-100-+5,精确到2位小数`:
                              '未填写完成情况,不能评分'
                          }
          >
            <InputNumber
              disabled={!record.finish}
              id={'score'+index}
              min={parseFloat(record.target_score)?0:-100}
              max={parseFloat(record.target_score)?parseFloat(record.target_score):5}
              step={0.1} precision={2} defaultValue={record.score||0}
              onBlur={this.calcSum}
            />
          </Tooltip>

          //return <Input onChange={this.checkScore(index,record.target_score)} value={this.state.scores[index]}/>
        },
        width:'5%',
      },


    ];
  }
  save=async()=>{


    let postData=[];

    const {list}=this.state
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
        message.success('保存成功！')
      }else{
        message.error('保存失败')
      }
    }catch (e){
      message.error(e.message)
    }


  }
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
  // showModal=()=>{
  //   this.setState({
  //     visible:true
  //   })
  // }
  // handleCancel=()=>{
  //   this.setState({
  //     visible:false
  //   })
  // }

  render(){
    const {list,total_score=0}=this.state
    let subState=false
    //const state=list.length?list[0].state:0
    let initTotal=0;
    if(list.length){
      subState=list.every((i)=>i.finish);
      for(let i of list){
        if(i.score){
          initTotal+=parseFloat(i.score)
        }
      }
    }
    initTotal=initTotal.toFixed(2);
    return(
      <div style={{minHeight:'calc(100vh - 231px)'}}>
        {super.render()}
        <div className={style.value_foot}>
          <span>总目标分值：{list.length?this.getTotal(list):'0'}</span>
          <span>得分：{total_score||initTotal}</span>
          <Button size='large' onClick={this.save}>保存</Button>
          <Button title={subState?'可提交':"填写所有的'完成情况'后可提交"} disabled={!subState} size='large' type="primary" onClick={this.submit}>提交</Button>
        </div>
      </div>
    )
  }
}

