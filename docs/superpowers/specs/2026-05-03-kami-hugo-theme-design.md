# Kami Hugo Theme · Design Spec

**Date**: 2026-05-03
**Author**: Mack Ma
**Status**: Approved, ready for implementation planning

## Goal

Build an in-repo Hugo theme that ports the [kami](https://github.com/mackt/kami) print design language (warm parchment + ink-blue accent + serif-led editorial typography) to a long-form personal blog. Replace the existing [congo](https://github.com/jpanther/congo) theme entirely.

## Scope

**In scope**:
- Full Hugo theme at `themes/kami/` covering home, article, About / static pages, tag index, single tag page, 404
- Bilingual (zh-Hans + en) with paired translations and per-article language switcher
- Dark mode with localStorage persistence and system preference fallback
- Code highlighting in kami's single-accent palette via Chroma
- Self-hosted CJK + EN serif fonts
- Migration from congo (remove module, rewrite config)

**Out of scope** (deliberately excluded):
- Site search (no search needed for this content volume)
- Categories taxonomy (tags-only — see Q5 reasoning)
- Comments (deferred; can be added later via Giscus without theme changes)
- Reading time estimates
- Margin notes / sidenotes

## Content Model

| Type | Files | Routes |
|---|---|---|
| Home | (none required — generated from `posts/`) | `/`, `/en/` |
| Static page | `content/about.md`, `content/about.en.md` (and future `/now/`, `/uses/`) | `/about/`, `/en/about/` |
| Post | `content/posts/<slug>.md` + `content/posts/<slug>.en.md` | `/posts/<slug>/`, `/en/posts/<slug>/` |
| Tag index | auto-generated | `/tags/`, `/en/tags/` |
| Tag term | auto-generated | `/tags/<slug>/`, `/en/tags/<slug>/` |
| 404 | static | `/404.html` |

**Home filtering**: `home.html` lists posts from the `posts/` section only, so static pages (About, Now, Uses) never appear in the home index.

**Bilingual policy**: every post is written as a paired translation, sharing the same slug. Tags use English slugs in both languages to avoid taxonomy fragmentation. If a post has no translation, the language switcher hides on that article.

**Post frontmatter** (archetype):

```yaml
---
title: "关于一封慢信件的写法"
date: 2026-05-03
draft: false
tags: [craft, writing]
---
```

**Static page frontmatter** adds `type = "page"` to route through `page.html`.

## Architecture

### File layout

```
themes/kami/
├── theme.toml
├── README.md
├── LICENSE
├── i18n/
│   ├── en.yaml
│   └── zh-Hans.yaml
├── assets/
│   ├── css/
│   │   ├── tokens.css           # color / type / spacing variables (light + dark)
│   │   ├── base.css             # reset + typography base
│   │   ├── layout.css           # header / footer / main grid
│   │   ├── home.css             # year-grouped index
│   │   ├── article.css          # article + sticky TOC + footnotes + prev/next
│   │   ├── code.css             # Chroma in kami palette
│   │   └── tags.css             # tag index + term page
│   ├── js/
│   │   ├── theme.js             # dark mode (head-loaded, no FOUC)
│   │   ├── toc.js               # IntersectionObserver active-section
│   │   └── code-copy.js         # clipboard copy
│   └── fonts/
│       ├── source-han-serif-sc-subset.woff2   # ~1.5MB GB2312 subset
│       └── charter-regular.woff2              # ~80KB
├── layouts/
│   ├── baseof.html
│   ├── home.html
│   ├── single.html              # post template
│   ├── page.html                # static page template (about, now, uses)
│   ├── list.html                # /posts/ section listing
│   ├── taxonomy.html            # /tags/ index
│   ├── term.html                # /tags/<slug>/
│   ├── 404.html
│   ├── _partials/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── post-list-by-year.html   # year-grouped (home, term)
│   │   ├── post-list-flat.html      # plain (list fallback)
│   │   ├── toc.html
│   │   ├── lang-switch.html
│   │   ├── prev-next.html
│   │   ├── tags-inline.html
│   │   └── theme-toggle.html
│   └── _markup/
│       ├── render-codeblock.html    # wraps in figure + injects copy button
│       └── render-link.html         # external link ↗ marker
└── archetypes/
    └── default.md
```

**Deliberate omission**: no `/layouts/` or `/assets/` at the blog root — everything lives inside `themes/kami/` to keep the theme self-contained and portable.

### Bundling

Hugo's asset pipeline (`resources.Concat` + `resources.Minify` + `resources.Fingerprint`) produces:

- `main.bundle.<sha>.css` — concat of all CSS files in fixed order: `tokens → base → layout → home → article → code → tags`
- `main.bundle.<sha>.js` — concat of `toc.js + code-copy.js` (theme.js stays separate)
- `theme.js` — loaded synchronously in `<head>` to prevent dark-mode flash; everything else loads with `defer`

## Design Tokens

### Color (light)

```css
:root {
  --brand:       #1B365D;
  --brand-light: #2D5A8A;
  --bg:          #f5f4ed;
  --bg-lifted:   #faf9f5;
  --bg-sand:     #e8e6dc;
  --text:        #141413;
  --text-muted:  #3d3d3a;
  --text-soft:   #504e49;
  --text-meta:   #6b6a64;
  --border:      #e8e6dc;
  --border-soft: #e5e3d8;
  --tag-bg:      #E4ECF5;
}
```

### Color (dark)

```css
:root[data-theme="dark"] {
  --brand:       #5B8DCC;
  --brand-light: #7AA5DD;
  --bg:          #141413;
  --bg-lifted:   #1f1e1c;
  --bg-sand:     #2a2926;
  --text:        #ECEAE0;
  --text-muted:  #C9C6B8;
  --text-soft:   #9A968A;
  --text-meta:   #6b6a64;
  --border:      #2f2e2a;
  --border-soft: #2a2926;
  --tag-bg:      #233447;
}
```

### Typography

**Stacks**:

```css
:root {
  --serif-en: "Charter", Georgia, Palatino, "Times New Roman", serif;
  --serif-cn: "Source Han Serif SC", "TsangerJinKai02",
              "Songti SC", "STSong", Georgia, serif;
  --sans:     var(--serif);
  --mono:     "JetBrains Mono", "SF Mono", "Fira Code",
              Consolas, Monaco,
              "Source Han Serif SC", monospace;
}

html[lang="en"]      { --serif: var(--serif-en); }
html[lang="zh-Hans"] { --serif: var(--serif-cn); }
```

**Weight**: locked to 400 / 500 only. `strong { font-weight: 500 }` globally suppresses synthetic bold.

**Size scale (web)**:

| Role | Size | Line-height | Use |
|---|---|---|---|
| Display | 36px | 1.15 | Article H1 |
| H2 | 24px | 1.25 | Article H2 |
| H3 | 18px | 1.30 | Article H3 |
| Body | 17px | 1.65 | Reading body |
| Small | 14px | 1.55 | TOC, meta, tag |
| Tiny | 12px | 1.45 | Footer |

### Spacing

8px base grid. Article measure: `--measure: 38rem` (~660px).

### Web-only deviations from print kami

| Aspect | Print | Web | Reason |
|---|---|---|---|
| Body line-height | 1.55 | 1.65 | Greater screen reading distance |
| Body size | 9.5–10pt | 17px | Mobile legibility |
| Measure | A4 physical | 38rem | Variable viewport |
| Links | Brand color | Brand + 1px underline | Click affordance |
| Dark mode | Doesn't exist | data-theme swap | Web norm |

## Page Templates

### `home.html` — year-grouped index

Layout: 90px date column + 1fr title column, grid-aligned. Year separator above each group (small caps, brand color). Hover changes title to brand color (no shadows, no boxes). Mobile (<560px) stacks date above title.

### `single.html` — article page

Desktop (≥1024px): CSS Grid `1fr 38rem 1fr 16rem 1fr` — body in column 2, sticky TOC in column 4.
Tablet (640–1023px): single column, TOC collapses to top `<details>`.
Mobile (<640px): same as tablet.

Top-of-page: eyebrow (first tag, uppercase) → H1 → mono date.
End-of-article: tags inline → language switcher → prev/next.

### `page.html` — static page (About, Now, Uses)

Strip down version of `single.html`:
- Keep: Display title, body typography, footnotes, code blocks, language switcher
- Remove: TOC, prev/next, tags inline, eyebrow

### `list.html` — `/posts/` fallback

Reuses `post-list-by-year` partial. Functionally identical to home; exists because Hugo generates it by default.

### `taxonomy.html` — `/tags/`

Heading "Tags" + flat list of tag links with `(count)` suffix, sorted by count descending. No font-size variation tag cloud.

### `term.html` — `/tags/<slug>/`

Header line: `TAG · <name> (<count> posts)` then reuses `post-list-by-year` filtered to that tag.

### `404.html`

One sentence + link home. No fancy layout.

## Components

### Header

Site title (returns to home) on left. Right: `BLOG · TAGS · ☼` (theme toggle). 0.5px hairline border bottom. Language switcher does NOT live in the header — only on article and static pages where a translation pair exists.

### Footer

Centered, 12px, `--text-meta` color. Format:
```
© 2026 Mack Ma · RSS · Source on GitHub
Powered by Hugo + Kami theme
```

### Right sticky TOC (`toc.html`)

- Driven by Hugo's `.TableOfContents`, restyled
- `position: sticky; top: 6rem`
- Active section highlighted via `IntersectionObserver` in `toc.js`
- Hidden when post has zero H2/H3 headings

### Language switcher (`lang-switch.html`)

Iterates `.Translations`. If empty, partial renders nothing. Format: `EN ↔ 中文` link to the corresponding translation permalink. Appears below tags on articles and at the bottom of static pages.

### Prev/next (`prev-next.html`)

Uses `.PrevInSection` / `.NextInSection`. Two columns, left-aligned and right-aligned. If at boundary, the missing side renders empty.

### Code block (`render-codeblock.html` + `code.css` + `code-copy.js`)

Wraps Chroma output in `<figure class="code-block">` with a copy button absolutely positioned at top-right (visible on hover for desktop, always visible on touch). Chroma classes mapped to kami palette: brand for keywords/operators, text-muted for strings, text-meta for comments, default text for everything else. Single accent color enforced.

### Footnotes

Goldmark footnote output restyled: brand-color superscripts inline; bottom footnote list separated by hairline, each item small (14px) in `--text-soft`.

### Theme toggle

Single character button (`☼` / `☾`), 14px, no border, no shadow. Click toggles `data-theme` and persists to `localStorage`.

## Mechanics

### Dark mode bootstrap (no flash)

`theme.js` loads in `<head>` synchronously and runs before render:

```js
const stored = localStorage.getItem('kami-theme');
const system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', stored || system);
```

Toggle binding deferred to `DOMContentLoaded`.

### Code copy

`code-copy.js` delegates click on `.copy-btn`:

```js
addEventListener('click', e => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const code = btn.parentElement.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    const original = btn.textContent;
    btn.textContent = btn.dataset.done;  // i18n string passed in via data attr
    setTimeout(() => btn.textContent = original, 500);
  });
});
```

### TOC active section

`toc.js` uses `IntersectionObserver` on H2/H3 elements. The first heading whose top edge crosses the top quarter of the viewport gets `.active` mirrored on its corresponding `<a>` in the TOC.

### i18n strings

`themes/kami/i18n/zh-Hans.yaml`:

```yaml
- id: lang_name
  translation: 中文
- id: nav_blog
  translation: 博客
- id: nav_tags
  translation: 标签
- id: nav_about
  translation: 关于
- id: prev_post
  translation: ← 上一篇
- id: next_post
  translation: 下一篇 →
- id: toc_title
  translation: 目录
- id: tags_label
  translation: 标签
- id: copy_code
  translation: 复制
- id: copy_done
  translation: 已复制
```

`themes/kami/i18n/en.yaml` mirrors with English values.

### Chroma config

`config/_default/markup.toml`:

```toml
[highlight]
  noClasses = false
  style = "monokai"   # overridden entirely by code.css; choice doesn't matter
  lineNumbers = false
  codeFences = true
```

## Configuration Changes

### `config/_default/hugo.toml`

Add: `theme = "kami"`.

### `config/_default/module.toml`

Remove the `[[imports]]` block referencing `github.com/jpanther/congo/v2`.

### `config/_default/params.toml`

Strip all congo-specific parameters. Replace with kami's minimal param set:

```toml
[author]
  name = "Mack Ma"
  email = "hi@mack.ma"
  links = [
    { github = "https://github.com/mackt" },
    { x-twitter = "https://x.com/mackma1999" },
  ]

[footer]
  startYear = 2025
```

### `config/_default/menus.zh-Hans.toml` and `menus.en.toml`

Remove `search`, `categories`, `locale` items. Add `about` (weight 5). Final menu: `About · Blog · Tags`.

### `config/_default/languages.*.toml`

Remove congo-only keys; keep `title`, `locale`, `weight`, `[params.author]`.

### `go.mod` / `go.sum`

After removing congo from imports, run `hugo mod tidy` to clean up. (May leave `go.mod` empty of imports, which is fine.)

## Migration Sequence

Each step is independently verifiable with `hugo server`:

1. Create `themes/kami/` skeleton + `theme.toml` + empty templates
2. Write `tokens.css` + `base.css`
3. Write `baseof.html` + `head` + `header` + `footer` partials
4. Write `home.html` + `post-list-by-year` + add 3 sample posts to `content/posts/`
5. Write `single.html` + `toc` + `prev-next` + `tags-inline` + `render-codeblock` partials; verify with a sample post containing code and headings
6. Write `page.html` + create `content/about.md` + `content/about.en.md`
7. Write `taxonomy.html` + `term.html` + `tags.css`
8. Write `lang-switch` + i18n yaml + translate one sample post to EN
9. Write `theme.js` + `theme-toggle` + dark-mode CSS overrides
10. Write `code-copy.js` + footnote CSS adjustments
11. Update `module.toml` / `params.toml` / `menus.*.toml` / `hugo.toml` to switch to the new theme
12. Local `hugo server`: walk all routes — `/`, `/en/`, `/about/`, `/en/about/`, sample post (CN+EN), `/tags/`, `/tags/craft/`, `/404.html` — across desktop, mobile, and dark mode
13. Delete old `public/` and full rebuild; verify sitemap and RSS

## Acceptance Criteria

- [ ] Both language home pages show year-grouped indexes with aligned date columns
- [ ] Article page: TOC active section follows scroll; copy button reveals on hover; footnote superscripts in brand color
- [ ] About page: no TOC, no prev/next, no tags; language switcher present at bottom
- [ ] Tag system: tag index sorted by post count descending; single tag page reuses year-grouped layout
- [ ] Dark mode: zero FOUC on first paint; preference survives reload; toggle works in both languages
- [ ] Mobile (375px viewport): body text ≥ 16px; TOC collapses to `<details>`; date stacks above title
- [ ] Lighthouse: Performance ≥ 95, Accessibility = 100
- [ ] RSS: `/index.xml` and `/en/index.xml` include full post bodies
- [ ] No references to `congo` remain in `config/`, `go.mod`, or templates

## Open Questions

None. All product and technical decisions resolved during brainstorming.
