'use client';

import Link from 'next/link';
import { withLocaleHref } from '@/lib/i18n';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: string;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-background border-b border-border py-3 px-4 sm:px-6 flex flex-wrap gap-1"
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {item.href && !item.current ? (
              <>
                <Link
                  href={withLocaleHref(locale, item.href)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {item.label}
                </Link>
                {index < items.length - 1 && (
                  <span className="text-muted-foreground">/</span>
                )}
              </>
            ) : (
              <>
                <span className={item.current ? 'text-foreground font-medium' : ''}>
                  {item.label}
                </span>
                {index < items.length - 1 && (
                  <span className="text-muted-foreground">/</span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
