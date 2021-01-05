/**
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-06-10
 * 文件说明：工会慰问首页
 * */
import React, { Component } from "react";
import { Button, Tabs, Table, Select, Modal, message } from "antd";
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';

const TabPane = Tabs.TabPane;
const Option = Select.Option; 
class labor_sympathy_index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      sympathyType: "",  //申请类型
      personType: "", //
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
    this.setState({
      visible: true,
    });
  };
  //进入新建审批流程类型
  handleOk = () => {
    const { dispatch } = this.props;
    const { laobrDataList } = this.props.laobrDataList;
    let laobr_id = '';
    if (laobrDataList && laobrDataList[0]) {
      laobr_id = laobrDataList[0].labor_id
    }
    this.setState({
      visible: false,
    });
    let query = {
      sympathyType: this.state.sympathyType,
      laobr_id: laobr_id,
    }
    if (!this.state.sympathyType) {
      message.info("请选择要申请的工会慰问类型！");
      return;
    } else {
      dispatch(routerRedux.push({
        pathname: '/humanApp/laborSympathy/index/apply',
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
      sympathy_type: record.sympathy_type,
      sympathy_apply_id: record.sympathy_apply_id,
      statusFlag: '1'
    }
    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index/labor_sympathy_approval_look',
      query
    }));
  };

  // 驳回查看
  gotoIndex2 = (record) => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    let postData = record;
    postData["if_reback"] = '1';
    postData["statusFlag"] = '2';
    postData["sympathy_apply_id"] = record.sympathy_apply_id;
    postData["sympathy_type"] = record.sympathy_type;

 

    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index/labor_sympathy_apply_look',
      query: postData
    }));
  };

  // 取消按钮 
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  //创建新的审批界面，传入要建立的审批类型
  createNewApply = (value) => {
    this.setState({
      sympathyType: value,
    });
  };

  // 选择table分页，默认传参key待办 
  postOperateType = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sympathy_index_model/sympathySearchDefault',
      arg_type: key
    })
  };

  // 查看按钮跳转到申请信息查看页面，包括审批过程
  gotoIndex = (record) => {
    const { dispatch } = this.props;
    //判断是保存状态还是流程中状态,1保存状态，0提交状态
    let flag = '';
    if (record.step !== null && record.step !== '' && record.step !== undefined) {
      flag = '0';
    }
    else {
      flag = '1';
    }
    let postData = record;

    postData["statusFlag"] = flag;
    postData["sympathy_type"] = record.sympathy_type;

    //已保存但未提交的，需要进入创建页面提交
    if (flag === "1") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/laborSympathy/index/apply',
        query: postData
      }));
    }
  };

  showDeleteModel = (record) => {
    this.setState({
      visible_delete: true,
      sympathy_apply_id_delete: record.sympathy_apply_id,
    });
  };

  handleOkDelete = () => {
    const { dispatch } = this.props;
    let query = {
      sympathy_apply_id: this.state.sympathy_apply_id_delete,
      type_delete: '0',
    }
    dispatch({
      type: 'sympathy_index_model/deleteApproval',
      query
    });

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
      sympathy_apply_type: record.sympathy_apply_type,
      // 该条记录的部门
      sympathy_apply_id: record.sympathy_apply_id,
      deptName: record.dept_name,
      // 该条记录的步骤
      step: record.step,
      // 当前处理人
      currentPerson: record.user_name,
      //传递该条记录是什么类型的流程申请
      approveType: record.sympathy_apply_type,
      // 记录ID
      task_id: record.sympathy_apply_id,
      // 创建时间
      create_time: record.create_time,
      task_name: record.task_name,
      proj_id: record.proj_id,
      apply_type: record.apply_type,
      sympathy_type: record.sympathy_type
    }
    infoRecord["approvalType"] = '1';
    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index/labor_sympathy_approval',
      query: infoRecord,
    }));
  };

  columns1 = [
    { title: '处理环节', dataIndex: 'step', },
    { title: '处理人', dataIndex: 'user_name', },
    { title: '所在工会', dataIndex: 'labor_name', },
    { title: '慰问对象', dataIndex: 'sympathy_objects', },
    { title: '慰问标准', dataIndex: 'sympathy_standard', },
    { title: '申请类别', dataIndex: 'sympathy_type', },
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
    { title: '处理环节', dataIndex: 'step', },
    { title: '处理人', dataIndex: 'user_name', },
    { title: '所在工会', dataIndex: 'labor_name', },
    { title: '慰问对象', dataIndex: 'sympathy_objects', },
    { title: '慰问标准', dataIndex: 'sympathy_standard', },
    { title: '申请类别', dataIndex: 'sympathy_type', },
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
    const { tableDataList, sympathyTypeList, laobrDataList } = this.props;
    if (tableDataList && tableDataList.length) {
      tableDataList.map((i, index) => {
        i.key = index;
      })
    }
    let showCreateFlag = false;
    if (laobrDataList && laobrDataList[0]) {
      showCreateFlag = true
    }
    let sympathyTypeData = sympathyTypeList.map((item) => {
      return (
        <Option key={item.sympathy_type} value={item.sympathy_type}>
          {item.sympathy_type}
        </Option>
      )
    });
    return (
      <div>
        <br />
        <Button type="primary" onClick={this.CreateNew.bind(this)} style={{ display: showCreateFlag ? '' : 'none' }} >新建</Button>
        <br />

        <Modal
          title="选择慰问类型"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Select size="large" style={{ width: 200 }} defaultValue="选择慰问类型" onChange={this.createNewApply}>
              {sympathyTypeData}
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
    loading: state.loading.models.sympathy_index_model,
    ...state.sympathy_index_model,
  };
}
export default connect(mapStateToProps)(labor_sympathy_index)

