import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import ModalImage from 'react-modal-image';
import ImageCarousel from './ImageCarousel';
import ReactDOMServer from 'react-dom/server';
import { IconDanger, IconInfo, IconAttention, IconAstuce, IconRemarque } from './IconComponents';

function preprocessMarkdown(markdownText) {
  const processedText = markdownText
    .replace(/:::danger(?:\\\[([^\\\]]*?)\\\])?/g, (match, title) => {
      const finalTitle = title ? title : 'Danger';
      return `<div class="theme-admonition theme-admonition-danger admonition_o5H7 alert alert--danger">
        <div class="admonitionHeading_FzoX">
          <span class="admonitionIcon_rXq6">${ReactDOMServer.renderToStaticMarkup(<IconDanger />)}</span>
          ${finalTitle}
        </div>
        <div class="admonitionContent_Knsx">`;
    })
    .replace(/:::info(?:\\\[([^\\\]]*?)\\\])?/g, (match, title) => {
      const finalTitle = title ? title : 'Info';
      return `<div class="theme-admonition theme-admonition-info admonition_o5H7 alert alert--info">
        <div class="admonitionHeading_FzoX">
          <span class="admonitionIcon_rXq6">${ReactDOMServer.renderToStaticMarkup(<IconInfo />)}</span>
          ${finalTitle}
        </div>
        <div class="admonitionContent_Knsx">`;
    })
    .replace(/:::attention(?:\\\[([^\\\]]*?)\\\])?/g, (match, title) => {
      const finalTitle = title ? title : 'Attention';
      return `<div class="theme-admonition theme-admonition-warning admonition_o5H7 alert alert--warning">
        <div class="admonitionHeading_FzoX">
          <span class="admonitionIcon_rXq6">${ReactDOMServer.renderToStaticMarkup(<IconAttention />)}</span>
          ${finalTitle}
        </div>
        <div class="admonitionContent_Knsx">`;
    })
    .replace(/:::astuce(?:\\\[([^\\\]]*?)\\\])?/g, (match, title) => {
      const finalTitle = title ? title : 'Astuce';
      return `<div class="theme-admonition theme-admonition-tip admonition_o5H7 alert alert--success">
        <div class="admonitionHeading_FzoX">
          <span class="admonitionIcon_rXq6">${ReactDOMServer.renderToStaticMarkup(<IconAstuce />)}</span>
          ${finalTitle}
        </div>
        <div class="admonitionContent_Knsx">`;
    })
    .replace(/:::remarque(?:\\\[([^\\\]]*?)\\\])?/g, (match, title) => {
      const finalTitle = title ? title : 'Remarque';
      return `<div class="theme-admonition theme-admonition-note admonition_o5H7 alert alert--secondary">
        <div class="admonitionHeading_FzoX">
          <span class="admonitionIcon_rXq6">${ReactDOMServer.renderToStaticMarkup(<IconRemarque />)}</span>
          ${finalTitle}
        </div>
        <div class="admonitionContent_Knsx">`;
    })
    .replace(/:::accordion(?:\\\[([^\\\]]*?)\\\])?/g, (match, title) => {
      const finalTitle = title ? title : 'Remarque';
      return `<details class="details_Nokh isBrowser_QrB5 alert alert--info details_Cn_P">
        <summary>${finalTitle}</summary>
        <div class="collapsibleContent_EoA1">`;
    })
    .replace(/(\n?):::(\n?)/g, (match, before, after) => {
      return `${before}</div></div>${after}`;
    })
    .replace(/(\n?):-:(\n?)/g, (match, before, after) => {
      return `${before}</div></details>${after}`;
    })
    .replace(/\[carousel\]/g, '<div class="custom-carousel"></div>')
    .replace(/\\\[carousel\\\]/g, () => '<div class="custom-carousel"></div>');

  return processedText;
}

const CustomMarkdown = ({ markdownText, imageStyle, carouselImages }) => {
  const processedText = preprocessMarkdown(markdownText);

  return (
    <ReactMarkdown
      children={processedText}
      remarkPlugins={[gfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ node, ...props }) => (
          <div style={{ display: 'flex', justifyContent: 'center', ...imageStyle }}>
            <ModalImage
              small={props.src}
              large={props.src}
              alt={props.alt}
              hideDownload={true}
              hideZoom={false}
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
  );
};

export default CustomMarkdown;
