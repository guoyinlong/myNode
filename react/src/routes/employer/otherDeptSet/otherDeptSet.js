import React from 'react';
//import { connect } from 'dva'
import tableStyle from "../../../components/common/table.less";
import Style from '../../../components/employer/employer.less';
import {Table,Button,Modal,Row,Col,Popconfirm,Select,message} from "antd";
import SelectPerson from "../../encouragement/authchange/checker.js";
import Cookie from 'js-cookie';
import * as service from "../../../services/employer/empservices.js"
const { Option } = Select;

export default class OtherDeptSet extends React.Component{
  state={
    personInfo:{
      'checkId':"",
      'checkName':"",
       'id':""
    },
    title:"",
    visible: false,
    tableInfo:[],
    BPdept:[],
    dept_name:"",
    dept_id:"",
    table_loading:false
    }
  
    columns=[
      {
        title: "序号",
        dataIndex:"key",
        key:"0"
      },
      // {
      //   title: "部门",
      //   dataIndex: "deptname",
      //   key:"2"
      // },
      {
        title: "分管部门",
        dataIndex: "principal_deptname",
        key:"5"
      },
      {
        title: "院领导",
        dataIndex: "username",
        key:"3"
      },
      {
        title: "操作",
        render: (value,record)=><div><span><a onClick={()=>this.showModal('edit',record)}>编辑</a></span>&nbsp;&nbsp;
          <Popconfirm
          title="确定删除这条信息吗?"
          onConfirm={()=>this.delete(record)}
          okText="是"
          cancelText="否"
        >
        <span><a>删除</a></span>
        </Popconfirm>
        
        </div>,
        key:"6"
      },
      ]
   
  async componentDidMount(){
  this.searchInfo()
  try{
    let deptInfo=await service.BPdept()
    //console.log('deptInfo',deptInfo)
    this.setState({
     BPdept:deptInfo.DataRows||[]
   })
   }catch(e){
   }
  }
  
  async searchInfo(){
  try{
    let {DataRows}=await service.BPinfo({
    state:3,
    flag:1,
    upt:Cookie.get('userid')
    })  
    //console.log('DataRows',DataRows)

    let tableInfo=[];
    (DataRows||[]).forEach(col=>{
    let res={
    principal_deptid:col.principal_deptid,
    principal_deptname:col.principal_deptname,
    deptname:col.deptname,
    username:col.flag==1?col.username:"-",
    userid:col.flag==1?col.staff_id:"",
    id:col.flag==1?col.id:"",
    }
    tableInfo.push(res)
    })

    this.setState({
    tableInfo
    })  
  }catch(e){

  }
  }

  delete= async (record)=>{
    let obj={
      state:1,
      staff_id:record.userid||null,
      staff_name:record.username||null,
      principal_deptinfo:JSON.stringify([
        { 
            principal_deptid:record.principal_deptid,  
            principal_deptname:record.principal_deptname, 
        }
    ]),
      flag:1,
      upt:Cookie.get('userid'),
      id:record.id
  }

  try{
    let res=await service.BPinfo(obj)  
    if(res.RetVal=="1"){
     message.success("删除成功")
    this.searchInfo()
    }
  }catch(e){
  
  } 
  }
  
  showModal = (title,record) => {
    let {personInfo,dept_name,dept_id}=this.state
    if(title=="edit"){
    personInfo['checkId']=record.userid
    personInfo['checkName']=record.username
    dept_id=record.principal_deptid
    dept_name=record.principal_deptname
    personInfo['id']=record.id
    }else{
      personInfo['checkId']=""
      personInfo['checkName']=""
      personInfo['id']=""
      dept_id=""
      dept_name=""
    }
    this.setState({
      visible: true,
      title:title=='edit'?'编辑':'添加',
      personInfo:{...personInfo},
      dept_name,
      dept_id,
    });
  };

  handleOk= async title  => {
 let {personInfo,dept_name,dept_id}=this.state
 if(dept_name==""||dept_id==""){
   message.warning("主责部门不能为空")
   return
 }
 if(personInfo['checkId']==""){
  message.warning("人员不能为空")
  return
}

this.setState({
  visible: false,
});
    
  let obj={
    state:title=="编辑"?2:0,
    staff_id:personInfo.checkId,
    staff_name:personInfo.checkName,
    principal_deptinfo:JSON.stringify([
        { 
            principal_deptid:dept_id,  
            principal_deptname:dept_name, 
        }
    ]),
    flag:1,
    upt:Cookie.get('userid'),
    id:personInfo.id||null
  }
 try{
  let res=await service.BPinfo(obj)  
  if(res.RetVal=="1"){
    message.success("操作成功")
  this.searchInfo()
  //this.clear()
  }
 } catch(e){

 }
 
  };


  handleCancel = e => {
    this.setState({
      visible: false,
    });
    //this.clear()
  };

  checkName=(value,name,key)=>{
   // console.log("传过来",value,name,key)
    let {personInfo}=this.state
    personInfo['checkId']=value
    personInfo['checkName']=name.split("(")[0]

    this.setState({
      personInfo
    });
  }

  handleChange(option) {
  //  console.log(`selected ${option}`);
    this.setState({
      dept_name:option.split("+")[0],
      dept_id:option.split("+")[1]
    })
  }

 clear(){
 let {personInfo}=this.state
 personInfo.checkId="";
 personInfo.checkName="";
  this.setState({
    personInfo,
    // dept_id:"",
    // dept_name:""
  })
 }


render(){
let {personInfo,title,tableInfo,BPdept,table_loading,dept_name}=this.state
  tableInfo.forEach((item,index)=>{
  item.key=index+1+""
})

return(
<div className={Style.wrap}>
  <Button type="primary" onClick={()=>this.showModal('add')} style={{float:"right"}}>添加</Button>
  <br></br>
  <br></br>
 <Table
     className={tableStyle.orderTable}
     columns={this.columns}
     dataSource={tableInfo}
     scroll={{ x:parseInt(200) }}
     bordered={true}
     size={"small"}
     pagination={false}
     loading={table_loading}
   />

       <Modal
          title={title}
          visible={this.state.visible}
          onOk={()=>this.handleOk(title)}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <Row>
          <Col span={3}><p>院领导 :</p></Col>
          <Col span={12}>
          <SelectPerson value={personInfo.checkId||null} sgin={'financeBP'} checkName={this.checkName}></SelectPerson>
          </Col>
          <Col span={1}></Col>
          <Col span={4}><Button onClick={this.clear.bind(this,'financeBP')}>清空</Button></Col>
          </Row>
          <br></br>
          <Row>
          <Col span={4}>
          <p>主责部门 ：</p>
          </Col>
          <Col>
          <Select style={{ width: 320 }} onSelect={this.handleChange.bind(this)} value={dept_name} >
            { BPdept.map(item=>{
              return(
                <Option value={item.deptname+"+"+item.deptid} key={item.deptname}>{item.deptname}</Option>
              ) 
            })
            }
          
          </Select>
          </Col>
          </Row>
         

        </Modal>
</div>
)

}
   
  
}