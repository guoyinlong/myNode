/**
 * 作者：罗玉棋
 * 日期：2019-11-18
 * 邮箱：809590923@qq.com
 * 文件说明：查询三度全部人员信息
 */
import React from "react";
import { connect } from "dva";
import tableStyle from "../../../components/common/table.less";
import Style from '../../../components/employer/employer.less';
import style from "../../encouragement/authchange/authchange.less";
import {
  Table,
  Pagination ,
  Select,
  Button,
  Row,
  Col,
  Input
} from "antd";
const { Option } = Select;
class GlobalInfo extends React.Component{

  state={
    yearList:[],
    tYear:new Date().getFullYear(),
    staffvalue:"",
    deptvalue:"",
    ordering:"",
    pageNumber:1,
    pageRator:false,
    //changeSelect:false
  }

  componentDidMount=()=>{
    let tYear = new Date().getFullYear()
    let yearList=[]
     for(let i=2016;i<=tYear;i++){
      yearList.push(i)
     }
    this.setState({
      yearList: yearList
    });
    
  }

  componentWillReceiveProps(nextProps){
    const {searchEnd}=nextProps;
     if(searchEnd){
       this.setState({
        pageRator:false,
        //changeSelect:false
       })
     }
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
      deptvalue:value,
      //changeSelect:true
     },()=>{
      this.searchInfo()
     }) 
    
  }

  selecYear=(value)=>{
    this.setState({
     // changeSelect:true,
      tYear:value,
      staffvalue:undefined,
      deptvalue:undefined
      
     },()=>{

      this.searchInfo()
     })
    
  }

  pageChange=(pageNumber)=> {
    this.setState({
      pageNumber,
      pageRator:true
    },
    ()=>{
      this.searchInfo()
    })
    
  }

   //查询
   searchInfo=(value)=>{
    let {staffvalue,tYear,deptvalue,pageNumber,pageRator}=this.state
      this.setState({
        ordering:value||this.state.ordering,
      },
      
      ()=>{
        this.props.dispatch({
          type:"globalInfo/staffInfo",
          tYear,
          deptname:deptvalue,
          staff:staffvalue,
          pageNumber:pageRator?pageNumber:1,
          ordering:this.state.ordering
         })
      } 
      )
      if(pageRator) return

      this.setState({
        pageNumber:1
      })
   }
  

  render(){
    let {data,deptlist,RowCount}=this.props
    let {yearList,tYear,staffvalue,deptvalue,ordering,pageNumber}=this.state
    const columns = [
      {
        title: "员工编号",
        dataIndex:"staff_id"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
      },
      {
        title: "所在单位",
        dataIndex:"deptname",
      },
      {
        title: "所在部门",
        dataIndex:"dept_name",
        render:(value)=>(value.split("-")[1])

      },
      {
        title: "所在项目",
        dataIndex:"proj_name"
      },
      {
        title: "原始分",
        dataIndex:"raw_score"
     
      },
      {
        title: <span>M值得分&nbsp;&nbsp;
        <Button style={{color:ordering=="eval_m asc"?"#FA7252":"",borderColor:ordering=="eval_m asc"?"#FA7252":""}} icon="arrow-up" onClick={()=>this.searchInfo("eval_m asc")} shape="circle" size="small"></Button>&nbsp;
        <Button style={{color:ordering=="eval_m desc"?"#FA7252":"",borderColor:ordering=="eval_m desc"?"#FA7252":""}} icon="arrow-down" onClick={()=>this.searchInfo("eval_m desc")} shape="circle"  size="small" ></Button> </span>,
       dataIndex:"eval_m",
       //sorter: (a, b) => a.eval_m - b.eval_m,
      },

    ];
    return    <div className={Style.wrap}>
    <br />
   <br />
   <Row>
   <Col span={5} style={{ minWidth: 250 }}>
       <label>年度 : &nbsp;</label>
       <Select  style={{ width: 200 }} defaultValue={tYear+""} onSelect={this.selecYear}>
       {yearList.map(el => {
            return <Option value={el+""} key={el+""} >{el}</Option>;
         })}
       </Select>
     </Col>

     <Col span={5} style={{ minWidth: 250 }}>
       <label>单位 :  &nbsp;</label>
       <Select style={{ width: 200 }} onChange={this.selectopt} value={deptvalue}  onSelect={this.selectOpt}>
         {     deptlist.map((item) => {
      return (
        <Option key={item.OU} value={item.OU} >
          {item.OU}
        </Option>
          );
         })}
       </Select>
     </Col>
     <Col span={5} style={{ minWidth: 280 }}>
     <label>模糊搜索 :  &nbsp;</label><Input style={{ width: 200 }} placeholder="姓名/员工编号"  onChange={this.staffInput} value={staffvalue}></Input>
     </Col>
     

     <Button className={style.btn_select} onClick={()=>this.searchInfo()}> 
       查 询
     </Button>
     <Button className={style.btn_select} onClick={this.clearInfo}>
       清 空
     </Button>
   </Row>
   <br />
   <br />
      <Table
      className={tableStyle.orderTable}
      columns={columns}
      dataSource={data}
      scroll={{ x:parseInt(200) }}
      bordered={true}
      pagination={false}
      size={"small"}
      />
     {data.length>0&&(
      //  changeSelect?
      // <div style={{textAlign:"center",marginTop:25}} className={style.pagination}>
      // <Pagination key={"589"} defaultCurrent={1} total={parseInt(RowCount)} hideOnSinglePage={true} current={pageNumber}/>
      // </div>
      // :
      <div style={{textAlign:"center",marginTop:25}}>
      <Pagination key={"589"} defaultCurrent={1} total={parseInt(RowCount)} onChange={this.pageChange} hideOnSinglePage={true} current={pageNumber} />
      </div>
      )
     } 
   
</div> 
    
  }


}

function mapStateToProps(state) {

  return {
    ...state.globalInfo
  };
}

export default connect(mapStateToProps)(GlobalInfo);

