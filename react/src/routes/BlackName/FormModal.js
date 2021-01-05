/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：黑名单查询表单模块
 */
import React, { Component } from 'react';
import { Row, Col, Card, Form, Icon, Input, Button } from 'antd';
import ListModal from './ListModal';
import config from '../../utils/config';
const FormItem = Form.Item;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：查询组件
 */
class FormModal extends Component {
  constructor (props) {
    super(props);
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：表单验证
   */
  componentDidMount() {
    this.props.form.validateFields();
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：输入事件
   * @param event 默认输入事件
   */
  handleInput = (e) => {
    e.preventDefault();
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：查询提交
   * @param event 默认
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const { onOk } = this.props;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      this.props.form.resetFields();
      this.props.form.validateFields();
      onOk(values);
    });

  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：表单重置
   * @param event 表单默认事件
   */
  handleReset = (e) => {
    console.log(this.props);
    const { onClear } = this.props;
    onClear();
    this.props.form.resetFields();
    this.props.form.validateFields();
  }

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const userIDError = isFieldTouched('userID') && getFieldError('userID');
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const formTailLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 10, offset: 7 },
    };
    const formRailLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17},
    };
    const {formData} = this.props;
    return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label='身份证号码' validateStatus={userIDError ? 'error' : ''} help={userIDError || ''}>

            {getFieldDecorator('userID', {
              rules: [{
                required: true,
                min:18,
                max:18,

                message: '请输入正确的身份证号码'
              }],
            })(
              <Input onChange={this.handleInput.bind(this)} prefix={<Icon type="user"/>}/>
            )}
          </FormItem>
          <FormItem {...formTailLayout}>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
          </FormItem>
          <FormItem {...formRailLayout} label='查询结果' >
            <ListModal data={formData}/>
          </FormItem>
        </Form>
    );
  }
}

export default Form.create()(FormModal);
