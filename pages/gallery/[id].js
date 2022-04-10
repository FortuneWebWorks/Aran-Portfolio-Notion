import { Fragment, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getDatabase, getPage, getBlocks } from '@/lib/notion';
import Link from 'next/link';
import { databaseId } from './index.js';
import styles from './post.module.css';
import style from '@/styles/gallery.module.css';
import Layout from '@/components/Layout.js';
import Arrow from '@/components/SVG/arrow.svg';

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }

  return text.map((value, index) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    return (
      <span
        key={index}
        className={[
          bold ? styles.bold : '',
          code ? styles.code : '',
          italic ? styles.italic : '',
          strikethrough ? styles.strikethrough : '',
          underline ? styles.underline : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

const renderNestedList = (block) => {
  const { type } = block;
  const value = block[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === 'numbered_list_item';

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text text={value.rich_text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1>
          <Text text={value.rich_text} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <Text text={value.rich_text} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <Text text={value.rich_text} />
        </h3>
      );
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li>
          <Text text={value.rich_text} />
          {!!value.children && renderNestedList(block)}
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
            <Text text={value.rich_text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={value.rich_text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return <p>{value.title}</p>;
    case 'image':
      const src =
        value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
    case 'code':
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {value.rich_text[0].plain_text}
          </code>
        </pre>
      );
    case 'file':
      const src_file =
        value.type === 'external' ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split('/');
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <div className={styles.file}>
            📎{' '}
            <Link href={src_file} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case 'bookmark':
      const href = value.url;
      return (
        <a href={href} target="_brank" className={styles.bookmark}>
          {href}
        </a>
      );
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};

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
    <Layout>
      <div className={style.container} ref={galleryRef}>
        <Head>
          <title>{page.properties.Name.title[0].plain_text}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

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
              width: '35rem',
              height: '24rem',
            }}
          >
            <Image
              src={page.properties.cover.files[0].file.url}
              alt="img"
              layout="fill"
              objectFit="contain"
              loading="lazy"
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
          <h1 className={styles.name}>
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
