/**
 *  作者: 张枫
 *  创建日期: 2019-02-21
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：填报工作量和服务模态框
 **/
import React from 'react';
import {Modal,Form,InputNumber,Col,Row,Input} from 'antd';
const FormItem = Form.Item;
class WorkloadAndServiceModal extends React.Component{
  constructor(props) {super(props);}
  state={}
  /**
   * 作者：张枫
   * 日期：2019-02-20
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：关闭模态框
   **/
  judgeInput=(e)=>{
      let value1 = e.target.value;
      //先将非数值去掉
      let value = value1.replace(/[^\d.]/g, '');
      //如果以小数点开头，改为0
      if (value === '.') {
        value = '0'
      }
      // 如果第一位输入0，后面只能输入小数点
      if (value[0]  === '0' && value[1] !== '.') {
        value = '0';
      }
    if(Number(value)>10000){
      value = '0'
    }
      //如果输入两个小数点，去掉一个
      if (value.indexOf('.') !== value.lastIndexOf('.')) {
        value = value.substring(0, value.lastIndexOf('.'));
      }
      //如果有小数点
      if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
        //费用项，最多2位小数
        value = value.substring(0, value.indexOf('.') + 3);
      }
    e.target.value = value;
  }
  judgeInput1=(e)=>{
    let value1 = e.target.value;
    //先将非数值去掉
    let value = value1.replace(/[^\d.]/g, '');
    //如果以小数点开头，改为0
    if (value === '.') {
      value = '0'
    }
    // 如果第一位输入0，后面只能输入小数点
    if (value[0]  === '0' && value[1] !== '.') {
      value = '0';
    }
    if(Number(value)>10){
      value = '10'
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 2);
    }
    e.target.value = value;
  }
  judgeInput2=(e)=>{
    let value1 = e.target.value;
    //先将非数值去掉
    let value = value1.replace(/[^\d.]/g, '');
    //如果以小数点开头，改为0
    if (value === '.') {
      value = '0'
    }
    // 如果第一位输入0，后面只能输入小数点
    if (value[0]  === '0' && value[1] !== '.') {
      value = '0';
    }
    if(Number(value)>15){
      value = '15'
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 2);
    }
    e.target.value = value;
  }
  judgeInput3=(e)=>{
    let value1 = e.target.value;
    //先将非数值去掉
    let value = value1.replace(/[^\d.]/g, '');
    //如果以小数点开头，改为0
    if (value === '.') {
      value = '0'
    }
    // 如果第一位输入0，后面只能输入小数点
    if (value[0]  === '0' && value[1] !== '.') {
      value = '0';
    }
    if(Number(value)>25){
      value = '25'
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 2);
    }
    e.target.value = value;
  }
  judgeInput4=(e)=>{
    let value1 = e.target.value;
    //先将非数值去掉
    let value = value1.replace(/[^\d.]/g, '');
    //如果以小数点开头，改为0
    if (value === '.') {
      value = '0'
    }
    // 如果第一位输入0，后面只能输入小数点
    if (value[0]  === '0' && value[1] !== '.') {
      value = '0';
    }
    if(Number(value)>20){
      value = '20'
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 2);
    }
    e.target.value = value;
  }
  judgeInput5=(e)=>{
    let value1 = e.target.value;
    //先将非数值去掉
    let value = value1.replace(/[^\d.]/g, '');
    //如果以小数点开头，改为0
    if (value === '.') {
      value = '0'
    }
    // 如果第一位输入0，后面只能输入小数点
    if (value[0]  === '0' && value[1] !== '.') {
      value = '0';
    }
    if(Number(value)>30){
      value = '30'
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'));
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 2);
    }
    e.target.value = value;
  }
  render(){
    const { getFieldDecorator,getFieldValue} = this.props.form;
    let {param} = this.props;
    // 更改param 数据格式，将工作量数据移到外边
    if(param!='')
    {
      let work_load_temp = JSON.parse(param.work_load);
      for (let i=0;i<work_load_temp.length;i++){
        if(work_load_temp[i].level_id =="A"){
          param.month_work_cnt_h =work_load_temp[i].month_work_cnt;
          param.other_month_work_cnt_h =work_load_temp[i].other_month_work_cnt;
          param.workload_sum_h=work_load_temp[i].workload_sum;
        }else if(work_load_temp[i].level_id =="B"){
          param.month_work_cnt_m =work_load_temp[i].month_work_cnt;
          param.other_month_work_cnt_m =work_load_temp[i].other_month_work_cnt;
          param.workload_sum_m=work_load_temp[i].workload_sum;
        }else if (work_load_temp[i].level_id =="C"){
          param.month_work_cnt_l =work_load_temp[i].month_work_cnt;
          param.other_month_work_cnt_l =work_load_temp[i].other_month_work_cnt;
          param.workload_sum_l=work_load_temp[i].workload_sum;
        }
      }
    }else{
      param = {};
    }
    return(
      <Form>
        <div style ={{display:"inline-block",width :'350px',paddingLeft:'10px',paddingRight:'10px'}}>
          <Row gutter={28}>
            <Col style = {{fontSize:'16px',paddingBottom:'5px',fontFamily:'black'}} span={24}>工作量填报（单位：人月）</Col>
          </Row>
          <Row gutter={28} style = {{paddingTop:"15px"}}>
            <Col span = {8}></Col>
            <Col span = {8}>标准工作量</Col>
            <Col span = {8}>额外工作量</Col>
          </Row>
          <Row gutter={28}>
            <Col span = {8}>
              {
                (typeof(getFieldValue('arg_month_work_cnt_h'))=="undefined" && typeof(getFieldValue('arg_other_month_work_cnt_h'))=="undefined")
                  ? (typeof(param.workload_sum_h) == "undefined" ? <p>{"高级"}</p> : <p>{"高级（" + param.workload_sum_h + " )"}</p>)
                  :
                  (<p>{"高级（" + (
                  Number(getFieldValue('arg_month_work_cnt_h') !== undefined ? getFieldValue('arg_month_work_cnt_h'): '')
                  +
                  Number(getFieldValue('arg_other_month_work_cnt_h') !== undefined ? getFieldValue('arg_other_month_work_cnt_h'): '')
                  ).toFixed(2) + " )"}
                  </p>)
              }
            </Col>
            <Col span = {8}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_month_work_cnt_h",
                    {
                      initialValue:param.month_work_cnt_h !== undefined ? param.month_work_cnt_h : '',
                      // initialValue:'',
                      rules: [
                        {required: true, message: '请输入高级标准工作量'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
            <Col span = {8}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_other_month_work_cnt_h",
                    {
                      initialValue:param.other_month_work_cnt_h !== undefined ? param.other_month_work_cnt_h : '',
                      //initialValue:'0',
                      /*
                      rules: [
                        {required: true, message: '请输入高级额外工作量'}
                      ]
                      */
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={28}>
            <Col span = {8}>
              {
                (typeof(getFieldValue('arg_month_work_cnt_m'))=="undefined" && typeof(getFieldValue('arg_other_month_work_cnt_m'))=="undefined")?
                  (typeof(param.workload_sum_m) =="undefined"? <p>{"中级"}</p> : <p>{"中级（" + param.workload_sum_m + " )"}</p>)
                  :
                  (<p>{"中级（" + (
                    Number(getFieldValue('arg_month_work_cnt_m') !== undefined ? getFieldValue('arg_month_work_cnt_m'): '')
                    +
                    Number(getFieldValue('arg_other_month_work_cnt_m') !== undefined ? getFieldValue('arg_other_month_work_cnt_m'): '')
                  ).toFixed(2) + " )"}
                  </p>)
              }
            </Col>
            <Col span = {8}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_month_work_cnt_m",
                    {
                      initialValue:param.month_work_cnt_m !== undefined ? param.month_work_cnt_m : '',
                      rules: [
                        {required: true, message: '请输入中级标准工作量'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
            <Col span = {8}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_other_month_work_cnt_m",
                    {
                      initialValue:param.other_month_work_cnt_m !== undefined ? param.other_month_work_cnt_m : '',
                     // initialValue:'0',
                      /*
                      rules: [
                        {required: true, message: '请输入中级额外工作量'}
                      ]
                      */
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={28}>
            <Col  span = {8}>
              {
                (typeof(getFieldValue('arg_month_work_cnt_l'))=="undefined" && typeof(getFieldValue('arg_other_month_work_cnt_l'))=="undefined")?
                  (typeof(param.workload_sum_l) =="undefined"? <p>{"初级"}</p> : <p>{"初级（" + param.workload_sum_l + " )"}</p>)
                  :
                  (<p>{"初级（" + (
                    Number(getFieldValue('arg_month_work_cnt_l') !== undefined ? getFieldValue('arg_month_work_cnt_l'): '')
                    +
                    Number(getFieldValue('arg_other_month_work_cnt_l') !== undefined ? getFieldValue('arg_other_month_work_cnt_l'): '')
                  ).toFixed(2) + " )"}
                  </p>)
              }
            </Col>
            <Col span = {8}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_month_work_cnt_l",
                    {
                      initialValue:param.month_work_cnt_l !== undefined ? param.month_work_cnt_l : '',
                      //initialValue:'',
                      rules: [
                        {required: true, message: '请输入低级标准工作量'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
            <Col span = {8}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_other_month_work_cnt_l",
                    {
                      initialValue:param.other_month_work_cnt_l !== undefined ? param.other_month_work_cnt_l : '',
                     // initialValue:'0',
                      /*
                      rules: [
                        {required: true, message: '请输入低级额外工作量'}
                      ]
                      */
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
        <div style ={{display:"inline-block",width:'3px',height:'280px',backgroundColor:'#F5F5F5',verticalAlign:'bottom'}}>
        </div>
        <div style ={{display:"inline-block",verticalAlign:'top',width:'350px'}}>
          <Row gutter={28}>
            <Col span={1}></Col>
            {
              this.props.status == "y" ?
            <Col style = {{fontSize:'16px',paddingBottom:'17px',fontFamily:"black"}} span={23}>
              {
                (typeof(getFieldValue('arg_stability_score'))=="undefined" && typeof(getFieldValue('arg_attend_score'))=="undefined"
                && typeof(getFieldValue('arg_delivery_score'))=="undefined"&& typeof(getFieldValue('arg_quality_score'))=="undefined"
                && typeof(getFieldValue('arg_manage_score'))=="undefined")?
                  (typeof(param.service_sum) =="undefined"? <p>{"服务评价"}</p> : <p>{"服务评价（" + param.service_sum + " )"}</p>)
                  :
                  (<p>{"服务评价（总分: " + (
                    Number(getFieldValue('arg_stability_score') !== undefined ? getFieldValue('arg_stability_score'): '')
                    +
                    Number(getFieldValue('arg_attend_score') !== undefined ? getFieldValue('arg_attend_score'): '')
                    +
                    Number(getFieldValue('arg_delivery_score') !== undefined ? getFieldValue('arg_delivery_score'): '')
                    +
                    Number(getFieldValue('arg_quality_score') !== undefined ? getFieldValue('arg_quality_score'): '')
                    +
                    Number(getFieldValue('arg_manage_score') !== undefined ? getFieldValue('arg_manage_score'): '')
                  ).toFixed(2) + " )"}
                  </p>)
              }
            </Col>
            :
            <Col style = {{fontSize:'16px',paddingBottom:'17px',fontFamily:"black"}} span={23}>
              {
                (typeof(getFieldValue('arg_stability_score'))=="undefined" && typeof(getFieldValue('arg_attend_score'))=="undefined"
                && typeof(getFieldValue('arg_delivery_score'))=="undefined"&& typeof(getFieldValue('arg_quality_score'))=="undefined"
                && typeof(getFieldValue('arg_manage_score'))=="undefined" && typeof(getFieldValue('arg_invest_score'))=="undefined")?
                  (typeof(param.service_sum) =="undefined"? <p>{"服务评价"}</p> : <p>{"服务评价（" + param.service_sum + " )"}</p>)
                  :
                  (<p>{"服务评价（总分: " + (
                    Number(getFieldValue('arg_stability_score') !== undefined ? getFieldValue('arg_stability_score'): '')
                    +
                    Number(getFieldValue('arg_attend_score') !== undefined ? getFieldValue('arg_attend_score'): '')
                    +
                    Number(getFieldValue('arg_delivery_score') !== undefined ? getFieldValue('arg_delivery_score'): '')
                    +
                    Number(getFieldValue('arg_quality_score') !== undefined ? getFieldValue('arg_quality_score'): '')
                    +
                    Number(getFieldValue('arg_manage_score') !== undefined ? getFieldValue('arg_manage_score'): '')
                    +
                    Number(getFieldValue('arg_invest_score') !== undefined ? getFieldValue('arg_invest_score'): '')
                  ).toFixed(2) + " )"}
                  </p>)
              }
            </Col>
  }
          </Row>
      {/* 添加判断条件 y为1~6月 */}
          {this.props.status == "y"?
          <div>
          <Row >
            <Col span = {2}></Col>
            <Col span = {16}>团队能力表现（20分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_stability_score",
                    {
                      initialValue:param.stability_score !== undefined ? param.stability_score : '',
                      rules: [
                        {required: true, message: '请输入团队能力表现得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput4(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>出勤率（10分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_attend_score",
                    {
                      initialValue:param.attend_score !== undefined ? param.attend_score : '',
                      rules: [
                        {required: true, message: '请输入出勤率得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput1(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>交付及时率（30分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_delivery_score",
                    {
                      initialValue:param.delivery_score !== undefined ? param.delivery_score : '',
                      rules: [
                        {required: true, message: '请输入交付及时率得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput5(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>交付质量（30分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_quality_score",
                    {
                      initialValue:param.quality_score !== undefined ? param.quality_score : '',
                      rules: [
                        {required: true, message: '请输入交付质量得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput5(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>内部管理能力（10分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_manage_score",
                    {
                      initialValue:param.manage_score !== undefined ? param.manage_score : '',
                      rules: [
                        {required: true, message: '请输入内部管理能力得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput1(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          </div>
            :
          <div>
            <Row >
            <Col span = {2}></Col>
            <Col span = {16}>资源投入率（15分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_invest_score",
                    {
                      initialValue:param.invest_score !== undefined ? param.invest_score : '',
                      rules: [
                        {required: true, message: '请输入资源投入率得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput2(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col span = {2}></Col>
            <Col span = {16}>资源稳定性（15分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_stability_score",
                    {
                      initialValue:param.stability_score !== undefined ? param.stability_score : '',
                      rules: [
                        {required: true, message: '请输入资源稳定性得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput2(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>资源覆盖率（10分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_attend_score",
                    {
                      initialValue:param.attend_score !== undefined ? param.attend_score : '',
                      rules: [
                        {required: true, message: '请输入资源覆盖率得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput1(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>交付及时率（25分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_delivery_score",
                    {
                      initialValue:param.delivery_score !== undefined ? param.delivery_score : '',
                      rules: [
                        {required: true, message: '请输入交付及时率得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput3(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>交付质量（25分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_quality_score",
                    {
                      initialValue:param.quality_score !== undefined ? param.quality_score : '',
                      rules: [
                        {required: true, message: '请输入交付质量得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput3(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span = {2}></Col>
            <Col span = {16}>管理规范性（10分）</Col>
            <Col span = {6}>
              <FormItem >
                {
                  getFieldDecorator(
                    "arg_manage_score",
                    {
                      initialValue:param.manage_score !== undefined ? param.manage_score : '',
                      rules: [
                        {required: true, message: '请输入管理规范性得分'}
                      ]
                    }
                  )(
                    <Input onChange = {(e)=>this.judgeInput1(e)}></Input>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          </div>
        }
        </div>
      </Form>
    )
  }
}
const  WorkloadServiceModal =Form.create()(WorkloadAndServiceModal);
export default WorkloadServiceModal;
