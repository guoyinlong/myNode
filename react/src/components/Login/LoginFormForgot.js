/**
 * 作者：任华维
 * 日期：2017-08-20
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：忘记密码
 */
import React from 'react';
import {Row, Col, Form, Input, Icon, Button, Modal, Select} from 'antd';
import config from '../../utils/config';
import styles from './Login.less';
import Cookie from 'js-cookie';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：登录忘记密码组件
 */
class LoginFormForgot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleType: '1',
        }
    }


    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：表单提交
     * @param event
     */
    handleModalOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onModalOk({
                    arg_email: values.arg_email + (values.arg_userType === '1' ? '@chinaunicom.cn' : ''),
                    arg_userType: values.arg_userType,
                    idcode: values.idcode,
                    userlogin_identifycode: Cookie.get('userlogin_identifycode')
                });
            }
        });
        //this.changeVerifyCode();
    }

    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：关闭
     * @param event
     */
    handleModalCancel = (e) => {
        //this.props.form.resetFields();          //重置
        this.props.onModalCancel();
        //this.changeVerifyCode();
    }

    /*
  * 修改：李杰双
  * 说明：密码重置补全
  */
    emaileRules = (type) => {
        if (type === '1') {
            return [
                {
                    required: true,
                    message: '请输入正确的用户名',
                    whitespace: true
                }
            ]
        } else {
            return [
                {
                    type: 'email',
                    message: '请输入完整的邮箱',
                    whitespace: true
                },
                {
                    required: true,
                    message: '请输入完整的邮箱',
                    whitespace: true
                }
            ]
        }
    }
    typeHandle = (value) => {
        this.setState({
            peopleType: value
        });
        this.props.form.resetFields(['arg_email'])
    };

    changeVerifyCode = () => {
        this.props.dispatch({
            type:'app/changeVerifyCode',
        });
        /*this.setState({
            verifyCode: config.loginConfig.CaptchaAddress + '?' + (Math.random() * 100000).toFixed(0),
        })*/
    }

    render() {
        //const {visible} = this.props;
        const {getFieldDecorator} = this.props.form;

        //let type = getFieldValue('arg_userType')
        let { peopleType } = this.state;

        return (
            /*
            *         <Modal
                        title="密码重置"
                        wrapClassName="vertical-center-modal"
                        visible={visible}
                        onCancel={this.handleModalCancel}
                        footer={null}
                    >
                        <div>
                            <p style={{paddingBottom:14,textAlign:'center'}}>请联系管理员进行密码重置！</p>
                            <p style={{paddingBottom:14,textAlign:'center'}}>Email：lvdx6@chinaunicom.cn</p>
                        </div>
                    </Modal>
            * */
            <Modal
                title="密码重置"
                visible={this.props.forgetPwdVisible}
                onCancel={this.handleModalCancel}
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={this.handleModalOk}>
                        确定
                    </Button>,
                ]}
            >
                <Form onSubmit={this.handleModalOk} className="login-form-forgot">
                    <FormItem label="类型" labelCol={{span: 4}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('arg_userType', {
                            initialValue: '1'
                        })(
                            <Select onSelect={this.typeHandle}>
                                <Option value="1">公司用户</Option>
                                <Option value="6">外协人员</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='邮箱' labelCol={{span: 4}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('arg_email', {
                            initialValue: '',
                            rules: this.emaileRules(peopleType)
                        })(
                            <Input addonAfter={peopleType === '1' ? "@chinaunicom.cn" : null} style={{width: '100%'}}/>
                        )}
                    </FormItem>
                    <FormItem label='验证码' labelCol={{span: 4}} wrapperCol={{span: 12}}>
                        {getFieldDecorator('idcode', {
                            initialValue: '',
                            rules: [{
                                required: true,
                                message: '请输入验证码',
                                whitespace: true
                            }]
                        })(
                            <Input style={{width: '98%'}}/>
                        )}
                        <img
                            src={this.props.forgetVerifyCode}
                            alt="验证码"
                            onClick={this.changeVerifyCode}
                            style={{
                                position: 'absolute',
                                right: -121,
                                height: '33px',
                                width: '126px',
                                cursor: 'pointer',
                                zIndex: '999'
                            }}
                        />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" style={{'display': 'none'}}> 确定 </Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(LoginFormForgot);
