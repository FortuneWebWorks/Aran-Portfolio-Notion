import style from '@/styles/about.module.scss';
import Image from 'next/image';
import Satan from '@/svg/satan.svg';
import Adriel from '@/svg/adriel.svg';

function About() {
  return (
    <div className={style.container}>
      <div className={style.about} id="about">
        <div className={style.image_container}>
          <Image
            alt="picOfMe"
            src="http://localhost:3000/about-image.JPG"
            objectFit="cover"
            width={400}
            height={400}
            priority={true}
          />
        </div>
        <p className={style.about_description} style={{ width: 400 }}>
          Aran Ø. H. is a California-based experimental photographer and writer
          who knows nothing about himself. Under feasible constraints of daily
          life, he wakes up at ungodly hours, meditates, and sits at his desk
          for hours to write fiction of a “gothic-romantic psycho-surrealist”
          nature he has difficulty and little care otherwise to define or
          explain. He then tries to reflect a similar essence in his
          photography, shattering the distinction between photography and the
          visual arts while tapping into the mundane, the ethereal, the
          indescribable, and the unknown all at once. He intends to make his
          writerly debut with Heaven’s Smoke — the chronicle of a deceased
          doctor amid his descent from heaven to hell — while working on his
          first major avant-grade photography project “The Glaced Vignettes.”
        </p>
      </div>
      <Satan className={style.satan} />
      <Adriel className={style.adriel} />
    </div>
  );
}

export default About;
