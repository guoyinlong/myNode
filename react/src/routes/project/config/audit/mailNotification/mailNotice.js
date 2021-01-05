/**
 * 作者：彭东洋
 * 创建日期：2020-2-18
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-邮件通知人员设置 
 */
import React from 'react';
import { Tabs , Table , Button , Modal, message } from 'antd';
import { connect } from 'dva';
import styles from './mailNotice.less';
import { getUuid } from '../../../../../components/commonApp/commonAppConst.js';
import SelectCoopDeptPerson from '../../../monitor/change/projChangeApply/selectCoopDeptPerson';
const TabPane = Tabs.TabPane;
class MailNotice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false,
            selectedKeys: "",
            teamVisiable: false
        }
    }
    //点击确定新增邮件通知配置人员
    addStaff = () => {
        const {dispatch } = this.props;
        if(!this.refs.assignDeptComp.getData(true)[0].userid) {
            message.error("请选择人员");
            return
        }
        this.setState({
            addVisible: false
        })
        const postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/mailNotice",
            arg_user_list: this.refs.assignDeptComp.getData(true)[0].userid
        }
        dispatch({
            type:"mailNotice/userInsert",
            postDtat
        })
    };
    //点击确定新增团队人员
    teamAdd = () => {
        const { dispatch } =this.props;
        if(!this.refs.assignDeptComp.getData(true)[0].userid) {
            message.error("请选择人员");
            return
        }
        this.setState({
            teamVisiable: false
        })
        const postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/mailNotice",
            arg_user_list: this.refs.assignDeptComp.getData(true)[0].userid
        }
        dispatch({
            type:"mailNotice/projnamechangeUserListInsert",
            postDtat
        })
    };
    //资本化通知点击取消关闭新增模态框
    addCancel = () => {
        this.setState({
            addVisible: false
        })
    };
    //团队创建关闭新增模态框
    teamCancel = () => {
        this.setState({
            teamVisiable: false 
        })
    }
    //资本化点击新增显示新增模态框
    addMOdal = () => {
        this.setState({
            addVisible: true,
            addUuid:getUuid(20,62)
        })
    };
    //团队创建新增模态框
    teamAddModal = () => {
        this.setState({
            teamVisiable: true,
            teamUuid: getUuid(20,62)
        })
    };
    //资本化人员删除
    delete = (record) => {
        const {dispatch} = this.props;
        const postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/mailNotice",
            arg_userid: record.user_id
        }
        Modal.confirm({
            title:"是否确定删除",
            onOk(){
                dispatch({
                    type:"mailNotice/userDelete",
                    postDtat
                });
            },
            oncancel(){}
        })
    };
    //团队创建人员删除
    teamDelete = (record) => {
        const { dispatch } =this.props;
        const postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/mailNotice",
            arg_userid: record.user_id
        }
        Modal.confirm({
            title:"是否确定删除",
            onOk(){
                dispatch({
                    type:"mailNotice/projnamechangeUserListDelete",
                    postDtat
                });
            },
            oncancel(){}
        })

    }
    //资本化通知表头
    columns = [
        {
            title: "序号",
            dataIndex: "index",
            key: "index",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "员工姓名",
            dataIndex: "user_name",
            key: "user_name",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "员工编号",
            dataIndex: "user_id",
            key: "user_id",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "部门名称",
            dataIndex: "dept_name",
            key: "dept_name",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "OU",
            dataIndex: "ou_name",
            key: "ou_name",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,record) => {
                return (
                    <div>
                        <Button type = "primary" onClick = {()=>this.delete(record)}>删除</Button>
                    </div>
                );
            }
        },
    ]
    //团队创建表头
    teamColumns = [
        {
            title: "序号",
            dataIndex: "index",
            key: "index",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "员工姓名",
            dataIndex: "user_name",
            key: "user_name",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "员工编号",
            dataIndex: "user_id",
            key: "user_id",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "部门名称",
            dataIndex: "dept_name",
            key: "dept_name",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "OU",
            dataIndex: "ou_name",
            key: "ou_name",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,record) => {
                return (
                    <div>
                        <Button type = "primary" onClick = {()=>this.teamDelete(record)}>删除</Button>
                    </div>
                );
            }
        },
    ]
    render(){
        return (
            <div className = {styles.pageContainer}>
                <div style = {{paddingLeft: 15, paddingRight: 15}}>
                    <p style = {{textAlign: "center", fontSize: "20px", marginBottom: "10px"}}>邮件通知人员设置</p>
                </div>
                <Tabs>
                    <TabPane tab = "资本化通知 " key = "0">
                        <div style = {{paddingTop: 13, paddingBottom: 16, background: "white"}}>
                            <div style = {{paddingLeft: 15, paddingRight: 15}}>
                                <div style = {{marginTop:2}}>
                                    <div style = {{marginBottom: 10}}>
                                        <p style = {{marginBottom:"16px",whiteSpace: "pre-wrap"}} >
                                            {this.props.CommentInfo}
                                        </p>
                                        <Button type = "primary" onClick = {this.addMOdal}>
                                            新增
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Table 
                                        columns = {this.columns}
                                        bordered = {true}
                                        className = {styles.orderTable}
                                        dataSource = {this.props.capitalList}
                                        loading = {this.props.loading}
                                        pagination = {false}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab = "团队创建通知" key = "1">
                        <div style = {{paddingLeft: 15, paddingRight: 15}}>
                            <div style = {{marginTop:2}}>
                                <div style = {{marginBottom: 10}}>
                                    <p style = {{marginBottom:"16px",whiteSpace: "pre-wrap"}}>
                                        {this.props.teamCommentInfo}
                                    </p>
                                    <Button type = "primary" onClick = {this.teamAddModal}>
                                        新增
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Table 
                                    loading = {this.props.loading}
                                    columns = {this.teamColumns}
                                    bordered = {true}
                                    className = {styles.orderTable}
                                    dataSource = {this.props.UserList}
                                    pagination = {false}
                                />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
                {/* 资本化通知新增模态框 */}
                <Modal
                    title = "新增人员信息"
                    visible = {this.state.addVisible}
                    onCancel = {this.addCancel}
                    onOk = {this.addStaff}
                    key = {this.state.addUuid}
                >
                    <div style = {{marginBottom: 10}}>
                        <span style = {{marginBottom: 10}}>员工：</span>
                        <SelectCoopDeptPerson
                            ref = "assignDeptComp"
                            postData = {{arg_tenantid:"10010",arg_proj_id:this.state.role_id}}
                            searchUrl = {"/microservice/project/common_get_user_dept"}
                            key = {getUuid(32,64)}
                        />
                    </div>
                </Modal>
                {/* 团队创建新增模态框 */}
                <Modal
                    title = "新增人员信息"
                    visible = {this.state.teamVisiable}
                    onCancel = {this.teamCancel}
                    onOk = {this.teamAdd}
                    key = {this.state.teamUuid}
                >
                    <div style = {{marginBottom: 10}}>
                        <span style = {{marginBottom: 10}}>员工：</span>
                        <SelectCoopDeptPerson
                            ref = "assignDeptComp"
                            postData = {{arg_tenantid:"10010",arg_proj_id:this.state.role_id}}
                            searchUrl = {"/microservice/project/common_get_user_dept"}
                            key = {getUuid(32,64)}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.mailNotice,
        ...state.mailNotice
    };
}
export default connect(mapStateToProps)(MailNotice);