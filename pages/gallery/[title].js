import { Fragment, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getDatabase, getPage, getBlocks, getPageWithSlug } from '@/lib/notion';
import { databaseId } from './index.js';
// import styles from './post.module.css';
import style from '@/styles/gallery.module.css';
import Layout from '@/components/Layout.js';
import Arrow from '@/components/SVG/arrow.svg';
import { Text } from '@/components/notionApi';

export default function Post({ page, blocks, paths }) {
  const router = useRouter();
  const [routerQuery, setRouterQuery] = useState(router.query);
  const galleryRef = useRef();
  const [positions, setPosition] = useState(() => ({
    xDown: null,
    yDown: null,
  }));
  const direction = useRef('');

  const { xDown, yDown } = positions;

  const navigate = (arrow) => {
    window.removeEventListener('touchstart', navigateWithSwipeStart);
    window.removeEventListener('touchmove', navigateWithSwipeMove);
    window.removeEventListener('touchend', navigateWithSwipeEnd);

    const { title } = router.query;
    let getNextPath = null;

    if (arrow === 'previous') {
      getNextPath = paths.map((item, index) =>
        paths[index - 1] && item.properties.Name.title[0].plain_text === title
          ? paths[index - 1].properties.Name.title[0].plain_text || ''
          : ''
      );
    } else {
      getNextPath = paths.map((item, index) =>
        paths[index + 1] && item.properties.Name.title[0].plain_text === title
          ? paths[index + 1].properties.Name.title[0].plain_text || ''
          : ''
      );
    }

    const nextPath = getNextPath.filter((item) => item !== '');
    if (nextPath.length > 0)
      router.push(
        {
          pathname: `/gallery/${nextPath[0]}`,
        },
        undefined,
        { scroll: false }
      );
  };

  const navigateWithKeys = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const correntUrl = window.location.href.split('/');
      const title = correntUrl[correntUrl.length - 1];
      let getNextPath = null;

      if (e.key === 'ArrowLeft') {
        getNextPath = paths.map((item, index) =>
          paths[index - 1] && item.properties.Name.title[0].plain_text === title
            ? paths[index - 1].properties.Name.title[0].plain_text || ''
            : ''
        );
      }

      if (e.key === 'ArrowRight') {
        getNextPath = paths.map((item, index) =>
          paths[index + 1] && item.properties.Name.title[0].plain_text === title
            ? paths[index + 1].properties.Name.title[0].plain_text || ''
            : ''
        );
      }

      const nextPath = getNextPath.filter((item) => item !== '');

      if (nextPath.length > 0) {
        router.push(
          {
            pathname: `/gallery/${nextPath[0]}`,
          },
          undefined,
          { scroll: false }
        );
      }
    }
  };

  const navigateWithSwipeStart = (e) => {
    setPosition({
      xDown: e.touches[0].clientX,
      yDown: e.touches[0].clientY,
    });
  };

  const navigateWithSwipeMove = (e) => {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = e.touches[0].clientX;
    let yUp = e.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        direction.current = 'left';
      } else {
        direction.current = 'right';
      }
    } else {
      if (yDiff > 0) {
        return;
      } else {
        return;
      }
    }
    /* reset values */
    setPosition({
      xDown: xUp,
      yDown: yUp,
    });
  };

  const navigateWithSwipeEnd = (e) => {
    if (direction.current === 'left' || direction.current === 'right') {
      let getNextPath = null;
      const correntUrl = window.location.href.split('/');
      const title = correntUrl[correntUrl.length - 1];

      if (direction.current === 'left') {
        getNextPath = paths.map((item, index) =>
          paths[index + 1] && item.properties.Name.title[0].plain_text === title
            ? paths[index + 1].properties.Name.title[0].plain_text || ''
            : ''
        );
      }

      if (direction.current === 'right') {
        getNextPath = paths.map((item, index) =>
          paths[index - 1] && item.properties.Name.title[0].plain_text === title
            ? paths[index - 1].properties.Name.title[0].plain_text || ''
            : ''
        );
      }

      const nextPath = getNextPath.filter((item) => item !== '');

      if (nextPath.length > 0) {
        router.push(
          {
            pathname: `/gallery/${nextPath[0]}`,
          },
          undefined,
          { scroll: false }
        );
      }
    }
  };

  useEffect(() => {
    document
      .querySelector(`.${style.gallery_item}`)
      .classList.add(style.opened);

    galleryRef.current.classList.add(style.opened);
    document.body.classList.add('hide-jumper');

    window.addEventListener('keyup', navigateWithKeys);
    window.addEventListener('touchstart', navigateWithSwipeStart);
    window.addEventListener('touchmove', navigateWithSwipeMove);
    window.addEventListener('touchend', navigateWithSwipeEnd);

    return () => {
      document.body.classList.remove('hide-jumper');
      window.removeEventListener('keyup', navigateWithKeys);
      window.removeEventListener('touchstart', navigateWithSwipeStart);
      window.removeEventListener('touchmove', navigateWithSwipeMove);
      window.removeEventListener('touchend', navigateWithSwipeEnd);
    };
  }, []);

  if (!page || !blocks) {
    return <div />;
  }

  // Image
  const imageUrl = page.properties.cover.files[0].file
    ? page.properties.cover.files[0].file.url
    : page.properties.cover.files[0].external.url;

  return (
    <Layout title={page.properties.Name.title[0].plain_text}>
      <div className={style.container} ref={galleryRef}>
        <div className={`${style.image_navigate} ${style.displayOn}`}>
          <Arrow
            onClick={() => navigate('previous')}
            id="previous"
            className={style.svg}
            style={{
              marginRight: '8rem',
              border: 'none',
              cursor: 'pointer',
              transform: 'rotate(180deg)',
              width: 'fit-content',
              hieght: '100%',
              gridArea: 'leftArrow',
            }}
          />

          <div
            className={style.image_container}
            style={{
              position: 'relative',
              width: '40%',
            }}
          >
            <Image
              src={imageUrl}
              alt="img"
              layout="responsive"
              width={0}
              height={0}
              objectFit="contain"
              priority
            />
          </div>

          <Arrow
            onClick={() => navigate('next')}
            id="next"
            className={style.svg}
            style={{
              border: 'none',
              marginLeft: '8rem',
              cursor: 'pointer',
              width: 'fit-content',
              hieght: '100%',
              gridArea: 'rightArrow',
            }}
          />
        </div>

        {/* {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))} */}

        <div
          className={`${style.gallery_item} ${style.displayOn}`}
          style={{ opacity: 0 }}
        >
          <h1>
            <Text text={page.properties.Name.title} />
          </h1>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);

  return {
    paths: database.map((page) => {
      return { params: { title: page.properties.Name.title[0].plain_text } };
    }),
    fallback: true,
  };
};

export const getStaticProps = async (paths) => {
  const database = await getDatabase(databaseId);
  const { title } = paths.params;

  const slugyPage = await getPageWithSlug(title);

  const page = await slugyPage[0];

  const id = await page.id;

  const blocks = await getBlocks(id);
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = await blocks.map((block) => {
    if (block.has_children && !block[block.type].children) {
      block[block.type]['children'] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });

  return {
    props: {
      page,
      blocks: blocksWithChildren,
      paths: database,
    },
    revalidate: 1,
  };
};
