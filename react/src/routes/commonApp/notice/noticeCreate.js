/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页创建公告页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { Button, Input, Upload, Icon, message, Modal, Checkbox, DatePicker, TreeSelect, Breadcrumb, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;
import {Link} from "dva/router";
const Dragger = Upload.Dragger;
import FileUpload from '../../../components/commonApp/fileUpdata.js';
import EditorConvertToHTML from '../../../components/commonApp/Editor.js';
import styles from'../pageContainer.css';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import {argtenantid,getUuid,OU} from '../../../components/commonApp/commonAppConst.js';
import createNStyle from './noticeMore.css';
import DeptSelectShow from '../../../components/commonApp/deptSelectShow.js';
import AssignDept from '../../../components/commonApp/assignDept.js';
import moment from  'moment';
import config from '../../../utils/config';

const TextArea = Input.TextArea;
class NoticeCreate extends React.Component {
  state = {
    deptVisible:false,
    noticeId:'',
    cancelModel:false,
    deptSelectShowData:{},
    checkDeptList:[],
    noticeContent: ''
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
          var key=deptSelectData[i].dept_name.split('-')[0]==OU?'联通软件研究院本部':deptSelectData[i].dept_name.split('-')[0]
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
  // 发布公告or保存公告
  getNoticeMessage=(tag)=>{
    const {noticeEndTIme,inputValue,checkDeptList}=this.state;
    var uploadList=this.refs.FileUploadList.getData();
    var noticeId=this.state.noticeId;
    const {dispatch}=this.props;
    if(tag=='1'){
      if(!inputValue){
        message.info('请输入公告标题！');
        return;
      }
      if(!noticeEndTIme){
        message.info('请选择公告结束时间！');
        return;
      }
      if(checkDeptList.length==0){
        message.info('请指派可见部门！');
        return;
      }
    }
    noticeId= noticeId?noticeId:getUuid(32,62);
    // 多个文件
    var transjsonarray=[{
          "opt": "insert",
          "table": "info",
          "data": {
              "ID": noticeId,
              "n_title":inputValue,
              "n_content": this.state.noticeContent,
              "end_date": noticeEndTIme,
              "createuserid": Cookie.get('userid'),
              "createusername": Cookie.get('username'),
              "updated_byuserid": Cookie.get('userid'),
              "updated_byusername": Cookie.get('username'),
              'status':tag
          }
      }];
    for(var f=0;f<uploadList.length;f++){
      transjsonarray.push({
            "opt": "insert",
            "table": "files",
            "data":{
                "nf_id": uploadList[f].uuid,
                "nf_notice_id": noticeId,
                "nf_file_name": uploadList[f].OriginalFileName,
                "nf_file_url": uploadList[f].AbsolutePath,
                "nf_file_path": uploadList[f].RelativePath
            }
        })
    }
    // 多个部门
    for(var d=0;d<checkDeptList.length;d++){
      transjsonarray.push({
            "opt": "insert",
            "table": "deps",
            "data":{
                "ID":getUuid(32,62),
                "notice_id": noticeId,
                "notice_obvid": checkDeptList[d].dept_id,
                "notice_obvname":checkDeptList[d].dept_name,
                "notice_obvtype": '0'
            }
        })
    }
    dispatch({
      type:'createNotice/noticeAdd',
      formData:{
        transjsonarray:JSON.stringify(transjsonarray)
      }
    });
    this.setState({noticeId});
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
      noticeEndTIme:dateString
    })
  }
  // 限制结束时间的选择
  disabledDate=(value)=>{
    if(value){
      var today =  moment().valueOf();
      return value.valueOf() < today
    }
  }
  componentWillMount(){
    if(window.sessionStorage.noticeRole=='0'){
      message.info('您没有创建公告的权限，请联系管理员！')
    }
  }

  setNoticeContent = (e) => {
    this.setState({
      noticeContent: e.target.value
    });
  };

  render(){
    const{cancelModel,checkDeptList}=this.state;
    var deptSelect=[];
    for(var i=0;i<checkDeptList.length;i++){
      deptSelect.push(checkDeptList[i].dept_id)
    }
    // let flieListInfo={}
    return(
      <div className={window.sessionStorage.noticeRole=='1'?createNStyle.containerN:createNStyle.containerUser}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/noticeMoreManager'>公告信息</Link></Breadcrumb.Item>
          <Breadcrumb.Item>创建公告</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>创建公告</h2>
        <div>
          <div className={createNStyle.contentN}>
            <span className={createNStyle.contentTitle}>公告标题</span>
            <Input placeholder="请输入公告标题" style={{width:'93%'}} onChange={this.getInputValue}/>
          </div>
          <div className={createNStyle.contentN} style={{fontSize:'16px',lineHeight:'26px'}}>
            <span className={createNStyle.contentTitle}>公告正文</span>
            <div style={{background:'#fff',minHeight:'300px',padding:'20px'}}>
              <TextArea
                rows={10}
                value={this.state.noticeContent}
                onChange={this.setNoticeContent}
                />
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
                <DatePicker onChange={this.onChangeDatePicker} disabledDate={this.disabledDate} />
              </Col>
            </Row>
          </div>
          <div style={{ margin:'16px 0'}} >
            <FileUpload ref='FileUploadList' content='上传附件'/>
          </div>
          <div style={{clear:'both',textAlign:'center'}}>
            <Button size="large" onClick={()=>this.cancelCreate('0')}>取消</Button>
            <Button type="primary" size="large" onClick={()=>this.getNoticeMessage('1')} style={{marginLeft:'20px'}}>发布</Button>
          </div>
          <Modal visible={cancelModel} title="确定取消创建公告？" onCancel={()=>this.cancelCreate('1')}
              footer={[<Button key="back" size="large" onClick={()=>this.cancelCreate('1')}>关闭</Button>,
              <Button key="submit" type="primary" size="large" onClick={()=>this.cancelCreate('2')}>确定</Button>]}
            >
              <div>
                点击确定按钮后，您所输入的内容将会被丢掉!
              </div>
          </Modal>
          <Modal visible={this.state.deptVisible} width={config.DEPT_MODAL_WIDTH} key={getUuid(20,62)}  title="选择部门" onCancel={()=>this.hideDeptModel('cancel')}
              footer={[<Button key="back" size="large" onClick={()=>this.hideDeptModel('cancel')}>关闭</Button>,
              <Button key="submit" type="primary" size="large" onClick={()=>this.hideDeptModel('confirm')}>确定</Button>]}
            >
              <div>
                <AssignDept ref='assignDeptComp'  defaultDept={deptSelect}/>
              </div>
          </Modal>
        </div>
      </div>
      // <Button onClick={()=>this.getNoticeMessage('0')}>保存</Button>
    )
  }
}
function mapStateToProps (state) {
  // const{ouDeptListData}=state.createNotice;
  return {
    // ouDeptListData
  };
}
export default connect(mapStateToProps)(NoticeCreate);
