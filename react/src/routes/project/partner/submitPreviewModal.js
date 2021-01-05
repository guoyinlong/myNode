/**
 * 作者：张枫
 * 创建日期：2019-02-20
 * 邮箱：zhangf142@chinaunicom.cn
 * 文件说明：工作量填报和服务评价预览table
 */

import { Table} from 'antd'
export default class workLoadServiceTable extends React.Component {

  constructor(props){
    super(props)
    this.state={
    }
  }
  columns = [{
    title: '月份',
    dataIndex: '',
    key: '',
  }, {
    title: '合作伙伴',
    dataIndex: '',
    key: '',
  }, {
    title: '高级工作量',
    chlidren:[{
      title: '标准',
      dataIndex: '',
      key: '',
    },{
      title: '额外',
      dataIndex: '',
      key: '',
    },{
      title: '合计',
      dataIndex: '',
      key: '',
    }],
  },{
    title: '中级工作量',
    chlidren:[{
      title: '标准',
      dataIndex: '',
      key: '',
    },{
      title: '额外',
      dataIndex: '',
      key: '',
    },{
      title: '合计',
      dataIndex: '',
      key: '',
    }],
  },{
    title: '初级工作量',
    chlidren:[{
      title: '标准',
      dataIndex: '',
      key: '',
    },{
      title: '额外',
      dataIndex: '',
      key: '',
    },{
      title: '合计',
      dataIndex: '',
      key: '',
    }],
  },{
    title: '服务评价',
    chlidren:[{
      title: '团队能力表现',
      dataIndex: '',
      key: '',
    },{
      title: '出勤率',
      dataIndex: '',
      key: '',
    },{
      title: '交付时率',
      dataIndex: '',
      key: '',
    },{
      title: '交付时率',
      dataIndex: '',
      key: '',
    },{
      title: '交付质量',
      dataIndex: '',
      key: '',
    },{
      title: '内部管理能力',
      dataIndex: '',
      key: '',
    },{
      title: '总分',
      dataIndex: '',
      key: '',
    }],
  }];
  render() {
    return (
      <Modal visible = {this.props.ceshi}>
        <Table
          columns = {columns}

        >

        </Table>
      </Modal>
    );
  }
}
