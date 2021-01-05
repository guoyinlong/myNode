/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 邮件：tongf5@chinaunicom.cn
 * 文件说明：已立项里程碑
 */
import React from 'react';
import { Table,Input,Popover} from 'antd';
import styles from '../../startup/projStartMain/projStartMain.less';
//import styles from '../../startup/projAdd/mileStoneCards.less';


/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 功能：tabs中里程碑页面
 */
class MileInfoQuery extends React.Component {

  columns = [
    {
      title:'序号',
      dataIndex:'',
      width:'5%',
      render:(text,record,index)=>{return(<div>{index+1}</div>)}
    }, {
      title: '里程碑名称',
      dataIndex: 'mile_name',
      width:'40%',
      render: (text, record, index) => {
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },{
      title: '开始时间',
      dataIndex: 'plan_begin_time',
      width:'15%'
    },{
      title: '结束时间',
      dataIndex: 'plan_end_time',
      width:'15%'
    },{
      title: '计划工作量（人月）',
      dataIndex: 'plan_workload',
      width:'15%'
    },{
      title: '进度',
      dataIndex: 'mile_month_progress',
      width:'10%',
      render: (text, record, index) => {
        let progress = text !== undefined && text !== ''? text : '0';
        return <div>{progress+'%'}</div>
      }
    },
  ];

  render(){

    const expandedRowRender = (outerRecord) => {
      //console.log('=============outerRecord');
      //console.log(outerRecord);
      const columns = [
        { title: '文件名',
          dataIndex: 'pmdf_file_name',
          width:'40%',
          render:(text,record,index)=>{
            return(
              <div style={{textAlign:'left',paddingLeft:20}}>{(index+1).toString() + '.' + text}</div>
            )
          }
        },
        { title: '文件别名',
          dataIndex: 'pmdf_file_byname',
          width:'40%',
          render:(text,record,index)=>{
            return(
              <Input value={text} disabled/>
            )
          }
        },
        {
          title:'操作',
          dataIndex:'',
          width:'20%',
          render:(text,record,index)=>{
            return(
              <span>
                <a className={styles.fileOperateStyle} href={record.pmdf_file_path}>{'下载'}</a>
                &nbsp;&nbsp;
                <Popover
                  content={
                    <div>
                      <div style={{marginBottom:10}}>
                        <div className={styles.popStyle}>{'审核人'}</div>
                        <div style={{display:'inline-block'}}>{record.pmdf_check_username}</div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div className={styles.popStyle}>{'审核时间'}</div>
                        <div style={{display:'inline-block'}}>{record.pmdf_check_time}</div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div className={styles.popStyle}>{'上传人'}</div>
                        <div style={{display:'inline-block'}}>{record.pmdf_create_username}</div>
                      </div>
                      <div style={{marginBottom:10}}>
                        <div className={styles.popStyle}>{'上传时间'}</div>
                        <div style={{display:'inline-block'}}>{record.pmdf_create_time}</div>
                      </div>
                    </div>
                  }
                >
                  <span className={styles.fileOperateStyle} style={{color:'#00a2ff'}}>{'详细'}</span>
                </Popover>
              </span>
            )
          }
        }
      ];
      let deliverablesList = [];

      for(let i = 0; i < outerRecord.deliverables.length; i++){
        let files = outerRecord.deliverables[i].files;
        let fileTableData = [];
        for(let j = 0; j < files.length; j++){
          fileTableData.push(files[j]);
        }
        deliverablesList.push(
          <div key={outerRecord.deliverables[i].key}>
            <div className={styles.deliverableStyle}>
              {outerRecord.deliverables[i].del_name}
            </div>
            {fileTableData.length?
              <Table
                columns={columns}
                dataSource={fileTableData}
                pagination={false}
                showHeader={false}
                className={styles.fileTable}
              />
              :
              <div style={{color:'#949393'}}>该交付物无文件数据</div>
            }
          </div>
        );
      }
      if(deliverablesList.length){
        return (deliverablesList);
      }else{
        return <div style={{color:'#949393'}}>该里程碑无交付物数据</div>
      }

    };

    return(
      <div>
        <Table columns={this.columns}
               dataSource={this.props.mileInfoList}
               bordered={true}
               className={styles.mileStoneTable}
               pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
               defaultExpandAllRows={false}
               expandedRowRender={expandedRowRender}
        />
      </div>
    );
  }
}

export default MileInfoQuery;
