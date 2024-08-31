import React, { useMemo, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import ImageModal from './ImageModal';
import ImageCarousel from './ImageCarousel';
import { preprocessMarkdown } from './preprocessMarkdown';
import transformYouTubeLinks from './transformYouTubeLinks';
import { visit } from 'unist-util-visit';
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

function removePTagsAroundDivs() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'p' && parent && parent.children) {
        const isOnlyDiv = node.children.length === 1 && node.children[0].tagName === 'div';
        if (isOnlyDiv) {
          parent.children.splice(index, 1, node.children[0]);
        }
      }
    });
  };
}

const CustomMarkdown = React.memo(({ markdownText, imageClass, carouselImages }) => {
  const processedText = useMemo(() => preprocessMarkdown(markdownText), [markdownText]);
  const contentRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const currentRef = contentRef.current;

    if (currentRef) {
      const tables = currentRef.querySelectorAll('table');
      tables.forEach(table => {
        table.style.width = '100%';
        table.style.tableLayout = 'fixed';
        table.style.overflow = 'auto';
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
          cell.style.overflow = 'visible';
        });
      });
    }
  }, [processedText, renderKey]);

  useEffect(() => {
    setRenderKey(prevKey => prevKey + 1);
  }, [markdownText]);

  return (
    <div ref={contentRef} key={renderKey}>
      <ReactMarkdown
        children={processedText}
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw, removePTagsAroundImages, transformYouTubeLinks, removePTagsAroundDivs]}
        components={{
          img: ({ node, ...props }) => (
            <div className={imageClass}>
              <ImageModal
                src={props.src}
                alt={props.alt}
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
            <a {...props}>{props.children}</a>
          ),
        }}
      />
    </div>
  );
});

export default CustomMarkdown;
