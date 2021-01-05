/**
 * 作者：贾茹
 * 日期：2019-9-9
 * 邮箱：m18311475903@163.com
 * 功能：我的审批
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './task.less';
import { routerRedux } from 'dva/router';
import { Table, Tabs, Breadcrumb, List} from "antd";
const TabPane = Tabs.TabPane;
const columns = [
  {
    title: '标题',
    dataIndex: 'task_content',
    className: 'left',
    render: (text, record) => {


        return {children:
            <p>
            <b style={{marginRight:'5px'}}>[印章证照管理]</b>
            {
              record.list_state === "0" ?
                record.form_check_state === "4" || record.form_check_state === "7" || record.form_check_state === "10" || record.form_check_state === "13" || record.form_check_state === "16" || record.form_check_state === "19" || record.form_check_state === "22" ?
                  <span style={{marginLeft: '5px'}}>
                      <b>您</b>&nbsp;提交的&nbsp;
                    <b>{record.form_title.slice(0, -2)}  </b>被退回
                  </span>
                  :
                  <span style={{marginLeft: '5px'}}>
                      <b>{record.screate_user_name}</b>&nbsp;
                      提交的&nbsp;
                      <b>{record.form_title.slice(0, -2)} </b> 需要您审核
                  </span>

              :
              record.list_state === "1" ?
                record.form_check_state === "1" ?
                  <span style={{marginLeft: '5px'}}>
                      您提交的
                      &nbsp;
                    <b>{record.form_title.slice(0, -2)} </b>&nbsp;正在审核中
                </span>
                  :
                <span style={{marginLeft: '5px'}}>
                      您已通过
                      <b>{record.screate_user_name}</b>&nbsp;
                          提交的&nbsp;
                      <b>{record.form_title.slice(0, -2)} </b>
                </span>
              :
              record.list_state === "2" ?
                record.form_check_state === "4" || record.form_check_state === "7" || record.form_check_state === "10" || record.form_check_state === "13" || record.form_check_state === "16" || record.form_check_state === "19" || record.form_check_state === "22" ?
                  <span style={{marginLeft: '5px'}}>
                      您已退回
                      <b>{record.screate_user_name}</b>&nbsp;
                    提交的&nbsp;
                    <b>{record.form_title.slice(0, -2)} </b>
                </span>
                  :
                  record.list_state === "0" ?
                    <span style={{marginLeft: '5px'}}>
                      您提交的
                      &nbsp;
                      <b>{record.form_title.slice(0, -2)} &nbsp;</b>
                      已被退回
                </span>
                    :
                  null
              :
              record.list_state === "3" ?
                <span style={{marginLeft: '5px'}}>
                    <b>{record.screate_user_name}</b>&nbsp;
                      提交的&nbsp;
                  <b>{record.form_title.slice(0, -2)} </b> 已办结
                  </span>
              :
              null
            }
          </p>}

    }
  }, {
    title: '日期',
    dataIndex: 'sortDate',
  }
];




class JudgeList extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'judgeList/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'judgeList/'+value,
      })
    }

  };

  handleTableClick = (e,flag) => {
    //console.log(e,flag);
   // console.log(typeof flag);
    if(flag === 0){
      if(e.form_check_state === "4"||e.form_check_state === "7"||e.form_check_state === "10"||e.form_check_state === "13"||e.form_check_state === "16"||e.form_check_state === "19"||e.form_check_state === "22"){
        if(e.form_title==='印章使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/sealComReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='印章外借申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/borrowSealReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='院领导名章使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/sealLeaderReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='院领导名章外借申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/borrowLeaderReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='营业执照复印件使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/businessLicenseReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='营业执照外借申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/borrowBusinessReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='院领导身份证复印件使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/leaderIDReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='刻章申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/markSealReset',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
      }else{

        if(e.form_title==='印章使用申请填报'){
            this.props.dispatch(routerRedux.push({
              pathname:'adminApp/sealManage/myJudge/sealComJudge',
              query: {
                record:JSON.stringify(e)
              }
            }));
        }
        else if(e.form_title==='印章外借申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/borrowSealJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='院领导名章使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/sealLeaderJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='院领导名章外借申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/borrowLeaderJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='营业执照复印件使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/businessLicenseJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='营业执照外借申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/borrowBusinessJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='院领导身份证复印件使用申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/leaderIDJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
        else if(e.form_title==='刻章申请填报'){
          this.props.dispatch(routerRedux.push({
            pathname:'adminApp/sealManage/myJudge/markSealJudge',
            query: {
              record:JSON.stringify(e)
            }
          }));
        }
      }

    }
    else{
      if(e.form_title==='印章使用申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/sealComDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='印章外借申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/borrowSealDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='院领导名章使用申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/sealLeaderDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='院领导名章外借申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/borrowLeaderDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='营业执照复印件使用申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/businessLicenseDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='营业执照外借申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/borrowBusinessDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='院领导身份证复印件使用申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/leaderIDDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
      else if(e.form_title==='刻章申请填报'){
        this.props.dispatch(routerRedux.push({
          pathname:'adminApp/sealManage/myJudge/markSealDetail',
          query: {
            record:JSON.stringify(e)
          }
        }));
      }
    }


  };




  render(){
    return (
      <div className={styles['pageContainer']}>
        <h2 style={{textAlign:'center'}}>待办列表</h2>
        <Tabs defaultActiveKey="taskListQuery">
          <TabPane tab="我的待办" key="taskListQuery">
            <p>共{this.props.taskList.length}条待办记录</p>

            <Table rowKey='task_id'
                   showHeader={false}
                   columns={columns}
                   dataSource={this.props.taskList}
                   onRowClick={(e)=>this.handleTableClick(e,0)}
            />

          </TabPane>
          <TabPane tab="我的已办" key="taskingListQuery">
            <p>共{this.props.completeList.length}条已办记录</p>
            <Table rowKey='task_id'
                   showHeader={false}
                   columns={columns}
                   dataSource={this.props.completeList}
                   onRowClick={(e)=>this.handleTableClick(e,1)}
            />
          </TabPane>
          <TabPane tab="我的办结" key="taskedListQuery">
            <p>共{this.props.finishedList.length}条办结记录</p>
            <Table rowKey='task_id'
                   showHeader={false}
                   columns={columns}
                   dataSource={this.props.finishedList}
                   onRowClick={(e)=>this.handleTableClick(e,3)}
            />
          </TabPane>
        </Tabs>
      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.judgeList,
    ...state.judgeList
  };
}
export default connect(mapStateToProps)(JudgeList);
