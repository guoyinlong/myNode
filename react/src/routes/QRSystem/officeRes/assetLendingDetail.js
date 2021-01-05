/**
  * 作者： 彭东洋
  * 创建日期： 2019-09-17
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 借还信息查询
  */

import  React from 'react';
import { connect } from 'dva';
import {Table, Button, DatePicker, Input, Icon } from 'antd';
import  styles from './assetLendingDetail.less';
import { routerRedux } from 'dva/router';
const { RangePicker } = DatePicker;
class AssetLendingDetail extends React.Component {
    state = {
        searchText:"",
        applyFilterDropdownVisible:false,
        deptFilterDropdownVisible:false,
        dataIndex: "",
        searchValue: "",
        userName:"",
        userDeptName: "",
        startTime: null,
        endTime: null
    };
    //当输入内容发生改变时
    onInputChange = (e,index) => {
        if(index == "user_name") {
            this.setState({
            userName: e.target.value
            });
        } else if(index == "user_dept_name") {
            this.setState({
                userDeptName: e.target.value 
            });
        };
    this.setState({searchText:e.target.value});
    };
    //当搜索时
    onSearch = (dataIndex) => {
        const { searchText, userName, userDeptName, startTime, endTime} = this.state;
        const { dispatch } = this.props;
        const queryData = this.props.location.query;
        this.setState({
            deptFilterDropdownVisible :false,
            applyFilterDropdownVisible :false,
            dataIndex,
            searchValue: searchText,
        });
        const data = {
            arg_asset_id: queryData.asset_id,
            arg_user_name: userName,
            arg_user_dept_name: userDeptName,
            arg_begin_time: startTime,
            arg_end_time: endTime
        };
        dispatch ({
            type: "qrCodeCommon/detailsloaninformation",
            data
        });
    };
    //返回正确的时间
    realData = (data) => {
        if(data) {
            const realData = data.split(".")[0];
            return realData;
        };
    };
    //根据筛选条件生成新的数据源
    getNewData = (detailsList,dataIndex,searchText) => {
        if(!dataIndex) return detailsList;
        const reg =new RegExp(searchText);
        return detailsList.filter( v => {
            return reg.test(v[dataIndex]);
        });
    };
    //当显隐状态改变时
    explicitimplicitchange = (name,visible) => {
        const { userName, userDeptName } = this.state;
        if(name == "user_name") {
        this.setState({
            applyFilterDropdownVisible:visible,
            searchText:userName
            },() => this.searchInput.focus())
        } else if(name == "user_dept_name") {
        this.setState({
            deptFilterDropdownVisible:visible,
            searchText:userDeptName
        },() => this.searchInput.focus())
        };  
    };
    //生成筛选框
    filterDropdown = (dataIndex,title) => {
        return (
            <div className={styles.search}>
            <Input
                className={styles.searchInput}
                ref = {ele => this.searchInput = ele}
                placeholder = {title}
                value = {this.state.searchText}
                onChange = {(e)=>this.onInputChange(e,dataIndex)}
                onPressEnter = {() => this.onSearch(dataIndex)}
            />
            <Button type="primary" onClick={() => this.onSearch(dataIndex)}>搜索</Button>
            </div>
        );
    };
    //返回
    goBack = () => {
        const {dispatch} = this.props;
        dispatch(routerRedux.push({
            pathname:'/adminApp/compRes/qrcode_office_equipment/assetLendingInformation'
        }));
    };
    //时间筛选
    timeDate = (data,dateString) => {
    const {dispatch} = this.props;
    const { userDeptName, userName } = this.props;
    const queryData = this.props.location.query;
    if(dateString[0] == "" && dateString[1] =="") {
        this.setState ({
            startTime: null,
            endTime: null,
        });
        const data = {
            arg_begin_time: null,
            arg_end_time: null,
            arg_asset_id: queryData.asset_id,
            arg_user_name: userName,
            arg_user_dept_name: userDeptName,
        };
        dispatch({
            type:"qrCodeCommon/beginTime",
            data
        });
    }else{
        this.setState ({
            startTime: dateString[0],
            endTime: dateString[1],
        });
        const data = {
            arg_begin_time: dateString[0],
            arg_end_time: dateString[1],
            arg_asset_id: queryData.asset_id,
            arg_user_name: userName,
            arg_user_dept_name: userDeptName
        };
        dispatch({
            type:"qrCodeCommon/beginTime",
            data
        });
    };
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
        });
        return realRecordList;
    };
    render() {
        const urlQuery = this.props.location.query;
        const newData = this.props.detailsList;
        const {deptFilterDropdownVisible, applyFilterDropdownVisible} = this.state;
        const columns = [
            {
                dataIndex: "index",
                title: "序号",
                key:"index",
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "user_name",
                title: "申请人",
                key:"user_name",
                filterDropdownVisible:applyFilterDropdownVisible,
                onFilterDropdownVisibleChange:(visible)=>this.explicitimplicitchange("user_name",visible),
                filterDropdown: this.filterDropdown('user_name',"申请人"),
                filterIcon: <Icon type="search" />,
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "user_dept_name",
                title: "所属部门",
                key:"user_dept_name",
                filtered:true,
                filterDropdownVisible:deptFilterDropdownVisible,
                filterDropdown :this.filterDropdown('user_dept_name',"所属部门"),
                onFilterDropdownVisibleChange:(visible)=>this.explicitimplicitchange("user_dept_name",visible),
                filterIcon: <Icon type="search"  />,
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "tel",
                title: "电话",
                key:"tel",
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "email",
                title: "邮箱",
                key:"email",
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "use_state",
                title: "借用状态",
                key:"use_state",
                filterMultiple:true,
                filters: this.getRealRecord(newData,"use_state"),
                onFilter: (value, record) => record.use_state.indexOf(value) ===0,
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "real_begin_time",
                title: "借用时间",
                key:"real_begin_time",
                render: (text) => {
                    return (<div>{this.realData(text)}</div>);
                }
            },
            {
                dataIndex: "real_end_time",
                title: "归还时间",
                key:"real_end_time",
                render: (text) => {
                    return (<div>{this.realData(text)}</div>);
                }
            },
            {
                dataIndex: "begin_time",
                title: "预借时间",
                key:"begin_time",
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
            {
                dataIndex: "end_time",
                title: "欲还时间",
                key:"end_time",
                render: (text) => {
                    return (<div>{text}</div>);
                }
            },
        ];
        return(
            <div className = {styles.pageContainer}>
                <h2 style = {{textAlign:'center'}}>借还信息查询</h2>
                <div className = {styles.information}>
                    <span>资产名称：{urlQuery.asset_name}</span>
                    <span style = {{marginLeft:"30px"}}>资产编号：{urlQuery.asset_name}</span>
                </div>
                <div style = {{textAlign:"right"}}><Button type="primary" onClick = {this.goBack}>返回</Button></div>
                <div style = {{paddingBottom:"7px"}}>
                    <RangePicker onChange = {this.timeDate}></RangePicker>
                </div>
                <Table
                    columns = {columns}
                    className = {styles.orderTable}
                    dataSource = {this.props.detailsList}
                    loading = {this.props.loading}
                    // pagination = {{
                    //     current: this.props.Dpage,
                    //     total: this.props.Dtotal,
                    //     pageSize: this.props.DpageSize,
                    //     onChange: this.changePage
                    // }}
                >
                </Table>
            </div>
        )
    }
};
function mapStateToProps(state) {
    return {
        loading:state.loading.models.qrCodeCommon,
        ...state.qrCodeCommon
    };
};
export default connect(mapStateToProps)(AssetLendingDetail);