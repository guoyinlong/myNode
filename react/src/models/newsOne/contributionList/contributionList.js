/**
 * 作者：韩爱爱
 * 日期：2020-11-04
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单
 */

import { routerRedux } from 'dva/router';
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';
import Cookie from 'js-cookie';
import {message} from 'antd';
import * as Services from "../../../services/newsOne/newsOneServers";
export default {
  namespace: 'contributionList',
  loading:false,
  state: {
    totalData:[],//总数据
    song_data:[],//组织本单位稿件报送数据
    qi_data:[],//其他
    activity_data:[],//软件研究院重大活动支撑
    recordDataSource:[],//培训记录
    distButton:'',
    totalCurrent:1,//总数据当前页
    totalCount:'',//总数据总条数
    subDataCurrent: 1,//子数据当前页
    subDataCount:'',//子数据总条数
    userId:'',
    contractId:[],
    buttonDisplay:'0',//本人 0显示，1不显示
    buttonDisplay1:'0',//非本人 0显示，1不显示
    defaultActiveKey:'1',
    bulkData:[],
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {call, put, select}) {
      yield put({
        type: 'queryContributionList'  //总数据
      });
      yield put({
        type: 'queryAdminInActivity' //是否是管理员
      });
      yield put({
        type: 'tabsChange' //卡片点击
      });
    },
    //总数据
    *queryContributionList({}, {call, put, select}){
      const  {totalCurrent} = yield select(v => v.contributionList);
      let dataStr ={
        pageCurrent:totalCurrent,
        pageSize:10
      };
      let data = yield call(Services.queryContributionList, dataStr);
      if(data.retCode == '1'){
        data.dataRows.map((item,index)=>{
          item.key=index+ 1;
          if(item.userId == localStorage.getItem('sys_userid') ){
            data.dataRows.splice(index,1);
            data.dataRows.unshift(item);
          }
        });
        sessionStorage.setItem('user',JSON.stringify( data.dataRows));// 存入到sessionStorage中
        yield put({
          type:'save',
          payload:{
            totalData:JSON.parse(JSON.stringify(data.dataRows)),
            totalCount:data.allCount,
            defaultActiveKey:'1'
          }
        })
      }else {
        message.error(record.response.retVal)
      }
    },
    //卡片点击
    *tabsChange({record,name},{call, put, select}){
      if(record == '1'){
        yield put({
          type: 'queryTrainLike'
        });
        yield put({
          type:'save',
          payload:{
            subDataCurrent:1,
            defaultActiveKey:'1'
          }
        });
      }else if(record == '2'){
        yield put({
          type:'save',
          payload:{
            subDataCurrent:1,
            defaultActiveKey:"2"
          }
        });
        yield put({
          type: 'queryUserActivityList'
        });
      }else if(record == '3'){
        yield put({
          type:'save',
          payload:{
            subDataCurrent:1,
            defaultActiveKey:"3"
          }
        });
        yield put({
          type: 'organizationUnitSend'
        });
      }
    },
    //培训
    *queryTrainLike({page}, {call, put, select}) {
      const  {userId,bulkData} = yield select(v => v.contributionList);
      const dataOstr = {
        jobNumber:userId[0].userId
      };
      let data = yield call(Services.queryTrainResultAndTrainByJobNumber, dataOstr);
      if (data.retCode == '1') {
        let dataArr =[];
        data.dataRows.map(item=>{
          item.map(iv=>{
            iv.trainTime = iv.trainTime.substring(0, 10);
            iv.trainName =iv.trainName;
            dataArr.push(iv)
          })
        });
        yield put({
          type: 'save',
          payload: {
            recordDataSource: JSON.parse(JSON.stringify(dataArr)),
            subDataCount:dataArr.length,
            loading:false,
            bulkData:bulkData,
          }
        });
      }
    },
    //软件研究院重大活动支撑
    *queryUserActivityList({},{call, put, select}){
      const  {subDataCurrent,userId} = yield select(v => v.contributionList);
      let dataStr={
        pageCurrent:Number(subDataCurrent),
        pageSize:5,
        userId:userId[0].userId
      };
      let data = yield call(Services.queryUserActivityList, dataStr);
      if(data.retCode == '1'){
        let dataArr = [];
        data.dataRows.map((item,index)=>{
          item.personnel_index=index;
          item.job =item.job.replace(/\"/g, "")
          // if(item.state == '审核通过'){
          //   dataArr.push(item)
          // }
        });
        yield put({
          type:'save',
          payload:{
            activity_data:JSON.parse(JSON.stringify( data.dataRows)),
            subDataCount:data.allCount,
            loading:false,
          }
        })
      }else {
        message.error(record.response.retVal)
      }
    },
    //组织本单位稿件报送
    *organizationUnitSend({},{call, put, select}){
      const  {subDataCurrent,userId} = yield select(v => v.contributionList);
      const  dataStr = {
        // pageCurrent:Number(subDataCurrent),
        // pageSize:5,
        userid:userId[0].userId,
      };
      let data = yield call(newsOneService.organizationUnitSend,dataStr);
      if(data.retCode == '1'){
        let dataArr =[];
        data.dataRows.map((item,index)=>{
          if(item.state == '审核通过'){
            dataArr.push(item)
          }
        });
        dataArr.map((item,index)=>{
          item.personnel_index=index;
          item.manuscript_name =item.newsName;
        });
        yield put({
          type:'save',
          payload:{
            song_data:JSON.parse(JSON.stringify(dataArr)),
            subDataCount:dataArr.length,
          }
        })
      }else {
        message.error(data.retVal)
      }
    },
    //其他
    // *queryOther({},{call, put, select}){
    //   const  {subDataCurrent,userId} = yield select(v => v.contributionList);
    //   const  dataStr = {
    //     userid:userId[0].userId
    //   };
    //   let data = yield call(newsOneService.queryOther,dataStr);
    //   if(data.retCode == '1'){
    //     data.dataRows.map((item,index)=>{
    //       item.personnel_index=index;
    //       item.appel_name =item.name
    //     });
    //     yield put({
    //       type:'save',
    //       payload:{
    //         qi_data:JSON.parse(JSON.stringify(data.dataRows)),
    //         subDataCount:data.allCount,
    //         subDataCurrent:1,
    //       }
    //     })
    //   }else {
    //     message.error(data.retVal)
    //   }
    // },

    //是否是管理员
    *queryAdminInActivity({}, {call, put}){
      let data = yield call(newsOneService.queryAdminInActivity,{});
      if(data.retCode == '1'){
        if(data.dataRows == '1'){//0为普通职工，1为管理员
          yield put({
            type:'save',
            payload:{
              distButton:'1',
            }
          })
        }else if(data.dataRows =='0'){
          yield put({
            type:'save',
            payload:{
              distButton:'0',
            }
          })
        }
      }else {
        message.error(data.retVal)
      }
    },
    //下载模板
    *bulkDownload ({record,name},{}){
      if(record == '培训'){
        let data ='/microservice/newsmanager/downloadTrainTemplate';
        window.open(data,'_self')
      }else if(record == "重大"){
        let url ='/filemanage/upload/portalFileUpdate/10010/2020/11/16/0563582/c12db43b28314bc382adb74c99040f4c/重大活动支撑模板.xlsx';
        window.open(url,'_self')
      }
    },
    //批量导入
    *pictureChange ({record,name},{put}){
      console.log(record);
      if(name.status =='done' ){
        if(record == '培训'){
          if(name.response.retCode == '1'){
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/TrainBulkUpload',
              query:{
                name:"培训"
              }
            }));
            sessionStorage.setItem('record',JSON.stringify(name.response.dataRows));// 存入到sessionStorage中
          }else {
            message.error(name.response.retVal)
          }
        }else if(record == '重大'){
          if(name.response.retCode == '1'){
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/TrainBulkUpload',
              query:{
                name:"重大"
              }
            }));
            sessionStorage.setItem('record',JSON.stringify(name.response.dataRows));// 存入到sessionStorage中
          }else {
            message.error(name.response.retVal)
          }
        }
      }else if(name.status === 'error'){
        message.error(name.response.retVal);
      }else if (name.status !== 'uploading') {}
    },
    //行的数据
    *tableChang({record,name}, {call, put, select}){
      const  {subDataCurrent,distButton,buttonDisplay} = yield select(v => v.contributionList);
      //展开关闭
      if(record == false){
        yield put({
          type:'save',
          payload:{
            contractId:[],
            subDataCurrent:1,
            userId:'',
            // defaultActiveKey:'1'
          }
        });
      }else {
        const  {userId,bulkData,bottonDetails,bottonDetails1} = yield select(v => v.contributionList);
        if([name][0].userId == Cookie.get('userid')){
          yield put({
            type:'save',
            payload:{
              buttonDisplay:'0'
            }
          });
        }else {
          yield put({
            type:'save',
            payload:{
              buttonDisplay:'1'
            }
          });
        }
        //数据
        const dataOstr = {
          jobNumber:[name][0].userId
        };
        let data = yield call(Services.queryTrainResultAndTrainByJobNumber, dataOstr);
        let bottonDetails1s=bottonDetails1;
        if (data.retCode == '1') {
          let dataArr = []
          data.dataRows.map(item => {
            item.map(iv => {
              iv.trainTime = iv.trainTime.substring(0, 10);
              iv.trainName = iv.trainName;
              dataArr.push(iv)
            })
          });
          yield put({
            type:'save',
            payload:{
              contractId:[name.key],
              userId:[name],
              subDataCurrent:1,
              defaultActiveKey:'1',
              recordDataSource: JSON.parse(JSON.stringify(dataArr)),
              subDataCount:dataArr.length,
              loading:false,
              bulkData:bulkData,
              bottonDetails1:bottonDetails1s,
              bottonDetails2:false
            }
          });
        }
      }
    },
    //页数
    *handlePageChange({record},{put}){
      yield put({
        type:'save',
        payload:{
          subDataCurrent:record
        }
      });
      yield put({
        type: 'queryUserActivityList'
      });
    },

    //1\3 分页
    *pageChange({record},{put}){
      yield put({
        type:'save',
        payload:{
          subDataCurrent:record
        }
      });
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
