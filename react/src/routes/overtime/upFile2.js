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

class UpFile2 extends React.Component {
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
      /*console.log("删除成功");
      console.log(JSON.stringify(this.state.oldfile));
      console.log(JSON.stringify(this.state.newfile));*/
      if(this.state.newfile.uid===1){
        //console.log("aaaaaaaaaa");
        let RelativePath = this.state.newfile.url;
        //console.log(RelativePath);
        dispatch({
          type:'create_approval_model/deleteFile',
          RelativePath
        });
        let apply_stats_id = this.props.department_stats_id;
        dispatch({
          type:'create_approval_model/deleteTeamFile',
          apply_stats_id
        });
      }else{
        //console.log("bbbbbbbbbb");
        let RelativePath = this.state.newfile.response.file.RelativePath;
        //console.log(RelativePath);
        dispatch({
          type:'create_approval_model/deleteFile',
          RelativePath
        });
      }
      //console.log(JSON.stringify(fileList));
    }else{
      if (info.file.status === 'done') {
        console.log("111111111111111");
        console.log(JSON.stringify(this.state.oldfile));
        console.log(JSON.stringify(this.state.newfile));
        console.log("111111111111111");
        let oldfile = this.state.oldfile;
        let newfile = this.state.fileList;
        let apply_stats_id = this.props.department_stats_id;
        dispatch({
          type:'create_approval_model/changeNewFile',
          oldfile,
          newfile,
          apply_stats_id,
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
      //message.success('重新上传成功');
      //console.log("重新上传成功");
      //console.log(JSON.stringify(newfileList));
    } else if(fileList.length=1){
      if(this.state.ifSaveDelete === '0'){
        newfileList.push(fileList[0]);
        this.state.newfile = fileList[0];
        //this.state.oldfile = {};
        //message.success('上传成功');
        //console.log("重新上传成功");
        //console.log(JSON.stringify(newfileList));
      }else {
        this.state.ifSaveDelete = '0';
      }
    }
    if(info.file.status === 'removed'){
      newfileList = [];
      //删除上传文件
      //message.success('删除成功');
    }
    fileList = newfileList;
    this.setState({ fileList });
  }

  render() {
    console.log("this.state.ifSaveDelete"+this.state.ifSaveDelete);

    let filedata = this.props.filelist;
    if (filedata.length>0) {
     /* this.state.fileList= [{
        uid: 1,
        name: filedata[0].name,
        status: 'done',
        url: filedata[0].url
      }];*/
    }

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
export default connect()(UpFile2);
