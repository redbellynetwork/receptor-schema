import fs from 'fs';
import path from 'path';

import { dLTestScenarios } from './driverLicenseTestScenarios';
import { essentialTestScenarios } from './essentialIdTestScenarios';
import { comprehensiveTestScenarios } from './comprehensiveIdTestScenarios';
import { enhancedIdTestScenarios } from './enhancedIdTestScenarios';
import { nationalIdTestScenarios } from './nationalIdTestScenarios';
import { amlCtfTestScenarios } from './amlctfTestScenarios';
import { passportTestScenarios } from './passportTestScenarios';
import { optimaV1TestScenarios } from './optimaTestSecenarios';
import { proofOfAddressTestScenarios } from './poaTestScenarios';
import { wholesaleInvestorTestScenarios } from './wholesalesTestScenarios';

const testObject = {
  AMLCTFCredential: amlCtfTestScenarios,
  DriversLicenceCredential: dLTestScenarios,
  NationalIdCredential: nationalIdTestScenarios,
  EssentialIdCredential: essentialTestScenarios,
  ComprehensiveIdCredential: comprehensiveTestScenarios,
  EnhancedIdCredential: enhancedIdTestScenarios,
  PassportCredential: passportTestScenarios,
  OptimaV1Credential: optimaV1TestScenarios,
  ProofOfAddressCredential: proofOfAddressTestScenarios,
  AUSophisticatedWholesaleInvestorCredential: wholesaleInvestorTestScenarios,
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
