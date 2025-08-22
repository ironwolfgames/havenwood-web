# Havenwood Kingdoms - Game Design Document (GDD)

## 1. Overview
**Title:** Havenwood Kingdoms  
**Genre:** Cooperative, Turn-Based Strategy (board game-inspired, web-based)  
**Target Audience:** Ages 10–14 (accessible theme) with strategic depth appealing to older players.  
**Game Length:** Single-session, one-off games (~60–90 minutes).  
**Tone:** Whimsical fantasy, anthropomorphic creatures, cooperative survival.  

---

## 2. Core Gameplay Loop
1. **Plan Phase (Simultaneous):**  
   - Each player chooses their faction’s actions (2–5 minutes).  
2. **Resolution Phase:**  
   - Actions are resolved simultaneously.  
   - Resources are produced, spent, and global effects applied.  
3. **Event Phase:**  
   - Global/world events occur.  
   - Threats or opportunities are introduced.  
4. **Progress Check:**  
   - Shared project progress tracked.  
   - Failure conditions checked.  

---

## 3. Players & Factions
### Factions
1. **Meadow Moles (Provisioners)**  
   - **System:** Agriculture & Crafting.  
   - **Inputs:** Labor (action points), Infrastructure.  
   - **Outputs:** Food, Timber, Fiber.  
   - **Uses Elsewhere:**  
     - Food → sustains all factions (avoids penalties).  
     - Timber → needed by Badgers (fortifications) & Otters (bridges/infrastructure).  
     - Fiber → used by Otters (sails, ropes) & Scholars (ritual scrolls).  

2. **Oakshield Badgers (Guardians)**  
   - **System:** Defense & Stability.  
   - **Inputs:** Timber (from Moles), Food (upkeep).  
   - **Outputs:** Protection Tokens, Stability Tokens.  
   - **Uses Elsewhere:**  
     - Protection → defends shared project/resources from world events.  
     - Stability → boosts Scholar rituals & Otter engineering reliability.  

3. **Starling Scholars (Mystics/Researchers)**  
   - **System:** Knowledge & Magic.  
   - **Inputs:** Fiber (scrolls/records), Stability (from Badgers).  
   - **Outputs:** Magic Crystals, Insight Tokens.  
   - **Uses Elsewhere:**  
     - Magic Crystals → fuel rituals/projects.  
     - Insight → enhances efficiency of all factions (global multiplier on outputs).  

4. **River Otters (Explorers/Builders)**  
   - **System:** Expansion & Engineering.  
   - **Inputs:** Timber, Fiber, Magic Crystals.  
   - **Outputs:** Infrastructure Tokens, Project Progress Tokens.  
   - **Uses Elsewhere:**  
     - Infrastructure → improves other factions (e.g., farms, libraries, fortifications).  
     - Project Progress → direct contribution to winning condition (finishing shared project).  

---

## 4. Resource Web
- **Food:** Produced by Moles, consumed by all.  
- **Timber:** Produced by Moles, used by Badgers + Otters.  
- **Fiber:** Produced by Moles, used by Otters + Scholars.  
- **Protection:** Produced by Badgers, defends against events.  
- **Stability:** Produced by Badgers, boosts Scholars/Otters efficiency.  
- **Magic Crystals:** Produced by Scholars, used by Otters and Projects.  
- **Insight:** Produced by Scholars, boosts efficiency of all factions.  
- **Infrastructure:** Produced by Otters, boosts other factions.  
- **Project Progress:** Produced by Otters, advances shared project (win condition).  

---

## 5. Shared Projects
Players collaboratively choose **one major project** per session. Each has 3 stages, with unique requirements and flavor.  

Examples:  
1. **Sky Lantern of Eternal Dawn**  
   - Illuminate the land to hold back encroaching darkness.  
2. **Heartwood Tree Restoration**  
   - Revive the central life-giving tree.  
3. **Crystal Bridge Across the Chasm**  
   - Reconnect isolated kingdoms.  
4. **Moon Temple Ritual**  
   - Seal away corruption with a massive magical ritual.  
5. **Skyship Ark**  
   - Build an airship to evacuate the kingdoms.  

Each stage requires mixed resources, forcing collaboration.  

---

## 6. Failure Conditions
- If **Food runs out** → famine → efficiency loss and eventual collapse.  
- If **Protection is insufficient** → project/resources destroyed by events.  
- If **Stability is too low** → corruption or rebellion spreads.  
- If the **project is not completed** by the final turn → collective loss.  

---

## 7. Session Structure
- **Turns:** ~6–8 turns per session.  
- **Turn Time:** 2–5 minutes for player planning.  
- **Game End:** Win by completing shared project; lose by famine, collapse, destruction, or timeout.  

---

## 8. Solo & Multiplayer
- **Multiplayer:** 2–4 players, each controlling one faction.  
- **Solo:** Single player controls 1 faction with AI allies, or multiple factions.  

---

## 9. Action Selection System (Shared Mechanic)
- All factions use the same **action selection foundation** (e.g., limited action slots per turn).  
- Choices: **Gather, Convert, Invest, Defend, Build, Research.**  
- Each faction’s **unique mechanics** shape how these actions play out with their resources.  

---

## 10. Aesthetic & Presentation
- **Style:** Whimsical fantasy, storybook illustrations, friendly for 10–14 age group.  
- **Tone:** Cooperative, hopeful, strategic but non-violent.  
- **UI/UX:** Clear resource icons, faction dashboards, cooperative project tracker.  

---

## 11. Replayability Hooks
- Multiple shared projects to choose from.  
- Asymmetric faction systems with interdependent economies.  
- Randomized world events.  
- Optional difficulty levels.  

---

## 12. Next Steps (Implementation Plan Seeds)
1. **Prototype Phase:**  
   - Digital paper prototype of resource flows and action selection.  
   - Test balance of inputs/outputs.  
2. **Core Loop Implementation:**  
   - Develop simultaneous turns and resolution engine.  
   - Implement faction dashboards.  
3. **Expand Content:**  
   - Add shared projects, events, and resource art.  
   - Flesh out AI allies for solo play.  
4. **Polish:**  
   - Refine UI/UX, animations, and cooperative feedback tools.  

---
