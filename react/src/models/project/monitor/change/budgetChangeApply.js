/**
 * 作者：薛刚
 * 创建日期：2018-10-15
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更model
 */
import { travelBudgetQuery, travelBudgetSaveOrSubmit, travelBudgetDeptRestrict, deleteChangeApplyDraft } from '../../../../services/project/projService.js'
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/**
 * 作者：薛刚
 * 创建日期：2018-10-24
 * 功能：通过部门和预算类型合并预算
 * @param budgetList 预算数组
 */
function mergeBudgetByDeptAndFeeTypeHandler(budgetList) {
  if(budgetList instanceof Array) {
    // 按照部门汇总预算信息
    const travelList = groupFeeByDept(budgetList);
    const travelArray = [];
    let capitalTotal = 0, expenseTotal = 0;
    travelList.map((item) => {
      let deptTotal = 0;
      // 同一部门按照预算汇总
      const budegtArray =  groupFeeByType(item.budget);
      budegtArray.forEach((budgetItem) => {
        const obj = {};
        obj.type = budgetItem.type;
        const budgetMap = budgetItem.budget;
        budgetMap.map((budgetItem) => {
          obj.code = budgetItem.pms_code;
          obj.dept_name = budgetItem.dept_name;
          if(budgetItem.fee_name === "差旅费_资本化") {
            obj.capital = {
              uid: budgetItem.budget_uid,
              fee: budgetItem.fee
            };
          } else if(budgetItem.fee_name === "差旅费") {
            obj.expense = {
              uid: budgetItem.budget_uid,
              fee: budgetItem.fee
            };
          }
          deptTotal += Number(budgetItem.fee);
        })
        if(obj.hasOwnProperty('capital')){
          capitalTotal += Number(obj.capital.fee);
        }
        if(obj.hasOwnProperty('expense')){
          expenseTotal += Number(obj.expense.fee);
        }
        travelArray.push(obj);
      })
      travelArray.forEach((itemObj) => {
        if(itemObj.dept_name == item.dept_name){
          itemObj.sum = deptTotal.toFixed(2);
        }
      })
    })
    const totalObj = {
      dept_name: '合计',
      capital: capitalTotal.toFixed(2),
      expense: expenseTotal.toFixed(2),
      sum: (capitalTotal+expenseTotal).toFixed(2)
    }
    travelArray.push(totalObj);
    return travelArray;
  }
}

/**
 * 作者：薛刚
 * 创建日期：2018-10-24
 * 功能：按部门汇总预算
 * @param budgetList 预算数组
 */
function groupFeeByDept(budgetArray) {
  const map = {}, group = [];
  for(let i=0; i<budgetArray.length; i++) {
    const data = budgetArray[i];
    if(!map[data.dept_name]){
      group.push({
        dept_name: data.dept_name,
        budget: [data]
      });
      map[data.dept_name] = data;
    }else {
      for(var j = 0; j < group.length; j++){
        const dj = group[j];
        if(dj.dept_name == data.dept_name){
          dj.budget.push(data);
          break;
        }
      }
    }
  }
  return group;
}

/**
 * 作者：薛刚
 * 创建日期：2018-10-24
 * 功能：按费用汇总预算
 * @param budgetList 预算数组
 */
function groupFeeByType(budgetArray) {
  const map = {}, group = [];
  for(let i=0; i<budgetArray.length; i++) {
    const data = budgetArray[i];
    if(!map[data.type]){
      group.push({
        type: data.type,
        code: data.pms_code,
        budget: [data]
      });
      map[data.type] = data;
    }else {
      for(var j = 0; j < group.length; j++){
        const dj = group[j];
        if(dj.type == data.type){
          dj.budget.push(data);
          break;
        }
      }
    }
  }
  return group;
}

export default {
  namespace: 'budgetChangeApply',

  state:{
    projInfo: {}, // 项目信息对象
    projTravelBudgetList: [], // 项目差旅费预算列表
    deptBudget: [], // 部门所有年份的差旅预算总数
    initialTravelBudgetList: [], // 最初的项目差旅费预算列表，用于做对比
    isMoreThanDeptBudget: false, // 是否超过部门剩余预算
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  effects:{
    // 查询差旅预算
    *projTravelBudgetQuery({ payload }, { call, put }) {
      const travelBudgetList = yield call(travelBudgetQuery, payload);
      if(travelBudgetList.RetCode === '1'){
        const travelData = travelBudgetList.DataRows;
        const resultArray = new Array();
        travelData.map((item) => {
          const result = {};
          result.year = item.year;
          const budegtJson = JSON.parse(item.budget_info);
          result.budget = mergeBudgetByDeptAndFeeTypeHandler(budegtJson);
          const listByFeeType = groupFeeByType(budegtJson);
          const feeArray = []
          listByFeeType.map((item) => {
            const feeObj = {}, budgetList = item.budget;
            feeObj.type = item.type;
            feeObj.code = item.code;
            let feeTypeTotal = 0;
            budgetList.forEach((budget) => {
              feeTypeTotal += Number(budget.fee);
            })
            feeObj.total = feeTypeTotal.toFixed(2);
            feeArray.push(feeObj);
          })
          result.total_info = feeArray;
          resultArray.push(result);
        });
        const projInfoObj = {
          projId: payload.arg_proj_id,
          projUid: travelBudgetList.proj_uid,
          projName: travelBudgetList.proj_name,
          projStatus: travelBudgetList.ProjChangeCheckFlag,
          projPuDeptId: travelBudgetList.pu_dept_id,
          projCanChange: travelBudgetList.CanChange,
          projDraftFlag: travelBudgetList.ProjChangeBudgetDraftFlag,
        }
        if(travelBudgetList.hasOwnProperty('bussiness_batchid')) {
          projInfoObj.batchid = travelBudgetList.bussiness_batchid;
        }
        yield put({
          type: 'save',
          payload: {
            projInfo: projInfoObj,
            projTravelBudgetList: JSON.parse(JSON.stringify(resultArray)),
            initialTravelBudgetList: JSON.parse(JSON.stringify(resultArray))
          }
        });

        yield put({
          type: 'projTravelBudgetDeptRestrict',
          proj: {
            arg_proj_id: payload.arg_proj_id,
          }
        })
      }
    },

    // 查询部门预算剩余
    *projTravelBudgetDeptRestrict({ proj }, { call, put }) {
      const limitRes = yield call(travelBudgetDeptRestrict, proj);
      if(limitRes.RetCode == '1') {
        yield put({
          type: 'save',
          payload: {
            deptBudget: limitRes.DataRows,
          }
        })
      }
    },

    // 提交或保存差旅预算
    *projTravelBudgetSaveOrSubmit({ payload }, { call, put, select }) {
      const result = yield call(travelBudgetSaveOrSubmit, payload);
      if(result.RetCode == 1) {
        if(payload.arg_flag == '0') {
          message.success("保存成功");
          const project = yield select(state => state.budgetChangeApply.projInfo);
          yield put({
            type: 'projTravelBudgetQuery',
            payload: {
              arg_proj_id: project.projId,
            }
          });
        }
        if(payload.arg_flag == '1') {
          message.success("提交成功");
          if(payload.pathname === '/projectApp/projMonitor/change/budgetChangeApply') {
            const project = yield select(state => state.budgetChangeApply.projInfo);
            yield put({
              type: 'projTravelBudgetQuery',
              payload: {
                arg_proj_id: project.projId,
              }
            });
          } else if(payload.pathname === '/travelBudgetChangeReturnModify') {
            yield put(routerRedux.push({
              pathname:'/taskList'
            }));
          }

        }
      } else {
        if(payload.arg_flag == '0') {
          message.error("保存失败");
        }
        if(payload.arg_flag == '1') {
          message.error("提交失败");
        }
      }
    },

    // 删除差旅费预算草稿
    *travelBudgetDraftDelete({ payload }, { call, select, put }) {
      const res = yield call(deleteChangeApplyDraft, payload);
      if(res.RetCode == 1) {
        message.success('删除成功');
        const project = yield select(state => state.budgetChangeApply.projInfo);
        yield put({
          type: 'projTravelBudgetQuery',
          payload: {
            arg_proj_id: project.projId,
          }
        });
      } else {
        message.error(res.RetVal);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }){
      return history.listen(({ pathname, query }) => {
          if (pathname === '/projectApp/projMonitor/change/budgetChangeApply'
            || pathname === '/travelBudgetChangeReturnModify'
            || pathname === '/travelBudgetChangeReview/travelBudgetHistory') {
            dispatch({
              type: 'projTravelBudgetQuery',
              payload: query
            });
          }
        });
      },
  },
}
