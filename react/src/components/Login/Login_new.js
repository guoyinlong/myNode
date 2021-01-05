/**
 * 作者：任华维
 * 日期：2018-02-28
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：登录带验证
 */
import React from 'react';
import { Row, Col, Form, Input, Icon, Button }from 'antd';
import config from '../../utils/config';
import styles from './Login_new.less';
import LoginFormForgot from './LoginFormForgot';
import md5 from 'md5';

const FormItem = Form.Item;
class Login extends React.Component {

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
            values.arguserpass = md5(values.arguserpass);
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
            <div className={styles['login-page']} style={{ backgroundImage: 'url(' + config.loginConfig.loginBackground + ')' }}>
                <Row>
                    <Col span={7}>
                        <div className={styles["login-logo"]}>
                            <img src={config.loginConfig.unicomLogo} alt="logo"/>
                        </div>
                    </Col>
                    <Col span={10}>
                        <div className={styles["login-word"]}>
                            <h1>联通软件研究院</h1>
                            <Row type="flex" justify="center">
                                <Col span={4} className={styles["login-word-box"]}>
                                    <div>结果导向</div>
                                </Col>
                                <Col span={4} className={styles["login-word-box"]}>
                                    <div>以终为始</div>
                                </Col>
                                <Col span={4} className={styles["login-word-box"]}>
                                    <div>业绩承诺</div>
                                </Col>
                                <Col span={4} className={styles["login-word-box"]}>
                                    <div>言出必践</div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={9} offset={15}>
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
export default Form.create()(Login);
