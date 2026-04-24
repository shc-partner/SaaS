import type { FooterContent } from '../types';

interface Props { content: FooterContent }

export default function FooterSection({ content }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="lp-footer">
      © {year} {content.brand || 'Your Brand'}. All rights reserved.
    </footer>
  );
}
