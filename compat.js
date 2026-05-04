const DIM_META = {
  // Gottman: bids for connection, directness vs. processing time as a predictor of unspoken accumulation
  comm:           { label: "Communication",    type: "sim",   lo: "Direct",           hi: "Async"           },
  // Gottman: pursue-withdraw pattern; EFT (Johnson): negative cycle management; too-similar avoiders = festering
  conflict:       { label: "Conflict style",   type: "sim",   lo: "Head-on",          hi: "Avoidant"        },
  // Big Five extraversion; sim type – two introverts or two extroverts are genuinely compatible
  energy:         { label: "Social energy",    type: "sim",   lo: "Social",           hi: "Solitary"        },
  // Life-goals alignment research; Schwartz value theory – foundational beliefs predict friction under pressure
  values:         { label: "Values",           type: "sim",   lo: "Reliable",         hi: "Independent"     },
  // Contact frequency as attachment expression; links to anxious vs. avoidant baseline needs
  rhythm:         { label: "Rhythm",           type: "sim",   lo: "Frequent contact", hi: "Organic"         },
  // Big Five agreeableness; EFT emotional attunement
  empathy:        { label: "Support style",     type: "sim",   lo: "Emotional",        hi: "Practical"       },
  // Schnarch: self-validated intimacy – willingness to be fully seen; zone because both extremes carry risk
  auth:           { label: "Authenticity",     type: "sim",   lo: "Open",             hi: "Guarded"         },
  // Sternberg: intimacy vertex (closeness, bondedness); appetite for meaningful vs. surface conversation
  depth:          { label: "Depth",            type: "sim",   lo: "Conceptual",       hi: "Practical"       },
  // Shared comedic register as social bonding signal; mismatched humour slows rapport under guardedness
  humor:          { label: "Humour",           type: "sim",   lo: "Absurdist",        hi: "Playful"         },
  // Schnarch: differentiation – naming limits without fusion or distance; Tatkin: secure functioning
  boundaries:     { label: "Boundaries",       type: "sim",   lo: "Direct",           hi: "Absorbs quietly" },
  // Bowlby / Hazan & Shaver / Johnson: secure, anxious, avoidant patterns; zone catches both extremes
  attach:         { label: "Attachment",       type: "sim",   display: "category", cats: ["Secure", "Anxious", "Avoidant", "Disorganised"] },
  // Sternberg: intimacy vertex; Schnarch: self-validated vs. other-validated closeness needs
  intimacy:       { label: "Intimacy",         type: "sim",   lo: "Vulnerable",       hi: "Quiet presence"  },
  // Life-stage alignment research: children, geography, lifestyle – misalignment is a slow-burn incompatibility
  direction:      { label: "Direction",        type: "sim",   lo: "Settled",          hi: "Open future"     },
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
  drive:          { label: "Ambition & money", type: "sim",   lo: "Achievement-driven", hi: "Lifestyle-led" },
  // Relationship satisfaction research: domestic compatibility (tidiness, space, privacy) is a persistent low-level stressor when mismatched
  space:          { label: "Space & tidiness", type: "sim",   lo: "Ordered",          hi: "Relaxed"         },
  // Schwartz value theory: universalism/tradition axis; religious orientation predicts friction on rituals, meaning-making, and major life decisions
  worldview:      { label: "Worldview",        type: "sim",   lo: "Faith-led",        hi: "Secular"         },
  // Financial compatibility research: money pooling, decision autonomy, and spending asymmetry are persistent friction sources in cohabiting couples
  finances:       { label: "Finances",         type: "sim",   lo: "Shared",           hi: "Independent"     },
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
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You share a similar foundation: reliability, routine, and showing up for people. The relationship is likely to feel grounded and consistent." };
      if (ba === "mid")  return { type: "strength", text: "Similar values around autonomy and experience. You both want room to grow without sacrificing the connection. A generative combination." };
      if (ba === "high") return { type: "strength", text: "You both prioritise ease and low-pressure connection. The relationship is unlikely to feel demanding or suffocating." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "Your values pull in different directions: one toward reliability and commitment, the other toward ease and independence. Not incompatible, but worth naming before it becomes a quiet source of friction." };
    }
    return { type: "diff", text: "Slight value differences. Probably compatible in practice, but worth knowing where each of you places their priorities when things get hard." };
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
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "Your humour runs in similar channels: absurdist, strange, a little chaotic. You'll make each other laugh in ways most people wouldn't understand, and that shared frequency tends to create real closeness." };
      if (ba === "mid")  return { type: "strength", text: "Dry wit and irony on both sides. The dynamic is likely to be sharp and fun. You'll pick up on each other's subtext without having to flag it." };
      if (ba === "high") return { type: "strength", text: "You're both reactive and observational. You find the funny in whatever's in front of you. Easy to laugh together, low risk of jokes landing wrong." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "Different comedic sensibilities. One of you needs a specific receiver: absurdist or dry humour requires calibration. The other is more reactive and open. This rarely breaks a connection, but early on the niche humour can read as cold or strange before the other person has the key to it." };
    }
    return { type: "diff", text: "Slightly different humour styles, probably close enough to find a shared register quickly. The main thing to watch is teasing: what reads as playful in one style can land as pointed in another." };
  },

  boundaries(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both name limits directly and early. There's little chance of slow-building resentment between you." };
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
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You're both oriented toward stability: a settled life, commitment, probably a family. Long-term alignment is strong." };
      if (ba === "mid")  return { type: "strength", text: "You're at similar life stages and broadly aligned on where you're heading. Enough common ground not to be pulling in opposite directions." };
      if (ba === "high") return { type: "strength", text: "You're both comfortable with an open, unscripted future. Low pressure, no fixed plan." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you wants a settled, structured life; the other wants to keep things open. This is worth a real conversation. Quietly hoping the other will come around rarely ends well." };
    }
    return { type: "diff", text: "Slightly different long-term orientations. Worth checking in on what you both actually want a few years from now, not to make a plan, but to know you're pointing in roughly the same direction." };
  },

  lovelang(a, b) {
    const cats = ["acts of service", "gifts", "touch", "words of affirmation", "quality time"];
    const s1 = lovelangFromIndex(a);
    const s2 = lovelangFromIndex(b);
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
      if (ba === "low")  return { type: "strength", text: "You're both ambitious and career-oriented, and you both spend freely. You'll understand each other's drive and won't clash over how money gets used." };
      if (ba === "mid")  return { type: "strength", text: "Similar orientations toward work and money. Neither of you is likely to feel the other is reckless or checked out." };
      if (ba === "high") return { type: "strength", text: "You both treat work as a means to an end and lean toward financial caution. A low-friction combination when it comes to lifestyle decisions." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you is driven by achievement and spends freely; the other prioritises ease and financial security. This gap tends to stay invisible until a real decision: a move, a job change, a big purchase, that forces it into the open." };
    }
    return { type: "diff", text: "Slightly different attitudes toward work and money. Worth knowing where each of you lands before you're making shared decisions." };
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

  finances(a, b) {
    const ba = bucket(a), bb = bucket(b);
    if (ba === bb) {
      if (ba === "low")  return { type: "strength", text: "You both want finances fully or mostly shared. The practical layer of the relationship is likely to feel like a team effort." };
      if (ba === "mid")  return { type: "strength", text: "Similar attitudes toward money and decisions. Neither of you is likely to feel overruled or financially exposed." };
      if (ba === "high") return { type: "strength", text: "You both value financial independence and individual decision-making. No one will feel their autonomy is being negotiated away." };
    }
    if ((ba === "low" && bb === "high") || (ba === "high" && bb === "low")) {
      return { type: "diff", text: "One of you wants a shared financial life; the other wants to keep things independent. This gap tends to feel abstract until you're actually living together, then it surfaces in almost every practical decision." };
    }
    return { type: "diff", text: "Different instincts around money and decision-making. Worth being explicit about what each of you expects before those expectations quietly become assumptions." };
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
    const valuesClose = Math.abs(v1.values - v2.values) <= 0.8;
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
    const humorFar    = Math.abs(v1.humor - v2.humor) >= 1.5;
    const bothGuarded = v1.auth >= 2 && v2.auth >= 2;
    if (humorFar && bothGuarded) {
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
    const freedomSeeker = v => v.values >= 2.2;
    const rhythmFar = Math.abs(v1.rhythm - v2.rhythm) >= 1.5;
    if ((freedomSeeker(v1) || freedomSeeker(v2)) && rhythmFar) {
      return { tab: "friendship", type: "diff", text: "One of you values freedom and spontaneity; you have quite different contact rhythms. The structure-inclined person may read the other's looseness as indifference. Worth being explicit about what reliability looks like to each of you. It's probably not the same thing." };
    }
    return null;
  },

  function depthHumor(v1, v2) {
    if (v1.depth === undefined || v2.depth === undefined) return null;
    if (v1.humor === undefined || v2.humor === undefined) return null;
    const deepBoth   = v1.depth <= 1 && v2.depth <= 1;
    const humorClose = Math.abs(v1.humor - v2.humor) <= 0.8;
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
    const diff = Math.abs((v1.lovelang || 0) - (v2.lovelang || 0));
    const lowEmpathy = v => v.empathy !== undefined && v.empathy >= 2;
    if (diff >= 1.5 && (lowEmpathy(v1) || lowEmpathy(v2))) {
      return { tab: "relationship", type: "diff", text: "You speak different love languages, and at least one of you defaults to practical action over emotional attunement. Care is likely being given. It's just not being received in the form the other person recognises. Worth making it explicit." };
    }
    return null;
  },

  function valuesDirection(v1, v2) {
    if (v1.values === undefined || v2.values === undefined) return null;
    if (v1.direction === undefined || v2.direction === undefined) return null;
    const valuesClose  = Math.abs(v1.values - v2.values) <= 0.8;
    const directionFar = Math.abs(v1.direction - v2.direction) >= 1.5;
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
    const directionFar = Math.abs(v1.direction - v2.direction) >= 1.5;
    if (driveFar && directionFar) {
      return { tab: "relationship", type: "diff", text: "You want different things from the future and have different orientations toward work and money. These two gaps tend to compound: lifestyle decisions, financial priorities, and long-term plans all pull in different directions at once." };
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
    const directionClose = Math.abs(v1.direction - v2.direction) <= 0.8;
    if (driveClose && directionClose) {
      return { tab: "relationship", type: "strength", text: "Similar ambitions, similar attitudes toward money, and a shared sense of where you're both heading. The practical layer of a relationship: the decisions, the trade-offs, the plans, is unlikely to be a source of friction between you." };
    }
    return null;
  },

];

function scoreLabel(pct) {
  return pct >= 80 ? "Smooth sailing"
       : pct >= 65 ? "A few rough edges"
       : pct >= 45 ? "Requires real effort"
       : "High friction";
}

/**
 * Score a single dimension given two values (0–3 scale).
 * Returns 0–1.
 */
function dimScore(dim, a, b) {
  const meta = DIM_META[dim];
  const type = meta ? meta.type : "sim";
  const diff = Math.abs(a - b);

  switch (type) {
    case "sim":
      return 1 - diff / 3;

    case "overlap": {
      // Jaccard similarity on the two love language selections
      const s1 = new Set(lovelangFromIndex(a));
      const s2 = new Set(lovelangFromIndex(b));
      const intersection = [...s1].filter(x => s2.has(x)).length;
      const union = new Set([...s1, ...s2]).size;
      return union === 0 ? 0 : intersection / union;
    }

    default:
      return 1 - diff / 3;
  }
}

// All possible selections for a 5-option pick-up-to-2 question, sorted for stable encoding.
// Index 0–4: single picks. Index 5–14: pairs.
const LOVELANG_COMBOS = [
  [0],[1],[2],[3],[4],
  [0,1],[0,2],[0,3],[0,4],
  [1,2],[1,3],[1,4],
  [2,3],[2,4],
  [3,4]
];

function lovelangToIndex(sel) {
  const sorted = [...sel].sort((a,b) => a-b);
  return LOVELANG_COMBOS.findIndex(c => c.length === sorted.length && c.every((v,i) => v === sorted[i]));
}

function lovelangFromIndex(idx) {
  return LOVELANG_COMBOS[idx] || [0];
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
    if (q.multiSelect) {
      const meta = DIM_META[d];
      if (meta && meta.type === "overlap") {
        multi[d] = answers[i];
      } else {
        // average the weights of selected options
        const sel = answers[i];
        if (!sums[d]) { sums[d] = 0; counts[d] = 0; }
        sel.forEach(idx => { sums[d] += q.w[idx]; counts[d]++; });
      }
    } else {
      if (!sums[d]) { sums[d] = 0; counts[d] = 0; }
      sums[d] += q.w[answers[i]];
      counts[d]++;
    }
  });
  const v = {};
  for (const d in sums) v[d] = parseFloat((sums[d] / counts[d]).toFixed(3));
  for (const d in multi) v[d] = lovelangToIndex(multi[d]);
  return v;
}

/**
 * Calculate full compatibility between two vectors.
 * Returns { overall, dims: { dim: score }, label, insights }
 */
const DIM_WEIGHTS = {
  attach:    1.5,
  conflict:  1.5,
  values:    1.5,
  stability: 1.5,
  comm:      1.25,
  direction: 1.25,
  worldview: 1.25,
  admire:    1.25,
};

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

  const label = scoreLabel(overall);

  // Cross-dimension combo insights only (per-dim insights rendered inline with cards)
  const insights = [];
  COMBO_INSIGHTS.forEach(fn => {
    const ins = fn(v1, v2);
    if (ins) insights.push(ins);
  });
  insights.sort((a, b) => (a.type === "strength" ? -1 : 1) - (b.type === "strength" ? -1 : 1));

  return { overall, dims, label, insights, sharedDims, _v1: v1, _v2: v2 };
}

const DIM_ORDER = ["admire","attach","auth","boundaries","cconf","comm","conflict","depth","differ","direction","drive","empathy","energy","finances","humor","intimacy","lovelang","passion","rhythm","space","stability","values","worldview"];
const CODE_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeVector(v) {
  return DIM_ORDER.map(d => {
    if (v[d] === undefined) return "_";
    const meta = DIM_META[d];
    const val = meta && meta.type === "overlap" ? Math.round(v[d]) : Math.round(v[d] * 10);
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
    v[DIM_ORDER[i]] = meta && meta.type === "overlap" ? idx : idx / 10;
  }
  return v;
}
