/**
 * 作者：翟金亭
 * 创建日期：2019-09-06
 * 邮箱：zhaijint3@chinaunicom.cn
 * 文件说明：附件查看
 */
import { connect } from 'dva';
import Style from './upFile.less';
import { Upload } from 'antd';

class CheckFile extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    if (this.props.name == "" || !this.props.name) {
      this.setState({ fileList: [] });
    }
  }
  state = {
    fileList: this.props.filelist,
    isSuccess: this.props.isOk
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
export default connect()(CheckFile);
