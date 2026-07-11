# blog

个人博客源码，站点：<https://mack.ma>

## Stack

- **Static site generator:** [Hugo](https://gohugo.io/)（Go module 模式）
- **Theme:** [`hugo-theme-kami`](https://github.com/mackt/hugo-theme-kami) —— 通过 `go.mod` 引用，不在仓库内
- **图片 CDN:** <https://img.mack.ma>（`{{</* img src="…" */>}}` shortcode）
- **语言:** 中文（`zh-Hans`），已移除英文本地化

## Deployment — Cloudflare Pages

站点通过 **Cloudflare Pages 的 Git 集成**自动构建部署。

**工作流：**

```
本地写/改 → git commit → git push origin main
                              ↓
                    Cloudflare Pages 自动拉取
                              ↓
                        hugo 构建 public/
                              ↓
                        https://mack.ma
```

**Cloudflare Pages 项目配置（在 CF Dashboard 里设定，不在仓库内）：**

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `hugo --gc --minify` |
| Build output directory | `public` |
| Environment variable | `HUGO_VERSION`（跟本地保持一致，避免主题 API 不兼容） |

**注意：**

- 仓库里 **没有** `wrangler.toml` / `.github/workflows/` / `_headers` / `_redirects` —— 部署行为完全由 CF Pages 后台配置决定。
- 推 `main` 就等于发布，没有预览环境的话每次 push 都会上生产。
- Theme 是独立仓库（`hugo-theme-kami`），改主题要去那边改 → 发新 tag → 更新本仓库 `go.mod`。

## Local dev

```sh
# 起本地服务器（含 draft）
hugo server -D

# 只构建
hugo --gc --minify
```

## 新文章

```sh
hugo new content/posts/some-slug.md
```

Front matter 参考 `content/posts/apns-via-surge.md`。
