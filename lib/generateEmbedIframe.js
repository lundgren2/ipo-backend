// Replace URL with embed iframe
const generateEmbedIframeFromUrl = (body) => {
  if (!body) return body;

  // YouTube
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w-]{10,12})(?:\?.*)?/g;
  if (body.match(youtubeRegex)) {
    return body.replace(
      youtubeRegex,
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>',
    );
  }
  // Spotify podcast
  const spotifyPodcatRegex =
    /(?:https?:\/\/)?(?:open\.spotify\.com\/)(?:episode\/)?([\w-]{22})(?:\?.*)?/g;
  if (body.match(spotifyPodcatRegex)) {
    return body.replace(
      spotifyPodcatRegex,
      '<iframe src="https://open.spotify.com/embed/episode/$1?utm_source=generator" width="100%" height="232" allowfullscreen="" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>',
    );
  }
  // Spotify track or album
  const spotifyRegex =
    /(?:https?:\/\/)?(?:open\.spotify\.com\/)(?:track\/|album\/)([\w-]{22})(?:\?.*)?/g;
  if (body.match(spotifyRegex)) {
    return body.replace(
      spotifyRegex,
      '<iframe src="https://open.spotify.com/embed/track/$1" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>',
    );
  }
  // Soundcloud
  const soundcloudRegex =
    /(?:https?:\/\/)?(?:soundcloud\.com\/)([\w-]{22})(?:\?.*)?/g;
  if (body.match(soundcloudRegex)) {
    return body.replace(
      soundcloudRegex,
      '<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/$1&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"></iframe>',
    );
  }
  // Vimeo
  const vimeoRegex = /(?:https?:\/\/)?(?:vimeo\.com\/)([\w-]{22})(?:\?.*)?/g;
  if (body.match(vimeoRegex)) {
    return body.replace(
      vimeoRegex,
      '<iframe src="https://player.vimeo.com/video/$1" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>',
    );
  }

  return body;
};

module.exports = generateEmbedIframeFromUrl;
