/**
 * 作者：罗玉棋
 * 创建日期：2020-04-20
 * 邮箱：809590923@qq.com
 *文件说明：考核人变更页面
 */
import  React from 'react' 
import { connect }from 'dva'
import {Table,Modal,Button,Popconfirm,Pagination } from 'antd'
import style from '../../../components/employer/employer.less'
import tableStyle from '../../../components/common/table.less'
import SelectPerson from "../../encouragement/authchange/checker.js";
import Style from "../../encouragement/authchange/authchange.less";

class CheckerChange extends React.Component {

  state = { 
    visible: false,
    itemInfo:"",
    selectValue:[],
    selectName:[]
  };

  showModal = (record) => {
    this.setState({
      visible: true,
      itemInfo:record
    });
  };

  handleOk = () => {
    let {itemInfo,selectValue,selectName}=this.state
    let param={}
    param["arg_checkernew"]=[];
    for(let i=0;i<selectValue.length;i++){
        let obj={
            checker_id:selectValue[i],
            checker_name:selectName[i]
        }
        param["arg_checkernew"].push(obj)
    }
    param["arg_checkerold"]=itemInfo.checkers
    param["arg_projid"]=itemInfo.proj_id
    param["arg_projname"]=itemInfo.proj_name
     
    this.props.dispatch({
    type:"submitInfo",
    param
  })

    this.setState({
      visible: false,
      itemInfo:"",
      selectName:[],
      selectValue:[]
    });

  };

  handleCancel = e => {
    this.setState({
      visible: false,
      itemInfo:"",
      selectName:[],
      selectValue:[]
    });

  };
 
  //考核人名字
  checkName=(title,value,index)=>{
    let {selectValue,selectName} =this.state
    console.log("title",title,"value",value,"index",index)
    selectName[index]=title.split("(")[0]
    selectValue[index]=value
     this.setState({
      selectValue,
      selectName
     })
   }

  // org_Checker=()=>{
  //   let {itemInfo} =this.state
  //   let resArr=itemInfo.checkers.map(item=>item.checker_name)
  //   return resArr.join(",")
  // } 

  // now_Checker=()=>{
  //   let {selectValue} =this.state
  //   let resArr=selectValue.map(item=>item)
  //   return resArr.join(",")
  // } 

render(){
 let {itemInfo,selectValue} =this.state
 let columns = [
    {
      title: '项目ID',
      dataIndex: 'proj_id',
      key: 'proj_id',
    },
    {
      title: '项目名称',
      dataIndex: 'proj_name',
      key: 'proj_name',
    },
    {
      title: '项目经理',
      dataIndex: 'mgr_name',
      key: 'mgr_name',
    },
    {
      title: '现考核人',
      dataIndex: 'checkers',
      key: 'checkers',
      render:(value)=>{
        if (value&&Array.isArray(value)&&value.length>0) {
        let result=value.map(item=>item.checker_name)
        return result.join(",")
        }else{
          return '无'
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render:(value,record)=><div>
        <span><a onClick={()=>this.showModal(record)}>修改</a></span>
        &nbsp;&nbsp;
        {/* <span><a onClick={()=>this.showModal(record)}>详情</a></span> */}
        </div>
    }
   ]
 let data=[
    {
      "proj_id":"243",
      "proj_name":"2020中国联通天宫一体化平台",
      "mgr_name":"张世勋",
      "checkers":[
        {
          "checker_name":"何平",
          "checker_id":"001" 
        },
        {
          "checker_name":"王旭东",
          "checker_id":"002" 
        }
      ],
      key:0
    },
    {
      "proj_id":"243",
      "proj_name":"2020中国联通天宫一体化平台",
      "mgr_name":"张世勋",
      "checkers":[
        {
          "checker_name":"郭洪兵",
          "checker_id":"001" 
        },
      ],
     key:1
   },
   {
    "proj_id":"243",
      "proj_name":"2020中国联通天宫一体化平台",
      "mgr_name":"张世勋",
      "checkers":[
        {
          "checker_name":"郭洪兵",
          "checker_id":"001" 
        },
      ],
     key:2
   },
   {
    "proj_id":"243",
    "proj_name":"2020中国联通天宫一体化平台",
    "mgr_name":"张世勋",
    "checkers":[
      {
        "checker_name":"王旭东",
        "checker_id":"002" 
      }
    ],
     key:3
   },
   {
    "proj_id":"243",
      "proj_name":"2020中国联通天宫一体化平台",
      "mgr_name":"张世勋",
      "checkers":[
        {
          "checker_name":"何平",
          "checker_id":"001" 
        },
      ],
     key:4
   },
   {
    "proj_id":"243",
    "proj_name":"2020中国联通天宫一体化平台",
    "mgr_name":"张世勋",
    "checkers":[
      {
        "checker_name":"何平",
        "checker_id":"001" 
      }
    ],
     key:5
   },
   {
    "proj_id":"243",
    "proj_name":"2020中国联通天宫一体化平台",
    "mgr_name":"张世勋",
    "checkers":[
    ],
     key:6
   }
    ]

  let historyCol=[
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '季度',
      dataIndex: 'season',
      key: 'season',
    },
    {
      title: '变更前',
      dataIndex: 'org_checker',
      key: 'org_checker',
      render:(value)=>{
        if (value&&Array.isArray(value)&&value.length>0) {
        let result=value.map(item=>item)
        return result.join(",")
        }else{
          return '无'
        }
      }
    },
    {
      title: '变更后',
      dataIndex: 'now_checker',
      key: 'now_checker',
      render:(value)=>{
        if (value&&Array.isArray(value)&&value.length>0) {
        let result=value.map(item=>item)
        return result.join(",")
        }else{
          return '无'
        }
      }
    },
    {
      title: '操作者',
      dataIndex: 'optioner',
      key: 'optioner',
    }
  ]

  let history=[
    {
      "proj_id":"243",
      "time":"2020-04-05",
      "season":"2",
      "org_checker":["郭洪兵","张枫"],
      "now_checker":["何平","王旭东"],
      "optioner":"郭洪兵",
       key:0
     },
     {
      "proj_id":"243",
      "time":"2020-04-05",
      "season":"2",
      "org_checker":["郭洪兵","张枫"],
      "now_checker":["何平","王旭东"],
      "optioner":"郭洪兵",
       key:1
     },
     {
      "proj_id":"243",
      "time":"2020-04-05",
      "season":"2",
      "org_checker":["郭洪兵","张枫"],
      "now_checker":["何平","王旭东"],
      "optioner":"郭洪兵",
       key:2 
      },
      {
      "proj_id":"243",
      "time":"2020-04-05",
      "season":"2",
      "org_checker":["郭洪兵","张枫"],
      "now_checker":["何平","王旭东"],
      "optioner":"郭洪兵",
      key:3
      },
      {
      "proj_id":"243",
      "time":"2020-04-05",
      "season":"2",
      "org_checker":["郭洪兵","张枫"],
      "now_checker":["何平","王旭东"],
      "optioner":"郭洪兵",
      key:4
      },
      {
      "proj_id":"243",
      "time":"2020-04-05",
      "season":"2",
      "org_checker":["郭洪兵","张枫"],
      "now_checker":["何平","王旭东"],
      "optioner":"郭洪兵",
      key:5
      },
      {
        "proj_id":"243",
        "time":"2020-04-05",
        "season":"2",
        "org_checker":["郭洪兵","张枫"],
        "now_checker":["何平","王旭东"],
        "optioner":"郭洪兵",
        key:6
      },
      {
        "proj_id":"243",
        "time":"2020-04-05",
        "season":"2",
        "org_checker":["郭洪兵","张枫"],
        "now_checker":["何平","王旭东"],
        "optioner":"郭洪兵",
        key:7
      },
      {
        "proj_id":"243",
        "time":"2020-04-05",
        "season":"2",
        "org_checker":["郭洪兵","张枫"],
        "now_checker":["何平","王旭东"],
        "optioner":"郭洪兵",
        key:8
        },
        {
          "proj_id":"243",
          "time":"2020-04-05",
          "season":"2",
          "org_checker":["郭洪兵","张枫"],
          "now_checker":["何平","王旭东"],
          "optioner":"郭洪兵",
          key:9
          },
        {
          "proj_id":"243",
          "time":"2020-04-05",
          "season":"2",
          "org_checker":["郭洪兵","张枫"],
          "now_checker":["何平","王旭东"],
          "optioner":"郭洪兵",
          key:10
          }


  ]

  return(
  <div className={style.wrap+' '+tableStyle.orderTable}>
    <Table columns={columns} dataSource={this.props.InfoList} />
    {this.state.visible&&
      <Modal
      width={700}
      info={this.state.record}
      title="项目信息"
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      maskClosable={false}
      footer={
        <div>
          <Button type="primary"className={Style.btn_cancel} onClick={() => this.handleCancel()}>取消</Button>
         {selectValue.length!=0?
          <Popconfirm
          title="此修改会将此项目中原考核人变为现在所选考核人，确认修改吗？"
          // title={<div>此修改会将此项目中原考核人为 <span style={{color:"#FF7F50"}}>{this.org_Checker()}</span>变更现考核人为
          // <span style={{color:"#1E90FF"}}>{this.now_Checker()}</span>确认修改吗?</div>}
          onConfirm={this.handleOk}
          okText="确认"
          cancelText="再想想">
           <Button type="primary" className={Style.btn_ok}>确定</Button>
          </Popconfirm>
          :
          <Button type="primary" className={Style.btn_ok}>确定</Button>
         }
        </div>
      }
      >
      <div>项目ID &nbsp;&nbsp;&nbsp; ：{itemInfo.proj_id}</div>
      <br></br>
      <div>项目名称 ：{itemInfo.proj_name}</div>
      <br></br>
      <div>项目经理 ： {itemInfo.mgr_name}</div>
      <br></br>
      {Array.isArray(itemInfo.checkers)?
      itemInfo.checkers.map((item,index)=>{
        return(
        <div>
        <div style={{float:"left"}}>现考核人 ：</div>
        <div style={{width:250,float:"left"}}>
        <SelectPerson key={index} value={selectValue[index]?selectValue[index]:item.checker_name} style={{width:100}} checkName={(title,value)=>this.checkName(title,value,index)}></SelectPerson>
        </div>
        <br></br>
        <br></br>
        </div>)
      })
      :
      <div>
      <div style={{float:"left"}}>现考核人 ：</div>
      <div style={{width:250,float:"left"}}>
      <SelectPerson value={selectValue[0]?selectValue[0]:itemInfo.checkers[0].checker_name} style={{width:100}}  checkName={(title,value)=>this.checkName(title,value,0)}></SelectPerson>
      </div>
      <br></br>
      <br></br>
      </div>
      }
      <br></br>
      <hr></hr>
      <br></br>

      <div>变更记录 ：
      <br></br>
      <Table columns={historyCol} dataSource={history} className={tableStyle.orderTable} pagination={{pageSize:4}} />
         </div>
      
      </Modal>
    }
  </div>
  )
}
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.checkerChange,
    ...state.checkerChange
  };
}
export default connect(mapStateToProps)(CheckerChange)

