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
import { Radio, Input, Checkbox, Button, message, Spin } from 'antd';
import SuccessPage from "../successPage/successPage";
const RadioGroup = Radio.Group;


const RULES_TEXT={
  200:'答案字数必须在1-200之间！',
  500:'答案字数必须在15-500之间！'
};
class QuestionItem_radio extends React.Component{
  constructor(props){
    super(props);
    this.state={
      value:props.defaultValue.length?props.defaultValue[0].iqo_id:'',
      ext_iqo_id:{},
      ext_text:{}
    };
    props.data.forEach(i=>{
      if(i.iqo_type==='1'){
        this.state.ext_iqo_id[i.iqo_id]=true;
        this.state.ext_text[i.iqo_id]=''
      }
    })
  }

  onChange=(e)=>{
    let {value}=e.target;

    let {onChange, flag:anonymity_flag}=this.props;
    let flag=true;
    console.log(this.state.ext_iqo_id)
    if(this.state.ext_iqo_id[value]){
      if(!(this.state.ext_text[value].trim())){
        flag=false
      }
    }

    onChange([{iqo_id:value,iqo_type:'0',anonymity_flag}],flag);
    this.setState({
      value
    })
  };
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
  };
  render(){
    let {data, defaultValue, isRule}=this.props;
    let dv=defaultValue.length?defaultValue:[{iqo_id:'',uas_text:''}];
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
    super(props);
    this.state={
      value:props.defaultValue.length?props.defaultValue:[],
      otherChecked:{},
      postData:[],
      textCheck:{},
      checkedValues:props.defaultValue.map(i=>i.iqo_id),
      checkData:[]
    };
    props.data.forEach(i=>{
      if(i.iqo_type==='1'){
        this.state.textCheck[i.iqo_id]={
          iqo_id:i.iqo_id,
          anonymity_flag:props.anonymity_flag,
          iqo_type:i.iqo_type,
          uas_text:i.uas_text||''
        }
      }

    });
    props.defaultValue.forEach(i=>{
      if(i.iqo_type==='1'){
        this.state.otherChecked[i.iqo_id]=i.uas_text;
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
    let {onChange, anonymity_flag}=this.props;
    let otherChecked={};
    console.log(this.state.textCheck);

    let checkData=checkedValues.map(i=>{
      if(this.state.textCheck[i]){
        otherChecked[i]=true;
        return {
          iqo_id:i,
          iqo_type:'1',
          anonymity_flag
        }
      }else{
        return {
          iqo_id:i,
          iqo_type:'0',
          anonymity_flag
        }
      }


    });
    this.state.checkedValues=checkedValues;
    this.state.checkData=checkData;

    let data=this.getPostData();
    let flag=true;
    Object.keys(otherChecked).forEach(i=>{
      data.forEach(k=>{
        if(i===k.iqo_id){
          if(!(k.uas_text.trim())){
            flag=false
          }
        }
      })
    });
    onChange(data,flag);
    this.setState({
      otherChecked,

    })
  };
  getPostData=()=>{
    let {checkData, textCheck, checkedValues}=this.state;
    //debugger
    return checkedValues.map(i=>{
      if(textCheck[i]){
        return textCheck[i]
      }else{
        return checkData.filter(k=>k.iqo_id===i)[0]
      }
    })

  };
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
    };
    onChange(this.getPostData(),isRule);

    //console.log(this.state.postData)
    //onChange(iqo_id,{iqo_type, iqo_id},e.target.value);
    ///onChange(([{iqo_id,iqo_type,anonymity_flag,uas_text:e.target.value}]));
  };
  render(){
    let {data, defaultValue, isRule}=this.props;

    let dv=defaultValue.length?defaultValue:[{iqo_id:'',uas_text:''}];
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


function QuestionItem_input({onChange, anonymity_flag, iq_id, defaultValue, isRule, require}) {
  let changeHandle=(e)=>{
    let isRule=true;
    let text=e.target.value.trim();
    if(text){
      if(text.length>500){
        isRule=false
      }
      if(text.length<15){
        isRule=false
      }
    }else{
      isRule=!require

    }


    onChange([{text,anonymity_flag,iq_id}],isRule)
  };
  return(
    <div className={Styles.checktextarea}>
      <Input size="small"  defaultValue={defaultValue} type="textarea" rows={2}  onChange={changeHandle}/>
      {isRule?null:<p>{RULES_TEXT[500]}</p>}
    </div>
    // <Tooltip placement="bottomRight" title={'问答题答案500字以内！'} visible={!isRule}>
    //   <Input size="small" style={{width:'50%'}} defaultValue={defaultValue} type="textarea" rows={4}  onChange={changeHandle}/>
    //
    // </Tooltip>
  )
}

class QuestionWrap extends React.Component{
  constructor(props){
    super(props);
    let {anonymity_flag, save_iqo, ques_type, save_text, iq_id, ec_name_show}=props;

    this.state={
      anonymity_flag,
      ec_name_show,
      isChange:false,
      require:props.require_flag==='1',
      type:ques_type,
      isRule:true
    };
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
    this.state.values=values;
    this.state.isChange=true;
    this.setState({
      isRule
    })
    //console.log(values)
  };
  getAnswerComponent=({ques_type:type,option_content='',anonymity_flag,iq_id,save_text,require},isRule)=>{

    let save_iqo_parsed=this.state.values;
    //debugger
    let answers=[];
    if(option_content){
      answers=JSON.parse(option_content)
    }
    if(!answers){
      console.log(option_content);
      console.log(iq_id);
      console.log(type)
    }
    if(type==='0'){
      //let answers=JSON.parse(option_content);

      return <QuestionItem_radio isRule={isRule} data={answers} onChange={this.onChange} defaultValue={save_iqo_parsed} flag={anonymity_flag}/>
    }
    if(type==='2'){
       return <QuestionItem_input isRule={isRule} require={require} defaultValue={save_text}  onChange={this.onChange} iq_id={iq_id} anonymity_flag={anonymity_flag}/>
    }
    if(type==='1'){


      return <QuestionItem_check isRule={isRule} data={answers} onChange={this.onChange} defaultValue={save_iqo_parsed} anonymity_flag={anonymity_flag}/>
    }
  };
  render(){
    let {ques_label, ques_content, ques_type, option_content, anonymity_flag, iq_id, save_iqo, show }=this.props;
    let {require}=this.state;
    //debugger
    let save_text=this.state.values.length?this.state.values[0].text:'';

    return(
      <div className={Styles.questionWrap} style={{display:show?'block':'none'}}>
        <div className={Styles.question}>{this.state.require?<span style={{color:'red'}}>*</span>:null}{ques_label+ques_content}</div>
        <div className={Styles.answer}>
          {
            this.getAnswerComponent({ques_type, option_content, anonymity_flag, iq_id, save_iqo, save_text,require},this.state.isRule)
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
    changeList:[],
    showType:'',
    types:[],
    pageSize:5,
    currentPage:1,
    loading:true,
    isSubmit:false
  };
  async componentDidMount(){
    const {arg_infoid}=this.props.location.query;
    try{
      let {Title:title, Content, Remarks, InfoOwner, ShowDate, DataRows:list, StartTime, EndTime}=await servive.q_ques_query({
        arg_infoid,
        arg_userid: window.localStorage.sys_userid,
        arg_deptid: Cookies.get('dept_id')
      })


      let types=[...new Set(list.map(i=>i.ec_name_show))];
      let showType=types[0];
      this.setState({
        title,
        Content,
        Remarks,
        InfoOwner,
        ShowDate,
        list,
        types,
        showType,
        StartTime,
        EndTime,
        loading:false
      })
    }catch (e){
      message.error('参数错误！请返回')
      this.goList()
      this.setState({
        loading:false
      })
    }


  }
  componentWillUnmount(){
    if(!this.state.isSubmit){
      this.saveQuestion(0)(0,1)
    }

  }
  scrollTop=()=>{
    let scrollToTop = window.setInterval(function() {
      let target=document.querySelector('#main_container');
      let pos = target.scrollTop;
      if ( pos > 70 ) {
        target.scrollTo( 0, pos - 30 );
      } else {
        window.clearInterval( scrollToTop );
      }
    }, 16);
  };
  changeType=(i,index)=>async()=>{

    if(await this.saveQuestion(0)(1)){

    }else {
      this.setState({
        showType:i,
        currentPage:index+1
      });
    }


  };
  changePage=(flag)=>async ()=>{
    if(await this.saveQuestion(0)(flag)){
      return
    }
    this.scrollTop();
    let {currentPage, types}=this.state;
    if(flag===1){
      this.setState({
        showType:types[currentPage+1-1],
        currentPage:currentPage+1
      })
    }
    if(flag===0){
      this.setState({
        showType:types[currentPage-1-1],
        currentPage:currentPage-1
      })
    }


  };

  saveQuestion=(flag)=>async (saveFlag,alertFlag)=>{
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
      if(flag===1){
        Object.values(this.refs).forEach(i=>{
          if(i.state.require){
            if(i.state.type!=='2'){
              if(!i.state.values.length){
                throw new Error('请检查必答题是否填写！')
              }
            }
            if(i.state.type==='2'){
              if(!i.state.values[0].text){
                throw new Error('请检查必答题是否填写！')
              }
            }

          }
        })
      }
      //必达验证
      if(saveFlag){
        Object.values(this.refs).filter(k=>k.state.ec_name_show===this.state.showType).forEach(i=>{
          if(i.state.require){
            if(i.state.type!=='2'){
              if(!i.state.values.length){
                throw new Error('请检查必答题是否填写！')
              }
            }
            if(i.state.type==='2'){
              if(!i.state.values[0].text){
                throw new Error('请检查必答题是否填写！')
              }
            }

          }
        })
      }

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
      });




      postData.arg_ret=JSON.stringify({select,text});
      try{
        this.setState({
          loading:true
        });
        let {RetCode ,RetVal}=await servive.QuestionSubmit(postData);
        if(RetCode==='-1'){
          throw new Error(RetVal)
        }
        if(RetCode==='1'){
          //message.success(RetVal);
          this.setState({
            loading:false,
            isSubmit:flag===1
          });
          if(flag===1){
            message.success(RetVal);

          }

        }

      }catch (e){
        if(!alertFlag){
          message.error(e.message);
        }

        this.setState({
          loading:false
        });
      }
    }catch (e){
      message.error(e.message);
      this.setState({
        loading:false
      });
      return true

    }


   // console.log(answerList)
  };
  translateToHTML(text){

    return text.replace(/\\n/g,'<br/>').replace(/\\t/g,'&#8195;&#8195;')
  }

  render(){
    let {title, Content, Remarks, InfoOwner, ShowDate, list, types, showType,  currentPage, StartTime, isSubmit, EndTime}=this.state;
    //let itemNum=list.filter(i=>i.ec_name_show===showType).length
    return (
      <div>
        {isSubmit
          ?null
          :<ul className={Styles.slideTabs}>
            {
              types.map((i,index)=><li className={showType===i?Styles.currTab:''} key={index} onClick={this.changeType(i,index)} value={i}>{i}</li>)
            }
          </ul>
        }

        <Spin spinning={this.state.loading}>
          {
            isSubmit?<SuccessPage title={'您已提交过问卷，非常感谢！'} startTime={3} history={this.props.history}/>
              :<div className={Styles.wrap+" "+Styles.wrap_bg}>

                <div className={Styles.bg_head}>
                  <img src={img_head}/>
                </div>

                <div className={Styles.main}>


                  <h2>
                    {title}
                  </h2>
                  <div className={Styles.main_head} style={{display:showType===types[0]?'block':'none'}}>
                    <p dangerouslySetInnerHTML={{__html:this.translateToHTML(Content)}}></p>
                    <p>开放时间：{StartTime} ~ {EndTime}</p>
                    <p dangerouslySetInnerHTML={{__html:this.translateToHTML(Remarks)}}></p>
                    <p>
                      {InfoOwner}
                      {ShowDate}
                    </p>

                  </div>
                  <div style={{paddingTop:'20px'}}>

                    {
                      types.map((i,index)=>{
                        return <div key={index} className={Styles.typeWrap}>
                          <h2 style={{display:i===showType?'block':'none'}}>{i}</h2>
                          <div>
                            {
                              list.filter((k)=>k.ec_name_show===i).map((k,key)=><QuestionWrap show={k.ec_name_show===showType} key={key} {...k} onChange={this.onChange} ref={k.iq_id}/>)
                            }
                          </div>
                        </div>
                      })
                    }
                    {
                      list.length?<div style={{textAlign:'center',paddingTop:'15px'}} className={Styles.pageBtns}>
                        {/*<Pagination current={currentPage} total={itemNum} pageSize={pageSize} onChange={this.changePage}/>*/}
                        {
                          currentPage===1?'':<Button type='primary' onClick={this.changePage(0)}>上一页</Button>
                        }
                        {
                          currentPage===types.length?'':<Button type='primary' onClick={this.changePage(1)}>下一页</Button>
                        }
                        {
                          list.length
                            ?currentPage===types.length
                            ?<Button type='primary' onClick={this.saveQuestion(1)} >提交</Button>
                            :null
                            :null
                        }
                      </div>:null
                    }

                  </div>

                </div>
                <div className={Styles.btns} ></div>
                {/*{*/}
                {/*list.length*/}
                {/*?<div className={Styles.btns} >*/}
                {/*<Tooltip title="问卷最后一页可以提交">*/}
                {/*<Button type='primary' onClick={this.saveQuestion(1)} disabled={currentPage!==types.length}>提交</Button>*/}
                {/*</Tooltip>*/}
                {/*</div>*/}
                {/*:null*/}
                {/*}*/}

              </div>
          }


        </Spin>
      </div>

    )
  }
}
