/**
 * 作者：贾茹
 * 日期：2019-6-17
 * 邮箱：m18311475903@163.com
 * 功能：议题填报页面附件上传
 */
import Cookie from 'js-cookie';
import {Button, Upload, message} from 'antd';


class FileUpload extends React.Component{
  state={
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
      type:'topicWrite/saveUploadFile',
      value:value
    })
  };
  render(){
    return(
      <Upload {...this.state.uploadFile} showUploadList= {false} accept=".doc,.txt,.pdf,.docx">
        <Button type="primary">上传</Button>
        <i style={{color:"red",marginLeft:'15px'}}>推荐pdf、不能上传压缩包</i>
      </Upload>
    )
  }
}
export default FileUpload;
