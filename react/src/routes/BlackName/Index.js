/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：黑名单查询主页
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon, Button } from 'antd';
import FormModal from './FormModal';

import ChartModal from './ChartModal';
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：页面组件
 */
function BlackName({dispatch, location, formData,chartData}) {
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：查询请求
     * @param values 手机号
     */
  function fetchHandler(values) {
    dispatch({ type: 'blackName/query', payload: values });
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：清除请求
   */
  function clearHandler() {
    dispatch({ type: 'blackName/clear'});
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：查询服务数据请求
   */
  function refreshhandler() {
    dispatch({ type: 'blackName/report'});
  }
  return (
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
            <div className="gutter-box">
                <Card title="黑名单查询" bordered={false} style={{height: '395.98px', width: '100%'}}>
                    <FormModal formData={formData} onOk={fetchHandler} onClear={clearHandler}/>
                </Card>
            </div>
        </Col>
        <Col className="gutter-row" span={12}>
            <div className="gutter-box">
                <Card title="查询分析" extra={<Button onClick={refreshhandler}>刷新</Button>} bordered={false}>
                    <ChartModal chartData={chartData}/>
                </Card>
            </div>
        </Col>
      </Row>

  );
}
function mapStateToProps(state) {
  const { formData,chartData} = state.blackName;
  return {
    loading: state.loading.models.blackName,
    formData,
    chartData
  };
}

export default connect(mapStateToProps)(BlackName);
