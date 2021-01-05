/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：办公用品管理
 */
import * as fundingPlanOfficeMgtService from '../../../services/finance/fundingPlanOfficeMgtService';
export default {
  namespace: 'officeSuppliesMgt',
  state: {
    list:[]
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      const data = yield call(fundingPlanOfficeMgtService.getOfficeProduct, {arg_null: null});
      if (data.RetCode ==='1') {
        if (data.jsonTree.length > 0){
          let tableData = [];
          let typeList = [];//办公用品类型筛选列表
          for (let i=0;i<data.jsonTree.length;i++){
            typeList.push({
              key:i,
              text:data.jsonTree[i].name,
              value:data.jsonTree[i].name
            });
            if (data.jsonTree[i].list){
              for (let j=0;j<data.jsonTree[i].list.length;j++){
                tableData.push({
                  key:data.jsonTree[i].list[j].id,
                  classification: data.jsonTree[i].name,
                  product_name: data.jsonTree[i].list[j].name,
                  parentId:data.jsonTree[i].id,
                })
              }
            }
          }
          yield put({
            type: 'save',
            payload:{
              tableData: tableData,
              typeList: typeList,
            }
          });
        }
      }else {
        yield put({
          type: 'save',
          payload:{
            tableData: [],
          }
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-20
     * 功能：新增办公用品
     */
    *addOfficeProduct({inputNew,classification},{call,put}){
      const userID = localStorage.staffid; //获取当前用户ID
      let postData={};
      postData['arg_product_name']=inputNew;
      postData['arg_classification']=classification;
      postData['arg_user_id']=userID;
      const data = yield call (fundingPlanOfficeMgtService.addOfficeProduct, postData);
      if (data.RetCode==='1'){
        yield put({
          type: 'init',
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-20
     * 功能：编辑办公用品
     */
    *modifyOfficeProduct({nameEdit,classificationEdit,inputEdit},{call,put}){
      const userID = localStorage.staffid; //获取当前用户ID
      let postData={};
      postData['arg_product_name']=nameEdit;//编辑前的名字
      postData['arg_classification']=classificationEdit;
      postData['arg_user_id']=userID;
      postData['arg_new_product_name']=inputEdit;//新名字
      const data = yield call (fundingPlanOfficeMgtService.modifyOfficeProduct, postData);
      if (data.RetCode==='1'){
        yield put({
          type: 'init',
        });
      }
    },
    /**
     * 作者：杨青
     * 创建日期：2018-03-20
     * 功能：删除办公用品
     */
    *deleteOfficeProduct({productName,classification,},{call,put}){

      const userID = localStorage.staffid; //获取当前用户ID
      let postData={};
      postData['arg_product_name']=productName;
      postData['arg_classification']=classification;
      postData['arg_user_id']=userID;
      const data = yield call (fundingPlanOfficeMgtService.deleteOfficeProduct, postData);
      if (data.RetCode==='1'){
        yield put({
          type: 'init',
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_office_supplies_mgt') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
