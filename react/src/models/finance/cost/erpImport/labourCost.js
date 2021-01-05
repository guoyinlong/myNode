/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现人工成本导入
 */
import * as costService from '../../../../services/finance/costService';
import * as costOtherService from '../../../../services/finance/fundingPlanSRS';
import config  from '../../../../utils/config';
import moment from 'moment';
import {message} from 'antd';
import cookies from 'js-cookie'
export default {
  namespace: 'labourCost',
  state: {
    list:[],
    ouList:[],
    titleName:'',
    listPre:[],
    titleNamePre:'',
    yearMonth:moment()
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        list:[],
        ouList:[],
        titleName:'',
        listPre:[],
        titleNamePre:'',
        yearMonth:moment()
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      let postData={};
      postData["argtenantid"] = config.COST_TENANT_ID;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] =  '/labour_cost_maintain';
      //postData["argrouterurl"] =  '/straight_cost_mgt';
      const moduleIdData= yield call(costService.costUserHasModule, postData);
      if(moduleIdData.RetCode === '1'){
        let postData1 = {};
        postData1["argtenantid"] = config.COST_TENANT_ID;
        postData1["arguserid"] = localStorage.userid;
        postData1['argmoduleid'] = moduleIdData.moduleid;
        postData1["argvgtype"] = config.COST_OU_VGTYPE;
        const data= yield call(costService.costUserGetOU, postData1);
        if(data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              ouList:data.DataRows
            }
          });
          const month= yield call(costService.getMonth,{argou:cookies.get('OU')});
          let yearMonthData = '';
          //如果大于12月，年加1，月变为1月
          if(parseInt(month.DataRows[0].total_month)+1 > 12){
            yearMonthData=(parseInt(month.DataRows[0].total_year)+1)+'-01';
          }
          //如果大于等于10,
          else if(parseInt(month.DataRows[0].total_month)+1>=10){
            yearMonthData=month.DataRows[0].total_year + '-'+(parseInt(month.DataRows[0].total_month)+1)
          }
          //其他情况
          else{
            yearMonthData=month.DataRows[0].total_year + '-0'+(parseInt(month.DataRows[0].total_month)+1)
          }
          //let mon = parseInt(month.DataRows[0].total_month)+1>=10?''+(parseInt(month.DataRows[0].total_month)+1):'0'+(parseInt(month.DataRows[0].total_month)+1);
          yield put({
            type: 'queryLabourData',
            yearMonth:moment(yearMonthData,'YYYY-MM'),
            ou:localStorage.ou
          });
          yield put({
            type:'save',
            payload:{
              yearMonth:moment(yearMonthData,'YYYY-MM'),
            }
          })
        }
      }
    },
    *saveMonth({ yearMonth }, { put }) {
      yield put({
        type: 'save',
        payload:{
          yearMonth,
        }
      });
    },
    *queryLabourData({ yearMonth ,ou }, { call, put }) {
      let postData={};
      postData["arg_total_year"] = yearMonth.format('YYYY-MM').split('-')[0];
      postData["arg_total_month"] = yearMonth.format('YYYY-MM').split('-')[1];
      postData["arg_ou"] = ou;
      const listData= yield call(costOtherService.queryLabourData, postData);
      if(listData.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list:listData.DataRows,
          }
        });
      }
    },

    * importLabourCost({response}, { put }) {
      if (response.RetCode === '1') {
        yield put({
          type: 'save',
          payload:{
            listPre:response.DataRows,
            listPreImp:JSON.parse(JSON.stringify(response.DataRows)),
            titleNamePre : response.TitleName.split(','),
          }
        });
      }
    },
    * generateLabourCost({yearMonth,ou}, {call, put, select}) {
      let { listPreImp } = yield select(state => state.labourCost);
      let postData = {};
      postData['arg_total_year'] = yearMonth.format('YYYY-MM').split('-')[0];
      postData['arg_total_month'] = yearMonth.format('YYYY-MM').split('-')[1];
      postData['arg_ou'] = ou;
      postData['arg_userid'] = localStorage.userid;
      postData['arg_data'] = JSON.stringify(listPreImp);
      const data = yield call(costOtherService.generateLabourCost, postData);
      if (data.RetCode === '1') {
        message.info('生成成功！');
        yield put({
          type: 'queryLabourData',
          yearMonth: yearMonth,
          ou
        })
      }
    },
    * cancelData({yearMonth,ou}, {call, put}) {
      let postData = {};
      postData['arg_total_year'] = yearMonth.format('YYYY-MM').split('-')[0];
      postData['arg_total_month'] = yearMonth.format('YYYY-MM').split('-')[1];
      postData['arg_ou'] = ou;
      const data = yield call(costOtherService.cancelData, postData);
      if (data.RetCode === '1') {
        message.info('撤销成功！');
        yield put({
          type: 'queryLabourData',
          yearMonth: yearMonth,
          ou
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_erp_fileupload/labour_cost_maintain') {
          dispatch({ type: 'init',query });
          dispatch({type: 'initData'});
        }
      });
    },
  },
};
