/**
 *  作者: 胡月
 *  创建日期: 2017-9-10
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：实现添加风险的功能
 */
import React from 'react';
import { Row, Col, Form, Icon, Input, Button, DatePicker, Spin, Select,Tooltip } from 'antd';
import styles from './projRisk.less'
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {propsText,rangeText} from './riskConst.js';
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;

/**
 *  作者: 胡月
 *  创建日期: 2017-9-10
 *  功能：实现添加添加风险的功能
 */
class addRiskDetial extends React.Component {

  //转化uuid
  uuid = (len, radix)=> {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  };

//开始时间将锁定
  disabledStartDate = (value) => {
    const form = this.props.form;
    const endValue = form.getFieldValue('recog_date');
    if (!value || !endValue) {
      return false;
    }
    return value.valueOf() > endValue.valueOf();
  };

//结束时间将锁定
  disabledEndDate = (value) => {
    const form = this.props.form;
    const startValue = form.getFieldValue('plan_time');
    if (!value || !startValue) {
      return false;
    }
    return value.valueOf() <= startValue.valueOf();
  };

  //增加风险，调用addRisk，然后跳转到风险列表页面
  addRiskRes = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }else{
      const plan_time = moment(values.plan_time._d).format(dateFormat);
      const recog_date = moment(values.recog_date._d).format(dateFormat);
      const create_id = Cookie.get('userid');
      const create_name = Cookie.get('username');
      const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
      const risk_uid = this.uuid(32, 62);
      const staff_id = "0000000";

      let riskParams = [];
      riskParams.push({
        "risk": values.risk,
        "staff_name": values.staff_name,
        "staff_id": staff_id,
        "category": values.category,
        "state": values.state,
        "props": values.props,
        "range": values.range,
        "recog_date": recog_date,
        "plan_time": plan_time,
        "range_desc": values.range_desc,
        "measure": values.measure,
        "track_progress": values.track_progress,
        "resolve_time": null,
        "proj_id": this.props.proj_id,
        "risk_uid": risk_uid,
        "create_id": create_id,
        "create_name": create_name,
        "create_time": create_time
      });
      const {dispatch} = this.props;
      dispatch({
        type: 'projRiskList/addRisk',
        riskParams,
      });
      }
    })
  };

  //返回项目风险列表
  goBack=()=>{
    history.go(-1);
  };

  render() {
    const {proj_name,mgr_name,dept_name } = this.props;
    const { TextArea } = Input;
    //判断是否必填项
    const {getFieldDecorator } = this.props.form;
    const FormItemCol = {
      preCol: {span: 18},
      midCol: {span: 12},
      latCol: {span: 6}
    };
    //24列分配情况
    const formItemLayoutOne = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    const formItemLayoutTwo = {
      labelCol: {span: 12},
      wrapperCol: {span: 12},
    };
    const formItemLayoutThree = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const formItemLayoutFour = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };

    return (
      <Spin tip={'处理中…'} spinning={this.props.addRiskSpin}>
        <div className={styles.whiteBack}>
          <div><p className={styles.title}>{proj_name}</p></div>
          <div style={{textAlign:'center'}}>
            <Icon style={{marginTop:'10px',marginBottom:'5px'}} type="user"/>项目经理：{mgr_name}
            <Icon style={{marginLeft:'50px',marginBottom:'10px'}} type="home"/>主责部门：{dept_name}</div>
          <div className={styles.bookTitle}>风险跟踪新增</div>
          <div style={{marginRight:'50px'}}>
            <Form onSubmit={this.handleSubmit}>
              <Row >
                <Col  {...FormItemCol.preCol}>
                  <FormItem label="风险项" {...formItemLayoutOne} >
                    {getFieldDecorator('risk', {
                      rules: [{
                        required: true,
                        message: '风险项是必填项'
                      }],
                    })
                    (<Input     />)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol} >
                  <FormItem label="责任人" {...formItemLayoutTwo}>
                    {getFieldDecorator('staff_name', {
                      rules: [{
                        required: true,
                        message: '责任人是必填项'
                      }],
                    })
                    (<Input     />)}
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="风险类别" {...formItemLayoutTwo}>
                    {getFieldDecorator('category', {
                      rules: [{
                        required: true,
                        message: '风险类别是必选项'
                      }],
                    })
                    (<Select>
                      <Select.Option value="1">管理</Select.Option>
                      <Select.Option value="2">技术</Select.Option>
                      <Select.Option value="3">商业</Select.Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="风险状态" {...formItemLayoutTwo}>
                    {getFieldDecorator('state', {
                      rules: [{
                        required: true,
                        message: '风险状态是必选项'
                      }],
                    })
                    (<Select>
                      <Select.Option value="1">识别</Select.Option>
                      <Select.Option value="2">预防</Select.Option>
                      <Select.Option value="3">转为问题</Select.Option>
                      <Select.Option value="4">关闭</Select.Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="发生概率" {...formItemLayoutTwo}>
                    {getFieldDecorator('props', {
                      rules: [{
                        required: true,
                        message: '发生概率是必选项'
                      }],
                    })
                    (<Select>
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                      <Select.Option value="4">4</Select.Option>
                      <Select.Option value="5">5</Select.Option>
                    </Select>)}
                    <Tooltip placement="left" title={propsText}>
                      <Icon type="question-circle" style={{ position:'absolute',top:8,right:-20,
                        fontSize: 16, color: '#08c' ,zIndex:'999'}}/>
                    </Tooltip>
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="影响范围" {...formItemLayoutTwo}>
                    {getFieldDecorator('range', {
                      rules: [{
                        required: true,
                        message: '影响范围是必选项'
                      }],
                    })
                    (<Select>
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                      <Select.Option value="4">4</Select.Option>
                      <Select.Option value="5">5</Select.Option>
                    </Select>)}
                    <Tooltip placement="left" title={rangeText}>
                      <Icon type="question-circle" style={{position:'absolute',top:8,right:-20,
                        fontSize: 16, color: '#08c' }}/>
                    </Tooltip>
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="识别日期" {...formItemLayoutTwo}>
                    {getFieldDecorator('recog_date', {
                      rules: [{
                        required: true,
                        message: '识别日期是必填项'
                      }],
                    })
                    (<DatePicker style={{ width: '100%'}}/>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="计划解决日期" {...formItemLayoutTwo}>
                    {getFieldDecorator('plan_time', {
                      rules: [{
                        required: true,
                        message: '计划解决日期是必填项'
                      }],
                    })
                    (<DatePicker style={{ width: '100%'}}/>)}
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col  {...FormItemCol.midCol}>
                  <FormItem label="影响范围描述" {...formItemLayoutThree}  >
                    {getFieldDecorator('range_desc', {})
                    (<TextArea rows={2}/>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.midCol}>
                  <FormItem label="跟踪进展情况" {...formItemLayoutThree}  >
                    {getFieldDecorator('track_progress', {})
                    (<TextArea rows={2}/>)}
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col >
                  <FormItem label="缓解措施" {...formItemLayoutFour}>
                    {getFieldDecorator('measure', {
                      rules: [{
                        required: true,
                        message: '缓解措施是必填项'
                      }],
                    })
                    (<TextArea rows={2}/>)}
                  </FormItem>
                </Col>
              </Row>
              <FormItem style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" onClick={this.addRiskRes}>确定</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.goBack}>返回</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {

    return {
      loading: state.loading.models.projRiskList,
      ...state.projRiskList
    };
}
export default connect(mapStateToProps)(Form.create()(addRiskDetial));

