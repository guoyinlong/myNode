/**
 * 作者：罗玉棋
 * 日期：2019-12-11
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评-三度年度个人考核述职报告上传
 */
import Style from '../../../components/employer/Report.less';
import Cookies from 'js-cookie';
import * as service from '../../../services/leader/leaderservices';
import FILES from '../../../assets/Images/employer/files.png';
import message from '../../../components/commonApp/message'
import { Button, Upload, Icon } from 'antd';

const staffId = Cookies.get('userid');
// const importYear = new Date().getFullYear().toString();
const importSeason = (new Date().getMonth() + 1).toString();
const importDay = new Date().getDate().toString();
/**
 * 作者：罗玉棋
 * 日期：2019-12-11
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评-三度年度个人考核述职报告上传
 */

function beforeUpload(file) {
  if(file.type === 'application/pdf'){

     if(file.size / 1024 / 1024 >1){
      message.warning(`上传失败！文件大小大于1M`,5," ")
     return false
     }else{
      return true 
     }
  }else{
    message.warning(`上传的格式为应为pdf`,5," ")
    return false
  }
}

class Report extends React.Component {
  
  state = {
    fileName:'',
    import: {
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.pdf',
      beforeUpload:beforeUpload,
      onChange:(info)=> {
       // console.log(info)

        if (info.file.status === 'done') {
          // const fileName=info.file.name
          // if(fileName.substring(fileName.indexOf(".")+1).toLowerCase()!="pdf"){
          //   message.warning(`上传的格式为应为pdf`,5," ")
          //   return
          // }
          // if(info.file.originFileObj.size>1000*1024){
          //   message.warning(`上传失败！文件大小大于1M`,5," ")
          //   return
          // }
          if (info.file.response.RetCode == '1') {
            this.updateFilePath(info.file.response.outsourcer.RelativePath);
            //message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！.`,5," ");
          }
        }
      }
    }
  }

  componentWillReceiveProps(nextProps){
    
    if(nextProps.year !== this.props.year){
      this.props = nextProps
      this.init()
    }
  }

  async init(){
    const { staff_id,year } = this.props;
    if(staff_id && year){
      try{
        // let res=await service.leaderScoreSearch({
        //   transjsonarray:JSON.stringify({"condition":{"staff_id":staff_id,"year":year}}),
        // })
         let res=await service.leaderReportQuery({"arg_year":year,"arg_staffid":staff_id})

        if(res.RetCode==='1' && res.DataRows  && res.DataRows.length){
          this.setState({
            fileName:res.DataRows[0].pf_url,
          })
        }
      }catch (e){
        message.error(e.message,2," ")
      }
    }else{
      message.error("未获取参数！",2," ")
    }
    
  }

  async updateFilePath(file){
    const { staff_id,year } = this.props;
    const {fileName} = this.state;
    let postData=[];
    let data={update:{report_url:file},condition:{staff_id:staff_id,year:year}}
    postData.push(data)

    try{
      let res=await service.reporturlupdate({
        transjsonarray:JSON.stringify(postData)
      })
      if(res.RetCode==='1'){
        this.setState({
          fileName:file,
        })
        if(fileName){
          message.success("更新成功！",2," ")
        }else{
          message.success("提交成功！",2," ")
        }
      }else{
        message.error("上传失败！",2," ")
      }
    }catch (e){
      message.error(e.message,2," ")
    }
  }


  render(){
    const { fileName} = this.state;
    const { is_edit,year,allowUploadYear} = this.props;
    const uploadButton = (
      <Button type='primary' style={{float:'right',marginTop: '35px'}}>
      <Icon type="upload" /> {fileName ? "述职报告修改" : "述职报告提交"}
    </Button>
    );
    return(
      <div className={Style.top} style={{background:"#ffffff",border:"none",marginBottom:"10px"}}>
        <div className={Style.title}>
          <img className={Style.img} src={FILES}/>
          <div className={Style.tip}>
            {is_edit == 'true' ? 
              <Upload 
              action = {`/filemanage/fileupload?argappname=leader&argtenantid=10010&arguserid=${staffId}&argyear=${year}&argmonth=${importSeason}&argday=${importDay}`}
                {...this.state.import}  style={{float:'right',marginTop: '-20px'}}>
              {uploadButton}
              </Upload>
            : null}
            
            <div>相关文件&nbsp;&nbsp;<span style={{color:"red",fontSize:"14px"}}>(注意 ：上传述职文件只能为pdf格式 , 文件大小在1M以内 )</span></div>
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
