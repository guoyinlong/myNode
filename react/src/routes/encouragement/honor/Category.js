/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */
import Content from './Content';

class Category extends React.Component {
  render() {
    const {list} = this.props;
    return (
      <div>
        {list && list.length ?
          list.map((item, index) => {
            return(
            <div key={index}>
              <p>{item.category}</p>
              <Content list={item.data}/>
            </div>
            )
          })
          : null}
      </div>
    )
  }
}
export default Category;
