/**
 *  作者: 邓广晖
 *  创建日期: 2018-02-02
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：实现选择部门的功能,带可选和不可选,需要根据项目id和flag来判断
 */
import { Radio , Row, Col,Spin} from 'antd';
const RadioGroup = Radio.Group;
import request from '../../utils/request';

/**
 * 作者：邓广晖
 * 创建日期：2018-02-02
 * 功能：选择部门组合
 * 属性：组件需要传入
 *      flag = 0,1,2
 *      projId = ''
 */
class LimitDeptRadioGroup extends React.Component {
  state={
    ouDeptList:[],
    value:'',
    dept_id:'',
    dept_name:'',
    deptname_p:'',
    promptFlag:'',      /*提示出现标志，1是出现，前端显示promptValue值；0是不出现提示*/
    promptValue:'',
    isSpin:true
  };
  // 获取选中的值
  getData=()=>{
    const {dept_id,dept_name,deptname_p}=this.state;
    return {dept_id,dept_name,deptname_p} ;
  };

  // 单选按钮改变时
  onChange = (e,i) => {
    this.setState({
      value:e.target.value,
      dept_id: e.target.value,
      dept_name:e.target.deptName,
      deptname_p:i.dept_name,
    });
  };

  //加载服务，获取ou，部门的值
  componentDidMount(){
    let postData = {
      arg_flag:this.props.flag
    };
    /*
    * arg_flag：必传，查询标志
            -- 0 查询所有在用可分配到项目中的部门
            -- 1 查询所有可分配到项目中的部门（停用和启用）
            -- 2 项目启动-TMO修改基本信息的修改页面-修改主责部门弹出框获取部门服务
            注意，每个业务的查询标识都不太一样，需要根据具体的查询标志开发。
      arg_proj_id：非必传，根据arg_flag值确定是否非必传，arg_flag=2的时候必传
    * */
    if(this.props.flag === '2'){
      postData.arg_proj_id = this.props.projId;
    }
    let oudata=request('/microservice/project/project_common_get_allot_department',postData);
    oudata.then((data)=>{
      let ouDeptList={};
      //  获取全部
      for(let i = 0;i < data.DataRows.length; i++){
        data.DataRows[i].checkedFlag=false;
        if(data.DataRows[i].dept_name === '联通软件研究院'){
          ouDeptList['all']=data.DataRows[i];
          ouDeptList['all'].child=[];
        }
      }

      //  获取OU
      for(let r = 0;r < data.DataRows.length; r++){
        if(data.DataRows[r].deptname_p === ouDeptList['all'].dept_name){
          if(ouDeptList['all'].checkedFlag === true){
            data.DataRows[r].checkedFlag=true;
          }
          data.DataRows[r].child=[];
          ouDeptList['all'].child.push(data.DataRows[r]);
        }
      }
      //  获取三级部门
      for(let s = 0;s < ouDeptList['all'].child.length; s++){
        for(let t = 0;t < data.DataRows.length;t++){
          if(data.DataRows[t].deptname_p && (data.DataRows[t].dept_name).split('-').length === 2){
            let p_dept=(data.DataRows[t].deptname_p).split('-')[1];
            if(p_dept === ouDeptList['all'].child[s].dept_name){
              if(ouDeptList['all'].child[s].checkedFlag === true){
                data.DataRows[t].checkedFlag=true;
              }
              ouDeptList['all'].child[s].child.push(data.DataRows[t]);
            }
          }
        }
      }
      this.setState({
        ouDeptList:ouDeptList,
        promptFlag:data.promptFlag,
        promptValue:data.promptValue,
        isSpin:false
      })
    })
  }

  render(){
    const{ouDeptList,promptFlag,promptValue}=this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return(
      <Spin tip="加载中..." spinning={this.state.isSpin}>
        {promptFlag === '1'?
          <div style={{color:'red'}}>
            {promptValue}
          </div>
          :
          null
        }

        <Row>
          {ouDeptList['all']?ouDeptList['all'].child.map((cItem,cIndex)=>
              <Col xs={4} sm={4} md={4} lg={4} xl={4} offset={cIndex === 1 || cIndex === 2?2:0} key={cItem.dept_id}>
                <p>{cItem.dept_name}</p>
                <RadioGroup name="radiogroup" onChange={(e)=>this.onChange(e,cItem)} value={this.state.value}>
                  {cItem.child.map((CCItem,CCIndex)=>
                    <Radio
                      value={CCItem.dept_id}
                      deptName={CCItem.dept_name}
                      key={CCItem.dept_id}
                      style={radioStyle}
                      disabled={CCItem.is_select === '0'}
                    >
                      {CCItem.dept_name.split('-')[1]}
                    </Radio>
                  )}
                </RadioGroup>
              </Col>
            )
            :null}
        </Row>
      </Spin>
    )
  }
}

export default LimitDeptRadioGroup;
