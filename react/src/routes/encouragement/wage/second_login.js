import Cookie from 'js-cookie'
import Style from './wage.less';
import React from "react";
import {Row,Col,Button,Input,message} from 'antd';
import * as hrService from '../../../services/hr/hrService.js'
var second_login=0

class SecondLogin extends React.Component{
  state={
    staffInfo:{},
    str_code:"",
    code_state:false,
    tip:"",
    timer:{},
    curCount:0,
    loadstate:false,
  }
  componentDidMount(){
    this.staffInfo()
  }

  componentWillUnmount(){
    window.clearInterval(this.state.timer);
  }

  staffInfo= async()=>{
  let resInfo=await hrService.selfinfoquery()
   if(resInfo.RetCode=='1'){
     this.setState({
      staffInfo:resInfo.DataRows[0]
     })
   }
  }

  throttle=(fn)=>{ 
  let timer = null;            
  return ()=>{                
      var context = this;               
      var args = arguments;                
      if (!timer) {                    
          timer = setTimeout(()=>{                        
          fn.apply(context, args);             
              timer = null;                    
          }, 2000);                
      }            
  }       
  }

   //发送邮件验证码
   sendCode=async()=>{
     this.setState({
       loadstate:true
     })
     let{staffInfo}=this.state
     try{
       let data=await hrService.sendCode({
         staff_id:staffInfo.staff_id,
         staff_name:staffInfo.username,
         staff_email:staffInfo.email
       })
       if(data.RetCode=='1'){
         message.warning("发送成功")
         this.setState({
           code_state:true,
           tip:"验证码已发送，请注意查收邮件！",
           timer:window.setInterval(this.SetRemainTime, 1000),
           curCount:300,
           loadstate:false
         })
        }
     }
     catch(e){
       message.warning(data.RetVal)
     }
   }
 
   SetRemainTime=()=>{
     let {curCount,timer}=this.state
     if (curCount == 0) {
        
         this.setState({
           tip:"邮件验证码已失效，请重新发送邮件！",
           code_state:false,
           timer:null
         })
         window.clearInterval(timer);  
     }
     else {
         curCount--;
         this.setState({
           curCount
         })
     }
 }
 
 
   //输入验证码
   handleChange=(e)=>{
   //console.log(e.target.value)
   let str_code=e.target.value
    this.setState({
     str_code
    })
   }
 
    //提交
    submit=async()=>{
    //console.log("111111")
    let{str_code,staffInfo,timer}=this.state
    if(str_code.trim()==""){
     message.warning("提交内容不能为空")
     return
    }else{
      try{
       let submitInfo=await hrService.submitCode({
         staff_id:staffInfo.staff_id,
         staff_code:str_code
        })
        if(submitInfo.RetCode=='1'){
         //message.warning("验证成功")
         window.clearInterval(timer);//停止计时器
         this.setState({
           tip:"验证成功，页面即将跳转...",
           timer:null
          })
         setTimeout(() => {
          document.cookie="second_login="+1;  
          location.reload()
         }, 3000); 
        }
      }
      catch(e){
         message.warning("验证失败,输入有误！")
    }
    }
   }
   render(){
    const {staffInfo,code_state,curCount,tip,loadstate} = this.state
    
    return <div className={Style.content} style={{textAlign:"center"}}>
    <br></br>
    <h1><b><span style={{color:"#b3b3b3"}}>二次登录验证</span></b></h1>
    <br></br><br></br>
    <div style={{textAlign:"center",fontSize:20,color:"red"}}>{tip?`提示：${tip}`:""}</div>
    <br></br>
    <div className={Style.cardDiv}>
    <br></br><br></br><br></br><br></br>
     <Row>
      <Col span={6}></Col>
    <Col span={4}>员工姓名 ：</Col> 
      <Col span={8}><Input placeholder="Basic usage" disabled={true} value={staffInfo.username} /></Col>
      <Col span={6}></Col>
     </Row>
     <br></br>
     <Row>
      <Col span={6}></Col>
    <Col span={4}>员工编号 ：</Col>
      <Col span={8}><Input placeholder="Basic usage" disabled={true} value={staffInfo.staff_id}/></Col>
      <Col span={6}></Col>
     </Row>
     <br></br>
     <Row>
      <Col span={6}></Col>
    <Col span={4}>邮箱 ：</Col>
      <Col span={8}><Input placeholder="Basic usage" disabled={true} value={staffInfo.email}></Input></Col>
      <Col span={6}></Col>
     </Row>
     <br></br>
     <Row>
      <Col span={6}></Col>
      <Col span={4}>验证码 ：</Col>
      <Col span={8}><Input placeholder="请输入验证码"  onChange={this.handleChange}/></Col>
      <Col span={6}></Col>
     </Row>
     <br></br> <br></br><br></br>
     <Row>
      <Col span={7}></Col>
      <Col span={6}><Button type="primary" onClick={this.sendCode} loading={loadstate} disabled={code_state?true:false}>{code_state?
      <b>发送验证码({curCount})</b>
      :
      <b>发送验证码</b>
     }</Button></Col>
      <Col span={6}><Button type="primary" onClick={this.throttle(this.submit)} disabled={!code_state?true:false}><b>提交</b></Button></Col>
      <Col span={5}></Col>
     </Row>
    </div>
    </div>
   }
}

export default SecondLogin;