import style from '@/styles/404.module.css';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Icon from '@/components/SVG/gustav_dore_404.svg';

function NotFound() {
  return (
    <Layout title={'Not Found'}>
      <div className={style.error}>
        <div className={style.icon_container}>
          <Icon />
        </div>
        <h2>Sorry, There Is Nothing In Here</h2>
        <Link href="/" passHref>
          <a className={style.back_home}>Back To Home</a>
        </Link>
      </div>
    </Layout>
  );
}

export default NotFound;
