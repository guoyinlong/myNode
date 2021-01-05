/*
*人员查询
*Author: 任金龙
*Date: 2017年11月1日
*Email: renjl33@chinaunicom.cn
*/
import * as projService from '../../../services/project/projService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { OU_NAME_CN, OU_HQ_NAME_CN, OU_HAERBIN_NAME_CN, OU_JINAN_NAME_CN, OU_XIAN_NAME_CN, OU_GUANGZHOU_NAME_CN } from '../../../utils/config';

const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'memberQuery',
  state: {
    tableDataList: [],
    ouList: [],
    deptList: [],
    deptProjList: [],
    ouMemberCountList: [],
    projMembersCountList: [],
    generalInstituteList: [],
    branchInstituteHAList: [],
    brandInstituteJNList: [],
    postData: {},
    currentPage: null,
    total: null,
    memberList: [],
    deptMemberList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveInit(state, { deptList: [], deptProjList: [] }) {
      return { ...state, deptList: [], deptProjList: [] }
    },
    saveDept(state, { deptList: DataRows }) {
      return { ...state, deptList: DataRows };
    },
    saveOU(state, { ouList: DataRows }) {
      return { ...state, ouList: DataRows };
    },
    saveDeptProj(state, { deptProjList: DataRows }) {
      return { ...state, deptProjList: DataRows };
    }
  },
  effects: {
    /**
     * 默认的人员查询
     * @param call
     * @param put
     */
    *memberInfoSearchDefault({ }, { call, put }) {
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const { DataRows: getOuData } = yield call(projService.getOuList, postData_getOU);

      yield put({
        type: 'saveOU',
        ouList: getOuData
      });

      //从服务获取所有的部门列表
      let postData_getDept = {};
      postData_getDept["arg_tenantid"] = auth_tenantid;
      postData_getDept["arg_ou"] = "";
      const { DataRows: getDeptData } = yield call(projService.ouDeptQueryService, postData_getDept);

      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        pureDeptData.push(getDeptData[i].deptname);
      }

      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });

      //从服务获取所有项目列表
      let postData_getProj = {};
      postData_getProj["arg_tenantid"] = auth_tenantid;
      postData_getProj["arg_ou"] = "";
      postData_getProj["arg_dept_name"] = "";
      const { DataRows: getProjData } = yield call(projService.deptProjQueryService, postData_getProj);

      yield put({
        type: 'saveDeptProj',
        deptProjList: getProjData
      });

      //获取1-9项目人员信息
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_ou"] = "";
      postData["arg_proj_id"] = "";
      postData["arg_dept_name"] = "";     //默认值为0
      postData["arg_start"] = 1;   //初始化当前页码为1
      postData["arg_page_num"] = 10  //初始化页面显示条数为9
      let arg_page_current = 1;
      const basicInfoData = yield call(projService.projMembersInfoQueryService, postData);
      //console.log(basicInfoData)
      if (basicInfoData.DataRows == '') {
        message.error("获取数据失败");
      } else {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i].dept_name = basicInfoData.DataRows[i].dept_name.split("-")[1]
          if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HQ_NAME_CN) {
            basicInfoData.DataRows[i].ou = '联通软件研究院本部';
          } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HAERBIN_NAME_CN) {
            basicInfoData.DataRows[i].ou = '哈尔滨软件研究院';
          } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_JINAN_NAME_CN) {
            basicInfoData.DataRows[i].ou = '济南软件研究院';
          } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_XIAN_NAME_CN) {
            basicInfoData.DataRows[i].ou = '西安软件研究院';
          } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_GUANGZHOU_NAME_CN) {
            basicInfoData.DataRows[i].ou = '广州软件研究院';
          }
        }
      }
      if (basicInfoData.RetCode === '1') {
        //处理角色显示
        for(let i = 0; i < basicInfoData.DataRows.length ; i++ ){
          if(basicInfoData.DataRows[i].role_name == "null" ){
            basicInfoData.DataRows[i].role_name = "无"
          }else{
            basicInfoData.DataRows[i].role_name = basicInfoData.DataRows[i].role_name
          }
        }
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
            postData: postData,
            total: basicInfoData.RowCount,
            currentPage: arg_page_current
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },//memberInfoSearchDefault

    /**
     * 初始化数据
     * @param put
     */
    *init({ }, { put }) {
      yield put({
        type: 'saveInit',
        deptList: [],
        deptProjList: []
      });
    },

    /**
     * 初始化数据
     * @param put
     */
    *projInit({ }, { put }) {
      yield put({
        type: 'saveProjInit',
        deptProjList: []
      });
    },

    /**
     *当组织发生改变时，联动获取部门的数据以及该组织的所有项目数据
     * @param arg_param
     * @param call
     * @param put
     */
    *getDept({ arg_param }, { call, put }) {
      //从服务获取OU下的部门列表
      let postData_getDept = {};
      postData_getDept["arg_tenantid"] = auth_tenantid;
      postData_getDept["arg_ou"] = arg_param;

      const { DataRows: getDeptData } = yield call(projService.ouDeptQueryService, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        pureDeptData.push(getDeptData[i].deptname);
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });

      //从服务获取所有项目列表
      let postData_getProj = {};
      postData_getProj["arg_tenantid"] = auth_tenantid;
      postData_getProj["arg_ou"] = arg_param;
      postData_getProj["arg_dept_name"] = "";

      const { DataRows: getProjData } = yield call(projService.deptProjQueryService, postData_getProj);

      yield put({
        type: 'saveDeptProj',
        deptProjList: getProjData
      });

      //获取所有项目人员信息
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_ou"] = arg_param;
      postData["arg_proj_id"] = "";
      postData["arg_dept_name"] = "";     //默认值为0
      postData["arg_start"] = 1;   //初始化当前页码为1
      postData["arg_page_num"] = 10;  //初始化页面显示条数为9
      let arg_page_current = 1;
      const basicInfoData = yield call(projService.projMembersInfoQueryService, postData);
      for (let i = 0; i < basicInfoData.DataRows.length; i++) {
        basicInfoData.DataRows[i].dept_name = basicInfoData.DataRows[i].dept_name.split("-")[1]
        if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HQ_NAME_CN) {
          basicInfoData.DataRows[i].ou = '联通软件研究院本部';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HAERBIN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '哈尔滨软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_JINAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '济南软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_XIAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '西安软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_GUANGZHOU_NAME_CN) {
          basicInfoData.DataRows[i].ou = '广州软件研究院';
        }
      }
      if (basicInfoData.RetCode === '1') {
        //处理角色显示
        for(let i = 0; i < basicInfoData.DataRows.length ; i++ ){
          if(basicInfoData.DataRows[i].role_name === "null" ){
            basicInfoData.DataRows[i].role_name = "无"
          }else{
            basicInfoData.DataRows[i].role_name = basicInfoData.DataRows[i].role_name
          }
        }
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
            postData: postData,
            total: basicInfoData.RowCount,
            currentPage: arg_page_current
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },

    /**
     * 当部门发生改变后，联动获取该部门下的所有的项目
     * @param arg_param
     * @param call
     * @param put
     */
    *getDeptProj({ arg_param }, { call, put }) {
      //从服务获取项目列表

      let postData_getDeptProj = {};
      postData_getDeptProj["arg_tenantid"] = auth_tenantid;
      postData_getDeptProj["arg_dept_name"] = arg_param.deptName;
      postData_getDeptProj["arg_ou"] = arg_param.ou;

      const { DataRows: getPostData } = yield call(projService.deptProjQueryService, postData_getDeptProj);
      yield put({
        type: 'saveDeptProj',
        deptProjList: getPostData
      });

      //获取所有项目人员信息
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_ou"] = arg_param.ou;
      postData["arg_proj_id"] = "";
      postData["arg_dept_name"] = arg_param.deptName;
      postData["arg_start"] = 1; //默认值为0
      postData["arg_page_num"] = 10;  //初始化页面显示条数为9
      let arg_page_current = 1; //初始化当前页码为1

      const basicInfoData = yield call(projService.projMembersInfoQueryService, postData);
      for (let i = 0; i < basicInfoData.DataRows.length; i++) {
        basicInfoData.DataRows[i].dept_name = basicInfoData.DataRows[i].dept_name.split("-")[1]
        if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HQ_NAME_CN) {
          basicInfoData.DataRows[i].ou = '联通软件研究院本部';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HAERBIN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '哈尔滨软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_JINAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '济南软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_XIAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '西安软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_GUANGZHOU_NAME_CN) {
          basicInfoData.DataRows[i].ou = '广州软件研究院';
        }
      }
      if (basicInfoData.RetCode === '1') {
        //处理角色显示
        for(let i = 0; i < basicInfoData.DataRows.length ; i++ ){
          if(basicInfoData.DataRows[i].role_name === "null" ){
            basicInfoData.DataRows[i].role_name = "无"
          }else{
            basicInfoData.DataRows[i].role_name = basicInfoData.DataRows[i].role_name
          }
        }
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
            postData: postData,
            total: basicInfoData.RowCount,
            currentPage: arg_page_current
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },

    /**
     * 点击查询按钮后筛选出来的数据
     * @param arg_param
     * @param call
     * @param put
     */
    *memberInfoSearch({ arg_param, arg_page_current }, { call, put }) {
      //按条件查询人员信息
      const basicInfoData = yield call(projService.projMembersInfoQueryService, arg_param);
      //console.log(basicInfoData)
      for (let i = 0; i < basicInfoData.DataRows.length; i++) {
        basicInfoData.DataRows[i].dept_name = basicInfoData.DataRows[i].dept_name.split("-")[1]
        if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HQ_NAME_CN) {
          basicInfoData.DataRows[i].ou = '联通软件研究院本部';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HAERBIN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '哈尔滨软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_JINAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '济南软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_XIAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '西安软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_GUANGZHOU_NAME_CN) {
          basicInfoData.DataRows[i].ou = '广州软件研究院';
        }
      }
      //处理角色显示
      for(let i = 0; i < basicInfoData.DataRows.length ; i++ ){
        if(basicInfoData.DataRows[i].role_name === "null" ){
          basicInfoData.DataRows[i].role_name = "无"
        }else{
          basicInfoData.DataRows[i].role_name = basicInfoData.DataRows[i].role_name
        }
      }
      yield put({
        type: 'save',
        payload: {
          tableDataList: basicInfoData.DataRows,
          postData: arg_param,
          total: basicInfoData.RowCount,
          currentPage: arg_page_current
        }
      });
    },

    /**
     * 组织人员汇总
     * @param arg_param
     * @param call
     * @param put
     */
    *ouMembersCountSearch({ }, { call, put }) {
      //按条件查询人员信息
      let postData_getDept = {};
      postData_getDept["arg_tenantid"] = auth_tenantid;
      const getOuMemberCountData = yield call(projService.ouMembersCountQueryService, postData_getDept);

      //console.log(getOuMemberCountData.DataRows)
      //总结统计
      let item = {
        'ou_short': '总计',
        'total': '0',
        "func_num": '0',
        "proj_team_num": '0',
        "proj_team_num_cooperation": '0',
        "proj_total_num": '0',
        "proj_num": '0',
      };

      for (let i = 0; i < getOuMemberCountData.DataRows.length; i++) {

        getOuMemberCountData.DataRows[i].proj_total_num = parseInt(getOuMemberCountData.DataRows[i].proj_team_num_cooperation) + parseInt(getOuMemberCountData.DataRows[i].proj_team_num);

        item.total = (parseInt(item.total) + parseInt(getOuMemberCountData.DataRows[i].total)).toString();
        item.func_num = parseInt(item.func_num) + parseInt(getOuMemberCountData.DataRows[i].func_num);
        item.proj_team_num = parseInt(item.proj_team_num) + parseInt(getOuMemberCountData.DataRows[i].proj_team_num);
        item.proj_team_num_cooperation = parseInt(item.proj_team_num_cooperation) + parseInt(getOuMemberCountData.DataRows[i].proj_team_num_cooperation);
        item.proj_num = parseInt(item.proj_num) + parseInt(getOuMemberCountData.DataRows[i].proj_num);
        item.proj_total_num = parseInt(item.proj_total_num) + getOuMemberCountData.DataRows[i].proj_total_num;



        if (getOuMemberCountData.DataRows[i].ou.split('-')[1] == OU_HQ_NAME_CN) {
          getOuMemberCountData.DataRows[i].ou_short = '联通软件研究院本部';
        } else if (getOuMemberCountData.DataRows[i].ou.split('-')[1] == OU_HAERBIN_NAME_CN) {
          getOuMemberCountData.DataRows[i].ou_short = '哈尔滨软件研究院';
        } else if (getOuMemberCountData.DataRows[i].ou.split('-')[1] == OU_JINAN_NAME_CN) {
          getOuMemberCountData.DataRows[i].ou_short = '济南软件研究院';
        } else if (getOuMemberCountData.DataRows[i].ou.split('-')[1] == OU_XIAN_NAME_CN) {
          getOuMemberCountData.DataRows[i].ou_short = '西安软件研究院';
        } else if (getOuMemberCountData.DataRows[i].ou.split('-')[1] == OU_GUANGZHOU_NAME_CN) {
          getOuMemberCountData.DataRows[i].ou_short = '广州软件研究院';
        }
      }
      let pureOuMemberCountData = getOuMemberCountData.DataRows;
      //占比统计
      var ratio = {
        'ou_short': '占比', 'total': '-',
        "func_num": (parseFloat(item.func_num / item.total * 100).toFixed(1)).toString() + '%',
        "proj_team_num": (parseFloat(item.proj_team_num / item.total * 100).toFixed(1)).toString() + '%',
        "proj_team_num_cooperation": (parseFloat(item.proj_team_num_cooperation / item.total * 100).toFixed(1)).toString() + '%',
        "proj_total_num": (parseFloat(item.proj_total_num / item.total * 100).toFixed(1)).toString() + '%',
        "proj_num": '-', "perm_proj_num": '-'
      };

      pureOuMemberCountData.push(item);
      pureOuMemberCountData.push(ratio);

      yield put({
        type: 'save',
        payload: {
          ouMemberCountList: pureOuMemberCountData,
        }
      });
    },

    /**
     * 所有项目人数汇总
     * @param arg_param
     * @param call
     * @param put
     */
    *projMembersCountSearch({ }, { call, put }) {
      //按条件查询人员信息
      const data = yield call(projService.projMembersCountQueryService);
      //console.log(data.DataRows);
      let projMemberCount = [
        { 'ou': "联通软件研究院本部", "sum": '0', "proj": [], "row": '0' },
         { 'ou': "哈尔滨软件研究院", "sum": '0', "proj": [], "row": '0' }, 
         { 'ou': "济南软件研究院", "sum": '0', "proj": [], "row": '0' },
         { 'ou': "西安软件研究院", "sum": '0', "proj": [], "row": '0' },
         { 'ou': "广州软件研究院", "sum": '0', "proj": [], "row": '0' },
        ];

      for (var i = data.RowCount - 1; i >= 0; i--) {
        if (data.DataRows[i].ou.indexOf(OU_HQ_NAME_CN) != -1) {

          data.DataRows[i].total_num = parseInt(data.DataRows[i].count) + parseInt(data.DataRows[i].count_cooperation);
          data.DataRows[i].pu_dept_name = data.DataRows[i].pu_dept_name.split("-")[1];
          projMemberCount[0].proj.push(data.DataRows[i]);
          projMemberCount[0].sum = parseInt(projMemberCount[0].sum) + parseInt(data.DataRows[i].count);
          projMemberCount[0].row = parseInt(projMemberCount[0].row) + 1;
        } else if (data.DataRows[i].ou.indexOf(OU_HAERBIN_NAME_CN) != -1) {
          data.DataRows[i].total_num = parseInt(data.DataRows[i].count) + parseInt(data.DataRows[i].count_cooperation);
          data.DataRows[i].pu_dept_name = data.DataRows[i].pu_dept_name.split("-")[1];
          projMemberCount[1].proj.push(data.DataRows[i]);
          projMemberCount[1].sum = parseInt(projMemberCount[1].sum) + parseInt(data.DataRows[i].count);
          projMemberCount[1].row = parseInt(projMemberCount[1].row) + 1;
        } else if (data.DataRows[i].ou.indexOf(OU_JINAN_NAME_CN) != -1) {
          data.DataRows[i].total_num = parseInt(data.DataRows[i].count) + parseInt(data.DataRows[i].count_cooperation);
          data.DataRows[i].pu_dept_name = data.DataRows[i].pu_dept_name.split("-")[1];
          projMemberCount[2].proj.push(data.DataRows[i]);
          projMemberCount[2].sum = parseInt(projMemberCount[2].sum) + parseInt(data.DataRows[i].count);
          projMemberCount[2].row = parseInt(projMemberCount[2].row) + 1;
        }else if (data.DataRows[i].ou.indexOf(OU_XIAN_NAME_CN) != -1) {
          data.DataRows[i].total_num = parseInt(data.DataRows[i].count) + parseInt(data.DataRows[i].count_cooperation);
          data.DataRows[i].pu_dept_name = data.DataRows[i].pu_dept_name.split("-")[1];
          projMemberCount[3].proj.push(data.DataRows[i]);
          projMemberCount[3].sum = parseInt(projMemberCount[3].sum) + parseInt(data.DataRows[i].count);
          projMemberCount[3].row = parseInt(projMemberCount[3].row) + 1;
        }else if (data.DataRows[i].ou.indexOf(OU_GUANGZHOU_NAME_CN) != -1) {
          data.DataRows[i].total_num = parseInt(data.DataRows[i].count) + parseInt(data.DataRows[i].count_cooperation);
          data.DataRows[i].pu_dept_name = data.DataRows[i].pu_dept_name.split("-")[1];
          projMemberCount[4].proj.push(data.DataRows[i]);
          projMemberCount[4].sum = parseInt(projMemberCount[4].sum) + parseInt(data.DataRows[i].count);
          projMemberCount[4].row = parseInt(projMemberCount[4].row) + 1;
        }
      }

      yield put({
        type: 'save',
        payload: {
          projMemberCount: projMemberCount,
        }
      });
    },

    /**
     * 所有人员信息
     * @param arg_param
     * @param call
     * @param put
     */
    *memberList({ arg_param }, { call, put }) {
      /**
       * 作者：刘洪若
       * 时间：2020-4-26
       * 功能：按条件查询人员信息导出Excel表
       */
      let postData = {};
      postData["arg_tenantid"] = auth_tenantid;
      postData["arg_start"] = 1;   //初始化当前页码为1
      if(arg_param == undefined){
        postData["arg_ou"] = "";
        postData["arg_proj_id"] = "";
        postData["arg_dept_name"] = "";     //默认值为0
      } else{
        postData["arg_ou"] = (arg_param["arg_ou"] != undefined) ? arg_param["arg_ou"] : "";
        postData["arg_proj_id"] = (arg_param["arg_proj_id"] != undefined) ? arg_param["arg_proj_id"] : "" ;
        postData["arg_dept_name"] = (arg_param["arg_dept_name"] != undefined) ? arg_param["arg_dept_name"] : "" ; 
      }
      
      console.log(postData)
      //按条件查询人员信息
      const basicInfoData = yield call(projService.projMembersInfoQueryService, postData);
      console.log(basicInfoData)
      for (let i = 0; i < basicInfoData.DataRows.length; i++) {
        basicInfoData.DataRows[i].dept_name = basicInfoData.DataRows[i].dept_name.split("-")[1]
        if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HQ_NAME_CN) {
          basicInfoData.DataRows[i].ou = '联通软件研究院本部';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_HAERBIN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '哈尔滨软件研究院';
        } else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_JINAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '济南软件研究院';
        }else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_XIAN_NAME_CN) {
          basicInfoData.DataRows[i].ou = '西安软件研究院';
        }else if (basicInfoData.DataRows[i].ou.split('-')[1] == OU_GUANGZHOU_NAME_CN) {
          basicInfoData.DataRows[i].ou = '广州软件研究院';
        }
      }
      //处理导出表格数据中的角色显示信息
      for(let i = 0; i < basicInfoData.DataRows.length ; i++ ){
        if(basicInfoData.DataRows[i].role_name === "null" ){
          basicInfoData.DataRows[i].role_name = "无"
        }else{
          basicInfoData.DataRows[i].role_name = basicInfoData.DataRows[i].role_name
        }
      }
      yield put({
        type: 'save',
        payload: {
          memberList: basicInfoData.DataRows
        }
      });
    },

    /**
     * 部门项目人员汇总
     * @param arg_param
     * @param call
     * @param put
     */
    *deptAllProjMemberCount({ }, { call, put}) {
         //获取所有项目人员信息
        let postData = {};
        postData["arg_tenantid"] = auth_tenantid;
        postData["arg_req_userid"] =  Cookie.get('userid');
        postData["arg_req_moduleurl"] =  window.location.hash.replace('#/', '').split('?')[0].split('/')[1];

        const data = yield call(projService.getAllProjPersonalStatistics, postData);
        if (data.RetCode === '1') {
            // 增加一行‘合计’
            const deptNameArray =[
                '联通软件研究院-公众研发事业部',
                '联通软件研究院-创新与合作研发事业部',
                '联通软件研究院-公共平台与架构研发事业部',
                '联通软件研究院-政企与行业研发事业部',
                '联通软件研究院-计费结算中心',
                '联通软件研究院-运营保障与调度中心',
                '联通软件研究院-共享资源中心',
            ];
            let total=[];
            let total_staff = 0;
            for (let i in deptNameArray) {
                let str={}
                let num = 0;
                for (let j in data.DataRows) {
                    let totalInfo = JSON.parse(data.DataRows[j].total_info);
                    for (let k in totalInfo) {
                        if(deptNameArray[i] === totalInfo[k].pu_dept_name) {
                            num+=parseInt(totalInfo[k].sum_staff);
                        }
                    }
                }
                str.pu_dept_name = deptNameArray[i];
                str.sum_staff = num.toString();
                total_staff += num;
                total.push(str); 
            }
            data.DataRows.push({
                total_staff: total_staff.toString(),
                ou: '合计',
                total_info: JSON.stringify(total),
            });
            data.DataRows.forEach((item, index) => {
                item.key = index;
            });

            yield put({
                type: 'save',
                payload: {
                    deptMemberList: data.DataRows
                }
            })
        }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/projPrepare/memberQuery') {
          dispatch({ type: 'memberInfoSearchDefault', query });
          dispatch({ type: 'ouMembersCountSearch', query });
          dispatch({ type: 'projMembersCountSearch', query });
          dispatch({ type: 'memberList', query });
          dispatch({ type: 'deptAllProjMemberCount', query });
        }
      });
    }
  }
};
