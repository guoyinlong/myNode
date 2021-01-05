/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本费用科目维护修改新建表单组件
 */
import { Input,Row, Col,Select} from 'antd';
const Option = Select.Option;
import request from '../../utils/request';

export default class Forms extends React.Component {
  state = {
    upFeeName:[],
    formData:this.props.defaultData?{...this.props.defaultData}:{state:'0'},
  }
  // 输入框改变后调用
  InputChange=(e,key)=>{
    var {formData}=this.state;
    formData[key]=e.target.value;
    this.setState({
      formData
    })
  }
  // 选择OU以后
  OUhandleChange=(value)=>{
    var {formData}=this.state;
    formData.ou=value;
    // 查询上级费用项
    var postData={
      transjsonarray:JSON.stringify({
        property:{id:'id',fee_name:'fee_name'},
        condition:{fee_level:'1',state:'0','ou':value}
      })
    }
    let oudata=request('/microservice/standardquery/cos/queryfeenamebat',postData);
    oudata.then((data)=>{
      this.setState({
        upFeeName:data.DataRows,
        formData
      })
    })
  }
  // 除OU外的select改变后执行
  selectHandleChange=(value,key)=>{
    var {formData}=this.state;
    if(key=='fee_level'&&value=='1'){
      formData.up_fee_code="";
      formData.up_fee_name="";
    }
    formData[key]=value;
    this.setState({
      formData
    });
  }
  // 获取所有表单的value
  getData=()=>{
    const {formData,upFeeName}=this.state;
    if(formData.fee_level=='1'){
      formData.up_fee_name="";
      formData.up_fee_code='';
    }else{
      if(formData.up_fee_code){
        for(var i=0;i<upFeeName.length;i++){
          if(upFeeName[i].id==formData.up_fee_code){
            formData.up_fee_name=upFeeName[i].fee_name;
            break;
          }
        }
      }
    }
    return formData;
  }
  componentDidMount(){
    if(this.props.defaultData){
      this.OUhandleChange(this.props.defaultData.ou)
    }
  }
  render() {
    const {upFeeName,formData}=this.state;
    const dataStyle={
      type:"flex",
      align:"middle",
      style:{margin:'10px 0'}
    }
    const colStyle1={
      xs:6,sm:6,md:6,lg:6,xl:6,style:{textAlign:'right'}
    }
    const colStyle2={
      xs:16,sm:16,md:16,lg:16,xl:16
    }
    return (
      <div style={{paddingRight:'20px'}}>
        <Row {...dataStyle}>
          <Col {...colStyle1}>费用项编码：</Col>
          <Col {...colStyle2}><Input value={this.state.formData.fee_code} placeholder='50000000000010' onChange={(e)=>this.InputChange(e,'fee_code')}/></Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>费用项名称：</Col>
          <Col {...colStyle2}><Input value={this.state.formData.fee_name} placeholder='费用项名称' onChange={(e)=>this.InputChange(e,'fee_name')}/></Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>OU：</Col>
          <Col {...colStyle2}>
            <Select value={this.state.formData.ou} style={{width:'100%'}} onChange={this.OUhandleChange}>
              {this.props.OUs.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)}
            </Select>
          </Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>费用项等级：</Col>
          <Col {...colStyle2}>
            <Select value={this.state.formData.fee_level} style={{width:'100%'}} onChange={(e)=>this.selectHandleChange(e,'fee_level')}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
            </Select>
          </Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>上级费用项：</Col>
          <Col {...colStyle2}>
            <Select value={this.state.formData.up_fee_code} style={{width:'100%'}} onChange={(e)=>this.selectHandleChange(e,'up_fee_code')}>
              {this.state.formData.up_fee_code?<Option value={formData.up_fee_code}>{formData.up_fee_name}</Option>:null}
              {formData.fee_level=='2'?upFeeName.map((i,index)=><Option key={index} value={i.id}>{i.fee_name}</Option>):null}
            </Select>
          </Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>费用项描述：</Col>
          <Col {...colStyle2}><Input value={this.state.formData.fee_desc} onChange={(e)=>this.InputChange(e,'fee_desc')}/></Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>备注：</Col>
          <Col {...colStyle2}><Input value={this.state.formData.remark2} onChange={(e)=>this.InputChange(e,'remark2')}/></Col>
        </Row>
        <Row {...dataStyle}>
          <Col {...colStyle1}>状态：</Col>
          <Col {...colStyle2}>
            <Select value={this.state.formData.state} style={{width:'100%'}} onChange={(e)=>this.selectHandleChange(e,'state')}>
              <Option value="0">启用</Option>
              <Option value="1">停用</Option>
            </Select>
          </Col>
        </Row>
      </div>
    );
  }
}
