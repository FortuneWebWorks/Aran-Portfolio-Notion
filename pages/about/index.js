import { Fragment } from 'react';
import Layout from '@/components/Layout';
import style from '@/styles/about.module.css';
import Image from 'next/image';
import Satan from '@/components/SVG/satan.svg';
import Adriel from '@/components/SVG/adriel.svg';
import { getPage, getBlocks } from '@/lib/notion';
import { renderBlock } from '@/components/notionApi';

function About({ data, blocks }, { opac }) {
  console.log(data);
  return (
    <Layout title={'About'}>
      <div className={style.container}>
        <div className={style.about} id="about" style={{ opacity: opac }}>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
          {/* <div className={style.image_container}>
            <Image
              alt="picOfMe"
              src="http://localhost:3000/images/about-image.JPG"
              objectFit="cover"
              width={400}
              height={400}
              priority={true}
            />
          </div> */}
          {/* <div
            className={style.about_description}
            style={{ width: 400 }}
            dangerouslySetInnerHTML={{
              __html: marked(
                'Aran Ø. H. is a California-based experimental photographer and writer who knows nothing about himself. Under feasible constraints of daily life, he wakes up at ungodly hours, meditates, and sits at his desk for hours to write fiction of a “gothic-romantic psycho-surrealist” nature he has difficulty and little care otherwise to define or explain. He then tries to reflect a similar essence in his photography, shattering the distinction between photography and the visual arts while tapping into the mundane, the ethereal, the indescribable, and the unknown all at once. He intends to make his writerly debut with Heaven’s Smoke — the chronicle of a deceased doctor amid his descent from heaven to hell — while working on his first major avant-grade photography project “The Glaced Vignettes.”'
              ),
            }}
          ></div> */}
        </div>
        <Satan className={style.satan} />
        <Adriel className={style.adriel} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const pageId = process.env.NOTION_ABOUT_ID;
  const data = await getPage(pageId);

  const blocks = await getBlocks(pageId);

  return {
    props: { data, blocks },
  };
}

export default About;
