import { Experience, EducationItem, SkillItem } from './types';

export const experiences: Experience[] = [
  {
    id: 'hulegeb-diploma',
    company: { en: 'Hulegeb Technical Skill Training Center', am: 'ሁለጌብ ቴክኒካል ሙያ ማሰልጠኛ ተቋም' },
    role: { en: 'Diploma in Building Construction', am: 'የህንፃ ግንባታ ዲፕሎማ' },
    period: 'Two Years — 31/08/2002',
    location: 'Ethiopia',
    ref: 'Accredited by: Addis Ababa Administration Education Bureau',
    description: {
      en: 'Successfully completed theoretical and practical Skill education in Building construction Course for TWO YEARS. Diploma awarded to LEUEL ZENEBE HME. Accredited by Addis Ababa Administration Education Bureau.',
      am: 'ሁለጌብ ቴክኒካል ሙያ ማሰልጠኛ ተቋም ለሁለት ዓመት የህንፃ ግንባታ ቲዎሪ እና ተግባራዊ ትምህርት ዲፕሎማ ተቀብሏል። በአዲስ አበባ አስተዳደር ትምህርት ቢሮ የተረጋገጠ።'
    },
    docPages: [1],
    certificateImage: '/certificates/hulegeb-diploma.jpg'
  },
  {
    id: 'hope-development',
    company: { en: 'Hope Development Project', am: 'ተስፋ የልማት ፕሮጀክት' },
    role: { en: 'Foreman', am: 'ፎርማን' },
    period: '1994 – 1995',
    location: 'Awassa',
    ref: 'Ref: 1(m)1/144/85 · Date: 24/06/1995',
    description: {
      en: 'Supervised foreman duties for Hope Development Project, Awassa branch. Managed construction crew and oversaw daily site operations with 40 Birr daily rate.',
      am: 'ተስፋ የልማት ፕሮጀክት ሀዋሳ ቅርንጫፍ ፎርማን ሆኖ አገልግሏል። ዕለታዊ ደሞዝ 40 ብር።'
    },
    docPages: [6],
    certificateImage: '/certificates/hope-development.jpg'
  },
  {
    id: 'gelaye-muleta',
    company: { en: 'Gelaye Muleta Building Contractor', am: 'ገላዬ ሙለታ ህንፃ ሥራ ተቋራጭ' },
    role: { en: 'General Foreman', am: 'ጀኔራል ፎርማን' },
    period: 'Oct 1996 – Feb 1998',
    location: 'Ethiopia',
    ref: 'Ref: 71/00-1046/98 · Date: 12/02/1998',
    description: {
      en: 'Served as General Foreman for 14 months. Daily rate 50 Birr. Supervised construction teams with excellence in site operations and delivery.',
      am: 'ለ14 ወር ጀኔራል ፎርማን ሆኖ አገልግሏል። ዕለታዊ ደሞዝ 50 ብር።'
    },
    docPages: [9],
    certificateImage: '/certificates/gelaye-muleta.jpg'
  },
  {
    id: 'degif-shkurye',
    company: { en: 'Degif Shkurye Building Contractor', am: 'ደጋፍ ሽኩሬ ህንፃ ሥራ ተቋራጭ' },
    role: { en: 'General Foreman', am: 'ጀኔራል ፎርማን' },
    period: 'Nov 1997 – Jan 1999',
    location: 'Ethiopia',
    ref: 'Ref: le8/10f/99 · Date: 07/03/1999',
    description: {
      en: 'General Foreman from November 7, 1997 to January 30, 1999. Monthly salary 1,200 Birr. Demonstrated outstanding professional reliability.',
      am: 'ከኅዳር 1997 እስከ ጥር 1999 ጀኔራል ፎርማን። ወርሃዊ ደሞዝ 1,200 ብር።'
    },
    docPages: [17],
    certificateImage: '/certificates/degif-shkurye.jpg'
  },
  {
    id: 'debube-college',
    company: { en: 'Debube Ethiopia College of Teacher Education', am: 'ደቡብ ኢትዮጵያ የመምህራን ትምህርት ኮሌጅ' },
    role: { en: 'Foreman', am: 'ፎርማን' },
    period: 'May 1996 – May 1997',
    location: 'Ethiopia',
    ref: 'Ref: Ql6100|4|7/982/10/81 · Date: 13-5-97',
    description: {
      en: 'Foreman for construction works at Debube Ethiopia College. Rate 40 Birr/day. Supervised 30 workers in structured team operations.',
      am: 'ደቡብ ኢትዮጵያ ኮሌጅ ፎርማን። ዕለታዊ ደሞዝ 40 ብር። 30 ሠራተኞችን አስተዳድሯል።'
    },
    docPages: [12],
    certificateImage: '/certificates/debube-college.jpg'
  },
  {
    id: 'endeshaw-contractor',
    company: { en: 'Emnete Endeshaw General Contractor GC1', am: 'እምነቴ እንደሻው ጠቅላላ ሥራ ተቋራጭ' },
    role: { en: 'General Foreman', am: 'ጀኔራል ፎርማን' },
    period: 'Apr 2002 – Jan 2003',
    location: 'Hawassa / Addis Ababa',
    ref: 'Ref: 862/w.4/08 · Date: 18/5/2008',
    description: {
      en: 'General Foreman on Dala Dashin Bank Building project. Monthly salary 2,500 Birr. Exceptional performance acknowledged by Project Administrator.',
      am: 'ዳላ ዳሽን ባንክ ህንፃ ፕሮጀክት ጀኔራል ፎርማን። ወርሃዊ ደሞዝ 2,500 ብር።'
    },
    docPages: [10, 18],
    certificateImage: '/certificates/endeshaw-contractor.jpg'
  },
  {
    id: 'tilahun-leta',
    company: { en: 'Tilahun Leta General Contractor', am: 'ጥላሁን ለታ ጠቅላላ ሥራ ተቋራጭ' },
    role: { en: 'General Foreman', am: 'ጀኔራል ፎርማን' },
    period: 'Dec 2003 – Apr 2005',
    location: 'Ethiopia',
    ref: 'Ref: TL/GC/055/05 · Date: 26/04/2005',
    description: {
      en: 'General Foreman from December 2003 to April 2005. Monthly salary 6,500 Birr. Outstanding performance commended by contractor.',
      am: 'ከህዳር 2003 እስከ ሚያዝያ 2005 ጀኔራል ፎርማን። ወርሃዊ ደሞዝ 6,500 ብር።'
    },
    docPages: [11],
    certificateImage: '/certificates/tilahun-leta.jpg'
  },
  {
    id: 'besu-fekade',
    company: { en: 'Besu Fekade General Construction Association', am: 'በሱ ፈቃደ ጠቅላላ ኮንስትራክሽን ማህበር' },
    role: { en: 'Foreman', am: 'ፎርማን' },
    period: 'Sep 2003 – Sep 2004',
    location: 'Sidama',
    ref: 'Ref: 0/ሱ/ፍ/17/20/11 · Date: 25/2010',
    description: {
      en: 'Foreman from September 21, 2003 to September 25, 2004. Rate 4,500 Birr/month. Supervised structural construction works.',
      am: 'ከመስከረም 2003 እስከ 2004 ፎርማን። ወርሃዊ ደሞዝ 4,500 ብር።'
    },
    docPages: [19],
    certificateImage: '/certificates/besu-fekade.jpg'
  },
  {
    id: 'abera-lisanu',
    company: { en: 'Abera Lisanu Building Contractor', am: 'አበራ ሊሳኑ ህንፃ ሥራ ተቋራጭ' },
    role: { en: 'General Foreman', am: 'ጀኔራል ፎርማን' },
    period: 'Nov 2008 – May 2009',
    location: 'Hawassa',
    ref: 'Ref: ALBC/1763/2009 · Date: 19-5-2009',
    description: {
      en: 'General Foreman at Abera Lisanu Building Contractor. Nov 2008 – May 2009. Monthly salary 5,000 Birr. 6 months with income tax paid to Inland Revenue. Received excellence recommendation letter.',
      am: 'አበራ ሊሳኑ ህንፃ ሥራ ተቋራጭ ጀኔራል ፎርማን። ወርሃዊ ደሞዝ 5,000 ብር።'
    },
    docPages: [8, 14],
    certificateImage: '/certificates/abera-lisanu.jpg'
  },
  {
    id: 'bnk-construction',
    company: { en: 'BNK Construction Association', am: 'ቢኤንኬ ኮንስትራክሽን ማህበር' },
    role: { en: 'Foreman', am: 'ፎርማን' },
    period: 'Feb 2005 – May 2007',
    location: 'Ethiopia',
    ref: 'Ref: BN/K/024/07 · Date: 02/05/2007',
    description: {
      en: 'Foreman at BNK Construction Association from February 2005 to May 2007. Monthly salary 5,000 Birr. Site management skills highly commended.',
      am: 'ቢኤንኬ ኮንስትራክሽን ማህበር ፎርማን ከ2005 እስከ 2007። ወርሃዊ ደሞዝ 5,000 ብር።'
    },
    docPages: [15],
    certificateImage: '/certificates/bnk-construction.jpg'
  },
  {
    id: 'santa-maria',
    company: { en: 'Santa Maria Construction', am: 'ሳንታ ማሪያ ኮንስትራክሽን' },
    role: { en: 'Foreman', am: 'ፎርማን' },
    period: 'May 2007 – Jan 2008',
    location: 'Hawassa / Addis Ababa',
    ref: 'Ref: 12/sf/11883/04 · Date: 30/01/2008',
    description: {
      en: 'Foreman on Santa Maria Construction ICT Project. Monthly salary 6,625 Birr. Terminated by own decision. Income tax paid to Inland Revenue.',
      am: 'ሳንታ ማሪያ ኮንስትራክሽን ICT ፕሮጀክት ፎርማን። ወርሃዊ ደሞዝ 6,625 ብር።'
    },
    docPages: [16],
    certificateImage: '/certificates/santa-maria.jpg'
  },
  {
    id: 'rebecca-real-estate',
    company: { en: 'Rebecca Real Estate', am: 'ሬቤካ ሪል እስቴት' },
    role: { en: 'General Foreman', am: 'ጀኔራል ፎርማን' },
    period: '2008',
    location: 'Addis Ababa',
    ref: 'Ref: C6N/0160/08 · Date: 23/2008',
    description: {
      en: 'General Foreman for Rebecca Real Estate. 45-day construction contract worth 8,000 Birr. Supervised residential building construction works.',
      am: 'ሬቤካ ሪል እስቴት ጀኔራል ፎርማን። 45 ቀን ውል፣ ዋጋ 8,000 ብር።'
    },
    docPages: [5],
    certificateImage: '/certificates/rebecca-estate.jpg'
  },
  {
    id: 'fatech-general',
    company: { en: 'Fatech General Trading PLC', am: 'ፋቴክ አጠቃላይ ንግድ ኃ.የ.ተ.የ.ማ.ን.ር' },
    role: { en: 'Project Foreman', am: 'የፕሮጀክት ፎርማን' },
    period: 'Jul 2010',
    location: 'Addis Ababa',
    ref: 'Ref: FGT/01ff/10 · Date: 27-06-10',
    description: {
      en: 'Project Foreman at Fatech General Trading PLC. Monthly rate 10,400 Birr plus 2,500 Birr transport allowance. Contract from 01/07/2010. Signed by V/Manager Solomon Shifferaw.',
      am: 'ፋቴክ አጠቃላይ ንግድ የፕሮጀክት ፎርማን። ወርሃዊ 10,400 ብር + 2,500 ብር ትራንስፖርት።'
    },
    docPages: [3],
    certificateImage: '/certificates/fatech-general.jpg'
  },
  {
    id: 'desalegn-asrade',
    company: { en: 'Desalegn Asrade Building Contractor', am: 'ደሳለኝ አስራደ ህንፃ ሥራ ተቋራጭ' },
    role: { en: 'Foreman', am: 'ፎርማን' },
    period: 'Sep 2010',
    location: 'Hawassa',
    ref: 'Ref: CD/h/h/064/10 · Date: 26/09/2010',
    description: {
      en: 'Foreman at Desalegn Asrade Building Contractor. Rate 4,500 Birr/month. Total 9,000 Birr. Project Administrator: Wondifraw Negussie Abate.',
      am: 'ደሳለኝ አስራደ ህንፃ ሥራ ተቋራጭ ፎርማን። ወርሃዊ 4,500 ብር። አጠቃላይ 9,000 ብር።'
    },
    docPages: [4],
    certificateImage: '/certificates/desalegn-asrade.jpg'
  },
  {
    id: 'amare-moges',
    company: { en: 'Amare Moges Building Contractor', am: 'አማሬ ሞጌስ ህንፃ ሥራ ተቋራጭ' },
    role: { en: 'Project Foreman / Project Manager', am: 'የፕሮጀክት ፎርማን / ፕሮጀክት ማናጀር' },
    period: 'Jun 2014',
    location: 'Addis Ababa',
    ref: 'Ref: AM/CON/Admin&Fina/049/14 · Date: 24/06/2014',
    description: {
      en: '60-apartment project foreman and project manager. Monthly rate 10,000 Birr plus 100 Birr daily allowance. Total 2,620 Birr.',
      am: 'አማሬ ሞጌስ ህንፃ ሥራ ተቋራጭ። 60 አፓርትማ ፕሮጀክት ፎርማን። ወርሃዊ 10,000 ብር።'
    },
    docPages: [2],
    certificateImage: '/certificates/amare-moges.jpg'
  }
];

export const education: EducationItem[] = [
  {
    id: 'edu-diploma',
    title: { en: 'Diploma in Building Construction', am: 'የህንፃ ሥራ ዲፕሎማ' },
    institution: { en: 'Hulegeb Technical Skill Training Center', am: 'ሁለጌብ ቴክኒካል ሙያ ማሰልጠኛ ማዕከል' },
    period: { en: 'Two Years — Theoretical & Practical', am: 'ሁለት ዓመት — ቲዮሪ እና የተግባር ስራ' },
    subDetails: { en: 'Awarded: 31/08/2002', am: 'የተሰጠበት ቀን: 31/08/2002' },
    badge: 'ACCREDITED',
    accreditation: { en: 'Addis Ababa Administration Education Bureau', am: 'የአዲስ አበባ አስተዳደር ትምህርት ቢሮ የተረጋገጠ' }
  },
  {
    id: 'edu-higher',
    title: { en: 'Technical Skill Training', am: 'ቴክኒካል ሙያ ስልጠና' },
    institution: { en: 'Hawassa Haulage Technical Skill Training Center', am: 'ሀዋሳ ሃውሌጅ ቴክኒካል ሙያ ማሰልጠኛ ጥምረት' },
    period: { en: '1994 – 2012', am: 'ከ1994 እስከ 2012' },
    subDetails: { en: 'Level: Higher Technical Practice', am: 'ደረጃ: ከፍተኛ የቴክኒክ ተግባራዊ ልምምድ' }
  },
  {
    id: 'edu-secondary',
    title: { en: 'Secondary Education', am: 'ሁለተኛ ደረጃ ትምህርት' },
    institution: { en: 'Tabor High School', am: 'ታቦር ሁለተኛ ደረጃ ትምህርት ቤት' },
    period: { en: 'Grades 9 – 12', am: 'ከክፍል 9 እስከ 12' },
    subDetails: { en: 'General Scientific Curriculum', am: 'አጠቃላይ ሳይንሳዊ ትምህርት' }
  }
];

export const skills: SkillItem[] = [
  {
    name: { en: 'Amharic / አማርኛ', am: 'አማርኛ / Amharic' },
    writing: 100,
    speaking: 100,
    reading: 100
  },
  {
    name: { en: 'English / እንግሊዝኛ', am: 'እንግሊዝኛ / English' },
    writing: 70,
    speaking: 70,
    reading: 70
  },
  {
    name: { en: 'Sidama / ሲዳምኛ', am: 'ሲዳምኛ / Sidama' },
    writing: 95,
    speaking: 95,
    reading: 70
  }
];
