# Medusa Static Site Generator: Improvement Suggestions

This document outlines suggested features and improvements for Medusa SSG based on analysis of this blog site's usage patterns and comparison with established static site generators like Jekyll, Hugo, and Eleventy.

## Executive Summary

Medusa currently provides a minimal, no-config approach to static site generation. While this simplicity is a strength, several features could be added to **reduce boilerplate in consuming repositories** and make the generator more powerful without sacrificing its core philosophy.

---

## Current Pain Points in This Repository

### 1. Manual CSS Pipeline Management
- **Problem**: This repo requires `package.json`, `tailwind.config.js`, `postcss.config.js`, and npm scripts to handle CSS
- **Impact**: 4+ configuration files and dual Python/Node.js toolchain requirement

### 2. Limited Content Type Flexibility
- **Problem**: Projects require custom frontmatter (`border_color`, `github_url`, `pypi_url`) with no schema validation or defaults
- **Impact**: Manual repetition in every project file

### 3. No Draft Support
- **Problem**: No way to work on unpublished content without excluding it manually
- **Impact**: Must use separate branches or naming conventions

### 4. No Pagination
- **Problem**: `posts.jinja` lists all posts on a single page
- **Impact**: Performance and UX degradation as content grows

### 5. No Tags/Categories
- **Problem**: No built-in taxonomy system for content organization
- **Impact**: Visitors cannot filter or discover related content

### 6. Image Handling
- **Problem**: No image optimization or responsive image generation
- **Impact**: Manual optimization or serving unoptimized images

---

## Feature Suggestions for Medusa

### Priority 1: High Impact, Reduces Repo Complexity

#### 1.1 Built-in Tailwind CSS Integration
**What**: Native Tailwind CSS compilation within Medusa's build process.

**Why**: Eliminates need for `package.json`, `tailwind.config.js`, `postcss.config.js`, and npm in consuming repos.

**Implementation Ideas**:
```yaml
# medusa.yaml
css:
  tailwind: true
  input: assets/css/main.css
  output: assets/css/main.css
  purge:
    - site/**/*.{md,jinja}
```

**Benefits**:
- Single `pip install medusa-ssg` installs everything
- No Node.js required
- Python-based Tailwind processing (or bundled Node binary)

---

#### 1.2 Drafts Support
**What**: A `_drafts` folder for work-in-progress content.

**Why**: Jekyll's most-loved feature for content creators.

**Implementation Ideas**:
```
site/
  _drafts/          # Not included in builds by default
    upcoming-post.md
  posts/
    2025-12-20-published.md
```

```bash
medusa serve --drafts  # Include drafts in dev server
medusa build           # Exclude drafts (production)
```

**API Addition**:
```jinja
{% for post in pages.group("posts").drafts() %}  {# Only drafts #}
{% for post in pages.group("posts").all() %}     {# Published + drafts #}
```

---

#### 1.3 Content Collections with Schemas
**What**: Define content types with default frontmatter and validation.

**Why**: Reduces repetition and catches errors early.

**Implementation Ideas**:
```yaml
# medusa.yaml
collections:
  projects:
    defaults:
      layout: project
      border_color: "#333333"
    schema:
      border_color: { type: string, required: true }
      github_url: { type: url, required: false }
      pypi_url: { type: url, required: false }

  posts:
    defaults:
      layout: post
    date_from_filename: true
```

**Benefits**:
- No need to repeat `layout: project` in every file
- Validation errors on `medusa build`
- Autocomplete-friendly schema

---

#### 1.4 Asset Pipeline
**What**: Built-in asset processing for CSS, JS, and images.

**Why**: Eliminates external tooling requirements.

**Implementation Ideas**:
```yaml
# medusa.yaml
assets:
  css:
    minify: true
    autoprefixer: true
  js:
    minify: true      # Use terser or similar
    bundle: true
  images:
    optimize: true
    formats: [webp, avif]
    sizes: [320, 640, 1280]
```

**Template Helpers**:
```jinja
{{ image_srcset('hero.jpg', sizes='(max-width: 768px) 100vw, 50vw') }}
{# Outputs: <img srcset="hero-320.webp 320w, hero-640.webp 640w..." ... /> #}
```

---

### Priority 2: Enhanced Content Features

#### 2.1 Pagination
**What**: Built-in pagination for collection listings.

**Why**: Essential for blogs with many posts.

**Implementation Ideas**:
```yaml
# In posts.jinja frontmatter
---
paginate:
  collection: posts
  per_page: 10
---
```

```jinja
{% for post in paginator.posts %}
  ...
{% endfor %}

{% if paginator.previous_page %}
  <a href="{{ paginator.previous_page_url }}">Previous</a>
{% endif %}
{% if paginator.next_page %}
  <a href="{{ paginator.next_page_url }}">Next</a>
{% endif %}
```

**Generated URLs**: `/posts/`, `/posts/page/2/`, `/posts/page/3/`

---

#### 2.2 Tags and Categories (Taxonomies)
**What**: First-class support for content categorization.

**Why**: Content discovery and organization.

**Implementation Ideas**:
```yaml
# In a post's frontmatter
---
tags: [python, tutorial, beginner]
category: programming
---
```

```yaml
# medusa.yaml
taxonomies:
  - tags
  - category
```

**Auto-generated pages**:
- `/tags/` - All tags
- `/tags/python/` - Posts tagged "python"
- `/category/programming/` - Posts in category

**Template API**:
```jinja
{% for tag in page.tags %}
  <a href="{{ tag.url }}">{{ tag.name }}</a>
{% endfor %}

{% for post in taxonomies.tags.python %}
  ...
{% endfor %}
```

---

#### 2.3 Related Content
**What**: Automatic related post suggestions based on tags/categories.

**Why**: Increases engagement and content discovery.

**Implementation Ideas**:
```jinja
{% for related in page.related(limit=3) %}
  <a href="{{ related.url }}">{{ related.title }}</a>
{% endfor %}
```

Algorithm: Posts sharing the most tags with current post.

---

#### 2.4 Excerpts
**What**: Automatic post excerpts for listing pages.

**Why**: Avoids manual excerpt management.

**Implementation Ideas**:
```jinja
{{ post.excerpt }}           {# First paragraph #}
{{ post.excerpt(words=50) }} {# First 50 words #}
```

Or allow manual separator:
```markdown
This is the excerpt that appears on listing pages.

<!--more-->

This is the rest of the post...
```

---

### Priority 3: Developer Experience

#### 3.1 Shortcodes
**What**: Reusable content components within Markdown.

**Why**: Enables rich content without leaving Markdown.

**Implementation Ideas**:
```markdown
Here's a YouTube video:

{% youtube id="dQw4w9WgXcQ" %}

And a code comparison:

{% compare %}
{% tab "Python" %}
print("Hello")
{% endtab %}
{% tab "JavaScript" %}
console.log("Hello")
{% endtab %}
{% endcompare %}
```

**Custom Shortcodes**:
```
site/_shortcodes/
  youtube.html.jinja
  compare.html.jinja
```

---

#### 3.2 Table of Contents Generation
**What**: Auto-generate TOC from headings.

**Why**: Essential for long-form content.

**Implementation Ideas**:
```jinja
{{ page.toc }}
{# Outputs: <nav class="toc"><ul><li><a href="#heading-1">...</a></li>...</ul></nav> #}
```

```yaml
# Frontmatter
---
toc: true
toc_depth: 3  # h1-h3 only
---
```

---

#### 3.3 Incremental Builds
**What**: Only rebuild changed files.

**Why**: Faster development experience as site grows.

**Implementation Ideas**:
```bash
medusa serve  # Automatically uses incremental rebuilds
medusa build --incremental  # Optional for CI caching
```

Track file hashes to determine what needs rebuilding.

---

#### 3.4 Plugin/Hook System
**What**: Allow extending Medusa without forking.

**Why**: Community extensions and site-specific customizations.

**Implementation Ideas**:
```python
# site/_plugins/reading_time.py
from medusa import hook

@hook('page.process')
def add_reading_time(page):
    words = len(page.content.split())
    page.reading_time = max(1, words // 200)
    return page
```

```jinja
{{ page.reading_time }} min read
```

**Hook Types**:
- `page.process` - Modify page data before rendering
- `build.start` / `build.end` - Run code at build lifecycle points
- `template.globals` - Add custom template functions
- `markdown.process` - Custom markdown extensions

---

#### 3.5 Data Cascade
**What**: Allow data files to apply to specific directories.

**Why**: Reduce frontmatter repetition.

**Implementation Ideas**:
```
site/
  posts/
    _data.yaml          # Applies to all posts
    2025-12-20-hello.md
  projects/
    _data.yaml          # Applies to all projects
    medusa.md
```

```yaml
# site/posts/_data.yaml
layout: post
author: wusher
```

---

### Priority 4: Deployment & Operations

#### 4.1 Built-in Deployment Commands
**What**: Native deployment to common platforms.

**Why**: Simplifies CI/CD, reduces GitHub Actions boilerplate.

**Implementation Ideas**:
```bash
medusa deploy github-pages
medusa deploy netlify
medusa deploy cloudflare-pages
medusa deploy s3 --bucket my-bucket
```

---

#### 4.2 Environment-Specific Configuration
**What**: Different settings for dev/staging/production.

**Why**: Common need for different URLs, features.

**Implementation Ideas**:
```yaml
# medusa.yaml
root_url: http://localhost:4000

# medusa.production.yaml (merged on `medusa build --env production`)
root_url: https://wusher.github.io/pages/
```

---

#### 4.3 Build Manifest/Cache Headers
**What**: Generate cache-busting filenames and manifest.

**Why**: Better caching, faster page loads.

**Implementation Ideas**:
```yaml
# medusa.yaml
assets:
  fingerprint: true  # main.css -> main.a1b2c3d4.css
```

```jinja
{{ css_path('main') }}  {# /assets/css/main.a1b2c3d4.css #}
```

---

## Features to Offload from This Repository

If the above features are implemented in Medusa, this repository could remove:

| Current File | Can Remove | Reason |
|-------------|-----------|--------|
| `package.json` | Yes | Tailwind handled by Medusa |
| `tailwind.config.js` | Yes | Config in medusa.yaml |
| `postcss.config.js` | Yes | Bundled in Medusa |
| `.github/workflows/deploy.yml` | Simplify | Use `medusa deploy` |
| Manual project frontmatter | Reduce | Collection defaults |
| Custom excerpt handling | Yes | Built-in excerpts |

**Estimated reduction**: 4-5 config files, ~50 lines of YAML in GitHub Actions.

---

## Implementation Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Tailwind Integration | High | High | P1 |
| Drafts | High | Low | P1 |
| Collection Schemas | High | Medium | P1 |
| Asset Pipeline | High | High | P1 |
| Pagination | Medium | Medium | P2 |
| Tags/Categories | Medium | Medium | P2 |
| Excerpts | Medium | Low | P2 |
| Shortcodes | Medium | Medium | P3 |
| TOC Generation | Low | Low | P3 |
| Incremental Builds | Medium | High | P3 |
| Plugin System | High | High | P3 |
| Deploy Commands | Medium | Medium | P4 |

---

## Conclusion

Medusa's strength is its simplicity. These suggestions aim to **enhance power without sacrificing that simplicity**. The key principle should be:

> **Sensible defaults, zero required configuration, optional power features.**

The highest-impact improvements are:
1. **Built-in Tailwind** - Eliminates Node.js dependency entirely
2. **Drafts** - Essential for content workflow
3. **Collection Schemas** - Reduces repetition, adds validation
4. **Pagination** - Required for any growing blog

These four features alone would significantly reduce the complexity of this repository while making Medusa more competitive with Jekyll and Hugo.

---

## Sources & References

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Jekyll 4.4.0 Release Notes](https://alternativeto.net/news/2025/1/static-site-generator-jekyll-releases-version-4-4-0-with-notable-changes-and-enhancements/)
- [Hugo vs Jekyll 2025 Comparison](https://gethugothemes.com/hugo-vs-jekyll)
- [Static Site Generators Comparison](https://mtm.dev/static)
- [Top 5 Static Site Generators 2025](https://cloudcannon.com/blog/the-top-five-static-site-generators-for-2025-and-when-to-use-them/)
- [Eleventy vs Hugo](https://cloudcannon.com/blog/eleventy-11ty-vs-hugo/)
