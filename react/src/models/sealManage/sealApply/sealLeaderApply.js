/**
 * 作者：贾茹
 * 日期：2019-9-4
 * 邮箱：m18311475903@163.com
 * 文件说明：院领导名章试用申请
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from "../../../services/sealManage/sealApply";

export default {
  namespace: 'sealLeaderApply',
  state: {
    deptModal:false, //申请单位弹出框显示
    deptName:"",//页面展示的部门名字
    dept:{},  //申请部门的信息
    useReason:'', //用印事由
    isSecret:3,//用印材料是否涉密
    isReasonDisplay:'none',//涉密原因是否显示
    isFileDisplay:'block',//用印文件是否显示
    tableUploadFile:[],//上传文件保存数组
    secretReason:'', //涉密原因
    resetFileModal:false, //上传材料后修改是否涉密选项
    resetReasonModal:false, //填写涉密原因后修改涉密选项
    sealList:[],
    sealType:'',
    sealID:'1',   //点击一次保存之后返回的值
    number:"",  //盖章份数
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {call, put}) {
      yield put({
        type:'save',
        payload:{
          deptModal:false, //申请单位弹出框显示
          deptName:Cookie.get('deptname'),//页面展示的部门名字
          dept:{value:Cookie.get('dept_id'),deptName:Cookie.get('deptname')},  //申请部门的信息
          useReason:'', //用印事由
          isSecret:3,//用印材料是否涉密
          isReasonDisplay:'none',//涉密原因是否显示
          isFileDisplay:'block',//用印文件是否显示
          tableUploadFile:[],//上传文件保存数组
          secretReason:'', //涉密原因
          resetFileModal:false, //上传材料后修改是否涉密选项
          resetReasonModal:false, //填写涉密原因后修改涉密选项
          sealList:[],
          sealType:'',
          sealID:'1',   //点击一次保存之后返回的值
        }
      })
        yield put({
          type:'sealListSearch'
        })

    },

    //印章类型下拉框查询
    * sealListSearch({},{call,put}){
      let recData={
        arg_seal_ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 印章ouid
        arg_seal_mark:'1',// | char(1) | 是 | 印章唯一标识符（印章：0，领导名章：1，营业执照：2，领导身份证复印件：3，刻章：4）
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

    //保存选中印章的类型id
    * getSealTypeId({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          sealType:record,
        }
      })
    },

    //申请单位弹出框打开
    * handleDeptModal({},{put}){
      yield put({
        type:'save',
        payload:{
          deptModal:true
        }
      })
    },

    //部门弹出框点击取消
    * handleDeptCancel ({},{put}){
      yield put({
        type:'save',
        payload:{
          deptModal:false
        }
      })
    },

    //申请单位选中
    * onDeptChecked({value},{put}){
    /*  console.log(value);*/
      yield put({
        type:'save',
        payload:{
          dept:value,
        }
        //deptName:value.deptName
      })
    },

    //申请单位点击确定按钮存入
    * handleDeptOk({},{select,put}){

      const { dept } = yield select(state => state.sealLeaderApply);
      /*console.log(dept);*/
      yield put({
        type:'save',
        payload:{
          deptName:dept.deptName,
          deptModal:false
        }
      });

    },

    //用印事由
    * useReason({record},{put}){
      /*console.log(record.target.value);*/
      yield put({
        type:'save',
        payload:{
          useReason:record.target.value
        }
      });
    },

    //获取涉密原因
    * getSecretReason({record},{put}){
      /*console.log(record.target.value);*/
      yield put({
        type:'save',
        payload:{
          secretReason:record.target.value
        }
      })
    },

    //用印材料是否涉密
    * isFileSecret({record},{select,put}){
      /*console.log(record.target.value);*/
      const {tableUploadFile,secretReason}=yield select (state=>state.sealLeaderApply);
      yield put({
        type: 'save',
        payload: {
          savemeetingRadioValue: record.target.value,  //暂存是否涉密
        }
      });
      //如果选择否 判断填写了涉密原因
      if(record.target.value===0){
        if(secretReason!==''){
          yield put({
            type:'save',
            payload:{
              resetReasonModal:true, //填写涉密原因后修改涉密选项
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              isSecret:record.target.value,
              isFileDisplay:'block', //不涉密用印文件显示
              isReasonDisplay:'none',//涉密原因是否显示
            }
          })
        }
      }else if(record.target.value===1){
        //如果选择是 判断是否上传了文件
        if(tableUploadFile.length!==0){
          yield put({
            type:'save',
            payload:{
              resetFileModal:true, //上传材料后修改是否涉密选项
              /*resetReasonModal:true, //填写涉密原因后修改涉密选项*/
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              isSecret:record.target.value,
              isFileDisplay:'none', //不涉密用印文件显示
              isReasonDisplay:'block',//涉密原因是否显示
            }
          })
        }

      }

    },

    //点击modal取消
    * seceretIsCancel({}, {put}) {
      yield put({
        type: 'save',
        payload: {
          resetFileModal:false,
          resetReasonModal:false,
        }
      })

    },

    //点击确定清空上传的文件和盖章份数
    * clearSecretFile({},{select,put}){
      const { savemeetingRadioValue }=yield select (state=>state.sealLeaderApply);
      yield put({
        type:'save',
        payload:{
          tableUploadFile:[],
          fileNumber:'',     //盖章份数
          resetFileModal:false,
          isSecret:savemeetingRadioValue,
          isFileDisplay:'none', //不涉密用印文件显示
          isReasonDisplay:'block',//涉密原因是否显示
        }
      })
    },

    //点击确定删除涉密原因
    * deleteSecretReason({},{select,put}){
      const { savemeetingRadioValue }=yield select (state=>state.sealLeaderApply);
      yield put({
        type:'save',
        payload:{
          secretReason:'', //涉密原因
          resetReasonModal:false,
          isSecret:savemeetingRadioValue,
          isFileDisplay:'block', //不涉密用印文件显示
          isReasonDisplay:'none',//涉密原因是否显示
        }
      })
    },

    //保存附件名称地址
    * saveUploadFile({value},{select,put}){
      /* console.log(value);*/
      const {tableUploadFile} = yield select(state => state.sealLeaderApply);
      tableUploadFile.push({upload_name:value.filename.RealFileName,AbsolutePath:value.filename.AbsolutePath,RelativePath:value.filename.RelativePath,key:value.filename.AbsolutePath,upload_number:''});
      for(let i =0;i<tableUploadFile.length;i++){
        tableUploadFile[i].key = i;
      }
      yield put({
        type:'save',
        payload:{
          //FileInfo:FileInfo,
          tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
        }
      })
    },

    //附件删除
    * deleteUpload({record},{select,put}){
      const { tableUploadFile } = yield select(state=>state.sealLeaderApply);
      let a = tableUploadFile.filter(item => item !== record);
      yield put({
        type:'save',
        payload:{
          tableUploadFile:JSON.parse(JSON.stringify(a))
        }
      })

    },

    //获取盖章份数
    * saveNum({e,index},{select,put}){
      //text = e.target.value;
      let { tableUploadFile } = yield select(state => state.sealLeaderApply);
      if(isNaN(e.target.value) === true ||e.target.value>99){
        message.info('请填写两位以内的数字')
      }else {
        tableUploadFile[index].upload_number = e.target.value;
        yield put({
          type: 'save',
          payload: {
            tableUploadFile,
          }
        })
      }
    },

    //点击保存
    * sealSave({},{select,call,put}){
      const { dept,useReason,sealID, sealType,  isSecret, secretReason,tableUploadFile} = yield select(state=>state.sealLeaderApply);
      let recData={
        arg_form_uuid:sealID,//    | varchar(32) | 是 | 申请单id
        arg_form_title:'院领导名章使用申请填报',// | varchar(100) | 是 | 申请单标题
        arg_seal_details_id:sealType,//| varchar(32) | 是 | 用印详情id
        arg_form_type:'0',// | varchar(2) | 是 | 申请单类型（0:使用1:外借2:刻章）
	      arg_form_reason :useReason,//| varchar(200) | 是 | 用印事由
        arg_form_if_secret: isSecret,//  | char(1) | 是 | 是否涉密（0:否1:是）
	      arg_form_secret_reason:secretReason, // | varchar(200) | 是 | 涉密原因
        arg_form_dept_id:dept.value,// | char(32) | 是 | 申请部门
        arg_upload_info:JSON.stringify(tableUploadFile) ,// |TEXT|否|附件信息|
        arg_create_user_id:Cookie.get('userid'),//  | CHAR(7) | 是 | 创建人id  |
        arg_create_user_name:Cookie.get('username') ,// | VARCHAR(10) | 是 | 创建人姓名  |

      };
      const response = yield call(sealApplyService.sealLeaderSave, recData);
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

    //判断文件中是否存在相同名字
    * sealSubmit({record},{select,call,put}){
      const {tableUploadFile} = yield select(state=>state.sealLeaderApply);
      if(tableUploadFile.length === 0){
        if(record === "提交"){
          yield put({
            type: 'submit',
          })
        }else if(record === "保存"){
          yield put({
            type: 'sealSave',
          })
        }
      }
      else{
        let names = [];
        for(let i = 0;i<tableUploadFile.length;i++){
          names.push(tableUploadFile[i].upload_name)
        }
        //console.log(names);
        let s = names.join(",")+",";
        let boolean = false;
        let m = 0;
        for(let j=0;j<names.length;j++) {
          if (s.replace(names[j] + ",", "").indexOf(names[j] + ",") > -1) {
            message.info("存在相同的文件" + names[j] + ',请重新上传');
            m++;
            break
          }else{
            if(m = names.length){
              boolean = true;
            }
          }
        }
        if(boolean === true){
          if(record === "提交"){
            yield put({
              type: 'submit',
            })
          }else if(record === "保存"){
            yield put({
              type: 'sealSave',
            })
          }

        }
      }

    },

    //点击提交
    * submit({},{select,call,put}){
      const { useReason, dept,sealID, sealType,  isSecret, secretReason,tableUploadFile,} = yield select(state=>state.sealLeaderApply);
     //判断盖章份数不能为空，若为空提示
      let numbers = [];
      for(let i = 0;i<tableUploadFile.length;i++){
        if(tableUploadFile[i].upload_number!==""){
          numbers.push(tableUploadFile[i].upload_number);
        }

      }
      //console.log(numbers);
      const length = numbers.length;
      if( dept==={} || useReason === "" || sealType === "" || isSecret === 3 ){
        message.info('有必填项没填')
      }else if(isSecret === 1 && secretReason === ""){
        message.info('有必填项没填')
      }else if(isSecret === 0 && tableUploadFile.length === 0){
        message.info('有必填项没填')
      }else if(tableUploadFile.length !== 0 && tableUploadFile.length !== length){
        message.info('有必填项没填')
      }
      else{
        let recData={
          arg_form_uuid:sealID,//    | varchar(32) | 是 | 申请单id
          arg_form_title:'院领导名章使用申请填报',// | varchar(100) | 是 | 申请单标题
          arg_seal_details_id:sealType,//| varchar(32) | 是 | 用印详情id
          arg_form_type:'0',// | varchar(2) | 是 | 申请单类型（0:使用1:外借2:刻章）
          arg_form_reason :useReason,//| varchar(200) | 是 | 用印事由
          arg_form_if_secret: isSecret,//  | char(1) | 是 | 是否涉密（0:否1:是）
          arg_form_secret_reason:secretReason, // | varchar(200) | 是 | 涉密原因
          arg_form_dept_id:dept.value,// | char(32) | 是 | 申请部门
          arg_upload_info:JSON.stringify(tableUploadFile) ,// |TEXT|否|附件信息|
          arg_create_user_id:Cookie.get('userid'),//  | CHAR(7) | 是 | 创建人id  |
          arg_create_user_name:Cookie.get('username'),  //[{"upload_name":"111","upload_number":"22","RelativePath":"333","Absolut	ePath":"1244456"},	{"upload_name":"1112","upload_number":"22","RelativePath":"3334", "AbsolutePath":"12444567"}]|
          arg_form_check_state:"0",// | char（1）| 是 | 申请单状态
          arg_form_check_state_desc :"申请保存",//| varchar(100) | 是|申请单状态描述
        };
        const response = yield call(sealApplyService.sealLeaderSubmit, recData);
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
      const { sealID } = yield select(state=>state.sealLeaderApply);
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
        if (pathname === '/adminApp/sealManage/sealIndexApply/sealLeaderApply') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
