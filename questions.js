const QUESTIONS_CORE = [

  // comm: directness vs async processing. 0=face-to-face, 3=written/indirect.
  // Axis: immediate/in-person ←→ asynchronous/written
  {
    section: "Communication",
    q: "When you have something important to say, you prefer...",
    opts: [
      "Face to face. I want to see how they react",
      "A call. Real time but without the pressure of being in the room",
      "A message. I express myself better in writing",
      "Depends on what it is and who it's with"
    ],
    dim: "comm", w: [0, 1, 2, 1.5]
  },

  // conflict: approach-to-conflict when hurt, early/untested relationship. 0=confronts immediately, 3=withdraws.
  // Axis: head-on ←→ avoidant. Anchored to before you know the relationship can handle it.
  {
    section: "Conflict",
    q: "A friend you haven't had any conflict with yet says something that hurts you. Your first reaction...",
    opts: [
      "I say how I feel. I'd rather know early if we can handle this",
      "I wait until I've calmed down, then bring it up carefully",
      "I let it pass. I don't know yet if it's worth the risk",
      "I create some distance. It's hard to stay open when I'm not sure where I stand"
    ],
    dim: "conflict", w: [0, 1, 2, 3]
  },

  // conflict: conflict expression style in an established relationship. 0=direct, 3=keeps the peace.
  // Axis: direct confrontation ←→ conflict suppression. Anchored to someone you know well.
  {
    section: "Conflict",
    q: "You're in a disagreement with someone you know well. What does it look like from the outside?",
    opts: [
      "Direct and unfiltered. I say what I think, I don't soften it",
      "Firm but measured. I make my point clearly without making it personal",
      "Diplomatic. I look for the overlap between our positions rather than defending mine",
      "Quiet. Keeping the peace matters more to me than making my point"
    ],
    dim: "conflict", w: [0, 1, 2, 3]
  },

  // energy: social energy / introversion-extraversion. 0=socially driven, 3=solitary.
  // Axis: extrovert ←→ introvert (weekend preference)
  {
    section: "Social energy",
    q: "The perfect weekend looks like...",
    opts: [
      "Clear plans, activities with people",
      "A day out with a few friends, no strict agenda",
      "Home with one person or alone",
      "I'll see what I feel like when the time comes"
    ],
    dim: "energy", w: [0, 1, 3, 2]
  },

  // energy: social ease with strangers. 0=thrives in crowds, 3=avoids.
  // Axis: extrovert ←→ introvert (new people)
  {
    section: "Social energy",
    q: "At a big party with new people, you...",
    opts: [
      "Feel right at home, initiate conversations",
      "Connect with a few interesting people",
      "I gravitate toward the people I know. I'd rather have one real conversation than work the room",
      "I'd rather be somewhere quieter. I find other kinds of interaction more meaningful"
    ],
    dim: "energy", w: [0, 1, 2, 3]
  },

  // values: categorical — what someone optimises for in close relationships.
  // Type: exact. No axis — 4 qualitatively different orientations.
  // 0=Reliability, 1=Respect, 2=Growth, 3=Ease
  {
    section: "Values",
    q: "What matters most in a close relationship?",
    opts: [
      "Reliability. Showing up, especially when it's hard",
      "Respect. Giving each other space to be different people",
      "Growth. Pushing each other to be better",
      "Ease. Feeling good together without having to work at it"
    ],
    dim: "values"
  },

  // boundaries: limit-setting under social pressure. 0=self-sacrificing, 3=firm self-priority.
  // Axis: porous/self-sacrificing ←→ direct/self-protective
  {
    section: "Boundaries",
    q: "A friend asks a big favor at the worst moment for you. You...",
    opts: [
      "Help. That's what friends do",
      "Explain your situation and figure it out together",
      "Say not now, but offer an alternative",
      "Decline. I need to put myself first sometimes"
    ],
    dim: "boundaries", w: [0, 1, 2, 3]
  },

  // rhythm: contact frequency preference. 0=frequent/regular, 3=loose/gap-tolerant.
  // Axis: high contact ←→ organic/low contact
  {
    section: "Rhythm",
    q: "How do you prefer to maintain close relationships?",
    opts: [
      "Regular contact. A quick message, a weekly call, something to keep the thread alive",
      "Fewer, longer catch-ups. I'd rather have one real conversation than ten check-ins",
      "Organic. We reach out when something comes up or we feel like it, no schedule needed",
      "I trust the connection to survive the gaps. We don't need regular contact to stay close"
    ],
    dim: "rhythm", w: [0, 1, 2, 3]
  },

  // rhythm: response to imbalance in who initiates. 0=unbothered, 3=reads it as signal of distance.
  // Axis: high contact / reciprocity-insensitive ←→ gap-tolerant / reciprocity-sensitive
  {
    section: "Rhythm",
    q: "You notice you're always the one reaching out first. You...",
    opts: [
      "Don't mind. I'd rather keep the connection alive than wait",
      "Mention it at some point. I want it to feel mutual",
      "Let it fade. If someone wants to be in my life, they'll show it",
      "Reflect on whether the friendship is actually as close as I thought"
    ],
    dim: "rhythm", w: [0, 1, 2, 3]
  },

  // empathy: support style when someone is in distress. 0=emotionally present, 3=shares experience (deflects to self — slightly off-axis, hence w=3 not ideal but closest).
  // Axis: emotional attunement ←→ practical/solution-oriented
  {
    section: "Empathy",
    q: "Someone tells you they have a serious problem. You...",
    opts: [
      "Listen without interrupting, try to understand how they feel",
      "Ask what they need. Emotional support or solutions?",
      "Try to find practical solutions right away",
      "Share a similar experience so they know they're not alone"
    ],
    dim: "empathy", w: [0, 1, 2, 3]
  },

  // empathy: proactiveness in noticing others' distress. 0=names it directly, 2=waits.
  // Axis: proactive attunement ←→ passive/waits to be invited
  {
    section: "Empathy",
    q: "You sense a close friend is struggling but they haven't said anything. You...",
    opts: [
      "Name it directly. 'You seem off lately, is everything okay?'",
      "Create an opening without pushing. Make yourself available and let them come to you",
      "Wait. If they want to talk, they'll bring it up when they're ready"
    ],
    dim: "empathy", w: [0, 1, 2]
  },

  // auth: openness / self-disclosure speed. 0=open immediately, 3=variable (context-dependent).
  // Axis: open/transparent ←→ guarded/slow to reveal
  {
    section: "Authenticity",
    q: "Think of someone you've only known a few months. How much do they actually know about you?",
    opts: [
      "Quite a lot. I don't really have a public mode, what you see is what you get",
      "The important stuff, but not everything. I open up gradually",
      "Not much. Trust is something I build slowly",
      "It varies wildly. Sometimes there's an instant click, sometimes years pass and I'm still guarded"
    ],
    dim: "auth", w: [0, 1, 3, 2]
  },

  // auth: self-consistency across social contexts. 0=same in all contexts, 2=adapts significantly.
  // Axis: consistent self ←→ context-adaptive self
  {
    section: "Authenticity",
    q: "How much do you adapt who you are depending on the company?",
    opts: [
      "Not much. I'm pretty much the same person in every context",
      "I adjust my tone and energy but not what I actually think or believe",
      "A lot. Different people bring out genuinely different sides of me"
    ],
    dim: "auth", w: [0, 1, 2]
  },

  // depth: appetite for conceptual/emotional depth in conversation. 0=abstract/philosophical, 3=practical/present.
  // Axis: conceptual/reflective ←→ practical/grounded
  {
    section: "Depth",
    q: "The conversations you remember, the ones that stay with you, tend to be about...",
    opts: [
      "Big questions. Mortality, meaning, how the world works, what we believe",
      "People. Unpicking someone's psychology, relationships, why things happened the way they did",
      "Things. A project, a problem, something real we were figuring out together",
      "Honestly, it's the quality of presence more than the topic. The best ones are just fully alive"
    ],
    dim: "depth", w: [0, 1, 3, 1.5]
  },

  // humor: comedic register. Type: overlap (pick up to 2).
  // No axis — categorical matching. Absurd/dry/playful/dark/physical.
  {
    section: "Humour",
    q: "Your humour is mostly... Pick up to 2.",
    opts: [
      "Absurd and surreal. Non-sequiturs, weird logic, jokes that need a very specific receiver",
      "Dry and ironic. Deadpan, subtext, you have to be paying attention",
      "Playful and teasing. I joke about people as much as myself, all in good fun",
      "Dark or taboo. I find the uncomfortable things funny",
      "Physical and reactive. Impressions, faces, timing — more body than words"
    ],
    dim: "humor", multiSelect: 2
  },

  // conflict: tolerance for humour as deflection during tension. 0=welcomes it, 2=finds it deflecting.
  // Axis: conflict-deflecting ←→ conflict-direct (complementary angle to conflict questions above)
  {
    section: "Conflict",
    q: "Someone uses humour to lighten a tense moment. You...",
    opts: [
      "Appreciate it. Laughter is how I navigate hard things too",
      "Go along with it, though I need the serious part addressed eventually",
      "Find it deflecting. Some moments need to be felt, not laughed off"
    ],
    dim: "conflict", w: [0, 1, 2]
  },

  // boundaries: response to limit violations. 0=names it immediately, 3=absorbs silently.
  // Axis: direct/explicit ←→ passive/absorbs quietly
  {
    section: "Boundaries",
    q: "When someone tries to cross your limits, you...",
    opts: [
      "Say immediately and clearly what's not okay",
      "Give a subtle signal and hope they pick up on it",
      "Absorb for a long time, then address it firmly when it becomes a pattern",
      "I absorb a lot before I react. I'd rather hold it than act out, but there's always a limit"
    ],
    dim: "boundaries", w: [0, 1, 2, 3]
  },

  // stability: emotional reactivity in ambiguous social situations. 0=unbothered, 3=ruminating.
  // Axis: emotionally steady ←→ reactive/anxious
  {
    section: "Emotional tone",
    q: "Someone you're close to doesn't reply for two days. You...",
    opts: [
      "Assume they're busy, it doesn't register as anything",
      "Notice it, send a low-pressure message, move on",
      "Start wondering if you said something wrong",
      "My mind starts filling in the gap. I feel a quiet irritation but say nothing and wait"
    ],
    dim: "stability", w: [0, 1, 2, 3]
  },

  // stability: emotional intensity of response to disruption. 0=barely registers, 3=state fully shifts.
  // Axis: emotionally steady ←→ reactive/overwhelmed
  {
    section: "Emotional tone",
    q: "When something throws you off – an unexpected change, a tense interaction – the feeling is usually...",
    opts: [
      "Barely registers. I adapt without much internal reaction",
      "Noticeable but contained. I feel it and move through it",
      "It takes over for a bit. Hard to focus on other things until it settles",
      "Strong and immediate. My whole state shifts when something hits me"
    ],
    dim: "stability", w: [0, 1, 2, 3]
  },

  // energy: home as social vs private space. 0=open door, 2=home is private.
  // Axis: socially open home ←→ private/boundaried home
  {
    section: "Social energy",
    q: "When it comes to your living space and having people around...",
    opts: [
      "My door is basically always open. The more the merrier",
      "I like having people over but need it to feel controlled and planned",
      "I'm very private about it. Home is where I decompress, not socialise"
    ],
    dim: "energy", w: [0, 1, 2]
  },

  // lifestyle: output orientation in free time. 0=productive/goal-driven, 3=rest/switch-off.
  // Axis: output-driven ←→ rest-driven
  {
    section: "Lifestyle",
    q: "When you have genuinely free time with no obligations, your natural pull is toward...",
    opts: [
      "Getting things done. I feel better when I've used the time well",
      "Making or building something. Creative output feels like rest to me",
      "Being present. A walk, a meal, a conversation – nothing that needs to be produced",
      "Doing as little as possible. Real rest means switching off completely"
    ],
    dim: "lifestyle", w: [0, 1, 2, 3]
  },

  // stability: emotional regulation style. 0=processes with others (healthy), 3=suppresses/pushes through.
  // Axis: open processing ←→ suppression
  {
    section: "Emotional tone",
    q: "When you're upset, what usually helps you get back to yourself?",
    opts: [
      "Talking it through with someone I trust",
      "Time alone to understand what I'm feeling",
      "Doing something practical or distracting until it passes",
      "I mostly push through it. It stays with me but I carry on"
    ],
    dim: "stability", w: [0, 1, 2, 3]
  },

  // conflict: repair threshold / belief about whether effort in relationships is normal. 0=effort is expected, 2=effort is a red flag.
  // Axis: high repair willingness ←→ low repair willingness / ease-seeking
  {
    section: "Conflict",
    q: "When a close relationship starts taking real effort, your instinct is...",
    opts: [
      "That's normal. Important relationships need maintenance",
      "Try to understand what's happening before drawing conclusions",
      "Wonder if something is fundamentally off. The right ones shouldn't feel this hard"
    ],
    dim: "conflict", w: [0, 1, 2]
  },

  // direction: life orientation / what someone is optimising for in the next few years.
  // Type: exact. No axis — 4 qualitatively different orientations.
  // 0=Stability, 1=Freedom, 2=Growth, 3=Connection
  {
    section: "Direction",
    q: "Thinking a few years ahead, what do you want?",
    opts: [
      "Stability. A place, a person, a good routine",
      "Freedom. Flexibility to move and change",
      "Growth. Projects, adventures, building something",
      "Connection. Wherever the right people are, that's where I want to be"
    ],
    dim: "direction"
  },

  // admire: default charitable interpretation of others' behaviour. 0=generous, 3=critical/pattern-matching.
  // Axis: generous/warm regard ←→ critical/guarded regard
  {
    section: "Regard",
    q: "When someone you care about does something frustrating, your first instinct is...",
    opts: [
      "They probably had a reason. I give the benefit of the doubt",
      "I notice it but don't jump to conclusions",
      "I take it at face value and feel the irritation",
      "I tend to connect it to a pattern I've noticed before"
    ],
    dim: "admire", w: [0, 1, 2, 3]
  },

  // admire: dominant emotional stance toward close relationships. 0=admiration, 3=cautious/guarded.
  // Axis: positive regard ←→ guarded/critical regard
  {
    section: "Regard",
    q: "When you think about the people you're closest to, what's the dominant feeling?",
    opts: [
      "Genuine admiration. There's something about them I find remarkable",
      "Warmth. I know them fully and like them anyway",
      "Loyalty. I'm committed to them, though I see them clearly",
      "Caution. I care, but I'm always a little aware of what they're capable of"
    ],
    dim: "admire", w: [0, 1, 2, 3]
  },

  // worldview: role of faith/spirituality in daily life. 0=faith-led, 3=actively secular.
  // Axis: faith-led ←→ secular
  {
    section: "Worldview",
    q: "Faith or spirituality in your life...",
    opts: [
      "Plays an active role. It shapes how I see things",
      "Is something I think about, but loosely. More personal than institutional",
      "Isn't really part of how I move through the world",
      "I'm actively skeptical of it"
    ],
    dim: "worldview", w: [0, 1, 2, 3]
  },

];

const QUESTIONS_DATING = [

  // attach: response to insecurity in a relationship. 0=secure/direct, 3=disorganised (wants both space and reassurance).
  // Axis: secure ←→ anxious/avoidant/disorganised
  {
    section: "Attachment",
    q: "When you feel insecure in a relationship, you usually...",
    opts: [
      "Seek reassurance. I need to know it's okay",
      "Withdraw a little until I process alone",
      "Say directly that something doesn't feel right",
      "I'm not sure what I need. Sometimes I want space, sometimes reassurance, and I can't always tell which"
    ],
    dim: "attach", w: [2, 1, 0, 3]
  },

  // attach: baseline feeling when a relationship is going well. 0=trust/secure, 3=keeps distance.
  // Axis: secure/trusting ←→ avoidant/detached
  {
    section: "Attachment",
    q: "When a new relationship is going well, your underlying feeling is...",
    opts: [
      "Trust. I take it at face value and enjoy it",
      "Good, though I'm aware it takes work to keep it that way",
      "Grateful but not fully settled. Something in me stays watchful",
      "Present but not dependent. I keep a part of myself separate"
    ],
    dim: "attach", w: [0, 1, 2, 3]
  },

  // attach: jealousy / security when partner spends time with others. 0=secure, 3=needs reassurance.
  // Axis: secure ←→ anxious
  {
    section: "Attachment",
    q: "When someone you're with spends a lot of time with an ex or a close friend you don't know well, you...",
    opts: [
      "Feel secure. I trust the relationship",
      "Notice a flicker of something but let it go",
      "Feel unsettled, though I wouldn't necessarily say anything",
      "Find it hard. I need some reassurance"
    ],
    dim: "attach", w: [0, 1, 2, 3]
  },

  // intimacy: what produces the feeling of closeness with a partner. 0=deep disclosure, 3=implicit/chosen.
  // Axis: vulnerability-led closeness ←→ quiet presence/implicit closeness
  {
    section: "Intimacy",
    q: "When do you feel closest to a partner?",
    opts: [
      "When I've said something I've never said to anyone else and they didn't flinch",
      "When we're just existing together. No agenda, no performance, just easy",
      "When they do something small that shows they were paying attention",
      "When I know, without having to ask, that they'd choose me again today"
    ],
    dim: "intimacy", w: [0, 1, 2, 3]
  },

  // intimacy: preferred mode of shared evening. 0=parallel solitude, 3=social/outward-facing.
  // Axis: inward/quiet togetherness ←→ active/social togetherness
  {
    section: "Intimacy",
    q: "A good evening with a partner looks like...",
    opts: [
      "Each doing our own thing in the same space. Reading, watching something different, just being near each other",
      "A long conversation that goes somewhere real. Something gets said that matters",
      "Doing something together. Cooking, a walk, a film. The activity is the point",
      "Going out, seeing people, coming home together. Energy shared, not just presence"
    ],
    dim: "intimacy", w: [0, 1, 2, 3]
  },

  // direction_children: children timeline/intention. 0=definitely yes, 3=not for me.
  // Axis: wants children ←→ does not want children
  {
    section: "Direction",
    q: "Children are...",
    opts: [
      "Clearly on my future list",
      "Probably, but not urgent",
      "Maybe, I'm not sure",
      "Not for me"
    ],
    dim: "direction_children", w: [0, 1, 2, 3]
  },

  // lovelang: primary love language(s). Type: overlap (pick up to 2).
  // No axis — categorical matching. Acts of service/Gifts/Touch/Words/Quality time.
  {
    section: "Love language",
    q: "What makes you feel most loved? Pick up to 2.",
    opts: [
      "When someone does something for you. Fixes the thing, handles the errand, shows up practically",
      "When someone thought of you while you were apart. A small gift, something that says 'I saw this and thought of you'",
      "When you're touched. A hand on your back, being held, physical presence",
      "When someone tells you directly. 'I love you', 'I'm proud of you', 'you matter to me'",
      "When someone gives you their full, unhurried attention. No phone, nowhere else to be"
    ],
    dim: "lovelang", multiSelect: 2
  },

  // conflict: approach when fully secure — with someone you trust won't leave. 0=direct/erupts, 3=still avoidant.
  // Axis: head-on ←→ avoidant. Captures the mode that only unlocks under real security.
  {
    section: "Couple conflict",
    q: "Think of someone you fully trust — a partner or person you know won't go anywhere over a disagreement. When they do something that bothers you, you...",
    opts: [
      "Say it immediately. With them I don't hold back",
      "Bring it up when the moment feels right, but I don't sit on it long",
      "Take my time. Even with people I trust, I think before I say something",
      "Often let it go. Even when I feel safe, confrontation doesn't come naturally"
    ],
    dim: "conflict", w: [0, 1, 2, 3]
  },

  // cconf: couple conflict resolution pace. 0=resolves same day, 3=lets it go/doesn't fully resolve.
  // Axis: resolves immediately ←→ lets things go/drift
  {
    section: "Couple conflict",
    q: "When you're in conflict with a partner, how do you want it to end?",
    opts: [
      "We resolve it same day. I can't sleep with tension",
      "We give each other space, come back when calm",
      "We reach a compromise, even if neither of us is fully satisfied",
      "We move on. Getting stuck on things isn't our style"
    ],
    dim: "cconf", w: [0, 1, 2, 3]
  },

  // passion: how central physical chemistry is to relationship satisfaction. 0=central, 3=secondary.
  // Axis: passion-led ←→ connection-led
  {
    section: "Passion",
    q: "Physical chemistry in a relationship is...",
    opts: [
      "Central. Without it something essential is missing",
      "Important, but not the foundation",
      "Nice when it's there, not a dealbreaker if it fades",
      "Secondary to emotional and intellectual connection"
    ],
    dim: "passion", w: [0, 1, 2, 3]
  },

  // passion: physical affection initiation. 0=initiates a lot, 3=less instinctive.
  // Axis: physically expressive/initiating ←→ connects through words/presence
  {
    section: "Passion",
    q: "In a relationship that's going well, physical closeness is...",
    opts: [
      "Something I initiate a lot. Touch, proximity, I'm naturally affectionate",
      "Important to me but I follow the other person's lead as much as my own",
      "Something I appreciate when it happens, though I don't always think to initiate",
      "Less instinctive for me. I connect more through words and presence than touch"
    ],
    dim: "passion", w: [0, 1, 2, 3]
  },

  // passion: what sustains desire over time. 0=closeness/depth, 3=novelty/unpredictability.
  // Axis: intimacy-sustains-desire ←→ novelty-sustains-desire (Perel axis)
  {
    section: "Passion",
    q: "Over time, attraction stays alive for you through...",
    opts: [
      "Closeness and being known. Depth keeps it real",
      "Effort and playfulness. It needs tending but doesn't need distance",
      "Some space and unpredictability. Familiarity alone dulls it",
      "Novelty. When everything becomes too known, something fades"
    ],
    dim: "passion", w: [0, 1, 2, 3]
  },

  // stability: emotional recovery time after being upset. 0=bounces back quickly, 3=lingers for days.
  // Axis: emotionally resilient ←→ emotionally sensitive/deep-feeling
  {
    section: "Emotional tone",
    q: "When something upsets you, how long does it tend to stay with you?",
    opts: [
      "I bounce back quickly, it passes",
      "A few hours at most, then I'm over it",
      "It lingers. I need time and processing",
      "It can sit with me for days. I feel things deeply"
    ],
    dim: "stability", w: [0, 1, 2, 3]
  },

  // differ: need for alone time after sustained togetherness. 0=needs to decompress alone, 2=recharges through connection.
  // Axis: independent/needs solitude ←→ merged/recharges through closeness
  {
    section: "Independence",
    q: "You've been spending a lot of time with a partner. After a few days, you...",
    opts: [
      "I start to feel the pull to decompress. Even if it's been great, I need time to myself to reset",
      "Don't really notice. I'd happily keep going",
      "Actually find it harder when it ends. Connection is what recharges me"
    ],
    dim: "differ", w: [2, 1, 0]
  },

  // differ: importance of maintaining a separate identity within a relationship. 0=needs independence, 2=seeks togetherness.
  // Axis: independent self ←→ shared/merged life
  {
    section: "Independence",
    q: "In a relationship, having your own separate life — friends, interests, time — is...",
    opts: [
      "Essential. I need it to stay myself",
      "Important but not rigid about it",
      "I naturally tend toward togetherness. A shared life is what I'm after"
    ],
    dim: "differ", w: [3, 2, 0]
  },

  // lifestyle: output orientation in shared free time. 0=wants to do/achieve, 2=wants to rest/unfold.
  // Axis: output-driven ←→ rest-driven (relationship context)
  {
    section: "Lifestyle",
    q: "When you have a free day with a partner and no plans, you'd naturally...",
    opts: [
      "Want to make something of it. A trip, a project, something to show for it",
      "Mix it up. Some activity, some downtime",
      "Let it unfold slowly. Nowhere to be is the whole point"
    ],
    dim: "lifestyle", w: [0, 1, 2]
  },

  // drive: career centrality / ambition. 0=achievement-driven, 2=lifestyle-led.
  // Axis: achievement-driven ←→ lifestyle/ease-driven
  {
    section: "Direction",
    q: "Work and achievement in your life are...",
    opts: [
      "Central. What I build and accomplish matters a lot to me",
      "Important, but not who I am. I work hard without being defined by it",
      "A means to an end. I want a good life, not a career"
    ],
    dim: "drive", w: [0, 1, 2]
  },

  // roles: expected division of labour and earning in a relationship. Type: exact.
  // No axis — 4 qualitatively different structural expectations.
  // 0=Fully equal, 1=Flexible equal, 2=One earns more, 3=Traditional
  {
    section: "Roles",
    q: "When it comes to how responsibilities split in a relationship...",
    opts: [
      "Fully equal. Both working, everything shared, no default roles",
      "Mostly equal but flexible — we go with what works for each person's situation",
      "I'd be comfortable with one of us earning more and the other contributing differently",
      "I'd want a more traditional structure. Clear roles, not everything split down the middle"
    ],
    dim: "roles"
  },

  // finances: spending vs saving orientation. 0=spends freely, 3=saves by default.
  // Axis: spend-freely ←→ save-by-default
  {
    section: "Finances",
    q: "When it comes to money, you tend to...",
    opts: [
      "Spend freely. Life is now, I'd rather have the experience",
      "I spend on experiences, save on things. I'm selective about what's worth it",
      "Spend on what matters, save the rest. I think about it",
      "Save by default. Security matters more to me than spending"
    ],
    dim: "finances", w: [0, 1, 2, 3]
  },

  // depth: need for intellectual stimulation from a partner. 0=needs it, 2=not a priority.
  // Axis: intellectually driven ←→ connection through other means
  {
    section: "Depth",
    q: "With a partner, you need to feel...",
    opts: [
      "Genuinely stimulated. I need someone I can think with",
      "Engaged, but that's not what makes or breaks it",
      "Connection doesn't have to be intellectual for me. I value other things more"
    ],
    dim: "depth", w: [0, 1, 2]
  },

  // space: tidiness / domestic standards in shared space. 0=needs order, 3=relaxed about clutter.
  // Axis: ordered/tidy ←→ relaxed/lived-in
  {
    section: "Space & tidiness",
    q: "When it comes to shared space...",
    opts: [
      "I need things clean and organised. Clutter affects my mood",
      "I keep things reasonably tidy but I'm not strict about it",
      "I'm pretty relaxed. As long as it's liveable, I'm fine",
      "Tidiness isn't something I prioritise"
    ],
    dim: "space", w: [0, 1, 2, 3]
  },

  // finances: pooling vs separating money in a long-term relationship. 0=fully shared, 3=fully separate.
  // Axis: shared finances ←→ independent finances
  {
    section: "Finances",
    q: "In a long-term relationship, money should be...",
    opts: [
      "Fully shared. What's mine is yours",
      "Mostly together, with some personal spending money",
      "Split fairly. Shared expenses divided, the rest is mine",
      "Kept separate. I handle my own finances"
    ],
    dim: "finances", w: [0, 1, 2, 3]
  },

  // finances: autonomy in major financial/life decisions. 0=fully joint, 2=fully independent.
  // Axis: joint decision-making ←→ individual autonomy
  {
    section: "Finances",
    q: "Big decisions like moving city, changing jobs, or taking on debt should be...",
    opts: [
      "Made together, fully. Nothing major moves without both of us aligned",
      "Mostly together, but whoever it affects more takes the lead",
      "Each person decides for themselves. We support each other but don't need sign-off"
    ],
    dim: "finances", w: [0, 1, 2]
  },

];
