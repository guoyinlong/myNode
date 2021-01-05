/*
 * 作者：刘东旭
 * 邮箱：liudx100@chinaunicom.cnyy
 * 日期：2017-10-24
 * 说明：加计扣除-首页列表(v1.0)
 */

import React from 'react'; //引入react
import {Table, Button} from 'antd'; //从antd中引入所有需要的组件

/*
 * 作者：刘东旭
 * 日期：2017-10-11
 * 功能：表格组件实现报表简要信息展示
 */
export default class ListContent extends React.Component {

  render() {
    const {DataRows} = this.props.data;
    const {data} = this.props;
    let dataContent;
    if (DataRows !== undefined) {
      dataContent = DataRows.map((item, index) => ({
        key:index,
        projectName: item.proj_name,
        projectAllType: item.proj_type + item.fee_type,
        projectType: item.proj_type ,
        feeType: item.fee_type,
        projectCode: item.pms_code,
        projectOu: item.ou,
        projectFlag: item.flag, // 1 已审核 2未审核 0 项目未生成
        projectBeginTime: item.begin_time,
        projectEndTime: item.end_time,
        projectDate: data.year + '-' + data.month,
      }))
    }

    const columns = [
      /*      {
              dataIndex: 'proj_name',
              key: 'proj_name',
              render: (text, record) => <p style={{textAlign: 'left'}}><b>{text}</b></p>
            },*/
      {
        dataIndex: 'projectCode',
        key: 'projectCode',
        render: (text, record) => <p style={{textAlign: 'left'}}><b>{text}</b></p>
      },
      {dataIndex: 'projectAllType', key: 'projectAllType'},
      {
        dataIndex: 'projectFlag', key: 'projectFlag', render: (text, record) => {
          switch (text) {
            case '0':
              return '未生成';
              break;
            case '1':
              return '已审核';
              break;
            case '2':
              return '未审核';
              break
          }
        }
      },

      {dataIndex: 'projectDate', key: 'projectDate'},
      {
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          return (
            record.projectFlag ==='0' ? <Button type="primary" size="small" onClick={() => {
                this.props.createData(record, index)
              }}>生成</Button> :
              <Button type="primary" size="small" onClick={() => {
                this.props.lookDetail(record)
              }}>查看</Button>
          )
        }
      },
    ];

    return (
      <div>
        <Table
          dataSource={dataContent}
          showHeader={false}
          defaultExpandAllRows={true}
          columns={columns}
        />
      </div>
    );
  }
}






