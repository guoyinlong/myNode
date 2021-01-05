/**
 * 作者：张枫
 * 创建日期：2019-09-06
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：我的待办
 */
import React from 'react';
import { connect } from 'dva';
import {Table,Button,Pagination,Input,Icon,Spin} from "antd";
import { routerRedux } from "dva/router"
import style from "./apply.less";
class TodoList extends React.PureComponent {
  constructor(props) {super(props);}
  state = {
    searchText: '',
    searchObject: {},
    filterDropdownVisible: false,
    searchValue: '',
    searchContent: {},
    dataIndex :'',
    nameVisible: false,
    deptVisible: false,
    userName:"",//申请人员你
    deptName:""//申请部门
  };

  // 搜索相关数据信息
    filterDropdown = (dataIndex,title) => {
    return (
      <div >
        <div className={style.search}>
          <Input
            className={style.searchInput}
            ref={ele => this.searchInput = ele}
            placeholder={title}
            value={this.state.searchText}
            onChange={(e) => this.onInputChange(e,dataIndex)}
            onPressEnter={() => this.onSearch(dataIndex)}
          />
          <Button type="primary" onClick={() => this.onSearch(dataIndex)}>搜索</Button>
        </div>
      </div>
    )
  }
    //当输入框的内容改变时
    onInputChange = (e,index) => {
      if(index == "user_name") {
        this.setState({
          userName:e.target.value,
          searchObject:{
            ...this.state.searchObject,
            userName:e.target.value
          }
        });
      } else if(index == "dept_name") {
        this.setState({
          deptName:e.target.value,
          searchObject:{
            ...this.state.searchObject,
            deptName:e.target.value
          }
        });
      };
      this.setState({ searchText: e.target.value});
    };
    //当搜索时
    onSearch = (dataIndex) => {
      const { searchText,searchObject} = this.state;
      this.setState({
        deptVisible: false,
        nameVisible: false,
        dataIndex,
        searchValue: searchText,
        searchContent: searchObject
      });
    };
  getNewData = (recordList,searchObject) => {
    const reg1 = new RegExp(searchObject.userName);
    const reg2 = new RegExp(searchObject.deptName);
    return recordList.filter(v => {
      return reg1.test(v.user_name) && reg2.test(v.dept_name)
    })
  };
  //当显隐状态改变时
    explicitimplicitchange = (name,visible) => {
      const {userName, deptName} = this.state
        if(name == "user_name") {
          this.setState({
            nameVisible: visible,
            searchText:userName
          },() => this.searchInput.focus())
        } else if(name == "dept_name") {
          this.setState({
            deptVisible: visible,
            searchText:deptName
          },() => this.searchInput.focus())
        };
    };
  //跳转至审批页面  （分别跳转至部门经理审批页面和管理员审批页面）
  gotoExamine = (record)=>{
    if(this.props.role === "3"){
      // 跳转至部门经理审批页面
      this.props.dispatch(
        routerRedux.push({
          pathname:"/adminApp/compRes/todoList/examine",
          query:record,
        })
      )
    }else if(this.props.role === "2"){
      this.props.dispatch(
        routerRedux.push({
          pathname:"/adminApp/compRes/todoList/adminExamine",
          query:record,
        })
      )
    }
  }
  //更改页面的页码
  changePage = (page)=>{
    this.props.dispatch({type:"todoList/changePage",data:page})
  }
  // 跳转至审批记录查询页面
  gotoExamineRecord =()=>{
    if(this.props.role === "3"){
      //部门经理
      this.props.dispatch(
        routerRedux.push({
          pathname:"/adminApp/compRes/todoList/managerApplyRecord"
        })
      )
    }else if(this.props.role === "2"){
      //属地管理员
      this.props.dispatch(
        routerRedux.push({
          pathname:"/adminApp/compRes/todoList/adminApplicationRecord"
        })
      )
    }
  }

  //根据条件生成filter选项
  getRealRecord = (record,key) =>{
    const midRecord = JSON.parse(JSON.stringify(record));
    let realList = [];
    let realRecord = [];
    let realRecordList = [];
    midRecord.map((v) => {
      realList.push(v[key]);
    });
    realRecord = Array.from(new Set(realList));
    realRecord.map((v) => {
      realRecordList.push({text:v,value:v})
    })
    return realRecordList;
  };

  render(){
    const {nameVisible, deptVisible} = this.state;
    //部门领导待审批列表
    const todoList = this.getNewData(this.props.todoList,this.state.searchContent);
   const columns = [
     /**
      {
        title:"序号",
        dataIndex:"key",
        render  :(index)=>{return(<div>{index+1}</div>)}
                <!--
        <Pagination
          current = {this.props.page}
          pageSize = {Number(this.props.pageSize)}
          total = {Number(this.props.total)}
          className = {style.pagination}
          onChange = {this.changePage}
        />
        -->
      },
      **/
      {
        title:"申请人员",
        dataIndex:"user_name",
        width:"10%",
        filterDropdownVisible: nameVisible,
        onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("user_name",visible),
        filterDropdown: this.filterDropdown('user_name',"申请人员"),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
       // render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"prop_desc",
        title:"性质",
        width:"5%",
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"dept_name",
        title:"申请部门",
        width:"17%",
        onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("dept_name",visible),
        filterDropdownVisible:deptVisible,
        filterDropdown: this.filterDropdown('dept_name',"申请部门"),
        filterIcon:<Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
       // render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"apply_time",
        title:"申请时间",
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"num",
        title:"申请数量（个）",
        width:"2%",
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"days",
        title:"申请时长（天）",
        width:"2%",
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"begin_time",
        title:"开始时间",
        width:"9%",
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"end_time",
        title:"到期时间",
        width:"9%",
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"type_desc",
        title:"申请状态",
        width:"10%",
        filters: this.getRealRecord(this.props.todoList,"type_desc"),
        //filterMultiple: false,
        onFilter: (value, record) => record.type_desc.indexOf(value) === 0,
        render  :(text)=>{return(<div>{text}</div>)}
      },
      {
        dataIndex:"",
        title:"操作",
        render  :(record)=>{
          return(
            <div>
              <Button type="primary" size = "small" onClick = {()=>this.gotoExamine(record)}>办理</Button>
            </div>
          )
        }
      }
    ];

    return (
      <Spin tip = "加载中..." spinning={this.props.loading}>
        <div className = {style.page}>
          <div className = { style.title }>{"我的待办"}</div>
          <div style = {{textAlign:"right",marginBottom:"5px"}}>
            <Button type="primary" style={{marginLeft:"3px",marginRight:"3px"}} onClick = {this.gotoExamineRecord}>审批记录查询</Button>
          </div>
          <Table
            //columns = {this.columns}
            columns = {columns}
            pagination = {true}
            dataSource = { todoList }
            className = {style.table}
          />
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
   loading:state.loading.models.todoList,
   ...state.todoList
   }
}

export default connect(mapStateToProps)(TodoList);
//export default connect()(RoleManager);
