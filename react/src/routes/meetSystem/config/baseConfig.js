/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室基础配置页面展示
 */
import React from 'react';
import {connect } from 'dva';
import Style from './baseConfig.less'
import { Icon,Table,Input,Button,TimePicker,Slider, InputNumber, Row, Col,message,Spin,Tooltip,Select,Modal,Checkbox } from 'antd';
import defaultAvt from '../../../assets/Images/unicom_logo_bg.png';
import styles from './configCard.less';
import tablestyle from './../../../components/finance/table.less'
import moment from 'moment';
import config from './config';
import Error from './errorPage/noData';
const confirm = Modal.confirm;
const  Option= Select.Option;
const dateFormat = 'HH:mm';
const { TextArea } = Input;
/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 功能：单个卡片
 */
function EmpCard(props) {
  const {linker_name,linker_tel,linker_mail,delInterfacePersonType,editInterfacePersonType}=props;
  return (
    <div className={styles.cardWrap}>
      <div className={styles.cardShadow}>
        <div className={styles.card}>
          <div className='top'>
            <div className="avt"><img src={defaultAvt}/></div>
            <div className="info">
              <div >
                <span><Icon type="xingming" style={{color:'#A8CCEE'}}/></span>
                {linker_name}
              </div>
              <div>
                <span><Icon type="bumen" style={{color:'#A8CCEE'}}/></span>
                {localStorage.ou}
              </div>
              <div>
                <span><Icon type="dianhua" style={{color:'#A8CCEE'}}/></span>
                {linker_tel}
              </div>
              <div >
                <span><Icon type="youxiang" style={{color:'#A8CCEE'}}/></span>
                {linker_mail}
              </div>
            </div>
          </div>
          <div className="foot">
            <div className="twoBtns"><a onClick={delInterfacePersonType}>删除</a><a onClick={editInterfacePersonType}>编辑</a></div>
          </div>
        </div>
      </div>
    </div>
    )
}
class baseConfig extends React.Component{
  constructor(props){
    super(props);
  }
  state = {
    meetingType: '',
    meetingFlag: 0,
    meetingTypeStyle:{display:'none'},
    timeType:'',
    timeTypeStyle:{display:'none'},
    interfacePersonType:'',
    interfacePersonTypeStyle:{display:'none'},
    timeUnit: 30,
    beginTime:moment('08:00', 'HH:mm'),
    endTime:moment('08:00', 'HH:mm'),
    meetingTypeIcon:true,
    timeTypeIcon:true,
    interfacePersonTypeIcon:true,
    interfacePersonTelType:'',
    interfacePersonEmailType:'',
    meetingCategoryIcon:true,
    meetingCategoryStyle:{display:'none'},
    meetingCategory:'',
    reserveDay:7,
    meetingCategoryDescribe:'',
    time_per:'上午',
    visible1:false,//类型配置
    visible2:false,//级别配置
    visible3:false,//会议室时间配置
    visible4:false,//会议室接口人配置
    Modal4Name:'',
    Modal4Tel:'',
    Modal4Mail:'',
    Modal4linkerId:'',
    Modal3TimePer:'',
    Modal3TimeUnit:0,
    Modal3BeginTime:moment('08:00', 'HH:mm'),
    Modal3EndTime:moment('08:00', 'HH:mm'),
    Modal3TimeSetId:'',
    Modal2MeetingCategoryDescribe:'',
    Modal2MeetingCategory:'',
    Modal2LevelId:'',
    Modal1MeetingType:'',
    Modal1TypeId:'',
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：删除会议室时间配置
   */
  delConfigure=(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'baseConfig/delConfigure',
      record,
    });
  };
  showConfirm=(e,record)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+record.start_time+'-'+record.end_time+'的会议室时间配置吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delConfigure(record)
      },
    });
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：删除会议室类型
   */
  delMeetingType=(i)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'baseConfig/delMeetingType',
      i,
    });
  };
  showConfirmMeetingType=(e,i)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+i.type_name+'吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delMeetingType(i)
      },
    });
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：删除会议室类别
   */
  delMeetingCategory=(i)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'baseConfig/delMeetingCategory',
      i,
    });
  };
  showConfirmMeetingCategory=(e,i)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+i.level_name+'吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delMeetingCategory(i)
      },
    });
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：删除接口人
   */
  delInterfacePersonType=(i)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'baseConfig/delInterfacePersonType',
      i,
    });
  };

  showConfirmInterfacePersonType=(e,i)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除接口人'+i.linker_name+'吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delInterfacePersonType(i)
      },
    });
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：编辑接口人
   */
  editInterfacePersonType=()=>{
    const { dispatch } = this.props;
    const { Modal4Mail,Modal4Tel,Modal4Name,Modal4linkerId } = this.state;
    if(Modal4Name === ''){
      message.info('姓名不能为空');
    }else if( Modal4Tel === ''){
      message.info('电话不能为空');
    }else if( Modal4Mail === '' ){
      message.info('邮箱不能为空');
    }else{
      dispatch({
        type:'baseConfig/editInterfacePersonType',
        Modal4Mail,
        Modal4Tel,
        Modal4Name,
        Modal4linkerId
      });
      this.setState({
        visible4:false,
      })
    }
  };
  editConfigure=()=>{
    const { dispatch } = this.props;
    const { Modal3TimeUnit,Modal3BeginTime,Modal3EndTime } = this.state;
    // console.log((Modal3EndTime - Modal3BeginTime)/1000/60 % Modal3TimeUnit)
    if(Modal3TimeUnit === 0){
      message.info('时间单元不能为0');
    }else if(Modal3TimeUnit %30 !== 0){
      message.info('时间单元必须为30的倍数');
    } else if((Modal3EndTime - Modal3BeginTime)/1000/60 % Modal3TimeUnit !== 0){
      message.info('开始时间与结束时间的差值必须是'+Modal3TimeUnit+'的倍数');
    }  else if(Modal3BeginTime - Modal3EndTime === 0){
      message.info('开始时间与结束时间不能相同');
    }else if(Modal3BeginTime > Modal3EndTime){
      message.info('开始时间不能大于结束时间');
    }else{
      dispatch({
        type:'baseConfig/editConfigure',
        ...this.state,
      });
      this.setState({
        visible3:false,
      })
    }
  };
  editMeetingCategory=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'baseConfig/editMeetingCategory',
      ...this.state,
    });
    this.setState({
      visible2:false,
    })
  };
  editMeetingType=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'baseConfig/editMeetingType',
      ...this.state,
    });
    this.setState({
      visible1:false,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：添加会议类型
   */
  addMeetingType=()=>{
    const { meetingType } = this.state;
    const { dispatch } = this.props;
    if(meetingType === ''){
      message.info('会议室类型不能为空');
    }else{
      dispatch({
        type:'baseConfig/addMeetingType',
        meetingType,
        meetingFlag:this.state.meetingFlag,
      });
      this.setState({
        //meetingTypeStyle:{display:'none'},
        meetingType:'',
        //meetingTypeIcon:true,
      })
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：添加会议类别
   */
  addMeetingCategory=()=>{
    const { meetingCategory,meetingCategoryDescribe } = this.state;
    const { dispatch } = this.props;
    if(meetingCategory === ''){
      message.info('会议级别不能为空');
    }else{
      dispatch({
        type:'baseConfig/addMeetingCategory',
        meetingCategory,
        meetingCategoryDescribe,
      });
      this.setState({
        //meetingCategoryStyle:{display:'none'},
        meetingCategory:'',
        //meetingCategoryIcon:true,
        meetingCategoryDescribe:''
      })
    }
  }
  ;
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：添加时间配置
   */
  addTimeType=()=>{
    const { dispatch } = this.props;
    const { timeUnit,beginTime,endTime,reserveDay,time_per } = this.state;
    if(timeUnit === 0 || beginTime.format(dateFormat) === '00:00' || endTime.format(dateFormat) === '00:00'){
      message.info('时间不能为0');
    }else if(timeUnit %30 !== 0){
      message.info('时间单元必须为30的倍数');
    } else if((endTime - beginTime)/1000/60 % timeUnit !== 0){
      message.info('开始时间与结束时间的差值必须是'+timeUnit+'的倍数');
    }  else if(beginTime - endTime === 0){
      message.info('开始时间与结束时间不能相同');
    }else if(beginTime > endTime){
      message.info('开始时间不能大于结束时间');
    }else{
      dispatch({
        type:'baseConfig/addTimeType',
        timeUnit,
        beginTime,
        endTime,
        reserveDay,
        time_per,
      });
      this.setState({
        //timeTypeStyle:{display:'none'},
        timeUnit:30,
        beginTime:moment('08:00', 'HH:mm'),
        endTime:moment('08:00', 'HH:mm'),
        //timeTypeIcon:true,
        reserveDay:7,
        time_per:'上午'
      })
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：添加接口人配置
   */
  addInterfacePersonType=()=>{
    const { dispatch } = this.props;
    const { interfacePersonType,interfacePersonEmailType,interfacePersonTelType } = this.state;
    if(interfacePersonType === ''){
      message.info('姓名不能为空');
    }else if( interfacePersonTelType === ''){
      message.info('电话不能为空');
    }else if( interfacePersonEmailType === '' ){
      message.info('邮箱不能为空');
    }else{
      dispatch({
        type:'baseConfig/addInterfacePersonType',
        interfacePersonType,
        interfacePersonEmailType,
        interfacePersonTelType,
      });
      this.setState({
        //interfacePersonTypeStyle:{display:'none'},
        interfacePersonType:'',
        interfacePersonEmailType:'',
        interfacePersonTelType:'',
        //interfacePersonTypeIcon:true,
      })
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室类型输入框
   */
  changeMeetingType=(e)=>{
    this.setState({
      meetingType:e.target.value,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室类型输入框
   */
  changeMeetingCategory=(e)=>{
    this.setState({
      meetingCategory:e.target.value,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室类型输入框
   */
  changeMeetingCategoryDescribe=(e)=>{
    let value1 = e.target.value;
    if(value1.length >= 100){
      value1 = value1.substring(0,100)
    }
    this.setState({
      meetingCategoryDescribe:value1,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室类型样式
   */
  ChangeMeetingTypeStyle=()=>{
    const { meetingTypeIcon } = this.state;
    this.setState({
      meetingTypeStyle:{display:'block'},
      meetingTypeIcon:!meetingTypeIcon,
    });
    if(meetingTypeIcon === false){
      this.setState({
        meetingTypeStyle:{display:'none'},
      });
    }else{
      this.setState({
        meetingTypeStyle:{display:'block'},
      });
    }
  };
  ChangeMeetingCategoryStyle=()=>{
    const { meetingCategoryIcon } = this.state;
    this.setState({
      meetingCategoryStyle:{display:'block'},
      meetingCategoryIcon:!meetingCategoryIcon,
    });
    if(meetingCategoryIcon === false){
      this.setState({
        meetingCategoryStyle:{display:'none'},
      });
    }else{
      this.setState({
        meetingCategoryStyle:{display:'block'},
      });
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室时间配置样式
   */
  ChangeTimeTypeStyle=()=>{
    const { timeTypeIcon } = this.state;
    this.setState({
      timeTypeStyle:{display:'block'},
      timeTypeIcon:!timeTypeIcon,
    });
    if(timeTypeIcon === false){
      this.setState({
        timeTypeStyle:{display:'none'},
      });
    }else{
      this.setState({
        timeTypeStyle:{display:'block'},
      });
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室接口人配置样式
   */
  ChangeInterfacePersonTypeStyle=()=>{
    const { interfacePersonTypeIcon } = this.state;
    this.setState({
      interfacePersonTypeStyle:{display:'block'},
      interfacePersonTypeIcon:!interfacePersonTypeIcon,
    });
    if(interfacePersonTypeIcon === false){
      this.setState({
        interfacePersonTypeStyle:{display:'none'},
      });
    }else{
      this.setState({
        interfacePersonTypeStyle:{display:'block'},
      });
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室接口人配置
   */
  ChangeInterfacePersonType=(e)=>{
    this.setState({
      interfacePersonType:e.target.value,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室接口人配置
   */
  ChangeInterfacePersonTelType=(e)=>{
    this.setState({
      interfacePersonTelType:e.target.value,
    })
  };
  checkTel=(tel)=> {
    let mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
  };
  checkEmail=(email)=> {
    let Email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    return Email.test(email);
  };
  changeTelBlur=(e)=>{
    if(!this.checkTel(e.target.value)){
      message.info('请输入正确电话号码');
      this.setState({
        interfacePersonTelType:'',
      });
    }
  };
  changeTelModalBlur=(e)=>{
    if(!this.checkTel(e.target.value)){
      message.info('请输入正确电话号码');
      this.setState({
        Modal4Tel:'',
      });
    }
  };
  changeEmailModalBlur=(e)=>{
    if(!this.checkEmail(e.target.value)){
      message.info('请输入正确的邮箱');
      this.setState({
        Modal4Mail:'',
      });
    }
  };
  changeEmailBlur=(e)=>{
    if(!this.checkEmail(e.target.value)){
      message.info('请输入正确的邮箱');
      this.setState({
        interfacePersonEmailType:'',
      });
    }
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变会议室接口人配置
   */
  ChangeInterfacePersonEmailType=(e)=>{
    this.setState({
      interfacePersonEmailType:e.target.value,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变时间单元
   */
  onChangeTimeUnit = (value) => {
    let value1 = value;
    if(typeof value !== 'number'){
      if(value !== ''){
        value1 = parseInt(value.replace(/[^\d.]/g, ''));
      }else{
        value1 = 0;
      }
    }
    if(isNaN(value1)){
      value1 = 0;
    }
    this.setState({
      timeUnit: value1,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变开始时间
   */
  onChangeBeginTime=(value)=>{
    this.setState({
      beginTime: value,
    });
  };
  /**
   * 作者：张楠华
   * 日期：2018-1-23
   * 邮件：zhangnh6@chinaunicom.cn
   * 功能：改变结束时间
   */
  onChangeEndTime=(value)=>{
    this.setState({
      endTime: value,
    });
  };
  setSelectTimePerParam=(value)=>{
    this.setState({
      time_per: value,
    });
    if(value === '上午'){
      this.setState({
        beginTime: moment('08:00', 'HH:mm'),
        endTime:moment('08:00', 'HH:mm'),
      });
    }else if(value === '下午'){
      this.setState({
        beginTime: moment('13:00', 'HH:mm'),
        endTime:moment('13:00', 'HH:mm'),
      });
    }else if(value === '晚上'){
      this.setState({
        beginTime: moment('18:00', 'HH:mm'),
        endTime:moment('18:00', 'HH:mm'),
      });
    }
  };
   range=(start, end) =>{
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  disabledHours = () => {
    const { time_per } = this.state;
    if(time_per === "上午"){
      return this.range(0, 24).splice(14, 11);
    }else if(time_per === '下午'){
      return [0,1,2,3,4,5,6,7,8,9,10,11,12,19,20,21,22,23];
    }else if(time_per === '晚上'){
      // return this.range(0, 24).splice(0, 18);
      return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,23];
    }
  };
  disabledMinutes=(selectedHour)=>{
    const { time_per } = this.state;
    let disabledArr =[];
    for(let i=1;i<=60;i++){
      disabledArr[i-1]=i;
    }
    if(time_per === "上午" && selectedHour === 13 || time_per === "下午" &&selectedHour === 18){
      return disabledArr;
    }else{
      return []
    }
  };
  disabledHoursModal = () => {
    const { Modal3TimePer } = this.state;
    if(Modal3TimePer === "上午"){
      return this.range(0, 24).splice(14, 11);
    }else if(Modal3TimePer === '下午'){
      return [0,1,2,3,4,5,6,7,8,9,10,11,12,19,20,21,22,23];
    }else if(Modal3TimePer === '晚上'){
      return this.range(0, 24).splice(0, 18);
    }
  };
  disabledMinutesModal=(selectedHour)=>{
    const { Modal3TimePer } = this.state;
    let disabledArr =[];
    for(let i=1;i<=60;i++){
      disabledArr[i-1]=i;
    }
    if(Modal3TimePer === "上午" && selectedHour === 13 || Modal3TimePer === "下午" &&selectedHour === 18){
      return disabledArr;
    }else{
      return []
    }
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框 修改通用
   */
  showModal1=(i)=>{
    this.setState({
      visible1:true,
      Modal1MeetingType:i.type_name,
      Modal1TypeId:i.type_id,
      meetingFlag:i.type_flag,
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
      visible1:false
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框 修改特殊
   */
  showModal2=(i)=>{
    this.setState({
      visible2:true,
      Modal2MeetingCategory:i.level_name,
      Modal2MeetingCategoryDescribe:i.level_describe,
      Modal2LevelId:i.level_id,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 修改特殊
   */
  handleCancel2=()=>{
    this.setState({
      visible2:false
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal3=(record)=>{
    this.setState({
      visible3:true,
      Modal3TimePer:record.time_type === '0' ? '上午':record.time_type === '1' ? '下午':'晚上',
      Modal3BeginTime:moment(record.start_time, 'HH:mm'),
      Modal3EndTime:moment(record.end_time, 'HH:mm'),
      Modal3TimeUnit:parseInt(record.min_time),
      Modal3TimeSetId:record.timeset_id,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 添加通用
   */
  handleCancel3=()=>{
    this.setState({
      visible3:false,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：弹出模态框
   */
  showModal4=(i)=>{
    this.setState({
      visible4:true,
      Modal4Name:i.linker_name,
      Modal4Tel:i.linker_tel,
      Modal4Mail:i.linker_mail,
      Modal4linkerId:i.linker_id,
    })
  };
  /**
   * 作者：张楠华
   * 日期：2017-11-21
   * 邮箱：zhangnh6@chinaunicom.cn
   * 功能：模态框取消 添加特殊
   */
  handleCancel4=()=>{
    this.setState({
      visible4:false,
    })
  };
  changeFlag=(e)=>{
    // alert(e.target.checked)
    if(e.target.checked){
      this.setState({
        meetingFlag:1,
      })
    }else{
      this.setState({
        meetingFlag:0,
      })
    }
  }
  render() {
    const { meetingType,meetingTypeStyle,timeTypeStyle,interfacePersonType,interfacePersonTypeStyle,meetingTypeIcon,timeTypeIcon,interfacePersonTypeIcon,interfacePersonEmailType,interfacePersonTelType } = this.state;
    const { meetingTypeInfo,TimeTypeInfo,InterfacePersonTypeInfo,meetingCategoryInfo } = this.props;
    let textTitle = [];
    for(let i=0;i<meetingCategoryInfo.length;i++){
      textTitle.push(<div key={i}>{meetingCategoryInfo[i].level_name+"："+meetingCategoryInfo[i].level_describe}</div>);
    }
    if (TimeTypeInfo.length) {
      TimeTypeInfo.map((i, index) => {
        i.key = index;
      })
    }
    let columns = [
      {
        title: '时间段',
        dataIndex: 'time_type',
        key:'time_type',
        render:(text,record)=>{return(<span>{record.time_type === '0'? <span>上午</span> : record.time_type === '1'? <span>下午</span> : <span>晚上</span>}</span>)}
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
        key:'start_time',
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key:'end_time',
      },
      {
        title: '时间单元',
        dataIndex: 'min_time',
        key:'min_time',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key:'create_time',
      },
      {
        title: '操作',
        dataIndex: 'opt',
        key:'opt',
        render:(text,record)=>{
          return(
            <div>
              {/*<a onClick={()=>this.showModal3(record)} style={{marginRight:10}}>{'编辑'}</a>*/}
              <a onClick={(e)=>this.showConfirm(e,record)}>{'删除'}</a>
            </div>
          )
        }
      },
    ];
    return (
      <div style={{minWidth: 700}}>
        {
          this.props.RetNum ==='0'?
            <div  className={Style.wrap} style={{minWidth: 700}}>
              <Error/>
            </div>
            :
            <Spin tip="加载中..." spinning={this.props.loading}>
              <div className={Style.wrap}>
                <div style={{marginTop:25}}><span style={{ fontWeight:'bold',fontSize:28}}>基础配置({localStorage.ou})</span></div>
                {/*会议类型配置*/}
                <div className={Style.titleCarp}></div>
                <div className={Style.configTitle}>会议室类型配置</div>
                <div>
                  {
                    meetingTypeIcon === true ?
                      <Icon onClick={this.ChangeMeetingTypeStyle} className={Style.iconStyle} type="caret-down" ><div className={Style.zhankaitext}>展开</div></Icon>
                      :
                      <Icon onClick={this.ChangeMeetingTypeStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
                  }
                </div>
                <div style={meetingTypeStyle} className={Style.configWarp}>
                  <Row>
                    <Col  span={4}><div className={Style.contentStyle}>会议室类型：</div></Col>
                    <Col span={6}>
                      <Input value={meetingType} onChange={this.changeMeetingType}/>
                    </Col>
                    <Col span={2}>
                      <Checkbox className={Style.contentStyle} onChange = {this.changeFlag}>特殊</Checkbox>
                    </Col>
                    <Col span={1}>
                      <Tooltip placement="right" title={config.meetingTypeDescription}>
                        <Icon type="question-circle" className={Style.describe}/>
                      </Tooltip>
                    </Col>

                    <Col span={8} offset={3}><Button type="primary" onClick={this.addMeetingType}>提交</Button></Col>
                  </Row>
                </div>
                {
                  meetingTypeInfo.length !== 0?
                    <div style={{marginTop:40}}>
                      <div className={Style.configContent} style={{display:'inline'}}>现有会议室类型：</div>
                      {
                        meetingTypeInfo.map((i,index)=>{
                          return(<div key={index} style={{backgroundColor:'#DFEAF4',display:'inline-block',marginLeft:10,padding:'4px 8px',marginTop:'8px'}}>
                            <span style={{cursor:'pointer'}} onClick={()=>this.showModal1(i)}>{i.type_name}</span>
                            <span onClick={(e)=>this.showConfirmMeetingType(e,i)}><Icon type="close" /></span></div>)
                        })
                      }
                    </div>
                    :
                    []
                }

                <hr className={Style.hrStyle}/>
                {/*会议级别配置*/}
                <div className={Style.titleCarp}></div>
                <div className={Style.configTitle}>会议级别配置</div>
                <div>
                  {
                    this.state.meetingCategoryIcon === true ?
                      <Icon onClick={this.ChangeMeetingCategoryStyle} className={Style.iconStyle} type="caret-down"><div className={Style.zhankaitext}>展开</div></Icon>
                      :
                      <Icon onClick={this.ChangeMeetingCategoryStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
                  }
                </div>
                <div style={this.state.meetingCategoryStyle} className={Style.configWarp}>
                  <Row>
                    <Col span={4}><div className={Style.contentStyle}>会议级别：</div></Col>
                    <Col span={6}><Input value={this.state.meetingCategory} onChange={this.changeMeetingCategory}/></Col>
                    <Col span={1}>
                      <Tooltip placement="right" title={config.meetingCategory}>
                        <Icon type="question-circle" className={Style.describe}/>
                      </Tooltip>
                    </Col>
                  </Row>
                  <div style={{marginTop:10}}>
                    <Row>
                      <Col span={4}><div className={Style.contentStyle}>级别描述：</div></Col>
                      <Col span={6}><TextArea value={this.state.meetingCategoryDescribe} rows={4}
                                              onChange={this.changeMeetingCategoryDescribe}
                                              placeholder="字数不能超过100"
                      />
                      </Col>
                      <Col span={1}>
                        <Tooltip placement="right" title={config.typeDescription}>
                          <Icon type="question-circle" className={Style.describe}/>
                        </Tooltip>
                      </Col>
                      <Col span={8} offset={3}><Button style={{marginTop:50}} type="primary" onClick={this.addMeetingCategory}>提交</Button></Col>
                    </Row>
                  </div>
                </div>
                {
                  meetingCategoryInfo.length !== 0?
                    <div style={{marginTop:40}}>
                      <div className={Style.configContent} style={{display:'inline'}}>现有会议室级别：</div>
                      {
                        meetingCategoryInfo.map((i,index)=>{
                          return(
                            <div key={index} style={{backgroundColor:'#DFEAF4',display:'inline-block',marginLeft:10,padding:'4px 8px',marginTop:'8px'}}>
                              <span style={{cursor:'pointer'}} onClick={()=>this.showModal2(i)}>{i.level_name}</span><span onClick={(e)=>this.showConfirmMeetingCategory(e,i)}><Icon type="close" /></span>
                            </div>
                          )
                        })
                      }
                      <Tooltip placement="right" title={textTitle}>
                        <Icon type="question-circle" style={{ fontSize: 16, color: '#08c',marginLeft:10 }}/>
                      </Tooltip>
                    </div>
                    :
                    []
                }

                <hr className={Style.hrStyle}/>
                {/*会议室时间配置*/}
                <div className={Style.titleCarp}></div>
                <div>
                  <div className={Style.configTitle}>会议室时间配置</div>
                  <span>
              {
                timeTypeIcon === true ?
                  <Icon onClick={this.ChangeTimeTypeStyle} className={Style.iconStyle} type="caret-down" ><div className={Style.zhankaitext}>展开</div></Icon>
                  :
                  <Icon onClick={this.ChangeTimeTypeStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
              }
            </span>
                </div>
                <div style={timeTypeStyle} className={Style.configWarp}>
                  <Row justify="end">
                    <Col span={8}>
                      <span className={Style.contentStyle}>时间段：</span>
                      <Select showSearch style={{width: 80}} value={this.state.time_per}
                              onChange={ this.setSelectTimePerParam }>
                        <Option value="上午">上午</Option>
                        <Option value="下午">下午</Option>
                        <Option value="晚上">晚上</Option>
                      </Select>
                    </Col>
                    <Col span={8}>
                      <span className={Style.contentStyle}>开始时间：</span>
                      <TimePicker
                        style={{width:80}}
                        minuteStep={30}
                        disabledHours={this.disabledHours}
                        onChange={this.onChangeBeginTime}
                        value={this.state.beginTime}
                        defaultOpenValue={moment('00:00', 'HH:mm')}
                        format={dateFormat}/>
                    </Col>
                    <Col span={6}>
                      <span className={Style.contentStyle}>结束时间：</span>
                      <TimePicker
                        style={{width:80}}
                        minuteStep={30}
                        disabledHours={this.disabledHours}
                        disabledMinutes={this.disabledMinutes}
                        onChange={this.onChangeEndTime}
                        value={this.state.endTime}
                        defaultOpenValue={moment('00:00', 'HH:mm')}
                        format={dateFormat}
                      />
                    </Col>
                  </Row>
                  <div style={{marginTop:20}}>
                    <Row justify="end">
                      <Col span={11}>
                        <div style={{fontSize:16,marginLeft:30,float:'left',marginTop:5}}>时间单元（分钟）：</div>
                        <div style={{marginLeft:190}}><Slider min={0} max={120} step={30} onChange={this.onChangeTimeUnit} value={this.state.timeUnit} /></div>
                      </Col>
                      <Col span={3}>
                        <InputNumber
                          min={0}
                          max={120}
                          style={{ marginLeft: 16 }}
                          step={30}
                          value={this.state.timeUnit}
                          onChange={ this.onChangeTimeUnit }
                        />
                      </Col>
                      <Col span={2}>
                        <Tooltip placement="right" title={config.timeUnit}>
                          <Icon type="question-circle" className={Style.describe}/>
                        </Tooltip>
                      </Col>
                      <Col span={3}><Button type="primary" onClick={this.addTimeType} style={{marginLeft:30}}>提交</Button></Col>
                    </Row>
                  </div>
                </div>
                {
                  TimeTypeInfo.length !== 0 ?
                    <div id="table1" style={{marginTop:'40px'}}>
                      <Table columns={columns}
                             dataSource={TimeTypeInfo}
                             pagination={false}
                             className={tablestyle.financeTable}
                      />
                    </div>
                    :
                    []
                }
                <hr className={Style.hrStyle}/>
                {/*会议室接口人配置 */}
                <div className={Style.titleCarp}></div>
                <div>
                  <div className={Style.configTitle}>会议室接口人配置</div>
                  <span>
              {
                interfacePersonTypeIcon === true ?
                  <Icon onClick={this.ChangeInterfacePersonTypeStyle}  className={Style.iconStyle} type="caret-down"><div className={Style.zhankaitext}>展开</div></Icon>
                  :
                  <Icon onClick={this.ChangeInterfacePersonTypeStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
              }
            </span>
                </div>
                <div style={interfacePersonTypeStyle} className={Style.configWarp}>
                  <Row>
                    <Col span={3}><div className={Style.contentStyle}>组织单元：</div></Col>
                    <Col span={6}><Input disabled value={localStorage.ou}/></Col>
                    <Col span={2}><div className={Style.contentStyle}>姓名：</div></Col>
                    <Col span={6}><Input value={interfacePersonType} onChange={this.ChangeInterfacePersonType}/></Col>
                  </Row>
                  <div style={{marginTop:20}}>
                    <Row>
                      <Col span={3}><div className={Style.contentStyle}>电话：</div></Col>
                      <Col span={6}><Input value={interfacePersonTelType} onChange={this.ChangeInterfacePersonTelType} onBlur={this.changeTelBlur}/></Col>
                      <Col span={2}><div className={Style.contentStyle}>邮箱：</div></Col>
                      <Col span={6}><Input value={interfacePersonEmailType} onChange={this.ChangeInterfacePersonEmailType} onBlur={this.changeEmailBlur}/></Col>
                      <Col span={4} offset={2}><Button type="primary" onClick={this.addInterfacePersonType}>提交</Button></Col>
                    </Row>
                  </div>
                </div>
                {
                  InterfacePersonTypeInfo.length !== 0 ?
                    <div>
                      <div className={Style.configContent}>现有接口人：</div>
                      { InterfacePersonTypeInfo.map((i,index)=><EmpCard {...i} key={index} delInterfacePersonType={(e)=>this.showConfirmInterfacePersonType(e,i)} editInterfacePersonType={()=>this.showModal4(i)}/>) }
                    </div>
                    :
                    []
                }
              </div>
              <Modal
                title="会议室接口人修改"
                visible={this.state.visible4}
                onCancel={this.handleCancel4}
                onOk={this.editInterfacePersonType}
                width='700px'
              >
                <div>
                  <Row>
                    <Col span={4}><div className={Style.contentStyle}>组织单元：</div></Col>
                    <Col span={6}><Input disabled value={localStorage.ou}/></Col>
                    <Col span={4}><div className={Style.contentStyle}>姓名：</div></Col>
                    <Col span={6}><Input value={this.state.Modal4Name} onChange={(e)=>this.setState({Modal4Name:e.target.value})}/></Col>
                  </Row>
                  <div style={{marginTop:20}}>
                    <Row>
                      <Col span={4}><div className={Style.contentStyle}>电话：</div></Col>
                      <Col span={6}><Input value={this.state.Modal4Tel} onChange={(e)=>this.setState({Modal4Tel:e.target.value})}  onBlur={this.changeTelModalBlur}/></Col>
                      <Col span={4}><div className={Style.contentStyle}>邮箱：</div></Col>
                      <Col span={6}><Input value={this.state.Modal4Mail} onChange={(e)=>this.setState({Modal4Mail:e.target.value})} onBlur={this.changeEmailModalBlur}/></Col>
                    </Row>
                  </div>
                </div>
              </Modal>
              <Modal
                title="修改时间配置"
                visible={this.state.visible3}
                onCancel={this.handleCancel3}
                onOk={this.editConfigure}
                width = '900px'
              >
                <div>
                  <Row>
                    <Col span={7}>
                      <span className={Style.contentStyle}>时间段：{this.state.Modal3TimePer}</span>
                      {/*<Select showSearch style={{width: 80}} value={this.state.Modal3TimePer}*/}
                      {/*onChange={ (value)=>this.setState({Modal3TimePer:value}) }>*/}
                      {/*<Option value="上午">上午</Option>*/}
                      {/*<Option value="下午">下午</Option>*/}
                      {/*<Option value="晚上">晚上</Option>*/}
                      {/*</Select>*/}
                    </Col>
                    <Col span={7}>
                      <span className={Style.contentStyle}>开始时间：</span>
                      <TimePicker
                        style={{width:80}}
                        minuteStep={30}
                        disabledHours={this.disabledHoursModal}
                        onChange={(value)=>this.setState({Modal3BeginTime: value})}
                        value={this.state.Modal3BeginTime}
                        format={dateFormat}/>
                    </Col>
                    <Col span={7}>
                      <span className={Style.contentStyle}>结束时间：</span>
                      <TimePicker
                        style={{width:80}}
                        minuteStep={30}
                        disabledHours={this.disabledHoursModal}
                        disabledMinutes={this.disabledMinutesModal}
                        onChange={(value)=>this.setState({Modal3EndTime: value})}
                        value={this.state.Modal3EndTime}
                        format={dateFormat}
                      />
                    </Col>
                  </Row>
                  <div style={{marginTop:20}}>
                    <Row>
                      <Col span={11}>
                        <div style={{fontSize:16,marginLeft:30,float:'left',marginTop:5}}>时间单元（分钟）：</div>
                        <div style={{marginLeft:190}}><Slider min={0} max={120} step={30}
                                                              onChange={(value)=>{
                                                                let value1 = value;
                                                                if(typeof value !== 'number'){
                                                                  if(value !== ''){
                                                                    value1 = parseInt(value.replace(/[^\d.]/g, ''));
                                                                  }else{
                                                                    value1 = 0;
                                                                  }
                                                                }
                                                                if(isNaN(value1)){
                                                                  value1 = 0;
                                                                }
                                                                this.setState({Modal3TimeUnit: value1})
                                                              }}
                                                              value={this.state.Modal3TimeUnit} /></div>
                      </Col>
                      <Col span={3}>
                        <InputNumber
                          min={0}
                          max={120}
                          style={{ marginLeft: 16 }}
                          step={30}
                          onChange={(value)=>{
                            let value1 = value;
                            if(typeof value !== 'number'){
                              if(value !== ''){
                                value1 = parseInt(value.replace(/[^\d.]/g, ''));
                              }else{
                                value1 = 0;
                              }
                            }
                            if(isNaN(value1)){
                              value1 = 0;
                            }
                            this.setState({Modal3TimeUnit: value1})
                          }}
                          value={this.state.Modal3TimeUnit}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </Modal>
              <Modal
                title="会议级别修改"
                visible={this.state.visible2}
                onCancel={this.handleCancel2}
                onOk={this.editMeetingCategory}
                width="400px"
              >
                <div>
                  <Row>
                    <Col span={12}><div className={Style.contentStyle}>会议级别：</div></Col>
                    <Col span={12}><Input value={this.state.Modal2MeetingCategory} onChange={(e)=>this.setState({Modal2MeetingCategory:e.target.value})}/></Col>
                  </Row>
                  <div style={{marginTop:10}}>
                    <Row>
                      <Col span={12}><div className={Style.contentStyle}>级别描述：</div></Col>
                      <Col span={12}><TextArea value={this.state.Modal2MeetingCategoryDescribe} rows={4}
                                               onChange={(e)=>{let value1 = e.target.value;if(value1.length >= 100){value1 = value1.substring(0,100)} this.setState({Modal2MeetingCategoryDescribe:value1})}}
                                               placeholder="字数不能超过100"/>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Modal>
              <Modal
                title="会议类型修改"
                visible={this.state.visible1}
                onCancel={this.handleCancel1}
                onOk={this.editMeetingType}
                width="600px"
              >
                <div>
                  <Row>
                    <Col  span={10}><div className={Style.contentStyle}>会议室类型：</div></Col>
                    <Col span={10}>
                      <Input value={this.state.Modal1MeetingType} onChange={(e)=>this.setState({Modal1MeetingType:e.target.value})}/>
                    </Col>
                    <Col span = {4}>
                      <Checkbox className={Style.contentStyle} checked = {this.state.meetingFlag == '1'} onChange = {this.changeFlag}>特殊</Checkbox>
                    </Col>
                  </Row>
                </div>
              </Modal>
            </Spin>
        }
      </div>

    );
  }
}

function mapStateToProps (state) {
  return {
    ...state.baseConfig,
    loading: state.loading.models.baseConfig,
  };
}
export default connect(mapStateToProps)(baseConfig);
