/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Breadcrumb, Table, Icon, Input, Button, Row, Col } from 'antd';
import styles from './teamManage.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function caiHaoSearchDetail({dispatch, loading, dataSource, pagination}) {
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            render: (text, record, index) => index+1,
            width: '5%'
        },{
            title: '项目/小组',
            dataIndex: 'proj_name',
            width: '30%'
        },{
            title: '姓名',
            dataIndex: 'staff_name',
            width: '10%'
        },{
            title: '员工编码',
            dataIndex: 'staff_id',
            width: '10%'
        },{
            title:'所在部门',
            dataIndex:'deptname',
            render:(text)=>{
                return text.includes('-') ?text.split('-')[1]:text
            },
            width: '25%'
        },{
            title:'角色',
            dataIndex:'roles',
            render:(text)=>{
                const roles = JSON.parse(text);
                const array = roles.map((item, index) => {
                    return item.role_name;
                })
                return array.join('，');
            },
            width: '20%'
        }
    ];
    const handleTableChange = (pagination) => {
        dispatch({
            type:'caiHaoSearchDetail/caiHaoSearchDetail',
            payload:{'arg_page_size':pagination.pageSize,'arg_page_current':pagination.current}
        });
    }
    return (
        <div className={styles['pageContainer']}>
          {
            /*<Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/projectApp/projPrepare/teamManage/teamManageSearch'>归口部门项目列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>归口部门人员详情</Breadcrumb.Item>
            </Breadcrumb>*/
          }
            <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>归口部门项目人员信息详情</h2>
            <Table
                className = {styles.orderTable}
                loading = {loading}
                rowKey={record => record.staff_id}
                columns={columns}
                pagination={pagination}
                dataSource={dataSource}
                bordered={true}
                onChange = {handleTableChange}
            />
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.caiHaoSearchDetail,
        ...state.caiHaoSearchDetail
    };
}

export default connect(mapStateToProps)(caiHaoSearchDetail);
