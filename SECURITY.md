# EvoGuard Security Policy

## 🛡️ Supported versions

EvoGuard is currently in the MVP / design-partner pilot phase. Only the latest commit on `main` is supported with security fixes.

| Version | Supported |
|---|---|
| `main` (latest) | ✅ |
| Tagged releases | ✅ (when available) |
| Older commits | ❌ |

## 📨 Reporting a vulnerability

We take security vulnerabilities seriously. Please follow this process:

### For critical / actively-exploitable vulnerabilities

**Do NOT file a public issue.** Instead, email **security@evoguard.app** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Affected components
4. Proof of concept (encrypted if sensitive — use our PGP key below)

### For lower-severity issues

Use the [Security Report issue template](https://github.com/modarresi1913/Evoguard/issues/new?template=security-report.yml). This is appropriate for:

- Defense-in-depth suggestions
- Hardening ideas
- Theoretical concerns
- Issues already documented in our [working threat model](./README.md#-security--privacy)

## ⏱️ Response timeline

| Step | Target SLA |
|---|---|
| Acknowledge receipt | 24 hours |
| Initial assessment | 72 hours |
| Triage & severity assignment | 5 business days |
| Fix or mitigation plan | 30 days (high), 90 days (medium), 180 days (low) |
| Coordinated public disclosure | 90 days after fix released |

## 🔐 PGP key

For encrypted vulnerability reports, use the following PGP key:

```text
EvoGuard Security <security@evoguard.app>
Fingerprint: 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
```

> **Note:** The actual PGP key will be published before the production launch.

## 🏆 Recognition

We acknowledge security researchers who responsibly disclose vulnerabilities:

- **Hall of Fame** — listed on our security page (with permission)
- **Swag** — EvoGuard sticker pack + t-shirt for confirmed high-severity reports
- **Bounty** — monetary rewards for critical vulnerabilities in production (after launch)

## 📋 Scope

### In scope

- The EvoGuard demo dashboard (`github.com/modarresi1913/Evoguard`)
- Production backend components (when available)
- The GitHub App integration
- The web dashboard
- API endpoints
- Authentication & authorization
- Tenant isolation
- Encryption implementation

### Out of scope

- Vulnerabilities in third-party dependencies (report to upstream maintainers)
- Social engineering attacks against EvoGuard employees
- Physical attacks against EvoGuard infrastructure
- DoS attacks against the production service (use responsible disclosure)
- Issues requiring physical access to a user's device
- Bugs in unsupported versions

## 🛠️ Security measures we already have

See the [Security & Privacy section of the README](./README.md#-security--privacy) for our published working threat model and security policies.

## 📜 Coordinated disclosure

We follow [Google's Project Zero disclosure guidelines](https://googleprojectzero.blogspot.com/p/vulnerability-disclosure-faq.html):

- 90-day disclosure deadline
- Automatic publication of the vulnerability report after the deadline
- Extensions granted on a case-by-case basis

## 📞 Contact

- **Security email**: security@evoguard.app
- **General inquiries**: hello@evoguard.app
- **GitHub Issues**: [github.com/modarresi1913/Evoguard/issues](https://github.com/modarresi1913/Evoguard/issues)
