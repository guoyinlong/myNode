/**
 * 作者：韩爱爱
 * 日期：2020-11-09
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers'
import {routerRedux} from "dva/router";
export default {
  namespace: 'majorSupportIndex',
  loading:true,
  state:{
    pageSize:10,
    pageCurrent:1, //当前页
    pageDataCount:'',//总条数
    mobileName:'',
    cobileTime:'',
    recordDataSource:[]////表格数据
  },
  reducers:{
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects: {
    * init({}, {put}) {
      yield put({
        type: 'inquiryMaterial'
      })
    },
    //上传
    *handleMaterial({},{put}){
      yield put(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportWrite',
      }));
    },
    //详情
    *emptyDetail({record,text},{put}){
      yield put(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportDetail',
        query: {
          approvalId:text.id
        }
      }));
    },
    //修改
    *modifyDetail({record,text},{put}){
      yield put(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportModify',
        query: {
          approvalId:text.id
        }
      }));
    },
    //页数
    *changePage({page},{put}){
      yield put ({
        type:"save",
        payload:{
          pageCurrent:page
        }
      });
      yield put({
        type: 'inquiryMaterial'
      })
    },
    //活动时间
    *changeDate({startTime}, {put}){
      yield put({
        type:'save',
        payload:{
          cobileTime:startTime
        }
      })
    },
    //活动名称
    *mobileVlaue({record},{put}){
      yield put({
        type:'save',
        payload:{
          mobileName:record.target.value
        }
      })
    },
    //清空
    *emptyMaterial({},{put}){
      yield put({
        type:'save',
        payload:{
          mobileName:'',
          cobileTime:''
        }
      });
      yield put({
        type: 'inquiryMaterial'
      })
    },
    //查询
    *inquiryMaterial({},{put,call,select}){
      const {mobileName,cobileTime,pageCurrent,pageSize}=yield select(v => v.majorSupportIndex);
      const dataStr={
        pageCurrent:pageCurrent,
        pageSize:pageSize,
        name:mobileName,
        time:cobileTime
      };
      let data =yield call(Services.queryActivityList,dataStr);
      if(data.retCode == '1'){
        data.dataRows.map((item,index)=>{
          item.key=index;
          item.job =item.job.replace(/\"/g, "")
        });
        yield put({
          type:'save',
          payload:{
            recordDataSource:JSON.parse(JSON.stringify(data.dataRows)),
            pageDataCount:data.allCount,
          }
        })
      }else {
        message.info('没有数据')
      }
    },
    //删除
    *deleteDetail({record,text},{put,call,select}){
      const dataStr ={
        id:text.id
      };
      let data =yield call(Services.deleteActivity,dataStr);
      if(data.retCode == '1'){
        yield put({
          type: 'inquiryMaterial'
        })
      }else {
        message.error(data.retVal)
      }
    },
    //下载
    *downloadMaterial({record,text},{call}){
      let data ='/microservice/newsmanager/downloadActivity?id=' + text.id;
      window.location.href   =   data;
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/majorSupportIndex') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}