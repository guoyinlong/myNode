/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请
 */
import React from 'react';
import { connect } from 'dva';
import { Button ,Select,DatePicker,Input,Upload,Table,message,Modal,Row,Col,Pagination,Popconfirm,Spin,Icon} from "antd";
import { routerRedux } from "dva/router";
import { getUuid } from './../../../components/commonApp/commonAppConst.js';
import style from "./apply.less";
import Cookie from 'js-cookie';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请
 */
class Apply extends React.PureComponent {
  constructor(props) {super(props);}
  state = {
    flowStaff:"",//流动人员信息
    isDetailVisible:false,//人员信息查看模态框可见
    isReviseVisible:false,// 人员信息表修改模态框不可见
    revise:"0",//  0 时  没有修改   1 时有修改数据

    isNameVisible : false,
    searchText:"",
    dataIndex:"",

    isIdVisible :false,
    keyValue:"",
  };
  // 流动人员table表头
  columns = [
    {
      title:"序号",
      dataIndex:"key",
      render  :(index)=>{return(<div>{index+1}</div>)}
    },
     {
      title:"项目组名称",
      dataIndex:"project_name",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"project_dept",
      title:"项目所属部门",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"project_principal",
      title:"项目经理/负责人",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"project_principal_phone",
      title:"项目负责人联系电话",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"staff_nature",
      title:"性质",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"staff_name",
      title:"姓名",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"",
      title:"操作",
      render  :(record)=>{
        return(<div>
          <a onClick = {()=>this.gotoDetail(record)}style={{marginRight:"3px"}}>查看</a>
          <a onClick = {()=>this.gotoRevise(record)}style={{marginRight:"3px"}}>修改</a>
          <Popconfirm title = "确定删除数据？" onConfirm = {()=>this.delDetail(record)}>
            <a>删除</a>
          </Popconfirm>
        </div>)
      }
    }
  ];
  // 不可申请人员表头
  RefuseColumns = [
    /**
    {
      title:"序号",
      dataIndex:"key",
      render  :(index)=>{return(<div>{index+1}</div>)}
    },
     **/
    {
      title:"项目组名称",
      dataIndex:"ex_project_name",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"ex_project_dept_name",
      title:"项目所属部门",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"ex_project_charger_name",
      title:"项目经理/负责人",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"ex_project_charger_tel",
      title:"项目负责人联系电话",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"prop",
      title:"性质",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"user_name",
      title:"姓名",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    {
      dataIndex:"reason",
      title:"原因",
      render  :(text)=>{return(<div>{text}</div>)}
    },
    /**
    {
      dataIndex:"",
      title:"操作",
      render  :(record)=>{
        return(<div>
          <a onClick = {()=>this.gotoDetail(record)}style={{marginRight:"3px"}}>查看</a>
          <a style={{marginRight:"3px"}}>修改</a>
          <Popconfirm title = "确定删除数据？" onConfirm = {()=>this.delDetail(record)}>
            <a>删除</a>
          </Popconfirm>
        </div>)
      }
    }
     **/
  ];
  // 常驻人员table表头


  explicitimplicitchange  = (name,visible)=>{
    if(name == "username"){
      this.setState(
        {isNameVisible: visible},
        () => this.searchInput.focus()
      )
    }else if(name =="staff_id"){
      this.setState(
        {isIdVisible: visible},
        () => this.searchInput.focus()
      )
    }
  }
  filterDropdown = (dataIndex,title) => {
    return (
      <div className="custom-filter-dropdown">
        <div className={style.search}>
          <Input
            className={style.searchInput}
            ref = {ele => this.searchInput = ele}
            placeholder = {title}
            value = {this.state.searchText}
            onChange = {this.onInputChange}
            onPressEnter = {() => this.onSearch(dataIndex)}
          />
          <Button type="primary" onClick={() => this.onSearch(dataIndex)}>搜索</Button>
        </div>
      </div>
    )
  }
  onInputChange =(e)=>{
    this.setState({ searchText: e.target.value} );
  }
  onSearch=(dataIndex)=>{
    this.setState({
      isNameVisible:false,
      searchValue:this.state.searchText,
      dataIndex,
    })
  }
  //根据筛选条件生成新的数据源
  getNewData = (recordList,dataIndex,searchText) => {
    if(!dataIndex) return recordList;
    const reg = new RegExp(searchText);
    return recordList.filter(v => {
      return reg.test(v[dataIndex])
    })
  }
  //流动人员查看
  gotoDetail =( record )=>{
    this.setState({
      flowStaff:record,
      isDetailVisible:true,
    })
  }
  //流动人员修改
  gotoRevise =( record )=>{
    this.setState({
      flowStaff:record,
      isReviseVisible:true,
      keyValue:getUuid(32, 64)
    })
    this.props.dispatch({type:"apply/gotoRevise",data:record})
  }
  // 流动人员数据修改
  saveRevise =(e,saveType)=>{
    this.props.dispatch({type:"apply/saveRevise",data:e.target.value,saveType:saveType})
  }
  //流动人员删除
  delDetail =( record )=>{
    this.props.dispatch({type:"apply/delStaffData",data:record})
  }
  // 模态框显隐控制
  setVisible =(data)=>{
    if(data === "detail"){
      this.setState({isDetailVisible:false})
    }else if(data === "revise"){
      this.setState({isReviseVisible:false,revise:"1"})
      this.props.dispatch({type:"apply/saveReviseData"})
    }else if(data === "cancelRevise"){
      this.setState({isReviseVisible:false,revise:"0"})
    }
  }
  // 选择申请类型
  selectType = ( key )=>{
    this.props.dispatch({type:"apply/saveApplyType",applyType:key})
    //  0为流动人员  1 为常驻人员
    if(key === "1"){
      this.props.dispatch({type:"apply/staffQuery"})
      this.props.dispatch({type:"apply/clearHistory"})
    }
    /**
    else if(key ==="1"){
      this.props.dispatch({type:"apply/clearHistory"})
      }
     **/
  }
  //模板下载
  download =()=>{
    window.open("/filemanage/download/assetstemplate/外部人员导入模板.xlsx");
  }
  //提交常驻人员工位申请
  submitOften =()=>{
    this.props.dispatch({type:"apply/submitFixed"})
  }
  // 跳转到申请记录查询页面
  gotoApplyRecord =()=>{
    this.props.dispatch(
      routerRedux.push({
      pathname:"/adminApp/compRes/officeResMain/apply/applyRecord"
    })
    )
  }
  //流动人员清空数据
  goToClear =()=>{
    const{dispatch} = this.props;
    dispatch({
      type:"apply/clearFolwStaff",
    })
  }
  //提交流动人口申请人员数据
  goToSubmit=()=>{
    const { dispatch } = this.props ;
    dispatch({
      type:"apply/flowSubmit",
    })
  }
  //流动人员开始 结束时间选择
  changeDate = ( date,dateString)=>{
    const{dispatch} = this.props;
    dispatch({
      type:"apply/saveDate",
      data:dateString
    })
  }
  // 填写流动人员申请原因
  saveInput =(e)=>{
    const{dispatch} = this.props;
    dispatch({
      type:"apply/saveInput",
      data:e.target.value
    })
  }
  // 常驻人员申请时间
  changeFixDate =( data,dataString )=>{
    this.props.dispatch({type:"apply/saveFixDate",data:dataString})
  }
  // 常驻人员申请原因保存
  saveFixReason =(e)=>{
    this.props.dispatch({type:"apply/saveFixReason",data:e.target.value})
  }
  //勾选常驻人员申请数据
  rowSelect = (selectedRowKeys,selectedRows)=>{
    console.log("选择table数据")
    console.log(selectedRows)
    this.props.dispatch({type:"apply/fixRowSelect",data:selectedRows})
  }
  //修改常驻人员页码
  changePage = ( page )=>{
    this.props.dispatch({type:"apply/changePage",data:page})
  }
  // 返回至办公资源首页
  gotoMainPage =()=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/officeResMain",
      })
    )
  }

  render(){
    console.log("ceshifffffffff----------------codesmell")
    console.log(this.props.flowStaffList)

   const oftenColumns = [
     /**
     {
      dataIndex:"key",
      title:"序号",
      render  :(index)=>{
        return(<div>{index+1}</div>)
      }
    },
      **/
      {
      dataIndex:"username",
      title:"姓名",
      render  :(text)=>{
        return(<div>{text}</div>)
      },
      filterDropdownVisible : this.state.isNameVisible,
      onFilterDropdownVisibleChange : (visible)=>this.explicitimplicitchange("username",visible),
      filterDropdown:this.filterDropdown("username","姓名"),
      filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
    }, {
      dataIndex:"staff_id",
      title: "员工编号",
      render: (text)=> {
        return (<div>{text}</div>)
      },
     filterDropdownVisible : this.state.isIdVisible,
     onFilterDropdownVisibleChange : (visible)=>this.explicitimplicitchange("staff_id",visible),
     filterDropdown:this.filterDropdown("staff_id","员工编号"),
     filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
    }, {
      dataIndex:"email",
      title: "邮箱",
      render: (text)=> {
        return (<div>{text}</div>)
      }
    }, {
      dataIndex:"tel",
      title: "电话",
      render: (text)=> {
        return (<div>{text}</div>)
      }
    }];
    const rowSelect = {
      onChange : this.rowSelect,
    }
    const staffList = this.getNewData(this.props.staffList,this.state.dataIndex,this.state.searchText)
    // 流动人员导入数据
    const upLoad = {
      name:"file",
      action:"/assetsmanageservice/assetsmanage/assets/externalStaffImport",
      method: "POST",
      data: {},
      //name: "outSource",
      multiple: false,
      showUploadList: false,
      accept: '.xlsx,.xls',
      onChange:(info)=> {
        if (info.file.status === 'done'){
          if(info.file.response.RetCode === "1"){
            message.info("导入成功！");
            const{dispatch} = this.props;
            dispatch({
              type:"apply/saveFolwStaff",
              data:info.file.response.staffInfoList
            })
          }else {
            message.info(info.file.response.RetVal);
          }
        }
      }
    };
    return (
        <div className = {style.page}>
          <div className = { style.title }>{"申请工位"}</div>
          <div style={{textAlign:"right"}}>
            <Button style={{marginRight:"5px"}} type="primary" onClick = { this.gotoApplyRecord}>{"申请记录查询"}</Button>
            <Button type="primary" onClick = {this.gotoMainPage}>{"返回"}</Button>
          </div>
          <div className = {style.info}>
            申请类型：
            <Select style = {{ width:"100px"}} onSelect = {this.selectType} value = {this.props.applyType}>
              <Option key = "0" value = "0">{"流动人员"}</Option>
              <Option key = "1" value = "1">{"常驻人员"}</Option>
            </Select>
          </div>
          {
            this.props.applyType === "0"?
              <div>
                <div className = {style.info}>申请数量<span style={{marginLeft:"10px"}}>{this.props.staffNum}</span></div>
                <div className = {style.info}>申请时间：<RangePicker onChange = {this.changeDate}></RangePicker></div>
                <div className = {style.info}><span style={{verticalAlign:"top"}}>申请原因：</span><TextArea style={{width:"400px"}} onChange = {this.saveInput}></TextArea></div>
                <div>
                  <div >申请人员:</div>
                  <div style={{marginBottom:"5px",textAlign:"right"}}>
                    <Button  onClick = {this.goToClear} style={{marginRight:"3px"}}>{"清空"}</Button>
                    <Button  type= "primary" onClick = {this.download} style={{marginRight:"3px"}}>{"模板下载"}</Button>
                    <Upload {...upLoad}>
                      <Button  type= "primary" style={{marginRight:"3px"}}>{"导入"}</Button>
                    </Upload>
                    <Button  type= "primary" onClick = {this.goToSubmit}>{"提交"}</Button>
                  </div>
                </div>
                <Table
                  columns = { this.columns }
                //  dataSource = {this.state.revise ==="0"?this.props.flowStaffList:this.props.flowStaffListRevise}
                  dataSource = {this.props.flowStaffList}
                  className = {style.table}
                >
                </Table>
                <div style = {{marginTop:"15px"}}>
                  <div>{"以下人员不可申请:"}</div>
                  <Table
                    columns = { this.RefuseColumns }
                    dataSource = {this.props.AbnormalList}
                    className = {style.table}
                  />
                </div>
                <Modal
                  title="人员详情表"
                  visible={this.state.isDetailVisible}
                  onOk = {()=>this.setVisible("detail")}
                  onCancel = {()=>this.setVisible("detail")}
                  width = "780px"
                >
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>单位名称：</Col>
                    <Col span = {6}>{this.state.flowStaff.vendor_name}</Col>
                    <Col span = {4} style={{textAlign:"right"}}> 负责人：</Col>
                    <Col span = {10}>{this.state.flowStaff.vendor_principal}</Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>负责人电话：</Col>
                    <Col span = {6}>{this.state.flowStaff.vendor_principal_phone}</Col>
                    <Col span = {4} style={{textAlign:"right"}}>项目组名称：</Col>
                    <Col span = {10}>{this.state.flowStaff.project_name}</Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>项目组编号：</Col>
                    <Col span = {6}>{this.state.flowStaff.project_code}</Col>
                    <Col span = {4} style={{textAlign:"right"}}>项目组所属部门：</Col>
                    <Col span = {10}>{this.state.flowStaff.project_dept}</Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>项目经理/负责人：</Col>
                    <Col span = {6}>{this.state.flowStaff.project_principal}</Col>
                    <Col span = {4} style={{textAlign:"right"}}>项目负责人电话：</Col>
                    <Col span = {10}>{this.state.flowStaff.project_principal_phone}</Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>性质：</Col>
                    <Col span = {6}>{this.state.flowStaff.staff_nature}</Col>
                    <Col span = {4} style={{textAlign:"right"}}>姓名：</Col>
                    <Col span = {10}>{this.state.flowStaff.staff_name}</Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>身份证号：</Col>
                    <Col span = {6}>{this.state.flowStaff.staff_idnumber}</Col>
                    <Col span = {4} style={{textAlign:"right"}}>联系电话：</Col>
                    <Col span = {10}>{this.state.flowStaff.staff_phone}</Col>
                  </Row>
                </Modal>
                <Modal
                  title="人员详情表"
                  visible={this.state.isReviseVisible}
                  onOk = {()=>this.setVisible("revise")}
                  onCancel = {()=>this.setVisible("cancelRevise")}
                  width = "780px"
                  //key={getUuid(32, 64)}
                  key = {this.state.keyValue}
                >
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>单位名称：</Col>
                    <Col span = {6}><Input defaultValue={this.state.flowStaff.vendor_name} onChange = {(e)=>this.saveRevise(e,"vendor_name")}></Input></Col>
                    <Col span = {4} style={{textAlign:"right"}}> 负责人：</Col>
                    <Col span = {10}><Input defaultValue={this.state.flowStaff.vendor_principal} onChange = {(e)=>this.saveRevise(e,"vendor_principal")}></Input></Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>负责人电话：</Col>
                    <Col span = {6}><Input defaultValue={this.state.flowStaff.vendor_principal_phone} onChange = {(e)=>this.saveRevise(e,"vendor_principal_phone")}></Input></Col>
                    <Col span = {4} style={{textAlign:"right"}}>项目组名称：</Col>
                    <Col span = {10}><Input defaultValue={this.state.flowStaff.project_name} onChange = {(e)=>this.saveRevise(e,"project_name")}></Input></Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>项目组编号：</Col>
                    <Col span = {6}><Input defaultValue={this.state.flowStaff.project_code} onChange = {(e)=>this.saveRevise(e,"project_code")}></Input></Col>
                    <Col span = {4} style={{textAlign:"right"}}>项目组所属部门：</Col>
                    <Col span = {10}><Input defaultValue={this.state.flowStaff.project_dept} onChange = {(e)=>this.saveRevise(e,"project_dept")}></Input></Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>项目经理/负责人：</Col>
                    <Col span = {6}><Input defaultValue={this.state.flowStaff.project_principal} onChange = {(e)=>this.saveRevise(e,"project_principal")}></Input></Col>
                    <Col span = {4} style={{textAlign:"right"}}>项目负责人电话：</Col>
                    <Col span = {10}><Input defaultValue={this.state.flowStaff.project_principal_phone} onChange = {(e)=>this.saveRevise(e,"project_principal_phone")}></Input></Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>性质：</Col>
                    <Col span = {6}><Input defaultValue={this.state.flowStaff.staff_nature} onChange = {(e)=>this.saveRevise(e,"staff_nature")}></Input></Col>
                    <Col span = {4} style={{textAlign:"right"}}>姓名：</Col>
                    <Col span = {10}><Input defaultValue={this.state.flowStaff.staff_name} onChange = {(e)=>this.saveRevise(e,"staff_name")}></Input></Col>
                  </Row>
                  <Row>
                    <Col span = {4} style={{textAlign:"right"}}>身份证号：</Col>
                    <Col span = {6}><Input disabled = {true} defaultValue={this.state.flowStaff.staff_idnumber} onChange = {(e)=>this.saveRevise(e,"staff_idnumber")}></Input></Col>
                    <Col span = {4} style={{textAlign:"right"}}>联系电话：</Col>
                    <Col span = {10}><Input defaultValue={this.state.flowStaff.staff_phone} onChange = {(e)=>this.saveRevise(e,"staff_phone")}></Input></Col>
                  </Row>

                </Modal>
              </div>
              :
              <div>
                <div className = {style.info}>
                  <span>申请部门：{Cookie.get("deptname")}</span>
                  <span style = {{marginLeft:"25px"}}>申请数量:<span style={{marginLeft:"5px"}}>{this.props.fixStaffNum}</span></span>
                </div>
                <div className = {style.info}><span>开始时间：</span><DatePicker onChange = {this.changeFixDate}></DatePicker></div>
                <div className = {style.info}><span style={{verticalAlign:"top"}}>申请原因：</span>
                  <TextArea style={{width:"500px"}} onChange = {this.saveFixReason}></TextArea>
                </div>
                <div className = {style.info}>
                  <div style={{textAlign:"right"}}>
                    <Button type="primary" onClick = {this.submitOften}>{"提交"}</Button>
                  </div>
                  <div>申请人员：</div>
                </div>
                <Table
                  columns = { oftenColumns }
                  dataSource = { staffList }
                  rowSelection = { rowSelect }
                  className = {style.table}
                  pagination = {false}
                >
                </Table>
                <Pagination
                  current = {this.props.page}
                  total = {this.props.total}
                  pageSize = {this.props.pageSize}
                  onChange = { this.changePage }
                  className = {style.pagination}
                >
                </Pagination>
              </div>
          }
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
   loading:state.loading.models.apply,
   ...state.apply
   }
}

export default connect(mapStateToProps)(Apply);
//export default connect()(Apply);
