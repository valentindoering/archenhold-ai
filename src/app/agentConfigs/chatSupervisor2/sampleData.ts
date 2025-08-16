export const examplePatientInfo = {
  patientId: "MH-789012",
  name: "Sarah Martinez",
  phone: "+1-555-234-5678",
  email: "sarah.martinez@email.com",
  insurance: "BlueCross Premium",
  copay: "$25.00",
  lastVisitDate: "2024-11-15",
  nextAppointmentDate: "2024-12-20",
  primaryPhysician: "Dr. Emily Chen",
  status: "Active",
  address: {
    street: "456 Oak Avenue",
    city: "Portland",
    state: "OR",
    zip: "97205"
  },
  medicalHistory: {
    allergies: "Penicillin, Peanuts",
    conditions: "Hypertension, Type 2 Diabetes",
    medications: "Metformin 500mg, Lisinopril 10mg",
    lastLabWork: "2024-10-30",
    notes: "Patient well-controlled on current medications. Annual physical due."
  }
};

export const exampleMedicalPolicies = [
  {
    id: "MP-010",
    name: "Appointment Scheduling Policy",
    topic: "appointment scheduling",
    content:
      "Patients can schedule appointments online, by phone, or through the patient portal. Same-day appointments are available for urgent needs. Annual physicals should be scheduled 3-4 weeks in advance. Specialty appointments may require a referral from your primary care physician.",
  },
  {
    id: "MP-020",
    name: "Insurance and Billing Policy",
    topic: "insurance and billing",
    content:
      "We accept most major insurance plans including BlueCross, Aetna, and Medicare. Copays are due at the time of service. Patients without insurance can apply for our sliding fee scale program. Lab work and diagnostic tests may require separate copays based on your insurance plan.",
  },
  {
    id: "MP-030",
    name: "Prescription Refill Policy",
    topic: "prescription refills",
    content:
      "Prescription refills can be requested through the patient portal, by phone, or in person. Allow 24-48 hours for processing. Controlled substances require an in-person visit and cannot be refilled early. Emergency refills for essential medications are available after hours.",
  },
  {
    id: "MP-040",
    name: "Lab Results and Test Results Policy",
    topic: "lab results",
    content:
      "Lab results are typically available within 2-3 business days and will be posted to your patient portal. Abnormal results will be communicated by phone within 24 hours. You can request paper copies of any lab results. Radiology reports are usually available within 24 hours.",
  },
  {
    id: "MP-050",
    name: "Telehealth Services Policy",
    topic: "telehealth",
    content:
      "Virtual appointments are available for follow-up visits, medication reviews, and non-urgent consultations. Telehealth visits have the same copay as in-person visits. Technical support is available 30 minutes before your appointment. Some conditions require in-person evaluation.",
  },
];

export const exampleMedicalLocations = [
  // West Coast
  {
    name: "MedHealth Portland Main Clinic",
    address: "1200 SW Morrison St, Portland, OR",
    zip_code: "97205",
    phone: "(503) 555-2001",
    hours: "Mon-Fri 7am-6pm, Sat 8am-4pm",
    services: "Primary Care, Lab Services, Urgent Care"
  },
  {
    name: "MedHealth Seattle Downtown",
    address: "1500 4th Ave, Seattle, WA",
    zip_code: "98101",
    phone: "(206) 555-2002",
    hours: "Mon-Fri 7am-7pm, Sat-Sun 9am-5pm",
    services: "Primary Care, Specialty Care, Imaging"
  },
  {
    name: "MedHealth San Francisco Mission Bay",
    address: "1650 3rd St, San Francisco, CA",
    zip_code: "94158",
    phone: "(415) 555-2003",
    hours: "Mon-Fri 6am-8pm, Sat-Sun 8am-6pm",
    services: "Primary Care, Emergency Care, Pharmacy"
  },
  // East Coast
  {
    name: "MedHealth Boston Back Bay",
    address: "900 Commonwealth Ave, Boston, MA",
    zip_code: "02215",
    phone: "(617) 555-2004",
    hours: "Mon-Fri 7am-6pm, Sat 8am-4pm",
    services: "Primary Care, Cardiology, Endocrinology"
  },
  {
    name: "MedHealth New York Midtown",
    address: "800 2nd Ave, New York, NY",
    zip_code: "10017",
    phone: "(212) 555-2005",
    hours: "Mon-Fri 6am-8pm, Sat-Sun 8am-6pm",
    services: "Primary Care, Urgent Care, Women's Health"
  },
  {
    name: "MedHealth Washington DC Capitol Hill",
    address: "600 Pennsylvania Ave SE, Washington, DC",
    zip_code: "20003",
    phone: "(202) 555-2006",
    hours: "Mon-Fri 7am-7pm, Sat 9am-5pm",
    services: "Primary Care, Mental Health, Pediatrics"
  },
  // South
  {
    name: "MedHealth Atlanta Midtown",
    address: "550 Peachtree St NE, Atlanta, GA",
    zip_code: "30308",
    phone: "(404) 555-2007",
    hours: "Mon-Fri 7am-6pm, Sat 8am-4pm",
    services: "Primary Care, Dermatology, Orthopedics"
  },
  {
    name: "MedHealth Miami Beach",
    address: "4300 Alton Rd, Miami Beach, FL",
    zip_code: "33140",
    phone: "(305) 555-2008",
    hours: "Mon-Fri 7am-7pm, Sat-Sun 9am-5pm",
    services: "Primary Care, Family Medicine, Lab Services"
  },
  // Midwest
  {
    name: "MedHealth Chicago Loop",
    address: "200 W Madison St, Chicago, IL",
    zip_code: "60606",
    phone: "(312) 555-2009",
    hours: "Mon-Fri 6am-8pm, Sat-Sun 8am-6pm",
    services: "Primary Care, Urgent Care, Occupational Health"
  },
  {
    name: "MedHealth Denver Downtown",
    address: "1400 16th St, Denver, CO",
    zip_code: "80202",
    phone: "(303) 555-2010",
    hours: "Mon-Fri 7am-6pm, Sat 8am-4pm",
    services: "Primary Care, Sports Medicine, Physical Therapy"
  }
];
