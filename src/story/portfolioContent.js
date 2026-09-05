// portfolioContent.js
// The actual portfolio content shown in the About/Projects/Contact panels.
// Kept as plain data (not JSX) so it's easy to edit without touching
// component logic — same pattern as narrationLines.js.

export const ABOUT_CONTENT = {
  title: 'About Me',
  paragraphs: [
    "I'm Alphonce Otieno — a software engineering student majoring in Artificial Intelligence and Cloud Technologies at Zetech University, Ruiru Campus.",
    "Kowinga, the village you're walking through, isn't just a tech demo — it's a small reflection of how I think about life and work. I care about building real, useful things, but I also value a calm, peaceful pace outside of code: the kind of quiet Fonsi finds by the river.",
    "Outside of engineering, I'm into gaming — which honestly shaped a lot of how I think about interactive experiences like this one.",
    "I also teach — I run a paid live cohort program on building AI agents.",
  ],
  responsibilities: [
    'Designing and architecting software systems',
    'Writing clean, maintainable, well-tested code',
    'Debugging and troubleshooting issues across the stack',
    'Collaborating with teams through code reviews and shared standards',
    'Deploying and maintaining applications in production',
    'Documenting systems and decisions for future maintainers',
    'Continuously learning new tools, frameworks, and best practices',
  ],
};

export const PROJECTS_CONTENT = {
  title: 'Projects',
  items: [
    {
      name: 'Kowinga Village (this project)',
      description: 'A 3D interactive narrative built with React Three Fiber, physics, and real audio — the project you\'re standing in right now.',
      url: 'https://github.com/fonsi-skater/-kowinga-village',
    },
    {
      name: 'Fonsi POS',
      description: 'Multi-tenant point-of-sale and business platform for SMEs, built with Next.js and Supabase.',
      url: 'https://github.com/fonsi-skater/fonsi-pos',
    },
    {
      name: 'IZZ-RAEL Vibrations',
      description: 'Ecommerce site for a music equipment retailer — full catalog, cart, admin panel, promotions.',
      url: 'https://github.com/fonsi-skater/izz-rael-vibrations',
    },
    {
      name: 'Sirisia Alumni',
      description: 'A community website for an alumni class, with planned M-Pesa contributions.',
      url: 'https://github.com/fonsi-skater/sirisia-alumni',
    },
    {
      name: 'Forbes Global Agency',
      description: 'A recruitment agency site connecting job-seekers with employers in Nairobi.',
      url: 'https://reach-rise-recruit.lovable.app',
    },
    {
      name: 'Personal Portfolio',
      description: 'My other portfolio site, being upgraded with 3D/Three.js features. Live at otieno-portfolio.vercel.app.',
      url: 'https://github.com/fonsi-skater/otieno-portfolio',
    },
  ],
};

export const HOBBIES_CONTENT = {
  title: 'Hobbies',
  items: ['Skating', 'Cycling', 'Meditation', 'Walks', 'Swimming'],
};

export const CONTACT_CONTENT = {
  title: 'Get In Touch',
  email: 'fonsialphonce@gmail.com',
  phone: '0742200497',
  github: 'https://github.com/fonsi-skater',
};
