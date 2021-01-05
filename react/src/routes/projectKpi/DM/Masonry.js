/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：两栏分布的瀑布流组件
 */
import React from 'react';
// import ReactDOM from 'react-dom'
import Styles from './masonry.less'
/*
* 瀑布流组件（结合MasonryItem组件使用）
*

* */

export default class Masonry extends React.Component{
  constructor(props){
    super(props);
    
    let newChildren=props.children && props.children.length ? props.children.map((i,index)=>{
      return React.cloneElement(i,{...i.props,done:this.done(index)})
    }):[]
    this.state={
      position:[],//所有单位的位置
      left:{height:0,data:newChildren.filter((i,index)=>index%2===0)},
      right:{height:0,data:newChildren.filter((i,index)=>index%2!==0)},

    }

  }
  hArray=[]
  calcItemPosition(){
    let left={height:0,data:[]},right={height:0,data:[]};
    if(this.props.children && this.props.children.length){
      this.hArray.forEach((i,index)=>{
        if(left.height<=right.height){
          left.data.push(this.props.children[index])
          left.height+=i
        }else{
          right.data.push(this.props.children[index])
          right.height+=i
        }
      })
    }

    this.setState({
      left,
      right
    })
  }
  componentWillReceiveProps(nextProps){
    let newChildren=nextProps.children && nextProps.children.length ? nextProps.children.map((i,index)=>{
      return React.cloneElement(i,{...i.props,done:this.done(index)})
    }):[]
    this.setState({
      position:[],//所有单位的位置
      left:{height:0,data:newChildren.filter((i,index)=>index%2===0)},
      right:{height:0,data:newChildren.filter((i,index)=>index%2!==0)}},
      function () {
        //this.calcItemPosition()
      })


  }
  componentDidMount(){

    //this.calcItemPosition()

  }

  done=(index)=>(height)=>{
    //收集每个单位的高度 并赋值到this.hArray
    this.hArray[index]=height

  }
  render(){
    let {wrapClass}=this.props;
    let {left,right}=this.state;


    return (
      <div className={Styles.masonryWrap+' '+wrapClass} ref={(ref)=>this.wrap=ref} >
        <div className={Styles.leftContainer}>
          {left.data}
        </div>
        <div className={Styles.rightContainer}>
          {right.data}
        </div>
      </div>
    )
  }
}

Masonry.MasonryItem=class MasonryItem extends React.Component{
  // state={
  //   height:0
  // }
  componentDidMount(){
    if(this.props.done){
      this.props.done(this.self.clientHeight);
    }
  }
  // componentWillReceiveProps(){
  //   if(this.props.done){
  //     this.props.done(this.self.clientHeight)
  //   }
  // }
  render(){
    const {style,children}=this.props
    return (
      <div style={{...style}} className={Styles.masonryItem} ref={(ref)=>this.self=ref}>
        {children}
      </div>
    )
  }
}
