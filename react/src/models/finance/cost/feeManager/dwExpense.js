/*/**
 * 作者：贾茹
 * 创建日期：2019-5-9
 * 邮箱：m18311475903@163.com
 * 文件说明：报账系统
 */

import moment from 'moment/moment';
import Cookie from 'js-cookie';
import * as dwRequestService from '../../../../services/finance/dwRequestService';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'dwExpense',
  state: {
    yearmoment: moment(),
    list:[],
    pros:[],
    OUnamecodes: [],
    OU: Cookie.get('OU'),
    OUCode:'',
    type:'员工报账单',
    claimNoData:'',
    deptNameData:'',
    tableDataSource: [],
    pageCurrent: '', // 页号
    pageDataCount:'',
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
              yearmoment: moment(),
              list:[],
              pros:[],
              OUnamecodes: [],
              OU: Cookie.get('OU'),
              OUCode:'',
              type:'员工报账单',
              claimNoData:'',
              deptNameData:'',
              tableDataSource: [],
              pageCurrent: '1', // 页号
              pageDataCount:'',
            },
          });
          yield put({
            type: 'handleOUname',
          });
    },
    //查询项目名称服务
    * handleProname({}, {call, select, put}){
          /* debugger;*/
          /*const {OUnamecodes} = yield select(state => state.dwErp);*/
          const response = yield call(dwRequestService.dwErphandleProName);
          /*  console.log(response);*/
          if (response.RetCode === '1') {
            const pros = response.DataRows;
            for (let i = 0, j = pros.length; i < j; i++) {
              /* console.log(OUs[i]);*/
              pros[i].key = i.toString();
              /*OUnamecodes.push(OUs[i]);*/
            }
            yield put({
              type: 'save',
              payload: {
                // 把数据通过save函数存入state
                pros: pros,
              },

            });
            /*console.log(OUnamecodes);*/
          }
    },

    //查询OU主建单位服务
    * handleOUname({}, {call, select, put}){
      /*debugger;*/
      const { OU } = yield select(state => state.dwExpense);
      const response = yield call(dwRequestService.dwErp);
      /*console.log(response);*/
      if (response.RetCode === '1') {
        const OUs = response.DataRows;
        let OUCode = '';
        for( let i=0;i<OUs.length;i++){
          if(OU === OUs[i].ou_name){
            OUCode = OUs[i].ou_code;
          }
        /*  console.log(OUCode);*/
        }
        /*console.log(OUCode);*/
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

    //点击OU改变
    * handleOUChange({ value }, { call, select, put }){
      /*console.log(value);*/
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
    },

    //点击类别改变
    * handleTypeChange({ value }, { call, select, put }){
      yield put({
        type: 'save',
        payload: {
          type: value,
        },
      });
    },

    //获得用户输入的报账单编号的值
    * claimNoDataChange({value}, {call, select,put}){
      yield put({
        type: 'save',
        payload: {
          claimNoData: value,
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

     //查询表格数据
    * handleTableData({}, {call, select,put}){
        const {yearmoment,OUCode, type, claimNoData, deptNameData, pageCurrent} = yield select(state => state.dwExpense);
        yield put({
          type: 'save',
          payload: {
            loading:true
          },
        });
           let oDate=new Date(yearmoment);
           let yearData = oDate.getFullYear();
           let monthData = oDate.getMonth() + 1;
           /*console.log(monthData);*/
         /*  console.log(OUCode);*/
           const recdata = {
             arg_type: type,
             arg_year: yearData,
             arg_month: monthData,
             arg_ou: OUCode,
             arg_claim_no: claimNoData,
             arg_dept_name: deptNameData,
             arg_page_num: pageCurrent,
             arg_page_size:'10',
           };
           const recdatas = yield call(dwRequestService.dwExpenseTableData, recdata);
           if (recdatas.RetCode === '1') {
             const res = recdatas.DataRows;
           /*  console.log(res);*/
            for (let i = 0, j = res.length; i < j; i++) {
             /*console.log(OUs[i]);*/
               res[i].key = i;
             }
            /* console.log(res);*/
             yield put({
               type: 'save',
               payload: {
                 // 把数据通过save函数存入state
                 tableDataSource: res,
                 pageDataCount: recdatas.RowCount,
                 loading:false,
               },

             });
           }

         },

    // 选择页面
    * handlePageChange({ page }, { call, put, select }) {
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
    * searchClear({}, { call, put, select }) {
        yield put({
          type: "save",
          payload: {
            claimNoData:'',
            deptNameData:'',
            pageCurrent: "1", // 页号
          }
        });
        yield put({
          type: "handleTableData"
        });
    },

    //修改条件之后点击查询页码默认为1
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
        if (pathname === '/financeApp/dw_db/dw_expense_system') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
