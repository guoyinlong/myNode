/**
 * 作者：郭西杰
 * 创建日期：2020-08-27 
 * 邮箱：guoxj116@chinaunicom.cn
 * 文件说明：人工成本管理：验证码进入
 */
import React, { Component } from 'react';
import { message } from 'antd';
import { connect } from "dva";
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { routerRedux } from "dva/router";
moment.locale('zh-cn');
import { Select, DatePicker, Form, Input, Tabs, Button } from 'antd';
const FormItem = Form.Item;
import styles from './verify.less';

class costVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      user_id: Cookie.get("userid"),
      email: Cookie.get("email"),
      user_name: Cookie.get("username"),
      btnText: '发送验证码',
      btnBool: false,
    };
  //  this.SendVerCode = this.SendVerCode.bind(this);
  };
  // 验证码验证
  VerifyCode = () => {
    let arg_param = {};
      arg_param['arg_email'] = this.state.email;
      arg_param['arg_user_id'] = this.state.user_id;
      arg_param['arg_module_type'] = '0';
      const { dispatch } = this.props;
      let checkVerifyCode = this.props.form.getFieldValue("verify_code")
      return new Promise((resolve) => {
        dispatch({
          type: 'costVerifyModel/queryVerifyCode',
          arg_param: arg_param,
          resolve
        });
      }).then((resolve) => {
        let VerifyCode = this.props.rand_code
        if (resolve === 'success') {
          if(checkVerifyCode === VerifyCode )
          {
            let query = {
              VerifyCode: VerifyCode,
            }
            const { dispatch } = this.props;
            dispatch(routerRedux.push({
              pathname: '/humanApp/costlabor/costVerify/costVerifyIndex',
              query
            }));
          }
          else{
            message.success('验证失败请输入正确的验证码')
          }
        }
      })
  }
  //发送短信验证码
  SendVerCode = () => {
    let maxTime = '60'
   this.timer = setInterval(() => {
        if (maxTime > '0') {
          --maxTime
          this.setState({
            btnText: '重新获取' + maxTime,
            btnBool: true
          })
        }
        else {
          this.setState({
            btnText: '发送验证码',
            btnBool: false
          })
          clearInterval(this.timer);
        }
      }, 1000)
      let arg_param = {};
      arg_param['arg_email'] = this.state.email;
      arg_param['arg_user_id'] = this.state.user_id;
      arg_param['arg_user_name'] = this.state.user_name;
      arg_param['arg_module_type'] = '0';
      const { dispatch } = this.props;
      dispatch({
        type: 'costVerifyModel/sentVerifyCode',
        arg_param: arg_param
      });
      message.success('已向邮箱 ' + this.state.email + ' 发送验证码，请注意查收。')
}
  render() {
    const { rand_code} = this.props;
    const {getFieldDecorator} = this.props.form;
    const editDisabled = true;

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 11
        }
      },
      style :{marginBottom:10,color:'#00000'}
    };
    return (
      <div className={styles.meetWrap}>
      <div className={styles.headerName}>{'人工成本登录验证'}</div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div  style={{width:600,margin:'0 auto',border:'2px solid',borderRadius:8,position:'relative'}}>
      <Form style={{marginTop:26,marginRight:30,}}>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('username',{
            initialValue:this.state.user_name})(<Input disabled={editDisabled} />)}
        </FormItem>
        <FormItem label="员工编号" {...formItemLayout} >
           {getFieldDecorator('staff_id',{
           initialValue:this.state.user_id})(<Input disabled={true}/>)}
        </FormItem>

        <FormItem label="邮箱" {...formItemLayout}>
          {getFieldDecorator('email',{
            initialValue:this.state.email})(<Input disabled={true}/>)}
        </FormItem>
        <FormItem label="验证码" {...formItemLayout}>
          {getFieldDecorator('verify_code')(<Input placeholder="请输入验证码" disabled={false}/>)}
        </FormItem>
        <br></br>
        <br></br>
          <div style={{marginLeft:200,marginBottom:10}}>
          <Button type='primary' onClick={this.SendVerCode} disabled={this.state.btnBool}>{this.state.btnText}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.VerifyCode}>{'确定'}</Button>
          </div>
          <br></br>
      </Form>
      </div>
    </div>
     
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.costVerifyModel,
    ...state.costVerifyModel
  };
}
costVerify = Form.create()(costVerify);
export default connect(mapStateToProps)(costVerify);

