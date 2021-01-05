/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料上传页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
export default {
  namespace : 'trainUpload',
  state : {
    docTypelist:[],
  },
  reducers : {
    saveType(state, { docTypelist: DataRows}) {
      return { ...state, docTypelist:DataRows};
    },
  },
  effects : {
    *trainSrcAddFile({formData}, {call, put}) {
      const {RetCode} = yield call(commonAppService.trainSrcAddFile, {...formData} );
      if(RetCode=='1'){
          message.success('文件上传成功！');
          yield put(routerRedux.push('/trainingMore'));
      }else{
        message.error('文件上传失败！');
      }
    },

    *getdocType({arg_ou_id = Cookie.get('OUID')}, {call, put}) {
      const {RetCode,DataRows} = yield call(commonAppService.getdocType,{arg_ou_id});
      if(RetCode=='1'){
        yield put({
          type: 'saveType',
          docTypelist: DataRows,
         //  query:{'0864957'}
        });
          // message.success('文件上传成功！');
          // yield put(routerRedux.push('/trainingMore'));
      }else{
        message.error('获取文档类型失败！');
      }
    },
},
  subscriptions : {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {

        if (pathname === '/trainUpload') {
          dispatch({ type: 'getdocType',query });
        }
      });
    },
  },
}
