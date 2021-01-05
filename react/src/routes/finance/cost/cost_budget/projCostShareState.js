/**
 * 作者：张楠华
 * 日期：2017-11-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：展示部门分摊人均数据维护
 */
import React from 'react';
import {connect } from 'dva';
import { Table ,Button,Select,Popconfirm,message,Spin } from 'antd';
const Option = Select.Option;
import Style from '../../../../components/employer/employer.less'
import styles from '../../../../components/finance/table.less'
//import exportExl from '../../../../components/commonApp/exportExl'
import { exportExlShareState } from './exportShareState'
import ShareStateCrl from './ShareStateCrl';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl';
/**
 * 作者：张楠华
 * 创建日期：2017-11-3
 * 功能：点击修改，弹出模态框，进行修改
 */
function operation (text, record,ss,isOnlySelect){
  if(isOnlySelect === false){
    return (
      <div>
        <a onClick={()=>ss.refs.shareStateCrl.showModal(record)}>{'编辑'}</a>
      </div>
    )
  }
  else{
    return {
      children:<div><a disabled>{'修改'}</a></div>,
      props:{
        rowSpan:0
      }
    }
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-11-3
 * 功能：格式化数据
 */
function MoneyComponent({text}) {
  return (
    <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
  )
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
class projCostShareState extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ou:localStorage.ou,
      shareStateYear:new Date().getFullYear().toString(),

    }
  }
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：选择组织单元
   */
  selectOu=(value)=>{
    const { dispatch } = this.props;
    const { shareStateYear } = this.state;
    this.setState({
      ou:value
    });
    dispatch({
      type:'projCostShareState/queryProjectCostShareState',
      ou:value,
      shareStateYear,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：选择年份
   */
  selectYear=(value)=>{
    const { dispatch } = this.props;
    const { ou } = this.state;
    this.setState({
      shareStateYear:value
    });
    dispatch({
      type:'projCostShareState/queryProjectCostShareState',
      ou,
      shareStateYear:value,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-6
   * 功能：选择年份
   */
  yearPsCrl=(value,record)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'projCostShareState/yearPsModify',
      value,
      record,
      ou:this.state.ou,
      shareStateYear:this.state.shareStateYear
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：导出数据
   */
  // expExl=()=>{
  //   const { list } = this.props;
  //   let tab=document.querySelector('#table1 table');
  //   if(list !== null && list.length !== 0){
  //     exportExl()(tab,'部门分摊成本人均标准执行情况')
  //   }else{
  //     message.info("表格数据为空！")
  //   }
  // };
  expExl = () => {
    const {list} = this.props;
    if (list !== null && list.length !== 0) {
      exportExlShareState(list, "人均标准")
    } else {
      message.info("查询结果为空！")
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：生成数据
   */
  generateData=()=>{
    const { dispatch } = this.props;
    const { ou,shareStateYear } = this.state;
    dispatch({
      type:'projCostShareState/generateProjectCostShareState',
      ou,
      shareStateYear,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：发布数据
   */
  publicData=()=>{
    const { dispatch } = this.props;
    const { ou,shareStateYear } = this.state;
    dispatch({
      type:'projCostShareState/publicProjectCostShareState',
      ou,
      shareStateYear,
    });
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-11-3
   * 功能：撤销发布数据
   */
  UnPublicData=()=>{
    const { dispatch } = this.props;
    const { ou,shareStateYear } = this.state;
    dispatch({
      type:'projCostShareState/UnPublicProjectCostShareState',
      ou,
      shareStateYear,
    });
  };
  render() {
    const { loading,list,ouList,stateName } = this.props;
    const { ou,shareStateYear } = this.state;
    //手动给每一个list一个key，不然表格数据会报错
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    //组织单元列表
    let ouList1;
    if(ouList !== '' || ouList.length !== 0){
      ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    let text1;
    let text2;
    let text3;
    if(shareStateYear !== null){
      text1 =`确定发布${shareStateYear}'${ou}'的部门分摊情况吗?`;
      text2 =`确定撤销${shareStateYear}'${ou}'的部门分摊情况吗?`;
      text3 =`确定生成${shareStateYear}'${ou}'的部门分摊情况吗?`;
    }
    //只有查询时isSelect为true。有发布和撤销时isSelect为false。
    let isSelect = !rightControl(config.publicShareState, this.props.rightData) && !rightControl(config.editShareState, this.props.rightData);
    //表格数据
    let columns;
    if(isSelect === true){
      columns = [
        {
          title: '类别',
          dataIndex: 'fee_name',
          key:'fee_name',
          width:'400px',
          render:(text)=>{return<div style={{textAlign:'left',marginLeft:'130px'}}>{text}</div>}
        },
        {
          title: '上一年人均标准（实际）',
          dataIndex: 'up_year_ps',
          key:'up_year_ps',
          render:(text)=><MoneyComponent text={text}/>
        },
        {
          title: '今年人均标准（预算）',
          dataIndex: 'year_ps',
          key:'year_ps',
          render:(text)=><MoneyComponent text={text}/>
        },
      ];
    }else{
      columns = [
        {
          title: '类别',
          dataIndex: 'fee_name',
          key:'fee_name',
          width:'400px',
          render:(text)=>{return<div style={{textAlign:'left',marginLeft:'130px'}}>{text}</div>}
        },
        {
          title: '上一年人均标准（实际）',
          dataIndex: 'up_year_ps',
          key:'up_year_ps',
          render:(text)=><MoneyComponent text={text}/>
        },
        {
          title: '今年人均标准（预算）',
          dataIndex: 'year_ps',
          key:'year_ps',
          render:(text)=><MoneyComponent text={text}/>
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key:'operation',
          render:(text,record)=>operation(text,record,this,isSelect)
        }
      ];
    }
    return (
      <Spin tip="Loading..." spinning={loading}>
      <div className={Style.wrap}>
        <div style={{textAlign: 'left'}}>
          部门/OU：
          <Select showSearch style={{ width: 200}}  value={this.state.ou} onSelect={this.selectOu} >
            {ouList1}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          年份：
          <Select showSearch style={{ width: 160}}  value={this.state.shareStateYear} onSelect={this.selectYear}>
            <Option value={ (new Date().getFullYear()-1).toString() }>{ new Date().getFullYear()-1 }</Option>
            <Option value={ new Date().getFullYear().toString() }>{ new Date().getFullYear() }</Option>
            <Option value={ (new Date().getFullYear()+1).toString() } disabled>{ new Date().getFullYear()+1 }</Option>
          </Select>
          {
            rightControl(config.publicShareState,this.props.rightData) ?
              <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Popconfirm title={text3} onConfirm={this.generateData} okText="确定" cancelText="取消">
                    <Button type="primary" disabled={stateName==='待审核'||stateName=='待生成'?false:true}>生成</Button>
                  </Popconfirm>
                </span>
              :
              null
          }
          {
            rightControl(config.publicShareState,this.props.rightData) ?
              stateName === '已发布' ?
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Popconfirm title={text1} onConfirm={this.publicData} okText="确定" cancelText="取消">
                    <Button disabled>发布</Button>
                  </Popconfirm>
                </span>
                :
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Popconfirm title={text1} onConfirm={this.publicData} okText="确定" cancelText="取消">
                    <Button type="primary">发布</Button>
                  </Popconfirm>
                </span>
              :
              null
          }
          {
            rightControl(config.publicShareState,this.props.rightData) ?
              stateName === '已发布' ?
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Popconfirm title={text2} onConfirm={this.UnPublicData} okText="确定" cancelText="取消">
                   <Button type="primary">撤销</Button>
                  </Popconfirm>
                </span>
                :
                <span style={{display:'inline-block',marginLeft:'10px'}}>
                  <Popconfirm title={text2} onConfirm={this.UnPublicData} okText="确定" cancelText="取消">
                    <Button disabled>撤销</Button>
                  </Popconfirm>
                </span>
              :
              null
          }
          {
            list.length !== 0 ?
              <span style={{display:'inline-block',marginLeft:'10px'}}>
                <Button type="primary" onClick={this.expExl}>导出</Button>
              </span>
              :
              <span style={{display:'inline-block',marginLeft:'10px'}}>
                <Button disabled onClick={this.expExl}>导出</Button>
              </span>
          }
        </div>
        <div style={{marginTop:'10px'}}>
          {
            isSelect === true ?
              list.length === 0 ?
                <span style={{float:'left'}}><strong>状态：</strong><span style={{color:'red'}}>--</span></span>
                :
                <span style={{float:'left'}}><strong>状态：</strong><span style={{color:'red'}}>已发布</span></span>
              :
              stateName === '已发布' ?
                <span style={{float:'left'}}><strong>状态：</strong><span style={{color:'red'}}>{stateName}</span></span>
                :
                <span style={{float:'left'}}><strong>状态：</strong><span style={{color:'blue'}}>{stateName}</span></span>
          }
          <div style={{textAlign:'right'}}>金额单位：元</div>
        </div>
        {
          isSelect === true && stateName ==='待审核' ?
            null
            :
            <div id="table1" style={{marginTop:'10px'}}>
              <Table columns={columns}
                     dataSource={list}
                     pagination={false}
                     className={styles.financeTable}
              />
            </div>
        }
        <ShareStateCrl ref='shareStateCrl' yearPsCrl = {this.yearPsCrl} ou={ ou } shareStateYear={ shareStateYear }/>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {
  const { list,ouList,stateName,rightData } = state.projCostShareState;
  return {
    loading: state.loading.models.projCostShareState,
    list,
    ouList,
    stateName,
    rightData
  };
}

export default connect(mapStateToProps)(projCostShareState);
