/**
 * 作者：薛刚
 * 创建日期：2018-03-11
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：合作伙伴信息撤回
 */
import * as partnerService from '../../../services/project/partnerService';
import Cookie from 'js-cookie';
import {message} from 'antd';

export default {
  namespace: 'recall',
  state:{
    deptProjectList: [],//部门项目列表
    selectProjectList: [],//勾选的部门列表
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
      {key: '12', name: '十二月'}],// 月份列表
    yearList: [],
    checkList: [],
    projParam: {
      arg_total_year:'',
      arg_total_month:[],
      arg_proj_code:[],
    },
    selectedList: [], // 退回勾选的数据
    selectedShowList: [], // 退回勾选预览数据（table多选）
    rowCount: 0,
    page: 1,
    pageSize: 10,
    selectedRowKeys: [],
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
     * 作者：薛刚
     * 日期：2019-03-11
     * 邮箱：xueg@chinaunicom.cn
     * 说明：服务评价退回初始化
     **/
    *init({},{ select, call, put }){
      let { yearList,projParam } = yield select(state => state.recall);
      //初始化年份
      let date = new Date();
      let year = date.getFullYear();
      //初始化年份为当前年
      projParam.arg_total_year = year.toString();
      while(year >= 2019) {
        yearList.push(year.toString());
        year--;
      }
      projParam.arg_total_month=[];
      projParam.arg_proj_code=[];
      //当前登录账号查看项目权限列表
      let postData={
        arg_dept_id: Cookie.get('dept_id'),
      };
      let data = yield call(partnerService.searchDept, postData);
      if(data.RetCode == '1'){
        yield put({
          type : 'save',
          payload:{
            deptProjectList : JSON.parse(JSON.stringify(data.DataRows)),
            yearList: yearList,
            projParam: projParam,
            selectedShowList: [], // 退回勾选预览数据（table多选）
            selectedRowKeys: [],
          }
        });
      }else{
        message.error('查询项目列表失败');
      }
      // 进行待审核服务评价查询
      yield put({
        type : 'queryProject',
      });
    },

    /**
     * 作者：薛刚
     * 日期：2019-03-11
     * 邮箱：xueg@chinaunicom.cn
     * 说明：服务评价待退回数据查询
     **/
    *queryProject({},{ select, put, call }){
      let { projParam, page, pageSize } = yield select(state => state.recall);
      let postData={
        arg_user_id: Cookie.get('staff_id'),
        arg_dept_id: Cookie.get('dept_id'),
        arg_total_year: projParam.arg_total_year,
        arg_total_month: projParam.arg_total_month,
        arg_proj_code: projParam.arg_proj_code,
        arg_page_size: pageSize,
        arg_page_current: page,
      };
      let data = yield call(partnerService.workloadCanRecallService, postData);
      if(data.RetCode == '1'){
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
          payload: {
            projParam: projParam,
            checkList: checkList,
            rowCount: data.RowCount
          }
        });
      }
    },
    /**
     * 作者：薛刚
     * 日期：2019-03-11
     * 邮箱：xueg@chinaunicom.cn
     * 说明：保存查询条件数据
     **/
    *saveCheckInfo({ value, typeItem },{ select, call, put }){
      let { projParam } = yield select(state => state.recall);
      if(typeItem === 'year'){
        projParam.arg_total_year = value;
      }else if(typeItem === 'month'){
        if(value.length != 0){
          projParam.arg_total_month = value.join(',');
        }else {
          projParam.arg_total_month = '';
        }
      }else if(typeItem === 'project'){
        if(value.length != 0){
          projParam.arg_proj_code = value.join(',');
        }else {
          projParam.arg_proj_code = '';
        }
      }
      yield put({
        type : 'save',
        payload:{
          projParam: projParam,
          selectedRowKeys: [], // 清空勾选的数据
        }
      });
      yield put({
        type: 'queryProject'
      });
    },

    /**
     * 作者：薛刚
     * 日期：2019-03-11
     * 邮箱：xueg@chinaunicom.cn
     * 说明：勾选待撤回数据保存(记录年、月、项目名称以进行审核确定)
     **/
    *saveSelectedInfo({ selectedRows, selectedRowKeys },{ call, put, select }) {
      let { selectedList } = yield select(state => state.recall);
      //selectedShowList 用来展示勾选数据 selectedList 用来作为提交审核请求数据使用
      const selectedShowList = selectedRows;
      for(let i=0; i<selectedRows.length; i++){
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
        selectedList.push({
          arg_total_year: selectedRows[i].total_year,
          arg_total_month: selectedRows[i].total_month,
          arg_proj_code: selectedRows[i].proj_code,
          arg_partner_id: selectedRows[i].partner_id,
        });
      }

      yield put({
        type : 'save',
        payload:{
          selectedList: selectedList,
          selectedShowList: selectedShowList,
          selectedRowKeys: selectedRowKeys
        }
      });

    },

    /**
     * 作者：薛刚
     * 日期：2019-03-11
     * 邮箱：xueg@chinaunicom.cn
     * 说明：服务评价撤回确定
     **/
    *recallWorkloadService({},{ select, put, call }){
      let { selectedList } = yield select(state =>state.recall);
      let postData = {
        arg_info: JSON.stringify(selectedList),// 数据为JSON格式，转化为JSON字符串传给后端
        arg_state: '5'
      }
      const data = yield call(partnerService.workloadRecallService, postData);
      if(data.RetCode=='1'){
        // 将页码设置为1
        yield put({
          type: 'save',
          payload: {
            page: 1,
          }
        });
        //查询项目数据
        yield put({
          type : 'queryProject'
        });
        // 翻页初始化选择状态数据
        yield put({
          type : 'saveSelectedInfo',
          selectedRows: [],
          selectedRowKeys: [],
        });
      }else {
        message.error('撤回失败');
      }
    },

    /**
     * 作者：薛刚
     * 创建日期：2019-3-10
     * 功能：动态处理页码
     * @param page 当前页码值
     */
    *handlePageChange({ page }, { put }) {
      yield put({
        type: 'save',
        payload: {
          page: page,
        }
      });
      // 查询当年的所有数据
      yield put({
        type : 'queryProject',
      });
      // 翻页初始化选择状态数据
      yield put({
        type : 'saveSelectedInfo',
        selectedRows: [],
        selectedRowKeys: [],
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/purchase/infoRecall') {
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  }
}
