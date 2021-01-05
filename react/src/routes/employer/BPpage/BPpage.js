import React from 'react';
import { connect } from 'dva'
import tableStyle from "../../../components/common/table.less";
import Style from '../../../components/employer/employer.less';
import {Table,Button,Modal,Row,Col,Popconfirm,Select,message} from "antd";
import SelectPerson from "../../encouragement/authchange/checker.js";
import Cookie from 'js-cookie';
import * as service from "../../../services/employer/empservices.js"
//import message from '../../../components/commonApp/message';
const { Option } = Select;
 class  BPpage extends React.Component{

  state={
  personInfo:{
    'financeBP':{},
    'HRBP':{},
    'fbpid':{},
    'hbpid':{}
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
      title: "主责部门",
      dataIndex: "principal_deptname",
      key:"5"
    },
    {
      title: "专职BP",
      children:[
        {
          title: "财务BP",
          dataIndex: "financeBP",
          key:"3"
        },
        {
          title: "HRBP",
          dataIndex: "hrBP",
          key:"4"
        },
      ]
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
    
//tableInfo=[
  // {principal_deptid:"000123",principal_deptname:'架构部',deptname:'创新部',financeBP:'邰云燕',financeBP_id:"0009809",hrBP:'赵晨',hrBP_id:"0838726"},
  // {principal_deptid:"000123",principal_deptname:'架构部',deptname:'创新部',financeBP:'耿向东',financeBP_id:"0180307",hrBP:'-',hrBP_id:""},
  // {principal_deptid:"000123",principal_deptname:'研发部',deptname:'计费部',financeBP:'薛芳',financeBP_id:"0868239",hrBP:'李培',hrBP_id:"0790270"},
//]

async componentDidMount(){
this.searchInfo()
try{
 let deptInfo=await service.BPdept()
// console.log('deptInfo',deptInfo)
 this.setState({
  BPdept:deptInfo.DataRows||[]
})
}catch(e){
}

}

searchInfo=async()=>{
  this.setState({
    //tableInfo:[],
    table_loading:true
  })
  try{
    let {DataRows}=await service.BPinfo({
      state:3,
      flag:0,
      upt:Cookie.get('userid')
 }) 
 let mylist= JSON.parse(JSON.stringify(DataRows))
 //console.log('mylist',mylist) 
//let {tableInfo}=this.state
let tableInfo=[];
let copyList=DataRows
copyList.forEach((item,index)=>{
  DataRows.forEach((el,elex)=>{
if(item.principal_deptid==el.principal_deptid&&item.deptname==el.deptname&&item.tag!=el.tag){
  let obj={
    principal_deptid:item.principal_deptid,
    principal_deptname:item.principal_deptname,
    deptname:item.deptname,
    financeBP:item.tag==0?item.username:el.username,
    financeBP_id:item.tag==0?item.staff_id:el.staff_id,
    fbpid:item.id,
    hbpid:el.id,
    hrBP:el.tag==1?el.username:item.username,
    hrBP_id:el.tag==1?el.staff_id:item.staff_id
  }
  tableInfo.push(obj)
   delete  DataRows[elex]
   delete  DataRows[index]
   delete  copyList[elex]
   delete  copyList[index]
}
  })
})

if(copyList.length>=1){
  copyList.forEach(col=>{
  let res={
    principal_deptid:col.principal_deptid,
    principal_deptname:col.principal_deptname,
    deptname:col.deptname,
    financeBP:col.tag==0?col.username:"-",
    financeBP_id:col.tag==0?col.staff_id:"",
    fbpid:col.tag==0?col.id:"",
    hbpid:col.tag==1?col.id:"",
    hrBP:col.tag==1?col.username:"-",
    hrBP_id:col.tag==1?col.staff_id:""
  }
    tableInfo.push(res)
  })

}

this.setState({
  tableInfo,
  table_loading:false
})

  }catch(e){
  }
}


delete= async (record)=>{

  let obj={
    state:1,
    staff_id:record.financeBP_id||null,
    staff_name:record.financeBP||null,
    principal_deptinfo:JSON.stringify([
      { 
          principal_deptid:record.principal_deptid,  
          principal_deptname:record.principal_deptname, 
      }
  ]),
    flag:0,
    tag:0,
    upt:Cookie.get('userid'),
    id:record.fbpid
}

let obj2={
  state:1,
  staff_id:record.hrBP_id||null,
  staff_name:record.hrBP||null,
  principal_deptinfo:JSON.stringify([
    { 
        principal_deptid:record.principal_deptid,  
        principal_deptname:record.principal_deptname, 
    }
]),
  flag:0,
  tag:1,
  upt:Cookie.get('userid'),
  id:record.hbpid
}
  this.submit(obj,obj2)
}


showModal = (title,record) => {
    let {personInfo,dept_name,dept_id}=this.state
    if(title=="edit"){
    personInfo['financeBP'].checkId=record.financeBP_id
    personInfo['financeBP'].checkName=record.financeBP=="-"?"":record.financeBP
    personInfo['fbpid'].id=record.fbpid,
    personInfo['hbpid'].id=record.hbpid,
    personInfo['HRBP'].checkId=record.hrBP_id
    personInfo['HRBP'].checkName=record.hrBP=="-"?"":record.hrBP
    dept_id=record.principal_deptid
    dept_name=record.principal_deptname
    }else{
      personInfo['financeBP']={}
      personInfo['HRBP']={}
      dept_id=""
      dept_name=""
      personInfo['fbpid']={}
      personInfo['hbpid']={}
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
 if(JSON.stringify(personInfo['financeBP'])=="{}"||personInfo['financeBP'].checkId==""){
   if(JSON.stringify(personInfo['HRBP'])=="{}"||personInfo['HRBP'].checkId==""){
    message.warning("请选择BP人员")
    return
   }
}

  let obj={
    state:title=="编辑"?2:0,
    staff_id:personInfo['financeBP'].checkId||null,
    staff_name:personInfo['financeBP'].checkName||null,
    principal_deptinfo:JSON.stringify([
        { 
            principal_deptid:dept_id,  
            principal_deptname:dept_name, 
        }
    ]),
    flag:0,
    tag:0,
    upt:Cookie.get('userid'),
    id:personInfo['fbpid'].id||null
}

  let obj2={
    state:title=="编辑"?2:0,
    staff_id:personInfo['HRBP'].checkId||null,
    staff_name:personInfo['HRBP'].checkName||null,
    principal_deptinfo:JSON.stringify(
      [
        { 
            principal_deptid:dept_id,  
            principal_deptname:dept_name, 
        }
    ]
    ),
    flag:0,
    tag:1,
    upt:Cookie.get('userid'),
    id:personInfo['hbpid'].id||null
  }

 try{
  this.submit(obj,obj2)
 } catch(e){

 }
 this.setState({
  visible: false,
});

  };

  submit=async(obj,obj2)=>{
    if(obj.staff_id!=null){
      try{
        let result=await service.BPinfo(obj)
        if(result.RetVal=="1"){
         message.success("操作成功")
         }
      }catch(e){
      
      }
     }  
     if(obj2.staff_id!=null){
      try{
        let result=await service.BPinfo(obj2)
        if(result.RetVal=="1"){
         message.success("操作成功")
         }
      }catch(e){
      
      }
     }
     this.searchInfo()
  }
 


  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  checkName=(value,name,key)=>{
   // console.log("传过来",value,name,key)
    let {personInfo}=this.state
    personInfo[key]['checkId']=value
    personInfo[key]['checkName']=name.split("(")[0]
    this.setState({
      personInfo
    });
  }

  handleChange(option) {
    //console.log(`selected ${option}`);
    this.setState({
      dept_name:option.split("+")[0],
      dept_id:option.split("+")[1]
    })
  }

 clear(key){
 let {personInfo}=this.state
 personInfo[key]={}
  this.setState({
    personInfo
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
          <Col span={3}><p>财务BP :</p></Col>
          <Col span={12}>
          <SelectPerson value={personInfo['financeBP'].checkId||null} sgin={'financeBP'} checkName={this.checkName}></SelectPerson>
          </Col>
          <Col span={1}></Col>
          <Col span={4}><Button onClick={this.clear.bind(this,'financeBP')}>清空</Button></Col>
          </Row>
          <br></br>
          <Row>
          <Col span={3}>
          <p>HRBP :</p>
          </Col>
          <Col span={12}>
          <SelectPerson value={personInfo['HRBP'].checkId||null} sgin={'HRBP'} checkName={this.checkName}></SelectPerson>
          </Col>
          <Col span={1}></Col>
          <Col span={4}><Button onClick={this.clear.bind(this,'HRBP')}>清空</Button></Col>
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

function mapStateToProps (state) {
  return {
  };
}

export default connect(mapStateToProps)(BPpage);