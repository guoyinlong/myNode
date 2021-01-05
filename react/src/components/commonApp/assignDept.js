/**
 * 作者：陈红华
 * 日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：指派部门组件
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {Button, Icon, message, Checkbox , Row, Col} from 'antd';
import request from '../../utils/request';
import  './assignDept.css';

class AssignDept extends React.Component {
  state={
    ouDeptList:[]
  }
  // 获取选中的值
  getData=(flag)=>{
    const {ouDeptList}=this.state;
    //console.log(JSON.stringify(ouDeptList))
    var deptCheckedData=[];
    if(ouDeptList.all.checkedFlag==true && !flag){
      let allIdName={
        dept_id:ouDeptList.all.dept_id,
        dept_name:ouDeptList.all.dept_name,
        dept_name_p:ouDeptList.all.deptname_p
      }
      deptCheckedData.push(allIdName)
    }else{
      for(var i=0;i<ouDeptList.all.child.length;i++){
        if(ouDeptList.all.child[i].checkedFlag==true && !flag){
          let OuIdName={
            dept_id:ouDeptList.all.child[i].dept_id,
            dept_name:ouDeptList.all.child[i].dept_name,
            dept_name_p:ouDeptList.all.child[i].deptname_p
          };
          deptCheckedData.push(OuIdName)
        }else{
          for(var r=0;r<ouDeptList.all.child[i].child.length;r++){
            if(ouDeptList.all.child[i].child[r].checkedFlag==true){
              let deptIdName={
                dept_id:ouDeptList.all.child[i].child[r].dept_id,
                dept_name:ouDeptList.all.child[i].child[r].dept_name,
                dept_name_p:ouDeptList.all.child[i].deptname_p
              };
              deptCheckedData.push(deptIdName)
            }
          }
        }
      }
    }
    return deptCheckedData;
  }
  // 模态框checkbox
  onCheckChange(e){
    const{ouDeptList}=this.state;
    // 点击全部
    if(e.target.index=='all'){
      ouDeptList.all.checkedFlag=e.target.checked;
      for(var i=0;i<ouDeptList.all.child.length;i++){
        ouDeptList.all.child[i].checkedFlag=e.target.checked;
        for(var r=0;r<ouDeptList.all.child[i].child.length;r++){
          ouDeptList.all.child[i].child[r].checkedFlag=e.target.checked;
        }
      }
    }else{
      var flag=true;
      var flagP=true;
      // 点击部门名称
      if(isNaN(e.target.index)){
        var checkIndex=e.target.index.split('-');
        ouDeptList.all.child[checkIndex[0]].child[checkIndex[1]].checkedFlag=e.target.checked;
        for(let i=0;i<ouDeptList.all.child[checkIndex[0]].child.length;i++){
          if(ouDeptList.all.child[checkIndex[0]].child[i].checkedFlag!=true){
            flag=false;
            break;
          }
        }
        ouDeptList.all.child[checkIndex[0]].checkedFlag=flag;
        for(let r=0;r<ouDeptList.all.child.length;r++){
          if(ouDeptList.all.child[r].checkedFlag!=true){
            flagP=false;
            break;
          }
        }
        ouDeptList.all.checkedFlag=flagP;
      }else{//点击院名
        var flagA=true;
        var checkIndexP=e.target.index;
        ouDeptList.all.child[checkIndexP].checkedFlag=e.target.checked;
        for(let c=0;c<ouDeptList.all.child[checkIndexP].child.length;c++){
          ouDeptList.all.child[checkIndexP].child[c].checkedFlag=e.target.checked;
        }
        for(var r=0;r<ouDeptList.all.child.length;r++){
          if(ouDeptList.all.child[r].checkedFlag!=true){
            flagA=false;
            break;
          }
        }
        ouDeptList.all.checkedFlag=flagA;
      }
    }
    this.setState({
      ouDeptList
    })
  }
  componentDidMount(){
    const {defaultDept}=this.props;
    // 查询部门传值：argtenantid=10010
    let oudata=request('/microservice/userauth/deptquery',{argtenantid:10010});
    oudata.then((data)=>{
      var ouDeptList={};
       if(defaultDept&&defaultDept.length>0){
         for(let d=0;d<defaultDept.length;d++){
           //  获取全部
          for(let i =0;i<data.DataRows.length;i++){
            data.DataRows[i].checkedFlag=false;
            if(data.DataRows[i].dept_name=='联通软件研究院'){
              ouDeptList['all']=data.DataRows[i]
              ouDeptList['all'].child=[];
            }
            for(let dd=0;dd<defaultDept.length;dd++){
              if(defaultDept[dd]==data.DataRows[i].dept_id){
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
         if(data.DataRows[r].dept_pid==ouDeptList['all'].dept_id){
        //  if(data.DataRows[r].deptname_p==ouDeptList['all'].dept_name){
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
             var p_dept=(data.DataRows[t].deptname_p).split('-')[1];
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
        ouDeptList:ouDeptList
      })
    })
  }

  render(){
    const{flag}=this.props;
    const{ouDeptList}=this.state;
    //console.log(ouDeptList);
    var CheckboxGroupData=[];
    if(ouDeptList['all'] && !flag){
      CheckboxGroupData.push(
        <div key={ouDeptList['all'].dept_id}>
           <Row>
             <Col span={24}>
               <Checkbox onChange={(e)=>this.onCheckChange(e)} index='all'
                checked={ouDeptList['all'].checkedFlag}>全部</Checkbox >
             </Col>
          </Row>
        </div>
      )
    }
    return(
      <div>
        {CheckboxGroupData}
        <Row>
          {ouDeptList['all']?ouDeptList['all'].child.map((cItem,cIndex)=>
                <Col xs={8} sm={8} md={8} lg={8} xl={8} key={cItem.dept_id}>
                   {(!flag)?<div><Checkbox onChange={(e)=>this.onCheckChange(e)} index={cIndex} checked={cItem.checkedFlag}>
                    {cItem.dept_name}
                   </Checkbox ></div>:<div><span>{cItem.dept_name}</span></div>}
                   {cItem.child.map((CCItem,CCIndex)=>
                     <div><Checkbox style={{paddingLeft:'15px'}} key={CCItem.dept_id} onChange={(e)=>this.onCheckChange(e)} index={cIndex+'-'+CCIndex} checked={CCItem.checkedFlag}>
                       {CCItem.dept_name.split('-')[1]}
                     </Checkbox></div>)}
                 </Col>
              ):null
          }
        </Row>
      </div>
    )
  }
}
AssignDept.propTypes={
}

export default AssignDept;
