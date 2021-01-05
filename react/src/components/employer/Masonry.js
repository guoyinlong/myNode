/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：瀑布流组件
 */
import React from 'react';
// import ReactDOM from 'react-dom'
import Styles from './masonry.less'
/*
* 瀑布流组件（结合MasonryItem组件使用）
*
* props:
* @param  space(object):{x:,y:}单位之间间隔的横纵间隔;
* @param  colWidth(number):列宽（单位的宽度）;
* @param  col(number):固定列数不根据单位关键计算列数
* @param  wrapClass(string):容器的className
* */

export default class Masonry extends React.Component{
  constructor(props){
    super(props);
    this.hArray=[];//每个单位的高度
    this.colArray=[];//已布局的列高度
    //this.isResize=false;//是否重新计算并设置单位的位置
    this.resizeTime=0.2;//从新计算的时间间隔
    this.state={
      position:[]//所有单位的位置
    }

  }

  resize=()=>{
    //重新计算限流
    clearTimeout(this.timer)
    this.wrapW=this.wrap.clientWidth
    this.timer=setTimeout(()=>{
      this.calcItemPosition()
      //this.wrapW=this.wrap.clientWidth
    },this.resizeTime*1000)

    //
    // if(this.isResize){
    //   debugger
    //   this.isResize=false
    //   this.calcItemPosition()
    //
    // }


  }
  calcItemPosition(){
    //计算每个单位的位置 并赋值到position 并从新render
    let {colWidth,space,col}=this.props;
    let w=this.wrap.clientWidth;
    let colNum=col||Math.floor(w/(colWidth+space.x));
    if(!colWidth&&col){
      colWidth=w/col
    }
    this.colArray=new Array(colNum).fill(0)
    if(this.hArray.length===this.props.children.length){
      let position=[]

      this.hArray.forEach((i,index)=>{
        let l=index%colNum,h=Math.floor(index/colNum);
        //debugger
        position[index]={left:l*colWidth+(l*space.x)+'px',top:this.colArray[l]+(space.y*h)+'px'}

        this.colArray[l]+=i

      })
      //console.log(position)

      this.setState({
        position
      })
    }
  }
  componentDidMount(){
    //监听浏览器窗口变化从新计算位置
    window.addEventListener('resize',this.resize)
    document.querySelector('#siderbutton').addEventListener('click',(e)=>{
      setTimeout(()=>{this.wrapW=this.wrap.clientWidth;this.calcItemPosition()},0.5*1000)
    })

    this.calcItemPosition()
    this.wrap.id=this.wrap.clientWidth;
    this.wrapW=this.wrap.clientWidth
  }
  componentWillUnmount(){
    //解除监听
    window.removeEventListener('resize',this.resize)
  }
  done=(index)=>(height)=>{
    //收集每个单位的高度 并赋值到this.hArray
    this.hArray[index]=height

  }
  render(){

    let {children,space=15,colWidth,wrapClass,col}=this.props;
    let {position}=this.state
    let height=this.colArray.sort((a,b)=>b-a)[0]+space.y

    if(!colWidth&&col&&this.wrap){
      //let wrapW=this.wrap.clientWidth;
      colWidth=this.wrapW/col
    }
    //debugger
    return (
      <div className={Styles.masonryWrap+' '+wrapClass} ref={(ref)=>this.wrap=ref} style={{height:height+'px'}}>

        {
          children.map((i,index)=>{
            return React.cloneElement(i,{...i.props,style:{...position[index],width:colWidth+'px'},done:this.done(index)})
          })
        }


      </div>
    )
  }
}

Masonry.MasonryItem=class MasonryItem extends React.Component{
  // state={
  //   height:0
  // }
  componentDidMount(){
    //this.self.style.boxSizing='content-box'
    //debugger
    this.props.done(this.self.clientHeight)
    //this.self.style.boxSizing='border-box'
    //this.self.id=this.self.clientHeight
  }
  render(){
    const {style,children}=this.props
    return (
      <div style={{...style}} className={Styles.masonryItem} ref={(ref)=>this.self=ref}>
        {children}
      </div>
    )
  }
}
