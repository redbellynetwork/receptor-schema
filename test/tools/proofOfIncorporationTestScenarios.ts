import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';

const proofOfIncorporationSchema = JSON.parse(
  fs.readFileSync('./schemas/json/ProofOfIncorporationCredential.json', 'utf-8')
);

function generateProofOfIncorporationCredential(
  callback?: (data: any) => void
): any {
  const data = jsf.generate(proofOfIncorporationSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/ProofOfIncorporationCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'ProofOfIncorporationCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/ProofOfIncorporationCredential.json',
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

  // Generate valid business data
  const legalForms = [
    'Limited Liability Company',
    'Corporation',
    'Public Limited Company',
    'Private Limited Company',
    'Societe a Responsabilite Limitee',
    'Gesellschaft mit beschrankter Haftung',
    'Sociedad Limitada',
    'Spolka z ograniczona odpowiedzialnoscia',
  ];

  data.credentialSubject = {
    id: did,
    legalName: faker.company.name(),
    legalAddress: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
    registrationNumber: faker.string.alphanumeric({ length: { min: 6, max: 12 } }),
    jurisdiction: faker.location.country(),
    legalForm: faker.helpers.arrayElement(legalForms),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const proofOfIncorporationTestScenarios = [
  {
    name: 'Valid Proof Of Incorporation',
    data: generateProofOfIncorporationCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field: legalName',
    data: generateProofOfIncorporationCredential((data) => {
      delete data.credentialSubject.legalName;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: legalAddress',
    data: generateProofOfIncorporationCredential((data) => {
      delete data.credentialSubject.legalAddress;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: registrationNumber',
    data: generateProofOfIncorporationCredential((data) => {
      delete data.credentialSubject.registrationNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: jurisdiction',
    data: generateProofOfIncorporationCredential((data) => {
      delete data.credentialSubject.jurisdiction;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: legalForm',
    data: generateProofOfIncorporationCredential((data) => {
      delete data.credentialSubject.legalForm;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: id',
    data: generateProofOfIncorporationCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: legalName as number',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalName = 12345;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: registrationNumber as number',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.registrationNumber = 12345;
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateProofOfIncorporationCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid URL',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.id = 'invalid_url';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalName: empty string',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalName = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalName: leading spaces',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalName = ' ' + data.credentialSubject.legalName;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalName: trailing spaces',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalName = data.credentialSubject.legalName + ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalAddress: empty string',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalAddress = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalAddress: leading spaces',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalAddress = ' ' + data.credentialSubject.legalAddress;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalAddress: trailing spaces',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalAddress = data.credentialSubject.legalAddress + ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.registrationNumber: empty string',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.registrationNumber = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.registrationNumber: contains spaces',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.registrationNumber = 'ABC 123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.registrationNumber: contains special characters',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.registrationNumber = 'ABC-123@456';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.jurisdiction: empty string',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.jurisdiction = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.jurisdiction: leading space',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.jurisdiction = ' ' + data.credentialSubject.jurisdiction;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.jurisdiction: trailing space',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.jurisdiction = data.credentialSubject.jurisdiction + ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.jurisdiction: contains numbers',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.jurisdiction = 'United States123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalForm: empty string',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalForm = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalForm: leading space',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalForm = ' ' + data.credentialSubject.legalForm;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.legalForm: trailing space',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalForm = data.credentialSubject.legalForm + ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid legalForm with special characters',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalForm = 'Etaireia Periorismenis Efthynis (E.P.E.) Ltd';
    }),
    expectedValid: true,
  },
  {
    name: 'Valid legalForm with ampersand',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalForm = 'Smith & Associates, LLC';
    }),
    expectedValid: true,
  },
  {
    name: 'Valid legalForm with apostrophe',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.legalForm = "O'Brien's Corporation";
    }),
    expectedValid: true,
  },
  {
    name: 'Null Values',
    data: generateProofOfIncorporationCredential((data) => {
      data.credentialSubject.jurisdiction = null;
    }),
    expectedValid: false,
  },
];
