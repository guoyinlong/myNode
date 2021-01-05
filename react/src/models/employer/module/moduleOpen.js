/**
 * 作者：张楠华
 * 日期：2017-08-28
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现个人考核开放时间逻辑功能
 */
import * as usersService1 from '../../../services/employer/module.js'
import {getToday} from '../../../components/meetSystem/meetConst.js'
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
import message from '../../../components/commonApp/message'

export default {
  namespace: 'moduleOpen',
  state: {
    list: [],
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：返回查询结果到routes层
     */
    save(state, { list: DataRows}) {
      return { ...state, list:DataRows};
    },
  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：初始化查询开放时间展示
     */
    *init({}, { call, put }) {
      const postData = {
        arg_year:new Date().getFullYear().toString(),
        arg_season:Math.floor((new Date().getMonth() + 1 + 2) / 3).toString(),
      };
      const {DataRows} = yield call(usersService1.moduleOpenQuery, postData);
      yield put({
        type: 'save',
        list: DataRows,
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：点击修改实现与后台交互
     * @param value 表格每一行数据
     * @param stageName 指标阶段
     * @param years 选择的年份
     * @param season 选择的月份
     * @param call 调用后台
     * @param put 存放数据
     */
    *updateTime({value,stageName,years,season}, { call, put }) {
      let stageCode;
      if(stageName === '指标添加'){
        stageCode = 100;
      }if(stageName === '指标审核'){
        stageCode = 200;
      }if(stageName === '指标评价'){
        stageCode = 300;
      }
      const postData = {
        arg_startTime:value.beginTime.format(dateFormat),
        arg_endTime:value.endTime.format(dateFormat),
        arg_stageCode:stageCode,
        arg_season:season,
        arg_year:years,
      };
      if(value.beginTime&&value.endTime&&value.beginTime.format(dateFormat)<value.endTime.format(dateFormat)){
        yield call(usersService1.moduleOpenModify, postData);
      }
      const postData1 = {
        arg_year:years,
        arg_season:season,
      };
      const {DataRows} = yield call(usersService1.moduleOpenQuery, postData1);
        yield put({
          type: 'save',
          list: DataRows,
        });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：点击查询实现后台交互
     * @param year_type 选择的年份
     * @param season_type 选择的月份
     * @param call 调用后台
     * @param put 存放数据
     */
    *queryState({year_type,season_type},{call,put}){
      const postDate = {
        arg_year:year_type,
        arg_season:season_type,
      };
       const data = yield call(usersService1.moduleOpenQuery,postDate);
       yield put({
         type: 'save',
         list: data.DataRows,
       })
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-08-28
     * 功能：点击新增实现后台交互
     * @param value 表格每一行数据
     * @param year_type 选择的年份
     * @param season_type 选择的月份
     * @param call 调用后台
     * @param put 存放数据
     */
    *examPhaseAdd({values,year_type,season_type},{call,put}){
      if(values.yearType == null || values.seasonType == null || values.examPhase == null){
        message.info("参数不能为空")
      }
      else if(values.beginTime == null || values.endTime == null){
        message.info("时间不能为空");
      }else{
        const postDate = {
          arg_year:values.yearType,
          arg_season:values.seasonType,
          arg_stageCode:values.examPhase,
          arg_startTime:values.beginTime.format(dateFormat),
          arg_endTime:values.endTime.format(dateFormat),
        };
        const data = yield call(usersService1.moduleOpenAdd,postDate);
        if(data.RetCode === "2"){
          message.info("新增考核季度已存在，不能重复添加");
        }
        const postData1 = {
          arg_year:year_type,
          arg_season:season_type,
        };
        const {DataRows} = yield call(usersService1.moduleOpenQuery, postData1);
        yield put({
          type: 'save',
          list: DataRows,
        })
      }
    },
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-08-28
   * 功能：监听路径
   */
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/employer/open') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
