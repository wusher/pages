# Medusa SSG: Convention-Based Improvement Suggestions

Medusa's philosophy is **minimalism and convention over configuration**. These suggestions align with that principle—each adds capability through conventions rather than configuration.

---

## Guiding Principle

> If it requires a config option, it's probably not right for Medusa.
> If it can be done through a naming convention or folder structure, it fits.

---

## Current Repo Pain Points

| Pain Point | Current Workaround |
|------------|-------------------|
| CSS toolchain | 4 config files (package.json, tailwind.config.js, postcss.config.js, npm scripts) |
| Draft posts | Use git branches or don't write drafts |
| Repetitive frontmatter | Copy/paste in each file |
| No excerpts | Manual truncation in templates |

---

## Convention-Based Feature Suggestions

### 1. Drafts via `_drafts/` Folder

**Convention**: Any folder prefixed with `_` is excluded from production builds.

```
site/
  posts/
    2025-12-20-published.md    # Always built
  _drafts/
    upcoming-post.md           # Excluded from `medusa build`
```

**Behavior**:
- `medusa build` → ignores `_drafts/`
- `medusa serve` → includes `_drafts/` by default (or `--no-drafts` to exclude)

**Zero config. Just create the folder.**

---

### 2. Directory-Level Defaults via `_defaults.yaml`

**Convention**: A `_defaults.yaml` in any content folder applies to all files in that folder.

```
site/
  projects/
    _defaults.yaml       # Applies to all projects
    medusa.md
    tsunami.md
```

```yaml
# site/projects/_defaults.yaml
layout: project
border_color: "#333333"
```

Now individual project files only need to specify what's different:

```yaml
# site/projects/medusa.md
---
border_color: "#5E97A8"
github_url: https://github.com/wusher/medusa
---
```

**No config in medusa.yaml. Convention only.**

---

### 3. Automatic Excerpts

**Convention**: First paragraph becomes `page.excerpt`.

```jinja
{% for post in pages.group("posts").published() %}
  <h2>{{ post.title }}</h2>
  <p>{{ post.excerpt }}</p>  {# First paragraph, auto-extracted #}
{% endfor %}
```

**Optional override**: Add `excerpt:` to frontmatter if the auto-extracted one isn't right.

**Zero config.**

---

### 4. Tags from Frontmatter

**Convention**: If a page has `tags:` in frontmatter, expose `page.tags` as a list.

```yaml
# In a post
---
tags: [python, ssg]
---
```

```jinja
{% for tag in page.tags %}
  <span class="tag">{{ tag }}</span>
{% endfor %}
```

**No taxonomy configuration. No auto-generated tag pages. Just expose the data.**

Sites that want tag listing pages can create them manually—keeping Medusa minimal.

---

### 5. Reading Time

**Convention**: Auto-calculate `page.reading_time` based on word count.

```jinja
{{ page.reading_time }} min read
```

**Formula**: `max(1, word_count // 200)`

**Zero config. Always available.**

---

### 6. Table of Contents

**Convention**: `page.toc` returns a list of headings.

```jinja
{% if page.toc %}
<nav>
  {% for heading in page.toc %}
    <a href="#{{ heading.id }}">{{ heading.text }}</a>
  {% endfor %}
</nav>
{% endif %}
```

**Zero config. Derived from markdown headings.**

---

### 7. Next/Previous Navigation

**Convention**: `page.next` and `page.prev` for sequential navigation within a collection.

```jinja
<nav>
  {% if page.prev %}<a href="{{ page.prev.url }}">← {{ page.prev.title }}</a>{% endif %}
  {% if page.next %}<a href="{{ page.next.url }}">{{ page.next.title }} →</a>{% endif %}
</nav>
```

**Determined by**: Sort order in the collection (date for posts, filename for others).

**Zero config.**

---

### 8. Word Count

**Convention**: `page.word_count` returns the word count of the content.

```jinja
{{ page.word_count }} words
```

**Zero config. Always available.**

---

### 9. Last Modified Date

**Convention**: `page.last_modified` from file system mtime.

```jinja
Last updated: {{ page.last_modified.strftime('%b %d, %Y') }}
```

**Zero config. Derived from file metadata.**

---

### 10. Automatic Heading IDs

**Convention**: Markdown headings get auto-generated `id` attributes for anchor links.

```markdown
## My Section
```

Becomes:

```html
<h2 id="my-section">My Section</h2>
```

**Zero config. Just works.**

---

### 11. `published: false` Frontmatter

**Convention**: Alternative to `_drafts/` folder—set `published: false` in frontmatter.

```yaml
---
published: false
---
```

- `medusa build` → excludes page
- `medusa serve` → includes page (or `--no-drafts` to exclude)

**Zero config.**

---

### 12. Siblings Collection

**Convention**: `page.siblings` returns other pages in the same directory.

```jinja
<h3>Related Projects</h3>
{% for sibling in page.siblings if sibling.url != page.url %}
  <a href="{{ sibling.url }}">{{ sibling.title }}</a>
{% endfor %}
```

**Zero config. Derived from directory structure.**

---

### 13. Auto Meta Description

**Convention**: If no `description` in frontmatter, use `page.excerpt` for meta tags.

```jinja
<meta name="description" content="{{ page.description or page.excerpt }}">
```

**Zero config. Falls back gracefully.**

---

### 14. JSON Feed

**Convention**: Generate `feed.json` alongside `feed.xml`.

JSON Feed is a modern alternative to RSS. If Medusa already generates RSS, adding JSON Feed is trivial.

**Zero config. Generated automatically.**

---

## Tooling Presets (npm packages)

While CSS/JS tooling should stay **outside** Medusa's core, publishing shared preset packages would reduce boilerplate in consuming repos.

### Proposed Packages

| Package | Purpose |
|---------|---------|
| `@medusa-ssg/tailwind-preset` | Tailwind config with sensible defaults |
| `@medusa-ssg/prettier-config` | Prettier config for md, jinja, css, js |
| `@medusa-ssg/postcss-preset` | PostCSS plugins (import, tailwind, autoprefixer) |

### Usage

```bash
npm install -D @medusa-ssg/tailwind-preset @medusa-ssg/prettier-config
```

```js
// tailwind.config.js - minimal, user-owned
module.exports = {
  presets: [require('@medusa-ssg/tailwind-preset')],
  theme: {
    extend: {
      // user customizations here
    }
  }
}
```

```json
// .prettierrc
{
  "extends": "@medusa-ssg/prettier-config"
}
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    ...require('@medusa-ssg/postcss-preset'),
  ]
}
```

### Why Presets Instead of Built-in

- **Native tool support** - Uses each tool's existing extension mechanism
- **User owns configs** - Files live in standard locations
- **Clear overrides** - Extend and customize explicitly
- **No Node.js in Medusa** - Python SSG stays pure Python
- **Independent versioning** - Presets update separately from Medusa core

### What This Repo Could Simplify

Current config files could shrink significantly:

| File | Current | With Presets |
|------|---------|--------------|
| `tailwind.config.js` | 15 lines | 3 lines |
| `postcss.config.js` | 6 lines | 3 lines |
| `.prettierrc` | (none) | 1 line |

---

## Things That Should Stay OUT of Medusa

To preserve minimalism, these features should **not** be added:

| Feature | Why Not |
|---------|---------|
| Full Tailwind integration | Adds significant complexity; keep CSS external |
| Plugin system | Opens the door to bloat and maintenance burden |
| Schema validation | Too enterprise; frontmatter is already flexible |
| Pagination config | Can be done in Jinja; no need for magic |
| Deployment commands | Use existing tools (gh-pages, rsync, etc.) |
| Image optimization | Use external tools; keep Medusa focused on content→HTML |
| Shortcodes | Jinja macros already handle this |
| Environment configs | Use shell variables or separate config files |

---

## What This Repo Could Simplify

If Medusa adds the convention-based features above:

| Improvement | Repo Benefit |
|-------------|--------------|
| `_defaults.yaml` | Remove repetitive frontmatter from projects |
| Automatic excerpts | Simplify post listing template |
| `_drafts/` folder | Safe place to work on unpublished content |
| `page.reading_time` | Add to posts without custom logic |

The Node.js toolchain (`package.json`, Tailwind configs) would remain—CSS processing is outside Medusa's scope, which is correct for a minimal tool.

---

## Summary: The Medusa Way

```
More conventions → Less configuration → Simpler repos
```

**Suggested additions (all convention-based, zero config):**

| # | Feature | What It Does |
|---|---------|--------------|
| 1 | `_drafts/` folder | Exclude from production builds |
| 2 | `_defaults.yaml` | Directory-level frontmatter defaults |
| 3 | `page.excerpt` | Auto-extracted first paragraph |
| 4 | `page.tags` | List from frontmatter |
| 5 | `page.reading_time` | Word count ÷ 200 |
| 6 | `page.toc` | Heading list with IDs |
| 7 | `page.next` / `page.prev` | Sequential navigation |
| 8 | `page.word_count` | Content word count |
| 9 | `page.last_modified` | File mtime |
| 10 | Auto heading IDs | `## Foo` → `id="foo"` |
| 11 | `published: false` | Frontmatter draft flag |
| 12 | `page.siblings` | Other pages in same directory |
| 13 | Auto meta description | Fallback to excerpt |
| 14 | JSON Feed | `feed.json` alongside RSS |

Each feature follows the pattern: **"If you use this naming convention, you get this behavior."**

**Suggested npm preset packages (separate from core):**
1. `@medusa-ssg/tailwind-preset` - Sensible Tailwind defaults
2. `@medusa-ssg/prettier-config` - Formatting for md, jinja, css, js
3. `@medusa-ssg/postcss-preset` - Standard PostCSS plugin chain

Presets keep tooling external while reducing per-repo boilerplate.

---

## Sources

- [Jekyll Drafts](https://jekyllrb.com/docs/) - Inspiration for `_drafts/` convention
- [Eleventy Data Cascade](https://www.11ty.dev/) - Inspiration for directory defaults
- [Hugo vs Jekyll 2025](https://gethugothemes.com/hugo-vs-jekyll) - Feature comparison
