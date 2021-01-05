
/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Progress, Row, Col, Input, Button, Icon ,message} from 'antd';
import styles from '../projAssessmentStandard.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AssessmentStandardCard({projectId,year,seasons,handleCardDetail}) {
    const number = ['零','一','二','三','四'];
    const cards = seasons.map((item, index) => {
        let percent = 0;
        let text = '';
        if (item.template_state === '3') {
            if (item.kpi_fill_state) {
                switch (item.kpi_fill_state) {
                    case '1':
                        percent = 25;
                        text = '待提交';
                        break;
                    case '2':
                        percent = 50;
                        text = '待审核';
                        break;
                    case '3':
                        percent = 75;
                        text = '审核中';
                        break;
                    case '4':
                        percent = 90;
                        text = '审核中';
                        break;
                    case '5':
                        percent = 100;
                        text = '已完成';
                        break;
                }
            } else {
                percent = 0;
                text = '待填写';
            }
        } else {
            percent = 0;
            text = '未开始';
        }

        return (
            <div className={styles.res_div} key={index} onClick={() => {
                if (item.template_state === '3') {
                    if (percent=== 75) {
                        message.info('考核指标被退回，请到待办中查看', 6)
                    }else{
                        //handleCardDetail(index+1,year,projectId)
                        handleCardDetail(item.season,year,projectId)
                    }
                }else{
                    message.info('指标设定还未开始，请耐心等待', 6)
                }
            }}>
                <div className={styles.resCardTop}>
                    <div>
                        <div>
                            <p>{item ? item.season : index+1}</p>
                        </div>
                        <div>
                            <p>第{item ? number[parseInt(item.season)] : number[parseInt(index+1)]}季度</p>
                        </div>
                    </div>
                    <div>
                        <Progress className={styles.progress} type="circle" percent={percent} width={96} format={()=>text} />
                    </div>
                </div>
                <div className={styles.resCardBottom}>
                    {percent === 75 ? <div>考核指标被退回 请到待办中查看</div>:''}
                </div>
            </div>
        )
    })
    return (
        <div>
            {cards}
        </div>
    );
}

export default AssessmentStandardCard;

