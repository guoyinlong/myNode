/**
 * 文件说明：线上培训与认证考试培训成绩导入
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-08-30
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Table, Select, Modal, message, Card, Icon } from 'antd';
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import UpFileImportGrade from "./upFileImportGrade";
import ExcelImportPersonGrade from "./ExcelImportPersonGrade";

const FormItem = Form.Item;
const { Option } = Select;



class ImportTrainOnlineExamGrade extends React.Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      staff_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      train_import_type: 'onlineTrain',
      onlinePersonClassGradeDataList: [],
      examPersonClassGradeDataList: [],
      isSubmitClickable: true,
      personClassGradeVisible: false,
      personClassGradeVisible2: false,
      year: new Date().getFullYear().toString(),
      train_scope: '0',
      train_scope_display: false
    }
  }

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    this.props.form.validateFields(
      (err) => {
        /*if (err) {
          message.error("请填写必填项");
          this.setState({
            isSubmitClickable: true
          });
        } else {*/
        if (this.state.train_import_type === 'examTrain') {
          if (this.state.examPersonClassGradeDataList.length === 0) {
            message.error("请检查录入的认证考试成绩是否为空，或者是否为认证考试成绩");
            return;
          }
        } else if (this.state.train_import_type === 'onlineTrain') {
          //导入线上培训成绩显示
          if (this.state.onlinePersonClassGradeDataList.length === 0) {
            message.error("请检查录入的线上培训成绩是否为空，或者是否为线上培训成绩");
            return;
          }
        }
        this.setState({
          visible: true,
        });

      }
    )
  };

  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  }

  //提交培训申请申请信息
  handleOk = () => {
    this.setState({
      isSubmitClickable: false
    });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;

    this.props.form.validateFields((err) => {
      /*if(err){
        message.error("请填写必填项");
        this.setState({ isSubmitClickable: true });
      }
      else{*/
      //选择一下处理人信息
      let nextDataList = this.props.nextPersonList;
      let nextPersonId = '';
      let nextPersonName = '';
      if (nextDataList !== undefined) {
        if (nextDataList.length > 0) {
          nextPersonId = nextDataList[0].dm_user_id;
          nextPersonName = nextDataList[0].dm_user_name;
        }
      }

      if (this.state.train_import_type === 'examTrain') {
        if (this.state.examPersonClassGradeDataList.length === 0) {
          message.error("请检查录入的认证考试成绩是否为空，或者是否为认证考试成绩");
          return;
        } else {
          let formData = this.props.form.getFieldsValue();

          let train_exam_import_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);

          /*封装批量导入信息 begin */
          let transferExamDataDataList = [];
          let transferExamApprovalDataDataList = {};
          const tempExamPersonClassGradeDataList = this.state.examPersonClassGradeDataList;

          tempExamPersonClassGradeDataList.map((item) => {
            let tempData = {
              //用户名
              arg_login_name: item.exam_login_name,
              //参训人员
              arg_user_name: item.exam_user_name,
              //是否完成
              arg_if_pass: item.exam_if_pass,
              arg_import_type: this.state.train_import_type,
              arg_import_id: train_exam_import_id,
              arg_class_name: formData.trainExamName,
            };
            transferExamDataDataList.push(tempData);
          });
          transferExamApprovalDataDataList["arg_pf_url"] = this.props.pf_url;
          transferExamApprovalDataDataList["arg_file_relative_path"] = this.props.file_relative_path;
          transferExamApprovalDataDataList["arg_file_name"] = this.props.file_name;
          transferExamApprovalDataDataList["arg_import_type"] = this.state.train_import_type;
          transferExamApprovalDataDataList["arg_create_person_id"] = Cookie.get('userid');
          transferExamApprovalDataDataList["arg_next_person_id"] = nextPersonId;
          transferExamApprovalDataDataList["arg_create_person_name"] = Cookie.get('username');
          transferExamApprovalDataDataList["arg_next_person_name"] = nextPersonName;
          transferExamApprovalDataDataList["arg_import_id"] = train_exam_import_id;

          transferExamApprovalDataDataList["arg_class_name"] = formData.trainExamName;

          return new Promise((resolve) => {
            dispatch({
              //全院级必修课保存
              type: 'importGradeModel/importExamGradeOperation',
              transferExamDataDataList,
              transferExamApprovalDataDataList,
              train_exam_import_id,
              resolve
            });
          }).then((resolve) => {
            if (resolve === 'success') {
              this.setState({ isSaveClickable: false });
              this.setState({ isSuccess: true });
              this.setState({
                visible: false,
              });
              setTimeout(() => {
                dispatch(routerRedux.push({
                  pathname: '/humanApp/train/train_do'
                }));
              }, 500);
            }
            if (resolve === 'false') {
              this.setState({ isSaveClickable: true });
              this.setState({
                visible: false,
              });
            }
          }).catch(() => {
            dispatch(routerRedux.push({
              pathname: '/humanApp/train/train_do'
            }));
          });

        }
      } else if (this.state.train_import_type === 'onlineTrain') {
        //导入线上培训成绩显示
        if (this.state.onlinePersonClassGradeDataList.length === 0) {
          message.error("请检查录入的线上培训成绩是否为空，或者是否为线上培训成绩");
          return;
        } else {
          let formData = this.props.form.getFieldsValue();
          let train_online_import_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);

          /*封装批量导入信息 begin */
          let transferOnlineDataDataList = [];
          let transferOnlineApprovalDataDataList = {};
          const tempOnlinePersonClassGradeDataList = this.state.onlinePersonClassGradeDataList;

          tempOnlinePersonClassGradeDataList.map((item) => {
            let tempData = {
              //用户名
              arg_login_name: item.online_login_name,
              //参训人员
              arg_user_name: item.online_user_name,
              //是否完成
              arg_if_pass: item.online_if_pass,
              arg_import_type: this.state.train_import_type,
              arg_import_id: train_online_import_id,
              arg_class_name: formData.onlineTrainName,
            };
            transferOnlineDataDataList.push(tempData);
          });
          transferOnlineApprovalDataDataList["arg_pf_url"] = this.props.pf_url;
          transferOnlineApprovalDataDataList["arg_file_relative_path"] = this.props.file_relative_path;
          transferOnlineApprovalDataDataList["arg_file_name"] = this.props.file_name;
          transferOnlineApprovalDataDataList["arg_import_type"] = this.state.train_import_type;
          transferOnlineApprovalDataDataList["arg_create_person_id"] = Cookie.get('userid');
          transferOnlineApprovalDataDataList["arg_next_person_id"] = nextPersonId;
          transferOnlineApprovalDataDataList["arg_create_person_name"] = Cookie.get('username');
          transferOnlineApprovalDataDataList["arg_next_person_name"] = nextPersonName;
          transferOnlineApprovalDataDataList["arg_import_id"] = train_online_import_id;

          transferOnlineApprovalDataDataList["arg_class_name"] = formData.onlineTrainName;

          return new Promise((resolve) => {
            dispatch({
              //全院级必修课保存
              type: 'importGradeModel/importOnlineGradeOperation',
              transferOnlineDataDataList,
              transferOnlineApprovalDataDataList,
              train_online_import_id,
              resolve
            });
          }).then((resolve) => {
            if (resolve === 'success') {
              this.setState({ isSaveClickable: false });
              this.setState({ isSuccess: true });
              this.setState({
                visible: false,
              });
              setTimeout(() => {
                dispatch(routerRedux.push({
                  pathname: '/humanApp/train/train_do'
                }));
              }, 500);
            }
            if (resolve === 'false') {
              this.setState({ isSaveClickable: true });
              this.setState({
                visible: false,
              });
            }
          }).catch(() => {
            dispatch(routerRedux.push({
              pathname: '/humanApp/train/train_do'
            }));
          });
        }
      }

    });
  };
  //选择下一环节处理人，取消
  handleCancel = (e) => {
    this.setState({
      visible: false,
      isSubmitClickable: true
    });
  }

  //选择导入类型：线上培训，认证考试
  importType = (value) => {
    this.setState({
      train_import_type: value,
    })
    let year = this.state.year;
    if (value === 'examTrain') {
      const { dispatch } = this.props;
      dispatch({
        type: 'importGradeModel/timeSheetDataQuery',
        year
      });
    }
  };

  //导入成绩更新状态
  updateVisible = (value) => {

    if (value) {
      if (this.state.train_import_type === 'examTrain'||this.state.train_import_type === 'examTrainNo') {
        //导入认证考试成绩显示
        const importExamClassGradeData = this.props.importExamClassGradeDataList;
        if (!importExamClassGradeData) {
          message.error("请检查录入的认证考试成绩是否有误");
        } else {
          this.setState({
            examPersonClassGradeDataList: importExamClassGradeData,
          });
        }
      } else if (this.state.train_import_type === 'onlineTrain') {
        //导入线上培训成绩显示
        const importOnlineClassGradeData = this.props.importOnlineClassGradeDataList;
        if (!importOnlineClassGradeData) {
          message.error("请检查录入的线上培训成绩是否有误");
        } else {
          this.setState({
            onlinePersonClassGradeDataList: importOnlineClassGradeData,
          });
        }
      }
    }
  };


  //导入成绩-关闭model
  handlePersonClassGradeCancel = () => {
    this.setState({
      personClassGradeVisible: false,
    });
  };
  handlePersonClassGradeCancel2 = () => {
    this.setState({
      personClassGradeVisible2: false,
    });
  };
  //导入成绩-导入确定，关闭model
  handlePersonClassGradeOk = () => {
    let formData = this.props.form.getFieldsValue();
    let trainImportType = formData.trainImportType;
    let add_user_name = formData.add_user_name;
    let add_login_name = formData.add_login_name;
    let add_if_pass = formData.add_if_pass;
    let add_online_train_type = formData.add_online_train_type;
    let add_online_train_date = formData.add_online_train_date;
    let add_online_train_hour = formData.add_online_train_hour;
    let add_online_train_name = formData.add_online_train_name;
    if (add_user_name === '' || add_user_name === null || add_login_name === '' || add_login_name === null || add_if_pass === '' || add_if_pass === null || add_online_train_type === '' || add_online_train_type === null
      || add_online_train_date === '' || add_online_train_date === null|| add_online_train_hour === '' || add_online_train_hour === null) {
      message.info("信息不能为空");
      return;
    }
    this.setState({
      personClassGradeVisible: false,
    });
    let AddDataSource = this.state.onlinePersonClassGradeDataList;
    let NewDataParam = {};
    NewDataParam["online_index_id"] = AddDataSource.length + 1;
    NewDataParam["online_user_name"] = add_user_name;
    NewDataParam["online_login_name"] = add_login_name;
    NewDataParam["online_if_pass"] = add_if_pass;
    NewDataParam["online_train_type"] = add_online_train_type;
    NewDataParam["online_train_date"] = add_online_train_date;
    NewDataParam["online_train_hour"] = add_online_train_hour;
    NewDataParam["online_train_name"] = add_online_train_name;
    AddDataSource.push(NewDataParam);
    this.setState({
        onlinePersonClassGradeDataList: AddDataSource
    });

  };
  handlePersonClassGradeOk2 = () => {
    let formData = this.props.form.getFieldsValue();
    let trainImportType = formData.trainImportType;
    let add_user_name = formData.add_user_name_exam;
    let add_login_name = formData.add_login_name_exam;
    let add_if_pass = formData.add_if_pass_exam;
    let add_exam_fee = formData.add_exam_fee;

    if (add_user_name === '' || add_user_name === null || add_login_name === '' || add_login_name === null || add_if_pass === '' || add_if_pass === null) {
      message.info("信息不能为空");
      return;
    }
    this.setState({
      personClassGradeVisible2: false,
    });
    let AddDataSource = this.state.examPersonClassGradeDataList;
    let NewDataParam = {};
    NewDataParam["exam_index_id"] = AddDataSource.length + 1;
    NewDataParam["exam_user_name"] = add_user_name;
    NewDataParam["exam_login_name"] = add_login_name;
    NewDataParam["exam_if_pass"] = add_if_pass;
    NewDataParam["exam_fee"] = add_exam_fee;
    AddDataSource.push(NewDataParam);
    this.setState({
      examPersonClassGradeDataList: AddDataSource
    });
  };

  //导入线上培训成绩展示
  person_online_class_grade_columns = [
    { title: '序号', dataIndex: 'online_index_id' },
    { title: '参训人员', dataIndex: 'online_user_name' },
    { title: '用户名', dataIndex: 'online_login_name' },
    { title: '是否完成', dataIndex: 'online_if_pass' },
    { title: '课程类型', dataIndex: 'online_train_type' },
    { title: '完成时间', dataIndex: 'online_train_date' },
    { title: '培训课时', dataIndex: 'online_train_hour' },
    { title: '课程名称', dataIndex: 'online_train_name' },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (text, record, index) => {
        return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />
      },
    }
  ];
  //删除
  handleDel(e) {
    let online_index_id = e.target.getAttribute('data-index');
    let DelDataSource = this.state.onlinePersonClassGradeDataList;
    let NewDataSource = [];
    for (let i = 0; i < DelDataSource.length; i++) {
      if (i != online_index_id) {
        DelDataSource[i]['online_index_id'] = NewDataSource.length + 1;
        NewDataSource.push(DelDataSource[i]);
      }
    }
    this.setState({
      onlinePersonClassGradeDataList: NewDataSource
    });
  }
  //导入认证考试培训成绩展示
  person_exam_class_grade_columns = [
    { title: '序号', dataIndex: 'exam_index_id' },
    { title: '参训人员', dataIndex: 'exam_user_name' },
    { title: '用户名', dataIndex: 'exam_login_name' },
    { title: '是否通过', dataIndex: 'exam_if_pass' },
    { title: '报销费用', dataIndex: 'exam_fee' },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (text, record, index) => {
        return <Icon type="delete" data-index={index} onClick={this.handleDel2.bind(this)} />
      },
    }
  ];
  //删除
  handleDel2(e) {
    let exam_index_id = e.target.getAttribute('data-index');
    let DelDataSource = this.state.examPersonClassGradeDataList;
    let NewDataSource = [];
    for (let i = 0; i < DelDataSource.length; i++) {
      if (i != exam_index_id) {
        DelDataSource[i]['exam_index_id'] = NewDataSource.length + 1;
        NewDataSource.push(DelDataSource[i]);
      }
    }
    this.setState({
      examPersonClassGradeDataList: NewDataSource
    });
  }
  //新增
  addDate = () => {
    if (this.state.train_import_type === 'examTrain'||this.state.train_import_type === 'examTrainNo') {
      this.setState({
        personClassGradeVisible2: true,
      });
    }else{
      this.setState({
        personClassGradeVisible: true,
      });
    }
  };

  //修改年月
  onChangeDatePicker = (value) => {
    this.setState({
      year: value,
    });
  }
  render() {
    const inputstyle = { color: '#000' };
    //附件信息
    let fileList = [];
    let name = '';
    let url = '';

    const { getFieldDecorator } = this.props.form;
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
    let nextDataList = this.props.nextPersonList;
    //下一环节名称
    let nextPostName = '部门负责人审批';
    let nextPersonName = '';
    //下一环节处理人
    if (nextDataList !== undefined) {
      if (nextDataList.length > 0) {
        nextPersonName = nextDataList[0].dm_user_name;
      }
    }
    const examList = this.props.examList.map((item) => {
      return (<Option key={item.certification_name}>{item.certification_name}</Option>)
    });

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>线上培训&认证考试培训信息录入</h1></Row>
        <br />
        <Form>
          {
            this.state.train_import_type === 'onlineTrain'
              ?
              /*模板下载*/
              <Row style={{ textAlign: 'left' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span> 模板下载： </span>
                <a href="/filemanage/download/needlogin/hr/training_online_score.xlsx" ><Button >{'线上培训课程成绩模板下载'}</Button></a>
              </Row>
              :
              /*模板下载*/
              <Row style={{ textAlign: 'left' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span> 模板下载： </span>
                <a href="/filemanage/download/needlogin/hr/training_exam_score.xlsx" ><Button >{'认证考试成绩模板下载'}</Button></a>
              </Row>
          }
          <br />
          <Card title="培训信息" className={styles.r}>
            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'提交人'} {...formItemLayout2}>
                  {getFieldDecorator('staff_name', {
                    initialValue: this.state.staff_name
                  })(<Input style={inputstyle} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'部门'} {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: this.state.dept_name
                  })(<Input style={inputstyle} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ textAlign: 'center' }} >
              {/*年度*/}
              <FormItem label={'年度'} {...formItemLayout}>
                <Select showSearch style={{ width: 70 }} value={this.state.year} onSelect={this.onChangeDatePicker}>
                  <Option value={(new Date().getFullYear() - 2).toString()}>{(new Date().getFullYear() - 2).toString()}</Option>
                  <Option value={(new Date().getFullYear() - 1).toString()}>{(new Date().getFullYear() - 1).toString()}</Option>
                  <Option value={(new Date().getFullYear()).toString()}>{(new Date().getFullYear()).toString()}</Option>
                </Select>
              </FormItem>
            </Row>
            {/* 培训课程 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="请选择类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainImportType', {
                  initialValue: 'onlineTrain',
                  rules: [
                    {
                      required: true,
                      message: '请选择类型'
                    },
                  ],
                })(
                  <Select placeholder="请选择类型" defaultValue='onlineTrain' disabled={false} onChange={this.importType.bind(this)}>
                    <Option value="onlineTrain">线上培训</Option>
                    <Option value="examTrain">认证考试（考试清单范围）</Option>
                    <Option value="examTrainNo">认证考试（非考试清单范围）</Option>
                  </Select>
                )}
              </FormItem>
            </Row>

            {/* 如果是线上培训，需要导入成绩名单和培训完成凭证（截图）；如果是认证考试，需要上传成绩名单和证书 */}
            {
              this.state.train_import_type === 'onlineTrain'
                ?
                //申请原因及培训需求
                <Col>
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="线上培训名称" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('onlineTrainName', {
                        initialValue: '',
                        rules: [
                          {
                            required: false,
                            message: '请输入线上培训名称'
                          },
                        ],
                      })(
                        <Input placeholder="请输入线上培训名称" />
                      )}
                    </FormItem>
                  </Row>

                  {/* 导入成绩 */}
                  <Row style={{ textAlign: 'center' }}>
                    <ExcelImportPersonGrade dispatch={this.props.dispatch} updateVisible={this.updateVisible} importType={this.state.train_import_type} />
                  </Row>
                </Col>
                :
                this.state.train_import_type === 'examTrainNo'
                  ?
                  //申请原因及培训需求
                  <Col>
                    <Row style={{ textAlign: 'center' }}>
                      <FormItem label="认证考试名称" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('examTrainNoName', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入认证考试名称'
                            },
                          ],
                        })(
                          <Input placeholder="请输入认证考试名称" />
                        )}
                      </FormItem>
                    </Row>

                    {/* 导入成绩 */}
                    <Row style={{ textAlign: 'center' }}>
                      <ExcelImportPersonGrade dispatch={this.props.dispatch} updateVisible={this.updateVisible} importType={this.state.train_import_type} />
                    </Row>
                  </Col>
                :
                //认证考试课程名称
                <Col >
                  <FormItem label="认证考试名称" {...formItemLayout} >
                    {getFieldDecorator('trainExamName', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          //message: '请选择认证考试课程名称'
                          message: '请选择认证考试'
                        },
                      ],
                    })(
                      <Select placeholder="请选择认证考试" disabled={false}>
                        {examList}
                      </Select>
                    )}
                  </FormItem>

                  {/*导入成绩*/}
                  <Row style={{ textAlign: 'center' }}>
                    <ExcelImportPersonGrade dispatch={this.props.dispatch} updateVisible={this.updateVisible} importType={this.state.train_import_type} />
                  </Row>
                </Col>
            }
            <br />

            {/*附件*/}
            <Col span={24} style={{ textAlign: 'center' }}>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="上传附件：" hasFeedback {...formItemLayout}>
                  <UpFileImportGrade filelist={fileList}
                    name={name}
                    url={url} />
                </FormItem>
              </Row>
            </Col>
            <br />

            <Col span={24} style={{ textAlign: 'center' }}>
              <Button onClick={this.goBack}>{'取消'}</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
            </Col>
          </Card>

          <Modal
            title="流程处理"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <div>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value={nextPostName} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextStepPerson', {
                  initialValue: nextPersonName
                })(
                  <Input size="large" width={"100%"} value={nextPersonName} placeholder="请选择负责人" />
                )}
              </FormItem>
            </div>
          </Modal>
        </Form>
        <Card title="培训信息" >
          <Button type='primary' onClick={() => this.addDate()}>新增</Button>
          {
            (this.state.train_import_type === 'onlineTrain' && this.state.onlinePersonClassGradeDataList)
              ?
              <div>
                <Table
                  columns={this.person_online_class_grade_columns}
                  dataSource={this.state.onlinePersonClassGradeDataList}
                  pagination={true}
                  //scroll={{x: '100%', y: 500}}
                  width={'100%'}
                  bordered={true}
                />
              </div>
              :
              (
                ((this.state.train_import_type === 'examTrain'||this.state.train_import_type === 'examTrainNo') && this.state.examPersonClassGradeDataList)
                  ?
                  <div>
                    <Table
                      columns={this.person_exam_class_grade_columns}
                      dataSource={this.state.examPersonClassGradeDataList}
                      pagination={true}
                      //scroll={{x: '100%', y: 500}}
                      width={'100%'}
                      bordered={true}
                    />
                  </div>
                  :
                  null
              )
          }
        </Card>
        <Modal
          title="人员成绩信息"
          visible={this.state.personClassGradeVisible}
          onOk={this.handlePersonClassGradeOk}
          onCancel={this.handlePersonClassGradeCancel}
          width={'50%'}
        >
          <Form>
            <Card title="人员成绩信息" className={styles.r}>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人员姓名" {...formItemLayout} >
                  {getFieldDecorator('add_user_name', {
                    rules: [{ required: true, message: '请输入参训人员姓名' }],
                  })(
                    <Input placeholder="请输入参训人员姓名" />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人员用户名" {...formItemLayout} >
                  {getFieldDecorator('add_login_name', {
                    rules: [{ required: true, message: '请输入参训人员用户名' }],
                  })(
                    <Input placeholder="请输入参训人员用户名" />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="是否通过" {...formItemLayout} >
                  {getFieldDecorator('add_if_pass', {
                    initialValue: '是',
                    rules: [{ required: true, message: '请输入是否通过' }],
                  })(
                    <Select placeholder="请选择是否通过" defaultValue='是' disabled={false}>
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="课程类型" {...formItemLayout} >
                  {getFieldDecorator('add_online_train_type', {
                    initialValue: '部门级',
                    rules: [{ required: true, message: '请输入课程类型' }],
                  })(
                    <Select placeholder="请选择课程类型" defaultValue='部门级' disabled={false}>
                      <Option value="全院级">全院级</Option>
                      <Option value="分院级">分院级</Option>
                      <Option value="部门级">部门级</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="完成时间" {...formItemLayout} >
                  {getFieldDecorator('add_online_train_date', {
                    rules: [{ required: true, message: '请输入完成时间' }],
                  })(
                    <Input placeholder="请输入完成时间" />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="培训课时" {...formItemLayout} >
                  {getFieldDecorator('add_online_train_hour', {
                    rules: [{ required: true, message: '请输入培训课时' }],
                  })(
                    <Input placeholder="请输入培训课时" />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="课程名称" {...formItemLayout} >
                  {getFieldDecorator('add_online_train_name', {
                    rules: [{ required: false, message: '请输入课程名称' }],
                  })(
                    <Input placeholder="请输入课程名称" />
                  )}
                </FormItem>
              </Row>
            </Card>
          </Form>
        </Modal>

        <Modal
          title="人员成绩信息"
          visible={this.state.personClassGradeVisible2}
          onOk={this.handlePersonClassGradeOk2}
          onCancel={this.handlePersonClassGradeCancel2}
          width={'50%'}
        >
          <Form>
            <Card title="人员成绩信息" className={styles.r}>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人员姓名" {...formItemLayout} >
                  {getFieldDecorator('add_user_name_exam', {
                    rules: [{ required: true, message: '请输入参训人员姓名' }],
                  })(
                    <Input placeholder="请输入参训人员姓名" />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人员用户名" {...formItemLayout} >
                  {getFieldDecorator('add_login_name_exam', {
                    rules: [{ required: true, message: '请输入参训人员用户名' }],
                  })(
                    <Input placeholder="请输入参训人员用户名" />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="是否通过" {...formItemLayout} >
                  {getFieldDecorator('add_if_pass_exam', {
                    initialValue: '是',
                    rules: [{ required: true, message: '请输入是否通过' }],
                  })(
                    <Select placeholder="请选择是否通过" defaultValue='是' disabled={false}>
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="报销费用" {...formItemLayout} >
                  {getFieldDecorator('add_exam_fee', {
                    rules: [{ required: false, message: '请输入报销费用' }],
                  })(
                    <Input placeholder="请输入报销费用" />
                  )}
                </FormItem>
              </Row>
            </Card>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.importGradeModel,
    ...state.importGradeModel,
  };
}

ImportTrainOnlineExamGrade = Form.create()(ImportTrainOnlineExamGrade);
export default connect(mapStateToProps)(ImportTrainOnlineExamGrade)
