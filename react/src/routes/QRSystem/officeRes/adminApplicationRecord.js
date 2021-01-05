/**
 * 作者：彭东洋
 * 创建日期：2019-09-12
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：管理员工位申请-审批记录查询
*/
import React from 'react';
import { connect } from 'dva';
import {Button,DatePicker,Table,Pagination,Input,Icon} from "antd";
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import styles from "./apply.less";
const { RangePicker } = DatePicker;
class MangerApplyRecord extends React.PureComponent {
    constructor(props) {
        super(props);
    };
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
    //申请时间
    beginTime = (date,dateString) => {
        if(dateString[0] == "" && dateString[1] == "") {
            this.props.dispatch({
                type:"mangerApplyRecord/clearApplyDate"
            });
        }else{
            this.props.dispatch({
                type: "mangerApplyRecord/beginTime",
                data:dateString
            });
        };
    };
    //选中的条件改变时
    tableChangeHandle = (pagination,filters) => {
        this.setState({
            filterInfo:filters
        });
    };
    //到期时间
    endTime = (date,dateString) => {
        if(dateString[0] == "" && dateString[1] == "") {
            this.props.dispatch({
                type:"mangerApplyRecord/clearExpireDate"
            });
        }else{
            this.props.dispatch({
                type: "mangerApplyRecord/endTime",
                data: dateString
            });
        };
    };
   //返回申请页面
    goBack = () => {
       this.props.dispatch(
            routerRedux.push({
                pathname: "/adminApp/compRes/todoList"     //地址需要修改
            })
       );
    };
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
    getNewData = (recordList,searchObject) => {
        const reg1 = new RegExp(searchObject.userName);
        const reg2 = new RegExp(searchObject.deptName);
        return recordList.filter(v => {
            return reg1.test(v.user_name) && reg2.test(v.dept_name)
        })
    };
    filterDropdown = (dataIndex,title) => {
        return (
            <div className="custom-filter-dropdown">
                <div className={styles.search}>
                    <Input
                        className={styles.searchInput}
                        ref = {ele => this.searchInput = ele}
                        placeholder = {title}
                        value = {this.state.searchText}
                        onChange = {(e) => this.onInputChange(e,dataIndex)}
                        onPressEnter = {() => this.onSearch(dataIndex)}
                    />
                    <Button type="primary" onClick={() => this.onSearch(dataIndex)}>搜索</Button>
                </div>
            </div>
        )
    };
   //审批跳转
    goApprovalStatus = (record) => {
        const {dispatch} = this.props;
        dispatch(
            routerRedux.push({
                pathname:"/adminApp/compRes/todoList/adminApplicationRecord/adminDetail",
                query:record,
            })
        );
    };
    //审批状态查询
    approvalStatusQuery = (value,record) => {
        const { dispatch } = this.props
        dispatch({
            type:"mangerApplyRecord/approvalStatusQuery",
            data:"AdminReview"
        });
    };
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
    render() {
        let { recordList } = this.props;
        const {nameVisible, deptVisible} = this.state;
        const columns = [
            {
                dataIndex: "user_name",
                title: "申请人员",
                width: "100px",
                key:"user_name",
                filterDropdownVisible: nameVisible,
                onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("user_name",visible),
                filterDropdown: this.filterDropdown('user_name',"申请人员"),
                filterIcon: <Icon type="search" style={{ fontSize:"inherit" }} />,
            },
           {
                dataIndex: "dept_name",
                title: "申请部门",
                key: "dept_name",
                onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("dept_name",visible),
                filterDropdownVisible:deptVisible,
                filterDropdown: this.filterDropdown('dept_name',"申请部门"),
                filterIcon: <Icon type="search" style={{ fontSize:"inherit" }} />,
                reder: (text) => {
                    return (<div>{text}</div>)
                }
            },
           {
                dataIndex: "apply_time",
                title: "申请时间",
                key: "apply_time",
                render: (text) => {
                   return (<div>{text}</div> )
                }
            },
           {
                dataIndex: "num",
                title: "申请数量（个）",
                key: "num",
                render: (text) => {
                   return (<div>{text}</div> )
                }
           },
           {
                dataIndex: "days",
                title: "申请时长（天）",
                key: "days",
                render: (text) => {
                   return (<div>{text}</div> )
                }
           },
           {
                dataIndex: "begin_time",
                title: "开始时间",
                key: "begin_time",
                render: (text) => {
                   return (<div>{text}</div> )
                }
           },
           {
                dataIndex: "end_time",
                title: "到期时间",
                key: "end_time",
                render: (text) => {
                   return (<div>{text}</div> )
                }
           },
           {
                dataIndex: "type_desc",
                title: "申请类型",
                width: "100px",
                filters: this.getRealRecord(recordList,"type_desc"),
                filterMultiple: true,
                onFilter: (value, record) => record.type_desc.indexOf(value) === 0,
                key: "type_desc",
                render: (text) => {
                   return (<div>{text}</div> )
                }
           },
           {
                dataIndex: "state_desc",
                title: "审批状态",
                width: "100px",
                filters: this.getRealRecord(recordList,"state_desc"),
                filterMultiple: true,
                onFilter: (value, record) =>record.state_desc.indexOf(value) === 0,
                key: "state_desc",
                render: (text,record) => {
                   return (<a href="javascript:;" onClick={() => this.goApprovalStatus(record)}>{text}</a> )
                }
           },
        ];
        const dataSource = this.getNewData(recordList,this.state.searchContent);
        return(
            <div className = {styles.page}>
                <div className = {styles.title}>审批记录查询</div>
                <div style = {{overflow:"hidden"}}>
                    <Button type="primary" onClick={this.goBack} style = {{float:"right"}}>返回</Button>
                    {/* <Button type="primary" onClick={this.clearFilter} style = {{float:"left"}}>清空条件</Button> */}
                </div>
                <div className = {styles.dateSearch}>
                    <div>
                        <span>申请时间查询：</span>
                        <RangePicker onChange = {this.beginTime}></RangePicker>
                    </div>
                    <div>
                        <span style={{paddingLeft:"10px"}}>到期时间查询：</span>
                        <RangePicker onChange = {this.endTime}></RangePicker>
                    </div> 
                </div>
                <Table
                    columns = {columns}
                    dataSource = {dataSource}
                    pagination = {true}
                    className = {styles.table}
                    loading = {this.props.loading}
                    onChange={this.tableChangeHandle}
                >
                </Table>
            </div>
        );
    }

}
function mapStateToProps({mangerApplyRecord, loading}) {
   return {
       loading:loading.models.mangerApplyRecord,
       ...mangerApplyRecord
    }
}
export default connect(mapStateToProps)(MangerApplyRecord);
