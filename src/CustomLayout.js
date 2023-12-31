// CustomLayout.js
import React from 'react';
import { Layout } from 'antd';

const { Sider, Content } = Layout;

const CustomLayout = ({ leftSider, children, rightSider }) => (
  <Layout style={{ height: '100vh' }}>
    <Sider width="20vw" style={{ borderRight: '1px solid #e8e8e8' }}>{leftSider}</Sider>
    <Content>{children}</Content>
    <Sider width="15vw" style={{ borderLeft: '1px solid #e8e8e8', background: 'white' }}>{rightSider}</Sider>
  </Layout>
);

export default CustomLayout;
