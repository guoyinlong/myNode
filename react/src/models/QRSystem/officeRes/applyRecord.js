/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请-申请记录查询
 */
import * as Service from './../../../services/QRCode/officeResService.js';
import Cookie from 'js-cookie';

export default {
  namespace:'applyRecord',
  state:{
    recordList:[],//查询列表
    page:1,
    pageSize:10,
    total:0,
    applyBegin:null,
    applyEnd:null,
    endBegin:null,
    endEnd:null,
    applyList : [{
      stateType:"0",
      name:"初次申请"
    },{
      stateType:"1",
      name:"延期申请"
    }],
    stateList : [{
      stateType:"DeptManageReview",
      name:"待部门经理审核"
    },{
      stateType:"DeptManageDisagree",
      name:"部门经理退回"
    },{
      stateType:"AdminReview",
      name:"待属地管理员审核"
    },{
      stateType:"AdminDisagree",
      name:"属地管理员退回"
    },{
      stateType:"AdminAgree",
      name:"审核通过"
    }, {
      stateType: "Cancel",
      name: "取消申请"
    }],
    applyValue:"",// 申请类型
    stateValue:"",//审批状态
  },
  reducers:{
    initData(state) {
      return{
        ...state,
        recordList:[],//查询列表
        page:1,
        pageSize:10,
        total:0,
        applyBegin:null,
        applyEnd:null,
        endBegin:null,
        endEnd:null,
        applyValue:"",// 申请类型
        stateValue:"",//审批状态
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects:{
    //初始化查询数据
    *queryRecord({},{select,put,call}){
      let { applyBegin,applyEnd,endBegin,endEnd,page,pageSize,applyValue,stateValue}= yield select (state=>state.applyRecord)
      let postData = {
        arg_apply_time_left:applyBegin,
        arg_apply_time_right:applyEnd,
        arg_end_time_left:endBegin,
        arg_end_time_right:endEnd,
        arg_current_page:page,
        arg_page_size:pageSize,
        arg_type:applyValue,
        arg_state:stateValue,
      }
      let data = yield call(Service.queryApplyHistory,postData)
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
            recordList:data.DataRows,
            total:Number(data.RowCount),
          }
        })
      }
    },
    *changePage({page},{put}){
        yield put({
          type:"save",
          payload:{
            page:page,
          }
        })
      yield put({type:"queryRecord"})
      },
    *beginTime({data},{put}){
      yield put({type:"save", payload:{applyBegin:data[0],applyEnd:data[1], page:1}})
      yield put({type:"queryRecord"})
    },
    *endTime({data},{put}){
      yield put({type:"save", payload:{endBegin:data[0],endEnd:data[1], page:1}})
      yield put({type:"queryRecord"})
    },
    // 保存申请状态数据
    *saveSelectValue({data},{select,put,call}){
      yield put({
        type: "save",
        payload: {
          applyValue: data,
          page:1
        }
      })
      yield put({type: "queryRecord"})
    },
    *saveStateValue({data},{select,put,call}){
      yield put({
        type:"save",
        payload:{
          stateValue:data,
          page:1
        }
      })
      yield put({type:"queryRecord"})
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/officeResMain/apply/applyRecord') {
           dispatch({ type: 'initData'});
           dispatch({type:'queryRecord',query});
        }
      });
    },
  }
}
