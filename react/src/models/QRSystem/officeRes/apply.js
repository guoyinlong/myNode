/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请
 */
import * as Service from './../../../services/QRCode/officeResService.js';
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from "dva/router";

export default {
  namespace:'apply',
  state:{
    applyType:"0",//0 为流动类型 1 为常驻类型
    flowStaffList:[],//流动人员列表
    flowStaffListRevise:[],//流动人员列表-修改数据
    staffNum:"",//流动人员申请数量
    beginTime:"",//流动人员开始时间
    endTime:"",//流动人员结束时间
    applyReson:"",//流动人员工位申请原因
    postFlowStaffList:[],
    staffList:[],//常驻人员 申请人员列表
    fixApplyDate:"",//常驻人员申请开始时间
    fixReason:"",//常驻人员申请原因
    fixRowSelectList:[],//常驻人员申请勾选数据
    fixStaffNum:"",//常驻人员申请数量
    // 常驻人员页码信息
    page:1,
    pageSize :10,
    total:0,
    AbnormalList:[],// 导入的不可申请人员数据
    selectData:"",//点击修改 流动人员数据  点击的数据信息
  },
  reducers:{
    initData(state) {
      return{
        applyType:"0",//0 为流动类型 1 为常驻类型
        flowStaffList:[],//流动人员列表
        flowStaffListRevise:[],//流动人员列表-修改数据
        staffNum:"",//流动人员申请数量
        beginTime:"",//流动人员开始时间
        endTime:"",//流动人员结束时间
        applyReson:"",//流动人员工位申请原因
        postFlowStaffList:[],
        staffList:[],//常驻人员 申请人员列表
        fixApplyDate:"",//常驻人员申请开始时间
        fixReason:"",//常驻人员申请原因
        fixRowSelectList:[],//常驻人员申请勾选数据
        fixStaffNum:"",//常驻人员申请数量
        // 常驻人员页码信息
        page:1,
        pageSize :10,
        total:0,
        AbnormalList:[],// 导入的不可申请人员数据
        selectData:"",//点击修改 流动人员数据  点击的数据信息
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects:{
    //保存申请类型
    *saveApplyType({applyType},{put}){
      yield put ({type:"save", payload:{applyType:applyType}})
    },
    //常驻人员 申请人员列表查询
    *staffQuery({}, {call,put,select}) {
      let { page ,pageSize } = yield select( state=>state.apply)
      let postData = {
        arg_page_size:pageSize,
        arg_current_page:page,
      };
      let data = yield call(Service.queryAssetsApplicantInfo,postData);
      if(data.RetCode === "1"){
        if(data.DataRows.length!=0){
          data.DataRows.map((item,index)=>{
            item.key = index;
          })
        }
        }
        yield put({
          type:"save",
          payload :{
            staffList:data.DataRows,
            total:Number(data.RowCount),
            // 清空流动之前保存的数据

            flowStaffList:[],//流动人员列表
            flowStaffListRevise:[],//流动人员列表-修改数据
            staffNum:"",//流动人员申请数量
            beginTime:"",//流动人员开始时间
            endTime:"",//流动人员结束时间
            applyReson:"",//流动人员工位申请原因
            postFlowStaffList:[],
            AbnormalList:[],// 导入的不可申请人员数据
            selectData:"",//点击修改 流动人员数据  点击的数据信息
          }
        })
      },
    // 清空 填写的流动人员数据
    *clearHistory({}, {call,put,select}) {
      yield put({
        type:"save",
        payload :{
          staffList:[],//常驻人员 申请人员列表
          fixApplyDate:"",//常驻人员申请开始时间
          fixReason:"",//常驻人员申请原因
          fixRowSelectList:[],//常驻人员申请勾选数据
          fixStaffNum:"",//常驻人员申请数量
          // 常驻人员页码信息
          page:1,
          pageSize :10,
          total:0,
        }
      })
    },
    //保存流动人员数据
    *saveFolwStaff({data}, {put,select}) {
     // let { postFlowStaffList ,applyType,flowStaffListRevise} = yield select( state=>state.apply)
      data.length !==0 && data.map((item,index)=>{
        item.key = index;
      })
      yield put({
        type:"save",
        payload:{
          flowStaffList:JSON.parse(JSON.stringify(data)),
          flowStaffListRevise:data,
          staffNum:data.length,
        }
      })
    },
    /**
    //保存流动人员数据
    *saveFolwStaff({data}, {put,select}) {
      let { postFlowStaffList ,applyType} = yield select( state=>state.apply)
      data.length !==0 && data.map((item,index)=>{
        item.key = index;
        postFlowStaffList.push(
          {
            "user_id":item.staff_idnumber,
            "user_name":item.staff_name,
            "tel":item.staff_phone,
            "prop":applyType === "0"?"外部":"内部",
            "ex_project_name":item.project_name,
            "ex_project_id":item.project_code,
            "ex_project_dept_name":item.project_dept,
            "ex_project_charger_name":item.project_principal,
            "ex_project_charger_tel":item.project_principal_phone,
            "ex_vendor":item.vendor_name,
            "ex_charger_name":item.vendor_principal,
            "ex_charger_tel":item.vendor_principal_phone
          }
        )
      })
      yield put({
        type:"save",
        payload:{
          flowStaffList:data,
          staffNum:data.length,
          postFlowStaffList:postFlowStaffList
        }
      })
    },
     **/
      *saveRevise({data,saveType},{select ,put ,call}){
      let { selectData,flowStaffListRevise}= yield select( state => state.apply);
    //  flowStaffListRevise = [];
     // flowStaffListRevise = JSON.parse(JSON.stringify(flowStaffList))
      if(flowStaffListRevise.length !=0){
        flowStaffListRevise.map((item,index)=>{
          if(item.staff_idnumber === selectData.staff_idnumber){
            item[saveType]=data
          }
        })
      }
      yield put({
        type:"save",
        payload:{
          flowStaffListRevise,
        }
      })
    },
/**
    // 流动人员数据修改   （未点击模态框确定按钮前的修改）
    *saveRevise({data,saveType},{select ,put ,call}){
      let { flowStaffList ,selectData,flowStaffListRevise}= yield select( state => state.apply);
      flowStaffListRevise = [];
      flowStaffListRevise = JSON.parse(JSON.stringify(flowStaffList))
      if(flowStaffListRevise.length !=0){
        flowStaffListRevise.map((item,index)=>{
          if(item.staff_idnumber === selectData.staff_idnumber){
            item[saveType]=data
          }
        })
      }
      console.log("--------------flowStaffListRevise");
      console.log(flowStaffListRevise)
      //  flowStaffList[saveType]=data
      yield put({
        type:"save",
        payload:{
          flowStaffListRevise,
        }
      })
      console.log("1111111111111111111")
    },
    **/
    // 保存模态框中的修改的数据   点击模态框确认
    *saveReviseData({},{select,put,call}){
     // let { flowStaffList ,flowStaffListRevise}= yield select( state => state.apply);
      let {flowStaffListRevise}= yield select( state => state.apply);
     // flowStaffList = [],
      yield put({
        type:"save",
        payload:{
          flowStaffList:flowStaffListRevise
        }
      })
    },
    //  保存点击的数据
    *gotoRevise({data},{select,put,call}){
      yield put({
        type:"save",
        payload:{
        selectData:data
      }
    })
    },
    //清空流动人员数据
    *clearFolwStaff({}, {put}) {
      yield put({
        type:"save",
        payload:{
          flowStaffList:[],
          postFlowStaffList:[],
        }
      })
    },
    // 保存流动人员时间数据
    *saveDate({data},{ select,put,call}){
      yield put({
        type:"save",
        payload:{
          beginTime:data[0],
          endTime:data[1],
        }
      })
    },
    //保存流动人员申请原因
    *saveInput({data},{select,put,call}){
      yield put({
        type:"save",
        payload:{
          applyReson:data,
        }
      })
    },
    //流动人员数据提交
    *flowSubmit({},{select,call,put}){
      let { applyType,beginTime,endTime,applyReson,postFlowStaffList,flowStaffList }= yield select( state => state.apply)
      flowStaffList.length !==0 && flowStaffList.map((item,index)=>{
        item.key = index;
        postFlowStaffList.push(
          {
            "user_id":item.staff_idnumber,
            "user_name":item.staff_name,
            "tel":item.staff_phone,
            "prop":applyType === "0"?"外部":"内部",
            "ex_project_name":item.project_name,
            "ex_project_id":item.project_code,
            "ex_project_dept_name":item.project_dept,
            "ex_project_charger_name":item.project_principal,
            "ex_project_charger_tel":item.project_principal_phone,
            "ex_vendor":item.vendor_name,
            "ex_charger_name":item.vendor_principal,
            "ex_charger_tel":item.vendor_principal_phone
          }
        )
      })
      let postData = {
        arg_type : 0,
        arg_prop : Number(applyType),
       // arg_number:staffNum,
        arg_number:postFlowStaffList.length,
        arg_begin_time:beginTime,
        arg_end_time:endTime,
        arg_reason:applyReson,
        arg_person:JSON.stringify(postFlowStaffList),
      };
      let data = yield call(Service.applyFormCommit,postData);
      if( data.RetCode === "1"){
        message.success("提交成功！");
        yield put({
            type:"save",
            payload:{
              flowStaffList:[],//流动人员列表
              flowStaffListRevise:[],//流动人员列表-修改数据
              staffNum:"",//流动人员申请数量
              beginTime:"",//流动人员开始时间
              endTime:"",//流动人员结束时间
              applyReson:"",//流动人员工位申请原因
              postFlowStaffList:[],
            }
          })
        // 提交成功后跳回首页
        yield put(
          routerRedux.push({pathname:"adminApp/compRes/officeResMain"})
        )
      }
      else{
        message.error(data.RetVal);
        yield put({
          type:"save",
          payload:{
            AbnormalList:data.AbnormalUserInfo,  //  提交失败数据处理
            postFlowStaffList:[],
          }
        })
      }

    },
    //保存常驻人员开始申请时间
    *saveFixDate({data},{select,put,call}){
      yield put ({type:"save",payload:{fixApplyDate:data}})
    },
    // 保存常驻人员申请原因
    *saveFixReason({data},{select,put,call}){
      yield put ({type:"save",payload:{fixReason:data}})
    },
    //保存常驻人员要提交的数据
    *fixRowSelect({data},{select,put,call}){
      let {fixRowSelectList,applyType} = yield select(state=>state.apply)
      fixRowSelectList = [];
      data.length !==0 && data.map((item,index)=>{
        //item.key = index;
        fixRowSelectList.push(
          {
            "user_id":item.userid,
            "user_name":item.username,
            "tel":item.tel,
            "prop":applyType === "0"?"外部":"内部",
            "in_email":item.email,
          }
        )
      })
      yield put ({type:"save",payload:{fixRowSelectList:fixRowSelectList,fixStaffNum:data.length}})
    },
    // 常驻人员提交申请
    *submitFixed({},{put,call,select}){
      let { applyType,fixApplyDate,fixReason ,fixRowSelectList,fixStaffNum}= yield select( state => state.apply)
      let postData = {
        arg_type : 0,//0 初次申请
        arg_prop : Number(applyType),// 0流动人员 1 常驻人员
        arg_number:fixStaffNum,//申请数量
        //arg_days:"2",
        arg_begin_time:fixApplyDate,
        arg_end_time:"2020-09-02",
        arg_reason:fixReason,
        arg_person:JSON.stringify(fixRowSelectList),
      };
      let data = yield call(Service.applyFormCommit,postData);
      if( data.RetCode === "1"){
        message.success("提交成功")
        yield put({
          type : "save",
          payload:{
            applyType:"0",//0 为流动类型 1 为常驻类型
            staffList:[],//常驻人员 申请人员列表
            fixApplyDate:"",//常驻人员申请开始时间
            fixReason:"",//常驻人员申请原因
            fixRowSelectList:[],//常驻人员申请勾选数据
            fixStaffNum:"",//常驻人员申请数量
            // 常驻人员页码信息
            page:1,
          }
        })
        yield put(
          routerRedux.push({pathname:"adminApp/compRes/officeResMain"})
        )
      }else {
        message.error(data.RetVal)
      }
    },
    // 修改常驻人员页码
    *changePage({data},{put}){
      yield put ({type:"save",payload:{page:data}})
      yield put ({type:"staffQuery"})
    },
    //删除流动人员数据
    *delStaffData({data},{select,put}){
      let {flowStaffList,} = yield select(state=>state.apply);
      //删除导入人员数据
      for(let i=0;i<flowStaffList.length;i++){
        if(data.staff_idnumber === flowStaffList[i].staff_idnumber ){
          flowStaffList.splice(i,1);
        }
      }

      /**
      //删除导入人员待提交格式数据
      for(let j=0;j<postFlowStaffList.length;j++){
        if(data.staff_idnumber === postFlowStaffList[j].user_id ){
          postFlowStaffList.splice(j,1);
        }
      }
       **/
      yield put({
        type:"save",
        payload: ({
            flowStaffList:JSON.parse(JSON.stringify(flowStaffList)),
            staffNum:flowStaffList.length,
            flowStaffListRevise:JSON.parse(JSON.stringify(flowStaffList))
        //    postFlowStaffList:JSON.parse(JSON.stringify(postFlowStaffList)),
        })
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/officeResMain/apply') {
          dispatch({type: 'initData'});
        }
      });
    },
  }
}
