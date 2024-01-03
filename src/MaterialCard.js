import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { motion } from 'framer-motion';  // Importez motion de Framer Motion

const MaterialCard = ({ title, image, onClick, casId }) => {
  return (
    // Utilisez motion.div pour envelopper le composant Card
    <motion.div 
      whileHover={{ scale: 1.05, y: -10 }}  // Appliquez l'effet de survol avec Framer Motion
      transition={{ type: "spring", stiffness: 300 }}  // Personnalisez la transition si nécessaire
      onClick={() => onClick(casId)}
    >
      <Card 
        sx={{
          width: 240,
          m: 1,
          bgcolor: 'white',
          borderRadius: '10px',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2), 0 3px 4px -2px rgba(0,0,0,0.2)',
          // Retirez les styles de survol de Material-UI puisque Framer Motion s'en charge
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt={title}
          />
          <CardContent sx={{ height: 100 }}>
            <h6 style={{ margin: 0, padding: 0, fontFamily: 'Poppins', fontWeight: 700 }}>
              {title}
            </h6>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default MaterialCard;
