/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：已立项附件列表展示
 */
import React from 'react';
import {Table, Icon, Tooltip} from 'antd';
import styles from './projAttachment.less';

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：附加列表组件
 */
class Attachment extends React.Component {

    /**
     * 作者：胡月
     * 创建日期：2018-01-23
     * 功能：改变附件页面的显示，查看页面（view）和编辑页面（edit）
     * @param pageToType 想要切换成的页面
     */
    changeAttachShow = (pageToType) => {
        this.props.dispatch({
            type: 'projStartMainPage/changeAttachShow',
            pageToType: pageToType
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：下载附加功能
     * @param record 表格的一条记录
     */
    downloadAttachment = (record) => {
        window.open(record.file_relativepath);
    };


    columns = [{
        title: '序号',
        dataIndex: '',
        width: '6%',
        render: (text, record, index) => {
            return (<span>{index + 1}</span>)
        }
    }, {
        title: '文件名称',
        dataIndex: 'file_name',
        width: '30%',
        render: (text, record, index) => {
            return <div style={{textAlign: 'left'}}>{text}</div>
        }
    }, {
        title: '文件别名',
        dataIndex: 'file_byname',
        width: '30%',
        render: (text, record, index) => {
            return <div style={{textAlign: 'left'}}>{text}</div>
        }
    }, {
        title: '操作',
        dataIndex: '',
        width: '10%',
        render: (text, record, index) => {
            return (
                <span>
                    <a className={styles["book-detail"] + ' ' + styles.bookTag}
                       onClick={() => this.downloadAttachment(record)}>
                    {'下载'}
                    </a>
                </span>
            )
        }
    }];

    render() {

        const {attachmentList} = this.props;
        // 这里为每一条记录添加一个key，从0开始
        if (attachmentList) {
            attachmentList.map((i, index) => {
                i.key = index;
            })
        }

        //编辑图标显示的信息
        let toolTip = '';
        if (this.props.attachEditFlag === '1') {
            toolTip = <Tooltip title="编辑">
                <Icon type='bianji'
                      style={{color: 'blue', cursor: 'pointer', fontSize: 20}}
                      onClick={() => this.changeAttachShow('edit')}
                />
            </Tooltip>;
        }
        return (
            <div>
                <div style={{textAlign: 'right', marginBottom: '15px', marginRight: '4px'}}>
                    {toolTip}
                </div>
                <Table columns={this.columns}
                       dataSource={attachmentList}
                       pagination={true}
                       className={styles.orderTable}
                />
            </div>
        );
    }
}

export default Attachment;
