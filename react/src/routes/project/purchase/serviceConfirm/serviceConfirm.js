/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：服务确认查询
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Icon, Input, Button, Row, Col, Tooltip, message, Modal } from 'antd';
import styles from '../serviceConfirm.less';
import AdvancedSearchForm from './advancedSearchForm';
const confirm = Modal.confirm;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function ServiceConfirm({dispatch, loading, service_standarts, search_result, search_condition, form_proj,}) {
    const search = (value) => {
        dispatch({
            type : 'serviceConfirm/serviceConfirmSearch',
            payload : {...search_condition,...value}
        });
    }
    const submit = () => {
        let flag = true;
        for (let i = 0; i < search_result.length; i++) {
            if (!search_result[i].stability_score || !search_result[i].attend_score || !search_result[i].delivery_score || !search_result[i].quality_score || !search_result[i].manage_score) {
                flag = false;
                break;
            }
        }
        if (flag) {
            confirm({
                title: '确定要提交评价单吗？',
                onOk() {
                    dispatch({
                        type : 'serviceConfirm/serviceAddBatServlet'
                    });
                }
            });
        } else {
            message.error('评价结果不能为空');
        }

    }
    const columns = [{
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => {
            return index + 1;
        },
        width: '10%'
      },{
        title: '合作方',
        dataIndex: 'name',
        width: '10%'
      },{
        title:'服务质量评价',
        children:service_standarts
      },{
        title: '实际发生工作量',
        children:[{
            title: '人/日',
            dataIndex: 'proj_work_cnt',
            width: '10%'
        },{
            title: '人/月',
            dataIndex: 'month_work_cnt',
            width: '10%'
        }]
      }];
    return (
        <div className={styles['pageContainer']}>
            <Row>
                <Col>
                    <h2 style={{textAlign:'center'}}>合作伙伴服务填报</h2>
                </Col>
            </Row>
            <AdvancedSearchForm condition={search_condition} proj={form_proj} search={search} result={search_result} ok={submit}></AdvancedSearchForm>
            <Table
                className = {styles.orderTable}
                loading = {loading}
                rowKey = {record => record.id}
                columns = {columns}
                dataSource = {search_result}
                pagination = {false}
            />
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.serviceConfirm,
        ...state.serviceConfirm
    };
}

export default connect(mapStateToProps)(ServiceConfirm);
