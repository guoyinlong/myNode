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
  namespace : 'docType',
  state : {
    docTypelist:[],
  },
  reducers : {
    saveType(state, { docTypelist: DataRows}) {
      return { ...state, docTypelist:DataRows};
    },
  },
  effects : {

    *getdocType({arg_ou_id = Cookie.get('OUID')}, {call, put}) {
      const {RetCode,DataRows} = yield call(commonAppService.getdocType,{arg_ou_id});
      if(RetCode=='1'){
        yield put({
          type: 'saveType',
          docTypelist: DataRows,
        });
      }else{
        message.error('获取文档类型失败！');
      }
    },

    *editDocType({formData}, {call, put}) {
      const {RetCode,RetVal} = yield call(commonAppService.editDocType,{...formData});
      if(RetCode=='1'){
          message.success('修改文档分类名称成功！');
          //刷新
          yield put({
            type:'getdocType',
          });
      }else if(RetCode=='2'){
          message.info(RetVal);
      }else if(RetCode == '0'){
        message.error('修改文档分类名称失败！');
      }
    },
},
  subscriptions : {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {

        if (pathname === '/docType') {
          dispatch({ type: 'getdocType',query });
        }
      });
    },
  },
}
