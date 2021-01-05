/**
 * 作者：邓广晖
 * 创建日期：2018-02-22
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动里面已立项的里程碑查询
 */
import React from 'react';
import {Select,Table,Input,Spin,Tooltip,Modal,Icon,Popover} from 'antd';
import styles from './projStartMain.less';
import {getuuid} from '../../projConst.js';
import config from '../../../../utils/config';
const Option = Select.Option;

/**
 * 作者：邓广晖
 * 创建日期：2018-02-22
 * 功能：实现项目启动已立项的里程碑
 */
class ProjMileStone extends React.PureComponent {

  /**
   * 作者：邓广晖
   * 创建日期：2018-02-28
   * 功能：点击编辑图标触发
   */
  clickMilestoneEditIcon = () => {
    this.props.dispatch({
      type:'projStartMainPage/clickMilestoneEditIcon',
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-02-28
   * 功能：隐藏点击编辑时的提示框
   */
  hideChangeModal=(flag)=>{
    if(flag === 'confirm'){
      if(this.props.mileInfoEditFlag === '3'){
        this.props.dispatch({
          type:'projStartMainPage/changeMilestoneShow',
          pageToType:'edit'
        });
      }
    }
    this.props.dispatch({
      type:'projStartMainPage/closeMilestoneModal',
    });
  };

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
        return <div>{text+'%'}</div>
      }
    },
  ];

  render(){

    //编辑图标显示的信息
    let toolTip = '';
    if(this.props.mileInfoEditFlag === '1' || this.props.mileInfoEditFlag === '3'){
      toolTip = <Tooltip title="编辑">
        <Icon type='bianji'
              style={{color:'blue',cursor:'pointer',fontSize:20}}
              onClick={this.clickMilestoneEditIcon}
        />
      </Tooltip>;
    }else if(this.props.mileInfoEditFlag === '2'){
      toolTip = <Tooltip title={this.props.mileInfoEditVal}>
        <Icon type='bianji'
              style={{color:'grey',fontSize:20}}
        />
      </Tooltip>;
    }

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
        {/*<Spin tip={config.IS_LOADING} spinning={this.props.historyTableLoad}>

      </Spin>*/}
        <div style={{textAlign:'right',marginBottom:'15px'}}>
          {toolTip}
        </div>
        {/*点击编辑时弹出的模态框*/}
        <Modal visible={this.props.mileInfoChgModal}
               key={getuuid(20,62)}
               onOk={()=>this.hideChangeModal('confirm')}
               onCancel={()=>this.hideChangeModal('cancel')}
        >
          <div style={{marginTop:20,fontWeight:'bold',fontSize:18}}>
            {this.props.mileInfoEditVal}
          </div>
        </Modal>
        <Table columns={this.columns}
               dataSource={this.props.mileInfoList}
               className={styles.mileStoneTable}
               pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
               defaultExpandAllRows={false}
               expandedRowRender={expandedRowRender}
        />
      </div>
    );
  }
}

export default ProjMileStone;
