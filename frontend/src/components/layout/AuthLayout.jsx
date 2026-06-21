export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  headerAction,
  children,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md lg:max-w-lg relative">
        {headerAction && (
          <div className="absolute top-0 right-0">{headerAction}</div>
        )}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon
              className="w-7 h-7 text-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 lg:p-10">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
