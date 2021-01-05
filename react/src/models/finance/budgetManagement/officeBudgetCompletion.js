/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：办公室归口费用
 */
import * as budgeManage from '../../../services/finance/budgeManageZ';
import Cookie from 'js-cookie';
import { message } from 'antd';

export default {
  namespace: 'officeBudgetCompletion',
  state: {
    data:[],
    ouList:[],
    deptList:[],
    checkList:[],
    dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
    titleList:[],
    ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
    deptFlag:true,
    deptInfoOnlyOne:'全部',
    editionInfo:'1',
    monthlyBudgetImplementData : [],
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
        data: [],
        ouList:[],
        deptList:[],
        checkList:[],
        titleList:[],
        dateInfo:new Date().getFullYear() + '-' + (new Date().getMonth()+1),
        ouInfo:Cookie.get('OUID')+'-'+Cookie.get('OU'),
        deptFlag:true,
        deptInfoOnlyOne:'全部',
        editionInfo:'1',
        monthlyBudgetImplementData : [],
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
      let { tenantid, ouInfo } = yield select(state => state.officeBudgetCompletion);
      let postData={};
      postData["argtenantid"] = tenantid;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = '/office_budget_completion';
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
    *onChangeEditionInfo({editionInfo},{put}){
      yield put({
        type: 'save',
        payload:{
          editionInfo,
        }
      });
    },
    *queryData({}, { call, put, select }){
      let { dateInfo, ouInfo,  editionInfo } = yield select(state => state.officeBudgetCompletion);
      let formData = {};
      formData['arg_total_year'] = dateInfo.split("-")[0];
      formData['arg_total_month'] = dateInfo.split("-")[1];
      formData['arg_ou'] = ouInfo==='联通软件研究院'?'':ouInfo.split("-")[1];
      formData['arg_total_type'] = editionInfo;//arg_total_type：1、月统计；2、年统计
      const data = yield call(budgeManage.queryOfficeBudget,formData);
      if (data.RetCode === '1'){
        let titleList = [];
        for(let item in JSON.parse(data.TitleName)){
          titleList.push({
            id:item,
            name:JSON.parse(data.TitleName)[item],
          })
        }
        //手动给每一个list一个key，不然表格数据会报错
        data.DataRows.map((i, index) => {
          i.key = index;
        });
        //处理每条数据
        for (let i = 0;i < data.DataRows.length; i++){
          for(let item in JSON.parse(data.DataRows[i].dept_total_cost)){
            data.DataRows[i][item] = JSON.parse(data.DataRows[i].dept_total_cost)[item];
          }
        }
        yield put({
          type: 'save',
          payload:{
            titleList: titleList,
            data: data.DataRows,
          }
        });
      }else{
        message.error(data.RetVal);
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/budget_management/office_budget_completion') {
          dispatch({ type: 'init',query });
          dispatch({type:'initData'});
        }
      });
    },
  },
};
