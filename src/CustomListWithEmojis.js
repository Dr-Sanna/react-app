import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Image } from 'antd';

const MarkdownImage = ({ src, alt }) => {
  return (
    <Image
      width='50vw'
      style={{ maxWidth: '50vw', maxHeight: '50vh', objectFit: 'contain' }}
      src={src}
      alt={alt}
      preview={true}
    />
  );
};

// Les emojis pour chaque niveau d'indentation
const emojis = ['🚀', '🤒', '💊'];

const ListElement = ({ children, ...props }) => {
  const level = (props.node.position.start.column - 1) / 2; // suppose 2 espaces par niveau d'indentation
  const emoji = emojis[level % emojis.length];  // choisir l'emoji en fonction du niveau

  // Appliquer une bordure et un espacement uniquement pour les éléments de liste de niveau 1
  const borderBottom = level === 0 ? '1px solid rgb(240, 240, 240)' : 'none';
  const marginBottom = level === 0 ? '10px' : '0'; // Ajouter un peu d'espace entre les éléments de niveau 1

  return (
    <li style={{ 
        listStyleType: 'none', 
        padding: level === 0 ? '5px 0' : '0 0 0 5px', // Ajouter un padding en haut et en bas pour le niveau 1
        margin: '0 0 5px 0 ' + marginBottom + ' 20px', // Appliquer la marge en bas
        borderBottom,
        position: 'relative'  // Ajouté pour positionner l'emoji
    }}>
      <span role="img" aria-label="list bullet" style={{ 
          margin: '5px 10px 0 0', 
          position: 'absolute',  // Position absolue pour l'emoji
          left: '-25px',  // Ajustez selon l'espacement souhaité
          top: '0' 
      }}>
        {emoji}
      </span>
      {children}
    </li>
  );
};

const Paragraph = ({ children }) => {
  // Vérifiez si l'enfant est une image
  const isImage = React.Children.toArray(children).some(
    (child) => child.type === MarkdownImage
  );

  if (isImage) {
    // Rendre sans balise <p> si c'est une image
    return <>{children}</>;
  } else {
    // Sinon, rendu normal avec <p>
    return <p style={{ marginTop: '0em', marginBottom: '1em' }}>{children}</p>;
  }
};


const Heading = ({ level, children, isFirstChild }) => {
  const Tag = `h${level}`;
  const style = {
    marginTop: isFirstChild && level === 4 ? '0' : '1em'
  };
  return <Tag style={style}>{children}</Tag>;
};

const CustomListWithEmojis = ({ markdownText }) => {
  return (
    <ReactMarkdown
      components={{
        ul: ({ children }) => <ul style={{ margin: '0', padding: '0 0 0 20px' }}>{children}</ul>,
        li: ListElement,  // Utiliser ListElement pour les éléments de liste
        p: Paragraph,  // Utiliser Paragraph pour les paragraphes
        h1: props => <Heading {...props} level={1} />,
        h2: props => <Heading {...props} level={2} />,
        h3: props => <Heading {...props} level={3} />,
        h4: (props) => <Heading {...props} level={4} isFirstChild={props.node.position.start.line === 1} />,
        img: MarkdownImage,
      }}
    >
      {markdownText}
    </ReactMarkdown>
  );
};


export default CustomListWithEmojis;
