/**
 *  作者: 卢美娟
 *  创建日期: 2018-06-13
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：规章制度-我的审批数据处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/regulationM/regulationM.js';

export default {
  namespace: 'myApproval',
  state: {

  },

  reducers: {
    saveMyPublicReview(state, {myPublicReviewList: publishReview,publicRowCount}) {
      return { ...state,  myPublicReviewList: publishReview,publicRowCount};
    },
    saveMyDeleteReview(state, {myDeleteReviewList: deleteReview,deleteRowCount}) {
      return { ...state, myDeleteReviewList: deleteReview,deleteRowCount,};
    },
  },

  effects: {
    *todoReviewQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.todoReviewQuery, {...data});
      var publishReview = [];
      var deleteReview = [];
      if(RetCode == '1'){
        for(let i = 0; i < RowCount; i++){
          if(DataRows[i].type == 'regulationPublish'){
            publishReview.push(DataRows[i]);
          }
          else if(DataRows[i].type == 'regulationDelete'){
            deleteReview.push(DataRows[i]);
          }
        }

        var publicRowCount = publishReview.length;
        var deleteRowCount = deleteReview.length;
        yield put({
          type: 'saveMyPublicReview',
          myPublicReviewList: publishReview,
          publicRowCount,
        });
        yield put({
          type: 'saveMyDeleteReview',
          myDeleteReviewList: deleteReview,
          deleteRowCount,
        });
      }
    },

    *publishRegulationReview({data}, { call, put }) {
      const {RetCode} = yield call(usersService.publishRegulationReview, {...data});
      if(RetCode == '1'){
        message.success("操作成功！");
      }else{
        message.error("操作失败！");
      }
      //刷新
      var data2 = {
        arg_state: '0', //未办
      }
      yield put({
        type:'todoReviewQuery',
        data:data2,
      })
    },

    *delRegulationReview({data}, { call, put }) {
      const {RetCode} = yield call(usersService.delRegulationReview, {...data});
      if(RetCode == '1'){
        message.success("操作成功！");
      }else{
        message.error("操作失败！");
      }
      //刷新
      var data2 = {
        arg_state: '0', //未办
      }
      yield put({
        type:'todoReviewQuery',
        data:data2,
      })
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/myApproval') {
            var data = {
              arg_state: '0', //未办
            }
            dispatch({ type: 'todoReviewQuery',data });
          }
        });
      },
    },
};
