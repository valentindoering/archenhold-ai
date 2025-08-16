// Form structure and initial data
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date';
  required: boolean;
  value: string;
}

export interface PersonalInfoForm {
  fields: FormField[];
}

export const initialFormData: PersonalInfoForm = {
  fields: [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      value: ''
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      value: ''
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      value: ''
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: false,
      value: ''
    },
    {
      id: 'placeOfBirth',
      label: 'Place of Birth',
      type: 'text',
      required: true,
      value: ''
    },
    {
      id: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      value: ''
    },
    {
      id: 'occupation',
      label: 'Occupation',
      type: 'text',
      required: false,
      value: ''
    },
    {
      id: 'emergencyContact',
      label: 'Emergency Contact',
      type: 'text',
      required: false,
      value: ''
    }
  ]
};

// Sample responses for the agent
export const exampleFormResponses = {
  confirmation: [
    "I've filled out that field for you.",
    "Got it, I've updated that information.",
    "Perfect, I've entered that in the form.",
    "I've recorded that information for you."
  ],
  fieldNotFound: [
    "I'm not sure which field you're referring to. The form has fields for name, age, email, phone, place of birth, date of birth, occupation, and emergency contact.",
    "Could you clarify which field you'd like me to update? I can help with any of the form fields.",
    "I didn't catch which field you want to fill. Can you specify the field name?"
  ],
  formComplete: [
    "Great! All required fields are now filled out. Would you like me to submit the form?",
    "The form looks complete. Should I go ahead and submit it for you?",
    "All the necessary information has been entered. Ready to submit?"
  ],
  formSubmitted: [
    "Perfect! I've submitted the form for you. The data has been processed.",
    "Form submitted successfully! All the information has been recorded.",
    "Done! Your form has been submitted and the data cleared."
  ]
};

export const exampleFormPolicies = [
  {
    id: "FP-001",
    name: "Form Completion Policy",
    topic: "form completion",
    content: "All required fields (name, age, email, place of birth, date of birth) must be completed before the form can be submitted. Optional fields include phone number, occupation, and emergency contact."
  },
  {
    id: "FP-002", 
    name: "Data Privacy Policy",
    topic: "data privacy",
    content: "All personal information collected through this form is handled according to our privacy policy. Data is processed securely and can be deleted upon request."
  },
  {
    id: "FP-003",
    name: "Form Submission Policy", 
    topic: "form submission",
    content: "Once submitted, form data is processed immediately and the form is cleared. Users can fill out the form multiple times if needed."
  }
];
