# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.6](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.5...v0.2.6) (2026-03-27)

### Features

- **admin categories crud:** created crud methods for handling category data ([42be056](https://github.com/akshayfanatic/dubaipropertyIQ/commit/42be056ccec0894b437265b2133ef3b7606722d9))
- **admin properties form:** implement feature for creating form for creation edit , create properties by admin ([3726c29](https://github.com/akshayfanatic/dubaipropertyIQ/commit/3726c298ff0ecaed009df4fdfd5409046970270a))
- **properites:** implement pagination in properties data-table and pagination ([82f3129](https://github.com/akshayfanatic/dubaipropertyIQ/commit/82f3129376d84883e097cb8eb3e43e78ee05a101))
- **properties:** add photo upload feature to PropertyForm ([313d59e](https://github.com/akshayfanatic/dubaipropertyIQ/commit/313d59e86bb9dfdff9276d8f4c0558fd22e1a291))
- **properties:** added properties feature to admin dashboard ([dfa150f](https://github.com/akshayfanatic/dubaipropertyIQ/commit/dfa150fd6e10d1cc39086dba893a76f1ce1eac07))
- **properties:** implement properties data table ([770ce10](https://github.com/akshayfanatic/dubaipropertyIQ/commit/770ce1005ac4a29b7545aa808cc8994e88118e6e))
- **sooner:** implement toast feature in admin dashboard ([175b69e](https://github.com/akshayfanatic/dubaipropertyIQ/commit/175b69e0ac03f613b09244ab6cde82b772d66905))
- **supabase:** upgraded supabase package to latest version ([f5d940d](https://github.com/akshayfanatic/dubaipropertyIQ/commit/f5d940d48a16c973f2f43a8f6c360362b8687ff2))
- **table:** created a animated table skelton and remove singular skelton and make it reusabble ([978a421](https://github.com/akshayfanatic/dubaipropertyIQ/commit/978a4215d8f6c0af5ed5dc6f4279f35140303e76))

### Bug Fixes

- **error handling:** fix issue regarding error handling and created a nested level error fallback ([d3e43c0](https://github.com/akshayfanatic/dubaipropertyIQ/commit/d3e43c012efc29bc2791dcc224019fe866a33f63))
- **loading properties:** reapply same loading skelton in layout which was previous ([26c7b9a](https://github.com/akshayfanatic/dubaipropertyIQ/commit/26c7b9a45a4f19ade6efe001e54683af3af84dfd))
- **migrations:** fix db migrations issue and pull latest migration from db ([c312466](https://github.com/akshayfanatic/dubaipropertyIQ/commit/c312466c30de85367368e47af920b5e12c1f28e2))
- **properties:** change key in queries and columns ([3790248](https://github.com/akshayfanatic/dubaipropertyIQ/commit/3790248afe5a03120425f6b7be7824109460aa0a))
- **properties:** fix properties loading issue ([84603df](https://github.com/akshayfanatic/dubaipropertyIQ/commit/84603df35319591620fe03461c38b84001105401))
- **properties:** remove unused usestate from components ([6d68951](https://github.com/akshayfanatic/dubaipropertyIQ/commit/6d68951e3c20d547b3930cd7b01b01546dfed0da))
- **property form:** fix issue regarding form ([1404ad1](https://github.com/akshayfanatic/dubaipropertyIQ/commit/1404ad179b6d552dd8444a279d02152cf0fcea43))
- **server action:** increase server action body size ([6052b43](https://github.com/akshayfanatic/dubaipropertyIQ/commit/6052b4323e4fab579200a16a0f4513a6611a2b9b))
- **types:** fix issue regarding types in property and categories ([8d0516f](https://github.com/akshayfanatic/dubaipropertyIQ/commit/8d0516f7992aae903b58d203265dac383422b9da))

### Code Refactoring

- **db table properties:** change property_status data type to enum and created new enum property_status_enum ([1e3bfc8](https://github.com/akshayfanatic/dubaipropertyIQ/commit/1e3bfc825107d078bf6507fb94b204d7849b0fbb))
- **properties:** Reorganize Folder Structure and seperate resuable component ([836b5ba](https://github.com/akshayfanatic/dubaipropertyIQ/commit/836b5ba61977067ef386392ab8162d04fdd9eb48))
- **reorganize folder structure:** implement new folder structure for not displaying parent layout to property/new page ([eda17ce](https://github.com/akshayfanatic/dubaipropertyIQ/commit/eda17ceacb8ef977a9ea47aad0e5e8ee4f2f237d))

### [0.2.5](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.4...v0.2.5) (2026-03-24)

### Features

- **client configuration:** implement client configuration in project ([55706d6](https://github.com/akshayfanatic/dubaipropertyIQ/commit/55706d672ec06a4ef36271abba45c095d2f1962b))
- **error:** implement global error handling for better ux ([c89db00](https://github.com/akshayfanatic/dubaipropertyIQ/commit/c89db00a1ea083b3e246f186c9fa672c8d3e3619))

### Bug Fixes

- **env validation:** fix env issue -- display error in browser ([983a503](https://github.com/akshayfanatic/dubaipropertyIQ/commit/983a503))

### [0.2.4](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.3...v0.2.4) (2026-03-21)

### Features

- **login button:** Created Login Button and remove CTA button fully ([f55f79b](https://github.com/akshayfanatic/dubaipropertyIQ/commit/f55f79be85caa903b3651e87f2536e8649cd20aa))
- **profile popover:** created profile popover in header menu ([fede5ce](https://github.com/akshayfanatic/dubaipropertyIQ/commit/fede5cea111c54b861333a55d15ae545ef39df3c))

### Bug Fixes

- **bump issue:** bumping version shift form main to develop ([1a5c404](https://github.com/akshayfanatic/dubaipropertyIQ/commit/1a5c404622e3b2a3a5d6be9096d18cb9d198346f))
- **hydration issue:** fix issue regarding hydration in toggle and create a client hook ([bf80d0c](https://github.com/akshayfanatic/dubaipropertyIQ/commit/bf80d0c032884dbc25b9f1fa94a439533c5d0759))

### Code Refactoring

- **admin nav profile dropdown:** displaying singular component both in public facing frontend side and dashboard ([ce806f0](https://github.com/akshayfanatic/dubaipropertyIQ/commit/ce806f0cd57e7423e9e7a1a1f1ffc878d3f7728d))
- **layout:** modularize Header and Footer into dedicated folders ([52babda](https://github.com/akshayfanatic/dubaipropertyIQ/commit/52babda222881fccd49ee66c0aaae6e8e3bb92d3))
- **user:** deleted use-role.hook no usecase ([c323def](https://github.com/akshayfanatic/dubaipropertyIQ/commit/c323def1859bcec0356cb0c358c4be032665e69e))

### [0.2.3](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.2...v0.2.3) (2026-03-21)

### Features

- **404:** implement 404 global level and group level ([a6bdcc5](https://github.com/akshayfanatic/dubaipropertyIQ/commit/a6bdcc571bed8082eac63df4b8b840d667edda21))
- **dark mode:** Implement dark mode for admin dashboard ([c3205c9](https://github.com/akshayfanatic/dubaipropertyIQ/commit/c3205c9bbab6a67ad77759490c513fad85230a60))

### [0.2.2](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.1...v0.2.2) (2026-03-20)

### Bug Fixes

- **reset password token:** checking token instead of access token checking token hash ([0f6d612](https://github.com/akshayfanatic/dubaipropertyIQ/commit/0f6d61248b9097b997135a612f3dd3607693d17c))

### Code Refactoring

- **auth folder structure:** Reorganize Folder Structure For Public Auth ([d6d441c](https://github.com/akshayfanatic/dubaipropertyIQ/commit/d6d441ce56260457fdc1cf10e8e41a2f87af0bc0))
- **auth:** extract reusable EmailInput and FormField components ([031d4bc](https://github.com/akshayfanatic/dubaipropertyIQ/commit/031d4bcc5e4a2a2ae9c261cb9431334ed67b6690))
- **auth:** reuse AuthCard component across all auth forms ([b11376b](https://github.com/akshayfanatic/dubaipropertyIQ/commit/b11376b2edb25164212b165a07aac7aa8e445561))
- **routing configuration:** fix routing configuraion issue and refactor routes.ts and make it clean ([ef73fbe](https://github.com/akshayfanatic/dubaipropertyIQ/commit/ef73fbea0cd1a7cec27984615bad59860ba10cb2))

### [0.2.1](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.2.0...v0.2.1) (2026-03-19)

### Bug Fixes

- **temporary session:** created temporary session for changin password ([7319c11](https://github.com/akshayfanatic/dubaipropertyIQ/commit/7319c11f57cc19417b2cd87e34df53007d107434))

### Code Refactoring

- **duplicate client:** reuse single instance server client instead of creating every time ([e6334f5](https://github.com/akshayfanatic/dubaipropertyIQ/commit/e6334f5e039fc19bd09f9b73550ab72a5a552023))

## [0.2.0](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.13...v0.2.0) (2026-03-18)

### Features

- **admin dashboard:** Setup admin dashboard using shadcn ui ([a0634b8](https://github.com/akshayfanatic/dubaipropertyIQ/commit/a0634b8ca0af1d78efa55fb2336e28a6ef9aea5c))
- **admin property , notfound:** Created Properties page and admin notfound page ([3c97684](https://github.com/akshayfanatic/dubaipropertyIQ/commit/3c976845832b8a4792ac62a0105d75c02dacb08b))
- **auth callbacks:** Created Auth Callbacks and error ([4889d32](https://github.com/akshayfanatic/dubaipropertyIQ/commit/4889d322e8894e3842c3d5f08b3becb44e6296b7))
- **auth:** add callback, forgot-password, and reset-password pages ([de0f1b3](https://github.com/akshayfanatic/dubaipropertyIQ/commit/de0f1b30c263ec88c4fcd5f12dbda621814e7e9e))
- **auth:** add email confirmation and user API routes ([aadc58f](https://github.com/akshayfanatic/dubaipropertyIQ/commit/aadc58f75a1de15cb719e2aebc02f951f18918e2))
- **auth:** add middleware and auth utilities ([17a3670](https://github.com/akshayfanatic/dubaipropertyIQ/commit/17a3670bb3e93c9e99ffd6d59a68d92701a62182))
- **auth:** add user roles RBAC with admin, agent, customer ([fccd918](https://github.com/akshayfanatic/dubaipropertyIQ/commit/fccd9188f2dfb7ca177875ee8fd2da41e431e5d5))
- **create middleware checks:** Created Middlware Checks and Preventing user to unauthorized access ([b93481c](https://github.com/akshayfanatic/dubaipropertyIQ/commit/b93481c2232c5bdc8c616120856cf04322a724b7))
- **dashboard:** add protected dashboard with profile page ([8d95a81](https://github.com/akshayfanatic/dubaipropertyIQ/commit/8d95a81fa93116bb9b1ce6ac24eab714d0e8c14d))
- Integrate Authentication Flow ([1f48f60](https://github.com/akshayfanatic/dubaipropertyIQ/commit/1f48f60ad24ad5e293269873607a0cb693bd0e93))
- Prevent Routes From Unauthorized Access ([333f3fe](https://github.com/akshayfanatic/dubaipropertyIQ/commit/333f3fe7789ac9fc384230c596c24626d373902d))
- Reorganize Folder Structure ([9c5f8c3](https://github.com/akshayfanatic/dubaipropertyIQ/commit/9c5f8c3794b47af10cf66b39c25dc411e29e649e))
- **reorganize layout,auth:** reorganize public layout for auth and implenet diffrent layout for auth ([063c1ce](https://github.com/akshayfanatic/dubaipropertyIQ/commit/063c1ce95a974dd292a345cd08fdb44448a3bd60))

### Bug Fixes

- **auth:** get role from JWT custom claims ([88c86c0](https://github.com/akshayfanatic/dubaipropertyIQ/commit/88c86c02052391830b46b6d5763c853257693418))
- **auth:** remove unused variable in proxy ([2338218](https://github.com/akshayfanatic/dubaipropertyIQ/commit/233821814f92e29040e4bae91ffcd7cd69c85ab9))
- **auth:** replace middleware.ts with proxy.ts for Next.js 16 ([d76cce3](https://github.com/akshayfanatic/dubaipropertyIQ/commit/d76cce3f4f8efe3b6db3b944f8f8addb7de24922))
- Remove Mcp context7 from mcp ([d50e5e8](https://github.com/akshayfanatic/dubaipropertyIQ/commit/d50e5e83353b273b39af308a470555646cb21901))

### Code Refactoring

- **auth:** extract client component and add Suspense to forgot-password page ([d2f2cf8](https://github.com/akshayfanatic/dubaipropertyIQ/commit/d2f2cf87b42f2d7b009571dbcbc6aee9f39be528))
- **refactor admin header:** created profile drowpdown component ensure follow srp ([520fc44](https://github.com/akshayfanatic/dubaipropertyIQ/commit/520fc44e8720ff583954568b0859bab7df57a510))

### [0.1.12](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.11...v0.1.12) (2026-03-03)

### Features

- **homepage banner:** Created a Home Page Banner Section With Search Form ([8d7a8b6](https://github.com/akshayfanatic/dubaipropertyIQ/commit/8d7a8b673235f7ee6c40de764fc60325db0ad546))

### [0.1.11](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.10...v0.1.11) (2026-03-02)

### Bug Fixes

- **Dialog Issus:** Fix Issue Regarding WCAG and add SheetTitle and Visually Hide This ([ba7d69f](https://github.com/akshayfanatic/dubaipropertyIQ/commit/ba7d69f473504720a8b283844b1721d93500a8ae))
- **responsive mobile header:** Fix Issue In Navgation Menu Mobile ([ede94fd](https://github.com/akshayfanatic/dubaipropertyIQ/commit/ede94fd5d6038a8c25479b86848bdf62fc70a801))

### [0.1.10](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.8...v0.1.10) (2026-03-02)

### Features

- **Footer:** Implementing Footer of the App ([80d52db](https://github.com/akshayfanatic/dubaipropertyIQ/commit/80d52db73235f7ee6c40de764fc60325db0ad546))
- **refactor:** Refactor Configuration Of MCP JSON ([0a52fb7](https://github.com/akshayfanatic/dubaipropertyIQ/commit/0a52fb75687d59d34ebd5597a6fed4eb803d9e39))

### [0.1.9](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.8...v0.1.9) (2026-02-27)

### Features

- **Footer Integration:** Implementing Footer of the App ([80d52db](https://github.com/akshayfanatic/dubaipropertyIQ/commit/80d52db73235f7ee6c40de764fc60325db0ad546))

### [0.1.8](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.7...v0.1.8) (2026-02-27)

### Features

- **Error Feature:** Integrate Error Handling Feature For Better UI ([6a464d7](https://github.com/akshayfanatic/dubaipropertyIQ/commit/6a464d7ae546c3ad221a8c9d3cee5bf5a0e3f3fb))
- **NotFound:** Added Not Found Page Component ([776f3ae](https://github.com/akshayfanatic/dubaipropertyIQ/commit/776f3aed09584db70c1818eb40aaf7200178acbd))

### [0.1.7](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.6...v0.1.7) (2026-02-27)

### Code Style Changes

- **Header:** Fix Issue Regarding Style In Header Following Consistent Design System ([b78edfa](https://github.com/akshayfanatic/dubaipropertyIQ/commit/b78edfa34f4f5af6c7659ebf9a10ae35b71c9caa))

### [0.1.6](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.5...v0.1.6) (2026-02-27)

### [0.1.5](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.4...v0.1.5) (2026-02-26)

### Bug Fixes

- **version issue:** Fix Issue Regarding Version Log ([256e38c](https://github.com/akshayfanatic/dubaipropertyIQ/commit/256e38c5b6bdb6101a81a9410672147c371013cc))

### [0.1.4](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.3...v0.1.4) (2026-02-26)

### [0.1.3](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.2...v0.1.3) (2026-02-26)

### Bug Fixes

- **husky:** add Husky v9 shebang and pre-push build hook ([b80f058](https://github.com/akshayfanatic/dubaipropertyIQ/commit/b80f058260b6eafc8e86abddb80374fa688eda2d))

### [0.1.2](https://github.com/akshayfanatic/dubaipropertyIQ/compare/v0.1.1...v0.1.2) (2026-02-26)

### 0.1.1 (2026-02-26)

### Features

- **claude,setyp:** Setting Up Claude ([c40f22a](https://github.com/akshayfanatic/dubaipropertyIQ/commit/c40f22a54f0f9eeebd799b97db8562091a944ebe))
- **ui:** initialize shadcn/ui with design tokens ([74e04df](https://github.com/akshayfanatic/dubaipropertyIQ/commit/74e04df6d58b8f95b66c553613613102d3927c2b))
