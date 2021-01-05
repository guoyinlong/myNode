/**
 * 作者：任华维
 * 日期：2017-09-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：待办功能
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import Cookie from 'js-cookie';
import {message} from 'antd';
import config from '../../../utils/config';
import {routerRedux} from 'dva/router';
import {propertySort} from '../../../utils/func';

function isInArray(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

export default {
    namespace: 'task',
    state: {
        projUuid: '',
        queryData: {},
        modalVisible: false,
        taskList: [],
        userid: localStorage.getItem('userid'),
        username: localStorage.getItem('fullName'),
        userStatus: localStorage.getItem('username'),
        taskDetail: {},
        pms_list: [],
        headInfo: {},
        taskMilestone: [],
        taskLog: [],
       /* taskDept: [],
        taskAllDept: [],
        taskBudget: [],*/

        taskAttachment: [],
        isShowAllTab: '-1',
        isUserOwner: '1',
        isChecked: '1',
        taskUuid: '',
        taskBatchid: '',
        taskWfBatchid: '',
        checkId: '',
        flag: '',
        createId: '',
        createName: '',
        activeKey: '1',               //tab的key
        isUserFinance: '0',

        /*以下为全成本数据*/
        predictTimeTotal: '',
        fullCostPmsTab: {},        //显示高亮的pms的tab数据
        fullCostShowPmsTab: '0',   //是否显示PMS的tab组件
        fullCostPmsListData: [],   //pms的tab总数据
        coorpDeptList: [],         //配合部门列表
        allDeptList: [],           //所有部门列表，第一个为主责部门
        deptBudgetList: [],        //返回的部门预算数据
        deptBudgetListOriginal: [],
        deptBudgetTableData: [],   //部门预算信息表格数据

        meetingWait:[],//会议待办列表
        meetingDone:[],//会议已办列表
        meetingFinish:[],//会议办结列表

        // 待办个数
        unDoListCount: 0,
        // 未读消息个数
        unReadListCount: 0,
        // 未读消息个数
        draftListCount: 0
    },

    reducers: {

        tabChange(state, {payload}) {
            return {
                ...state,
                activeKey: payload,
            };
        },
        taskListQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskList: payload,
            };
        },
        taskDetailInfo(state, {payload}) {
            return {
                ...state,
                taskUuid: payload.arg_task_uuid,
                taskBatchid: payload.arg_task_batchid,
                taskWfBatchid: payload.arg_task_wf_batchid,
                checkId: payload.arg_check_id,
                flag: payload.arg_flag,
            };
        },
        taskHeadInfoSuccess(state, {payload}) {
            return {
                ...state,
                headInfo: payload
            };
        },
        taskDetailQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskDetail: payload
            };
        },
        taskMilestoneQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskMilestone: payload
            };
        },
        taskLogQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskLog: payload
            };
        },
        /*taskDeptQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskDept: payload
            };
        },*/
        /*taskAllDeptQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskAllDept: payload
            };
        },*/
        taskBudgetQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        taskAttachmentQuerySuccess(state, {payload}) {
            return {
                ...state,
                taskAttachment: payload
            };
        },
        taskShowModal(state) {
            return {
                ...state,
                modalVisible: true
            };
        },
        taskHideModal(state) {
            return {
                ...state,
                modalVisible: false
            };
        },
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
    effects: {
      * init({}, {call, put}) {
          yield put({
            type:'taskListQuery',

          });
      },
     /* * myWait({}, {call, put, select}){
          debugger;
          const response = yield call(commonAppService.myWait);
          if (response.RetCode === '1'){
            console.log(response);
          }
      },*/
        //用户身份查询，内部or外协
        * getUserId({payload}, {call, put, select}) {
            /*console.log(payload);*/
            yield put({
                type: 'save',
                payload: {
                    taskList: []
                }
            });
            const userStatus = yield select(state => state.task.userStatus);
            const res = yield call(commonAppService.p_if_isout, {arg_username: userStatus});
            if (res.RetCode === '1') {
                yield put({
                    type: payload,
                    payload: res.DataRows[0].userid
                });
            }
        },
        // 查询待办列表
        * taskListQuery({payload}, {call, put, select}) {
            const [timeSheetRes, fundingPlanRes, taskListRes, teamManageRes, partnerRes, roleRes,meetingMyWait,mySealWait,newsList] = yield [
                call(commonAppService.backlogQuery, {arg_userid: localStorage.userid}),
                call(commonAppService.fundingPlanQuery, {arg_user_id: payload}),
                call(commonAppService.taskListQuery, {arg_task_staff_id_to: payload}),
                call(commonAppService.projSearchTeam, {staffId: payload,queryType:'0'}),
                call(commonAppService.p_service_confirm_task_search, {arg_userid: payload}),
                call(commonAppService.p_purchase_getroles, {arg_user_id: payload}),
                call(commonAppService.myMeetingWait, {arg_user_id :Cookie.get('userid')}),   //待办会议显示列表查询
                call(commonAppService.mySealWait, {arg_user_id :Cookie.get('userid')}),//arg_user_id:Cookie.get('userid')
                call(commonAppService.showTodoApprovalList, {user_id:Cookie.get('userid'), page_size:"10",page_current:"1",flag:"0"}),
            ];
       /*   debugger;*/
            if (timeSheetRes.RetCode === '1' && taskListRes.RetCode === '1'
              && teamManageRes.retCode === '1' && fundingPlanRes.RetCode === '1'
              && partnerRes.RetCode === '1' && roleRes.RetCode === '1'&& meetingMyWait.RetCode === '1'&& mySealWait.RetCode === '1'
              && newsList.retCode == "1") {
                //按时间排序
              newsList.dataRows.pageItems.map((item, index) => {
                item.sortDate = item.createTime.slice(0,19);
                item.key=index;
                item.type = '1';
              });
              mySealWait.DataRows.map((item, index) => {
                item.sortDate = item.update_date.slice(0,19);
                item.key=index;
                item.type = '1';
              });
                meetingMyWait.DataRows.map((item, index) => {
                  item.sortDate = item.update_date.slice(0,19);
                  item.key=index;
                  item.type = '1';
                });
                timeSheetRes.DataRows.map((item, index) => {
                    item.sortDate = item.mess_date_show;
                    item.task_id = item.proj_code + index;
                });
                fundingPlanRes.DataRows.map((item, index) => {
                    item.sortDate = item.messDateShow;
                    item.task_id = item.teamId + index;
                });

                taskListRes.DataRows.map((item, index) => {
                    item.sortDate = item.task_date_show;
                    if (item.task_param && item.task_content) {
                        item.task_param = JSON.parse(item.task_param);
                        item.task_content = JSON.parse(item.task_content);
                    }
                });
                teamManageRes.dataRows.map((item, index) => {
                    item.task_content = {
                        'create_byname': item.createByName,
                        'create_byid': item.createBy,
                        'tag': (item.previousProcessState === '3' || item.previousProcessState === '6' ?
                          '3' : item.previousProcessState),
                        'content': (item.proj && item.proj.projName) ? item.proj.projName : ""
                    }
                    item.task_id = item.changeId;
                    item.task_proj_sub_show = '团队管理';
                    item.task_staff_name_from = item.staffIdName || "";
                    item.task_type = '999';//团队管理
                    item.task_status = item.handleId === '2' ? '3' : item.handleId;
                    item.sortDate = item.createTime;
                    item.queryType= '0'
                });

                partnerRes.DataRows.map((item, index) => {
                    item.task_content = {
                        'create_byname': item.mgr_name,
                        'create_byid': item.create_by,
                        'tag': roleRes.RetNum === '2' ? '3' : item.state,
                        'content': item.proj_name
                    }
                    item.task_id = item.batchid;
                    item.task_proj_sub_show = item.proj_type;
                    item.task_staff_name_from = item.create_by_name;
                    item.task_type = '998';//合作伙伴
                    item.task_status = '0';
                    item.sortDate = item.create_time;
                });
                const data = [...taskListRes.DataRows, ...timeSheetRes.DataRows,
                  ...teamManageRes.dataRows, ...fundingPlanRes.DataRows,
                  ...partnerRes.DataRows, ...meetingMyWait.DataRows,...mySealWait.DataRows,
                  ...newsList.dataRows.pageItems,];
                if (data.length) {
                    data.sort(propertySort(data, 'sortDate', true));
                }
                yield put({
                    type: 'taskListQuerySuccess',
                    payload: data
                });
                // 待办个数
                yield put({
                  type: 'save',
                  payload: {
                    unDoListCount: data.length
                  }
                })
                window.localStorage.setItem('undoList', data.length);
                let postData={
                  arg_mess_staff_id_to: Cookie.get('userid'),
                  arg_page_size: 10,
                  arg_page_current: 1,
                  arg_mess_staff_name_from: ''
                }
                const { unread_count } = yield call(commonAppService.messageQuery, postData);
                // 待办个数
                yield put({
                  type: 'save',
                  payload: {
                    unReadListCount: unread_count
                  }
                })
            }
        },
        // 查询已办列表
        * taskingListQuery({payload}, {call, put, select}) {
            const [taskListRes, teamManageRes, partnerRes,meetingListDoneRes,mySealCompleteRes] = yield [
                call(commonAppService.taskingListQuery, {arg_task_staff_id_to: payload}),
                call(commonAppService.projSearchTeam, {staffId: payload,queryType:'1'}),
                call(commonAppService.p_service_confirm_task_searchhandled, {arg_userid: payload}),
                call(commonAppService.myMeetingDone, {arg_user_id :Cookie.get('userid')}),   //已办会议显示列表查询
                call(commonAppService.mySealComplete, {arg_user_id :Cookie.get('userid')}),   //已办会议显示列表查询
            ]
            if (taskListRes.RetCode === '1' && teamManageRes.retCode === '1' && partnerRes.RetCode === '1' && meetingListDoneRes.RetCode ==='1' && mySealCompleteRes.RetCode ==='1') {
                mySealCompleteRes.DataRows.map((item,index)=>{
                    item.sortDate = item.update_date.slice(0,19);
                    item.type = '2';
                  })

                /*console.log(meetingListDoneRes.DataRows);*/
              meetingListDoneRes.DataRows.map((item,index)=>{
                item.sortDate = item.update_date.slice(0,19);
                item.type = '2';
              })
              taskListRes.DataRows.map((item, index) => {
                    item.sortDate = item.task_date_show;
                    item.task_param = JSON.parse(item.task_param);
                    item.task_content = JSON.parse(item.task_content);
                })
                teamManageRes.dataRows.map((item, index) => {
                    item.task_content = {
                        'create_byname': item.createByName,
                        'create_byid': item.createBy,
                        'tag': item.previousProcessState,
                        'content': (item.proj && item.proj.projName) ? item.proj.projName : ""
                    }
                    item.task_id = item.changeId;
                    item.task_proj_sub_show = '团队管理';
                    item.task_staff_name_from = item.staffIdName || "";
                    item.task_type = '999';//团队管理
                    item.task_status = item.handleId === '2' ? '3' : item.handleId;
                    item.sortDate = item.createTime;
                    item.queryType= '1'
                })

                partnerRes.DataRows.map((item, index) => {
                    item.task_content = {
                        'create_byname': item.mgr_name,
                        'create_byid': item.create_by,
                        'tag': (item.state === '4' || item.state === '6' || item.state === '8' ? '3' : item.state),
                        'content': item.proj_name
                    }
                    item.task_id = item.batchid;
                    item.task_proj_sub_show = item.proj_type;
                    item.task_staff_name_from = item.create_by_name;
                    item.task_type = '998';//合作伙伴
                    item.task_status = '1';
                    item.sortDate = item.create_time;
                })
                const data = [...taskListRes.DataRows, ...teamManageRes.dataRows, ...partnerRes.DataRows, ...meetingListDoneRes.DataRows];
                if (data.length) {
                    data.sort(propertySort(data, 'sortDate', true));
                }
                yield put({
                    type: 'taskListQuerySuccess',
                    payload: data
                });
            }
        },
        // 查询办结列表
        * taskedListQuery({payload}, {call, put, select}) {
            const [taskListRes, teamManageRes, partnerRes, meetingListFinishRes,mySealDoneRes] = yield [
                call(commonAppService.taskedListQuery, {arg_task_staff_id_to: payload}),
                call(commonAppService.projSearchTeam, {staffId: payload,queryType:"2"}),
                call(commonAppService.p_service_confirm_task_searchend, {arg_userid: payload}),
                call(commonAppService.myMeetingFinish, {arg_user_id :Cookie.get('userid')}),   //办结会议显示列表查询
                call(commonAppService.mySealDone, {arg_user_id :Cookie.get('userid')}),   //办结会议显示列表查询
            ]
            if (taskListRes.RetCode === '1' && teamManageRes.retCode === '1' && partnerRes.RetCode === '1' && meetingListFinishRes.RetCode === '1'&& mySealDoneRes.RetCode === '1') {

                mySealDoneRes.DataRows.map((item)=>{
                    item.sortDate = item.update_date.slice(0,19);
                    item.type ='3'
                  })
                /*  console.log(meetingListFinishRes.DataRows);*/
                meetingListFinishRes.DataRows.map((item)=>{
                  item.sortDate = item.update_date.slice(0,19);
                  item.type ='3'
                })
                taskListRes.DataRows.map((item, index) => {
                    item.sortDate = item.task_date_show;
                    item.task_param = JSON.parse(item.task_param);
                    item.task_content = JSON.parse(item.task_content);
                })
                teamManageRes.dataRows.map((item, index) => {
                    item.task_content = {
                        'create_byname': item.createByName,
                        'create_byid': item.createBy,
                        'tag': item.previousProcessState,
                        'content': (item.proj && item.proj.projName) ? item.proj.projName : ""
                    }
                    item.task_id = item.changeId;
                    item.task_proj_sub_show = '团队管理';
                    item.task_staff_name_from = item.staffIdName || "";
                    item.task_type = '999';//团队管理
                    item.task_status = item.handleId === '2' ? '3' : item.handleId;
                    item.sortDate = item.createTime;
                    item.queryType= '2'
                })

                partnerRes.DataRows.map((item, index) => {
                    item.task_content = {
                        'create_byname': item.mgr_name,
                        'create_byid': item.create_by,
                        'tag': (item.state === '4' || item.state === '6' || item.state === '8' ? '3' : item.state),
                        'content': item.proj_name
                    }
                    item.task_id = item.batchid;
                    item.task_proj_sub_show = item.proj_type;
                    item.task_staff_name_from = item.create_by_name;
                    item.task_type = '998';//合作伙伴
                    item.task_status = '3';
                    item.sortDate = item.create_time;
                })
                const data = [...taskListRes.DataRows, ...teamManageRes.dataRows, ...partnerRes.DataRows, ...meetingListFinishRes.DataRows];
                if (data.length) {
                    data.sort(propertySort(data, 'sortDate', true));
                }
                console.log(data);
                yield put({
                    type: 'taskListQuerySuccess',
                    payload: data
                });
            }
        },
        // 跳转待办详情页
        * taskDetailPage({payload}, {call, put}) {
            yield put(routerRedux.push({pathname: '/taskDetail', query: payload}));
        },
        // 跳转待办详情页
        * taskASPage({payload}, {call, put}) {
            yield put(routerRedux.push({pathname: '/taskAS', query: payload}));
        },

        // 跳转待办详情页
        * taskTeamManagePage({payload}, {call, put}) {
            yield put(routerRedux.push({pathname: '/taskTeamManage', query: payload}));
        },
        // 跳转合作伙伴待办详情页
        * taskPartnerPage({payload}, {call, put}) {
            yield put(routerRedux.push({pathname: '/taskPartner', query: payload}));
        },
        //跳转到项目变更的详情页( 先判断待办中的项目变更是否被审核过，如果没被审核过，跳转到详情页，如果被审核过，返回列表页)
        * changeCheck({payload}, {put, call}) {
            if (payload.arg_handle_flag === 0) {
                const data = yield call(commonAppService.taskIsChecked, {
                    arg_task_id: payload.arg_task_id,
                    arg_task_uuid: payload.arg_task_uuid
                });
                if (data.RetCode === '1') {
                    if (data.RetNum === '1') {
                        yield put(routerRedux.push({pathname: '/projChangeCheck', query: payload}));
                    } else {
                        yield put(routerRedux.push({pathname: '/taskList'}));
                        message.error('项目变更已经被审核！');
                    }
                }
            } else {
                yield put(routerRedux.push({pathname: '/projChangeCheck', query: payload}));
            }
        },
        //跳转到交付物管理的详情页
        * deliverableCheck({payload}, {put, call}) {
            if (payload.arg_handle_flag === '0') {
                const data = yield call(commonAppService.taskIsChecked, {
                    arg_task_id: payload.arg_task_id,
                    arg_task_uuid: payload.arg_task_uuid
                });
                if (data.RetCode === '1') {
                    if (data.RetNum === '1') {
                        yield put(routerRedux.push({pathname: '/deliverableManage', query: payload}));
                    } else {
                        yield put(routerRedux.push({pathname: '/taskList'}));
                        message.error('交付物变更已经被审核！');
                    }
                }
            } else {
                yield put(routerRedux.push({pathname: '/deliverableManage', query: payload}));
            }
        },

        //跳转到 审核TMO修改全成本详情页
        * modifyFullcostCheck({payload}, {put, call}) {
            if (payload.arg_handle_flag === 0) {
                const data = yield call(commonAppService.taskIsChecked, {
                    arg_task_id: payload.arg_task_id,
                    arg_task_uuid: payload.arg_task_uuid
                });
                if (data.RetCode === '1') {
                    if (data.RetNum === '1') {
                        yield put(routerRedux.push({pathname: '/projFullcostView', query: payload}));
                    } else {
                        yield put(routerRedux.push({pathname: '/taskList'}));
                        message.error('TMO修改全成本已经被审核！');
                    }
                }
            } else {
                yield put(routerRedux.push({pathname: '/projFullcostView', query: payload}));
            }
        },

        // 跳转待办详情页
        * taskUpdatePage({payload}, {call, put}) {
            yield put(routerRedux.push({pathname: '/taskUpdate', query: payload}));
        },
        //第一步，RetNum为1时表示未审核,进详细列表；RetNum为0时表示已被审核
        * taskIsChecked({payload}, {call, put, select}) {
            const taskState = yield select(state => state.task);
            if (payload.arg_flag === '1' || payload.arg_flag === '3') {
                taskState.isChecked = '0';
                yield put({
                    type: 'taskIsShowAllTab',
                    payload: {arg_check_id: payload.arg_check_id, arg_flag: payload.arg_flag}
                });
                yield put({
                    type: 'taskDetailInfo',
                    payload: {
                        arg_flag: payload.arg_flag,
                        arg_check_id: payload.arg_check_id,
                        arg_task_uuid: payload.arg_task_uuid,
                        arg_task_batchid: payload.arg_task_batchid,
                        arg_task_wf_batchid: payload.arg_task_wf_batchid
                    }
                });
            } else {
                const res = yield call(commonAppService.taskIsChecked, {arg_task_id: payload.arg_task_id});
                if (res.RetCode === '1') {
                    taskState.isChecked = res.RetNum;
                    if ((res.RetNum === '1')) {
                        yield put({
                            type: 'taskIsShowAllTab',
                            payload: {arg_check_id: payload.arg_check_id, arg_flag: payload.arg_flag}
                        });
                        yield put({
                            type: 'taskDetailInfo',
                            payload: {
                                arg_flag: payload.arg_flag,
                                arg_check_id: payload.arg_check_id,
                                arg_task_uuid: payload.arg_task_uuid,
                                arg_task_batchid: payload.arg_task_batchid,
                                arg_task_wf_batchid: payload.arg_task_wf_batchid
                            }
                        });

                    } else {
                        yield put(routerRedux.push({pathname: '/taskList'}));
                    }
                }
            }
        },
        //第一步半,获取上一环节和最新checkId
        * taskHeadInfo({payload}, {call, put, select}) {
            const taskState = yield select(state => state.task);
            const res = yield call(commonAppService.getHeadInfo, {
                arg_check_id: payload.arg_check_id,
                arg_check_detail_flag: taskState.taskUuid ? 0 : 1
            });
            if (res.RetCode === '1') {
                yield put({
                    type: 'taskHeadInfoSuccess',
                    payload: res.DataRows[0]
                });
                yield put({
                    type: 'taskDetailQuery',
                    payload: {
                        ...payload,
                        arg_check_id: res.DataRows[0].last_check_id
                    }
                });
            }
        },
        //第二步,如返回-1则项目信息的四个tab页均显示，如果为1，则只显示全成本tab页
        * taskIsShowAllTab({payload}, {call, put, select}) {
            const res = yield call(commonAppService.taskIsShowAllTab, {arg_check_id: payload.arg_check_id});
            if (res.RetCode === '1') {
                const taskState = yield select(state => state.task);
                taskState.isShowAllTab = res.TMOchecked;
                //taskState.activeKey = res.TMOchecked == -1 ? '1' : '3';
                yield put({
                    type: 'taskCheckUserFinance',
                    payload: {
                        arg_check_id: payload.arg_check_id,
                        arg_flag: payload.arg_flag,
                        arg_userid: taskState.userid
                    }
                });
            }
        },
        //第三步，1表示当前角色是起草人，0表示当前角色不是
        * taskCheckUserRole({payload}, {call, put, select}) {
            const res = yield call(commonAppService.taskCheckUserRole, payload);
            if (res.RetCode === '1') {
                const taskState = yield select(state => state.task);
                taskState.isUserOwner = res.role_flag;
                taskState.createId = res.create_byid;
                taskState.createName = res.create_byname;
                yield put({
                    type: 'taskDetailBase',
                    payload: {
                        arg_check_id: payload.arg_check_id,
                        arg_flag: payload.arg_flag
                    }
                });
            }
        },
        //第二步半，返回值"financeFlag":"0"不是财务，1是财务
        * taskCheckUserFinance({payload}, {call, put, select}) {
            const res = yield call(commonAppService.taskCheckUserFinance, payload);
            if (res.RetCode === '1') {
                const taskState = yield select(state => state.task);
                taskState.isUserFinance = res.financeFlag;
                taskState.activeKey = (taskState.flag == '1' || taskState.flag == '3')
                    ?
                    '1'
                    :
                    (  taskState.isShowAllTab == '-1' ? '1' : '3');
                yield put({
                    type: 'taskCheckUserRole',
                    payload: {
                        arg_check_id: payload.arg_check_id,
                        arg_flag: payload.arg_flag,
                        arg_userid: taskState.userid
                    }
                });
            }
        },
        //第四步，获取详情基本信息
        * taskDetailQuery({payload}, {call, put}) {
            //此处的 queryData 包含了 url 传参，以及手动添加的  arg_proj_uid
            yield put({
                type: 'save',
                payload: {
                    queryData: payload,
                    //activeKey: '1',              //同时显示基本信息tab
                }
            });

            //查询 项目基本信息
            const detailRes = yield call(commonAppService.taskDetailQuery, payload);
            if (detailRes.RetCode === '1') {
                if ('replace_money' in detailRes.DataRows[0]) {
                    detailRes.DataRows[0].replace_money = Number((Number(detailRes.DataRows[0].replace_money) / 10000).toFixed(6));
                }
                //添加Pms字段
                if (detailRes.pms_list === undefined || detailRes.pms_list === 'NaN') {
                    detailRes.pms_list = [];
                } else {
                    let pms_list = JSON.parse(detailRes.pms_list);
                    pms_list.forEach((item,index)=>{
                        if (item.pms_stage_num === 'NaN') {
                            item.pms_stage_num = '0';
                        }
                        item.opt_type = 'search';
                        item.key = index;
                    });
                    detailRes.pms_list = pms_list;
                }
                yield put({
                    type: 'save',
                    payload: {
                        taskDetail: detailRes.DataRows[0],
                        pms_list: detailRes.pms_list,
                    }
                });
                /*yield put({
                    type: 'taskDetailQuerySuccess',
                    payload: detailRes.DataRows[0]
                });*/
            }

            //查询 项目里程碑
            const milestoneRes = yield call(commonAppService.taskMilestoneQuery, payload);
            if (milestoneRes.RetCode === '1') {
                yield put({
                    type: 'taskMilestoneQuerySuccess',
                    payload: milestoneRes.DataRows
                });
            }

            //查询 全成本PMS列表

            let pmsListPostData = {
                arg_proj_uid: payload.arg_proj_uid,         //项目id，必传
                arg_check_id: payload.arg_check_id,
                arg_flag: payload.arg_flag,
                //arg_flag：查询标志，待定
                //arg_userid: Cookie.get('userid'),       //登录用id，必传
            };
            const pmsListData = yield call(commonAppService.getFullCostPmsData, pmsListPostData);
            let fullCostPmsTab = {
                pms_code: '',
                tab_name: '',
                tab_flag: '0',
                tabConvertName:'',
            };
            if (pmsListData.RetCode === '1') {
                if (pmsListData.DataRows.length) {
                    pmsListData.DataRows.forEach((item,index)=>{
                        item.tabConvertName =  item.tab_name;
                        if (item.tab_flag === '1') {
                            item.tabConvertName = 'PMS' + index + '预算';
                        }
                    });
                    fullCostPmsTab = {...pmsListData.DataRows[0]};
                }
                yield put({
                    type: 'save',
                    payload: {
                        fullCostPmsTab: fullCostPmsTab,
                        fullCostShowPmsTab: pmsListData.isShowTab,
                        fullCostPmsListData: pmsListData.DataRows,
                    }
                });
                yield put({
                    type:'searchProjFullcost'
                });
            } else if (pmsListData.RetCode === '-1') {
                message.error(pmsListData.RetVal);
            }

           /* //查询 项目全成本  配合部门
            const deptRes = yield call(commonAppService.taskDeptQuery, payload);
            if (deptRes.RetCode === '1') {
                deptRes.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.key = index;
                    } else {
                        i.key = index;
                        i.mgr_name = '';
                    }
                    return i;
                });
                yield put({
                    type: 'taskDeptQuerySuccess',
                    payload: deptRes.DataRows
                });
            }*/

            /*//查询 项目全成本  所有部门
            const allDeptRes = yield call(commonAppService.taskAllDeptQuery, payload);
            if (allDeptRes.RetCode === '1') {
                yield put({
                    type: 'taskAllDeptQuerySuccess',
                    payload: allDeptRes.DataRows
                });
            }*/

            /*//查询 项目全成本  预算数据
            const budgetRes = yield call(commonAppService.taskBudgetQuery, payload);
            if (budgetRes.RetCode === '1') {
                const allDeptList = allDeptRes.DataRows;
                const deptBudgetList = budgetRes.DataRows;
                const projectDetail = detailRes.DataRows[0];


            }*/

            //查询 项目附件
            const attachmentRes = yield call(commonAppService.taskAttachmentQuery, payload);
            if (attachmentRes.RetCode === '1') {
                if (attachmentRes.DataRows.length && attachmentRes.DataRows[0].file_list) {
                    yield put({
                        type: 'taskAttachmentQuerySuccess',
                        payload: JSON.parse(attachmentRes.DataRows[0].file_list)
                    });
                } else {
                    yield put({
                        type: 'taskAttachmentQuerySuccess',
                        payload: []
                    });
                }
            }

            //查询审批历史
            const logRes = yield call(commonAppService.taskLogQuery, {
                arg_check_id: payload.arg_check_id,
                arg_flag: payload.arg_flag
            });
            if (logRes.RetCode === '1') {
                yield put({
                    type: 'taskLogQuerySuccess',
                    payload: logRes.DataRows
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：已立项项目的全成本
         */
        *searchProjFullcost({}, {call, put, select}) {
            const { taskDetail,queryData, fullCostPmsTab } = yield select(state => state.task);

            let allDeptPostData = {
                arg_flag: queryData.arg_flag,
                arg_check_id: queryData.arg_check_id,
                //arg_proj_id: queryData.proj_id,         //项目id，必传
                arg_tenantid: Cookie.get("tenantid"),     //部门归属标志10010
                //arg_userid: Cookie.get('userid'),       //登录用id，必传
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            //if (fullCostPmsTab.tab_flag === '1') {}
            const allDeptData = yield call(commonAppService.taskAllDeptQuery, allDeptPostData);

            //查询配合部门列表
            let coorpDeptPostData = {
                arg_flag: queryData.arg_flag,
                arg_check_id: queryData.arg_check_id,
                //arg_proj_id: queryData.proj_id,
                //arg_tag: '2', /*2代表已立项项目*/
                //arg_tenantid: Cookie.get("tenantid"),     //部门归属标志10010
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            const coorpDeptData = yield call(commonAppService.taskDeptQuery, coorpDeptPostData);
            if (coorpDeptData.RetCode === '1') {
                coorpDeptData.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.key = index;           //为没一条记录添加一个 key
                    } else {
                        i.key = index;
                        i.mgr_name = '';       //配合部门没有字段时，设置为空
                    }
                    return i;
                });
            }
            //查询每个部门的预算
            let budgetPostData = {
                arg_flag: queryData.arg_flag,
                arg_check_id: queryData.arg_check_id,
                //arg_proj_id: queryData.proj_id,
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
                //arg_pms_uid: fullCostPmsTab.pms_uid,
            };
            const deptBudgetData = yield call(commonAppService.taskBudgetQuery, budgetPostData);
            yield put({
                type: 'save',
                payload: {
                    coorpDeptList: coorpDeptData.DataRows,
                    allDeptList: allDeptData.DataRows
                }
            });
            let allDeptList = allDeptData.DataRows;
            let deptBudgetList = deptBudgetData.DataRows;


            //确定返回的预算中的年份
            let yearList = [];
            //年的索引，先从开始时间的年份开始算起
            let yearIndex = parseInt(taskDetail.begin_time.split('-')[0]);
            //将结束时间作为结束标志
            let yearEndTagIndex = parseInt(taskDetail.end_time.split('-')[0]);
            //如果年份索引不超过开始年份，进行添加
            while (yearIndex <= yearEndTagIndex) {
                yearList.push(yearIndex.toString());
                yearIndex++;
            }
            yearList = yearList.sort();   //年份需要排序

            //计算所有工时之和
            let predictTimeTotal = 0;
            for (let indexp = 0; indexp < deptBudgetList.length; indexp++) {
                if (deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1') {
                    predictTimeTotal += Number(deptBudgetList[indexp].fee);
                }
            }
            yield put({
                type: 'save',
                payload: {predictTimeTotal: predictTimeTotal.toFixed(1)}
            });
            //查询每一个年份下的费用类型个数，首先要确定三级目录的个数
            let yearListRowSpan = {};
            //yearListRowSpan = {2016:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx(采购)费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy（实施）费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                   2017:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                  }
            if (yearList.length) {
                //计算年份的rowspan
                for (let yearIndex = 0; yearIndex < yearList.length; yearIndex++) {
                    //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
                    let yearRowSpan = 0;
                    let purchaseCostList = [];   //项目采购成本列表
                    let operateCostList = [];    //项目运行成本列表
                    let carryOutCostList = [];   //项目实施成本列表
                    for (let cellDataIndex1 = 0; cellDataIndex1 < deptBudgetList.length; cellDataIndex1++) {
                        //先判断年
                        if (yearList[yearIndex] === deptBudgetList[cellDataIndex1].year) {
                            //判断是否为直接成本，即fee_type = 1
                            if (deptBudgetList[cellDataIndex1].fee_type === '1') {
                                //判断是不是属于直接成本中的采购成本、运行成本或者实施成本，即fee_subtype = 0 ，3 或者 1
                                if (deptBudgetList[cellDataIndex1].fee_subtype === '0') {
                                    //如果不在列表里面才添加
                                    if (!isInArray(purchaseCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        purchaseCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                } else if (deptBudgetList[cellDataIndex1].fee_subtype === '3') {
                                    if (!isInArray(operateCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        operateCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                } else if (deptBudgetList[cellDataIndex1].fee_subtype === '1') {
                                    if (!isInArray(carryOutCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        carryOutCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                }
                            }
                        }
                    } //end for
                    let purchaseDeptTotal = [];  //每个部门的所有xxxx费用之和的列表
                    let operateDeptTotal = [];   //每个部门的所有zzzz费用之和的列表
                    let carryOutDeptTotal = [];  //每个部门的所有yyyy费用之和的列表
                    let humanCostTotal = [];          //项目人工成本列表（每个部门）
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0;
                        let operateDeptValue = 0;
                        let carryOutDeptValue = 0;
                        let humanCostValue = 0;
                        for (let cellDataIndexx = 0; cellDataIndexx < deptBudgetList.length; cellDataIndexx++) {
                            //首先判断单元格中的年份
                            if (yearList[yearIndex] === deptBudgetList[cellDataIndexx].year &&
                                allDeptList[deptIndexx].dept_name === deptBudgetList[cellDataIndexx].dept_name) {
                                //判断是否为直接成本，即fee_type = 1
                                if (deptBudgetList[cellDataIndexx].fee_type === '1') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '0') {
                                        //判断是不是属于直接成本中的采购成本，即fee_subtype = 0
                                        purchaseDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '3') {
                                        //判断是不是属于直接成本中的运行成本，即fee_subtype = 3
                                        operateDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '1') {
                                        //判断是不是属于直接成本中的实施成本，即fee_subtype = 1
                                        carryOutDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '2') {
                                        //判断是不是属于直接成本中的人工成本，即fee_subtype =2
                                        humanCostValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    }
                                }
                            }
                        }
                        purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
                        operateDeptTotal.push(operateDeptValue.toFixed(2));
                        carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
                        humanCostTotal.push(humanCostValue.toFixed(2));
                    }
                    yearRowSpan = purchaseCostList.length + operateCostList.length + carryOutCostList.length + 6;
                    yearListRowSpan[yearList[yearIndex]] = {
                        yearRowSpan: yearRowSpan,
                        purchaseCostList: purchaseCostList,
                        purchaseDeptTotal: purchaseDeptTotal,
                        operateCostList: operateCostList,
                        operateDeptTotal: operateDeptTotal,
                        carryOutCostList: carryOutCostList,
                        carryOutDeptTotal: carryOutDeptTotal,
                        humanCostTotal: humanCostTotal
                    };
                }//end for year
            }

            /*将返回的预算数据转变成表格数据
            * */
            let deptBudgetTableData = [];
            let obj = {};
            let allTableTotal = 0;
            if (yearList.length) {
                for (let yearIndex2 = 0; yearIndex2 < yearList.length; yearIndex2++) {
                    obj = {};
                    //每一年的每一个费用项，要添加所有部门的数据
                    //1.添加预计工时 fee_type =0 , fee_subtype = -1
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
                    obj.fee_name = config.PREDICT_TIME;
                    obj.padLeft = '0px';
                    obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
                    let predictTime = 0;
                    for (let i = 0; i < allDeptList.length; i++) {
                        let findPredictTime = false;
                        for (let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++) {
                            //年相同就添加一条数据
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year) {
                                if (deptBudgetList[cellDataIndex2].fee_type === '0' &&
                                    deptBudgetList[cellDataIndex2].fee_subtype === '-1') {
                                    if (allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name) {
                                        obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                                        predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                                        findPredictTime = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        //如果没有这种类型的数据，数据源加一条
                        if (findPredictTime === false) {
                            //如果查询出来的没有预计工时，则新增0
                            obj['dept' + i.toString()] = '0.0';
                        }
                    }//end for
                    obj.total = predictTime.toFixed(1);
                    deptBudgetTableData.push(obj);
                    //添加预计工时end

                    //2.添加直接成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.DIRECT_COST;
                    obj.padLeft = '0px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let directCostTotal = 0;
                    for (let j = 0; j < allDeptList.length; j++) {
                        let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
                        directCostTotal += directCost;
                        obj['dept' + j.toString()] = directCost.toFixed(2);
                    }//end for
                    obj.total = directCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1添加项目采购成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.PURCHASE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let purchaseAllTotal = 0;
                    for (let k = 0; k < allDeptList.length; k++) {
                        obj['dept' + k.toString()] = yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k];
                        purchaseAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k]);
                    }//end for
                    obj.total = purchaseAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1. 添加项目采购成本-子费用
                    let purchaseCostTypeList = yearListRowSpan[yearList[yearIndex2]].purchaseCostList;
                    for (let purchaseIndex = 0; purchaseIndex < purchaseCostTypeList.length; purchaseIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.1.' + (purchaseIndex + 1).toString() + purchaseCostTypeList[purchaseIndex];
                        obj.no_pre_fee_name = purchaseCostTypeList[purchaseIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let purchaseTotal = 0;
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findPurchase = false;
                            for (let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                                    purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex3].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex3].fee_subtype === '0') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name) {
                                            obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                                            purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                                            findPurchase = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findPurchase === false) {
                                obj['dept' + p.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = purchaseTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.2添加项目运行成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.OPERATE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let operateAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii];
                        operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii]);
                    }//end for
                    obj.total = operateAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.2. 添加项目运行成本-子费用
                    let operateCostTypeList = yearListRowSpan[yearList[yearIndex2]].operateCostList;
                    for (let operateIndex = 0; operateIndex < operateCostTypeList.length; operateIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.2.' + (operateIndex + 1).toString() + operateCostTypeList[operateIndex];
                        obj.no_pre_fee_name = operateCostTypeList[operateIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let operateTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findOperate = false;
                            for (let cellDataIndex44 = 0; cellDataIndex44 < deptBudgetList.length; cellDataIndex44++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex44].year &&
                                    operateCostTypeList[operateIndex] === deptBudgetList[cellDataIndex44].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex44].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex44].fee_subtype === '3') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex44].dept_name) {
                                            obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex44].fee).toFixed(2);
                                            operateTotal += Number(deptBudgetList[cellDataIndex44].fee);
                                            findOperate = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findOperate === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = operateTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }


                    //2.3添加项目实施成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.CARRYOUT_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let carryOutAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
                        carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
                    }//end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.3. 添加项目采购成本-子费用
                    let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
                    for (let carryOutIndex = 0; carryOutIndex < carryOutCostTypeList.length; carryOutIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.3.' + (carryOutIndex + 1).toString() + carryOutCostTypeList[carryOutIndex];
                        obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let carryOutTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findCarryOut = false;
                            for (let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                                    carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex4].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex4].fee_subtype === '1') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name) {
                                            obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                                            carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                                            findCarryOut = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findCarryOut === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = carryOutTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.4添加项目人工成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.HUMAN_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let humanCostTotal = 0;
                    for (let b = 0; b < allDeptList.length; b++) {
                        let findHumanCost = false;
                        for (let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++) {
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year) {
                                if (deptBudgetList[cellDataIndex5].fee_type === '1' &&
                                    deptBudgetList[cellDataIndex5].fee_subtype === '2') {
                                    if (allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name) {
                                        obj['dept' + b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                                        humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                                        findHumanCost = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        if (findHumanCost === false) {
                            obj['dept' + b.toString()] = '0.00';
                        }
                    }//end for
                    obj.total = humanCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);
                }//end for year

                //添加最后一行总计
                obj = {};
                obj.year = config.COST_ALL_TOTAL;
                obj.yearRowSpan = 1;
                obj.fee_name = '';
                obj.padLeft = '0px';
                obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                obj.yearOptType = 'total';
                for (let de = 0; de < allDeptList.length; de++) {
                    let allYearTotal = 0;
                    for (let yi = 0; yi < yearList.length; yi++) {
                        allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
                    }
                    obj['dept' + de.toString()] = allYearTotal.toFixed(2);
                    allTableTotal += allYearTotal;
                }//end for
                obj.total = allTableTotal.toFixed(2);
                deptBudgetTableData.push(obj);
            }
            //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
            for (let indexd = 0; indexd < deptBudgetTableData.length; indexd++) {
                deptBudgetTableData[indexd].key = indexd;
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetTableData: deptBudgetTableData
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-12-04
         * 功能：全成本tab中点击PMS
         * @param value 点中的tab的value
         */
        *fullCostPmsTabClick({value},{put,select}) {
            const { fullCostPmsListData } = yield select(state => state.task);
            let clickFullcostPmsTab = fullCostPmsListData.filter(item => item.tabConvertName === value);
            yield put({
                type: 'save',
                payload: {
                    fullCostPmsTab: clickFullcostPmsTab[0],
                }
            });
            yield put({
                type:'searchProjFullcost'
            });
        },
        //第五步，同意
        * taskApproval({payload}, {call, put, select}) {
            const res = yield call(commonAppService.taskApproval, payload);
            if (res.RetCode === '1') {
                yield put(routerRedux.push({pathname: '/taskList'}));
            }
        },
        //第六步，退回
        * taskReturn({payload}, {call, put, select}) {
            const res = yield call(commonAppService.taskReturn, payload);
            if (res.RetCode === '1') {
                if (res.RetVal === '' || res.RetVal === undefined) {
                    message.success('退回成功');
                } else {
                    message.success(res.RetVal);
                }
                yield put(routerRedux.push({pathname: '/taskList'}));
            }
        },
        //第七步，
        //第三步半，
        * taskDetailBase({payload}, {call, put}) {
            const res = yield call(commonAppService.taskDetailQuery, payload);
            if (res.RetCode === '1') {
                yield put({
                    type: 'taskHeadInfo',
                    payload: {...payload, arg_proj_uid: res.DataRows[0].proj_uid}
                });
                yield put({
                    type: 'save',
                    payload: {
                        projUuid: res.DataRows[0].proj_uid
                    }
                });
            }
        },
        // 跳转项目考核待办详情页
        *taskProKpiPage({param}, {call, put}) {
            const {RetCode, DataRows} = yield call(commonAppService.checkHisquery, {
                transjsonarray: '{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":' + param.check_batchid + '}}'
            });
            if (RetCode === '1') {
                if (DataRows[DataRows.length - 1].current_link_roleid === 'TMO') {
                    yield put(routerRedux.push({
                        pathname: '/tasProkKpiTMO',
                        query: param
                    }));
                } else {
                    yield put(routerRedux.push({
                        pathname: '/tasProkKpiDM',
                        query: param
                    }));
                }
            }

        },

    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname.indexOf('/taskList') !== -1) {
                    dispatch({
                        type: 'getUserId',
                        payload: 'taskListQuery'
                    });
                }
                if (pathname.indexOf('/taskDetail') !== -1) {
                    dispatch({
                        type: 'taskIsChecked',
                        payload: query
                    });
                }
            });
        },
    },
}
