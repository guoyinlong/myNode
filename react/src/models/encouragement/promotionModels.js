/**
 * 文件说明：全面激励-首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */
import * as service from '../../services/encouragement/services';
import {message} from "antd";

export default {
  namespace : 'promotion',
  state : {
    info:{},
    template:'',
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

  },

  effects : {
    /**
     * 功能：初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
      *fetch({year}, {call, put}) {
      yield put({type: 'indexTemplateQuery',year});
      yield put({type: 'promotionInfoQuery',year});
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
          arg_type:'3503',
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
    *promotionInfoQuery({year}, {call, put}) {
      yield put({
        type: 'saveInfoRes',
        info:{},
        year
      });
      const infoRes = yield call(service.promotionInfoQuery,
        {
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

      }else {
        message.error(infoRes.RetVal)
      }

    },


  },
  subscriptions : {
  },
};
