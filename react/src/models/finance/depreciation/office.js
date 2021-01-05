/**
 * 作者：张楠华
 * 日期：2019-7-15
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：折旧分摊办公软件
 */
import { message } from 'antd';
import * as depreciationService from './../../../services/finance/depreciationService';
import cookies from 'js-cookie';
import moment from 'moment';
import Cookies from "js-cookie";
moment.locale('zh-cn');
export default {
  namespace: 'office',
  state: {
    list:[],
    yearMonth:moment(),
    ouList:[],
    ou:cookies.get('OU'),
    objScroll:150*15,
    remark:'',//备注

    activityKey:'1',
    importList:[],
    importObjScroll:150*64,
    pms_code: '',
    pms_name: '',
    proj_type: '1',
    genDataLoadings:false,
    all_count:''
  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        yearMonth:moment(),
        ouList:[],
        ou:cookies.get('OU'),
        objScroll:150*15,
        remark:'',//备注

        activityKey:'1',
        importList:[],
        importObjScroll:150*64,
        pms_code: '',
        pms_name: '',
        proj_type: '1',
        genDataLoadings:false,
        all_count:''
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    * changeState({ arg }, { put,select }) {
      const { activityKey } = yield select(state=>state.office);
      let temp={};
      if(arg.length%2 !==0) return message.info('参数传递错误');
      for(let i=0;i<arg.length;i=i+2){
        temp[arg[i+1]] = arg[i]
      }
      yield put({
        type:'save',
        payload :temp
      });
      yield put({
        type: 'save',
        payload: {
          proj_type: '1',
          pms_code : '',
          pms_name: ''
        }
      })
      if(activityKey === '1'){
        yield put({
          type: 'queryImport',
        });
      }else{
        yield put({
          type: 'queryItOfficeData',
        });
      }
    },
    *init({}, {  put,call }) {
      const obj = {
        argtenantid: Cookies.get('tenantid'),
        argrouterurl: '/office_software',
        arguserid: Cookies.get('userid')
      }
      const data1 = yield call(depreciationService.p_userhasmodule,obj)
      if (data1.RetCode === '1'){
        const { moduleid } = data1
        const obj1 = {
          argtenantid: Cookies.get('tenantid'),
          arguserid: Cookies.get('userid'),
          argmoduleid: moduleid,
          argvgtype: '2'
        }
        const data2 = yield call(depreciationService.p_usergetouordeptinmodule,obj1)
        if (data2.RetCode === '1'){
          if (data2.DataRows.length) {
              yield put({ type: 'save', payload: { ouList: data2.DataRows} })
          }
        }
      }
      // const data = yield call(depreciationService.getOu);
      // if(data.RetCode === '1'){
      //   yield put({
      //     type:'save',
      //     payload :{
      //       ouList:data.DataRows,
      //     }
      //   });
      //   yield put({
      //     type: 'queryImport',
      //   });
      // }

    },
    * query_condition_pms_code({pms_code},{call, put, select}){
      yield put({
        type: 'save',
        payload: {
          pms_code
        }
      })
    },
    * query_condition_pms_name({pms_name},{call, put, select}){
      yield put({
        type: 'save',
        payload: {
          pms_name
        }
      })
    },
    *queryImport({}, { call, put,select }) {
      yield put({
        type: 'save',
        payload:{
          activityKey:'1',
          loading:true,
        }
      });
      const { yearMonth,ou } = yield select(state=>state.office);
      let postData = {};
      postData['arg_ou_name'] = ou;
      postData['arg_year'] = yearMonth.format('YYYY-MM').split('-')[0];
      postData['arg_month'] = yearMonth.format('YYYY-MM').split('-')[1];
      postData['arg_user_id'] = cookies.get('userid');
      postData['arg_user_name'] = cookies.get('username');
      const data = yield call(depreciationService.queryImportOffice,postData);
      if (data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            importList:data.DataRows,
            importObjScroll:150*64,
          }
        });
      }else {
        message.info(data.RetVal);
      }
      yield put({
        type: 'save',
        payload:{
          loading:false,
        }
      });
    },
    *queryItOfficeData({}, { call, put,select }) {
      const { yearMonth,ou,pms_code,pms_name,proj_type } = yield select(state=>state.office);
      let postData = {};
      postData['arg_ou_name'] = ou;
      postData['arg_year'] = yearMonth.format('YYYY-MM').split('-')[0];
      postData['arg_month'] = yearMonth.format('YYYY-MM').split('-')[1];
      postData['arg_pms_code']  = pms_code
      postData['arg_pms_name']  = pms_name
      postData['arg_total_type'] = proj_type
      // postData['arg_userid'] = cookies.get('userid');
      // postData['arg_username'] = cookies.get('username');
      yield put({
        type: 'save',
        payload:{
          loading:true,
          activityKey:'2'
        }
      });
      const data = yield call(depreciationService.queryOfficeData,postData);
      if (data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            all_count:data.RowCount,
            list:data.DataRows,
            remark:data.end_time,//备注
            objScroll:150*15,
          }
        });
      }else {
        message.info(data.RetVal);
      }
      yield put({
        type: 'save',
        payload:{
          loading:false,
        }
      });
    },
    * proj_type_change({arg_total_type},{put,call,select}){
      yield put({
        type: 'save',
        payload: {
          proj_type : arg_total_type,
          pms_name:'',
          pms_code:''
        }
      })
      yield put({
        type:'queryItOfficeData'
      })
    },
    //导入成功直接调用查询
    *genData({}, { put,call,select }) {
      const { yearMonth,ou,proj_type } = yield select(state=>state.office);
      yield put({
        type: 'save',
        payload: {
          genDataLoadings: true
        }
      })
      let postData = {};
      postData['arg_this_year'] = yearMonth.format('YYYY-MM').split('-')[0];
      postData['arg_this_month'] = yearMonth.format('YYYY-MM').split('-')[1];
      postData['arg_begin_time'] = yearMonth.format('YYYY-MM')+'-01';//开始时间暂时未这个月的第一天
      postData['arg_end_time'] = yearMonth.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") ? yearMonth.format("YYYY-MM-DD"):yearMonth.endOf('month').format("YYYY-MM-DD");//本月最后一天
      postData['arg_user_id'] = cookies.get('userid');
      postData['arg_user_name'] = cookies.get('username');
      postData['arg_staff_ou'] = ou;
      postData['arg_total_type']=proj_type
      //postData['arg_ou_code'] = ouList.length && ouList.find(i=>i.ou_name === ou ).hasOwnProperty('ou_code')?ouList.find(i=>i.ou_name === ou ).ou_code:'';
      //第一个服务第二个插入表，第三个生成.
      const data = yield call(depreciationService.importGenOfficeData,postData);
      if (data.RetCode === '1'){
          message.info('成功生成数据！');
          yield put({
            type: 'queryItOfficeData',
          });
      }else {
        message.info(data.RetVal);
      }
      yield put({
        type: 'save',
        payload: {
          genDataLoadings: false
        }
      })
    },
    *delData({}, { call, put,select }) {
      const { yearMonth,ou,proj_type } = yield select(state=>state.office);
      let postData = {};
      postData['arg_year'] = yearMonth.format('YYYY-MM').split('-')[0];
      postData['arg_month'] = yearMonth.format('YYYY-MM').split('-')[1];
      postData['arg_user_id'] = cookies.get('userid');
      postData['arg_ou_name'] = ou;
      postData['arg_total_type']=proj_type
      const data = yield call(depreciationService.delOfficeData,postData);
      if (data.RetCode === '1'){
        message.info('撤销成功！');
        yield put({
          type: 'queryItOfficeData',
        });
      }else {
        message.info(data.RetVal);
      }
    },
    *amortize_office_equipment_update({query},{put,call}){
      const data = yield call(depreciationService.amortize_office_equipment_update,query)
      if (data.RetCode === '1'){
        yield put({
          type:'queryItOfficeData'
        })
        message.info('修改成功')
      }else{
       message.info(data.RetVal)
      }},
    *amortize_office_equipment_truncate({query},{put,call}){
      const data = yield call(depreciationService.amortize_office_equipment_truncate,query)
      if (data.RetCode === '1'){
        yield put({
          type:'queryItOfficeData'
        })
        message.info('删除成功')
      }else {
        message.info(data.RetVal)
      }
    },
    *amortize_asset_detail_report_update({query},{put,call}){
      const data = yield call(depreciationService.amortize_asset_detail_report_update,query)
      if (data.RetCode === '1'){
        yield put({
          type:'queryItOfficeData'
        })
        message.info('修改成功')
      }else{
        message.info(data.RetVal)
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/amortize/office_software') {
          dispatch({ type: 'initData',query });
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
