interface PageHeaderProps {
    title: string;
    description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">
                {title}
            </h2>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
