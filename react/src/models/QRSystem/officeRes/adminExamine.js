/**
 * 作者：张枫
 * 创建日期：2019-09-06
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：我的待办-审核
 */
import * as Service from './../../../services/QRCode/officeResService.js';
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import { message } from "antd";
export default {
  namespace:'adminExamine',
  state:{
    roleType:"",//用户角色
    argType:"",//申请性质 /申请类型 0 首次申请 1 延期申请
    applyId:"",//申请id
    staffList:[],//申请人员列表
    staffData:[],//申请信息
    reason:"",//退回原因
    prop:"",// 0 流动人员 1 为常驻人员
    beginTime:"",// 开始时间
    endTime:"",//结束时间
    infraContent:[],//工位区域图形图
    infraIdList:[],//工位区域id 用于查询工位区域工位情况
    infraList:[],// 工位区域使用情况
    infraContentData:[],// 区域工位数据
    saveIdList : [],//保存的暂存工位
    queryRec:{},// 待办列表跳转到审核页面数据
    selectedNum:0,// 已选工位
    sumNum:0 ,// 申请工位数量
    infraContentDataSeven:[],//区域工位
    pageName:"",// 页面名称  用于返回页面用
    tempSaveData:[],//暂存工位数据
    id:"",//工位区域id
    submitdata:"",//待提交工位ID
    isLoading:true,
  },
  reducers:{
    initData(state) {
      return{
        roleType:"",//用户角色
        argType:"",//申请性质 /申请类型 0 首次申请 1 延期申请
        applyId:"",//申请id
        staffList:[],//申请人员列表
        staffData:[],//申请信息
        reason:"",//退回原因
        prop:"",// 0 流动人员 1 为常驻人员
        beginTime:"",// 开始时间
        endTime:"",//结束时间
        infraContent:[],//工位区域图形图
        infraIdList:[],//工位区域id 用于查询工位区域工位情况
        infraList:[],// 工位区域使用情况
        infraContentData:[],// 区域工位数据
        saveIdList : [],//保存的暂存工位
        queryRec:{},// 待办列表跳转到审核页面数据
        selectedNum:0,// 已选工位
        sumNum:0 ,// 申请工位数量
        infraContentDataSeven:[],//区域工位
        pageName:"",// 页面名称  用于返回页面用
        tempSaveData:[],//暂存工位数据
        id:"",//工位区域id
        submitdata:"",//待提交工位ID
        isLoading:true,
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects:{
    /**
     * 作者：张枫
     * 创建日期：2019-09-06
     * 邮件：zhangf142@chinaunicom.cn
     * 流动人员延期工位申请
     */
    *queryApplyHistory({}, {select,call,put}) {
      const {applyId, argType} = yield select(state=>state.adminExamine);
      let temp = "";
      let postData = {
        arg_apply_id:applyId,
        //arg_apply_time_left:"",
        //arg_apply_time_right:"",
        // arg_end_time_left:"",
        //arg_end_time_right:"",
        arg_type:argType,//申请类型 0初次申请 1 延期申请
        // arg_state:"",
        // arg_current_page:"",
        //arg_page_size:"",
      }
      let data = yield call(Service.queryApplyHistory,postData);
      if( data.RetVal === "1"){
        if( data.DataRows.length !== 0) {
          temp = JSON.parse(data.DataRows[0].details);
          temp.map((item, index)=> {
            item.key = index
          })
        }
   /**

        if( data.DataRows[0].length !== 0) {
          temp = JSON.parse(data.DataRows[0].details);
          temp.map((item, index)=> {
            item.key = index
          })
        }
    **/
        yield put({
          type:"save",
          payload:{
            //staffList:JSON.parse(data.DataRows[0].details),
            staffList:temp,
            staffData:data.DataRows[0]
          }
        })
      }
    },
    // 从待办列表跳转过来 保存跳转数据  (跳转至审批页面带过去的数据)
    *saveQueryRecord({query},{put}){
      yield put({
        type:"save",
        payload:{
          queryRec:query,
        }
      })
    },
    //查询用户角色  0 管理层、1、总院办公室 2 属地管理员 3 部门经理  4 部门属地管理员 5 普通员工
    *queryUserAssetsRole({},{select,call,put}){
      const {queryRec} =  yield select(state=>state.adminExamine);
      let data = yield call(Service.queryUserAssetsRole,"")
      yield put({
        type:"save",
        payload:{
          roleType:data.RoleTypeId,
          argType:queryRec.type_id,//0  初次申请 1 延期申请
          applyId:queryRec.apply_id,
          prop:queryRec.prop,
          beginTime:queryRec.begin_time,
          endTime:queryRec.end_time,
          sumNum:queryRec.num,
        }
      });
      yield put({type:"queryApplyHistory"});
      //查询当前工位图
      yield put({type:"assetsUseDateShow"});
    },
    // 查询暂存工位数据
    *queryTempSaveData({},{select,put,call}){
     // let {queryRec,tempSaveData} =  yield select(state=>state.adminExamine);
      let {queryRec} =  yield select(state=>state.adminExamine);
      //tempSaveData = [];
      let postData = {
        arg_apply_id:queryRec.apply_id,
      };
      let data = yield call(Service.queryTempSavedAssetsCount,postData);
      if(data.RetCode == "1"){
        yield put({
          type:"save",
          payload:{
            tempSaveData:data.DataRows,
          }
        })
      }

    },

    // 查询工位区域图  东北 西北 七层
    *assetsUseDateShow({},{select,put,call}){
      let {beginTime, endTime,infraIdList} =  yield select(state=>state.adminExamine);
      infraIdList = [];
      let postData = {
        arg_begin_time:beginTime,
        arg_end_time:endTime,
       // arg_infra_id:"",
      };
      let data = yield call(Service.assetsUseDateShow,postData);
      // 保存 工位区域id 列表 用于
      if(data.RetCode === "1"){
        if(data.DataRows !==0){
          data.DataRows.map((item,index)=>{
            infraIdList.push(item.id)
          })
        }
        yield put({
          type:"save",
          payload:{
            infraContent:JSON.parse(JSON.stringify(data.DataRows)),
            infraIdList:infraIdList,
          }
        })
      }
      //查询完工位区域图  查询各区域工位占用情况
      yield put({type:"assetsUseStatistic"})
    },
    // 查询工位占用情况
    *assetsUseStatistic({},{select,call,put}){
      //let { infraIdList,beginTime,endTime,infraList} = yield select(state=>state.adminExamine);
      // infraList = [];
      let { infraIdList,beginTime,endTime} = yield select(state=>state.adminExamine);
       let infraListTemp = [];
      if(infraIdList.length !=0){
        for(let i = 0;i<infraIdList.length;i++){
          let postData = {
            arg_infra_id: infraIdList[i],
            arg_begin_time: beginTime,
            arg_end_time: endTime,
          };
          const data = yield call(Service.assetsUseStatistic, postData);
          if (data.RetCode === "1") {
            //infraList.push(data)
            infraListTemp.push(data)
          }
        }
      }
     // yield put({type: "save", payload: {infraList: infraList,isLoading:false}})
      yield put({type: "save", payload: {infraList: infraListTemp,isLoading:false}})
    },

    // 工位情况
    *queryAssetsUseDateShow({query,callback},{select,put,call}){
      //const {beginTime, endTime} =  yield select(state=>state.adminExamine);
      let postData = {
        arg_begin_time:query.beginTime,
        arg_end_time:query.endTime,
        arg_infra_id:query.id,
      };
      let data = yield call(Service.assetsUseDateShow,postData);
      if(data.RetCode == "1"){
        yield put({
          type:"save",
          payload:{
            infraContentData:JSON.parse(JSON.stringify(data.DataRows)),
          }
        })
      }
      yield put({type:"queryAssectsTempSave",query:query});
    },
    // 查询工位保存情况
    *queryAssectsTempSave({query},{ select,put,call}){
      //let { infraContentData ,selectedNum} = yield select(state=>state.adminExamine);
      //selectedNum = 0;
      let { infraContentData } = yield select(state=>state.adminExamine);
     // selectedNum = 0;
      let postData ={
        arg_apply_id:query.applyId,
      };
      const data = yield call(Service.queryAssectsTempSave,postData)
      if(data.RetCode === "1"){
        let temp = data.assets_ids.split(",");
        let num = 0;  // 整个申请单已保存区域工位个数
        if(temp[0] == "") {
          temp = temp.slice(1);
        }
        // 判断 有没有保存过的工位  若有 则改变工位的状态 使前端展示位选中状态
        for(let i = 0;i<temp.length ;i++){
          num=num+1;
          for (let j=0;j<infraContentData.length;j++){
            if(temp[i]==infraContentData[j].refer_assets_id && infraContentData[j].state == 3 ){
              infraContentData[j].state = 5;
            }
          }
        }
        yield put({
          type:"save",
          payload:{
            saveIdList:temp,
            infraContentData:infraContentData,
            selectedNum:num,
          }
        })
      }
    },
    //查询工位保存情况  ***********后期新增
    *querySaved({},{select,put,call}){
      const {queryRec} = yield select(state=>state.adminExamine);
      let postData ={
        arg_apply_id:queryRec.apply_id,
      };
      const data = yield call(Service.queryAssectsTempSave,postData)
      if(data.RetCode ==="1"){
        yield put({
          type:"save",
          payload:{
            submitdata:data.assets_ids
          }
        })
      }
    },
    // 审核退回
    *reviewAssetsApplyReturn({data},{select,put,call}){
      const {applyId,reason} = yield select(state=>state.adminExamine);
      let postData = {
        arg_review_type:data,// 0 退回  1 通过
        arg_apply_id:applyId,
        arg_reason:reason,
        arg_assets_ids:"",
      };
      let result = yield call(Service.reviewAssetsApply,postData);
      // 如果通过或者退回成功 跳转回待办列表页面
      if(result.RetCode === "1"){
        message.success("退回成功！")
        yield put(
          routerRedux.push({
            pathname:"adminApp/compRes/todoList"
          })
        )
        // 如果 退回成功 把暂存的工位释放   将saveIdList 置空  并走工位暂存服务
        yield put({
          type:"save",
          payload:{saveIdList:[]}
        })
        yield put ({type:"saveSelect"})
      }
    },
    // 属地管理员审核通过
    *reviewAssetsApplyPass({data},{select,put,call}){
      const {applyId,saveIdList,submitdata} = yield select(state=>state.adminExamine);
      console.log("saveIdList ")
      console.log(saveIdList)
      let temp = saveIdList.join(",");
      console.log("saveIdList.join(,)")
      console.log(temp)
      let postData = {
        arg_review_type:data,// 0 退回  1 通过
        arg_apply_id:applyId,
        arg_reason:"",
       // arg_assets_ids:temp,
        arg_assets_ids:submitdata,
      };
      let result = yield call(Service.reviewAssetsApply,postData);
      // 如果通过或者退回成功 跳转回待办列表页面
      if(result.RetCode === "1"){
        yield put(
          routerRedux.push({
            pathname:"adminApp/compRes/todoList"
          })
        )
      }
    },
    //保存退回原因
    *saveReason({data},{put}){
      yield put({type:"save",payload:{reason:data}})
    },
    // 保存 工位选择
    *saveWorkplace({data},{ select,put,call}){
      let {infraContentData ,saveIdList,selectedNum} = yield select(state=>state.adminExamine);
      let num = selectedNum;
      // 判断选中的工位为 5 则置为 4 闲置资源，如果为4 则置为5
      for (let i=0;i<infraContentData.length;i++){
        if(infraContentData[i].id === data.id){
          if(infraContentData[i].state == 3){
            infraContentData[i].state = 5;
          }else if( infraContentData[i].state === 5){
            infraContentData[i].state = 3;
          }
        }
      }
      // 判断点击的工位是否在列表中
      const temp = saveIdList.indexOf(data.refer_assets_id);
      if(temp > -1){
        saveIdList.splice(temp,1);
        num = num-1;
      }else {
        saveIdList.push(data.refer_assets_id);
        num = num+1;
      }
      yield put ({
        type:"save",
        payload:{
          infraContentData:JSON.parse(JSON.stringify(infraContentData)),
          saveIdList:saveIdList,
          selectedNum:num,
        }
      })
    },
    // 选择工位后暂存工位
    *saveSelect({},{select,put,call}){
      let {saveIdList,applyId} = yield select(state=>state.adminExamine);
      let saveIdStr = saveIdList.join(",");  // 将数组转化为以逗号间隔的字符串
      let postData = {
        arg_apply_id:applyId,
        arg_asset_ids:saveIdStr,
      };
      let data = yield call(Service.saveAssetsTemporary,postData);
      if(data.RetVal == "1"){
        message.info("暂存成功！")
      }
    },
    //  以下为 7层工位服务及数据相关
    // 查询七层区域图形数据
    *queryAssetsUseDateShowSeven({query},{ select,put,call}){
      let postData = {
        arg_begin_time:query.beginTime,
        arg_end_time:query.endTime,
        arg_infra_id:query.id,
      };
      let data = yield call(Service.assetsUseDateShow,postData);
      if(data.RetCode == "1"){
        yield put({
          type:"save",
          payload:{
            infraContentDataSeven:JSON.parse(JSON.stringify(data.DataRows)),
            pageName:query.pageName,
            id:query.id,
          }
        })
      }
    //  yield put({type:"queryAssectsTempSave",query:query});
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // 跳转至工位审批页面
        if (pathname === '/adminApp/compRes/todoList/adminExamine') {
          dispatch({type:'initData'});
          dispatch({type:'saveQueryRecord',query});
          dispatch({type:'queryUserAssetsRole'});
          dispatch({type:"queryTempSaveData"});
          dispatch({type:"querySaved"})
        }
        //跳转至工位分配页面   西北 东北数据查询  工位 包括7楼各个区域
        else if (pathname === '/adminApp/compRes/todoList/adminExamine/assignPage' || pathname === '/adminApp/compRes/todoList/adminExamine/assignPageSevenDetails'){
          dispatch({type:'queryAssetsUseDateShow',query});
          // 查询工位服务  查询工位暂存服务
         // dispatch({type:'queryAssectsTempSave',query});
        }
        // 本部7层工位查询 总区域图
        else if(pathname === '/adminApp/compRes/todoList/adminExamine/assignPageSeven'){
          dispatch({type:'queryAssetsUseDateShowSeven',query});
        }
      });
    },
  }
}
