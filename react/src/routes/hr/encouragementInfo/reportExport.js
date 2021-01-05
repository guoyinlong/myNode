/**
 * 文件说明：激励报告导出
 * 作者：罗玉棋
 * 邮箱：809590923@qq.com
 * 创建日期：2020-06-03
 */
import React from "react";
import { connect } from 'dva';
import {Select, Button, Input,Table,Row,Col,Popover,Icon} from 'antd';
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config'
import tableStyle from "../../../components/common/table.less";
import {parseParam} from "../../../utils/func.js"
import fetch from 'dva/fetch';
const auth_tenantid = Cookie.get('tenantid');
const Option = Select.Option;

class  ReportExport extends React.Component{

state={
  ou:Cookie.get('OU'), 
  dept:'',
  post:'',
  text:'',
  staffList: [],
  selectedRowKeys:[],
  yearList:[],
  report_type:[],
  tYear:new Date().getFullYear(),
  type_value:"1",
  loadings:false
}

componentDidMount=()=>{
  let tYear = new Date().getFullYear()
  let yearList=[]
   for(let i=2015;i<=tYear;i++){
    yearList.push(i)
   }
  this.setState({
    yearList: yearList
  });
  this.props.onRef(this)
}

dataSource = [];

 columns = [
  {
    title: '员工编号',
    dataIndex: 'staff_id',
    key: 'staff_id',
  },
  {
    title: '员工姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '部门',
    dataIndex: 'deptname',
    key: 'deptname',
  },
  {
    title: '职务',
    dataIndex: 'post_name',
    key: 'post_name',
  },

];

selectYear=(value)=>{
  this.setState({
    tYear:value,
   })
}
//模糊查询
handleTextChange = (e) => {
  this.setState ({
    text: e.target.value,
  })
};

 //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
 handleOuChange = (value) => {
  this.setState ({
    ou: value,
    dept:'',
    post:'',
    text:'',
    staffList: [],
    selectedRowKeys:[],
  },this.search.bind(this));
  
  const {dispatch} = this.props;
  dispatch({
    type:'encouragementImport/init',
  });

  if(value !== 'all'){  // 在组织单元选择全部时不查部门和职务
    dispatch({
      type:'encouragementImport/getDept',
      arg_param: value
    });
    dispatch({
      type:'encouragementImport/getPost',
      arg_param: value
    });
  }

};

//选择部门
handleDeptChange = (value) => {
  this.setState ({
    dept: value
  })
};

//选择职务
handlePostChange = (value) => {
  this.setState ({
    post: value
  })
};


//清空查询条件，只保留OU ==》 【修改】ou不保留 添加全部
clear = () => {
  this.setState ({
    dept:'',
    post:'',
    text:'',
    report_type:[],
   // ou: ''
   tYear:new Date().getFullYear(),
   selectedRowKeys:[]
  });
};

//查询
search = () => {
 let ou_search = this.state.ou;
    if(ou_search === null){
      ou_search = Cookie.get('OU');
    }
    if(ou_search === OU_HQ_NAME_CN){ //选中联通软件研究院本部，传参：联通软件研究院
      ou_search = OU_NAME_CN;
    }
    let arg_params = {};
    arg_params["arg_tenantid"] = auth_tenantid;
    arg_params["arg_allnum"] = 0; //固定参数
    arg_params["arg_ou_name"] = ou_search;
    if(this.state.dept !== ''){
      arg_params["arg_dept_name"] = ou_search + '-' + this.state.dept; //部门传参加上前缀
    }
    if(this.state.post !== ''){
      arg_params["arg_post_name"] = this.state.post;
    }
    if(this.state.text !== ''){
      arg_params["arg_all"] = this.state.text;
    }

    this.props.dispatch({
        type: 'encouragementImport/staffInfoSearch',
        arg_param: arg_params
      });
    
};

//报告类型
tagChange=(value)=>{
 //console.log('selected',value);
  this.setState({ report_type:value });
}
//勾选表格里的人
tableChange = selectedRowKeys => {
 //console.log('selectedRowKeys changed: ', selectedRowKeys); 
  this.setState({ selectedRowKeys });
};
exportRrport=async ()=>{
let { dataList,reportList }=this.props
let { selectedRowKeys,tYear,dept,post,ou,report_type,text,type_value} = this.state
let staffList=[],params={},result=[]

if(selectedRowKeys.length==0&&!Number(type_value)){
  message.warning("请勾选表格中的人员再导出！",3," ")
  return
}else{
    staffList=selectedRowKeys.map((keys)=>{
    return{
      staff_id:dataList[keys-1].staff_id,
      staff_name:dataList[keys-1].username,
      post_name:dataList[keys-1].post_name,
      deptid:dataList[keys-1].deptid,
      deptname:dataList[keys-1].deptname,
      ouid:dataList[keys-1].ouid,
      ouname:dataList[keys-1].ouname,
    }
  })
}

for(let name of report_type){
  (reportList||[]).forEach(item=>{
    if(item.report_name==name){
      result.push(item) 
    }
  })
}

params["arg_year"]=tYear
params["arg_ou"]=ou==OU_HQ_NAME_CN?OU_NAME_CN:ou,
params["arg_deptname"]=dept?(ou==OU_HQ_NAME_CN?OU_NAME_CN:ou)+"-"+dept:null
params["arg_postname"]=post||null
params["arg_search"]=text||null
params["arg_report_type"]=JSON.stringify(result)
params["arg_staffsInfo"]=staffList.length==0?null:JSON.stringify(staffList)

let url='/microservice/allencouragement/encouragement/export/reportexportpdf'
message.info("正在导出，请稍后...",5," ")
this.setState({
  loadings:true
})
let res=await this.request(url,params)
this.downLoadPDF(res)
}

 request=async (url, options,key)=>{
   return fetch(url, {
    method:'post',
    credentials: 'include',
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body:parseParam(options,key)
  }).then(res=>{
    return res.blob()
  })
 }

 
 downLoadPDF=(res)=>{
  const blob=new Blob([res],{ type:"application/zip" })
  const downLoadElement=document.createElement('a')
  const href =window.URL.createObjectURL(blob)
  downLoadElement.href=href
  downLoadElement.download='全面激励报告'
  document.body.appendChild(downLoadElement)
  downLoadElement.click()
  document.body.removeChild(downLoadElement)
  window.URL.revokeObjectURL(href)
    setTimeout(()=>{
      this.setState({
        loadings:false
       })
       message.success("导出成功",2," ")
    },5000)

}



//切换tab时候让所选状态清0
clearState=()=>{
  this.setState({
    dept:'',
    post:'',
    text:'',
    ou: Cookie.get('OU'),
    staffList: [],
    selectedRowKeys:[],
    tYear:new Date().getFullYear(),
    report_type:[],
  })
 // debugger
}

typeSelect = value=> {
  this.setState({
    type_value: value,
    selectedRowKeys:value=="1"?[]:this.state.selectedRowKeys
})
}

render(){
const { selectedRowKeys,yearList,tYear,report_type,loadings} = this.state
let { ouList, deptList,postList,dataList,reportList}=this.props
dataList.forEach((i,j)=>i.key=j+1)

const childlist=(reportList||[]).map(item=>{
  return <Option key={item.report_uid} value={item.report_name}>{item.report_name}</Option>
})

let content=<div><p>1、按筛选条件：先查询人员信息到表格中，再选择要导出的报告类型</p>
<p>2、按勾选人员：先查询人员信息到表格中，选择要导出的报告类型,</p>
 <p>再勾选表格中的人员</p>
</div>



  const rowSelection = {
    selectedRowKeys,
    onChange: this.tableChange,
    getCheckboxProps: () => {
        return  {disabled:Boolean(Number(this.state.type_value))}
    },
  }
return(
     <div>
     <Row>
      <Col span={6} style={{minWidth: 270}}  >
      <span>组织单元：</span>
      {Cookie.get('OU')==OU_HQ_NAME_CN?
      <Select style={{width: 200}} dropdownMatchSelectWidth = {false} onSelect={this.handleOuChange} value={this.state.ou}>
      {
        ouList.map((item) => {
        return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
        )
        })
      }
      </Select>
      :Cookie.get('OU')
       }
      </Col>

      <Col span={5} style={{minWidth: 250}} >
        部门：
      <Select style={{width: 200}} dropdownMatchSelectWidth = {false} onSelect={this.handleDeptChange} value={this.state.dept} dropdownMatchSelectWidth={false}>
      {
        deptList.map((item) => {
        return (
        <Option key={item}>
          {item}
        </Option>
        )
        })
      }
      </Select>
      </Col>

      <Col span={5} style={{minWidth: 250}} >
        职务：
      <Select style={{width: 200}} dropdownMatchSelectWidth = {false} onSelect={this.handlePostChange} value={this.state.post} dropdownMatchSelectWidth={false}>
        {
          postList.map((item) => {
            return (
              <Option key={item.post_name}>
                {item.post_name}
              </Option>
            )
          })
        }
      </Select>
      </Col>
      
      {/* <Col span={8}> */}
      <Col  span={4} style={{minWidth: 200}}>
      搜索：
      <Input style={{width: 150}} placeholder="姓名/员工编号" onChange={this.handleTextChange} value={this.state.text}/>
      </Col>
      <Col span={3} style={{minWidth: 150}} >
        &nbsp;&nbsp;<Button type="primary" onClick={this.search}>{'查询'}</Button>
        &nbsp;&nbsp;<Button type="primary" onClick={()=>this.clear()}>{'清空'}</Button>
      </Col>
      {/* </Col> */}

    </Row>
   <br></br>
   <hr></hr>
   <br></br>
    <Row style={{marginTop: 6}} >
      <Col span={3} style={{minWidth: 180}}>
        导出年度：
      <Select style={{width: 100}} dropdownStyle={{height:150,overflow:"auto"}} dropdownMatchSelectWidth = {false} defaultValue={tYear+""} value={tYear+""} onSelect={this.selectYear}>
       {yearList.map(el => {
            return <Option value={el+""} key={el+""} >{el}</Option>;
         })}
       </Select>
      </Col>

      {this.props.currentKey=="2"?
      <Col span={7} style={{minWidth: 470}} >
      报告类型：
      <Select mode="tags" style={{ width:400}}  placeholder="请输入/选择报告类别" onChange={this.tagChange} allowClear={true} value={report_type}>
      {childlist}
      </Select>
      </Col>
      :
      ""
      }
       <Col span={2} style={{minWidth: 150}}>
       <Select style={{width: 130}} defaultValue={"1"} onSelect={this.typeSelect} dropdownMatchSelectWidth = {false}>
        <Option value={"1"} key={"001"} >按筛选条件</Option>
        <Option value={"0"} key={"002"} >按勾选人员</Option>
       </Select>
        </Col>
       
      <Col span={2} style={{minWidth:70}}>
        &nbsp;&nbsp;<Button type="primary" disabled={report_type.length==0||dataList.length==0}
         loading={loadings}
         onClick={()=>this.exportRrport()}>导出</Button>
      </Col>
      <Col span={1} style={{minWidth: 50}}>
      <Popover content={content} title="提示" trigger="hover">
      <Icon type="file-unknown" style={{ fontSize: 25, color: '#FA7252' }}/>
      </Popover>
      </Col>
    </Row>
  
    <br></br><br></br>
    <Table dataSource={dataList.length>0?dataList:[]} columns={this.columns} rowSelection={{...rowSelection}} className={tableStyle.orderTable} />;
    </div>

  )
}
}

function mapStateToProps(state) {
  const { ouList, deptList,postList,dataList,reportList } = state.encouragementImport;

  return {
    ouList,
    deptList,
    postList,
    dataList,
    loading: state.loading.models.encouragementImport,
    reportList
  };
}
export default connect(mapStateToProps)(ReportExport)