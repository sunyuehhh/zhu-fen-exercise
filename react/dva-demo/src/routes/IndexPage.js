import React from 'react';
import { connect } from 'dva';
import { Button, DatePicker } from 'antd';


function IndexPage() {
  return (
    <div>
      <h1>Hello Dva + Ant Design</h1>
      <Button type="primary">Primary Button</Button>
      <DatePicker />
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
