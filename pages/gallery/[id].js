import { Fragment, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getDatabase, getPage, getBlocks } from '@/lib/notion';
import { databaseId } from './index.js';
// import styles from './post.module.css';
import style from '@/styles/gallery.module.css';
import Layout from '@/components/Layout.js';
import Arrow from '@/components/SVG/arrow.svg';
import { Text, renderNestedList, renderBlock } from '@/components/notionApi';

export default function Post({ page, blocks, paths }) {
  const router = useRouter();
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

    const { id } = router.query;
    let getNextPath = null;

    if (arrow === 'previous') {
      getNextPath = paths.map((item, index) =>
        paths[index - 1] && item.id === id ? paths[index - 1].id || '' : ''
      );
    } else {
      getNextPath = paths.map((item, index) =>
        paths[index + 1] && item.id === id ? paths[index + 1].id || '' : ''
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
      const { id } = router.query;
      let getNextPath = null;

      if (e.key === 'ArrowLeft') {
        getNextPath = paths.map((item, index) =>
          paths[index - 1] && item.id === id ? paths[index - 1].id || '' : ''
        );
      }

      if (e.key === 'ArrowRight') {
        getNextPath = paths.map((item, index) =>
          paths[index + 1] && item.id === id ? paths[index + 1].id || '' : ''
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
      const { id } = router.query;

      if (direction.current === 'left') {
        getNextPath = paths.map((item, index) =>
          paths[index + 1] && item.id === id ? paths[index + 1].id || '' : ''
        );
      }

      if (direction.current === 'right') {
        getNextPath = paths.map((item, index) =>
          paths[index - 1] && item.id === id ? paths[index - 1].id || '' : ''
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
    window.history.pushState('', '', page.properties.Name.title[0].plain_text);

    document
      .querySelector(`.${style.gallery_item}`)
      .classList.add(style.opened);

    galleryRef.current.classList.add(style.opened);
    document.body.classList.add('hide-jumper');

    window.addEventListener('keydown', navigateWithKeys);
    window.addEventListener('touchstart', navigateWithSwipeStart);
    window.addEventListener('touchmove', navigateWithSwipeMove);
    window.addEventListener('touchend', navigateWithSwipeEnd);

    return () => {
      document.body.classList.remove('hide-jumper');
      window.removeEventListener('keydown', navigateWithKeys);
      window.removeEventListener('touchstart', navigateWithSwipeStart);
      window.removeEventListener('touchmove', navigateWithSwipeMove);
      window.removeEventListener('touchend', navigateWithSwipeEnd);
    };
  });

  if (!page || !blocks) {
    return <div />;
  }

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
              width: '100%',
            }}
          >
            <Image
              src={page.properties.cover.files[0].file.url}
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
    paths: database.map((page) => ({
      params: { id: page.id },
    })),
    fallback: true,
  };
};

export const getStaticProps = async (paths) => {
  const { id } = paths.params;
  const page = await getPage(id);
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
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]['children'] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });

  const database = await getDatabase(databaseId);

  return {
    props: {
      page,
      blocks: blocksWithChildren,
      paths: database,
    },
    revalidate: 1,
  };
};
