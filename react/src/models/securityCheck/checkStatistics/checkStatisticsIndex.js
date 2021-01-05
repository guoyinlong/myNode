/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：统计报告首页
 */ 




import Cookie from 'js-cookie';
import {
  message
} from "antd";
import {
  routerRedux
} from 'dva/router';
import * as myserver from '../../../services/securityCheck/securityChechServices2';

export default {
  namespace: 'checkStatisticsIndex',
  state: {
    reportList: [], //统计数据列表
    allCount:"" ,//--总条数 
		pageCount:"",// --总页数
    pageCurrent:"" ,//--当前第几页
    roleType:"",//角色查询
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  },
  effects: {


    //获取列表数据
    * reportNews({argCondition ,page}, { call, put }) {
      let recData = {
        arg_user_id: Cookie.get('userid'),
        argCondition:argCondition,//条件查询，不传时默认查询所有统计报告
        argPageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
        argPageSize:10,//表示每页数量，必须是正整数,默认为所有

      };
      const response = yield call(myserver.statisticsHome, recData);
      // console.log(response.dataRows, 123);
      if (response.retCode === '1') {
        if (response.dataRows) {

          const res = response.dataRows;
          res.map((item, index) => {
            if (item.setType == "0") {
              item.setType = "年度"
            } else if (item.setType == "1") {
              item.setType = "上半年"
            }else if (item.setType == "2"){
              item.setType = "下半年"
            }
            if (item.statisticsStatus == "0") {
              item.statisticsStatus = "未发布"
            } else {
              item.statisticsStatus = "已发布"
            }
            item.key = index;
            item.type = '1';
          });

          yield put({
            type: 'save',
            payload: {
              reportList: res
            }
          })
        }
        const {allCount,pageCount} = response;
      
         
          yield put({
            type: 'save',
            payload:{
              // reportList: JSON.parse(JSON.stringify(listData.dataRows)),
              allCount:JSON.parse(JSON.stringify(allCount)),  // 数据总数
              pageCount:JSON.parse(JSON.stringify(pageCount)), //-当前第几页
            }
          })
        

      }else{
        message.error(response.retVal);
      }

    },
  

   
          // 角色查询	
          *queryUserInfo({}, {call, put, select}){
            let OUID = "e65c02c2179e11e6880d008cfa0427c4"
            let roleData = yield call(myserver.queryUserInfo, {});
            let roleTypeData = '0'
            // console.log(roleData.dataRows[0].roleName ,'roleData.dataRows[0].roleName')
            if(roleData.retCode == '1') {
                if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
                    roleTypeData = '1'
                }else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
                    roleTypeData = '2'
                }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {//部门安全员
                    roleTypeData = '3'
                }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")!=OUID) {//分院部门安全员
                    roleTypeData = '4'
                }
                // console.log(roleTypeData)
                yield put({
                    type: 'save',
                    payload: { 
                        roleType: roleTypeData
                    }
                })
            }else{
              message.error(response.retVal);
            }
        },



  },

  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      return history.listen(({
        pathname,
        query
      }) => {
        if (pathname === '/adminApp/securityCheck/checkStatistics') { //此处监听的是连接的地址
          dispatch({
            type: 'reportNews',
            query
          });
          // dispatch({
          //   type: 'statisticsHome',
          //   query
          // });
          dispatch({
            type: 'queryUserInfo',
            query
          });
        }
      });
    },
  },
};
