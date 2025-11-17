"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp ,Heart, MapPin, ExternalLink } from "lucide-react";

const ngos = [
  {
    name: "CanSupport",
    area: "Palliative care support / End-of-life care",
    description: `Because every moment of life is precious
Sometimes during the journey of cancer, there may come a stage where no further treatment can potentially help. This may occur due to a gamut of reasons including late diagnosis, financial status, nature of the condition itself (highly aggressive condition), etc.

Palliative care helps terminally ill patients relieve their symptoms and improve their quality of life. To help with this, we're closely associated with CanSupport, a non-government, non-profit organization that provides FREE palliative care to cancer patients AT THEIR HOMES.`,
    link: "Avail Support Here",
    url:"https://cansupport.org/homecare/",
  },
  {
    name: "CAPED",
    area: "Cervical cancer-related initiatives",
    description: `Knowledge is the key to stay safe against cervical cancer
Caped or Cancer Awareness, Prevention and Early Detection Trust is a platform that spreads awareness about cervical cancer in the community through workshops and public engagement activities. It encourages women to take action regarding their own health. Cervical cancer occurs in the cells of the cervix, the lower part of the uterus that connects the uterus to the vagina. It usually grows slowly and there may be no symptoms at all in the early stages.

Tata 1mg is working closely with CAPED during different events with an aim to help spread awareness about cervical cancer, amplify cervical cancer testing, and take CAPED to people who need it.

Want to get more information to stay safe from cervical cancer?`,
    link: "Click Here",
    url: "https://www.capedindia.org/",
  },
  {
    name: "Indian Cancer Society",
    area: "Financial aid for underprivileged",
    description: `Let's rise against cancer together
ICS aims at raising awareness against cancer, helping with early screening, educating people about the disease, and helping people with cancer through various programs. It runs various campaigns to counsel cancer survivors with financial help, rehabilitation programs, and cancer research. The ICS-cancer cure fund project provides financial aid to all underprivileged cancer patients for the treatment.`,
    link: "Know More",
    url:"https://www.indiancancersociety.org/"
  },
  {
    name: "CanKids KidsCan",
    area: "Childhood cancer diagnosis & treatment",
    description: `Let our hopes & help shape their future
Childhood is all about creating happy memories for the rest of our lives. But what if the age at which we dream is faced with fighting cancer! Childhood cancers, unlike adult cancer, are not common. Moreover, there is not much awareness about it. "CanKids KidsCan" is an NGO that supports children with cancer diagnosis and treatment. It also provides support to the family by arranging stay when the kid is undergoing the treatment.

Want to get in touch with the organization?`,
    link: "Reach Out Here",
    url:"https://www.cankidsindia.org/"
  },
  {
    name: "Karunashraya",
    area: "Palliative care for advanced stage cancers",
    description: `Let's sail through this crisis tactfully & emphatically
Battling cancer is a grueling task as it not only breaks you down physically but also emotionally. Particularly, advanced stages of cancer pose endless day-to-day challenges that need great courage, strength, and an experts' support. Karunashraya is there for you to help with FREE palliative care during your advanced stages of cancer and aid in a peaceful and painless journey. They provide in-patient facilities as well as home-care services along with counseling and doctor consultations.`,
    link: "Seek Support Here",
    url:"https://karunashraya.org/"
  },
  {
    name: "Women's Cancer Initiative",
    area: "Breast and gynecological cancer care",
    description: `Breast cancer is the most common cancer amongst Indian women
It is a cancer care program by Tata Memorial Centre led by cancer specialists, cancer survivors, and volunteers for women diagnosed with breast and other gynecological cancers. It not only provides social and financial support for women with these cancers but also helps them to complete the course of their treatment whether it is chemotherapy, hormonal therapy, radiation therapy, surgery, or rehabilitation therapy.`,
    link: "Explore More",
    url: "https://www.wci.co.in/"
  },
  {
    name: "Cuddles Foundation",
    area: "Nutrition care for children with cancer",
    description: `Alone we are vulnerable, together we are strong
Cuddles foundation helps provide holistic nutrition for children suffering from cancer. The foundation has an expert panel of highly skilled nutritionists who share significant insights with their families and patients on food and supplements required for healthy living. They believe that an appropriate and efficient nutrition care plan especially for the kids with cancer can go a long way in fighting cancer and improving the quality of life.`,
    link: "Get Help Here",
    url: "https://www.cuddlesfoundation.org/"
  },
  {
    name: "The Cancer Charity",
    area: "Home based care for all types of cancer",
    description: `A helping hand is all you need to get through tough times
The cancer charity provides home-based food and medicines for people suffering from cancer. It is also known to give diagnostic support and care to cancer fighters. Taking care of the schooling needs of children, and delivering nursing services are also part of the program. They also counsel and create awareness about cancer along with encouraging studies & research in the field of cancer.`,
    link: "Reach out now",
    url: "https://www.thecancercharity.org/"
  },
  {
    name: "Maina Foundation",
    area: "Financial assistance for breast cancer",
    description: `Together, we can save many lives
Breast cancer is one of the most common cancers seen in women. However, due to a lack of proper awareness and financial aid to get screened, many cases of breast cancer are detected at a later stage. With an aim to reduce this gap and lower the burden of breast cancer in Indian women, Maina Foundation not only promotes early detection but also offers chemotherapy to women in need of financial assistance. They also empower women by spreading awareness about breast cancer through education and innovative medical care.`,
    link: "Get in touch here",
    url: "https://mainafoundation.org/"
  },
  {
    name: "Cope With Cancer.org",
    area: "Financial aid to economically challenged patients",
    description: `There is always a ray of light at the end of a tunnel
Once diagnosed with cancer, the patient needs a lot of emotional support as well as financial support to treat the condition. This might be quite overwhelming for people from a low economic background. For such economically challenged patients, Copewithcancer.org acts as a savior as it provides financial aid for cancer-related investigations and also offers discounts on cancer treatments such as chemotherapy, radiotherapy and surgeries. Moreover, it also encourages people to donate hair which is made into beautiful wigs for cancer fighters.`,
    link: "Know more here",
    url:"https://www.copewithcancer.org/"
  },
  {
    name: "YouWeCan (Yuvraj Singh Foundation)",
    area: "Awareness and support for cancer care",
    description: `Join hands to make a BIG difference in the fight against cancer
Established by Yuvraj Singh, Indian cricketer & cancer survivor, YouWeCan helps empower people with cancer to fight against cancer through spreading awareness about cancer and providing support in terms of diagnosis and treatment. They are actively empowering people with anti-tobacco workshops and awarding scholarships to cancer survivors. Through the YouWeCan cancer treatment fund for pediatric patients, they are providing treatment support for underprivileged kids with cancer.`,
    link: "Seek support here",
    url:"https://youwecan.org/"
  },
  {
    name: "India Prostate Cancer Foundation (IPCF)",
    area: "Awareness and support for prostate cancer",
    description: `You aren't alone in your fight against prostate cancer
Prostate cancer is relatively common in people above 65 years of age, although people in their 50s may also suffer from the condition. IPCF is committed to helping raise awareness about this condition and also supporting cancer patients with rehabilitation programs. The IPCF prostate cancer support group comprises survivors, caregivers and doctors who play a key role in the control and management of the condition through early diagnosis, treatment and recovery process.`,
    link: "Click to know more",
    url:"https://www.indianprostatecancerfoundation.com/index.html",
  },
  {
    name: "Butterfly Cancer Care Foundation",
    area: "Education, clinical, logistic and moral support",
    description: `Your positive attitude is the best weapon against fighting cancer
Children are like beautiful butterflies who fill our lives with happiness and joy. But when those little souls are stricken with cancer, getting the right aid and support becomes crucial. Butterfly Cancer Care Foundation is an organization that provides not just financial aid to the kids and their parents but also gives you education, clinical, logistic and moral support. They are committed to providing the best diagnostic services and treatment options for pediatric patients from economically backward classes.`,
    link: "Learn more here",
    url:"https://www.butterflycancercare.org/",
  },
  {
    name: "Breast Cancer Foundation (BCF) INDIA",
    area: "Awareness and management of breast cancer",
    description: `Cancer is just a part of your life, not your entire life
Cancer awareness is the key to early detection & better prognosis. And this is what Breast Cancer Foundation India truly believes in. The organization aims to promote health status and develop strategies to create awareness of breast cancer among every Indian woman. With oncologists being the pillar of service, BCF India provides support for early diagnosis and management of breast cancer. With seminars, conferences, & camps, they aim to raise awareness at national level and develop guidelines for cancer management.`,
    link: "Seek support now",
    url:"https://www.bcf-india.in/",
  },
  {
    name: "Samiksha Foundation",
    area: "Educational, spiritual and innovative support",
    description: `HOPE is not just a four letter word for a cancer patient
Samiksha foundation helps kids, their families and caregivers to learn more about their condition through their creative learning initiatives. The organization aims to provide educational, spiritual and innovative support and helping hand to children with cancer as they get treated for cancer and other life-threatening conditions. They provide non-medical assistance to children undergoing treatment in order to boost their mind, body and soul through various activities like yoga, meditation, art, music, craft, story-telling, etc.`,
    link: "Reach out here",
    url:"https://samikshafoundation.org/"
  },
];

export default function SeekNGOsSupport() {
  const [openItems, setOpenItems] = useState([])

  const toggleItem = (index) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#5271FF] rounded-full shadow-lg">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#5271FF] mb-6 leading-tight">
           NGOs in India
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg lg:text-xl text-[#243460] leading-relaxed px-4 sm:px-0">
              The journey through cancer treatment is the most exhaustive one. Right from finding the right oncologist,
              to getting the right treatment or palliative care, support is needed at all stages.
            </p>
          </div>
        </div>

        {/* NGOs Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 lg:gap-8">
            {ngos.map((ngo, index) => {
              const isOpen = openItems.includes(index)
              const [firstLine, ...rest] = ngo.description.split("\n")

              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 sm:p-8 text-left flex justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#243460] mb-3 group-hover:text-[#5271FF] transition-colors duration-200">
                        {ngo.name}
                      </h2>
                      <div className="flex items-start gap-2 text-sm sm:text-base text-[#243460]">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#5271FF] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold">Area of work:</span>{" "}
                          <span className="text-gray-700">{ngo.area}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 group-hover:bg-[#5271FF] group-hover:text-white transition-all duration-200">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" />
                      ) : (
                        <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Content */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="p-6 sm:p-8">
                        <div className="prose prose-lg max-w-none">
                          <p className="text-lg sm:text-xl font-semibold text-[#243460] mb-4 leading-relaxed">
                            {firstLine}
                          </p>
                          <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                            {rest.join("\n")}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pt-6 border-t border-gray-200">
                          <a
                            href={ngo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5271FF] hover:bg-[#3b5be0] text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {ngo.link}
                          </a>
                          <div className="text-sm text-gray-500">Click to visit their official website</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

