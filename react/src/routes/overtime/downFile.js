/**
 * 作者：王福江
 * 创建日期：2019-05-28
 * 邮箱：wangfj80@chinaunicom.cn
 * 文件说明：项目组加班统计附件控件
 */
import { connect } from 'dva';
import Style from './upFile.less';
import { Upload, message, Button, Icon } from 'antd';
import Cookie from "js-cookie";

class DowmFile extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
    if(this.props.name == "" || !this.props.name) {
          this.setState({ fileList:[] });
      }
  }
  state = {
    fileList: this.props.filelist,
    isSuccess:this.props.isOk
  }

  render() {
    this.state.fileList = this.props.filelist;
    let fileObj = {};
    return (
      <div id="uploadFile" className={Style.uploadFile}>
        <Upload  {...fileObj} fileList={this.state.fileList}>
        </Upload>
      </div>
    );
  }
}
export default connect()(DowmFile);
