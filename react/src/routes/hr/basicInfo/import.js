/**
 *  作者: 邓广晖
 *  创建日期: 2017-08-11
 *  邮件：denggh6@chinaunicom.cn
 *  文件说明：实现员工信息导入功能
 *  修改人：耿倩倩
 *  邮箱：gengqq3@chinaunicom.cn
 *  修改时间：2017-09-11
 */
import Cookie from 'js-cookie';
import {Button, Upload, message} from 'antd';
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现文件上传和导入功能
 */
class FileUpload extends React.Component{
  state={
    uploadFile:{
      name: 'staff',
      multiple: false,
      showUploadList: false,
      action: '/filemanage/fileupload',
      accept: '.xls,.xlsx',
      data:{
        argappname:'hr',
        argtenantid: Cookie.get('tenantid'),
        arguserid:Cookie.get('userid'),
        argyear:'staffimport', // 固定字符串
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      //导入
      onChange:(info)=>{
        if (info.file.status !== 'uploading') {
          //console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if(info.file.response.RetCode === '1'){
            let postData = {};
            postData["arg_tenantid"] = Cookie.get('tenantid');
            postData["xlsfilepath"] = info.file.response.staff.RelativePath;
            //postData["arg_create_userid"] = Cookie.get('userid');

            const {dispatch} = this.props;
            dispatch({
              type:'staffImport/staffImport',
              param:postData
            });
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
