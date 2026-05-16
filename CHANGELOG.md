# Changelog

## [1.10.0](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/compare/kaizoku-v1.9.0...kaizoku-v1.10.0) (2026-05-15)


### Features

* add TopManhua lua scraper based on AI prompt template ([f4a62b7](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/f4a62b76708f7b4dd3f4039b3f4772d4ec2ea38a))
* import MangaDex and MangaKatana production scrapers from secondary repository ([748f1b3](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/748f1b3fbcc0830d8ecfab32ad7821cd06f27bad))

## [1.9.0](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/compare/kaizoku-v1.8.0...kaizoku-v1.9.0) (2026-05-14)


### Features

* implement multi-repo cloud sync, standalone accounts module, dynamic planner distribution graph, and context-aware scheduler cleanup ([d349a54](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/d349a54596c4f509654c2df5aa6fb0d4ec9b1b9d))

## [1.8.0](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/compare/kaizoku-v1.7.1...kaizoku-v1.8.0) (2026-05-14)


### Features

* sub-sistemas de Auditoría Ligera de Estados, Seguridad Multi-Usuario y Gráfica Dinámica ([b1a3ede](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/b1a3ede2e97f85ff44082be0b89dbd32ea0ec2d7))

## [1.7.1](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/compare/kaizoku-v1.7.0...kaizoku-v1.7.1) (2026-05-14)


### Bug Fixes

* **scheduler:** mapear los estados 'RELEASING' y 'FINISHED' de AniList a las pestañas y selectores de publicacion en el scheduler ([dbb3fbb](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/dbb3fbb42b6868c95e41094ab3851734fa2b5d84))


### Performance Improvements

* excluir descripciones largas (summary) de la consulta principal del catalogo de mangas para evitar exceder el limite de 4MB de respuesta en Next.js Serverless API ([e1bcb3d](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e1bcb3d4e5add6bb750db1662f1c42f206493978))

## [1.7.0](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/compare/kaizoku-v1.6.1...kaizoku-v1.7.0) (2026-05-13)


### Features

* add i18n support and language switcher ([8f8f283](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/8f8f28326984f6a968785e14ceefabd50abca870))
* add initial sources management section (Phase 1) ([f02c80c](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/f02c80ceac1417c7d2c47aa62eee97426962015d))
* add KAIZEN_ environment variables with KAIZOKU_ fallback for backward compatibility ([d72d90d](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/d72d90d5ab0a761db899ad68035ae286ac161188))
* add manga locking system to scheduler to prevent overwriting manual intervals ([03e5c47](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/03e5c4780a6c1354b1113fffecff463b09dce1da))
* complete internationalization for library and manga detail pages ([e1dc1ad](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e1dc1ad37401db5c1aedd0dccd2e3f6761119c27))
* complete rebranding to Kaizen Manga Downloader, blue theme, and smart scheduler optimizations ([11f7ef1](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/11f7ef1bcc2744e7bcb8237f086a1e71efbe88ad))
* complete sources management and settings migration ([d878d99](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/d878d993a794229fb3b864a772c390dcd4bf6504))
* dashboard v1.1, mangadex rate limit fix, and deployment ready ([fb1d636](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/fb1d6361937b67c180dafad7e2f9347bdc96760a))
* dynamic app version in header (v2.0.0-kaizen) ([7fad3b6](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/7fad3b6dbc69c4b7428a4233bb5623365ff0a3f4))
* finalize favicon fixes, i18n support, and startup optimizations v2.2.5-kaizen ([ecbd522](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/ecbd522dbc6fb531a41346eee52785b8fdf028fd))
* implement advanced dashboard failure management ([7417a45](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/7417a45f8c7634bbe65b00ab6ff8a8f090859d97))
* implement smart auto-deactivation system for failed sources ([305db21](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/305db210aacaeae3b7eaeabd41c8d60563dd41c2))
* implement source origin tracking, manual upload and favicon fallback fixes ([5c74746](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/5c747466efc85712bc21684b70454f6e6f37a2c0))
* implement sync by source and update rate limit logic ([dfa1a70](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/dfa1a70632f0df1225f08f2ccf00b45cafa0a2cf))
* improve download queue visibility and actions ([7f2e191](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/7f2e191ae43c007f2ea184cd1ffdd8e1d22cb28c))
* improve error messages for better observability (v2.0.2-kaizen) ([1b8784c](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/1b8784c63d090121d33ec98fe1b561d63a11990a))
* improve mobile/tablet responsiveness and migrate theme color to indigo ([4c04f14](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/4c04f14d25940e387f4f829d34726fda022e70f9))
* individual chapter deletion (v2.1.0-kaizen) ([cb7f4fd](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/cb7f4fd9445bb772e4cbef5395e90118c8dd6835))
* merge anilist fallback fix ([e885e25](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e885e25f7480055634220d071427e62eb60cc985))
* merge definitive search fix for long titles ([79c98cc](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/79c98cc9b79a8912e4691d91ffd11d711d0738f1))
* merge origin fixes ([36c4a54](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/36c4a54681a97270b9e3ed30feab9673771a1462))
* merge PR [#22](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/issues/22) smart auto-deactivation + favicon/i18n fixes v2.2.5-kaizen ([7bf43b5](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/7bf43b57b94f1e1a4a3362c79b0719a72f9df859))
* merge search mode fix ([0e01ccc](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/0e01cccbfe08fc371779ef894fa7e4370f459c1c))
* merge user fixes for mangal search logic ([5bb18bd](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/5bb18bdaeecd636f22a743eb44f15e0f0913c396))
* **metadata:** add intuitive file upload input to manual override modal allowing custom local device images ([dc20289](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/dc202899af858b0ee80137318b9cc3dabb1a06e2))
* **metadata:** automatically download and save manual cover edits as cover.jpg to satisfy Komga/Kavita integrations ([ac28184](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/ac28184bcf997976a3bebfef67fb63211e71ab1a))
* **metadata:** implement manual metadata override modal and modular priority fallback providers ([b45d807](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/b45d8074d8ab0f415794659058a45c68530cae00))
* redesign sources page with active/inactive columns and file toggle logic ([bc3562d](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/bc3562d15614e2fb0ea4c4ad657c167a02e6cfff))
* rediseño del scheduler inteligente organizado por pestañas de estado de publicación, override en vivo y acciones de optimizacion masivas ([3650069](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/3650069d61fc3b147511a5a3565f346593529774))
* refine comprehensive UX/UI omni-experience ([6e92d60](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/6e92d6090e826b4d388e42a26c092d0931896640))
* replace LoadingOverlay with Skeleton in MangaPage ([abae577](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/abae577e135396eb91e6f41655aa5fa11b60ee91))
* replace LoadingOverlay with skeleton loader on manga page ([f5a10f0](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/f5a10f04a4d485268bfaf74f4a9979d42926a485))
* scheduler progress visibility and dashboard navigation ([08ba516](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/08ba516d77c22c9c2e2e3d3f5a015b4c6fb4c52d))
* simplify download queue UI and add history cleanup (v2.0.1-kaizen) ([77b622d](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/77b622dbcaff0a3aa892fa00d33d18445c6bca89))
* soporte multi-fuente en creacion de manga, recuperacion quirurgica de capitulos y limpieza del repositorio ([907b407](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/907b4071b99575ac253fa2449dde2212def32336))
* stabilize UI and optimize performance v2.2.2-kaizen ([952aeeb](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/952aeeb4a64cd2e383da48b8e5c38a4e557ca55a))
* support multiple sources per manga with priority fallback ([64e2cb7](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/64e2cb7d48e3a05f721c826d8a932b4779f6e85e))
* throttled bulk retry + download queue modal ([304ef5a](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/304ef5af3e039e4566f97943041834207744e1aa))
* **ui:** implement kaizoku redesign plan v2.0 ([4424078](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/4424078b968967fd66161ec2a4af73770f890ce3))
* update kavita integration to update specific libraries, when specified ([#96](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/issues/96)) ([7432d05](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/7432d0565c6e630a35dd9b0f98a52d6d52fb00b0))
* upgrade Scheduler V2 with timezone awareness, advanced editor, and auto-stagger all ([a72c6ad](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/a72c6ad7f89cb9ce79dc156a0d4b36d6918a48c0))
* **ux:** Add aria-labels and tooltips to icon-only buttons ([5b069f4](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/5b069f41b94dc10ad24136ba06aa3072906737ba))


### Bug Fixes

* actually fetch chapters during search and add query shortening fallback ([9c39546](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/9c39546c69c2a0afd12ceb9b36d0c832fb30b640))
* add @ prefix for mangal chapter filtering ([e47b74c](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e47b74c71bc59b6de2d299b2c1e5bf3eba5c2108))
* add missing useRouter import in dashboard page ([1dcebb4](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/1dcebb4f61554afb9729ad3f274b95c48653d97d))
* apply search fallback logic to getChaptersFromRemote to fix queueing issues ([64f29ac](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/64f29acb64a2acc41a57a363d4d317db3672a7e7))
* complete translation dictionaries with all missing keys ([ed1aceb](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/ed1aceb51907512fb38fc56de4f0464efd898294))
* correct 'results' variable declaration ([fee2988](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/fee2988a41bc8f1b48a28336940531aa1658f1e1))
* **dashboard:** missing backend procedures for failure management ([efcdac1](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/efcdac1eca4fb0552dea97aa05163faab86b0ed8))
* eliminar trabajos fallidos huerfanos de BullMQ de forma automatica al borrar una fuente de un manga ([5e235f4](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/5e235f4a7551bf9735f835c5fcc23a61eafd29e3))
* ensure download command uses the same search mode as the initial search ([f002be1](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/f002be1467cf7819dbbef78031764b04e7bc5d48))
* explicit type casts for optimized prisma queries ([d69ac8f](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/d69ac8fe1637eb3761d92955fbc58ff97d504082))
* hard-force mangal.ts search logic update ([e5f56cd](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e5f56cdb038a154009d807f2d0f2ebccf9a3de2a))
* implement Anilist fallback for manga metadata and detail retrieval ([cfe3422](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/cfe34221512286c2e2538e6f5e4b3906e43ccca5))
* implement search fallback without Anilist to avoid empty results ([bec0bb2](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/bec0bb26177583e2f97b5ca61db57e9119713dec))
* improve auto-stagger logic to support re-staggering daily crons ([731a59a](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/731a59a94a389308f74671b0860a0e831ed25721))
* include next-i18next.config.js in docker image ([4065572](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/4065572f4be5ae9f544953b85f11a479c6d3c2b0))
* include sources in all manga queries to fix compilation ([6cad280](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/6cad2804262fa22fc39da6df91c0f4fe77b2f812))
* library chapter count and improve file scanning regex ([26cd691](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/26cd6910933de4f79c168e677fac0bdf299decc3))
* **library:** include chapters in manga query to fix missing counts ([623de4d](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/623de4da033a82dc218d935f0017972b7bb39dd8))
* make auto-stagger range inclusive and improve cron detection with trim ([214d9fd](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/214d9fdece2ce2561f9e4a2c895589a2d1ea14b8))
* make MangaSources more robust and update types ([2320878](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/2320878560cccbebb14038431bab1b0061aea5bf))
* **metadata:** resolve silent failures in manual cover image sync by raising next API body parser payload size to 10mb, preventing UI string overrides, and using reliable commas splitting for data URLs buffer generation ([33b4495](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/33b4495e897638afa9b6a26206345363e0ac6d6a))
* **mobile:** add responsive hamburger menu for portrait mode ([61faf42](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/61faf425adc8bf228faba9be3246d92a9f4e24d6))
* **mobile:** optimize header layout and responsive search bar ([6dc0843](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/6dc08433f943b2d54251ac94a91dace67d068878))
* properly expand 'all' sources and search in parallel ([95f5092](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/95f50925615cbd4e6ba8cc34d739cf7c231e08ec))
* resolve client-side crash in header search and restore summary data ([bcc4a00](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/bcc4a00bbe63eca624de2edba34a7dda147d2fce))
* resolve frontend type mismatches and missing MultiSelect import ([be45633](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/be45633b0b1dbfce32e21d616f177ebc37d246c6))
* resolve mangal index panics and prisma unique constraints ([065e253](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/065e253c0cb332e72aef3d4517f1aa255cec611d))
* resolve multi-source search bug and improve robustness with parallel execution ([cfb9466](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/cfb9466c70aa86db41043dec2744662f57e68173))
* resolve pnpm not found in docker startup script ([04fbeed](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/04fbeedd230b6d22a0544314fe4c09d8f410e26f))
* resolve Prisma Query Engine missing error in Docker ([380c309](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/380c309642cef9b2c0ed0986dee3b16ab3788b9e))
* resolve remaining merge markers and unify i18n logic in UI components ([6ea76f6](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/6ea76f65b4ede3d5caabe23ecec64a6680f7eee3))
* resolve Synology deployment error (CRLF to LF) and implement multi-source selection support ([aff7301](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/aff7301a6d507c4953d42d2550c04177c111bd81))
* resolve syntax error in sources router caused by merge markers ([b044699](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/b0446998694b8d8f8119fdeb2ec3a298d62749fe))
* resolve typescript errors in checkChapters worker ([f2b6a4f](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/f2b6a4f6caa90436339a920c58af3aec17ac27bd))
* restore react imports and remove duplicate notifications in scheduler ([2cdbd11](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/2cdbd115ac7ccd16ec76a7a89e7fe399f315d999))
* revert [@prefix](https://github.com/prefix) in mangal --chapters filter, invalid pattern for all sources ([e39d6aa](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e39d6aa619c5e1bb782c7787ce58e2f7f9c6778e))
* revert internal service rename for retro-compatibility ([179d6d2](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/179d6d20bd365409c5fb097bc3129cc2be73b49c))
* stabilize download process (Mangadex fallbacks, explicit indexing, and database upserts) ([8890890](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/8890890b2a18e512c27c9fcbb751e519918b15f9))
* **ui:** resolve fatal hook order violation and missing dayjs relativeTime plugin causing vertical details view crash on rotation ([a023d43](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/a023d434d6ef1ea9cde4afa7a4a810bed357f580))
* use prisma validator for better type safety in checkChapters ([5a4415b](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/5a4415b8338d5d761eacb6a2c618c48c82c526b9))


### Performance Improvements

* limit manga fetching to id in out-of-sync procedures ([e17b884](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/e17b8845d10975ea715ae81198333887f02660af))
* optimize O(N^2) complexity in chapter filtering and synchronization ([fdbb95a](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/fdbb95ab2bc392cf516fc239f929196cd0d9993f))
* optimize prisma queries and add index for out-of-sync chapters ([a2262f9](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/a2262f9933c8c666657df15de240b6d423781692))
* optimize startup queue scheduling and further reduce trpc payload ([4b9c8d6](https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader/commit/4b9c8d689e35638dfefb265c8e08c16f36bb867a))

## [1.6.1](https://github.com/oae/kaizoku/compare/kaizoku-v1.6.0...kaizoku-v1.6.1) (2023-02-07)


### Bug Fixes

* clear mangal cache when checking out of sync chapters ([6578201](https://github.com/oae/kaizoku/commit/6578201736b2c7e523f1e2a0518802dd7fb3154c))
* use correct height for badge ([1ffdcae](https://github.com/oae/kaizoku/commit/1ffdcaed4b1ed8c17842f639dc74a2b5ee861a21))

## [1.6.0](https://github.com/oae/kaizoku/compare/kaizoku-v1.5.1...kaizoku-v1.6.0) (2023-02-07)


### Features

* add links to navbar history items ([67bb111](https://github.com/oae/kaizoku/commit/67bb111e77457dba768703ce36a4504936dfacc0))


### Bug Fixes

* use binary engine ([#75](https://github.com/oae/kaizoku/issues/75)) ([08662bb](https://github.com/oae/kaizoku/commit/08662bb72ffa75704d67a4a1aac1d2bd861341bc))
* use smaller card and title ([9dc7536](https://github.com/oae/kaizoku/commit/9dc7536767e218803a6a78ca349eb9012be138d4))

## [1.5.1](https://github.com/oae/kaizoku/compare/kaizoku-v1.5.0...kaizoku-v1.5.1) (2023-02-01)


### Bug Fixes

* try other date information from fs for `Download Date` if birthtime is not present ([d01aa98](https://github.com/oae/kaizoku/commit/d01aa985fa22e867b17e2d3e9a444e759129d18d))

## [1.5.0](https://github.com/oae/kaizoku/compare/kaizoku-v1.4.1...kaizoku-v1.5.0) (2023-01-28)


### Features

* add ability to fix out-of-sync chapters ([6100e6c](https://github.com/oae/kaizoku/commit/6100e6c8809b133e52d714e2be0091bfbc447100))
* show out of sync chapters for each manga ([6b4dd53](https://github.com/oae/kaizoku/commit/6b4dd53a8ef4cc3e33d5cdcee1d13654905b0fbb))


### Bug Fixes

* add jobid for bulk operations ([e0a939b](https://github.com/oae/kaizoku/commit/e0a939b7ec90651441dcb2fd03c8e39c1086ff76))
* check if the remote source has any chapters before marking ([a4d787d](https://github.com/oae/kaizoku/commit/a4d787d5390859b59299480ade6db332e8c738e6))
* remove leftover chapters when fixing out-of-sync ones ([5713cd6](https://github.com/oae/kaizoku/commit/5713cd6f0cf51cda801c6007792e9a2bc91b52cf))
* remove title on smaller screens ([eb918d8](https://github.com/oae/kaizoku/commit/eb918d8969298195fadecf7b9d4b3b61f14a5175))
* search all mangas from mangasee ([de19737](https://github.com/oae/kaizoku/commit/de197373a1b3935b72cc9df16a22a4998974b3f2))

## [1.4.1](https://github.com/oae/kaizoku/compare/kaizoku-v1.4.0...kaizoku-v1.4.1) (2023-01-14)


### Bug Fixes

* update mangal to 4.0.6 to prevent chrome crashes ([f3d2b23](https://github.com/oae/kaizoku/commit/f3d2b2330e8dfc7c86f117e64f152458f4d3f566))

## [1.4.0](https://github.com/oae/kaizoku/compare/kaizoku-v1.3.1...kaizoku-v1.4.0) (2023-01-07)


### Features

* add refresh metadata button to cards ([cba8a74](https://github.com/oae/kaizoku/commit/cba8a74e9314b0b59d49196cd2ec97b30a9c0bc2))


### Bug Fixes

* show theme mode toggle shortcut ([f75c878](https://github.com/oae/kaizoku/commit/f75c8782572a1f19c3b5bb3a80935b4baeebd53b))

## [1.3.1](https://github.com/oae/kaizoku/compare/kaizoku-v1.3.0...kaizoku-v1.3.1) (2022-12-10)


### Bug Fixes

* read port env variable after app.prepare ([0756894](https://github.com/oae/kaizoku/commit/0756894e29eb8be5f48dfe8f72ee21162bc2c67c))
* replace chown usage to speed up startup ([4d68ae9](https://github.com/oae/kaizoku/commit/4d68ae9a2cb7a4e4051fca94938c596cffbf451f))
* use unpaged param for komga series ([d4786d2](https://github.com/oae/kaizoku/commit/d4786d24eb2a7bfc22895c02dc591d5da1aa23d3))

## [1.3.0](https://github.com/oae/kaizoku/compare/kaizoku-v1.2.1...kaizoku-v1.3.0) (2022-11-24)


### Features

* add kavita integration ([c19ee02](https://github.com/oae/kaizoku/commit/c19ee02dbd3feaf265e3c979f5f13cbbab42de40))


### Bug Fixes

* use correct env variable ([579d8d0](https://github.com/oae/kaizoku/commit/579d8d0d3a2a4f78d4f3d45b12d8524ce65d53f7))
* use exact parameter instead of first during manga match ([aa4e32d](https://github.com/oae/kaizoku/commit/aa4e32dd3d1ca09414498c19ce484b2603537c8f))

## [1.2.1](https://github.com/oae/kaizoku/compare/kaizoku-v1.2.0...kaizoku-v1.2.1) (2022-11-04)


### Bug Fixes

* pass include anilist manga to search ([a93da58](https://github.com/oae/kaizoku/commit/a93da58a87e7a7b1ed9b57b81e43ac692c9d47aa))

## [1.2.0](https://github.com/oae/kaizoku/compare/kaizoku-v1.1.1...kaizoku-v1.2.0) (2022-11-04)


### Features

* add apprise support ([7d6fe34](https://github.com/oae/kaizoku/commit/7d6fe34db6c77a5d1b274da036cf8669fef6058d))
* add dark mode ([22f6689](https://github.com/oae/kaizoku/commit/22f6689f2306db619ec669497371bc92d6154ab4))
* add komga integration ([04c521d](https://github.com/oae/kaizoku/commit/04c521de5b4b429172990fe45c579a3883fdc752))
* add settings table ([5cb4457](https://github.com/oae/kaizoku/commit/5cb44571830b014e62984e13ba7dbbe21d334622))
* add settings ui ([45980ec](https://github.com/oae/kaizoku/commit/45980ecb8b1883fbcc27bc159b7a89035ca96978))
* update mangal to v4, allow updating existing manga metadata ([43b2693](https://github.com/oae/kaizoku/commit/43b26938d4d158365ceaac1b80ef9800f70e9ceb))


### Bug Fixes

* auto size search results ([f8eb9c6](https://github.com/oae/kaizoku/commit/f8eb9c65f1a08baf9f208996413ebac85ee808f8))
* check the length of the tags and genres ([073fe01](https://github.com/oae/kaizoku/commit/073fe0166fa78c2e418f5c5a833eae370e8969da))
* disable search if there are no library created yet ([a18d166](https://github.com/oae/kaizoku/commit/a18d1668596a6877a820a4262a792e44eef28154))
* don't overflow on latest downlods ([52ca56b](https://github.com/oae/kaizoku/commit/52ca56b04776417a733ba98b0fc8d68b6b47c1a0))
* focus on library input ([9abb2f8](https://github.com/oae/kaizoku/commit/9abb2f846f755ae61e61c6d1d41f92bfe35eeccb))
* remove jobId from updateMetadata jobs ([99877bb](https://github.com/oae/kaizoku/commit/99877bb45aa543e1cfbf81afd74e8920cb3058a9))
* remove ongoing download jobs if exist ([e9f6bfe](https://github.com/oae/kaizoku/commit/e9f6bfec237996a1b7355b0968ce5f3f15222ca9))
* remove trailing undescores from sanitized manga names ([c8c463d](https://github.com/oae/kaizoku/commit/c8c463d6e12221af0bd130c9c47e5f75c365a5be))

## [1.1.1](https://github.com/oae/kaizoku/compare/kaizoku-v1.1.0...kaizoku-v1.1.1) (2022-10-28)


### Bug Fixes

* prevent incorrect image generation ([31075fd](https://github.com/oae/kaizoku/commit/31075fd7aceb3d9dfe603541a52dd165d30e82c7))

## [1.1.0](https://github.com/oae/kaizoku/compare/kaizoku-v1.0.0...kaizoku-v1.1.0) (2022-10-27)


### Features

* add ability to bind manga metadata to another anilist id ([a3a9252](https://github.com/oae/kaizoku/commit/a3a9252bc8a613e570ea3df312b49a7e923cb9df))
* add support for custom interval. closes [#12](https://github.com/oae/kaizoku/issues/12) ([a7323d8](https://github.com/oae/kaizoku/commit/a7323d8c4c45312a551c8e82472e4bcd982bca08))
* implement update popup for metadata and interval ([e82d934](https://github.com/oae/kaizoku/commit/e82d93452a7745603d5d9cdb2a93fc949d3ab79f))
* reschedule checkChapter jobs on startup. closes [#14](https://github.com/oae/kaizoku/issues/14) ([ab14475](https://github.com/oae/kaizoku/commit/ab1447533bb888189778d47033323c3c1da1df73))


### Bug Fixes

* check for out-of-sync chapters ([caf6720](https://github.com/oae/kaizoku/commit/caf6720dacda4de28d8da2a5bf61442f55384245))
* don't store completed notification jobs ([373fc3b](https://github.com/oae/kaizoku/commit/373fc3b8bd46b86fbc8f21cf362772b9d629b9b9))
* filter out empty lines when getting the sources ([b150575](https://github.com/oae/kaizoku/commit/b150575b7f1d869bd214ee4be707b1dec892c046))

## 1.0.0 (2022-10-22)


### Features

* add cascade on delete ([e09b656](https://github.com/oae/kaizoku/commit/e09b656917a59e8a47cf67b077d1311be83ca9e4))
* add interval option to manga selection ([fb9dc13](https://github.com/oae/kaizoku/commit/fb9dc133cf9071b04f6f3f7c434991e5f28be620))
* add manga detail page ([707560e](https://github.com/oae/kaizoku/commit/707560ef2fe3ce02c5031ad2cb336a21f1dd8344))
* add manga route ([0bfc47d](https://github.com/oae/kaizoku/commit/0bfc47d8a5979b5af952c850e6504c49c8f1961d))
* add mangal to docker image ([95bb65a](https://github.com/oae/kaizoku/commit/95bb65a2b65ede4af15338b1b0f28cf74f7ac806))
* add metadata ([a2c3d60](https://github.com/oae/kaizoku/commit/a2c3d605d4534c9ba704122367cd85356b77e2f3))
* add new manga card ([127382d](https://github.com/oae/kaizoku/commit/127382d220368b8bc7247db80c536d36ab8ecc41))
* add new manga to spotlight actions ([ae65666](https://github.com/oae/kaizoku/commit/ae65666aafb2cad523c1e16b0dc256997e9326d6))
* add scheduling ([bce4832](https://github.com/oae/kaizoku/commit/bce483282bc90ba7770a2d070affe59ab6842617))
* add search to header ([87f23cc](https://github.com/oae/kaizoku/commit/87f23cc8858415585cea16509af48612b45f5db7))
* add skeleton to main page ([787bbba](https://github.com/oae/kaizoku/commit/787bbbacfab6295332824cf6429a1385e501ec60))
* cancel job if exists ([130c339](https://github.com/oae/kaizoku/commit/130c3393734bdf850297808009cd0ccbffc08286))
* dockerize application ([5743227](https://github.com/oae/kaizoku/commit/57432270a5ce39ddbcdbb852fb1ef3fc09cbcfca))
* implement add manga ([8c45e0c](https://github.com/oae/kaizoku/commit/8c45e0cb1aa543bfa2938fe2a7713f4ca0baf35f))
* implement nav bar ([6e9a6a4](https://github.com/oae/kaizoku/commit/6e9a6a4e018bea1c22386aa4987c55788d6fb956))
* implement remove files option to modal ([355c1ae](https://github.com/oae/kaizoku/commit/355c1aebde3d7283fbc548b990c656ca61f1cba1))
* initial commit ([7ed5e4f](https://github.com/oae/kaizoku/commit/7ed5e4f2e10125737a061c66a1fd343fa641c6e7))
* polish main page ([bdefdfc](https://github.com/oae/kaizoku/commit/bdefdfc3fc22fbcd4884408cf5f63e9e9173b45e))
* restrict height of the manga metadata in details page ([7aac2ef](https://github.com/oae/kaizoku/commit/7aac2ef54931bcad6c22c93b81165057678ea073))
* show source and interval in details ([155a367](https://github.com/oae/kaizoku/commit/155a367f1e47c4a3dc3542c5fa32e78c49b68236))
* sync db with files ([e6b6f64](https://github.com/oae/kaizoku/commit/e6b6f64513708b602af1a64f65647885dea6f611))
* use custom server for downloader ([077a7ba](https://github.com/oae/kaizoku/commit/077a7ba2f4adcf8d34a4a7ca62ac76f9cafb2d79))
* use mantine ([2ba146b](https://github.com/oae/kaizoku/commit/2ba146b330a088f04715bedde1fa7bdb82a7d9db))


### Bug Fixes

* add alt to header image ([0152736](https://github.com/oae/kaizoku/commit/015273613c65bfc2deb8a826a465aa1338437acb))
* create single instance for prisma client ([879250c](https://github.com/oae/kaizoku/commit/879250c0238c8f2c1f9b4139518b3bd4c0a556d4))
* dont create multiple prisma clients ([cea8da2](https://github.com/oae/kaizoku/commit/cea8da23abd990b40196661cb7843475590483c3))
* filter empty result ([977b3d8](https://github.com/oae/kaizoku/commit/977b3d8c321cfe6a37b74b3880adce46cfa7643d))
* hide navbar if window is too narrow ([1abe552](https://github.com/oae/kaizoku/commit/1abe552f23781763282bca2f498e36d6f3cb5bb3))
* rate limit notifications ([20ada9b](https://github.com/oae/kaizoku/commit/20ada9ba1abb69594e1998cda347b9faaec2d037))
* remove metadata when manga is removed ([76b688f](https://github.com/oae/kaizoku/commit/76b688f889d6d87d8951626013c7d0c901d388df))
* remove minutely from intervals ([bc5b14c](https://github.com/oae/kaizoku/commit/bc5b14c1c071e3b6ef09f2d40bd5515fb4ca941b))
* search selection ([216b926](https://github.com/oae/kaizoku/commit/216b9261e04e91a78c7e6729cc4b86c24be520b9))
* show error if user tries to add same manga ([cc2d6dd](https://github.com/oae/kaizoku/commit/cc2d6dda60a2854951c50d7e148dc0409f400276))
