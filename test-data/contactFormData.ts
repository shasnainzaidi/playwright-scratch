export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ── Valid Contact Form Data ────────────────────────
export const validContactFormData: ContactFormData = {
  name: 'John Doe',
  email: process.env.AE_EMAIL || 'hasnain.contour@gmail.com',
  subject: 'Test Contact Form Submission',
  message: 'This is a test message for the contact form. Please acknowledge receipt of this message.',
};

export const validContactFormData2: ContactFormData = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  subject: 'Feature Request',
  message: 'I would like to request a new feature for the platform. Please consider this request.',
};

export const validContactFormData3: ContactFormData = {
  name: 'Robert Johnson',
  email: 'robert.j@example.com',
  subject: 'Bug Report',
  message: 'Found a critical bug in the login flow. The issue is reproducible every time.',
};

export const validContactFormDataLongName: ContactFormData = {
  name: 'Alexander Christopher Montgomery III',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'Test message with long name field.',
};

// ── Invalid Email Formats ──────────────────────────
export const invalidEmailNoAt: ContactFormData = {
  name: 'Test User',
  email: 'testemail.com',
  subject: 'Test Subject',
  message: 'Email without @ symbol',
};

export const invalidEmailNoExtension: ContactFormData = {
  name: 'Test User',
  email: 'test@domain',
  subject: 'Test Subject',
  message: 'Email without domain extension',
};

export const invalidEmailSpaces: ContactFormData = {
  name: 'Test User',
  email: 'test @example.com',
  subject: 'Test Subject',
  message: 'Email with spaces in address',
};

export const invalidEmailDoubleAt: ContactFormData = {
  name: 'Test User',
  email: 'test@@example.com',
  subject: 'Test Subject',
  message: 'Email with multiple @ symbols',
};

export const validEmailFormats = [
  'simple@example.com',
  'firstname.lastname@example.com',
  'user+tag@example.co.uk',
  'test123@example.com',
];

// ── Empty/Null Data ─────────────────────────
export const emptyContactForm: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export const onlyNameFilled: ContactFormData = {
  name: 'Test User',
  email: '',
  subject: '',
  message: '',
};

export const onlyEmailFilled: ContactFormData = {
  name: '',
  email: 'test@example.com',
  subject: '',
  message: '',
};

export const onlySubjectFilled: ContactFormData = {
  name: '',
  email: '',
  subject: 'Test Subject',
  message: '',
};

export const onlyMessageFilled: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: 'Test message',
};

// ── Special Characters / Edge Cases ────────────────
export const nameWithSpecialChars: ContactFormData = {
  name: "O'Brien-Smith & Co.",
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'Test message',
};

export const namesWithNumbers: ContactFormData = {
  name: 'User123',
  email: 'test123@example.com',
  subject: 'Test123',
  message: 'Message with 123 numbers',
};

export const longTextData: ContactFormData = {
  name: 'A'.repeat(100),
  email: 'test@example.com',
  subject: 'S'.repeat(100),
  message: 'M'.repeat(500),
};

export const veryLongNameData: ContactFormData = {
  name: 'Very Long Name That Exceeds Normal Length ' + 'A'.repeat(150),
  email: 'test@example.com',
  subject: 'Test',
  message: 'Long name test',
};

export const internationalCharacters: ContactFormData = {
  name: 'José García',
  email: 'jose@example.com',
  subject: 'Über Test Café',
  message: 'Mensaje con diacríticos y símbolos: ñ, é, ü',
};

export const specialCharactersInSubject: ContactFormData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test @#$%^&*() Subject',
  message: 'Message with special characters in subject',
};
