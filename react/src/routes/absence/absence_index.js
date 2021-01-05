/**
 *  作者: 郭西杰
 *  创建日期: 2020-04-20
 *  邮箱：guoxj116@chinaunicom.cn
 *  文件说明：实现员工请假申请功能 
 */
import React, { Component } from "react";
import { Button, Tabs, Table, Select, Modal, message, Divider } from "antd";
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
class absence_index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible_vice: false,
      circulationType: "",  //请假申请类型
      personType: "", //申请请假人类型
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
    };
  };

  //新建请假类型，对话框显示新建审批流程类型
  CreateNew = () => {
    let user_role_list = this.props.userRoleData
    const user_role = (user_role_list == null || user_role_list =='' || user_role_list == undefined)?'':user_role_list.absence_role; 
    if (user_role === 'vice_leader')
    {
      this.setState({
        visible_vice: true,
      });
    }
    else{
      this.setState({
        visible: true,
      });
    }
  };
  //进入新建审批流程类型
  handleOk = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    let query = {
      circulationType: this.state.circulationType,
    }
    if (this.state.circulationType === "调休申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/create_break_off',
        query
      }));
    } else if (this.state.circulationType === "事假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/create_affair_absence',
        query
      }));
    } else if (this.state.circulationType === "年假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/create_year_absence',
        query
      }));
    }
  };
  handleOk_vice = () => {
    const { dispatch } = this.props;
    this.setState({
      visible_vice: false,
    });
    let query = {
      circulationType: this.state.circulationType,
    }
    if (this.state.circulationType === "事假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/create_affair_absence',
        query
      }));
    } else if (this.state.circulationType === "年假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/create_year_absence',
        query
      }));
    }
  };
 
  // 进入已办查案页面
  gotoIndex1 = (record) => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    let query = {
      absence_apply_id: record.absence_apply_id,
      absence_apply_type: record.absence_apply_type,    
      editAble: false
    }
    if (record.absence_apply_type === "调休申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/absence_approve_look',
        query
      }));
    } else if (record.absence_apply_type === "事假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/affair_approval_look',
        query
      }));
    }
    else if (record.absence_apply_type === "年假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/year_approval_look',
        query
      }));
    }
  };

  gotoIndex2 = (record) => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    let query = {
      if_reback: '1',
      absence_apply_id: record.absence_apply_id,
      absence_apply_type: record.absence_apply_type,
    }
    if (record.absence_apply_type === "调休申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/absence_approve_look',
        query
      }));
    } else if (record.absence_apply_type === "事假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/affair_approval_look',
        query
      }));
    } else if (record.absence_apply_type === "年假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/year_approval_look',
        query
      }));
    }

  };

  // 取消按钮 
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleCancel_vice = () => {
    this.setState({
      visible_vice: false,
    });
  };


  //创建新的审批界面，传入要建立的审批类型
  createNewApply = (value) => {
    this.setState({
      circulationType: value,
    });
  };

  // 选择table分页，默认传参key待办 
  postOperateType = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absence_index_model/absenceSearchDefault',
      arg_type: key
    })
  };

  // 查看按钮跳转到申请信息查看页面，包括审批过程
  gotoIndex = (record) => {
    const { dispatch } = this.props;
    //判断是保存状态还是流程中状态,1保存状态，0提交状态
    let flag = null;
    let saveViewControl = 'block';
    if (record.step !== null && record.step !== '' && record.step !== undefined) {
      flag = '0';
    }
    else {
      flag = '1';
      saveViewControl = 'none';
    }
    let query = {
      saveView: flag,
      // 该条记录的部门
      absence_apply_id: record.absence_apply_id,
      deptName: record.dept_name,
      // 该条记录的步骤
      step: record.step,
      // 当前处理人
      currentPerson: record.user_name,
      //传递该条记录是什么类型的请假流程申请
      approveType: record.absence_apply_type,
      // 记录ID
      task_id: record.task_id,
      // 创建时间
      create_time: record.create_time,
      task_name: record.task_name,
      saveViewControl: saveViewControl,
      proj_id: record.proj_id,
      apply_type: record.apply_type
    }
    if (record.absence_apply_type === "调休申请") {
      //已保存但未提交的，需要进入创建页面提交
      if (flag === "1") {
        query["circulationType1"] = "调休申请";
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex/create_break_off',
          query: query
        }));
      }
      //提交状态，会产生新的task_id
      else if ((flag === "0") && (record.task_id !== null) && (record.task_id !== '') && (record.task_id !== undefined)) {
        query["approvalType1"] = '1';
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex',
          query: query
        }));
      }
    }
    else if (record.absence_apply_type === "事假申请") {
      //已保存但未提交的，需要进入创建页面提交
      if (flag === "1") {
        query["circulationType1"] = "事假申请";
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex/create_affair_absence',
          query: query
        }));
      }
      //提交状态，会产生新的task_id
      else if ((flag === "0") && (record.task_id !== null) && (record.task_id !== '') && (record.task_id !== undefined)) {
        query["approvalType1"] = '2';
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex',
          query: query
        }));
      }
    }
    else if (record.absence_apply_type === "年假申请") {
      //已保存但未提交的，需要进入创建页面提交
      if (flag === "1") {
        query["circulationType1"] = "年假申请";
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex/create_year_absence',
          query: query
        }));
      }
      //提交状态，会产生新的task_id
      else if ((flag === "0") && (record.task_id !== null) && (record.task_id !== '') && (record.task_id !== undefined)) {
        query["approvalType1"] = '3';
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex',
          query: query
        }));
      }
    }
    else if (record.task_name === "常设机构负责人调休") {
      //已保存但未提交的，需要进入创建页面提交
      if (flag === "1") {
        query["approvalType1"] = "常设机构负责人调休";
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex/create_break_off',
          query: query
        }));
      }
      //提交状态，会产生新的task_id
      else if ((flag === "0") && (record.task_id !== null) && (record.task_id !== '') && (record.task_id !== undefined)) {
        query["approvalType"] = '4';
        dispatch(routerRedux.push({
          pathname: '/humanApp/absence/absenceIndex',
          query: query
        }));
      }
    }
  };

  //撤销未进行审批的请假申请
  goRevoke = (record) => {
    const { dispatch } = this.props;
    let apply_type = '';
    if (record.task_name === '团队中的员工调休') {
      apply_type = '1';
    }
    else if (record.task_name === '非团队中的员工调休') {
      apply_type = '2';
    }
    else if (record.task_name === '团队负责人调休') {
      apply_type = '3';
    }
    else if (record.task_name === '常设机构负责人调休') {
      apply_type = '4';
    }

    //判断是审批中状态还是未提交状态,0未状态，1审批状态,
    let query = {}
    query["arg_apply_id"] = record.task_id;
    query["arg_apply_type"] = apply_type;
    return new Promise((resolve) => {
      dispatch({
        type: 'absence_index_model/teamApplyStatesQuery',
        query,
        resolve
      });
    }).then((resolve) => {
      if (resolve === '0') {
        return new Promise((resolve) => {
          dispatch({
            type: 'absence_index_model/teamApplyRevokeOperation',
            query,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            message.success('撤销成功！');
            location.reload();
          }
          else if (resolve === 'false') {
            message.error('撤销失败,检查参数！');
            return;
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index'
          }));
        });
      } else if (resolve === '1') {
        message.error("审批中的申请不可撤销！");
        return;
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  };

  showDeleteModel = (record) => {
    this.setState({
      visible_delete: true,
      type_delete: record.apply_type,
      task_id_delete: record.absence_apply_id,
      status_delete: record.status,
    });
  };

  handleOkDelete = () => {

    if (this.state.status_delete !== '0') {
      message.error("正在流转中请假审批不可删除！");
    } else if (this.state.status_delete === '0') {
      const { dispatch } = this.props;
      let query = {
        //传递删除什么类型的加班流程申请
        absence_apply_id: this.state.task_id_delete,
        type_delete: '0'
      }
      dispatch({
        type: 'absence_index_model/deleteApproval',
        query
      });
    }
    this.setState({
      visible_delete: false,
    });
  };

  handleCancelDelete = () => {
    this.setState({
      visible_delete: false,
    });
  };

  //待办审批
  gotoApproval = (record) => {
    const { dispatch } = this.props;
    let infoRecord = {
      proc_inst_id: record.proc_inst_id,
      proc_task_id: record.proc_task_id,
      absence_apply_type: record.absence_apply_type,
      // 该条记录的部门
      absence_apply_id: record.absence_apply_id,
      deptName: record.dept_name,
      // 该条记录的步骤
      step: record.step,
      // 当前处理人
      currentPerson: record.user_name,
      //传递该条记录是什么类型的请假流程申请
      approveType: record.absence_apply_type,
      // 记录ID
      task_id: record.absence_apply_id,
      // 创建时间
      create_time: record.create_time,
      task_name: record.task_name,
      proj_id: record.proj_id,
      apply_type: record.apply_type
    }

    if (record.absence_apply_type === "调休申请") {
      infoRecord["approvalType"] = '1';
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/absence_approval',
        query: infoRecord,
      }));
    } else if (record.absence_apply_type === "年假申请") {
      infoRecord["approvalType"] = '2';
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/year_approval',
        query: infoRecord,
      }));
    } else if (record.absence_apply_type === "事假申请") {
      infoRecord["approvalType"] = '3';
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/affair_approval',
        query: infoRecord,
      }));
    }
  };

  columns1 = [
    { title: '审批流程名称', dataIndex: 'absence_apply_type' },
    { title: '处理环节', dataIndex: 'step', },
    { title: '处理人', dataIndex: 'user_name', },
    { title: '申请部门', dataIndex: 'dept_name', },
    { title: '申请人', dataIndex: 'create_person_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        <span>
          {
            record.status === '0' ?
              <span>
                <a onClick={() => this.gotoIndex(record)} >查看</a>
                <span className="ant-divider" />
              </span>
              :
              null
          }
          {
            record.user_id === Cookie.get('userid') && record.state !== '4' ?
              <span>
                <a onClick={() => this.gotoApproval(record)}> 审批</a>
              </span>
              :
              null
          }
          {
            record.status === '3' ?
              <span>
                <a onClick={() => this.gotoIndex2(record)}> 查看</a>
              </span>
              :
              null
          }
          {
            record.step ?
              null
              :
              <span>
                <a onClick={() => this.showDeleteModel(record)}>删除</a>
              </span>
          }
        </span>
      )
    },
  ];

  columns2 = [
    { title: '审批流程名称', dataIndex: 'absence_apply_type' },
    { title: '处理环节', dataIndex: 'step', },
    { title: '处理人', dataIndex: 'user_name', },
    { title: '申请部门', dataIndex: 'dept_name', },
    { title: '申请人', dataIndex: 'create_person_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record, index) => (
        <span>
          <a onClick={() => this.gotoIndex1(record)}>查看</a>
        </span>
      )
    },
  ];

   
  render() {  

    const { tableDataList, infoSearch} = this.props;
    let user_role_list = this.props.userRoleData
    const user_role = (user_role_list == null || user_role_list =='' || user_role_list == undefined)?'':user_role_list.absence_role; 

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

    return ( 
      <div>
        <br />
        <div style={{display: user_role == 'leader' ? "none" : ""}} >
        &nbsp;&nbsp;<Button type="primary" onClick={this.CreateNew.bind(this)} >新建</Button>
        </div>
        <br />
        <Modal
          title="选择请假类型"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Select size="large" style={{ width: 200 }} defaultValue="选择请假类型" onChange={this.createNewApply}>
              <Option value="调休申请">调休申请</Option>
              <Option value="事假申请">事假申请</Option>
              <Option value="年假申请">年假申请</Option>
            </Select>
          </div>
        </Modal>

        <Modal
          title="选择请假类型"
          visible={this.state.visible_vice}
          onOk={this.handleOk_vice}
          onCancel={this.handleCancel_vice}
        >
          <div>
            <Select size="large" style={{ width: 200 }} defaultValue="选择请假类型" onChange={this.createNewApply}>
              <Option value="事假申请">事假申请</Option>
              <Option value="年假申请">年假申请</Option>
            </Select>
          </div>
        </Modal>

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
          onCancel={this.handleCancelDelete} >
          <p>请确认删除保存的申请！</p>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.absence_index_model,
    ...state.absence_index_model,
  };
}
export default connect(mapStateToProps)(absence_index)

