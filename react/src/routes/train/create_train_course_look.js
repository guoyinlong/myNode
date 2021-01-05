/**
 * 文件说明：培训班审批-查看
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-12-30 
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, Modal, Table, Card } from 'antd';

import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";

import CheckFile from "./checkFile";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class CreateTrainCourseLook extends React.Component {
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
      nextstep: '',
      endstepflag: false,
      //培训课程类型
      trainClassApplyType: '',
      choiseOpinionFlag: "none",
      //培训组织信息
      trainNumberPerson: '',
      trainUseFee: '',
      trainOrgan: '',
      //是否采购、考试、评估
      is_purchase: '',
      is_exam: '',
      is_assessment: '',
      //成绩model显示
      personClassGradeVisible: false,
      personClassGradeDataList: [],
      //点击显示人员成绩信息
      showPersonGradeVisable: false,
    }
  };


  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  };

  //导入成绩-关闭model
  handlePersonClassGradeCancel = () => {
    this.setState({
      personClassGradeVisible: false,
    });
  };

  //导入成绩-关闭model
  handleShowPersonClassGradeCancel = () => {
    this.setState({
      showPersonGradeVisable: false,
    });
  };

  //导入成绩-导入确定，关闭model
  handlePersonClassGradeOk = () => {
    this.setState({
      personClassGradeVisible: false,
    });
  };

  //展示成绩-展示确定，关闭model
  handleShowPersonClassGradeOk = () => {
    this.setState({
      showPersonGradeVisable: false,
    });
  };


  //审批导入成绩展示
  show_person_class_grade_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '参训人员', dataIndex: 'user_name' },
    { title: '培训地区', dataIndex: 'train_area' },
    { title: '考试成绩', dataIndex: 'train_class_grade' },
    { title: '是否合格', dataIndex: 'if_pass' },
  ];

  //点击显示人员成绩信息
  showPesonGrade = e => {
    this.setState({
      showPersonGradeVisable: true,
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const approvalInfoRecord = this.props.approvalInfoRecord;
    const showPersonClassGradeDataList = this.props.showPersonClassGradeDataList;
    if (showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) {
      for (let i = 0; i < showPersonClassGradeDataList.length; i++) {
        showPersonClassGradeDataList[i]["indexID"] = i + 1;
      }
    }
    console.log("approvalInfoRecord===" + JSON.stringify(approvalInfoRecord));
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

    //参训人员信息
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
    //let { teacherList, teacherDateList } = this.props;
    let { teacherDateList } = this.props;
    // let teachertext = '';
    // if (teacherList && teacherList.length > 0) {
    //   teachertext = teacherList[0].teacher;
    // }
    let showdisabled = true;
    let teacherData = ''
    if (teacherDateList && teacherDateList.length > 0) {
      teacherData = teacherDateList.map(item =>
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
    }
    //显示申请的子课程信息
    let CourseClassInfo = '';
    const courseClassData = this.props.courseClassDataList;
    if (courseClassData.length > 0) {
      CourseClassInfo = courseClassData.map(item =>
        <Col span={8}>
          <Card style={{ textAlign: 'left', width: '100%' }} type="inner">
            <p>子课程号：{item.class_id}</p>
            <p>课程类型：{item.train_class_apply_type === '1' ? '内训-参加集团及系统内培训' : (item.train_class_apply_type === '2' ? '内训-自有内训师' : '内训-外请讲师')}</p>
            <p>课程名：{item.train_class_input}</p>
            <p>培训师：{item.train_teacher_input}</p>
            <p>培训时间：{item.train_time}</p>
            <p>培训时长(小时)：{item.train_hour}</p>
            <p>子课程培训费用：{item.course_fee}</p>
          </Card>
        </Col>
      );
    } else {
      CourseClassInfo = '';
    }
    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>培训班审批信息查看</h1></Row>
        <br /><br />
        <Form>
          <Card title="培训班申请信息" className={styles.r}>
            {/* 申请人信息 */}
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

            {/*创建人联系方式*/}
            <Row style={{ textAlign: 'center' }}>
              {/*联系方式*/}
              <FormItem label="联系方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobilePhone', {
                  initialValue: approvalInfoRecord.mobile_phone,
                })(<Input style={{ color: '#000' }} placeholder="您的常用手机号（11位）" disabled={true} />)}
              </FormItem>
            </Row>

            {/*是否是计划内培训班*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label="是否是计划内培训：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('is_out_of_plan', {
                  initialValue: approvalInfoRecord.is_out_of_plan === '0' ? "是" : "否",
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
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

            {/* 培训班名称 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="请选择培训班类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainClassTypeIn', {
                  initialValue: approvalInfoRecord.train_class_type,
                })(
                  <Select style={{ color: '#000' }} placeholder="" disabled={true}>
                    <Option value="compulsory">全院级必修课程培训班</Option>
                    <Option value="elective">全院级选修课程培训班</Option>
                    <Option value="common1">全院级-其他培训计划</Option>
                    <Option value="common2">分院级培训计划</Option>
                    <Option value="common3">部门级培训计划</Option>
                  </Select>
                )}
              </FormItem>
              <Col >
                <FormItem label="培训班" {...formItemLayout} >
                  {getFieldDecorator('trainClassSelect', {
                    initialValue: approvalInfoRecord.train_class_name,
                  })(
                    // 如果是计划内查询出能申请的培训班，如果是计划外，则手动添加多个课程
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

            {/*描述参加人员*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="拟参加人员" hasFeedback {...formItemLayout}>
                <TextArea
                  style={{ color: '#000', minHeight: 32 }}
                  value={(personsList[0] ? personsList[0].train_person_name : null)}
                  autosize={{ maxRows: 10 }}
                  disabled={true}
                />
              </FormItem>
            </Row>
            <Card title="查看子课程信息"
              style={{ display: (courseClassData && courseClassData[0]) ? "" : "none" }}
            >
              <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row gutter={16}>
                  {CourseClassInfo}
                </Row>
              </div>
            </Card>

            <Card title="前审批信息">
              <span style={{ textAlign: 'center', color: '#000' }}>
                {hidataList1}
              </span>
            </Card>
            {/*申请人执行*/}
            <Card title="组织培训情况信息"
              style={{ display: (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "人力接口人归档" || approvalInfoRecord.step === "处理完毕") ? " " : "none" }}
            >
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="培训费用" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainUseFee', {
                    initialValue: approvalInfoRecord.trainUseFee,
                    rules: [
                      {
                        pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,
                        message: '请填写正确格式（整数或者最多2位小数）的培训费用预算（元）'
                      },
                    ],
                  })(
                    <Input style={{ color: '#000' }} initialValue={approvalInfoRecord.trainUseFee} disabled={true} />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人数" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainNumberPerson', {
                    initialValue: approvalInfoRecord.trainNumberPerson,
                    rules: [
                      {
                        pattern: /^([1-9][0-9]*)?$/,
                        message: '请填写正确格式（整数）的参训人数'
                      },
                    ],
                  })(
                    <Input style={{ color: '#000' }} initialValue={approvalInfoRecord.trainNumberPerson} disabled={approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? false : true} />
                  )}
                </FormItem>
              </Row>

              {/* 是否考试 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="是否组织考试" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('is_exam', {
                    initialValue: approvalInfoRecord.is_exam,
                    rules: [
                      {
                        message: '请选择是否组织考试'
                      },
                    ],
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
                    rules: [
                      {
                        message: '请选择是否进行效果评估'
                      },
                    ],
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
                    rules: [
                      {
                        message: '请填写赋分原则'
                      },
                    ],
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
              <Row style={{ textAlign: 'center', display: (approvalInfoRecord.step === "人力接口人归档" || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "处理完毕") ? " " : "none" }}>
                <Button disabled={(showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) ? false : true} onClick={this.showPesonGrade} style={{ color: '#000' }}>{(showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) ? '成绩已提交保存，点击查看' : null}</Button>
              </Row>
            </Card>

        
            <Card title="查看培训申请附件"
              style={{ display: (filelistcheck && filelistcheck[0] && filelistcheck[0].name) ? "" : "none" }}
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
    loading: state.loading.models.createApprovalModel,
    ...state.createApprovalModel,
  };
}

CreateTrainCourseLook = Form.create()(CreateTrainCourseLook);
export default connect(mapStateToProps)(CreateTrainCourseLook)
