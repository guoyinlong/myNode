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
  namespace : 'training',
  state : {
    info:{},
    template:'',
    year:'',
    courseList: [],
  },

  reducers : {
    // 保存信息
    save(state,{payload}){
      return {
        ...state,
        ...payload,
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
    saveInfoRes(state, {info,year}){
      return {
        ...state,
        info,
        year,
        // courseList
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

    saveCourseList(state,{courseList}){
      return{
        ...state,
        courseList
      }
    },

  },

  effects : {
    /**
     * 功能：初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
      *fetch({year,arg_user_id,arg_ou_id,arg_dept_id}, {call, put}) {
      yield put({type: 'indexTemplateQuery',year});
      yield put({type: 'trainingInfoQuery',year,arg_user_id,arg_ou_id,arg_dept_id});
      yield put({type: 'trainingNameQuery',year});
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
          arg_type:'3505',
        });

      if(infoRes.RetCode=='1' && infoRes.DataRows && infoRes.DataRows.length){

        yield put({
          type: 'saveTemplateRes',
          template: infoRes.DataRows[0].content
        });
      }
    },


    // 培训课程名称查询
    *trainingNameQuery({year}, {call, put}) {
      yield put({
        type: 'save',
        payload:{
          trainName:[]
        }
      });
      const infoRes = yield call(service.trainNameQuery,
        {
          arg_year:year,
          arg_staffid: Cookie.get('userid'),
        });

      if(infoRes.RetCode=='1' && infoRes.DataRows && infoRes.DataRows.length){
        let trainNameList = infoRes.DataRows;
        let finalTrainName = []
        // item.course_type
        trainNameList.forEach(item=>{
          let tempIndex = finalTrainName.findIndex(item2=>item2.title === item.course_type)
          if( tempIndex !== -1){
            finalTrainName[tempIndex].content.push(item.course)
          }else{
            finalTrainName.push({
              title: item.course_type,
              content:[item.course]
            })
          }
        })


        yield put({
          type: 'save',
          payload:{
            trainName: finalTrainName,
          }
        });
      }
    },

    /**
     * 功能：初始化员工考核结果列表
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *trainingInfoQuery({year}, {call, put}) {
      yield put({
        type: 'saveInfoRes',
        info:{},
        year
      });
      yield put({
        type: 'saveCourseList',
        courseList: []
      })
      const infoRes = yield call(service.trainingInfoQuery,
        {
          arg_year:year,
          arg_user_id: Cookie.get('userid'),
          arg_ou_id: Cookie.get('OUID'),
          arg_dept_id: Cookie.get('dept_id')
        });
      if(infoRes.RetCode=='1'){
        if(infoRes.DataRows){
          yield put({
            type: 'saveInfoRes',
            info: infoRes.DataRows,
            year
          });
        } else {
          message.warning('未查询到相关信息！')
        }
        if (infoRes.DataRows2) {
          yield put({
            type: 'saveCourseList',
            courseList: infoRes.DataRows2
          })
        }

      }else {
        message.error(infoRes.RetVal)
      }
    },
  },
  subscriptions : {
  },
};
