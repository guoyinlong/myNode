/**
 * 作者：贾茹
 * 日期：2019-9-3
 * 邮箱：m18311475903@163.com
 * 功能：印章申请填报申请部门查询
 */

import { Radio , Row, Col,Spin, Checkbox} from 'antd';
const RadioGroup = Radio.Group;
import request from '../../../utils/request';
import {connect} from "dva/index";

//选择部门组合
class DeptRadioGroup extends React.Component {
  state={
    ouDeptList:[],
    value:this.props.defaultDept?this.props.defaultDept.dept_id:null,
    dept_id:this.props.defaultDept?this.props.defaultDept.dept_id:null,
    dept_name:this.props.defaultDept?this.props.defaultDept.dept_name:null,
    deptname_p:this.props.defaultDept?this.props.defaultDept.deptname_p:null,
    isSpin:false
  };
  // 获取选中的值
  getData=()=>{
    const {dept_id,dept_name,deptname_p}=this.state;
    return {dept_id,dept_name,deptname_p} ;
  };
  // 单选按钮改变时
  onChange = (e,CCItem) => {
    console.log(e);
    console.log(CCItem);

    this.setState({
      value:e.target.value,
      dept_id: e.target.value,
      dept_name:e.target.deptName,
      /*deptname_p:i.dept_name,*/
    });
    let a = {};
    a.deptName = e.target.deptName;
    a.value = e.target.value;
    a.ouid = CCItem.dept_id;
   this.props.dispatch({
      type:'sealComApply/onDeptChecked',
      value:a
   })
  };


  //加载服务，获取ou，部门的值
  componentDidMount(){
    const {defaultDept}=this.props;
    // 查询部门传值：argtenantid=10010
    let oudata=request('/microservice/userauth/deptquery',{argtenantid:10010});
   /* let dept = request('/microservice/management_of_meetings/meetings_dept_list_saerch');
    console.log(oudata);
    console.log(dept);*/
    oudata.then((data)=>{
      let ouDeptList={};
      if(defaultDept&&defaultDept.length>0){
        for(let d=0;d<defaultDept.length;d++){
          //  获取全部
          for(let i =0;i<data.DataRows.length;i++){
            data.DataRows[i].checkedFlag=false;
            if(data.DataRows[i].dept_name=='联通软件研究院'){
              ouDeptList['all']=data.DataRows[i]
              ouDeptList['all'].child=[];
            }
            for(let d=0;d<defaultDept.length;d++){
              if(defaultDept[d]==data.DataRows[i].dept_id){
                data.DataRows[i].checkedFlag=true;
              }
            }
          }
        }
      }else{
        //  获取全部
        for(let i =0;i<data.DataRows.length;i++){
          data.DataRows[i].checkedFlag=false;
          if(data.DataRows[i].dept_name=='联通软件研究院'){
            ouDeptList['all']=data.DataRows[i]
            ouDeptList['all'].child=[];
          }
        }
      }

      //  获取OU
      for(let r=0;r<data.DataRows.length;r++){
        if(data.DataRows[r].deptname_p==ouDeptList['all'].dept_name){
          if(ouDeptList['all'].checkedFlag==true){
            data.DataRows[r].checkedFlag=true;
          }
          data.DataRows[r].child=[];
          ouDeptList['all'].child.push(data.DataRows[r]);
        }
      }
      //  获取三级部门
      for(let s=0;s<ouDeptList['all'].child.length;s++){
        for(let t=0;t<data.DataRows.length;t++){
          if(data.DataRows[t].deptname_p && (data.DataRows[t].dept_name).split('-').length==2){
            let p_dept=(data.DataRows[t].deptname_p).split('-')[1];
            if(p_dept==ouDeptList['all'].child[s].dept_name){
              if(ouDeptList['all'].child[s].checkedFlag==true){
                data.DataRows[t].checkedFlag=true;
              }
              ouDeptList['all'].child[s].child.push(data.DataRows[t]);
            }
          }
        }
      }
      this.setState({
        ouDeptList:ouDeptList,
        isSpin:false
      })
    })
  };

  render(){
    const{ouDeptList}=this.state;
    const a = this.props.dept.value;
    return(
      <Spin tip="加载中..." spinning={this.state.isSpin}>
        <Row style={{overflow:'scroll'}}>
          {ouDeptList['all']?ouDeptList['all'].child.map((cItem,cIndex)=>
              <Col xs={4} sm={4} md={4} lg={4} xl={4} offset={cIndex === 1 || cIndex === 2?2:0} key={cItem.dept_id}>
                <p>{cItem.dept_name}</p>
                <RadioGroup  onChange={(e)=>this.onChange(e,cItem)} value={a}>
                  {cItem.child.map((CCItem,CCIndex)=>
                    <Radio
                      value={CCItem.dept_id}
                      deptName={CCItem.dept_name}
                      key={CCItem.dept_id}
                      style={{marginTop:'10px'}}
                      defaultChecked={a.indexOf(CCItem.dept_id)!== -1}
                    >
                      {CCItem.dept_name.split('-')[1]}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Radio>

                  )}
                </RadioGroup>
               {/* {cItem.child.map((CCItem,CCIndex)=>
                  <Checkbox
                    value={CCItem.dept_id}
                    deptName={CCItem.dept_name}
                    key={CCItem.dept_id}
                    style={{width:'200px',marginTop:'15px'}}
                    onChange={(e)=>this.onChange(e,cItem)}
                    disabled={this.props.outDeptId.some(i=>i ===CCItem.dept_id )}
                    onDeselect={(e)=>this.cancelChange(e,cItem)}
                  >
                    {CCItem.dept_name.split('-')[1]}
                  </Checkbox>
                )}*/}
              </Col>
            )
            :null}
        </Row>
      </Spin>
    )
  }
}
/*DeptRadioGroup.propTypes={
}*/
function mapStateToProps (state) {

  return {
    loading: state.loading.models.sealComApply,
    ...state.sealComApply
  };
}
export default connect(mapStateToProps)(DeptRadioGroup);
/*export default DeptRadioGroup;*/
