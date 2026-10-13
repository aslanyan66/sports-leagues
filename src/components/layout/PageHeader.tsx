interface IPageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: IPageHeaderProps) => (
  <div className="flex flex-col gap-2">
    <h1 className="font-display text-4xl leading-none font-bold md:text-6xl">{title}</h1>
    <p className="max-w-prose text-lg text-fg-muted">{description}</p>
  </div>
);
