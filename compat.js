const DIM_META = {
  // Gottman: bids for connection, directness vs. processing time as a predictor of unspoken accumulation
  comm:           { label: "Communication",    type: "sim",   lo: "Direct",           hi: "Async",           max: 2 },
  // Gottman: pursue-withdraw pattern; EFT (Johnson): negative cycle management; too-similar avoiders = festering
  conflict:       { label: "Conflict style",   type: "sim",   lo: "Head-on",          hi: "Avoidant"        },
  // Big Five extraversion; sim type – two introverts or two extroverts are genuinely compatible
  energy:         { label: "Social energy",    type: "sim",   lo: "Social",           hi: "Solitary"        },
  // Life-goals alignment research; Schwartz value theory – foundational beliefs predict friction under pressure
  values:         { label: "Values",           type: "exact", cats: ["Reliability", "Respect", "Growth", "Ease"] },
  // Contact frequency as attachment expression; links to anxious vs. avoidant baseline needs
  rhythm:         { label: "Rhythm",           type: "sim",   lo: "Frequent contact", hi: "Organic"         },
  // Big Five agreeableness; EFT emotional attunement
  empathy:        { label: "Support style",     type: "sim",   lo: "Emotional",        hi: "Practical"       },
  // Schnarch: self-validated intimacy – willingness to be fully seen; zone because both extremes carry risk
  auth:           { label: "Authenticity",     type: "sim",   lo: "Open",             hi: "Guarded"         },
  // Sternberg: intimacy vertex (closeness, bondedness); appetite for meaningful vs. surface conversation
  depth:          { label: "Depth",            type: "sim",   lo: "Conceptual",       hi: "Practical"       },
  // Shared comedic register as social bonding signal; mismatched humour slows rapport under guardedness
  humor:          { label: "Humour",           type: "overlap", cats: ["Absurd", "Dry", "Playful", "Dark", "Physical"] },
  // Schnarch: differentiation – naming limits without fusion or distance; Tatkin: secure functioning
  boundaries:     { label: "Boundaries",       type: "sim",   lo: "Direct",           hi: "Absorbs quietly" },
  // Bowlby / Hazan & Shaver / Johnson: secure, anxious, avoidant patterns; zone catches both extremes
  attach:         { label: "Attachment",       type: "sim",   display: "category", cats: ["Secure", "Anxious", "Avoidant", "Disorganised"] },
  // Sternberg: intimacy vertex; Schnarch: self-validated vs. other-validated closeness needs
  intimacy:       { label: "Intimacy",         type: "sim",   lo: "Vulnerable",       hi: "Quiet presence"  },
  // Life-stage alignment research: children, geography, lifestyle – misalignment is a slow-burn incompatibility
  direction:           { label: "Direction",        type: "exact", cats: ["Stability", "Freedom", "Growth", "Connection"] },
  // Children: one of the highest-stakes compatibility signals; hard incompatibility should outweigh averages
  direction_children:  { label: "Children",         type: "sim",   lo: "Definitely yes",   hi: "Definitely no"   },
  // Chapman: 5 Love Languages – care given in the wrong language doesn't land even when genuine
  lovelang:       { label: "Love language",    type: "overlap", display: "category", cats: ["Acts of service", "Gifts", "Touch", "Words", "Quality time"] },
  // Gottman: repair cycle timing – too-similar avoiders leave things unresolved; too-different = pursuer/stonewaller
  cconf:          { label: "Couple conflict",  type: "sim",   lo: "Resolve same day", hi: "Let it go"       },
  // Sternberg: passion vertex; Perel: erotic vitality as structurally independent of intimacy
  passion:        { label: "Passion",          type: "sim",   lo: "Passion-led",      hi: "Connection-led"  },
  // Big Five neuroticism – strongest single personality predictor of relationship dissatisfaction (meta-analyses)
  stability:      { label: "Emotional tone",   type: "sim",   lo: "Steady",           hi: "Reactive"        },
  // Schnarch: differentiation – maintaining identity under relational pressure without merging or distancing
  differ:         { label: "Independence",     type: "sim",   lo: "Merged",           hi: "Independent"     },
  // Gottman: fondness & admiration / positive sentiment override – predicts whether repair is possible under conflict
  admire:         { label: "Regard (benefit of the doubt)", type: "sim", lo: "Generous", hi: "Critical"    },
  // Ambition research (Huston et al.): career centrality + resource attitudes predict long-term friction under life transitions
  drive:          { label: "Ambition",          type: "sim",   lo: "Achievement-driven", hi: "Lifestyle-led" },
  lifestyle:      { label: "Lifestyle",         type: "sim",   lo: "Output-driven",      hi: "Rest-driven"   },
  // Relationship satisfaction research: domestic compatibility (tidiness, space, privacy) is a persistent low-level stressor when mismatched
  space:          { label: "Space & tidiness", type: "sim",   lo: "Ordered",          hi: "Relaxed"         },
  // Schwartz value theory: universalism/tradition axis; religious orientation predicts friction on rituals, meaning-making, and major life decisions
  worldview:      { label: "Worldview",        type: "sim",   lo: "Faith-led",        hi: "Secular"         },
  // Relationship structure research: division of labour and earning expectations are a persistent source of friction when assumed rather than discussed
  roles:          { label: "Roles",               type: "exact", cats: ["Fully equal", "Flexible equal", "One earns more", "Traditional"] },
  // Financial compatibility research: money pooling, decision autonomy, and spending asymmetry are persistent friction sources in cohabiting couples
  finances:       { label: "Finances & spending", type: "sim", lo: "Shared & free",    hi: "Separate & careful" },
};

// ─── Per-dimension insight copy ────────────────────────────────────────────────
// Each entry is a function(a, b) → { type, text } | null
// a and b are the two people's raw dimension values (0–3 scale)

function bucket(v) {
  if (v <= 0.8)  return "low";
  if (v <= 1.8)  return "mid";
  return "high";
}

const DIM_INSIGHTS = {

  comm(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both say what you mean directly. There's little room for misreading each other." };
      if (ba === "mid")  return { type: "strength", text: "You both like some time to think before responding, but don't need to disappear to do it. A comfortable middle ground." };
      if (ba === "high") return { type: "strength", text: "You both express yourselves better in writing and don't feel the pull to resolve things face to face. You'll naturally give each other that space." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you prefers direct, in-the-moment exchanges; the other needs more time or distance to process. This gap rarely causes conflict, but it can create a slow accumulation of unspoken things if you don't name it." };
    }
    return { type: "diff", text: "Your communication styles sit at different points on the spectrum. Worth checking in: do you both feel equally heard, or does one person end up doing more of the emotional labour?" };
  },

  conflict(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both address friction head-on and quickly. Disagreements are unlikely to fester between you." };
      if (ba === "mid")  return { type: "strength", text: "You both prefer to let things settle before engaging. Conflict between you is likely to be measured and calm." };
      if (ba === "high") return { type: "strength", text: "Neither of you pushes hard to resolve conflict. Things are unlikely to escalate, though important things can stay unaddressed if neither person opens the door." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you moves toward conflict; the other moves away from it. The pursuer feels ignored, the avoider feels pressured – and each reaction makes the other worse. This is one of the most common friction patterns in close relationships.",
               growth: "Someone who addresses things directly – without it turning into an attack – can show that conflict doesn't have to be dangerous. For someone whose instinct is to avoid it, that's a different kind of evidence than knowing it intellectually." };
    }
    return { type: "diff", text: "You handle conflict at different speeds. One person is ready to talk before the other is, which can make the conversation itself become the problem." };
  },

  energy(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both social creatures who recharge around people. Your social lives are likely to intertwine naturally." };
      if (ba === "mid")  return { type: "strength", text: "Balanced social energy on both sides. You're likely to want the same kind of weekends without having to negotiate." };
      if (ba === "high") return { type: "strength", text: "You both value solitude and selective socialising. There's little risk of one person dragging the other to events they hate." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you refuels around people; the other refuels alone. It just needs genuine negotiation around social calendars rather than assumptions." };
    }
    return { type: "diff", text: "Slightly different social rhythms. There's room to grow into each other's world here – worth agreeing on what shared social time actually looks like for each of you." };
  },

  values(a, b) {
    const cats = ["reliability", "respect", "growth", "ease"];
    if (a === b) {
      return { type: "strength", text: `You both put ${cats[a]} at the centre of a close relationship. That shared foundation tends to show up in how you treat each other without having to negotiate it.` };
    }
    const na = cats[a], nb = cats[b];
    return { type: "diff", text: `One of you most values ${na}; the other, ${nb}. Neither is wrong, but they're different enough that you may sometimes feel like you're measuring the relationship by different things.` };
  },

  rhythm(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both frequent-contact people. You'll naturally check in, show up, and stay close without it feeling like effort." };
      if (ba === "mid")  return { type: "strength", text: "Similar contact rhythm: quality over quantity, but reliable. Neither of you will feel smothered or neglected." };
      if (ba === "high") return { type: "strength", text: "You both operate on a looser rhythm. You know the connection is solid even across long silences. No scorekeeping." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you needs frequent contact to feel secure; the other is comfortable with long gaps. Without a conversation about this, the high-contact person is likely to feel neglected and the low-contact person likely to feel pressured, even when neither intends it." };
    }
    return { type: "diff", text: "Different contact rhythms. Worth agreeing on what \"staying close\" actually looks like for each of you, before assumptions build up." };
  },

  empathy(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both lead with emotional presence. You'll naturally sit with each other through hard things without needing to be asked." };
      if (ba === "mid")  return { type: "strength", text: "Similar support styles. You'll probably know intuitively what the other needs without having to spell it out." };
      if (ba === "high") return { type: "strength", text: "You're both practically oriented when someone's struggling. You'll understand each other's instinct to fix rather than just sit with things." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you leads with emotional presence; the other reaches for practical solutions. These are genuinely different instincts and they frequently clash in the moments that matter most. The emotional person feels unseen; the practical one feels like nothing they do is right.",
               growth: "When someone consistently meets you with presence rather than solutions, it can gradually shift what you reach for when the other person is struggling. Not immediately – but the reference point changes." };
    }
    return { type: "diff", text: "Slightly different support styles. Just don't assume your way of showing care reads the same way to them." };
  },

  auth(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both naturally open and willing to be yourselves early. The connection is likely to feel honest and real from the start." };
      if (ba === "mid")  return { type: "strength", text: "You both open up gradually and at a similar pace. Neither of you will feel pushed or left behind." };
      if (ba === "high") return { type: "strength", text: "You're both guarded and slow to show yourselves. The connection will take time to go anywhere real, but neither of you will feel pressure to go faster than you're ready for." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you is open early; the other takes a long time to lower their guard. The open person risks feeling like they're doing all the emotional work. The guarded one may feel quietly pushed. Neither perception is usually accurate, but both feel real.",
               growth: "Being around someone who is genuinely open – not as a performance, just as their nature – can make it easier to lower your own guard without feeling exposed. The pace doesn't have to match for it to happen." };
    }
    return { type: "diff", text: "You open up at different speeds. The person who goes first will need to sit with some uncertainty about whether it's reciprocal – and be patient while it is." };
  },

  depth(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both comfortable going deep. Conversations between you are unlikely to stay on the surface for long." };
      if (ba === "mid")  return { type: "strength", text: "You both appreciate depth when the moment calls for it, without needing every conversation to be a reckoning. A comfortable balance." };
      if (ba === "high") return { type: "diff", text: "Neither of you is naturally drawn to emotional depth or heavy conversation. The connection may feel light and easy. Just watch that important things don't go permanently unsaid." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you craves emotional depth and reflection; the other prefers to keep things lighter and more practical. The depth-seeker may feel unseen; the other may feel pressure to perform emotion. A bit of explicit negotiation goes a long way here." };
    }
    return { type: "diff", text: "Slightly different appetites for depth. You'll likely find a middle ground, though the person who wants more depth should probably say so directly rather than hoping it happens." };
  },

  humor(a, b) {
    const cats = ["absurd", "dry", "playful", "dark", "physical"];
    const s1 = pick2FromIndex(a);
    const s2 = pick2FromIndex(b);
    const shared = s1.filter(x => s2.includes(x));
    if (shared.length > 0 && shared.length === s1.length && shared.length === s2.length) {
      const names = shared.map(i => cats[i]).join(" and ");
      return { type: "strength", text: `You share the same comedic register: ${names}. You'll make each other laugh in ways that don't need explaining.` };
    }
    if (shared.length > 0) {
      const names = shared.map(i => cats[i]).join(" and ");
      return { type: "strength", text: `You overlap on ${names} humour. Enough of a shared register to find each other funny without having to translate.` };
    }
    const hasNiche = s1.concat(s2).some(i => i === 0 || i === 1 || i === 3); // absurd, dry, or dark
    if (hasNiche) {
      return { type: "diff", text: "No overlap in humour styles, and at least one of you runs niche — absurd, dry, or dark. That kind of humour needs a calibrated receiver. Early on it can read as cold or strange before the other person has the key to it." };
    }
    return { type: "diff", text: "Different humour styles with no direct overlap. Probably fine once you know each other, but the early dynamic may feel a little mismatched before a shared register develops." };
  },

  boundaries(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both name limits directly and early. Resentment doesn't get a foothold between you." };
      if (ba === "mid")  return { type: "strength", text: "You both signal needs without drama and expect the other to do the same. A stable, low-friction dynamic." };
      if (ba === "high") return { type: "strength", text: "Neither of you makes a point of naming limits out loud. Things feel smooth until they aren't – and when they aren't, neither of you will find it easy to say so." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you names limits clearly and directly; the other absorbs quietly and says nothing. The direct one can read the quiet one as passive-aggressive. The quiet one can feel steamrolled. Both are usually just doing what feels natural to them.",
               growth: "Watching someone name their limits without drama – not as a confrontation, just as information – can make it easier to do the same. For someone who tends to absorb, having that modelled close up is different from just knowing it's possible." };
    }
    return { type: "diff", text: "You communicate limits at different thresholds. The one who absorbs more will need to speak up sooner than feels natural; the more direct one may need to check in rather than wait to be told." };
  },

  attach(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both feel secure in relationships and don't tend to need a lot of reassurance or space. The attachment dynamic between you is likely to feel stable and easy." };
      if (ba === "mid")  return { type: "strength", text: "You both bring some anxiety into relationships. You'll understand each other's need for reassurance – though two people waiting for the other to go first can slow things down." };
      if (ba === "high") return { type: "strength", text: "You both tend to keep distance in relationships and are slow to fully attach. Neither of you will crowd the other. The risk is that the connection never quite gets close enough to feel real." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "Your attachment styles are quite far apart. One of you feels secure and doesn't need much reassurance; the other keeps significant distance. They want different things from the relationship by default." };
    }
    // secure + anxious or anxious + secure
    const hasGrowth = (ba === "low" && bb === "mid") || (ba === "mid" && bb === "low");
    return { type: "diff", text: "Your attachment styles differ. The person who needs more reassurance may read the other's distance as coldness; the one who needs more space may feel quietly pressured. Both are just trying to feel safe in the way that makes sense to them.",
             growth: hasGrowth ? "A secure presence doesn't punish anxiety or chase when there's distance. For someone who carries nervousness in relationships, that kind of consistency can quietly shift what feels normal – not through effort, just through repeated experience." : null };
  },

  intimacy(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both want full emotional vulnerability, to be completely known and accepted. This kind of depth is rare and, between two people who want the same thing, very possible." };
      if (ba === "mid")  return { type: "strength", text: "You share a similar understanding of intimacy: chosen connection, quiet presence, being seen. You'll build this naturally." };
      if (ba === "high") return { type: "strength", text: "You both feel most intimate through acceptance rather than intense disclosure. Comfortable in silence, present without pressure." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "Your intimacy needs are quite different. One person seeks deep emotional exposure; the other feels closest through quiet acceptance and presence. Neither is wrong, but left unspoken, the first may feel perpetually unseen, and the second may feel perpetually pushed." };
    }
    return { type: "diff", text: "Different ideas of what closeness looks like. Worth talking about what makes each of you feel truly connected. Not assumed, actually said." };
  },

  direction(a, b) {
    const cats = ["stability", "freedom", "growth", "connection"];
    if (a === b) {
      return { type: "strength", text: `You're both oriented toward ${cats[a]}. Long-term, you're pulling in the same direction.` };
    }
    const na = cats[a], nb = cats[b];
    // stability vs freedom is the sharpest tension
    if ((a === 0 && b === 1) || (a === 1 && b === 0)) {
      return { type: "diff", text: "One of you wants roots — a place, a person, a routine. The other wants to keep things open and flexible. This gap tends to stay quiet until a real decision forces it into the open." };
    }
    return { type: "diff", text: `One of you is oriented toward ${na}; the other toward ${nb}. Worth a real conversation about what the next few years actually look like for each of you.` };
  },

  direction_children(a, b) {
    // Both want children (0–1 range)
    if (a <= 1 && b <= 1) {
      if (a <= 0.5 && b <= 0.5) return { type: "strength", text: "You both want children. No ambiguity there." };
      return { type: "strength", text: "You're both broadly aligned on wanting children, even if the timeline isn't identical." };
    }
    // Both don't want children (2–3 range)
    if (a >= 2 && b >= 2) {
      if (a >= 2.5 && b >= 2.5) return { type: "strength", text: "Neither of you wants children. That's a clear and shared foundation." };
      return { type: "strength", text: "You're both in similar territory on children – uncertain or not wanting them. Enough alignment not to be pulling in opposite directions." };
    }
    // Hard mismatch: one definitely yes, one definitely no
    if ((a <= 0.5 && b >= 2.5) || (a >= 2.5 && b <= 0.5)) {
      return { type: "diff", text: "One of you wants children; the other doesn't. This is one of the few areas where there's no real compromise position. It's worth a direct conversation, not something to hope resolves itself over time." };
    }
    // Soft mismatch
    return { type: "diff", text: "You're not fully aligned on children. One of you has a clearer answer than the other. Worth naming where each of you actually stands, not just how you feel today." };
  },

  lovelang(a, b) {
    const cats = ["acts of service", "gifts", "touch", "words of affirmation", "quality time"];
    const s1 = pick2FromIndex(a);
    const s2 = pick2FromIndex(b);
    const shared = s1.filter(x => s2.includes(x));
    if (shared.length === s1.length && shared.length === s2.length) {
      const names = shared.map(i => cats[i]).join(" and ");
      return { type: "strength", text: `You both feel most loved through ${names}. No translation needed.` };
    }
    if (shared.length > 0) {
      const names = shared.map(i => cats[i]).join(" and ");
      return { type: "strength", text: `You share ${names} as a love language. You'll get part of it right without trying. The rest is just worth naming.` };
    }
    return { type: "diff", text: "You speak different love languages. Care is likely being given – it's just not arriving in the form the other person recognises most. Worth saying it out loud." };
  },

  cconf(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both need to resolve conflict the same day. Tension doesn't accumulate between you. Arguments are likely to be intense but short." };
      if (ba === "mid")  return { type: "strength", text: "You both prefer space before resolution. Fights between you are likely to be calm and measured once the dust settles." };
      if (ba === "high") return { type: "diff",     text: "Neither of you tends to resolve conflict fully. Things get shelved, compromised on, or silently dropped. Over time this can build. Someone needs to be willing to actually close the loop." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you can't rest until a conflict is resolved; the other lets things accumulate. This mismatch in pace is one of the most common sources of recurring arguments in relationships: not the original issue, but the disagreement about how to handle it." };
    }
    return { type: "diff", text: "Slightly different conflict resolution styles. Probably manageable, but agreeing upfront on a repair process (how long to wait, how to re-open) saves a lot of friction later." };
  },

  passion(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "Physical chemistry and romantic intensity matter a lot to both of you. You're likely to be on the same page about this from early on, and to notice it when it's missing." };
      if (ba === "mid")  return { type: "strength", text: "You share a similar appetite for physical closeness and romantic energy. Present and meaningful, without being the whole relationship." };
      if (ba === "high") return { type: "strength", text: "Neither of you is particularly driven by physical intensity or passion as a primary need. The connection between you is built on other things, which can be very stable." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you places physical chemistry and romantic intensity near the centre of what a relationship feels like; the other doesn't. This rarely stays invisible for long. The person for whom passion matters more will eventually feel something is missing, even if they can't name it precisely." };
    }
    return { type: "diff", text: "Slightly different orientations toward passion and physical intensity. Worth knowing what each of you actually needs to feel the relationship is alive. Not assumed, actually said." };
  },

  stability(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both emotionally steady. The relationship is unlikely to be destabilised by either person's internal weather. There's a reliable baseline between you." };
      if (ba === "mid")  return { type: "strength", text: "Similar emotional ranges. Neither of you is unusually reactive, neither unusually flat. You'll read each other's states accurately most of the time." };
      if (ba === "high") return { type: "strength", text: "You both feel things intensely and can run high. The connection will feel alive and mutually understood – but when things get hard, there's no one anchoring the room. Two people running hot at the same time can escalate quickly." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you is emotionally steady; the other more reactive and sensitive. The steadier person often becomes the default anchor, which works until it quietly becomes a weight. The reactive person may feel managed; the steady one may feel like they're always regulating for two. Both need to name it before it accumulates.",
               growth: "Being regularly around someone who doesn't escalate or get pulled into intensity can expand what calm feels like from the inside. Not through being told to calm down – just through having that as a reference point close enough to feel." };
    }
    return { type: "diff", text: "Slightly different emotional baselines. The more reactive person may read the steadier one as hard to reach; the steadier one may occasionally feel pulled into intensity they didn't ask for. Usually workable, worth knowing." };
  },

  differ(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both want real closeness and are comfortable with a shared life. Neither of you is likely to feel smothered or emotionally unavailable to the other." };
      if (ba === "mid")  return { type: "strength", text: "You both hold your own identity within a relationship without needing a lot of distance to do it. Close enough to be vulnerable, defined enough not to lose yourselves." };
      if (ba === "high") return { type: "strength", text: "You both need significant independence to feel like yourselves. Neither will crowd the other. The risk is that two highly independent people can drift into something that functions more like a friendship with history than a living relationship." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you wants a deeply shared life; the other needs significant independence to feel like themselves. The closer one may feel chronically under-connected; the more independent one may feel quietly suffocated. This gap needs to be named, not just tolerated.",
               growth: "Someone who maintains a clear sense of themselves inside a relationship can quietly give the other person permission to do the same. That's not distance – it's a different model of what closeness can look like." };
    }
    const hasGrowth = (ba === "low" && bb === "mid") || (ba === "mid" && bb === "low");
    return { type: "diff", text: "You have different ideas of how much of yourselves to bring into a relationship. The person who wants more togetherness may read the other's distance as disinterest. Worth being explicit about what closeness actually looks like for each of you.",
             growth: hasGrowth ? "Someone who holds onto their own identity within a relationship – without needing distance to do it – can make it easier for the other person to see that closeness and selfhood aren't in conflict." : null };
  },

  admire(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both tend to look for the best in people and extend generosity when things go wrong. This creates a relationship where mistakes are recoverable and positive regard is the default. One of the strongest predictors of long-term satisfaction." };
      if (ba === "mid")  return { type: "strength", text: "You're both capable of warmth and positive regard without being naive about the people you're close to. A grounded combination." };
      if (ba === "high") return { type: "diff", text: "Neither of you leads with warmth or charitable interpretation by default. Under stress, when it matters most, the tendency to see the worst in a situation can take hold quickly. Without a deliberate effort to maintain positive regard, small things can accumulate into contempt." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you naturally extends warmth and positive interpretation; the other tends toward more critical or guarded appraisal. In good times this doesn't matter much. In hard times, the gap becomes visible: one person is still working from a place of basic goodwill, the other has moved to a colder read of the situation." };
    }
    return { type: "diff", text: "One of you extends generosity by default; the other reads situations more critically. In good times this creates a useful balance. In hard times, the critical read tends to win and the generous one starts to feel like they're working alone to keep the goodwill intact." };
  },

  drive(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both ambitious and career-oriented. You'll understand each other's drive and the sacrifices it sometimes asks for." };
      if (ba === "mid")  return { type: "strength", text: "Similar orientations toward work. Neither of you is likely to feel the other is reckless about their career or completely checked out." };
      if (ba === "high") return { type: "strength", text: "You both treat work as a means to an end rather than a core identity. Low friction around ambition and the demands it can put on a relationship." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you is strongly driven by achievement; the other prioritises ease and quality of life. This gap tends to stay invisible until a real decision — a move, a job change, a sacrifice — forces it into the open." };
    }
    return { type: "diff", text: "Slightly different orientations toward ambition. Worth knowing where each of you stands before it starts shaping shared decisions." };
  },

  lifestyle(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both feel best when time is being used well – a project, a plan, something to show for the day. Shared time is unlikely to feel aimless or wasted." };
      if (ba === "mid")  return { type: "strength", text: "Similar balance between doing and being. You'll probably find a natural rhythm together without one person always pushing for more activity or more stillness." };
      if (ba === "high") return { type: "strength", text: "You both genuinely need to switch off and aren't driven to fill time with output. Shared downtime will feel easy rather than like one person is waiting for the other to slow down." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you feels better when time is productive; the other needs to genuinely switch off. This shows up in small ways constantly – how evenings go, what a good weekend looks like, whether doing nothing together feels restorative or restless." };
    }
    return { type: "diff", text: "Slightly different orientations toward rest and output. Worth knowing what recharges each of you – and whether shared downtime will actually feel like downtime for both." };
  },

  space(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both naturally tidy and treat your home as an ordered space. No friction there. You'll keep things the way you both like them without having to negotiate." };
      if (ba === "mid")  return { type: "strength", text: "Similar standards around tidiness and personal space. Relaxed enough not to be precious about it, structured enough not to let it go." };
      if (ba === "high") return { type: "strength", text: "Neither of you is particularly fussed about tidiness or needs the home to feel like a sanctuary. Easy cohabitation on that front." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you needs an ordered, private space to feel at ease; the other is relaxed about clutter and open doors. This is one of the most underestimated sources of daily friction: small, constant, easy to dismiss until it isn't." };
    }
    return { type: "diff", text: "Different domestic styles. Not a dealbreaker, but worth agreeing on what the baseline looks like before it becomes a recurring conversation." };
  },

  worldview(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "Faith plays a similar role in both your lives. You're likely to share a framework for meaning, ritual, and the bigger questions." };
      if (ba === "mid")  return { type: "strength", text: "You both hold spirituality loosely: personal rather than institutional. A comfortable common ground on the bigger questions." };
      if (ba === "high") return { type: "strength", text: "You're both secular in orientation. No friction there around religion or how meaning gets made." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you lives with faith at the centre; the other doesn't. This rarely causes daily friction, but it surfaces in big moments: rituals, children, how you make sense of hard things. Worth talking about before it becomes a surprise." };
    }
    return { type: "diff", text: "Different orientations toward faith and meaning. Not necessarily a problem, but worth knowing how each of you thinks about the bigger questions, especially if children or family traditions are on the table." };
  },

  roles(a, b) {
    const cats = ["fully equal", "mostly equal but flexible", "comfortable with one earning more", "more traditional"];
    if (a === b) {
      return { type: "strength", text: `You both expect a ${cats[a]} structure. No assumptions to unpack there.` };
    }
    // both in the egalitarian range
    if (a <= 1 && b <= 1) {
      return { type: "strength", text: "You're both broadly egalitarian, just with slightly different ideas of how rigid that is in practice. Unlikely to cause friction." };
    }
    // hard mismatch: fully equal vs traditional
    if ((a === 0 && b === 3) || (a === 3 && b === 0)) {
      return { type: "diff", text: "One of you expects everything split equally; the other wants a more traditional structure. This gap tends to stay invisible until you're actually building a life together, then it's everywhere." };
    }
    return { type: "diff", text: `You have different expectations around how a relationship is structured — one leaning ${cats[a]}, the other ${cats[b]}. Worth a direct conversation before it becomes an assumption.` };
  },

  finances(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both lean toward sharing finances and spending freely. The practical layer of the relationship is likely to feel like a team effort, without a lot of friction around money." };
      if (ba === "mid")  return { type: "strength", text: "Similar attitudes toward money — neither very merged nor very independent, neither reckless nor overly cautious. Unlikely to clash on the day-to-day of it." };
      if (ba === "high") return { type: "strength", text: "You both value financial independence and are naturally careful with money. No one will feel their autonomy is being negotiated away or their habits judged." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you wants a shared financial life and spends freely; the other keeps finances independent and saves by default. This gap tends to feel abstract until you're actually living together, then it surfaces in almost every practical decision." };
    }
    return { type: "diff", text: "Different instincts around money. Worth being explicit about what each of you expects before those expectations quietly become assumptions." };
  },

};

// ─── Cross-dimension combination insights ──────────────────────────────────────
// Each function receives (v1, v2) full vectors and returns { type, text } | null

const COMBO_INSIGHTS = [

  // ── Friendship tab ────────────────────────────────────────────────────────────

  function depthAuth(v1, v2) {
    const wantsDepth = v => v.depth !== undefined && v.depth <= 1;
    const slowAuth   = v => v.auth  !== undefined && v.auth  >= 2;
    if ((wantsDepth(v1) && slowAuth(v1)) || (wantsDepth(v2) && slowAuth(v2))) {
      return { tab: "friendship", type: "diff", text: "At least one of you craves deep conversation but needs a long time to lower their guard. This creates a quiet waiting game: depth is wanted but neither person is willing to go first. Someone eventually has to." };
    }
    return null;
  },

  function energyRhythm(v1, v2) {
    const extro = v => v.energy !== undefined && v.energy <= 1;
    const intro  = v => v.energy !== undefined && v.energy >= 2;
    const lowRhythm = v => v.rhythm !== undefined && v.rhythm >= 2;
    if ((extro(v1) && intro(v2)) || (extro(v2) && intro(v1))) {
      if (lowRhythm(v1) || lowRhythm(v2)) {
        return { tab: "friendship", type: "diff", text: "One of you is social and present; the other more solitary and comfortable with long gaps. Add a low-contact rhythm and the outward-facing person may feel chronically under-connected. Not because anything is wrong, but because the math doesn't add up." };
      }
    }
    return null;
  },

  function rhythmValuesConflict(v1, v2) {
    if (v1.rhythm === undefined || v2.rhythm === undefined) return null;
    if (v1.values === undefined || v2.values === undefined) return null;
    if (v1.conflict === undefined || v2.conflict === undefined) return null;
    const rhythmClose = Math.abs(v1.rhythm - v2.rhythm) <= 0.8;
    const valuesClose = v1.values === v2.values;
    const conflictLow = v1.conflict <= 1.2 && v2.conflict <= 1.2;
    if (rhythmClose && valuesClose && conflictLow) {
      return { tab: "friendship", type: "strength", text: "Shared rhythm, shared values, and a willingness to address conflict directly. This is a very solid foundation. Most of the things that quietly erode relationships aren't present here." };
    }
    return null;
  },

  function commConflictDirect(v1, v2) {
    if (v1.comm === undefined || v2.comm === undefined) return null;
    if (v1.conflict === undefined || v2.conflict === undefined) return null;
    const directComm     = v => v.comm     <= 1;
    const directConflict = v => v.conflict <= 1;
    if (directComm(v1) && directComm(v2) && directConflict(v1) && directConflict(v2)) {
      return { tab: "friendship", type: "strength", text: "You're both direct communicators who don't shy away from conflict. Arguments between you are likely to be fast and clean. Things get said, cleared, and moved on from without much wreckage." };
    }
    return null;
  },

  function humorAuth(v1, v2) {
    if (v1.humor === undefined || v2.humor === undefined) return null;
    if (v1.auth === undefined || v2.auth === undefined) return null;
    const s1 = pick2FromIndex(v1.humor), s2 = pick2FromIndex(v2.humor);
    const noOverlap   = s1.filter(x => s2.includes(x)).length === 0;
    const bothGuarded = v1.auth >= 2 && v2.auth >= 2;
    if (noOverlap && bothGuarded) {
      return { tab: "friendship", type: "diff", text: "Different humour wavelengths and both of you slow to lower your guard. The early stages of this connection may feel a little stilted. Shared laughter is one of the fastest ways two guarded people open up; without it, the warm-up period gets longer." };
    }
    return null;
  },

  function stabilityConflict(v1, v2) {
    if (v1.stability === undefined || v2.stability === undefined) return null;
    if (v1.conflict === undefined || v2.conflict === undefined) return null;
    const steady = v => v.stability <= 0.8;
    const direct = v => v.conflict <= 1;
    if (steady(v1) && steady(v2) && direct(v1) && direct(v2)) {
      return { tab: "friendship", type: "strength", text: "You're both emotionally steady and willing to address friction directly. This is the cleanest possible repair dynamic. Things get named without the conversation spiralling, and they actually get resolved." };
    }
    return null;
  },

  function highEmpathyBoth(v1, v2) {
    if (v1.empathy === undefined || v2.empathy === undefined) return null;
    if (v1.empathy <= 0.8 && v2.empathy <= 0.8) {
      return { tab: "friendship", type: "strength", text: "You're both highly attuned to each other's emotional states. This creates real intimacy. The only risk is absorbing each other's moods too readily; when one person is struggling, the other tends to sink with them." };
    }
    return null;
  },

  function valuesRhythm(v1, v2) {
    if (v1.values === undefined || v2.values === undefined) return null;
    if (v1.rhythm === undefined || v2.rhythm === undefined) return null;
    const easeOrGrowth = v => v.values === 2 || v.values === 3; // Growth or Ease
    const rhythmFar = Math.abs(v1.rhythm - v2.rhythm) >= 1.5;
    if ((easeOrGrowth(v1) || easeOrGrowth(v2)) && rhythmFar) {
      return { tab: "friendship", type: "diff", text: "One of you values freedom and spontaneity; you have quite different contact rhythms. The structure-inclined person may read the other's looseness as indifference. Worth being explicit about what reliability looks like to each of you. It's probably not the same thing." };
    }
    return null;
  },

  function depthHumor(v1, v2) {
    if (v1.depth === undefined || v2.depth === undefined) return null;
    if (v1.humor === undefined || v2.humor === undefined) return null;
    const deepBoth   = v1.depth <= 1 && v2.depth <= 1;
    const s1 = pick2FromIndex(v1.humor), s2 = pick2FromIndex(v2.humor);
    const humorClose = s1.filter(x => s2.includes(x)).length > 0;
    if (deepBoth && humorClose) {
      return { tab: "friendship", type: "strength", text: "You share both a taste for real conversation and a similar comedic sensibility. Those two things together tend to produce the kind of connection that feels easy and genuinely alive, the kind people describe as rare." };
    }
    return null;
  },

  // ── Relationship tab ──────────────────────────────────────────────────────────

  function attachConflict(v1, v2) {
    const highAttach  = v => v.attach !== undefined && v.attach >= 2;
    const highConflict = v => v.conflict !== undefined && v.conflict >= 2;
    if ((highAttach(v1) || highAttach(v2)) && (highConflict(v1) || highConflict(v2))) {
      return { tab: "relationship", type: "diff", text: "Between slow attachment and conflict avoidance, things that matter may go unsaid for a long time. The connection can feel comfortable on the surface while important things quietly calcify underneath." };
    }
    return null;
  },

  function boundariesAttach(v1, v2) {
    const guardedBoth = v => v.boundaries !== undefined && v.attach !== undefined && v.boundaries >= 2 && v.attach >= 2;
    if (guardedBoth(v1) && guardedBoth(v2)) {
      return { tab: "relationship", type: "diff", text: "You're both guarded by nature and slow to attach. The relationship can drift toward comfortable distance rather than real closeness. Warmth between you will need to be deliberate, not assumed." };
    }
    return null;
  },

  function attachConflictAnxious(v1, v2) {
    const anxious = v => v.attach !== undefined && v.attach <= 1;
    const avoider = v => v.conflict !== undefined && v.conflict >= 2;
    if ((anxious(v1) && avoider(v2)) || (anxious(v2) && avoider(v1))) {
      return { tab: "relationship", type: "diff", text: "One of you seeks reassurance when insecure; the other withdraws when things feel tense. This is a classic push-pull: the more anxious the first person gets, the more the second retreats, and the more the second retreats, the more anxious the first becomes. Hard to break without naming it." };
    }
    return null;
  },

  function lovelangEmpathy(v1, v2) {
    if (v1.lovelang === undefined || v2.lovelang === undefined) return null;
    const s1 = new Set(pick2FromIndex(v1.lovelang));
    const s2 = new Set(pick2FromIndex(v2.lovelang));
    const overlap = [...s1].filter(x => s2.has(x)).length;
    const lowEmpathy = v => v.empathy !== undefined && v.empathy >= 2;
    if (overlap === 0 && (lowEmpathy(v1) || lowEmpathy(v2))) {
      return { tab: "relationship", type: "diff", text: "You speak different love languages, and at least one of you defaults to practical action over emotional attunement. Care is likely being given. It's just not being received in the form the other person recognises. Worth making it explicit." };
    }
    return null;
  },

  function valuesDirection(v1, v2) {
    if (v1.values === undefined || v2.values === undefined) return null;
    if (v1.direction === undefined || v2.direction === undefined) return null;
    const valuesClose  = v1.values === v2.values;
    const directionFar = v1.direction !== v2.direction;
    if (valuesClose && directionFar) {
      return { tab: "relationship", type: "diff", text: "You share a lot of the same values but want quite different things from the future. This is one of the more quietly painful incompatibilities. Everything feels right until you talk about what comes next." };
    }
    return null;
  },

  function depthAuthIntimacy(v1, v2) {
    const open = v => v.depth !== undefined && v.auth !== undefined && v.intimacy !== undefined
                   && v.depth <= 1 && v.auth <= 1 && v.intimacy <= 1;
    if (open(v1) && open(v2)) {
      return { tab: "relationship", type: "strength", text: "You're both emotionally open, hungry for depth, and quick to be yourselves. This kind of mutual openness is rare. The connection is likely to feel unusually real, unusually fast." };
    }
    return null;
  },

  function secureCore(v1, v2) {
    if (v1.attach === undefined || v2.attach === undefined) return null;
    if (v1.cconf === undefined || v2.cconf === undefined) return null;
    if (v1.intimacy === undefined || v2.intimacy === undefined) return null;
    const secure = v => v.attach <= 1.2 && v.cconf <= 1.2;
    const intimacyClose = Math.abs(v1.intimacy - v2.intimacy) <= 0.8;
    if (secure(v1) && secure(v2) && intimacyClose) {
      return { tab: "relationship", type: "strength", text: "Secure attachment on both sides, a shared approach to resolving conflict, and compatible intimacy needs. This is a genuinely emotionally safe combination, the kind where both people can actually exhale." };
    }
    return null;
  },

  function passionAdmire(v1, v2) {
    if (v1.passion === undefined || v2.passion === undefined) return null;
    if (v1.admire === undefined || v2.admire === undefined) return null;
    const passionFar = Math.abs(v1.passion - v2.passion) >= 1.5;
    const lowAdmire  = v => v.admire >= 2;
    if (passionFar && (lowAdmire(v1) || lowAdmire(v2))) {
      return { tab: "relationship", type: "diff", text: "There's a significant gap in how much passion and physical intensity each of you needs, and at least one of you doesn't default to charitable interpretation when things feel off. That combination is worth watching: unmet physical needs tend to read as rejection, and a critical mindset amplifies that reading quickly." };
    }
    return null;
  },

  function stabilityAttach(v1, v2) {
    if (v1.stability === undefined || v2.stability === undefined) return null;
    if (v1.attach === undefined || v2.attach === undefined) return null;
    const steady  = v => v.stability <= 0.8;
    const reactive = v => v.stability >= 2;
    const anxious  = v => v.attach <= 1;
    if ((steady(v1) && reactive(v2) && anxious(v2)) || (steady(v2) && reactive(v1) && anxious(v1))) {
      return { tab: "relationship", type: "diff", text: "One of you is emotionally steady; the other both reactive and prone to anxiety in relationships. The steady person often becomes the de facto emotional anchor, which works until it quietly becomes too much. This dynamic needs naming, not just absorbing." };
    }
    return null;
  },

  function differRhythm(v1, v2) {
    if (v1.differ === undefined || v2.differ === undefined) return null;
    if (v1.rhythm === undefined || v2.rhythm === undefined) return null;
    const independent = v => v.differ >= 2;
    const looseRhythm = v => v.rhythm >= 2;
    if (independent(v1) && independent(v2) && looseRhythm(v1) && looseRhythm(v2)) {
      return { tab: "relationship", type: "diff", text: "You're both strongly independent and comfortable with long gaps. The relationship may feel uncomplicated and low-pressure, but comfortable distance is different from real closeness. Without deliberate effort, two independent people with loose contact rhythms can drift into something that functions more like a friendship with history than a living relationship." };
    }
    return null;
  },

  function admireDepthAuth(v1, v2) {
    if (v1.admire === undefined || v2.admire === undefined) return null;
    if (v1.depth === undefined || v2.depth === undefined) return null;
    if (v1.auth === undefined || v2.auth === undefined) return null;
    const warm = v => v.admire <= 0.8;
    const deep = v => v.depth <= 1;
    const open = v => v.auth <= 1;
    if ((warm(v1) || warm(v2)) && deep(v1) && deep(v2) && open(v1) && open(v2)) {
      return { tab: "relationship", type: "strength", text: "Positive regard, a hunger for depth, and genuine openness from both sides. This combination produces the kind of relationship where people actually feel known and looked after. It's less common than it sounds." };
    }
    return null;
  },

  function passionDiffer(v1, v2) {
    if (v1.passion === undefined || v2.passion === undefined) return null;
    if (v1.differ === undefined || v2.differ === undefined) return null;
    const highPassion = v => v.passion <= 0.8;
    const lowDiffer   = v => v.differ <= 0.8;
    if ((highPassion(v1) || highPassion(v2)) && lowDiffer(v1) && lowDiffer(v2)) {
      return { tab: "relationship", type: "diff", text: "High need for passion and intensity, combined with very low drive for independence in either of you. This can produce an all-consuming closeness that feels electric early on. Perel's observation applies here: desire needs some space to breathe. When two people are completely merged and passion is the primary fuel, the intensity tends to burn through itself." };
    }
    return null;
  },

  function driveDirection(v1, v2) {
    if (v1.drive === undefined || v2.drive === undefined) return null;
    if (v1.direction === undefined || v2.direction === undefined) return null;
    const driveFar     = Math.abs(v1.drive - v2.drive) >= 1.5;
    const directionFar = v1.direction !== v2.direction;
    if (driveFar && directionFar) {
      return { tab: "relationship", type: "diff", text: "You want different things from the future and have quite different orientations toward work and ambition. These two gaps tend to compound: how hard you push, what you're willing to sacrifice, and what a good life looks like all pull in different directions at once." };
    }
    return null;
  },

  function stabilityAttachBoth(v1, v2) {
    if (v1.stability === undefined || v2.stability === undefined) return null;
    if (v1.attach === undefined || v2.attach === undefined) return null;
    const reactive = v => v.stability >= 2;
    const anxious  = v => v.attach <= 1;
    if (reactive(v1) && reactive(v2) && anxious(v1) && anxious(v2)) {
      return { tab: "relationship", type: "diff", text: "You're both emotionally reactive and both prone to anxiety in relationships. The connection can feel intensely alive and mutually understood, but when things get hard, there's no one anchoring the room. Two people running high at the same time can escalate quickly without either meaning to." };
    }
    return null;
  },

  function differAttachInternal(v1, v2) {
    const conflicted = v => v.differ !== undefined && v.attach !== undefined && v.differ >= 2 && v.attach <= 1;
    if (conflicted(v1) || conflicted(v2)) {
      return { tab: "relationship", type: "diff", text: "At least one of you needs both closeness and independence in ways that pull against each other. They want reassurance but also space, and the tension between those two needs can be hard to read from the outside. It's not inconsistency, it's a genuine internal conflict." };
    }
    return null;
  },

  function spaceEnergy(v1, v2) {
    if (v1.space === undefined || v2.space === undefined) return null;
    if (v1.energy === undefined || v2.energy === undefined) return null;
    const spaceFar  = Math.abs(v1.space - v2.space) >= 1.5;
    const energyFar = Math.abs(v1.energy - v2.energy) >= 1.5;
    if (spaceFar && energyFar) {
      return { tab: "relationship", type: "diff", text: "One of you wants a private, ordered home; the other is relaxed and open-door. Add opposite social energy and the friction isn't just about tidiness. It's about what home means to each of you and how much of it you're willing to share." };
    }
    return null;
  },

  function driveDirectionAligned(v1, v2) {
    if (v1.drive === undefined || v2.drive === undefined) return null;
    if (v1.direction === undefined || v2.direction === undefined) return null;
    const driveClose     = Math.abs(v1.drive - v2.drive) <= 0.8;
    const directionClose = v1.direction === v2.direction;
    if (driveClose && directionClose) {
      return { tab: "relationship", type: "strength", text: "Similar ambitions and a shared sense of where you're both heading. The practical layer of a relationship — the decisions, the trade-offs, the plans — is unlikely to be a source of friction between you." };
    }
    return null;
  },

  function rolesValuesGap(v1, v2) {
    if (v1.roles === undefined || v2.roles === undefined) return null;
    if (v1.values === undefined || v2.values === undefined) return null;
    const rolesFar  = Math.abs(v1.roles - v2.roles) >= 2;
    const valuesDiff = v1.values !== v2.values;
    if (rolesFar && valuesDiff) {
      return { tab: "relationship", type: "diff", text: "You have different expectations around how a relationship is structured, and you're not measuring the relationship by the same things. These two tend to compound: when there's no shared framework for what matters, disagreements about roles don't resolve, they just repeat." };
    }
    return null;
  },

  function directionValuesGap(v1, v2) {
    if (v1.direction === undefined || v2.direction === undefined) return null;
    if (v1.values === undefined || v2.values === undefined) return null;
    const directionFar = v1.direction !== v2.direction;
    const valuesDiff   = v1.values !== v2.values;
    if (directionFar && valuesDiff) {
      return { tab: "relationship", type: "diff", text: "You're pulling in different directions and measuring the relationship by different things. Good on the individual dimensions — harder as a combination, because there's no shared anchor to return to when plans diverge." };
    }
    return null;
  },

  // Both avoid in friendship context AND let things go in relationship context:
  // silent accumulation pattern — nothing escalates but nothing resolves either.
  function conflictCconfBothAvoid(v1, v2) {
    if (v1.conflict === undefined || v2.conflict === undefined) return null;
    if (v1.cconf === undefined || v2.cconf === undefined) return null;
    const avoidant = v => v.conflict >= 2;
    const letsItGo = v => v.cconf >= 2;
    if (avoidant(v1) && avoidant(v2) && letsItGo(v1) && letsItGo(v2)) {
      return { tab: "relationship", type: "diff", text: "You both avoid conflict when it first surfaces and neither of you tends to push to fully resolve it. Things stay smooth. Nothing escalates. But nothing gets closed either. Over time, what accumulates isn't anger — it's distance. The things that mattered and went unsaid." };
    }
    return null;
  },

  // One confronts, the other lets it go — the meta-argument pattern.
  function conflictCconfPursuerDropper(v1, v2) {
    if (v1.conflict === undefined || v2.conflict === undefined) return null;
    if (v1.cconf === undefined || v2.cconf === undefined) return null;
    const confronts = v => v.conflict <= 1;
    const letsItGo  = v => v.cconf >= 2;
    const v1Pattern = confronts(v1) && letsItGo(v2);
    const v2Pattern = confronts(v2) && letsItGo(v1);
    if (v1Pattern || v2Pattern) {
      return { tab: "relationship", type: "diff", text: "One of you addresses friction when it happens; the other tends to let things go rather than fully resolve them. The person who wants to address it ends up feeling like they're always the one keeping score. The person who lets it go may feel pulled into conversations they thought were already over. The argument becomes about whether to have the argument — which is its own argument." };
    }
    return null;
  },

];

function scoreLabel(pct) {
  return pct >= 76 ? "Smooth sailing"
       : pct >= 60 ? "A few rough edges"
       : pct >= 40 ? "Noticeably different"
       : "High friction";
}

// Dims where both landing in the unhealthy zone should penalise the score.
// Each entry: [dim, bothUnhealthy(a, b)]
const UNHEALTHY_SAME = [
  // most damaging when shared
  ["conflict",  (a, b) => a >= 2   && b >= 2,   0.4],
  ["stability", (a, b) => a >= 2   && b >= 2,   0.4],
  ["attach",    (a, b) => a >= 2   && b >= 2,   0.4],
  ["cconf",     (a, b) => a >= 2   && b >= 2,   0.4],
  // problematic when shared
  ["boundaries",(a, b) => a >= 2   && b >= 2,   0.5],
  ["auth",      (a, b) => a >= 2   && b >= 2,   0.5],
  ["differ",    (a, b) => a <= 0.8 && b <= 0.8, 0.5],
  // worth flagging but less severe
  ["admire",    (a, b) => a >= 2   && b >= 2,   0.7],
  ["empathy",   (a, b) => a >= 2   && b >= 2,   0.7],
];

const EXACT_SCORES = {
  values: [
    [1.00, 0.65, 0.55, 0.45], // Reliability
    [0.65, 1.00, 0.60, 0.70], // Respect
    [0.55, 0.60, 1.00, 0.45], // Growth
    [0.45, 0.70, 0.45, 1.00], // Ease
  ],
  direction: [
    [1.00, 0.25, 0.65, 0.60], // Stability
    [0.25, 1.00, 0.70, 0.55], // Freedom
    [0.65, 0.70, 1.00, 0.60], // Growth
    [0.60, 0.55, 0.60, 1.00], // Connection
  ],
  roles: [
    [1.00, 0.75, 0.45, 0.15],
    [0.75, 1.00, 0.65, 0.35],
    [0.45, 0.65, 1.00, 0.55],
    [0.15, 0.35, 0.55, 1.00],
  ],
};

/**
 * Score a single dimension given two values (0–3 scale).
 * Returns 0–1.
 */
function dimScore(dim, a, b) {
  const meta = DIM_META[dim];
  const type = meta ? meta.type : "sim";
  const diff = Math.abs(a - b);
  const scale = (meta && meta.max) || 3;

  let score;
  switch (type) {
    case "sim":
      score = 1 - diff / scale;
      break;

    case "overlap": {
      const s1 = pick2FromIndex(a);
      const s2 = pick2FromIndex(b);
      const intersection = s1.filter(x => s2.includes(x)).length;
      const maxPicked = Math.max(s1.length, s2.length);
      score = maxPicked === 0 ? 0 : intersection / maxPicked;
      break;
    }

    case "exact":
      score = EXACT_SCORES[dim]?.[a]?.[b] ?? (a === b ? 1 : 0);
      break;

    default:
      score = 1 - diff / 3;
  }

  const unhealthy = UNHEALTHY_SAME.find(([d]) => d === dim);
  if (unhealthy && unhealthy[1](a, b)) score *= unhealthy[2];

  return score;
}

// All possible selections for a 5-option pick-up-to-2 question, sorted for stable encoding.
// Index 0–4: single picks. Index 5–14: pairs.
const PICK2_COMBOS = [
  [0],[1],[2],[3],[4],
  [0,1],[0,2],[0,3],[0,4],
  [1,2],[1,3],[1,4],
  [2,3],[2,4],
  [3,4]
];

function pick2ToIndex(sel) {
  const sorted = [...sel].sort((a,b) => a-b);
  return PICK2_COMBOS.findIndex(c => c.length === sorted.length && c.every((v,i) => v === sorted[i]));
}

function pick2FromIndex(idx) {
  return PICK2_COMBOS[idx] || [0];
}

/**
 * Build a vector from answers + question set.
 * Returns { dim: value, ... }
 */
function buildVector(answers, questions) {
  const sums = {}, counts = {}, multi = {};
  questions.forEach((q, i) => {
    if (answers[i] === undefined) return;
    const d = q.dim;
    const meta = DIM_META[d];
    if (q.multiSelect) {
      if (meta && meta.type === "overlap") {
        multi[d] = answers[i];
      } else {
        // average the weights of selected options
        const sel = answers[i];
        if (!sums[d]) { sums[d] = 0; counts[d] = 0; }
        sel.forEach(idx => { sums[d] += q.w[idx]; counts[d]++; });
      }
    } else if (meta && meta.type === "exact") {
      multi[d] = answers[i];
    } else {
      if (!sums[d]) { sums[d] = 0; counts[d] = 0; }
      sums[d] += q.w[answers[i]];
      counts[d]++;
    }
  });
  const v = {};
  for (const d in sums) v[d] = parseFloat((sums[d] / counts[d]).toFixed(3));
  for (const d in multi) {
    const meta = DIM_META[d];
    v[d] = meta && meta.type === "overlap" ? pick2ToIndex(multi[d]) : multi[d];
  }
  return v;
}

/**
 * Calculate full compatibility between two vectors.
 * Returns { overall, dims: { dim: score }, label, insights }
 */
const DIM_WEIGHTS = {
  attach:    3.0,
  conflict:  3.0,
  stability: 3.0,
  boundaries: 2.5,
  auth:      2.0,
  admire:    2.0,
  values:    1.5,
  roles:     1.5,
  direction_children: 2.0,
  comm:      1.25,
  direction: 1.25,
  worldview: 1.25,
  lifestyle: 1.0,
};

// Each entry: [dim, isHealthy(v), isStretched(v)]
// isHealthy = the person modelling the growth behaviour
// isStretched = the person who benefits from exposure to it
const GROWTH_VECTORS = [
  ["conflict",  v => v.conflict  !== undefined && v.conflict  <= 1,   v => v.conflict  !== undefined && v.conflict  >= 2  ],
  ["empathy",   v => v.empathy   !== undefined && v.empathy   <= 0.8,  v => v.empathy   !== undefined && v.empathy   >= 2  ],
  ["auth",      v => v.auth      !== undefined && v.auth      <= 1,   v => v.auth      !== undefined && v.auth      >= 2  ],
  ["boundaries",v => v.boundaries!== undefined && v.boundaries<= 1,   v => v.boundaries!== undefined && v.boundaries>= 2  ],
  ["attach",    v => v.attach    !== undefined && v.attach    <= 1,   v => v.attach    !== undefined && v.attach    >= 1.5],
  ["stability", v => v.stability !== undefined && v.stability <= 0.8,  v => v.stability !== undefined && v.stability >= 2  ],
  ["differ",    v => v.differ    !== undefined && v.differ    >= 2,   v => v.differ    !== undefined && v.differ    <= 0.8],
];

// Cross-dim growth combos — patterns where the combination produces growth potential
// beyond what individual dims capture. Each fires when one person models the healthy
// end and the other is stretched, but the mechanism only works because of the second dim.
// Returns { text } | null. Adds 2 points + 2 possible when it fires (same weight as a mutual growth dim).
const GROWTH_COMBOS = [

  // Secure attachment + conflict avoidance: the secure person models that conflict doesn't
  // have to be dangerous AND that the relationship survives it. Neither dim alone captures this.
  function secureConflict(v1, v2) {
    const secure   = v => v.attach   !== undefined && v.attach   <= 1;
    const direct   = v => v.conflict !== undefined && v.conflict <= 1;
    const avoidant = v => v.conflict !== undefined && v.conflict >= 2;
    const v1Models = secure(v1) && direct(v1) && avoidant(v2);
    const v2Models = secure(v2) && direct(v2) && avoidant(v1);
    if (v1Models || v2Models) {
      return { text: "One person here is secure and doesn't avoid conflict. For someone who does avoid it, that combination — seeing that conflict doesn't end the relationship — is one of the few things that can actually shift the pattern. It only works if both people stay in it long enough for that to land." };
    }
    return null;
  },

  // Emotionally steady + open + reactive partner: steadiness alone doesn't help much,
  // but steadiness combined with genuine openness creates a safe reference point that
  // reactive people can actually use.
  function steadyOpenReactive(v1, v2) {
    const steadyOpen = v => v.stability !== undefined && v.auth      !== undefined &&
                            v.stability <= 0.8         && v.auth      <= 1;
    const reactive   = v => v.stability !== undefined && v.stability >= 2;
    const v1Models = steadyOpen(v1) && reactive(v2);
    const v2Models = steadyOpen(v2) && reactive(v1);
    if (v1Models || v2Models) {
      return { text: "One person is emotionally steady and genuinely open. For someone who runs more reactive, being close to that combination — not just calm, but calm and present — can quietly shift what regulated feels like from the inside. Not through being told to calm down. Through repeated exposure to what it looks like." };
    }
    return null;
  },

  // Depth-seeking + open person with a guarded depth-seeker: the open person creates
  // the conditions for the guarded person to actually go where they want to go.
  function openPullsGuardedDepth(v1, v2) {
    const openDeep   = v => v.auth !== undefined && v.depth !== undefined &&
                            v.auth <= 1           && v.depth <= 1;
    const guardedDeep = v => v.auth !== undefined && v.depth !== undefined &&
                             v.auth >= 2           && v.depth <= 1;
    const v1Models = openDeep(v1) && guardedDeep(v2);
    const v2Models = openDeep(v2) && guardedDeep(v1);
    if (v1Models || v2Models) {
      return { text: "One person wants real depth and is willing to go there openly. The other wants the same thing but takes a long time to lower their guard. The open person can create the conditions for the guarded one to actually go where they want to go — not by pushing, just by going first. That only works if the guarded person is genuinely pulled toward depth, which they are." };
    }
    return null;
  },

  // Independent + merged, both secure: security on both sides turns what would otherwise
  // be friction into a genuine learning opportunity about what closeness can look like.
  function independentMergedSecure(v1, v2) {
    const secureIndep  = v => v.attach !== undefined && v.differ !== undefined &&
                              v.attach <= 1           && v.differ >= 2;
    const secureMerged = v => v.attach !== undefined && v.differ !== undefined &&
                              v.attach <= 1           && v.differ <= 0.8;
    const v1Models = secureIndep(v1) && secureMerged(v2);
    const v2Models = secureIndep(v2) && secureMerged(v1);
    if (v1Models || v2Models) {
      return { text: "One person holds their independence inside the relationship without needing distance; the other leans toward togetherness. Both are secure. That combination means the independent person can show that closeness and selfhood aren't in conflict, and the merged person can show that togetherness doesn't have to feel suffocating. It only works because neither person is anxious about it." };
    }
    return null;
  },

];

function calcGrowth(v1, v2) {
  // Each dim contributes 0, 1, or 2 points out of a max of 2:
  //   2 = clear growth vector both ways (one healthy, one stretched)
  //   1 = one-way growth vector, OR both in healthy/mid range (functional baseline)
  //   0 = both in unhealthy same zone (stagnant)
  // Growth combos add 2 points + 2 possible when they fire.
  let points = 0;
  let possible = 0;

  GROWTH_VECTORS.forEach(([dim, healthy, stretched]) => {
    if (v1[dim] === undefined || v2[dim] === undefined) return;
    possible += 2;

    const v1GrowsFromV2 = healthy(v2) && stretched(v1);
    const v2GrowsFromV1 = healthy(v1) && stretched(v2);

    if (v1GrowsFromV2 && v2GrowsFromV1) {
      points += 2; // mutual growth
    } else if (v1GrowsFromV2 || v2GrowsFromV1) {
      points += 1; // one-way growth
    } else {
      const bothUnhealthy = UNHEALTHY_SAME.find(([d]) => d === dim);
      if (bothUnhealthy && bothUnhealthy[1](v1[dim], v2[dim])) {
        points += 0; // both stuck in same unhealthy pattern
      } else {
        points += 1; // both functional/mid — stable baseline
      }
    }
  });

  const combos = GROWTH_COMBOS.map(fn => fn(v1, v2)).filter(Boolean);
  combos.forEach(() => { points += 2; possible += 2; });

  const score = possible === 0 ? 0 : Math.round(points / possible * 100);
  return { score, label: growthLabel(score), combos };
}

function growthLabel(pct) {
  return pct >= 75 ? "A lot to learn from each other"
       : pct >= 55 ? "Uneven ground"
       : pct >= 35 ? "Stable ground"
       : "Similar blind spots";
}

function calcCompat(v1, v2) {
  const sharedDims = Object.keys(v1).filter(d => d in v2);
  if (!sharedDims.length) return null;

  const dims = {};
  sharedDims.forEach(d => {
    dims[d] = parseFloat(dimScore(d, v1[d], v2[d]).toFixed(3));
  });

  const totalWeight = sharedDims.reduce((s, d) => s + (DIM_WEIGHTS[d] || 1), 0);
  const overall = Math.round(
    sharedDims.reduce((s, d) => s + dims[d] * (DIM_WEIGHTS[d] || 1), 0) / totalWeight * 100
  );

  // Cross-dimension combo insights
  const insights = [];
  COMBO_INSIGHTS.forEach(fn => {
    const ins = fn(v1, v2);
    if (ins) insights.push(ins);
  });
  insights.sort((a, b) => (a.type === "strength" ? -1 : 1) - (b.type === "strength" ? -1 : 1));

  // Penalise based on diff combos only — strength combos already show in dim scores
  const comboNudge = insights.reduce((s, ins) => s + (ins.type === "diff" ? -3 : 0), 0);
  const adjusted = Math.min(100, Math.max(0, overall + comboNudge));

  const label = scoreLabel(adjusted);
  const growth = calcGrowth(v1, v2);

  return { overall: adjusted, dims, label, growth, insights, sharedDims, _v1: v1, _v2: v2 };
}

const DIM_ORDER = ["admire","attach","auth","boundaries","cconf","comm","conflict","depth","differ","direction","direction_children","drive","empathy","energy","finances","humor","intimacy","lifestyle","lovelang","passion","rhythm","roles","space","stability","values","worldview"];
const CODE_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeVector(v) {
  return DIM_ORDER.map(d => {
    if (v[d] === undefined) return "_";
    const meta = DIM_META[d];
    const val = meta && (meta.type === "overlap" || meta.type === "exact") ? Math.round(v[d]) : Math.round(v[d] * 10);
    return CODE_CHARS[val] || "0";
  }).join("");
}

function decodeVector(code) {
  if (!code || code.length !== DIM_ORDER.length) return null;
  const v = {};
  for (let i = 0; i < DIM_ORDER.length; i++) {
    if (code[i] === "_") continue;
    const idx = CODE_CHARS.indexOf(code[i]);
    if (idx === -1) return null;
    const meta = DIM_META[DIM_ORDER[i]];
    v[DIM_ORDER[i]] = meta && (meta.type === "overlap" || meta.type === "exact") ? idx : idx / 10;
  }
  return v;
}
