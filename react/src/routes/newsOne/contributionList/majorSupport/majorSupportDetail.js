/**
 * 作者：韩爱爱
 * 日期：2020-11-09
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页-详情
 */
import React, { Component }  from  'react';
import styles from "../../index.less";
import {connect} from "dva";
import {Button, Table, Tabs, Modal,Input } from "antd";
const  {TabPane} = Tabs;
const { TextArea } = Input;
class majorSupportDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      visible: false,//modole显示
    }
  }
  callback=(e)=> {
    if(e==1){
        this.props. dispatch({
            type:"majorSupportDetail/queryActivityItem",
          })
    }else if(e==2){
        this.props. dispatch({
            type:"majorSupportDetail/queryActivityExamineItem",
            })
    }
}
   //退回
   showModal = () => {
    this.setState({
      visible: true,
    });
  };
  //确定
  handleOk = () => {
    this.setState({
      visible: false,
    });
    this.props.dispatch({
      type: "majorSupportDetail/handle",
    })
  };
  //取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //回退原因填写
  returnModel2 =(value,value2)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'majorSupportDetail/'+value,
        record : value2,
      })
    }else{
      this.props.dispatch({
        type:'majorSupportDetail/'+value,
      })
    }
  };
  returnModel =(e,vlaue1,vlaue2,vlaue3)=>{
    if(e!==undefined){
      this.props.dispatch({
        type:'majorSupportDetail/'+e,
        reacd:vlaue2,
        name:vlaue1,
        text:vlaue3
      })
    }else{
      this.props.dispatch({
        type:'majorSupportDetail/'+e,
      })
    }
  };
  returnModel =(e,vlaue1,vlaue2,vlaue3)=>{

    if(e!==undefined){
      this.props.dispatch({
        type:'majorSupportDetail/'+e,
        reacd:vlaue3,
        name:vlaue1,
        download:vlaue2
      })
    }else{
      this.props.dispatch({
        type:'majorSupportDetail/'+e,
      })
    }
  };
  //审批环节
  judgecolumns=[
    {
      title: '序号',
      dataIndex: 'key',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      width: '8%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '环节名称',
      dataIndex: 'taskName',
      width: '15%',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批人',
      dataIndex: 'userName',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },  {
      title: '审批意见',
      dataIndex: 'commentDetail',
      width: '12%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批时间',
      dataIndex: 'commentTime',
      width: '12%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }
    // ,{
    //   title: '审批时长',
    //   dataIndex: 'burningTime',
    //   width: '10%',
    //   render: (text) => {
    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },
    // },
  ];
  //考试题目回答情况/  调查问卷 存储
  tuColumns = [
    {
      title: '序号',
      dataIndex: '',
      width: '10%',
      key:'index',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '图片',
      dataIndex: 'image',
      key:'image',
      width: '60%',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'center'}}>
              <img src={record.RelativePath} style={{ width:'100px',height:'100px', cursor: "pointer"}} onClick={(e)=>this.returnModel('handlePreview','打开',e,record)}/>
              <Modal
                visible={this.props.previewVisible}
                footer={null}
                onCancel={(e)=>this.returnModel('handlePreview','关闭',e,record)}
              >
                <img src={this.props.previewImage} style={{ width:'80%',height:'80hv', cursor: "pointer"}} />
              </Modal>
        </div>;
      },
    },{
      title: '操作',
      dataIndex: '',
      key:'opration',
      width: '24%',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => this.returnModel('downloadUpload',e,record)}
            >下载
            </Button>
          </div>
        );
      },
    },
  ];
  render(){
    return(
      <div  className={styles.outerField}>
        <div className={styles.out}>
          <h2 style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'20px'}}>重大活动支撑详情</h2>
          <Button type="primary" style={{float:'right',marginRight:'50px',marginLeft:10}} onClick={(e)=>this.returnModel('return',e)}>返回</Button>
          {this.props.pass=="1"?"":
          <span>
           {this.props.difference=="审核"?
            <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel2('onAgree',)}size="default" type="primary" >
              同意
            </Button>
            :""}
          {this.props.difference=="审核"?
            <Button style = {{float: 'right'}} onClick={()=>this.showModal()}  size="default" type="primary" >
              退回
            </Button>
            :""} 
          </span>}
          <Modal
            title="退回原因"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <TextArea value={this.props.tuihuiValue} rows={4}
                      onChange={(e)=>this.returnModel2('tuihui',e.target.value)}/>
          </Modal>
          <div style={{clear:'both'}}></div>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={(e)=>this.callback(e)}>
            <TabPane tab="申请详情" key="1">
              <div className={styles.out}>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}>提交人</span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
                  <span>{this.props.eachSubmitter}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}>活动名称</span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
                  <span>{this.props.eventName}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}>活动时间</span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
                  <span>{this.props.eachTime}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}>活动中担任工作</span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
                  <span>{this.props.eventNameJob}</span>
                </div>
                <div className={styles.lineOut}>
                  <span className={styles.lineKey}> 活动证明材料</span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginLeft:'5px'}}>:</span>
                  <Table
                    dataSource = { this.props.tuTableSource }
                    columns = { this.tuColumns }
                    loading={ this.props.loading }
                    style = {{width:'500px', marginLeft:'175px',marginTop:'-15px'}}
                    bordered={true}
                    pagination = { false }
                    className={ styles.tableStyle }
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab="审批环节" key="2">
              <Table
                className = { styles.tableStyle }
                dataSource = { this.props.judgeTableSource }
                columns = { this.judgecolumns }
                style = {{ marginTop: "20px" }}
                bordered={true}
                /*pagination={ false }*/
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.majorSupportDetail,
    ...state.majorSupportDetail
  };
}

export default connect(mapStateToProps)(majorSupportDetail);