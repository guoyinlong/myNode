/**
 * 作者：郭银龙
 * 日期：2020-11-9
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件名称的发布情况
 */  
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../style.less';
import { routerRedux } from 'dva/router';
import { Table, Button,Pagination} from "antd";
class manuscriptDetail extends React.Component {
    //查看详情
    goTodetai=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/releaseOfManuscripts/releaseOfManuscriptsDetails',
            query: {
                id:JSON.parse(JSON.stringify(e.materiaId)),
                type:"稿件名称的发布情况"
            }
        }));
    }
    ChangePage=(page)=>{
        this.props.dispatch({
            type: "manuscriptDetail/queryUserInfo", page})
    }
    render(){
        const{manuscriptDetailList}=this.props
        const columns2 = [
            {  
                title: "序号",
                key:(text,record,index)=>`${index+1}`,
                render:(text,record,index)=>`${index+1}`,
                width:"6%",
            },
            {  
                title: "发布稿件名称",
                dataIndex: "releaseNewsName",
                key: "releaseNewsName",
            },
            {
                title: "发布渠道",
                dataIndex: "releaseChannel",
                key: "releaseChannel",
            },
            {
                title: "部门",
                dataIndex: "deptName",
                key: "deptName",
                width: "10%",
            },
            {
                title: "发布时间",
                dataIndex: "createTime",
                key: "createTime",
            },
            {
                title: "操作",
                dataIndex: "operation",
                key: "operation",
                render: (text,e) => {
                    return (
                        <div>
                            <div className = {styles.editStyle}>
                                <Button size="default" type="primary"  onClick = {() => this.goTodetai(e)}  style= {{marginRight: "10px",marginTop:10}}>详情</Button>
                            </div>
                        </div>
                        
                    );
                }
            }
        ];
        return(
            <div className={styles['pageContainer']}>
                <h2 style = {{textAlign:'center',marginBottom:30}}>{manuscriptDetailList.userName}的{manuscriptDetailList.newsName}详情</h2>
                        {/* <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button> */}
                 <Table             
                                    key = {this.props.key}
                                    columns = {columns2}
                                    className = {styles.orderTable}
                                    dataSource = {manuscriptDetailList.list}
                                    pagination={false}
                                />
                                <Pagination
                                    current = {this.props.pageCurrent!=""?this.props.pageCurrent:1}
                                    pageSize = {10}
                                    total = {this.props.allCount!=""?this.props.allCount:1}
                                    onChange = {this.ChangePage}
                                    style = {{textAlign: 'center', marginTop: '20px'}}
                                />
            </div>
        )
    }

}
function mapStateToProps (state) {

    return {
      loading: state.loading.models.manuscriptDetail,
      ...state.manuscriptDetail
    };
  }
  export default connect(mapStateToProps)(manuscriptDetail);