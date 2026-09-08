#!/usr/bin/env python3
"""
Generate crystal-clear neural German voice MP3 files for Deutsch-Minute dialogues using edge-tts.
"""

import asyncio
import os
import re
import sys
from pathlib import Path
import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent.parent / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

CURRICULUM_TS = Path(__file__).resolve().parent.parent / "src" / "data" / "curriculum.ts"

# Voice mappings for characters
VOICE_MAP = {
    # Sister (INFJ) - Min-jun / Mongonchimeg
    "sister_p": "de-DE-KatjaNeural",
    "sister_u": "de-DE-AmalaNeural",
    # Brother 1 (ISTP) - Saber / Tomoo
    "b1_p": "de-DE-KillianNeural",
    "b1_u": "de-DE-FlorianMultilingualNeural",
    # Brother 2 (ISFJ) - Tanjiro / Jijgee
    "b2_p": "de-DE-ConradNeural",
    "b2_u": "de-DE-FlorianMultilingualNeural",
}

def extract_audio_items():
    content = CURRICULUM_TS.read_text(encoding="utf-8")
    # Accurate regex targeting only top-level dialogue turns (ignores nested challenge choices)
    pattern = re.compile(
        r"id:\s*'([^']+)',\s*speaker:\s*'(user|partner)',\s*textDe:\s*'([^']+)',[\s\S]*?audioKey:\s*'([^']+)'"
    )
    matches = pattern.findall(content)
    items = []
    for turn_id, speaker, text_de, audio_key in matches:
        clean_text = text_de

        # Replace dynamic template variables for audio synthesis
        if "sister" in audio_key:
            clean_text = clean_text.replace("{userName}", "Mongonchimeg").replace("{partnerName}", "Min-jun")
        elif "b1" in audio_key:
            clean_text = clean_text.replace("{userName}", "Tomoo").replace("{partnerName}", "Saber")
        elif "b2" in audio_key:
            clean_text = clean_text.replace("{userName}", "Jijgee").replace("{partnerName}", "Tanjiro")

        # Determine voice
        voice = "de-DE-FlorianMultilingualNeural"
        for key_prefix, v in VOICE_MAP.items():
            if key_prefix in audio_key:
                voice = v
                break
        items.append((audio_key, clean_text, voice))
    return items

async def generate_single_audio(audio_key: str, text: str, voice: str, force: bool = False):
    out_file = AUDIO_DIR / f"{audio_key}.mp3"
    if not force and out_file.exists() and out_file.stat().st_size > 500:
        return f"[SKIP] {audio_key}.mp3 exists"
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(out_file))
    return f"[DONE] {audio_key}.mp3: \"{text}\" ({voice})"

async def main():
    force = "--force" in sys.argv
    items = extract_audio_items()
    print(f"Found {len(items)} audio items (force={force})...")
    
    # Run in batches of 10 to be respectful to API and ensure reliable completion
    batch_size = 10
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        tasks = [generate_single_audio(key, text, voice, force=force) for key, text, voice in batch]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for r in results:
            print(r)
    print(f"All audio files processed in {AUDIO_DIR}")

if __name__ == "__main__":
    asyncio.run(main())

