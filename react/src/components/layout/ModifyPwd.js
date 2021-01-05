/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户修改密码
 */
import React, { Component } from 'react';
import {Modal, Form, Icon, Input, Button } from 'antd';
import md5 from 'md5';
import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import styles from '../../themes/main.less'
const FormItem = Form.Item;



/**
 * 加密
 * @param word
 * @returns {*}
 */
function encrypt(word,key){
  let secretKey = CryptoJS.enc.Utf8.parse(key);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, secretKey, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return encrypted.toString();
}


/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：修改密码组件
 */
class ModifyPwd extends Component {
    constructor (props) {
        super(props);
        this.state = {
            typeInput:'password',
            typeIcon:'eye'
        }
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：提交
     * @param event
     */
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const optTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const tokenId = Cookie.get('token');
          const keyWords = tokenId.substring(0,6) + 'zk7grk' + optTime.substring(5,10).split('-').join('');   //秘钥
          values.arg_newpwd = encrypt(values.arg_newpwd, keyWords);
          values.arg_oldpwd = encrypt(values.arg_oldpwd, keyWords);
          values.arg_newpwd_again = encrypt(values.arg_newpwd_again, keyWords);
          values.arg_opttime = optTime;
          values.arg_tokenid = tokenId;
          this.props.modifyPasswordOk(values);
        }
      });
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：密码验证
     * @param 规则
     * @param 值
     * @param 回调
     */
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('arg_newpwd')) {
            callback('两次密码输入必须相同!');
        } else {
            callback();
        }
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：密码可视
     * @param event
     */
    switchPassword = (e) => {
        if (this.state.typeInput === "password") {
            this.setState({typeInput:'text',typeIcon:'eye-o'});
        } else {
            this.setState({typeInput:'password',typeIcon:'eye'});
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { modifyPwdVisible,modifyPasswordCancel} = this.props;
        const staff_id = Cookie.get('staff_id');
        return (
            <Modal
                title="修改密码"
                visible={modifyPwdVisible}
                onOk={this.handleSubmit}
                onCancel={modifyPasswordCancel}
                >
                <Form onSubmit={this.handleSubmit} className="modifyPwd-form">
                  <FormItem label="旧密码" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('arg_oldpwd', {
                      rules: [{ required: true, message: '请输入原始密码!' }],
                    })(
                      <Input type={this.state.typeInput} suffix={<Icon type={this.state.typeIcon} style={{ fontSize: 16 , cursor:'pointer'}} onClick={this.switchPassword}/>}/>
                    )}
                  </FormItem>
                  <FormItem label="新密码" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('arg_newpwd', {
                      rules: [{
                                required: true, message: '请输入新密码!'
                            },{
                                pattern: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/, message: '匹配规则：至少一个大写字母、小写字母、特殊字符(#?!@$%^&*-)，至少8位!'
                            }],
                    })(
                      <Input type={this.state.typeInput} suffix={<Icon type={this.state.typeIcon} style={{ fontSize: 16 , cursor:'pointer'}} onClick={this.switchPassword} />}/>
                    )}
                  </FormItem>
                  <FormItem label="确认密码" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('arg_newpwd_again', {
                      rules: [{ required: true, message: '请确认新密码!' },{
                          validator: this.checkPassword,
                      }],
                    })(
                      <Input type={this.state.typeInput} suffix={<Icon type={this.state.typeIcon} style={{ fontSize: 16 , cursor:'pointer'}} onClick={this.switchPassword} />}/>
                    )}
                  </FormItem>
                  <FormItem style={{display:'none'}}>
                    {getFieldDecorator('arg_userid', {
                      rules: [{ required: true}],
                      initialValue:staff_id
                    })(
                      <Input type="hidden" />
                    )}
                  </FormItem>
                  <FormItem style={{display:'none'}}>
                    {getFieldDecorator('arg_usertype', {
                      rules: [{ required: true}],
                      initialValue:1
                    })(
                      <Input type="hidden" />
                    )}
                  </FormItem>
                  <FormItem style={{display:'none'}}>
                    <Button type="primary" htmlType="submit">提交</Button>
                  </FormItem>
                </Form>
            </Modal>
        )
    }

};

export default Form.create()(ModifyPwd);
