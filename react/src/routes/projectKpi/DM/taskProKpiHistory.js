/**
 * 作者：王超
 * 日期：2018-03-21
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核待办-审批环节
 */
import React, { Component } from 'react';
import { Table} from 'antd';
import { connect } from 'dva';

class CreatTable extends React.Component {

    constructor(props) {
        super(props);
    }
    

    
    render() {
        let data = [];
        let columns = [
            {
              title: '序号',
              dataIndex:'',
              render:(text,record,index)=>{return index + 1;},
              width: '5%'
            },{
              title:'状态',
              dataIndex:'current_state',
              width: '10%'
            },{
              title: '环节名称',
              dataIndex:'current_link_roleid',
              width: '20%'
            },{
              title: '审批人',
              dataIndex: 'current_link_username',
              width: '10%'
            },{
              title: '审批类型',
              dataIndex: 'current_opt_flag_show',
              width: '10%'
            },{
              title: '审批意见',
              dataIndex: 'current_opt_comment',
              render:(text,record,index)=>{return record.current_opt_flag !== '1' ?text:null},
              width: '25%'
            },{
              title: '审批时间',
              dataIndex: 'current_opt_handle_time',
              width: '20%'
            }
         ];
         
         if(this.props.historys && this.props.historys.length>0) {
             let state = '';
             let type = '';
             this.props.historys.map((item,index)=>{
                 if(item.check_flag === '1' && !item.current_opt_flag) {
                     state = '办理中...';
                 } else{
                     if(item.check_flag === '-1') {
                         state = '办结';
                     } else {
                         state = '办毕';
                     }
                 }
                 
                 switch(item.current_opt_flag) {
                     case '1':
                        type = '提交'
                     break;
                     case '2':
                        type = '同意'
                     break;
                     case '3':
                        type = '退回'
                     break;
                 }
            
                 data.push({
                         key:index+1,
                         current_state:state,
                         current_link_roleid:item.current_link_roleid||'',
                         current_link_username:item.current_link_username,
                         current_opt_flag_show:type,
                         current_opt_comment: item.current_opt_comment,
                         current_opt_handle_time:item.current_opt_handle_time
                         
                     })
             })
         }
        
        return (
            <Table columns={columns}
                bordered={true}
                dataSource={data}
                pagination={false}
            />
        );
    }
}

function mapStateToProps (state) {
    const {historys} = state.taskDeatilTMO;
    return {
        historys
    };
}

export default connect(mapStateToProps)(CreatTable);


