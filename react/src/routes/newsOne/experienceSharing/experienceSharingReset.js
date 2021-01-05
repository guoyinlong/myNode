/**
 * 作者：贾茹
 * 日期：2020-10-22
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-案例与经验分享修改页面
 */
import React from 'react';
import {connect } from 'dva';
import { Table, Spin, Button, Select,Input,Pagination,Popconfirm ,Modal,Upload,} from "antd";
import styles from '../index.less';
import Cookie from 'js-cookie';
//import DeptRadioGroup from './deptModal.js';
const { TextArea } = Input;
const myDate = new Date();
const date = myDate.toLocaleString( ).substr(0,10);

class ExperienceSharingReset extends React.Component{
    state = {
        isUploadingFile: false, // 是否正在上传文件
        uploadFile:{
            name: 'filename',
            multiple: true,
            showUploadList: true,
            action: '/filemanage/fileupload',
            data:{
              argappname:'writeFileUpdate',
              argtenantid:Cookie.get('tenantid'),
              arguserid:Cookie.get('userid'),
              argyear:new Date().getFullYear(),
              argmonth:new Date().getMonth()+1,
              argday:new Date().getDate()
            },
            onChange:(info)=> {
              if (info.file.status === 'done') {
                if (info.file.response.RetCode === '1') {
                  this.updateFilePath(info.file.response);
                  //message.success(`${info.file.name} 导入成功！`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败！.`);
                }
              }
            }
          },
      };
      updateFilePath=(value)=>{
        this.props.dispatch({
          type:'experienceSharingReset/saveUploadFile',
          value:value
        })
      };

      //传递数据给model层
      returnModel =(value,value2)=>{
        if(value2!==undefined){
          this.props.dispatch({
            type:'experienceSharingReset/'+value,
            record : value2,
          })
        }else{
          this.props.dispatch({
            type:'experienceSharingReset/'+value,
          })
        }
      };
      //点击返回跳转到列表首页
      handleReturn = ()=>{
        this.props.dispatch(routerRedux.push({
          pathname: 'adminApp/newsOne/publicityChannelsIndex',
        }))
      };
      fileColumns = [
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
          width: '40%',
          render: (text) => {
            return <div style={{ textAlign: 'left' }}>{text}</div>;
          },
        }, {
          title: '操作',
          dataIndex: '',
          key:'opration',
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
                &nbsp;&nbsp;
    
                <Popconfirm
                  title="确定删除该文件吗?"
                  onConfirm={(e) => this.deleteUpload(e,record)}
                >
                  <Button
                    type="primary"
                    size="small"
                  >
                    删除
                  </Button>
                </Popconfirm>
    
    
              </div>
            );
          },
        }, ];
    //点击下载附件
    downloadUpload = (e,record) =>{
      let url =record.RelativePath;
      window.open(url);
    }; 
    //点击删除删除文件
    deleteUpload = (e,value)=>{
          this.props.dispatch({
            type:'experienceSharingReset/deleteUpload',
            record:value
          })
        };
  render() {
    return (
      <div className={styles.outerField}>
      <div className={styles.out}>
          <div className={styles.title}>
            案例与经验分享申请修改
          </div>       
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               标题
            </span>
            <span className={styles.lineColon3}>:</span>
            <Input value={ this.props.caseTitle } style={{width:'500px'}} onChange={(e)=>this.returnModel('handleCaseTitleChange',e)}/>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
                分享部门
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>111</span>
            
          </div>
          
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
                分享人
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>111</span>
            
          </div>
          <div style={{marginTop:'10px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                  <b style={{color:"red",marginRight:'5px'}}>*</b>
                  分享成果
             </span>
            <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
            {/* <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData}/> */}
            <Upload {...this.state.uploadFile} showUploadList= {false} /* accept=".doc,.txt,.pdf" */>
                <Button type="primary">上传</Button>
                <i style={{color:"red",marginLeft:'15px'}}>如需上传视频请将视频链接写入文档内上传</i>
            </Upload>
            <Table
              columns={ this.fileColumns }
              loading={ this.props.loading }
              dataSource={ this.props.shareResult }
              className={ styles.tableStyle }
              pagination = { false }
              style={{marginTop:'10px',width:'700px'}}
              bordered={ true }
            />
          </div>
        
          <div style={{width:'252px',margin:'20px auto'}}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" style={{float:'left'}} onClick={()=>this.returnModel('saveShare')}>保存</Button>
              <Button type="primary" style={{marginLeft:'30px'}} onClick={()=>this.returnModel('submission')}>提交</Button>
              <Button style = {{marginLeft: 30}}  size="default" type="primary" >
                                <a href="javascript:history.back(-1)">取消</a>
                              </Button>
            </div>
          </div>
          
      </div>
    </div>
    );
  }
}

function mapStateToProps (state) {
   
  return {
    loading: state.loading.models.experienceSharingReset,
    ...state.experienceSharingReset
  };
}
export default connect(mapStateToProps)(ExperienceSharingReset);
