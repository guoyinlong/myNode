/**
 * 作者：张楠华
 * 日期：2017-09-18
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核结果逻辑
 */
import * as usersService from '../../../services/employer/statistic.js'
import {getToday} from '../../../components/meetSystem/meetConst.js'
import {TENANT_ID} from '../../../utils/config'
import message from '../../../components/commonApp/message'
export default {
  namespace: 'statistic',
  state: {
    list: [],
    valueList:[],
    checkList:[],
    query:{},
    ischeck:1,
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-09-18
   * 功能：保存多项数据
   */
  reducers: {
    save(state, { list: DataRows,ischeck:ischeck,valueList:valueList,checkList:checkList}) {
      return { ...state, list:DataRows,ischeck:ischeck,valueList:valueList,checkList:checkList};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-18
     * 功能：保存多项数据
     */
    valuesave(state, { valueList: DataRows,ischeck:ischeck,checkList:checkList}) {
      return { ...state, valueList:DataRows, ischeck:ischeck,checkList:checkList};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-18
     * 功能：保存多项数据
     */
    checksave(state, { checkList: DataRows,ischeck:ischeck,valueList:valueList}) {
      return { ...state, checkList:DataRows, ischeck:ischeck,valueList:valueList};
    },
  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-09-18
     * 功能：初始查询，查询部门和默认的checkList
     */
    *initListSearch({}, { call, put }) {
      const postData={
        arg_tenantid:TENANT_ID,
      };
      const data = yield call(usersService.initOuSearch, postData);
      const postData1={
        arg_ou:localStorage.ou,
        arg_season:Math.floor((new Date().getMonth()+1 + 2) / 3).toString(),
        arg_tenantid:TENANT_ID,
        arg_years:new Date().getFullYear().toString()
      };
      const data1 = yield call(usersService.searchCkeckList, postData1);
      if(data==null||data.RetCode!=1){
        message.info("查询组织单元信息失败！")
      }else{
        yield put({
          type: 'save',
          list: data.DataRows,
          valueList:[],
          checkList:data1.DataRows,
          ischeck:1
        });
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-18
     * 功能：状态查询，arg_index_type=1为指标填报，arg_index_type=2为指标评价，返回时其他数据清空。
     * @param arg_company_type 部门信息
     * @param arg_year_type 年度信息
     * @param arg_season_type 季度
     * @param call 后台调用
     * @param put 存参
     */
    *valueState({arg_company_type=0, arg_year_type=0, arg_season_type=0}, { call, put }) {
      const postData={
        arg_ou:arg_company_type,
        arg_season:arg_season_type,
        arg_tenantid:TENANT_ID,
        arg_years:arg_year_type,
      };
        const data = yield call(usersService.searchValueList, postData);
        if(data == null || data.RetCode != '1'){
          message.info('指标评价情况查询失败！');
        }else{
          yield put({
            type: 'valuesave',
            valueList: data.DataRows,
            checkList:[],
            ischeck:0,
          });
        }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-18
     * 功能：状态查询，指标填报
     * @param arg_company_type 部门信息
     * @param arg_year_type 年度信息
     * @param arg_season_type 季度
     * @param call 后台调用
     * @param put 存参
     */
    *checkState({arg_company_type=0,arg_year_type=0, arg_season_type=0}, { call, put }) {
      const postData={
        arg_ou:arg_company_type,
        arg_season:arg_season_type,
        arg_tenantid:TENANT_ID,
        arg_years:arg_year_type,
      };
      const data = yield call(usersService.searchCkeckList, postData);
      if(data == null || data.RetCode != '1'){
        message.info('指标填报情况查询失败！');
      }else{
        yield put({
          type: 'checksave',
          checkList: data.DataRows,
          valueList:[],
          ischeck:1,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/employer/state') {
          dispatch({ type: 'initListSearch',query });
        }
      });
    },
  },
};
