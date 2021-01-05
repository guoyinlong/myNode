/**
 * 文件说明：题库岗位信息查询
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import Cookie from 'js-cookie';
import * as service from '../../../services/questions/questionservices';
import message from '../../../components/commonApp/message'
import {getUuid} from '../../../utils/func';
export default {
  namespace:'questionsPosition',
  state : {
    list: []
  },

  reducers : {
    /**
     * 功能：更新状态树-题库岗位信息查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param list 题库岗位信息查询结果
     */
    saveRes(state, {list}) {
      return {
        ...state,
        list
      };
    },
  },
  effects:{
    /**
     * 功能：查询所有岗位记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *fetch({}, {call, put}) {
      const {DataRows} = yield call(service.positionquery,
        {
          transjsonarray:JSON.stringify({"condition":{"state":'0'},"sequence":[{"create_time":'1'}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveRes',
          list: DataRows
        });
      }
    },

    /**
     * 功能：保存领导指标完成情况详情
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-02
     * @param finish 完成情况
     */
    *addPost({post}, {call, put}) {
      const {RetCode} = yield call(service.positionupdate,
        {
          transjsonarray:JSON.stringify([{"opt":"insert","data":{"classify_uid":getUuid(32,62),"classify_name":post,"state":'0'}}])
        });
        if(RetCode==='1'){
          message.success('添加成功！')
          yield put({type:'fetch'})
        }else{
          message.error('添加失败')
        }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname ==='/humanApp/questions/position') {
          dispatch({
            type:'fetch',
          });
        }
      });

    },
  },
}
