/*
    @author:zhulei
    @date:2017/11/27
    @email:xiangzl3@chinaunicom.cn
    @description:GitLab-账户重置
*/


import React from 'react';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import styles from './basicInfo.less';
import Cookie from 'js-cookie';
import {connect} from 'dva';

const FormItem = Form.Item;

const auth_username = Cookie.get('loginname');

class passReset extends React.Component {
  /**
   * @author:  zhulei
   * @date: 2017/11/20
   * @description:初始化
   */

  constructor(props) {
    super(props);
  }

  /**
   * @author:  zhulei
   * @date: 2017/11/14
   * @description:提交给后台添加修改密码
   * @params all
   */
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        let arg_params = {};
        arg_params["arg_owner_user"] = auth_username;
        arg_params["arg_pass"] = values.pass;
        arg_params["arg_pass_confirm"] = values.pass_confirm;
        arg_params["arg_current_pass"] = values.current_pass;

        const {dispatch} = this.props;
        dispatch({
          type: 'passReset/submit',
          arg_param: arg_params
        });
      }
    })

  }

  /**
   * @author:  zhulei
   * @date: 2017/11/20
   * @description:重置密码属性
   * @param null
   */
  reset = () => {
    const form = this.props.form;
    form.setFieldsValue({pass: ""});
    form.setFieldsValue({pass_confirm: ""});
    form.setFieldsValue({current_pass: ""});
  };

  render() {

    //判断是否必填项
    const {getFieldDecorator} = this.props.form;

    //24列分配情况
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 18},
    };

    return (
      <div>

        <div className={styles.bookTitle}>密码重置</div>
        <div style={{marginRight: '50px'}}>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col>
                <FormItem label="旧密码" {...formItemLayout} >
                  {getFieldDecorator('current_pass', {
                    rules: [{
                      required: true,
                      message: '旧密码是必填项'
                    }],
                  })
                  (<Input/>)}
                </FormItem>
              </Col>
            </Row>

            <Row>
            <Col>
              <FormItem label="新密码" {...formItemLayout} >
                {getFieldDecorator('pass', {
                  rules: [{
                    required: true,
                    message: '新密码是必填项'
                  }],
                })
                (<Input/>)}
              </FormItem>
            </Col>
          </Row>
            <Row>
              <Col>
                <FormItem label="确认密码" {...formItemLayout} >
                  {getFieldDecorator('pass_confirm', {
                    rules: [{
                      required: true,
                      message: '确认密码是必填项'
                    }],
                  })
                  (<Input/>)}
                </FormItem>
              </Col>
            </Row>


            <FormItem style={{textAlign: 'center'}}>
              <Button type="primary" htmlType="submit" onClick={this.submit}>确定</Button>
              <Button style={{marginLeft: 8}} onClick={this.reset}>重置</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.passReset,
    ...state.passReset
  }
}

export default connect(mapStateToProps)(Form.create()(passReset));
