/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现人员变动统计功能
 */

import React from 'react';
import {connect} from 'dva';
import {Table, Button, Select, DatePicker} from 'antd';
import styles from './personnelInfo.less';
import * as hrService from '../../../services/hr/hrService.js';
import Cookie from 'js-cookie';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const {MonthPicker} = DatePicker;
//const dateFormat = 'YYYY-MM';
const Option = Select.Option;
const auth_tenantid = Cookie.get('tenantid');

let params = {};//生成数据和确认数据传参用
// let defaultDate;//默认的年月
// //获取当前月的上个月，作为默认显示年月
// let myDate = new Date();
// let year_last = myDate.getFullYear();//当年月上个月所在年份
// let month_last = myDate.getMonth();//当前月的上个月
// if(month_last === 0){
//   month_last = 12;
//   year_last = year_last-1;
// }
// if(month_last < 10){
//   month_last = '0' + month_last;
// }
// defaultDate = year_last.toString() + '-' + month_last.toString();

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-19
 * 功能：实现人员变动统计功能
 */
class personnelInfo extends React.Component{
  constructor(props){
    super(props);
    const auth_ou = Cookie.get('OU');
    this.state = {
      ou:auth_ou,
      auth_ou:auth_ou,
      // year:year_last,
      // month:month_last,
      year:null,
      month:null,
      //标记按钮显示或者隐藏
      flag_search:false, //查询按钮
      flag_create:false, //生成按钮
      flag_commit:false, //确认按钮
      flag_cancel:false, //撤消确认按钮
      flag:false//点击查询按钮false  点击生成按钮true
    }
  }

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：切换OU
   * @param value 选中当前ou值
   */
  handleChange=(value)=> {
    this.setState({
      ou:value,
      flag_create:false,
      flag_commit:false,
      flag_cancel:false
    },()=>{
      if(value === this.state.auth_ou && this.state.month){
        this.ifShow();
      }
    });
    const {dispatch} = this.props;
    dispatch({
      type:'hrPersonnelInfo/init',
      list:[]
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：切换月份
   * @param date 时间对象
   * @param dateString 时间字符串格式
   */
  changeMonth=(date, dateString)=> {
    this.setState({
      year:dateString.substr(0,4),
      month:dateString.substr(5),
      flag_create:false,
      flag_commit:false,
      flag_cancel:false
    },()=>{
      if(this.state.ou === this.state.auth_ou && this.state.month){
        this.ifShow();
      }
    });
    const {dispatch} = this.props;
    dispatch({
      type:'hrPersonnelInfo/init'
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：查询数据
   */
  searchData=()=> {
    this.setState({
      flag:false
    });
    let arg_params = {
      "arg_tenantid": auth_tenantid,
      "arg_ou":this.state.ou,
      "arg_year": this.state.year,
      "arg_month": this.state.month
    };
    const {dispatch} = this.props;
    // dispatch({
    //   type:'hrPersonnelInfo/init',
    // });
    if(this.state.ou && this.state.year && this.state.month){
      dispatch({
        type:'hrPersonnelInfo/personnelInfoSearch',
        arg_param:arg_params,
        callback:()=>{//先隐藏确认数据和撤消确认按钮，待查询结果出来后再判断。
          this.setState({
            flag_commit:false,
            flag_cancel:false,
            flag:false
          });
        },
      })
    }
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：生成数据
   */
  createData=()=> {
    this.setState({
      flag:true
    });
    let year = parseInt(this.state.year)?parseInt(this.state.year):0;
    let month = parseInt(this.state.month)?parseInt(this.state.month):0;
    let year_last = year;
    let month_last = month-1;
    if(month_last === 0){
        month_last = 12;
        year_last = year_last-1;
    }
    let start_date = '';
    let end_date = '';
    let new_date = new Date(year,month,1); // 获取月第一天
    let endDay = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取月最后一天
    if(year && month){
      start_date = year.toString() + '-' + month.toString() + '-01';
      end_date = year.toString() + '-' + month.toString() + '-' + endDay.toString();
    }
    let arg_params1 = { //给判断是否可以执行生成数据服务传参（财务是否已经使用数据），如果财务已经使用该月的数据则不允许再次生成数据
      "arg_tenantid": auth_tenantid,
      "argou":this.state.ou,
      "argyear": year,
      "argmonth": month
    };
    const auth_userid = Cookie.get('userid');
    params = {
      "arg_tenantid": auth_tenantid,
      "arg_tenant_id": auth_tenantid,
      "arg_userid": auth_userid,
      "arg_ou":this.state.ou,
      "arg_year": year, //统计年份
      "arg_month": month, //统计月份
      "arg_year_last": year_last, //统计年月的上个月年份
      "arg_month_last": month_last,//统计年月的上个月月份
      "arg_start_date": start_date,//统计开始日期
      "arg_end_date": end_date//统计结束日期
    };
    const {dispatch} = this.props;
    if(this.state.ou && year && month){
      dispatch({
        type:'hrPersonnelInfo/personnelInfoCreate',
        arg_param1:arg_params1,
        arg_param2:params
      })
    }
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：确认数据
   */
  commitData=()=> {
    const {dispatch} = this.props;
    if(this.state.ou && this.state.year && this.state.month){
      dispatch({
        type:'hrPersonnelInfo/personnelInfoCommit',
        arg_param:params
      })
    }
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：撤消确认
   */
  cancelCommit=()=> {
    let arg_params1 = { //给判断是否可以执行撤消操作的服务传参（财务是否已经使用数据）
      "arg_tenantid": auth_tenantid,
      "argou":this.state.ou,
      "argyear": this.state.year,
      "argmonth": this.state.month
    };
    const auth_userid = Cookie.get('userid');
    let arg_params2 = { //给撤消操作的服务传参
      "arg_userid": auth_userid,
      "arg_ou":this.state.ou,
      "arg_year": this.state.year,
      "arg_month": this.state.month
    };
    const {dispatch} = this.props;
    if(this.state.ou && this.state.year && this.state.month){
      dispatch({
        type:'hrPersonnelInfo/personnelInfoCancel',
        arg_param1:arg_params1,
        arg_param2:arg_params2
      })
    }
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：判断按钮是否显示
   */
   ifShow=async()=> {
    let arg_params = {
      //给判断是否可以执行撤消操作的服务传参（财务是否已经使用数据）RetCode == 1表示未使用。
      "arg_tenantid": auth_tenantid,
      "argou":this.state.ou,
      "argyear": this.state.year,
      "argmonth": this.state.month
    };
    const {RetCode} = await(hrService.judge(arg_params));
    if(RetCode === '1'){
      //财务尚未使用数据
      // this.setState({
      //   flag_create:true,
      //   // flag_commit:true,
      //   // flag_cancel:true
      // });
      if(this.props.list.length > 1 && this.state.flag){
        this.setState({
          flag_create:true,
          flag_commit:true,
          flag_cancel:true
        });
      }
      else{
        this.setState({
          flag_create:true,
          flag_commit:false,
          flag_cancel:false,
          flag:false
        });
      }
    }
    // else{
    //   //财务已使用数据
    //   this.setState({
    //     flag_create: false,
    //     flag_commit: false,
    //     flag_cancel: false
    //   });
    // }
  };
  columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '部门名称',
      dataIndex: 'deptname',
      key: 'deptname'
    },
    {
      title: '上月底人数',
      dataIndex: 'up_month_num',
      key: 'up_month_num'
    },
    {
      title: '本月人数',
      children: [
        {
          title: '部门间调动人数(+/-)',
          dataIndex: 'move_per_num',
          key: 'move_per_num'
        },
        {
          title: '新增人数',
          dataIndex: 'add_per_num',
          key: 'add_per_num'
        },
        {
          title: '离职人数',
          dataIndex: 'del_per_num',
          key: 'del_per_num'
        },
        {
          title: '月底人数',
          dataIndex: 'latle_month',
          key: 'latle_month'
        }
      ]
    }
  ];
  render(){
    const {list,ouList} = this.props;
    //  返回的数据没有序号，这里为每一条记录添加一个key，从1开始s
    if(list.length){
      list.map((i,index)=>{
        i.key=index + 1;
        if(i.key === list.length){ //最后一行合计的序号不显示
          i.key = '';
        }
      })
    }
    const OptionList = ouList.map((item,index) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    function disabledDate(current) {
      // 不能选择当前月之后的月份
      return current && current.valueOf() > Date.now();
    }
    //控制查询按钮的显示和隐藏
    if(this.state.year){
      this.state.flag_search = true;
      //this.ifShow();
    }
    //如果在本OU下只出现查询按钮，说明财务已经使用数据，无法进行数据的生成/确认/取消操作。
    //所以，只有在点击生成按钮后才出现确认数据和取消确认按钮。
    // if(list.length >1 && this.state.flag_create && this.state.flag){
    //   this.state.flag_cancel = true;
    //   this.state.flag_commit = true;
    // }
    if(list.length >1 && this.state.flag_create){
      if(this.state.flag){
        this.state.flag_cancel = true;
        this.state.flag_commit = true;
      }
      else{
        this.state.flag_cancel = true;
        this.state.flag_commit = false;
      }
    }

    return(
      <div className={styles.hrWrap}>
        {/*<div className={styles.headerName}>人员变动管理</div>*/}
        {/*<br/>*/}
        <div style={{marginBottom:'40px'}}>
          <div style={{float:'left'}}>
            <span>组织单元：</span>
            <Select style={{width:180}}   placeholder="请选择OU" onSelect={this.handleChange} defaultValue={this.state.auth_ou}>
              {OptionList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;统计年月：
            <MonthPicker  className={styles.antCalendarPicker}
              /*defaultValue={moment(defaultDate,dateFormat)}*/ disabledDate={disabledDate} allowClear={false} placeholder="选择年月" onChange = {this.changeMonth}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div style={{float:'right'}}>
            {this.state.flag_search === true
              ?
              <Button type="primary"  style={{marginRight:'8px'}} title="查询已确认数据" onClick={()=>this.searchData()}>查询</Button>
              : <Button disabled>查询</Button>
            }
          </div>
        </div>
        <div style={{clear:'both'}}>
          <Table columns={this.columns}
                 dataSource={list}
                 className={styles.hrTable}
                 pagination={true}
                 bordered={true}
            //scroll={{ y: 300 }}
            //footer={() => 'Footer'}
          />
        </div>
        <div style={{textAlign:'right'}}>
          <br/>
          {this.state.flag_create === true
            ?
            <Button type="primary"  onClick={()=>this.createData()}>生成</Button>
            :<Button disabled>生成</Button>
          }&nbsp;
          {this.state.flag_commit === true
            ?
            <Button type="primary"   onClick={()=>this.commitData()}>确认</Button>
            :<Button disabled>确认</Button>
          }&nbsp;
          {this.state.flag_cancel === true
            ?
            <Button type="primary" style={{marginRight:'8px'}}  onClick={()=>this.cancelCommit()}>撤消</Button>
            :<Button disabled>撤消</Button>
          }
        </div>
      </div>
    );
  } //render
}//class

function mapStateToProps (state) {
  const { list, query,ouList} = state.hrPersonnelInfo;
  return {
    loading: state.loading.models.hrPersonnelInfo,
    list,
    query,
    ouList
  };
}

export default connect(mapStateToProps)(personnelInfo);
