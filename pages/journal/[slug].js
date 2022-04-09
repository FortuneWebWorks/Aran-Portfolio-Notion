import Text from '@/components/Text-display';
import style from '@/styles/writings.module.css';
import Layout from '@/components/Layout';
import { useEffect } from 'react';
import JournalData from '@/components/JournalData';

function Post({ journal }) {
  useEffect(() => {
    document.querySelector(`.${style.container}`).classList.add(style.opened);
  }, []);

  return (
    <Layout title={journal.title}>
      <div className={`${style.container}`} style={{ opacity: 0 }}>
        <Text post={journal}></Text>
      </div>
    </Layout>
  );
}

export default Post;

// number of pages
export async function getStaticPaths() {
  const data = JournalData();

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

  const data = JournalData();
  const journal = data.filter((item) => item.slug === slug)[0];

  return {
    props: { journal },
  };
}
