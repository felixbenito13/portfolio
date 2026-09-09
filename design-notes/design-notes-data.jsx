/* design-notes/design-notes-data.jsx, categories and posts for the Design Notes section */

const NOTE_CATEGORIES = [
  { id: 'all',        label: 'All' },
  { id: 'strategy',   label: 'Strategy' },
  { id: 'craft',      label: 'Craft' },
  { id: 'ai',         label: 'AI' },
  { id: 'creativity', label: 'Creativity' },
];

const NOTE_ORDER = ['alignment-happens-before-the-file-opens'];

const NOTES = {

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

      { type: 'image', src: 'assets/alignment-design-system-definitions.jpg',
        alt: 'Brand definitions slide listing archetypes, brand tone and voice, colors, typography and symbol guidelines',
        caption: 'The design system and brand definitions I rushed to build, before the business had confirmed they were even a priority.' },

      { type: 'p', text: 'I split my energy across several initiatives instead of focusing on the one that mattered, and none of them landed as well as they should have.' },
      { type: 'p', text: 'That was my first real lesson: wrong focus leads to wrong deliveries, and wrong deliveries waste time and energy on things that were never the priority.' },
      { type: 'p', text: 'Every project is different: different teams, different markets, different constraints. But that experience shaped a framework I still use and keep refining today.' },

      { type: 'h2', text: 'A Stakeholder Alignment Framework for UX Strategists' },

      { type: 'h3', text: '1. Pre-Onboarding' },
      { type: 'p', text: 'Before the first onboarding meeting, I research the company, its competitors, and the market, then prepare a board of questions I need answered. If the onboarding doesn’t cover them, I ask directly or follow up afterward to fill the gaps.' },

      { type: 'image', src: 'assets/alignment-business-model-canvas.jpg',
        alt: 'Business model canvas mapping key partners, activities, resources, customer relationships and value proposition',
        caption: 'Mapping the business model canvas is part of the homework I do before the first onboarding call.' },

      { type: 'h3', text: '2. A Living UX Research Board' },
      { type: 'p', text: 'Big projects come with layers: stakeholders, constraints, hidden details. I don’t rely on memory. I keep a research board that grows continuously as I learn more about the business, a single source of truth I can always return to.' },

      { type: 'image', src: 'assets/alignment-empathy-map.jpg',
        alt: 'UX empathy map capturing what the user thinks and feels, used in stakeholder alignment research',
        caption: 'An empathy map is one of the living artifacts I keep updating as I learn more about the people behind the product.' },

      { type: 'h3', text: '3. A Clear Roadmap' },
      { type: 'p', text: 'I need clarity on business objectives and priorities as early as possible, ideally during onboarding itself. I like to map out what I’ll learn, when it will happen, and when the actual work begins.' },

      { type: 'h3', text: '4. Stakeholder Alignment' },
      { type: 'p', text: 'In larger companies, different areas often have their own goals, and those goals don’t always line up with the broader business objectives. Sometimes a legal or operational constraint from another sector can block what you’re building entirely. Talking to a wide range of stakeholders early on helps you avoid building something that can’t actually be used.' },

      { type: 'image', src: 'assets/alignment-personas.jpg',
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
