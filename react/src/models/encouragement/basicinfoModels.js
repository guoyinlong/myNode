/**
 * 文件说明：全面激励-首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */
import * as service from '../../services/encouragement/services';
import {message} from "antd";
import Cookie from 'js-cookie'

export default {
  namespace : 'basicinfo',
  state : {
    info:{},
    optionInfo:{},
    template:'',
    talentsList:[],
    performance:[],
    isInternalTrainer: []
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-09-18
     * @param state 初始状态
     * @param infoList
     */
    saveInfoRes(state, {info,year}){
      return {
        ...state,
        info,
        year
      };
    },
    /**
     * 功能：更新状态树
     * 作者：郑宁
     * 邮箱：zhengning@honor-win.cn
     * 创建日期：2020-4-15
     * @param state 初始状态
     * @param talentsList
     */
    saveTalentsList(state,{talentsList}){
      return {
        ...state,
        talentsList
      }
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-09-18
     * @param state 初始状态
     * @param infoList
     */
    saveOptionInfoRes(state, {optionInfo}){
      return {
        ...state,
        optionInfo
      };
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-09-18
     * @param state 初始状态
     * @param infoList
     */
    saveTemplateRes(state, {template}){
      return {
        ...state,
        template
      };
    },
    /**
     * 
     */
    savePerformance(state,{performance}){
      return{
        ...state,
        performance
      }
    },
    /**
     * 功能：更新状态树
     * 作者：郑宁
     * 邮箱：zhengning@honor-win.cn
     * 日期：2020-05-18
     * @param {*} state 
     * @param {*} param1 
     */
    saveInternalTrainer(state,{isInternalTrainer}){
      return{
        ...state,
        isInternalTrainer
      }
    }
  },

  effects : {
    /**
     * 功能：初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
      *fetch({year,arg_user_id}, {call, put}) {
      yield put({type: 'indexTemplateQuery',year});
      yield put({type: 'basicInfoQuery',year});
      yield put({type: 'basicOptionInfoQuery',year});
      yield put({type: 'basicPerformanceQuery',year,arg_user_id});
      yield put({type: 'isInternalTrainerQuery',arg_user_id})
    },
    /**
     * 功能：初始化员工考核结果列表
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *indexTemplateQuery({year}, {call, put}) {
      yield put({
        type: 'saveTemplateRes',
        template:''
      });
      const infoRes = yield call(service.templateQuery,
        {
          arg_year:year,
          arg_type:'3502',
        });
      if(infoRes.RetCode=='1' && infoRes.DataRows && infoRes.DataRows.length){
        yield put({
          type: 'saveTemplateRes',
          template: infoRes.DataRows[0].content
        });
      }
    },
    /**
     * 功能：初始化员工考核结果列表
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *basicInfoQuery({year}, {call, put}) {
      yield put({
        type: 'saveInfoRes',
        info:{},
        year
      });
      yield put ({
        type: 'saveTalentsList',
        talentsList: []
      })
      const infoRes = yield call(service.basicInfoQuery,
        {
          // transjsonarray:JSON.stringify({"condition":{"state":"0"}})
          arg_year:year
        });

      if(infoRes.RetCode=='1'){
        if(infoRes.DataRows && infoRes.DataRows.length){
          yield put({
            type: 'saveInfoRes',
            info: infoRes.DataRows[0],
            year
          });
        }else {
          message.warning('未查询到相关信息！')
        }
        
        if (infoRes.DataRows1 && infoRes.DataRows1.length) {
          yield put({
            type: 'saveTalentsList',
            talentsList: infoRes.DataRows1
          })
        }

      }else {
        message.error(infoRes.RetVal)
      }
    },
    /**
     * 功能：初始化员工考核结果列表
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *basicOptionInfoQuery({year}, {call, put}) {
      yield put({
        type: 'saveOptionInfoRes',
        optionInfo:{}
      });
      const infoRes = yield call(service.basicOptionInfoQuery,
        {
          arg_year:year,
          arg_param:"id_card,birthday,country,nation,birth_place, rank_level,serve_time,unicom_age,ryy_age,kinsfolk_relation"
        });

      if(infoRes.RetCode=='1'){
        if(infoRes.DataRows && infoRes.DataRows.length){
          yield put({
            type: 'saveOptionInfoRes',
            optionInfo: infoRes.DataRows[0]
          });
        }else {
          //message.warning('未查询到相关信息！')
          console.log('未查询到相关信息！');
        }

      }else {
        message.error(infoRes.RetVal)
      }
    },
    /**
     * 
     * @param {*} param0 
     * @param {*} param1 
     */
    *basicPerformanceQuery({year},{call,put}){
      yield put({
        type: 'savePerformance',
        performance: []
      })
      const infoRes = yield call(service.performanceQuery,
        {
          arg_year:year,
          arg_user_id:Cookie.get("userid")
        })
      if (infoRes.RetCode == '1') {
        yield put({
          type: 'savePerformance',
          performance: infoRes.DataRows
        })
      }
    },

    *isInternalTrainerQuery({isInternalTrainer},{call,put}){
      yield put({
        type: 'saveInternalTrainer',
        isInternalTrainer
      })
      const infoRes = yield call(service.internalTrainer,
        {
          arg_user_id:Cookie.get("userid")
        })
      if (infoRes.RetCode == '1' && infoRes.RowCount != "0") {
        yield put({
          type: 'saveInternalTrainer',
          isInternalTrainer: infoRes.DataRows
        })
      }
    }
  },
  subscriptions : {
  },
};
