export const i18nLabels = {
  common: {
    title: $localize`:@@common.title:Mitsuru Takahashi: Tech Portfolio`,
    home: $localize`:@@common.home:Home`,
    skills: $localize`:@@common.skills:Skills`,
    career: $localize`:@@common.career:Career`,
    detail: $localize`:@@common.detail:Detail`,
  },
  skills: {
    diag: {
      title: $localize`:@@skills.diag.title:Vehicle Diagnostics & AUTOSAR`,
      subTitle: $localize`:@@skills.diag.subTitle:10+ years of experience. A specialist in vehicle diagnostics.`,
      description: $localize`:@@skills.diag.description:Over 10 years of expertise in vehicle diagnostics development across multiple OEMs. From AUTOSAR BSW/MCAL configuration to communication protocol implementation, I deliver reliable solutions that meet the strict demands of the automotive domain.`,
    },
    frontEnd: {
      title: $localize`:@@skills.frontEnd.title:Front-End Development`,
      subTitle: $localize`:@@skills.frontEnd.subTitle:Advanced UI/UX and modern development based on Angular.`,
      description: $localize`:@@skills.frontEnd.description:Over 3 years of experience as an Angular Lead Engineer. I can develop custom expressions and animations that are not available in GUI libraries. I also have experiences in developing desktop applications using Tauri.`,
    },
    ci: {
      title: $localize`:@@skills.ci.title:Development Workflow & CI/CD`,
      subTitle: $localize`:@@skills.ci.subTitle:Building full-scratch automation foundations to support "Non-stop Development."`,
      description: $localize`:@@skills.ci.description:Automation of build and test processes utilizing Docker, GitHub, and Azure. I can construct workflows integrated with external systems and/or improve development environments to enhance the overall productivity of the development team.`,
    },
    systemDesign: {
      title: $localize`:@@skills.systemDesign.title:System Architecture Design`,
      subTitle: $localize`:@@skills.systemDesign.subTitle:System design balancing stability and maintainability, from embedded systems to web applications.`,
      description: $localize`:@@skills.systemDesign.description:From automotive ECU systems to medium-scale web applications, I define highly flexible architectures capable of long-term operation while compliant with regulatory standards.`,
    },
    userReq: {
      title: $localize`:@@skills.userReq.title:Solution Definition & Proposal`,
      subTitle: $localize`:@@skills.userReq.subTitle:Collaborative development from upstream processes to bring business requirements to life.`,
      description: $localize`:@@skills.userReq.description:I have extensive practical experience in upstream processes, including the launch of new systems. Based on a deep understanding of the product's background, I balance feasibility with business requirements to ensure smooth project progression.`,
    },
  },
} as const;
