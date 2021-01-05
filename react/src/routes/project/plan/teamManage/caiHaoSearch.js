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
function caiHaoSearch({dispatch, loading, dataSource}) {
    const columns = [{
        title: '部门',
        dataIndex: 'index',
        width: '11%',
        render:(text,record)=>{
            const obj = {
                children: '',
                props: {},
            };
            if (text === 0) {
                obj.children = '公众研发事业部';
                obj.props.rowSpan = dataSource.length-1;
            }else if(text === dataSource.length-1){
                obj.children = '总合计';
                obj.props.colSpan = record.span;
            }else {
                obj.props.rowSpan = 0
            }
            return obj
        },
      },{
        title: '归口单位',
        dataIndex: 'ou',
        width: '15%',
        render:(text,record,index)=>{
            const obj = {
                children: text,
                props: {
                    className: record.flag,
                },
            };
            if (index === dataSource.length-1) {
                obj.props.colSpan = 0;
            } else {
                obj.props.rowSpan = record.span;
            }
            return obj
        },
      },{
        title: '项目/小组',
        dataIndex: 'proj_name',
        width: '25%',
        render:(text,record,index)=>{
            const obj = {
                children: text,
                props: {
                    className: record.flag,
                },
            };
            if (index === dataSource.length-1) {
                obj.props.colSpan = 0;
            }
            return obj
        },
      },{
        title: '主建部门',
        dataIndex: 'dept_name',
        width: '15%',
        render:(text,record,index)=>{
            const obj = {
                children: text.includes('-') ?text.split('-')[1]:text,
                props: {
                    className: record.flag,
                },
            };
            if (index === dataSource.length-1) {
                obj.props.colSpan = 0;
            }
            return obj
        },
      },{
        title: '项目总人数',
        dataIndex: 'sumpeople',
        width: '8%',
        render:(text,record,index)=>{
            const obj = {
                children: text,
                props: {
                    className: record.flag,
                },
            };
            if (index === dataSource.length-1) {
                obj.props.colSpan = 0;
            }
            return obj
        },
      },{
        title:'单位总人数',
        dataIndex:'oupeople',
        width: '8%',
        render:(text,record,index)=>{
            return {
                children: text,
                props: {
                    className: record.flag,
                    rowSpan : record.span
                }
            }
        },
      },{
        title:'人员名单',
        dataIndex:'span',
        render:(text,record,index)=>{
            const obj = {
                children: <Link to="/projectApp/projPrepare/teamManage/teamManageSearch/teamManageSearchDetail">查看</Link>,
                props: {},
            };
            if (index === 0) {
                obj.props.rowSpan = dataSource.length;
            }else {
                obj.props.rowSpan = 0
            }
            return obj
        },
        width: '8%'
      }];
    return (
        <div className={styles['pageContainer']}>

          {
           /* <Breadcrumb separator=">">
              <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to='/projectApp/projPrepare/teamManage'>团队管理</Link></Breadcrumb.Item>
              <Breadcrumb.Item>归口部门项目列表</Breadcrumb.Item>
            </Breadcrumb>*/
          }

            <h2 style={{textAlign:'center',paddingTop:10,paddingBottom:10}}>归口部门项目人员信息</h2>
            <Table
                className = {styles.mergeTable}
                loading = {loading}
                rowKey={record => record.index}
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                bordered={true}
            />
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.caiHaoSearch,
        ...state.caiHaoSearch
    };
}

export default connect(mapStateToProps)(caiHaoSearch);
