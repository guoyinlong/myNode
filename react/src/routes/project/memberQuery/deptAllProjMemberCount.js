/**
 * 作者：夏天
 * 创建日期：2018-12-3
 * 邮件：1348744578@qq.com
 * 文件说明：部门项目人员汇总
 */
import React from 'react';
import {Table,Button } from 'antd';
import styles from './deptAllProjMemberCount.less';
import exportExl from "../../../components/commonApp/exportExl.js";

export default class DeptAllProjMenberCount extends React.Component {

    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '2%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>;
            },
        }, {
            title: '单位',
            dataIndex: 'ou',
            width: '6%',
        },
        {
            title: '公众研发事业部',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-公众研发事业部'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            },
        }, 
        {
            title: '创新与合作研发事业部',
            dataIndex: '', 
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-创新与合作研发事业部'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            },
        }, {
            title: '公共平台与架构研发事业部',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-公共平台与架构研发事业部'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            },
        }, {
            title: '政企与行业研发事业部',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-政企与行业研发事业部'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            }, 
        }, {
            title: '事业部-小计',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                let num=0;
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-公众研发事业部'){num+=parseInt(dataRecord[i].sum_staff)}
                    else if(dataRecord[i].pu_dept_name === '联通软件研究院-创新与合作研发事业部'){num+=parseInt(dataRecord[i].sum_staff)}
                    else if(dataRecord[i].pu_dept_name === '联通软件研究院-公共平台与架构研发事业部'){num+=parseInt(dataRecord[i].sum_staff)}
                    else if(dataRecord[i].pu_dept_name === '联通软件研究院-政企与行业研发事业部'){num+=parseInt(dataRecord[i].sum_staff)}
                }
                return(<div>{num}</div>)
            },
        }, {
            title: '计费结算中心',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-计费结算中心'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            },
        }, {
            title: '运营保障与调度中心',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-运营保障与调度中心'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            },
        }, {
            title: '共享资源中心',
            dataIndex: 'tt',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-共享资源中心'){
                        return(<div>{dataRecord[i].sum_staff}</div>)
                    }
                }
            },
        }, {
            title: '中心-小计',
            dataIndex: '',
            key: '',
            width: '4%',
            render: (text, record, index) => {
                let dataRecord = JSON.parse(record.total_info);
                let num=0;
                for (let i in dataRecord) {
                    if(dataRecord[i].pu_dept_name === '联通软件研究院-计费结算中心'){num+=parseInt(dataRecord[i].sum_staff)}
                    else if(dataRecord[i].pu_dept_name === '联通软件研究院-运营保障与调度中心'){num+=parseInt(dataRecord[i].sum_staff)}
                    else if(dataRecord[i].pu_dept_name === '联通软件研究院-共享资源中心'){num+=parseInt(dataRecord[i].sum_staff)}
                }
                return(<div>{num}</div>)
            },
        }, {
            title: '合计',
            dataIndex: 'total_staff',
            key: 'total_staff',
            width: '3%',
        }
    ];
    exportExl = () => {
        const list = this.props.deptMemberList;
        let tab=document.querySelector('#tab table');
        if(list !== null && list.length !== 0){
            exportExl()(tab,'部门项目人员汇总')
        } else {
            message.info("查询结果为空！")
        }
    }


    render() {
        return (
            <div id="tab">
                <Table
                    dataSource={this.props.deptMemberList}
                    columns = {this.columns}
                    className={styles.orderTable}
                    bordered
                    rowKey="ou"
                    loading={this.props.loading}
                    pagination = {false}
                />
                <div style={{textAlign:'right',marginTop:'10px'}}>
                    <Button type="primary" onClick = {()=>this.exportExl()} style={{marginRight:'8px'}}>导出</Button>
                </div>
            </div>
        )
    }

}
