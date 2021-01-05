/**
 * 作者：贾茹
 * 创建日期：2019-5-9
 * 邮箱：m18311475903@163.com
 * 文件说明：ERP核心库
 */

import moment from 'moment/moment';
import Cookie from 'js-cookie';
import * as dwRequestService from '../../../../services/finance/dwRequestService';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default {
  namespace: 'dwErp',
  state: {
    list:[],
    projs: [],
    OUnamecodes: [],
    yearmoment: moment(),
    OU: Cookie.get('OU'),
    OUCode:'',
    vouchernoData:'',
    kemuData:'',
    deptNameData:'',
    proj: '',
    tableDataSource: [],
    pageCurrent: "", // 页号
    pageDataCount:"", //总页数
  },

  reducers: {
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    * init({}, { call, select, put }) {
      yield put({
        type: 'save',
        payload: {
         /* pickYear: moment().format('YYYY'),*/
          list:[],
          projs: [],
          OUnamecodes: [],
          yearmoment: moment(),
          OU: Cookie.get('OU'),
          OUCode:'',
          vouchernoData:'',
          kemuData:'',
          deptNameData:'',
          proj: '',
          pageCurrent: '1', // 页号
          pageDataCount:'',

        },
      });
      yield put({
          type: 'handleOUname',
        });
      yield put({
        type: 'handleProname',
      });
     /* yield put({
        type: 'handleTableData',
      });*/
    },
    //查询OU主建单位服务
    * handleOUname({}, {call, select, put}){
      /*debugger;*/
      const { OU } = yield select(state => state.dwErp);
      const response = yield call(dwRequestService.dwErp);
      /*console.log(response);*/
      if (response.RetCode === '1') {
        const OUs = response.DataRows;
        let OUCode = '';
        for( let i=0;i<OUs.length;i++){
          if(OU === OUs[i].ou_name){
            OUCode = OUs[i].ou_code;
          }
        }
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            OUnamecodes: OUs,
            OUCode:OUCode,
          },

        });
      }
      yield put({
        type: 'handleTableData',
      });
    },

    //根据年份显示项目名称
    * handleProname({}, {call, select, put}){
       /* debugger;*/
        const {yearmoment} = yield select(state => state.dwErp);
        let oDate=new Date(yearmoment);
      /*  console.log(oDate.getFullYear());*/
        let yearData = oDate.getFullYear();
        /*console.log(yearData);*/
        const recData = {
          arg_year: yearData,
        };
        const response = yield call(dwRequestService.dwErphandleProName,recData );
        /*console.log(response);*/
        if (response.RetCode === '1') {
            const pros = response.DataRows;
          yield put({
            type: 'save',
            payload: {
              // 把数据通过save函数存入state
              projs: pros,
              proj:'',
            },

          });
      }
       /* console.log(projs);*/
    },

    //查询表格数据
    * handleTableData({}, {call, select,put}){
      const {yearmoment,OUCode, vouchernoData, kemuData, deptNameData, proj, pageCurrent } = yield select(state => state.dwErp);
      let oDate=new Date(yearmoment);
      let yearData = oDate.getFullYear();
      let monthData = oDate.getMonth() + 1;
      /* console.log(monthData);*/
     /* console.log(OUCode);*/
      const recdata = {
        arg_year: yearData,
        arg_month: monthData,
        arg_ou: OUCode,
        arg_je_seq_num: vouchernoData,
        arg_fee_code: kemuData,
        arg_dept_name: deptNameData,
        arg_proj_code:  proj,
        arg_page_num: pageCurrent,
        arg_page_size:'10',
      };
      yield put({
        type: 'save',
        payload: {
          loading:true
        },
      });
      const recdatas = yield call(dwRequestService.dwErpTableData, recdata);
      if (recdatas.RetCode === '1') {
        const res = recdatas.DataRows;
         /*console.log(res);*/
        for (let i = 0, j = res.length; i < j; i++) {
          /* console.log(OUs[i]);*/
          res[i].key = i;

        }
       /* console.log(res);*/
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            tableDataSource: res,
            pageDataCount: recdatas.RowCount,
            loading:false

          },

        });
      }

    },

    //点击OU改变
    * handleOUChange({ value }, { call, select, put }){
       /* console.log(value);*/
        yield put({
          type: 'save',
          payload: {
            OUCode: value,
          },
        });
    },

    //点击年月改变
    * onChangeYearMoment({ value }, {call, select, put}){
        yield put({
          type: 'save',
          payload: {
            yearmoment: value,
          },
        });
        yield put({
        type: 'handleProname',
      });
    },

    //点击项目改变
    * onChangeProj({value}, {call, select,put}){
        yield put({
          type: 'save',
          payload: {
            proj: value,
          },
        });
    },

    //获得用户输入的凭证编码的值
    * handlevouchernoDataChange({value}, {call, select,put}){
      yield put({
        type: 'save',
        payload: {
          vouchernoData: value,
        },
      });
    },

    //获得用户输入的科目编码的值
    * handlekemuDataChange({value}, {call, select,put}){
      yield put({
        type: 'save',
        payload: {
          kemuData: value,
        },
      });
    },

    //获得用户输入的部门名称的值
    * handledeptNameDataChange({value}, {call, select,put}){
      yield put({
        type: 'save',
        payload: {
          deptNameData: value,
        },
      });
    },

    // 选择页面
    * handlePageChange({ page }, { call, put }) {
        yield put({
          type: "save",
          payload: {
            pageCurrent: page
          }
        });
        yield put({
          type: "handleTableData"
        });

    },

  //点击清空查询条件
    * searchClear({}, { call, put }) {
        yield put({
          type: "save",
          payload: {
            vouchernoData:'',
            kemuData:'',
            deptNameData:'',
            proj: "",
            pageCurrent: "1", // 页号
          /*  yearmoment: moment(),
            OU: Cookie.get('OU'),*/
          }
        });
        yield put({
          type: "handleTableData"
        });
    },

    * handlePageClear({}, { call, put }) {
        yield put({
          type: "save",
          payload: {
            pageCurrent: "1", // 页号
          }
        });
        yield put({
          type: "handleTableData"
        });
    },




  },


  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/dw_db/dw_erp_core') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
