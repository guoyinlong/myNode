/**
 * 作者：张枫
 * 创建日期：2019-07-01
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议配置页面
 */
import * as Services from '../../services/meetingManagement/meetingManageSer';
import * as ManageServices from '../../services/meetingManagement/meetManage';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {getUuid} from './../../components/commonApp/commonAppConst.js';
import * as costOtherService from "../../services/finance/fundingPlanSRS";

export default {
  namespace:'meetingManageConfig',
  state:{
    typeList : [] , // 会议类型配置列表
    managerList : [] , // 办公室管理员配置列表
    meetingType : '', //新增会议类型配置数据
    departList : [], //部门列表
    staffList : [] ,// 人员列表
    //tempKey :"",
    meetingTypeList : [] ,//办公室管理员会议类型选择list 自己拼接
    deptID : '',
    userID : '',//选择的人员
    manType : '',// 会议管理员配置中会议类型显示
    meetingtypeParam : '',
    managerParam:{
      type_id : '',
      office_manager_id		: "",
      office_manager_name : '',
      dept_id :"",
      type_name : '',
    },//办公室管理人员请求参数保存
    typeFlag : '1' ,// 标记位  1 为会议配置新增  2 为会议配置修改
    managerFlag : '1', // 1 为 办公室管理新增  2 为办公室管理修改
    typeState : '1',  //会议管理 初始化开
    managerState : '1',//办公室管理员开关初始化  0关闭 1 打开
    page:"1",//页码数据
    rowCount : '',//页码中总共行数
    pageSize : 10,
    deptValue : "",//新增管理员部门
    tabKey :"",
    tempKey:"",
    proclamationDesc:"", //公告内容
    proclamationStatus:"0", //公告内容状态码  1 为新增  2 为修改
    proclamation:{},//公告请求参数
    majorDigital:"",//三重一大原因
    eventCode:"",//三重一大原因事项编码
    majorList:[],//三重一大原因列表
    majorParameter:[],//三重一大原因请求参数保存
    captionList:[],//三重一大原因说明数据
    adioVlue:"",//会议类型配置-是否生成拟上回清单
    processMeeting:"",//会议类型配置-是否生成拟上回清
  },
  reducers:{
    initData(state) {
      return{
        ...state,
        typeList : [] , // 会议类型配置列表
        managerList : [] , // 办公室管理员配置列表
        meetingType : '', //新增会议类型配置数据
        departList : [], //部门列表
        staffList : [] ,// 人员列表
        //tempKey :"",
        meetingTypeList : [] ,//办公室管理员会议类型选择list 自己拼接
        deptID : '',
        userID : '',//选择的人员
        manType : '',// 会议管理员配置中会议类型显示
        meetingtypeParam : '',
        managerParam:{
          type_id : '',
          office_manager_id		: "",
          office_manager_name : '',
          dept_id :"",
          type_name : '',
        },//办公室管理人员请求参数保存
        typeFlag : '1' ,// 标记位  1 为会议配置新增  2 为会议配置修改
        managerFlag : '1', // 1 为 办公室管理新增  2 为办公室管理修改
        typeState : '1',  //会议管理 初始化开
        managerState : '1',//办公室管理员开关初始化  0关闭 1 打开
        page:"1",//页码数据
        rowCount : '',//页码中总共行数
        pageSize : 10,
        deptValue : "",//新增管理员部门
        tabKey :"3",
        tempKey:"",
        proclamationDesc:"", //公告内容
        proclamation:'',//公告请求参数
        proclamationStatus:"0", //公告内容状态码  1 为新增  2 为修改
        majorDigital:"",//三重一大原因
        eventCode:"",//三重一大原因事项编码
        majorList:[],//三重一大原因列表
        majorParameter:[],//三重一大原因请求参数保存
        captionList:[],//三重一大原因说明数据
        adioVlue:"" ,//会议类型配置-是否生成拟上回清单id
        processMeeting:"",//会议类型配置-是否生成拟上回清单
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects:{
    // 会议类型配置查询
    *initTypeList({}, {select,call,put}) {
      const {pageSize, page }  = yield select ( state => state.meetingManageConfig);
      let postData = {
        //arg_type : '',
        arg_page_size : pageSize,
        arg_page_current : page,
        arg_type_ou_id : Cookie.get('OUID'),
      };
      let data = yield call (Services.queryAllType,postData);
      if ( data.RetCode === '1'){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
        });
        yield put ({
          type : 'save',
          payload : {
            typeList : JSON.parse(JSON.stringify(data.DataRows)),
            rowCount :data.RowCount,
            meetingTypeList : [],
            proclamationDesc:"",
            majorList:[],
            tabKey:"1",
          }
        })
      }
    },
    //查询管理配置列表 tab2
    *queryManagerList({},{ select,put,call}){
      yield put ({
        type : 'save',
        payload : {
          tabKey:"2",
          managerParam : {
            type_id : '',
            office_manager_id		: "",
            office_manager_name : '',
            dept_id :"",
          }
        }
      });
      const { page,pageSize,managerList ,typeList}  = yield select ( state => state.meetingManageConfig);
      let postData = {
        arg_ouid:Cookie.get('OUID'),
        arg_page_size : pageSize,//每页行数
        arg_page_current : page,//当前页数
      };
      let data = yield call (Services.queryManager,postData);
      if ( data.RetCode === '1'){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          typeList.length && typeList.map((ite,ind)=>{
            item.key = index;
            if(item.type_id === ind.type_id){
              item.type_name=ind.type_name;
              managerList.push({"type_name":item.type_name,})
            }
          })
        });
        yield put ({
          type : 'save',
          payload : {
            managerList : JSON.parse(JSON.stringify(data.DataRows)),
            rowCount : data.RowCount,
          }
        })
      }
      //同时查询会议列表和部门列表
      //yield put ({ type : 'queryMeetingTypeList'});
      //yield put ({ type : 'queryDeptList'});
    },
    //查询部门列表
    *queryDeptList({},{ select , put ,call}){
      const { departList }  = yield select ( state => state.meetingManageConfig);
      let postData = {};
      let data = yield call (Services.searchDeptList,postData);
      if ( data.RetCode === '1'){
        //构造一级目录结构
        data.DataRows.length && data.DataRows.map(( item,index)=>{
          if(item.nodelevel === "1"){
            departList.push(
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
        for(let j=0;j<departList.length;j++){
          for(let i = 0;i<data.DataRows.length;i++){
            if((departList[j].deptid ===  data.DataRows[i].parentid)){
              departList[j].children.push(
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
            departList : JSON.parse(JSON.stringify(departList)),
          }
        })
      }
    },
    //查詢人員列表
    *queryStaffList({value},{ select , put ,call}){
      let { staffList }  = yield select ( state => state.meetingManageConfig);
      let postData = {
        arg_dept_id : value,
      };
      let data = yield call (Services.searchStaffList,postData);
      // console.log("查詢人員列表1",data);
      if ( data.RetCode === '1'){
        data.DataRows.length &&  data.DataRows.map((item,index)=>{
          if(item.deptid == value ){
            staffList =  JSON.parse(item.deptperson)
          }
        })
        yield put ({
          type : 'save',
          payload : {
            staffList :staffList ,
          }
        })
      }
    },
    //查询会议类型服务
    *queryMeetingTypeList({},{ select,put,call}){
      const { meetingTypeList }  = yield select ( state => state.meetingManageConfig);
      let postData = {
        arg_type_ou_id : Cookie.get("OUID")
      };
      let data = yield call(Services.queryTypeSearch,postData);
      if(data.RetCode === "1"){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          meetingTypeList.push({"type_name":item.type_name,"type_id":item.type_id})
        });
      }
      yield put ({
        type : "save",
        payload : {
          meetingTypeList :meetingTypeList,
          //tempKey : getUuid(20,62),
        }
      })
    },
    //公告内容配置Tab3
    *bulletinContentList({},{ select,put,call}){
      yield put ({
        type : 'save',
        payload : {
          tabKey:"3",
        }
      });
      let postDatas = {
        arg_proclamation_ouid : Cookie.get('OUID'),
      };
      let datas = yield call(Services.bulletinoChange, postDatas);
      if ( datas.RetCode === '1'){
        yield put({
          type : "save",
          payload : {
            proclamationDesc :JSON.parse(JSON.stringify(datas.DataRows.slice(-1)[0].meetings_proclamation_desc))
          }
        });
      }
    },
    // 保存新增会议类型数据
    *saveData ({value},{ select,put,call}){
      yield put ({
        type : 'save',
        payload : {
          meetingType : value,
        }
      })
    },
    //切换会议类型配置中开关状态
    *changeTypeState({ record,checked },{ select,put,call}){
      yield put({
        type : 'save',
        payload : {
          typeState : checked === false ? '0' : '1',
          typeFlag : '2',
          meetingtypeParam :record
        }
      });
      yield put ({ type : 'confirmAddModifyMeeting'})
    },
    //新增 or 修改会议类型配置
    *confirmAddModifyMeeting({},{select,put,call}){
      const { meetingType,typeFlag ,meetingtypeParam,typeState,adioVlue}  = yield select ( state => state.meetingManageConfig);
      if (typeFlag === '1'){
        let postData = {
          arg_type_name : meetingType ,
          arg_type_level:adioVlue,
          arg_type_ou_id : Cookie.get('OUID'),
          arg_create_user_id	: Cookie.get('userid'),
          arg_create_user_name : Cookie.get('username'),
        };
        let data = yield call(Services.addType,postData);
        if (data.RetCode === '1')
        {
          message.success("会议类型配置成功");
          yield put({ type : 'initTypeList'});
          // 添加模態框清空
          yield put ({
            type : 'save',
            payload : {
              meetingType : "",
              page : 1,
            }
          })
          // window.location.reload();
        }else {
          message.error("会议类型失败");
        }
      } else if(typeFlag === '2'){
        let postData = {
          arg_type_id :		meetingtypeParam.type_id,
          arg_type_level:  adioVlue,
          //  arg_type_name : meetingtypeParam.type_name,
          arg_type_name : meetingType,
          arg_type_state : typeState,
          arg_update_user_id : Cookie.get('userid'),
          arg_update_user_name : Cookie.get('username')
        };
        let data = yield call (Services.modifyMeetingConfig,postData);
        if ( data.RetCode === '1'){
          message.info ("会议类型修改成功！");
          yield put ({type:"initTypeList"}); //修改完成后走查询服务
          yield put ({
            type:"save",
            payload:{
              meetingType:"",
            }
          })
        }else {
          message.error("修改失败！");
        }
      }
    },
    //
    *adioChange({value,key},{select,call,put}){
      yield put ({
        type : 'save',
        payload : {
          adioVlue:value,
          processMeeting:key.props.children,
        }
      })
    },
    //删除会议配置类型
    *delMeetingConfig ({ typeID },{ select,put,call}){
      let postData = {
        arg_type_id : typeID,
      };
      // console.log("删除会议配置类型",postData);
      let data = yield call (Services.delMeetingConfig,postData);
      if (data.RetCode === '1') {
        message.success("删除成功！");
        yield put ({type : 'initTypeList'})
      }else {
        message.error("删除失败");
      }
    },
    //修改会议类型配置
    *modifyMeetingConfig({record},{select,put,call}){
      let {processMeeting} = yield select( state=>state.meetingManageConfig);
      if(record.type_level === '0'){
        processMeeting ="不需选拟上会清单"
      }else if(record.type_level === '1'){
        processMeeting ="需选拟上会清单"
      }else if(record.type_level === '2'){
        processMeeting ="分管院领导专题会议"
      }
      yield put ({
        type : 'save',
        payload : {
          meetingType : record.type_name,
          adioVlue:parseInt(record.type_level.replace(/\"/g, "")),
          meetingtypeParam :record ,
          typeFlag : '2',
          typeState :"",
          processMeeting:processMeeting,
        }
      });
    },
    //修改配置管理类型
    *modifyManagerConfig({record},{select,put,call}){
      let { managerParam ,staffList} = yield select( state=>state.meetingManageConfig);
      managerParam.type_id = record.type_id;
      managerParam .office_manager_id =record.office_manager_id;
      managerParam.office_manager_name =record.office_manager_name;
      managerParam.dept_id = record.omdeptid;
      managerParam.type_name = record.type_name;
      yield put ({
        type : 'save',
        payload : {
          //  meetingType : record.type_name,
          //  meetingtypeParam :record ,
          managerFlag : '2',
          managerParam : JSON.parse(JSON.stringify(managerParam)),
          managerState : "",
        }
      });
      //单独走一遍人员查询服务
      let postData = {
        arg_dept_id : record.omdeptid,
      };
      let data = yield call (Services.searchStaffList,postData);
      if ( data.RetCode === '1'){
        data.DataRows.length &&  data.DataRows.map((item,index)=>{
          if(item.deptid == record.omdeptid ){
            staffList =  JSON.parse(item.deptperson)
          }
        });
        yield put ({
          type : 'save',
          payload : {
            staffList :staffList ,
          }
        })
      }
    },
    *saveFlag({value},{select,put,call}){
      if (value == "addType"){
        yield put ({
          type : 'save',
          payload : {
            typeFlag : '1',
          }
        });
      }else if(value == "addManager"){
        //重新查询会议类型列表
        //  yield put ({type:"queryMeetingTypeList"})
        yield put ({
          type : "save",
          payload : {
            managerFlag : '1',
            managerParam : {
              type_id : "",
              office_manager_id		: "",
              office_manager_name : "",
              dept_id :"",
            },
            departList:[],
            staffList:[],
            tempKey : getUuid(20,62),
            meetingTypeList:[],
          }
        });
      }
    },
    //变更选择部门
    *changeDept ({deptID},{ select,put,call}){
      yield put ({
        type : 'save',
        payload : {
          deptID : deptID,
        }
      });
    },

    //变更选择的人员
    *changeStaff ({ key },{select,put,call}){
      yield put({
        type : 'save',
        payload : {
          userID :key,
        }
      })
    },
    // 修改办公室管理员开关状态
    *changeManagerState({checked,record},{select,put,call}){
      const { managerParam } = yield select( state=>state.meetingManageConfig);
      managerParam.type_id = record.type_id;
      yield put ({
        type : 'save',
        payload : {
          managerState : checked === false ? '0' : '1',
          managerParam :managerParam,
          managerFlag :"2",
        }
      });
      yield put ({type : 'confirmAddModifyManager'})
    },
    // 保存修改的会议类型 id 管理员配置中
    *changeMeetingType({key},{ select,put,call}){
      const { managerParam } = yield select( state=>state.meetingManageConfig);
      managerParam.type_id = key;
      yield put({
        type:"save",
        payload : {
          managerParam : JSON.parse(JSON.stringify(managerParam)),
        }
      })
    },

    // 新增或者修改办公室管理人员
    *confirmAddModifyManager({},{ select,put,call}){
      const { managerParam,managerState ,managerFlag} = yield select( state=>state.meetingManageConfig);
      // 1 新增 2 修改
      if( managerFlag==="1"){
        let postData = {
          arg_ouid: Cookie.get("OUID"),
          arg_dept_id : managerParam.dept_id,
          arg_type_id :  managerParam.type_id,
          office_manager_id : managerParam.office_manager_id,
          office_manager_name :managerParam.office_manager_name ,
          arg_create_user_id :	Cookie.get("userid"),
          arg_create_user_name : Cookie.get("username"),
        };
        let data = yield call (Services.addManager,postData);
        if ( data.RetCode === '1'){
          message.success("新增成功！");
          yield put({ type:'queryManagerList'});
          yield put ({
            type : "save",
            payload : {
              managerParam : {
                type_id : '',
                office_manager_id		: "",
                office_manager_name : '',
                dept_id :"",
              },
              meetingTypeList:[],
              departList:[],
              staffList:[],
            }
          })
        }else {
          message.error("新增失败！")
        }
      }else if(managerFlag==="2"){
        let postData = {
          arg_dept_id : managerParam.dept_id,
          arg_type_id : managerParam.type_id,
          arg_office_manager_id		:managerParam.office_manager_id,
          arg_office_manager_name	 :	managerParam.office_manager_name ,
          arg_update_user_id		:	Cookie.get("userid"),
          arg_update_user_name	: Cookie.get("username"),
          arg_state : managerState,
        };
        let data = yield call(Services.modifyManager,postData);
        if( data.RetCode=== '1' ){
          message.success("修改成功");
          yield put({ type:'queryManagerList'});
          yield put ({
            type : 'save',
            payload : {
              managerParam : {
                //managerParam : ''  //  置成空对象????
                type_id : '',
                office_manager_id		: "",
                office_manager_name : '',
                dept_id :"",
              }
            }
          })
        }else {
          message.error('修改失败')
        }
      }
    },

    *changeManType({ key },{ select,put,call}){
      yield put({
        type : 'save',
        payload : {
          manType :key,
        }
      })
    },
    //确认增加办公室管理员
    *confirmAddManager({},{ select,put,call}){
      const { deptID,userID,manType} = yield select (state => state.meetingManageConfig);
      let postData = {
        arg_dept_id : deptID,
        arg_type_id : manType,
        office_manager_id : userID,
        office_manager_name : "",
        arg_create_user_id : Cookie.get('userid'),
        arg_create_user_name : Cookie.get('username'),
      };
      let data = yield call (Services.addManager,postData);
      if ( data.retCode === '1'){
        window.location.reload();
        message.success("新增成功！");
      }else {
        message.error("新增失败！")
      }
    },
    // 删除管理员配置
    *delManageConfig ({typeID},{select,put,call}){
      let postData = {
        arg_type_id : typeID
      };
      let data = yield call (Services.deleteManager,postData);
      if (data.RetCode === '1'){
        message.success(" 删除成功！" );
        yield put ({type : 'queryManagerList'}) // 列表查询服务
      }
    },
    *handlePage({page},{select,put,call}){
      yield put ({
        type :'save',
        payload :{
          page:page
        }
      });
      yield put ({type :'initTypeList'})
    },
    *initPage({},{select,put,call}){
      yield put ({
        type :'save',
        payload :{
          page:"1"
        }
      })
    },
    *handleManagePage({page},{select,put,call}){
      yield put ({
        type :'save',
        payload :{
          page:page
        }
      });
      yield put ({type :'queryManagerList'})
  },
    *setParam({},{select,put}){
      yield put({
        type:'save',
        payload:{
          meetingType :'',
        }})
    },
    // //保存新增管理员部门数据
    *saveDeptValue({value},{select,put,call}){
      const {managerParam} = yield select (state => state.meetingManageConfig);
        managerParam.dept_id = value;
        yield put({
          type : "save",
          payload : {
            managerParam : managerParam,
          }
        })
    },
    //保存新增管理员数据
    *saveStaffValue({value},{select,put,call}){
      console.log(value,333);
      const {managerParam} = yield select (state => state.meetingManageConfig);
      managerParam.office_manager_id = value.slice(0,value.indexOf("-"));
      managerParam.office_manager_name =value.slice(value.indexOf("-")+1,);
      yield put({
        type : "save",
        payload : {
          managerParam : JSON.parse(JSON.stringify(managerParam)),
        }
      })
      console.log(managerParam,3);
    },
    //公告内容配置
    *announcementChange({value},{put}){
      yield put({
        type : "save",
        payload : {
          proclamationDesc : value
        }
      });
    },
    //公告内容配置-确定按钮
    *determine({value},{call, select, put}){
      const {proclamationDesc} = yield select (state=>state.meetingManageConfig);
      let postData = {
        arg_meetings_proclamation_desc :  proclamationDesc ,
        arg_proclamation_ouid : Cookie.get('OUID'),
        arg_create_user_id	: Cookie.get('userid'),
        arg_create_user_name : Cookie.get('username'),
        arg_state: "1"
      };
      let data = yield call(Services.bulletinChange, postData);
      if (data.RetCode === '1'){
        let postDatas = {
          arg_proclamation_ouid : Cookie.get('OUID'),
        };
        let datas = yield call(Services.bulletinoChange, postDatas);
        console.log(datas,'datas');
        if ( datas.RetCode === '1'){
          message.success("公告内容配置成功！");
          yield put({
            type : "save",
            payload : {
              proclamationDesc :JSON.parse(JSON.stringify(datas.DataRows[0].meetings_proclamation_desc))
            }
          });
        }
      }
      else {
        message.success("公告内容配置失败！");
      }
    },
    //三重一大原因查询
    *reasonQuery({}, {call, put}){
      yield put ({
        type : 'save',
        payload : {
          majorList:  '',
          majorParameter:'',
          tabKey:"4",
        }
      });
      let reasonData = {
        arg_ouid : Cookie.get('OUID'),
      };
      let dataQuery = yield call(Services.causeInquiry,reasonData);
      if ( dataQuery.RetCode === '1'){
        dataQuery.DataRows.length && dataQuery.DataRows.map((item,index)=>{
          item.key = index;
        });
        yield put ({
          type : 'save',
          payload : {
            majorList:  JSON.parse(JSON.stringify(dataQuery.DataRows)),
            majorParameter:'',
          }
        });
      }
    },
    //三重一大原因导入
    *fileImport({response}, {put, select,call}){
      response.DataRows.map((item,index)=>{
        item.key = index;
        function find(str,cha,num){
          var x=str.indexOf(cha);
          for(var i=0;i<num;i++){
            x=str.indexOf(cha,x+1);
          }
          return x;
        }
        item.reason_name=item.transsql.substring(find(item.transsql, ',', 9)+3,find(item.transsql, ',', 10)-1);
        item.reason_code=item.transsql.substring(find(item.transsql, ',', 10)+3,find(item.transsql, ',', 11)-1);
      });
      yield put({
        type: 'save',
        payload:{
          majorList:  JSON.parse(JSON.stringify(response.DataRows)),
        }
      });
    },
    //删除-三重一大原因
    *determineDelete({record},{call,select}){
      let postData = {
        arg_reason_uuid :record.reason_uuid
      };
      let data = yield call(Services.causeDelete, postData);
      if (data.RetCode === '1') {
        message.success("删除成功！");
        window.location.reload();
      }else {
        message.error("删除失败");
      }
    },
    //点击-三重一大原因修改
    *modifyModal({record},{put,select}){
      yield put({
        type: 'save',
        payload:{
          majorDigital:record.reason_name,
          eventCode:record.reason_code,
          majorParameter:record,
        }
      });
    },
    //ok-三重一大原因修改
    *modifyImport({},{put, call, select}){
      const {majorParameter} = yield select (state=>state.meetingManageConfig);
      let postData ={
        'arg_reason_uuid':majorParameter.reason_uuid,//uuid
        'arg_reason_name':majorParameter.reason_name,//原因描述
        'arg_reason_code':majorParameter.reason_code,//原因编号
        'arg_decision_order':majorParameter.decision_order,//决策顺序
        'arg_user_id':majorParameter.create_user_id,//用户id
        'arg_user_name': majorParameter.create_user_name,//用户名称
      };
      let data = yield call (Services.causeModify,postData);
      if (data.RetCode === '1') {
        message.success("三重一大原因修改成功！");
        yield put ({type : 'reasonQuery'}) // 查询服务
      }if(data.RetCode === '0') {
        message.error("三重一大原因修改失败！");
      }
    },
    //取消-三重一大原因修改
    *modifyCancel({},{put}){
      yield put ({type : 'reasonQuery'}) // 查询服务
    },
    //三重一大原因事项编码-数据
    *eventOnChang({value},{put,select}){
      const {majorParameter} = yield select (state=>state.meetingManageConfig);
      majorParameter.reason_code = value;
      yield put({
        type : "save",
        payload : {
          eventCode : value,
        }
      });
    },
    //三重一大原因-数据
    *majorOnChang({value},{put,select}){
      const {majorParameter} = yield select (state=>state.meetingManageConfig);
      majorParameter.reason_name = value;
      yield put({
        type : "save",
        payload : {
          majorDigital : value
        }
      });
    },
    //三重一大文件说明
   *majorDocuments({},{put, select,call}){
     const {captionList} = yield select(state => state.meetingManageConfig);
     yield put({
       type:'save',
       payload:{
         tabKey:"5",
         captionList:''
       }
     });
     let postData = {
       arg_topic_id:Cookie.get('OUID'),
       arg_submit_id:'1', //批次id
     };
     let data =yield call(ManageServices.searchFileUpload,postData);
     // console.log(data.DataRows,'批次id');
     if(data.RetCode === '1'){
       let postList = data.DataRows.slice(-1);
       postList.map((item,index)=>{
         item.key=index
       });
       yield put({
         type:'save',
         payload:{
           captionList:JSON.parse(JSON.stringify(postList))
         }
       });
     }else {
       message.error(data.RetVal);
     }
   },
    //三重一大原因保存附件名称地址
    *explanationPath({value},{call,select,put}){
      // console.log(value,'value');
      const {captionList} = yield select(state => state.meetingManageConfig);
      let postData ={
        arg_upload_name:value.filename.RealFileName,//附件名称
        arg_topic_id:Cookie.get('OUID'),
        arg_upload_url:value.filename.AbsolutePath,//相对路径
        arg_upload_real_url:value.filename.RelativePath,//绝对路径
        arg_submit_id:'1', //批次id
        arg_upload_type:'1', //材料类型
        arg_upload_desc:'三重一大原因说明文件',//材料类型描述
        arg_create_user_id:Cookie.get('userid'), //用户id
        arg_create_user_name:Cookie.get('username'),//用户名称
      };
      let data =yield call(ManageServices.fileUpload,postData);
      console.log(data,'data');
      let dataMajor ={
        upload_name:value.filename.RealFileName,//附件名称
      };
      if(data.RetCode ==='1'){
        captionList.push(dataMajor);
        let postList = captionList.slice(-1);
        postList.map((item,index)=>{
          item.key=index
        });
        yield put({
          type:'save',
          payload:{
            captionList:JSON.parse(JSON.stringify(postList))
          }
        });
      }else {
        message.error(data.RetVal);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetManage/config') {
          dispatch({type: 'initData'});
          dispatch({type: 'initTypeList',query}); // 会议类型配置查询
          dispatch({type: 'bulletinInquiry',query});//办公室管理员-公告内容配置-查询
          dispatch({type: 'reasonQuery',query});//办公室管理员-三重一大原因查询
          dispatch({type: 'majorDocuments',query});//三重一大文件说明查询
        }
      });
    },
  }
}
