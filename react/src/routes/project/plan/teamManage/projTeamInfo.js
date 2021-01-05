/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Icon, Avatar, Input, Button, Row, Col } from 'antd';
import styles from './teamManage.less';
import UserSearchForm from './userSearchForm';
const Search = Input.Search;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function ProjTeamInfo({dispatch, loading, dataSource, inputStr}) {
    const goBack = (value) => {
        dispatch({
            type : 'projTeamInfo/turnToBack'
        });
    }
    const userQuery = (value) => {
        dispatch({
            type : 'projTeamInfo/reSearch',
            payload : value
        });
    }
    const colorList = ['#f56a00', '#fde3cf', '#7265e6', '#00a2ae', '#87d068', '#ffbf00' ];
    const columns = [{
        title: 'username',
        dataIndex: 'username',
        width:'14%',
        render: text => <div className={styles.circleTitle}>{text}</div>
    }, {
        title: 'staffId',
        dataIndex: 'staffId',
        width:'43%',
        render: (text, record) => (
            <div>
                <Row className={styles.pt5+" "+styles.pb5}>
                    <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[0] }} icon="user"></Avatar></Col>
                    <Col span={6}>员工编号：</Col>
                    <Col span={14} className={styles.alignLeft}>{text}</Col>
                </Row>
                <Row className={styles.pt5+" "+styles.pb5}>
                    <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[1] }} icon="mail"></Avatar></Col>
                    <Col span={6}>电子邮箱：</Col>
                    <Col span={14} className={styles.alignLeft}>{record.email}</Col>
                </Row>
                <Row className={styles.pt5+" "+styles.pb5}>
                    <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[2] }} icon="mobile"></Avatar></Col>
                    <Col span={6}>联系电话：</Col>
                    <Col span={14} className={styles.alignLeft}>{record.tel}</Col>
                </Row>
            </div>

        )
    }, {
        title: 'count',
        dataIndex: 'count',
        width:'43%',
        render: (text, record) => (
            <div>
                <Row className={styles.pt5+" "+styles.pb5}>
                    <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[3] }}><Icon type='logo'/></Avatar></Col>
                    <Col span={6}>公司：</Col>
                    <Col span={14} className={styles.alignLeft}>{record.ou.includes('-') ? record.ou.split('-')[1] : record.ou}</Col>
                </Row>
                <Row className={styles.pt5+" "+styles.pb5}>
                    <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[4] }}><Icon type='bumen'/></Avatar></Col>
                    <Col span={6}>部门：</Col>
                    <Col span={14} className={styles.alignLeft}>{record.deptname.includes('-') ? record.deptname.split('-')[1] : record.deptname}</Col>
                </Row>
                {
                    record.count === '2'
                    ?
                    <Row className={styles.pt5+" "+styles.pb5}>
                        <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[5] }}><Icon type='xiangmu'/></Avatar></Col>
                        <Col span={6}>{record.type.split(',')[0]}项目：</Col>
                        <Col span={14} className={styles.alignLeft}>{record.projName.split(',')[0]}</Col>
                    </Row>
                    :
                    <Row className={styles.pt5+" "+styles.pb5}>
                        <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[5] }}><Icon type='xiangmu'/></Avatar></Col>
                        <Col span={6}>{record.type}项目：</Col>
                        <Col span={14} className={styles.alignLeft}>{record.projName}</Col>
                    </Row>
                }
                {
                    record.count === '2'
                    ?
                    <Row className={styles.pt5+" "+styles.pb5}>
                        <Col span={4} className={styles.alignRight}><Avatar size='small' style={{ color: '#fff', backgroundColor: colorList[5] }}><Icon type='xiangmu'/></Avatar></Col>
                        <Col span={6}>{record.type.split(',')[1]}项目：</Col>
                        <Col span={14} className={styles.alignLeft}>{record.projName.split(',')[1]}</Col>
                    </Row>
                    :
                    null
                }
            </div>
        )
    }];
    return (
        <div className={styles['pageContainer']}>
            <Row className={styles.pb15}>
                <Col span={10}></Col>
                <Col span={4}>
                    <h2 style={{textAlign:'center'}}>团队管理</h2>
                </Col>
                <Col span={8}>
                    <UserSearchForm handleSearch={userQuery} condition={inputStr}/>
                </Col>
                <Col span={2}>
                    <Button type="primary" size="default" onClick={goBack}>返回</Button>
                </Col>
            </Row>
            <Table
                className={styles.userTable}
                bordered={true}
                loading={loading}
                pagination={false}
                rowKey={record => record.staffId}
                showHeader={false}
                columns={columns}
                dataSource={dataSource}
            />
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projTeamInfo,
        ...state.projTeamInfo
    };
}

export default connect(mapStateToProps)(ProjTeamInfo);
