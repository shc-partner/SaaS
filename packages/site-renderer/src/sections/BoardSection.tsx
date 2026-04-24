import type { BoardContent } from '../types';

interface Props {
  content: BoardContent;
}

export default function BoardSection({ content }: Props) {
  const posts = content.posts.length > 0 ? content.posts : [
    { title: '첫 번째 공지', excerpt: '사이트 소식과 업데이트를 이곳에서 확인할 수 있습니다.', date: '2026-04-25' },
  ];

  return (
    <section className="lp-section lp-board">
      <div className="lp-section-head">
        <p className="lp-kicker">Board</p>
        <h2>{content.heading || '게시판'}</h2>
        <p>{content.lead || '공지사항과 최신 소식을 모아 보여줍니다.'}</p>
      </div>

      <div className="lp-board-list">
        {posts.map((post, index) => (
          <article className="lp-board-item" key={`${post.title}-${index}`}>
            <time dateTime={post.date}>{post.date}</time>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
