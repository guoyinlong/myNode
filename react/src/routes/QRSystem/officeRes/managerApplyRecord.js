/**
 * 作者：彭东洋
 * 创建日期：2019-09-12
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：部门经理工位申请-申请记录查询
*/
import React from 'react';
import { connect } from 'dva';
import {Button,DatePicker,Table} from "antd";
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import styles from "./apply.less";
const { RangePicker } = DatePicker;
class MangerApplyRecord extends React.PureComponent {
    constructor(props) {
         super(props);
    };
    state = {

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
    //到期时间
    endTime = (date,dateString) => {
        if(dateString[0] == "" && dateString[1] == "") {
            this.props.dispatch({
                type:"mangerApplyRecord/clearExpireDate"
            });
        }else{
            this.props.dispatch({
                type: "mangerApplyRecord/endTime",
                data:dateString
            });
        };
    };

    //返回申请页面
    goBack = () => { 
        this.props.dispatch(
            routerRedux.push({
                pathname: "/adminApp/compRes/todoList/"     //地址需要修改
            })
        );
    };
    //审批跳转
    goApprovalStatus = (record) => {
        const {dispatch} = this.props;
            dispatch(
                routerRedux.push({
                    pathname:"/adminApp/compRes/todoList/managerApplyRecord/managerDetail",
                    query:record,
                })
            );
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
        let filterData = [];
        let stateDescData = [];
        recordList.length!=0 && recordList.map((item,index)=>{
            filterData.push({
              text:item.type_desc,
              value:item.type_desc
            });
            stateDescData.push({
              text:item.state_desc,
              value:item.state_desc
            });
        });
        const columns = [
            {
                dataIndex: "user_name",
                title: "申请人员",
                key:"user_name",
                render: (text) => {
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
                // filters: applicationType,
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
                // filters: approvalStatus,
                filters: this.getRealRecord(recordList,"state_desc"),
                filterMultiple: true,
                onFilter: (value, record) =>record.state_desc.indexOf(value) === 0,
                key: "state_desc",
                render: (text,record) => {
                    return (<a href="javascript:;" onClick={() => this.goApprovalStatus(record)}>{text}</a> )
                }
            },
        ];
        return(
            <div className = {styles.page}>
                <div className = {styles.title}>审批记录查询</div>
                <div>
                    部门：{Cookie.get("deptname")}
                </div>
                <div style = {{textAlign:"right"}}>
                    <Button type="primary" onClick = {this.goBack}>返回</Button>
                </div>
                {/* <div style = {{paddingBottom:"7px"}}> */}
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
                    dataSource = {recordList}
                    pagination = {true}
                    className = {styles.table}
                >
                </Table>
                {/* <Pagination
                    current = { this.props.page }
                    total = { this.props.total }
                    pageSize = { this.props.pageSize }
                    onChange = { this.changePage }
                    className = { styles.pagination }
                /> */}
            </div>
        );
    };
};
function mapStateToProps(state) {
    return {
        loading:state.loading.models.mangerApplyRecord,
        ...state.mangerApplyRecord
    };
};
export default connect(mapStateToProps)(MangerApplyRecord);
