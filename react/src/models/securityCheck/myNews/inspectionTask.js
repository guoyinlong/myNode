

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from "../../../services/sealManage/sealApply";

export default {
  namespace: 'sealComApply',
  state: {
    deptModal:false, //申请单位弹出框显示
    deptName:"",//页面展示的部门名字
    dept:{value:Cookie.get('dept_id'),deptName:Cookie.get('deptname')},//申请部门的信息
    useReason:'', //用印事由
    isSecret:3,//用印材料是否涉密
    secretReason:'', //涉密原因
    isReasonDisplay:'none',//涉密原因是否显示
    isFileDisplay:'block',//用印文件是否显示
    tableUploadFile:[],//上传文件保存数组
    fileNumber:[],     //盖章份数
    isRelativeDept:3,//是否需要相关部门会签
    relativeDeptModal:false,//会签部门弹出框
    isRelativeDisplay:'',  //会签部门字段是否显示
    relativeDeptName:[],//相关会签部门名字
    relativeDeptID:[],
    rDept:[],              //相关会签部门显示
    submitObject:'', //文件提交方信息
    resetFileModal:false, //上传材料后修改是否涉密选项
    resetReasonModal:false, //填写涉密原因后修改涉密选项
    sealType:'', //选中印章类型
    sealList:[],  //查询印章列表
    sealSpacialList:[], //特殊事项列表
    sealSpacialType:{}, //选中特殊类型印章类型
    spacialName:"",   //特殊事项显示
    spacialSealDisplay:'none', //特殊事项列表显示否
    sealID:'1',//点击保存返回数据 默认为1
    number:"", //盖章份数
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {put}) {
        yield put({
          type:'save',
          payload:{
            deptModal:false, //申请单位弹出框显示
            deptName:Cookie.get('deptname'),//页面展示的部门名字
            dept:{value:Cookie.get('dept_id'),deptName:Cookie.get('deptname')},  //申请部门的信息
            useReason:'', //用印事由
            isSecret:3,//用印材料是否涉密
            secretReason:'', //涉密原因
            isReasonDisplay:'none',//涉密原因是否显示
            isFileDisplay:'block',//用印文件是否显示
            tableUploadFile:[],//上传文件保存数组
            fileNumber:[],     //盖章份数
            isRelativeDept:3,//是否需要相关部门会签
            relativeDeptModal:false,//会签部门弹出框
            isRelativeDisplay:'',  //会签部门字段是否显示
            relativeDeptName:[],//相关会签部门名字
            relativeDeptID:[],
            rDept:[],              //相关会签部门显示
            submitObject:'', //文件提交方信息
            resetFileModal:false, //上传材料后修改是否涉密选项
            resetReasonModal:false, //填写涉密原因后修改涉密选项
            sealType:'', //选中印章类型
            sealList:[],  //查询印章列表
            sealSpacialList:[], //特殊事项列表
            sealSpacialType:{seal_special_uuid:"",seal_special_matters:""}, //选中特殊类型印章类型
            spacialSealDisplay:'none', //特殊事项列表显示否
            sealID:'1',//点击保存返回数据 默认为1
            deptOuid:Cookie.get('OUID'),
          }
        })
        yield put({
          type:'sealListSearch'
        })
        yield put({
          type:'sealSpacialSearch'
        })
    },

    //印章类型下拉框查询
    * sealListSearch({},{select,call,put}){
      const { deptOuid } = yield select(state => state.sealComApply);
      //console.log(deptOuid)
      let recData={
        arg_seal_ouid:deptOuid,// | varchar(32) | 是 | 申请部门
        arg_seal_mark:'0',// | char(1) | 是 | 印章唯一标识符（印章：0，领导名章：1，营业执照：2，领导身份证复印件：3，刻章：4）
      }
      const response = yield call(sealApplyService.sealList, recData);
      if(response.RetCode === '1'){
        let res = response.DataRows;
        for(let i = 0 ;i < res.length; i ++ ){
          res[i].key = i;
        }
        yield put({
          type:'save',
          payload:{
            sealList:res
          }
        })
      }
    },


 


  

  

 

  

  

    //获取特殊事项
    * getSpacialID({record},{select,put}){
       //console.log(record,JSON.parse(record));
      const { relativeDeptID } = yield select(state => state.sealComApply);
      let message = '请选择会签部门'+       JSON.parse(record).seal_auditor_deptname;
      if(JSON.parse(record).seal_special_matters !== "其他") {
        if (relativeDeptID.indexOf(JSON.parse(record).seal_auditor_deptid) === -1) {
          message.info(message);
        }
        else {
          yield put({
            type: 'save',
            payload: {
              spacialName: JSON.parse(record).seal_special_matters,
              sealSpacialType: JSON.parse(record)
            }
          })
        }
      }else{
        yield put({
          type: 'save',
          payload: {
            spacialName: JSON.parse(record).seal_special_matters,
            sealSpacialType: JSON.parse(record)
          }
        })
      }
    },

    //点击保存
    * sealSave({},{select,call,put}){
      const { dept,useReason,sealID, sealType,  isSecret, secretReason, isRelativeDept, relativeDeptID, submitObject, tableUploadFile, sealSpacialType} = yield select(state=>state.sealComApply);
     // console.log(sealSpacialType);
      let recData={
        arg_form_title:'印章使用申请填报',//  varchar(32)  是  申请单标题
        arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
        arg_form_type:'0' ,//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
        arg_seal_details_id :sealType,//varchar(32) | 是 | 用印详情id
        arg_form_dept_id :dept.value,//     char(32)      是        申请部门id
        arg_form_reason :useReason,//      varchar(200)  是         | 是 | 用印事由
        arg_form_if_secret: isSecret,// char(1) | 是 | 是否涉密（0:否1:是）
	      arg_form_secret_reason:secretReason, //| varchar(200) | 是 | 涉密原因
        arg_form_if_approval:submitObject,// 是 |申请单范围（0:内部1:外部2:外部无需分管院审核）
        arg_form_if_sign :isRelativeDept,//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
        arg_sign_deptid :relativeDeptID.toString(),//    varchar(500)  否        会签部门id（刻章类必传）
        arg_create_user_id :Cookie.get('userid'),//   char(7)       是        用户id
        arg_create_user_name:Cookie.get('username'),//  varchar(10)   是        用户姓名
        arg_upload_info:JSON.stringify(tableUploadFile), //[{"upload_name":"111","upload_number":"22","RelativePath":"333","Absolut	ePath":"1244456"},	{"upload_name":"1112","upload_number":"22","RelativePath":"3334", "AbsolutePath":"12444567"}]|
        arg_seal_special_uuid:sealSpacialType.seal_special_uuid,// |varchar(32) | 否|特殊事项uuid|
        arg_seal_special_matters:sealSpacialType.seal_special_matters,// |varchar(32) | 否|特殊事项名称|

      };
      const response = yield call(sealApplyService.sealComSave, recData);
      if(response.RetCode === '1'){
        message.info('保存成功');
        yield put({
          type:'save',
          payload:{
            sealID:response.return_data
          }
        })
        /*yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/sealIndexApply'
        }))*/
      }
    },




    //点击提交
    * submit({},{select,call,put}){
      const { useReason, dept,sealID, sealType,  isSecret, secretReason, isRelativeDept, relativeDeptID, submitObject,tableUploadFile,sealSpacialType} = yield select(state=>state.sealComApply);
     console.log(isRelativeDept,typeof isRelativeDept,submitObject,typeof submitObject,sealSpacialType)
     if(isRelativeDept === 1 && submitObject ==="2" && sealSpacialType ==={seal_special_uuid:"",seal_special_matters:""}){
       message.info('有必填项没填');
       return
     }
      //判断文件有相同名字
      let numbers = [];
      for(let i = 0;i<tableUploadFile.length;i++){
        if(tableUploadFile[i].upload_number!==""){
          numbers.push(tableUploadFile[i].upload_number);
        }
      }
      const length = numbers.length;
      if( dept==={} || useReason === "" || sealType === "" || isSecret === 3 || isRelativeDept ===3 || submitObject==="" ){
        message.info('有必填项没填')
      }else if(isSecret === 1 && secretReason === ""){
        message.info('有必填项没填')
      }else if(isSecret === 0 && tableUploadFile.length === 0){
        message.info('有必填项没填')
      }else if(tableUploadFile.length !== 0 && tableUploadFile.length !== length){
        message.info('有必填项没填')
      }else if(isRelativeDept === 1 && relativeDeptID.length === 0){
        message.info('有必填项没填')
      }else if(isRelativeDept === 1 && submitObject ==="2" && sealSpacialType ==={seal_special_uuid:"",seal_special_matters:""}){
        message.info('有必填项没填')
      }

      else{
        let recData={
          arg_form_title:'印章使用申请填报',//  varchar(32)  是  申请单标题
          arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
          arg_form_type:'0' ,//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
          arg_seal_details_id :sealType,//varchar(32) | 是 | 用印详情id
          arg_form_dept_id :dept.value,//     char(32)      是        申请部门id
          arg_form_reason :useReason,//      varchar(200)  是         | 是 | 用印事由
          arg_form_if_secret: isSecret,// char(1) | 是 | 是否涉密（0:否1:是）
          arg_form_secret_reason:secretReason, //| varchar(200) | 是 | 涉密原因
          arg_form_if_approval:submitObject,// 是 |申请单范围（0:内部1:外部2:外部无需分管院审核）
          arg_form_if_sign :isRelativeDept,//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
          arg_sign_deptid :relativeDeptID.toString(),//    varchar(500)  否        会签部门id（刻章类必传）
          arg_create_user_id :Cookie.get('userid'),//   char(7)       是        用户id
          arg_create_user_name:Cookie.get('username'),//  varchar(10)   是        用户姓名
          arg_upload_info:JSON.stringify(tableUploadFile), //[{"upload_name":"111","upload_number":"22","RelativePath":"333","Absolut	ePath":"1244456"},	{"upload_name":"1112","upload_number":"22","RelativePath":"3334", "AbsolutePath":"12444567"}]|
          arg_seal_special_uuid:sealSpacialType.seal_special_uuid,// |varchar(32) | 否|特殊事项uuid|
          arg_seal_special_matters:sealSpacialType.seal_special_matters,// |varchar(32) | 否|特殊事项名称|
          arg_form_check_state:"0",// | char（1）| 是 | 申请单状态
          arg_form_check_state_desc :"申请保存",//| varchar(100) | 是|申请单状态描述
        };
        const response = yield call(sealApplyService.sealComSubmit, recData);
        if(response.RetCode === '1'){
          message.info('提交成功');
          yield put({
            type: 'save',
            payload: {
              sealID: response.return_data,
            }
          })
          yield put({
            type:'sendMessages'
          })
        }
      }

    },

    //发送钉钉消息
    * sendMessages({},{put,call,select}){
      const { sealID } = yield select(state=>state.sealComApply);
      let recData={
        arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
      };
      const response = yield call(sealApplyService.sendMessages, recData);
      if(response.RetCode === '1') {
        message.info('消息发送成功');
        yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/sealIndexApply'
        }))
      }
    },

    //点击取消
    * sealCancel({},{put}){
      yield put(routerRedux.push({
        pathname: '/adminApp/sealManage/sealIndexApply'
      }))
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/sealIndexApply/sealComApply') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
