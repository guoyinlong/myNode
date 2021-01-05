/**
 *  作者: 邓广晖
 *  创建日期: 2017-08-11
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：实现员工信息导入功能
 *  修改人：耿倩倩
 *  邮箱：gengqq3@chinaunicom.cn
 *  修改时间：2017-09-11
 */
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';

/**
 * 作者：邓广晖
 * 创建日期：2017-8-20
 * 功能：原来将用户ID当做键，现在将用户ID转到值中
 * @param data 输入数据
 */
function serviceData2FrontData(data){
  let frontDataList = [];
  for(let item in data){
    //frontDataList.push(Object.assign({userId:item},data[item]));
    frontDataList.push(data[item]);
  }
  return frontDataList;
}

//将对象中的用户ID转变成键
/*function frontData2ServiceData(data){
  let servicDataList = [];
  for(let i = 0 ;i<data.length;i++){
    let headKey = data[i].userId;
    delete data[i].userId;
    let result = {};
    result[headKey] = data[i];
    servicDataList.push(result);
  }
  return servicDataList;
}*/


export default {
  namespace:'staffImport',
  state:{
    tableDataList: [],
    haveData:false
  },
  reducers:{
    save(state,  action) {
      return { ...state, ...action.payload};
    }
  },
  effects: {
    /**
     * 作者：邓广晖
     * 创建日期：2017-8-20
     * 功能：员工信息导入
     * @param param 请求参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *staffImport({param},{call,put}){
      let data = yield call(hrService.basicImport,param);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            tableDataList:serviceData2FrontData(data.DataRows[0]),
            haveData:true
          }
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-8-20
     * 功能：提交表格数据
     * @param data 请求的数据源
     * @param call 请求服务
     * @param put 返回reducer
     */
    *tableDataCommit({data},{call,put}){
      let dataSource = data.map((item) => {
        const obj = {};
        Object.keys(item).forEach((key) => {
          obj[key] = key === 'key' ? item[key] : item[key].value;
        });
        return obj;
      });

      let postData = {};
      postData["arg_tenantid"] = Cookie.get('tenantid');
      postData["arg_create_userid"] = Cookie.get('userid');
      postData["dataRows"] = dataSource;
      let jsonPostData = JSON.stringify(postData);

      yield put({
        type:'save',
        payload:{tableDataList:[],haveData:false}
      });

      let commitBackData = yield call(hrService.commitData,{data:jsonPostData});
      if (commitBackData.RetCode === '1') {
        message.success("导入成功");
      }else{
        message.error(commitBackData.RetVal);
      }

    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-8-20
     * 功能：清空预览表格数据
     * @param put 返回reducer
     */
    *selfChangeState({},{put}){
      yield put({
        type:'save',
        payload:{tableDataList:[],haveData:false}
      });
    }
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/hr/staffImport') {
          dispatch({ type: 'selfChangeState',query });
        }
      });
    }

  }
};
