# Pitch Presentation: CareSync

## Slide 1: Title Slide
**CareSync**
_Empowering Patients, Simplifying Care, Securing Data._
A privacy-first, offline-capable healthcare assistant that puts your medical journey in your pocket.

## Slide 2: The Problem
1. **Fragmented Records:** Patients and doctors are drowning in scattered paper lab reports and prescriptions that are hard to organize chronologically.
2. **Information Overload:** When reading full diagnostic summaries, doctors just want to see the key *Abnormal Values* and *Trends* at a glance.
3. **Medication Non-Adherence:** Missing doses drastically cuts treatment efficacy and causes serious complications.
4. **Mental Toll:** Chronic Illness creates anxiety that often goes unchecked between actual doctor visits.

## Slide 3: The CareSync Solution (What We Built)
We built a centralized digital healthcare ecosystem with four core, fully-integrated modules:
- 🗂️ **Centralized Digital Health Wallet:** Smart Storage of Reports (PDF/Image) using Supabase and a secure API structure.
- 🤖 **AI-Assisted Highlighting:** Instantly scans uploaded Lab Reports and auto-extracts Abnormal values for doctors using NLP processing rules.
- 💊 **Smart Medicine Adherence Dashboard:** Gamifies adherence with real-time UI Risk Analytics (<70% High Risk, >90% Good).
- 💬 **Mental Health Chatbot:** Conversational AI that interprets stress levels and provides immediate breathing exercises while intercepting crises safely.

## Slide 4: Real-Time Analytics & Risk Detection 
_(Show a screenshot or live demo of the Dashboard)_
- The App dynamically calculates **Adherence Percentage** = (Taken / Total Doses) × 100.
- Changes UI risk colors dynamically in real-time.
- Shows exactly which medicines are pending vs taken with a sleek UI.
- All powered by a custom JWT-authentication API ensuring patient privacy is 100% strictly enforced from the server.

## Slide 5: Technical Execution & Monetization
**Why we win the Hackathon:**
- Pure API-first architecture via *Next.js Serverless Route Handlers*.
- *PostgreSQL Row-level-security* explicitly managed so only the custom Auth framework can read or write documents. 
- *Dynamic Front-end Component design* via Vanilla React patterns.

**Monetization Strategy:**
- **B2B SaaS:** Premium Hospital Admin portals capable of analyzing Macro Trends across thousands of anonymized app users.
- **Ethical Advertising:** Space on the interface that guarantees NO targeting based on private health queries.

## Slide 6: The Vision
Today, we built a localized patient hub capable of extracting mock data. Tomorrow, we integrate **Gemini API** for limitless conversational therapy routing and **TensorFlow Lite** to migrate the Adherence Engine directly onto edge devices so it computes safely, completely offline.

_Try our demo locally running on Node.js and Supabase 
