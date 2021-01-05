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

// const year = new Date().getFullYear().toString();
// const season = Math.floor((new Date().getMonth() + 1 + 2) / 3).toString();

let undefinedChecker = [];
export default {
  namespace : 'manage',
  state : {
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
    //员工类别emp_type    0：进入项目组    1：不进入项目组    2：嵌入项目组
    noKpiProjList:[],
    projListOrigin: [],
    projectId:'',
    delateProjIds:[],   // 需要删除的项目id
    year:"",
    season:"",
    begin_time:"",
    end_time:"",
    kpi_state:"",
    hasproj:0 ,//有没有退出团队（项目），项目数目是多少
    BP_type:[]//BP是核心岗考核的一种但是没有项目
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
    saveEmpInfo(state, {perf_type_id,perf_emp_type,emp_type,flag,post,emp_info,year,season}){
      return {
        ...state,
        //isSubmit,
        perf_type_id,
        perf_emp_type,
        emp_type,
        flag,
        post,
        emp_info,
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

    // 保存包含员工的全部项目
    savePrProjList(state, {projListOrigin,hasproj}){
      return {
        ...state,
        projListOrigin,
        hasproj
      }
    },

    // 保存选择的项目
    saveprojectId(state, {projectId,hasproj}){
      return {
        ...state,
        projectId,
        hasproj
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
    saveNoKpiProjList(state, {noKpiProjList}){
      return {
        ...state,
        noKpiProjList
      }
    },

    save(state, {payload}){
      return {
        ...state,
        ...payload,
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

     *backTime({query},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'save',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
            begin_time:timeList.DataRows[0].begin_time,
            end_time:timeList.DataRows[0].end_time,
            kpi_state:query?query.flag:""//是否已提交的标志
          }
        })
        yield put({type: 'empScoreInit'})
      }
     },

    *empScoreInit({}, {call, put,select}) {
      yield put({
        type: 'saveCardRes',
        list:[],
        display: false
      });
      let {season,year}=yield select(state=>state.manage)
      const scoreRes = yield call(service.empScoreNotSubmitSearch, // 查询员工历史考核结果
        {
          arg_cur_year:year,
          arg_cur_season:season,
          arg_staff_id:Cookie.get('userid')
        });
      if(scoreRes.RetCode==='1'){
        const kpiAddedRes = yield call(service.judgeKpiAdded, // 查询员工是否可以新增指标  是否有新的季度
          {
            year:year,
            season:season,
            //season:2,
            staff_id:Cookie.get('userid'),
            time:moment().format('YYYY-MM-DD HH:mm:ss')
          });

        if(kpiAddedRes.RetCode==='1'){
          yield put({
            type: 'saveCardRes',
            list: [...scoreRes.DataRows],  // 员工的历史考核结果
            display: true             // 疑似控制 添加加号
          });
        }else{
          yield put({
            type: 'saveRes',
            list: [...scoreRes.DataRows],
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
    *empCheckerSearch({query}, {call, put}) {   // kpiadd 页面第一个操作
      let noKpiProjList = [];
      yield put({type: 'saveNoKpiProjList', noKpiProjList});   // noKpiProjList置空
      const empLeaderRes = yield call(service.empLeaderCheckerSearch,
        {
          arg_roleid:config.EVAL_MIDDLE_LEADER_POST_ID,  // 审核人虚拟职位id
          arg_flag:'1',
          arg_deptname:Cookie.get('dept_name')
        });
      if(empLeaderRes.RetCode==='1' && empLeaderRes.DataRows && empLeaderRes.DataRows.length != 0){ // 查出来29个审核人
        yield put({
          type: 'saveEmpLeader',
          checkerList: empLeaderRes.DataRows
        });
        yield put({type: 'empInfoSearch',query});  // 查员工信息
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
    *empInfoSearch({query},{call, put,select}) {
      let noKpiProjList = [];
      let {season,year}=yield select(state=>state.manage)

      yield put({type: 'saveNoKpiProjList', noKpiProjList});
      query.year = query.year ? query.year : year;
      query.season = query.season ? query.season : season;
      //yield put({type: 'empCheckerSearch'});
      const empInfoRes = yield call(service.empInfoSearch,  // 查询员工类别信息 empclassquery  返回的是数组
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
            for(let i = 0; i < empInfoRes.DataRows.length; i++){   // 登录人的ou和返回的多个员工信息匹配，找到对应ou的那一个
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
             }
            else if(item.flag == 1&&(query.flag == "0"||query.flag == "1")){ //projList来自于empkpiquery,haspro来自于projOrign的length，指标填报的时候有提示，填写完成情况的时候无提示
              message.warning(splitEnter(item.error_info),10);
            }
            else if(item.flag == 0||(window.location.hash.split('?')[1].split('&')[0].split('=')[1]=='2')){
              let perf_type_id = item.perf_type_id;    // 员工指标类型
              let perf_emp_type = item.perf_emp_type;  // 员工绩效类型
              let emp_type = item.emp_post_type;       // 员工职务类型
              item.emp_type = item.emp_post_type;
              if(query.flag == '0'){
                //新增指标
                if(perf_type_id == "300"){  // 300 项目绩效员工  200：综合绩效员工
                  yield put({type: 'empProjSearch',perf_type_id,emp_info:item,tag:0,...query})  // 查项目
                }else if(perf_type_id == "400" || perf_type_id == "500"){  // 项目绩效-总院核心岗 || 项目绩效-分院核心岗
                  // 项目经理只填一个项目指标
                  // if(emp_type == '1'){
                  //   yield put({type:'pmProjSearch',perf_type_id,emp_info:item,...query})
                  // }else{
                  //   yield put({type: 'empProjSearch',perf_type_id,emp_info:item,tag:1,...query})
                  // }
                  // 所以核心岗可填2个项目指标
                  yield put({type: 'empProjSearch',perf_type_id,emp_info:item,tag:1,...query}) // 查项目，并且查项目下边的指标类型
                }else{ // 200//800 
                  let proj = [{"perf_type_id":perf_type_id,"emp_type":item.emp_type,"perf_name":config.EVAL_COMP_EVAL,"ou":item.ou.split('-')[1],"dept_name":item.dept_name,"post":item.post}];
                  if(item.emp_post_type=='7'){ //标志着BP
                    //debugger
                    let proj = [{"perf_type_id":perf_type_id,"emp_type":item.emp_type,"perf_name":config.EVAL_BP_EVAL_KPI,"ou":item.ou.split('-')[1],"dept_name":item.dept_name,"post":item.post}];
                   }  
                  yield put({type:'saveProjList',projList:proj})                  // 综合绩效相当于只有一个项目
                  yield put({type:'empPerfKpiTypeSearch',proj:proj[0],...query})  // 查指标类型
                }
              }
              else if(query.flag == "1" || query.flag == "2"){
                // console.log('查询未通过指标')
                //修改指标 或者填写完成情况
                yield put({type:'unPassKpiScoreSearch',...query,perf_type_id,emp_info:item})

                // // 全部项目（项目） 将全部项目列表存储在 projListOrigin
                const empPrProjRes = yield call(service.empProjSearch,{arg_staff_id:Cookie.get('userid'),}); //  查全部项目
                yield put({type:'savePrProjList',projListOrigin: empPrProjRes.DataRows,hasproj:empPrProjRes.DataRows?empPrProjRes.DataRows.length:0  })
              }

              yield put({
                type: 'saveEmpInfo',
                perf_type_id,
                perf_emp_type,
                emp_type,
                post:item.post,
                emp_info: item,
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


      // 如果没有业务指标 查全部项目，后续如果有业务指标的项目，查的是业务指标项目（人力）, 和 全部项目（项目）
      // 业务指标项目（人力）
      //走的是 empkpiproj 这个服务
      const empHrProjRes = yield call(service.empHrProjSearch,{arg_staff_id:Cookie.get('userid'),arg_year:year, arg_season:season}); //  查人力指标项目

      // // 全部项目（项目） 将全部项目列表存储在 projListOrigin
      // 走的是 tptptselproc 这个服务
      const empPrProjRes = yield call(service.empProjSearch,{arg_staff_id:Cookie.get('userid'),}); //  查全部项目
      yield put({type:'savePrProjList',projListOrigin: empPrProjRes.DataRows,hasproj:empPrProjRes.DataRows?empPrProjRes.DataRows.length:0 })

      // 有指标项目，用有指标的项目，没有指标项目用 全部项目
      let empProjRes = {}
      if(empHrProjRes.DataRows && empHrProjRes.DataRows.length !== 0){
        empProjRes = empHrProjRes
      } else {
        empProjRes = empPrProjRes
      }

      // const empProjRes = yield call(service.empProjSearch,{arg_staff_id:Cookie.get('userid')}); //  查项目
      if (empProjRes.RetCode === '1') {
        if(empProjRes.DataRows && empProjRes.DataRows.length){

          let projList = [];
          for(let i = 0; i < empProjRes.DataRows.length;i++){  // 查询项目列表，并在项目信息中添加了员工考核类型信息
            let item = empProjRes.DataRows[i];
            if(tag != 0){  // 项目绩效的员工 tag===0
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
            yield put({type: 'empPerfKpiTypeSearch',proj:item,year,season,flag:0});  // 对每一个项目查询kpi
          }
          yield put({type:'saveProjList',projList});  // 查到项目列表projList，每一个item中有一个allTypes 和 types, types是一个数组，里边有两个类型
        }
        else if(emp_info.emp_post_type=='7'){//判断为bp时候，就直接退出，因为BP没有项目
          return
        }
        else {
          message.warning(splitEnter("您的绩效类型为业务绩效，但未查询到您所参与的项目信息，<br/>请联系项目经理在团队管理中将您纳入项目！"),10);
        }
      }
    },


    // 查询员工所在的全部项目
    *empPrProjSearch({},{call,put}){
      // 全部项目（项目） 将全部项目列表存储在 projListOrigin
      const empPrProjRes = yield call(service.empProjSearch,{arg_staff_id:Cookie.get('userid'),}); //  查全部项目

      // 默认项目id
      if(empPrProjRes.DataRows && empPrProjRes.DataRows[0]){
        yield put({
          type:'saveprojectId',
          projectId: (empPrProjRes.DataRows[0]||{}).proj_id || '',
          hasproj:empPrProjRes.DataRows.length
        })
      }

      yield put({type:'savePrProjList',projListOrigin: empPrProjRes.DataRows,hasproj:empPrProjRes.DataRows?empPrProjRes.DataRows.length:0 })
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
     * @param flag 操作类型：新增/修改/填写完成情况  0/1/2
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
     * 300：量化KPI指标 岗位职责KPI指标 GS任务  200：业务考核 固定考核
     */
    *empPerfKpiTypeSearch({proj,year,season,flag},{call,put}){
      const kpiTypeRes = yield call(service.empWordbookSearch, // 查到两类指标 固定 和 业务, 综合绩效指标也是这个
        {transjsonarray:JSON.stringify(
          {"condition":{"WORDBOOK_TYPE_ID":proj.perf_type_id},
          // {"condition":{"WORDBOOK_TYPE_ID":300},
            "sequence":[{"is_order":'0'}]
          })});

      if (kpiTypeRes.RetCode === '1' && kpiTypeRes.DataRows && kpiTypeRes.DataRows.length) {
        proj.allTypes = [];
        proj.types = [];
        yield put({type:'geneKpiType',list:proj.allTypes, obj:kpiTypeRes.DataRows});  // 将类型处理一下放到 proj 中
        yield put({type:'geneKpiType',list:proj.types, obj:kpiTypeRes.DataRows});
        yield put({type: 'empFixedKpiSearch',proj,year,season,flag}); // 查询固定指标类型 proj 是某一个项目
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
    *empFixedKpiSearch({proj,year,season,flag},{call,put,select}){
      const fixedKpiRes = yield call(service.empFixedKpiSearch,
        {transjsonarray:JSON.stringify({"condition":{"type_id":proj.perf_type_id},
          "sequence":[{"is_order":'0'}]})  });
      let {projListOrigin} =yield select(state=>state.manage)//新修改，2020 05-05,在tpt服务里取审核人 
      let orgList={}
       projListOrigin.forEach((item)=>{
       if(item.proj_id==proj.proj_id){
        orgList=item
       }
       })
      if (fixedKpiRes.RetCode === '1' && fixedKpiRes.DataRows) {
        fixedKpiRes.DataRows.map((i) => {
          proj.types=proj.types.filter((j)=>j.WORDBOOK_NAME!=i.kpi_type) // 可以添加的类型
          proj.kpi = {};
          proj.kpi.kpi_type = proj.types[0].WORDBOOK_NAME
        })
        proj.empKpis = []
        if(flag == "0"){

          for(let m = 0; m < fixedKpiRes.DataRows.length; m++){
            let j = fixedKpiRes.DataRows[m];
          //固定考核指标考核人在这里的kpi里-原代码如下（已注）
          //let kpi = {"proj_id":proj.proj_id,"kpi_type":j.kpi_type,"kpi_name":j.kpi_name,"kpi_content":j.kpi_content,"formula":j.formula,"target_score":j.target,"checker_id":j.checker_id ? j.checker_id :proj.mgr_id,"checker_name":j.checker_name ? j.checker_name : proj.mgr_name,"remark":j.remark,"isEdit":'false'};
            let kpi ={ "proj_id":proj.proj_id,"kpi_type":j.kpi_type,"kpi_name":j.kpi_name,"kpi_content":j.kpi_content,"formula":j.formula,"target_score":j.target,"checker_id":j.checker_id?j.checker_id :proj.mgr_id?proj.mgr_id:orgList.mgr_id,"checker_name":j.checker_name ? j.checker_name : proj.mgr_name?proj.mgr_name:orgList.mgr_name,"remark":j.remark,"isEdit":'false'};
           proj.empKpis.push(kpi)
          }

          yield put({type:'savedKpiSearch',proj,year,season})    // 再查完固定指标类型之后 查询已保存的业务指标kpi项

        }else if(flag == "1" || flag == "2"){
          yield put({type:'unPassKpiSearch',proj,year,season}) // 修改时 查询历史考核指标
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
      if(item.kpi_type && (item.kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE ||item.kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE||item.kpi_type == config.EVAL_CORE_BP_KPI)){
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
    *listKpi({proj,kpis},{call,put,select}){
     // debugger
      let {hasproj,projList} =yield select(state=>state.manage)
      for(let m = 0; kpis && m < kpis.length; m++){

        let i = kpis[m];
        let flag = 0;
         //flag为2就是填写完成情况,tpt查到的项目数和之前保存过的项目的数目不同的话就是退出团队了
        if(hasproj<=2&&window.location.hash.split('?')[1].split('&')[0].split('=')[1]=='2'){ //路径为2是确定到了完成情况未填报的状态，flag为3时候是指标补录状态，
          //但是这时候指标补录是指标提交不是完成情况未填报
          //tpt和emp的条数不匹配的话一般就是已经退出团队了，除了指标补录的情况（tpt是2，emp是1）
          flag = 1;//退出团队后要填写完成情况，这里就强制给转成1了
        } 
         
        for(let n = 0; proj.allTypes && n < proj.allTypes.length;n++){ 
           if(i.kpi_type && i.kpi_type.indexOf(proj.allTypes[n].kpi_type) != -1){ //指标的类型是否和项目里所有指标的类型相匹配
           flag = 1;
           i.kpi_type = proj.allTypes[n].kpi_type;
           break;
          }
          if(i.kpi_type.indexOf(config.EVAL_PROJ_EVAL_KPI_OLD) != -1){  //项目考核指标
           flag = 1;
            i.kpi_type = config.EVAL_PROJ_EVAL_KPI;
            break;
          }
        }
        if(flag){
          i['isEdit'] = 'true';
          //控制固定考核指标的地方，固定考核指标||项目考核得分||bp的核心岗位一级考核指标（座位固定指标）
          if(i.kpi_type && (i.kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE ||i.kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE||i.kpi_type==config.EVAL_CORE_BP_KPI)){
  
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

            if(proj.emp_type=="7"&&window.location.hash.split('?')[1].split('&')[0].split('=')[1]=='0'){//标志着bp,就把核心岗位一级考核指标多余的指标给去了，这个是固定考核指标，0 提交状态 1 指标撤销
             let res= proj.empKpis.filter((item )=>{
             return  (item.kpi_type==config.EVAL_CORE_BP_KPI&&(item.id==undefined))||(item.kpi_type!=config.EVAL_CORE_BP_KPI)
            })
            //console.log(res)
            proj.empKpis=res
            }
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
        message.warning(kpiSaveRes.RetVal)
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
        yield put({type:"save",payload:{kpi_state:"1"}})
        yield put(routerRedux.push('humanApp/employer/manage'));
      }else{
        message.error("提交失败！")
      }
    },

    /**
     * 功能：指标完成情况提交
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param params 待提交完成情况信息
     * @param tag 操作类型，0：保存  1：提交
     */
    *updateKpi({params,tag},{call,put}){
      const kpiUpdateRes = yield call(service.empKpiUpdate,params);
      if (kpiUpdateRes.RetCode === '1') {
        if(tag == '0'){
          message.success("保存成功!");
        }else{
          message.success("提交成功!")
        }
      }else{
        if(tag == '0'){
          message.error("保存失败!");
        }else{
          message.error("提交失败!")
        }
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
    *unPassKpiScoreSearch({year,season,staff_id,flag,perf_type_id,emp_info},{call,put}){

      const kpiRes = yield call(service.empScoreSearch,
        {transjsonarray :JSON.stringify({"condition":{"staff_id":staff_id,
        "year":year,"season":season,"tag":'0'},"sequence":[{"create_time":"0"}]})});

      if (kpiRes.RetCode === '1' && kpiRes.DataRows) {
          let projList = [];
          for(let i = 0; i < kpiRes.DataRows.length;i++) {
            let item = kpiRes.DataRows[i];
            item.perf_type_id = perf_type_id;
            item.emp_type = emp_info.emp_type;
            item.ou = emp_info.ou.split('-')[1];
            item.dept_name = emp_info.dept_name;
            item.perf_name = item.proj_name + '考核指标';
            if(item.proj_id){
              item.perf_name = item.proj_name + '考核指标';
            }else{
              item.perf_name = config.EVAL_COMP_EVAL_KPI;
            }
            projList.push(item);
            yield put({type: 'empPerfKpiTypeSearch',proj:item,year,season,flag}); // 查指标的类型
          }

          yield put({type:'saveProjList',projList});
          //为指标补录新增代码--只有业务绩效的员工可以补录
          // if(flag == '2' && perf_type_id == '300' && kpiRes.DataRows.length < 2 && kpiRes.DataRows[0].score_type == '1'){
          //为指标补录新增代码--所有业务绩效可以补录
          if(flag == '2' && kpiRes.DataRows.length < 2 && kpiRes.DataRows[0].score_type == '1'){
            //查询有效工时的项目
            yield put({type:'hasTimeProjSearch',hasKpiProjList:kpiRes.DataRows,year,season,staff_id})
          }
        //为指标补录新增代码
        }

    },


    // 删除某个项目 i 的指标
    *deleteProjKpi({projList, projItem},{call,put,select}){
      const { projListOrigin,flag, delateProjIds } = yield select(state=> state.manage)
      // 项目不在项目列表内才能删除
      if (!((projListOrigin || []).some(item2 => item2.proj_id === projItem.proj_id))){
        // 将项目列表中的 i 项目过滤掉
        let projNew = projList.filter(item=> item.proj_id !== projItem.proj_id)
        yield put({type:'saveProjList',projList:projNew})
      }else{
        message.info('您在该项目团队内，不能删除该项目指标！')
      }
      // 如果是退回需改指标，删除需要记录在 delateProjIds[]
      if(flag === '1'){
        if(delateProjIds.findIndex(item=>item ===projItem.proj_id) === -1){
          delateProjIds.push(projItem.proj_id)
        }

        yield put({
          type: 'save',
          payload:{
            delateProjIds,
          }
        })
      }
    },


   //判断用户所在团队的项目和当前的项目是否匹配，如果不匹配就提示退出团队
     *userInGroup({},{put,select}){
     const { projListOrigin,projList } = yield select(state=> state.manage)
     let existProj=[]
    (projListOrigin || []).forEach((item,index)=>{
      projList.forEach(projItem =>{
        if(item.proj_id===projItem.proj_id){
          existProj.push(projItem)
        }
        
      
      })
    })


     let judge=res.every(item=>item==true)
     judge==true?"":message.info('您已不在该团队，可点击右上角删除该团队的指标')
     //是否有一个人在2个团队的情况？团队和项目的关系是一一对应的吗

     // yield put({type:'saveProjList',projList:projNew})
    
    },

    // 添加项目
    * addProject({projList, projectId},{call,put,select}){

      const { projListOrigin,perf_type_id, emp_info,year,season } = yield select(state=>state.manage)

      if(projList.filter(item=>item.proj_id === projectId).length !== 0){
        message.info('请勿重复添加项目！')
      }else {
        // 在 projListOrigin 中找到这个项目原始数据，然后添加一些参数，调用查询指标类型 后边一样
        let item = projListOrigin.filter(item=> item.proj_id === projectId)[0]

        let tag = perf_type_id === '300' ? '0' : '1'
        if(tag !== '0'){  // 项目绩效的员工 tag===0
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
        yield put({type: 'empPerfKpiTypeSearch',proj:item,year,season,flag: 0});  // 对添加的项目查询kpi

        yield put({type:'saveProjList',projList});
        yield put({type:'saveprojectId',projectId: ''})
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
    /**
     * 功能：已填工时项目查询
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param proj 项目信息
     * @param year 考核年度
     * @param season 考核季度
     * @param staff_id 员工编号
     */
    *hasTimeProjSearch({hasKpiProjList,year,season,staff_id},{call,put}){
      const projRes = yield call(service.hasTimeProjSearch,
        {
          arg_year:year,
          arg_season:season,
          arg_staff_id:staff_id,
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
            if(has == 0){   // 有工时，无kpi
              noKpiProjList.push(projRes.DataRows[i]);
            }
          }
        yield put({type: 'saveNoKpiProjList', noKpiProjList});


        }
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
          //除去bp
          if(analyzeRes[i].kpi_type != config.EVAL_CORE_BP_KPI&&analyzeRes[i].kpi_type !=config.EVAL_CORE_BP_KPI2&&analyzeRes[i].kpi_type != config.EVAL_CORE_BP_KPI3){
          yield put({type:'setCheckerId',item:analyzeRes[i],checkerList});
          }
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
              message.warning("未匹配到审核人"+item.checker_name+",请手动=选择！",5);
              undefinedChecker.push(item.checker_name)
            
          }
          item.checker_id = '';
          item.checker_name = '';
        }
      }

    },
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname, query}) => {
    
        if (pathname === '/humanApp/employer/manage') {
          dispatch({type: 'backTime'});
        } else if (pathname === '/humanApp/employer/manage/kpiAdd') {
          dispatch({type: 'backTime',query});
          dispatch({type: 'empCheckerSearch', query});
        } else if (pathname === '/humanApp/employer/manage/kpiModify') {
          dispatch({type: 'backTime'});
          dispatch({type: 'empCheckerSearch', query});
        } else if (pathname === '/humanApp/employer/manage/kpiFinish') {
          dispatch({type: 'backTime'});
          dispatch({type: 'empInfoSearch', query});
        }
      });

    },
  },
};
