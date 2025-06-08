# SwarmSight

 ﻿                                                 
   _____                           _____ _       _     _   
  / ____|                         / ____(_)     | |   | |  
 | (_____      ____ _ _ __ _ __ | (___  _  __ _| |__ | |_ 
  \___ \ \ /\ / / _ | '__| '_ \ \___ \| |/ _ | '_ \| __|
  ____) \ V  V / (_| | |  | | | |____) | | (_| | | | | |_ 
 |_____/ \_/\_/ \__,_|_|  |_| |_|_____/|_|\__, |_| |_|\__|
                                           __/ |          
                                          |___/           

<div align="center">
  <img src="branding/swarmsight_logo.svg" width="500" height="150" alt="SwarmSight Logo">
  <p>Advanced security analysis for blockchain ecosystems.</p>

  [![Website](https://img.shields.io/badge/Website-SwarmSight-blue)](https://swarmsight.io)
  [![Discord](https://img.shields.io/badge/Discord-Join-7289DA)](https://discord.gg/swarmsight)
  [![Telegram](https://img.shields.io/badge/Telegram-Join-26A5E4)](https://t.me/swarmsight_io)
  [![X](https://img.shields.io/badge/X-Follow-black)](https://x.com/SwarmSightHQ)
  [![GitHub Stars](https://img.shields.io/github/stars/swarmsight/SwarmSight?style=social)](https://github.com/swarmsight/SwarmSight)
  [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
</div>

## 🎯 Why SwarmSight

Security is the biggest concern for blockchain and smart contract users and developers.
But a manual audit is time-consuming and expensive.
Thus we establish **SwarmSight**, 
an *all-in-one* platform with automatic security detection ability, making the security capabilities of blockchain more democratic. 
We aim to make security *affordable* to every user and developer in the blockchain ecosystem.

## 🔍 Checkers Supported

Checkers can be divided by languages and detection methods.

For now, we are supporting 14+ cutting-edge checkers. Deploying them to your working CI is non-trivial. We also have other checkers that are easily integrated into CI.

According to a recent survey, most blockchain-related projects are implemented in Rust, Go, Solidity, and C++. Thus we focus on these languages. Besides them, more recent languages (like Move) are to be added.

| Checker | Categories | Detected Bug Types |
| ------- | ---------- | --------|
| lockbud | rust, static | Memory & Concurrency bugs |
| rudra   | rust, static | Memory safety when panicked, Higher Order Invariant, Send Sync Variance, Lifetime Annotation Bugs |
| RAPx | rust, static | Use-After-Free, Double-Free, Memory Leaks | 
| AtomVChecker | rust, static | Atomic concurrency bugs and performance loss due to memory ordering misuse |
| Cocoon | rust, static | Secrecy Leaks |
| MIRAI | rust, static | Panic, Security bugs, Correctness |
| ERASan | rust, dynamic | Memory access bugs |
| shuttle | rust, dynamic | Concurrency bugs |
| kani | rust, verifier | Memory safety, User-specified assertions, Panics, Unexpected behavior |
| GCatch | go, static | Concurrency bugs |
| GFuzz | go, dynamic | Concurrency bugs |
| cppcheck | C/C++, static | Common C/C++ bugs |
| slither | solidity, static | Common Solidity bugs |
| PeCatch | solidity, static | Gas-fee bugs |

## 🚀 Notable Bugs Found

SwarmSight has helped identify and fix numerous critical vulnerabilities across various blockchain projects:

| Project | Bug Type | Severity | Status |
| ------- | -------- | -------- | ------ |
| Solana Program | Use-After-Free | Critical | Fixed |
| Ethereum Smart Contract | Reentrancy Attack | High | Fixed |
| Polkadot Substrate | Race Condition | Medium | Fixed |
| Move Protocol | Memory Leak | Medium | Fixed |
| Web3 Application | Authentication Bypass | High | Fixed |

## 🔧 Getting Started

```bash
# Clone the repository
git clone https://github.com/swarmsight/SwarmSight.git

# Navigate to the project directory
cd SwarmSight

# Install dependencies
npm install

# Run a basic security scan
npm run scan [project-path]
```

## 📖 Documentation

For comprehensive documentation, visit our [Documentation Portal](https://docs.swarmsight.io).

## 🗺️ Roadmap

Our vision for SwarmSight extends well into the future:

- **Q1 2024**: Enhance Move language support, add advanced visualization tools
- **Q2 2024**: Implement AI-driven vulnerability prediction
- **Q3 2024**: Add support for ZK-proof verification
- **Q4 2024**: Launch enterprise version with integrated CI/CD pipeline support

## 👥 Community & Support

Join our growing community:

- [Discord](https://discord.gg/swarmsight) - For real-time discussions
- [Telegram](https://t.me/swarmsight_io) - For announcements and updates
- [Forum](https://forum.swarmsight.io) - For in-depth discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
