# Rachel & Glenn wedding website
 
A single-page wedding site for Saturday 20 February 2027 at Jackalope, Mornington Peninsula. Everything (layout, styling, script) lives in one file: `index.html`. There is no build step and nothing to install.
 
## What is on the page
 
Five full-screen panels that snap one at a time as you scroll:
 
| Panel | Section id | Contents |
|---|---|---|
| Welcome | `#welcome` | Names, "invite you to celebrate their marriage", date, venue |
| The Invitation | `#invitation` | A short letter from Rachel and Glenn asking guests to join them |
| The Day | `#the-day` | Run sheet from arrival to 11pm |
| The Place | `#the-place` | About Jackalope, address, Maps link |
| RSVP | `#rsvp` | Reply form |

There are also three alternative looks at `a/`, `b/` and `c/` (see [Versions A, B and C](#versions-a-b-and-c-a-b-c)), and a separate page at `quest/` (see [The 8-bit invitation](#the-8-bit-invitation-quest) below). The main site does not link to any of them.
 
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
 
The three photos are Jackalope's own images, used with their permission, and load directly from jackalopehotels.com.
 
| Panel | Image |
|---|---|
| Welcome | `2025/01/20230309-Lisa-Nick_0154.jpg` |
| The Day | `2023/12/Jackalope_Wedding_Jackyak.png` |
| The Place | `2026/03/Frame-452-2-scaled.jpg` |
 
The Invitation panel has no photo on purpose: it is a dark card with a thin brass frame, so the words carry it.

To swap one, search for `<img src=` and change the address. If a photo fails to load, the panel falls back to a dark brass-tinted background, so the page never looks broken.
 
For reliability, download the photos into an `images` folder beside `index.html` and point each `src` there (for example `src="images/hero.jpg"`). That way the site keeps working if Jackalope renames or moves its files.
 
## Editing the words
 
All wording is plain text inside `index.html`. Each panel is marked with a comment such as `<!-- 3. The day -->`. The invitation letter is the paragraph with `class="letter"`. The run sheet times are in the block starting `<dl class="sheet"`.
 
## Colours and fonts
 
Defined once at the top of the `<style>` block under `:root`:
 
- `--ink` and `--char`: the two blacks
- `--ivory`: main text
- `--mute`: secondary text
- `--brass`: accent
Fonts are Cormorant Garamond (headings) and Jost (body), loaded from Google Fonts.
 
## Before sending the link to guests
 
- [ ] Open the hosted link on a phone and a laptop and check all three photos
- [ ] Send a test RSVP and click the FormSubmit activation link
- [ ] Complete the guest list, including nicknames and married names
- [ ] Confirm the 4.15pm arrival time and the RSVP date
- [ ] Read the invitation letter together and make it sound like you both

## Versions A, B and C (`a/`, `b/`, `c/`)

Three alternative looks for the same site, each with identical wording, run sheet, guest list and RSVP form:

| Link | Look |
|---|---|
| `/gws-wedding/a/` | **Daylight:** pale stone, ink type, vine green, photos framed like prints (Bodoni Moda and Hanken Grotesk) |
| `/gws-wedding/b/` | **Cinema:** pure black and white, every panel a full-bleed photo, one clean sans (Outfit) |
| `/gws-wedding/c/` | **Lights:** no photos, a slow field of amber bulbs (Marcellus and Mulish) |

They are built from `index.html`, so **don't edit `a/`, `b/` or `c/` by hand**. Change the words in `index.html`, then run:

```
python3 variants/build.py
```

and commit the result. Each version's look lives in `variants/a.css`, `variants/b.css` and `variants/c.css` (plus `variants/c.js` for the bulbs). Replies from any version go to the same inbox.

## The 8-bit invitation (`quest/`)

Live at `https://gwsampso.github.io/gws-wedding/quest/`. It's Glenn's take on the invitation: a bonus level for *The 10 Year Path* ([Part I](https://gwsampso.github.io/rachel_quest/)), with the same CRT screen, fonts, beeps and avatars. It's one self-contained file, `quest/index.html`, with no build step.

How it plays:

1. Boot screen, then a title screen: *The 10 Year Path, Part II: The Wedding*.
2. "Previously on…": the ten years from the Dirty Swan to "she said yes", plus a pixelated proposal photo taken from Part I.
3. The Final Level: A) join the party or B) get a puppy (game over).
4. The player types their name and gets their own pixel avatar. The name stays in their browser; only a hash of it is sent to the avatar service.
5. Boss transition: "A wild INVITATION appeared!" with ACCEPT or RUN (you can't run).
6. Level up: the player joins the party and gets a Golden Ticket.
7. Quest log: date, place and the day as objectives, with buttons to RSVP (goes to the main site's form), save the date (`.ics` calendar file) and open Maps.

Wording, times and links are in the `WEDDING` and `RECAP` blocks at the top of the `<script>`. The page has no fast strobing (Part I's boss flash is replaced with a checkerboard wipe), and it turns off animation for anyone whose device asks for reduced motion.