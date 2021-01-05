/**
 * 作者：张楠华
 * 日期：2017-09-13
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核结果逻辑
 */
import * as usersService1 from '../../../services/employer/statistic.js'
import * as hrService from '../../../services/hr/hrService.js';
import * as service from '../../../services/employer/search';
import {getToday} from '../../../components/meetSystem/meetConst.js'
import {TENANT_ID} from '../../../utils/config'
import {message} from 'antd'
import Cookie from 'js-cookie';

export default {
  namespace: 'result',
  state: {
    list: [],
    resultList: [],
    resuleRatioList: [],
    query: {},
    oulist: [],
    userflag:false,
    matchDept:[],
    season:"",
    year:"",
    focusDept:[],
    fenothers:0 //分院副院长
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-09-13
     * 功能：保存部门数据
     */
    deptsave(state, {list: DataRows}) {
      return {...state, list: DataRows};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-13
     * 功能：保存结果数据
     */
    resultsave(state, {resultList: DataRows}) {
      return {...state, resultList: DataRows};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-13
     * 功能：保存ou数据
     */
    ousave(state, {oulist: DataRows, resultList: resultList, list: list}) {
      return {...state, oulist: DataRows, resultList: resultList, list: list};
    },

    save(state, action) {
      return {...state, ...action.payload};
    },

    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },

  effects: {

      //share model need clear last data
    * clearDate({},{put}){
      yield put({
        type: 'saveinfo',
        payload:{
          resultList:[],
        }
      });
    },


    /**
     * 作者：张楠华
     * 创建日期：2017-09-13
     * 功能：初始化，查询ou，查询部门，查询出默认结果
     */
    * InitSearch({}, {call, put}) {
      const postData = {
        arg_tenantid: TENANT_ID,
      };
      let userflag=0,matchDept=[],fenothers=0;
      const data = yield call(usersService1.initOuSearch, postData);
      const postData1 = {
        arg_ou: localStorage.ou,
        arg_tenantid: TENANT_ID,
      };
      const data1 = yield call(usersService1.searchDeptList, postData1);
      const postData2 = {
        arg_year: new Date().getFullYear().toString(),
        arg_season: Math.floor((new Date().getMonth() + 1 + 2) / 3).toString(),
        arg_ou: localStorage.ou,
      };
      const data2 = yield call(usersService1.resultQueryService, postData2);


      const basicInfoData = yield call(hrService.selfinfoquery);
      if (basicInfoData.RetCode == '1'&&basicInfoData.DataRows.length!=0) {

         if(basicInfoData.DataRows[0].post_name=="分院院长"||basicInfoData.DataRows[0].post_name=="分院副院长"){
          const existUser= yield call(usersService1.getusersByroleid,{
            arg_roleid: "7a72674becda11ea85f80242ac11000b",
            arg_flag: "1",
            arg_deptname:basicInfoData.DataRows[0].deptname
          });
          if(existUser.RetCode === '1'&&existUser.DataRows.length!=0){
            userflag=existUser.DataRows.some(item=>item.userid==Cookie.get('userid'))//true代表有 false 代表没有
          }else {
            message.error(existUser.RetVal);
           }

         }
         
         if(basicInfoData.DataRows[0].post_name=="分院副院长"){
          fenothers=1
          const deptUser= yield call(usersService1.departmentQuery,{
            arg_tenantid:10010,
            arg_ou_name:Cookie.get('OU'),
            arg_page_size:10,
            arg_page_current:1
          });

          if(deptUser.RetCode === '1'){
             matchDept=(deptUser.DataRows||[]).filter(item=>item.managerid==Cookie.get('userid'))
          }else {
            message.error(deptUser.RetVal);
           }

         }
         }
         
      yield put({
        type: 'save',
        payload:{
          oulist: data.DataRows,
          list: data1.DataRows,
          resultList: data2.DataRows,
          userflag,
          matchDept,
          fenothers:fenothers
        }

      });

    },

    *backTime({},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })
           yield put({type:"InitBpSearch"})
      }
     },

    *InitBpSearch({objData},{call,put,select}){
      let {year,season}=yield select(state=>state.result)
      let  DataRows=[],focusDept=[];
      //ou
      let  postData = {
        arg_tenantid: TENANT_ID,
      };
      let  data = yield call(usersService1.initOuSearch, postData);
      //dept
      let  postData1 = {
        arg_ou: localStorage.ou,
        arg_tenantid: TENANT_ID,
      };
      let  data1 = yield call(usersService1.searchDeptList, postData1);
      //focusDept
      let result= yield call(service.BPinfo, {
        state:3,
        flag:0,
        upt:Cookie.get('userid'),
        staff_id:Cookie.get('userid')
       });
        if(result.RetCode=='1'&&result.DataRows&&result.DataRows.length!=0){
         let deptarry=result.DataRows.map(item=>{
            let obj={"principal_deptid":item.principal_deptid,"principal_deptname":item.principal_deptname}
             return obj
          })
          let obj = {}
          let newArr = []
          newArr = deptarry.reduce((item, next) => {
            obj[next.principal_deptname] ? ' ' : obj[next.principal_deptname] = true && item.push(next)
            return item 
          }, [])
          focusDept=newArr
          //info
         let bpdata= yield call(service.bpResultQuery, {
          arg_year:objData?objData.year||year:year,
          arg_season:objData?objData.season||season:season,
          arg_cur_year:year,
          arg_cur_season:season,
          arg_pu_dept_name:objData?objData.focusName||result.DataRows[0].principal_deptname:result.DataRows[0].principal_deptname,
          arg_flag:objData?objData.role||0:0
         });

         if(bpdata.RetCode=='1'&&bpdata.DataRows.length!=0){
          DataRows=bpdata.DataRows
         }else{
          message.warning("暂无数据") 
          yield put({
            type: 'saveinfo',
            payload:{
              resultList: [],
            }
          });
         }

        }else{
          message.warning("未配置归口部门")
        }

      yield put({
        type: 'save',
        payload:{
          oulist: data.DataRows,
          list: data1.DataRows,
          resultList: DataRows,
          focusDept
        }

      });
    },

    // 同步
    * updateOrCancelRatio({flag,arg_year,arg_season,arg_userid,showResult}, {call, put}) {
      const postData = {
        arg_year:arg_year,
        arg_season: arg_season,
        arg_userid: arg_userid,
      };

      if (flag === 'update'){
        const data = yield call(usersService1.updateRatioS, postData);

        if(data.RetCode === '1'){
          message.success('同步成功')
          showResult()
        }else {
          message.error(data.RetVal)
        }
      }else if(flag === 'cancel'){
        const data = yield call(usersService1.cancelRatioS, postData);

        if(data.RetCode === '1'){
          message.success('撤销成功')
          showResult()
        }else {
          message.error(data.RetVal)
        }
      }else{
        console.log('not update or cancel')
      }

    },

    // 撤销


    /*// 为数据添加项目系数和项目考核系数
    * convertData({}, {call, put, select}) {
      let {resultList, resuleRatioList} = yield select(state => state.result)

      if(resuleRatioList && resuleRatioList.length !== 0){
        resultList.forEach(item => {
          let targetItem = resuleRatioList.filter(item2 => item2.staff_id === item.staff_id)[0]
          item.proj_ratio = targetItem.proj_ratio
          item.proj_exam_ratio = targetItem.proj_exam_ratio
        })
      }else {
        message.info('项目系数和项目考核系数无返回！')
      }



      yield put({
        type: 'save',
        payload:{
          resultList: resultList,
        }

      });
    },*/
    /**
     * 作者：张楠华
     * 创建日期：2017-09-13
     * 功能：查询组织单元对应的部门信息
     * @param arg_company_type 部门信息
     * @param call 后台调用
     * @param put 存参
     */
    * DeptSearch({arg_company_type = 0}, {call, put}) {
      const postData = {
        arg_ou: arg_company_type,
        arg_tenantid: TENANT_ID,
      };
      const data = yield call(usersService1.searchDeptList, postData);
      yield put({
        type: 'deptsave',
        list: data.DataRows,
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-09-13
     * 功能：查询最终返回结果，如果部门为空，查询全部。
     * @param arg_company_type 部门信息
     * @param arg_dept_name 部门信息
     * @param arg_year_type 年度信息
     * @param arg_season_type 季度
     * @param call 后台调用
     * @param put 存参
     */* resultcrtl({arg_company_type = 0, arg_dept_name = 0, arg_year_type = 0, arg_season_type = 0}, {call, put}) {
      let postData = {
        arg_year: arg_year_type,
        arg_season: arg_season_type,
        arg_ou: arg_company_type,
      };


      if (arg_dept_name != "全部") {
        postData.arg_dept_name = arg_dept_name;
      }

      const {DataRows} = yield call(usersService1.resultQueryService, postData);
      yield put({
        type: 'save',
        payload:{
          resultList: DataRows,
        }

      });
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/humanApp/employer/result') {
          dispatch({type: 'clearDate'});
          dispatch({type: 'InitSearch', query});
        }
        if (pathname === '/humanApp/employer/bpresult'){
          dispatch({type: 'clearDate'});
          dispatch({type: 'backTime'});
        }
      });
    },
  },
};
