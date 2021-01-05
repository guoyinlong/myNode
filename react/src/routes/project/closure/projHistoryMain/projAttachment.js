/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 邮件：tongf5@chinaunicom.cn
 * 文件说明：已立项附件列表展示
 */
import React from 'react';
import {Table} from 'antd';
import styles from './projAttachment.less';

/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 功能：附加列表组件
 */
class Attachment extends React.Component{

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：下载附加功能
   * @param record 表格的一条记录
   */
  downloadAttachment = (record) =>{
    window.open(record.file_relativepath);
  };

  columns = [
    {
      title:'序号',
      dataIndex:'',
      render:(text,record,index)=>{return(<span>{index+1}</span>)}
    },
    {
      title:'文件名称',
      dataIndex:'file_name'
    },
    {
      title:'文件别名',
      dataIndex:'file_byname'
    },
    {
      title:'操作',
      dataIndex:'',
      render:(text,record,index)=>{return(<span>
                                     <a  className = {styles["book-detail"]+' '+styles.bookTag}
                                         onClick={()=>this.downloadAttachment(record)}
                                      >{'下载'}
                                     </a></span>)}
    }
  ];

  render(){
    const{attachmentList} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(attachmentList){
      attachmentList.map((i,index)=>{
        i.key=index;
      })
    }
    return(
        <Table columns={this.columns}
               dataSource={attachmentList}
               pagination={true}
               className={styles.orderTable}
               bordered={true}
        />
    );
  }
}

export default Attachment;
