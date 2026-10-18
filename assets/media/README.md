# Media drop-zone

Put authentic audio and video here, then connect each file to a gallery item in
`index.html` by filling in two attributes on the relevant `<button class="gallery__card">`:

```html
data-media-type="audio"                      <!-- "audio", "video", or "" for none -->
data-media-src="assets/media/voiceover-sample.mp3"
```

Suggested files

| File                              | Used by                        | Format                       |
| --------------------------------- | ------------------------------ | ---------------------------- |
| `voiceover-sample.mp3`            | Gallery — Voice-Over Projects  | MP3, 128–192 kbps, < 2 min   |
| `narration-sample.mp3`            | Service 04 dialog (optional)   | MP3, 128–192 kbps            |
| `highlight-reel.mp4`              | Gallery — Featured Moments     | H.264 MP4, 1080p, < 30 s     |

Guidelines

- Keep clips short (10–40 seconds) so the page stays fast.
- Never autoplay with sound — the site only renders native controls after a click.
- Include a short text description in the lightbox for people who cannot hear the clip.
- Compress before uploading (`ffmpeg -i input.mov -c:v libx264 -crf 24 -c:a aac -b:a 128k out.mp4`).

Until a file exists at the path you reference, the site deliberately shows a
labelled "slot not added yet" panel instead of a broken player.
