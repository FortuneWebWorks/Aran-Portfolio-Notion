import Layout from '@/components/Layout';
import style from '@/styles/contact.module.css';
import InstagramLogo from '@/components/SVG/instagram-logo.svg';

function Contact() {
  return (
    <Layout title={'Contact'}>
      <div className={style.container} id="contact">
        <div className={style.description} id="contact-description">
          <span>For inquiries:</span> <span>aran.naught.h@gmail.com</span>
        </div>
        <div className={style.contact_ways} id="contact">
          <InstagramLogo className={style.instagramLogo} />
          <a
            href="https://instagram.com/aran._naught_h"
            target="_blank"
            rel="noreferrer"
          >
            @aran._naught_h
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;
