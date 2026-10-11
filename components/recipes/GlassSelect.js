import { Children, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// CodeFronts-inspired glass panel, with selection and keyboard behavior.
export default function GlassSelect({ children, value, onChange, disabled, 'aria-label': label = 'Choose an option' }) {
  const id = useId();
  const trigger = useRef(null), panel = useRef(null), typeahead = useRef({ text: '', at: 0 });
  const [position, setPosition] = useState(null);
  const options = Children.toArray(children).map(child => ({
    value: String(child.props.value ?? child.props.children),
    label: child.props.children,
    disabled: child.props.disabled,
  }));
  const selected = options.findIndex(option => option.value === String(value));
  const close = (restore = false) => { setPosition(null); if (restore) trigger.current?.focus(); };
  const focusOption = index => panel.current?.querySelectorAll('[role=option]')[index]?.focus();
  const open = () => {
    const rect = trigger.current.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 210), window.innerWidth - 24);
    const below = window.innerHeight - rect.bottom - 20;
    const above = rect.top - 20;
    const up = below < 200 && above > below;
    setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width,
      ...(up ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
      maxHeight: Math.min(340, up ? above : below), transformOrigin: up ? 'bottom center' : 'top center' });
  };
  useEffect(() => {
    if (!position) return;
    focusOption(selected >= 0 && !options[selected].disabled ? selected : options.findIndex(o => !o.disabled));
    const outside = event => { if (!panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) setPosition(null); };
    const scroll = event => { if (!panel.current?.contains(event.target)) setPosition(null); };
    const resize = () => setPosition(null);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', resize);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', outside); window.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', resize); };
  }, [position]);
  const keyboard = event => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    if (event.key === 'Tab') { close(true); return; }
    const buttons = [...panel.current.querySelectorAll('[role=option]')];
    const current = buttons.indexOf(document.activeElement);
    let next = current;
    if (event.key === 'Home') next = options.findIndex(o => !o.disabled);
    else if (event.key === 'End') next = options.findLastIndex(o => !o.disabled);
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const step = event.key === 'ArrowDown' ? 1 : -1;
      for (let i = 0; i < options.length; i++) { next = (next + step + options.length) % options.length; if (!options[next].disabled) break; }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== ' ') {
      const now = Date.now();
      typeahead.current = { text: (now - typeahead.current.at < 600 ? typeahead.current.text : '') + event.key.toLowerCase(), at: now };
      const match = options.findIndex(o => !o.disabled && String(o.label).toLowerCase().startsWith(typeahead.current.text));
      if (match >= 0) next = match;
    } else return;
    event.preventDefault(); focusOption(next);
  };
  return <>
    <button ref={trigger} type="button" className="glass-select-trigger" aria-label={label} aria-describedby={`${id}-value`} aria-haspopup="listbox" aria-expanded={Boolean(position)} aria-controls={position ? id : undefined} disabled={disabled}
      onClick={() => position ? close() : open()}
      onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(); } }}>
      <span id={`${id}-value`}>{options[selected]?.label ?? options[0]?.label}</span><span className="glass-select-chevron" aria-hidden="true">⌄</span>
    </button>
    {position && createPortal(<div ref={panel} id={id} role="listbox" aria-label={label} className="recipe-glass-options" style={position} onKeyDown={keyboard}>
      {options.map((option, index) => <button key={option.value} type="button" role="option" aria-selected={index === selected} disabled={option.disabled} tabIndex={-1}
        onClick={() => { onChange?.({ target: { value: option.value } }); close(true); }}>
        <span>{option.label}</span><span aria-hidden="true">{index === selected ? '✓' : ''}</span>
      </button>)}
    </div>, document.body)}
  </>;
}
