 /**
  * 作者： 彭东洋
  * 创建日期： 2019-10-12
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 常用资料-配置管理
*/
import React from 'react';
import { connect } from 'dva';
import { Table, Input, Modal, Button, Tabs,Select, TreeSelect, message} from 'antd';
import { getUuid } from './../../../components/commonApp/commonAppConst'
const TabPane = Tabs.TabPane;
import styles from './managerConfig.less'
class MangerConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: 'seat',
            detailVisible: false,//修改模态框显隐状态
            addVisible: false, //新增
            switchState:false,//开关
            dealVisible: false, //删除
            categoryVisible:false,//类别配置
            deptName:"", //文件名字
            userName:"",//上传人姓名
            uuid: "uuid",
            Catalog:"",
            configPage: 1,  //配置管理页码
            pageSize: 10,    //每页数目
            configTotal: 0, //配置管理总条数
            dataPage: 1, //资料管理员页码
            dataTotal: 0, //配置管理总条数
            tabKey: "1",
            categoryUuid: "categoryUuid", //类别管理员uuid
            dealUuid: "dealUuid",
            manageIdList: [],
            rowAddVisible: false,   //行内类别管理员显隐状态
            rowAddUuid:"rowAddUuid",
            rowDealUuid: "rowDealUuid"
        }
        this.userInfo = []
        this.deptUserInfo = []
    };
    //点击取消关闭修改模态框
    detailHandleCancel = () => {
        this.setState({
             detailVisible: false
        });
    };
    //点击取消关闭行内新增模态框
    rowAddCancel = () => {
        this.setState({
            rowAddVisible: false
        })
    }
    //当点击修改按钮时修改类别管理员
    detailBtn = (record) => {
        const {dispatch} = this.props;
        dispatch({
            type:"commonData/clearStaffList"
        });
        if(record.dept_id) {
            const postData = {
                arg_dept_id: record.dept_id.join()
            };
            dispatch({
                type:"commonData/queryUserInfoByDeptId",
                postData
            });
        }
        this.setState({
            detailVisible: true,
            Catalog: record.path_name,
            manageId: record.manage_id,
            pathId: record.path_id,
            modifyUuid: getUuid(20,62),
            deptId: record.dept_id,
            manageUserId: record.full_name,
            manageUserName: record.user_name
        });
    };
    // 当点击行内删除按钮时显示删除模态框
    rowDeleteBtn = (record) => {
        // const {dispatch} = this.props;
        this.setState({
            Catalog: record.path_name
        })
        let userInfoList = [];
        if(record.userInfo) {
            JSON.parse(record.userInfo).map((v) => {
                userInfoList.push(v.manage_id+"#"+v.user_name)
            });
            this.deptUserInfo = userInfoList;
        } else {
            this.deptUserInfo = [];
        }
        this.setState({
            rowDeleteVisible: true,
            rowDealUuid:getUuid(20,62)
        })
    }
    //点击行内新增按钮新增类别管理员
    rowAddBtn = (record) => {
        const {dispatch} = this.props;
        dispatch({
            type:"commonData/clearStaffList"
        });
        this.setState({
            rowAddVisible: true,
            Catalog: record.path_name,
            manageId: record.manage_id,
            pathId: record.path_id,
            rowAddUuid: getUuid(20,62),
            deptId: record.dept_id,
            manageUserId: record.full_name,
            manageUserName: record.user_name,
            CatalogId: record.path_id
        });
    }
    //行内新增类别管理员点击确定时新增人员
    rowAddHandleOk = () => {
        const { dispatch } = this.props;
        const { manageUserId, manageUserName, deptId, CatalogId,configPage,fCatalogDeptName,fCatalogUserName} = this.state;
        const data = {
            dept_name: fCatalogDeptName,
            user_name: fCatalogUserName,
            arg_user_id: manageUserId,
            arg_user_name: manageUserName,
            arg_dept_id: deptId,
            arg_path_id: CatalogId,
            arg_role: "pathAdmin",
            arg_page_current: configPage
        };
        dispatch({
            type: "commonData/createRole",
            data
        })
        this.setState({
            rowAddVisible: false
        });
    }
    //点击新增部门管理员按钮
    newlyAdded = (record) => {
        const {dispatch} = this.props;
        this.setState({
            addVisible: true,//显示新增模态框
            uuid: getUuid(20,62),
            newlyDeptId:record.dept_id, //保存新增的部门id
        });
        const postData = {
            arg_dept_id: record.dept_id
        }
        dispatch({
            type: "commonData/queryUserInfoByDeptId",
            postData
        })
        dispatch({
            type: "commonData/clearStaffList"
        });
    };
    //当点击删除按钮时
    deleteButton = (record) => {
        const {dispatch} = this.props;
        let manageIdList = [];
        let userInfoList = [];
        if(record.userInfo) {
            JSON.parse(record.userInfo).map((v) => {
                userInfoList.push(v.manage_id+"#"+v.user_name)
            });
            this.userInfo = userInfoList;
        } else {
            this.userInfo = [];
        }
        this.setState({
            dealVisible: true,
            dealUuid: getUuid(20,62),
            manageIdList,
            newlyDeptId:record.dept_id,
        });
        const postData = {
            arg_dept_id: record.dept_id
        }
        dispatch({
            type: "commonData/queryUserInfoByDeptId",
            postData
        });
    }
    //当点击查询时
    getRealList = () => {
        const {deptName, userName} = this.state;
        const { dispatch } = this.props;
        this.setState({
            finalDeptName: deptName,
            finalUserName: userName,
            dataPage: 1
        });
        const data = {
            arg_dept_name: deptName,
            arg_user_name: userName,
            arg_status: "0"
        };
        dispatch ({
            type: "commonData/queryManageList",
            data
        });
    };
    //查询目录管理员
    getCatalogRealList = () => {
        const {CatalogDeptName, CatalogUserName} = this.state;
        const {dispatch} = this.props;
        this.setState({
            fCatalogDeptName: CatalogDeptName,
            fCatalogUserName: CatalogUserName,
            configPage: 1
        })
        const data = {
            arg_dept_name: CatalogDeptName,
            arg_user_name: CatalogUserName,
            arg_status: "1"
        };
        dispatch ({
            type: "commonData/queryManageList",
            data
        });
    }
    //当点击清空时
    emptyRequest = () => {
        const { dispatch } = this.props;
        this.setState ({
            deptName: "",
            userName: "",
            finalDeptName:"",
            finalUserName: "",
            dataPage: 1  //部门配置当前的页数
        });
        const data = {
            arg_dept_name: "",
            arg_user_name: "",
            arg_status: "0",
        };
        dispatch ({
            type: "commonData/queryManageList",
            data
        });
    };
    
    //清空目录管理员搜索框
    emptyCatalogRequest = () => {
        const { dispatch } = this.props;
        this.setState ({
            CatalogDeptName: "",
            CatalogUserName: "",
            fCatalogDeptName:"",
            fCatalogUserName: "",
            configPage: 1  //部门配置当前的页数
        });
        const data = {
            arg_dept_name: "",
            arg_user_name: "",
            arg_status: "1",
        };
        dispatch ({
            type: "commonData/queryManageList",
            data
        });
    }
    //当点击确认时新增资料管理员
    addHandleOk = () => {
        const { dispatch} = this.props;
        const {dataPage,finalDeptName,finalUserName,manageIdList,newlyDeptId} = this.state;
        if(manageIdList.length == 0){
            message.error("请选择人员")
            return
        }
        const data = {
            dept_name: finalDeptName,
            user_name: finalUserName,
            arg_user_id: manageIdList.split("#")[0],
            arg_user_name: manageIdList.split("#")[1],
            arg_dept_id: newlyDeptId,
            arg_role: "deptAdmin",
            arg_page_current: dataPage
        };
        dispatch({
            type: "commonData/createRole",
            data
        });
        this.setState({
            addVisible: false,
        });
    };
    //当点击确定时删除资料管理员
    dealHandleOk = () => {
        const {dispatch} = this.props;
        const {finalDeptName,finalUserName,dataPage,manageIdList} = this.state;
        let midDataPage = dataPage;
        if(manageIdList.length == 0) {
            message.error("请选择人员");
            return
        }
        this.setState({
            dealVisible: false
        });
        const data = {
            flag: "data",
            arg_manage_state: "delete",
            arg_manage_id: manageIdList.split("#")[0],
            dataPage: midDataPage,
            arg_dept_name: finalDeptName,
            arg_user_name: finalUserName
        };
        dispatch ({
            type:"commonData/updateManage",
            data
        }); 
    }
    //点击确定删除目录管理员
    dealCatalogHandleOk = () => {
        const { dispatch, RowCount} = this.props;
        const {configPage,manageUserId,fCatalogDeptName,fCatalogUserName} = this.state;
        let midConfigPage = configPage;
        
        if(RowCount == 1 && configPage > 1 && (fCatalogDeptName || fCatalogUserName)) {
            midConfigPage = configPage - 1;
            this.setState({
                configPage:configPage - 1,
            })
        } 
        const data = {
            arg_manage_state: "delete",
            arg_manage_id: manageUserId,
            arg_dept_name: fCatalogDeptName,
            arg_user_name: fCatalogUserName,
            flag: "Catalog",
            configPage:  midConfigPage,
        };
        dispatch ({
            type:"commonData/updateManage",
            data
        }); 
        this.setState({
            rowDeleteVisible: false
        })
    }
    dealCatalogHandleCancel = () => {
        this.setState({
            rowDeleteVisible: false
        })
    }
    //当点击取消时关闭删除模态框
    dealHandleCancel = () => {
        this.setState({
            dealVisible: false,
            manageIdList: [],
        })
    }
    //当点击取消时
    addHandleCancel = () => {
        this.setState({
            addVisible: false,
            manageIdList: []
        });
    };
    //当选择目录时
    catalogSelect = (value) => {
        this.setState({
            CatalogId: value.split("#")[1]
        });
    };
    //增加类别管理员取消
    cancelAddCategories = () => {
        this.setState({
            categoryVisible:false
        });
    };
    //保存搜索的部门名
    searchFileName = (e) => {
        this.setState({
            deptName: e.target.value
        });
    };
    //保存目录搜索的部门名称
    searchCatalogName = (e) => {
        this.setState({
            CatalogDeptName: e.target.value
        });
    }
    //保存上传人姓名
    searchName = (e) => {
        this.setState ({
            userName: e.target.value
        });
    };
    searchCatalogStaffName = (e) => {
        this.setState ({
            CatalogUserName: e.target.value
        });
    }
    //更改页码
    changePage = (page,pageSize,flag) => {
        const { dispatch } = this.props;
        const {finalDeptName, finalUserName, fCatalogUserName, fCatalogDeptName} = this.state;
        if(!flag){
            this.setState({
                dataPage: page
            });
            const data = {
                arg_page_current: page,
                arg_dept_name: finalDeptName,
                arg_user_name: finalUserName,
                arg_status: "0"
            };
            dispatch({
                type:"commonData/queryManageList",
                data
            })
        } else {
            this.setState({
                configPage: page
            });
            const data = {
                arg_dept_name: fCatalogDeptName,
                arg_user_name: fCatalogUserName,
                arg_page_current: page,
                arg_status: "1"
                
            };
            dispatch({
                type:"commonData/queryManageList",
                data
            })
        }
    };
    //更换tabs
    tabChange = (key) => {
        const { dispatch } = this.props;
        if(key == "1") {
            this.setState({
                dataPage: 1,
                tabKey: "1",
                deptName: "",
                userName: "",
                finalDeptName: "",
                finalUserName: ""
            });
            const data = {
                arg_status: "0" ,
            };
            dispatch({
                type: "commonData/queryManageList",
                data
            });
        } else {
            this.setState({
                configPage: 1,
                tabKey: "2", 
            });
            const data = {
                arg_status: "1" ,
            };
            dispatch ({
                type: "commonData/queryManageList",
                data
            });
        }
    };
    //当选择可见部门时
    depTreeChange = (value) => {
        const { dispatch } = this.props;
        const postData = {
            arg_dept_id: value
        }; 
        dispatch ({
            type:"commonData/queryUserInfoByDeptId",
            postData
        });
        this.setState({
            deptId: value,
            manageUserId:"",
            manageUserName: "",
        })
    };
    //类别管理员修改人员
    staffSelect = (value) => {
        this.setState({
            manageIdList: value,
            manageUserId: value.split("#")[0],
            manageUserName: value.split("#")[1]
        })
    };
    //生成删除人员的下拉框
    generateDropdown = (list) => {
        return list.map((item) => {
            return (
				<Select.Option 
					key = {item.split("#")[0]}
					value = { item }
				>
					{item.split("#")[1]}
				</Select.Option>
			);
        })
    }
    //生成删除部门管理员的下拉框
    deptAdminDropDown = (list) => {
        return list.map((item) => {
            return (
				<Select.Option 
					key = {item.split("#")[0]}
					value = { item }
				>
					{item.split("#")[1]}
				</Select.Option>
			);
        })
    } 
    //行内删除目录管理员点击下拉框选择人员
    rowDeleteStaffSelect = (value) => {
        this.setState({
            manageUserId: value.split("#")[0]
        })
    }
    render() {
        const { staffList} = this.props;
        let selectDepartmentDemo = staffList.map((item) => {
			return (
				<Select.Option 
                    key = {item.userid}
					value = { item.userid + '#' + item.username }
				>
					{item.username}
				</Select.Option>
			);
        });
        const dataColumns = [
            {
                title: "序号",
                dataIndex: "index",
                key: "index",
                render: (text) => {
                    return (
                        <div>{text}</div>
                    );
                }
            },{
                title: "部门",
                dataIndex: "deptname",
                key: "deptname",
                render: (text) => {
                    return (
                        <div>{text}</div>
                    );
                }
            },{
                title: "姓名",
                dataIndex: "user_name",
                key: "user_name",
                render: (text) => {
                    if(text) {
                        return text.map((value,index) => {
                            return (
                                <div style = {{marginTop:"10px"}} key = {index}>{value}</div>
                            );
                        })
                    }
                }
             },{
                title: "操作",
                dataIndex: "option",
                key: "option",
                render: (text,record) => {
                    return (
                        <div className = {styles.approval}>
                            <Button 
                                    type = "primary"
                                    style = {{marginRight:"50px"}}
                                    onClick = {() => this.newlyAdded(record)}
                                    disabled = {!this.props.btnStyle}
                            >
                                    新增
                            </Button>
                            <Button 
                                    type = "primary"
                                    onClick = {() => this.deleteButton(record)}
                                    disabled = {!this.props.btnStyle}
                            >
                                    删除
                            </Button>
                        </div>
                    );
                }
            }
        ];
          
        const categoryColumns =[
            {
                title:"序号",
                dataIndex:"index",
                key: "Serialnumber",
                render: (text) => {
                    return (
                        <div>{text}</div>
                    );
                }
            },
            {
                title: "一级目录",
                dataIndex: "path_name",
                key: "path_name",
                render: (text) => {
                    return (
                        <div>{text}</div>
                    );
                }
            },
            {
                title: "部门",
                dataIndex: "deptname",
                key: "deptname",
                render: (text) => {
                    if(text) {
                        return text.map((value,index) => {
                            return (
                                <div style = {{marginTop:"10px"}} key = {index}>{value}</div>
                            );
                        })
                    }
                }
            },
            {
                title: "姓名",
                dataIndex: "user_name",
                key: "userName",
                render: (text) => {
                    if(text) {
                        return text.map((value,index) => {
                            return (
                                <div style = {{marginTop:"10px"}} key = {index}>{value}</div>
                            );
                        })
                    }
                }
            },
            {
                title: "操作",
                dataIndex: "option",
                key: "Option",
                render: (text,record) => {
                    return (
                        <div className = {styles.approval}>
                            <Button 
                                type = "primary"
                                style = {{marginRight:"50px"}}
                                onClick = {() => this.rowAddBtn(record)}
                                disabled = {!this.props.btnStyle}
                            >
                                新增
                            </Button>
                            <Button 
                                type = "primary" 
                                onClick = {() => this.rowDeleteBtn(record)}
                                disabled = {!this.props.btnStyle}
                            >
                                删除
                            </Button>
                        </div>
                    );
                }
            }
        ];
        return (
            <div className = {styles.blackWrapper} >
                <h2 style = {{textAlign: 'center',marginBottom:"40px"}}>管理配置</h2>
                <Tabs 
                    onChange = {this.tabChange}
                    activeKey = {this.state.tabKey}
                >
                    <TabPane tab="部门管理员配置" key = "1">
                        <div>
                            <div style = {{overflow:"hidden",margin:"20px"}}>
                                <div style = {{float:"left"}}>
                                    部门名称：<Input className = {styles.searchInput} onChange = { this.searchFileName } value = {this.state.deptName}/>
                                    姓名：<Input className = {styles.searchInput} onChange = { this.searchName } value = { this.state.userName}/>
                                </div>
                                <div style = {{float:"right"}}>
                                    <Button type = "primary" className = {styles.btn} onClick = {this.getRealList}>查询</Button>
                                    <Button type = "primary" className = {styles.btn} onClick = {this.emptyRequest}>清空</Button>
                                </div>
                            </div>
                            <div>
                                <Table 
                                    columns = {dataColumns}
                                    className = {styles.orderTable}
                                    dataSource = {this.props.manageList}
                                    loading = {this.props.loading}
                                    pagination = {{
                                        current:this.state.dataPage,
                                        total:this.props.dataTotal,
                                        pageSize:this.state.pageSize,
                                        onChange: this.changePage,
                                    }}
                                />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="目录管理员配置" key = "2">
                        <div>
                            <div style = {{overflow:"hidden",margin:"20px"}}>
                                <div style = {{float:"left"}}>
                                    部门名称：<Input className = {styles.searchInput} onChange = { this.searchCatalogName } value = {this.state.CatalogDeptName}/>
                                    姓名：<Input className = {styles.searchInput} onChange = { this.searchCatalogStaffName } value = { this.state.CatalogUserName}/>
                                </div>
                                <div style = {{float:"right"}}>
                                    <Button type = "primary" className = {styles.btn} onClick = {this.getCatalogRealList}>查询</Button>
                                    <Button type = "primary" className = {styles.btn} onClick = {this.emptyCatalogRequest}>清空</Button>
                                </div>
                            </div>
                            <Table 
                                columns = {categoryColumns}
                                dataSource = {this.props.categoryList}
                                className = {styles.orderTable}
                                loading = {this.props.loading}
                                pagination = {{
                                    current:this.state.configPage,
                                    total:this.props.configTotal,
                                    pageSize:this.state.pageSize,
                                    onChange: (page,pageSize) => this.changePage(page,pageSize,"category "),
                                }}
                            />
                        </div>
                    </TabPane>
                </Tabs>
                {/* 行内目录管理员新增模态框 */}
                {
                    <Modal
                        title = "目录管理员新增"
                        visible = {this.state.rowAddVisible}
                        onOk = {this.rowAddHandleOk}
                        onCancel = {this.rowAddCancel}
                        bodyStyle = {{textAlign:"center"}}
                        key =  {this.state.rowAddUuid}
                    >
                        <div style = {{marginTop:"20px"}}>
                            目录:
                            <Select 
                                value= {this.state.Catalog} 
                                disabled 
                                className = {styles.inputSearch} 
                                size = "large"
                            >
                            </Select>
                        </div>
                        <div style = {{marginTop:"20px"}}>
                            部门:
                            <TreeSelect
                                dropdownMatchSelectWidth = {false}
                                className = {styles.inputSearch} 
                                size = "large"  
                                treeData = {this.props.directoryList}
                                onChange = {this.depTreeChange}
                                placeholder="请选择部门" 
                            />
                        </div> 
                        <div style = {{marginTop:"20px",paddingBottom: "40px"}}>
                            人员:
                            <Select  
                                className = {styles.inputSearch} 
                                size = "large"
                                onSelect={this.staffSelect}
                                placeholder="请选择人员"
                            >
                                {selectDepartmentDemo}
                            </Select>
                        </div>   
                    </Modal>
                }
                <Modal
                    title = "删除目录管理员"
                    visible = {this.state.rowDeleteVisible}
                    onOk = {this.dealCatalogHandleOk}
                    onCancel = {this.dealCatalogHandleCancel}
                    className = {styles.newMOdal}
                    key = {this.state.rowDealUuid}
                >
                    <div style = {{marginTop:"20px"}}>
                        目录:
                        <Select 
                            value= {this.state.Catalog} 
                            disabled 
                            className = {styles.inputSearch} 
                            size = "large"
                        >
                        </Select>
                    </div>
                    <div style = {{marginTop:"20px",paddingBottom: "40px"}}>
                        人员:
                        <Select  
                            className = {styles.inputSearch} 
                            size = "large"
                            onSelect={this.rowDeleteStaffSelect}
                            placeholder="请选择人员"
                        >
                            {this.deptAdminDropDown(this.deptUserInfo)}
                        </Select>
                    </div>   
                </Modal>
                {/* 资料审批员新增模态框 */}
                <Modal
                    title = "新增部门管理员"
                    visible = {this.state.addVisible}
                    onOk = {this.addHandleOk}
                    onCancel = {this.addHandleCancel}
                    className = {styles.newMOdal}
                    key = {this.state.uuid}
                >
                    <div style = {{marginTop:"20px"}}>
                        部门:
                        <TreeSelect
                            dropdownMatchSelectWidth = {false}
                            className = {styles.inputSearch} 
                            size = "large"  
                            treeData = {this.props.directoryList}
                            onChange = {this.depTreeChange}
                            placeholder="请选择部门"  
                            value = {this.state.newlyDeptId}
                            disabled
                        />
                    </div>
                    <div style = {{marginTop:"20px",paddingBottom: "40px"}}>
                        人员:
                            <Select  
                                className = {styles.inputSearch} 
                                size = "large"
                                onChange = {this.staffSelect}
                                placeholder="请选择人员"
                            >
                                {selectDepartmentDemo}
                            </Select>
                    </div>  
                </Modal>
                {/* 资料审批员删除模态框 */}
                <Modal
                    title = "删除部门管理员"
                    visible = {this.state.dealVisible}
                    onOk = {this.dealHandleOk}
                    onCancel = {this.dealHandleCancel}
                    className = {styles.newMOdal}
                    key = {this.state.dealUuid}
                >
                    <div style = {{marginTop:"20px"}}>
                        部门:
                        <TreeSelect
                            dropdownMatchSelectWidth = {false}
                            className = {styles.inputSearch} 
                            size = "large"  
                            treeData = {this.props.directoryList}
                            onChange = {this.depTreeChange}
                            placeholder="请选择部门"  
                            value = {this.state.newlyDeptId}
                            disabled
                        />
                    </div>
                    <div style = {{marginTop:"20px",paddingBottom: "40px"}}>
                        人员:
                            <Select  
                                className = {styles.inputSearch} 
                                size = "large"
                                onChange = {this.staffSelect}
                                placeholder="请选择人员"
                            >
                                {this.generateDropdown(this.userInfo)}
                            </Select>
                    </div>  
                </Modal>
                {/* 类别管理员新增模态框 */}
            </div>
        );
          
    };
}
function mapStateToProps (state) {
    return {
        loading:state.loading.models.commonData,
        ...state.commonData
    };
}
export default connect(mapStateToProps)(MangerConfig);