# FlowState 🌊

### Autonomous Gig Economy Liquidity Co-Pilot & Section 44ADA Indian Tax Shield

FlowState is a secure, open-source micro-SaaS financial ledger designed specifically for independent consultants, gig workers, freelancers, and creators in the Indian digital economy. 

It acts as an invisible layer between incoming raw UPI/NEFT payouts and spent/checking balances—automatically routing tax liabilities, emergency buffers, and chronological priority EMIs instantly before they get mixed into personal coffee or shopping transactions.

---

## 🚀 Key Features

- **Pillar 1: Smart Auto-Routing with Priority Bill Filling**  
  Every deposit into your Virtual Bank Account is split. Pre-allocated tax reserves and emergency buffers are dynamically swept to locked vaults, and overdue EMIs or co-working rents are filled chronologically by due date.
- **Pillar 2: Section 44ADA Indian Tax Compliance Math**  
  Calculates presumptive taxes where only 50% of your gross receipts count as taxable income. Dynamically adjusts withholdings between 7.5% and 12.5% of gross incoming based on the ₹7,00,000 threshold to prevent interest penalties under Section 234B/C.
- **Pillar 3: Alternative Cashflow Consistency Score**  
  Ditch traditional salary slips. FlowState computes a dynamic, FICO-style credit worthiness score (300 to 900) by analyzing deposit frequency, client diversification, and vault lock retention discipline.
- **AI-Powered SMS/Narrative Parser**  
  Uses **Gemini 2.5/Flash** NLP models to automatically strip messy, unstructured UPI, IMPS, or NEFT bank narration strings into client names, categories, and payment channels.
- **Bank-Grade Sandbox Integration**  
  Simulated **Decentro BaaS** API connections to generate virtual accounts and test real-time credit-deposit webhooks safely.
- **Idempotency Safeguard**  
  Protects against double-sweep errors due to standard banking server retries.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion (`motion`), Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT) Auth, pure `bcryptjs`.
- **Database Fallback:** Fallback logic automatically switches to a local flat-file `db.json` store if a real MongoDB connection is absent, enabling effortless offline and sandboxed testing.

---

## 💻 Local Setup & Installation

Get FlowState running on your personal machine in less than 5 minutes:

### 1. Prerequisites
- Install **Node.js** (version 18 or above recommended).
- (Optional) Install **MongoDB** locally, or use a free cloud database like [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/flowstate.git
cd flowstate
```

### 3. Configure Environment Variables
Create a file named `.env` in the root of your project directory and configure the following variables:

```env
# Server Ingress Port (Default: 3000)
PORT=3000

# JSON Web Token Secret Key
JWT_SECRET=flowstate_jwt_super_secret_key_123

# (Optional) MongoDB Connection String - If empty, FlowState defaults to a local db.json
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/flowstate

# (Optional) Google Gemini API Key for transaction narrative parser
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# (Optional) Decentro Banking Sandbox Keys
DECENTRO_CLIENT_ID=mock_client_id_decentro_sandbox
DECENTRO_CLIENT_SECRET=mock_client_secret_decentro_sandbox
DECENTRO_MODULE_SECRET=mock_module_secret_decentro_sandbox
DECENTRO_PROVIDER_SECRET=mock_provider_secret_decentro_sandbox
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Application
- **To run in development mode (with Hot Reloading for backend + frontend):**
  ```bash
  npm run dev
  ```
  Open your web browser and navigate to `http://localhost:3000`.

- **To build and run in production mode:**
  ```bash
  npm run build
  ```
  This compiles the React assets into `dist/` and compiles the backend into `dist/server.cjs`. Start the production server using:
  ```bash
  npm run start
  ```

---

## ☁️ How to Host FlowState for Free

You can host FlowState globally at zero cost using several popular web deployment networks. Below are the best step-by-step methods:

---

### Method A: Unified Single-Platform Hosting (Recommended)
This is the easiest method. It hosts both your React frontend and Node/Express backend together as a single full-stack monolithic app on **Render** or **Railway**.

#### 1. Host on Render (Free Web Service)
Render offers a generous free tier for running dynamic web applications.

1. Create a free account at [Render.com](https://render.com) and link your GitHub repository.
2. Click **New** -> **Web Service**.
3. Choose your repository and set the following settings:
   - **Language:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** `Free`
4. Expand the **Environment** tab and add your variables:
   - `JWT_SECRET` (generate a safe random string)
   - `MONGODB_URI` (from MongoDB Atlas)
   - `GEMINI_API_KEY` (from Google AI Studio)
5. Click **Deploy Web Service**. Your app is live at `https://your-app-name.onrender.com`!

#### 2. Host on Railway (Free Trial Tier)
Railway is another ultra-fast platform to spin up full-stack Node applications.

1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Add your environment variables in the **Variables** tab.
4. Railway will automatically detect the `package.json` build/start scripts and deploy.

---

### Method B: Separate Frontend & Backend Hosting (Maximum Performance)
This method hosts your static frontend files closer to your users on **Vercel** (using a Global CDN) and delegates API requests to a server hosted on **Render**.

#### Part 1: Host the Backend on Render
1. Create a Render Web Service using the same steps as Method A.
2. Under the environment tab, ensure you add the appropriate Mongo connection strings.
3. This will act as your dedicated API server (e.g. `https://flowstate-api.onrender.com`).

#### Part 2: Host the Frontend on Vercel
1. Create a free hobby account on [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** and select your GitHub repository.
3. Configure the build parameters:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy. Vercel will host your static assets on their Global Edge Network for blistering loading speeds.

---

### Part 3: Free Database Hosting (MongoDB Atlas)
To store users, transactions, and wallets across restarts in production:

1. Register for a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database cluster and choose the **M0 Shared Free Tier** (located in AWS, GCP, or Azure).
3. Under Database Access, create a database user with read/write privileges.
4. Under Network Access, whitelist `0.0.0.0/30` to allow connections from Render or Railway.
5. Copy your connection URL:  
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/flowstate?retryWrites=true&w=majority`
6. Paste this value into your hosting environment variables under the `MONGODB_URI` key.

---

## 📜 Open Source Declaration

FlowState is an **open-source** software repository. We believe that independent workers should have full control and total auditing power over their accounting software. 

You are welcome to clone, fork, modify, self-host, and use this codebase for personal, educational, or commercial projects.

### Contributing
We highly encourage open-source contributions!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/CoolSplitMath`).
3. Commit your changes (`git commit -m 'Add awesome split math rule'`).
4. Push to the Branch (`git push origin feature/CoolSplitMath`).
5. Open a **Pull Request**.

---

### License
This project is licensed under the **Apache License 2.0** - see the LICENSE details for permissions, limitations, and liabilities. 

*Made with 💚 for the global freelance & gig community.*
