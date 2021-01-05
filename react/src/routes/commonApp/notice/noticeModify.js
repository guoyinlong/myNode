/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页修改公告页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {Icon,Spin,Badge,Button,Input , Upload,message, Modal ,Checkbox ,DatePicker ,TreeSelect,Breadcrumb,Row,Col }from 'antd'
// import GoBack from '../../../components/commonApp/goback.js';
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
import {Link} from 'dva/router';
const Dragger = Upload.Dragger;
import FileUpload from '../../../components/commonApp/fileUpdata.js';
import EditorConvertToHTML from '../../../components/commonApp/Editor.js';
import styles from'../pageContainer.css';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import {argtenantid,getUuid} from '../../../components/commonApp/commonAppConst.js';
import createNStyle from './noticeMore.css';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
import DeptSelectShow from '../../../components/commonApp/deptSelectShow.js';
import AssignDept from '../../../components/commonApp/assignDept.js';
import config from '../../../utils/config';

class NoticeModify extends React.Component{
  state={
    inputValue:'',
    deptVisible:false,
    deptSelectInfo:[]
  }
  // 选择部门模态框显示
  showDeptModel=()=>{
    this.setState({deptVisible:true})
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
      this.setState({deptSelectShowData:deptSelectShow,deptSelectInfo:deptSelectData})

    }
    this.setState({deptVisible:false})

  }

  // 点击取消按钮
  cancelCreate=(flag)=>{
    if(flag=='0'){
      this.setState({
        cancelModel:true
      })
    }else if(flag=='1'){
      this.setState({
        cancelModel:false
      })
    }else if(flag=='2'){
      this.setState({
        cancelModel:false
      });
      history.go(-1);
    }

  }
  // 获取输入框value
  getInputValue=(e)=>{
    this.setState({
      inputValue:e.target.value
    })
  }
  // 结束时间
  onChangeDatePicker=(date, dateString)=>{
    this.setState({
      endDate:dateString
    })
  }
  // 限制结束时间的选择
  disabledDate=(value)=>{
    if(value){
      var today =  moment().valueOf();
      return value.valueOf() < today
    }
  }

  // 找出新增的
  getChangeData=(oldData,newData,oldFlag,newFlag)=>{
    var changeData={};
    changeData.Del=[];
    changeData.Insert=[];
    var insertTag=true;
    var delTag=true;
    for(var i=0;i<oldData.length;i++){
      for(var r=0;r<newData.length;r++){
        if(oldData[i][oldFlag]==newData[r][newFlag]){
          delTag=false;
          break;
        }else{
          delTag=true;
        }
      }
      if(delTag==true){
        changeData.Del.push(oldData[i])
      }
    }
    for(var n=0;n<newData.length;n++){
      for(var s=0;s<oldData.length;s++){
        if(oldData[s][oldFlag]==newData[n][newFlag]){
          insertTag=false;
          break;
        }else{
          insertTag=true;
        }
      }
      if(insertTag==true){
        changeData.Insert.push(newData[n]);
      }
    }
    return changeData;
  }
  // 点击发布 获取所有输入值
  handleIssue=()=>{
    const {noticeFileList,noticeDeptList,dispatch}=this.props;

    const {deptSelectInfo}=this.state;
    var fileUpdataInfo=this.refs.fileuploadComp.getData();
    var editorInfo=this.refs.editorData.getData();
    var file=this.getChangeData(noticeFileList,fileUpdataInfo,'nf_file_path','RelativePath')
    var dept=this.getChangeData(noticeDeptList,deptSelectInfo,'notice_obvid','dept_id')
    var transjsonarray=[{
      "opt": "update",
      "table": "info",
      "data": {
      "n_title": this.state.inputValue,
      "n_content":editorInfo,
      "end_date": this.state.endDate,
      "createuserid":Cookie.get('userid'),
      "createusername":Cookie.get('username'),
      "updated_byuserid":Cookie.get('userid'),
      "updated_byusername":Cookie.get('username'),
      'status':'1'
      },
      "condition":{"ID":this.props.location.query.id}
    }];
    for(var i=0;i<file.Del.length;i++){
      transjsonarray.push({
        "opt": "update",
        "table": "files",
        "data": {
         "nf_state":'1'
        },
        "condition":{"nf_id":file.Del[i].nf_id}
      })
    }
    for(var a=0;a<file.Insert.length;a++){
      transjsonarray.push({
        "opt": "insert",
        "table": "files",
        "data": {
          "nf_id": file.Insert[a].uuid,
          "nf_notice_id": this.props.location.query.id,
          "nf_file_name": file.Insert[a].RealFileName,
          "nf_file_url": file.Insert[a].AbsolutePath,
          "nf_file_path": file.Insert[a].RelativePath
        }
      })
    }
    for(var DD=0;DD<dept.Del.length;DD++){
      transjsonarray.push({
        "opt": "delete",
        "table": "deps",
        "data": {"ID":dept.Del[DD].ID}
      })
    }
    for(var DI=0;DI<dept.Insert.length;DI++){
      transjsonarray.push({
        "opt": "insert",
        "table": "deps",
        "data": {
            "ID": getUuid(32,62),
            "notice_id": this.props.location.query.id,
            "notice_obvid": dept.Insert[DI].dept_id,
            "notice_obvname": dept.Insert[DI].dept_name,
            "notice_obvtype": "0"
        }
      })
    }
    dispatch({
      type:'noticeModify/noticeAddM',
      formData:{
        transjsonarray:JSON.stringify(transjsonarray)
      }
    })

  }
  componentWillMount(){
    const{dispatch}=this.props;
    const noticeId=this.props.location.query.id;
    if(window.sessionStorage.noticeRole=='0'){
      message.info('您没有修改公告的权限，请联系管理员！');
      return;
    }
    // 查询公告内容
    dispatch({
      type:'noticeModify/noticeCntQuery',
      formData:{
        transjsonarray:JSON.stringify(
          {"condition":{id:noticeId}}
        )
      }
    })
    // 查询公告附件
    dispatch({
      type:'noticeModify/noticeFileQuery',
      formData:{
        transjsonarray:JSON.stringify(
          {"condition":{nf_notice_id:noticeId,nf_state:'0'}}
        )
      }
    })
    // 查询公告可见部门
    dispatch({
      type:'noticeModify/noticeDeptQuery',
      formData:{
        transjsonarray:JSON.stringify(
          {"condition":{notice_id :noticeId}}
        )
      }
    })
    this.setState({inputValue:this.props.location.query.title,endDate:this.props.location.query.endDate})
  }
  componentWillReceiveProps(newProps){
    if(newProps.noticeDeptList.length!=0){
      var deptSelectData=newProps.noticeDeptList;
      var deptSelectShow={};
      var deptDefultInfo=[];
      for(var i=0;i<deptSelectData.length;i++){
        deptDefultInfo[i]={};
        deptDefultInfo[i].dept_id=deptSelectData[i].notice_obvid;
        if(deptSelectData[i].notice_obvname.indexOf('-')>0){
          var key=deptSelectData[i].notice_obvname.split('-')[0]=='联通软件研究院'?'联通软件研究院本部':deptSelectData[i].notice_obvname.split('-')[0]
          if(deptSelectShow[key]==undefined){
              deptSelectShow[key]=[]
          }
          deptSelectShow[key].push(deptSelectData[i].notice_obvname)
        }else{
          deptSelectShow[deptSelectData[i].notice_obvname]=[];
        }
      }
      this.setState({deptSelectShowData:deptSelectShow,deptSelectInfo:deptDefultInfo})
    }
  }
  render(){
    const{noticeCntList,noticeFileList}=this.props;
    const {deptSelectInfo}=this.state;
    var showFileList=[];
    for(var r=0;r<noticeFileList.length;r++){
      showFileList.push(
        {uid: r+1,
        name:noticeFileList[r].nf_file_name,
        status: 'done',
        uuid:noticeFileList[r].nf_id,
        url:noticeFileList[r].nf_file_path,
        AbsolutePath:noticeFileList[r].nf_file_url,
        RelativePath:noticeFileList[r].nf_file_path,
        OriginalFileName:noticeFileList[r].nf_file_name}
      )
    }
    var deptSelectDefult=[];
    for(var i=0;i<deptSelectInfo.length;i++){
      deptSelectDefult.push(deptSelectInfo[i].dept_id)
    }

    return(
      <div className={window.sessionStorage.noticeRole=='1'?createNStyle.containerN:createNStyle.containerUser}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/noticeMoreManager'>公告信息</Link></Breadcrumb.Item>
          <Breadcrumb.Item>修改公告</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>修改公告</h2>
        <div className={createNStyle.contentN}>
          <span className={createNStyle.contentTitle}>公告标题</span>
          <Input placeholder="请输入公告标题" style={{width:'93%'}}
          value={this.state.inputValue} onChange={this.getInputValue}/>
        </div>
        <div className={createNStyle.contentN}>
          <span className={createNStyle.contentTitle}>公告正文</span>
          <div style={{background:'#fff',minHeight:'300px',padding:'20px',fontSize:'16px',lineHeight:'26px'}}>
            <EditorConvertToHTML data={noticeCntList} ref='editorData'/>
          </div>
        </div>
        <div className={createNStyle.contentN}>
          <Row>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
              <span className={createNStyle.contentTitle} style={{width:'9.33%'}}>可见部门</span>
              <DeptSelectShow data={this.state.deptSelectShowData} />
              <Button type="primary" onClick={this.showDeptModel}>+</Button>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <span className={createNStyle.contentTitle} style={{width:'28%'}}>结束时间</span>
              <DatePicker value={moment(this.state.endDate, dateFormat)} disabledDate={this.disabledDate} onChange={this.onChangeDatePicker} />
            </Col>
          </Row>
        </div>
        <div  style={{ margin:'16px 0'}}>
          <FileUpload ref='fileuploadComp' fileLists={showFileList} content='上传附件' />
        </div>
        <div style={{clear:'both',textAlign:'center'}}>
          <Button size="large" onClick={()=>this.cancelCreate('0')}>取消</Button>
          <Button type="primary" size="large" onClick={()=>this.handleIssue()} style={{marginLeft:'20px'}}>发布</Button>
        </div>
        <Modal visible={this.state.cancelModel} title="确定取消修改公告？" onCancel={()=>this.cancelCreate('1')}
            footer={[<Button key="back" size="large" onClick={()=>this.cancelCreate('1')}>关闭</Button>,
            <Button key="submit" type="primary" size="large" onClick={()=>this.cancelCreate('2')}>确定</Button>]}
          >
            <div>
              点击确定按钮后，您所输入的内容将会被丢掉!
            </div>
        </Modal>
        <Modal visible={this.state.deptVisible} key={getUuid(20,62)} width={config.DEPT_MODAL_WIDTH}  title="选择部门" onCancel={()=>this.hideDeptModel('cancel')}
            footer={[<Button key="back" size="large" onClick={()=>this.hideDeptModel('cancel')}>关闭</Button>,
            <Button key="submit" type="primary" size="large" onClick={()=>this.hideDeptModel('confirm')}>确定</Button>]}
          >
            <div>
              <AssignDept ref='assignDeptComp'  defaultDept={deptSelectDefult} />
            </div>
        </Modal>

      </div>

    )
  }
}
function mapStateToProps (state) {
  const{noticeCntList,noticeFileList,noticeDeptList,noticeDeptFlag,noticeFileFlag,noticeCntFlag}=state.noticeModify
  return {
    noticeCntList,
    noticeFileList,
    noticeDeptList,
    noticeDeptFlag,
    noticeFileFlag,
    noticeCntFlag,
  };
}

export default connect(mapStateToProps)(NoticeModify);
