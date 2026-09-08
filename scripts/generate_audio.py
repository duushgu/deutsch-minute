#!/usr/bin/env python3
"""
Generate crystal-clear neural German voice MP3 files for Deutsch-Minute dialogues using edge-tts.
"""

import asyncio
import os
import re
from pathlib import Path
import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent.parent / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# Parse curriculum from TypeScript file
CURRICULUM_TS = Path(__file__).resolve().parent.parent / "src" / "data" / "curriculum.ts"

# Voice mappings for characters
VOICE_MAP = {
    # Sister (INFJ) - Min-jun / Anu
    "sister_p": "de-DE-KatjaNeural",
    "sister_u": "de-DE-AmalaNeural",
    # Brother 1 (ISTP) - Saber / Temuulen
    "b1_p": "de-DE-KillianNeural",
    "b1_u": "de-DE-FlorianMultilingualNeural",
    # Brother 2 (ISFJ) - Tanjiro / Batu
    "b2_p": "de-DE-ConradNeural",
    "b2_u": "de-DE-FlorianMultilingualNeural",
}

def extract_audio_items():
    content = CURRICULUM_TS.read_text(encoding="utf-8")
    # Match textDe and audioKey pairs
    # { ... textDe: '...', ... audioKey: '...' }
    pattern = re.compile(r"textDe:\s*'([^']+)',[\s\S]*?audioKey:\s*'([^']+)'", re.MULTILINE)
    matches = pattern.findall(content)
    items = []
    for text_de, audio_key in matches:
        # Determine voice
        voice = "de-DE-FlorianMultilingualNeural"
        for key_prefix, v in VOICE_MAP.items():
            if key_prefix in audio_key:
                voice = v
                break
        items.append((audio_key, text_de, voice))
    return items

async def generate_single_audio(audio_key: str, text: str, voice: str):
    out_file = AUDIO_DIR / f"{audio_key}.mp3"
    if out_file.exists() and out_file.stat().st_size > 500:
        return f"[SKIP] {audio_key}.mp3 exists"
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(out_file))
    return f"[DONE] {audio_key}.mp3 ({voice})"

async def main():
    items = extract_audio_items()
    print(f"Found {len(items)} audio items to generate...")
    tasks = [generate_single_audio(key, text, voice) for key, text, voice in items]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for r in results:
        print(r)
    print(f"All audio files processed in {AUDIO_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
