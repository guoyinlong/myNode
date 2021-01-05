/**
 * 作者：罗玉棋
 * 日期：2019-11-04
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评-结果导入
 */
import React from "react";
import { connect } from "dva";
import tableStyle from "../../../components/common/table.less";
import Style from '../../../components/employer/employer.less';
import resultInfoStyle from './result.less'
import message from '../../../components/commonApp/message'
import { routerRedux } from 'dva/router';
import {
  Table,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Input,
  Form,
  Tooltip,
  Icon,
  Modal
} from "antd";
const {Option} = Select;
class ResultInfo extends React.Component{

   state={
    yearList:[],
    personInfo:{},
    tYear:"",
    staffvalue:"",
    searchLoading:false,
    tableInfo:[],
    visible:false
   }


  componentDidMount=()=>{
    let {data}=this.props;
    let personInfo={};
    data.forEach((item)=>{
      personInfo[item.staff_id]={}
    })
    this.setState({
      personInfo
    })


    //let tYear = new Date().getFullYear()
    // let yearList=[]
    //  for(let i=2019;i<=2020;i++){
    //   yearList.push(i)
    //  }
    // this.setState({
    //   yearList: yearList
    // });
    
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tableInfo:nextProps.data,
      visible:nextProps.disabled
    })
  }


  submit=()=>{
  const{tYear,personInfo}=this.state
   for(let i in personInfo){
     if(Object.keys(personInfo[i]).length==0){
       delete personInfo[i]
     }
   }
  setTimeout(()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.props.dispatch({
          type:"resultInfo/submitInfo",
          tYear,
          personInfo,
          successBack:(res)=>{
          //   res&&this.setState({
          //   personInfo:{}, 
          // })
       this.searchInfo()

          }
        })
      }else{
        message.error("信息不能为空",2," ")
        return
      }
    })

  },500)   
  //console.log(personInfo)
  }
  //评级选择
  levelopt=(value,record)=>{
    let {personInfo}=this.state;
    let calcSum=(Number(record.addorsubtract_score||0)+Number(record.per_score||0)+Number(record.evaluate_sum||0)).toFixed(5);
    personInfo[record.staff_id]=personInfo[record.staff_id]||{};
    personInfo[record.staff_id]['staff_id']=record.staff_id
    personInfo[record.staff_id]['id']=record.id
    personInfo[record.staff_id]['examine_result']=value||null;
    personInfo[record.staff_id]['addorsubtract_score']=personInfo[record.staff_id]['addorsubtract_score']||record.addorsubtract_score||"0"
    personInfo[record.staff_id]['person_sum']=personInfo[record.staff_id]['person_sum']||record.person_sum||calcSum
    this.setState({
      personInfo
    })
    //console.log(personInfo)

  }
  //个人加减分
  numberInfo=(value,key,record)=>{
    let {personInfo}=this.state
    value=value||0;
     let addsore=value>0?Math.floor(parseFloat(value)* 100) / 100 :Math.ceil(parseFloat(value)* 100) / 100 ;
    let sum= Number(addsore)+Number(record.evaluate_sum)+Number(record.per_score)
    if(personInfo[record.staff_id]==undefined){
      personInfo[record.staff_id]={}
    }

    personInfo[record.staff_id]['id']=record.id  
    personInfo[record.staff_id]['staff_id']=record.staff_id
    personInfo[record.staff_id]['addorsubtract_score']=addsore
    personInfo[record.staff_id]['person_sum']=sum.toFixed(5)
    personInfo[record.staff_id]['examine_result']=personInfo[record.staff_id]['examine_result']||record.examine_result||null;
    this.props.form.setFieldsValue({
      [key]:addsore
    })

    // this.props.form.setFieldsValue({
    //   [`${record.staff_id}[person_sum]`]:sum.toFixed(5)
    // })

    this.setState({
      personInfo:{...personInfo}
    })
  //console.log("add",personInfo)

  }

  //年份查询
  selectOpt=(value)=>{
    this.setState({
      tYear:value,
      searchLoading:true,
      staffvalue:undefined,
      visible:false
     })
       
  this.props.dispatch({
   type:"resultInfo/staffInfo",
   tYear:value,
   callback:(res)=>{
    this.props.form.resetFields()
    this.setState({
      personInfo:{},
      searchLoading:res
     })
   }
  })
  }
  //查询
  searchInfo=()=>{
   let {staffvalue,tYear}=this.state
   let {data} =this.props
   let flage=0;
   if(staffvalue){
    data.forEach(item=>{
      if(item.staff_id==staffvalue||item.staff_name==staffvalue){
        this.setState({
          tableInfo:[...[item]]
        })
        flage=1
        return 
      }
     })
     if(flage){
      message.success("查询成功",2," ")
     }else{
      this.setState({
        tableInfo:[]
      })
      message.warning("查询失败 , 暂无此员工 , 请核实员工信息是否正确 !",5," ")
     }
     
   }else{
     this.selectOpt(tYear)
   }
  }

  staffInput=(e)=>{
   this.setState({
    staffvalue:e.target.value.replace(/\s*/g,"")
   })
  }

  clearInfo=()=>{
    this.setState({
      staffvalue:undefined
     })
  }

  submit_state=()=>{
    let {personInfo}=this.state
    for( let i in personInfo){
      if(Object.keys(personInfo[i]).length!=0){
        return true
      }  
   }
  }

  closeModel = () => {
    this.setState({
      visible: false
    });
    this.props.dispatch({
      type:"resultInfo/save",
      payload:{
        disabled:false,
      }
     
    })
  };

  closeEval=()=>{
    this.closeModel()
      this.props.dispatch(
        routerRedux.push({
          pathname: 'humanApp/employer/employerAdmin',
        })
      )

  }

  render(){
    let subtip=this.submit_state()
    let optArr=['A','B','C','D','E']
    const {searchLoading,staffvalue,personInfo,tableInfo,visible,tYear}=this.state;
    const { getFieldDecorator } = this.props.form;
    let{yearList}=this.props
    const columns = [
      {
        title: "序号",
        dataIndex:"key",
        width:"5%"
      },
      {
        title: "年度",
        dataIndex:"year",
        width:"10%"
      },
      {
        title: "员工编号",
        dataIndex:"staff_id",
        width:"10%"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width:"10%"
      },
      {
        title: "部门",
        dataIndex:"dept_name",
        width:"15%"
      },
      {
        title: "个人绩效得分",
        dataIndex:"per_score",
        width:"10%",
        render:(text)=>{
          return text||0
        }
      },
      {
        title: "三度评价",
        dataIndex:"evaluate_sum",
        width:"10%",
        render:(text)=>{
          return text||0
        }
      },
      {
        title: <div>个人加减分
          <Tooltip  title={<div >
          <div>1、个人加减分录入后 , 点击空白处会自动计算总分</div> 
          <div>2、个人加减分若有小数 最多保留2位小数</div> 
          <div>3、个人加减分的变动范围为-100~100</div> 
          </div>} placement="top"><Icon style={{marginLeft:'10px'}} type="question-circle-o"/>
          </Tooltip></div>,
        dataIndex: "addorsubtract_score",
        width:"10%",
        render:(text,record)=>{          
        return <div>
         {
          getFieldDecorator(`${record['staff_id']}[addorsubtract_score]`,{
           // rules: [{ required: true }],
            initialValue:(
             personInfo[record.staff_id]?personInfo[record.staff_id]['addorsubtract_score']||text:
             text||0
          )
          })
          (<InputNumber step={1} min={-100} max={100} style={{minWidth:100}} disabled={this.props.ban}
            onBlur={(e)=>this.numberInfo(e.target.value,`${record['staff_id']}[addorsubtract_score]`,record)} ></InputNumber>)
         }
          </div>
        }
        
      },
      {
        title: "总分",
        dataIndex: "person_sum",
        width:"10%",
        render:(value,record,index)=>{

          let calcSum=(Number(record.addorsubtract_score||0)+Number(record.per_score||0)+Number(record.evaluate_sum||0)).toFixed(5);
              calcSum=Number(calcSum)?calcSum:"0.0"
              
          let stateSum=(personInfo[record.staff_id]||{})['person_sum']
          let initialValue=stateSum||value||calcSum;

        return <div className={resultInfoStyle.input_disable}> 
         {
          getFieldDecorator(`${record['staff_id']}[person_sum]`,{
            //rules: [{ required: true }],
            initialValue:initialValue
            
      })(<Input disabled={true} style={{minWidth:100}}  key={String(initialValue)}>
       </Input>)
         }
        </div> }
      },
      {
        title: "考核结果",
        dataIndex: "examine_result",
        width:"10%",
        render:(text,record)=><div className={resultInfoStyle["table-form-reset"]}>
          <Form.Item>
          {
            getFieldDecorator(`${record["staff_id"]}[examine_result]`,{
              //rules: [{ required: true, message: '信息不能为空!' }],
              initialValue:personInfo[record.staff_id]?personInfo[record.staff_id]['examine_result']||text:text
            })
            ( <Select style={{minWidth:100}} placeholder="请评级" onChange={(value)=>this.levelopt(value,record)} disabled={this.props.ban} >{
              optArr.map(item=>{
               return <Option value={item} key={item}>{item}</Option>
               })
               }
             </Select>)
          }
          </Form.Item>
        </div>
      },
    ];

    return(
     <div  className={Style.wrap}>
         <br />
        <br />
        <Row>
          <Col span={5} style={{ minWidth: 250 }}>
            <label>年度 : &nbsp;</label>
            
            <Select style={{ width: 200 }} value={tYear||yearList[yearList.length-1]} onSelect={this.selectOpt}>
              {this.props.yearList.map(el => {
              return <Option value={el+""} key={el+""} >{el}</Option>;
              })}
            </Select>

          </Col>
          <Col span={5} style={{ minWidth: 250 }}>
          <label>搜索 :  &nbsp;</label>
          <Input style={{ width: 200 }} placeholder="姓名/员工编号" onChange={this.staffInput} value={staffvalue}></Input>
          </Col>
          

          <Button className={resultInfoStyle.btn_select} onClick={this.searchInfo} loading={searchLoading}> 
            查 询
          </Button>
          <Button className={resultInfoStyle.btn_select} onClick={this.clearInfo}>
            清 空
          </Button>

          {!subtip?
          <Button className={resultInfoStyle.btn_select}  disabled={true}>
           保 存 
         </Button>:
          <Button className={resultInfoStyle.btn_select} onClick={this.submit}>
            保 存 
          </Button>
          }
          <Tooltip  title={<div >
           <div>提示 ：保存之后 , 被评人员的考核信息会实时显示到年度考核页面中</div> 
         
            </div>} placement="top"><Icon style={{marginLeft:'10px',fontSize:"17px"}} type="question-circle-o"/></Tooltip>
        </Row>
        <br />
        <br />
    <Table
     className={tableStyle.orderTable}
     columns={columns}
     dataSource={tableInfo}
     loading={this.props.loading}
     scroll={{ x:parseInt(200) }}
     bordered={true}
     size={"small"}
   />
      <Modal
        visible={visible}
        title={
          <span>
            提示 <Icon type="question-circle-o" />
          </span>
        }
        onCancel={this.closeModel}
        maskClosable={false}
        okText="去关闭"
        onOk={this.closeEval}
      >
        中层互评未关闭，暂不能进行录入！请先关闭中层互评后再进行录入。
      </Modal>
   
   </div> 
    )
  }

}

function mapStateToProps(state) {

  return {
    ...state.resultInfo
  };
}
ResultInfo=Form.create()(ResultInfo)
export default connect(mapStateToProps)(ResultInfo);