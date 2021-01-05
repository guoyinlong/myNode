/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室配置
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import style from '../css/meetroomConfig.less';
import Cookie from 'js-cookie';
import { Form, Input, Icon, Row, Col,  Button,  Slider, InputNumber, Upload, Modal, Radio,message,Tag, Tooltip,Checkbox  } from 'antd';
import bg from './../../../assets/meetingSet/bg.png';
import meeting from './../../../assets/meetingSet/meeting.png';
import upLoad from './../../../assets/meetingSet/upload.png';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

class MeetroomConfig extends React.Component {
  constructor(props) {
    super(props);
    console.log("444444444444444444");
    console.log(this.props.location.query);
    this.state = {
      // input
      name: '',
      editName:this.props.location.query.room,
      // capacity
      capacityValue:2,
      editCapacityValue:Number(this.props.location.query.capacity),
      // equipment
      tags: this.props.location.query.equipment===(undefined) || this.props.location.query.equipment.length === 0  ? [] :this.props.location.query.equipment.split('、'),
      basetags: this.props.location.query.basicequipment===(undefined) || this.props.location.query.basicequipment.length === 0 ? []: this.props.location.query.basicequipment.split('、'),
      inputVisible: false,
      inputVisible2: false,
      inputValue: '',
      inputValue2: '',
      //editEquipment:this.props.location.query.equipment,
      // picture
      //fileList: [],
      imgBase: '',
      previewVisible: false,
      previewImage: '',
      fileList: this.props.location.query.flag === '1'? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: this.props.location.query.url,
      }]:
      [],
      // type
      typeValue: '',
      editType:this.props.location.query.typeId,
      // state
      stateValue: '0',
      // need
      need: '',
      editNeed:this.props.location.query.need,
      // roomId
      id: null,
      editId:this.props.location.query.id,
      editState:this.props.location.query.state,
      url : this.props.location.query.url,
      photo_id:this.props.location.query.photo_id,
      others:''
    };
  }
  // name
  onChangeName = (e)=>{
    const { setFieldsValue } = this.props.form;
    setFieldsValue({arg_room_name:e.target.value});
  };
  // 配套设施
  onChangeOthers = (e)=>{
    const { setFieldsValue } = this.props.form;
    setFieldsValue({arg_room_equipment:e.target.value});
  };
  // need
  onChangeNeed = (e)=>{
    const { setFieldsValue } = this.props.form;
    setFieldsValue({arg_room_description:e.target.value});
  };
  // capacity
  onChange = (value) => {
    let value1 = value;
    if(typeof value !== 'number'){
      if(value !== ''){
        value1 = parseInt(value.replace(/[^\d.]/g, ''));
      }else{
        value1 = 2;
      }
    }
    if(isNaN(value1)){
      value1 = 2;
    }
    this.setState({
      capacityValue: value1,
      editCapacityValue:value1,
    });
  };
  // equipment
  handleClose = (removedTag) => {
    const tags = this.state.tags;
    this.setState({
      tags : tags.filter((tag)=> {return tag!==removedTag })
    });
  };
  handleClose2 = (removedTag) => {
    const basetags = this.state.basetags;
    this.setState({
      basetags : basetags.filter((basetag)=> {return basetag!==removedTag })
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  showInput2 = () => {
    this.setState({ inputVisible2: true }, () => this.input2.focus());
  };
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };
  handleInputChange2 = (e) => {
    this.setState({ inputValue2: e.target.value });
  };
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };
  handleInputConfirm2 = () => {
    const state = this.state;
    const inputValue2 = state.inputValue2;
    let basetags = state.basetags;
    if (inputValue2 && basetags.indexOf(inputValue2) === -1) {
      basetags = [...basetags, inputValue2];
    }
    this.setState({
      basetags,
      inputVisible2: false,
      inputValue2: '',
    });
  };
  saveInputRef = input => this.input = input;
  saveInputRef2 = input2 => this.input2 = input2;
  // type
  onChangeType = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({arg_type_id:e.target.value});
  };
  // picture
  handleCancel = () => this.setState({ previewVisible: false });
  onRemove = () => {
    const {dispatch} = this.props;
    if(this.state.photo_id){
      dispatch({
        type:'meetC/delMeetRoomPhoto',
        photoId:this.state.photo_id
      });
    }
  };
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = ({ fileList }) => {
    this.setState({
      fileList,
    });
  };
  // state
  onChangeState = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({arg_room_tag:e.target.value});
  };
  // submit
  handleSubmit = (e) => {
    e.preventDefault();
    const { setFieldsValue } = this.props.form;
    // setFieldsValue({arg_room_equipment:this.state.tags});
    setFieldsValue({arg_room_basic_equipment: this.state.basetags})
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(values.arg_room_equipment){
        values.arg_room_equipment = values.arg_room_equipment.join('、');
      }
      if(values.arg_room_basic_equipment){
        values.arg_room_basic_equipment = values.arg_room_basic_equipment.join('、');
      }
      if (!err) {
        const {dispatch} = this.props;
        if(this.state.fileList.length === 0){
          message.info('请上传图片');
          return;
        }
        if(values.arg_type_id === ''){
          message.info('会议类型不能为空');
          return;
        }
        if( this.props.location.query.flag === '0'){
          dispatch({
            type:'meetC/addMeetRoomConfig',
            values,
            fileList:this.state.fileList,
          });
        }else{
          dispatch({
            type:'meetC/editMeetRoomConfig',
            values,
            fileList:this.state.fileList,
            id:this.props.location.query.id,
          });
        }
      }
    });
  };
  // return
  toList = () => {
    const{dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/meetSystem/meeting_setting'
    }));
  };
  render() {
    const { list } = this.props;
    const { query } = this.props.location;
    const { getFieldDecorator } = this.props.form;
    const { previewVisible,previewImage,fileList,name,stateValue,typeValue,capacityValue,need,tags,basetags,inputVisible2,inputValue2 } = this.state;
    const typeList = list.map( (item, index) =>
      <Radio value={item.type_id} key={index}>{item.type_name}</Radio>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    // button
    const tailFormItemLayout = {
      wrapperCol: {
        span: 16,
        offset: 5,
      },
    };
    // picture
    const uploadButton = (
      <div style={{marginTop:-12}}>
        <img src={upLoad}/>
        <div className="pinktext">请上传图片</div>
      </div>
    );
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
      onChange: this.handleChange,
      onRemove:this.onRemove,
    };
    return (
      <div  className={style.meetWrap}>
        <h1 className={style.container}>会议室配置</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="会议室名称"
          >
            {getFieldDecorator('arg_room_name', {
              rules: [{ required: true, message: '请输入会议室名称' }],
              initialValue: query.flag === '0' ? name : this.state.editName
            })(<Input  placeholder="请输入" style={{maxWidth:'450px'}} onChange={this.onChangeName}/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="容量"
          >
            {getFieldDecorator('arg_room_capacity',{
              initialValue: query.flag === '0' ? capacityValue : this.state.editCapacityValue
            })(
              <Row>
                <Col span={12}>
                  <Slider min={1} max={100} onChange={this.onChange} value={query.flag === '0' ? capacityValue : this.state.editCapacityValue}/>
                </Col>
                <Col span={3}>
                  <InputNumber
                    min={1}
                    max={100}
                    style={{ marginLeft: 16 }}
                    value={query.flag === '0' ? capacityValue : this.state.editCapacityValue}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
            )}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label="配套设施"
          >
            {getFieldDecorator('arg_room_equipment', {
              initialValue: query.flag === '0' ? others : this.state.editEquipment
            })(<Input  placeholder="例如：电视机，投影机等" style={{width:'450px'}} onChange={this.onChangeOthers}/>)}
          </FormItem> */}




          <FormItem
              {...formItemLayout}
              label="视频配套设施"
            >
              {getFieldDecorator('arg_room_equipment', {
                initialValue: query.flag === '0' ? '' :tags
              })(
                <CheckboxGroup>
                 <Row>
                   <Checkbox value="华为">华为</Checkbox>
                   <Checkbox value="星澜">星澜</Checkbox>
                 </Row>
                </CheckboxGroup>,
              )}
          </FormItem>



          <FormItem
            {...formItemLayout}
            label="基础配套设施"
            >
            {getFieldDecorator('arg_room_basic_equipment', {
              initialValue: basetags
            })(
              <div>
                {basetags.map((basetag, index) => {
                  const isLongTag = basetag.length > 20;
                  const tagElem = (
                    <Tag key={index} closable={true} afterClose={() => this.handleClose2(basetag)}>
                      {isLongTag ? `${basetag.slice(0, 20)}...` : basetag}
                    </Tag>
                  );
                  return isLongTag ? <Tooltip title={basetag} key={basetag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible2 && (
                  <Input
                    ref={this.saveInputRef2}
                    type="text"
                    size="small"
                    style={{ width: 78,marginRight:10 }}
                    value={inputValue2}
                    onChange={this.handleInputChange2}
                    onBlur={this.handleInputConfirm2}
                    onPressEnter={this.handleInputConfirm2}
                  />
                )}
                {!inputVisible2 && (
                  <Tag
                    onClick={this.showInput2}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <Icon type="plus" />添加新的设备
                  </Tag>
                )}
                <Tooltip placement="right" title="如电视机、投影机等">
                  <Icon type="question-circle" style={{ fontSize: 16, color: '#08c' }}/>
                </Tooltip>
              </div>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="会议室类型"
          >
            {getFieldDecorator('arg_type_id', {
              rules: [{ required: true, message: '请选择会议室类型' }],
              initialValue: query.flag === '0' ? typeValue : this.state.editType
            })(
              <RadioGroup onChange={this.onChangeType} >
                {typeList}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="会议室图片"
            extra="如需更改图片，请删除后再重新上传"
          >
            {getFieldDecorator('picture', {
              rules: [{ required: true, message: '请上传会议室图片' }],
            })(
              <div className="clearfix">
                <div style={{position: 'absolute', marginLeft: 5}}>
                  <Upload
                    action="/filemanage/fileupload"
                    listType="picture-card"
                    fileList={ fileList }
                    {...fileObj1}
                    onPreview={this.handlePreview}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <img style={{marginLeft:150,height:132,width:115}} src={meeting}/>
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="会前需求"
          >
            {getFieldDecorator('arg_room_description', {
              initialValue: query.flag === 0 ? need : this.state.editNeed
            })(
              <TextArea placeholder="例如：要求物业提前做好视频准备、茶水等"
                        autosize={{ minRows: 2, maxRows: 5 }}
                        style={{width:'450px'}}
                        onChange={this.onChangeNeed}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="目前状态"
          >
            {getFieldDecorator('arg_room_tag', {
              initialValue: query.flag === '0'? stateValue : this.state.editState
            })(
              <RadioGroup onChange={this.onChangeState}>
                <Radio value='0'>可用</Radio>
                <Radio value='1'>不可用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button htmlType="button" style={{marginLeft: 30}} onClick = {()=>this.toList()}>返回</Button>
          </FormItem>
        </Form>
        <img style={{position:'absolute',right:1,bottom:1}} src={bg}/>
      </div>
    );
  }
}
MeetroomConfig = Form.create({})(MeetroomConfig);
function mapStateToProps (state) {
  return {
    ...state.meetroomConfig
  };
}
export default connect(mapStateToProps)(MeetroomConfig);
