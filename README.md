## Absher Connect 

Absher Connect introduces an AI-driven decision engine that analyzes user data and real-time context to deliver proactive Smart Suggestions inside the Absher ecosystem.

The system intelligently identifies the right action, for the right user, at the right moment — enhancing experience and reducing friction in government services.

Our AI engine evaluates multiple signals, including:
- Document importance & expiry windows
- User behavior patterns
- Real-time location (GPS)
- Context-aware triggers (e.g., approaching King Fahd Causeway)

During the hackathon, the model was enhanced with location-aware intelligence, enabling suggestions such as:

 **“You appear to be near King Fahd Causeway. You can complete customs or border payments now.”**


## System Architecture

Absher App → Backend APIs → AI Decision Engine → Smart Suggestions → App UI



## Repository Contents
This repository includes:
- The AI decision engine 
- Synthetic dataset and data generator
- MVP link
- Presentation and Demo links


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
```
If the user is not near the causeway, the contextual suggestion is simply not included.

---

## Presentation & Demo

**Presentation Slides**  
https://www.canva.com/design/DAG7MJ7qBus/ocUZIB2tKSvm7PIH3tWH9g/edit?utm_content=DAG7MJ7qBus&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton 

**Demo**  
https://www.youtube.com/shorts/bzwmg_x7nW8 

**MVP**  
(Short note here if you want)

---

## Integration Readiness

This AI module is already designed in a way that makes it ready for real integration inside the Absher ecosystem:

- Works through well-defined APIs  
- Fast enough for real-time use  
- Built using modular and scalable logic  
- Requires no changes to Absher backend architecture  
- Can begin operating instantly upon connecting to real Absher data  

The module is fully production-ready and suitable for direct deployment once real data access is enabled.

د}

