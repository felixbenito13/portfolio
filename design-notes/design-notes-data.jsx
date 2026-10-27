/* design-notes/design-notes-data.jsx, categories and posts for the Design Notes section */

const NOTE_CATEGORIES = [
  { id: 'all',        label: 'All' },
  { id: 'strategy',   label: 'Strategy' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'craft',      label: 'Craft' },
  { id: 'ai',         label: 'AI' },
  { id: 'creativity', label: 'Creativity' },
  { id: 'breakdown',  label: 'Breakdown' },
];

const NOTE_ORDER = ['breakdown-01-amazon-homepage', 'where-creativity-comes-from', 'alignment-happens-before-the-file-opens'];

const NOTES = {

  'breakdown-01-amazon-homepage': {
    slug: 'breakdown-01-amazon-homepage',
    category: 'breakdown',
    categoryLabel: 'Breakdown',
    title: 'When Everything Is a Deal, Nothing Feels Like a Deal',
    subtitle: 'Design Notes: Breakdown #01. A UX look at Amazon Brazil’s homepage, and what I’d test differently.',
    date: '2026-10-27',
    dateLabel: 'Oct 2026',
    readTime: '4 min read',
    cover: 'assets/breakdown-01-amazon-homepage-cover.jpg',
    coverAlt: 'Breakdown #01, When Everything Is a Deal, Nothing Feels Like a Deal, a UX breakdown of Amazon’s homepage by Felix Benito',
    excerpt: 'A new series on the design decisions behind platforms everyone knows. First up: Amazon Brazil’s homepage, weeks before Black Friday.',
    metaDescription: 'A design & brand lead breaks down Amazon Brazil’s homepage: highlights, grid, visual clutter and personalization, plus what he’d test differently.',
    body: [
      { type: 'video', src: 'assets/breakdown-01-amazon-homepage.mp4', poster: 'assets/breakdown-01-amazon-homepage-poster.jpg', w: 1600, h: 862,
        label: 'Breakdown #01 video with captions: Felix Benito walks through Amazon Brazil’s homepage in Figma, marking highlights, grid, visual clutter and personalization',
        caption: 'Breakdown #01 in video: the whole homepage, top to bottom, in about three minutes.' },

      { type: 'p', text: 'Design Notes: Breakdown is a new series where I take a platform everyone knows and look at the design decisions behind it. The goal isn’t to criticize. It’s to understand the reasoning behind the screen, and to share what I would test differently.' },
      { type: 'p', text: 'First up: Amazon Brazil’s homepage, a few weeks before Black Friday. I scrolled from top to bottom and stopped at four points: highlights, grid, visual clutter, and personalization.' },

      { type: 'h2', text: '1. Highlight: When Every Banner Is Orange' },
      { type: 'p', text: 'Right at the top, Amazon uses color to grab attention. The banners get colored backgrounds, especially the orange ones, and that works: color creates instant hierarchy and pulls your eye to the offer.' },
      { type: 'p', text: 'The problem is that almost every banner gets the same treatment. Orange next to orange next to orange, and they start competing with each other. When everything is highlighted, nothing really is.' },
      { type: 'p', text: 'I would create one banner specifically for the main promotion and focus on it, letting the other banners step back so the one that matters can actually stand out.' },
      { type: 'image', src: 'assets/breakdown-01-amazon-highlight.jpg', w: 1200, h: 630,
        alt: 'Top of Amazon Brazil’s homepage with several orange promotional banners side by side, marked as point 1, Highlight',
        caption: 'The top of the page: several orange banners, all asking for attention at once.' },

      { type: 'h2', text: '2. Grid: Four Columns, Different Rules' },
      { type: 'p', text: 'The homepage runs on a four-column grid, but the grid changes from section to section. Some cards show a two-by-two product block, some show a single image, some mix both, and in some rows the cards stop following the columns altogether.' },
      { type: 'p', text: 'That flexibility makes sense for a company where many teams plug their own campaigns into the same page. The cost is rhythm: every new row asks your eye to learn a new layout.' },
      { type: 'p', text: 'I would create consistency through patterns: a small set of card templates, shared across sections, so the page feels like one system while you scroll.' },
      { type: 'image', src: 'assets/breakdown-01-amazon-grid.jpg', w: 1200, h: 630,
        alt: 'Amazon Brazil homepage product sections outlined in red, showing four columns whose card layouts change from row to row, marked as point 2, Grid',
        caption: 'The grid marked in red: four columns, but each section plays by its own rules.' },

      { type: 'h2', text: '3. Polluted: Too Many Options, Too Little Space' },
      { type: 'p', text: 'As you keep scrolling, the page is full of products. Some sit on colorful backgrounds, others on white or grey ones, and red discount badges appear almost everywhere.' },
      { type: 'p', text: 'In my opinion, it’s simply too many options. As a user, I don’t know which product to choose or where to look first. When everything is a deal, nothing feels like a deal.' },
      { type: 'p', text: 'I would create more white space around the products, keep the backgrounds clean, and show fewer things at once, saving color for the one or two highlights that really deserve it.' },
      { type: 'image', src: 'assets/breakdown-01-amazon-polluted.jpg', w: 1200, h: 630,
        alt: 'Dense Amazon Brazil homepage sections with purple and yellow-green product backgrounds and red discount badges, marked as point 3, Polluted',
        caption: 'Purple, green, and yellow-green backgrounds, plus discount badges: everything competes for the same attention.' },

      { type: 'h2', text: '4. Personalization: Looking Back vs. Looking Ahead' },
      { type: 'p', text: 'At the end of the page, Amazon shows two rows built from my browsing history: what other customers viewed after seeing the same products, and the products I viewed myself. It’s a reminder, an attempt to close a sale I left open.' },
      { type: 'p', text: 'I would change this to something based on what I actually purchased: “Based on your purchase, customers also bought…”. Less “come back to this,” more “here’s what’s next.”' },
      { type: 'image', src: 'assets/breakdown-01-amazon-personalization.jpg', w: 1200, h: 630,
        alt: 'Two Amazon Brazil recommendation rows based on browsing history, with design and marketing books and recently viewed products, marked as point 4, Personalization',
        caption: 'Two rows built from browsing history, pointing back to what I already looked at.' },

      { type: 'h2', text: 'Takeaway: Hierarchy Needs Contrast' },
      { type: 'p', text: 'Hierarchy needs contrast, and contrast needs restraint. When everything on the page calls for your attention, nothing gets highlighted. Focus on fewer things, and the highlights you keep become much stronger.' },
      { type: 'p', text: 'What would you change on Amazon’s homepage? Let me know in the comments. See you in the next Breakdown.' },
      { type: 'note', text: 'Independent analysis. I have no affiliation with Amazon. Screenshots are used for commentary and education.' },
    ],
  },

  'where-creativity-comes-from': {
    slug: 'where-creativity-comes-from',
    category: 'creativity',
    categoryLabel: 'Creativity',
    title: 'Where Creativity Comes From',
    subtitle: 'Six unconventional habits I use to keep my creative mind fresh, even on cloudy days.',
    date: '2026-10-26',
    dateLabel: 'Oct 2026',
    readTime: '4 min read',
    cover: 'assets/where-creativity-comes-from-cover.jpg',
    coverAlt: 'Where Creativity Comes From, a Design Notes creativity post by Felix Benito',
    excerpt: 'Ideas rarely show up on demand. Six habits, almost none of them in front of a screen, that keep my creative mind rested, curious and open.',
    metaDescription: 'A design & brand lead’s 6 unconventional habits for daily creativity: travel, sketching, talking with strangers, campaign mapping, music and the classics.',
    body: [
      { type: 'p', text: 'After years of working in design and marketing, with the daily challenge of creating something new, I’ve learned that ideas rarely show up on demand. They show up when the mind is rested, curious, and open enough to catch them.' },
      { type: 'p', text: 'Over time, I developed a few habits that keep my mind refreshed and ready to receive small daily insights, which I then turn into part of my work. Almost none of them happen in front of a screen. Today I want to share some of these unconventional techniques, the ones that keep my creativity going every day, even on cloudy days.' },

      { type: 'h2', text: 'Creativity Is a Muscle' },
      { type: 'p', text: 'Creativity works like a muscle. If you don’t train it, it weakens. If you keep it fresh and keep working on it, the effort pays off in the long term, not only in the job you’re doing today, but in how sharp and healthy your mind stays over the years. It’s also my way of avoiding what Pink Floyd called “Brain Damage.”' },
      { type: 'p', text: 'These are the habits that have been helping me.' },

      { type: 'h2', text: '6 Habits That Keep My Creativity Fresh' },

      { type: 'h3', text: '1. Travel and Discover a New Culture' },
      { type: 'p', text: 'A new café, a song playing on the street, a theater, a mountain, the sea. Traveling sparks creativity in so many ways that it’s hard to describe. It doesn’t matter if it’s a city close to where you live or another country: travel is usually the number one tip I give.' },
      { type: 'p', text: 'Every new place breaks the patterns your brain runs on autopilot. New colors, new sounds, new ways of solving everyday problems, and suddenly you’re looking at your own work with fresh eyes.' },
      { type: 'image', src: 'assets/creativity-vinicunca-rainbow-mountain.jpg', w: 1200, h: 630,
        alt: 'Felix Benito with arms open beside the Montaña Vinicunca sign on the Rainbow Mountain in Peru, with striped red, yellow and green slopes behind him',
        caption: 'Vinicunca, the Rainbow Mountain in Peru. Some color palettes you only find by getting there.' },

      { type: 'h3', text: '2. Cultivate an Art Hobby' },
      { type: 'p', text: 'I love drawing, and lately I’ve been focusing on urban sketching. Stepping away from the computer to see the real world through its colors, shapes and shadows, and trying to translate it into a quick, freestyle drawing, trains me to pay attention to my surroundings and to keep asking: how can I simplify this and put it on paper?' },
      { type: 'p', text: 'That’s the same question I ask in every design project. Other hobbies work just as well: playing music, singing, making things by hand. They all spark creativity.' },
      { type: 'image', src: 'assets/creativity-urban-sketch-cusco.jpg', w: 1200, h: 630,
        alt: 'Ink urban sketch of the domes of the Iglesia de la Compañía de Jesús held up in front of the real church in Cusco, Peru',
        caption: 'Sketching the Iglesia de la Compañía de Jesús in Cusco. Seeing, simplifying, putting it on paper.' },

      { type: 'h3', text: '3. Talk With Strangers' },
      { type: 'p', text: 'A fun way to be more creative is to talk with at least one stranger a day. Figuring out how to start a conversation and keep the connection going is a challenge in itself, and you’ll discover your own ways to do it.' },
      { type: 'p', text: 'It doesn’t matter who the person is: the cashier, the Uber driver, someone at the gym. These conversations can bring real, and often fun, discoveries. And as designers, listening to people outside our own bubble is never wasted time.' },
      { type: 'image', src: 'assets/creativity-talk-with-strangers-peru.jpg', w: 1200, h: 630,
        alt: 'Selfie of Felix Benito in sunglasses with his mototaxi driver during a ride in Peru',
        caption: 'A selfie with my mototaxi driver in Peru. A short ride, a long conversation, a new view of the city.' },

      { type: 'h3', text: '4. Map the Most Engaging Campaigns on Social Media' },
      { type: 'p', text: 'I enjoy following big tech companies, and small ones too, that do a great job engaging their audience. So I started mapping them: a doc where I log each post, the data behind it, and what I find creative about it.' },
      { type: 'p', text: 'It has become my personal library of inspiration. Every once in a while, I go back and revisit the collection.' },
      { type: 'image', src: 'assets/creativity-campaign-library.jpg', w: 1200, h: 630,
        alt: 'Social media analysis document logging an Instagram carousel post with its content type, post format and a creativity score',
        caption: 'My campaign library: each post logged by content type, format, and a score for creativity and execution.' },

      { type: 'h3', text: '5. Listen to Different Music Every Day' },
      { type: 'p', text: 'When I was younger, I used to read music blogs to discover new bands in the styles I liked. Today, with YouTube and streaming, it’s even easier. So whenever I’m at the gym, I’m always discovering a new band.' },
      { type: 'p', text: 'Different genres bring different rhythms, structures and moods, and that variety finds its way into the work.' },
      { type: 'image', src: 'assets/creativity-listening-history.jpg', w: 1200, h: 630,
        alt: 'Streaming app listening history mixing Iron Maiden, Manu Chao, Natiruts and the Ramones, with John Coltrane’s My Favorite Things playing',
        caption: 'From Iron Maiden to Manu Chao, Natiruts, the Ramones and John Coltrane. A regular week in my listening history.' },

      { type: 'h3', text: '6. Read the Classics' },
      { type: 'p', text: 'The classics of literature earned that label for a reason: thousands of people have enjoyed them and taken different lessons from them over the years. I really recommend them.' },
      { type: 'p', text: 'Right now I’m reading Moby Dick by Herman Melville, and to my surprise, I’m really enjoying that adventure at sea. Imagining the scenarios, the descriptions and the way the story unfolds will certainly help improve your creativity.' },
      { type: 'image', src: 'assets/creativity-reading-the-classics.jpg', w: 1200, h: 630,
        alt: 'Open book on the chapter Analyzing the Competition, with the opening quote highlighted in yellow and a highlighter beside it',
        caption: 'Reading with a highlighter in hand. Literature for imagination, strategy books for method.' },

      { type: 'h2', text: 'Creativity Is a Daily Practice' },
      { type: 'p', text: 'These are some of the unconventional habits that help me be more creative in my daily routine. None of them happen in front of a screen, but all of them end up there eventually.' },
      { type: 'p', text: 'What about you? I’d love to hear the techniques that keep your creativity fresh.' },
    ],
  },

  'alignment-happens-before-the-file-opens': {
    slug: 'alignment-happens-before-the-file-opens',
    category: 'strategy',
    categoryLabel: 'Strategy',
    title: 'Alignment Happens Before the File Opens',
    subtitle: 'A stakeholder alignment and UX strategy framework for designers who want to lead, not just execute.',
    date: '2026-09-09',
    dateLabel: 'Sep 2026',
    readTime: '5 min read',
    cover: 'assets/alignment-happens-before-the-file-opens-cover.jpg',
    coverAlt: 'Alignment Happens Before the File Opens, a Design Notes strategy post by Felix Benito',
    excerpt: 'Opening Figma before alignment feels proactive. It usually isn’t. A 5-step framework for research and stakeholder alignment before any screen gets built.',
    metaDescription: 'A UX and brand strategist’s 5-step framework for stakeholder alignment and research before any screen gets designed, from executor to strategist.',
    body: [
      { type: 'p', text: 'In a world of packed agendas, endless to-do lists, gym sessions, social commitments, family duties, and constant pressure to perform and lead, it’s easy to fall into a trap: opening Figma before the real alignment with managers and stakeholders has happened.' },
      { type: 'p', text: 'It feels productive. It feels proactive. But it can quietly become the opposite of what you intended, and instead of showing initiative, it can show that you’re an executor, not a strategist.' },
      { type: 'p', text: 'Early in your career, that mistake rarely costs much. But once you move into a senior or leadership role, it can undermine your credibility right from the start.' },

      { type: 'h2', text: 'The Mistake I Made: Skipping Stakeholder Alignment' },
      { type: 'p', text: 'A few years ago, when I stepped into a senior position, I wanted to bring results as fast as possible. So instead of aligning objectives with the team first, I jumped straight to solutions based on my own point of view.' },
      { type: 'p', text: 'The problem was that my perspective wasn’t ready yet. I didn’t have the context to understand what was really happening behind the scenes, the details that could have improved my results or even changed my whole approach.' },
      { type: 'p', text: 'Onboarding alone is rarely enough to grasp the layers of a business, a market, and its customers. It takes more: additional rounds of meetings, research, interviews, competitive analysis, and a close read of digital marketing trends. All of that is what actually clarifies how a product should be built or evolved.' },
      { type: 'p', text: 'Driven by the fear of not showing results quickly enough, I started building screens, drafting a design system, and adjusting the brand. When I presented the work to the team, the developers pushed back, citing technical restrictions I hadn’t accounted for. The manager liked the design system idea, but for later, not now. The brand adjustments met the same fate. What actually mattered at that moment were bugs in the checkout flow.' },

      { type: 'image', src: 'assets/alignment-design-system-definitions.jpg', w: 1200, h: 630,
        alt: 'Brand definitions slide listing archetypes, brand tone and voice, colors, typography and symbol guidelines',
        caption: 'The design system and brand definitions I rushed to build, before the business had confirmed they were even a priority.' },

      { type: 'p', text: 'I split my energy across several initiatives instead of focusing on the one that mattered, and none of them landed as well as they should have.' },
      { type: 'p', text: 'That was my first real lesson: wrong focus leads to wrong deliveries, and wrong deliveries waste time and energy on things that were never the priority.' },
      { type: 'p', text: 'Every project is different: different teams, different markets, different constraints. But that experience shaped a framework I still use and keep refining today.' },

      { type: 'h2', text: 'A Stakeholder Alignment Framework for UX Strategists' },

      { type: 'h3', text: '1. Pre-Onboarding' },
      { type: 'p', text: 'Before the first onboarding meeting, I research the company, its competitors, and the market, then prepare a board of questions I need answered. If the onboarding doesn’t cover them, I ask directly or follow up afterward to fill the gaps.' },

      { type: 'image', src: 'assets/alignment-business-model-canvas.jpg', w: 1200, h: 630,
        alt: 'Business model canvas mapping key partners, activities, resources, customer relationships and value proposition',
        caption: 'Mapping the business model canvas is part of the homework I do before the first onboarding call.' },

      { type: 'h3', text: '2. A Living UX Research Board' },
      { type: 'p', text: 'Big projects come with layers: stakeholders, constraints, hidden details. I don’t rely on memory. I keep a research board that grows continuously as I learn more about the business, a single source of truth I can always return to.' },

      { type: 'image', src: 'assets/alignment-empathy-map.jpg', w: 1200, h: 630,
        alt: 'UX empathy map capturing what the user thinks and feels, used in stakeholder alignment research',
        caption: 'An empathy map is one of the living artifacts I keep updating as I learn more about the people behind the product.' },

      { type: 'h3', text: '3. A Clear Roadmap' },
      { type: 'p', text: 'I need clarity on business objectives and priorities as early as possible, ideally during onboarding itself. I like to map out what I’ll learn, when it will happen, and when the actual work begins.' },

      { type: 'h3', text: '4. Stakeholder Alignment' },
      { type: 'p', text: 'In larger companies, different areas often have their own goals, and those goals don’t always line up with the broader business objectives. Sometimes a legal or operational constraint from another sector can block what you’re building entirely. Talking to a wide range of stakeholders early on helps you avoid building something that can’t actually be used.' },

      { type: 'image', src: 'assets/alignment-personas.jpg', w: 1200, h: 630,
        alt: 'User persona profile showing background, goals, pain points and personality traits for UX research',
        caption: 'Personas turn scattered research into a shared reference point for every stakeholder conversation.' },

      { type: 'h3', text: '5. Constant Communication' },
      { type: 'p', text: 'I break projects into small pieces and share them with leadership along the way to confirm I’m on the right path. It’s the core of agile methodology, and it consistently saves time and effort.' },

      { type: 'h2', text: 'Alignment Is a Practice, Not a Checkbox' },
      { type: 'p', text: 'This is how I work today, and it keeps evolving. Structuring alignment before execution has consistently helped me deliver the right results on the right priorities. It’s a practice that never really ends, but every project makes it a little sharper.' },
      { type: 'p', text: 'If you’ve ever opened the file too soon, you’re not alone. The difference between a strategist and an executor isn’t talent. It’s the discipline to pause before you build.' },
    ],
  },

};
