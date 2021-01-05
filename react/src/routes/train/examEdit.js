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

class examEdit extends Component{
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
  };

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
  selectNext = () =>{
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
    this.setState({ isSubmitClickable: false });
    let item = this.props.item;
    let updateclassinfo = {
      arg_plan_id:item.plan_id,
      arg_train_class_id: item.train_class_id,
      arg_nextstepPerson: this.props.form.getFieldValue("nextstepPerson"),

      arg_exam_name_update: this.props.form.getFieldValue("exam_name_update"),
      arg_exam_person_name_update: this.props.form.getFieldValue("exam_person_name_update"),
      arg_claim_fee_update: this.props.form.getFieldValue("claim_fee_update"),
      arg_exam_time_update: this.props.form.getFieldValue("exam_time_update"),
      arg_exam_fee_update: this.props.form.getFieldValue("exam_fee_update"),

      arg_offvalue: this.props.form.getFieldValue("offvalue_update"),
      arg_budgetvalue: this.props.form.getFieldValue("budgetvalue_update"),
      arg_reason: this.props.form.getFieldValue("change_reason_update"),

      // arg_offvalue: this.state.offvalue,
      // arg_budgetvalue: this.state.budgetvalue,
      // arg_reason: this.state.reason,

      arg_class_type: '4'
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

    const { getFieldDecorator } = this.props.form;
    const {item} = this.props;
    const { TextArea } = Input;

    const { nextPersonList} = this.props;
    let initperson = '';
    let nextdataList = '';
    if(nextPersonList.length){
      this.state.nextstep = nextPersonList[0].submit_post_name;
      initperson = nextPersonList[0].submit_user_id;
      nextdataList = nextPersonList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    };

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
        <Row span={2} style={{textAlign: 'center'}}><h2>认证考试计划调整审批表</h2></Row>
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
                          <FormItem label="认证考试名称" {...formItemLayoutProjName} >
                            {getFieldDecorator('exam_name_update', {
                              rules: [{
                                required: true,
                                message: '认证考试名称是必填项',
                                whitespace: true
                              }],
                              initialValue: item.class_name? item.class_name : ""
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
                          <FormItem label="考试人员" {...formItemLayout} >
                            {getFieldDecorator('exam_person_name_update', {
                              rules: [{
                                required: true,
                                message: '考试人员是必填项'
                              }],
                              initialValue: 'exam_person_name' in item ? item.exam_person_name : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'20'}
                                placeholder={'最多可输入20字'}
                                disabled = {false}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="报销标准" {...formItemLayout} >
                            {getFieldDecorator('claim_fee_update', {
                              rules: [{
                                required: true,
                                message: '报销标准是必填项',
                              }],
                              initialValue: 'claim_fee' in item ? item.claim_fee : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'820'}
                                placeholder={'最多可输入20字'}
                                disabled = {false}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="考试年份" {...formItemLayout} >
                            {getFieldDecorator('exam_year_update', {
                              rules: [{
                                required: true,
                                message: '考试年份是必填项'
                              }],
                              initialValue: item.train_year ? item.train_year : ""
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
                          <FormItem label="考试时间" {...formItemLayout} >
                            {getFieldDecorator('exam_time_update', {
                              rules: [{
                                required: true,
                                message: '考试时间是必填项',
                              }],
                              initialValue: item.train_time ? item.train_time : ""
                            })
                            (
                              <TextArea
                                style={inputstyle}
                                rows={1}
                                maxLength={'820'}
                                placeholder={'最多可输入20字'}
                                disabled = {false}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" {...FormItemCol.preCol}>
                          <FormItem label="考试费用预算" {...formItemLayout} >
                            {getFieldDecorator('exam_fee_update', {
                              rules: [{
                                required: true,
                                message: '考试费用预算是必填项,请填写正确格式（整数或者最多2位小数）的培训费用预算（元）',
                                pattern:/^([1-9][0-9]*)+(.[0-9]{1，2})?$/
                              }],
                              initialValue: item.train_fee ? item.train_fee : ""
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
                  <Input style={{color:'#000'}} value = {this.state.nextstep} disabled={true}/>
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


/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * @param state 状态树
 */
function mapStateToProps(state) {

  return {
    loading: state.loading.models.train_do_model,
    ...state.train_do_model
  };
}
examEdit = Form.create()(examEdit);
export default connect(mapStateToProps)(examEdit)
