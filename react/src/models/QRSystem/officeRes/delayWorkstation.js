/**
  * 作者：王均超
  * 创建日期：2019-09-02
  * 邮箱:  wangjc@itnova.com.cn
  * 功能： 延期工位数据处理层
  */
import { message } from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/workStation/workStation.js';
import { routerRedux } from "dva/router";

export default {
  namespace: 'delayWorkstation',
  state: {
    applyType:"0",//0 为流动类型 1 为常驻类型
    delayList:[],//延期人员 申请人员列表
    beginTime:"",//延期人员申请开始时间
    endTime:"",//延期人员申请到期时间
    delayReason:"",//延期人员申请原因
    delayRowSelectList:[],//延期人员申请勾选数据
    StaffNum:"",//延期人员申请数量
    StaffList:[],
    List:[],
    // 延期人员页码信息
    page:1,
    pageSize :10,
    total:0,
    detail_id:"",
    applyBegin:null,
    applyEnd:null,
    endBegin:null,
    endEnd:null,
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        delayList:[],//查询列表
        page:1,
        pageSize:10,
        total:0,
        applyBegin:null,
        applyEnd:null,
        endBegin:null,
        endEnd:null,
      }
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {

    *init({ }, { put, call }) {
      yield put({ type: "queryStaffLitst" })
    },

    //延期人员申请列表查询
    *queryStaffLitst({ }, { select, put, call }) {
      let { applyBegin,applyEnd,endBegin,endEnd,page ,pageSize } = yield select( state=>state.delayWorkstation)
      let postData = {
        arg_page_size:pageSize,
        arg_current_page:page,
        arg_apply_time_left:applyBegin,
        arg_apply_time_right:applyEnd,
        arg_end_time_left:endBegin,
        arg_end_time_right:endEnd,
      };
      let data = yield call(usersService.queryAssetsTempUseInfo, postData);
      if(data.RetCode === "1"){
        if(data.DataRows.length!=0){
          data.DataRows.map((item,index)=>{
            item.key = index;
            item.apply_time = item.apply_time.slice(0,10);
          })
        }
        yield put ({
          type : "save",
          payload : {
            delayList:data.DataRows,
            total:Number(data.RowCount),
          }
        })
      }
    },

  // 保存流动人员时间数据
  *saveDate({data},{ select,put,call}){
    yield put({
      type:"save",
      payload:{
        beginTime:data[0],
        endTime:data[1],
      }
    })
  },
  //  //保存延期人员开始申请时间
  //  *saveStartDate({data},{select,put,call}){
  //   yield put ({type:"save",payload:{delayStartDate:data}})
  // },
  // //保存延期人员到期申请时间
  // *saveEndDate({data},{select,put,call}){
  //   console.log(data,"data")
  //   yield put ({type:"save",payload:{delayEndDate:data}})
  // },
  // 保存延期人员申请原因
  *saveDelayReason({data},{select,put,call}){
    yield put ({type:"save",payload:{delayReason:data}})
  },
  //保存延期人员要提交的数据
  *delayRowSelect({data},{select,put,call}){
    let delayRowSelectList= [];
    data.length !==0 && data.map((item,index)=>{
      item.key = index;
      delayRowSelectList.push( item.detail_id)
      delayRowSelectList.join(",")
    })
    yield put ({type:"save",payload:{delayRowSelectList:delayRowSelectList,StaffNum:data.length}})
  },
  // 延期人员提交申请
  *flowSubmit({},{put,call,select}){
    let { beginTime,endTime,delayReason ,delayRowSelectList,StaffNum}= yield select( state => state.delayWorkstation)
    let postData = {
      arg_type : 1,
      arg_prop : 0,
      arg_number:StaffNum,
      arg_begin_time:beginTime,
      arg_end_time:endTime,
      arg_reason:delayReason,
      arg_person:delayRowSelectList.join(","),
    };
    let data = yield call(usersService.applyFormCommit,postData);
    if( data.RetCode === "1"){
      message.success("提交成功")
      yield put({
        type : "save",
        payload:{
          delayList:[],//延期人员申请列表
          beginTime:"",//延期人员申请开始时间
          endTime:"",//延期人员申请到期时间
          delayReason:"",//延期人员申请原因
          delayRowSelectList:[],//延期人员申请勾选数据
          StaffNum:"",//延期人员申请数量
          StaffList:[],
          // 延期人员页码信息
          page:1,
        }
      })
      yield put(
        routerRedux.push({pathname:"adminApp/compRes/officeResMain"})
      )
    }
    else{
      message.error(data.RetVal);
      yield put({
        type:"save",
        payload:{
          List:data.AbnormalUserInfo,  //  提交失败数据处理
          StaffList:[],
        }
      })
    }
  },
  // 修改延期人员页码
  *changePage({data},{put}){
    yield put ({type:"save",payload:{page:data}})
    yield put ({type:"queryStaffLitst"})
  },

  //申请开始时间
  *beginTime({ data }, { put }) {
    yield put({ type: "save", payload: { applyBegin: data[0], applyEnd: data[1] } });
    yield put({ type: "queryStaffLitst" });
  },
  //到期时间
  *endTime({ data }, { put }) {
    yield put({ type: "save", payload: { endBegin: data[0], endEnd: data[1] } });
    yield put({ type: "queryStaffLitst" });
  },
  //清空申请时间
  *clearApplyDate({ }, { put }) {
    yield put({ type: "save", payload: { applyBegin: null, applyEnd: null } });
    yield put({ type: "queryStaffLitst" });
  },
  //清空结束时间
  *clearExpireDate({ }, { put }) {
    yield put({ type: "save", payload: { endBegin: null, endEnd: null } });
    yield put({ type: "queryStaffLitst" });
  }


  },


  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/officeResMain/delayWorkstation') {
          dispatch({ type: 'init', query });
        }
      });
    },
  },
};
