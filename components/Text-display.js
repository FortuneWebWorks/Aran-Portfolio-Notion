import style from '@/styles/writings.module.css';
import { marked } from 'marked';

function Text({ post, onClick, dataKey, description }) {
  let date = String(post.createdAt).split('T');
  date = date[0].replace(/-/g, ' ');

  return (
    <div className={style.post} data-key={dataKey} onClick={onClick}>
      <h1>{post.title}</h1>
      <span className={style.date}>{date}</span>

      {description ? (
        <div
          className={style.description}
          dangerouslySetInnerHTML={{
            __html: marked(post.description.slice(0, 85) + '...'),
          }}
        ></div>
      ) : (
        <div
          className={style.description}
          dangerouslySetInnerHTML={{
            __html: marked(post.description),
          }}
        ></div>
      )}

      {description && (
        <a href="#" onClick={onClick}>
          read more
        </a>
      )}
    </div>
  );
}

export default Text;
