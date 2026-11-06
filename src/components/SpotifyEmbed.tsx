export default function SpotifyEmbed() {
  return (
    <section className="spotify-section">
      <div className="spotify-heading">
        <h2>For You Loved One</h2>
        <p>Your favourite Spotify collection</p>
      </div>

      <iframe
        title="For You Loved One - Spotify Playlist"
        src="https://open.spotify.com/embed/playlist/3KJoh5Pn2NV7c0sjjbeanX"
        width="100%"
        height="352"
        style={{ borderRadius: '12px', border: 0 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        allowFullScreen
      />
    </section>
  )
}