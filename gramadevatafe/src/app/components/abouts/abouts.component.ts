import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-abouts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abouts.component.html',
  styleUrl: './abouts.component.css'
})
export class AboutsComponent {

  constructor(){}


  togglePlay(video: HTMLVideoElement) {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}


  advisors = [

    {

      name: 'Dr. Ravi Aiyyar',
      image: "assets/Ravi Aiyyar.jpg",
      bio: 'Dr.Ravi Kumar is a member of All India Sampark Toli of RSS. His headquarters is in Mumbai. Ravi Kumar completed engineering from the prestigious Madras Institute of Technology, Chennai in 1970. During his college days, he was All India General Secretary of Akhil Bharatiya Vidyarthi Parishad (1969-70). ABVP is considered the largest student organization in the world. He served as Project Engineer for five years and left his job with M/S Larsen & Toubro in 1975 to serve society as an RSS Pracharak. He worked among the youth of Gujarat and the tribals of Maharashtra. For 36 years from 1982 to 2018, Ravi Kumar travelled regularly to 45 countries to serve the Indian society under Sewa International. During this period his headquarters were in Hong Kong, Bangkok, and Sydney, Australia. He has conducted more than 300 Yoga camps and more than 500 workshops on Vedic Mathematics in over 40 countries in many universities and socio-cultural institutions.'
    },
   
   
    {

      name: 'Dr. Anadi Sahoo',
      image: "assets/Dr. Anadi Sahoo.jpg",
      bio: 'Dr. Anadi Sahoo is the Founder of Spiritual Bharat, a Spiritual Educational Institute where academic, social, and religious values are taught. He is also a renowned thought leader in Hinduism and has completed a 12-year Gurukul spiritual training from the Nath Sampradaya. Additionally, he is a spiritual scientist, author, and trainer, known for his profound insights shared through over 150 spiritual articles featured on the Speaking Tree of Times of India. Dr. Sahoo"s commitment is to impart principles and practices for genuine happiness, especially to those earnestly seeking spiritual growth. He also sheds light on the inclusive essence of Hinduism and discusses the intersection of Hinduism with other communities in exercising an inclusive viewpoint.'

    },

    {
      name: 'Dr. B. Srinivasulu',
      image: "assets/srinavas.jpg",
      bio: "Dr. B. Srinivasulu, M.Sc (Ag), Ph.D. Former Registrar, Director of Extension, Controller of Examinations, Principal Scientist, Director -Planning and Monitoring cell at Horticultural University, Andhra Pradesh. Severed as a professor for 21 years and university officer for 14 years in a total service of 39 years. Also held positions as Director of Research, Dean of Horticulture, Dean of Student Affairs, Dean of PG Studies, Director of Industrial and International Programs, Comptroller and Estate Officer. Published 7 books, 8 chapters in textbooks, 60 technical bulletins, 150 research papers and 200 popular articles. Recipient of 13 awards / recognitions."

    },
    //     {
    //   name: 'Ranga Prativadi',
    //   image: "assets/WhatsApp Image 2026-02-10 at 7.37.25 PM.jpeg",
    //   bio: " Ranga Prativadi is a visionary technology executive and AI specialist with over 30 years of global IT experience, including a distinguished career at TCS. He holds dual postgraduate degrees—Applied Statistics from Osmania University and a Master’s in Computer Applications from the University of Hyderabad, India.",
    //   p1:"He brings deep expertise in building, scaling, and advising high-growth software and AI-driven solutions, combining strong product vision with technical strategy to drive sustainable revenue growth. His core specializations include Generative AI (LLMs), machine learning infrastructure, cloud-native and enterprise architectures, and Agentic AI–driven automation.",
    //   p2:"Ranga actively advises early-stage AI startups on MVP development, technology stack selection, and scalable system design. He has delivered complex software solutions for clients across the globe and has worked extensively in the USA, Switzerland, Sweden, Denmark, Belgium, and Japan. Currently based in the United States, he works as a Consultant and Enterprise Architect, integrating machine learning models with agentic AI automation at enterprise scale.",
    //   p3:"Known for his high energy, continuous learning mindset, and passion for mentoring, Ranga actively guides young engineers and regularly visits engineering colleges to deliver technology and leadership lectures. He maintains a disciplined and healthy lifestyle through daily yoga, walking 10,000 steps every day, and participating in 5K marathon runs. His personal interests include playing cricket and chess, reflecting his balance of physical fitness and strategic thinking."

    // }
    
  ];

  founders = [
    


    // {
    //   title: 'Founder & CEO',
    //   name: 'MR. NALABOLU GOVINDA ROY VISHNU SRI',
    //   image: '../../../assets/founder.jpg',
    //   bio: 'A dedicated social reformer and entrepreneur with over 25 years of experience in rural and urban development. As Chairman and Managing Director of Sathayush Tech Solutions Pvt Ltd and Founder-CEO of the Gramadevata Foundation, he has played a pivotal role in developing web and mobile platforms that unite and empower the global Hindu community. His key activities include organizing medical camps in rural areas, providing financial support for underprivileged students, and promoting religious awareness. Mr. Vishnu Roy holds a Bachelor of Science (BSc) and a Master of Computer Applications (MCA) from Osmania University. His work experience includes mentoring thousands of graduates, working as a software consultant in the USA and Singapore, and collaborating on open-source software and bioinformatics projects. He remains deeply connected with a wide range of professionals, including lawyers, doctors, teachers, and media personnel, leveraging these relationships to further his mission of social upliftment and community development.'
    // },

    {
      title: 'Founder & CEO',
      name: 'MR. NALABOLU GOVINDA ROY VISHNU SRI',
      image: '../../../assets/founder.jpg',
      bio: 'MR. NALABOLU GOVINDA ROY VISHNU SRI is a dedicated social reformer and entrepreneur with over 25 years of experience in rural and urban development. As Chairman and Managing Director of Sathayush Tech Solutions Pvt Ltd and Founder-CEO of the Gramadevata Foundation, he has played a pivotal role in developing web and mobile platforms that unite and empower the global Hindu community. His key initiatives include organizing medical camps in rural areas, providing financial support to underprivileged students, and promoting religious awareness. Mr. Vishnu Sri holds a Bachelor of Science (BSc) and a Master of Computer Applications (MCA) from Osmania University. He has mentored thousands of graduates, worked as a software consultant in the USA and Singapore, and collaborated on open-source software and bioinformatics projects. He maintains strong connections with professionals across various fields, including law, medicine, education, and media, using these relationships to further his mission of social upliftment and community development.'
    },

    {
     title:'Chairman',
     name: 'Mr. Soundarajan Narendran',
     image: 'assets/Soundarajan Narendran.jpg',
     bio: 'Soundarajan Narendran is a data scientist with over 25 years of experience in both business and government. From 1998 to 2007, he worked for Apollo Tyres and the TVS Group on product development, business channel development and supply chains. Since 2007, Narendran has worked on policy making, public policy and digital government. He has experience of working with non-governmental organizations, governments and global institutions on big data, social media analytics and sentiment analysis. Educated at IIT Chennai and Anna University, Narendran has an interest in spirituality and narrative development.'
   }, 
    
    {
      name: 'Ranga Prativadi',
      image: "assets/WhatsApp Image 2026-02-10 at 7.37.25 PM.jpeg",
      bio: " Ranga Prativadi is a visionary technology executive and AI specialist with over 30 years of global IT experience, including a distinguished career at TCS. He holds dual postgraduate degrees—Applied Statistics from Osmania University and a Master’s in Computer Applications from the University of Hyderabad, India.",
      p1:"He brings deep expertise in building, scaling, and advising high-growth software and AI-driven solutions, combining strong product vision with technical strategy to drive sustainable revenue growth. His core specializations include Generative AI (LLMs), machine learning infrastructure, cloud-native and enterprise architectures, and Agentic AI–driven automation.",
      p2:"Ranga actively advises early-stage AI startups on MVP development, technology stack selection, and scalable system design. He has delivered complex software solutions for clients across the globe and has worked extensively in the USA, Switzerland, Sweden, Denmark, Belgium, and Japan. Currently based in the United States, he works as a Consultant and Enterprise Architect, integrating machine learning models with agentic AI automation at enterprise scale.",
      p3:"Known for his high energy, continuous learning mindset, and passion for mentoring, Ranga actively guides young engineers and regularly visits engineering colleges to deliver technology and leadership lectures. He maintains a disciplined and healthy lifestyle through daily yoga, walking 10,000 steps every day, and participating in 5K marathon runs. His personal interests include playing cricket and chess, reflecting his balance of physical fitness and strategic thinking."

    },

    {
      title:'Director',
      name:'Devanjan Bose- President, International Satvik and Sanatan Foundation - New Delhi',
      image:'../../../assets/devanjan bose.jpeg',
      bio:'From Banker to Nation Builder - Devanjan Bose spent over three decades in India’s financial sector before choosing to dedicate his life to grassroots service and national development. Guided by Sanatan values, he works to empower communities, strengthen civilizational identity, and contribute to a self-reliant Bharat.',
      p1:'During the COVID-19 crisis, he and his team provided essential relief — rescuing stranded citizens, arranging oxygen support, and serving migrant families with compassion and dharma.',
      p2:'Rehabilitation of Hindu Refugees – Ensuring dignity, security, and social reintegration.',
      p3:'He believes that the rise of Bharat begins with the rise of its villages.',
      p4:'Revival of Bharatiya Martial Arts – Restoring ancient disciplines of strength, heritage, and spiritual growth and – Advancing sustainable agriculture and modern agri-tech for Himalayan villages.Revival of Bharatiya Martial Arts – Restoring ancient disciplines of strength, heritage, and spiritual growth and – Advancing sustainable agriculture and modern agri-tech for Himalayan villages. His current focus includes promoting indigenous drone and UAV technologies, building cyber-awareness for national security, and facilitating advanced agri-tech solutions to uplift farmers and rural ecosystems.',
      p5:'Driven by Bhakti for the nation, he serves as a committed citizen working for a stronger, secure, and spiritually awakened Bharat.',
    },

    

    {
      title:'Director',
      name:'Mr. Sharat',
      image:'../../../assets/Sharat.jpg',
      bio:'Mr. Sharat is an astute, strategic person and an active social worker with a strong foothold in Hindu communities. he holds a rich and productive experience in the arena of social services. His ability to reach out and interact with various strata of the society and his active participation in the establishment of numerous get togethers of Hindu communities  in and around India (Nellore, Nalgonda, Vijayawada, Hyderabad), abroad (UK,USA, Singapore) has earned him accolades. He made healthy relations with local and national leaders and was awarded for remarkable work towards social welfare.'
    },





    //     {
    //   title:'Vice Presedent',
    //   name:'Vivek Tiwari',
    //   image:'../../../assets/Vivek tiwari.jpeg',
    //   bio:'Mr. Vivek Tiwari is a seasoned professional with extensive experience spanning over two decades in advertising, marketing, and strategic planning across Pan-India. He has consistently demonstrated expertise in brand communication, campaign management, and business development across multiple platforms including print, broadcast, digital, and outdoor media. With a proven track record of contributing to the successful launch of new ventures and developing integrated marketing strategies, Mr. Tiwari excels at driving growth in competitive environments. His strength lies in building and leading cross-functional teams while managing key client relationships with a focus on long-term value creation.'
    // }

  ]



}
