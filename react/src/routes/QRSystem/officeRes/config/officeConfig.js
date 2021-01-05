/**
  * 作者： 卢美娟
  * 创建日期： 2018-12-11
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 办公资源-配置
  */

import React from 'react';
import { connect } from 'dva';
import { Table, Row, Col, message, Tag, Input, Tooltip, Card, Spin, Modal, Button, Icon, Popconfirm, Radio, Form, Select, Upload} from 'antd';
import moment from 'moment';;
const { TextArea } = Input
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './../officeRes.less';
import SeatModal from './seatNumModal.js'
import { getUuid } from './../../../../components/commonApp/commonAppConst.js'
import FileUpload from './import.js';
const Search = Input.Search;
const FormItem = Form.Item;
const { confirm } =Modal;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

class officeConfig extends React.Component{

  state = {
    visible: false,
    detailsVisible: false,
    blackVisible: false,
    operationFlag: 'add', //add-添加； edit-修改
    allotRecord: '',
    showData: [],
    formData: [],
    editFormData: [],
    editVisible: false,
    blackReason: "",
    blackRowData: {},
    realRecord:{},
    realIndex:0,
    destroy: true,
    dangerColor: "",
    dataFlag: "",
    disabled: false,
    uuid: ""
  };

  deleteConfirm = (allotId) => {
    const {dispatch} = this.props;
    var data = {
      argAllotId: allotId,
    };
    dispatch({
      type:'officeConfig/deleteStationAllot',
      data,
    });
  };
  realDataClick = (record,index,event) => {
    this.setState({
      realRowIndex: index
    });
  };
  showModalDetail = (record) => {
    this.setState({
      detailsVisible: true,
      formData:[{
        bTitle: "单位名称",
        key: "vendor_name",
        bValue:record.vendor_name,
        eTitle: "负责人",
        eKey: "vendor_principal",
        eValue: record.vendor_principal
      },{
        bTitle: "负责人电话",
        key: "vendor_principal_phone",
        bValue:record.vendor_principal_phone,
        eTitle: "项目组名称",
        eKey: "project_name",
        eValue: record.project_name 
      },{
        bTitle: "项目组编号",
        key: "project_code",
        bValue:record.project_code,
        eTitle: "项目所属部门",
        eKey: "project_dept",
        eValue: record.project_dept 
      },{
        bTitle: "项目经理/负责人",
        key: "project_principal",
        bValue:record.project_principal,
        eTitle: "项目负责人电话",
        eKey: "project_principal_phone",
        eValue: record.project_principal_phone 
      },{
        bTitle: "性质",
        key: "staff_nature",
        bValue:record.staff_nature,
        eTitle: "姓名",
        eKey: "staff_name",
        eValue: record.staff_name 
      },{
        bTitle: "身份证号",
        key: "staff_idnumber",
        bValue:record.staff_idnumber,
        eTitle: "联系电话",
        eKey: "staff_phone",
        eValue: record.staff_phone 
      }]
    });
  };
  showBlackModal = (record, inndex) => {
    this.setState({
      blackVisible: true,
      blackRowData:record,
      uuid: getUuid(20,62)
    }); 
  };
  //生成查看的数据
  createModalData = (list) => {
    return list.map((v,i) => (
          <Row className = {styles.rowStyle} key = {i}>
            <Col span = {5} className = {styles.titlStyle} key="bTitle">{v.bTitle}：</Col>
            <Col span = {5} className = {styles.valueStyle} key="bValue">{v.bValue}</Col>
            <Col span = {6} className = {styles.titlStyle} key="eTitle">{v.eTitle}：</Col>
            <Col span = {8} className = {styles.valueStyle} key="eValue">{v.eValue}</Col>
          </Row>
    ));
  };
  editData = (list) => {
    const {getFieldDecorator} = this.props.form;
    return list.map((v,i) => {
      if(this.state.dataFlag == "base"){
        return (
            <Row className = {styles.rowStyle} key = {i}>
              <Col span = {12}>
                <FormItem label = {v.bTitle} {...formItemLayout}>
                  {getFieldDecorator(v.key,{
                    rules: [{required:false}],
                    initialValue:v.bValue
                  })(
                    <Input disabled = {v.bTitle == "性质" ? true : false}/>
                  )}
                </FormItem>
              </Col>
              <Col span = {12}>
                <FormItem label = {v.eTitle} {...formItemLayout}>
                  {getFieldDecorator(v.eKey,{
                    rules: [{required:false}],
                    initialValue:v.eValue
                  })(
                    <Input disabled = {v.eTitle == "项目所属部门" ? true : false}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          );
      } else {
        return (
            <Row className = {styles.rowStyle} key = {i}>
              <Col span = {12}>
                <FormItem label = {v.bTitle} {...formItemLayout}>
                  {getFieldDecorator(v.key,{
                    rules: [{required:false}],
                    initialValue:v.bValue
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span = {12}>
                <FormItem label = {v.eTitle} {...formItemLayout}>
                  {getFieldDecorator(v.eKey,{
                    rules: [{required:false}],
                    initialValue:v.eValue
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
          );
      };
    });
  };
  //导入数据删除
  deleteData = (index) => {
    const {dispatch} = this.props;
    const data = index;
    confirm({
      title: '是否确定删除',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch ({
          type:"officeConfig/deleteData",
          data,
        })
      },
      onCancel () {},
    });
  };
  //删除
  deleteRealData = (record,index) => {
    const { dispatch } =this.props;
    confirm({
      title:"是否确定删除",
      okText:"确认",
      cancelText: "取消",
      onOk: () => {
        dispatch({
          type: 'officeConfig/removeExternalResource',
          data: {
            arg_ids: record.id
          }
        }); 
      },
      onCancel() {}
    });
  };
  //编辑
  edit = (record,index,source) => { 
    if(source == "local"){
      this.setState({
        dataFlag:"local"
      });
    } else {
      this.setState({
        dataFlag:"base"
      });
    };
    this.setState({
      realIndex:index,
      realRecord:record,
      editVisible: true,
      destroy: false,
      editFormData:[{
        bTitle:"单位名称",
        key:"vendor_name",
        bValue:record.vendor_name,
        eTitle:"负责人",
        eKey:"vendor_principal",
        eValue:record.vendor_principal
      },{
        bTitle:"负责人电话",
        key:"vendor_principal_phone",
        bValue:record.project_principal_phone,
        eTitle:"项目组名称",
        eKey:"project_name",
        eValue:record.project_name
      },{
        bTitle:"项目组编号",
        key:"project_code",
        bValue:record.project_code,
        eTitle:"项目所属部门",
        eKey:"project_dept",
        eValue:record.project_dept
      },{
        bTitle:"项目经理/负责人",
        key:"project_principal",
        bValue:record.project_principal,
        eTitle:"项目负责人电话",
        eKey:"project_principal_phone",
        eValue:record.project_principal_phone
      },{
        bTitle:"性质",
        key:"staff_nature",
        bValue:record.staff_nature,
        eTitle:"姓名",
        eKey:"staff_name",
        eValue:record.staff_name
      },{
        bTitle:"身份证号",
        key:"staff_idnumber",
        bValue:record.staff_idnumber,
        eTitle:"联系电话",
        eKey:"staff_phone",
        eValue:record.staff_phone
      }]
    });
  };

  editAllot = (record) => {
    this.setState({
      visible: true,
      operationFlag: 'edit',
      allotRecord: record,
    });
  };

  showOperation = (record) => {
    return(
      <div>
        <Tooltip title = '修改'><Icon type = 'edit' onClick = {()=>this.editAllot(record)}/></Tooltip>&nbsp;&nbsp;
        <Tooltip title = '删除'>
          <Popconfirm title="您确定要删除此条配置？" onConfirm={()=>this.deleteConfirm(record.allot_id)} okText="Yes" cancelText="No">
          <Icon type = 'delete'/>
          </Popconfirm>
        </Tooltip>
      </div>
    );
  };

  showModal = () => {
    this.setState({visible: true, operationFlag: 'add',allotRecord:''})
  };

  handleOk = (allotId,values) => {
    if(this.state.operationFlag == 'add'){
      if(!values.applyStaff&&(!values.applyStaff1)){
          message.info('请选择申请人');
          return 0;
      };
      if(!values.applyStaff){
        if(values.applyStaff1){
          if(values.applyStaff1.length == 0){
            message.info('请选择申请人');
            return 0;
          };
        };
      };
    };

    if(!values.applyNum){
      message.info('请填写申请工位数');
      return 0;
    };
    this.setState({visible: false})
    const {dispatch} = this.props;
    var data = {};
    if(this.state.operationFlag == 'add'){
       data = {
        argUserId: values.applyStaff?values.applyStaff.userid:values.applyStaff1[2],
        argUserType: values.applyStaff?0:1, //内部人员
        argStationAmount: values.applyNum,
        argApplyReason: values.applyReason,
      };
      dispatch({
        type:'officeConfig/addStationAllot',
        data,
      });
    }else if(this.state.operationFlag == 'edit'){
      data = {
        argAllotId: allotId,
        argStationAmount: values.applyNum,
        argApplyReason: values.applyReason,
      };
      dispatch({
        type:'officeConfig/editStationAllot',
        data,
      });
    };
    return 1;
  }

  handleCancel = () => {
    this.setState({visible: false});
  };
  changeOpt = (e) => {
    const { dispatch } = this.props;
    const data = e.target.value;
    dispatch({
      type: 'officeConfig/setFlag',
      data
    });
  };
  detailHandleOk = e => {
    this.setState({
      detailsVisible:false
    });
  };
  detailHandleCancel = e => {
    this.setState({
      detailsVisible:false
    });
  }; 
  //点击确定调用服务添加如黑名单
  blackHandleOk = e => {
    const { dispatch } = this.props;
    const {blackReason, blackRowData} = this.state;
    const regBlank = new RegExp(/^\s+$/);
    if(blackReason == "" || regBlank.test(blackReason)) {
      message.error("请输入加入黑名单原因");
      this.setState({
        dangerColor: "red"
      });
      return;
    } else {
      this.setState({
        dangerColor: ""
      });
    };
    const data = {
      arg_user_id: blackRowData.staff_idnumber,
			arg_user_name: blackRowData.staff_name,
      arg_dept_name: blackRowData.project_dept.split("-")[1],
      arg_user_type: "流动人员",
      arg_dept_id: blackRowData.project_dept_id,
			arg_reason: blackReason
    };
    dispatch({
      type: 'officeConfig/addBlackList',
      data
    });
    this.setState({
      blackVisible: false
    });
  };
  //点击取消
  blackHandleCancel = e => {
    this.setState({
      blackVisible: false,
      dangerColor: ""
    });
  };
  //根据条件修改本地或者数据库数据
  editHandleOk = (record,index,source,e) => {
    const {dispatch, form} = this.props;
    const FieldsValue = form.getFieldsValue();
    if(source == "local"){
      const { dispatch } = this.props;
      const data = {
        index:index,
        FieldsValue:FieldsValue
      };
      dispatch({
        type:"officeConfig/modifyInformation",
        data
      });
    } else {
        const data = {
          arg_id:record.id,
          staff_name:FieldsValue.staff_name,
          staff_phone:FieldsValue.staff_phone,
          project_name:FieldsValue.project_name,
          project_code:FieldsValue.project_code,
          project_dept:FieldsValue.project_dept,
          project_principal:FieldsValue.project_principal,
          project_principal_phone:FieldsValue.project_principal_phone,
          vendor_name:FieldsValue.vendor_name,
          vendor_principal:FieldsValue.vendor_principal,
          vendor_principal_phone:FieldsValue.vendor_principal_phone,
          staff_idnumber:FieldsValue.staff_idnumber,
        };
        dispatch({
          type:"officeConfig/reviseExternalResource",
          data
        });  
    };
    this.setState({
      editVisible: false,
      destroy: true,
    });
  };

  //取消
  editHandleCancel = e => {
    this.setState({
      editVisible: false
    });
  };

  goBackEdit = e => {
    this.setState({
      editVisible: false,
      destroy: true
    });
  };

  saveData = (values) => {
    this.setState({
      showData:values,
      importDataLength:values.length,
    });
  };
  //填写加入黑名单的原因
  saveInput = (e) => {
    this.setState({
      blackReason: e.target.value
    });
  };
  //清空预览表格数据
  clearData = () => {
    const { dispatch } = this.props;
    confirm({
      title: '是否确定清空所有数据',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: "officeConfig/clearFlowStaff"
        });
      },
      onCancel: () => {}
    }); 
  };
  goBack = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain',
    }));
  };
  goBackConfig = () => {
    this.setState({
      detailsVisible:false,
    });
  };
  //提交导入数据
  vendorAdd = (dataList) => {
    if(dataList == ''||dataList == undefined || dataList == null){
      message.info("提交的信息不能为空！");
      return;
    };
    const {dispatch } = this.props;
    dispatch({
      type:'officeConfig/importExternalResource',
      dataList,
    });
  };
  //跳转到黑名单页面
  gotoblackList = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain/officeConfig/blackList',
    }));
  };
  //判断登陆人员显示不同的tab
  getUserlist = () => {
    const { flag, userlist } = this.props;
    var seatFlag = flag || 'seat';
    var externalFlag = flag || 'external';
    if(userlist == '2') {
      return (
      <div style = {{marginLeft: 40,marginTop:20}}>
        <Radio.Group 
          defaultValue= {seatFlag} 
          // defaultValue= 'seat' 
          onChange = {this.changeOpt}
        >
          <Radio.Button value="seat">可使用工位数配置</Radio.Button>
          <Radio.Button value="external">外部人员配置</Radio.Button>
          <Button type="primary" value="blacklist" style = {{marginLeft:11}} onClick={this.gotoblackList}>黑名单</Button>
        </Radio.Group>
      </div>
      );
    } else if(userlist == '3' || userlist == '4'){
      return (
        <div style = {{marginLeft: 40,marginTop:20}}>
          <Radio.Group 
            defaultValue= {externalFlag}
            // defaultValue= 'external' 
            onChange = {this.changeOpt}
          >
            <Radio.Button value="external">外部人员配置</Radio.Button>
          </Radio.Group>
        </div>
        );
    } else {
      return null;
    };
  };

  render(){
    //流动人员数据
    const upLoad = {
      name: "file",
      action: "/assetsmanageservice/assetsmanage/assets/externalStaffImport",
      multiple: false,
      method: "POST",
      data: 
      {},
      accept : '.xlsx,.xls',
      showUploadList: false,
      onChange: (info) => {
        if(info.file.status === 'done') {
          if(info.file.response.RetCode === "1") {
            message.info("导入成功！");
            const {dispatch} = this.props;
            dispatch({
              type:"officeConfig/saveExternalInformation",
              data: info.file.response.staffInfoList
            });
          } else {
            message.info("导入失败")
          };
        };
      }
    };
    const { stationAllotArr } = this.props;
    const columns = [
        {
          title: '员工类型',
          dataIndex: 'user_type',
          key: 'user_type',
          render:(text)=>{
            if(text == '0')return <div>内部员工</div>
            else if(text == '1') return <div>外部员工</div>
          },
          width:100,
        },
        {
          title: '部门名称',
          dataIndex: 'dept_name',
          key: 'dept_name',
          width:200,
        },
        {
          title: '厂商名称',
          dataIndex: 'vendor_name',
          key: 'vendor_name',
          width:100,
        },
        {
          title: '员工姓名',
          dataIndex: 'user_name',
          key: 'user_name',
          width:100,
        },
        {
          title: '可使用工位数',
          dataIndex: 'station_amount',
          key: 'station_amount',
          width:100,
        },
        {
          title: '申请原因',
          dataIndex: 'apply_reason',
          width:150,
          key: 'apply_reason',
        },
        {
          title: '申请时间',
          dataIndex: 'create_date',
          width:150,
          key: 'create_date',
          render:(text)=>{
            return <div>{text?text.split('.')[0]:''}</div>
          },
        },
        {
          title: '操作',
          width:100,
          render:(record) => this.showOperation(record)
        }];
    const localColumns = [
      {
        title: '单位名称',
        dataIndex: 'vendor_name',
        key: 'vendor_name',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '负责人',
        dataIndex: 'vendor_principal',
        key: 'vendor_principal',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      }, {
        title: '负责人电话',
        dataIndex: 'vendor_principal_phone',
        key: 'vendor_principal_phone',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      }, {
        title: '项目组名称',
        dataIndex: 'project_name',
        key: 'project_name',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      }, {
        title: '项目组编号',
        dataIndex: 'project_code',
        key: 'project_code',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      }, {
        title: '项目所属部门',
        dataIndex: 'project_dept',
        key: 'project_dept',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '项目经理/负责人',
        dataIndex: 'project_principal',
        key: 'project_principal',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      }, {
        title: '项目负责人电话',
        dataIndex: 'project_principal_phone',
        key: 'project_principal_phone',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '性质',
        dataIndex: 'staff_nature',
        key: 'staff_nature',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '姓名',
        dataIndex: 'staff_name',
        key: 'staff_name',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '身份证号',
        dataIndex: 'staff_idnumber',
        key: 'staff_idnumber',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '联系电话',
        dataIndex: 'staff_phone',
        key: 'staff_phone',
        render:(text)=>{
          return(
            <div>{text}</div>
          );
        },
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record,index) => {
          return(
            <div className = {styles.editStyle}>
              <a href="javascript:;" onClick={() => this.showModalDetail(record)}>查看</a>&nbsp;&nbsp;
              <a href="javascript:;" onClick={() => this.edit(record,index,"local")}>编辑</a>&nbsp;&nbsp;
              <a href="javascript:;" onClick={() => this.deleteData(index)}>删除</a>
            </div>
          );
        }
      }];
    const baseColumns = [
        {
          title: '单位名称',
          dataIndex: 'vendor_name',
          key: 'vendor_name',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '负责人',
          dataIndex: 'vendor_principal',
          key: 'vendor_principal',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        }, {
          title: '负责人电话',
          dataIndex: 'vendor_principal_phone',
          key: 'vendor_principal_phone',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        }, {
          title: '项目组名称',
          dataIndex: 'project_name',
          key: 'project_name',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        }, {
          title: '项目组编号',
          dataIndex: 'project_code',
          key: 'project_code',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        }, {
          title: '项目所属部门',
          dataIndex: 'project_dept',
          key: 'project_dept',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '项目经理/负责人',
          dataIndex: 'project_principal',
          key: 'project_principal',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        }, {
          title: '项目负责人电话',
          dataIndex: 'project_principal_phone',
          key: 'project_principal_phone',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '性质',
          dataIndex: 'staff_nature',
          key: 'staff_nature',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '姓名',
          dataIndex: 'staff_name',
          key: 'staff_name',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '身份证号',
          dataIndex: 'staff_idnumber',
          key: 'staff_idnumber',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '联系电话',
          dataIndex: 'staff_phone',
          key: 'staff_phone',
          render:(text)=>{
            return(
              <div>{text}</div>
            );
          },
        },{
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record,index) => {
            return this.props.userlist == '2' ?
            (
              <div className = {styles.editStyle}>
                <a href="javascript:;" onClick={() => this.deleteRealData(record, index)}>删除</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={() => this.edit(record, index,"base")}>编辑</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={() => this.showBlackModal(record,index)}>加入黑名单</a>
              </div>
            )
            :
            (
              <div className = {styles.editStyle}>
                <a href="javascript:;" onClick={() => this.deleteRealData(record, index)}>删除</a>&nbsp;&nbsp;
                <a href="javascript:;" onClick={() => this.edit(record, index,"base")}>编辑</a>&nbsp;&nbsp;
              </div>
            )
          }
      }];  
    return(
      <div className = {styles.pageContainer1}>
          <h2 style = {{textAlign:'center'}}>配置</h2>
          <Button onClick = {this.goBack} style = {{float:'right',marginRight:40}}>返回</Button>
          {this.getUserlist()}
          {this.props.flag == 'seat' ?
            <div>
                <div style = {{padding:40}}>
                  <Table 
                    columns={columns} 
                    dataSource={stationAllotArr} 
                    className={styles.orderTable}
                    loading = {this.props.loading}
                  />
                </div>
                <div style = {{marginTop:40,textAlign:'center'}}>
                  <Button type='primary' onClick = {this.showModal}>添加</Button>
                </div>
                <SeatModal 
                  visible = {this.state.visible} 
                  okClick = {this.handleOk} 
                  cancelClick = {this.handleCancel}
                  allotRecord = {this.state.allotRecord} 
                  operationFlag = {this.state.operationFlag} 
                  externalList = {this.props.externalList}
                />
            </div>
            :
            <div>
                <Button 
                  value="batch_deletion" 
                  type="primary" 
                  style = {{marginLeft:40, marginTop:30}} 
                  onClick = {this.clearData} >
                  批量删除
                </Button>
                <Button 
                  value="batch_deletion" 
                  type="primary" 
                  style = {{marginLeft:20, marginTop:30}} 
                  onClick = {()=>this.vendorAdd(this.props.postFlowStaffList)}>
                  提交
                </Button>
                <div style = {{float:'right', marginRight:40, marginTop:20}}>
                  <Upload {...upLoad} style = {{marginLeft:20, marginTop:30}}>
                    <Button type= "primary" >
                    导入
                    </Button>
                  </Upload>
                </div>
              <a href="/filemanage/download/assetstemplate/外部人员导入模板.xlsx">
                <Button style = {{float:'right', marginRight:10, marginTop:20}} onClick = {this.goAddPage}><Icon type = 'download'/>模板下载</Button>
              </a>
              <div style = {{padding:'10px  40px 0 40px'}}>
                <Table 
                  bordered columns = {localColumns} 
                  dataSource = {this.props.postFlowStaffList} 
                  className={styles.orderTable} 
                  loading = {this.props.loading}
                />
                <div className = {styles.personnellist}>已有外部人员列表：
                  <span style = {{color:"#FA7252",marginLeft:"30px"}}>共有工位：{this.props.all_assets_num}个,</span>
                  <span style = {{color:"#FA7252"}}>已分配工位：{this.props.using_assets_num}个</span>
                </div>
                <Table 
                  bordered columns = {baseColumns} 
                  dataSource = {this.props.externalresource} 
                  className={styles.orderTable} 
                  onRowClick={this.realDataClick}
                  loading = {this.props.loading}
                />
              </div>
            </div>
         }
         {/* 查看模态框 */}
          <Modal
            visible = {this.state.detailsVisible}
            onOk = {this.detailHandleOk}
            onCancel = {this.detailHandleCancel}
            // className = {styles.detailContent}
            closable = {false}
            footer = {null}
            width = "780px"
            bodyStyle = {{padding:40}}
          >
          <div>
            <h2 style = {{textAlign:'center'}}>人员详情表</h2>
            <div style = {{overflow:'hidden'}}>
              <Button type = "primary" className = {styles.btnStyle} onClick = {this.goBackConfig}>返回</Button>
            </div>
            {this.createModalData(this.state.formData)}
          </div>
          </Modal>
          <Modal
            visible = {this.state.blackVisible} 
            title = {"加入黑名单原因"}
            onOk = {this.blackHandleOk}
            onCancel = {this.blackHandleCancel}
            key = {this.state.uuid}
          >
            {/* 黑名单模态框 */}
            <TextArea style={{width: "400px",borderColor:this.state.dangerColor}}   rows={4} onChange = {this.saveInput}/>
          </Modal>

         {/* 编辑模态框 */}
         {
            this.state.destroy 
            ? ''
            :
            <Modal
              visible = {this.state.editVisible}
              onOk = {() => this.editHandleOk(this.state.dataFlag)}
              onCancel = {this.editHandleCancel}
              // className = {styles.detailContent}
              closable = {false}
              width = "780px"
              footer = {false}
              bodyStyle = {{padding:40}}
            >
              <Form>
                <h2 style = {{textAlign:'center'}}>人员详情表</h2>
                <div style ={{overflow:'hidden'}}>
                  <Button 
                    type = "primary" 
                    className = {styles.btnStyle}
                    onClick = {()=>this.editHandleOk(this.state.realRecord,this.state.realIndex,this.state.dataFlag)}
                  >
                    保存
                  </Button>
                  <Button type = "primary" className = {styles.btnStyle} onClick = {this.goBackEdit}>返回</Button>
                </div>
                {this.editData(this.state.editFormData)}
              </Form>
          </Modal>
         }
      </div>
    );
  };
};
const OfficeConfig = Form.create()(officeConfig);
function mapStateToProps (state) {
  // const {query,stationAllotArr,externalList,staffInfoList,externalresource,userlist,all_assets_num, using_assets_num} = state.officeConfig;  //lumj
  return {
    loading: state.loading.models.officeConfig,
    ...state.officeConfig
  };
};
export default connect(mapStateToProps)(OfficeConfig);
