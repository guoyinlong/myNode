/**
 * 作者：张枫
 * 创建日期：2019-07-09
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议配置
 */
import React from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Button,
  Table,
  Modal,
  Popconfirm,
  Radio,
  Input,
  Select,
  Switch,
  Pagination,
  TreeSelect,
  Icon,
  Upload,
  message
} from 'antd';
import {DeptList} from './../../components/QRSystem/deptChoose.js';
import styles from './meetingStyle.less';
import EvidenceFileUpload from "./evidenceFile";
import Cookie from "js-cookie";
const  { TabPane } = Tabs;
const { Option } = Select ;
const { TextArea } = Input;
class MeetingConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMeetingVisible: false, //会议类型配置新增
      isDelTypeVisible: false,  //删除会议配置类型确认
      isManagerVisible: false, // 办公室管理员配置新增
      isDelManagerVisible: false, //删除办公室管理员配置
      modifyVisible: false,  //三重一大原因修改
      typeTitle: '新增',
      visible: false,
      import: {
        name: 'file',
        action: '/microservice/allmanagementofmeetings/newmeetings/ImportImportantReason?arg_ouid='+Cookie.get("OUID")+'&&arg_user_id='+Cookie.get("userid")+'&&arg_user_name='+Cookie.get("username")+'',
        multiple: false,
        showUploadList: false,
        accept: '.xlsx, .xls',
        responseType:'blob',
        onChange:(info)=> {
          if (info.file.status === 'done') {
            if (info.file.response.RetCode === '1') {
              this.fileImport(info.file.response);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 导入失败！`);
            }else if(info.file.response.RetCode === '0'){
              message.info(info.file.response.RetVal);
            }
          }
        }
      },

      explanation: {
        name: 'filename',
        multiple: true,
        showUploadList: true,
        action: '/filemanage/fileupload',
        data:{
          argappname:'writeFileUpdate',
          argtenantid:Cookie.get('tenantid'),
          arguserid:Cookie.get('userid'),
          argyear:new Date().getFullYear(),
          argmonth:new Date().getMonth()+1,
          argday:new Date().getDate()
        },
        onChange:(info)=> {
          if (info.file.status === 'done') {
            if (info.file.response.RetCode === '1') {
              this.explanationPath(info.file.response);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败！.`);
            }
          }
        }
      },
    }
  }
  ConfigColumns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: '',
      render: (index)=> {
        return (
          <div >{index + 1}</div>
        )
      }
    },
    {
      title: '会议类型',
      dataIndex: 'type_name',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (record)=> {
        return (
          <div >
            <Switch
              checkedChildren = '开'
              unCheckedChildren = '关'
              onChange = {(checked)=>this.changeTypeState(record,checked)}
              checked = { record.type_state === '1' ? true : false }
            >
            </Switch>
            <Button
              onClick = {()=> this.modifyMeetingConfig(record)}
              type = "primary"
              style = {{marginLeft : "5px"}}
            >修改
            </Button>
            <Popconfirm
              title = '确定删除会议配置类型！'
              onConfirm = {()=>this.delMeetingConfig( record.type_id)}
              onCancel = {()=>this.setUnVisible("delType")}
              disabled = { this.state.isDelTypeVisible}
            >
              <Button
                type = "primary"
                onClick = { ()=>this.setVisible("delType")}
                style = {{marginLeft : '5px'}}
              >删除</Button>
            </Popconfirm>
          </div>
        )
      }
    },
  ] ;
  ManagerColumns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: '',
      render: (index)=> {
        return (
          <div >{index + 1}</div>
        )
      }
    },
    {
      title: '管理员',
      dataIndex: 'office_manager_name',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '部门',
      dataIndex: 'deptname',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '会议类型',
      dataIndex: 'type_name',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (record)=> {
        return (
          <div >
            <Switch
              checkedChildren = '开'
              unCheckedChildren = '关'
              onChange = {(checked)=>this.changeManagerState( record,checked)}
              checked = { record.state === '1'?true :false}
            >
            </Switch>
            <Button type="primary" style={{marginLeft:'5px'}} onClick = { ()=>this.modifyManagerConfig(record)}>修改</Button>
            <Popconfirm
              title = '确定删除管理员配置！'
              onConfirm = {()=>this.delManageConfig( record.type_id)}
              onCancel = {()=>this.setUnVisible("delManager")}
              disabled = { this.state.isDelManagerVisible}
            >
              <Button type="primary" style={{marginLeft:'5px'}}>删除</Button>
            </Popconfirm>
          </div>
        )
      }
    },
  ];
  //三重一大原因配置列表
  ThreeMajor = [
    {
      title: '序号',
      dataIndex: 'key',
      width:'5%',
      key: '',
      render: (index)=> {
        return (
          <div >{index + 1}</div>
        )
      }
    },
    {
      title: '三重一大原因',
      dataIndex: 'reason_name',
      width:'65%',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '事项编码',
      dataIndex: 'reason_code',
      width:'15%',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      width:'15%',
      key: '',
      render: (record)=> {
        return (
          <div>
            <Popconfirm
              title = '确定删除三重一大原因！'
              onConfirm = {()=>this.determineDelete(record)}
            >
              <Button
                type = "primary"
                style = {{marginLeft : '5px'}}
              >
                删除
              </Button>
            </Popconfirm>
            <Button
              type="primary" style={{marginLeft: '5px',marginTop:'5px'}}
              onClick={()=>this.modifyModal(record)}>
              修改
            </Button>
          </div>
        )
      }
    }
  ];
  //三重一大原因说明列表
  FivesMajor = [
    {
      title: '序号',
      dataIndex: 'key',
      width:'5%',
      key: '',
      render: (index)=> {
        return (
          <div >{index + 1}</div>
        )
      }
    },
    {
      title: '文件',
      dataIndex: 'upload_name',
      width:'65%',
      key: '',
      render: (text)=> {
        return (
          <div >{text}</div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      width:'15%',
      key: '',
      render: (record)=> {
        return (
          <div>
            <Button
              type="primary" style={{marginLeft: '5px',marginTop:'5px'}}
              onClick={()=>this.downloadModal(record)}>
              下载
            </Button>
          </div>
        )
      }
    }
  ];
  //切换tab
  changeTab = (key)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/initPage',
    })
    if( key === "1"){
      dispatch ({
        type : 'meetingManageConfig/initTypeList',
      })
    }else if (key === "2"){
      dispatch ({
        type : 'meetingManageConfig/queryManagerList',
      })
      dispatch ({
        type : 'meetingManageConfig/queryMeetingTypeList',
      })
      dispatch ({
        type : 'meetingManageConfig/queryDeptList',
      })
    }else if (key ==="3"){
      dispatch ({
        type : 'meetingManageConfig/bulletinContentList',
      })
    }else if (key === "4"){
      dispatch ({
        type : 'meetingManageConfig/reasonQuery',
      })
    }else if(key === "5"){
      dispatch ({
        type : 'meetingManageConfig/majorDocuments',
      })
    }
  }
  // 保存新增会议类型数据
  saveData = ( value )=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/saveData',
      value : value,
    })
  }
  //确认新增会议类型
  confirmAddModifyMeeting = ()=>{
    this.setState ({
      isMeetingVisible : false,
    });
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/confirmAddModifyMeeting',
    });

  }
  // 删除会议配置类型
  delMeetingConfig = ( value)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/delMeetingConfig',
      typeID : value
    })
  }
  // 修改会议配置类型
  modifyMeetingConfig = (record)=>{
    this.setState({
      typeTitle : '修改',
      isMeetingVisible : true,
    })
    this.props.dispatch ({
      type : 'meetingManageConfig/modifyMeetingConfig',
      record : record ,
    })
  }
  //修改管理配置类型
  modifyManagerConfig =(record)=>{
    this.setState({
      isManagerVisible : true,
    })
    this.props.dispatch ({
      type : 'meetingManageConfig/modifyManagerConfig',
      record : record ,
    })
  }
  //设置显示
  setVisible = (value)=>{
    if (value === "delType")
    {
      this.setState({
        isDelTypeVisible : true,
      })
    }else if (value === 'addType'){
      this.setState({
        isMeetingVisible : true,
      });
      this.props.dispatch({type : "meetingManageConfig/saveFlag",value,});

    }
    else if (value === 'addManager'){
      this.setState({
        isManagerVisible : true, //办公室管理员配置新增显示
      });
      this.props.dispatch({type : 'meetingManageConfig/saveFlag',value:value,});
      this.props.dispatch({type:"meetingManageConfig/queryMeetingTypeList"});
      this.props.dispatch({type:"meetingManageConfig/queryDeptList"});
    }
  }
  //设置不显示
  setUnVisible = ( value)=>{
    if (value === "delType")
    {
      this.setState({
        isDelTypeVisible : false, //删除会议类型配置确认框取消
      })
    }else if (value === 'addCancel'){
      this.setState({
        isMeetingVisible : false,  //会议类型配置新增取消
      });
      this.props.dispatch({
        type :'meetingManageConfig/setParam'
      })

    } else if ( value === 'cancelAddManager'){
      this.setState({
        isManagerVisible : false, // 取消办公室管理员新增
      });
    }else if ( value === 'delManager'){
      this.setState({
        isDelManagerVisible : true,
      })

    }
  }
  // 选择部门
  changeDept = (key)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/changeDept',
      deptID : key
    })
  }
  // 选择人员
  changeStaff = ( key)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/changeStaff',
      deptID : key
    })
  }
  // 切换办公室管理员中会议类型选择
  changeManType = ( key )=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/changeManType',
      key : key
    })
  }
  //确定增加办公室管理员
  confirmAddManager = ()=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/confirmAddManager'
    });
  }
  // 确定删除管理员配置
  delManageConfig = (value)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/delManageConfig',
      typeID : value,
    })
  }
  //切换会议类型配置开关状态
  changeTypeState = (record,checked)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/changeTypeState',
      checked : checked,
      record : record,
    });
  }
  //切换办公室管理员开关状态
  changeManagerState = (record ,checked)=>{
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/changeManagerState',
      checked : checked,
      record : record,
    });
  }
  //处理页码
  handlePage =( page)=>{
    this.props.dispatch({type:'meetingManageConfig/handlePage',page:page})
  }
  handleManagePage =( page)=>{
    this.props.dispatch({type:'meetingManageConfig/handleManagePage',page:page})
  }
  //会议类型选择
  changeMeetingType =(key)=>{
    this.props.dispatch({type:"meetingManageConfig/changeMeetingType",key,})
  }
  //确认新增或者更新 管理员
  confirmAddModifyManager  = ()=>{
    this.setState ({
      isManagerVisible : false,
    });
    const { dispatch } = this.props;
    dispatch ({
      type : 'meetingManageConfig/confirmAddModifyManager',
    });

  }
  // 选择变更部门
  changeSelectDept = ( value,node,extra )=>{
    this.props.dispatch({type:"meetingManageConfig/saveDeptValue",value,})
    this.props.dispatch({type:"meetingManageConfig/queryStaffList",value,})
  }
  //选择变更部门人员
  selectStaff =(value)=>{
    this.props.dispatch({type:"meetingManageConfig/saveStaffValue",value,})

  };
  //公告内容配置
  announcementChange =(e)=>{
    this.props.dispatch({
      type:"meetingManageConfig/announcementChange",
      value: e.target.value
    })
  };
  //公告内容配置确定按钮
  determine =() => {
    this.props.dispatch({
      type:"meetingManageConfig/determine",
    })
  };
  //三重一大导入
  fileImport =(response) =>{
    this.setState({visible: true});
    this.props.dispatch({
      type:"meetingManageConfig/fileImport",
      response
    })
  };
  //删除-三重一大原因
  determineDelete =(record)=>{
    this.props.dispatch({
      type:"meetingManageConfig/determineDelete",
      record : record,
    })
  };
  //取消-三重一大原因修改
  modifyCancel = e => {
    this.setState({
      modifyVisible: false,
    });
    this.props.dispatch({
      type:"meetingManageConfig/modifyCancel",
    })
  };
  //ok-三重一大原因修改
  modifyImport =(e)=> {
    this.setState({
      modifyVisible: false,
    });
    this.props.dispatch({
      type:"meetingManageConfig/modifyImport",
    })
  };
  //点击-三重一大原因修改
  modifyModal = (record) => {
    this.setState({
      modifyVisible: true,
    });
    this.props.dispatch({
      type:"meetingManageConfig/modifyModal",
      record:record
    })
  };
  //三重一大原因-数据
  majorOnChang =(e)=>{
    this.props.dispatch({
      type:"meetingManageConfig/majorOnChang",
      value: e.target.value
    })
  };
  //三重一大原因事项编码-数据
  eventOnChang =(e)=>{
    this.props.dispatch({
      type:"meetingManageConfig/eventOnChang",
      value: e.target.value
    })
  };
  //三重一大原因保存附件名称地址
  explanationPath =(value) =>{
    this.props.dispatch({
      type:"meetingManageConfig/explanationPath",
      value: value
    })
  };
  //三重一大原因保存附件名称地址-下载
  downloadModal =(record)=>{
    let url =record.upload_real_url;
    window.open(url);
  };
  adioChange =(value,key)=> {
    this.props.dispatch({
      type:"meetingManageConfig/adioChange",
      value: value,
      key:key
    })
  };
  render(){
    const { meetingType ,departList,managerParam,managerList,staffList,meetingTypeList} = this.props;
    return (
      <div style={{padding:'13px 15px 16px 15px',background:'white'}}>
        <p style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>会议配置</p>
        <Tabs onChange = {this.changeTab} activeKey = {this.props.tabKey}>
          <TabPane tab = '会议类型配置' key = "1">
            <div style={{textAlign:"right",marginBottom:"5px"}}>
              <Button
                type = "primary"
                onClick = {()=> this.setVisible("addType") }>
                新增
              </Button>
            </div>
            <Table
              columns = { this.ConfigColumns }
              dataSource = { this.props.typeList}
              pagination = { false }
              className = { styles.tableStyle}
            >
            </Table>
            <Pagination
              current = { Number(this.props.page)}
              pageSize = {this.props.pageSize}
              total = { Number(this.props.rowCount)}
              onChange = {this.handlePage}
              style = {{textAlign:'center',marginTop:"10px"}}
            />
          </TabPane>
          <TabPane tab = '办公室管理员配置'  key = "2">
            <div style = {{textAlign:'right',marginBottom:"5px"}}>
              <Button
                onClick = {()=>this.setVisible("addManager")}
                type = "primary"
              >新增
              </Button>
            </div>
            <Table
              columns = { this.ManagerColumns }
              dataSource = { managerList}
              pagination = { false }
              className = { styles.tableStyle }
            >
            </Table>
            <Pagination
              current = { Number(this.props.page)}
              pageSize = {this.props.pageSize}
              total = { Number(this.props.rowCount)}
              onChange = {this.handleManagePage}
              style = {{textAlign:'center',marginTop:"10px"}}
            >
            </Pagination>
          </TabPane>
          <TabPane  tab = '公告内容配置'  key = "3">
            <div   style={{width:'645px',height:'170px',marginLeft:'20px'}}>
              <TextArea
                value={this.props.proclamationDesc}
                onChange={this.announcementChange}
                style={{width:'645px', height:'170px'}}
              />
              <Button
                type = "primary"
                style={{float:'right',marginTop:"10px"}}
                onClick={this.determine}
              >
                确定
              </Button>
            </div>
          </TabPane>
          <TabPane  tab = '三重一大原因配置'  key = "4">
            <div style = {{textAlign:'right',marginBottom:"5px"}}>
              <Upload {...this.state.import}>
                <Button type = "primary"> {'导入'}</Button>
                <i style={{color:"red",marginLeft:'10px'}}>推荐xlsx,xls</i>
              </Upload>
            </div>
            <Table
              columns = { this.ThreeMajor }
              dataSource = {this.props.majorList}
              pagination = { false }
              className = { styles.tableStyle }
              pagination={this.props.majopPagination}
            >
            </Table>
          </TabPane>
          <TabPane  tab = '三重一大原因说明文件'  key = "5">
            <div style = {{textAlign:'right',marginBottom:"5px"}}>
              <Upload {...this.state.explanation} showUploadList= {false} accept=".pdf">
                <Button type = "primary"> {'导入'}</Button>
                <i style={{color:"red",marginLeft:'10px'}}>推荐pdf</i>
              </Upload>
            </div>
            <Table
              columns = { this.FivesMajor }
              dataSource = {this.props.captionList}
              pagination = { false }
              className = { styles.tableStyle }
              pagination={this.props.majopPagination}
            >
            </Table>
          </TabPane>
        </Tabs>
        <Modal
          title = { this.props.typeFlag =="1"?"新增会议类型":"修改会议类型" }
          visible = {this.state.isMeetingVisible}
          onOk = {()=>this.confirmAddModifyMeeting()}
          onCancel ={()=>this.setUnVisible('addCancel')}
        >
          <p>会议类型名称：</p>
          <Input
            onChange = {(e)=> this.saveData(e.target.value) }
            value = { meetingType }
          >
          </Input>
          <div style = {{marginTop:"10px"}}>
            会议审批流程：
            <Select
              placeholder ='请选择会议审批流程'
              value={this.props.processMeeting}
              onSelect={(value,key)=>this.adioChange(value,key)}
              style={{ width: '40%' }}>
              <Option value="0" key={0}>不需选拟上会清单</Option>
              <Option value="1" key={1}>需选拟上会清单</Option>
              <Option value="2" key={2}>分管院领导专题会议</Option>
            </Select>
          </div>
        </Modal>
        <Modal
          title = {this.props.managerFlag=="1"?"新增办公室管理员":"修改办公室管理员"}
          //key={this.props.tempKey}
          visible = {this.state.isManagerVisible}
          onOk = { ()=>this.confirmAddModifyManager() }
          onCancel = { ()=>{this.setUnVisible("cancelAddManager")}}
          key={this.props.tempKey}
        >
          <p>会议类型</p>
          <Select
            // value = { this.props.managerParam.type_id }
            value = { this.props.managerFlag=="1"?this.props.managerParam.type_id: this.props.managerParam.type_name}
            onSelect = {(key)=> this.changeMeetingType(key)}
            style = {{ width :"300px"}}
            disabled = { this.props.managerFlag=="2"?true:false }
          >
            {
              meetingTypeList.length && meetingTypeList.map((item,index)=>{
                return(
                  <Option key = {item.type_id}>
                    { item.type_name }
                  </Option>
                )
              })
            }
          </Select>
          <p>部门</p>
          {
            departList.length ?
              <TreeSelect
                // value = { managerParam.dept_id  }
                treeData = { departList }
                style = {{ width : '300px'}}
                //  treeDefaultExpandAll
                onChange = { this.changeSelectDept }
              >
              </TreeSelect>
              :
              <TreeSelect
                treeData = { [] }
                style = {{ width : '300px'}}
              >
              </TreeSelect>
          }

          <p>管理员</p>
          <Select
            style = {{ width :"300px"}}
            value = { managerParam.office_manager_name}
            onChange = { this.selectStaff}
          >
            {
              staffList.length && staffList.map((item,index)=>{
                return(
                  <Option key = {item.userid+"-"+item.username}>{item.username}</Option>
                )
              })
            }
          </Select>
        </Modal>
        {/* 三重一大原因修改 */}
        <Modal
          title="三重一大原因修改"
          visible={this.state.modifyVisible}
          onOk={this.modifyImport}
          onCancel={this.modifyCancel}
        >
          <div style={{marginTop:'10px'}}>
                   <span style={{display:'inline-block', width:'143px',textAlign: 'right'}}>
                    三重一大原因
                   </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'2px'}}>:</span>
            <TextArea
              onChange={this.majorOnChang}
              value = { this.props.majorDigital}
              style={{ width:'50%',height:'120px'}}
            />
          </div>
          <div style={{marginTop:'10px'}}>
           <span style={{display:'inline-block', width:'143px',textAlign: 'right'}}>
            三重一大原因事项编码
           </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'2px'}}>:</span>
            <Input
              onChange={this.eventOnChang}
              value = { this.props.eventCode}
              style={{ width:'50%'}}
            >
            </Input>
          </div>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.meetingManageConfig,
    ...state.meetingManageConfig
  }
}
export default connect(mapStateToProps)(MeetingConfig);
