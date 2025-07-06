# 🤖 Ocera - AI-Powered Reddit Marketing Platform

🌐 **Live at: https://ocera.top**

![GitHub stars](https://img.shields.io/github/stars/umuroyattani/reddit-ai-poster?style=social)
![GitHub forks](https://img.shields.io/github/forks/umuroyattani/reddit-ai-poster?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/umuro/reddit-ai-poster)
![MIT License](https://img.shields.io/github/license/umuroyattani/reddit-ai-poster)
![Issues](https://img.shields.io/github/issues/umuroyattani/reddit-ai-poster)

> *Post smarter, not harder.*  
> One post. Multiple subreddits. AI-customized. Auto-scheduled. Rule-compliant.

---

## 🌟 Overview

*Reddit Multi-Post AI Scheduler* is a productivity tool for Reddit power users, creators, and marketers. It allows you to:

- 📝 Compose one post
- 🧠 Automatically rewrite it using GPT-4 per subreddit
- 🧵 Post to multiple subs with a single click
- 🚦 Check for subreddit rule violations
- 🕐 Schedule posts safely to avoid spam detection

Built for creators who want to grow on Reddit without doing everything manually.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔁 Multi-Subreddit Posting | Publish to several subreddits with one post |
| 🤖 AI-Powered Rewriting | GPT-4 adapts your content per subreddit |
| 🔍 Rule Compliance Checks | Warns you about common subreddit-specific rule issues |
| 📅 Smart Post Scheduling | Avoids spam detection with staggered posting via Reddit API |
| 🧠 AI Subreddit Suggestions | Recommends best-fit subs for your post |
| 📊 Karma Tracker | See how your posts perform in one dashboard |

---

## 🎥 Demo

> Coming soon...  
> Until then, here's a sneak peek:  
> ![Demo](https://your-demo-gif-or-image-link.com)

---

## 🛠 Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | React + Tailwind            |
| Backend       | FastAPI / Node.js           |
| AI Layer      | OpenAI GPT-4 API            |
| Auth          | Reddit OAuth2               |
| Scheduler     | Celery / BullMQ             |
| Database      | PostgreSQL / Firebase       |
| Hosting       | Vercel + Railway / Render   |

---

## ⚙ Setup Instructions

### 📥 1. Clone the repo
```bash
git clone https://github.com/umuroyattani/reddit-ai-poster.git
cd reddit-ai-poster

📦 2. Install dependencies

# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install

🔐 3. Environment Variables

Create .env files in both frontend/ and backend/ folders:

Frontend

REACT_APP_API_URL=http://localhost:8000

Backend

REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_SECRET=your_reddit_secret
REDDIT_REDIRECT_URI=http://localhost:3000/auth
OPENAI_API_KEY=your_openai_key
DATABASE_URL=your_database_url

🚀 4. Run Locally

Backend:

uvicorn main:app --reload

Frontend:

npm start


---

📌 Why This Tool?

Reddit has 400M+ users but no smart way to post across subs at scale.
We built this to:

Eliminate repetitive content posting

Protect users from accidental rule breaks

Let creators focus on content strategy, not manual labor



---

🧑‍💻 Who It's For

🧠 Creators & YouTubers

📈 Reddit Marketers & Indie Hackers

📰 Newsletter Writers

🛠 Founders & Product Launchers



---

🔭 Roadmap

[ ] Chrome Extension

[ ] Voice-to-Post AI Assistant

[ ] Crossposting Queue

[ ] Auto-Generated Comments

[ ] Karma + Engagement Analytics



---

🤝 Contributing

We welcome community contributions!

1. Fork the repo


2. Create your feature branch: git checkout -b feature/amazing-feature


3. Commit changes: git commit -m 'Add new feature'


4. Push to branch: git push origin feature/amazing-feature


5. Open a pull request




---

🧠 Learn More / Get Involved

📫 DM @YourHandle on Twitter

🌐 Website: https://ocera.top

🧪 Request access: Beta waitlist form



---

📄 License

Licensed under the MIT License. See LICENSE for details.


---

> "Built to automate Reddit without breaking its soul."
Simplify your workflow. Supercharge your Reddit growth.



---

### ✅ To Finalize:
- Replace placeholders like your-username, yourprojectsite.com, and image links with your actual URLs.
- Upload a *demo GIF or screenshot* for the visual preview.
- You can also use [shields.io](https://shields.io/) for more custom badge styles.

Let me know if you'd like a **matching CONTRIBUTING.md*, **API documentation template, or **GitHub project board structure* next!