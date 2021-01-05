/**
 * 作者：郝锐
 * 日期：2017-11-11
 * 邮件：haor@itnova.com.cn
 * 文件说明：部门预算完成情况
 */
import React from "react";
import {connect} from "dva";
import Styles from '../../../../components/cost/cost_budget.less'
import table from '../../../../components/finance/table.less'

import {Select, DatePicker, Table, Modal, Spin, Button} from "antd";
import moment from 'moment';
import 'moment/locale/zh-cn';

import exportExl from '../../../../components/commonApp/exportExl.js'

moment.locale('zh-cn');
const {Option} = Select
const {MonthPicker} = DatePicker
const statisticalType = [
  {name: '年统计', value: '2'},
  {name: '月统计', value: '1'},
  {name: '项目至今', value: '3'},
  {name: '自定义', value: '4'}
]


class FeptFullCostMgt extends React.Component {
  state = {
    visible: false,
    modalProps: {},
    outerWidther: 1600,
    table_height: window.innerHeight-300
  }

  modalColums = [
    {
      title: 'ou',
      dataIndex: 'ou'
    },
    {
      title: '部门',
      dataIndex: 'dept_name'
    },
    {
      title: '差旅费',
      dataIndex: 'travelFeeAll'
    },
    {
      title: '差旅费_资本化',
      dataIndex: 'travelFeeCapital'
    },
    {
      title: '差旅费_费用化',
      dataIndex: 'travelFee'
    }
  ]

  showModal = (row) => {
    this.setState({
      visible: true,
      modalProps: row
    });
    this.props.dispatch({
      type: 'FeptFullCostMgt/proj_budget_going_multiproj_dept_detail_query',
      query: {
        arg_start_year: this.props.start_year,
        arg_start_month: this.props.start_month,
        arg_end_year: this.props.end_year,
        arg_end_month: this.props.end_month,
        arg_proj_code: row.proj_code
      }
    })
  }
  hideModal = () => {
    this.setState({
      visible: false,
      modalProps: {}
    });
  }
  startDisabledDate = (current) => {
    return current && current.valueOf() > new Date(`${this.props.end_year}-${this.props.end_month}-01 00:00:00`).valueOf();
  }
  endDisabledDate = (current) => {
    return current && current.valueOf() < new Date(`${this.props.start_year}-${this.props.start_month}-01 00:00:00`).valueOf() || current.valueOf() > new Date(`${this.props.total_year}-${this.props.total_month}-01 00:00:00`)
  }
  endTimeChange = (time, timeString) => {
    this.props.dispatch({
      type: 'FeptFullCostMgt/endTimeChange',
      current: timeString
    })
  }
  startTimeChange = (time, timeString) => {
    this.props.dispatch({
      type: 'FeptFullCostMgt/startTimeChange',
      current: timeString
    })
  }

  componentDidMount() {
    this.setState({
      outerWidther: this.myWrap && this.myWrap.offsetWidth
    })
    window.onresize = (event) => {
      this.setState({
        outerWidther: this.myWrap && this.myWrap.offsetWidth,
        table_height: event.target.innerHeight-300
      })

    }
  }
  exportExcel =()=>{
    const tableId = document.querySelector('#exportTable table');
    exportExl()(tableId, '部门预算完成情况');
  }
  render() {
    let columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        fixed: this.state.outerWidther > 1690 ? null : 'left',
        render: (index) => <div>
          {index + 1}
        </div>
      },
      {
        fixed: this.state.outerWidther > 1690 ? null : 'left',
        align: 'left',
        title: '项目名称',
        dataIndex: 'proj_name',
        width: 200,
        render: (text, row) => <div style={{textAlign: 'left'}}><a onClick={() => {
          this.showModal(row)
        }}>{text}</a></div>
      },
      {
        title: '部门名称',
        dataIndex: 'pu_dept_name',
        width: 100,
        fixed: this.state.outerWidther > 1690 ? null : 'left',
        render:(text)=>text.split('-')[1]
      },

      {
        fixed: this.state.outerWidther > 1690 ? null : 'left',
        title: '项目编码',
        dataIndex: 'proj_code',
        width: 125,
        render: (text) =>
          <div>
            <span title={text}>{text}</span>
          </div>
      },
      {
        fixed: this.state.outerWidther > 1690 ? null : 'left',
        title: 'PMS编码',
        dataIndex: 'pms_code',
        width: 125,
        render: (text)=><div style={{textAlign: 'left'}}>{text}</div>
      },
      {
        title: '项目预算完成情况',
        children: [
          {
            title: '差旅费',
            children: [
              {
                title: '预算数',
                dataIndex: 'travelFeeAllBudget',
                width: 120
              },
              {
                title: '完成数',
                dataIndex: 'travelFeeAllReal',
                width: 120
              },
              {
                title: '预算完成率',
                dataIndex: 'travelFeeAllPerc',
                width: 120
              }
            ]
          },
          {
            title: '差旅费_费用化',
            children: [
              {
                title: '预算数',
                dataIndex: 'travelFeeBudget',
                width: 120
              },
              {
                title: '实际完成数',
                dataIndex: 'travelFeeReal',
                width: 120
              },
              {
                title: '预算完成率',
                dataIndex: 'travelFeePerc',
                width: 120
              }
            ]
          },
          {
            title: '差旅费_资本化',
            children: [
              {
                title: '预算数',
                dataIndex: 'travelFeeCapitalBudget',
                width: 120
              },
              {
                title: '实际完成数',
                dataIndex: 'travelFeeCapitalReal',
                width: 120
              },
              {
                title: '预算完成率',
                dataIndex: 'travelFeeCapitalPerc',
                width: 120
              }
            ]
          }
        ]
      }
    ]
    const {dept_list, statistical_type_code, total_month, total_year, start_year, start_month, end_year, end_month, completionOfDepartmentTravelBudget, completionOfDepartmentTravelBudgetInfo} = this.props
    completionOfDepartmentTravelBudget.length && completionOfDepartmentTravelBudget.map((item, index) => item.key = index)
    completionOfDepartmentTravelBudgetInfo.length && completionOfDepartmentTravelBudgetInfo.map((item, index) => item.key = index)
    return (
      <Spin spinning={this.props.loading || this.props.v_loading}>
        <div className={Styles.wrap} ref={(ref) => {
          this.myWrap = ref
        }}>
          {
            dept_list.length ?
              <div style={{float: 'left'}}>
                {
                  dept_list.length === 1 ?
                    <div>
                      部门：
                      <Select defaultValue={dept_list[0].dept_name} disabled style={{width: 210}}>
                        <Option value={dept_list[0].dept_name} disabled>{dept_list[0].dept_name.split('-')[1]}</Option>
                      </Select>
                    </div>
                    :
                    <div>
                      部门：
                      <Select defaultValue='all' style={{width: 210}} onSelect={(value) => {
                        this.props.dispatch({type: 'FeptFullCostMgt/deptChange', dept_name: value})
                      }}>
                        <Option key='all' value='all'>全部门</Option>
                        {
                          dept_list.map(item => <Option key={item.dept_id}
                                                        value={item.dept_name}>{item.dept_name.split('-')[1]}</Option>)
                        }
                      </Select>
                    </div>
                }
              </div>
              : null
          }
          <div style={{float: 'left', paddingLeft: 20}}>
            统计类型：
            <Select defaultValue={statistical_type_code} style={{width: 100}} onSelect={(value) => {
              this.props.dispatch({type: 'FeptFullCostMgt/statistical_type_code_change', code: value})
            }}>
              {
                statisticalType.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
              }
            </Select>
            &nbsp;&nbsp;&nbsp;
            开始时间：
            {statistical_type_code === '2' && total_year && total_month ?
              <MonthPicker defaultValue={moment(`${start_year}-${start_month}`, 'YYYY-MM')} disabled
                           placeholder="Select month" style={{width: 120}}/>
              : null
            }
            {statistical_type_code === '1' && total_year && total_month ?
              <MonthPicker defaultValue={moment(`${start_year}-${start_month}`, 'YYYY-MM')} disabled
                           placeholder="Select month" style={{width: 120}}/>
              : null
            }
            {statistical_type_code === '4' && total_year && total_month ?
              <MonthPicker defaultValue={moment(`${start_year}-${start_month}`, 'YYYY-MM')}
                           placeholder="Select month"
                           style={{width: 120}}
                           disabledDate={this.startDisabledDate}
                           onChange={this.startTimeChange}/>
              : null
            }
            {statistical_type_code === '3' && total_year && total_month ?
              <MonthPicker defaultValue={moment(`${start_year}-${start_month}`, 'YYYY-MM')} disabled
                           placeholder="Select month" style={{width: 120}}/>
              : null
            }

            &nbsp;&nbsp;&nbsp;
            结束时间：
            {
              statistical_type_code === '2' && total_year && total_month ?
                <MonthPicker defaultValue={moment(`${end_year}-${end_month}`, 'YYYY-MM')} disabled
                             placeholder="Select month" style={{width: 120}}/>
                : null
            }
            {
              statistical_type_code === '1' && total_year && total_month ?
                <MonthPicker defaultValue={moment(`${end_year}-${end_month}`, 'YYYY-MM')} disabled
                             placeholder="Select month" style={{width: 120}}/>
                : null
            }
            {
              statistical_type_code === '4' && total_year && total_month ?
                <MonthPicker defaultValue={moment(`${end_year}-${end_month}`, 'YYYY-MM')}
                             placeholder="Select month"
                             style={{width: 120}}
                             disabledDate={this.endDisabledDate}
                             onChange={this.endTimeChange}
                />
                : null
            }
            {
              statistical_type_code === '3' && total_year && total_month ?
                <MonthPicker defaultValue={moment(`${end_year}-${end_month}`, 'YYYY-MM')} disabled
                             placeholder="Select month" style={{width: 120}}/>
                : null
            }
            <Button type={'primary'} onClick={this.exportExcel} style={{marginLeft:20}}>导出</Button>
          </div>
          <div style={{clear: 'both', paddingTop: 15,height: 100}}>
            <h3 style={{marginBottom: 10, color: '#2c5381'}}>部门差旅预算总计:<span
              style={{color: '#FA7252', marginLeft: 10}}>{this.props.travelFeeAllBudget}</span></h3>
            <h3 style={{marginBottom: 10, color: '#2c5381'}}>部门差旅预算完成总计:<span
              style={{color: '#FA7252', marginLeft: 10}}>{this.props.travelFeeAllReal}</span></h3>
            <h3 style={{marginBottom: 10, color: '#2c5381'}}>部门差旅预算完成率:<span
              style={{color: '#FA7252', marginLeft: 10}}>{this.props.travelFeeAllPerc}</span><span
              style={{float: 'right'}}>单位： 元</span></h3>
          </div>

          <div className={table.financeTable_smallSize} style={{marginTop: 20}}>
            <Table columns={columns} dataSource={completionOfDepartmentTravelBudget} bordered
                   pagination={false}
                   scroll={{x: 1690, y: this.state.table_height}}/>
          </div>
          <Modal
            width={'80%'}
            title={this.state.modalProps.proj_name}
            visible={this.state.visible}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
            rowData={this.state.modalProps}
            footer={null}
          >
            <div className={table.financeTable}>
              <Table loading={this.props.modal_loading} columns={this.modalColums}
                     dataSource={completionOfDepartmentTravelBudgetInfo} bordered scroll={{x: true, y: false}}/>
            </div>
          </Modal>
        </div>
        <div id="exportTable" style={{display:'none'}}>
          <Table columns={columns} dataSource={completionOfDepartmentTravelBudget} bordered
                 pagination={false}
          />
        </div>
      </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.FeptFullCostMgt,
    loading: state.loading.models.FeptFullCostMgt
  }
}

export default connect(mapStateToProps)(FeptFullCostMgt)
