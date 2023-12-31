import React from 'react';
import { List } from 'antd';

const CustomList = ({ items }) => {
  return (
    <List
      size="small"
      bordered
      dataSource={items}
      renderItem={item => (
        <List.Item>
          {item}
        </List.Item>
      )}
      style={{ marginBottom: '20px' }} // Ajoutez une marge en bas ici
    />
  );
};

export default CustomList;
