/**
 * 文件说明：全面激励-首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */
import * as service from '../../services/encouragement/services';
import {message} from 'antd';

export default {
  namespace : 'welfare',
  state : {
    info:{},
    template:'',
    year:'',
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
      yield put({type: 'welfareInfoQuery',year});
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
          arg_type:'3509',
        });

      if(infoRes.RetCode=='1' && infoRes.DataRows && infoRes.DataRows.length){
        yield put({
          type: 'saveTemplateRes',
          template: infoRes.DataRows[0].content
        });
      }else {
        message.error(year+"年福利激励报告模板未配置！")
      }
    },
    /**
     * 功能：初始化员工考核结果列表
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *welfareInfoQuery({year}, {call, put}) {
      yield put({
        type: 'saveInfoRes',
        info:{},
        year
      });
      const infoRes = yield call(service.welfareInfoQuery,
        {
          arg_year:year
        });
      if(infoRes.RetCode=='1'){
        if(infoRes.DataRows){
          yield put({
            type: 'saveInfoRes',
            info: infoRes.DataRows,
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
