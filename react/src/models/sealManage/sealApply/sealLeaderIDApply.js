/**
 * 作者：贾茹
 * 日期：2019-9-5
 * 邮箱：m18311475903@163.com
 * 文件说明：院领导名章试用申请
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from "../../../services/sealManage/sealApply";

export default {
  namespace: 'sealLeaderIDApply',
  state: {
    deptModal:false, //申请单位弹出框显示
    deptName:"",//页面展示的部门名字
    dept:{},  //申请部门的信息
    sealList:[], //领导名章列表
    sealType:'', //选中印章信息
    useReason:'', //用印事由
    targetDept:'',//所提交的对方单位
    use:'',     //用途
    tableUploadFile:[],//上传文件保存数组
    fileNumber:'',     //盖章份数
    fileDay:'',   //复印件的有效期
    sealID:'1',
    userDept:'',  //实际使用的部门或人
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
          sealList:[], //领导名章列表
          sealType:'', //选中印章信息
          useReason:'', //用印事由
          targetDept:'',//所提交的对方单位
          use:'',     //用途
          tableUploadFile:[],//上传文件保存数组
          fileNumber:'',     //盖章份数
          fileDay:'',   //复印件的有效期
          sealID:'1',
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
        arg_seal_mark:'3',// | char(1) | 是 | 印章唯一标识符（印章：0，领导名章：1，营业执照：2，领导身份证复印件：3，刻章：4）
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
      console.log(value);
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

      const { dept } = yield select(state => state.sealLeaderIDApply);
      /*console.log(dept);*/
      yield put({
        type:'save',
        payload:{
          deptName:dept.deptName,
          deptModal:false
        }
      });

    },

    //所提交的对方单位名称
    * targetDept({record},{put}){
      /* console.log(record.target.value)*/
      if(record.target.value.length>50){
        message.info('超过字数限制，请重新输入')
      }else{
        yield put({
          type:'save',
          payload:{
            targetDept:record.target.value,
            userDept:record.target.value,
          }
        })
      }

    },

    //复印件的用途及时间中的实际使用人的单位或名字
    * userDept({record},{put}){
      /* console.log(record.target.value)*/
      if(record.target.value.length>50){
        message.info('超过字数限制，请重新输入')
      }else{
        yield put({
          type:'save',
          payload:{
            userDept:record.target.value,
          }
        })
      }

    },

    //复印件的用途
    * use({record},{put}){
      /* console.log(record.target.value)*/
      if(record.target.value.length>200){
        message.info('超过字数限制，请重新输入')
      }else{
        yield put({
          type:'save',
          payload:{
            use:record.target.value,
          }
        })
      }

    },

    //复印件的份数
    * getFileNumber({record},{put}){
      /* console.log(record.target.value)*/
      if(isNaN(record.target.value) === true ||record.target.value>99){
        message.info('请填写十位数以内的数字')
      }else{
        yield put({
          type:'save',
          payload:{
            fileNumber:record.target.value,
          }
        })
      }

    },

    //复印件的有效期
    * getFileDay({record},{put}){
      /* console.log(record.target.value)*/
      if(isNaN(record.target.value) === true ||record.target.value>99){
        message.info('请填写十位数以内的数字')
      }else{
        yield put({
          type:'save',
          payload:{
            fileDay:record.target.value,
          }
        })
      }

    },

    //保存附件名称地址
    * saveUploadFile({value},{call,select,put}){
       console.log(value);
      const {tableUploadFile} = yield select(state => state.sealLeaderIDApply);
      tableUploadFile.push({upload_name:value.filename.RealFileName,AbsolutePath:value.filename.AbsolutePath,RelativePath:value.filename.RelativePath,key:value.filename.AbsolutePath,upload_number:'1'});
      /* console.log(tableUploadFile);*/
      /*FileInfo.push({arg_upload_name:value.filename.RealFileName,arg_upload_url:value.filename.RelativePath,arg_upload_real_url:value.filename.AbsolutePath});*/
      /*console.log("\""+JSON.stringify(FileInfo)+"\"");*/
      yield put({
        type:'save',
        payload:{
          //FileInfo:FileInfo,
          tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
        }
      })
    },

    //删除附件
    * deleteUpload({record},{select,put}){
      const {tableUploadFile} = yield select (state=>state.sealLeaderIDApply);
      let a =tableUploadFile.filter(i=>i!==record);
      yield put({
        type:'save',
        payload:{
          tableUploadFile:JSON.parse(JSON.stringify(a))
        }
      })
    },

    //点击保存
    * sealSave({},{select,call,put}){
      const { dept,use,sealID, userDept,sealType,fileNumber, fileDay,targetDept, tableUploadFile } = yield select(state=>state.sealLeaderIDApply);
      let recData={
        arg_form_uuid:sealID,//    | varchar(32) | 是 | 申请单id
        arg_form_title:'院领导身份证复印件使用申请填报',// | varchar(100) | 是 | 申请单标题
        arg_seal_details_id:sealType,//| varchar(32) | 是 | 用印详情id
        arg_form_type:'0',// | varchar(2) | 是 | 申请单类型（0:使用1:外借2:刻章）
        arg_form_reason :use,//| varchar(200) | 是 | 用印事由
        arg_form_if_secret: '',//  | char(1) | 是 | 是否涉密（0:否1:是）
        arg_form_secret_reason:'', // | varchar(200) | 是 | 涉密原因
        arg_form_dept_id:dept.value,// | char(32) | 是 | 申请部门
        arg_upload_info:JSON.stringify(tableUploadFile) ,// |TEXT|否|附件信息|
        arg_create_user_id:Cookie.get('userid'),//  | CHAR(7) | 是 | 创建人id  |
        arg_create_user_name:Cookie.get('username') ,// | VARCHAR(10) | 是 | 创建人姓名  |
        arg_form_actual_usename :userDept,//| varchar(32) | 是 | 实际使用部门/人
        arg_form_copy_quantity:fileNumber,// | int(11) | 是 | 营业执照份数
        arg_form_use_day :fileDay,//| VARCHAR(10) | 是 | 有效天数
        arg_form_out_company :targetDept,//| VARCHAR(45) | 是 | 所提交对方部门



      };
      const response = yield call(sealApplyService.businessLicenseSave, recData);
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

    //判断文件是否存在相同名字
    * sealSubmit({record},{select,call,put}){
      //console.log(record);
      const { tableUploadFile } = yield select(state=>state.sealLeaderIDApply);
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
      const { dept,use,sealID, userDept,sealType,fileNumber, fileDay,targetDept,tableUploadFile } = yield select(state=>state.sealLeaderIDApply);
      if(sealID ===""||sealType ===""||use ===""||dept ===""||userDept ===""||fileNumber ===""||fileDay ===""||targetDept ===""){
        message.info('有必填项没填')
      }else{
        let recData={
          arg_form_uuid:sealID,//    | varchar(32) | 是 | 申请单id
          arg_form_title:'院领导身份证复印件使用申请填报',// | varchar(100) | 是 | 申请单标题
          arg_seal_details_id:sealType,//| varchar(32) | 是 | 用印详情id
          arg_form_type:'0',// | varchar(2) | 是 | 申请单类型（0:使用1:外借2:刻章）
          arg_form_reason :use,//| varchar(200) | 是 | 用印事由
          arg_form_if_secret: '',//  | char(1) | 是 | 是否涉密（0:否1:是）
          arg_form_secret_reason:'', // | varchar(200) | 是 | 涉密原因
          arg_form_dept_id:dept.value,// | char(32) | 是 | 申请部门
          arg_upload_info:JSON.stringify(tableUploadFile) ,// |TEXT|否|附件信息|
          arg_create_user_id:Cookie.get('userid'),//  | CHAR(7) | 是 | 创建人id  |
          arg_create_user_name:Cookie.get('username') ,// | VARCHAR(10) | 是 | 创建人姓名  |
          arg_form_actual_usename :userDept,//| varchar(32) | 是 | 实际使用部门/人
          arg_form_copy_quantity:fileNumber,// | int(11) | 是 | 营业执照份数
          arg_form_use_day :fileDay,//| VARCHAR(10) | 是 | 有效天数
          arg_form_out_company :targetDept,//| VARCHAR(45) | 是 | 所提交对方部门
          arg_form_check_state:"0",// | char（1）| 是 | 申请单状态
          arg_form_check_state_desc :"申请保存",//| varchar(100) | 是|申请单状态描述
        };
        const response = yield call(sealApplyService.businessLicenseSubmit, recData);
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
      const { sealID } = yield select(state=>state.sealLeaderIDApply);
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
        if (pathname === '/adminApp/sealManage/sealIndexApply/sealLeaderIDApply') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
