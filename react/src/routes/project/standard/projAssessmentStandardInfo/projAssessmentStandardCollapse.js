/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from "react";
import { Form, Row, Col, Input, Button, Icon, Collapse } from "antd";
import AssessmentStandardCard from "./projAssessmentStandardCard";
import styles from "../projAssessmentStandard.less";
import moment from "moment";

const Panel = Collapse.Panel;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AssessmentStandardCollapse({ seasons, projectId, handleCardDetail }) {
  /**
   * 作者：张建鹏
   * 日期：2020-06-15
   * 功能：时间顺序倒序展示
   */

  for (let i = 0; i < seasons.length - 1; i++) {
    console.log(seasons[i]);
    if (Number(seasons[i].key) > Number(seasons[i + 1].key)) {
      var temp = seasons[i];
      seasons[i] = seasons[i + 1];
      seasons[i + 1] = temp;
    }
  }
  // console.log("-------------------------------------------------");
  const pannel = seasons.map((item, index) => {
    return (
      <Panel header={item.key} key={index}>
        <AssessmentStandardCard
          projectId={projectId}
          year={item.key}
          seasons={item.value}
          handleCardDetail={handleCardDetail}
        ></AssessmentStandardCard>
      </Panel>
    );
  });
  return (
    <Collapse bordered={false} defaultActiveKey={["0", "1"]}>
      {pannel}
    </Collapse>
  );
}
export default AssessmentStandardCollapse;
