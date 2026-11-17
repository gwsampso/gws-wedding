# Rachel & Glenn wedding website
 
A single-page wedding site for Saturday 20 February 2027 at Jackalope, Mornington Peninsula. Everything (layout, styling, script) lives in one file: `index.html`. There is no build step and nothing to install.
 
## What is on the page
 
Five full-screen panels that snap one at a time as you scroll:
 
| Panel | Section id | Contents |
|---|---|---|
| Welcome | `#welcome` | Names, date, venue |
| The Day | `#the-day` | Run sheet from arrival to 11pm |
| The Place | `#the-place` | About Jackalope, address, Maps link |
| The Table | `#the-table` | Doot Doot Doot dinner and dietary note |
| RSVP | `#rsvp` | Reply form |
 
The Menu button (top right) opens a full-screen overlay for jumping between panels. On desktop there are also small dots down the right-hand side.
 
## Viewing it
 
- **On your computer:** double-click `index.html` to open it in a browser.
- **In Claude's preview:** the layout works but the photos will not show, because the preview blocks images from outside websites. This is a preview limitation, not a fault in the page.
## Putting it online
 
Any static host works. The simplest options:
 
- **Netlify Drop** (app.netlify.com/drop): drag the file in and you get a link.
- **GitHub Pages** or **Cloudflare Pages:** put `index.html` in a repository and enable Pages.
Keep the file named `index.html` so it loads at the root of the link. The page asks search engines not to index it, so it will only be found by people you send the link to.
 
## Settings you are likely to change
 
Search `index.html` for `const CONFIG`, near the bottom of the file:
 
```js
const CONFIG = {
  notifyEmail: "gwsampso@gmail.com",
  rsvpBy: "Friday 15 January 2027",
  guests: [
    "Mark Sampson",
    "Cheryl Sampson",
    "Gemma Sampson",
    "Casey Sampson",
  ]
};
```
 
- `notifyEmail`: where RSVP notifications are sent.
- `rsvpBy`: the reply-by date shown above the form.
- `guests`: the invited guest list (see below).
### Guest list
 
- One guest per line, in quotes, followed by a comma.
- Add nicknames or alternate surnames on the same line, separated by `|`:
  `"Katherine Smith|Kate Smith|Katie Smith",`
- Matching ignores capitals, spaces, hyphens, apostrophes and accents, so `O'Dwyer`, `ODwyer` and `o dwyer` all match.
- If the list is empty, every name is accepted.
Note: the list is readable by anyone who views the page source.
 
## How the RSVP form works
 
Fields: first and last name plus dietary requirements for guest one, and the same again for an optional guest two.
 
When a guest sends a reply:
 
1. Guest one needs a first and last name. Guest two is optional, but needs both names if any part is filled in.
2. Each name is checked against the guest list.
3. If a name is not found, the guest is asked to check the spelling. Pressing the button again ("Send anyway") sends it regardless, so nobody is locked out.
4. An email goes to `notifyEmail` with both names, both dietaries, the time received, and whether the names matched. Unmatched replies have "(name not on list)" in the subject line.
5. The guest sees a thank-you message. If sending fails, they are told it did not send and asked to try again.
### Email setup (one-off)
 
Emails are sent through FormSubmit (formsubmit.co), a free form-to-email service. No account is needed.
 
1. Put the site online.
2. Submit one test RSVP yourself.
3. FormSubmit emails you an activation link. Click it.
4. From then on every RSVP arrives in your inbox.
Check the spam folder if the activation email does not appear. FormSubmit also offers a random alias to use in place of your address in `notifyEmail`, which keeps your email out of the page source.
 
The form has no accept or decline option and replies are not stored anywhere other than your inbox.
 
## Photos
 
The four photos are Jackalope's own images, used with their permission, and load directly from jackalopehotels.com.
 
| Panel | Image |
|---|---|
| Welcome | `2025/01/20230309-Lisa-Nick_0154.jpg` |
| The Day | `2023/12/Jackalope_Wedding_Jackyak.png` |
| The Place | `2026/03/Frame-452-2-scaled.jpg` |
| The Table | `2024/07/Wedding-Dining-Jackalope.jpg` |
 
To swap one, search for `<img src=` and change the address. If a photo fails to load, the panel falls back to a dark brass-tinted background, so the page never looks broken.
 
For reliability, download the photos into an `images` folder beside `index.html` and point each `src` there (for example `src="images/hero.jpg"`). That way the site keeps working if Jackalope renames or moves its files.
 
## Editing the words
 
All wording is plain text inside `index.html`. Each panel is marked with a comment such as `<!-- 2. The day -->`. The run sheet times are in the block starting `<dl class="sheet"`.
 
## Colours and fonts
 
Defined once at the top of the `<style>` block under `:root`:
 
- `--ink` and `--char`: the two blacks
- `--ivory`: main text
- `--mute`: secondary text
- `--brass`: accent
Fonts are Cormorant Garamond (headings) and Jost (body), loaded from Google Fonts.
 
## Before sending the link to guests
 
- [ ] Open the hosted link on a phone and a laptop and check all four photos
- [ ] Send a test RSVP and click the FormSubmit activation link
- [ ] Complete the guest list, including nicknames and married names
- [ ] Confirm the 4.15pm arrival time and the RSVP date
- [ ] Confirm with the venue whether it is "champagne and canapés" or "champagne and caviar"