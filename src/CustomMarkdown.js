import React, { useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import gfm from 'remark-gfm';
import ImageModal from './ImageModal';
import ImageCarousel from './ImageCarousel';
import { preprocessMarkdown } from './preprocessMarkdown';
import './CustomMarkdown.css';

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

function transformYoutubeLinks() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'a' && node.properties && node.properties.href) {
        const href = node.properties.href;
        const match = href.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:&t=(\d+))?/);
        if (match) {
          const videoId = match[1];
          const startTime = match[2] ? `?start=${match[2]}` : '';
          const iframeSrc = `https://www.youtube.com/embed/${videoId}${startTime}`;

          if (parent.tagName === 'p' && parent.children && parent.children.length === 1) {
            parent.tagName = 'div';
            parent.properties.className = ['video-button-container'];
            parent.children = [
              {
                type: 'element',
                tagName: 'button',
                properties: {
                  className: ['video-button'],
                  type: 'button',
                  'data-src': iframeSrc
                },
                children: [{ type: 'text', value: 'Vidéo explicative' }]
              }
            ];
          } else {
            parent.children[index] = {
              type: 'element',
              tagName: 'div',
              properties: { className: ['video-button-container'] },
              children: [
                {
                  type: 'element',
                  tagName: 'button',
                  properties: {
                    className: ['video-button'],
                    type: 'button',
                    'data-src': iframeSrc
                  },
                  children: [{ type: 'text', value: 'Vidéo explicative' }]
                }
              ]
            };
          }
        }
      }
    });
  };
}

const CustomMarkdown = React.memo(({ markdownText, imageStyle, carouselImages }) => {
  const processedText = useMemo(() => preprocessMarkdown(markdownText), [markdownText]);
  const contentRef = useRef(null);

  useEffect(() => {
    const currentRef = contentRef.current;

    const handleButtonClick = (event) => {
      if (event.target && event.target.classList.contains('video-button')) {
        const button = event.target;
        const src = button.getAttribute('data-src');
        let iframe = button.nextElementSibling;
        if (!iframe || iframe.tagName !== 'IFRAME') {
          iframe = document.createElement('iframe');
          iframe.width = '560';
          iframe.height = '315';
          iframe.src = src;
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          button.parentNode.insertBefore(iframe, button.nextSibling);
        } else {
          iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
        }
        button.textContent = iframe.style.display === 'none' ? 'Vidéo explicative' : 'Masquer la vidéo';
      }
    };

    if (currentRef) {
      currentRef.addEventListener('click', handleButtonClick);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', handleButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      const tables = currentRef.querySelectorAll('table, td');
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
        rehypePlugins={[rehypeRaw, removePTagsAroundImages, transformYoutubeLinks]}
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
          },
          p: ({ node, ...props }) => (
            <p {...props} />
          ),
          a: ({ node, ...props }) => (
            <a {...props} />
          ),
          // Ajoutez d'autres composants personnalisés ici si nécessaire
        }}
      />
    </div>
  );
});

export default CustomMarkdown;
