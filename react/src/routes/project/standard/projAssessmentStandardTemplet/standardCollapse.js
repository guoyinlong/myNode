/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Collapse  } from 'antd';
import StandardCard from './standardCard';
import styles from '../projAssessmentStandard.less';
import moment from 'moment';
const Panel = Collapse.Panel;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function StandardCollapse({templetList,handleClick}) {
    const pannel = templetList.map((item, index) => {
        return (
            <Panel header={item.year+'年度'} key={index}>
                <StandardCard year={item.year} seasons={item.season} handleClick={handleClick}></StandardCard>
            </Panel>
        )
    })
    return (
        <Collapse className={styles['collapse']} bordered={false}  defaultActiveKey={['0','1']}>
            {pannel}
        </Collapse>
    );
}
export default StandardCollapse;
