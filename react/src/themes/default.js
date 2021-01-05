/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：样式配置文件
 */
module.exports = () => {
  return {
    //超链接颜色
    // "@link-color": "#1DA57A",
    "@link-color": "#4B9BF2",
    "@line-height-base": "1.2",

    //主色调
    '@primary-color': '#FA7252',
    //'@primary-color': '#1088ae',
    //圆角
    '@border-radius-base': '3px',
    '@border-radius-sm': '2px',
    //阴影
    '@shadow-color': 'rgba(0,0,0,0.05)',
    '@shadow-1-down': '4px 4px 40px @shadow-color',
    //边框颜色
    '@border-color-split': '#f4f4f4',
    '@border-color-base': '#e5e5e5',
    //框架主色调
    '@menu-dark-bg': '#273135',
    //文字颜色
    '@text-color': '#333',
    '@frame-color': '#89949b',
    '@text-color-white': '#fff',
    //重要：icon-url在开发环境去掉/portal，但不要提交svn，否则无发加载iconfont
    '@icon-url': '"/fonts/iconfont/iconfont"',
    '@font-size-base': '14px',
    '@font-size-lg': '16px',
    '@font-family': 'tahoma,arial,Hiragino Sans GB,\5b8b\4f53,sans-serif,DFChuW4-B5',
    '@modal-mask-bg': 'rgba(0,0,0,0.6)'
  }
}
