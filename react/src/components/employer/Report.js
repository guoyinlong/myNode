/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-31
 * 文件说明：正态分布组件，展示考核周期及分布群体信息
 */
import Style from './Report.less';
import Cookies from 'js-cookie';
import * as service from '../../services/leader/leaderservices';
import FILES from '../../assets/Images/employer/files.png';
import message from './../commonApp/message'
import { Button, Upload, Icon } from 'antd';

const staffId = Cookies.get('userid');
const importYear = new Date().getFullYear().toString();
const importSeason = (new Date().getMonth() + 1).toString();
const importDay = new Date().getDate().toString();

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-31
 * 功能：正态分布组件，展示考核周期及分布群体信息
 */
class Report extends React.Component {

  state = {
    fileName:'',
    import: {
        action: "/filemanage/fileupload?argappname=leader&argtenantid=10010&arguserid="+staffId+"&argyear="+importYear +
        "&argmonth="+importSeason+"&argday="+importDay,
        method: "POST",
        name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
        accept: '.doc,.docx,.pdf,.ppt,.pptx',
      onChange:(info)=> {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode == '1') {
            this.updateFilePath(info.file.response.outsourcer.RelativePath);
            //message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`);
          }
        }
      }
    }
  }

  componentDidMount(){
    this.init(this.props);
  }

  async init(props){
    const { staff_id,year } = props;
    if(staff_id && year){
      try{
        let res=await service.leaderScoreSearch({
          transjsonarray:JSON.stringify({"condition":{"staff_id":staff_id,"year":year}}),
        })
        if(res.RetCode==='1' && res.DataRows  && res.DataRows.length){
          this.setState({
            fileName:res.DataRows[0].pf_url,
          })
        }
      }catch (e){
        message.error(e.message)
      }
    }else{
      message.error("未获取参数！")
    }
    
  }

  async updateFilePath(file){
    const { staff_id,year } = this.props;
    const {fileName} = this.state;
    let postData=[];
    let data={update:{pf_url:file},condition:{staff_id:staff_id,year:year}}
    postData.push(data)

    try{
      let res=await service.leaderScoreUpdate({
        transjsonarray:JSON.stringify(postData)
      })
      if(res.RetCode==='1'){
        this.setState({
          fileName:file,
        })
        if(fileName){
          message.success("更新成功！")
        }else{
          message.success("提交成功！")
        }
      }else{
        message.error("上传失败！")
      }
    }catch (e){
      message.error(e.message)
    }
  }


  render(){
    const { fileName} = this.state;
    const { is_edit} = this.props;
    const uploadButton = (
      <Button type='primary' style={{float:'right',marginTop: '-20px'}}>
      <Icon type="upload" /> {fileName ? "述职报告修改" : "述职报告提交"}
    </Button>
    );
    return(
      <div className={Style.top}>
        <div className={Style.title}>
          <img className={Style.img} src={FILES}/>
          <div className={Style.tip}>
            {is_edit == 'true' ? 
              <Upload {...this.state.import}  style={{float:'right',marginTop: '-20px'}}>
              {uploadButton}
              </Upload>
            : null}
            
            <div>相关文件</div>
            <span style={{fontSize:'14px'}}>年度述职报告：
              {fileName ? <a href={fileName}>{fileName.split('/')[fileName.split('/').length-1]}</a> : '暂未提交'}
              </span>
          </div>
        </div>
      </div>
    )
  }
}
export default Report;
