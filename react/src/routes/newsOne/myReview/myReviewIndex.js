/**
 * 作者：郭银龙
 * 日期：2020-10-26
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：我的审核
 */
 
import React from 'react';
import {connect } from 'dva';
// import Cookie from 'js-cookie';
import styles from '../style.less';
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
            <p style={{color: arg_state.pass=="2"?"red":""}}>
            {
                    <span style={{marginLeft: '5px' ,withWidth:"80vw"}}>
                        <span style={{float:"left"}}>
                          <b style={{marginRight:'5px'}}>[新闻管理]</b>
            <b style={{marginRight: '5px'}}>
              {arg_state.projApply.createName}
            </b>
            提交的
            <b style={{marginLeft: '5px',marginRight: '5px'}}>
            { arg_state.projApply.businessType==0?"稿件":(
                arg_state.projApply.businessType==1?"稿件复核":(
                  arg_state.projApply.businessType==2?"舆情":(
                    arg_state.projApply.businessType==3?"案例经验分享":(
                      arg_state.projApply.businessType==4?"新闻工作报告":(
                        arg_state.projApply.businessType==5?"宣传渠道备案":(
                          arg_state.projApply.businessType==6?"加分项":(
                            arg_state.projApply.businessType==7?"培训":(
                              arg_state.projApply.businessType==8?"重大活动支撑":(
                                arg_state.projApply.businessType==9?"宣传组织审核":""
                              )
                            )
                          )
                        )
                      )
                    )
                  )
              )
            )}
            审核申请
            </b>
            
             {
              arg_state.lastCommentDetail?"因" + arg_state.lastCommentDetail:""
             }
            {arg_state.pass=="0"?"待审核":(
                arg_state.pass=="1"?"审批中":(
                  arg_state.pass=="2"?"被退回":""
                ))} 
               
               
                
                        </span>
                                 <span style={{float:"right"}}>
                                          <b>{arg_state.projApply.createTime==null?"":arg_state.projApply.createTime.substring(0,16)}</b>
                                </span>
                   </span> 
            }
          </p>}

    }
  }
];
const columns2 = [
  {
    title: '标题',
    dataIndex: 'task_content',
    className: 'left',
    render: (text, arg_state) => {
        return {children:
            <p >
            {
                    <span style={{marginLeft: '5px' ,withWidth:"80vw"}}>
                        <span style={{float:"left"}}>
                          <b style={{marginRight:'5px'}}>[新闻管理]</b>
                         <b>
                         <span style={{fontWeight:900}}> {arg_state.projApply.createName} </span>
                              提交的
                              { arg_state.projApply.businessType==0?"稿件":(
                                  arg_state.projApply.businessType==1?"稿件复核":(
                                    arg_state.projApply.businessType==2?"舆情":(
                                      arg_state.projApply.businessType==3?"案例经验分享":(
                                        arg_state.projApply.businessType==4?"新闻工作报告":(
                                          arg_state.projApply.businessType==5?"宣传渠道备案":(
                                            arg_state.projApply.businessType==6?"加分项":(
                                              arg_state.projApply.businessType==7?"培训":(
                                                arg_state.projApply.businessType==8?"重大活动支撑":(
                                                  arg_state.projApply.businessType==9?"宣传组织审核":""
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                )
                              )}
                           </b>
                        </span>
                                 <span style={{float:"right"}}>
                                 <b>{arg_state.projApply.createTime==null?"":arg_state.projApply.createTime.substring(0,16)}</b>
                                </span>
                   </span> 
            }
          </p>}

    }
  }
];
const columns3 = [
  {
    title: '标题',
    dataIndex: 'task_content',
    className: 'left',
    render: (text, arg_state) => {
        return {children:
            <p >
            {
                    <span style={{marginLeft: '5px' ,withWidth:"80vw"}}>
                        <span style={{float:"left"}}>
                          <b style={{marginRight:'5px'}}>[新闻管理]</b>
                         <b>
                         {arg_state.projApply.createName}
                              提交的
                              { arg_state.projApply.businessType==0?"稿件":(
                                  arg_state.projApply.businessType==1?"稿件复核":(
                                    arg_state.projApply.businessType==2?"舆情":(
                                      arg_state.projApply.businessType==3?"案例经验分享":(
                                        arg_state.projApply.businessType==4?"新闻工作报告":(
                                          arg_state.projApply.businessType==5?"宣传渠道备案":(
                                            arg_state.projApply.businessType==6?"加分项":(
                                              arg_state.projApply.businessType==7?"培训":(
                                                arg_state.projApply.businessType==8?"重大活动支撑":(
                                                  arg_state.projApply.businessType==9?"宣传组织审核":""
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                )
                              )}
                           </b>
                        </span>
                                 <span style={{float:"right"}}>
                                 <b>{arg_state.projApply.createTime==null?"":arg_state.projApply.createTime.substring(0,16)}</b>
                                </span>
                   </span> 
            }
          </p>}

    }
  }
];



class myReview extends React.Component {
  state={
    ontabs:"0" 
  }

 
  callback=(e)=> {
   if(e=="1"){
    this.props. dispatch({
        type:"myReview/taskListSearch",
        })
   }else if(e=="2"){
    this.props. dispatch({
      type:"myReview/completeListSearch",
    })
   }else if(e=="3"){
    this.props. dispatch({
      type:"myReview/finishedListSearch",
    })
   }
  
  }
changePage = (page) => { //分页
this.props. dispatch({
    type:"myReview/taskListSearch",
    page
    })
}
changePage2 = (page) => { //分页
  this.props. dispatch({
    type:"myReview/completeListSearch",
    page 
  })
}
changePage3 = (page) => { //分页
    this.props. dispatch({
      type:"myReview/finishedListSearch",
      page 
    })
  }
  
  //通报审批,统计审批,整改通知,整改通知,员工自查,安全检查反馈,员工督查,安全检查任务
  handleTableClick = (e,flag) => { 
          if(e.projApply.businessType=="0"){
      if(e.pass=="0"||e.pass=="1"){
        //待审核
          this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/manuscriptManagement/manuscriptDetails',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }else if(e.pass=="2"){
        //待修改
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/manuscriptManagement/manuscriptRevision',
            query: {
              newsId:JSON.parse(JSON.stringify(e.approvalId)),
              difference:"审核"
            }
          }));
      }
    }else if(e.projApply.businessType==="1"){
      if(e.pass=="0"|| e.pass=="1"){
         //待审核
         this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/statisticalReport/manuscriptReviewDetail',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));

      }else if(e.pass=="2"){
         //待修改
         this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/statisticalReport/newSetManuscriptReview',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));

      }
      
    }else if(e.projApply.businessType=="2"){
      if(e.pass=="0"|| e.pass=="1"){
        //待审核
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/opinionManagementIndex/opinionReport',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }else if(e.pass=="2"){
        //待修改
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/opinionManagementIndex/opinionModify',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }
    }else if(e.projApply.businessType=="3"){
      if(e.pass=="0"|| e.pass=="1"){
         //待审核
         this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/experienceSharingIndex/experienceSharingDetails',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));

      }else if(e.pass=="2"){
      //待修改
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/experienceSharingIndex/experienceSharingReset',
        query: {
          approvalId:JSON.parse(JSON.stringify(e.approvalId)),
          difference:"审核"
        }
      }));
      }
     
    }else if(e.projApply.businessType=="4"){
      if(e.pass=="0"|| e.pass=="1"){
         //待审核
         this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/creatExcellence/newsReportDetail',
          query: {
            record:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));

      }else if(e.pass=="2"){
    //待修改
    this.props.dispatch(routerRedux.push({
      pathname:'/adminApp/newsOne/creatExcellence/newsReportModify',
      query: {
        record:JSON.parse(JSON.stringify(e.approvalId)),
        difference:"审核"
      }
    }));
      }
    }else if(e.projApply.businessType=="5"){
      if(e.pass=="0"|| e.pass=="1"){
         //待审核
         this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/publicityChannelsIndex/publicityChannelsDetails',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }else if(e.pass=="2"){
         //待修改
         this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/publicityChannelsIndex/publicityChannelsReset',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }
    }else if(e.projApply.businessType=="6"){
      //待审核
      if(e.pass=="0"|| e.pass=="1"){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/statisticalReport/bonusDetail',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }else if(e.pass=="2"){
        //待修改
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/statisticalReport/newSetBonus',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }
    }else if(e.projApply.businessType=="7" ){
      if(e.pass=="0"|| e.pass=="1"){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainingRecordIndex/trainRecordDetail',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          } 
        }));
      }else if(e.pass=="2"){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppModify',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }
    }else if(e.projApply.businessType=="8"){
      //待审核
      if(e.pass=="0"|| e.pass=="1"){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportDetail',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }else if(e.pass=="2"){
        //待修改
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportModify',
          query: {
            approvalId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));

      }
    }else if(e.projApply.businessType=="9"){
      if(e.pass=="0"|| e.pass=="1"){
        //待审核
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/statisticalReport/publicityDetail',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }else if(e.pass=="2"){
        //待修改
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/statisticalReport/newSetPublicity',
          query: {
            newsId:JSON.parse(JSON.stringify(e.approvalId)),
            difference:"审核"
          }
        }));
      }
    }
  };
  render(){
    const {taskList, completeList,finishedList,allCount,pageSize,pageCurrent,allCount2,pageSize2,pageCurrent2,allCount3,pageSize3,pageCurrent3} = this.props
    return (
      <div className={styles['pageContainer']}>
        <h2 style={{textAlign:'center'}}>我的审核</h2>
        <Tabs 
        // defaultActiveKey={this.state.ontabs=="0"?"1":"2"}
        onTabClick={(e)=>this.callback(e,0)}
        >
          <TabPane tab="我的待办" key="1">
            <p>共{allCount?allCount:"0"}条待办记录</p>
            <Table rowKey='task_id'
                   showHeader={false}
                   columns={columns}
                   dataSource={taskList}
                   onRowClick={(e)=>this.handleTableClick(e,0)}
                   pagination={false}
            />
            <Pagination
                  current = {pageCurrent?pageCurrent:1}
                  pageSize = {pageSize?pageSize:10}
                  total = {allCount?allCount:0}
                  onChange = {this.changePage}
                  style = {{textAlign: 'center', marginTop: '20px'}}
                  />
          </TabPane>
          <TabPane tab="我的已办" key="2">
            <p>共{allCount2?allCount2:"0"}条已办记录</p>
            <Table rowKey='task_id2' 
                   showHeader={false}
                   columns={columns2}
                   dataSource={completeList}
                   onRowClick={(e)=>this.handleTableClick(e,1)}
                   pagination={false}
                   
                   />
                    <Pagination
                   current = {pageCurrent2?pageCurrent2:1}
                   pageSize = {pageSize2?pageSize2:10}
                   total = {allCount2?allCount2:0}
                   onChange = {this.changePage2}
                   style = {{textAlign: 'center', marginTop: '20px'}}
                   />
          </TabPane>
          <TabPane tab="我的办结" key="3">
            <p>共{allCount3?allCount3:"0"}条已办记录</p>
            <Table rowKey='task_id3' 
                   showHeader={false}
                   columns={columns3}
                   dataSource={finishedList}
                   onRowClick={(e)=>this.handleTableClick(e,2)}
                   pagination={false}
                   
                   />
                    <Pagination
                   current = {pageCurrent3?pageCurrent3:1}
                   pageSize = {pageSize3?pageSize3:10}
                   total = {allCount3?allCount3:0}
                   onChange = {this.changePage3}
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
    loading: state.loading.models.myReview,
    ...state.myReview
  };
}
export default connect(mapStateToProps)(myReview);
