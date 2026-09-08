# Deutsch Minute (A1.1 Squad) 🇩🇪 🇲🇳

> **Täglich exakt 1 Minute Deutsch A1.1 lernen – Micro-Habits, MBTI-Personalisierung, mongolische Lautschrift (*Кирилл галиг дуудлага*) und 24h-Dopamin-Sperre für Teenager.**

---

## 1. Pädagogisch-Psychologisches Fundament

Teenager (13–14 Jahre) brechen Sprach-Apps meist nach wenigen Tagen ab, weil:
1. Die **Aktivierungsenergie** zu hoch ist (15–30 Minuten fühlen sich nach Schule und Zwang an).
2. **Kognitive Überlastung** durch isolierte Vokabellisten ohne dialogischen Kontext entsteht.
3. Kein **Verknappungs-Reiz** existiert (man kann theoretisch unendlich weiterklicken, was nach 3 Tagen zu mentaler Ermüdung führt).

### Die psychologischen Gegenmaßnahmen in *Deutsch Minute*:
- **Die 60-Sekunden-Regel (BJ Fogg / James Clear):** Die Hürde ist buchstäblich 0. 1 Minute hat jeder Teenager täglich Zeit – selbst im Bus oder zwischen zwei Gaming-Runden.
- **Künstliche 24h-Sperre (Zeigarnik-Effekt & Scarcity):** Sobald die heutige Mission nach ~60 Sekunden gelöst ist, wird das Weiterspielen für 24 Stunden gesperrt. Das Gehirn schließt den Lernakt mit Neugier und Vorfreude ab: *„Schade, schon vorbei! Morgen will ich weitermachen.“*
- **Authentischer Dialog statt Vokabel-Drill:** Gelernt werden vollständige Chunks in echten Chat-Situationen.
- **Mongolische Lautschrift (*Кирилл галиг дуудлага*):** Neben dem deutschen Text und der mongolischen Übersetzung sieht das Kind die Aussprache in vertrauten kyrillischen Lauten (z.B. *[Халло! Ви гэет эс диа?]*), was die phonetische Hemmschwelle drastisch senkt.
- **Kristallklare Neural Voices:** Echte menschliche Aussprache über Microsoft Neural Voices (`edge-tts`), kein blecherner Standard-Browser-Roboter.

---

## 2. Die 3 MBTI-Profile & Personalisierung

Alle 3 Geschwister lernen denselben A1.1-Kernwortschatz, aber das Thema, die Charaktere und das UI sind exakt auf ihre kognitiven Funktionen zugeschnitten:

| Profil | MBTI | Alter | Theme / Skin | Partner | Storyline & Motivation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Anu** | **INFJ** | 14 | 🌸 K-Drama & Cozy | Min-jun (Schulfreund) | Emotionale Gespräche, Empathie, K-Dramas, Musik & Träume |
| **Temuulen** | **ISTP** | 13 | ⚡ Cyber Gamer HUD | Saber (Squad Leader) | Mobile Legends, Ranked Matches, Taktik, High-Speed |
| **Batu** | **ISFJ** | 13 | 🛡️ Warm Anime / Shōnen | Tanjiro (Trainingspartner) | Demon Slayer Vibes, Teamgeist, Familie, gegenseitiger Schutz |

### 🚀 Die 3 personalisierten Direkt-Links:
Schicke jedem Geschwisterkind einfach seinen eigenen Direkt-Link:
- 🌸 **Anu:** `https://duushgu.github.io/deutsch-minute/?p=anu`
- ⚡ **Temuulen:** `https://duushgu.github.io/deutsch-minute/?p=temuulen`
- 🛡️ **Batu:** `https://duushgu.github.io/deutsch-minute/?p=batu`

*Beim ersten Öffnen fragt die App kurz nach dem Wunschnamen/Spitznamen und sperrt sich fest auf dieses Profil (keine verwirrende Profil-Auswahl auf dem Handy!). Auf dem Homescreen installiert sich die PWA mit dem persönlichen Namen (z.B. „Temuulen ⚡ Deutsch Minute“).*

---

## 3. A1.1 Curriculum-Phasen (60 Tage Masterplan)

- **Phase 1 (Tag 1–10, aktiv):** Begrüßung, Name, Befinden, Herkunft (Mongolei), Wohnort (Ulaanbaatar), Sprachen, Alter (13/14), Hobbys, Geschwister, Phase-1-Boss.
- **Phase 2 (Tag 11–20):** Mein Alltag & Schule (Wann stehen wir auf? Lieblingsfächer).
- **Phase 3 (Tag 21–30):** Zahlen, Telefonnummern & Squad-Treffen.
- **Phase 4 (Tag 31–40):** Uhrzeit, Wochentage & Termine („Wann startet das Match / die Serie?“).
- **Phase 5 (Tag 41–50):** Essen, Trinken & Energy (Pizza, Ramen, Wasser, Durst/Hunger).
- **Phase 6 (Tag 51–60):** Zimmer, Handy & Das große A1.1 Meisterschafts-Turnier.

---

## 4. Zero-UI Silent Sync (Keine Passwörter, keine Codes)

13–14-Jährige wollen keine E-Mail-Bestätigungen, Passwörter oder kryptische Codes:
1. **Automatischer Hintergrund-Sync:** Fortschritt wird lokal und im Hintergrund gesichert. Die Kinder sehen nur ein beruhigendes `☁️ Sync`-Symbol.
2. **Familien-Squad Übersicht:** Im Tab **Squad** sehen alle drei, wer heute schon seine 1-Minute erledigt hat. Wenn alle 3 fertig sind, leuchtet der **⚡ 3/3 TRIPLE COMBO BONUS** auf!
3. **Admin Schnelltest-Modus:** Der große Bruder kann in den Einstellungen den 24h-Lockout per Schalter ausschalten, um beliebige Tage sofort zu testen.

---

## 5. PWA-Installation auf Android Handys

1. Den personalisierten Link (z.B. `?p=temuulen`) im mobilen **Google Chrome** öffnen.
2. Auf das Drei-Punkte-Menü ⋮ tippen.
3. Auf **„Zum Startbildschirm hinzufügen“** (oder *„App installieren“*) tippen.
4. Fertig! Die App startet im Vollbildmodus ohne Browserleiste wie eine native Android-App und funktioniert dank Service Worker auch offline.

---

## 6. Lokale Entwicklung & Audio-Generierung

```bash
# Abhängigkeiten installieren
npm install

# Lokaler Dev-Server
npm run dev

# Neue Audio-Dateien mit Edge-TTS generieren (benötigt uv / Python)
uv run --with edge-tts python scripts/generate_audio.py

# Produktions-Build testen
npm run build
```
