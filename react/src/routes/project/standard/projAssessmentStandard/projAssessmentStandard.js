/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Tabs, Icon, Pagination, Breadcrumb } from 'antd';
import styles from '../projAssessmentStandard.less';
import AdvancedSearchForm from './advancedSearchForm';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AssessmentStandard({dispatch, location, projectList, projectType, department}) {
    const columns = [{
        title: '序号',
        dataIndex: 'proj_id',
        render: (text, record, index) => index+1,
        width: '5%'
      },{
        title: '团队名称',
        dataIndex: 'proj_name',
        width: '25%'
      },{
        title: '生产编码',
        dataIndex: 'proj_code',
        width: '15%'
      },{
        title: '主建单位',
        dataIndex: 'ou',
        width: '10%'
      },{
        title: '归属部门',
        dataIndex: 'dept_name',
        render:(text)=>{
          return text.includes('-') ?text.split('-')[1]:text;
        },
        width: '10%'
      },{
        title: '项目经理',
        dataIndex: 'mgr_name',
        width: '10%'
      },{
        title:'项目类型',
        dataIndex:'proj_type',
        width: '5%'
      },{
        title:'主/子项目',
        dataIndex:'is_primary',
        render:(text)=>{
          return text === '0'?'主项目':'子项目';
        },
        width: '10%'
      },{
        title:'项目分类',
        dataIndex:'proj_label',
        render:(text)=>{
          switch(text){
            case '0':
              return('项目类');
              break;
            case '1':
              return('小组类');
              break;
            case '2':
              return('支撑类');
              break;
            case '3':
              return('项目类(纯第三方)');
              break;
          }
        },
        width: '10%'
      }];
    const handleTableClick = (record) => {
        dispatch({
            type:'projAssessmentStandard/projAssessmentStandardInfo',
            payload:{
                arg_proj_id:record.proj_id,
            }
        });
    };
    const ouChange = (value) => {
        dispatch({
            type:'projAssessmentStandard/projectListQuery',
            payload: value
        });
    }
    const reset = (value) => {
        dispatch({
            type:'projAssessmentStandard/projectListQuery'
        });
    }
    return (
        <div className={styles['wrap']}>
        {/*
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item>项目考核</Breadcrumb.Item>
                <Breadcrumb.Item>考核设定</Breadcrumb.Item>
            </Breadcrumb>
        */}
            <h2 style={{textAlign:'center'}}></h2>
            <AdvancedSearchForm department={department} projectType={projectType} ouChange={ouChange} reset={reset}></AdvancedSearchForm>
            <Table className={styles.orderTable} rowKey='proj_id' columns={columns} dataSource={projectList} onRowClick={handleTableClick}/>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projAssessmentStandard,
        ...state.projAssessmentStandard
    };
}

export default connect(mapStateToProps)(AssessmentStandard);
