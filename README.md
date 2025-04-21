# Blockchain-Based Retail Staff Training Compliance

A decentralized platform for transparent management and verification of retail staff training requirements, completions, and certifications through smart contracts.

## Overview

This system leverages blockchain technology to create a transparent and immutable record of retail staff training compliance. By implementing interconnected smart contracts, the platform provides retailers with a verifiable system for tracking training requirements, course completions, and regulatory certifications across multiple locations and jurisdictions.

## Core Components

### Store Verification Contract
- Validates legitimate retail locations
- Maintains store details, location information, and operational status
- Records store management and training coordinator details
- Creates a verifiable digital identity for each retail location

### Training Requirement Contract
- Defines mandatory employee education
- Specifies required training modules based on role, location, and regulatory needs
- Manages training version control and expiration policies
- Enforces compliance with changing regulations and company policies

### Completion Tracking Contract
- Records finished training modules
- Maintains timestamped proof of employee training activities
- Tracks assessment scores and completion status
- Enables analytics on training effectiveness and engagement

### Certification Contract
- Issues verification of regulatory compliance
- Generates tamper-proof certification credentials
- Manages certification expiration and renewal requirements
- Provides verification portal for auditors and regulatory bodies

## Getting Started

### Prerequisites
- Ethereum wallet (MetaMask recommended)
- Ethereum development environment (Truffle/Hardhat)
- Node.js (v16+)
- Web3.js or ethers.js

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/retail-training-blockchain.git
cd retail-training-blockchain
```

2. Install dependencies
```
npm install
```

3. Compile smart contracts
```
npx hardhat compile
```

4. Deploy to test network
```
npx hardhat run scripts/deploy.js --network <network-name>
```

## Usage Examples

### Register a Retail Location
```javascript
await storeContract.registerStore(
  "Downtown Flagship Store",
  "123 Main Street, Metro City",
  "Food & Beverage", // store category
  52, // employee count
  storeManagerWalletAddress,
  trainingCoordinatorWalletAddress
);
```

### Define Training Requirements
```javascript
await requirementContract.setRequirements(
  storeId,
  "Food Handler", // role
  [
    {
      courseId: "FOOD-SAFETY-101",
      description: "Basic Food Safety",
      requiredFrequency: "annual", // renewal frequency
      regulatoryBody: "State Health Department"
    },
    {
      courseId: "ALLERGY-AWARENESS",
      description: "Allergen Identification and Response",
      requiredFrequency: "biennial",
      regulatoryBody: "State Health Department"
    }
  ]
);
```

### Record Training Completion
```javascript
await completionContract.recordCompletion(
  employeeId,
  "FOOD-SAFETY-101", // courseId
  90, // score percentage
  Math.floor(Date.now() / 1000), // completion timestamp
  "2026-04-21", // expiration date
  trainerWalletAddress
);
```

### Issue Compliance Certification
```javascript
await certificationContract.issueCertification(
  storeId,
  "Food Safety Compliance",
  "All staff have completed required food safety training modules",
  Math.floor(Date.now() / 1000), // issuance timestamp
  Math.floor(Date.now() / 1000) + 31536000, // valid for 1 year
  complianceOfficerWalletAddress
);
```

## Benefits

- **Transparency**: Immutable record of training requirements and completions
- **Verification**: Easily verify staff certifications for regulatory audits
- **Efficiency**: Automate tracking and notifications for expiring certifications
- **Standardization**: Ensure consistent training across multiple locations
- **Accountability**: Clear record of responsibility for training compliance
- **Reduced Risk**: Minimize compliance violations and associated penalties

## Future Development

- Mobile application for employees to access and complete training
- QR code verification for quick certification checks
- Integration with learning management systems (LMS)
- Gamification elements to incentivize training completion
- Cross-chain compatibility for global retail operations
- AI-driven recommendations for training improvement

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
