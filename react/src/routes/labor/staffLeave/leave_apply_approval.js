/**
 * 文件说明：离职申请审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React ,{ Component }from "react";
import { Form, Row, Col, Input, Button, Select, Modal} from 'antd';
import {routerRedux} from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from "../../overtime/style.less";
import message from "../../../components/commonApp/message";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class leave_apply_approval extends React.Component {
  constructor (props) {
    super(props);
    let auth_ouname = Cookie.get('deptname').split('-')[1];
    this.state = {
      auth_ouname:auth_ouname,
      choiseOpinionFlag:"none",
      isClickable: true,
      visible:false,
      nextstep:'',
      endstepflag:false,
    }
  }
  //提交下一环节
  selectNext = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");

    if (approval_if==='不同意'){
      this.setState({
        nextstep: "驳回至申请人",
      });
    }else{
      this.setState({
        nextstep: "",
      });
    }
    this.setState({
      visible: true,
    });
  }
  //提交弹窗
  handleOk = (e) => {
    this.setState({ isClickable: false });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let create_person_id = this.props.create_person_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let nextstep = this.state.nextstep;
    let approval_type = '1';
    const{dispatch} = this.props;
    this.setState({
      visible: false,
    });
    if(approval_if==='不同意'&&approval_advice===''){
      this.setState({ isClickable: true });
      //message.error('意见不能为空');
    }else {
      return new Promise((resolve) => {
        dispatch({
          type:'leave_approval_model/submitApproval',
          approval_if,
          approval_advice,
          nextstepPerson,
          nextstep,
          orig_proc_inst_id,
          orig_proc_task_id,
          orig_apply_task_id,
          approval_type,
          create_person_id,
          resolve
        });
      }).then((resolve) => {
        if(resolve === 'success')
          {
            this.setState({ isClickable: true });
            setTimeout(() => {
            dispatch(routerRedux.push({
              pathname:'/humanApp/labor/staffLeave_index'}));
          },500);
        }
        if(resolve === 'false')
        {
          this.setState({ isClickable: true });
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname:'/humanApp/labor/staffLeave_index'}));
      });
    }
  }
  //取消弹窗
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  //清空填写内容
  handleReset = () => {
  }
  //结束关闭
  gotoHome = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/labor/staffLeave_index'
    }));
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
    const {getFieldDecorator } = this.props.form;
    //样式
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 14 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };
    const formItemLayout3 = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };

    const {approvalApplyInfo} = this.props;
    let ApplyInfo = {};
    let start_time = '';
    let leave_time = '';
    if(approvalApplyInfo != null && approvalApplyInfo != '' && approvalApplyInfo != undefined)
    {
      ApplyInfo = approvalApplyInfo[0];
      start_time = ApplyInfo.start_time.split(' ')[0];
      leave_time = ApplyInfo.leave_time.split(' ')[0];
     }
     //意见列表
    const {approvalHiList,approvalNowList} = this.props;

    //下一环节
    const {nextPersonList} = this.props;
    console.log("nextPersonList==="+nextPersonList);
    let initperson = '';
    let nextdataList = '';
    if(this.state.nextstep!=='驳回至申请人'){
      if(nextPersonList.length){
        this.state.nextstep = nextPersonList[0].submit_post_name;
        initperson = nextPersonList[0].submit_user_id;
        nextdataList = nextPersonList.map(item =>
          <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
        );
      }
    }else{
      const {create_person} = this.props;
      console.log("create_person==="+create_person);
      if(create_person.length){
        initperson = create_person[0].create_person_id;
        nextdataList = create_person.map(item =>
          <Option value={item.create_person_id}>{item.create_person_name}</Option>
        );
      }
    }
    let nowdataList = '';
    console.log('this.state.nextstep==='+this.state.nextstep);
    console.log('approvalNowList==='+JSON.stringify(approvalNowList));
    if(approvalNowList.length>0&&approvalNowList[0].task_name.endsWith("归档")){
       nowdataList = '';
    }else{
      if(this.state.nextstep.endsWith("结束")){
        nowdataList = '';
      }else{
        nowdataList = approvalNowList.map(item =>
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
      }
    }

    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input  style={inputstyle} value= {item.task_detail} disabled={true}></Input>
      </FormItem>
    );
    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>员工离职申请表</h1></Row><br/><br/>
        <Form

        >
          <Row  gutter={12} >
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'姓名'} {...formItemLayout2}>
                <Input style={inputstyle} value = {ApplyInfo.create_person_name} disabled={true}/>
              </FormItem>
            </Col>
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'部门'} {...formItemLayout3}>
                 <Input style={inputstyle} value = {ApplyInfo.dept_name} disabled={true}/>
              </FormItem>
            </Col>
          </Row>
          <Row  gutter={12}>
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'岗位名称'} {...formItemLayout2}>
                <Input  style={inputstyle} value = {ApplyInfo.position_title} disabled={true}/>
              </FormItem>
            </Col>
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'岗位级别'} {...formItemLayout3}>
                <Input style={inputstyle} value = {ApplyInfo.position_level} disabled={true}/>
              </FormItem>
            </Col>
          </Row>
          <Row  gutter={12}>
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'入职时间'} {...formItemLayout2}>
                <Input style={inputstyle} value = {start_time} disabled={true}/>
              </FormItem>
            </Col>
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'离职时间'} {...formItemLayout3}>
                <Input style={inputstyle} value = {leave_time} disabled={true}/>
              </FormItem>
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="联系方式" hasFeedback {...formItemLayout}>
              <Input style={inputstyle} value = {ApplyInfo.contact} disabled={true}/>
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="离职种类" hasFeedback {...formItemLayout}>
              <Input style={inputstyle} value = {ApplyInfo.leave_type} disabled={true}/>
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="离职-公司原因" hasFeedback {...formItemLayout}>
              <TextArea

                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.company_reason}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="离职-个人原因" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.self_reason}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="离职-其他原因" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.other_reason}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="离职去向" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.leave_gone}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="对部门的建议" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.dept_advice}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="对公司的建议" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.company_advice}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <FormItem label="申请人意见" hasFeedback {...formItemLayout}>
              <TextArea
                style={{ minHeight: 32,color:'#000' }}
                value={ApplyInfo.self_advice}
                autosize={{ maxRows: 10 }}
                disabled={true}
              />
            </FormItem>
          </Row>

          <span style={{ textAlign: 'center' }}>
            {hidataList}
          </span>
          <span style={{ textAlign: 'center' }}>
            {nowdataList}
          </span>
        </Form>

          <div style={{textAlign: "center"}}>
            <Button onClick={this.gotoHome} type="dashed">关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </div>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input  style={inputstyle} value = {this.state.nextstep} disabled={true}/>
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson',{
                  initialValue: initperson
                })(
                  <Select size="large" style={{width: '100%'}} initialValue={initperson} placeholder="请选择负责人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.loading.models.leave_approval_model,
    ...state.leave_approval_model
  };
}
leave_apply_approval = Form.create()(leave_apply_approval);
export default connect(mapStateToProps)(leave_apply_approval);
