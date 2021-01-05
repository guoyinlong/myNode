/**
 * 作者：张枫
 * 创建日期：2018-02-28
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：统一预览表格
 */
import React from 'react';
import { connect } from 'dva';
import {Button,Select,Table,Modal,Tooltip} from 'antd';
const Option = Select.Option;
import styles from './partner.less';

export default class PreviewTable extends React.PureComponent {
  constructor(props) {super(props);}
  state = {};
  columns=[{
    title:'年月',
    dataIndex:'total_year_month',
    width:'8%',
    //fixed : 'left',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.sum_date;
      return obj;
    }
  },{
    title:'项目名称',
    dataIndex:'proj_name',
    width:'15%',
    //fixed : 'left',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.sum;
      return obj;
    }
  },{
    title:'合作伙伴',
    dataIndex:'partner_name',
    width:'8%',
   // fixed : 'left',
    render: (text) => {
      return <p>{text}</p>
    }
  },{
    title:'高级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_h',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_h',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_h',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'中级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_m',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_m',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_m',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'初级工作量',
    children:[{
      title:'标准',
      dataIndex:'month_work_cnt_l',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'额外',
      dataIndex:'other_month_work_cnt_l',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    },{
      title:'合计',
      dataIndex:'workload_sum_l',
      width:'5%',
      render: (text) => {
        return <p>{text}</p>
      }
    }],
  },{
    title:'服务评价',
    dataIndex:'serviceList',
    width:'8%',
    render: (text, record) => {
      return(
        <p>{record.service_sum}
          <Tooltip
            title={
            <div style={{width:'150px'}}>
              <p><span>{"团队能力表现"}</span><span style ={{marginright:'10px'}}>{record.stability_score}</span></p>
              <p><span>{"出勤率"}</span><span style ={{marginright:'10px'}}>{record.attend_score}</span></p>
              <p><span>{"交付时率"}</span><span style ={{marginright:'10px'}}>{record.delivery_score}</span></p>
              <p><span>{"交付质量"}</span><span style ={{marginright:'10px'}}>{record.quality_score}</span></p>
              <p><span>{"内部管理能力"}</span><span style ={{marginright:'10px'}}>{record.manage_score}</span></p>
            </div>
            }
          >
            <span style={{ marginLeft: '5px', color: '#FA7252', textDecoration: 'underline' }}>详情</span>
          </Tooltip>
        </p>
      )
    }
  }];

  render(){
    return (
      <div>
        <Modal
          title = "预览"
          visible = {this.props.visible}
          onOk = {()=>this.props.setVisible("ok")}
          onCancel = {()=>this.props.setVisible("cancel")}
          width = '70%'
        >
          <Table
            columns={this.columns}
            className = {styles.table}
            dataSource = {this.props.data}
            pagination = {false}
            bordered = {true}
            //scroll={{ x: 1800 }}
          >
          </Table>
        </Modal>
        </div>
    );
  }
}

