/**
 * 作者：彭东洋
 * 创建日期：2020-2-18
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-归属部门设置 
 */
import React from 'react';
import { Modal, Button, Table, Switch,message, Tabs} from 'antd';
import { connect } from 'dva';
import { getUuid } from '../../../../../components/commonApp/commonAppConst.js';
import styles from '../mailNotification/mailNotice.less';
import DeptRadioGroup from '../../../../../components/common/deptRadio.js';
import config from '../../../../../utils/config'
const TabPane = Tabs.TabPane;
class DepartmentSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptUuid: "" ,//新增模态框的uuid
            mainDeptVisible: false
        }
    }
    //修改状态
    changeState = (e,record) => {
        const { dispatch } =this.props;
        let state = e ? "on" : "off"
        const postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/departmentSetting",
            arg_puid: record.pu_id,
            arg_state: state
        }
        dispatch({
            type: "departmentSetting/settingPuAllStateUpdate",
            postDtat
        });
    };
    //点击取消关闭模态框
    modalCancel = () => {
        this.setState({
            mainDeptVisible: false
        })
    };
    //点击新增时显示新增模态框
    addMOdal = () => {
        this.setState({
            mainDeptVisible: true,
            deptUuid: getUuid(62,30)
        });
    };
    //新增时选择部门
    hideMainDeptModel = () => {
        if(!this.refs.mainDeptRadioGroup.getData().dept_id) {
            message.error("请选择部门")
            return
        }
        this.setState({
            mainDeptVisible: false,
        })
        const { dispatch } = this.props;
        const postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/departmentSetting",
            arg_deptid: this.refs.mainDeptRadioGroup.getData().dept_id
        }
        dispatch({
            type: "departmentSetting/settingPuAllInsert",
            postDtat
        })
    };
    //表头
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
            title: "归属部门名称",
            dataIndex: "pu_name",
            key: "pu_name",
            width: "400px",
            render: (text) => {
                return (
                    <div style = {{textAlign:"left"}}>
                        {text}
                    </div>
                );
            }
        },
        {
            title: "状态",
            dataIndex: "state_show",
            key: "state_show",
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
                    <Switch
                        defaultChecked = {record.State}
                        onChange = {(e)=>this.changeState(e,record)}
                    />
                );
            }
        },
    ]
    render() {
        return(
            <div className = {styles.pageContainer}>
                <div style = {{paddingLeft: 15, paddingRight: 15}}>
                    <p style = {{textAlign: "center", fontSize: "20px", marginBottom: "10px"}}>归属部门设置</p>
                </div>
                <Tabs>
                    <TabPane tab = "归属部门设置" key = "0">
                        <div style = {{paddingTop: 13, paddingBottom: 16, background: "white"}}>
                            <div style = {{paddingLeft: 15, paddingRight: 15}}>
                                <div style = {{marginTop:2}}>
                                    <div style = {{marginBottom: 10}}>
                                        <p style = {{marginBottom:"16px",whiteSpace: "pre-wrap"}}>
                                            {this.props.CommentInfo}
                                        </p>
                                        <Button type = "primary" onClick = {this.addMOdal}>
                                            新增
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Table 
                                        loading = {this.props.loading}
                                        columns = {this.columns}
                                        bordered = {true}
                                        className = {styles.orderTable}
                                        dataSource = {this.props.dataList}
                                        pagination = {false}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    {/* <TabPane tab = "待定" key = "1">
                    </TabPane> */}
                </Tabs>
                <Modal key="dept_name"
                        visible={this.state.mainDeptVisible}
                        width={config.DEPT_MODAL_WIDTH}
                        title="选择部门"
                        onCancel={this.modalCancel}
                        key = {this.state.deptUuid}
                        footer={[
                    <Button key="mainDeptNameClose"
                            size="large"
                            onClick={this.modalCancel}>关闭</Button>,
                    <Button key="mainDeptNameConfirm"
                            type="primary"
                            size="large"
                            onClick={this.hideMainDeptModel}>确定
                    </Button>
                        ]}
                >
                    <div>
                        <DeptRadioGroup ref='mainDeptRadioGroup' />
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.departmentSetting,
        ...state.departmentSetting
    };
}
export default connect(mapStateToProps)(DepartmentSetting);