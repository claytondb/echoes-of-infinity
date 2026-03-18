# Echoes of Infinity — Multiverse MMO
## Product Requirements Document

**Version:** 0.2
**Date:** March 18, 2026
**Status:** Draft

---

## 1. Vision

Echoes of Infinity is a 2D multiplayer online game about exploration, creation, and self-conquest across an infinite web of parallel universes. Every player is one soul fragmented across countless realities. By traveling between branches of the multiverse, hunting down alternate versions of yourself, and absorbing their power, you grow from a newcomer into a multiversal builder and explorer — shaping worlds, crafting civilizations, and pushing ever deeper into the unknown.

There is no final boss. There is no "winning." The multiverse is infinite, and there is always a version of you out there that's stronger, stranger, and further along. The joy is in the journey — the worlds you build, the Echoes you overcome, and the players you meet along the way.

### 1.1 Visual Identity

The visual style is a 2D sidescroller with **Alto's Odyssey** as the primary aesthetic reference — simple geometry, but beautiful through color palettes, dynamic lighting, atmospheric particles, and time-of-day cycles. Each branch of the multiverse has its own color story and mood. A steampunk branch might be warm amber and copper; an ice-age branch might be deep blue with aurora lighting; a bioluminescent cavern branch might glow with teals and magentas.

The art is not pixel-art retro. It's clean, vector-influenced 2D with parallax scrolling backgrounds, volumetric light shafts, and weather systems. Think Terraria's gameplay depth married to Alto's visual serenity and Journey's sense of wonder. The world should feel like something you want to just stand in and look at.

**Key visual principles:**
- Color and light do the heavy lifting, not polygon count
- Every branch should feel like a different painting
- Sunsets, storms, auroras, and fog are gameplay-adjacent — they make exploration feel rewarding even before you find anything
- Player creations should look good by default (generous material palettes, auto-lighting on structures)

---

## 2. Core Concept

### 2.1 The Multiverse

The multiverse is a tree structure. At its root is **The Nexus** — a utopian hub world that acts as a social space, marketplace, and gateway to all branches. Every branch is a distinct procedurally generated world with its own biomes, resources, difficulty, and visual identity (e.g., a steampunk branch bathed in amber light, an ice-age branch with aurora skies, a bioluminescent underground branch).

When a new player joins, a new branch is created — their **Origin Branch**. This is their home reality, seeded from their account and shaped by choices made during character creation. It's a personal sandbox — a world that belongs to the player, where they can build freely, experiment, and return to between expeditions. Origin Branches start with moderate resources and room to grow.

### 2.2 The Fragmented Self

Every player has **Echoes** — AI-controlled alternate versions of themselves scattered across wild branches of the multiverse. Echoes aren't clones. Each one has a different build, different gear, different abilities — they represent the person you *could have been* in that reality. Some are weaker than you. Some are far, far stronger. Echoes exist only on their own branches and do not interact with each other.

When you defeat an Echo of yourself, you absorb a portion of their stats, abilities, and resources. This is the core progression loop: hunt yourself across realities to grow stronger, then bring that power back to build and create.

### 2.3 The Snowball

Absorption follows a curve. Each Echo you defeat makes the next one slightly easier — but the remaining Echoes also grow proportionally stronger in response (the power that was "distributed" among N versions is now distributed among N-1). This creates a natural difficulty ramp: early Echoes are relatively easy pickings, but as you progress, each one is a meaningful challenge.

The multiverse is infinite. There is no absorbing "all" your Echoes. There is always a branch further out with a version of you that's stronger. The goal is not completion — it's progression through an endless frontier.

### 2.4 The Three Pillars

The game rests on three interlocking pillars:

1. **Hunt** — Travel to branches, find your Echoes, defeat them, absorb their power. This is the progression engine.
2. **Build** — Use absorbed resources and abilities to construct, terraform, and decorate. Your Origin Branch is your canvas, but you can build on any branch you've claimed. Building is freeform and creative — think Minecraft Creative Mode with the aesthetic sensibility of Monument Valley.
3. **Explore** — Every branch is a unique sandbox world with its own landscape, resources, secrets, and atmosphere. Exploration is its own reward — the game is designed so that simply wandering a new branch feels good because of the visual beauty and environmental storytelling.

---

## 3. Player Experience

### 3.1 First Hour

1. **Character Creation** — The player picks a name, visual appearance, and makes a series of choices (build or explore? settle or wander? fight or befriend?). These choices seed the generation of their Origin Branch and determine the initial trait distribution across their Echoes.
2. **Origin Branch** — The player spawns in their home reality. A brief guided sequence teaches movement, building, crafting, and portal mechanics. The world is beautiful — the player's first instinct should be to walk around and take in the scenery.
3. **First Build** — The player constructs a simple shelter or landmark on their Origin Branch, learning the building system. This establishes their home as *theirs*.
4. **First Portal** — The player discovers a rift that leads to a nearby wild branch. Here they encounter their first Echo — a version of themselves roughly at their power level. Defeating it triggers the first absorption and the player feels the immediate power bump.
5. **The Nexus** — After the first absorption, a portal to the Nexus opens. The player arrives in the hub world, sees other players, and gains access to the Branch Map.

### 3.2 Ongoing Loop

- **Scout** — Use the Branch Map to survey available branches. Each branch displays a danger rating, biome type, known Echo locations, resource availability, and a visual preview of its color palette and atmosphere.
- **Explore** — Travel to a branch. Wander. Discover its unique landscape, hidden areas, and resources. The branch is a sandbox — there's no timer, no urgency.
- **Hunt** — Locate your Echo on the branch. Assess it. If it's too strong, retreat and come back later or find a weaker branch. If it's beatable, engage.
- **Absorb** — Defeat the Echo and absorb its power. Your stats shift, you may gain a new ability, and you unlock new building capabilities.
- **Build** — Return to your Origin Branch (or any claimed branch) and use your new resources and abilities to create. Expand your builds, terraform the landscape, craft gear, and prepare for the next expedition.
- **Share** — Invite other players to visit your branches. Show off your creations. Trade resources and building materials.

### 3.3 Endgame (The Infinite Frontier)

There is no traditional endgame. The multiverse is infinite, and high-tier Echoes keep getting stronger the deeper you go. Instead, the "endgame" is the expanding frontier of what's possible:

- **Deeper Branches** — As your power grows, you unlock access to more exotic, more dangerous, and more visually spectacular branches. The further out you go, the stranger and more beautiful the worlds become.
- **Grander Builds** — High-level absorption unlocks advanced building tools: terraforming, weather control, lighting manipulation, dimensional architecture (structures that are bigger on the inside), and living materials (plants that grow, water that flows).
- **Branch Claiming** — Claim wild branches and develop them into persistent worlds. Build cities, gardens, monuments, whatever you want. Other players can visit.
- **Tier Milestones** — Echoes are organized into tiers (see 4.2). Defeating the strongest Echo in a tier is a significant milestone that unlocks new abilities, building tools, and branch access. These act as checkpoints in an otherwise endless progression.

---

## 4. Game Mechanics

### 4.1 Multiverse Structure

| Layer | Description | Persistence |
|---|---|---|
| **The Nexus** | Utopian hub. Social, trading, portals. Safe zone. | Permanent, server-authoritative |
| **Origin Branches** | One per player. Home sandbox. Full building freedom. | Persistent per player |
| **Wild Branches** | Procedurally generated. Varied biomes and difficulty. | Ephemeral or semi-persistent (see 7.2) |
| **Claimed Branches** | Wild branches claimed by a player or group. Developed and buildable. | Persistent, player-controlled |
| **Deep Branches** | High-tier. Exotic physics, rare resources, spectacular visuals. | Semi-persistent |

### 4.2 Echo System

**Echo Generation:**
- The multiverse generates an infinite stream of Echoes for each player, organized into **Tiers**. New Echoes are always available at the player's current frontier.
- Echoes are placed across branches based on biome compatibility and tier.
- Echoes are *not* static NPCs. They operate on a basic AI behavior tree: they explore their branch, gather resources, fight local enemies, and build. When a player enters their branch, the Echo reacts based on its personality variant (aggressive, defensive, evasive, etc.).
- Echoes exist only on their own branches. They do not interact with each other or with other players' Echoes.
- **Inactive player Echoes freeze.** If a player stops playing, their Echoes stop advancing. When the player returns, they pick up exactly where they left off.

**Echo Tiers (Major/Minor Versions):**

Echoes are organized into a tiered system, like software versioning — major and minor versions:

| Tier | Minor Echoes | Tier Boss Echo | Unlocks |
|---|---|---|---|
| **1.x** (Awakening) | 1.1, 1.2, 1.3 ... 1.9 | 1.0 Tier Boss | Basic building tools, Nexus access |
| **2.x** (Wanderer) | 2.1, 2.2, 2.3 ... 2.9 | 2.0 Tier Boss | Advanced crafting, branch claiming |
| **3.x** (Architect) | 3.1 ... 3.9 | 3.0 Tier Boss | Terraforming, weather control |
| **4.x** (Shaper) | 4.1 ... 4.9 | 4.0 Tier Boss | Dimensional architecture, Deep Branch access |
| **5.x+** (Beyond) | Continues infinitely | Increasingly powerful | Increasingly exotic tools and branch types |

- **Minor Echoes** (e.g., 2.3, 2.7) are standard encounters within a tier. Defeating them grants incremental stat boosts, abilities, and resources. They can be tackled in any order.
- **Tier Boss Echoes** (e.g., 2.0) are the strongest Echo in that tier — a major milestone fight. Defeating them is a checkpoint that unlocks the next tier's branches, abilities, and building tools. These are significant, memorable encounters.
- A player's **Version** is their current tier + how many minor Echoes they've absorbed in it (e.g., "Version 3.4" means they're in tier 3 and have absorbed 4 minor Echoes).
- Tiers continue infinitely. There is no cap. The further you go, the more exotic and challenging it gets — but also the more spectacular the rewards.

**Echo Scaling:**
- Within a tier, each successive minor Echo is moderately harder than the last.
- Tier Boss Echoes are a significant step up — the player should feel like they need to prepare.
- Cross-tier scaling is steeper. A Tier 3 player wandering into a Tier 5 branch will be outmatched and needs to retreat.

**Absorption Rewards:**
- **Stat Points** — Distributed based on the Echo's build. A tanky Echo gives HP and defense; a nimble Echo gives speed and crit.
- **Abilities** — Each Echo may have 1-2 unique abilities. Absorbing them gives the player access to those abilities (limited equip slots keep this balanced).
- **Building Unlocks** — Tier Boss Echoes unlock new categories of building tools and materials. Minor Echoes unlock specific items within those categories.
- **Memories** — Lore fragments that reveal the story of that Echo's life. Collecting all Memories from a tier unlocks cosmetics or bonus abilities.
- **Resonance** — A currency earned only through absorption. Spent at the Nexus on high-end crafting, portal upgrades, and rare building materials.

### 4.3 Combat

Combat is real-time, 2D sidescroller — fast, positioning-heavy, and skill-expressive.

**Core Combat:**
- Light attacks, heavy attacks, dodge-roll, block/parry
- Directional attacks (up, down, forward, back) with different properties
- Stamina system governs dodges, blocks, and heavy attacks
- No auto-targeting — aiming matters

**Ability System:**
- Players can equip up to 4 active abilities and 2 passive abilities at a time
- Abilities are drawn from the pool of absorbed Echoes
- Abilities have cooldowns and resource costs (mana, energy, or health depending on the ability's origin)
- Synergies between abilities encourage build diversity (e.g., a freeze ability + a shatter ability combo)

**Echo Combat Specifics:**
- Echoes fight using the same combat system as players
- Each Echo has a distinct AI personality: rushdown, zoner, counter-puncher, etc.
- Echoes can use abilities the player hasn't seen yet, adding discovery to combat
- Defeating an Echo in under a certain time grants bonus Resonance

### 4.4 Building and Creation

Building is a core pillar, not a side feature. The goal is to make creation feel as rewarding as combat.

**Building Basics:**
- Freeform block/tile placement on any branch the player owns (Origin Branch or Claimed Branches)
- Materials gathered from branches across the multiverse — each branch's unique resources produce visually distinct building materials
- No structural integrity simulation (creative freedom over realism) — players can build floating islands, impossible towers, etc.
- Generous material palettes with auto-lighting: structures look beautiful by default

**Building Progression (Tied to Echo Tiers):**

| Tier | Building Capabilities |
|---|---|
| 1.x | Basic blocks, furniture, lighting, simple landscaping |
| 2.x | Advanced materials (glass, metal, crystal), water features, vegetation planting |
| 3.x | Terraforming (reshape terrain, create lakes, raise mountains), weather control for your branches |
| 4.x | Dimensional architecture (rooms bigger on the inside, portals within structures, gravity-defiant spaces) |
| 5.x+ | Living architecture (structures that grow and evolve), branch-wide environmental sculpting |

**Creative Tools:**
- **Blueprint System** — Save and share building designs. Apply blueprints to quickly recreate structures on new branches.
- **Lighting Editor** — Adjust ambient lighting, place light sources, control time-of-day on owned branches. Since the game's beauty comes from light and color, giving players control over this is powerful.
- **Palette Extraction** — Visit a beautiful branch, "extract" its color palette, and apply it to your own builds.
- **Visitor Mode** — Other players can visit your branches as tourists. They can leave reactions (visual markers like glowing stars) but can't modify your builds.

### 4.5 Crafting and Resources

Each branch has a unique resource profile. Some resources are common across branches; others are branch-exclusive. This incentivizes exploration beyond just Echo hunting.

- **Basic Crafting** — Weapons, armor, tools, building materials. Workbench progression.
- **Portal Crafting** — Build and upgrade portals to specific branches. Higher-tier portals allow faster travel and access to deeper (more rewarding) branches.
- **Resonance Crafting** — High-tier crafting using Resonance. Unique weapons, dimensional tools, exotic building materials.
- **Aesthetic Crafting** — Dyes, textures, lighting fixtures, decorative elements. Resources from different branches produce different visual styles.

### 4.6 Branch Modifiers

Every branch has randomized modifiers that alter gameplay rules within it, adding variety and strategic considerations:

- **Temporal Flux** — Time moves at different speeds. Cooldowns may be faster or slower.
- **Gravity Shift** — Altered gravity changes movement and combat dynamics.
- **Resource Bloom / Drought** — Amplified or reduced resource spawning.
- **Chromatic Shift** — The branch's color palette changes over time, cycling through different moods and lighting.
- **Paradox Zone** — Abilities behave unpredictably. High risk, high reward.
- **Mirror Branch** — The branch's terrain is a mirrored version of another branch. Disorienting but navigable if you've visited the original.
- **Overgrown** — Lush vegetation everywhere. Resources are plentiful but harder to find. Building materials from these branches have a living, organic quality.

### 4.7 The Convergence (World Events)

Periodically, **Convergences** occur — multiversal events where the barriers between branches weaken.

- **Rift Storms** — Portals open randomly, pulling players into unexpected branches. Great for discovering new biomes and finding rare resources.
- **The Collapse** — A branch begins to fold in on itself. Players inside must cooperate to stabilize it by completing challenges and building stabilization structures. Successful stabilization yields massive rewards and permanently saves the branch.
- **The Bloom** — A wave of creative energy sweeps through the multiverse. Building costs are reduced, new temporary materials become available, and players are encouraged to build collaboratively on shared event branches. The best creations (voted on by players) earn permanent display in the Nexus.
- **Deep Rift** — A pathway opens to an unusually deep branch tier, letting players glimpse worlds far beyond their current level. They can explore but not fight — it's a preview of what's to come.

### 4.8 Social Mechanics

Players can see and interact with other players across the multiverse, but **cannot harm each other**. There is no PvP. The multiverse is cooperative and social.

- **Guilds** — Players can form Guilds to explore together. Guild members share discovery data, trade resources, and can build collaboratively on shared claimed branches.
- **Echo Scouting** — A player who discovers another player's Echo while exploring can mark its location and share that information (or sell it on the Nexus marketplace).
- **Branch Visiting** — Any player can visit another player's Origin Branch or Claimed Branches as a tourist. They can leave reactions but can't modify builds.
- **Cooperative Echo Hunts** — Players can team up to help each other fight Echoes. Only the Echo's owner gets the absorption, but helpers get resources and Resonance.
- **The Nexus Showcase** — A curated gallery in the Nexus displaying player creations, voted on by the community. Featured builders earn cosmetic titles and Nexus decorations.
- **Trade** — Players can trade resources, building materials, blueprints, and cosmetics at the Nexus marketplace.

---

## 5. Narrative

### 5.1 Setting

The multiverse was once a single unified reality — a utopia. An event called **The Fracture** shattered it into infinite branches. The Nexus is the last remnant of the original reality, maintained by an entity known as **The Architect** — whose motives are ambiguous. The Architect says the multiverse can be understood by those willing to travel deep enough — but what lies at the deepest branches, and whether the Fracture was an accident or a choice, remains unknown.

### 5.2 Lore Delivery

- **Memories** from absorbed Echoes tell fragmented stories of alternate lives — each one a window into who you could have been
- **Nexus Archives** — lore terminals in the hub world that unlock as the player progresses through tiers
- **Branch Artifacts** — hidden objects in branches that tell the history of that reality
- **The Architect's Messages** — cryptic, occasionally contradictory guidance that deepens the mystery of the Fracture
- **Deep Branch Whispers** — The further out you go, the stranger the lore gets. Deep branches contain fragments of something that might be a message, a warning, or a map

### 5.3 The Central Mystery

What caused the Fracture? What lies at the deepest layer of the multiverse? Is the Architect helping or hiding something? Players piece together fragments over hundreds of hours. The answers aren't delivered — they're discovered, branch by branch, Echo by Echo, and different players may reach different conclusions based on which Memories and Artifacts they've found.

---

## 6. Progression Systems

### 6.1 Version (Power Level)

A player's **Version** (e.g., "Version 3.4") is their primary progression indicator. The major number is their current tier; the minor number is how many Echoes they've absorbed within it. This is displayed on their profile, visible to other players, and used for branch access gating.

### 6.2 Constellation

Rather than a traditional skill tree, players have a **Constellation** — a visual web of absorbed abilities and stat bonuses that grows organically based on which Echoes they've absorbed. No two players have the same Constellation, because no two players absorb the same Echoes in the same order. The Constellation is visible on the player's profile and serves as a unique fingerprint of their journey.

### 6.3 Gear Tiers

| Tier | Source | Notes |
|---|---|---|
| Common | Basic crafting, branch loot | Functional, no special effects |
| Rare | Rare branch resources, Echo drops | 1 special property |
| Dimensional | Resonance crafting | 2-3 special properties, branch-specific bonuses |
| Exotic | Deep branch resources | Build-defining, unique effects |
| Paradox | Rare world event drops | Unpredictable effects, extremely powerful |

### 6.4 Building Progression

Building capabilities are gated by Echo Tier (see 4.2). This creates a natural motivation loop: hunt Echoes not just for combat power, but to unlock the next level of creative tools. A Tier 4 player can do things with their builds that a Tier 2 player can only dream of — and seeing those high-tier creations in the Nexus Showcase motivates progression.

### 6.5 Prestige / Reincarnation

At any point, a player can choose to **Reincarnate** — resetting their Version and redistributing their Echoes, but retaining cosmetics, lore progress, building unlocks, and a small permanent stat bonus. Each Reincarnation cycle grants a new starting "flavor" for their Echoes (different ability distributions, different personality types), encouraging different combat builds and exploration paths. Builds created before Reincarnation are preserved.

---

## 7. Technical Architecture (Scalability Focus)

### 7.1 Multiverse as Microservices

Each branch is an isolated game instance. This maps naturally to a microservices architecture:

- **Branch Servers** — Lightweight, stateless game servers that can be spun up and torn down on demand. Each branch runs on its own server instance (or shares one for low-traffic branches).
- **Nexus Server** — Persistent, higher-capacity server for the hub world. Handles social features, trading, guild management, and the Showcase.
- **Echo Service** — Dedicated service managing Echo state across all branches. Echoes don't need to run in real-time when no player is present — their state is simulated in bulk and materialized when a player enters the branch.
- **Portal Service** — Handles branch discovery, portal routing, and load balancing. When a player enters a branch, the Portal Service spins up (or assigns) a Branch Server.

### 7.2 Branch Lifecycle

Branches exist on a spectrum of persistence:

- **Hot** — Currently occupied by a player. Fully simulated, real-time.
- **Warm** — Recently visited. State is cached. Can be restored in seconds.
- **Cold** — Not visited in a long time. State is serialized to object storage. Restoration takes longer but is cheap to store.
- **Ephemeral** — Low-value wild branches that are generated on-the-fly and discarded after the player leaves (unless something interesting happened there).

This tiered approach allows millions of branches to "exist" without requiring millions of running servers.

### 7.3 Echo Simulation

Echoes don't run 24/7. Instead:

- When no player is nearby, Echo state is frozen. Echoes do not advance when their owner is offline — this ensures returning players pick up where they left off.
- When a player enters a branch, the Echo's state is materialized and a real AI agent takes over for live interaction.
- Active players' Echoes on unvisited branches do receive periodic simulation ticks (lightweight state updates) to keep their difficulty curve consistent with the player's current tier.
- This approach allows millions of Echoes to exist with minimal compute cost.

### 7.4 Procedural Generation Pipeline

Branches are generated deterministically from a seed. The seed is derived from a combination of global parameters and player-specific data. This means:

- Any branch can be regenerated from its seed — no need to store full world data for cold branches.
- Two players entering the same branch see the same world.
- Generation happens on the Branch Server at load time, with heavy caching for frequently visited branches.

**Generation layers:**
1. Terrain (heightmap, biomes, caves)
2. Resources (ore placement, plant distribution)
3. Structures (ruins, dungeons, settlements)
4. Entities (NPCs, enemies, Echoes)
5. Modifiers (branch-specific rule changes)

### 7.5 Networking Model

- **Branch gameplay** — Authoritative server, client prediction, rollback netcode for combat. Branches support up to 16 concurrent players.
- **Nexus** — Zoned architecture. The Nexus is divided into zones, each handled by a separate server process. Players see nearby players; distant players are culled.
- **Cross-branch communication** — Event bus (e.g., NATS or Kafka) for propagating state changes (Echo deaths, power redistribution, world events) across the system.

### 7.6 Data Storage

| Data Type | Storage | Rationale |
|---|---|---|
| Player profiles | Relational DB (PostgreSQL) | Structured, queryable, transactional |
| Echo state | Document store (MongoDB or DynamoDB) | Flexible schema, high write throughput |
| Branch seeds + metadata | Key-value store (Redis) | Fast lookup, small payloads |
| Branch world state (warm) | In-memory cache (Redis) | Fast restore |
| Branch world state (cold) | Object storage (S3) | Cheap, durable |
| Chat / social | Dedicated chat service | Decoupled from game state |
| Showcase / rankings | Redis sorted sets | Community voting, tier rankings |
| Build state (claimed branches) | Object storage (S3) + cache | Player builds persist cheaply, loaded on visit |

### 7.7 Scaling Strategy

- **Horizontal scaling** — Branch Servers are stateless and scale horizontally behind a load balancer. Spin up more during peak hours, scale down during off-peak.
- **Auto-scaling triggers** — Player count, branch creation rate, queue depth on the Portal Service.
- **Geographic distribution** — Deploy Branch Servers in multiple regions. The Portal Service routes players to the nearest available server. The Nexus has regional instances that sync periodically.
- **Cost management** — Ephemeral branches use spot instances. Cold storage for inactive branches. Echo simulation batches run during off-peak hours.

---

## 8. Monetization (Non-Pay-to-Win)

All monetization is cosmetic or convenience-based. No gameplay power is sold.

- **Cosmetic Skins** — Character skins, weapon skins, portal effects.
- **Building Packs** — Cosmetic building material themes (e.g., "Celestial Pack" with star-themed blocks and light fixtures). These are visual variants of existing materials, not gameplay advantages.
- **Nexus Housing** — Decorative personal spaces in the Nexus hub.
- **Seasonal Pass** — Themed cosmetic tracks tied to seasonal Convergence events. Includes skins, building materials, and branch decorations.
- **Reincarnation Themes** — Unique visual themes for Reincarnation cycles (purely cosmetic auras, trails, etc.).
- **Origin Branch Skyboxes** — Custom sky and lighting presets for your home branch.

---

## 9. Player Safety and Fairness

- **No PvP** — Players cannot harm each other. Period. The multiverse is a cooperative space.
- **Echo Ownership** — You can only absorb *your own* Echoes. You cannot interact with another player's Echo in any harmful way.
- **Build Protection** — Only the owner of a branch can modify structures on it. Visitors are tourists, not vandals.
- **Escape Mechanics** — Players can always emergency-portal out of a branch if overwhelmed by an Echo (with a cooldown to prevent abuse).
- **Echo Scouting** — Before entering a branch, players can see the tier of any Echoes present, preventing blind walks into impossible fights.
- **Report and Block** — Standard social safety tools for chat and interactions in the Nexus.

---

## 10. Platform and Tech Stack

| Component | Technology |
|---|---|
| Client | Godot 4 (2D) or custom engine with SDL2 |
| Server (Branch) | Rust or Go for performance |
| Server (Nexus) | Rust or Go |
| Echo AI | Behavior trees, lightweight ML for personality |
| Networking | WebSocket + UDP (ENet or custom) |
| Database | PostgreSQL + Redis + S3 |
| Message Bus | NATS or Kafka |
| Infrastructure | Kubernetes on AWS/GCP with auto-scaling |
| CI/CD | GitHub Actions + ArgoCD |
| Monitoring | Prometheus + Grafana |

---

## 11. MVP Scope (Phase 1)

The MVP focuses on proving all three pillars are fun: Hunt, Build, Explore.

1. **Character creation** with basic choice-based Echo seeding
2. **One Origin Branch** per player with beautiful procedural terrain (Alto's Odyssey visual target)
3. **5 wild branch templates** with procedural variation and distinct color palettes
4. **Echo system** — Tier 1 (10 minor Echoes + 1 Tier Boss), basic AI, absorption mechanic with tier progression
5. **Combat** — Core moveset (light, heavy, dodge, 2 ability slots)
6. **Building** — Tier 1 building tools: basic blocks, furniture, lighting. Freeform placement on Origin Branch.
7. **The Nexus** — Basic hub with portals, simple marketplace
8. **Branch Map** — List of available branches with danger ratings and visual previews
9. **Multiplayer** — See other players in the Nexus. Visit each other's Origin Branches. Basic chat.
10. **Single server** — No geographic distribution yet
11. **No monetization** — Focus on gameplay validation

### MVP Success Metrics

- Average session length > 30 minutes
- Day-7 retention > 25%
- "One more branch" loop engagement (players visiting 3+ branches per session)
- Combat satisfaction survey score > 7/10
- Building engagement: >60% of players build something on their Origin Branch in their first session
- "Beauty" feedback: qualitative surveys confirm the visual style resonates

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Late joiners feel behind | Medium | High | Infinite progression means nobody's "done" — late joiners aren't competing, they're on their own journey. Reincarnation and tier system prevent power gaps from mattering socially. |
| Echo AI feels repetitive | Medium | High | Diverse personality types, progressive AI complexity, tier-specific combat behaviors, player choices influence Echo behavior |
| Branch generation feels samey | Medium | Medium | Large modifier pool, distinct color palettes per branch, seasonal content updates, community voting on favorite branch types |
| Building tools aren't compelling enough | Medium | High | Invest heavily in building UX. Study Minecraft, Terraria, and Dreams. Building should feel effortless and produce beautiful results. |
| Server costs spiral | Medium | High | Aggressive branch lifecycle management, ephemeral branches, spot instances, frozen inactive Echoes |
| Visual target (Alto's Odyssey quality) too ambitious for 2D indie | Medium | Medium | Invest in a strong art director early. Use procedural color/lighting rather than hand-painted assets. Shader-driven beauty scales better than asset-driven beauty. |
| Player isolation (not enough people per branch) | Medium | Medium | Convergence events, Nexus as social hub, cooperative Echo hunts, branch visiting, Showcase to create social gravity |

---

## 13. Open Questions

1. How large should branches be? Terraria-sized worlds or smaller, more focused zones?
2. Should building materials degrade over time on unclaimed branches (encouraging players to claim branches they want to keep)?
3. What's the ideal number of minor Echoes per tier? 10 feels right but needs playtesting.
4. Should there be seasonal/rotating content in the Nexus Showcase, or is it a permanent hall of fame?
5. How do we handle the visual generation of Deep Branches? Do they get increasingly abstract/surreal, or stay grounded?
6. Should Guilds be able to co-own branches, or is branch ownership always individual?
7. What's the right balance between combat difficulty and building rewards at each tier?

---

*This is a living document. All sections are subject to revision as design and playtesting evolve.*
