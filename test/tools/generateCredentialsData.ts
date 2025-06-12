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

const kyc1by1schema = JSON.parse(
  fs.readFileSync('./schemas/json/KYC1By1Credential.json', 'utf-8')
);

const nationalIdSchema = JSON.parse(
  fs.readFileSync('./schemas/json/NationalIdCredential.json', 'utf-8')
);

const passportSchema = JSON.parse(
  fs.readFileSync('./schemas/json/PassportCredential.json', 'utf-8')
);

const optimav1Schema = JSON.parse(
  fs.readFileSync('./schemas/json/OptimaV1Credential.json', 'utf-8')
);

const proofOfAddressSchema = JSON.parse(
  fs.readFileSync('./schemas/json/ProofOfAddressCredential.json', 'utf-8')
);

const wholesaleInvestorSchema = JSON.parse(
  fs.readFileSync('./schemas/json/WholesaleInvestorCredential.json', 'utf-8')
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
    country: faker.location.state(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

function generateKYC1By1Credential(callback?: (data: any) => void): any {
  const data = jsf.generate(kyc1by1schema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/KYC1By1Credential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'KYC1By1Credential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/KYC1By1Credential.json',
    type: 'JsonSchemaValidator2018',
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
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    referenceId: faker.string.uuid(),
    country: faker.location.state(),
    documentType: faker.helpers
      .slugify(faker.word.words({ count: { min: 1, max: 2 } }))
      .replace(/-/g, '_')
      .toUpperCase(),
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
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

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
    id: did,
    name: faker.person.fullName(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    nationalIDNumber: faker.string.uuid(),
    country: faker.location.country(),
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
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

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
    id: did,
    name: faker.person.fullName(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    passportNumber: faker.string.alphanumeric({ length: { min: 6, max: 7 } }),
    nationality: faker.location.country(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

function generateOptimaV1Credential(callback?: (data: any) => void): any {
  const data = jsf.generate(optimav1Schema) as any;
  data['@context'] = [
    'https://www.w3.org/ns/credentials/v2',
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/OptimaV1Credential.jsonld',
  ];
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'OptimaV1Credential'];
  data.validFrom = faker.date.past().toISOString();
  data.validUntil = faker.date.future().toISOString();
  data.issuer = faker.internet.url();
  data.credentialSubject = {
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

function generateProofOfAddressCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(proofOfAddressSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/ProofOfAddressCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'ProofOfAddressCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/ProofOfAddressCredential.json',
    type: 'JsonSchemaValidator2018',
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
    street: faker.location.street(),
    city: faker.location.city(),
    postCode: faker.location.zipCode('#####'),
    country: faker.location.countryCode('alpha-3'),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

function generateWholesaleInvestorCredentials(callback?: (data: any) => void): any {
  const data = jsf.generate(wholesaleInvestorSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  const bytes = faker.number.int({ min: 1 * 1024 * 1024, max: 2 * 1024 * 1024 });
  const contentSize = (bytes / (1024 * 1024)).toFixed(1) + 'MB';

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/WholesaleInvestor.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'WholesaleInvestorCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/KYC1By1Credential.json',
    type: 'JsonSchemaValidator2018',
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
    certificateNumber: faker.string.uuid(),
    jurisdiction: faker.location.country(),
    grossIncome: faker.number.int({ min: 50000, max: 1000000 }),
    netAssets: faker.number.int({ min: 50000, max: 1000000 }),
    validUntil: yyyymmdd(faker.date.soon({ days: 5 })),
    accountantDetails: {
      name: faker.person.fullName(),
      certifyingBody: faker.company.name(),
      licenceNumber: faker.string.uuid(),
    },
    attachments: [
      {
        type: 'Document',
        contentUrl: faker.internet.url(),
        contentSize,
        contentType: 'application/pdf',
        name: faker.system.fileName(),
      }
    ]
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
  },
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
      data.credentialSubject.country = null;
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
      data.credentialSubject.country = ' NSW ';
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
    name: 'Invalid credentialSubject.country: spaces in between',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.country = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: empty string',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.country = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: trailing space',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.country = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: leading space',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.country = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: hyphen not allowed',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.country = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: numbers not allowed',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.country = '1234';
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
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateDriversLicenceCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
];

const kyc1By1TestScenarios = [
  {
    name: 'Valid KYC1By1Credential',
    data: generateKYC1By1Credential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateKYC1By1Credential((data) => {
      delete data.credentialSubject.referenceId;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateKYC1By1Credential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid value in id',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.id = 'invalid_value';
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing id',
    data: generateKYC1By1Credential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = ' USA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: leading spaces',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.referenceId = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: trailing spaces',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.referenceId = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: empty string',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.referenceId = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: spaces in between',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.referenceId = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: spaces in between',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: empty string',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: trailing space',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: leading space',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: hyphen not allowed',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: numbers not allowed',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.country = '1234';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.birthDate = -2240524800;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
  {
    name: 'Invalid credentialSubject.documentType: spaces in between',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.documentType = 'ID CARD';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: empty string',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.documentType = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: trailing space',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.documentType = 'PASSPORT ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: leading space',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.documentType = ' PASSPORT';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: hyphen not allowed',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.documentType = 'ID-CARD';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: numbers not allowed',
    data: generateKYC1By1Credential((data) => {
      data.credentialSubject.documentType = '1234';
    }),
    expectedValid: false,
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
  {
    name: 'Leading/Trailing Spaces',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = ' USA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: leading spaces',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: trailing spaces',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: empty string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: spaces in between',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: spaces in between',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: empty string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: trailing space',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: leading space',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: hyphen not allowed',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: numbers not allowed',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = '1234';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.birthDate = 10101;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too long',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.birthDate = 199901011;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid birthDate: Invalid date (Feb 30)',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.birthDate = 20240230;
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid birthDate: MMDDYYYY instead of YYYYMMDD',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.birthDate = 12022024;
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
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
  {
    name: 'Invalid date type',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = faker.date.recent({ days: 1 });
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = ' USA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Empty Fields',
    data: generatePassportCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generatePassportCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: leading spaces',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: trailing spaces',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: empty string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: spaces in between',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: Too short (5 characters)',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = 'ABC12';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: Too long (10 characters)',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = '1234567890';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: Contains special characters',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = '!@#4567';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: spaces in between',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: empty string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: trailing space',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: leading space',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: hyphen not allowed',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: numbers not allowed',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = '1234';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = 10101;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too long',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = 199901011;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid birthDate: Invalid date (Feb 30)',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.birthDate = 20240230;
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid birthDate: MMDDYYYY instead of YYYYMMDD',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.birthDate = 12022024;
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid publicAddress: Too short',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
];

const optimaV1TestScenarios = [
  {
    name: 'Valid OptimaV1Credential',
    data: generateOptimaV1Credential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateOptimaV1Credential((data) => {
      delete data.credentialSubject.publicAddress;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress = 'not_an__ethereum_address';
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateOptimaV1Credential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
];

const proofOfAddressTestScenarios = [
  {
    name: 'Valid ProofOfAddressCredential',
    data: generateProofOfAddressCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field: country',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.country;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: city',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.city;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: street',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.street;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: postCode',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.postCode;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: postCode as number',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.postCode = 12345;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: city as number',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.city = 9876;
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateProofOfAddressCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid postCode: empty string',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.postCode = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid postCode: alphanumeric',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.postCode = '123AB';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid country: whitespace only',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.country = '   ';
    }),
    expectedValid: false,
  },
];

const wholesaleInvestorTestScenarios = [
  {
    name: 'Valid WholesaleInvestorCredential',
    data: generateWholesaleInvestorCredentials(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field: id',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: certificateNumber',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.certificateNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: jurisdiction',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.jurisdiction;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: grossIncome',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.grossIncome;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: netAssets',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.netAssets;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: validUntil',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.validUntil;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantDetails',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantDetails;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantDetails.name',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantDetails.name;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantDetails.certifyingBody',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantDetails.certifyingBody;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantDetails.licenseNumber',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantDetails.licenseNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateWholesaleInvestorCredentials((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid country: whitespace only',
    data: generateWholesaleInvestorCredentials((data) => {
      data.credentialSubject.country = '   ';
    }),
    expectedValid: false,
  },
];

const testObject = {
  AMLCTFCredential: amlCtfTestScenarios,
  DriversLicenceCredential: dLTestScenarios,
  NationalIdCredential: nationalIdTestScenarios,
  KYC1By1Credential: kyc1By1TestScenarios,
  PassportCredential: passportTestScenarios,
  OptimaV1Credential: optimaV1TestScenarios,
  ProofOfAddressCredential: proofOfAddressTestScenarios,
  WholesaleInvestorCredential: wholesaleInvestorTestScenarios,
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
