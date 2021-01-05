/**
 * 作者：贾茹
 * 日期：2020-10-20
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块详情页面
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';
import { HardwareDesktopWindows } from 'material-ui/svg-icons';

export default {
  namespace: 'newsPoolDetails',
  state: {
    dataInfo:[], //详情数据
    passData:{},  //待办列表页面跳转传递的数据
    judgeTableSource:[],      //审批环节table数据
    tableUploadFile:[],       //上传文件查询
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({query}, {call, put}) {
        //console.log(query)
        yield put({
          type:'save',
          payload:{
            passData:JSON.parse(query.record)
          }
        })
        yield put({
          type:'taskInfoSearch'
        })
    },

    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData} = yield select(state=>state.newsPoolDetails);
      let recData={
        id :passData.id,//| VARCHAR(32) | 是 | 环节id
      };
      const response = yield call(newsOneService.queryFixedNewsPool,recData);
      /* console.log(response);*/
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
         yield put({
           type:'save',
           payload:{
            dataInfo:res
           }
         })
          /*console.log(res);*/

        }


      }

    },

    //审批环节调取服务
    * judgeHistory({}, { call, put, select }){

      const { passData } = yield select(state=>state.newsPoolDetails);
      /* console.log(passData);*/
      const recData={
        arg_form_uuid:passData.form_uuid,// | VARCHAR(32)| 是 |申请单id
      };
      const response = yield call(sealApplyService.judgeHistory,recData);
      if(response.RetCode=== '1' ){
        if(response.DataRows){
          const res = response.DataRows;
          console.log(res);
          for(let i = 0;i<res.length;i++){
            res[i].key=i;
          }
          yield put({
            type:'save',
            payload:{
              judgeTableSource:res
            },
          });
        }

        /* console.log(res);*/
      };

    },

    //返回上一级
    * return ({}, {select,put}){
        history.back(-1);
    },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/newsPoolIndex/newsPoolDetails') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
