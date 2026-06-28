import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import anime from 'animejs';

function PulseRing() {
  const ref = useRef(null);

  useEffect(() => {
    const anim = anime({
      targets: ref.current,
      scale: [1, 1.7],
      opacity: [0.5, 0],
      duration: 2200,
      easing: 'easeOutExpo',
      loop: true,
      delay: 1800,
    });
    return () => anim.pause();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-full bg-brand-500/30"
      style={{ opacity: 0 }}
    />
  );
}

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

  const isPrimary = variant === 'primary';

  const inner = (
    <>
      {isPrimary && <PulseRing />}
      <span className="relative">{children}</span>
      {icon && variant !== 'link' && (iconNode ?? <ArrowUpRight size={16} strokeWidth={2.5} />)}
      {variant === 'link' && (iconNode ?? <ArrowUpRight size={16} strokeWidth={2.5} />)}
    </>
  );

  const merged = `${classes}${isPrimary ? ' relative' : ''} ${className}`.trim();

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
