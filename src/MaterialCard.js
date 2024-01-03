import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const MaterialCard = ({ title, image, onClick, casId }) => {
  return (
    <Card 
      sx={{
        width: 240, // Largeur fixe pour toutes les cartes
        m: 1,
        bgcolor: 'white',
        borderRadius: '10px', // Bordures arrondies
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2), 0 3px 4px -2px rgba(0,0,0,0.2)', // Ombre nette et marquée
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Transition en douceur pour le survol
        '&:hover': {
          transform: 'translateY(-2px)', // Déplace légèrement la carte vers le haut au survol
          boxShadow: '0 2px 6px 0 rgba(0,0,0,0.24), 0 6px 8px -2px rgba(0,0,0,0.24)' // Ombre plus prononcée et nette au survol
        }
      }}
      onClick={() => onClick(casId)}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140" // Hauteur fixe pour l'image
          image={image}
          alt={title}
        />
        <CardContent sx={{ height: 100 }}> {/* Hauteur fixe pour le contenu */}
          <h6 style={{ margin: 0, padding: 0, fontFamily: 'Poppins', fontWeight: 700 }}>
            {title}
          </h6>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MaterialCard;
