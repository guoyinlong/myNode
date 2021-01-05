/**
 * 文件说明：培训管理-创建培训计划model
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-09
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { message } from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";

//导入文件数据整理
function dataFrontDataCompulsory(data) {
  let frontDataList = [];
  var result = '';
  var result_split = [];
  var number = '0';
  for (let item in data) {
    if (data[item].是否落地 === '是') {
      result = data[item].落地组织机构;
      result_split = result.split(',');
      for (var i = 0; i < result_split.length; i++) {
        number++;
        let newData = {
          //序号
          indexID: data[item].序号,
          //培训级别
          train_level: data[item].培训级别,
          //课程名称/方向
          class_name: data[item].课程名称及方向,
          //受训部门-岗位
          train_person: data[item].受训部门及岗位,
          //计划培训时长（小时）
          train_hour: data[item].计划培训时长 + data[item].计划培训时长单位,
          //培训类型
          train_kind: data[item].培训类型,
          //赋分规则
          assign_score: data[item].赋分规则,
          //培训时间（第一季度）
          train_time: data[item].计划培训时间,
          //课程来源-师资
          train_teacher: data[item].课程来源及师资,
          //责任部门
          center_dept: data[item].责任部门.split('-')[1],
          //费用预算
          train_fee: data[item].费用预算,
          //学分值
          class_grade: data[item].学分值,
          // 计划是否落地
          plan_land: data[item].是否落地,
          // 计划落地分院 字符分割（，split）
          plan_branch: result_split[i],
          //备注
          remark: data[item].备注,
          number1: number,
        };
        frontDataList.push(newData);
      }
    }
    else if (data[item].是否落地 == '否' && data[item].落地组织机构 != null) {
      message.error("非落地课程，无法落地到分院");
    }
    else {
      number++;
      let newData = {
        //序号
        indexID: data[item].序号,
        //培训级别
        train_level: data[item].培训级别,
        //课程名称/方向
        class_name: data[item].课程名称及方向,
        //受训部门-岗位
        train_person: data[item].受训部门及岗位,
        //计划培训时长（小时）
        train_hour: data[item].计划培训时长 + data[item].计划培训时长单位,
        //培训类型
        train_kind: data[item].培训类型,
        //赋分规则
        assign_score: data[item].赋分规则,
        //培训时间（第一季度）
        train_time: data[item].计划培训时间,
        //课程来源-师资
        train_teacher: data[item].课程来源及师资,
        //责任部门
        center_dept: data[item].责任部门.split('-')[1],
        //费用预算
        train_fee: data[item].费用预算,
        //学分值
        class_grade: data[item].学分值,
        // 计划是否落地
        plan_land: data[item].是否落地,
        // 计划落地分院 字符分割（，split）
        plan_branch: data[item].落地组织机构,
        //备注
        remark: data[item].备注,
        number1: number,
      };
      frontDataList.push(newData);
    }
  }
  return frontDataList;
}
function dataFrontDataElective(data) {
  let frontDataList = [];
  var result = '';
  var result_split = [];
  var number = '0';
  for (let item in data) {
    if (data[item].是否落地 === '是') {
      result = data[item].落地组织机构;
      result_split = result.split(',');
      for (var i = 0; i < result_split.length; i++) {
        number++;
        let newData = {
          //序号
          indexID: data[item].序号,
          //培训级别
          train_level: data[item].培训级别,
          //课程级别
          class_level: data[item].课程级别,
          //课程名称/方向
          class_name: data[item].课程名称及方向,
          //受训部门-岗位
          train_person: data[item].岗位,
          //计划培训时长（小时）
          train_hour: data[item].计划培训时长 + data[item].计划培训时长单位,
          //培训类型
          train_kind: data[item].培训类型,
          //赋分规则
          assign_score: data[item].赋分规则,
          //课程来源-师资
          train_teacher: data[item].课程来源及师资,
          //责任部门
          center_dept: data[item].责任部门.split('-')[1],
          //费用预算
          train_fee: data[item].费用预算,
          //学分值
          class_grade: data[item].学分值,
          //是否落地
          plan_land: data[item].是否落地,
          // 落地组织机构
          plan_branch: result_split[i],
          //备注
          remark: data[item].备注,
          number1: number,
        };
        frontDataList.push(newData);
      }
    }
    else if (data[item].是否落地 == '否' && data[item].落地组织机构 != null) {
      message.error("非落地课程，无法落地到分院");
    }
    else {
      number++;
      let newData = {
        //序号
        indexID: data[item].序号,
        //培训级别
        train_level: data[item].培训级别,
        //课程级别
        class_level: data[item].课程级别,
        //课程名称/方向
        class_name: data[item].课程名称及方向,
        //受训部门-岗位
        train_person: data[item].岗位,
        //计划培训时长（小时）
        train_hour: data[item].计划培训时长 + data[item].计划培训时长单位,
        //培训类型
        train_kind: data[item].培训类型,
        //赋分规则
        assign_score: data[item].赋分规则,
        //课程来源-师资
        train_teacher: data[item].课程来源及师资,
        //责任部门
        center_dept: data[item].责任部门.split('-')[1],
        //费用预算
        train_fee: data[item].费用预算,
        //学分值
        class_grade: data[item].学分值,
        //是否落地
        plan_land: data[item].是否落地,
        // 落地组织机构
        plan_branch: data[item].落地组织机构,
        //备注
        remark: data[item].备注,
        number1: number,
      };
      frontDataList.push(newData);
    }
  }
  return frontDataList;
}
function dataFrontDataBranchAndDepartment(data) {
  let frontDataList = [];
  var result = '';
  var result_split = [];
  var number = '0';
  for (let item in data) {
    if (data[item].是否落地 == '是' && data[item].培训级别 == '全院级') {
      result = data[item].落地组织机构;
      result_split = result.split(',');
      for (var i = 0; i < result_split.length; i++) {
        number++;
        let newData = {
          //序号
          indexID: data[item].序号,
          //培训级别
          train_level: data[item].培训级别,
          //课程级别
          class_level: data[item].课程级别,
          //课程名称及方向
          class_name: data[item].课程名称及方向,
          //培训对象
          train_group: data[item].培训对象,
          //计划培训人数
          train_person: data[item].计划培训人数,
          //计划培训时长
          train_hour: data[item].计划培训时长 + data[item].计划培训时长单位,
          //培训类型
          train_kind: data[item].培训类型,
          //赋分规则
          assign_score: data[item].赋分规则,
          //计划培训时间
          train_time: data[item].计划培训时间,
          //责任部门
          center_dept: data[item].责任部门.split('-')[1],
          //培训师资
          train_teacher: data[item].培训师资,
          //费用预算
          train_fee: data[item].费用预算,
          //学分值
          class_grade: data[item].学分值,
          //是否落地
          plan_land: data[item].是否落地,
          //落地组织结构
          plan_branch: result_split[i],
          //备注
          remark: data[item].备注,
          number1: number,
        };
        frontDataList.push(newData);
      }
    }
    else if (data[item].是否落地 == '是' && data[item].培训级别 != '全院级') {
      message.error("分院级、部门级课程，无法落地到分院");
    }
    else if (data[item].是否落地 == '否' && data[item].落地组织机构 != null) {
      message.error("非落地课程，无法落地到分院");
    }
    else {
      number++;
      let newData = {
        //序号
        indexID: data[item].序号,
        //培训级别
        train_level: data[item].培训级别,
        //课程级别
        class_level: data[item].课程级别,
        //课程名称及方向
        class_name: data[item].课程名称及方向,
        //培训对象
        train_group: data[item].培训对象,
        //计划培训人数
        train_person: data[item].计划培训人数,
        //计划培训时长
        train_hour: data[item].计划培训时长 + data[item].计划培训时长单位,
        //培训类型
        train_kind: data[item].培训类型,
        //赋分规则
        assign_score: data[item].赋分规则,
        //计划培训时间
        train_time: data[item].计划培训时间,
        //责任部门
        center_dept: data[item].责任部门.split('-')[1],
        //培训师资
        train_teacher: data[item].培训师资,
        //费用预算
        train_fee: data[item].费用预算,
        //学分值
        class_grade: data[item].学分值,
        //是否落地
        plan_land: data[item].是否落地,
        //落地组织结构
        plan_branch: data[item].落地组织机构,
        //备注
        remark: data[item].备注,
        number1: number,
      };
      frontDataList.push(newData);
    }
  }
  return frontDataList;
}
function dataFrontDataCreateCertification(data) {
  let frontDataList = [];
  for (let item in data) {
    let newData = {
      //序号
      indexID: data[item].序号,
      //部门名称
      dept_name: data[item].部门名称.split('-')[1],
      //认证名称
      exam_name: data[item].认证名称,
      //考试人员
      exam_person_name: data[item].考试人员,
      //报销标准
      claim_fee: data[item].报销标准,
      //计划考试时间
      exam_time: data[item].计划考试时间,
      //考试费预算
      exam_fee: data[item].考试费预算,
      //学分
      exam_grade: data[item].学分,
    };
    frontDataList.push(newData);
  }
  return frontDataList;
}
function personDataBranchAndDepartmentImport(data) {
  let frontDataList = [];
  for (let item in data) {
    let newData = {
      //序号
      indexID: data[item].序号,
      //课程对应人员ID
      user_id: data[item].HR编号,
      //课程对应人员姓名
      user_name: data[item].姓名,
    };
    frontDataList.push(newData);
  }
  return frontDataList;
}
export default {
  namespace: 'train_create_model',
  state: {
    user_id: '',
    nextPostName: '',
    nextDataList: [],
    //培训课程信息（总院必修）
    centerClassCompulsoryDataList: [],
    //批量导入全院（必修）课程信息
    importCenterClassCompulsoryDataList: [],
    //批量导入全院（选修）课程信息
    importCenterClassElectiveDataList: [],
    //批量导入分院/部门课程信息
    importBranchAndDepartmentClassDataList: [],
    //批量导入认证考试计划课程信息
    importCreateCertificationDataList: [],
    //批量导入课程对应人员信息
    importPersonOfClassDataList: [],
    //批量导入课程对应人员信息-课程信息
    BranchAndDepartmentClassDataList: [],
    //插入人员返回信息
    returnNews: '',
    //附件信息
    fileDataList: [],
    pf_url: '',
    file_relativepath: '',
    file_name: '',
    //全院课程信息（必修，选修）
    classDataList: [],
    //落地部门查询
    courtDeptDataList: [],
    //新增培训计划
    trainClassPlanType: [],
    //下一环节
    nextPersonList: [],
    //查询部门
    centerDept: [],
    //岗位信息
    postDataList: [],
    //培训对象名称
    groupData: []
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *initTrain({ param }, { put, call }) {
      yield put({
        type: 'save',
        payload: {
          importCenterClassCompulsoryDataList: [],
          importCenterClassElectiveDataList: [],
          importBranchAndDepartmentClassDataList: [],
          importCreateCertificationDataList: []
        }
      });
    },
    *centerClassCompulsoryImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importCenterClassCompulsoryDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          importCenterClassCompulsoryDataList: dataFrontDataCompulsory(param),
          haveData: true
        }
      });
    },
    *centerClassElectiveImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importCenterClassElectiveDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          importCenterClassElectiveDataList: dataFrontDataElective(param),
          haveData: true
        }
      });
    },
    *BranchAndDepartmentImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importBranchAndDepartmentClassDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          importBranchAndDepartmentClassDataList: dataFrontDataBranchAndDepartment(param),
          haveData: true
        }
      });
    },
    *CreateCertificationImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importCreateCertificationDataList: []
        }
      });
      yield put({
        type: 'save',
        payload: {
          importCreateCertificationDataList: dataFrontDataCreateCertification(param),
          haveData: true
        }
      });
    },
    *personDataOfClassImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importPersonOfClassDataList: []
        }
      });
      yield put({
        type: 'save',
        payload: {
          importPersonOfClassDataList: personDataBranchAndDepartmentImport(param),
          haveData: true
        }
      });
    },
    *centerClassCompulsorynAdd({ transferPersonList, importPersonDataList }, { put }) {
      console.log('KKKKKKKKKK')
      console.log(transferPersonList)
      console.log('KKKKKKKKKK')

      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        i = i + 1;
        let personData = {
          number1: i,
          train_level: item.train_level,
          class_name: item.class_name,
          train_person: item.train_person,
          train_hour: item.train_hour,
          train_kind: item.train_kind,
          assign_score: item.assign_score,
          train_time: item.train_time,
          train_teacher: item.train_teacher,
          center_dept: item.center_dept,
          train_fee: item.train_fee,
          class_grade: item.class_grade,
          plan_land: item.plan_land,
          plan_branch: item.plan_branch,
          remark: item.remark
        };
        personListTmp.push(personData);
      })
      transferPersonList.map((item) => {
        i = i + 1;
        let personData1 = {
          number1: i,
          train_level: item.train_level,
          class_name: item.class_name,
          train_person: item.train_person,
          train_hour: item.train_hour + item.train_hour_unit,
          train_kind: item.train_kind,
          assign_score: item.assign_score,
          train_time: item.train_time,
          train_teacher: item.train_teacher,
          center_dept: item.center_dept,
          train_fee: item.train_fee,
          class_grade: item.class_grade,
          plan_land: item.plan_land,
          plan_branch: item.plan_branch,
          remark: item.remark
        };
        personListTmp.push(personData1);
      })
      yield put({
        type: 'save',
        payload: {
          importCenterClassCompulsoryDataList: personListTmp
        }
      });
    },
    *centerClassElectiveAdd({ transferPersonList, importPersonDataList }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        i = i + 1;
        let personData = {
          number1: i,
          train_level: item.train_level,
          class_level: item.class_level,
          class_name: item.class_name,
          train_person: item.train_person,
          train_hour: item.train_hour,
          train_kind: item.train_kind,
          assign_score: item.assign_score,
          train_teacher: item.train_teacher,
          center_dept: item.center_dept,
          train_fee: item.train_fee,
          class_grade: item.class_grade,
          plan_land: item.plan_land,
          plan_branch: item.plan_branch,
          remark: item.remark
        };
        personListTmp.push(personData);
      })
      transferPersonList.map((item) => {
        i = i + 1;
        let personData1 = {
          number1: i,
          train_level: item.train_level,
          class_level: item.class_level,
          class_name: item.class_name,
          train_person: item.train_person,
          train_hour: item.train_hour + item.train_hour_unit,
          train_kind: item.train_kind,
          assign_score: item.assign_score,
          train_teacher: item.train_teacher,
          center_dept: item.center_dept,
          train_fee: item.train_fee,
          class_grade: item.class_grade,
          plan_land: item.plan_land,
          plan_branch: item.plan_branch,
          remark: item.remark
        };
        personListTmp.push(personData1);
      })
      yield put({
        type: 'save',
        payload: {
          importCenterClassElectiveDataList: personListTmp
        }
      });
    },
    *BranchAndDepartmentAdd({ transferPersonList, importPersonDataList }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        i = i + 1;
        let personData = {
          number1: i,
          train_level: item.train_level,
          class_level: item.class_level,
          class_name: item.class_name,
          train_group: item.train_group,
          train_person: item.train_person,
          train_hour: item.train_hour,
          train_kind: item.train_kind,
          assign_score: item.assign_score,
          train_time: item.train_time,
          center_dept: item.center_dept,
          train_teacher: item.train_teacher,
          train_fee: item.train_fee,
          class_grade: item.class_grade,
          plan_land: item.plan_land,
          plan_branch: item.plan_branch,
          remark: item.remark
        };
        personListTmp.push(personData);
      })
      transferPersonList.map((item) => {
        i = i + 1;
        let personData1 = {
          number1: i,
          train_level: item.train_level,
          class_level: item.class_level,
          class_name: item.class_name,
          train_group: item.train_group,
          train_person: item.train_person,
          train_hour: item.train_hour + item.train_hour_unit,
          train_kind: item.train_kind,
          assign_score: item.assign_score,
          train_time: item.train_time,
          center_dept: item.center_dept,
          train_teacher: item.train_teacher,
          train_fee: item.train_fee,
          class_grade: item.class_grade,
          plan_land: item.plan_land,
          plan_branch: item.plan_branch,
          remark: item.remark
        };
        personListTmp.push(personData1);
      })
      yield put({
        type: 'save',
        payload: {
          importBranchAndDepartmentClassDataList: personListTmp
        }
      });
    },
    *CreateCertificationAdd({ transferPersonList, importPersonDataList }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        i = i + 1;
        let personData = {
          indexID: i,
          dept_name: item.dept_name,
          exam_name: item.exam_name,
          exam_person_name: item.exam_person_name,
          claim_fee: item.claim_fee,
          exam_time: item.exam_time,
          exam_fee: item.exam_fee,
          exam_grade: item.exam_grade
        };
        personListTmp.push(personData);
      })
      transferPersonList.map((item) => {
        i = i + 1;
        let personData1 = {
          indexID: i,
          dept_name: item.dept_name,
          exam_name: item.exam_name,
          exam_person_name: item.exam_person_name,
          claim_fee: item.claim_fee,
          exam_time: item.exam_time,
          exam_fee: item.exam_fee,
          exam_grade: item.exam_grade
        };
        personListTmp.push(personData1);
      })
      yield put({
        type: 'save',
        payload: {
          importCreateCertificationDataList: personListTmp
        }
      });
    },
    * deleteCompulsory({ importPersonDataList, record }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        if (item.number1 != record.number1) {
          i = i + 1;
          let personData = {
            number1: i,
            train_level: item.train_level,
            class_name: item.class_name,
            train_person: item.train_person,
            train_hour: item.train_hour,
            train_kind: item.train_kind,
            assign_score: item.assign_score,
            train_time: item.train_time,
            train_teacher: item.train_teacher,
            center_dept: item.center_dept,
            train_fee: item.train_fee,
            class_grade: item.class_grade,
            plan_land: item.plan_land,
            plan_branch: item.plan_branch,
            remark: item.remark
          };
          personListTmp.push(personData);
        }
      })
      yield put({
        type: 'save',
        payload: {
          importCenterClassCompulsoryDataList: personListTmp
        }
      });
    },
    * deleteElective({ importPersonDataList, record }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        if (item.number1 != record.number1) {
          i = i + 1;
          let personData = {
            number1: i,
            train_level: item.train_level,
            class_level: item.class_level,
            class_name: item.class_name,
            train_person: item.train_person,
            train_hour: item.train_hour,
            train_kind: item.train_kind,
            assign_score: item.assign_score,
            train_teacher: item.train_teacher,
            center_dept: item.center_dept,
            train_fee: item.train_fee,
            class_grade: item.class_grade,
            plan_land: item.plan_land,
            plan_branch: item.plan_branch,
            remark: item.remark
          };
          personListTmp.push(personData);
        }
      })
      yield put({
        type: 'save',
        payload: {
          importCenterClassElectiveDataList: personListTmp
        }
      });
    },
    * deleteBranch({ importPersonDataList, record }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        if (item.number1 != record.number1) {
          i = i + 1;
          let personData = {
            number1: i,
            train_level: item.train_level,
            class_level: item.class_level,
            class_name: item.class_name,
            train_group: item.train_group,
            train_person: item.train_person,
            train_hour: item.train_hour,
            train_kind: item.train_kind,
            assign_score: item.assign_score,
            train_time: item.train_time,
            center_dept: item.center_dept,
            train_teacher: item.train_teacher,
            train_fee: item.train_fee,
            class_grade: item.class_grade,
            plan_land: item.plan_land,
            plan_branch: item.plan_branch,
            remark: item.remark
          };
          personListTmp.push(personData);
        }
      })
      yield put({
        type: 'save',
        payload: {
          importBranchAndDepartmentClassDataList: personListTmp
        }
      });
    },
    * deleteCreateCertification({ importPersonDataList, record }, { put }) {
      let personListTmp = [];
      yield put({
        type: 'save',
        payload: {
          personDataList: []
        }
      });
      let i = 0;
      importPersonDataList.map((item) => {
        if (item.indexID != record.indexID) {
          i = i + 1;
          let personData = {
            indexID: i,
            dept_name: item.dept_name,
            exam_name: item.exam_name,
            exam_person_name: item.exam_person_name,
            claim_fee: item.claim_fee,
            exam_time: item.exam_time,
            exam_fee: item.exam_fee,
            exam_grade: item.exam_grade
          };
          personListTmp.push(personData);
        }
      })
      yield put({
        type: 'save',
        payload: {
          importCreateCertificationDataList: personListTmp
        }
      });
    },

    //保存全院级必修课程信息
    * centerClassCompulsorySubmit({ transferPlanList, trainPlanData, plan_id, resolve }, { call }) {
      //回滚参数
      let postData = {};
      postData["arg_plan_id"] = plan_id;
      try {
        //回滚标志
        let rollbackFlag = 0;
        /* 保存培训计划train_class_center表 Begin */
        for (let i = 0; i < transferPlanList.length; i++) {
          const saveClassInfo = yield call(trainService.trainCenterClassSaveCompulsory, transferPlanList[i]);
          if (saveClassInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_plan_id"] = plan_id;
            yield call(trainService.trainClassDeleteSave, postData);
            message.error('保存失败');
            rollbackFlag = 1;
            break;
          }
        }

        //基本信息表overtime_department_stats表补全
        trainPlanData["arg_proc_inst_id"] = '';
        trainPlanData["arg_plan_id"] = plan_id;

        /* 保存train_plan表 Begin */
        const saveTrainPlanBasicInfo = yield call(trainService.trainPlanSave, trainPlanData);
        if (saveTrainPlanBasicInfo.RetCode !== '1') {
          rollbackFlag = 1
        }
        /* 保存train_plan表 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(trainService.trainClassDeleteSave, postData);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
        /* 保存培训计划train_class_center表 End */
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(trainService.trainClassDeleteSave, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    //保存全院级选修课程信息
    * centerClassElectiveSubmit({ transferPlanList, trainPlanData, plan_id, resolve }, { call }) {
      //回滚参数
      let postData = {};
      postData["arg_plan_id"] = plan_id;
      try {
        //回滚标志
        let rollbackFlag = 0;
        /* 保存培训计划train_class_center表 Begin */
        for (let i = 0; i < transferPlanList.length; i++) {
          const saveClassInfo = yield call(trainService.trainCenterClassSaveElective, transferPlanList[i]);
          if (saveClassInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_plan_id"] = plan_id;
            yield call(trainService.trainClassDeleteSave, postData);
            message.error('保存失败');
            rollbackFlag = 1;
            break;
          }
        }

        //基本信息表overtime_department_stats表补全
        trainPlanData["arg_proc_inst_id"] = '';
        trainPlanData["arg_plan_id"] = plan_id;

        /* 保存train_plan表 Begin */
        const saveTrainPlanBasicInfo = yield call(trainService.trainPlanSave, trainPlanData);
        if (saveTrainPlanBasicInfo.RetCode !== '1') {
          rollbackFlag = 1
        }
        /* 保存train_plan表 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(trainService.trainClassDeleteSave, postData);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
        /* 保存培训计划train_class_center表 End */
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(trainService.trainClassDeleteSave, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    //保存全院级选修课程信息
    * deptAllSubmit({ transferPlanList, trainPlanData, plan_id, resolve }, { call }) {
      //回滚参数
      let postData = {};
      postData["arg_plan_id"] = plan_id;
      try {
        //回滚标志
        let rollbackFlag = 0;
        /* 保存培训计划train_class_center表 Begin */
        for (let i = 0; i < transferPlanList.length; i++) {
          const saveClassInfo = yield call(trainService.trainBranchAndDeptClassSave, transferPlanList[i]);
          if (saveClassInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_plan_id"] = plan_id;
            yield call(trainService.trainClassDeleteSave, postData);
            message.error('保存失败');
            rollbackFlag = 1;
            break;
          }
        }

        //基本信息表overtime_department_stats表补全
        trainPlanData["arg_proc_inst_id"] = '';
        trainPlanData["arg_plan_id"] = plan_id;

        /* 保存train_plan表 Begin */
        const saveTrainPlanBasicInfo = yield call(trainService.trainPlanSave, trainPlanData);
        if (saveTrainPlanBasicInfo.RetCode !== '1') {
          rollbackFlag = 1
        }
        /* 保存train_plan表 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(trainService.trainClassDeleteSave, postData);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
        /* 保存培训计划train_class_center表 End */
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(trainService.trainClassDeleteSave, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    //保存全院级选修课程信息
    * examSubmit({ transferPlanList, trainPlanData, plan_id, resolve }, { call }) {
      //回滚参数
      let postData = {};
      postData["arg_plan_id"] = plan_id;
      try {
        //回滚标志
        let rollbackFlag = 0;
        /* 保存培训计划train_class_center表 Begin */
        for (let i = 0; i < transferPlanList.length; i++) {
          const saveClassInfo = yield call(trainService.trainCertificationClassSave, transferPlanList[i]);
          if (saveClassInfo.RetCode !== '1') {
            /* 回滚功能 */
            let postData = {};
            postData["arg_plan_id"] = plan_id;
            yield call(trainService.trainClassDeleteSave, postData);
            message.error('保存失败');
            rollbackFlag = 1;
            break;
          }
        }

        //基本信息表overtime_department_stats表补全
        trainPlanData["arg_proc_inst_id"] = '';
        trainPlanData["arg_plan_id"] = plan_id;

        /* 保存train_plan表 Begin */
        const saveTrainPlanBasicInfo = yield call(trainService.trainPlanSave, trainPlanData);
        if (saveTrainPlanBasicInfo.RetCode !== '1') {
          rollbackFlag = 1
        }
        /* 保存train_plan表 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(trainService.trainClassDeleteSave, postData);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
        /* 保存培训计划train_class_center表 End */
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
          yield call(trainService.trainClassDeleteSave, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },

    //全院级课程查询（必修，选修，通用）
    *centerClassQuery({ param, resolve }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          classDataList: [],
        }
      });
      let queryParam = {
        arg_ou_id: Cookie.get('OUID'),
        arg_year: param.year,
        arg_class_type: param.class_type,
      };
      const centerClassData = yield call(trainService.centerClassQuery, queryParam);
      if (centerClassData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            classDataList: centerClassData.DataRows,
          }
        });
        resolve("success");
      } else {
        message.error('没有全院必修课程计划');
        resolve("false");
      }
    },
    //落地部门查询（必修，选修，通用）
    *courtDeptQuery({ param }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          courtDeptDataList: [],
        }
      });
      let queryParam = {
        arg_ou_id: Cookie.get('OUID'),
      };
      const courtDeptData = yield call(trainService.courtDeptQuery, queryParam);
      if (courtDeptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            courtDeptDataList: courtDeptData.DataRows,
          }
        });
      } else {
        message.error('没有落地部门');
      }
    },

    *centerClassResolution({ tempCourtDate, trainFeeDate, class_type, resolve }, { call }) {
      let rollback_param = {};
      let rollbackFlag = '0';
      try {
        /* 保存落地培训计划，全院级（必修，选修）、通用课程 Begin */
        for (let i = 0; i < tempCourtDate.length; i++) {
          let updateParam = {
            arg_train_class_id: tempCourtDate[i].train_class_id,
            arg_ou_id: Cookie.get('OUID'),
            arg_court_dept: tempCourtDate[i].court_dept,
            arg_class_type: class_type,
            arg_rollback_flag: '0',
          };
          const saveClassInfo = yield call(trainService.trainClassResolutionSave, updateParam);
          if (saveClassInfo.RetCode !== '1') {
            message.error('保存失败');
            rollback_param["train_class_id"] = tempCourtDate[i].train_class_id;
            rollback_param["court_dept"] = tempCourtDate[i].court_dept;
            resolve("false");
            rollbackFlag = '1';
            break;
          }
        }
        /* 保存落地预算费用，全院级（必修，选修）、通用课程 Begin */
        for (let i = 0; i < trainFeeDate.length; i++) {
          let updateParam = {
            arg_train_class_id: trainFeeDate[i].train_class_id,
            arg_ou_id: Cookie.get('OUID'),
            arg_claim_train_fee: trainFeeDate[i].claim_train_fee,
            arg_class_type: class_type,
            arg_rollback_flag: '0',
          };
          const saveClassInfo = yield call(trainService.trainClassResolutionTrainFeeSave, updateParam);
          if (saveClassInfo.RetCode !== '1') {
            message.error('保存失败');
            rollback_param["train_class_id"] = trainFeeDate[i].train_class_id;
            resolve("false");
            rollbackFlag = '2';
            break;
          }
        }
        if (rollbackFlag === '1') {
          /* 回滚功能:数据库 */
          rollback_param["arg_rollback_flag"] = '1';
          rollback_param["arg_ou_id"] = Cookie.get('OUID');
          rollback_param["arg_class_type"] = class_type;
          yield call(trainService.trainClassResolutionSave, rollback_param);
          message.error('保存失败');
          resolve("false");
        } else if (rollbackFlag === '2') {
          /* 回滚功能:数据库 */
          rollback_param["arg_rollback_flag"] = '1';
          rollback_param["arg_ou_id"] = Cookie.get('OUID');
          rollback_param["arg_class_type"] = class_type;
          yield call(trainService.trainClassResolutionTrainFeeSave, rollback_param);
          message.error('保存失败');
          resolve("false");
        } else {
          message.success('保存成功');
          resolve("success");
        }
        /* 保存落地培训计划，全院级（必修，选修）、通用课程 Begin */
      } catch (error) {
        rollback_param["arg_ou_id"] = Cookie.get('OUID');
        rollback_param["arg_class_type"] = class_type;
        rollback_param["arg_rollback_flag"] = '1';
        yield call(trainService.trainClassResolutionTrainFeeSave, rollback_param);
        message.error('保存失败');
        resolve("false");
      }
    },

    //删除附件
    *deleteFile({ RelativePath }, { call, put }) {
      let projectQueryparams = {
        RelativePath: RelativePath,
      };
      let deletefalg = yield call(overtimeService.deleteFile, projectQueryparams);
      if (deletefalg.RetCode === '1') {
        console.log("调用服务删除成功");
        yield put({
          type: 'save',
          payload: {
            pf_url: '',
            file_relative_path: '',
            file_name: '',
          }
        })
      } else {
        console.log("调用服务删除失败");
      }
    },
    //保存文件
    * changeNewFile({ oldfile, newfile }, { call, put }) {
      console.log("changeNewFile");
      console.log("oldfile===" + JSON.stringify(oldfile));
      console.log("newfile===" + JSON.stringify(newfile));
      if (oldfile.name === "" || oldfile.name === null) {
        console.log("首次新增文件");
        yield put({
          type: 'save',
          payload: {
            pf_url: newfile[0].response.file.AbsolutePath,
            file_relativepath: newfile[0].response.file.RelativePath,
            file_name: newfile[0].name,
          }
        })
      } else {
        console.log("修改文件");
        if (oldfile.uid === 1) {
          console.log("保存的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.url,
          };
          yield call(overtimeService.deleteFile, projectQueryparams);
          //保存新文件
          yield put({
            type: 'save',
            payload: {
              pf_url: newfile[0].response.file.AbsolutePath,
              file_relativepath: newfile[0].response.file.RelativePath,
              file_name: newfile[0].name,
            }
          })
        } else {
          console.log("新建的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.response.file.RelativePath,
          };
          yield call(overtimeService.deleteFile, projectQueryparams);
          //保存新文件
          yield put({
            type: 'save',
            payload: {
              pf_url: newfile[0].response.file.AbsolutePath,
              file_relativepath: newfile[0].response.file.RelativePath,
              file_name: newfile[0].name,
            }
          })
        }
      }
    },

    //新增培训课程计划
    *trainClassPlanAdd({ query }, { call, put }) {

      //查询项目组
      let deptInfoParam = {
        arg_user_id: Cookie.get('userid'),
        arg_ou_id: Cookie.get('OUID'),
      };
      let deptData = yield call(trainService.deptDataQuery, deptInfoParam);
      if (deptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            centerDept: deptData.DataRows
          }
        })
      } else {
        message.error("查询部门信息异常");
      }

      //查询岗位及部门信息
      let postInfoParam = {
        arg_train_post: 'train_post',
      };
      let postData = yield call(trainService.postDataQuery, postInfoParam);
      if (postData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            postDataList: postData.DataRows
          }
        })
      } else {
        message.error("查询岗位信息异常");
      }


      //查询下一环节处理人
      let personInfo = {
        arg_user_id: Cookie.get('userid'),
        arg_dept_id: Cookie.get('dept_id'),
        arg_ou_id: Cookie.get('OUID'),
      };
      let nextPersonData = yield call(trainService.submitPersonListQuery, personInfo);
      if (nextPersonData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextPersonData.DataRows
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }

      yield put({
        type: 'save',
        payload: {
          trainClassPlanType: '',
        }
      });
      yield put({
        type: 'save',
        payload: {
          trainClassPlanType: query.trainPlanType,
        }
      });
    },

    *centerClassAdd({ transferPlanList, trainPlanData, trainClassType, resolve }, { call }) {
      //查询是否为人力资源专员或者一级接口人
      let staffFlag = false;
      let userParam = {
        arg_user_id: Cookie.get('userid'),
      };
      let postList = yield call(trainService.trainUserRoleQuery, userParam);
      if (postList.DataRows.length > 0) {
        staffFlag = true;
      }
      //启动工作流
      let param = {
        beginbusinessId: 'train_plan_update',
      };
      let listenersrc = '{addtrainnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
      param["listener"] = listenersrc;
      param["form"] = '{if_dept_one:' + staffFlag + '}';
      const trainPlanFlowStartResult = yield call(trainService.trainPlanFlowStart, param);
      let trainClassApprovalFlowStartList = [];
      if (trainPlanFlowStartResult.RetCode === '1') {
        trainClassApprovalFlowStartList = trainPlanFlowStartResult.DataRows;
      } else {
        message.error('Service trainPlanFlowStart ' + trainPlanFlowStartResult.RetVal);
        resolve("false");
        return;
      }

      let proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
      let task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
      let task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

      param.completetaskId = task_id;

      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);
      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainPlanFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }
      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;
      let plan_id = Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);

      let trainPlanPostData = {
        arg_plan_id: plan_id,
        arg_proc_inst_id: proc_inst_id,
        arg_task_id: task_id,
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,
        arg_create_person_id: trainPlanData.arg_create_person_id,
        arg_create_person_name: trainPlanData.arg_create_person_name,
        arg_budget_value: trainPlanData.arg_if_budget,
        arg_next_step_person: trainPlanData.arg_nextStepPerson,
        arg_train_type: trainPlanData.arg_train_type,
      };

      //回滚plan参数:arg_proc_inst_id
      let planDeleteData = {};
      planDeleteData['arg_proc_inst_id'] = proc_inst_id;
      try {
        //返回的plan_id
        let returnPlanId = '';
        /* 保存train_plan表 Begin */
        const saveTrainPlanBasicInfo = yield call(trainService.trainClassPlanAdd, trainPlanPostData);
        if (saveTrainPlanBasicInfo.RetCode === '1') {
          returnPlanId = saveTrainPlanBasicInfo.RetVal;
          //循环插入要新增数据
          //回滚参数
          let postData = {};
          postData["arg_plan_id"] = returnPlanId;
          try {
            //回滚标志
            let rollbackFlag = 0;
            /* 保存培训计划train_class_center表 Begin */
            if (trainClassType === 'general_compulsory_train_plan') {
              for (let i = 0; i < transferPlanList.length; i++) {
                transferPlanList[i].arg_plan_id = returnPlanId;
                const saveClassInfo = yield call(trainService.trainCenterClassSaveCompulsory, transferPlanList[i]);
                if (saveClassInfo.RetCode !== '1') {
                  rollbackFlag = 1;
                  break;
                }
              }
            }
            if (trainClassType === 'general_elective_train_plan') {
              for (let i = 0; i < transferPlanList.length; i++) {
                transferPlanList[i].arg_plan_id = returnPlanId;
                const saveClassInfo = yield call(trainService.trainCenterClassSaveElective, transferPlanList[i]);
                if (saveClassInfo.RetCode !== '1') {
                  rollbackFlag = 1;
                  break;
                }
              }
            }
            if (trainClassType === 'branch_department_train') {
              for (let i = 0; i < transferPlanList.length; i++) {
                transferPlanList[i].arg_plan_id = returnPlanId;
                const saveClassInfo = yield call(trainService.trainBranchAndDeptClassSave, transferPlanList[i]);
                if (saveClassInfo.RetCode !== '1') {
                  message.error('保存失败');
                  rollbackFlag = 1;
                  break;
                }
              }
            }
            if (trainClassType === 'train_certification') {
              for (let i = 0; i < transferPlanList.length; i++) {
                transferPlanList[i].arg_plan_id = returnPlanId;
                const saveClassInfo = yield call(trainService.trainCertificationClassSave, transferPlanList[i]);
                if (saveClassInfo.RetCode !== '1') {
                  rollbackFlag = 1;
                  break;
                }
              }
            }
            if (rollbackFlag === 1) {
              /* 回滚功能:数据库 */
              yield call(trainService.trainClassDeleteSave, postData);
              message.error('新增失败');
              resolve("false");
            } else {
              message.success('新增成功');
              resolve("success");
            }
            /* 保存培训计划train_class_center表 End */
          } catch (error) {
            /* 回滚功能:数据库 */
            try {
              yield call(trainService.trainClassDeleteSave, postData);
            } catch (e1) {
              param = {
                terminateprocInstId: proc_inst_id
              };
              yield call(trainService.trainPlanFlowTerminate, param);
              message.error('回滚失败');
              resolve("false");
            }
          }
        } else {
          /!* 回滚功能:数据库 *!/
          yield call(trainService.trainPlanAddDelete, planDeleteData);
        }
      } catch (e) {
        /!* 回滚功能:数据库 *!/
        try {
          yield call(trainService.trainPlanAddDelete, planDeleteData);
          /!* 回滚功能:工作流 *!/
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainPlanFlowTerminate, param);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    //导入通用课程对应的人员名单，查询核心课程服务
    *queryCommonClass({ query }, { call, put }) {
      let userParam = {
        arg_ou_id: Cookie.get('OUID'),
      };
      let classData = yield call(trainService.trainCommonClassQuery, userParam);
      if (classData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            BranchAndDepartmentClassDataList: classData.DataRows,
          }
        });
      }
      let groupDataInfo = yield call(trainService.trainGroupNameQuery, userParam);
      if (groupDataInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            groupData: groupDataInfo.DataRows,
          }
        });
      }
    },
    *importClassPerson({ transferPersonList, is_imported_flag, resolve }, { call, put }) {
      /* 保存培训计划train_import_person_info表 Begin */
      let insertFlag = '0';

      for (let i = 0; i < transferPersonList.length; i++) {
        if (is_imported_flag === '1') {
          transferPersonList[0].arg_state = '1';
        }
        const classPersonInfo = yield call(trainService.importCommonClassPerson, transferPersonList[i]);
        if (classPersonInfo.RetCode !== '1') {
          insertFlag = '1';
          break;
        }
      }
      if (insertFlag === '1') {
        message.error('导入人员名单失败');
        resolve("false");
      } else {
        message.success('导入人员名单成功');
        resolve("success");
      }
    },

    *updateGroupInfo({ groupParam, resolve }, { call, put }) {
      let setParam = groupParam;
      let insertFlag = '0';

      const classGroupInfo = yield call(trainService.updateGroupInfo, setParam);
      if (classGroupInfo.RetCode !== '1' || classGroupInfo.RetVal === '查询参数异常,未正确传参') {
        insertFlag = '1';
      }

      if (insertFlag === '1') {
        message.error('核心班培训对象设置失败,请查询设置对象，培训对象所属群体');
        resolve("false");
      } else {
        message.success('核心班培训对象设置成功');
        resolve("success");
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, param, query }) => {
        if (pathname === '/humanApp/train/trainPlanAndImport/create_general_compulsory') {
          dispatch({ type: 'initTrain', param });
        }
        if (pathname === '/humanApp/train/trainPlanList/DynAddClass') {
          dispatch({ type: 'initTrain', param });
        }
        if (pathname === '/humanApp/train/trainPlanAndImport/create_general_elective') {
          dispatch({ type: 'initTrain', param });
        }
        if (pathname === '/humanApp/train/trainPlanAndImport/create_branch_department') {
          dispatch({ type: 'initTrain', param });
        }
        if (pathname === '/humanApp/train/trainPlanAndImport/create_certification') {
          dispatch({ type: 'initTrain', param });
        }
        if (pathname === '/humanApp/train/trainPlanAndImport/claim_class') {
          dispatch({ type: 'courtDeptQuery', param });
        }
        if (pathname === '/humanApp/train/trainPlanList/DynAddClass') {
          dispatch({ type: 'trainClassPlanAdd', query });
        }
        if (pathname === '/humanApp/train/importClassPerson') {
          dispatch({ type: 'queryCommonClass', query });
        }
      });
    }
  },
};
