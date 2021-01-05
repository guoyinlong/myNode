/**
 *  作者: 王福江
 *  创建日期: 2019-12-04
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现职级信息导入功能
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as trainService from "../../../services/train/trainService";
import * as rankService from "../../../services/rankpromote/rankService";
import moment from 'moment'
import * as costService from "../../../services/cost/costService";
import * as contractService from "../../../services/labor/contract/contractService";

const auth_tenantid = Cookie.get('tenantid');

//导入文件数据整理
function dataFrontDataImport(data){
  let frontDataList = [];
  let i = 1;
  for(let item in data){
    let newData = {
      //序号
      indexID: i,
      year: data[item].年度,
      user_id: data[item].员工编号,
      user_name: data[item].姓名,
      ou_name: data[item].组织机构,
      dept_name: data[item].部门,
      join_time: moment('1900-01-01','YYYY-MM-DD').add('days', data[item].加入联通时间).format('YYYY-MM-DD'),
      rank_sequence_before: data[item].之前职级薪档,
      rank_sequence: data[item].当前职级薪档,
      bonus_points: data[item].考核剩余积分,
      effective_time: moment('1900-01-01','YYYY-MM-DD').add('days', data[item].生效日期).format('YYYY-MM-DD'),
      promotion_path: data[item].晋升路径,
      talents_name: data[item].人才标识
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}


export default {
  namespace:'rankImportModel',
  state:{
    //职级信息
    searchRankDataList:[],
    importRankDataList:[],
    historyDataList:[],
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
          importRankDataList: [],
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
        message.error('查询部门出错！');
      }

      let param = {
        arg_ou_id : Cookie.get('OUID'),
        arg_dept_id : Cookie.get('dept_id'),
        arg_text: ''
      };
      const rankData = yield call(rankService.rankInfoList,param);
      if(rankData.RetCode === '1'){
        for (let i=0;i<rankData.DataRows.length;i++) {
          rankData.DataRows[i]['indexID'] = i + 1;
          rankData.DataRows[i]['ID'] = i + 1;
          rankData.DataRows[i]['ou_name'] = rankData.DataRows[i].deptname.split('-')[0];
          rankData.DataRows[i]['dept_name'] = rankData.DataRows[i].deptname.split('-')[1];
        }
        yield put({
          type: 'save',
          payload: {
            searchRankDataList: rankData.DataRows,
          }
        });
      }else{
        message.error('查询职级出错！');
      }
    },
    *initPersonQuery({query}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          importRankDataList: [],
        }
      });

      let param = {
        arg_ou_id : Cookie.get('OUID'),
        arg_dept_id : Cookie.get('dept_id'),
        arg_text: Cookie.get("userid")
      };
      const rankData = yield call(rankService.rankInfoList,param);
      if(rankData.RetCode === '1'){
        for (let i=0;i<rankData.DataRows.length;i++) {
          rankData.DataRows[i]['indexID'] = i + 1;
          rankData.DataRows[i]['ID'] = i + 1;
          rankData.DataRows[i]['ou_name'] = rankData.DataRows[i].deptname.split('-')[0];
          rankData.DataRows[i]['dept_name'] = rankData.DataRows[i].deptname.split('-')[1];
        }
        yield put({
          type: 'save',
          payload: {
            searchRankDataList: rankData.DataRows,
          }
        });
      }else{
        message.error('查询职级出错！');
      }
    },
    *rankQuery({param}, {call, put}) {
      const rankData = yield call(rankService.rankInfoList,param);
      if(rankData.RetCode === '1'){
        for (let i=0;i<rankData.DataRows.length;i++) {
          rankData.DataRows[i]['indexID'] = i + 1;
          rankData.DataRows[i]['ID'] = i + 1;
          rankData.DataRows[i]['ou_name'] = rankData.DataRows[i].deptname.split('-')[0];
          rankData.DataRows[i]['dept_name'] = rankData.DataRows[i].deptname.split('-')[1];
        }
        yield put({
          type: 'save',
          payload: {
            searchRankDataList: rankData.DataRows,
          }
        });
      }else{
        message.error('查询职级出错！');
      }
    },
    //导入职级
    *RankImport({ RankData }, {call,put}){
      //console.log("RankData=="+JSON.stringify(RankData));
      yield put({
        type: 'save',
        payload: {
          importRankDataList: [],
        }
      });
      let importdatalist = dataFrontDataImport(RankData);
      if(RankData){
        yield put({
          type: 'save',
          payload: {
            importRankDataList: importdatalist,
            haveData: true
          }
        });
      }
    },

    *importRankDataSubmit({importRankDataList, resolve } , {call}){
      try {
        let import_id = new Date().getTime();
        //console.log("import_id==="+JSON.stringify(import_id));
        //导入数据
        let importData = [];
        for (let i=0;i<importRankDataList.length;i++){
          let importparam = {};
          importparam['import_id'] = import_id;
          importparam['user_id'] = importRankDataList[i].user_id;
          importparam['user_name'] = importRankDataList[i].user_name;
          importparam['year'] = importRankDataList[i].year;
          importparam['join_time'] = importRankDataList[i].join_time;
          importparam['rank_sequence_before'] = importRankDataList[i].rank_sequence_before;
          importparam['rank_sequence'] = importRankDataList[i].rank_sequence;
          importparam['bonus_points'] = importRankDataList[i].bonus_points;
          importparam['effective_time'] = importRankDataList[i].effective_time;
          importparam['promotion_path'] = importRankDataList[i].promotion_path;
          importparam['talents_name'] = importRankDataList[i].talents_name;

          let beforerank = importRankDataList[i].rank_sequence_before;
          let nowrank = importRankDataList[i].rank_sequence;
          importparam['rank_level_before'] = beforerank.substr(1,3);
          importparam['rank_grade_before'] = beforerank.substr(4);
          importparam['rank_level'] = nowrank.substr(1,3);
          importparam['rank_grade'] = nowrank.substr(4);
          importData.push(importparam);
        }
        let insertparam = {};
        insertparam['transjsonarray'] = JSON.stringify(importData);
        let insertRet = yield call(rankService.rankInfoImport, insertparam);
        let insertRet2 = yield call(rankService.rankInfoImportHistory, insertparam);
        if(insertRet.RetCode==='1'&&insertRet2.RetCode==='1'){
          let updateparam = {};
          updateparam['arg_import_id'] = import_id;
          let updateRet = yield call(rankService.rankInfoImportUpdate, updateparam);
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
      }catch (e) {
        resolve("erro");
      }
    },

    * rankPersonSearch({arg_user_id}, {call, put}) {
      let basicparam = {};
      basicparam["arg_user_id"] = arg_user_id;
      const basicInfoData = yield call(rankService.rankInfoQuery, basicparam);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i]['indexID'] = i + 1;
          basicInfoData.DataRows[i]['ID'] = i + 1;
          basicInfoData.DataRows[i]['ou_name'] = basicInfoData.DataRows[i].deptname.split('-')[0];
          basicInfoData.DataRows[i]['dept_name'] = basicInfoData.DataRows[i].deptname.split('-')[1];
        }
        yield put({
          type: 'save',
          payload: {
            historyDataList: basicInfoData.DataRows
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/rankpromote/rankImport') {
          dispatch({ type: 'initQuery',query });
        }
        if (pathname === '/humanApp/rankpromote/rankInfo') {
          dispatch({ type: 'initPersonQuery',query });
        }
        
      });
    }
  }
};
