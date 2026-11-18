/* =====================================================================
   Shared by d/ (Our story), e/ (The card) and links/ (the link maker).

   Personal links: the guest's names travel inside the link itself
   (?to=...), so no guest list is stored anywhere on the site.
   RSVP: one form, emailed through FormSubmit in the same layout as the
   main site's replies.
   ===================================================================== */
window.Invite = (() => {
  const CONFIG = {
    // FormSubmit alias for the RSVP inbox (keeps the real address off the site).
    formId: "4ac5529b5dc45779b253178f1421c56a",
    rsvpBy: "Friday 15 January 2027",
    maxGuests: 8,
  };

  /* ---------- personal links ---------- */
  const toB64 = str => {
    let bin = "";
    new TextEncoder().encode(str).forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  const fromB64 = s => {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
  };
  const tidy = s => String(s || "").trim().replace(/\s+/g, " ");

  function greetingFor(names) {
    const firsts = names.map(n => tidy(n).split(" ")[0]).filter(Boolean);
    if (firsts.length < 2) return firsts[0] || "";
    return firsts.slice(0, -1).join(", ") + " & " + firsts[firsts.length - 1];
  }

  function encodeGuest(names, greeting) {
    names = names.map(tidy).filter(Boolean).slice(0, CONFIG.maxGuests);
    const payload = { n: names };
    greeting = tidy(greeting);
    if (greeting && greeting !== greetingFor(names)) payload.g = greeting;
    return toB64(JSON.stringify(payload));
  }

  // Returns { names, greeting } from ?to=..., or null for a plain link.
  function readGuest() {
    const token = new URLSearchParams(location.search).get("to");
    if (!token) return null;
    try {
      const data = JSON.parse(fromB64(token));
      const names = (Array.isArray(data.n) ? data.n : []).map(tidy).filter(Boolean).slice(0, CONFIG.maxGuests);
      if (!names.length) return null;
      return { names, greeting: tidy(data.g).slice(0, 80) || greetingFor(names) };
    } catch {
      return null;
    }
  }

  /* ---------- RSVP form ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Builds the form inside `el`. Pages style the .rsvp-* classes themselves.
  function mountRSVP(el, { version, guest }) {
    const invited = guest ? guest.names : null;
    const rows = invited || ["", ""];
    el.innerHTML = `
      <form class="rsvp-form" novalidate>
        ${rows.map((name, i) => `
          <fieldset class="rsvp-guest">
            <legend>${invited ? "Guest" : i === 0 ? "Guest one" : "Guest two <span>if replying for two</span>"}</legend>
            <div class="rsvp-field"><label for="rs-n${i}">Name</label>
              <input id="rs-n${i}" class="rsvp-name" type="text" value="${esc(name)}" autocomplete="${i === 0 ? "name" : "off"}" autocapitalize="words"></div>
            <div class="rsvp-field"><label for="rs-d${i}">Dietary requirements</label>
              <input id="rs-d${i}" class="rsvp-diet" type="text" autocomplete="off" placeholder="${i === 0 ? "Allergies, vegetarian, anything we should know" : ""}"></div>
          </fieldset>`).join("")}
        ${invited && invited.length > 1 ? `<p class="rsvp-hint">If someone can't make it, just clear their name.</p>` : ""}
        <div class="rsvp-field rsvp-note"><label for="rs-note">A note for us <span>optional</span></label>
          <textarea id="rs-note" rows="2"></textarea></div>
        <input class="rsvp-hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="rsvp-actions">
          <button class="rsvp-send" type="submit">Send reply</button>
          <p class="rsvp-status" role="status" aria-live="polite"></p>
        </div>
      </form>
      <div class="rsvp-thanks" hidden><p tabindex="-1"></p>
        <p class="rsvp-small">Need to change something? Just let Rachel or Glenn know.</p></div>`;

    const form = el.querySelector("form"), status = el.querySelector(".rsvp-status"), send = el.querySelector(".rsvp-send");
    const say = (msg, bad) => { status.textContent = msg; status.classList.toggle("bad", !!bad); };
    form.addEventListener("input", () => { form.querySelectorAll("[aria-invalid]").forEach(i => i.removeAttribute("aria-invalid")); say(""); });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (form.querySelector(".rsvp-hp").value) return;
      const people = [...form.querySelectorAll(".rsvp-guest")].map(fs => ({
        name: tidy(fs.querySelector(".rsvp-name").value),
        diet: tidy(fs.querySelector(".rsvp-diet").value),
        input: fs.querySelector(".rsvp-name"),
      }));
      const coming = people.filter(p => p.name);
      if (!coming.length) {
        people[0].input.setAttribute("aria-invalid", "true"); people[0].input.focus();
        return say("Please enter at least one name.", true);
      }
      const halfName = coming.find(p => p.name.split(" ").length < 2);
      if (halfName && !invited) {
        halfName.input.setAttribute("aria-invalid", "true"); halfName.input.focus();
        return say("Please enter a first and last name.", true);
      }

      const names = coming.map(p => p.name);
      const payload = {
        _subject: "Wedding RSVP: " + names.join(" and "),
        _template: "table",
        _captcha: "false",
      };
      coming.forEach((p, i) => {
        payload[`Guest ${i + 1}`] = p.name;
        payload[`Guest ${i + 1} dietaries`] = p.diet || "None";
      });
      const note = tidy(form.querySelector("#rs-note").value);
      payload["Note"] = note || "None";
      if (invited) {
        const dropped = invited.filter(n => !names.includes(n));
        const added = names.filter(n => !invited.includes(n));
        payload["Invitation"] = invited.join(", ");
        payload["Guest list check"] = !dropped.length && !added.length ? "Replied as invited"
          : "CHECK: " + [dropped.length && "not coming: " + dropped.join(", "), added.length && "name changed or added: " + added.join(", ")].filter(Boolean).join("; ");
      } else {
        payload["Guest list check"] = "CHECK: replied without a personal link";
      }
      payload["Version"] = version;
      payload["Received"] = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne", dateStyle: "full", timeStyle: "short" });

      send.disabled = true; say("Sending your reply…");
      try {
        const res = await fetch("https://formsubmit.co/ajax/" + CONFIG.formId, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || String(data.success) === "false") throw new Error(data.message || "Send failed");
        form.hidden = true;
        const thanks = el.querySelector(".rsvp-thanks");
        thanks.querySelector("p").textContent = "Thank you, " + greetingFor(names) + ". We have your reply and can't wait to celebrate with you.";
        thanks.hidden = false;
        thanks.querySelector("p").focus();
      } catch {
        send.disabled = false;
        say("Sorry, your reply didn't send. Please try again in a moment, or message Rachel or Glenn directly.", true);
      }
    });
  }

  return { CONFIG, readGuest, encodeGuest, greetingFor, mountRSVP };
})();
