/**
 * 作者：张枫
 * 创建日期：2019-02-28
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：实现合作伙伴信息审核功能
 */
import * as partnerService from '../../../services/project/partnerService';
import Cookie from 'js-cookie';
import {message} from 'antd';

export default {
  namespace:'check',
  state:{
    deptProjectList:[],//部门项目列表
    selectProjectList:[],//勾选的部门列表
    monthList:[
      {key: '1', name: '一月'},
      {key: '2', name: '二月'},
      {key: '3', name: '三月'},
      {key: '4', name: '四月'},
      {key: '5', name: '五月'},
      {key: '6', name: '六月'},
      {key: '7', name: '七月'},
      {key: '8', name: '八月'},
      {key: '9', name: '九月'},
      {key: '10', name: '十月'},
      {key: '11', name: '十一月'},
      {key: '12', name: '十二月'}],
    isButtonVisible : true, //确定退回按钮是否可选
    yearList:[],
    checkList:[],
    checkListMerge:[],
    selectedRowKeys:[],
    rowCount: 0,
    page: 1,
    pageSize: 10,
    projParam:{
      arg_total_year:'',
      arg_total_month:'',
      arg_proj_code:'',
    },
    selectedList:[],//审核勾选的数据
    selectedShowList :[], //退回勾选预览数据（table多选）

  },
  reducers: {
    initData(state){
      return {
        ...state,
      }
    },
    save(state, action){
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  effects:{
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：服务评价审核初始化
     **/
    *init({},{select,call,put}){
      let { yearList,projParam } = yield select(state =>state.check);
      //初始化年份
      let date = new Date;
      let year =date.getFullYear();
      //初始化年份为当前年
      projParam.arg_total_year = year.toString();
      while(year >= 2019) {
        yearList.push(year.toString());
        year--;
      }
      projParam.arg_total_month='';
      projParam.arg_proj_code='';
      //当前登录账号查看项目权限列表
      let postData={
        arg_dept_id:Cookie.get('dept_id'),
      };
      let data = yield call(partnerService.searchDept, postData);
      if(data.RetCode=='1'){
        yield put({
          type : 'save',
          payload:{
            deptProjectList : JSON.parse(JSON.stringify(data.DataRows)),
            yearList:yearList,
            projParam:projParam,
            selectedRowKeys:[],
            selectedList:[],//审核勾选的数据
            selectedShowList :[], //退回勾选预览数据（table多选）
          }
        });
      }else{
        message.error('查询项目列表失败');
      }
      // 进行待审核服务评价查询
      yield put({type : 'queryProject',});
    },
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：服务评价待审核数据查询
     **/
    *queryProject({},{select,put,call}){
      let {projParam,page,pageSize} = yield select(state =>state.check);
      let postData={
        arg_user_id:Cookie.get('staff_id'),
        arg_dept_id:Cookie.get('dept_id'),
        arg_total_year:projParam.arg_total_year,
        arg_total_month:projParam.arg_total_month,
        arg_proj_code:projParam.arg_proj_code,
        arg_page_size:pageSize,
        arg_page_current:page,
      };
      let data = yield call(partnerService.searckForCheck, postData);
      if(data.RetCode=='1'){
        data.DataRows.forEach((item,index) => {
          item.key = index;
        });
        //更改数据格式，将workload内层数据挪到外层
        let checkList = JSON.parse(JSON.stringify(data.DataRows));
        for(let i =0;i<checkList.length;i++){
          //拼接年月 展示年月
          checkList[i].total_year_month = checkList[i].total_year+"-"+checkList[i].total_month;
          let workload = JSON.parse(checkList[i].workload);
          for(let j =0;j<workload.length;j++){
            if(workload[j].staff_level=="中级(含税)"){
              checkList[i].month_work_cnt_m=workload[j].month_work_cnt;
              checkList[i].other_month_work_cnt_m=workload[j].other_month_work_cnt;
              checkList[i].workload_sum_m=workload[j].workload_sum;
          }else if(workload[j].staff_level=="高级(含税)"){
              checkList[i].month_work_cnt_h=workload[j].month_work_cnt;
              checkList[i].other_month_work_cnt_h=workload[j].other_month_work_cnt;
              checkList[i].workload_sum_h=workload[j].workload_sum;
            }else if(workload[j].staff_level=="初级(含税)"){
              checkList[i].month_work_cnt_l=workload[j].month_work_cnt;
              checkList[i].other_month_work_cnt_l=workload[j].other_month_work_cnt;
              checkList[i].workload_sum_l=workload[j].workload_sum;
            }
          }
          // 供服务审核评价详情数据使用
          checkList[i].serviceList = [];
          checkList[i].serviceList[i] = new Object();
          checkList[i].serviceList[i].attend_score=checkList[i].attend_score;
          checkList[i].serviceList[i].delivery_score=checkList[i].delivery_score;
          checkList[i].serviceList[i].manage_score=checkList[i].manage_score;
          checkList[i].serviceList[i].quality_score=checkList[i].quality_score;
          checkList[i].serviceList[i].stability_score=checkList[i].stability_score;
          checkList[i].serviceList[i].service_sum=checkList[i].service_sum;
        }
        yield put({
          type : 'save',
          payload:{
            projParam:projParam,  //保存查询记录
            checkList : checkList,
            rowCount : data.RowCount,
          }
        });
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：保存查询条件数据
     **/
    *saveCheckInfo({value,typeItem},{select,call,put}){
      let {projParam} = yield select(state =>state.check);
      if(typeItem=='year'){
        projParam.arg_total_year=value;
      }else if(typeItem=='month'){
        if(value.length!=0){
          let tempValue = value.join(',');
          projParam.arg_total_month=tempValue;
        }else {
          projParam.arg_total_month='';
        }
      }else if(typeItem=='project'){
        if(value.length!=0){
          let tempValue = value.join(',');
          projParam.arg_proj_code=tempValue;
        }else {
          projParam.arg_proj_code='';
        }
      }
      yield put({
        type : 'save',
        payload:{
          projParam : projParam,
          selectedRowKeys: [], // 清空勾选的数据
        }
      });
      yield put({type:'queryProject'});
    },
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：勾选待审核审核数据保存(记录年、月、项目名称以进行审核确定)
     **/
      *saveSelectedInfo({selectedRows,selectedRowKeys},{call,put,select}){
      let {selectedList,selectedShowList,isButtonVisible} = yield select(state =>state.check);
      selectedList=[];
      // 退回 确定显示控制
      if(selectedRows.length!=0){
        isButtonVisible = false;
      }else if(selectedRows.length==0){
        isButtonVisible = true;
      }
      //selectedShowList 用来展示勾选数据  退回模态框中使用    selectedList 用来作为提交退回审核请求数据使用
      selectedShowList = JSON.parse(JSON.stringify(selectedRows));
      for(let i=0;i<selectedRows.length;i++){

        /**
        selectedShowList[i].total_year_month = selectedRows[i].total_year+"-"+selectedRows[i].total_month;
        //用来提供模态框详情数据
        selectedShowList[i].serviceList = [];
        selectedShowList[i].serviceList[i] = new Object();
        selectedShowList[i].serviceList[i].attend_score=selectedRows[i].attend_score;
        selectedShowList[i].serviceList[i].delivery_score=selectedRows[i].delivery_score;
        selectedShowList[i].serviceList[i].manage_score=selectedRows[i].manage_score;
        selectedShowList[i].serviceList[i].quality_score=selectedRows[i].quality_score;
        selectedShowList[i].serviceList[i].stability_score=selectedRows[i].stability_score;
        selectedShowList[i].serviceList[i].service_sum=selectedRows[i].service_sum;
        // 退回审核数据  字段
         **/
        selectedList.push(
          {arg_total_year:selectedRows[i].total_year,arg_total_month:selectedRows[i].total_month,arg_proj_code:selectedRows[i].proj_code,arg_partner_id:selectedRows[i].partner_id}
        );
      }
      for (let i = 0;i<selectedShowList.length;){

        delete selectedShowList[i].sum;
        delete selectedShowList[i].sum_date;

        let count =0;
        for (let j=i;j<selectedShowList.length;j++){
          if(selectedShowList[i].proj_name==selectedShowList[j].proj_name&&selectedShowList[i].total_year_month==selectedShowList[j].total_year_month){
            count++;          }
        }
        selectedShowList[i].sum =count; //项目名称重复数据记录
        selectedShowList[i].sum_date =count; // 年月重复数据记录
        i += count;
      }

      for (let i = 0;i<selectedShowList.length;i++){
        if("sum" in selectedShowList[i] ){
        }
        else {
          selectedShowList[i].sum =0;
          selectedShowList[i].sum_date =0;
        }
      }
      yield put({
        type : 'save',
        payload:{
          selectedList : JSON.parse(JSON.stringify(selectedList)),
          selectedShowList :JSON.parse(JSON.stringify(selectedShowList)),
          selectedRowKeys:selectedRowKeys,
          isButtonVisible:isButtonVisible,
        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：服务评价审核确定(通过审核)
     **/
    *checkWorkloadService({},{select,put,call}){
      let {selectedList} = yield select(state =>state.check);
      let postData = {
        arg_info:JSON.stringify(selectedList),// 数据为JSON格式，转化为JSON字符串传给后端
        arg_state:'0'//0 通过 4 退回
      }
      const data = yield call(partnerService.checkWorkloadService, postData);
      if(data.RetCode=='1'){
        //初始化
        yield put({
          type : 'save',
          payload:{
            selectedRowKeys:[],
            selectedList:[],
            isButtonVisible : true,
            page:1,
          }
        });
        yield put({
          type : 'queryProject'
        });
      }else {
        message.error('审核失败');
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：审核退回
     **/
      *retreatService({},{select,put,call}){
      let {selectedList} = yield select(state =>state.check);
      let postData = {
        arg_info:JSON.stringify(selectedList),// 数据为JSON格式，转化为JSON字符串传给后端
        arg_state:'4'//0 通过 4 退回
      }
      const data = yield call(partnerService.checkWorkloadService, postData);
      if(data.RetCode=='1'){
        message.success("退回成功");
        yield put ({
          type:'save',
          payload:{
            selectedRowKeys:[],
            selectedShowList :[],
            selectedList:[],
            isButtonVisible : true,
            page:1,

          }
        });
        yield put({
          type : 'queryProject'
        });

      }
      else {
        message.error("退回失败");
      }
    },
    //页码处理
    *handlePageChange({ page }, { put }) {
      yield put({
        type: 'save',
        payload: {
          page: page,
          selectedRowKeys:[],
          selectedList:[],
         // selectedList:[],
        }
      });
      // 查询当年的所有数据
      yield put({
        type : 'queryProject',
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/purchase/infoCheck') {
          dispatch({type:'init',query});
        }
      });
    },
  }
}
