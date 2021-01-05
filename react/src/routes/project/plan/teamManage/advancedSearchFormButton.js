/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AdvancedSearchFormButton({handleReset, handleSearch, isCaiHao}) {
    return (
        <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginLeft: 8 }} onClick={handleReset}>重置条件</Button>
                <Button type="primary" style={{ marginLeft: 8,display: (isCaiHao?'inline':'none')}} onClick={handleSearch}>归口部门项目人员信息</Button>
            </Col>
        </Row>
    );
}
export default AdvancedSearchFormButton;
