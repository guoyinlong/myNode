/**
 * 文件说明：内训申请-审批
 * 作者：wangfj80
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-12-14
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, Modal, Table, message, Card } from 'antd';
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import ExcelPersonGrade from "./ExcelPersonGrade2";
import CheckFile from "./checkFile";
import Cookie from "js-cookie";
import UpFileApply from "./upFileApplyInOut";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class train_in_planin_approval extends React.Component {
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
      //提示参训人数限制
      confirmPersonNumValue: false,
      //提示参训人数限制25人
      confirmPersonNumValue25: false,
    }
  }

  //当前时间
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  }

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    const approvalInfoRecord = this.props.approvalInfoRecord;
    if (approvalInfoRecord.step === '接口人提交执行培训' || approvalInfoRecord.step === "申请人组织培训") {
      //判断是否是申请人组织培训
      let trainUseFee = this.props.form.getFieldValue("trainUseFee");
      let trainNumberPerson = this.props.form.getFieldValue("trainNumberPerson");
      let is_exam = this.state.is_exam;
      let is_assessment = this.state.is_assessment;
      let train_principle = this.props.form.getFieldValue("train_principle");
      let transferPersonClassGradeData = this.state.personClassGradeDataList;
      if (trainUseFee === '' || trainUseFee === undefined || trainUseFee === null) {
        message.error("请输入培训费用");
        return;
      } else if (trainNumberPerson === '' || trainNumberPerson === undefined || trainNumberPerson === null) {
        message.error("请输入参训人数");
        return;
      } else if (is_exam === '' || is_exam === undefined || is_exam === null) {
        message.error("请选择是否组织考试");
        return;
      } else if (is_assessment === '' || is_assessment === undefined || is_assessment === null) {
        message.error("请选择是否进行效果评估");
        return;
      } else if (train_principle === '' || train_principle === undefined || train_principle === null) {
        message.error("请填写赋分原则");
        return;
      } else if (parseInt(approvalInfoRecord.train_fee) < parseInt(trainUseFee)) {
        message.error("您填写的培训组织执行费用大于培训预算,请返回修改后提交!");
        return;
      } else if (transferPersonClassGradeData.length < 1) {
        message.error('导入的人员成绩信息为空，请填写后提交');
        return;
      } else {
        this.setState({
          trainNumberPerson: trainNumberPerson,
          trainUseFee: trainUseFee,
          train_principle: train_principle,
          is_exam: is_exam,
          is_assessment: is_assessment,
        });
        let approval_if = this.props.form.getFieldValue("rejectIf");
        if (approval_if === '不同意') {
          this.setState({
            nextstep: "驳回至申请人",
            trainNumberPerson: '',
            trainUseFee: '',
            is_exam: '',
            is_assessment: '',
            train_principle: '',
          });
        } else {
          this.setState({
            nextstep: "",
          });
        }
        if (approvalInfoRecord.train_apply_type === '3') {
          if (transferPersonClassGradeData.length < 25) {
            this.setState({
              confirmPersonNumValue25: true
            });
          } else if (transferPersonClassGradeData.length >= 25 && transferPersonClassGradeData.length > trainNumberPerson) {
            this.setState({
              confirmPersonNumValue: true
            });
          }else{
            this.setState({
              visible: true,
            });
          }
        } else if (approvalInfoRecord.train_apply_type === '2') {
          if (transferPersonClassGradeData.length > trainNumberPerson) {
            this.setState({
              confirmPersonNumValue: true
            });
          }else{
            this.setState({
              visible: true,
            });
          }
        } else {
          this.setState({
            visible: true,
          });
        }
      }
    } else {
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
      if (approvalInfoRecord.step !== '人力接口人归档') {
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
    }
  };

  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  }

  //导入成绩更新状态
  updateVisible = (value) => {
    this.setState({
      personClassGradeVisible: value,
    });
    if (value) {
      //导入成绩显示
      const personClassGradeDataList = this.props.importPersonClassGradeDataList;
      this.setState({
        personClassGradeDataList: personClassGradeDataList,
      });
    }
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

  //导入成绩展示
  person_class_grade_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '参训人员', dataIndex: 'user_name' },
    { title: '培训地区', dataIndex: 'train_area' },
    { title: '用户名', dataIndex: 'login_name' },
    { title: '考试成绩', dataIndex: 'class_grade' },
    { title: '是否合格', dataIndex: 'if_pass' },
  ];

  //审批导入成绩展示
  show_person_class_grade_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '参训人员', dataIndex: 'user_name' },
    { title: '培训地区', dataIndex: 'train_area' },
    { title: '考试成绩', dataIndex: 'train_class_grade' },
    { title: '是否合格', dataIndex: 'if_pass' },
  ];

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

  //提交审批
  handleOk = () => {
    let teacherDateList = this.props.teacherDateList;

    const { dispatch } = this.props;
    const approvalInfoRecord = this.props.approvalInfoRecord;
    this.setState({ visible: false });
    this.setState({ isSubmitClickable: false });
    let orig_proc_inst_id = approvalInfoRecord.proc_inst_id;
    let orig_proc_task_id = approvalInfoRecord.proc_task_id;
    let orig_train_class_apply_task_id = approvalInfoRecord.task_id;
    let create_person_id = this.props.create_person_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let nextstep = this.state.nextstep;

    let trainOrgan = '';
    let trainUseFee = this.props.form.getFieldValue("trainUseFee");
    let trainNumberPerson = this.props.form.getFieldValue("trainNumberPerson");
    let train_principle = this.props.form.getFieldValue("train_principle");
    let train_teacher = '';
    let is_purchase = '';
    let is_exam = '';
    let is_assessment = '';

    let arg_proc_inst_id = approvalInfoRecord.proc_inst_id;

    //培训评估结果
    let teacherGradeList = [];
    for (let i = 0; i < teacherDateList.length; i++) {
      let teacherGrade = teacherDateList[i];
      let grade = this.props.form.getFieldValue(teacherDateList[i].id);
      teacherGrade['grade'] = grade;
      teacherGradeList.push(teacherGrade);
    }
    this.setState({
      visible: false,
      isSubmitClickable: false
    });
    if (approvalInfoRecord.step === '接口人提交执行培训' || approvalInfoRecord.step === "申请人组织培训") {
      // 考试成绩导入 开始
      is_purchase = this.state.is_purchase;
      is_exam = this.state.is_exam;
      is_assessment = this.state.is_assessment;

      //非空校验
      const transferPersonClassGradeData = this.state.personClassGradeDataList;
      if (transferPersonClassGradeData.length < 1) {
        message.error('导入的人员成绩信息为空，请填写后提交');
        this.setState({
          visible: false,
        });
        this.setState({ isSubmitClickable: true });
        return;
      }
      let transferPersonClassGradeList = [];
      //计划内培训，直接导入人员信息到train_class_personal_info state置为2
      let train_class_personal_info_id = Cookie.get("userid") + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
      //封装课程信息，即train_class_center表数据 begin
      transferPersonClassGradeData.map((item) => {
        let personClassGradeData = {
          arg_train_class_personal_info_id: train_class_personal_info_id,//课程成绩ID
          arg_user_name: item.user_name,//参训人员
          arg_train_area: item.train_area,//地区
          arg_login_name: item.login_name,//用户名
          arg_class_grade: item.class_grade,//考试成绩
          arg_if_pass: item.if_pass,//是否合格
          arg_is_out_of_plan: '0',//计划内培训
          arg_train_class_type: approvalInfoRecord.train_class_type,//培训类型
          arg_train_apply_type: approvalInfoRecord.train_apply_type,//培训申请类型
        };
        transferPersonClassGradeList.push(personClassGradeData);
      });
 
      new Promise((resolve1) => {
        dispatch({
          type: 'train_in_approval_model/trainClassPersonApprovalSubmit',
          transferPersonClassGradeList,
          arg_is_out_of_plan: '0',
          arg_proc_inst_id,
          teacherGradeList,
          resolve1
        });
      }).then((resolve1) => {
        if (resolve1 === 'success') {
          // 提交执行时的附件
          const { pf_url, file_relative_path, file_name } = this.props;
          let exec_data = {};

          if (pf_url && file_relative_path && file_name && pf_url != '' && file_relative_path != '' && file_name != '') {
            exec_data["arg_pf_url"] = this.props.pf_url;
            exec_data["arg_file_relative_path"] = this.props.file_relative_path;
            exec_data["arg_file_name"] = this.props.file_name;

            dispatch({
              type: 'train_in_approval_model/trainClassExecFileSubmit',
              exec_data,
              arg_proc_inst_id,
              arg_train_class_apply_id: orig_train_class_apply_task_id,
            });
          }
          if (approval_if === '不同意' && approval_advice === '') {
            this.setState({ isSubmitClickable: true });
            message.error('意见不能为空');
          } else {
            return new Promise((resolve) => {
              dispatch({
                type: 'train_in_approval_model/trainClassApprovalSubmit',
                approval_if,
                approval_advice,
                nextstepPerson,
                nextstep,
                orig_proc_inst_id,
                orig_proc_task_id,
                orig_train_class_apply_task_id,
                create_person_id,

                trainOrgan,
                trainUseFee,
                trainNumberPerson,
                is_purchase,
                is_exam,
                is_assessment,
                train_principle,
                train_teacher,

                resolve
              });
            }).then((resolve) => {
              if (resolve === 'success') {
                this.setState({ isSubmitClickable: true });
                setTimeout(() => {
                  dispatch(routerRedux.push({
                    pathname: '/humanApp/train/train_do'
                  }));
                }, 500);
              }
              if (resolve === 'false') {
                this.setState({ isSubmitClickable: true });
                return;
              }
            }).catch(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/train_do'
              }));
            });
          }
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_do'
        }));
      });
      //考试成绩导入 结束
    } else {
      if (approval_if === '不同意' && approval_advice === '') {
        this.setState({ isSubmitClickable: true });
        message.error('意见不能为空');
        return;
      } else {
        return new Promise((resolve) => {
          dispatch({
            type: 'train_in_approval_model/trainClassApprovalSubmit',
            approval_if,
            approval_advice,
            nextstepPerson,
            nextstep,
            orig_proc_inst_id,
            orig_proc_task_id,
            orig_train_class_apply_task_id,
            create_person_id,

            trainOrgan,
            trainUseFee,
            trainNumberPerson,
            is_purchase,
            is_exam,
            is_assessment,
            train_principle,
            train_teacher,

            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isSubmitClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/train_do'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isSubmitClickable: true });
            return;
          }
        }).catch(() => {
          this.setState({ isSubmitClickable: true });
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do'
          }));
        });
      }
    }
  };

  //选择下一环节处理人，取消
  handleCancel = (e) => {
    this.setState({
      visible: false,
      isSubmitClickable: true
    });
  }

  //是否采购
  isPurchase = e => {
    this.setState({
      is_purchase: e,
    });
  };

  //是否组织考试
  isExam = e => {
    this.setState({
      is_exam: e,
    });
  };

  //是否进行效果评估
  isAssessment = e => {
    this.setState({
      is_assessment: e,
    });
  };

  //点击显示人员成绩信息
  showPesonGrade = e => {
    const approvalInfoRecord = this.props.approvalInfoRecord;
    if (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训") {
      this.setState({
        personClassGradeVisible: true,
      });
    } else {
      this.setState({
        showPersonGradeVisable: true,
      });
    }
  };

  //确认参训人数后，取消
  confirmCancel = (e) => {
    this.setState({
      confirmPersonNumValue: false,
      isSubmitClickable: true
    });
  };

  //确认参训人数后25，取消
  confirmCancel25 = (e) => {
    this.setState({
      confirmPersonNumValue25: false,
      isSubmitClickable: true
    });
  };
  //确认参训人数后25，确认
  confirmOK25 = (e) => {
    console.log("+++++++++++++++++++++++++");
    console.log(this.state.personClassGradeDataList.length);
    console.log(this.props.form.getFieldValue("trainNumberPerson"));
    console.log("+++++++++++++++++++++++++");
    if (this.state.personClassGradeDataList.length > this.props.form.getFieldValue("trainNumberPerson")) {
      this.setState({
        confirmPersonNumValue25: false,
        confirmPersonNumValue: true
      });
    } else {
      this.setState({
        confirmPersonNumValue25: false
      });
      this.handleOk();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const approvalInfoRecord = this.props.approvalInfoRecord;

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
    const approvalNowList = this.props.approvalNowList;
    //下一环节
    const nextPersonList = this.props.nextPersonList;
    let initperson = '';
    let nextdataList = '';
    if (this.state.nextstep !== '驳回至申请人') {
      if (nextPersonList && nextPersonList.length) {
        this.state.nextstep = nextPersonList[0].submit_post_name;
        initperson = nextPersonList[0].submit_user_id;
        nextdataList = nextPersonList.map(item =>
          <Option value={item.submit_user_id} style={{ width: '100%' }}>{item.submit_user_name}</Option>
        );
      }
    } else {
      const { create_person } = this.props;
      if (create_person.length) {
        initperson = create_person[0].create_person_id;
        nextdataList = create_person.map(item =>
          <Option value={item.create_person_id}>{item.create_person_name}</Option>
        );
      }
    }

    let nowdataList = '';
    if (approvalNowList.length > 0 && approvalNowList[0].task_name.endsWith("归档")) {
      nowdataList = '';
    } else {
      if (this.state.nextstep.endsWith("结束")) {
        nowdataList = '';
      } else {
        let approvalNowList1 = [];
        if (approvalNowList.length > 0) {
          approvalNowList1.push(approvalNowList[0]);
        }
        if (this.state.nextstep.endsWith("内训师确认") || this.state.nextstep.endsWith("人力接口人确认")) {
          nowdataList = approvalNowList1.map(item =>
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
        } else { 
          nowdataList = approvalNowList1.map(item =>
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

      }
    }  
    console.log('KKKKKKKKK')
    console.log(approvalHiList)
    console.log('KKKKKKKKK')

    const hidataList1 = approvalHiList.map(item =>
      item.task_name === "部门负责人审批" || item.task_name === "内训师所在部门负责人审批" || item.task_name === "内训师确认" || item.task_name === "人力接口人确认" || item.task_name === "分管领导审批" || item.task_name === "分管院长审批"?
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
      :
     <p></p>
    );
    const hidataList2 = approvalHiList.map(item =>
      item.task_name === "接口人提交执行培训" || item.task_name === "部门负责人审核-执行完" || item.task_name === "人力接口人归档"? 
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
      :
     <p></p>
    );

    //参训人员信息
    const personsList = this.props.personsList;

    //人员成绩信息
    const showPersonClassGradeDataList = this.props.showPersonClassGradeDataList;
    if (showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) {
      for (let i = 0; i < showPersonClassGradeDataList.length; i++) {
        showPersonClassGradeDataList[i]["indexID"] = i + 1;
      }
    }

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

    //上传附件-附件信息
    let fileListExec = [];
    let nameExec = '';
    let urlExec = '';

    //培训老师
    let { teacherList, teacherDateList } = this.props;
    let teachertext = '';
    if (teacherList.length > 0) {
      teachertext = teacherList[0].teacher;
    }
    let showdisabled = true;
    if (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训") { showdisabled = false; }

    let showApprovalDisabled = true;
    if (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "人力接口人归档") { 
      showApprovalDisabled = false;
     }

    let teacherData = teacherDateList.map(item =>
      <span>{item.teacher_name}：{getFieldDecorator(item.id, {
        initialValue: item.socre,
        rules: [
          {
            required: true,
            pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/|[0],
            message: '请填写正确格式（整数或者最多2位小数）的评估成绩'
          },
        ],
      })(<Input style={{ color: '#000', width: '100px' }} disabled={showdisabled} />)
      }
      </span>
    );

    return ( 
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>{approvalInfoRecord.train_type_name}审批表</h1></Row>
        <br /><br />
        <Form>
          <Card title="申请信息" className={styles.r}>
            {/*申请人*/}
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

            {/* 培训课程类型/课程名称 */}
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
              <FormItem label="参加人员" hasFeedback {...formItemLayout}>
                <TextArea
                  style={{ color: '#000', minHeight: 32 }}
                  value={personsList[0] ? personsList[0].train_person_name : null}
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
            {/*申请人执行前审批*/}
            <Card title="前审批信息">
              <span style={{ textAlign: 'center', color: '#000' }}>
                {hidataList1}
              </span>
              <span style={{ textAlign: 'center', color: '#000' ,display: (approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "人力接口人归档"|| approvalInfoRecord.step === "结束"|| approvalInfoRecord.step === "处理完毕"  ) ? "none" : "" }}>
                {nowdataList}
              </span>
            </Card>
 
            {/*申请人执行*/}
            <Card title="组织培训情况填报"
              style={{ display: (approvalInfoRecord.step === "申请人组织培训" || approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "部门负责人审核" || approvalInfoRecord.step === "部门负责人审核-执行完" || approvalInfoRecord.step === "人力接口人归档"|| approvalInfoRecord.step === "结束"|| approvalInfoRecord.step === "处理完毕"  ) ? " " : "none" }}
            >
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="培训费用" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainUseFee', {
                    initialValue: approvalInfoRecord.trainUseFee,
                    rules: [
                      {
                        required: true,
                        pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/|[0],
                        message: '请填写正确格式（整数或者最多2位小数）的培训费用预算（元）'
                      },
                    ],
                  })(
                    <Input style={{ color: '#000' }} initialValue={approvalInfoRecord.trainUseFee} disabled={approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? false : true} />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'center' }}>
                <FormItem label="参训人数" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('trainNumberPerson', {
                    initialValue: approvalInfoRecord.trainNumberPerson,
                    rules: [
                      {
                        required: true,
                        pattern: /^([0-9][0-9]*)?$/,
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
                        required: true,
                        message: '请选择是否组织考试'
                      },
                    ],
                  })(
                    <Select onChange={this.isExam} style={{ color: '#000' }} placeholder="" disabled={approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? false : true}>
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
                        required: true,
                        message: '请选择是否进行效果评估'
                      },
                    ],
                  })(
                    <Select style={{ color: '#000' }} onChange={this.isAssessment} placeholder="" disabled={approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? false : true}>
                      <Option value="0">是</Option>
                      <Option value="1">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Row>

              {/* 效果评估结果 */}
              <Row style={{ textAlign: 'left' }}>
                <FormItem label="老师评估结果" hasFeedback {...formItemLayout}>
                <p style={{color:'#F00'}}> 请按照百分制填写评估结果 </p>
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
                        required: true,
                        message: '请填写赋分原则'
                      },
                    ],
                  })(
                    <TextArea
                      style={{ minHeight: 32, color: '#000' }}
                      placeholder="请填写赋分原则"
                      rows={4}
                      disabled={approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? false : true}
                    />
                  )}
                </FormItem>
              </Row>
              {/*附件*/}
              <Row style={{ textAlign: 'center', display: (approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? " " : "none") }}>
                <FormItem label="上传附件：" hasFeedback {...formItemLayout}>
                  <p style={{color:'#F00'}}> 请上传培训通知、培训签到、培训效果评估、考试结果等培训过程文件 </p>
                  <UpFileApply
                    filelist={fileListExec}
                    name={nameExec}
                    url={urlExec}
                  />
                </FormItem>
              </Row>

              {/*导入成绩，校验计划外人员报名情况，如果未作申请，则不可以导入，依据train_person_class_post_grade表内容判断*/}
              <Row style={{ textAlign: 'center', display: approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ? " " : "none" }}>
                <a href="/filemanage/download/needlogin/hr/training_score.xlsx" ><Button >{'课程成绩模板下载'}</Button></a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ExcelPersonGrade dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button disabled={true} style={{ color: '#000' }}>{(this.state.personClassGradeDataList && this.state.personClassGradeDataList.length > 0) ? '成绩已批量录入，请提交保存' : '成绩尚未导入，请录入'}</Button>
              </Row>

              {/*审批时，查看导入的成绩*/}
              <Row
                style={{
                  textAlign: 'center',
                  display:
                    (
                      approvalInfoRecord.step === "接口人提交执行培训"
                      || approvalInfoRecord.step === "申请人组织培训"
                      || approvalInfoRecord.step === "人力资源专员归档"
                      || approvalInfoRecord.step === "部门负责人审核"
                      || approvalInfoRecord.step === "处理完毕"
                      || approvalInfoRecord.step === "结束"
                      || approvalInfoRecord.step === "部门负责人审核-执行完"
                    ) ? " " : "none"
                }}>
                <br />
                <Button
                  disabled={(showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) || (this.props.importPersonClassGradeDataList && this.props.importPersonClassGradeDataList.length > 0) ? false : true}
                  onClick={this.showPesonGrade}
                  style={{
                    color: '#000',
                  }}
                >
                  {
                    approvalInfoRecord.step === "接口人提交执行培训" || approvalInfoRecord.step === "申请人组织培训" ?
                      (this.state.personClassGradeDataList && this.state.personClassGradeDataList.length > 0) ? '成绩已提交保存，点击查看' : "成绩未录入，请先录入！"
                      :
                      (showPersonClassGradeDataList && showPersonClassGradeDataList.length > 0) ? '成绩已提交保存，点击查看' : null
                  }
                </Button>
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

              <span style={{ textAlign: 'center', color: '#000' ,}}>
                {nowdataList}
              </span>
            </Card>


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
            width={'40%'}
          >
            <div>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={{ color: '#000' }} value={this.state.nextstep} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initperson} placeholder="请选择负责人" >
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </div>
          </Modal>

          <Modal
            title="人员成绩信息"
            visible={this.state.personClassGradeVisible}
            onOk={this.handlePersonClassGradeOk}
            onCancel={this.handlePersonClassGradeCancel}
            width={'60%'}
          >
            <div>
              <Table
                columns={this.person_class_grade_columns}
                dataSource={this.state.personClassGradeDataList}
                pagination={true}
                bordered={true}
              />
            </div>
          </Modal>

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

          <Modal
            title="提交确认"
            visible={this.state.confirmPersonNumValue}
            onOk={this.handleOk}
            onCancel={this.confirmCancel}
            width={'60%'}
          >
            <div>
              <p>
                您导入的参训人员大于输入的参训人员数量,确认提交吗？
              </p>
            </div>
          </Modal>

          <Modal
            title="提交人数确认"
            visible={this.state.confirmPersonNumValue25}
            onOk={this.confirmOK25}
            onCancel={this.confirmCancel25}
            width={'60%'}
          >
            <div>
              <p>
                您导入的参训人员少于25人,确认提交吗？
              </p>
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

train_in_planin_approval = Form.create()(train_in_planin_approval);
export default connect(mapStateToProps)(train_in_planin_approval)
