import Reveal from "./Reveal.jsx";

export default function SectionHead({ index, label, title, children }) {
  return (
    <Reveal as="header" className="section-head">
      <p className="eyebrow">
        <span>{index}</span>
        <span aria-hidden="true" className="eyebrow__rule" />
        <span>{label}</span>
      </p>
      <h2 className="section-title">{title}</h2>
      {children && <div className="section-lead">{children}</div>}
    </Reveal>
  );
}
