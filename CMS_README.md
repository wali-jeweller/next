# CMS System Documentation

## Overview

A full-featured Content Management System (CMS) for managing static pages and dynamic content in your e-commerce website. Similar to Sanity CMS, but built directly into your admin panel.

## Features

- ✅ **Page Management**: Create, edit, and delete pages
- ✅ **Section Builder**: Add multiple content sections to each page
- ✅ **Multiple Section Types**: Hero, Text, Image+Text, Gallery, CTA, Features, Custom
- ✅ **SEO Settings**: Full control over meta tags, OG images, and keywords
- ✅ **Status Control**: Draft, Published, and Archived states
- ✅ **Homepage Support**: Special page type for managing homepage content
- ✅ **Section Visibility**: Show/hide sections without deleting them
- ✅ **Drag & Reorder** (UI ready, needs implementation)

## Database Schema

### Pages Table

```typescript
{
  id: uuid(PK);
  title: string;
  slug: string(unique);
  description: text;
  status: "draft" | "published" | "archived";
  type: "page" | "homepage" | "custom";
  seoTitle: string;
  seoDescription: text;
  seoKeywords: text;
  ogImage: string(URL);
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Page Sections Table

```typescript
{
  id: uuid (PK)
  pageId: uuid (FK -> pages.id)
  title: string
  type: string // "hero", "text", "image_text", etc.
  content: jsonb // Flexible JSON content
  order: integer
  isVisible: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Functions

### Queries (`lib/cms-queries.ts`)

- `getPages()` - Get all pages with their sections
- `getPublishedPages()` - Get only published pages
- `getPageBySlug(slug)` - Get a specific page by slug
- `getPageById(id)` - Get a specific page by ID
- `getHomepage()` - Get the published homepage

### Actions (`lib/cms-actions.ts`)

- `createPage(data)` - Create a new page
- `updatePage(data)` - Update an existing page
- `deletePage(id)` - Delete a page
- `createSection(data)` - Add a section to a page
- `updateSection(data)` - Update a section
- `deleteSection(id)` - Remove a section
- `reorderSections(sections)` - Reorder sections

## Section Types

### 1. Hero Banner

Perfect for page headers with large background images.

```json
{
  "title": "Welcome to our store",
  "subtitle": "Discover amazing products",
  "image": "https://...",
  "buttonText": "Shop Now",
  "buttonLink": "/products"
}
```

### 2. Text Content

Simple text sections with heading and body.

```json
{
  "heading": "About Us",
  "body": "Long form text content..."
}
```

### 3. Image + Text

Image alongside text, position configurable.

```json
{
  "heading": "Our Story",
  "text": "Description...",
  "image": "https://...",
  "imagePosition": "left" | "right"
}
```

### 4. Call to Action

Prominent CTA sections.

```json
{
  "heading": "Ready to get started?",
  "description": "Join thousands of customers",
  "buttonText": "Sign Up",
  "buttonLink": "/signup"
}
```

### 5. Custom

Free-form JSON content for custom implementations.

```json
{
  "custom": "any structure you need"
}
```

## Usage Guide

### Creating a New Page

1. Navigate to **Admin > Store > Content > Pages**
2. Click **"New Page"**
3. Fill in:
   - Title (required)
   - Slug (auto-generated or custom)
   - Description
   - Status (draft/published)
   - Type (page/homepage)
4. Click **"Save Page"**

### Adding Sections

1. Open a page in the editor
2. Go to the **"Sections"** tab
3. Click **"Add Section"**
4. Choose a section type
5. Fill in the content fields
6. Click **"Save Section"**

### Managing Homepage

1. Create or edit a page
2. Set **Type** to "Homepage"
3. Set **Status** to "Published"
4. Add sections for hero, features, products, etc.

### SEO Optimization

1. Edit a page
2. Go to the **"SEO"** tab
3. Set:
   - SEO Title (60 chars recommended)
   - SEO Description (155 chars recommended)
   - Keywords (comma-separated)
   - OG Image URL

## Next Steps

### To Complete the Implementation

1. **Run Database Migration**

   ```bash
   bun drizzle-kit push
   ```

2. **Create Page Renderer** (see TODO #5)

   - Create `/app/(web)/[slug]/page.tsx`
   - Fetch page data with `getPageBySlug()`
   - Render sections based on type

3. **Update Homepage** (see TODO #4)

   - Modify `/app/(web)/page.tsx`
   - Fetch homepage data with `getHomepage()`
   - Render CMS sections

4. **Add Section Reordering**

   - Implement drag-and-drop with `@dnd-kit/core`
   - Call `reorderSections()` on drop

5. **Add Image Upload**
   - Integrate with your image hosting (S3, Cloudinary, etc.)
   - Add upload button to image fields

## File Structure

```
app/admin/store/pages/
├── page.tsx              # Pages list
├── pages-table.tsx       # Table component
└── [id]/
    ├── page.tsx          # Edit page route
    ├── page-editor.tsx   # Main editor
    ├── section-builder.tsx # Sections manager
    └── section-editor.tsx  # Section form

lib/
├── cms-queries.ts        # Database queries
└── cms-actions.ts        # Server actions

db/
└── schema.ts             # Added pages & pageSections tables
```

## Example: Rendering a Page

```typescript
// app/(web)/[slug]/page.tsx
import { getPageBySlug } from "@/lib/cms-queries";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const page = await getPageBySlug(params.slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <div>
      <h1>{page.title}</h1>
      {page.sections.map((section) => (
        <Section key={section.id} data={section} />
      ))}
    </div>
  );
}

function Section({ data }) {
  switch (data.type) {
    case "hero":
      return <HeroSection content={data.content} />;
    case "text":
      return <TextSection content={data.content} />;
    // ... other types
  }
}
```

## Security

- ✅ All actions protected by `protectedAction` with admin role check
- ✅ SQL injection prevention via Drizzle ORM
- ✅ XSS prevention - sanitize HTML content in renders
- ⚠️ TODO: Add input validation for URLs and image paths

## Performance

- Pages are server-rendered (RSC)
- Use `"use cache"` directive for published pages
- Revalidate on updates with `revalidatePath()`

## Support

For issues or questions, check:

1. Database migration ran successfully
2. Admin user has correct role
3. Check browser console for errors
4. Review server logs for action failures

---

Built with Next.js 15, Drizzle ORM, and shadcn/ui
