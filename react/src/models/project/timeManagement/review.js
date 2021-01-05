/**
 * 作者：张楠华
 * 日期：2017-11-21
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现工时审核界面逻辑
 */
import * as timeManageService from '../../../services/project/timeManagement';
import { message } from 'antd';
import Cookies from 'js-cookie'
export default {
  namespace: 'review',
  state: {
    list:[],
    timeNum:[],
    titleList:[],
    resetStateData:false,
    allDetail:[],
    titleTime:'',
    projInfo:''
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：保存数据
     */
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：普通角色初始化1
     */
    *init({query}, { put }) {
      let arr = new Array(1000), i=arr.length;
      while(i--){arr[i] = 0;}
      yield put({
        type:'save',
        payload:{
          timeNum:arr,
          tag:0,//tag为0时工时审核，tag为1时为工时补录审核,tag为2时为部门经理补录审核
          list:[],
          titleList:[],
          resetStateData:false,
          titleTime:'',
          projInfo:''
        }
      });
      yield put({
        type:'queryReviewProject',
        tag:0,
        query,
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：查询项目
     */
      *queryReviewProject({tag,query},{call,put}){
      let postData = {};
      postData['arg_staff_id'] = localStorage.userid;
      const data = yield call(timeManageService.queryTimeManageReviewProject,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            titleList:data.DataRows,
          }
        });
        if(tag === 0){
          if(data.DataRows.length !==0 && data.DataRows[0].proj_id){
            yield put({
              type:'queryReview',
              projInfo:Object.keys(query).length!==0?query.proj_id:data.DataRows[0].proj_id
            });
          }

        }else if(tag === 1){
          if(data.DataRows.length !==0 && data.DataRows[0].proj_id){
            yield put({
              type:'queryMakeUpReview',
              projInfo:Object.keys(query).length!==0?query.proj_id:data.DataRows[0].proj_id
            });
          }
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：普通角色查询11
     */
    *queryReview({projInfo},{call,put}){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.timeManageReview,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:data.DataRows,
            resetStateData:true,
            titleTime:data,
            projInfo:projInfo
          }
        });
        yield put({
          type:'queryReviewBottomInfo',
          projInfo
        });
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：工时补录初始化
     */
    *initMakeUp({query}, { put }) {
      let arr = new Array(1000), i=arr.length;
      while(i--){arr[i] = 0;}
      yield put({
        type:'save',
        payload:{
          timeNum:arr,
          tag:1,
          list:[],
          titleList:[],
          resetStateData:false,
          projInfo:''
        }
      });
      yield put({
        type:'queryReviewProject',
        tag:1,
        query
      });
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：工时补录查询。
     */
    *queryMakeUpReview({projInfo},{call,put}){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.timeManageMakeUp,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:data.DataRows,
            resetStateData:true,
            projInfo:projInfo
          }
        });
        yield put({
          type:'queryReviewBottomInfoPM',
          projInfo
        });
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：部门经理工时补录初始化
     */
    *initMakeUpDeptMgr({}, { put }) {
      let arr = new Array(1000), i=arr.length;
      while(i--){arr[i] = 0;}
      yield put({
        type:'save',
        payload:{
          timeNum:arr,
          tag:2, //tag = 0 普通审核，tag = 1 补录审核 ,tag =2部门经理补录审核
          list:[],
          titleList:[],
          resetStateData:false,
          projInfo:''
        }
      });
      yield put({
        type:'queryMakeUpReviewDeptMgr',
      });
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：部门经理工时补录查询。
     */
    *queryMakeUpReviewDeptMgr({},{call,put}){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      const data = yield call(timeManageService.timeManageMakeUpDeptMgr,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            titleList:data.DataRows1?data.DataRows1:[],
            list:data.DataRows,
          }
        });
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：部门经理工时补录查询，假服务方式。
     */
    //   *queryMakeUpReviewDept({projInfo},{put,select}){
    //   const { listAll } = yield select(state => state.review);
    //   let data = [];
    //   for(let i=0;i<listAll.length;i++){
    //     if(projInfo === listAll[i].proj_code){
    //       data.push(listAll[i])
    //     }
    //   }
    //   yield put({
    //     type:'save',
    //     payload:{
    //       list:data,
    //       resetStateData : true
    //     }
    //   });
    // },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：计算活动类型，加一
     */
    *changeNum({num,index},{put}){
      num[index]++;
      yield put({
        type:'save',
        payload:{
          timeNum:num,
        }
      })
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：计算活动类型，减一
     */
    *changeNumS({num,index},{put}){
      num[index]--;
      yield put({
        type:'save',
        payload:{
          timeNum:num,
        }
      })
    },
    //查询审核底部详情
    *queryReviewBottomInfo({projInfo},{call,put}){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.queryReviewBottomInfo,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            allDetail:data,
          }
        });
      }
    },
    *queryReviewBottomInfoPM({projInfo},{call,put}){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.queryReviewBottomInfoPM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            allDetail:data,
          }
        });
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：通过/批量通过：
     *  普通审核tag=0为arg_approved_status=2.
     *  项目经理补录审核tag=1 arg_approved_status=5,外包为arg_approved_status=2
     *  部门经理tag=2为arg_approved_status=2,
     *  tag = 0 普通审核，tag = 1 补录审核 ,tag =2部门经理补录审核
     */
    *pass({ids},{select,call,put}){
      let {tag,projInfo} = yield select(state=>state.review);
      if(tag === 0 || tag === 2){
        let postData = {};
        let idList = [];
        for(let i= 0 ;i<ids.length;i++){
          idList.push({id:ids[i].id});
        }
        postData['arg_ids_reasons']=JSON.stringify(idList);
        const data = yield call(timeManageService.timeManagePass,postData);
        if(data.RetCode === '1'){
          message.info('审核通过');
        }
      }else{
        let idListSelf = [];
        let idListPurchase = [];
        for(let i=0;i<ids.length;i++){
          if(ids[i].rowType === '1'){
            idListSelf.push({id:ids[i].id});
          }else{
            idListPurchase.push({id:ids[i].id});
          }
        }
        let postData = {};
        {
          idListPurchase.length !== 0 ?
            postData['arg_makeup_purchase_ids_reasons'] =JSON.stringify(idListPurchase)
            :
            ''
        }
        {
          idListSelf.length !== 0 ?
            postData['arg_makeup_self_ids_reasons'] = JSON.stringify(idListSelf)
            :
            ''
        }
        const data = yield call(timeManageService.timeManagePassPM,postData);
        if(data.RetCode === '1'){
          message.info('审核通过');
        }
      }
      yield put({
        type: tag === 0 ?'queryReview' : (tag === 1 ?'queryMakeUpReview':'queryMakeUpReviewDeptMgr'),
        projInfo
      });
    },

    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：通过/批量通过：部门经理为5。姓名经理补录审核和普通审核为2.
     */
      *exportExl({ids},{}){
      let idList = [];
      for(let i= 0 ;i<ids.length;i++){
        idList.push({id:ids[i]});
      }
      window.open('/microservice/alltimesheet/timesheet/ExportTimesheetRecords?'+'arg_ids_reasons='+encodeURI(JSON.stringify(idList)));
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：工时审核退回。为3
     */
    *returnReasonCrl({reason,ids},{select,call,put}){

      let postData = {};
      let idList = [];
      for(let i= 0 ;i<ids.length;i++){
        idList.push({id:ids[i]});
      }
      postData['arg_ids_reasons']=JSON.stringify(idList);
      postData['approvedby']=reason;

      const data1 = yield call(timeManageService.timeManageReject,postData);
      if(data1.RetCode === '1'){
        message.info('退回成功');
      }
      let {tag,projInfo} = yield select(state=>state.review);
      yield put({
        type: tag === 0 ?'queryReview' : (tag === 1 ?'queryMakeUpReview':'queryMakeUpReviewDeptMgr'),
        projInfo
      });
      },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：工时补录审核退回，为7。
     */
    *returnMakeUpReasonCrl({reason,ids},{select,call,put}){
      let postData = {};
      let idList = [];
      for(let i= 0 ;i<ids.length;i++){
        idList.push({id:ids[i]});
      }
      postData['arg_ids_reasons']=JSON.stringify(idList);
      postData['approvedby']=reason;

      const data1 = yield call(timeManageService.timeManageRejectPM,postData);
      if(data1.RetCode === '1'){
        message.info('退回成功');
      }
      let {tag,projInfo} = yield select(state=>state.review);
      yield put({
        type: tag === 0 ?'queryReview' : (tag === 1 ?'queryMakeUpReview':'queryMakeUpReviewDeptMgr'),
        projInfo
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/timesheetCheck') {
          dispatch({ type: 'init',query });
        }
        if (pathname === '/projectApp/timesheetManage/timesheetMakeupCheckPm') {
          dispatch({ type: 'initMakeUp',query });
        }
        if (pathname === '/projectApp/timesheetManage/timesheetMakeupCheckDm') {
          dispatch({ type: 'initMakeUpDeptMgr',query });
        }
      });
    },
  },
};
