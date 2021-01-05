/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页列表组件
 */
import React from 'react';
import { Link } from 'dva/router';
import Cookie from 'js-cookie';
import {Menu, Dropdown, Button, Icon,Spin,Table} from 'antd';
import styles from './mainpageUl.css';
import { routerRedux } from 'dva/router';
class MainpageUl extends React.Component {
  handleMenuClick(i,tag){
    const dispatch =this.props.action;
    if(tag=='0'){
      if(i['read_flag']=='0'){
        // 设为已读
        dispatch({
          type:'commonApp/messageReadFlag',
          formData:{
            'arg_staff_id':Cookie.get('userid'),
            'arg_mess_id':i.mess_id,
            'arg_page_size':5,
            'arg_page_current':1,
            'arg_mess_staff_name_from':''
          }
        });
      }else{
        // 设为未读
        dispatch({
          type:'commonApp/messageNotRead',
          formData:{
            'arg_staff_id':Cookie.get('userid'),
            'arg_mess_id':i.mess_id,
            'arg_page_size':5,
            'arg_page_current':1,
            'arg_mess_staff_name_from':''
          }
        });
      }
    }else if(tag=='1'){
      // 删除消息
      dispatch({
        type:'commonApp/messageDelete',
        formData:{
          'mess_status':'1',
          'mess_id':i.mess_id,
          'arg_page_size':5,
          'arg_page_current':1,
          'arg_mess_staff_name_from':''
        }
      });
    }

  }
  columns(){
     return [
         {
             title: '标题',
             dataIndex: 'task_content',
             className: 'left',
             render: (text, record) => {
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
               let taskName = '';
               switch (record.task_type) {
                   case '0':
                   case '999':
                       switch (record.task_status) {
                           case '0':
                              if(record.hasOwnProperty('taskui_url')) {
                                if(record.taskui_url === '/travelBudgetChangeReturn' || record.taskui_url === '/travelBudgetChangeReview') {
                                  taskName += '的差旅费预算变更';
                                }
                              }
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
                               taskName += (record.task_content.tag === "3" ? '考核指标 被'+record.task_staff_name_from+'退回，请修改' : '考核指标 需要您审核');
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
               }
                 if(record.proj_code){
                     return {children:<p className={styles["col-sql"]}><b>[工时管理]</b><span style={{marginLeft:'5px'}}>{record.sta_type}</span></p>}
                 }else if(record.teamId){
                    return {children:<p><b>[资金计划]</b><span style={{marginLeft:'5px'}}>{record.needDealMessage}</span></p>}
                  }else{
                     return {
                         children:
                           record.task_type === '3' && record.task_proj_sub === '31'?
                             <p className={styles["remind"]}>[中层考核]考核评价已启动，请点击此处进行评价！</p>
                             :
                           <p className={styles["col-sql"]}>
                             <b className={styles['space']}>{'['+ record.task_proj_sub_show +']'}</b>
                             <b className={styles['space']}>{(record.task_content.tag=="3" ? '您' : record.task_content.create_byname)}</b>
                             <span>{actionName}</span>
                             <b className={styles['space']}>{record.task_content.content}</b>
                             <span>{taskName}</span>
                         </p>
                     }
                 }
             }
         }, {
              title: '日期',
              dataIndex: 'sortDate',
              render: (text, record) => {
                  let data = text.split(' ');
                  return {children:<p>{data.length ? data[0] : text}</p>}
              }
          }
      ];
  }
  handleTableClick = (e,flag) => {
      const dispatch =this.props.action;
      if(e.task_type === '3' && e.task_proj_sub === '31'){
        dispatch(routerRedux.push({
          pathname:'/humanApp/leader/value'
        }));
      }

      if(e.task_type === '2' && e.task_proj_sub === '2'){
        if(e.task_content.tag == '5') {
          dispatch({
            type:'commonApp/taskProKpiPage',
            param:{
              pm_id:e.task_content.create_byid,
              year:e.task_param.arg_year,
              season:e.task_param.arg_season,
              check_batchid:e.task_wf_batchid,
              task_id:e.task_id,
              pro_id:e.task_param.arg_proj_id
            }
          });
        }else if(e.task_content.tag == '3') {
              dispatch(routerRedux.push({
                  pathname:'/projectApp/projexam/kpifeedback',
                  query:{
                          check_id:e.task_param.arg_task_current_id
                  }
              }));
          } else {
              dispatch({
                  type:'commonApp/taskProKpiPage',
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

      }
      if (e.task_type === '998') {
          dispatch({
              type:'commonApp/taskPartnerPage',
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
              type:'commonApp/taskTeamManagePage',
              payload:{
                'arg_proj_id':e.proj_id,
                'arg_opt':e.opt,
                'arg_team_batchid':e.team_batchid,
                'flag':flag
              }
          });
      } else if (e.task_type === '2' && e.task_proj_sub=='1') {
          dispatch({
              type:'commonApp/taskASPage',
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
              type:'commonApp/taskDetailPage',
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
        if(e.taskui_url === '/travelBudgetChangeReview') {
          dispatch(routerRedux.push({
            pathname: '/travelBudgetChangeReview',
            query: {
              arg_proj_id: e.task_param.arg_proj_id,
              arg_check_id: e.task_param.arg_check_id,
              arg_proj_uid: e.task_param.arg_proj_uid,
              arg_task_uuid: e.task_uuid,
              arg_task_batchid: e.task_batchid,
              arg_task_wf_batchid: e.task_wf_batchid,
            }
          }));
        }
        else if(e.taskui_url == '/travelBudgetChangeReturn') {
          dispatch(routerRedux.push({
            pathname: '/travelBudgetChangeReturn',
            query: {
              arg_proj_id: e.task_param.arg_proj_id,
              arg_check_id: e.task_param.arg_check_id,
              arg_proj_uid: e.task_param.arg_proj_uid,
              arg_task_uuid: e.task_uuid,
              arg_task_batchid: e.task_batchid,
              arg_task_wf_batchid: e.task_wf_batchid,
            }
          }));
        }
        else {
          dispatch({
            type:'commonApp/changeCheck',
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
      else if(e.task_proj_sub=='4'&& e.task_type=='0'&& e.task_content.module_type=='0'){
        dispatch({
          type:'commonApp/deliverableCheck',
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
      else if(e.task_proj_sub === '6' && e.task_type === '0'){
        //task_type ,0:项目 ， task_proj_sub，6 ：TMO修改全成本
        dispatch({
          type:'commonApp/modifyFullcostCheck',
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
          if(!window.localStorage.timesheetModuleList){
              dispatch({
                  type:'commonApp/timeSheetList',
                  formData:{
                      "argtenantid": '10010',
                      "argtpid": 'db2904cfb38311e6a01d02429ca3c6ff',
                      "arguserid": Cookie.get('userid')
                  }
              })
          }
          //window.open('/ProjectManage/index.html#/mainpage/ts_timesheet/ts_mydeal?moduleId=0','_blank')
      }
  };
  render () {
    const { title,infoList,hasMore,dataKey,rightContent,leftContent,backTitle,activeClassFlag}=this.props;

    return (
      <div className={this.props.className||styles['maingageMessage']}>
        <div style={{background:this.props.background}} className={backTitle?styles['messageAndBacklog']:''}>
          <b className={this.props.activeClassFlag==1?(backTitle?styles['activeMessageOrBacklog']:''):''} onClick={this.props.onClickBacklog} style={{fontSize:'16px'}}>{backTitle?'待办':''}</b>
          <b className={this.props.activeClassFlag==0?(backTitle?styles['activeMessageOrBacklog']:''):''} onClick={this.props.onClickMessage} style={{fontSize:'16px'}}>{title}</b>
          {hasMore?<span><Link to={this.props.getMoreUrl} style={{color:'#fff'}}>更多</Link></span>:''}
        </div>
        {infoList.length == 0
            ?
            <ul className={styles[this.props.listStyle]}>{this.props.loadFlag?<li><Spin/></li>:<li>查询无记录</li>}</ul>
            :
            activeClassFlag ?
            <Table rowKey='task_id' className={styles['tableBg']}
                showHeader={false}
                columns={this.columns()}
                pagination={false}
                dataSource={infoList}
                onRowClick={(e)=>{this.handleTableClick(e,0)}}
            /> :
            <ul className={styles[this.props.listStyle]}>
              {infoList.map((i,indexP)=><li key={indexP} >
                {dataKey.map((k,index)=>k==rightContent?
                    <span key={index} style={{float:'right'}}>
                      {i[k]}
                      {this.props.hasDroopDown?
                        <span>
                          {this.props.activeClassFlag==0?
                            <span>
                            <a onClick={()=>this.handleMenuClick(i,'0')} style={{margin:'0 10px'}}>{i['read_flag']=='0'?'设为已读':'设为未读'}</a>
                            <a onClick={()=>this.handleMenuClick(i,'1')}>删除</a>
                            </span>:''}</span>:''}
                    </span>
                    :
                    (k==leftContent)?
                    <span title={i[k]} key={k} className={styles['fileStyle']}>{i[k]}</span>
                    :
                    <a key={'a'+index} onClick={()=>this.props.lookDetail(i)} className={i['read_flag']=='1'?styles['MessageReadFlag']:''}>
                        <span title={i[k]} style={{float:'center',width:this.props.leftContentWidth}} className={styles['leftContent']}>{i[k]}</span>
                    </a>

                  )}
              </li>)}
            </ul>
        }


        <div style={{clear:'both'}}></div>
      </div>
    )
  }
}

MainpageUl.propTypes={
  title:React.PropTypes.string,
  infoList:React.PropTypes.array
}

export default MainpageUl;
