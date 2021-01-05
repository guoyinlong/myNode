/**
 * 作者：郭银龙
 * 日期：2019-5-11
 * 邮箱：guoyl@itnova.com.cn
 * 功能：图片展示组件
 */
import {Upload} from 'antd';

class PicShow extends React.Component{
  state={
  };
  render(){
		let {fileList} = this.props
		let fileListData = fileList.map((v, i) => {
			return {
				name: v.RealFileName,
				uid: v.FileId,
				url: v.RelativePath,
				status: 'done',
				key: i
			}
		})
    return(
			<Upload 
			fileList={fileListData}
			showUploadList = {{showRemoveIcon: false}}
		accept=".jpg,.jpeg,.gif,.png,.bmp,.svg" 
		listType="picture-card"
			onPreview={this.props.handlePreview}
      >
      </Upload>
    )
  }
}
export default PicShow;