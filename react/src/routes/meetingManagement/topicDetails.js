/**
 * 作者：贾茹
 * 日期：2019-6-5
 * 邮箱：m18311475903@163.com
 * 功能：议题详情
 */
import React from 'react';
import {connect } from 'dva'
import { Tabs, Button, Table } from 'antd';
import styles from './meetingTable.less';
import {routerRedux} from "dva/router";

const { TabPane } = Tabs;


class TopicDetails extends React.Component{
  constructor(props){
    super(props)
  };

  //点击审批环节触发
  callback=(key)=> {
   /* console.log(key);*/
   /* console.log('审批环节');
    this.props.dispatch({
      type:'topicApply/judgeMoment',
    })*/
  };

  //详情页面附件的table
  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      width: '40%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '文件类型',
      dataIndex: 'upload_desc',
      width: '40%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },{
      title: '操作',
      dataIndex: '',
      width: '22%',
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
      dataIndex: 'state_desc',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '环节名称',
      dataIndex: 'Approval_link',
      width: '18%',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批人',
      dataIndex: 'list_receive_name',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批类型',
      dataIndex: 'topic_check_state_desc',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批意见',
      dataIndex: 'approval_opinions',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    }, {
      title: '审批时间',
      dataIndex: 'update_date',
      width: '10%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
  ];

//点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.upload_url;
    window.open(url);
  };

  //点击下载申请单
  downPage =()=>{
    this.props.dispatch({
      type:'topicApply/downPaper',          //走终止议题的服务
    })
  };

  //点击返回返回议题申请页面
  return = ()=>{
    const { flagType } = this.props;
    if(flagType == "query"){
      this.props. dispatch(routerRedux.push({
        pathname:'/adminApp/meetManage/meetingQuery'
      }));
    }else {
      this.props. dispatch(routerRedux.push({
        pathname:'/adminApp/meetManage/topicApply'
      }));
    }
  };

  render() {
    const meetingType = this.props.tableLineDetail.map((item)=>item.note_type_name);
    const utgent = this.props.tableLineDetail.map((item)=>item.topic_urgent);
   // console.log(meetingType)
   /* console.log(this.props.judgeTableSource);*/
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px',color:'#999'}}>
          {this.props.tableLineDetail.map((item)=><span>{item.topic_name}</span>)}
        </div>
        <div>
          <Button type="primary" style={{float:'right',marginRight:'50px'}} onClick={this.return}>返回</Button>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto',}}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="议题详情" key="1">
              <div style={{margin:'0 auto',width:'750px'}}>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    申请单位
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                  {this.props.tableLineDetail.map((item)=>{
                    if(item.topic_level==='1'){
                      return <span>分院级</span>
                    }else{
                      return <span>院级</span>
                    }
                  })}
                </span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    汇报人
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.tableLineDetail.map((item)=><span>{item.topic_user_name}</span>)}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    汇报单位
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.tableLineDetail.map((item)=><span>{item.topic_dept_name}</span>)}</span>

                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    会议类型
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.tableLineDetail.map((item)=><span>{item.note_type_name}</span>)}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      预计汇报时间
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.tableLineDetail.map((item)=><span>{item.topic_reporting_time}</span>)}分钟</span>
                </div>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    是否属于三重一大
                 </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                <span>
                  {this.props.tableLineDetail.map((item)=>{
                    if(item.topic_if_important==='1'){
                      return <span>是</span>
                    }else{
                      return <span>否</span>
                    }
                  })}
                </span>
              </div>
                {
                  this.props.reasonImportant==='1'?
                    <div style={{marginTop:'15px'}} >
                     <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        三重一大的原因
                     </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.tableLineDetail.map((item)=><span>{item.topic_important_reason}</span>)}</span>
                    </div>

                    :
                    null
                }

                {
                  meetingType === ['总经理办公会']?
                    <div style={{marginTop:'15px'}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          是否需党委会前置讨论
                      </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>
                   {this.props.tableLineDetail.map((item)=>{
                     if(item.topic_if_study==='1'){
                       return <span>是</span>
                     }else if(item.topic_if_study==='0'){
                       return <span>否</span>
                     }
                   })}
                </span>
                    </div>
                    :
                    null
                }
                {
                  this.props.tableLineDetail.map((item)=>item.topic_if_study === '1')?
                    <div style={{marginTop:'15px',display: this.props.discussDisplay }} >
                      <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        前置讨论议题
                      </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.tableLineDetail.map((item)=><span>{item.topic_study_id}</span>)}</span>
                    </div>
                    :
                    null
                }
              <div style={{marginTop:'15px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    列席部门
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                <span>{this.props.tableLineDetail.map((item)=><span>{item.topic_other_dept_name}</span>)}</span>
              </div>
                <div style={{marginTop:'15px',display:this.props.topicContent, }}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      待决议事项
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.tableLineDetail.map((item)=><span>{item.topic_content}</span>)}</span>
              </div>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    紧急程度
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                     {this.props.tableLineDetail.map((item)=>{
                       if(item.topic_urgent==='1'){
                         return <span>紧急</span>
                       }else{
                         return <span>一般</span>
                       }
                     })}
                  </span>
                </div>
                {
                  Number(utgent) === 1?
                    <div style={{marginTop:'15px'}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                           紧急原因和上会时间
                       </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.tableLineDetail.map((item)=><span>{item.urgent_reason}</span>)}</span>
                    </div>
                    :
                    null
                }

                <div style={{marginTop:'15px'}}>
                     <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        上会材料是否涉密
                    </span>
                    <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                    <span>
                        {this.props.tableLineDetail.map((item)=>{
                          if(item.topic_if_secret==='1'){
                            return <span>是</span>
                          }else{
                            return <span>否</span>
                          }
                        })}
                     </span>
              </div>
                <div style={{marginTop:'15px',display: this.props.materialDetailDisplay }} >
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    上会材料泄密说明
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                <span>{this.props.tableLineDetail.map((item)=><span>{item.topic_secret_reason}</span>)}</span>
              </div>
                <div style={{marginTop:'15px' }}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      上会材料或佐证材料
                 </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
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
               {/* <div style={{width:'250px',margin:'20px auto'}}>
                <div style={{margin:'10px auto'}}>
                  <Button type="primary" style={{float:'left',marginBottom:'30px'}} onClick={this.downPage}>议题申请单下载</Button>
                </div>
              </div>*/}
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


    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.topicApply,
    ...state.topicApply
  };
}
export default connect(mapStateToProps)(TopicDetails);
