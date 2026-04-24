// 로고 placeholder — 추후 실제 SVG/PNG 로고로 교체.
// 현재는 인디고 그라데이션 박스 안에 'S' 모노그램.
// 사이즈는 부모 .brand-logo 가 28x28 로 잡고 있다.
export default function Logo({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M7.5 6.2c0-1.5 1.4-2.7 3.5-2.7 1.9 0 3.4.9 4 2.4l-2.5.9c-.3-.5-.8-.8-1.5-.8-.7 0-1.2.3-1.2.8 0 .6.5.8 1.8 1.1l1.3.3c2.3.5 3.6 1.6 3.6 3.5 0 2.1-1.7 3.5-4.5 3.5-2.5 0-4.3-1.1-4.8-3l2.7-.7c.3.7.9 1.1 2 1.1.9 0 1.5-.3 1.5-.9 0-.5-.4-.8-1.7-1.1l-1.3-.3C8.6 9.6 7.5 8.5 7.5 6.2zM5 17.5h14v2.5H5z"
        fill="currentColor"
      />
    </svg>
  );
}
