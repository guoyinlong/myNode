/**
 * 作者：韩爱爱
 * 日期：2020-11-04
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import {Table, Tabs, Upload, Button, Col, Icon, Pagination,Typography} from 'antd';
const { TabPane } = Tabs;
const { Column, ColumnGroup } = Table;
import styles from './meetingStyle.less';
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
const myDate =new Date();
class contributionList  extends Component {
  constructor(props){
    super(props);
    this.state= {
      uploadFile:{
        name: 'file',
        accept:'.xlsx',
        multiple: false,
        showUploadList: false,
        action: '/microservice/newsmanager/activityUpload',
      },
      uploadFileTarin:{
        name: 'file',
        accept:'.xlsx',
        multiple: false,
        showUploadList: false,
        action: '/microservice/newsmanager/trainUpload',
        data:{
          uploadTime:myDate.getFullYear(),
        }
      }
    }
  }
  eachClicks =(value,value2,value3)=>{
    if(value =="eachJi"){//培训-个人培训记录
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainAppIndex',
      }));
    }if(value == "peiUpload"){//培训
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppWrite',
      }));
    }if(value == "gaoTrain"){ //培训-详情
      let str =value3.material==undefined ?false:true
      if(str != false){
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppDetail',
          query:{
            record:value3.id,
            name:'上传'
          }
        }));
      }else {
        this.props.dispatch(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/trainAppIndex/trainAppDetail',
          query:{
            record:value3.id
          }
        }));
      }
    }if(value== "eachStrut"){//    软件研究院重大活动支撑-上传
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportWrite',
      }));
    }if(value == "activityUpload"){ //软件研究院重大活动支撑-个人活动支撑
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
      }));
    }if(value == "majoTrain"){ //软件研究院重大活动支撑-详情
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportDetail',
        query: {
          approvalId:value3.id.toString()
        }
      }));
    }if(value == "anusTrain"){//组织本单位稿件报送-详情
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/manuscriptManagement/manuscriptDetails',
        query: {
          newsId:value3.newsId,
        }
      }));
    }if(value == "eachDetail"){//其他-详情
      this.props.dispatch(routerRedux.push({
        pathname:'/adminApp/newsOne/publicityChannelsIndex',
      }));
    }
  };
  materialModel =(value,value2,value3,value4)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'contributionList/'+value,
        record:value2,
        name:value3,
        oId:value4
      })
    }else{
      this.props.dispatch({
        type:'contributionList/'+value,
      })
    }
  };
  //额外的展开行
  addExpansionLine=(record,expanded)=>{
    //培训
    const  train_columns=[
      {  
        title: "序号",
        key:(text,record,index)=>`${index+1}`,
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '培训名称',
        dataIndex:'trainName',
        key: '',
        render : ( text,record,index )=>{
          return (<div>{text}</div>)
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: '',
        render : (text,record )=>{
          return(
            <div>
              <Button type="primary"
                      onClick = {(e)=>this.eachClicks('gaoTrain',e,record)}
              >
                详情
              </Button>
            </div>
          )
        }
      },
    ];


    //软件研究院重大活动支撑
    const  activity_columns=[
      {
        title: '序号',
        dataIndex: 'personnel_index',
        width:'8%',
        key: '',
        render : ( index )=>{
          return (<div>{index+1}</div>)
        }
      },
      {
        title: '活动的名称',
        dataIndex: 'activityName',
        width:'28%',
        key: '',
        render : ( text )=>{
          return (<div>{text}</div>)
        },
      },
      {
        title: '担任工作',
        dataIndex: 'job',
        width:'28%',
        key: '',
        render : ( text )=>{
          return (<div>{text}</div>)
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width:'10%',
        key: '',
        render : ( text,record )=>{
          return(
            <div>
              <Button type="primary"
                      onClick = {(e)=>this.eachClicks('majoTrain',e,record)}
              >
                详情
              </Button>
            </div>
          )
        },
      },
    ];
    //组织本单位稿件报送
    const  song_columns=[
      {
        title: '序号',
        dataIndex: 'personnel_index',
        key: '',
        render : ( index )=>{
          return (<div>{index+1}</div>)
        }
      },
      {
        title: '稿件名称',
        dataIndex: 'manuscript_name',
        key: '',
        render : ( text )=>{
          return (<div>{text}</div>)
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: '',
        render : ( text,record )=>{
          return(
            <div>
              <Button type="primary"
                      onClick = {(e)=>this.eachClicks('anusTrain',e,record)}
              >
                详情
              </Button>
            </div>
          )
        },
      },
    ];
    //其他
    const  qi_columns=[
      {
        title: '序号',
        dataIndex: 'personnel_index',
        key: '',
        render : ( index )=>{
          return (<div>{index+1}</div>)
        }
      },
      {
        title: '名称',
        dataIndex: 'appel_name',
        key: '',
        render : ( text )=>{
          return (<div>{text}</div>)
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: '',
        render : ( text,record )=>{
          return(
            <div>
              <Button type="primary"
                      onClick={(e)=>this.eachClicks("eachDetail", e,record)}>
                详情
              </Button>
            </div>
          )
        },
      },
    ];
    return(
      <Tabs activeKey={this.props.defaultActiveKey} onChange ={(e)=>this.materialModel("tabsChange",e,record)}>
        <TabPane tab="培训" key="1" style={{ height:'calc(100vh - 其他元素的高度和)' }}>
          {
            this.props.distButton =='0'?
            <div style={{padding:'10px',textAlign:'right',}}>
              {
                this.props.buttonDisplay == '0'?
                  <div>
                    <Button type="primary" onClick={(e)=>this.eachClicks("peiUpload", e)}>新增</Button>
                    <Button type="primary"
                            style={{ marginLeft:"10px"}}
                            onClick={(e)=>this.eachClicks("eachJi", e)}
                    >
                      个人培训记录
                    </Button>
                  </div>
                :
                  null
              }
            </div>
            :
            <div style={{padding:'10px',textAlign:'right',}}>
              {
                this.props.buttonDisplay == '0'?
                  <div>
                    <Button type="primary"
                            onClick={(e)=>this.materialModel('bulkDownload','培训',e)}
                    >
                      <Icon type = 'download'/>
                      下载模板
                    </Button>
                    <Upload
                      {...this.state.uploadFileTarin}
                      style={{ marginLeft:"10px"}}
                      className="avatar-uploader"
                      onChange={(info)=>this.materialModel('pictureChange','培训',info.file)}
                    >
                      <Button type="primary">批量上传</Button>
                    </Upload>
                    <Button type="primary"
                            style={{ marginLeft:"10px"}}
                            onClick={(e)=>this.eachClicks("eachJi", e)}
                    >
                      个人培训记录
                    </Button>
                  </div>
                  :
                  <div>
                    <Button type="primary"
                            onClick={(e)=>this.materialModel('bulkDownload','培训',e)}
                    >
                      <Icon type = 'download'/>
                      下载模板
                    </Button>
                    <Upload{...this.state.uploadFileTarin}
                           style={{ marginLeft:"10px"}}
                           className="avatar-uploader"
                           onChange={(info)=>this.materialModel('pictureChange','培训',info.file)}
                    >
                      <Button type="primary">批量上传</Button>
                    </Upload>
                  </div>

              }
            </div>
          }
          <Table
            columns={train_columns}
            dataSource={this.props.recordDataSource}
            bordered={true}
            pagination={ {
              current:Number(this.props.subDataCurrent),//当前页
              total:Number(this.props.subDataCount)  ,//数据总数
              pageSize :5,//每页条数
              onChange :(e,page) => this.materialModel('pageChange',e,page)
            } }
          />
        </TabPane>
        <TabPane tab="软件研究院重大活动支撑" key="2">
          {
            this.props.distButton =='0'?
              <div  style={{padding:'10px',textAlign:'right',}}>
                {
                  this.props.buttonDisplay == '0'?
                    <div>
                      <Button type="primary" onClick={(e)=>this.eachClicks("eachStrut", e)}>上传</Button>
                      <Button type="primary"
                              style={{ marginLeft:"10px"}}
                              onClick={(e)=>this.eachClicks("activityUpload", e)}
                      >
                        个人活动支撑
                      </Button>
                    </div>
                    :
                    null
                }
              </div>
            :
              <div  style={{padding:'10px',textAlign:'right',}}>
                {
                  this.props.buttonDisplay == '0'?
                    <div>
                      <Button type="primary"
                              onClick={(e)=>this.materialModel('bulkDownload','重大',e)}
                      >
                        <Icon type = 'download'/>下载模板
                      </Button>
                      <Upload
                        {...this.state.uploadFile}
                        style={{ marginLeft:"10px"}}
                        className="avatar-uploader"
                        onChange={(info)=>this.materialModel('pictureChange','重大',info.file)}
                      >
                        <Button type="primary">批量上传</Button>
                      </Upload>
                      <Button type="primary"
                              style={{ marginLeft:"10px"}}
                              onClick={(e)=>this.eachClicks("activityUpload", e)}
                      >
                        个人活动支撑
                      </Button>
                    </div>
                    :
                    <div>
                      <Button type="primary"
                              onClick={(e)=>this.materialModel('bulkDownload','重大',e)}
                      >
                        <Icon type = 'download'/>下载模板
                      </Button>
                      <Upload
                        {...this.state.uploadFile}
                        style={{ marginLeft:"10px"}}
                        className="avatar-uploader"
                        onChange={(info)=>this.materialModel('pictureChange','重大',info.file)}
                      >
                        <Button type="primary">批量上传</Button>
                      </Upload>
                    </div>
                }
              </div>
          }
          <Table columns={activity_columns}
                 dataSource={this.props.activity_data}
                 bordered={true}
                 pagination={ false }
          />
          <div style={{textAlign: 'center', marginTop: '20px'}}>
            {this.props.loading !== true ?
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <Pagination
                  current = {Number(this.props.subDataCurrent)} //当前页
                  total = {Number(this.props.subDataCount)}  //数据总数
                  pageSize = {5}//每页条数
                  onChange = {(e,page) => this.materialModel('handlePageChange',e,page)}
                />
              </div>
              :
              null
            }
          </div>
        </TabPane>
        <TabPane tab="组织本单位稿件报送" key="3">
          <Table
            columns={song_columns}
            dataSource={this.props.song_data}
            bordered={true}
            pagination={{
                pageSize:5,
                current: Number(this.props.subDataCurrent),
                total: Number(this.props.subDataCount),
                onChange: (e,page) => this.materialModel('pageChange',e,page,record.key)
            }}
          />
        </TabPane>
      </Tabs>
    )
  };
  render(){
    return(
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px',paddingBottom:'30px'}}>
        <h2 style = {{textAlign:'center',marginBottom:30}}>全院新闻工作贡献清单</h2>
        <div className={styles.opinionAddRoeDiv}>
          <Table dataSource={this.props.totalData}
                 pagination={false}
                 className = { styles.tableStyle}
                 onExpand={(e,record,expanded)=>this.materialModel('tableChang',e,record,expanded)}
                 expandedRowRender={this.addExpansionLine}//额外的展开行
                 bordered={true}
                 expandRowByClick={true}
                 expandedRowKeys={this.props.contractId}
            // scroll={{y:'100%'}}
          >
            <Column title="序号" dataIndex="key" key="key"  width= "8%"  ></Column>
            <Column title="姓名" dataIndex="userName" key="userName"  width= "10%"/>
            <Column title="培训" dataIndex="train" key="train"  width= "15%"/>
            <ColumnGroup title="软件研究院重大活动支撑">
              <Column title="摄影" dataIndex="photography" key="photography"  width= "7%"/>
              <Column title="摄像" dataIndex="camera" key="camera" width= "7%" />
              <Column title="H5制作" dataIndex="h5" key="h5" width= "7%" />
              <Column title="视频剪辑" dataIndex="mv" key="mv" width= "7%" />
              <Column title="新闻稿" dataIndex="news" key="news"  width= "7%"/>
              <Column title="微博稿" dataIndex="sina" key="sina" width= "7%"/>
              <Column title="其他" dataIndex="other" key="other" width= "7%"/>
            </ColumnGroup>
            <ColumnGroup title="组织本单位稿件报送" width= "8%">
              <Column title="审稿及稿件二次编辑" dataIndex="second" key="second" />
            </ColumnGroup>
          </Table>
          <div style={{textAlign: 'center', marginTop: '20px'}}>
            {this.props.loading !== true ?
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <Pagination
                  current = {Number(this.props.totalCurrent)} //当前页
                  total = {Number(this.props.totalCount)}  //数据总数
                  pageSize = {10}//每页条数
                  onChange = {(e,page) => this.materialModel('totalPageChange',e,page)}
                />
              </div>
              :
              null
            }
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.contributionList,
    ...state.contributionList
  };
}
export default connect(mapStateToProps)(contributionList);
