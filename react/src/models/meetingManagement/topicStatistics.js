/**
 * 作者：张枫
 * 创建日期：2019-07-04
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：议题统计
 */
 import Cookie from 'js-cookie';
 import * as Services from '../../services/meetingManagement/meetingManageSer';
 import { message } from 'antd';

export default  {
   namespace : 'topicStatistics',
   state : {
     Param : {
       start_year:'',
       start_month:'',
       end_year:'',
       end_month:'',
       topic_type_id	:'',
       topic_name:'',
       topic_dept_id:''	,
       topic_if_important:'',
       topic_file_state	:'',
       topic_dept_name :'全部',
     },
     typeList : [],
     topicList :[],  //议题统计列表
     imporList : [{key:'',name:'全部'},{key:'0',name:'否'},{key:'1',name :'是'}], // 是否三中一大
     stateList : [{key:'',name : '全部'},{key:'0',name:'否'},{key:'1',name :'是'}] ,//是否归档
     pageSize : 10,
     page : "1", //当前页
     rowCounts : '', //总页数
     deptList :[],
     topicAllList:[],
   },
   reducers : {
     initData(state) {
         return{
             ...state,
         }
     },
     save(state, action) {
         return {...state,...action.payload};
     },
   },
   effects : {
     *init({},{ select,put,call}){
       yield put ({
         type : 'save',
         payload : {
           Param : {
             start_year:'',
             start_month:'',
             end_year:'',
             end_month:'',
             topic_type_id	:'',
             topic_name:'',
             topic_dept_id:''	,
             topic_if_important:'',
             topic_file_state	:'',
             topic_dept_name : "全部",
           },
           typeList: [],
           deptList :[],
           topicList :[],  //议题统计列表
           page : 1, //当前页
           rowCounts : '', //总页数
           topicAllList:[],
         }
       });
       yield put ({type : 'queryMeetingType'});
       yield put ({type : 'queryDeptList'});
       yield put ({ type : 'queryTopic'});
       yield put ({ type : 'queryAllTopic'});
     },
     //查询汇报部门
     *queryDeptList({},{ select,put,call}){
       const { deptList }  = yield select ( state => state.topicStatistics);
       let postData = {};
       let data = yield call (Services.queryReportDept,postData);
       //构造一级目录结构
       deptList.push({
         deptid:"",        //dept_id只是用来构造树时建立索引
         label:"全部",
         key:"",
         value:"全部",
         //selectable : false,
         children:[]
       });
       data.DataRows.length && data.DataRows.map(( item,index)=>{
         if(item.nodelevel === "1"){
           deptList.push(
             {
               deptid:item.deptid,        //dept_id只是用来构造树时建立索引
               label:item.deptname,
               key:item.deptid,
               value:item.deptid,
               selectable : false,
               children:[]
             }
           )
         }
       });
       //构造二级目录结构
       for(let j=0;j<deptList.length;j++){
         for(let i = 0;i<data.DataRows.length;i++){
           if((deptList[j].deptid ===  data.DataRows[i].parentid)){
             deptList[j].children.push(
               {
               deptid:data.DataRows[i].deptid,
               label:data.DataRows[i].deptname.slice(data.DataRows[i].deptname.indexOf("-")+1,),
               key:data.DataRows[i].deptid,
               value:data.DataRows[i].deptid,
             }
             )
           }
         }
       }
       yield put ({
         type : 'save',
         payload : {
           deptList : JSON.parse(JSON.stringify(deptList))
         }
       })
     },
     //会议类型查询
     *queryMeetingType({},{ select,put,call}){
       let postData = {
         arg_type_ou_id : Cookie.get('OUID'),
       };
       let data = yield call (Services.queryTypeSearch,postData);
       if (data.RetCode === '1'){
         data.DataRows.push({"type_name":"全部","type_id":""});
         yield put({
           type : 'save',
           payload : {
             typeList : JSON.parse(JSON.stringify(data.DataRows.reverse())),
           }
         })
       }else {
         message.error("会议类型查询失败！");
       }
     },
     //查询议题列表
     *queryTopic({},{ select,put,call }){
       const { Param ,pageSize,page } = yield select ( state=>state.topicStatistics);
       let postData = {
         arg_ouid:Cookie.get('OUID'),
         arg_start_year : Param.start_year,
         arg_start_month :Param.start_month,
         arg_end_year : Param.end_year,
         arg_end_month : Param.end_month,
         arg_topic_type : Param.topic_type_id,  //  会议类型id
         arg_topic_name : Param.topic_name,  //议题名称
         arg_topic_dept_id : Param.topic_dept_id, //汇报部门
         arg_topic_if_important:Param.topic_if_important,
         arg_topic_file_state : Param.topic_file_state,
         arg_page_size : pageSize,
         arg_page_current : page,
       };
       let data = yield call (Services.queryTopic,postData);
       if ( data.RetCode === '1'){
        data.DataRows.forEach((item,index)=>{
          item.key = index;
          item.time = item.note_year + "-" + item.note_month + "-"+item.note_day
        });
         yield put ({
           type : 'save',
           payload : {
             topicList : JSON.parse(JSON.stringify(data.DataRows)),
             rowCounts : data.RowCount,
           }
         })
       }
     },
     //查询全局数据
     *queryAllTopic({},{ select,put,call }){
       const { Param , } = yield select ( state=>state.topicStatistics);
       let postData = {
         arg_ouid:Cookie.get('OUID'),
         arg_start_year : Param.start_year,//开始年
         arg_start_month :Param.start_month,//开始月
         arg_end_year : Param.end_year,//结束年
         arg_end_month : Param.end_month,//结束月
         arg_topic_type : Param.topic_type_id,  //  会议类型id
         arg_topic_name : Param.topic_name,  //议题名称
         arg_topic_dept_id : Param.topic_dept_id, //汇报部门
         arg_topic_if_important:Param.topic_if_important,//是否是三重一大
         arg_topic_file_state : Param.topic_file_state,//是否归档
         arg_page_size : null,
         arg_page_current : null,
       };
       let data = yield call (Services.queryTopic,postData);
       if ( data.RetCode === '1'){
        data.DataRows.forEach((item,index)=>{
          item.key = index;
          item.time = item.note_year + "-" + item.note_month + "-"+item.note_day
        });
         yield put ({
           type : 'save',
           payload : {
             topicAllList : JSON.parse(JSON.stringify(data.DataRows)),
           }
         })
       }
     },
     // 修改开始时间
     *changeBeginTime({dateString},{ select ,put ,call}){
       const { Param } = yield  select( state => state.topicStatistics);
       Param.start_year = dateString.substring(0,4);
       Param.start_month = dateString.substring(5,);
       yield put ({
         type : 'save',
         payload : {
           Param : JSON.parse(JSON.stringify(Param)),
         }
       })
     },
     // 修改结束时间
     *changeEndTime({dateString},{ select,put,call}){
       const { Param } = yield select ( state => state.topicStatistics);
       Param.end_year = dateString.substring(0,4);
       Param.end_month = dateString.substring(5,);
       yield put ({
         type : 'save',
         payload : {
            Param : JSON.parse(JSON.stringify(Param)),
         }
       })
     },
     // 修改会议类型
     *changeType({ value },{ select,put,call}){
        const { Param } = yield select ( state => state.topicStatistics);
       Param.topic_type_id = value;
        yield put ({
          type : 'save',
          payload : {
           Param : JSON.parse(JSON.stringify(Param)),
          }
        })
     },
     //修改议题名称
     *changeInput({value},{select,put,call}){
       const { Param } = yield select ( state => state.topicStatistics);
       Param.topic_name = value;
       yield put ({
         type : 'save',
         payload : {
          Param : JSON.parse(JSON.stringify(Param)),
         }
       })

     },
     *chearQuery({},{ select,put,call}){
       yield put ({
         type : 'save',
         payload : {
           Param:{
             start_year:'',
             start_month:'',
             end_year:'',
             end_month:'',
             topic_type_id	:'',
             topic_name:'',
             topic_dept_id:''	,
             topic_if_important:'',
             topic_file_state	:'',
             topic_dept_name :'全部',
           }
         }
       });
       yield put({ type:"queryTopic"})
     },
     *changeReportDept({value,label},{select,put,call}){
       const { Param } = yield select ( state => state.topicStatistics);
       Param.topic_dept_id = value;
       Param.topic_dept_name = label[0];
       yield put ({
         type : 'save',
         payload : {
          Param : JSON.parse(JSON.stringify(Param)),
         }
       });
     },
     *changeImportant({value},{select,put,call}){
        const { Param } = yield select ( state => state.topicStatistics);
        Param.topic_if_important = value;
        yield put ({
          type : 'save',
          payload : {
           Param : JSON.parse(JSON.stringify(Param)),
          }
        });
     },
     *changeState ({value},{select,put,call}){
       const { Param } = yield select ( state => state.topicStatistics);
       Param.topic_file_state = value;
       yield put ({
         type : 'save',
         payload : {
           Param : JSON.parse(JSON.stringify(Param)),
         }
       });
     },
     //切换页码
     *changePage({page},{select,put,call}){
       yield put ({type:'save',payload:{page:page}});
       yield put ({type : 'queryTopic'});
     },
     *initPage({page},{select,put,call}){
       yield put ({type:'save',payload:{page:1}});
     },
     //三重一大总数据导出
     *dataExport(){
       let temp = "/microservice/allmanagementofmeetings/newmeetings/ExportImportantMeeting?"+"arg_ouid="+Cookie.get('OUID');
       window.open(temp);
     },
   },
   subscriptions : {
     setup({ dispatch, history }) {
         return history.listen(({ pathname, query }) => {
             if (pathname === '/adminApp/meetManage/topicStatistics') {
                 dispatch({type:'init',query});
             }
         });
     },
   }
 }
