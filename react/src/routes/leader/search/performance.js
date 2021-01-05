/**
 * 作者：罗玉棋
 * 日期：2019-11-18
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评-三度年度个人考核
 */
import React from "react";
import { connect } from "dva";
import Style from '../../../components/employer/employer.less';
import style from "./performance.less";
import Report from './Report'
import Cookie from 'js-cookie';
import request from "../../../utils/request";
import {
Row,
Col,
Card,
Select,
Icon
} from "antd";

const user_id = Cookie.get('userid');

const { Option } = Select;

//let tYear=new Date().getFullYear()
class Performance extends React.Component{

  state = {
    isSelect:false,
    defaultYear:'',
    yearList:[],
    allowUploadYear:''
  }

  async componentWillMount(){
    let year = await request('/microservice/examine/moduletime',).then((data)=>{
        if(data.RetCode == '1' && data.DataRows){
          return data.DataRows[0].examine_year
        }
    })

    let dateNowYear = new Date().getFullYear()
    let finallyYear = year?year:dateNowYear
    let years = []
    for (let index = 2019; index <= dateNowYear; index++) {
      years.push(index)
    }

    this.setState({
      yearList:years,
      defaultYear:finallyYear,
      allowUploadYear:finallyYear
    })
    this.upDatePerformance(year)
  }


  upDatePerformance = (year) => {
    const {dispatch} = this.props 
    let postData={
      "arg_year":year?year.toString():this.state.defaultYear,
      "arg_staffId":user_id,
      "arg_tag":0
      }
    dispatch({
      type:'performance/personInfo',
      postData
    })
  }

  render(){
    let {data}=this.props  //let data={}
    const {defaultYear,isSelect,yearList,allowUploadYear} = this.state
    let options
    if (yearList&&yearList.length) {
      options = yearList.map((item,index) => 
        <Option key = {item}>
          {item}
        </Option>
      )
    }
    let orgarr=["org_ouaddOrsubtract","org_party","org_support","org_performance","org_specialization","org_learnAndgrowth","org_GS"];
    let perarr=["per_ouaddOrsubtract","per_party","per_support","per_performance","per_specialization","per_learnAndgrowth","per_GS"]

    return    <div  className={Style.wrap}>
     <Row className={style.row_Info} style={{textAlign:"center"}}>
       <div className={style.wapper}>
        <div
          className={style.textOrSelect}
          onClick={()=>{
            this.setState({
              isSelect:true
            })
          }}
        >
          {
              isSelect
              ?
                <Select className={style.select}
                  onSelect={(value)=>{
                    this.setState({
                      isSelect:false,
                      defaultYear:value
                    })
                    this.upDatePerformance(value)
                  }}
                  defaultValue={defaultYear}
                >
                  {options}
                </Select>
              :
                defaultYear
            }
        </div>
        <span className={style.text}>年个人考核结果</span>
       </div>
       <Icon type="info-circle"
          className={style.iconTip}
       >
          <span className={style.tip}>点击年份可进行切换！</span>
       </Icon>
      </Row>
     
     <div style={{marginTop:'30px'}}>
      <Report 
        is_edit = "true" 
        staff_id = {Cookie.get('userid')} 
        year={defaultYear} 
        allowUploadYear={allowUploadYear}
      ></Report>
    </div>
    <Row style={{border:"1px solid #e6e0e0",padding:"20px",marginTop:"10px"}}>
    <Row className={style.row_Info}><h2>三度评价结果:</h2></Row>
    <Row className={style.row_Info}>
     <Col span={8}>
      员工编号 ：{data.staff_id||window.localStorage.getItem("staffid")}
     </Col>
     <Col  span={8}>
      姓名 ：{data.staff_name||window.localStorage.getItem("fullName")}
     </Col>
     <Col span={8}>
      部门 ： {data.dept_name||window.localStorage.getItem("deptname").split("-")[1]}
     </Col>
    </Row>
    <Row className={style.row_Info}>
     <Col span={8}>
     贡献度 ( 20% ) ：{data.evaluate_score1?<span>{data.evaluate_score1}分</span>:<span className={style.content_text}>( 暂无数据 )</span>}
     </Col>
     <Col  span={8}>
     胜任度 ( 40% ) ：{data.evaluate_score2?<span>{data.evaluate_score2}分</span>:<span className={style.content_text}>( 暂无数据 )</span>}
     </Col>
     <Col span={8}>
      公信度  ( 40% ) ：{data.evaluate_score3?<span>{data.evaluate_score3}分</span>:<span className={style.content_text}>( 暂无数据 )</span>}
     </Col>
    </Row>
    <Row className={style.row_Info}></Row>
    <Row className={style.row_Info}> 计算公式 ：A ( 20% ) + B ( 40% ) + C ( 40% )= Q</Row>
    <Row className={style.row_Info}>
     <Col span={8}>
     总分 ： {data.evaluate_sum||<span className={style.content_text}>0</span>} 分  
     </Col>
     <Col  span={16}>
     </Col>
    </Row>
    </Row>
    <Row style={{border:"1px solid #e6e0e0",padding:"20px",marginTop:"40px"}}>
    <Row className={style.row_Info}><h2>年度考核结果:</h2></Row>
    <Row className={style.row_Info}>
    <Col span={8}>
      员工编号 ：{data.staff_id||window.localStorage.getItem("staffid")}
     </Col>
     <Col  span={8}>
      姓名 ：{data.staff_name||window.localStorage.getItem("fullName")}
     </Col>
     <Col span={8}>
      部门 ： {data.dept_name||window.localStorage.getItem("deptname").split("-")[1]}
     </Col>
    </Row>
    <Row className={style.row_Info}></Row>
    <Row className={style.row_Info}>
    <Col  span={6}>
     <Card title="组织绩效得分" className={style.org_title}>
  
     {data.org_ouaddOrsubtract&&<p className={style.card_content}>加减分 : {data.org_ouaddOrsubtract}分</p> }
     {data.org_party&&<p className={style.card_content}>党建工作 : {data.org_party}分</p> }
     {data.org_support&&<p className={style.card_content}>支撑服务 : {data.org_support}分</p> }
     {data.org_performance&&<p className={style.card_content}>效益类指标 : {data.org_performance}分</p> }
      {data.org_specialization&&<p className={style.card_content}>专业化指标 : {data.org_specialization}分</p> }
      {data.org_learnAndgrowth&&<p className={style.card_content}>学习与成长 : {data.org_learnAndgrowth}分</p> }
      {data.org_GS&&<p className={style.card_content}>GS重点工作 : {data.org_GS}分</p> }
      
      {
        !Object.keys(data).some((item)=>orgarr.includes(item))&&<span className={style.content_text}>( 暂无数据 )</span>
      }
    
  
    </Card>
     </Col>
     <Col  span={6}>
     <Card title="个人绩效得分" className={style.per_title}>
  
     {data.per_ouaddOrsubtract&&<p className={style.card_content}>加减分 : {data.per_ouaddOrsubtract}分</p> }
     {data.per_party&&<p className={style.card_content}>党建工作 : {data.per_party}分</p> }
      {data.per_support&&<p className={style.card_content}>支撑服务 : {data.per_support}分</p> } 
      {data.per_performance&&<p className={style.card_content}>效益类指标 : {data.per_performance}分</p> }
      {data.per_specialization&&<p className={style.card_content}>专业化指标 : {data.per_specialization}分</p> }
      {data.per_learnAndgrowth&&<p className={style.card_content}>学习与成长 : {data.per_learnAndgrowth}分</p> }
      {data.per_GS&&<p className={style.card_content}>GS重点工作 : {data.per_GS}分</p> }
      {
        !Object.keys(data).some((item)=>perarr.includes(item))&&<span className={style.content_text}>( 暂无数据 )</span>
      }
    </Card>
     </Col>
     <Col span={6}>
     <Card title="三度评价"  className={style.card_title}>
      <p className={style.card_content}>贡献度(20%) ：
      {data.evaluate_score1||<span className={style.content_text}>－</span>}分</p>
      <p className={style.card_content}>胜任度(40%) ：
      {data.evaluate_score2||<span className={style.content_text}>－</span>}分</p>
      <p className={style.card_content}>公信度(40%) ：
      {data.evaluate_score3||<span className={style.content_text}>－</span>}分</p>
    </Card>
     </Col>
     <Col  span={6}>
     <Card title="个人加减分" className={style.card_title}>
      <p className={style.card_content}>{data.addorsubtract_score?<span>{data.addorsubtract_score}分</span>:<span className={style.content_text}>( 暂无数据 )</span>}</p>
    </Card>
     </Col>
    </Row>
    <Row className={style.row_Info}></Row>
    <Row className={style.row_Info}>
    <Col span={6}>
    <div style={{height:"10%"}}>
    <div style={{marginTop:"10px"}}>&nbsp;</div>
  <div style={{marginTop:"20px"}}> 总分 ：{data.person_sum ||<span className={style.content_text}>0 </span>} 分</div>
    </div> 
    </Col>
    <Col span={6}>
     考核结果 ：<span style={{color:"red",fontSize:60}}>{data.examine_result||<span className={style.content_text}>?</span>}</span> 
     </Col>
     </Row>
    </Row>

  
  </div> 
    
  }


}

function mapStateToProps(state) {

  return {
    ...state.performance
  };
}

export default connect(mapStateToProps)(Performance);

