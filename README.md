# A Little Universe for You 🤍
## An Interactive Romantic Birthday Surprise Website for Mas

Created with heartfelt love, cosmic elegance, and poetic storytelling.

---

### ✨ Features
- **Celestial Night Sky**: Dynamic stars, sparkling constellations, and periodic shooting meteors (Canvas API).
- **Romantic Color Palette**: Midnight Navy (`#10172B`), Deep Blue (`#253452`), Champagne Gold (`#E9D9B8`), Soft Cream (`#F5EFE5`), and Dusty Rose (`#D9AAB7`).
- **Cinematic Experience**: 6 beautifully crafted sections:
  1. **The Secret Beginning**: Glowing crescent moon, mysterious fade-in intro, and "Open Your Little Surprise" CTA.
  2. **The Special Day**: Grand birthday reveal with champagne stardust, golden confetti, and glowing recipient name (*Mas 🤍*).
  3. **A Little Collection of You**: Polaroid gallery with realistic washi-tape/pins, floating tilt animations, handwritten captions, and lightbox modal.
  4. **A Letter for You**: Emotional centerpiece featuring an interactive 3D envelope with a wax seal that breaks and unfolds a vintage parchment letter.
  5. **My Wishes for You**: 6 floating cosmic constellation cards with heartfelt prayers and gentle scroll animations.
  6. **One Last Thing**: Poetic closing scene, glowing pulsing heart, and "Replay This Little Universe" button.
- **Resilient Audio System**: Built-in romantic piano music track (`assets/audio/birthday-music.mp3`) with an automated Web Audio API acoustic piano synthesizer fallback.
- **Mobile-First & Responsive**: Handcrafted for smartphones (iPhone & Android), tablets, and desktop displays.
- **Micro-Interactions**: Custom golden cursor glow, floating heart & sparkle emitters on touch/click, and accessible keyboard navigation.

---

### 📂 Project Structure
```
birthday-surprise/
├── index.html                  # Main website structure & text content
├── README.md                   # Project documentation & instructions
├── css/
│   └── style.css               # Styling, glassmorphism, animations & responsiveness
├── js/
│   └── script.js               # Canvas animations, envelope 3D interaction, audio engine
└── assets/
    ├── images/
    │   ├── photo-1.jpg         # Polaroid 1: Night walk together
    │   ├── photo-2.jpg         # Polaroid 2: Summit of Kerinci 3805 MDPL
    │   └── photo-3.jpg         # Polaroid 3: Sweet moments together
    ├── audio/
    │   ├── birthday-music.mp3  # Romantic background music
    │   └── birthday-music.wav  # High quality lossless audio fallback
    └── fonts/
```

---

### 💌 How to Customize
1. **Change Recipient Name or Date**:
   - Open `index.html` and search for `Mas 🤍` or `19 November 2026`.
2. **Swap Photos**:
   - Replace `photo-1.jpg`, `photo-2.jpg`, or `photo-3.jpg` in `assets/images/` with your favorite pictures.
   - Adjust captions inside `index.html` under `class="polaroid-caption"`.
3. **Change the Music**:
   - Simply drop your favorite romantic piano MP3 file into `assets/audio/birthday-music.mp3`.
4. **Edit the Letter**:
   - Find `<div class="letter-inner-content">` in `index.html` and modify the paragraphs.

---

### 💻 Running Locally
You can run and preview the website locally using Node.js:
```bash
npm start
# or: node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### 🚀 How to Host
You can host this static website completely for free on:
- **GitHub Pages** (Push to a repository and enable GitHub Pages in Settings)
- **Netlify** / **Vercel** (Drag and drop the `birthday-surprise` folder)
- **Firebase Hosting** or **Cloudflare Pages**
