/**
 *  作者: shiqp
 *  创建日期: 2019-04-14
 *  邮箱：shiqp3@chinaunicom.cn
 *  文件说明：查看已办和待办
 */

import React, { Component } from "react";
import { Button, Tabs, Table, Modal, message } from "antd";
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
const TabPane = Tabs.TabPane;

class staffleave_index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      circulationType: "",
      ApprovFlag: "",
      //审批人只能在自己审核的步骤进行查看，其他环节不可查看
      checkFlag: true,
      approvType: "",
      interfaceFlag: "none",
      deleteFlag: "none",
      showNoFlag: "none",
      showYesFlag: " ",
      visible_delete: false,
      type_delete: "",
      status_delete: "",
    }
  }

  //新建加班，对话框显示新建审批流程类型
  CreateNew = () => {
    this.setState({
      visible: true,
    });
  }

  //进入新建审批流程类型
  handleOk = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    let query = {
      circulationType: this.state.circulationType
    }
    if (this.state.circulationType === "项目组加班申请" || this.state.circulationType === "项目组加班统计") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/createTeamApproval',
        query
      }));
    } else if (this.state.circulationType === "部门加班申请" || this.state.circulationType === "部门加班统计") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/createDeptApproval',
        query
      }));
    } else if (this.state.circulationType === "职能线加班申请" || this.state.circulationType === "职能线加班统计") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/createFunctionalDeptApproval',
        query
      }));
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  //创建新的审批界面，传入要建立的审批类型
  createNewApply = (value) => {
    this.setState({
      circulationType: value,
    });
  }

  //选择tab分页
  postOperateType = (key) => {
    // 换成查询离职的待办和已办！！！！！！
    const { dispatch } = this.props;
    dispatch({
      type: 'staff_leave_index_model/staffLeaveSearchDefault',
      arg_type: key
    });
  };


  //查看按钮跳转到申请信息查看页面，包括审批过程
  gotoIndex = (record) => {
    //根据当前人所在分院跳到不同的页面中去
    let query = record;
    //根据不同的申请类型，跳到不同的界面
    if (record.apply_type === '1') {
      //离职申请
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/CheckLeave',
        query: query
      }));

    } else if (record.apply_type === '2') {
      //工作交接申请
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/CheckworkHandover',
        query: query
      }));
    } else if (record.apply_type === '3') {
      //离职结算 
      if (record.status === '0') {
        /**不会存在离职结算的未保存待办！！！！ */
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
          pathname: '/humanApp/labor/index/CheckleaveSettle',
          query: query
        }));
      } else {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
          pathname: '/humanApp/labor/index/CheckleaveSettle',
          query: query
        }));
      }
    } else if (record.apply_type === '4') { //劳动合同驳回阅后即焚
      const { dispatch } = this.props;
      if (record.status === '3') {
        console.log("*******************");
        console.log(query);
        console.log("*******************");
        const { dispatch } = this.props;
        dispatch({
          type: 'staff_leave_index_model/deleteContractApproval',
          query,
        });
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/staffLeave_index/contract_approval_look',
        query: query
      }))
    }
  }

  /**已办的查看 */
  gotoIndex1 = (record) => {
    //根据当前人所在分院跳到不同的页面中去
    let query = record;
    //根据不同的申请类型，跳到不同的界面
    if (record.apply_type === '1') {
      //离职申请
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/LeavePrint',
        query: query
      }));

    } else if (record.apply_type === '2') {
      //工作交接申请
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/HandOverPrint',
        query: query
      }));
    } else if (record.apply_type === '3') {
      //离职结算 
      if (record.status === '0') {
        /**不会存在离职结算的未保存待办！！！！ */
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
          pathname: '/humanApp/labor/index/CheckleaveSettle',
          query: query
        }));
      } else {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
          pathname: '/humanApp/labor/index/CheckleaveSettle',
          query: query
        }));
      }
    } else if (record.apply_type === '4') {
      // 劳动合同查看
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/staffLeave_index/contractApproveInform',
        query: query
      }));
    }


  }

  //审批按钮跳转到申请流程审批页面
  //项目组、部门加班审批分为不同的界面进行
  gotoApproval = (record) => {
    const { dispatch } = this.props;
    let infoRecord = {
      proc_inst_id: record.proc_inst_id,
      proc_task_id: record.proc_task_id,
      task_id: record.task_id,
      arg_quit_settle_id: record.task_id,
      arg_dept_id: record.dept_id,
      deptName: record.deptname,
      step: record.step,
      user_name: record.user_name,
      create_time: record.create_time,
      task_name: record.task_name,
      holiday_name: record.holiday_name,
      create_person_name: record.create_person_name,
      create_name: record.create_person_name,
      core_post: record.core_post,
      position_title: record.position_title,
      leave_time: record.leave_time,
      create_proj: record.create_proj,
      create_person: record.create_person,
    }

    //离职申请
    if (record.apply_type === "1") {
      infoRecord["applyTypeForPerson"] = '1';
      infoRecord["approvalType"] = '1';
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/leaveApplyApproval',
        query: infoRecord,
      }));
      //离职交接
    } else if (record.apply_type === "2") {
      infoRecord["applyTypeForPerson"] = '1';
      infoRecord["approvalType"] = '2';
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/leaveHandApproval',
        query: infoRecord,
      }));
      //离职清算 TODO  
    } else if (record.apply_type === "3") {
      infoRecord["applyTypeForPerson"] = '1';
      infoRecord["approvalType"] = '3';
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index/quit_settle_approval',
        query: infoRecord
      }));
      //合同续签 TODO
    } else if (record.apply_type === "4") {
      infoRecord["applyTypeForPerson"] = '1';
      infoRecord["approvalType"] = '4';
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/staffLeave_index/contractRenewApproval',
        query: infoRecord
      }));
    }
  }


  //删除对话框
  showDeleteModel = (record) => {
    this.setState({
      visible_delete: true,
      type_delete: record.apply_type,
      task_id_delete: record.task_id,
      status_delete: record.status,
    });
  }

  //删除对应的待办信息
  handleOkDelete = () => {

    if (this.state.status_delete !== '0') {
      message.error("正在流转中的审批不可删除！");
    } else if (this.state.status_delete === '0') {
      const { dispatch } = this.props;
      let query = {
        //传递删除什么类型的加班流程申请
        arg_apply_id: this.state.task_id_delete,
        arg_type: this.state.type_delete,
        arg_status: this.state.status_delete,
        arg_state: '9'
      }
      dispatch({
        type: 'staff_leave_index_model/leaveInfoDelete',
        query
      });
    }
    this.setState({
      visible_delete: false,
    });
  }
  handleCancelDelete = () => {
    this.setState({
      visible_delete: false,
    });
  }

  columns1 = [
    { title: '审批流程名称', dataIndex: 'task_name' },
    { title: '处理环节', dataIndex: 'step', },
    { title: '处理人', dataIndex: 'user_name', },
    { title: '申请部门', dataIndex: 'deptname', },
    { title: '申请人', dataIndex: 'create_person_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (

        <span>
          {
            record.status === '0' ?   //保存未提交，可以进行查看和删除
              <span>
                <a onClick={() => this.gotoIndex(record)} >查看</a>
                <span className="ant-divider" />
                <a onClick={() => this.showDeleteModel(record)}>删除</a>
              </span>
              :
              null
          }
          {
            record.user_id === Cookie.get('userid') && record.status !== '3' && record.status !== '2' ?   //当前处理人和登录人一样，且不为驳回状态，可进行审批
              <span>
                <a onClick={() => this.gotoApproval(record)}> 审批</a>
              </span>
              :
              null
          }
          {
            record.status === '3' ?    //已经驳回了，
              <span>
                <a onClick={() => this.gotoIndex(record)}> 查看</a>
              </span>
              :
              null
          }
          {/* {
          record.step ?
            null
            :
            <span>
              <a onClick={()=>this.showDeleteModel(record)}>删除</a>
            </span>
        } */}
        </span>
      )
    },
  ];

  columns2 = [
    { title: '审批流程名称', dataIndex: 'task_name' },
    { title: '处理环节', dataIndex: 'step', },
    { title: '处理人', dataIndex: 'user_name', },
    { title: '申请部门', dataIndex: 'deptname', },
    { title: '申请人', dataIndex: 'create_person_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record, index) => (
        <a onClick={() => this.gotoIndex1(record)}>查看</a>)
    },
  ];



  render() {
    const { tableDataList, infoSearch } = this.props;


    if (tableDataList && tableDataList.length) {
      tableDataList.map((i, index) => {
        i.key = index;
      })
    }
    if (infoSearch && infoSearch.length) {
      infoSearch.map((i, index) => {
        i.key = index;
      })
    }

    // //判断是否是接口人，只有接口人显示“新建”选项
    // let userRoleList = this.props.userRoleList;
    // let createAuth = false;
    // userRoleList.map((item) => {
    //   if(item.post_id === '9ca4d30fb3b311e6b01d02429ca3c6ff' || item.post_id === '9ca4d30fb3b311e6a01d02428ca3c6ff')
    //   {
    //     createAuth = true;
    //   }
    // })
    // if(createAuth === true){
    //   this.state.deleteFlag = "";
    //   this.state.interfaceFlag = "";
    // }


    return (
      <div>
        <br />
        <Button type="primary" onClick={this.CreateNew.bind(this)} style={{ display: this.state.interfaceFlag }} >新建</Button>
        <br /><br />


        {/* <Modal
          title="选择新建审批流程类型"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
              <Select size="large" style={{width: 200}} defaultValue="请选择审批流类型"  onChange={this.createNewApply}>
              <Option value="项目组加班申请">项目组加班申请</Option>
              <Option value="部门加班申请">业务部门加班申请</Option>
                <Option value="职能线加班申请">职能部门加班申请</Option>
                <Option value="项目组加班统计">项目组加班统计</Option>
              <Option value="部门加班统计">业务部门加班统计</Option>
              <Option value="职能线加班统计">职能部门加班统计</Option>
            </Select>
          </div>
        </Modal>
         */}

        <Tabs defaultActiveKey="1" onChange={this.postOperateType}>
          <TabPane tab="待办审批" key="1">
            <Table
              columns={this.columns1}
              dataSource={tableDataList}
              pagination={true}
            />

          </TabPane>
          <TabPane tab="已办审批" key="2">
            <Table
              columns={this.columns2}
              dataSource={tableDataList}
              pagination={true}
            />
          </TabPane>
        </Tabs>

        {/*删除Model*/}
        <Modal
          title="删除"
          visible={this.state.visible_delete}
          onOk={this.handleOkDelete}
          onCancel={this.handleCancelDelete}
        >
          <p>请确认删除保存的申请！</p>
        </Modal>

      </div>
    )
  }
}

// function mapStateToProps(state) {
//   return {
//     loading: state.loading.models.overtime_index_model,
//     ...state.overtime_index_model,
//   };
// }
// export default connect(mapStateToProps)(overtime_index)


/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * @param state 状态树
 */
function mapStateToProps(state) {
  // const { info,template} = state.index;
  // return {
  //   info,
  //   template,
  //   loading: state.loading.models.index,
  // };


  return {
    loading: state.loading.models.staff_leave_index_model,
    ...state.staff_leave_index_model
  };
}
export default connect(mapStateToProps)(staffleave_index)
