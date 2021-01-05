/**
 * 作者：金冠超
 * 创建日期：2019-09-03
 * 邮件：jingc@itnova.com.cn
 * 文件说明：部门差旅费-详情
 */
import React from 'react';
import { Table, Modal, Button  } from 'antd';
import styles from '../projCheck.less'
import exportExl from '../../../startup/projExport/exportExl'
class ProjDetails extends React.Component {
    state = {}
    exportTable = () => {
        let table = document.querySelector("#gradeTableWrap table");
        exportExl()(table, '导出数据');
    }
    Columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '6%',
            render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
        }, {
            title: '项目编号',
            dataIndex: 'proj_code',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },{
            title: '项目名称',
            dataIndex: 'proj_name',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },{
            title: '年份',
            dataIndex: 'year',
            width: '6%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'center'}}>{text}</div>
                )
            }
        },
        {
            title: '部门名称',
            dataIndex: 'dept_name',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },{
            title: '项目经理',
            dataIndex: 'mgr_name',
            width: '6%',
            editable: true,
            render: (text, record, index) => {
                return (
                        <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },{
            title: '预算值（元）',
            dataIndex: 'fee',
            width: '9%',
            editable: true,
            render: (text, record, index) => {
                return (
                        <div style={{textAlign:'right'}}>{text}</div>
                )
            }
        },
        
    ];
    render(){
        return (
            <div style = {{height:"500px",overflow:"auto"}}>
                <Button type = "primary" onClick = {this.exportTable}>导出数据</Button>
                <div id = "gradeTableWrap">
                    <Table 
                        columns={this.Columns}
                        bordered={true}
                        rowKey={record => record.id}
                        dataSource={this.props.detailsMessage}
                        pagination={false} 
                        className={styles.orderTable}
                        style={{marginTop:'20px'}}
                    />
                </div>
            </div>
        )
    }
}
export default (ProjDetails)