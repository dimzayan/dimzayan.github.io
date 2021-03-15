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
    al:{economy:['41','41','40','40','40','40'],finance:['21','20','10','10','10','40'], title:'Alabama'},
    ak:{economy:['00','10','10','10','10','10'],finance:['00','00','00','00','00','00'], title:'Alaska'},
    ar:{economy:['20','20','20','40','40','40'],finance:['10','10','10','40','10','20'], title:'Arkansas'},
    az:{economy:['20','20','20','40','40','40'],finance:['20','20','20','20','20','40'], title:'Arizona'},

ca:{economy:['41','41','40','40','41','40'],finance:['00','10','00','00','00','00'], title:'California'},
    co:{economy:['20','20','20','20','20','21'],finance:['00','00','00','00','20','21'], title:'Colorado'},
    ct:{economy:['11','10','11','10','10','10'],finance:['00','10','10','10','10','10'], title:'Connecticut'},
    dc:{economy:['10','10','20','10','10','20'],finance:['00','00','00','00','00','00'], title:'District of Columbia'},
   de:{economy:['21','21','21','20','21','21'],finance:['10','10','11','00','10','11'], title:'Delaware'},
    fl:{economy:['40','40','41','40','40','40'],finance:['10','10','10','20','20','40'], title:'Florida'},
    ga:{economy:['41','41','41','41','41','41'],finance:['10','41','41','41','41','41'], title:'Georgia'},
    hi:{economy:['20','20','20','20','20','20'],finance:['10','20','20','10','10','00'], title:'Hawaii'},
    
ia:{economy:['00','00','00','20','20','20'],finance:['00','00','00','20','20','20'], title:'Iowa'},
    id:{economy:['41','41','41','40','40','40'],finance:['40','41','41','41','41','40'], title:'Idaho'},
    il:{economy:['11','10','20','20','20','20'],finance:['41','41','40','40','40','00'], title:'Illinois'},
    'in':{economy:['20','31','40','40','40','40'],finance:['00','21','20','20','20','20'], title:'Indiana'},
     ks:{economy:['11','21','21','21','11','10'],finance:['00','30','20','20','11','10'], title:'Kansas'},
    ky:{economy:['41','41','21','21','20','21'],finance:['41','00','21','21','20','20'], title:'Kentucky'},
    la:{economy:['41','41','41','41','41','41'],finance:['00','00','41','41','41','40'], title:'Louisiana'},
    ma:{economy:['21','11','11','10','10','10'],finance:['00','00','11','10','10','10'], title:'Massachusetts'},
     md:{economy:['21','21','21','21','30','21'],finance:['20','10','00','40','20','20'], title:'Maryland'},
    me:{economy:['21','20','20','20','20','20'],finance:['20','20','20','20','20','20'], title:'Maine'},
    mi:{economy:['21','21','41','41','41','41'],finance:['10','11','20','20','20','21'], title:'Michigan'},
    mn:{economy:['10','20','20','20','30','20'],finance:['10','10','20','20','20','10'], title:'Minnesota'},
   
mo:{economy:['21','21','20','10','20','20'],finance:['00','10','41','21','40','41'], title:'Missouri'},
     ms:{economy:['21','21','20','41','41','40'],finance:['10','20','30','30','30','30'], title:'Mississippi'},
    mt:{economy:['10','20','20','20','20','20'],finance:['00','10','20','20','20','20'], title:'Montana'},
    
nc:{economy:['41','41','41','41','40','40'],finance:['20','10','20','20','40','40'], title:'North Carolina'},
   
nd:{economy:['10','10','10','10','10','40'],finance:['00','00','00','10','20','40'], title:'North Dakota'},

ne:{economy:['10','20','20','10','10','20'],finance:['20','20','20','10','10','20'], title:'Nebraska'},

nh:{economy:['41','40','30','40','40','40'],finance:['20','10','10','10','20','40'], title:'New Hampshire'},
    nj:{economy:['10','10','20','40','40','40'],finance:['00','00','20','40','40','40'], title:'New Jersey'},

nm:{economy:['41','41','41','41','40','41'],finance:['20','20','30','30','00','30'], title:'New Mexico'},
    nv:{economy:['30','10','20','20','20','20'],finance:['20','10','00','20','20','20'], title:'Nevada'},
    ny:{economy:['40','41','41','41','41','41'],finance:['40','40','10','40','40','00'], title:'New York'},
    
oh:{economy:['31','30','11','11','11','21'],finance:['10','10','20','11','10','10'], title:'Ohio'},
    ok:{economy:['10','21','21','11','11','10'],finance:['00','00','00','40','20','40'], title:'Oklahoma'},
    or:{economy:['10','21','21','20','20','21'],finance:['00','10','21','21','20','20'], title:'Oregon'},
    pa:{economy:['10','20','20','20','20','20'],finance:['20','20','10','20','20','20'], title:'Pennsylvania'},
    ri:{economy:['00','00','00','00','00','20'],finance:['10','10','00','00','00','00'], title:'Rhode Island'},
    sc:{economy:['41','41','41','41','41','41'],finance:['00','20','20','20','20','20'], title:'South Carolina'},
    sd:{economy:['20','40','40','41','41','31'],finance:['00','00','40','40','40','30'], title:'South Dakota'},
    tn:{economy:['41','41','41','41','41','40'],finance:['00','00','10','40','41','40'], title:'Tennessee'},
    tx:{economy:['41','41','41','40','40','41'],finance:['20','20','20','20','20','41'], title:'Texas'},
    ut:{economy:['20','10','10','20','40','20'],finance:['10','40','40','41','40','40'], title:'Utah'},
  
va:{economy:['20','21','21','41','41','41'],finance:['00','21','21','40','40','40'], title:'Virginia'},
    vt:{economy:['20','10','20','20','10','20'],finance:['20','20','10','20','20','10'], title:'Vermont'},
    wa:{economy:['10','10','10','20','20','20'],finance:['00','00','10','20','10','10'], title:'Washington'},
    wv:{economy:['20','10','21','21','31','31'],finance:['00','00','20','21','40','40'], title:'West Virginia'},
    wi:{economy:['21','21','21','21','21','31'],finance:['10','10','10','10','20','20'], title:'Wisconsin'},
    wy:{economy:['20','20','20','20','20','40'],finance:['00','20','20','20','20','20'], title:'Wyoming'},

},
  stats : [
    {
      label: "States (+D.C.) that include the K-12 Standards",
      economy : [48,49,49,50,50,50.9],
      finance : [31,36,40,44,46,43]
    },
    {
      label: "States (+D.C.) that require standards to be implemented",
      economy : [33,38,40,40,40,45],
      finance : [17,21,28,34,36,35]
    },
    {
      label: "States (+D.C.) where High School course is required to be offered",
      economy : [17,16,17,21,25,24],
      finance : [1,7,9,15,14,19]
    },
    {
      label: "States (+D.C.) where High School course is required to be taken",
      economy : [14,14,17,21,23,22],
      finance : [1,6,7,13,13,17]
    },
    {
      label: "States (+D.C.) that require student testing",
      economy : [24,24,23,18,16,16],
      finance : [8,8,9,9,5,6]
    }
  ],
  
  
  links : {
    
    al : {
      economy : ["http://alex.state.al.us/standardAll.php?subject=T1&summary=1", "http://www.alsde.edu/general/ALABAMA_HIGH_SCHOOL_GRADUATION_REQUIREMENTS.pdf"],
      finance : ["http://alex.state.al.us/standardAll.php?subject=T1&summary=1", "http://www.alsde.edu/general/ALABAMA_HIGH_SCHOOL_GRADUATION_REQUIREMENTS.pdf"]
    },
    
    ar : {
      economy : ["http://www.arkansased.org/public/userfiles/Learning_Services/Curriculum%20and%20Instruction/Frameworks/Social%20Studies/economics_061009.pdf", "http://www.arkansased.org/public/userfiles/Learning_Services/Curriculum%20and%20Instruction/Smartcore%20Core/smartcore_consent_2014_080713.pdf"],
      finance : ["http://www.arkansased.org/public/userfiles/Learning_Services/Curriculum%20and%20Instruction/Frameworks/Social%20Studies/economics_061009.pdf", null]
    },
    
    az : {
      economy : ["http://www.azed.gov/standards-practices/files/2011/09/socialstudiesstrand5.pdf", "http://www.azed.gov/wp-content/uploads/2013/04/state-board-graduation-requirements.pdf"],
      finance : ["http://www.azed.gov/standards-practices/files/2011/09/socialstudiesstrand5.pdf", "http://www.azleg.gov/legtext/51leg/1r/laws/0252.pdf"]
    },
    
    ak : {
      economy : ["http://education.alaska.gov/akstandards/standards/standards.pdf", null],
      finance : ["http://education.alaska.gov/akstandards/standards/standards.pdf",null]
    },
    
    ca : {
      economy : ["http://www.cde.ca.gov/be/st/ss/documents/histsocscistnd.pdf","http://www.cde.ca.gov/ci/gs/hs/hsgrtable.asp"],
      finance : ["http://www.cde.ca.gov/be/st/ss/documents/histsocscistnd.pdf","http://www.cde.ca.gov/ci/gs/hs/hsgrtable.asp"]
    },
    
    co : {
      economy : ["http://www.cde.state.co.us/sites/default/files/documents/cosocialstudies/documents/social_studies_adopted_12_10_09.pdf", null],
      finance : ["http://www.cde.state.co.us/sites/default/files/documents/cosocialstudies/documents/social_studies_adopted_12_10_09.pdf",null]
    },
    
    ct : {
      economy : ["http://www.sde.ct.gov/sde/lib/sde/PDF/Curriculum/Curriculum_Root_Web_Folder/cccsocst.pdf",null],
      finance : ["http://www.sde.ct.gov/sde/lib/sde/PDF/Curriculum/Curriculum_Root_Web_Folder/cccsocst.pdf",null]
    },
    
    dc : {
      economy : ["http://osse.dc.gov/sites/default/files/dc/sites/osse/publication/attachments/DCPS-horiz-soc_studies.pdf",null],
      finance : ["http://osse.dc.gov/sites/default/files/dc/sites/osse/publication/attachments/DCPS-horiz-soc_studies.pdf",null]
    },
  
    de : {
      economy : ["http://www.doe.k12.de.us/ss",null],
      finance : ["http://www.doe.k12.de.us/ss",null]
    },
    
    fl : {
      economy : ["http://www.cpalms.org/Standards/AccesspointSearch.aspx","http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=1000-1099/1003/Sections/1003.4282.html"],
      finance : ["http://www.cpalms.org/Standards/AccesspointSearch.aspx", "http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=1000-1099/1003/Sections/1003.4282.html"]
    },
    
    ga : {
      economy : ["https://www.georgiastandards.org/standards/Georgia%20Performance%20Standards/Economics.pdf", "http://archives.gadoe.org/_documents/doe/legalservices/160-4-2-.48.pdf"],
      finance : ["https://www.georgiastandards.org/standards/Georgia%20Performance%20Standards/Economics.pdf", "http://archives.gadoe.org/_documents/doe/legalservices/160-4-2-.48.pdf"]
    },
    
    hi : {
      economy : ["http://socialstudies.k12.hi.us/pdfs/standards/final_hcpsiii_socialstudies_librarydocs_1.pdf",null],
      finance : ["http://socialstudies.k12.hi.us/pdfs/standards/final_hcpsiii_socialstudies_librarydocs_1.pdf",null]
    },
    
    ia : {
      economy : ["https://www.educateiowa.gov/sites/files/ed/documents/K-12_SocialStudies.pdf",null],
      finance : ["https://www.educateiowa.gov/sites/files/ed/documents/K-12_21stCentSkills.pdf",null]
    },
    
    id : {
      economy : ["http://www.sde.idaho.gov/site/content_standards/ss_standards.htm","http://adminrules.idaho.gov/rules/current/08/0203.pdf"],
      finance : ["http://www.sde.idaho.gov/site/content_standards/ss_standards.htm","http://adminrules.idaho.gov/rules/current/08/0203.pdf"]
    },
    
    il : {
      economy : ["http://www.isbe.state.il.us/ils/social_science/standards.htm",null],
      finance : ["http://www.isbe.state.il.us/ils/social_science/standards.htm",null]
    },
    
    in : {
      economy : ["https://learningconnection.doe.in.gov/Standards/PrintLibrary.aspx", "http://www.doe.in.gov/sites/default/files/curriculum/core-40-and-honors-rule-summary-12-7-12.pdf"],
      finance : ["https://learningconnection.doe.in.gov/Standards/PrintLibrary.aspx",null]
    },
  
    ks : {
      economy : ["http://www.ksde.org/Portals/0/CSAS/Content%20Area%20%28F-L%29/History,%20Government,%20and%20Social%20Studies/2013%20Kansas%20History%20Government%20Social%20Studies%20Standards.pdf",null],
      finance : ["http://www.ksde.org/Portals/0/CSAS/Content%20Area%20%28F-L%29/History,%20Government,%20and%20Social%20Studies/2013%20Kansas%20History%20Government%20Social%20Studies%20Standards.pdf",null]
    },
    
    ky : {
      economy : ["http://education.ky.gov/curriculum/docs/Documents/POS%20with%20CCS%20for%20public%20review.pdf",null],
      finance : ["http://education.ky.gov/curriculum/docs/Documents/POS%20with%20CCS%20for%20public%20review.pdf",null]
    },
    
    la : {
      economy : ["http://www.louisianabelieves.com/docs/academic-standards/standards---k-12-social-studies.pdf?sfvrsn=2","http://www.legis.state.la.us/lss/lss.asp?doc=80400"],
      finance : ["http://www.legis.state.la.us/lss/lss.asp?doc=80400","http://www.legis.state.la.us/lss/lss.asp?doc=80400"]
    },
    
    ma : {
      economy : ["http://www.doe.mass.edu/frameworks/hss/final.pdf",null],
      finance : ["http://www.doe.mass.edu/frameworks/hss/final.pdf",null]
    },
    
    md : {
      economy : ["http://www.mdk12.org/instruction/curriculum/index.html",null],
      finance : ["http://www.mdk12.org/instruction/curriculum/financial_literacy/financialLiteracy_STANDARDS.pdf",null]
    },
    
    me : {
      economy : ["http://maine.gov/doe/socialstudies/standards/learningresults.html",null],
      finance : ["http://maine.gov/doe/socialstudies/standards/learningresults.html",null]
    },
    
    mi : {
      economy : ["http://www.michigan.gov/documents/mde/SSGLCE_218368_7.pdf","http://www.legislature.mi.gov/%28S%28ki3tdmjs1520jp451wdmvv2y%29%29/mileg.aspx?page=GetObject&objectname=mcl-380-1278a"],
      finance : ["http://www.michigan.gov/documents/mde/SSGLCE_218368_7.pdf",null]
    },
    
    mn : {
      economy : ["http://education.state.mn.us/MDE/EdExc/StanCurri/K-12AcademicStandards/SocialStudies/index.html",null],
      finance : ["http://education.state.mn.us/MDE/EdExc/StanCurri/K-12AcademicStandards/SocialStudies/index.html",null]
    },
    
    mo : {
      economy : ["http://dese.mo.gov/divimprove/curriculum/GLE/","http://dese.mo.gov/divimprove/assess/documents/Personal_Finance_Competencies.pdf"],
      finance : ["http://dese.mo.gov/divimprove/assess/documents/Personal_Finance_Competencies.pdf","http://dese.mo.gov/divcareered/personal_finance.htm"]
    },
    
    ms : {
      economy : ["http://www.mde.k12.ms.us/docs/curriculum-and-instructions-library/2011-mississsippi-social-studies-framework.pdf?sfvrsn=4","http://www.jackson.k12.ms.us/departments/curriculum/publications/graduation_requirements.pdf"],
      finance : ["http://www.mde.k12.ms.us/docs/curriculum-and-instructions-library/2011-mississsippi-social-studies-framework.pdf?sfvrsn=4",null]
    },
    
    mt : {
      economy : ["http://opi.mt.gov/PDF/Standards/ContStds-SocSt.pdf",null],
      finance : ["http://opi.mt.gov/PDF/Standards/ContStds-SocSt.pdf",null]
    },
    
    nc : {
      economy : ["http://www.dpi.state.nc.us/curriculum/socialstudies/scos/","http://www.dpi.state.nc.us/docs/curriculum/home/graduationrequirements.pdf"],
      finance : ["http://www.dpi.state.nc.us/curriculum/socialstudies/scos/","http://www.dpi.state.nc.us/docs/curriculum/home/graduationrequirements.pdf"]
    },
    
    nd : {
      economy : ["http://www.dpi.state.nd.us/standard/content/sstudies/SS.pdf", "http://www.legis.nd.gov/cencode/t15-1c21.pdf?20131223132328"],
      finance : ["http://www.dpi.state.nd.us/standard/content/sstudies/SS.pdf","http://www.legis.nd.gov/cencode/t15-1c21.pdf?20131223132328"]
    },
    
    ne : {
      economy : ["http://www.education.ne.gov/ss/Index.html",null],
      finance : ["http://www.education.ne.gov/ss/Index.html",null]
    },
    
    nh : {
      economy : ["http://www.education.nh.gov/instruction/curriculum/social_studies/documents/frameworks.pdf",null],
      finance : ["http://www.education.nh.gov/instruction/curriculum/social_studies/documents/frameworks.pdf","http://www.education.nh.gov/standards/documents/advisory6.pdf"]
    },
    
    nj : {
      economy : ["http://www.state.nj.us/education/cccs/standards/6/6.pdf","http://www.state.nj.us/education/ser/grad/reqchart.htm"],
      finance : ["http://www.state.nj.us/education/cccs/standards/9/9-2.htm","http://www.state.nj.us/education/ser/grad/reqchart.htm"]
    },
    
    nm : {
      economy : ["http://www.ped.state.nm.us/standards/","http://www.ped.state.nm.us/GradReqs/Graduation%20and%20Course%20Offering%20Requirements.pdf"],
      finance : ["http://www.ped.state.nm.us/standards/","http://www.ped.state.nm.us/GradReqs/dl11/District_Requirements_for_HS_Course_Offerings_2011.pdf"]
    },
    
    nv : {
      economy : ["http://doe.nv.gov/Standards_SocialStudies.html",null],
      finance : ["http://www.leg.state.nv.us/NRS/NRS-389.html#NRS389Sec074", null]
    },
    
    ny : {
      economy : ["http://www.p12.nysed.gov/ciai/socst/documents/sslearn.pdf","http://www.p12.nysed.gov/part100/pages/1005.html#regentsdiploma"],
      finance : ["http://www.p12.nysed.gov/ciai/socst/documents/sslearn.pdf",null]
    },
    
    oh : {
      economy : ["http://education.ohio.gov/Topics/Academic-Content-Standards/Social-Studies",null],
      finance : ["http://education.ohio.gov/getattachment/Topics/Academic-Content-Standards/Financial-Literacy-and-Business/Financial-Literacy/Financial_Literacy_Academic_Content_Standards_1-1-3.pdf.aspx",null]
    },
    
    ok : {
      economy : ["http://ok.gov/sde/sites/ok.gov.sde/files/documents/files/Social_Studies_OK_Academic_Standards.pdf",null],
      finance : ["http://ok.gov/sde/sites/ok.gov.sde/files/documents/files/Social_Studies_OK_Academic_Standards.pdf","http://ok.gov/sde/sites/ok.gov.sde/files/PFLHB1476.pdf"]
    },
    
    or : {
      economy : ["http://www.ode.state.or.us/teachlearn/subjects/socialscience/standards/oregon-social-sciences-academic-content-standards.pdf",null],
      finance : ["http://www.ode.state.or.us/teachlearn/subjects/socialscience/standards/oregon-social-sciences-academic-content-standards.pdf",null]
    },
    
    pa : {
      economy : ["http://www.pdesas.org/Standard/StandardsDownloads",null],
      finance : ["http://www.pdesas.org/Standard/StandardsDownloads",null]
    },
    
    ri : {
      economy : ["http://www.ride.ri.gov/Portals/0/Uploads/Documents/Instruction-and-Assessment-World-Class-Standards/Social-Studies/RI-Economics-GSEs-K-12.pdf",null],
      finance : ["http://www.ride.ri.gov/Portals/0/Uploads/Documents/Instruction-and-Assessment-World-Class-Standards/Social-Studies/RI-Economics-GSEs-K-12.pdf",null]
    },
    
    sc : {
      economy : ["http://ed.sc.gov/agency/se/Instructional-Practices-and-Evaluations/documents/FINALAPPROVEDSSStandardsAugust182011.pdf","https://ed.sc.gov/agency/programs-services/124/documents/2013version43-234.pdf"],
      finance : ["http://ed.sc.gov/agency/se/Instructional-Practices-and-Evaluations/documents/FINALAPPROVEDSSStandardsAugust182011.pdf",null]
    },
    
    sd : {
      economy : ["http://doe.sd.gov/ContentStandards/documents/SocialStudies_9-12.pdf","http://legis.sd.gov/rules/DisplayRule.aspx?Rule=24:43:11:02"],
      finance : ["http://doe.sd.gov/ContentStandards/documents/PerFinanceSt.pdf","http://legis.sd.gov/rules/DisplayRule.aspx?Rule=24:43:11:02"]
    },
    
    tn : {
      economy : ["http://www.state.tn.us/education/ci/ss/doc/SS_3431.pdf","http://www.state.tn.us/sos/rules/0520/0520-01/0520-01-03.20131128.pdf"],
      finance : ["http://www.state.tn.us/education/ci/ss/doc/SS_3496.pdf","http://www.state.tn.us/sos/rules/0520/0520-01/0520-01-03.20131128.pdf"]
    },
    
    tx : {
      economy : ["http://ritter.tea.state.tx.us/rules/tac/chapter113","http://ritter.tea.state.tx.us/rules/tac/chapter118/ch118a.html"],
      finance : ["http://ritter.tea.state.tx.us/rules/tac/chapter113","http://ritter.tea.state.tx.us/rules/tac/chapter118/ch118a.html"]
    },
    
    ut : {
      economy : ["http://schools.utah.gov/arc/curr/CorePortfolio2013.pdf","http://le.utah.gov/~2003/bills/sbillint/sb0154.htm http://www.rules.utah.gov/publicat/code/r277/r277-700.htm#T6"],
      finance : ["http://schools.utah.gov/arc/curr/CorePortfolio2013.pdf","http://www.rules.utah.gov/publicat/code/r277/r277-700.htm#T6"]
    },
    
    va : {
      economy : ["http://www.doe.virginia.gov/testing/sol/standards_docs/economics_personal_finance/economics_personal_finance_sol.pdf","http://www.doe.virginia.gov/instruction/graduation/standard.shtml"],
      finance : ["http://www.doe.virginia.gov/testing/sol/standards_docs/economics_personal_finance/economics_personal_finance_sol.pdf","http://www.doe.virginia.gov/instruction/graduation/standard.shtml"]
    },
    
    vt : {
      economy : ["http://education.vermont.gov/documents/framework.pdf",null],
      finance : ["http://education.vermont.gov/documents/framework.pdf",null]
    },
    
    wa : {
      economy : ["http://standards.ospi.k12.wa.us/Default.aspx?subject=6",null],
      finance : ["http://standards.ospi.k12.wa.us/Default.aspx?subject=6",null]
    },
    
    wi : {
      economy : ['http://cal.dpi.wi.gov/cal_ss-standard',null],
      finance : ['http://standards.dpi.wi.gov/files/standards/pdf/pfl.pdf',null]
    },
    
    wv: {
      economy : ["http://apps.sos.wv.gov/adlaw/csr/readfile.aspx?DocId=23480&Format=PDF",null],
      finance : ["http://apps.sos.wv.gov/adlaw/csr/readfile.aspx?DocId=23480&Format=PDF","http://wvde.state.wv.us/counselors/students/documents/WVHSGraduationRequires2011-12andbeyond.pdf"]
    },
    
    wy : {
      economy : ['http://edu.wyoming.gov/sf-docs/publications/Standards_2008_Social_Studies_PDF',"http://edu.wyoming.gov/sf-docs/publications/State_Board_of_Education_Rules_and_Regulations_addressing_Body_of_Evidence-_Chapter_31"],
      finance : ['http://edu.wyoming.gov/sf-docs/publications/Standards_2008_Social_Studies_PDF',null]
    }
  }
}