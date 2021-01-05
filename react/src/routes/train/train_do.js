/**
 * 文件说明：培训管理待办查询
 * 作者：shiqingpei
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import React, { Component } from 'react';
import { Button, Form, Input, Modal, Select, Table, Tabs } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class train_do extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    let ou_name = Cookie.get('OU');
    this.state = {
      visible: false,
      ou_name: ou_name,
      staff_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      //用户角色
      GeneralVisible: false,
      BranchVisible: false,
      DepartmentVisible: false,
      //创建类型标志
      trainPlanType: false,
      //删除标志
      deleteFlag: '',
      //创建标志
      interfaceFlag: '',
      visible_delete: false,
      type_delete: "",
      status_delete: "",
    }
  }

  //选择tab分页
  postOperateType = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'train_do_model/trainSearchDefault',
      arg_type: key
    });
  };


  //删除对话框
  showDeleteModel = (record) => {
    this.setState({
      visible_delete: true,
      type_delete: record.apply_type,
      task_id_delete: record.task_id,
      status_delete: record.status,
    });
    console.log(record);
  }

  //删除对应的待办信息
  handleOkDelete = () => {

    this.setState({
      visible_delete: false,
    });
  }
  handleCancelDelete = () => {
    this.setState({
      visible_delete: false,
    });
  }

  /**待办的查看 还没保存*/
  gotoIndex = (record) => {
    const { dispatch } = this.props;
    let query = {
      task_id: record.task_id,
      train_type: record.train_type
    }
    dispatch({
      type: 'train_do_model/deleteApproval',
      query,
    });

    let infoRecord = {
      proc_inst_id: record.proc_inst_id,
      proc_task_id: record.proc_task_id,
      task_id: record.task_id,
      create_person: record.create_person,
      create_person_id: record.create_person_id,
      create_person_name: record.create_person_name,
    }
    if (record.train_type === '1') {
      //总院必修岗位计划
      infoRecord.approvalType = '1';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_com',
        query: infoRecord,
      }));
    } else if (record.train_type === '2') {
      //总院选修岗位计划
      infoRecord.approvalType = '2';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_ele',
        query: infoRecord,
      }));
    } else if (record.train_type === '3') {
      //一般培训计划
      infoRecord.approvalType = '3';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '4') {
      //认证考试计划
      infoRecord.approvalType = '4';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_exam',
        query: infoRecord,
      }));
    } else if (record.task_name === '培训课程申请') {
      //培训课程申请
      console.log("record===" + record);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_apply_look',
        query: record,
      }));
    } else {
      infoRecord.approvalType = record.train_type;
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look',
        query: infoRecord,
      }));
    }
  };
  /**已办的查看 */
  gotoIndex1 = (record) => {
    console.log("record===" + record);
    let infoRecord = {
      proc_inst_id: record.proc_inst_id,
      proc_task_id: record.proc_task_id,
      task_id: record.task_id,
      create_person: record.create_person,
      create_person_id: record.create_person_id,
      create_person_name: record.create_person_name,
    }
    const { dispatch } = this.props;
    if (record.train_type === '1') {
      //总院必修岗位计划
      infoRecord.approvalType = '1';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '2') {
      //总院选修岗位计划
      infoRecord.approvalType = '2';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '3') {
      //一般培训计划
      infoRecord.approvalType = '3';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '4') {
      //认证考试计划
      infoRecord.approvalType = '4';
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look_dept',
        query: infoRecord,
      }));
    } else if (record.task_name === '培训课程申请') {
      if (record.train_apply_type === '3' || record.train_apply_type === '2' || record.train_apply_type === '1') {
        //内训-外请讲师
        if (record.is_out_of_plan === '1') {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_in_planout_look',
            query: record,
          }));
        } else {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_in_planin_look',
            query: record,
          }));
        }

      } else if (record.train_apply_type === '5') {
        //培训班已办课程查询
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_do/create_train_course_look',
          query: record,
        }));
      } else if (record.train_apply_type === '4') {
        //外训培训课程申请
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_do/train_apply_look',
          query: record,
        }));
      }
    } else if (record.task_name === '线上培训认证考试成绩录入') {
      console.log("查看");
      console.log(record);

      //培训课程申请
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_online_exam_import_look',
        query: record,
      }));
    } else {
      infoRecord.approvalType = record.train_type;
      console.log("infoRecord===" + infoRecord);
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_look',
        query: infoRecord,
      }));
    }
  };
  // 审批
  gotoApproval = (record) => {
    let infoRecord = {
      proc_inst_id: record.proc_inst_id,
      proc_task_id: record.proc_task_id,
      task_id: record.task_id,
      create_person: record.create_person,
      create_person_id: record.create_person_id,
      create_person_name: record.create_person_name,
      if_budget: record.if_budget,
    }
    const { dispatch } = this.props;
    if (record.train_type === '1') {
      //总院必修岗位计划
      infoRecord.approvalType = '1';
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_approval_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '2') {
      //总院选修岗位计划
      infoRecord.approvalType = '2';
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_approval_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '3') {
      //一般培训计划
      infoRecord.approvalType = '3';
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_approval_dept',
        query: infoRecord,
      }));
    } else if (record.train_type === '4') {
      //认证考试计划
      infoRecord.approvalType = '4';
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_approval_dept',
        query: infoRecord,
      }));
    } else if (record.task_name === '培训课程申请') {
      if (record.train_apply_type === '3' || record.train_apply_type === '2' || record.train_apply_type === '1') {
        //内训-外请讲师
        if (record.is_out_of_plan === '1') {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_in_planout_approval',
            query: record,
          }));
        } else {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_in_planin_approval',
            query: record,
          }));
        }
      } else if (record.train_apply_type === '5') {
        //培训班审批
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_do/create_train_course_approval',
          query: record,
        }));
      } else if (record.train_apply_type === '4') {
        //培训课程申请
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_do/train_apply_approval',
          query: record,
        }));
      }
    } else if (record.task_name === '线上培训认证考试成绩录入') {
      //培训课程申请
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_online_exam_import_approval',
        query: record,
      }));
    } else {
      infoRecord.approvalType = record.train_type;
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/train_plan_approval',
        query: infoRecord,
      }));
    }
  };

  /**待办列 */
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
            record.state === '0' ?   //保存未提交，可以进行查看和删除
              <span>
                <a onClick={() => this.gotoIndex(record)} >查看</a>
                <span className="ant-divider" />
                <a onClick={() => this.showDeleteModel(record)}>删除</a>
              </span>
              :
              null
          }
          {
            record.user_id === Cookie.get('userid') && record.state !== '3' && record.state !== '2' ?   //当前处理人和登录人一样，且不为驳回状态，可进行审批
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
          {
            record.state1 === '4' ?    //已经驳回了，
              <span>
                <a onClick={() => this.gotoIndex(record)}> 查看</a>
              </span>
              :
              null
          }

        </span>
      )
    },
  ];

  /**已办列 */
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
    const { tableDataList } = this.props;

    return (
      <div>
        <br></br>
        <br></br>
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



      </div>);

  }

}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_do_model,
    ...state.train_do_model
  };
}
export default connect(mapStateToProps)(train_do);

