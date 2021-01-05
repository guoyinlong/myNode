/**
 * 作者：翟金亭
 * 日期：2019-07-10
 * 邮箱：zhaijt3@chinaunicom.cn
 * 功能：动态编辑表格组件、添加培训计划
 */
import React, { Component } from 'react';
import { Table, Input, Icon, message, Card, Row, Button, Radio, Modal, Form, Select } from 'antd';
import { connect } from "dva";
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import Excel from "./Excel1";

class DynAddClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelVisible: false,
      compulsoryClassPlanDataSource: [],
      electiveClassPlanDataSource: [],
      commonClassPlanDataSource: [],
      certificationClassPlanDataSource: [],
      compulsoryClassPlanDataSourceView: [],
      electiveClassPlanDataSourceView: [],
      commonClassPlanDataSourceView: [],
      certificationClassPlanDataSourceView: [],
      indexValue: 0,
      submitFlag: true,
      //预算
      budgetValue: 0,
      //提交弹窗,下一步
      nextVisible: false,
      nextStep: '',
    };
    this.handleAdd = this.handleAdd.bind(this);//绑定this，这个是下面声明onClick的方法，需绑定this，在onClick事件中直接用this.handleAdd即可
    this.handleDel = this.handleDel.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  //添加
  handleAdd() {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      const newDataSource = this.state.compulsoryClassPlanDataSource;//将this.state.dateSource赋给newDataSource
      let l = this.state.indexValue;
      newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
        indexID: l,
        //培训级别
        train_level: this.props.train_level,
        //课程名称/方向
        class_name: this.props.class_name,
        //受训部门-岗位
        train_person: this.props.train_person,
        //计划培训时长
        train_hour: this.props.train_hour,
        train_hour_unit: this.props.train_hour_unit,
        //培训类型
        train_kind: this.props.train_kind,
        // 赋分规则
        assign_score: this.props.assign_score,
        //培训时间（第一季度）
        train_time: this.props.train_time,
        //课程来源-师资
        train_teacher: this.props.train_teacher,
        //责任部门
        center_dept: this.props.center_dept,
        //费用预算
        train_fee: this.props.train_fee,
        //学分值
        class_grade: this.props.class_grade,
        //是否落地
        plan_land: this.props.plan_land,
        //落地分院
        plan_branch: this.props.plan_branch,
        //备注
        remark: this.props.remark,
      });
      this.setState({
        indexValue: l + 1
      });
      this.setState({
        compulsoryClassPlanDataSource: newDataSource,//将newDataSource新添加的数组给dataSource
        submitFlag: false,//提交按钮控制
      });
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      const newDataSource = this.state.compulsoryClassPlanDataSource;//将this.state.dateSource赋给newDataSource
      let l = this.state.indexValue;
      newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
        indexID: l,
        //培训级别
        train_level: this.props.train_level,
        //课程级别
        class_level: this.props.class_level,
        //课程名称/方向
        class_name: this.props.class_name,
        //岗位
        train_person: this.props.train_person,
        //计划培训时长
        train_hour: this.props.train_hour,
        train_hour_unit: this.props.train_hour_unit,
        //培训类型
        train_kind: this.props.train_kind,
        // 赋分规则
        assign_score: this.props.assign_score,
        //课程来源-师资
        train_teacher: this.props.train_teacher,
        //责任部门
        center_dept: this.props.center_dept,
        //分院院主责部门
        court_dept: '',
        //费用预算
        train_fee: this.props.train_fee,
        //学分值
        class_grade: this.props.class_grade,
        //是否落地
        plan_land: this.props.plan_land,
        //落地分院
        plan_branch: this.props.plan_branch,
        //备注
        remark: this.props.remark,
        //培训计划类型（1、总院计划、2、济南分院  3、西安分院  4、哈尔滨分院   5 广州分院）
        train_type: '1',
        //状态：（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）默认审批完成
        state: '2',
      });
      this.setState({
        indexValue: l + 1
      });
      this.setState({
        electiveClassPlanDataSource: newDataSource,//将newDataSource新添加的数组给dataSource
        submitFlag: false,//提交按钮控制
      });
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      const newDataSource = this.state.compulsoryClassPlanDataSource;//将this.state.dateSource赋给newDataSource
      let l = this.state.indexValue;
      newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
        indexID: l,
        //培训级别
        train_level: this.props.train_level,
        //课程级别
        class_level: this.props.class_level,
        //课程名称及方向
        class_name: this.props.class_name,
        //培训对象
        train_group: this.props.train_group,
        //计划培训人数
        train_person: this.props.train_person,
        //计划培训时长
        train_hour: this.props.train_hour,
        train_hour_unit: this.props.train_hour_unit,
        //培训类型
        train_kind: this.props.train_kind,
        // 赋分规则
        assign_score: this.props.assign_score,
        //计划培训时间
        train_time: this.props.train_time,
        //责任部门
        center_dept: this.props.center_dept,
        //培训师资
        train_teacher: this.props.train_teacher,
        //费用预算
        train_fee: this.props.train_fee,
        //学分值
        class_grade: this.props.class_grade,
        //是否落地
        plan_land: this.props.plan_land,
        //落地分院
        plan_branch: this.props.plan_branch,
        //备注
        remark: this.props.remark,
        //状态：（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）默认审批完成
        state: '2',
        //ou_id
        ou_id: Cookie.get('OUID'),
      });
      this.setState({
        indexValue: l + 1
      });
      this.setState({
        commonClassPlanDataSource: newDataSource,//将newDataSource新添加的数组给dataSource
        submitFlag: false,//提交按钮控制
      });
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      const newDataSource = this.state.certificationClassPlanDataSource;//将this.state.dateSource赋给newDataSource
      let l = this.state.indexValue;
      newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
        indexID: l,
        //dept ID
        dept_id: Cookie.get('dept_id'),
        //dept name
        dept_name: Cookie.get('dept_name'),
        //认证名称
        exam_name: this.props.exam_name,
        //考试人员
        exam_person_name: this.props.exam_person_name,
        //考试人员id
        exam_person_id: '',
        //报销标准
        claim_fee: this.props.claim_fee,
        //计划考试时间
        exam_time: this.props.exam_time,
        //考试费预算
        exam_fee: this.props.exam_fee,
        //状态：（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）默认审批完成
        state: '2',
        //ou_id
        ou_id: Cookie.get('OUID'),
      });
      this.setState({
        indexValue: l + 1
      });
      this.setState({
        certificationClassPlanDataSource: newDataSource,//将newDataSource新添加的数组给dataSource
        submitFlag: false,//提交按钮控制
      });
    }
  }
  addNewTrainPlanApply = () => {
    this.setState({
      modelVisible: true,
      compulsoryClassPlanDataSource: [],
      electiveClassPlanDataSource: [],
      commonClassPlanDataSource: [],
      certificationClassPlanDataSource: [],
      indexValue: 0,
    });
  };
  addNewTrainPlanApplyOK = () => {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      const dataSourceList = this.state.compulsoryClassPlanDataSource;
      let nullCheck = true;
      dataSourceList.map((item) => {
        /*空值校验*/
        if (this.checkNull(item.train_level)) {
          message.error('请选择培训级别，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_name)) {
          message.error('请选择培训课程名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_person) || !this.checkChinese(item.train_person)) {
          message.error('请选择受训部门/岗位，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour) || !this.checkNumberFirst(item.train_hour)) {
          message.error('请填写培训时长（最多两位小数的正数），备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour_unit)) {
          message.error('请选择培训时长单位名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_kind)) {
          message.error('请选择培训类型，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.assign_score)) {
          message.error('请选择赋分规则，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_time)) {
          message.error('请选择培训计划时间，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_teacher)) {
          message.error('请选择培训课程来源及师资，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.center_dept)) {
          message.error('请选择培训责任部门，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_fee) || !this.checkNumberFee(item.train_fee)) {
          message.error('请填写最多两位小数的正浮点数费用预算，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_grade) || !this.checkNumber(item.class_grade)) {
          message.error('请填写正整数学分值，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.plan_land)) {
          message.error('选择是或者否');
          nullCheck = false;
          return;
        }
      });
      if (nullCheck !== false) {
        this.setState({
          nextVisible: false,
        });
      } else {
        return;
      }
      let transferPersonList = [];
      dataSourceList.map((item) => {
        let planData = {
          number1: item.number1,
          train_level: item.train_level,
          class_name:item.class_name,
          train_person:item.train_person,
          train_hour:item.train_hour,
          train_hour_unit: item.train_hour_unit,
          train_kind:item.train_kind,
          assign_score:item.assign_score,
          train_time:item.train_time,
          train_teacher:item.train_teacher, 
          center_dept:item.center_dept,
          train_fee:item.train_fee,
          class_grade:item.class_grade, 
          plan_land:item.plan_land,
          plan_branch:item.plan_branch,
          remark:item.remark
        };
        transferPersonList.push(planData);
      })
      let importPersonDataList = this.props.importCenterClassCompulsoryDataList;
      this.props.dispatch({
        type:'train_create_model/centerClassCompulsorynAdd',
        transferPersonList,
        importPersonDataList
      });
      this.setState({
        compulsoryClassPlanDataSource : [],
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
       /*检查空字段*/

       const dataSourceList = this.state.electiveClassPlanDataSource;
       let nullCheck = true;
       dataSourceList.map((item) => {
         /*空值校验*/
         if (this.checkNull(item.train_level)) {
           message.error('请选择培训级别，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.class_level)) {
           message.error('请选择课程级别，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.class_name)) {
           message.error('请选择培训课程名称，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.train_person) || !this.checkChinese(item.train_person)) {
           message.error('请选择受训部门/岗位，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.train_hour) || !this.checkNumberFirst(item.train_hour)) {
           message.error('请填写培训时长（最多两位小数的正数），备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.train_hour_unit)) {
           message.error('请选择培训时长单位名称，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.train_kind)) {
           message.error('请选择培训类型，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.assign_score)) {
           message.error('请选择赋分规则，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.train_teacher)) {
           message.error('请选择培训课程来源及师资，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.center_dept)) {
           message.error('请选择培训责任部门，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.train_fee) || !this.checkNumberFee(item.train_fee)) {
           message.error('请填写最多两位小数的正浮点数费用预算，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.class_grade) || !this.checkNumber(item.class_grade)) {
           message.error('请填写正整数学分值，备注选填');
           nullCheck = false;
           return;
         }
         if (this.checkNull(item.plan_land)) {
           message.error('选择是或者否');
           nullCheck = false;
           return;
         }
         /*        if(this.checkNull(item.plan_branch))
                 {
                   message.error('选择落地部门');
                   nullCheck = false;
                   return;
                 }*/
       });
       if (nullCheck !== false) {
         this.setState({
           nextVisible: false,
         });
       } else {
         return;
       }
      let transferPersonList = [];
      dataSourceList.map((item) => {
        let planData = {
          number1: item.number1,
          train_level: item.train_level,
          class_level: item.class_level,
          class_name:item.class_name,
          train_person:item.train_person,
          train_hour:item.train_hour,
          train_hour_unit: item.train_hour_unit,
          train_kind:item.train_kind,
          assign_score:item.assign_score,
          train_teacher:item.train_teacher, 
          center_dept:item.center_dept,
          train_fee:item.train_fee,
          class_grade:item.class_grade, 
          plan_land:item.plan_land, 
          plan_branch:item.plan_branch,
          remark:item.remark
        };
        transferPersonList.push(planData);
      })
      let importPersonDataList = this.props.importCenterClassElectiveDataList;
      this.props.dispatch({
        type:'train_create_model/centerClassElectiveAdd',
        transferPersonList,
        importPersonDataList
      });
      this.setState({
        electiveClassPlanDataSource : [],
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
  /*检查空字段*/
  const dataSourceList = this.state.commonClassPlanDataSource;
  let nullCheck = true;
  dataSourceList.map((item) => {
    /*空值校验*/
    if (this.checkNull(item.train_level)) {
      message.error('请选择培训级别，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.class_level)) {
      message.error('请选择课程级别，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.class_name)) {
      message.error('请选择培训课程名称，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_group)) {
      message.error('请填写培训对象，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_person) || !this.checkNumber(item.train_person)) {
      message.error('请填写计划培训人数（正整数），备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_hour) || !this.checkNumberFirst(item.train_hour)) {
      message.error('请填写培训时长（最多两位小数的正数），备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_hour_unit)) {
      message.error('请选择培训时长单位名称，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_kind)) {
      message.error('请选择培训类型，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.assign_score)) {
      message.error('请选择赋分规则，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_time)) {
      message.error('请选择培训计划时间，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.center_dept)) {
      message.error('请选择培训责任部门，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_teacher)) {
      message.error('请选择培训师资，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.train_fee) || !this.checkNumberFee(item.train_fee)) {
      message.error('请填写最多两位小数的正浮点数费用预算，备注选填');
      nullCheck = false;
      return;
    }
    if (this.checkNull(item.class_grade) || !this.checkNumber(item.class_grade)) {
      message.error('请填写正整数学分值，备注选填');
      nullCheck = false;
      return;
    }
  });
  if (nullCheck !== false) {
    this.setState({
      nextVisible: false,
    });
  } else {
    return;
  }
      let transferPersonList = [];
      dataSourceList.map((item) => {
        let planData = {
          number1: item.number1,
          train_level: item.train_level,
          class_level: item.class_level,
          class_name:item.class_name,
          train_group:item.train_group,
          train_person:item.train_person,
          train_hour:item.train_hour,
          train_hour_unit: item.train_hour_unit,
          train_kind:item.train_kind,
          assign_score:item.assign_score,
          train_time:item.train_time,
          center_dept:item.center_dept,
          train_teacher:item.train_teacher, 
          train_fee:item.train_fee,
          class_grade:item.class_grade, 
          plan_land:item.plan_land, 
          plan_branch:item.plan_branch,
          remark:item.remark
        };
        transferPersonList.push(planData);
      })
      let importPersonDataList = this.props.importBranchAndDepartmentClassDataList;
      this.props.dispatch({
        type:'train_create_model/BranchAndDepartmentAdd',
        transferPersonList,
        importPersonDataList
      });
      this.setState({
        commonClassPlanDataSource : [],
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
 /*检查空字段*/
 const dataSourceList = this.state.certificationClassPlanDataSource;
 let nullCheck = true;
 dataSourceList.map((item) => {

   /*空值校验*/
   if (this.checkNull(item.dept_name)) {
     message.error('请选择部门名称，备注选填');
     nullCheck = false;
     return;
   }
   if (this.checkNull(item.exam_name)) {
     message.error('请填写认证名称，备注选填');
     nullCheck = false;
     return;
   }
   if (this.checkNull(item.exam_person_name)) {
     message.error('请描述考试人员名称，备注选填');
     nullCheck = false;
     return;
   }
   if (this.checkNull(item.claim_fee) || !this.checkNumberFee(item.claim_fee)) {
     message.error('请填写最多两位小数的正浮点数报销标准，备注选填');
     nullCheck = false;
     return;
   }
   if (this.checkNull(item.exam_time)) {
     message.error('请选择计划考试时间，备注选填');
     nullCheck = false;
     return;
   }
   if (this.checkNull(item.exam_fee) || !this.checkNumber(item.exam_fee)) {
     message.error('请填写正整数学分值，备注选填');
     nullCheck = false;
     return;
   }
 });
 if (nullCheck !== false) {
   this.setState({
     nextVisible: false,
   });
 }
 else {
   return;
 }
      let transferPersonList = [];
      dataSourceList.map((item) => {
        let planData = {
          indexID: item.indexID,
          dept_name: item.dept_name,
          exam_name: item.exam_name,
          exam_person_name:item.exam_person_name,
          claim_fee:item.claim_fee,
          exam_time:item.exam_time,
          exam_fee:item.exam_fee,
          exam_grade:item.exam_grade
        };
        transferPersonList.push(planData);
      })
      let importPersonDataList = this.props.importCreateCertificationDataList;
      this.props.dispatch({
        type:'train_create_model/CreateCertificationAdd',
        transferPersonList,
        importPersonDataList
      });
      this.setState({
        certificationClassPlanDataSource : [],
      })
    }
    this.setState({
      modelVisible: false,
    });
  };
  addNewTrainPlanApplyCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };
  //删除
  handleDel(e) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      const DelDataSource = this.state.compulsoryClassPlanDataSource;
      let deleteIndex = e.target.getAttribute('data-index');
      if (deleteIndex != (DelDataSource.length - 1)) {
        message.error('必须自底向上逐一删除，不支持从中间删除');
        return;
      }
      DelDataSource.splice(deleteIndex, 1);
      this.setState({
        compulsoryClassPlanDataSource: DelDataSource,
      });
      if (DelDataSource.length == 0) {
        this.setState({
          submitFlag: true,//提交按钮控制
        });
      }
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      const DelDataSource = this.state.electiveClassPlanDataSource;
      let deleteIndex = e.target.getAttribute('data-index');
      if (deleteIndex != (DelDataSource.length - 1)) {
        message.error('必须自底向上逐一删除，不支持从中间删除');
        return;
      }
      DelDataSource.splice(deleteIndex, 1);
      this.setState({
        electiveClassPlanDataSource: DelDataSource,
      });
      if (DelDataSource.length == 0) {
        this.setState({
          submitFlag: true,//提交按钮控制
        });
      }
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      const DelDataSource = this.state.commonClassPlanDataSource;
      let deleteIndex = e.target.getAttribute('data-index');
      if (deleteIndex != (DelDataSource.length - 1)) {
        message.error('必须自底向上逐一删除，不支持从中间删除');
        return;
      }
      DelDataSource.splice(deleteIndex, 1);
      this.setState({
        commonClassPlanDataSource: DelDataSource,
      });
      if (DelDataSource.length == 0) {
        this.setState({
          submitFlag: true,//提交按钮控制
        });
      }
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      const DelDataSource = this.state.certificationClassPlanDataSource;
      let deleteIndex = e.target.getAttribute('data-index');
      if (deleteIndex != (DelDataSource.length - 1)) {
        message.error('必须自底向上逐一删除，不支持从中间删除');
        return;
      }
      DelDataSource.splice(deleteIndex, 1);
      this.setState({
        certificationClassPlanDataSource: DelDataSource,
      });
      if (DelDataSource.length == 0) {
        this.setState({
          submitFlag: true,//提交按钮控制
        });
      }
    }
  }

  onChange(e) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[e.target.id][e.target.name] = e.target.value;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[e.target.id][e.target.name] = e.target.value;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[e.target.id][e.target.name] = e.target.value;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[e.target.id][e.target.name] = e.target.value;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }
  }
  //选择主责部门
  deptSelect(record, dept_id) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };

  //选择部门名称
  deptNameSelect(record, dept_id) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["center_dept"] = dept_id;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["dept_name"] = dept_id;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };

  //选择培训级别
  trainLevelSelect(record, train_level) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
    
      changePlan[record.indexID]["train_level"] = train_level;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["train_level"] = train_level;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["train_level"] = train_level;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["train_level"] = train_level;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };

  //选择课程级别
  classLevelSelect(record, class_level) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["class_level"] = class_level;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["class_level"] = class_level;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["class_level"] = class_level;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["class_level"] = class_level;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }
  };

  //选择培训时长单位
  trainHourSelect(record, train_hour_unit) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["train_hour_unit"] = train_hour_unit;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["train_hour_unit"] = train_hour_unit;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["train_hour_unit"] = train_hour_unit;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["train_hour_unit"] = train_hour_unit;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };
  //选择培训类型
  trainKindSelect(record, train_kind) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["train_kind"] = train_kind;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["train_kind"] = train_kind;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["train_kind"] = train_kind;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["train_kind"] = train_kind;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };
  //选择赋分规则
  trainAssignScore(record, assign_score) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["assign_score"] = assign_score;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["assign_score"] = assign_score;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["assign_score"] = assign_score;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["assign_score"] = assign_score;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };

  // 选择是否落地
  train_plan_land(record, plan_land) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["plan_land"] = plan_land;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["plan_land"] = plan_land;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["plan_land"] = plan_land;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
  };

  // 选择落地分院
  train_plan_branch(record, plan_branch) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["plan_branch"] = plan_branch;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["plan_branch"] = plan_branch;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["plan_branch"] = plan_branch;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
  };
  //选择培训时间
  trainTimeSelect(record, train_time) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["train_time"] = train_time;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["train_time"] = train_time;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["train_time"] = train_time;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["exam_time"] = train_time;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };
  //选择培训师资
  trainTeacherSelect(record, train_teacher) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["train_teacher"] = train_teacher;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["train_teacher"] = train_teacher;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      let changePlan = this.state.commonClassPlanDataSource;
      changePlan[record.indexID]["train_teacher"] = train_teacher;
      this.setState({
        commonClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      let changePlan = this.state.certificationClassPlanDataSource;
      changePlan[record.indexID]["train_teacher"] = train_teacher;
      this.setState({
        certificationClassPlanDataSource: changePlan
      })
    }

  };

  //选择岗位
  trainPostSelect(record, post_id) {
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      let changePlan = this.state.compulsoryClassPlanDataSource;
      changePlan[record.indexID]["train_person"] = post_id;
      this.setState({
        compulsoryClassPlanDataSource: changePlan
      })
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      let changePlan = this.state.electiveClassPlanDataSource;
      changePlan[record.indexID]["train_person"] = post_id;
      this.setState({
        electiveClassPlanDataSource: changePlan
      })
    }
  }

  //空值校验
  checkNull(value) {
    if (value === '' || value === null || value === undefined) {
      return true;
    }
    return false;
  }

  //汉字校验（必须是汉字）
  checkChinese(value) {
    if (/^[\u4e00-\u9fa5]{1,}$/.test(value)) {
      return true;
    }
    return false;
  }

  //数字校验(1位小数)
  checkNumberFirst(value) {
    if (/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(value)) {
      return true;
    }
    return false;
  }
  deleteCompulsory = (record) => {
    // 请求model，做删除操作
    let importPersonDataList = this.props.importCenterClassCompulsoryDataList;
    const{dispatch} = this.props;
    dispatch({
      type:'train_create_model/deleteCompulsory',
      importPersonDataList,
      record
    });
  }
  deleteElective = (record) => {
    // 请求model，做删除操作
    let importPersonDataList = this.props.importCenterClassElectiveDataList;
    const{dispatch} = this.props;
    dispatch({
      type:'train_create_model/deleteElective',
      importPersonDataList,
      record
    });
  }
  deleteBranch = (record) => {
    // 请求model，做删除操作
    let importPersonDataList = this.props.importBranchAndDepartmentClassDataList;
    const{dispatch} = this.props;
    dispatch({
      type:'train_create_model/deleteBranch',
      importPersonDataList,
      record
    });
  }
  deleteCreateCertification = (record) => {
    // 请求model，做删除操作
    let importPersonDataList = this.props.importCreateCertificationDataList;
    const{dispatch} = this.props;
    dispatch({
      type:'train_create_model/deleteCreateCertification',
      importPersonDataList,
      record
    });
  }

  //正整数字校验
  checkNumber(value) {
    let regPos = /^([1-9][0-9]*)?$/; //非负浮点数
    if (regPos.test(value)) {
      return true;
    } else {
      return false;
    }
  }

  //数字校验(费用)
  checkNumberFee(value) {
    if (/^([0-9][0-9]*)+(.[0-9]{1,2})?$/.test(value)) {
      return true;
    }
    return false;
  }

  //当前时间
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  }

  //预算情况单选
  budgetChange = e => {
    this.setState({
      budgetValue: e.target.value,
    });
  };

  //提交
  addPlan() {
    setTimeout(() => { 
      this.setState({
        nextVisible: false,
      })
    }, 2000);
    const { dispatch } = this.props;
    let arg_nextStepPerson = this.props.form.getFieldValue("nextStepPerson");
    let arg_budgetValue = this.state.budgetValue;
    let transferPlanList = [];
    let trainPlanData = {};
    let trainClassType = this.props.trainClassPlanType;
    /*根据课程类型，执行不同的方式，插入*/
    /*检查空字段*/
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      const dataSourceList = this.props.importCenterClassCompulsoryDataList;
      dataSourceList.map((item) => {
        let planData = {
          arg_indexID: item.number1,
          arg_plan_id: '',
          arg_train_level: item.train_level,
          arg_class_name: item.class_name,
          arg_train_person: item.train_person,
          arg_train_hour: item.train_hour,
          arg_train_kind: item.train_kind,
          arg_assign_score: item.assign_score,
          arg_train_time: item.train_time,
          arg_train_teacher: item.train_teacher,
          arg_center_dept: item.center_dept,
          arg_train_fee: item.train_fee,
          arg_class_grade: item.class_grade,
          arg_plan_land: item.plan_land,
          arg_plan_branch: item.plan_branch,
          arg_remark: item.remark,
          arg_train_type: '1',
          arg_state: '2',
        };
        transferPlanList.push(planData);
      });

      /*封装基本信息，即train_plan表数据 begin */
      //创建人ID
      trainPlanData["arg_create_person_id"] = Cookie.get('userid');
      //创建人姓名
      trainPlanData["arg_create_person_name"] = Cookie.get('username');
      //培训类型（1、总院必修   2、总院选修  3、通用计划  4、培训计划）
      trainPlanData["arg_train_type"] = '5';
      //是否超值（0：正常  1：超支）
      trainPlanData["arg_if_budget"] = arg_budgetValue;
      trainPlanData["arg_nextStepPerson"] = arg_nextStepPerson;
      //添加文件信息
      /*封装基本信息，即train_plan表数据 end */
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      const dataSourceList = this.props.importCenterClassElectiveDataList;
      dataSourceList.map((item) => {
        let planData = {
          arg_indexID: item.number1,
          arg_train_level: item.train_level,
          arg_class_level: item.class_level,
          arg_class_name: item.class_name,
          arg_train_person: item.train_person,
          arg_train_hour: item.train_hour,
          arg_train_kind: item.train_kind,
          arg_assign_score: item.assign_score,
          arg_train_teacher: item.train_teacher,
          arg_center_dept: item.center_dept,
          arg_train_fee: item.train_fee,
          arg_class_grade: item.class_grade,
          arg_plan_land: item.plan_land,
          arg_plan_branch: item.plan_branch,
          arg_remark: item.remark,
          arg_train_type: '1',
          arg_state: '2',
        };
        transferPlanList.push(planData);
      });

      /*封装基本信息，即train_plan表数据 begin */
      //创建人ID
      trainPlanData["arg_create_person_id"] = Cookie.get('userid');
      //创建人姓名
      trainPlanData["arg_create_person_name"] = Cookie.get('username');
      //培训类型（1、总院必修   2、总院选修  3、通用计划  4、培训计划）
      trainPlanData["arg_train_type"] = '6';
      //是否超值（0：正常  1：超支）
      trainPlanData["arg_if_budget"] = arg_budgetValue;
      trainPlanData["arg_nextStepPerson"] = arg_nextStepPerson;
      //添加文件信息
      /*封装基本信息，即train_plan表数据 end */
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      const dataSourceList = this.props.importBranchAndDepartmentClassDataList;
    
      dataSourceList.map((item) => {
        let planData = {
          arg_indexID: item.number1,
          arg_train_level: item.train_level,
          arg_class_level: item.class_level,
          arg_class_name: item.class_name,
          arg_train_group: item.train_group,
          arg_train_person: item.train_person,
          arg_train_hour: item.train_hour ,
          arg_train_kind: item.train_kind,
          arg_assign_score: item.assign_score,
          arg_train_time: item.train_time,
          arg_center_dept: item.center_dept,
          arg_train_teacher: item.train_teacher,
          arg_train_fee: item.train_fee,
          arg_class_grade: item.class_grade,
          arg_plan_land: item.plan_land,
          arg_plan_branch: item.plan_branch,
          arg_remark: item.remark,
          arg_state: '2',
          arg_ou_id: Cookie.get('OUID'),
        };
        transferPlanList.push(planData);
      });

      /*封装基本信息，即train_plan表数据 begin */
      //创建人ID
      trainPlanData["arg_create_person_id"] = Cookie.get('userid');
      //创建人姓名
      trainPlanData["arg_create_person_name"] = Cookie.get('username');
      //培训类型（1、总院必修   2、总院选修  3、通用计划  4、培训计划）
      trainPlanData["arg_train_type"] = '7';
      //是否超值（0：正常  1：超支）
      trainPlanData["arg_if_budget"] = arg_budgetValue;
      trainPlanData["arg_nextStepPerson"] = arg_nextStepPerson;
      //添加文件信息
      /*封装基本信息，即train_plan表数据 end */
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      const dataSourceList = this.props.importCreateCertificationDataList;
      dataSourceList.map((item) => {
        let planData = {
          arg_indexID: item.indexID,
          arg_dept_name: item.dept_name,
          arg_exam_name: item.exam_name,
          arg_exam_person_name: item.exam_person_name,
          arg_exam_person_id: '',
          arg_claim_fee: item.claim_fee,
          arg_exam_time: item.exam_time,
          arg_exam_grade: item.exam_grade,
          arg_exam_fee: item.exam_fee,
          arg_state: '2',
          arg_ou_id: Cookie.get('OUID'),
        };
        transferPlanList.push(planData);
      });

      /*封装基本信息，即train_plan表数据 begin */
      //创建人ID
      trainPlanData["arg_create_person_id"] = Cookie.get('userid');
      //创建人姓名
      trainPlanData["arg_create_person_name"] = Cookie.get('username');
      //培训类型（1、总院必修   2、总院选修  3、通用计划  4、培训计划）
      trainPlanData["arg_train_type"] = '8';
      //是否超值（0：正常  1：超支）
      trainPlanData["arg_if_budget"] = arg_budgetValue;
      trainPlanData["arg_nextStepPerson"] = arg_nextStepPerson;
      //添加文件信息
      /*封装基本信息，即train_plan表数据 end */
    }
    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'train_create_model/centerClassAdd',
        transferPlanList,
        trainPlanData,
        trainClassType,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/trainPlanList'
          }));
        }, 50);
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/trainPlanList'
      }));
    });
    // // 清空数据
    // this.setState({
    //   compulsoryClassPlanDataSource : [],
    //   electiveClassPlanDataSource : [],
    //   commonClassPlanDataSource : [],
    //   certificationClassPlanDataSource : [],
    // });
  };

  //提交对话框
  selectNextStep = () => { 

    /*根据课程类型，执行不同的方式，插入*/
    if (this.props.trainClassPlanType === 'general_compulsory_train_plan') {
      /*检查空字段*/
      const dataSourceList = this.state.compulsoryClassPlanDataSource;
      const dataSourceList1 = this.props.importCenterClassCompulsoryDataList;       

      if(dataSourceList1 === ''||dataSourceList1 === null||dataSourceList1 === undefined || dataSourceList1.length === 0)
      {
        message.error('请导入或新增课程');
        nullCheck = false;
        return;
      }
      let nullCheck = true;
      dataSourceList.map((item) => {
        /*空值校验*/
        if (this.checkNull(item.train_level)) {
          message.error('请选择培训级别，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_name)) {
          message.error('请选择培训课程名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_person) || !this.checkChinese(item.train_person)) {
          message.error('请选择受训部门/岗位，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour) || !this.checkNumberFirst(item.train_hour)) {
          message.error('请填写培训时长（最多两位小数的正数），备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour_unit)) {
          message.error('请选择培训时长单位名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_kind)) {
          message.error('请选择培训类型，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.assign_score)) {
          message.error('请选择赋分规则，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_time)) {
          message.error('请选择培训计划时间，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_teacher)) {
          message.error('请选择培训课程来源及师资，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.center_dept)) {
          message.error('请选择培训责任部门，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_fee) || !this.checkNumberFee(item.train_fee)) {
          message.error('请填写最多两位小数的正浮点数费用预算，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_grade) || !this.checkNumber(item.class_grade)) {
          message.error('请填写正整数学分值，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.plan_land)) {
          message.error('选择是或者否');
          nullCheck = false;
          return;
        }
        /*        if(this.checkNull(item.plan_branch))
                {
                  message.error('选择落地部门');
                  nullCheck = false;
                  return;
                }*/
      });
      if (nullCheck !== false) {
        this.setState({
          nextVisible: true,
        });

      } else {
        return;
      }
    }
    if (this.props.trainClassPlanType === 'general_elective_train_plan') {
      /*检查空字段*/
      const dataSourceList = this.state.electiveClassPlanDataSource;
      const dataSourceList1 = this.props.importCenterClassElectiveDataList;

      if(dataSourceList1 === ''||dataSourceList1 === null||dataSourceList1 === undefined || dataSourceList1.length === 0)
      {
        message.error('请导入或新增课程');
        nullCheck = false;
        return;
      }
      let nullCheck = true;
      dataSourceList.map((item) => {
        /*空值校验*/
        if (this.checkNull(item.train_level)) {
          message.error('请选择培训级别，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_level)) {
          message.error('请选择课程级别，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_name)) {
          message.error('请选择培训课程名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_person) || !this.checkChinese(item.train_person)) {
          message.error('请选择受训部门/岗位，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour) || !this.checkNumberFirst(item.train_hour)) {
          message.error('请填写培训时长（最多两位小数的正数），备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour_unit)) {
          message.error('请选择培训时长单位名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_kind)) {
          message.error('请选择培训类型，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.assign_score)) {
          message.error('请选择赋分规则，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_teacher)) {
          message.error('请选择培训课程来源及师资，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.center_dept)) {
          message.error('请选择培训责任部门，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_fee) || !this.checkNumberFee(item.train_fee)) {
          message.error('请填写最多两位小数的正浮点数费用预算，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_grade) || !this.checkNumber(item.class_grade)) {
          message.error('请填写正整数学分值，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.plan_land)) {
          message.error('选择是或者否');
          nullCheck = false;
          return;
        }
        /*        if(this.checkNull(item.plan_branch))
                {
                  message.error('选择落地部门');
                  nullCheck = false;
                  return;
                }*/
      });
      if (nullCheck !== false) {
        this.setState({
          nextVisible: true,
        });
      } else {
        return;
      }
    }
    if (this.props.trainClassPlanType === 'branch_department_train') {
      /*检查空字段*/
      const dataSourceList = this.state.commonClassPlanDataSource;
      const dataSourceList1 = this.props.importBranchAndDepartmentClassDataList;

      if(dataSourceList1 === ''||dataSourceList1 === null||dataSourceList1 === undefined || dataSourceList1.length === 0)
      {
        message.error('请导入或新增课程');
        nullCheck = false;
        return;
      }
      let nullCheck = true;
      dataSourceList.map((item) => {
        /*空值校验*/
        if (this.checkNull(item.train_level)) {
          message.error('请选择培训级别，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_level)) {
          message.error('请选择课程级别，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_name)) {
          message.error('请选择培训课程名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_group)) {
          message.error('请填写培训对象，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_person) || !this.checkNumber(item.train_person)) {
          message.error('请填写计划培训人数（正整数），备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour) || !this.checkNumberFirst(item.train_hour)) {
          message.error('请填写培训时长（最多两位小数的正数），备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_hour_unit)) {
          message.error('请选择培训时长单位名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_kind)) {
          message.error('请选择培训类型，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.assign_score)) {
          message.error('请选择赋分规则，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_time)) {
          message.error('请选择培训计划时间，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.center_dept)) {
          message.error('请选择培训责任部门，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_teacher)) {
          message.error('请选择培训师资，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.train_fee) || !this.checkNumberFee(item.train_fee)) {
          message.error('请填写最多两位小数的正浮点数费用预算，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.class_grade) || !this.checkNumber(item.class_grade)) {
          message.error('请填写正整数学分值，备注选填');
          nullCheck = false;
          return;
        }
      });
      if (nullCheck !== false) {
        this.setState({
          nextVisible: true,
        });
      } else {
        return;
      }
    }
    if (this.props.trainClassPlanType === 'train_certification') {
      /*检查空字段*/
      const dataSourceList = this.state.certificationClassPlanDataSource;
      const dataSourceList1 = this.props.importCreateCertificationDataList

      if(dataSourceList1 === ''||dataSourceList1 === null||dataSourceList1 === undefined || dataSourceList1.length === 0)
      {
        message.error('请导入或新增课程');
        nullCheck = false;
        return;
      }
      let nullCheck = true;
      dataSourceList.map((item) => {

        /*空值校验*/
        if (this.checkNull(item.dept_name)) {
          message.error('请选择部门名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.exam_name)) {
          message.error('请填写认证名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.exam_person_name)) {
          message.error('请描述考试人员名称，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.claim_fee) || !this.checkNumberFee(item.claim_fee)) {
          message.error('请填写最多两位小数的正浮点数报销标准，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.exam_time)) {
          message.error('请选择计划考试时间，备注选填');
          nullCheck = false;
          return;
        }
        if (this.checkNull(item.exam_fee) || !this.checkNumber(item.exam_fee)) {
          message.error('请填写正整数学分值，备注选填');
          nullCheck = false;
          return;
        }
      });
      if (nullCheck !== false) {
        this.setState({
          nextVisible: true,
        });
      }
      else {
        return;
      }
    }
  };
  //取消弹窗
  handleCancel = () => {
    this.setState({
      nextVisible: false,
    });
  };

  //关闭
  goBack() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainPlanList',
    }));
  }; 

  render() {
    /*下一处理人*/ 
    const { getFieldDecorator } = this.props.form;
    const nextPersonList = this.props.nextPersonList;
    const importCenterClassCompulsoryDataList = this.props.importCenterClassCompulsoryDataList;
  

    let initPerson = '';
    let nextDataList = '';
    let nextStepName = '';
    if (nextPersonList.length) {
      nextStepName = nextPersonList[0].submit_post_name;
      initPerson = nextPersonList[0].submit_user_id;
      nextDataList = nextPersonList.map(item =>
        <Select.Option value={item.submit_user_id}>{item.submit_user_name}</Select.Option>
      );
    };
    
    const trainClassPlanType = this.props.trainClassPlanType;
    const centerDept = this.props.centerDept;

    let centerDeptList = '';
    if (centerDept.length) {
      centerDeptList = centerDept.map(item =>
        <Select.Option value={item.deptname}>{item.deptname}</Select.Option>
      );
    };

    const postData = this.props.postDataList;

    let trainPostList = '';
    if (postData.length) {
      trainPostList = postData.map(item =>
        <Select.Option value={item.post_name}>{item.post_name}</Select.Option>
      );
    }; 

    const class_columns_compulsory = [
      {
        title: '序号',
        dataIndex: 'indexID',
        key: 'indexID',
        width: 50,
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      }, {
        title: '培训级别',
        dataIndex: 'train_level',
        key: 'train_level',
        width: 140,
        render: (text, record, index) => {
          return <Select placeholder="培训级别" style={{ width: '100%' }} onSelect={this.trainLevelSelect.bind(this, record)}>
            <Select.Option value={"全院级必修课"}>全院级必修课</Select.Option>
          </Select>
        },
      }, {
        title: '培训班名称/课程方向',
        dataIndex: 'class_name',
        key: 'class_name',
        width: 250,
        render: (text, record, index) => { return <Input placeholder="课程名称" name="class_name" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '受训部门/岗位',
        dataIndex: 'train_person',
        key: 'train_person',
        width: 180,
        render: (text, record, index) => {
          return <Select placeholder="受训人员" name="train_person" id={index} style={{ width: '100%' }} onSelect={this.trainPostSelect.bind(this, record)}>
            {trainPostList}
          </Select>
        },
      }, {
        title: '培训时长',
        dataIndex: 'train_hour',
        key: 'train_hour',
        width: 120,
        render: (text, record, index) => { return <Input placeholder="培训时长" name="train_hour" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '时长单位',
        dataIndex: 'train_hour_unit',
        key: 'train_hour_unit',
        width: 100,
        render: (text, record, index) => {
          return <Select placeholder="单位" style={{ width: '100%' }} onSelect={this.trainHourSelect.bind(this, record)}>
            <Select.Option value={"小时"}>小时</Select.Option>
            <Select.Option value={"天"}>天</Select.Option>
          </Select>
        },
      }, {
        title: '培训类型',
        dataIndex: 'train_kind',
        key: 'train_kind',
        width: 250,
        render: (text, record, index) => {
          return <Select placeholder="培训类型" style={{ width: '100%' }} onSelect={this.trainKindSelect.bind(this, record)}>
            <Select.Option value={"内训-外聘讲师培训"}>内训-外聘讲师培训</Select.Option>
            <Select.Option value={"内训-内部讲师培训"}>内训-内部讲师培训</Select.Option>
            <Select.Option value={"内训-参加集团或分子公司培训"}>内训-参加集团或分子公司培训</Select.Option>
            <Select.Option value={"外训-外派培训"}>外训-外派培训</Select.Option>
            <Select.Option value={"线上培训"}>线上培训</Select.Option>
            <Select.Option value={"培训班"}>培训班</Select.Option>
          </Select>
        },
      }, {
        title: '赋分规则',
        dataIndex: 'assign_score',
        key: 'assign_score',
        width: 150,
        render: (text, record, index) => {
          return <Select placeholder="赋分规则" style={{ width: '100%' }} onSelect={this.trainAssignScore.bind(this, record)}>
            <Select.Option value={"单一赋分"}>单一赋分</Select.Option>
            <Select.Option value={"按课赋分"}>按课赋分</Select.Option>
            <Select.Option value={"按人岗匹配赋分"}>按人岗匹配赋分</Select.Option>
            <Select.Option value={"按天赋分"}>按天赋分</Select.Option>
            <Select.Option value={"按模块赋分"}>按模块赋分</Select.Option>
          </Select>
        },
      }, {
        title: '计划培训时间',
        dataIndex: 'train_time',
        key: 'train_time',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="培训时间" style={{ width: '100%' }} onSelect={this.trainTimeSelect.bind(this, record)}>
            <Select.Option value={"第一季度"}>第一季度</Select.Option>
            <Select.Option value={"第二季度"}>第二季度</Select.Option>
            <Select.Option value={"第三季度"}>第三季度</Select.Option>
            <Select.Option value={"第四季度"}>第四季度</Select.Option>
            <Select.Option value={"全年执行"}>全年执行</Select.Option>
          </Select>
        },
      }, {
        title: '课程来源/师资',
        dataIndex: 'train_teacher',
        key: 'train_teacher',
        width: 150,
        render: (text, record, index) => {
          return <Select placeholder="培训师资" style={{ width: '100%' }} onSelect={this.trainTeacherSelect.bind(this, record)}>
            <Select.Option value={"线上"}>线上</Select.Option>
            <Select.Option value={"线下-内训师"}>线下-内训师</Select.Option>
            <Select.Option value={"线下-外聘讲师"}>线下-外聘讲师</Select.Option>
            <Select.Option value={"线下-外派"}>线下-外派</Select.Option>
          </Select>
        },
      }, {
        title: '责任部门',
        dataIndex: 'center_dept',
        key: 'center_dept',
        width: 220,
        render: (text, record, index) => {
          return <Select placeholder="责任部门" name="center_dept" id={index} style={{ width: '100%' }} onSelect={this.deptSelect.bind(this, record)}>
            {centerDeptList}
          </Select>
        },
      }, {
        title: '费用预算',
        dataIndex: 'train_fee',
        key: 'train_fee',
        width: 110,
        render: (text, record, index) => { return <Input placeholder="费用预算" name="train_fee" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '学分值',
        dataIndex: 'class_grade',
        key: 'class_grade',
        width: 100,
        render: (text, record, index) => { return <Input placeholder="学分值" name="class_grade" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '是否落地',
        dataIndex: 'plan_land',
        key: 'plan_land',
        width: 100,
        render: (text, record, index) => {
          return <Select placeholder="是否落地" style={{ width: '100%' }} onSelect={this.train_plan_land.bind(this, record)}>
            <Select.Option value={"是"}>是</Select.Option>
            <Select.Option value={"否"}>否</Select.Option>
          </Select>
        }
      }, {
        title: '落地组织机构',
        dataIndex: 'plan_branch',
        key: 'plan_branch',
        width: 160,
        render: (text, record, index) => {
          let aa = false;
          if (record.plan_land === '否') {
            aa = true;
          }
          return <Select disabled={aa} placeholder="落地组织机构" style={{ width: '100%' }} onSelect={this.train_plan_branch.bind(this, record)}>
            <Select.Option value={"西安软件研究院"}>西安软件研究院</Select.Option>
            <Select.Option value={"济南软件研究院"}>济南软件研究院</Select.Option>
            <Select.Option value={"广州软件研究院"}>广州软件研究院</Select.Option>
            <Select.Option value={"南京软件研究院"}>南京软件研究院</Select.Option>
            <Select.Option value={"哈尔滨软件研究院"}>哈尔滨软件研究院</Select.Option>
          </Select>
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (text, record, index) => { return <Input placeholder="备注" name="remark" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (text, record, index) => {
          return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
        },
      }
    ];
    const class_columns_elective = [
      {
        title: '序号',
        dataIndex: 'indexID',
        key: 'indexID',
        width: 40,
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      }, {
        title: '培训级别',
        dataIndex: 'train_level',
        key: 'train_level',
        width: 140,
        render: (text, record, index) => {
          return <Select placeholder="培训级别" style={{ width: '100%' }} onSelect={this.trainLevelSelect.bind(this, record)}>
            <Select.Option value={"全院级选修课"}>全院级选修课</Select.Option>
          </Select>
        },
      }, {
        title: '课程级别',
        dataIndex: 'class_level',
        key: 'class_level',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="课程级别" style={{ width: '100%' }} onSelect={this.classLevelSelect.bind(this, record)}>
            <Select.Option value={"初级"}>初级</Select.Option>
            <Select.Option value={"中级"}>中级</Select.Option>
            <Select.Option value={"高级"}>高级</Select.Option>
          </Select>
        },
      }, {
        title: '培训班名称/课程方向',
        dataIndex: 'class_name',
        key: 'class_name',
        width: 170,
        render: (text, record, index) => { return <Input placeholder="名称/方向" name="class_name" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '受训部门/岗位',
        dataIndex: 'train_person',
        key: 'train_person',
        width: 180,
        render: (text, record, index) => {
          return <Select placeholder="部门/岗位" name="train_person" id={index} style={{ width: '100%' }} onSelect={this.trainPostSelect.bind(this, record)}>
            {trainPostList}
          </Select>
        },
      }, {
        title: '计划培训时长',
        dataIndex: 'train_hour',
        key: 'train_hour',
        width: 120,
        render: (text, record, index) => { return <Input placeholder="培训时长" name="train_hour" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '时长单位',
        dataIndex: 'train_hour_unit',
        key: 'train_hour_unit',
        width: 100,
        render: (text, record, index) => {
          return <Select placeholder="时长单位" style={{ width: '100%' }} onSelect={this.trainHourSelect.bind(this, record)}>
            <Select.Option value={"小时"}>小时</Select.Option>
            <Select.Option value={"天"}>天</Select.Option>
          </Select>
        },
      }, {
        title: '培训类型',
        dataIndex: 'train_kind',
        key: 'train_kind',
        width: 250,
        render: (text, record, index) => {
          return <Select placeholder="培训类型" style={{ width: '100%' }} onSelect={this.trainKindSelect.bind(this, record)}>
            <Select.Option value={"内训-外聘讲师培训"}>内训-外聘讲师培训</Select.Option>
            <Select.Option value={"内训-内部讲师培训"}>内训-内部讲师培训</Select.Option>
            <Select.Option value={"内训-参加集团或分子公司培训"}>内训-参加集团或分子公司培训</Select.Option>
            <Select.Option value={"外训-外派培训"}>外训-外派培训</Select.Option>
            <Select.Option value={"线上培训"}>线上培训</Select.Option>
            <Select.Option value={"培训班"}>培训班</Select.Option>
          </Select>
        },
      }, {
        title: '赋分规则',
        dataIndex: 'assign_score',
        key: 'assign_score',
        width: 150,
        render: (text, record, index) => {
          return <Select placeholder="赋分规则" style={{ width: '100%' }} onSelect={this.trainAssignScore.bind(this, record)}>
            <Select.Option value={"单一赋分"}>单一赋分</Select.Option>
            <Select.Option value={"按课赋分"}>按课赋分</Select.Option>
            <Select.Option value={"按人岗匹配赋分"}>按人岗匹配赋分</Select.Option>
            <Select.Option value={"按天赋分"}>按天赋分</Select.Option>
            <Select.Option value={"按模块赋分"}>按模块赋分</Select.Option>
          </Select>
        },
      }, {
        title: '课程来源/师资',
        dataIndex: 'train_teacher',
        key: 'train_teacher',
        width: 150,
        render: (text, record, index) => {
          return <Select placeholder="来源/师资" style={{ width: '100%' }} onSelect={this.trainTeacherSelect.bind(this, record)}>
            <Select.Option value={"线上"}>线上</Select.Option>
            <Select.Option value={"线下-内训师"}>线下-内训师</Select.Option>
            <Select.Option value={"线下-外聘讲师"}>线下-外聘讲师</Select.Option>
            <Select.Option value={"线下-外派"}>线下-外派</Select.Option>
          </Select>
        },
      }, {
        title: '责任部门',
        dataIndex: 'center_dept',
        key: 'center_dept',
        width: 220,
        render: (text, record, index) => {
          return <Select placeholder="责任部门" name="center_dept" id={index} style={{ width: '100%' }} onSelect={this.deptSelect.bind(this, record)}>
            {centerDeptList}
          </Select>
        },
      }, {
        title: '费用预算',
        dataIndex: 'train_fee',
        key: 'train_fee',
        width: 110,
        render: (text, record, index) => { return <Input placeholder="费用预算" name="train_fee" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '学分值',
        dataIndex: 'class_grade',
        key: 'class_grade',
        width: 100,
        render: (text, record, index) => { return <Input placeholder="学分值" name="class_grade" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '是否落地',
        dataIndex: 'plan_land',
        key: 'plan_land',
        width: 100,
        render: (text, record, index) => {
          return <Select placeholder="是否落地" style={{ width: '100%' }} onSelect={this.train_plan_land.bind(this, record)}>
            <Select.Option value={"是"}>是</Select.Option>
            <Select.Option value={"否"}>否</Select.Option>
          </Select>
        },
      }, {
        title: '落地组织机构',
        dataIndex: 'plan_branch',
        key: 'plan_branch',
        width: 160,
        render: (text, record, index) => {
          let aa = false;
          if (record.plan_land === '否') {
            aa = true;
          }
          return <Select disabled={aa} placeholder="落地组织机构" style={{ width: '100%' }} onSelect={this.train_plan_branch.bind(this, record)}>
            <Select.Option value={"西安软件研究院"}>西安软件研究院</Select.Option>
            <Select.Option value={"济南软件研究院"}>济南软件研究院</Select.Option>
            <Select.Option value={"广州软件研究院"}>广州软件研究院</Select.Option>
            <Select.Option value={"南京软件研究院"}>南京软件研究院</Select.Option>
            <Select.Option value={"哈尔滨软件研究院"}>哈尔滨软件研究院</Select.Option>
          </Select>
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (text, record, index) => { return <Input placeholder="备注" name="remark" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (text, record, index) => {
          return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
        },
      }
    ];
    const class_columns_common = [
      {
        title: '序号',
        dataIndex: 'indexID',
        key: 'indexID',
        width: 40,
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      }, {
        title: '培训级别',
        dataIndex: 'train_level',
        key: 'train_level',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="培训级别" style={{ width: '100%' }} onSelect={this.trainLevelSelect.bind(this, record)}>
            <Select.Option value={"全院级"}>全院级</Select.Option>
            <Select.Option value={"分院级"}>分院级</Select.Option>
            <Select.Option value={"部门级"}>部门级</Select.Option>
          </Select>
        },
      }, {
        title: '课程级别',
        dataIndex: 'class_level',
        key: 'class_level',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="课程级别" style={{ width: '100%' }} onSelect={this.classLevelSelect.bind(this, record)}>
            <Select.Option value={"初级"}>初级</Select.Option>
            <Select.Option value={"中级"}>中级</Select.Option>
            <Select.Option value={"高级"}>高级</Select.Option>
          </Select>
        },
      }, {
        title: '培训班名称/课程方向',
        dataIndex: 'class_name',
        key: 'class_name',
        width: 170,
        render: (text, record, index) => { return <Input placeholder="名称/方向" name="class_name" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '培训对象',
        dataIndex: 'train_group',
        key: 'train_group',
        width: 120,
        render: (text, record, index) => { return <Input placeholder="培训对象" name="train_group" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '计划培训人数',
        dataIndex: 'train_person',
        key: 'train_person',
        width: 120,
        render: (text, record, index) => { return <Input placeholder="培训人数" name="train_person" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '计划培训时长',
        dataIndex: 'train_hour',
        key: 'train_hour',
        width: 120,
        render: (text, record, index) => { return <Input placeholder="培训时长" name="train_hour" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '时长单位',
        dataIndex: 'train_hour_unit',
        key: 'train_hour_unit',
        width: 100,
        render: (text, record, index) => {
          return <Select placeholder="时长单位" style={{ width: '100%' }} onSelect={this.trainHourSelect.bind(this, record)}>
            <Select.Option value={"小时"}>小时</Select.Option>
            <Select.Option value={"天"}>天</Select.Option>
          </Select>
        },
      }, {
        title: '培训类型',
        dataIndex: 'train_kind',
        key: 'train_kind',
        width: 170,
        render: (text, record, index) => {
          return <Select placeholder="培训类型" style={{ width: '100%' }} onSelect={this.trainKindSelect.bind(this, record)}>
            <Select.Option value={"内训-外聘讲师培训"}>内训-外聘讲师培训</Select.Option>
            <Select.Option value={"内训-内部讲师培训"}>内训-内部讲师培训</Select.Option>
            <Select.Option value={"内训-参加集团或分子公司培训"}>内训-参加集团或分子公司培训</Select.Option>
            <Select.Option value={"外训-外派培训"}>外训-外派培训</Select.Option>
            <Select.Option value={"线上培训"}>线上培训</Select.Option>
            <Select.Option value={"培训班"}>培训班</Select.Option>
          </Select>
        },
      }, {
        title: '赋分规则',
        dataIndex: 'assign_score',
        key: 'assign_score',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="赋分规则" style={{ width: '100%' }} onSelect={this.trainAssignScore.bind(this, record)}>
            <Select.Option value={"单一赋分"}>单一赋分</Select.Option>
            <Select.Option value={"按课赋分"}>按课赋分</Select.Option>
            <Select.Option value={"按人岗匹配赋分"}>按人岗匹配赋分</Select.Option>
            <Select.Option value={"按天赋分"}>按天赋分</Select.Option>
            <Select.Option value={"按模块赋分"}>按模块赋分</Select.Option>
          </Select>
        },
      }, {
        title: '计划培训时间',
        dataIndex: 'train_time',
        key: 'train_time',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="培训时间" style={{ width: '100%' }} onSelect={this.trainTimeSelect.bind(this, record)}>
            <Select.Option value={"第一季度"}>第一季度</Select.Option>
            <Select.Option value={"第二季度"}>第二季度</Select.Option>
            <Select.Option value={"第三季度"}>第三季度</Select.Option>
            <Select.Option value={"第四季度"}>第四季度</Select.Option>
            <Select.Option value={"全年执行"}>全年执行</Select.Option>
          </Select>
        },
      }, {
        title: '责任部门',
        dataIndex: 'center_dept',
        key: 'center_dept',
        width: 160,
        render: (text, record, index) => {
          return <Select placeholder="责任部门" name="center_dept" id={index} style={{ width: '100%' }} onSelect={this.deptSelect.bind(this, record)}>
            {centerDeptList}
          </Select>
        },
      }, {
        title: '培训师资',
        dataIndex: 'train_teacher',
        key: 'train_teacher',
        width: 120,
        render: (text, record, index) => {
          return <Select placeholder="培训师资" style={{ width: '100%' }} onSelect={this.trainTeacherSelect.bind(this, record)}>
            <Select.Option value={"线上"}>线上</Select.Option>
            <Select.Option value={"线下-内训师"}>线下-内训师</Select.Option>
            <Select.Option value={"线下-外聘讲师"}>线下-外聘讲师</Select.Option>
            <Select.Option value={"线下-外派"}>线下-外派</Select.Option>
          </Select>
        },
      }, {
        title: '费用预算',
        dataIndex: 'train_fee',
        key: 'train_fee',
        width: 110,
        render: (text, record, index) => { return <Input placeholder="费用预算" name="train_fee" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '学分值',
        dataIndex: 'class_grade',
        key: 'class_grade',
        width: 100,
        render: (text, record, index) => { return <Input placeholder="学分值" name="class_grade" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '是否落地',
        dataIndex: 'plan_land',
        key: 'plan_land',
        width: 120,
        render: (text, record, index) => {
          let bb = true;
          if (record.train_level === '全院级') {
            bb = false;
          }
          return <Select disabled={bb} placeholder="是否落地" style={{ width: '100%' }} onSelect={this.train_plan_land.bind(this, record)}>
            <Select.Option value={"是"}>是</Select.Option>
            <Select.Option value={"否"}>否</Select.Option>
          </Select>
        },
      }, {
        title: '落地组织机构',
        dataIndex: 'plan_branch',
        key: 'plan_branch',
        width: 140,
        render: (text, record, index) => {
          let aa = true;
          if (record.plan_land === '是' && record.train_level === '全院级') {
            aa = false;
          }
          return <Select disabled={aa} placeholder="落地组织机构" style={{ width: '100%' }} onSelect={this.train_plan_branch.bind(this, record)}>
            <Select.Option value={"西安软件研究院"}>西安软件研究院</Select.Option>
            <Select.Option value={"济南软件研究院"}>济南软件研究院</Select.Option>
            <Select.Option value={"广州软件研究院"}>广州软件研究院</Select.Option>
            <Select.Option value={"南京软件研究院"}>南京软件研究院</Select.Option>
            <Select.Option value={"哈尔滨软件研究院"}>哈尔滨软件研究院</Select.Option>
          </Select>
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 170,
        render: (text, record, index) => { return <Input placeholder="备注" name="remark" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 40,
        render: (text, record, index) => {
          return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
        },
      }
    ];
    const class_columns_certification = [
      {
        title: '序号',
        dataIndex: 'indexID',
        key: 'indexID',
        width: '5%',
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      }, {
        title: '部门名称',
        dataIndex: 'dept_name',
        key: 'dept_name',
        width: '15%',
        render: (text, record, index) => {
          return <Select placeholder="部门名称" name="dept_name" id={index} style={{ width: '100%' }} onSelect={this.deptNameSelect.bind(this, record)}>
            {centerDeptList}
          </Select>
        },
      }, {
        title: '认证名称',
        dataIndex: 'exam_name',
        key: 'exam_name',
        width: '15%',
        render: (text, record, index) => { return <Input placeholder="认证名称" name="exam_name" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '考试人员',
        dataIndex: 'exam_person_name',
        key: 'exam_person_name',
        width: '15%',
        render: (text, record, index) => { return <Input placeholder="考试人员" name="exam_person_name" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '报销标准',
        dataIndex: 'claim_fee',
        key: 'claim_fee',
        width: '10%',
        render: (text, record, index) => { return <Input placeholder="报销标准" name="claim_fee" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '计划考试时间',
        dataIndex: 'exam_time',
        key: 'exam_time',
        width: '15%',
        render: (text, record, index) => {
          return <Select placeholder="计划考试时间" style={{ width: '100%' }} onSelect={this.trainTimeSelect.bind(this, record)}>
            <Select.Option value={"第一季度"}>第一季度</Select.Option>
            <Select.Option value={"第二季度"}>第二季度</Select.Option>
            <Select.Option value={"第三季度"}>第三季度</Select.Option>
            <Select.Option value={"第四季度"}>第四季度</Select.Option>
            <Select.Option value={"全年执行"}>全年执行</Select.Option>
          </Select>
        },
      }, {
        title: '考试费预算',
        dataIndex: 'exam_fee',
        key: 'exam_fee',
        width: '10%',
        render: (text, record, index) => { return <Input placeholder="考试费预算" name="exam_fee" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '学分',
        dataIndex: 'exam_grade',
        key: 'exam_grade',
        width: '10%',
        render: (text, record, index) => { return <Input placeholder="学分" name="exam_grade" id={index} onChange={this.onChange.bind(this)} /> },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '5%',
        render: (text, record, index) => {
          return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
        },
      }
    ];
    const class_columns_compulsory1 = [
      { title: '序号', dataIndex: 'number1',width: 50},
      { title: '培训级别', dataIndex: 'train_level' ,width: 140},
      { title: '课程名称/方向', dataIndex: 'class_name',width: 250},
      { title: '受训部门/岗位', dataIndex: 'train_person' ,width: 180},
      { title: '计划培训时长', dataIndex: 'train_hour',width: 120 },
      { title: '培训类型', dataIndex: 'train_kind' ,width: 250},
      { title: '赋分规则', dataIndex: 'assign_score' ,width: 150},
      { title: '计划培训时间', dataIndex: 'train_time' ,width: 120},
      { title: '课程来源/师资', dataIndex: 'train_teacher' ,width: 150},
      { title: '责任部门', dataIndex: 'center_dept' ,width: 220},
      { title: '费用预算', dataIndex: 'train_fee',width: 110 },
      { title: '学分值', dataIndex: 'class_grade' ,width: 100},
      { title: '是否落地', dataIndex: 'plan_land',width: 100 },
      { title: '落地组织结构', dataIndex: 'plan_branch' ,width: 160},
      { title: '备注', dataIndex: 'remark' ,width: 100},
      { title: '操作', dataIndex: '',  key: 'x' ,width: 100, render: (text,record) => (
        <span>
        <a onClick={()=>this.deleteCompulsory(record)} >删除</a>
         <span className="ant-divider" />
        </span>
      )},
    ];
    const class_columns_elective1 = [
      { title: '序号', dataIndex: 'number1',width: 50},
      { title: '培训级别', dataIndex: 'train_level' ,width: 140},
      { title: '课程级别', dataIndex: 'class_level' ,width: 140},
      { title: '课程名称/方向', dataIndex: 'class_name',width: 250},
      { title: '受训部门/岗位', dataIndex: 'train_person' ,width: 180},
      { title: '计划培训时长', dataIndex: 'train_hour' ,width: 120},
      { title: '培训类型', dataIndex: 'train_kind' ,width: 250},
      { title: '赋分规则', dataIndex: 'assign_score' ,width: 150},
      { title: '课程来源/师资', dataIndex: 'train_teacher',width: 150},
      { title: '责任部门', dataIndex: 'center_dept',width: 220},
      { title: '费用预算', dataIndex: 'train_fee' ,width: 110},
      { title: '学分值', dataIndex: 'class_grade' ,width: 100},
      { title: '是否落地', dataIndex: 'plan_land' ,width: 100},
      { title: '落地组织机构', dataIndex: 'plan_branch' ,width: 160},
      { title: '备注', dataIndex: 'remark' ,width: 100},
      { title: '操作', dataIndex: '',  key: 'x', width: 100, render: (text,record) => (
        <span>
        <a onClick={()=>this.deleteElective(record)} >删除</a>
         <span className="ant-divider" />
        </span>
      )},
    ];
    const class_columns_common1 = [
      { title: '序号', dataIndex: 'number1' ,width: 50},
      { title: '培训级别', dataIndex: 'train_level' ,width: 140},
      { title: '课程级别', dataIndex: 'class_level',width: 140 },
      { title: '课程名称/方向', dataIndex: 'class_name' ,width: 250},
      { title: '培训对象', dataIndex: 'train_group' ,width: 140},
      { title: '计划培训人数', dataIndex: 'train_person',width: 140 },
      { title: '计划培训时长', dataIndex: 'train_hour' ,width: 120},
      { title: '培训类型', dataIndex: 'train_kind' ,width: 250},
      { title: '赋分规则', dataIndex: 'assign_score' ,width: 150},
      { title: '计划培训时间', dataIndex: 'train_time' ,width: 120},
      { title: '责任部门', dataIndex: 'center_dept' ,width: 220},
      { title: '培训师资', dataIndex: 'train_teacher' ,width: 150},
      { title: '费用预算', dataIndex: 'train_fee' ,width: 110},
      { title: '学分值', dataIndex: 'class_grade' ,width: 100},
      { title: '是否落地', dataIndex: 'plan_land' ,width: 100},
      { title: '落地组织结构', dataIndex: 'plan_branch' ,width:160 },
      { title: '备注', dataIndex: 'remark' ,width: 100},
      { title: '操作', dataIndex: '',  key: 'x', width: 100, render: (text,record) => (
        <span>
        <a onClick={()=>this.deleteBranch(record)} >删除</a>
         <span className="ant-divider" />
        </span>
      )},
    ];
    const class_columns_certification1 = [
      { title: '序号', dataIndex: 'indexID',width:50},
      { title: '部门名称', dataIndex: 'dept_name',width:200},
      { title: '认证名称', dataIndex: 'exam_name' ,width:230},
      { title: '考试人员', dataIndex: 'exam_person_name' ,width:130},
      { title: '报销标准', dataIndex: 'claim_fee' ,width:140},
      { title: '计划考试时间', dataIndex: 'exam_time' ,width:120},
      { title: '考试费预算', dataIndex: 'exam_fee' ,width:110},
      { title: '学分', dataIndex: 'exam_grade' ,width:90},
      { title: '操作', dataIndex: '',  key: 'x',width: 100, render: (text,record) => (
        <span>
        <a onClick={()=>this.deleteCreateCertification(record)} >删除</a>
         <span className="ant-divider" />
        </span>
      )},
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 14 },
      },
      textAlign: 'center',
    };


    return (
      <div>
        {
          !trainClassPlanType ?
            <Row span={2} style={{ textAlign: 'center' }}>
              <h2>请返回选择需要新增的培训课程</h2>
            </Row>
            :
            <Row span={2} style={{ textAlign: 'center' }}><h2>新增 {new Date().getFullYear()} 年
          {
                trainClassPlanType === 'general_compulsory_train_plan' ? '全院级必修课' :
                  (trainClassPlanType === 'general_elective_train_plan' ? '全院级选修课' :
                    (trainClassPlanType === 'branch_department_train' ? '' :
                      (trainClassPlanType === 'train_certification' ? '认证考试' : '')))
              }
              培训计划</h2></Row>
        }  
        <br />
        <div  style={{ float: 'left', display: trainClassPlanType === 'general_compulsory_train_plan' ? "" : "none"}}>
          <a href="/filemanage/download/needlogin/hr/compulsory_class_plan.xls" ><Button >{'模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.props.trainClassPlanType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div  style={{ float: 'left',display: trainClassPlanType === 'general_elective_train_plan' ? "" : "none" }}>
          <a href="/filemanage/download/needlogin/hr/elective_class_plan.xls" ><Button >{'模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.props.trainClassPlanType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div  style={{ float: 'left',display: trainClassPlanType === 'branch_department_train' ? "" : "none"}}>
          <a href="/filemanage/download/needlogin/hr/general_class_plan.xls" ><Button >{'模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.props.trainClassPlanType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div  style={{ float: 'left',display: trainClassPlanType === 'train_certification' ? "" : "none"}}>
          <a href="/filemanage/download/needlogin/hr/exam_class_plan.xlsx" ><Button >{'模板下载'}</Button></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} importType = {this.props.trainClassPlanType} />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        { 
          trainClassPlanType ?
            <div style={{ textAlign: "right" }}>
              <Button type="primary" onClick={this.addNewTrainPlanApply }>{'新 增'}</Button>
            </div>
            :
            <div style={{ textAlign: "center" }}>
              <Button type="primary" onClick={this.goBack}>{'返 回'}</Button>
            </div>
        }
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'general_compulsory_train_plan' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_compulsory1}
            dataSource={this.props.importCenterClassCompulsoryDataList}
            pagination={true}
            scroll={{ x: 2300, y: 400 }}
            //width={'100%'}
            bordered= {true}
          />
          <br /> 
          <Row span={24}>
            <span>预算情况：</span>
            <Radio.Group onChange={this.budgetChange} value={this.state.budgetValue}>
              <Radio value={0}>未超预算</Radio>
              <Radio value={1}>超过预算</Radio>
              <Radio value={2}>未匹配经费前一事一议计划</Radio>
            </Radio.Group>
        </Row>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={() => this.goBack()}>{'关闭'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.selectNextStep()}>{'提交'}</Button>
          </div>
        </Card>
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'general_elective_train_plan' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_elective1}
            dataSource={this.props.importCenterClassElectiveDataList}
            scroll={{ x: 2320, y: 450 }}
            pagination={true}
            //width={'100%'}
            bordered= {true}
          />
           <br /> 
          <Row span={24}>
            <span>预算情况：</span>
            <Radio.Group onChange={this.budgetChange} value={this.state.budgetValue}>
              <Radio value={0}>未超预算</Radio>
              <Radio value={1}>超过预算</Radio>
              <Radio value={2}>未匹配经费前一事一议计划</Radio>
            </Radio.Group>
        </Row>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={() => this.goBack()}>{'关闭'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.selectNextStep()}>{'提交'}</Button>
          </div>
        </Card>
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'branch_department_train' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_common1}
            dataSource={this.props.importBranchAndDepartmentClassDataList}
            scroll={{ x: 2540, y: 450 }}
            pagination={true}
          //  width={'100%'}
            bordered= {true}
          />
          <br /> 
          <Row span={24}>
            <span>预算情况：</span>
            <Radio.Group onChange={this.budgetChange} value={this.state.budgetValue}>
              <Radio value={0}>未超预算</Radio>
              <Radio value={1}>超过预算</Radio>
              <Radio value={2}>未匹配经费前一事一议计划</Radio>
            </Radio.Group>
        </Row>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={() => this.goBack()}>{'关闭'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.selectNextStep()}>{'提交'}</Button>
          </div>
        </Card> 
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'train_certification' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_certification1}
            dataSource={this.props.importCreateCertificationDataList}
            pagination={false}
           // width={'100%'}
            scroll={{ x: 1170, y: 450 }}
            bordered={true}
          />
           <br /> 
          <Row span={24}>
            <span>预算情况：</span>
            <Radio.Group onChange={this.budgetChange} value={this.state.budgetValue}>
              <Radio value={0}>未超预算</Radio>
              <Radio value={1}>超过预算</Radio>
              <Radio value={2}>未匹配经费前一事一议计划</Radio>
            </Radio.Group>
        </Row>
          <br />
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={() => this.goBack()}>{'关闭'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.selectNextStep()}>{'提交'}</Button>
          </div>
        </Card>
        <br />
        <Modal
          title="新增培训计划"
          visible={this.state.modelVisible}
          onOk={this.addNewTrainPlanApplyOK}
          onCancel={this.addNewTrainPlanApplyCancel}
          width = "1000px"
        >
          <div>
          <Button type="primary" onClick={this.handleAdd}>{'添 加'}</Button>
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'general_compulsory_train_plan' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_compulsory}
            dataSource={this.state.compulsoryClassPlanDataSource}
            pagination={false}
            scroll={{ x: 2400, y: 450 }}
            bordered={true}
          />
          <br />
          <br />
        </Card>
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'general_elective_train_plan' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_elective}
            dataSource={this.state.electiveClassPlanDataSource}
            pagination={false}
            scroll={{ x: 2320, y: 450 }}
            bordered={true}
          />

          <br />
          <br />
        </Card>
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'branch_department_train' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_common}
            dataSource={this.state.commonClassPlanDataSource}
            pagination={false}
            scroll={{ x: 3750, y: 450 }}
            width={'100%'}
            bordered={true}
          />
          <br />
          <br />
        </Card>
          <Card title="课程详细信息" style={{ display: trainClassPlanType === 'train_certification' ? "" : "none" }} width={'100%'}>
          <Table
            columns={class_columns_certification}
            dataSource={this.state.certificationClassPlanDataSource}
            pagination={false}
            scroll={{ x: '100%', y: 450 }}
            width={'100%'}
            bordered={true}
          />

          <br />
          <br />
        </Card>
          </div>
        </Modal>
        <Modal
          title="流程处理"
          visible={this.state.nextVisible}
          onOk={() => this.addPlan()}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <Form.Item label={'下一步环节'} {...formItemLayout}>
                <Input style={{ color: '#000' }} value={nextStepName} disabled={true} />
              </Form.Item>
              <Form.Item label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextStepPerson', {
                  initialValue: initPerson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initPerson} placeholder="请选择负责人">
                    {nextDataList}
                  </Select>)}
              </Form.Item>
            </Form>
          </div>
        </Modal>

      </div>
    );
  }
}
 
function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_create_model,
    ...state.train_create_model
  };
}
DynAddClass = Form.create()(DynAddClass);
export default connect(mapStateToProps)(DynAddClass);

