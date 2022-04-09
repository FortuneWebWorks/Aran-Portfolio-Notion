import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useRef, useEffect, useState } from 'react';
import { getDatabase } from '@/lib/notion';
import { Text } from './[id].js';
import style from '@/styles/gallery.module.css';
import Layout from '@/components/Layout.js';

export const databaseId = process.env.NOTION_DATABASE_ID;

function Gallery({ posts }) {
  const [close, setClose] = useState(false);

  const imgContainerRef = useRef();
  const galleryRef = useRef();

  function clickHandler(slug) {
    let correctUrl = router.pathname.split('/')[1];

    if (document.getElementById(`${correctUrl}`)) {
      document.getElementById(`${correctUrl}`).style.opacity = '0';
    }

    galleryRef.current.classList.add(style.opened);
    router.push(`/gallery/${slug}`);
  }

  const router = useRouter();

  function onMouseEnter(e) {
    const target = e.target;
    target.classList.add(style.hover);
  }

  function onMouseLeave(e) {
    const target = e.target;
    target.classList.remove(style.hover);
  }

  Router.events.on('routeChangeStart', () => {
    setClose(true);
  });

  return (
    <Layout>
      <div className={style.container}>
        <div
          className={`${style.gallery} ${close && style.fadeout}`}
          id="gallery"
          ref={galleryRef}
        >
          {posts &&
            posts.map((item) => {
              const date = new Date(item.last_edited_time).toLocaleString(
                'en-US',
                {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }
              );
              const title = item.properties.Name.title;
              const imageUrl = item.properties.cover.files[0].file.url;

              return (
                <div
                  className={style.gallery_item}
                  key={item.id}
                  data-key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    clickHandler(item.id);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div
                    className={style.image_container}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    ref={imgContainerRef}
                    style={{
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt="img"
                      layout="intrinsic"
                      width="300px"
                      height="200px"
                      objectFit="contain"
                      // priority={true}
                      loading="lazy"
                    />
                    <div className={style.title_date}>
                      <Text text={title} className={style.title} />
                      {/* <span className={style.date}>{date}</span> */}
                    </div>
                  </div>
                  <p className={style.description}>Hell</p>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

export default Gallery;

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
