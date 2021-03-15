// Jo, so each number in "economy" or "Finance" represents a code for a state for a given year,
// First number is for 2002, last is for 2011
// Code is build as follows,
// 00 : No requirement, no testing
// 10 : K12 Standard, no testing
// 20 : Standard implemented by District, no testing
// 30 : Course Offered, no testing
// 40 : Course Mandatory, no testing
// 01 : No requirement, testing required
// 11 : K12 Standard, testing required
// 21 : Standard implemented by District,  testing required
// 31 : Course Offered, testing required
// 41 : Course Mandatory, testing required

{
  al : {
    links : [
     {
       type : "standard",
       for  : "11",
       url  : "http://www.alsde.edu/general/ALABAMA_HIGH_SCHOOL_GRADUATION_REQUIREMENTS.pdf"
     } 
    ]
  }
  
}

MapTimeline = {
  states: {
    al:{economy:['41','41','40','40','40','40','40'],finance:['21','40','10','10','10','40','40'], title:'Alabama'},
    ak:{economy:['10','10','10','10','10','10','10'],finance:['00','00','00','00','00','00','00'], title:'Alaska'},
    ar:{economy:['20','20','20','40','40','40','40'],finance:['10','10','10','40','10','20','40'], title:'Arkansas', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    az:{economy:['20','20','20','40','40','40','40'],finance:['20','20','20','20','20','40','40'], title:'Arizona', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    ca:{economy:['41','41','40','40','41','40','40'],finance:['00','10','00','00','00','00','00'], title:'California'},
    co:{economy:['20','20','20','20','20','21','21'],finance:['00','00','00','00','20','21','21'], title:'Colorado'},
    ct:{economy:['11','11','11','10','10','10','10'],finance:['10','11','11','10','10','10','10'], title:'Connecticut'},
    dc:{economy:['10','10','20','10','10','20','20'],finance:['00','00','00','00','00','00','00'], title:'District of Columbia'},
    de:{economy:['21','21','21','21','21','21','21'],finance:['10','10','20','00','10','11','10'], title:'Delaware'},
    fl:{economy:['40','40','41','40','40','40','40'],finance:['10','10','10','20','20','40','40'], title:'Florida', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    ga:{economy:['41','41','41','41','41','41','41'],finance:['10','41','41','41','41','41','41'], title:'Georgia', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    hi:{economy:['20','20','20','20','20','20','20'],finance:['20','20','20','10','10','00','10'], title:'Hawaii'},
    ia:{economy:['00','00','00','20','20','20','20'],finance:['00','00','00','20','20','20','20'], title:'Iowa'},
    id:{economy:['41','41','41','40','40','40','40'],finance:['40','41','41','41','41','40','40'], title:'Idaho', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    il:{economy:['11','10','20','20','20','20','20'],finance:['41','41','40','40','40','00','20'], title:'Illinois', messages: {finance:"* Illinois policy did not change in 2014 regarding personal finance, but the interpretation for this survey is different than in the past. Illinois has a consumer education mandate for HS that includes financial literacy content yet it does not constitute standards or a course requirement in Personal Finance."}},
    'in':{economy:['30','31','40','40','40','40','41'],finance:['20','21','20','20','20','20','20'], title:'Indiana'},
    ks:{economy:['11','21','21','21','11','10','10'],finance:['00','30','20','20','11','10','10'], title:'Kansas'},
    ky:{economy:['41','41','21','21','20','21','21'],finance:['41','41','21','21','20','20','20'], title:'Kentucky'},
    la:{economy:['41','41','41','41','41','41','31'],finance:['00','00','41','41','41','40','30'], title:'Louisiana'},
    ma:{economy:['21','11','11','10','10','10','10'],finance:['00','00','11','10','10','10','10'], title:'Massachusetts'},
    md:{economy:['21','21','21','21','30','21','21'],finance:['20','10','00','40','20','20','20'], title:'Maryland', messages:{economy:"*Tested as part of the high school Government assessment"}},
    me:{economy:['21','20','20','20','20','20','20'],finance:['21','20','20','20','20','20','20'], title:'Maine'},
    mi:{economy:['21','21','41','41','41','41','41'],finance:['11','11','20','20','20','21','41'], title:'Michigan', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    mn:{economy:['10','20','20','20','30','20','20'],finance:['10','10','20','20','20','20','20'], title:'Minnesota'},
    mo:{economy:['21','21','20','10','20','20','20'],finance:['10','10','41','21','40','41','41'], title:'Missouri'},
    ms:{economy:['21','21','40','41','41','40','41'],finance:['20','20','30','30','30','30','30'], title:'Mississippi', messages:{economy:"*Tested as part of the high school U.S. History assessment"}},
    mt:{economy:['10','20','20','20','20','20','20'],finance:['00','10','20','20','20','20','00'], title:'Montana'},
    nc:{economy:['41','41','41','41','40','40','40'],finance:['21','10','20','20','40','40','40'], title:'North Carolina', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    nd:{economy:['10','10','10','10','10','40','40'],finance:['00','00','00','10','20','40','40'], title:'North Dakota', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    ne:{economy:['10','20','20','10','10','20','20'],finance:['20','20','20','10','10','20','20'], title:'Nebraska'},
    nh:{economy:['41','40','40','40','40','40','40'],finance:['20','10','10','10','20','40','40'], title:'New Hampshire', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    nj:{economy:['10','10','20','40','40','40','40'],finance:['00','00','20','40','40','40','40'], title:'New Jersey', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    nm:{economy:['41','41','41','41','40','41','41'],finance:['21','20','30','00','00','00','00'], title:'New Mexico'},
    nv:{economy:['30','10','20','20','20','20','20'],finance:['00','10','00','20','20','20','20'], title:'Nevada'},
    ny:{economy:['40','41','41','41','41','41','40'],finance:['40','40','10','40','40','00','40'], title:'New York', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    oh:{economy:['31','31','11','11','11','21','21'],finance:['10','10','20','11','10','10','20'], title:'Ohio'},
    ok:{economy:['21','21','21','11','11','10','10'],finance:['00','00','00','40','20','40','20'], title:'Oklahoma'},
    or:{economy:['10','21','21','20','20','21','21'],finance:['20','21','21','21','20','20','21'], title:'Oregon'},
    pa:{economy:['10','20','20','20','20','20','20'],finance:['20','20','10','20','20','20','20'], title:'Pennsylvania'},
    ri:{economy:['00','10','00','00','00','20','20'],finance:['11','10','00','00','00','00','10'], title:'Rhode Island'},
    sc:{economy:['41','41','41','41','41','41','41'],finance:['00','20','20','20','20','20','20'], title:'South Carolina'},
    sd:{economy:['20','40','40','41','41','30','30'],finance:['00','00','40','40','40','30','30'], title:'South Dakota'},
    tn:{economy:['41','41','41','41','41','40','40'],finance:['00','00','10','40','41','40','40'], title:'Tennessee'},
    tx:{economy:['41','41','41','40','40','41','41'],finance:['20','20','20','20','20','41','41'], title:'Texas', messages:{finance:"*Personal finance instruction integrated in another required course"}},
    ut:{economy:['20','10','10','20','40','20','20'],finance:['10','40','40','41','40','40','41'], title:'Utah'},
    va:{economy:['21','21','21','41','41','41','41'],finance:['00','21','21','40','40','40','40'], title:'Virginia'},
    vt:{economy:['20','10','20','20','10','20','20'],finance:['20','20','10','20','20','10','10'], title:'Vermont'},
    wa:{economy:['10','10','10','20','20','20','20'],finance:['00','00','10','20','10','10','20'], title:'Washington'},
    wv:{economy:['21','20','21','21','31','31','30'],finance:['00','00','20','21','40','40','30'], title:'West Virginia'},
    wi:{economy:['21','21','21','21','21','21','11'],finance:['10','10','10','10','20','20','10'], title:'Wisconsin'},
    wy:{economy:['20','20','20','20','20','40','20'],finance:['00','20','20','20','20','20','00'], title:'Wyoming'},

},
  stats : [
    {
      
      economy : {
        label: "States (+D.C.) that include economics in their K-12 standards",
        values: [49,50,49,50,50,50.9,50.9]
      },
      finance : {
        label: "States (+D.C.) that include personal finance in their K-12 standards",
        values: [31,38,40,44,46,43,45]
      }
    },

    {
      economy : {
        label: "States (+D.C.) that require standards to be implemented",
        values: [34,38,41,40,40,46,45]
      },
      finance : {
        label: "States (+D.C.) that require standards to be implemented",
        values: [17,21,28,34,36,35,37]
      }
    },

    {
      economy : {
        label: "States (+D.C.) where high school course is required to be offered",
        values : [17,17,17,21,25,24,23]
      },
      finance : {
        label: "States (+D.C.) where high school course is required to be offered",
        values:  [4,8,9,15,14,19,22]
      }
    },

    {
      economy : {
        label: "States (+D.C.) where high school course is required to be taken",
        values: [14,15,17,21,22,22,20]
      },
      finance : {
        label: "States (+D.C.) where high school course is required to be taken",
        values:  [4,7,7,13,13,17,17]
      }
    },

    {
      economy : {
        label: "States (+D.C.) with standardized testing of economic concepts",
        values: [27,26,23,19,16,16,16]
      },
      finance : {
        label: "States (+D.C.) with standardized testing of personal finance concepts",
        values:  [8,9,9,9,5,6,7]
      }
    }
    
  ],
  
  
  links : {
    
    al : {
      economy : ["http://www.alsde.edu/sec/sct/COS/2010%20Alabama%20Social%20Studies%20Course%20of%20Study.pdf", "http://web.alsde.edu/general/ALABAMA_HIGH_SCHOOL_GRADUATION_REQUIREMENTS.pdf"],
      finance : ["http://www.alsde.edu/sec/sct/COS/Career%20Preparedness.pdf", "http://web.alsde.edu/general/ALABAMA_HIGH_SCHOOL_GRADUATION_REQUIREMENTS.pdf"]
    },
    
    ar : {
      economy : ["http://www.arkansased.gov/divisions/learning-services/curriculum-and-instruction/curriculum-framework-documents/social-studies-new-courses-valid-july-1-2015", "http://www.arkansased.gov/divisions/learning-services/curriculum-and-instruction/smart-core-core"],
      finance : ["http://www.arkansased.gov/divisions/learning-services/curriculum-and-instruction/curriculum-framework-documents/social-studies-new-courses-valid-july-1-2015", "http://www.arkansased.gov/divisions/learning-services/curriculum-and-instruction/smart-core-core"]
    },
    
    az : {
      economy : ["http://www.azed.gov/standards-practices/files/2011/09/ssstandard-full-05-22-06.pdf", "http://www.azed.gov/hsgraduation/"],
      finance : ["http://www.azed.gov/standards-practices/files/2011/09/ssstandard-full-05-22-06.pdf", "http://www.azed.gov/hsgraduation/"]
    },
    
    ak : {
      economy : ["https://education.alaska.gov/AKStandards/standards/standards.pdf", null],
      finance : ["http://education.alaska.gov/akstandards/standards/standards.pdf",null]
    },
    
    ca : {
      economy : ["http://www.cde.ca.gov/be/st/ss/documents/histsocscistnd.pdf","http://www.cde.ca.gov/ci/gs/hs/hsgrmin.asp"],
      finance : ["http://www.cde.ca.gov/be/st/ss/documents/histsocscistnd.pdf","http://www.cde.ca.gov/ci/gs/hs/hsgrtable.asp"]
    },
    
    co : {
      economy : ["http://www.cde.state.co.us/cosocialstudies/statestandards", null, "https://www.cde.state.co.us/assessment/newassess-sum"],
      finance : ["http://www.cde.state.co.us/cosocialstudies/statestandards",null, "https://www.cde.state.co.us/assessment/newassess-sum"]
    },
    
    ct : {
      economy : ["http://www.sde.ct.gov/sde/lib/sde/pdf/board/ssframeworks.pdf",null],
      finance : ["http://www.sde.ct.gov/sde/lib/sde/pdf/deps/career/business/Personal_Finance.pdf",null]
    },
    
    dc : {
      economy : ["http://osse.dc.gov/sites/default/files/dc/sites/osse/publication/attachments/DCPS-horiz-soc_studies.pdf",null],
      finance : ["http://osse.dc.gov/sites/default/files/dc/sites/osse/publication/attachments/DCPS-horiz-soc_studies.pdf",null]
    },
  
    de : {
      economy : ["http://www.doe.k12.de.us/cms/lib09/DE01922744/Centricity/domain/66/standards/DE%20K-12%20Economics%20Standards.doc",null, "http://www.doe.k12.de.us/Page/2546"],
      finance : ["http://www.doe.k12.de.us/cms/lib09/DE01922744/Centricity/domain/66/standards/DE%20HS%20Personal%20Finance%20Standards.doc",null]
    },
    
    fl : {
      economy : ["http://www.cpalms.org/Public/search/Standard","http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=1000-1099/1003/Sections/1003.4282.html"],
      finance : ["http://www.cpalms.org/Public/search/Standard", "http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=1000-1099/1003/Sections/1003.4282.html"]
    },
    
    ga : {
      economy : ["https://www.georgiastandards.org/standards/Georgia%20Performance%20Standards/Economics.pdf", "http://archives.gadoe.org/_documents/doe/legalservices/160-4-2-.48.pdf", "https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Assessment/Pages/Georgia-Milestones-Assessment-System.aspx"],
      finance : ["https://www.georgiastandards.org/standards/Georgia%20Performance%20Standards/Economics.pdf", "http://archives.gadoe.org/_documents/doe/legalservices/160-4-2-.48.pdf", "https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Assessment/Pages/Georgia-Milestones-Assessment-System.aspx"]
    },
    
    hi : {
      economy : ["http://165.248.72.55/hcpsv3/files/final_hcpsiii_socialstudies_librarydocs_1.pdf",null],
      finance : ["http://165.248.72.55/hcpsv3/search_results.jsp?contentarea=Social+Studies&gradecourse=Economics&strand=&showbenchmark=benchmark&showspa=spa&showrubric=rubric&Go!=Submit",null]
    },
    
    ia : {
      economy : ["https://iowacore.gov/sites/default/files/k-12_socialstudies_0.pdf", null],
      finance : ["https://iowacore.gov/iowa-core/subject/21st-century-skills",null]
    },
    
    id : {
      economy : ["http://sde.idaho.gov/academic/social-studies/","http://adminrules.idaho.gov/rules/current/08/0203.pdf"], 
      finance : ["http://sde.idaho.gov/academic/social-studies/","http://adminrules.idaho.gov/rules/current/08/0203.pdf"]
    },
    
    il : {
      economy : ["http://www.isbe.net/ils/social_science/standards.htm",null],
      finance : ["http://www.isbe.net/ils/social_science/standards.htm",null]
    },
    
    in : {
      economy : ["http://www.doe.in.gov/standards/social-studies", "http://www.doe.in.gov/sites/default/files/curriculum/core-40-and-honors-rule-summary-12-7-12.pdf","http://www.doe.in.gov/assessment/istep-grades-3-8"],
      finance : ["http://www.doe.in.gov/standards/financial-literacy",null]
    },
  
    ks : {
      economy : ["http://www.ksde.org/Portals/0/CSAS/Content%20Area%20%28F-L%29/History,%20Government,%20and%20Social%20Studies/2013%20Kansas%20History%20Government%20Social%20Studies%20Standards.pdf",null],
      finance : ["http://www.ksde.org/Portals/0/CSAS/Content%20Area%20%28F-L%29/History,%20Government,%20and%20Social%20Studies/High%20School%20Economics.pdf",null]
    },
    
    ky : {
      economy : ["http://education.ky.gov/curriculum/standards/kyacadstand/Pages/default.aspx",null,"http://education.ky.gov/AA/Assessments/Pages/K-PREP.aspx"],
      finance : ["http://education.ky.gov/curriculum/standards/kyacadstand/Pages/default.aspx",null]
    },
    
    la : {
      economy : ["http://www.louisianabelieves.com/resources/library/academic-standards","http://legis.la.gov/Legis/Law.aspx?d=80400", "http://www.louisianabelieves.com/assessment"],
      finance : ["http://www.louisianabelieves.com/resources/library/academic-standards","http://legis.la.gov/Legis/Law.aspx?d=80400"]
    },
    
    ma : {
      economy : ["http://www.doe.mass.edu/frameworks/hss/final.pdf",null],
      finance : ["http://www.doe.mass.edu/CandI/model/files.aspx?id=9D37105B8648C3A423CF48F3393E934887182D21",null]
    },
    
    md : {
      economy : ["http://mdk12.msde.maryland.gov/instruction/curriculum/social_studies/index.html",null,"http://mdk12.msde.maryland.gov/assessments/high_school/"],
      finance : ["http://www.marylandpublicschools.org/fle/standards.html",null]
    },
    
    me : {
      economy : ["http://www.maine.gov/doe/socialstudies/documents/ss102207.pdf",null],
      finance : ["http://www.maine.gov/doe/socialstudies/documents/ss102207.pdf",null]
    },
    
    mi : {
      economy : ["http://www.michigan.gov/mde/0,4615,7-140-28753_64839_65510---,00.html","http://www.michigan.gov/mde/0,4615,7-140-28753_38924---,00.html","http://www.michigan.gov/mde/0,4615,7-140-22709_70117---,00.html"],
      finance : ["http://www.michigan.gov/mde/0,4615,7-140-28753_64839_65510---,00.html", "http://www.michigan.gov/mde/0,4615,7-140-28753_38924---,00.html", "http://www.michigan.gov/mde/0,4615,7-140-22709_70117---,00.html"]
    },
    
    mn : {
      economy : ["http://education.state.mn.us/mdeprod/idcplg?IdcService=GET_FILE&dDocName=042018&RevisionSelectionMethod=latestReleased&Rendition=primary",null],
      finance : ["http://education.state.mn.us/mdeprod/idcplg?IdcService=GET_FILE&dDocName=042018&RevisionSelectionMethod=latestReleased&Rendition=primary",null]
    },
    
    mo : {
      economy : ["https://dese.mo.gov/college-career-readiness/curriculum/missouri-learning-standards",null],
      finance : ["http://dese.mo.gov/sites/default/files/personal_finance_competencies.pdf","http://dese.mo.gov/sites/default/files/Graduation%20Handbook.pdf", "https://dese.mo.gov/college-career-readiness/assessment/personal-finance"]
    },
    
    ms : {
      economy : ["http://www.mde.k12.ms.us/docs/curriculum-and-instructions-library/2011-mississsippi-social-studies-framework.pdf?sfvrsn=4","http://www.mde.k12.ms.us/docs/dropout-prevention-and-compulsory-school-attendance-library/mississippi-high-school-nbsp-graduation-pathway.pdf?sfvrsn=0","http://www.mde.k12.ms.us/OSA/SATP2"],
      finance : ["https://districtaccess.mde.k12.ms.us/curriculumandInstruction/Business%20and%20Technology1/New%20BTE%20Framework/02.Personal-Finance.pdf","https://districtaccess.mde.k12.ms.us/curriculumandInstruction/Business%20and%20Technology1/New%20BTE%20Framework/00.Table-of-Contents-and-Introduction-Business-and-Technology-Education-Framework-2014.pdf",null]
    },
    
    mt : {
      economy : ["http://opi.mt.gov/PDF/Standards/ContStds-SocSt.pdf",null],
      finance : ["http://opi.mt.gov/PDF/Standards/ContStds-SocSt.pdf",null]
    },
    
    nc : {
      economy : ["http://www.dpi.state.nc.us/acre/standards/new-standards/#social","http://www.dpi.state.nc.us/docs/curriculum/home/graduationrequirements.pdf"],
      finance : ["http://www.dpi.state.nc.us/acre/standards/new-standards/#social","http://www.dpi.state.nc.us/docs/curriculum/home/graduationrequirements.pdf"]
    },
    
    nd : {
      economy : ["https://www.nd.gov/dpi/uploads/87/Soc_studies.pdf", "http://www.legis.nd.gov/cencode/t15-1c21.pdf?20150930065150"],
      finance : ["https://www.nd.gov/dpi/uploads/87/Soc_studies.pdf","http://www.legis.nd.gov/cencode/t15-1c21.pdf?20150930065150"]
    },
    
    ne : {
      economy : ["http://www.education.ne.gov/AcademicStandards/Documents/NE_SocialStudiesStandardsApproved.pdf",null],
      finance : ["http://www.education.ne.gov/AcademicStandards/Documents/NE_SocialStudiesStandardsApproved.pdf",null]
    },
    
    nh : {
      economy : ["http://education.nh.gov/instruction/curriculum/social_studies/documents/frameworks.pdf", "http://education.nh.gov/legislation/documents/ed3062014-min-stands.pdf"],
      finance : ["http://education.nh.gov/instruction/curriculum/social_studies/documents/frameworks.pdf","http://education.nh.gov/legislation/documents/ed3062014-min-stands.pdf"]
    },
    
    nj : {
      economy : ["http://www.state.nj.us/education/cccs/2014/ss/standards.pdf","http://www.state.nj.us/education/code/current/title6a/chap8.pdf"],
      finance : ["http://www.state.nj.us/education/cccs/2014/career/91.pdf","http://www.state.nj.us/education/code/current/title6a/chap8.pdf"]
    },
    
    nm : {
      economy : ["http://www.ped.state.nm.us/standards/index.html","http://ped.state.nm.us/ped/GradDocs/requirement/NMSA%2022.13.1.1%20Graudation%20Requirements.pdf","http://ped.state.nm.us/AssessmentAccountability/AssessmentEvaluation/EOC/2015/SocialStudies/Economics%20Blueprint%20v004.pdf"],
      finance : [null,"http://ped.state.nm.us/ped/GradDocs/requirement/NMSA%2022.13.1.1%20Graudation%20Requirements.pdf", null]
    },
    
    nv : {
      economy : ["http://www.doe.nv.gov/Standards_Instructional_Support/Nevada_Academic_Standards/Social_Studies/CompleteStandardsDec2008/",null],
      finance : ["http://www.doe.nv.gov/Standards_Instructional_Support/Nevada_Academic_Standards/Financial_Literacy/", null]
    },
    
    ny : {
      economy : ["https://www.engageny.org/resource/new-york-state-k-12-social-studies-framework","http://www.p12.nysed.gov/part100/pages/1005.html"],
      finance : ["https://www.engageny.org/resource/new-york-state-k-12-social-studies-framework","http://www.p12.nysed.gov/part100/pages/1005.html",null]
    },
    
    oh : {
      economy : ["http://education.ohio.gov/Topics/Ohios-Learning-Standards/Social-Studies",null,"http://education.ohio.gov/Topics/Testing"],
      finance : ["http://education.ohio.gov/Topics/Ohios-Learning-Standards/Social-Studies",null]
    },
    
    ok : {
      economy : ["http://sde.ok.gov/sde/sites/ok.gov.sde/files/documents/files/Social%20Studies%20OK%20Academic%20Standards.rev815pdf.pdf",null],
      finance : ["http://sde.ok.gov/sde/sites/ok.gov.sde/files/PASS_Personal_Financial_Literacy_rev08-2015.pdf",null]
    },
    
    or : {
      economy : ["http://www.ode.state.or.us/teachlearn/subjects/socialscience/standards/oregon-social-sciences-academic-content-standards.pdf",null,"http://www.ode.state.or.us/search/page/?id=496#SS"],
      finance : ["http://www.ode.state.or.us/teachlearn/subjects/socialscience/standards/oregon-social-sciences-academic-content-standards.pdf",null, "http://www.ode.state.or.us/search/page/?id=496#SS"]
    },
    
    pa : {
      economy : ["http://www.pdesas.org/Page?pageId=11",null],
      finance : ["http://www.pdesas.org/Page?pageId=11",null]
    },
    
    ri : {
      economy : ["http://www.ride.ri.gov/Portals/0/Uploads/Documents/Instruction-and-Assessment-World-Class-Standards/Social-Studies/RI-Economics-GSEs-K-12.pdf",null],
      finance : ["http://www.ride.ri.gov/InstructionAssessment/OtherSubjects.aspx#33101172-about-the-framework",null]
    },
    
    sc : {
      economy : ["http://www.ed.sc.gov/scdoe/assets/File/agency/ccr/Standards-Learning/documents/FINALAPPROVEDSSStandardsAugust182011.pdf","https://ed.sc.gov/scdoe/assets/File/policy/federal-education-programs/title-i/Reg234.pdf", "http://www.ed.sc.gov/tests/middle/scpass/scpass-test-blueprints/scpass-social-studies/"],
      finance : ["https://ed.sc.gov/instruction/standards-learning/programs-grants-awards/financial-literacy/",null]
    },
    
    sd : {
      economy : ["http://doe.sd.gov/ContentStandards/documents/SocialStd.pdf","http://legis.sd.gov/rules/DisplayRule.aspx?Rule=24:43:11:02"],
      finance : ["http://doe.sd.gov/ContentStandards/documents/PerFinanceSt.pdf","http://legis.sd.gov/rules/DisplayRule.aspx?Rule=24:43:11:02"]
    },
    
    tn : {
      economy : ["http://tn.gov/education/article/social-studies-standards","http://www.tennessee.gov/education/topic/graduation-requirements"],
      finance : ["http://tn.gov/education/article/personal-finance-standards","http://www.tennessee.gov/education/topic/graduation-requirements"]
    },
    
    tx : {
      economy : ["http://tea.texas.gov/curriculum/teks/","http://ritter.tea.state.tx.us/rules/tac/chapter118/ch118a.html","http://tea.texas.gov/student.assessment/staar/"],
      finance : ["http://tea.texas.gov/curriculum/teks/","http://ritter.tea.state.tx.us/rules/tac/chapter118/ch118a.html", "http://tea.texas.gov/student.assessment/staar/"]
    },
    
    ut : {
      economy : ["http://financeintheclassroom.org/passport/matrix.shtml",null],
      finance : ["http://financeintheclassroom.org/downloads/GFLStandardsObjectives.pdf","http://www.rules.utah.gov/publicat/code/r277/r277-700.htm#T6","http://financeintheclassroom.org/downloads/SB0040.pdf"]
    },
    
    va : {
      economy : ["http://www.doe.virginia.gov/testing/sol/standards_docs/economics_personal_finance/economics_personal_finance_sol.pdf","http://www.doe.virginia.gov/instruction/graduation/approved_courses.pdf","http://www.doe.virginia.gov/testing/sol/standards_docs/history_socialscience/index.shtml"],
      finance : ["http://www.doe.virginia.gov/testing/sol/standards_docs/economics_personal_finance/economics_personal_finance_sol.pdf","http://www.doe.virginia.gov/instruction/graduation/approved_courses.pdf"]
    },
    
    vt : {
      economy : ["http://education.vermont.gov/documents/framework.pdf",null],
      finance : ["http://education.vermont.gov/documents/educ_pubs_ge_family_consumer_sciences.pdf",null]
    },
    
    wa : {
      economy : ["http://k12.wa.us/SocialStudies/EALRs-GLEs.aspx",null],
      finance : ["http://k12.wa.us/SocialStudies/EALRs-GLEs.aspx",null]
    },
    
    wi : {
      economy : ['http://dpi.wi.gov/social-studies/standards',null,"http://dpi.wi.gov/assessment/wkce"],
      finance : ['http://dpi.wi.gov/finance/standards',null]
    },
    
    wv: {
      economy : ["http://apps.sos.wv.gov/adlaw/csr/readfile.aspx?DocId=23480&Format=PDF", "http://wvde.state.wv.us/counselors/students/documents/ChartIV-WVHighSchoolGraduationRequirements.docx",null],
      finance : ["http://apps.sos.wv.gov/adlaw/csr/readfile.aspx?DocId=23480&Format=PDF","http://wvde.state.wv.us/counselors/students/documents/ChartIV-WVHighSchoolGraduationRequirements.docx"]
    },
    
    wy : {
      economy : ['http://edu.wyoming.gov/downloads/standards/2015/2014-SS-WyCPS-FINAL.pdf',null],
      finance : ['http://edu.wyoming.gov/sf-docs/publications/Standards_2008_Social_Studies_PDF',null]
    }
  }
}
