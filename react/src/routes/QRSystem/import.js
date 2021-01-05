/**
*  作者: 卢美娟
*  创建日期: 2018-04-23
*  邮箱：lumj14@chinaunicom.cn
 * 文件说明：实现批量导入功能
 */
import Cookie from 'js-cookie';
import {Button, Upload, message} from 'antd';

class FileUpload extends React.Component{
  state={
    uploadFile:{
      name: 'qrcode',
      multiple: false,
      showUploadList: false,
      action: '/assetsmanageservice/assetsmanage/assets/assetsImport',

      //导入
      onChange:(info)=>{
        const { passFuc } = this.props;
        if (info.file.status !== 'uploading') {
          //console.log(info.file, info.fileList);

        }
        if (info.file.status === 'done') {
          if(info.file.response.RetCode === '1'){
            message.info("导入成功！");
            passFuc(info.file.response.assetsInfoList)
          }
          else if(info.file.response.RetCode === '2'){
            message.info(info.file.response.RetVal);
            for(let i = 0; i < info.file.response.failedRows.length; i++){
              message.info(info.file.response.failedRows[i]);
            }
          }
          else{
              console.log(info.file.response)
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
