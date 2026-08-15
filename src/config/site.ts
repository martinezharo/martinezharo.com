export const site = {
  name: 'Oliver Martínez Haro',
  title: 'Oliver Martínez Haro — Selected work',
  description: 'Oliver Martínez Haro builds useful software and small internet businesses.',
  email: 'hola@olivermartinezharo.com',
  githubUrl: 'https://github.com/martinezharo',
  intro: {
    eyebrow: 'Independent maker · Spain',
    heading: 'I build useful things for the internet.',
    body: 'Mostly software for my own businesses, plus side projects that begin with a question I cannot leave alone.',
  },
  availability: 'Around for interesting work',
  navigation: [
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
  ],
} as const;

export const mailto = `mailto:${site.email}`;
