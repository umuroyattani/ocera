# 🤖 Ocera — AI Reddit Automation & Scheduler

![GitHub stars](https://img.shields.io/github/stars/umuroyattani/ocera?style=social)
![GitHub forks](https://img.shields.io/github/forks/umuroyattani/ocera?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/umuroyattani/ocera)
![MIT License](https://img.shields.io/github/license/umuroyattani/ocera)
![Issues](https://img.shields.io/github/issues/umuroyattani/ocera)

<p align="center">
  <img src="https://imgur.com/a/2QIM2je.png" width="200" alt="Ocera logo"/>
</p>

> *Post to multiple Reddit communities using AI — customized, compliant, and scheduled.*  
> Built for creators, marketers, and founders who post smart.

---

## 🌟 What Is Ocera?

*Ocera* is an AI-powered Reddit automation platform that helps you:

- 🧠 *Write once* and automatically tailor your post for multiple subreddits  
- 📬 *Post at scale* with intelligent scheduling and rate-limit safety  
- 🛡 *Comply* with subreddit rules using pre-post checks  
- 📍 *Get suggestions* for the best subs to post to  
- 📊 *Track post results* like karma and status in one dashboard

---

## ✨ Features

| Feature                    | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| 🔁 Multi-Subreddit Posting | Share one post to many communities without duplicate detection issues       |
| 🤖 GPT-4 Rewriting         | Automatically adapts tone, length, and format to subreddit culture          |
| 🧠 AI Subreddit Finder     | Suggests the best-fit subreddits for your content based on context          |
| 🚦 Rule Checker            | Detects common subreddit violations before posting                          |
| 📅 Smart Scheduler         | Spaced-out posting via Reddit API with delay queue to avoid spam triggers   |
| 📊 Analytics Dashboard     | Tracks success, karma, and post statuses across all targets                 |

---

## 🛠 Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | React + Tailwind            |
| Backend       | FastAPI / Node.js           |
| AI Layer      | OpenAI GPT-4 API            |
| Auth          | Reddit OAuth2               |
| Scheduler     | BullMQ / Celery             |
| Database      | PostgreSQL / Firebase       |
| Hosting       | Vercel + Railway            |

---

## 📦 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/umuroyattani/ocera.git
cd ocera

2. Install dependencies

Backend

cd backend
pip install -r requirements.txt

Frontend

cd ../frontend
npm install

3. Configure environment

Create .env files in both frontend/ and backend/ folders:

Frontend

REACT_APP_API_URL=http://localhost:8000

Backend

REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_SECRET=your_reddit_secret
REDDIT_REDIRECT_URI=http://localhost:3000/auth
OPENAI_API_KEY=your_openai_key
DATABASE_URL=your_database_url

4. Run Locally

Backend

uvicorn main:app --reload

Frontend

npm start


---

💡 Why Ocera?

Posting to Reddit at scale is hard:

Every subreddit has different rules, formats, and tone

Reddit doesn't support native post scheduling

Manual posting = time-consuming and error-prone


Ocera automates the boring parts so you can focus on ideas, strategy, and growth.


---

🧑‍💻 Ideal For

🔥 Creators and YouTubers

📈 Marketers & newsletter writers

🧠 Indie founders

🎯 Reddit power users & growth hackers



---

🛣 Roadmap

[ ] Chrome Extension

[ ] Auto-comment AI writer

[ ] Cross-posting from RSS

[ ] Subreddit performance scoring

[ ] Reddit DM automation



---

🧪 Contributing

We welcome contributions and ideas!

1. Fork the repo


2. Create your feature branch: git checkout -b feature/amazing-feature


3. Commit: git commit -m 'Add amazing feature'


4. Push: git push origin feature/amazing-feature


5. Open a pull request 🙌




---

🧠 Learn More

🌐 Website: https://ocera.top 

🐦 Twitter: @oceraapp

📬 Beta access: Waitlist Form 



---

📄 License

This project is licensed under the MIT License. See LICENSE for full terms.


---

> “Write once. Post everywhere. Let AI handle Reddit for you.”
— Ocera
