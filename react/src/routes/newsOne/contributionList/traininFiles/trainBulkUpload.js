/**
 * 作者：韩爱爱
 * 日期：2020-12-22
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-培训批量上传
 */
import React, { Component }  from  'react'
import {connect} from "dva";
import {Table, Tabs, Upload, Button, Col, Icon, Pagination, message} from 'antd';
const { TabPane } = Tabs;
const { Column, ColumnGroup } = Table;
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
class TrainBulkUpload  extends Component {
  constructor(props){
    super(props);
    this.state= {
      uploadFile:{
        name: 'filename',
        multiple: true,
        showUploadList: false,
        action: '/filemanage/fileupload',
        data:{
          argappname:'writeFileUpdate',
          argtenantid:Cookie.get('tenantid'),
          arguserid:Cookie.get('userid'),
          argyear:new Date().getFullYear(),
          argmonth:new Date().getMonth()+1,
          argday:new Date().getDate()
        },
      },
    }
  }
  //图片格式
  beforeUpload =(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('您只能上传JPG / PNG文件!');
    }
    return isJpgOrPng
  };
  returnModel =(value,value2,value3,value4)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'TrainBulkUpload/'+value,
        record : value2,
        name : value3,
        dataNmae:value4
      })
    }else{
      this.props.dispatch({
        type:'TrainBulkUpload/'+value
      })
    }
  };
  render() {
    const zhongLineTrain =[
      {
        title: '序号',
        dataIndex: 'index',
        width:'4%',
        key: '',
        render: (index)=> {
          return(index+1)
        }
      },
      {
        title: '提交人',
        dataIndex: 'createUserName',
        width:'6%',
        key: '',
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width:'10%',
        key: '',
      },
      {
        title: '活动时间',
        dataIndex: 'activityTime',
        width:'6%',
        key: '',
      },{
        title: '担任工作',
        dataIndex: 'job',
        width:'10%',
        key: '',
      },{
        title: '活动证明材料',
        dataIndex: 'proveImage',
        width:'12%',
        key: '',
        render: (text, record)=> {
          return(
            <div>
              <Upload
                {...this.state.uploadFile}
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={this.beforeUpload}
                onChange={(info)=>this.returnModel('imgChange','培训证明材料',info.file,record)}
              >
                { this.props.loading1[record.index] != false?
                  <img src={text.RelativePath}  alt="avatar" style={{ width: '100%'}} />
                  :
                  <div>
                    <Icon type={this.props.loading1[record.index] ? 'loading' : 'plus'} />
                    <div>请上传图片</div>
                  </div>
                }
              </Upload>
            </div>
          )
        }
      }
      // ,{
      //   title: '操作',
      //   dataIndex: 'operate',
      //   width: '4%',
      //   key: '',
      //   render: (text, record) => {
      //     return (
      //       <div>
      //         <Button type="primary"
      //                 size='small'
      //                 onClick={(e) => this.returnModel("eachDetail", e, record)}>
      //           删除
      //         </Button>
      //       </div>
      //     )
      //   },
      // }
    ];
    //线上
    const onLineTrain=[
      {
        title: '序号',
        dataIndex: 'index',
        width:'4%',
        key: '',
        render: (index)=> {
          return(index+1)
        }
      },
      {
        title: '提交人',
        dataIndex: 'personName',
        width:'6%',
        key: '',
      },
      {
        title: '培训名称',
        dataIndex: 'trainName',
        width:'10%',
        key: '',
      },
      {
        title: '培训时间',
        dataIndex: 'trainTime',
        width:'10%',
        key: '',
      },
      {
        title: '培训类型',
        dataIndex: 'trainType',
        width:'6%',
        key: '',
      },
      {//线上
        title: '培训证明材料',
        dataIndex: 'trainMaterials',
        width:'12%',
        key: '',
        render: (text, record)=> {
          return (
            <div>
              <Upload
                {...this.state.uploadFile}
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={this.beforeUpload}
                onChange={(info)=>this.returnModel('imgChange','培训证明材料',info.file,record)}
              >
                {
                  this.props.trainTypeStr[record.index] == true?
                    <div>
                      { this.props.loading1[record.index] != false?
                        <img src={text.RelativePath}  alt="avatar" style={{ width: '100%'}} />
                        :
                        <div>
                          <Icon type={this.props.loading1[record.index] ? 'loading' : 'plus'} />
                          <div>请上传图片</div>
                        </div>
                      }
                    </div>
                    :
                    null
                }
              </Upload>
            </div>
          )
        }
      },
      {
        title: '签到表和调差问卷',
        dataIndex: 'trainForm',
        width:'10%',
        key: '',
        render: (text, record)=> {
          return (
            <Upload
              {...this.state.uploadFile}
              listType="picture-card"
              className="avatar-uploader"
              beforeUpload={this.beforeUpload}
              onChange={(info)=>this.returnModel('imgChange','签到表',info.file,record)}
            >
              {
                this.props.trainTypeStr[record.index] == false?
                  <div>
                    { this.props.loading2[record.index] != false?
                      <img src={text.RelativePath}  alt="avatar" style={{ width: '100%'}} />
                      :
                      <div>
                        <Icon type={this.props.loading2[record.index] ? 'loading' : 'plus'} />
                        <div>请上传图片</div>
                      </div>
                    }
                  </div>
                  :
                  null
              }
            </Upload>
          )
        }
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operate',
      //   width:'4%',
      //   key: '',
      //   render : ( text,record )=>{
      //     return(
      //       <div>
      //         <Button type="primary"
      //                 size='small'
      //                 onClick={(e)=>this.returnModel("eachDetail", e,record)}>
      //           删除
      //         </Button>
      //       </div>
      //     )
      //   },
      // }
    ];
    return(
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px',paddingBottom:'30px'}}>
        <h2 style = {{textAlign:'center',marginBottom:30}}>{this.props.personName}上传清单</h2>
        <div style={{width:'250px'}}>
          <Button type="primary" style={{marginBottom:'10px'}} onClick={()=>this.returnModel("submissionTopic")}>提交</Button>
        </div>
        {
          this.props.query == '重大'?
            <Table
              columns={zhongLineTrain}
              dataSource={this.props.bulkSource}
              bordered={true}
              pagination={ {
                current:Number(this.props.subDataCurrent),
                total:Number(this.props.subDataCount),
                pageSize:5,
                onChange:(e,page) => this.returnModel('handlePageChange',e,page)
              } }
            />
            :
            <Table
              columns={onLineTrain}
              dataSource={this.props.bulkSource}
              bordered={true}
              pagination={ {
                current:Number(this.props.subDataCurrent),
                total:Number(this.props.subDataCount),
                pageSize:5,
                onChange:(e,page) => this.returnModel('handlePageChange',e,page)
              } }
            />
        }

      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.TrainBulkUpload,
    ...state.TrainBulkUpload
  };
}
export default connect(mapStateToProps)(TrainBulkUpload);
