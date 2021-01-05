/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Icon, Input, Button, Row, Col } from 'antd';
import styles from './teamManage.less';
import AdvancedSearchForm from './advancedSearchForm';
import UserSearchForm from './userSearchForm';
const Search = Input.Search;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function TeamManage({dispatch, loading, dataSource, ouSource, puSource, typeSource, pagination, condition, staffId}) {
    const columns = [{
        title: '序号',
        dataIndex: 'projId',
        render: (text, record, index) => {
            if(record.isPrimary === '1' && record.parentIndex){
                return record.parentIndex + 1 + "-" + (index + 1);
            }else{
                return index + 1;
            }
        },
        width: '120px'
      },{
        title: '团队名称',
        dataIndex: 'projName',
      },{
        title: '生产编码',
        dataIndex: 'projCode',
        width: '15%'
      },{
        title: '主建单位',
        dataIndex: 'ouDefineName',
        width: '10%'
      },{
        title: '主建部门',
        dataIndex: 'projMainDepName',
        render: (text) => {
          if(!text) {
            return "";
          }
          return text.includes('-') ? text.split('-')[1] : text;
        },
        width: '15%'
      },{
        title: '项目经理',
        dataIndex: 'marName',
        width: '8%'
      },{
        title:'项目类型',
        dataIndex:'projKind',
        width: '5%'
      },{
        title:'主/子项目',
        dataIndex:'isPrimary',
        render:(text)=>{
          return text === '0'?'主项目':'子项目';
        },
        width: '8%'
      },{
        title:'项目分类',
        dataIndex:'projType',
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
        width: '8%'
      },{
        title:'人数',
        dataIndex:'peopleNum',
        width: '5%',
        render: (text) => Number(text)
      }];
    const handleTableClick = (record) => {
        dispatch({
            type:'teamManage/turnToPage',
            payload:{
                projId: record.projId,
                projName: record.projName,
                marId: record.marId,
                marName: record.marName,
                createBy: record.createBy,
                projMainDep: record.projMainDep,
                ouDefineName: record.ouDefineName
            }
        });
    };
    const handleTableChange = (pagination, filters, sorter) => {
        dispatch({
            type:'teamManage/projQuery',
            payload:{...condition,'pageSize':pagination.pageSize,'pageCurrent':pagination.current}
        });
    }
    const search = (value) => {
        const param = value ? {...condition,...value,'pageSize':10,'pageCurrent':1} : {}
        dispatch({
            type: 'teamManage/projQuery',
            payload: param
        });
    }
    const userQuery = (value) => {
        dispatch({
            type: 'teamManage/reSearch',
            payload: value
        });
    }
    const caihaoSearch = () => {
        dispatch({
            type : 'teamManage/turnToCaiHaoPage',
            payload : {'arg_dept_name':'联通软件研究院-公众研发事业部'}
        });
    }
    return (
        <div className={styles['pageContainer']}>
            <Row>
                <Col span={10}></Col>
                <Col span={4}>
                    <h2 style={{textAlign:'center'}}>团队管理</h2>
                </Col>
                <Col span={10}>
                    <UserSearchForm handleSearch={userQuery}/>
                </Col>
            </Row>

            <AdvancedSearchForm ouSource={ouSource} puSource={puSource} typeSource={typeSource} condition={condition} search={search} caihaoSearch={caihaoSearch} isCaiHao={'0000639'===staffId}></AdvancedSearchForm>
            <Table
                className = {styles.orderTable}
                loading = {loading}
                rowKey = {record => record.projId}
                columns = {columns}
                defaultExpandAllRows = {true}
                dataSource = {dataSource}
                onRowClick = {handleTableClick}
                pagination = {pagination}
                onChange = {handleTableChange}
            />
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.teamManage,
        ...state.teamManage
    };
}

export default connect(mapStateToProps)(TeamManage);
