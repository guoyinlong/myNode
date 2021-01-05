/**
 * 作者：窦阳春
 * 日期：2020-11-13
 * 邮箱：douyc@itnova.com.cn
 * 功能：图片展示组件
 */
import {Upload, Icon, message } from 'antd';
import Cookie from 'js-cookie';

class PicShow extends React.Component{
  state={
  };
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
        // message.success("上传成功")
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
      type: 'creatExcellence/saveUploadFile',
      file,
      id: this.props.id,
      advancedUnitType: this.props.advancedUnitType
    })
  };
  onRemove = () => {
    this.props.dispatch({
      type: 'creatExcellence/saveUploadFile',
      id: this.props.id,
      advancedUnitType: this.props.advancedUnitType,
      file: []
    })
  }
  render(){
    let {fileList, flag, uploadImage} = this.props;
		let fileListData = fileList.map((v, i) => {
			return {
				uid: i,
				url: v.RelativePath,
				status: 'done',
			}
		})
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">上传图片</div>
			</div>
		);
    return(
			<Upload {...this.uploadFile}
			fileList={flag == 1 ? fileListData: uploadImage}
      accept=".jpg,.jpeg,.gif,.png,.bmp,.svg" 
      listType="picture-card"
			onPreview={this.props.handlePreview}
			onChange = {this.onChange}
			onRemove = {this.onRemove}
      >
				{fileList.length == 1 || uploadImage.length == 1 ? null : uploadButton}
      </Upload>
    )
  }
}
export default PicShow;