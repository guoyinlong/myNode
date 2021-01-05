/**
 * 作者：夏天
 * 创建日期：2018-09-4
 * 邮件：1348744578@qq.com
 * 文件说明：项目信息导出
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Spin, Button, Modal } from 'antd';
import styles from './projStartUp.less';
import ProjInfoExportHead from './projExport/projInfoExportHead';
import ProjExportPopup from './projExport/projExportPopup';
import exportExl from './projExport/exportExl';


class ProjInfoExport extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            exportVisible: false,
        };
    }
    /**
     * 功能：页面导出按钮
     */
    exportButton = () => {
        this.props.dispatch({
            type: 'projInfoExport/exportButton',
        });
        this.setState({
            exportVisible: true,
        });
    };
    // 弹框“导出”按钮
    exportOk = () => {
        const tableId = document.querySelector('#exportTable table');
        const tableName = '项目信息列表';
        exportExl()(tableId, tableName);
        this.setState({
            exportVisible: false,
        });
    };
    // 弹框“取消”按钮
    exportCancel = () => {
        this.setState({
            exportVisible: false,
        });
    };
    /**
     * 页面清空按钮
     */
    clickQueryButton = () => {
        this.props.dispatch({
            type: 'projInfoExport/queryHeadClick',
        });
    };
    columns = [
        {
            title: '序号',
            dataIndex: 'num',
            width: '4%',
            render: (text) => {
                return <div style={{ textAlign: 'center' }}>{text}</div>;
            },
        }, {
            title: '团队名称',
            dataIndex: 'proj_name',
            width: '4%',
        }, {
            title: '生产编码',
            dataIndex: 'proj_code',
            width: '4%',
        }, {
            title: '归属部门',
            dataIndex: 'pu_dept_name',
            width: '4%',
        }, {
            title: '主建单位',
            dataIndex: 'ou',
            width: '4%',
        }, {
            title: '主建部门',
            dataIndex: 'dept_name',
            width: '4%',
        }, {
            title: '项目经理',
            dataIndex: 'mgr_name',
            width: '4%',
        }, {
            title: '项目类型',
            dataIndex: 'proj_type',
            width: '4%',
        }, {
            title: '是否主项目',
            dataIndex: 'is_primary_show',
            width: '4%',
        }, {
            title: '项目分类',
            dataIndex: 'proj_label_show',
            width: '4%',

        }, {
            title: '状态',
            dataIndex: 'proj_tag_show',
            width: '4%',
        },
    ];

    render() {
        const {
            dispatch,
            tableParam,
            rowCount,
            projInfoList,
            allDepartment,
            allSearchProjType,
            allComonProjType,
            allOu,
            allProjTag,
            startAndEndYear,

            projExportFiled,
            saveExportField,
            judgeAllFiledCheck,
        } = this.props;
        // 待导出列表的columns
        const columnsExport = [];
        for (const i in saveExportField) {
            if (saveExportField[i].field_id === 'pms_code' || saveExportField[i].field_id === 'pms_name') {
                columnsExport.push({
                    title: saveExportField[i].field_name,
                    dataIndex: '',
                    render: (text, record) => {
                        if (record.pms_list) {
                            const fieldId = saveExportField[i].field_id;
                            const pmsList = JSON.parse(record.pms_list);
                            const pms = (pmsList || ' ').map((item, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{item[fieldId]} </td>
                                    </tr>
                                );
                            });
                            return (
                                <table>
                                    <tbody>{pms}</tbody>
                                </table>
                            );
                        }
                    },
                });
            } else {
                columnsExport.push({
                    title: saveExportField[i].field_name,
                    dataIndex: saveExportField[i].field_id,
                });
            }
        }
        return (
            <Spin spinning={this.props.loading}>
                <div style={{ paddingTop: 13, paddingBottom: 16, background: 'white', paddingLeft: 15, paddingRight: 15 }}>
                    <div><p style={{ textAlign: 'center', fontSize: '20px', marginBottom: '10px' }}>{'项目信息导出'}</p></div>
                    <ProjInfoExportHead
                        dispatch={dispatch}
                        tableParam={tableParam}
                        allDepartment={allDepartment}
                        allSearchProjType={allSearchProjType}
                        allComonProjType={allComonProjType}
                        allOu={allOu}
                        allProjTag={allProjTag}
                        startAndEndYear={startAndEndYear}
                    />
                    <div style={{ textAlign: 'right', marginBottom: 5, marginTop: 5 }}>
                        <Button
                            type="primary"
                            onClick={() => this.exportButton()}
                            disabled={rowCount === '0'}
                        >
                            {'导出'}
                        </Button>
                        &nbsp;&nbsp;
                        <Button type="primary" onClick={() => this.clickQueryButton()} >
                            {'清空'}
                        </Button>
                    </div>
                    <Table
                        columns={this.columns}
                        dataSource={projInfoList}
                        className={styles.orderTable}
                        bordered
                        pagination={false}
                        rowKey="num"
                    />
                    <Modal
                        title={'导出字段'}
                        visible={this.state.exportVisible}
                        width={600}
                        onCancel={this.exportCancel}
                        footer={[
                            <Button
                                key="back"
                                onClick={this.exportCancel}
                            >
                                {'取消'}
                            </Button>,
                            <Button
                                key="summit"
                                type="primary"
                                onClick={this.exportOk}
                                disabled={judgeAllFiledCheck === '-1'}
                            >
                                {'导出'}
                            </Button>,
                        ]}
                    >
                        <ProjExportPopup
                            dispatch={dispatch}
                            projExportFiled={projExportFiled}
                            judgeAllFiledCheck={judgeAllFiledCheck}
                        />
                    </Modal>
                    <div id="exportTable" style={{ display: 'none' }}>
                        <Table
                            columns={columnsExport}
                            dataSource={projInfoList}
                            className={styles.tableStyle}
                            bordered
                            pagination={false}
                            rowKey="num"
                        />
                    </div>
                </div>
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.projInfoExport,
        ...state.projInfoExport,
    };
}

export default connect(mapStateToProps)(ProjInfoExport);
