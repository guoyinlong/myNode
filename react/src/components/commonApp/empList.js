/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：根据ou dept选择审核人组件
 */
import React from 'react'
import { TreeSelect } from 'antd';
import {  Row, Col} from 'antd';
const TreeNode = TreeSelect.TreeNode;
// require('../../style/index.css');
//
// require('./index.css');
//
// require('../..);
//
// require('../../checkbox/style/css');
// import TreeSelect, { TreeNode, SHOW_PARENT } from 'rc-tree-select';


import styles from './empList.less'
//ou,ousort,deptid,deptname,deptsort,userid,username
/*
* 根据ou dept选择审核人组件
* props:
*   list(Array):服务器返回的候选人结果
*   defaultValue[String]:默认候选人的userid
*   onChange(function(value)):选择结束的回调 传入选中的人的username和userid
*   style(object):附件样式
*
* */
export default class EmpList extends React.Component {

  constructor(props){
    super(props)
    this.state={
      tsOpen: false,
      value:props.defaultValue
    }

  }


  onChange = (value, selectedOptions) => {
    //alert(JSON.stringify(selectedOptions))
    let option = {
      "ou":selectedOptions[0].label,
      "deptid":selectedOptions[1].deptid,
      "deptname":selectedOptions[1].label,
      "userid":selectedOptions[2].value,
      "username":selectedOptions[2].label
    };
    this.props.onChange(option, selectedOptions)

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
        tsOpen:false
      })
    }
    if(extra.triggerNode&&extra.triggerNode.props.isLeaf){
      this.setState({
        value,
        tsOpen:false
      })
      this.props.onChange({username:label[0],userid:value})

    }else{
      this.setState({
        tsOpen:true
      })
    }

  }
  componentWillReceiveProps(nextProps){
    this.setState({
      tsOpen:false,
      value:nextProps.defaultValue
    })
  }
  render() {
    let {list,style}=this.props,resList=[];
    // console.log(this.state.tsOpen)
    // if(defaultValue){
    //   debugger
    //   list.forEach(i=>{
    //     if(i.userid===defaultValue[0]){
    //
    //       defaultValue=[i.ou,i.deptid,i.userid]
    //     }
    //   })
    // }
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
    //console.log(resList)
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
        value={this.state.value}
        treeNodeFilterProp='title'
        >
        {resList.map((i,index)=>{
          return (
            <TreeNode value={i.ou} title={i.ou} key={index} >
            {i.children.map(k=>{
              return (
              <TreeNode value={k.value} title={k.label} key={k.value}>
                {k.children.map(j=>{
                  return (
                    <TreeNode value={j.value} title={j.label} key={j.value} isLeaf={true} />
                  )
                })}
              </TreeNode>
              )

            })}
            </TreeNode>
          )

        })}



        </TreeSelect>


        {/*<TreeSelect*/}
          {/*style={{ width: 300 }}*/}
          {/*// transitionName="rc-tree-select-dropdown-slide-up"*/}
          {/*// choiceTransitionName="rc-tree-select-selection__choice-zoom"*/}
          {/*dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}*/}
          {/*placeholder={<i>请下拉选择</i>}*/}
          {/*treeData={this.state.simpleTreeData}*/}
          {/*treeNodeFilterProp="label"*/}
          {/*prefixCls='ant-select'*/}
          {/*transitionName='slide-up'*/}
          {/*choiceTransitionName='zoom'*/}
          {/*dropdownClassName='ant-select-tree-dropdown'*/}
          {/*open={this.state.tsOpen}*/}
          {/*onChange={this.onChangeChildren}*/}
        {/*/>*/}
        {/*<Cascader defaultValue={defaultValue} onChange={this.onChange} popupClassName={styles.opt} options={resList} notFoundContent='无匹配结果！'  placeholder="请选择" showSearch={this.search}  displayRender={this.displayRender}/>*/}
      </div>
    );
  }
}



