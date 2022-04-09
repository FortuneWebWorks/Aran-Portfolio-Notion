import style from '@/styles/journal.module.css';
import Router, { useRouter } from 'next/router';
import Text from '@/components/Text-display';
import Layout from '@/components/Layout';
import { useEffect } from 'react';
import JournalData from '@/components/JournalData';

function Journal({ data }) {
  useEffect(() => {
    if (document.querySelector(`.${style.container}`)) {
      document.querySelector(`.${style.container}`).style.opacity = '1';
    }
  }, []);

  const router = useRouter();
  function mouseIn(e) {
    e.target.classList.add(style.hover);
  }

  function mouseOut(e) {
    e.target.classList.remove(style.hover);
  }

  function cardClick(e) {
    e.preventDefault();
    const title = e.target.getAttribute('data-key');
    let correctUrl = router.pathname.split('/')[1];

    if (document.getElementById(`${correctUrl}`)) {
      document.getElementById(`${correctUrl}`).style.opacity = '0';
    }

    setTimeout(() => {
      router.push(`/journal/${title}`);
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
    <Layout title={'Journal'}>
      <div className={style.container}>
        <div className={style.writings_container} id="journal">
          {data &&
            data.map((item) => {
              const description = item.description.slice(0, 85);

              return (
                <Text
                  post={item}
                  key={item.title}
                  dataKey={item.slug}
                  onMouseEnter={mouseIn}
                  onMouseLeave={mouseOut}
                  onClick={cardClick}
                  description={description}
                ></Text>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const data = JournalData();

  return {
    props: { data },
  };
}

export default Journal;
