import { visit } from 'unist-util-visit';

function rehypeYoutubeLinks() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Vérifiez que node, parent et leurs propriétés nécessaires sont bien définis
      if (
        node &&
        node.tagName === 'a' &&
        node.properties &&
        node.properties.href &&
        node.children &&
        node.children.length > 0 &&
        node.children[0].type === 'text' &&
        node.children[0].value === 'Vidéo'
      ) {
        const href = node.properties.href;
        const match = href.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:&t=(\d+))?/);
        if (match) {
          const videoId = match[1];
          const startTime = match[2] ? `?start=${match[2]}` : '';
          const iframeSrc = `https://www.youtube.com/embed/${videoId}${startTime}`;

          const iframeNode = {
            type: 'element',
            tagName: 'div',
            properties: { className: 'iframe-container' },
            children: [
              {
                type: 'element',
                tagName: 'iframe',
                properties: {
                  width: '560',
                  height: '315',
                  src: iframeSrc,
                  allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                  allowFullScreen: true
                }
              }
            ]
          };

          if (parent && parent.children && typeof index === 'number' && index < parent.children.length) {
            parent.children[index] = iframeNode;
          }
        }
      }
    });
  };
}

export default rehypeYoutubeLinks;
