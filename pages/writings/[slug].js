import Text from '@/components/Text-display';
import style from '@/styles/writings.module.css';
import Layout from '@/components/Layout';
import { useEffect } from 'react';
import WritingsData from '@/components/WritingsData';

function Post({ post }) {
  useEffect(() => {
    document.querySelector(`.${style.container}`).classList.add(style.opened);
  }, []);

  return (
    <Layout title={post.title}>
      <div className={`${style.container}`} style={{ opacity: 0 }}>
        <Text post={post}></Text>
      </div>
    </Layout>
  );
}

export default Post;

// number of pages
export async function getStaticPaths() {
  const data = WritingsData();

  const paths = data.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

// functionality for each page
export async function getStaticProps({ params }) {
  const { slug } = params;
  const data = WritingsData();
  const post = data.filter((item) => item.slug === slug)[0];

  return {
    props: { post },
  };
}
