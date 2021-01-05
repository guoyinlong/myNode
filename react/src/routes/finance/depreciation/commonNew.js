/**
 * 作者：张楠华
 * 日期：2019-7-15
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：折旧分摊办公软件
 */
import React from 'react';
import style from './style.less'
import {Select, DatePicker, message, Upload, Button, Table, Tabs, Input, Col, Row, Spin} from 'antd'
import cookies from 'js-cookie'
import exportExl from '../../../components/commonApp/exportExl';
import styles from '../../../components/finance/table.less'
import {MoneyComponentEditCell} from '../cost/costCommon.js';
import EditItem from '../budgetManagement/editComponent';

const TabPane = Tabs.TabPane;
const {MonthPicker} = DatePicker;
const Option = Select.Option;
export default class Common extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pms_code: '',
      pms_name: '',
      arg_current_depreciate: '',
      arg_ratio: '',
      loadings: []
    }
  }

  changeState = (...arg) => {
    const {dispatch} = this.props;
    const {modelsSpace} = this.props;
    dispatch({
      type: `${modelsSpace}/changeState`,
      arg,
    })
  };
  input_pms_code_change = (e) => {
    const {dispatch, modelsSpace} = this.props
    dispatch({
      type: `${modelsSpace}/query_condition_pms_code`,
      pms_code: e.target.value
    })
  }
  input_pms_name_change = e => {
    const {dispatch, modelsSpace} = this.props
    dispatch({
      type: `${modelsSpace}/query_condition_pms_name`,
      pms_name: e.target.value
    })
  }
  query_by_pmscode_or_pmsname = () => {
    const {modelsSpace, dispatch} = this.props;
    dispatch({
      type: `${modelsSpace}/queryItOfficeData`,
    })
  }
  genData =  () => {
    const {dispatch} = this.props;
    const {modelsSpace} = this.props;
    dispatch({
      type: `${modelsSpace}/genData`,
    })
  };
  delData = () => {
    const {dispatch} = this.props;
    const {modelsSpace} = this.props;
    dispatch({
      type: `${modelsSpace}/delData`,
    })
  };
  downM = () => {
    const {modelsSpace} = this.props;
    if (modelsSpace === 'equipment') {
      window.open('/filemanage/download/amortize/项目资产使用情况登记表.xlsx');
    } else if (modelsSpace === 'office') {
      window.open('/filemanage/download/amortize/固定资产明细表.xlsx');
    }
  };
  exportData = () => {
    const {list} = this.props.state;
    const {modelsSpace} = this.props;
    let tab = document.querySelector('#table1 table');
    if (list.length !== 0) {
      exportExl()(tab, modelsSpace === 'equipment' ? 'IT设备及通用软件摊销' : '办公设备摊销');
    } else {
      message.info("查询结果为空！")
    }
  };
  changeTab = (key) => {
    const {modelsSpace, dispatch} = this.props;
    if (key === '1') {
      dispatch({
        type: `${modelsSpace}/queryImport`,
      })
    } else if (key === '2') {
      dispatch({
        type: `${modelsSpace}/queryItOfficeData`,
      })
    }
  };
  itemChange = (e, record, type) => {

    let value = e.target.value;
    let isMinus = false;
    //如果以 — 开头
    if (value.indexOf('-') === 0) {
      isMinus = true;
    }

    //先将非数值去掉
    value = value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') {
      value = '0'
    }
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if (isMinus === true) {
      value = '-' + value;
    }
    // if(this.props.changeValue){
    //   this.props.changeValue(value,this.props.feeName,this.props.record);
    // }
    record['changedNewValue'] = value
  };
  onCellChange = (record, type) => {
    const {dispatch, modelsSpace} = this.props
    let query = {}
    if (record['changedNewValue']) {
      switch (type) {
        case '1':
          query = {
            arg_uuid: record.uuid,
            arg_current_depreciate: record['changedNewValue'],
            arg_ratio: record.ratio
          }
          break;
        case '2':
          query = {
            arg_uuid: record.uuid,
            arg_current_depreciate: record.current_depreciate,
            arg_ratio: record['changedNewValue']
          }
          break;
        default:
          message.warning('参数错误')
          break;
      }
    }
    dispatch({
      type: `${modelsSpace}/amortize_office_equipment_update`,
      query
    })
  }
  delete_data = (record) => {
    const {modelsSpace, dispatch} = this.props
    dispatch({
      type: `${modelsSpace}/amortize_office_equipment_truncate`,
      query: {
        arg_uuid: record.uuid
      }
    })
  }
  proj_type_change = (value) => {
    const {modelsSpace, dispatch} = this.props
    dispatch({
      type: `${modelsSpace}/proj_type_change`,
      arg_total_type: value
    })
  }

  render() {
    const {ouList, list, ou, yearMonth, objScroll, remark, activityKey, importList, importObjScroll,genDataLoadings,all_count} = this.props.state;
    const {modelsSpace, dispatch} = this.props;
    ouList.forEach((i, index) => {
      i.key = index
    });
    list.forEach((i, index) => {
      i.key = index
    });
    importList.forEach((i, index) => {
      i.key = index
    });
    let columns = [];
    let columnsImport = [];
    if (modelsSpace === 'equipment') {
      columns.push(
        {
          title: '项目编号',
          dataIndex: 'proj_code',
          width: '150px',
          fixed: 'left'
        },
        {
          title: '项目编号（PMS）',
          dataIndex: 'pms_code',
          width: '150px',
        },
        {
          title: '项目名称（PMS）',
          dataIndex: 'pms_name',
          width: '150px',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          width: '150px'
        },
        {
          title: '资产编号',
          dataIndex: 'asset_code',
          width: '150px'
        },
        {
          title: '资产标签号',
          dataIndex: 'asset_label_num',
          width: '150px'
        },
        {
          title: '资产名称',
          dataIndex: 'asset_name',
          width: '150px'
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          width: '150px'
        },
        {
          title: '资产类别描述',
          dataIndex: 'asset_categor_desc',
          width: '150px'
        },
        {
          title: '折旧费用账户描述',
          dataIndex: 'depreciate_fee_acc_desc',
          width: '150px'
        },
        {
          title: '资产本期折旧',
          dataIndex: 'current_depreciate',
          width: '150px'
        },
        {
          title: '系统名称',
          dataIndex: 'system_name',
          width: '150px'
        },
        {
          title: '系统责任人',
          dataIndex: 'system_leader',
          width: '150px'
        },
        {
          title: '项目工时',
          dataIndex: 'proj_allhours',
          width: '150px'
        },
        {
          title: '总工时',
          dataIndex: 'allhours',
          width: '150px'
        },
        {
          title: '项目工时占比',
          dataIndex: 'proj_ratio',
          width: '150px',
          fixed: 'right'
        },
        {
          title: '折旧分摊额',
          dataIndex: 'depreciate_share_money',
          width: '150px',
          fixed: 'right'
        },
      );
      columnsImport.push(
        {
          title: '项目编号',
          dataIndex: 'proj_code',
          width: '150px',
        },
        {
          title: 'pms_code 14位',
          dataIndex: 'pms_code',
          width: '150px',
        },
        {
          title: 'pms编码名称',
          dataIndex: 'pms_name',
          width: '150px',
        },
        {
          title: '项目经理',
          dataIndex: 'proj_manager',
          width: '150px',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          width: '150px',
        },
        {
          title: '系统负责人',
          dataIndex: 'system_leader',
          width: '150px',
        },
        {
          title: '系统名称',
          dataIndex: 'system_name',
          width: '150px',
        },
        {
          title: '资产编号',
          dataIndex: 'asset_code',
          width: '150px',
        },
        {
          title: '资产名称',
          dataIndex: 'asset_name',
          width: '150px',
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          width: '150px',
        },
        {
          title: '资产类别描述',
          dataIndex: 'asset_categor_desc',
          width: '150px',
        },
        {
          title: '折旧费用账户描述',
          dataIndex: 'depreciate_fee_acc_desc',
          width: '150px',
        },
        {
          title: '资产本期折旧',
          dataIndex: 'current_depreciate',
          width: '150px',
        }
      )
    } else {
      columns.push(
        {
          title: '项目编号',
          dataIndex: 'proj_code',
          width: '150px',
          fixed: 'left'
        },
        {
          title: '项目名称',
          dataIndex: 'proj_name',
          width: '150px',
        },
        {
          title: '项目编号（PMS）',
          dataIndex: 'pms_code',
          width: '150px',
        },
        {
          title: '项目名称（PMS）',
          dataIndex: 'pms_name',
          width: '150px',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          width: '150px',
        },
        {
          title: '资产编号',
          dataIndex: 'asset_code',
          width: '150px',
        },
        {
          title: '资产标签号',
          dataIndex: 'asset_label_num',
          width: '150px',
        },
        {
          title: '资产名称',
          dataIndex: 'asset_name',
          width: '150px',
        },
        {
          title: '资产类别描述',
          dataIndex: 'asset_categor_desc',
          width: '150px',
        },
        {
          title: '折旧费用账户描述',
          dataIndex: 'depreciate_fee_acc_desc',
          width: '150px',
        },
        {
          title: '资产本期折旧',
          dataIndex: 'current_depreciate',
          width: '150px',
          render: (text, record) => {
            return (
              <EditItem isEdit={false} show={<MoneyComponentEditCell text={text}/>}
                        edit={<Input
                          defaultValue={text} maxLength="200"
                          onChange={(e) => {
                            this.itemChange(e, record)
                          }}
                        />}
                        disabled={false}
                        onOk={() => this.onCellChange(record, '1')}
                        onCancel={() => {
                        }}
              />
            )
          }
        },
        {
          title: '资产责任人员工编号',
          dataIndex: 'asset_leader_code',
          width: '150px',
        },
        {
          title: '资产责任人',
          dataIndex: 'asset_leader_name',
          width: '150px',
          fixed: 'right'
        },
        {
          title: '项目工时占比',
          dataIndex: 'ratio',
          width: '150px',
          fixed: 'right',
          render: (text, record) => {
            return (
              <EditItem isEdit={false} show={<MoneyComponentEditCell text={text}/>}
                        edit={<Input
                          defaultValue={text} maxLength="200"
                          onChange={(e) => {
                            this.itemChange(e, record)
                          }}
                        />}
                        disabled={false}
                        onOk={() => this.onCellChange(record, '2')}
                        onCancel={() => {
                        }}
              />
            )
          }
        },
        {
          title: '折旧分摊额',
          dataIndex: 'depreciate_share_money',
          width: '150px',
          fixed: 'right'
        },
        {
          title: '操作',
          width: '100px',
          fixed: 'right',
          render: (text, record) => <a onClick={() => {
            this.delete_data(record)
          }}>删除</a>
        }
      );
      columnsImport.push(
        {
          title: '资产账簿',
          dataIndex: 'asset_book',
          width: '150px',
        },
        {
          title: '资产编号',
          dataIndex: 'asset_code',
          width: '150px',
        },
        {
          title: '资产标签号',
          dataIndex: 'asset_label_num',
          width: '150px',
        },
        {
          title: '资产名称',
          dataIndex: 'asset_name',
          width: '150px'
        },
        {
          title: '是否拆分',
          dataIndex: 'is_it_split',
          width: '150px'
        },
        {
          title: '资产类别',
          dataIndex: 'asset_categor',
          width: '150px'
        },
        {
          title: '资产类别描述',
          dataIndex: 'asset_categor_desc',
          width: '150px'
        },
        {
          title: '制造商',
          dataIndex: 'manufacturer',
          width: '150px'
        },
        {
          title: '资产型号',
          dataIndex: 'asset_modelr',
          width: '150px'
        },
        {
          title: '资产数量',
          dataIndex: 'asset_num',
          width: '150px'
        },
        {
          title: '计量单位',
          dataIndex: 'unit',
          width: '150px'
        },
        {
          title: '资产关键字',
          dataIndex: 'asset_keword',
          width: '150px'
        },
        {
          title: '资产关键字描述',
          dataIndex: 'asset_keword_desc',
          width: '150px'
        },
        {
          title: '资产创建日期',
          dataIndex: 'asset_create_date',
          width: '150px'
        },
        {
          title: '资产启用日期',
          dataIndex: 'asset_enable_date',
          width: '150px'
        },
        {
          title: '按比例分摊日期',
          dataIndex: 'in_ratio_share_date',
          width: '150px',
        },
        {
          title: '折旧方法',
          dataIndex: 'depreciate_method',
          width: '150px',
        },
        {
          title: '使用年限',
          dataIndex: 'service_life',
          width: '150px',
        },
        {
          title: '剩余月数',
          dataIndex: 'surplus_month',
          width: '150px',
        },
        {
          title: '固定资产原值帐户',
          dataIndex: 'original_account',
          width: '150px'
        },
        {
          title: '固定资产原值帐户描述',
          dataIndex: 'original_account_desc',
          width: '150px'
        },
        {
          title: '固定资产累计折旧帐户',
          dataIndex: 'depreciat_account',
          width: '150px'
        },
        {
          title: '固定资产累计折旧帐户描述',
          dataIndex: 'depreciat_account_desc',
          width: '150px'
        },
        {
          title: '折旧费用帐户',
          dataIndex: 'depreciat_fee_account',
          width: '150px'
        },
        {
          title: '折旧费用帐户描述',
          dataIndex: 'depreciat_fee_account_desc',
          width: '150px'
        },
        {
          title: '资产成本',
          dataIndex: 'asset_cost',
          width: '150px'
        },
        {
          title: '资产净值',
          dataIndex: 'asset_net_value',
          width: '150px'
        },
        {
          title: '资产残值',
          dataIndex: 'asset_scrap_value',
          width: '150px'
        },
        {
          title: '资产本期折旧',
          dataIndex: 'asset_current_depreciate',
          width: '150px',
          render: (text, record) => {
            return (
              <EditItem isEdit={false} show={<MoneyComponentEditCell text={text}/>}
                        edit={<Input
                          defaultValue={text} maxLength="200"
                          onChange={(e) => {
                            this.itemChange(e, record)
                          }}
                        />}
                        disabled={false}
                        onOk={() => {
                          const {modelsSpace, dispatch} = this.props
                          dispatch({
                            type: `${modelsSpace}/amortize_asset_detail_report_update`,
                            query: {
                              arg_uuid: record.uuid,
                              arg_asset_current_depreciate: record['changedNewValue']
                            }
                          })
                        }}
                        onCancel={() => {
                        }}
              />
            )
          }
        },
        {
          title: '资产本年折旧',
          dataIndex: 'asset_current_year_depreciate',
          width: '150px'
        },
        {
          title: '资产累计折旧',
          dataIndex: 'asset_accumulat_depreciate',
          width: '150px'
        },
        {
          title: '资产减值准备',
          dataIndex: 'asset_depreciate_reserve',
          width: '150px',
        },
        {
          title: '员工编号',
          dataIndex: 'userid',
          width: '150px',
        },
        {
          title: '员工姓名',
          dataIndex: 'username',
          width: '150px'
        },
        {
          title: '所属区域',
          dataIndex: 'area',
          width: '150px'
        },
        {
          title: '所属区域描述',
          dataIndex: 'area_desc',
          width: '150px'
        },
        {
          title: '所在地点',
          dataIndex: 'place',
          width: '150px'
        },
        {
          title: '所在地点描述',
          dataIndex: 'place_desc',
          width: '150px'
        },
        {
          title: '使用状态',
          dataIndex: 'use_state',
          width: '150px'
        },
        {
          title: '使用状态描述',
          dataIndex: 'use_state_desc',
          width: '150px'
        },
        {
          title: '期初资产卡片编号',
          dataIndex: 'first_asset_card_code',
          width: '150px'
        },
        {
          title: '产权凭证号',
          dataIndex: 'property_right_code',
          width: '150px',
        },
        {
          title: '设备编号',
          dataIndex: 'equipment_code',
          width: '150px',
        },

        {
          title: '专业属性',
          dataIndex: 'professional_attribute',
          width: '150px',
        },
        {
          title: '专业类型',
          dataIndex: 'professional_type',
          width: '150px',
        },
        {
          title: '资产来源',
          dataIndex: 'asset_source',
          width: '150px',
        },
        {
          title: '资产归属',
          dataIndex: 'asset_ascription',
          width: '150px'
        },
        {
          title: '扩容改造项目',
          dataIndex: 'expansion_renovate_proj',
          width: '150px'
        },
        {
          title: '扩容改造项目描述',
          dataIndex: 'expansion_renovate_proj_desc',
          width: '150px'
        },
        {
          title: '折旧状态',
          dataIndex: 'depreciate_state',
          width: '150px'
        },
        {
          title: '评估净值',
          dataIndex: 'assess_net_value',
          width: '150px'
        },
        {
          title: '评估后尚可使用月份',
          dataIndex: 'assess_after_use_month',
          width: '150px'
        },
        {
          title: '附加信息一',
          dataIndex: 'add_info_one',
          width: '150px'
        },
        {
          title: '附加信息二',
          dataIndex: 'add_info_two',
          width: '150px'
        },
        {
          title: '附加信息三',
          dataIndex: 'add_info_three',
          width: '150px'
        },
        {
          title: '财税差异类型',
          dataIndex: 'finance_tax_diff_type',
          width: '150px'
        },
        {
          title: '附属设备及附件',
          dataIndex: 'accessory',
          width: '150px'
        },
        {
          title: '辅助数量',
          dataIndex: 'auxiliary_num',
          width: '150px',
        },
        {
          title: '计量单位',
          dataIndex: 'auxiliary_unit',
          width: '150px',
        },
        {
          title: '项目编号',
          dataIndex: 'proj_code',
          width: '150px',
        },
        {
          title: '项目编号描述',
          dataIndex: 'proj_code_desc',
          width: '150px',
        },
        {
          title: '期初工程项目编号',
          dataIndex: 'first_proj_code',
          width: '150px',
        },
        {
          title: '资产专业管理部门',
          dataIndex: 'asset_manage_dept',
          width: '150px'
        }
      );
    }
    let importExl = {
      action: modelsSpace === 'equipment' ? "/microservice/cosservice/importAmortize/importRegistFormOfProjectAssetsUse" : "/microservice/cosservice/importAmortize/importAssetDetailReport",
      method: "POST",
      data:
        {
          arg_user_id: cookies.get('userid'),
          arg_user_name: cookies.get('username'),
          arg_year: yearMonth.format('YYYY-MM').split('-')[0],
          arg_month: yearMonth.format('YYYY-MM').split('-')[1],
          arg_ou_name: ou,
          //arg_ou_code:ouList.length && ouList.find(i=>i.ou_name === ou ).hasOwnProperty('ou_code')?ouList.find(i=>i.ou_name === ou ).ou_code:'',
        },
      name: "outSource",
      multiple: false,
      showUploadList: false,
      accept: '.xlsx,.xls',
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode === '1') {
            message.info('导入成功！');
            dispatch({
              type: `${modelsSpace}/queryImport`,
            })
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败！`);
          } else if (info.file.response.RetCode === '0') {
            message.info(info.file.response.RetVal);
          }
        }
      }
    };

    return (
      <Spin spinning={this.props.loading}>
        <div className={style.wrap}>
          <div>
            <div style={{marginBottom: '10px'}}>
              <div className={style.title}>
                年月：
                <MonthPicker
                  onChange={(value) => this.changeState(value, 'yearMonth')}//1查询数据导入，2查询数据生成
                  value={yearMonth}
                  allowClear={false}
                />
              </div>
              <div className={style.title}>
                OU：
                <Select style={{width: 160}} value={ou} onSelect={(value) => this.changeState(value, 'ou')}>
                  {ouList.map((item) => {
                    return (<Option key={item.dept_name}>{item.dept_name}</Option>)
                  })}
                </Select>
              </div>
            </div>
            {
              ou === cookies.get('OU') ?
                <Tabs activeKey={activityKey} onChange={this.changeTab}>
                  <TabPane tab={modelsSpace === 'equipment' ? 'IT设备及通用软件原始数据维护' : '办公设备原始数据维护'} key="1">
                    <div>
                      <Upload {...importExl}>
                        <Button type="primary">导入</Button>
                      </Upload>
                      <Button type="primary" onClick={this.downM} style={{margin: '0 10px'}}>模板下载</Button>
                    </div>
                    <div style={{marginTop: '10px'}}>
                      <Table columns={columnsImport}
                             dataSource={importList}
                             scroll={{x: importObjScroll, y: 500}}
                             className={styles.financeTable}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab={modelsSpace === 'equipment' ? 'IT设备及通用软件摊销' : '办公设备摊销'} key="2">
                    <div>
                      {modelsSpace === 'equipment' ? null
                        : <div style={{display: 'inline-block'}}>
                          项目类型：
                          <Select defaultValue={'1'} value={this.props.state.proj_type} style={{width: 120}}
                                  onChange={this.proj_type_change}>
                            <Option value='0'>全部项目</Option>
                            <Option value="1">科创项目</Option>
                            <Option value="2">普通项目</Option>
                          </Select>&nbsp;&nbsp;
                          {
                            this.props.state.proj_type === '1' ?
                              <div style={{display: 'inline-block'}}>
                                PMS编码：
                                <div style={{display: 'inline-block', width: 200}}>
                                  <Input value={this.props.state.pms_code} name='pms_code' onChange={this.input_pms_code_change}/>
                                </div>
                                &nbsp;&nbsp;
                                PMS名称：
                                <div style={{display: 'inline-block', width: 200}}>
                                  <Input value={this.props.state.pms_name} name='pms_name' onChange={this.input_pms_name_change}/>
                                </div>
                                &nbsp;&nbsp;
                                <Button type='primary'
                                        onClick={this.query_by_pmscode_or_pmsname}>查询</Button> &nbsp;&nbsp;
                              </div>
                              :
                              null
                          }
                          {
                            this.props.state.proj_type === '2' ?
                              <div style={{display: 'inline-block'}}>
                                项目编码：
                                <div style={{display: 'inline-block', width: 200}}>
                                  <Input value={this.props.state.pms_code} name='pro_code' onChange={this.input_pms_code_change}/></div>
                                &nbsp;&nbsp;
                                项目名称：
                                <div style={{display: 'inline-block', width: 200}}>
                                  <Input value={this.props.state.pms_name} name='pro_name' onChange={this.input_pms_name_change}/></div>
                                &nbsp;&nbsp;
                                <Button type='primary'
                                        onClick={this.query_by_pmscode_or_pmsname}>查询</Button> &nbsp;&nbsp;
                              </div>
                              :
                              null
                          }
                        </div>
                      }
                      <Button type="primary" style={{marginRight: '10px'}} onClick={this.genData}
                              loading={genDataLoadings}
                              disabled={all_count > 0 || this.props.state.proj_type === '0'}>生成</Button>
                      <Button type="primary" disabled={all_count <= 0 || this.props.state.proj_type === '0'}
                              onClick={this.delData} style={{marginRight: '10px'}}>撤销</Button>
                      <Button disabled={!list.length} type="primary" onClick={this.exportData}>导出</Button>
                    </div>
                    <div style={{marginTop: '10px'}}>
                      <Table columns={columns}
                             dataSource={list}
                             scroll={{x: objScroll, y: 500}}
                             className={styles.financeTable}
                      />
                    </div>
                    <div id="table1" style={{display: 'none'}}>
                      <Table columns={columns}
                             dataSource={list}
                             pagination={false}
                      />
                    </div>
                    <div style={{marginTop: '10px', color: 'red'}}>您取到的有效工时数据截止到：{remark}</div>
                  </TabPane>
                </Tabs>
                :
                <div style={{marginTop: '20px'}}>
                  <Table columns={columns}
                         dataSource={list}
                         scroll={{x: objScroll, y: 500}}
                         className={styles.financeTable}
                  />
                </div>
            }
          </div>
        </div>
      </Spin>
    );
  }
}
