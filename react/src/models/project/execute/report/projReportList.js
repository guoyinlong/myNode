/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目执行报告管理（月报）列表的服务
 */
import * as projServices from '../../../../services/project/projService';
import Cookie from 'js-cookie';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 功能：将列表数据转为树形数据
 * @param list 数据列表
 */
function list2Tree(list) {
  //处理主子关系
  if (list.length) {
    list.map((i, index) => {
      i.key = index;
      i.level = 0;
      if (i.childRows) {
        i.children = JSON.parse(i.childRows);
        if (i.children.length) {
          i.children.map((j) => {
            j.key = j.proj_id;
            j.parentIndex = index % 10;  //取其个位数
            j.level = 1;
          })
        }
      }
    })
  }
  return list;
}

/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 功能：根据查询的条件，返回请求参数
 * @param queryData 查询的数据
 */
function getPostData(queryData) {
  let postData = {};
  if (queryData.ou_name !== '') {
    postData.arg_ou_name = queryData.ou_name;
  }
  if (queryData.proj_label !== '') {
    postData.arg_proj_label = queryData.proj_label;
  }
  if (queryData.proj_code !== '') {
    postData.arg_proj_code = queryData.proj_code;
  }
  if (queryData.proj_name !== '') {
    postData.arg_proj_name = queryData.proj_name;
  }
  if (queryData.dept_name !== '') {
    postData.arg_dept_name = queryData.dept_name;
  }
  if (queryData.mgr_name !== '') {
    postData.arg_mgr_name = queryData.mgr_name;
  }
  if (queryData.proj_type !== '') {
    postData.arg_proj_type = queryData.proj_type;
  }
  if (queryData.pu_deptid !== '') {
    postData.arg_pu_deptid = queryData.pu_deptid;
  }

  postData.arg_staff_id = queryData.staff_id;
  postData.arg_pagecurrent = queryData.page;
  postData.arg_pagesize = 10;
  postData.arg_queryflag = 3; /* 1，只查询主项目；2，根据主查询子；3，主子一起查询；现在默认前端只传3*/

  return postData;
}

export default {
  namespace: 'projReportList',
  state: {
    list: [],
    puDeptNameList:[],   /*归口部门列表*/
    rowCount: 0,
    projTypeDataList: [],
    ou_name: '',         /*OU默认为全部*/
    pu_deptid:'',        /*当前查询条件的归属部门ID,默认为‘’*/
    proj_label: '0',     /*项目分类默认为项目类*/
    proj_code: '',       /*项目编码默认为‘’*/
    proj_name: '',       /*项目名称默认为‘’*/
    dept_name: '',       /*主责部门默认为‘’*/
    mgr_name: '',        /*项目经理默认为‘’*/
    proj_type: '',       /*项目类型默认为‘’*/
    staff_id: Cookie.get('staff_id'),
    page: 1,
    condCollapse: true, /* 搜索条件是否展开*/
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {


    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：刚进入时的项目列表
     */
    *startListSearch({}, {put, select}) {
      //从其他页面进来时，由于缓存的原因，这里需要初始化一下查询条件
      yield put({
        type: 'save',
        payload: {
          ou_name: '',
          pu_deptid:'',        /*当前查询条件的归属部门ID,默认为‘’*/
          proj_label: '0',
          proj_code: '',
          proj_name: '',
          dept_name: '',
          mgr_name: '',
          proj_type: '',
          staff_id: Cookie.get('staff_id'),
          page: 1,
          condCollapse: true,
        }
      });
      let queryData = yield select(state => state.projReportList);
      let postData = getPostData(queryData);
      yield put({type: 'conditionSearch', postData: postData});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：返回项目列表
     * @param query 列表参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *returnToListSearch({query}, {call, put}) {
      query.payload = JSON.parse(query.payload);
      let postData = getPostData(query.payload);
      yield put({type: 'conditionSearch', postData: postData});
      //还原查询条件的值
      yield put({
        type: 'save', payload: {...query.payload}
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：动态处理页码
     * @param page 当前页码值
     * @param put 返回reducer
     * @param select 用于获取state
     */
    *handlePageChange({page}, {put, select}) {
      yield put({type: 'save', payload: {page: page}});
      let queryData = yield select(state => state.projReportList);
      let postData = getPostData(queryData);
      yield put({type: 'conditionSearch', postData: postData});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：设置条件参数
     * @param value 参数值
     * @param condType 条件类型，具体的参数对应值
     * @param put 返回reducer
     * @param select 用于获取state
     */
    *setCondParam({value, condType}, {put, select}) {
      //新查询时,将对应的参数改变，页码变为1
      yield put({type: 'save', payload: {[condType]: value, page: 1}});
      let queryData = yield select(state => state.projReportList);
      let postData = getPostData(queryData);
      yield put({type: 'conditionSearch', postData: postData});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：主责部门选择后，隐藏主责部门，并进行查询
     * @param dept_name 主责部门的名称
     * @param put 返回reducer
     * @param select 用于获取state
     */
    *hideMainDeptModel({dept_name}, {put, select}) {
      yield put({type: 'save', payload: {dept_name: dept_name}});
      let queryData = yield select(state => state.projReportList);
      let postData = getPostData(queryData);
      yield put({type: 'conditionSearch', postData: postData});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：设置查询条件是否展开
     * @param condCollapse 是否展开
     * @param put 返回reducer
     */
    *setCondCollapse({condCollapse}, {put}) {
      yield put({type: 'save', payload: {condCollapse: condCollapse}});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：重置查询条件
     * @param put 返回reducer
     * @param select 获取state
     */
    *resetCond({}, {put, select}) {
      yield put({
        type: 'save',
        payload: {
          ou_name: '',
          pu_deptid:'',        /*当前查询条件的归属部门ID,默认为‘’*/
          proj_label: '0',
          proj_code: '',
          proj_name: '',
          dept_name: '',
          mgr_name: '',
          proj_type: '',
          page: 1
        }
      });
      let queryData = yield select(state => state.projReportList);
      let postData = getPostData(queryData);
      yield put({type: 'conditionSearch', postData: postData});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：设置查询条件的显示值
     * @param value 条件值
     * @param condType 条件类型
     * @param put 返回reducer
     */
    *setInputShow({value, condType}, {put}) {
      yield put({type: 'save', payload: {[condType]: value}});
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：搜索条件查询
     * @param postData 请求数据参数
     * @param call 请求服务
     * @param put 返回reducer
     */
    *conditionSearch({postData}, {call, put}) {
      const data = yield call(projServices.projQueryReportList, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            list: list2Tree(data.DataRows),
            rowCount: data.RowCount
          }
        });
      }
    },


    /**
     * 作者：邓广晖
     * 创建日期：2017-11-06
     * 功能：项目类型查询
     * @param call 请求服务
     * @param put 返回reducer
     */
    *projTypeSearch({}, {call, put}) {
      //初始查询时，将项目类型列表（W1，R1)返回
      const projTypeData = yield call(projServices.getProjType, {
        transjsonarray: JSON.stringify({
          "condition": {"type_state": "0"}, "sequence": [{"type_order": "0"}]
        })
      });
      if (projTypeData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {projTypeDataList: projTypeData.DataRows}
        });
      } else {
        yield put({
          type: 'save',
          payload: {projTypeDataList: []}
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-20
     * 功能：归属部门列表查询
     * @param call 请求服务
     * @param put 返回reducer
     */
    *projPuNameSearch({},{call,put}){
      const puData = yield call(projServices.departmentQuery,{arg_tenantid:Cookie.get('tenantid')});
      if(puData.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            puDeptNameList:puData.DataRows
          }
        });
      }else{
        yield put({
          type: 'save',
          payload:{
            puDeptNameList:[]
          }
        });
      }
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/projectApp/projExecute/report') {
          if (JSON.stringify(query) === '{}') {
            dispatch({type: 'startListSearch'});
          } else {
            dispatch({type: 'returnToListSearch', query});
          }
          dispatch({type: 'projTypeSearch'});
          dispatch({type: 'projPuNameSearch'});
        }
      });
    },
  },
};
