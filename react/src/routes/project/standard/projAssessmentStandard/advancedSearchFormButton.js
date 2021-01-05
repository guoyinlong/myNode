/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import styles from '../projAssessmentStandard.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AdvancedSearchFormButton(data) {
    const {handleReset} = data;
    return (
        <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginLeft: 8 }} onClick={handleReset}>重置条件</Button>
            </Col>
        </Row>
    );
}
export default AdvancedSearchFormButton;
