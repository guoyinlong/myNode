/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：上传文件组件
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {Button, Upload, Icon, message} from 'antd';
const Dragger = Upload.Dragger;
import {getUuid} from './commonAppConst.js';


class FileUpload extends React.Component{
  state={
    uploadFile:{
      name: 'filename',
      multiple: true,
      showUploadList: true,
      action: '/filemanage/fileupload',
      data:{
        argappname:'portalFileUpdate',
        argtenantid:'10010',
        arguserid:Cookie.get('userid'),
        argyear:new Date().getFullYear(),
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      onChange:(info)=>{
        const status = info.file.status;
        let fileList = info.fileList;
         fileList = fileList.filter((file) => {
           if (file.response) {
             if (status === 'done') {
               if(info.file.response.RetCode=='1'){
                 info.file.response.filename.size=info.file.size;
                 info.file.response.filename.uid=info.file.uid;
                 info.file.response.filename.status='done';
                 info.file.response.filename.name=info.file.response.filename.OriginalFileName;
                 info.file.response.filename.url=info.file.response.filename.RelativePath;
                 return true;
               }else if (status === 'error') {
                 message.error(`${info.file.name} 上传失败.`);
                 return false;
               }
             }
           }
           return true;
         });
         this.setState({
           fileList
         });
      }
    },
    fileList:[]
  }
  getData=()=>{
    const {fileList}=this.state;
    if(fileList == undefined || fileList == '' || fileList == null){
      message.info('请选择上传文件！');
      return;
    }
    for(var i=0;i<fileList.length;i++){
      if(fileList[i].response){
        fileList[i].response.filename.uuid=getUuid(32,62);
        fileList[i]=fileList[i].response.filename;
      }
    }
    return fileList;
  }
  componentWillReceiveProps(newProps){
    if(newProps.fileLists){
      this.setState({
        fileList:newProps.fileLists
      })
    }
  }
  componentDidMount(){
    console.log(this.props);
    this.setState({fileList:this.props.fileLists})
  }
  render(){
    console.log(this.state.fileList);

    // <p style={{fontSize:'30px',color:'#FA7252'}}>
    //
    // </p>
    return(
        <Dragger {...this.state.uploadFile} fileList={this.state.fileList}>
          {this.props.fileStyle?
          <div style={{padding:'20px'}}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或者拖动文件到此区域</p>
          </div>
            :
          <p style={{padding:'5px'}}>
            <span style={{fontSize:'20px',marginRight:'6px',color:'#FA7252'}}>
            <Icon type="upload" /></span>{this.props.content?this.props.content:'上传文件'}
          </p>}
        </Dragger>
    )
  }
}
export default FileUpload;
