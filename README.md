# Absher Connect – Proactive Smart Suggestions 

Absher Connect introduces an AI-driven decision engine that analyzes the user’s situation and identifies the perfect moment to display proactive Smart Suggestions inside the Absher ecosystem.

The intelligence combines multiple signals — document metadata, expiry windows, behavioral patterns, and real-time context — to produce highly personalized recommendations that improve user experience and reduce friction in government services.

This repository contains all source code, AI logic, demo scripts, and presentation material used for the Absher Hackathon.

---

## Project Overview

Instead of waiting for a user’s document to expire or expecting the user to search for information, Absher Connect monitors key signals and proactively recommends actions such as:

- Renewing important documents  
- Completing expiring services  
- Highlighting urgency and deadlines  
- Providing location-aware actions (e.g., near King Fahd Causeway)  

The idea is simple:

> **“Deliver the right suggestion, to the right user, at the right moment.”**

---

## AI Model (Unified Decision Engine)

Our AI model works as an integrated engine that processes multiple inputs and returns a single structured list of Smart Suggestions.

When a user opens the app:

1. The system receives the **user_id** and (optionally) their real-time **location (GPS)**.  
2. It fetches the user's documents through backend APIs (simulated during the hackathon).  
3. The AI model evaluates:
   - What documents matter most right now  
   - How soon each document will expire  
   - The user’s past behavior  
   - The user's physical context and movement  
4. Based on these combined signals, the AI engine determines:
   - Whether a suggestion should be shown  
   - What suggestion should be shown  
   - And when it should be shown  

This unified logic is what we refer to as the **AI Decision Engine** — a hybrid model that combines predictive intelligence with contextual awareness inside one cohesive module.

During the in-person hackathon phase, we enhanced the model with **location-aware intelligence**, allowing the system to recognize when the user is physically approaching King Fahd Causeway and offer a relevant proactive suggestion such as:

> **“You appear to be near King Fahd Causeway. You can complete customs or border payments now.”**

This enables a more natural and real-world intelligent behavior, extending the capabilities of Absher beyond document tracking.

---

## 🛡 Data Privacy

Because Absher data is highly sensitive, all development and experimentation were performed using a **synthetic dummy dataset** that simulates real-world scenarios without exposing or relying on actual user data.

---

## 🏗 System Architecture

Absher App
↓ (user_id + optional GPS)
Backend Service
↓ fetches user's document data
AI Decision Engine (this module)
↓ analyzes documents + context
Returns structured Smart Suggestions
App UI
↓ renders suggestions as interactive cards

yaml
Copy code

---

## Repository Structure

ai_model.py → AI Decision Engine (documents + context analysis)
generate_dataset.py → Synthetic dataset generator
/data/ → Synthetic training data
README.md → Project documentation
presentation.pdf → (link added below)
demo_video.mp4 → (link added below)

## Example Output

```json
{
  "suggestions": [
    {
      "type": "document",
      "document_type": "passport",
      "days_to_expiry": 5,
      "message": "passport expires in 5 days"
    },
    {
      "type": "context",
      "context_type": "near_causeway",
      "message": "You are near King Fahd Causeway. You can pay border/customs fees now."
    }
  ]
}
If the user is not near the causeway, the contextual suggestion is simply not included.

 Presentation & Demo
Presentation Slides:
 (Add your Google Slides link here)

Demo (MVP):
 (Add your drive/youtube link here)

 Integration Readiness
This AI module is already designed in a way that makes it ready for real integration inside the Absher ecosystem:
* Works through well-defined APIs

* Fast enough for real-time use

* Built using modular and scalable logic

* Requires no changes to Absher backend architecture

* Can begin operating instantly upon connecting to real Absher data

The module is fully production-ready and suitable for direct deployment once real data access is enabled.

