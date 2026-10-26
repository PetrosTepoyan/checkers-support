# Capture practice resource

Static, dependency-free teaching board at /checkers-support/learn/. Three positions cover capture priority, a compulsory second jump, and a king changing direction. It is a small practice resource, not the full iPhone game.

Run locally from the repository root: python3 -m http.server 8765 --bind 127.0.0.1

Rules checks: node --test tests/captures.test.mjs

Rules are based on WCDF English/American checkers 1.18-1.21. First two layouts are constructed teaching positions. The third is the existing approved day48 layout from the Checkers video production manifest. No dependencies, microphone, camera, sign-in, storage, payment or external scripts are used by this resource. App Store links use the existing Checkers app ID6782011100. Support/privacy pages remain unchanged.
