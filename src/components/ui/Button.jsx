import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * Button — single source of truth for CTA styling.
 * variant: 'primary' | 'ghost' | 'link' | 'accent' | 'whatsapp'
 * to: internal route; href: external/tel/mailto; otherwise renders as <button>
 */
export default function Button({
  variant = 'primary',
  to,
  href,
  children,
  className = '',
  icon = true,
  iconNode,
  ...rest
}) {
  const classes = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    link: 'btn-link',
    accent: 'btn-accent',
    whatsapp: 'btn-whatsapp',
  }[variant];

  const inner = (
    <>
      <span>{children}</span>
      {icon && variant !== 'link' && (iconNode ?? <ArrowUpRight size={16} strokeWidth={2.5} />)}
      {variant === 'link' && (iconNode ?? <ArrowUpRight size={16} strokeWidth={2.5} />)}
    </>
  );

  const merged = `${classes} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={merged} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    // External http(s) links open in a new tab. So do downloadable assets
    // hosted on the site (PDFs / docs).
    const isExternal = /^https?:\/\//i.test(href);
    const isAsset = /\.(pdf|docx?|xlsx?)$/i.test(href);
    const newTab = isExternal || isAsset;
    return (
      <a
        href={href}
        {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={merged}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <button className={merged} {...rest}>
      {inner}
    </button>
  );
}
