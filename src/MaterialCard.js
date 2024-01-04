import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material';

const MaterialCard = React.memo(({ title, imageUrl, onClick }) => {
  return (
    <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      type: "tween", 
      duration: 0.5, // Durée de l'animation
      ease: "easeInOut" // Fonction d'assouplissement (Voir la documentation de Framer Motion pour plus d'options)
    }}  // Augmentez la durée ici (en secondes)    
    onClick={onClick}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Card sx={{ width: 240, m: 1, bgcolor: 'white', borderRadius: '10px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2), 0 3px 4px -2px rgba(0,0,0,0.2)' }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={imageUrl || '/defaultImage.jpg'} // Fournir une image par défaut
              alt={title}
              // Gestion du chargement pour éviter le clignotement
              style={{ opacity: 1, transition: 'opacity 0.5s' }}
            />
            <CardContent sx={{ height: 100 }}>
              <h6 style={{ margin: 0, padding: 0, fontFamily: 'Poppins', fontWeight: 700 }}>{title}</h6>
            </CardContent>
          </CardActionArea>
        </Card>
      </motion.div>
    </motion.div>
  );
});

export default MaterialCard;
