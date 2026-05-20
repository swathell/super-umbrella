type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
};

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {body ? <p className="text-lg leading-8 text-slate">{body}</p> : null}
    </div>
  );
}
