/**
 * 文件说明：创建离职申请、离职交接、离职清算流程,models
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React from 'react'; 
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, TreeSelect, message, Card, Radio, Transfer } from 'antd';
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import moment from 'moment';
import CheckFile from "./checkFile";


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class CreateTrainApplyLook extends React.Component {
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
      trainClassApplyType: ''
    }
  }


  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  }

  render() {

    //传过来的信息
    const queryRecord = this.props.applyInfoRecord;

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
    console.log('OOOOOOOO')
    console.log(approvalHiList)
    console.log('OOOOOOOO') 

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

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>外训培训申请表</h1></Row>
        <br /><br />
        <Form>
          <Card title="申请信息" className={styles.r}>
            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'申请人'} {...formItemLayout2}>
                  {getFieldDecorator('staff_name', {
                    initialValue: queryRecord.create_person_name
                  })(<Input style={{ color: '#000' }} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'部门'} {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: queryRecord.deptname
                  })(<Input style={{ color: '#000' }} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
            </Row>

            {/*联系方式*/}
            <Row style={{ textAlign: 'center' }}>
              {/*联系方式*/}
              <FormItem label="联系方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobilePhone', {
                  initialValue: queryRecord.mobile_phone,
                })(<Input style={{ color: '#000' }} placeholder="您的常用手机号（11位）" disabled={true} />)}
              </FormItem>
            </Row>

            {/*是否是计划内培训*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label="是否是计划内培训：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('is_out_of_plan', {
                  initialValue: queryRecord.is_out_of_plan === '0' ? "是" : "否",
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  // <Radio.Group style={{color:'#000'}} value={queryRecord.is_out_of_plan} disabled={true}>
                  //   <Radio value={'0'}>是</Radio>
                  //   <Radio value={'1'}>否</Radio>
                  // </Radio.Group> 
                )}
              </FormItem>
            </Row>
            {/* 培训课程类型 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训课程类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainClassType', {
                  initialValue: queryRecord.train_class_type,
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
                    initialValue: queryRecord.train_class_name,
                  })(
                    // 如果是计划内查询出能申请的课程，如果是计划外，则手动输入
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Col>
            </Row>

            {/*拟参加人员*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="拟参加人员" hasFeedback {...formItemLayout}>
                <TextArea
                  style={{ color: '#000', minHeight: 32 }}
                  value={queryRecord.is_out_of_plan === '0' ? (personsList[0] ? personsList[0].train_person_name : null) : (personsList[0] ? personsList[0].user_name : null)}
                  autosize={{ maxRows: 10 }}
                  disabled={true}
                />
              </FormItem>
            </Row>

            {/*申请原因及培训需求*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="申请原因及培训需求" hasFeedback {...formItemLayout}>
                {getFieldDecorator('reasonAndRequire', {
                  initialValue: queryRecord.train_reason_and_require,
                })(
                  <TextArea
                    style={{ minHeight: 32, color: '#000' }}
                    placeholder="申请原因及培训需求"
                    rows={4}
                    disabled={true}
                  />
                )}
              </FormItem>
            </Row>

            {/*培训费用预算*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训费用预算" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainFee', {
                  initialValue: queryRecord.train_fee + '元',
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>


            {/*培训开始时间*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label={'培训开始时间'} {...formItemLayout}>
                {getFieldDecorator('train_start_time', {
                  //initialValue:moment(queryRecord.train_start_time,'YYYY-MM-DD'), 
                  initialValue: queryRecord.train_start_time,
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*培训结束时间*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label={'培训结束时间'} {...formItemLayout}>
                {getFieldDecorator('train_end_time', {
                  //initialValue:moment(queryRecord.train_end_time,'YYYY-MM-DD'),
                  initialValue: queryRecord.train_end_time,
                })(
                  <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                )}
              </FormItem>
            </Row>
            {/*培训地点*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训地点" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainPlace', {
                  initialValue: queryRecord.train_place,
                })(
                  <Input style={{ color: '#000' }} placeholder="培训地点" disabled={true} />
                )}
              </FormItem>
            </Row>

            {/*培训目标（如有证书请注明）*/}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="培训目标" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainTarget', {
                  initialValue: queryRecord.train_target,
                })(
                  <TextArea
                    style={{ minHeight: 32, color: '#000' }}
                    placeholder="培训目标（如有证书请注明）"
                    rows={4}
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
            <Card title="组织培训情况信息"
              style={{ display: (queryRecord.step === "接口人提交执行培训" || queryRecord.step === "申请人组织培训" || queryRecord.step === "部门负责人审核-执行完" || queryRecord.step === "部门负责人审核" || queryRecord.step === "人力资源专员归档"|| queryRecord.step === "结束"  || queryRecord.step === "处理完毕") ? " " : "none" }}
            >
              {/*培训费用预算*/}
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="培训机构" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainOrgan', {
                    initialValue: queryRecord.trainOrgan,
                    rules: [
                      {
                        message: '请填写培训机构'
                      },
                    ],
                  })(
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="培训费用" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainUseFee', {
                    initialValue: queryRecord.trainUseFee,
                    rules: [
                      {
                        message: '请填写正培训费用'
                      },
                    ],
                  })(
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人数" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainNumberPerson', {
                    initialValue: queryRecord.trainNumberPerson,
                    rules: [
                      {
                        pattern: /^([1-9][0-9]*)?$/,
                        message: '请填写正确格式（整数）的参训人数'
                      },
                    ],
                  })(
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Row>

              {/* 是否采购 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="是否采购" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('is_out_of_plan', {
                    initialValue: queryRecord.is_purchase === '0' ? "是" : "否",
                  })(
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Row>

              {/* 是否考试 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="是否组织考试" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('is_out_of_plan', {
                    initialValue: queryRecord.is_exam === '0' ? "是" : "否",
                  })(
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Row>

              {/* 是否进行效果评估 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="是否进行效果评估" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('is_out_of_plan', {
                    initialValue: queryRecord.is_assessment === '0' ? "是" : "否",
                  })(
                    <Input style={{ color: '#000' }} placeholder="" disabled={true} />
                  )}
                </FormItem>
              </Row>

              {/*赋分原则*/}
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="赋分原则" hasFeedback {...formItemLayout} >
                  {getFieldDecorator('train_principle', {
                    initialValue: queryRecord.train_principle,
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

              {/*请填写培训讲师（姓名）*/}
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="请填写培训讲师（姓名）" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('train_teacher', {
                    initialValue: queryRecord.train_teacher,
                    rules: [
                      {
                        message: '请填写培训讲师（姓名）'
                      },
                    ],
                  })(
                    <TextArea
                      style={{ minHeight: 32, color: '#000' }}
                      placeholder="请填写培训讲师（姓名）"
                      rows={4}
                      disabled={true}
                    />
                  )}
                </FormItem>
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
                  style={{ display: (queryRecord.step === "申请人组织培训" || queryRecord.step === "接口人提交执行培训" || queryRecord.step === "部门负责人审核" || queryRecord.step === "部门负责人审核-执行完" || queryRecord.step === "人力接口人归档"|| queryRecord.step === "人力资源专员归档"|| queryRecord.step === "结束"|| queryRecord.step === "处理完毕"  ) ? "" : "none" }}
            >
              <span style={{ textAlign: 'center', color: '#000' }}>
                {hidataList2}
              </span>
            </Card>

            <Col span={24} style={{ textAlign: 'center' }}>
              <Button onClick={this.goBack}>{'返回'}</Button>
            </Col>

          </Card>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.createApplyModel,
    ...state.createApplyModel,
  };
}

CreateTrainApplyLook = Form.create()(CreateTrainApplyLook);
export default connect(mapStateToProps)(CreateTrainApplyLook)
