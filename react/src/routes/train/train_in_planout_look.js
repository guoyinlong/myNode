/**
 * 文件说明：创建离职申请、离职交接、离职清算流程,models
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React from 'react';
import {
  Form,
  Row,
  Col, 
  Input,
  Button,
  DatePicker,
  Select,
  Modal,
  TreeSelect,
  message,
  Card,
  Radio,
  Transfer,
  Table
} from 'antd';
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import moment from 'moment';
import CheckFile from "./checkFile";
import ExcelPersonGrade from "./ExcelPersonGrade2";


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class train_in_planout_look extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isSubmitClickable: true,
      isSaveClickable: true,
      leave_apply_id_save: '',
      personFlag: false,
      trainStartTime: '',
      trainEndTime: '',
      //培训课程类型
      trainClassApplyType: '',
      //点击显示人员成绩信息
      showPersonGradeVisable: false,
    }
  }
  //审批导入成绩展示
  show_person_class_grade_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '参训人员', dataIndex: 'user_name' },
    { title: '培训地区', dataIndex: 'train_area' },
    { title: '考试成绩', dataIndex: 'train_class_grade' },
    { title: '是否合格', dataIndex: 'if_pass' },
  ];
  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  }
  //点击显示人员成绩信息
  showPesonGrade = e => {
    this.setState({
      showPersonGradeVisable: true,
    });
  };
  //导入成绩-关闭model
  handleShowPersonClassGradeCancel = () => {
    this.setState({
      showPersonGradeVisable: false,
    });
  };
  //展示成绩-展示确定，关闭model
  handleShowPersonClassGradeOk = () => {
    this.setState({
      showPersonGradeVisable: false,
    });
  };
  render() {
    //传过来的信息
    const { approvalInfoRecord, showPersonClassGradeDataList } = this.props;
    let showflag = "none";
    if (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "人力接口人归档"|| approvalInfoRecord.step === "处理完毕" || approvalInfoRecord.step === "结束" ) {
      showflag = "";
    }
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

    //审批信息
    //意见列表
    const approvalHiList = this.props.approvalHiList;
    const hidataList1 = approvalHiList.map(item =>
      item.task_name === "部门负责人审批" || item.task_name === "内训师所在部门负责人审批" || item.task_name === "内训师确认" || item.task_name === "人力接口人确认"|| item.task_name === "分管领导审批" || item.task_name === "分管院长审批"?
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
      :
     <br></br>
    );

    const hidataList2 = approvalHiList.map(item =>
      item.task_name === "申请人组织培训" || item.task_name === "接口人提交执行培训" || item.task_name === "部门负责人审核" || item.task_name === "部门负责人审核-执行完" || item.task_name === "人力接口人归档"|| item.task_name === "人力资源专员归档"|| item.task_name === "结束"|| item.task_name === "处理完毕"?
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
      :
      <br></br>
      );
    const personsList = this.props.personsList;
    //附件信息
    //获取下载文件列表
    let filelistcheck = this.props.fileDataListCheck;
    if (filelistcheck && filelistcheck.length > 0) {
      for (let i = 0; i < filelistcheck.length; i++) {
        filelistcheck[i].uid = i + 1;
        filelistcheck[i].status = "done";
      }
    }

    let filelistexec = this.props.fileDataListExec;
    if (filelistexec && filelistexec.length > 0) {
      for (let i = 0; i < filelistexec.length; i++) {
        filelistexec[i].uid = i + 1;
        filelistexec[i].status = "done";
      }
    }
    //培训老师
    let { teacherList, teacherDateList } = this.props;
    let teachertext = '';
    if (teacherList.length > 0) {
      teachertext = teacherList[0].teacher;
    }
    let showdisabled = true;
    let teacherData = teacherDateList.map(item =>
      <span>{item.teacher_name}：{getFieldDecorator(item.id, {
        initialValue: item.socre,
        rules: [
          {
            pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,
            message: '请填写正确格式（整数或者最多2位小数）的评估成绩'
          },
        ],
      })(<Input style={{ color: '#000', width: '100px' }} disabled={showdisabled} />)
      }
      </span>
    );
    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>
          {
            approvalInfoRecord.train_type_name
          }申请表</h1></Row>
        <br /><br />
        <Form>
          <Card title="申请信息" className={styles.r}>
            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'申请人'} {...formItemLayout2}>
                  {getFieldDecorator('staff_name', {
                    initialValue: approvalInfoRecord.create_person_name
                  })(<Input style={{ color: '#000' }} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'部门'} {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: approvalInfoRecord.deptname
                  })(<Input style={{ color: '#000' }} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
            </Row>

            {/*联系方式*/}
            <Row style={{ textAlign: 'center' }}>
              {/*联系方式*/}
              <FormItem label="联系方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobilePhone', {
                  initialValue: approvalInfoRecord.mobile_phone,
                })(<Input style={{ color: '#000' }} placeholder="您的常用手机号（11位）" disabled={true} />)}
              </FormItem>
            </Row>

            {/*是否是计划内培训*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label="是否是计划内培训：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('is_out_of_plan', {
                  initialValue: approvalInfoRecord.is_out_of_plan === '0' ? "是" : "否",
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*培训老师*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label="培训老师：" hasFeedback {...formItemLayout}>
                <TextArea
                  style={{ color: '#000', minHeight: 32 }}
                  autosize
                  disabled={true}
                  value={teachertext}
                />
              </FormItem>
            </Row>

            {/* 培训课程类型 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训课程类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainClassType', {
                  initialValue: approvalInfoRecord.train_class_type,
                })(
                  <Select style={{ color: '#000' }} placeholder="" disabled={true}>
                    <Option value="compulsory">全院级必修课程</Option>
                    <Option value="elective">全院级选修课程</Option>
                    <Option value="common1">全院级-其他培训计划</Option>
                    <Option value="common2">分院级培训计划</Option>
                    <Option value="common3">部门级培训计划</Option>
                  </Select>
                )}
              </FormItem>
              <Col >
                <FormItem label="培训课程" {...formItemLayout} >
                  {getFieldDecorator('trainClassSelect', {
                    initialValue: approvalInfoRecord.train_class_name,
                    rules: [
                      {
                        message: '请选择培训课程'
                      },
                    ],
                  })(
                    // 如果是计划内查询出能申请的课程，如果是计划外，则手动输入
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Col>
            </Row>

            {/*申请原因及培训需求*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="申请原因及培训需求" hasFeedback {...formItemLayout}>
                {getFieldDecorator('reasonAndRequire', {
                  initialValue: approvalInfoRecord.train_reason_and_require,
                })(
                  <TextArea
                    style={{ color: '#000', minHeight: 32 }}
                    placeholder="申请原因及培训需求"
                    autosize
                    disabled={true}
                  />
                )}
              </FormItem>
            </Row>

            {/*培训费用预算*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训费用预算" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainFee', {
                  initialValue: approvalInfoRecord.train_fee + '元',
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*拟参加人员*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="拟参加人员" hasFeedback {...formItemLayout}>
                <TextArea
                  style={{ color: '#000', minHeight: 32 }}
                  value={approvalInfoRecord.is_out_of_plan === '0' ? (personsList[0] ? personsList[0].train_person_name : null) : (personsList[0] ? personsList[0].user_name : null)}
                  autosize={{ maxRows: 10 }}
                  disabled={true}
                />
              </FormItem>
            </Row>

            {/*培训开始时间*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label={'培训开始时间'} {...formItemLayout}>
                {getFieldDecorator('train_start_time', {
                  initialValue: approvalInfoRecord.train_start_time,
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*培训结束时间*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label={'培训结束时间'} {...formItemLayout}>
                {getFieldDecorator('train_end_time', {
                  initialValue: approvalInfoRecord.train_end_time,
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*培训地点*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训地点" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainPlace', {
                  initialValue: approvalInfoRecord.train_place,
                })(
                  <Input style={{ color: '#000' }} placeholder="培训地点" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*培训目标（如有证书请注明）*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训目标" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainTarget', {
                  initialValue: approvalInfoRecord.train_target,
                })(
                  <TextArea
                    style={{ minHeight: 32, color: '#000' }}
                    placeholder="培训目标（如有证书请注明）"
                    autosize
                    disabled={true}
                  />
                )}
              </FormItem> 
            </Row>
            <Card title="前审批信息">
              <span style={{ textAlign: 'center', color: '#000' }}>
                {hidataList1}
              </span>
            </Card>

            {/*申请人执行*/}
            <Card title="组织培训情况信息" style={{ display: showflag }}
            >
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="培训费用" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainUseFee', {
                    initialValue: approvalInfoRecord.trainUseFee,
                  })(
                    <Input style={{ color: '#000' }} initialValue={approvalInfoRecord.trainUseFee} disabled={true} />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人数" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainNumberPerson', {
                    initialValue: approvalInfoRecord.trainNumberPerson,
                  })(
                    <Input style={{ color: '#000' }} initialValue={approvalInfoRecord.trainNumberPerson} disabled={true} />
                  )}
                </FormItem>
              </Row>

              {/* 是否考试 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="是否组织考试" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('is_exam', {
                    initialValue: approvalInfoRecord.is_exam,
                  })(
                    <Select onChange={this.isExam} style={{ color: '#000' }} placeholder="" disabled={true}>
                      <Option value="0">是</Option>
                      <Option value="1">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>

              {/* 是否进行效果评估 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="是否进行效果评估" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('is_assessment', {
                    initialValue: approvalInfoRecord.is_assessment,
                  })(
                    <Select style={{ color: '#000' }} onChange={this.isAssessment} placeholder="" disabled={true}>
                      <Option value="0">是</Option>
                      <Option value="1">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>

              {/* 效果评估结果 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="老师评估结果" hasFeedback {...formItemLayout}>
                  {teacherData}
                </FormItem>
              </Row>

              {/*赋分原则*/}
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="赋分原则" hasFeedback {...formItemLayout} >
                  {getFieldDecorator('train_principle', {
                    initialValue: approvalInfoRecord.train_principle,
                  })(
                    <TextArea
                      style={{ minHeight: 32, color: '#000' }}
                      placeholder="请填写赋分原则"
                      rows={4}
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Row>

              {/*审批时，查看导入的成绩*/}
              <Row style={{ textAlign: 'center', display: (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "人力接口人归档"|| approvalInfoRecord.step === "结束" || approvalInfoRecord.step === "处理完毕"  || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完") ? " " : "none" }}>
                <Button disabled={(showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) ? false : true} onClick={this.showPesonGrade} style={{ color: '#000' }}>{(showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) ? '成绩已提交保存，点击查看' : null}</Button>
              </Row>

            </Card>

            <Card title="查看培训申请附件"
              style={{ display: (filelistcheck && filelistcheck[0] && filelistexec[0].name) ? "" : "none" }}
            >
              <CheckFile filelist={filelistcheck} />
            </Card>

            <Card title="查看培训执行附件"
              style={{ display: (filelistexec && filelistexec[0] && filelistexec[0].name) ? "" : "none" }}
            >
              <CheckFile filelist={filelistexec} />
            </Card>

            <Card title="后审批信息"                     
              style={{ display: (approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "人力接口人归档"|| approvalInfoRecord.step === "人力资源专员归档"|| approvalInfoRecord.step === "结束"|| approvalInfoRecord.step === "处理完毕"  ) ? "" : "none" }}
              >
              <span style={{ textAlign: 'center', color: '#000' }}>
                {hidataList2}
              </span>
            </Card>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button onClick={this.goBack}>{'返回'}</Button>
            </Col>

          </Card>

          <Modal
            title="考试人员成绩信息"
            visible={this.state.showPersonGradeVisable}
            onOk={this.handleShowPersonClassGradeOk}
            onCancel={this.handleShowPersonClassGradeCancel}
            width={'60%'}

          >
            <div>
              <Table
                columns={this.show_person_class_grade_columns}
                dataSource={showPersonClassGradeDataList}
                pagination={true}
                bordered={true}
              />
            </div>
          </Modal>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_in_approval_model,
    ...state.train_in_approval_model,
  };
}

train_in_planout_look = Form.create()(train_in_planout_look);
export default connect(mapStateToProps)(train_in_planout_look)
