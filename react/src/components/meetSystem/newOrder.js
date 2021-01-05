/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：会议预定表单组件
 */
import { connect } from 'dva';
import React from 'react';
import moment from 'moment';
import {s_e_time,timeCalc,tignore,calcTime_quantum,orderFlag,mtDiff,checkTags} from './meetConst.js'
import CheackTabs from './checkTags.js';
import {Modal,Form,Input,Checkbox,Radio,Button,Select,Slider,Tooltip,Icon,Popconfirm,message,AutoComplete,Row,Col,TimePicker} from 'antd';
import {tDiff,timeMap, timePointMap, getTimePonit,meetTpye,getSliderData} from './meetConst.js'
import Cookie from 'js-cookie'
import {getRandom} from '../../utils/func'
import styles from '../../components/meetSystem/roomOrder.less'
const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const dataSource = [
  "部门周例会",
  "部门月例会",
  "总经理办公会",
  "党建会议",
  "需求讨论会"
  ];


/**
 * 作者：卢美娟
 * 功能：预定会议的表单组件
 */
class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    const {timer,time_quantum,meet_id=''} = props;
    if(time_quantum){
      let timer1=JSON.parse(time_quantum);
      let cTimer={};
      timer1.map((i)=>{
        cTimer[i]='1'
      });
      this.state={
        timer:cTimer,
        meet_id
      }
    }else{
      this.state={
        timer:{[timer]:'1'},
        meet_id
      }
    }
  }
  state = {
    accessString:'',
    accessVisible:false,
    equipmentType:null,
    cinlanRole:null,
    cinlanLevel:'o',
    openStart:false,
    openEnd:false,
  }

  handleOpenStartChange = openStart => {
    this.setState({ openStart });
  };
  handleOpenEndChange = openEnd => {
    this.setState({ openEnd });
  };
  handleStartClose = () => this.setState({ openStart: false });
  handleEndClose = () => this.setState({ openEnd: false });

  /**
   * 作者：李杰双
   * 功能：组合数据生成tabs组件
   */
  getTabsData(userTs,initTs,time_quantum){
    const timeMap = this.props.titleTimeRes;
    let abledTags={};
    var res=[];
    if(time_quantum){
      JSON.parse(time_quantum).map((i)=>{
        abledTags[i]='1'
      })
    }

    if(!userTs){
      userTs={};
      for(let key in timeMap){
        let item={
          key:key,
          text:timeMap[key],
          checked:userTs[key]&&userTs[key]!=='0'?true:false,
          disabled:initTs[key]!=''&&!abledTags[key]?true:false,
        }
        res.push(item)
      }
    }else{
      for(let key in timeMap){
        let item={
          key:key,
          text:timeMap[key],
          checked:userTs[key]&&userTs[key]!=='0',
          disabled:initTs[key]!==''&&!abledTags[key],
        };
        res.push(item)
      }
    }
    return res
  }
  /**
   * 作者：彭东洋
   * 功能：组合数据生成tabs组件
   */
  setVipList = (array = []) => array.map((value) => (
    <Col span = {8}>
      <Checkbox value= {value.userid}>{value.username}</Checkbox> 
    </Col>)
  )
  /**
   * 作者：李杰双
   * 功能：tabs组件编辑
   */
  tabsChange=(checked,index)=>{

    const propsTs=this.props.timer;
    const formTs=this.props.form.getFieldValue('ts');

    let nt={...propsTs,...formTs};
    nt['t'+(index+1)]=checked?'1':'0';
    if(this.props.state==='readonly'){
      return
    }
    if(checkTags(nt)){
      this.props.form.setFieldsValue({ts:null});
      return
    }
    this.props.form.setFieldsValue({ts:nt})
  };
  sliderChange = (value) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({num_people2:value})
  };
  /**
   * 作者：李杰双
   * 功能：动态生成可选人数
   */
  checkPeople = (rule, value, callback) => {
    value=parseInt(value)
    if(value<=0||value>this.props.seatCapacity){

      callback(`会议室可容纳1-${this.props.seatCapacity}人`);
      return
    }
    const { setFieldsValue } = this.props.form;
    setFieldsValue({num_people:value?value:1});

    callback()
  }

  handleCinlanVIP = (e) => {
    console.log(e);
  }

  // 判断是创建一个视频会议还是加入一个视频会议
  handleCreateOrJoin = (e) => {
    const { setFieldsValue } = this.props.form;
    var value = e.target.value;
    this.setState({
      cinlanLevel: null,
    })
    if(value=='create'){
      var cinlanPass = getRandom(6,10);
      setFieldsValue({ 'cinlan_password': cinlanPass });
      this.setState({
        cinlanRole: 'create',
      })
    }else if(value=='join'){
      setFieldsValue({ 'cinlan_password': null });
      this.setState({
        cinlanRole: 'join',
      })
    }
  }
  handleChangeEquipmentType = (e) => {
    this.setState({
      equipmentType: e.target.value,
      cinlanRole: null,
    })
  }

  handleChangeCinlanLevel = (e) => {
    this.setState({
      cinlanLevel: e.target.value,
    })
  }

  handleChange = (value) => {
    var visible = false;
    if(Cookie.get('OUID') == 'e65c02c2179e11e6880d008cfa0427c4'){ //总院
      if(value.indexOf('softHarbin') != -1 || value.indexOf('softXiAn') != -1 || value.indexOf('softJinan') != -1 || value.indexOf('softGuangzhou') != -1){
        visible = true
      }
    }
    else if(Cookie.get('OUID') == 'e65c072a179e11e6880d008cfa0427c4'){ //哈尔滨
      if(value.indexOf('softMain') != -1 || value.indexOf('softXiAn') != -1 || value.indexOf('softJinan') != -1 || value.indexOf('softGuangzhou') != -1){
        visible = true
      }
    }
    else if(Cookie.get('OUID') == '768d61845de711e89f90782bcb561704'){ //西安
      if(value.indexOf('softMain') != -1 || value.indexOf('softHarbin') != -1 || value.indexOf('softJinan') != -1 || value.indexOf('softGuangzhou') != -1){
        visible = true
      }
    }
    else if(Cookie.get('OUID') == 'e65c067b179e11e6880d008cfa0427c4'){ //济南
      if(value.indexOf('softMain') != -1 || value.indexOf('softHarbin') != -1 || value.indexOf('softXiAn') != -1 || value.indexOf('softGuangzhou') != -1){
        visible = true
      }
    }
    else if(Cookie.get('OUID') == '96ff4eb55de811e89f90782bcb561704'){ //广州
      if(value.indexOf('softMain') != -1 || value.indexOf('softHarbin') != -1 || value.indexOf('softXiAn') != -1 || value.indexOf('softJinan') != -1){
        visible = true
      }
    }

    this.setState({
      accessString: value,
      accessVisible: visible,
    })
  }
  componentDidMount() {
    const {device} = this.props;
    // 通过device来判断是否是星澜会议
    this.setState({
      equipmentType: device,
    })
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 20,
          col:1
        },
        sm: {
          span: 14
        }
      }
    };
    const {getFieldDecorator} = this.props.form;
    const {cinlan_vip,cinlan_type,cinlan_fail_reason,cinlan_id,meet_id,staff_name,staff_tel,room_name,meetflag,seatCapacity,state,conference_title,num_perple,level_name,userState,cancelCheck,meetTypeRes,equipment,basicEquimpent,participants} = this.props;
    let {cinlan_role,roomName} = this.props;
    console.log('roomName',roomName)
    cinlan_role = cinlan_role == null ? "null" : cinlan_role;
    const {ts=[t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12],time_quantum,timer,start_time,total_book_time} = this.props;
    let ftimer={};
    if(time_quantum){
      JSON.parse(time_quantum).map((i)=>{
        ftimer[i]='1'
      })

    }else{
      if(typeof  timer==='object'){
        ftimer=timer
      }else{
        ftimer[timer]='1'
      }
    }
    const disabled= state==='readonly'||userState===0
    const formTs=this.props.form.getFieldValue('ts'); //默认选中项对应的T
    let tabsData;
    if(typeof formTs === 'undefined'){
      tabsData=this.getTabsData(ftimer,ts);
    }
    else{
      tabsData=this.getTabsData(formTs,ts,time_quantum);
    }
    var listOption = () => {
      var res = [];
      for(var i = 0; i < meetTypeRes.length; i++){
        res.push(
          <Option value = {meetTypeRes[i].level_id}>{meetTypeRes[i].level_name}</Option>
        )
      }
      return res
    }
    var equipmentRadio = () => {
      var res = [];
      if(equipment&&equipment.length>0){
        var equipmentArr = equipment.split('、');
        for(let i = 0; i < equipmentArr.length; i++){
          res.push(
            <Radio value = {equipmentArr[i]}>{equipmentArr[i]}</Radio>
          )
        }
      }
      return res;
    };
    //禁止分钟函数
    let range = (n1, n2) => {
      const result = [];
      if(n2) {
        for (let i = n1+1; i < n2; i++) {
          result.push(i);
        }
        for(let j = n2+1; j < 60; j++){
          result.push(j);
        }
      } else {
        for (let i = 0; i < n1; i++) {
          result.push(i);
        }
        for(let j = n1+1; j < 60; j++){
          result.push(j);
        }
      }
      return result;
    }
    //禁止的分钟
    let disabledMinutes = (h) => {
        return range(0,30)
    }
    //时间的映射关系
    const timeMap = this.props.titleTimeRes;
    let defaultts = []; //选中的时间
    let startTime = ""; //默认开始时间
    let endTime = "";  //默认结束的时间
    for(let i in ts){
      if(ts[i] != "" && ts[i] != "0"){
        defaultts.push(i)
      }
    }
    const mappingValue = Object.keys(timer)[0]
    //获取开始和结束的时间
    if(start_time){
      const i = start_time.split(" ")[1].lastIndexOf(":");
      const times = total_book_time;
      startTime = start_time.split(" ")[1].substring(0,i);
      var hourCounts = (times / 60).toString();
      let endMin = "";
      if(hourCounts % 1 === 0){
        endMin = Number(startTime.split(":")[1])
      } else {
        endMin = Number(startTime.split(":")[1]) + Number(hourCounts.split(".")[1])*6;
      };
      let endHour = Number(startTime.split(":")[0])  + Number(hourCounts.split(".")[0]);
      endHour = endHour < 10 ? "0" + endHour : endHour;
      endMin = endMin < 10 ? "0"+ endMin : endMin;
      if(endMin >= 60) {
        endHour = Number(endHour) + 1;
        endMin = "00";
      };
      endTime = endHour + ":" + endMin;
    } else {
      if(mappingValue != 'null') {
        startTime = timeMap[mappingValue].split("-")[0];
        endTime = timeMap[mappingValue].split("-")[1];
      };
    };
    return (
      <Form  onSubmit={this.handleSubmit} className={styles.orderForm}>
        <FormItem label="会议室" {...formItemLayout} className={styles.hideItem}>
          {getFieldDecorator('room_name',{initialValue:room_name})
          (<Input disabled={true} />)}
        </FormItem>

        <FormItem label="预定人" {...formItemLayout} className={styles.hideItem}>
          {getFieldDecorator('stuff_name',{initialValue:staff_name||Cookie.get('username')})(<Input disabled={true} />)}
        </FormItem>

        <FormItem label="会议名称" {...formItemLayout}>
          {getFieldDecorator('conference_title', {
            rules: [
              {
                required: true,
                message: '请输入会议名称！'
              },
              {
                whitespace: true,
                message: '请输入会议名称！'
              }
            ],
            initialValue:state==='insert'?'':conference_title
          })(<AutoComplete
            dataSource={dataSource}
            filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1}
            disabled={disabled}
          />)}
        </FormItem>

        <FormItem label="会议人数" {...formItemLayout} className={styles.peopleItem}>
          {getFieldDecorator('num_people', {
            initialValue:state==='insert'?2:parseInt(num_perple)
          })(<Slider min = {1}  max = {parseInt(seatCapacity)}  step={1} disabled={disabled} onChange={this.sliderChange}/>)}
        </FormItem>

        <FormItem className={styles.hidLabel} label=" " {...formItemLayout} help={`可容纳1-${seatCapacity}人`}>
          {getFieldDecorator('num_people2', {
            initialValue:state==='insert'?2:parseInt(num_perple),

            rules: [
              {validator:this.checkPeople,}
            ],
          })(<Input style={{ width: 200 }} type="number" min={1} max={parseInt(seatCapacity)}  step={1} disabled={disabled}/>)}
        </FormItem>

        <FormItem label="联系电话" {...formItemLayout}>
          {getFieldDecorator('stuff_tel', {
            rules: [
              {
                required: true,
                message: '请输入正确的联系电话！'
              },
              {
                pattern:/^1[0-9]{10}$/,
                message: '请输入正确的联系电话！'
              }


            ],
            initialValue:staff_tel||Cookie.get('tel')
          })(<Input style={{ width: 200 }}  disabled={disabled}/>)}
        </FormItem>

        <FormItem label="会议类别" {...formItemLayout}>
          <div  className={styles.order_item_type}>
            {getFieldDecorator('type',{
              initialValue:(state==='insert' || state ==='update') ?meetTypeRes[0].level_id:level_name,
            })(<Select style={{ width: 200 }}   disabled={disabled}>
               {listOption()}
            </Select>)}

            <Tooltip placement="right" title={meetTypeRes.map((i,index)=><div key={index}>{i.level_name}：{i.level_describe}</div>)}>
              <Icon type="question-circle" style={{ fontSize: 16, color: '#08c' }}/>
            </Tooltip>
          </div>
        </FormItem>
        {/* <FormItem className={styles.order_item_time} label="起止时间" {...formItemLayout} labelCol={{
          xs: {
            span: 24
          },
          sm: {
            span: 6
          }
        }} wrapperCol={{
          xs: {
            span: 24
          },
          sm: {
            span: 24
          }
        }}>
          {getFieldDecorator('ts', {
            initialValue:ftimer,
          })(
            <div>
              <CheackTabs tabsData={tabsData} tabsChange={this.tabsChange}/>
            </div>

          )}
        </FormItem> */}
        <div className={styles.order_item_picker}>
        <FormItem validateStatus={this.props.datepickerWaring}  help={this.props.errorDescription} label="开始时间" {...formItemLayout} labelCol={{
          xs: {
            span: 24
          },
          sm: {
            span: 11
          }
        }} wrapperCol={{
          xs: {
            span: 24
          },
          sm: {
            span: 24
          }
        }}>
          {getFieldDecorator('ts1', {
            initialValue:moment(startTime,'HH:mm'),
            rules:[
              { required: true, message:"请选择开始时间"},
            ],
          })(<TimePicker
              onOpenChange={this.handleOpenStartChange}
              open={this.state.openStart}
              hideDisabledOptions
              disabledMinutes = {disabledMinutes}
              format="HH:mm"
              addon={() => (
                <Button className={styles.order_item_button} size="small" type="primary" onClick={this.handleStartClose}>
                  Ok
                </Button>
              )}
           />)}
        </FormItem>
        <FormItem
          validateStatus={this.props.datepickerWaring}
          help={this.props.errorDescription}
          label="结束时间" {...formItemLayout}
          labelCol={{
          xs: {
            span: 24
          },
          sm: {
            span: 11
          }
        }} wrapperCol={{
          xs: {
            span: 24
          },
          sm: {
            span: 24
          }
        }}>
          {getFieldDecorator('ts2', {
            initialValue:moment(endTime,'HH:mm'),
            rules:[
              { required: true, message:"请选择结束时间"},
            ],

          })(<TimePicker
              onOpenChange={this.handleOpenEndChange}
              open={this.state.openEnd}
              hideDisabledOptions
              disabledMinutes={disabledMinutes}
              format="HH:mm"
              addon={() => (
                <Button className={styles.order_item_button} size="small" type="primary" onClick={this.handleEndClose}>
                  Ok
                </Button>
              )}
          />)}
        </FormItem>
        </div>

        {
          (meetflag == '1')?
          <FormItem label="视频配置" {...formItemLayout}>
            {getFieldDecorator('selectEquipment',{
              rules: [
                { required: this.state.accessVisible, message: '请选择视频配置！', type: 'string' },
              ],
              initialValue:this.state.equipmentType,
            })

              (
                roomName.room_name == 'T001'||roomName.room_name == 'T005'||roomName.room_name == 'A101'?
                  <span>华为设备（连接集团）</span>
                  :
                  <span>云视频（连接分院、省份）</span>
            )}
          </FormItem>
          :
          null
        }

        {
          (meetflag=='1' && this.state.equipmentType=='华为')?
              <FormItem label="视频接入方"  {...formItemLayout} >
               {getFieldDecorator('videoAccess', {
                 rules: [
                   { required: true, message: '请选择视频接入方！' },
                 ],

                 initialValue:(participants != undefined) ? (participants.split(',')): participants

               })(
                 <Select mode="multiple" placeholder="请选择" onChange = {this.handleChange}>
                   <Select.Option value="softMain">软研院总院</Select.Option>
                   <Select.Option value="group">集团</Select.Option>
                   <Select.Option value="branch">省分</Select.Option>
                   <Select.Option value="softJinan">济南分院</Select.Option>
                   <Select.Option value="softHarbin">哈尔滨分院</Select.Option>
                   <Select.Option value="softXiAn">西安分院</Select.Option>
                   <Select.Option value="softGuangzhou">广州分院</Select.Option>
                 </Select>
               )}
              </FormItem>

          :null
        }

        {
          (meetflag=='1' && this.state.equipmentType=='星澜')?
          <div>

              {(meet_id==null)?
              <FormItem label="入会方式" {...formItemLayout}>
                {getFieldDecorator('create_or_join',{
                  rules: [
                    { required: true, message: '请选择加入会议还是创建会议' },
                  ],
                })(
                  <RadioGroup onChange = {this.handleCreateOrJoin}>
                    <Radio value = 'create'>新建会议</Radio>
                    <Radio value = 'join'>加入会议</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            :
              <FormItem label="会议角色" {...formItemLayout}>
                {getFieldDecorator('cinlan_role',{
                  initialValue:cinlan_role
                })(
                  <RadioGroup disabled={true}>
                    <Radio value = 'create'>创建者</Radio>
                    <Radio value = 'join'>参与者</Radio>
                    <Radio value = 'null'>未入会</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            }
            {(meet_id==null)?
              <div>
              {(this.state.cinlanRole=='join')?
              <FormItem label="星澜会议id"  {...formItemLayout} >
                {getFieldDecorator('cinlan_id', {
                  rules: [
                    { required: true, message: '请输入星澜会议id' },
                  ],
                  initialValue:cinlan_id
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
              :null}
              <FormItem label="入会密码"  {...formItemLayout} >
                {getFieldDecorator('cinlan_password', {
                  rules: [
                    { required: true, message: '请输入星澜入会密码' },
                    {
                      max: 6,
                      message: '入会密码不超过6个字符'
                    }
                  ],
                  initialValue:this.state.cinlanPassword
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
              {(this.state.cinlanRole=='create')?
              <FormItem label="视频会议类型"  {...formItemLayout} >
                {getFieldDecorator('cinlan_type', {
                  rules: [
                  ],
                  initialValue:'o'
                })(
                  <RadioGroup onChange = {this.handleChangeCinlanLevel}>
                    <Radio value = 'o'>一般会议</Radio>
                    <Radio value = 'i'>重要会议</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              :null}
              </div>
              :
              <div>
              {(cinlan_id==null)?
              <FormItem label="入会失败原因"  {...formItemLayout} >
                {getFieldDecorator('cinlan_fail_reason', {
                  initialValue:cinlan_fail_reason
                })(<Input style={{ width: 200 }}  disabled={true}/>)}
              </FormItem>
              :
              <FormItem label="星澜会议id"  {...formItemLayout} >
                {getFieldDecorator('cinlan_id_for_display', {
                  initialValue:cinlan_id
                })(<Input style={{ width: 200 }}  disabled={true}/>)}
              </FormItem>
              }
              <FormItem label="视频会议类型"  {...formItemLayout} >
                {getFieldDecorator('cinlan_type', {
                  rules: [
                  ],
                  initialValue:cinlan_type
                })(
                  <RadioGroup disabled={true}>
                    <Radio value = 'o'>一般会议</Radio>
                    <Radio value = 'i'>重要会议</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              </div>
            }
          </div>
          :null
        }
        {
          (this.state.cinlanLevel == 'i' && this.state.cinlanRole == 'create')?
          <FormItem label="重要出席者" {...formItemLayout}>
          {getFieldDecorator('cinlan_vip', {
            rules: [
              { required: true, message: '请至少选择一位重要出席者' },
            ],
          })(
            <Checkbox.Group style={{ width: '100%' }} onChange = {this.handleCinlanVIP}>
              <Row>
                {this.setVipList(this.props.vipList)}
              </Row>
            </Checkbox.Group>
          )}
          </FormItem>
          :
          null
        }
        {(cinlan_vip!=null)?
        <FormItem label="重要出席者"  {...formItemLayout} >
          {getFieldDecorator('cinlan_vip_for_display', {
            initialValue:cinlan_vip
          })(<Input style={{ width: 300 }}  disabled={true}/>)}
        </FormItem>
          :null
        }
        {
          (basicEquimpent != 0)?
          <FormItem label="基础配置" {...formItemLayout}>
            {basicEquimpent}
          </FormItem>
          :
          null
        }

        {state==='update'?<Row>
          <Col sm={6} xs={24} className={styles.cancelCheck} >
            <Checkbox onChange={cancelCheck}>取消会议</Checkbox>
          </Col>
        </Row>:null}
      </Form>
    )
  }
}
const OForm = Form.create()(OrderForm);
/**
 * 作者：李杰双
 * 功能：申请会议组件
 */
class NewOrder extends React.Component {
  state = {
    ModalText: '预定会议室',
    item: {},
    timer: '',
    state:'insert',
  }

  /**
   * 作者：李杰双
   * 功能：显示申请表单
   */
  showModal = (meetTypeRes,titleTimeRes,record, timer, date,meetflag,item,state='insert') => {
    if(item){
      let {seatCapacity=1,t1='0',t2='0',t3='0',t4='0',t5='0',t6='0',t7='0',t8='0',t9='0',t10='0',t11='0',t12='0'} = item;
      this.setState({visible: true,
        item: record,
        timer,
        date,
        meetflag,
        state,
        seatCapacity,
        ts:{t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12},
        key:record.room_id+JSON.stringify(timer),
        roomid: item.room_id, //new add
        titleTimeRes, //new add
        meetTypeRes
      });
    }else{
      let {seatCapacity=1,t1='0',t2='0',t3='0',t4='0',t5='0',t6='0',t7='0',t8='0',t9='0',t10='0',t11='0',t12='0'} = record;
      this.setState({visible: true,
        item: record,
        timer,
        date,
        meetflag,
        state,
        seatCapacity,
        ts:{t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12},
        key:record.room_id+JSON.stringify(timer),
        roomid: record.room_id, //new add
        titleTimeRes, //new add
        meetTypeRes
      });
    }
    if(state!=='insert'){

    }
  };
  /**
   * 作者：李杰双
   * 功能：确定按钮功能
   */
  handleOk = (flag) => {
    let start_time = "";
    let total_book_time = "";
    const {onSubmit,orderUpdate} =this.props;
    const {item,date,titleTimeRes,roomid} = this.state;
    this.formRef.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        if(err.num_people2){
          message.error(err.num_people2.errors[0].message)
        }
        return
      }
      //转换时间格式
      let getrealStartTime = (formts) => {
          const realYear = formts._d.getFullYear();
          let realMonth = formts._d.getMonth() + 1;
          let realday = formts._d.getDate();
          let realHours = formts._d.getHours();
          let realMinutes = formts._d.getMinutes();
          realMonth = realMonth < 10 ? "0"+realMonth : realMonth;
          realday = realday < 10 ? "0"+ realday : realday;
          realHours = realHours < 10 ? "0"+ realHours : realHours;
          realMinutes = realMinutes < 10 ? "0"+ realMinutes : realMinutes;
          const realTime = realYear + "-" + realMonth + "-" + realday + " " + realHours + ":" + realMinutes + ":" + "00"
          return realTime
      }

      let time = (t,start,end) => {
        let tsRs = {}
        let count = Math.floor((end - start)/1000/60/30);
        let ft = Math.floor((start - t)/1000/60/30)+1;
        if(count > 0) {
          for(let i=0; i<count; i++){
            tsRs["t"+ft]="1"
            ft++
          }
        }
        return tsRs
      }

      if(values.ts1 && values.ts2 ){
        start_time = getrealStartTime(values.ts1)
        // total_book_time = (values.ts2._d - values.ts1._d)/1000/60 + "";
        const timeMap = this.props.titleTimeRes; //时间对应表
        let imp1 = timeMap.t1.split(":")[0];
        let imp2 = timeMap.t1.split(":")[1].split("-")[0];
        let now = new Date();
        let sTime = now.setHours(imp1,imp2);//t1对应的时间
        let startH = values.ts1._d.getHours();
        let startM = values.ts1._d.getMinutes();
        let endH = values.ts2._d.getHours();
        let endM = values.ts2._d.getMinutes();
        if(endH == 0 && endM == 0 ) {
          if(startH != 0){
            endH = 24;
          } else if(startH ==0 && startM >0){
            endH = 24;
          }

        }
        total_book_time = (endH*60 + endM) - (startH*60 + startM) + "";
        let Start = now.setHours(startH,startM);//开始时间
        let End = now.setHours(endH,endM);
        var tsRsk = time(sTime,Start,End);
      } else {
        tsRsk = values.ts;
      }
      const {type_id,meet_id}=item;
      const time_quantum=calcTime_quantum(tsRsk);
      let formData={
        ...values,
        order_day:date,
        type_id,
        meet_id,
        // s_time,
        // e_time,
        time_quantum,
        roomid:roomid,
        time_quantum2:JSON.stringify(time_quantum),
        titleTimeRes,
        start_time,
        total_book_time,
      };
      if(flag==='insert'){
        let flag=orderFlag(this.state.item)?'insert':'update';
        onSubmit(formData,this.handleCancel,flag)
      }else{
        let postTs={},postMts={};
        JSON.parse(this.state.item.time_quantum).map((i)=>{
          postTs[i]='0';
          postMts['m'+i]='';
        });
        formData.ts={...postTs,...tDiff(formData.ts)};
        formData.mts={...postMts,...mtDiff(formData.ts,meet_id,values.conference_title)}
        orderUpdate(formData,this.handleCancel)
      }
    });

  };
  /**
   * 作者：李杰双
   * 功能：取消按钮功能 重置表单
   */
  handleCancel = () => {
    this.setState({visible: false,cancelCheck:false});
    this.formRef.props.form.resetFields()
  };
  /**
   * 作者：李杰双
   * 功能：取消会议
   */
  orderCancel=()=>{

    this.props.orderCancel(
      {meet_id:this.state.item.meet_id},
      this.handleCancel
    )
  }
  /**
   * 作者：李杰双
   * 功能：根据状态动态生成表单底部按钮
   */
  footer=()=>{
    const {state,cancelCheck=false} = this.state;
    const {loading} = this.props;

    const close=<Button onClick={this.handleCancel}>取消</Button>
    if(state==='readonly'){
      return close
    }
    if(state==='insert'){
      return <div>{close}<Button type="primary" onClick={()=>this.handleOk('insert')} disabled={this.props.userState?false:true} loading={loading}>确定</Button></div>
    }
    if(state==='update'){
      if(cancelCheck){
        return <div>{close}<Popconfirm title='确定取消会议？' onConfirm={this.orderCancel}><Button type="primary"   loading={loading} disabled={this.props.userState?false:true}>确定</Button></Popconfirm>
          </div>
      }
      return <div>{close}
        <Button type="primary" loading={loading} onClick={()=>this.handleOk('update')} disabled={this.props.userState?false:true}>确定</Button></div>
    }
  };
  tabsChange=(timer)=>{
    this.setState({timer:timer})
  };
  cancelCheck=(e)=>{
    this.setState({cancelCheck:e.target.checked})
  };



  render() {
    const {visible,state,date,timer,item,ts,key,titleTimeRes,meetTypeRes,meetflag} = this.state;
    const {equipment,basicEquimpent, datepickerWaring,errorDescription,vipList} = this.props;
    return (
      <div>
        {visible?<Modal key={key} footer={this.footer()}  title={`会议室${item.room_name}预定 - ${item.staff_name||Cookie.get('username')}`} visible={visible} onOk={this.handleOk}  onCancel={this.handleCancel} width='30%'>
          <OForm  wrappedComponentRef={(inst) => this.formRef = inst}
                  seatCapacity={this.state.seatCapacity}
                  {...item}
                  timer={timer}
                  date={date}
                  roomName={item}
                  state={state}
                  ts={ts}
                  titleTimeRes = {titleTimeRes}
                  meetTypeRes = {meetTypeRes}
                  userState={this.props.userState}
                  tabsChange={this.tabsChange}
                  cancelCheck={this.cancelCheck}
                  equipment = {equipment}
                  basicEquimpent = {basicEquimpent}
                  meetflag = {meetflag}
                  datepickerWaring={datepickerWaring}
                  errorDescription={errorDescription}
                  vipList = {vipList}
          />
        </Modal>:null}
      </div>


    );
  }
}
export default NewOrder;
