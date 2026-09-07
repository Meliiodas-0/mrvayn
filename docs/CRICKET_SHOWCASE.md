# Cricket Broadcast Lab

Highlighted portfolio project: Aayush / Production Test 03, a UE 5.8 cricket camera
and broadcast framework. This is a portfolio production with mannequin athletes and
six authored outcomes, not a claim of a shipped commercial cricket game.

## Source and edit

Owner-supplied master: `Aayush_BroadcastLab_V3_Presentation_4K60.mp4`.
The existing `Showcase_Validation.json` records 3840x2160, 60 fps, 182.05 seconds,
10,923 frames, 4,412,464,297 bytes and six complete live/replay pairs.

Full film: https://drive.google.com/file/d/1G-xUExs9pRnRpInMRkHpyMEIHtdcoBwh/view?usp=sharing

- Preview: frames 5401 through 6657, 01:30.017 to 01:50.967. The live six and its
  entire slow replay stay together, including the native ball trail and landing.
- Export: 1280x720, original 60 fps, 20.95 seconds, H.264 / yuv420p, fast-start MP4.
  Audio and source metadata are omitted. The original master is unchanged.
- Poster: 01:40.000, full 16:9 frame at 1280x720, JPEG.
- Rebuild with `scripts/cricket_preview.ps1 -SourceVideo <master> -Ffmpeg <ffmpeg>`.

## Web behavior

The lead card loads the MP4 only after an explicit play. Native controls and inline
phone playback are enabled, the video pauses when offscreen or the tab is hidden,
and the original broadcast frame is never cropped. The full film opens separately
on Google Drive. The same local excerpt is reused by the project detail dialog.

## Source credits

The source project's `AssetCredits.md` records original stadium geometry, broadcast
artwork, camera profiles, cricket arm animation tracks, materials and framework code.
Mannequin meshes and base resources are Epic Games Unreal content. Grass004 textures
are from ambientCG (CC0): https://ambientcg.com/view?id=Grass004 .

The web excerpt is silent. The full film retains the original audio and its credits:
Gregor Quendel's Free Crowd Cheering Sounds (CC BY 4.0), GH0STY_XD's cricket bat
recording (CC0), and Kenney Impact Sounds (CC0), as documented in the source project.
