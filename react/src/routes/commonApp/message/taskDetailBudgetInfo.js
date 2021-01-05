/**
 * 作者：任华维
 * 日期：2017-10-21 
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：此文件未使用
 */
// import React, { Component } from 'react';
// import {Table } from 'antd';
// import styles from '../../project/startup/projStartMain/projAttachment.less';
//
//
// function BudgetInfo({data}) {
//     console.log(data);
//     const columns = [{
//         title:'年度',
//         dataIndex:'year',
//         fixed:'left',
//         width:100,
//         render: (text, record, index) => {
//             return {
//                 children:text,
//             };
//         },
//     },{
//         title:'费用类别',
//         dataIndex:'fee_name',
//         fixed:'left',
//         width:300,
//     },{
//         title:'联通软件研究院公共平台与架构研发事业部（新）',
//         dataIndex:'',
//         fixed:'left',
//     },{
//         title:'联通软件研究院项目管理部（新）',
//         dataIndex:'',
//         fixed:'left',
//     },{
//         title:'联通软件研究院公共平台与架构部（旧）',
//         dataIndex:'',
//         fixed:'left',
//     },{
//         title:'联通软件研究院项目与质量支撑部（旧）',
//         dataIndex:'',
//         fixed:'left',
//     },{
//         title:'小计',
//         dataIndex:'',
//         fixed:'left',
//     }];
//     //获取页面上部门的条数
//     const getDeptShow=()=>{
//         let deptsLength=0;
//         for(let i=0;i<data.length;i++){
//             if(data[i].tag!='3'){
//                 deptsLength++;
//             }
//         }
//         return deptsLength
//     }
//     const objScroll={ x:1000, y:500 }
//     if(getDeptShow()>3){
//       objScroll.x=550+(getDeptShow())*150;
//     }
//     return (
//         <div style={{width:900,margin:'auto',marginTop:24}}>
//             <h2 className={styles.headerName} style={{textAlign:'center'}}>部门预算信息</h2>
//             <Table
//                 columns={columns}
//                 dataSource={data}
//                 pagination={false}
//                 className={styles.orderTable}
//                 bordered={true}
//             />
//         </div>
//     );
// }
// export default BudgetInfo;
