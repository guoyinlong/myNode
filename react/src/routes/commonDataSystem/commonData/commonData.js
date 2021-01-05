/**
  * 作者： 彭东洋
  * 创建日期： 2019-10-12
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 常用资料
*/
import React from 'react';
import { connect } from 'dva';
import {Table, Tree, DatePicker, Input, Button, Icon, Modal, message, Select, Row, Col, TreeSelect, Radio, Tooltip} from 'antd';
import styles from '../mangerConfig/managerConfig.less';
import { routerRedux } from 'dva/router';
import { getUuid } from './../../../components/commonApp/commonAppConst';
import Cookie from 'js-cookie'; 
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;
const RadioGroup = Radio.Group;
let arg_staff_id = Cookie.get('userid');
class CommonData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, //详细信息显示状态
            fileName:"",
            uploader:"",
            infoData: [],
            beginTime: "",
            endTime: "",
            uuid: "",
            treeUuid: "",
            fileId: "", //文件的fileid
            pathId: "",
            levelFlag: true,
            contentValue:"", //左侧tree的path_id
            infoVisible: false, //详情模态框显示状态
            modifyVisible: false, //修改模态框显示状态
            realData:[],
            uploadFileID:[],
            uploaduuid: "",
            pageSize: 10,
            deptUuid: "",
            selectedFileId: [],
            batchDownloadStyle: true,
            tableuuid: "",
            uploadStyle: "inline-block"
        };  
    };
    //上传文件点击确定
    onOk = () => {
        this.setState({
            visible: false,
            uploaduuid: getUuid(20,62)
        });
    };
    //当点击取消时
    onCancel = () => {
        this.setState({
            visible: false,
            uploaduuid: getUuid(20,62)
        });
    };
    //跳转到上传页面
    goToUpload = () => {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: "/adminApp/commonDataSystem/commonData/UploadFiles",
            query:this.state.postData
        }));
    };
    //当选择左侧的树节点时
    onSelect = (selectedKeys,node) => {
        const { finalFileName, finalUploaderName, finalStartTime, finalEndTime} = this.state;
        const { dispatch } = this. props;
        const data = {
            arg_path_id:selectedKeys[0],//文件夹id
            arg_file_name: finalFileName,//文件名称
            arg_upload_start_time: finalStartTime,
            arg_upload_end_time: finalEndTime,
            arg_uploader_name: finalUploaderName,
            arg_page_current: 1,
            arg_status: "0",
        };
        //跳转界面时传递参数
        const postData = {
            arg_path_id:selectedKeys[0],
        };
        this.setState({
            uploadStyle: "inline-block",
            postData,
            dataPage: 1,
            path:selectedKeys[0],
            childrenLength: node.node.props.children.length,
            pathId: selectedKeys[0],
            batchDownloadStyle: true,
            selectedFileId: []
        });
        dispatch ({
            type:"commonData/queryFileByTerm",
            data
        });
    };

    //返回正确的时间
    getRealTime = (date) => {
        if(date){
            const realData = date.split(" ")[0];
            return realData;
        }
    };
    //修改上传文件的大小
    getRealSize = (data) => {
        if(data) {
            if(data / 1024/1024 > 1024){
                let realData = (data/1024/1024/1024).toFixed(2) + "GB";
                return realData;
            }
            else if(data / 1024 > 1024) {
                let realData = (data/1024/1024).toFixed(2) + "MB";
                return realData;
            } else if(data/1024 > 1) {
                let realData = (data/1024).toFixed(2) + "KB";
                return realData;
            }
            else {
                let realData = data + "B";
                return realData;
            }
        }
    };
    //点击查询按钮查询指定条件下的内容
    queryData = () => {
        const { dispatch } = this.props;
        const { fileName, uploader, beginTime, endTime,path} = this.state;
        // this.setState({
        //     dataPage: 1
        // });
        const data = {
            arg_file_name: fileName,
            arg_upload_start_time: beginTime,
            arg_upload_end_time: endTime,
            arg_uploader_name: uploader,
            arg_status: "0",
            arg_path_id: path,
            arg_page_current: 1
        };
        this.setState({
            finalFileName:fileName,
            finalStartTime:beginTime,
            finalEndTime: endTime,
            finalUploaderName: uploader,
            dataPage: 1,
            selectedFileId: [],
            batchDownloadStyle: true
        });
        dispatch ({
            type: "commonData/queryFileByTerm",
            data
        });
    };
    //清空查询条件
    clearData = () => {
        const { dispatch } = this.props;
        this.setState ({
            uploadStyle: "none",
            treeUuid: getUuid(20,62),
            fileName: "",
            uploader: "",
            beginTime: "",
            endTime: "",
            uuid: getUuid(20,62),
            tableuuid: getUuid(20,62),
            selectedFileId: [],
            batchDownloadStyle: true,
            dataPage: 1,
            path: "",
            finalFileName: "",
            finalStartTime: "",
            finalEndTime: "",
            finalUploaderName: ""
        });
        const data = {
            arg_file_name: "",
            arg_upload_start_time: "",
            arg_upload_end_time: "",
            arg_uploader_name: "",
            arg_status: "0",
            arg_path_id: ""
        };
        dispatch ({
            type: "commonData/queryFileByTerm",
            data
        });
    };
    //查询名字保存文件名称
    searchName = (e) => {
        this.setState({
            fileName: e.target.value
        })
    };
    //查询上传人保存上传人内容
    searchUpload = (e) => {
        this.setState({
            uploader: e.target.value
        })
    };
    //得到上传时间保存上传的时间
    getDate = (date,dateString) => {
        const beginTime = dateString[0];
        const endTime = dateString[1];
        this.setState({
            beginTime,
            endTime,
        });
    };
    //详细信息的模态框
    showInfoDetail = (record) => {
        this.setState({
            infoVisible:true,
            infoData:[
                {
                    title: "上传人",
                    key: "uploader_name",
                    value:record.uploader_name
                },
                {
                    title: "工号",
                    key: "uploader_id",
                    value:record.uploader_id
                },
                {
                    title: "部门",
                    key: "deptname",
                    value:record.deptname
                },
                {
                    title: "联系方式",
                    key: "tel",
                    value:record.tel
                },
                {
                    title: "路径",
                    key: "uploader_name",
                    value:record.path_url
                },
                {
                    title: "下载量",
                    key: "file_hits",
                    value:record.file_hits
                }
            ]
        })
    }
    //详细信息
    getDetail = (list) => {
        return list.map((v,i) => (
            <Row style = {{marginTop:"20px"}} key = {i}>
                <Col span = {8} style = {{textAlign: "right",paddingLeft:"20px"}}>{v.title}：</Col>
                <Col span = {16} style = {{textAlign: "left",paddingLeft:"20px"}}>{v.value}</Col>
            </Row>
      ));
    };
    //关闭详情模态框
    detailCancel =() => {
        this.setState({
            infoVisible: false
        });
    };
    //关闭修改模态框
    modifyCancel = () => {
        this.setState ({
            modifyVisible: false,
            deptUuid: getUuid(20,62),
        });
    };
    //点击修改按钮显示修改模态框调用查询可见范围服务
    modify = (record) => {
        const { dispatch } = this.props;
        const data = {
            arg_file_id: record.file_id
        }; 
        dispatch({
            type:"commonData/queryFileVisibleAndPath",
            data
        });
        this.setState({
            modifyVisible: true,
            contentValue: record.path_id,
            fileId: record.file_id, //需要修改
            deptUuid: getUuid(20,62),
        });
    };
    //点击下载按钮下载文件
    download = (record) => {
        const {finalFileName, finalStartTime, finalEndTime, finalUploaderName, path, dataPage} = this.state;
        const { dispatch } = this.props;
        const data = {
            arg_path_id: path,
            arg_file_name: finalFileName,
            arg_upload_start_time: finalStartTime,
            arg_upload_end_time: finalEndTime,
            arg_uploader_name: finalUploaderName,
            arg_page_current: dataPage,
            arg_status: "0",
            arg_file_id: record.file_id
        };
        dispatch ({
            type: "commonData/downFile",
            data
        });
    };
    //点击删除调用删除服务删除文件
    deleteData = (record) => {
        const { dispatch, RowCount } = this.props;
        const { pathId,dataPage,finalEndTime,finalFileName,finalStartTime,finalUploaderName} = this.state;
        Modal.confirm({
            title: "是否确认删除",
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                let arg_page_current = dataPage;
                if (RowCount == 1 && dataPage > 1) {
                    arg_page_current = dataPage-1;
                    this.setState({
                        dataPage: dataPage-1
                    });
                }
                const data = {
                    arg_file_id: record.file_id,
                    arg_file_name: finalFileName,
                    arg_upload_start_time: finalStartTime,
                    arg_upload_end_time: finalEndTime,
                    arg_uploader_name: finalUploaderName,
                    arg_status: "0",
                    arg_path_id: pathId,
                    arg_page_current
                };
                dispatch({
                    type: "commonData/delFile",
                    data
                })
            }
        })
    };
    //点击确定保存修改文件
    modifyFile = () => {
        const { dispatch, radivoValue, visibleRange, userRange} = this.props;
        const { fileId, levelFlag,contentValue,dataPage, path,finalEndTime,finalFileName,finalStartTime,finalUploaderName} = this.state;
        //按照部门查询时
        if(radivoValue == "dept") {
            let visible = visibleRange.join();
            if(visibleRange.length == 0) {
                message.error("请选择可见范围");
                return;
            }
            if( !levelFlag) {
                message.error("请选择最低一级目录");
                return;
            }
            this.setState({
                modifyVisible: false,
                deptUuid: getUuid(20,62)
            });
            const data = {
                arg_file_id: fileId, //文件id
                arg_visible: visible, //可见范围
                arg_path_id: contentValue,
                query_path_id: path, //查询文件时的 path_id
                arg_status: "0",
                arg_file_name: finalFileName,
                arg_upload_start_time: finalStartTime,
                arg_upload_end_time: finalEndTime,
                arg_uploader_name: finalUploaderName,
                arg_page_current: dataPage
            };
            dispatch({
                type: "commonData/updateFileServlet",
                data
            });
        } else {
            let visiblePersonnel = userRange.join();
            if( !visiblePersonnel ) {
                message.error("请选择可见范围");
                return;
            }
            if( !levelFlag) {
                message.error("请选择最低一级目录");
                return;
            }
            this.setState({
                modifyVisible: false,
            });
            const data = {
                arg_file_id: fileId,
                arg_visible: visiblePersonnel,
                arg_path_id: contentValue,
                arg_status: "0",
                arg_file_name: finalFileName,
                arg_upload_start_time: finalStartTime,
                arg_upload_end_time: finalEndTime,
                arg_uploader_name: finalUploaderName,
                arg_page_current: dataPage,
                query_path_id: path,
            };
            dispatch({
                type: "commonData/updateFileServlet",
                data
            });
        }
    };
    //生成tree
    loop = data => data.map((item) => {
        const title = <span>{item.key}</span>
        if(item.children) {
            return (
            <TreeNode 
                key = {item.key} 
                title = {
                    <Tooltip placement = "topLeft"  title = {item.title}>
                        <div style={{display:"inline-block", overflow:"hidden",textOverflow:"ellipsis",width:"140px"}}>
                            {item.title}
                        </div>
                    </Tooltip >} >
                    {this.loop(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode  key = {item.key} title = {title} />
    });
    //修改文件分类
    treeChange = (value,label,extra) => {
        const { dispatch } = this.props;
        if(extra.selected && extra.triggerNode.props.children){
            const data = {
                contentValue: value,
                pathId: extra.triggerValue, 
                levelFlag: false
            };
            dispatch({
                type: "commonData/documentClassification",
                data
            });
            this.setState({
                contentValue: value,
                pathId: extra.triggerValue,
                levelFlag: false
            });
        } else {
            const data = {
                contentValue: value,
                pathId: extra.triggerValue,
                levelFlag: true
            };
            dispatch({
                type: "commonData/documentClassification",
                data
            });
            this.setState({
                contentValue: value,
                pathId: extra.triggerValue,
                levelFlag: true
            });
        }
    };
    //按部门修改tree
    deptChange =(value) => {
        const { dispatch } = this.props;
        const data = {
            visibleRange: value
        };
        dispatch({
            type: "commonData/setVisibleRange",
            data
        });
    };
    //改变单选按钮
    radioChange = (e) => {
        const { dispatch } = this.props;
        const data = {
            value: e.target.value
        };
        dispatch ({
            type: "commonData/radioChange",
            data
        });
    };
    //当选择可见部门时
    depTreeChange = (value) => {
        const { dispatch } = this.props;
        if(value.length > 0){
            const postData = {
                arg_dept_id: value.join()
            };
            //根据部门查询人员
            dispatch ({
                type:"commonData/queryUserInfoByDeptId",
                postData
            });
        }
        this.setState({
            visibleSector: value.join(),
        });
        const data = {
            arg_dept_id: value
        };
        //修改可见部门
        dispatch ({
            type: "commonData/setPersonRange",
            data
        });
    };
    //按照人员查询选择部门时查询人员
    staffSelect = (value) => {
        const { dispatch } = this.props;
        if(value.length > 0) {
            const data = {
                userRange: value
            };
            dispatch({
                type: "commonData/setUserRange",
                data
            });
            this.setState({
                visibleSector:value.join(),
            });  
        } else {

            const data = {
                userRange: []
            };
            dispatch({
                type: "commonData/setUserRange",
                data
            });
            this.setState({
                visibleSector: ""
            });  
        }
    };
    //更改页码
    changePage = (page) => {
        const {finalFileName, finalStartTime, finalEndTime, finalUploaderName, path} = this.state;
        const { dispatch } = this.props;
        const data = {
            arg_path_id: path,
            arg_file_name: finalFileName,
            arg_upload_start_time: finalStartTime,
            arg_upload_end_time: finalEndTime,
            arg_uploader_name: finalUploaderName,
            arg_page_current: page,
            arg_status: "0"
        };
        dispatch({
            type: "commonData/queryFileByTerm",
            data
        });
        this.setState({
            dataPage: page,
            tableuuid: getUuid(20,62),//清空显示的选中项
            selectedFileId: [],
            batchDownloadStyle: true
        });
    }; 
    //表头
    columns = [
        {
            title: "名称",
            dataIndex: "fileName",
            key: "fileName",
            render: (text) => {
                return (
                    <div>{text}</div>
                );
            }
        },
        {
            title: "上传时间",
            dataIndex: "upload_time",
            key: "upload_time",
            render: (text) => {
                return (
                    <div>{this.getRealTime(text)}</div>
                );
            }
        },
        {
            title: "大小",
            dataIndex: "file_size",
            key: "file_size",
            render: (text) => {
                return (
                    <div>{this.getRealSize(text)}</div>
                );
            }
        },
        {
            title: "文件信息",
            dataIndex: "uploadApprovalInformation",
            key: "uploadApprovalInformation",
            render: (text,record) => {
                return (
                    <div>
                        <a
                            onClick = {() => this.showInfoDetail(record)}
                        >
                            详细
                        </a>
                    </div>
                );
            }
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,record) => {
                const { userList } = this.props;
                if(userList.length > 0) {
                    const getFlag = (flag) => {
                        const bool = userList.some((item) => item.manage_role == flag);
                        return bool;
                    };
                    return (
                        getFlag("officeAdmin")   ? 
                        <div className = {styles.editStyle}>
                            <a onClick = {() => this.download(record)}>下载</a>&nbsp;&nbsp;
                            <a onClick = {() => this.modify(record)}>修改</a>&nbsp;&nbsp;
                            <a onClick = {() => this.deleteData(record)}>删除</a>&nbsp;&nbsp;
                        </div>
                        :
                        getFlag("deptAdmin") && record.uploader_id == arg_staff_id ? 
                        <div className = {styles.editStyle}>
                            <a onClick = {() => this.download(record)}>下载</a>&nbsp;&nbsp;
                            <a onClick = {() => this.modify(record)}>修改</a>&nbsp;&nbsp;
                            <a onClick = {() => this.deleteData(record)}>删除</a>&nbsp;&nbsp;
                        </div>
                        :
                        <div className = {styles.editStyle}>
                            <a onClick = {() => this.download(record)}>下载</a>&nbsp;&nbsp;
                        </div>
                    );
                } else {
                    return (
                        <div className = {styles.editStyle}>
                        <a onClick = {() => this.download(record)}>下载</a>&nbsp;&nbsp;
                    </div> 
                    )
                }
                
            }
        }
    ];
    rowSelection = () => ({
        onChange: (selectedRowKeys, selectedRows) => {
            if(selectedRows.length > 0) {
                this.setState({
                    batchDownloadStyle: false
                })
            } else {
                this.setState({
                    batchDownloadStyle: true
                })
            }
            let selectedFileId = [];
            selectedRows.map((v) => {
                selectedFileId.push(v.file_id)
            })
            this.setState({
                selectedFileId
            });
        }
    })
    //批量下载
    batchDownload = () => {
        const {dispatch} = this.props;
        const { selectedFileId,finalEndTime,finalFileName,finalStartTime,finalUploaderName,path,dataPage} =this.state;
        const data = {
            arg_path_id: path,
            arg_file_id: selectedFileId.join(),
            arg_file_name: finalFileName,
            arg_upload_start_time: finalStartTime,
            arg_upload_end_time: finalEndTime,
            arg_uploader_name: finalUploaderName,
            arg_page_current: dataPage,
            arg_status: "0"
        }
        dispatch({
            type:"commonData/downFile",
            data
        })
    }
    //是否显示上传
    getRealUpload = () => {
        const { userList } = this.props;
        if(userList.length > 0) {
            const getFlag = (flag) => {
                const bool = userList.some((item) => item.manage_role == flag);
                return bool;
            };
            if( (getFlag("officeAdmin") || getFlag("deptAdmin")) && this.state.childrenLength == 0) {
                return (
                    <div className = {styles.displayArea}>
                        <div className = {styles.uploadBtn} >
                            <Button
                                type = "primary"
                                onClick = {this.goToUpload}
                                style = {{display: this.state.uploadStyle}}
                            >
                                上传文件
                            </Button>
                        </div>
                        <div>
                            <Table
                                key = {this.state.tableuuid}
                                rowSelection = {this.rowSelection()}
                                columns = {this.columns}
                                className = {styles.orderTable}
                                dataSource = {this.props.fileList}
                                loading = {this.props.loading}
                                pagination = {{
                                    current:this.state.dataPage,
                                    total:this.props.commonDataTotal,
                                    pageSize:this.state.pageSize,
                                    onChange: this.changePage
                                }}
                            />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className = {styles.displayArea}>
                        <div>
                            <Table
                                key = {this.state.tableuuid}
                                rowSelection = {this.rowSelection()}
                                columns = {this.columns}
                                className = {styles.orderTable}
                                dataSource = {this.props.fileList}
                                loading = {this.props.loading}
                                pagination = {{
                                    current:this.state.dataPage,
                                    total:this.props.commonDataTotal,
                                    pageSize:this.state.pageSize,
                                    onChange: this.changePage
                                }}
                            />
                        </div>
                    </div>
                );
            }
        } else {
            return (
                <div className = {styles.displayArea}>
                    <div>
                        <Table
                            key = {this.state.tableuuid}
                            rowSelection = {this.rowSelection()}
                            columns = {this.columns}
                            className = {styles.orderTable}
                            dataSource = {this.props.fileList}
                            loading = {this.props.loading}
                            pagination = {{
                                current:this.state.dataPage,
                                total:this.props.commonDataTotal,
                                pageSize:this.state.pageSize,
                                onChange: this.changePage
                            }}
                        />
                    </div>
                </div>
            );
        }
    };
    //修改文件信息模态框
    modifyInformation = () => {
        const { staffList } = this.props;
        let selectDepartmentDemo = staffList.map((item) => {
			return (
				<Select.Option
					key = {item.deptid}
					value = { item.userid + '#' + item.deptid }
				>
					{item.username}
				</Select.Option>
			);
		});
        return (
            this.props.radivoValue == "dept" 
                        ?
                        // 按照部门查询
                        <div>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    可见部门:
                                </Col>
                                <Col span = {20} key = "RevisionDepartment">
                                    <TreeSelect
                                        dropdownMatchSelectWidth = {false}
                                        className = {styles.inputSearch}
                                        size = "large"  
                                        value = {this.props.visibleRange}
                                        treeData = {this.props.directoryList}
                                        onChange = {this.deptChange}
                                        treeCheckable
                                        placeholder="请选择部门"
                                    />
                                </Col>
                            </Row>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    文件分类：
                                </Col>
                                <Col span = {20} key = "Revisionclassification">
                                    <TreeSelect 
                                        className = {styles.inputSearch} 
                                        size = "large"  
                                        value = {this.state.contentValue}
                                        treeData = {this.props.folderList}
                                        onChange = {this.treeChange}
                                        placeholder="请选择文件分类"
                                    />
                                </Col>
                            </Row>
                        </div>
                        :
                        <div>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    可见部门:
                                </Col>
                                <Col span = {20} key = "Visiblesector">
                                    <TreeSelect
                                        dropdownMatchSelectWidth = {false}
                                        className = {styles.inputSearch} 
                                        size = "large"  
                                        treeData = {this.props.directoryList}
                                        onChange = { this.depTreeChange }
                                        value = {this.props.personRange}
                                        treeCheckable
                                        placeholder="请选择部门"
                                    />
                                </Col>
                            </Row>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    可见人员：
                                </Col>
                                <Col span = {20} key = "Visiblepersonnel">
                                    <Select
                                        className = {styles.inputSearch}
                                        size = "large"
                                        onChange = {this.staffSelect}
                                        mode='multiple'
                                        value = {this.props.userRange}
                                        placeholder="请选择可见人员"
                                    >
                                        {selectDepartmentDemo}
                                    </Select>
                                </Col>
                            </Row>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    文件分类：
                                </Col>
                                <Col span = {20} key = "file">
                                    <TreeSelect 
                                        className = {styles.inputSearch} 
                                        size = "large"  
                                        value = {this.state.contentValue}
                                        treeData = {this.props.folderList}
                                        onChange = {this.treeChange}
                                        placeholder="请选择文件分类"
                                    />
                                    </Col>
                            </Row>
                        </div>
        );
    };
    render () {
        return (
            <div className = {styles.blackWrapper}>
                <h2 style = {{textAlign:"center",marginBottom:"40px"}}>常用资料</h2>
                {/* 需要判断登陆人员 */}
                {/* {this.getRealContent()} */}
                <div className = {styles.topSearch}>
                    <div style = {{flex: 1,minWidth:"210px",marginRight:"10px"}}>
                        文件名称：<Input 
                                    className = {styles.fileInputStyle}
                                    onChange = {this.searchName}
                                    value = {this.state.fileName}
                                />
                    </div>
                    <div style = {{display:"flex",flex: 5,justifyContent: "space-between"}}>
                        <div style = {{minWidth:"210px",marginRight:"10px"}}>
                            上传人：<Input 
                                        className = {styles.fileInputStyle}
                                        onChange = {this.searchUpload}
                                        value = {this.state.uploader}
                                    />
                        </div>
                        <div style = {{marginRight:"20%"}}>
                            上传时间：<RangePicker onChange = {this.getDate} key = {this.state.uuid} />
                        </div>
                        <div>
                            <Button type = "primary" className = {styles.btn} onClick = {this.queryData}>查询</Button>
                            <Button type = "primary" className = {styles.btn} onClick = {this.clearData}>清空</Button>
                            <Button type = "primary" className = {styles.btn} onClick = {this.batchDownload} disabled = {this.state.batchDownloadStyle}>批量下载</Button>
                        </div>
                    </div>
                </div>
                <div style = {{display: "flex"}}>
                    <div className = {styles.LeftTree}>
                        <Tree
                            showIcon
                            defaultSelectedKeys={['0-0-0-0']}
                            switcherIcon={<Icon type="down" />}
                            onSelect = {this.onSelect}
                            style = {{display:"block"}}
                            key = {this.state.treeUuid}
                        >
                            {this.loop(this.props.folderList)}
                        </Tree>
                    </div>
                    {this.getRealUpload()}
                </div>
                {/* 详细信息 */}
                <Modal
                    title = {null}
                    footer = {null}
                    visible = { this.state.infoVisible }
                    onCancel = { this.detailCancel }
                >
                   {this.getDetail(this.state.infoData)}
                </Modal>
                {/* 修改 */}
                {   this.props.modalLoading == false 
                    ?
                    <Modal
                        title = "修改文件信息"
                        visible = { this.state.modifyVisible }
                        onCancel = { this.modifyCancel }
                        onOk = { this.modifyFile }
                        key = {this.state.deptUuid}
                    >   
                        <RadioGroup 
                            value = {this.props.radivoValue}
                            onChange = {this.radioChange}
                        >
                            <Radio value = {"dept"}>按照部门查询</Radio>
                            <Radio value = {"staff"}>按照人员查询</Radio>
                        </RadioGroup>
                    {
                        this.modifyInformation()
                    } 
                    </Modal>
                    :
                    ""
                }
            </div>
        )
    };
 }
 function mapStateToProps (state) {
    return {
        loading:state.loading.models.commonData,
        ...state.commonData
    };
}
export default connect(mapStateToProps)(CommonData);
