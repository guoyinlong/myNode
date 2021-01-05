/**
 * 作者：翟金亭
 * 创建日期：2019-04-15
 * 邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现创建项目组加班审批流程功能
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message, Col, Checkbox, Modal} from "antd";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

import styles from './style.less';
import {connect} from "dva";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import exportExcel from "./exportExcel";

class DeptApproval extends Component{
  constructor (props) {
    super(props);
    this.state = {
      post_name:"",
      dateFlag:false,
      displayFlag:"none",
      choiseHolydays:"none",
      choiseOpinionFlag:"none",
      teamsum:'',
      not_end_task:true,
      visible:false,
      next_post_id:'',
      next_post_name:'',
      if_end_task: 0,
      personvisible:false,
      personList:[],
      isClickable: true
    };
  }
//选择不同意，显示驳回意见信息
  choiseOpinion = (value) =>{
    if(value==="不同意") {
      this.setState({
        choiseOpinionFlag: "",
      })
    }else {
      this.setState({
        choiseOpinionFlag: "none",
      })
    }
  }

  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month<10?`0${month}`:`${month}`}月${date}日`
  }

  //查看按钮跳转到加班管理界面
  gotoTeamDetails = (record) =>{
    let orig_proc_task_id = record.apply_id;
    const{dispatch} = this.props;
    dispatch({
      type:'approval_model/queryTeamList',
      orig_proc_task_id,
    });
    //this.state.personList = this.props.personDataList;
    this.setState({
      personvisible: true,
    });
  }
  /*加班人员详情*/
  team_details_columns = [
    { title: '序号', dataIndex: 'indexID'},
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '姓名', dataIndex: 'user_name' },
    { title: '加班日期', dataIndex: 'overtime_time' },
    { title: '加班原因', dataIndex: 'overtime_reson' },
    { title: '加班地点', dataIndex: 'overtime_place' },
    { title: '天数', dataIndex: 'remark' },
  ];

  team_columns2 = [
    { title: '编号', dataIndex: 'indexID'},
    { title: '项目组', dataIndex: 'proj_name' },
    { title: '操作', dataIndex: '',  key: 'x', render: (text,record,index) => (
        <a  onClick={()=>this.gotoTeamDetails(record)}>查看</a>
      )},
  ];

  /*加班导出人员详情*/
  team_details_columns_export = [
    { title: '序号', dataIndex: 'indexID'},
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '姓名', dataIndex: 'user_name' },
    { title: '加班日期', dataIndex: 'overtime_time' },
    { title: '加班原因', dataIndex: 'overtime_reson' },
    { title: '加班地点', dataIndex: 'overtime_place' },
    { title: '天数', dataIndex: 'remark' },
  ];

  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/overtime/overtime_index'
    }));
  }
  handleOk2 = () => {
    this.setState({
      personvisible: false,
    });
  }
  handleCancel2 = () => {
    this.setState({
      personvisible: false,
    });
  }

  handleOk = () => {
    this.setState({ isClickable: false });
    this.setState({
      visible: false,
    });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let nextpostid = this.state.next_post_id;
    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        type:'approval_model/submitDeptApproval',
        approval_if,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        nextstepPerson,
        nextpostid,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/overtime/overtime_index'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/overtime/overtime_index'}));
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  //审批人提交审批信息
  submitcheck = () =>{
    let approval_if = this.props.form.getFieldValue("rejectIf");
    if (approval_if=='不同意'){
      this.setState({ isClickable: false });
      let orig_proc_inst_id = this.props.proc_inst_id;
      let orig_proc_task_id = this.props.proc_task_id;
      let orig_apply_task_id = this.props.apply_task_id;
      let approval_if = this.props.form.getFieldValue("rejectIf");
      let approval_advice = this.props.form.getFieldValue("rejectAdvice");
      let nextstepPerson = '';
      let nextpostid = this.state.next_post_id;
      const{dispatch} = this.props;

      if(approval_if==='不同意'&&approval_advice===''){
        this.setState({ isClickable: true });
        message.error('意见不能为空');
      }else {
        return new Promise((resolve) => {
          dispatch({
            type:'approval_model/submitDeptApproval',
            approval_if,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id,
            orig_apply_task_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if(resolve === 'success')
          {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname:'/humanApp/overtime/overtime_index'}));
            },500);
          }
          if(resolve === 'false')
          {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/overtime/overtime_index'}));
        });
      }


    }else{
      /*最后一步*/
      if (this.state.if_end_task == '1'){
        this.setState({ isClickable: false });
        let orig_proc_inst_id = this.props.proc_inst_id;
        let orig_proc_task_id = this.props.proc_task_id;
        let orig_apply_task_id = this.props.apply_task_id;
        let approval_if = this.props.form.getFieldValue("rejectIf");
        let approval_advice = this.props.form.getFieldValue("rejectAdvice");
        let nextstepPerson = '';
        let nextpostid = this.state.next_post_id;
        const{dispatch} = this.props;

        return new Promise((resolve) => {
          dispatch({
            type:'approval_model/submitDeptApprovalEnd',
            approval_if,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id,
            orig_apply_task_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if(resolve === 'success')
          {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname:'/humanApp/overtime/overtime_index'}));
            },500);
          }
          if(resolve === 'false')
          {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/overtime/overtime_index'}));
        });
      } else{
        this.setState({
          visible: true,
        });
      }
    }
  }
  //页面加载时将各个项目组的数据存储起来,调用一键导出方法
  //导出当前部门下所有的项目组内加班申请详情—部门加班统计审批
  expExl=()=>{
    //调用组件导出
    let deptName = this.props.deptInfoRecords.deptName;
    const personDataListExport = this.props.personDataListExport;
    if(personDataListExport.length !== 0){
      exportExcel(personDataListExport,deptName);
    }else{
      message.info("无"+deptName+"加班申请数据");
    }
  };

  render() {
    const inputstyle = {color:'#000'};
    const { getFieldDecorator } = this.props.form;
    const deptInfoRecords = this.props.deptInfoRecords;
    let projDataList = this.props.projDataList;
    for (let i=0; i<projDataList.length;i++){
      projDataList[i].key=i+1;
      projDataList[i].indexID=i+1;
    }
    //评论信息
    let approvalTeamList = this.props.approvalTeamList;
    let approvalHiList = this.props.approvalHiList;
    let approvalNowList = this.props.approvalNowList;
    this.state.teamsum = '';
    for (let j=0; j<approvalTeamList.length;j++){
      this.state.teamsum += approvalTeamList[j].task_detail+"\n";
    }
    this.state.teamsum +="\n";


    let nowdataList = approvalNowList.map(item =>
      <span>
        <FormItem label={item.task_name} {...formItemLayout}>
          {getFieldDecorator('rejectIf', {
            initialValue: "同意",
          })(
            <Select size="large" style={{width: 200}} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
              <Option value="同意">同意</Option>
              <Option value="不同意">不同意</Option>
            </Select>
          )}
        </FormItem>

        <FormItem label="审批驳回意见" {...formItemLayout} style={{display: this.state.choiseOpinionFlag}}>
          {getFieldDecorator('rejectAdvice',{
            initialValue:"驳回原因",
            rules: [
              {
                required: true,
                message: '请填写驳回意见'
              },
            ],
          })(
            <TextArea
              style={{ minHeight: 32 }}
              placeholder="请填写驳回意见"
              rows={2}
            />
          )}
            </FormItem>
        </span>
    );
    if (approvalNowList.length>0) {
      if (approvalNowList[0].task_name=='人力资源专员归档'){
        this.state.if_end_task = '1';
        nowdataList = '';
      }
    }
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name}>
        <Input  style={inputstyle} value= {item.task_detail} disabled={true}></Input>
      </FormItem>
    );
    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    let nextpostname = '';
    let initperson = '';
    if (nextDataList.length>0){
      initperson = nextDataList[0].submit_user_id;
      nextpostname = nextDataList[0].submit_post_name;
      //this.state.next_post_id = nextDataList[0].post_id;
      this.state.next_post_id = '1000000000001';
    }
    const nextdataList = nextDataList.map(item =>
      <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
    );
    //加班人员详情
    let personDataList = this.props.personDataList;
    for (let i=0;i<personDataList.length;i++) {
      personDataList[i].indexID = i+1;
    }
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      style :{marginBottom:10}
    };

    //根据查询出的以前的审批意见，之前所有的审批意见及审批时间，默认可见但不可编辑
    return (
      <div>
        <br/><br/>
        {/*if(record.user_name（当前处理人）一定等于 当前登陆人，首页进行的审批控制)，
          当前处理环节，从首页界面的该条记录获得 { record.step} */}
        <p>当前申请环节：<span>{deptInfoRecords.step}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          当前处理人：<span>{deptInfoRecords.user_name}</span></p>
        {/*表头显示，从首页界面的该条记录获得审批流程名称 {record.task_name}*/}
        <Row span={2} style={{textAlign: 'center'}}><h2>{deptInfoRecords.task_name}审批表</h2></Row>
        <Card title="基本信息" className={styles.card}>
          <Form style={{marginTop: 10}}>
            <FormItem label="部门" {...formItemLayout}>
              {getFieldDecorator('deptname', {
                initialValue: deptInfoRecords.deptName.split('-')[1] })
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="节假日" {...formItemLayout}>
              {getFieldDecorator('holidays', {
                initialValue: deptInfoRecords.holiday_name
              })(<Input style={inputstyle} placeholder='' disabled={true}/>)}
            </FormItem>
            <FormItem label="申请日期" {...formItemLayout}>
              {getFieldDecorator('timeApply', {
                initialValue: deptInfoRecords.create_time.split(' ')[0]
              })(<Input style={inputstyle} placeholder='' disabled={true}/>)}
            </FormItem>
          </Form>
        </Card>

        <Card title="加班申请汇总" className={styles.card} extra={<a icon="download" onClick={this.expExl} disabled="" style={{display:deptInfoRecords.step==="人力资源专员归档"?"":"none"}}>一键导出</a>} >
          <Table
            columns={this.team_columns2}
            dataSource={projDataList}
            pagination={false}
          />
        </Card>
        <Modal
          title="加班人员列表"
          visible={this.state.personvisible}
          onOk={this.handleOk2}
          onCancel={this.handleCancel2}
          width={"75%"}
        >
          <div>
            <Card title="加班申请汇总">
              <Table
                columns={this.team_details_columns}
                dataSource={personDataList}
                pagination={false}
              />
            </Card>
          </div>
        </Modal>


        <Card title={<div style={{textAlign: "left"}}>审批意见</div>} className={styles.card} bordered={true} style={{display: ''}}>
          {/*循环展示之前所有环节的审批意见*/}

          <FormItem label="团队负责人审核">
            <TextArea
              style={{ minHeight: 32 }}
              value={this.state.teamsum}
              autosize={{ maxRows: 10 }}
              disabled={true}
              style={inputstyle}
            />
          </FormItem>
          {hidataList}
          {nowdataList}
        </Card>
        <Card title="操作" className={styles.card}>
          <div style={{textAlign: "center"}}>
            <Button onClick={this.gotoHome} type="dashed">关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.submitcheck} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </div>
        </Card>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value = {nextpostname} disabled={true}/>
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson',{
                  initialValue: initperson
                })(
                  <Select size="large" style={{width: '100%'}} initialValue={initperson} placeholder="请选择团队负责人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.approval_model,
    ...state.approval_model
  };
}

DeptApproval = Form.create()(DeptApproval);
export default connect(mapStateToProps)(DeptApproval);
