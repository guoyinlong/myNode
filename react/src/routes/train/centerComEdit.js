/**
 *  作者: 翟金亭
 *  创建日期: 2019-10-30
 *  邮箱：zhaijt3@chinaunicom.cn
 *  文件说明：必修课程调整界面
 */

import React,{ Component } from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Button, Tabs, Modal, Spin, Form, Select, Input, Row, Col, message } from 'antd';
import Cookie from 'js-cookie';
import styles from './trainPlanChange.less';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

class CenterComEdit extends Component{
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
      isSubmitClickable:true,
      isSaveClickable:true,
      offvalue:0,
      budgetvalue:0,
      reason:'调整原因',
      nextstep:'',
    }
  }

  //计划取消单选
  offChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      offvalue: e.target.value,
    });
  };
  //预算情况单选
  budgetChange = e =>{
    console.log('radio checked', e.target.value);
    this.setState({
      budgetvalue: e.target.value,
    });
  }

  //调整原因
  reasonChange = e =>{
    console.log('input', e.target.value);
    this.setState({
      reason: e.target.value
    });
  }

  //结束关闭
  goBack = () => {
    console.log("goBack===");
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/train/trainPlanList'
    }));
  }
  //提交对话框
  selectNext = (e) =>{
    if(this.props.form.getFieldValue("change_reason_update") === ''){
      message.error("请查看是否进行培训计划调整，如若已进行调整填写调整原因！");
      return;
    }else{
      this.setState({
        visible: true,
      });
    };
  }
  //提交弹窗
  handleOk = (e) => {

    let plan_id = Cookie.get('userid') + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);
    this.setState({ isSubmitClickable: false });
    let item = this.props.item;
    let updateclassinfo = {
      arg_plan_id:plan_id,
      arg_train_class_id: item.train_class_id,
      arg_nextstepPerson: this.props.form.getFieldValue("nextstepPerson"),
      arg_class_name_update: this.props.form.getFieldValue("class_name_update"),
      arg_train_level_update: this.props.form.getFieldValue("train_level_update"),
      arg_class_type_update: this.props.form.getFieldValue("class_type_update"),
      arg_train_hour_update: this.props.form.getFieldValue("train_hour_update"),
      arg_train_time_update: this.props.form.getFieldValue("train_time_update"),
      arg_assign_score_update: this.props.form.getFieldValue("assign_score_update"),

      arg_train_fee_update: this.props.form.getFieldValue("train_fee_update"),
      arg_dept_name_update: this.props.form.getFieldValue("dept_name_update"),

      arg_offvalue: this.props.form.getFieldValue("offvalue_update"),
      arg_budgetvalue: this.props.form.getFieldValue("budgetvalue_update"),
      arg_reason: this.props.form.getFieldValue("change_reason_update"),

      // arg_offvalue: this.state.offvalue,
      // arg_budgetvalue: this.state.budgetvalue,
      // arg_reason: this.state.reason,
      arg_class_type: '1'
    };
    this.setState({
      visible: false,
    });
    const{dispatch} = this.props;
    return new Promise((resolve) => {
      dispatch({
        type:'train_do_model/trainPlanUpdate',
        updateclassinfo,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/train/trainPlanList'}));
        },500);
      }
      if(resolve === 'false')
      {
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/train/trainPlanList'}));
    });
  }
  //取消弹窗
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render(){
    const inputstyle = {color:'#000'};
    const { TextArea } = Input;

    const { getFieldDecorator } = this.props.form;

    const {item} = this.props;
    const {deptInfoList} =  this.props;
    const { nextPersonList } = this.props;
    const {permission} = this.props;
    let initperson = '';
    let nextdataList = '';
    if(nextPersonList.length){
      this.state.nextstep = nextPersonList[0].submit_post_name;
      initperson = nextPersonList[0].submit_user_id;
      nextdataList = nextPersonList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    };

    const deptOptionList = deptInfoList.map((item) => {
      return (
        <Option key={item.deptid}>
          {item.deptname}
        </Option>
      )
    });

    const FormItemCol = {
      preCol: {span: 10},
      latCol: {span: 20}
    };
    const formItemLayout = {
        labelCol: {span: 10},
        wrapperCol: {span: 14},
    };
    const formItemLayoutProjName = {
        labelCol: {span: 4},
        wrapperCol: {span: 16},
    };

    const textItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
    };

    const formItemLayout_old = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 14 },
      },
      textAlign: 'center',
    };

    return(
      <Spin spinning={this.props.loading}>
        <p>
          当前申请环节：<span>申请</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          当前处理人：<span>{Cookie.get('username')}</span>
        </p>
        <Row span={2} style={{textAlign: 'center'}}><h2>总院培训计划调整审批表</h2></Row>
        <br/>
        <Row span={2} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            style={{marginRight: '10px'}}
            onClick={this.selectNext}
            disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}
          </Button>
          &nbsp;&nbsp;
          <Button
            type="primary"
            style={{marginRight: '10px'}}
            onClick={this.goBack}>取消
          </Button>
        </Row>
        <br/>

        <div style={{background: 'white', padding: '10px 10px 10px 10px'}}>
          <Tabs
            defaultActiveKey = 't1'
          >
            <TabPane tab="基本信息" key="t1">
              <div>
                <div className={styles.titleBox}>
                  <Form>
                    <div>
                      <div>
                        <div className={styles.titleOneStyles}> 基础信息 </div>
                      </div>
                      <Row>
                        <Col className="gutter-row" span={24}>
                          <FormItem label="课程名称" {...formItemLayoutProjName} >
                            {getFieldDecorator('class_name_update', {
                              rules: [{
                                required: true,
                                message: '课程名称是必填项',
                                whitespace: true
                              }],
                              initialValue: 'class_name' in item ? item.class_name : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'40'}
                                placeholder={'最多可输入40字'}
                                disabled = {true}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="培训级别" {...formItemLayout} >
                            {getFieldDecorator('train_level_update', {
                              rules: [{
                                required: true,
                                message: '培训级别是必填项'
                              }],
                              initialValue: 'train_level' in item ? item.train_level : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'20'}
                                placeholder={'最多可输入20字'}
                                disabled = {true}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="培训计划类型" {...formItemLayout} >
                            {getFieldDecorator('class_type_update', {
                              rules: [{
                                required: true,
                                message: '培训计划类型是必填项',
                              }],
                              initialValue: 'class_type' in item ? item.class_type : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'820'}
                                placeholder={'最多可输入20字'}
                                disabled = {true}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="培训时长" {...formItemLayout} >
                            {getFieldDecorator('train_hour_update', {
                              rules: [{
                                required: true,
                                message: '培训时长是必填项',
                              }],
                              initialValue: 'train_hour' in item ? item.train_hour : "0"
                            })
                            (
                              <TextArea
                                rows={1}
                                maxLength={'10'}
                                placeholder={'最多可输入10字'}
                                disabled = {false}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="培训年份" {...formItemLayout} >
                            {getFieldDecorator('train_year_update', {
                              rules: [{
                                required: true,
                                message: '培训年份是必选项'
                              }],
                              initialValue: 'train_year' in item ? item.train_year : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'80'}
                                placeholder={'最多可输入80字'}
                                disabled={true}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="培训季度" {...formItemLayout} >
                            {getFieldDecorator('train_time_update', {
                              rules: [{
                                required: true,
                                message: '培训季度是必选项'
                              }],
                              initialValue: 'train_time' in item ? item.train_time : ""
                            })
                            (
                              <Select
                                disabled={false}
                              >
                                <Option value="第一季度">第一季度</Option>
                                <Option value="第二季度">第二季度</Option>
                                <Option value="第三季度">第三季度</Option>
                                <Option value="第四季度">第四季度</Option>
                                <Option value="全年执行">全年执行</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="赋分规则" {...formItemLayout} >
                            {getFieldDecorator('assign_score_update', {
                              rules: [{
                                required: true,
                                message: '培训季度是必选项'
                              }],
                              initialValue: 'assign_score' in item ? item.assign_score : ""
                            })
                            (
                              <Select
                                disabled={false}
                              >
                                <Option value="单一赋分">单一赋分</Option>
                                <Option value="按课赋分">按课赋分</Option>
                                <Option value="按人岗匹配赋分">按人岗匹配赋分</Option>
                                <Option value="按天赋分">按天赋分</Option>
                                <Option value="按模块赋分">按模块赋分</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="培训预算" {...formItemLayout} >
                            {getFieldDecorator('train_fee_update', {
                              rules: [{
                                required: true,
                                message: '培训预算是必填项,请填写正确格式（整数或者最多2位小数）的培训费用预算（元）',
                                pattern:/^([1-9][0-9]*)+(.[0-9]{1，2})?$/
                              }],
                              initialValue: 'train_fee' in item ? item.train_fee : ""
                            })
                            (
                              <TextArea
                                rows={1}
                                maxLength={'80'}
                                placeholder={'最多可输入80字'}
                                disabled = {false}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="责任部门" {...formItemLayout} >
                            {getFieldDecorator('dept_name_update', {
                              rules: [{
                                required: true,
                                message: '责任部门是必选项'
                              }],
                              initialValue: item.dept_id ? item.dept_id : ""
                            })
                            (
                              <Select
                                placeholder='请选择部门'
                                disabled={permission==='2'?false:true}
                              >
                                {deptOptionList}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <div className={styles.titleTwoBox}>
                        <div className={styles.titleOneStyles}>
                          其他信息
                        </div>
                      </div>
                        <Row gutter={16}>
                          <Col className="gutter-row" {...FormItemCol.preCol}>
                            <FormItem label="计划是否取消" {...formItemLayout} >
                              {getFieldDecorator('offvalue_update', {
                                initialValue: 0
                              })
                              (
                                <Select >
                                  <Option value={0}>否</Option>
                                  <Option value={1}>是</Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col className="gutter-row" {...FormItemCol.preCol}>
                            <FormItem label="预算情况" {...formItemLayout} >
                              {getFieldDecorator('budgetvalue_update', {
                                initialValue: 0
                              })
                              (
                                <Select>
                                  <Option value={0}>未超预算</Option>
                                  <Option value={1}>超过预算</Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col className="gutter-row" {...FormItemCol.latCol}>
                            <FormItem label="调整原因" {...textItemLayout} >
                              {getFieldDecorator('change_reason_update', {
                                rules: [{
                                  required: true,
                                  message: '调整原因必填，填写调整原因,字数限制在200字以内',
                                }],
                                initialValue: ""
                              })
                              (
                                <TextArea
                                  rows={5}
                                  maxLength="200"
                                  onChange={this.reasonChange}
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                    </div>
                  </Form>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>

        <Modal
            title="流程处理"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <div>
              <Form>
                <FormItem label={'下一步环节'} {...formItemLayout_old}>
                  <Input style={inputstyle} value = {this.state.nextstep} disabled={true}/>
                </FormItem>
                <FormItem label={'下一处理人'} {...formItemLayout_old}>
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
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_do_model,
    ...state.train_do_model
  };
}
CenterComEdit = Form.create()(CenterComEdit);
export default connect(mapStateToProps)(CenterComEdit)
