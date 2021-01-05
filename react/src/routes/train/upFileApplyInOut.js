/**
 * 作者：翟金亭
 * 创建日期：2019-09-09
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：培训课程申请附件上传
 */
import { connect } from 'dva';
import Style from './upFile.less';
import { Upload, message, Button, Icon } from 'antd';
import Cookie from "js-cookie";

class UpFileApplyInOut extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
    if(this.props.name == "" || !this.props.name) {
          this.setState({ fileList:[] });
      }
  }
  state = {
      fileList: [{
        uid: 1,
        name: this.props.name,
        status: 'done',
        url: this.props.url
      }],
      isSuccess:this.props.isOk,
      ifSaveDelete:'0',
      oldfile:{
        uid: 1,
        name: this.props.name,
        status: 'done',
        url: this.props.url
      },
      newfile:{
        uid: 1,
        name: this.props.name,
        status: 'done',
        url: this.props.url
      },
  }
  //文件上传修改路径
  handleChange = (info) => {
    const {dispatch} = this.props;
    let fileList = info.fileList;

    if(info.file.status === 'removed') {
      this.state.ifSaveDelete = '1';
      if(this.state.newfile.uid===1){
        let RelativePath = this.state.newfile.url;
        dispatch({
          type:'train_in_approval_model/deleteFile',
          RelativePath
        });
      }else{
        let RelativePath = this.state.newfile.response.file.RelativePath;
        dispatch({
          type:'train_in_approval_model/deleteFile',
          RelativePath
        });
      }
    }else{
      if (info.file.status === 'done') {
        let oldfile = this.state.oldfile;
        let newfile = this.state.fileList;
        dispatch({
          type:'train_in_approval_model/changeNewFile',
          oldfile,
          newfile,
        });
      } else if (info.file.status === 'error') {
        message.error('上传失败');
      }
    }
    console.log("11111"+JSON.stringify(fileList));
    let newfileList = [];
    if (fileList.length>1){
      newfileList.push(fileList[1]);
      this.state.newfile = fileList[1];
      this.state.oldfile = fileList[0];
    } else if(fileList.length=1){
      if(this.state.ifSaveDelete === '0'){
        newfileList.push(fileList[0]);
        this.state.newfile = fileList[0];
      }else {
        this.state.ifSaveDelete = '0';
      }
    }
    if(info.file.status === 'removed'){
      newfileList = [];
    }
    fileList = newfileList;
    this.setState({ fileList });
  }

  render() {
    let fileObj = {
      action: '/filemanage/fileupload',
      name: 'file',
      method: "POST",
      data:{
        argappname:'human',
        argtenantid: Cookie.get('tenantid'),
        arguserid:Cookie.get('userid'),
        argyear:new Date().getFullYear(),
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      onChange: this.handleChange
    };
    return (
      <div id="uploadFile" className={Style.uploadFile}>
        <Upload  {...fileObj} fileList={this.state.fileList}>
          <Button>
            <Icon type="upload" />上传附件
          </Button>
        </Upload>
      </div>
    );
  }
}
export default connect()(UpFileApplyInOut);
