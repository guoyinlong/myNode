/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料上传页面
 */
import { connect } from 'dva';
import {Button ,Icon,message,Breadcrumb,Modal,Checkbox,Radio,Tag,Tooltip,Input,Row,Col} from 'antd';
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
import { routerRedux } from 'dva/router';
import request from '../../../utils/request';
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class TrainUpload extends React.Component {
  state={
    changeVisible:false,
    deleteVisible:false, //lumj
    docTypeShow:'', //lumj
    deptSelectShowData:{},
    tags:[],
    docTypeName:'',
    docOriTypeName:'',//原文档名称
    inputValue:'', //新增分类
  }






  componentWillMount(){
    if(window.sessionStorage['trainRole']=='0'){
      message.info('你没有上传培训资料的权限，请联系管理员！');
    }
  }



  confirmClose = (tag) => {
    //删除文档类型
    const { dispatch } = this.props;
    let oudata=request('/allcommondocument/commondocument/deleteType2',{arg_name:tag,arg_ou_id:Cookie.get('OUID'),arg_staff_id:Cookie.get('staff_id')});

    oudata.then((data)=>{
      if(data.RetCode == '1')
      {
       message.success("删除文档分类成功");
       //刷新
       dispatch({
         type:'docType/getdocType',
       });
      }

      else if(data.RetCode == '2'){
        message.error(data.RetVal);
      }
      else{
         message.error("出错了");
         return;
      }
    })
  }
  // equipment
  handleClose = (removedTag) => {
    //调用删除服务
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }

  handleInputConfirm = () => {
    const { dispatch } = this.props;
    const state = this.state;
    const inputValue = state.inputValue;
    if(inputValue == '' || inputValue == null || inputValue == undefined){
      message.info("文档名称不能为空");
      return;
    }
    //调用插入服务
    let oudata=request('/allcommondocument/commondocument/addType',{arg_staff_id:Cookie.get('staff_id'), arg_name:inputValue,arg_staff_name:Cookie.get('username'),arg_ou_id:Cookie.get('OUID')});
    oudata.then((data)=>{
      if(data.RetCode == '1'){
        message.success("添加文档分类成功");
        //刷新
        dispatch({
          type:'docType/getdocType',
        });

        this.setState({
          inputVisible: false,
          inputValue: '',
          tempDocType:'',
        });

        // location.reload();
      }
      else if(data.RetCode == '2'){
         message.info(data.RetVal);
      }
      else if(data.RetCode == '0'){
        message.error("调用服务出错");
        return;
      }
    })

  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleCancel1=()=>{
    this.setState({
      changeVisible:false
    })
  };

  showModal1=(i)=>{
    this.setState({
      changeVisible:true,
      docTypeName:i,
      docOriTypeName:i,
      // Modal1MeetingType:i.type_name,
      // Modal1TypeId:i.type_id,
    })
  };

  editDocType=()=>{
    const { dispatch } = this.props;
    var data = {
      arg_type_name: this.state.docOriTypeName,
      arg_staff_id: Cookie.get('userid'),
      arg_ou_id: Cookie.get('OUID'),
      arg_new_type_name: this.state.docTypeName,
    }
    dispatch({
      type:'docType/editDocType',
      formData:data
    });

    this.setState({
      changeVisible:false,
    })

  };

  showConfirmDeleteDocType=(e,i)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+i+'吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.confirmClose(i)
      },
    });
  };

  render(){
    const {docTypelist} = this.props;
    return(
      <div className={window.sessionStorage.trainRole=='1'?styles['pageContainer']:styles['trainUser']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/trainingMore'>培训资料</Link></Breadcrumb.Item>
          <Breadcrumb.Item>文档类型</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>文档类型</h2>
          <div style={{marginTop:'10px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>文档分类：</span>
            {/*
              {tags.map((tag, index) => {

                const isLongTag = tag.length > 20;
                  const tagElem = (
                    <div key={index} style={{backgroundColor:'#DFEAF4',display:'inline-block',marginLeft:10,padding:'4px 8px',marginTop:'8px'}}>
                      <span style={{cursor:'pointer'}}  onClick={()=>this.showModal1(tag)}>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
                      <span onClick={(e)=>this.showConfirmDeleteDocType(e,tag)}><Icon type="close" /></span></div>
                  )

               return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
              })}
              */}


            {docTypelist.map((record, index) => {

              // const isLongTag = docTypelist.length > 20;
              const tagElem = (
                (record.creater_id == Cookie.get('staff_id'))
                ?
                <div key={index} style={{backgroundColor:'#DFEAF4',display:'inline-block',marginLeft:10,padding:'4px 8px',marginTop:'8px'}}>
                  <span style={{cursor:'pointer'}}  onClick={()=>this.showModal1(record.name)}>{record.name}</span>
                  <span onClick={(e)=>this.showConfirmDeleteDocType(e,record.name)}><Icon type="close" /></span></div>
                :
                <div key={index} style={{backgroundColor:'#DFEAF4',display:'inline-block',marginLeft:10,padding:'4px 8px',marginTop:'8px'}}>
                  <span style={{cursor:'pointer'}}  onClick={()=>this.showModal1(record.name)}>{record.name}</span></div>
              )

              return tagElem;

            })}
          </div>


          <div style={{marginTop:'15px',background:'#e9f1f5',padding:'15px',borderRadius:'5px'}}>
            <span style={{fontSize:'16px',display:'inline-block',width:'10%'}}>新增分类：</span>
            <Input style={{width:'20%'}} value = {this.state.inputValue} onChange={this.handleInputChange}/>
            <Button type="primary" style = {{marginLeft:10}} onClick = {this.handleInputConfirm}>确定</Button>
          </div>



          <Modal
            title="文档分类名称修改"
            visible={this.state.changeVisible}
            onCancel={this.handleCancel1}
            onOk={this.editDocType}
            width="400px"
          >
            <div>
              <Row>
                <Col  span={12}><div className={styles.contentStyle}>文档名称：</div></Col>
                <Col span={12}>
                  <Input value={this.state.docTypeName} onChange={(e)=>this.setState({docTypeName:e.target.value})}/>
                </Col>
              </Row>
            </div>
          </Modal>
        <GoBack/>


      </div>
    )
  }
}
function mapStateToProps (state) {
  const { docTypelist} = state.docType;  //lumj
  // console.log("docTypelist:00000" + JSON.stringify(docTypelist))
  return {
    docTypelist
  };
}

export default connect(mapStateToProps)(TrainUpload);
