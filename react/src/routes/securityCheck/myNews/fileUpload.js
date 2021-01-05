/**
 * 作者：郭银龙
 * 日期：2020-5-14
 * 邮箱：guoyl@itnova.com.cn
 * 功能：图片上传
 */
import Cookie from 'js-cookie';
import {Button, Upload, Modal, message} from 'antd';


class FileUpload extends React.Component{
  state={
    uploadFile:{
      name: 'filename',
      multiple: true,
      showUploadList: true,
    //   fileList:[],
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
            this.updateFilePath(info.file.response);
            message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`);
          }
        }
      }
    },
  };
  updateFilePath=(value)=>{
      console.log(value)
    this.props.dispatch({
      type:'yuanGongTongZhiZhengGai/saveUploadFile',
      value:value
    })
  };
  handlePreview = (file) => { //图片预览
    this.props.dispatch({
        type:'yuanGongTongZhiZhengGai/saveUploadFile',
        file,
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      })
};
onRemove = (file) => {
    this.props.dispatch({
        type:'yuanGongTongZhiZhengGai/onRemove',
        file,
      })
}
  render(){
    return(
      <Upload {...this.state.uploadFile}  
      accept=".jpg,.jpeg,.gif,.png,.bmp,.svg" 
      listType="picture"
      onPreview={this.handlePreview}
      onRemove = {this.onRemove}
      >
        <Button type="primary">上传</Button>
        <i style={{color:"red",marginLeft:'15px'}}>请上传图片</i>
      </Upload>
    )
  }
}
export default FileUpload;