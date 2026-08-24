# Videos

## `showreel.mp4` — hero background (in use)

The client's own render walkthrough. The home-page hero plays it on a loop
behind the headline, and it's what the "Watch Full Video" button opens full-size.
Poster frame: `public/images/hero/showreel-poster.jpg` (a real frame pulled from
this same clip, so there's no jump when playback kicks in).

To replace it: drop a new file in named exactly `showreel.mp4`. No code or JSON
change is needed — the hero HEAD-probes this path on load and switches on
automatically if it resolves to a real `video/*` file.

**If this file is ever removed**, the hero falls back to a cinematic Ken Burns
sequence over the five stills in `public/images/hero/` — nothing looks broken or
empty, so shipping without a video is a valid state too.

## `reel-terrace.mp4`, `reel-skyline.mp4`, `brand-bumper.mp4` — Brand Film (in use)

Three more client-supplied clips (rooftop amenity render, a night skyline shot,
and the brand's logo bumper), shown as a "Brand Film" gallery on the About page
(`src/components/about/BrandFilm.jsx`). Each autoplays muted and loops once
scrolled into view, and pauses when it scrolls off — driven entirely by
`site.json`'s `reels` array, so adding a fourth clip is a JSON edit, not a code
change. Posters live in `public/images/videos/`.

## Recommended encode (for any replacement clip)

| Setting  | Value                                              |
| -------- | -------------------------------------------------- |
| Codec    | H.264 (MP4) — widest browser support                |
| Bitrate  | 2–4 Mbps — keep the file **under ~8 MB**            |
| Audio    | **None.** Autoplay clips are muted; strip the track |

Browsers block autoplay on anything with sound, and a heavy file delays
whichever section it lives in on mobile connections.
