/**
 *  作者: 翟金亭
 *  创建日期: 2019-04-14
 *  邮箱：zhaijt3@chinaunicom.cn
 *  文件说明：实现员工加班申请功能
 */

import React ,{ Component }from "react";
import {Button, Tabs, Table, Select, Modal, message, Divider} from "antd";
import {routerRedux} from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
/**
 * 作者：翟金亭
 * 创建日期：2019-04-14
 * 功能：实现员工加班审批信息页面的流转中审批记录/已完成审批记录两个tab页
 */
class overtime_index extends Component{
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      circulationType:"",
      ApprovFlag:"",
      //审批人只能在自己审核的步骤进行查看，其他环节不可查看
      checkFlag:true,
      approvType:"",
      interfaceFlag :"none",
      deleteFlag:"none",
      showNoFlag:"none",
      showYesFlag:" ",
      visible_delete:false,
      type_delete:"",
      status_delete:"",
    }
  }

  //新建加班，对话框显示新建审批流程类型
  CreateNew = () =>{
    this.setState({
      visible: true,
    });
  }

  //进入新建审批流程类型
  handleOk = () => {
    const {dispatch}=this.props;
    this.setState({
      visible: false,
    });
    let query={
      circulationType: this.state.circulationType
    }
    if(this.state.circulationType==="项目组加班申请" || this.state.circulationType==="项目组加班统计") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/createTeamApproval',
        query
      }));
    }else if(this.state.circulationType === "部门加班申请" || this.state.circulationType==="部门加班统计"){
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/createDeptApproval',
        query
      }));
    }else if(this.state.circulationType === "职能线加班申请" || this.state.circulationType === "职能线加班统计"){
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
  createNewApply = (value) =>{
    this.setState({
      circulationType: value,
    });
  }

  //选择tab分页
  postOperateType = (key) =>{
    const{dispatch} = this.props;
        dispatch({
          type:'overtime_index_model/overtimeSearchDefault',
          arg_type : key
        });
  };


  //查看按钮跳转到申请信息查看页面，包括审批过程
  gotoIndex = (record) =>{
    const {dispatch}=this.props;
    //判断是保存状态还是流程中状态,1保存状态，0提交状态
	let flag = null;
	let saveViewControl = 'block';
	if(record.step !== null && record.step !== '' && record.step !== undefined)
    {
      flag = '0';
    }
    else
    {
      flag = '1';
      saveViewControl = 'none';
    }
    let query={
      saveView: flag,
      //该条记录的部门
      deptName:record.deptname,
      //该条记录的部门
      step:record.step,
      //当前处理人
      currentPerson:record.user_name,
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
      apply_type: record.apply_type
    }
    //console.log("删除待办======")
     //删除待办
     if(record.state === '4') {
       dispatch({
         type:'overtime_index_model/deleteApproval',
         query,
       });
     }

    //项目组加班申请:保存状态的查看，已提交待办。未提交
    if(record.task_name === "项目组加班申请") {
      //已保存但未提交的，需要进入创建页面提交
      if (flag === "1") {
        query["circulationType"] = "项目组加班申请";
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/createTeamApproval',
          query: query
        }));
      }
      //提交状态，会产生新的task_id
      else if((flag === "0") && (record.task_id !== null) && (record.task_id !== '') && (record.task_id !== undefined)) {
        query["applyTypeForPerson"] = '1';
        query["approvalType"] = '1';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
          query: query
        }));
      }
    }
    else if(record.task_name === "部门加班申请"){
      //保存状态的职能线加班申请，进入创建界面
      if (flag === "1" && record.apply_type === '5') {
        query["circulationType"] = "职能线加班申请";
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/createFunctionalDeptApproval',
          query: query
        }));
      }
      //提交状态的职能线加班申请，有了新的task_id
      else if((flag === "0") && (record.task_id !== null && record.task_id !== '' && record.task_id !== undefined) && (record.apply_type === '5')) {
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
      //已保存但未提交的，需要进入创建页面提交
      if (flag === "1" ) {
        query["circulationType"] = "项目组加班统计";
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/createTeamApproval',
          query: query
        }));
      } else if((flag === "0") && (record.task_id !== null) && (record.task_id !== '') && (record.task_id !== undefined)) {
        query["applyTypeForPerson"] = '2';
        query["approvalType"] = '3';
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
          query: query
        }));
      }
    }
    else if(record.task_name === "部门加班统计") {
      //保存状态的职能线加班申请，进入创建界面
      if (flag === "1" && record.apply_type === '6') {
        query["circulationType"] = "职能线加班统计";
        dispatch(routerRedux.push({
          pathname: '/humanApp/overtime/overtime_index/createFunctionalDeptApproval',
          query: query
        }));
      }
      //提交状态的职能线加班统计，有了新的task_id
      else if((flag === "0") && (record.task_id !== null && record.task_id !== '' && record.task_id !== undefined) && (record.apply_type === '6')) {
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
  //撤销未进行审批的项目组加班申请
  goRevoke = (record) =>{
    const {dispatch}=this.props;
    let apply_type = '';
    if(record.task_name === '项目组加班申请')
    {
      apply_type = '1';
    }
    else if(record.task_name === '项目组加班统计'){
      apply_type = '2';
    }
    //判断是审批中状态还是未提交状态,0未状态，1审批状态,
    let query={}
    query["arg_apply_id"] = record.task_id;
    query["arg_apply_type"] = apply_type;
    return new Promise((resolve) => {
      dispatch({
        type: 'overtime_index_model/teamApplyStatesQuery',
        query,
        resolve
      });
    }).then((resolve) => {
      if(resolve === '0')
      {
        return new Promise((resolve) =>{
          dispatch({
            type: 'overtime_index_model/teamApplyRevokeOperation',
            query,
            resolve
          });
        }).then((resolve) =>{
          if(resolve === 'success'){
            message.success('撤销成功！');
            location.reload();
          }
          else if(resolve === 'false'){
            message.error('撤销失败,检查参数！');
            return;
          }
        }).catch(()=>{
          dispatch(routerRedux.push({
            pathname:'/humanApp/overtime/overtime_index'}));
        });
      }else if(resolve === '1')
      {
        message.error("审批中的申请不可撤销！");
        return;
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/overtime/overtime_index'}));
    });
  }

  //审批按钮跳转到申请流程审批页面
  //项目组、部门加班审批分为不同的界面进行
  gotoApproval = (record) =>{
    const {dispatch} = this.props;
    let infoRecord = {
      proc_inst_id:record.proc_inst_id,
      proc_task_id:record.proc_task_id,
      task_id:record.task_id,
      deptName:record.deptname,
      step:record.step,
      user_name:record.user_name,
      create_time:record.create_time,
      task_name:record.task_name,
      holiday_name:record.holiday_name,
      create_person_name:record.create_person_name,
    }

    console.log("record.apply_type"+record.apply_type);

   if(record.apply_type === "5"){
      infoRecord["applyTypeForPerson"] = '1';
      infoRecord["approvalType"] = '5';
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/deptFuncApproval',
        query:infoRecord,
      }));
    }else if(record.apply_type === "6"){
      infoRecord["applyTypeForPerson"] = '2';
      infoRecord["approvalType"] = '6';
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/deptFuncApproval',
        query:infoRecord,
      }));
    } else if(record.apply_type === "3") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/deptApproval',
        query:infoRecord,
      }));
    }else if(record.apply_type === "1"){
      infoRecord["applyTypeForPerson"] = '1';
      infoRecord["approvalType"] = '1';
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/teamApproval',
        query:infoRecord,
      }));
    }else if(record.apply_type === "2"){
      infoRecord["applyTypeForPerson"] = '2';
      infoRecord["approvalType"] = '3';
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/teamApproval',
        query:infoRecord,
      }));
    }else if(record.apply_type === "4"){
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index/deptStatsApproval',
        query:infoRecord,
      }));
    }
  }


  showDeleteModel = (record) =>{
    this.setState({
      visible_delete:true,
      type_delete:record.apply_type,
      task_id_delete:record.task_id,
      status_delete:record.status,
    });
    console.log(record);
  }

  handleOkDelete = () =>{

    if(this.state.status_delete !== '0'){
      message.error("正在流转中加班审批不可删除！");
    }else if(this.state.status_delete === '0') {
      const {dispatch} = this.props;
        let query = {
          //传递删除什么类型的加班流程申请
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
  handleCancelDelete = () =>{
    this.setState({
      visible_delete:false,
    });
  }

  columns1 = [
    { title: '审批流程名称', dataIndex: 'task_name' },
    { title: '处理环节', dataIndex: 'step',},
    { title: '处理人', dataIndex: 'user_name', },
    { title: '申请部门', dataIndex: 'deptname', },
    { title: '申请人', dataIndex: 'create_person_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    { title: '操作', dataIndex: '', key: 'x', render: (text,record) => (
      <span>
{
  record.status === '0' ?
    <span>
        <a onClick={()=>this.gotoIndex(record)} >查看</a>
         <span className="ant-divider" />
    </span>
    :
    null
}
        {
          record.user_id === Cookie.get('userid') && record.state !== '4'?
          <span>
            <a onClick = { ()=>this.gotoApproval(record)}> 审批</a>
          </span>
            :
            null
        }
        {
          record.state === '4'?
            <span>
            <a onClick = { ()=>this.gotoIndex(record)}> 查看</a>
          </span>
            :
            null
        }
        {
          record.step ?
            null
            :
            <span>
              <a onClick={()=>this.showDeleteModel(record)}>删除</a>
            </span>
        }
      </span>
      ) },
  ];

  columns2 = [
    { title: '审批流程名称', dataIndex: 'task_name' },
    { title: '处理环节', dataIndex: 'step',},
    { title: '处理人', dataIndex: 'user_name', },
    { title: '申请部门', dataIndex: 'deptname', },
    { title: '申请人', dataIndex: 'create_person_name', },
    { title: '创建日期', dataIndex: 'create_time', },
    { title: '操作', dataIndex: '', key: 'x', render: (text,record,index) => (
        ((record.task_name ==="项目组加班申请" || record.task_name ==="项目组加班统计" ) && record.step === '项目接口人归档' && record.user_name === record.create_person_name && record.user_id === Cookie.get('userid') && record.if_submit === '0') ?
        <span>
          <a onClick = {()=>this.goRevoke(record)}>撤销</a> 
          &nbsp; |&nbsp;
          <a onClick = {()=>this.gotoIndex(record)}>查看</a>
        </span>
        :
        <span>
          <a onClick = {()=>this.gotoIndex(record)}>查看</a>
        </span>
        )},
  ];
 
  render(){
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

    return(
      <div>
        <br/>
        <Button type="primary" onClick={this.CreateNew.bind(this)} style={{display:this.state.interfaceFlag}} >新建</Button>
        <br/><br/>

        <Modal
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

function mapStateToProps(state) {
  return {
    loading: state.loading.models.overtime_index_model,
    ...state.overtime_index_model,
  };
}
export default connect(mapStateToProps)(overtime_index)
