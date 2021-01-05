/**
 * 作者：李杰双
 * 日期：2017/10/26
 * 邮件：282810545@qq.com
 * 文件说明：问卷调查页面
 */
import React from 'react'
import * as servive from '../../../services/commonApp/questionnaire'
import Styles from '../../../components/commonApp/questionnaire.less'
import Cookies from 'js-cookie'
import img_head from '../../../assets/Images/questionnaire/bg_head_04.png'
import zs_png from '../../../assets/Images/questionnaire/zs_03.png'
import { Radio, Input, Checkbox, Button, message, Tooltip, Icon } from 'antd';
const RadioGroup = Radio.Group;


const RULES_TEXT={
  200:'答案字数必须在1-200之间！',
  500:'答案字数必须在1-500之间！'
}
class QuestionItem_radio extends React.Component{
  constructor(props){
    super(props)
    this.state={
      value:props.defaultValue.length?props.defaultValue[0].iqo_id:''
    }
  }

  onChange=(e)=>{
    let {value}=e.target;
    let {onChange, flag:anonymity_flag}=this.props

    onChange([{iqo_id:value,iqo_type:'0',anonymity_flag}]);
    this.setState({
      value
    })
  }
  extTextChange=(i)=>(e)=>{
    let {iqo_id,iqo_type}=i;
    let {onChange, flag:anonymity_flag}=this.props;
    let isRule=true;
    let text=e.target.value.trim();
    if(!text){
      isRule=false
    }
    if(text.length>200){
      isRule=false
    }
      //onChange(iqo_id,{iqo_type, iqo_id},e.target.value);
    onChange([{iqo_id,iqo_type,anonymity_flag,uas_text:text}],isRule);
  }
  render(){
    let {data, defaultValue, isRule}=this.props;
    let dv=defaultValue.length?defaultValue:[{iqo_id:'',uas_text:''}]
   // debugger
    return(
      <RadioGroup onChange={this.onChange} defaultValue={dv[0].iqo_id}>
        {
          data.map((i,index)=><Radio key={index} value={i.iqo_id} atype={i.iqo_type} aid={i.iqo_id}>
            {
              i.opt_content
            }
            {
              i.iqo_type==='1'
                ?<span className={Styles.checkText}>

                  <Input defaultValue={dv[0].uas_text} style={{ width: 100, marginLeft: 10 }} disabled={this.state.value!==i.iqo_id} onChange={this.extTextChange(i)}/>
                  {isRule
                    ?null
                    :i.iqo_id===this.state.value
                      ?<p>{RULES_TEXT['200']}</p>
                      :null
                  }
                </span>
                // <Tooltip placement="bottomRight" title={'问答题答案200字以内！'} visible={!isRule}>
                //   <Input defaultValue={dv[0].uas_text} style={{ width: 100, marginLeft: 10 }} disabled={this.state.value!==i.iqo_id} onChange={this.extTextChange(i)}/>
                // </Tooltip>
              :null

            }

          </Radio>)
        }
      </RadioGroup>
    )
  }
}


class QuestionItem_check extends React.Component{
  constructor(props){
    super(props)
    this.state={
      value:props.defaultValue.length?props.defaultValue:[],
      otherChecked:{},
      postData:[],
      textCheck:{},
      checkedValues:props.defaultValue.map(i=>i.iqo_id),
      checkData:[]
    }
    props.defaultValue.forEach(i=>{
      if(i.iqo_type==='1'){
        this.state.otherChecked[i.iqo_id]=i.uas_text
        this.state.checkData.push({
          iqo_id:i.iqo_id,
          iqo_type:i.iqo_type,
          anonymity_flag:props.anonymity_flag,
          uas_text:i.uas_text
        })
      }else{
        this.state.checkData.push({
          iqo_id:i.iqo_id,
          iqo_type:i.iqo_type,
          anonymity_flag:props.anonymity_flag,

        })
      }
    })




  }

  onChange=(checkedValues)=>{
    debugger
    let {onChange, anonymity_flag}=this.props
    let otherChecked={};
    let checkData=checkedValues.map(i=>{
      otherChecked[i]=true
      return {
        iqo_id:i,
        iqo_type:'0',
        anonymity_flag
      }
    })
    this.state.checkedValues=checkedValues;
    this.state.checkData=checkData;
    onChange(this.getPostData());
    this.setState({
      otherChecked,

    })
  }
  getPostData=()=>{
    let {checkData, textCheck, checkedValues}=this.state
    debugger
    let res=checkedValues.map(i=>{
      if(textCheck[i]){
        return textCheck[i]
      }else{
        return checkData.filter(k=>k.iqo_id===i)[0]
      }
    })
    return res
  }
  extTextChange=(i)=>(e)=>{

    let {iqo_id,iqo_type}=i;
    let {onChange, anonymity_flag}=this.props;
    let isRule=true;
    let text=e.target.value.trim();
    if(!text){
      isRule=false
    }
    if(text.length>200){
      isRule=false
    }
    this.state.textCheck[iqo_id]={
      iqo_id,
      anonymity_flag,
      iqo_type,
      uas_text:text
    }
    onChange(this.getPostData(),isRule);

    //console.log(this.state.postData)
    //onChange(iqo_id,{iqo_type, iqo_id},e.target.value);
    ///onChange(([{iqo_id,iqo_type,anonymity_flag,uas_text:e.target.value}]));
  }
  render(){
    let {data, defaultValue, isRule}=this.props;

    let dv=defaultValue.length?defaultValue:[{iqo_id:'',uas_text:''}]
    return(
      <Checkbox.Group onChange={this.onChange} defaultValue={dv[0].iqo_id?dv.map(i=>i.iqo_id):undefined}>
        {
          data.map((i,index)=><Checkbox key={index} value={i.iqo_id} atype={i.iqo_type} aid={i.iqo_id} >
            {
              i.opt_content
            }
            {

              i.iqo_type==='1'
                ?<span className={Styles.checkText}>
                  <Input  defaultValue={this.state.otherChecked[i.iqo_id]} style={{ width: 100, marginLeft: 10 }} disabled={!this.state.otherChecked[i.iqo_id]} onChange={this.extTextChange(i)}/>
                  {isRule?null:<p>{RULES_TEXT['200']}</p>}
                </span>
                // <Tooltip placement="topLeft" title={'问答题答案200字以内！'}  trigger={['focus']} visible={!isRule}>
                //   <Input  defaultValue={dv[0].uas_text} style={{ width: 100, marginLeft: 10 }} disabled={!this.state.otherChecked[i.iqo_id]} onChange={this.extTextChange(i)}/>
                //   {isRule?null:<p>asdasdsd</p>}
                // </Tooltip>
                :null

            }

          </Checkbox>)
        }
      </Checkbox.Group>
    )
  }
}


function QuestionItem_input({onChange, anonymity_flag, iq_id, defaultValue, isRule}) {
  let changeHandle=(e)=>{
    let isRule=true;
    let text=e.target.value.trim();
    if(text.length>500){
      isRule=false
    }
    onChange([{text,anonymity_flag,iq_id}],isRule)
  }
  return(
    <div className={Styles.checktextarea}>
      <Input size="small"  defaultValue={defaultValue} type="textarea" rows={2}  onChange={changeHandle}/>
      {isRule?null:<p>问答题答案500字以内！</p>}
    </div>
    // <Tooltip placement="bottomRight" title={'问答题答案500字以内！'} visible={!isRule}>
    //   <Input size="small" style={{width:'50%'}} defaultValue={defaultValue} type="textarea" rows={4}  onChange={changeHandle}/>
    //
    // </Tooltip>
  )
}

class QuestionWrap extends React.Component{
  constructor(props){
    super(props)
    let {anonymity_flag, save_iqo, ques_type, save_text, iq_id}=props

    this.state={
      anonymity_flag,
      isChange:false,
      require:props.require_flag==='1',
      type:ques_type,
      isRule:true
    }
    if(ques_type==='2'){
      this.state.values=[{text:save_text,anonymity_flag,iq_id}]
    }else{
      this.state.values=save_iqo?JSON.parse(save_iqo).map(i=>{
        return {
          iqo_id:i.save_iqoid,
          anonymity_flag,
          iqo_type:i.save_uas_text?'1':'0',
          uas_text:i.save_uas_text
        }
      }):[]
    }
  }

  onChange=(values,isRule=true)=>{
    this.state.values=values
    this.state.isChange=true
    this.setState({
      isRule
    })
    //console.log(values)
  };
  getAnswerComponent=({ques_type:type,option_content='',anonymity_flag,iq_id,save_text},isRule)=>{

    let save_iqo_parsed=this.state.values
    //debugger
    let answers=[]
    if(option_content){
      answers=JSON.parse(option_content)
    }
    if(!answers){
      console.log(option_content)
      console.log(iq_id)
      console.log(type)
    }
    if(type==='0'){
      //let answers=JSON.parse(option_content);

      return <QuestionItem_radio isRule={isRule} data={answers} onChange={this.onChange} defaultValue={save_iqo_parsed} flag={anonymity_flag}/>
    }
    if(type==='2'){
       return <QuestionItem_input isRule={isRule} defaultValue={save_text}  onChange={this.onChange} iq_id={iq_id} anonymity_flag={anonymity_flag}/>
    }
    if(type==='1'){


      return <QuestionItem_check isRule={isRule} data={answers} onChange={this.onChange} defaultValue={save_iqo_parsed} anonymity_flag={anonymity_flag}/>
    }
  };
  render(){
    let {ques_label, ques_content, ques_type, option_content, anonymity_flag, iq_id, save_iqo }=this.props
    //debugger
    let save_text=this.state.values.length?this.state.values[0].text:'';

    return(
      <div className={Styles.questionWrap}>
        <div className={Styles.question}>{this.state.require?<span style={{color:'red'}}>*</span>:null}{ques_label+ques_content}</div>
        <div className={Styles.answer}>
          {
            this.getAnswerComponent({ques_type, option_content, anonymity_flag, iq_id, save_iqo, save_text},this.state.isRule)
          }
        </div>
      </div>
    )
  }
}


export default class Questionnaire_main extends React.Component{
  state={
    title:'',
    Content:'',
    Remarks:'',
    InfoOwner:'',
    ShowDate:'',
    list:[],
    changeList:[]
  }
  async componentDidMount(){
    const {arg_infoid}=this.props.location.query;
    try{
      let {Title:title, Content, Remarks, InfoOwner, ShowDate, DataRows:list}=await servive.q_ques_query({
        arg_infoid,
        arg_userid: window.localStorage.sys_userid,
        arg_deptid: Cookies.get('dept_id')
      })
      this.setState({
        title,
        Content,
        Remarks,
        InfoOwner,
        ShowDate,
        list
      })
    }catch (e){
     // message.error('参数错误！请返回')
      console.log(e)
    }


  }
  onChange=()=>{

  }
  saveQuestion=(flag)=>async ()=>{
    let postData={
      arg_userid:Cookies.get('userid'),
      arg_infoid:this.props.location.query.arg_infoid,
      arg_subflag:flag,
      arg_ret:{
        select:[],
        text:[]
      }
    };
    let select=[], text=[];
    try{
      //取单选答案
      Object.values(this.refs).filter(i=>i.state.type==='0').forEach(i=>{
        if(!i.state.isRule){
          throw new Error(RULES_TEXT['200'])
        }
        if(i.state.values.length){
          let {iqo_id, iqo_type, uas_text, anonymity_flag}=i.state.values[0];
          select.push({
            iqo_id,
            anonymity_flag,
            iqo_type,
            uas_text:iqo_type==='1'?uas_text:undefined
          })
        }
      });
      //取多选答案
      Object.values(this.refs).filter(i=>i.state.type==='1').forEach(i=>{
        if(i){
          if(!i.state.isRule){
            throw new Error(RULES_TEXT['200'])
          }
          i.state.values.forEach(k=>{
            select.push(k)
          })
        }

      });
      //取问答题答案
      Object.values(this.refs).filter(i=>i.state.type==='2').forEach(i=>{
        if(i){
          if(!i.state.isRule){
            throw new Error(RULES_TEXT['500'])
          }
          i.state.values.forEach(k=>{
            if(k.text){
              text.push(k)
            }

          })
        }
      })




      postData.arg_ret=JSON.stringify({select,text});
      try{
        let {RetCode}=await servive.QuestionSubmit(postData)
        if(RetCode==='1'){
          message.success('保存成功！')
        }

      }catch (e){
        message.error(e.message)
      }
    }catch (e){
      message.error(e.message)
    }


   // console.log(answerList)
  }
  render(){
    let {title, Content, Remarks, InfoOwner, ShowDate, list}=this.state
    let types=new Set(list.map(i=>i.ec_name_show));
    return (
      <div className={Styles.wrap}>
        <div className={Styles.bg_head}>
          <img src={img_head}/>
        </div>
        <div className={Styles.zs_png}>
          <img src={zs_png}/>
        </div>
        <div className={Styles.main}>

          <h2>
            {title}
          </h2>
          <div className={Styles.main_head}>
            <p>{Content}</p>
            <p>{Remarks}</p>
            <p>
              {InfoOwner}
              {ShowDate}
            </p>

          </div>
          <div>
            {
              [...types].map((i,index)=>{
                return <div key={index} className={Styles.typeWrap}>
                  <h2>{i}</h2>
                  <div>
                    {
                      list.filter((k)=>k.ec_name_show===i).map((k,key)=><QuestionWrap key={key} {...k} onChange={this.onChange} ref={k.iq_id}/>)
                    }
                  </div>
                </div>
              })
            }
          </div>

        </div>
        <div className={Styles.btns}>
          <Button type='primary' onClick={this.saveQuestion(0)}>保存</Button>
          <Button type='primary' onClick={this.saveQuestion(1)}>提交</Button>
        </div>
      </div>
    )
  }
}
