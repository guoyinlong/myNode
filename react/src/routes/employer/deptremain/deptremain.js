/**
 * 作者：张楠华
 * 日期：2017-08-21
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核部门余数信息展示
 */
import React from 'react';
import {connect} from 'dva';
import {Table, Button, Select, Input, Pagination, Modal, message} from 'antd';
// import message from '../../../components/commonApp/message';
import styles from '../../../components/common/table.less';
import Style from '../../../components/employer/employer.less';
import exportExl from '../../../components/commonApp/exportExl';
import inputStyle from './inputStyle.less'
import {Row, Col, Popconfirm} from 'antd'

const Option = Select.Option;

// 传入任意个 数字字符串，返回准确的加法结果
function calcuateAdd() {
  let params = [...arguments]
  let paramsArr = params.map(item=>{
    let r = 0;
    let valueWithoutPointTemp = Number(item.toString().replace(".", ""));
    try {
      r = item.toString().split(".")[1].length;
    }
    catch (e) {
      r = 0;
    }
    return {
      value: item,  // 本身的值 string
      R: r,         // 小数点后的位数 int
      valueWithoutPoint: valueWithoutPointTemp, // 去掉小数点的数值 int
    }
  })
  let maxR = 0 ;   // 最大的r
  paramsArr.forEach(item=>{
    if(item.R > maxR){
      maxR = item.R
    }
  })

  // 将所有数值扩大到 maxR 个 10倍，并求和
  let endValueBymaxR = 0
  paramsArr.forEach(item=>{
    endValueBymaxR = endValueBymaxR + item.valueWithoutPoint * Math.pow(10,maxR - item.R)
  })

  return endValueBymaxR/Math.pow(10,maxR)
}

//给数组类型增加一个calcuateByString方法，使用时直接用 .add 即可完成计算。
Array.prototype.calcuateByString = function () {
  return calcuateAdd.apply(this,arguments);
  // return calcuateAdd(arguments)
};

/**
 * 作者：张楠华
 * 创建日期：2017-08-21
 * 功能：通过后台数据转化员工类型
 * @param record 表格中每条记录
 * @param text 必要参数
 */
function transType(text, record) {
  if (record.type == '1') {
    return <div style={{textAlign: 'left'}}>综合绩效员工</div>
  }
  if (record.type == '2') {
    return <div style={{textAlign: 'left'}}>核心岗</div>
  }
  if (record.type == '3') {
    return <div style={{textAlign: 'left'}}>全体员工</div>
  }
  if (record.type == '4') {
    return <div style={{textAlign: 'left'}}>项目绩效员工</div>
  }
  if (record.type == '5') {
    return <div style={{textAlign: 'left'}}>分院常设机构负责人</div>
  }
  if (record.type == '6') {
    return <div style={{textAlign: 'left'}}>垂直化分院核心岗</div>
  }
  if (record.type == '7') {
    return <div style={{textAlign: 'left'}}>部门核心岗</div>
  }
  if (record.type == '8') {
    return <div style={{textAlign: 'left'}}>全院核心岗</div>
  }
  if (record.type == '9') {
    return <div style={{textAlign: 'left'}}>归口部门核心岗</div>
  }
  if (record.type == '10') {
    return <div style={{textAlign: 'left'}}>分院纪委</div>
  }
  if (record.type == '11') {
    return <div style={{textAlign: 'left'}}>本部纪委</div>
  }
  if (record.type == '12') {
    return <div style={{textAlign: 'left'}}>哈院项目管理部按分管部门考核的核心岗员工-A</div>
  }
  if (record.type == '13') {
    return <div style={{textAlign: 'left'}}>哈院项目管理部按分管部门考核的核心岗员工-B</div>
  }
}

/**
 * 作者：张楠华
 * 创建日期：2017-08-21
 * 功能：通过后台数据转化季度
 * @param record 表格中每条记录
 * @param text 必要参数
 */
function transSeason(text, record) {
  if (record.season == '0') {
    return <div>年度考核</div>
  }
  if (record.season == '1') {
    return <div>第一季度</div>
  }
  if (record.season == '2') {
    return <div>第二季度</div>
  }
  if (record.season == '3') {
    return <div>第三季度</div>
  }
  if (record.season == '4') {
    return <div>第四季度</div>
  }
}

/**
 * 作者：张楠华
 * 创建日期：2017-08-21
 * 功能：部门余数信息展示
 */
class deptRemain extends React.Component {

  state = {
    listDataNew: [],
    showHistory: false,
    showAdd: false,
  }
  /*  /!**
     * 作者：张楠华
     * 创建日期：2017-08-21
     * 功能：导出数据
     *!/
    expExl = () => {
      const {list} = this.props;
      let tab = document.querySelector('#table1 table');
      if (list.length !== 0) {
        exportExl()(tab, "部门评级余数信息")
      } else {
        message.info("部门评级余数信息为空！")
      }
    };*/

  // 导出表格
  outPut = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/outPut',
    });
  };


  // 点击搜索按钮
  search = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/search',
    });
  }

  // 点击清空按钮
  clear = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/clear',
    });
  }

  // 部门余数新增
  addDeptReamin = () => {
    const {dispatch} = this.props;
    const {
      add_arg_year, add_arg_season, add_OU, add_arg_dept_name, add_arg_type, add_arg_a_remainder,
      add_arg_b_remainder, add_arg_c_remainder,
      add_arg_d_remainder, add_arg_e_remainder
    } = this.state;
    // add_arg_dept_nam 可以为空
    if (add_arg_year && add_arg_season && add_OU && add_arg_type && add_arg_a_remainder &&
      add_arg_b_remainder && add_arg_c_remainder &&
      add_arg_d_remainder && add_arg_e_remainder) {

      // 判断是两位内 -1 1 之间的小数
      // let reg = /^-?0(\.[0-9]?[1-9])?$/
      // let reg = /^(-(?=0\.))?0(\.([0-9]{1,2}))?$/
      // if(reg.test(add_arg_a_remainder)&&reg.test(add_arg_b_remainder)&&
      //   reg.test(add_arg_c_remainder)&&reg.test(add_arg_d_remainder)&&
      //   reg.test(add_arg_e_remainder)){

        // 各项和是0

          let sumRemainder = [].calcuateByString(add_arg_a_remainder,add_arg_b_remainder,add_arg_c_remainder,add_arg_d_remainder,add_arg_e_remainder)

          if(sumRemainder===0){
          dispatch({
            type: 'deptremain/addDeptReamin',
            payload: {
              arg_year: add_arg_year,
              arg_season: add_arg_season,
              // add_OU:add_OU, //这个参数被拼接到部门名称
              arg_dept_name: add_arg_dept_name?add_arg_dept_name : add_OU,
              arg_type: add_arg_type,
              arg_a_remainder: parseFloat(add_arg_a_remainder),
              arg_b_remainder: parseFloat(add_arg_b_remainder),
              arg_c_remainder: parseFloat(add_arg_c_remainder),
              arg_d_remainder: parseFloat(add_arg_d_remainder),
              arg_e_remainder: parseFloat(add_arg_e_remainder),
              addCancel: this.addCancel,
            }
          });

        }else{
          message.info('各项余数和必须等于0！当前为'+ sumRemainder)
        }

      // }else{
      //   message.info('各项余数必须在-1到1之间，最多两位小数！')
      // }
    } else {
      message.info('填写信息不完整，请补全！')
    }
  }


  addCancel = () => {
    this.setState({
      showAdd: false,
      add_arg_year:'',
      add_arg_season:'',
      add_arg_dept_name:'',
      add_arg_type:'',
      add_arg_a_remainder:'',
      add_arg_b_remainder:'',
      add_arg_c_remainder:'',
      add_arg_d_remainder:'',
      add_arg_e_remainder:'',
      add_OU:'',
    })
  }

  // 点击新增按钮
  showAdd = () => {
    this.setState({
      showAdd: true,
    })

    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/getOuList',
    });

  }

  // 新增弹窗输入值
  handleChange = (e, label) => {
    this.setState({
      [label]: e,
    })
  }

  // 选择OU
  selectOU = (e) => {
    this.setState({
      add_OU: e,
    })

    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/getDeptList',
      payload: {
        value:e,
      }
    });

  }


  // 处理新增input
  handleInput = (e, label) => {
    this.setState({
      [label]: e.target.value,
    })
  }

  // 搜索框的输入
  inputChange = (value, type) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/inputChange',
      payload: {
        value,
        type,
      }
    });
  }

  setCellValue = (record, value, type) => {
    let {listDataNew} = this.state;
    let itemOneIndex = listDataNew.findIndex(item => item.key === record.key);

    if (itemOneIndex !== -1) {
      listDataNew[itemOneIndex][type] = value;
    } else {
      listDataNew.push(
        {
          [type]: value.trim(),
        },
      );
    }

    this.setState({
      listDataNew: [...listDataNew], // 将页面编辑的数据保存在state
    });
  };

  // 点击修改按钮 或者 取消按钮
  updateCell = (record, editing, type) => {
    let {listDataNew} = this.state;

    if (type === 'cancel') {
      let listDataNewTemp = listDataNew;
      listDataNewTemp.splice(listDataNew.findIndex(item => item.key === record.key), 1);
      this.setState({
        listDataNew: [...listDataNewTemp]
      });
    }

    if (listDataNew.length !== 0) {
      message.info('请保存或者取消已编辑的数据！')
    } else {
      listDataNew.push(
        {
          key: record.key,
          id: record.id,
          year: record.year,
          season: record.season,
          a_remainder: record.a_remainder,	//评A余数参数
          b_remainder: record.b_remainder,	//评B余数参数
          c_remainder: record.c_remainder,	//评C余数参数
          d_remainder: record.d_remainder,	//评D余数参数
          e_remainder: record.e_remainder,	//评E余数参数
        },
      );

      const {dispatch} = this.props;
      dispatch({
        type: 'deptremain/updateCell',
        payload: {
          record,
          editing,
        },
      });
    }
  };


  // 编辑之后确认按钮
  cellOK = (record, editing) => {
    let {listDataNew} = this.state;
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/cellOK',
      payload: {
        record,
        editing,
        listDataNew: JSON.parse(JSON.stringify(listDataNew)),
        cleanlistDataNew: this.cleanlistDataNew,
      },
    });

  };

  // 清空state存储的修改后的数据 用于cellOK成功后的回调
  cleanlistDataNew = (record) => {
    let {listDataNew} = this.state;
    listDataNew.splice(listDataNew.findIndex(item => item.key === record.key), 1);

    this.setState({
      listDataNew,
    });
  }


  getHistoryData = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/getHistoryData',
      payload: {
        record,
      },
    });

    this.setState({
      showHistory: true,
    })
  };


  rejectData = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/rejectData',
      payload: {
        record,
      },
    });

  };

  handleCancel = (e) => {
    this.setState({
      showHistory: false,
    });

    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/handleCancel',
    });

  }
  pageChange = (page) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deptremain/pageChange',
      payload: {
        page,
      }
    });
  }

  // 导出表格
  outPutHistory = () => {
    const tablePage = document.querySelector("#historyTable table");
    exportExl()(tablePage, `修改历史表`);
  };

  /**
   * 作者：张楠华
   * 创建日期：2017-08-21
   * 功能：初始化函数
   */
  constructor(props) {
    super(props)
  }

  render() {

    let {listDataNew} = this.state;
    const {
      listData, historyData, arg_year, arg_season, arg_dept_name, arg_type, arg_tag,
      arg_page_index, page_total, loading, deptList, ouList
    } = this.props;

    const {
      add_arg_year,add_arg_season,add_OU,add_arg_dept_name,add_arg_type,
      add_arg_a_remainder,add_arg_b_remainder,add_arg_c_remainder,add_arg_d_remainder,add_arg_e_remainder
    } = this.state

    let yearOption = [];
    for (let i = 2015, j = Number(new Date().getFullYear())+1; i <= j; i++) {
      yearOption.push(<Option value={i.toString()} key={i}>{i.toString()}</Option>)
    }

    //表格数据
    let columns = [
      {
        title: '序号',
        dataIndex: '',
        key: 'index',
        render: (text, record, index) => {
          return (index + 1)
        },
      },
      {
        title: '年度',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: '季度',
        dataIndex: 'season',
        key: 'season',
        render: (text, record) => transSeason(text, record),
      },
      {
        title: '部门',
        dataIndex: 'dept_name',
        key: 'dept_name',
        render: (text, record) => {
          return (<div style={{textAlign: "left", whiteSpace: 'normal'}}>{record.dept_name}</div>)
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => transType(text, record),
      },
      {
        title: '评A余数',
        dataIndex: 'a_remainder',
        render: (text, record, index) => {

          let lableValue = listDataNew.filter(item => item.key === record.key); // 新编辑的数据
          let textValue = '';
          if (lableValue.length !== 0 && 'a_remainder' in lableValue[0]) {
            textValue = lableValue[0].a_remainder;
          } else {
            textValue = text;
          }
          if (record.editing) {
            return (
              <Input
                className={inputStyle.inputStyle}
                value={textValue}
                onChange={(e) => this.setCellValue(record, e.target.value, 'a_remainder')}
              />);
          }
          return (<span>{text}</span>);

        }
      },
      {
        title: '评B余数',
        dataIndex: 'b_remainder',
        render: (text, record, index) => {

          let lableValue = listDataNew.filter(item => item.key === record.key); // 新编辑的数据
          let textValue = '';
          if (lableValue.length !== 0 && 'b_remainder' in lableValue[0]) {
            textValue = lableValue[0].b_remainder;
          } else {
            textValue = text;
          }
          if (record.editing) {
            return (
              <Input
                className={inputStyle.inputStyle}
                value={textValue}
                onChange={(e) => this.setCellValue(record, e.target.value, 'b_remainder')}
              />);
          }
          return (<span>{text}</span>);

        }
      },
      {
        title: '评C余数',
        dataIndex: 'c_remainder',
        render: (text, record, index) => {

          let lableValue = listDataNew.filter(item => item.key === record.key); // 新编辑的数据
          let textValue = '';
          if (lableValue.length !== 0 && 'c_remainder' in lableValue[0]) {
            textValue = lableValue[0].c_remainder;
          } else {
            textValue = text;
          }
          if (record.editing) {
            return (
              <Input
                className={inputStyle.inputStyle}
                value={textValue}
                onChange={(e) => this.setCellValue(record, e.target.value, 'c_remainder')}
              />);
          }
          return (<span>{text}</span>);

        }
      },
      {
        title: '评DE余数',
        dataIndex: 'd_remainder',
        render: (text, record, index) => {

          let lableValue = listDataNew.filter(item => item.key === record.key); // 新编辑的数据
          let textValue = '';
          if (lableValue.length !== 0 && 'd_remainder' in lableValue[0]) {
            textValue = lableValue[0].d_remainder;
          } else {
            textValue = text;
          }
          if (record.editing) {
            return (
              <Input
                className={inputStyle.inputStyle}
                value={textValue}
                onChange={(e) => this.setCellValue(record, e.target.value, 'd_remainder')}
              />);
          }
          return (<span>{text}</span>);

        }
      },
      // {
      //   title: '评E余数',
      //   dataIndex: 'e_remainder',
      //   render: (text, record, index) => {

      //     let lableValue = listDataNew.filter(item => item.key === record.key); // 新编辑的数据
      //     let textValue = '';
      //     if (lableValue.length !== 0 && 'e_remainder' in lableValue[0]) {
      //       textValue = lableValue[0].e_remainder;
      //     } else {
      //       textValue = text;
      //     }
      //     if (record.editing) {
      //       return (
      //         <Input
      //           className={inputStyle.inputStyle}
      //           // style={{width: '50px',border: '1px solid #FFA500'}}
      //           value={textValue}
      //           onChange={(e) => this.setCellValue(record, e.target.value, 'e_remainder')}
      //         />);
      //     }
      //     return (<span>{text}</span>);

      //   }
      // },
      {
        title: '操作',
        render: (text, record, index) => {
          if (record.editing) {
            return (
              <div>
                <Button
                  style={{marginRight: 10}}
                  onClick={() => this.cellOK(record, false)}
                >
                  确认
                </Button>
                <Button
                  onClick={() => this.updateCell(record, false, 'cancel')}
                >
                  取消
                </Button>
              </div>
            );
          }
          return (
            <div>
              <Button
                //disabled={record.tag !== '0'}
                disabled={true}//一季度需求防止修改余数，修改功能暂时禁掉
                style={{marginRight: 10}}
                onClick={() => this.updateCell(record, true, 'update')}
              >
                修改
              </Button>

              <Button
                // disabled={record.tag !== '0'}
                style={{marginRight: 10}}
                onClick={() => this.getHistoryData(record)}
              >
                历史
              </Button>

              <Popconfirm
                title="确定退回?"
                onConfirm={() => this.rejectData(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  disabled={record.tag !== '1'||this.props.bpflag}
                  style={{marginRight: 10}}
                  // onClick={() => this.rejectData(record)}
                >
                  退回
                </Button>
              </Popconfirm>


            </div>
          );

        },
      }
    ];

    let historyColumns = [
      {
        title: '部门名称',
        dataIndex: 'dept_name',
        render: (text, record, index) => {
          return <div style={{float: "left"}}>{text}</div>
        }
      },
      {
        title: '年度',
        dataIndex: 'year',
      },
      {
        title: '季度',
        dataIndex: 'season'
      },
      {
        title: '评A余数',
        dataIndex: 'a_remainder',
      },
      {
        title: '评B余数',
        dataIndex: 'b_remainder',
      },
      {
        title: '评C余数',
        dataIndex: 'c_remainder',
      },
      {
        title: '评D余数',
        dataIndex: 'd_remainder',
      },
      {
        title: '评E余数',
        dataIndex: 'e_remainder',
      },
      {
        title: '修改人',
        dataIndex: 'update_username',
        render: (text) => {
          return <div>{text}</div>
        }
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        render: (text) => {
          return <div>{text && text.slice(0, text.length - 2)}</div>
        }
      },
    ];

    return (
      <div className={Style.wrap}>
        <h3 style={{
          textAlign: "left",
          fontSize: "29px",
          fontFamily: "宋体",
          fontWeight: "bold",
          marginBottom: '30px'
        }}>部门评级余数信息</h3>

        <div style={{marginBottom: '15px'}}>
          <span>年度季度：</span>

          <Select
            style={{width: '100px'}}
            onChange={(value) => this.inputChange(value, 'arg_year')}
            value={arg_year}
          >
            {yearOption}
          </Select>
          <Select
            style={{width: '100px', marginRight: '20px'}}
            onChange={(value) => this.inputChange(value, 'arg_season')}
            value={arg_season}
          >
            <Option value="0" key="0">年度考核</Option>
            <Option value="1" key="1">第一季度</Option>
            <Option value="2" key="2">第二季度</Option>
            <Option value="3" key="3">第三季度</Option>
            <Option value="4" key="4">第四季度</Option>
          </Select>


          <span>{this.props.bpflag?"归口部门：":"部门名称："}</span>
          {this.props.bpflag?
            <Select style={{width:200}} onChange={(value)=>this.inputChange(value,'arg_dept_name')} dropdownMatchSelectWidth={false} value={arg_dept_name||(this.props.focusDept.length!=0?this.props.focusDept[0].principal_deptname:"")}> 
            {
            (this.props.focusDept||[]).map(
            item => <Option key={item.principal_deptid} value={item.principal_deptname}>{item.principal_deptname}</Option>
            )
            }
            </Select>
         
          :  
          <Input
            style={{width: 150, marginRight: '20px'}}
            placeholder=" "
            onChange={(e) => this.inputChange(e.target.value, 'arg_dept_name')}
            value={arg_dept_name}
          />
          }
          &nbsp;
          <span>类型：</span>
          <Select
            style={{width: 200, marginRight: '20px'}}
            onChange={(value) => this.inputChange(value, 'arg_type')}
            value={arg_type} dropdownMatchSelectWidth = {false}
          >
            <Option value="1" key={'1'}>综合绩效员工</Option>
            <Option value="2" key={'2'}>核心岗</Option>
            <Option value="3" key={'3'}>全体员工</Option>
            <Option value="4" key={'4'}>项目绩效员工</Option>
            <Option value="5" key={'5'}>分院常设机构负责人</Option>
            <Option value="6" key={'6'}>垂直化分院核心岗</Option>
            <Option value="7" key={'7'}>部门核心岗</Option>
            <Option value="8" key={'8'}>全院核心岗</Option>
            <Option value="9" key={'9'}>归口部门核心岗</Option>
            <Option value="10" key={'10'}>分院纪委</Option>
            <Option value="11" key={'11'}>本部纪委</Option>
            <Option value="12" key={'12'}>哈院项目管理部按分管部门考核的核心岗员工-A</Option>
            <Option value="13" key={'13'}>哈院项目管理部按分管部门考核的核心岗员工-B</Option>
            {/*<Option value="2" key={'2'}>历史</Option>*/}
          </Select>

          <span>状态：</span>
          <Select
            style={{width: 100, marginRight: '50px'}}
            onChange={(value) => this.inputChange(value, 'arg_tag')}
            value={arg_tag}
          >
            <Option value="0" key={'0'}>未考核</Option>
            <Option value="1" key={'1'}>已考核</Option>
            {/*<Option value="2" key={'2'}>历史</Option>*/}
          </Select>


          <div style={{float: 'right', clear: "both",marginTop:10}}>
            <Button type="primary" onClick={() => this.clear()}>{'清空条件'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.outPut()}>{'导出'}</Button>
          </div>
          <div style={{float: 'left', clear: "both", margin: '0 0 10px 0'}}>
            <Button type="primary" onClick={() => this.showAdd()}>{'新增'}</Button>
          </div>
        </div>

        <div id="table1" style={{clear: "both"}}>
          <Table
            columns={columns}
            scroll={{x: 1300}}
            dataSource={listData}
            pagination={false}
            loading={loading}
            className={styles.orderTable}
          />
          <div style={{textAlign: 'center', marginTop: '20px'}}>
            <Pagination
              current={Number(arg_page_index || 1)}
              total={Number(page_total || 1)}
              onChange={this.pageChange}
            />
          </div>

          <Modal
            visible={this.state.showHistory}
            title="历史记录"
            onOk={this.handleCancel}
            onCancel={this.handleCancel}
            width='1200px'

          >
            <div style={{marginBottom: 20}}>
              <Button onClick={this.outPutHistory} type="primary">导出</Button>
            </div>

            <div id='historyTable'>
              <Table
                rowKey='id'
                columns={historyColumns}
                dataSource={historyData}
                pagination={false}
                className={styles.orderTable}
                // loading={loading}
                bordered={true}
              />
            </div>

          </Modal>


          <Modal style={{marginTop: '10px'}}
                 width={"600px"}
                 title="新增部门余数"
                 visible={this.state.showAdd}
                 onOk={this.addDeptReamin}
                 onCancel={this.addCancel}
                 okText="确定"
                 cancelText="取消"
          >
            <Row gutter={16} style={{marginBottom: '10px'}}>
              <Col span={3}><p>考核年度</p></Col>
              <Col span={9}>

                <Select
                  style={{width: "200px", float: 'left'}}
                  name="tab_year"
                  id="tab_year"
                  onSelect={(e) => this.handleChange(e, "add_arg_year")}
                  value={add_arg_year}
                >
                  <Option key="1" value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</Option>
                  <Option key="2"
                          value={(new Date().getFullYear() + 1).toString()}>{new Date().getFullYear() + 1}</Option>
                </Select>
              </Col>
              <Col span={3}><p>考核季度</p></Col>
              <Col span={9}>
                <Select style={{width: "200px"}} name="tab_season" id="tab_season"
                        value={add_arg_season}
                        onSelect={(e) => this.handleChange(e, "add_arg_season")}>
                  <Option value="0">年度考核</Option>
                  <Option value="1">第一季度</Option>
                  <Option value="2">第二季度</Option>
                  <Option value="3">第三季度</Option>
                  <Option value="4">第四季度</Option>
                </Select>
              </Col>
            </Row>

            <Row gutter={16} style={{marginBottom: '10px'}}>
              <Col span={3}><p>组织单元</p></Col>
              <Col span={9}>
                <Select
                  showSearch
                  style={{width: "200px"}}
                  onSelect={(e) => this.selectOU(e)}
                  value={add_OU}
                >
                  {ouList && ouList.length ?
                    ouList.map(function (t, index) {
                      return (<Option key={t.OU} value={t.OU}>{t.OU}</Option>)
                    })
                    : null}
                </Select>
              </Col>
              <Col span={3}><p>部门</p></Col>
              <Col span={9}>
                <Select
                  showSearch
                  style={{width: 200,}}
                  onSelect={(e) => this.handleChange(e, "add_arg_dept_name")}
                  value={add_arg_dept_name}
                >
                  <Option value="">--</Option>
                  {deptList && deptList.length ?
                    deptList.map(function (t, index) {
                      return (
                        <Option key={t.deptname} value={t.deptname}>{t.deptname.split('-')[1] || t.deptname}</Option>)
                    })
                    : null}
                </Select>
              </Col>
            </Row>
            <Row gutter={16} style={{marginBottom: '10px'}}>
              <Col span={3}><p>类型</p></Col>
              <Col span={9}>
                <Select
                  style={{width: "200px"}}
                  name="tab_season" id="tab_season"
                   value={add_arg_type}
                  onSelect={(e) => this.handleChange(e, "add_arg_type")}>
                  <Option value="1" key={'1'}>综合绩效员工</Option>
                  <Option value="2" key={'2'}>核心岗</Option>
                  <Option value="3" key={'3'}>全体员工</Option>
                  <Option value="4" key={'4'}>项目绩效员工</Option>
                  <Option value="5" key={'5'}>分院常设机构负责人</Option>
                  <Option value="6" key={'6'}>垂直化分院核心岗</Option>
                  <Option value="7" key={'7'}>部门核心岗</Option>
                  <Option value="8" key={'8'}>全院核心岗</Option>
                  <Option value="9" key={'9'}>归口部门核心岗</Option>
                  <Option value="12" key={'12'}>哈院项目管理部按分管部门考核的核心岗员工-A</Option>
                  <Option value="13" key={'13'}>哈院项目管理部按分管部门考核的核心岗员工-B</Option>
                </Select>
              </Col>
              <Col span={3}><p>评A余数</p></Col>
              <Col span={9}>
                <Input style={{width: "200px"}} value={add_arg_a_remainder} onChange={(e) => this.handleInput(e, "add_arg_a_remainder")}/>
              </Col>
            </Row>

            <Row gutter={16} style={{marginBottom: '10px'}}>
              <Col span={3}><p>评B余数</p></Col>
              <Col span={9}>
                <Input style={{width: "200px"}} value={add_arg_b_remainder} onChange={(e) => this.handleInput(e, "add_arg_b_remainder")}/>
              </Col>
              <Col span={3}><p>评C余数</p></Col>
              <Col span={9}>
                <Input style={{width: "200px"}} value={add_arg_c_remainder} onChange={(e) => this.handleInput(e, "add_arg_c_remainder")}/>
              </Col>
            </Row>

            <Row gutter={16} style={{marginBottom: '10px'}}>
              <Col span={3}><p>评D余数</p></Col>
              <Col span={9}>
                <Input style={{width: "200px"}} value={add_arg_d_remainder} onChange={(e) => this.handleInput(e, "add_arg_d_remainder")}/>
              </Col>
              <Col span={3}><p>评E余数</p></Col>
              <Col span={9}>
                <Input style={{width: "200px"}} value={add_arg_e_remainder} onChange={(e) => this.handleInput(e, "add_arg_e_remainder")}/>
              </Col>
            </Row>

          </Modal>
        </div>
      </div>
    );
  }
}

/**
 * 作者：张楠华
 * 创建日期：2017-08-21
 * 功能：mapStateToProps函数：链接models层和routes层
 */
function mapStateToProps(state) {
  const {
    listData, arg_year, arg_season, arg_dept_name, arg_type,arg_tag, historyData,
    arg_page_index, page_total, deptList,ouList,focusDept,bpflag
  } = state.deptremain;
  return {
    loading: state.loading.models.deptremain,
    listData,
    arg_year,
    arg_season,
    arg_dept_name,
    arg_type,
    arg_tag,
    historyData,
    arg_page_index,
    page_total,
    deptList,
    ouList,
    focusDept,
    bpflag
  };
}

export default connect(mapStateToProps)(deptRemain);
