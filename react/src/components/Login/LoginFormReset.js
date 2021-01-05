
/**
 * 作者：任华维
 * 日期：2017-08-20  
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：重置密码
 */
import React from 'react';
import { Row, Col, Form, Input, Icon, Button}from 'antd';
import styles from './Login.less';
import md5 from 'md5';
const FormItem = Form.Item;

/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：重置密码组件
 */
class LoginFormReset extends React.Component {
    constructor (props) {
      super(props);
    }

    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：表单提交
     * @param event
     */
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            values.arg_pwd = md5(values.arg_pwd);
            this.props.onFormResetOk(values);
        }
      });
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { email,tokenid} = this.props;
    return (
            <Form onSubmit={this.handleSubmit}  className="login-form-Reset">
            <FormItem>
              {getFieldDecorator('arg_email', {
                rules: [{ required: true}],
                initialValue:email
              })(
                <Input type="hidden"/>
              )}
            </FormItem>
            <FormItem label="新密码" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('arg_pwd', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input type="password"/>
              )}
            </FormItem>
            <FormItem label="确认密码" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
              {getFieldDecorator('arg_pwd_again', {
                rules: [{ required: true, message: '请确认密码' }],
              })(
                <Input type="password"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('arg_tokenid', {
                rules: [{ required: true}],
                initialValue:tokenid
              })(
                <Input type="hidden"/>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">提交</Button>
            </FormItem>
            </Form>
    );
  }
}

export default Form.create()(LoginFormReset);
