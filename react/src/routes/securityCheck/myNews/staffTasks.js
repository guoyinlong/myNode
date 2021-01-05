/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：员工自查反馈
 */
import React from 'react';
import {connect } from 'dva';
import styles from './xqstyle.less';
import {Form} from "antd";
class SealComApply extends React.Component {
  render(){
// console.log(this.props.taskList[0],12345);
    return (
      <div className={styles.outerField}>
        <div className={styles.out}>
          <div className={styles.title}>
        员工自查任务
          </div>
         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               发布人
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{this.props.taskList[0].createUserName}</span>
          </div>
           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查时间
            </span>
            <span className={styles.lineColon}>:</span>
    <span>{this.props.taskList[0].startTime}-{this.props.taskList[0].endTime}</span>
          </div>
          <div className={styles.lineOut}>
          <span className={styles.lineKey}>
            检查主题
            </span>
            <span className={styles.lineColon}>:</span>
    <span> {this.props.taskList[0].taskTitle}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查方式
            </span>
            <span className={styles.lineColon}>:</span>
            <span>
              {this.props.taskList[0].taskType===0?"安委办统查"
                    :(this.props.taskList[0].taskType===1?"安委办抽查"
                      :(this.props.taskList[0].taskType===2?"专项检查"
                          :(this.props.taskList[0].taskType===3?"部门自查"
                                  :(this.props.taskList[0].taskType===4?"专项检查"
                                          :(this.props.taskList[0].taskType===5?"部门间互查"
                                                :(this.props.taskList[0].taskType===6?"部门抽查"
                                                        :(this.props.taskList[0].taskType===7?"员工自查":"工作通知")
                                                  )
                                            )
                                      )
                                )
                        )
                    )
                }</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               检查对象
            </span>
            <span className={styles.lineColon3}>:</span>
              <span>{this.props.taskList[0].examineObj}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               通知对象
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{this.props.taskList[0].noticeScopetype}</span>
          </div>
        
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
              是否涉及分院
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{this.props.taskList[0].otherOu===0?"涉及":"不涉及"}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查要求
            </span>
            <span className={styles.lineColon}>:</span>
              <span>{this.props.taskList[0].demand}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查内容
            </span>
            <span className={styles.lineColon}>:</span>
           <span>{this.props.taskList[0].examineContent}</span>
          </div>

         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            检查规范
            </span>
            <span className={styles.lineColon}>:</span>
              <span>{this.props.taskList[0].examineImg}</span>
            
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            描述
            </span>
            <span className={styles.lineColon}>:</span>
              <span>{this.props.taskList[0].desc}</span>
            
          </div>
          

          
        </div>
      </div>
    )
  }
}

const form1 = Form.create()(SealComApply);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.sealComApply,
    ...state.sealComApply
  };
}
export default connect(mapStateToProps)(form1);
