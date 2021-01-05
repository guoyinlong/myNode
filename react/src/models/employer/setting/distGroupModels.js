/**
 * 文件说明：正态分布群体配置操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-12-6
 */
import * as service from '../../../services/employer/empservices';
import message from '../../../components/commonApp/message'
import * as usersService1 from '../../../services/employer/statistic.js'
import {TENANT_ID,EVAL_MIDDLE_LEADER_POST_ID} from '../../../utils/config'
import Cookie from 'js-cookie';
let year = new Date().getFullYear().toString();
let season = Math.ceil((new Date().getMonth() + 1) / 3).toString();
if(new Date().getMonth() < 3){
  year = (new Date().getFullYear() - 1).toString()
}
export default {
  namespace : 'distgroup',
  state : {
    distList:[],
    year:year,
    season:season,
    checkerList:[],
    ouList:[],
    deptList:[],
    groupList:[],
    year_search: year||"",
    season_search: season,
    dept_name_search: '',
    tab_desc_search:'',
    //分布群体 1：综合绩效员工  2：项目经理  3：项目绩效员工  4：全部员工
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveRes(state, {distList}){
      return {
        ...state,
        distList:[...distList]
      };
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveOuDeptRes(state, {ouList,deptList}){
      return {
        ...state,
        ouList:[...ouList],
        deptList:[...deptList],
      };
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveDeptRes(state, {deptList}){
      return {
        ...state,
        deptList:[...deptList],
      };
    },
    /**
     * 功能：更新状态树-审核人
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态树
     * @param checkerList 审核人列表
     */
    saveEmpLeader(state, {checkerList}){
      return {
        ...state,
        checkerList
      };
    },
    /**
     * 功能：更新状态树-审待分布群体
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态树
     * @param checkerList 待分布群体列表
     */
    saveGroup(state, {groupList}){
      return {
        ...state,
        groupList
      };
    },

    save(state, action) {
      return {...state, ...action.payload};
    },
  },

  effects : {
    /**
     * 功能：查询该部门经理分布tab项
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 正态分布动态配置
     */
    *deptTabSearch({flag}, {call, put}) {
      // console.log('gengxinle')
      if(flag === '0'){
        yield put({type: 'InitSearch'});
        yield put({type: 'empCheckerSearch'});
        yield put({type: 'toDistGroupSearch'});
      }

      const deptRes = yield call(service.deptDistGroupSearch,
        {
          'arg_year':year,
          // "arg_season":season
        });
      if(deptRes.RetCode==='1' && deptRes.DataRows && deptRes.DataRows.length){
        yield put({
          type: 'saveRes',
          distList:deptRes.DataRows
        });
        yield put({
          type: 'search'
        })
      }else{
        // message.error("未查询到待分布群体信息！")
      }
    },

    /**
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 功能：初始化，查询ou，查询部门
     */
      *InitSearch({}, { call, put }) {
      const postData={
        arg_tenantid:TENANT_ID,
      };
      const data = yield call(usersService1.initOuSearch, postData);
      if(data.RetCode === '1'){
        const postData1={
          arg_ou:localStorage.ou,
          arg_tenantid:TENANT_ID,
        };
        const data1= yield call(usersService1.searchDeptList, postData1);
        if(data1.RetCode === '1'){
          yield put({
            type: 'saveOuDeptRes',
            ouList: data.DataRows,
            deptList:data1.DataRows
          });
        }

      }

    },
    /**
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 功能：查询组织单元对应的部门信息
     * @param arg_company_type 部门信息
     * @param call 后台调用
     * @param put 存参
     */
      *DeptSearch({arg_company_type=0}, { call, put }) {
      const postData1={
        arg_ou:arg_company_type,
        arg_tenantid:TENANT_ID,
      };
      const data1= yield call(usersService1.searchDeptList, postData1);
      yield put({
        type: 'saveDeptRes',
        deptList:data1.DataRows
      });
    },
    /**
     * 功能：员工审核人信息查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *empCheckerSearch({query}, {call, put}) {
      const empLeaderRes = yield call(service.empLeaderCheckerSearch,
        {
          arg_roleid:EVAL_MIDDLE_LEADER_POST_ID,
          arg_flag:'1',
          arg_deptname:Cookie.get('dept_name')
        });
      if(empLeaderRes.RetCode==='1' && empLeaderRes.DataRows && empLeaderRes.DataRows.length != 0){
        yield put({
          type: 'saveEmpLeader',
          checkerList: empLeaderRes.DataRows
        });
      }else{
        message.warning("未查询到审核人信息！")
      }
    },
    /**
     * 功能：待分布群体查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *toDistGroupSearch({}, {call, put}) {
      const groupRes = yield call(service.toDistGroupSearch,
        {
          transjsonarray:JSON.stringify({"condition":{"state":'0'},"sequence":[{"sortnum":'1'}]})
        });
      if(groupRes.RetCode==='1' && groupRes.DataRows && groupRes.DataRows.length != 0){
        yield put({
          type: 'saveGroup',
          groupList: groupRes.DataRows
        });
      }else{
        message.warning("未查询到待分布群体信息！")
      }
    },
    /**
     * 功能：部门tab页新增
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *deptTabAdd({params,clearItem}, {call, put}) {
      const tabRes = yield call(service.deptTabTransOpts, {
        transjsonarray : JSON.stringify(params)
      });
      if(tabRes.RetCode==='1'){
        message.success("新增成功！")
        clearItem()
        yield put({type: 'deptTabSearch',flag:'1'});
      }else{
        message.warning("新增失败！")
      }
    },
    /**
     * 功能：部门tab页修改
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *deptTabUpdate({params,clearItem}, {call, put}) {
      const tabRes = yield call(service.deptTabTransOpts, {
        transjsonarray : JSON.stringify(params)
      });
      if(tabRes.RetCode==='1'){
        message.success("修改成功！")
        clearItem(); // 清空item
        yield put({type: 'deptTabSearch',flag:'1'});
      }else{
        message.warning("修改失败！")
      }
    },
    /**
     * 功能：部门tab页修改
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *deptTabDelete({params}, {call, put}) {
      const tabRes = yield call(service.deptTabTransOpts, {
        transjsonarray : JSON.stringify(params)
      });
      if(tabRes.RetCode==='1'){
        message.success("删除成功！")
        yield put({type: 'deptTabSearch',flag:'1'});
      }else{
        message.warning("删除失败！")
      }
    },


    /**
     * 一键继承
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *copyLastSeason({}, {call, put}) {
      const result = yield call(service.copyLastSeasonS);
      if(result.RetCode==='1'){
        message.success("操作成功！")
        dispatch({type: 'deptTabSearch',flag:'0'});
      }else{
        message.warning(result.RetVal)
      }
    },


    // 输入框修改
    * inputChange({payload}, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          [payload.type]: payload.value.trim()
        }
      });
    },

     
    //datasource
    * search_init({}, {call, put, select}) {
      let {year_search,year} = yield select (state => state.distgroup)
        const deptRes = yield call(service.deptDistGroupSearch,
          {
            'arg_year':year_search||year,
          });
        if(deptRes.RetCode==='1' && deptRes.DataRows && deptRes.DataRows.length){
          yield put({
            type: 'saveRes',
            distList:deptRes.DataRows
          });
          yield put({
            type: 'search'
          })
        }else{
          // message.error("未查询到待分布群体信息！")
        }
      
    },

    // 查询
    * search({}, {call, select, put}) {
      let { distList, year_search,season_search,dept_name_search,tab_desc_search} = yield select (state => state.distgroup)
      // console.log(year_search,season_search,dept_name_search,tab_desc_search)
      let distListSearch = distList.filter(
        item => ((year_search && item.year=== year_search) || !year_search )
        && ((season_search && item.season === season_search) || !season_search)
        && ((dept_name_search && item.dept_name.indexOf(dept_name_search) !== -1)  || !dept_name_search)
          && ((tab_desc_search && item.tab_desc.indexOf(tab_desc_search) !== -1)  || !tab_desc_search)
      )
      

        /*(season_search && item.season === season_search || season_search === '') &&
        (dept_name_search && item.dept_name === dept_name_search || dept_name_search === '') &&
        (tab_desc_search && item.tab_desc === tab_desc_search || tab_desc_search === '')*/


      yield put({
        type: 'save',
        payload: {
          distListSearch: JSON.parse(JSON.stringify(distListSearch)),
        }
      })
    },

    // 点击清空按钮
    * clear({}, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          year_search: year,
          season_search: season,
          dept_name_search: '',
          tab_desc_search: '',
        }
      })

      yield put({
        type: 'search'
      })
    },


  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/distGroup') {
          dispatch({type: 'deptTabSearch',flag:'0'});
        }
      });
    }
  }
};
