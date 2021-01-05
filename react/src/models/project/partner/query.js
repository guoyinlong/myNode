/**
 * 作者：薛刚
 * 创建日期：2019-03-06
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现合作伙伴信息查询功能
 */
import * as partnerService from '../../../services/project/partnerService';
import * as projServices from '../../../services/project/projService';
import Cookie from 'js-cookie';
import { message } from 'antd';

export default {
  namespace: 'partnerInfoQuery',
  state:{
    user:{key: '',year:''},
    yearList: [], // 年度列表
    monthStatus:{key:''},
    monthList:[
      {disabled:false, key: '1', name: '一月'},
      {disabled:false, key: '2', name: '二月'},
      {disabled:false, key: '3', name: '三月'},
      {disabled:false, key: '4', name: '四月'},
      {disabled:false, key: '5', name: '五月'},
      {disabled:false, key: '6', name: '六月'},
      {disabled:false, key: '7', name: '七月'},
      {disabled:false, key: '8', name: '八月'},
      {disabled:false, key: '9', name: '九月'},
      {disabled:false, key: '10', name: '十月'},
      {disabled:false, key: '11', name: '十一月'},
      {disabled:false, key: '12', name: '十二月'}],// 月份列表
    deptList: [], // 部门列表
    projList: [], // 项目列表
    partnerList: [], // 合作伙伴列表
    workloadList: [],
    deptName:'',
    monthSta:'',  //月份状态值 0 == 1~6   1 == 7~12
    monthValue : [],
    // 查询的参数列表
    params: {
      arg_total_year: '',
      arg_total_month: '',
      arg_dept_id: '',
      arg_proj_id: '',
      arg_partner_id: '',
      arg_state:''
    },
    workload_h: 0, // 高级工作量
    workload_m: 0, // 中级工作量
    workload_l: 0,
    rowCount: 0,
    page: 1,
    pageSize: 10,
    exportWorkloadList: [],
    total: {
      total_m: 0,
      total_h: 0,
      total_l: 0,
      total: 0,
    },
    deptInfo: '',
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
     * 日期：2019-03-06
     * 邮箱：xueg@chinaunicom.cn
     * 说明：服务评价审核初始化（获取当年及前后五年）
     **/
    *init( _ ,{ select, call, put }){
      const { yearList, params, user } = yield select(state => state.partnerInfoQuery);
      // 初始化年份
      const date = new Date();
      let year = date.getFullYear();
      // 初始化年份为当前年
      params.arg_total_year = year.toString();
      while(year >= 2019) {
        yearList.push(year.toString());
        year--;
      }
      if (yearList[0] == params.arg_total_year) {
        user.year = '2020'
      }
      params.arg_total_month=[];
      params.arg_dept_id=[];
      params.arg_proj_id=[];
      params.arg_partner_id=[];
      yield put({
        type : 'save',
        payload:{
          yearList: yearList,
          params: params,
          user: user
        }
      });
      // 查询部门列表
      const puData = yield call(projServices.departmentQuery, {
        partner_name: Cookie.get('tenantid')
      });
      if (puData.RetCode === '1') {
        const list = puData.DataRows;
        let deptName = '';
        list.map((item)=> {
          deptName = item.pu_dept_name.split('-')[1] + ', ' + deptName;
        })
        yield put({
          type: 'save',
          payload: {
            deptList: list,
            deptInfo: deptName.substr(0, deptName.length-2)
          }
        });
      }
      // 查询项目列表
      yield put({
        type : 'queryProjectList',
      });
      // 查询合作伙伴
      const partnerData = yield call(partnerService.queryPartner, {
        arg_null: '',
      });
      if(partnerData.RetCode == '1'){
        yield put({
          type : 'save',
          payload:{
            partnerList: JSON.parse(JSON.stringify(partnerData.DataRows)),
          }
        });
      }else{
        message.error('查询合作伙伴列表失败');
      }
      // 查询当年的所有数据
      yield put({
        type : 'queryWorkload',
      });
    },

    /**
     * 作者：薛刚
     * 日期：2019-03-18
     * 邮箱：xueg@chinaunicom.cn
     * 说明：项目名称列表查询
     **/
    *queryProjectList( _ , { call, put, select }) {
      const { params } = yield select(state => state.partnerInfoQuery);
      // 查询项目列表
      const projData = yield call(partnerService.searchDept, {
        arg_dept_id: params.arg_dept_id,
      });
      if(projData.RetCode == '1'){
        yield put({
          type : 'save',
          payload:{
            projList: JSON.parse(JSON.stringify(projData.DataRows)),
          }
        });
      }else{
        message.error('查询项目列表失败');
      }
    },

    /**
     * 作者：薛刚
     * 日期：2019-03-08
     * 邮箱：xueg@chinaunicom.cn
     * 说明：服务评价工作量查询
     **/
    *queryWorkload( _ ,{ put, call, select }){
      const { params, page, pageSize, monthStatus, deptName } = yield select(state => state.partnerInfoQuery);
      const partnerWorkloadData = yield call(partnerService.searchWorkloadService, {
        arg_total_year: params.arg_total_year,
        arg_total_month: params.arg_total_month,
        partner_name: params.partner_name,
        proj_name: params.proj_name,
        arg_state: params.arg_state,
        arg_page_size: pageSize,
        arg_page_current: page,
        arg_dept_id: params.arg_dept_id,
        arg_proj_id: params.arg_proj_id,
        arg_partner_id: params.arg_partner_id,
      });
      if(partnerWorkloadData.RetCode == '1'){
        const workloadData = JSON.parse(JSON.stringify(partnerWorkloadData.DataRows));
        const data = [];
        let dept = []
        workloadData.map((Item) => {
          const workloadObj = {
            month: Item.total_month,
            total_month: Item.total_year+"-"+Item.total_month,
            proj_name: Item.proj_name,
            partner_name: Item.partner_name,
            service_sum: Item.service_sum,
            attend_score: Item.attend_score,
            delivery_score: Item.delivery_score,
            manage_score: Item.manage_score,
            quality_score: Item.quality_score,
            stability_score: Item.stability_score,
            invest_score: Item.invest_score
          };
          dept.push(Item.pu_dept_name)
          dept = [...new Set(dept)]
          const workloadList = JSON.parse(Item.workload);
          for(let i=0; i<workloadList.length; i++) {
            if(workloadList[i].staff_level === "中级(含税)"){
              workloadObj.month_work_cnt_m = workloadList[i].month_work_cnt;
              workloadObj.other_month_work_cnt_m = workloadList[i].other_month_work_cnt;
              workloadObj.workload_sum_m = workloadList[i].workload_sum;
            }else if(workloadList[i].staff_level === "高级(含税)"){
              workloadObj.month_work_cnt_h = workloadList[i].month_work_cnt;
              workloadObj.other_month_work_cnt_h = workloadList[i].other_month_work_cnt;
              workloadObj.workload_sum_h = workloadList[i].workload_sum;
            }else if(workloadList[i].staff_level === "初级(含税)"){
              workloadObj.month_work_cnt_l = workloadList[i].month_work_cnt;
              workloadObj.other_month_work_cnt_l = workloadList[i].other_month_work_cnt;
              workloadObj.workload_sum_l = workloadList[i].workload_sum;
            }
          }
          
          data.push(workloadObj);
        });
        yield put({
          type : 'save',
          payload:{
            workloadList: data,
            rowCount: partnerWorkloadData.RowCount,
            monthStatus,
            deptName: dept  
          }
        });
        // 查询当年的工作量之和
        yield put({
          type : 'queryWorkloadSum',
        });
        // 查询导出的所有数据
        yield put({
          type : 'exportWorkload',
        });
      }else{
        message.error('查询合作伙伴工作量列表失败');
      }
      //查询全部数据
      const list = yield call(partnerService.searchWorkloadService, {
        arg_total_year: params.arg_total_year,
        arg_total_month: params.arg_total_month,
        partner_name: params.partner_name,
        proj_name: params.proj_name,
        arg_state: params.arg_state,
        arg_dept_id: params.arg_dept_id,
        arg_proj_id: params.arg_proj_id,
        arg_partner_id: params.arg_partner_id,
      });
      if (list.RetCode == '1') {
        let Data = JSON.parse(JSON.stringify(list.DataRows));
        let dept = []
        Data.map((Item)=>{
         dept.push(Item.pu_dept_name)
         dept = [...new Set(dept)]
        })
        yield put({
          type:"save",
          payload:{
            deptName:dept
          }
        })
      }else{
        message.error('查询合作伙伴所有数据失败');
      }
    },

    /**
     * 作者：薛刚
     * 日期：2019-04-08
     * 邮箱：xueg@chinaunicom.cn
     * 说明：工作量导出查询（全部工作量）
     **/
    *exportWorkload( _ ,{ put, call, select }){
      const { params } = yield select(state => state.partnerInfoQuery);
      const partnerWorkloadData = yield call(partnerService.searchWorkloadService, {
        arg_total_year: params.arg_total_year,
        arg_total_month: params.arg_total_month,
        arg_dept_id: params.arg_dept_id,
        arg_proj_id: params.arg_proj_id,
        arg_partner_id: params.arg_partner_id
      });
      if(partnerWorkloadData.RetCode == '1'){
        const workloadData = JSON.parse(JSON.stringify(partnerWorkloadData.DataRows));
        const data = [];
        let total_m = 0, total_h = 0, total_l = 0;
        workloadData.map((Item) => {
          const workloadObj = {
            total_month: Item.total_year+"-"+Item.total_month,
            proj_name: Item.proj_name,
            partner_name: Item.partner_name,
            service_sum: Item.service_sum,
            attend_score: Item.attend_score,
            delivery_score: Item.delivery_score,
            manage_score: Item.manage_score,
            quality_score: Item.quality_score,
            stability_score: Item.stability_score,
            proj_code : Item.proj_code,
            mgr_name : Item.mgr_name,
            dept_name : Item.dept_name,
            arg_state : Item.stateStr,
            invest_score:Item.invest_score
          };
          const workloadList = JSON.parse(Item.workload);
          for(let i=0; i<workloadList.length; i++) {
            if(workloadList[i].staff_level === "中级(含税)"){
              workloadObj.month_work_cnt_m = workloadList[i].month_work_cnt;
              workloadObj.other_month_work_cnt_m = workloadList[i].other_month_work_cnt;
              workloadObj.workload_sum_m = workloadList[i].workload_sum;
              total_m += Number(workloadList[i].workload_sum);
            }else if(workloadList[i].staff_level === "高级(含税)"){
              workloadObj.month_work_cnt_h = workloadList[i].month_work_cnt;
              workloadObj.other_month_work_cnt_h = workloadList[i].other_month_work_cnt;
              workloadObj.workload_sum_h = workloadList[i].workload_sum;
              total_h += Number(workloadList[i].workload_sum);
            }else if(workloadList[i].staff_level === "初级(含税)"){
              workloadObj.month_work_cnt_l = workloadList[i].month_work_cnt;
              workloadObj.other_month_work_cnt_l = workloadList[i].other_month_work_cnt;
              workloadObj.workload_sum_l = workloadList[i].workload_sum;
              total_l += Number(workloadList[i].workload_sum);
            }
          }
          data.push(workloadObj);
        });
        yield put({
          type : 'save',
          payload:{
            exportWorkloadList: data,
            total: {
              total_m: total_m,
              total_h: total_h,
              total_l: total_l,
              total: total_m + total_h + total_l,
            },
          }
        });
      }else{
        message.error('查询合作伙伴工作量列表失败');
      }
    },

    /**
     * 作者：薛刚
     * 日期：2019-03-10
     * 邮箱：xueg@chinaunicom.cn
     * 说明：服务评价工作量总和计算
     **/
    *queryWorkloadSum( _ ,{ put, call, select }){
      const { params } = yield select(state => state.partnerInfoQuery);
      const partnerWorkloadData = yield call(partnerService.searchWorkloadSumService, {
        arg_total_year: params.arg_total_year,
        arg_total_month: params.arg_total_month,
        arg_dept_id: params.arg_dept_id,
        arg_proj_id: params.arg_proj_id,
        arg_partner_id: params.arg_partner_id,
        arg_state: params.paramsarg_state
      });
      if(partnerWorkloadData.RetCode == '1'){
        const workloadData = JSON.parse(JSON.stringify(partnerWorkloadData.DataRows));
        let workload_l = 0, workload_m = 0, workload_h = 0;
        workloadData.map((Item) => {
          if(Item.staff_level === "高级(含税)") {
            workload_h = Item.workload_sum
          } else if(Item.staff_level === "中级(含税)") {
            workload_m = Item.workload_sum
          } else if(Item.staff_level === "初级(含税)") {
            workload_l = Item.workload_sum
          }
        });
        yield put({
          type : 'save',
          payload:{
            workload_l: workload_l,
            workload_m: workload_m,
            workload_h: workload_h,
          }
        });
      }else{
        message.error('查询合作伙伴工作量列表失败');
      }
    },

    /**
     * 作者：薛刚
     * 日期：2019-03-08
     * 邮箱：xueg@chinaunicom.cn
     * 说明：保存查询条件数据
     **/
    *saveSelectInfo({ value, typeItem ,status},{ select, call, put }){
      const { params, deptList, monthList ,user, monthSta} = yield select(state => state.partnerInfoQuery);
      if (user.year == "2020") {
        if (status<7) {
          user.key = "y"
          yield put({
            type:'save',
            payload:{
              user:user
            }
          })
        }else{
          user.key = "n"
          yield put({
            type:'save',
            payload:{
              user:user
            }
          })
        }
      }
      if(typeItem === 'year'){
        if(value == '2019'){
          // ==y就是旧版
        user.key = 'y'
        user.year = '2019'
        yield put({
          type:'save',
          payload:{
            user:user
          }
        })
      }else if (value !== '2019') {
        if (status<7) {
          user.key = "y"
          yield put({
            type:'save',
            payload:{
              user:user
            }
          })
        }else{
          user.key = "n"
          yield put({
            type:'save',
            payload:{
              user:user
            }
          })
        }
      }
        params.arg_total_year = value;
      }else if(typeItem === 'month') {
        let status = ''
          if(value.length!=0 ){
            if (user.year == '2020') {
              if (value[0]<7) {
                status = '0'
            }else if(value[0]>6){
                status = '1'
            }
          }
          yield put({
            type: 'save',
            payload:{
              monthSta: status,
              monthValue : value
            }
          });
          params.arg_total_month = value.join(',');
        }else {
          params.arg_total_month = '';
        }
      }else if(typeItem == 'dept') {
        if(value.length != 0){
          params.arg_dept_id = value.join(',');
          let deptInfo = '';
          deptList.map((item) => {
            for(let i=0; i<value.length; i++) {
              if(value[i] === item.pu_dept_id) {
                deptInfo += item.pu_dept_name.split('-')[1] + ', '
              }
            }
          });
          // 保存部门信息
          yield put({
            type: 'save',
            payload:{
              deptInfo: deptInfo.substr(0, deptInfo.length-2),
            }
          });
        }else {
          params.arg_dept_id = '';
        }
      }else if(typeItem === 'project'){
        if(value.length != 0){
          params.arg_proj_id = value.join(',');
        }else {
          params.arg_proj_id = '';
        }
      } else if(typeItem === 'partner') {
        if(value.length != 0){
          params.arg_partner_id = value.join(',');
        }else {
          params.arg_partner_id = '';
        }
      }
      // 保存条件
      yield put({
        type: 'save',
        payload:{
          params : params,
        }
      })
      yield put({
        type: 'queryWorkload'
      });
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
          page: page
        }
      });
      // 查询当年的所有数据
      yield put({
        type : 'queryWorkload',
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/purchase/infoQuery') {
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  }
}
