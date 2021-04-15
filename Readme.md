# Github Scraper
Github Scraper is a nodejs Web scraping project which helps us to understand how to  scrap data from web using nodejs.The project starts with making a request on [github topics](https://github.com/topics) then for each topic 
we choose first eigth repositories/projects on github then for each project
we scrap all the open issues name and issues url aand import the issue url
and issue name in  pdf which is inside the github topic folder.

## packages used

1. [cheerio](https://www.npmjs.com/package/cheerio)

With Node.js tools like Cheerio, you can scrape and parse this data directly from web pages to use for your projects and applications.

2. [request](https://www.npmjs.com/package/request);

request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.

you can also use axios[https://www.npmjs.com/package/axios] or [Got](https://www.npmjs.com/package/got);

3. [jspdf](https://www.npmjs.com/package/jspdf)

use to create pdf read the documentation for more details

4. fs  is used for read and write file operations


## Steps to run the project;

1. Install all the packages
`npm install`
2. simply go to terminal and run
`node scraper.js`