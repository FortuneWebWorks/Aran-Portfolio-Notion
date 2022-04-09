import style from '@/styles/writings.module.css';
import Router, { useRouter } from 'next/router';
import Text from '@/components/Text-display';
import Layout from '@/components/Layout';
import { useEffect } from 'react';
import WritingsData from '@/components/WritingsData';

function Writings({ data }) {
  useEffect(() => {
    if (document.querySelector(`.${style.container}`)) {
      document.querySelector(`.${style.container}`).style.opacity = '1';
    }
  }, []);

  const router = useRouter();

  function cardClick(e) {
    e.preventDefault();
    const title = e.target.getAttribute('data-key');
    let correctUrl = router.pathname.split('/')[1];

    if (document.getElementById(`${correctUrl}`)) {
      document.getElementById(`${correctUrl}`).style.opacity = '0';
    }

    setTimeout(() => {
      router.push(`/writings/${title}`);
    }, 0);
  }

  Router.events.on('routeChangeComplete', (routeURL) => {
    setTimeout(() => {
      if (document.querySelector(`.${style.writings_container}`)) {
        document.querySelector(`.${style.writings_container}`).style.opacity =
          '1';
      }
    }, 0);
  });

  return (
    <Layout title={'Writings'}>
      <div className={style.container}>
        <div className={style.writings_container} id="writings">
          {data &&
            data.map((item) => {
              const description = item.description.slice(0, 85);

              return (
                <Text
                  post={item}
                  key={item.title}
                  dataKey={item.slug}
                  onClick={cardClick}
                  description={{ description }}
                ></Text>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const data = WritingsData();

  return {
    props: { data },
  };
}

export default Writings;
