import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';

const amlCtfSchema = JSON.parse(
  fs.readFileSync('./schemas/json/AMLCTFCredential.json', 'utf-8')
);

const dlSchema = JSON.parse(
  fs.readFileSync('./schemas/json/DriversLicenceCredential.json', 'utf-8')
);

const nationalIdSchema = JSON.parse(
  fs.readFileSync('./schemas/json/NationalIdCredential.json', 'utf-8')
);

const passportSchema = JSON.parse(
  fs.readFileSync('./schemas/json/PassportCredential.json', 'utf-8')
);

const yyyymmdd = function (date: Date) {
  var mm = date.getMonth() + 1;
  var dd = date.getDate();

  return parseInt(
    [
      date.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
    ].join('')
  );
};

function generateAMLCTFCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(amlCtfSchema) as any;

  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/AMLCTFCredential.jsonld';

  data.credentialSubject.id = did;
  data.credentialSubject.amlCheckStatus = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.pepStatus = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.sanctionsCheck = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.adverseMediaStatus = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.monitoringStatus = faker.helpers.arrayElement([
    'active',
    'inactive',
  ]);

  if (callback) {
    callback(data);
  }

  return data;
}

function generateDriversLicenceCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(dlSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/DriversLicence.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'DriversLicenceCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/DriversLicenceCredential.json',
    type: 'JsonSchemaValidator2018',
  };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
  };
  data.subjectPosition = faker.helpers.arrayElement(['none', 'index', 'value']);
  data.merklizationRootPosition = faker.helpers.arrayElement([
    'none',
    'index',
    'value',
  ]);
  data.revNonce = faker.number.int();
  data.version = faker.number.int();
  data.updatable = faker.datatype.boolean();

  data.credentialSubject = {
    id: did,
    name: faker.person.fullName(),
    licenceNumber: faker.string.uuid(),
    stateOfIssuance: faker.location.state(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    customerReference: faker.string.uuid(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

function generateNationalIdCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(nationalIdSchema) as any;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/NationalId.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'NationalIdCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/NationalIdCredential.json',
    type: 'JsonSchemaValidator2018',
  };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
  };
  data.subjectPosition = faker.helpers.arrayElement(['none', 'index', 'value']);
  data.merklizationRootPosition = faker.helpers.arrayElement([
    'none',
    'index',
    'value',
  ]);
  data.revNonce = faker.number.int;
  data.version = faker.number.int();
  data.updatable = faker.datatype.boolean();

  data.credentialSubject = {
    id: faker.internet.url(),
    name: faker.person.fullName(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    nationalIDNumber: faker.string.uuid(),
    country: faker.location.countryCode(),
    customerReference: faker.string.uuid(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

function generatePassportCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(passportSchema) as any;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/Passport.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'PassportCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/PassportCredential.json',
    type: 'JsonSchemaValidator2018',
  };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
  };
  data.subjectPosition = faker.helpers.arrayElement(['none', 'index', 'value']);
  data.merklizationRootPosition = faker.helpers.arrayElement([
    'none',
    'index',
    'value',
  ]);
  data.revNonce = faker.number.int;
  data.version = faker.number.int();
  data.updatable = faker.datatype.boolean();

  data.credentialSubject = {
    id: faker.internet.url(),
    name: faker.person.fullName(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    passportNumber: faker.string.uuid(),
    nationality: faker.location.country(),
    customerReference: faker.string.uuid(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

const amlCtfTestScenarios = [
  {
    name: 'Valid AMLCTFCredential',
    data: generateAMLCTFCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateAMLCTFCredential((data) => {
      delete data.credentialSubject.amlCheckStatus;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extra Undefined Field',
  //   data: generateAMLCTFCredential((data) => {
  //     data.credentialSubject.unknownField = 'randomValue';
  //   }),
  //   expectedValid: true,
  // },
  {
    name: 'Wrong Data Type',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = 12345;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generateAMLCTFCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false, 
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generateAMLCTFCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generateAMLCTFCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid URL in id',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.id = 'not_a_url';
    }),
    expectedValid: false,
  },
  {
    name: 'Extreme Values',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = 'a'.repeat(1000);
    }),
    expectedValid: false,
  },
  {
    name: 'Unusual Characters',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = '💥🔥🚀';
    }),
    expectedValid: false,
  },
  {
    name: 'Empty Fields',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Array Instead of String',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = ['pass', 'fail'];
    }),
    expectedValid: false,
  },
  {
    name: 'Incorrect Enum Value',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = 'maybe';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid IRI Reference',
  //   data: generateAMLCTFCredential((data) => {
  //     data['aml-vocab'] = 'invalid-iri';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Injection Attack (XSS)',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = "<script>alert('XSS')</script>";
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid @type',
  //   data: generateAMLCTFCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generateAMLCTFCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = ' pass ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  }
];

const dLTestScenarios = [
  {
    name: 'Valid DriversLicenceCredential',
    data: generateDriversLicenceCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateDriversLicenceCredential((data) => {
      delete data.credentialSubject.licenceNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generateDriversLicenceCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generateDriversLicenceCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generateDriversLicenceCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid URL in id',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.id = 'not_a_url';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extreme Values',
  //   data: generateDriversLicenceCredential((data) => {
  //     data.credentialSubject.licenceNumber = 'X'.repeat(1000);
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Null Values',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Incorrect Enum Value',
    data: generateDriversLicenceCredential((data) => {
      data.subjectPosition = 'maybe';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Injection Attack (XSS)',
  //   data: generateDriversLicenceCredential((data) => {
  //     data.credentialSubject.name = "<script>alert('XSS')</script>";
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid @type',
  //   data: generateDriversLicenceCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generateDriversLicenceCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = ' NSW ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.licenceNumber: leading spaces',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.licenceNumber = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.licenceNumber: trailing spaces',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.licenceNumber = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.licenceNumber: empty string',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.licenceNumber = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.licenceNumber: spaces in between',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.licenceNumber = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.stateOfIssuance: spaces in between',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = "Martha's vineyard";
    }),
    expectedValid: false,
  },{
    name: 'Invalid credentialSubject.stateOfIssuance: empty string',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = "";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.stateOfIssuance: trailing space',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = "CA ";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.stateOfIssuance: leading space',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = " California";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.stateOfIssuance: hyphen not allowed',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = "New-York";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.stateOfIssuance: numbers not allowed',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.stateOfIssuance = "1234";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.birthDate = 10101;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too long',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.birthDate = 199901011;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid birthDate: Invalid date (Feb 30)',
  //   data: generateDriversLicenceCredential((data) => {
  //     data.credentialSubject.birthDate = 20240230;
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid birthDate: MMDDYYYY instead of YYYYMMDD',
  //   data: generateDriversLicenceCredential((data) => {
  //     data.credentialSubject.birthDate = 12022024;
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress = "0x123";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress = "0xGHIJKL7890abcdef1234567890abcdef12345678";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress = "1234567890abcdef1234567890abcdef12345678";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress = "0XABCDEF1234567890ABCDEF1234567890ABCDEF12";
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress = "0xAbCdEf1234567890ABCDEF1234567890abcdef12";
    }),
    expectedValid: true,
  },
];

const nationalIdTestScenarios = [
  {
    name: 'Valid NationalIdCredential',
    data: generateNationalIdCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateNationalIdCredential((data) => {
      delete data.credentialSubject.nationalIDNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generateNationalIdCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generateNationalIdCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generateNationalIdCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extreme Values',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.nationalIDNumber = 'X'.repeat(1000);
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid URL in id',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.id = 'invalid_url';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Unusual Characters',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.name = '💥🔥🚀';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Empty Fields',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.name = '';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Null Values',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = null;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Injection Attack (XSS)',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.name = "<script>alert('XSS')</script>";
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid @type',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generateNationalIdCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Leading/Trailing Spaces',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.country = ' USA ';
  //   }),
  //   expectedValid: false,
  // },
];

const passportTestScenarios = [
  {
    name: 'Valid PassportCredential',
    data: generatePassportCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generatePassportCredential((data) => {
      delete data.credentialSubject.passportNumber;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extra Undefined Field',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.unknownField = 'randomValue';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Wrong Data Type',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generatePassportCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generatePassportCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generatePassportCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid URL in id',
    data: generatePassportCredential((data) => {
      data.credentialSubject.id = 'invalid_url';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extreme Values',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.passportNumber = 'X'.repeat(1000);
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Unusual Characters',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.name = '💥🔥🚀';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Empty Fields',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.name = '';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Null Values',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = null;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Injection Attack (XSS)',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.name = "<script>alert('XSS')</script>";
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid @type',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generatePassportCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Leading/Trailing Spaces',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.nationality = ' USA ';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid date type',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = faker.date.recent({ days: 1 });
    }),
    expectedValid: false,
  },
];

const testObject = {
  AMLCTFCredential: amlCtfTestScenarios,
  DriversLicenceCredential: dLTestScenarios,
  NationalIdCredential: nationalIdTestScenarios,
  PassportCredential: passportTestScenarios,
};

if (!fs.existsSync('./test/data')) {
  fs.mkdirSync('./test/data');
}

for (const [key, arrayOfTestScenarios] of Object.entries(testObject)) {
  const filePath = path.join('./test/data', `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(arrayOfTestScenarios, null, 2));
  console.log(`Written: ${filePath}`);
}

console.log('Test scenarios generated successfully.');
