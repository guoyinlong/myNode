/**
 * 作者： 杨青
 * 创建日期： 2019-07-10
 * 邮箱: yangq41@chinaunicom.cn
 * 功能： 会议管理-会议生成
 */
import React from 'react';
import {Popconfirm, Input, Button, Modal, Select, Table, Pagination, Spin,message } from 'antd';
import styles from './addMeeting.less'
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import config from '../../../utils/config';

const Option = Select.Option;
const {TextArea} = Input;

class AddMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainDeptVisible: false,
      topic_type_name:'',
      reason:'',
    }
  }
  columns=[
    {
      title: '序号',
      dataIndex:'',
      width:'5%',
      render: (value,row,index) =>{return(index+1);}
    },
    {
      title: '议题名称',
      dataIndex:'topic_name',
      width:'15%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '会议类型',
      dataIndex:'topic_type_name',
      width:'10%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '申请单位',
      dataIndex:'topic_dept_name',
      width:'20%',
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
      render:(text)=> <div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '状态',
      dataIndex:'topic_file_state_desc',
      width:'9%',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title: '操作',
      width:'5%',
      render:(text,record,index)=>{
        return (
          <Popconfirm title="确定进行通过操作吗?" onConfirm={()=>this.returnTopicByOffice(record.topic_id)} okText="确定" cancelText="取消">
            <Button type="primary" size='small'>{'撤回'}</Button>
          </Popconfirm>
        )
      }
    }
  ];
  //分页
  handlePageChange =(page)=>{
    this.props.dispatch({
      type: 'addMeeting/handlePageChange',
      page: page,
    });
  };
  //会议类型
  setSelectShow =(value,condType)=>{
    this.props.dispatch({
      type: 'addMeeting/setSelectShow',
      value,
      condType,
    });
  };
  //议题名称
  setInputShow = (e,condType)=>{
    this.props.dispatch({
      // type: 'addMeeting/changeParam',
      type: 'addMeeting/setInputShow',
      value: e.target.value.trim(),
      condType: condType,
    });
  };
  //查询
  onSearch = ()=>{
    this.props.dispatch({
      type: 'addMeeting/queryPassedMeetingTopic',
    });
  };
  //清空
  onClear = ()=>{
    this.props.dispatch({
      type: 'addMeeting/onClear',
    });
  };
  //撤回
  returnTopicByOffice = (topic_id)=>{
    this.props.dispatch({
      type: 'addMeeting/changeVisible',
      topic_id,
      flag:'open',
    });
  };
  //撤回原因-确定
  onChangeReason = (e)=>{
    this.setState({
      reason:e.target.value
    })
  };
  //撤回确定
  submitModal = ()=>{
    let {reason} = this.state;
    if (reason === ''){
      message.error('请输入撤回原因');
      return;
    }
    this.props.dispatch({
      type: 'addMeeting/returnTopicByOffice',
      reason
    });
  };
  //撤回取消
  cancelModal = ()=>{
    this.props.dispatch({
      type: 'addMeeting/changeVisible',
      topic_id:'',
      flag:'close',
    });
  };
  //生成会议
  jumpMeetingNote = ()=>{
    const {dispatch,paramData,meetingTypeList}=this.props;
    let type_name = meetingTypeList.filter(item => item.type_id===paramData.arg_topic_type)[0].type_name;
    dispatch(routerRedux.push({
      pathname: '/adminApp/meetManage/addMeeting/addMeetingNote',
      query:{
        arg_topic_type:paramData.arg_topic_type,
        type_name:type_name,
        arg_page_current:paramData.arg_page_current,
      },
    }))
  };
  //发送会议-向院长、党委书记确认上会议题清单
  sendMeeting =() =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'addMeeting/sendMeeting',
    });
  };

  //已通过拟上会清单
  passedMeeting=()=>{
    const {dispatch,paramData,meetingTypeList}=this.props;
    let type_name = meetingTypeList.filter(item => item.type_id===paramData.arg_topic_type)[0].type_name;
    dispatch(routerRedux.push({
      pathname: '/adminApp/meetManage/addMeeting/passMeetingNote',
      query:{
        arg_topic_type:paramData.arg_topic_type,
        type_name:type_name,
        arg_page_current:paramData.arg_page_current,
      },
    }))
  };
  render() {
    const {paramData, meetingTypeList, topicList, addAble, visible, sendAble, passedAble} = this.props;
    const optionMType = meetingTypeList.map(item => {
      return (
        <Option key={item.type_id}>
          {item.type_name}
        </Option>
      )
    });
    return(
      <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
        <div style={{paddingTop:13,paddingBottom:16,background:'white'}}>
          <div style={{paddingLeft:15,paddingRight:15}}>
            <h2 style = {{textAlign:'center',marginBottom:30}}>{'会议生成'}</h2>
            {'会议类型: '}
            <Select
              value={paramData.arg_topic_type}
              onSelect={(value)=>this.setSelectShow(value,'arg_topic_type')}
              style={{width:180}}
            >
            {optionMType}
          </Select>&nbsp;&nbsp;
            {'议题名称: '}
            <Input
              style={{width:180}}
              onChange={(e)=>this.setInputShow(e,'arg_topic_name')}
              value={paramData.arg_topic_name}
            />
            <div className={styles.searchBtn}>
              <Button type="primary" disabled={!passedAble} onClick={this.passedMeeting}>{'已通过拟上会清单'}</Button>
              <Button type="primary" disabled={!sendAble} onClick={this.sendMeeting}>{'发送上会议题清单'}</Button>
              <Button type="primary" onClick={this.onSearch}>{'查询'}</Button>
              <Button type="primary" onClick={this.onClear}>{'清空'}</Button>
              <Button type="primary" disabled={!addAble} onClick={this.jumpMeetingNote}>{'生成'}</Button>
            </div>
            <Table columns={this.columns}
                   dataSource={topicList}
                   bordered={true}
                   pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                   className={styles.orderTable}
                   style={{marginTop:'10px'}}
            />
            <div className={styles.page}>
              <Pagination
                current={paramData.arg_page_current}
                total={Number(paramData.rowCount)}
                pageSize={10}
                onChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
        <Modal
          visible={visible}
          title="请输入撤回原因（必填）"
          onOk={this.submitModal}
          onCancel={this.cancelModal}
        >
          <TextArea
            placeholder="最多输入200字"
            maxLength='200'
            rows={4}
            value={this.state.reason}
            onChange={this.onChangeReason}
          />
        </Modal>
      </Spin>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.addMeeting,
    ...state.addMeeting
  }
}

export default connect(mapStateToProps)(AddMeeting);