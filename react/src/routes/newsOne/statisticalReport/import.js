/**
 * 作者：郭银龙
 * 日期：2020-10-8
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 文件上传
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
            this.updateFilePath(info.file.response,this.props.pageName);
            message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`);
          }
        }
      }
    },
  };
  //上传
  updateFilePath=(value,pageName)=>{
    this.props.dispatch({
      type:this.props.pageName+'/saveUploadFile',
      value:value
    })
  };

  render(){
    return(
      <Upload {...this.state.uploadFile} showUploadList= {false} accept=".doc,.txt,.pdf,.docx,.jpeg">
        <Button type="primary">上传</Button>
        <i style={{color:"red",marginLeft:'15px'}}>请上传文件</i>
      </Upload>
    )
  }
}
export default FileUpload;
