/**
 * 作者：胡月
 * 创建日期：2017-12-18
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：待办中，审核人对交付物的审核等功能
 */
import * as projServices from '../../../../services/project/projService';
import { routerRedux } from 'dva/router';
import config from '../../../../utils/config';
import { message} from 'antd';
import Cookie from 'js-cookie';

export default {
  namespace: 'deliverableCheck',
  state: {
    modalVisible:false,      /*退回模态框是否可见*/
    roleTag:'',
    flag:'',
    taskUuid:'',
    projId:'',
    projUid:'',
    checkId:'',
    taskBatchid:'',
    taskWfBatchid:'',
    projName:'',
    mileSubmitById:'',
    mileSubmitByName:'',
    businessId:'',
    lastCheckId:'',
    returnReasonFlag:'',
    returnReason:'',
    preLinkName:'',
    linkName:'',
    titleDetail:{},
    milesList:[],
    defaultMilesKey:[],
    deliveryCategoryList:[],
    projChangeLog:[],
    userid:localStorage.getItem('userid'),
    username:localStorage.getItem('fullName'),
    currentMileUid:'',
    selectedMiles:[]

  },

  reducers: {
    initData(){
      return {
        modalVisible:false,
        roleTag:'',
        flag:'',
        taskUuid:'',
        projUid:'',
        projId:'',
        checkId:'',
        taskBatchid:'',
        taskWfBatchid:'',
        projName:'',
        mileSubmitById:'',
        mileSubmitByName:'',
        businessId:'',
        lastCheckId:'',
        returnReasonFlag:'',
        returnReason:'',
        preLinkName:'',
        linkName:'',
        titleDetail:{},
        milesList:[],
        defaultMilesKey:[],
        deliveryCategoryList:[],
        projChangeLog:[],
        userid:localStorage.getItem('userid'),
        username:localStorage.getItem('fullName'),
        currentMileUid:'',
        selectedMiles:[]
      }
    },
    backShowModal(state) {
      return {
        ...state,
        modalVisible : true
      };
    },
    backHideModal(state) {
      return {
        ...state,
        modalVisible : false
      };
    },
    save(state, action) {
      return {...state, ...action.payload};
    }


  },


  effects: {

    /**
     * 作者：胡月
     * 创建日期：2017-12-19
     * 功能：待办中，审核人查看交付物管理页面的标题、退回原因，上一环节
     */
      *deliverableCheckTitle({payload}, {call,put}) {
      yield put({
        type: 'save',
        payload: {
          projId:payload.arg_proj_id,
          roleTag: payload.arg_tag,        /*当前用户是什么角色，3是变更人角色，4审核人角色*/
          flag:payload.arg_handle_flag,    /*0待办/1已办/3办结*/
          taskUuid:payload.arg_task_uuid,
          projUid:payload.arg_proj_uid,
          checkId:payload.arg_check_id,
          taskBatchid:payload.arg_task_batchid,
          taskWfBatchid:payload.arg_task_wf_batchid,

        }
      });
      let postData = {
        arg_proj_id: payload.arg_proj_id,
        arg_check_id: payload.arg_check_id,
        arg_tag:payload.arg_tag,                  /*起草人还是审核人，后来加的*/
        arg_handle_flag:payload.arg_handle_flag, /*代办，已办，办结，审核日志的标志位*/
      };
      if('arg_check_detail_flag' in payload){
        postData.arg_check_detail_flag = payload.arg_check_detail_flag;
      }
      const data = yield call(projServices.deliverableCheckTitle,postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            projName: data.proj_name,
            mileSubmitById:data.mile_submit_byid,
            mileSubmitByName:data.mile_submit_byname,
            returnReason:data.DataRows[0].return_reason,
            preLinkName: data.DataRows[0].pre_link_name,
            linkName:data.DataRows[0].link_name,
            titleDetail: data.DataRows[0],
            businessId:data.business_id,
            lastCheckId:data.last_check_id,
            returnReasonFlag:data.DataRows[0].return_reason_flag,
          }
        });
        yield put({
          type: 'deliverableCheckAllFile',
          payload
        });
        yield put({
          type: 'deliverableCheckLogSearch',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },
    /**
     * 作者：胡月
     * 创建日期：2017-12-19
     * 功能：待办中，审核人和申请人查看交付物的所有文件
     */
      *deliverableCheckAllFile({payload}, {call, put,select}) {
      const {lastCheckId} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.deliverableCheckAllFile,
        {
          arg_proj_id: payload.arg_proj_id,
          arg_check_id: lastCheckId,
          arg_tag:payload.arg_tag,
          arg_handle_flag:payload.arg_handle_flag,
        });
      if (data.RetCode === '1') {
        let defaultMilesKey = [];
        let selectedMiles = [];
        for(let i = 0; i < data.DataRows.length; i++){
          defaultMilesKey.push(data.DataRows[i].mile_uid);
          selectedMiles.push({mile_uid:data.DataRows[i].mile_uid,mile_name:data.DataRows[i].mile_name})
        }
        yield put({
          type: 'save',
          payload: {
            milesList: data.DataRows,
            defaultMilesKey:defaultMilesKey,
            selectedMiles:JSON.stringify(selectedMiles)
          }
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    /**
     * 作者：胡月
     * 创建日期：2017-12-20
     * 功能：待办中，审核人和申请人查看交付物的审核环节
     */
      *deliverableCheckLogSearch({payload}, {call, put,select}) {
      const {lastCheckId} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.deliverableCheckLogSearch,
        {
          arg_check_id:lastCheckId,
        });
      if (data.RetCode === '1') {
        if(data.DataRows.length > 0 ){
          yield put({
            type: 'save',
            payload:{projChangeLog: data.DataRows}
          });
        }else{
          yield put({
            type: 'save',
            payload:{projChangeLog:[]}
          });
        }
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    /**
     * 作者：胡月
     * 创建日期：2017-12-20
     * 功能：待办中，审核人退回交付物
     */
      *deliverableManageReturn({payload}, {call, put}) {
      const data = yield call(projServices.deliverableManageReturn, payload);
      if (data.RetCode === '1') {
        message.success('退回成功');
        yield put(routerRedux.push({pathname: '/taskList'}));
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }else if(data.RetCode === '0'){
        message.error('退回失败');
      }
    },

    /**
     * 作者：胡月
     * 创建日期：2017-12-20
     * 功能：交付物审核人通过操作
     */
      *deliverableManageApprove ({payload}, { call, put }) {
      const data = yield call(projServices.deliverableManageApprove, payload);
      if (data.RetCode === '1') {
        message.success('审核成功');
        yield put(routerRedux.push({pathname: '/taskList'}));
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }else if(data.RetCode === '0'){
        message.error('审核失败');
      }
    },


    //退回交付物后，申请人点击增加交付物类别按钮后，交付物类别的查询
    *deliveryTypeSearch({arg_mile_uid},{call,put,select}){
      yield put({
        type: 'save',
        payload: {
          currentMileUid:arg_mile_uid
        }
      });
      const {projId,lastCheckId,projUid} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.getMilesStoneDelType, {
        arg_proj_id: projId,
        arg_proj_uid:projUid,
        arg_mile_uid: arg_mile_uid,
        arg_check_id: lastCheckId
      });
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deliveryCategoryList: data.DataRows,
          }
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //里程碑交付物类别的绑定
    *mileBindDelType({arg_del_id},{call,put,select}){
      const {projId,checkId,projUid,currentMileUid,roleTag,flag} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.mileBindDelType, {
        arg_proj_id: projId,
        arg_proj_uid: projUid,
        arg_mile_uid: currentMileUid,
        arg_del_id: arg_del_id,
        arg_opt_byid:Cookie.get('userid'),
        arg_check_id:checkId
      });
      if (data.RetCode === '1') {
        message.success('绑定成功');
        let payload = {};
        payload.arg_proj_id = projId;
        payload.arg_check_id = checkId;
        payload.arg_tag = roleTag;
        payload.arg_handle_flag = flag;
        yield put({
          type: 'deliverableCheckAllFile',
          payload
        });
      }else if(data.RetCode === '0'){
        message.error('绑定失败');
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //交付物类别的解绑以及删除交付物类别下的交付物文件
    *mileUnBindDelType({arg_mile_uid,arg_del_id},{call,put,select}){
      const {projId,checkId,projUid,roleTag,flag} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.mileUnBindDelType, {
        arg_proj_id: projId,
        arg_proj_uid: projUid,
        arg_mile_uid: arg_mile_uid,
        arg_del_id: arg_del_id,
        arg_check_id:checkId
      });
      if (data.RetCode === '1') {
        message.success('解绑成功');
        let payload = {};
        payload.arg_proj_id = projId;
        payload.arg_check_id = checkId;
        payload.arg_tag = roleTag;
        payload.arg_handle_flag = flag;
        yield put({
          type: 'deliverableCheckAllFile',
          payload
        });
      }else if(data.RetCode === '0'){
        message.error('解绑失败');
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //交付物文件上传
    *deliverableFileUpload({arg_files,arg_mile_uid,arg_pmd_id},{call,put,select}){
      const {projId,projUid,checkId,titleDetail,roleTag,flag} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.deliverableFileUpload, {
        arg_opt_byid:Cookie.get('userid'),
        arg_opt_byname:Cookie.get('username'),
        arg_proj_id: projId,
        arg_proj_uid: projUid,
        arg_mile_uid: arg_mile_uid,
        arg_pmd_id: arg_pmd_id,
        arg_files: JSON.stringify(arg_files),
        arg_check_business_batchid:titleDetail.business_batchid
      });
      if (data.RetCode === '1') {
        let payload = {};
        payload.arg_proj_id = projId;
        payload.arg_check_id = checkId;
        payload.arg_tag = roleTag;
        payload.arg_handle_flag = flag;
        yield put({
          type: 'deliverableCheckAllFile',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

   //交付物文件删除
    *deliverableFileDelete({arg_mile_uid,arg_pmdf_id},{call,put,select}){
      const {projId,checkId,projUid,roleTag,flag} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.deliverableFileDelete, {
        arg_proj_id: projId,
        arg_proj_uid: projUid,
        arg_mile_uid: arg_mile_uid,
        arg_pmdf_id: arg_pmdf_id,
        arg_check_id:checkId
      });
      if (data.RetCode === '1') {
        let payload = {};
        payload.arg_proj_id = projId;
        payload.arg_check_id = checkId;
        payload.arg_tag = roleTag;
        payload.arg_handle_flag = flag;
        yield put({
          type: 'deliverableCheckAllFile',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //交付物文件别名修改，不能重复
    *deliverableFileNameUpdate({arg_mile_uid,arg_pmdf_id,arg_file_byname},{call,put,select}){
      const {projId,checkId,projUid,roleTag,flag} = yield select(state => state.deliverableCheck);
      const data = yield call(projServices.deliverableFileNameUpdate, {
        arg_proj_id: projId,
        arg_proj_uid: projUid,
        arg_mile_uid: arg_mile_uid,
        arg_pmdf_id: arg_pmdf_id,
        arg_file_byname:arg_file_byname,
        arg_check_id:checkId
      });
      if (data.RetCode === '1') {
        message.success('修改成功');
        let payload = {};
        payload.arg_proj_id = projId;
        payload.arg_check_id = checkId;
        payload.arg_tag = roleTag;
        payload.arg_handle_flag = flag;
        yield put({
          type: 'deliverableCheckAllFile',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }else if(data.RetCode === '0'){
        message.error('修改失败');
      }
    },

    //退回之后，申请人再次提交
    *deliverableManageSubmit({payload},{call,put}){
      const data = yield call(projServices.deliverableManageSubmit, payload);
      if (data.RetCode === '1') {
        message.success('提交成功');
        yield put(routerRedux.push({pathname: '/taskList'}));
      }else if(data.RetCode === '0'){
        message.error('提交失败');
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-24
     * 功能：交付物审核退回时终止流程
     * @param payload 请求数据
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *terminate({payload},{call,put}){
      const data = yield call(projServices.deliverableTerminate,payload);
      if (data.RetCode === '1') {
        message.success('终止流程成功');
        yield put(routerRedux.push({pathname:'/taskList'}));
      }
    },

  },



  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf('/deliverableManage') !== -1) {
          dispatch({type: 'initData'});
          dispatch({type: 'deliverableCheckTitle', payload: query});
          /*dispatch({type: 'deliverableCheckAllFile', payload: query});
          dispatch({type: 'deliverableCheckLogSearch', payload: query});*/
        }
      });
    }
  }
}
