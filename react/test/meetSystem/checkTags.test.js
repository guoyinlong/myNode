//import 'babel-polyfill'
import CheackTabs from '../../src/components/meetSystem/checkTags.js'
import TestUtils from 'react-dom/test-utils';
import React from 'react';
import {expect} from 'chai'

const props={
  tabsData:[
    {
      disabled:false,
      text:'09:10-10:30',
      checked:false,
    },
    {
      disabled:false,
      text:'09:10-10:30',
      checked:true,
    },
    {
      disabled:true,
      text:'09:10-10:30',
      checked:false,
    },
    {
      disabled:true,
      text:'09:10-10:30',
      checked:false,
      show:false
    }

  ],
  tabsChange(){}
}
function shallowRender(Component, props) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Component {...props}/>);
  return renderer.getRenderOutput();
}
function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}
describe('Shallow Rendering', function () {
  const tabsItem = shallowRender(CheackTabs, props);
  it('第一个组件应该是CheckableTag组件', function () {

    expect(getDisplayName(tabsItem.props.children[0].type)).to.equal('CheckableTag');

  });
  it('第三个组件应该是Button组件', function () {
   // const tabsItem = shallowRender(CheackTabs, props);
    expect(getDisplayName(tabsItem.props.children[2].type)).to.equal('Button');



  });
  it('第三个组件为disabled状态', function () {
    //const tabsItem = shallowRender(CheackTabs, props);
    let component=new tabsItem.props.children[0].type(props.tabsData[2])
    expect(component.props.disabled).to.equal(true);

  });
});
// describe('DOM Rendering', function () {
//   it('Click the delete button, the Todo item should be deleted', function () {
//     const app = TestUtils.renderIntoDocument(<CheackTabs {...props}/>);
//     let todoItems = TestUtils.scryRenderedDOMComponentsWithTag(app, 'div');
//     console.log(todoItems)
//     expect(todoItemsAfterClick.length).to.equal(todoLength - 1);
//   });
// });
