/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：待办列表
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Tabs, Icon, Pagination, Breadcrumb, Radio, Badge, List, Spin } from 'antd';
import styles from './task.less';
import Styles from './../../../components/commonApp/mainpageUl.css';
import { routerRedux } from 'dva/router';
const TabPane = Tabs.TabPane;
/**
 * 作者：任华维
 * 创建日期：2017-10-21.
 * 文件说明：待办列表主页
 */
function TaskList({dispatch, taskList, loading, unDoListCount, unReadListCount}) {
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：变量
     */
    const columns = [
      {
        title: '标题',
        dataIndex: 'task_content',
        className: 'left',
        render: (text, record) => {
          /* console.log(record);*/
          //工时管理
          if(record.proj_code){
            return {children:<p><b>[工时管理]</b><span style={{marginLeft:'5px'}}>{record.sta_type}</span></p>}
          }
         //会议管理
         if(record.topic){
          return {children:<p>
            <b style={{marginRight:'5px'}}>[会议管理]  您有会议管理系统的待办，请点击查看</b>

          </p>}
        }
        //新闻管理
        if(record.projApply.tableCode){
          return {children:<p>
            <b style={{marginRight:'5px'}}>[新闻管理]  您有新闻管理系统的待办，请点击查看</b>

          </p>}
        }
        if(record.seal){
          return {children:<p>
              <b style={{marginRight:'5px'}}>[印章证照管理]  您有印章证照系统的待办，请点击查看</b>

            </p>}
        }
                //资金计划
          if(record.teamId){
                    return {children:<p><b>[资金计划]</b><span style={{marginLeft:'5px'}}>{record.needDealMessage}</span></p>}
                }else{
                    //待办结尾内容
                    let taskName = '';
                    switch (record.task_type) {
                        case '0':
                        case '999':
                          if(record.hasOwnProperty('taskui_url')) {
                            if(record.taskui_url === '/travelBudgetChangeReturn' || record.taskui_url === '/travelBudgetChangeReview') {
                              taskName += '的差旅费预算变更';
                            }
                          }
                          switch (record.task_status) {
                              case '0':
                                taskName += (record.task_content.tag === "3"
                                  ? '被'+record.task_staff_name_from+'退回，请修改' : record.task_content.tag === "6"
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
                                    taskName += (record.task_content.tag === "3"||record.task_content.tag === "5" ? '考核指标 被'+record.task_staff_name_from+'退回，请修改' : '考核指标 需要您审核');
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
                                    taskName += "的服务确认单 "+(record.task_content.tag === "3" ? '被'+record.task_staff_name_from+'退回，请修改' : '需要您审核');
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
                                taskName += (record.task_param.tag === 2 ? '被' + record.task_staff_name_from+'退回，请修改' : '需要您审核');
                                break;
                              case '1':
                                taskName += (record.task_param.tag === 2 ? '提交成功' : '正在审核中...');
                                break;
                              case '3':
                                taskName += '审核完毕，正式启用了';
                                break;
                            }
                    }

                  //待办中间内容
                  let actionName = '';
                  switch (record.task_type) {
                    case '0':
                        switch (record.task_proj_sub) {
                          case '1':
                            actionName += '创建项目';
                            break;
                          case '4':
                            if(record.task_type=='0'&& (record.task_content.module_type==undefined||record.task_content.module_type=='1')){
                              actionName += '变更项目';
                            }else if(record.task_type=='0'&& record.task_content.module_type=='0'){
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
                  }

                  let messageEle = '';
                  switch (record.task_proj_sub) {
                    case '9':
                    case '10': // 组织绩效考核
                      messageEle = record.task_status == '0'
                        ? <p>
                            <span dangerouslySetInnerHTML={{__html: record.task_content.innerContent}} />
                            <span>{taskName}</span>
                          </p>
                        : <p>
                            <span dangerouslySetInnerHTML={{__html: record.task_content.nostyleContent}} />
                            <span>{taskName}</span>
                          </p>;
                      break;
                    default:
                      messageEle = record.task_type === '3' && record.task_proj_sub === '31'
                        ? <p className={Styles["remind"]}>[中层考核]考核评价已启动，请点击此处进行评价！</p>
                        : <p>
                            {record.task_status == '0'? <b className={styles['space']}>{'['+ record.task_proj_sub_show +']'}</b> : '['+ record.task_proj_sub_show +']'}
                            {record.task_status == '0'? (<b className={styles['space']}>{ record.task_content.tag=="3" ? '您' : record.task_content.create_byname }</b>) : record.task_content.create_byname }
                            <span>{actionName}</span>
                            {record.task_status == '0'? <b className={styles['space']}>{record.task_content.content}</b> : record.task_content.content}
                            <span>{taskName}</span>
                          </p>;
                  }
                  return messageEle;
              }
            }
        },
        {
            title: '日期',
            dataIndex: 'sortDate',
        }
    ];
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：tableClick事件
     * @param e 点击事件默认参数
     * @param flag 待办标记
     */
    const handleTableClick = (e,flag) => {
        if(e.task_proj_sub == '9'){
          if(e.task_param.tag == '10001'){
            dispatch(routerRedux.push({
              pathname:'appCheck',
              query:{
                flowId:e.task_param.flowId,
                flowProcessId:e.task_param.flowProcessId,
                taskUUID:e.task_uuid,
                taskBatchid:e.task_batchid,
                task_status:e.task_status=='0' ? true : false
              }
            }));
          }else if(e.task_param.tag == '10002'){
            dispatch(routerRedux.push({
              pathname:'appReturn',
              query:{
                flowId:e.task_param.flowId,
                flowProcessId:e.task_param.flowProcessId,
                taskUUID:e.task_uuid,
                taskBatchid:e.task_batchid,
                task_status:e.task_status=='0' ? true : false
              }
            }));
          }else if(e.task_param.tag == '10003'){
            dispatch(routerRedux.push({
              pathname:'check',
              query:{
                flowId:e.task_param.flowId,
                flowProcessId:e.task_param.flowProcessId,
                taskUUID:e.task_uuid,
                taskBatchid:e.task_batchid,
                task_status:e.task_status=='0' ? true : false
              }
            }));
          }else if(e.task_param.tag == '10004'){
            dispatch(routerRedux.push({
              pathname:'return',
              query:{
                flowId:e.task_param.flowId,
                flowProcessId:e.task_param.flowProcessId,
                taskUUID:e.task_uuid,
                taskBatchid:e.task_batchid,
                task_status:e.task_status=='0' ? true : false
              }
            }));
          }else if(e.task_param.tag == '10005'){
            dispatch(routerRedux.push({
              pathname:'responsCheck',
              query:{
                flowId:e.task_param.flowId,
                flowProcessId:e.task_param.flowProcessId,
                taskUUID:e.task_uuid,
                taskBatchid:e.task_batchid,
                task_status:e.task_status=='0' ? true : false
              }
            }));
          }else if(e.task_param.tag == '10006'){
            dispatch(routerRedux.push({
              pathname:'responsReturn',
              query:{
                flowId:e.task_param.flowId,
                flowProcessId:e.task_param.flowProcessId,
                taskUUID:e.task_uuid,
                taskBatchid:e.task_batchid,
                task_status:e.task_status=='0' ? true : false
              }
            }));
          }
        }
        if(e.task_type === '3' && e.task_proj_sub === '31'){
          dispatch(routerRedux.push({
            pathname:'/humanApp/leader/value'
          }));
        }
        // 组织绩效考核跳转
        if (e.task_type === '4' && e.task_proj_sub === '10') {
          if (flag == 0) {
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
          } else {
            dispatch(routerRedux.push({
              pathname: '/todoEvaluateDetail',
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
            }))
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
        if(e.seal ==='印章') {
          dispatch(routerRedux.push({
            pathname: '/adminApp/sealManage/myJudge', //跳转到印章审核页面
            query: {
              value: JSON.stringify(e),
            }
          }));

        }
        if(e.task_type === '2' && e.task_proj_sub === '2' && e.task_status == '0'){
            if(e.task_content.tag == '3') {
                dispatch(routerRedux.push({
                    pathname:'/projectApp/projexam/kpifeedback' ,
                }));
            } else {
                dispatch({
                    type:'task/taskProKpiPage',
                    param:{
                      pm_id:e.task_content.create_byid,
                      year:e.task_param.arg_year,
                      season:e.task_param.arg_season,
                      check_batchid:e.task_wf_batchid,
                      task_id:e.task_id,
                      pro_id:e.task_param.arg_proj_id
                    }
                });
            }
        }else if(e.task_proj_sub ==='2' && e.task_type =='2'){
          dispatch({
              type:'task/taskASPage',
              payload:{
                  flag:flag,
                  flagSub:e.task_proj_sub,
                  year:e.task_param.arg_year,
                  season:e.task_param.arg_season,
                  id:e.task_param.arg_proj_id,
                  current:e.task_param.arg_task_current_id,
                  task:e.task_param.arg_task_uid,
                  wf:e.task_param.arg_task_wf_batchid,
                  next:e.task_param.arg_task_next_id,
                  exe:e.task_param.arg_exe_id,
                  batch:e.task_param.arg_task_batch_id,
              }
          });
        }
        if (e.task_type === '998') {
            dispatch({
                type:'task/taskPartnerPage',
                payload:{
                  'arg_proj_id':e.proj_id,
                  'arg_year_month':e.year_month,
                  'arg_batchid':e.batchid,
                  'arg_state':e.state,
                  'flag':flag
                }
            });
        } else if(e.task_type === '999'){
            dispatch({
                type:'task/taskTeamManagePage',
                payload:{
                  'projId':e.proj.projId,
                  'optId':e.opt,
                  'teamBatchid':e.teamBatchid,
                  'flag':flag,
                  'queryType':e.queryType
                }
            });
        } else if (e.task_type === '2' && e.task_proj_sub=='1') {
            dispatch({
                type:'task/taskASPage',
                payload:{
                    flag:flag,
                    year:e.task_param.arg_year,
                    season:e.task_param.arg_season,
                    id:e.task_param.arg_proj_id,
                    current:e.task_param.arg_task_current_id,
                    task:e.task_param.arg_task_uid,
                    wf:e.task_param.arg_task_wf_batchid,
                    next:e.task_param.arg_task_next_id,
                    exe:e.task_param.arg_exe_id,
                    batch:e.task_param.arg_task_batch_id,
                }
            });
        } else if (e.task_proj_sub=='1') {
            dispatch({
                type:'task/taskDetailPage',
                payload:{
                    arg_flag:flag,
                    arg_check_id:e.task_param.arg_check_id,
                    arg_task_id:e.task_id,
                    arg_task_uuid:e.task_uuid,
                    arg_task_batchid:e.task_batchid,
                    arg_task_wf_batchid:e.task_wf_batchid,
                }
            });
        } else if(e.task_proj_sub=='4'&& e.task_type=='0'&& (e.task_content.module_type == undefined || e.task_content.module_type=='1')){
          if(e.hasOwnProperty('taskui_url')) {
            if(e.taskui_url == '/travelBudgetChangeReview' || e.taskui_url == '/travelBudgetChangeReturn') {
              if(flag == 0) {
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
              }else {
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
              dispatch({
                type:'task/changeCheck',
                payload:{
                  arg_proj_id:e.task_param.arg_proj_id,
                  arg_check_id:e.task_param.arg_check_id,
                  arg_tag:e.task_content.tag,
                  arg_handle_flag:flag,
                  arg_task_uuid:e.task_uuid,
                  arg_task_id:e.task_id,
                  arg_proj_uid:e.task_param.arg_proj_uid,
                  arg_task_batchid:e.task_batchid,
                  arg_task_wf_batchid:e.task_wf_batchid,
                }
              });
            }
          }
        }
        else if(e.task_proj_sub=='4'&& e.task_type=='0'&& e.task_content.module_type=='0'){
          dispatch({
            type:'task/deliverableCheck',
            payload:{
              arg_proj_id:e.task_param.arg_proj_id,
              arg_check_id:e.task_param.arg_check_id,
              arg_tag:e.task_content.tag,
              arg_handle_flag:flag,
              arg_task_uuid:e.task_uuid,
              arg_task_id:e.task_id,
              arg_proj_uid:e.task_param.arg_proj_uid,
              arg_task_batchid:e.task_batchid,
              arg_task_wf_batchid:e.task_wf_batchid,
              arg_check_business_batchid:e.check_business_batchid

            }
          });
        }
        else if(e.task_proj_sub === '6' && e.task_type === '0'){
          //task_type ,0:项目 ， task_proj_sub，6 ：TMO修改全成本
          dispatch({
            type:'task/modifyFullcostCheck',
            payload:{
              arg_proj_id:e.task_param.arg_proj_id,
              arg_check_id:e.task_param.arg_check_id,
              arg_tag:e.task_content.tag,
              arg_handle_flag:flag,
              arg_task_uuid:e.task_uuid,
              arg_task_id:e.task_id,
              arg_proj_uid:e.task_param.arg_proj_uid,
              arg_task_batchid:e.task_batchid,
              arg_task_wf_batchid:e.task_wf_batchid,
            }
          });
        }
        else if(e.task_type === 'week_timesheet_back' || e.task_type ==='makeup_timesheet_back' ){
          dispatch(routerRedux.push({
            pathname:'/projectApp/timesheetManage/fillSendBack',
            query: {
              begin_time:e.begin_time,
              end_time:e.end_time,
              proj_code:e.proj_code,
              proj_name:e.proj_name,
              approved_status:e.approved_status,
              task_type:e.task_type,
            }
          }));
        }
        else if(e.task_type ==='pm_week_timesheet_check'){
          dispatch(routerRedux.push({
            pathname:'/projectApp/timesheetManage/timesheetCheck' ,
            query: {
              begin_time:e.begin_time,
              end_time:e.end_time,
              proj_code:e.proj_code,
              proj_name:e.proj_name,
              approved_status:e.approved_status,
              task_type:e.task_type,
              proj_id:e.proj_id,
            }
          }));
        }
        else if(e.task_type ==='pm_makeup_timesheet_check'){
          dispatch(routerRedux.push({
            pathname:'/projectApp/timesheetManage/timesheetMakeupCheckPm' ,
            query: {
              begin_time:e.begin_time,
              end_time:e.end_time,
              proj_code:e.proj_code,
              proj_name:e.proj_name,
              approved_status:e.approved_status,
              task_type:e.task_type,
              proj_id:e.proj_id,
            }
          }));
        }
        else if(e.task_type ==='dm_makeup_timesheet_check'){
          dispatch(routerRedux.push({
            pathname:'/projectApp/timesheetManage/timesheetMakeupCheckDm' ,
          }));
        }
        else if(e.fundingBudgetTask === 'funding_budget_task'){
          dispatch(routerRedux.push({
            pathname:'/financeApp/funding_plan/funding_plan_review' ,
          }));
        }else if(e.fundingBudgetTask === 'funding_budget_task_reject'){
          if(e.ReportType === '1'){
            dispatch(routerRedux.push({
              pathname:'/financeApp/funding_plan/funding_plan_fill' ,
            }));
          }else{
            dispatch(routerRedux.push({
              pathname:'/financeApp/funding_plan/funding_plan_append_fill' ,
            }));
          }
        }
        else if(e.proj_code) {
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
          window.open('/ProjectManage/index.html#/mainpage/ts_timesheet/ts_mydeal?moduleId=0', '_blank')
        }
        //新闻点击跳转
        if(e.projApply){
          dispatch(routerRedux.push({
            pathname: '/adminApp/newsOne/myReview', //新闻
          }));
        }

    };
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：tabClick事件
     * @param e 点击事件默认参数
     */
    const handleTabClick = e => {
        dispatch({
            type:'task/getUserId',
            payload:e
        })
    };

    const getData = (value) => {
      const type = value.target.value;
      if(type === 'undo') {
        dispatch(routerRedux.push({
          pathname:'/taskList'
        }));

      } else if(type === 'notice') {
        dispatch(routerRedux.push({
          pathname:'/noticeList'
        }));
      } else if(type === 'draft') {
        dispatch(routerRedux.push({
          pathname:'/draftList'
        }));
      }
    };

    return (
      <Spin spinning={loading}>
        <div className={styles['pageContainer']}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>我的工作台</Breadcrumb.Item>
          </Breadcrumb>
          <Radio.Group className={styles.radioButton} value="undo"
                       onChange={value => getData(value)}>
            <Radio.Button value="undo">
              <div style={{ display: 'flex', alignItems: 'center'}}>
                <span>待办</span><Badge count={unDoListCount} style={{ fontSize: '12px', marginLeft: '2px'}}/>
              </div>
            </Radio.Button>
            <Radio.Button value="notice">
              <div style={{ display: 'flex', alignItems: 'center'}}>
                <span>消息</span><Badge count={unReadListCount} style={{ fontSize: '12px', marginLeft: '2px'}}/>
              </div>
            </Radio.Button>
            <Radio.Button value="draft">草稿</Radio.Button>
          </Radio.Group>
          <h2 style={{textAlign:'center'}}>待办列表</h2>
          <Tabs defaultActiveKey="taskListQuery" onChange={handleTabClick}>
            <TabPane tab="我的待办" key="taskListQuery">
              <p>共{taskList.length}条待办记录</p>

              <Table rowKey='task_id'
                     loading = {loading}
                     showHeader={false}
                     columns={columns}
                     dataSource={taskList}
                     onRowClick={(e)=>{handleTableClick(e,0)}}
                />

            </TabPane>
            <TabPane tab="我的已办" key="taskingListQuery">
              <p>共{taskList.length}条已办记录</p>
              <Table rowKey='task_id'
                     loading = {loading}
                     showHeader={false}
                     columns={columns}
                     dataSource={taskList}
                     onRowClick={(e)=>{handleTableClick(e,1)}}
                />
            </TabPane>
            <TabPane tab="我的办结" key="taskedListQuery">
              <p>共{taskList.length}条办结记录</p>
              <Table rowKey='task_id'
                     loading = {loading}
                     showHeader={false}
                     columns={columns}
                     dataSource={taskList}
                     onRowClick={(e)=>{handleTableClick(e,3)}}
                />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
}
function mapStateToProps(state) {
    const {taskList, backlogFlag, unDoListCount, unReadListCount} =state.task;
    return {
        loading: state.loading.models.task,
        taskList,
        backlogFlag,
        unDoListCount,
        unReadListCount
    };
}
export default connect(mapStateToProps)(TaskList);
