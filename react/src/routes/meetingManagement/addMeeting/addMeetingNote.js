/**
 * 作者： 杨青
 * 创建日期： 2019-07-10
 * 邮箱: yangq41@chinaunicom.cn
 * 功能： 会议管理-会议生成-生成会议通知
 */
import React from 'react';
import {Popconfirm , message, Input, Button, Modal, Select, Table, DatePicker, Spin, Tooltip, InputNumber} from 'antd';
import styles from './addMeeting.less'
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm';
import config from '../../../utils/config';

const Option = Select.Option;

class AddMeetingNote extends React.Component {
  constructor(props) {
    super(props);
  }
  columns=[
    {
      title: '序号',
      dataIndex:'number',
      width:'5%',
      render: (text,record,index) =>{
        return(
          <InputNumber defaultValue={record.number} onChange={(value)=>this.setTopicIndex(record.key,value)} min={1} step={1} max={this.props.topicList.length} />
         )
        },
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: '议题名称',
      dataIndex:'topic_name',
      width:'15%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '申请单位',
      dataIndex:'topic_dept_name',
      width:'12%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '汇报人',
      dataIndex:'topic_user_name',
      width:'10%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '申请时间',
      dataIndex:'create_date',
      width:'11%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '列席部门',
      dataIndex:'other_dept_name',
      width:'25%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '操作',
      width:'7%',
      render:(text,record,index)=>{
        return (
          <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.cancelTopic(record.id)} okText="确定" cancelText="取消">
            <Button type="primary" size='small'>{'取消'}</Button>
          </Popconfirm>
        )
      }
    }
  ];
  columnsNoEdit=[
    {
      title: '序号',
      dataIndex:'number',
      width:'5%',
      render: (text,record,index) =>{
        return( <span>{index+1}</span>
        )
      },
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: '议题名称',
      dataIndex:'topic_name',
      width:'15%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '申请单位',
      dataIndex:'topic_dept_name',
      width:'15%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '汇报人',
      dataIndex:'topic_user_name',
      width:'10%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '申请时间',
      dataIndex:'create_date',
      width:'10%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '列席部门',
      dataIndex:'other_dept_name',
      width:'25%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '操作',
      width:'5%',
      render:(text,record,index)=>{
        return (
          <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.cancelTopic(record.id)} okText="确定" cancelText="取消">
            <Button type="primary" size='small'>{'取消'}</Button>
          </Popconfirm>
        )
      }
    }
  ];
  setTopicIndex=(key,value)=>{
    if(value>this.props.topicList.length){
      message.info('输入序号不大于议题列表长度'+this.props.topicList.length);
      return
    }
    this.props.dispatch({
      type: 'addMeetingNote/setTopicIndex',
      // number:e.target.value.trim(),
      number:value,
      key
    });
  };
  cancelTopic=(id)=>{
    this.props.dispatch({
      type: 'addMeetingNote/cancelTopic',
      id,
    });
  };
  setSelectShow =(value,condType)=>{
    this.props.dispatch({
      type: 'addMeetingNote/changeParam',
      value,
      condType,
    });
  };
  onChangeDatePicker=(date, dateString)=>{
    if (dateString!==''){
      let weekArray = new Array("日","一","二","三","四","五","六");
      let week = weekArray[new Date(dateString).getDay()];
      this.setSelectShow(dateString.split("-")[0],'year');
      this.setSelectShow(dateString.split("-")[1],'month');
      this.setSelectShow(dateString.split("-")[2].split(" ")[0],'date');
      this.setSelectShow(dateString.split("-")[2].split(" ")[1],'time');
      this.setSelectShow(week,'week');
    }
  };
  setInputShow=(e,condType)=>{
    this.props.dispatch({
      type: 'addMeetingNote/changeParam',
      value:e.target.value.trim(),
      condType,
    });
  };
  // disabledeDate=(current)=>{
  //   return current && current.valueOf() < Date.now();
  // };
  //会议通知
  confirmAddMeeting=()=>{
    if (this.props.meetingParam.room_name===''){
      message.info('请输入会议室！');
      return;
    }
    if (this.props.editAble){
      this.props.dispatch({
        type: 'addMeetingNote/confirmAddMeeting',
      });
    }else{
      this.props.dispatch({
        type: 'addMeetingNote/addTopic',
      });
    }

  };
  goBack =()=>{
    const {dispatch,queryParam,editAble}=this.props;
    if (editAble){
      dispatch(routerRedux.push({
        pathname: '/adminApp/meetManage/addMeeting',
        query:queryParam,
      }))
    }else{
      dispatch(routerRedux.push({
        pathname: '/adminApp/meetManage/meetingConfirm',
      }))
    }

  };

  render() {
    const {topicList, meetingParam, meeting_title, editAble} = this.props;

    return(
      <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
        <div style={{paddingTop:13,paddingBottom:16,background:'white'}}>
          <div style={{paddingLeft:15,paddingRight:15}}>
            <h2 style = {{textAlign:'center',marginBottom:30}}>{editAble?'生成会议通知':'补充议题'}</h2>
            <h2 style = {{marginBottom:10}}>{meeting_title}</h2>
            {'会议时间: '}
            {
              editAble?
                <DatePicker
                  onChange={this.onChangeDatePicker}
                  value={moment(meetingParam.year+'-'+meetingParam.month+'-'+meetingParam.date+' '+meetingParam.time,dateFormat)}
                  format={dateFormat}
                  // disabledDate={this.disabledeDate}
                  showTime
                />:<span>{meetingParam.year+'-'+meetingParam.month+'-'+meetingParam.date+' '+meetingParam.time}</span>

            }
            &nbsp;&nbsp;
            {'星期: '}<span>{meetingParam.week}</span>&nbsp;&nbsp;
            {'会议室: '}
            {
              editAble?
                <Input
                  style={{width:'200px'}}
                  value={meetingParam.room_name}
                  onChange={(e) => this.setInputShow(e, 'room_name')}/>
                :
                <span>{meetingParam.room_name}</span>
            }
            <div className={styles.searchBtn}>
              <Popconfirm title="确定进行通过操作吗?" onConfirm={this.confirmAddMeeting} okText="确定" cancelText="取消">
                <Button type="primary" >{'确认生成'}</Button>
              </Popconfirm>
              <Popconfirm title="确定进行通过操作吗?" onConfirm={this.goBack} okText="确定" cancelText="取消">
                <Button type="primary">{'取消'}</Button>
              </Popconfirm>
            </div>

            <Table
              columns={editAble?this.columns:this.columnsNoEdit}
              dataSource={topicList}
              className={styles.orderTable}
              pagination={false}
            />
          </div>
        </div>
      </Spin>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.addMeetingNote,
    ...state.addMeetingNote
  }
}
export default connect(mapStateToProps) (AddMeetingNote);


