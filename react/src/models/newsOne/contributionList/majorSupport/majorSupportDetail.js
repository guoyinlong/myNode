/**
 * 作者：韩爱爱
 * 日期：2020-11-09
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页-详情
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers';
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
export default {
  namespace: 'majorSupportDetail',
  state:{
    judgeTableSource:'',//审批环节
    tuTableSource:[],//图片数据存储,
    loading: true,
    eachSubmitter:'',
    eachTime:'',
    eventName:'',
    eventNameJob:'',
    previewVisible: false,
    previewImage:'',
    approvalId:'',
    difference:'',
    taskid:'',
    tuihuiValue:''
  },
  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },
  effects: {
    * init({query}, {put,call}) {
      //详情
      yield put({
        type: 'save',
        payload: {
          approvalId:query.approvalId,
          difference:query.difference
        }
      });
      yield put({
        type: 'queryActivityItem'
      });
      // yield put({
      //   type: 'queryActivityExamineItem'
      // });
    },

    //详情
    *queryActivityItem({},{put,call,select}){
        const {approvalId,difference} = yield select(v => v.majorSupportDetail);
        if(difference){
          let recData = {
            approval_id:approvalId
          };
          const response = yield call(Services.showTodoApprovalDetail, recData);
          if (response.retCode === '1') {
            if (response.dataRows.projApply.businessObj!=null) {
              const res = response.dataRows.projApply.businessObj.dataRows;
              let arrPian = JSON.parse('['+ res.proveImage+']');
              arrPian.map((item,index)=>{item.key=index});
              yield put({
                type: 'save',
                payload: {
                  eachSubmitter:res.createUserName,
                  eachTime:res.activityTime,
                  eventName:res.activityName,
                  eventNameJob:res.job.replace(/\"/g, ""),
                  tuTableSource:arrPian,
                  loading:false,
                  taskid:response.dataRows.taskId,
                  taskName:response.dataRows.taskName,
                  tableid:response.dataRows.projApply.tableId,
                  difference:difference,
                  pass:response.dataRows.pass,
                }
              })
            }
          }
  
        }else{
         const dataStr={
          id:approvalId
        };
        let data=yield call (Services.queryActivityItem,dataStr);
        if(data.retCode =='1'){
          let arrPian = JSON.parse('['+ data.dataRows.proveImage+']');
          arrPian.map((item,index)=>{item.key=index});
          yield put({
            type:'save',
            payload:{
              eachSubmitter:data.dataRows.createUserName,
              eachTime:data.dataRows.activityTime,
              eventName:data.dataRows.activityName,
              eventNameJob:data.dataRows.job.replace(/\"/g, ""),
              tuTableSource:arrPian,
              loading:false
            }
          })
        } 
        }
        


    },
    //审批
    *queryActivityExamineItem({},{put,call,select}){
      yield put({
        type:'save',
        payload:{
          judgeTableSource:""
        }
      })
      const {approvalId,tableid} = yield select(v => v.majorSupportDetail);
      const dataStr={
        id:tableid?tableid:approvalId
      };
      let oDtat =yield call(Services.queryActivityExamineItem,dataStr);
      if(oDtat.retCode == '1'){
        oDtat.dataRows.map((item,index)=>{
          item.key =index;
          if(item.state == '0'){
            item.state = '办理中';
          }else if(item.state == '1'){
            item.state = '办必';
          }
          if(item.commentDetail){
            if(JSON.parse(item.commentDetail).endApply==false){
            item.commentDetail="不同意："+JSON.parse(item.commentDetail).opinion
  
            }else if(JSON.parse(item.commentDetail).endApply==true){
              item.commentDetail="同意"
            } else{
              item.commentDetail="重新提交"
            }  
  
          }
        });
        yield put({
          type:'save',
          payload:{
            judgeTableSource:JSON.parse(JSON.stringify(oDtat.dataRows))
          }
        })
      }else {
        message.error(oDtat.retVal)
      }
    },
    //返回
    *return({},{put}){
      yield put(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
      }));
    },
    //下载
    *downloadUpload({download},{}){
      let url = download.RelativePath;
      window.open(url);
    },
    //图片放大
    *handlePreview({reacd,name},{put}){
      if(name == '打开'){
        yield put({
          type:'save',
          payload:{
            previewVisible:true,
            previewImage:reacd.RelativePath
          }
        })
      }else if(name == '关闭'){
        yield put({
          type:'save',
          payload:{
            previewVisible:false
          }
        })
      }
    },
    //同意审核
    * onAgree({},{call, put,select}){
      const {taskid,auditProcess,isYearNews}= yield select (state =>state.majorSupportDetail);

      let recData={
        user_id:Cookie.get('userid'),
        user_name:Cookie.get('username'),
        form:JSON.stringify({endApply:true,isYearOrOutNews:auditProcess,isYearNews:isYearNews}),
        task_id:taskid,
      };
      const response = yield call(Services.completeTask, recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          message.info('审核成功');
          yield put(routerRedux.push({
            pathname:'/adminApp/newsOne/myReview'
          }))
        }
      }else{
        message.error(response.retVal);
      }

    },
    //回退原因
    * tuihui({record},{call, put,select}){
      if(record.length<200){
        yield put({
          type:'save',
          payload: {
            tuihuiValue: record,
          }
        })
      }else{
        message.info("不能超过200个字符")
      }


    },
    // 确定回退
    * handle({},{call, put,select}){
      const {taskid,tuihuiValue}= yield select (v =>v.majorSupportDetail);
      if(tuihuiValue==""){
        message.info("请填写退回原因")
      }else{
        let recData={
          user_id:Cookie.get('userid'),
          user_name:Cookie.get('username'),
          form:JSON.stringify({endApply:false,opinion:tuihuiValue}),
          task_id:taskid,
        };
        const response = yield call(Services.completeTask, recData);
        if(response.retCode === '1'){
          if(response.dataRows){
            message.info('退回成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/myReview'
            }))
            yield put({
              type:'save',
              payload: {
                tuihuiValue: "",
              }
            })

          }
        }else{
          message.error(response.retVal);
        }
      }

    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportDetail') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}

