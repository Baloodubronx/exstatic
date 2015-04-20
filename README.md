# Exstatic
Amateur webmaster at a big & fast growing information website, I feel like we reached the limits of Wordpress.

"Exstatic" is an experiment to see if it is possible to create a simple, robust static blog generator with an integrated importer from Wordpress.

Interestingly, this Wordpress importer relies on the use of the WP-API to fetch **articles** *and* **images** from the Wordpress installation. See [Importer](#importer) for more details on importation from Wordpress.


## Under the hood
 - A nodeJS/Express framework for the app and editor
 - Jade for templating and theme generation
 - CodeMirror for the text editor
 - jQuery on the client

## The static blog generator
### 1. General
To keep the app as minimalist as possible, we assumed a structure as follow (very similar to Wordpress):
 - Index/home -> Home page, can be static or generated from latest posts
 - One category -> `/ %category% /` ( /coding/ )
 - One tag -> `/ tag/ %tag% /` ( /tag/nodejs/ )
 - One article -> `/ %category% / %post-title%` (/blogging/how-to-transition-from-wordpress)
 - One static page -> `/ %page-title` (/about)

### 2. The content editor
A *very simple* Markdown editor for the posts with a few important features:
 - tags and category management (each post should have at least one category, otherwise placed in "misc" category). Tags are optional.
 - page/post type selection.
 - compilation and preview to see the article in its final form, before publication.
 - "slug" generator that generates a url-friendly "slug" from the title of the post

### 3. Theme structure
1. **Styles:**
Css and stylus can be used. Every file in the `/theme/styles/` folder will be compiled into a single style.css file and served.

2. **Templates:**
Jade templating engine is used. The files needed to generate the website are:
  - article.jade: template for a single article
  - home.jade: template for the home
  - category.jade: template for the categories

You can use jade extend capability to include partials such as a "header/footer" template common to all your pages.
