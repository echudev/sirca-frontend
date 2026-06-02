interface PageHeaderProps {
  title: string;
  description?: string | null;
}

export function PageHeader({ title, description = null }: PageHeaderProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {title}
      </h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
