# Data in Templates

Medusa exposes several powerful objects to your Jinja2 templates, giving you full control over content rendering and site navigation.

## Template Globals

Every template has access to these built-in variables:

### current_page

The page object for the template currently being rendered. See the Page Schema section below for available properties.

### pages

A PageCollection containing all pages on your site. Use filtering and sorting helpers to build navigation, archives, and related content sections.

### tags

A TagCollection mapping tag names to their associated pages. Iterate over tags or access specific tag groups directly.

### data

Merged YAML content from all files in your `data/` directory. Access nested data using dot notation: `data.title`, `data.author`, `data.nav`.

## Template Helpers

### url_for(path)

URL builder that generates correct paths for assets and pages. Keeps relative URLs intact for portability:

```jinja
{{ url_for('assets/css/main.css') }}
{{ url_for('assets/images/photo.jpg') }}
```

### font_path(filename)

Helper to generate correct font paths:

```jinja
{{ font_path("merriweather/Merriweather-VariableFont.ttf") }}
```

### css_path(filename)

Helper to generate correct CSS paths:

```jinja
{{ css_path('main') }}  {# generates path to main.css #}
```

## Collections API

### PageCollection

Work with groups of pages using chainable methods:

| Method | Description |
|--------|-------------|
| `group(name)` | Filter to pages in a specific directory group |
| `with_tag(tag)` | Filter to pages with a specific tag |
| `drafts()` | Filter to draft pages only |
| `published()` | Filter to non-draft pages only |
| `sorted(key="date", reverse=True)` | Sort by key, newest first by default |
| `latest(count=5)` | Get the most recent pages |

Chain methods together for precise filtering:

```jinja
{% for post in pages.group("posts").published().sorted().latest(3) %}
  {{ post.title }}
{% endfor %}
```

### TagCollection

Access pages by tag:

```jinja
{# Get pages with a specific tag #}
{% for page in tags["python"].sorted() %}
  {{ page.title }}
{% endfor %}

{# Iterate all tags #}
{% for tag, tag_pages in tags.items() %}
  <h3>{{ tag }} ({{ tag_pages|length }})</h3>
{% endfor %}
```

## Page Schema

Each page object provides these properties:

| Property | Type | Description |
|----------|------|-------------|
| `title` | str | Page title from first heading or frontmatter |
| `body` | str | Raw markdown/jinja source |
| `content` | str | Rendered HTML body |
| `page_content` | str | Rendered page content for use in templates |
| `description` | str | First paragraph or frontmatter description |
| `url` | str | Pretty URL path like `/posts/my-post/` |
| `slug` | str | URL-safe identifier |
| `date` | datetime | Publication date from filename or file mtime |
| `tags` | list[str] | Associated tags from frontmatter |
| `draft` | bool | Whether this is a draft page |
| `layout` | str | Template layout name |
| `group` | str | First path segment (e.g., "posts") |
| `path` | Path | Source file path |
| `folder` | str | Parent directory name |
| `filename` | str | Source filename |
| `source_type` | str | Either "markdown" or "jinja" |
| `frontmatter` | dict | All YAML frontmatter data |

### Accessing Frontmatter

Custom frontmatter fields are accessible via the `frontmatter` property:

```jinja
{% if current_page.frontmatter.github_url %}
  <a href="{{ current_page.frontmatter.github_url }}">View on GitHub</a>
{% endif %}

{% if current_page.frontmatter.border_color %}
  <div style="border-color: {{ current_page.frontmatter.border_color }}">
{% endif %}
```

## Practical Examples

### Building a Tag Cloud

```jinja
<div class="tags">
{% for tag, pages in tags.items() %}
  <a href="/tags/{{ tag }}/" class="tag">
    {{ tag }} <span>({{ pages|length }})</span>
  </a>
{% endfor %}
</div>
```

### Related Posts by Tag

```jinja
{% set related = pages.with_tag(current_page.tags[0]).sorted().latest(5) %}
<aside>
  <h3>Related Posts</h3>
  {% for post in related if post.url != current_page.url %}
    <a href="{{ post.url }}">{{ post.title }}</a>
  {% endfor %}
</aside>
```

### Data-Driven Navigation

```jinja
{# Using data from data/site.yaml #}
<nav>
{% for item in data.nav %}
  <a href="{{ item.url }}"
     {% if current_page.url == item.url %}class="active"{% endif %}>
    {{ item.title }}
  </a>
{% endfor %}
</nav>
```
