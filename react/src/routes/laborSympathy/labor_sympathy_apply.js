/**
* 作者：翟金亭
* 创建日期：2020-5-12 
* 邮箱：zhaijt3@chinaunicom.cn
* 功能：实现创建工会慰问申请界面 
*/
import React, { Component } from "react";
import { Button, Form, Row, Input, Card, Select, message, Modal, Col } from "antd";

const FormItem = Form.Item;
const { Option } = Select;
import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import UpFileApply from "./upFileApply";
import CheckFile from "./checkFile";

class labor_sympathy_apply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      submitFlag: true,
      sympathy_apply_id_save: '',
      isSaveClickable: true,
      isSubmitClickable: true,
      sympathy_apply_id: ''
    };
  }
  // 获取当前日期 （右上角申请日期格式YYYY年MM月DD日）
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  };

  // 获取当前日期（插入数据库日期格式YYYY-MM-DD）
  getCurrentDate1() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  };

  submitAction = () => {
    let formData = this.props.form.getFieldsValue();
    /*非空校验*/
    //所在工会
    let labor_name = formData.labor_name;
    //经办人
    let create_person_name = formData.create_person_name;
    //申请类别
    let sympathy_type = formData.sympathy_type;
    //慰问对象
    let sympathy_objects = formData.sympathy_objects;
    //慰问标准
    let sympathy_standard = formData.sympathy_standard;
    //慰问事项简述
    let sympathy_remarks = formData.sympathy_remarks;

    if (labor_name === null || labor_name === '' || labor_name === undefined) {
      message.error('所在工会不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    if (create_person_name === null || create_person_name === '' || create_person_name === undefined) {
      message.error('经办人不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    if (sympathy_type === null || sympathy_type === '' || sympathy_type === undefined) {
      message.error('申请类别不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    if (sympathy_objects === null || sympathy_objects === '' || sympathy_objects === undefined) {
      message.error('慰问对象不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    if (sympathy_standard === null || sympathy_standard === '' || sympathy_standard === undefined) {
      message.error('慰问标准不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    if (sympathy_remarks === null || sympathy_remarks === '' || sympathy_remarks === undefined) {
      message.error('慰问事项简述不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    this.setState({
      visible: true,
    });
  }
  // 结束关闭按钮
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index'
    }));
  };

  // 保存申请信息
  saveInfo = () => {
    this.setState({ isSaveClickable: false });
    let formData = this.props.form.getFieldsValue();
    const { dispatch } = this.props;
    const { postDataList } = this.props;

    if (postDataList && postDataList.pf_url && postDataList.file_relative_path && postDataList.file_name && !this.props.pf_url && !this.props.file_relative_path && !this.props.file_name) {
      pf_url_save = postDataList.pf_url;
      file_relative_path_save = postDataList.file_relative_path;
      file_name_save = postDataList.file_name;
    } else {
      pf_url_save = this.props.pf_url;
      file_relative_path_save = this.props.file_relative_path;
      file_name_save = this.props.file_name;
    }
    let pf_url_save = '';
    let file_relative_path_save = '';
    let file_name_save = '';

    pf_url_save = this.props.pf_url;
    file_relative_path_save = this.props.file_relative_path;
    file_name_save = this.props.file_name;

    //所在工会
    let labor_name = formData.labor_name;
    //经办人
    let create_person_name = formData.create_person_name;
    //申请类别
    let sympathy_type = formData.sympathy_type;
    //慰问对象
    let sympathy_objects = formData.sympathy_objects;
    //慰问标准
    let sympathy_standard = formData.sympathy_standard;
    //慰问事项简述
    let sympathy_remarks = formData.sympathy_remarks;

    /*封装基本信息，即overtime_team_apply表数据*/
    let basicInfoData = {};
    let sympathy_apply_id = '';
    let sympathy_apply_id_temp = this.props.sympathy_apply_id;
    if (sympathy_apply_id_temp == '' || sympathy_apply_id_temp == null || sympathy_apply_id_temp == undefined) {
      sympathy_apply_id_temp = Cookie.get("userid") + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }

    if (this.state.sympathy_apply_id_save !== '') {
      sympathy_apply_id = this.state.sympathy_apply_id_save;
    } else {
      sympathy_apply_id = sympathy_apply_id_temp;
    }

    basicInfoData["arg_sympathy_apply_id"] = sympathy_apply_id;
    basicInfoData["arg_create_person_id"] = Cookie.get("userid");
    basicInfoData["arg_create_person_name"] = create_person_name;
    basicInfoData["arg_labor_name"] = labor_name;
    basicInfoData["arg_sympathy_type"] = sympathy_type;
    basicInfoData["arg_sympathy_objects"] = sympathy_objects;
    basicInfoData["arg_sympathy_standard"] = sympathy_standard;
    basicInfoData["arg_sympathy_remarks"] = sympathy_remarks;
    basicInfoData["arg_remarks"] = formData.remarks;
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_status"] = '0';
    basicInfoData["arg_proc_inst_id"] = '';
    basicInfoData["arg_ou_id"] = Cookie.get("OUID");
    //添加附件文件信息
    basicInfoData["arg_pf_url"] = pf_url_save;
    basicInfoData["arg_file_relative_path"] = file_relative_path_save;
    basicInfoData["arg_file_name"] = file_name_save;

    return new Promise((resolve) => {
      dispatch({
        type: 'labor_sympathy_apply_model/sympathyApplySave',
        basicInfoData,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ sympathy_apply_id_save: sympathy_apply_id });
        this.setState({ isSaveClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/laborSympathy/index',
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ sympathy_apply_id_save: sympathy_apply_id });
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/laborSympathy/index',
      }));
    });
  };

  // 提交申请信息
  handleOk = () => {
    const { postDataList } = this.props;

    let pf_url_save = '';
    let file_relative_path_save = '';
    let file_name_save = '';
    if (postDataList && postDataList.pf_url && postDataList.file_relative_path && postDataList.file_name && !this.props.pf_url && !this.props.file_relative_path && !this.props.file_name) {
      pf_url_save = postDataList.pf_url;
      file_relative_path_save = postDataList.file_relative_path;
      file_name_save = postDataList.file_name;
    } else {
      pf_url_save = this.props.pf_url;
      file_relative_path_save = this.props.file_relative_path;
      file_name_save = this.props.file_name;
    }

    let sympathyDataSource = this.props.sympathyData
    let committee_type = sympathyDataSource && sympathyDataSource[0] && sympathyDataSource[0].committee_type ? sympathyDataSource[0].committee_type : ''
    let formData = this.props.form.getFieldsValue();
    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;

    //所在工会
    let labor_name = formData.labor_name;
    //经办人
    let create_person_name = formData.create_person_name;
    //申请类别
    let sympathy_type = formData.sympathy_type;
    //慰问对象
    let sympathy_objects = formData.sympathy_objects;
    //慰问标准
    let sympathy_standard = formData.sympathy_standard;
    //慰问事项简述
    let sympathy_remarks = formData.sympathy_remarks;

    /*封装基本信息，即apply表数据*/
    let basicInfoData = {};
    let sympathy_apply_id = '';
    let sympathy_apply_id_temp = this.props.sympathy_apply_id;
    if (sympathy_apply_id_temp == '' || sympathy_apply_id_temp == null || sympathy_apply_id_temp == undefined) {
      sympathy_apply_id_temp = Cookie.get("userid") + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }

    if (this.state.sympathy_apply_id_save !== '') {
      sympathy_apply_id = this.state.sympathy_apply_id_save;
    } else {
      sympathy_apply_id = sympathy_apply_id_temp;
    }
    basicInfoData["arg_sympathy_apply_id"] = sympathy_apply_id;
    basicInfoData["arg_create_person_id"] = Cookie.get("userid");
    basicInfoData["arg_create_person_name"] = create_person_name;
    basicInfoData["arg_labor_name"] = labor_name;
    basicInfoData["arg_sympathy_type"] = sympathy_type;
    basicInfoData["arg_sympathy_objects"] = sympathy_objects;
    basicInfoData["arg_sympathy_standard"] = sympathy_standard;
    basicInfoData["arg_sympathy_remarks"] = sympathy_remarks;
    basicInfoData["arg_remarks"] = formData.remarks;
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_status"] = '1';
    //添加附件文件信息
    basicInfoData["arg_pf_url"] = pf_url_save;
    basicInfoData["arg_file_relative_path"] = file_relative_path_save;
    basicInfoData["arg_file_name"] = file_name_save;
    // basicInfoData["arg_proc_inst_id"] = ''; --model补充
    basicInfoData["arg_ou_id"] = Cookie.get("OUID");

    /*封装基本信息，即apply表数据 end */

    /*封装审批信息，即approval表数据,经办人申请环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_sympathy_apply_id"] = sympathy_apply_id_temp;
    /*下一环节处理人为经办人，直接填写经办人*/
    approvalData["arg_user_id"] = Cookie.get("userid");;
    approvalData["arg_user_name"] = Cookie.get("username");;
    approvalData["arg_post_id"] = ''; //===========
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate1();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即approval表数据 end */

    /*封装审批信息，即approval表数据,下一环节 begin */
    let approvalDataNext = {};
    approvalDataNext["arg_sympathy_apply_id"] = sympathy_apply_id_temp;
    /*下一环节处理人为部门经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = formData.nextstepPerson1;
    approvalDataNext["arg_user_name"] = formData.nextstepPerson;
    approvalDataNext["arg_post_id"] = '';//===========
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即approval表数据 end */


    return new Promise((resolve) => {
      dispatch({
        type: 'labor_sympathy_apply_model/sympathyApplySubmit',
        basicInfoData,
        approvalData,
        approvalDataNext,
        sympathy_apply_id,
        committee_type,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ sympathy_apply_id_save: absence_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/laborSympathy/index',
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ sympathy_apply_id_save: absence_apply_id });
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/laborSympathy/index',
      }));
    });
  }
  // 取消按钮
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { sympathyData, nextDataList, postDataList, laobrDataList, sympathyType } = this.props;
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


    //选择一下处理人信息
    let nextpostname = '';
    let initperson = '';
    let nextdataList = null;
    if (nextDataList && nextDataList[0]) {
      if (nextDataList.length > 0) {
        initperson = nextDataList[0].submit_user_id;
        nextpostname = nextDataList[0].submit_post_name;
      }

      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }
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
    let fileList = [];
    let name = '';
    let url = '';
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
                    initialValue: laobrDataList && laobrDataList[0] && laobrDataList[0].labor_name ? laobrDataList[0].labor_name : '请确认系统中是否有您所在工会'
                  })(
                    <Input style={inputstyle} disabled={true} />
                  )}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'经办人'} {...formItemLayout3}>
                  {getFieldDecorator('create_person_name', {
                    initialValue: laobrDataList && laobrDataList[0] && laobrDataList[0].jk_username ? laobrDataList[0].jk_username : '请确认系统中是否为经办人'
                  })(<Input style={inputstyle} disabled={true} />)}
                </FormItem>
              </Col>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="申请类别" {...formItemLayout}>
                {getFieldDecorator('sympathy_type', {
                  initialValue: sympathyType ? sympathyType : '请选择',
                  rules: [{
                    required: true,
                    message: '',
                  }],
                })
                  (<Input style={inputstyle} disabled={sympathyType ? true : false} />)
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="慰问对象" {...formItemLayout}
                help="如若有多个同一类型的慰问对象，请用逗号分隔。"
              >
                {getFieldDecorator('sympathy_objects', {
                  rules: [{
                    required: true,
                    message: '请填写正确格式（不超过30字）',
                  }],
                  initialValue: postDataList && postDataList.sympathy_objects ? postDataList.sympathy_objects : ''
                })
                  (
                    <Input style={inputstyle} />
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
                  initialValue: (postDataList && postDataList.statusFlag === '1' && postDataList.sympathy_standard) ? postDataList.sympathy_standard : (sympathyData && sympathyData[0] && sympathyData[0].sympathy_standard ? sympathyData[0].sympathy_standard : '')
                })
                  (<Input style={inputstyle} disabled={true} />)
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="慰问事项简述" {...formItemLayout}
                help="结婚慰问请填写结婚日期，生育慰问请填写子女出生日期，生病慰问请简述事项写明住院日期（300字以内）。"
              >
                {getFieldDecorator('sympathy_remarks', {
                  rules: [{
                    required: true,
                    message: '请填写正确格式（不超过300字）',
                  }],
                  initialValue: (postDataList && postDataList.sympathy_remarks) ? postDataList.sympathy_remarks : ''
                  // initialValue: 'aaaa'
                })
                  (
                    <Input style={inputstyle} />
                  )
                }
              </FormItem>
            </Row>

            <Row style={{ textAlign: 'center' }}>
              <FormItem label="备注" {...formItemLayout}>
                {getFieldDecorator('remarks', {
                  initialValue: postDataList && postDataList.remarks ? postDataList.remarks : ''
                })
                  (<Input style={inputstyle} />)
                }
              </FormItem>
            </Row>
            {/*附件*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="上传附件：" hasFeedback {...formItemLayout}>
                {
                  postDataList && postDataList.pf_url && postDataList.file_relative_path && postDataList.file_name ?
                    <UpFileApply
                      filelist={fileList}
                      name={postDataList.file_name}
                      url={postDataList.pf_url}
                    />
                    :
                    <UpFileApply
                      filelist={fileList}
                      name={name}
                      url={url}
                    />
                }
              </FormItem>
            </Row>


            <br />
          </Form>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <br></br>
          <Button type="primary" onClick={this.saveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" htmlType="submit" onClick={this.submitAction} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
        </div>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: nextpostname
                })(
                  <Input style={{ color: '#000' }} disabled={true} />
                )}
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson1', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '%100' }} placeholder="请选择">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
        <br /> <br />
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

labor_sympathy_apply = Form.create()(labor_sympathy_apply);
export default connect(mapStateToProps)(labor_sympathy_apply);
