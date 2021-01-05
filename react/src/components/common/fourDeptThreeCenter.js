/**
 * 作者：邓广晖
 * 创建日期：2018-02-09
 * 邮箱：denggh6@chinaunicom.cn
 * 功能：四部三中心选择组件
 */
import { Radio,Spin} from 'antd';
const RadioGroup = Radio.Group;
import request from '../../utils/request';

/**
 * 作者：邓广晖
 * 创建日期：2018-02-09
 * 功能：四部三中心选择组件

 */
class FourDeptThreeCenter extends React.Component {
  state={
    ouDeptList:[],
    value:'',
    dept_id:'',
    dept_name:'',
    deptname_p:'',
    isSpin:true
  };

  // 获取选中的值
  getData=()=>{
    const {dept_id,dept_name,deptname_p}=this.state;
    return {dept_id,dept_name,deptname_p} ;
  };

  // 单选按钮改变时
  onChange = (e) => {
    this.setState({
      value:e.target.value,
      dept_id: e.target.value,
      dept_name:e.target.deptName,
      deptname_p:e.target.ou,
    });
  };

  //加载服务，获取ou，部门的值
  componentDidMount(){
    let postData = {
      arg_proj_id:this.props.projId,
      arg_flag:'3'
    };
    let oudata=request('/microservice/project/project_common_get_allot_department',postData);
    oudata.then((data)=>{
      this.setState({
        ouDeptList:data.DataRows,
        isSpin:false
      })
    })
  }

  render(){
    const{ouDeptList}=this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      marginLeft: '20px'
    };
    return(
      <Spin tip="加载中..." spinning={this.state.isSpin}>
        <RadioGroup name="radiogroup" onChange={this.onChange} value={this.state.value}>
          {ouDeptList.map((item,index)=>
            <Radio
              value={item.dept_id}
              key={item.dept_id}
              deptName={item.dept_name}
              ou={item.ou}
              disabled={item.is_select === '0'}
              style={radioStyle}
            >
              {item.dept_name.split('-')[1]}
            </Radio>
          )}
        </RadioGroup>
      </Spin>
    )
  }
}

export default FourDeptThreeCenter;
