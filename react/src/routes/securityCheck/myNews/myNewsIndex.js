/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：消息首页配置
 */
 
import React from 'react';
import {connect } from 'dva';
// import Cookie from 'js-cookie';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import { Table, Tabs, Breadcrumb, List,Pagination} from "antd";
import withWidth from 'material-ui/utils/withWidth';
const { TabPane } = Tabs;

const columns = [
  {
    title: '标题',
    dataIndex: 'task_content',
    className: 'left',
    render: (text, arg_state) => {
        return {children:
            <p>
          
            {
                    <span style={{marginLeft: '5px' ,withWidth:"80vw"}}>

                          <b style={{marginRight:'5px'}}>[{arg_state.informationType}]</b>

                            来自 <b>{ arg_state.createUserName }</b>&nbsp;提交的消息
                                <span style={{float:"right"}}>
                                          <b>{arg_state.updateTime==null?"":arg_state.updateTime.substring(0,16)}</b>
                                </span>
                   </span> 
            }
          </p>}

    }
  }
];



class myNews extends React.Component {
  state={
    ontabs:"0" 
  }

 
  callback=(e)=> {
   if(e=="taskListQuery"){
        this.props. dispatch({
            type:"myNews/taskListSearch",
          })
   }else if(e=="taskingListQuery"){
    this.props. dispatch({
      type:"myNews/completeListSearch",
    })
   }
  
  }
  changePage = (page) => { //分页
   
   
    this.props. dispatch({
        type:"myNews/taskListSearch",
        page
   
      })

}
changePagetwo = (page) => { //分页
  this.props. dispatch({
    type:"tongzhitongbaolist/sendListSearch",
    page 
  })

}
  
  //通报审批,统计审批,整改通知,整改通知,员工自查,安全检查反馈,员工督查,安全检查任务
  handleTableClick = (e,flag) => { 
    // console.log(e,flag,3,4);
    if(e.informationType==="员工自查"){
      // console.log('员工自查任务')
      this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/securityCheck/myNews/rectificationNotice',
          query: {
            arg_state:JSON.parse(JSON.stringify(e.infoId))
          }
        }));
       

    }else if(e.informationType==="安全检查任务"){
        // console.log('安全检查任务')
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/securityCheck/myNews/modifyTask',
            query: {
              arg_state:JSON.parse(JSON.stringify(e.infoId))
              
            }
          }));
       
    }else if(e.informationType==="整改通知"){
        // console.log('整改通知')
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/securityCheck/myNews/safetyTask',
      
            query: {
              arg_state:JSON.parse(JSON.stringify(e.infoId))
            }
          }));
    }else if(e.informationType==="安全检查任务"){
      // console.log('安全检查任务')
        this.props.dispatch(routerRedux.push({
                    pathname:'/adminApp/securityCheck/myNews/modifyTask',
              
                    query: {
                      arg_state:JSON.parse(JSON.stringify(e.infoId)),
                    }
                  }));
  }else if(e.informationType==="安全检查反馈"){
  // console.log('整改反馈消息')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/myNews/rectificationFeedback',
      query: {
        arg_state:JSON.parse(JSON.stringify(e.infoId))
      }
    }));
}else if(e.informationType==="员工督察"){
  // console.log('员工督查反馈消息')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/myNews/staffSupervision',
      query: {
        arg_state:JSON.parse(JSON.stringify(e.infoId))
      }
    }));
}else if(e.informationType==="安全检查反馈"){
  // console.log('对不合格反馈的整改')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/myNews/unqualifiedFeedback',
      query: {
        arg_state:JSON.parse(JSON.stringify(e.infoId))
      }
    }));
}else if(e.informationType==="通报审批" ){
  // console.log('通报意见征求反馈')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/myNews/requestForNotification',
      query: {
        arg_state:JSON.parse(JSON.stringify(e.infoId))
      }
    }));
}else if(e.informationType==="统计审批"){
  // console.log('审批统计报告')
  this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/securityCheck/myNews/approvalStatistics',
      query: {
        arg_state:JSON.parse(JSON.stringify(e.infoId))
      }
    }));
}
  };
  componentWillMount(){
    this.setState({
      ontabs:this.props.location.query.ontabs!=undefined?this.props.location.query.ontabs:"0"
    })
  }
  render(){
    const {taskList, completeList,allCount,arg_page_size,arg_page_current,allCount2,arg_page_size2,arg_page_current2} = this.props

    return (
      <div className={styles['pageContainer']}>
        <h2 style={{textAlign:'center'}}>我的消息</h2>
        <Tabs 
        defaultActiveKey={this.state.ontabs=="0"?"taskListQuery":"taskingListQuery"}
        
        onTabClick={(e)=>this.callback(e,0)}
        >
          <TabPane tab="我的待办" key="taskListQuery">
            <p>共{allCount}条待办记录</p>

            <Table rowKey='task_id1'
                   showHeader={false}
                   columns={columns}
                   dataSource={taskList}
                   onRowClick={(e)=>this.handleTableClick(e,0)}
                   pagination={false}
            />
            <Pagination
                        current = {arg_page_current!=""?arg_page_current:1}
                        pageSize = {arg_page_size!=""?arg_page_size:1}
                        total = {allCount!=""?allCount:1}
                        onChange = {this.changePage}
                        style = {{textAlign: 'center', marginTop: '20px'}}
                        />
          </TabPane>
          <TabPane tab="我的已办" key="taskingListQuery">
            <p>共{allCount2}条已办记录</p>
            <Table rowKey='task_id2' 
                   showHeader={false}
                   columns={columns}
                   dataSource={completeList}
                   onRowClick={(e)=>this.handleTableClick(e,1)}
                   pagination={false}
                   
                   />
                    <Pagination
                   current = {arg_page_current2!=""?arg_page_current2:1}
                   pageSize = {arg_page_size2!=""?arg_page_size2:1}
                   total = {allCount2!=""?allCount2:1}
                   onChange = {this.changePagetwo}
                   style = {{textAlign: 'center', marginTop: '20px'}}
                   />
          </TabPane>
        </Tabs>
      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.myNews,
    ...state.myNews
  };
}
export default connect(mapStateToProps)(myNews);
