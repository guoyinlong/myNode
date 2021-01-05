/**
 *  作者: 罗玉棋
 *  创建日期: 2019-11-04
 *  邮箱：809590923@qq.com
 *  文件说明：员工互评
 */
import React from "react";
import { connect } from "dva";
import staff2 from "../../../assets/Images/employer/staff2.png"
import staff3 from "../../../assets/Images/employer/staff3.png"
import Style from "./staffEvaluation.less";
import {
  Table,
  Radio,
  Form,
  Button,
  Modal,
  Progress,
  Icon,
  Row,
  Col
} from "antd";
let scoreArr;
//import ObjectUtils from './ObjectUtils'
class StaffEvaluation extends React.Component {
  state = {
    visible: false,
    count: 0,
    progress: 0,
    keyList: [],
    radioList: [],
    tip: false,
    tableValue:{},
    lock:true
  };

    
  componentWillReceiveProps(nextProps){
    if(nextProps.dataInfo.RetCode=="1"&&this.state.lock){
    this.setState({
     visible:true,
     lock:false
    })
    }
  }

  ability = (value, id,scoreItem) => {
    const { getFieldDecorator } = this.props.form;
    const arr = (scoreItem||[]).split(",");
    scoreArr=arr.length
    return (
      <div className={Style.divcontent}>
      <div className={Style.radio} >
        {value.split(",").map((item, i) => {
          const {tableValue}=this.state;
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 10
              }}
              key={i+1+""}
            >
              {getFieldDecorator(`${id}[${arr[i]}]`, {
                rules: [{ required: true }],
                initialValue:tableValue[id]?tableValue[id][arr[i]+""]:undefined
              })(
                <Radio.Group
                  onChange={(e) => this.onChange(`${id}[${arr[i]}]`,e.target.value)}
                  key={`${id}[${arr[i]}]`}
                >
                  {Array(Math.ceil(item / 5) + 1)
                    .fill(1)
                    .map((radio, index) => {
                      return <Radio value={index * 5} key={index * 5+""}>{index * 5}分</Radio>;
                    })}
                </Radio.Group>
              )}
            </div>
            
          );
        })}
      </div>
      </div>
    );
  };
  handleSubmit = () => {
    const {tableValue}=this.state;
    //console.log(tableValue)
   this.props.dispatch({
    type:"staffEvaluation/ResultSumbit",
    tYear:this.props.dataInfo.e_year,
    tableValue
   })

  };

  handleCalc = record => {
    let id = record.staff_id;
    let { data, dispatch } = this.props;
    const arr = record.items_name.split(",");
    let sum = 0;
    arr.forEach(item => {
      sum += this.props.form.getFieldValue(`${id}[${item}]`) || 0;
    });
    data.forEach(item => {
      if (item.staff_id == id) {
        item["ranking"] = sum;
      }
    });
    dispatch({
      type: "staffEvaluation/save",
      payload: {
        data
      }
    });
    return sum;
  };

  handleGetRank = record => {
    let values = this.state.tableValue;
    if(!values[record.staff_id]) return ""
    let singleSum = Object.values(values[record.staff_id]).map(item => item || 0).reduce((a, b) => Number(a) + Number(b));
    let sumList = Object.values(values)
      .map((person, index) => {
        return Object.values(person).map(item => item || 0).reduce((a, b) => Number(a) + Number(b));
      }).sort((a, b) => b - a);
    return [...new Set(sumList)].findIndex(item => item == singleSum) + 1;
   
  };

  onChange = (key,value) => {
    const {tableValue}=this.state;
    const {dataInfo}=this.props
    this.props.form.setFieldsValue({
      [key]:value
    })
    const newTableValue=this.props.form.getFieldsValue();
    this.setState({
      tableValue:Object.assign(tableValue,newTableValue)
    })
    // 计数器
    let { count,keyList } = this.state;
    if (keyList.includes(key)) {
      parseInt(count);
    } else {
      keyList.push(key);
      parseInt(count++);
    }
    
   let Q = 100 / (scoreArr * parseInt(dataInfo.RowCount));
   let progress=Math.floor(count * Q)
   if(parseInt(count)==scoreArr * parseInt(dataInfo.RowCount)){
    progress=100 
  }
    this.setState({
      count: count,
      progress: progress,
      keyList: keyList
    });
  };

  openModel = () => {
    this.setState({
      visible: true
    });
  };

  closeModel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const columns = [
      {
        title: "序号",
        dataIndex: "key",
        width:"5%",
      },
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width:"10%",
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width:"10%"
      },
      // {
      //   title: "职务",
      //   dataIndex: "post_name",
      //   width:"10%"
      // },
      {
        title: "评价项",
        dataIndex: "items_name",
        width:"15%",
        render: (value,record,index )=> {
          return (
            <div style={{paddingBottom:5}}>
              {value.split(",").map(item => {
                return <div className={Style.underline} key={item}>{item}</div>;
              })}
            </div>
          );
        }
      },
      {
        title: "评分",
        dataIndex: "items_scores",
        render: (value, record) => {
          return this.ability(value, record.staff_id,record.items_name);
        }
      },
      {
        title: "评价结果",
        dataIndex: "address",
        width:"5%",
        render: (value, record) => this.handleCalc(record)
      },
      {
        title: "排名",
        dataIndex: "ranking",
        width:"5%",
        render: (value, record) => this.handleGetRank(record)
      }
    ];

    let { progress } = this.state;
    let { data ,dataInfo} = this.props;
    //let data=[],dataInfo={"state":1,"name":"中国联通总部项目互评分布项目"}
    let menarry=dataInfo.items_comment?(dataInfo.items_comment).split(","):[]
    let mentions =menarry.map((item, index) => {
      return (
        <p style={{ marginTop: 5 }} key={index+1+""}>
          {index + 1}、{item}
        </p>
      );
    });

    return (
      <div className={Style.wrap}>
      {dataInfo.state==2?
      <div className={Style.bgImage}>
         <h1 style={{ color: "rgb(253, 111, 44)",paddingTop:"6%"	}}>员工职业素养评价已结束，感谢您的来访......</h1>
         <img style={{width:"30%",height:"50%",marginTop:"4%"}} src={staff2}/>
        </div>
      :
      dataInfo.state==0?
      <div className={Style.bg2Image}>
      <h1 style={{ color: "#1E90FF",paddingTop:"6%"}}>员工职业素养评价还未开始......</h1>
      <img style={{width:"27%",height:"60%",marginTop:"2%"}} src={staff3}/>
     </div>
     :
     dataInfo.state==1?
    <div>
    <Row>
    <Col span={16} className={Style.title}><b>{dataInfo.name}</b></Col> 
    <Col span={3}style={{float:"right",color:"#FA7252",fontSize:20,minWidth:67}}><b>{dataInfo.e_year||new Date().getFullYear()}年</b></Col>  
    </Row> 
    <Row>
    <Col span={21} className={Style.progress}><Progress percent={progress} status="active" /></Col> 
    <Col span={3}style={{float:"right"}}>
    <a style={{ float: "right",minWidth:120}} onClick={() => this.openModel()}>
          填表/评价项说明？
        </a>
      </Col>  
    </Row> 
      <br></br>
      <br></br>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{pageSize:3}} 
      />

      <Button onClick={this.handleSubmit} className={Style.btn_type}  disabled={this.state.progress!==100}>
        提交
      </Button>

      <Modal
        visible={this.state.visible}
        title={
          <span>
            说明 <Icon type="question-circle-o" />
          </span>
        }
        footer={null}
        onCancel={() => this.closeModel()}
        maskClosable={false}
      >
        <h3>
          <b>评分说明:</b>
        </h3>
        <p style={{ marginTop: 5 }}>
          1、参考分值：满分为100分，评分应适当拉开差距，以每5分分差。
        </p>
        <h3>
          <b>评价项说明:</b>
        </h3>
        {mentions}
        <h3 style={{ marginTop: 5 }}>
          <b>注意事项:</b>
        </h3>
        <p style={{ marginTop: 5 ,color:"red"}}>
         给被评员工打分后请提交，若不提交重新打开该页面选项会丢失。
         当评价进度为100%的时候才能提交，否则提交不了,
         提交成功后即已完成本次员工职业素养评价，请耐心等待评价结果！
        </p>
        <br></br>
        <br></br>
      </Modal>
      </div>
      :
      ""
        }
      </div>
    );
  }
}
StaffEvaluation = Form.create()(StaffEvaluation);

function mapStateToProps(state) {
  return {
    ...state.staffEvaluation
  };
}

export default connect(mapStateToProps)(StaffEvaluation);
