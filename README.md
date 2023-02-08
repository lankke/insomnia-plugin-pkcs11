# insomnia-plugin-pkcs11

A plugin to allow Insomnia users to access their certificates and public keys from HSM USB security tokens

## Prerequisites

1. Download and install the OpenSC PKCS11 library [OpenSC PKCS11](https://github.com/OpenSC/OpenSC/wiki)
   - the *pkcs11-tool* is included with the library
   - check the *Quick Start* guide for installation instructions
2. Install [SoftHSM](https://wiki.opendnssec.org/display/SoftHSMDOCS/SoftHSM+Documentation+v2)
   - Allows the user to create PKCS11 objects without a USB HSM
3. Generate a keypair (SKIP if you are using a USB HSM)
   - Note you have to provide a **pin number** and **label**
   - `pkcs11-tool --module /usr/local/lib/softhsm/libsofthsm2.so --login -p <your-pin-here> --keypairgen  --key-type EC:secp521r1  --slot-index 0 --label <your-label-here> `
4.  Run the tests
    `npm run test`
5.  


## Changes
0.0.4 - Add tests and sign function via pkcs11-tool

0.0.3 - Add typescript interfaces for insomnia plugin

0.0.2 - Convert to Typescript for development purposes
  - Added tsconfig file
  - Separate code to its own folder

0.0.1 - Skeleton plugin added with the following features:
  - pkcs11js dependency
  - example hook (randomInteger) added to app.js as a placeholder
  - Plugin metadata added
  - Tested in Insomnia!