/**
 *  作者: 郭西杰
 *  创建日期: 2020-01-07
 *  邮箱：guoxj116@chinaunicom.cn
 *  文件说明：员工晋升晋档信息导入维护
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as trainService from "../../../services/train/trainService";
import * as promoteService from "../../../services/rankpromote/promoteService";
import moment from 'moment'
import * as costService from "../../../services/cost/costService";
import * as contractService from "../../../services/labor/contract/contractService";
import * as hrService from "../../../services/hr/hrService";
import * as talentService from "../../../services/talent/talentService";
import * as rankService from "../../../services/rankpromote/rankService";
import * as appraiseService from "../../../services/appraise/appraiseService";

const auth_tenantid = Cookie.get('tenantid');

//导入文件数据整理
function dataFrontDataImport(data){
  let frontDataList = [];
  let i = 1;
  for(let item in data){
    let newData = {
      //序号
      indexID: i,
      user_id: data[item].员工编号,
      user_name: data[item].姓名,
      dept_name: data[item].所属部门,
      join_time: moment('1900-01-01','YYYY-MM-DD').add('days', data[item].入职日期).format('YYYY-MM-DD'),
      year: data[item].晋升年份,
      rank_sequence_before: data[item].之前职级薪档,
      rank_level_before: data[item].之前职级,
      rank_grade_before: data[item].之前薪档,
      rank_sequence: data[item].当前职级薪档,
      rank_level: data[item].当前职级,
      rank_grade: data[item].当前薪档,
      effective_time: moment('1900-01-01','YYYY-MM-DD').add('days', data[item].生效日期).format('YYYY-MM-DD'),
      promotion_path: data[item].晋升路径,
      new_user_path: data[item].是否走新员工晋级,
      talents_name: data[item].人才标识,
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}




export default {
  namespace:'promoteImportModel',
  state:{
    //职级信息
    searchPromoteDataList:[],
    importPromoteDataList:[],
    historyDataList:[],
    //部门信息
    deptList:[],
    //ou信息
    ouList:[],
    user_id : Cookie.get("userid"),
  },

  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    * initQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          importPromoteDataList: [],
        }
      });
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const getOuData = yield call(trainService.getOuList, postData_getOU);
      if (getOuData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            ouList: getOuData.DataRows
          }
        });
      } else {
        message.error('没有查询内容');
      }
      yield put({
        type: 'save',
        payload: {
          deptList: [],
        }
      });
      let queryParam = {
        arg_ou_id: Cookie.get('OUID'),
      };
      const courtDeptData = yield call(trainService.courtDeptQuery, queryParam);
      if (courtDeptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deptList: courtDeptData.DataRows,
          }
        });
      } else {
        message.error('查询部门出错！');
      }

      let arg_param = {
        arg_ou_id: Cookie.get('OUID'),
        arg_dept_id: Cookie.get('dept_id'),
        arg_text: ''
      };
      const promoteData = yield call(promoteService.rankPromoteSearch, arg_param);
      if (promoteData.RetCode === '1') {
        for (let i = 0; i < promoteData.DataRows.length; i++) {
          promoteData.DataRows[i]['indexID'] = i + 1;
          promoteData.DataRows[i]['ID'] = i + 1;
          promoteData.DataRows[i]['ou_name'] = promoteData.DataRows[i].dept_name.split('-')[0];
          promoteData.DataRows[i]['dept_name'] = promoteData.DataRows[i].dept_name.split('-')[1];
        }
        yield put({
          type: 'save',
          payload: {
            searchPromoteDataList: promoteData.DataRows,
          }
        });
      } else {
        message.error('查询晋升信息出错！');
      }
    },
    * PromoteImport({PromoteData}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          importPromoteDataList: [],
        }
      });
      let importdatalist = dataFrontDataImport(PromoteData);
      if (PromoteData) {
        yield put({
          type: 'save',
          payload: {
            importPromoteDataList: importdatalist,
            haveData: true
          }
        });
      }
    },
    * PromoteSearch({arg_param}, {call, put}) {
      console.log("arg_param===" + JSON.stringify(arg_param));
      let postData = {};
      postData["arg_ou_id"] = arg_param.arg_ou_id;
      postData["arg_dept_id"] = arg_param.arg_dept_id;
      postData["arg_text"] = arg_param.arg_text;

      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(promoteService.rankPromoteSearch, arg_param);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i]['indexID'] = i + 1;
          basicInfoData.DataRows[i]['ID'] = i + 1;
          basicInfoData.DataRows[i]['ou_name'] = basicInfoData.DataRows[i].dept_name.split('-')[0];
          basicInfoData.DataRows[i]['dept_name'] = basicInfoData.DataRows[i].dept_name.split('-')[1];
        }
        yield put({
          type: 'save',
          payload: {
            searchPromoteDataList: basicInfoData.DataRows,
          }
        });
      } else {
        message.error('查询晋升信息出错！');
      }
    },
    * importPromoteDataSubmit({transferPromoteData, resolve}, {call}) {
      try {

        let importData = [];
        var user_id_string = '';
        var current_year = new Date().getFullYear();
        for (let i=0;i<transferPromoteData.length;i++){
          user_id_string += transferPromoteData[i].arg_user_id + ",";
        }
        let delparam = {};
        delparam['arg_user_id_string'] = user_id_string;
        delparam['arg_current_year'] = current_year;


        for (let i=0;i<transferPromoteData.length;i++){
        let arg_import_id = Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
        let importparam = {};
        importparam['import_id'] = arg_import_id;
        importparam['user_id'] = transferPromoteData[i].arg_user_id;
        importparam['user_name'] = transferPromoteData[i].arg_user_name;
        importparam['join_time'] = transferPromoteData[i].arg_join_time;
        importparam['rank_sequence_before'] = transferPromoteData[i].arg_rank_sequence_before;
        importparam['rank_sequence'] = transferPromoteData[i].arg_rank_sequence;
        importparam['year'] = transferPromoteData[i].arg_year;
        importparam['effective_time'] = transferPromoteData[i].arg_effective_time;
        importparam['promotion_path'] = transferPromoteData[i].arg_promotion_path;
        importparam['talents_name'] = transferPromoteData[i].arg_talents_name;
        importparam['new_user_path'] = transferPromoteData[i].arg_new_user_path;
        let beforerank = transferPromoteData[i].arg_rank_sequence_before;
        let nowrank = transferPromoteData[i].arg_rank_sequence;
        importparam['rank_level_before'] = beforerank.substr(1,3);
        importparam['rank_grade_before'] = beforerank.substr(4);
        importparam['rank_level'] = nowrank.substr(1,3);
        importparam['rank_grade'] = nowrank.substr(4);
        importparam['state'] = 1;
        importData.push(importparam);
 }
        let insertparam = {};
        insertparam['transjsonarray'] = JSON.stringify(importData);
        let insertRet = yield call(promoteService.promoteInfoImport1, insertparam);

        if(insertRet.RetCode==='1'){
          let updateparam = {};
          updateparam['arg_year'] = current_year;
          let updateRet = yield call(promoteService.promoteInfoImportUpdate, updateparam);
          console.log("updateRet=="+JSON.stringify(updateRet));
          if(updateRet.RetCode==='1'){
            message.info("导入成功！");
            resolve("success");
          }else{
            message.error(updateRet.RetVal);
            resolve("erro");
          }
        }else{
          message.error("导入失败！");
          resolve("erro");
        }
        //计算剩余积分
        let arg_params = {};
        arg_params["arg_ou_id"] = Cookie.get('OUID');
        let year = new Date().getFullYear();
        arg_params["arg_year"] = year-1;
        arg_params["arg_now_year"] = year;
      }catch (e) {
        resolve("erro");
      }
    },
    * PromoteInfoEdit({arg_param}, {call, put}) {
      const updateCadreData = yield call(promoteService.promoteInfoUpdate,arg_param);
      if(updateCadreData.RetCode === '1'){
        message.info("修改成功！");
        yield put({
          type: 'initQuery'
        });
      }else{
        message.info(updateCadreData.RetVal);
      }
    },
    * PromoteSubmit({arg_param}, {call, put}) {
      console.log("arg_param===" + JSON.stringify(arg_param));
      let postData = {};
      postData["arg_year"] = arg_param.arg_year;
      //默认查询登陆人所属OU下的所有员工
      const basicInfoData = yield call(promoteService.rankPromoteSubmit, arg_param);
      if (basicInfoData.RetCode === '1') {
        message.info("同步成功！");
      } else {
        message.error('查询晋升信息出错！');
      }
    },
    * PromoteInfoDel({arg_param}, {call, put}) {
      let delparam = {};
      delparam['arg_user_id'] = arg_param.user_id;
      delparam['arg_user_name'] = arg_param.user_name;
      const delCadreData = yield call(promoteService.promoteInfoDel,delparam);
      if(delCadreData.RetCode === '1'){
        message.info("操作成功！");
        yield put({
          type: 'initQuery'
        });
      }else{
        message.info(delCadreData.RetVal);
      }
    },
  },
    subscriptions: {
      setup({dispatch, history}) {
        return history.listen(({pathname, query}) => {
          if (pathname === '/humanApp/rankpromote/promoteimport') {
            dispatch({type: 'initQuery', query});
          }
        });
      }
    }
};
