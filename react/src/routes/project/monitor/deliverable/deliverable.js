/**
 * 作者：胡月
 * 创建日期：2017-11-08
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：实现交付物管理的功能
 */
import React from 'react';
import { Button, Table, Row, Col, Input, Select, Collapse, Checkbox, Upload, Modal, Spin, message } from 'antd';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './deliverable.less';
import { getUuid } from '../../../../components/commonApp/commonAppConst';
const Panel = Collapse.Panel;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
/**
 * 作者：胡月
 * 创建日期：2017-11-08
 * 功能：交付物管理页面
 */
class Deliverable extends React.PureComponent {
    state = {
        visible: false,
        subVisible: false, // 提交预览弹框
        disabled: true,
        selectedDeliCategory: '',
        selectedMileUid: '',
        selectedPmdId: '',
        currentFileByName: '',
        uploadFile: {
            name: 'filename',
            multiple: true,
            showUploadList: false,
            action: '/filemanage/fileupload',
            data: {
                argappname: 'projectFile',
                argtenantid: Cookie.get('tenantid'),
                arguserid: Cookie.get('userid'),
                argyear: new Date().getFullYear(),
                argmonth: new Date().getMonth() + 1,
                argday: new Date().getDate()
            },

            //在上传之前判断是否文件重复
            beforeUpload: (file) => {
                const { milesList } = this.props;
                let fileIsRepeated = false;
                for (let i = 0; i < milesList.length; i++) {
                    if (milesList[i].mile_uid === this.state.selectedMileUid) {
                        let deliverables = milesList[i].deliverables.replace(/\:\"\[+/g, ':[');
                        deliverables = JSON.parse(deliverables.replace(/\]\"\}/g, ']}'));
                        for (let j = 0; j < deliverables.length; j++) {
                            let fileList = deliverables[j].files;
                            for (let k = 0; k < fileList.length; k++) {
                                if (fileList[k].pmdf_file_name === file.name) {
                                    fileIsRepeated = true;
                                    break;
                                }
                            }
                            if (fileIsRepeated === true) {
                                break;
                            }
                        }
                    }
                }
                if (fileIsRepeated === true) {
                    message.error(`${file.name} 文件重复，上传失败.`);
                    return false;
                }
            },

            //上传文件
            onChange: (info) => {
                const status = info.file.status;
                let objFile = [];
                if (status === 'done') {
                    if (info.file.response.RetCode == '1') {
                        objFile.push({
                            pmdf_file_byname: info.file.response.filename.OriginalFileName.split('.')[0],
                            pmdf_file_name: info.file.response.filename.OriginalFileName,
                            pmdf_file_url: info.file.response.filename.AbsolutePath,
                            pmdf_file_path: info.file.response.filename.RelativePath
                        });

                        const { dispatch } = this.props;
                        dispatch({
                            type: 'deliverableManage/deliverableFileUpload',
                            arg_files: objFile,
                            arg_mile_uid: this.state.selectedMileUid,
                            arg_pmd_id: this.state.selectedPmdId
                        });
                        return true;
                    } else if (status === 'error') {
                        message.error(`${info.file.name} 上传失败.`);
                        return false;
                    }
                }
            }
        }
    }
    //上传文件之前，传递mile_uid,pmd_id的值
    changeValue = (mile_uid, pmd_id) => {
        this.setState({
            selectedMileUid: mile_uid,
            selectedPmdId: pmd_id,
        });
    };
    //选择项目，切换里程碑交付物展示
    projIDSelect = (key) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deliverableManage/mileSearch',
            payload: {
                arg_proj_id: key,
                switchProjFlag: '1'
            }
        });
    }
    // 改变里程碑复选框选中状态时，改变选中里程碑的信息
    selectMile = (e, mile_uid, mile_name, mileIndex) => {
        this.props.dispatch({
            type: 'deliverableManage/changeCheckBoxState',
            mileIndex: mileIndex,
            value: e.target.checked,
            mile_uid: mile_uid,
            mile_name: mile_name
        });
    }
    //提交交付物管理
    submitDeliverable = () => {
        if (this.props.selectedMiles.length === 0) {
            message.error('请选择里程碑后，再点击提交');
        } else {
            this.setState({
                subVisible: true,
            });
        }
    }

    //下载交付物
    downloadDeliverable = (record) => {
        window.open(record.pmdf_file_path);
    }
    //删除交付物
    deleteDeliverable = (mile_uid, pmdf_id) => {
        let thisMe = this;
        confirm({
            title: '确定要删除该交付物文件？',
            onOk() {
                const { dispatch } = thisMe.props;
                dispatch({
                    type: 'deliverableManage/deliverableFileDelete',
                    arg_mile_uid: mile_uid,
                    arg_pmdf_id: pmdf_id
                });
            },
            onCancel() {
            },
        });
    }
    //获取修改的文件别名
    setPreFileByName = (e) => {
        this.setState({ currentFileByName: e.target.value });
    };
    //改变交付物文件的别名，判断文件别名是否重复
    setAfterFileByName = (e, mile_uid, pmdf_id) => {
        const { dispatch, milesList } = this.props;
        if (e.target.value == '') {
            message.error('文件别名不能为空，恢复为之前名称');
            e.target.value = this.state.currentFileByName;
        } else {
            let fileNameIsRepeated = false;
            for (let i = 0; i < milesList.length; i++) {
                if (milesList[i].mile_uid === mile_uid) {
                    let deliverables = milesList[i].deliverables.replace(/\:\"\[+/g, ':[');
                    deliverables = JSON.parse(deliverables.replace(/\]\"\}/g, ']}'));
                    for (let j = 0; j < deliverables.length; j++) {
                        let fileList = deliverables[j].files;
                        for (let k = 0; k < fileList.length; k++) {
                            if (fileList[k].pmdf_id !== pmdf_id) {
                                if (fileList[k].pmdf_file_byname === e.target.value) {
                                    fileNameIsRepeated = true;
                                    break;
                                }
                            }
                        }
                        if (fileNameIsRepeated === true) {
                            break;
                        }
                    }
                }
            }
            if (fileNameIsRepeated === true) {
                message.error('文件别名重复，恢复为之前名称');
                e.target.value = this.state.currentFileByName;
            } else {
                dispatch({
                    type: 'deliverableManage/deliverableFileNameUpdate',
                    arg_mile_uid: mile_uid,
                    arg_pmdf_id: pmdf_id,
                    arg_file_byname: e.target.value
                });
            }

        }
    }

    //交付物类别的解绑以及删除交付物类别下的交付物文件
    deleteDeliveryCategory = (mile_uid, pmdDelId) => {
        let thisMe = this;
        confirm({
            title: '确定要解绑该交付物类别？',
            onOk() {
                const { dispatch } = thisMe.props;
                dispatch({
                    type: 'deliverableManage/mileUnBindDelType',
                    arg_mile_uid: mile_uid,
                    arg_del_id: pmdDelId
                });
            },
            onCancel() {
            },
        });
    }
    //增加交付物类别
    addDeliveryCategory = (mile_uid) => {
        this.setState({
            visible: true,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'deliverableManage/deliveryTypeSearch',
            payload: {
                arg_mile_uid: mile_uid
            }
        });
    }
    //被选中的交付物类别
    selectDeliveryCategory = (checkedValues) => {
        this.state.selectedDeliCategory = checkedValues.join(",");
    }
    //增加交付物类别模态框中点击确定按钮
    handleOk = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deliverableManage/mileBindDelType',
            arg_del_id: this.state.selectedDeliCategory
        });
        this.setState({
            visible: false
        });
    };
    //增加交付物类别点击取消按钮
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };
    // 预览弹框确定按钮
    subHandleOk = (e) => {
        this.setState({
            subVisible: false
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'deliverableManage/deliverableManageSubmit',
        });
    };
    // 预览弹框取消按钮
    subHandleCancel = (e) => {
        this.setState({
            subVisible: false
        });
    };
    //每条里程碑对应的交付物的列表
    columns = [
        {
            //title:'文件名称',
            dataIndex: 'pmdf_file_name'
        },
        {
            //title:'文件别名',
            dataIndex: 'pmdf_file_byname',
            render: (text, record, index) => {
                return (
                    <div>
                        {record.is_edit === '1' ?
                            <Input
                                defaultValue={text}
                                onFocus={e => this.setPreFileByName(e)}
                                onBlur={e => this.setAfterFileByName(e, record.mile_uid, record.pmdf_id)}
                            />
                            :
                            <Input
                                defaultValue={text}
                                disabled />
                        }
                    </div>
                )
            }
        },
        {
            //title:'操作',
            dataIndex: '',
            render: (text, record, index) => {
                return (
                    <span>
                        <a className={styles["book-detail"] + ' ' + styles.bookTag}
                            /*href={record.pmdf_file_url}*/
                            onClick={() => this.downloadDeliverable(record)}>
                            {'下载'}
                        </a>
                        &nbsp;&nbsp;
            {record.is_edit === '1' ?
                            <a className={styles["book-detail"] + ' ' + styles.bookTag}
                                onClick={() => this.deleteDeliverable(record.mile_uid, record.pmdf_id)}>
                                {'删除'}
                            </a>
                            :
                            null
                        }
                    </span>
                )
            }
        }
    ];

    render() {
        const customPanelStyle = {
            borderRadius: 6,
            overflow: 'scroll'
        };
        const { loading, projNameList, milesList, deliveryCategoryList } = this.props;
        if (projNameList.length) {
            projNameList.map((i, index) => {
                i.key = index
            })
        }

        if (milesList.length) {
            milesList.map((i, index) => {
                i.key = index
            })
        }
        if (deliveryCategoryList.length) {
            deliveryCategoryList.map((i, index) => {
                i.key = index
            })
        }
        //属于该项目经理的项目
        const projName = projNameList.map((item, index) => {
            return (
                <Option key={item.proj_id}>
                    {item.proj_name}
                </Option>
            )
        });

        //每个项目对应的里程碑列表
        let milesName = milesList.map((milesListItem, indexFirst) => {
            //已提交的交付物类别
            let subDelCategory = [];
            let mile_uid = milesListItem.mile_uid;
            if (milesListItem.deliverables && milesListItem.deliverables !== 'NaN') {
                let deliverables = milesListItem.deliverables.replace(/\:\"\[+/g, ':[');
                deliverables = deliverables.replace(/\]\"\}/g, ']}');
                subDelCategory = JSON.parse(deliverables).map((deliverablesItem, indexSecond) => {
                    let fileList = [];
                    if (deliverablesItem.files && deliverablesItem.files !== 'NaN') {
                        fileList = deliverablesItem.files;
                        for (let fIndex = 0; fIndex < fileList.length; fIndex++) {
                            fileList[fIndex].mile_uid = mile_uid;
                        }
                    }
                    return (
                        <div style={{ marginLeft: '2%' }} key={indexSecond}>
                            <div style={{ textAlign: 'left', marginBottom: '6px', marginTop: '8px' }}>
                                <span style={{ fontWeight: 800, marginLeft: '10px' }}>{deliverablesItem.del_name}</span>
                                {milesListItem.is_edit == '1' ?
                                    <div style={{ float: 'left' }}>
                                        <span style={{ color: '#108EE9', marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => this.deleteDeliveryCategory(mile_uid, deliverablesItem.pmd_delid)}>删除</span>
                                        <Upload {...this.state.uploadFile}>
                                            <span style={{ color: '#108EE9', marginLeft: '10px', cursor: 'pointer' }}
                                                onClick={() => this.changeValue(mile_uid, deliverablesItem.pmd_id)}>上传
                  </span>
                                        </Upload>
                                    </div>
                                    : ''
                                }
                            </div>

                            <div>
                                <Table rowKey='pmdf_id'
                                    columns={this.columns}
                                    dataSource={fileList}
                                    pagination={false}
                                    loading={loading}
                                    className={styles.orderTable} />
                            </div>
                        </div>
                    )
                });
            }

            return (
                milesListItem.is_fold == '0' ?
                    <Panel key={milesListItem.mile_uid}
                        style={customPanelStyle}
                        header={<div>
                            {milesListItem.mile_name + '（' + milesListItem.plan_begin_time + '~' + milesListItem.plan_end_time + '）'}
                            <div style={{ color: 'red', fontWeight: 'bold', float: 'right', marginRight: '20px' }}>{milesListItem.mile_tag_show}</div>
                        </div>} disabled>
                    </Panel>
                    :
                    <Panel key={milesListItem.mile_uid}
                        style={customPanelStyle}
                        header={<div>
                            {milesListItem.mile_name + '（' + milesListItem.plan_begin_time + '~' + milesListItem.plan_end_time + '）'}
                            <div style={{ color: 'red', fontWeight: 'bold', float: 'right', marginRight: '20px' }}>{milesListItem.mile_tag_show}</div>
                        </div>}>
                        {milesListItem.is_edit == '0' ?
                            <span ></span>
                            :
                            <div style={{ marginTop: '-10px' }}>
                                {/*<div style={{background:'#fa7252',float:'left',width:'18px',paddingLeft:'2px',paddingBottom:'2px'}}>
                 <Checkbox
                 onChange={(e)=>this.selectMile(e,milesListItem.mile_uid,milesListItem.mile_name)} >
                 </Checkbox>
                 </div>*/}
                                <Checkbox
                                    onChange={(e) => this.selectMile(e, milesListItem.mile_uid, milesListItem.mile_name, indexFirst)}
                                    disabled={!milesListItem.checkBoxCanCheck}
                                    checked={milesListItem.checkBoxState}
                                >
                                </Checkbox>
                                <span style={{ color: '#108EE9', fontSize: '16px', cursor: 'pointer', float: 'right' }}
                                    onClick={() => this.addDeliveryCategory(mile_uid)}>增加交付物类别</span>
                            </div>

                        }
                        {subDelCategory}
                    </Panel>
            )
        });
        //每个里程碑对应的交付物类别（可选择与不可选择）
        const deliveryCategory = deliveryCategoryList.map((delCategoryItem, index) => {
            return (
                <Col span={6} offset={2} key={index}>
                    {delCategoryItem.isSelect == '1' ?
                        <Checkbox value={delCategoryItem.del_id} style={{ paddingBottom: '2px' }}>
                            {delCategoryItem.del_name}
                        </Checkbox >
                        :
                        <Checkbox value={delCategoryItem.del_id} style={{ paddingBottom: '2px' }} disabled={this.state.disabled}>
                            {delCategoryItem.del_name}
                        </Checkbox >
                    }
                </Col>
            )
        });
        // 提交预览弹框
        const previewColumn = [{
            title: '类别',
            dataIndex: 'del_name',
        }, {
            title: '文件',
            dataIndex: 'file_name',
        }];
        let milePreview = milesList.map((item, index) => {
            if (item.deliverables && item.deliverables !== 'NaN') {
                let deliverables = item.deliverables.replace(/\:\"\[+/g, ':[');
                deliverables = JSON.parse(deliverables.replace(/\]\"\}/g, ']}'));
                if (item['checkBoxState'] == true) {
                    let data = [];
                    for (let j in deliverables) {
                        for (let k in deliverables[j].files) {
                            let str = {};
                            str.del_name = deliverables[j].del_name;
                            str.file_name = deliverables[j].files[k].pmdf_file_name;
                            data.push(str);
                        }
                    }
                    return (
                        <Row key={index}>
                            <Col span={2}></Col>
                            <Col span={20}>
                                <p style={{ fontSize: 16 }}>{item.mile_name}</p>
                                <Table
                                    columns={previewColumn}
                                    dataSource={data}
                                    rowKey="file_name"
                                    pagination={false}
                                    bordered={true}
                                    className={styles.orderTable}
                                />
                            </Col>
                        </Row>
                    )
                }
            }
        });
        return (
            <Spin tip={'加载中...'} spinning={this.props.loading}>
                <div>
                    {this.props.projNameList.length ?
                        <div>
                            <Select dropdownMatchSelectWidth={false}
                                onSelect={(key) => this.projIDSelect(key)}
                                style={{ width: 400 }}
                                value={this.props.currentProjName}>
                                {projName}
                            </Select>
                            <div style={{ float: 'right' }}>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => this.submitDeliverable()}>提交</Button>
                            </div>
                        </div>
                        :
                        <div style={{ textAlign: 'center' }}>
                            {'无数据'}
                        </div>
                    }

                    {this.props.defaultMilesKey.length ?
                        <Collapse style={{ marginTop: '10px' }}>
                            {milesName}
                        </Collapse>
                        :
                        null
                    }
                    <Modal
                        title="里程碑交付物类别"
                        // key={getUuid(20, 62)}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={700}
                    >
                        <Spin tip={'加载中...'} spinning={this.props.loading} key={getUuid(20, 62)}>
                            <Checkbox.Group onChange={this.selectDeliveryCategory}>
                                <Row >
                                    {deliveryCategory}
                                </Row>
                            </Checkbox.Group>
                        </Spin>
                    </Modal>
                    <Modal
                        title="提交预览"
                        width={700}
                        visible={this.state.subVisible}
                        onOk={this.subHandleOk}
                        onCancel={this.subHandleCancel}
                    >
                        {milePreview}
                    </Modal>
                </div>
            </Spin>

        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.deliverableManage,
        ...state.deliverableManage
    }
}

export default connect(mapStateToProps)(Deliverable);
