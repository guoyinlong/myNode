 /**
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-06-28
 * 文件说明：考勤管理首页 
 * */
import React, { Component } from "react";
import { Button, Tabs, Table, Select, Modal, message } from "antd";
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';

const TabPane = Tabs.TabPane;
const Option = Select.Option; 
class attend_index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      attendType: "",  //申请类型
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
      apply_id_delete: "",
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
    this.setState({
      visible: false,
    });
    let query = { 
      attendType: this.state.attendType,
    }

    if (this.state.attendType === "proj") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/proj_apply',
        query
      }));
    }else if (this.state.attendType === "dept")
    {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/dept_apply',
        query
      }));
    }else if(this.state.attendType === "func")
    {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/func_apply',
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
    if(record.apply_type === "1")
    {
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id,
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_proj_approval_look',
        query
      }));
    }else if(record.apply_type === "4")
    { 
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id,
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
        dept_id:record.dept_id,
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_dept_approval_look',
        query
      }));
    }else if(record.apply_type === "5")
    { 
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id,
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
        dept_id:record.dept_id,
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_func_approval_look',
        query
      }));
    } 
  };
  // 驳回查看
  gotoIndex2 = (record) => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    if(record.apply_type === "1")
    {
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id,
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
        if_reback:'1',
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_proj_approval_look',
        query
      }));
    }else if(record.apply_type === "4")
    { 
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id,
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
        dept_id:record.dept_id,
        if_reback:'1',
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_dept_approval_look',
        query
      }));
    }else if(record.apply_type === "5")
    { 
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id,
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
        dept_id:record.dept_id,
        if_reback:'1',
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_func_approval_look',
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
  //创建新的审批界面，传入要建立的审批类型
  createNewApply = (value) => {
    this.setState({
      attendType: value,
    });
  };
  // 选择table分页，默认传参key待办 
  postOperateType = (key) => {
    const { dispatch } = this.props;
    dispatch({ 
      type: 'attend_index_model/attendSearchDefault',
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
      visible_delete:true,
      type_delete:record.apply_type,
      task_id_delete:record.task_id,
      status_delete:record.status,
    });
  };
  handleOkDelete = () =>{
    if(this.state.status_delete !== '0'){
      message.error("正在流转中加班审批不可删除！");
    }else if(this.state.status_delete === '0') {
      const {dispatch} = this.props;
        let query = {
          //传递删除什么类型的流程申请
          apply_id: this.state.task_id_delete,
          type_delete : this.state.type_delete
        }
        dispatch({
          type: 'overtime_index_model/deleteInfo',
          query
        });
    }
    this.setState({
      visible_delete:false,
    });
  }
  handleCancelDelete = () => {
    this.setState({
      visible_delete: false,
    });
  };
  //待办审批
  gotoApproval = (record) => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
  
    if(record.apply_type === "1")
    {
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id, 
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id, 
        absenceMonth:record.cycle_code,
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_proj_approval',
        query
      }));
    }else if(record.apply_type === "4")
    { 
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id, 
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id,
        absenceMonth:record.cycle_code,
        dept_id:record.dept_id,
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_dept_approval',
        query
      }));
    }else if(record.apply_type === "5")
    { 
      let query = {
        apply_type: record.apply_type,
        apply_id: record.task_id, 
        statusFlag: '1',
        proc_inst_id:record.proc_inst_id,
        proc_task_id:record.proc_task_id, 
        absenceMonth:record.cycle_code,
        dept_id:record.dept_id,
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index/attend_func_approval',
        query
      }));
    }
  };
  columns1 = [
    { title: '考勤月份', dataIndex: 'cycle_code' },
    { title: '审批流程名称', dataIndex: 'task_name' },
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
    { title: '考勤月份', dataIndex: 'cycle_code' },
    { title: '审批流程名称', dataIndex: 'task_name' },
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
    const { tableDataList, infoSearch } = this.props;
    
    if(tableDataList && tableDataList.length){
      tableDataList.map((i,index)=>{
        i.key=index;
      })    
    }
    if(infoSearch && infoSearch.length){
      infoSearch.map((i,index)=>{
        i.key=index;
      })
    }
    //判断是否是接口人，只有接口人显示“新建”选项
    let userRoleList = this.props.userRoleList;
    let createAuth = false;
    userRoleList.map((item) => {
      if(item.post_id === '9ca4d30fb3b311e6b01d02429ca3c6ff' || item.post_id === '9ca4d30fb3b311e6a01d02428ca3c6ff')
      {
        createAuth = true;
      }
    })
    if(createAuth === true){
      this.state.deleteFlag = "";
      this.state.interfaceFlag = "";
    }

    return ( 
      <div>
        <br />
        <Button type="primary" onClick={this.CreateNew.bind(this)} style={{display:this.state.interfaceFlag}}>新建</Button>
        <br />

        <Modal
          title="选择考勤申请类型"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Select size="large" style={{ width: 200 }} defaultValue="选择考勤申请类型" onChange={this.createNewApply}>
              <Option value="proj">项目组考勤统计</Option>
              <Option value="dept">业务部门考勤统计</Option>
              <Option value="func">职能部门考勤统计</Option>
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
    loading: state.loading.models.attend_index_model,
    ...state.attend_index_model,
  };
}
export default connect(mapStateToProps)(attend_index)

