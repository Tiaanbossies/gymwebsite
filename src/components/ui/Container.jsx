export default function Container({ as: As = 'div', className = '', children, ...rest }) {
  return (
    <As className={`container-x ${className}`} {...rest}>
      {children}
    </As>
  );
}
