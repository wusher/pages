# Project Layout

Understanding Medusa's directory structure helps you organize content effectively and take advantage of built-in conventions.

## Directory Structure

```
site/
  _layouts/      # Page templates
  _partials/     # Reusable components
  posts/         # Blog posts and articles
  index.md       # Homepage
  about.md       # Static pages
assets/
  css/           # Stylesheets (Tailwind entry point)
  js/            # JavaScript files
  images/        # Static images
data/
  site.yaml      # Site-wide configuration
  nav.yaml       # Navigation data
output/          # Generated site (do not edit)
medusa.yaml      # Build configuration
```

## The site/ Directory

This is where your content lives. Medusa processes everything here into the final site.

### _layouts/

Templates that wrap your content. The default layout (`default.html.jinja`) is applied unless a page specifies otherwise. Layouts receive the rendered page content via the `content` variable.

### _partials/

Reusable template fragments like headers, footers, and components. Include them with `{% include "partial-name.html.jinja" %}`. The underscore prefix keeps them from being rendered as standalone pages.

### Content Directories

Organize content into directories like `posts/`, `projects/`, or `docs/`. These become content groups accessible via `pages.group("posts")` in templates.

### Root Pages

Files like `index.md` and `about.md` become top-level pages at `/` and `/about/`.

## The assets/ Directory

Static files that get copied to the output with processing applied where appropriate.

### css/

Your Tailwind CSS entry point lives here. Medusa compiles it during builds, tree-shaking unused styles for smaller output.

### js/

JavaScript files are minified during production builds. Place your scripts here for automatic optimization.

### images/

Static images are copied as-is. For image optimization, configure the optional image processing pipeline.

## The data/ Directory

YAML files here are merged and exposed as the `data` object in templates. Use this for:

- Site metadata and configuration
- Navigation structures
- Social links and external references
- Any structured data you want in templates

## The output/ Directory

Generated during `medusa build`. This is your deployable static site. Never edit files here directly since they get overwritten on each build.

## Configuration

### medusa.yaml

Optional project configuration at the root:

```yaml
port: 4000        # Dev server port
ws_port: 4001     # WebSocket port for live reload
```

Most settings have sensible defaults. Add configuration only when you need to override them.

## File Naming Conventions

### Posts with Dates

Name files like `2024-01-15-my-post.md` to automatically set the publication date and URL slug.

### Draft Content

Prefix files or directories with `_` to mark them as drafts. They're excluded from production builds unless you use `--drafts`.

### Template Files

Use `.html.jinja` for Jinja2 templates and `.md` for Markdown content. Medusa handles both formats and renders them appropriately.
