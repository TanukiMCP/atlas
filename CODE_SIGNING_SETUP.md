# TanukiMCP Atlas - Code Signing Setup Guide

## Overview

This guide covers setting up code signing certificates for TanukiMCP Atlas.

## Windows Code Signing (Required for Distribution)

### Certificate Requirements (2025)

Since June 1, 2023, Microsoft requires Extended Validation (EV) Code Signing Certificates.

**EV Certificate Requirements:**
- Must be stored on FIPS 140 Level 2 hardware
- Cannot be downloaded as simple .pfx files
- Provides immediate SmartScreen trust
- Cost: $300-700/year

### Recommended Certificate Providers

1. **DigiCert KeyLocker (Cloud HSM)** - Recommended for CI/CD
   - Cloud-based signing service
   - No physical hardware required
   - Perfect for GitHub Actions
   - Cost: ~$400-600/year

2. **Azure Trusted Signing** - Microsoft's solution
   - Integrated with Azure
   - Good for Microsoft ecosystem
   - Cost: ~$300-500/year

3. **Physical USB Tokens**
   - SafeNet eToken 5110 CC/FIPS
   - Requires physical access for signing
   - Not suitable for automated CI/CD

### Setup Instructions

#### Option 1: DigiCert KeyLocker (Recommended)

1. **Purchase Certificate:**
   - Visit DigiCert website
   - Select "EV Code Signing Certificate with KeyLocker"
   - Complete organization validation (3-5 business days)

2. **Configure Environment Variables:**
   Add to GitHub Secrets:
   - DIGICERT_API_TOKEN
   - DIGICERT_CERTIFICATE_ID
   - DIGICERT_CLIENT_CERT
   - DIGICERT_CLIENT_CERT_PASSWORD