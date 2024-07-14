import React, { useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import gfm from 'remark-gfm';
import ImageModal from './ImageModal';
import ImageCarousel from './ImageCarousel';
import { preprocessMarkdown } from './preprocessMarkdown'; // Importez la fonction depuis le nouveau fichier
import './CustomMarkdown.css'; // Importer le fichier CSS

function removePTagsAroundImages() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'p' && parent && parent.children) {
        const isOnlyImage = node.children.length === 1 && node.children[0].tagName === 'img';
        if (isOnlyImage) {
          parent.children.splice(index, 1, node.children[0]);
        }
      }
    });
  };
}

const CustomMarkdown = React.memo(({ markdownText, imageStyle, carouselImages }) => {
  const processedText = useMemo(() => preprocessMarkdown(markdownText), [markdownText]);
  const contentRef = useRef(null);
  const scrollPosition = useRef(0);

  const saveScrollPosition = () => {
    scrollPosition.current = window.scrollY;
  };

  const restoreScrollPosition = () => {
    window.scrollTo(0, scrollPosition.current);
  };

  useEffect(() => {
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const match = href.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:&t=(\d+))?/);
        if (match) {
          const videoId = match[1];
          const startTime = match[2] ? `?start=${match[2]}` : '';
          const iframeSrc = `https://www.youtube.com/embed/${videoId}${startTime}`;
          
          const container = document.createElement('div');
          container.classList.add('video-container');

          const button = document.createElement('button');
          button.textContent = 'Vidéo explicative';
          button.classList.add('video-button'); // Ajout de la classe pour le style
          
          let iframeVisible = false;
          let iframe;

          button.onclick = () => {
            if (!iframeVisible) {
              iframe = document.createElement('iframe');
              iframe.width = '560';
              iframe.height = '315';
              iframe.src = iframeSrc;
              iframe.frameBorder = '0';
              iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
              iframe.allowFullscreen = true;
              iframe.onfullscreenchange = () => {
                if (!document.fullscreenElement) {
                  restoreScrollPosition();
                }
              };
              saveScrollPosition();
              container.appendChild(iframe);
              button.textContent = 'Masquer la vidéo';
            } else {
              iframe.remove();
              button.textContent = 'Vidéo explicative';
            }
            iframeVisible = !iframeVisible;
          };

          container.appendChild(button);
          link.replaceWith(container);
        }
      });
    }
  }, [markdownText]);

  useEffect(() => {
    if (contentRef.current) {
      const tables = contentRef.current.querySelectorAll('table, td');
      tables.forEach(table => {
        const style = table.getAttribute('style');
        if (style && style.includes('border-style: solid')) {
          table.setAttribute('style', style.replace(/border-style: solid/g, 'border-style: none'));
        }
      });
    }
  }, [processedText]);

  return (
    <div ref={contentRef}>
      <ReactMarkdown
        children={processedText}
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw, removePTagsAroundImages]}
        components={{
          img: ({ node, ...props }) => (
            <div style={{ display: 'flex', justifyContent: 'center', ...imageStyle }}>
              <ImageModal
                src={props.src}
                alt={props.alt}
                placeholder="" // Ajoutez ici le chemin de votre image de placeholder
              />
            </div>
          ),
          div: ({ node, className, ...props }) => {
            if (className === 'custom-carousel') {
              return <ImageCarousel images={carouselImages} />;
            }
            return <div className={className} {...props} />;
          }
        }}
      />
    </div>
  );
});

export default CustomMarkdown;
