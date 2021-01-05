/**
 * 文件说明：部门负责人正态分布操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import config  from '../../../utils/config';
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
import {splitEnter} from '../../../utils/func'
let year = new Date().getFullYear().toString();
let season = Math.floor((new Date().getMonth() + 2) / 3).toString();
if(season === '0'){
  season = '4';
  year = (new Date().getFullYear() - 1).toString()
}
const distGroup = {"compDist":'false',"projDist":'false',"mgrDist":'false',"allEmpDist":'false',"finish":'false'};
export default {
  namespace : 'dmdist',
  state : {
    distList:[],
    year:year,
    season:season,
    //分布群体 1：综合绩效员工  2：项目经理  3：项目绩效员工  4：全部员工
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveRes(state, {distList}){
      return {
        ...state,
        distList:[...distList]
      };
    },
  },

  effects : {
    /**
     * 功能：查询该部门经理负责部门数
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * 组织机构调整后，不适用的情况，未考虑；若有，及时补充！！！
     * 1.副经理，只对指标审核人为自己的综合绩效员工进行正态分布
     * 2.没有正态分布的部门,两分院的需求部
     */
    *manageDeptSearch({}, {call, put}) {
      const deptRes = yield call(service.manageDeptSearch,
        {
          'arg_user_id':Cookie.get('userid'),
          "arg_tenantid":config.TENANT_ID
        });
      if(deptRes.RetCode==='1' && deptRes.DataRows && deptRes.DataRows.length){
        let deptList = [];
        for(let i = 0; i < deptRes.DataRows.length;i++){
          deptList.push(deptRes.DataRows[i]);
          //deptList[i] = eval('('+(JSON.stringify(deptList[i])+JSON.stringify(distGroup)).replace(/}{/,',')+')');
          deptList[i]["compDist"] = 'false';
          deptList[i]["projDist"] = 'false';
          deptList[i]["mgrDist"] = 'false';
          deptList[i]["allEmpDist"] = 'false';
          deptList[i]["finish"] = 'false';
        }
        for(let i = 0; i < deptList.length;i++){
          yield put({
            type: 'deptEmpScoreTypeSearch',
            deptList,
            index:i
          });
        }

      }else{
        //message.error("未查询到负责部门数信息！")
        //非部门负责人，只对指标审核人为自己的综合绩效员工进行正态分布
        let distList = [];
        distList.push({"dept_id":Cookie.get('deptid'),"dept_name":Cookie.get('deptname')});
        distList[0]['type'] ='1';
        distList[0]['name'] =distList[0].dept_name.split('-')[1]+'综合绩效员工';
        yield put({
          type: 'deptCompEmpScoreSearch',
          distList,
          index:0
        });
      }
    },

    /**
     * 功能：查询部门员工绩效种类，判断部门经理可以进行的分布操作种类
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param deptList 负责部门列表
     * @param index 部门在列表中索引
     */
    *deptEmpScoreTypeSearch({deptList, index}, {call, put}) {
      const empTypeRes = yield call(service.empScoreSearch,
        {
          transjsonarray:JSON.stringify({"condition":{"year":year,"season":season,"dept_name":deptList[index].dept_name,'tag':'1'}})
        });
      if(empTypeRes.RetCode==='1' && empTypeRes.DataRows && empTypeRes.DataRows.length){
        deptList[index]['finish'] = 'true';
        var comp = 0;
        var proj = 0;
        var mgr = 0 ;
        var group = 0;
        for(let i = 0;i < empTypeRes.DataRows.length;i++){
          if(empTypeRes.DataRows[i].score_type == 0){
            comp++;
            if(empTypeRes.DataRows[i].emp_type == 3){
              group++;
            }
          }else if(empTypeRes.DataRows[i].score_type == 1){
            proj++;
            if(empTypeRes.DataRows[i].emp_type == 1){
              mgr++;
            }
          }
        }
        if(proj == 0 && comp != 0){
          //全部综合绩效
          if(group == 0){
            //全部是员工-对全体员工一/二次分布
            deptList[index].compDist = 'true';
          }else{
            //小组制中心-对小组长一次分布，对全体员工二次分布
            deptList[index].mgrDist = 'true';
            deptList[index].allEmpDist = 'true';
          }
        }else if(proj != 0 && comp == 0){
          //全部项目绩效-对全体员工二次分布
          deptList[index].allEmpDist = 'true';
        }else{
          //既有综合绩效,又有项目绩效-对综合绩效员工一次分布，对全体员工二次分布
          deptList[index].compDist = 'true';
          deptList[index].allEmpDist = 'true';
        }
        if(config.EVAL_NO_COMP_COFFI_DIST_DEPT.indexOf(deptList[index].dept_name) != -1){
          //是本部的公众研发事业部,不对综合绩效的员工做一次正态分布
          deptList[index].compDist = 'false';
        }
        if(config.EVAL_PROJ_COFFI_DIST_DEPT.indexOf(deptList[index].dept_name) != -1){
          //是分院的项目管理部 或者 本部的公众研发事业部,对项目绩效的员工做二次正态分布
          deptList[index].projDist = 'true';
          deptList[index].allEmpDist = 'false';
        }
        //本院对项目经理和小组长群体做分布
        if(mgr && deptList[index].dept_name.indexOf(config.OU_HQ_NAME_CN_PREFIX) != -1){
          deptList[index].mgrDist = 'true';
        }
        //有组长的部门，不对综合绩效员工做分布
        if(group){
          //全部是员工-对全体员工一/二次分布
          deptList[index].compDist = 'false';
        }
        let flag = true;
        for(let i = 0;i < deptList.length;i++){
          if(deptList[i].finish == 'false'){
            flag = false;
          }
        }
        if(flag){
          let distList = [];
          //生成要显示的tab项
          for(let i = 0; i < deptList.length;i++){
            if(deptList[i].compDist == 'true'){
              distList.push({"dept_id":deptList[i].dept_id,"dept_name":deptList[i].dept_name});
              distList[distList.length-1]['type'] ='1';
              distList[distList.length-1]['name'] =distList[distList.length-1].dept_name.split('-')[1]+'综合绩效员工';
            }
            if(deptList[i].mgrDist == 'true'){
              distList.push({"dept_id":deptList[i].dept_id,"dept_name":deptList[i].dept_name});
              distList[distList.length-1]['type'] ='2';
              distList[distList.length-1]['name'] ='项目经理';
            }
            if(deptList[i].projDist == 'true'){
              distList.push({"dept_id":deptList[i].dept_id,"dept_name":deptList[i].dept_name});
              distList[distList.length-1]['type'] ='4';
              distList[distList.length-1]['name'] ='项目绩效员工';
            }
            if(deptList[i].allEmpDist == 'true'){
              distList.push({"dept_id":deptList[i].dept_id,"dept_name":deptList[i].dept_name});
              distList[distList.length-1]['type'] ='3';
              distList[distList.length-1]['name'] ='全部员工';
            }
          }
          yield put({
            type: 'saveRes',
            distList
          });
          //alert(JSON.stringify(distList))
          //每个tab项初始化数据
          for(let i = 0; i < distList.length; i++){
            if(distList[i].type == '1'){
              yield put({
                type: 'deptCompEmpScoreSearch',
                distList,
                index:i
              });
              return
            }else if(distList[i].type == '2'){
              yield put({
                type: 'deptPMScoreSearch',
                distList,
                index:i
              });
              return
            }else if(distList[i].type == '4'){
              yield put({
                type: 'deptProjEmpScoreSearch',
                distList,
                index:i
              });
              return
            }else if(distList[i].type == '3'){

              if(distList[i].dept_name.indexOf(config.OU_HQ_NAME_CN_PREFIX) != -1){
                //本部-全部员工，含项目经理和小组长
                yield put({
                  type: 'deptAllEmpScoreSearch',
                  distList,
                  index:i
                });
              }else{
                //分院-只包含员工
                yield put({
                  type: 'branchDeptOnlyEmpScoreSearch',
                  distList,
                  index:i
                });
              }
              return
            }
          }
        }
      }else{
        message.error("未查询到部门员工本次考核数据信息，无法判断需正态分布群体！")
      }
    },

    /**
     * 功能：初始化部门综合绩效员工考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param distList 分布群体基本信息列表
     * @param index 分布群体索引
     */
    *deptCompEmpScoreSearch({distList, index}, {call, put}) {
      const scoreRes = yield call(service.deptCompEmpScoreSearch,
        {
          'arg_checker_id':Cookie.get('userid'),
          'arg_year':year,
          'arg_season':season,
          "arg_dept_name":distList[index].dept_name
        });

      if(scoreRes && scoreRes[0].RetCode==='1' && scoreRes[1].RetCode==='1'){
        var empFlag = false;
        var rankFlag = false;
        var score_has_null = false;
        if(scoreRes[1].DataRows && scoreRes[1].DataRows.length){
          distList[index].scores = scoreRes[1].DataRows;
          //debugger
          //alert("scores:"+JSON.stringify(distList[index].scores))
          for(var i = 0;i < scoreRes[1].DataRows.length;i++) {
            if (scoreRes[1].DataRows[i].score == undefined || scoreRes[1].DataRows[i].score == '') {
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }
          }
          empFlag = true;
        }
        if(scoreRes[0].DataRows && scoreRes[0].DataRows.length){
          distList[index].rank = scoreRes[0].DataRows;
          rankFlag = true;
        }
        if(empFlag && score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门综合绩效员工正态分布比例及余数信息，请联系相关人员进行配置！<br/>尚有员工没有考核成绩，暂不能做正态分布！"),8);
        }else if(empFlag && score_has_null && rankFlag){
          message.warning(splitEnter("尚有员工没有考核成绩，暂不能做正态分布！"),8);
        }else if(empFlag && !score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门综合绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }else if(!empFlag && rankFlag){
          message.warning("该部门无待正态分布综合绩效员工！",8);
        }else if(!empFlag && !rankFlag){
          message.warning(splitEnter("该部门无待正态分布综合绩效员工！<br/>未查询到该部门综合绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }
        yield put({
          type: 'saveRes',
          distList
        });
      }

    },

    /**
     * 功能：初始化部门项目绩效员工考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param distList 分布群体基本信息列表
     * @param index 分布群体索引
     */
    *deptProjEmpScoreSearch({distList, index}, {call, put}) {
      /*let post = '("'+ config.EVAL_EMP_POST +'")';
      if(distList[index].dept_name.indexOf(config.OU_HQ_NAME_CN_PREFIX) != -1){
        post = '("'+ config.EVAL_EMP_POST +'","'+ config.EVAL_MGR_POST +'")'
      }*/
      let emp_type = '("0")';
      if(distList[index].dept_name.indexOf(config.OU_HQ_NAME_CN_PREFIX) != -1){
        emp_type = '("0","1")'
      }
      const scoreRes = yield call(service.deptProjEmpScoreSearch,
        {
          'arg_year':year,
          'arg_season':season,
          "arg_dept_id":distList[index].dept_id,
          "arg_dept_name":distList[index].dept_name,
          "arg_tenantid":config.TENANT_ID,
          //"arg_post_name":post
          "arg_emp_type":emp_type
        });

      if(scoreRes && scoreRes[0].RetCode==='1' && scoreRes[1].RetCode==='1'){
        var empFlag = false;
        var rankFlag = false;
        var score_has_null = false;
        if(scoreRes[1].DataRows && scoreRes[1].DataRows.length){
          distList[index].scores = scoreRes[1].DataRows;
          for(var i = 0;i < scoreRes[1].DataRows.length;i++) {
            if (scoreRes[1].DataRows[i].score == undefined || scoreRes[1].DataRows[i].score == '') {
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }
          }
          empFlag = true;
        }
        if(scoreRes[0].DataRows && scoreRes[0].DataRows.length){
          distList[index].rank = scoreRes[0].DataRows;
          rankFlag = true;
        }
        if(empFlag && score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！<br/>尚有员工没有考核成绩，暂不能做正态分布！"),8);
        }else if(empFlag && score_has_null && rankFlag){
          message.warning(splitEnter("尚有员工没有考核成绩，暂不能做正态分布！"),8);
        }else if(empFlag && !score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }else if(!empFlag && rankFlag){
          message.warning("该部门无待正态分布项目绩效员工！",8);
        }else if(!empFlag && !rankFlag){
          message.warning(splitEnter("该部门无待正态分布项目绩效员工！<br/>未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }
        yield put({
          type: 'saveRes',
          distList
        });
      }
    },

    /**
     * 功能：初始化部门全部员工(员工、项目经理、小组长)考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param distList 分布群体基本信息列表
     * @param index 分布群体索引
     */
    *deptAllEmpScoreSearch({distList, index}, {call, put}) {
      const scoreRes = yield call(service.deptAllEmpScoreSearch,
        {
          'arg_year':year,
          'arg_season':season,
          "arg_dept_name":distList[index].dept_name,
          "arg_tenantid":config.TENANT_ID,
        });
      if(scoreRes && scoreRes[0].RetCode==='1' && scoreRes[1].RetCode==='1'){
        var empFlag = false;
        var rankFlag = false;
        var score_has_null = false;
        if(scoreRes[1].DataRows && scoreRes[1].DataRows.length){
          distList[index].scores = scoreRes[1].DataRows;
          for(var i = 0;i < scoreRes[1].DataRows.length;i++) {
            if (scoreRes[1].DataRows[i].score == undefined || scoreRes[1].DataRows[i].score == '') {
              //alert("得分为空")
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }
          }
          empFlag = true;
        }
        if(scoreRes[0].DataRows && scoreRes[0].DataRows.length){
          distList[index].rank = scoreRes[0].DataRows;
          rankFlag = true;
        }
        console.log("empFlag:"+empFlag)
        console.log("score_has_null:"+score_has_null)
        console.log("rankFlag:"+rankFlag)
        if(empFlag && score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门全部员工正态分布比例及余数信息，请联系相关人员进行配置！<br/>尚有员工没有考核成绩，暂不能做正态分布！"),8);
        }else if(empFlag && score_has_null && rankFlag){
          message.warning(splitEnter("尚有员工没有考核成绩，暂不能做正态分布！"),8);
        }else if(empFlag && !score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门全部员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }else if(!empFlag && rankFlag){
          message.warning("该部门无待正态分布员工！",8);
        }else if(!empFlag && !rankFlag){
          message.warning(splitEnter("该部门无待正态分布员工！<br/>未查询到该部门全部员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }
        yield put({
          type: 'saveRes',
          distList
        });
      }else{
        message.warning("未查询到部门员工考核记录，未查询到部门余数信息！",8)
      }
    },

    /**
     * 功能：初始化部门全部员工(分院)考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param distList 分布群体基本信息列表
     * @param index 分布群体索引
     */
    *branchDeptOnlyEmpScoreSearch({distList, index}, {call, put}) {
      const scoreRes = yield call(service.branchDeptOnlyEmpScoreSearch,
        {
          'arg_year':year,
          'arg_season':season,
          "arg_dept_name":distList[index].dept_name,
        });

      if(scoreRes && scoreRes.RetCode==='1'){
        const rankRes = yield call(service.deptRankRatioSearch,
          {
            transjsonarray:JSON.stringify({"condition":{"year":year,
              "season":season,"type":'3',
              'dept_name':distList[index].dept_name}})
          });

        if(rankRes.RetCode==='1' && rankRes.DataRows && rankRes.DataRows.length){
          distList[index].scores = scoreRes.DataRows;
          let score_has_null = false;
          for(let i = 0;i < scoreRes.DataRows.length;i++) {
            if (scoreRes.DataRows[i].score == undefined || scoreRes.DataRows[i].score == '') {
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }
          }
          distList[index].rank = rankRes.DataRows;
          if(score_has_null){
            message.warning("尚有员工没有考核成绩，暂不能做正态分布！",5)
          }
          yield put({
            type: 'saveRes',
            distList
          });
        }else{
          distList[index].scores = scoreRes.DataRows;
          //let score_has_null = false;
          for(let i = 0;i < scoreRes.DataRows.length;i++) {
            if (scoreRes.DataRows[i].score == undefined || scoreRes.DataRows[i].score == '') {
              //score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }
          }
          distList[index].rank = [];
          message.warning(splitEnter('该部门全部员工群体尚未配置评价比例信息！<br>尚有员工没有考核成绩，暂不能做正态分布！') ,8)
          yield put({
            type: 'saveRes',
            distList
          });
        }

      }else{
        message.warning("部门内全部员工考核结果查询失败！",8);
      }
    },

    /**
     * 功能：初始化部门项目经理考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param distList 分布群体基本信息列表
     * @param index 分布群体索引
     */
    *deptPMScoreSearch({distList, index}, {call, put}) {
      const scoreRes = yield call(service.deptPMScoreSearch,
        {
          'arg_year':year,
          'arg_season':season,
          //"arg_dept_id":dept.dept_id,
          "arg_dept_id":distList[index].dept_id,
          "arg_dept_name":distList[index].dept_name,
          //"arg_dept_name":dept.dept_name,
          "arg_tenantid":config.TENANT_ID,
          "arg_post_name":'("'+ config.EVAL_MGR_POST +'","'+ config.EVAL_GROUP_LEADER_POST +'")'
          //"arg_post_name":'("'+ config.EVAL_MGR_POST +'")'
        });

      if(scoreRes && scoreRes.RetCode==='1'){
        const rankRes = yield call(service.deptRankRatioSearch,
          {
            transjsonarray:JSON.stringify({"condition":{"year":year,
              "season":season,"type":'2',
              'dept_name':distList[index].dept_name}})
          });

        if(rankRes.RetCode==='1' && rankRes.DataRows && rankRes.DataRows.length){
          distList[index].scores = scoreRes.DataRows;
          let score_has_null = false;
          for(let i = 0;i < scoreRes.DataRows.length;i++) {
            if (scoreRes.DataRows[i].score == undefined || scoreRes.DataRows[i].score == '') {
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break;
            }
          }
          distList[index].rank = rankRes.DataRows;
          if(score_has_null){
            message.warning("尚有员工没有考核成绩，暂不能做正态分布！",5)
          }
          yield put({
            type: 'saveRes',
            distList
          });
        }else{
          distList[index].scores = scoreRes.DataRows;
          for(let i = 0;i < scoreRes.DataRows.length;i++) {
            if (scoreRes.DataRows[i].score == undefined || scoreRes.DataRows[i].score == '') {
              distList[index]["score_has_null"] = true;
              break
            }
          }
          distList[index].rank = [];
          message.warning(splitEnter('该部门项目经理考核群体尚未配置评价比例信息！<br>尚有员工没有考核成绩，暂不能做正态分布！') ,8)
          yield put({
            type: 'saveRes',
            distList
          });
        }

      }else{
        message.warning("部门内项目经理考核结果查询失败！",8);
      }
    },

  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/dmdistribute') {
          dispatch({type: 'manageDeptSearch',query});
        }
      });

    },
  },
};
