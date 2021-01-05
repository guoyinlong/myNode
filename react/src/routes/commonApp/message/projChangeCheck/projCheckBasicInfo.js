/**
 *  作者: 胡月
 *  创建日期: 2017-11-6
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：项目变更中，审核人查看项目经理变更的申请，该tab为基本信息tab
 */

import React from 'react';
import { Table,Input } from 'antd';
import styles from './projCheck.less';
const { TextArea } = Input;

/**
 *  作者: 胡月
 *  创建日期: 2017-11-6
 *  功能：项目变更中，实现审核人查看基本信息的功能
 */
class ProjCheckBasicInfo extends React.PureComponent {

    columns = [
        {
            title:'名称',
            dataIndex: 'module',
            width:'15%',
            render: (value, row, index) => {
                return {
                    children: value,
                    props: {rowSpan:row.rowSpan},
                };
            },
        },
        {
            title:'修改项',
            dataIndex: 'modifyItem',
            width:'15%',
            render: (value, row, index) => {
                if(row.is_diff === '1'){
                    return(<div style={{color:'red',textAlign:'left'}}>{value}</div>);
                }else{
                    return(<div style={{textAlign:'left'}}>{value}</div>);
                }
            }
        },
        {   title:'原值',
            dataIndex: 'oldValue',
            width:'30%',
            render: (value, row, index) => {
                if ('isTextArea' in row && row.isTextArea === '1') {
                    return (
                        <TextArea
                            value={value}
                            autosize={{minRows: 2, maxRows: 6}}
                            disabled={true}
                            className={styles.textAreaStyle}>
                        </TextArea>
                    )
                } else {
                    return(<div style={{textAlign:'left'}}>{value}</div>);
                }
            }
        },
        { title:'新值',
            dataIndex: 'newValue',
            width:'30%',
            render: (value, row, index) => {
                if(row.is_diff === '1'){
                    if ('isTextArea' in row && row.isTextArea === '1') {
                        return (
                            <TextArea
                                value={value}
                                autosize={{minRows: 2, maxRows: 6}}
                                disabled={true}
                                style={{color:'red'}}
                            />
                        )
                    } else {
                        return(<div style={{color:'red',textAlign:'left'}}>{value}</div>);
                    }

                }else{
                    if ('isTextArea' in row && row.isTextArea === '1') {
                        return (
                            <TextArea
                                value={value}
                                autosize={{minRows: 2, maxRows: 6}}
                                disabled={true}
                                style={{color:'black'}}
                            />
                        )
                    } else {
                        return(<div style={{textAlign:'left'}}>{value}</div>);
                    }
                }
            }
        }
    ];
    render() {

        return (
            <div>
                <Table dataSource={this.props.projInfoTableData}
                       columns={this.columns}
                       pagination={false}
                       className={styles.fullCostDeptTable}
                />
            </div>
        );
    }
}

export default ProjCheckBasicInfo;
