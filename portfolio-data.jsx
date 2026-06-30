/* portfolio-data.jsx, content pulled from felixbenito.com */

const PROFILE = {
  name: 'Felix Benito',
  role: 'Design Lead',
  company: 'PharosGraph',
  companyUrl: 'https://pharosgraph.com/',
  email: 'contact@felixbenito.com',
  location: 'Brazil',
  years: '18+',
  intro: 'Strategic design lead with 18 years building digital products for global brands including Audi, Coca-Cola and Kraft Heinz, currently shaping PharosGraph, an AI-driven political intelligence SaaS.',
  cv: 'assets/Felix_Benito_Design_Lead_CV.pdf',
  linkedin: 'https://www.linkedin.com/in/felix-benito/',
  medium: 'https://medium.com/@felixbenito13',
  profileImg: 'assets/felix-benito-design-lead-portrait.jpg',
};

const PROJECTS = [
  {
    n: '01',
    title: 'Narrative intelligence, block by block',
    company: 'PharosGraph',
    year: '2026',
    role: 'Design Lead',
    tags: ['AI', 'Design System', 'B2B', 'Branding'],
    img: 'cases/assets/pharosgraph-cover.png',
    imgAlt: 'PharosGraph political intelligence platform, dashboard and design system unified under one design language',
    href: 'cases/pharosgraph.html',
    summary: 'Joined a political intelligence platform as Design Lead, rebuilding the design system first, then letting it drive the product, the website and the full go-to-market library.',
  },
  {
    n: '02',
    title: 'Onboarding maintenance into the Audi service flow',
    company: 'Audi · myAudi',
    year: '2025',
    role: 'Lead Product Designer',
    tags: ['Automotive', 'Mobile', 'Service Design'],
    img: 'cases/assets/audi-myaudi-maintenance-onboarding-cover.jpg',
    imgAlt: 'myAudi maintenance onboarding shown across desktop, tablet and mobile with the service scheduling screen',
    href: 'cases/audi-onboarding.html',
    summary: 'Redesigned the Owner’s Literature and Maintenance experience inside myAudi, leading discovery, user testing and AI-assisted prototyping to lift maintenance scheduling engagement from 11.2% to 23%.',
  },
  {
    n: '03',
    title: 'Selling Coke through AI-suggested deals',
    company: 'The Coca-Cola Company · KO Boss',
    year: '2024',
    role: 'Design Lead',
    tags: ['AI', 'B2B', 'Design System', 'iOS'],
    img: 'cases/assets/coca-cola-ko-boss-cover.png',
    imgAlt: 'Coca-Cola KO Boss bottler app home screen with promotions and suggested order',
    href: 'cases/coke-ko-boss.html',
    summary: 'Designed a B2B buying tool for Coca-Cola bottlers across five LATAM countries, building the design system, redesigning the bottler app, and migrating the Equipment Maintenance feature out of a WhatsApp bot into the app.',
  },
  {
    n: '04',
    title: 'Ladle Slag Model, digitising metallurgical expertise',
    company: 'RHI Magnesita · Ladle Slag Model',
    year: '2024',
    role: 'Product Designer (lead)',
    tags: ['Industrial', 'Design System', 'Branding', 'SaaS'],
    img: 'cases/assets/rhi-magnesita-ladle-slag-model-cover.jpg',
    imgAlt: 'RHI Magnesita Ladle Slag Model running on a laptop, showing the steel-process monitoring interface',
    href: 'cases/ladle-slag-model.html',
    summary: 'Led the end-to-end design of RHI Magnesita’s Ladle Slag Model across Austria and Brazil, stakeholder research, business logic, UI, branding, design system and go-to-market for 17+ technical modules.',
  },
  {
    n: '05',
    title: 'A sales-tech ecosystem for Kraft Heinz',
    company: 'Kraft Heinz · Sales Tech',
    year: '2023',
    role: 'Product Designer (lead)',
    tags: ['Data', 'Dashboards', 'Branding', 'B2B'],
    img: 'cases/assets/kraft-heinz-sales-tech-ecosystem-cover.jpg',
    imgAlt: 'Kraft Heinz sales-tech dashboard showing predictive sales analytics and KPI cards',
    href: 'cases/sales-tech-ecosystem.html',
    summary: 'Led the design of nine dashboards unifying Sell-In, Execution and Sell-Out for Kraft Heinz across France and Brazil, cutting time-to-insight from 20 hours/month to 2 seconds.',
  },
];

const LEADERSHIP = [
  {
    n: '01',
    tag: 'AI in the design loop',
    title: 'Paper to hi-fi in days, not weeks',
    body: 'On Audi Onboarding and Charging, AI accelerated heuristic analysis, research clustering and prototyping, without replacing the judgment behind them.',
  },
  {
    n: '02',
    tag: 'Mentoring',
    title: 'Three reports promoted mid → senior in two years',
    body: 'Weekly 1:1s, portfolio reviews, growth plans tied to the work, not the title. I optimise for the designer\u2019s career, not just the org chart.',
  },
  {
    n: '03',
    tag: 'Design systems',
    title: 'One language across teams and turnover',
    body: 'Built design systems for Coca-Cola, RHI Magnesita and Kraft Heinz, with the contribution model, rubric and governance that keep them alive.',
  },
  {
    n: '04',
    tag: 'Cross-functional alignment',
    title: 'Twenty-six stakeholders, five countries, one design',
    body: 'At Coca-Cola and Kraft Heinz, the hard craft was alignment, not pixels: stakeholder reviews, plant visits, and a cohesive language under pressure.',
  },
  {
    n: '05',
    tag: 'Broader product view',
    title: 'Product UI, brand, email, decks, same voice',
    body: 'At RHI Magnesita and Kraft Heinz I led every surface, so the app, the launch email and the stakeholder deck all said the same thing.',
  },
];

const CV = [
  { year: '2026, now', role: 'Design Lead',                org: 'PharosGraph',                                          place: 'US' },
  { year: '2022, 2025', role: 'Senior Product Designer',    org: 'CI&T, Audi, Coca-Cola, Kraft Heinz, RHI Magnesita',  place: 'International' },
  { year: '2017, 2022', role: 'UX/UI Designer',             org: 'Ourofino Agrociência',                                 place: 'Brazil' },
  { year: '2016, 2017', role: 'Digital Designer',           org: 'Grupo Educacional Augusto Cury',                       place: 'Brazil' },
  { year: '2014, 2016', role: 'Web Designer',               org: 'Popcorn Studio, Algar, Twitter partners',              place: 'Brazil' },
  { year: '2010, 2014', role: 'Digital Designer',           org: 'Saraiva',                                              place: 'Brazil' },
  { year: '2008, 2010', role: 'Marketing & Design Intern',  org: 'Nexo Comunicação',                                      place: 'Brazil' },
];

const TESTIMONIALS = [
  {
    text: 'Felix\u2019s communication skills were exceptional, keeping me informed every step of the way and ensuring the project stayed on track and within budget. His professionalism and dedication to quality were evident in every aspect of his work.',
    name: 'Minal Pala',
    at: 'UX Designer · Nirakaar',
    img: 'assets/minal.jpg',
  },
  {
    text: 'Felix is a thoughtful professional with a 360-degree view of the project context and a strong ability to deliver value to the client. He shared insights that had a meaningful impact on my own growth as a tech professional.',
    name: 'Victor Sales',
    at: 'Developer · CI&T',
    img: 'assets/Vitor.jpg',
  },
  {
    text: 'Felix is highly talented. Of his diverse abilities, I see a high concentration and focus on perfection, he is able to translate ideas and concepts into graphic art in a way that the content promotes communication without a single word.',
    name: 'Lucas Ávila',
    at: 'Director · Lucree',
    img: 'assets/Lucas_Avila-pb.jpg',
  },
];

const CLIENTS = [
  { name: 'Audi', src: 'assets/audi-1.svg' },
  { name: 'Coca-Cola', src: 'assets/coca-1.png' },
  { name: 'Kraft Heinz', src: 'assets/kraft-heinz-1.png' },
  { name: 'RHI Magnesita', src: 'assets/rhi-magnesita-1.jpg', scale: 0.5 },
  { name: 'Algar', src: 'assets/algar-1.jpg' },
  { name: 'Ourofino', src: 'assets/ourofino-1.jpg' },
  { name: 'Ice Kiss', src: 'assets/icekiss-1.jpg', scale: 0.5 },
  { name: 'Saraiva', src: 'assets/saraiva-1.png' },
];

Object.assign(window, { PROFILE, PROJECTS, LEADERSHIP, CV, TESTIMONIALS, CLIENTS });
