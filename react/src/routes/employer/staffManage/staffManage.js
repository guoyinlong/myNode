/**
 * 文件说明：职业素养评价管理
 * 作者：罗玉棋
 * 邮箱：809590923@qq.com
 * 创建日期：2019-11-07
 */
import { connect } from 'dva';
import {Button,Switch,Tag,Icon,Input,InputNumber,Slider, Row, Col,Progress,Select,Popconfirm,Modal,Table} from 'antd'
import message from '../../../components/commonApp/message'
import styles from "../../encouragement/personalInfo/personal.less"
import Style from '../../../components/employer/employer.less';
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;
class StaffManage extends React.Component {
  state = {
      tags: [],
      inputVisible: false,
      inputValue: '',
      colorArr:["red","orange","green","blue","purple"],
      //colorArr:["#faf2d1","rgb(223, 234, 244)"],
      yearList:[],
      staffEnd:false,
      staffBegin:false,
      tYear:""+new Date().getFullYear(),
      visible:false,
      deleteTag:false,
      soreValue:{},
      description:{},
      items:[],
      currentClickTag:"",
      tagInputVisible:false,
      checkFlage:0,
  };

  componentDidMount=()=>{
    this.props.dispatch({
      type:"save",
      payload:{
        dataList:[],
        tableInfo:[],
        dataInfo:{},
        state:0
      }
    })
    this.props.dispatch({ type:"search"})
    const {state}=this.props
    if (state=="1"||state=="2"){
      this.setState({
        staffBegin: true,
      });
    }
    if(state=="2"){
      this.setState({
        staffEnd: true,
      });
    }
    let tYear = new Date().getFullYear()
    let yearList=[]
     for(let i=2016;i<=tYear;i++){
      yearList.push(i)
     }
    this.setState({
      yearList: yearList
    });
    }
  
  componentWillReceiveProps(nextProps){
    const {state,dataInfo}=nextProps;
    let { tags,soreValue,description}=this.state;
    if (state=="1"||state=="2"){
      this.setState({
        staffBegin: true,
        dataInfo:dataInfo
      });
    }else{
      this.setState({
        staffBegin: false,
      });
    }
    if(state=="2"){
      this.setState({
        staffEnd: true,
      });
    }else{
      this.setState({
        staffEnd: false,
      });  
    }


    if(JSON.stringify(this.props.dataList)!==JSON.stringify(nextProps.dataList)){
        tags=[];soreValue={};description={}
        nextProps.dataList.forEach(item=>{
          tags.push(item.items_name)
          soreValue[item.items_name]=item.items_scores
          description[item.items_name]=item.items_comment
        });
        this.setState({
          tags,soreValue,description
        })

    }

  }


  handleClose =(removedTag)=> {
    this.setState({
      checkFlage:0
    })
    let inputValue=this.state.inputValue;
    removedTag=removedTag.replace(/\s*/g,"")
      confirm({
        title:"提示",
        content: <div>是否删除<b>“{removedTag=="empty"?inputValue:removedTag}”</b>评价项？</div>,
        onOk:()=>{
          let {soreValue,description}=this.state;
          //console.log("onOk",this.state.tags)
          if(removedTag=="empty"){
            this.setState({
              inputVisible:false
            })

            removedTag=inputValue;
            // if(this.state.tags.includes(inputValue)){
            //   return;
            // }else{
            //   removedTag=inputValue;
            // }
          }
          const tags = this.state.tags.filter(tag => tag !== removedTag);
          delete soreValue[removedTag];
          delete description[removedTag];
          this.setState({ tags,soreValue,inputValue:"" });
  
        },
        onCancel:()=> {
        },
      });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, ()=>this.input.focus());
  };


  handleInputChange = e => {
    let value=e.target.value.replace(/\s*/g,"")
    console.log(value)
    this.setState({ inputValue: value.length>=10?value.substr(0,10):value,
    checkFlage:0 });
  };

  handleInputConfirm = () => {

      let { inputValue,soreValue,tags } = this.state;
      if(!inputValue){
        this.setState({
          inputVisible:false
        })
        return;
      }
      let reg =/^[\u4e00-\u9fa5a-zA-Z]+$/g;
      if(!reg.test(inputValue)){
        message.error("输入格式不能含有数字和特殊字符",2," ")
        return;
      }
      if(inputValue&&tags.includes(inputValue)){
        message.error("评价项重复",2," ");
        this.setState({inputValue:""})
        this.input.focus();
        return;
      }
      if (inputValue && tags.indexOf(inputValue) === -1) {
        if((inputValue.replace(/\s*/g,"").length)==0){
          message.error("评价项不能为空字符串！",2," ")
          return
        }
        tags = [...tags,inputValue];
        soreValue[inputValue]=0
      }
     
      this.setState({
        tags,
        inputVisible: false,
        //共用的变量置为空，不然下一个标签会有上一次的值
        inputValue: '',
        soreValue
      });

    
  };
/**  lyq   */

soreChange = (tag,value) => {
  this.setState({
    checkFlage:0
  })
  const {soreValue}=this.state;
  soreValue[tag]=value;
  this.setState({
    soreValue
  });
 }

description=(e,tag)=>{
  this.setState({
    checkFlage:0
  })
let {description}=this.state
if(e.target.value.length>100){
  message.error("评价项描述不能超过100字",2," ")
  return;
}
description[tag]=e.target.value
this.setState({
  description
})
}

selectOpt=(value)=>{
this.setState({
  tYear:value
})

this.props.dispatch({
  type:"staffManage/save",
  payload:{
    dataList:[],
    tableInfo:[]
  }
  })

this.props.dispatch({
type:"staffManage/search",
value
})
}

staffEnd=(checked)=>{
  if(this.props.state!="1"){
    message.warning("职业素养评价未开始,结束操作无效！",3," ")
    return
  }
  let {tYear}=this.state
 new Promise((resolve)=>{
  this.props.dispatch({
    type:"staffManage/staffEnd",
    tYear,
    resolve
  })
 }).then(res=>{
  this.setState({
    staffEnd:checked
    })
 })
  }

 confirm=()=>{
  const {tYear,checkFlage}=this.state
  if(this.props.state=="3"&&this.props.dataList.length==0){
    message.warning("请先增加评价项,再开始职业素养评价！",3," ")
    return
  }
  if(checkFlage){
    new Promise((resolve)=>{
      this.props.dispatch({
        type:"staffManage/staffBegin",
        tYear,
        resolve
       })
    }).then(res=>{
  
      this.setState({
        staffBegin:true
      })  
    })
  }else{
    message.warning("请先提交变更的评价项,再开始职业素养评价！",2," ")
  }

}

 cancel=(e)=>{
}

submitData=()=>{
let sumsore=0;
let {soreValue,description,items,tYear}=this.state;
for(var sore in soreValue){
  if(soreValue[sore]!=undefined&&soreValue[sore]%5!=0){
    message.error("输入的分值必须为5的整数倍!",2," ")
    this.setState({
      checkFlage:0
     })
    return
  }
  if(soreValue[sore]!=0){
    sumsore=sumsore+soreValue[sore]
  }else{
    message.error("评价项分值不能为0",3," ")
    this.setState({
      checkFlage:0
     })
    return
  } 
}

   
  if(sumsore==100){
  for(var sindex in soreValue){
    if(description[sindex]==undefined||(description[sindex].replace(/\s*/g,"").length)==0){
      message.error("评价项描述不能为空",3," ");
      this.setState({
        checkFlage:0
       })
      return
    }
      }

  }else{
    message.error("评价项各项分值加起来不为100分,请核对信息!",3," ")
    this.setState({
      checkFlage:0
     })
     return
  }

  //对提交数据的处理
  for(var sub in soreValue){
    let obj={
      "items_name":sub,
      "items_comment":description[sub],
      "items_scores":soreValue[sub]
    }
    items.push(obj)
      }
   this.setState({
    items,
    checkFlage:1,
   })
    
   this.props.dispatch({
   type:"staffManage/sumbmitData",
   tYear,
   items,
   callback:(res)=>{
     if(res){
      this.setState({
    //     soreValue:{},
    //     description:{},
    //     tags: [],
        items:[],
       })
     }
   
   }
   })

    //console.log("items",items) 
     return 1 

}

saveInputRef = input => (this.input = input);

InputNumberBlur=(tag)=>{
  this.setState({
    checkFlage:0
  })
  let value;
  const {soreValue}=this.state;
  if(soreValue[tag]==undefined){
    soreValue[tag]=0;
    this.setState({
      soreValue
    })
  }else{
   value=soreValue[tag]
   value%5!=0&&value!=undefined&& message.error("输入的分值必须为5的整数倍!",2," ")
  }
  
}

serachInfo=()=>{
this.setState({
  visible:true
})
}

handleOk = e => {
  this.setState({
    visible: false,
  });
};

handleCancel = e => {
  this.setState({
    visible: false,
  });
};

handleTagClick=(tag)=>{
  const {staffBegin}=this.state;
  if(staffBegin) return;
  this.setState({
    currentClickTag:tag,
    tagInputVisible:true,
    deleteTag:true
  },
  )

}

handleEditTag=(e)=>{
  this.setState({
    checkFlage:0
  })
  let {tags,currentClickTag,soreValue,description}=this.state;
  //如果为空，删除该tag
  if(!e.target.value){
    delete soreValue[currentClickTag];
    tags=tags.filter((item)=>item!==currentClickTag);
    this.setState({
      tags,
      currentClickTag:"",
      tagInputVisible:false, 
      deleteTag:false,
      soreValue
    })
    return;
  }
  //不为空则继续校验s
  let value=e.target.value.replace(/\s*/g,"").replace(/\\/g,"")
  let reg =/^[\u4e00-\u9fa5a-zA-Z]+$/g;

  if(value.length>10){
    message.error("评价项名不能超过10字",2," ")
    return;
  }

  if(!reg.test(value)){
    message.error("输入格式不能含有数字和特殊字符",2," ")
    return;
  }
    if(currentClickTag!=value){
    
      if(value&&tags.includes(value)){
        message.error("评价项已存在",2," ")
        return;
      }
      if(value){
        let index=tags.findIndex((item)=>item==currentClickTag);
        tags[index]=value
        soreValue[value]=0
        delete soreValue[currentClickTag]
        delete description[currentClickTag]
      }
    }
    this.setState({
    tags,
    currentClickTag:"",
    tagInputVisible:false, 
    deleteTag:false,
    soreValue,
    inputValue:""
     })
}


  render() {
    const { tags, inputVisible, colorArr,soreValue,staffBegin,yearList,staffEnd,tYear,description,currentClickTag,tagInputVisible,deleteTag} = this.state;
    let {tableInfo,dataInfo={}}=this.props
    let progress=parseFloat(parseInt(dataInfo.OkCount)/parseInt(dataInfo.RowCount))*100
    const table_columns = [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width:"10%",
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width:"10%"
      }
    ]
   

    return (
      <div className={Style.wrap}>
        <br></br>    
        <h2 style={{textAlign:"center",marginBottom:50}}><b>职业素养评价项及分值设置</b>&nbsp;&nbsp;&nbsp;&nbsp;</h2> 
         <Row>
         <Col span={12}>
         <Row style={{fontSize:16}}>
          <p style={{fontSize:17,marginBottom:15}}><b>评价项设置说明&nbsp; :</b></p> 
          <p style={{marginBottom:10}}>1、所有评价项的分值加起来总分为100分，&nbsp;如: 4个评价项( 20+15+40+25=100).</p>
          <p style={{marginBottom:10}}>2、每个评价项的分值不能为0，每个评价项的分值自增量为5分.</p>
          <p style={{marginBottom:10}}>3、评价项的名字不能为标点符号和数字，长度不能超过10个字，评价项名填写好后点击空白处会自动校验.</p>
          <p style={{marginBottom:10}}>4、每个评价项的描述不能为空，长度不能超过100个字.</p>
         </Row>
      
         <Row style={{overflow:"scroll",height:"400px",marginTop:"5%",paddingRight:"30%",minWidth:"450px"}} key={"lyq"}>
        {tags.map((tag, index) => {
          const tagElem = (
            <div style={{marginBottom:15,border:"1px solid rgb(210, 207, 205)",padding:10,minWidth:200,boxShadow: "2px 3px 3px #c8c8c8",borderRadius:10}} key={tag+""}>
              <span style={{color:"rgb(121, 119, 119)"}}>评价项名 ：</span>
              {tagInputVisible&&currentClickTag==tag&&
              <Input defaultValue={tag} style={{ minWidth: 78,maxWidth:120 }} 
              onBlur={this.handleEditTag} onPressEnter={this.handleEditTag}
              autoFocus>
                </Input>}
              {
                currentClickTag!==tag&&<Tag closable={false} color={colorArr[index%5]} style={{fontSize:16,minWidth:"100px",minHeight:"30px",lineHeight:"30px",textAlign:"center"}}  onClick={()=>this.handleTagClick(tag)}>
                  {tag}
                </Tag>
              }
            {tagInputVisible&&currentClickTag==tag?
            ""
            :
            <Icon type="check-circle"  style={{color:"rgb(53, 207, 14)",fontSize:15,marginLeft:8}}/>}
            {(currentClickTag==tag?deleteTag:false)||staffBegin?
            <Icon style={{float:"right",fontSize:20,color:"gray"}} type="close"/>
            :
            <Icon style={{float:"right",fontSize:20,color:"#f80909"}} type="close" onClick={() =>this.handleClose(tag)}/>
            }
          
            <Row style={{borderTop: "1px solid #cdc5c5",marginTop:"10px",padding:"10px"}}>
            <Col span={11} className={styles.disable_color}>
              <Slider
                min={0}
                max={100}
                onChange={(value)=>this.soreChange(tag,value)}
                step={5}
                disabled={staffBegin}
                value={soreValue[tag]?Number(soreValue[tag]):0}
              />
            </Col>
            <Col span={1} className={styles.disable_color}>
              <InputNumber
                min={0}
                max={100}
                style={{ marginLeft: 16 }}
                value={soreValue[tag]||0}
                step={5}
                onBlur={()=>this.InputNumberBlur(tag)}
                disabled={staffBegin}
                onChange={(value)=>{
                  this.soreChange(tag,value)
                }}
              />
            </Col>
          </Row>
          <Row>
          <Col span={18} className={styles.disable_color}>
          <TextArea onChange={(e)=>this.description(e,tag)} placeholder="请填写该评价项的描述"
           value={description[tag]} style={{resize:"none",minHeight:70}} disabled={staffBegin} />
           </Col>
           </Row>
            </div>
          );
          return tagElem
        })}

        {/* 新增框 */}
        {inputVisible && (
             <div style={{marginBottom:15,border:"1px solid rgb(210, 207, 205)",padding:10,minWidth:200,boxShadow: "2px 3px 3px #c8c8c8",borderRadius:10}} >
               <span style={{color:"rgb(121, 119, 119)"}}>评价项名 ：</span>
             <Input
                ref={this.saveInputRef}
                value={this.state.inputValue}
                type="text"
                size="default"
                style={{ width: 78 }}
                disabled={false}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
                <Icon style={{float:"right",fontSize:20,color:"gray"}} type="close-circle-o" />
             <Row style={{borderTop: "1px solid #cdc5c5",marginTop:"10px",padding:"10px"}}>
             <Col span={11}>
               <Slider
                 min={0}
                 max={100}
                 step={5}
                 disabled={true}
               />
             </Col>
             <Col span={1}>
               <InputNumber
                 min={0}
                 max={100}
                 style={{ marginLeft: 16 }}
                 step={5}
                 disabled={true}
               />
             </Col>
           </Row>
           <Row>
           <Col span={18}>
           <TextArea placeholder="请填写该评价项的描述"
            style={{resize:"none",minHeight:70}} disabled={true} />
            </Col>
            </Row>
             </div>
          

        )}
        {!inputVisible&&!staffBegin&&(
          <Tag disabled={staffBegin} onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' ,fontSize:16}}>
            <Icon type="plus" /> 增加评价项
          </Tag>
        )}
        </Row>
        {tags.length!=0 &&
        ( <Row style={{textAlign:"center",marginTop:10}}>
        <Button
       className={styles.btn_type} disabled={staffBegin||inputVisible||tagInputVisible} 
       onClick={this.submitData}>
       提交
       </Button>
       </Row>)
      }
      </Col>
      
      <Col span={3}></Col>
      <Col span={9}>
     
      <Row style={{marginTop:"15%"}}>
        年度：<Select style={{width:150,marginBottom:50}} defaultValue={tYear} onChange={this.selectOpt}  dropdownStyle={{height:150,overflow:"auto"}}>
        {yearList.map(el => {
        return <Option value={el+""} key={el+""} >{el}</Option>;
      })}
        </Select>
        </Row>
      <Row>
        已参评人数 : {dataInfo.OkCount||"0"} 人 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应参评人数 : {dataInfo.RowCount||"0"} 人
      </Row>
      <br></br>
      <br></br>
      <br></br>
      <Row className={styles.progress_color}> 
       已参评占比 : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Progress type="circle" status="normal" 
        percent={parseInt(parseInt(dataInfo.RowCount))?Number(progress.toFixed(2)):0} />
        </Row>
      <br></br>
      <br></br>
      <br></br>
      <Row className={styles.switch_color}>
      评价开始&nbsp;:&nbsp;&nbsp;
        {staffBegin?
      <Switch  checkedChildren="开" unCheckedChildren="关"  disabled={staffBegin} checked={staffBegin}/>
        :
          <Popconfirm
          title="职业素养评价开启后各评价项不可修改,是否开启？"
          onConfirm={this.confirm}
          onCancel={this.cancel}
          okText="确定"
          cancelText="取消"
          >
          <span>
          <Switch  checkedChildren="开" unCheckedChildren="关"  disabled={staffBegin} checked={staffBegin}/>  
          </span>   
        </Popconfirm>
    
        }
       
        &nbsp;&nbsp;&nbsp;&nbsp;
        评价结束/M值计算&nbsp;:&nbsp;&nbsp;
        {staffEnd?
        <Switch  checkedChildren="开" unCheckedChildren="关"  disabled={staffEnd} checked={staffEnd}  key={"123"}/>
        :
        <Popconfirm
        title="是否结束职业素养评价？"
        onConfirm={this.staffEnd}
        onCancel={this.cancel}
        okText="确定"
        cancelText="取消"
        >
        <span>
        <Switch  checkedChildren="开" unCheckedChildren="关"  disabled={staffEnd} checked={staffEnd} key={"456"}/>  
        </span>   
       </Popconfirm>
        }
       
       </Row>
       {tableInfo.length!=0&&(
        <Row style={{marginTop:25}} className={styles.tipContent}>
        <div style={{fontSize:18,marginBottom:10}}> 温馨提示 ：</div>
        <div>有员工因为没有主责项目只有参与配合的项目无法确定是否参与互评。</div>
        <div>点击请查看详情>>>><Button  className={styles.btn_type} onClick={this.serachInfo}>详情</Button></div>
      </Row>)
       }
   
      </Col>
      </Row>
      <Modal
        visible={this.state.visible}
        title={
          <span>
            详情  <Icon type="question-circle-o" />
          </span>
        }
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
       <Table
        columns={table_columns}
        dataSource={tableInfo}
        bordered
        scroll={{ y: 200 }}
       />

      </Modal>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  ...state.staffManage,
  dataList:[...state.staffManage.dataList]
  };
}
export default connect(mapStateToProps)(StaffManage)
