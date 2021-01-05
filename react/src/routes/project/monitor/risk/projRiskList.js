/**
 *  作者: 胡月
 *  创建日期: 2017-9-26
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：实现风险列表展示的功能
 */
import React from 'react';
import {Icon, Button, Table, Pagination } from 'antd';
import styles from './projRisk.less'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import CheckRiskModal from './checkRiskModal.js';

//表格的序号
function projIndex(text, record, index) {
    return index + 1;
}

//风险等级选择
function riskGrade(text, record, result) {
    if (record.props * record.range >= 16) {
        result = "高";
    } else if (record.props * record.range >= 9 && record.props * record.range < 16) {
        result = "中";
    } else if (record.props * record.range >= 1 && record.props * record.range < 9) {
        result = "低";
    }
    return result;
}

/**
 *  作者: 胡月
 *  创建日期: 2017-9-26
 *  功能：实现风险列表展示的功能
 */
class projRiskList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            staff_id: Cookie.get('staff_id'),
        }
    }
    /**
     * 作者：胡月
     * 创建日期：2017-9-26
     * 功能：跳转到编辑风险页面
     * @param proj_id 项目id
     * @param record 表格每一行记录
     */
    editRiskClick = (proj_id, record)=> {
        const {dispatch}=this.props;
        let id = record.id;
        let query = {proj_id, id};
        dispatch(routerRedux.push({
            pathname: '/projectApp/projMonitor/risk/editRiskDetial', query
        }));
    }

    /**
     * 作者：胡月
     * 创建日期：2017-9-26
     * 功能：跳转到添加风险页面
     * @param proj_id 项目id
     */
    addRiskClick = (proj_id)=> {
        const {dispatch}=this.props;
        let query = {proj_id};
        dispatch(routerRedux.push({
            pathname: '/projectApp/projMonitor/risk/addRiskDetial', query
        }));
    }
    /**
     * 作者：胡月
     * 创建日期：2017-11-24
     * 功能：返回之前的项目查询列表
     */
    goBack = ()=> {
        const {dispatch}=this.props;
        dispatch(routerRedux.push({
            pathname: '/projectApp/projMonitor/risk',
            query:this.props.queryData
        }));
    };
    columns = [
        /* {
         title: '序号',
         dataIndex: 'index',
         render: (text,record,index) => projIndex (text,record,index),

         },*/
        {
            title: '风险项',
            dataIndex: 'risk',
        },
        {
            title: '风险状态',
            dataIndex: 'state',
            render: (text, record, index) => {
                if (record.state === '1') {
                    return "识别";
                } else if (record.state === '2') {
                    return  "预防";
                } else if (record.state === '3') {
                    return  "转为问题";
                } else if (record.state === '4') {
                    return  "关闭";
                }
            }
        },
        {
            title: '责任人',
            dataIndex: 'staff_name',

        },
        {
            title: '风险系数',
            dataIndex: 'result',
            render: (text, record, result) => riskGrade(text, record, result)
        },
        {
            title: '识别日期',
            dataIndex: 'recog_date',
        },
        {
            title: '计划解决日期',
            dataIndex: 'plan_time',

        },
        {
            title: '操作',
            dataIndex: '',
            render: (text, record) => {
                const { proj_id} = this.props;
                //权限判别，项目经理可以进行编辑操作
                if (this.props.mgr_id == Cookie.get('staff_id')) {
                    return (
                        <div style={{textAlign:'left'}}>
                            <div className={styles.btnWrap} style={{textAlign:'right',width:'45%'}}>
                                <a className={styles["book-detail"]+' '+styles.bookTag}
                                   onClick={(event)=>{ this.refs.checkRisk.showModal(record);}}
                                >{'查看'}
                                </a>
                            </div>
                            <div className={styles.btnWrap} style={{textAlign:'left',width:'45%',marginLeft:'10%'}}>
                                <a className={styles["edit-detail"]+' '+styles["bookTag"]}
                                   onClick={()=>this.editRiskClick(proj_id,record)}
                                >{'编辑'}
                                </a>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div style={{textAlign:'left'}}>
                            <div className={styles.btnWrap} style={{textAlign:'center',width:'100%'}}>
                                <a className={styles["book-detail"]+' '+styles.bookTag}
                                   onClick={(event)=>{ this.refs.checkRisk.showModal(record);}}
                                >{'查看'}
                                </a>
                            </div>
                        </div>
                    );
                }
            }
        }];

    render() {
        const {loading,riskList, proj_name,mgr_name,dept_name,proj_id} = this.props
        if (riskList.length) {
            riskList.map((i, index)=> {
                i.key = index;
            })
        }
        return (
            <div className={styles.whiteBack}>
                <div><p className={styles.title}>{proj_name}</p></div>
                <div style={{textAlign:'center'}}><Icon style={{marginTop:'10px',marginBottom:'5px'}}
                                                        type="user"/>项目经理：{mgr_name}
                    <Icon style={{marginLeft:'50px'}} type="home"/>主责部门：{dept_name}</div>
                {/*权限判别，项目经理可以进行增加风险的操作*/}
                <div style={{float:'right'}}>
                    {this.props.mgr_id == Cookie.get('staff_id') ?
                        <Button type="primary" onClick={()=>this.addRiskClick(proj_id)}>{'风险新增'}</Button>
                        :
                        null
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={()=>this.goBack()}>{'返回'}</Button>
                </div>
                <Table style={{marginTop:'36px'}}
                       columns={this.columns}
                       dataSource={riskList}
                       pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                       loading={loading}
                       className={styles.orderTable}/>
                {/*查看风险模态框*/}
                <CheckRiskModal ref='checkRisk'/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { riskList,record,proj_name,mgr_name,dept_name,mgr_id,proj_id,id,queryData} = state.projRiskList;
    return {
        loading: state.loading.models.projRiskList,
        riskList,
        record,
        proj_name,
        mgr_name,
        dept_name,
        mgr_id,
        proj_id,
        id,
        queryData
    };
}


export default connect(mapStateToProps)(projRiskList);
