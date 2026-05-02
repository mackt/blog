# Kami Hugo Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an in-repo Hugo theme `themes/kami/` that ports the kami print design language (warm parchment + ink-blue + serif-led editorial typography) to a long-form bilingual blog, replacing the existing congo theme.

**Architecture:** Standard Hugo theme using v0.146+ template lookup (templates at `layouts/` root, partials in `_partials/`, render hooks in `_markup/`). Asset pipeline via Hugo's built-in resource bundler concats CSS into one fingerprinted file. Three tiny vanilla JS files for theme toggle / TOC active-section / code copy. Self-hosted serif fonts as a final task (system fallback works first).

**Tech Stack:** Hugo extended v0.148.1, Chroma syntax highlighting, vanilla JS (no framework), Hugo asset pipeline (no PostCSS / Sass needed).

**Spec:** `docs/superpowers/specs/2026-05-03-kami-hugo-theme-design.md`

**Strategy notes:**
- Sample fixture posts created early (Task 2) so each subsequent task can verify rendering against real content
- Each task produces a working `hugo build` — never leave the build broken
- The blog still uses congo until Task 18 — the new theme builds in parallel without touching site config
- Verification is mostly `hugo build` exit-code checks plus targeted `grep` against generated HTML, with explicit visual checks where appropriate

---

## Task 1: Theme skeleton + minimal baseof

Create the directory structure and a placeholder baseof so `hugo build` recognizes the theme without errors.

**Files:**
- Create: `themes/kami/theme.toml`
- Create: `themes/kami/LICENSE`
- Create: `themes/kami/README.md`
- Create: `themes/kami/layouts/baseof.html`

- [ ] **Step 1: Create `themes/kami/theme.toml`**

```toml
name = "Kami"
license = "MIT"
licenselink = "https://github.com/mackt/kami-hugo/blob/main/LICENSE"
description = "Editorial Hugo theme inspired by Kami's warm parchment + ink-blue print design language."
homepage = "https://mack.ma"
tags = ["blog", "minimal", "bilingual", "editorial", "serif"]
features = ["dark mode", "i18n", "code highlighting", "rss"]
min_version = "0.146.0"

[author]
  name = "Mack Ma"
  homepage = "https://mack.ma"
```

- [ ] **Step 2: Create `themes/kami/LICENSE`** (MIT)

```
MIT License

Copyright (c) 2026 Mack Ma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Create `themes/kami/README.md`**

```markdown
# Kami · Hugo Theme

Editorial Hugo theme that ports the [Kami](https://github.com/mackt/kami) print design language to the web. Warm parchment background, single ink-blue accent, serif-led typography, no second chromatic color.

Built for long-form bilingual blogs.

## Features

- Year-grouped minimal home index
- Article page with right-side sticky TOC
- Bilingual paired translations with per-article language switcher
- Dark mode with localStorage persistence
- Code highlighting in single-accent palette (Chroma)
- Self-hosted serif fonts (no external requests)

## Requirements

- Hugo extended ≥ 0.146.0
```

- [ ] **Step 4: Create `themes/kami/layouts/baseof.html`** (placeholder, to be expanded in Task 4)

```go-html-template
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
  <meta charset="utf-8">
  <title>{{ .Title }}</title>
</head>
<body>
  {{ block "main" . }}{{ end }}
</body>
</html>
```

- [ ] **Step 5: Verify Hugo recognizes the theme**

Run from blog root: `hugo --theme=kami --renderToMemory --quiet 2>&1 | head -20`
Expected: no errors, no output (silent success). The site has zero content right now so this just exercises the theme loader.

- [ ] **Step 6: Commit**

```bash
git add themes/kami/theme.toml themes/kami/LICENSE themes/kami/README.md themes/kami/layouts/baseof.html
git commit -m "feat(kami): theme skeleton with placeholder baseof"
```

---

## Task 2: Sample posts as test fixtures

Add 3 Chinese posts + 1 English translation pair to `content/posts/`. These act as fixtures for every subsequent rendering task.

**Files:**
- Create: `content/posts/slow-letters.md`
- Create: `content/posts/slow-letters.en.md`
- Create: `content/posts/no-monorepo.md`
- Create: `content/posts/shantaram-notes.md`

- [ ] **Step 1: Create `content/posts/slow-letters.md`**

```markdown
---
title: "关于一封慢信件的写法"
date: 2026-05-03
draft: false
tags: [craft, writing]
---

每写一封信，我都试图把现代邮件训练出来的反射动作磨掉。打开收件箱、扫一眼标题、按照"重要性"自动排好优先级 — 这些动作对慢信件是有害的。[^1]

## 为什么要慢

慢不是装腔作势，而是给思考留出空间。

## 三个动作

我开始养成一个新习惯：

```python
# 每周三下午
open(mailbox)  # 拿出纸质信
```

这看起来很造作，但实际上只是一个时间盒。

## 两个月的实验

经过两个月，剩下了几条原则。

## 剩下的原则

1. 不在情绪激动时回信
2. 至少隔一天再寄出
3. 写完先大声读一遍

[^1]: 现代邮件训练我们 30 秒内做决定。慢信件需要 30 分钟。
```

- [ ] **Step 2: Create `content/posts/slow-letters.en.md`**

```markdown
---
title: "How to Write a Slow Letter"
date: 2026-05-03
draft: false
tags: [craft, writing]
---

Every letter I write, I try to dull the reflexes that modern email has trained into me. Opening the inbox, scanning subject lines, auto-sorting by "importance" — these motions are toxic to a slow letter.[^1]

## Why slow

Slow isn't pretension. It's leaving room for thought.

## Three moves

I started a new habit:

```python
# Wednesday afternoons
open(mailbox)  # take out the paper letters
```

It looks contrived but is really just a time box.

## Two months in

After two months, a few principles remained.

## What's left

1. Never reply when emotional
2. Wait at least a day before mailing
3. Read the letter aloud before sending

[^1]: Modern email trains us to decide in 30 seconds. A slow letter needs 30 minutes.
```

- [ ] **Step 3: Create `content/posts/no-monorepo.md`**

```markdown
---
title: "为什么我不再用 monorepo 管个人项目"
date: 2026-04-22
draft: false
tags: [engineering, craft]
---

独立仓库回归到独立仓库，是因为想清楚了一件事：节奏不该被工具同步。

## 当时的诱惑

monorepo 看起来能解决一切：共享依赖、统一 lint、一处构建。
```

- [ ] **Step 4: Create `content/posts/shantaram-notes.md`**

```markdown
---
title: "阅读《项塔兰》后的笔记"
date: 2026-03-14
draft: false
tags: [reading]
---

两年前买的，今年才读完。这本书让我重新想了一遍"自由"是什么。
```

- [ ] **Step 5: Verify build still passes**

Run: `hugo --theme=kami --renderToMemory --quiet 2>&1 | tail -5`
Expected: no errors. Posts will render via baseof's empty `{{ block "main" . }}` block (just empty body) — that's fine for now.

- [ ] **Step 6: Commit**

```bash
git add content/posts/
git commit -m "test(kami): sample post fixtures (CN+EN pair, plus 2 CN posts)"
```

---

## Task 3: Design tokens + base CSS

Establish the kami color/type/spacing tokens and base typography reset. After this task, any markdown rendered via the placeholder baseof will already feel like kami.

**Files:**
- Create: `themes/kami/assets/css/tokens.css`
- Create: `themes/kami/assets/css/base.css`

- [ ] **Step 1: Create `themes/kami/assets/css/tokens.css`**

```css
:root {
  /* Brand · single ink-blue accent, ≤ 5% surface coverage */
  --brand:        #1B365D;
  --brand-light:  #2D5A8A;

  /* Surface */
  --bg:           #f5f4ed;
  --bg-lifted:    #faf9f5;
  --bg-sand:      #e8e6dc;

  /* Text · 4 levels, all warm */
  --text:         #141413;
  --text-muted:   #3d3d3a;
  --text-soft:    #504e49;
  --text-meta:    #6b6a64;

  /* Border */
  --border:       #e8e6dc;
  --border-soft:  #e5e3d8;

  /* Tag · ink-blue at 0.18 alpha solid equivalent */
  --tag-bg:       #E4ECF5;

  /* Type stacks */
  --serif-en: "Charter", Georgia, Palatino, "Times New Roman", serif;
  --serif-cn: "Source Han Serif SC", "TsangerJinKai02",
              "Songti SC", "STSong", Georgia, serif;
  --sans:     var(--serif);
  --mono:     "JetBrains Mono", "SF Mono", "Fira Code",
              Consolas, Monaco,
              "Source Han Serif SC", monospace;

  /* Geometry */
  --measure: 38rem;
  --grid:    8px;
}

html[lang="en"]      { --serif: var(--serif-en); }
html[lang="zh-Hans"] { --serif: var(--serif-cn); }

/* Dark mode swap */
:root[data-theme="dark"] {
  --brand:        #5B8DCC;
  --brand-light:  #7AA5DD;
  --bg:           #141413;
  --bg-lifted:    #1f1e1c;
  --bg-sand:      #2a2926;
  --text:         #ECEAE0;
  --text-muted:   #C9C6B8;
  --text-soft:    #9A968A;
  --text-meta:    #6b6a64;
  --border:       #2f2e2a;
  --border-soft:  #2a2926;
  --tag-bg:       #233447;
}
```

- [ ] **Step 2: Create `themes/kami/assets/css/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; }

html {
  background: var(--bg);
  color: var(--text);
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  min-height: 100vh;
}

/* Lock weight to 400/500 — no synthetic bold */
strong, b { font-weight: 500; }
em, i     { font-style: normal; }   /* kami: no italic anywhere */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--serif);
  font-weight: 500;
  color: var(--text);
  margin: 1.5em 0 0.5em;
}
h1 { font-size: 36px; line-height: 1.15; }
h2 { font-size: 24px; line-height: 1.25; }
h3 { font-size: 18px; line-height: 1.30; }

p { margin: 0 0 1em; }

a {
  color: var(--brand);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  transition: color 0.15s ease;
}
a:hover { color: var(--brand-light); }

ul, ol { padding-left: 1.5em; }
ul li::marker { color: var(--brand); }

blockquote {
  margin: 1em 0;
  padding: 4px 0 4px 14px;
  border-left: 2px solid var(--brand);
  color: var(--text-soft);
}

hr {
  border: 0;
  border-top: 0.5px solid var(--border);
  margin: 2em 0;
}

img { max-width: 100%; height: auto; display: block; }

/* Selection */
::selection {
  background: var(--tag-bg);
  color: var(--text);
}
```

- [ ] **Step 3: Commit (verification happens in Task 4 once head/baseof load the bundle)**

```bash
git add themes/kami/assets/css/
git commit -m "feat(kami): design tokens (light + dark) and base typography"
```

---

## Task 4: Site shell — baseof, head, header, footer, layout.css

Wire up the asset bundler, load tokens + base CSS, and lay down the persistent site chrome.

**Files:**
- Modify: `themes/kami/layouts/baseof.html`
- Create: `themes/kami/layouts/_partials/head.html`
- Create: `themes/kami/layouts/_partials/header.html`
- Create: `themes/kami/layouts/_partials/footer.html`
- Create: `themes/kami/assets/css/layout.css`

- [ ] **Step 1: Replace `themes/kami/layouts/baseof.html`**

```go-html-template
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
{{ partial "head.html" . }}
<body>
  {{ partial "header.html" . }}
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
</body>
</html>
```

- [ ] **Step 2: Create `themes/kami/layouts/_partials/head.html`**

```go-html-template
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} · {{ .Site.Title }}{{ end }}</title>
  {{ with .Description }}<meta name="description" content="{{ . }}">{{ end }}

  {{ $css := slice
      (resources.Get "css/tokens.css")
      (resources.Get "css/base.css")
      (resources.Get "css/layout.css")
      | resources.Concat "css/main.bundle.css"
      | resources.Minify
      | resources.Fingerprint "sha256"
  }}
  <link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">

  {{ if .OutputFormats.Get "RSS" }}
    <link rel="alternate" type="application/rss+xml" title="{{ .Site.Title }}" href="{{ "index.xml" | absURL }}">
  {{ end }}
</head>
```

- [ ] **Step 3: Create `themes/kami/layouts/_partials/header.html`**

```go-html-template
<header class="site-header">
  <div class="site-header__inner">
    <a class="site-title" href="{{ .Site.Home.RelPermalink }}">{{ .Site.Title }}</a>
    <nav class="site-nav">
      {{ range .Site.Menus.main }}
        <a href="{{ .URL }}">{{ .Name }}</a>
      {{ end }}
    </nav>
  </div>
</header>
```

- [ ] **Step 4: Create `themes/kami/layouts/_partials/footer.html`**

```go-html-template
<footer class="site-footer">
  <div class="site-footer__inner">
    <p>
      © {{ now.Format "2006" }} {{ .Site.Params.author.name }}
      &nbsp;·&nbsp; <a href="{{ "index.xml" | absURL }}">RSS</a>
    </p>
    <p class="site-footer__sub">
      Powered by <a href="https://gohugo.io">Hugo</a> &amp; the Kami theme.
    </p>
  </div>
</footer>
```

- [ ] **Step 5: Create `themes/kami/assets/css/layout.css`**

```css
.site-header {
  border-bottom: 0.5px solid var(--border);
  padding: 24px 0;
  background: var(--bg);
}
.site-header__inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1.5rem;
}
.site-title {
  font-family: var(--serif);
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  border-bottom: none;
  letter-spacing: 0.3px;
}
.site-title:hover { color: var(--brand); }
.site-nav {
  display: flex;
  gap: 1.25rem;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.site-nav a {
  color: var(--text-meta);
  border-bottom: none;
}
.site-nav a:hover { color: var(--brand); }

main {
  max-width: 64rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.site-footer {
  border-top: 0.5px solid var(--border);
  padding: 2rem 1.5rem 3rem;
  margin-top: 4rem;
}
.site-footer__inner {
  max-width: 64rem;
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-meta);
}
.site-footer__inner p { margin: 0; }
.site-footer__sub { margin-top: 4px !important; }
.site-footer a { color: var(--text-meta); border-bottom: none; }
.site-footer a:hover { color: var(--brand); }

@media (max-width: 560px) {
  .site-header__inner { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  main { padding: 2rem 1.25rem 3rem; }
}
```

- [ ] **Step 6: Verify build succeeds and bundle is generated**

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && ls /tmp/kami-build/css/`
Expected: a single file matching `main.bundle.<hash>.css`. If you get errors about `resources.Get` returning nil, the CSS path is wrong — ensure files live in `themes/kami/assets/css/`.

- [ ] **Step 7: Verify head emits the bundle link**

Run: `grep -o 'href="/css/main.bundle[^"]*' /tmp/kami-build/index.html | head -1`
Expected: a hash-suffixed path like `/css/main.bundle.abc123.css`.

- [ ] **Step 8: Commit**

```bash
git add themes/kami/layouts/ themes/kami/assets/css/layout.css
git commit -m "feat(kami): site shell with asset bundler, header, footer"
```

---

## Task 5: Home page — year-grouped index

Render the home page as the date-grouped minimal index agreed in the design.

**Files:**
- Create: `themes/kami/layouts/home.html`
- Create: `themes/kami/layouts/_partials/post-list-by-year.html`
- Create: `themes/kami/assets/css/home.css`
- Modify: `themes/kami/layouts/_partials/head.html` (add `home.css` to bundle)

- [ ] **Step 1: Create `themes/kami/layouts/home.html`**

```go-html-template
{{ define "main" }}
  <div class="home">
    {{ $posts := where .Site.RegularPages "Section" "posts" }}
    {{ partial "post-list-by-year.html" $posts }}
  </div>
{{ end }}
```

- [ ] **Step 2: Create `themes/kami/layouts/_partials/post-list-by-year.html`**

```go-html-template
{{ $posts := . }}
{{ range $posts.GroupByDate "2006" }}
  <section class="year-group">
    <h2 class="year-label">{{ .Key }}</h2>
    <ul class="post-index">
      {{ range .Pages }}
        <li class="post-row">
          <time class="post-date" datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "Jan 02" }}</time>
          <a class="post-title" href="{{ .RelPermalink }}">{{ .Title }}</a>
        </li>
      {{ end }}
    </ul>
  </section>
{{ end }}
```

- [ ] **Step 3: Create `themes/kami/assets/css/home.css`**

```css
.home {
  max-width: var(--measure);
  margin: 0 auto;
}
.year-group { margin-bottom: 3rem; }
.year-label {
  font-family: var(--serif);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--brand);
  margin: 0 0 1rem;
  padding: 0;
}
.post-index {
  list-style: none;
  padding: 0;
  margin: 0;
}
.post-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 0.5rem 0;
}
.post-date {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.6px;
  color: var(--text-meta);
  text-transform: uppercase;
}
.post-title {
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  border-bottom: none;
}
.post-title:hover { color: var(--brand); }

@media (max-width: 560px) {
  .post-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
    padding: 0.5rem 0 0.75rem;
  }
  .post-date { font-size: 12px; }
}
```

- [ ] **Step 4: Add `home.css` to bundle in `head.html`**

Modify `themes/kami/layouts/_partials/head.html` — the `$css` slice. Replace the existing slice declaration with:

```go-html-template
  {{ $css := slice
      (resources.Get "css/tokens.css")
      (resources.Get "css/base.css")
      (resources.Get "css/layout.css")
      (resources.Get "css/home.css")
      | resources.Concat "css/main.bundle.css"
      | resources.Minify
      | resources.Fingerprint "sha256"
  }}
```

- [ ] **Step 5: Verify build and home page output**

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && grep -E '(year-label|post-row)' /tmp/kami-build/index.html | head -5`
Expected: lines containing `year-label` and `post-row` markers — confirming the partial rendered.

- [ ] **Step 6: Visual check**

Run: `hugo server --theme=kami --port 1313` (in a separate terminal). Open http://localhost:1313/ in a browser. Confirm:
- Three CN posts visible under "2026" (May 03, Apr 22, Mar 14)
- Date column aligned, mono typeface
- Hovering a title turns it ink-blue
- Resize to <560px: date stacks above title
Stop server with Ctrl-C when done.

- [ ] **Step 7: Commit**

```bash
git add themes/kami/layouts/home.html themes/kami/layouts/_partials/post-list-by-year.html themes/kami/assets/css/home.css themes/kami/layouts/_partials/head.html
git commit -m "feat(kami): year-grouped home index"
```

---

## Task 6: Article page — single.html and article.css

Render an actual article page (no TOC yet — that's Task 8).

**Files:**
- Create: `themes/kami/layouts/single.html`
- Create: `themes/kami/assets/css/article.css`
- Modify: `themes/kami/layouts/_partials/head.html` (add `article.css`)

- [ ] **Step 1: Create `themes/kami/layouts/single.html`**

```go-html-template
{{ define "main" }}
  <article class="article">
    <header class="article-header">
      {{ with index .Params.tags 0 }}
        <div class="article-eyebrow">{{ . }}</div>
      {{ end }}
      <h1 class="article-title">{{ .Title }}</h1>
      <div class="article-meta">
        <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006 · 01 · 02" }}</time>
      </div>
    </header>

    <div class="article-body">
      {{ .Content }}
    </div>
  </article>
{{ end }}
```

- [ ] **Step 2: Create `themes/kami/assets/css/article.css`**

```css
.article {
  max-width: var(--measure);
  margin: 0 auto;
}
.article-header { margin-bottom: 2rem; }
.article-eyebrow {
  font-family: var(--serif);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 0.5rem;
}
.article-title {
  font-size: 36px;
  line-height: 1.15;
  margin: 0 0 0.5rem;
}
.article-meta {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.6px;
  color: var(--text-meta);
}
.article-body {
  font-size: 17px;
  line-height: 1.65;
}
.article-body h2 {
  font-size: 24px;
  margin-top: 2.5rem;
}
.article-body h3 {
  font-size: 18px;
  margin-top: 2rem;
}
.article-body p { margin: 0 0 1em; }
```

- [ ] **Step 3: Add `article.css` to bundle in `head.html`**

After the `home.css` line in the `$css` slice, add:

```go-html-template
      (resources.Get "css/article.css")
```

(Append before the `| resources.Concat ...` pipe.)

- [ ] **Step 4: Verify article renders**

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && grep -c article-title /tmp/kami-build/posts/slow-letters/index.html`
Expected: at least `1`.

- [ ] **Step 5: Visual check**

Start `hugo server --theme=kami --port 1313`. Open http://localhost:1313/posts/slow-letters/. Confirm:
- Eyebrow "CRAFT" in brand color above title
- Title in serif, large
- Mono date below
- Body text in 17px serif with 1.65 line-height
- Code block visible (raw, unstyled — Task 7 fixes that)

- [ ] **Step 6: Commit**

```bash
git add themes/kami/layouts/single.html themes/kami/assets/css/article.css themes/kami/layouts/_partials/head.html
git commit -m "feat(kami): article single template + body typography"
```

---

## Task 7: Code blocks — render hook + Chroma single-accent palette

Wrap code blocks via render hook, add Chroma syntax CSS in kami's restricted palette.

**Files:**
- Create: `themes/kami/layouts/_markup/render-codeblock.html`
- Create: `themes/kami/assets/css/code.css`
- Modify: `themes/kami/layouts/_partials/head.html` (add `code.css`)
- Modify: `config/_default/markup.toml` (enable Chroma classes)

- [ ] **Step 1: Update `config/_default/markup.toml`**

Replace existing `[highlight]` block with:

```toml
[goldmark]
[goldmark.renderer]
  unsafe = true

[highlight]
  noClasses = false
  style = "monokai"
  lineNumbers = false
  codeFences = true
  guessSyntax = true

[tableOfContents]
  startLevel = 2
  endLevel = 4
```

The `style` value is irrelevant — `code.css` overrides every Chroma class. `noClasses = false` makes Chroma emit class names instead of inline styles, which we then style ourselves.

- [ ] **Step 2: Create `themes/kami/layouts/_markup/render-codeblock.html`**

```go-html-template
<figure class="code-block" data-lang="{{ .Type }}">
  {{ highlight .Inner .Type .Options }}
</figure>
```

(Copy button injection comes in Task 14 — keep this minimal for now.)

- [ ] **Step 3: Create `themes/kami/assets/css/code.css`**

```css
.code-block {
  margin: 1.5rem 0;
  position: relative;
}
.code-block > .highlight {
  background: var(--bg-lifted);
  border: 0.5px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.code-block pre {
  margin: 0;
  padding: 12px 16px;
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.55;
  color: var(--text);
  overflow-x: auto;
}
.code-block code {
  font-family: inherit;
  font-size: inherit;
  background: transparent;
  padding: 0;
}

/* Inline code */
:not(pre) > code {
  font-family: var(--mono);
  font-size: 0.9em;
  background: var(--bg-lifted);
  border: 0.5px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
}

/* Chroma single-accent palette
 * Rule: only --brand for keywords/operators; warm grays for strings/comments;
 * default text for everything else. Never introduce a second hue. */
.highlight .k,   /* keyword */
.highlight .kc,
.highlight .kd,
.highlight .kn,
.highlight .kp,
.highlight .kr,
.highlight .kt,
.highlight .o,   /* operator */
.highlight .ow,
.highlight .nb   /* builtin */              { color: var(--brand); }

.highlight .s,   /* string */
.highlight .s1,
.highlight .s2,
.highlight .sb,
.highlight .sc,
.highlight .sd,
.highlight .se,
.highlight .sh,
.highlight .si,
.highlight .sx                               { color: var(--text-muted); }

.highlight .c,   /* comment */
.highlight .c1,
.highlight .cm,
.highlight .cp,
.highlight .cs                               { color: var(--text-meta); font-style: normal; }

.highlight .nf,  /* function name */
.highlight .nc,  /* class name */
.highlight .nn,  /* namespace */
.highlight .nd                               { color: var(--text); font-weight: 500; }

.highlight .mi,  /* number */
.highlight .mf,
.highlight .mh,
.highlight .mo,
.highlight .nv,  /* variable */
.highlight .vc,
.highlight .vg,
.highlight .vi                               { color: var(--text); }

/* Force-disable any italic Chroma may have suggested */
.highlight em,
.highlight i,
.highlight .ge { font-style: normal; }
```

- [ ] **Step 4: Add `code.css` to bundle in `head.html`**

After the `article.css` line in `$css` slice, add:

```go-html-template
      (resources.Get "css/code.css")
```

- [ ] **Step 5: Verify code block renders with our wrapper**

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && grep -c 'figure class="code-block"' /tmp/kami-build/posts/slow-letters/index.html`
Expected: at least `1`.

- [ ] **Step 6: Visual check**

`hugo server --theme=kami --port 1313`. Open http://localhost:1313/posts/slow-letters/. The python block should now have:
- Ivory background `#faf9f5`
- Hairline border, 6px radius
- Mono font
- Comment `# 每周三下午` in warm gray
- Keyword `open` in ink-blue
- No second color anywhere

- [ ] **Step 7: Commit**

```bash
git add themes/kami/layouts/_markup/render-codeblock.html themes/kami/assets/css/code.css themes/kami/layouts/_partials/head.html config/_default/markup.toml
git commit -m "feat(kami): code blocks with single-accent Chroma palette"
```

---

## Task 8: Right-side sticky TOC

Add a right-aligned, sticky table of contents that highlights the current section as the user scrolls.

**Files:**
- Create: `themes/kami/layouts/_partials/toc.html`
- Create: `themes/kami/assets/js/toc.js`
- Modify: `themes/kami/layouts/single.html` (wrap in grid; add TOC partial)
- Modify: `themes/kami/assets/css/article.css` (grid layout; TOC styles)
- Modify: `themes/kami/layouts/_partials/head.html` (load toc.js)

- [ ] **Step 1: Create `themes/kami/layouts/_partials/toc.html`**

```go-html-template
{{ $toc := .TableOfContents }}
{{ if strings.Contains (string $toc) "<li>" }}
  <aside class="article-toc" aria-label="{{ i18n "toc_title" | default "Contents" }}">
    <details open>
      <summary>{{ i18n "toc_title" | default "Contents" }}</summary>
      {{ $toc }}
    </details>
  </aside>
{{ end }}
```

(Checking for `<li>` is more reliable than string-comparing the empty `<nav>` wrapper, which differs across Hugo versions.)

- [ ] **Step 2: Create `themes/kami/assets/js/toc.js`**

```js
(function () {
  const toc = document.querySelector('.article-toc');
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const headings = links
    .map(a => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))))
    .filter(Boolean);

  if (!headings.length) return;

  const linkFor = (id) => toc.querySelector('a[href="#' + CSS.escape(id) + '"]');

  let active = null;
  const setActive = (id) => {
    if (active) active.classList.remove('active');
    const link = id ? linkFor(id) : null;
    if (link) {
      link.classList.add('active');
      active = link;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // Pick the topmost intersecting heading
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
  );

  headings.forEach(h => observer.observe(h));
})();
```

- [ ] **Step 3: Replace `themes/kami/layouts/single.html`** with the grid-wrapped version

```go-html-template
{{ define "main" }}
  <div class="article-grid">
    <article class="article">
      <header class="article-header">
        {{ with index .Params.tags 0 }}
          <div class="article-eyebrow">{{ . }}</div>
        {{ end }}
        <h1 class="article-title">{{ .Title }}</h1>
        <div class="article-meta">
          <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006 · 01 · 02" }}</time>
        </div>
      </header>

      <div class="article-body">
        {{ .Content }}
      </div>
    </article>

    {{ partial "toc.html" . }}
  </div>
{{ end }}
```

- [ ] **Step 4: Replace TOC + grid styles into `themes/kami/assets/css/article.css`** by appending to the file

Append at the end of `themes/kami/assets/css/article.css`:

```css
/* Article grid: body centered, TOC right at desktop sizes */
.article-grid {
  display: block;
}
.article {
  margin: 0 auto;
}

.article-toc {
  margin: 1.5rem 0;
  font-size: 14px;
  color: var(--text-soft);
}
.article-toc summary {
  font-family: var(--serif);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--brand);
  cursor: pointer;
  margin-bottom: 0.5rem;
}
.article-toc nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.article-toc nav ul ul {
  padding-left: 1rem;
  margin: 0.25rem 0;
}
.article-toc nav li { margin: 0.25rem 0; line-height: 1.4; }
.article-toc nav a {
  color: var(--text-soft);
  border-bottom: none;
}
.article-toc nav a:hover,
.article-toc nav a.active {
  color: var(--brand);
}

@media (min-width: 1024px) {
  .article-grid {
    display: grid;
    grid-template-columns: 1fr var(--measure) 1fr 16rem 1fr;
    column-gap: 0;
    align-items: start;
  }
  .article {
    grid-column: 2 / 3;
    margin: 0;
  }
  .article-toc {
    grid-column: 4 / 5;
    position: sticky;
    top: 6rem;
    margin-top: 0;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
    border-left: 1px solid var(--border);
    padding-left: 1rem;
  }
  .article-toc summary { list-style: none; }
  .article-toc summary::-webkit-details-marker { display: none; }
}
```

- [ ] **Step 5: Load `toc.js` from `head.html`**

Add **before** `</head>` in `themes/kami/layouts/_partials/head.html`:

```go-html-template
  {{ $js := slice
      (resources.Get "js/toc.js")
      | resources.Concat "js/main.bundle.js"
      | resources.Minify
      | resources.Fingerprint "sha256"
  }}
  <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
```

- [ ] **Step 6: Verify TOC renders for slow-letters (which has 5 H2s)**

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && grep -c article-toc /tmp/kami-build/posts/slow-letters/index.html`
Expected: at least `1`.

- [ ] **Step 7: Visual check**

`hugo server --theme=kami --port 1313`. Open http://localhost:1313/posts/slow-letters/ at a desktop width ≥ 1024px. Confirm:
- TOC is sticky on the right with all 5 section names
- Scroll the body — the active TOC link follows
- Resize to < 1024px: TOC moves above the body as a `<details>` block
- Open `/posts/no-monorepo/` (only 1 H2): TOC visible but with single item
- Open `/posts/shantaram-notes/` (no H2s): TOC partial renders nothing

- [ ] **Step 8: Commit**

```bash
git add themes/kami/layouts/single.html themes/kami/layouts/_partials/toc.html themes/kami/assets/js/toc.js themes/kami/assets/css/article.css themes/kami/layouts/_partials/head.html
git commit -m "feat(kami): right-sticky TOC with active section tracking"
```

---

## Task 9: Article footer — tags inline, prev/next, footnotes

End-of-article: tag pills, prev/next navigation, restyled footnotes.

**Files:**
- Create: `themes/kami/layouts/_partials/tags-inline.html`
- Create: `themes/kami/layouts/_partials/prev-next.html`
- Modify: `themes/kami/layouts/single.html`
- Modify: `themes/kami/assets/css/article.css`

- [ ] **Step 1: Create `themes/kami/layouts/_partials/tags-inline.html`**

```go-html-template
{{ with .Params.tags }}
  <div class="article-tags">
    <span class="article-tags__label">{{ i18n "tags_label" | default "Tags" }}</span>
    <ul>
      {{ range . }}
        <li><a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}/">{{ . }}</a></li>
      {{ end }}
    </ul>
  </div>
{{ end }}
```

- [ ] **Step 2: Create `themes/kami/layouts/_partials/prev-next.html`**

```go-html-template
<nav class="article-nav">
  <div class="article-nav__cell">
    {{ with .PrevInSection }}
      <a class="article-nav__link" href="{{ .RelPermalink }}">
        <span class="article-nav__label">← {{ i18n "prev_post" | default "Previous" }}</span>
        <span class="article-nav__title">{{ .Title }}</span>
      </a>
    {{ end }}
  </div>
  <div class="article-nav__cell article-nav__cell--right">
    {{ with .NextInSection }}
      <a class="article-nav__link" href="{{ .RelPermalink }}">
        <span class="article-nav__label">{{ i18n "next_post" | default "Next" }} →</span>
        <span class="article-nav__title">{{ .Title }}</span>
      </a>
    {{ end }}
  </div>
</nav>
```

- [ ] **Step 3: Replace `themes/kami/layouts/single.html`** to add the article footer

```go-html-template
{{ define "main" }}
  <div class="article-grid">
    <article class="article">
      <header class="article-header">
        {{ with index .Params.tags 0 }}
          <div class="article-eyebrow">{{ . }}</div>
        {{ end }}
        <h1 class="article-title">{{ .Title }}</h1>
        <div class="article-meta">
          <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "2006 · 01 · 02" }}</time>
        </div>
      </header>

      <div class="article-body">
        {{ .Content }}
      </div>

      <footer class="article-footer">
        {{ partial "tags-inline.html" . }}
        {{ partial "prev-next.html" . }}
      </footer>
    </article>

    {{ partial "toc.html" . }}
  </div>
{{ end }}
```

- [ ] **Step 4: Append article footer + footnote styles to `themes/kami/assets/css/article.css`**

Append:

```css
/* Article footer */
.article-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 0.5px solid var(--border);
}

.article-tags {
  font-size: 13px;
  color: var(--text-soft);
  margin-bottom: 2rem;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.article-tags__label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--brand);
}
.article-tags ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.article-tags a {
  background: var(--tag-bg);
  color: var(--brand);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 3px;
  border-bottom: none;
}

.article-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  font-size: 14px;
}
.article-nav__cell--right { text-align: right; }
.article-nav__link {
  display: block;
  border-bottom: none;
  color: var(--text-soft);
}
.article-nav__link:hover { color: var(--brand); }
.article-nav__link:hover .article-nav__title { color: var(--brand); }
.article-nav__label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-meta);
  margin-bottom: 4px;
}
.article-nav__title {
  display: block;
  color: var(--text);
  font-weight: 500;
  line-height: 1.3;
}

/* Footnotes (Goldmark output) */
.article-body sup a,
.footnote-ref a {
  color: var(--brand);
  border-bottom: none;
  font-family: var(--mono);
  font-size: 0.75em;
  padding: 0 2px;
}
.footnotes {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 0.5px solid var(--border);
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-soft);
}
.footnotes ol { padding-left: 1.25rem; }
.footnotes li { margin: 0.5rem 0; }
.footnotes li::marker { color: var(--brand); }

@media (max-width: 560px) {
  .article-nav { grid-template-columns: 1fr; }
  .article-nav__cell--right { text-align: left; }
}
```

- [ ] **Step 5: Verify build, footer, footnotes**

Run:

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
grep -c article-tags /tmp/kami-build/posts/slow-letters/index.html
grep -c article-nav /tmp/kami-build/posts/slow-letters/index.html
grep -c '"footnotes"' /tmp/kami-build/posts/slow-letters/index.html
```
Expected: each grep returns at least `1`.

- [ ] **Step 6: Visual check**

`hugo server`. Open `/posts/slow-letters/`. Confirm:
- Tag pills `craft` and `writing` visible at bottom in ink-blue
- Prev/next visible (slow-letters is newest, so only "Previous" should appear pointing to no-monorepo)
- Footnote `[1]` superscript in brand color; footnote text at bottom with hairline above
Open `/posts/no-monorepo/` to verify both prev (`shantaram-notes`) and next (`slow-letters`) show.

- [ ] **Step 7: Commit**

```bash
git add themes/kami/layouts/single.html themes/kami/layouts/_partials/tags-inline.html themes/kami/layouts/_partials/prev-next.html themes/kami/assets/css/article.css
git commit -m "feat(kami): article footer with tags, prev/next, footnotes"
```

---

## Task 10: page.html for static pages + About content

Add `page.html` template (a stripped-down `single.html`) and create About content.

**Files:**
- Create: `themes/kami/layouts/page.html`
- Create: `content/about.md`
- Create: `content/about.en.md`

- [ ] **Step 1: Create `themes/kami/layouts/page.html`**

```go-html-template
{{ define "main" }}
  <article class="article">
    <header class="article-header">
      <h1 class="article-title">{{ .Title }}</h1>
    </header>

    <div class="article-body">
      {{ .Content }}
    </div>
  </article>
{{ end }}
```

(No grid wrapper, no eyebrow, no date, no TOC, no tags, no prev/next.)

- [ ] **Step 2: Create `content/about.md`**

```markdown
---
title: "关于"
type: "page"
---

我是 Mack。在这里写一些慢思考 — 关于工程、阅读，和如何认真过生活。

每月一两篇，不刻意保持节奏。
```

- [ ] **Step 3: Create `content/about.en.md`**

```markdown
---
title: "About"
type: "page"
---

I'm Mack. I write here about slow thinking — engineering, reading, and how to live deliberately.

A couple of pieces a month. No forced cadence.
```

- [ ] **Step 4: Verify About renders via page.html**

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && grep -c article-title /tmp/kami-build/about/index.html`
Expected: `1`.

Confirm the page does NOT contain TOC or article-nav markers:

```bash
grep -c article-toc /tmp/kami-build/about/index.html
grep -c article-nav /tmp/kami-build/about/index.html
```
Both expected: `0`.

- [ ] **Step 5: Visual check**

`hugo server`. Open `/about/` and `/en/about/`. Confirm:
- Just title + body, no eyebrow, no date, no TOC, no tags, no prev/next

- [ ] **Step 6: Commit**

```bash
git add themes/kami/layouts/page.html content/about.md content/about.en.md
git commit -m "feat(kami): static page template + About content"
```

---

## Task 11: Tags taxonomy + term pages

Build `/tags/` index and `/tags/<slug>/` term pages.

**Files:**
- Create: `themes/kami/layouts/taxonomy.html`
- Create: `themes/kami/layouts/term.html`
- Create: `themes/kami/assets/css/tags.css`
- Modify: `themes/kami/layouts/_partials/head.html` (add `tags.css`)

- [ ] **Step 1: Create `themes/kami/layouts/taxonomy.html`**

```go-html-template
{{ define "main" }}
  <div class="tags-index">
    <h1 class="tags-index__title">{{ .Title }}</h1>
    <ul class="tags-index__list">
      {{ range .Data.Terms.ByCount }}
        <li>
          <a href="{{ "/tags/" | relLangURL }}{{ .Name | urlize }}/">{{ .Name }}</a>
          <span class="tags-index__count">({{ .Count }})</span>
        </li>
      {{ end }}
    </ul>
  </div>
{{ end }}
```

- [ ] **Step 2: Create `themes/kami/layouts/term.html`**

```go-html-template
{{ define "main" }}
  <div class="home">
    <header class="term-header">
      <div class="term-eyebrow">{{ i18n "tags_label" | default "Tag" }}</div>
      <h1 class="term-name">{{ .Title }}</h1>
      <div class="term-count">{{ len .Pages }}</div>
    </header>

    {{ partial "post-list-by-year.html" .Pages }}
  </div>
{{ end }}
```

- [ ] **Step 3: Create `themes/kami/assets/css/tags.css`**

```css
.tags-index {
  max-width: var(--measure);
  margin: 0 auto;
}
.tags-index__title {
  font-size: 36px;
  margin: 0 0 2rem;
}
.tags-index__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
}
.tags-index__list li { font-size: 17px; }
.tags-index__list a {
  color: var(--text);
  border-bottom: none;
  font-weight: 500;
}
.tags-index__list a:hover { color: var(--brand); }
.tags-index__count {
  color: var(--text-meta);
  font-family: var(--mono);
  font-size: 12px;
  margin-left: 4px;
}

.term-header { margin-bottom: 2rem; }
.term-eyebrow {
  font-family: var(--serif);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 0.5rem;
}
.term-name {
  font-size: 36px;
  line-height: 1.15;
  margin: 0 0 0.5rem;
}
.term-count {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-meta);
}
```

- [ ] **Step 4: Add `tags.css` to bundle in `head.html`**

After the `code.css` line in `$css`, add:

```go-html-template
      (resources.Get "css/tags.css")
```

- [ ] **Step 5: Verify both pages render**

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
grep -c tags-index__list /tmp/kami-build/tags/index.html
grep -c term-header /tmp/kami-build/tags/craft/index.html
```
Expected: both return `1`.

- [ ] **Step 6: Visual check**

`hugo server`. Open `/tags/`. Confirm:
- Heading "Tags" or "标签" (depending on language)
- Tags `craft (2)`, `writing (1)`, `engineering (1)`, `reading (1)` listed by count desc
Open `/tags/craft/`. Confirm:
- Eyebrow "Tag" or "标签"
- "craft" as heading, count of 2 below
- The two craft posts year-grouped

- [ ] **Step 7: Commit**

```bash
git add themes/kami/layouts/taxonomy.html themes/kami/layouts/term.html themes/kami/assets/css/tags.css themes/kami/layouts/_partials/head.html
git commit -m "feat(kami): tags taxonomy index and per-tag term pages"
```

---

## Task 12: Bilingual — i18n + lang-switch + tag display in header

Add i18n strings, language switcher partial on articles + pages, and ensure header nav uses i18n labels.

**Files:**
- Create: `themes/kami/i18n/en.yaml`
- Create: `themes/kami/i18n/zh-Hans.yaml`
- Create: `themes/kami/layouts/_partials/lang-switch.html`
- Modify: `themes/kami/layouts/single.html`
- Modify: `themes/kami/layouts/page.html`
- Modify: `themes/kami/assets/css/article.css`

- [ ] **Step 1: Create `themes/kami/i18n/zh-Hans.yaml`**

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
  translation: 上一篇
- id: next_post
  translation: 下一篇
- id: toc_title
  translation: 目录
- id: tags_label
  translation: 标签
- id: copy_code
  translation: 复制
- id: copy_done
  translation: 已复制
- id: switch_to_other_lang
  translation: 阅读英文版
```

- [ ] **Step 2: Create `themes/kami/i18n/en.yaml`**

```yaml
- id: lang_name
  translation: English
- id: nav_blog
  translation: Blog
- id: nav_tags
  translation: Tags
- id: nav_about
  translation: About
- id: prev_post
  translation: Previous
- id: next_post
  translation: Next
- id: toc_title
  translation: Contents
- id: tags_label
  translation: Tags
- id: copy_code
  translation: Copy
- id: copy_done
  translation: Copied
- id: switch_to_other_lang
  translation: Read in Chinese
```

- [ ] **Step 3: Create `themes/kami/layouts/_partials/lang-switch.html`**

```go-html-template
{{ with .Translations }}
  <div class="lang-switch">
    {{ range . }}
      <a href="{{ .RelPermalink }}" hreflang="{{ .Lang }}">
        {{ i18n "switch_to_other_lang" }}
      </a>
    {{ end }}
  </div>
{{ end }}
```

- [ ] **Step 4: Add `lang-switch` to `single.html` article footer**

Replace `themes/kami/layouts/single.html` so the article footer reads:

```go-html-template
      <footer class="article-footer">
        {{ partial "tags-inline.html" . }}
        {{ partial "lang-switch.html" . }}
        {{ partial "prev-next.html" . }}
      </footer>
```

(Keep the rest of the file from Task 9.)

- [ ] **Step 5: Add `lang-switch` to `page.html`**

Replace `themes/kami/layouts/page.html`:

```go-html-template
{{ define "main" }}
  <article class="article">
    <header class="article-header">
      <h1 class="article-title">{{ .Title }}</h1>
    </header>

    <div class="article-body">
      {{ .Content }}
    </div>

    {{ if .Translations }}
      <footer class="article-footer">
        {{ partial "lang-switch.html" . }}
      </footer>
    {{ end }}
  </article>
{{ end }}
```

- [ ] **Step 6: Append lang-switch styles to `article.css`**

```css
.lang-switch {
  margin: 0 0 2rem;
  font-size: 13px;
}
.lang-switch a {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--brand);
  border-bottom: none;
}
.lang-switch a:hover { color: var(--brand-light); }
```

- [ ] **Step 7: Verify lang-switch appears on slow-letters (has translation) and not on shantaram (no translation)**

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
grep -c lang-switch /tmp/kami-build/posts/slow-letters/index.html
grep -c lang-switch /tmp/kami-build/posts/shantaram-notes/index.html
grep -c lang-switch /tmp/kami-build/about/index.html
```
Expected:
- slow-letters: `1`
- shantaram-notes: `0` (no English pair exists)
- about: `1` (has English pair)

- [ ] **Step 8: Visual check**

`hugo server`. Open `/posts/slow-letters/`. Confirm:
- Bottom of article shows "READ IN CHINESE" / "阅读英文版" link
- Click it: lands on `/en/posts/slow-letters/`
- Open `/posts/shantaram-notes/`: no language switcher (no translation)

- [ ] **Step 9: Commit**

```bash
git add themes/kami/i18n/ themes/kami/layouts/_partials/lang-switch.html themes/kami/layouts/single.html themes/kami/layouts/page.html themes/kami/assets/css/article.css
git commit -m "feat(kami): bilingual i18n strings and per-article language switcher"
```

---

## Task 13: Dark mode — theme.js + toggle + dark CSS

Add the head-loaded theme.js (no FOUC), the toggle button in the header, and exercise the dark color tokens.

**Files:**
- Create: `themes/kami/assets/js/theme.js`
- Create: `themes/kami/layouts/_partials/theme-toggle.html`
- Modify: `themes/kami/layouts/_partials/head.html`
- Modify: `themes/kami/layouts/_partials/header.html`
- Modify: `themes/kami/assets/css/layout.css` (toggle button styles)

- [ ] **Step 1: Create `themes/kami/assets/js/theme.js`**

```js
(function () {
  const stored = localStorage.getItem('kami-theme');
  const system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || system;
  document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const updateLabel = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.textContent = dark ? '☼' : '☾';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    };
    updateLabel();
    btn.addEventListener('click', function () {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('kami-theme', next);
      updateLabel();
    });
  });
})();
```

- [ ] **Step 2: Create `themes/kami/layouts/_partials/theme-toggle.html`**

```go-html-template
<button class="theme-toggle" type="button" aria-label="Toggle dark mode" aria-pressed="false">☾</button>
```

(Initial character is `☾` for the light-mode default; theme.js updates it after init.)

- [ ] **Step 3: Modify `themes/kami/layouts/_partials/head.html`**

Add a synchronous (non-deferred) script block AFTER the `<link rel="stylesheet">` block but BEFORE the deferred bundle script:

```go-html-template
  {{ $themeJs := resources.Get "js/theme.js" | resources.Minify | resources.Fingerprint "sha256" }}
  <script src="{{ $themeJs.RelPermalink }}" integrity="{{ $themeJs.Data.Integrity }}"></script>
```

(No `defer`. This must run before paint to set `data-theme`.)

- [ ] **Step 4: Modify `themes/kami/layouts/_partials/header.html`** to include the toggle

Replace with:

```go-html-template
<header class="site-header">
  <div class="site-header__inner">
    <a class="site-title" href="{{ .Site.Home.RelPermalink }}">{{ .Site.Title }}</a>
    <nav class="site-nav">
      {{ range .Site.Menus.main }}
        <a href="{{ .URL }}">{{ .Name }}</a>
      {{ end }}
      {{ partial "theme-toggle.html" . }}
    </nav>
  </div>
</header>
```

- [ ] **Step 5: Append toggle styles to `themes/kami/assets/css/layout.css`**

```css
.theme-toggle {
  background: transparent;
  border: none;
  padding: 0;
  margin-left: 0.75rem;
  font-size: 16px;
  color: var(--text-meta);
  cursor: pointer;
  line-height: 1;
}
.theme-toggle:hover { color: var(--brand); }
```

- [ ] **Step 6: Verify build**

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
grep -c theme-toggle /tmp/kami-build/index.html
grep -c 'data-theme' /tmp/kami-build/index.html
```
Expected: theme-toggle `1`; `data-theme` should be `0` here (it's set client-side, not server-rendered). The presence of `js/theme.js` should be confirmable via `grep theme.js /tmp/kami-build/index.html` returning at least `1`.

- [ ] **Step 7: Visual check**

`hugo server`. Open http://localhost:1313/. Confirm:
- Sun/moon button at the right of nav
- Click it: page background turns near-black `#141413`, text turns light cream
- All four text levels and ink-blue accent remain readable in dark mode
- Refresh: dark state preserved
- Open DevTools, network tab, hard reload: no flash of light theme on load
- macOS: switch system to dark mode → site auto-darkens (when no localStorage value)

- [ ] **Step 8: Commit**

```bash
git add themes/kami/assets/js/theme.js themes/kami/layouts/_partials/theme-toggle.html themes/kami/layouts/_partials/head.html themes/kami/layouts/_partials/header.html themes/kami/assets/css/layout.css
git commit -m "feat(kami): dark mode with no-FOUC bootstrap and toggle"
```

---

## Task 14: Code copy button

Inject a copy button into every code block; wire `code-copy.js` to write to clipboard.

**Files:**
- Modify: `themes/kami/layouts/_markup/render-codeblock.html`
- Create: `themes/kami/assets/js/code-copy.js`
- Modify: `themes/kami/assets/css/code.css`
- Modify: `themes/kami/layouts/_partials/head.html` (add code-copy.js to bundle)

- [ ] **Step 1: Replace `themes/kami/layouts/_markup/render-codeblock.html`**

```go-html-template
<figure class="code-block" data-lang="{{ .Type }}">
  <button class="copy-btn" type="button"
          data-label="{{ i18n "copy_code" | default "Copy" }}"
          data-done="{{ i18n "copy_done" | default "Copied" }}"
          aria-label="{{ i18n "copy_code" | default "Copy" }}">
    {{ i18n "copy_code" | default "Copy" }}
  </button>
  {{ highlight .Inner .Type .Options }}
</figure>
```

- [ ] **Step 2: Create `themes/kami/assets/js/code-copy.js`**

```js
(function () {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const block = btn.closest('.code-block');
    const codeEl = block && block.querySelector('code');
    if (!codeEl) return;
    const text = codeEl.innerText;
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(function () {
      const original = btn.dataset.label;
      btn.textContent = btn.dataset.done;
      btn.classList.add('copy-btn--done');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('copy-btn--done');
      }, 800);
    });
  });
})();
```

- [ ] **Step 3: Append button styles to `themes/kami/assets/css/code.css`**

```css
.code-block { position: relative; }
.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--bg-sand);
  color: var(--text-soft);
  border: 0.5px solid var(--border);
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 2px 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease;
}
.code-block:hover .copy-btn,
.copy-btn:focus { opacity: 1; }
.copy-btn:hover { color: var(--brand); }
.copy-btn--done { color: var(--brand); opacity: 1; }

@media (hover: none) {
  .copy-btn { opacity: 1; }
}
```

- [ ] **Step 4: Add `code-copy.js` to bundle in `head.html`**

In the `$js` slice (the deferred bundle, NOT the synchronous theme.js block), update:

```go-html-template
  {{ $js := slice
      (resources.Get "js/toc.js")
      (resources.Get "js/code-copy.js")
      | resources.Concat "js/main.bundle.js"
      | resources.Minify
      | resources.Fingerprint "sha256"
  }}
  <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
```

- [ ] **Step 5: Verify build**

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
grep -c copy-btn /tmp/kami-build/posts/slow-letters/index.html
```
Expected: `1`.

- [ ] **Step 6: Visual check**

`hugo server`. Open `/posts/slow-letters/`. Hover the python code block. Confirm:
- Small "COPY" button fades in at top-right
- Click it → button text flips to "COPIED" for ~800ms then back to "COPY"
- Paste somewhere: the python source from the block

- [ ] **Step 7: Commit**

```bash
git add themes/kami/layouts/_markup/render-codeblock.html themes/kami/assets/js/code-copy.js themes/kami/assets/css/code.css themes/kami/layouts/_partials/head.html
git commit -m "feat(kami): code-block copy button with i18n labels"
```

---

## Task 15: External link marker (render hook)

Mark external links with a small `↗` glyph so readers know they leave the site.

**Files:**
- Create: `themes/kami/layouts/_markup/render-link.html`

- [ ] **Step 1: Create `themes/kami/layouts/_markup/render-link.html`**

```go-html-template
{{- $url := .Destination -}}
{{- $isExternal := or (hasPrefix $url "http://") (hasPrefix $url "https://") -}}
<a href="{{ $url | safeURL }}"{{ with .Title }} title="{{ . }}"{{ end }}{{ if $isExternal }} rel="noopener" target="_blank"{{ end }}>{{ .Text | safeHTML }}{{ if $isExternal }}<span class="external-marker" aria-hidden="true"> ↗</span>{{ end }}</a>
```

- [ ] **Step 2: Append marker style to `base.css`** (so it carries to article and About bodies)

Append to `themes/kami/assets/css/base.css`:

```css
.external-marker {
  font-size: 0.8em;
  color: var(--text-meta);
  margin-left: 1px;
}
```

- [ ] **Step 3: Verify by adding a temporary external link to slow-letters and rebuilding**

Edit `content/posts/slow-letters.md`, change the first paragraph's last line to:

```markdown
...这些动作对慢信件是有害的。[^1] 参考 [Craig Mod 的写作](https://craigmod.com/)。
```

Run: `hugo --theme=kami --destination /tmp/kami-build --quiet && grep -c external-marker /tmp/kami-build/posts/slow-letters/index.html`
Expected: at least `1`.

Then revert the slow-letters file (the link was for verification only):

```bash
git checkout content/posts/slow-letters.md
```

- [ ] **Step 4: Commit**

```bash
git add themes/kami/layouts/_markup/render-link.html themes/kami/assets/css/base.css
git commit -m "feat(kami): external link marker via render hook"
```

---

## Task 16: 404 page

A minimal 404 with a link back home.

**Files:**
- Create: `themes/kami/layouts/404.html`

- [ ] **Step 1: Create `themes/kami/layouts/404.html`**

```go-html-template
{{ define "main" }}
  <div class="error-page">
    <h1>404</h1>
    <p>{{ if eq .Site.Language.Lang "zh-Hans" }}找不到这一页。{{ else }}This page doesn't exist.{{ end }} <a href="{{ .Site.Home.RelPermalink }}">{{ if eq .Site.Language.Lang "zh-Hans" }}回到首页{{ else }}Back home{{ end }}</a></p>
  </div>
{{ end }}
```

(Hard-coded language switch is acceptable here — 404 strings don't warrant an i18n entry.)

- [ ] **Step 2: Append 404 styles to `base.css`**

```css
.error-page {
  max-width: var(--measure);
  margin: 4rem auto;
  text-align: center;
}
.error-page h1 {
  font-size: 96px;
  line-height: 1;
  color: var(--brand);
  margin: 0 0 1rem;
}
.error-page p {
  font-size: 17px;
  color: var(--text-soft);
}
```

- [ ] **Step 3: Verify**

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
test -f /tmp/kami-build/404.html && echo OK
grep -c 'error-page' /tmp/kami-build/404.html
```
Expected: `OK` and `1`.

- [ ] **Step 4: Commit**

```bash
git add themes/kami/layouts/404.html themes/kami/assets/css/base.css
git commit -m "feat(kami): minimal 404 page"
```

---

## Task 17: Self-hosted serif fonts

Add font files + `@font-face` declarations. Optional task — system fonts work as fallback; do this for visual fidelity on machines without Source Han Serif SC pre-installed.

**Files:**
- Create: `themes/kami/assets/fonts/source-han-serif-sc-subset.woff2` (downloaded)
- Create: `themes/kami/assets/fonts/charter-regular.woff2` (downloaded)
- Modify: `themes/kami/assets/css/tokens.css`

- [ ] **Step 1: Download Source Han Serif SC subset**

The full font is ~12MB; we want a GB2312 subset (~1.5MB). Manually download from:

https://github.com/cn-fontpack/SourceHanSerifSC-subset/raw/main/SourceHanSerifSC-Regular-GB2312.woff2

Save as: `themes/kami/assets/fonts/source-han-serif-sc-subset.woff2`

If the link is dead, generate a subset locally:

```bash
pip install fonttools brotli
pyftsubset SourceHanSerifSC-Regular.otf \
  --unicodes=U+0020-007E,U+4E00-9FFF,U+3000-303F,U+FF00-FFEF \
  --output-file=themes/kami/assets/fonts/source-han-serif-sc-subset.woff2 \
  --flavor=woff2
```

- [ ] **Step 2: Download Charter (free Bitstream Charter)**

From https://practicaltypography.com/charter.html (free, MIT-licensed). Save as `themes/kami/assets/fonts/charter-regular.woff2`. If unavailable, skip this file and the EN side will continue to use the Charter system fallback (macOS bundles Charter; Windows/Linux fall back to Georgia).

- [ ] **Step 3: Add `@font-face` declarations to `themes/kami/assets/css/tokens.css`** (at the top, before `:root`)

```css
@font-face {
  font-family: "Source Han Serif SC";
  src: url("/fonts/source-han-serif-sc-subset.woff2") format("woff2");
  font-weight: 400 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Charter";
  src: url("/fonts/charter-regular.woff2") format("woff2");
  font-weight: 400 500;
  font-style: normal;
  font-display: swap;
}
```

(Note the `font-weight: 400 500` range — kami locks at these two weights, no synthetic bold.)

- [ ] **Step 4: Make Hugo serve `themes/kami/assets/fonts/` as `/fonts/`**

Hugo automatically serves anything in `themes/<name>/static/` at the site root. Move the font files:

```bash
mkdir -p themes/kami/static/fonts
mv themes/kami/assets/fonts/* themes/kami/static/fonts/
rmdir themes/kami/assets/fonts
```

- [ ] **Step 5: Verify font loads**

```bash
hugo --theme=kami --destination /tmp/kami-build --quiet
test -f /tmp/kami-build/fonts/source-han-serif-sc-subset.woff2 && echo "CN font OK"
test -f /tmp/kami-build/fonts/charter-regular.woff2 && echo "EN font OK" || echo "EN font missing (using fallback)"
```

- [ ] **Step 6: Visual check**

`hugo server`. Open `/posts/slow-letters/` in a private/incognito window. Use DevTools → Network → filter "Font" — confirm `source-han-serif-sc-subset.woff2` loads from local origin (not a CDN). Visually: Chinese text should render in Source Han Serif SC, not Songti SC.

- [ ] **Step 7: Commit**

```bash
git add themes/kami/static/fonts themes/kami/assets/css/tokens.css
git commit -m "feat(kami): self-hosted serif fonts (Source Han Serif SC subset + Charter)"
```

---

## Task 18: Switch the site from congo to kami

Wire the new theme into `hugo.toml`, drop congo from imports, simplify params and menus.

**Files:**
- Modify: `config/_default/hugo.toml`
- Modify: `config/_default/module.toml`
- Modify: `config/_default/params.toml`
- Modify: `config/_default/menus.zh-Hans.toml`
- Modify: `config/_default/menus.en.toml`
- Modify: `config/_default/languages.zh-Hans.toml`
- Modify: `config/_default/languages.en.toml`
- Delete: `layouts/` (the root-level partials directory; everything is now inside `themes/kami/`)
- Delete: `public/` (regenerated next build)

- [ ] **Step 1: Add theme to `hugo.toml`**

Open `config/_default/hugo.toml`. After the `defaultContentLanguage` line, add:

```toml
theme = "kami"
```

Verify the rest of the file is unchanged.

- [ ] **Step 2: Replace `config/_default/module.toml`** with empty content

```toml
# Theme is loaded via hugo.toml `theme = "kami"`. No module imports.
```

- [ ] **Step 3: Replace `config/_default/params.toml`** with the kami minimal params

```toml
[author]
  name = "Mack Ma"
  email = "hi@mack.ma"

[[author.links]]
  github = "https://github.com/mackt"
[[author.links]]
  x-twitter = "https://x.com/mackma1999"
```

- [ ] **Step 4: Replace `config/_default/menus.zh-Hans.toml`**

```toml
[[main]]
  name = "关于"
  pageRef = "about"
  weight = 5

[[main]]
  name = "博客"
  pageRef = "/"
  weight = 10

[[main]]
  name = "标签"
  pageRef = "tags"
  weight = 20
```

- [ ] **Step 5: Replace `config/_default/menus.en.toml`**

```toml
[[main]]
  name = "About"
  pageRef = "about"
  weight = 5

[[main]]
  name = "Blog"
  pageRef = "/"
  weight = 10

[[main]]
  name = "Tags"
  pageRef = "tags"
  weight = 20
```

- [ ] **Step 6: Simplify `config/_default/languages.zh-Hans.toml`**

```toml
locale = "zh-Hans"
label = "简体中文"
direction = "ltr"
weight = 1

title = "Mack's Blog"

[params]
  description = "慢思考 — 工程、阅读、生活"
```

- [ ] **Step 7: Simplify `config/_default/languages.en.toml`**

```toml
locale = "en"
label = "English"
direction = "ltr"
weight = 2

title = "Mack's Blog"

[params]
  description = "Slow thinking — engineering, reading, life"
```

(Note `weight = 2` for English so zh-Hans wins as default.)

- [ ] **Step 8: Remove root-level `/layouts/` directory**

The kami theme owns all templates now. Verify there's no irreplaceable content first:

```bash
ls -la layouts/
```

Expected: only `_partials/` (Hugo's empty placeholder from the previous setup). If empty:

```bash
rm -rf layouts/
```

If any custom override files exist (unexpected), inspect each and migrate or document as a follow-up before deleting.

- [ ] **Step 9: Remove pre-existing `public/` (will regenerate)**

```bash
rm -rf public/ resources/
```

- [ ] **Step 10: Clean Go module references to congo**

```bash
hugo mod tidy
cat go.mod
```

Expected: `go.mod` no longer mentions `github.com/jpanther/congo`. If it still does, manually delete the `require` line and re-run `hugo mod tidy`.

- [ ] **Step 11: Full build with the new theme active (no `--theme=` flag now)**

```bash
hugo --quiet 2>&1 | tail -10
ls public/
```

Expected: clean build, `public/` contains `index.html`, `posts/`, `tags/`, `about/`, `en/`, `index.xml`, `sitemap.xml`, `404.html`, `css/`, `js/`, `fonts/`.

- [ ] **Step 12: Verify no congo references remain**

```bash
grep -r "congo" config/ go.mod go.sum 2>&1 | grep -v "^Binary file"
```
Expected: no output (empty result).

- [ ] **Step 13: Commit**

```bash
git add config/ go.mod go.sum
git rm -r layouts/ 2>/dev/null || true
git commit -m "feat(kami): switch site from congo to kami theme"
```

---

## Task 19: Final verification + RSS + Lighthouse

Walk every route, verify RSS, and run Lighthouse.

- [ ] **Step 1: Full local server walkthrough**

```bash
hugo server --port 1313
```

In a browser, walk these URLs at desktop width (≥1024px) AND mobile width (≤560px) AND in dark mode:

| URL | Expect |
|---|---|
| `/` | Year-grouped CN index |
| `/en/` | Year-grouped EN index |
| `/posts/slow-letters/` | Article + TOC + tags + lang switch + footnotes + code block + copy button |
| `/en/posts/slow-letters/` | English version of above |
| `/posts/no-monorepo/` | Article with prev (shantaram) + next (slow-letters) |
| `/posts/shantaram-notes/` | No lang-switch (no EN pair); prev/next still work |
| `/about/` | Static page, no TOC, no tags, no prev/next; lang switch present |
| `/en/about/` | Same |
| `/tags/` | Tag index sorted by count |
| `/tags/craft/` | Two posts (slow-letters, no-monorepo) year-grouped |
| `/this-does-not-exist/` | 404 page (note: in dev, Hugo serves 404 for missing routes) |

For each: confirm dark mode toggle works and persists across navigation.

- [ ] **Step 2: Verify RSS includes full body**

```bash
hugo --quiet
grep -A2 '<description>' public/index.xml | head -20
```
Expected: descriptions contain actual prose, not just titles.

```bash
test -f public/en/index.xml && echo "EN RSS OK"
```

- [ ] **Step 3: Verify sitemap**

```bash
grep -c '<loc>' public/sitemap.xml
```
Expected: at minimum 12 entries (CN: home, about, tags, 2 craft tag, 1 writing tag, 1 reading tag, 1 engineering tag, 3 posts; EN: home, about, 1 post, taxonomy pages — final count depends on Hugo behavior).

- [ ] **Step 4: Lighthouse audit**

```bash
hugo server --port 1313
```

Run Lighthouse against http://localhost:1313/ and http://localhost:1313/posts/slow-letters/. Use Chrome DevTools → Lighthouse → "Performance" + "Accessibility" + "Best Practices" + "SEO" with "Mobile" preset.

Expected:
- Performance ≥ 95
- Accessibility = 100
- Best Practices = 100
- SEO ≥ 95

If Performance < 95, investigate: usually fonts (force `font-display: swap` confirmed in Task 17) or unoptimized images.

- [ ] **Step 5: Final commit (no code changes; this is a marker commit)**

After all checks pass, no commit needed unless adjustments were made. If you fixed anything during verification:

```bash
git add -A
git commit -m "fix(kami): post-verification adjustments"
```

- [ ] **Step 6: Update README and announce**

Open the project's main README (or create one if absent) and add a short note that the site now ships its own theme at `themes/kami/`. Optional: write a short blog post about the switch.

---

## Spec Coverage Self-Check

| Spec section | Covered by |
|---|---|
| Goal — replace congo with kami theme | Tasks 1–18 |
| Content Model — home, page, post, tag, term, 404 | Tasks 5, 6, 10, 11, 16 |
| Bilingual paired translations + lang-switch | Tasks 2, 12 |
| Architecture — themes/kami/ skeleton | Task 1 |
| Bundling — concat + minify + fingerprint | Tasks 4, 7, 8, 11, 14 |
| Color tokens (light + dark) | Tasks 3, 13 |
| Typography stacks + size scale | Tasks 3, 6 |
| Spacing, measure, web deviations | Tasks 3, 6 |
| home.html year-grouped index | Task 5 |
| single.html with right TOC | Tasks 6, 8 |
| page.html stripped down | Task 10 |
| taxonomy.html / term.html | Task 11 |
| 404.html | Task 16 |
| Header (no lang-switch in header) | Tasks 4, 13 |
| Footer (RSS link, copyright) | Task 4 |
| TOC sticky right + active highlight | Task 8 |
| Lang switcher (only when translation exists) | Task 12 |
| Prev/next | Task 9 |
| Code block + render hook + Chroma palette | Task 7 |
| Code copy button | Task 14 |
| Footnote restyle | Task 9 |
| Theme toggle (single character button) | Task 13 |
| Dark mode bootstrap (no FOUC) | Task 13 |
| TOC IntersectionObserver | Task 8 |
| i18n yaml | Task 12 |
| Chroma config | Task 7 |
| Config rewrite (hugo.toml, module.toml, params.toml, menus, languages) | Task 18 |
| Migration sequence (13 steps) | Tasks 1–18 mirror the spec sequence |
| Acceptance criteria | Task 19 |
| External link marker | Task 15 (added — supports `render-link.html` from spec architecture) |
| Self-hosted fonts | Task 17 |
