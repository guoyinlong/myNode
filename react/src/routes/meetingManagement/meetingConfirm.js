/**
 * 作者：张枫
 * 创建日期：2019-07-09
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议确认
 */
import React from 'react';
import { connect }  from 'dva';
import styles from './meetingStyle.less';
import { Table,Select,Button,Tabs,Modal,Popconfirm,Input,Collapse,Pagination,Message} from 'antd';
import {routerRedux} from 'dva/router';
import {getUuid} from './../../components/commonApp/commonAppConst.js';
const { Option } = Select;
const TabPane = Tabs.TabPane;
const { Panel } = Collapse;
const { TextArea } = Input;
class MeetingConfirm extends React.PureComponent{
  constructor(props) { super(props);}
  state  = {
    isFileModalVisible : false,
    collapseKey : "",
    isAddTopicModalVisible : false,
    fileIssueMaterials:false,//议题材料弹框是否显示
    selectedTopics : [], //补充议题选中的议题数据
    selectedTopicsStr : "",
    meetingRecord : "",//补充议题的会议信息
    returnData:[],
    isReturn:false,
    allFileList:[],//勾选待下载会议文件全部列表
    topicFileList:[],//勾选议题附件下载全部列表
    topVisible:'none',//勾选议题附件下载-未勾选下载按钮不显示
    downloadVisible:"none",//未勾选下载按钮不显示
    countdownVisible: false,//倒计时
  };
  //待上会会议列表
  columns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (
          <div> { index+1 }</div>
        )
      }
    },
    {
      title : "会议名称",
      dataIndex : "note_name",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "会议时间",
      dataIndex : "time",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "会议室",
      dataIndex : "note_room_name",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render : ( record ) =>{
        return (
          <div>
            <Button type = "primary" size = "small" onClick = {  ( ) =>this.setVisible(  record ) } style = {{marginRight:"5px"}}> 下载会议文件</Button>
            <Popconfirm  title = "你确定取消该会议吗？"  onConfirm = { () =>this.confirmCancelMeeting(record) } >
              <Button type = "primary" size = "small" style = {{marginRight:"5px"}}> 取消</Button>
            </Popconfirm>
            <Popconfirm title = "确定通过钉钉软件发送会议通知吗？" onConfirm = { ( ) => this.confirmInform(record)}>
              <Button type = "primary" size = "small" style = {{marginRight:"5px"}}> 通知 </Button>
            </Popconfirm>
            <Popconfirm title = "你确定该会议已开吗？！" onConfirm = { ()=>this.confirmMeeting(record)}>
              <Button type = "primary"  size = "small" style = {{marginRight:"5px"}}> 会后确认 </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ];
  //待上会会议列表-可进入倒计时页面
  innerColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (
          <div> { index+1 }</div>
        )
      }
    },
    {
      title : "议题名称",
      dataIndex : "topic_name",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },
    {
      title : "议题状态",
      dataIndex : "topic_check_state_desc",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render :(record)=>{
        return(
          <div>
            <div style = {{paddingTop:"5px"}}>
              <Button type = "primary"  size = "small" style = {{marginRight:"5px"}} onClick={  ( ) =>this.configuration(record)}> 倒计时配置 </Button>
              <Modal
                title="倒计时配置"
                width="250px"
                visible={this.state.countdownVisible}
                onOk={this.countdownOk}
                onCancel={this.countdownCancel}
              >
                <div>
                   <span style={{display:'inline-block', textAlign: 'right'}}>
                     倒计时
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                  <Input
                    style={{borderRadius:'5px',width:'100px',marginRight:'10px' }}
                    onChange = {(e)=>this.countdownChange(e)}
                    value={ this.props.countdownName}
                    maxLength={"50"}
                  />
                  分钟
                </div>
              </Modal>
            </div>
          </div>
        )
      }
    }
  ];
  //已上会会议"附件下载"
  fileColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (
          <div>{index+1}</div>
        )
      }
    },
    {
      title : "文件名称",
      dataIndex : "name",
      key : "",
      render : ( text )=>{
        return (
          <div>{text}</div>
        )
      }
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render : ( record )=>{
        return (
          <div>
            <Button type = "primary" onClick = { ( )=>this.downloadFile( record ) }>下载</Button>
          </div>
        )
      }
    }
  ];
  //已上会会议"议题附件下载"
  MaterialsColumns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (
          <div>{index+1}</div>
        )
      }
    },
    {
      title : "文件名称",
      dataIndex : "upload_name",
      key : "",
      render : ( text )=>{
        return (
          <div>{text}</div>
        )
      }
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render : ( record )=>{
        return (
          <div>
            <Button type = "primary" onClick = { ( )=>this.downloadIssues( record ) }>下载</Button>
          </div>
        )
      }
    }
  ];
  //已上会会议议题列表
  doneTopicColumns = [
    {
      title :"序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (<div>{index+1}</div>)
      }
    },{
      title :"议题名称",
      dataIndex : "topic_name",
      key : "",
      render : ( text )=>{
        return (<div>{ text }</div>)
      }
    },
    {
      title :"归档状态",
      dataIndex : "topic_file_state_desc",
      key : "",
      render : ( text )=>{
        return (<div>{ text }</div>)
      }
    },
    {
      title :"操作",
      dataIndex : "",
      key : "",
      render : ( record )=>{
        return (
          record.topic_file_state==="0" ?
            (
              <div>
                <Button type ="primary" style = {{marginRight:"5px"}} onClick={()=>this.clickReturn( record)}>退回</Button>
                <Popconfirm title = "取消后该议题将流转至议题池，确定取消该议题吗？" onConfirm = {()=>this.cancelTopic(record)}>
                  <Button type ="primary" style = {{marginRight:"5px"}}>取消</Button>
                </Popconfirm>
                <Popconfirm title="确定该议题已成功上会，开启该议题的归档流程？" onConfirm = {()=>this.beginTopicFile(record)}>
                  <Button type="primary" >开启归档</Button>
                </Popconfirm>
                <Button type="primary" style={{marginLeft:"5px"}} onClick={()=>this.modifyFiling(record)}>修改</Button>
              </div>
            )
            :
            (
              <div>
                <Button disabled = {true} type ="primary" style = {{marginRight:"5px"}}>退回</Button>
                <Button disabled = {true} type ="primary" style = {{marginRight:"5px"}}>取消</Button>
                <Button disabled = {true}   type ="primary" style = {{marginRight:"5px"}}>开启归档</Button>
                <Button disabled = {true} type ="primary" style = {{marginRight:"5px"}}>修改</Button>
              </div>
            )
        )
      }
    }
  ];
  //待上会会议列表-附件下载
  doneFileColumns = [
    {
      title :"序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (<div>{index+1}</div>)
      }
    }, {
      title: "附件",
      dataIndex: "upload_name",
      key: "",
      render: (text) => {
        return (
          <div>{text}</div>
        )
      }
     },{
      title : "文件类型",
      dataIndex : "upload_desc",
      key : "",
      render :(text)=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "操作",
      dataIndex : "",
      key : "",
      render :( record )=>{
        return(
          <div><Button onClick = {()=>this.downloadAppendices(record)}>下载</Button></div>
        )
      }
    }
  ];
  //
  addTopicColumns =[
    {
      title :"议题名称",
      dataIndex : "topic_name",
      key : "",
      render : ( text )=>{
        return(
          <div>{text}</div>
        )
      }
    },{
      title :"会议类型",
      dataIndex : "topic_type_name",
      key : "",
      render : ( text )=>{
        return(
          <div>{text}</div>
        )
      }
    },{
      title :"汇报单位",
      dataIndex : "topic_dept_name",
      key : "",
      render : ( text )=>{
        return(
          <div>{text}</div>
        )
      }
    },{
      title :"汇报人",
      dataIndex : "topic_user_name",
      key : "",
      render : ( text )=>{
        return(
          <div>{text}</div>
        )
      }
    },{
      title :"申请时间",
      dataIndex : "create_date",
      key : "",
      render : ( text )=>{
        return(
          <div>{text}</div>
        )
      }
    },{
      title :"状态",
      dataIndex : "topic_check_state_desc",
      key : "",
      render : ( text )=>{
        return(
          <div>{text}</div>
        )
      }
    }];
  clickReturn =(record)=>{
    this.setState({
      returnData:record,
      isReturn:true,
    })
  };
  cancelReturn =()=>{
    this.setState({
      isReturn : false
    })
  };
  returnRes = (e)=>{
    const { dispatch } = this.props;
    dispatch({type : "meetingConfirm/saveReturnRes",value:e.target.value})
  };
  //切换tab
  changeTabs =(key)=>{
    const { dispatch } = this.props;
    dispatch({type : "meetingConfirm/clearQueryMeetings"});
    if( key === "1"){
      dispatch({type : "meetingConfirm/queryMeetings"})
    }else if(key === "2")
    {
      dispatch({type:"meetingConfirm/queryDoneMeetings"});
      dispatch({type:"meetingConfirm/queryMeetingTypeList"})
    }
  };
  // 展开table
  changeExpandedRows =( expanded,record)=>{
    this.props.dispatch({
      type : 'meetingConfirm/queryTopicList',
      record : record ,
    })
  };
  // 设置下载会议文件展示
  setVisible = (  record )=>{
    const { dispatch } = this.props;
    this.setState({isFileModalVisible : true});
    dispatch({
      type : "meetingConfirm/queryFileList",
      record : record ,
    })
  };
  // 设置模态框不可见
  setUnVisible = ( setType )=>{
    if (setType === "file")
    {
      this.setState({ isFileModalVisible : false})
    }else if(setType === "addTopic"){
      this.props.dispatch({type:"meetingConfirm/clearAddTopicName"});
      this.setState({isAddTopicModalVisible : false})
    }
  };
  // 下载会议文件
  downloadFile = ( record )=>{
    this.props.dispatch({
      type : "meetingConfirm/downloadFile",
      record : record ,
    })
  };
  //下载全部会议文件
  downloadAllFile = ()=>{
    this.props.dispatch({
      type : "meetingConfirm/downloadAllFile",
      allFileList:this.state.allFileList
    })
  };
  // 确定取消未上会会议
  confirmCancelMeeting  = ( record )=>{
    this.props.dispatch({
      type : "meetingConfirm/confirmCancelMeeting",
      record : record ,
    })
  };
  // 确定发送通知
  confirmInform = ( record )=>{
    this.props.dispatch({
      type : "meetingConfirm/confirmInform",
      record : record ,
    })
  };
  // 确定未上会会议已开
  confirmMeeting = ( record ) =>{
    this.props.dispatch({
      type : "meetingConfirm/confirmMeeting",
      record : record ,
    })
  };
  //展开未上会会议议题附件
  expandWillTopic = (expanded, record)=>{
    this.props.dispatch({
      type : "meetingConfirm/expandWillTopic",
      record : record ,
    })
  };
  // 切换 折叠面板
  changeCollapse =( key )=>{
    if( key!= undefined){
      this.setState({
        collapseKey : key,
      });
      this.props.dispatch({
        type : "meetingConfirm/changeCollapse",
        key : key ,
      })
    }
  };
  // 展开已上会议题列表   查询议题附件列表
  expandDoneTopicList =(expanded,record)=>{
    this.props.dispatch({
      type : "meetingConfirm/queryDoneFileList",
      record : record ,
    })
  };
  // 已上会会议 退回议题
  /**
   doneSendBack =( record)=>{
     this.props.dispatch({
       type : "meetingConfirm/doneSendBack",
       record : record ,
     })
   }
   **/
    // 已上会会议 退回议题
  doneSendBack =( )=>{
    this.props.dispatch({
      type : "meetingConfirm/doneSendBack",
      record : this.state.returnData ,
    });
    this.setState({
      isReturn : false
    })
  };
  //已上会会议议题取消;
  cancelTopic =(record)=>{
    this.props.dispatch({
      type : "meetingConfirm/cancelTopic",
      record : record ,
    })
  };
  //已上会会议议题开始归档
  beginTopicFile=( record )=>{
    this.props.dispatch({
      type : "meetingConfirm/beginTopicFile",
      record : record ,
    })
  };
  //已上会会议归档修改填报议题
  modifyFiling = (record) => {
    this.props.dispatch(routerRedux.push({
      pathname: 'adminApp/meetManage/meetingConfirm/meetingReset',
      query:record
    }))
  };
  //下载已上会会议议题的附件
  downloadAppendices =( record)=>{
    // window.open(record.upload_real_url);
    window.open(record.upload_url);
  };
  //设置增加议题模态框可见 补充议题
  setAddVisible = (e,item)=>{
    e.stopPropagation();
    this.setState({
      isAddTopicModalVisible : true,
      meetingRecord : item ,
    });
    //触发查询 可以 添加的议题列表 和会议类型列表
    this.props.dispatch({
      type : "meetingConfirm/prepareQueryAddTopicList",
      record : item,
    });
    /**
     this.props.dispatch({
       type :"meetingConfirm/queryMeetingTypeList",
       record : item,
     })
     **/
  };
  //已上会会议 下载会议文件模态框
  setDoneDownloadFile = (e,item)=>{
    e.stopPropagation();
    const { dispatch } = this.props;
    this.setState({ isFileModalVisible : true});
    dispatch({
      type :"meetingConfirm/queryFileList",
      record : item,
    })
  };
  // 补充议题  勾选议题
  changeSelectTable = (selectedRowKeys,selectedRows)=>{
    let {selectedTopics,selectedTopicsStr} = this.state ;
    selectedTopics = [];
      selectedTopicsStr = "";
    selectedRows.length && selectedRows.map((item,index)=>{
      selectedTopics.push(item.topic_id);
    });
    selectedTopicsStr = selectedTopics.join(",");
    this.setState({
      selectedTopicsStr ,
    })
  };
  // 下载会议文件 勾选文件全选
  changeFileSelectTable =(selectedRowKeys,selectedRows)=>{
    if(selectedRows.length !==0){
      this.setState({downloadVisible:"block"})
    }else{
      this.setState({downloadVisible:"none"})
    }
    this.setState({
      allFileList :[],
    });
    this.setState({
      allFileList :JSON.parse(JSON.stringify(selectedRows)),
    })
  };
  //确认添加议题
  confirmAddTopic = ()=>{
    const { dispatch } = this.props;
    dispatch({type:"meetingConfirm/clearAddTopicName"});
    const {meetingRecord,selectedTopicsStr} = this.state;
    console.log(meetingRecord,selectedTopicsStr,'selectedTopicsStr')
    if(selectedTopicsStr == ""){
      Message.info("未勾选补充议题！");
      this.setState({isAddTopicModalVisible : false})
    }else{
      dispatch(routerRedux.push({
        pathname : "/adminApp/meetManage/meetingConfirm/addTopicToMeeting",
        query : {
          arg_note_id : meetingRecord.note_id,
          arg_note_name : meetingRecord.note_name,
          arg_topic_ids : selectedTopicsStr,
        }
      }))
    }
  };
  // 已上会会议 tab 切换会议类型
  changeDoneMeetingType =( key )=>{
    this.props.dispatch ({
      type : "meetingConfirm/changeDoneMeetingType",
      key : key ,
    })
  };
  //已上会会议切换会议状态查询
  changeMeetingState =( key )=>{
    this.props.dispatch ({
      type : "meetingConfirm/changeMeetingState",
      key : key ,
    })
  };
  //已上会会议Input框输入
  doneInput = (e)=>{
    this.props.dispatch ({
      type : "meetingConfirm/doneInput",
      value : e.target.value,
    })
  };
  // 点击查询  根据填写条件查询已上会会议列表
  queryDoneMeetings =()=>{
    this.props.dispatch ({
      type : "meetingConfirm/queryDoneMeetings",
    })
  };
  //清空已上会会议查询条件
  clearQueryMeetings =()=>{
    this.props.dispatch ({
      type : "meetingConfirm/clearQueryMeetings",
    })
  };
  // 更改 补充议题 查询条件数据
  changeAddTopicParam = (e)=>{
    console.log(e.target.value);
    this.props.dispatch ({
      type : "meetingConfirm/changeAddTopicParam",
      value : e.target.value,
    })
  };
  //补充议题查询条件
  queryParamAddTopicList = ()=>{
    this.props.dispatch ({
      type : "meetingConfirm/queryAddTopicList",
    })
  };
  // 清空补充议题查询条件
  clearQueryAddTopicList = ()=>{
    this.props.dispatch ({
      type : "meetingConfirm/clearQueryAddTopicList",
    })
  };
  // 修改页码
  changePage =(page)=>{
    this.props.dispatch ({
      type : "meetingConfirm/changePage",
      page : page,
    })
  };
  //修改补充议题页码
  changeAddTopicPage =(page)=>{
    this.props.dispatch ({
      type : "meetingConfirm/changeAddTopicPage",
      page : page,
    })
  };
  //一键归档按钮
  archiveClick =(e,item)=>{
    this.props.dispatch ({
      type : "meetingConfirm/archiveClick",
      record : item,
    })
  };
  //倒计时按钮
  configuration =(record)=>{
    this.setState({
      countdownVisible: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type : "meetingConfirm/configuration",
      record : record,
    })
  };
  //倒计时时间Input框输入
  countdownChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type : "meetingConfirm/countdownChange",
      value: e.target.value
    })
  };
  //倒计时确定
  countdownOk = e => {
    const { dispatch } = this.props;
    this.setState({
      countdownVisible: false,
    });
    dispatch({
      type : "meetingConfirm/countdownOk",
    })
  };
  //倒计时取消
  countdownCancel = e => {
    this.setState({
      countdownVisible: false,
    });
  };

  //已上会会已下载议题材料
  issueMaterials(e,item){
    e.stopPropagation();
    const { dispatch } = this.props;
    this.setState({
      fileIssueMaterials: true,
    });
    dispatch({
      type :"meetingConfirm/issueMaterials",
      record : item,
    });
  };
  //已上会会已下载议题材料-取消
  issueMaterialsOn(){
    this.setState({
      fileIssueMaterials: false,
    });
  };
  //已上会会已下载议题材料-确定
  issueMaterialsOk (){
    this.setState({
      fileIssueMaterials: false,
    });
  };
  //下载已上会会议"议题附件下载"
  downloadIssues(record){
    let url =record.upload_url;
    window.open(url);
  };
  // 下载已上会会议"议题附件下载" 勾选文件全选
  oFileSelectTable =(selectedRowKeys,selectedRows)=>{
    if(selectedRows.length !==0){
      this.setState({topVisible:"block"})
    }else{
      this.setState({topVisible:"none"})
    }
    this.setState({
      topicFileList :[],
    });
    this.setState({
      topicFileList :JSON.parse(JSON.stringify(selectedRows)),
    })
  };
  //已上会会已下载议题材料-批量下载
  downloadMaterials = () =>{
    this.props.dispatch({
      type : "meetingConfirm/downloadMaterials",
      topicFileList : this.state.topicFileList,
    })
  };
  render(){
    const { willMeetingList,fileList,doneMeetingList ,addTopicList,meetingList,meetingStateList,doneParam,materialsSelection} = this.props;
    const willFileExpendedRowRender = (record)=>{
      return(
        <Table
          pagination = { false }
          columns = {this.doneFileColumns}
          dataSource = { record.fileList }
          className = { styles.tableStyle}
        >
        </Table>
      )
    };
    const expandedRowRender = ( record )=>{
      return(
        <Table
          pagination={false}
          columns = { this.innerColumns }
          dataSource = { record.topticlist }
          className = { styles.tableStyle}
          expandedRowRender = { willFileExpendedRowRender}//额外的展开行
          onExpand = { this.expandWillTopic}
          //  defaultExpandAllRows = {false}
        >
        </Table>
      )
    }
    const doneExpendRowRender = ( record )=>{
      return (
        <Table
          pagination = { false }
          columns = { this.doneFileColumns }
          dataSource = { record.fileList}
          className = { styles.tableStyle }
        >
        </Table>
      )
    };
    const rowSelection ={
      onChange : this.changeSelectTable
    };
    const rowFileSelection ={
      onChange : this.changeFileSelectTable
    };
    const isFileMate ={
      onChange : this.oFileSelectTable
    };
    let meetingListOption = meetingList.map((item,index)=>{
      return (
        <Option key = {item.type_id} value = {item.type_id}>{ item.type_name}</Option>
      )
    });
    return(
      <div style={{padding:'13px 15px 16px 15px',background:'white'}}>
        <div style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>会议确认</div>
        <div>
          <Tabs onChange = { this.changeTabs } activeKey = {this.props.currentKey}>
            <TabPane tab = "未上会会议" key = "1">
              <Table
                columns = { this.columns }
                dataSource = {willMeetingList }
                bordered = { true }
                key={this.props.tempKey}
                expandedRowRender = { expandedRowRender }
                onExpand = { this.changeExpandedRows }
                pagination = {false}
              >
              </Table>
            </TabPane>
            <TabPane tab = "已上会会议" key = "2">
              <div style = {{ marginBottom:"10px"}}>
                <span>会议类型：</span>
                <Select
                  defaultValue = "全部"
                  value = {doneParam.type_id}
                  onChange = { this.changeDoneMeetingType }
                  style = {{width : "150px"}}
                >
                  { meetingListOption }
                </Select>
                <span style={{marginLeft:"5px"}}>会议状态：</span>
                <Select
                   defaultValue = "全部"
                  value = { doneParam.note_state}
                  onChange = { this.changeMeetingState }
                  style = {{width : "100px"}}
                >
                  {
                    meetingStateList.length && meetingStateList.map((item,index)=>{
                      //  item.key = index;
                      return(
                        <Option key = {item.key} value = { item.key}>
                          { item.name }
                        </Option>
                      )
                    })
                  }
                </Select>
                <span style={{marginLeft:"5px"}}>会议名称：</span>
                <Input
                  value = {doneParam.note_name}
                  onChange = { (e)=>this.doneInput(e) }
                  style = {{width : "200px"}}
                  maxLength={"50"}
                >
                </Input>
                <div style = {{textAlign:"right"}}>
                  <Button type = "primary" onClick = { this.queryDoneMeetings} style={{marginRight:"5px"}}> 查询</Button>
                  <Button  type = "primary" onClick = { this.clearQueryMeetings}> 清空</Button>
                </div>
              </div>
              <Collapse
                onChange = { this.changeCollapse }
                key={this.props.tempKey}
                accordion
              >
                {
                  doneMeetingList.length && doneMeetingList.map((item,index)=>{
                    return(
                      <Panel
                        header = {(
                          <div>
                            <span>{ item.note_name }</span>
                            <span style = {{marginLeft:"25px"}}>{ item.note_year+"-"+ item.note_month+"-"+item.note_day+"  "+item.note_time}</span>
                            <span style = {{marginLeft:"25px"}}>{ item.note_room_name }</span>
                            <span style = {{marginLeft:"25px"}}>{ item.state }</span>
                            <div style = {{float:"right"}}>
                              <Popconfirm title="确定全部议题已成功上会，全部议题开启归档流程？" onConfirm = {(e)=>this.archiveClick(e,item)}>
                                {

                                  item.state === "待归档"?
                                  <Button type = "primary"  size="small"  style={{marginRight:"5px"}}>一键归档</Button>
                                  :
                                  <Button type = "primary"  size="small"  style={{marginRight:"5px"}}  disabled = {true}>一键归档</Button>
                                }
                              </Popconfirm>
                              <Button type = "primary" size="small" onClick = {(e)=>this.setAddVisible(e,item)}> 补充议题</Button>
                              <Button type = "primary" size="small" onClick = {(e)=> this.setDoneDownloadFile (e,item)} style={{marginLeft:"5px"}}> 下载会议文件</Button>
                              <Button type = "primary" size="small" onClick = {(e)=> this.issueMaterials (e,item)} style={{marginLeft:"5px",marginRight:"5px"}} > 下载议题材料</Button>
                            </div>
                          </div>
                        )}
                        key = { item.note_id }
                        //key = { item.note_id+item.note_name+ item.note_name}
                      >
                        <Table
                          columns = {this.doneTopicColumns}
                          dataSource = { item.topicList }
                          className = { styles.tableStyle }
                          expandedRowRender = { doneExpendRowRender }
                          onExpand = { this.expandDoneTopicList }
                          pagination = { false }
                        >
                        </Table>
                      </Panel>
                    )
                  })
                }
              </Collapse>
              <Pagination
                current = { this.props.page }
                total = {Number(this.props.RowCounts)}
                onChange = {(page)=>this.changePage(page)}
                pageSize = { this.props.pageSize}
                style = {{textAlign:"center",marginTop:"10px"}}
              >
              </Pagination>
            </TabPane>
          </Tabs>
          <Modal
            title = "会议文件下载"
            onOk = { ()=>this.setUnVisible("file") }
            onCancel = { ()=>this.setUnVisible("file") }
            visible = { this.state.isFileModalVisible}
          >
            <div style = {{marginBottom:"3px",display:this.state.downloadVisible,textAlign:"right"}}>
              <Button type = "primary"  onClick = { this.downloadAllFile} >批量下载</Button>
            </div>
            <Table
              columns = { this.fileColumns }
              dataSource = { fileList }
              className = { styles.tableStyle }
              rowSelection = { rowFileSelection }
              pagination = { false }
            >
            </Table>
          </Modal>
          <Modal
            title = "议题文件下载"
            onOk = { ()=>this.issueMaterialsOk("file") }
            onCancel = { ()=>this.issueMaterialsOn("file") }
            visible = { this.state.fileIssueMaterials}
          >
            <div style = {{marginBottom:"3px",display:this.state.topVisible,textAlign:"right"}}>
              <Button type = "primary"  onClick = { this.downloadMaterials} >批量下载</Button>
            </div>
            <Table
              columns = { this.MaterialsColumns }
              rowSelection = { isFileMate }
              dataSource = { materialsSelection }
              className = { styles.tableStyle }
              pagination = { false }
            >
            </Table>
          </Modal>
          <Modal
            title = {"补充议题"}
            onOk = { this.confirmAddTopic }
            onCancel = { ()=>this.setUnVisible("addTopic")}
            visible = { this.state.isAddTopicModalVisible }
            width = "900px"
            key  = {this.props.tempKey}
          >
            <div>
              <div>
                <span style = {{marginLeft:"5px"}}>议题名称：</span>
                <Input
                  //value = { addTopicParam[0].topicNameInput }
                  value = { this.props.addTopicName }
                  onChange = {(e)=>{this.changeAddTopicParam(e)}}
                  style = {{width : "100px"}}
                >
                </Input>
              </div>
              <div style= {{textAlign:"right",marginTop:"5px",marginBottom:"5px"}}>
                <Button onClick = {this.queryParamAddTopicList} type="primary">查询</Button>
                <Button style= {{marginLeft:"5px"}} onClick = {this.clearQueryAddTopicList} type="primary">清空</Button>
              </div>
              <div>
                <Table
                  className = {styles.tableStyle}
                  columns = { this.addTopicColumns }
                  dataSource = { addTopicList }
                  rowSelection = { rowSelection }
                  pagination = {false}
                >
                </Table>
                <Pagination
                  current = { this.props.addTopicPage }
                  total = {Number(this.props.addTopicRowCounts)}
                  onChange = {(page)=>this.changeAddTopicPage(page)}
                  pageSize = { this.props.pageSize}
                  style = {{textAlign:"center",marginTop:"10px"}}
                >
                </Pagination>
              </div>
            </div>
          </Modal>
          <Modal
            title = {"退回至议题申请人，退回原因："}
            onOk = {this.doneSendBack}
            onCancel = { this.cancelReturn }
            visible = { this.state.isReturn }
          >
            <Input
              placeholder="退回原因必填！"
              maxLength = {"450"}
              onChange = {(e)=>this.returnRes(e)}
              value = {this.props.returnRes}
            >
            </Input>
          </Modal>
        </div>
      </div>
    )
  }
}

function countdownToProps(state){
  return{
    loading : state.loading.models.meetingConfirm,
    ...state.meetingConfirm
  }
}
export default connect(countdownToProps)(MeetingConfirm);
