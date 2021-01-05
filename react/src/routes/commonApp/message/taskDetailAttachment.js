/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：待办附件
 */
import React, { Component } from 'react';
import { Button, Icon, message ,Table} from 'antd';
import styles from '../../project/startup/projStartMain/projAttachment.less';
/**
 * 作者：任华维
 * 创建日期：2017-10-21.
 * 文件说明：待办附件主页
 */
function Attachment({data}) {
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：下载附件
     * @param record 记录
     */
    const downloadAttachment = (record) =>{
        window.open(record.file_relativepath);
    };
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：声明变量
     */
    const columns = [{
        title:'序号',
        dataIndex:'',
        width:'6%',
        render:(text,record,index)=>{return(<span>{index+1}</span>)}
    },{
        title:'文件名称',
        dataIndex:'file_name',
        width:'30%',
        render: (text, record, index) => {
            return <div style={{textAlign: 'left'}}>{text}</div>
        }
    },{
        title:'文件别名',
        dataIndex:'file_byname',
        width:'30%',
        render: (text, record, index) => {
            return <div style={{textAlign: 'left'}}>{text}</div>
        }
    },{
        title:'操作',
        dataIndex:'',
        width:'10%',
        render:(text,record,index)=>{
            return(
                <span>
                    <a  className = {styles["book-detail"]+' '+styles.bookTag} onClick={()=>downloadAttachment(record)}>
                    {'下载'}
                    </a>
                </span>
            )}
    }];
    return (
        <Table columns={columns}
            dataSource={data}
            pagination={false}
            rowKey='att_id'
            className={styles.orderTable}
            bordered={true}
        />
    );
}
export default Attachment;
