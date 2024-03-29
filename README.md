# infosec.mozilla.org
Guidelines, principles published on https://infosec.mozilla.org

## How to contribute

### Propose your changes directly

- Either using the GitHub integrated editor or your own, make your changes in Markdown.
- Request merging by creating a pull-request.
- That's it - thanks for helping making our content better!

### Open issues or discussion topics

Just create new issues as you see fit, really.

### Converting Mediawiki to Markdown

- Install [Pandoc](https://pandoc.org/).
- `pandoc -f mediawiki -t gfm --atx yourfile.mediawiki`
- Fix it up (tip: use existing documents and copy their formatting!)
- Profit.

### How to locally test

Ensure Ruby, Gem and Bundle are installed.

- Checkout a copy of this repository (feel free to fork it first, specially if you're going to propose changes).
- Go into the `docs` sub-directory.
- Run `bundle install` to ensure all dependencies are installed.
- Run `bundle exec jekyll serve` to locally serve contents for testing.

## Deployment

This repository is automatically deployed via [GitHub's built in support for Jekyll in GitHub Pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) whenever new content is committed to the `/docs` directory in the `master` branch. AWS CloudFront, which sits in front of the GitHub pages site, will then automatically pick up new content when the cache expires (on the order of 10 to 15 minutes) and it will be visible on the live site.

## Site setup

- The theme is [Frontierline](https://github.com/craigcook/frontierline-theme) and is based on jekyll-theme-slate for the purpose of Jekyll integration.
- The site is rendered by [Jekyll](https://jekyllrb.com/).
- The font (ZillaLab) and logos are from the [Mozilla Design Language](https://mozilla.ninja/).
- https://infosec.mozilla.org is fronted by AWS CloudFront and utilizes a Lambda@Edge function, that are described in
  the `aws` directory of this repository.

## Licensing

All content is licensed under the [Mozilla Public License (MPL)](https://www.mozilla.org/en-US/MPL/) unless indicated otherwise.
