/**
 * 作者：贾茹
 * 日期：2020-2-29
 * 邮箱：m18311475903@163.com
 * 功能：我的审批
 */
import React from 'react';
import {
  connect
} from 'dva';
import Cookie from 'js-cookie';
import styles from './task.less';
import {
  routerRedux
} from 'dva/router';
import {
  Table,
  Tabs,
  Breadcrumb,
  List
} from "antd";
const TabPane = Tabs.TabPane;
const columns = [{
  title: '标题',
  dataIndex: 'task_content',
  className: 'left',
  render: (text, record) => {


    return {
      children: <p>
            <b style={{marginRight:'5px'}}>[会议管理系统]</b>
            {
            record.topic_file_state ==='0'?
            <span style={{marginLeft:'5px'}}>
                    {
                      record.topic_check_state ==='2'&& record.list_state === '0'?
                        <span><b style={{marginRight:'5px'}}>部门领导</b>  审核退回  <b style={{marginLeft:'5px'}}>{record.topic_name}</b></span>
                        :
                      record.topic_check_state ==='2'&& record.list_state === '1'?
                          <span><b style={{marginRight:'5px'}}>您</b>   审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                        :
                      record.topic_check_state ==='2'&& record.list_state === '2'?
                        <span><b style={{marginRight:'5px'}}>您</b>   审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                        :
                      record.topic_check_state ==='6'?
                          <span><b style={{marginRight:'5px'}}>分管院领导</b>  审核退回  <b style={{marginLeft:'5px'}}>{record.topic_name}</b></span>
                        :
                      record.topic_check_state ==='9'?
                          <span><b style={{marginRight:'5px'}}>办公室</b>  审核退回  <b style={{marginLeft:'5px'}}>{record.topic_name}</b></span>
                        :
                      record.topic_check_state ==='1'&& record.list_state === '0'?
                        <span><b style={{marginRight:'5px'}}>{record.create_user_name}</b>  提交  <b style={{marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                        :
                      record.topic_check_state ==='1'&& record.list_state === '1'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  正在审核中</span>
                        :
                      record.topic_check_state ==='1'&& record.list_state === '2'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  正在审核中</span>
                        :
                      record.topic_check_state ==='3'&& record.list_state === '0'?
                        <span><b style={{marginRight:'5px'}}>{record.create_user_name}</b>  提交  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                        :
                      record.topic_check_state ==='3'&& record.list_state === '1'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  正在审核中</span>
                        :
                      record.topic_check_state ==='3'&& record.list_state === '2'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  正在审核中</span>
                        :
                      record.topic_check_state ==='5'&& record.list_state === '0'?
                        <span><b style={{marginLeft:'5px'}}>{record.create_user_name}</b>  提交  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                        :
                      record.topic_check_state ==='5'&& record.list_state === '1'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  正在审核中</span>
                        :
                      record.topic_check_state ==='5'&& record.list_state === '2'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  正在审核中</span>
                        :
                      record.topic_check_state ==='7'&& record.list_state === '0'?
                        <span><b style={{marginRight:'5px'}}>{record.create_user_name}</b>  提交  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                        :
                      record.topic_check_state ==='7'&& record.list_state === '1'?
                        <span><b style={{marginRight:'5px'}}>您</b>  审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                        :
                      record.topic_check_state ==='7'&& record.list_state === '2'?
                        <span><b style={{marginRight:'5px'}}>您</b>   审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                        :
                      record.topic_check_state ==='8'&& record.list_state === '0'?
                        <span><b>{record.create_user_name}</b>  提交  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                        :
                      record.topic_check_state ==='8'&& record.list_state === '1'?
                        <span><b style={{marginRight:'5px'}}>您</b>   审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                        :
                      record.topic_check_state ==='8'&& record.list_state === '2'?
                        <span><b style={{marginRight:'5px'}}>您</b>   审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                        :
                      record.topic_check_state ==='10' && record.list_state === '0'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                        :
                      record.topic_check_state ==='10' && record.list_state === '1'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> {record.topic_check_state_desc}</span>
                        :
                      record.topic_check_state ==='5'?
                          <span><b style={{marginRight:'5px'}}>办公室</b>  审核通过  <b style={{marginLeft:'5px'}}>{record.topic_name}</b></span>
                        :
                      record.topic_check_state ==='11'?
                          <span><b style={{marginRight:'5px'}}>办公室</b>  撤回  <b style={{marginLeft:'5px'}}>{record.topic_name}</b></span>
                        :
                      record.topic_check_state ==='12'?
                        <span><b style={{marginRight:'5px'}}>{record.create_user_name}</b>  提交  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  该议题已终止</span>
                        :
                      record.topic_check_state ==='18'?
                        <span>
                          {
                            record.list_state === '1'?
                              <span> <b style={{marginRight:'5px'}}>您</b>   审核过的议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b> 正在审核中</span>
                            :
                            record.list_state === '0'?
                              <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
                              :
                              null
                          }

                        </span>
                        :
                      record.topic_check_state ==='19'?
                        <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  被退回</span>
                        :
                      record.topic_check_state ==='20'?
                        <span>您 已发送成功包含该议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  的议题清单</span>
                        :
                      record.topic_check_state ==='21'?
                      <span>您 已通过该议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b></span>
                      :
                       record.topic_check_state ==='22'?
                      <span>您 已退回该议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b></span>
                      :
                      null
                    }
                </span>
            :
            record.topic_file_state==='1'?
            <span>
                      <b style={{marginRight:'5px'}}>{record.create_user_name}</b>
                      提交
                      <b style={{marginLeft:'5px'}}>{record.topic_name}</b>
                      <span style={{marginLeft:'5px'}}>
                        {/* {record.topic_file_state_desc}*/}
                        归档申请
                      </span>
                    </span>
            :
            record.topic_file_state==='2' ?
            <span>
                        <b style={{marginRight:'5px'}}>办公室</b>
                        审核同意
                        <b style={{marginLeft:'5px'}}>{record.topic_name}</b>
                        <span style={{marginLeft:'5px'}}>
                          {/* {record.topic_file_state_desc}*/}
                          归档开启
                        </span>
                      </span>
            :
            record.topic_file_state==='3' && record.list_state === '0'?
            <span>
                          <b style={{marginRight:'5px'}}>部门经理</b>  归档退回
                          <b style={{marginLeft:'5px'}}>{record.topic_name}</b>
                        </span>
            :
            record.topic_file_state==='3' && record.list_state === '1'?
              <span>
                  待归档议题
                  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>
                  已被您退回
              </span>
            :
            record.topic_file_state==='3' && record.list_state === '2'?
            <span>待归档议题   <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>   已被您退回
                            </span>
            :
            record.topic_file_state==='4' ?
            <span>议题   <b style={{marginLeft:'5px'}}>{record.topic_name}</b>   <span style={{marginLeft:'5px'}}>已归档完成</span>
                              </span>
            :
            record.topic_file_state==='5' && record.list_state === '0'?
            <span><b style={{marginRight:'5px'}}>{record.create_user_name}</b>  提交  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  需要您审核</span>
            :
            record.topic_file_state==='5' && record.list_state === '1'?
            <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  审核完成</span>
            :
            record.topic_file_state==='5' && record.list_state === '2'?
            <span>议题  <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  审核完成</span>
            :
            record.list_type === '1'?
                <span> <b style={{marginRight:'5px',marginLeft:'5px'}}>{record.topic_name}</b>  您有拟上会清单待审核</span>
         :
            null

            }
            {
              record.list_state === '0'&& record.topic_urgent === '1'?
                <b style={{marginRight:'5px',color:'red'}}>&nbsp;&nbsp;紧急议题！</b>
                :
                null
            }

          </p>
    }

  }
}, {
  title: '日期',
  dataIndex: 'sortDate',
}];

class JudgeList extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };
  //跳转到modal层对应的方法
  returnModel = (value, value2) => {
    console.log(value, value2);
    if (value2 !== undefined) {
      this.props.dispatch({
        type: 'judgeList/' + value,
        record: value2,
      })
    } else {
      console.log('aaa');
      this.props.dispatch({
        type: 'judgeList/' + value,
      })
    }

  };

  handleTableClick = (e, flag) => {
    //会议点击跳转
    if (e.list_state === "0") {

      if (e.topic_next_check_state === '4' || e.topic_next_check_state === '5' || e.topic_next_check_state === '17') {
        /*console.log(e.topic_check_state);*/

        if (e.topic_file_state === '1') {
          this.props.dispatch(routerRedux.push({
            pathname: '/adminApp/meetManage/myJudge/dataJudge', //跳转到材料提交页面   待归档申请状态
            query: {
              value: JSON.stringify(e),
            }
          }));
        } else if (e.topic_file_state === '0') {
          this.props.dispatch(routerRedux.push({
            pathname: 'adminApp/meetManage/myJudge/topicJudge', //跳转到议题审核页面
            query: {
              value: JSON.stringify(e),
            }
          }));
        }

      } else if (e.topic_next_check_state === '8') {
        this.props.dispatch(routerRedux.push({
          pathname: 'adminApp/meetManage/myJudge/officeJudge', //跳转到管理员审核页面
          query: {
            value: JSON.stringify(e),
          }
        }));
      } else if (e.topic_check_state === '10' || e.topic_check_state === '7') {
        if (e.topic_file_state === '3' || e.topic_file_state === '2') {
          this.props.dispatch(routerRedux.push({
            pathname: '/adminApp/meetManage/myJudge/addFile', //跳转到申请人修改页面   待归档状态  topic_check_state==='10'&& e.topic_file_state==='1' 待归档申请状态
            query: {
              value: JSON.stringify(e),
            }
          }));
        }

      } else if (e.topic_check_state === '2' || e.topic_check_state === '6' || e.topic_check_state === '9' || e.topic_check_state === '11' || e.topic_check_state === '19') {
        this.props.dispatch(routerRedux.push({
          pathname: '/adminApp/meetManage/topicApply/topicReset', //跳转到修改页面
          query: {
            recordValue: JSON.stringify(e),
          }
        }));

      } else if (e.list_type === '1') {
        this.props.dispatch(routerRedux.push({
          pathname: '/adminApp/meetManage/myJudge/pricedentJudge', //跳转到已办议题审核详情页面
          query: {
            value: JSON.stringify(e),
          }
        }));
      }
      if(e.topic_file_state === '3'){
        this.props.dispatch(routerRedux.push({
          pathname: '/adminApp/meetManage/myJudge/addFile', //跳转到申请人修改页面   待归档状态  topic_check_state==='10'&& e.topic_file_state==='1' 待归档申请状态
          query: {
            value: JSON.stringify(e),
          }
        }));
      }
    } else if (e.type === '2' || e.type === '3') {
      /* console.log('已办');*/
      this.props.dispatch(routerRedux.push({
        pathname: '/adminApp/meetManage/myJudge/myComplete', //跳转到已办议题审核详情页面
        query: {
          value: JSON.stringify(e),
        }
      }));
    }
  };

  render() {
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

function mapStateToProps(state) {

  return {
    loading: state.loading.models.judgeList,
    ...state.judgeList
  };
}
export default connect(mapStateToProps)(JudgeList);