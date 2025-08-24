import React, { ReactNode } from 'react'
import Image from 'next/image'
import { WebsiteStructuredData, OrganizationStructuredData } from './structured-data'

interface SEOLayoutProps {
  children: ReactNode
  schemaType?: 'website' | 'course' | 'article' | 'organization'
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function SEOOptimizedLayout({
  children,
  schemaType = 'website',
  breadcrumbs,
}: SEOLayoutProps) {
  return (
    <>
      {/* Structured Data */}
      {schemaType === 'website' && <WebsiteStructuredData />}
      {schemaType === 'organization' && <OrganizationStructuredData />}
      
      {/* Breadcrumbs Schema */}
      {breadcrumbs && breadcrumbs.length > 1 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: crumb.url,
              })),
            }),
          }}
        />
      )}

      {/* Content */}
      <main role="main">
        {children}
      </main>
    </>
  )
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  id?: string
  className?: string
}

export function SEOHeading({ level, children, id, className = '' }: HeadingProps) {
  const Tag = `h${level}` as React.ElementType
  const defaultClasses = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-semibold tracking-tight',
    4: 'text-xl font-semibold',
    5: 'text-lg font-semibold',
    6: 'text-base font-semibold',
  }

  return (
    <Tag
      id={id}
      className={`${defaultClasses[level]} ${className}`}
    >
      {children}
    </Tag>
  )
}

interface LinkProps {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
  title?: string
  'aria-label'?: string
}

export function SEOLink({
  href,
  children,
  external = false,
  className = '',
  title,
  'aria-label': ariaLabel,
}: LinkProps) {
  const isExternal = external || href.startsWith('http')

  return (
    <a
      href={href}
      className={className}
      title={title}
      aria-label={ariaLabel}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
    >
      {children}
    </a>
  )
}

interface ImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function SEOImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}

interface ArticleProps {
  children: ReactNode
  title: string
  author?: string
  publishedTime: string
  modifiedTime?: string
  category?: string
  tags?: string[]
  description?: string
  image?: string
}

export function SEOArticle({
  children,
  title,
  author,
  publishedTime,
  modifiedTime,
  category,
  tags,
  description,
  image,
}: ArticleProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    author: {
      '@type': 'Person',
      name: author || 'Harf Project Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Harf Project',
      logo: `${siteUrl}/logo.png`,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    description,
    image: image ? `${siteUrl}${image}` : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': siteUrl,
    },
    articleSection: category,
    keywords: tags?.join(', '),
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </article>
  )
}

interface BreadcrumbsProps {
  items: Array<{ name: string; url: string }>
  className?: string
}

export function SEOBreadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground" aria-hidden="true">
                /
              </span>
            )}
            {index === items.length - 1 ? (
              <span
                className="text-foreground font-medium"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <SEOLink
                href={item.url}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </SEOLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}