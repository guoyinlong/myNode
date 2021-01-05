/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：合作伙伴评价列表
 */
import { connect } from 'dva';
import { Table } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../projectTable.less';

class List extends React.Component {
    constructor(props) {
        super(props);
    }
    state={
        myData:this.props.checkListObj
    }
    componentWillReceiveProps(nextProps) {
        this.setState({myData: this.props.checkListObj});
    }
    
    // 表头设置
    columns = [{
        title: '年度',
        dataIndex: 'year',
        key: 'year',
    }, {
        title: '月份',
        dataIndex: 'month',
        key: 'month',
    },{
        title: '所属公司',
        dataIndex: 'partner_name',
        key: 'partner_name',
    },{
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
    },{
        title: '所属项目',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (text, record) => (
            <span>{record.projectName}</span>
        )
    },{
        title: '状态',
        dataIndex: 'projectState',
        key: 'projectState',
        render: (text, record) => (
            <span style={{'color': '#ff7f24'}}>{record.projectState}</span>
        ),
    }];
    
    // 点击进入详情页
    clickItem = (record)=> {
        const{dispatch}=this.props;
        let query={
            'arg_kpi_year':record.year,
            'arg_kpi_month':record.arg_month,
            'arg_user_id':record.userId
        };
        dispatch(routerRedux.push({
            pathname:'/projectApp/purchase/kpiCheckDetail',query
        }));
    }
    
    render() {
        let data = [];
        if(this.state.myData.length>0) {
            data = this.state.myData.map((item,index)=>{
                return{
                    key:index,
                    year:item.kpi_year,
                    month:item.kpi_month+'月',
                    partner_name:item.partner_name,
                    projectState:'待审核',
                    userId:item.staff_id,
                    userName:item.staff_name,
                    projectName:item.proj_name,
                    projectId:item.proj_id,
                    arg_month:item.kpi_month
                }
            })
        }
        return(
            <div className={styles.container}>
                <Table 
                loading={this.props.loading} className={styles.orderTable} columns={this.columns} dataSource={data} 
                onRowClick = {(record)=>{this.clickItem(record)}}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    const { checkListObj } = state.partnerCheckList;
    return {
        checkListObj,
        loading: state.loading.models.partnerCheckList
    };
}

export default connect(mapStateToProps)(List);