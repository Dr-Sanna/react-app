import ReactDOMServer from 'react-dom/server';
import { IconDanger, IconInfo, IconAttention, IconAstuce, IconRemarque } from './IconComponents';

const admonitionTypes = {
  danger: { className: 'danger', icon: <IconDanger />, defaultTitle: 'Danger' },
  info: { className: 'info', icon: <IconInfo />, defaultTitle: 'Info' }, //bleu
  attention: { className: 'warning', icon: <IconAttention />, defaultTitle: 'Attention' },
  astuce: { className: 'tip', icon: <IconAstuce />, defaultTitle: 'Astuce' },
  remarque: { className: 'note', icon: <IconRemarque />, defaultTitle: 'Remarque' }, //gris
  accordion: { className: 'info', defaultTitle: 'Remarque', isAccordion: true },
};

function renderAdmonition(type, title) {
  const { className, icon, defaultTitle, isAccordion } = admonitionTypes[type];
  const finalTitle = title || defaultTitle;
  const iconMarkup = icon ? ReactDOMServer.renderToStaticMarkup(icon) : '';

  // Correct the alert class for "astuce" (tip)
  const alertClass = type === 'astuce' ? 'success' : (type === 'remarque' ? 'secondary' : className);
  const baseClass = `theme-admonition theme-admonition-${className} admonition_o5H7 alert alert--${alertClass}`;

  if (isAccordion) {
    return `<details class="details_Nokh isBrowser_QrB5 alert alert--${className} details_Cn_P">
      <summary>${finalTitle}</summary>
      <div class="collapsibleContent_EoA1">`;
  }

  return `<div class="${baseClass}">
    <div class="admonitionHeading_FzoX">
      <span class="admonitionIcon_rXq6">${iconMarkup}</span>
      ${finalTitle}
    </div>
    <div class="admonitionContent_Knsx">`;
}

export function preprocessMarkdown(markdownText) {
  if (!markdownText) {
    return '';
  }

  const processedText = markdownText
    .replace(/:::(danger|info|attention|astuce|remarque|accordion)(?:\\\[([^\\\]]*?)\\\])?/g, (match, type, title) => {
      return renderAdmonition(type, title);
    })
    .replace(/(\n?):::(\n?)/g, (match, before, after) => {
      return `${before}</div></div>${after}`;
    })
    .replace(/(\n?):-:(\n?)/g, (match, before, after) => {
      return `${before}</div></details>${after}`;
    })
    .replace(/\[carousel\]/g, '<div class="custom-carousel"></div>')
    .replace(/\\\[carousel\\\]/g, '<div class="custom-carousel"></div>');

  return processedText;
}
