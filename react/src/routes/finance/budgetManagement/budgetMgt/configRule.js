/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：配置规则
 */
import React from 'react';
import {Modal,Icon,Transfer,Table,Button,Select,message,Row,Col,TreeSelect,Popover,Spin} from 'antd';
import tableStyle from '../../../../components/common/table.less';
import Style from '../budgetStyle.less';
const confirm = Modal.confirm;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
function changeDeptListTo(data) {
  let deptListData =[];
  function dept(data) {
    for( let i=0;i<data.length;i++){
      if(data[i].children){
        dept(data[i].children);
      }else{
        deptListData.push(data[i].node.props.value);
      }
    }
  }
  dept(data);
  return deptListData;
}
class FeeCost extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    feeCostIcon:true,
    feeCostStyle:{display:'none'},
    subject:'', //dw会计科目
    project:'',//项目
    cost:'',//成本中心
  };
  ChangeStyle=()=>{
    const { feeCostIcon } = this.state;
    this.setState({
      feeCostStyle:{display:'block'},
      feeCostIcon:!feeCostIcon,
    });
    if(feeCostIcon === false){
      this.setState({
        feeCostStyle:{display:'none'},
      });
    }else{
      this.setState({
        feeCostStyle:{display:'block'},
      });
    }
  };
  onChangeRule=(value,key)=>{
      this.setState({
        [key] : value,
      })
  };
  onChange=(value, label,extra)=>{
    let costChange = changeDeptListTo(extra.allCheckedNodes);
    this.setState({
      cost : costChange,
    });
  };
  addFeeCost=()=>{
    const { subject,project,cost } = this.state;
    if(subject === '' || project === '' || cost === ''){
      message.info('所填项不能为空');
    }else {
      this.props.dispatch({
        type : 'costMgt/addFeeCost',
        state: this.state,
        feeId:this.props.feeId,
      });
      this.setState({
        subject:'',
        project:'',
        cost:'',
      })
    }
  };
  delFeeCostConfirm=(e,record)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+record.dw_fee_name+'吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delFeeCost(record)
      },
    });
  };
  resetState=()=>{
    this.setState({
      feeCostIcon:true,
      feeCostStyle:{display:'none'},
      subject:'', //dw会计科目
      project:'',//项目
      cost:'',//成本中心
    })
  };
  delFeeCost=(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'costMgt/delFeeCost',
      state:record,
      feeId:this.props.feeId,
    });
  };
  render() {
    const { DWList,projList,deptList } = this.props;
    this.props.feeCostList.map((i,index)=>{
      i.key=index;
    });
    let dwOptionList = DWList.map((i,index)=>{
      return(<Option value={i.dw_fee_id} key={index}>{i.dw_fee_name+'('+i.dw_fee_code+')'}</Option>)
    });
    let projOptionList = projList.map((i,index)=>{
      return(<Option value={i.proj_type_id} key={index}>{i.proj_type_name}</Option>)
    });
    let columns = [
      {
        title: '科目',
        dataIndex: 'dw_fee_name',
        key:'dw_fee_name',
      },
      {
        title: '项目',
        dataIndex: 'proj_type_name',
        key:'proj_type_name',
      },
      {
        title: '成本中心',
        dataIndex: 'dept_list',
        key:'dept_list',
        render:(text,record)=>{
          return(
            <Popover placement="right"  title={'成本中心详情'} content ={<div key={record.dw_fee_id}>
              {JSON.parse(text).map((i,index)=>{
                return(<div key={index}>{i.dept_name}</div>)
              })}
            </div>}>
              <div style={{cursor:'pointer'}}><Icon type="info-circle-o" style={{ marginLeft:10 }}/></div>
            </Popover>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'opt',
        key:'opt',
        render:(text,record)=>{
          return(
            <div>
              <a onClick={(e)=>this.delFeeCostConfirm(e,record)}>{'删除'}</a>
            </div>
          )
        }
      },
    ];
    const tProps = {
      treeData:deptList,
      value: this.state.cost,
      onChange: (value,label,extra)=>this.onChange(value,label,extra),
      treeCheckable: true,
      searchPlaceholder: '',
      autoClearSearchValue:true,
      showCheckedStrategy:TreeSelect.SHOW_PARENT,
      notFoundContent:'没有数据',
      style: {
        width: 400,
      },
    };
    return (
      <div>
        <div className={Style.titleCarp}></div>
        <div>
          <div className={Style.configTitle}>费用规则配置</div>
          <span>
              {
                this.state.feeCostIcon === true ?
                  <Icon onClick={this.ChangeStyle} className={Style.iconStyle} type="caret-down" ><div className={Style.zhankaitext}>展开</div></Icon>
                  :
                  <Icon onClick={this.ChangeStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
              }
            </span>
        </div>
        <div style={this.state.feeCostStyle} className={Style.configWarp}>
              <div style={{marginLeft:'15px'}}>科目：
                <Select style={{ width: 545}}  showSearch value={this.state.subject} onChange={(value)=>this.onChangeRule(value,'subject')} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {dwOptionList}
                </Select>
              </div>
              <div className={Style.feeCostSubmit}>项目：
                <Select style={{ width: 250}}  showSearch value={this.state.project} onChange={(value)=>this.onChangeRule(value,'project')} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  {projOptionList}
                </Select>
              </div>
              <div className={Style.feeCostSubmit}>成本中心：
                <TreeSelect {...tProps} />
              </div>
              <div className={Style.feeCostSubmit}>
                <Button type="primary" onClick={this.addFeeCost} style={{marginLeft:30}}>提交</Button>
              </div>
        </div>
        {
          this.props.feeCostList.length !== 0 ?
            <div id="table1" style={{marginTop:'40px'}}>
              <Table columns={columns}
                     dataSource={this.props.feeCostList}
                     pagination={false}
                     className={tableStyle.orderTable}
              />
            </div>
            :
            []
        }
      </div>
    );
  }
}

class FullAperture extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    fullApertureIcon:true,
    fullApertureStyle:{display:'none'},
    targetKeys: [],
  };
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };
  ChangeStyle=()=>{
    const { fullApertureIcon } = this.state;
    this.setState({
      fullApertureStyle:{display:'block'},
      fullApertureIcon:!fullApertureIcon,
    });
    if(fullApertureIcon === false){
      this.setState({
        fullApertureStyle:{display:'none'},
      });
    }else{
      this.setState({
        fullApertureStyle:{display:'block'},
      });
    }
  };
  addFullAperture=()=>{
    const { targetKeys } = this.state;
    if(targetKeys.length ===0){
      message.info('配置项不能为空');
    }else {
      this.props.dispatch({
        type : 'costMgt/addFullAperture',
        state: this.state,
        feeId: this.props.feeId,
      });
      this.setState({
        targetKeys:[]
      })
    }
  };
  delFullApertureConfirm=(e,i)=> {
    e.stopPropagation();
    let thisMe = this;
    confirm({
      title: '确定删除'+i.another_fee_name+'吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        thisMe.delFullAperture(i)
      },
    });
  };
  resetState=()=>{
    this.setState({
      fullApertureIcon:true,
      fullApertureStyle:{display:'none'},
      targetKeys: [],
    })
  };
  delFullAperture=(i)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'costMgt/delFullAperture',
      state:i,
      feeId: this.props.feeId,
    });
  };
  render() {
    const mockData = [];
    const {list} = this.props;
    for (let i = 0; i < list.length; i++) {
      for(let j=0;j<list[i].children.length;j++){
        mockData.push({
          key: list[i].fee_id+'-'+list[i].children[j].fee_id, //arg_another_fee_id
          title: list[i].fee_name+'-'+list[i].children[j].fee_name,//显示出来的arg_another_fee_name
        });
      }
    }
    return (
      <div>
        <div className={Style.titleCarp}></div>
        <div className={Style.configTitle}>全口径规则配置</div>
        <div>
          {
            this.state.fullApertureIcon === true ?
              <Icon onClick={this.ChangeStyle} className={Style.iconStyle} type="caret-down" ><div className={Style.zhankaitext}>展开</div></Icon>
              :
              <Icon onClick={this.ChangeStyle} className={Style.iconStyleUp} type="caret-up" ><div className={Style.zhankaitextUp}>收起</div></Icon>
          }
        </div>
        <div style={this.state.fullApertureStyle} className={Style.configWarp}>
          <Row type="flex" justify="space-between" align="bottom">
            <Col offset={2} span={18}>
              <Transfer
                titles={['源', '目标']}
                dataSource={mockData}
                showSearch
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange}
                render={item => item.title}
                listStyle={{
                  width: 300,
                }}
              />
            </Col>
            <Col span={3}>
              <Button type="primary" onClick={this.addFullAperture}>提交</Button>
            </Col>
            </Row>
        </div>
        {
          this.props.fullApertureList.length !== 0?
            <div style={{marginTop:40}}>
              <div className={Style.configContent} style={{display:'inline'}}>现有全口径规则：</div>
              {
                this.props.fullApertureList.map((i,index)=>{
                  return(
                    <div key={index} style={{backgroundColor:'#DFEAF4',display:'inline-block',marginLeft:10,padding:'4px 8px',marginTop:'8px'}}>
                      <span>{i.another_fee_name}</span>
                      <span style={{cursor:'pointer'}} onClick={(e)=>this.delFullApertureConfirm(e,i)}><Icon type="close" /></span>
                    </div>)
                })
              }
            </div>
            :
            []
        }
      </div>
    );
  }
}
export  default class ConfigRule extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    visible:false,
    data:'',
  };

  showModal = (record) =>{
    this.setState({
      visible:true,
      data:record,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'costMgt/queryDWList',
    });
    dispatch({
      type: 'costMgt/queryProject',
    });
    dispatch({
      type: 'costMgt/queryCostCenter',
    });
    dispatch({
      type: 'costMgt/queryFeeCost',
      feeId:record.fee_id,
    });
    dispatch({
      type: 'costMgt/queryFullAperture',
      feeId:record.fee_id,
    });
  };
  handleCancel = () => {
    this.setState({
      visible:false,
    });
    this.props.dispatch({type:'costMgt/clearList'});
    this.refs.fullAperture.resetState();
    this.refs.feeCost.resetState();
  };
  handleOk = () => {
    this.setState({visible:false});
  };
  render() {
    const { feeCostList,fullApertureList,DWList,deptList,projList,list } =this.props.data;
    let title = '规则配置';
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          maskClosable={false}
          footer={null}
        >
          <Spin tip="加载中..." spinning={this.props.data.loading}>
            <FeeCost ref='feeCost' feeId={this.state.data.fee_id} feeCostList={feeCostList} projList={projList} DWList={DWList} deptList={deptList} dispatch={this.props.dispatch}/>
            <hr className={Style.hrStyle}/>
            <FullAperture ref='fullAperture' feeId={this.state.data.fee_id} list={list} fullApertureList={fullApertureList} dispatch={this.props.dispatch}/>
          </Spin>
        </Modal>
      </div>
    );
  }
}
