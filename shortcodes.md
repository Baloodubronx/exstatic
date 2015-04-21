# Shortcodes to use in the template

## include any file (mainly for html)
`{{file: %filename%}}` ex: {{file: header.html}}

## general
- `{{categories}}` : all available categories, sorted as a list (ul > li > a)
- `{{tags}}` : all available tags, sorted as a list (ul > li > a)
- `{{last-articles:X}}` : X last articles published (default to 20 articles)
- `{{page-title}}` : the page title defined in the settings. Default to site name - title post


## post specific:
- `{{post-title}}`
- `{{post-content}}`
- `{{post-category}}`
- `{{post-tags}}`
- `{{post-author-name}}`

## category specific
- `{{current-category}}`

## tag specific
- `{{current-tag}}`
