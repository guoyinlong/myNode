/*
    @author:zhulei
    @date:2017/11/14
    @email:xiangzl3@chinaunicom.cn
    @description:GitLab-项目新建
*/
import React from 'react';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import styles from './basicInfo.less';
import Cookie from 'js-cookie';
import {connect} from 'dva';

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

const auth_username = Cookie.get('loginname');

class projectBuild extends React.Component {
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
   * @description:提交给后台添加新建
   * @params all
   */
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        let arg_params = {};
        arg_params["arg_owner_user"] = auth_username;
        arg_params["arg_name"] = values.name;
        arg_params["arg_zhname"] = values.zhname;
        arg_params["arg_classID"] =values.class_id;
        arg_params["arg_mainlang"] = values.mainlang;
        arg_params["arg_desc"] = values.desc;

        const {dispatch} = this.props;
        dispatch({
          type: 'projectBuild/submit',
          arg_param: arg_params
        });

      }
    })

  }

  /**
   * @author:  zhulei
   * @date: 2017/11/20
   * @description:重置新建属性
   * @param null
   */
  reset = () => {
    const form = this.props.form;
    form.setFieldsValue({name: ""});
    form.setFieldsValue({zhname: ""});
    form.setFieldsValue({class_id: ""});
    form.setFieldsValue({mainlang: ""});
    form.setFieldsValue({desc: ""});

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

        <div className={styles.bookTitle}>项目新建</div>
        <div style={{marginRight: '50px'}}>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col>
                <FormItem label="项目名称" {...formItemLayout} >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '项目名称是必填项'
                    }],
                  })
                  (<Input/>)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="项目中文名称" {...formItemLayout} >
                  {getFieldDecorator('zhname', {
                    rules: [{
                      required: true,
                      message: '项目中文名称是必填项'
                    }],
                  })
                  (<Input/>)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="项目类别" {...formItemLayout}>
                  {getFieldDecorator('class_id', {
                    rules: [{
                      required: true,
                      message: '项目类别是必选项'
                    }],
                  })
                  (<Select>
                    <Option value="09f90fa6bd6511e7ad99008cfa042288">大数据</Option>
                    <Option value="1582ef96bd6511e7ad99008cfa042288">数据库</Option>
                    <Option value="78caaea1c2f911e7ad99008cfa042288">安全</Option>
                    <Option value="415f88c7c2fa11e7ad99008cfa042288">管理和监控</Option>
                    <Option value="c4d232bec2fa11e7ad99008cfa042288">服务器</Option>
                    <Option value="5d0b7748c2f911e7ad99008cfa042288">Web开发框架</Option>
                    <Option value="819fe64dc2f911e7ad99008cfa042288">其他</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="使用的主要开发语言" {...formItemLayout}>
                  {getFieldDecorator('mainlang', {
                    rules: [{
                      required: true,
                      message: '主要开发语言是必选项'
                    }],
                  })
                  (<Select>
                    <Option value="JAVA">JAVA</Option>
                    <Option value="C/C++">C/C++</Option>
                    <Option value="PYTHON">PYTHON</Option>
                    <Option value="GO">GO</Option>
                    <Option value="SHELL">SHELL</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="项目描述" {...formItemLayout}  >
                  {getFieldDecorator('desc', {})
                  (<TextArea rows={4}/>)}
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
    loading: state.loading.models.projectBuild,
    ...state.projectBuild
  }
}

export default connect(mapStateToProps)(Form.create()(projectBuild));
