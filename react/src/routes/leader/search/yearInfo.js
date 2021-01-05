/**
 * 作者：罗玉棋
 * 日期：2019-11-18
 * 邮箱：809590923@qq.com
 * 文件说明：查询年度全部人员信息
 */
import React from "react";
import { connect } from "dva";
import tableStyle from "../../../components/common/table.less";
import Style from '../../../components/employer/employer.less';
import style from "../../encouragement/authchange/authchange.less";
import request from "../../../utils/request";
// import classNames from 'classnames'
import {
  Table,
  Select,
  Button,
  Row,
  Col,
  Input,
} from "antd";
const { Option } = Select;
class YearInfo extends React.Component{
  state={
    yearList:[],
    // tYear:"2019",
    staffvalue:"",
    deptvalue:"",
    defaultYear:''
  }

  componentDidMount= async ()=>{
    // 查询年份
    let yearFin = await request('/microservice/eval/anonymousaccountlist',{arg_evalsys_type:1}).then((data) => {
      if (data.RetCode == '1'&&data.DataRows.length) {
        return data.DataRows[0].year
      }
    })

    let finaY = yearFin?yearFin:new Date().getFullYear()
    let yearList=[]
    for(let i=2015;i<=finaY;i++){
    yearList.push(i)
    }
    this.setState({
      yearList: yearList,
      defaultYear:finaY
    });

    const {dispatch} = this.props

    this.searchInfo()
    this.props.dispatch({
      type:"yearInfo/deptlist",
      tYear:finaY
    }) 

  }

  staffInput=(e)=>{
    this.setState({
     staffvalue:e.target.value.replace(/\s*/g,"")
    })
   }

   clearInfo=()=>{
    this.setState({
      staffvalue:undefined,
      deptvalue:undefined
     })
  }

  selectopt=(value)=>{
    this.setState({
      deptvalue:value
     }) 
  }


  selectYear=(value)=>{
    this.setState({
      defaultYear:value,
      staffvalue:undefined,
      deptvalue:undefined
     })
   this.props.dispatch({
    type:"yearInfo/deptlist",
    tYear:value
   }) 

  }
  //查询
  searchInfo=()=>{
    let {staffvalue,defaultYear,deptvalue}=this.state
     this.props.dispatch({
      type:"yearInfo/leaderInfo",
      tYear:defaultYear,
      deptname:deptvalue,
      staff:staffvalue
     })
   }

  render(){
    let {TableRowColumn,deptlist,leaderInfo,Table2RowColumn,tableFlage}=this.props
    let {yearList,staffvalue,deptvalue,defaultYear}=this.state
    return  <div  className={Style.wrap}>
    <br />
   <br />
   <Row>
     <Col span={5} style={{ minWidth: 250 }}>
       <label>年度 : &nbsp;</label>
       <span id="year">
       <Select  style={{ width: 180}} dropdownStyle={{height:150,overflow:"auto"}} value={defaultYear} onSelect={this.selectYear}
       getPopupContainer={()=>document.getElementById("year")}>
       {yearList.map(el => {
            return <Option value={el+""} key={el+""} >{el}</Option>;
         })}
       </Select></span>
     </Col>
     <Col span={8} style={{ minWidth: 250 }}>
       <label>部门 :  &nbsp;</label>
       <Select style={{ width: "80%" }} onChange={this.selectopt} value={deptvalue} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} dropdownMatchSelectWidth={false}>
         {     deptlist.map((item) => {
      return (
        <Option key={item.dept_name} value={item.dept_name} >
          {item.dept_name}
        </Option>
          );
         })}
       </Select>
     </Col>
     <Col span={5} style={{ minWidth: 280 }}>
     <label>模糊搜索 :  &nbsp;</label><Input style={{ width: 200 }} placeholder="姓名/员工编号"  onChange={this.staffInput} value={staffvalue}></Input>
     </Col>
     

     <Button className={style.btn_select} onClick={this.searchInfo}> 
       查 询
     </Button>
     <Button className={style.btn_select} onClick={this.clearInfo}>
       清 空
     </Button>
   </Row>
   <br />
   <br />
<Table
// className={classNames(tableStyle.orderTable,style['table-reset'])}
className={`${tableStyle.orderTable} ${style['table-reset']}`}
rowKey={(record)=>record.staff_id}
columns={tableFlage?TableRowColumn:Table2RowColumn}
dataSource={leaderInfo}
scroll={{ x:parseInt(200) }}
bordered={true}
size={"small"}
/></div> 
    
  }


}

function mapStateToProps(state) {

  return {
    ...state.yearInfo
  };
}

export default connect(mapStateToProps)(YearInfo);

