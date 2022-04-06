import style from '@/styles/404.module.scss';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Icon from '@/svg/gustav_dore_404.svg';

function NotFound() {
  return (
    <div className={style.error}>
      <div className={style.icon_container}>
        <Icon />
      </div>
      <h2>Sorry, There Is Nothing In Here</h2>
      <Link href="/" passHref>
        <a className={style.back_home}>Back To Home</a>
      </Link>
    </div>
  );
}

export default NotFound;
