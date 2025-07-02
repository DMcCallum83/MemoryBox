
## We are going to build a chrome extension.

It's called MemoryBox.

## Core concepts

*It will have an interface in multiple parts:*
- Memory Box: a tab/area to view previous Memories (default view)
- New Memory: a tab/area to input new Memories
- Box Stats: a tab/area to show statistics and info

##

*new Memories (Memory) can consist of:*
- simple text typed, or pasted from clipboard
- an image:
    - pasted from clipboard
    - a screengrab collected at time of adding entry (using a button in the new entry page)
- a url 
- option to add an 'important' tag

##

*Main features*
- Users can store ('box') a new 'Memory' 
- Users can see all previously boxed Memories
    - Users can export any boxed memory (putting memory content, neatly formatted, in to the clipboard)
    - Users can share boxed memories by sharing a link with someone else using the extension 
- Users can see some statistics:
    - Total boxed memories
    - How many Memories have been boxed:
        - Today
        - This Week
        - This Month

## Flows

*Open the extension*:

- prompted to authenticate with google auth
    - once authenticated, retrieve data from sync storage
    - if authenticated already, retrieve data from sync storage
    - always check for any shared Memories that ahve been updated, and update the previous one accordingly

- once authenticated user start, by default, on the Memory Box tab which lists their previously captured Memories 
    - each has colour coded tags to show if it contains URL, Image, Text, Shared (by other users)
    - this list should be filterable by tag, date
    - this list should be text searchable and will search text, url, date created ('boxed on') within each memory, and also the text within tags

*Selecting a Memory*:
    - will expand the item showing anything that was entered at time off creation (omiting fileds that weren't)
        - the full text
        - Link displayed as 'Link {domain of url}
        - image
        - date it was created (e.g. boxed on )
        - date updated if it was modified 
    - an edit button which allows the user to delete/update any of the previously stored data, or add things that weren't previously included (e.g. add a url, if the user hadn't originally)
        - if this memory was previously shared, then send an updated version to the user it was shared with previously
    - a share button which allows the user to share this memory 
        - this will show a list of previous users shared to
        - a button to add a new share contact (accept email, and name)

*clicking the Stats tab*:
- Shows
    - Total boxed memories
        - How many Memories have been boxed:
            - Today
            - This Week
            - This Month
    - Total shared memories


## Tech stack

- React
- Typescript
- SCSS
- Use the HeadlessUI component library for as many components as possible (https://headlessui.com/)
- For icons use the feather-icons-react package
- anything else you require, then propose it in bulk and let me approve

## Theme

colours:
- input background, button border: #ffffff
- input text, button text, labels: #000000
- background
 - Memory Box tab: #fb5607
 - New Memory form/tab: #ffbe0b
 - Stats tab: #3a86ff




