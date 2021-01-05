/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料上传页面
 */
import { connect } from 'dva';
import {Button ,Icon,message,Breadcrumb,Modal,Checkbox,Radio,Tag,Tooltip,Input} from 'antd';
import GoBack from '../../../components/commonApp/goback.js';
import {Link} from 'dva/router';
import styles from '../pageContainer.css';
import FileUpload from '../../../components/commonApp/fileUpdata.js';
import Cookie from 'js-cookie';
import moment from 'moment';
import DeptSelectShow from '../../../components/commonApp/deptSelectShow.js';
import AssignDept from '../../../components/commonApp/assignDept.js';
import AssignDocType from '../../../components/commonApp/assignDocType.js';
import {getUuid} from '../../../components/commonApp/commonAppConst.js';
const RadioGroup = Radio.Group;
import config from '../../../utils/config';

class TrainUpload extends React.Component {
  state={
    deptVisible:false,
    docTypeVisible:false, //lumj
    docTypeShow:'', //lumj
    deptSelectShowData:{},
    checkDeptList:[],
  }
  // 确定上传按钮
  handleOk = () => {
    const {dispatch}=this.props;
    var uploadList=this.refs.fileUploadList.getData();
    const {checkDeptList}=this.state;
    // var checkDeptList=this.refs.deptSelectComp.getData();
    if(checkDeptList.length==0){
      message.info('请选择可见部门！');
      return;
    }
    if(uploadList.length==0){
      message.info('请选择上传文件！');
      return;
    }
    var checkDeptName=[];
    for(var r=0;r<checkDeptList.length;r++){
      checkDeptName.push(checkDeptList[r].dept_name);
    }
    var insertFile=[];
    for(var i =0;i<uploadList.length;i++){
      var data={
          file_code:new Date().getTime().toString()+i,
          file_name:uploadList[i].RealFileName,
          file_type_id:'6',
          file_size:uploadList[i].size.toString(),
          file_permission:checkDeptName.join(','),
          file_operation:'0',
          file_uploader:Cookie.get('username'),
          file_upload_date: moment().format('YYYY-MM-DD HH:mm:ss'),
          file_url:uploadList[i].AbsolutePath,
          file_path:uploadList[i].RelativePath,
          file_hints:'0'
      }
      insertFile.push(data)
    }
    dispatch({
      type:'trainUpload/trainSrcAddFile',
      formData:{
        "transjsonarray":JSON.stringify(insertFile)
      }
    })
  }

  // 选择部门模态框显示
  showDeptModel=()=>{
    this.setState({deptVisible:true})
  }
  // 选择文档类别模态框显示 lumj
  showDocTypeModel=()=>{
    this.setState({docTypeVisible:true})
  }
  // 选择部门模态框关闭
  hideDeptModel=(flag)=>{
    if(flag=='confirm'){
      var deptSelectData=this.refs.assignDeptComp.getData();
      var deptSelectShow={};
      for(var i=0;i<deptSelectData.length;i++){
        if(deptSelectData[i].dept_name.indexOf('-')>0){
          var key=deptSelectData[i].dept_name.split('-')[0]=='联通软件研究院'?'联通软件研究院本部':deptSelectData[i].dept_name.split('-')[0]
          if(deptSelectShow[key]==undefined){
              deptSelectShow[key]=[]
          }
          deptSelectShow[key].push(deptSelectData[i].dept_name)
        }else{
          deptSelectShow[deptSelectData[i].dept_name]=[];
        }
      }
      this.setState({deptSelectShowData:deptSelectShow,checkDeptList:deptSelectData})
    }

    this.setState({deptVisible:false})

  }
  // 选择文档分类模态框关闭
  hideDocTypeModel=(flag)=>{
    if(flag=='confirm'){
      // this.setState({
      //   docTypeShow:'培训文档'
      // })
    }

    this.setState({docTypeVisible:false})

  }

  onChange = (e) => {
    this.setState({
      docTypeShow: e.target.value,
    });
  }



  componentWillMount(){
    if(window.sessionStorage['trainRole']=='0'){
      message.info('你没有上传培训资料的权限，请联系管理员！');
    }
  }
  render(){
    const {checkDeptList}=this.state;
    var deptSelectDefult=[];
    for(var i=0;i<checkDeptList.length;i++){
      deptSelectDefult.push(checkDeptList[i].dept_id)
    }
    return(
      <div className={window.sessionStorage.trainRole=='1'?styles['pageContainer']:styles['trainUser']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/trainingMore'>培训资料</Link></Breadcrumb.Item>
          <Breadcrumb.Item>上传资料</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>上传资料</h2>
          <div style={{marginTop:'10px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>可见部门：</span>
            <DeptSelectShow data={this.state.deptSelectShowData} />
            <Button type="primary" onClick={this.showDeptModel}>+</Button>
          </div>
          <Modal visible={this.state.deptVisible} width={config.DEPT_MODAL_WIDTH} key={getUuid(20,62)}  title="选择部门" onCancel={()=>this.hideDeptModel('cancel')}
              footer={[<Button key="back" size="large" onClick={()=>this.hideDeptModel('cancel')}>关闭</Button>,
              <Button key="submit" type="primary" size="large" onClick={()=>this.hideDeptModel('confirm')}>确定</Button>]}
            >
              <div>
                <AssignDept ref='assignDeptComp'  defaultDept={deptSelectDefult}/>
              </div>
          </Modal>



          <div style={{marginTop:'15px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>选择文件：</span>
            <span style={{display:'inline-block',width:'90%',verticalAlign:'middle',background:'#fff',borderRadius:'3px'}}>
              <FileUpload ref='fileUploadList'/>
            </span>
          </div>
          <div style={{marginTop:'20px',textAlign:'center'}}>
            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>上传</Button>
          </div>
        <GoBack/>


      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
  };
}

export default connect(mapStateToProps)(TrainUpload);
