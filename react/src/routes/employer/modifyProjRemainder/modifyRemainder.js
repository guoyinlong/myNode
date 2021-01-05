/**
 * 作者：王旭东
 * 创建日期：2019-2-26
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：项目余数变更，修改正态分布ABCDE剩余的人数余数
 */

import React from "react";
import {Table, Button, Modal, message, Popover, Input, Select, Pagination,Popconfirm} from 'antd';
import Style from "../../hr/encouragementInfo/import.css";
import {connect} from "dva/index";
import tableStyle from "../../../components/common/table.less";
import exportExl from "../../../components/commonApp/exportExl.js"
import inputStyle from './inputStyle.less'
import Cookie from 'js-cookie'

const Option = Select.Option;

class ModifyRemainder extends React.Component {
    state = {
        listDataNew: [],
        showHistory: false,
    }


    setCellValue = (record, value, type) => {
        let {listDataNew} = this.state;
        let itemOneIndex = listDataNew.findIndex(item => item.key === record.key);

        if (itemOneIndex !== -1) {
            listDataNew[itemOneIndex][type] = value;
        } else {
            listDataNew.push(
                {
                    [type]: value,
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
                type: 'modifyremainder/updateCell',
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
            type: 'modifyremainder/cellOK',
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
        let { listDataNew } = this.state;
        listDataNew.splice(listDataNew.findIndex(item => item.key === record.key), 1);

        this.setState({
            listDataNew,
        });
    }


    getHistoryData = (record) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'modifyremainder/getHistoryData',
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
      type: 'modifyremainder/rejectData',
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
            type: 'modifyremainder/handleCancel',
        });

    }

    // 导出表格
    outPut = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'modifyremainder/outPut',
        });
    };


    // 导出表格
    outPutHistory = () => {
        const tablePage = document.querySelector("#historyTable table");
        exportExl()(tablePage, `修改历史表`);
    };


    // 点击搜索按钮
    search = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'modifyremainder/search',
        });
    }

    // 点击清空按钮
    clear = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'modifyremainder/clear',
        });
    }

    inputChange = (value, type) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'modifyremainder/inputChange',
            payload: {
                value,
                type,
            }
        });
    }

    pageChange = (page) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'modifyremainder/pageChange',
            payload: {
                page,
            }
        });
    }


    render() {
        let {listDataNew} = this.state;
        let {
            listData, historyData, arg_year, arg_season, arg_proj_name, arg_proj_code, arg_pu_dept_name, arg_dept_name, arg_tag,
            arg_page_index, page_total
        } = this.props;


        let yearOption = [];
        for (let i = 2015, j = Number(new Date().getFullYear()); i <= j; i++) {
            yearOption.push(<Option value={i.toString()} key={i}>{i.toString()}</Option>)
        }

        let tagObj = {
            '0': '未考核',
            '1': '已考核',
           /* '2': '历史',*/
        }

        let columns = [
            {
                title: '项目名称',
                dataIndex: 'proj_name',
                fixed: 'left',
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
                title: '项目编码',
                dataIndex: 'proj_code',
            },
            {
                title: '主责部门',
                dataIndex: 'dept_name'
            },
            {
                title: '归口部门',
                dataIndex: 'pu_dept_name'
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
            //     title: '评E余数',
            //     dataIndex: 'e_remainder',
            //     render: (text, record, index) => {

            //         let lableValue = listDataNew.filter(item => item.key === record.key); // 新编辑的数据
            //         let textValue = '';
            //         if (lableValue.length !== 0 && 'e_remainder' in lableValue[0]) {
            //             textValue = lableValue[0].e_remainder;
            //         } else {
            //             textValue = text;
            //         }
            //         if (record.editing) {
            //             return (
            //                 <Input
            //                     className={inputStyle.inputStyle}
            //                     // style={{width: '50px',border: '1px solid #FFA500'}}
            //                     value={textValue}
            //                     onChange={(e) => this.setCellValue(record, e.target.value, 'e_remainder')}
            //                 />);
            //         }
            //         return (<span>{text}</span>);

            //     }
            // },
            {
                title: '状态',
                dataIndex: 'tag',
                render: (text, record, index) => {
                    return <div>{tagObj[text]}</div>
                }
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                render: (text)=>{
                    return <div>{text&&text.slice(0,text.length-2)}</div>

                }
            },
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
                title: '项目名称',
                dataIndex: 'proj_name',
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
                dataIndex: 'username',
                render: (text)=>{
                    return <div>{text}</div>
                }
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                render: (text)=>{
                    return <div>{text&&text.slice(0,text.length-2)}</div>
                }
            },
        ];

        return (
            <div className={Style.wrap}>
                <div style={{marginBottom: '15px'}}>
                    <span>年度季度：</span>

                    <Select
                        style={{width: '75px'}}
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
                        <Option value="1" key="1">第一季度</Option>
                        <Option value="2" key="2">第二季度</Option>
                        <Option value="3" key="3">第三季度</Option>
                        <Option value="4" key="4">第四季度</Option>
                    </Select>

                    <span>项目名称：</span>
                    <Input
                        style={{width: 200, marginRight: '20px'}}
                        placeholder=" "
                        onChange={(e) => this.inputChange(e.target.value, 'arg_proj_name')}
                        value={arg_proj_name}
                    />
                    <span>项目编码：</span>
                    <Input
                        style={{width: 200, marginRight: '20px'}}
                        placeholder=" "
                        onChange={(e) => this.inputChange(e.target.value, 'arg_proj_code')}
                        value={arg_proj_code}
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <span>归口部门：</span>
                    {this.props.bpflag?
                    <Select style={{width:200}} onChange={(value)=>this.inputChange(value,'arg_pu_dept_name')} dropdownMatchSelectWidth={false} value={arg_pu_dept_name||(this.props.focusDept.length!=0?this.props.focusDept[0].principal_deptname:"")}> 
                    {
                    (this.props.focusDept||[]).map(
                    item => <Option key={item.principal_deptid} value={item.principal_deptname}>{item.principal_deptname}</Option>
                    )
                    }
                    </Select>
                      :
                      <Input
                      style={{width: 175, marginRight: '20px'}}
                      placeholder=""
                      onChange={(e) => this.inputChange(e.target.value, 'arg_pu_dept_name')}
                      value={arg_pu_dept_name}
                      />
                    }
                    &nbsp;&nbsp;
                    <span>主责部门：</span>
                    <Input
                        style={{width: 200, marginRight: '20px'}}
                        placeholder=" "
                        onChange={(e) => this.inputChange(e.target.value, 'arg_dept_name')}
                        value={arg_dept_name}
                    />
                    <span>状态：</span>
                    <Select
                        style={{width: 200, marginRight: '50px'}}
                        onChange={(value) => this.inputChange(value, 'arg_tag')}
                        value={arg_tag}
                    >
                        <Option value="0" key={'0'}>未考核</Option>
                        <Option value="1" key={'1'}>已考核</Option>
                        {/*<Option value="2" key={'2'}>历史</Option>*/}
                    </Select>

                    <div style={{float: 'right', marginTop:'5px', marginBottom:'10px'}}>
                      <Button type="primary" onClick={() => this.clear()}>{'清空条件'}</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
                        &nbsp;&nbsp;&nbsp;
                      <Button type="primary" onClick={() => this.outPut()}>{'导出'}</Button>

                    </div>
                </div>
              <div style={{clear:'both'}}>
                <Table columns={columns}
                       scroll={{x: 1300}}
                       dataSource={listData}
                       pagination={false}
                       className={tableStyle.orderTable}
                  // loading={loading}
                       bordered={true}
                />
                <div style={{textAlign: 'center',marginTop:'20px'}}>
                  <Pagination
                    current={Number(arg_page_index||1)}
                    total={Number(page_total||1)}
                    onChange={this.pageChange}
                  />
                </div>
              </div>



                <Modal
                    visible={this.state.showHistory}
                    title="历史记录"
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    width='1200px'

                >
                    <div style={{marginBottom: 20}}>
                        <Button onClick={this.outPutHistory} type="primary" >导出</Button>
                    </div>

                    <div id='historyTable'>
                        <Table
                            rowKey='id'
                            columns={historyColumns}
                            dataSource={historyData}
                            pagination={false}
                            className={tableStyle.orderTable}
                            // loading={loading}
                            bordered={true}
                        />
                    </div>

                </Modal>
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {listData, historyData, arg_year, arg_season, arg_proj_name, arg_proj_code, arg_pu_dept_name, arg_dept_name, arg_tag,arg_page_index, page_total,bpflag,focusDept} = state.modifyremainder;

    return {
        listData,
        historyData,
        arg_year,
        arg_season,
        arg_proj_name,
        arg_proj_code,
        arg_pu_dept_name,
        arg_dept_name,
        arg_tag,
        arg_page_index,
        page_total,
        loading: state.loading.models.modifyremainder,
        focusDept,
        bpflag
    };
}

export default connect(mapStateToProps)(ModifyRemainder)
