import { visit } from 'unist-util-visit';

const transformYouTubeLinks = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties && typeof node.properties.href === 'string') {
        const url = node.properties.href;
        const videoIdMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        const timestampMatch = url.match(/t=(\d+)s/);

        if (videoIdMatch && videoIdMatch[1]) {
          const videoId = videoIdMatch[1];
          const timestamp = timestampMatch ? timestampMatch[1] : '0';

          // Remplacez le lien par un conteneur div avec un bouton et une iframe
          node.tagName = 'div';
          node.properties = { className: 'video-container' };
          node.children = [
            {
              type: 'element',
              tagName: 'button',
              properties: {
                className: 'video-button',
                onClick: function(event) {
                  const button = event.target;
                  const iframe = button.nextElementSibling;
                  if (iframe && iframe.tagName === 'IFRAME') {
                    if (iframe.style.display === 'none' || iframe.style.display === '') {
                      iframe.style.display = 'block';
                      button.textContent = 'Masquer la vidéo';
                    } else {
                      iframe.style.display = 'none';
                      button.textContent = 'Vidéo explicative';
                    }
                  }
                }
              },
              children: [{ type: 'text', value: 'Vidéo explicative' }],
            },
            {
              type: 'element',
              tagName: 'iframe',
              properties: {
                src: `https://www.youtube.com/embed/${videoId}?start=${timestamp}`,
                width: '560',
                height: '315',
                frameBorder: '0',
                allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                allowFullScreen: true,
                style: { display: 'none' }, // Initialement caché
              },
              children: [],
            },
          ];
        }
      }
    });
  };
};

export default transformYouTubeLinks;
