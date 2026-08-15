export const site = {
  name: 'Oliver Martínez Haro',
  title: 'Oliver Martínez Haro — Independent maker',
  description: 'Oliver Martínez Haro builds useful software and small internet businesses.',
  email: 'hola@olivermartinezharo.com',
  githubUrl: 'https://github.com/martinezharo',
  intro: {
    eyebrow: 'Independent maker · Spain',
    heading: 'I need it,\nI build it.',
    body: 'Mostly software for my own businesses, plus side projects that begin with a question I cannot leave alone.',
  },
  availability: 'Around for interesting work',
  navigation: [
    { label: "Things I've built", href: '#projects' },
    { label: 'About', href: '#about' },
  ],
} as const;

export const mailto = `mailto:${site.email}`;
