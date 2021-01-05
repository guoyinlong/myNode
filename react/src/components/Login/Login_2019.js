/**
 * 作者：薛刚
 * 日期：2019-01-22
 * 邮箱：xueg@chinaunicom.cn
 * 功能：2019春节特辑登录页面
 */
import React from 'react';
import { Row, Col, Form, Input, Icon, Button }from 'antd';
import config from '../../utils/config';
import styles from './Login_2019.less';
import LoginFormForgot from './LoginFormForgot';
import md5 from 'md5';
import CryptoJS from 'crypto-js'

const FormItem = Form.Item;
class Login_2019 extends React.Component {

  constructor (props) {
      super(props);
      this.state = {
          verify: config.loginConfig.CaptchaAddress + '?' + (Math.random() * 100000).toFixed(0),
          visible: false
      }
  }
  handleLoginClick = (e) => {
    e.preventDefault();
    const that = this;
    const { validateFieldsAndScroll,setFieldsValue } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      // console.log('用户名: '+ values.argusername)
      // console.log('密码: '+ values.arguserpass)
      // console.log('密钥（用户名md5加密后）: '+ md5(values.argusername))
      const keys = CryptoJS.enc.Utf8.parse(md5(values.argusername)); //密钥
      
      // 判断是否使用的aes加密，传'1'则是aes加密
      values.arguseaes = '1';
      // console.log('判断密码加密参数: '+ values.arguseaes)

      // 先md5加密
      values.arguserpass = md5(values.arguserpass);
      // console.log('密码md5加密后: '+ values.arguserpass);
      
      // 再AES加密
      values.arguserpass = CryptoJS.enc.Utf8.parse(values.arguserpass);
      values.arguserpass = CryptoJS.AES.encrypt(values.arguserpass, keys, { iv:'', mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
      values.arguserpass = values.arguserpass.toString();
      // console.log('md5: '+ values.arguserpass);
      // console.log('密码AES加密后: '+ values.arguserpass);
      this.props.onOk(values,that.changeVerify);
      setFieldsValue({ 'idcode': '' });
      //that.changeVerify();
    });
  }

  changeVerify = () => {
      this.setState({
          verify: config.loginConfig.CaptchaAddress + '?' + (Math.random() * 100000).toFixed(0),
      })
  }
  onForgotClick = () => {
      this.props.dispatch({
          type:'app/setModalVisible',
          modalType: 'forgetPwdVisible',
          visible: true
      });
  }

  onModalOk = (data) => {
      this.props.onFormResetOk(data);
      //this.onModalCancel();
  }

  onModalCancel = () => {
      this.props.dispatch({
          type:'app/setModalVisible',
          modalType: 'forgetPwdVisible',
          visible: false
      });
      /*this.setState({
          visible: false,
      });*/
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { user } = this.props;
    return (
        <div className={styles['login-page']}>
          <Row style={{ marginTop: '7%' }}>
            <Col span={5}></Col>
            <Col span={10}>
              <div className={styles["login-logo"]}>
                <img src={config.login_2019_logo} alt="logo"/>
              </div>
            </Col>
            <Col span={9}></Col>
          </Row>
          <Row>
            <Col span={3}></Col>
            <Col span={12}>
              <div className={styles["login-word"]}>
                {
                  window.location.hash === "#/login/prjAdminLogin" ? <h1>项目制管理平台</h1> : <h1>联通软件研究院</h1>
                }
                <div style={{ textAlign: 'center'}}>
                  <div className={styles["login-word-box"]}>结果导向</div>
                  <div className={styles["login-word-box"]}>以终为始</div>
                  <div className={styles["login-word-box"]}>业绩承诺</div>
                  <div className={styles["login-word-box"]}>言出必践</div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles["login-box"]}>
                <div className={styles['login-box-body']}>
                  <p className={styles['login-box-msg']}>账户登录</p>
                  <Form layout="vertical" onSubmit={this.handleLoginClick}>
                    <FormItem>
                      {getFieldDecorator('argtenantid', {'initialValue':10010})(
                        <Input type="hidden"/>
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('argusername', {
                        rules: [{ required: true, message: '请输入账号' }],
                        initialValue:user
                      })(
                        <Input size="large" addonBefore={<Icon type="yonghuming"/>} placeholder="账号" readOnly = {user === '' ? '' : 'readonly'}/>
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('arguserpass', {
                        rules: [{ required: true, message: '请输入密码' }],
                      })(
                        <Input size="large" addonBefore={<Icon type="mima"/>} type="password" placeholder="密码"/>
                      )}
                    </FormItem>
                    <Row gutter={8}>
                      <Col span={12}>
                        <FormItem>
                          {getFieldDecorator('idcode', {
                            rules: [{ required: true, message: '请输入验证码' }],
                          })(
                            <Input size="large" addonBefore={<Icon type="yanzhengma"/>} type="text" placeholder="验证码"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <img src={this.state.verify} alt="验证码" onClick={this.changeVerify}/>
                      </Col>
                    </Row>
                    <Button type="primary" htmlType="submit" className={styles["login-form-button"]} onClick={this.handleLoginClick} loading={this.props.loading} >
                      登录
                    </Button>
                    <div style={{marginTop:20}}>
                      <a onClick={this.onForgotClick}>忘记密码</a>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
            <Col span={8}></Col>
          </Row>
          <LoginFormForgot
            forgetPwdVisible={this.props.forgetPwdVisible}
            forgetVerifyCode={this.props.forgetVerifyCode}
            key={this.props.loginFormForgotKey}
            dispatch={this.props.dispatch}
            onModalOk={this.onModalOk}
            onModalCancel={this.onModalCancel}
            />
        </div>
    )
  }
}
export default Form.create()(Login_2019);
