import React from 'react';
import { Card, Image } from 'antd';

const MaterialCard = ({ title, image, onClick, casId }) => (
  <Card
    hoverable
    style={{ width: 240, margin: '1rem' }}
    cover={<Image alt={title} src={image} />}
    onClick={() => onClick(casId)} // Utilisez la prop onClick avec casId
  >
    <Card.Meta title={title} />
  </Card>
);

export default MaterialCard;
