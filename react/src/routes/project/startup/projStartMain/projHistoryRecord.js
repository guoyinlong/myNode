/**
 * 作者：邓广晖
 * 创建日期：2018-01-24
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动里面已立项的历史记录查询
 */
import React from 'react';
import {Select,Table,Pagination,Spin,Tooltip} from 'antd';
import styles from './projStartMain.less';
import config from '../../../../utils/config';
const Option = Select.Option;

/**
 * 作者：邓广晖
 * 创建日期：2018-01-24
 * 功能：实现项目启动已立项的历史记录
 */
class ProjHistoryRecord extends React.PureComponent {

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-24
   * 功能：剪切文字超过指定字数时的前面文字
   * @param s 输入的文字
   * @param l 指定的长度
   * @param tag 指定省略号
   */
  cutString = (s, l, tag) => {
    if (s.length > l) {
      return s.substring(0, l) + tag;
    } else {
      return s;
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-24
   * 功能：设置条件参数
   * @param value 参数值
   * @param condType 条件类型，具体的参数对应值
   */
  setCondParam = (value,condType)=> {
    const {dispatch} = this.props;
    dispatch({
      type:'projStartMainPage/setHistoryCondParam',
      value:value,
      condType:condType
    });
  };

  columns = [
    {
      title: '序号',
      dataIndex: '',
      width:'5%',
      render: (text, record, index) => {
        return index + 1;
      }
    },{
      title: '修改模块',
      dataIndex: 'modulename',
      width:'11%',
      render: (text, record, index) => {
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },{
      title: '修改项',
      dataIndex: 'tbfield',
      width:'20%',
      render: (text, record, index) => {
        if(text !== undefined && text.length > 30){
          return (
            <Tooltip title={text}>
              <div style={{textAlign:'left'}}>{this.cutString(text,30,'...')}</div>
            </Tooltip>
          );
        }else{
          return <div style={{textAlign:'left'}}>{text}</div>
        }
      }
    },{
      title: '操作',
      dataIndex: 'opttype',
      width:'5%',
      render: (text, record, index) => {
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },{
      title: '修改前',
      dataIndex: 'lastoptval',
      width:'10%',
      render: (text, record, index) => {
        if(text !== undefined && text.length > 12){
          return (
            <Tooltip title={text}>
              <div style={{textAlign:'left'}}>{this.cutString(text,12,'...')}</div>
            </Tooltip>
          );
        }else{
          return <div style={{textAlign:'left'}}>{text}</div>
        }
      }
    },{
      title: '修改后',
      dataIndex: 'optval',
      width:'10%',
      render: (text, record, index) => {
        if(text !== undefined && text.length > 12){
          return (
            <Tooltip title={text}>
              <div style={{textAlign:'left'}}>{this.cutString(text,12,'...')}</div>
            </Tooltip>
          );
        }else{
          return <div style={{textAlign:'left'}}>{text}</div>
        }
      }
    },{
      title: '修改人',
      dataIndex: 'optusername',
      width:'7%',
      render: (text, record, index) => {
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },{
      title:'修改时间',
      dataIndex:'opttime',
      width:'13%',
      render: (text, record, index) => {
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },{
      title:'修改原因',
      dataIndex:'change_reason',
      width:'10%',
      render: (text, record, index) => {
        if(text !== undefined && text.length > 12){
          return (
            <Tooltip title={text}>
              <div style={{textAlign:'left'}}>{this.cutString(text,12,'...')}</div>
            </Tooltip>
          );
        }else{
          return <div style={{textAlign:'left'}}>{text}</div>
        }
      }
    }];

  render(){
    const {searchDeptList,searchChangeItemList} = this.props;
    //部门列表
    let deptList = [];
    deptList.push(<Option value="" key="">{'全部'}</Option>);
    if(searchDeptList.length){
      for(let i = 0; i < searchDeptList.length; i++){
        deptList.push(<Option value={searchDeptList[i].tbfield}
                              key={searchDeptList[i].tbfield}>{searchDeptList[i].tbfield_show}
        </Option>);
      }
    }
    //修改项列表
    let changeItemList = [];
    changeItemList.push(<Option value="" key="">{'全部'}</Option>);
    if(searchChangeItemList.length){
      for(let i = 0; i < searchChangeItemList.length; i++){
        changeItemList.push(<Option value={searchChangeItemList[i].tbfield}
                                    key={searchChangeItemList[i].tbfield}>{searchChangeItemList[i].tbfield_show}
        </Option>);
      }
    }
    return(
      <Spin tip={config.IS_LOADING} spinning={this.props.historyTableLoad}>
        <div style={{marginBottom:15}}>
          <span style={{marginRight:10,fontSize:'15px',fontWeight:'bold'}}>{"模块:"}</span>
          <Select showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  value={this.props.searchModule}
                  onChange={(value)=>this.setCondParam(value,'searchModule')}
          >
            <Option value="1">基本信息</Option>
            <Option  value="2">里程碑</Option>
            <Option  value="3_1">全成本/配合部门</Option>
            <Option  value="3_2">全成本/预算</Option>
            <Option  value="4">附件</Option>
			<Option value="0">全部</Option>
          </Select>
          {this.props.searchModule === '3_2'?
            <span style={{marginLeft:20,marginRight:10,fontSize:'15px',fontWeight:'bold'}}>{"部门:"}</span>
            :
            null
          }
          {this.props.searchModule === '3_2'?
            <Select showSearch
                    style={{ width:300 }}
                    optionFilterProp="children"
                    value={this.props.searchDeptValue}
                    onChange={(value)=>this.setCondParam(value,'searchDeptValue')}
            >
              {deptList}
            </Select>
            :
            null
          }
          {this.props.searchModule !== '0'?
            <span style={{marginLeft:20,marginRight:10,fontSize:'15px',fontWeight:'bold'}}>{"修改项:"}</span>
            :
            null
          }
          {this.props.searchModule !== '0'?
            <Select showSearch
                    style={{ width:300 }}
                    optionFilterProp="children"
                    value={this.props.searchChangeItemValue}
                    onChange={(value)=>this.setCondParam(value,'searchChangeItemValue')}
            >
              {changeItemList}
            </Select>
            :
            null
          }

        </div>
        <Table columns={this.columns}
               dataSource={this.props.historyList}
               className={styles.checkLogTable}
               pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
        />
        {/*加载完才显示页码*/}
        {this.props.loading !== true?
          <div style={{textAlign:'center',marginTop:10}}>
            <Pagination current={this.props.historyPage}
                        total={Number(this.props.historyRowCount)}
                        pageSize={10}
                        onChange={(page)=>this.setCondParam(page,'historyPage')}
            />
          </div>
          :
          null
        }
      </Spin>
    );
  }
}

export default ProjHistoryRecord;
