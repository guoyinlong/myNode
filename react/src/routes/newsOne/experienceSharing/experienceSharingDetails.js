/**
 * 作者：贾茹
 * 日期：2020-10-22
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-案例与经验分享详情页面
 */
import React from 'react';
import {connect } from 'dva';
import { Input, Modal, Button,Tabs, Table } from "antd";
import styles from '../index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const myDate = new Date();
const date = myDate.toLocaleString( ).substr(0,10);

class ExperienceSharingDetails extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    visible: false,//modole显示
  };
  callback=(e)=> {
    if(e==1){
      this.props. dispatch({
        type:"experienceSharingDetails/taskInfoSearch",
      })
    }else if(e==2){
      this.props. dispatch({
        type:"experienceSharingDetails/judgeHistory",
      })
    }
  };
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
          type: "experienceSharingDetails/handle",
      })
  };
  //取消
  handleCancel = () => {
      this.setState({
      visible: false,
      });
  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'experienceSharingDetails/'+value,
        record : value2,
      })
    }else{
      this.props.dispatch({
        type:'experienceSharingDetails/'+value,
      })
    }

  };
 //审批的table   columns
 judgecolumns=[
  {
    title: "序号",
    key:(text,record,index)=>`${index+1}`,
    render:(text,record,index)=>`${index+1}`,
},
{
    title: "状态",
    dataIndex: "failUnm",
    key: "failUnm",

},
{
    title: "环节名称",
    dataIndex: "taskName",
    key: "taskName",

},
{
    title: "审批人",
    dataIndex: "userName",
    key: "userName",

},
{
    title: "审批意见",
    dataIndex: "commentDetail",
    key: "commentDetail",

},
{
    title: "审批时间",
    dataIndex: "commentTime",
    key: "commentTime",

},
{
    title: "审批时长",
    dataIndex: "reqTimes",
    key: "reqTimes",

},
];

/*  return=()=>{

    window.history.go(-1);
  }*/
  //附件表格数据
  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      key:'index',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      key:'key',
      width: '60%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
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
              onClick={(e) => this.downloadUpload(e,record)}
            >下载
            </Button>
          </div>
        );
      },
    }, ];
 //点击下载附件
 downloadUpload = (e,record) =>{
  let url =record.RelativePath;
  window.open(url,"_self");
};

  render(){
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px',paddingBottom:'30px'}}>
        <div>
        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px',color:'#999'}}>
          {/* {this.props.tableLineDetail.map((item)=><span>{item.topic_name}</span>)} */}
          案例与经验分享标题
        </div>
          {/* <Button type="primary" style={{float:'right',marginRight:'50px',marginLeft:10}} onClick={()=>this.returnModel('return')}>返回</Button> */}
          <Button style = {{float: 'right',marginLeft:10}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
          {this.props.pass=="1"?"":
          <span>
          {this.props.difference=="审核"?
              <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',)}size="default" type="primary" >
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
                onChange={(e)=>this.returnModel('tuihui',e.target.value)}/>
          </Modal>
          <div style={{clear:'both'}}></div>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={(e)=>this.callback(e)}>
            <TabPane tab="申请详情" key="1">
                <div className={styles.out}>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                      案例标题
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.titleName}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                      分享部门
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.shareDeptName}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    分享人
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.shareByName}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    分享成果
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <Table
                      columns={ this.columns }
                      loading={ this.props.loading }
                      dataSource={ this.props.tableUploadFile }
                      className={ styles.tableStyle }
                      pagination = { false }
                      style={{marginTop:'10px'}}
                      bordered={ true }
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
    loading: state.loading.models.experienceSharingDetails,
    ...state.experienceSharingDetails
  };
}
export default connect(mapStateToProps)(ExperienceSharingDetails);
