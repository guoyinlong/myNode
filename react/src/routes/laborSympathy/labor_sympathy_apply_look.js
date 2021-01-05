/**
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-06-10
 * 功能：实现工会慰问审批查看界面 
 */

import React, { Component } from "react";
import { Button, Form, Row, Input, Card, Col } from "antd";

const FormItem = Form.Item;
import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import CheckFile from "./checkFile";

class labor_sympathy_apply_look extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 获取当前日期 （右上角申请日期格式YYYY年MM月DD日）
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  };

  // 结束关闭按钮
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index'
    }));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { postLookData } = this.props;

    const inputstyle = { color: '#000' };
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 14 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };
    const formItemLayout3 = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    //附件信息
    //获取下载文件列表
    let filelist = this.props.fileDataList;
    if (filelist && filelist.length > 0) {
      for (let i = 0; i < filelist.length; i++) {
        filelist[i].uid = i + 1;
        filelist[i].status = "done";
      }
    }
    return (
      <div>
        <br />
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
          <h2><font size="6" face="arial">工会会员慰问及困难帮扶申请单</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{this.getCurrentDate()}</u></span></p>
        <br></br>
        <Card title="申请信息" className={styles.r}>
          <Form style={{ marginTop: 10 }}>

            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'所在工会'} {...formItemLayout2}>
                  {getFieldDecorator('labor_name', {
                    initialValue: postLookData && postLookData.labor_name ? postLookData.labor_name : '请确认系统中是否有您所在工会'
                  })(
                    <Input style={inputstyle} disabled={true} />
                  )}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'经办人'} {...formItemLayout3}>
                  {getFieldDecorator('create_person_name', {
                    initialValue: postLookData && postLookData.create_person_name ? postLookData.create_person_name : '请确认系统中是否为经办人'
                  })(<Input style={inputstyle} disabled={true} />)}
                </FormItem>
              </Col>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="申请类别" {...formItemLayout}>
                {getFieldDecorator('sympathy_type', {
                  initialValue: postLookData && postLookData.sympathyType ? postLookData.sympathyType : '请确认',
                  rules: [{
                    required: true,
                    message: '',
                  }],
                })
                  (<Input style={inputstyle} disabled={true} />)
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="慰问对象" {...formItemLayout} >
                {getFieldDecorator('sympathy_objects', {
                  rules: [{
                    required: true,
                    message: '请填写正确格式（不超过30字）',
                  }],
                  initialValue: postLookData && postLookData.sympathy_objects ? postLookData.sympathy_objects : ''
                })
                  (
                    <Input style={inputstyle} disabled={true} />
                  )
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="慰问标准" {...formItemLayout}>
                {getFieldDecorator('sympathy_standard', {
                  rules: [{
                    required: true,
                    message: '请填写正确格式（不超过20字）',
                  }],
                  initialValue: postLookData && postLookData.sympathy_standard ? postLookData.sympathy_standard : ''
                })
                  (<Input style={inputstyle} disabled={true} />)
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="慰问事项简述" {...formItemLayout} >
                {getFieldDecorator('sympathy_remarks', {
                  rules: [{
                    required: true,
                    message: '请填写正确格式（不超过300字）',
                  }],
                  initialValue: postLookData && postLookData.sympathy_remarks ? postLookData.sympathy_remarks : ''
                  // initialValue: 'aaaa'
                })
                  (
                    <Input style={inputstyle} disabled={true} />
                  )
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="备注" {...formItemLayout}>
                {getFieldDecorator('remarks', {
                  initialValue: postLookData && postLookData.remarks ? postLookData.remarks : ''
                })
                  (<Input style={inputstyle} disabled={true} />)
                }
              </FormItem>
            </Row>
          </Form>
        </Card>
        <Card title="查看申请附件"
          style={{ display: (filelist && filelist[0] && filelist[0].name) ? "" : "none" }}
        >
          <CheckFile filelist={filelist} />
        </Card>
        <div style={{ textAlign: 'center' }}>
          <br></br>
          <Button onClick={this.gotoHome}>返回</Button>
        </div>
        <br />
      </div >
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.labor_sympathy_apply_model,
    ...state.labor_sympathy_apply_model
  };
}

labor_sympathy_apply_look = Form.create()(labor_sympathy_apply_look);
export default connect(mapStateToProps)(labor_sympathy_apply_look);
