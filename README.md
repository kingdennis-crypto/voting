# Hyperledger Fabric Digital Voting System

## Description

This application demonstrates the implementation of a secure digital voting system leveraging the Hyperledger Fabric blockchain framework. Hyperledger Fabric provides a foundation for building our distributed ledger application, ensuring transparency, security, and tamper-resistance.

## Network Design Overview

The network design for this project is structured to reflect a simplified scenario, but in a real-world production setting, it can be made highly dynamic and adaptable to specific requirements.

### Channels and Organizations

In this version, we have configured two channels, each representing a separate election. Hyperledger Fabric's channel architecture allows for the isolation of data and transactions, ensuring that activities within one channel does not impact or interact with activities in another. This means that a vote cast in one channel remains entirely independent from the proceedings in another.

### Organizational Struture

The two organizations in this demonstration represent the polling stations. While in this test version they are denoted as `org1` and `org2`, in a live environment, these would correspons to actual physical polling stations such as those in Amsterdam or Rotterdam, and would be dynamically created and manages. Each organization represents a distinct entity responsible for managing and overseeing its respective polling station's activities.

### Peers as Voting Machines

Peers within Hyperledger Fabric are akin to individual voting machines within a polling station. They play a pivotal role in the network, facilitating the endorsement and validation of transactions. In this setup, each peer corresponds to a computer within a polling station. This architecture provides the flexibility to scale the system according to the number of computers available in each polling station.

## Scalability and Adaptability

One of the key strengths of Hyperledger Fabric is its ability to scale and adapt to varying requirements. As such, this system can easily accommodate additional channels, organizations, and peers as neede in order to cater to diverse election scenarios.

## Getting Started

Instructions on how to get your project set up and running

## Prerequisites

- Node.js
- NPM
- Docker
- Docker Compose
- Python

## Installation

Step-by-step guide on how to install the project:

1. Clone the repository

1. Navigate to the project directory

1. Run the following command:

```bash
# This will set all the variables that need to be used in the setup script.
./variables.sh
# This will install all the dependencies of the network and initialize it.
./setup.sh
```

## Usage

To start the API go to the API folder and run these command:

```bash
export FABRIC_PATH=$PWD

cd api
npm install
npm run start
```

To start the frontend run these commands:

```bash
cd frontend
npm install
npm run start
```

When first opening the frontend. You get the question to 'initialize data'. This is because for the voter contract we use ERC20. This can only be setup after initialisation. That is why the button asks the user to initialize. Otherwise it wouldn't work with the custom tokens.

After the alert you need to refresh the page to be able to fully access the application

After initialization you can access the admin pages. To access the admin pages, you need to login with these credentials:

- email: admin@votenet.com
- password: adminpw

## Routes

### Frontend

- `/vote`
- `/admin`
- `/admin/users`
- `/admin/users/:id`
- `/admin/votes`
- `/admin/parties`
- `/admin/parties/:id`
- `/admin/candidates/`
- `/admin/candidates/:id`
