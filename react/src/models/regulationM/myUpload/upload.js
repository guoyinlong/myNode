/**
 *  作者: 卢美娟
 *  创建日期: 2018-07-05
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：上传数据处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/regulationM/regulationM.js';
import { routerRedux } from 'dva/router';
import {corp_id, agent_id} from '../../../routes/regulationM/const.js';

export default {
  namespace: 'upload',
  state: {

  },

  reducers: {
    saveCategoryType(state, { categoryTypeList: DataRows,RowCount, }) {
      return { ...state, categoryTypeList:DataRows,RowCount,};
    },
    saveSystemsLevel(state, { systemsList: DataRows,RowCount, }) {
      return { ...state, systemsList:DataRows,RowCount,};
    },
    saveReguLevel(state, { reguLevelList: DataRows,RowCount, }) {
      return { ...state, reguLevelList:DataRows,RowCount,};
    },
    saveReguKind(state, { reguKindList: DataRows,RowCount, }) {
      return { ...state, reguKindList:DataRows,RowCount,};
    },
    saveID(state, { arg_id, }) {
      return { ...state, arg_id,};
    },
    saveItemDetail(state, { itemDetailList: DataRows,RowCount, }) {
      return { ...state, itemDetailList:DataRows,RowCount,};
    },
  },

  effects: {
    *saveUploadFile({data}, { call, put }) {
          const {arg_id,RetCode} = yield call(usersService.saveUploadFile, {...data});
          global.argId = arg_id;
          if(RetCode == '1'){
            message.success("保存文件成功！")
          }
          yield put({
            type: 'saveID',
            arg_id,
          });
          //刷新
          var data2 = {
            arg_id: arg_id,
          }
          yield put({
            type:'myRegulationQuery',
            data2,
          })
        },

    *submitUploadFile({data,samePageSaveFlag}, { call, put }) {
        if(samePageSaveFlag == 0){
          const {arg_id,RetCode} = yield call(usersService.saveUploadFile, {...data});
          if(RetCode == '1'){
              var data2 = {
                arg_id: arg_id,
                arg_corp_id: corp_id,
                arg_agent_id: agent_id,
              }
              const RESULT = yield call(usersService.publishRegulationSendReview, {...data2});
              if(RESULT.RetCode == '1'){
                message.success("提交成功，已经送交部门经理审核！")
                yield put({
                  type: 'saveID',
                  arg_id: '',
                });
                //跳转到我的上传页面
                yield put(routerRedux.push({
                  pathname:'/adminApp/regulationM/myUpload',
                }));
              }
              else{
                message.error("提交失败！")
              }
          }
        }
        else if(samePageSaveFlag == 1){
          // var data2 = data;
          // data2.arg_id = global.argId;
          const RESS = yield call(usersService.saveUploadFile, {...data});
          if (RESS.RetCode == '1') {
            var arg_id = global.argId;
            var data3 = {
              arg_id,
              arg_corp_id: corp_id,
              arg_agent_id: agent_id,
            }
            const {RetCode} = yield call(usersService.publishRegulationSendReview, {...data3});
            if(RetCode == '1'){
              message.success("提交成功，已经送交部门经理审核！")
              yield put({
                type: 'saveID',
                arg_id: '',
              });
              //跳转到我的上传页面
              yield put(routerRedux.push({
                pathname:'/adminApp/regulationM/myUpload',
              }));
            }
            else{
              message.error("提交失败！")
            }
          }
        }

    },

    *regulationCategoryQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationCategoryQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveCategoryType',
          categoryTypeList: DataRows,
          RowCount,
        });
      }
    },
    *regulationSystemsQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationSystemsQuery, {...data});
      console.log('DataRows',DataRows)
      if(RetCode == '1'){
        yield put({
          type: 'saveSystemsLevel',
          systemsList: DataRows,
          RowCount:RowCount,
        });
      }
    },

    *regulationLevelQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationLevelQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveReguLevel',
          reguLevelList: DataRows,
          RowCount:RowCount,
        });
      }
    },

    *regulationKindQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationKindQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveReguKind',
          reguKindList: DataRows,
          RowCount:RowCount,
        });
      }
    },

    *myRegulationQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.myregulationquery2, {...data});
      if(RetCode == '1'){
        yield put({
            type: 'saveItemDetail',
            itemDetailList: DataRows,
            RowCount:RowCount,
          });
      }
    },

    *publishRegulationResendReview({data}, { call, put }) {
      //刷新
      var data2 = {
        arg_id: data.arg_id,
      }
      yield put({
        type:'myRegulationQuery',
        data2,
      })

      const {RetCode} = yield call(usersService.publishRegulationResendReview, {...data});
      if(RetCode == '1'){
        message.success("重新提交审核成功！")

        //跳转到我的上传页面
        yield put(routerRedux.push({
          pathname:'/adminApp/regulationM/myUpload',
        }));
      }else{
        message.error("重新提交审核失败！")
      }
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/myUpload/upload') {
            var data = {}
            dispatch({type:'regulationCategoryQuery',data}) //查询规章制度类别
            dispatch({type:'regulationSystemsQuery',data}) //查询制度体系
            dispatch({type:'regulationLevelQuery',data}) //查询我可以发布的规章制度级别
            dispatch({type:'regulationKindQuery',data}) //查询规章制度性质
          }
        });
      },
    },
};
