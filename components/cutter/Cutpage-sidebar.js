import style from '@/styles/SideListImage.module.css';

function CutpageSidebar({ imgSrc }) {
  const images = imgSrc;

  return (
    <div className={style.container}>
      {images.map((image, index) => (
        <img key={index} src={image} alt="safs" />
      ))}
    </div>
  );
}

export default CutpageSidebar;
