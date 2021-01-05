/**
 * 作者：窦阳春
 * 日期：2020-10-23
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-舆情管理模块首页列表
 */
import React from 'react';
import {connect } from 'dva';
import { Icon, Spin, Collapse, Button, Popconfirm, Pagination, Table } from 'antd';
import { routerRedux } from 'dva/router';
const Panel = Collapse.Panel;
import styles from '../../newsOne/style.less'

class OpinionManagementIndex extends React.Component{
  state = {
    };
  add = () => { //新增按钮
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/newsOne/opinionManagementIndex/opinionAdd',
    }))
  }
  gotoDetails = (e, newsId, flag) => { //跳转到舆情管理详情或修改页面
    e.stopPropagation() 
    if(flag != 'delete') {
      let path = flag == 'opinionReport' ? 'opinionAdd' : flag == 'modify' ? 'opinionModify' : 'opinionReport'
      this.props.dispatch(routerRedux.push({
        pathname: '/adminApp/newsOne/opinionManagementIndex/' + path,
        query: {newsId}
      }))
    }else {
      this.props.dispatch({
        type: 'opinionManagementIndex/deletePubSentiment', newsId
      })
    }
  }
  downLoad = (e, item) => {
    e.stopPropagation() 
    for(var i = 0; i < item.length; i++) {
      window.open("/microservice/newsmanager/pubSentimentUpload?id=" + item[i].id, '_blank')
    };
  }
  render() {
    const { oneList } = this.props;
    let onListDom = oneList.length == 0 ? [] : oneList.map((v, i) => {
      return (
      <Panel onClick={this.panelClick}
      header= {
        <div className={styles.panelHeader}>
          <div style={{float: 'left'}}>{`${v.year}年${v.month}月舆情报告列表`}</div>
          <Icon type="download" className={styles.panelIcon} onClick={(e)=>this.downLoad(e, v.two)}/>
        </div>
      } 
      key={`${v.year}-${v.month}`}>
        {
          v.two.length == 0 ? '' : v.two.map((item, index) => {
            return (
              <div key={index} className={styles.panelList} >
                <div style={{float: 'left', width: item.state == '草稿' ? '70%' : '80%'}} onClick={(e)=>this.gotoDetails(e, item.id, item.state == '草稿' ? 'modify' : 'detail')}>
                  <b>{item.feedbackUnitName} </b>{item.createTime.substr(0,item.createTime.indexOf('月')+1)} 舆情报告 [{item.state}]
                </div>
                {
                  item.state == '草稿' ?
                  <div style={{float: 'right'}}>
                    <Popconfirm
                      title = '确定删除'
                      onConfirm = {(e)=>this.gotoDetails(e, item.id, 'delete')}
                      >
                      <Button type="primary" size="small" style={{float: 'right', marginLeft: 3}}>删除</Button>
                    </Popconfirm>
                    <Button type="primary" size="small" style={{float: 'right'}} onClick={(e)=>this.gotoDetails(e, item.id, 'modify')}>修改</Button> &nbsp;
                  </div> :
                  <Button type="primary" size="small" style={{float: 'right'}} onClick={(e)=>this.gotoDetails(e, item.id, 'detail')}>详情</Button> 
                }  &nbsp; 
              </div>
            )
          })
        }
      </Panel>
      )
    })
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
          <h2 style = {{textAlign:'center',marginBottom:30}}>舆情管理</h2>
          <Button type='primary' onClick={this.add} style={{float: 'right', marginBottom: 10}}>新增</Button>
          {
            oneList.length == 0 ?
            <Table style={{clear: 'both'}}
            pagination={false}
            dataSource = { [] }
            showHeader = {false}
            columns = { [] }
            /> :
            <Collapse bordered={false} style={{clear: "both"}}>
            {onListDom}
            </Collapse>
          }
        </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
   
  return {
    loading: state.loading.models.opinionManagementIndex,
    ...state.opinionManagementIndex
  };
}
export default connect(mapStateToProps)(OpinionManagementIndex);
