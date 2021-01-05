/**
 * 作者：邓广晖
 * 创建日期：2019-07-15
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：工时配置
 */
import React from 'react';
import {connect} from 'dva';
import { Table, Spin, Modal, Form, Popconfirm, Button, Input, Icon } from 'antd';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class WorkTimeAddEditT extends React.PureComponent {
    render() {
        const { getFieldDecorator } = this.props.form;
        let { modalData, headIndexList } = this.props;
        const formItemLayout = {
            labelCol: { span: 8},
            wrapperCol: { span: 12},
            style: {marginBottom: 8}
        };
        let formItemList = [];
        headIndexList.forEach((item,index)=>{
            formItemList.push(
                <FormItem label={item.value} {...formItemLayout} key={index}>
                    {getFieldDecorator(item.key, {
                        rules: [{
                            required: true,
                            message: '必填',
                            whitespace: true
                        }],
                        initialValue: modalData[item.key]
                    })(
                        item.key === 'remarks' ? <TextArea rows={3}/> : <Input/>
                    )}
                </FormItem>
            );
        });
        return (
            <Form>{formItemList}</Form>
        );
    }
}

const WorkTimeAddEdit = Form.create()(WorkTimeAddEditT);

class WorkTimeConfig extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    /**
     * 作者：邓广晖
     * 创建日期：2018-05-15
     * 功能：设置模态框可见
     * @param modalType 模态框的类型
     * @param record 表格一条记录,新增时没有
     */
    setModalVisible = (modalType, record) => {
        this.props.dispatch({
            type: 'workTimeConfig/setModalVisible',
            record: record,
            modalType: modalType
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-05-08
     * 功能：处理新增模态框
     * @param flag 模态框是点击确定还是取消的标志
     */
    handleModal = (flag) => {
        if (flag === 'confirm') {
            this.refs.workTimeAddEdit.validateFields((err, values) => {
                if (!err) {
                    this.props.dispatch({
                        type: 'workTimeConfig/handleModal',
                        flag: flag,
                        values: values,
                    });
                }
            })
        } else {
            this.props.dispatch({
                type: 'workTimeConfig/handleModal',
                flag: flag,
            });
        }
    };

    deleteWorkTime = (record) => {
        this.props.dispatch({
            type:'workTimeConfig/deleteWorkTime',
            record
        });
    };

    freshButton = () => {
        this.props.dispatch({
            type:'workTimeConfig/queryConfigList',
        });
    };

    render() {
        const { configList, headIndexList, modalType } = this.props;
        let columns = headIndexList.map((item,index)=>{
            return({
                title: item.value,
                dataIndex: item.key,
                width: item.key === 'remarks' ? '20%': '10%',
                render: (text, record, index) => {
                    if (item.key === 'state_code') {
                        return text;
                    } else {
                        return (
                            <div style={{textAlign:'left'}}>{text}</div>
                        )
                    }
                }
            })
        });
        columns.unshift({
            title: '序号',
            dataIndex: '',
            width: '5%',
            render: (text, record, index) => {
                return <div>{index+1}</div>
            }
        });
        columns.push({
            title: '操作',
            dataIndex: '',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        <Button
                            type='primary'
                            size='small'
                            onClick={() => this.setModalVisible('edit', record)}
                        >{'修改'}
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title="确定删除吗？"
                            onConfirm={()=>this.deleteWorkTime(record)}
                        >
                            <Button
                                type='primary'
                                size='small'
                            >{'删除'}
                            </Button>
                        </Popconfirm>,
                    </div>
                );
            }
        });
        return (
            <Spin tip={'加载中…'} spinning={this.props.loading}>
                <div style={{padding: '13px 15px 16px 15px', background: 'white'}}>
                    <div>
                        <Button  type='primary' onClick={() => this.setModalVisible('add')}>
                            新增
                        </Button>
                        &nbsp;&nbsp;
                        <span>
                            <span>总共有 </span>
                            <span style={{color: 'red', fontWeigh: 'bold'}}>{configList.length}</span>
                            <span> 条</span>
                        </span>
                        <span style={{float:'right'}}>
                            <Button onClick={this.freshButton} type='primary'>
                                <Icon type="reload" />{'刷新'}
                            </Button>
                        </span>
                    </div>
                    <div style={{marginTop: 4}}>
                        <Table
                            dataSource={configList}
                            columns={columns}
                            className={styles.tableStyle}
                            pagination={false}
                            bordered={true}
                        />
                    </div>
                    <Modal
                        onOk={() => this.handleModal('confirm')}
                        onCancel={() => this.handleModal('cancel')}
                        width={'600px'}
                        visible={this.props.modalVisible}
                        title={
                            modalType === 'edit'
                                ? '编辑'
                                : (modalType === 'add' ? '新增' : '')
                        }
                    >
                        <WorkTimeAddEdit
                            ref={'workTimeAddEdit'}
                            key={this.props.modalUuid}
                            dispatch={this.props.dispatch}
                            modalData={this.props.modalData}
                            headIndexList={headIndexList}
                        />
                    </Modal>
                </div>
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.workTimeConfig,
        ...state.workTimeConfig
    }
}

export default connect(mapStateToProps)(WorkTimeConfig);

