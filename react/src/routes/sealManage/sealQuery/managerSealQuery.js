/**
 * 作者：窦阳春
 * 日期：2019-9-4
 * 邮箱：douyc@itnova.com.cn
 * 功能：管理员用印查询
 */
import React from 'react';
import {connect } from 'dva';
import { DatePicker, Table, Button,Tabs,Popconfirm, Pagination, Spin, message, Modal, Input, Select, Row, Col  } from 'antd'
import styles from './sealPersonalQuery.less'
import { routerRedux } from 'dva/router';
import exportExcel from "./ExcelExport";
import FileUpload from './FileUpload.js';        //上传功能组件
const TabPane = Tabs.TabPane;


import moment from 'moment';
// import { Record } from 'immutable';
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD' || undefined; // 解决时间格式问题
class ManagerSealQuery extends React.Component {
	constructor(props) {
		super(props);
  }
  state = {
    title: '',
    flag: '1' // 领取 结束 归还
  }
  // 获取当前时间设置为默认显示的时间
	getCurrentTime = () => {
		let d = new Date()
		let year = d.getFullYear();
		let mon = d.getMonth() + 1;
		let date = d.getDate();
    mon = mon < 10 ? '0' + mon : mon
    date = date < 10 ? '0' + date : date 
		let currentTime = year + '-' + mon + '-' + date
		return currentTime
  }
  changeTabs = (key) => {
    if(key == '1') {
      this.props.dispatch({
        type: 'managerSealQuery/firstPage'
      })
    }else if(key == '2') {
      this.props.dispatch({
        type: 'managerSealQuery/secondPage'
      })
    }
  }
  saveSelectTime = (date, dataString) => {
    this.props.dispatch({
      type: 'managerSealQuery/saveSelectTime',
      value: dataString
    })
  }
  // 申请单作废
  applyAbolish = (e, record) => {
    e.stopPropagation()
    this.props.dispatch({
      type: 'managerSealQuery/applyAbolish',
      record
    })
  }
  // 确认领取
  fileUpload = () => {
    this.props.dispatch({
      type: 'managerSealQuery/fileUpload',
    })
  }
  // 发送通知
  sendEmail = (e, record) => {
    e.stopPropagation()
    this.props.dispatch({
      type: 'managerSealQuery/sendEmail',
      record
    })
  }
  // 阻止冒泡跳转
  preventDefalut = (e) => {
    e.stopPropagation()
  }
  // 显示模态框
  setVisible = (e, value, record) => {
    e.stopPropagation()
    if(value == 'confirmeReceive') { // 确认领取模态框
      this.setState({
        title: '确认领取',
        flag: '1'
      })
      this.props.dispatch({
        type: 'managerSealQuery/confirmeReceiveFlag',
        record,
      })
    }else if(value == 'confirmeFinish') { // 确认完成
      this.setState({
        title: '确认完成',
        flag: '2'
      })
      this.props.dispatch({
        type: 'managerSealQuery/confirmeFinishFlag',
        record,
      })
    }else if(value == 'confirmeReturn') { // 确认归还
      this.setState({
        title: '确认归还',
        flag: '3'
      })
      this.props.dispatch({
        type: 'managerSealQuery/confirmeReturnFlag',
        record,
      })
    }
  }
  // 取消显示Modal模态框
  setUnVisible = (value) => {
    if(value == 'confirmeReceive') { // 确认领取模态框
      this.props.dispatch({
        type: 'managerSealQuery/cancelConfirme'
      })
    }
  }
  // 确认领取查询
  receiveOrConfirmeQuery = () => {
    this.props.dispatch({
      type: 'managerSealQuery/receiveOrConfirmeQuery'
    })
  }
  //上传需要
  saveData = (values) => {
    this.setState({
      showData:values,
      importDataLength:values.length,
    })
  };
  //点击下载附件
  downloadUpload = (e,record) =>{
    let url = record.RelativePath;
    window.open(url, '_self');
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    // console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'managerSealQuery/'+value,
        record : value2,
      })
    }else{
      this.props.dispatch({
        type:'managerSealQuery/'+value,
      })
    }
  }
  getModalDom = () => {
    return (
      <div>
        <Modal
          // title={this.props.confirmeFlag == '1' ? "确认领取" : "确认完成"}
          title = {this.state.title}
          visible={this.props.isConfirmeVisible}
          onOk={() =>this.fileUpload()}
          onCancel={()=>this.setUnVisible("confirmeReceive")}
        >
          {this.getThreeSames()}
          <div style = {{marginBottom: '12px', marginTop: '5px'}}>
            <span>个人信息图片：</span>
            <FileUpload dispatch={this.props.dispatch} sss = '个人信息图片' passFuc = {this.saveData}/>
          </div>
          <div style = {{marginTop: '5px', marginBottom: '8px'}}>
            <span>材料信息图片：</span>
            <FileUpload dispatch={this.props.dispatch} sss = '材料信息图片' passFuc = {this.saveData}/>
          </div>
          <div className={styles.tables}>
            <Table
              columns = {this.filesColumn}
              loading={ this.props.loading }
              dataSource={ this.props.tableUploadFile}
              className={styles.orderTable}
              bordered={true}
              pagination={true}
            />
          </div>
          <div style = {{marginTop: '15px'}}>
            <span>备注：</span>
            <TextArea placeholder="不能超过200字"
            value = {this.props.remarks}
            onChange={this.remarksSave} rows={5} style={{width: '90%', verticalAlign: 'top'}}></TextArea>
          </div>
        </Modal>
      </div>
    )
  }
  columns1 = [
    {
      key: 'key',
			dataIndex: 'key',
			title: '序号'
    },
    {
      key: '',
			dataIndex: 'form_title',
			title: '用印名称'
    },
    {
      key: '',
			dataIndex: 'form_dept_name',
			title: '申请单位'
    },
    {
      key: '',
			dataIndex: 'screate_user_name',
			title: '申请人'
    },
    {
      key: '',
			dataIndex: 'create_date',
			title: '申请时间'
    },
    {
      key: '',
			dataIndex: 'state_desc',
			title: '状态'
    }
  ];
  receiverOrConfirmColumn = [
    {
      key: 'staff_num',
      dataIndex: 'userid',
      title: '员工编号'
    },
    {
      key: 'staff_name',
      dataIndex: 'username',
      title: '姓名'
    },
    {
      key: 'staff_dept',
      dataIndex: 'deptname',
      title: '部门'
    },
  ];
  filesColumn = [
    {
      key: '',
      dataIndex: 'key',
      title: '序号'
    },
    {
      key: '',
      dataIndex: 'upload_name',
      title: '文件名'
    },
    {
      key: '',
      dataIndex: 'upload_decribe',
      title: '文件描述'
    },
    {
      key: '',
      dataIndex: 'opera',
      title: '操作',
      render:(text, record) => {
        return (
          <span style={{whiteSpace: 'nowrap'}}>
            <Button
              type="primary" size="small"
              onClick={(e) => this.downloadUpload(e,record)}>下载</Button> &nbsp;
            <Popconfirm
              title="确定删除?"
              onConfirm={()=>this.returnModel('deleteUpload',record)}
            >
              <Button
                type="primary"
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </span>
        )
      }
    },
  ];
  rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      this.props.dispatch({type: 'managerSealQuery/saveReceiverRows', selectedRows})
    }
  };
  getThreeSames = () => {
    if(this.state.flag == '3') {
      return false
    }
    else {
      return (
        <div style = {{marginBottom: '8px'}}>
          {this.state.flag == '2' ? <span>盖章人：</span> : <span>领取人：</span>}
          <Input style={{width: "60%"}} placeholder="姓名/员工编号/邮箱前缀/手机"
                      value={ this.props.receiverIpt } onChange={this.handlereceiverIptChange}></Input>
          <Button type="primary" onClick={this.receiveOrConfirmeQuery} style={{float: "right"}}>查询</Button>
          <div className={styles.tables} style = {{marginTop: '8px'}}>
            <Table
              columns = {this.receiverOrConfirmColumn}
              dataSource = {this.props.receiverQueryData}
              rowSelection={this.rowSelection}
              className={styles.orderTable}
              bordered={true}
              pagination={true}
              loading={this.props.loading}
            />
          </div>
        </div>
      )
    }
  }
  columns2 = [
    {
      key: 'index',
			dataIndex: 'key',
			title: '序号'
    },
    {
      key: '',
			dataIndex: 'form_title',
			title: '用印名称'
    },
    {
      key: '',
			dataIndex: 'form_dept_name',
			title: '申请单位'
    },
    {
      key: '',
			dataIndex: 'screate_user_name',
			title: '申请人'
    },
    {
      key: '',
			dataIndex: 'create_date',
			title: '申请时间'
    },
    {
      key: 'state',
			dataIndex: 'state_desc',
			title: '状态'
    },
    {
      key: 'opera',
			dataIndex: 'opera',
      title: '操作',
      render: (text, record) => {
        if (record.form_type === '0') {
          if(record.form_check_state === '21') {
            return (
              <span>
                {/* <Button type="primary" size="small" onClick = {(e)=>this.sendEmail(e, record)}>通知</Button> */}
                <Popconfirm
                  title="确定通知?"
                  onConfirm={(e)=>this.sendEmail(e, record)}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick = {(e)=>this.preventDefalut(e)}
                  >
                    通知
                  </Button>
                </Popconfirm>
              </span>
            )
          }else if(record.form_check_state === '24') {
            return (
              <span>
                <Button type="primary" size="small" onClick={(e) => this.setVisible(e, "confirmeFinish", record)}>确认完成</Button> &nbsp;
                <Popconfirm
                  title="确定作废?"
                  onConfirm={(e)=>this.applyAbolish(e, record)}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick = {(e)=>this.preventDefalut(e)}
                  >
                    作废
                  </Button>
                </Popconfirm>
              </span>
            )
          }
        } else if (record.form_type === '1') {
          if(record.form_check_state === '21') {
            return (
              <span>
                <Popconfirm
                  title="确定通知?"
                  onConfirm={(e)=>this.sendEmail(e, record)}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick = {(e)=>this.preventDefalut(e)}
                  >
                    通知
                  </Button>
                </Popconfirm>
              </span>
            )
          }else if (record.form_check_state === '24') {
            return (
              <span>
                <Button type="primary" size="small" onClick={(e) =>this.setVisible(e, "confirmeReceive" ,record)}>确认领取</Button> &nbsp;
                <Popconfirm
                  title="确定作废?"
                  onConfirm={(e)=>this.applyAbolish(e, record)}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick = {(e)=>this.preventDefalut(e)}
                  >
                    作废
                  </Button>
                </Popconfirm> &nbsp;
              </span>
            )
          }else if (record.form_check_state === '25') {
            return (
              <span>
                <Button type="primary" size="small" onClick={(e) => this.setVisible(e, "confirmeReturn", record)}>确认归还</Button>
              </span>
            )
          }
        } else if (record.form_type === '2') {
          if(record.form_check_state === '21') {
            return (
              <span>
                <Popconfirm
                  title="确定通知?"
                  onConfirm={(e)=>this.sendEmail(e, record)}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick = {(e)=>this.preventDefalut(e)}
                  >
                    通知
                  </Button>
                </Popconfirm>
              </span>
            )
          }else if (record.form_check_state === '24') {
            return (
              <span>
                <Button type="primary" size="small" onClick={(e) =>this.setVisible(e, "confirmeReceive" ,record)}>确认领取</Button> &nbsp; 
                  <Button
                    type="primary"
                    size="small"
                    onClick = {(e)=>this.preventDefalut(e)}
                  >
                    作废
                  </Button>
              </span>
            )
          }
        }
      }
    },
  ];
  // 保存类型值和对应id值
  saveTypes = (value) => {
    this.props.dispatch({
      type: 'managerSealQuery/saveTypes',
      value
    })
  }
  // 保存状态值和对应id值
  saveState = (value) => {
    this.props.dispatch({
      type: 'managerSealQuery/saveState',
      value
    })
  }
  // 保存状态值和对应id值
  saveSealType = (value) => {
    this.props.dispatch({
      type: 'managerSealQuery/saveSealType',
      value
    })
  }
  // 保存章照名称
  saveName = (value) => {
    this.props.dispatch({
      type: 'managerSealQuery/saveName',
      value
    })
  }
  handleApplyPersonChange = (e) => {
    this.props.dispatch({
      type: 'managerSealQuery/handleApplyPersonChange',
      value: e.target.value
    })
  }
  handlereceiverIptChange = (e) => {
    this.props.dispatch({
      type: 'managerSealQuery/handlereceiverIptChange',
      value: e.target.value
    })
  }
  // 备注
  remarksSave = (e) => {
    let value1 = e.target.value;
    if(value1.length >= 200){
      value1 = value1.substring(0,200)
    }
    this.props.dispatch({
      type: 'managerSealQuery/remarksSave',
      value: value1
    })
  }
// 点击清空查询条件
emptyQuery = () => {
  this.props.dispatch({
    type: 'managerSealQuery/emptyQuery',
  })
}
// 点击查询
managerQuery = () => {
  const {tabKey} = this.props;
  if(tabKey == '1') {
    this.props.dispatch({
      type: 'managerSealQuery/firstPage',
      clickQueryPageCurrent: 1
    })
  }else if (tabKey == '2') {
    this.props.dispatch({
      type: 'managerSealQuery/secondPage',
      clickQueryPageCurrent : 1
    })
  }
}
  //根据当前搜索的条件，查询完后再导出
  exportExcel = () => {
    const {processTab, checkingTab, tabKey} = this.props;
    let condition = {};
    let name;
    if(tabKey == '1') {
      condition = {
        "用印名称": "form_title",
        "申请单位": "form_dept_name",
        "申请人": "screate_user_name",
        "申请时间": "create_date",
        "状态": "state_desc"
      }
      name = "流程中"
      if(processTab.length > 0) {
        exportExcel(processTab, name, condition)
      }else {
        message.info("无数据")
      }
    }else if(tabKey == '2') {
      condition = {
        "用印名称": "form_title",
        "申请单位": "form_dept_name",
        "申请人": "screate_user_name",
        "申请时间": "create_date",
        "状态": "state_desc"
      }
      name = "已核定"
      if(checkingTab.length > 0) {
        exportExcel(checkingTab, name, condition)
      }else {
        message.info("无数据")
      }
    }
  }
  // 批量下载
  batchDownload = () => {
    this.props.dispatch({
      type: 'managerSealQuery/batchDownload'
    })
  }
  // 改变页码
  changePage = (page) => {
    this.props.dispatch({type: 'managerSealQuery/savePage', page})
  }
	rowClick = (record) => {
    let pathName = '/adminApp/sealManage/managerSealQuery/sealLeaderDetail';
    if(record.form_title.indexOf('院领导名章使用') > -1) {
      pathName = '/adminApp/sealManage/managerSealQuery/sealLeaderDetail'
    } else if(record.form_title.indexOf('营业执照外借') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/borrowBusinessDetail';
    } else if(record.form_title.indexOf('院领导身份证') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/leaderIDDetail';
    } else if(record.form_title.indexOf('院领导名章外借') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/borrowLeaderDetail'
    } else if(record.form_title.indexOf('印章外借') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/borrowSealDetail'
    } else if(record.form_title.indexOf('刻章申请') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/markSealDetail'
    } else if(record.form_title.indexOf('营业执照复印件使用') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/businessLicenseDetail'
    } else if(record.form_title.indexOf('印章使用') > -1) {
			pathName = '/adminApp/sealManage/managerSealQuery/sealComDetail'
    }
		this.props.dispatch(routerRedux.push({
			pathname: pathName,
			query:  {
				record: JSON.stringify(record)
			}
		}))
	}
  render() {
    let {stateList, nameList, nameList2, stateList2, typesList, typeList, typeList2, applyPerson, processTab, checkingTab} = this.props;
    const { RangePicker} = DatePicker;
    const { Option } = Select;
    const currentTime = this.getCurrentTime();
    nameList.length == 0 ? null : (nameList = [{sealUuid: "0", sealName: "全部"}, ...nameList]);
    nameList2.length == 0 ? null : (nameList2 = [{sealUuid: "0", sealName: "全部"}, ...nameList2]);
    typeList.length == 0 ? null : (typeList = [{sealUuid: "0", sealName: "全部"}, ...typeList])
    typeList2.length == 0 ? null : (typeList2 = [{sealUuid: "0", sealName: "全部"}, ...typeList2])
    const getSimpleDom = () => {
      return (
        <div style={{marginBottom:"15px"}}>
          <Row style = {{lineHeight: '30px'}}>
            <Col span={3} style = {{textAlign: "right"}}><span>申请日期：</span></Col>
            <Col span={5}>
              <RangePicker
                value={
                this.props.startTime===''
                || this.props.endTime===''
                ? null : [moment(this.props.startTime, dateFormat), moment(this.props.endTime, dateFormat)]}
                format={dateFormat}
                style={{ width: "100%" }}
                placeholder={[currentTime,currentTime]} // 默认显示的时间范围
                onChange={this.saveSelectTime}/>
            </Col>
            <Col span={2} style = {{textAlign: "right"}}><span>类型：</span></Col>
            <Col span={4}>
              <Select
                value = {this.props.types}
                style = {{ width: "100%" }}
                onChange = {this.saveTypes}
                >
                  {
                    typesList.length === 0 ? ''
                    : typesList.map((item, index) => (
                        <Option key={item.id+index} value={`${item.id}#${item.typesName}`}>{item.typesName}</Option>
                    ))
                  }
              </Select>
            </Col>
            <Col span={3} style = {{textAlign: "right"}}><span>印章证照类别：</span></Col>
            <Col span={5}>
              <Select
                mode="multiple"
                value = {this.props.queryType}
                style = {{ width: "100%" }}
                onChange = {this.saveSealType}
                placeholder = "请选择"
                >
                  {
                    typeList.length === 0 ? []
                    : typeList.map((item, index) => (
                      <Option key={item.typeId+index} value={`${item.sealUuid}#${item.sealName}`}>{item.sealName}</Option>
                    ))
                  }
              </Select>
            </Col>
          </Row>
          <Row style = {{lineHeight: "30px", marginTop: "10px"}}>
            <Col span={3} style = {{textAlign: "right"}}><span>印章证照名称：</span></Col>
            <Col span={5}>
              <Select mode="multiple"
                value = {this.props.queryName}
                style = {{ width: "100%" }}
                onChange = {this.saveName}
                placeholder = "请选择"
              >
                {
                  nameList.length === 0 ? []
                  : nameList.map((item, index) => (
                    <Option key={item.sealUuid+index} value={`${item.sealUuid}#${item.sealName}`}>{item.sealName}</Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={2} style = {{textAlign: "right"}}><span>申请人：</span></Col>
            <Col span={4}>
              <Input  value={applyPerson} placeholder="请输入"
                style = {{ width: "100%" }}  onChange={this.handleApplyPersonChange}/>
            </Col>
            <Col span={3} style = {{textAlign: "right"}}><span>状态：</span></Col>
            <Col span={5}>
              <Select
                value = {this.props.state}
                defaultValue="0#全部"
                style = {{ width: "100%" }}
                onChange = {this.saveState}
              >
                {
                  stateList.length === 0 ? ''
                  : stateList.map((item, index) => (
                      <Option key={item.id+index} value={`${item.id}#${item.stateName}`}>{item.stateName}</Option>
                  ))
                }
              </Select>
            </Col>
          </Row>
          <div className={styles.three}>
            <span className={styles.threeBtn}>
              <Button type="primary" onClick={this.managerQuery}>查询</Button> &nbsp;&nbsp;
              <Button type="primary" onClick={this.emptyQuery}>清空</Button> &nbsp;&nbsp;
              <Button type="primary" onClick = {()=>this.exportExcel()}>{'导出'}</Button>
            </span>
          </div>
        </div>
      )
    }
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
            <Tabs defaultActiveKey={"1"} onChange={this.changeTabs}>
              <TabPane tab="流程中" key="1">
                { getSimpleDom() }
                <div className={styles.tables}>
                  <Table
                    columns = {this.columns1}
                    dataSource = {processTab}
                    className={styles.orderTable}
                    bordered={true}
                    onRowClick = {(e) => this.rowClick(e)}
                    pagination = {false}
                    loading={this.props.loading}
                  />
                  <Pagination
                    current = {this.props.pageCurrent}
                    pageSize = {this.props.pageSize}
                    total = {this.props.totalData}
                    onChange = {this.changePage}
                    style = {{textAlign: 'center', marginTop: '20px'}}
                  />
                </div>
              </TabPane>
              <TabPane tab="已核定" key="2">
                <Row style = {{lineHeight: "30px"}}>
                  <Col span={3} style = {{textAlign: "right"}}><span>申请日期：</span></Col>
                  <Col span={5}>
                    <RangePicker
                      value={
                      this.props.startTime2===''
                      || this.props.endTime2===''
                      ? null : [moment(this.props.startTime2, dateFormat), moment(this.props.endTime2, dateFormat)]}
                      format={dateFormat}
                      style={{ width: "100%" }}
                      placeholder={[currentTime,currentTime]} // 默认显示的时间范围
                      onChange={this.saveSelectTime}/>
                  </Col>
                  <Col span={2} style = {{textAlign: "right"}}><span>类型：</span></Col>
                  <Col span={4}>
                    <Select
                      value = {this.props.types2}
                      style={{ width: "100%" }}
                      onChange = {this.saveTypes}
                      >
                        {
                          typesList.length === 0 ? ''
                          : typesList.map((item, index) => (
                              <Option key={item.id+index} value={`${item.id}#${item.typesName}`}>{item.typesName}</Option>
                          ))
                        }
                    </Select>
                  </Col>
                  <Col span={3} style = {{textAlign: "right"}}><span>印章证照类别：</span></Col>
                  <Col span={5}>
                    <Select
                      mode="multiple"
                      value = {this.props.queryType2}
                      style={{ width: "100%" }}
                      onChange = {this.saveSealType}
                      placeholder = {"请选择"}>
                        {
                          typeList2.length === 0 ? []
                          : typeList2.map((item, index) => (
                            <Option key={item.sealUuid+index} value={`${item.sealUuid}#${item.sealName}`}>{item.sealName}</Option>
                          ))
                        }
                    </Select>
                  </Col>
                </Row>
                <Row style = {{lineHeight: "30px", marginTop: '10px'}}>
                  <Col span={3} style = {{textAlign: "right"}}><span>印章证照名称：</span></Col>
                  <Col span={5}>
                    <Select mode="multiple"
                      value = {this.props.queryName2}
                      // defaultValue="1#印章证照名称1"
                      style = {{ width: "100%" }}
                      onChange = {this.saveName}
                      placeholder = {"请选择"}
                    >
                      {
                        nameList2.length === 0 ? []
                        : nameList2.map((item, index) => (
                          <Option key={item.sealUuid+index} value={`${item.sealUuid}#${item.sealName}`}>{item.sealName}</Option>
                        ))
                      }
                    </Select>
                  </Col>
                  <Col span={2} style = {{textAlign: "right"}}><span>申请人：</span></Col>
                  <Col span={4}>
                    <Input value={ this.props.applyPerson2 } style={{ width: "100%" }} onChange={this.handleApplyPersonChange}/>
                  </Col>
                  <Col span={3} style = {{textAlign: "right"}}><span>状态：</span></Col>
                  <Col span={5}>
                    <Select
                      value = {this.props.state2}
                      defaultValue="0#全部"
                      style = {{ width: "100%" }}
                      onChange = {this.saveState}
                    >
                      {
                        stateList2.length === 0 ? ''
                        : stateList2.map((item, index) => (
                            <Option key={item.id+index} value={`${item.id}#${item.stateName}`}>{item.stateName}</Option>
                        ))
                      }
                    </Select>
                  </Col>
                </Row>
                <div className={styles.three}>
                  <span className={styles.threeBtn}>
                    <Button type="primary" onClick={this.managerQuery}>查询</Button> &nbsp;&nbsp;
                    <Button type="primary" onClick={this.emptyQuery}>清空</Button> &nbsp;&nbsp;
                    <Button type="primary" onClick = {()=>this.exportExcel(this.columns1)}>{'导出'}</Button>
                  </span>
                </div>
                <div style={{height: "28px", width: '100%', clear: "both", marginTop: '10px', marginBottom: '15px'}}>
                  <Button type="primary" style={{float: "right"}} onClick = {this.batchDownload}>批量下载</Button>
                </div>
                <div className={styles.tables}>
                  <Table
                    columns = {this.columns2}
                    dataSource = {checkingTab}
                    className={styles.orderTable}
                    bordered={true}
                    pagination={false}
                    onRowClick = {this.rowClick}
                    loading={this.props.loading}
                  />
                  <Pagination
                    current = {this.props.pageCurrent2}
                    pageSize = {this.props.pageSize}
                    total = {this.props.totalData2}
                    onChange = {this.changePage}
                    style = {{textAlign: 'center', marginTop: '20px'}}
                  />
                  {this.getModalDom()}
                </div>
              </TabPane>
            </Tabs>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.managerSealQuery, // managerSealQuery命名空间下的state数据
    ...state.managerSealQuery
  };
}
export default connect(mapStateToProps)(ManagerSealQuery);
