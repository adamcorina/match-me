const QUESTIONS_CORE = [
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
  {
    section: "Conflict",
    q: "Someone close says something that hurts you. Your first reaction...",
    opts: [
      "I say how I feel immediately. I can't sit on it",
      "I wait until I've calmed down, then bring it up",
      "I let it pass. I'd rather move on than have a discussion that might make things worse",
      "I create some distance. It's hard to stay open with someone right after they've hurt me"
    ],
    dim: "conflict", w: [0, 1, 2, 3]
  },
  {
    section: "Conflict",
    q: "You're in a disagreement with someone. What does it look like from the outside?",
    opts: [
      "Direct and unfiltered. I say what I think, I don't soften it",
      "Firm but measured. I make my point clearly without making it personal",
      "Diplomatic. I look for the overlap between our positions rather than defending mine",
      "Quiet. Keeping the peace matters more to me than making my point"
    ],
    dim: "conflict", w: [0, 1, 2, 3]
  },
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
  {
    section: "Values",
    q: "What matters most in a close relationship?",
    opts: [
      "Reliability. Showing up, especially when it's hard",
      "Respect. Giving each other space to be different people",
      "Growth. Pushing each other to be better",
      "Ease. Feeling good together without having to work at it"
    ],
    dim: "values", w: [0, 2, 1, 3]
  },
  {
    section: "Values",
    q: "You have an unexpected free month, no obligations. You'd most want to...",
    opts: [
      "Settle into a good routine. Cook, read, see the same people regularly",
      "Travel somewhere new, say yes to things, no fixed plan",
      "Go deep on something. A project, a relationship, an idea",
      "Decompress. Low effort, low stakes, just feel at ease"
    ],
    dim: "values", w: [0, 3, 1, 2]
  },
  {
    section: "Values",
    q: "A friend asks a big favor at the worst moment for you. You...",
    opts: [
      "Help. That's what friends do",
      "Explain your situation and figure it out together",
      "Say not now, but offer an alternative",
      "Decline. I need to put myself first sometimes"
    ],
    dim: "values", w: [0, 1, 2, 3]
  },
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
  {
    section: "Depth",
    q: "When you're going through something difficult, what helps you process it?",
    opts: [
      "Talking it through with someone. I understand what I feel by saying it out loud",
      "Writing it down. Getting it out of my head and onto paper",
      "Sitting with it alone until it settles",
      "Doing something. Movement, work, anything that gets me out of my head"
    ],
    dim: "depth", w: [0, 1, 2, 3]
  },
  {
    section: "Humour",
    q: "Your humour is mostly...",
    opts: [
      "Absurd and surreal. Non-sequiturs, weird logic, jokes that need a very specific receiver",
      "Dry and ironic. Deadpan, subtext, you have to be paying attention",
      "Playful and teasing. I joke about people as much as myself, all in good fun"
    ],
    dim: "humor", w: [0, 1, 2]
  },
  {
    section: "Humour",
    q: "Someone uses humour to lighten a tense moment. You...",
    opts: [
      "Appreciate it. Laughter is how I navigate hard things too",
      "Go along with it, though I need the serious part addressed eventually",
      "Find it deflecting. Some moments need to be felt, not laughed off"
    ],
    dim: "humor", w: [0, 1, 2]
  },
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
  {
    section: "Boundaries",
    q: "You've been spending a lot of time with someone you care about. After a few days, you...",
    opts: [
      "I start to feel the pull to decompress. Even if it's been great, I need time to myself to reset",
      "Don't really notice. I'd happily keep going",
      "Actually find it harder when it ends. Connection is what recharges me"
    ],
    dim: "boundaries", w: [0, 1, 2]
  },
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
  {
    section: "Emotional tone",
    q: "Your general outlook on things tends to be...",
    opts: [
      "Optimistic. I default to things working out",
      "Realistic. I try to see things as they are",
      "Cautious. I'd rather expect less and be pleasantly surprised"
    ],
    dim: "stability", w: [0, 1, 2]
  },
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
  {
    section: "Values",
    q: "Outside of work and close relationships, your energy mostly goes toward...",
    opts: [
      "Active and outdoors. I need movement and fresh air",
      "Creative or intellectual things. Making, reading, building ideas",
      "Social things. Events, people, experiences",
      "Rest and recovery. I protect my downtime fiercely"
    ],
    dim: "values", w: [0, 1, 2, 3]
  },
];

const QUESTIONS_DATING = [
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
  {
    section: "Direction",
    q: "Thinking a few years ahead, what do you want?",
    opts: [
      "Stability. A place, a person, a good routine",
      "Freedom. Flexibility to move and change",
      "Growth. Projects, adventures, building something",
      "Not sure, I prefer to see how it unfolds"
    ],
    dim: "direction", w: [0, 3, 1, 2]
  },
  {
    section: "Direction",
    q: "Children are...",
    opts: [
      "Clearly on my future list",
      "Probably, but not urgent",
      "Maybe, I'm not sure",
      "Not for me"
    ],
    dim: "direction", w: [0, 1, 2, 3]
  },
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
  {
    section: "Emotional tone",
    q: "After a difficult conversation, you usually feel...",
    opts: [
      "Relieved. It needed to happen and now it's done",
      "Drained but okay. I need a bit to recover",
      "Unsettled. I replay it, wonder if I said the right things, worry how they took it",
      "Like I'd rather have avoided the whole thing. Even when it goes fine, I find these conversations costly"
    ],
    dim: "stability", w: [0, 1, 2, 3]
  },
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
  {
    section: "Values",
    q: "When it comes to how you spend your free time together, you'd want...",
    opts: [
      "Someone who matches my energy. We do things, we're active, we're out",
      "A mix. Some adventures, some slow days",
      "Someone low-key. Comfort, ease, no pressure to be anywhere"
    ],
    dim: "values", w: [0, 1, 2]
  },
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
  {
    section: "Direction",
    q: "Faith or spirituality in your life...",
    opts: [
      "Plays an active role. It shapes how I see things",
      "Is something I think about, but loosely. More personal than institutional",
      "Isn't really part of how I move through the world",
      "I'm actively skeptical of it"
    ],
    dim: "worldview", w: [0, 1, 2, 3]
  },
  {
    section: "Direction",
    q: "When it comes to money, you tend to...",
    opts: [
      "Spend freely. Life is now, I'd rather have the experience",
      "I spend on experiences, save on things. I'm selective about what's worth it",
      "Spend on what matters, save the rest. I think about it",
      "Save by default. Security matters more to me than spending"
    ],
    dim: "drive", w: [0, 1, 2, 3]
  },
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
  {
    section: "Authenticity",
    q: "When a relationship goes through a rough patch, you...",
    opts: [
      "Want to understand it. I'll sit with it, talk it through, figure out what happened",
      "Process it briefly then move forward",
      "Move on. Dwelling doesn't help me"
    ],
    dim: "auth", w: [0, 1, 2]
  },
  {
    section: "Values",
    q: "When it comes to shared space...",
    opts: [
      "I need things clean and organised. Clutter affects my mood",
      "I keep things reasonably tidy but I'm not strict about it",
      "I'm pretty relaxed. As long as it's liveable, I'm fine",
      "Tidiness isn't something I prioritise"
    ],
    dim: "space", w: [0, 1, 2, 3]
  },
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
  {
    section: "Finances",
    q: "When you and a partner have different comfort levels around spending (takeout vs cooking, holidays, nights out)...",
    opts: [
      "I adjust to what works for both of us. The gap is mine to bridge internally",
      "We find a middle ground each time. Neither of us always gets their preference",
      "I go with what I'm comfortable with. I'll cover any difference if needed"
    ],
    dim: "finances", w: [0, 1, 2]
  }
];
