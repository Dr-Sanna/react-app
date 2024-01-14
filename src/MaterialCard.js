import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardMedia } from '@mui/material';

const MaterialCard = React.memo(({ title, imageUrl, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      onClick={onClick}
    >
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        bgcolor: 'white',
        borderRadius: '10px',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2), 0 3px 4px -2px rgba(0,0,0,0.2)'
      }}>
        <CardMedia
          component="img"
          image={imageUrl || '/defaultImage.jpg'}
          alt={title}
          style={{
            height: '120px',
            objectFit: 'cover'
          }}
        />
        <CardContent style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          margin: '16px',
          padding: '0',
        }}>
          <h6 style={{
            margin: '0',
            padding: '0',
            minHeight: '60px',
          }}>
            {title}
          </h6>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default MaterialCard;
