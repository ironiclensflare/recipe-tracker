import React from 'react';

interface YoutubeEmbedProps {
  url: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url }) => {
  if (!url) return null;
  let embedUrl = url;
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }
  } catch (e) {
    console.error('Error parsing URL:', e);
  }
  return (
    <div className="relative w-full aspect-video">
      <iframe 
        src={embedUrl}
        allowFullScreen
        title="Recipe video"
        className="absolute inset-0 w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
