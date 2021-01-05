/**
 * 作者：彭东洋
 * 创建日期：2020-04-14
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-全成本标准
 */
import React from 'react';
import { Table, Input, Button, Modal, Select, Icon, message} from 'antd';
import { connect } from 'dva';
import styles from './mailNotification/mailNotice.less';
import StandardStyle from './fullCostStandard.less';
import config from '../../../../utils/config';
import { getUuid } from '../../../../components/commonApp/commonAppConst.js';
const Option = Select.Option;
const TextArea = Input.TextArea
class FullCostStandard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    //点击新增按钮新增新一年的表格
    addMOdal = () => {
        const {dispatch, costList,typeList,titleColumns} = this.props;
        let newData = typeList.map((v,i) => {
            let object = {}
            if(i == 0) {
                object.yearRowSpan = typeList.length
            } else {
                object.yearRowSpan = 0
            }
            let count = (costList/typeList.length)
            object.year = costList[0].year+count;
            object.key = object.year+i;
            object.sort_name = v.sort_name
            object.sort_uuid = v.sort_uuid
            titleColumns.forEach((text,j) => {
                object["dept" + j.toString()] = ""
            })
            return object
        })
        let newArray = costList.concat(newData)
        dispatch({
            type:"fullCostStandard/save",
            payload: {
                costList: newArray
            }
        })
    }
    //点击保存按钮保存数据
    saveButton = () => {
        const {dispatch} = this.props;
        dispatch({
            type:"fullCostStandard/autocalcu_cost_budget_sort_oubudget_submit",
        })

    }
    //输入框内只能输入数字
    inputSearch = (e) => {
        let value = e.target.value
        return value.replace(/[^\d]/g,'')
    }
    //修改表格中的数据
    editCellData = (e,dataIndex,row,i) => {
        const {dispatch,midCostList} = this.props;
        midCostList.forEach((v,index) => {
            if(v.sort_uuid == row.sort_uuid) {
                midCostList[index][dataIndex] = this.inputSearch(e)
            } 
            v.children.forEach((text,j) => {
                if(text.sort_uuid == row.sort_uuid) {
                    midCostList[index].children[j][dataIndex] = this.inputSearch(e)
                }
            })
        })
        dispatch({
            type:"fullCostStandard/save",
            payload: {
                midCostList: JSON.parse(JSON.stringify(midCostList))
            }
        })
    }
    //修改添加备注
    editRemarks = (e,row,i) => {
        const {dispatch, midCostList} = this.props;
        midCostList.forEach((v,index) => {
            if(v.sort_uuid == row.sort_uuid) {
                midCostList[index].Remarks = e.target.value
            } 
            v.children.forEach((text,j) => {
                if(text.sort_uuid == row.sort_uuid) {
                    midCostList[index].children[j].Remarks = e.target.value
                }
            })
        })
        const postDtat = {
            arg_year:"",
            arg_sort_uuid:"",
            arg_remake:""
        }
        dispatch({
            type:"fullCostStandard/save",
            payload: {
                midCostList: JSON.parse(JSON.stringify(midCostList))
            }
        })
        dispatch({
            type:"fullCostStandard/save",
            postDtat
        })
    }
    //点击提交按钮保存表格的数据
    saveData = () => {
        const {dispatch} =this.props;
        Modal.confirm({ 
            title:"是否确认提交？",
            content:"数据提交之后将不可以再修改！",
            okText: '确认',
            cancelText: '取消',
            onOk(){
                dispatch({
                    type:"fullCostStandard/autocalcu_cost_budget_sort_oubudget_add"
                })
            },
            onCancel(){}
        })
    }
    //选择年份时保存年份
    handleChange = (value) => {
        const {dispatch} = this.props;
        const postDtat = {
            arg_year: value 
        }
        dispatch({
            type:"fullCostStandard/saveYear",
            postDtat
        })
        dispatch({
            type:"fullCostStandard/autocalcu_cost_budget_sort_params_query",
            postDtat
        })
    }
    //生成年份选择框
    setYearSelection = () => {
        let now = new Date();
        let children = [];
        let finalYear = Number(now.getFullYear()) 
        for (let i = 2020; i <= finalYear; i++) {
            children.push(<Option key = {i}>{i}</Option>)
        }
        return children
    } 
    //模态框显示
    showModal = (type) => {
        this.setState({[type]: true})
    };
    //新增一行内容
    addCostType = (row) => {
        this.setState({
            carryOutValue:""
        })
        this.showModal('carryOutVisible');
    };
    // 隐藏执行成本模态框
    hideCarryOutModal = (flag) => {
        const { dispatch} = this.props;
        let postDtat = {
            subclassName: this.state.carryOutValue
        }
        if(this.state.carryOutValue == "" && flag == "confirm") {
            message.error("请选择需要新增的费用项目")
            return
        }
        if(flag === "confirm") {
            dispatch({
                type:"fullCostStandard/addCostType",
                postDtat
            })
        }

        this.setState({carryOutVisible: false})
    };
    //改变下拉框的值
    changeSelectValue = (value,type) => {
        this.state[type] = value
    };
    //删除成本费用类型
    deleteCostType = (row) => {
        let postDtat = {
            subclassName: row.sort_name
        }
        const {dispatch} = this.props;
        dispatch({
            type:"fullCostStandard/deleteCostType",
            postDtat
        })
    }
    //中间变量生成最终的表格列表函数
    getFullCostDataSource = (newArray,intermediateData,year) => {
        if(intermediateData.length == 0) {
            return []
        }
        let titleList = newArray.map((v,i) => "dept"+i)
        let fullCostDataSource = [] //生成表格的数据源
        intermediateData.forEach((v,i) => {
            let obj = {}
            titleList.forEach((value,i) => {
                obj[value] = v[value] 
            })
            fullCostDataSource.push({
                year,
                yearRowSpan: 0,
                padLeft: "0px",
                sort_name: v.sort_name,
                sort_name_Company: v.sort_name + "（元/人月）",
                key: v.sort_uuid,
                sort_uuid:v.sort_uuid,
                Remarks: v.Remarks,
                ...obj
            })
            if(v.children.length > 0 ) {
                v.children.forEach((value) => {
                    let object = {}
                    titleList.forEach((text) => {
                        object[text] = value[text] 
                    })
                    if(value.visible) {
                        fullCostDataSource.push({
                            year,
                            yearRowSpan: 0,
                            padLeft: "30px",
                            sort_name: value.sort_name,
                            sort_name_Company: value.sort_name + "（元/人月）",
                            key: value.sort_uuid,
                            sort_uuid: value.sort_uuid,
                            Remarks: value.Remarks,
                            edit: value.edit,
                            ...object
                        })
                    }
                })
            }
        })
        fullCostDataSource[0].yearRowSpan =  fullCostDataSource.length
        return fullCostDataSource
    }
    render () {
        const carryOutList = this.props.expenseCategory.map((item) => {
            return (<Option key={item.sort_name}>{item.sort_name}</Option>)
        });
        let columns = [
            {
                title: "年度",
                dataIndex: "year",
                key:"year",
                render: (value,row) => {
                    return {
                        children: <div style = {{whiteSpace:"nowrap"}}>
                            <span>{value}</span>
                        </div>,
                        props: {rowSpan:row.yearRowSpan}
                    }
                }
            },
            {
                title:"费用类别",
                dataIndex: "sort_name_Company",
                key: "sort_name_Company",
                width: 300,
                render: (value,row) => {
                    let data = {}  
                    if(row.sort_name == "项目实施成本") {
                        data = {
                            children:(
                                <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>
                                    <span>{value}</span>
                                    <Icon type="plus-circle-o" className={StandardStyle.costAdd} onClick={() => this.addCostType(row)}/>
                                </div>
                            ),
                        }
                    } else if (row.edit == "edit") {
                        data = {
                            children:(
                                <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}
                                    <Icon type="delete" className={StandardStyle.deleteIcon} onClick={() => this.deleteCostType(row)}/>
                                </div>
                            ),
                        }
                    } else {
                        data = {
                            children:(
                                <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}</div>
                            ),
                        }
                    }
                    return data
                }
            },
        ]
        for (let i = 0; i< this.props.titleColumns.length; i++){
            columns.push({
               title: this.props.titleColumns[i].ou_short_name,
               dataIndex: "dept" + i.toString(),
               render: (value,row,index) => {
                   let data = {}
                   if(row.sort_name == "项目实施成本") {
                        data = {
                            children:(
                                <div></div>
                                // <Input 
                                //     value = {value}
                                //     disabled
                                // />     
                            ),
                        }
                    } else {
                        data = {
                            children:(
                                <Input 
                                    value = {value}
                                    disabled = {this.props.inputFlag}
                                    onChange = {(e,dataIndex) => this.editCellData(e,"dept" + i.toString(),row,index)}
                            />     
                            ),
                        }
                    }
                   return data
               }
           }) 
        }
        columns.push({
            title:"备注",
            dataIndex: "Remarks",
            key: "Remarks",
            render: (value,row,index) => {
                if(row.sort_name == "项目实施成本") {
                    return (<div/>)
                } else {
                    return (<TextArea
                        value = {value}
                        // rows={2}
                        style = {{resize:"vertical"}}
                        disabled = {this.props.inputFlag}
                        onChange = {(e)=>this.editRemarks(e,row,index)}
                    />)
                }
            }
        })
        return (
            <div className = {styles.pageContainer}>
                <div style = {{paddingleft: 15,paddingRight: 15}}>
                    <p style = {{textAlign: "center", fontSize: "20px", marginBottom: "10px"}}>全成本标准</p>
                </div>
                <div style = {{paddingTop: 13, paddingBottom: 16, background: "white"}}>
                    <div style = {{paddingLeft: 15, paddingRight: 15}}>
                        <div style = {{marginBottom: 10,display:"flex",justifyContent:"space-between"}}>
                            <div>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={this.handleChange}
                                    defaultValue = {String(new Date().getFullYear())}
                                    value = {String(this.props.searchYear)}
                                >
                                    {this.setYearSelection()}
                                    {/* <Option value ="2018">2018</Option>
                                    <Option value ="2019">2019</Option>
                                    <Option value ="2020">2020</Option> */}
                                </Select>
                            </div>
                            <div>
                                <Button 
                                    type = "primary" 
                                    onClick = {this.saveButton} 
                                    disabled = {this.props.inputFlag}
                                >
                                    保存
                                </Button>
                                <Button 
                                    type = "primary" 
                                    onClick = {this.saveData} 
                                    style = {{marginLeft:"20px"}}
                                    disabled = {this.props.inputFlag}
                                >
                                    提交
                                </Button>
                            </div>
                            
                        </div>
                        <Table
                            columns = {columns}
                            className={StandardStyle.fcTable + ' ' + StandardStyle.deptsTable}
                            bordered = {true}
                            loading = {this.props.loading}
                            dataSource = {this.getFullCostDataSource(this.props.titleColumns,this.props.midCostList,this.props.searchYear)}
                            pagination = {false}
                        />
                    </div>
                </div>
                {/* 添加项目实施成本类型的模态框 */}
                <Modal
                    title = {config.NO_PREFIX_CARRYOUT_COST}
                    key = {getUuid(20,62)}
                    visible={this.state.carryOutVisible}
                    onOk = {() => this.hideCarryOutModal('confirm')}
                    onCancel = {() => this.hideCarryOutModal('cancel')}
                >
                    <Select
                        onSelect = {(value) => this.changeSelectValue(value,'carryOutValue')}
                        style = {{width: 200, marginLeft: '30%'}}
                    >
                        {carryOutList}
                    </Select>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.fullCostStandard,
        ...state.fullCostStandard
    };
}
export default connect(mapStateToProps)(FullCostStandard);