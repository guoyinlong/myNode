/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本费用科目管理-费用科目维护
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import moment from 'moment';
import {Button,Table, Input, Icon,Modal,message,Popconfirm,Tooltip} from 'antd';
import tableStyle from '../../../../components/common/table.less';
import styles from './costmainten.less';
import Forms from '../../../../components/cost/costmaintenForm';
import commonStyle from '../costCommon.css';
import {getOU} from '../costCommon.js';
import { rightControl } from '../../../../components/finance/rightControl';
import * as config from '../../../../services/finance/costServiceConfig.js';

function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}
// 表格文字过长隐藏
function HideTextComponent ({text}){
  return (
    <Tooltip title={text} style={{width:'30%'}}>
      <div style={{width:'120px',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis'}}>{text}</div>
    </Tooltip>
  )
}
class Costmainten extends React.Component {
  state={
   filterDropdownItem:{fee_code:{filterDropdownVisible:false,searchText: '',filtered: false},
                       fee_name:{filterDropdownVisible:false,searchText: '',filtered: false}},
   addModelVisible:false,
   midifyModelVisible:false,
   OUs:[],
   filteredInfo:null,
   data:[],
   clearFlag:true//清空筛选条件按钮是否可用
  }
  // ou搜索可控
  handleOUChange = (pagination, filters, sorter) => {
    if(filters.ou){
      this.setState({clearFlag:false})
    }
    this.setState({
      filteredInfo: filters
    });
  }
  // 点击编辑按钮
  edit(record) {
    const {midifyModelVisible}=this.state;
    this.setState({
      recordMidify:record,
      midifyModelVisible:!midifyModelVisible
    })
  }
  cancelEdit=()=>{
    const {midifyModelVisible}=this.state;
    this.setState({
      midifyModelVisible:!midifyModelVisible
    })
  }
  // 编辑确认
  editDone=()=> {
    var midifyData=this.refs.getMidifyFormsData.getData();
    const {fee_code,fee_name,fee_level,up_fee_name,fee_desc,remark2,ou,state,id}=midifyData
    const { filteredInfo,filterDropdownItem,midifyModelVisible,argou} = this.state;
    if(!fee_code){
      message.warn('费用项编码为必填项');
      return;
    }
    if(fee_level=='2'&&!up_fee_name){
      message.warn('费用项等级为2时，上级费用项为必填项');
      return;
    }
    const {dispatch}=this.props;
    dispatch({
      type:'costmainten/feeNameUpdateBat',
      formData:{
        transjsonarray:JSON.stringify([{
          update:{
            fee_code, fee_name,fee_level,up_fee_name,fee_desc,remark2,ou,state,staff:Cookie.get('username')
          },
          condition:{id}
        }])
      },
      queryFormData:{
        argou:filteredInfo && filteredInfo.ou && filteredInfo.ou.length>0?filteredInfo.ou.join('#'):argou.join('#'),
        argfee_name:filterDropdownItem.fee_name.searchText,
        argfee_code:filterDropdownItem.fee_code.searchText
      }
    })
    this.setState({ midifyModelVisible:!midifyModelVisible})
  }

  // 表头搜索输入框
  onInputChange = (e,key) => {
    var {filterDropdownItem}=this.state;
    filterDropdownItem[key].searchText=e.target.value
    this.setState({ filterDropdownItem });
  }
  // 表头搜索
  onSearch = (item,key) => {
    const { filterDropdownItem ,filteredInfo,argou} = this.state;
    const {dispatch}=this.props;
    // const reg = new RegExp(filterDropdownItem[item].searchText, 'gi');
    filterDropdownItem[item].filterDropdownVisible=false;
    filterDropdownItem[item].filtered=!!filterDropdownItem[item].searchText;

    dispatch({
      type:'costmainten/costmaintenQuery',
      formData:{
        argou:filteredInfo && filteredInfo.ou && filteredInfo.ou.length>0?filteredInfo.ou.join('#'):argou.join('#'),
        argfee_name:filterDropdownItem.fee_name.searchText,
        argfee_code:filterDropdownItem.fee_code.searchText
      }
    });
    if(filterDropdownItem.fee_name.searchText||filterDropdownItem.fee_code.searchText){
      this.setState({clearFlag:false})
    }
    this.setState({
      filterDropdownItem
    });
  }
  // 添加费用项
  addCostmainten=()=>{
    var formData=this.refs.getFormsData.getData();
    if(!formData.fee_code){
      message.warn('费用项编码为必填项');
      return;
    }
    if(!formData.fee_name){
      message.warn('费用项名称为必填项');
      return;
    }
    if(!formData.ou){
      message.warn('OU为必填项');
      return;
    }
    if(!formData.fee_level){
      message.warn('费用项等级为必填项');
      return;
    }
    if(formData.fee_level=='2'&&!formData.up_fee_code){
      message.warn('费用项等级为2时，上级费用项为必填项');
      return;
    }
    const {dispatch}=this.props;
    dispatch({
      type:'costmainten/feeNameAddBat',
      formData:{
        transjsonarray:JSON.stringify([{
          ...formData,id:RndNum(18),staff:Cookie.get('username')
        }])
      }
    })
    this.setState({
      addModelVisible:false
    })
  }
  // 显示模态框
  showAddCostmaintenModel=()=>{
    const {addModelVisible}=this.state;
    this.setState({
      addModelVisible:!addModelVisible
    })
  }
  // 清空筛选条件
  clearFilter=()=>{
    const {dispatch}=this.props;
    let {argou}=this.state;
    this.setState({
      filteredInfo:null,
      filterDropdownItem:{fee_code:{filterDropdownVisible:false,searchText: '',filtered: false},
                          fee_name:{filterDropdownVisible:false,searchText: '',filtered: false}},
      clearFlag:true
    })
    dispatch({
      type:'costmainten/costmaintenQuery',
      formData:{
        argou:argou.join('#')
        // argou:'联通软件研究院本部#济南软件研究院#哈尔滨软件研究院'
      }
    })
  }
  componentWillMount(){
    const {dispatch}=this.props;
    var OUData=getOU('/cost_fee_mgt');
    OUData.then((data)=>{
      var argou=[];
      for(var i=0;i<data.DataRows.length;i++){
        argou[i]=data.DataRows[i].dept_name;
      };
      this.setState({
        OUs:data.DataRows,argou
      });
      // 获取按钮权限
      dispatch({
        type:"costmainten/getRightCtrl",
        formData:{
          argtenantid:Cookie.get('tenantid'),
          arguserid:Cookie.get('userid'),
          argmoduleid:window.sessionStorage['financeCostModuleId']
        }
      });

      dispatch({
        type:'costmainten/costmaintenQuery',
        formData:{
          argou:argou.join('#')
          // argou:'联通软件研究院本部#济南软件研究院#哈尔滨软件研究院'
        }
      })
    })
  }
  componentWillReceiveProps(newProps){
    if(newProps.data){
      // var {data}=this.state;
      this.setState({
        data:newProps.data
      })
    }
  }
  render(){
    const {data,OUs}=this.state;
    let {filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    var OUFilter=[];
    for(var i=0;i<OUs.length;i++){
      OUFilter.push({
         text: OUs[i].dept_name, value:OUs[i].dept_name
      })
    }
    const columns=[
      {
        title:'OU',
        dataIndex:'ou',
        key:'ou',
        filters: OUFilter,
        filteredValue: filteredInfo.ou || null,
        onFilter: (value, record) => record.ou.includes(value),
     },{
       title:'费用项编码',
       dataIndex:'fee_code',
       key:'fee_code',
       filterDropdown: (
         <div className={styles.filterDropdown}>
           <Input
             ref={feeCode => this.searchInput = feeCode}
             value={this.state.filterDropdownItem.fee_code.searchText}
             onChange={(e)=>this.onInputChange(e,'fee_code')}
             onPressEnter={()=>this.onSearch('fee_code','fee_code')}
           />
           <Button type="primary" onClick={()=>this.onSearch('fee_code','fee_code')}>搜索</Button>
         </div>
       ),
       filterIcon: <Icon type="search" style={{ color: this.state.filterDropdownItem.fee_code.filtered ? '#FA7252' : '#fff' }} />,
       filterDropdownVisible: this.state.filterDropdownItem.fee_code.filterDropdownVisible,
       onFilterDropdownVisibleChange: (visible) => {
         var {filterDropdownItem}=this.state;
         filterDropdownItem.fee_code.filterDropdownVisible=visible;
         this.setState({
           filterDropdownItem
         }, () => this.searchInput.focus());
       },
     },{
       title:'费用项名称',
       dataIndex:'fee_name',
       key:'fee_name',
       width:'150px',
       // render:(text,record,index)=>{
       //   return (
       //     <div style={{width:'130px'}}><HideTextComponent text={text}/></div>
       //   )
       // },
       filterDropdown: (
         <div className={styles.filterDropdown}>
           <Input
             ref={ele => this.searchInput = ele}
             value={this.state.filterDropdownItem.fee_name.searchText}
             onChange={(e)=>this.onInputChange(e,'fee_name')}
             onPressEnter={()=>this.onSearch('fee_name','fee_name')}
           />
           <Button type="primary" onClick={()=>this.onSearch('fee_name','fee_name')}>搜索</Button>
         </div>
       ),
       filterIcon: <Icon type="search" style={{ color: this.state.filterDropdownItem.fee_name.filtered ? '#FA7252' : '#fff' }} />,
       filterDropdownVisible:this.state.filterDropdownItem.fee_name.filterDropdownVisible,
       onFilterDropdownVisibleChange: (visible) => {
         var {filterDropdownItem}=this.state;
         filterDropdownItem.fee_name.filterDropdownVisible=visible;
         this.setState({
           filterDropdownItem
         }, () => this.searchInput.focus());
       },
     },{
       title:'费用项等级',
       dataIndex:'fee_level',
       key:'fee_level',
       width:'80px',
     },{
       title:'上级费用项',
       dataIndex:'up_fee_name',
       key:'up_fee_name',
       width:'150px',
       // render:(text,record,index)=>{
       //   return (
       //     <div style={{width:'130px'}}><HideTextComponent text={text}/></div>
       //   )
       // },
     },{
       title:'费用项描述',
       dataIndex:'fee_desc',
       key:'fee_desc',
       width:'150px',
       // render:(text,record,index)=>{
       //   return (
       //     <div style={{width:'130px'}}><HideTextComponent text={text}/></div>
       //   )
       // },
     },{
       title:"人员",
       dataIndex:'staff',
       key:'staff'
     },{
       title:'状态',
       dataIndex:'state_name',
       key:'state_name'
     }];
   if(rightControl(config.FeeNameUpdateBat,this.props.rightCtrl)){
     columns.push(
       {
         title: '操作',
         render: (text, record, index) => {
          return (
            <div>
              <a onClick={() => this.edit(record)}>编辑</a>
            </div>
          );
        }
      }
    )
   }
    return(
      <div className={styles.costmaintenTable+' '+tableStyle.orderTable+' '+commonStyle.container}>
        {
          rightControl(config.FeeNameAddBat,this.props.rightCtrl) ?
            <Button type="primary" style={{margin:'0 10px 10px 0'}} onClick={this.showAddCostmaintenModel}>添加费用科目</Button>
            :
            null
        }

        <Button type="primary" style={{margin:'0 10px 10px 0'}} onClick={this.clearFilter} disabled={this.state.clearFlag}>清空筛选条件</Button>
        <Table loading={this.props.loading} columns={columns} dataSource={data} pagination={{showSizeChanger:true}} onChange={this.handleOUChange}/>
        <Modal
          key={RndNum(10)}
          title="费用项新增"
          visible={this.state.addModelVisible}
          onCancel={this.showAddCostmaintenModel}
          footer={[
            <Button key="back" size="large" onClick={this.showAddCostmaintenModel}>返回</Button>,
            <Button key="submit" type="primary" size="large"  onClick={this.addCostmainten}>提交</Button>,
          ]}>
          <Forms OUs={OUs} ref='getFormsData'/>
        </Modal>

        <Modal
          key={RndNum(10)}
          title="费用项修改"
          visible={this.state.midifyModelVisible}
          onCancel={this.cancelEdit}
          footer={[
            <Button key="back" size="large" onClick={this.cancelEdit}>返回</Button>,
            <Button key="submit" type="primary" size="large"  onClick={this.editDone}>保存</Button>,
          ]}>
          <Forms OUs={OUs} ref='getMidifyFormsData' defaultData={this.state.recordMidify}/>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {costmaintenList,rightCtrl}=state.costmainten
  return {
    data:costmaintenList,
    loading:state.loading.models.costmainten,
    rightCtrl
  };
}

export default connect(mapStateToProps)(Costmainten);
