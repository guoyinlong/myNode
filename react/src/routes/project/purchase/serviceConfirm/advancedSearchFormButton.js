/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：
 */
import React from 'react';
import { Row, Col, Button, Icon } from 'antd';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AdvancedSearchFormButton({handleSubmit,flag}) {
    return (
        <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginLeft: 8 }} onClick={handleSubmit} disabled={flag}>提交</Button>
            </Col>
        </Row>
    );
}
export default AdvancedSearchFormButton;
