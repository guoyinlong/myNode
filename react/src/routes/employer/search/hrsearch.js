/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：人力指标查询页面
 */

import SearchUI from './searchUI'
import {Button, Popconfirm, Select} from 'antd'
import {connect} from 'dva';
import Cookie from "js-cookie";
import * as hrService from '../../../services/hr/hrService.js';
import Style from '../deptremain/inputStyle.less'
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');
class HrSearch extends SearchUI {
 state={
  ouList:[],
  selectOuid:sessionStorage.getItem("selectOuid")||"",
  role:"2",
  search_year:JSON.parse(sessionStorage.getItem("search_year"))||[],
  search_season:JSON.parse(sessionStorage.getItem("search_season"))||[],
 }

 componentWillReceiveProps(nextProps){

  this.getOuList()
  if(Cookie.get('role')){
    this.setState({
      role:Cookie.get('role'),//cookie与服务器有交互
    })
  }
  if(nextProps.year)
  {
    this.setState({
      search_year:this.state.search_year.length==0?[nextProps.year]:this.state.search_year,
      search_season:this.state.search_season.length==0?[nextProps.season]:this.state.search_season,

    })
  }
 
  }

componentWillUnmount(){
  if( window.location.hash.split('?')[0].indexOf('hrsearch')<0){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie= "role="+Cookie.get('role')+";expires="+exp.toGMTString();
    sessionStorage.removeItem("search_season");
    sessionStorage.removeItem("search_year");
    sessionStorage.removeItem("selectOuid");
  }
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
        width:"5%"
      },
      {
        title: '季度',
        dataIndex: 'season',
        width:"5%",
        render: (text) => text != '0' ? `第${text}季度` : '年度考核'
      },
      {
        title: '部门',
        dataIndex: 'dept_name',
        width:"15%",
        //render: (text) => <div style={{textAlign: 'left'}}>{text}</div>
      },
      {
        title: '项目',
        dataIndex: 'proj_name',
        width:"15%",
        render: (text) => <div style={{textAlign: 'left'}}>{text}</div>
      },
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        width:"10%",
        render: (text) => <div>'{text}'</div>
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
        },

      },

      {
        title: '考核得分',
        dataIndex: 'score',
        width: '100px',
        width:"10%",
        render: (text) => <div style={{textAlign: 'right'}}>{text}</div>
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
            <Button type="danger">删除</Button>
          </Popconfirm>
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


  flags={
    needPro_id:false
  }

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
    if(key=="role"){
      this.setState({role:value})
      document.cookie="role="+value;  
      return
    }
    if(key=="search_year"){
     // console.log("search_year",value)
    this.setState({search_year:value})
    sessionStorage.setItem("search_year", JSON.stringify(value));
    //sessionStorage.setItem("test", 111);
    return
    }

    if(key=="search_season"){
     // console.log("search_season",value)
      this.setState({search_season:value})
      sessionStorage.setItem("search_season",JSON.stringify(value));
      return
    }

    this.setState({selectOuid:value})
    sessionStorage.setItem("selectOuid",value);
  }

  searchInfo=()=>{
    let {selectOuid,role}=this.state
    this.props.dispatch({
      type: 'hrSearch/initData',
      selectOuid:selectOuid,
      role:role
    })

  }



  render(){
    let {search_year,search_season,selectOuid}=this.state
     // 选择OU
 const  OUSelect = <div style={{backgroundColor:"#FFFFFF",paddingTop:10,minWidth:1020,float:"left",marginTop:10}} className={Style.input}>
  <div style={{float:"left"}}>
 &nbsp;&nbsp; &nbsp;&nbsp;<span>组织单元：</span>
  {
    Cookie.get('deptname_p').split('-')[1] === '联通软件研究院本部' ?
      <span>
        <Select style={{width: 300}} onChange={this.handleChange} value={selectOuid||Cookie.get('deptname_p').split('-')[1]}> 
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
  }
  </div> 
  <div style={{float:"left",marginLeft:10,height:20}} id="year">
       <div style={{float:"left",width:35,marginTop:3}} > 年份 : </div>&nbsp;
       <Select mode="multiple" style={{ width:170}} allowClear={true} value={search_year} key={'year'}
           onChange={(value)=>this.handleChange(value,'search_year')}  key={2020}  getPopupContainer={()=>document.getElementById("year")}>
        {
        ["2016","2017","2018","2019","2020"].map(
          item => <Option key={item} value={item}>{item}</Option>
        )
        }
        </Select>
        </div>
        <div style={{float:"left",marginLeft:10}} id="season">
        <div style={{float:"left",width:35,marginTop:3}}> 季度 :</div>&nbsp;
        <Select style={{width:140}} mode="multiple" allowClear={true} onChange={(value)=>this.handleChange(value,'search_season')} value={search_season}  key={'season'} getPopupContainer={()=>document.getElementById("season")}>
        {
        [{text: '第1季度', value: '1',},{text: '第2季度', value: '2',}, {text: '第3季度', value: '3',},{text: '第4季度', value: '4',},{text: '年度考核', value: '0'}].map(
          item => <Option key={item.value} value={item.value}>{item.text}</Option>
        )
        }
        </Select>
        </div>
      <div style={{float:"left"}}>
        &nbsp;&nbsp;
      <span> 群体 :&nbsp;
      <Select style={{width:100}} onChange={(value)=>this.handleChange(value,'role')} dropdownMatchSelectWidth={false} value={this.state.role+""||"2"} key={"002"}>
      <Option key={"all"} value={"2"}>全部</Option>
      <Option key={"corePost"} value={"0"}>核心岗</Option>
      <Option key={"staff"} value={"1"}>普通员工</Option>
      </Select>
      </span>
      </div>
      &nbsp;&nbsp;
      <Button type='primary' onClick={this.searchInfo}>查询</Button>
      <br></br><br></br>
</div>
    return <div>
      {OUSelect}
      {super.render()}
      </div>
  }
}

function mapStateToProps(state) {
  const {list,condition,dept_name,staff_id,staff_name,proj_name,season,year} = state.hrSearch;
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
    year
  };
}

export default connect(mapStateToProps)(HrSearch)
