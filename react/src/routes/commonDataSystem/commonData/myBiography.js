/**
  * 作者： 彭东洋
  * 创建日期： 2019-10-12
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 常用资料-我的已传
  */
import React from 'react';
import { connect } from 'dva';
import {Table, Modal, Input, Button, DatePicker, Row, Col, Select, TreeSelect, Radio, message} from 'antd';
import styles from '../mangerConfig/managerConfig.less'; 
import { routerRedux } from 'dva/router';
import { getUuid } from './../../../components/commonApp/commonAppConst'
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
class MyBiography extends  React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modifyVisible: false,
            contentValue: "",
            fileName: "",
            beginTime: "",
            endTime: "",
            levelFlag: true,
            batchDownloadStyle: true, //批量下载显隐状态
            tableuuid: ""
        };
    };
    //跳转到常用资料页面
    goToCommon = () => {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: "/adminApp/commonDataSystem/commonData"
        }));
    };
    //点击查询
    getRealList = () => {
        const {beginTime, endTime, fileName} = this.state
        const { dispatch } = this.props;
        const data = {
            arg_file_name: fileName,
            arg_upload_start_time: beginTime,
            arg_upload_end_time: endTime,
            arg_status: "1"
        };
        dispatch ({
            type: "commonData/queryFileByTerm",
            data
        });
        this.setState({
            finalBeginTime: beginTime,
            finalEndTime: endTime,
            finalName: fileName,
            dataPage: 1 ,
            tableuuid: getUuid(20,62),
            selectedFileId: [],
            batchDownloadStyle: true,
        });
    };
    //返回正确的时间
    getRealTime = (date) => {
        if(date){
            const realData = date.split(".")[0];
            return realData;
        }
    };
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
    //关闭修改模态框
    modifyCancel = () => {
        this.setState ({
            modifyVisible: false
        });
    };
    //点击修改按钮
    modify = (record) => {
        const data = {
            arg_file_id: record.file_id
        }; 
        const { dispatch } = this.props;
        dispatch({
            type:"commonData/queryFileVisibleAndPath",
            data
        });
        this.setState({
            modifyVisible: true,
            contentValue: record.path_id,
            fileId: record.file_id //需要修改
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
    //修改文件分类
    treeChange = (value,label,extra) => {
        const { dispatch } = this.props;
        let flag;
        if(extra.selected && extra.triggerNode.props.children){
            flag = false
        } else {
            flag = true
        }
        const data = {
            contentValue: value,
            pathId: extra.triggerValue,
            levelFlag: flag
        };
        dispatch({
            type: "commonData/documentClassification",
            data
        });
        this.setState({
            contentValue: value,
            pathId: extra.triggerValue,
            levelFlag: flag
        });
    };
    //查询文件名字
    searchName = (e) => {
        this.setState({
            fileName: e.target.value
        });
    };
    //得到上传时间
    getDate = (date,dateString) => {
        const beginTime = dateString[0];
        const endTime = dateString[1];
        this.setState({
            beginTime,
            endTime,
        });
    };
    //删除文件
    deleteData = (record) => {
        const { dispatch, RowCount } = this.props;
        const {finalBeginTime, finalEndTime, finalName, dataPage} = this.state
        Modal.confirm({
            title: "是否确认删除",
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                let arg_page_current = dataPage;
                if(RowCount == 1 && dataPage > 1) {
                    this.setState({
                        dataPage: dataPage-1
                    });
                    arg_page_current =  dataPage-1;
                }
                const data = { 
                    arg_file_id: record.file_id,
                    arg_status: "1",
                    arg_page_current,
                    arg_file_name:finalName,
                    arg_upload_start_time: finalBeginTime,
                    arg_upload_end_time: finalEndTime
                };
                dispatch({
                    type: "commonData/delFile",
                    data
                })
            }
        });
    };
    //修改页码
    changePage = (page) => {
        const { dispatch } = this.props;
        const {finalBeginTime, finalEndTime, finalName} = this.state
        const data = {
            arg_file_name: finalName,
            arg_upload_start_time: finalBeginTime,
            arg_upload_end_time: finalEndTime,
            arg_page_current: page,
            arg_status: "1"
        }
        dispatch({
            type: "commonData/queryFileByTerm",
            data
        });
        this.setState({
            dataPage: page,
            tableuuid: getUuid(20,62),
            batchDownloadStyle: true,
            selectedFileId: []
        });
    };
    //下载
    download = (record) => {
        const {finalBeginTime, finalEndTime, finalName,dataPage} = this.state
        const { dispatch } = this.props;
        const data = {
            arg_file_name: finalName,
            arg_upload_start_time: finalBeginTime,
            arg_upload_end_time: finalEndTime,
            arg_page_current: dataPage,
            arg_status: "1",
            arg_file_id: record.file_id,
        };
        dispatch ({
            type: "commonData/downFile",
            data
        });
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
                                <Col span = {4} key = "myBiography">
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    可见部门:
                                </Col>
                                <Col span = {20} key = "myBiographyDepartment">
                                    <TreeSelect
                                        className = {styles.inputSearch}
                                        dropdownMatchSelectWidth = {false}
                                        size = "large"  
                                        value = {this.props.visibleRange}
                                        treeData = {this.props.directoryList}    
                                        onChange = {this.depTreeChange2}
                                        treeCheckable
                                        placeholder="请选择可见部门"
                                    />
                                </Col>
                            </Row>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    文件分类：
                                </Col>
                                <Col span = {20} key = "mybiographyclassification">
                                    <TreeSelect 
                                        className = {styles.inputSearch} 
                                        dropdownMatchSelectWidth = {false}
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
                                <Col span = {20} key = "mybiographysector">
                                    <TreeSelect
                                        className = {styles.inputSearch} 
                                        dropdownMatchSelectWidth = {false}
                                        size = "large"  
                                        treeData = {this.props.directoryList}
                                        onChange = { this.depTreeChange }
                                        value = {this.props.personRange}
                                        treeCheckable
                                        placeholder="请选择可见部门"
                                    />
                                </Col>
                            </Row>
                            <Row style = {{marginTop:"20px"}}>
                                <Col span = {4}>
                                    <b style={{color:"red",marginRight:'3px'}}>*</b>
                                    可见人员：
                                </Col>
                                <Col span = {20} key = "myBiographypersonnel">
                                    <Select
                                        className = {styles.inputSearch}
                                        size = "large"
                                        onChange = {this.staffSelect}
                                        mode='multiple'
                                        value = {this.props.userRange}
                                        placeholder = "请选择可见人员"
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
                                <Col span = {20} key = "mybiographyfile">
                                    <TreeSelect 
                                        className = {styles.inputSearch} 
                                        dropdownMatchSelectWidth = {false}
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
    //按部门修改tree
    depTreeChange2 =(value) => {
        const { dispatch } = this.props;
        const data = {
            visibleRange: value
        };
        this.setState({
            visibleSector:value.join(),
        });
        dispatch({
            type: "commonData/setVisibleRange",
            data
        });
    };
    //当选择可见部门时
    depTreeChange = (value) => {
        const { dispatch } = this.props;
        if(value.length > 0) {
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
                DeptStaffId: value.join(),
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
                DeptStaffId: ""
            });  
        }
    };
    //点击确定保存修改文件
    modifyFile = () => {
        const { dispatch, radivoValue, visibleRange, userRange} = this.props;
        const {fileId,levelFlag, fileName, beginTime, endTime, uploader,contentValue,dataPage} = this.state;
        let visible = visibleRange.join();
        let visiblePersonnel = userRange.join();
        let arg_visible;
        if(radivoValue == "dept") {
            if(visibleRange.length == 0 ) {
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
            arg_visible = visible;
        } else {
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
            arg_visible = visiblePersonnel;
        }
        const data = {
            arg_visible,
            arg_file_id: fileId,
            arg_path_id: contentValue,
            arg_status: "1",
            arg_file_name: fileName,
            arg_upload_start_time: beginTime,
            arg_upload_end_time: endTime,
            arg_uploader_name: uploader,
            arg_page_current: dataPage
        };
        dispatch({
            type: "commonData/updateFileServlet",
            data
        });
    };
    //table选中项
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
        const { selectedFileId,finalEndTime,finalName,finalBeginTime,dataPage} =this.state;
        const data = {
            arg_file_id: selectedFileId.join(),
            arg_file_name: finalName,
            arg_upload_start_time: finalBeginTime,
            arg_upload_end_time: finalEndTime,
            arg_page_current: dataPage,
            arg_status: "1"
        }
        dispatch({
            type:"commonData/downFile",
            data
        })
    }
    render() {
        const columns = [
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
                title: "文件名称",
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
                title: "下载量",
                dataIndex: "file_hits",
                key: "file_hits",
                render: (text) => {
                    return (
                        <div>{text}</div>
                    );
                }
            },
            {
                title: "路径",
                dataIndex: "path_url",
                key: "path_url",
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
                        <div className = {styles.editStyle}>
                            <a onClick = {() => this.download(record)}>下载</a>&nbsp;&nbsp;
                            <a onClick = {() =>this.modify(record)}>修改</a>&nbsp;&nbsp;
                            <a onClick = { () => this.deleteData(record) }>删除</a>&nbsp;&nbsp;
                        </div>
                    );
                }
            }
        ];
        return (
            <div className = {styles.blackWrapper}>
                <h2 style = {{textAlign: 'center',marginBottom:"40px"}}>我的已传</h2>
                <div>
                        <div style = {{overflow:"hidden",margin:"20px"}}>
                            <div style = {{float:"left"}}>
                                文件名称：<Input className = {styles.searchInput} onChange = { this.searchName } value = {this.state.fileName}/>
                                上传时间：<RangePicker onChange = { this.getDate }/>
                            </div>
                            <div style = {{float:"right"}}>
                                <Button type = "primary" className = {styles.btn} onClick = {this.getRealList}>查询</Button>
                                <Button type = "primary" className = {styles.btn} onClick = {this.batchDownload} disabled = {this.state.batchDownloadStyle}>批量下载</Button>
                                <Button type = "primary" className = {styles.btn} onClick = {this.goToCommon}>返回</Button>
                            </div>
                        </div>
                        <div>
                            <Table 
                                key = {this.state.tableuuid}
                                rowSelection = {this.rowSelection()}
                                columns = {columns}
                                className = {styles.orderTable}
                                dataSource = {this.props.biographyList}
                                loading = {this.props.loading}
                                pagination = {{
                                    current:this.state.dataPage,
                                    total:this.props.biographyTotal,
                                    pageSize: 10,
                                    onChange: this.changePage
                                }}
                            />
                        </div>
                    </div>
                {/* 修改 */}
                {
                    this.props.modalLoading == false
                    ?
                    <Modal
                        title = "修改文件信息"
                        visible = { this.state.modifyVisible }
                        onCancel = { this.modifyCancel }
                        onOk = { this.modifyFile }
                        key = "myBiography"
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
                    : ""
                }
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
export default connect(mapStateToProps)(MyBiography);