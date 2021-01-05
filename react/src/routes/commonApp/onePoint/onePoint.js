/*
 * 作者：刘东旭
 * 邮箱：liudx100@chinaunicom.cn
 * 日期：2017-10-21
 * 说明：一点看全(v1.0)
 */

import React from 'react' //引入react
import {connect} from 'dva'; //从dva引入connect
import {Row, Col, Card, Table, Badge} from 'antd'; //引入antd中的Row、Col组件
import style from './onePoint.less'; //引入样式文件
import NewServlet from '../../../components/commonApp/onePoint/newServlet'; //引入全成本组件
import Profits from '../../../components/commonApp/onePoint/profits'; //引入模拟利润组件
import Capacity from '../../../components/commonApp/onePoint/capacity'; //引入人均产能组件
import Pie from '../../../components/commonApp/onePoint/pie'; //引项目类型组件
import InputOutput from '../../../components/commonApp/onePoint/inputOutput'; //引项目类型组件

//初始化当前页面总组件OnePoint
class OnePoint extends React.Component {

  //渲染组件
  render() {
    /*==== KPI ====*/
    //公共表头
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        render: (text) => {
          return (
            <span>{text + 1}</span>
          )
        }
      },

      {
        title: '指标名称',
        dataIndex: 'kpi_name',
        key: 'kpi_name'
      }, {
        title: '目标值',
        dataIndex: 'kpi_target',
        key: 'kpi_target',
      }, {
        title: '实际值',
        dataIndex: 'kpi_finish',
        key: 'kpi_finish',
      }, {
        title: <div>评分</div>,
        dataIndex: 'kpi_score',
        key: 'kpi_score',
        render: (text) => {
          return (
            text > 95 ?
              (
                <span className={style.ratingLabel} style={{backgroundColor: '#00aacc'}}>{text}</span>
              )
              : (
                text < 95 && text > 90 ?
                  (<span className={style.ratingLabel} style={{backgroundColor: '#ffbf00',}}>{text}</span>)
                  : (
                    text < 90 && text > 85 ?
                      (<span className={style.ratingLabel} style={{backgroundColor: '#ff6600',}}>{text}</span>)
                      : (
                        text < 85 ?
                          (<span className={style.ratingLabel} style={{backgroundColor: '#ff0000',}}>{text}</span>)
                          : (<span>{text}</span>))
                  )
              )
          )
        }
      }];
    //==== 企发部 ====

    const {enterprise} = this.props;

//获取截至时间&防止key缺失警告
    let enterpriseTime;
    if (enterprise.length !== 0) {
      enterpriseTime = enterprise[0].total_year + '年' + enterprise[0].total_month + '月';
      enterprise.map((i, index) => {
        i.key = index;
      })
    }
    //将数据分为奇偶渲染进左右两个table里

    let enterpriseOtherNum = Math.ceil(enterprise.length / 2);
    let enterpriseLeft = enterprise.slice(0, enterpriseOtherNum);
    let enterpriseRight = enterprise.slice(enterpriseOtherNum);

    //==== 企发部 end ====
    //==== 信息化部 ====
    const {infoDept} = this.props;

    //获取截至时间&防止key缺失警告
    let infoDeptTime;
    if (infoDept.length !== 0) {
      //获取截至时间
      infoDeptTime = infoDept[0].total_year + '年' + infoDept[0].total_month + '月';
      infoDept.map((i, index) => {
        i.key = index;
      })
    }
    //将数据分为奇偶渲染进左右两个table里

    let infoDeptOtherNum = Math.ceil(infoDept.length / 2);
    let infoDeptLeft = infoDept.slice(0, infoDeptOtherNum);
    let infoDeptRight = infoDept.slice(infoDeptOtherNum);


    //==== 信息化部 end ====
    /*==== KPI END ====*/


    /*==== GS任务部分 ====*/
    //将数据重新封装
    const {gs} = this.props;

    //获取截至时间&防止key缺失警告
    let gsTime;
    if (gs.length !== 0) {
      //获取截至时间
      gsTime = gs[0].total_year + '年' + gs[0].total_month + '月';
      gs.map((i, index) => {
        i.key = index;
      })
    }

    //嵌套子表格外层
    function NestedTable() {
      //子表格内层
      const expandedRowRender = (item) => {
        const childData = JSON.parse(item.gsinfo); //将得到的子级数据格式化
        //防止key缺失警告
        if (childData.length !== 0) {
          childData.map((i, index) => {
            i.key = index;
          })
        }
        //设定子表格标题及内容项
        const columns = [
          {
            title: '序号', dataIndex: 'key', key: 'key', render: (text) => {
            return (
              <span>{text + 1}</span>
            )
          }
          },
          {title: '名称', dataIndex: 'kpi_content', key: 'kpi_content', width: '60%', style: {paddingLeft: 16}},
          {title: '状态', dataIndex: 'wp_status', key: 'wp_status',},
          {title: '负责人', dataIndex: 'staff_name', key: 'staff_name'}
        ];
        //渲染子表格
        return (
          <Table
            className={style.GSChild}
            columns={columns}
            dataSource={childData}
            pagination={false}
            size="small"
          />
        );
      };
      //设定父表格标题及内容项
      const columns = [
        {title: '院/部门', dataIndex: 'dept_name', key: 'dept_name'},
        {title: '重点GS任务数', dataIndex: 'gs_task_count', key: 'gs_task_count'},
        {title: '正常进展任务数', dataIndex: 'gs_tasking_count', key: 'gs_tasking_count'},
        {title: '有问题（风险）任务数', dataIndex: 'gs_task_problem_count', key: 'gs_task_problem_count'}
      ];

      //渲染父表格
      return (
        <Table
          className={style.GSTable}
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={gs}
          pagination={false}
          size="small"
        />
      );
    }
    /*==== GS任务部分 END ====*/


    /*==== 项目类别部分 ====*/
    const projectColumns = [
      {
        title: '项目类别名称',
        dataIndex: 'proj_type_name',
        key: 'proj_type_name'
      }, {
        title: '类型',
        dataIndex: 'proj_type_code',
        key: 'proj_type_code',
      }, {
        title: '项目数量',
        dataIndex: 'proj_type_count',
        key: 'proj_type_count',
      }, {
        title: '投资替代额',
        dataIndex: 'replace_money',
        key: 'replace_money'
      }];

    const {projectType} = this.props;
    //防止key缺失警告
    if (projectType.length !== 0) {
      projectType.map((i, index) => {
        i.key = index;
      })
    }
    /*==== 项目类别部分 END ====*/

    return (
      <div>
        <Card title={<div>企发部指标完成情况 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>截至时间：{enterpriseTime}</span></div>} bordered={false} className={style.mb16}>
          <Row>
            <Col style={{width: '48%', float: 'left'}}>
              <Table columns={columns} dataSource={enterpriseLeft} pagination={false} size="small" className={`${style.GSTable} ${style.KPITable}`}/>
            </Col>
            <Col style={{width: '4%', float: 'left'}}>
              <div style={{width: '1px', height: 150, backgroundColor: '#dddddd', padding: 0, margin: '13px auto'}}> </div>
            </Col>
            <Col style={{width: '48%', float: 'left'}}>
              <Table columns={columns} dataSource={enterpriseRight} pagination={false} size="small" className={`${style.GSTable} ${style.KPITable}`}/>
            </Col>
          </Row>
        </Card>

        <Card title={<div>信息化部部指标完成情况 <span
          style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>截至时间：{infoDeptTime}</span></div>}
              bordered={false} className={style.mb16}>
          <Row>
            <Col style={{width: '48%', float: 'left'}}>
              <Table columns={columns} dataSource={infoDeptLeft} pagination={false} size="small" className={`${style.GSTable} ${style.KPITable}`}/>
            </Col>
            <Col style={{width: '4%', float: 'left'}}>
              <div style={{width: '1px', height: 212, backgroundColor: '#dddddd', padding: 0, margin: '13px auto'}}> </div>
            </Col>
            <Col style={{width: '48%', float: 'left'}}>
              <Table columns={columns} dataSource={infoDeptRight} pagination={false} size="small" className={`${style.GSTable} ${style.KPITable}`}/>
            </Col>
          </Row>
        </Card>

        <Card title="全成本" bordered={false} className={style.mb16}>
          <Row gutter={16}>
            <Col span={12}>
              <InputOutput/>
            </Col>
            <Col span={12}>
              <NewServlet/>
            </Col>
          </Row>
        </Card>

        <Card title="项目类别分布" bordered={false} className={style.mb16}>
          <Row gutter={16}>
            <Col span={12}>
              <Table columns={projectColumns} dataSource={projectType} pagination={false} size="small" className={`${style.GSTable} ${style.projTable}`}/>
            </Col>
            <Col span={12}>
              <Pie/>
            </Col>
          </Row>
        </Card>

        <Row gutter={16} className={style.mb16}>
          <Col span={12}>
            <Card title={<div>模拟利润 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>单位：万元</span></div>} bordered={false}>
              <Profits/>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<div>人均产能 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>单位：万元</span></div>} bordered={false}>
              <Capacity/>
            </Card>
          </Col>
        </Row>

        <Row className={style.mb16}>
          <Card title={<div>GS重点工作任务 <span style={{fontSize: '14px', marginLeft: '1em', fontWeight: 'normal'}}>截至时间：{gsTime}</span></div>} bordered={false}>
            <NestedTable/>
          </Card>
        </Row>

      </div>
    )
  }
}

function mapStateToProps(state) {
  const {gs, enterprise, infoDept, projectType, ratio} = state.onePoint;

  return {
    gs, enterprise, infoDept, projectType, ratio
  }
}

export default connect(mapStateToProps)(OnePoint);
