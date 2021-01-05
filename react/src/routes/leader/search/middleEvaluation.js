/**
 * 作者：罗玉棋
 * 日期：2019-12-18
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评结果导出
 */
import React from "react";
import { connect } from "dva";
import request from "../../../utils/request";
import tableStyle from "../../../components/common/table.less";
import Style from '../../../components/employer/employer.less';
import resultInfoStyle from './result.less'
import message from '../../../components/commonApp/message';
import exportExl from '../../../components/commonApp/exportExl';
import {
  Table,
  Select,
  Button,
  Row,
  Col,
  Input,
  Form,
} from "antd";
const {Option} = Select;
class MiddleEval extends React.Component{

   state={
    yearList:[],
    personInfo:{},
    staffvalue:"",
    searchLoading:false,
    orgvalue:"all",
    Tablecolumns:[],
    tableInfo:[],
    defaultYear:''
   }


  componentDidMount= async ()=>{
    // 查询年份
    let yearFin = await request('/microservice/eval/anonymousaccountlist',{arg_evalsys_type:1}).then((data) => {
      if (data.RetCode == '1'&&data.DataRows.length) {
        return data.DataRows[0].year
      }
    })
    //let tYear = new Date().getFullYear()
    let finaY = yearFin?yearFin:new Date().getFullYear()
    let yearList=[]
     for(let i=2017;i<=finaY;i++){
      yearList.push(i)
     }
    this.setState({
      yearList: yearList,
      tableInfo:this.props.data,
      defaultYear:finaY
    });

    const {dispatch} = this.props
    dispatch({
      type:'middleEvaluation/middleEvalInfo',
      tYear:finaY
    })
    
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tableInfo:nextProps.data
    });
  }


  submit=()=>{
  const{defaultYear,personInfo}=this.state
   for(let i in personInfo){
     if(Object.keys(personInfo[i]).length==0){
       delete personInfo[i]
     }
   }

        this.props.dispatch({
          type:"middleEvaluation/submitInfo",
          tYear:defaultYear,
          personInfo,
          successBack:(res)=>{
            res&&this.setState({
            personInfo:{}, 
          })
          }
        })
  }


  //年份查询
  selectOpt=(value)=>{
    this.setState({
      defaultYear:value,
      searchLoading:true,
      staffvalue:undefined
     })
    
    this.props.dispatch({
      type:"middleEvaluation/middleEvalInfo",
      tYear:value,
      callback:(res)=>{
        this.setState({
          searchLoading:res
        })
      }
    })
  }
  //查询
  searchInfo=()=>{
    let {staffvalue,defaultYear}=this.state
    let {data} =this.props
    let flage=0;
    if(staffvalue){
      data.forEach(item=>{
        if(item.staff_id==staffvalue||item.staff_name==staffvalue){
          this.setState({
            tableInfo:[...[item]]
          })
          flage=1
          return 
        }
      })
      if(flage){
        message.success("查询成功",2," ")
      }else{
        this.setState({
          tableInfo:[]   
        })
        message.warning("查询失败 , 暂无此员工 , 请核实员工信息是否正确 !",5," ")
      }
    }else{
      this.selectOpt(defaultYear)
    }

  }

  staffInput=(e)=>{
   this.setState({
    staffvalue:e.target.value.replace(/\s*/g,"")
   })
  }

  clearInfo=()=>{
    this.setState({
      staffvalue:undefined
     })
  }

  selectOrgnation=(value)=>{
    let {columns,Tablecolumns}=this.props
    if(value!="all")
   Tablecolumns[4]=columns[value]

    this.setState({
    orgvalue: value,
    Tablecolumns
    })

  }

  expExl= () =>{
    let tab=document.querySelector(`table`)
    exportExl()(tab,'中层互评结果导出')
  }

  render(){
    let {columns}=this.props
    const {yearList,searchLoading,staffvalue,orgvalue,Tablecolumns,tableInfo,defaultYear}=this.state;
  
    return(
     <div  className={Style.wrap}>
         <br />
        <br />
        <Row>
          <Col span={5} style={{ minWidth: 250 }}>
            <label>年度 : &nbsp;</label>
            
            <Select style={{ width: 200 }} value={defaultYear} onSelect={this.selectOpt}>
              {yearList.map(el => {
              return <Option value={el+""} key={el+""} >{el}</Option>;
              })}
            </Select>
          </Col>

          <Col span={7} style={{ minWidth: 250 }}>
          <label>群体 :  &nbsp;</label>
          <Select style={{ width: "75%" }} onSelect={(value)=>this.selectOrgnation(value)} >
            <Option value={"all"} key={"全部"} >全部</Option>
            <Option value={"4"} key={"领导班子聘任意见"} >领导班子聘任意见</Option>
            <Option value={"5"} key={"中层互评聘任意见"} >中层互评聘任意见</Option>
            <Option value={"6"} key={"本部门核心岗位及员工代表聘任意见"} >本部门核心岗位及员工代表聘任意见</Option>
            </Select>
            </Col>

          <Col span={5} style={{ minWidth: 250 }}>
          <label>搜索 :  &nbsp;</label>
          <Input style={{ width: 200 }} placeholder="姓名/员工编号" onChange={this.staffInput} value={staffvalue}></Input>
          </Col>
          

          <Button className={resultInfoStyle.btn_select} onClick={this.searchInfo} loading={searchLoading}> 
            查 询
          </Button>
          <Button className={resultInfoStyle.btn_select} onClick={this.clearInfo}>
            清 空
          </Button>

          <Button className={resultInfoStyle.btn_select}  disabled={searchLoading} onClick={this.expExl}>
           导 出 
         </Button>

        </Row>
        <br />
        <br />
    <Table
     className={tableStyle.orderTable}
     columns={orgvalue=="all"?columns:Tablecolumns}
     dataSource={tableInfo}
     loading={this.props.loading}
     scroll={{ x:parseInt(1500) }}
     bordered={true}
     size={"small"}
     pagination={false}
   /></div> 
    )
  }

}

function mapStateToProps(state) {

  return {
    ...state.middleEvaluation
  };
}
MiddleEval=Form.create()(MiddleEval)
export default connect(mapStateToProps)(MiddleEval);