/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Progress, Row, Col, Input, Button, Icon } from 'antd';
import styles from '../projAssessmentStandard.less';
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function StandardCard({year,seasons,handleClick}) {
        const number = ['零','一','二','三','四'];
        const cards = seasons.map((item, index) => {
            let percent = 0;
            let text = '待添加';
            switch (item.state) {
                case '-1':
                    percent = 0;
                    text = '待添加';
                    break;
                case '0':
                    percent = 25;
                    text = '待提交';
                    break;
                case '1':
                    percent = 50;
                    text = '待填写';
                    break;
                case '2':
                    percent = 75;
                    text = '待提交';
                    break;
                case '3':
                    percent = 100;
                    text = '已完成';
                    break;
                default:

            }
            return (
                <div className={styles.res_div} key={index}  onClick={()=>handleClick(year,item.season)}>
                    <div className={styles.resCardTop}>
                        <div>
                            <div>
                                <p>{item ? item.season : ''}</p>
                            </div>
                            <div>
                                <p>第{item ? number[parseInt(item.season)] : ''}季度</p>
                            </div>
                        </div>
                        <div>
                            <Progress className={styles.progress} type="circle" percent={percent} width={96} format={()=>text}/>
                        </div>
                    </div>
                    <div className={styles.resCardBottom}>

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

export default StandardCard;
