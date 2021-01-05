/**
 * 作者：任华维
 * 日期：2017-11-11
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Tabs, Icon, Pagination, Breadcrumb, Button} from 'antd';
import AdvancedSearchForm from './advancedSearchForm';
import styles from '../projAssessmentStandard.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-11
 * 功能：页面组件
 */
function AssessmentStandardSet({dispatch, loading, location, years, list, year, season, selectedRowKeys}) {
    const projQuery = (value) => {
        dispatch({
            type:'standardSet/projQuery',
            payload:value
        });
    }
    const projExamAlloc = () => {
        dispatch({type:'standardSet/projExamAlloc'});
    }
    const columns = [{
        title: '序号',
        render: (text, record, index) => index+1,
        width: '5%'
    },{
        title: '团队名称',
        dataIndex: 'proj_name',
        width: '40%'
    },{
        title: '生产编码',
        dataIndex: 'proj_code',
        width: '20%'
    },{
        title: '归口部门',
        dataIndex: 'dept_name',
        render:(text)=>{
            return text.includes('-') ?text.split('-')[1]:text;
        },
        width: '20%'
    },{
        title: '填报状态',
        dataIndex: 'kpi_fill_state',
        render:(text)=>{
            let str = '待填写';
            switch (text) {
                case '1':
                    str = '待提交';
                    break;
                case '2':
                    str = '待审核';
                    break;
                case '3':
                case '4':
                    str = '审核中';
                    break;
                case '5':
                    str = '已完成';
                    break;
            }
            return str;
        },
        width: '15%'
    }];
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            dispatch({
                type:'standardSet/selectedRowKeys',
                payload:selectedRowKeys
            });
        },
        selectedRowKeys:selectedRowKeys,
    };
    return (
        <div className={styles['wrap']}>
            {/*
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item>项目考核</Breadcrumb.Item>
                <Breadcrumb.Item>考核分配</Breadcrumb.Item>
            </Breadcrumb>
            */}
            <h2 style={{textAlign:'center'}}>项目考核分配</h2>
            <AdvancedSearchForm yearData={years} year={year} season={season} handleChange={projQuery}></AdvancedSearchForm>
            <div style={{'margin':'10px 0'}}>
                <Button type="primary" disabled={!selectedRowKeys.length > 0} onClick={projExamAlloc}>参与考核</Button>
            </div>
            <Table className={styles.orderTable} rowKey='proj_id' rowSelection={rowSelection} columns={columns} dataSource={list}/>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.standardSet,
        ...state.standardSet,
    };
}

export default connect(mapStateToProps)(AssessmentStandardSet);
