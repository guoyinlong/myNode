/**
 * 作者：郝锐
 * 日期：2020/09/16
 * 邮件：haor@itnova.com.cn
 * 文件说明：全成本综合查询
 */
import {connect} from "dva";
import React, {Component} from "react";
import {
  Select,
  Button,
  Table,
  Row,
  Col,
  Spin,
  DatePicker,
  Input,
  message,
} from "antd";
import Styles from "../../../../components/cost/cost_budget.less";
import table from "../../../../components/finance/table.less";
import filter_style from "./comprehensive_query.less";
import ReactEcharts from "echarts-for-react";
import moment from "moment";
import "moment/locale/zh-cn";
import {routerRedux} from "dva/router";
import exportExl from "../../../../components/commonApp/exportExl.js";
import {MergeCells} from '../../../../components/finance/mergeCells'
import {HideTextComp, MoneyComponent} from "../costCommon";

moment.locale("zh-cn");
const {MonthPicker} = DatePicker;
const {Option} = Select;

class Comprehensive_query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      export_loading: false,
      export_table_columns: [],
      export_table_columns_width: '',
      export_table_dataSource: []
    }
  }

  dept_columns = [
    {
      key: "fee_name",
      width: 250,
      align: "left",
      title: "类别",
      dataIndex: "fee_name",
      render: (text) => {
        switch (text) {
          case "预计工时（小时）":
            return "工作量";
          case " (二) 项目实施成本":
            return "一、实施成本";
          case "   项目人工成本（元）":
            return "二、人工成本";
          case "二、项目分摊成本":
            return "三、分摊成本";
          case " (一) 项目采购成本":
            return "四、采购成本";
          default:
            return text;
        }
      },
    },
    {
      width: 200,
      align: "left",
      title: "预算",
      dataIndex: "budget_fee_year",
    },
    {
      width: 200,
      align: "left",
      title: "实际",
      dataIndex: "fee",
    },
    {
      width: 200,
      align: "left",
      title: "预算完成率",
      dataIndex: "FeeCompletionRate",
    },
  ];
  // 跳转预算完成情况汇总
  go_cost_projbudgetgoing_mgt = (projCode) => {
    const {
      dispatch,
      ou,
      query_period,
      start_year,
      start_month,
      end_year,
      end_month,
      query_content,
      dept,
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: "/financeApp/cost_proj_fullcost_mgt/cost_projbudgetgoing_mgt",
        query: {
          ou,
          stateParam: query_period,
          projCode,
          argbegintime: `${start_year}-${start_month}`,
          argendtime: `${end_year}-${end_month}`,
          goback_param: JSON.stringify({
            ou,
            query_period,
            query_content,
            start_year,
            start_month,
            end_year,
            end_month,
            dept,
          }),
        },
      })
    );
  };
  proj_columns = [
    {
      title: "序号",
      dataIndex: "key",
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: "部门名称",
      dataIndex: "pu_dept_name",
      width: 140,
      render: (text) => <span>{text.split("-")[1]}</span>,
    },
    {
      title: "项目名称",
      dataIndex: "proj_name",
      width: 220,
      render: (text, record) => (
        <div onClick={() => this.go_cost_projbudgetgoing_mgt(record.proj_code)}>
          <a>{text}</a>
        </div>
      ),
    },
    {
      title: "项目编码",
      dataIndex: "proj_code",
      width: 140,
    },
    {
      title: "pms编码",
      dataIndex: "pms_code",
      width: 140,
    },
    {
      title: "项目经理",
      dataIndex: "mgr_name",
      width: 100,
    },
    {
      title: "项目类型",
      dataIndex: "proj_type",
      width: 120,
    },
    {
      title: "全成本（自有投入）",
      children: [
        {
          title: "预算",
          dataIndex: "budget_fee_year",
          width: 120,
        },
        {
          title: "实际完成",
          dataIndex: "fee",
          width: 120,
        },
        {
          title: "完成率",
          dataIndex: "FeeCompletionRate",
          width: 120,
        },
      ],
    },
  ];
  ouChange = (value) => {
    this.props.dispatch({
      type: "comprehensive_query/ouChange",
      query: {
        ou: value,
      },
    });
  };
  deptChange = (value) => {
    this.props.dispatch({
      type: "comprehensive_query/deptChange",
      query: {
        dept: value,
      },
    });
  };
  queryPeriodChange = (value) => {
    this.props.dispatch({
      type: "comprehensive_query/queryPeriodChange",
      query: {
        queryPeriod: value,
      },
    });
  };
  queryContentChange = (value) => {
    this.props.dispatch({
      type: "comprehensive_query/queryContentChange",
      query: {
        queryContent: value,
      },
    });
  };
  getOption = () => {
    const {
      fee,
      chartList,
      feeList,
      FeeCompletionRate,
      budget_fee_year,
    } = this.props;
    return {
      title: [
        {
          text: "单位： 万元",
          x: "15px",
          y: "15px",
          textStyle: {
            fontSize: 14,
            fontWeight: "bolder",
            color: "#000",
          },
        },
        {
          text: "全成本完成数占比",
          // subtext: '模拟数据',
          // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: "15%",
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: "bottom",
          // itemGap设置主副标题纵向间隔，单位px，默认为10，
          itemGap: 30,
          // 主标题文本样式设置
          textStyle: {
            fontSize: 18,
            fontWeight: "bolder",
            color: "#000",
          },
        },
        {
          text: "全成本分布",
          // subtext: '模拟数据',
          // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: "70%",
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: "bottom",
          // itemGap设置主副标题纵向间隔，单位px，默认为10，
          itemGap: 30,
          // 主标题文本样式设置
          textStyle: {
            fontSize: 18,
            fontWeight: "bolder",
            color: "#000",
          },
        },
      ],
      // legend: {
      //   // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
      //   orient: 'horizontal',
      //   // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
      //   x: 'center',
      //   // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
      //   y: 'bottom',
      //   itemWidth: 24,   // 设置图例图形的宽
      //   itemHeight: 18,  // 设置图例图形的高
      //   textStyle: {
      //     color: '#666'  // 图例文字颜色
      //   },
      //   // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
      //   itemGap: 10,
      //   backgroundColor: '#eee',  // 设置整个图例区域背景颜色
      //   data: chartList
      // },
      xAxis: [
        {
          type: "category",
          data: chartList,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "金额(万元)",
          axisLine: {
            lineStyle: {
              color: "#5793f3",
            },
          },
        },
        {
          type: "value",
          name: "预算完成率",
          min: 0,
          max: 100,
          axisLabel: {
            formatter: "{value} %",
          },
          axisLine: {
            lineStyle: {
              color: "#d14a61",
            },
          },
        },
      ],
      grid: {
        left: "60%",
        top: "20%",
        bottom: "25%",
      },
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: false},
          restore: {show: true},
          saveAsImage: {show: true},
        },
      },
      series: [
        {
          name: "全成本",
          type: "pie",
          // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
          radius: ["0%", "35%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
          center: ["25%", "50%"], // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
          data: fee,
          // 设置值域的标签
          label: {
            formatter:
              " {b|{b}}{abg|}\n{hr|}\n{c|完成数:{c}}  {per|占比:{d}%}  ",
            backgroundColor: "#eee",
            borderWidth: 1,
            borderRadius: 4,
            shadowBlur: 3,
            font_size: 14,
            rich: {
              b: {
                color: "#000",
                lineHeight: 22,
                align: "center",
              },
              // abg: {
              //     backgroundColor: '#333',
              //     width: '100%',
              //     align: 'right',
              //     height: 22,
              //     borderRadius: [4, 4, 0, 0]
              // },
              hr: {
                borderColor: "#aaa",
                width: "100%",
                borderWidth: 0.5,
                height: 0,
              },
              // b: {
              //   fontSize: 16,
              //   lineHeight: 33
              // },
              c: {
                color: "#eee",
                backgroundColor: "#334455",
                padding: [2, 4],
                borderRadius: 2,
              },
              per: {
                color: "#eee",
                backgroundColor: "#334455",
                padding: [2, 4],
                borderRadius: 2,
              },
            },
          },
        },
        {
          name: "预算数",
          type: "bar",
          data: budget_fee_year,
        },
        {
          name: "完成数",
          type: "bar",
          data: feeList,
        },
        {
          yAxisIndex: 1,
          name: "预算完成率",
          type: "line",
          smooth: true,
          data: FeeCompletionRate,
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      color: [
        "#456465",
        "#4ad785",
        "#2f659c",
        "#45afda",
        "#aacfae",
        "#afb586",
        "#dcdf45",
        "#ac5478",
        "#a78149",
      ],
      // backgroundColor: '#999',
    };
  };
  startTimeChange = (time, timeString) => {
    this.props.dispatch({
      type: "comprehensive_query/startTimeChange",
      current: timeString,
    });
  };
  endTimeChange = (time, timeString) => {
    this.props.dispatch({
      type: "comprehensive_query/endTimeChange",
      current: timeString,
    });
  };
  startDisabledDate = (current) => {
    return (
      current &&
      current.valueOf() >
      new Date(
        `${this.props.end_year}-${this.props.end_month}-01 00:00:00`
      ).valueOf()
    );
  };
  endDisabledDate = (current) => {
    return (
      (current &&
        current.valueOf() <
        new Date(
          `${this.props.start_year}-${this.props.start_month}-01 00:00:00`
        ).valueOf()) ||
      current.valueOf() >
      new Date(
        `${this.props.total_year}-${this.props.total_month}-01 00:00:00`
      )
    );
  };

  onChartClick = (param) => {
    const {dispatch, dept, ou} = this.props;
    if (param.componentSubType === "pie") {
      let query = {};
      if (dept !== "全部" && ou === "联通软件研究院") {
        query = {
          dept,
          ou: param.name,
        };
      } else if (dept === "全部" && ou !== "联通软件研究院") {
        query = {
          dept: "联通软件研究院-" + param.name,
          ou,
        };
      } else {
        query = {dept, ou};
      }
      dispatch({
        type: "comprehensive_query/ChartClick",
        query,
      });
    }
  };
  proj_code_change = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: "comprehensive_query/filter_change",
      query: {
        name: "form_proj_code",
        value: e.target.value,
      },
    });
  };
  proj_name_change = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: "comprehensive_query/filter_change",
      query: {
        name: "form_proj_name",
        value: e.target.value,
      },
    });
  };
  mgr_name_change = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: "comprehensive_query/filter_change",
      query: {
        name: "form_mgr_name",
        value: e.target.value,
      },
    });
  };
  exportExcel = () => {
    const {query_content, dispatch} = this.props;
    let tableID;
    if (query_content === "部门全成本") {
      tableID = document.querySelector("#dept_table table");
      exportExl()(tableID, `综合查询-部门全成本`);
    } else if (query_content === "项目全成本") {
      let export_table = async () => {
        await this.setState({
          export_loading: true
        })
        dispatch({
          type: 'comprehensive_query/detail_query',
          callback: async ({DataRows, columnList}) => {
            await this.export_table({DataRows, columnList})
            tableID = document.querySelector('#export_proj_table table');
            exportExl()(tableID, `ou预算完成情况`);
            this.setState({
              export_loading: false
            })
          }
        })
      }
      export_table()
    } else {
      message.info("导出失败");
    }
  };
  export_table = ({DataRows, columnList}) => {
    DataRows.length && DataRows.map((item, index) => item.key = index)

    function TagDisplay(proj_tag) {
      if (proj_tag === '0') return 'TMO保存';
      else if (proj_tag === '2') return '已立项';
      else if (proj_tag === '4') return '已结项';
      else if (proj_tag === '5') return '历史完成';
      else if (proj_tag === '6') return '常态化项目';
      else if (proj_tag === '7') return '中止/暂停';
      else if (proj_tag === '8') return '删除';
      else return '';
    }

    let date_split = (date) => {
      return date.split('-')
    }
    let table_head_style_show = (date) => {
      let query_year = this.props.end_year
      let query_month = this.props.end_month
      let end_year = date_split(date)[0]
      let end_month = date_split(date)[1]
      if (end_year < query_year) {
        return true
      } else if (end_year > query_year) {
        return false
      } else if (end_year == query_year) {
        end_month < query_month ? true : false
      }
    }
    if (columnList) {
      columnList = JSON.parse(columnList);
    }
    let columnsWidth;
    let export_table_columns = [
      {
        title: '成本类型',
        key: '1',
        render: (text, record, index) => {
          if (record.fee_type === "0") {
            return {
              children: <span>项目工时</span>,
              props: {
                colSpan: 2,
                rowSpan: record[1]
                //rowSpan:index==typeTimeRowNum.flag?typeTimeRowNum.num:0
              },
            };
          } else if (record.fee_type === '1') {
            return {
              children: <span>项目直接成本</span>,
              props: {
                rowSpan: record[1]
                //rowSpan:index==typeDirectCostRowNum.flag?typeDirectCostRowNum.num:0
              }
            };
          } else if (record.fee_type === '5') {
            return {
              children: <span>项目分摊成本</span>,
              props: {
                colSpan: 2,
                rowSpan: record[1]
                //rowSpan:index==typeApportionedRowNum.flag?typeApportionedRowNum.num:0
              },
            };
          } else if (record.fee_type === '99') {
            return {
              children: <span>{record.fee_name}</span>,
              props: {
                colSpan: 3,
              },
            };
          }
        }
      },
      {
        title: '子成本类型',
        key: '2',
        render: (text, record, index) => {
          if (record.fee_type === '1' && record.fee_subtype === '0') {
            return {
              children: <span>项目采购成本</span>,
              props: {
                rowSpan: record[2]
                //rowSpan:index==purchaseRowNum.flag?purchaseRowNum.num:0
              },
            };
          } else if (record.fee_type === '1' && record.fee_subtype === '1') {

            return {
              children: <span>项目实施成本</span>,
              props: {
                rowSpan: record[2]
              },
            };
          } else if (record.fee_type === '1' && record.fee_subtype === '2') {

            return {
              children: <span>项目人工成本</span>,
              props: {
                rowSpan: record[2]
                //rowSpan:index==personRowNum.flag?personRowNum.num:0
              },
            };
          } else if (record.fee_type === '1' && record.fee_subtype === '3') {
            return {
              children: <span>项目运行成本</span>,
              props: {
                rowSpan: record[2]
                //rowSpan:index==projRunRowNum.flag?projRunRowNum.num:0
              },
            };
          } else {
            return {
              children: null,
              props: {
                colSpan: 0,
              },
            }
          }
        }
      },
      {
        title: '成本名称',
        key: '3',
        render: (text, row, index) => {
          if (row.fee_type !== '99') {
            return <HideTextComp text={row.fee_name}/>;
          } else {
            return {
              children: null,
              props: {
                colSpan: 0,
              },
            }
          }
        }
      }
    ]
    if (columnList) {
      for (let i = 0; i < columnList.length; i++) {
        if (columnList[i].pms_code === '合计') {
          export_table_columns.push({
            title: '合计',
            className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
            children: [{
              title: '预算数',
              width: 120,
              key: i + 'a',
              className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
              render: (text, record) => <MoneyComponent text={record[columnList[i].proj_code + '::预算数']}/>
            }, {
              title: "实际完成数",
              width: 120,
              key: i + 'b',
              className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
              render: (text, record) => <MoneyComponent text={record[columnList[i].proj_code + '::实际完成数']}/>
            }, {
              title: '预算完成率',
              width: 120,
              key: i + 'c',
              className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
              render: (text, record) =>
                <div style={parseFloat(record[columnList[i].proj_code + '::预算完成率']) > 100 ? {
                  textAlign: 'right',
                  letterSpacing: 1,
                  color: 'red'
                } : {textAlign: 'right', letterSpacing: 1}}>
                  {record[columnList[i].proj_code + '::预算完成率'] === "0.00%" ? '-' : record[columnList[i].proj_code + '::预算完成率']}
                </div>
            }]
          })
        } else {
          export_table_columns.push({
            title: columnList[i].pms_code ? columnList[i].proj_code + '/' + (columnList[i].pms_code || '') : columnList[i].proj_code,
            className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
            children: [{
              title: columnList[i].proj_tag ? columnList[i].proj_name + '(' + TagDisplay(columnList[i].proj_tag) + ')' : columnList[i].proj_name,
              className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
              children: [{
                title: '预算数',
                width: 120,
                key: i + 'a',
                className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
                render: (text, record) => <MoneyComponent text={record[columnList[i].proj_code + '::预算数']}/>
              }, {
                title: "实际完成数",
                width: 120,
                key: i + 'b',
                className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
                render: (text, record) => <MoneyComponent text={record[columnList[i].proj_code + '::实际完成数']}/>
              }, {
                title: '预算完成率',
                width: 120,
                key: i + 'c',
                className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
                render: (text, record) =>
                  <div style={parseFloat(record[columnList[i].proj_code + '::预算完成率']) > 100 ? {
                    textAlign: 'right',
                    letterSpacing: 1,
                    color: 'red'
                  } : {textAlign: 'right', letterSpacing: 1}}>
                    {record[columnList[i].proj_code + '::预算完成率'] === "0.00%" ? '-' : record[columnList[i].proj_code + '::预算完成率']}
                  </div>
              }]
            }],
          })
        }
      }
      columnsWidth = 360 + columnList.length * 360;
    }
    this.setState({
      export_table_columns,
      export_table_columns_width: columnsWidth,
      export_table_dataSource: DataRows
    })
  }

  render() {
    const {
      chart_show,
      dept,
      deptList,
      ou,
      ouList,
      query_period,
      query_content,
      start_year,
      end_year,
      start_month,
      end_month,
      v_loading,
      proj_dataSource,
      proj_type_list,
      form_proj_code,
      form_proj_name,
      form_mgr_name,
    } = this.props;
    let onEvents = {
      click: this.onChartClick,
    };
    return (
      <Spin spinning={this.props.loading && v_loading}>
        <div className={Styles.wrap}>
          <div className={filter_style.filter_wrap}>
            <div className={filter_style.filter_box}>
              <div>
                <span>OU：&nbsp;&nbsp;</span>
                <Select
                  style={{width: 170}}
                  defaultValue={ou}
                  value={ou}
                  onChange={this.ouChange}
                >
                  {ouList.map((item, key) => (
                    <Option key={key} value={item.dept_name}>
                      {item.dept_name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <span>开始时间：</span>
                {start_year && start_month ? (
                  <MonthPicker
                    defaultValue={moment(
                      `${start_year}-${start_month}`,
                      "YYYY-MM"
                    )}
                    disabled={query_period !== "4"}
                    placeholder="Select month"
                    style={{width: 170}}
                    value={moment(`${start_year}-${start_month}`)}
                    onChange={this.startTimeChange}
                    disabledDate={this.startDisabledDate}
                  />
                ) : null}
              </div>
              <div>
                <span>查询内容：</span>
                <Select
                  value={query_content}
                  defaultValue={query_content}
                  onChange={this.queryContentChange}
                  style={{width: 170}}
                >
                  <Option value={"部门全成本"}>部门全成本</Option>
                  <Option value={"项目全成本"}>项目全成本</Option>
                </Select>
              </div>
              <div>
                <span>部门：</span>
                <Select
                  style={{width: 170}}
                  defaultValue={dept}
                  value={dept}
                  onChange={this.deptChange}
                >
                  <Option value={"全部"}>全部门</Option>
                  {deptList.map((item, key) => (
                    <Option key={key} value={item.dept_name}>
                      {item.dept_name.split("-")[1]}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <span>结束时间：</span>
                {end_year && end_month ? (
                  <MonthPicker
                    defaultValue={moment(`${end_year}-${end_month}`, "YYYY-MM")}
                    disabled={query_period !== "4"}
                    placeholder="Select month"
                    style={{width: 170}}
                    value={moment(`${end_year}-${end_month}`)}
                    onChange={this.endTimeChange}
                    disabledDate={this.endDisabledDate}
                  />
                ) : null}
              </div>
              <div>
                <span>查询期间：</span>
                <Select
                  defaultValue={query_period}
                  value={query_period}
                  onChange={this.queryPeriodChange}
                  style={{width: 170}}
                >
                  <Option value={"2"}>本年累计</Option>
                  <Option value={"1"}>本月发生</Option>
                  <Option value={"3"}>项目至今累计</Option>
                  <Option value={"4"}>自定义</Option>
                </Select>
              </div>
              {query_content === "项目全成本" ? (
                <div>
                  <span>项目编号：</span>
                  <Input
                    value={form_proj_code}
                    style={{width: 170}}
                    onChange={this.proj_code_change}
                  />
                </div>
              ) : null}
              {query_content === "项目全成本" ? (
                <div>
                  <span>项目名称：</span>
                  <Input
                    value={form_proj_name}
                    style={{width: 170}}
                    onChange={this.proj_name_change}
                  />
                </div>
              ) : null}
              {query_content === "项目全成本" ? (
                <div>
                  <span>项目经理：</span>
                  <Input
                    value={form_mgr_name}
                    style={{width: 170}}
                    onChange={this.mgr_name_change}
                  />
                </div>
              ) : null}
            </div>
            <div className={filter_style.export_button}>
              <Button type={"primary"} loading={this.state.export_loading} onClick={this.exportExcel}>
                导出
              </Button>
            </div>
          </div>
          {query_content === "部门全成本" ? (
            <div>
              <div className={table.financeTable}>
                <Table
                  loading={v_loading}
                  pagination={false}
                  columns={this.dept_columns}
                  dataSource={this.props.dept_dataSource}
                  // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                  // expandedRowKeys={this.props.dept_dataSource.map(
                  //   (item) => item.key
                  // )}
                />
              </div>
              <div
                id={"dept_table"}
                className={table.financeTable}
                style={{
                  display: "none",
                }}
              >
                <Table
                  loading={v_loading}
                  pagination={false}
                  columns={this.dept_columns}
                  dataSource={this.props.dept_dataSource}
                  // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                  expandedRowKeys={this.props.dept_dataSource.map(
                    (item) => item.key
                  )}
                />
              </div>
            </div>
          ) : null}
          {dept &&
          ou &&
          query_content &&
          query_content === "部门全成本" &&
          chart_show ? (
            <Row>
              <Col
                span={24}
                style={{border: "1px solid gray", marginTop: 15}}
              >
                <ReactEcharts
                  style={{width: "100%", height: 500}}
                  option={this.getOption()}
                  notMerge={true}
                  lazyUpdate={true}
                  onEvents={onEvents}
                  showLoading={v_loading}
                />
              </Col>
            </Row>
          ) : null}
          <div
            className={table.financeTable}
            style={{display: query_content === "项目全成本" ? null : "none"}}
          >
            <Table
              loading={v_loading}
              columns={this.proj_columns}
              dataSource={proj_dataSource}
              scroll={{x: 1280, y: false}}
            />
          </div>
          <div
            id={"proj_table"}
            className={table.financeTable}
            style={{display: "none"}}
          >
            <Table
              loading={v_loading}
              pagination={false}
              columns={this.proj_columns}
              dataSource={proj_dataSource}
              scroll={{x: 1280, y: false}}
            />
          </div>
          <div
            style={{display: query_content === "项目全成本" ? null : "none"}}
          >
            {proj_type_list.length ? (
              <div>
                项目类型：
                {proj_type_list.map((item, index) => (
                  <span
                    style={{color: "red", padding: "10px 10px"}}
                    key={index}
                  >
                    {item.type_name}:{item.type_name_label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div id='export_proj_table' style={{display: 'none'}}>
            <Table pagination={false} scroll={{x: this.state.export_table_columns_width}}
                   columns={this.state.export_table_columns} dataSource={this.state.export_table_dataSource}/>
          </div>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  //const { list, v_remarks, v_remarks_month, months, argou, ouName} = state.proj_cost_collectExcel;

  return {
    loading: state.loading.models.comprehensive_query,
    ...state.comprehensive_query,
  };
}

export default connect(mapStateToProps)(Comprehensive_query);
