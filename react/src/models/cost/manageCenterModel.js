/**
 *  作者: 王福江
 *  创建日期: 2019-10-16
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现工资项维护功能
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as costService from "../../services/cost/costService";
import * as trainService from "../../services/train/trainService";
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace:'manageCenterModel',
  state:{
    //工资项信息
    titleDataList:[], 
  },
  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },
  effects: {
    *initManageQuery({query}, {call, put}) {
      let queryParam = {
        arg_ou_id : Cookie.get('OUID'),
      };
      const courtTitleData = yield call(costService.costTitleList,queryParam);
      let titleList = [];
      if(courtTitleData.RetCode === '1'){
        for (let i=0;i<courtTitleData.DataRows.length;i++){
          courtTitleData.DataRows[i]['indexID'] = i+1;
          let costname = courtTitleData.DataRows[i].cost_name;
          if(!(costname=='员工编号'||costname=='员工姓名'||costname=='部门'||costname=='月份')){
            titleList.push(courtTitleData.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            titleDataList: titleList
          }
        });
      }else{
        message.error('工资项查询失败！');
      }
    },
    *addManageCenter({arg_param}, {call, put}) {
      const addTitleData = yield call(costService.costTitleAdd,arg_param);
      if(addTitleData.RetCode === '1'){
        message.info("新增成功！");
        yield put({
          type: 'initManageQuery',
          query: arg_param,
        });
      }else{
        message.info("新增失败！");
      }
    },
    *updateManageCenter({arg_param}, {call, put}) {
      const addTitleData = yield call(costService.costTitleUpdate,arg_param);
      if(addTitleData.RetCode === '1'){
        message.info("修改成功！");
        yield put({
          type: 'initManageQuery',
          query: arg_param,
        });
      }else{
        message.info("修改失败！");
      }
    },
    *updateManageBranch({arg_param}, {call, put}) {
      const addTitleData = yield call(costService.costTitleUpdateBranch,arg_param);
      if(addTitleData.RetCode === '1'){
        message.info("修改成功！");
        yield put({
          type: 'initManageQuery',
          query: arg_param,
        });
      }else{
        message.info("修改失败！");
      }
    },
    *deleteManageCenter({arg_param}, {call, put}) {
      let delparam = {};
      delparam['arg_id'] = arg_param.id;
      delparam['arg_cost_name'] = arg_param.cost_cname;
      const delTitleData = yield call(costService.costTitleDelete,delparam);
      if(delTitleData.RetCode === '1'){
        message.info("删除成功！");
        yield put({
          type: 'initManageQuery',
          query: arg_param,
        });
      }else{
        message.info("删除失败！");
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/costlabor/manageCenter') {
          dispatch({ type: 'initManageQuery',query });
        }
        if (pathname === '/humanApp/costlabor/manageBranch') {
          dispatch({ type: 'initManageQuery',query });
        }
      });
    }
  }
}
