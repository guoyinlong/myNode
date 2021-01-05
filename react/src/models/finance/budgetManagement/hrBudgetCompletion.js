/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：办公室归口费用
 */
import * as budgeManage from '../../../services/finance/budgeManageZ';
import Cookie from 'js-cookie';
import { message } from 'antd';
function MergeCells (list,mergeCell,key){
  let rowSpanNum = 1;
  let rowSpanArray = [];
  for(let i=1;i<list.length;i++){
    if(list[i][mergeCell] !== list[i-1][mergeCell]){
      rowSpanArray.push(rowSpanNum);
      rowSpanNum = 1;
      if(i===list.length-1){
        rowSpanArray.push(1);
      }
    }else{
      rowSpanNum++;
      if(i===list.length-1 && list[i][mergeCell] === list[i-1][mergeCell]){
        rowSpanArray.push(rowSpanNum);
      }
    }
  }
  //部门合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
  for(let i=1;i<list.length;i++){
    list[0][key] = null;
    if(list[i][mergeCell] === list[i-1][mergeCell]){
      list[i][key] = 0;
    }else{
      list[i][key] = null;
    }
  }
  let j=0;
  for(let i=0;i<list.length;i++){
    if(list[i][key] === null){
      list[i][key] = rowSpanArray[j];
      j++;
    }
  }
}

export default {
  namespace: 'hrBudgetCompletion',
  state: {
    rawData:[],
    ouList:[],
    deptList:[],
    checkList:[],
    dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
    ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
    deptFlag:true,
    deptInfoOnlyOne:'全部',
    editionInfo:'1',
    monthlyBudgetImplementData : [],
    titleList:[],
    tenantid:Cookie.get('tenantid'),
    userid:Cookie.get('userid'),
    deptName:[{
      dept_id:Cookie.get('dept_id'),
      dept_name:Cookie.get('dept_name'),
    }],
    roleFlag:true,
  },

  reducers: {
    initData(state){
      return {
        ...state,
        rawData:[],
        ouList:[],
        deptList:[],
        checkList:[],
        dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
        ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        deptFlag:true,
        deptInfoOnlyOne:'全部',
        editionInfo:'1',
        monthlyBudgetImplementData : [],
        titleList:[],
        tenantid:Cookie.get('tenantid'),
        userid:Cookie.get('userid'),
        deptName:[{
          dept_id:Cookie.get('dept_id'),
          dept_name:Cookie.get('dept_name'),
        }],
        roleFlag:true,
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      yield put({
        type: 'save',
        payload:{
          ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        }
      });
      yield put({
        type: 'getOU',
        flag:'1',
      });
    },
    *getOU({flag}, { call, put, select }){
      let { tenantid, ouInfo } = yield select(state => state.hrBudgetCompletion);
      let postData={};
      postData["argtenantid"] = tenantid;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/hr_budget_completion';
      const moduleIdData= yield call(budgeManage.costUserHasModule, postData);
      if (moduleIdData.RetCode==='1'){
        let moduleId = moduleIdData.moduleid;
        let postData1 = {};
        postData1["argtenantid"] = tenantid;
        postData1["arguserid"] = localStorage.userid;
        postData1['argmoduleid'] = moduleId;
        postData1["argvgtype"] = '2';//全成本选择OU

        const data= yield call(budgeManage.costUserGetOU, postData1);
        if (data.RetCode==='1'){
          if (data.RowCount === '0'){
            let list = [];
            list.push({
              dept_id:ouInfo.split('-')[0],
              dept_name:ouInfo.split('-')[1],
            });
            yield put({
              type: 'save',
              payload:{
                ouList : list,
              }
            });
          }else{
            yield put({
              type: 'save',
              payload:{
                ouList : data.DataRows,
              }
            });
          }
          if (flag ==='1'){
            yield put({
              type: 'queryData',
            });
          }
        }else{
          message.error(data.RetVal);
        }
      }else{
        message.error(moduleIdData.RetVal);
      }
    },

    *onChangeDatePicker({dateInfo},{put}){
      yield put({
        type: 'save',
        payload:{
          dateInfo,
        }
      });
    },
    *onChangeOu({ou},{put}){
      yield put({
        type: 'save',
        payload:{
          ouInfo:ou,
        }
      });

    },
    *onChangeDept({dept},{put}){
      yield put({
        type: 'save',
        payload:{
          deptInfoOnlyOne:dept,
        }
      });
    },
    *onChangeEditionInfo({editionInfo},{put}){
      yield put({
        type: 'save',
        payload:{
          editionInfo,
        }
      });
    },
    *queryData({}, { call, put, select }){
      let { dateInfo } = yield select(state => state.hrBudgetCompletion);
      let formData = {};
      formData['arg_total_year'] = dateInfo.split("-")[0];
      formData['arg_total_month'] = dateInfo.split("-")[1];
      const data = yield call(budgeManage.queryHrBudget,formData);
      if (data.RetCode === '1'){
        if (data.DataRows&&data.DataRows1){
          let titleList = [];
          for(let item in JSON.parse(data.TitleName)){
            titleList.push({
              id:item,
              name:JSON.parse(data.TitleName)[item],
            })
          }

          //处理每条数据
          for (let i = 0;i<data.DataRows.length;i++){
            for(let item in JSON.parse(data.DataRows[i].all_budget_cost)){
              data.DataRows[i][item] = JSON.parse(data.DataRows[i].all_budget_cost)[item];
            }
            data.DataRows[i]['type'] = '预算完成情况';
            if (i === 0){
              data.DataRows[i]['dept_name'] = '预算';
            }else{
              data.DataRows[i]['dept_name'] = '执行数';
            }

          }
          if (data.DataRows.length === 2){
            data.DataRows.push({
              'type':'预算完成情况',
              'dept_name':'预算完成率',
            })
            for(let item in JSON.parse(data.DataRows[0].all_budget_cost)){
              if (JSON.parse(data.DataRows[0].all_budget_cost)[item]===''||JSON.parse(data.DataRows[0].all_budget_cost)[item]==='0'){
                data.DataRows[data.DataRows.length-1][item] = '-';
              }else{
                if (parseFloat(JSON.parse(data.DataRows[1].all_budget_cost)[item])/parseFloat(JSON.parse(data.DataRows[0].all_budget_cost)[item])===0){
                  data.DataRows[data.DataRows.length-1][item] = '-';
                }else{
                  data.DataRows[data.DataRows.length-1][item] = parseFloat(parseFloat(JSON.parse(data.DataRows[1].all_budget_cost)[item])/parseFloat(JSON.parse(data.DataRows[0].all_budget_cost)[item])*100).toFixed(2).toString() + '%';
                }
              }
            }
          }
          for (let i = 0;i < data.DataRows1.length; i++){
            if (data.DataRows1[i].dept_cost){
              for(let item in JSON.parse(data.DataRows1[i].dept_cost)){
                data.DataRows1[i][item] = JSON.parse(data.DataRows1[i].dept_cost)[item];
              }
            }
            data.DataRows1[i]['type'] = '费用发生部门';
          }
          let rawData = [];
          rawData = data.DataRows.concat(data.DataRows1);
          //手动给每一个list一个key，不然表格数据会报错
          rawData.map((i, index) => {
            i.key = index;
          });
          MergeCells(rawData, 'type','1');
          yield put({
            type: 'save',
            payload:{
              rawData:rawData,
              titleList:titleList,
            }
          });
        }else{
          yield put({
            type: 'save',
            payload:{
              rawData:[],
              titleList:[],
            }
          });
        }
      }else{
        message.error(data.RetVal);
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/budget_management/hr_budget_completion') {
          dispatch({ type: 'init',query });
          dispatch({type:'initData'});
        }
      });
    },
  },
};
