/**
 * 作者：郭银龙
 * 日期：2020-5-14
 * 邮箱：guoyl@itnova.com.cn
 * 功能：图片上传
 */
import Cookie from 'js-cookie';
import {Button, Upload, message} from 'antd';

class FileUpload extends React.Component{
  uploadFile = {
    name: 'filename',
    // multiple: true,
    showUploadList: true,
    action: '/filemanage/fileupload',
    data:{
      argappname:'portalFileUpdate',
      argtenantid:Cookie.get('tenantid'),
      arguserid:Cookie.get('userid'),
      argyear:new Date().getFullYear(),
      argmonth:new Date().getMonth()+1,
      argday:new Date().getDate(),
    },
  };
  onChange = (info) => {
    info.fileList.map((v, i) => {
      if(v.response!=undefined){
        v.name = v.response.filename.OriginalFileName;
        v.uid = v.response.filename.FileId;
        v.url = v.response.filename.RelativePath;
        v.status = 'done'
      }
    })
    if (info.file.status === 'done') {
      if (info.file.response.RetCode === '1') {
        this.updateFilePath(info.file.response, this.props.pageName, info.fileList);
        message.success(`${info.file.name} 导入成功！`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败！.`);
      }
    }
  };
  updateFilePath=(value, pageName)=>{
    this.props.dispatch({
      type: pageName + '/saveUploadFile',
      value:value
    })
  };
  handlePreview = (file) => { //图片预览
    this.props.dispatch({
        type: this.props.pageName+'/saveUploadFile',
        file,
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      })
  };
  onRemove = (file) => {
    this.props.dispatch({
        type: this.props.pageName+'/onRemove',
        file,
    })
  }
  getFile = () =>{
    if(this.props.fileList) {
      return this.props.fileList.map((v, i) => {
        return {
          name: v.RealFileName,
          uid: v.FileId,
          url: v.RelativePath,
          status: 'done',
          key: i
        }
      })
    }
  }
  render(){  
    console.log(this.props.loading,this.props.len)
    return(

        <div>
        {!this.props.loading?
          <Upload {...this.uploadFile} 
          defaultFileList = {this.getFile()} 
          onChange = {this.onChange}
          accept=".jpg,.jpeg,.gif,.png,.bmp,.svg" 
          listType="picture"
          onPreview={this.handlePreview}
          onRemove = {this.onRemove}
        >
          {
            this.props.len!=undefined && this.props.len < 8
            ?
            <span>
              <Button type="primary">上传</Button>
              <i style={{color:"red",marginLeft:'15px'}}>请上传图片</i>
            </span>
            : null
          }
          
          
        </Upload> 
        : 
        ''
        }
        {this.props.flag=='nullData'?
         <Upload {...this.uploadFile} 
         defaultFileList = {[]} 
         onChange = {this.onChange}
         accept=".jpg,.jpeg,.gif,.png,.bmp,.svg" 
         listType="picture"
         onPreview={this.handlePreview}
         onRemove = {this.onRemove}
       >
         {
           this.props.len!=undefined && 0<=this.props.len < 8
           ?
           <span>
             <Button type="primary">上传</Button>
             <i style={{color:"red",marginLeft:'15px'}}>请上传图片</i>
           </span>
           : null
         }
         
         
       </Upload> 
       :null
        }
        </div>
    )
  }
}
export default FileUpload;