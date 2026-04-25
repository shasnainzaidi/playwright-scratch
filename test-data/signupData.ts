/**
 * Test Data for SCRUM-4: User Registration
 * Used by automated tests in tests/stage/auth/signup.spec.ts
 */

export interface SignupData {
  name: string;
  email: string;
}

export interface AccountDetailsData {
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/**
 * Valid test data for successful signup flows
 */
export const validSignupData = {
  standard: {
    signup: {
      name: 'John Automation Test',
      email: `autotest.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'SecurePass123!',
      day: '15',
      month: '3',
      year: '1990',
      firstName: 'John',
      lastName: 'Automation',
      address: '123 Test Street',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      zipcode: '10001',
      mobile: '+12125551234'
    } as AccountDetailsData
  },

  specialCharacters: {
    signup: {
      name: "Mary O'Brien-Smith Jr.",
      email: `special.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'TestPass456!',
      day: '22',
      month: '6',
      year: '1985',
      firstName: 'Mary',
      lastName: "O'Brien-Smith",
      address: '456 Special Ave',
      country: 'United Kingdom',
      state: 'England',
      city: 'London',
      zipcode: 'SW1A 1AA',
      mobile: '+442071838750'
    } as AccountDetailsData
  },

  longName: {
    signup: {
      name: 'Alexander Christopher Montgomery III Esquire',
      email: `longname.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'LongTest123!',
      day: '1',
      month: '1',
      year: '1980',
      firstName: 'Alexander Christopher',
      lastName: 'Montgomery III',
      address: '789 Long Name Lane',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      zipcode: 'M5H 2N2',
      mobile: '+14165551234'
    } as AccountDetailsData
  },

  redirect: {
    signup: {
      name: 'Redirect Test User',
      email: `redirect.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'RedirectTest123!',
      day: '10',
      month: '5',
      year: '1992',
      firstName: 'Redirect',
      lastName: 'Test',
      address: '100 Redirect Way',
      country: 'Australia',
      state: 'Victoria',
      city: 'Melbourne',
      zipcode: '3000',
      mobile: '+61261881234'
    } as AccountDetailsData
  },

  successMessage: {
    signup: {
      name: 'Success Message Test',
      email: `success.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'SuccessMsg123!',
      day: '20',
      month: '8',
      year: '1995',
      firstName: 'Success',
      lastName: 'Test',
      address: '200 Success Road',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      zipcode: '560001',
      mobile: '+918001801234'
    } as AccountDetailsData
  },

  loginTest: {
    signup: {
      name: 'Login Test User',
      email: `login.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'LoginTest123!',
      day: '5',
      month: '12',
      year: '1988',
      firstName: 'Login',
      lastName: 'Test',
      address: '300 Login Lane',
      country: 'Germany',
      state: 'Bayern',
      city: 'Munich',
      zipcode: '80001',
      mobile: '+498921551234'
    } as AccountDetailsData
  },

  loginRedirect: {
    signup: {
      name: 'Login Redirect Test',
      email: `loginredir.${new Date().getTime()}@test.com`
    } as SignupData,
    account: {
      password: 'LoginRedir123!',
      day: '18',
      month: '7',
      year: '1993',
      firstName: 'LoginRedir',
      lastName: 'Test',
      address: '400 Login Street',
      country: 'France',
      state: 'Île-de-France',
      city: 'Paris',
      zipcode: '75001',
      mobile: '+33142741234'
    } as AccountDetailsData
  }
};

/**
 * Invalid email formats for negative testing
 */
export const invalidEmailFormats = [
  'notanemail',
  'invalidemail@',
  '@domain.com',
  'user name@test.com',
  'test@nodomain',
  'user@',
  'plainaddress',
  'user@localhost',
  'user@.com'
];

/**
 * Security test data
 */
export const securityTestData = {
  xssAttempt: '<script>alert("xss")</script>',
  xssImg: '<img src=x onerror=alert("xss")>',
  sqlInjection: "test' OR '1'='1",
  sqlComment: "test' --",
  scriptTag: '<script>alert("test")</script>'
};

/**
 * Duplicate email (existing account)
 */
export const duplicateEmail = process.env.AE_EMAIL || 'hasnain.contour@gmail.com';

/**
 * Edge case test data
 */
export const edgeCaseData = {
  singleCharName: 'A',
  singleCharEmail: `a${new Date().getTime()}@a.com`,
  veryLongName: 'A'.repeat(250),
  unicodeCharacters: 'José María García López 北京 مرحبا',
  numbersInName: '123 Test Name 456',
  allSpecialChars: '!@#$%^&*()'
};

/**
 * Country/State data for account creation
 */
export const countryData = {
  unitedStates: {
    country: 'United States',
    states: ['New York', 'California', 'Texas', 'Florida']
  },
  unitedKingdom: {
    country: 'United Kingdom',
    states: ['England', 'Scotland', 'Wales']
  },
  canada: {
    country: 'Canada',
    states: ['Ontario', 'Quebec', 'British Columbia']
  },
  australia: {
    country: 'Australia',
    states: ['Victoria', 'New South Wales', 'Queensland']
  },
  india: {
    country: 'India',
    states: ['Karnataka', 'Maharashtra', 'Delhi']
  },
  germany: {
    country: 'Germany',
    states: ['Bayern', 'Berlin', 'Hamburg']
  },
  france: {
    country: 'France',
    states: ['Île-de-France', 'Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur']
  }
};
