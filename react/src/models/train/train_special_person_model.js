/**
 * 文件说明：特殊人群设置
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-02-20
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { message } from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
import * as appraiseService from "../../services/appraise/appraiseService";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
const auth_ou = Cookie.get('OU');
const ou_id = Cookie.get('OUID');

let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}
function dataFrontData(data) {
  let frontDataList = [];
  let i = 1;
  for (let item in data) {
    console.log(JSON.stringify(item))
    let newData = {
      index_id: data[item].序号,
      train_group: data[item].特定群体名称,
      user_name: data[item].用户名,
      user_id: data[item].工号,
      remake: data[item].特定群体类型,
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}

export default {
  namespace: 'trainSpecialPersonModel',
  state: {
    user_id: '',
    centerClassCompulsoryDataList: [],
    personVisible: false,
    personList: [],
    person_list: [],
    personString: '',
    selectPersonString: '',
    //插入人员返回信息
    returnNews: '',
    //全院课程信息（必修，选修）
    classDataList: [],
    //落地部门查询
    courtDeptDataList: [],
    //新增培训计划
    trainClassPlanType: [],
    //查询部门
    centerDept: [],
    importPersonDataList:[],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *initQuery({query}, {call, put}) {
      let queryParam = {
        arg_state :'1',
        arg_ou_id : ou_id,
      };
      const queryData = yield call(trainService.trainSpecialPersonalQuery,queryParam);
      if(queryData.RetCode === '1'){
        for (let i=0;i<queryData.DataRows.length;i++){
          queryData.DataRows[i]['indexID'] = i+1;
          queryData.DataRows[i]['ID'] = i+1;
        }
        yield put({
          type: 'save',
          payload: {
            queryDataList: queryData.DataRows
          }
        });
      }else{
        message.error('信息查询失败！');
      }
      //查询全院信息
      let personparam = {
        arg_query: '1'
      };
      let personListData = yield call(trainService.queryPersonList, personparam);
      if (personListData.RetCode === '1') {
        let tag1 = 0;
        let tag2 = 0;
        let tag3 = 0;
        let companylist = [];
        let deptlist = [];
        let personlist = [];
        let company = {};
        let dept = {};
        for (let i = 0; i < personListData.DataRows.length; i++) {
          let personinfo = personListData.DataRows[i];
          let personinfonext = {};
          if ((i + 1) !== personListData.DataRows.length) {
            personinfonext = personListData.DataRows[i + 1]
          }
          if (personinfo.tree_num === '0' || personinfo.tree_num === 0) {
            if (tag1 !== 0) {
              let insetlist = deptlist;
              company.list = insetlist;
              companylist.push(company);
              company = {};
              deptlist = [];
            }
            company.key_name = personinfo.tree_value;
            company.key_num = '0-' + tag1;
            company.tree_num = '0';
            tag1++;
            tag2 = 0;
            //companylist.push(person)
          } else if (personinfo.tree_num === '1' || personinfo.tree_num === 1) {
            if (tag2 !== 0) {
              let insetlist = personlist;
              dept.list = insetlist;
              deptlist.push(dept);
              dept = {};
              personlist = [];
            }
            dept.key_name = personinfo.tree_value;
            dept.key_num = '0-' + (tag1 - 1) + '-' + tag2;
            dept.tree_num = '1';
            tag2++;
            tag3 = 0;
            //deptlist.push(person);

          } else if (personinfo.tree_num === '2' || personinfo.tree_num === 2) {
            let person = {};
            person.key_name = personinfo.tree_value + '-' + personinfo.tree_key;
            person.key_num = '0-' + (tag1 - 1) + '-' + (tag2 - 1) + '-' + tag3;
            person.tree_num = '2';
            tag3++;
            personlist.push(person);
            if (personinfonext.tree_num === '0' || personinfonext.tree_num === 0 || (i + 1) === personListData.DataRows.length) {
              let insetlist = personlist;
              dept.list = insetlist;
              deptlist.push(dept);
              dept = {};
              personlist = [];
            }
          }
          //allperson.push(person);
        }
        company.list = deptlist;
        companylist.push(company);
        //console.log("companylist==="+JSON.stringify(companylist));
        yield put({
          type: 'save',
          payload: {
            person_list: companylist
          }
        })
      } else {
        message.error("查询人员信息为空");
      }

      //查询岗位表
      let getPostParam = {};
      getPostParam["arg_ou_id"] = ou_id;
      const getPostData = yield call(trainService.getPostList, getPostParam);
      if (getPostData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            allPostDataList: getPostData.DataRows
          }
        });
      } else {
        message.error('没有查询内容');
      }

      //查询部门信息
      //查询项目组
      let deptInfoParam = {
        arg_user_id: Cookie.get('userid'),
        arg_ou_id: Cookie.get('OUID'),
      };
      let deptData = yield call(trainService.deptDataQuery, deptInfoParam);
      if (deptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            centerDept: deptData.DataRows
          }
        })
      } else {
        message.error("查询部门信息异常");
      }
    },
    *groupPersonAdd({basicOutPlanApplyPersonData,arg_param}, {call, put}) {
      let postData = {};
      if (basicOutPlanApplyPersonData.length) {
        for (let i = 0; i < basicOutPlanApplyPersonData.length; i++) {
          postData["arg_train_manage_id"] = arg_param.arg_train_manage_id;
          postData["arg_train_person_info"] = basicOutPlanApplyPersonData[i].personname;
          postData["arg_train_group"] = arg_param.arg_train_group;
          postData["arg_remark"] = arg_param.arg_remark;
          postData["arg_ou_id"] = arg_param.arg_ou_id;
          postData["arg_state"] = '1';
          const updateresult = yield call(trainService.trainSpecialPersonalSubmit, postData);
          if(updateresult.RetCode === '1'){
            yield put({
              type: 'initQuery'
            });
          }else{
            message.info(updateresult.RetVal);
          }
        }
      }
    },
    *groupPersonImport({importDataList,arg_param}, {call, put}) {
      //console.log("1=="+JSON.stringify(importDataList));
      //console.log("2=="+JSON.stringify(arg_param));

      if (importDataList.length) {
        for (let i = 0; i < importDataList.length; i++) {
          let postData = {};
          postData["arg_train_manage_id"] = arg_param.arg_train_manage_id;
          postData["arg_train_person_info"] = importDataList[i].user_id;
          postData["arg_train_group"] = importDataList[i].train_group;
          postData["arg_remark"] = importDataList[i].remake;
          postData["arg_ou_id"] = Cookie.get('OUID');
          postData["arg_state"] = '1';

          const updateresult = yield call(trainService.trainSpecialPersonalSubmit, postData);
          if(updateresult.RetCode === '1'){
            yield put({
              type: 'initQuery'
            });
          }else{
            message.info(updateresult.RetVal);
          }
        }
        message.info("导入成功！");
      }
    },
    *groupPersonDel({arg_param}, {call, put}) {
      let delparam = {};
      delparam['arg_train_group'] = arg_param.train_group;
      delparam['arg_remake'] = arg_param.remake;
      const delCadreData = yield call(trainService.trainSpecialPersonalDel,delparam);
      if(delCadreData.RetCode === '1'){
        message.info("操作成功！");
        yield put({
          type: 'initQuery'
        });
      }else{
        message.info(delCadreData.RetVal);
      }
    },
    //提交人员信息表
  /*  *trainSpecialPersonSubmit({ basicOutPlanApplyPersonData, train_class_personal_info_id, resolve }, { call }) {
      let postData = {};
      if (basicOutPlanApplyPersonData.length) {
        for (let i = 0; i < basicOutPlanApplyPersonData.length; i++) {
          postData["arg_train_person_info"] = basicOutPlanApplyPersonData[i].personname;
          postData["arg_train_class_personal_info_id"] = train_class_personal_info_id;
          postData["arg_state"] = '1';
          postData["arg_back_flag"] = '0';
          try {
            //业务表添加
            let updateresult = yield call(trainService.submitTrainOutPlanClassPersonalApply, postData);
            if (updateresult.RetCode === '1') {
              resolve("success");
            } else {
              //回滚功能:数据库
              postData["arg_back_flag"] = '1';
              yield call(trainService.submitTrainOutPlanClassPersonalApply, postData);
              resolve("false");
              return;
            }
          } catch (e) {
            //回滚功能:数据库
            postData["arg_back_flag"] = '1';
            yield call(trainService.submitTrainOutPlanClassPersonalApply, postData);
            resolve("false");
            return;
          }
        }
      }
    },*/
    *importPerson({GradeData}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          importPersonDataList: []
        }
      });
      if (GradeData) {
          yield put({
            type: 'save',
            payload: {
              importPersonDataList: dataFrontData(GradeData),
              haveData: true
            }
          });
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, param, query }) => {
          dispatch({ type: 'initQuery', query });
      });
    }
  },
};
