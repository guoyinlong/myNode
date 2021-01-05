/**
 * 文件说明：线上培训与认证考试培训成绩导入
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-08-30
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Table, Select, Modal, message, Card } from 'antd';
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import CheckFile from "./checkFile";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class ImportTrainOnlineExamGradeApproval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitClickable: true,
      choiseOpinionFlag: "none",
      nextstep: '',
      //是否是最后一步
      arg_if_end: '0',
      //下一环节处理人id
      nextPersonID: '',
    }
  }

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    let approvalInfoRecord = this.props.approvalInfoRecord;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let rejectAdvice = this.props.form.getFieldValue("rejectAdvice");
    if (approval_if === '不同意') {
      this.setState({
        nextstep: "驳回至申请人",
      });
    } else {
      this.setState({
        nextstep: "",
      });
    }
    if (approvalInfoRecord.step !== '人力资源专员归档') {
      if (rejectAdvice === '' || rejectAdvice === undefined || rejectAdvice === null) {
        message.error("请填写驳回意见！");
      } else {
        this.setState({
          visible: true,
        });
      }
    } else {
      this.setState({
        visible: true,
      });
    }
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
    const { dispatch } = this.props;
    this.props.form.validateFields((err) => {
      if (err) {
        message.error("请填写必填项");
        this.setState({ isSubmitClickable: true });
      }
      else {
        let formData = this.props.form.getFieldsValue();
        let approvalInfoRecord = this.props.approvalInfoRecord;
        let nextDataList = this.props.nextPersonList;

        let nextPersonID = '';
        let arg_if_end = '0';

        if (this.state.nextstep !== '驳回至申请人') {
          if (nextDataList !== undefined) {
            if (nextDataList.length > 0) {
              if (approvalInfoRecord.step === '部门负责人审批') {
                nextPersonID = nextDataList[0].train_officer_id;
              } else if (approvalInfoRecord.step === '人力资源专员归档') {
                arg_if_end = '1';
              }
            }
          }
        }
        let transferExamData = {};

        transferExamData["arg_import_id"] = approvalInfoRecord.proc_inst_id;
        transferExamData["arg_approval_if"] = formData.rejectIf;
        transferExamData["arg_approval_advice"] = formData.rejectAdvice;
        transferExamData["arg_next_person_id"] = nextPersonID;
        transferExamData["arg_next_person_name"] = formData.nextStepPerson;
        transferExamData["arg_task_name"] = approvalInfoRecord.proc_task_id;
        transferExamData["arg_if_end"] = arg_if_end;
        console.log("arg_import_id:");
        console.log(approvalInfoRecord.proc_inst_id);
        console.log("arg_approval_if:");
        console.log(formData.rejectIf);
        console.log("arg_approval_advice:");
        console.log(formData.rejectAdvice);
        console.log("arg_next_person_id:");
        console.log(nextPersonID);
        console.log("arg_next_person_name:");
        console.log(formData.nextStepPerson);
        console.log("arg_task_name:");
        console.log(approvalInfoRecord.proc_task_id);
        console.log("arg_if_end:");
        console.log(arg_if_end);
        return new Promise((resolve) => {
          dispatch({
            //审批信息提交
            type: 'importGradeApprovalModel/importExamGradeOperationApprovalSubmit',
            transferExamData,
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

  //选择不同意，显示驳回意见信息
  choiseOpinion = (value) => {
    if (value === "不同意") {
      this.setState({
        choiseOpinionFlag: "",
      })
    } else {
      this.setState({
        choiseOpinionFlag: "none",
      })
    }
  }

  //导入成绩展示
  person_online_class_grade_columns = [
    { title: '序号', dataIndex: 'index_id',width: 50 },
    { title: '参训人员', dataIndex: 'login_name',width: 50 },
    { title: '用户名', dataIndex: 'user_name',width: 50 },
    { title: '是否完成', dataIndex: 'if_pass',width: 50 },
    { title: '课程类型', dataIndex: 'train_import_type',width: 50 },
    { title: '完成时间', dataIndex: 'create_time',width: 50 },
    { title: '培训课时', dataIndex: 'train_hour',width: 50 },
    { title: '课程名称', dataIndex: 'class_name',width: 150 },
    { title: '课程来源', dataIndex: 'train_kind' ,width: 50},
  ];
  person_exam_class_grade_columns = [
    { title: '序号', dataIndex: 'index_id',width: 50 },
    { title: '参训人员', dataIndex: 'login_name',width: 80 },
    { title: '用户名', dataIndex: 'user_name',width: 80 },
    { title: '是否通过', dataIndex: 'if_pass',width: 50 },
    { title: '报销费用', dataIndex: 'exam_fee',width: 50 },
    { title: '是否考试清单', dataIndex: 'exam_if_in',width: 80 },
    { title: '认证名称', dataIndex: 'class_name',width: 200 },
  ];

  render() {
    const inputstyle = { color: '#000' };

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

    //获取下载文件列表
    let filelist = this.props.fileDataList;
    for (let i = 0; i < filelist.length; i++) {
      filelist[i].uid = i + 1;
      filelist[i].status = "done";
    }


    let examAndOnlineGradeList = this.props.examAndOnlineGradeList;
    if (examAndOnlineGradeList) {
      for (let i = 0; i < examAndOnlineGradeList.length; i++) {
        examAndOnlineGradeList[i]["index_id"] = i + 1;
        if(examAndOnlineGradeList[i]["if_pass"]=='0'){
          examAndOnlineGradeList[i]["if_pass"] = '否';
        }else if(examAndOnlineGradeList[i]["if_pass"]=='是'||examAndOnlineGradeList[i]["if_pass"]=='否'){

        }else{
          examAndOnlineGradeList[i]["if_pass"] = '是';
        }
      }
    }

    let approvalInfoRecord = this.props.approvalInfoRecord;

    //意见历史
    const approvalHiList = this.props.approvalHiList;
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
    );

    //选择一下处理人信息
    let nextDataList = this.props.nextPersonList;
    let nextPostName = '';
    let nextPersonName = '';

    //当前审批
    const approvalNowList = this.props.approvalNowList;
    if (this.state.nextstep !== '驳回至申请人') {
      if (nextDataList !== undefined) {
        if (nextDataList.length > 0) {
          if (approvalInfoRecord.step === '部门负责人审批') {
            nextPersonName = nextDataList[0].train_officer_name;
            nextPostName = '人力资源专员归档';
          } else if (approvalInfoRecord.step === '人力资源专员归档') {
            nextPersonName = approvalInfoRecord.create_person_name;
            nextPostName = '结束';
          }
        }
      }
    } else {
      if (nextDataList !== undefined) {
        if (nextDataList.length > 0) {
          nextPostName = '驳回至申请人';
          approvalInfoRecord = '结束';
        }
      }
    }


    let nowdataList = '';
    if (approvalInfoRecord.step === '人力资源专员归档') {
      nowdataList = '';
    } else {
      nowdataList = approvalNowList.map(item =>
        <span>
          <FormItem label={item.task_name} {...formItemLayout}>
            {getFieldDecorator('rejectIf', {
              initialValue: "同意",
            })(
              <Select size="large" style={{ width: 200 }} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
                <Option value="同意">同意</Option>
                <Option value="不同意">不同意</Option>
              </Select>
            )}
          </FormItem>

          <FormItem label="审批驳回意见" {...formItemLayout} style={{ display: this.state.choiseOpinionFlag }}>
            {getFieldDecorator('rejectAdvice', {
              initialValue: "驳回原因",
              rules: [
                {
                  required: true,
                  message: '请填写驳回意见'
                },
              ],
            })(
              <TextArea
                style={{ minHeight: 32 }}
                placeholder="请填写驳回意见"
                rows={2}
              />
            )}
          </FormItem>
        </span>
      );
    }


    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>线上培训&认证考试培训成绩录入审批</h1></Row>
        <br /><br />
        <Form>
          <Card title="培训信息" className={styles.r}>
            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'提交人'} {...formItemLayout2}>
                  {getFieldDecorator('staff_name', {
                    initialValue: approvalInfoRecord.create_person_name
                  })(
                    <Input style={inputstyle} placeholder='' disabled={true} />
                  )}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'部门'} {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: approvalInfoRecord.deptname
                  })(
                    <Input style={inputstyle} placeholder='' disabled={true} />
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* 培训课程 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="请选择类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainImportType', {
                  initialValue: approvalInfoRecord.train_class_type,
                })(
                  <Select style={{ color: '#000' }} placeholder="请选择类型" disabled={true}>
                    <Option value="onlineTrain">线上培训</Option>
                    <Option value="examTrain">认证考试</Option>
                  </Select>
                )}
              </FormItem>
            </Row>

          </Card>

          <Card title="培训人员成绩信息" >
            <div>
              {
                approvalInfoRecord.train_class_type == 'examTrain' ?
                  <Table
                    columns={this.person_exam_class_grade_columns}
                    dataSource={examAndOnlineGradeList}
                    pagination={true}
                    scroll={{x: '60%', y: 200}}
                    width={'60%'}
                    bordered={true}
                  />
                  :
                  <Table
                    columns={this.person_online_class_grade_columns}
                    dataSource={examAndOnlineGradeList}
                    pagination={true}
                    scroll={{x: '60%', y: 200}}
                    width={'60%'}
                    bordered={true}
                  />
              }
            </div>
          </Card>

          <Card title="查看附件"
            style={{ display: (filelist && filelist[0] && filelist[0].name) ? "" : "none" }}
          >
            <CheckFile filelist={filelist} />
          </Card>

          <Card title="审批信息">
            <span style={{ textAlign: 'center' }}>
              {hidataList}
            </span>

            <span style={{ textAlign: 'center' }}>
              {nowdataList}
            </span>

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
                {getFieldDecorator('nextPostName', {
                  initialValue: nextPostName
                })(
                  <Input style={inputstyle} size="large" width={"100%"} />
                )}
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextStepPerson', {
                  initialValue: nextPersonName
                })(
                  <Input size="large" width={"100%"} />
                )}
              </FormItem>
            </div>
          </Modal>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.importGradeApprovalModel,
    ...state.importGradeApprovalModel,
  };
}

ImportTrainOnlineExamGradeApproval = Form.create()(ImportTrainOnlineExamGradeApproval);
export default connect(mapStateToProps)(ImportTrainOnlineExamGradeApproval)
