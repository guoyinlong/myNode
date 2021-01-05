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
import AssessmentStandardCollapse from './projAssessmentStandardCollapse';
import styles from '../projAssessmentStandard.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-11
 * 功能：页面组件
 */
function AssessmentStandardInfo({dispatch, loading, location, proj_id, proj_name, proj_score,list,detail}) {
    const handleCardDetail = (season,year,projectId) => {
        dispatch({
            type:'projAssessmentStandardInfo/projAssessmentStandardDetail',
            payload: {'id':projectId,'year':year,'season':season}
        });
    };
    return (
        <div className={styles['wrap']}>
        {/*
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item>指标管理</Breadcrumb.Item>
                <Breadcrumb.Item>考核设定</Breadcrumb.Item>
            </Breadcrumb>
        */}
            <h2 style={{textAlign:'center'}}>{detail.proj_name}</h2>
            <AssessmentStandardCollapse seasons={list} projectId={detail.proj_id} handleCardDetail={handleCardDetail}></AssessmentStandardCollapse>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projAssessmentStandardInfo,
        ...state.projAssessmentStandardInfo,
    };
}

export default connect(mapStateToProps)(AssessmentStandardInfo);
