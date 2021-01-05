/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 宣传组织修改
 */
import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,Input,Select } from 'antd'
import styles from './setNewstyle.less'
const Option = Select.Option;
class newSetPublicity extends React.PureComponent {
  state={ }
    returnModel =(value,value2)=>{
        if(value2!==undefined){
            this.props.dispatch({
                type:'newSetPublicity/'+value,
                record : value2,
            })
        }else{
            this.props.dispatch({
                type:'newSetPublicity/'+value,
            })
        }
    };
	//----------------------页面渲染----------------------//
	render() {
        const {  duizhangList,duiyuanList,dataList} = this.props;
        //队长
        let duizhangarr=  duizhangList.length === 0 ? [] : duizhangList.map((item) => { 
        return <Option key={item.userId} value={item.userId}>{item.userName}</Option>
        })
        //队员
        let duiyuanarr=  duiyuanList.length === 0 ? [] : duiyuanList.map((item) => { 
        return <Option key={item.userId} value={item.userId}>{item.userName}</Option>
            })
	return(
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>宣传组织修改</h2>
                        {/* <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button> */}
                       {dataList?

                      
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                  
                                <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 提交人
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                                {dataList.createByName}
                                    </div> 
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 单位
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            {dataList.deptName}
                                            
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 思想文化宣传队名称
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <Input style={{width:'570px'}} placeholder = "请输入思想文化宣传队名称" value={this.props.titleName}  onChange={(e)=>this.returnModel('name',e)}/>
                                    </div>
                                    <div className={styles.lineOut}>
                                                        <span className={styles.lineKey}>
                                                            <b className={styles.lineStar}>*</b>
                                                            思想文化宣传队队长/新闻宣传员
                                                        </span>
                                                        <span className={styles.lineColon}>：</span>
                                                        <Select 
                                                        value={this.props.channelDuiZhangValue}
                                                        onChange={(e)=>this.returnModel('onChannelDuiZhang',e)}
                                                        style={{ minWidth: "200px", maxWidth: 940 }}
                                                        placeholder = "请选择"
                                                        >
                                                        {duizhangarr}
                                                    </Select>
                                    </div>
                                    <div className={styles.lineOut}>
                                                        <span className={styles.lineKey}>
                                                            <b className={styles.lineStar}>*</b>
                                                            思想文化宣传队队员
                                                        </span>
                                                        <span className={styles.lineColon}>：</span>
                                                        <Select mode="multiple"
                                                        value={this.props.channelDuiYuanValue}
                                                        onChange={(e)=>this.returnModel('onChannelDuiYuan',e)}
                                                        style={{ minWidth: "200px", maxWidth: 940 }}
                                                        placeholder = "请选择"
                                                        >
                                                        {duiyuanarr}
                                                    </Select>
                                    </div>
                                    <div className = {styles.buttonOut}>
                                                    <Button type="primary"
                                                    onClick={()=>this.returnModel('saveSubmit','保存')}
                                                    >保存</Button>
                                                    <Button type="primary"
                                                    style = {{marginLeft: 5}}
                                                    onClick={()=>this.returnModel('saveSubmit','提交')}
                                                    >提交</Button>
                                                     <Button style = {{marginLeft: 5}}  size="default" type="primary" >
                                                        <a href="javascript:history.back(-1)">取消</a>
                                                    </Button>
                                    </div>
                          </div>
             :""} 
           </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.newSetPublicity, 
    ...state.newSetPublicity
  };
}
export default connect(mapStateToProps)(newSetPublicity);
