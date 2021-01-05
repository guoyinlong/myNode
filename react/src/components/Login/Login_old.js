/**
 * 作者：任华维
 * 日期：2017-08-20
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：旧版登录（留作备份）
 */
import React from 'react';
import { Row, Col, Form, Input, Icon, Button, Modal, Select}from 'antd';
import styles from './Login.less';
import config from '../../utils/config';
import moment from 'moment';
import md5 from 'md5';
const FormItem = Form.Item;
const Option = Select.Option;
class Login extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      time: null,
      date: null,
      visible: false
    }
  }
  interval = null;
  handleLoginClick = (e) => {
    e.preventDefault();
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      values.arguserpass = md5(values.arguserpass);
      this.props.onOk(values);
    });
  }
  handleResetClick = (e) => {
    this.setState({
      visible: true,
    });
  }

  handleModalOk = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            //this.props.onResetOk({arg_email:values.arg_email+'@chinaunicom.cn',arg_userType:values.arg_userType});
            this.handleModalCancel(e);
        }
      });
  }
  handleModalCancel = (e) => {
      this.props.form.resetFields();
      this.setState({
        visible: false,
      });
  }
  getTimeState() {
    return {
      time: moment().format('hh:mm:ss'),
      date: moment().format('YYYY-MM-DD')
    };
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.goBack();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.setState(this.getTimeState());
    this.interval = setInterval(() => {
      this.setState(this.getTimeState());
    }, 500);
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const { user } = this.props;
    const profile = localStorage.getItem('userProfile') || config.logoSrc;
    return (

      <div className={styles['login-page']}>
          <Modal
            title="密码重置"
            visible={this.state.visible}
            onCancel={this.handleModalCancel}
            footer={[
                <Button key="submit" type="primary" size="large" onClick={this.handleModalOk}>
                  确定
                </Button>,
            ]}
          >
              <Form onSubmit={this.handleModalOk} className="login-form-forgot">
                <FormItem label="类型" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                  {getFieldDecorator('arg_userType', {
                    initialValue:'1'
                  })(
                    <Select>
                      <Option value="1">公司用户</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label='邮箱' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
                    {getFieldDecorator('arg_email', {
                        rules: [{ required: true, message: '请输入正确的用户名!' }],
                    })(
                        <Input addonAfter="@chinaunicom.cn" style={{ width: '100%' }} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={{'display':'none'}}> 确定 </Button>
                </FormItem>
              </Form>
          </Modal>
        <Row>
          <Col xs={{ span: 20, offset: 2 }}
               sm={{ span: 16, offset: 4 }}
               md={{ span: 12, offset: 6 }}>
            <div className={styles["login-box"]}>
              <h1 style={{color: '#fff', fontSize: 81, fontWeight: 300}}>联通软件研究院</h1>

            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 20, offset: 2 }}
               sm={{ span: 16, offset: 4 }}
               md={{ span: 12, offset: 6 }}>
            <div className={styles["login-box"]}>
                <Form layout="inline" onSubmit={this.handleLoginClick}>
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
                  <img src={user==='' ?config.loginConfig.logoBackground : profile} width='128' height='128' />
                  </a>
                  <FormItem className={styles["login-password"]}>
                    {getFieldDecorator('arguserpass', {})(
                      <Input type="password" placeholder="密码"/>
                    )}
                  </FormItem>
                  <FormItem>
                    <Button htmlType="submit" style={{'display':'none'}}>提交</Button>
                  </FormItem>

                  <FormItem>
                    <a className={styles["login-reset"]} onClick={this.handleResetClick}>忘记密码</a>
                  </FormItem>
                </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 20, offset: 2 }}
               sm={{ span: 16, offset: 4 }}
               md={{ span: 12, offset: 6 }}>
            <div className={styles["login-box"]}>
              <h1 style={{color: '#fff', fontSize: 81, fontWeight: 300}}>{this.state.time}</h1>
              <h6 style={{color: '#fff'}}>{this.state.date}</h6>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create()(Login);
