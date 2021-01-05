/**
 * 作者：胡月
 * 创建日期：2017-12-19
 * 邮件：huy61@chinaunicom.cn
 * 文件说明：实现待办中交付物展示的功能
 */
import React from 'react';
import {Table,Input,Collapse,Spin} from 'antd';
import styles from './deliverableManage.less';
const Panel = Collapse.Panel;

/**
 * 作者：胡月
 * 创建日期：2017-11-19
 * 功能：交付物管理页面
 */
class DeliverableCheck extends React.PureComponent {
  state = {
    disabled: true,
  }

  //下载交付物
  downloadDeliverable=(record)=>{
    window.open('http://' + record.pmdf_file_url);
  }

  //每条里程碑对应的交付物的列表
  columns = [
    {
      dataIndex:'pmdf_file_name'
    },
    {
      dataIndex:'pmdf_file_byname',
      render:(text,record,index)=>{
        return(
          <div>
              <Input
                defaultValue = {text}
                disabled/>
          </div>
        )}
    },
    {
      dataIndex:'',
      render:(text,record,index)=>{
        return(
          <span>
             <a  className = {styles["book-detail"]+' '+styles.bookTag}
                 /*href={record.pmdf_file_url}*/
               onClick={()=>this.downloadDeliverable(record)}>
               {'下载'}
             </a>
         </span>
        )}
    }
  ];

  render(){
    const customPanelStyle = {
      borderRadius: 6,
      overflow:'scroll'
    };
    const {loading,milesList}=this.props;
    if (milesList.length) {
      milesList.map((i, index)=> {
        i.key = index
      })
    }

    //每个项目对应的里程碑列表
    let milesName = milesList.map((milesListItem, indexFirst) => {
      //已提交的交付物类别
      let subDelCategory=[];
      let mile_uid = milesListItem.mile_uid;
      if (milesListItem.deliverables && milesListItem.deliverables !== 'NaN') {
        let deliverables = milesListItem.deliverables.replace(/\:\"\[+/g,':[');
        deliverables = deliverables.replace(/\]\"\}/g,']}');
        subDelCategory = JSON.parse(deliverables).map((deliverablesItem, indexSecond) => {
          let fileList = [];
          if(deliverablesItem.files && deliverablesItem.files !== 'NaN') {
            fileList = deliverablesItem.files;
            for(let fIndex = 0; fIndex < fileList.length; fIndex++){
              fileList[fIndex].mile_uid = mile_uid;
            }
          }
          return (
            <div style={{marginLeft:'2%'}} key={indexSecond} >
              <div style={{textAlign:'left',marginBottom:'6px',marginTop:'8px'}} >
                <span style={{fontWeight:800,marginLeft:'10px'}} >{deliverablesItem.del_name}</span>
              </div>

              <div>
                <Table rowKey='pmdf_id'
                       columns={this.columns}
                       dataSource={fileList}
                       pagination={false}
                       loading={loading}
                       className={styles.orderTable}/>
              </div>
            </div>
          )
        });
      }
      return (
          <Panel key={milesListItem.mile_uid}
                 style={customPanelStyle}
                 header={<div>
                         {milesListItem.mile_name + '（' + milesListItem.plan_begin_time +'~' + milesListItem.plan_end_time + '）'}
                         <div style={{color:'red',fontWeight:'bold',float:'right',marginRight:'20px'}}>{milesListItem.mile_tag_show}</div>
                 </div>}>
            {subDelCategory}
          </Panel>
      )
    });
    return(
      <div>
        {this.props.defaultMilesKey.length?
          <Collapse style={{marginTop:'10px'}}  defaultActiveKey={this.props.defaultMilesKey} >
            {milesName}
          </Collapse>
          :
          null
        }
      </div>
    );
  }
}



export default DeliverableCheck;
