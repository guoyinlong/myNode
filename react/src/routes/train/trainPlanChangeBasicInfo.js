/**
 *  作者: 翟金亭
 *  创建日期: 2019-10-30
 *  邮箱：zhaijt3@chinaunicom.cn
 *  文件说明：培训计划调整，调整信息与原始基本信息对比
 */

import React, { Component } from 'react';
import { Table,Input } from 'antd';
import styles from './trainPlanChangeBasicInfo.less';
const { TextArea } = Input;

class TrainPlanChangeBasicInfo extends Component {

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
            title:'调整项',
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

export default TrainPlanChangeBasicInfo;
