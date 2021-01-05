/**
 *  作者: 翟金亭
 *  创建日期: 2019-09-19
 *  邮箱：zhaijt33@chinaunicom.cn
 *  文件说明：实现人才信息导入功能
 */
import * as trainService from "../../services/train/trainService";
import * as talentService from "../../services/talent/talentService";
import Cookie from 'js-cookie';

import {message} from "antd";
const auth_tenantid = Cookie.get('tenantid');

//导入文件数据整理
function dataFrontDataImportTalentInfo(data){
    let frontDataList = [];
    let i = 1;
    for(let item in data){
      let newData = {
        //序号
        indexID: i,
        //用户ID
        user_id: data[item].员工编号,
        //姓名
        user_name: data[item].员工姓名,
        //组织
        dept_name: data[item].组织,
        //人才级别
        talent_level:data[item].人才级别,
        //专业
        talent_major:data[item].专业,
        //开始时间
        start_time:data[item].入选时间,
        //退出时间
        quit_time:data[item].退出时间,
        //聘期结束日期
        end_time:data[item].聘期结束日期,
        //备注
        remark:data[item].备注,
      };
      frontDataList.push(newData);
      i++;
    }
    return frontDataList;
  }

export default {
  namespace:'talentInfoImportModel',
  state:{
    //人才信息
    importTalentDataList:[],
    //部门信息
    deptList:[],
    //ou信息
    ouList:[],
    //查询
    searchTalentDataList:[],
    //个人信息
    detailTalentDataList:[],
    //角色
    roleFlag:false,
  },

  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *initQuery({}, {call, put}) {
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
      
      
      //查询角色
      let postData = {};
      postData["arg_user_id"] = Cookie.get("userid");
      const getRoleData = yield call(talentService.getRole, postData);
      if(getOuData.RetCode === '1'){
        if(getRoleData.DataRows[0].result > 0){
          yield put({
            type: 'save',
            payload: {
              roleFlag: true
            }
          });
        }else{
          yield put({
            type: 'save',
            payload: {
              roleFlag: false
            }
          });
        }
      }else{
        message.error("初始化失败");
      }
    },


    //人才信息导入
    *talentImport({ talentData }, {put}){
        yield put({
          type: 'save',
          payload: {
            importTalentDataList: [],
          }
        });
        if(talentData){
            yield put({
              type: 'save',
              payload: {
                importTalentDataList: dataFrontDataImportTalentInfo(talentData),
                haveData: true
              }
            });
        }
      },    

    //查询
    *talentSearch({arg_param, resolve}, {call, put}){
      console.log("arg_param===" + JSON.stringify(arg_param));
      let postData = {};
      postData["arg_ou_id"] = arg_param.arg_ou_id;
      postData["arg_talent_level"] = arg_param.arg_talent_level;
      postData["arg_person_name"] = arg_param.arg_person_name;

      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(talentService.talentQuery, postData);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            searchTalentDataList: basicInfoData.DataRows,
          }
        });
        resolve("success");
      } else {
        resolve("false");
      }
    },

    //个人详情
    *talentInfoDetailSearch({arg_user_id, resolve}, {call, put}){
      let postData = {};
      postData["arg_user_id"] = arg_user_id;

      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(talentService.talentDetailQuery, postData);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            detailTalentDataList: basicInfoData.DataRows,
          }
        });
        resolve("success");
      } else {
        resolve("false");
      }
    },

    *importTalenttDataSubmit({transferTalentData, resolve } , {call}){
      let returnFlag = '0';
      try {
        for(let i=0;i<transferTalentData.length;i++){
          /*校验人员信息是否存在，如果存在则提示不允许重复录入*/
          const personCheckResult = yield call(talentService.checkPersonInfo, transferTalentData[i]);
          console.log(personCheckResult);
          if(personCheckResult.DataRows[0].result > 0)
          {
              message.error( Cookie.get("OU") +"-" + transferTalentData[i].arg_dept_name +" 的 【"+ transferTalentData[i].arg_user_name+"】 该人才信息已存在，核对入选时间,退出时间,人才级别等信息请勿重复录入！请修改");
              resolve("false");
              return;
          }
          const saveDataInfo = yield call(talentService.importTalentDataSubmit, transferTalentData[i]);
          if (saveDataInfo.RetCode !== '1') {
            yield call(talentService.checkPersonInfoDelete, transferTalentData[i]);
            message.error('导入失败');
            resolve("false");
            return;
          }else{
            returnFlag = '1';
          }
        }
        if(returnFlag === '1'){
          message.info('保存成功');
          resolve("success");
        }
      } catch (error) {
        resolve("false");
      }
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/talent/importTalentInfo') {
          dispatch({ type: 'initQuery',query });
        }
      });
    }
  }
};
