# Solution: Multi-Host Content Publishing


## Overview
This solution enables customers to create content once and selectively publish it to multiple sites within their dotCMS environment. By leveraging a custom multi-select field, users can easily choose which hosts will display the content, streamlining content management across different platforms.

## Challenges Addressed
- Selective Publishing: Need for a straightforward method to publish content to specific sites without extensive manual processes.
- User Experience: Ensuring that content editors can easily manage host selections without technical complexities.

## Key Features
- Multi-Select Interface: A user-friendly interface allowing the selection of multiple hosts from a dropdown list.
- Dynamic Host Filtering: Automatically filters hosts to exclude global and system hosts.
- Host selector checkbox.vtl adds a no-dojo multi-tiered checkbox option instead of the select box and is more of a pure javascript solution

## Implementation Steps
1. Create Custom Field: Implement the provided Velocity code snippet to generate a multi-select dropdown for host selection.
2. Add a custom field to the Content Type 

## Use Cases
- Localized Updates: When making updates to services or offerings, content can be targeted to specific areas without affecting the entire network of sites.
- Event Announcements: Selectively share event information relevant only to certain hosts, ensuring targeted communication.

## Related Resources
1. [dotCMS Documentation on Custom Fields](https://www.dotcms.com/docs/latest/custom-field)
2. [Velocity Template Language Guide](https://www.dotcms.com/docs/latest/velocity)

