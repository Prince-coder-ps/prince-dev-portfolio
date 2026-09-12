import { useState } from 'react';
import { FiX, FiImage } from 'react-icons/fi';
import useContent from '../../hooks/useContent';
import { getGallery } from '../../services/content';
import AsyncState from '../AsyncState';
import './Gallery.css';

const Gallery = () => {
  const { data, loading, error } = useContent(getGallery);
  const items = data?.items || [];
  const [active, setActive] = useState(null);

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <span className="section-kicker"><FiImage /> Gallery</span>
        <h2 className="section-heading">Moments & snapshots</h2>

        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="Gallery is empty for now.">
          <div className="gallery__grid">
            {items.map((g) => (
              <button key={g._id} className="gallery__item" onClick={() => setActive(g)}>
                <img src={g.image.url} alt={g.title} loading="lazy" />
                <span>{g.title}</span>
              </button>
            ))}
          </div>
        </AsyncState>
      </div>

      {active && (
        <div className="gallery__lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button className="gallery__lightbox-close" aria-label="Close" onClick={() => setActive(null)}>
            <FiX size={26} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={active.image.url} alt={active.title} />
            <figcaption>
              <strong>{active.title}</strong>
              {active.description && <p>{active.description}</p>}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default Gallery;
