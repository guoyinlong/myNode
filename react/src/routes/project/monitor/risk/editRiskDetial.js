/**
 *  作者: 胡月
 *  创建日期: 2017-9-25
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：实现编辑风险的功能
 */
import React from 'react';
import { Row, Col, Form, Icon, Input, Button, DatePicker, Spin , Select, Tooltip } from 'antd';
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
 *  功能：实现展示风险详情的功能
 */
class editRiskDetial extends React.Component {
  constructor(props) {
    super(props)
  }

  /*state = {
      riskState:'',     //风险状态，用于控制“实际解决日期”，状态为关闭时才是必填
  };
  componentDidMount(){
      this.setState({
          riskState:this.props.list.state,     //风险状态，用于控制“实际解决日期”，状态为关闭时才是必填
      });
  }*/



 //编辑风险，调用editRisk方法，跳转到风险列表页面
  editRiskRes = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }else {
        const plan_time = values.plan_time.format(dateFormat);
        const resolve_time = values.resolve_time !== undefined && values.resolve_time !== null
                             ? values.resolve_time.format(dateFormat) : '';
        const recog_date = values.recog_date.format(dateFormat);
        const update_id = Cookie.get('userid');
        const update_name = Cookie.get('username');
        //const staff_id = "0000000";
        //let riskParams = [];
        let riskParams = {
            arg_id: this.props.id,
            arg_risk: values.risk,
            arg_staff_id: "0000000",
            arg_staff_name: values.staff_name,
            arg_category: values.category,
            arg_state: values.state,
            arg_props: values.props,           //风险发生率
            arg_range: values.range,
            arg_recog_date: recog_date,
            arg_plan_time: plan_time,
            arg_resolve_time: resolve_time,
            arg_range_desc: values.range_desc,
            arg_track_progress: values.track_progress,
            arg_measure: values.measure,
            arg_update_id: update_id,
            arg_update_name: update_name,
        };

        //console.log(objParam);
        /*if (resolve_time !== '') {
            objParam.update.resolve_time = resolve_time;
        }*/
        //riskParams.push(objParam);
        const {dispatch} = this.props;
        dispatch({
          type: 'projRiskList/editRisk',
          riskParams,
        });
      }
    })
  };

//返回项目风险列表
  goBack=()=>{
    history.go(-1);
  };

    setSelectValue = (key,obj) => {
        this.props.dispatch({
            type: 'projRiskList/setSelectValue',
            obj,
            key,
        });
    };

  render() {
    const {list,proj_name,mgr_name,dept_name} = this.props;
    const { TextArea } = Input;
    //判断是否必填项
    const {getFieldDecorator} = this.props.form;
    const FormItemCol = {
      preCol: {span: 18},
      midCol: {span: 12},
      latCol: {span: 6}
    };
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
      <Spin tip={'处理中…'} spinning={this.props.editRiskSpin}>
        <div className={styles.whiteBack}>
          <div><p className={styles.title}>{proj_name}</p></div>
          <div style={{textAlign:'center'}}><Icon style={{marginTop:'10px',marginBottom:'5px'}}
                                                  type="user"/>项目经理：{mgr_name}
            <Icon style={{marginLeft:'50px',marginBottom:'10px'}} type="home"/>主责部门：{dept_name}</div>
          <div className={styles.bookTitle}>风险跟踪编辑</div>
          <div style={{marginRight:'50px'}}>
            <Form onSubmit={this.handleSubmit}>
              <Row >
                <Col  {...FormItemCol.preCol}>
                  <FormItem label="风险项" {...formItemLayoutOne}>
                    {getFieldDecorator('risk', {
                      rules: [{
                        required: true,
                        message: '风险项是必填项'
                      }],
                      initialValue: list.risk
                    })
                    (<Input placeholder='最多可输入96字' maxLength={'96'}/>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol} >
                  <FormItem label="责任人" {...formItemLayoutTwo}>
                    {getFieldDecorator('staff_name', {
                      rules: [{
                        required: true,
                        message: '责任人是必填项'
                      }],
                      initialValue: list.staff_name
                    })
                    (<Input placeholder='最多可输入20字' maxLength={'20'}/>)}
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
                      initialValue: list.category
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
                      initialValue: list.state
                    })
                    (<Select onSelect={(key)=>this.setSelectValue(key,'riskState')}>
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
                      initialValue: list.props
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
                      initialValue: list.range
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
                      initialValue: list.recog_date ? moment(list.recog_date):null
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
                      initialValue: list.plan_time ? moment(list.plan_time):null
                    })
                    (<DatePicker style={{ width: '100%'}}/>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.latCol}>
                  <FormItem label="实际解决日期" {...formItemLayoutTwo}>
                    {getFieldDecorator('resolve_time', {
                      rules: [{
                        required: this.props.riskState === '4',   //状态关闭才是必填
                        message: '状态关闭时，实际解决日期是必填项'
                      }],
                      initialValue: list.resolve_time ? moment(list.resolve_time):null
                    })
                    (<DatePicker style={{ width: '100%'}}/>)}
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col  {...FormItemCol.midCol}>
                  <FormItem label="影响范围描述" {...formItemLayoutThree}  >
                    {getFieldDecorator('range_desc', {
                      initialValue: list.range_desc
                    })
                    (<TextArea rows={2} placeholder='最多可输入255字' maxLength={'255'}/>)}
                  </FormItem>
                </Col>
                <Col  {...FormItemCol.midCol}>
                  <FormItem label="跟踪进展情况" {...formItemLayoutThree}  >
                    {getFieldDecorator('track_progress', {
                      initialValue: list.track_progress
                    })
                    (<TextArea rows={2} placeholder='最多可输入2000字' maxLength={'2000'}/>)}
                  </FormItem>
                </Col>
              </Row>

              <Row >
                <Col  >
                  <FormItem label="缓解措施" {...formItemLayoutFour}>
                    {getFieldDecorator('measure', {
                      rules: [{
                        required: true,
                        message: '缓解措施是必填项'
                      }],
                      initialValue: list.measure
                    })
                    (<TextArea rows={2} placeholder='最多可输入96字' maxLength={'96'}/>)}
                  </FormItem>
                </Col>
              </Row>
              <FormItem style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" onClick={this.editRiskRes}>确定</Button>
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

export default connect(mapStateToProps)(Form.create()(editRiskDetial));

