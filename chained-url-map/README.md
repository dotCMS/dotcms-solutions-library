# Solution: Chained URL Mapping in dotCMS

## Overview
This solution enables users to implement chained URL mapping within dotCMS for content types such as series, episodes, and seasons. By establishing a custom URL structure, users can create more intuitive and user-friendly URLs (e.g., `/series/{series.slug}/season/{seasonNumber}`) that enhance the overall user experience.

## Challenges Addressed
- dotCMS does not support chained URL mappings out of the box, leading to a lack of flexibility in URL structures.
- Content Type Fields that are not Text, such as arrays or relationships are not supported in URL mappings out of the box.

## Key Features
- Intuitive URL Structure: Create user-friendly URLs that reflect the hierarchy of content (e.g., `/series/{series.slug}/season/{seasonNumber}`), making it easier for users to navigate and share links.
- Custom Content Retrieval: Logic is added to parse the URL and retrieve relevant content dynamically based on the URL segments.
- Fallback Mechanism: The DOT_URLMAP_FALLTHROUGH setting allows for loading detail pages even when the URL does not directly match any content.

## Implementation Steps
1. Configure URL Mapping:
- Set up a single URL map for the parent content type. In this example, for the Series content type.
- Ensure `DOT_URLMAP_FALLTHROUGH` is set to false in your environment variables.
2. Custom Content Retrieval Logic:
- Implement the Velocity code `series-detail.vtl` in your detail page template to parse the URL and dynamically retrieve content based on the series slug and season number.


## Use Cases
- Detailed Navigation: In the example of Seasons and Episodes, users can navigate directly to specific seasons and episodes based on structured URLs, enhancing the viewing experience.
- SEO Optimization: More descriptive URLs can improve search engine visibility and user engagement.

## Related Resources
1. [dotCMS Documentation on URL Mapping](https://www.dotcms.com/docs/latest/using-url-mapped-content)
2. [The Detail Page](https://www.dotcms.com/docs/latest/slugs-and-url-maps-seo-friendly-urls#DetailPage)


By following these steps and utilizing the provided code snippet, you can effectively implement chained URL mapping in your dotCMS environment, enhancing both content management and user navigation.

