/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页页面
 */
import { Row, Col, Modal, Table, Pagination,Button,Carousel,Checkbox } from 'antd';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import MainpageUl from '../../components/commonApp/mainpageUl';
import MyPlatform from '../../components/commonApp/myPlatform';
import { routerRedux } from 'dva/router';
import {createNotice_roleid} from '../../components/commonApp/commonAppConst.js';
import styles from './commonAppInfo.less';
import { leaderReportQuery } from '../../services/leader/leaderservices.js';
import memorial from "../../assets/Images/encouragement/Picture_w.png"
import memorial2 from "../../assets/Images/encouragement/Picture_m.png"
import company  from "../../assets/Images/encouragement/Picture.png"
import * as commonAppService from '../../services/commonApp/commonAppService.js';
import message from '../../components/commonApp/message';

let leder_year = new Date().getFullYear().toString();
let leder_season = Math.floor((new Date().getMonth() + 1) / 3).toString();
if(leder_season === '0'){
  leder_year = (new Date().getFullYear() - 1).toString()
}
class CommonApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      lederReport:undefined,
      tipvisible: false,
      checked:false,
      isBirthday:0,
      isJoinUnicomDay:0,
      Birthday_content:"",
      UnicomDay_content:"",
      gender:"",
      needtip:false
    }
  }

  // 消息查看
  lookDetailM = (item)=> {
    const {dispatch} =this.props;
    // 设为已读
    dispatch({
      type:'commonApp/messageReadFlag',
      formData:{
        'arg_staff_id':Cookie.get('userid'),
        'arg_mess_id':item.mess_id,
        'arg_page_size':5,
        'arg_page_current':1,
        'arg_mess_staff_name_from':''
      }
    });
    if(item.mess_staff_name_from === '工时管理') {
      dispatch(
        routerRedux.push({
          pathname: 'projectApp/projMonitor/change',
        })
      );
    }
  }

  // 公告查看
  noticeDetail=async(item)=>{
    const { dispatch } = this.props;
  // const {dispatch,usersHasPermissionId}=this.props;
    var visibleCreateNotice=false;
  // for(var i=0;i<usersHasPermissionId.length;i++){
    //  if(Cookie.get('userid')==usersHasPermissionId[i].staff_id){
    //    visibleCreateNotice=true;
    //  }
    //}
  
     if(item.n_title.indexOf(leder_year)!=-1&&item.n_title.indexOf("述职报告")!=-1){
    let { DataRows }=await leaderReportQuery({"arg_year":leder_year})
    DataRows.map((item,index)=>item.key=index+1+"")
     this.setState({
      lederReport:DataRows,
      visible: true,
     })
    }else{
      dispatch({
        type: 'commonApp/getLeaderFileList',
        payload: {
          transjsonarray: JSON.stringify({"condition":{"year":leder_year-1}})
        },
      });

      dispatch({
        type:'commonApp/readrecordInsert',
        formData:{
          arg_notice_id:item.ID,
          arg_userid:Cookie.get('userid'),
          item:item,
          visibleCreateNotice
        }
       })
    }
  }
  // 培训资料查看
  trainDetail=(i)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'trainingMore/filedownload',
      arg_file_id:i.id
    })
    // dispatch({
    //   type:'commonApp/fileLoadNum',
    //   formData:{
    //     postData:{
    //       transjsonarray:JSON.stringify([
    //           {
    //             update:{"file_hints":(parseInt(i.file_hints)+1).toString()},
    //             condition:{"file_code":i.file_code}
    //           }
    //       ])
    //     },
    //     file_upload_date:'1',
    //     file_type_id:'6'
    //   }
    // })
    window.open(i['file_path'],'_blank')
  }
  // 常用表单查看
  srcDetail=(i)=>{
  	const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:i.path
    }));
    //window.open(i.path,'_blank')
  }

  async componentWillMount(){
    const {dispatch} =this.props;
    let result=await commonAppService.needTips({arg_staff_id:Cookie.get('userid')})
    if(result.RetCode=="1"){
      this.setState({
        needtip:result.RetVal=="1"?true:false
        //needtip:false
      })
    }

  let{DataRows,RetCode}=await commonAppService.festivalquery({arg_staff_id:Cookie.get('userid')})
   if(RetCode=="1"&&Object.keys(DataRows).length!=0){
    let tipvisible=this.state.needtip&&((DataRows.isBirthday=="1")||(DataRows.isJoinUnicomDay=="1")?true:false)
    this.setState({
    tipvisible: tipvisible,
    isBirthday:DataRows.isBirthday,
    isJoinUnicomDay:DataRows.isJoinUnicomDay,
    Birthday_content:DataRows.content1,
    UnicomDay_content:DataRows.content2,
    gender:DataRows.gender
    })
   }else{
     message.warning("返回信息有误")
   }
   //这里需要判断用户是否已经勾选不在提示和当前日期是不是其中的一个节日
   
    // 消息
    dispatch({
      type:'commonApp/messageQuery',
      formData:{
        'arg_mess_staff_id_to':Cookie.get('userid'),
        'arg_page_size':5,
        'arg_page_current':1,
        'arg_mess_staff_name_from':''
      }
    });
    // 待办
    dispatch({
      type:'commonApp/getUserId',
      payload:Cookie.get('loginname')
    });
    // 公告
    dispatch({
      type:'commonApp/noticeInfoQuery',
      formData:{
        arguserid:Cookie.get('userid'),
        arg_page_size:5,
        arg_page_current:1
      }
    });
    // 公告权限
    dispatch({
      type:'commonApp/getUsersByRoleId',
      formData:{
        arg_roleid:createNotice_roleid
      }
    })
    // 培训基地
    dispatch({
      type:'commonApp/fileQuery',
      file_upload_date:'1',
      file_type_id:'6'
    });
    // 常用资料
    dispatch({
      type:'commonApp/ResourceQuery',
      file_upload_date:'1',
      file_type_id:'5'
    });
    // 流转消息查询
    dispatch({
      type:'commonApp/circulationNoticeInfoQuery',
      formData:{
        arg_userid:Cookie.get('userid'),
        arg_page_size:5,
        arg_page_current:1
      }
    });


  }

  getTop5List = (noticeListParam, undoListParam, circulationNoticeListtParam) => {
    const result = {
      noticeList: [],
      circulationNoticeList: [],
      undoList: [],
    };
    if(noticeListParam.length === 0 && undoListParam.length === 0 && circulationNoticeListtParam.length === 0) {
      return result;
    }
    else if(noticeListParam.length === 0 && undoListParam.length !== 0 && circulationNoticeListtParam.length === 0) {
      result.undoList = undoListParam.slice(0, 5);
    } 
    else if(noticeListParam.length !== 0 && undoListParam.length === 0 && circulationNoticeListtParam.length === 0) {
      result.noticeList = noticeListParam.slice(0, 5)
    } 
    else if(noticeListParam.length == 0 && undoListParam.length == 0 && circulationNoticeListtParam.length !== 0) {
      result.circulationNoticeList = circulationNoticeListtParam.slice(0, 5)
    }
    else if(noticeListParam.length !== 0 && undoListParam.length !== 0 && circulationNoticeListtParam.length !== 0){
      if(undoListParam.length + circulationNoticeListtParam.length +noticeListParam.length <= 5) {
        result.circulationNoticeList = circulationNoticeListtParam;
        result.undoList = undoListParam;
        result.noticeList = noticeListParam;
      }
      else{
        if(noticeListParam.length >= undoListParam.length && noticeListParam.length >= circulationNoticeListtParam.length) {
          result.noticeList = noticeListParam.slice(0, 3);
          result.undoList = undoListParam.slice(0, 1);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 1);
        } 
        else if( undoListParam.length >= noticeListParam.length && undoListParam.length >= circulationNoticeListtParam.length) {
          result.noticeList = noticeListParam.slice(0, 1);
          result.undoList = undoListParam.slice(0, 3);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 1);
        } 
        else if(circulationNoticeListtParam.length >= undoListParam.length && circulationNoticeListtParam.length >= noticeListParam.length) {
          result.noticeList = noticeListParam.slice(0, 1);
          result.undoList = undoListParam.slice(0, 1);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 3);
        } 
      } 
    } 
    if(noticeListParam.length !== 0 && undoListParam.length !== 0 && circulationNoticeListtParam.length === 0){
      if(noticeListParam.length + undoListParam.length <= 5) {
        result.undoList = undoListParam;
        result.noticeList = noticeListParam;
      }else{
        if(noticeListParam.length >= undoListParam.length) {
          result.noticeList = noticeListParam.slice(0, 3);
          result.undoList = undoListParam.slice(0, 2);
        } else {
          result.noticeList = noticeListParam.slice(0, 2);
          result.undoList = undoListParam.slice(0, 3);
        }
      }
    }
    else if(noticeListParam.length !== 0 && undoListParam.length === 0 && circulationNoticeListtParam.length !== 0){
      if(noticeListParam.length + circulationNoticeListtParam.length <= 5) {
        result.circulationNoticeList = circulationNoticeListtParam;
        result.noticeList = noticeListParam;
      }else{
        if(noticeListParam.length >= circulationNoticeListtParam.length) {
          result.noticeList = noticeListParam.slice(0, 3);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 2);
        } else {
          result.noticeList = noticeListParam.slice(0, 2);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 3);
        }
      }
    } 
    else if(noticeListParam.length === 0 && undoListParam.length !== 0 && circulationNoticeListtParam.length !== 0){
      if(undoListParam.length + circulationNoticeListtParam.length <= 5) {
        result.circulationNoticeList = circulationNoticeListtParam;
        result.undoList = undoListParam;
      }else{
        if(undoListParam.length >= circulationNoticeListtParam.length) {
          result.undoList = undoListParam.slice(0, 3);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 2);
        } else {
          result.undoList = undoListParam.slice(0, 2);
          result.circulationNoticeList = circulationNoticeListtParam.slice(0, 3);
        }
      }
    }
    return result;
  }

  columns = [{
    title: '序号',
    width: '10%',
    key:"0",
    render: (value, row, index) => {
      return index + 1;
    },
  },{
      title: '部门名称',
      dataIndex: 'dept_name',
      width: '30%',
      key:"1",
      render: (value) => {
        const obj = {
          children: value,
          props: {},
        };
        return obj;
      },
  },{
    title: '部门负责人',
    dataIndex: 'staff_name',
    width: '20%',
    key:"2",
    render: (value) => {
      const obj = {
        children: value,
        props: {},
      };
      return obj;
    },
  }, {
      title: '述职报告文件名',
      dataIndex: 'pf_url',
      width: '40%',
      key:"3",
      render: (value) => {
        let fileName = '';
        if(Object.prototype.toString.call(value) === '[object Undefined]') {
          fileName = '暂未上传';
        }
        if(Object.prototype.toString.call(value) === '[object String]') {
          fileName = <a href={value} target='_blank'>{value.slice(value.lastIndexOf('/')+1, value.length)}</a>;
        }
        return fileName;
      }
    }];

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  async handleOk(){
    this.setState({
      tipvisible: false,
    });
    if(this.state.checked){
     //debugger
     await commonAppService.needTips({arg_staff_id:Cookie.get('userid'),arg_flag:1})
    }
  };

  handleCancel = e => {
    this.setState({
      tipvisible: false,
    });
  };
  //轮播图
  onChange=(a, b, c)=>{
    //console.log(a, b, c);
  }

  checkChange=(e)=>{
   //console.log("e.target.checked",e.target.checked)
    this.setState({
    checked: e.target.checked
    })
   
  }

  render(){
    const { messageListFive, backlogListFive, fileListFive, noticeList, messageFlag, fileFlag,
      SrcFlag, noticeFlag, usersHasPermissionId, dispatch, leaderFileList, circulationNoticeList } = this.props;
      let {isBirthday,isJoinUnicomDay,gender}=this.state    
    const resourceListThree = [
      { file_name: 'vpn申请单', path: 'downloadorder' },
      { file_name: '请假申请单', path: 'downloadleave'}];
    var visibleCreateNotice=false;
    for(var i=0;i<usersHasPermissionId.length;i++){
      if(Cookie.get('userid')==usersHasPermissionId[i].staff_id){
        visibleCreateNotice=true;
      }
    }
    window.sessionStorage['noticeRole'] = visibleCreateNotice ? '1':'0';// 1=>管理员角色，0=>普通用户角色

    const list = this.getTop5List(messageListFive, backlogListFive, circulationNoticeList);
    const leaderModal = (
      <Modal
        title="部门述职报告"
        visible={this.state.visible}
        onCancel={this.hideModal}
        onOk={this.hideModal}
        width={window.innerWidth * 0.7}
        >
        <Table
          bordered
          dataSource={this.state.lederReport||leaderFileList}
          columns={this.columns}
          pagination={false}
          className={styles.table}
          pagination={true}
          />
      </Modal>
    );

    return(
      <div>
        <Row>
          <Col xs={24} sm={24} md={15} lg={15} xl={15}>
            <div>
              <div style={{ marginBottom:'20px' }}>
                <MyPlatform
                  background={"#7ab0ec"}
                  noticeList={list.noticeList}
                  circulationNoticeList={list.circulationNoticeList}
                  unDoList={list.undoList}
                  draftList={messageListFive}
                  getMoreUrl={'/taskList'}
                  action={dispatch}
                  loadFlag={messageFlag}
                  lookDetail={this.lookDetailM}
                   />
              </div>
               <div style={{marginBottom:'20px'}}>
                 <MainpageUl background={"#ffc497"}
                   dataKey={['file_type','file_name','file_upload_date']}
                   title={"常用资料"}
                   rightContent={"file_upload_date"}
                   leftContent={'file_type'}
                   infoList={fileListFive}
                   getMoreUrl={'/trainingMore'}
                   loadFlag={fileFlag}
                   hasMore={true}
                   lookDetail={this.trainDetail}
                 />
               </div>
            </div>
          </Col>
          <Col xs={24} sm={24}
           md={{span:8,offset:1}} lg={{span:8,offset:1}} xl={{span:8,offset:1}}>
            <div>
              <div style={{marginBottom:'20px'}}>
                <MainpageUl background={'#55c9a6'}
                  dataKey={['n_title','updatetime']}
                  title={"公告"}
                  infoList={noticeList}
                  rightContent={"updatetime"}
                  listStyle={"listStyle"}
                  getMoreUrl={visibleCreateNotice?'/noticeMoreManager':'/noticeMoreUser'}
                  loadFlag={noticeFlag}
                  hasMore={true}
                  lookDetail={this.noticeDetail}
                  />
              </div>
              <div style={{marginBottom:'20px'}}>
                <MainpageUl background={'#bfa1dd'}
                  dataKey={['file_name']}
                  title={"常用表单"}
                  infoList={resourceListThree}
                  listStyle={"listStyle"}
                  getMoreUrl={'/srcMore'}
                  loadFlag={SrcFlag}
                  hasMore={true}
                  leftContentWidth={'100%'}
                  lookDetail={this.srcDetail}
                  />
              </div>
            </div>
          </Col>
        </Row>
        {leaderModal}
        
        <div>
        <Modal
          title="节日祝福"
          visible={this.state.tipvisible}
          onCancel={this.handleCancel}
          width={800}
          maskClosable={false}
          footer={<div  style={{height:"30px"}}>
         <Checkbox style={{float:"left"}} onChange={this.checkChange}>不再提示</Checkbox>  
          <div style={{float:"right"}}>
            <Button type="primary" onClick={()=>this.handleOk()}>确认</Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </div>
          </div>}
        >
          <div className={this.state.gender=="1002"?styles["carousel_pink"]:styles["carousel_blue"]}>
          {/* <div className={styles["carousel_blue"]}> */}
           <Carousel afterChange={this.onChange} autoplay={Number(isBirthday)&&Number(isJoinUnicomDay)?true:null}>
           {/* <Carousel afterChange={this.onChange} autoplay={true}> */}
          {isBirthday=="1"&& gender=="1002"&&
           <div style={{textAlign:"center"}}>
          <img style={{width:"100%",height:"80%",padding:"2%",margin:"0 auto"}} src={memorial}/>
          <p style={{color:"#fff",marginTop:"2px",fontSize:"17px"}}>
           
           亲爱的{window.localStorage.getItem("fullName")}，{this.state.Birthday_content}
            <br/>
            Today is your birthday , happy birthday to you !
            </p>
          </div>
            }

          {isBirthday=="1"&& gender=="1001"&&
          <div style={{textAlign:"center"}}>
          <img style={{width:"100%",height:"80%",padding:"2%",margin:"0 auto"}} src={memorial2}/>
          <p style={{color:"#fff",marginTop:"2px",fontSize:"17px"}}>
           亲爱的{window.localStorage.getItem("fullName")},{this.state.Birthday_content}
            <br/>
            Today is your birthday , happy birthday to you !
            </p>
          </div>
            }

            {isJoinUnicomDay=="1"&&
            <div style={{background:"#364d79",paddingTop:"15px"}}> 
           <div style={{width:"95%",height:"350px",background:`url(${company})`,backgroundRepeat:"no-repeat",borderRadius: "16px",margin:"0 auto",position:"relative"}}>
           {(this.state.UnicomDay_content!="")&&(this.state.UnicomDay_content.indexOf('<')>0)?
           <p style={{color:"#fff",marginTop:"18%",position:"absolute",marginLeft:"3%",width:"53%",fontSize:"17px"}}>
            尊敬的 {window.localStorage.getItem("fullName")}:
             <br></br>
            {this.state.UnicomDay_content.split("<")[0]}
            <span style={{color:"#f3f620",fontSize:"25px"}}>&nbsp;{this.state.UnicomDay_content.split("<")[1].split(">")[0]}&nbsp;</span>
            {this.state.UnicomDay_content.split("<")[1].split(">")[1]}
            </p>
              :""
             }
          </div>
          </div>
            }
        </Carousel>
        </div>
        </Modal>
      </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {  messageList, backlogList, fileList, resourceList, noticeList, messageFlag,
    fileFlag, SrcFlag, noticeFlag, usersHasPermissionId, leaderFileList, circulationNoticeList} = state.commonApp;
  let messageListFive=messageList.length>5?messageList.slice(0,5):messageList;
  let backlogListFive=backlogList.length>5?backlogList.slice(0,5):backlogList;
  let fileListFive=fileList.length>5?fileList.slice(0,5):fileList;
  let resourceListThree=resourceList.length>5?resourceList.slice(0,5):resourceList;
  let noticeListThree=noticeList.length>5?noticeList.slice(0,5):noticeList;
  return {
    messageListFive,
    backlogListFive,
    fileListFive,
    resourceListThree,
    noticeList:noticeListThree,
    messageFlag,
    fileFlag,
    SrcFlag,
    noticeFlag,
    circulationNoticeList,
    usersHasPermissionId,
    leaderFileList
  };
}

export default connect(mapStateToProps)(CommonApp);
