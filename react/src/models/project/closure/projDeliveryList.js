/**
 * 作者：陈红华
 * 创建日期：2017-11-28
 * 邮箱：1045825949@qq.com
 * 文件说明：项目结项：项目列表页
 */
import * as projServices from '../../../services/project/projService';
import Cookie from 'js-cookie';

// 将列表数据转为树形数据
function list2Tree (list){
  //处理主子关系
  if (list.length) {
    list.map((i, index)=> {
      i.key = index;
      i.level = 0;
      if(i.childRows){
        i.children = JSON.parse(i.childRows);
        if(i.children.length){
          i.children.map((j)=>{
            j.key = j.proj_code;
            j.parentIndex = index%10;  //取其个位数
            j.level = 1;
          })
        }
      }
    })
  }
  return list;
}

export default {
  namespace: 'projDeliveryList',
  state: {
    list: [],
    projTypeDataList:[],
    puDeptName:[],
    conditionData:{
      arg_ou_name: '',     /*OU默认为当前OU*/
      arg_proj_label:'0',  /*项目分类默认为项目类*/
      arg_proj_code :'',  /*项目编码默认为‘’*/
      arg_proj_name :'',  /*项目名称默认为‘’*/
      arg_dept_name:'',   /*主责部门默认为‘’*/
      arg_pu_dept_name:'',
      arg_file_state:'',
      arg_mgr_name : '',  /*项目经理默认为‘’*/
      arg_proj_type: '',  /*项目类型默认为‘’*/
      arg_queryflag:'3',
      // arg_version:'3.0',
      arg_userName:Cookie.get('username'),
      arg_roleId:'',
      arg_staff_id:Cookie.get("staff_id"),
    },
    condCollapse:true, /* 搜索条件是否展开*/
  },
  reducers: {
    // 查询项目信息数据处理
    projQueryPrimaryChildRedu(state,{DataRows,RowCount}){
      return {
        ...state,
        list: list2Tree(DataRows),
        rowCount:RowCount
      }
    },
    // 保存除查询条件外的数据
    saveData(state, action) {
      return {...state,...action.payload};
    },
    // 保存查询条件
    saveConditionData(state,{payload}){
      let {conditionData}=state;
      conditionData={...conditionData,...payload};
      return {...state,conditionData};
    }
  },
  effects: {
    // 项目类型查询
    *projTypeSearch({}, { call, put }) {
      //初始查询时，将项目类型列表（W1，R1)返回
      const projTypeData = yield call(projServices.projCommonGetProjtype,{arg_flag:1});
      let postData = {};
      postData['arg_tenantid'] = 10010;
      const puData = yield call(projServices.departmentQuery,postData);
      if(projTypeData.RetCode === '1'){
        yield put({
          type: 'saveData',
          payload:{
            projTypeDataList: projTypeData.DataRows,
            puDeptName:puData.DataRows
          }
        });
      }else{
        yield put({
          type: 'saveData',
          payload:{projTypeDataList: [],puDeptName:[]}
        });
      }
    },
    // 角色查询
    *projPermissionsQuery({},{call,put}){
      let {roleType} = yield call(projServices.projPermissionsQuery,{arg_staffId:Cookie.get('staff_id')});
      yield put({
        type:'saveConditionData',
        payload:{arg_roleId:roleType}
      })
      yield put({
        type: 'projDeliveryListQuery'
      });
    },
    // 查询项目列表
    *projDeliveryListQuery({},{call,put,select}){
      let {conditionData}=yield select(state=>state.projDeliveryList);
      let postData = {
        argOuName:conditionData.arg_ou_name,
        argProjLabel:conditionData.arg_proj_label,
        argProjCode:conditionData.arg_proj_code,
        argProjName:conditionData.arg_proj_name,
        argDeptName:conditionData.arg_dept_name,
        argPuDeptName:conditionData.arg_pu_dept_name,
        argFileState:conditionData.arg_file_state,
        argMgrName:conditionData.arg_mgr_name,
        argProjType:conditionData.arg_proj_type,
        argUserName:conditionData.arg_userName,
        argRoleId:conditionData.arg_roleId,
        argStaffId:conditionData.arg_staff_id,
        argQueryFlag:conditionData.arg_queryflag,
      };
      let {DataRows,RowCount} = yield call(projServices.queryDeliverListNew,postData);
      yield put({
        type: 'projQueryPrimaryChildRedu',
        DataRows,
        RowCount
      });
    },
    // 改变条件进行查询
    *changeConditionQuery({payload},{put,select}){
      yield put({
        type:'saveConditionData',
        payload
      });
      yield put({
        type:'projDeliveryListQuery',
      })
    },
  },

  subscriptions: {
  },
};
