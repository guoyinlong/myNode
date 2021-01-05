/**
 * 作者：翟金亭
 * 创建日期：2019-11-05
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：人工成本管理：研发项目人工成本明细表-按院、按月、按项目组查询、导出
 */
import React, { Component } from 'react';
import { connect } from "dva";
import Cookie from 'js-cookie';
import moment from 'moment';
import tableStyle from './table.less';
import styles from './costmainten.less';
import exportCost from './exportCost.css';
import { Select, DatePicker, Row, Col, Button, Table, message } from 'antd';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import watermark from 'watermark-dom';
import { routerRedux } from "dva/router";

import ExportJsonExcel from 'js-export-excel'


class ExportCostForHrDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      OUID: Cookie.get("OUID"),
      proj_code: 'select',
      yearMonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1),
      //导出、生成控制
      export_flag: false,
    };
  };
  componentDidMount = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    let waterName = Cookie.get("username") + ' ' + `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : ` ${date}`}  ${hour}:${minutes}:${seconds}`
    watermark.load({ watermark_txt: waterName });
    const { codeVerify } = this.props;
    const { rand_code } = this.props;
    console.log('costVerifyRouter', codeVerify)
    console.log('rand_code', rand_code)

    if (codeVerify != rand_code || codeVerify == undefined || codeVerify == null || codeVerify == '') {
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify',
      }));
    }
  }
  // 查询
  exportCostQuery = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exportCostModel/costProjDetailQuery',
      formData: item
    });
  }

  // 生成
  exportGenerateCost = (item) => {
    const { dispatch } = this.props;
    let yearMonth = item.arg_year + '-' + item.arg_month;

    if (!yearMonth || yearMonth === '') {
      message.error("请选择要生成的年月");
    }
    else {
      dispatch({
        type: 'exportCostModel/generateCostQuery',
        formData: {
          'arg_ou_id': item.arg_ou_id,
          'arg_year_month': item.arg_year + '-' + item.arg_month,
        }
      });
    }
  }

  // 改变年月
  onChangeDatePicker = (dateString) => {
    const { OUID } = this.state;
    this.setState({
      yearMonth: dateString
    });
    let formData = {
      'arg_year': new Date(dateString).getFullYear(),
      'arg_month': (new Date(dateString).getMonth() + 1 < 10 ? '0' + (new Date(dateString).getMonth() + 1) : new Date(dateString).getMonth() + 1),
      'arg_ou_id': OUID,
    }
    this.exportGenerateCost(formData);
  };

  // 改变项目名称
  handleProjNameChange = (value) => {
    const { OUID, yearMonth } = this.state;
    this.setState({
      proj_code: value,
    });
    let formData = {
      'arg_ou_id': OUID,
      'arg_year_month': new Date(yearMonth).getFullYear() + '-' + (new Date(yearMonth).getMonth() + 1 < 10 ? '0' + (new Date(yearMonth).getMonth() + 1) : new Date(yearMonth).getMonth() + 1),
      'arg_proj_code': value
    }
    this.exportCostQuery(formData);
  };


  downloadExcel = () => {
    const costDteailAllData = this.props.costDteailAllData;
    let { OU } = this.state;
    let yearMonth = this.state.yearMonth;

    var option = {
      fileName: '',
      datas: []
    };
    let dataTable = [];

    if (costDteailAllData.length !== 0) {
      costDteailAllData.map((i, index) => {
        let CostRatioList = JSON.parse(i.cost_ratio_list);
        CostRatioList.map((ii, indexs) => {
          ii.key = index + '-' + indexs;
        });
        i.CostRatioList = CostRatioList;
      })
    }

    option.fileName = '研发项目人工成本明细表-' + OU + '(' + new Date(yearMonth).getFullYear() + '年' + (new Date(yearMonth).getMonth() + 1) + '月）';

    // for (let i = 0; i < costDteailAllData.length; i++) {
    //   let dataTable_temp = []
    //   for (let j = 0; j < costDteailAllData[i].CostRatioList.length; j++) {
    //     let obj = {}
    //     if (j === costDteailAllData[i].CostRatioList.length - 1) {
    //       obj = {
    //         '序号': '',
    //         '批复研发项目名称': '',
    //         'ERP系统项目名称': '',
    //         '项目编码': '',
    //         '项目成员数量': costDteailAllData[i].CostRatioList.length - 1,
    //         '员工编号': costDteailAllData[i].CostRatioList[j].user_id,
    //         '项目组人员': costDteailAllData[i].CostRatioList[j].user_name,
    //         '工时占比': costDteailAllData[i].CostRatioList[j].ratio,
    //         '部门': costDteailAllData[i].CostRatioList[j].dept_name,
    //         '工资总额': costDteailAllData[i].CostRatioList[j].total_sum,
    //         '养老保险': costDteailAllData[i].CostRatioList[j].shbx_yalbx,
    //         '医疗保险': costDteailAllData[i].CostRatioList[j].shbx_yilbx,
    //         '失业保险': costDteailAllData[i].CostRatioList[j].shbx_syebx,
    //         '工伤保险': costDteailAllData[i].CostRatioList[j].shbx_gsbx,
    //         '生育保险': costDteailAllData[i].CostRatioList[j].shbx_syubx,
    //         '补充医疗保险': costDteailAllData[i].CostRatioList[j].shbx_bcyilbx,
    //         '企业年金': costDteailAllData[i].CostRatioList[j].shbx_qynj,
    //         '补充养老保险': costDteailAllData[i].CostRatioList[j].shbx_bcyalbx,
    //         '其他社会保险': costDteailAllData[i].CostRatioList[j].shbx_qtbx,
    //         '住房公积金': costDteailAllData[i].CostRatioList[j].zf_gjj,
    //         '防暑降温补贴': costDteailAllData[i].CostRatioList[j].zgfl_fsjw,
    //         '供暖费补贴': costDteailAllData[i].CostRatioList[j].zgfl_gnf,
    //         '独生子女费': costDteailAllData[i].CostRatioList[j].zgfl_dszn,
    //         '医药费用(体检费)': costDteailAllData[i].CostRatioList[j].zgfl_ylfy,
    //         '困难补助': costDteailAllData[i].CostRatioList[j].zgfl_knbz,
    //         '加班餐费': costDteailAllData[i].CostRatioList[j].zgfl_jbcf,
    //         '其他': costDteailAllData[i].CostRatioList[j].zgfl_qt,
    //         '员工管理费': costDteailAllData[i].CostRatioList[j].qtcb_yggl,
    //         '劳动保护费': costDteailAllData[i].CostRatioList[j].qtcb_ldbh,
    //         '其 他': costDteailAllData[i].CostRatioList[j].qtcb_qt,
    //         '合计': costDteailAllData[i].CostRatioList[j].total_fee,
    //       }
    //     } else {
    //       obj = {
    //         '序号': j + 1,
    //         '批复研发项目名称': costDteailAllData[i].team_name,
    //         'ERP系统项目名称': costDteailAllData[i].team_name,
    //         '项目编码': costDteailAllData[i].team_code,
    //         '项目成员数量': costDteailAllData[i].CostRatioList.length - 1,
    //         '员工编号': costDteailAllData[i].CostRatioList[j].user_id,
    //         '项目组人员': costDteailAllData[i].CostRatioList[j].user_name,
    //         '工时占比': costDteailAllData[i].CostRatioList[j].ratio,
    //         '部门': costDteailAllData[i].CostRatioList[j].dept_name,
    //         '工资总额': costDteailAllData[i].CostRatioList[j].total_sum,
    //         '养老保险': costDteailAllData[i].CostRatioList[j].shbx_yalbx,
    //         '医疗保险': costDteailAllData[i].CostRatioList[j].shbx_yilbx,
    //         '失业保险': costDteailAllData[i].CostRatioList[j].shbx_syebx,
    //         '工伤保险': costDteailAllData[i].CostRatioList[j].shbx_gsbx,
    //         '生育保险': costDteailAllData[i].CostRatioList[j].shbx_syubx,
    //         '补充医疗保险': costDteailAllData[i].CostRatioList[j].shbx_bcyilbx,
    //         '企业年金': costDteailAllData[i].CostRatioList[j].shbx_qynj,
    //         '补充养老保险': costDteailAllData[i].CostRatioList[j].shbx_bcyalbx,
    //         '其他社会保险': costDteailAllData[i].CostRatioList[j].shbx_qtbx,
    //         '住房公积金': costDteailAllData[i].CostRatioList[j].zf_gjj,
    //         '防暑降温补贴': costDteailAllData[i].CostRatioList[j].zgfl_fsjw,
    //         '供暖费补贴': costDteailAllData[i].CostRatioList[j].zgfl_gnf,
    //         '独生子女费': costDteailAllData[i].CostRatioList[j].zgfl_dszn,
    //         '医药费用(体检费)': costDteailAllData[i].CostRatioList[j].zgfl_ylfy,
    //         '困难补助': costDteailAllData[i].CostRatioList[j].zgfl_knbz,
    //         '加班餐费': costDteailAllData[i].CostRatioList[j].zgfl_jbcf,
    //         '其他': costDteailAllData[i].CostRatioList[j].zgfl_qt,
    //         '员工管理费': costDteailAllData[i].CostRatioList[j].qtcb_yggl,
    //         '劳动保护费': costDteailAllData[i].CostRatioList[j].qtcb_ldbh,
    //         '其 他': costDteailAllData[i].CostRatioList[j].qtcb_qt,
    //         '合计': costDteailAllData[i].CostRatioList[j].total_fee,
    //       }
    //     }

    //     dataTable_temp.push(obj);
    //   }
    //   dataTable[i] = dataTable_temp;
    //   let temp_datas = {
    //     sheetData: dataTable[i],
    //     sheetName: costDteailAllData[i].team_name,
    //     sheetFilter: ['序号', '批复研发项目名称', 'ERP系统项目名称', '项目编码', '项目成员数量', '员工编号', '项目组人员', '工时占比', '部门', '工资总额', '养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '补充医疗保险', '企业年金', '补充养老保险', '其他社会保险', '住房公积金', '防暑降温补贴', '供暖费补贴', '独生子女费', '医药费用(体检费)', '困难补助', '加班餐费', '其他', '员工管理费', '劳动保护费', '其他', '合计',],
    //     sheetHeader: ['序号', '批复研发项目名称', 'ERP系统项目名称', '项目编码', '项目成员数量', '员工编号', '项目组人员', '工时占比', '部门', '工资总额', '养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '补充医疗保险', '企业年金', '补充养老保险', '其他社会保险', '住房公积金', '防暑降温补贴', '供暖费补贴', '独生子女费', '医药费用(体检费)', '困难补助', '加班餐费', '其他', '员工管理费', '劳动保护费', '其他', '合计',],
    //   };
    //   option.datas.push(temp_datas);
    // }
    let dataTable_temp = [];
    for (let i = 0; i < costDteailAllData.length; i++) {
      // 每个详情的长度，用以找到最后一条总计数据；
      let j = costDteailAllData[i].CostRatioList.length - 1;
      let obj = {}
      obj = {
        '序号': i + 1,
        '批复研发项目名称': costDteailAllData[i].team_name,
        'ERP系统项目名称': costDteailAllData[i].team_name,
        '项目编码': costDteailAllData[i].team_code,
        '项目成员数量': costDteailAllData[i].CostRatioList.length - 1,
        '工时占比': costDteailAllData[i].CostRatioList[j].ratio,
        '工资总额': costDteailAllData[i].CostRatioList[j].total_sum,
        '养老保险': costDteailAllData[i].CostRatioList[j].shbx_yalbx,
        '医疗保险': costDteailAllData[i].CostRatioList[j].shbx_yilbx,
        '失业保险': costDteailAllData[i].CostRatioList[j].shbx_syebx,
        '工伤保险': costDteailAllData[i].CostRatioList[j].shbx_gsbx,
        '生育保险': costDteailAllData[i].CostRatioList[j].shbx_syubx,
        '补充医疗保险': costDteailAllData[i].CostRatioList[j].shbx_bcyilbx,
        '企业年金': costDteailAllData[i].CostRatioList[j].shbx_qynj,
        '补充养老保险': costDteailAllData[i].CostRatioList[j].shbx_bcyalbx,
        '其他社会保险': costDteailAllData[i].CostRatioList[j].shbx_qtbx,
        '住房公积金': costDteailAllData[i].CostRatioList[j].zf_gjj,
        '防暑降温补贴': costDteailAllData[i].CostRatioList[j].zgfl_fsjw,
        '供暖费补贴': costDteailAllData[i].CostRatioList[j].zgfl_gnf,
        '独生子女费': costDteailAllData[i].CostRatioList[j].zgfl_dszn,
        '医药费用(体检费)': costDteailAllData[i].CostRatioList[j].zgfl_ylfy,
        '困难补助': costDteailAllData[i].CostRatioList[j].zgfl_knbz,
        '加班餐费': costDteailAllData[i].CostRatioList[j].zgfl_jbcf,
        '其他': costDteailAllData[i].CostRatioList[j].zgfl_qt,
        '员工管理费': costDteailAllData[i].CostRatioList[j].qtcb_yggl,
        '劳动保护费': costDteailAllData[i].CostRatioList[j].qtcb_ldbh,
        '其 他': costDteailAllData[i].CostRatioList[j].qtcb_qt,
        '合计': costDteailAllData[i].CostRatioList[j].total_fee,
      }
      dataTable_temp.push(obj);
    }
    dataTable = dataTable_temp;
    let temp_datas = {
      sheetData: dataTable,
      sheetName: '研发项目人工成本明细表-' + OU + '(' + new Date(yearMonth).getFullYear() + '年' + (new Date(yearMonth).getMonth() + 1) + '月）',
      // sheetFilter: ['序号', '批复研发项目名称', 'ERP系统项目名称', '项目编码', '项目成员数量', '员工编号', '项目组人员', '工时占比', '部门', '工资总额', '养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '补充医疗保险', '企业年金', '补充养老保险', '其他社会保险', '住房公积金', '防暑降温补贴', '供暖费补贴', '独生子女费', '医药费用(体检费)', '困难补助', '加班餐费', '其他', '员工管理费', '劳动保护费', '其他', '合计',],
      sheetFilter: ['序号', '批复研发项目名称', 'ERP系统项目名称', '项目编码', '项目成员数量', '工时占比', '工资总额', '养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '补充医疗保险', '企业年金', '补充养老保险', '其他社会保险', '住房公积金', '防暑降温补贴', '供暖费补贴', '独生子女费', '医药费用(体检费)', '困难补助', '加班餐费', '其他', '员工管理费', '劳动保护费', '其他', '合计',],
      // sheetHeader: ['序号', '批复研发项目名称', 'ERP系统项目名称', '项目编码', '项目成员数量', '员工编号', '项目组人员', '工时占比', '部门', '工资总额', '养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '补充医疗保险', '企业年金', '补充养老保险', '其他社会保险', '住房公积金', '防暑降温补贴', '供暖费补贴', '独生子女费', '医药费用(体检费)', '困难补助', '加班餐费', '其他', '员工管理费', '劳动保护费', '其他', '合计',],
      sheetHeader: ['序号', '批复研发项目名称', 'ERP系统项目名称', '项目编码', '项目成员数量', '工时占比', '工资总额', '养老保险', '医疗保险', '失业保险', '工伤保险', '生育保险', '补充医疗保险', '企业年金', '补充养老保险', '其他社会保险', '住房公积金', '防暑降温补贴', '供暖费补贴', '独生子女费', '医药费用(体检费)', '困难补助', '加班餐费', '其他', '员工管理费', '劳动保护费', '其他', '合计',],
    };
    option.datas.push(temp_datas);
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }
  //多sheet页导出测试 end


  // 限制月份的选择
  disabledDate = (value) => {
    return value && value.valueOf() > moment().endOf('day')
  };

  columnList_a = [
    {
      title: '员工编号',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
      fixed: 'left'
    },
    {
      title: '项目组人员',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '工时占比',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 100,
      fixed: 'left'
    },
    {
      title: '部门',
      dataIndex: 'dept_name',
      key: 'dept_name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '工资总额',
      dataIndex: 'total_sum',
      key: 'total_sum',
      width: 100,
      fixed: 'left',
    },
    {
      title: '社会保险费',
      children: [
        {
          title: '养老保险',
          dataIndex: 'shbx_yalbx',
          width: 100,
        },
        {
          title: '医疗保险',
          dataIndex: 'shbx_yilbx',
          width: 100,
        },
        {
          title: '失业保险',
          dataIndex: 'shbx_syebx',
          width: 100,
        },
        {
          title: '工伤保险',
          dataIndex: 'shbx_gsbx',
          width: 100,
        },
        {
          title: '生育保险',
          dataIndex: 'shbx_syubx',
          width: 100,
        },
        {
          title: '补充医疗保险',
          dataIndex: 'shbx_bcyilbx',
          width: 150,
        },
        {
          title: '企业年金',
          dataIndex: 'shbx_qynj',
          width: 100,
        },
        {
          title: '补充养老保险',
          dataIndex: 'shbx_bcyalbx',
          width: 150,
        },
        {
          title: '其他社会保险',
          dataIndex: 'shbx_qtbx',
          width: 150,
        },
      ]
    },
    {
      title: '住房公积金',
      children: [
        {
          title: '住房公积金',
          dataIndex: 'zf_gjj',
          width: 200,
        },
      ]
    },
    {
      title: '职工福利费',
      children: [
        {
          title: '防暑降温补贴',
          dataIndex: 'zgfl_fsjw',
          width: 150,
        },
        {
          title: '供暖费补贴',
          dataIndex: 'zgfl_gnf',
          width: 150,
        },
        {
          title: '独生子女费',
          dataIndex: 'zgfl_dszn',
          width: 150,
        },
        {
          title: '医药费用(体检费)',
          dataIndex: 'zgfl_ylfy',
          width: 200,
        },
        {
          title: '困难补助',
          dataIndex: 'zgfl_knbz',
          width: 100,
        },
        {
          title: '加班餐费',
          dataIndex: 'zgfl_jbcf',
          width: 100,
        },
        {
          title: '其他',
          dataIndex: 'zgfl_qt',
          width: 100,
        },
      ]
    },
    {
      title: '其他人工成本',
      children: [
        {
          title: '员工管理费',
          dataIndex: 'qtcb_yggl',
          width: 150,
        },
        {
          title: '劳动保护费',
          dataIndex: 'qtcb_ldbh',
          width: 150,
        },
        {
          title: '其他',
          dataIndex: 'qtcb_qt',
          width: 200,
        },
      ]
    },
    {
      title: '合计',
      dataIndex: 'total_fee',
      width: 100,
    },
  ];

  render() {
    const { loading, projInfoPersonNum, costDteailData, projectTeamList, costDteailAllData } = this.props;
    let projNameList = [];
    if (projectTeamList) {
      if (projectTeamList.length > 0) {
        projNameList = projectTeamList.map((item, index) =>
          <Option key={index} value={item.proj_code} >{item.proj_name}</Option>
        );
      }
    }

    return (
      <div className={exportCost.container}>
        {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}

        <span>OU：
                <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px' }}>
            {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
          </Select>
        </span>

        <span style={{ display: 'inline-block', margin: '0 20px' }}>
          月份：
                <MonthPicker onChange={this.onChangeDatePicker} disabledDate={this.disabledDate} value={moment(this.state.yearMonth ? this.state.yearMonth : this.props.lastDate, 'YYYY-MM')} allowClear={false} />
        </span>

        <span style={{ display: 'inline-block', margin: '0 20px' }}>
          <Button type="primary" disabled={costDteailAllData && costDteailAllData[0] ? false : true} onClick={this.downloadExcel}>导出全院数据</Button>&nbsp;&nbsp;
            </span>

        <span style={{ display: 'inline-block', marginTop: '10px' }}>选择项目组查看详细：
                <Select showSearch
            optionFilterProp="children"
            onChange={this.handleProjNameChange}
            dropdownMatchSelectWidth={false}
            value={this.state.proj_code}
            style={{ minWidth: '400px' }}
            disabled={projectTeamList[0] ? false : true}
          >
            {
              projectTeamList[0] ?
                <Option value='select'>选择项目组</Option>
                :
                <Option value='select'>该账期各项目组无数据</Option>
            }
            {projNameList}
          </Select>
        </span>

        {/*查询条件结束*/}
        {costDteailData && costDteailData[0] && projInfoPersonNum && projInfoPersonNum[0] ?
          /*查询结果结束*/
          <div style={{ marginTop: '20px' }}>
            {/*项目信息开始*/}
            <div>
              <br />
              <div>
                <h3 style={{ textAlign: 'left', paddingLeft: '15px', fontWeight: '600' }}>批复研发项目名称：{costDteailData[0].team_name}</h3>
                <br />
                <h3 style={{ textAlign: 'left', paddingLeft: '15px', fontWeight: '600' }}>ERP系统项目名称：{costDteailData[0].team_name}</h3>
              </div>
              <Row style={{ textAlign: 'left', paddingLeft: '15px', marginTop: '10px' }}>
                <Col span={7}>
                  <b>项目编码：</b>{costDteailData[0].team_code}
                </Col>

                <Col span={8}>
                  <b>项目成员数量(人)：</b>{projInfoPersonNum[0].PROJ_PERSON_NUM}
                </Col>
              </Row>
            </div>

            {/*项目组信息结束*/}
            <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ marginTop: '15px' }}>
              <Table columns={this.columnList_a} dataSource={costDteailData} scroll={{ x: 3400, y: 400 }} pagination={false} loading={loading} />
            </div>

            <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ display: "none" }}>
              <Table columns={this.columnList_a} dataSource={costDteailData} pagination={false} />
            </div>

          </div>
          /*查询结果结束*/
          :
          <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ marginTop: '15px' }}>
            <Table columns={this.columnList_a} dataSource={costDteailData} scroll={{ x: 3400, y: 400 }} pagination={false} loading={loading} />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.exportCostModel,
    ...state.exportCostModel
  };
}

export default connect(mapStateToProps)(ExportCostForHrDetail);
