/**
 * 作者：任华维
 * 日期：2017-11-11
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Tabs, Icon, Pagination, Breadcrumb } from 'antd';
import StandardCollapse from './standardCollapse';
import styles from '../projAssessmentStandard.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-11
 * 功能：页面组件
 */
function StandardList({dispatch, loading, location, templetList}) {

    const handleClick = (y,s) => {
        dispatch({
            type:'standardList/standardInfo',
            payload:{
                year:y,
                season:s
            }
        });
    }

    return (
        <div className={styles['wrap']}>
        {/*
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item>项目考核</Breadcrumb.Item>
                <Breadcrumb.Item>模版列表</Breadcrumb.Item>
            </Breadcrumb>
        */}
            <h2 style={{textAlign:'center'}}>模版设定列表</h2>
            <StandardCollapse templetList={templetList} handleClick={handleClick}></StandardCollapse>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.standardList,
        ...state.standardList,
    };
}

export default connect(mapStateToProps)(StandardList);
