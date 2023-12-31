// LeftMenu.js
import React from 'react';
import { Menu } from 'antd';

const LeftMenu = ({ menuItems, selectedKey }) => (
  <Menu
    mode="inline"
    items={menuItems}
    selectedKeys={[selectedKey]} // Assurez-vous que selectedKeys reçoit un tableau
    style={{ height: '100%', borderRight: 0 }}
  />
);

export default LeftMenu;

