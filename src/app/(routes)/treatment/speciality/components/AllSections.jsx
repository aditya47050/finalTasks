"use client"

export default function AllSections({ slug }) {
  const contentData = {
  brain: {
  overview:
    "Brain-related medical conditions encompass a wide range of neurological disorders impacting cognition, motor function, and quality of life.",
  keyFacts:
    "The brain has around 86 billion neurons; disorders range from mild to severe, affecting millions worldwide.",
  causes:
    "Causes include genetics, trauma, infection, tumors, autoimmune issues, and degenerative diseases.",
  symptoms:
    "Symptoms range from headaches, seizures, memory loss, language difficulties, to motor impairments.",

  riskFactors:
    "Key risk factors include family history, aging, smoking, alcohol abuse, head injuries, high blood pressure, and infections.",

  diagnosis:
    "Diagnosis involves medical history, neurological exams, brain imaging (MRI, CT scans), EEG for seizure activity, and blood tests to rule out underlying causes.",

  prevention:
    "Prevention includes wearing helmets, managing blood pressure, avoiding smoking and excessive alcohol, staying mentally active, and maintaining a healthy lifestyle.",

  celebsAffected:
    "Many well-known figures have suffered from brain disorders, such as Stephen Hawking (ALS), Michael J. Fox (Parkinson’s disease), and Robin Williams (Lewy body dementia).",

  specialistToVisit:
    "Specialists include neurologists, neurosurgeons, psychiatrists, psychologists, and rehabilitation therapists depending on the condition.",

  treatment: [
    { title: "Medications", desc: "Antidepressants, anti-seizure drugs, pain relievers." },
    { title: "Surgical interventions", desc: "Tumor removal, deep brain stimulation." },
    { title: "Therapies", desc: "Physical therapy, speech therapy, lifestyle modifications." },
    { title: "Radiation therapy", desc: "Used for brain tumors or certain neurological conditions." },
  ],


  homeCare:
    "Home care includes maintaining a healthy diet, adequate sleep, stress management, regular exercise, brain exercises, and adhering strictly to prescribed medications.",

  complications:
    "Complications may include permanent disability, cognitive decline, loss of independence, seizures, chronic pain, and in severe cases, death.",

  alternativeTherapies:
    "Alternative therapies such as yoga, meditation, acupuncture, music therapy, and cognitive training can complement conventional treatments.",

  livingWith:
    "Living with a brain disorder requires support from family, caregivers, and healthcare professionals, along with lifestyle changes, counseling, and rehabilitation programs to improve quality of life.",

  faqs: [
    {
      question: "What is the most common brain disorder?",
      answer:
        "Stroke is one of the most common and serious brain-related conditions worldwide.",
    },
    {
      question: "Can brain disorders be cured?",
      answer:
        "Some brain disorders can be cured, while others are managed with long-term treatment and rehabilitation.",
    },
    {
      question: "What foods are good for brain health?",
      answer:
        "Foods rich in omega-3 fatty acids (like fish), nuts, berries, and leafy greens support brain function.",
    },
    {
      question: "When should I see a neurologist?",
      answer:
        "If you experience persistent headaches, seizures, sudden vision loss, memory problems, or unexplained weakness, consult a neurologist immediately.",
    },
  ],
},
  eyes: {
  overview:
    "Eye-related conditions include infections, refractive errors, cataracts, glaucoma, diabetic retinopathy, and macular degeneration. These can significantly impact vision and quality of life if left untreated.",
  keyFacts:
    "The human eye perceives around 10 million colors and is highly sensitive; eye disorders affect all age groups. Globally, over 2.2 billion people suffer from vision impairment or blindness.",
  causes:
    "Vision problems can arise from aging, genetics, prolonged screen exposure, eye injuries, infections, chronic illnesses like diabetes, smoking, and poor eye hygiene.",
  symptoms:
    "Common symptoms include blurred vision, double vision, eye pain, redness, dryness, floaters, light sensitivity, headaches, and gradual or sudden loss of vision.",

  riskFactors:
    "Risk factors include family history of eye disease, aging, diabetes, hypertension, smoking, UV light exposure, prolonged screen time, and lack of regular eye check-ups.",

  diagnosis:
    "Diagnosis typically involves eye exams, visual acuity tests, slit-lamp examination, intraocular pressure measurement, retinal imaging, and specialized tests like OCT (Optical Coherence Tomography).",

  prevention:
    "Prevention strategies include wearing sunglasses, limiting screen time, following the 20-20-20 rule (every 20 minutes, look at something 20 feet away for 20 seconds), maintaining good hygiene, and scheduling regular eye exams.",

  celebsAffected:
    "Several public figures have shared their struggles with eye disorders, such as Bono (glaucoma), Andrea Bocelli (blindness from congenital glaucoma), and Ray Charles (blindness due to glaucoma).",

  specialistToVisit:
    "Specialists include ophthalmologists (for medical and surgical eye care), optometrists (vision correction), and opticians (glasses/contact lenses). Retinal specialists and cornea specialists may also be required.",

  treatment: [
    { title: "Eyeglasses & Contact Lenses", desc: "Correct refractive errors and improve vision." },
    { title: "Medications", desc: "Prescription eye drops for glaucoma or infections." },
    { title: "Laser therapy", desc: "For conditions like glaucoma or vision correction (LASIK)." },
    { title: "Surgery", desc: "Cataract surgery, corneal transplants, retinal procedures." },
    { title: "Vision rehabilitation", desc: "Programs to improve functional vision and daily living." },
  ],

  homeCare:
    "Home care includes proper lighting while reading, reducing screen glare, maintaining hydration, using lubricating eye drops for dryness, eating an eye-healthy diet (rich in vitamin A, omega-3s), and practicing eye relaxation exercises.",

  complications:
    "Untreated eye conditions may lead to irreversible vision loss, blindness, chronic headaches, reduced independence, and increased risk of accidents or falls.",

  alternativeTherapies:
    "Alternative therapies such as ayurvedic eye drops, herbal remedies, acupuncture, and yoga eye exercises may provide relief, though they should complement—not replace—medical care.",

  livingWith:
    "Living with vision problems requires adaptive strategies such as using magnifiers, screen readers, mobility training, support from caregivers, and emotional counseling to cope with daily challenges.",

  faqs: [
    {
      question: "How often should I get my eyes checked?",
      answer:
        "Adults should get an eye exam every 1–2 years, while people with risk factors like diabetes may need more frequent check-ups.",
    },
    {
      question: "Can too much screen time damage eyesight?",
      answer:
        "Yes, excessive screen use can cause digital eye strain, dry eyes, and may worsen refractive errors over time.",
    },
    {
      question: "What foods are good for eye health?",
      answer:
        "Carrots, leafy greens, fish rich in omega-3s, eggs, nuts, and citrus fruits are excellent for eye health.",
    },
    {
      question: "Is laser eye surgery safe?",
      answer:
        "Laser procedures like LASIK are generally safe and effective, but not everyone is a candidate; a specialist evaluation is required.",
    },
  ],
},

  skin: {
  overview:
    "Skin conditions range from common issues like acne, eczema, and psoriasis to serious diseases such as skin cancers, vitiligo, and autoimmune-related dermatoses. Since the skin is the body’s largest organ, disorders can affect overall health, appearance, and quality of life.",
  keyFacts:
    "The skin is the body’s largest organ, making up about 16% of total body weight. It protects against infections, regulates body temperature, and allows the sensation of touch. Globally, around 1 in 3 people experience a skin disorder at any given time.",
  causes:
    "Causes of skin disorders include genetics, allergens, irritants, infections, hormonal imbalances, autoimmune reactions, poor hygiene, prolonged sun exposure, and environmental pollutants.",
  symptoms:
    "Symptoms vary by condition but may include redness, itching, dryness, rashes, scaling, blisters, acne lesions, pigmentation changes, and non-healing wounds.",

  riskFactors:
    "Risk factors include family history of skin disease, excessive sun exposure, fair skin, weak immune system, chronic illnesses like diabetes, poor skincare practices, and occupational chemical exposure.",

  diagnosis:
    "Diagnosis may involve physical examination, dermatoscopy, skin biopsy, patch testing for allergies, blood tests, and advanced imaging techniques for deeper skin and tissue evaluation.",

  prevention:
    "Prevention includes daily sun protection with sunscreen, maintaining hygiene, using non-irritating skincare products, staying hydrated, avoiding smoking, and having regular skin check-ups.",

  celebsAffected:
    "Celebrities like Kim Kardashian (psoriasis), Winnie Harlow (vitiligo), and Seal (discoid lupus) have openly discussed their skin conditions, helping raise awareness worldwide.",

  specialistToVisit:
    "Dermatologists are the primary specialists for diagnosing and treating skin conditions. In some cases, oncologists (for skin cancer) or allergists (for allergic skin issues) may also be consulted.",

  treatment: [
    { title: "Topical medications", desc: "Steroids, antifungals, antibiotics." },
    { title: "Oral medications", desc: "Antihistamines, immunosuppressants." },
    { title: "Phototherapy", desc: "UV light therapy for conditions like psoriasis." },
    { title: "Surgical interventions", desc: "Removal of growths, cryotherapy, advanced biologics for severe conditions." },
  ],

  homeCare:
    "Home care includes moisturizing regularly, avoiding harsh soaps, using cool compresses for itching, wearing breathable fabrics, managing stress, and eating a skin-friendly diet rich in vitamins A, C, and E.",

  complications:
    "If untreated, skin conditions may lead to scarring, pigmentation changes, chronic infections, social stigma, psychological distress, and in severe cases, progression to skin cancer.",

  alternativeTherapies:
    "Alternative options include ayurvedic herbal oils, aloe vera, turmeric, oatmeal baths, acupuncture, and mindfulness practices to reduce flare-ups triggered by stress.",

  livingWith:
    "Living with chronic skin conditions involves managing flare-ups, following a daily skincare routine, avoiding known triggers, seeking counseling if self-esteem is affected, and joining support groups for encouragement.",

  faqs: [
    {
      question: "Can stress make skin problems worse?",
      answer:
        "Yes, stress can trigger or worsen skin conditions like eczema, psoriasis, and acne due to hormonal and immune system changes.",
    },
    {
      question: "Is sunscreen necessary for all skin tones?",
      answer:
        "Yes, regardless of skin tone, sunscreen is essential to protect against harmful UV rays, premature aging, and skin cancer.",
    },
    {
      question: "Can diet affect skin health?",
      answer:
        "Yes, a diet high in processed foods and sugar may worsen acne and inflammation, while foods rich in antioxidants and omega-3s promote healthy skin.",
    },
    {
      question: "When should I see a dermatologist?",
      answer:
        "You should see a dermatologist if you have persistent rashes, non-healing wounds, sudden pigmentation changes, severe acne, or suspicious moles.",
    },
  ],
},

  ent: {
  overview:
    "ENT (Ear, Nose, and Throat) conditions affect essential functions such as hearing, breathing, balance, speech, and swallowing. Disorders can range from common infections to chronic diseases and cancers involving the head and neck region.",
  keyFacts:
    "ENT conditions are among the most common medical issues worldwide. Around 5% of the world’s population experiences disabling hearing loss, and sinusitis affects over 30 million people annually. ENT disorders can impact children, adults, and the elderly.",
  causes:
    "Causes include infections (viral, bacterial, fungal), allergies, congenital abnormalities, trauma, structural deformities like deviated septum, tumors, environmental factors like pollution or smoke, and age-related degeneration.",
  symptoms:
    "Symptoms include nasal congestion, ear pain, discharge, tinnitus (ringing in ears), hoarseness, sore throat, dizziness, difficulty swallowing, frequent infections, snoring, and hearing impairment.",

  riskFactors:
    "Risk factors include family history of ENT problems, frequent upper respiratory infections, exposure to loud noise, smoking, air pollution, seasonal allergies, weak immune system, and occupational hazards (dust, chemicals).",

  diagnosis:
    "Diagnosis may involve physical examination, endoscopy, hearing tests (audiometry), CT/MRI scans, allergy testing, throat swabs, and sleep studies for conditions like sleep apnea.",

  prevention:
    "Preventive steps include avoiding loud noises, quitting smoking, managing allergies, using protective masks in polluted environments, maintaining good oral and nasal hygiene, and getting vaccinated against infections.",

  celebsAffected:
    "Famous personalities such as Whoopi Goldberg (hearing loss), Ludwig van Beethoven (hearing impairment), and many singers/actors have struggled with ENT-related conditions, highlighting their impact on quality of life.",

  specialistToVisit:
    "Otolaryngologists (ENT specialists) are the primary doctors for diagnosing and treating ENT conditions. Audiologists may assist with hearing issues, while speech therapists help with voice and swallowing disorders.",

  treatment: [
    { title: "Medications", desc: "Antibiotics, antifungals, antihistamines, nasal sprays." },
    { title: "Hearing & speech aids", desc: "Hearing aids, cochlear implants, speech therapy." },
    { title: "Surgery", desc: "Tonsillectomy, septoplasty, advanced cancer surgeries." },
    { title: "Supportive care", desc: "Allergy management, hydration, steam inhalation, lifestyle modifications." },
  ],

  homeCare:
    "Home care includes steam inhalation for sinus congestion, saltwater gargles for sore throat, ear protection from loud noises, hydration, allergy management, and avoiding irritants such as smoke and strong perfumes.",

  complications:
    "If untreated, ENT conditions can lead to permanent hearing loss, chronic sinus infections, breathing problems, voice disorders, swallowing difficulties, and spread of infections to the brain or chest.",

  alternativeTherapies:
    "Alternative therapies include yoga and breathing exercises, saline nasal rinses, acupuncture for sinus pain and tinnitus, herbal remedies like ginger and turmeric, and essential oils (eucalyptus, peppermint) for congestion relief.",

  livingWith:
    "Living with chronic ENT conditions involves using hearing aids or cochlear implants if required, following regular ENT check-ups, managing allergies, protecting against noise, and practicing vocal hygiene for voice health.",

  faqs: [
    {
      question: "Can loud music damage hearing permanently?",
      answer:
        "Yes, prolonged exposure to loud sounds can cause irreversible hearing loss by damaging inner ear hair cells.",
    },
    {
      question: "Is snoring always related to ENT problems?",
      answer:
        "Snoring often arises from nasal obstruction, enlarged tonsils, or sleep apnea—many of which are ENT-related.",
    },
    {
      question: "Can allergies cause ENT problems?",
      answer:
        "Yes, allergies can lead to sinusitis, nasal congestion, sore throat, and ear infections if left untreated.",
    },
    {
      question: "When should I see an ENT doctor?",
      answer:
        "You should consult an ENT if you have persistent hoarseness, chronic sinus pain, hearing loss, frequent ear infections, or difficulty swallowing.",
    },
  ],
},

  dental: {
  overview:
    "Dental health covers conditions affecting teeth, gums, jaw, and oral cavity. Problems like cavities, gum disease, tooth decay, oral infections, and misalignments can impact overall health, nutrition, and confidence.",
  keyFacts:
    "Oral diseases affect nearly 3.5 billion people worldwide. Tooth decay is the most common chronic disease. Poor oral hygiene is linked to heart disease, diabetes, and respiratory illness. Regular dental visits reduce risk significantly.",
  causes:
    "Causes include poor oral hygiene, high-sugar diets, plaque buildup, bacterial infection, tobacco use, genetics, teeth grinding, trauma, and certain medications that reduce saliva flow.",
  symptoms:
    "Symptoms include toothache, bleeding or swollen gums, persistent bad breath, sensitivity to hot/cold foods, cavities, loose teeth, difficulty chewing, jaw pain, and mouth ulcers.",

  riskFactors:
    "Risk factors include poor brushing and flossing habits, frequent sugary snacks, smoking, alcohol use, vitamin deficiencies, dry mouth, aging, and family history of dental disease.",

  diagnosis:
    "Diagnosis is usually made via oral examination, dental X-rays, gum pocket measurement for periodontal disease, cavity detection, and oral cancer screening.",

  prevention:
    "Preventive steps include brushing twice daily with fluoride toothpaste, flossing daily, reducing sugar intake, regular dental checkups every 6 months, using mouthwash, and avoiding tobacco/alcohol.",

  celebsAffected:
    "Many celebrities have undergone dental treatments. For example, singer Celine Dion has spoken about TMJ jaw pain, while actor Tom Cruise underwent orthodontic correction. Dental health significantly affects smiles and confidence.",

  specialistToVisit:
    "Dentists handle most dental issues. Periodontists treat gum disease, orthodontists manage misalignment/braces, oral surgeons handle extractions and jaw surgery, and prosthodontists deal with dental implants and dentures.",

  treatment: [
    { title: "Dental procedures", desc: "Fillings, root canals, crowns, scaling & polishing, tooth extraction, gum grafting." },
    { title: "Orthodontics", desc: "Braces or aligners to correct misalignments." },
    { title: "Dental implants", desc: "Replacement of missing teeth with implants or dentures." },
    { title: "Medications", desc: "Antibiotics or analgesics for infections and pain relief." },
    { title: "Fluoride treatments", desc: "Strengthen teeth and prevent decay." },
  ],

  homeCare:
    "Home care includes regular brushing and flossing, limiting sugary food and drinks, using fluoride mouthwash, maintaining hydration, avoiding hard chewing, and using protective gear (mouthguards) during sports.",

  complications:
    "If untreated, dental conditions can lead to tooth loss, severe infections (abscesses), bone loss in jaws, difficulty eating, speech problems, systemic infections, and even increased risk of heart disease or diabetes.",

  alternativeTherapies:
    "Alternative therapies include oil pulling with coconut oil, clove oil for toothache relief, aloe vera gel for gum inflammation, green tea for oral bacteria control, and turmeric for anti-inflammatory benefits.",

  livingWith:
    "Living with dental problems requires proper oral hygiene, regular professional cleaning, avoiding smoking, maintaining a balanced diet, replacing missing teeth with dentures/implants, and following dentist’s guidance.",

  faqs: [
    {
      question: "How often should I visit the dentist?",
      answer:
        "It is recommended to visit a dentist every 6 months for a checkup and cleaning, or sooner if you have dental problems.",
    },
    {
      question: "Can poor dental health affect the heart?",
      answer:
        "Yes, gum disease and infections can increase the risk of cardiovascular problems due to inflammation and bacteria entering the bloodstream.",
    },
    {
      question: "Are electric toothbrushes better than manual ones?",
      answer:
        "Yes, electric toothbrushes are more effective in reducing plaque and preventing gum disease, but proper technique matters most.",
    },
    {
      question: "Is tooth sensitivity permanent?",
      answer:
        "Not always. Sensitivity can often be managed with desensitizing toothpaste, fluoride treatments, and avoiding acidic foods.",
    },
  ],
},

  thyroid: {
  overview:
    "Thyroid disorders affect the butterfly-shaped gland in the neck, which regulates hormones that control metabolism, growth, and energy. Conditions include hypothyroidism, hyperthyroidism, goiter, thyroid nodules, and thyroid cancer.",
  keyFacts:
    "Over 200 million people worldwide suffer from thyroid disorders. Women are 5–8 times more likely to develop thyroid disease than men. Iodine deficiency is the most common global cause of thyroid problems. Regular screening helps in early detection.",
  causes:
    "Causes include autoimmune disorders such as Hashimoto’s thyroiditis and Graves’ disease, iodine deficiency or excess, thyroid nodules, tumors, genetic predisposition, radiation exposure, and certain medications.",
  symptoms:
    "Common symptoms: weight gain or loss, fatigue, hair loss, mood swings, anxiety, depression, irregular heartbeat, swelling in the neck (goiter), dry skin, brittle nails, constipation, heat/cold intolerance, and menstrual irregularities.",

  riskFactors:
    "Risk factors include being female, family history of thyroid disease, pregnancy, menopause, iodine deficiency, autoimmune conditions, smoking, high stress levels, and radiation exposure to the neck.",
  
  diagnosis:
    "Diagnosis involves physical examination, blood tests (TSH, T3, T4, thyroid antibodies), thyroid ultrasound, fine-needle aspiration (for nodules), and thyroid scans using radioactive iodine uptake.",
  
  prevention:
    "While not all thyroid diseases can be prevented, maintaining balanced iodine intake, managing stress, avoiding radiation exposure, regular checkups (especially for women over 35), and treating autoimmune disorders early can help.",
  
  celebsAffected:
    "Celebrities like Gigi Hadid (Hashimoto’s disease), Oprah Winfrey (thyroid imbalance), and Sofia Vergara (thyroid cancer survivor) have openly discussed their thyroid struggles, raising awareness worldwide.",
  
  specialistToVisit:
    "Endocrinologists specialize in thyroid disorders. Surgeons may be involved in cases of thyroid nodules or cancer. Dietitians help with lifestyle management, while general physicians often detect symptoms first.",
  
  treatment: [
    { title: "Hypothyroidism", desc: "Synthetic thyroid hormone (levothyroxine) replacement therapy." },
    { title: "Hyperthyroidism", desc: "Anti-thyroid drugs, radioactive iodine therapy, or surgery." },
    { title: "Thyroid nodules", desc: "Monitoring or surgical removal if needed." },
    { title: "Thyroid cancer", desc: "Surgery followed by radioactive iodine and hormone therapy." },
  ],
  
  homeCare:
    "Home care includes maintaining a balanced diet rich in iodine, selenium, and zinc, regular exercise, stress reduction practices (yoga, meditation), proper sleep, avoiding smoking, and regular follow-ups with doctors.",
  
  complications:
    "If untreated, thyroid disorders can lead to infertility, goiter, osteoporosis, heart problems (arrhythmia), nerve damage, pregnancy complications, and in severe cases, myxedema (life-threatening hypothyroidism).",
  
  alternativeTherapies:
    "Alternative therapies include yoga and pranayama for stress relief, ashwagandha for hormone balance, acupuncture for symptom relief, and dietary adjustments like reducing gluten (for autoimmune thyroid issues). However, these should complement medical treatment.",
  
  livingWith:
    "Living with thyroid disorders requires lifelong monitoring, consistent medication (if prescribed), regular blood tests, a balanced diet, stress management, and awareness of early warning signs of hormone imbalance.",
  
  faqs: [
    {
      question: "Can thyroid disorders be cured permanently?",
      answer:
        "Hypothyroidism usually requires lifelong medication, while hyperthyroidism may be cured with surgery or radioactive iodine. Some conditions like nodules need only monitoring.",
    },
    {
      question: "Does diet affect thyroid health?",
      answer:
        "Yes, iodine, selenium, and zinc are important for thyroid function. Too much or too little iodine can cause thyroid problems.",
    },
    {
      question: "Can thyroid disease cause weight gain or loss?",
      answer:
        "Yes, hypothyroidism often leads to weight gain, while hyperthyroidism may cause weight loss despite normal or increased appetite.",
    },
    {
      question: "Is thyroid disease hereditary?",
      answer:
        "Yes, family history increases the risk, especially for autoimmune thyroid conditions like Hashimoto’s and Graves’ disease.",
    },
  ],
},

  breast: {
  overview:
    "Breast conditions range from benign issues like fibrocystic breast changes and infections to serious conditions like breast cancer. Regular self-examinations and screenings play a critical role in early detection and treatment.",
  
  keyFacts:
    "Breast cancer is the most common cancer in women worldwide, accounting for about 25% of all female cancers. Men can also develop breast conditions, though far less commonly. Early detection through mammography significantly improves survival rates.",
  
  causes:
    "Causes of breast conditions include hormonal fluctuations, genetics (BRCA1 and BRCA2 mutations), obesity, alcohol consumption, lack of exercise, radiation exposure, early menstruation or late menopause, and family history of breast disease.",
  
  symptoms:
    "Common symptoms include breast lumps or thickening, nipple discharge (sometimes bloody), persistent breast pain, swelling, changes in breast shape or size, dimpling of skin, inverted nipples, or redness and scaling of breast skin.",
  
  riskFactors:
    "Risk factors include being female, aging, family history of breast cancer, genetic mutations, dense breast tissue, high-fat diet, obesity, sedentary lifestyle, alcohol use, hormone replacement therapy, and radiation exposure.",
  
  diagnosis:
    "Diagnosis methods include clinical breast exam, mammogram, breast ultrasound, MRI, and biopsy for confirmation. Genetic testing may be recommended for individuals with a family history of breast or ovarian cancer.",
  
  prevention:
    "Prevention strategies include regular screenings (mammograms), maintaining a healthy weight, exercising, limiting alcohol, breastfeeding (protective effect), avoiding smoking, and reducing exposure to unnecessary hormones.",
  
  celebsAffected:
    "Angelina Jolie underwent preventive double mastectomy after discovering BRCA1 mutation. Sheryl Crow and Christina Applegate are breast cancer survivors. Their openness has raised awareness about genetic testing and early detection.",
  
  specialistToVisit:
    "Breast surgeons, oncologists, radiologists, gynecologists, and genetic counselors are commonly involved in diagnosis and treatment of breast conditions.",
  
  treatment: [
    { title: "Infections", desc: "Antibiotics for bacterial infections." },
    { title: "Fibrocystic changes", desc: "Pain management; may not require medical treatment." },
    { title: "Cancer treatments", desc: "Surgery (lumpectomy or mastectomy), radiation, chemotherapy, hormone therapy, targeted therapy, immunotherapy." },
  ],
  
  homeCare:
    "Home care includes wearing supportive bras, applying warm or cold compresses for pain, maintaining a balanced diet, reducing caffeine, managing stress, and practicing regular self-breast exams.",
  
  complications:
    "Complications include spread of cancer to other organs, lymphedema (swelling in arms post-surgery), infections after procedures, and emotional distress. Delayed diagnosis can worsen outcomes significantly.",
  
  alternativeTherapies:
    "Complementary approaches such as yoga, meditation, acupuncture, and dietary supplements (like flaxseed and vitamin D) may help with symptom management but should not replace medical treatment.",
  
  livingWith:
    "Living with breast conditions, especially cancer, requires ongoing monitoring, emotional support, lifestyle adjustments, and sometimes long-term medications like hormone blockers. Support groups and counseling can be vital.",
  
  faqs: [
    {
      question: "Can men get breast cancer?",
      answer: "Yes, although rare, men can develop breast cancer and should be aware of symptoms like lumps or nipple discharge.",
    },
    {
      question: "At what age should women start mammograms?",
      answer: "Most guidelines recommend starting at age 40, but earlier if there is a strong family history or genetic risk.",
    },
    {
      question: "Is every breast lump cancerous?",
      answer: "No, most breast lumps are benign, but any lump should be evaluated by a doctor.",
    },
    {
      question: "Does breastfeeding reduce breast cancer risk?",
      answer: "Yes, breastfeeding for a year or longer is associated with a reduced risk of breast cancer.",
    },
  ],
},

  heart: {
  overview:
    "Heart conditions include a wide range of disorders such as coronary artery disease, heart failure, arrhythmias, and valve abnormalities. The heart is central to circulation, supplying oxygen and nutrients throughout the body. Any impairment in cardiac function can significantly affect health and quality of life.",
  
  keyFacts:
    "Cardiovascular disease is the leading cause of death globally, responsible for over 17 million deaths annually. Early lifestyle changes can reduce risk by more than 80%. The human heart beats about 100,000 times a day, pumping nearly 2,000 gallons of blood.",
  
  causes:
    "Causes include genetics, hypertension, diabetes, high cholesterol, smoking, poor diet, obesity, physical inactivity, chronic stress, excessive alcohol use, infections (such as myocarditis), and age-related changes.",
  
  symptoms:
    "Common symptoms include chest pain (angina), shortness of breath, palpitations, irregular heartbeat, dizziness, fainting, fatigue, swelling in legs or abdomen, and sudden weight gain due to fluid retention.",
  
  riskFactors:
    "Major risk factors include family history of heart disease, smoking, high blood pressure, high cholesterol, obesity, diabetes, sedentary lifestyle, excessive alcohol intake, chronic stress, and aging. Men generally face higher risks earlier, but women’s risk increases post-menopause.",
  
  diagnosis:
    "Diagnostic methods include electrocardiogram (ECG), echocardiogram, stress tests, coronary angiography, CT scans, MRI, chest X-rays, and blood tests for cholesterol, triglycerides, and cardiac enzymes (like troponin).",
  
  prevention:
    "Preventive measures include a heart-healthy diet (low in saturated fats and sodium), regular exercise, maintaining a healthy weight, controlling blood pressure and cholesterol, avoiding smoking, limiting alcohol, and managing stress. Regular check-ups and screenings are essential.",
  
  celebsAffected:
    "Celebrities like Arnold Schwarzenegger (heart valve replacement), Larry King (heart bypass surgery), and Serena Williams (history of pulmonary embolism, affecting cardiovascular health) have raised awareness about cardiac conditions.",
  
  specialistToVisit:
    "Cardiologists, interventional cardiologists, cardiac surgeons, electrophysiologists (for rhythm disorders), and primary care physicians are the key specialists involved in diagnosing and treating heart conditions.",
  
  treatment: [
    { title: "Lifestyle modifications", desc: "Heart-healthy diet, exercise, stress management, smoking cessation." },
    { title: "Medications", desc: "Statins, beta-blockers, ACE inhibitors, anticoagulants, and other cardiac drugs." },
    { title: "Interventional procedures", desc: "Angioplasty, stent placement." },
    { title: "Surgery", desc: "Bypass surgery, valve replacement, pacemaker or defibrillator implantation." },
    { title: "Emergency care", desc: "Critical treatment for heart attacks or arrhythmias." },
  ],
  
  homeCare:
    "Home care involves monitoring blood pressure and weight daily, following a low-salt and heart-healthy diet, engaging in safe physical activity, managing stress, quitting smoking, adhering to prescribed medications, and attending regular follow-ups with healthcare providers.",
  
  complications:
    "Complications include heart attack, stroke, heart failure, arrhythmias, sudden cardiac arrest, organ damage due to poor circulation, and reduced quality of life. Delayed or poor management can lead to life-threatening consequences.",
  
  alternativeTherapies:
    "Complementary therapies include yoga, meditation, deep breathing, acupuncture, omega-3 fatty acid supplementation, CoQ10, and stress management techniques. These should be used alongside—not as a substitute for—medical care.",
  
  livingWith:
    "Living with heart disease requires long-term lifestyle adjustments, adherence to medications, regular check-ups, and emotional support. Cardiac rehabilitation programs help patients recover and adopt healthier habits. Support groups can aid in coping with stress and anxiety.",
  
  faqs: [
    {
      question: "What are the early warning signs of a heart attack?",
      answer: "Common early signs include chest discomfort, shortness of breath, nausea, dizziness, and pain radiating to the arm, jaw, or back.",
    },
    {
      question: "Can heart disease be reversed?",
      answer: "While damage cannot always be reversed, adopting a healthy lifestyle and proper treatment can significantly improve heart function and reduce risk of complications.",
    },
    {
      question: "How much exercise is recommended for heart health?",
      answer: "At least 150 minutes of moderate aerobic exercise per week, combined with muscle-strengthening activities twice weekly, is recommended.",
    },
    {
      question: "Is stress really harmful to the heart?",
      answer: "Yes, chronic stress increases blood pressure, contributes to unhealthy behaviors, and raises the risk of heart disease.",
    },
  ],
},

  liver: {
  overview:
    "Liver conditions include a wide range of disorders such as hepatitis, fatty liver disease, cirrhosis, and liver cancer. The liver is a vital organ responsible for detoxification, metabolism, bile production, and regulation of many critical processes. Damage to the liver can impair multiple systems in the body.",
  
  keyFacts:
    "The liver is the largest internal organ, weighing around 1.5 kg in adults. It has a remarkable ability to regenerate if damaged. Globally, liver diseases account for millions of deaths annually, often linked to alcohol abuse, viral infections, and lifestyle-related factors like obesity.",
  
  causes:
    "Liver disease may be caused by viral infections (Hepatitis A, B, C, D, E), alcohol abuse, non-alcoholic fatty liver disease (NAFLD), obesity, metabolic disorders, autoimmune conditions, drug or toxin exposure, genetic disorders like Wilson’s disease, and liver tumors or cancers.",
  
  symptoms:
    "Symptoms include yellowing of skin and eyes (jaundice), abdominal swelling, pain in the upper right abdomen, fatigue, nausea, loss of appetite, unexplained weight loss, itchy skin, easy bruising, confusion, and dark-colored urine.",
  
  riskFactors:
    "Risk factors include excessive alcohol consumption, chronic viral hepatitis infection, obesity, diabetes, high cholesterol, family history of liver disease, unsafe blood transfusions, unprotected sex, intravenous drug use, and prolonged exposure to toxins or certain medications.",
  
  diagnosis:
    "Diagnosis involves blood tests (liver function tests, viral markers), imaging (ultrasound, CT scan, MRI), liver biopsy, FibroScan to measure liver stiffness, and screening for tumor markers like alpha-fetoprotein (AFP).",
  
  prevention:
    "Prevention includes avoiding alcohol misuse, vaccination against Hepatitis A and B, practicing safe sex, avoiding contaminated food and water, managing obesity and diabetes, avoiding unnecessary medications, and regular health check-ups.",
  
  celebsAffected:
    "Celebrities like Pamela Anderson (Hepatitis C), George Best (alcohol-related liver disease), and Mickey Mantle (cirrhosis and cancer) brought global attention to liver health awareness.",
  
  specialistToVisit:
    "Gastroenterologists and hepatologists are the primary specialists. For liver cancer or transplantation, oncologists and transplant surgeons are also involved.",
  
  treatment: [
    { title: "Viral hepatitis", desc: "Antiviral therapy to eliminate infection." },
    { title: "Fatty liver", desc: "Lifestyle changes including diet, exercise, and alcohol cessation." },
    { title: "Autoimmune liver disease", desc: "Medications to suppress immune activity." },
    { title: "Liver cancer", desc: "Chemotherapy, surgery, or other oncological interventions." },
    { title: "Severe liver disease", desc: "Liver transplantation when necessary." },
  ],
  
  homeCare:
    "Home care includes following a liver-friendly diet (low fat, balanced protein, rich in fruits and vegetables), avoiding alcohol, drinking plenty of water, exercising moderately, avoiding unnecessary medicines or supplements, and regular monitoring of liver health with a doctor.",
  
  complications:
    "Untreated liver conditions can lead to cirrhosis, portal hypertension, ascites, liver failure, hepatic encephalopathy (confusion and memory problems), liver cancer, and ultimately death.",
  
  alternativeTherapies:
    "Some supportive therapies include milk thistle, turmeric, yoga, meditation, and dietary modifications. However, these should not replace standard medical treatments and must be taken under medical supervision.",
  
  livingWith:
    "Living with chronic liver disease requires lifestyle adjustments, strict adherence to medical advice, limiting salt intake to prevent swelling, quitting alcohol, regular monitoring of blood tests, emotional support, and sometimes long-term transplant evaluation.",
  
  faqs: [
    {
      question: "Can the liver regenerate if damaged?",
      answer: "Yes, the liver has a unique ability to regenerate, but repeated or severe damage from alcohol, hepatitis, or cirrhosis limits this capacity.",
    },
    {
      question: "Is fatty liver reversible?",
      answer: "Yes, in early stages, fatty liver can often be reversed with weight loss, healthy diet, exercise, and avoiding alcohol.",
    },
    {
      question: "How can I keep my liver healthy?",
      answer: "Maintain a balanced diet, avoid excessive alcohol, get vaccinated for hepatitis, exercise regularly, and avoid unnecessary medications or toxins.",
    },
    {
      question: "When should I see a doctor for liver problems?",
      answer: "Seek medical care if you notice jaundice, persistent fatigue, unexplained weight loss, abdominal swelling, or dark urine.",
    },
  ],
},

  pancreas: {
  overview:
    "Pancreatic conditions include acute and chronic pancreatitis, pancreatic cysts, diabetes, and pancreatic cancer. The pancreas plays a vital role in both digestion and blood sugar regulation. Any dysfunction can significantly impact overall health.",
  
  keyFacts:
    "The pancreas is about 6 inches long and lies behind the stomach. It produces insulin and glucagon to regulate blood sugar, as well as digestive enzymes that help break down fats, proteins, and carbohydrates. Pancreatic cancer is one of the most lethal cancers due to late detection.",
  
  causes:
    "Causes of pancreatic conditions include gallstones, excessive alcohol use, smoking, genetic mutations, chronic pancreatitis, obesity, diabetes, autoimmune conditions, family history of pancreatic disorders, and pancreatic tumors.",
  
  symptoms:
    "Common symptoms include severe abdominal pain radiating to the back, unexplained weight loss, persistent nausea and vomiting, bloating, oily or greasy stools (steatorrhea), jaundice (yellowing of eyes/skin), loss of appetite, and new-onset diabetes in older adults.",
  
  riskFactors:
    "Risk factors include chronic alcohol consumption, smoking, obesity, family history of pancreatic cancer, chronic pancreatitis, diabetes, diets high in processed meats and fats, and exposure to certain workplace chemicals.",
  
  diagnosis:
    "Diagnosis involves blood tests (amylase, lipase, blood sugar), imaging scans (ultrasound, CT scan, MRI, endoscopic ultrasound), ERCP (endoscopic retrograde cholangiopancreatography), biopsy for cancer detection, and genetic testing in high-risk cases.",
  
  prevention:
    "Prevention includes avoiding excessive alcohol and smoking, maintaining a healthy diet, managing diabetes and cholesterol, exercising regularly, avoiding obesity, and regular monitoring if you have a family history of pancreatic disease.",
  
  celebsAffected:
    "Apple co-founder Steve Jobs (pancreatic neuroendocrine tumor) and actor Patrick Swayze (pancreatic cancer) are among well-known figures who battled pancreatic conditions.",
  
  specialistToVisit:
    "Gastroenterologists and endocrinologists manage most pancreatic disorders. Oncologists treat pancreatic cancer, while surgeons handle complex cases requiring removal of pancreatic tissue or cysts.",
  
  treatment: [
    { title: "Acute pancreatitis", desc: "Hospitalization, IV fluids, pain management, and treating the underlying cause (like gallstones)." },
    { title: "Chronic pancreatitis", desc: "Enzyme supplements, pain control, and lifestyle changes." },
    { title: "Diabetes (pancreatic origin)", desc: "Insulin therapy, oral medications, and diet control." },
    { title: "Pancreatic cancer", desc: "Surgery (Whipple procedure), chemotherapy, radiation therapy, targeted drugs, or palliative care." },
  ],
  
  homeCare:
    "Patients should avoid alcohol, quit smoking, eat small and low-fat meals, take prescribed enzyme supplements if needed, maintain good hydration, monitor blood sugar, and follow regular check-ups with their doctor.",
  
  complications:
    "Complications may include diabetes, malnutrition due to poor absorption of nutrients, chronic pain, pseudocysts, infection, pancreatic insufficiency, liver damage, or spread of cancer to other organs.",
  
  alternativeTherapies:
    "Supportive therapies include yoga, acupuncture, stress reduction techniques, turmeric for inflammation, and antioxidant-rich diets. However, these should complement—not replace—standard medical treatments.",
  
  livingWith:
    "Living with pancreatic disease requires a healthy lifestyle, pain management, enzyme supplements, regular medical follow-ups, emotional support, and sometimes lifelong diabetes care. Support groups can also help in managing the psychological impact.",
  
  faqs: [
    {
      question: "Can pancreatitis be cured?",
      answer: "Acute pancreatitis often resolves with treatment, but chronic pancreatitis is a long-term condition that requires lifestyle changes and ongoing management.",
    },
    {
      question: "Is pancreatic cancer hereditary?",
      answer: "Yes, around 10% of pancreatic cancers have a hereditary link. People with a family history should consider genetic counseling and regular screening.",
    },
    {
      question: "How does the pancreas affect blood sugar?",
      answer: "The pancreas produces insulin and glucagon, which regulate blood sugar. Damage to the pancreas can lead to diabetes.",
    },
    {
      question: "What foods are good for pancreas health?",
      answer: "Fruits, vegetables, whole grains, lean proteins, and low-fat meals are beneficial. Avoid alcohol, fried foods, and processed meats.",
    },
  ],
},

  stomach: {
  overview:
    "Stomach conditions range from mild indigestion to serious diseases like gastritis, peptic ulcers, gastroesophageal reflux disease (GERD), and stomach cancer. The stomach plays a central role in digestion, producing acid and enzymes to break down food.",

  keyFacts:
    "The stomach produces hydrochloric acid and enzymes such as pepsin to digest proteins. H. pylori infection is the most common cause of gastritis and ulcers. Stomach cancer ranks among the top five most common cancers globally.",

  causes:
    "Common causes include Helicobacter pylori infection, long-term NSAID use, excessive alcohol, smoking, poor diet (spicy/processed foods), stress, family history, autoimmune gastritis, and exposure to carcinogens like smoked foods and nitrates.",

  symptoms:
    "Typical symptoms include stomach pain, burning sensation (especially between meals), bloating, nausea, vomiting, heartburn, indigestion, unexplained weight loss, black or bloody stools, loss of appetite, and fatigue.",

  riskFactors:
    "Risk factors include H. pylori infection, smoking, excessive alcohol, long-term NSAID use, obesity, low-fiber/high-salt diet, age over 50, family history of ulcers or stomach cancer, and previous stomach surgery.",

  diagnosis:
    "Diagnosis may involve endoscopy with biopsy, blood tests for H. pylori, urea breath test, stool antigen test, upper GI series (X-ray with contrast), and imaging scans (CT/MRI) in suspected cancer cases.",

  prevention:
    "Prevention includes limiting NSAID and alcohol use, quitting smoking, treating H. pylori promptly, eating a high-fiber diet rich in fruits and vegetables, avoiding very salty and smoked foods, managing stress, and maintaining healthy weight.",

  celebsAffected:
    "Actor Robert De Niro and singer George Harrison both battled stomach-related conditions, with Harrison ultimately succumbing to stomach cancer.",

  specialistToVisit:
    "Gastroenterologists handle most stomach disorders. Oncologists treat stomach cancers, while dietitians help in managing nutritional needs for chronic stomach conditions.",

  treatment: [
    { title: "Gastritis/ulcers", desc: "Antibiotics for H. pylori, proton pump inhibitors (PPIs), antacids, and avoiding triggers." },
    { title: "GERD", desc: "Lifestyle modifications, PPIs, H2 blockers, sometimes surgery." },
    { title: "Stomach cancer", desc: "Surgery (gastrectomy), chemotherapy, targeted therapy, immunotherapy, or palliative care." },
  ],

  homeCare:
    "Patients should avoid alcohol, caffeine, and spicy foods, eat smaller frequent meals, maintain hydration, sleep with head elevated (for reflux), reduce stress, and follow a high-fiber, antioxidant-rich diet.",

  complications:
    "Untreated stomach issues can cause internal bleeding, perforation, anemia, severe dehydration, strictures, or stomach cancer. Chronic reflux may also lead to Barrett’s esophagus and increase risk of esophageal cancer.",

  alternativeTherapies:
    "Supportive approaches include probiotics (yogurt, kefir), ginger, chamomile tea, licorice root (DGL), stress management (yoga, meditation), and acupuncture for pain relief. Always use alongside medical care.",

  livingWith:
    "Living with chronic stomach conditions requires careful diet planning, stress reduction, regular check-ups, compliance with medications, and lifestyle changes. Support groups can help in coping with long-term conditions.",

  faqs: [
    {
      question: "Can stomach ulcers heal on their own?",
      answer: "Some minor ulcers may improve with lifestyle changes, but most require medication, especially if caused by H. pylori or NSAIDs.",
    },
    {
      question: "Is gastritis the same as acid reflux?",
      answer: "No. Gastritis is inflammation of the stomach lining, while acid reflux is the backflow of stomach acid into the esophagus. However, symptoms may overlap.",
    },
    {
      question: "How can I prevent stomach cancer?",
      answer: "Prevention includes treating H. pylori, avoiding smoking/alcohol, limiting processed and smoked foods, eating more fruits/vegetables, and regular screening if high risk.",
    },
    {
      question: "What foods soothe stomach inflammation?",
      answer: "Bananas, oatmeal, yogurt, ginger, chamomile tea, and non-citrus fruits are gentle on the stomach and may ease symptoms.",
    },
  ],
},

  gallbladder: {
  overview:
    "Gallbladder conditions include gallstones (cholelithiasis), inflammation (cholecystitis), gallbladder polyps, and bile duct obstruction. The gallbladder plays a role in digestion by storing and releasing bile to help break down fats.",

  keyFacts:
    "The gallbladder can hold about 30–50 ml of bile. Gallstones affect millions worldwide, with women more commonly affected than men. Removal of the gallbladder (cholecystectomy) is one of the most common surgical procedures globally.",

  causes:
    "Causes include cholesterol or bilirubin imbalance leading to gallstone formation, obesity, rapid weight loss, high-fat diets, pregnancy, genetics, diabetes, liver disease, and certain medications (e.g., estrogen therapy).",

  symptoms:
    "Symptoms include right upper abdominal pain (especially after fatty meals), pain radiating to the back or shoulder, nausea, vomiting, bloating, indigestion, fever (with infection), and jaundice (if bile duct is blocked).",

  riskFactors:
    "Risk factors include being female, age over 40, obesity, rapid weight loss, pregnancy, high-fat diet, diabetes, family history, Native American or Hispanic ethnicity, and use of birth control pills or hormone therapy.",

  diagnosis:
    "Diagnosis typically involves abdominal ultrasound (gold standard for gallstones), CT scan, MRI/MRCP, HIDA scan (to assess gallbladder function), and blood tests to check liver enzymes and bilirubin levels.",

  prevention:
    "Prevention strategies include maintaining a healthy weight, avoiding rapid weight loss, eating a high-fiber diet with less saturated fat, staying physically active, and managing diabetes or cholesterol levels effectively.",

  celebsAffected:
    "Former U.S. President Bill Clinton underwent gallbladder surgery for gallstones, bringing attention to this common health condition.",

  specialistToVisit:
    "General surgeons typically treat gallbladder conditions requiring surgery. Gastroenterologists manage gallbladder and bile duct diseases, while dietitians may help with dietary adjustments.",

  treatment: [
    { title: "Asymptomatic gallstones", desc: "Often monitored without intervention." },
    { title: "Symptomatic gallstones/cholecystitis", desc: "Laparoscopic cholecystectomy (removal of gallbladder)." },
    { title: "Non-surgical patients", desc: "Medications (ursodeoxycholic acid) to dissolve stones and dietary changes." },
    { title: "Bile duct obstruction", desc: "ERCP (endoscopic removal of stones)." },
  ],

  homeCare:
    "Patients can follow a low-fat diet, eat smaller meals, stay hydrated, avoid rapid weight loss, exercise regularly, and manage blood sugar. Warm compresses may ease mild abdominal discomfort.",

  complications:
    "Complications include gallbladder infection, bile duct infection (cholangitis), gallbladder rupture, pancreatitis, liver damage, sepsis, and increased risk of gallbladder cancer in chronic cases.",

  alternativeTherapies:
    "Some use natural remedies like apple cider vinegar, lemon juice, turmeric, or milk thistle to support liver and gallbladder health. Yoga and stress reduction may help manage symptoms, but these should complement—not replace—medical care.",

  livingWith:
    "Living without a gallbladder is generally safe; bile flows directly from the liver to the small intestine. Patients may need to adopt a low-fat diet, eat smaller meals, and adjust gradually to digestive changes after surgery.",

  faqs: [
    {
      question: "Can you live without a gallbladder?",
      answer: "Yes. After gallbladder removal, bile flows directly from the liver into the intestine. Most people live normal, healthy lives post-surgery with minor dietary adjustments.",
    },
    {
      question: "Do gallstones always require surgery?",
      answer: "No. Asymptomatic gallstones often don’t require treatment, but recurrent pain, infection, or complications usually necessitate surgery.",
    },
    {
      question: "Can gallstones be dissolved naturally?",
      answer: "Some medications (like ursodeoxycholic acid) may dissolve certain stones, but natural remedies have limited proven effectiveness. Surgery remains the most reliable treatment.",
    },
    {
      question: "What foods should be avoided with gallbladder issues?",
      answer: "High-fat, fried, and processed foods should be minimized. A diet rich in fiber, lean proteins, fruits, and vegetables is recommended.",
    },
  ],
},

  kidney: {
  overview:
    "Kidney conditions include urinary tract infections (UTIs), kidney stones, chronic kidney disease (CKD), polycystic kidney disease, nephrotic syndrome, glomerulonephritis, and kidney cancer. Kidneys are vital for filtering blood, balancing fluids, electrolytes, and producing hormones that regulate blood pressure and red blood cell production.",

  keyFacts:
    "Each kidney contains about 1 million nephrons (the filtering units). Around 10% of the world’s population suffers from chronic kidney disease. Kidney disease is often called a 'silent disease' because symptoms may not appear until significant damage has occurred.",

  causes:
    "Major causes include diabetes, hypertension, genetic conditions (like polycystic kidney disease), recurrent urinary infections, autoimmune disorders, long-term use of certain medications (like NSAIDs), kidney stones, dehydration, and exposure to toxins.",

  symptoms:
    "Symptoms include flank or lower back pain, blood in urine (hematuria), frequent urination, painful urination, swelling in legs/ankles, fatigue, high blood pressure, nausea, and foamy urine (protein leakage).",

  riskFactors:
    "Risk factors include diabetes, high blood pressure, obesity, smoking, family history of kidney disease, cardiovascular disease, older age, frequent dehydration, and long-term medication use (like painkillers).",

  diagnosis:
    "Diagnosis includes urinalysis (to check protein or blood), blood tests (creatinine, eGFR, BUN), ultrasound or CT scan (to detect stones or structural issues), kidney biopsy (for suspected inflammation/cancer), and MRI if needed.",

  prevention:
    "Prevention involves staying hydrated, controlling blood sugar and blood pressure, eating a low-salt balanced diet, avoiding excessive painkiller use, quitting smoking, limiting alcohol, and undergoing regular health checkups if at risk.",

  celebsAffected:
    "Celebrities like Selena Gomez (lupus-related kidney disease, received a kidney transplant) and George Lopez (received a kidney transplant) have openly shared their kidney health struggles.",

  specialistToVisit:
    "Nephrologists specialize in kidney disease. Urologists handle surgical and structural problems like stones. Transplant surgeons perform kidney transplants. Dietitians help with kidney-friendly diets.",

  treatment: [
    { title: "Infections (UTIs/pyelonephritis)", desc: "Antibiotics and hydration." },
    { title: "Kidney stones", desc: "Pain management, hydration, lithotripsy, or surgery." },
    { title: "Chronic kidney disease (CKD)", desc: "Controlling blood sugar, blood pressure, dietary management, medications to slow progression." },
    { title: "End-stage kidney disease", desc: "Dialysis (hemodialysis/peritoneal dialysis) or kidney transplant." },
  ],

  homeCare:
    "Patients can adopt a kidney-friendly diet (low salt, moderate protein, low potassium/phosphorus if needed), drink adequate water, avoid over-the-counter painkillers, quit smoking, and exercise regularly to maintain overall health.",

  complications:
    "Untreated kidney disease can lead to high blood pressure, heart disease, bone disease, anemia, electrolyte imbalance, fluid retention, kidney failure, and even death without dialysis or transplant.",

  alternativeTherapies:
    "Some people try Ayurveda, acupuncture, yoga, and herbal remedies (like nettle tea, ginger, or cranberry for urinary health). However, these should be used cautiously as some herbs can be harmful to the kidneys. Always consult a doctor first.",

  livingWith:
    "Living with kidney disease often requires long-term lifestyle adjustments, strict diet management, regular medical monitoring, and sometimes dialysis. Many patients live fulfilling lives post-transplant with proper care and follow-up.",

  faqs: [
    {
      question: "Can kidneys heal themselves?",
      answer: "Mild damage may be reversible with early treatment, but chronic kidney disease usually progresses and cannot be fully reversed.",
    },
    {
      question: "How much water should I drink for kidney health?",
      answer: "Most people should drink 2–3 liters daily, but those with kidney disease may need fluid restrictions based on medical advice.",
    },
    {
      question: "What foods are bad for kidneys?",
      answer: "High-salt, processed foods, red meat, excessive protein, and foods rich in potassium or phosphorus (like bananas, dairy, soda) may harm kidneys in CKD patients.",
    },
    {
      question: "Is dialysis permanent?",
      answer: "Some patients require lifelong dialysis unless they receive a kidney transplant, while others may only need temporary dialysis until their kidneys recover.",
    },
  ],
},

  spine: {
  overview:
    "Spine conditions include herniated or slipped discs, scoliosis, spinal stenosis, degenerative disc disease, fractures, arthritis, infections, tumors, and injuries. The spine provides structural support, enables movement, and protects the spinal cord, making it critical for everyday function.",

  keyFacts:
    "The human spine has 33 vertebrae divided into cervical, thoracic, lumbar, sacral, and coccygeal regions. Around 80% of people experience back pain at some point in their lives. Spinal problems are a leading cause of disability worldwide.",

  causes:
    "Causes include aging and degeneration, poor posture, trauma or accidents, obesity, genetic predisposition, sedentary lifestyle, repetitive strain, spinal infections, tumors, osteoporosis, and congenital deformities like scoliosis.",

  symptoms:
    "Symptoms vary by condition but may include chronic or acute back pain, stiffness, tingling or numbness in arms/legs, muscle weakness, difficulty walking, reduced flexibility, loss of bladder/bowel control (in severe cases), and spinal deformity.",

  riskFactors:
    "Risk factors include aging, obesity, lack of exercise, sedentary jobs, smoking, heavy lifting, family history of spinal disorders, poor ergonomics, and osteoporosis.",

  diagnosis:
    "Diagnosis methods include physical examination, X-rays (for bone deformities), MRI and CT scans (for discs, nerves, tumors), bone scans (for infection or cancer), electromyography (for nerve damage), and blood tests (to rule out infections/inflammation).",

  prevention:
    "Prevention includes maintaining good posture, exercising regularly (especially core-strengthening exercises), avoiding heavy lifting, maintaining a healthy weight, using ergonomic chairs/workstations, and avoiding smoking.",

  celebsAffected:
    "Celebrities like Tiger Woods (multiple spine surgeries for herniated discs) and Usain Bolt (scoliosis affecting his running posture) have openly discussed spine-related conditions.",

  specialistToVisit:
    "Orthopedic surgeons, neurosurgeons, spine specialists, physiatrists, pain management specialists, and physical therapists are the main experts for spine disorders.",

  treatment: [
    { title: "Herniated disc/spinal stenosis", desc: "Physical therapy, pain relief medication, epidural injections, or surgery (laminectomy/discectomy)." },
    { title: "Scoliosis", desc: "Bracing, physical therapy, or corrective surgery in severe cases." },
    { title: "Fractures", desc: "Rest, bracing, minimally invasive surgery, or spinal fusion." },
    { title: "Chronic pain", desc: "Physiotherapy, chiropractic care, acupuncture, or pain management programs." },
  ],

  homeCare:
    "Self-care includes maintaining proper posture, using supportive mattresses and chairs, gentle stretching/yoga, heat/ice therapy for pain, regular walking, core strengthening, avoiding prolonged sitting, and weight management.",

  complications:
    "If untreated, spine disorders can cause chronic pain, reduced mobility, nerve compression, paralysis, deformities, depression, loss of independence, and in severe cases, permanent disability.",

  alternativeTherapies:
    "Alternative therapies include chiropractic care, acupuncture, massage therapy, yoga, pilates, physiotherapy, and Ayurvedic treatments for pain management. These can complement medical treatment but should be supervised by professionals.",

  livingWith:
    "Living with a spine condition may require long-term lifestyle modifications, pain management, physiotherapy, and sometimes assistive devices. Many people lead active, fulfilling lives with proper treatment, exercise, and medical monitoring.",

  faqs: [
    {
      question: "Can spine problems heal without surgery?",
      answer: "Yes, many conditions like mild herniated discs, strains, and posture-related issues can improve with physiotherapy, rest, and medication. Surgery is only needed in severe or unresponsive cases.",
    },
    {
      question: "What exercises are safe for spine health?",
      answer: "Low-impact exercises like swimming, walking, yoga, pilates, and core strengthening exercises are beneficial. Always consult a physiotherapist before starting.",
    },
    {
      question: "When should I see a doctor for back pain?",
      answer: "If pain lasts longer than a few weeks, radiates to limbs, causes weakness/numbness, or is associated with bladder/bowel issues, immediate medical attention is required.",
    },
    {
      question: "Can poor posture cause permanent spine damage?",
      answer: "Long-term poor posture can lead to chronic pain, disc degeneration, and deformities. Early correction through ergonomics and exercises prevents permanent damage.",
    },
  ],
},

  gynecology: {
  overview:
    "Gynecology deals with conditions affecting the female reproductive system including uterus, ovaries, fallopian tubes, cervix, and vagina. Common conditions include PCOS (Polycystic Ovary Syndrome), endometriosis, fibroids, ovarian cysts, pelvic inflammatory disease, menstrual disorders, infertility, and cancers of reproductive organs.",

  keyFacts:
    "1 in 10 women worldwide suffer from endometriosis. PCOS affects 5–15% of women of reproductive age. Uterine fibroids are common in women above 30 years. Cervical cancer is one of the leading causes of cancer-related deaths in women in developing countries.",

  causes:
    "Causes vary depending on the condition and may include: hormonal imbalances (as in PCOS or thyroid-related gynecological issues), genetics and family history, infections (bacterial, viral, fungal, or STIs), obesity and poor lifestyle, prolonged use of contraceptives, smoking, stress, weakened immunity, and exposure to environmental toxins.",

  symptoms:
    "Symptoms include abnormal menstrual bleeding (heavy, prolonged, or irregular periods), pelvic pain or pressure, infertility, abnormal vaginal discharge, painful intercourse, bloating, fatigue, frequent urination, lower back pain, and in severe cases, abnormal growths or lumps.",

  riskFactors:
    "Risk factors include early onset of menstruation, delayed menopause, obesity, sedentary lifestyle, family history of gynecological disorders, multiple pregnancies or none at all, smoking, and untreated infections.",

  diagnosis:
    "Diagnosis methods include pelvic examination, ultrasound (to detect fibroids, cysts, or abnormalities), Pap smear (for cervical cancer screening), hormone level testing, MRI/CT scans (for tumors or advanced conditions), hysteroscopy/laparoscopy (for direct visualization), and biopsy (to confirm cancerous changes).",

  prevention:
    "Prevention includes maintaining a healthy weight, regular exercise, balanced diet, practicing safe sex, regular gynecological checkups and Pap smears, HPV vaccination, stress management, and avoiding smoking and alcohol.",

  celebsAffected:
    "Celebrities like Padma Lakshmi (endometriosis awareness), Daisy Ridley (PCOS), and Lena Dunham (endometriosis surgery) have openly discussed their gynecological struggles to raise awareness.",

  specialistToVisit:
    "Gynecologists, reproductive endocrinologists, obstetricians, oncologists (for gynecological cancers), and fertility specialists are the key doctors to consult.",

  treatment: [
    { title: "PCOS", desc: "Lifestyle changes, weight management, hormonal therapy, fertility treatments." },
    { title: "Endometriosis", desc: "Pain management, hormone therapy, laparoscopic surgery." },
    { title: "Fibroids", desc: "Medication, minimally invasive surgery, hysterectomy in severe cases." },
    { title: "Cervical/ovarian cancer", desc: "Surgery, chemotherapy, radiation therapy." },
    { title: "Infections", desc: "Antibiotics, antifungal, or antiviral medications." },
  ],

  homeCare:
    "Self-care includes maintaining healthy diet and exercise routine, tracking menstrual cycle, practicing stress management (yoga/meditation), using heating pads for cramps, proper hygiene, and avoiding self-medication.",

  complications:
    "Untreated gynecological conditions may lead to infertility, recurrent miscarriages, anemia (due to heavy bleeding), chronic pelvic pain, spread of infections, hormonal imbalances, and in severe cases, cancer progression or life-threatening complications.",

  alternativeTherapies:
    "Alternative approaches include yoga, meditation, Ayurveda, acupuncture, herbal remedies (like ashwagandha, flax seeds, evening primrose oil), dietary modifications, and physiotherapy for pelvic floor strengthening.",

  livingWith:
    "Living with gynecological conditions may require ongoing management through medication, regular checkups, lifestyle modifications, and sometimes surgery. Emotional support, counseling, and awareness help women maintain quality of life and fertility options.",

  faqs: [
    {
      question: "How often should women visit a gynecologist?",
      answer: "It is recommended to visit a gynecologist annually for preventive checkups, or immediately if experiencing abnormal symptoms.",
    },
    {
      question: "Can PCOS be completely cured?",
      answer: "No, PCOS cannot be cured, but its symptoms can be managed effectively through lifestyle changes, medications, and fertility treatments.",
    },
    {
      question: "What is the best way to prevent cervical cancer?",
      answer: "HPV vaccination, regular Pap smear tests, and early treatment of abnormal cell changes can significantly reduce the risk of cervical cancer.",
    },
    {
      question: "Are irregular periods always a sign of a serious condition?",
      answer: "Not always. Stress, weight changes, travel, or lifestyle shifts can cause irregular periods, but persistent irregularity requires medical evaluation.",
    },
  ],
},

  ivf: {
  overview:
    "In Vitro Fertilization (IVF) is an advanced assisted reproductive technology (ART) that helps couples struggling with infertility. It involves collecting eggs from the ovaries, fertilizing them with sperm in a laboratory, and transferring the resulting embryo into the uterus. IVF has provided millions of couples worldwide with the opportunity to conceive.",

  keyFacts:
    "First successful IVF baby (Louise Brown) was born in 1978. IVF success rates vary by age and health, averaging 30–40% per cycle for women under 35. Globally, over 8 million babies have been born via IVF. Procedures may also involve donor eggs, sperm, or surrogacy in special cases.",

  causes:
    "IVF is typically recommended for couples with conditions such as: blocked or damaged fallopian tubes, low sperm count or motility, endometriosis, ovulation disorders, advanced maternal age, unexplained infertility, or when other fertility treatments (medications, IUI) have failed.",

  symptoms:
    "Not applicable (since IVF is a treatment, not a disease). However, patients may experience mild side effects from fertility medications such as bloating, headaches, mood swings, abdominal pain, or in rare cases, ovarian hyperstimulation syndrome (OHSS).",

  riskFactors:
    "Factors that reduce IVF success rates include maternal age above 35, poor egg or sperm quality, smoking, obesity, untreated medical conditions (thyroid, diabetes), previous failed IVF cycles, and lifestyle-related stress.",

  diagnosis:
    "Before IVF, a couple undergoes fertility evaluation including hormone tests, ovarian reserve testing (AMH, FSH levels), semen analysis, ultrasound scans, hysterosalpingography (to check fallopian tubes), and genetic screening if needed.",

  prevention:
    "While infertility cannot always be prevented, steps that improve IVF outcomes include maintaining a healthy weight, balanced diet, regular exercise, avoiding smoking and alcohol, managing stress, and addressing medical conditions early.",

  celebsAffected:
    "Many celebrities have openly discussed using IVF: Priyanka Chopra & Nick Jonas (via surrogacy), Chrissy Teigen & John Legend, Courteney Cox, and Celine Dion have shared their IVF journeys to spread awareness.",

  specialistToVisit:
    "Couples should consult reproductive endocrinologists, infertility specialists, gynecologists, urologists (for male infertility), and embryologists who manage the IVF process.",

  treatment: [
    { title: "Ovarian Stimulation", desc: "Fertility medications stimulate egg production." },
    { title: "Egg Retrieval", desc: "Eggs are collected from the ovaries." },
    { title: "Sperm Collection", desc: "Partner or donor sperm is collected." },
    { title: "Fertilization", desc: "Eggs and sperm are combined in a lab." },
    { title: "Embryo Culture", desc: "Embryos are monitored for growth." },
    { title: "Embryo Transfer", desc: "A selected embryo is placed into the uterus." },
    { title: "Pregnancy Test", desc: "Conducted 10–14 days later to confirm success." },
  ],

  homeCare:
    "During IVF treatment, home care includes a healthy diet rich in protein and vitamins, hydration, avoiding alcohol and smoking, limiting caffeine, gentle exercise (yoga, walking), taking prescribed medications on time, and emotional support through counseling or support groups.",

  complications:
    "Possible complications include multiple pregnancies (twins/triplets), ectopic pregnancy, ovarian hyperstimulation syndrome (OHSS), miscarriage, emotional stress, and financial strain due to the high cost of treatment.",

  alternativeTherapies:
    "Complementary approaches like acupuncture, yoga, meditation, Ayurveda, and nutritional therapy are sometimes used alongside IVF to reduce stress and improve overall well-being. However, they should not replace medical treatment.",

  livingWith:
    "Living with IVF treatment can be emotionally and physically demanding. Patients may need multiple cycles for success. Emotional support, counseling, open communication between partners, and connecting with IVF support groups can help in coping with the process.",

  faqs: [
    {
      question: "How successful is IVF?",
      answer: "Success rates vary depending on age and health, with around 30–40% per cycle in women under 35 and lower rates in older women.",
    },
    {
      question: "Is IVF painful?",
      answer: "The procedure itself is not painful, though patients may experience mild discomfort during injections, egg retrieval, or embryo transfer.",
    },
    {
      question: "How long does one IVF cycle take?",
      answer: "A single IVF cycle typically takes 4–6 weeks from ovarian stimulation to embryo transfer.",
    },
    {
      question: "Does IVF increase the risk of birth defects?",
      answer: "IVF babies are generally healthy; the risk of birth defects is only slightly higher compared to natural conception, often due to underlying parental factors.",
    },
    {
      question: "Can IVF guarantee pregnancy?",
      answer: "No, IVF increases the chances but does not guarantee pregnancy. Multiple cycles may be required for success.",
    },
  ],
},

  reproduction: {
  overview:
    "Reproductive health involves the proper functioning of the male and female reproductive systems, fertility, hormonal balance, safe sexual practices, and overall well-being related to reproduction. It covers fertility issues, contraception, pregnancy, childbirth, and prevention/management of reproductive disorders.",

  keyFacts:
    "Reproductive health is recognized as a human right by the WHO. Globally, infertility affects about 15% of couples. Both men and women can equally contribute to fertility problems. Access to reproductive healthcare, including family planning and safe childbirth, improves maternal and child outcomes significantly.",

  causes:
    "Common causes of reproductive health issues include hormonal imbalances (PCOS, thyroid disorders, low testosterone), infections (STIs, pelvic inflammatory disease), genetic disorders, age-related fertility decline, stress, obesity, malnutrition, smoking, alcohol use, and exposure to toxins or radiation.",

  symptoms:
    "Symptoms of reproductive health problems vary but may include irregular or absent menstrual cycles, hormonal imbalance signs (acne, hair loss, mood changes), infertility, sexual dysfunction, pelvic pain, abnormal discharge, or recurrent miscarriages.",

  riskFactors:
    "Risk factors include advanced maternal/paternal age, family history of reproductive disorders, unprotected sex leading to infections, smoking, alcohol, drug use, obesity, chronic illnesses (diabetes, thyroid, hypertension), sedentary lifestyle, and high stress levels.",

  diagnosis:
    "Diagnosis often involves blood hormone tests (FSH, LH, estrogen, testosterone, AMH), ultrasound for ovarian and uterine health, semen analysis for male fertility, laparoscopy/hysteroscopy in women, genetic testing, and STI screening.",

  prevention:
    "Preventive measures include safe sexual practices, regular gynecological/urological check-ups, vaccinations (like HPV), maintaining healthy weight, managing chronic conditions, balanced diet, stress management, avoiding smoking/alcohol, and early medical intervention when symptoms arise.",

  celebsAffected:
    "Several celebrities have shared their reproductive health struggles: Gabrielle Union (adenomyosis & infertility), Priyanka Chopra & Nick Jonas (used surrogacy for parenthood), Kim Kardashian (complications during pregnancy), and Hugh Jackman (adoption after infertility struggles).",

  specialistToVisit:
    "Depending on the condition: gynecologists, urologists, reproductive endocrinologists, fertility specialists, and endocrinologists are consulted for reproductive health issues.",

  treatment: [
    { title: "Fertility issues", desc: "Medications (Clomiphene, Gonadotropins), IVF, IUI, ICSI." },
    { title: "Hormonal imbalance", desc: "Hormone therapy, thyroid treatment, lifestyle changes." },
    { title: "Infections", desc: "Antibiotics, antiviral/antifungal treatments." },
    { title: "Contraception", desc: "Pills, IUDs, implants, condoms, sterilization." },
    { title: "Surgical options", desc: "Fibroid removal, tubal surgery, varicocele repair." },
    { title: "Counseling", desc: "Sexual health counseling and therapy for psychological aspects." },
  ],

  homeCare:
    "At-home care includes a balanced diet rich in antioxidants, zinc, folic acid, and vitamin D; regular exercise; stress management (yoga, meditation); maintaining a healthy weight; avoiding smoking/alcohol; and ensuring adequate sleep to support hormonal balance and fertility.",

  complications:
    "Untreated reproductive health problems may cause infertility, recurrent miscarriages, ectopic pregnancy, chronic pelvic pain, hormonal disorders, pregnancy complications, increased risk of cancers (cervical, ovarian, prostate), and psychological stress.",

  alternativeTherapies:
    "Complementary approaches include Ayurveda, acupuncture (used to support fertility), yoga, meditation, herbal supplements (ashwagandha, maca root, vitex), and stress-relief therapies. These can support reproductive wellness but should not replace medical treatment.",

  livingWith:
    "Living with reproductive health challenges requires emotional resilience and medical guidance. Many couples face psychological stress during infertility treatments. Counseling, support groups, open communication between partners, and lifestyle management can greatly improve coping and outcomes.",

  faqs: [
    {
      question: "What is the best age for reproduction?",
      answer: "Biologically, the most fertile years for women are between 20–30, while male fertility is more stable but also declines after 40.",
    },
    {
      question: "Can stress affect fertility?",
      answer: "Yes, high stress can disrupt hormonal balance and ovulation, indirectly affecting fertility in both men and women.",
    },
    {
      question: "Can reproductive disorders be inherited?",
      answer: "Yes, some conditions like PCOS, endometriosis, and certain genetic abnormalities can run in families.",
    },
    {
      question: "Is infertility only a women’s issue?",
      answer: "No, infertility affects both men and women equally, with male factors contributing to around 40–50% of cases.",
    },
    {
      question: "How can reproductive health be improved naturally?",
      answer: "Maintaining a healthy diet, exercising, avoiding toxins, reducing stress, and practicing safe sex can improve reproductive health.",
    },
  ],
},

  jointReplacement: {
  overview:
    "Joint replacement is a surgical procedure in which parts of an arthritic or damaged joint are removed and replaced with metal, plastic, or ceramic components. It is most commonly performed on the hip and knee joints but can also be done on shoulders, elbows, and ankles. The goal is to relieve pain, restore function, and improve quality of life.",

  keyFacts:
    "Millions of people worldwide undergo joint replacement each year. Knee and hip replacements are among the most successful surgeries, with over 90% of implants lasting 15–20 years. Recovery and outcome depend on patient age, health condition, and post-surgical rehabilitation.",

  causes:
    "Joint replacement is usually required due to osteoarthritis, rheumatoid arthritis, post-traumatic arthritis (after injury), avascular necrosis (loss of blood supply to bone), congenital deformities, or severe joint fractures.",

  symptoms:
    "Key symptoms that may indicate the need for joint replacement include persistent joint pain, stiffness, swelling, grinding or creaking sensations, reduced range of motion, and difficulty performing daily activities despite medication or therapy.",

  riskFactors:
    "Risk factors include advanced age, obesity, previous joint injuries, family history of arthritis, autoimmune conditions, high-impact physical activities, and bone deformities.",

  diagnosis:
    "Doctors may recommend joint replacement after assessing symptoms, performing physical examinations, X-rays, MRI scans, and reviewing patient history. Non-surgical treatments are usually attempted first, such as physical therapy, medications, and joint injections.",

  prevention:
    "While not all cases can be prevented, steps to delay joint damage include maintaining a healthy weight, regular low-impact exercise, avoiding joint overuse, managing chronic conditions like diabetes and arthritis, and ensuring proper nutrition with calcium and vitamin D.",

  celebsAffected:
    "Celebrities who have undergone joint replacement include Queen Elizabeth II (knee replacement), Jane Fonda (hip and knee replacements), and Lionel Richie (hip replacement). Many athletes also undergo these surgeries to prolong mobility.",

  specialistToVisit:
    "Orthopedic surgeons specializing in joint replacement and sports medicine are the primary specialists. Physiotherapists play a crucial role in rehabilitation after surgery.",

  treatment: [
    { title: "Non-surgical", desc: "Medications (NSAIDs, pain relievers), physical therapy, cortisone injections, lifestyle changes." },
    { title: "Surgical", desc: "Partial or total joint replacement depending on severity. Minimally invasive techniques are available for faster recovery." },
    { title: "Rehabilitation", desc: "Post-surgery physiotherapy is critical for restoring strength, flexibility, and mobility." },
  ],

  homeCare:
    "At-home care after joint replacement includes using mobility aids (walker, cane), regular physiotherapy exercises, keeping surgical wounds clean, pain management as prescribed, avoiding high-impact activities, and following a balanced diet to promote healing.",

  complications:
    "Possible complications include infection, blood clots, implant loosening or wear, nerve or blood vessel injury, and joint stiffness. Long-term risks involve implant failure that may require revision surgery.",

  alternativeTherapies:
    "Alternative approaches include physiotherapy, hydrotherapy, acupuncture, yoga, weight management, and supplements like glucosamine and chondroitin (though evidence is mixed). These may help manage symptoms but cannot replace surgery if joints are severely damaged.",

  livingWith:
    "Most patients live a more active, pain-free life after joint replacement. It requires lifestyle modifications such as avoiding high-impact sports, adhering to exercise routines, and attending regular medical checkups. Proper care can ensure implants last decades.",

  faqs: [
    {
      question: "How long do artificial joints last?",
      answer: "Most modern implants last 15–20 years or more with proper care.",
    },
    {
      question: "What is the recovery time for joint replacement?",
      answer: "Initial recovery takes about 6–12 weeks, but full recovery and maximum benefits may take up to 6–12 months.",
    },
    {
      question: "Can I live a normal life after joint replacement?",
      answer: "Yes, most people resume daily activities with significantly less pain, though high-impact sports should be avoided.",
    },
    {
      question: "Is joint replacement the last option?",
      answer: "Yes, doctors usually recommend it when conservative treatments like medications and physiotherapy no longer provide relief.",
    },
    {
      question: "Are there alternatives to joint replacement?",
      answer: "Alternatives include physiotherapy, weight loss, medications, and injections, but these are usually temporary solutions.",
    },
  ],
},

  bone: {
  overview:
    "Bone conditions encompass a wide range of disorders affecting the structure, strength, and function of bones. Common conditions include fractures, osteoporosis, osteoarthritis-related bone changes, bone infections, and bone cancer. Bones play a vital role in supporting the body, protecting organs, storing minerals, and producing blood cells.",

  keyFacts:
    "Bones are living tissues that constantly remodel themselves. Millions of people worldwide are affected by bone-related conditions each year. Osteoporosis alone affects over 200 million people, increasing fracture risk. Bone health is crucial for mobility, posture, and overall quality of life.",

  causes:
    "Causes of bone conditions include aging, hormonal imbalances (such as reduced estrogen or testosterone), nutritional deficiencies (calcium or vitamin D), physical trauma, infections, tumors, genetic disorders, and autoimmune diseases.",

  symptoms:
    "Symptoms vary depending on the condition but commonly include bone pain, fractures, deformities, reduced strength, swelling, limited mobility, and in some cases, fatigue or systemic symptoms like weight loss if cancer is involved.",

  riskFactors:
    "Risk factors include older age, family history of bone disease, low body weight, sedentary lifestyle, smoking, excessive alcohol consumption, poor nutrition, previous fractures, chronic illnesses (like diabetes or rheumatoid arthritis), and certain medications such as corticosteroids.",

  diagnosis:
    "Diagnosis is made through medical history, physical examination, and imaging tests such as X-rays, CT scans, MRI, and bone density scans (DEXA). Blood tests may be performed to check calcium, vitamin D, and hormone levels, and biopsies are sometimes needed for suspected bone cancer.",

  prevention:
    "Prevention strategies include a balanced diet rich in calcium and vitamin D, regular weight-bearing and strength-training exercises, avoiding smoking and excessive alcohol, fall prevention measures, and regular bone density screening for at-risk individuals.",

  celebsAffected:
    "Several public figures have spoken about bone health challenges, including Angelina Jolie (osteoporosis risk awareness), and athletes like Tiger Woods who have recovered from fractures and bone injuries.",

  specialistToVisit:
    "Orthopedic surgeons, endocrinologists (for metabolic bone disease), and rheumatologists are key specialists. Physiotherapists and dietitians are important for rehabilitation and nutritional support.",

  treatment: [
    { title: "Fractures", desc: "Immobilization with casts or splints, surgical fixation, and physiotherapy." },
    { title: "Osteoporosis", desc: "Medications (bisphosphonates, denosumab), supplements (calcium, vitamin D), and exercise." },
    { title: "Bone cancer", desc: "Surgery, chemotherapy, radiotherapy, or targeted therapy." },
    { title: "Infections", desc: "Antibiotics and sometimes surgical debridement." },
    { title: "Osteoarthritis-related bone changes", desc: "Pain management, joint support, and sometimes surgery including joint replacement." },
  ],

  homeCare:
    "At-home care includes following medical advice, ensuring proper nutrition, safe mobility practices to prevent falls, taking prescribed medications, performing recommended exercises, and monitoring for signs of complications such as pain, swelling, or fever.",

  complications:
    "Complications can include delayed healing, chronic pain, deformities, fractures, loss of mobility, infections, and, in severe cases, disability. Bone cancers carry additional risks including metastasis.",

  alternativeTherapies:
    "Complementary approaches may include physiotherapy, yoga, low-impact exercises, acupuncture, vitamin and mineral supplementation, and hydrotherapy. These can support bone health and symptom management but are not substitutes for medical treatment in serious conditions.",

  livingWith:
    "With proper management, most individuals with bone conditions can maintain an active lifestyle. It requires adherence to treatment, regular monitoring, exercise, nutritional care, and avoidance of high-risk activities that may cause fractures.",

  faqs: [
    {
      question: "How can I strengthen my bones naturally?",
      answer: "Regular weight-bearing exercise, adequate calcium and vitamin D intake, avoiding smoking and excessive alcohol, and maintaining a healthy weight all help strengthen bones.",
    },
    {
      question: "What are early signs of osteoporosis?",
      answer: "Osteoporosis is often silent until a fracture occurs. Early signs may include loss of height, back pain, or a stooped posture.",
    },
    {
      question: "Can bone fractures heal completely?",
      answer: "Yes, most fractures heal fully with proper immobilization, nutrition, and rehabilitation, though healing time varies by age, fracture type, and overall health.",
    },
    {
      question: "Are bone cancers hereditary?",
      answer: "Most bone cancers are not inherited, but genetic predispositions can increase risk in some cases.",
    },
    {
      question: "When should I see a doctor for bone pain?",
      answer: "Seek medical attention for persistent, severe, or unexplained bone pain, fractures from minor trauma, swelling, or any symptoms affecting mobility or daily activities.",
    },
  ],
},

  pediatrics: {
  overview:
    "Pediatrics is the branch of medicine that deals with the medical care of infants, children, and adolescents. It covers a wide range of conditions including infectious diseases, developmental and behavioral disorders, nutritional problems, congenital anomalies, and chronic illnesses. Pediatric care focuses on both treatment and preventive health to ensure proper growth and development.",

  keyFacts:
    "Children have unique healthcare needs that differ significantly from adults. Pediatric care spans from newborns (neonates) to adolescents (up to 18 years). Early diagnosis and management of illnesses in childhood are crucial for long-term health and development.",

  causes:
    "Causes of pediatric conditions include infections (bacterial, viral, fungal), genetic or congenital disorders, environmental factors (pollution, allergens), nutritional deficiencies, trauma, and lifestyle factors. Some conditions may also arise from autoimmune or chronic systemic diseases.",

  symptoms:
    "Symptoms vary widely depending on the condition and the child’s age. Common signs include fever, poor feeding, growth delays, developmental milestones not being met, rashes, breathing difficulties, behavioral changes, recurrent infections, or unexplained pain.",

  riskFactors:
    "Risk factors include premature birth, low birth weight, family history of chronic or genetic disorders, exposure to infectious agents, poor nutrition, environmental hazards, and lack of routine vaccinations.",

  diagnosis:
    "Diagnosis involves thorough medical history, physical examination, growth and developmental assessments, lab tests, imaging (X-rays, ultrasound, MRI), genetic screening, and specialist consultations depending on the suspected condition.",

  prevention:
    "Preventive measures include regular pediatric check-ups, timely vaccinations, proper nutrition, maintaining hygiene, safety precautions at home and school, promoting physical activity, and early developmental screenings.",

  celebsAffected:
    "Several public figures have advocated for child health, including Angelina Jolie and Meghan Markle who support pediatric healthcare initiatives. Pediatric care also includes awareness campaigns for childhood illnesses and vaccinations.",

  specialistToVisit:
    "Pediatricians are the primary specialists for child healthcare. Depending on the condition, children may also see pediatric cardiologists, neurologists, endocrinologists, geneticists, and therapists (speech, occupational, physiotherapy).",  

  treatment: [
    { title: "Infections", desc: "Antibiotics, antivirals, antifungals, supportive care." },
    { title: "Developmental disorders", desc: "Early intervention, therapy, educational support." },
    { title: "Chronic illnesses", desc: "Medication, lifestyle management, monitoring." },
    { title: "Congenital anomalies", desc: "Surgical correction if needed, supportive therapies." },
    { title: "Preventive care", desc: "Immunizations, nutrition, growth monitoring." },
  ],

  homeCare:
    "At-home care involves following prescribed medications, ensuring proper nutrition and hydration, monitoring symptoms, maintaining hygiene, encouraging healthy routines, and attending follow-up appointments.",

  complications:
    "Complications vary by condition but can include delayed growth, chronic disability, developmental delays, recurrent infections, organ damage, or life-threatening episodes if not managed promptly.",

  alternativeTherapies:
    "Complementary approaches may include nutritional therapy, physiotherapy, occupational therapy, behavioral therapy, and age-appropriate exercise programs. These support conventional treatments but do not replace necessary medical care.",

  livingWith:
    "With timely diagnosis and proper management, most children with pediatric conditions can lead healthy, active lives. Care involves regular monitoring, therapy adherence, vaccinations, and lifestyle adjustments to support growth and development.",

  faqs: [
    {
      question: "When should I take my child to a pediatrician?",
      answer: "For routine check-ups, vaccinations, persistent symptoms, growth or developmental concerns, or any sudden illness.",
    },
    {
      question: "Are vaccines safe for children?",
      answer: "Yes, vaccines are rigorously tested and are essential to prevent serious childhood diseases.",
    },
    {
      question: "How can I support my child’s development?",
      answer: "Provide a balanced diet, encourage age-appropriate play, monitor milestones, maintain regular pediatric visits, and seek early intervention if needed.",
    },
    {
      question: "What are common childhood infections?",
      answer: "Common infections include colds, flu, ear infections, strep throat, chickenpox, and respiratory infections.",
    },
    {
      question: "Can pediatric conditions be prevented?",
      answer: "Many can be prevented or minimized through vaccinations, nutrition, hygiene, safety measures, and early screenings.",
    },
  ],
},

  cancer: {
  overview:
    "Cancer is a broad group of diseases characterized by uncontrolled growth and spread of abnormal cells in the body. It can affect almost any organ or tissue, including the lungs, breast, colon, prostate, skin, and blood (leukemia). If left untreated, cancer can invade surrounding tissues and metastasize to distant organs, significantly impacting health and survival.",

  keyFacts:
    "Cancer is one of the leading causes of death globally. Early detection, accurate diagnosis, and timely treatment are critical to improving survival rates. Advances in surgery, chemotherapy, radiation therapy, immunotherapy, and targeted therapies have significantly improved outcomes for many types of cancer.",

  causes:
    "Causes of cancer are multifactorial and include genetic mutations, environmental exposures (radiation, pollution, industrial chemicals), lifestyle factors (smoking, alcohol, diet), chronic infections (HPV, Hepatitis B/C), and inherited genetic predispositions. Many cancers result from a combination of these factors over time.",

  symptoms:
    "Symptoms vary depending on the type and stage of cancer but may include lumps or masses, unexplained weight loss, fatigue, persistent pain, abnormal bleeding, changes in skin or moles, persistent cough, digestive changes, and abnormal lab test results.",

  riskFactors:
    "Risk factors include tobacco use, excessive alcohol consumption, poor diet, obesity, chronic infections, family history of cancer, exposure to carcinogens, advanced age, and certain genetic mutations (e.g., BRCA1/2 for breast and ovarian cancer).",

  diagnosis:
    "Diagnosis involves a combination of medical history, physical examination, imaging (X-ray, CT, MRI, PET scans), biopsy for histopathology, blood tests including tumor markers, and genetic testing when indicated.",

  prevention:
    "Prevention strategies include avoiding tobacco, limiting alcohol, maintaining a healthy weight, regular exercise, balanced diet, vaccination against HPV and Hepatitis B, reducing exposure to environmental carcinogens, and undergoing recommended screening tests for early detection.",

  celebsAffected:
    "Many public figures have battled cancer, raising awareness and promoting early detection, including Chadwick Boseman, Angelina Jolie (BRCA mutation preventive measures), Olivia Newton-John, and Steve Jobs.",

  specialistToVisit:
    "Oncologists are the primary specialists for cancer diagnosis and treatment. Depending on the type, surgical oncologists, medical oncologists, radiation oncologists, hematologists, and supportive care teams including dietitians and physiotherapists may be involved.",

   treatment: [
    { title: "Surgery", desc: "Removing localized tumors." },
    { title: "Chemotherapy", desc: "Using drugs to kill cancer cells or stop their growth." },
    { title: "Radiation therapy", desc: "Targeted high-energy radiation to destroy cancer cells." },
    { title: "Targeted therapy & immunotherapy", desc: "Drugs that attack specific cancer cells or boost the immune system." },
    { title: "Palliative care", desc: "Symptom management to improve quality of life for advanced cancer." },
  ],

  homeCare:
    "At-home care includes following treatment regimens, managing side effects, maintaining nutrition and hydration, monitoring for infection, emotional support, and attending follow-up appointments and screenings.",

  complications:
    "Complications may include treatment side effects (nausea, fatigue, hair loss), infection, organ dysfunction, metastasis, or recurrence. Long-term effects depend on cancer type and treatment intensity.",

  alternativeTherapies:
    "Complementary approaches may include nutrition therapy, acupuncture, mindfulness, yoga, and physiotherapy. These help with symptom management and quality of life but do not replace standard medical treatment.",

  livingWith:
    "Many cancer survivors live full lives with regular monitoring and lifestyle adjustments. Early detection, adherence to treatment, healthy nutrition, exercise, and emotional support are key to long-term survival and well-being.",

  faqs: [
    {
      question: "Can cancer be prevented?",
      answer: "While not all cancers are preventable, many can be reduced through lifestyle changes, vaccinations, avoiding carcinogens, and regular screenings.",
    },
    {
      question: "How is cancer diagnosed?",
      answer: "Diagnosis typically involves imaging, lab tests, biopsies, and sometimes genetic testing to confirm type and stage.",
    },
    {
      question: "What are the common symptoms of cancer?",
      answer: "Symptoms vary but may include unexplained weight loss, fatigue, persistent pain, lumps, abnormal bleeding, or changes in skin or bodily functions.",
    },
    {
      question: "Can cancer be cured?",
      answer: "Some cancers can be cured if detected early and treated appropriately. Advanced cancers may be controlled to prolong life and improve quality.",
    },
    {
      question: "Are there alternatives to standard cancer treatment?",
      answer: "Complementary therapies can support well-being, but they cannot replace evidence-based medical treatments like surgery, chemotherapy, or radiation.",
    },
  ],
},

}
  const selectedContent = contentData[slug] || {}
  const sections = [
    { id: "overview", title: "Overview", key: "overview", image: "/images/brain-1.png" },
    { id: "key-facts", title: "Key Facts", key: "keyFacts", image: "/images/brain-2.png" },
    { id: "causes", title: "Causes", key: "causes", image: "/images/brain-1.png" },
    { id: "symptoms", title: "Symptoms", key: "symptoms", image: "/images/brain-2.png" },
    { id: "risk-factors", title: "Risk Factors", key: "riskFactors", image: "/images/brain-1.png" },
    { id: "diagnosis", title: "Diagnosis", key: "diagnosis", image: "/images/brain-2.png" },
    { id: "prevention", title: "Prevention", key: "prevention", image: "/images/brain-1.png" },
    { id: "celebs-affected", title: "Celebs Affected", key: "celebsAffected", image: "/images/brain-2.png" },
    { id: "specialist-to-visit", title: "Specialist to Visit", key: "specialistToVisit", image: "/images/brain-1.png" },
    { id: "treatment", title: "Treatment", key: "treatment", image: "/images/brain-2.png" },
    { id: "home-care", title: "Home-Care", key: "homeCare", image: "/images/brain-1.png" },
    { id: "complications", title: "Complications", key: "complications", image: "/images/brain-2.png" },
    { id: "alternative-therapies", title: "Alternative Therapies", key: "alternativeTherapies", image: "/images/brain-1.png" },
    { id: "living-with", title: "Living with", key: "livingWith", image: "/images/brain-2.png" },
    { id: "faqs", title: "FAQs", key: "faqs", image: "/images/brain-1.png" },
  ]
  return (
     <div className="space-y-12">
  {sections.map((section) => (
    <div
      key={section.id}
      id={`section-${section.id}`}
      className="scroll-mt-8 bg-white"
    >
      <h2 className="text-2xl font-bold text-[#5271FF] mb-4">{section.title}</h2>

      {/* Render FAQs */}
      {section.key === "faqs" && Array.isArray(selectedContent.faqs) ? (
        <div className="space-y-4">
          {selectedContent.faqs.map((faq, idx) => (
            <details
              key={idx}
              className="border rounded-lg p-4 cursor-pointer bg-gray-50"
            >
              <summary className="font-semibold text-[#5271FF]">
                {faq.question}
              </summary>
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      ) : section.key === "treatment" && Array.isArray(selectedContent.treatment) ? (
        // Render treatment as list
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          {selectedContent.treatment.map((item, idx) => (
            <li key={idx}>
              <strong>{item.title}:</strong> {item.desc}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 leading-relaxed mb-4">
          {selectedContent[section.key] || "Content coming soon."}
        </p>
      )}
    </div>
  ))}
</div>
  )
}
