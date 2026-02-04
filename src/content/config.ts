import { defineCollection, z } from 'astro:content';

// Case studies collection
const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string(),
    industry: z.enum(['governments', 'education', 'ngos', 'enterprise']),
    region: z.string(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    publishedAt: z.date(),
  }),
});

// News/blog collection
const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    category: z.enum(['press', 'update', 'thought-leadership']),
    image: z.string().optional(),
    publishedAt: z.date(),
  }),
});

// Team members
const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    image: z.string().optional(),
    linkedin: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Partners
const partners = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().optional(),
    tier: z.enum(['strategic', 'technology', 'implementation']),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  news,
  team,
  partners,
};
