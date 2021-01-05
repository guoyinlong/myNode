/**
 * 作者：卢美娟
 * 日期：2018/04/26
 * 邮件：lumj14@chinaunicom.cn
 * 文件说明：选择部门
 */
import React from 'react'
import { TreeSelect } from 'antd';
import {  Row, Col} from 'antd';
const TreeNode = TreeSelect.TreeNode;

export default class EmpList extends React.Component {

  constructor(props){
    super(props)
    this.state={
      tsOpen: false,
      // value:props.defaultValue,
      value:'',
      showflag: 0,
    }
  }

  onChange = (value, selectedOptions) => {
    // alert(JSON.stringify(selectedOptions))
    // let option = {
    //   "ou":selectedOptions[0].label,
    //   "deptid":selectedOptions[1].deptid,
    //   "deptname":selectedOptions[1].label,
    //   "userid":selectedOptions[2].value,
    //   "username":selectedOptions[2].label
    // };
    // this.props.onChange(option, selectedOptions)
  }
  search={
    render:(inputValue, path)=>{
      return (
        <Row>
          {path.map((i,index)=><Col style={{paddingBottom:'10px'}} xs={24-index} offset={index*2}>
            {i.label.split('').map(k=>{
              return <span style={{color:inputValue.match(k)?'red':null}}>{k}</span>
            })}
            </Col>)}
        </Row>
      )
    }
  }
  displayRender=(label, selectedOptions)=>{
    return label[label.length-1]
  }
  onChangeChildren=(value, label, extra)=>{
    if(!value&&!label.length){
      this.props.onChange({username:'',userid:''})
      this.setState({
        value,
        tsOpen:false,
        showflag: 1,
      })
      window.locDeptValue = value;
    }
    if(extra.triggerNode&&extra.triggerNode.props.isLeaf){
      this.setState({
        value,
        tsOpen:false,
        showflag: 1,
      })
      this.props.onChange({username:label[0],userid:value})
      window.locDeptValue = value;
    }else{
      this.setState({
        tsOpen:true,
        showflag: 1,
      })
    }

  }
  componentWillReceiveProps(nextProps){
    if(this.props.initialData !== nextProps.initialData){
      // alert('嫦娥')
      this.setState({
        tsOpen:false,
        showflag:0,
      })
    }
  }

  componentWillUnmount(){
    this.setState({
      showflag:0,
    })
  }

  componentDidMount(){
    this.setState({
      value:'',
    })
  }
  render() {
    let {list,style}=this.props,resList=[];
    if(list != undefined){
      if(list.length){
        let ous=new Set(),depts=new Set(),deptList=[];
        //按ou排序
        list.sort((a,b)=>a.ousort-b.ousort)
        list.forEach(i=>{
          ous.add(i.ou)
        })
        ous.forEach(i=>{
          //resList.push({ou:i,children:[]})
          resList.push({value:i,label:i,children:[],ou:i,})
        })
        //按dept排序
        list.sort((a,b)=>a.deptsort-b.deptsort)
        list.forEach(i=>{
          depts.add(i.deptid)
        })
        depts.forEach(i=>{
          let deptname='',ou='';
          list.forEach(k=>{
            if(i===k.deptid){
              deptname=k.deptname.split('-')[1]
              ou=k.ou
            }
          })
          //deptList.push({deptid:i,deptname,ou,children:[]})
          deptList.push({value:i,label:deptname,ou,children:[],deptid:i})
        })

        resList.forEach(i=>{
          deptList.forEach(k=>{
            if(i.ou===k.ou){
              i.children.push(k)
            }
          })
        })
        resList.forEach(i=>{
          i.children.forEach(k=>{
            list.forEach(j=>{
              if(k.deptid===j.deptid){
                //k.children.push({username:j.username,userid:j.userid})
                k.children.push({label:j.username,value:j.userid})
              }
            })
          })
        })
      }
    }

    if(this.props.ifdisabled){
      return (
        <div style={{...style,display:'inline-block'}} >
          <TreeSelect
          showSearch
          style={{width:'100%'}}
          dropdownStyle={{minWidth:'250px', maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择"
          //allowClear
          onChange={this.onChangeChildren}
          open={this.state.tsOpen}
          value={this.state.showflag==0?this.props.initialData:this.state.value}

          treeNodeFilterProp='title'
          >
          {resList.map((i,index)=>{
            return (
              <TreeNode value={i.ou} title={i.ou} key={index} >
              {i.children.map(k=>{
                return (
                <TreeNode value={k.value} title={k.label} key={k.value} isLeaf={true}>
                </TreeNode>
                )

              })}
              </TreeNode>
            )

          })}

          </TreeSelect>


        </div>
      );
    }else{
      return (
        <div style={{...style,display:'inline-block'}} >
          <TreeSelect
          disabled
          showSearch
          style={{width:'100%'}}
          dropdownStyle={{minWidth:'250px', maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择"
          //allowClear
          onChange={this.onChangeChildren}
          open={this.state.tsOpen}
          value={this.state.showflag==0?this.props.initialData:this.state.value}

          treeNodeFilterProp='title'
          >
          {resList.map((i,index)=>{
            return (
              <TreeNode value={i.ou} title={i.ou} key={index} >
              {i.children.map(k=>{
                return (
                <TreeNode value={k.value} title={k.label} key={k.value} isLeaf={true}>
                </TreeNode>
                )

              })}
              </TreeNode>
            )

          })}

          </TreeSelect>


        </div>
      );
    }

  }
}
