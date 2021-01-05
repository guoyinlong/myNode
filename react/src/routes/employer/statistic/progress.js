/**
 * 作者：陈莲
 * 日期：2017-11-07
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：个人考核考核状态柱状图显示
 */
import React from 'react';
import {connect} from 'dva';
import {Table, Select, Button,Icon,Tooltip} from 'antd';
import message from '../../../components/commonApp/message'
const Option = Select.Option;
const {Column} = Table;
import styles from '../../../components/common/table.less'
import Style from '../../../components/employer/employer.less'
import {exportExlValue} from "./exportExlValue"
import {exportExlCheck} from "./exportExlCheck"
import StateEchart from './stateEchart'
import { Spin } from 'antd';

/**
 * 作者：陈莲
 * 日期：2017-11-07
 * 邮箱：chenl192@chinaunicom.cn
 * 功能：表格和柱状图切换
 */
class SwitchBarTable extends React.Component {
  render() {
    const {ischeck, checkList, valueList,ou,temp} = this.props;
    if (ischeck == 1) {
      return (
        <div>
          <StateEchart checkList={checkList} ou={ou} temp={temp} ischeck={ischeck}/>
        </div>);
    } else {
      return (
        <div>
        <StateEchart valueList={valueList} ou={ou} temp={temp} ischeck={ischeck}/>
      </div>);
    }
  }
}
/**
 * 作者：陈莲
 * 日期：2017-11-07
 * 邮箱：chenl192@chinaunicom.cn
 * 功能：指标填表和指标评价转化
 */
class SwitchTable extends React.Component {
  render() {
    const {list, loading} = this.props;

      return (
        <div>
          <Table dataSource={list} pagination={false} className={styles.orderTable} loading={loading} style={{marginTop:'25px'}}>
            <Column
              title="部门"
              dataIndex="dept_name"
              key="dept_name"
              render={(text, record) => record.dept_name.split('-')[1]}
              width="240px"
            />
            <Column
              title="领导"
              dataIndex="staff_name"
              key="staff_name"
              width="240px"
            />
            <Column
              title="未填报"
              dataIndex="nofill"
              className="nofill"
              key="nofill"
              render={(text, record) => {
                return <div style={{textAlign:'center',cursor:'pointer'}}>{text}</div>
              }}
              width="150px"
            />
            <Column
              title="已填报"
              dataIndex="filled"
              key="filled"
              width="150px"
            />

            <Column
              title="合计"
              dataIndex="count"
              key="count"
              width="150px"
            />
          </Table>
        </div>
      );

  }
}
/**
 * 作者：陈莲
 * 日期：2017-11-07
 * 邮箱：chenl192@chinaunicom.cn
 * 功能：实现考核状态展示
 */
class progress extends React.Component {


  /**
   * 作者：陈莲
   * 日期：2017-11-07
   * 邮箱：chenl192@chinaunicom.cn
   * 功能：初始化，导出数据--指标填报，指标评价
   */
  exportExl2 = () => {
    const {checkList, valueList} = this.props;
    const data1 = {"title": [{"value": "部门"}, {"value": "未填报"}, {"value": "已填报"}, {"value": "待审核"}, {"value": "已审核"}, {"value": "合计"}]};
    const data2 = {"title": [{"value": "部门"}, {"value": "完成情况已填报"}, {"value": "待评价"}, {"value": "待评级"}, {"value": "考核完成"}, {"value": "合计"}]};
    if (checkList != null && checkList.length != 0) {
      exportExlCheck(checkList, "指标填报情况", data1.title)
    } else if (valueList != null && valueList.length != 0) {
      exportExlValue(valueList, "指标评价情况", data2.title)
    } else {
      message.info("查询结果为空！")
    }
  };

  render() {
    const {list, loading} = this.props;

    let yearOption = [];
    for (let i = 2015, j = Number(new Date().getFullYear()); i <= j; i++) {
      yearOption.push(<Option value={i.toString()} key={i}>{i.toString()}</Option>)
    }

    return (
      <div className={Style.wrap} style={{whiteSpace: 'nowrap', overflowX: 'auto'}}>
        <div style={{textAlign: 'left'}}>
          考核阶段：
          <Select showSearch style={{width: 200}}
                  onSelect={this.handleChange2} defaultValue="支撑服务满意度评价">
            <Option value="0">支撑服务满意度评价</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          考核年度：
          <Select showSearch style={{width: 70}} onSelect={this.handleChange3}
                  defaultValue={new Date().getFullYear().toString()}>
            {yearOption}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" icon="search">查询</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <h3 style={{textAlign: 'left', marginTop: '20px', fontSize: '29px', fontFamily: '宋体', fontWeight: 'bold'}}>
          支撑服务满意度评价
        </h3>&nbsp;&nbsp;&nbsp;&nbsp;
        <div>
        <SwitchTable  list={list}  loading={loading}/>
        <div style={{textAlign: "right", marginTop: '10px'}}><Button type="primary" icon="download"
             onClick={this.exportExl2}>导出</Button></div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const {list} = state.statistic;
  if (list.length) {
    list.map((i, index) => {
      i.key = index;
    })
  }
  return {
    loading: state.loading.models.statistic,
    list,
  };
}

export default connect(mapStateToProps)(progress);
