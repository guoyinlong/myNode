/**
 * 文件说明：创建内训-外请讲师培训
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, message, Card, Radio } from 'antd';
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import UpFileApply from "./upFileApply";

import { Tree } from 'antd';
const { TreeNode } = Tree;

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;


class CreateInternalExternalTeacherTrainApplye extends React.Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      visible: false,
      staff_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      isSubmitClickable: true,
      isSaveClickable: true,
      leave_apply_id_save: '',
      // contractValue: 0 ,
      // internalValue: 0 ,
      planValue: 0,
      personFlag: false,
      trainStartTime: '',
      trainEndTime: '',
      //培训课程类型
      trainClassApplyType: '',
      personVisible: false,
      personList: [],
      personString: '',
      selectPersonString: '',
      //选择的培训类型：总院选修、总院必修、通用、认证考试
      train_class_apply_type: 'compulsory',
      //选择的培训课程级别：全院级、分院级、部门级
      train_class_apply_level: '分院级',
      classInfoVisible: false,

      //选择的外请讲师人员
      selectTeacherString: '',
      //内训师选择模块控制
      teacherVisible: false,
      teacherString: '',
      teacherList: [],

      //选择计划内课程，联动显示课程对应的费用预算
      train_class_id_for_fee: ''
    }
  }

  //比较日期
  diffDate(date1, date2) {
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
      return true;
    } else {
      return false;
    }
  };

  //当前时间
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  };

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    let trainClassData = this.state.trainClassData;
    this.setState({
      isSubmitClickable: false
    });
    this.props.form.validateFields(
      (err) => {
        if (err) {
          message.error("请填写必填项");
          this.setState({
            isSubmitClickable: true
          });
        } else {
          const trainStartTime = this.state.trainStartTime;
          const trainEndTime = this.state.trainEndTime;
          let currentDate = this.getCurrentDate();

          if (trainStartTime && trainEndTime) {
            //培训开始日期不能小于结束日期
            if (this.diffDate(currentDate, trainStartTime)) {
              message.error('培训开始日期不能小于当前日期');
              this.setState({ isSubmitClickable: true });
              return;
            }
            if (this.state.planValue === 0) {
              let planFee = '';
              if (trainClassData && trainClassData[0]) {
                for (let i = 0; i < trainClassData.length; i++) {
                  if (trainClassData[i].train_class_id === this.state.train_class_id_for_fee) {
                    planFee = trainClassData[i].train_fee;
                    break;
                  }
                }
              }
              if (parseInt(planFee) < parseInt(formData.trainFee)) {
                message.error('培训申请的课程费用预算不得大于计划内该课程的预计费用！');
                this.setState({ isSubmitClickable: true });
                return;
              }
            }

            if (formData.trainTeacherInput === '') {
              message.error('请填写外请培训师姓名，以空格分隔！');
              return;
            }
            this.setState({
              visible: true,
            });

          } else {
            message.error('请选择培训日期');
          }
        }
      }
    )

  };

  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index'
    }));
  };

  //提交培训申请申请信息
  handleOk = () => {
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;

    this.props.form.validateFields((err) => {
      if (err) {
        message.error("请填写必填项");
        this.setState({ isSubmitClickable: true });
      }
      else {
        let formData = this.props.form.getFieldsValue();

        const trainStartTime = this.state.trainStartTime;
        const trainEndTime = this.state.trainEndTime;
        let currentDate = this.getCurrentDate();

        if (trainStartTime && trainEndTime) {
          //培训开始日期不能小于结束日期
          if (this.diffDate(currentDate, trainStartTime)) {
            message.error('培训开始日期不能小于当前日期');
            this.setState({ isSubmitClickable: true });
            return;
          } else {
            //执行保存
            /*封装基本信息，即train_class_apply表数据 begin */
            let basicApplyData = {};
            //计划外的培训
            let train_class_personal_info_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
            let train_batch_teacher_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
            if (this.state.planValue === 0) {
              //封装培训课程信息传给后台
              basicApplyData["arg_create_person_id"] = this.state.user_id;
              basicApplyData["arg_create_person_name"] = formData.staff_name;
              basicApplyData["arg_create_person_dept_id"] = this.state.dept_id;
              basicApplyData["arg_create_person_dept_name"] = formData.dept_name;
              basicApplyData["arg_is_out_of_plan"] = this.state.planValue;
              basicApplyData["arg_train_class_name"] = formData.trainClassSelect;
              basicApplyData["arg_train_class_type"] = formData.trainClassTypeIn;
              basicApplyData["arg_train_reason_and_require"] = formData.reasonAndRequire;
              basicApplyData["arg_train_fee"] = formData.trainFee;
              basicApplyData["arg_train_person_name"] = formData.trainPerSonInput;
              basicApplyData["arg_train_start_time"] = trainStartTime;
              basicApplyData["arg_train_end_time"] = trainEndTime;
              basicApplyData["arg_train_place"] = formData.trainPlace;
              basicApplyData["arg_train_target"] = formData.trainTarget;
              basicApplyData["arg_train_remark"] = formData.trainRemark;

              //添加附件文件信息
              basicApplyData["arg_pf_url"] = this.props.pf_url;
              basicApplyData["arg_file_relative_path"] = this.props.file_relative_path;
              basicApplyData["arg_file_name"] = this.props.file_name;

              basicApplyData["arg_state"] = '1';
              basicApplyData["arg_create_time"] = this.getCurrentDate();
              basicApplyData["arg_mobile_phone"] = formData.mobilePhone;

              basicApplyData["arg_next_step_person"] = formData.nextStepPerson;

              basicApplyData["arg_train_class_level"] = '';
              basicApplyData["arg_train_class_person"] = '';
              basicApplyData["arg_train_class_person_num"] = '';
              basicApplyData["arg_train_class_hour"] = '';
              basicApplyData["arg_train_class_dept"] = '';
              basicApplyData["arg_train_class_teacher"] = '';
              basicApplyData["arg_train_class_grade"] = '';
              basicApplyData["arg_train_class_time_out"] = '';

              //培训申请类型
              basicApplyData["arg_train_apply_type"] = '3';
            }

            /*封装基本信息，即train_class_apply表数据 end */
            //计划外
            if (this.state.planValue === 0) {
              return new Promise((resolve) => {
                dispatch({
                  type: 'createApplyModel/trainClassInPlanApplySubmitInternal',
                  basicApplyData,
                  TeacherData: [],
                  //内训-参加集团及系统内培训：train_type=1；内训-自有内训师：train_type=2；内训-外请讲师：train_type=3
                  train_type: '3',
                  resolve
                });
              }).then((resolve) => {
                if (resolve === 'success') {
                  //内训师提交
                  let basicOutPlanApplyTeacherData = [];
                  basicOutPlanApplyTeacherData = this.props.form.getFieldsValue().trainTeacherInput.trim().split(/\s+/);
                  return new Promise((resolve) => {
                    dispatch({
                      type: 'createApplyModel/trainClassTeacherSubmitInternal',
                      basicOutPlanApplyTeacherData,
                      train_type: '3',
                      //课程id，
                      train_apply_class_id: this.props.form.getFieldsValue().trainClassSelect,
                      train_class_personal_info_id,
                      //计划内培训
                      train_plan_type: '0',
                      train_batch_teacher_id: train_batch_teacher_id,
                      teacher_type: '0',
                      arg_proc_inst_id: this.props.proc_inst_id,
                      resolve
                    });
                  }).then((resolve) => {
                    if (resolve === 'success') {
                      message.info("提交成功！");
                      this.setState({ isSubmitClickable: true });
                      setTimeout(() => {
                        dispatch(routerRedux.push({
                          pathname: '/humanApp/train/train_do'
                        }));
                      }, 500);
                    }
                    if (resolve === 'false') {
                      this.setState({ isSubmitClickable: true });
                      setTimeout(() => {
                        dispatch(routerRedux.push({
                          pathname: '/humanApp/train/train_do'
                        }));
                      }, 500);
                    }
                  }).catch(() => {
                    dispatch(routerRedux.push({
                      pathname: '/humanApp/train/train_do'
                    }));
                  });
                }
                if (resolve === 'false') {
                  this.setState({ isSubmitClickable: true });
                  setTimeout(() => {
                    dispatch(routerRedux.push({
                      pathname: '/humanApp/train/train_do'
                    }));
                  }, 500);
                }
              }).catch(() => {
                dispatch(routerRedux.push({
                  pathname: '/humanApp/train/train_do'
                }));
              });
            }
          }
        } else {
          message.error('请选择培训日期');
          return;
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
  };

  //选择参与人员确定
  handlePersonOk = () => {
    this.setState({
      selectPersonString: this.state.personString,
      personVisible: false,
    });

  };

  //选择参与人员结束
  handlePersonCancel = () => {
    this.setState({
      personVisible: false,
    });
  };

  //添加选择人员
  onCheck = (checkedKeys, info) => {
    this.setState({
      personList: [],
    });
    let selperson = '';
    let personListTemp = [];
    for (let i = 0; i < info.checkedNodes.length; i++) {
      if (info.checkedNodes[i].props.children === null || info.checkedNodes[i].props.children === '' || info.checkedNodes[i].props.children === undefined) {
        let person = { personname: info.checkedNodes[i].props.title.split('-')[1] };
        personListTemp.push(person);
        selperson = selperson + '  (' + (i + 1) + ')' + info.checkedNodes[i].props.title;
      }
    }
    this.setState({
      personList: personListTemp,
    })
    this.state.personString = selperson;

  };

  //是否是计划内培训，单选，默认计划内
  planChange = e => {
    this.setState({
      planValue: e.target.value,
    });
  };

  //选择参加人员，多选，人员数据为本院，按照部门展示
  personChange = () => {
    this.setState({
      personVisible: true,
    });
  };

  //选择日期
  selectDate = (date, dateString) => {
    this.setState({
      trainStartTime: dateString[0],
      trainEndTime: dateString[1],
    })
  };

  //选择创建课程的级别
  applyClassLevel = (value) => {
    this.setState({
      train_class_apply_level: value,
    })
  };

  //选择创建的类型
  applyClassType = (value) => {
    const { dispatch } = this.props;

    this.setState({
      train_class_apply_type: value,
    })

    let queryParam = {
      arg_user_id: Cookie.get('userid'),
      arg_train_type: value,
      arg_train_class_type: "内训-外聘讲师",
    };
    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'createApplyModel/queryTrainClassForApply',
        queryParam,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({
          trainClassData: this.props.trainClassData ? this.props.trainClassData : [],
          train_class_id_for_fee: this.props.trainClassData && this.props.trainClassData[0] ? this.props.trainClassData[0].train_class_id : '',
        })
      }
      if (resolve === 'false') {
        this.setState({
          trainClassData: [],
          train_class_id_for_fee: '',
        })
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/create_train_apply'
      }));
    });
  };

  //选择课程联动课程费用
  choiseClass = (value) => {
    this.setState({
      train_class_id_for_fee: value,
    })
  };

  //跳转到培训申请界面
  goToApplyPlan = () => {
    const { dispatch } = this.props;
    const userRoleData = this.props.permission;

    //总院人力接口人
    if (userRoleData === '2') {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/trainPlanList',
      }));
    }
    else {
      message.info("您不具备申请新的培训计划的权限，请咨询本院培训人力接口人！");
      return;
    }
  };

  render() {
    const inputstyle = { color: '#000' };
    const { person_list } = this.props;
    let personListDate = person_list.map(item => {
      let deptdate;
      if (item.tree_num === '0' || item.tree_num === 0) {
        deptdate = item.list.map(item2 => {
          let personlistdate;
          if (item2.tree_num === '1' || item2.tree_num === 1) {
            personlistdate = item2.list.map(item3 => {
              return (<TreeNode title={item3.key_name} key={item3.key_num} />)
            })
          }
          return (
            <TreeNode title={item2.key_name} key={item2.key_num}>
              {personlistdate}
            </TreeNode>
          )
        })
      }
      return (
        <TreeNode title={item.key_name} key={item.key_num}>
          {deptdate}
        </TreeNode>
      )
    }
    );

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
    let nextDataList = this.props.nextDataList;
    //下一环节名称
    let nextPostName = '';
    //下一环节处理人
    let initPerson = '';
    let nextPersonList = null;
    if (nextDataList !== undefined) {
      if (nextDataList.length > 0) {
        initPerson = nextDataList[0].submit_user_id;
        nextPostName = nextDataList[0].submit_post_name;
      }
      nextPersonList = nextDataList.map(item =>
        <Option value={item.submit_user_id} >{item.submit_user_name}</Option>
      );
    }


    //培训课程
    let trainClassData = this.state.trainClassData;
    let inPlanClassList = null;
    let inPlanClassFeeList = null;
    let initClassID = '';
    if (trainClassData !== undefined) {
      if (trainClassData.length > 0) {
        initClassID = trainClassData[0].train_class_id;
      }
      inPlanClassList = trainClassData.map(item =>
        <Option value={item.train_class_id}>{item.class_name}</Option>
      );
      inPlanClassFeeList = trainClassData.map(item =>
        <Option value={item.train_class_id}>{item.train_fee}</Option>
      );
    }

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>内训-外聘讲师培训申请表</h2></Row>
        <br /><br />
        <Form>
          <Card title="申请信息" className={styles.r}>
            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'申请人'} {...formItemLayout2}>
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

            {/*联系方式*/}
            <Row style={{ textAlign: 'center' }}>
              {/*联系方式*/}
              <FormItem label="联系方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobilePhone', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      pattern: /^1[3456789]\d{9}$/,
                      message: "输入手机号不合法！",
                    },
                  ],
                })(<Input placeholder="您的常用手机号（11位）" />)}
              </FormItem>
            </Row>

            {/*是否是计划内培训*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label="是否是计划内培训：" hasFeedback {...formItemLayout}>
                <Radio.Group onChange={this.planChange} value={this.state.planValue}>
                  <Radio.Button value={0}>是</Radio.Button>
                  <Radio.Button value={1}>否</Radio.Button>
                </Radio.Group>
              </FormItem>
            </Row>

            {/* 拟参加人员 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="外请讲师人员：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('trainTeacherInput', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请填写外请培训师姓名，以空格分隔！'
                    },
                  ],
                })(
                  // 计划内查询出能申请的课程
                  <TextArea
                    placeholder="请填写外请培训师姓名，以空格分隔！"
                    style={{ minHeight: 32 }}
                    autosize={{ maxRows: 10 }}
                  />
                )}
              </FormItem>
            </Row>

            {/* 培训课程 */}
            {
              this.state.planValue === 0
                ?
                <Row style={{ textAlign: 'center' }}>
                  <FormItem label="请选择培训类型" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('trainClassTypeIn', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请选择培训类型'
                        },
                      ],
                    })(
                      <Select placeholder="请选择培训类型" initialValue={'compulsory'} disabled={false} onChange={this.applyClassType.bind(this)}>
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
                        initialValue: initClassID,
                        rules: [
                          {
                            required: true,
                            message: '请选择培训课程'
                          },
                        ],
                      })(
                        // 如果是计划内查询出能申请的课程，如果是计划外，则手动输入
                        <Select placeholder="请选择培训课程" disabled={false} onChange={this.choiseClass.bind(this)}>
                          {inPlanClassList}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col >
                    <FormItem label="培训费用" {...formItemLayout} >
                      {getFieldDecorator('trainClassSelectFee', {
                        initialValue: this.state.train_class_id_for_fee,
                        rules: [
                          {
                            required: true,
                            message: '培训费用(元)'
                          },
                        ],
                      })(
                        <Select placeholder="培训费用" disabled={true} >
                          {inPlanClassFeeList}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {/* 申请原因及培训需求 */}
                  <FormItem label="申请原因及培训需求" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('reasonAndRequire', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请填写申请原因及培训需求'
                        },
                      ],
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="申请原因及培训需求"
                        rows={4}
                        disabled={false}
                      />
                    )}
                  </FormItem>
                  {/* 培训费用预算 */}
                  <FormItem label="培训费用预算" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('trainFee', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
                          message: '请填写正确格式（整数或者最多2位小数）的培训费用预算（元）'
                        },
                      ],
                    })(
                      <Input placeholder="培训费用预算(元)" />
                    )}
                  </FormItem>

                  {/* 拟参加人员 */}
                  <FormItem label="拟参加人员" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('trainPerSonInput', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '拟参加人员'
                        },
                      ],
                    })(
                      // 计划内查询出能申请的课程
                      <TextArea
                        placeholder="拟参加人员"
                        style={{ minHeight: 32 }}
                        autosize={{ maxRows: 10 }}
                      />
                    )}
                  </FormItem>

                  {/* 培训时间 */}

                  <FormItem label={'培训时间'} {...formItemLayout}>
                    {getFieldDecorator('train_time', {

                      rules: [
                        {
                          required: true,
                          message: '请选择起止日期',
                        },
                      ],
                    })(<RangePicker
                      style={{ width: '100%' }}
                      disabled={false}
                      onChange={this.selectDate}
                    />)
                    }
                  </FormItem>


                  {/* 培训地点 */}
                  <FormItem label="培训地点" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('trainPlace', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请填写培训地点'
                        },
                      ],
                    })(
                      <Input placeholder="培训地点" />
                    )}
                  </FormItem>

                  {/* 培训目标（如有证书请注明） */}
                  <FormItem label="培训目标" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('trainTarget', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请填写培训目标'
                        },
                      ],
                    })(
                      <TextArea
                        style={{ minHeight: 32 }}
                        placeholder="培训目标（如有证书请注明）"
                        rows={4}
                        disabled={false}
                      />
                    )}
                  </FormItem>
                </Row>
                :
                <Row style={{ textAlign: 'center' }}>
                  <Button onClick={this.goToApplyPlan}>{'请先进行培训计划申请'}</Button>
                </Row>
            }

            {
              this.state.planValue === 0
                ?
                <div>
                  {/*培训备注*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="备注" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainRemark', {
                        initialValue: '',
                        rules: [
                          {
                            required: false,
                            message: '请填写培训备注（可不填，如有培训场地预算，请备注说明）'
                          },
                        ],
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="如有培训场地预算，请备注说明"
                          rows={4}
                          disabled={false}
                        />
                      )}
                    </FormItem>
                  </Row>
                  {/*附件*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="上传附件：" hasFeedback {...formItemLayout}>
                      <UpFileApply filelist={fileList}
                        name={name}
                        url={url} />
                    </FormItem>
                  </Row>
                  <br />
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Button onClick={this.goBack}>{'取消'}</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
                  </Col>
                </div>
                :
                <Col span={24} style={{ textAlign: 'center' }}>
                  <br />
                  <Button type="primary" onClick={this.goBack} >{'关闭'}</Button>
                </Col>
            }
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
                <Input style={inputstyle} value={nextPostName} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextStepPerson', {
                  initialValue: initPerson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initPerson} placeholder="请选择负责人">
                    {nextPersonList}
                  </Select>
                )}
              </FormItem>
            </div>
          </Modal>

          <Modal
            title="选择参与人员"
            visible={this.state.personVisible}
            onOk={this.handlePersonOk}
            onCancel={this.handlePersonCancel}
          >
            <Tree
              checkable
              onCheck={this.onCheck}
            >
              {personListDate}
            </Tree>
          </Modal>
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

CreateInternalExternalTeacherTrainApplye = Form.create()(CreateInternalExternalTeacherTrainApplye);
export default connect(mapStateToProps)(CreateInternalExternalTeacherTrainApplye)
