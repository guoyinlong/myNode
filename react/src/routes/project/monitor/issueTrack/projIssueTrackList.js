/**
 *  作者: 仝飞
 *  创建日期: 2017-9-26
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：实现风险列表展示的功能
 */
import React from 'react';
import {Icon, Button, Table, Pagination} from 'antd';
import styles from './projIssueTrack.less'
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import Cookie from 'js-cookie';
import CheckIssueTrackModal from './checkIssueTrackModal.js';


//问题类别选择
function issueTrackCategory(record) {
    //问题类别
    let category = '';
    if (record.category == 1) {
        category = "需求";
    } else if (record.category == 2) {
        category = "设计";
    } else if (record.category == 3) {
        category = "编码";
    } else if (record.category == 4) {
        category = "测试";
    } else if (record.category == 5) {
        category = "开发环境";
    } else if (record.category == 6) {
        category = "人员";
    } else if (record.category == 7) {
        category = "客户";
    } else if (record.category == 8) {
        category = "管理";
    } else if (record.category == 9) {
        category = "质量";
    } else if (record.category == 10) {
        category = "其他";
    }
    return category;

}

//问题状态选择
function issueTrackState(record) {
    //问题状态
    let issueState = '';
    if (record.state == 1) {
        issueState = "跟踪";
    } else if (record.state == 2) {
        issueState = "关闭";
    }
    return issueState;
}

//问题状态选择
function issueTrackResolveTime(record) {
    //问题状态
    let resolve_time = null;
    if (record.resolve_time === "1999-01-01") {
        resolve_time = null;
    } else if (record.resolve_time === "1990-01-01") {
        resolve_time = null;
    } else {
        resolve_time = record.resolve_time;
    }
    return resolve_time;

}

/**
 *  作者: 仝飞
 *  创建日期: 2017-9-26
 *  功能：实现风险列表展示的功能
 */
class projIssueTrackList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_id: Cookie.get('staff_id'),
        }
    }

    /**
     * 作者：仝飞
     * 创建日期：2017-9-26
     * 功能：跳转到编辑风险页面
     * @param proj_id 项目id
     * @param record 表格每一行记录
     */
    editIssueTrackClick = (proj_id, record) => {
        const {dispatch} = this.props;
        let id = record.id;
        let query = {proj_id, id};
        dispatch(routerRedux.push({
            pathname: '/projectApp/projMonitor/issueTrack/editIssueTrackDetial', query
        }));
    };

    /**
     * 作者：仝飞
     * 创建日期：2017-9-26
     * 功能：跳转到添加风险页面
     * @param proj_id 项目id
     */
    addIssueTrackClick = (proj_id) => {
        const {dispatch} = this.props;
        let query = {proj_id};
        dispatch(routerRedux.push({
            pathname: '/projectApp/projMonitor/issueTrack/addIssueTrackDetial', query
        }));
    };

    /**
     * 作者：仝飞
     * 创建日期：2017-11-24
     * 功能：返回之前的项目查询列表
     */
    goBack = () => {
        const {dispatch} = this.props;
        dispatch(routerRedux.push({
            pathname: '/projectApp/projMonitor/issueTrack',
            query: this.props.queryData
        }));
    };

    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '5%',
            render: (text, record, index) => {
                return (
                    <div>{index + 1}</div>
                );
            }

        },
        {
            title: '问题类别',
            dataIndex: 'category',
            width: '6%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{issueTrackCategory(record)}</div>
                );
            }
        },
        {
            title: '问题描述',
            dataIndex: 'issue',
            width: '9%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{text}</div>
                );
            }
        },
        {
            title: '识别日期',
            dataIndex: 'recog_date',
            width: '6%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{text}</div>
                );
            }
        },
        {
            title: '影响范围描述',
            dataIndex: 'range_desc',
            width: '12%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{text}</div>
                );
            }
        },
        {
            title: '应对措施',
            dataIndex: 'measure',
            width: '15%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{text}</div>
                );
            }
        },
        {
            title: '责任人',
            dataIndex: 'staff_name',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{text}</div>
                );
            }
        },
        {
            title: '问题状态',
            dataIndex: 'state',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>
                        {issueTrackState(record)}
                    </div>
                );
            }
        },
        {
            title: '计划解决日期',
            dataIndex: 'plan_time',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>{text}</div>
                );
            }
        },
        {
            title: '实际解决日期',
            dataIndex: 'resolve_time',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div style={{textAlign:'left'}}>
                        {issueTrackResolveTime(record)}
                    </div>
                );
            }

        },
        {
            title: '操作',
            dataIndex: '',
            width: '12%',
            render: (text, record) => {
                const {proj_id} = this.props;
                //权限判别，项目经理可以进行编辑操作
                if (this.props.mgr_id == Cookie.get('staff_id')) {
                    return (
                        <div style={{textAlign: 'left'}}>
                            <div className={styles.btnWrap} style={{textAlign: 'right', width: '45%'}}>
                                <a className={styles["book-detail"] + ' ' + styles.bookTag}
                                   onClick={() => {this.refs.checkIssueTrack.showModal(record);}}
                                >{'查看'}
                                </a>
                            </div>
                            <div className={styles.btnWrap}
                                 style={{textAlign: 'left', width: '45%', marginLeft: '10%'}}>
                                <a className={styles["edit-detail"] + ' ' + styles["bookTag"]}
                                   onClick={() => this.editIssueTrackClick(proj_id, record)}
                                >{'编辑'}
                                </a>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div style={{textAlign: 'left'}}>
                            <div className={styles.btnWrap} style={{textAlign: 'center', width: '100%'}}>
                                <a className={styles["book-detail"] + ' ' + styles.bookTag}
                                   onClick={()=>{this.refs.checkIssueTrack.showModal(record);}}
                                >{'查看'}
                                </a>
                            </div>
                        </div>
                    );
                }
            }
        }];

    render() {
        const {loading, issueTrackList, proj_name, mgr_name, dept_name, proj_id, relatedRiskList} = this.props
        if (issueTrackList.length) {
            issueTrackList.map((i, index) => {
                i.key = index;
            });
            //遍历问题表issueTrackList，
            for (let i = 0; i < issueTrackList.length; i++) {
                for (let j = 0; j < relatedRiskList.length; j++) {
                    if (issueTrackList[i].risk_uid === relatedRiskList[j].risk_uid) {
                        issueTrackList[i].risk = relatedRiskList[j].risk;
                    }
                }
            }
        }
        return (
            <div className={styles.whiteBack}>
                <div><p className={styles.title}>{proj_name}</p></div>
                <div style={{textAlign: 'center'}}><Icon style={{marginTop: '10px', marginBottom: '5px'}}
                                                         type="user"/>项目经理：{mgr_name}
                    <Icon style={{marginLeft: '50px'}} type="home"/>主责部门：{dept_name}</div>
                {/*权限判别，项目经理可以进行增加风险的操作*/}
                <div style={{float: 'right'}}>
                    {this.props.mgr_id == Cookie.get('staff_id') ?
                        <Button style={{marginBottom: '5px'}} type="primary"
                                onClick={() => this.addIssueTrackClick(proj_id)}>{'问题新增'}</Button>
                        :
                        null
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={() => this.goBack()}>{'返回'}</Button>
                </div>
                <Table style={{marginTop: '36px'}}
                       bordered={true}
                       columns={this.columns}
                       dataSource={issueTrackList}
                       pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                       loading={loading}
                       className={styles.orderTable}/>
                {/*查看风险模态框*/}
                <CheckIssueTrackModal ref='checkIssueTrack'/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    // const { issueTrackList,record,proj_name,mgr_name,dept_name,mgr_id,proj_id,id} = state.projIssueTrackList;
    return {
        loading: state.loading.models.projIssueTrackList,
        ...state.projIssueTrackList
    };
}


export default connect(mapStateToProps)(projIssueTrackList);
