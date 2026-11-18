/* Amber bulb field: dense near the top of the screen, thinning out below, gently breathing. */
(function(){
  const c = document.getElementById("lights"), x = c.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sprite = document.createElement("canvas"); sprite.width = sprite.height = 64;
  const sx = sprite.getContext("2d"), g = sx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,"rgba(255,238,196,1)"); g.addColorStop(.16,"rgba(242,184,92,.92)");
  g.addColorStop(.5,"rgba(222,142,52,.2)"); g.addColorStop(1,"rgba(222,142,52,0)");
  sx.fillStyle = g; sx.fillRect(0,0,64,64);
  let W = 0, H = 0, bulbs = [];
  function seed(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.round(Math.min(520, W * H / 2400)); bulbs = [];
    for (let i = 0; i < n; i++){
      const d = Math.pow(Math.random(), 2.3);
      bulbs.push({ x: Math.random() * W, y: d * H * .92, r: (5 + Math.random() * 12) * (1 - d * .5),
        p: Math.random() * 6.28, s: .3 + Math.random() * .9, a: (.35 + Math.random() * .65) * (1 - d * .8) });
    }
  }
  function draw(t){
    x.clearRect(0,0,W,H);
    for (const b of bulbs){
      x.globalAlpha = b.a * (still ? 1 : .7 + .3 * Math.sin(b.p + t * .001 * b.s));
      x.drawImage(sprite, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
    if (!still) requestAnimationFrame(draw);
  }
  seed(); requestAnimationFrame(draw);
  addEventListener("resize", () => { if (innerWidth !== W) { seed(); if (still) draw(0); } });
})();
