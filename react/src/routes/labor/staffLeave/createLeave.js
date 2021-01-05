/**
 * 文件说明：创建离职申请、离职交接、离职清算流程,models
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React from 'react';
import {Form, Row, Col, Input, Button, DatePicker, Select, Modal, Checkbox, message} from 'antd';
import Cookie from "js-cookie";
import {routerRedux} from "dva/router";
import {connect} from "dva";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
 
class CreateLeave extends React.Component {
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    let auth_ouname = Cookie.get('OU');
    this.state = {
      visible:false,
      ouflag:auth_ouname,
      staff_name:user_name,
      dept_name:dept_name,
      user_id:user_id,
      dept_id:dept_id,
      isSubmitClickable:true,
      isSaveClickable:true,
      leave_apply_id_save:'',
    }
  }

  //比较日期
  diffDate(date1,date2){
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if(oDate1.getTime() > oDate2.getTime()){
      return true;
    } else {
      return false;
    }
  }

  //当前时间
  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month<10?`0${month}`:`${month}`}-${date<10?`0${date}`:`${date}`}`
  }

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    this.props.form.validateFields((err)=> {
      if (err) {
        message.error("请填写必填项");
        this.setState({
          isSubmitClickable: true
        });
      } else {
        let startTime = formData.entryTime.format("YYYY-MM-DD");
        let endTime = formData.breakupTime.format("YYYY-MM-DD");
        let currentDate = this.getCurrentDate();

        //离职日期不能小于入职日期
        if(this.diffDate(startTime,endTime)){
          message.error('离职日期不能小于入职日期');
          this.setState({ isSubmitClickable: true });
          return;
        }
        //入职日期不能大于当前日期
        else if (this.diffDate(startTime,currentDate))
        {
          message.error('入职日期不能大于当前日期，请填写您的实际入职日期');
          this.setState({ isSubmitClickable: true });
          return;
        }else{
          this.setState({
            visible: true,
          });
        }
      }
    })
  }

  //提交离职申请信息
  handleOk = () => {
    this.setState({
      visible: false,
      isSubmitClickable: false
    });
    const{dispatch} = this.props;
    //必填数据都已填写
    let formData = this.props.form.getFieldsValue();
    let nextStepPersonId = formData.nextStepPerson;


    //格式化离职原因（公司、个人）
    let comBreakupReasonTemp = '';
    for(let i=0; i<formData.comBreakupReason.length; i++){
      comBreakupReasonTemp += formData.comBreakupReason[i]+',';
    }
    let personBreakupReasonTemp = '';
    for(let i=0; i<formData.personBreakupReason.length; i++){
      personBreakupReasonTemp +=  formData.personBreakupReason[i] + ',';
    }

    //格式化入职、离职日期格式
    if(formData.breakupTime){
      formData.breakupTime = formData.breakupTime.format("YYYY-MM-DD");
    }
    if(formData.entryTime){
      formData.entryTime = formData.entryTime.format("YYYY-MM-DD");
    }

    /*封装基本信息，即leave_apply表数据 begin */
    let basicLeaveData = {};
    //离职申请ID
    let leave_apply_id = '';
    let saveTaskId = this.props.saveTaskId;

    //如果已经存在保存状态的申请，将该申请的saveTaskId赋值给leave_apply_id
    if(saveTaskId !== null && saveTaskId !== '' && saveTaskId !== undefined)
    {
      leave_apply_id = saveTaskId;
    }
    else if(this.state.leave_apply_id_save !== '')
    {
      leave_apply_id = this.state.leave_apply_id_save;
    }
    //新建离职申请，创建ID
    else {
        leave_apply_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);
    }

    //封装离职信息传给后台
    basicLeaveData["arg_leave_apply_id"] = leave_apply_id;
    basicLeaveData["arg_dept_id"] = this.state.dept_id;
    basicLeaveData["arg_dept_name"] = this.state.dept_name;
    basicLeaveData["arg_create_person_id"] = this.state.user_id;
    basicLeaveData["arg_create_person_name"] = this.state.staff_name;
    basicLeaveData["arg_create_time"] = this.getCurrentDate();
    basicLeaveData["arg_status"] = '1';
    /*入职时间改成字符串类型*/
    basicLeaveData["arg_start_time"] = formData.entryTime;
    /*离职时间改成字符串类型*/
    basicLeaveData["arg_leave_time"] = formData.breakupTime;
    basicLeaveData["arg_contact"] = formData.mobilePhone;
    basicLeaveData["arg_leave_type"] = formData.breakupType;
    basicLeaveData["arg_company_reason"] = comBreakupReasonTemp;
    basicLeaveData["arg_self_reason"] = personBreakupReasonTemp;
    basicLeaveData["arg_other_reason"] = formData.otherBreakupReason;
    basicLeaveData["arg_leave_gone"] = formData.departure;
    basicLeaveData["arg_dept_advice"] = formData.toDeptAdvice;
    basicLeaveData["arg_company_advice"] = formData.toComAdvice;
    basicLeaveData["arg_self_advice"] = formData.personAdvice;
    basicLeaveData["arg_position_title"] = formData.positionTitle;
    basicLeaveData["arg_position_level"] = formData.positionLevel;
    /*封装基本信息，即leave_apply表数据 end */

    /*封装审批信息，即leave_approval表数据,申请人创建环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_leave_apply_id"] = leave_apply_id;
    /*封装审批意见，创建人：自动填充审批意见为空，审批人*/
    approvalData["arg_user_id"] = this.state.user_id;
    approvalData["arg_user_name"] = this.state.staff_name;
    approvalData["arg_post_id"] = '9ca4d30fb3b311e6b01d02429ca3c6ff';
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即leave_approval表数据 end */

    /*封装下一环节审批信息，即leave_approval表数据,下一环节 begin */
    let approvalDataNext = {};
    approvalDataNext["arg_leave_apply_id"] = leave_apply_id;
    /*下一环节处理人为项目经理、或者部门经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = nextStepPersonId;
    approvalDataNext["arg_user_name"] = formData.nextStepPerson;
    approvalDataNext["arg_post_id"] = '9cc97a9cb3b311e6a01d02429ca3c6ff';
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即leave_approval表数据， 下一环节end */
    return new Promise((resolve) => {
      dispatch({
        type:'createLeaveModels/staffLeaveSubmit',
        basicLeaveData,
        approvalData,
        approvalDataNext,
        leave_apply_id,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ leave_apply_id_save: leave_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'
          }));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ leave_apply_id_save: leave_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'
          }));
        },500);
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index'
      }));
    });
  }
  //选择下一环节处理人，取消
  handleCancel = (e) => {
    this.setState({
      visible: false,
      isSubmitClickable: true
    });
  }

  //保存信息
  saveLeaveInfo = () =>{
    this.setState({
      isSaveClickable: false
    });
    const{dispatch} = this.props;
    this.props.form.validateFields((err)=>{
      if(err){
        message.error("请填写必填项");
        this.setState({ isSaveClickable: true });
      }
      else{
        let formData = this.props.form.getFieldsValue();

        let startTime = formData.entryTime.format("YYYY-MM-DD");
        let endTime = formData.breakupTime.format("YYYY-MM-DD");
        let currentDate = this.getCurrentDate();


        //离职日期不能小于入职日期
        if(this.diffDate(startTime,endTime)){
          message.error('离职日期不能小于入职日期');
          this.setState({ isSaveClickable: true });
          return;
        }
        //入职日期不能大于当前日期
        if(this.diffDate(startTime,currentDate)){
          message.error('入职日期不能大于当前日期，请填写您的实际入职日期');
          this.setState({ isSaveClickable: true });
          return;
        }
        //格式化离职原因（公司、个人）
        let comBreakupReasonTemp = '';
        for(let i=0; i<formData.comBreakupReason.length; i++){
          comBreakupReasonTemp += formData.comBreakupReason[i]+',';
        }
        let personBreakupReasonTemp = '';
        for(let i=0; i<formData.personBreakupReason.length; i++){
          personBreakupReasonTemp +=  formData.personBreakupReason[i] + ',';
        }

        //格式化入职、离职日期格式
        if(formData.breakupTime){
          formData.breakupTime = formData.breakupTime.format("YYYY-MM-DD");
        }
        if(formData.entryTime){
          formData.entryTime = formData.entryTime.format("YYYY-MM-DD");
        }

        /*封装基本信息，即leave_apply表数据 begin */
        let basicLeaveData = {};
        //离职申请ID
        let leave_apply_id = '';
        //如果已经存在保存状态的申请，将该申请的saveTaskId赋值给leave_apply_id
        if(this.state.leave_apply_id_save !== '')
        {
          leave_apply_id = this.state.leave_apply_id_save;
        }
        //新建离职申请，创建ID
        else
        {
          leave_apply_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);
        }

        //封装离职信息传给后台
        basicLeaveData["arg_leave_apply_id"] = leave_apply_id;
        basicLeaveData["arg_dept_id"] = this.state.dept_id;
        basicLeaveData["arg_dept_name"] = this.state.dept_name;
        basicLeaveData["arg_create_person_id"] = this.state.user_id;
        basicLeaveData["arg_create_person_name"] = this.state.staff_name;
        basicLeaveData["arg_create_time"] = this.getCurrentDate();
        basicLeaveData["arg_status"] = '0';
        /*入职时间改成字符串类型*/
        basicLeaveData["arg_start_time"] = formData.entryTime;
        /*离职时间改成字符串类型*/
        basicLeaveData["arg_leave_time"] = formData.breakupTime;
        basicLeaveData["arg_contact"] = formData.mobilePhone;
        basicLeaveData["arg_leave_type"] = formData.breakupType;
        basicLeaveData["arg_company_reason"] = comBreakupReasonTemp;
        basicLeaveData["arg_self_reason"] = personBreakupReasonTemp;
        basicLeaveData["arg_other_reason"] = formData.otherBreakupReason;
        basicLeaveData["arg_leave_gone"] = formData.departure;
        basicLeaveData["arg_dept_advice"] = formData.toDeptAdvice;
        basicLeaveData["arg_company_advice"] = formData.toComAdvice;
        basicLeaveData["arg_self_advice"] = formData.personAdvice;
        basicLeaveData["arg_position_title"] = formData.positionTitle;
        basicLeaveData["arg_position_level"] = formData.positionLevel;
        /*封装基本信息，即leave_apply表数据 end */

        return new Promise((resolve) => { 
          dispatch({
            type:'createLeaveModels/leaveApprovalSave',
            basicLeaveData,
            leave_apply_id,
            resolve
          });
        }).then((resolve) => {
          if(resolve === 'success')
          {
            this.setState({ leave_apply_id_save: leave_apply_id });
            this.setState({ isSaveClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname:'/humanApp/labor/staffLeave_index'
              }));
            },500);
          }
          if(resolve === 'false')
          {
            this.setState({ leave_apply_id_save: leave_apply_id });
            this.setState({ isSaveClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname:'/humanApp/labor/staffLeave_index'
              }));
            },500);
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'}));
        });
      }
    })
  };

  render() {
    const inputstyle = {color:'#000'};
    const { getFieldDecorator } = this.props.form;
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
        sm: { span: 5 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };

    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    //下一环节名称
    let nextPostName = '';
    //下一环节处理人
    let initperson = '';
    let nextdataList = null;
    if(nextDataList !== undefined)
    {
      if (nextDataList.length>0){
        initperson = nextDataList[0].submit_user_id;
        nextPostName = nextDataList[0].submit_post_name;
      }
      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>员工离职申请表</h1></Row>
        <br/><br/>
      <Form style={{ width: '100%' }}>
        <Row  gutter={12} >
          {/*姓名*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'姓名'} {...formItemLayout2}>
              {getFieldDecorator('staff_name',{
                initialValue:this.state.staff_name
              })(<Input style={inputstyle} value = '' disabled={true}/>)}
             </FormItem>
          </Col>
            {/*部门*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'部门'} {...formItemLayout3}>
             {getFieldDecorator('dept_name',{
               initialValue: this.state.dept_name
             })(<Input style={inputstyle} value = '' disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>

        <Row  gutter={12}>
          {/*岗位名称*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'岗位名称'} {...formItemLayout2}>
              {getFieldDecorator('positionTitle',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请填写您的岗位名称'
                  },
                ],
              })(<Input placeholder = '例：软件研发岗位' disabled={false}/>)}
            </FormItem>
          </Col>
          {/*岗位级别*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'岗位级别'} {...formItemLayout3}>
              {getFieldDecorator('positionLevel',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请填写您的岗位级别'
                  },
                ],
              })(<Input placeholder = '例：08A/T1.1' disabled={false}/>)}
            </FormItem>
          </Col>
        </Row>

        <Row  gutter={12}>
          {/*入职时间*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'入职日期'} {...formItemLayout2}>
              {getFieldDecorator('entryTime',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请选择入职日期'
                  },
                ],
              })(
                <DatePicker
                  placeholder="入职日期"
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                  disabled={false}
                />
              )}
            </FormItem>
          </Col>
          {/*离职时间*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'计划离职日期'} {...formItemLayout3}>
              {getFieldDecorator('breakupTime',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请选择计划离职日期'
                  },
                ],
              })(
                <DatePicker
                  placeholder="计划离开公司日期"
                  style={{ width: '100%' }}
                  disabled={false}
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        {/*联系方式*/}
        <Row style={{ textAlign: 'center' }}>
            {/*联系方式*/}
            <FormItem label="联系方式" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mobilePhone', {
                initialValue:'',
                rules: [
                  {
                    required: true,
                    pattern: /^1[3456789]\d{9}$/,
                    message: "输入手机号不合法！",
                  },
                ],
              })(<Input placeholder = "您的常用手机号（11位）" />)}
            </FormItem>
        </Row>
        {/*离职种类*/}
        <Row style={{ textAlign: 'center' }}>
          <Col >
            {/*离职种类*/}
            <FormItem label="离职种类" {...formItemLayout} >
              {getFieldDecorator('breakupType',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请选择离职种类' 
                  },
                ],
              })(
                <Select placeholder="请选择离职种类" disabled={false}>
                  <Option value="辞职">辞职</Option>
                  <Option value="辞退">辞退</Option>
                  <Option value="合同到期">合同到期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {/*离职-公司原因*/}
        <Row style={{ textAlign: 'center' }}>
          <Col >
            {/*离职原因*/}
            <FormItem label="离职-公司原因" {...formItemLayout} >
              {getFieldDecorator('comBreakupReason',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请选择离职的公司原因'
                  },
                ],
              })(
                <Checkbox.Group disabled={false}>
                  <Row style={{ textAlign: 'left' }}>
                    <Col span={8}><Checkbox value="薪资偏低">薪资偏低</Checkbox></Col>
                    <Col span={8}><Checkbox value="晋升机会">晋升机会</Checkbox></Col>
                    <Col span={8}><Checkbox value="工作时间长">工作时间长</Checkbox></Col>
                    <Col span={8}><Checkbox value="人际关系">人际关系</Checkbox></Col>
                    <Col span={8}><Checkbox value="福利不佳">福利不佳</Checkbox></Col>
                    <Col span={8}><Checkbox value="工作环境">工作环境</Checkbox></Col>
                    <Col span={8}><Checkbox value="无法适应工作内容">无法适应工作内容</Checkbox></Col>
                    <Col span={8}><Checkbox value="交通不便">交通不便</Checkbox></Col>
                    <Col span={8}><Checkbox value="不满公司的政策与措施">不满公司的政策与措施</Checkbox></Col>
                    <Col span={8}><Checkbox value="没有事业发展机会">没有事业发展机会</Checkbox></Col>
                    <Col span={8}><Checkbox value="缺少培训机会">缺少培训机会</Checkbox></Col>
                    <Col span={8}><Checkbox value="工作量少、枯燥">工作量少、枯燥</Checkbox></Col>
                    <Col span={8}><Checkbox value="同事关系不融洽">同事关系不融洽</Checkbox></Col>
                    <Col span={8}><Checkbox value="与上司关系不融洽">与上司关系不融洽</Checkbox></Col>
                    <Col span={8}><Checkbox value="其他">其他</Checkbox></Col>

                  </Row>
                </Checkbox.Group>
                )}
            </FormItem>
          </Col>
        </Row>
        {/*离职-个人原因*/}
        <Row style={{ textAlign: 'center' }}>
          <Col >
            {/*姓名*/}
            <FormItem label="离职-个人原因" {...formItemLayout} >
              {getFieldDecorator('personBreakupReason',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请选择离职的个人原因'
                  },
                ],
              })( 
                <Checkbox.Group disabled={false}>
                  <Row style={{ textAlign: 'left' }}>
                    <Col span={8}><Checkbox value="健康因素">健康因素</Checkbox></Col>
                    <Col span={8}><Checkbox value="家庭因素">家庭因素</Checkbox></Col>
                    <Col span={8}><Checkbox value="上学进修">上学进修</Checkbox></Col>
                    <Col span={8}><Checkbox value="找到更好的工作">找到更好的工作</Checkbox></Col>
                    <Col span={8}><Checkbox value="自己经营生意">自己经营生意</Checkbox></Col>
                    <Col span={8}><Checkbox value="转行换业">转行换业</Checkbox></Col>
                    <Col span={8}><Checkbox value="其他">其他</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              )}
            </FormItem>
          </Col>
        </Row>
        {/*其他离职原因*/}
        <Row style={{ textAlign: 'center' }}>
          <Col >
            {/*其他离职原因*/}
            <FormItem label="其他离职原因" {...formItemLayout} >
              {getFieldDecorator('otherBreakupReason',{
                initialValue:'',
                rules: [
                  {
                    required: false,
                    message: '请描述离职的其他方面的原因'
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请描述离职的其他方面的原因。"
                  rows={4}
                  disabled={false}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        {/*离职去向*/}
        <Row style={{ textAlign: 'center' }}>
          <Col>
            {/*离职去向*/}
            <FormItem label="离职去向" {...formItemLayout} >
              {getFieldDecorator('departure',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '请告知离职去向！'
                  },
                ],
                })(
                <TextArea
                style={{ minHeight: 32 }}
                placeholder="请告知离职去向！"
                rows={4}
                disabled={false}
              />
              )}
            </FormItem>
          </Col>
        </Row>
        {/*您对部门的建议*/}
        <Row style={{ textAlign: 'center' }}>
          <Col >
            {/*您对部门的建议*/}
            <FormItem label="您对部门的建议" {...formItemLayout} >
              {getFieldDecorator('toDeptAdvice',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '企业文化、工作环境、内部人际关系等方面'
                  },
                ],
              })(
                <TextArea
                style={{ minHeight: 32 }}
                placeholder="您对部门在企业文化、工作环境、内部人际关系等方面的建议"
                rows={4}
                disabled={this.state.itemInfoFlag}
              />
              )}
            </FormItem>
          </Col>
        </Row>
        {/*您对公司的建议*/}
        <Row style={{ textAlign: 'center' }}>
          <Col>
            {/*您对公司的建议（企业文化、工作环境、内部人际关系等方面）*/}
            <FormItem label="您对公司的建议" {...formItemLayout} >
              {getFieldDecorator('toComAdvice',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '企业文化、工作环境、内部人际关系等方面'
                  },
                ],
              })(
                <TextArea
                style={{ minHeight: 32 }}
                placeholder="您对公司在企业文化、工作环境、内部人际关系等方面的建议"
                rows={4}
                disabled={false}
              />
              )}
            </FormItem>
          </Col>
        </Row>
        {/*申请人意见*/}
        <Row style={{ textAlign: 'center' }}>
          <Col>
            {/*申请人意见*/}
            <FormItem label="申请人意见" {...formItemLayout} >
              {getFieldDecorator('personAdvice',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '您有什么意见'
                  },
                ],
              })(
                <TextArea
                style={{ minHeight: 32 }}
                placeholder="您的个人意见"
                rows={4}
                disabled={false}
              />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.saveLeaveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
            <Modal
              title="流程处理"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div>
                <Form>
                  <FormItem label={'下一步环节'} {...formItemLayout}>
                        <Input style={inputstyle} value = {nextPostName} disabled={true}/>
                      </FormItem>
                      <FormItem label={'下一处理人'} {...formItemLayout}>
                        {getFieldDecorator('nextStepPerson',{
                          initialValue: initperson
                        })(
                          <Select size="large" width={"70%"} initialValue={initperson} placeholder="请选择下一环节处理人">
                            {nextdataList}
                          </Select>
                        )}
                      </FormItem>
                 </Form>
               </div>
            </Modal>
          </Col>
        </Row>
      </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.createLeaveModels,
    ...state.createLeaveModels,
  };
}

CreateLeave = Form.create()(CreateLeave);
export default connect(mapStateToProps)(CreateLeave)
