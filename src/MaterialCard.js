import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardMedia } from '@mui/material';

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
        <Card sx={{ 
  display: 'flex', 
  flexDirection: 'column', 
  width: '100%',  // Prend toute la largeur du conteneur
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
      height: '120px', // Hauteur fixe pour toutes les images
      objectFit: 'cover'
    }}
  />
  <CardContent style={{ 
    flexGrow: 1, // Prend tout l'espace restant après l'image
    display: 'flex', // Permet au contenu de s'étirer et de se contracter
    flexDirection: 'column', // Empile le contenu verticalement
    justifyContent: 'center', // Centre le contenu
    margin: '16px', 
      padding: '0', 
  }}>
    <h6 style={{ 
      margin: '0', 
      padding: '0', 
      fontFamily: 'Poppins', 
      fontWeight: 700,
      minHeight: '60px', // Hauteur minimale basée sur le titre le plus long
    }}>
      {title}
    </h6>
  </CardContent>
</Card>
      </motion.div>
    </motion.div>
  );
});

export default MaterialCard;