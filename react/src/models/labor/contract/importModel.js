/**
 *  作者: 翟金亭
 *  创建日期: 2019-09-16
 *  邮箱：zhaijt33@chinaunicom.cn
 *  文件说明：实现劳动合同导入功能
 */
import * as contractService from "../../../services/labor/contract/contractService";
import * as trainService from "../../../services/train/trainService";
import Cookie from 'js-cookie';

import {message} from "antd";
const auth_tenantid = Cookie.get('tenantid');

//导入文件数据整理
function dataFrontDataImportPersonPost(data){
    let frontDataList = [];
    let i = 1;
    for(let item in data){
      let newData = {
        //序号
        indexID: i,
        //用户ID
        user_id: data[item].员工编号,
        //姓名
        user_name: data[item].姓名,
        //单位名称
        ou_name: data[item].所属单位,
        //部门名称
        dept_name: data[item].所属部门,
        //合同类型
        contract_type:data[item].合同类型,
        //合同周期
        contract_time:data[item].合同周期,
        //合同开始时间
        start_time:data[item].合同开始时间,
        //合同结束时间
        end_time:data[item].合同终止时间,
        //合同状态
        state:data[item].合同状态,
        //续签状态
        if_sign:data[item].续签状态,
        //签订合同次数
        sign_number:data[item].签订合同次数,
      };
      frontDataList.push(newData);
      i++;
    }
    return frontDataList;
  }

export default {
  namespace:'importContractModel',
  state:{
    //合同信息
    importContractDataList:[],
    //部门信息
    deptList:[],
    //ou信息
    ouList:[],
  },

  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *initQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          importContractDataList: [],
        }
      });
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const getOuData = yield call(trainService.getOuList, postData_getOU);
      if(getOuData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            ouList: getOuData.DataRows
          }
        });
      }else{
        message.error('没有查询内容');
      }        

      yield put({
        type: 'save',
        payload: {
          deptList: [],
        }
      });
      let queryParam = {
        arg_ou_id : Cookie.get('OUID'),
      };
      const courtDeptData = yield call(trainService.courtDeptQuery,queryParam);
      if(courtDeptData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            deptList: courtDeptData.DataRows,
          }
        });
      }else{
        message.error('没有落地部门');
      }

    },


    //导入劳动合同
    *ContractImport({ ContractData }, {put}){
        yield put({
          type: 'save',
          payload: {
            importContractDataList: [],
          }
        });
        if(ContractData){
            yield put({
              type: 'save',
              payload: {
                importContractDataList: dataFrontDataImportPersonPost(ContractData),
                haveData: true
              }
            });
        }
      },    

    *importContractDataSubmit({transferContractData, resolve } , {call}){
      try {
        let operation_flag = '0';
        for(let i=0;i<transferContractData.length;i++){
          /*校验人员信息是否存在，如果存在则提示不允许重复录入*/
          const personCheckResult = yield call(contractService.checkPersonInfo, transferContractData[i]);
          if(personCheckResult.DataRows[0].result > 0)
          {
              message.error(transferContractData[i].arg_ou_name +"-" + transferContractData[i].arg_dept_name +" 的 【"+ transferContractData[i].arg_user_name+"】 合同信息已存在，请勿重复录入！请修改");
              resolve("false");
              return;
          }
          const saveDataInfo = yield call(contractService.importContractDataSubmit, transferContractData[i]);
          if (saveDataInfo.RetCode !== '1') {
            yield call(contractService.checkPersonInfoDelete, transferContractData[i]);
            message.error('导入失败');
            operation_flag = '1';
            resolve("false");
            return;
          }
        }
        if(operation_flag === '0'){
          message.info('录入成功！');
          resolve("success");
          return;
        }
      } catch (error) {
        resolve("false");
      }
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/importContract') {
          dispatch({ type: 'initQuery',query });
        }
      });
    }
  }
};
