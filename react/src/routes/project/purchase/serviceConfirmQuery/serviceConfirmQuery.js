/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：服务确认查询
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Icon, Input, Button, Row, Col, Tooltip } from 'antd';
import styles from '../serviceConfirm.less';
import AdvancedSearchForm from './advancedSearchForm';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function ServiceConfirmQuery({dispatch, loading, scq}) {
    const search = (value) => {
        dispatch({
            type : 'serviceConfirmQuery/serviceConfirmSearch',
            payload : {...scq.search_condition,...value}
        });
    }
    const porjSearch = (value) => {
        dispatch({
            type : 'serviceConfirmQuery/formProjQuery',
            payload : {'arg_user_id':scq.user_id,'arg_info':value}
        });
    }
    const handleTableChange = (pagination, filters, sorter) => {
        dispatch({
            type:'serviceConfirmQuery/serviceConfirmSearch',
            payload:{...scq.search_condition,'arg_pagesize':pagination.pageSize,'arg_pagecurrent':pagination.current}
        });
    }
    const columns = [{
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => {
            return index + 1;
        },
        width: '5%'
      },{
        title: '团队名称',
        dataIndex: 'proj_name',
        width: '15%'
      },{
        title: '合作方',
        dataIndex: 'name',
        width: '8%'
      },{
        title:'服务质量评价',
        children:scq.service_standarts
      // },{
      //   title:'归属部门',
      //   dataIndex:'pu_dept_name',
      //   render:(text)=>{
      //     return text.includes('-') ?text.split('-')[1]:text;
      //   },
      //   width: '10%'
      },{
        title: '实际发生工作量',
        children:[{
            title: '人/日',
            dataIndex: 'proj_work_cnt',
            width: '8%'
        },{
            title: '人/月',
            dataIndex: 'month_work_cnt',
            width: '8%'
        }]
      },{
        title:'状态',
        dataIndex:'state_desc',
        render: (text, record, index) => {
            let str = '';
            switch (text) {
                case '1':
                    str = '待提交';
                    break;
                case '2':
                    str = '审核中';
                    break;
                case '3':
                    str = '已完成';
                    break;
            }
            return str;
        },
        width: '8%'
      }];
    return (
        <div className={styles['pageContainer']}>
            <Row>
                <Col>
                    <h2 style={{textAlign:'center'}}>合作伙伴服务查询</h2>
                </Col>
            </Row>
            <AdvancedSearchForm form_data={scq} search={search} porjSearch={porjSearch}></AdvancedSearchForm>
            <Table
                className = {styles.orderTable}
                loading = {loading}
                rowKey = {record => record.id}
                columns = {columns}
                dataSource = {scq.search_result}
                pagination = {scq.search_pagination}
                onChange = {handleTableChange}
            />
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.serviceConfirmQuery,
        scq:state.serviceConfirmQuery
    };
}

export default connect(mapStateToProps)(ServiceConfirmQuery);
