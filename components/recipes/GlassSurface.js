/** The renderer injects its own canvas; controls remain ordinary accessible HTML. */
export default function GlassSurface({ as: Tag = 'div', className = '', children, ...props }) {
  return <Tag className={`${className} liquid-glass`} {...props}>{children}</Tag>;
}
