/**
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-06-16
 * 功能：实现工会慰问审批查看界面 
 */

import React, { Component } from "react";
import { Button, Form, Row, Card, Col, Input } from "antd";
const FormItem = Form.Item;
import CheckFile from "./checkFile";
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import styles from "./style.less";

class labor_sympathy_approval_look extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now_post_name: '',
    }
  }

  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index'
    }));
  }

  render() {
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
    const { approvalNowList, approvalHiList, applyPersonInfo } = this.props;
    const { getFieldDecorator } = this.props.form;

    let applyInfo = {};

    if (applyPersonInfo.length > 0) {
      applyInfo = applyPersonInfo[0];
    }
    const hidataList = approvalHiList.map(item =>
      <FormItem >
        {item.task_name}: &nbsp;&nbsp;{item.task_detail}
      </FormItem>
    );

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
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
        <br></br>
        <Form>
          <Card title="申请信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <Row gutter={12} >
                {/*姓名*/}
                <Col span={12} style={{ display: 'block' }}>
                  <FormItem label={'所在工会'} {...formItemLayout2}>
                    {getFieldDecorator('labor_name', {
                      initialValue: applyInfo.labor_name,
                    })(
                      <Input style={inputstyle} disabled={true} />
                    )}
                  </FormItem>
                </Col>
                {/*部门*/}
                <Col span={12} style={{ display: 'block' }}>
                  <FormItem label={'经办人'} {...formItemLayout3}>
                    {getFieldDecorator('create_person_name', {
                      initialValue: applyInfo.create_person_name,
                    })(<Input style={inputstyle} disabled={true} />)}
                  </FormItem>
                </Col>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="申请类别" {...formItemLayout}>
                  {getFieldDecorator('sympathy_type', {
                    initialValue: applyInfo.sympathy_type,
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
                <FormItem label="慰问对象" {...formItemLayout}
                >
                  {getFieldDecorator('sympathy_objects', {
                    rules: [{
                      required: true,
                      message: '请填写正确格式（不超过30字）',
                    }],
                    initialValue: applyInfo.sympathy_objects,
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
                    initialValue: applyInfo.sympathy_standard,
                  })
                    (<Input style={inputstyle} disabled={true} />)
                  }
                </FormItem>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="慰问事项简述" {...formItemLayout}
                >
                  {getFieldDecorator('sympathy_remarks', {
                    rules: [{
                      required: true,
                      message: '请填写正确格式（不超过300字）',
                    }],
                    initialValue: applyInfo.sympathy_remarks,
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
                    initialValue: applyInfo.remarks,
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
          <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
            </span>
          </Card>
          <br></br>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
          </Col>
          <br></br>
        </Form>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.labor_sympathy_approval_model,
    ...state.labor_sympathy_approval_model,
  };
}
labor_sympathy_approval_look = Form.create()(labor_sympathy_approval_look);
export default connect(mapStateToProps)(labor_sympathy_approval_look)

