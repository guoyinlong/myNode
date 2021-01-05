/**
 * 作者：贾茹
 * 日期：2020-10-29
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-新闻资源池模块详情页面
 */
import React from 'react';
import {connect } from 'dva';
import { Input, Modal, Button,Tabs, Table } from "antd";
import styles from '../index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const myDate = new Date();
const date = myDate.toLocaleString( ).substr(0,10);

class NewsPoolDetails extends React.Component {
  state = {

  };
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'newsPoolDetails/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'newsPoolDetails/'+value,
      })
    }

  };
  //审批的table   columns
  judgecolumns=[
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '状态',
      dataIndex: 'process_state',
      width: '8%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '环节名称',
      dataIndex: 'process_name',
      width: '18%',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批人',
      dataIndex: 'approval_person',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批类型',
      dataIndex: 'approval_type',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批意见',
      dataIndex: 'approval_desc',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批时间',
      dataIndex: 'approval_datetime',
      width: '12%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
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
      title: '文件描述',
      dataIndex: 'upload_type',
      width: '16%',
      editable: true,
      key:'type',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'left' }}>{text}</div>
        );
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
   

  render(){
    //console.log(this.props.judgeTableSource);
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px',paddingBottom:'30px'}}>
        <div className={styles.title}>
          宣传渠道备案详情页面       
        </div>
        <div>
          <Button type="primary" style={{float:'right',marginRight:'50px'}} onClick={()=>this.returnModel('return')}>返回</Button>
          <div style={{clear:'both'}}></div>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="申请详情" key="1">
                <div className={styles.out}>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        稿件名称
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.newsName}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        新闻事实发生时间
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.pubChannelType}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        申请单位
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.deptName}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        提交人
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.hostDept}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        审核流程
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.applyReason}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                        作者
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    稿件类型
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    是否已领取其他专项奖励
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    是否原创
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    素材文件
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    拟宣传渠道
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    宣传类型
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    宣传形式
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    紧急程度
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    紧急原因
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div> 
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    紧急程度紧是否符合年度宣传计划
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
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
    loading: state.loading.models.newsPoolDetails,
    ...state.newsPoolDetails
  };
}
export default connect(mapStateToProps)(NewsPoolDetails);
