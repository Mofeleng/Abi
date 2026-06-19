import os
import json
import time
import re
from groq import Groq
from gtts import gTTS
from num2words import num2words
from dotenv import load_dotenv
from datetime import datetime

from moviepy import ImageClip, AudioFileClip, concatenate_videoclips

try:
    import comtypes.client
    WINDOWS_POWERPOINT_AVAILABLE = True
except ImportError:
    WINDOWS_POWERPOINT_AVAILABLE = False

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _convert_currency_to_words(text: str) -> str:
    pattern = r'[Rr]\s?(\d+(?:[\s,]\d+)*(?:\.\d+)?)\b'

    def match_resolver(match):
        raw_number_str = match.group(1)
        clean_numeric_str = raw_number_str.replace(' ', '').replace(',', '')

        try:
            if '.' in clean_numeric_str:
                parts = clean_numeric_str.split('.')
                rands_part = parts[0]
                cents_part = parts[1][:2] if len(parts) > 1 else '0'

                rands_val = int(rands_part) if rands_part else 0
                cents_val = int(cents_part) if cents_part else 0

                rands_words = num2words(rands_val, lang='en') + " rands"
                if cents_val > 0:
                    cents_words = f" and {num2words(cents_val, lang='en')} cents"
                    return (rands_words + cents_words).replace('-', ' ')
                return rands_words.replace('-', ' ')
            else:
                val = int(clean_numeric_str)
                words = num2words(val, lang='en') + " rands"
                return words.replace('-', ' ')
        except Exception:
            return match.group(0)

    return re.sub(pattern, match_resolver, text)


def _convert_pptx_to_images(pptx_path: str, output_dir: str) -> list:
    image_paths = []
    if not WINDOWS_POWERPOINT_AVAILABLE:
        print("[Abi Present] Warning: comtypes not installed. Skipping direct video rendering layer.")
        return image_paths

    if not pptx_path or not os.path.exists(pptx_path):
        print(f"[Abi Present] Warning: Presentation file not found at {pptx_path}. Skipping image export.")
        return image_paths

    print("[Abi Present] Interfacing with PowerPoint background workers to export slide frames...")
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        powerpoint = None
        try:
            time.sleep(2)
            powerpoint = comtypes.client.CreateObject("PowerPoint.Application")
            powerpoint.Visible = True
            time.sleep(1)

            abs_pptx = os.path.abspath(pptx_path)
            presentation = powerpoint.Presentations.Open(abs_pptx, ReadOnly=True, WithWindow=False)

            abs_output_dir = os.path.abspath(output_dir)
            presentation.Export(abs_output_dir, "PNG")
            presentation.Close()
            powerpoint.Quit()

            time.sleep(1.5)
            print(f"[Abi Present] PowerPoint export succeeded on attempt {attempt}.")

            def extract_slide_number(filename):
                match = re.search(r'slide(\d+)\.png', filename.lower())
                return int(match.group(1)) if match else 0

            raw_files = [f for f in os.listdir(abs_output_dir) if f.lower().startswith("slide") and f.lower().endswith(".png")]
            sorted_files = sorted(raw_files, key=extract_slide_number)

            for file in sorted_files:
                image_paths.append(os.path.join(abs_output_dir, file))

            print(f"[Abi Present] Successfully vectorized {len(image_paths)} slides into raster video frames.")
            break

        except Exception as retry_err:
            print(f"[Abi Present] Attempt {attempt}/{max_retries} failed: {retry_err}")
            try:
                if powerpoint:
                    powerpoint.Quit()
            except Exception:
                pass
            if attempt == max_retries:
                print("[Abi Present] All retry attempts exhausted. Skipping video export.")
                return image_paths
            time.sleep(3)

    return image_paths


def run(slide_outline: dict, output_dir: str = "outputs/narration", pptx_path: str = None) -> dict:
    print("\n[Abi Present] Generating narration scripts, audio streams, and compiling video timelines...")
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    title = slide_outline.get("title", "Presentation")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are Abi Present, a premium corporate business narrator and lead financial analyst.
You receive a highly detailed presentation outline containing deep data analysis, metrics, and chart configurations.
Your job is to generate an elite, spoken boardroom narration script.

Return ONLY valid JSON with this exact structure:
{
  "presentation_title": "...",
  "total_duration_seconds": 120,
  "slides": [
    {
      "slide_number": 1,
      "slide_title": "...",
      "narration": "A highly professional, data-driven narration script. Explicitly use monetary formats like R120 000 or R353 000 when discussing revenue figures, reference the specific regions and cities present in the dataset dynamically without inventing geographic fields, and call out visual trends.",
      "duration_seconds": 20
    }
  ]
}
Keep the narration completely professional, clean, and direct. No markdown, no conversational commentary outside the JSON structure."""
            },
            {
                "role": "user",
                "content": f"Generate analytical narration for this presentation:\n{json.dumps(slide_outline, indent=2)}"
            }
        ]
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```json"):
        raw = raw.replace("```json", "", 1)
    if raw.endswith("```"):
        raw = raw.rsplit("```", 1)[0]
    raw = raw.strip()

    script = json.loads(raw)
    print(f"[Abi Present] Script generated for {len(script['slides'])} slides.")

    audio_files = []
    full_script_text = ""

    for slide in script["slides"]:
        slide_num = slide["slide_number"]
        raw_narration = slide["narration"]

        spoken_narration = _convert_currency_to_words(raw_narration)

        full_script_text += f"\nSlide {slide_num} - {slide['slide_title']}:\n[Written]: {raw_narration}\n[Spoken]: {spoken_narration}\n"

        audio_path = os.path.join(output_dir, f"slide_{slide_num:02d}_{timestamp}.mp3")

        tts = gTTS(text=spoken_narration, lang='en', slow=False)
        tts.save(audio_path)

        audio_files.append({
            "slide_number": slide_num,
            "slide_title": slide["slide_title"],
            "narration": raw_narration,
            "spoken_narration": spoken_narration,
            "audio_file": audio_path
        })
        print(f"[Abi Present] Spoken audio tracking asset constructed: slide_{slide_num:02d}.mp3")

    script_path = os.path.join(output_dir, f"full_script_{timestamp}.txt")
    with open(script_path, "w") as f:
        f.write(f"PRESENTATION: {title}\n")
        f.write("="*50 + "\n")
        f.write(full_script_text)

    final_video_path = "Not Generated"
    slide_images = _convert_pptx_to_images(pptx_path, output_dir)

    if slide_images and len(slide_images) == len(audio_files):
        print("\n[Abi Present] Stitching video timeline tracking layers together...")
        try:
            video_clips = []
            for i, audio_meta in enumerate(audio_files):
                img_path = slide_images[i]
                aud_path = audio_meta["audio_file"]

                audio_clip = AudioFileClip(aud_path)
                slide_clip = ImageClip(img_path).with_duration(audio_clip.duration)
                video_segment = slide_clip.with_audio(audio_clip)

                video_clips.append(video_segment)

            final_video = concatenate_videoclips(video_clips, method="compose")
            final_video_path = os.path.join(output_dir, f"executive_presentation_{timestamp}.mp4")

            print(f"[Abi Present] Compiling core video assets now. Monitoring render timeline:")
            final_video.write_videofile(
                final_video_path,
                fps=24,
                codec="libx264",
                audio_codec="aac",
                logger='bar'
            )
            print(f"[Abi Present] Master Presentation Video Compiled successfully: {final_video_path}")
        except Exception as video_err:
            print(f"[Abi Present] Video render cycle bypassed. Issue: {video_err}")
    else:
        print(f"[Abi Present] Note: Video compilation phase deferred. Slides: {len(slide_images)}, Audio: {len(audio_files)}")

    return {
        "audio_files": audio_files,
        "script_path": script_path,
        "video_path": final_video_path,
        "total_slides": len(audio_files)
    }