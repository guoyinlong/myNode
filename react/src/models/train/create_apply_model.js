/**
 * 文件说明：创建外训、认证考试申请
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-25
 */

import Cookie from "js-cookie";
import * as overtimeService from "../../services/overtime/overtimeService"
import * as staffLeaveService from "../../services/labor/staffLeave/staffLeaveService"
import * as trainService from "../../services/train/trainService"
import { message } from "antd";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
const auth_ou = Cookie.get('OU');
const ou_id = Cookie.get('OUID');

let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'createApplyModel',
  state: {
    //下一环节处理名称及处理人
    nextDataList: [],
    nextPostName: '',
    //附件信息
    fileDataList: [],
    fileDataListCheck: [],
    fileDataListExec: [],
    pf_url: '',
    file_relative_path: '',
    file_name: '',

    //培训申请信息
    applyInfoRecord: [],

    //培训审批信息
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],

    person_list: [],

    //课程信息
    trainClassData: [],

    //岗位信息
    allPostDataList: [],
    //查询部门
    centerDept: [],
    //参训人员查询
    personsList: [],
    //permission
    permission: '',
    //申请唯一id，proc_inst_id
    proc_inst_id: ''
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    //查询下一处理人员信息
    *initQuery({ query }, { call, put }) {
      // let auth_userid = Cookie.get('userid');
      // /* 查询下一环节处理人信息 Begin */
      // let projectQueryparams = {};
      // projectQueryparams["arg_user_id"] = auth_userid;
      // let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      // //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      // if (userProjectData.DataRows[0] && userProjectData.DataRows[0].mgr_id !== Cookie.get('userid')){

      //   let nextName = '';
      //   for(let i=0; i<userProjectData.DataRows.length; i++) {
      //     let projectQueryParams = {
      //       arg_proc_inst_id: 'NA',
      //       arg_proj_id: userProjectData.DataRows[i].proj_id,
      //       arg_post_id: '9cc97a9cb3b311e6a01d02429ca3c6ff'
      //     };
      //     let nextData1 = yield call(overtimeService.nextPersonListQuery, projectQueryParams);
      //     if (nextData1.length > 0) {
      //       nextName = nextData1.DataRows[0].submit_post_name;
      //     }
      //     if (nextData1.RetCode === '1') {
      //       yield put({
      //         type: 'save',
      //         payload: {
      //           nextDataList: nextData1.DataRows,
      //           nextPostName: nextName
      //         }
      //       })
      //     } else {
      //       message.error("查询下一环节处理人信息异常");
      //     }
      //   }
      // }
      // //判断为项目经理或者职能线
      // else {
      //   projectQueryparams = {
      //     arg_deptid: Cookie.get('dept_id')
      //   };
      //   let nextData = yield call(overtimeService.nextPersonListStartQuery,projectQueryparams);
      //   let nextname = '';
      //   if (nextData.DataRows.length>0) {
      //     nextname = nextData.DataRows[0].submit_post_name;
      //   }
      //   if( nextData.RetCode === '1'){
      //     yield put({
      //       type:'save',
      //       payload:{
      //         nextDataList: nextData.DataRows,
      //         nextPostName: nextname
      //       }
      //     })
      //   }else{
      //     message.error("查询下一环节处理人信息异常");
      //   }
      // }
      // /* 查询下一环节处理人信息 End */
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams = {
        arg_deptid: Cookie.get('dept_id')
      };
      let nextData = yield call(overtimeService.nextPersonListStartQuery, projectQueryparams);
      let nextname = '';
      if (nextData.DataRows.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextPostName: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      /* 查询下一环节处理人信息 End */
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

    /* 内训-自有内训师 培训申请 初始化*/
    *initInternalOwnTeacherQuery({ query }, { call, put }) {
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams = {
        arg_deptid: Cookie.get('dept_id')
      };
      let nextData = yield call(overtimeService.nextPersonListStartQuery, projectQueryparams);
      let nextname = '';
      if (nextData.DataRows.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextPostName: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      /* 查询下一环节处理人信息 End */

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

    /* 内训-参加集团及系统内培训 培训申请 初始化 */
    *initInternalIngroupInsystemQuery({ query }, { call, put }) {
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams = {
        arg_deptid: Cookie.get('dept_id')
      };
      let nextData = yield call(overtimeService.nextPersonListStartQuery, projectQueryparams);
      let nextname = '';
      if (nextData.DataRows.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextPostName: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      /* 查询下一环节处理人信息 End */

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

    /* 内训-外请讲师 培训申请 初始化 */
    *initInternalExternalTeacherQuery({ query }, { call, put }) {
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams = {
        arg_deptid: Cookie.get('dept_id')
      };
      let nextData = yield call(overtimeService.nextPersonListStartQuery, projectQueryparams);
      let nextname = '';
      if (nextData.DataRows.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextPostName: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      /* 查询下一环节处理人信息 End */

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

      //查询登录人员的角色
      let queryData = {};
      queryData["arg_user_id"] = Cookie.get('userid');
      const roleData = yield call(trainService.trainCheckRole, queryData);

      if (roleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            permission: roleData.DataRows[0].role_level
          }
        })
      } else {
        message.error(roleData.RetVal);
      }
    },

    /* 培训班申请 初始化 */
    *initInternalTrainCourseApplyQuery({ query }, { call, put }) {
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams = {
        arg_deptid: Cookie.get('dept_id')
      };
      let nextData = yield call(overtimeService.nextPersonListStartQuery, projectQueryparams);
      let nextname = '';
      if (nextData.DataRows.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextPostName: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      /* 查询下一环节处理人信息 End */

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

      //查询登录人员的角色
      let queryData = {};
      queryData["arg_user_id"] = Cookie.get('userid');
      const roleData = yield call(trainService.trainCheckRole, queryData);

      if (roleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            permission: roleData.DataRows[0].role_level
          }
        })
      } else {
        message.error(roleData.RetVal);
      }
    },

    //可申请的培训课程查询
    *queryTrainClassForApply({ queryParam, resolve }, { call, put }) {
      let query = {
        arg_user_id: queryParam.arg_user_id,
        arg_train_type: queryParam.arg_train_type,
        arg_train_class_type: queryParam.arg_train_class_type,
      }

      let clssInfoData = yield call(trainService.classInfoQuery, query);
      if (clssInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            trainClassData: clssInfoData.DataRows,
          }
        });
        resolve("success");
      } else {
        resolve("false");
      }
    },

    //提交计划内申请
    *trainClassInPlanApplySubmit({ basicApplyData, resolve }, { call }) {
      //判断是否是职能线或者项目经理核心岗
      let auth_userid = Cookie.get('userid');
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let staffFlag = false;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      if (userProjectData.DataRows[0] && userProjectData.DataRows[0].mgr_id !== Cookie.get('userid')) {
        staffFlag = false;
      }
      //判断为项目经理或者职能线
      else {
        staffFlag = true;
      }

      //启动工作流
      let param = {
        beginbusinessId: 'train_class_apply',
      };
      let listenersrc = '{addtrainapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
      param["listener"] = listenersrc;
      param["form"] = '{if_function:' + staffFlag + '}';

      const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);
      let trainClassApprovalFlowStartList = [];
      if (trainApplyFlowStartResult.RetCode === '1') {
        trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
      let task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
      let task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

      param.completetaskId = task_id;

      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);

      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }

      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;

      let postData = {
        arg_task_id: task_id,
        arg_train_class_apply_id: Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,

        arg_proc_inst_id: proc_inst_id,
        arg_create_person_id: basicApplyData.arg_create_person_id,
        arg_create_person_name: basicApplyData.arg_create_person_name,
        arg_create_person_dept_id: basicApplyData.arg_create_person_dept_id,
        arg_create_person_dept_name: basicApplyData.arg_create_person_dept_name,
        arg_is_out_of_plan: basicApplyData.arg_is_out_of_plan,
        arg_train_class_name: basicApplyData.arg_train_class_name,
        arg_train_class_type: basicApplyData.arg_train_class_type,
        arg_train_reason_and_require: basicApplyData.arg_train_reason_and_require,
        arg_train_fee: basicApplyData.arg_train_fee,
        arg_train_person_id: basicApplyData.arg_train_person_id,
        arg_train_person_name: basicApplyData.arg_train_person_name,
        arg_train_start_time: basicApplyData.arg_train_start_time,
        arg_train_end_time: basicApplyData.arg_train_end_time,
        arg_train_place: basicApplyData.arg_train_place,
        arg_train_target: basicApplyData.arg_train_target,
        arg_train_remark: basicApplyData.arg_train_remark,
        arg_pf_url: basicApplyData.arg_pf_url,
        arg_file_relative_path: basicApplyData.arg_file_relative_path,
        arg_file_name: basicApplyData.arg_file_name,
        arg_state: basicApplyData.arg_state,
        arg_create_time: basicApplyData.arg_create_time,
        arg_mobile_phone: basicApplyData.arg_mobile_phone,

        arg_next_step_person: basicApplyData.arg_next_step_person,

        arg_train_class_level: basicApplyData.arg_train_class_level,
        arg_train_class_person: basicApplyData.arg_train_class_person,
        arg_train_class_person_num: basicApplyData.arg_train_class_person_num,
        arg_train_class_hour: basicApplyData.arg_train_class_hour,
        arg_train_class_dept: basicApplyData.arg_train_class_dept,
        arg_train_class_teacher: basicApplyData.arg_train_class_teacher,
        arg_train_class_grade: basicApplyData.arg_train_class_grade,
        arg_train_class_time_out: basicApplyData.arg_train_class_time_out,
        arg_train_person_info: basicApplyData.arg_train_person_info,
        arg_train_class_grade_id: basicApplyData.arg_train_class_grade_id,
        //培训申请类型
        arg_train_apply_type: basicApplyData.arg_train_apply_type,

      }
      try {
        //业务表添加
        let updateresult = yield call(trainService.submitTrainClassApply, postData);
        if (updateresult.RetCode === '1') {
          message.info("提交成功！");
          resolve("success");
        } else {
          //回滚功能:数据库
          yield call(trainService.trainClassApplyDelete, postData);
          resolve("false");
        }
      } catch (e) {
        //回滚功能:数据库
        try {
          yield call(trainService.trainClassApplyDelete, postData);
          //回滚功能:工作流
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainApplyFlowTerminate, postData);
          resolve("false");
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    //提交计划外申请
    *trainClassOutPlanApplySubmit({ basicOutPlanApplyData, resolve }, { call }) {
      //判断是否是职能线或者项目经理核心岗
      let auth_userid = Cookie.get('userid');
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let staffFlag = false;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      if (userProjectData.DataRows[0] && userProjectData.DataRows[0].mgr_id !== Cookie.get('userid')) {
        staffFlag = false;
      }
      //判断为项目经理或者职能线
      else {
        staffFlag = true;
      }

      //启动工作流
      let param = {
        beginbusinessId: 'train_class_apply',
      };
      let listenersrc = '{addtrainapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
      param["listener"] = listenersrc;
      param["form"] = '{if_function:' + staffFlag + '}';

      const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);
      let trainClassApprovalFlowStartList = [];
      if (trainApplyFlowStartResult.RetCode === '1') {
        trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
      let task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
      let task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

      param.completetaskId = task_id;

      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);

      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }

      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;

      let postData = {
        arg_back_flag: '0',
        arg_train_class_apply_id: Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        arg_task_id: task_id,
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,
        arg_proc_inst_id: proc_inst_id,

        arg_create_person_id: basicOutPlanApplyData.arg_create_person_id,
        arg_create_person_dept_id: basicOutPlanApplyData.arg_create_person_dept_id,

        arg_mobile_phone: basicOutPlanApplyData.arg_mobile_phone,
        arg_train_class_type: basicOutPlanApplyData.arg_train_class_type,
        arg_train_class_name: basicOutPlanApplyData.arg_train_class_name,
        arg_train_class_level: basicOutPlanApplyData.arg_train_class_level,
        arg_train_class_person: basicOutPlanApplyData.arg_train_class_person,
        arg_train_class_person_num: basicOutPlanApplyData.arg_train_class_person_num,
        arg_train_class_hour: basicOutPlanApplyData.arg_train_class_hour,
        arg_train_class_time_out: basicOutPlanApplyData.arg_train_class_time_out,
        arg_train_class_dept: basicOutPlanApplyData.arg_train_class_dept,
        arg_train_class_teacher: basicOutPlanApplyData.arg_train_class_teacher,
        arg_train_class_grade: basicOutPlanApplyData.arg_train_class_grade,

        arg_train_reason_and_require: basicOutPlanApplyData.arg_train_reason_and_require,
        arg_train_fee: basicOutPlanApplyData.arg_train_fee,

        arg_train_start_time: basicOutPlanApplyData.arg_train_start_time,
        arg_train_end_time: basicOutPlanApplyData.arg_train_end_time,
        arg_train_place: basicOutPlanApplyData.arg_train_place,
        arg_train_target: basicOutPlanApplyData.arg_train_target,
        arg_train_remark: basicOutPlanApplyData.arg_train_remark,

        arg_pf_url: basicOutPlanApplyData.arg_pf_url,
        arg_file_relative_path: basicOutPlanApplyData.arg_file_relative_path,
        arg_file_name: basicOutPlanApplyData.arg_file_name,

        arg_state: basicOutPlanApplyData.arg_state,
        arg_create_time: basicOutPlanApplyData.arg_create_time,

        arg_next_step_person: basicOutPlanApplyData.arg_next_step_person,

        arg_train_class_personal_info_id: basicOutPlanApplyData.arg_train_class_personal_info_id,
        //培训申请类型
        arg_train_apply_type: basicOutPlanApplyData.arg_train_apply_type,

      }
      try {
        //业务表添加
        let updateresult = yield call(trainService.submitTrainOutPlanClassApply, postData);
        if (updateresult.RetCode === '1') {
          resolve("success");
        } else {
          //回滚功能:数据库
          postData["arg_back_flag"] = '1';
          yield call(trainService.submitTrainOutPlanClassApply, postData);
          resolve("false");
        }
      } catch (e) {
        try {
          //回滚功能:数据库
          postData["arg_back_flag"] = '1';
          yield call(trainService.submitTrainOutPlanClassApply, postData);

          //回滚功能:工作流
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainApplyFlowTerminate, postData);
          resolve("false");
        } catch (e1) {
          resolve("false");
        }
      }
    },
    //提交计划外申请(人员提交),提交到train_class_personal_info 表
    *trainClassOutPlanPersonSubmit({ basicOutPlanApplyPersonData, train_class_personal_info_id, resolve }, { call }) {

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
    },

    //提交计划内申请-内训
    *trainClassInPlanApplySubmitInternal({ basicApplyData, TeacherData, train_type, resolve }, { call, put }) {
      //内训-参加集团及系统内培训：train_type=1；内训-自有内训师：train_type=2；内训-外请讲师：train_type=3
      //确认内训师是否全部是本院,0：全是本院，1：有其他院的内训师
      let if_own = true;
      let postTeacherData = {};
      let this_ou = Cookie.get("OUID");
      if (TeacherData.length) {
        for (let i = 0; i < TeacherData.length; i++) {
          postTeacherData["arg_train_teacher_id"] = TeacherData[i].personname;
          //业务表添加
          let teacherOuData = yield call(trainService.trainApplyTeacherOu, postTeacherData);
          if (teacherOuData.RetCode === '1') {
            if (this_ou !== teacherOuData.DataRows[0].teacher_ou_id) {
              if_own = false;
              break;
            }
          }
        }
      }

      //启动不同的工作流
      let trainClassApprovalFlowStartList = [];
      let param = {};
      let proc_inst_id = '';
      let task_id = '';
      let task_name = '';

      if (train_type === '1') {
        param.beginbusinessId = 'intrain_in_group_inplan';
        let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;

        const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);

        if (trainApplyFlowStartResult.RetCode === '1') {
          trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
        } else {
          message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
        task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
        task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

        param["completetaskId"] = task_id;
      }
      if (train_type === '2') {
        //内训师为本院
        param.beginbusinessId = 'intrain_inner_train_inplan';

        let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}",arg_if_own:"' + if_own + '" ,arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;

        const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);
        if (trainApplyFlowStartResult.RetCode === '1') {
          trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
        } else {
          message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
        task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
        task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

        param["completetaskId"] = task_id;
      }
      if (train_type === '3') {
        param.beginbusinessId = 'intrain_outteacher_inplan';

        let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;

        const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);
        if (trainApplyFlowStartResult.RetCode === '1') {
          trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
        } else {
          message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
        task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
        task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

        param["completetaskId"] = task_id;
      }
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: proc_inst_id,
        }
      })
      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);

      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }

      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;

      let postData = {
        arg_train_class_apply_id: Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        arg_task_id: task_id,
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,

        arg_proc_inst_id: proc_inst_id,
        arg_create_person_id: basicApplyData.arg_create_person_id,
        arg_create_person_name: basicApplyData.arg_create_person_name,
        arg_create_person_dept_id: basicApplyData.arg_create_person_dept_id,
        arg_create_person_dept_name: basicApplyData.arg_create_person_dept_name,
        arg_is_out_of_plan: basicApplyData.arg_is_out_of_plan,
        arg_train_class_name: basicApplyData.arg_train_class_name,
        arg_train_class_type: basicApplyData.arg_train_class_type,
        arg_train_reason_and_require: basicApplyData.arg_train_reason_and_require,
        arg_train_fee: basicApplyData.arg_train_fee,
        arg_train_person_id: basicApplyData.arg_train_person_id,
        arg_train_person_name: basicApplyData.arg_train_person_name,
        arg_train_start_time: basicApplyData.arg_train_start_time,
        arg_train_end_time: basicApplyData.arg_train_end_time,
        arg_train_place: basicApplyData.arg_train_place,
        arg_train_target: basicApplyData.arg_train_target,
        arg_pf_url: basicApplyData.arg_pf_url,
        arg_file_relative_path: basicApplyData.arg_file_relative_path,
        arg_file_name: basicApplyData.arg_file_name,
        arg_state: basicApplyData.arg_state,
        arg_create_time: basicApplyData.arg_create_time,
        arg_mobile_phone: basicApplyData.arg_mobile_phone,

        arg_next_step_person: basicApplyData.arg_next_step_person,

        arg_train_class_level: basicApplyData.arg_train_class_level,
        arg_train_class_person: basicApplyData.arg_train_class_person,
        arg_train_class_person_num: basicApplyData.arg_train_class_person_num,
        arg_train_class_hour: basicApplyData.arg_train_class_hour,
        arg_train_class_dept: basicApplyData.arg_train_class_dept,
        arg_train_class_teacher: basicApplyData.arg_train_class_teacher,
        arg_train_class_grade: basicApplyData.arg_train_class_grade,
        arg_train_class_time_out: basicApplyData.arg_train_class_time_out,
        arg_train_person_info: basicApplyData.arg_train_person_info,
        arg_train_class_grade_id: basicApplyData.arg_train_class_grade_id,
        //培训申请类型
        arg_train_apply_type: basicApplyData.arg_train_apply_type

      }
      try {
        //业务表添加
        let updateresult = yield call(trainService.submitTrainClassApply, postData);
        if (updateresult.RetCode === '1') {
          resolve("success");
        } else {
          //回滚功能:数据库
          yield call(trainService.trainClassApplyDelete, postData);
          resolve("false");
        }
      } catch (e) {
        //回滚功能:数据库
        try {
          yield call(trainService.trainClassApplyDelete, postData);
          //回滚功能:工作流
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainApplyFlowTerminate, postData);
          resolve("false");
        } catch (e1) {
          resolve("false");
        }
      }
    },
    //提交计划外申请-内训
    *trainClassOutPlanApplySubmitInternal({ basicOutPlanApplyData, TeacherData, train_type, resolve }, { call, put }) {
      //内训-参加集团及系统内培训：train_type=1；内训-自有内训师：train_type=2；内训-外请讲师：train_type=3

      //确认内训师是否全部是本院,0：全是本院，1：有其他院的内训师
      let if_own = true;
      let postTeacherData = {};
      let this_ou = Cookie.get("OUID");
      if (TeacherData.length) {
        for (let i = 0; i < TeacherData.length; i++) {
          postTeacherData["arg_train_teacher_id"] = TeacherData[i].personname;
          //业务表添加
          let teacherOuData = yield call(trainService.trainApplyTeacherOu, postTeacherData);
          if (teacherOuData.RetCode === '1') {
            if (this_ou !== teacherOuData.DataRows[0].teacher_ou_id) {
              if_own = false;
              break;
            } else {
              continue;
            }
          }
        }
      }
      //启动不同的工作流
      let trainClassApprovalFlowStartList = [];
      let param = {};
      let proc_inst_id = '';
      let task_id = '';
      let task_name = '';

      param.completetaskId = task_id;
      if (train_type === '1') {
        param.beginbusinessId = 'intrain_in_group_outplan';
        let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;

        const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);

        if (trainApplyFlowStartResult.RetCode === '1') {
          trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
        } else {
          message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
        task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
        task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

        param.completetaskId = task_id;
      } else if (train_type === '2') {
        param.beginbusinessId = 'intrain_inner_train_outplan';
        let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;

        const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);

        if (trainApplyFlowStartResult.RetCode === '1') {
          trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
        } else {
          message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
        task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
        task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

        param.completetaskId = task_id;
      }

      yield put({
        type: 'save',
        payload: {
          proc_inst_id: proc_inst_id,
        }
      })

      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);

      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }

      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;

      let postData = {
        arg_back_flag: '0',
        arg_train_class_apply_id: Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        arg_task_id: task_id,
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,
        arg_proc_inst_id: proc_inst_id,

        arg_create_person_id: basicOutPlanApplyData.arg_create_person_id,
        arg_create_person_dept_id: basicOutPlanApplyData.arg_create_person_dept_id,

        arg_mobile_phone: basicOutPlanApplyData.arg_mobile_phone,
        arg_train_class_type: basicOutPlanApplyData.arg_train_class_type,
        arg_train_class_name: basicOutPlanApplyData.arg_train_class_name,
        arg_train_class_level: basicOutPlanApplyData.arg_train_class_level,
        arg_train_class_person: basicOutPlanApplyData.arg_train_class_person,
        arg_train_class_person_num: basicOutPlanApplyData.arg_train_class_person_num,
        arg_train_class_hour: basicOutPlanApplyData.arg_train_class_hour,
        arg_train_class_time_out: basicOutPlanApplyData.arg_train_class_time_out,
        arg_train_class_dept: basicOutPlanApplyData.arg_train_class_dept,
        arg_train_class_teacher: basicOutPlanApplyData.arg_train_class_teacher,
        arg_train_class_grade: basicOutPlanApplyData.arg_train_class_grade,

        arg_train_reason_and_require: basicOutPlanApplyData.arg_train_reason_and_require,
        arg_train_fee: basicOutPlanApplyData.arg_train_fee,

        arg_train_start_time: basicOutPlanApplyData.arg_train_start_time,
        arg_train_end_time: basicOutPlanApplyData.arg_train_end_time,
        arg_train_place: basicOutPlanApplyData.arg_train_place,
        arg_train_target: basicOutPlanApplyData.arg_train_target,

        arg_pf_url: basicOutPlanApplyData.arg_pf_url,
        arg_file_relative_path: basicOutPlanApplyData.arg_file_relative_path,
        arg_file_name: basicOutPlanApplyData.arg_file_name,

        arg_state: basicOutPlanApplyData.arg_state,
        arg_create_time: basicOutPlanApplyData.arg_create_time,

        arg_next_step_person: basicOutPlanApplyData.arg_next_step_person,

        arg_train_class_personal_info_id: basicOutPlanApplyData.arg_train_class_personal_info_id,

        //培训申请类型
        arg_train_apply_type: basicOutPlanApplyData.arg_train_apply_type
      }
      try {
        //业务表添加
        let updateresult = yield call(trainService.submitTrainOutPlanClassApply, postData);
        if (updateresult.RetCode === '1') {
          resolve("success");
        } else {
          //回滚功能:数据库
          postData["arg_back_flag"] = '1';
          yield call(trainService.submitTrainOutPlanClassApply, postData);
          resolve("false");
        }
      } catch (e) {
        try {
          //回滚功能:数据库
          postData["arg_back_flag"] = '1';
          yield call(trainService.submitTrainOutPlanClassApply, postData);

          //回滚功能:工作流
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainApplyFlowTerminate, postData);
          resolve("false");
        } catch (e1) {
          resolve("false");
        }
      }
    },
    //提交计划外申请(人员提交),提交到train_class_personal_info 表-内训
    *trainClassOutPlanPersonSubmitInternal({ basicOutPlanApplyPersonData, train_class_personal_info_id, resolve }, { call }) {
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
    },
    //提交内训师,提交到内训师表-内训
    *trainClassTeacherSubmitInternal({ basicOutPlanApplyTeacherData, teacher_type, train_batch_teacher_id, train_class_personal_info_id, train_type, train_apply_class_id, train_plan_type, arg_proc_inst_id, resolve }, { call }) {
      let postData = {};

      if (basicOutPlanApplyTeacherData.length) {
        for (let i = 0; i < basicOutPlanApplyTeacherData.length; i++) {
          //内训师姓名
          if (teacher_type === '0') {
            postData["arg_train_teacher_id"] = basicOutPlanApplyTeacherData[i];
          } else {
            postData["arg_train_teacher_id"] = basicOutPlanApplyTeacherData[i].personname;
          }
          //用来找计划外课程id
          postData["arg_train_find_out_plan_id"] = train_class_personal_info_id;
          //内训培训类型
          postData["arg_train_type"] = train_type;
          //是否是计划内培训，0：计划内，1：计划外
          postData["arg_train_plan_type"] = train_plan_type;
          //用来找计划内课程id
          postData["arg_train_apply_class_id"] = train_apply_class_id;
          //该课程内训师状态：是否完成对其的评议,0：未完成，1：完成
          postData["arg_state"] = '0';
          //回滚标志，0：正常，1：回滚
          postData["arg_back_flag"] = '0';
          //导入批次id，用于回滚
          postData["arg_train_batch_teacher_id"] = train_batch_teacher_id;
          //培训师类型：0：手动输入；1：软院系统内选择
          postData["arg_teacher_type"] = teacher_type;
          //唯一id用来找apply_id
          postData["arg_proc_inst_id"] = arg_proc_inst_id;
          try {
            //业务表添加
            let updateresult = yield call(trainService.trainApplyTeacherSubmitInternal, postData);
            if (updateresult.RetCode === '1') {
              resolve("success");
            } else {
              //回滚功能:数据库
              postData["arg_back_flag"] = '1';
              yield call(trainService.trainApplyTeacherSubmitInternal, postData);
              resolve("false");
              return;
            }
          } catch (e) {
            //回滚功能:数据库
            postData["arg_back_flag"] = '1';
            yield call(trainService.trainApplyTeacherSubmitInternal, postData);
            resolve("false");
            return;
          }
        }
      }
    },

    //培训班申请，信息提交，全部是计划内培训班
    *trainCourseClassSubmit({ basicApplyData, courseClassDataList, resolve }, { call }) {
      //启动不同的工作流
      let trainClassApprovalFlowStartList = [];
      let param = {};
      let proc_inst_id = '';
      let task_id = '';
      let task_name = '';

      param.completetaskId = task_id;
      param.beginbusinessId = 'train_course_apply';
      let listenersrc = '{trainapply:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
      param["listener"] = listenersrc;

      const trainApplyFlowStartResult = yield call(trainService.trainApplyFlowStart, param);

      if (trainApplyFlowStartResult.RetCode === '1') {
        trainClassApprovalFlowStartList = trainApplyFlowStartResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + trainApplyFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      proc_inst_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].procInstId;
      task_id = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].taskId;
      task_name = trainClassApprovalFlowStartList[0] && trainClassApprovalFlowStartList[0].actName;

      param.completetaskId = task_id;
      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);

      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainApplyFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }

      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;

      let postData = {
        arg_back_flag: '0',
        arg_train_class_apply_id: Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        arg_task_id: task_id,
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,
        arg_proc_inst_id: proc_inst_id,

        arg_create_person_id: basicApplyData.arg_create_person_id,
        arg_create_person_name: basicApplyData.arg_create_person_name,
        arg_create_person_dept_id: basicApplyData.arg_create_person_dept_id,
        arg_create_person_dept_name: basicApplyData.arg_create_person_dept_name,
        arg_is_out_of_plan: basicApplyData.arg_is_out_of_plan,
        arg_mobile_phone: basicApplyData.arg_mobile_phone,
        arg_train_start_time: basicApplyData.arg_train_start_time,
        arg_train_end_time: basicApplyData.arg_train_end_time,
        arg_train_place: basicApplyData.arg_train_place,
        arg_train_target: basicApplyData.arg_train_target,
        arg_train_remark: basicApplyData.arg_train_remark,
        arg_train_class_type: basicApplyData.arg_train_class_type,
        arg_train_class_name: basicApplyData.arg_train_class_name,

        arg_train_reason_and_require: basicApplyData.arg_train_reason_and_require,
        arg_train_fee: basicApplyData.arg_train_fee,
        arg_train_class_person_num: basicApplyData.arg_train_class_person_num,
        arg_train_person_name: basicApplyData.arg_train_person_name,

        arg_pf_url: basicApplyData.arg_pf_url,
        arg_file_relative_path: basicApplyData.arg_file_relative_path,
        arg_file_name: basicApplyData.arg_file_name,

        arg_state: basicApplyData.arg_state,
        arg_create_time: basicApplyData.arg_create_time,

        arg_next_step_person: basicApplyData.arg_next_step_person,

        //培训申请类型
        arg_train_apply_type: basicApplyData.arg_train_apply_type
      }
      try {
        //业务表添加
        let updateresult = yield call(trainService.trainCourseClassApplyBasicSubmit, postData);

        if (updateresult.RetCode === "1") {
          if (courseClassDataList && courseClassDataList[0]) {
            let batch_id_temp = Cookie.get('userid') + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
            for (let i = 0; i < courseClassDataList.length; i++) {
              let postData2 = {
                arg_batch_id: batch_id_temp,
                arg_class_teacher: courseClassDataList[i].arg_train_teacher_input,
                arg_class_id: courseClassDataList[i].arg_class_id,
                arg_class_name: courseClassDataList[i].arg_train_class_input,
                arg_course_class_id: basicApplyData.arg_train_class_name,
                arg_class_type: courseClassDataList[i].arg_train_class_apply_type,
                arg_train_time: courseClassDataList[i].arg_train_time,
                arg_train_hour: courseClassDataList[i].arg_train_hour,
                arg_course_fee: courseClassDataList[i].arg_course_fee,
                arg_class_state: '0',
                arg_proc_inst_id: proc_inst_id,
                arg_back_flag: '0',
              };

              //业务表添加
              let updateresult1 = yield call(trainService.trainCourseApplyClassInfoSubmit, postData2);
              if (updateresult1.RetCode === '1') {
                resolve("success");
              } else {
                //回滚功能:数据库
                postData2["arg_back_flag"] = '1';
                yield call(trainService.trainCourseApplyClassInfoSubmit, postData2);
                resolve("false");
                return;
              }
            }
          }
        } else {
          //回滚功能:数据库
          postData["arg_back_flag"] = '1';
          yield call(trainService.trainCourseClassApplyBasicSubmit, postData);
          resolve("false");
        }
      } catch (e) {
        try {
          //回滚功能:数据库
          postData["arg_back_flag"] = '1';
          yield call(trainService.trainCourseClassApplyBasicSubmit, postData);

          //回滚功能:工作流
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainApplyFlowTerminate, param);
          resolve("false");
        } catch (e1) {
          resolve("false");
        }
      }
    },

    //删除附件
    *deleteFile({ RelativePath }, { call, put }) {
      let projectQueryparams = {
        RelativePath: RelativePath,
      };
      let deletefalg = yield call(overtimeService.deleteFile, projectQueryparams);
      if (deletefalg.RetCode === '1') {
        console.log("调用服务删除成功");
        yield put({
          type: 'save',
          payload: {
            pf_url: '',
            file_relative_path: '',
            file_name: '',
          }
        })
      } else {
        console.log("调用服务删除失败");
      }
    },
    //保存文件
    * changeNewFile({ oldfile, newfile }, { call, put }) {
      if (oldfile.name === "" || oldfile.name === null) {
        yield put({
          type: 'save',
          payload: {
            pf_url: newfile[0].response.file.AbsolutePath,
            file_relative_path: newfile[0].response.file.RelativePath,
            file_name: newfile[0].name,
          }
        })
      } else {
        console.log("修改文件");
        if (oldfile.uid === 1) {
          console.log("保存的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.url,
          };
          yield call(overtimeService.deleteFile, projectQueryparams);
          //保存新文件
          yield put({
            type: 'save',
            payload: {
              pf_url: newfile[0].response.file.AbsolutePath,
              file_relative_path: newfile[0].response.file.RelativePath,
              file_name: newfile[0].name,
            }
          })
        } else {
          console.log("新建的文件进行修改");
          //删除旧文件
          let projectQueryparams = {
            RelativePath: oldfile.response.file.RelativePath,
          };
          yield call(overtimeService.deleteFile, projectQueryparams);
          //保存新文件
          yield put({
            type: 'save',
            payload: {
              pf_url: newfile[0].response.file.AbsolutePath,
              file_relative_path: newfile[0].response.file.RelativePath,
              file_name: newfile[0].name,
            }
          })
        }
      }
    },

    //培训查看
    * TrainApplyLook({ query }, { put, call }) {
      console.log("query===" + JSON.stringify(query));
      yield put({
        type: 'save',
        payload: {
          applyInfoRecord: query,
        }
      });
      //查询审批信息
      let params = {
        arg_train_class_apply_id: query.task_id,
      }
      //查询审批信息
      let approvalinfo = yield call(trainService.trainClassApplyApprovalListQuery, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }


      //查询培训人员信息
      let personParams = {
        arg_train_class_apply_id: query.task_id,
        arg_is_out_of_plan: query.is_out_of_plan,
      }
      let personInfo = yield call(trainService.trainClassApplyPersons, personParams);
      if (personInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personsList: personInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      }

      // //查询附件列表
      // let fileQueryparams = {
      //   arg_proc_inst_id: query.proc_inst_id,
      // };
      // let fileData = yield call(trainService.trainClassFileListQuery, fileQueryparams);
      // //console.log(fileData);
      // if (fileData.RetCode === '1') {
      //   yield put({
      //     type: 'save',
      //     payload: {
      //       fileDataList: fileData.DataRows,
      //     }
      //   })
      // }

      //查询附件列表
      let fileQueryparams1 = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_type: '0',
      };
      let fileData = yield call(trainService.trainClassFileListQuery, fileQueryparams1);
      if (fileData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataListCheck: fileData.DataRows,
          }
        })
      }

      //查询执行附件列表
      let fileQueryparams2 = {
        arg_proc_inst_id: query.proc_inst_id,
        arg_type: '1',
      };
      let fileData1 = yield call(trainService.trainClassFileListQuery, fileQueryparams2);
      if (fileData1.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataListExec: fileData1.DataRows,
          }
        })
      }

    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        /* 外训--外派培训 培训申请 */
        if (pathname === '/humanApp/train/train_index/create_train_apply') {
          dispatch({ type: 'initQuery', query });
        }

        if (pathname === '/humanApp/train/train_index/train_apply_look') {
          dispatch({ type: 'TrainApplyLook', query });
        }

        if (pathname === '/humanApp/train/train_do/train_apply_look') {
          dispatch({ type: 'TrainApplyLook', query });
        }
        /* 内训-自有内训师 培训申请 */
        if (pathname === '/humanApp/train/train_index/create_internal_own_teacher') {
          dispatch({ type: 'initInternalOwnTeacherQuery', query });
        }
        /* 内训-参加集团及系统内培训 培训申请 */
        if (pathname === '/humanApp/train/train_index/create_internal_ingroup_insystem_apply') {
          dispatch({ type: 'initInternalIngroupInsystemQuery', query });
        }
        /* 内训-外请讲师 培训申请 */
        if (pathname === '/humanApp/train/train_index/create_internal_external_teacher') {
          dispatch({ type: 'initInternalExternalTeacherQuery', query });
        }
        /* 培训班申请 */
        if (pathname === '/humanApp/train/train_index/create_train_course_apply') {
          dispatch({ type: 'initInternalTrainCourseApplyQuery', query });
        }
      });
    }
  }
};
