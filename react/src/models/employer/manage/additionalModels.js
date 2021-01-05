/**
 * 文件说明：员工指标管理-指标新增、修改、查询操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 */
import * as service from '../../../services/employer/empservices';
import config  from '../../../utils/config';
import message from '../../../components/commonApp/message';
import Cookie from 'js-cookie';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {splitEnter} from '../../../utils/func';

const year = new Date().getFullYear().toString();
const season = Math.floor((new Date().getMonth() + 1 + 2) / 3).toString();

let undefinedChecker = [];
export default {
  namespace : 'additional',
  state : {
    year:year,
    season:season,
    list: [],
    display:false,//是否可以开始新增本季度指标
    addDisplay:false,//是否可以新增/修改指标内容
    projList:[],
    //isSubmit:false,
    perf_emp_type:'',
    post:'',
    flag:'',
    checker_id:'',
    checker_name:'',
    noKpiProjList:[],
    additionalInfo:{}
    //员工类别emp_type    0：进入项目组    1：不进入项目组    2：嵌入项目组
  },

  reducers : {
    /**
     * 功能：更新状态树-员工历次考核结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param state 初始状态
     * @param list 员工历次考核结果
     */
    saveRes(state, {list}){
      return {
        ...state,
        list
      };
    },
    /**
     * 功能：更新状态树-是否可编辑指标内容
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param state 初始状态
     * @param addDisplay 是否可以新增/修改指标内容
     */
    saveDisplay(state, {addDisplay}){
      return {
        ...state,
        addDisplay
      };
    },
    /**
     * 功能：更新状态树-考核历史记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param state 初始状态树
     * @param list 历史考核结果
     * @param display 是否可以开始新增本季度指标
     */
    saveCardRes(state, {list,display}){
      return {
        ...state,
        list,
        display
      };
    },
    /**
     * 功能：更新状态树-员工基本信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param state 初始状态树
     * @param perf_type_id 员工考核指标类别
     * @param perf_emp_type 员工绩效类型
     * @param emp_type 员工职务类型
     * @param flag 操作类型，新增/修改/填写完成情况
     * @param post 员工职位
     * @param year 考核年度
     * @param season 考核季度
     */
    saveEmpInfo(state, {perf_type_id,perf_emp_type,emp_type,flag,post,year,season}){
      return {
        ...state,
        //isSubmit,
        perf_type_id,
        perf_emp_type,
        emp_type,
        flag,
        post,
        year,
        season
      }
    },
    /**
     * 功能：更新状态树-审核人
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
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
     * 功能：更新状态树-参与项目信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param state 初始状态树
     * @param projList 员工所参与项目列表
     */
    saveProjList(state, {projList}){
      return {
        ...state,
        projList
      }
    },
    /**
     * 功能：更新状态树-有有效工时，未填写考核指标
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param state 初始状态树
     * @param projList 员工所参与项目列表
     */
    saveNoKpiProjList(state, {noKpiProjList,additionalInfo}){
      return {
        ...state,
        noKpiProjList,
        additionalInfo
      }
    },
  },

  effects : {
    /**
     * 功能：初始化员工考核结果列表
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *empScoreInit({}, {call, put}) {
      yield put({
        type: 'saveCardRes',
        list:[],
        display: false
      });
      const scoreRes = yield call(service.empScoreNotSubmitSearch,
        {
          arg_cur_year:year,
          arg_cur_season:season,
          arg_staff_id:Cookie.get('userid')
        });
      if(scoreRes.RetCode==='1'){
        const kpiAddedRes = yield call(service.judgeKpiAdded,
          {
            year:year,
            season:season,
            staff_id:Cookie.get('userid'),
            time:moment().format('YYYY-MM-DD HH:mm:ss')
          });
        if(kpiAddedRes.RetCode==='1'){
          yield put({
            type: 'saveCardRes',
            list: scoreRes.DataRows,
            display: true
          });
        }else{
          yield put({
            type: 'saveRes',
            list: scoreRes.DataRows
          });
        }
      }
    },

    /**
     * 功能：员工审核人信息查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    *empCheckerSearch({query}, {call, put}) {
      const empLeaderRes = yield call(service.empLeaderCheckerSearch,
        {
          arg_roleid:config.EVAL_MIDDLE_LEADER_POST_ID,
          arg_flag:'1',
          arg_deptname:Cookie.get('dept_name')
        });
      if(empLeaderRes.RetCode==='1' && empLeaderRes.DataRows && empLeaderRes.DataRows.length != 0){
        yield put({
          type: 'saveEmpLeader',
          checkerList: empLeaderRes.DataRows
        });
        yield put({type: 'empInfoSearch',query});
      }else{
        message.warning("未查询到审核人信息！")
      }
    },

    /**
     * 功能：员工基本信息查询，含员工ou、部门、类别
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param query 查询条件
     */
    *empInfoSearch({query},{call, put}) {
      query.year = query.year ? query.year : year;
      query.season = query.season ? query.season : season;
      //yield put({type: 'empCheckerSearch'});
      const empInfoRes = yield call(service.empInfoSearch,
        {
          arg_tenant_id:config.TENANT_ID,
          arg_staff_id:Cookie.get('userid')
        });
      if(empInfoRes.RetCode==='1'){
        if(empInfoRes.DataRows && empInfoRes.DataRows.length){
          let item;
          if(empInfoRes.DataRows.length == 1){
            item = empInfoRes.DataRows[0]
          }else{
            for(let i = 0; i < empInfoRes.DataRows.length; i++){
              if(Cookie.get('OU') == empInfoRes.DataRows[i].ou_match){
                item = empInfoRes.DataRows[i]
                break
              }
            }
          }
          if(item){
            if(item.flag == undefined || item.flag == null){
              let type = item.emp_type == undefined ? '无' :( item.emp_type == '1' ? config.EVAL_COMP_PERF:config.EVAL_PROJ_PERF);
              message.warning(splitEnter("您当前职位："+item.post+"&nbsp;考核类型："+ type+",<br/>未查询到匹配的考核规则，请与部门负责人商议调整后再填报指标"),10);
            }else if(item.flag == 1){
              message.warning(splitEnter(item.error_info),10);
            }else if(item.flag == 0){
              let perf_type_id = item.perf_type_id;
              let perf_emp_type = item.perf_emp_type;
              let emp_type = item.emp_post_type;
              item.emp_type = item.emp_post_type;
              if(query.flag == '0'){
                //新增指标
                if(perf_type_id == "300"){
                  yield put({type: 'empProjSearch',perf_type_id,emp_info:item,tag:0,...query})
                }else if(perf_type_id == "400" || perf_type_id == "500"){
                  // if(emp_type == '1'){
                  //   yield put({type:'pmProjSearch',perf_type_id,emp_info:item,...query})
                  // }else{
                  //   yield put({type: 'empProjSearch',perf_type_id,emp_info:item,tag:1,...query})
                  // }
                  yield put({type: 'empProjSearch',perf_type_id,emp_info:item,tag:1,...query})
                }else{
                  let proj = [{"perf_type_id":perf_type_id,"emp_type":item.emp_type,"perf_name":config.EVAL_COMP_EVAL,"ou":item.ou.split('-')[1],"dept_name":item.dept_name,"post":item.post}];
                  yield put({type:'saveProjList',projList:proj})
                  yield put({type:'empPerfKpiTypeSearch',proj:proj[0],...query})
                }
              }else if(query.flag == "1" || query.flag == "2"){
                //修改指标
                yield put({type:'unPassKpiScoreSearch',...query,perf_type_id,emp_info:item})
              }else if(query.flag == "3"){
                //补录指标
                let proj = {"perf_type_id":perf_type_id,"emp_type":item.emp_type,"ou":item.ou.split('-')[1],"dept_name":item.dept_name,"post":item.post};

                yield put({type:'unPassKpiScoreSearch',...query,perf_type_id,emp_info:item,proj})
              }

              yield put({
                type: 'saveEmpInfo',
                perf_type_id,
                perf_emp_type,
                emp_type,
                post:item.post,
                ...query
              });
            }
          }else{
            message.warning("未查询到匹配考核规则，请联系后台支撑人员进行配置！",6)
          }

        }else{
          message.warning("未查询到员工信息，请联系后台支撑人员进行配置！",6)
        }
      }
    },

    /**
     * 功能：员工参与项目信息查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param perf_type_id 员工考核指标类别
     * @param emp_info 员工信息
     * @param year 考核年度
     * @param season 考核季度
     * @param flag 操作类型：新增/修改/填写完成情况
     */
    *empProjSearch({perf_type_id, emp_info,tag,year,season,flag},{call,put}){
      //debugger
      const empProjRes = yield call(service.empProjSearch,{arg_staff_id:Cookie.get('userid')});
      if (empProjRes.RetCode === '1') {
        if(empProjRes.DataRows && empProjRes.DataRows.length){
          let projList = [];
          for(let i = 0; i < empProjRes.DataRows.length;i++){
            let item = empProjRes.DataRows[i];
            if(tag != 0){
              item.mgr_id = undefined;
              item.mgr_name = undefined;
            }
            item.perf_type_id = perf_type_id;
            item.emp_type = emp_info.emp_type;
            item.ou = emp_info.ou.split('-')[1];
            item.dept_name = emp_info.dept_name;
            item.perf_name = item.proj_name + '绩效考核指标';
            item.post = emp_info.post;
            projList.push(item);
            yield put({type: 'empPerfKpiTypeSearch',proj:item,year,season,flag});
          }
          yield put({type:'saveProjList',projList});
        }else{
          message.warning(splitEnter("您的绩效类型为业务绩效，但未查询到您所参与的项目信息，<br/>请联系项目经理在团队管理中将您纳入项目！"),10);
        }
      }
    },

    /**
     * 功能：项目经理参与项目信息查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param perf_type_id 员工考核指标类别
     * @param emp_info 员工信息
     * @param year 考核年度
     * @param season 考核季度
     * @param flag 操作类型：新增/修改/填写完成情况
     */
    *pmProjSearch({perf_type_id, emp_info,year,season,flag}, {call, put}) {
      const pmProjRes = yield call(service.pmProjSearch, {arg_mgr_id: Cookie.get('userid')});
      if (pmProjRes.RetCode === '1') {
        if(pmProjRes.DataRows && pmProjRes.DataRows.length){
          let projList = [];
          for(let i = 0; i < pmProjRes.DataRows.length;i++) {
            let item = pmProjRes.DataRows[i];
            item.perf_type_id = perf_type_id;
            item.emp_type = emp_info.emp_type;
            item.ou = emp_info.ou.split('-')[1];
            item.dept_name = emp_info.dept_name;
            item.perf_name = item.proj_name + '绩效考核指标';
            item.post = emp_info.post;
            projList.push(item);
            yield put({type: 'empPerfKpiTypeSearch',proj:item,year,season,flag});
          }
          yield put({type:'saveProjList',projList});
        }else{
          message.warning("当前系统没有您所负责的主责项目，请联系项目部为您添加项目信息！",8);
        }

      }
    },
    //获取考核指标类型
    /**
     * 功能：获取考核指标类型
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     * @param flag 操作类型：新增/修改/填写完成情况
     */
    *empPerfKpiTypeSearch({proj,year,season,flag},{call,put}){
      const kpiTypeRes = yield call(service.empWordbookSearch,
        {transjsonarray:JSON.stringify(
          {"condition":{"WORDBOOK_TYPE_ID":proj.perf_type_id},
            "sequence":[{"is_order":'0'}]
          })});
      if (kpiTypeRes.RetCode === '1' && kpiTypeRes.DataRows && kpiTypeRes.DataRows.length) {
        proj.allTypes = [];
        proj.types = [];
        yield put({type:'geneKpiType',list:proj.allTypes,obj:kpiTypeRes.DataRows});
        yield put({type:'geneKpiType',list:proj.types,obj:kpiTypeRes.DataRows});
        yield put({type: 'empFixedKpiSearch',proj,year,season,flag});
      }else{
        message.warning("未查询到考核指标分类信息，请联系后台人员进行配置！")
      }
    },
    //获取固定考核指标
    /**
     * 功能：获取固定考核指标
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     * @param flag 操作类型：新增/修改/填写完成情况
     */
    *empFixedKpiSearch({proj,year,season,flag},{call,put}){
      const fixedKpiRes = yield call(service.empFixedKpiSearch,
        {transjsonarray:JSON.stringify({"condition":{"type_id":proj.perf_type_id},
          "sequence":[{"is_order":'0'}]})  });
      if (fixedKpiRes.RetCode === '1' && fixedKpiRes.DataRows) {
        fixedKpiRes.DataRows.map((i) => {
          proj.types=proj.types.filter((j)=>j.WORDBOOK_NAME!=i.kpi_type)
          proj.kpi = {};
          proj.kpi.kpi_type = proj.types[0].WORDBOOK_NAME
        })
        proj.empKpis = []
        if(flag == "0" || flag == "3"){

          for(let m = 0; m < fixedKpiRes.DataRows.length; m++){
            let j = fixedKpiRes.DataRows[m];
            let kpi = {"proj_id":proj.proj_id,"kpi_type":j.kpi_type,"kpi_name":j.kpi_name,"kpi_content":j.kpi_content,"formula":j.formula,"target_score":j.target,"checker_id":j.checker_id ? j.checker_id :proj.mgr_id,"checker_name":j.checker_name ? j.checker_name : proj.mgr_name,"remark":j.remark,"isEdit":'false'};
            proj.empKpis.push(kpi)
          }

          yield put({type:'savedKpiSearch',proj,year,season})
        }else if(flag == "1" || flag == "2" ){
          yield put({type:'unPassKpiSearch',proj,year,season})
        }
        yield put({type:'saveDisplay',addDisplay:'true'});
      }
    },

    /**
     * 功能：判断是否固定指标
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param item 指标项
     */
    *isFixedKpi({item},{call,put}){
      item['isEdit'] = 'true';
      if(item.kpi_type && (item.kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE ||item.kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE)){
        item['isEdit'] = 'false';
      }
    },

    /**
     * 功能：绑定指标类型
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param list 指标类型可选项
     * @param obj 指标类型列表
     */
    *geneKpiType({list,obj},{call,put}){
      for(let i = 0;i < obj.length;i++){
        list.push({"WORDBOOK_ID":obj[i].WORDBOOK_ID,"WORDBOOK_NAME":obj[i].WORDBOOK_NAME});
      }
    },

    /**
     * 功能：保存指标查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj项目信息
     * @param year 考核年度
     * @param season 考核季度
     */
    *savedKpiSearch({proj,year,season},{call,put}){
      const kpiRes = yield call(service.empKpiSearch,
        {transjsonarray:JSON.stringify({"condition":{
          "staff_id":Cookie.get('userid'),
          "proj_id":proj.proj_id,
          "year":year,
          "season":season,
          "state":'0'}})   });
      if (kpiRes.RetCode === '1' && kpiRes.DataRows) {
        let kpis = kpiRes.DataRows;
        yield put({type:'listKpi',proj,kpis});
      }
    },

    /**
     * 功能：审核未通过指标查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     */
    *unPassKpiSearch({proj,year,season},{call,put}){
      const kpiRes = yield call(service.empKpiSearch,
        {transjsonarray:JSON.stringify({"condition":{
          "staff_id":Cookie.get('userid'),
          "proj_id":proj.proj_id,
          "year":year,
          "season":season

        }})   });
      if (kpiRes.RetCode === '1' && kpiRes.DataRows) {
        let kpis = kpiRes.DataRows;
        yield put({type:'listKpi',proj,kpis});
      }
    },

    /**
     * 功能：指标与项目按对应关系整合
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj 项目信息
     * @param kpis 指标列表
     */
    *listKpi({proj,kpis},{call,put}){
      for(let m = 0; kpis && m < kpis.length; m++){

        let i = kpis[m];
        let flag = 0;
        for(let n = 0; proj.allTypes && n < proj.allTypes.length;n++){
          if(i.kpi_type && i.kpi_type.indexOf(proj.allTypes[n].kpi_type) != -1){
            flag = 1;
            i.kpi_type = proj.allTypes[n].kpi_type;
            break;
          }
          if(i.kpi_type.indexOf(config.EVAL_PROJ_EVAL_KPI_OLD) != -1){
            flag = 1;
            i.kpi_type = config.EVAL_PROJ_EVAL_KPI;
            break;
          }
        }
        if(flag){
          i['isEdit'] = 'true';
          if(i.kpi_type && (i.kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE ||i.kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE)){
            i['isEdit'] = 'false';
          }
          let j = proj;
          if(j.proj_id == i.proj_id || (j.proj_name != undefined && j.proj_name != '' && i.proj_name.indexOf(j.proj_name) != -1)){
            let checker_id = '';
            let checker_name = '';
            if(i.isEdit == 'false' && ( i.checker_name == config.EVAL_TIMESHEET_VALUE || i.checker_name == config.EVAL_PROJ_DEPT_VALUE || i.checker_name == config.EVAL_PROJ_DEPT_VALUE_OLD)){
              checker_id = config.EVAL_FIXED_KPI_CHECKER_ID;
              checker_name = i.checker_name;
            }else{
              checker_id = j.mgr_id || i.checker_id;
              checker_name = j.mgr_name ||i.checker_name;
            }

            let kpi = {"id":i.id,
              "kpi_type":i.kpi_type,
              "kpi_name":i.kpi_name,
              "kpi_content":i.kpi_content,
              "formula":i.formula,
              "target_score":i.target_score,
              "checker_id":checker_id,
              "checker_name":checker_name,
              "remark":i.remark,
              "isEdit":i.isEdit,
              "finish":i.finish,
              "proj_id":j.proj_id,
              "state":i.state,
            };
            if(kpi.state == '6'){
              kpi['score'] = i.score;
            }
            proj.empKpis.push(kpi);
          }
        }
      }
      //console.log('aaaaaaaaaaaa:'+JSON.stringify(proj))
      //console.log('bbbbbbbbbbbb:'+JSON.stringify(proj.empKpis))
    },

    /**
     * 功能：指标保存
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param params 待保存指标信息
     */
    *saveKpi({params},{call,put}){

      const kpiSaveRes = yield call(service.empKpiSave,params);
      if (kpiSaveRes.RetCode === '1') {
        message.success("保存成功!");
      }else{
        message.error("保存失败！")
      }
    },

    /**
     * 功能：指标提交
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param params 待提交指标信息
     */
    *submitKpi({params},{call,put}){

      const kpiSubmitRes = yield call(service.empKpiSubmit,params);
      if (kpiSubmitRes.RetCode === '1') {
        message.success("提交成功!");
        yield put(routerRedux.push('humanApp/employer/manage'));
      }else{
        message.error("提交失败！")
      }
    },



    /**
     * 功能：审核未通过指标记录查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param year 考核年度
     * @param season 考核季度
     * @param staff_id 员工编号
     * @param flag 操作类型：新增/修改/填写完成情况
     * @param perf_type_id 员工考核指标类别
     * @param emp_info 员工信息
     */
    *unPassKpiScoreSearch({year,season,staff_id,flag,perf_type_id,emp_info,proj},{call,put}){

      const kpiRes = yield call(service.empScoreSearch,
        {transjsonarray :JSON.stringify({"condition":{"staff_id":Cookie.get('userid'),
        "year":year,"season":season,"tag":'0'},"sequence":[{"create_time":"0"}]})});
      if (kpiRes.RetCode === '1' && kpiRes.DataRows) {
          yield put({type:'hasTimeProjSearch',hasKpiProjList:kpiRes.DataRows,year,season,flag,proj})

        }

    },


    /**
     * 功能：已填工时项目查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param projList 项目信息
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     */
      *hasTimeProjSearch({hasKpiProjList,year,season,flag,proj},{call,put}){
      const projRes = yield call(service.hasTimeProjSearch,
        {
          arg_year:year,
          arg_season:season,
          arg_staff_id:Cookie.get("userid"),
        });
      if (projRes.RetCode === '1' && projRes.DataRows && projRes.RowCount) {
        let noKpiProjList = [];
        for(let i = 0; i < projRes.DataRows.length; i++){
          let has = 0;
          for(let j = 0; j < hasKpiProjList.length; j++){
            if(projRes.DataRows[i].proj_id == hasKpiProjList[j].proj_id){
              has = 1;
              j = hasKpiProjList.length;
            }
          }
          if(has == 0){
            noKpiProjList.push(projRes.DataRows[i]);
          }
        }
        if(noKpiProjList.length == 1){
          let projList = [];
          for(let i = 0; i < noKpiProjList.length; i++){
            //projList.push(eval('('+(JSON.stringify(noKpiProjList[i])+JSON.stringify(proj)).replace(/}{/,',')+')'));
            projList.push(noKpiProjList[i]);
            projList[i]["perf_type_id"] = proj.perf_type_id;
            projList[i]["emp_type"] = proj.emp_type;
            projList[i]["ou"] = proj.ou;
            projList[i]["dept_name"] = proj.dept_name;
            projList[i]["post"] = proj.post;

            projList[i].perf_name = noKpiProjList[i].proj_name + '业务绩效考核指标';
            yield put({type:'empPerfKpiTypeSearch',proj:projList[i],year,season,flag})
          }
          yield put({type:'saveProjList',projList});
        }else{
          let additionalInfo = {year,season,flag,proj};
          yield put({type:'saveNoKpiProjList',noKpiProjList,additionalInfo});
        }

      }
    },
    /**
     * 功能：特定项目指标补录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param projList 项目信息
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     */
      *specialProjAddKpi({params},{call,put}){
      let projId = params.projId;
      let noKpiProjList = params.noKpiProjList;
      let additionalInfo = params.additionalInfo;
        let projList = [];
        for(let i = 0; i < noKpiProjList.length; i++){
          if(projId == noKpiProjList[i].proj_id){
            //projList.push(eval('('+(JSON.stringify(noKpiProjList[i])+JSON.stringify(additionalInfo.proj)).replace(/}{/,',')+')'));
            projList.push(noKpiProjList[i]);
            projList[i]["perf_type_id"] = additionalInfo.proj.perf_type_id;
            projList[i]["emp_type"] = additionalInfo.proj.emp_type;
            projList[i]["ou"] = additionalInfo.proj.ou;
            projList[i]["dept_name"] = additionalInfo.proj.dept_name;
            projList[i]["post"] = additionalInfo.proj.post;

            let index = projList.length - 1;
            projList[index].perf_name = noKpiProjList[i].proj_name + '业务绩效考核指标';
            yield put({type:'empPerfKpiTypeSearch',proj:projList[index],year:additionalInfo.year,season:additionalInfo.season,
              flag:additionalInfo.flag})
          }
        }
        yield put({type:'saveProjList',projList});
    },






    /**
     * 功能：项目绩效文件解析
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param path 文件路径
     * @param kpiColl 指标
     * @param checkerList 审核人列表
     * @param perf_type_id 员工考核指标类别
     */
    *projKpiFileAnalyze({path,kpiColl,checkerList,perf_type_id},{call,put}){
      undefinedChecker = [];
      const analyzeRes = yield call(service.projKpiFileAnalyze,{"xlsfilepath":path});
      if (analyzeRes && analyzeRes.length) {
        let rowCount = analyzeRes.length;
        let proj_match = 0;
        for(let i = 0; i < rowCount; i++){
          /*if(analyzeRes[i].checker_name == config.EVAL_TIMESHEET_VALUE || analyzeRes[i].checker_name == config.EVAL_TFS_VALUE || analyzeRes[i].checker_name == config.EVAL_PROJ_DEPT_VALUE || analyzeRes[i].checker_name == config.EVAL_PROJ_DEPT_VALUE_OLD){
            analyzeRes[i].checker_id = config.EVAL_FIXED_KPI_CHECKER_ID;
          }*/if(analyzeRes[i].kpi_type && (analyzeRes[i].kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE ||analyzeRes[i].kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE)){
            analyzeRes[i].checker_id = config.EVAL_FIXED_KPI_CHECKER_ID;
          }else if(perf_type_id == '300'){
            //项目绩效员工
            /*for(var m = 0; m < $scope.kpiColl.length; m++) {
              if()
              analyzeRes[i].checker_id = kpiColl[m].mgr_id;
              analyzeRes[i].checker_name = kpiColl[m].mgr_name;
            }*/
          }else{
            //项目经理
            yield put({type:'setCheckerId',item:analyzeRes[i],checkerList});
          }
          if(analyzeRes[i].target_score != ''){
            analyzeRes[i].target_score = parseFloat(analyzeRes[i].target_score).toFixed(2);
          }else{
            analyzeRes[i].target_score = undefined;
          }

          analyzeRes[i].kpi_name = analyzeRes[i].kpi_content;
          analyzeRes[i].kpi_content = analyzeRes[i].kpi_target;
          for(let j = 0; j < kpiColl.length; j++){
            if(analyzeRes[i].proj_name.indexOf(kpiColl[j].proj_name) != -1){
              proj_match++;
            }
          }
        }
        if(proj_match){
          for(let i = 0; i < kpiColl.length; i++){
            if(kpiColl[i].empKpis && kpiColl[i].empKpis.length){
              kpiColl[i].empKpis = kpiColl[i].empKpis.filter(j=>(j.isEdit == 'false'))
            }else{
              kpiColl[i].empKpis = []
            }
            let kpis = analyzeRes.filter(j=>(j.kpi_type.indexOf(config.EVAL_EMP_FIXED_KPI_TYPE) == -1 && j.kpi_type.indexOf(config.EVAL_MGR_FIXED_KPI_TYPE) == -1 ));
            yield put({type:'listKpi',proj:kpiColl[i],kpis});
          }
        }else{
          message.warning("文件中项目名称与当前页面项目名称不匹配，请修改文件后重新导入！",8)
        }

      }else{
        message.error("文件解析失败!")
    }
  },

    /**
     * 功能：综合绩效文件解析
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param path 文件路径
     * @param kpiColl 指标集
     * @param checkerList 审核人列表
     */
    *compKpiFileAnalyze({path,kpiColl,checkerList},{call,put}){
      undefinedChecker = [];
      const analyzeRes = yield call(service.compKpiFileAnalyze,{"xlsfilepath":path});
      if (analyzeRes && analyzeRes.length) {
        let rowCount = analyzeRes.length;
        for(let i = 0; i < rowCount; i++){
          yield put({type:'setCheckerId',item:analyzeRes[i],checkerList});

          if(analyzeRes[i].target_score != ''){
            analyzeRes[i].target_score = parseFloat(analyzeRes[i].target_score).toFixed(2);
          }else{
            analyzeRes[i].target_score = undefined;
          }
          analyzeRes[i].kpi_name = analyzeRes[i].kpi_content;
          analyzeRes[i].kpi_content = analyzeRes[i].kpi_target;
        }
        for(let i = 0; i < kpiColl.length; i++){
          kpiColl[i].empKpis = [];
          yield put({type:'listKpi',proj:kpiColl[i],kpis:analyzeRes});
        }

        }else{
          message.error("文件解析失败!")
      }
    },

    /**
     * 功能：设置审核人ID
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param item 指标项
     * @param checkerList 审核人列表
     */
    *setCheckerId({item,checkerList},{call,put}){
      if(item.checker_name != undefined && item.checker_name != null && item.checker_name.trim() != ''){
        let flag = 0;
        let len = checkerList.length;
        for(let i = 0;i < len;i++){
          if(item.checker_name.replace(/[\r\n]/g,"") == checkerList[i].username){
            item.checker_id = checkerList[i].userid;
            item.checker_name = checkerList[i].username;
            flag = 1;
            i = len;
          }
        }
        if(flag == 0){
          if(undefinedChecker && (undefinedChecker.length==0 || undefinedChecker.indexOf(item.checker_name) == -1)){
            message.warning("未匹配到审核人"+item.checker_name+",请手动选择！",5);
            undefinedChecker.push(item.checker_name)
          }
          item.checker_id = '';
          item.checker_name = '';
        }
      }

    },

    /**
     * 功能：设置审核人ID
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param item 指标项
     * @param checkerList 审核人列表
     */
      *additionalProjList({item,checkerList},{call,put}){
      if(item.checker_name != undefined && item.checker_name != null && item.checker_name.trim() != ''){
        let flag = 0;
        let len = checkerList.length;
        for(let i = 0;i < len;i++){
          if(item.checker_name.replace(/[\r\n]/g,"") == checkerList[i].username){
            item.checker_id = checkerList[i].userid;
            item.checker_name = checkerList[i].username;
            flag = 1;
            i = len;
          }
        }
        if(flag == 0){
          if(undefinedChecker && (undefinedChecker.length==0 || undefinedChecker.indexOf(item.checker_name) == -1)){
            message.warning("未匹配到审核人"+item.checker_name+",请手动选择！",5);
            undefinedChecker.push(item.checker_name)
          }
          item.checker_id = '';
          item.checker_name = '';
        }
      }

    },
    /**
     * 功能：上季度指标查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     * @param staff_id 员工编号
     */
      *lastKpiSearch({proj,year,season,staff_id,perf_emp_type},{call,put}){
      let condition = {"proj_id":proj.proj_id,"staff_id":staff_id,
        "year":year,"season":season,"score_type":perf_emp_type=="0"?"1":"0"};
      if(perf_emp_type == '0'){
        condition["emp_type"] = proj.emp_type;
      }
      const kpiRes = yield call(service.empKpiSearch,
        {transjsonarray :JSON.stringify({"condition":condition,"sequence":[{"create_time":"0"}]})});
      if (kpiRes.RetCode === '1' && kpiRes.DataRows) {
        if(kpiRes.RowCount == 0){
          let p = proj.proj_name?proj.proj_name:'';
          let perf_type = perf_emp_type == "0" ? config.EVAL_PROJ_PERF : config.EVAL_COMP_PERF;
          message.warning(splitEnter(p + "无上季度"+ proj.post + "职位的<br/>" + perf_type + "指标，请导入或录入指标！"),6);
        }else {
          //proj.empKpis = [];
          if(proj.empKpis && proj.empKpis.length){
            proj.empKpis = proj.empKpis.filter(j=>(j.isEdit == 'false'))
          }else{
            proj.empKpis = []
          }
          let kpis = kpiRes.DataRows.filter(j=>(j.kpi_type != config.EVAL_EMP_FIXED_KPI_TYPE && j.kpi_type != config.EVAL_MGR_FIXED_KPI_TYPE ));
          for(let i = 0; i < kpis.length;i++){
            kpis[i].finish = undefined;
            kpis[i].state = undefined;
          }
          yield put({type: 'listKpi', proj, kpis});
        }
      }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname, query}) => {

        if (pathname === '/humanApp/employer/manage') {
          dispatch({type: 'empScoreInit', query});

        } else if (pathname === '/humanApp/employer/manage/kpiAdd') {
          //dispatch({type: 'empInfoSearch',query});
          dispatch({type: 'empCheckerSearch', query});
        } else if (pathname === '/humanApp/employer/manage/kpiModify') {
          //dispatch({type: 'empInfoSearch',query});
          dispatch({type: 'empCheckerSearch', query});
        } else if (pathname === '/humanApp/employer/manage/kpiAdditional') {
          // dispatch({type: 'empInfoSearch', query});
          // 核心岗员工需走checkersearch
          dispatch({type: 'empCheckerSearch', query});
        }
      });

    },
  },
};
