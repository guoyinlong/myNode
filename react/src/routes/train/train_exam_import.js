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



class train_exam_import extends React.Component {
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
      train_import_type: 'examTrain',
      train_exam_type: 'in_list',
      examPersonClassGradeDataList: [],
      isSubmitClickable: true,
      personClassGradeVisible2: false,
      visible:false,
      year: new Date().getFullYear().toString(),
      train_scope: '0',
      train_scope_display: false
    }
  }

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    this.props.form.validateFields(
      (err) => {
        if (this.state.examPersonClassGradeDataList.length === 0) {
          message.error("请检查录入的认证考试成绩是否为空，或者是否为认证考试成绩");
          return;
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
            arg_login_name: item.exam_login_name,
            arg_user_name: item.exam_user_name,
            arg_if_pass: item.exam_if_pass,
            arg_import_id: train_exam_import_id,
            arg_class_name: item.exam_name,
            arg_exam_fee: item.exam_fee,
            arg_exam_if_in: item.exam_if_in,
            arg_year: this.state.year,
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
    });
  };
  //选择下一环节处理人，取消
  handleCancel = (e) => {
    this.setState({
      visible: false,
      isSubmitClickable: true
    });
  }

  //导入成绩更新状态
  updateVisible = (value) => {
    if (value) {
      if (this.state.train_import_type === 'examTrain') {
        //导入认证考试成绩显示
        const importExamClassGradeData = this.props.importExamClassGradeDataList;
        if (!importExamClassGradeData) {
          message.error("请检查录入的认证考试成绩是否有误");
        } else {
          this.setState({
            examPersonClassGradeDataList: importExamClassGradeData,
          });
        }
      }
    }
  };

  //导入成绩-关闭model
  handlePersonClassGradeCancel2 = () => {
    this.setState({
      personClassGradeVisible2: false,
    });
  };
  //导入成绩-导入确定，关闭model
  handlePersonClassGradeOk2 = () => {
    let formData = this.props.form.getFieldsValue();
    let add_user_name = formData.add_user_name_exam;
    let add_login_name = formData.add_login_name_exam;
    let add_if_pass = formData.add_if_pass_exam;
    let add_exam_fee = formData.add_exam_fee;
    let add_exam_if_in = formData.add_exam_if_in;
    let trainExamName = formData.trainExamName;

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
    NewDataParam["exam_name"] = trainExamName;
    NewDataParam["exam_if_in"] = add_exam_if_in;
    AddDataSource.push(NewDataParam);
    this.setState({
      examPersonClassGradeDataList: AddDataSource
    });
  };

  //导入认证考试培训成绩展示
  person_exam_class_grade_columns = [
    { title: '序号', dataIndex: 'exam_index_id' },
    { title: '参训人员', dataIndex: 'exam_user_name' },
    { title: '用户名', dataIndex: 'exam_login_name' },
    { title: '是否通过', dataIndex: 'exam_if_pass' },
    { title: '报销费用', dataIndex: 'exam_fee' },
    { title: '是否考试清单', dataIndex: 'exam_if_in' },
    { title: '认证名称', dataIndex: 'exam_name' },
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
    if (this.state.train_import_type === 'examTrain') {
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

  examifin = (value) => {
    if(value=='是'){
      this.setState({
        train_exam_type: 'in_list',
      });
    }else{
      this.setState({
        train_exam_type: 'out_list',
      });
    }
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
        <Row span={2} style={{ textAlign: 'center' }}><h1>认证考试信息录入</h1></Row>
        <br />
        <Form>
          <Row style={{ textAlign: 'left' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span> 模板下载： </span>
            <a href="/filemanage/download/needlogin/hr/training_exam_score.xlsx" ><Button >{'认证考试成绩模板下载'}</Button></a>
          </Row>
          <br/>
          <Card title="培训信息" className={styles.r}>
            <Row gutter={12} >
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'姓名'} {...formItemLayout2}>
                  {getFieldDecorator('staff_name', {
                    initialValue: this.state.staff_name
                  })(<Input style={inputstyle} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'部门'} {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: this.state.dept_name
                  })(<Input style={inputstyle} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ textAlign: 'center' }} >
              <FormItem label={'年度'} {...formItemLayout}>
                <Select showSearch style={{ width: 70 }} value={this.state.year} onSelect={this.onChangeDatePicker}>
                  <Option value={(new Date().getFullYear() - 2).toString()}>{(new Date().getFullYear() - 2).toString()}</Option>
                  <Option value={(new Date().getFullYear() - 1).toString()}>{(new Date().getFullYear() - 1).toString()}</Option>
                  <Option value={(new Date().getFullYear()).toString()}>{(new Date().getFullYear()).toString()}</Option>
                </Select>
              </FormItem>
            </Row>

            <Col>
              <Row style={{ textAlign: 'center' }}>
                <ExcelImportPersonGrade dispatch={this.props.dispatch} updateVisible={this.updateVisible} importType={this.state.train_import_type} />
              </Row>
            </Col>

            <Col span={24} style={{ textAlign: 'center' }}>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="上传附件：" hasFeedback {...formItemLayout}>
                  <UpFileImportGrade filelist={fileList}
                                     name={name}
                                     url={url} />
                </FormItem>
              </Row>
            </Col>

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
        </Card>

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
                <FormItem label="是否考试清单" {...formItemLayout} >
                  {getFieldDecorator('add_exam_if_in', {
                    initialValue: '是',
                    rules: [{ required: true, message: '请输入是否考试清单' }],
                  })(
                    <Select placeholder="请选择是否考试清单" defaultValue='是' disabled={false} onChange={this.examifin.bind(this)}>
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>
              {
                  this.state.train_exam_type != 'in_list'
                    ?
                    //申请原因及培训需求
                    <Col>
                      <Row style={{ textAlign: 'center' }}>
                        <FormItem label="认证考试名称" hasFeedback {...formItemLayout}>
                          {getFieldDecorator('trainExamName', {
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
                    </Col>
              }

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

train_exam_import = Form.create()(train_exam_import);
export default connect(mapStateToProps)(train_exam_import)
