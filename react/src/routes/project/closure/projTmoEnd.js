/**
 * 作者：邓广晖
 * 创建日期：2019-01-08
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：组件管理列表
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Button, Table, Pagination, Popconfirm } from 'antd';
import styles from './styles.less';

class ProjTmoEnd extends PureComponent {

    /**
     * 作者：邓广晖
     * 创建日期：2019-01-25
     * 功能：设置是输入框的值
     * @param e 输入事件
     * @param objParam 输入的对象参数
     */
    setInputShow = (e,objParam) => {
        this.props.dispatch({
            type: 'projTmoEnd/setInputOrSelectShow',
            value: e.target.value,
            objParam: objParam,
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2019-01-25
     * 功能：处理页码
     * @param page 点击的页码值
     */
    handlePageChange = (page) => {
        this.props.dispatch({
            type: 'projTmoEnd/handlePageChange',
            page: page,
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2019-01-25
     * 功能：点击查询或者清空按钮
     * @param buttonType 按钮类型，query 和 clear
     */
    clickQueryButton = (buttonType) => {
        this.props.dispatch({
            type: 'projTmoEnd/clickQueryButton',
            buttonType: buttonType
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2019-01-25
     * 功能：项目结项
     * @param record 一行记录
     */
    endProj = (record) => {
        this.props.dispatch({
            type: 'projTmoEnd/endProj',
            record: record
        });
    };


    tableOneColumns = [
        {
            title: '序号',
            dataIndex: '',
            width: '2%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>;
            },
        }, {
            title: '团队名称',
            dataIndex: 'proj_name',
            width: '12%',
            render: (text, record, index) => {
                return <div style={{textAlign: 'left'}}>{text}</div>;
            },
        }, {
            title: '生产编码',
            dataIndex: 'proj_code',
            width: '7%',
            render: (text, record, index) => {
                return <div style={{textAlign: 'left'}}>{text}</div>;
            },
        }, {
            title: '主建单位',
            dataIndex: 'ou',
            width: '7%',
            render: (text, record, index) => {
                return <div style={{textAlign: 'left'}}>{text}</div>;
            },
        }, {
            title: '主建部门',
            dataIndex: 'dept_name',
            width: '10%',
            render: (text, record, index) => {
                return <div style={{textAlign: 'left'}}>{text}</div>;
            },
        }, {
            title: '项目经理',
            dataIndex: 'mgr_name',
            width: '4%',
            render: (text, record, index) => {
                return <div style={{textAlign: 'left'}}>{text}</div>;
            },
        }, {
            title: '操作',
            dataIndex: '',
            width: '3%',
            render: (text, record, index) => {
                return (
                    <div >
                        <Popconfirm title="项目结项成功后，项目只能在历史项目中查询，确定结项吗？" onConfirm={() => this.endProj(record)}>
                            <Button
                                type='primary'
                                size='small'
                                style={{marginTop: 3}}
                            >{'结项'}
                            </Button>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    render() {
        return (
            <div style={{paddingTop:13,paddingBottom:16,background:'white'}}>
                <div style={{paddingLeft:15,paddingRight:15}}>
                    <div><p style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>项目结项（TMO）</p></div>
                    <div>
                        <span>团队名称：</span>
                        <Input
                            style={{width: 150}}
                            maxLength={'32'}
                            placeholder={'最多可输入32字'}
                            value={this.props.porjEndTableParam.arg_proj_name}
                            onChange={e => this.setInputShow(e, 'arg_proj_name')}
                        >
                        </Input>
                        <span style={{marginLeft: '20px'}}>生产编码：</span>
                        <Input
                            style={{width: 150}}
                            maxLength={'32'}
                            placeholder={'最多可输入32字'}
                            value={this.props.porjEndTableParam.arg_proj_code}
                            onChange={e => this.setInputShow(e, 'arg_proj_code')}
                        >
                        </Input>
                        <span style={{marginLeft: '20px'}}>项目经理：</span>
                        <Input
                            style={{width: 150}}
                            maxLength={'32'}
                            placeholder={'最多可输入32字'}
                            value={this.props.porjEndTableParam.arg_mgr_name}
                            onChange={e => this.setInputShow(e, 'arg_mgr_name')}
                        >
                        </Input>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                            type='primary'
                            onClick={() => this.clickQueryButton('query')}
                        >{'查询'}
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            type='primary'
                            onClick={() => this.clickQueryButton('clear')}
                        >{'清空'}
                        </Button>
                    </div>
                    <div style={{marginTop: 4}}>
                        <Table
                            dataSource={this.props.projEndDataList}
                            columns={this.tableOneColumns}
                            pagination={false}
                            loading={this.props.loading}
                            className={styles.tableStyle}
                            bordered={true}
                        />
                        {/*加载完才显示页码*/}
                        <div className={styles.page}>
                            <Pagination
                                current={this.props.porjEndTableParam.arg_page_current}
                                total={Number(this.props.porjEndTableParam.rowCount)}
                                pageSize={10}
                                onChange={(page) => this.handlePageChange(page)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.projTmoEnd,
        ...state.projTmoEnd,
    }
}

export default connect(mapStateToProps)(ProjTmoEnd);
