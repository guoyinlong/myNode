/**
 *  作者: 王福江
 *  创建日期: 2019-09-26
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现员工加班查看
 */

import React ,{ Component }from "react";
import {Button, Tabs, Table, Select, Pagination} from "antd";
import {routerRedux} from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from "../labor/contract/basicInfo.less";

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class overtime_search extends Component{
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      dept:Cookie.get('dept_id'),
      flow_type:'',
      flow_state:'1'
    }
  }

  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };
  handleTypeChange = (value) => {
    this.setState ({
      flow_type: value
    })
  };
  handleStateChange = (value) => {
    this.setState ({
      flow_state: value
    })
  };

  //查询
  search = () => {
    let arg_params = {};
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    arg_params["arg_dept_id"] = this.state.dept;
    arg_params["arg_flow_type"] = this.state.flow_type;
    arg_params["arg_flow_state"] = this.state.flow_state;
    const {dispatch} = this.props;
    dispatch({
      type: 'overtime_index_model/overtimeFlowSearch',
      arg_param: arg_params
    });
  }
  //处理分页
  handlePageChange = (page) => {
    let arg_params = {};
    arg_params["arg_page_size"] = 20;
    arg_params["arg_page_current"] = page;
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    arg_params["arg_dept_id"] = this.state.dept;
    arg_params["arg_flow_type"] = this.state.flow_type;
    arg_params["arg_flow_state"] = this.state.flow_state;
    const {dispatch} = this.props;
    dispatch({
      type: 'overtime_index_model/overtimeFlowSearch',
      arg_param: arg_params
    });
  }

  //查看按钮跳转到申请信息查看页面，包括审批过程
  gotoIndex = (record) =>{
    const {dispatch}=this.props;
    //判断是保存状态还是流程中状态,1保存状态，0提交状态
    let flag = '0';
    let saveViewControl = 'block';
    let query={
      saveView: flag,
      //该条记录的部门
      deptName:record.deptname,
      step:record.next_name,
      //当前处理人
      currentPerson:record.next_person,
      //传递该条记录是什么类型的加班流程申请
      approvType: record.task_name,
      //该条记录的ID
      task_id:record.task_id,
      //该条记录的节假日
      holiday_name:record.holiday_name,
      //该条记录创建时间
      create_time:record.create_time,
      task_name:record.task_name,
      saveViewControl: saveViewControl,
      proj_id: record.proj_id,
      apply_type: record.apply_type,
      return_type:'2'
    }
    console.log("query==="+JSON.stringify(query));
    //项目组加班申请:保存状态的查看，已提交待办。未提交
    if(record.task_name === "项目组加班申请") {
        query["applyTypeForPerson"] = '1';
        query["approvalType"] = '1';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
          query: query
        }));
    }
    else if(record.task_name === "部门加班申请"){
      //提交状态的职能线加班申请，有了新的task_id
      if((flag === "0") && (record.task_id !== null && record.task_id !== '' && record.task_id !== undefined) && (record.apply_type === '5')) {
        //该条记录的申请类型，5：职能线加班申请；6：职能线加班统计
        query["circulationType"] = "职能线加班申请";
        query["applyTypeForPerson"] = '1';
        query["approvalType"] = '2';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
          query: query
        }));
      }
      //其他情况，部门加班申请
      else {
        query["applyType"] = '1';
        query["approvalType"] = '2';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showApprovalDetails',
          query: query
        }));
      }
    }
    else if (record.task_name === "项目组加班统计") {
        query["applyTypeForPerson"] = '2';
        query["approvalType"] = '3';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
          query: query
        }));
    }
    else if(record.task_name === "部门加班统计") {
      if((flag === "0") && (record.task_id !== null && record.task_id !== '' && record.task_id !== undefined) && (record.apply_type === '6')) {
        //该条记录的申请类型，5：职能线加班申请；6：职能线加班统计
        query["circulationType"] = "职能线加班申请";
        query["applyTypeForPerson"] = '2';
        query["approvalType"] = '4';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
          query: query
        }));
      }
      //其他情况，部门加班统计
      else {
        query["applyType"] = '2';
        query["approvalType"] = '4';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showApprovalDetails',
          query: query
        }));
      }
    }
  }

  columns = [
    { title: '节假日', dataIndex: 'holiday_name' },
    { title: '审批流程名称', dataIndex: 'task_name' },
    { title: '申请部门', dataIndex: 'deptname', },
    { title: '申请人', dataIndex: 'username', },
    { title: '创建日期', dataIndex: 'create_time', },
    { title: '下一环节', dataIndex: 'next_name', },
    { title: '下一环节处理人', dataIndex: 'next_person', },
    { title: '审批状态', dataIndex: 'task_type', },
    { title: '操作', dataIndex: '', key: 'x', render: (text,record) => (
        <a onClick = {()=>this.gotoIndex(record)}>查看</a>)},
  ];

  render(){
    const{loading, tableDataList , deptList ,if_human} = this.props;
    const deptOptionList = deptList.map((item) => {
      return (
        <Option key={item.deptid}>
          {item.deptname}
        </Option>
      )
    });
    const auth_ou = Cookie.get('OU');
    const auth_dept = Cookie.get('dept_name');

    console.log("if_human==="+if_human);

    return (
      <div className={styles.meetWrap}>
        <div className={styles.headerName} style={{marginBottom:'15px'}}>{'加班流程查询'}</div>
        <div style={{marginBottom:'15px'}}>
          <span>组织单元：</span>
          <Select style={{width: 160}} defaultValue={auth_ou} disabled={true}>

          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：
          <Select style={{width: 200}}  onSelect={this.handleDeptChange} defaultValue={auth_dept} disabled={if_human}>
            <Option key=' '>全部</Option>
            {deptOptionList}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加班类型
          <Select style={{width: 200}}  onSelect={this.handleTypeChange} defaultValue='全部'>
            <Option key='全部'>全部</Option>
            <Option key='项目组加班申请'>项目组加班申请</Option>
            <Option key='部门加班申请'>部门加班申请</Option>
            <Option key='项目组加班统计'>项目组加班统计</Option>
            <Option key='部门加班统计'>部门加班统计</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审批状态
          <Select style={{width: 200}}  onSelect={this.handleStateChange} defaultValue='审批中'>
            <Option key=' '>全部</Option>
            <Option key='1'>审批中</Option>
            <Option key='2'>审批完成</Option>
            <Option key='3'>审批驳回</Option>
          </Select>

          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Table
          columns={this.columns}
          dataSource={tableDataList}
          pagination={false}
          loading={loading}
          bordered={true}
        />

        {/*加载完才显示页码*/}
        {loading !== true ?
          <Pagination current={this.props.currentPage}
                      total={Number(this.props.total)}
                      showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                      pageSize={20}
                      onChange={this.handlePageChange}
          />
          :
          null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.overtime_index_model,
    ...state.overtime_index_model,
  };
}
export default connect(mapStateToProps)(overtime_search)
