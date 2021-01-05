/**
 * 作者：翟金亭
 * 创建日期：2019-04-15
 *  邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现创建项目组加班审批流程功能
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message, Modal} from "antd";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


import styles from './style.less';
import {connect} from "dva";
import {routerRedux} from "dva/router";
import DowmFile from "./downFile";

class TeamApproval extends Component{
  constructor (props) {
    super(props);
    this.state = {
      post_name:"",
      dateFlag:false,
      displayFlag:"none",
      choiseHolydays:"none",
      choiseOpinionFlag:"none",
      proc_inst_id:'',
      proc_task_id:'',
      apply_task_id:'',
      is_end_task:'false',
      visible:false,
      isClickable: true
    };
  }

  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month<10?`0${month}`:`${month}`}月${date}日`
  }

  //查看按钮跳转到加班管理界面
  gotoTeamDetails = (record) =>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/overtime/overtime_index/showTeamDetails',
      query:record.team_apply_id,
    }));
  }

  team_columns = [
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

  //提交信息
  submitInfo_leader = () =>{
    this.setState({ isClickable: false });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let approvalType = this.props.approvalType;
    const{dispatch} = this.props;
    console.log("this.state.is_end_task : " + this.state.is_end_task);
    if (this.state.is_end_task === 'true') {
      dispatch({
        type:'approval_model/submitTeamApprovalEnd',
        approval_if,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        approvalType
      });
    }else {
      dispatch({
        type:'approval_model/submitTeamApproval',
        approval_if,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        approvalType
      });
    }
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({ isClickable: true });
      dispatch(routerRedux.push({
      pathname:'/humanApp/overtime/overtime_index'
    }));},2000);
  };
  handleOk = () => {
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let approvalType = this.props.approvalType;
    const{dispatch} = this.props;
    if(approval_if==='不同意'&&approval_advice===''){
      message.error('意见不能为空');
    }else {
      if(approval_if==='不同意'){
        this.setState({ isClickable: false });
        dispatch({
          type:'approval_model/submitTeamApproval',
          approval_if,
          approval_advice,
          orig_proc_inst_id,
          orig_proc_task_id,
          orig_apply_task_id,
          approvalType
        });
        setTimeout(() => {
          this.setState({ isClickable: true });
          dispatch(routerRedux.push({
            pathname:'/humanApp/overtime/overtime_index'
          }));},2000);
      }else{
        this.setState({
          visible: true,
        });
      }
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  //选择节假日之后显示信息
  choiseHolydaysonClick = (value) =>{
    if(value==="劳动节") {
      this.setState({
        choiseHolydays: "",
      })
    }else {
      message.error('该节日没有加班信息');
    }
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



  render() {
    const inputstyle = {color:'#000'};
    const { getFieldDecorator } = this.props.form;
    const teamInfoRecord = this.props.teamInfoRecords;
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
    this.state.displayFlag = '';

    let team_data = this.props.personDataList;
    for (let i=0; i<team_data.length;i++){
      team_data[i].key=i;
      team_data[i].indexID=i+1;
    }
    let approval_list = this.props.approvalDataList;
    let approvalHiList = [];
    
    for (let i=0; i<approval_list.length;i++){
      if(approval_list[i].task_type_id!='3'){
        approvalHiList.push(approval_list[i])
      }
    }
    let contendetail = '';
    let contentflag = 'false';
    let nextstep = '项目接口人归档';
    let nextperson = teamInfoRecord.create_person_name;
    if(approvalHiList.length>0){
      contendetail = approvalHiList[0].task_detail;
      contentflag = 'true';
      this.state.is_end_task = 'true';
      nextstep = "归档";
      nextperson = "结束";
    }
    console.log(approval_list);

    //附件信息
    let filelist = this.props.fileDataList;
    for (let i=0;i<filelist.length;i++){
      filelist[i].uid = i+1;
      filelist[i].status = "done";
    }

    return (
      <div>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.submitInfo_leader}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value = {nextstep} disabled={true}/>
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson',{
                  initialValue: nextperson
                })(
                  <Select size="large" style={{width: '100%'}} initialValue={nextperson} placeholder="请选择负责人">
                    <Option value={nextperson}>{nextperson}</Option>
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>

        <br/><br/>
        <p>当前环节：<span>{teamInfoRecord.step}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          当前处理人：<span>{teamInfoRecord.user_name}</span></p>
        <Row span={2} style={{textAlign: 'center'}}><h2>{teamInfoRecord.task_name}审批表</h2></Row>
        <Card title="基本信息" className={styles.card}>
          <Form style={{marginTop: 10}}>
            <FormItem label="部门" {...formItemLayout}>
              {getFieldDecorator('deptname', {
                initialValue: teamInfoRecord.deptName.split('-')[1]})
              (<Input style={inputstyle} placeholder='' disabled={true}/>)
              }
            </FormItem>
            <FormItem label="节假日" {...formItemLayout}>
              {getFieldDecorator('holidays', {
                initialValue: teamInfoRecord.holiday_name
              })(
                <Input style={inputstyle} placeholder='' disabled={true}></Input>
              )}
            </FormItem>
            <FormItem label="申请日期" {...formItemLayout}>
              {getFieldDecorator('timeApply', {
                initialValue: teamInfoRecord.create_time.split(' ')[0]
              })(<Input style={inputstyle} placeholder='' disabled={true}/>)}
            </FormItem>
          </Form>
        </Card>
        <Card title="加班申请汇总" className={styles.card}>
          <Table
            columns={this.team_columns}
            dataSource={team_data}
            pagination={false}
          />
        </Card>
        <Card title={<div style={{textAlign: "left"}}>审批意见</div>} className={styles.card} bordered={true} style={{display: this.state.displayFlag}}>
          {
            contentflag == "true"
              ?
              <FormItem label="团队负责人审核">
                <Input style={inputstyle} value={contendetail} disabled={true}></Input>
              </FormItem>
              :
              null
          }
          {
            contentflag == "false"
              ?
              <span>
                <FormItem label="团队负责人审核" {...formItemLayout}>
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
              :
              null
          }
        </Card>
        {
          teamInfoRecord.task_name === "项目组加班统计"
            ?
        <Card title="附件下载" className={styles.card}>
          <DowmFile filelist = {filelist}/>
        </Card>
          :
          null
        }

        <Card title="操作" className={styles.card}>
          <div style={{textAlign: "center"}}>
          <Button onClick={this.gotoHome} type="dashed">关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.handleOk} type="primary"  disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </div>
        </Card>
      </div>
    )
  }
}
//
function mapStateToProps(state) {
  return {
    loading: state.loading.models.approval_model,
    ...state.approval_model
  };
}

TeamApproval = Form.create()(TeamApproval);
export default connect(mapStateToProps)(TeamApproval);
