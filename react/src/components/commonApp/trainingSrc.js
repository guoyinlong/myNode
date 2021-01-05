/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料、常用表单组件
 */
import React from 'react';
import { Link } from 'dva/router';
import { Table, Button } from 'antd';
import styles from './trainingSrc.css';


class TrainingSrcTable extends React.Component {
  state = {
    selectedRowKeys: [],  // Check here to configure the default column
    loading: false,
  };
  getData=()=>{
    return this.state.selectedRowKeys;
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  render () {
    const {columns,listInfo} = this.props;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={styles.TableContainer}>
        <div style={{ marginBottom: 16 }}>
         <span>
           <Button
             type="primary"
             onClick={this.props.fileLoadLot}
             disabled={!hasSelected}
             loading={loading}
           >
             批量下载
           </Button>
           <span style={{ marginLeft: 8 }}>
             {hasSelected ? `选中了 ${selectedRowKeys.length} 条记录` : ''}
           </span>
         </span>
         <span>&nbsp;&nbsp;共有{listInfo.length}条记录</span>
       </div>
       <Table rowSelection={rowSelection}
        columns={columns} loading={this.props.loading}
        dataSource={listInfo}
        />
      </div>
    )
  }
}

TrainingSrcTable.propTypes={

}

export default TrainingSrcTable;
