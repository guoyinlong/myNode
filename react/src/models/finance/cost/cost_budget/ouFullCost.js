/**
 * 作者：陈红华
 * 创建日期：2017-10-25
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本第五部分：项目全成本管理-OU/部门项目全成本预算完成情况汇总页面所用操作
 */
import {message} from 'antd';
import * as costService from '../../../../services/finance/costService';
import {HideTextComp, MoneyComponent} from '../../../../routes/finance/cost/costCommon.js';
import * as config from '../../../../services/finance/costServiceConfig.js';
import {rightControl} from '../../../../components/finance/rightControl';
import {MergeCells} from './../../../../components/finance/mergeCells';

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

export default {
  namespace: 'ouFullCost',
  state: {
    dataList: [],
    stateParamList: [],
    columns: [],
    rightCtrl: []
  },
  reducers: {
    // ou/部门项目全成本预算完成情况--查询reducer
    ouFullCostQueryRedu(state, {dataList, state_code, columnsWidth, columns, loading}) {
      return {
        ...state,
        dataList,
        state_code,
        columnsWidth,
        columns,
        loading
      }
    },
    // 统计类型查询reducer
    stateParamQueryRedu(state, {DataRows}) {
      return {
        ...state,
        stateParamList: DataRows
      }
    },
    // 最新数据的年月
    ouFullCostLastDateRedu(state, {lastDate}) {
      return {
        ...state,
        lastDate
      }
    },
    // 获取按钮权限
    getRightContrlRedu(state, {DataRows}) {
      return {
        ...state,
        rightCtrl: [...DataRows]
      }
    },
    saveStateParam(state, action) {
      return {...state, ...action.payload};
    },
  },
  effects: {
    // ou/部门项目全成本预算完成情况--查询
    * ouFullCostQuery({formData}, {call, put}) {
      yield put({
        type: 'saveStateParam',
        payload: {
          loading: true
        }
      })
      let {DataRows, columnList, state_code} = yield call(costService.ouFullCostQuery, formData);
      MergeCells(DataRows, 'fee_type', '1');
      MergeCells(DataRows, 'fee_subtype', '2');
      let date_split = (date) => {
        return date.split('-')
      }
      let table_head_style_show = (date) => {
        let query_year = formData.argyear
        let querr_month = formData.argmonth
        let end_year = date_split(date)[0]
        let end_month = date_split(date)[1]
        if (end_year < query_year) {
          return true
        } else if (end_year > query_year) {
          return false
        } else if (end_year == query_year) {
          end_month < querr_month ? true : false
        }
      }
      if (DataRows) {
        for (let i = 0; i < DataRows.length; i++) {
          DataRows[i].key = i + 'f';
          DataRows[i].num = i + 1;
        }
      }
      if (columnList) {
        columnList = JSON.parse(columnList);
      }
      let columnsWidth;
      // let typeTimeRowNum={num:1};//成本类型，fee_type==0时，rowspan的值及其合并的第一个index
      // let typeDirectCostRowNum={num:1};//成本类型，fee_type==1时，rowspan的值及其合并的第一个index
      // let typeApportionedRowNum={num:1};//成本类型，fee_type==5时，rowspan的值及其合并的第一个index
      // let purchaseRowNum={num:1};//子成本类型fee_subtype==0,rowspan的值及其合并的第一个index
      // let implementRowNum={num:1};//子成本类型fee_subtype==1,rowspan的值及其合并的第一个index
      // let personRowNum={num:1};//子成本类型fee_subtype==2,rowspan的值及其合并的第一个index
      // let projRunRowNum={num:1};//子成本类型fee_subtype==3,rowspan的值及其合并的第一个index
      let columns = [
        // {
        //   title: '序号',
        //   width: 80,
        //   fixed:'left',
        //   dataIndex:'num',
        // },
        {
          title: '成本类型',
          width: 150,
          fixed: 'left',
          key: '1',
          render: (text, row, index) => {
            if (row.fee_type == 0) {
              // if(!typeTimeRowNum.flag){
              //   typeTimeRowNum.flag=index;
              // }
              // if(!typeTimeRowNum[index]){
              //   typeTimeRowNum[index]=index;
              //   if(DataRows[index+1].fee_type==0){
              //     typeTimeRowNum.num++;
              //   }
              // }

              return {
                children: <span>项目工时</span>,
                props: {
                  colSpan: 2,
                  rowSpan: row[1]
                  //rowSpan:index==typeTimeRowNum.flag?typeTimeRowNum.num:0
                },
              };
            } else if (row.fee_type == 1) {
              // if(!typeDirectCostRowNum.flag){
              //   typeDirectCostRowNum.flag=index;
              // }
              // if(!typeDirectCostRowNum[index]){
              //   typeDirectCostRowNum[index]=index;
              //   if(DataRows[index+1].fee_type==1){
              //     typeDirectCostRowNum.num++;
              //   }
              // }
              return {
                children: <span>项目直接成本</span>,
                props: {
                  rowSpan: row[1]
                  //rowSpan:index==typeDirectCostRowNum.flag?typeDirectCostRowNum.num:0
                }
              };
            } else if (row.fee_type == 5) {
              // if(!typeApportionedRowNum.flag){
              //   typeApportionedRowNum.flag=index;
              // }
              // if(!typeApportionedRowNum[index]){
              //   typeApportionedRowNum[index]=index;
              //   if(DataRows[index+1].fee_type==5){
              //     typeApportionedRowNum.num++;
              //   }
              // }
              return {
                children: <span>项目分摊成本</span>,
                props: {
                  colSpan: 2,
                  rowSpan: row[1]
                  //rowSpan:index==typeApportionedRowNum.flag?typeApportionedRowNum.num:0
                },
              };
            } else if (row.fee_type == 99) {
              return {
                children: <span>{row.fee_name}</span>,
                props: {
                  colSpan: 3,
                },
              };
            }
          }
        },
        {
          title: '子成本类型',
          width: 140,
          fixed: 'left',
          key: '2',
          render: (text, row, index) => {
            if (row.fee_type == 1 && row.fee_subtype == 0) {
              // if(!purchaseRowNum.flag){
              //   purchaseRowNum.flag=index;
              // }
              // if(!purchaseRowNum[index]){
              //   purchaseRowNum[index]=index;
              //   if(DataRows[index+1].fee_subtype==0){
              //     purchaseRowNum.num++;
              //   }
              // }
              return {
                children: <span>项目采购成本</span>,
                props: {
                  rowSpan: row[2]
                  //rowSpan:index==purchaseRowNum.flag?purchaseRowNum.num:0
                },
              };
            } else if (row.fee_type == 1 && row.fee_subtype == 1) {
              // if(!implementRowNum.flag){
              //   implementRowNum.flag=index;
              // }
              // if(!implementRowNum[index]){
              //   implementRowNum[index]=index;
              //   if(DataRows[index+1].fee_subtype==1){
              //     implementRowNum.num++;
              //   }
              // }
              return {
                children: <span>项目实施成本</span>,
                props: {
                  rowSpan: row[2]
                  //rowSpan:index==implementRowNum.flag?implementRowNum.num:0
                },
              };
            } else if (row.fee_type == 1 && row.fee_subtype == 2) {
              // if(!personRowNum.flag){
              //   personRowNum.flag=index;
              // }
              // if(!personRowNum[index]){
              //   personRowNum[index]=index;
              //   if(DataRows[index+1].fee_subtype==2){
              //     personRowNum.num++;
              //   }
              // }
              return {
                children: <span>项目人工成本</span>,
                props: {
                  rowSpan: row[2]
                  //rowSpan:index==personRowNum.flag?personRowNum.num:0
                },
              };
            } else if (row.fee_type == 1 && row.fee_subtype == 3) {
              // if(!projRunRowNum.flag){
              //   projRunRowNum.flag=index;
              // }
              // if(!projRunRowNum[index]){
              //   projRunRowNum[index]=index;
              //   if(DataRows[index+1].fee_subtype==3){
              //     projRunRowNum.num++;
              //   }
              // }
              return {
                children: <span>项目运行成本</span>,
                props: {
                  rowSpan: row[2]
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
          width: 160,
          fixed: 'left',
          key: '3',
          render: (text, row, index) => {
            if (row.fee_type != 99) {
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
        },
      ];
      if (columnList) {
        for (let i = 0; i < columnList.length; i++) {
          if (columnList[i].pms_code === '合计'){
            columns.push({
              title: '合计',
              className: table_head_style_show(columnList[i].end_time) ? 'table_head_style' : '',
              children: [{
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
              }],
            })
          }else {
            columns.push({
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
      // columns.push({
      //   title: '合计',
      //   dataIndex: ''
      // })
      yield put({
        type: 'ouFullCostQueryRedu',
        dataList: DataRows,
        state_code: state_code == undefined ? '999' : state_code,
        columnsWidth,
        columns,
        loading: false
      });
    },
    // 查询按钮权限
    * getRightContrl({formDataRight, formDataQuery}, {call, put}) {
      const {DataRows} = yield call(costService.userGetModule, formDataRight);
      yield put({
        type: 'ouFullCostLastDate',
        formData: !rightControl(config.OuFullCostPublish, DataRows)
        && !rightControl(config.OuFullCostUnpublish, DataRows)
        && !rightControl(config.OuFullCostCreate, DataRows) ? {...formDataQuery, argstatecode: '0'} : formDataQuery
      });
      yield put({
        type: 'getRightContrlRedu',
        DataRows
      })
    },
    // 查询最近有数据的日期
    * ouFullCostLastDate({formData}, {call, put}) {
      let postData = formData.argstatecode ? {
        argou: formData.argou,
        argstatecode: formData.argstatecode
      } : {argou: formData.argou}
      let {max_year, max_month} = yield call(costService.ouFullCostLastDate, postData);
      yield put({
        type: 'ouFullCostQuery',
        formData: {
          ...formData,
          'argyear': max_year,
          'argmonth': max_month
        }
      })
      yield put({
        type: 'ouFullCostLastDateRedu',
        lastDate: max_year + '-' + max_month
      });
    },
    // 统计类型查询
    * stateParamQuery({formData}, {call, put}) {
      let {DataRows} = yield call(costService.stateParamQuery, formData);
      yield put({
        type: 'stateParamQueryRedu',
        DataRows
      });
    },
    // 发布
    * ouFullCostPublish({formData}, {call, put}) {
      const {argmonth, argou, arguserid, argyear} = formData;
      let {RetCode} = yield call(costService.ouFullCostPublish, {argmonth, argou, arguserid, argyear});
      if (RetCode == 1) {
        message.success('发布成功!');
        let data = yield call(costService.sendMessage, {
          arg_ou: argou,
          arg_total_year: argyear,
          arg_total_month: argmonth,
          arg_req_userid: arguserid
        });
        if (data.RetCode === '1') {
          message.success('成功向相关人员发送邮件!');
        } else {
          message.success(data.RetVal);
        }
        yield put({
          type: 'ouFullCostQuery',
          formData
        });
      }
    },
    // 撤销发布
    * ouFullCostUnpublish({formData}, {call, put}) {
      const {argmonth, argou, arguserid, argyear} = formData;
      let {RetCode} = yield call(costService.ouFullCostUnpublish, {argmonth, argou, arguserid, argyear});
      if (RetCode == 1) {
        message.success('撤销发布成功！');
        yield put({
          type: 'ouFullCostQuery',
          formData
        });
      }
    },
    // 生成数据
    * ouFullCostCreate({formData}, {call, put}) {
      const {argmoduleid, argmonth, argou, argtenantid, arguserid, argyear, argtotaltype, argstatecode} = formData;
      let {RetCode} = yield call(costService.ouFullCostCreate, {
        argmoduleid,
        argmonth,
        argou,
        argtenantid,
        arguserid,
        argyear
      });
      if (RetCode == 1) {
        message.success('生成数据成功！');
        yield put({
          type: 'ouFullCostQuery',
          formData: {
            arguserid,
            argyear,
            argmonth,
            argou,
            argstatecode,
            argtotaltype
          }
        });
      }
    },
    //导入年化人数
    * import_year_men({formData}, {call, put}) {
      const {argmonth, argyear, argou} = formData
      const data = yield call(costService.timesheetPopulationYearGenerate, {
        arg_ou: "联通软件研究院-" + argou,
        arg_this_year: argyear,
        arg_this_month: argmonth
      })
      if (data.RetCode === '1') {
        message.success('导入年化人数成功')
      }
    }
  },
  subscriptions: {}
}
