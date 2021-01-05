/**
 * 作者：张枫
 * 创建日期：2019-09-06
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：我的待办-审核
 */
import * as Service from './../../../services/QRCode/officeResService.js';
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import { message } from "antd";

export default {
  namespace:'examine',
  state:{
    roleType:"",//用户角色
    argType:"",//申请性质 /申请类型 0 首次申请 1 延期申请
    applyId:"",//申请id
    staffList:[],//申请人员列表
    staffData:"",//申请信息
    reason:"",//退回原因
    prop:"",// 0 流动人员 1 为常驻人员
  },
  reducers:{
    initData(state) {
      return{

      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects:{
    /**
     * 作者：张枫
     * 创建日期：2019-09-06
     * 邮件：zhangf142@chinaunicom.cn
     * 流动人员延期工位申请
     */
    *queryApplyHistory({}, {select,call,put}) {
      const {applyId, argType} = yield select(state=>state.examine);
      let temp = "";
      let postData = {
        arg_apply_id:applyId,
        //arg_apply_time_left:"",
        //arg_apply_time_right:"",
       // arg_end_time_left:"",
        //arg_end_time_right:"",
        arg_type:argType,//申请类型 0初次申请 1 延期申请
       // arg_state:"",
       // arg_current_page:"",
        //arg_page_size:"",
      }
      let data = yield call(Service.queryApplyHistory,postData);
      if( data.RetVal === "1"){
        if( data.DataRows[0].length !== 0) {
          temp = JSON.parse(data.DataRows[0].details);
          temp.map((item, index)=> {
            item.key = index
          })
        }
        yield put({
          type:"save",
          payload:{
            //staffList:JSON.parse(data.DataRows[0].details),
            staffList:temp,
            staffData:data.DataRows[0]
          }
        })
      }
    },
    //查询用户角色  0 管理层、1、总院办公室 2 属地管理员 3 部门经理  4 部门属地管理员 5 普通员工
    *queryUserAssetsRole({query},{call,put}){
      let data = yield call(Service.queryUserAssetsRole,"")
      yield put({
        type:"save",
        payload:{
          roleType:data.RoleTypeId,
          argType:query.type_id,//0  初次申请 1 延期申请
          applyId:query.apply_id,
          prop:query.prop,
        }
      });
      yield put({type:"queryApplyHistory"})
    },
    // 审核或者退回
    *reviewAssetsApply({data},{select,put,call}){
      const {applyId,reason} = yield select(state=>state.examine);
      let postData = {
        arg_review_type:data,// 0 退回  1 通过
        arg_apply_id:applyId,
        arg_reason:reason,
        arg_assets_ids:"",
       };
      let result = yield call(Service.reviewAssetsApply,postData);
      // 如果通过或者退回成功 跳转回待办列表页面
      if(result.RetCode === "1"){
        message.success("操作成功！")
        yield put(
          routerRedux.push({
            pathname:"adminApp/compRes/todoList"
          })
        )
      }
    },
    //保存退回原因
    *saveReason({data},{put}){
      console.log("11111111modal退回原因");
      console.log(data);
      yield put({type:"save",payload:{reason:data}})
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/todoList/examine') {
          dispatch({type:'queryUserAssetsRole',query});
        }
      });
    },
  }
}
