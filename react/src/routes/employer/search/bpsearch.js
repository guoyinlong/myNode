/**
 * 作者：lyq
 * 日期：2020/9/1
 * 809590923@qq.com
 * 文件说明：bp指标查询页面
 */

import SearchUI from './searchUI'
import {Button, Popconfirm, Select} from 'antd'
import {connect} from 'dva';
import Cookie from "js-cookie";
import * as hrService from '../../../services/hr/hrService.js';
import { routerRedux } from 'dva/router';
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
let path =location.hash.split('/')[location.hash.split('/').length-1].split("?")[0]
class BpSearch extends SearchUI {
 state={
  ouList:[],
  selectOuid:"",
  search_year:"",
  search_season:"",
  focusName:"",
  role:""
 }

  componentWillReceiveProps(){
  this.getOuList()
  if(JSON.stringify(this.props.objData)!="{}"){
    //debugger
    this.setState({
      selectOuid:this.props.objData.selectOuid||"",
      search_year:this.state.search_year||this.props.objData.year||"",
      search_season:this.state.search_season||this.props.objData.season||"",
      focusName:this.state.focusName||this.props.objData.focusName||"",
      role:this.state.role||this.props.objData.role||""
      })
  }
 
  }

  componentWillUnmount(){
    this.props.dispatch({
      type:"hrSearch/clearList",
    })
  }

 async getOuList(){
  let {DataRows}=await hrService.getOuList({"arg_tenantid":auth_tenantid})
  if(DataRows.length>0){
    this.setState({
      ouList:DataRows
    })
  }
  }



  /**
   * 作者：李杰双、
   * 功能：动态生成表头
   */
  getHeader = () => {
    return [
      {
        title: '年度',
        dataIndex: 'year',
        width:"5%",
      },
      {
        title: '季度',
        dataIndex: 'season',
        width:"5%",
        render: (text) => text != '0' ? `第${text}季度` : '年度考核',
      },
      {
        title: '部门',
        dataIndex: 'dept_name',
        width:"15%",
        render: (text) => <div style={{textAlign: 'left'}}>{text}</div>,
      },
      {
        title: '项目',
        dataIndex: 'proj_name',
        width:"15%",
        render: (text) => <div style={{textAlign: 'left'}}>{text}</div>,
      },
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        width:"10%",
        render: (text) => <div>'{text}'</div>,
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        width:"10%",
      },
      {
        title: '状态',
        dataIndex: 'state',
        width:"10%",
        render: (text) => {
          //return this.stateMap[text]
          return <div style={{color: this.colorMap[text]}}>{this.stateMap[text]}</div>
        }
      },

      {
        title: '考核得分',
        dataIndex: 'score',
        width: '100px',
        width:"10%",
        render: (text) => <div style={{textAlign: 'right'}}>{text}</div>,
      },
      {
        title: '考核评级',
        dataIndex: 'rank',
        width:"5%",
      },
      {
        title: '操作',
        dataIndex: 'action',
        width:"15%",
        render: (text, record) => record.state === '0' || record.state === '10' ?
          <div style={{height: '28px', width: '64px'}}></div> :
          <Popconfirm title="确认删除这个指标？" onConfirm={this.deleteKpi(record)} okText="确定" cancelText="取消">
            <Button type="danger" disabled={true}>删除</Button>
          </Popconfirm>,
      }
    ]
  }
  needSearch = ['staff_id', 'staff_name', 'dept_name','proj_name'];

  needFilter=[
    {key:'state',
      filters: [
        {
          text: '待提交',
          value: '待提交',
        },
        {
          text: '待审核',
          value: '待审核',
        },
        {
          text: '审核未通过',
          value: '审核未通过',
        },
        {
          text: '完成情况未填报',
          value: '完成情况未填报',
        },
        {
          text: '待评价',
          value: '待评价',
        },
        {
          text: '待评级',
          value: '待评级',
        },
        {
          text: '考核完成',
          value: '考核完成',
        },
      ],
      onFilter: (value, record) => this.stateMap[record.state]=== value
    }
  ]

   //收集筛选时选中的信息
   tableChangeHandle=(pagination, filters, sorter)=>{
    console.log(filters)
    this.setState({
      filterInfo:filters
    })
  }

  rowClickHandle=(record, index, event)=>{
    const target=event.target
     if(target.nodeName==='BUTTON'||target.parentNode.nodeName==='BUTTON'){
       return
     }
     const{staff_id,year,season,state}=record;
     let {selectOuid,focusName,role,search_season,search_year}=this.state
     if(season==='0'){
       message.info('年度考核无指标详情！')
       return
     }
     if(state==='0'){
       message.info('指标未提交！')
       return
     }
     const {dispatch}=this.props;
     let query={};
     query={
      staff_id,
      year,
      season,
      selectOuid:selectOuid==""?1:selectOuid,
      search_season:search_season==""?"string":search_season,
      search_year:search_year==""?1:search_year,
      focusName:focusName==""?1:focusName,
      role:role==""?"string":role,
      stateTemp : state,
      filterInfo:Object.keys(this.state.filterInfo).length=="0"?1:JSON.stringify(this.state.filterInfo),  //筛选的年份/季度/状态
      dept_name:this.state.dept_name?JSON.stringify({
        filterDropdownVisible:this.state.dept_name.filterDropdownVisible,
        filtered:this.state.dept_name.filtered,
        searchText:this.state.dept_name.searchText,
      }):1,
      search_staff_id: JSON.stringify({
        filterDropdownVisible:this.state.staff_id.filterDropdownVisible,
        filtered:this.state.staff_id.filtered,
        searchText:this.state.staff_id.searchText,
      }),
      search_staff_name: JSON.stringify({
        filterDropdownVisible:this.state.staff_name.filterDropdownVisible,
        filtered:this.state.staff_name.filtered,
        searchText:this.state.staff_name.searchText,
      }),
      proj_name:this.state.proj_name?JSON.stringify({
        filterDropdownVisible:this.state.proj_name.filterDropdownVisible,
        filtered:this.state.proj_name.filtered,
        searchText:this.state.proj_name.searchText,
      }):1,
      bp_backPage:1
    }
    
     dispatch(routerRedux.push({
       pathname:`/humanApp/employer/${path}/searchDetail` ,
       query,
     }));
   };

  clearInfo=()=>{
  this.props.dispatch({
    type:"hrSearch/clearInfo",
  })
  }
  /**
   * 作者：李杰双、
   * 功能：删除kpi功能
   */
  deleteKpi = (record) => (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'hrSearch/deleteKpi',
      record
    })
  }
  pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
    pageSizeOptions: [ '20','100', '200', '400', '800', '1000']
  }

  // 选择组织单元
  handleChange=(value,key)=>{
  // console.log("value",value,"key",key)
  if(key=='ou'){
    this.props.dispatch({
      type: 'hrSearch/initData',
      selectOuid: value,
      })
    this.setState({selectOuid:value})
  }
   
   switch(key){
   case'search_year': this.setState({search_year:value}); break
   case'search_season': this.setState({search_season:value}); break
   case'focusName': this.setState({focusName:value}); break
   case'role': this.setState({role:value}); break
   }
 this.forceUpdate()

  }
  //查询
  bpSerch=()=>{
    let obj={
      year:this.state.search_year,
      season:this.state.search_season,
      focusName:this.state.focusName,
      role:this.state.role
    }
    this.props.dispatch({
      type: 'hrSearch/fetch',
      objData:obj,
      })

  }

  render(){
  let {selectOuid,search_year,search_season,focusName,role}=this.state
     // 选择OU
 const  OUSelect = <div style={{backgroundColor:"#FFFFFF",paddingTop:10,minWidth:970,float:"left",marginTop:10,}}>

  {/* <span>组织单元：</span>
  {
    Cookie.get('deptname_p').split('-')[1] === '联通软件研究院本部' ?
      <span>
        <Select style={{width: 300}} onChange={(value)=>this.handleChange(value,'ou')} value={selectOuid}>
          <Option value="all">全部</Option>
          {
           this.state.ouList.map(
              item => <Option key={item.OU} value={item.OU}>{item.OU}</Option>
            )
          }
        </Select>
      </span>
      :
      <span>{Cookie.get('deptname_p').split('-')[1]}</span>
  } */}
      &nbsp;&nbsp;&nbsp;&nbsp; <span> 年份 :&nbsp;
      <Select style={{width:100}} onChange={(value)=>this.handleChange(value,'search_year')} value={search_year||this.props.year||""}  key={2020}>
        {
        ["2016","2017","2018","2019","2020"].map(
          item => <Option key={item} value={item}>{item}</Option>
        )
        }
        </Select>
        </span>

        &nbsp;&nbsp;&nbsp;<span> 季度 :&nbsp;
      <Select style={{width:100}} onChange={(value)=>this.handleChange(value,'search_season')} value={search_season||this.props.season||""}>
        {
        [{text: '第1季度', value: '1',},{text: '第2季度', value: '2',}, {text: '第3季度', value: '3',},{text: '第4季度', value: '4',},{text: '年度考核', value: '0'}].map(
          item => <Option key={item.value} value={item.value}>{item.text}</Option>
        )
        }
        </Select>
        </span>

        &nbsp;&nbsp;&nbsp;&nbsp;<span> 归口部门 :&nbsp;
      <Select style={{width:320}} onChange={(value)=>this.handleChange(value,'focusName')} dropdownMatchSelectWidth={false} value={focusName||(this.props.focusDept.length!=0?this.props.focusDept[0].principal_deptname:"")} key={"606060"} > 
        {
        (this.props.focusDept||[]).map(
          item => <Option key={item.principal_deptid} value={item.principal_deptname}>{item.principal_deptname}</Option>
        )
        }
        </Select>
        </span>

        &nbsp;&nbsp;&nbsp;&nbsp;<span> 群体 :&nbsp;
      <Select style={{width:100}} onChange={(value)=>this.handleChange(value,'role')} dropdownMatchSelectWidth={false} value={role+""||"2"}>
      <Option key={"all"} value={"2"}>全部</Option>
      <Option key={"corePost"} value={"0"}>核心岗</Option>
      <Option key={"staff"} value={"1"}>普通员工</Option>
     
        </Select>
        </span>
        &nbsp;&nbsp;
        <Button type='primary' onClick={this.bpSerch}>查询</Button>
   </div>
    return <div>
      {OUSelect}
      {super.render()}
      </div>
  }
}

function mapStateToProps(state) {
  const {list,condition,dept_name,staff_id,staff_name,proj_name,season,year,focusDept,objData,loading} = state.hrSearch;
  // console.log("connect",condition)
  return {
    list,
    loading: state.loading.models.hrSearch,
    condition,
    dept_name,
    staff_id,
    staff_name,
    proj_name,
    season,
    year,
    focusDept,
    objData,
    loading
  };
}

export default connect(mapStateToProps)(BpSearch)
