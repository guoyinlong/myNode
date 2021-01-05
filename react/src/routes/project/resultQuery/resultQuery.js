import React from "react";
import { connect } from "dva";
import { Button, Row, Col, Input, Table ,Menu,Dropdown,message,Select} from "antd";

import moment from 'moment';
import exportExl from '../../../components/commonApp/exportExl';
import styles from './projectTable.less';
import AdvancedSearchForm from './advancedSearchForm.js';
import AdvancedSearchForm2 from './advancedSearchForm2.js';
const columns = [
    {
        title: '生产单元名称',
        dataIndex: 'proj_name',
        key: 'proj_name',
        width: '200px'
    }, {
        title: '编号',
        dataIndex: 'proj_id',
        key: 'proj_id',
        width: '50px'
    }, {
        title: '年份',
        dataIndex: 'year',
        key: 'year',
        width: '50px'
    }, {
        title: '主责ou',
        dataIndex: 'ou',
        key: 'ou',
    }, {
        title: '项目经理',
        dataIndex: 'mgr_name',
        key: 'mgr_name',
        width: '60px'
    }, {
        title: '项目周期',
        dataIndex: 'kpi_time',
        key: 'kpi_time',
    }, {
        title: '团队人数',
        dataIndex: 'team_size',
        key: 'team_size',
    }, {
        title: '1季度考核结果',
        dataIndex: 'rating_1',
        key: 'rating_1',
    },
    {
        title: '2季度考核结果',
        dataIndex: 'rating_2',
        key: 'rating_2',
    },
    {
        title: '3季度考核结果',
        dataIndex: 'rating_3',
        key: 'rating_3',
    },
    {
        title: '4季度考核结果',
        dataIndex: 'rating_4',
        key: 'rating_4',
    },
];

// const yearMenu = (
//     <Menu onClick={handleMenuClick}>
//     <Menu.Item key="1">1st menu item</Menu.Item>
//     <Menu.Item key="2">2nd menu item</Menu.Item>
//     <Menu.Item key="3">3rd item</Menu.Item>
//     <Menu.Item key="4">3rd item</Menu.Item>
//   </Menu>
// )
//创建router类，继承React的Component类
class resultQuery extends React.Component {
    constructor(props) {
        super(props);
        this.projQuery = this.projQuery.bind(this);
    }
    projQuery= (value) =>  {
        this.props.dispatch({
            type:'resultQuery/projQuery',
            payload:value
        });
    }
        exportExcel = () => {

          let tab=document.querySelector('table');
          let title="考核结果";
          exportExl()(tab,title);

      }
    //     handleChange(event) {
    //     this.setState({year: event.target.year});
    //     this.setState({season: event.target.season});
    //   };

        onOUNameChange = (value) => {
            this.props.dispatch({
                type: "resultQuery/updateOUName",
                ou: value
            });
        }

        onClickBtn(type) {
            if (type === 'query') {
                var startTime = this.props.startYear+this.props.startSeason
                var endTime = this.props.endYear+this.props.endSeason
                if (startTime>endTime){
                    message.error("日期区间不符合要求")
                }else{
                     this.props.dispatch({
                type: "resultQuery/queryData",
            });
                }

        } else if (type === 'reset'){


        this.props.dispatch({
            type: "resultQuery/updateOUName",
            ou: ""
        });

            this.props.dispatch({
            type: "resultQuery/inited",
                });
            }else{
                this.props.dispatch({
                    type: "resultQuery/exportExl",
                });
            }
        }
    render() {
        const { startSeason,startYear,syears,eyears, projectData ,endYear,endSeason,ou, deptList} = this.props;
      const deptOption = deptList.map((item, index) => {
        return (
          <Option key={index} value={item}>{item}</Option>
        )
      })
        var dataSource = projectData.map((item, index, ary) => { item.key = index; return item; });
        return(

            <div className={styles.container}>

                 <div className={styles.screen}>
            <Row >

            <Col span={24} className={styles.select} >
              <div>主责部门:&nbsp;&nbsp;<Select style={{width: "300px"}} value={ou}
                                                              onChange={this.onOUNameChange}>
              {deptOption}
            </Select>
              </div>
            </Col>
            </Row>
            <Row>
            <Col span={12} className={styles.select}>
                <AdvancedSearchForm yearData={syears} year={startYear} season={startSeason} handleChange={this.projQuery}/>
            </Col>
            <Col span={12} className={styles.select}>
                <AdvancedSearchForm2 yearData={eyears} year={endYear} season={endSeason} handleChange={this.projQuery}/>
            </Col>
             </Row>
             <Row>
            <Col span={3} className={styles.select}>
            <Button onClick={() => this.onClickBtn("reset")}
                type="primary">清空条件</Button>
            </Col>
            <Col span={2} className={styles.select}>
            <Button onClick={() => this.onClickBtn("query")}
                type="primary">查询</Button>
            </Col>
            <Col span={2} className={styles.select}>
            <Button onClick={() => this.exportExcel()}
                type="primary">导出</Button>
            </Col>
        </Row>

        </div>
    <Row gutter={16}>
        <div>
        <Table className={styles.orderTable} dataSource={dataSource} columns={columns} />

        </div>
    </Row>
    </div>
        )
        }
    }
//数据映射
const mapStateToProps = (state) => {
    return {
        ...state.resultQuery,
    };
};


//
export default connect(mapStateToProps)(resultQuery);
