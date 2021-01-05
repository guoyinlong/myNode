
/**
 * 作者：任华维
 * 日期：2017-08-20  
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：登录表单
 */
import React from 'react';
import { Row, Col, Form, Input, Icon, Button}from 'antd';
import config from '../../utils/config';
import styles from './Login.less';
import md5 from 'md5';
const FormItem = Form.Item;

/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：表单组件
 */
class LoginForm extends React.Component {

  constructor (props) {
    super(props);
  }

  /**
   * 作者：任华维
   * 创建日期：2017-08-20
   * 功能：提交
   * @param event
   */
  handleLoginClick = (e) => {
    e.preventDefault();
    const { validateFieldsAndScroll,setFieldsValue,getFieldValue } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      setFieldsValue({
          times: (getFieldValue('times')+1)
      });
      values.arguserpass = md5(values.arguserpass);
      this.props.onLoginOk(values);
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { user, profile, isLoginFailed} = this.props;
    const suffix = this.props.form.getFieldValue('arguserpass') ?
        <Icon type="right-circle" onClick={this.handleLoginClick} style={{fontSize:20,color:'#317EF3',cursor:'pointer'}}/> : null;
    return (
        <Form layout="inline" onSubmit={this.handleLoginClick}>
          <FormItem>
            {getFieldDecorator('times', {'initialValue':1})(
              <Input type="hidden"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('argtenantid', {'initialValue':10010})(
              <Input type="hidden"/>
            )}
          </FormItem>
          <FormItem className={styles["login-username"]}>
            {getFieldDecorator('argusername', {'initialValue':user})(
              <Input placeholder="账号" readOnly = {user === '' ? '' : 'readonly'}/>
            )}
          </FormItem>
          <a className={styles["login-profile"]} onClick={this.handleLoginClick}>
            <img src={user==='' ?config.loginConfig.logoBackground : (profile ? profile : config.loginConfig.logoBackground)} width='128' height='128' />
          </a>
          <FormItem className={styles["login-password"]}>
            {getFieldDecorator('arguserpass', {})(
              <Input type="password" placeholder="密码" suffix={suffix}/>
            )}
            <a className={styles["login-forgot"]} style={{'display':(isLoginFailed ? '' : 'none')}} onClick={this.props.onForgotClick}>忘记密码</a>
          </FormItem>
          <FormItem>
            <Button htmlType="submit" style={{'display':'none'}}>提交</Button>
          </FormItem>
        </Form>
    )
  }
}

export default Form.create()(LoginForm);
