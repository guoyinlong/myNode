/**
 * 作者：胡月
 * 创建日期：2017-11-08
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：实现交付物管理的服务
 */
import * as projServices from '../../../../services/project/projService';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace:'deliverableManage',
  state:{
    projNameList:[],
    milesList:[],
    deliveryCategoryList:[],
    currentProjId:'',
    currentProjUid:'',
    currentProjName:'',
    currentBusinessId:'',             /*提交时传的参数，后台返回*/
    currentMileUid:'',               /*点击增加交付物类别按钮时选中的里程碑uid*/
    defaultMilesKey:[],              /*默认里程碑列表的展开状态*/
    selectedMiles:[],                /*选中的里程碑列表，用于提交*/
  },

  reducers:{
    save(state, action) {
      return {...state,...action.payload};
    }
  },

  effects:{
    //项目经理第一个项目对应的里程碑，交付物类别，交付物的所有文件查询
    *mileFirstSearch({},{put,call,select}){
      //获取一个项目经理所有立项的项目
      const data = yield call(projServices.pmGetAllProject, {
        arg_userid:Cookie.get('userid'),
      });
      if(data.RetCode === '1') {
        if(data.DataRows.length){
          yield put({
            type: 'save',
            payload: {
              projNameList: data.DataRows,
              currentProjId:data.DataRows[0].proj_id,
              currentProjUid:data.DataRows[0].proj_uid,
              currentProjName:data.DataRows[0].proj_name,
              currentBusinessId :data.DataRows[0].business_id,
            }
          });

          let currentProjId = yield select(state => state.deliverableManage.currentProjId);
          //获取一个项目对应的里程碑，交付物类别，交付物的所有文件
          const res = yield call(projServices.getAllMilesFiles, {
            arg_proj_id: currentProjId,
          });
          if (res.RetCode === '1') {
            let defaultMilesKey = [];
            for(let i = 0; i < res.DataRows.length; i++){
              defaultMilesKey.push(res.DataRows[i].mile_uid);
              res.DataRows[i].checkBoxState = false;  //初始化checkbox未被选中
            }
            yield put({
              type: 'save',
              payload: {
                milesList: res.DataRows,
                defaultMilesKey:defaultMilesKey
              }
            });
            //根据交付物文件情况判断复选框是否可选
            yield put({
              type:'judgeDeliverableCheck'
            });
          }else if(data.RetCode === '-1'){
            message.error(data.RetVal);
          }
        }
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },
    //选择某一个项目的里程碑，交付物类别，交付物的所有文件查询
    *mileSearch({payload},{put,call,select}){
      let {projNameList,milesList,selectedMiles} = yield select(state => state.deliverableManage);
      //切换项目时，改变其中所有涉及的参数
      for(let j = 0; j < projNameList.length; j++){
        if(payload.arg_proj_id === projNameList[j].proj_id){
           payload.arg_proj_uid = projNameList[j].proj_uid;
           payload.arg_proj_name = projNameList[j].proj_name;
           payload.arg_business_id = projNameList[j].business_id;
        }
      }
      yield put({
        type: 'save',
        payload: {
          currentProjId: payload.arg_proj_id,
          currentProjUid:payload.arg_proj_uid,
          currentProjName:payload.arg_proj_name,
          currentBusinessId :payload.arg_business_id,
        }
      });
      const res = yield call(projServices.getAllMilesFiles, {
        arg_proj_id: payload.arg_proj_id,
      });
      if (res.RetCode === '1') {
        let defaultMilesKey = [];
        for(let i = 0; i < res.DataRows.length; i++){
          defaultMilesKey.push(res.DataRows[i].mile_uid);
          //如果是切换项目，相当于重新查询，里程碑的checkBoxState为false ，提交的里程碑列表 selectedMiles 清空
          if('switchProjFlag' in payload  && payload.switchProjFlag === '1'){
            res.DataRows[i].checkBoxState = false;   //初始化checkbox未被选中
            selectedMiles = [];
          }else{
            res.DataRows[i].checkBoxState = milesList[i].checkBoxState;
          }
        }
        yield put({
          type: 'save',
          payload: {
            milesList: res.DataRows,
            selectedMiles:JSON.parse(JSON.stringify(selectedMiles)),
            defaultMilesKey:defaultMilesKey
          }
        });
        //根据交付物文件情况判断复选框是否可选(置灰)
        yield put({
          type:'judgeDeliverableCheck'
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },
    //点击增加交付物类别按钮后，交付物类别的查询
    *deliveryTypeSearch({payload},{call,put,select}){
      let currentProjId = yield select(state => state.deliverableManage.currentProjId);
      let currentProjUid = yield select(state => state.deliverableManage.currentProjUid);
      yield put({
        type: 'save',
        payload: {
          currentMileUid: payload.arg_mile_uid,
        }
      });
      const data = yield call(projServices.getMilesStoneDelType, {
        arg_proj_id: currentProjId,
        arg_proj_uid: currentProjUid,
        arg_mile_uid: payload.arg_mile_uid
      });
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deliveryCategoryList: data.DataRows
          }
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },
    //里程碑交付物类别的绑定
    *mileBindDelType({arg_del_id},{call,put,select}){
      let {currentProjId,currentProjUid,currentMileUid} = yield select(state => state.deliverableManage);
      const data = yield call(projServices.mileBindDelType, {
        arg_proj_id: currentProjId,
        arg_proj_uid: currentProjUid,
        arg_mile_uid: currentMileUid,
        arg_del_id: arg_del_id,
        arg_opt_byid:Cookie.get('userid')
      });
      if (data.RetCode === '1') {
        message.success('绑定成功');
       let payload = {};
        payload.arg_proj_id = currentProjId;
        yield put({
          type: 'mileSearch',
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
      let currentProjId = yield select(state => state.deliverableManage.currentProjId);
      let currentProjUid = yield select(state => state.deliverableManage.currentProjUid);
      const data = yield call(projServices.mileUnBindDelType, {
        arg_proj_id: currentProjId,
        arg_proj_uid: currentProjUid,
        arg_mile_uid: arg_mile_uid,
        arg_del_id: arg_del_id,
      });
      if (data.RetCode === '1') {
        message.success('解绑成功');
        let payload = {};
        payload.arg_proj_id = currentProjId;
        yield put({
          type: 'mileSearch',
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
      let currentProjId = yield select(state => state.deliverableManage.currentProjId);
      let currentProjUid = yield select(state => state.deliverableManage.currentProjUid);
      const data = yield call(projServices.deliverableFileUpload, {
        arg_opt_byid:Cookie.get('userid'),
        arg_opt_byname:Cookie.get('username'),
        arg_proj_id: currentProjId,
        arg_proj_uid: currentProjUid,
        arg_mile_uid: arg_mile_uid,
        arg_pmd_id: arg_pmd_id,
        arg_files: JSON.stringify(arg_files)
      });
      if (data.RetCode === '1') {
        let payload = {};
        payload.arg_proj_id = currentProjId;
        yield put({
          type: 'mileSearch',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //交付物文件删除
    *deliverableFileDelete({arg_mile_uid,arg_pmdf_id},{call,put,select}){
      let {currentProjId,currentProjUid} = yield select(state => state.deliverableManage);
      const data = yield call(projServices.deliverableFileDelete, {
        arg_proj_id: currentProjId,
        arg_proj_uid: currentProjUid,
        arg_mile_uid: arg_mile_uid,
        arg_pmdf_id: arg_pmdf_id,
      });
      if (data.RetCode === '1') {
        let payload = {};
        payload.arg_proj_id = currentProjId;
        yield put({
          type: 'mileSearch',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //交付物文件别名修改，不能重复
    *deliverableFileNameUpdate({arg_mile_uid,arg_pmdf_id,arg_file_byname},{call,put,select}){
      let currentProjId = yield select(state => state.deliverableManage.currentProjId);
      let currentProjUid = yield select(state => state.deliverableManage.currentProjUid);
      const data = yield call(projServices.deliverableFileNameUpdate, {
        arg_proj_id: currentProjId,
        arg_proj_uid: currentProjUid,
        arg_mile_uid: arg_mile_uid,
        arg_pmdf_id: arg_pmdf_id,
        arg_file_byname:arg_file_byname
      });
      if (data.RetCode === '1') {
        message.success('修改成功');
        let payload = {};
        payload.arg_proj_id = currentProjId;
        yield put({
          type: 'mileSearch',
          payload
        });
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }else if(data.RetCode === '0'){
        message.error('修改失败');
      }
    },

    //项目经理提交交付物管理
    *deliverableManageSubmit({},{call,put,select}){
      let {currentProjId,currentProjUid,currentProjName,currentBusinessId,selectedMiles} = yield select(state => state.deliverableManage);
      const data = yield call(projServices.deliverableManageSubmit, {
        arg_opt_byid:Cookie.get('userid'),
        arg_opt_byname:Cookie.get('username'),
        arg_proj_id: currentProjId,
        arg_proj_name: currentProjName,
        arg_proj_uid: currentProjUid,
        arg_business_id:currentBusinessId,
        arg_mile_uid_array: JSON.stringify(selectedMiles)
      });
      //点击提交后，清空选择的里程碑列表
      yield put({
        type:'save',
        payload:{
          selectedMiles:[]
        }
      });
      if (data.RetCode === '1') {
        message.success('提交成功');
        let payload = {};
        payload.arg_proj_id = currentProjId;
        yield put({
          type: 'mileSearch',
          payload
        });
       /* yield put(routerRedux.push({
         pathname: 'projectApp/projMonitor/deliverable'}));*/
      }else if(data.RetCode === '0'){
        message.error('提交失败');
      }else if(data.RetCode === '-1'){
        message.error(data.RetVal);
      }
    },

    //判断里程碑是否能够勾选，并且处理checkBox的值（没有文件时，强制转为false）和 提交的里程碑列表（selectedMiles）
    *judgeDeliverableCheck({},{select,put}){
      let {milesList,selectedMiles} = yield select(state => state.deliverableManage);
      for(let i = 0; i < milesList.length; i++){
        let checkBoxCanCheck = true;                    //checkbox是否置灰  false为置灰  true为可选
        if('deliverables' in milesList[i] && milesList[i].deliverables !== 'NaN'){
          let deliverables = milesList[i].deliverables.replace(/\:\"\[+/g,':[');
          deliverables = JSON.parse(deliverables.replace(/\]\"\}/g,']}'));
          for(let j = 0; j < deliverables.length; j++){
            if(deliverables[j].files === undefined || deliverables[j].files === 'NaN'){
              checkBoxCanCheck = false;
              break;
            }
          }
        }else{
          checkBoxCanCheck = false;
        }
        milesList[i].checkBoxCanCheck = checkBoxCanCheck;

        //如果复选框不可选，强制处理checkBoxState的值为false，并删除提交时选中的里程碑列表中对应的里程碑
        if(checkBoxCanCheck === false){
          milesList[i].checkBoxState = false;
          let deleteIndex = 0;
          for (let k = 0; k < selectedMiles.length; k++) {
            if (selectedMiles[k].mile_uid === milesList[i].mile_uid) {
              deleteIndex = k;
              selectedMiles.splice(deleteIndex, 1);
              break;
            }
          }
        }
      }
      yield put({
        type:'save',
        payload:{
          milesList:JSON.parse(JSON.stringify(milesList)),
          selectedMiles:JSON.parse(JSON.stringify(selectedMiles))
        }
      });
    },

    //改变里程碑复选框选中状态时，改变选中里程碑的信息
    *changeCheckBoxState({mileIndex,value,mile_uid,mile_name},{select,put}){
      let {milesList,selectedMiles} = yield select(state => state.deliverableManage);
      //勾选或者取消里程碑复选框时，改变被选中的里程碑列表  selectedMiles
      if(value === true){
        selectedMiles.push({mile_uid: mile_uid, mile_name: mile_name});
      }else{
        let deleteIndex = 0;
        for (let i = 0; i < selectedMiles.length; i++) {
          if (selectedMiles[i].mile_uid === mile_uid) {
            deleteIndex = i;
            break;
          }
        }
        selectedMiles.splice(deleteIndex, 1);
      }
      yield put({
        type:'save',
        payload:{
          selectedMiles:JSON.parse(JSON.stringify(selectedMiles))
        }
      });

      //更改展示的里程碑列表复选框的值
      milesList[mileIndex].checkBoxState = value;
      yield put({
        type:'save',
        payload:{milesList:JSON.parse(JSON.stringify(milesList))}
      });
    },
  },


  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/projMonitor/deliverable') {
          dispatch({type: 'mileFirstSearch',query});
        }
      });
    },
  }
}
