/**
 * 作者：贾茹
 * 日期：2019-9-17
 * 邮箱：m18311475903@163.com
 * 功能：院领导身份证复印件使用附件上传
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
      type:'leaderIDReset/saveUploadFile',
      value:value
    })
  };
  render(){
    return(
      <Upload {...this.state.uploadFile} showUploadList= {false} accept=".jpg,.png,.webp,.pdf">
        <Button type="primary">上传</Button>
        <i style={{color:"red",marginLeft:'15px'}}>只能上传PDF文件或者图片</i>
      </Upload>
    )
  }
}
export default FileUpload;
