/**
 * 作者：窦阳春
 * 日期：2020-10-22
 * 邮箱：douyc@itnova.com.cn
 * 功能：文件上传
 */
import Cookie from 'js-cookie';
import {Button, Upload, message} from 'antd';

class FileUpload extends React.Component{
  state = {
  }
  uploadFile = {
    name: 'filename',
    multiple: false,
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
    let fileList = info.fileList;
    fileList = fileList.filter((file) => {
      if (file.response) {
        message.destroy()
        message.success("上传成功")
        return file.response.RetVal === 'success';
      }
      return true;
    });
    var file = [];
    fileList.map((v, i)=> { //只保存最后一个文件
      if(i == fileList.length-1) {
        file.push(v)
      }
    }) 
    this.props.dispatch({
      type: 'newsConfigurationIndex/saveUploadFile',
      file
    })
  };
  onRemove = () => {
    this.props.dispatch({
      type: 'newsConfigurationIndex/saveUploadFile',
      file: []
    })
  }
  render(){  
    const {fileData} = this.props;
    return(
        <div>
          <Upload {...this.uploadFile} 
            onChange = {this.onChange}
            fileList={fileData}
            accept=".xlsx,.xls,.csv,.pdf,.​xlsm" 
            onRemove = {this.onRemove}
            >
            <span>
              <Button type="primary">上传</Button>
            </span>
          </Upload>
        </div>
    )
  }
}
export default FileUpload;