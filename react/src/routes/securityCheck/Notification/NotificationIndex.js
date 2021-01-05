/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：通知通报
 */
 

import React from 'react';
import {connect } from 'dva';
// import Cookie from 'js-cookie';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import { Table, Tabs, Breadcrumb, List,Pagination} from "antd";
import withWidth from 'material-ui/utils/withWidth';
import { set } from 'js-cookie';
const TabPane = Tabs.TabPane;

const columns = [
  {
    title: '标题',
    dataIndex: 'task_content',
    className: 'left',
    render: (text, arg_state) => {
        return {children:
            <p>
                {
                        <span  className={styles.tongz} style={{marginLeft: '5px' ,withWidth:"800px",textAlign:"left"}}>
                              <b style={{marginRight:'5px'}}>[{arg_state.notificationType}]</b>
                        来自 <b>{arg_state.createUserName}</b>&nbsp;的通知
                            <span style={{float:"right"}}>
                                <b>{arg_state.createTime.substring(0,10)}</b>
                            </span>
                      </span> 
                }
              </p>}

    }
  }
];




class tongzhitongbaolist extends React.Component {
  state =  {
   ontabs:"1"
  
};
 
  callback=(e)=> {

   if(e=="taskListQuery"){
  
        this.props. dispatch({
            type:"tongzhitongbaolist/rogerthatListSearch",
           
       
          })
   }else if(e=="taskingListQuery"){


    this.props. dispatch({
      type:"tongzhitongbaolist/sendListSearch",
      
       
    })
   }
  
  }
 
  changePage = (page) => { //分页
   
   
      this.props. dispatch({
          type:"tongzhitongbaolist/rogerthatListSearch",
          page
     
        })

  }
  changePagetwo = (page) => { //分页
    this.props. dispatch({
      type:"tongzhitongbaolist/sendListSearch",
      page 
    })
 
  }
  handleTableClick = (e,flag) => {
    // console.log(e,flag,3,4);
    if(e.notificationType==="安全检查通知"){

        // console.log('安全检查通知')
        this.props.dispatch(routerRedux.push({
                    pathname:'/adminApp/securityCheck/Notification/checkNotice',
              
                    query: {
                      
                      argNotificationId:JSON.parse(JSON.stringify(e.notificationId)),
                    }
                  }));

    }else if(e.notificationType==="通报审批意见"){
        // console.log('通报审批意见')
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/securityCheck/Notification/tongBaoYiJian',
            query: {
              argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
            }
          }));
       
    }else if(e.notificationType==="检查上报"){
        // console.log('检查上报')
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/securityCheck/Notification/lnterfaceReport',
      
            query: {
              argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
            }
          }));
    }else if(e.notificationType==="统计审批意见"){
      // console.log('统计审批意见')
      this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/securityCheck/Notification/leaderApproval',
          query: {
            argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
          }
        }));
    }else if(e.notificationType==="统计报告"){
    // console.log('统计报告')
    this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/securityCheck/Notification/branchStatisticsReport',
        query: {
          argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
        }
      }));
    }else if(e.notificationType==="督查整改意见"){
  // console.log('督查整改意见')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/Notification/lnspectionRecommendations',
      query: {
        argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
      }
    }));
    }else if(e.notificationType==="督查消息抄送"){
  // console.log('督查消息抄送')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/Notification/employeeInspection',
      query: {
        argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
      }
    }));
    }else if(e.notificationType==="表扬"){ 
  // console.log('表扬')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/Notification/praise',
      query: {
        argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
      }
    }));
    }else if(e.notificationType==="整改结果"){ 
  // console.log('表扬')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/Notification/rectificationResults',
      query: {
        argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
      }
    }));
    }else if(e.notificationType==="检查通报"){
      // console.log('检查通报')
      this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/securityCheck/Notification/bulletin',
          query: {
            argNotificationId:JSON.parse(JSON.stringify(e.notificationId))
          }
        }));
    }
  }; 
  componentWillMount(){
    console.log(this.props.location.query.ontabs)
    this.setState({
      ontabs:this.props.location.query.ontabs!=undefined?this.props.location.query.ontabs:"1"
    })
  }
  render(){
    const{rogerthatList,sendList,allCount,sendallCount}=this.props
    
    return (
      <div className={styles['pageContainer']}>
        <h2 style={{textAlign:'center'}}>我的通知/通报</h2>
        {/* {rogerthatList.length>0||sendList.length>0? */}
        

    
        <Tabs 
        defaultActiveKey={this.state.ontabs=="1"?"taskListQuery":"taskingListQuery"}
        onTabClick={(e)=>this.callback(e,0)}
        >

          <TabPane tab="我收到的" key="taskListQuery">
            <p>共{allCount}条收到记录</p>

            <Table rowKey='task_id1'  
                   showHeader={false}
                   columns={columns}
                   dataSource={rogerthatList}
                   onRowClick={(e)=>this.handleTableClick(e,0)}
                   pagination={false}
                   
                   
            />
            <Pagination
            current = {this.props.pageCurrent!=""?this.props.pageCurrent:1}
            pageSize = {10}
            total = {this.props.allCount!=""?this.props.allCount:1}
            onChange = {this.changePage}
            style = {{textAlign: 'center', marginTop: '20px'}}
            />
          </TabPane>
          <TabPane tab="我发送的" key="taskingListQuery">
            <p>共{sendallCount}条发送记录</p>
            <Table rowKey='task_id2' 
                   showHeader={false}
                   columns={columns}
                   dataSource={sendList}
                   onRowClick={(e)=>this.handleTableClick(e,1)}
                   pagination={false}
                   
            />
             <Pagination
            current = {this.props.sendpageCurrent!=""?this.props.sendpageCurrent:1}
            pageSize = {10}
            total = {this.props.sendallCount!=""?this.props.sendallCount:1}
            onChange = {this.changePagetwo}
            style = {{textAlign: 'center', marginTop: '20px'}}
            />
           
          </TabPane>
          
        </Tabs>
        
          {/* :""} */}
      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.tongzhitongbaolist,
    ...state.tongzhitongbaolist
  };
}
export default connect(mapStateToProps)(tongzhitongbaolist);
