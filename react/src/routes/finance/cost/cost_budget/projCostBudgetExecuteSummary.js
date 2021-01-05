/**
 * 作者：张楠华
 * 创建日期：2017-11-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：财务-全成本-项目全成本管理-项目全成本预算执行情况汇总_全年
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Select, Row, Col,Button,Tooltip,Spin, Modal } from 'antd';
import styles from '../../../../components/finance/table.less'
import commonStyle from '../costCommon.css';
import Style from '../../../../components/finance/finance.less'
import moment from 'moment';
import {TagDisplay} from '../costCommon.js'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
/**
 * 作者：张楠华
 * 创建日期：2017-11-3
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  if(text === '0.0'){
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>-</div>
    )
  }else{
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
    )
  }
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
function getYear(year) {
  let res = [];
  for(let i=0;i<(new Date().getFullYear()-year);i++){
    res.push(<Option value={(new Date().getFullYear() - i).toString()} key={(new Date().getFullYear() - i).toString()}>{(new Date().getFullYear() - i).toString()}</Option>)
  }
  return res;
}
class BudgetExecuteManage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ou:localStorage.ou,
      projAllYear: '',
      projCode:'请选择项目名称',
      visbile: false
    };
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择组织单元
   */
  selectOu = (value) => {
    const { dispatch } = this.props;
    this.setState({
      ou:value,
      projCode:'请选择项目名称'
    });
    dispatch({
      type:'projCostBudgetExecuteSummary/getProjList',
      ou:value,
      QYearMonth:this.state.projAllYear === '' ? this.props.lastDate : this.state.projAllYear,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-10-16
   * 功能：选择年份
   */
  selectYear = (value) => {
    this.setState({
      projAllYear:value,
      projCode:'请选择项目名称'
    });
    const { dispatch } = this.props;
    dispatch({
      type:'projCostBudgetExecuteSummary/getProjList',
      ou:this.state.ou,
      QYearMonth:value
    });
  };
  // 改变项目名称
  handleProjNameChange = (value) => {
    this.setState({
      projCode:value
    });
    this.props.dispatch({
      type:'projCostBudgetExecuteSummary/queryProjectBudgetGoing',
      projCode:value,
      yearMonth:this.state.projAllYear === '' ? this.props.lastDate : this.state.projAllYear
    });
  };

  // expExlAll=()=>{
  //   let QYear = this.state.projAllYear === '' ? this.props.lastDate : this.state.projAllYear;
  //   let ou = this.state.ou;
  //   let exportUrl='/microservice/cosservice/projectcost/allcost/ExportBudgetGoingBat?'+'arg_total_year='+QYear+'&arg_ou='+ou;
  //   window.open(exportUrl);
  // };
  expExl=()=>{
    let QYear = this.state.projAllYear === '' ? this.props.lastDate : this.state.projAllYear;
    let QProjCode = this.state.projCode;
    let exportUrl='/microservice/cosservice/projectcost/allcost/ExportBudgetGoing?'+'arg_total_year='+QYear+'&arg_proj_code='+QProjCode;
    window.open(exportUrl);
  };
  handleCancel_BP = ()=>{
    this.setState({
      visbile: false
    })
  }
  handleOK_BP = () => {
    const {dispatch} = this.props
    this.setState({
      visbile: true
    })
    dispatch({
      type: 'projCostBudgetExecuteSummary/cost_BP_detail_query',
      projCode: this.state.projCode,
      year: this.state.projAllYear === '' ? this.props.lastDate : this.state.projAllYear,
      ou: this.state.ou
    })
    console.log(this.props.dataSource_BP,this.props.columns_BP)
  }
  render(){
    const { projList,ouList,projInfoOne,loading,list,columns_BP,dataSource_BP }=this.props;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index+1;
      })
    }
    //第一种情况：最后一行与上个项目相同
    //第二种情况，最后一行与上个项目不同,最后一行如果是部门小计有可能没有proj_code，
    let rowSpanNum = 1;
    let rowSpanArray = [];
    for(let i=1;i<list.length;i++){
      if(list[i].ou !== list[i-1].ou){
        rowSpanArray.push(rowSpanNum);
        rowSpanNum = 1;
      }else{
        rowSpanNum++;
      }
    }
    //部门小计与合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
    for(let i=1;i<list.length;i++){
      list[0].rowSpan = null;
      if(list[i].ou === list[i-1].ou){
        list[i].rowSpan = 0;
      }else{
        list[i].rowSpan = null;
      }
    }
    let j=0;
    for(let i=0;i<list.length;i++){
      if(list[i].rowSpan === null){
        list[i].rowSpan = rowSpanArray[j];
        j++;
      }
    }

    let rowSpanNum1 = 1;
    let rowSpanArray1 = [];
    for(let i=1;i<list.length;i++){
      if(list[i].fee_type !== list[i-1].fee_type){
        rowSpanArray1.push(rowSpanNum1);
        rowSpanNum1 = 1;
      }else{
        rowSpanNum1++;
      }
    }
    //部门小计与合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
    for(let i=1;i<list.length;i++){
      list[0].rowSpan1 = null;
      if(list[i].fee_type === list[i-1].fee_type){
        list[i].rowSpan1 = 0;
      }else{
        list[i].rowSpan1 = null;
      }
    }
    let j1=0;
    for(let i=0;i<list.length;i++){
      if(list[i].rowSpan1 === null){
        list[i].rowSpan1 = rowSpanArray1[j1];
        j1++;
      }
    }
    let columns;
    columns = [
      {
        title: '组织单元',
        dataIndex: 'ou',
        key:'ou',
        width:'150px',
        //colSpan:0,
        fixed:'left',
        render: (text, record) => {
          return{
            children : <div style={{'textAlign':'center'}}>{record.ou}</div>,
            props:{rowSpan:record.rowSpan}
          };
        },
      },
      {
        title: '成本类型',
        dataIndex: 'fee_type',
        key:'fee_type',
        width:'130px',
        //colSpan:0,
        fixed:'left',
        render: (text,record) => {
          return{
            children : <div>{text}</div>,
            props:{rowSpan:record.rowSpan1}
          };
        },
      },
      {
        title: '成本名称',
        dataIndex: 'fee_name',
        key:'fee_name',
        width:'180px',
        //colSpan:3,
        fixed:'left',
        render:(text)=>{
          if(text === 'BP专项'){
            return(
              <Tooltip title={text} style={{width:'30%'}}>
              <div className={Style.projectAbbreviation} onClick={this.handleOK_BP}><a>{text}</a></div>
            </Tooltip>
            )
          }else {return (
            <Tooltip title={text} style={{width:'30%'}}>
              <div className={Style.projectAbbreviation}>{text}</div>
            </Tooltip>
          )}
        }
      },
      {
        title: '预算数',
        dataIndex: 'budget_fee_year',
        key:'budget_fee_year',
        width:'150px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '1月',
        dataIndex: 'jan_fee',
        key:'jan_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '2月',
        dataIndex: 'feb_fee',
        key:'feb_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '3月',
        dataIndex: 'mar_fee',
        key:'mar_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '4月',
        dataIndex: 'apr_fee',
        key:'apr_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '5月',
        dataIndex: 'may_fee',
        key:'may_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '6月',
        dataIndex: 'jun_fee',
        key:'jun_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '7月',
        dataIndex: 'jul_fee',
        key:'jul_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '8月',
        dataIndex: 'aug_fee',
        key:'aug_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '9月',
        dataIndex: 'sep_fee',
        key:'sep_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '10月',
        dataIndex: 'oct_fee',
        key:'oct_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '11月',
        dataIndex: 'nov_fee',
        key:'nov_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '12月',
        dataIndex: 'dec_fee',
        key:'dec_fee',
        width:'120px',
        render:(text)=><MoneyComponent text={text}/>
      },
      {
        title: '合计',
        dataIndex: '合计',
        key:'合计',
        width:'150px',
        fixed:'right',
        render:(text)=><MoneyComponent text={text}/>
      },
    ];
    //组织单元列表
    let ouList1;
    if(ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name} value={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    //部门列表，同时去前缀
    const projNameList = projList.map((item) => {
      return (
        <Option key={item.proj_code}>
          {item.proj_name}
        </Option>
      )
    });
    console.log(dataSource_BP,columns_BP,projList)
    return(
      <Spin tip="Loading..." spinning={loading}>
      <div id='tableBox' className={commonStyle.container}>
        {/*查询条件开始*/}
        <div style={{textAlign:'left',paddingLeft:'15px'}}>
          <span style={{display:'inline-block'}}>OU：
            <Select showSearch style={{ width: 200}}  value={this.state.ou} onSelect={this.selectOu} >
              {ouList1}
            </Select>
          </span>
          <span style={{display:'inline-block',margin:'0 20px'}}>年：
            <Select showSearch style={{ width: 80}}  value={this.state.projAllYear === '' ? this.props.lastDate : this.state.projAllYear} onSelect={this.selectYear}>
              {getYear(2015)}
            </Select>
          </span>
          <span style={{display:'inline-block',marginTop:'10px'}}>项目名称：
            <Select showSearch
                    optionFilterProp="children"
                    dropdownMatchSelectWidth={false}
              onChange={this.handleProjNameChange} placeholder="请选择项目名称" style={{minWidth:'400px'}} value={this.state.projCode}>
              <Option value="请选择项目名称">请选择项目名称</Option>
              {projNameList}
            </Select>
          </span>
          <br/>
          <div style={{textAlign:'right',marginTop:'10px'}}>
            <span style={{display:'inline-block',margin:'0 20px'}}>
          {
            list.length !== 0 ?
              <Button type="primary" onClick={this.expExl}>导出</Button>
              :
              <Button disabled onClick={this.expExl}>导出</Button>
          }
          </span>
            {/*<Button type="primary" onClick={this.expExlAll}>导出全部项目</Button>*/}
          </div>
        </div>
        {projInfoOne.proj_name ?
          <div>
            {/*项目信息开始*/}
            <div>
              <div>
                <h3 style={{textAlign:'left',paddingLeft:'15px',fontWeight:'600'}}>项目名称：{projInfoOne.proj_name}</h3>
              </div>
              <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                <Col span={6}>
                  <b>项目编码：</b>{projInfoOne.proj_code}
                </Col>
                <Col span={6}>
                  <b>PMS编码：</b>{projInfoOne.pms_code}
                </Col>
                <Col span={7}>
                  <b>项目周期：</b>{projInfoOne.proj_time}
                </Col>
                <Col span={5}>
                  <b>项目经理：</b>{projInfoOne.mgr_name}
                </Col>
              </Row>
              <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'10px'}}>
                <Col span={6}>
                  <b>投资替代额(元)：</b>{projInfoOne.replace_money}
                </Col>
                <Col span={6}>
                  <b>项目状态：</b><TagDisplay proj_tag={projInfoOne.proj_tag}/>
                </Col>
              </Row>
            </div>
            {/*项目信息结束*/}
          </div>
          : null}
        {
          list.length !== 0?
            <div style={{textAlign: 'left',marginTop:'20px'}}>
              <Table columns={columns}
                     dataSource={this.props.list}
                     pagination={false}
                //loading={loading}
                     scroll={{x:2140,y:400}}
                     className={styles.financeTable_smallSize}
              />
            </div>
            :
            null
        }
        <Modal
          width= '80%'
          title="BP专项详情"
          visible={this.state.visbile}
          onCancel={this.handleCancel_BP}
          footer={null}
        >
          <Table  className={styles.financeTable} dataSource={dataSource_BP} columns={columns_BP} scroll={{x: 1560, y: false}}/>
      </Modal>
      </div>
      </Spin>
    );
  }
}


function mapStateToProps (state) {
  const { list,ouList,projAllYear,projList,projCode,ou,projInfoOne,lastDate,dataSource_BP,columns_BP } = state.projCostBudgetExecuteSummary;
  return {
    loading: state.loading.models.projCostBudgetExecuteSummary,
    list,
    ouList,
    projAllYear,
    ou,
    projCode,
    projList,
    projInfoOne,
    lastDate,
    dataSource_BP,
    columns_BP
  };
}

export default connect(mapStateToProps)(BudgetExecuteManage);
