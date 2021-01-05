/**
 * 作者：郭银龙
 * 日期：2020-10-8
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 文件上传
 */
import Cookie from 'js-cookie';
import {Button, Upload, message,Icon} from 'antd';

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
  //   //上传
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



// class FileUpload extends React.Component{
//   uploadFile = {
//     name: 'filename',
//     // multiple: true,
//     showUploadList: true,
//     action: '/filemanage/fileupload',
//     data:{
//       argappname:'portalFileUpdate',
//       argtenantid:Cookie.get('tenantid'),
//       arguserid:Cookie.get('userid'),
//       argyear:new Date().getFullYear(),
//       argmonth:new Date().getMonth()+1,
//       argday:new Date().getDate(),
//     },
//   };
//   onChange = (info) => {
//     info.fileList.map((v, i) => {
//       if(v.response!=undefined){
//         v.name = v.response.filename.OriginalFileName;
//         v.uid = v.response.filename.FileId;
//         v.url = v.response.filename.RelativePath;
//         v.status = 'done'
//       }
//     })
//     if (info.file.status === 'done') {
//       if (info.file.response.RetCode === '1') {
//         this.updateFilePath(info.file.response, this.props.pageName, info.fileList);
//         message.success(`${info.file.name} 导入成功！`);
//       } else if (info.file.status === 'error') {
//         message.error(`${info.file.name} 上传失败！.`);

//           }
//         }
//       }

//   //上传
//   updateFilePath=(value,pageName)=>{
//     this.props.dispatch({
//       type:this.props.pageName+'/saveUploadFile',
//       value:value
//     })
//   };
//   handlePreview = (file) => { //图片预览
//     this.props.dispatch({
//         type: this.props.pageName+'/saveUploadFile',
//         file,
//         previewImage: file.url,
//         previewVisible: true,
//       })
//   };
//   onRemove = (file) => {
//     this.props.dispatch({
//         type: this.props.pageName+'/onRemove',
//         file,
//     })
//   }
//   getFile = () =>{
//     if(this.props.fileList) {
//       return this.props.fileList.map((v, i) => {
//         return {
//           name: v.RealFileName,
//           uid: v.FileId,
//           url: v.RelativePath,
//           status: 'done',
//           key: i
//         }
//       })
//     }
//   }

//   render(){
//     return(
//       <div>
//       {!this.props.loading?
//         <Upload {...this.uploadFile} 
//         defaultFileList = {this.getFile()} 
//         // fileList = {this.getFile()} 
//         onChange = {this.onChange}
//         accept=".jpg,.jpeg,.gif,.png,.bmp,.svg" 
//         listType="picture"
//         onPreview={this.handlePreview}
//         onRemove = {this.onRemove}
//       >
//         {
//           this.props.len!=undefined && this.props.len < 3
//           ?
//           <span>
//              <button type="primary" 
//                 className="control-item button upload-button" 
//                 data-title="插入图片">
//                   <Icon type="picture" />
//                 </button>
//           </span>
//           : null
//         }
//       </Upload> 
//       : 
//       ''
//       }
//       </div>

//     )
//   }
// }
// export default FileUpload;

