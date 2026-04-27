import { useState } from 'react';

// /contact — 문의 페이지 skeleton.
// 실제 전송은 mock — submit 시 alert + 필드 초기화.
export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '일반 문의', message: '' });

  return (
    <>
      <section className="mk-hero" style={{ padding: '80px 28px 48px' }}>
        <div className="mk-hero-inner">
          <span className="mk-eyebrow">Contact</span>
          <h1 style={{ fontSize: 40 }}>무엇이든 편하게 문의해 주세요</h1>
          <p>제품 궁금증 · 도입 문의 · 버그 제보 모두 이곳에서 접수됩니다.</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-form-layout">
          <aside className="mk-form-info">
            <h3>문의 채널</h3>
            <p>비즈니스 일정에 맞춰 평일 내 회신드립니다.</p>
            <dl>
              <dt>이메일</dt><dd>hello@creatordesk.app</dd>
              <dt>전화</dt>  <dd>02-0000-0000</dd>
              <dt>운영</dt>  <dd>평일 10:00 — 18:00</dd>
              <dt>주소</dt>  <dd>서울특별시 ○○구 ○○로 00</dd>
            </dl>
          </aside>

          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              // 실제 전송은 mock — 상태만 바꿔 확인 문구 표시.
              setSent(true);
              setForm({ name: '', email: '', subject: '일반 문의', message: '' });
            }}
          >
            <label className="field">
              <span className="field-label">이름 <em className="required">*</em></span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">
              <span className="field-label">이메일 <em className="required">*</em></span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label className="field">
              <span className="field-label">문의 유형</span>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option>일반 문의</option>
                <option>도입 · 요금 문의</option>
                <option>기술 지원</option>
                <option>기타</option>
              </select>
            </label>
            <label className="field">
              <span className="field-label">내용 <em className="required">*</em></span>
              <textarea
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="궁금하신 내용을 자유롭게 적어주세요."
                required
              />
            </label>

            <button type="submit" className="btn primary">문의 보내기</button>
            {sent && (
              <p className="mk-auth-note">문의가 접수되었습니다. 빠르게 회신드릴게요. (현재는 mock — 실제 메일 전송은 다음 스테이지.)</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
