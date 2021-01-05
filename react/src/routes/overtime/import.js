/**
 *  作者: 翟金亭
 *  创建日期: 2019-05-15
 *  邮件：zhaijt3@chinaunicom.cn
 *  文件说明：加班申请信息导入功能
 */
import React, { Component }  from 'react';
import {Button, Upload, message} from 'antd';

class FileUpload extends Component{
  constructor(props) {
    super(props);
    this.setFlag = this.setFlag.bind(this);
  }

  state={
    uploadFile:{
      name: 'overtime',
      multiple: false,
      showUploadList: false,
      action: '/filemanage/fileupload',
      //导入
      onChange:(info)=>{
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 批量导入成功.`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 批量导入失败.`);
        }
      }
    }
  };
  setFlag(){
    const { setdataflag } = this.props;
    setdataflag({content:true});
  }
  render(){
    return(
      <Upload {...this.state.uploadFile} >
         <Button type="primary"  onClick={this.setFlag}>
           {'批量导入'}
         </Button>
      </Upload>
    )
  }
}
export default FileUpload;
