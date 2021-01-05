/**
 * 作者：罗玉棋
 * 创建日期：2019-9-03
 * 邮件：809590923@qq.com
 * 文件说明：审核页面
 */
import React from "react";
import { connect } from "dva";
import { Button, Modal, Row, Col, Collapse, Tabs,Input, message,Icon,Spin,Pagination,Card} from "antd";
import tableStyle from "../../../components/common/table.less";
import styles from "./auditPage.less";
import CompareInfo from "../CompareInfo/CompareInfo.js";
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;
const chunk = (arr, size) =>{
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}
class AuditPage extends React.PureComponent {
  state = {
    columns: [],
    width: "800px",
    activeKey: "",
    loading: true,
    tabKey: "tab1",
    flage: "show",
    panelKey:"",
    visible: false,
    rejreason:null,
    tocheckPage:1,
    tocheckLoading:false,
    checkPage:1,
    checkLoading:false
  };

  //打开modal
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  //确定按钮
  handleOk = e => {
    let {auditList,dispatch}=this.props;
    let {panelKey,rejreason}=this.state;
    let upInfo=[];

    if(rejreason==null||(rejreason.replace(/\s*/g,"")).length==0){
     message.error("请填写退回原因")
     return
   }
 
    upInfo= auditList[""+panelKey].fieldinfo.map(item=>{
    item["unpass_reason"]=rejreason
    return item
   })

    dispatch({
      type: "auditPage/checkInfo",
      checkFlage:0,
      fieldList:JSON.stringify(upInfo),
      //rejreason:1     
  });
 
    this.setState({
      visible: false,
    });
  };
  //取消按钮
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };



  //通过
  submitInfo = () => {
    let {auditList,dispatch,tbList}=this.props
    let {panelKey}=this.state
    let upInfo=[];
    upInfo=auditList[""+panelKey].fieldinfo.filter(item=>{

      return tbList.some(tb=> (item.field_uid==tb.field_uid&&tb.ischeck=="1")
       
      )
    })
    confirm({
      title: '确认审核通过?',
      onOk:()=>{
        dispatch({
          type: "auditPage/checkInfo",
          checkFlage: 1,
          fieldList:JSON.stringify(upInfo)
        });
        this.setState({
          panelKey:undefined
        })
      },
      onCancel() {
        return
      },
    });

  
  };

  rejectContent=(e)=>{
    this.setState({
      rejreason:e.target.value
    })
  }

  changePanel = key => {
    this.props.dispatch({
      type: "auditPage/save",
      payload: {
        loading: true,
        closeKey:"1",
        dataList:[],
        tbList:[]
      }
    });

    this.setState({
      panelKey:key
    })
    let {tabKey}=this.state
    let paramsList = tabKey=="tab1"?this.props.auditList:this.props.auditedList
    paramsList.forEach((item, index) => {
      if (key == index) {
        this.props.dispatch({
          type: "auditPage/selectInfo",
          category_name: item.category_name,
          staff_id: item.staff_id,
          batchid: item.batchid,
          category_uid:item.category_uid
        });
      }
    });
  }
  
  
  //来回切换
  callback = key => {
    this.setState({
      tabKey: key,
      flage: key == "tab1" ? "show" : "none",
      panelKey:""
    });
    this.props.dispatch({
      type: "auditPage/pendingOrder",
      payload: {
        key: key
      }
    });
  };

  tocheckingPage=(page)=>{
    this.setState({
      tocheckLoading:true
    })
    setTimeout(() => {
      this.setState({
        tocheckPage: page,
        tocheckLoading:false
      });
    }, 500);
  }


  checkingPage=(page)=>{
    this.setState({
      checkLoading:true
    })
    setTimeout(() => {
      this.setState({
        checkPage: page,
        checkLoading:false
      });
    }, 500);
  }

  render() {
    let {panelKey,tabKey}=this.state
    let { dataList, tbList,auditList,auditedList} = this.props;
    const { flage } = this.state;
    let tocheckData=chunk(auditList,8)[this.state.tocheckPage-1];
    let checkData=chunk(auditedList,8)[this.state.checkPage-1];
    let unpassInfo="";
    if(tabKey=="tab1"){
      if(auditList.length!=0&&panelKey!=""&&panelKey!=undefined){
        auditList[panelKey].unpass_reason==undefined?"":unpassInfo=<p rows={4} >{auditList[panelKey].unpass_reason}</p>
        if(auditList[panelKey].opt=="update"){
          tbList=tbList.filter(tb=>{
            return auditList[panelKey].fieldinfo.some(tocheck=> tb.field_uid==tocheck.field_uid)
            })
        }
        }    
     
      }else{
        if(auditedList.length!=0&&panelKey!=""&&panelKey!=undefined){
          auditedList[panelKey].unpass_reason==undefined?"":unpassInfo=<p rows={4} >{auditedList[panelKey].unpass_reason}</p>
          if(auditedList[panelKey].opt=="update"){
          tbList=tbList.filter(tb=>{
            return auditedList[panelKey].fieldinfo.some(tocheck=> tb.field_uid==tocheck.field_uid)
            })
          }
          }
      }
    const panelInfo =((tabKey=="tab1"?tocheckData:checkData)||[]).map((item, index)=>{
      return (
        <Panel
          header={
            <div>
              {item.opt=="update"?
              <span>
                【{item.staff_name}】 对 【{item.category_name}】
                做了如下变更，请您审核！
              </span>
              :
              <span>
                【{item.staff_name}】 新增了 【{item.category_name}】
                里的内容，请您审核！
              </span>
              }
              <div
                style={{
                  float: "right",
                  marginRight: 10,
                  color: tabKey == "tab1" ? "#ff786b" : "#00CD00"
                }}
              >
                {tabKey == "tab1" ?  "待审核" : "已审核"}
              </div>

              <div
                style={{ float: "right", marginRight: 10}}>
                {item.fieldinfo[0].create_time.substring(0,item.fieldinfo[0].create_time.lastIndexOf("\."))}
              </div>
            </div>
          }
          key={index} style={{backgroundColor: (index)%2==0?"#ffffff":"rgb(216, 237, 242)"}}>
        
          <div className={styles.container} style={{backgroundColor: "rgba(243, 253, 253, 0.87)"}}>
          <br></br>
          <br></br>
            <div className={styles.title} style={{fontSize:20}}>
                <b>全面激励信息变更审核</b>
            </div>
            <br></br>
            <br></br>
            <CompareInfo
              category_name={item.category_name}
              dataList={dataList}
              loading={this.props.loading}
              tbList={tbList}
              UidMap={this.props.UidMap}
            ></CompareInfo>
            <Row>
              <Row style={{ height: "30px" }} />
              <Col span={8}></Col>
              <Col span={4}>
                <Row type="flex" justify="center">
                  <Button
                    className={styles.btn_select}
                    onClick={this.showModal}
                    style={{ display: `${flage}` }}
                  >
                    退回
                  </Button>
                </Row>
              </Col>
              <Col span={4}>
                <Row type="flex" justify="center">
                  <Button
                    className={styles.btn_select}
                    onClick={this.submitInfo}
                    style={{ display: `${flage}` }}
                  >
                    审核通过
                  </Button>
                </Row>
              </Col>
              <Col span={8}></Col>
            </Row>
           {unpassInfo!=""?
           <div>
            <Card title="未通过原因"extra={<Icon type="exclamation-circle" />}  
            style={{ width: 370,height:190,marginLeft:15,backgroundColor:"rgba(214, 239, 244, 0.86)" }} className={styles.card}>
            {unpassInfo}
            </Card>
            <br></br>
            </div>
            :
            ""
           }
         <br></br>
          </div>
        </Panel>
      );
    });

 
  
    return (
      <div style={{backgroundColor:"#f9fbfd",minHeight:"76vh",padding:15}}>
      <div id="table1" className={tableStyle.orderTable}>
        <Tabs defaultActiveKey="tab1" onChange={this.callback}>
          <TabPane tab="待办" key="tab1">
            {this.state.tabKey==="tab1"&&
            <Spin spinning={this.state.tocheckLoading}>
            <Collapse accordion onChange={this.changePanel} className={styles.collapse}
             activeKey={this.props.closeKey==""?this.props.closeKey:`${panelKey}`} >
              {panelInfo}
            </Collapse>
            </Spin>
            }
            {auditList.length==0?<div style={{textAlign:"center",color:"#9C9C9C",marginTop:10,fontSize:15}}>暂无待办</div>
            :
            <Pagination style={{marginTop:20,textAlign:"center"}}  total={auditList.length} defaultPageSize={8}
              current={this.state.tocheckPage} onChange={this.tocheckingPage}
             />
            }
          </TabPane>
            
          <TabPane tab="已办" key="tab2">
          {this.state.tabKey==="tab2"&&
          <Spin spinning={this.state.checkLoading}>
          <Collapse accordion onChange={this.changePanel} className={styles.collapse}>
              {panelInfo}
            </Collapse>
            </Spin>
            }
            {auditedList.length==0?<div style={{textAlign:"center",color:"#9C9C9C",marginTop:10,fontSize:15}}>暂无已办</div>
            :
             <Pagination style={{marginTop:20,textAlign:"center"}}  total={auditedList.length} defaultPageSize={8}
             current={this.state.checkPage} onChange={this.checkingPage}
           />
            }
          </TabPane>
        </Tabs>

        <Modal
          title={<div>退回原因<Icon type="question" /></div>}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
         <TextArea onChange={this.rejectContent} placeholder="请填写退回原因" style={{resize:"none",minHeight:150}} autosize/>
        </Modal>
      </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { dataList, tbList, loading,closeKey,UidMap,auditedList,auditList,toCheckList} = state.auditPage;
  return {
    dataList,
    tbList,
    loading,
    closeKey,
    UidMap,
    auditedList,
    auditList,
    toCheckList
  };
}

export default connect(mapStateToProps)(AuditPage);
