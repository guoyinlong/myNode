/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本erp成本导入-间接成本
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Select,DatePicker,Button,Table,Popconfirm,Spin,Input } from 'antd';
const Option = Select.Option;
const { MonthPicker} = DatePicker;
import tableStyle from '../../../../components/common/table.less';
import styles from '../feeManager/costmainten.less';
import commonStyle from '../costCommon.css';
import {getOU,HideTextComp,MoneyComponent} from '../costCommon.js';
import exportExl from '../../../../components/commonApp/exportExl';
import { rightControl } from '../../../../components/finance/rightControl';
import * as config from '../../../../services/finance/costServiceConfig.js';
import EditItem from './editComponent.js';
class IndirectCost extends React.Component {
  state={
    OUs:[],
    OU:Cookie.get('OU'),
    // month:'2017-06'
  };
  // 查询
  indirectQuery=(item)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'indirectCost/indirectSearch',
      formData:!rightControl(config.IndirectRelease,this.props.rightCtrl)
              &&!rightControl(config.IndirectCancelRelease,this.props.rightCtrl)
            ?{...item,'argstatecode':0}
            :{...item}
    });
  };
// 改变日期进行的操作
  onChangeDatePicker=(date, dateString)=>{
    let {OU}=this.state;
    this.setState({month:dateString});
    let formData={
      ou:OU,
      total_year_month:dateString
    };
    this.indirectQuery(formData);
  };
// 改变OU进行的操作
  OUhandleChange=(value)=>{
    this.setState({OU:value});
    let month=this.state.month||this.props.lastDate;
    let formData={
      ou:value,
      total_year_month:month
    };
    this.indirectQuery(formData);
  };
  // 导出表格
  exportExcel=()=>{
    let {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    let tableId=document.querySelector("#exportTable table");
    let tableName=OU+month+'间接成本数据表';
    exportExl()(tableId,tableName)
  };
  // 同步操作
  syn=()=>{
    const {dispatch}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'indirectCost/syn',
      searchPostData:{
        ou:OU,
        total_year_month:month
      }
    })
  };
  // 发布操作
  release=()=>{
    const {dispatch}=this.props;
    let {tableId,dataList}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'indirectCost/indirectRelease',
      formData:{
        transjsonarray:JSON.stringify([{
          update: {state_code:0},
          condition:{table_id:tableId || dataList[0].table_id}
        }])
      },
      searchPostData:{
        ou:OU,
        total_year_month:month
      }
    })
  };
  // 撤销发布
  cancelRelease=()=>{
    const {dispatch}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'indirectCost/indirectCancelRelease',
      formData:{
        ou:OU,
        total_year_month:month
      },
      searchPostData:{
        ou:OU,
        total_year_month:month
      }
    })
  }
  // 限制月份的选择
  disabledDate=(value)=>{
    if(value){
      let lastDate =  moment().valueOf();
      return value.valueOf() > lastDate
    }
  };
// 页面初始化话的查询操作
  componentWillMount(){
    const {dispatch}=this.props;
    const {OU}=this.state;
    // 获取用户所能看到的OU
    let OUData=getOU('/indirect_cost_mgt');
    OUData.then((data)=>{
      this.setState({
        OUs:data.DataRows,
      });
      if(data.DataRows.length!=0){
        // 根据权限进行查询
        dispatch({
          type:'indirectCost/getRightCtrl',
          formDataRight:{
            argtenantid:Cookie.get('tenantid'),
            arguserid:Cookie.get('userid'),
            argmoduleid:window.sessionStorage['financeCostModuleId']
          },
          formDataQuery:{
            'argou': OU,
          }
        })
      }
    })
  }
  onCellChange = (record,text) => {
    const {dispatch}=this.props;
    const {OU}=this.state;
    let month=this.state.month||this.props.lastDate;
    dispatch({
      type:'indirectCost/updatefee',
      feeCode : record.fee_code,
      ou : this.state.OU,
      batchNum : record.table_id,
      feeValue : record['changedNewValue'] || text,
      searchPostData:{
        ou:OU,
        total_year_month:month
      }
    })
  };
  itemChange = (item) =>(e) => {
    let value = e.target.value;
    let isMinus = false;
    //如果以 — 开头
    if (value.indexOf('-') === 0) {
      isMinus = true;
    }

    //先将非数值去掉
    value = value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if(isMinus === true){
      value = '-' + value;
    }
    // if(this.props.changeValue){
    //   this.props.changeValue(value,this.props.feeName,this.props.record);
    // }
    item['changedNewValue'] = value;
  };
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  };
  render(){
    const {dataList,rightCtrl}=this.props;
    let columns = [];
    if(dataList.length!==0){
      columns=[
        {
          title:'科目代码',
          dataIndex:'fee_code',
          key:'fee_code',
          render:(text)=><div>&nbsp;{text}</div>
        },{
          title:'科目描述',
          dataIndex:'fee_name',
          key:'fee_name'
        },{
          title:'金额',
          dataIndex:'fee',
          //render:(text)=><MoneyComponent text={text}/>
          render: (text, item) => (
            <EditItem isEdit={false} show={<MoneyComponent text={text}/>}
                      edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                      />}
                      disabled={dataList[0]&&dataList[0].state_code=='0'?true:false}
                      onOk={()=> this.onCellChange(item,text)}
                      onCancel={()=>this.itemCancel(item,'fee',text)}
            />
          ),
        }]
    }
    return(
      <Spin spinning={this.props.loading}>
        <div className={commonStyle.container}>
          <span>部门/OU：
            <Select value={this.state.OU} onChange={this.OUhandleChange}  style={{minWidth:'180px'}}>
              {this.state.OUs.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)}
            </Select>
          </span>
          <span style={{display:'inline-block',margin:'0 20px'}}>
            月份：
            <MonthPicker onChange={this.onChangeDatePicker} disabledDate={this.disabledDate} value={moment(this.state.month?this.state.month:this.props.lastDate, 'YYYY-MM')} allowClear={false} />
          </span>
          {
            rightControl(config.IndirectRelease,rightCtrl) ?
              <Popconfirm title="确定同步数据吗?" onConfirm={this.syn}  okText="确定" cancelText="取消">
                <Button type="primary" disabled={dataList[0]&&dataList[0].state_code=='0'?true:false}>同步</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }
          {
            rightControl(config.IndirectRelease,rightCtrl) ?
              <Popconfirm title="确定发布数据吗?" onConfirm={this.release}  okText="确定" cancelText="取消">
                <Button type="primary"  disabled={dataList[0]&&dataList[0].state_code=='2'?false:true}>发布</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }

          {
            rightControl(config.IndirectCancelRelease,rightCtrl) ?
              <Popconfirm title="确定撤销数据吗?" onConfirm={this.cancelRelease}  okText="确定" cancelText="取消">
                <Button type="primary" disabled={dataList[0]&&dataList[0].state_code=='0'?false:true}>撤销</Button>&nbsp;&nbsp;
              </Popconfirm>
              :
              null
          }

          <Button type="primary" onClick={this.exportExcel} disabled={dataList[0]?false:true}>导出</Button>&nbsp;&nbsp;

          <div className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{marginTop:'15px'}}>
            <p style={{height:'15px'}}>
              <span style={{float:'left'}}>状态：<span style={{color:'red'}}>{dataList[0]?dataList[0].state_name:''}</span></span>
              <span style={{float:'right'}}>金额单位：元</span>
            </p>
            <Table  columns={columns} dataSource={dataList} pagination={{showSizeChanger:true}}/>
          </div>
          <div id='exportTable' className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{display:"none"}}>
            <Table columns={columns} dataSource={dataList} pagination={false} />
          </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  const {dataList,lastDate,rightCtrl,tableId}=state.indirectCost
  return {
    dataList:dataList||[],
    lastDate,
    loading:state.loading.models.indirectCost,
    rightCtrl,
    tableId
  };
}

export default connect(mapStateToProps)(IndirectCost);
