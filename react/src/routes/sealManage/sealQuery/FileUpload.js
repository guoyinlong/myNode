/**
 * 作者：窦阳春
 * 日期：2019-10-8
 * 邮箱：douyc@itnova.com.cn
 * 功能：图片上传
 */
import Cookie from 'js-cookie';
import {Button, Upload, message} from 'antd';


class FileUpload extends React.Component{
  state={
    sss: this.props.sss,
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
        argday:new Date().getDate(),
      },
      onChange:(info)=> {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode === '1') {
            this.updateFilePath(info.file.response, this.props.sss);
            //message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`);
          }
        }
      }
    },
  };
  updateFilePath=(value, sss)=>{
    this.props.dispatch({
      type:'managerSealQuery/saveUploadFile',
      value:value,
      sss
    })
  };
  render(){
    return(
      <Upload {...this.state.uploadFile} showUploadList= {false} accept=".jpg,.png,.webp,.pdf">
        <Button type="primary">上传</Button>
        <i style={{color:"red",marginLeft:'15px'}}>请上传图片</i>
      </Upload>
    )
  }
}
export default FileUpload;