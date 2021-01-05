/**
 * 作者：薛刚
 * 创建日期：2018-12-6
 * 邮箱：xueg@chinaunicom.cn
 * 文件说明：我的工作台组件
 */
import React from 'react';
import { Link } from 'dva/router';
import Cookie from 'js-cookie';
import { Menu, Dropdown, Button, Icon, Spin, Table } from 'antd';
import styles from './mainpageUl.css';
import { routerRedux } from 'dva/router';

class MyPlatform extends React.Component {

  handleMenuClick(i, tag) {
    const dispatch = this.props.action;
    if (tag == '0') {
      if (i['read_flag'] == '0') {
        // 设为已读
        dispatch({
          type: 'commonApp/messageReadFlag',
          formData: {
            'arg_staff_id': Cookie.get('userid'),
            'arg_mess_id': i.mess_id,
            'arg_page_size': 5,
            'arg_page_current': 1,
            'arg_mess_staff_name_from': ''
          }
        });
      } else {
        // 设为未读
        dispatch({
          type: 'commonApp/messageNotRead',
          formData: {
            'arg_staff_id': Cookie.get('userid'),
            'arg_mess_id': i.mess_id,
            'arg_page_size': 5,
            'arg_page_current': 1,
            'arg_mess_staff_name_from': ''
          }
        });
      }
    } else if (tag == '1') {
      // 删除消息
      dispatch({
        type: 'commonApp/messageDelete',
        formData: {
          'mess_status': '1',
          'mess_id': i.mess_id,
          'arg_page_size': 5,
          'arg_page_current': 1,
          'arg_mess_staff_name_from': ''
        }
      });
    }
  }

  handleMenuClickCirculationNotice(i) {
    const dispatch = this.props.action;
    // 设为已读
    dispatch({
      type: 'commonApp/messageReadFlagCirculationNotice',
      formData: {
        'arg_staff_id': Cookie.get('userid'),
        'arg_notice_id': i.notice_id,
      }
    });
  }

  getUndoContent = (record) => {
    let actionName = '';
    switch (record.task_type) {
      case '0':
        switch (record.task_proj_sub) {
          case '1':
            actionName += '创建项目';
            break;
          case '4':
            if (record.task_type == '0' && (record.task_content.module_type == undefined || record.task_content.module_type == '1')) {
              actionName += '变更项目';
            } else if (record.task_type == '0' && record.task_content.module_type == '0') {
              actionName += '上传交付物';
            }
            break;
          case '6':
            actionName += '修改全成本';
            break;
        }
        break;
      case '2':
        switch (record.task_proj_sub) {
          case '1':
            actionName += '提交项目';
            break;
        }
        break;
      case '999':
        actionName += '变更成员在';
        break;
      case '998':
        actionName += '提交了';
        break;
      case '9901':
        actionName += record.task_content;
        break;
      case '9902':
        actionName += record.task_content;
        break;
      case '9903':
        actionName += record.task_content;
        break;
      case '9904':
        actionName += record.task_content;
        break;
    }

    let taskName = '';
    switch (record.task_type) {
      case '0':
      case '999':
        if (record.hasOwnProperty('taskui_url')) {
          if (record.taskui_url === '/travelBudgetChangeReturn' || record.taskui_url === '/travelBudgetChangeReview') {
            taskName += '的差旅费预算变更';
          }
        }
        switch (record.task_status) {
          case '0':
            taskName += (record.task_content.tag === "3"
              ? '被' + record.task_staff_name_from + '退回，请修改' : record.task_content.tag === "6"
                ? '主动撤回，请重新提交' : '需要您审核');
            break;
          case '1':
            taskName += '正在审核中...';
            break;
          case '3':
            taskName += '审核完毕，正式启用了。';
            break;
          case '6':
            taskName += '已终止。';
            break;
        }
        break;
      case '2':
        switch (record.task_status) {
          case '0':
            taskName += (record.task_content.tag === "3" ||record.task_content.tag === "5"?
              '考核指标 被' + record.task_staff_name_from + '退回，请修改' : '考核指标 需要您审核');
            break;
          case '1':
            taskName += '考核指标 正在审核中...';
            break;
          case '3':
            taskName += '考核指标 审核完毕，正式启用了。';
            break;
        }
        break;
      case '998':
        switch (record.task_status) {
          case '0':
            taskName += "的服务确认单 " + (record.task_content.tag === "3" ?
              '被' + record.task_staff_name_from + '退回，请修改' : '需要您审核');
            break;
          case '1':
            taskName += '的服务确认单 正在审核中...';
            break;
          case '3':
            taskName += '的服务确认单 审核完毕。';
            break;
        }
        break;
      case '4':
        switch (record.task_status) {
          case '0':
            taskName += (record.task_param.tag === 2 ? '被' + record.task_staff_name_from + '退回，请修改' : '需要您审核');
            break;
          case '1':
            taskName += (record.task_param.tag === 2 ? '提交成功' : '正在审核中...');
            break;
          case '2':
            taskName += '审核完毕，正式启用了';
            break;
        }
    }
    if (record.proj_code) {
      return record.sta_type + ' 【工时管理】';
    } else if (record.teamId) {
      return record.needDealMessage + ' 【资金计划】';
    } else if (record.task_type === '9901' || record.task_type === '9902') {
      if (record.step) {
        if (record.status === '3') {
          return '您的加班申请 被驳回 ' + record.task_content + '请查看 【' + record.task_proj_sub_show + '】';
        }
        //保存状态的，流转中的不予展示
        else if (record.status === '0' || record.status === '2') {
          return null;
        } else {
          return '您有来自【' + record.create_person_name + '】加班申请 待审批 ' + record.task_content + ' 【' + record.task_proj_sub_show + '】';
        }
      }
    } else if (record.task_type === '9903') {
      if (record.status === '3') {
        return '您的申请 被驳回 ' + record.task_content + '请查看 【' + record.task_proj_sub_show + '】';
      } else if (record.status === '0' || record.status === '2') {
        return null;
      } else {
        return '您有来自【' + record.create_person_name + ' 的 ' + record.task_proj_sub_show + '】' + '待审批 环节：【' + record.task_content + '】';
      }
    } else if (record.task_type === '9904') {
      if (record.status === '4') {
        return '您的培训申请 被驳回 ' + record.task_content + '请查看 【' + record.task_proj_sub_show + '】';
      } else if (record.status === '0' || record.status === '2') {
        return null;
      } else {
        return '您有来自【' + record.create_person_name + '】培训申请 待审批 ' + record.task_content + ' 【' + record.task_proj_sub_show + '】';
      }
    } else if (record.task_type === '9905') {
      if (record.approval_type === '1') {
        return '您有' + record.task_content + '(' + (record.comment_type === '1' ? '首评' : '复评') + ')' + '待处理';
      } else {
        return '您有' + record.task_content + '待处理';
      }
    } else if (record.task_type === '9906') {
      if (record.status === '3') {
        return '您的申请 被驳回 ' + record.task_content + '请查看 【' + record.task_proj_sub_show + '】';
      } else if (record.status === '0' || record.status === '2') {
        return null;
      } else {
        return '您有来自【' + record.create_person_name + ' 的 ' + record.task_proj_sub_show + '】' + '待审批 环节：【' + record.task_content + '】';
      }
    } else if (record.task_type === '9907') {
      if (record.status === '3') {
        return '您的申请 被驳回 ' + record.task_content + '请查看 【' + record.task_proj_sub_show + '】';
      } else if (record.status === '0' || record.status === '2') {
        return null;
      } else {
        return '您有来自【' + record.create_person_name + ' 的 ' + record.task_proj_sub_show + '】' + '待审批 环节：【' + record.task_content + '】';
      }
    } else if (record.task_type === '9908'|| record.task_type === '9909' || record.task_type === '9910') {
      if (record.status === '3') {
        return '您的申请 被驳回 ' + record.task_content + '请查看 【' + record.task_proj_sub_show + '】';
      } else if (record.status === '0' || record.status === '2') {
        return null;
      } else {
        return '您有来自【' + record.create_person_name + ' 的 ' + record.task_proj_sub_show + '】' + '待审批 环节：【' + record.task_content + '】';
      }
    }else if (record.topic) {
      return '[会议管理]  您有会议管理系统的待办，请点击查看';
    }else if(record.projApply){
      return '[新闻管理]  您有新闻管理系统的待办，请点击查看';
    } else if (record.seal) {
      return '[印章证照管理]  您有印章证照系统的待办，请点击查看';
    }else if (record.task_proj_sub == '9') {
      const res = record.task_content.outerContent + taskName + '【' + record.task_proj_sub_show + '】'
      return res
    } else {
      const tmp = record.task_content.tag == "3" ? '您' : record.task_content.create_byname;
      let midContent = record.task_content.outerContent ? record.task_content.outerContent : record.task_content.content ? record.task_content.content : ""
      const res = record.task_type === '3' && record.task_proj_sub === '31' ?
        '考核评价已启动，请点击此处进行评价！ 【中层考核】' :
        midContent + taskName + ' 【' + record.task_proj_sub_show + '】';
      return res
    }
  }

  handleClick = (e, flag) => {
    const dispatch = this.props.action;
    if (e.task_proj_sub == '9') {
      if (e.task_param.tag == '10001') {
        dispatch(routerRedux.push({
          pathname: 'appCheck',
          query: {
            flowId: e.task_param.flowId,
            flowProcessId: e.task_param.flowProcessId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_batchid,
            task_status: e.task_status == '0' ? true : false
          }
        }));
      } else if (e.task_param.tag == '10002') {
        dispatch(routerRedux.push({
          pathname: 'appReturn',
          query: {
            flowId: e.task_param.flowId,
            flowProcessId: e.task_param.flowProcessId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_batchid,
            task_status: e.task_status == '0' ? true : false
          }
        }));
      } else if (e.task_param.tag == '10003') {
        dispatch(routerRedux.push({
          pathname: 'check',
          query: {
            flowId: e.task_param.flowId,
            flowProcessId: e.task_param.flowProcessId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_batchid,
            task_status: e.task_status == '0' ? true : false
          }
        }));
      } else if (e.task_param.tag == '10004') {
        dispatch(routerRedux.push({
          pathname: 'return',
          query: {
            flowId: e.task_param.flowId,
            flowProcessId: e.task_param.flowProcessId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_batchid,
            task_status: e.task_status == '0' ? true : false
          }
        }));
      } else if (e.task_param.tag == '10005') {
        dispatch(routerRedux.push({
          pathname: 'responsCheck',
          query: {
            flowId: e.task_param.flowId,
            flowProcessId: e.task_param.flowProcessId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_batchid,
            task_status: e.task_status == '0' ? true : false
          }
        }));
      } else if (e.task_param.tag == '10006') {
        dispatch(routerRedux.push({
          pathname: 'responsReturn',
          query: {
            flowId: e.task_param.flowId,
            flowProcessId: e.task_param.flowProcessId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_batchid,
            task_status: e.task_status == '0' ? true : false
          }
        }));
      }
    }
    if (e.task_type === '3' && e.task_proj_sub === '31') {
      dispatch(routerRedux.push({
        pathname: '/humanApp/leader/value'
      }));
    }

    if (e.task_type === '3' && e.task_proj_sub === '32') {
      dispatch(routerRedux.push({
        pathname: '/humanApp/leader/performance'
      }));
    }
    // 组织绩效考核跳转
    if (e.task_type === '4' && e.task_proj_sub === '10') {
      if (e.task_param.tag == 2) {
        dispatch(routerRedux.push({
          pathname: '/reReportDetail',
          query: {
            tag: 2,
            flag,
            flowId: e.task_param.flowId,
            taskUUID: e.task_uuid,
            flowLinkId: e.task_param.flowLinkId,
            taskBatchid: e.task_wf_batchid,
            year: e.task_param.year
          }
        }));
      } else {
        dispatch(routerRedux.push({
          pathname: '/financeApp/examine/evaluate/evaluateDetail',
          query: {
            tag: e.task_param.tag,
            flag,
            flowId: e.task_param.flowId,
            flowLinkId: e.task_param.flowLinkId,
            taskUUID: e.task_uuid,
            taskBatchid: e.task_wf_batchid,
            ableRefuse: e.task_param.ableRefuse,
            year: e.task_param.year
          }
        }));
      }
    }
    //会议点击跳转
      if(e.topic ==='议题') {
        dispatch(routerRedux.push({
          pathname: '/adminApp/meetManage/myJudge', //跳转到议题审核页面
          query: {
            value: JSON.stringify(e),
          }
        }));

    }
     //新闻跳转
     if(e.projApply) {
        dispatch(routerRedux.push({
          pathname: '/adminApp/newsOne/myReview', //新闻
        }));
      }
    if(e.seal ==='印章') {
      dispatch(routerRedux.push({
        pathname: '/adminApp/sealManage/myJudge', //跳转到印章审核页面
        query: {
          value: JSON.stringify(e),
        }
      }));

    }
    if (e.task_type === '2' && e.task_proj_sub === '2') {
      if(e.task_content.tag == '5'){
        dispatch({
          type: 'commonApp/taskProKpiPage',
          param: {
            pm_id: e.task_content.create_byid,
            year: e.task_param.arg_year,
            season: e.task_param.arg_season,
            check_batchid: e.task_wf_batchid,
            task_id: e.task_id,
            pro_id: e.task_param.arg_proj_id
          }
        });
      } else if (e.task_content.tag == '3') {
        dispatch(routerRedux.push({
          pathname: '/projectApp/projexam/kpifeedback',
          query: {
            check_id: e.task_param.arg_task_current_id
          }
        }));
      } else {
        dispatch({
          type: 'commonApp/taskProKpiPage',
          param: {
            pm_id: e.task_content.create_byid,
            year: e.task_param.arg_year,
            season: e.task_param.arg_season,
            check_batchid: e.task_wf_batchid,
            task_id: e.task_id,
            pro_id: e.task_param.arg_proj_id
          }
        });
      }
    }
    if (e.task_type === '998') {
      dispatch({
        type: 'commonApp/taskPartnerPage',
        payload: {
          arg_proj_id: e.proj_id,
          arg_year_month: e.year_month,
          arg_batchid: e.batchid,
          arg_state: e.state,
          flag: flag
        }
      });
    }
    else if (e.task_type === '999') {
      dispatch({
        type: 'commonApp/taskTeamManagePage',
        payload: {
          projId: e.proj.projId,
          optId: e.opt,
          teamBatchid: e.teamBatchid,
          flag: flag
        }
      });
    }
    else if (e.task_type === '2' && e.task_proj_sub == '1') {
      dispatch({
        type: 'commonApp/taskASPage',
        payload: {
          flag: flag,
          year: e.task_param.arg_year,
          season: e.task_param.arg_season,
          id: e.task_param.arg_proj_id,
          current: e.task_param.arg_task_current_id,
          task: e.task_param.arg_task_uid,
          wf: e.task_param.arg_task_wf_batchid,
          next: e.task_param.arg_task_next_id,
          exe: e.task_param.arg_exe_id,
          batch: e.task_param.arg_task_batch_id,
        }
      });
    }
    else if (e.task_proj_sub == '1') {
      dispatch({
        type: 'commonApp/taskDetailPage',
        payload: {
          arg_flag: flag,
          arg_check_id: e.task_param.arg_check_id,
          arg_task_id: e.task_id,
          arg_task_uuid: e.task_uuid,
          arg_task_batchid: e.task_batchid,
          arg_task_wf_batchid: e.task_wf_batchid,
        }
      });
    }
    else if (e.task_proj_sub == '4' && e.task_type == '0' && (e.task_content.module_type == undefined || e.task_content.module_type == '1')) {
      if (e.taskui_url == '/travelBudgetChangeReview' || e.taskui_url == '/travelBudgetChangeReturn') {
        if (flag == 0) {
          dispatch(routerRedux.push({
            pathname: e.taskui_url,
            query: {
              arg_proj_id: e.task_param.arg_proj_id,
              arg_check_id: e.task_param.arg_check_id,
              arg_proj_uid: e.task_param.arg_proj_uid,
              arg_task_uuid: e.task_uuid,
              arg_task_batchid: e.task_batchid,
              arg_task_wf_batchid: e.task_wf_batchid,
              arg_task_status: e.task_status,
            }
          }));
        } else {
          dispatch(routerRedux.push({
            pathname: '/travelBudgetChangeEnd',
            query: {
              arg_proj_id: e.task_param.arg_proj_id,
              arg_check_id: e.task_param.arg_check_id,
              arg_proj_uid: e.task_param.arg_proj_uid,
              arg_task_uuid: e.task_uuid,
              arg_task_batchid: e.task_batchid,
              arg_task_wf_batchid: e.task_wf_batchid,
              arg_task_status: e.task_status,
            }
          }));
        }
      } else {
        dispatch(routerRedux.push({
          pathname: '/projChangeCheck',
          query: {
            arg_proj_id: e.task_param.arg_proj_id,
            arg_check_id: e.task_param.arg_check_id,
            arg_tag: e.task_content.tag,
            arg_handle_flag: flag,
            arg_task_uuid: e.task_uuid,
            arg_task_id: e.task_id,
            arg_proj_uid: e.task_param.arg_proj_uid,
            arg_task_batchid: e.task_batchid,
            arg_task_wf_batchid: e.task_wf_batchid,
          }
        }));
      }
    }
    else if (e.task_proj_sub == '4' && e.task_type == '0' && e.task_content.module_type == '0') {
      dispatch({
        type: 'commonApp/deliverableCheck',
        payload: {
          arg_proj_id: e.task_param.arg_proj_id,
          arg_check_id: e.task_param.arg_check_id,
          arg_tag: e.task_content.tag,
          arg_handle_flag: flag,
          arg_task_uuid: e.task_uuid,
          arg_task_id: e.task_id,
          arg_proj_uid: e.task_param.arg_proj_uid,
          arg_task_batchid: e.task_batchid,
          arg_task_wf_batchid: e.task_wf_batchid,
        }
      });
    }
    else if (e.task_proj_sub === '6' && e.task_type === '0') {
      //task_type ,0:项目 ， task_proj_sub，6 ：TMO修改全成本
      dispatch({
        type: 'commonApp/modifyFullcostCheck',
        payload: {
          arg_proj_id: e.task_param.arg_proj_id,
          arg_check_id: e.task_param.arg_check_id,
          arg_tag: e.task_content.tag,
          arg_handle_flag: flag,
          arg_task_uuid: e.task_uuid,
          arg_task_id: e.task_id,
          arg_proj_uid: e.task_param.arg_proj_uid,
          arg_task_batchid: e.task_batchid,
          arg_task_wf_batchid: e.task_wf_batchid,
        }
      });
    }
    else if (e.task_type === 'week_timesheet_back' || e.task_type === 'makeup_timesheet_back') {
      dispatch(routerRedux.push({
        pathname: '/projectApp/timesheetManage/fillSendBack',
        query: {
          begin_time: e.begin_time,
          end_time: e.end_time,
          proj_code: e.proj_code,
          proj_name: e.proj_name,
          approved_status: e.approved_status,
          task_type: e.task_type,
        }
      }));
    }
    else if (e.task_type === 'pm_week_timesheet_check') {
      dispatch(routerRedux.push({
        pathname: '/projectApp/timesheetManage/timesheetCheck',
        query: {
          begin_time: e.begin_time,
          end_time: e.end_time,
          proj_code: e.proj_code,
          proj_name: e.proj_name,
          approved_status: e.approved_status,
          task_type: e.task_type,
          proj_id: e.proj_id,
        }
      }));
    }
    else if (e.task_type === 'pm_makeup_timesheet_check') {
      dispatch(routerRedux.push({
        pathname: '/projectApp/timesheetManage/timesheetMakeupCheckPm',
        query: {
          begin_time: e.begin_time,
          end_time: e.end_time,
          proj_code: e.proj_code,
          proj_name: e.proj_name,
          approved_status: e.approved_status,
          task_type: e.task_type,
          proj_id: e.proj_id,
        }
      }));
    }
    else if (e.task_type === 'dm_makeup_timesheet_check') {
      dispatch(routerRedux.push({
        pathname: '/projectApp/timesheetManage/timesheetMakeupCheckDm',
      }));
    }
    else if (e.fundingBudgetTask === 'funding_budget_task') {
      dispatch(routerRedux.push({
        pathname: '/financeApp/funding_plan/funding_plan_review',
      }));
    }
    else if (e.fundingBudgetTask === 'funding_budget_task_reject') {
      dispatch(routerRedux.push({
        pathname: '/financeApp/funding_plan/funding_plan_fill',
      }));
    }
    else if (e.proj_code) {
      if (!window.localStorage.timesheetModuleList) {
        dispatch({
          type: 'commonApp/timeSheetList',
          formData: {
            "argtenantid": '10010',
            "argtpid": 'db2904cfb38311e6a01d02429ca3c6ff',
            "arguserid": Cookie.get('userid')
          }
        })
      }
      //window.open('/ProjectManage/index.html#/mainpage/ts_timesheet/ts_mydeal?moduleId=0','_blank')
    }
    //项目组加班申请
    else if (e.task_type === '9901') {
      //跳转到审批
      if (e.status !== '3') {
        let infoRecord = {
          proc_inst_id: e.proc_inst_id,
          proc_task_id: e.proc_task_id,
          task_id: e.task_id,
          deptName: e.deptname,
          step: e.step,
          user_name: e.user_name,
          create_time: e.create_time,
          task_name: e.task_name,
          holiday_name: e.holiday_name,
          create_person_name: e.create_person_name,
        }
        if (e.apply_type === "1") {
          infoRecord["applyTypeForPerson"] = '1';
          infoRecord["approvalType"] = '1';
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index/teamApproval',
            query: infoRecord,
          }));
        }
        else if (e.apply_type === "2") {
          infoRecord["applyTypeForPerson"] = '2';
          infoRecord["approvalType"] = '3';
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index/teamApproval',
            query: infoRecord,
          }));
        }
      }
      //被驳回，跳转到查看
      else if (e.state === '4') {
        let query = {
          //该条记录的部门
          deptName: e.deptname,
          //该条记录的部门
          step: e.step,
          //当前处理人
          currentPerson: e.user_name,
          //传递该条记录是什么类型的加班流程申请
          approvType: e.task_name,
          //该条记录的ID
          task_id: e.task_id,
          //该条记录的节假日
          holiday_name: e.holiday_name,
          //该条记录创建时间
          create_time: e.create_time,
          task_name: e.task_name,
          proj_id: e.proj_id,
          apply_type: e.apply_type
        };
        //删除驳回
        dispatch({
          type: 'commonApp/deleteOvertimeApproval',
          payload: {
            apply_type: e.apply_type,
            task_id: e.task_id,
          },
        });
        //项目组加班申请:保存状态的查看，已提交待办。未提交
        if (e.task_name === "项目组加班申请") {
          //提交状态，会产生新的task_id
          if ((e.task_id !== null) && (e.task_id !== '') && (e.task_id !== undefined)) {
            query["applyTypeForPerson"] = '1';
            query["approvalType"] = '1';
            dispatch(routerRedux.push({
              pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
              query: query
            }));
          }
        }
        else if (e.task_name === "项目组加班统计") {
          if ((flag === "0") && (e.task_id !== null) && (e.task_id !== '') && (e.task_id !== undefined)) {
            query["applyTypeForPerson"] = '2';
            query["approvalType"] = '3';
            dispatch(routerRedux.push({
              pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
              query: query
            }));
          }
        }
      }
    }
    //部门加班申请
    else if (e.task_type === '9902') {
      //跳转到审批
      if (e.status !== '3') {
        let infoRecord = {
          proc_inst_id: e.proc_inst_id,
          proc_task_id: e.proc_task_id,
          task_id: e.task_id,
          deptName: e.deptname,
          step: e.step,
          user_name: e.user_name,
          create_time: e.create_time,
          task_name: e.task_name,
          holiday_name: e.holiday_name,
          create_person_name: e.create_person_name,
        }
        if (e.apply_type === "5") {
          infoRecord["applyTypeForPerson"] = '1';
          infoRecord["approvalType"] = '5';
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index/deptFuncApproval',
            query: infoRecord,
          }));
        } else if (e.apply_type === "6") {
          infoRecord["applyTypeForPerson"] = '2';
          infoRecord["approvalType"] = '6';
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index/deptFuncApproval',
            query: infoRecord,
          }));
        } else if (e.apply_type === "3") {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index/deptApproval',
            query: infoRecord,
          }));
        } else if (e.apply_type === "4") {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index/deptStatsApproval',
            query: infoRecord,
          }));
        }
      }
      //被驳回，跳转到查看
      else if (e.state === '4') {
        let query = {
          //该条记录的部门
          deptName: e.deptname,
          //该条记录的部门
          step: e.step,
          //当前处理人
          currentPerson: e.user_name,
          //传递该条记录是什么类型的加班流程申请
          approvType: e.task_name,
          //该条记录的ID
          task_id: e.task_id,
          //该条记录的节假日
          holiday_name: e.holiday_name,
          //该条记录创建时间
          create_time: e.create_time,
          task_name: e.task_name,
          proj_id: e.proj_id,
          apply_type: e.apply_type
        }
        //删除驳回
        dispatch({
          type: 'commonApp/deleteOvertimeApproval',
          payload: {
            apply_type: e.apply_type,
            task_id: e.task_id,
          },
        });
        //项目组加班申请:保存状态的查看，已提交待办。未提交
        if (e.task_name === "部门加班申请") {
          //提交状态的职能线加班申请，有了新的task_id
          if ((e.task_id !== null && e.task_id !== '' && e.task_id !== undefined) && (e.apply_type === '5')) {
            //该条记录的申请类型，5：职能线加班申请；6：职能线加班统计
            query["circulationType"] = "职能线加班申请";
            query["applyTypeForPerson"] = '1';
            query["approvalType"] = '2';
            dispatch(routerRedux.push({
              pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
              query: query
            }));
          }
          //其他情况，部门加班申请
          else {
            query["applyType"] = '1';
            query["approvalType"] = '2';
            dispatch(routerRedux.push({
              pathname: '/humanApp/overtime/overtime_index/showApprovalDetails',
              query: query
            }));
          }
        }
        else if (e.task_name === "部门加班统计") {
          //提交状态的职能线加班统计，有了新的task_id
          if ((e.task_id !== null && e.task_id !== '' && e.task_id !== undefined) && (e.apply_type === '6')) {
            //该条记录的申请类型，5：职能线加班申请；6：职能线加班统计
            query["circulationType"] = "职能线加班申请";
            query["applyTypeForPerson"] = '2';
            query["approvalType"] = '4';
            dispatch(routerRedux.push({
              pathname: '/humanApp/overtime/overtime_index/showTeamDetails',
              query: query
            }));
          }
          //其他情况，部门加班统计
          else {
            query["applyType"] = '2';
            query["approvalType"] = '4';
            dispatch(routerRedux.push({
              pathname: '/humanApp/overtime/overtime_index/showApprovalDetails',
              query: query
            }));
          }
        }
      }
    }
    //离职待办
    else if (e.task_type === '9903') {
      //跳转到审批
      let infoRecord = {
        proc_inst_id: e.proc_inst_id,
        proc_task_id: e.proc_task_id,
        task_id: e.task_id,
        arg_quit_settle_id: e.task_id,
        arg_dept_id: e.dept_id,
        deptName: e.deptname,
        step: e.step,
        user_name: e.user_name,
        create_time: e.create_time,
        task_name: e.task_name,
        holiday_name: e.holiday_name,
        create_person_name: e.create_person_name,
        create_name: e.create_person_name,
        core_post: e.core_post,
        position_title: e.position_title,
        leave_time: e.leave_time,
        create_proj: e.create_proj,
        create_person: e.create_person,
      };
      //跳转到审批,流程中，且不是驳回
      if (e.status !== '3' && e.status !== '2') {
        //离职申请
        if (e.apply_type === "1") {
          infoRecord["applyTypeForPerson"] = '1';
          infoRecord["approvalType"] = '1';
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/index/leaveApplyApproval',
            query: infoRecord,
          }));
          //离职交接
        } else if (e.apply_type === "2") {
          infoRecord["applyTypeForPerson"] = '1';
          infoRecord["approvalType"] = '2';
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/index/leaveHandApproval',
            query: infoRecord,
          }));
          //离职清算 TODO
        } else if (e.apply_type === "3") {
          infoRecord["applyTypeForPerson"] = '1';
          infoRecord["approvalType"] = '3';
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/index/quit_settle_approval',
            query: infoRecord
          }));
        }
        //合同续签 TODO
        else if (e.apply_type === "4") {
          infoRecord["applyTypeForPerson"] = '1';
          infoRecord["approvalType"] = '4';
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/staffLeave_index/contractRenewApproval',
            query: infoRecord
          }));
        }
      }
      //被驳回，先删除然后跳转到查看
      else if (e.status === '3') {
        let showParm = e;
        //根据不同的申请类型，跳到不同的界面
        if (e.apply_type === '1') {
          //离职申请
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/index/CheckLeave',
            query: showParm
          }));
        } else if (e.apply_type === '2') {
          //工作交接申请
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/index/CheckworkHandover',
            query: showParm
          }));
        } else if (e.apply_type === '3') {
          //离职结算
          if (e.status === '0') {
            dispatch(routerRedux.push({
              pathname: '/humanApp/labor/index/CheckleaveSettle',
              query: showParm
            }));
          } else {
            dispatch(routerRedux.push({
              pathname: '/humanApp/labor/index/LeaveSettlePrint',
              query: showParm
            }));
          }
        } else if (e.apply_type === '4') { //劳动合同驳回阅后即焚
          dispatch({
            type: 'commonApp/deleteContractApproval',
            payload: {
              apply_type: e.apply_type,
              task_id: e.task_id,
            },
          });
          dispatch(routerRedux.push({
            pathname: '/humanApp/labor/staffLeave_index/contract_approval_look',
            query: showParm
          }))
        }
      }
    }
    //培训待办，跳转到审批
    else if (e.task_type === '9904') {
      if (e.state !== '3' && e.state !== '2') {
        //跳转到审批
        let infoRecord = {
          proc_inst_id: e.proc_inst_id,
          proc_task_id: e.proc_task_id,
          task_id: e.task_id,
          create_person: e.create_person,
          create_person_id: e.create_person_id,
          create_person_name: e.create_person_name,
          if_budget: e.if_budget,
        };
        if (e.train_type === '1') {
          //总院必修岗位计划
          infoRecord.approvalType = '1';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_approval_dept',
            query: infoRecord,
          }));
        } else if (e.train_type === '2') {
          //总院选修岗位计划
          infoRecord.approvalType = '2';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_approval_dept',
            query: infoRecord,
          }));
        } else if (e.train_type === '3') {
          //一般培训计划
          infoRecord.approvalType = '3';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_approval_dept',
            query: infoRecord,
          }));
        } else if (e.train_type === '4') {
          //认证考试计划
          infoRecord.approvalType = '4';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_approval_dept',
            query: infoRecord,
          }));
        } else if (e.task_name === '培训课程申请') {
          if (e.train_apply_type === '3' || e.train_apply_type === '2' || e.train_apply_type === '1') {
            //内训-外请讲师
            if (e.is_out_of_plan === '1') {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/train_do/train_in_planout_approval',
                query: e,
              }));
            } else {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/train_do/train_in_planin_approval',
                query: e,
              }));
            }
          } else if (e.train_apply_type === '5') {
            //培训班审批
            dispatch(routerRedux.push({
              pathname: '/humanApp/train/train_do/create_train_course_approval',
              query: e,
            }));
          } else if (e.train_apply_type === '4') {
            //培训课程申请
            dispatch(routerRedux.push({
              pathname: '/humanApp/train/train_do/train_apply_approval',
              query: e,
            }));
          }
        } else if (e.task_name === '线上培训认证考试成绩录入') {
          //线上培训认证考试成绩录入
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_online_exam_import_approval',
            query: e,
          }));
        } else {
          infoRecord.approvalType = e.train_type;
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_approval',
            query: infoRecord,
          }));
        }
      }
      //驳回，先查看，再删除
      else if (e.state1 === '4' || e.state === '3') {
        dispatch({
          type: 'commonApp/deleteTrainClassApplyApproval',
          payload: {
            task_id: e.task_id,
            train_type: ''
          },
        });

        let infoRecord = {
          proc_inst_id: e.proc_inst_id,
          proc_task_id: e.proc_task_id,
          task_id: e.task_id,
          create_person: e.create_person,
          create_person_id: e.create_person_id,
          create_person_name: e.create_person_name,
        }
        if (e.train_type === '1') {
          //总院必修岗位计划
          infoRecord.approvalType = '1';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_look_dept',
            query: infoRecord,
          }));
        } else if (e.train_type === '2') {
          //总院选修岗位计划
          infoRecord.approvalType = '2';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_look_dept',
            query: infoRecord,
          }));
        } else if (e.train_type === '3') {
          //一般培训计划
          infoRecord.approvalType = '3';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_look_dept',
            query: infoRecord,
          }));
        } else if (e.train_type === '4') {
          //认证考试计划
          infoRecord.approvalType = '4';
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_look_dept',
            query: infoRecord,
          }));
        } else if (e.task_name === '培训课程申请') {
          //培训课程申请
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_apply_look',
            query: e,
          }));
        } else if (e.task_name === '线上培训认证考试成绩录入') {

          //培训课程申请
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_online_exam_import_look',
            query: e,
          }));
        } else {
          infoRecord.approvalType = e.train_type;
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do/train_plan_look',
            query: infoRecord,
          }));
        }
      }
    }
    //干部评议，跳转到评议界面
    else if (e.task_type === '9905') {
      //跳转到个人评审
      if (e.approval_type === '1') {
        //总院必修岗位计划
        dispatch(routerRedux.push({
          pathname: '/humanApp/appraise/approvalInfo/commentApproval',
          query: e,
        }));
      }
      //跳转到组织机构评审
      if (e.approval_type === '2') {
        //总院必修岗位计划
        dispatch(routerRedux.push({
          pathname: '/humanApp/appraise/approvalInfo/oraganApproval',
          query: e,
        }));
      }
    }
    else if (e.task_type === '9906') {
      let infoRecord = {
        proc_inst_id: e.proc_inst_id,
        proc_task_id: e.proc_task_id,
        absence_apply_type: e.absence_apply_type,
        // 该条记录的部门
        absence_apply_id: e.absence_apply_id,
        deptName: e.dept_name,
        // 该条记录的步骤
        step: e.step,
        // 当前处理人
        currentPerson: e.user_name,
        //传递该条记录是什么类型的请假流程申请
        approveType: e.absence_apply_type,
        // 记录ID
        task_id: e.absence_apply_id,
        // 创建时间
        create_time: e.create_time,
        task_name: e.task_name,
        proj_id: e.proj_id,
        apply_type: e.apply_type
      }

      if (e.absence_apply_type === '调休申请') {
        if (e.status === '3') {
          let query = {
            if_reback: '1',
            absence_apply_id: e.absence_apply_id,
            absence_apply_type: e.absence_apply_type,
          }
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex/absence_approve_look',
            query
          }));
        } else {
          infoRecord["approvalType"] = '1';
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex/absence_approval',
            query: infoRecord,
          }));
        }

      }
      if (e.absence_apply_type === '事假申请') {
        if (e.status === '3') {
          let query = {
            if_reback: '1',
            absence_apply_id: e.absence_apply_id,
            absence_apply_type: e.absence_apply_type,
          }
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex/affair_approval_look',
            query
          }));
        } else {
          infoRecord["approvalType"] = '2';
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex/affair_approval',
            query: infoRecord,
          }));
        }
      }

      if (e.absence_apply_type === '年假申请') {
        if (e.status === '3') {
          let query = {
            if_reback: '1',
            absence_apply_id: e.absence_apply_id,
            absence_apply_type: e.absence_apply_type,
          }
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex/year_approval_look',
            query
          }));
        } else {
          infoRecord["approvalType"] = '3';
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex/year_approval',
            query: infoRecord,
          }));
        }
      }
    }
    else if (e.task_type === '9907') {
      let infoRecord = {
        proc_inst_id: e.proc_inst_id,
        proc_task_id: e.proc_task_id,
        sympathy_type: e.sympathy_type,
        // 该条记录的部门
        sympathy_apply_id: e.sympathy_apply_id,
        // 该条记录的步骤
        step: e.step,
        // 当前处理人
        currentPerson: e.user_name,
        //传递该条记录是什么类型的工会慰问流程申请
        // 记录ID
        task_id: e.sympathy_apply_id,
        // 创建时间
        create_time: e.create_time,
        task_name: e.task_name,
      }
      if (e.status === '3') {
        let postData = e;
        postData["if_reback"] = '1';
        postData["statusFlag"] = '2';
        postData["sympathy_apply_id"] = e.sympathy_apply_id;

        dispatch(routerRedux.push({
          pathname: '/humanApp/laborSympathy/index/labor_sympathy_apply_look',
          query: postData
        }));
      } else {
        dispatch(routerRedux.push({
          pathname: '/humanApp/laborSympathy/index/labor_sympathy_approval',
          query: infoRecord,
        }));
      }
    }  else if (e.task_type === '9908'|| e.task_type === '9909' || e.task_type === '9910') {
      let infoRecord = {
       proc_task_id: e.proc_task_id,
	     proc_inst_id: e.proc_inst_id,
       apply_id: e.apply_id,
	     absenceMonth:e.cycle_code,
	     statusFlag: '1',
       deptName: e.deptname,
       step: e.step,
       user_name: e.user_name,
       task_name: e.task_name,
       create_person_name: e.create_person_name,
      }

      if (e.task_type === '9908') {
        if (e.status === '3') {
          let query = {
            if_reback: '1',
            apply_id: e.apply_id,
            absenceMonth: e.cycle_code,
          }
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index/attend_proj_approval_look',
            query
          }));
        } else {
          infoRecord["approvalType"] = '1';
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index/attend_proj_approval',
            query: infoRecord,
          }));
        }
      }

      if (e.task_type === '9910') {
        if (e.status === '3') {
          let query = {
           if_reback: '1',
            apply_id: e.apply_id,
            absenceMonth: e.cycle_code,
          }
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index/attend_dept_approval_look',
            query
          }));
        } else {
          infoRecord["approvalType"] = '2';
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index/attend_dept_approval',
            query: infoRecord,
          }));
        }
      }

      if (e.task_type === '9909') {
        if (e.status === '3') {
         let query = {
            if_reback: '1',
            apply_id: e.apply_id,
            absenceMonth: e.cycle_code,
          }
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index/attend_func_approval_look',
            query
          }));
        } else {
          infoRecord["approvalType"] = '3';
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index/attend_func_approval',
            query: infoRecord,
          }));
        }
      }
  }
  };
  render() {
    const { unDoList, noticeList, circulationNoticeList } = this.props;

    const listArray = new Array();
    // 处理待办列表
    if (unDoList.length > 0) {
      unDoList.map((unDoItem, index) => {
        listArray.push(
          <li key={'undo' + index}>
            <span style={{ float: 'left' }}>
              <span className={styles.unDoStyle}>待办</span>
              <a key={'undo_a_' + index}
                onClick={() => this.handleClick(unDoItem, 0)} style={{ color: 'black' }}>
                  {this.getUndoContent(unDoItem)}
                  </a>
            </span>
            {
              unDoItem.sortDate.split(' ').length ?
                <span style={{ float: 'right' }}>{unDoItem.sortDate.split(' ')[0]}</span> :
                <span style={{ float: 'right' }}>{unDoItem.sortDate}</span>
            }
          </li>
        );
      });
    }

    // 处理消息列表
    if (noticeList.length > 0) {
      noticeList.map((i, index) => {
        listArray.push(
          <li key={'notice' + index}>
            <span style={{ float: 'left' }}>
              <span className={styles.noticeStyle}>消息</span>
              <a key={'notice_a_' + index} onClick={() => this.props.lookDetail(i)} style={{ color: 'black' }}>{i['content']}</a>
            </span>
            <span style={{ float: 'right' }}>
              <a onClick={() => this.handleMenuClick(i, '0')} style={{ margin: '0 10px' }}>设为已读</a>
            </span>
          </li>
        )
      })
    }

    // 流程流转，消息提醒列表
    if (circulationNoticeList && circulationNoticeList.length > 0) {
      circulationNoticeList.map((i, index) => {
        listArray.push(
          <li key={'circulation_notice' + index}>
            <span style={{ float: 'left' }}>
              <span className={styles.noticeStyle}>通知</span>
              {i['step_name'] + '【时间】：' + i['create_time']}
            </span>
            <span style={{ float: 'right' }}>
              <a onClick={() => this.handleMenuClickCirculationNotice(i)} style={{ margin: '0 10px' }}>设为已读</a>
            </span>
          </li>
        )
      })
    }

    let list = this.props.loadFlag ? (<li><Spin /></li>) : (listArray.length > 0 ? listArray : <li>查询无记录</li>);

    return (
      <div className={styles['maingageMessage']}>
        <div style={{ background: '#7ab0ec' }}>
          <b style={{ fontSize: '16px' }}>我的工作台</b>
          <span><Link to={this.props.getMoreUrl} style={{ color: '#fff' }}>更多</Link></span>
        </div>
        <ul className={styles[this.props.listStyle]}>{list}</ul>
        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }

}

MyPlatform.propTypes = {
  title: React.PropTypes.string,
  infoList: React.PropTypes.array
}

export default MyPlatform;
