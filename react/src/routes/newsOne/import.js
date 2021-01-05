/**
*  作者: 窦阳春
*  创建日期: 2020-11-17
*  邮箱：douyc@itnova.com.cn
 * 文件说明：实现导入功能
 */
import {Button, Upload, message} from 'antd';

class FileUpload extends React.Component{
  state={
    uploadFile:{
      name: 'file',
      multiple: false,
      showUploadList: false,
      // action: '/assetsmanageservice/assetsmanage/assets/assetsImport',
      action: '/microservice/newsmanager/pubPlanUpload',

      //导入
      onChange:(info)=>{
        const { passFuc } = this.props;
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
          if(info.file.response.retCode === '1'){
            message.info("导入成功！");
            passFuc(info.file.response.retCode)
          }
          else{
              message.error(info.file.response.retVal)
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      }
    }
  };
  render(){
    return(
      <Upload {...this.state.uploadFile} >
         <Button type="primary"  >
           {'导入'}
         </Button>
      </Upload>
    )
  }
}
export default FileUpload;
