/**
 * 作者：王超
 * 日期：2018-03-19
 * 邮箱：wangc235@chinaunicom.cn
 * 功能：项目考核待办功能
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import BaseInfo from './detail';
import { Spin } from 'antd';

class TaskProKPIDetail extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // 初始化数据
    componentWillMount(){
        const {dispatch} = this.props;
        
        dispatch({
            type:'taskDeatilTMO/cleanManagerDetail',
            params:{}
        });
        dispatch({
            type:'taskDeatilTMO/getManagerTitle',
            params:{
                arg_mgr_id:this.props.location.query.pm_id||"",
                arg_season:this.props.location.query.season,
                arg_year:this.props.location.query.year,
                arg_proj_id:this.props.location.query.proj_id,
            }
        });
    }
    
    render() {
        return (
            <BaseInfo data={this.props.location.query}></BaseInfo>
        );
    }
    
}
function mapStateToProps (state) {
    const {loading} = state.taskDeatilTMO;
    return {
        loading,
    };
}
export default connect(mapStateToProps)(TaskProKPIDetail);
