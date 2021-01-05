/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：ou配置
 */
import Style from './baseConfig.less'
import addressImg from '../../../assets/meetingSet/address3.png'
import phoneImg from '../../../assets/meetingSet/phone1.png'
import desImg from '../../../assets/meetingSet/introduction1.png'
import zhouqi from '../../../assets/meetingSet/zhouqi.png'
import logo from '../../../assets/meetingSet/logo.png';
import {connect } from 'dva';
import { Upload, Icon, Modal,Input,Row,Col,Button,message,Spin,InputNumber,Select } from 'antd';
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;
import Cookie from 'js-cookie';
class OUConfig extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    ou:'请选择组织单元',
    tel:'',
    address:'',
    introduce:'',
    reserveDay:7,
    Modalou:'',
    Modaltel:'',
    Modaladdress:'',
    Modalintroduce:'',
    ModalreserveDay:7,
    ModalouId:'',
    OUTypeIcon:true,
    OUTypeStyle:{display:'none'},
    visible:false,
    phone_id:'',
    ModalFileList:[],
    ouId:'',
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框 修改通用
   */
  showModal=(i)=>{
    this.setState({
      visible:true,
      Modalou:i.ou_name,
      Modaltel:i.ou_tel,
      Modaladdress:i.ou_address,
      Modalintroduce:i.ou_description,
      ModalreserveDay:i.period_time,
      ModalFileList:i.url ? [{
        uid: -2,
        name: 'xxx.png',
        status: 'done',
        url: i.url,
      }]:[],
      photo_id:i.photo_id,
      ModalouId:i.ou_id,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 修改通用
   */
  handleCancel1=()=>{
    this.setState({
      visible:false,
      ModalFileList:[],
    })
  };
  //修改信息后提交
  editOUType=()=>{
    const {dispatch} = this.props;
    if(this.state.Modalou === ''){
      message.info('组织单元名称不能为空');
      return;
    }
    if(this.state.ModalFileList.length === 0){
      message.info('请上传图片');
      return;
    }
    dispatch({
      type:'baseConfig/editOUType',
      ...this.state,
    });
    this.setState({
      visible:false,
    })
  };
  onRemove = () => {
    const {dispatch} = this.props;
    if(this.state.photo_id){
      dispatch({
        type:'baseConfig/delMeetRoomPhoto',
        photoId:this.state.photo_id
      });
    }
  };
  //取消预览
  handleCancel = () => this.setState({ previewVisible: false });
  // 预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  //上传服务器后的操作
  handleChange = (info) => {
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      //message.info('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }

    this.setState({ fileList });
  };
  //上传服务器后的操作:弹出模态框修改的操作
  handleChange1 = (info) => {
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      //message.info('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }
    this.setState({ ModalFileList : fileList });
  };

  //提交
  addOUConfig = () =>{
    const { ou,address,tel,introduce,fileList,reserveDay,ouId } = this.state;
    const {dispatch} = this.props;
    if(ou === '请选择组织单元'){
      message.info('组织单元名称不能为空');
      return;
    }
    if(fileList.length === 0){
      message.info('请上传图片');
      return;
    }
    dispatch({
      type:'baseConfig/addOUConfig',
      ou,
      address,
      tel,
      introduce,
      fileList,
      reserveDay,
      ouId,
    });
    this.setState({
      ou:'请选择组织单元',
      tel:'',
      address:'',
      fileList: [],
      introduce:'',
      reserveDay:7,
      ouId:'',
      //OUTypeIcon:true,
      //OUTypeStyle:{display:'none'},
    })
  };
  //删除
  delOUType=(e,i)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'baseConfig/delOUType',
      i
    });
  };
  ChangeOUTypeStyle=()=>{
    const { OUTypeIcon } = this.state;
    this.setState({
      OUTypeStyle:{display:'block'},
      OUTypeIcon:!OUTypeIcon,
    });
    if(OUTypeIcon === false){
      this.setState({
        OUTypeStyle:{display:'none'},
      });
    }else{
      this.setState({
        OUTypeStyle:{display:'block'},
      });
    }
  };
  showConfirm=(e,i)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '如果删除'+i.ou_name+'的信息，该院的所有会议室将无法预定，您是否要删除？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delOUType(e,i)
      },
    });
  };
  changeModalou=(value)=>{
    this.setState({
      Modalou:value,
    })
  };
  changeModaladdress=(e)=>{
    let value1 = e.target.value;
    if(value1.length >= 50){
      value1 = value1.substring(0,50)
    }
    this.setState({
      Modaladdress:value1,
    })
  };
  changeModaltel=(e)=>{
      this.setState({
        Modaltel:e.target.value,

      });
  };
  changeModaltelBlur=(e)=>{
    if(!this.checkTel(e.target.value)){
      message.info('请输入正确电话号码');
      this.setState({
        Modaltel:'',
      });
    }
  };
  changeModalreserveDay=(value)=>{
    this.setState({
      ModalreserveDay:value,
    })
  };

  changeModalintroduce=(e)=>{
    let value1 = e.target.value;
    if(value1.length >= 300){
      value1 = value1.substring(0,300)
    }
    this.setState({
      Modalintroduce:value1,
    })
  };
  changeOU=(value)=>{
    const { OUList } = this.props;
    for(let i=0;i<OUList.length;i++){
      if(OUList[i].ou_id === value){
        this.setState({
          ouId : OUList[i].ou_name,
        })
      }
    }
    this.setState({
      ou:value,
    })
  };
  changeAdd=(e)=>{
    let value1 = e.target.value;
    if(value1.length >= 50){
      value1 = value1.substring(0,50)
    }
    this.setState({
      address:value1,
    })
  };
  checkTel=(tel)=> {
    let mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
  };
  changeTel=(e)=>{
    this.setState({
      tel:e.target.value,
    });
  };
  changeTelBlur=(e)=>{
    if(!this.checkTel(e.target.value)){
      message.info('请输入正确电话号码');
      this.setState({
        tel:'',
      });
    }
  };
  changeTime=(value)=>{
    this.setState({
      reserveDay:value,
    })
  };
  changeIntro=(e)=>{
    let value1 = e.target.value;
    if(value1.length >= 300){
      value1 = value1.substring(0,300)
    }
    this.setState({
      introduce:value1,
    })
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { OUTypeInfo,OUList } = this.props;
    let ouList;
    if(OUList.length !== 0){
      ouList = OUList.map((item) => {
        return (
          <Option key={item.ou_id}>
            {item.ou_name}
          </Option>
        )
      });
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className={Style.uploadText}>上传</div>
      </div>
    );
    let fileObj = {
      action: '/filemanage/fileupload',
      name: 'file',
      method: "POST",
      accept: '.jpg,.jpeg,.gif,.png,.bmp,.svg',
      data:{
        argappname:'portalFileUpdate',
        argtenantid:'10010',
        arguserid:Cookie.get('userid'),
        argyear:new Date().getFullYear(),
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      // accept: 'image/*',
      onChange: this.handleChange,
      onRemove:this.onRemove,
    };
    let fileObj1 = {
      action: '/filemanage/fileupload',
      name: 'file',
      method: "POST",
      accept: '.jpg,.jpeg,.gif,.png,.bmp,.svg',
      data:{
        argappname:'portalFileUpdate',
        argtenantid:'10010',
        arguserid:Cookie.get('userid'),
        argyear:new Date().getFullYear(),
        argmonth:new Date().getMonth()+1,
        argday:new Date().getDate()
      },
      // accept: 'image/*',
      onChange: this.handleChange1,
      onRemove:this.onRemove,
    };
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          <div>
            <div className={Style.configTitle}>组织单元配置</div>
              <div>
                {
                  this.state.OUTypeIcon === true ?
                    <Icon onClick={this.ChangeOUTypeStyle} className={Style.iconStyle} type="caret-down" ><div className={Style.zhankaitext}>展开</div></Icon>
                    :
                    <Icon onClick={this.ChangeOUTypeStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
                }
              </div>
          </div>
          <div style={this.state.OUTypeStyle} className={Style.configWarp}>
            <Row>
              <Col span={10}>
                <span className={Style.ouText}>组织单位名称：</span>
                <Select showSearch value={this.state.ou} style={{width:200}} onSelect={this.changeOU} placeholder="请选择组织单元">
                  {ouList}
                </Select>
              </Col>
              <Col span={10}>
                <span className={Style.ouText}>地址：</span>
                <Input value={this.state.address} style={{width:250}} onChange={this.changeAdd}/>
              </Col>
            </Row>
            <div style={{marginTop:20}}>
              <Row>
                <Col span={10}>
                  <span className={Style.ouText}>联系电话：</span>
                  <Input value={this.state.tel} style={{width:232}} onChange={this.changeTel} onBlur={this.changeTelBlur}/>
                </Col>
                <Col span={10}>
                  <span className={Style.ouText}>预定周期（天）：</span>
                  <InputNumber  style={{width:170}} min={1} max={100} onChange={this.changeTime} value={this.state.reserveDay}/>
                </Col>
              </Row>
            </div>
            <div style={{marginTop:20}}>
              <Row>
                <Col span={2}>
                  <span className={Style.ouText} style={{verticalAlign:'top'}}>图片：</span>
                </Col>
                <Col span={8}>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    {...fileObj}
                    onPreview={this.handlePreview}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Col>
                <Col span={10}>
                  <span className={Style.ouText} style={{verticalAlign:'top'}}>简介：</span>
                  <TextArea value={this.state.introduce} rows={5} style={{width:250}} onChange={this.changeIntro} placeholder="字数不能超过300"/>
                </Col>
                <Col  offset={3}>
                  <Button style={{marginTop:65}} type="primary" onClick={this.addOUConfig}>提交</Button>
                </Col>
              </Row>
            </div>
          </div>
          { //(e)=>this.delOUType(e,i)
            OUTypeInfo !== undefined && OUTypeInfo.length !== 0 ?
              <div style={{marginTop:20}}>
                {
                  OUTypeInfo.map((i,index)=>{
                    return(
                      <div key={index}>
                        <div className={Style.cardWrap} style={{cursor:'pointer'}} onClick={()=>this.showModal(i)}>
                          <Row>
                            <Col span={10}><div><img src={i.url} width='320' height='193'/></div></Col>
                            <Col span={14}>
                              <div style={{textAlign:'right'}}><Icon onClick={(e)=>this.showConfirm(e,i)} type="close" /></div>
                              <h2 className={Style.ouInfoText}><img src={logo} className={Style.logoIconStyle}/><span style={{verticalAlign:'top'}}>{i.ou_name}</span></h2>
                              <div className={Style.textStyle1}><img src={addressImg} className={Style.iconStyle1}/>地址: {i.ou_address}</div>
                              <div className={Style.textStyle1}><img src={phoneImg} className={Style.iconStyle1}/>联系电话: {i.ou_tel}</div>
                              <div className={Style.textStyle1}><img src={zhouqi} className={Style.iconStyle1}/>预定周期（天）: {i.period_time}</div>
                              <div className={Style.textStyle1}><img src={desImg} className={Style.iconStyle1}/>简介: {i.ou_description}</div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              :
              []
          }
          <Modal
            title="修改组织单元配置"
            visible={this.state.visible}
            onCancel={this.handleCancel1}
            onOk={this.editOUType}
            width = '900px'
          >
            <div>
              <Row>
                <Col span={12}>
                  <span className={Style.ouText}>组织单位名称：</span>
                  <Select disabled value={this.state.Modalou} style={{width:200}} onChange={this.changeModalou}>
                    {ouList}
                  </Select>
                  {/*<Input value={this.state.Modalou} style={{width:200}} onChange={this.changeModalou}/>*/}
                </Col>
                <Col span={12}>
                  <span className={Style.ouText}>地址：</span>
                  <Input value={this.state.Modaladdress} style={{width:250}} onChange={this.changeModaladdress}/>
                </Col>
              </Row>
              <div style={{marginTop:20}}>
                <Row>
                  <Col span={12}>
                    <span className={Style.ouText}>联系电话：</span>
                    <Input value={this.state.Modaltel} style={{width:232}} onChange={this.changeModaltel} onBlur={this.changeModaltelBlur}/>
                  </Col>
                  <Col span={12}>
                    <span className={Style.ouText}>预定周期（天）：</span>
                    <InputNumber style={{width:170}} min={1} max={100} onChange={this.changeModalreserveDay} onBlur={this.changeModalreserveDayBlur} value={this.state.ModalreserveDay}/>
                  </Col>
                </Row>
              </div>
              <div style={{marginTop:20}}>
                <Row>
                  <Col span={3}>
                    <span className={Style.ouText} style={{verticalAlign:'top'}}>图片：</span>
                  </Col>
                  <Col span={9}>
                    <Upload
                      listType="picture-card"
                      fileList={this.state.ModalFileList}
                      {...fileObj1}
                      onPreview={this.handlePreview}
                    >
                      {this.state.ModalFileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </Col>
                  <Col span={12}>
                    <span className={Style.ouText} style={{verticalAlign:'top'}}>简介：</span>
                    <TextArea value={this.state.Modalintroduce} rows={5} style={{width:250}} onChange={this.changeModalintroduce} placeholder="字数不能超过300"/>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal>
        </div>
      </Spin>
    );
  }
}
function mapStateToProps (state) {
  return {
    ...state.baseConfig,
    loading: state.loading.models.baseConfig,
  };
}
export default connect(mapStateToProps)(OUConfig);
