/**
 *  作者: 彭东洋
 *  创建日期: 2019-09-06
 *  邮箱：pengdy@itnova.com.cn
 *  文件说明：资产借还信息查询
 */
import  React from 'react';
import { connect } from 'dva';
import { Button, Table, Input} from 'antd';
import styles from './assetLendingInformation.less';
import { routerRedux } from 'dva/router';
const Search = Input.Search;
class AssetLendingInformation extends React.PureComponent {
    constructor(props) {super(props);}
    state = {
        searchText: ""
    };
    //返回
    goBack = () =>{
        const {dispatch} = this.props;
        dispatch(routerRedux.push({
            pathname: "/adminApp/compRes/qrcode_office_equipment"
        }));
    };
    //跳转到详情页面
    goDetail = (record) => {
        const {dispatch} = this.props;
        dispatch(
            routerRedux.push({
            pathname: "/adminApp/compRes/qrcode_office_equipment/assetLendingInformation/assetLendingDetail",
            query: record
        }));
    };
    //当搜索时
    assetSearch = (value) => {
        const { dispatch } = this.props;
        const data = {
            arg_asset_name: value,
        };
        dispatch ({
            type: "qrCodeCommon/assetinformationquery",
            data
        });
        this.setState({
            searchText:value
        });
    };
    //更改页码
    changePage = (page) => {
        const { searchText } = this.state;
        const data = {
            arg_asset_name: searchText,
            page: page
        };
        this.props.dispatch({
            type:"qrCodeCommon/changePage",
            data
        });
    };
    render() {
        const {assetsList} = this.props;
        const columns = [
            {
                dataIndex: "index",
                title: "序号",
                key: "index",
                render: (text) => {
                    return (<div>{text}</div>)
                }
            },
            {
                dataIndex: "asset_name",
                title: "资产名称",
                key: "asset_name",
                render: (text) => {
                    return (<div>{text}</div>)
                }
            },
            {
                dataIndex: "asset_number",
                title: "资产编号",
                key: "asset_number",
                render: (text) => {
                    return (<div>{text}</div>)
                }
            },
            {
                dataIndex: "operation",
                title: "操作",
                key: "operation",
                render: (text,record) => {
                    return (<a href="javascript:;" onClick={() => this.goDetail(record)}>{text}</a>)
                }
            },
        ];
        return (
            <div className = {styles.page}>
                <div className = {styles.title}>资产借还信息查询</div>
                <Search
                    placeholder = "资产名称"
                    // maxLength = {15}
                    style = {{float:'left',width:200,marginBottom:20}}
                    onSearch = {value => this.assetSearch(value)} 
                />
                <div style = {{textAlign:"right",marginBottom:20}}><Button type = "primary" onClick = {this.goBack}>返回</Button></div>
                <Table
                    columns = {columns}
                    // dataSource = {newData}
                    dataSource = {assetsList}
                    className = {styles.table}
                    // pagination ={pagination}
                    loading = {this.props.loading}
                    pagination = {{
                        current:this.props.page,
                        total:this.props.total,
                        pageSize:this.props.pageSize,
                        onChange: this.changePage
                    }}
                >
                </Table>
            </div> 
        ); 
    };
};
function mapStateToProps(state) {
    return {
        loading:state.loading.models.qrCodeCommon,
        ...state.qrCodeCommon
    };
};
export default connect(mapStateToProps)(AssetLendingInformation);