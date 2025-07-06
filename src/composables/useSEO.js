import { useHead } from '@unhead/vue'

export function useSEO(options = {}) {
  const defaultOptions = {
    title: '국제명품감정교육원 - 전문 명품감정 교육기관',
    description: '보다 전문적인 명품감정 강의를 제공하는 국제명품감정교육원입니다. 체계적인 교육과정으로 명품감정 전문가를 양성합니다.',
    keywords: '명품감정, 명품감정교육, 명품감정사, 명품감정강의, 명품감정교육원, 명품감정사자격증',
    image: '/logo.ico',
    url: 'https://국제명품감정교육원.com'
  }

  const seoOptions = { ...defaultOptions, ...options }
  const fullUrl = `${defaultOptions.url}${options.path || ''}`

  useHead({
    title: seoOptions.title,
    meta: [
      {
        name: 'description',
        content: seoOptions.description
      },
      {
        name: 'keywords',
        content: seoOptions.keywords
      },
      {
        property: 'og:title',
        content: seoOptions.title
      },
      {
        property: 'og:description',
        content: seoOptions.description
      },
      {
        property: 'og:image',
        content: seoOptions.image
      },
      {
        property: 'og:url',
        content: fullUrl
      },
      {
        name: 'twitter:title',
        content: seoOptions.title
      },
      {
        name: 'twitter:description',
        content: seoOptions.description
      },
      {
        name: 'twitter:image',
        content: seoOptions.image
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: fullUrl
      }
    ]
  })

  return {
    updateSEO: (newOptions) => {
      const updatedOptions = { ...seoOptions, ...newOptions }
      const newFullUrl = `${defaultOptions.url}${newOptions.path || options.path || ''}`
      
      useHead({
        title: updatedOptions.title,
        meta: [
          {
            name: 'description',
            content: updatedOptions.description
          },
          {
            name: 'keywords',
            content: updatedOptions.keywords
          },
          {
            property: 'og:title',
            content: updatedOptions.title
          },
          {
            property: 'og:description',
            content: updatedOptions.description
          },
          {
            property: 'og:image',
            content: updatedOptions.image
          },
          {
            property: 'og:url',
            content: newFullUrl
          },
          {
            name: 'twitter:title',
            content: updatedOptions.title
          },
          {
            name: 'twitter:description',
            content: updatedOptions.description
          },
          {
            name: 'twitter:image',
            content: updatedOptions.image
          }
        ],
        link: [
          {
            rel: 'canonical',
            href: newFullUrl
          }
        ]
      })
    }
  }
} 