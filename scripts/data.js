// NOISE prototype data. Loaded before app.js; keep this file free of DOM work.
var T={
  tesla:{name:"Tesla",kind:"trending",fc:540,deg:612,zone:"Rising",up:true,sent:64,user:"@gigafactory",chg:8,
    rel:"Optimus is Tesla's bet that the same stack driving its cars can drive a humanoid. Every demo doubles as a referendum on the whole category.",
    theme:["#3A4255","#8AA1F2","#C9CDD6"],media:[{k:"img"}]},
  elonmusk:{name:"Elon Musk",kind:"trending",fc:880,deg:540,zone:"Cooling",up:false,sent:48,user:"@firstprinciples",chg:-3,
    rel:"The loudest voice pulling attention and capital toward humanoids. One post can move the entire category up or down.",
    theme:["#55452F","#CAA46A","#E8DCC8"],media:[{k:"img"}]},
  figureai:{name:"Figure",kind:"trending",fc:260,deg:410,zone:"Rising",up:true,sent:70,user:"@figure",chg:14,
    rel:"The best-funded pure-play humanoid startup, already shipping pilots into real factories. Commercial proof the hype has waited for.",
    theme:["#3B2F55","#9A86E0","#D8CFF0"],media:[{k:"img"}]},
  onex:{name:"1X Technologies",kind:"trending",fc:120,deg:305,zone:"Emerging",up:true,sent:78,user:"@neo",chg:22,
    rel:"The quiet challenger building home humanoids with an eerily human gait. A breakout NEO moment could re-rate the space.",
    theme:["#2F5547","#54D9A6","#CFEAD9"],media:[{k:"img"}]},
  humanoidrobots:{name:"Humanoid Robots",kind:"trending",fc:318,deg:560,zone:"Rising",up:true,sent:70,user:"@eloquent",
    sub:[{id:"tesla",impact:34},{id:"figureai",impact:24},{id:"elonmusk",impact:24},{id:"onex",impact:18}],
    rel:"Exploding as every big lab races a walking robot to market and the demos keep going viral.",
    watch:"Factories, founders and hobbyists are all chasing the same arms-and-legs moment at once.",
    forecasters:"318 curators",theme:["#2B3A55","#5B8DEF","#C9CDD6"],img:"media/img/submission-images/426a0f54-8ce3-4264-8adf-bab474fb8780.png",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Optimus_Tesla.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Tesla-optimus-bot-gen-2-scaled.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Atlas_robot_3D_model.png?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The future started standing up.",c:["#2B3A55","#C9CDD6"]}]},
  dopaminesites:{name:"Dopamine Sites",kind:"niche",fc:47,deg:205,zone:"Cult following",up:true,sent:90,user:"@jerry",
    rel:"A small crowd obsessed with sites engineered to be impossible to close. 90% say it grows.",
    watch:"Designers and behavior nerds keep dissecting the loops that keep you tapping.",
    forecasters:"47 curators",theme:["#FF2E63","#08D9D6","#1A1A2E"],img:"media/img/submission-images/84803815-47d1-45b8-97ce-931cb108a224.jpg",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Built to be impossible to put down.",c:["#FF2E63","#1A1A2E"]}]},
  gameboymod:{name:"Game Boy Modding Culture",kind:"niche",fc:38,deg:180,zone:"Cult following",up:true,sent:93,user:"@dumb",
    rel:"Tiny scene, near-total belief. 93% of 38 die-hards back backlit screens and custom shells.",
    watch:"Solderers and collectors building, swapping and filming mods for each other.",
    forecasters:"38 curators",theme:["#3A4750","#8FBC8F","#1C2126"],img:"media/img/submission-images/1323c6d3-ac28-472e-9803-8c0955e90d66.png",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Game-Boy-Original.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Nintendo_Game_Boy%2C_Game_Boy_Pocket%2C_Game_Boy_Light_and_Game_Boy_Color_Tietokonemuseo.JPG?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Nintendo-Game-Boy-Advance-Purple-FL.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Old plastic, brand-new light.",c:["#3A4750","#1C2126"]}]},
  ninetiesnostalgia:{name:"90s Nostalgia",kind:"niche",fc:72,deg:240,zone:"Cult following",up:true,sent:88,user:"@barry",
    rel:"A devoted crowd mining the decade for fonts, fits and TV that feel warmer than now.",
    watch:"Fashion, music and design all pulling from the same VHS-era well at once.",
    forecasters:"72 curators",theme:["#6C5CE7","#00CEC9","#2D3436"],img:"media/img/submission-images/907fdf4d-2cdd-4562-aa59-7f2fa75f6aa0.png",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Everything old is the new aesthetic.",c:["#6C5CE7","#2D3436"]}]},
  starwars:{name:"Star Wars",kind:"trending",fc:540,deg:430,zone:"Loud but empty",up:false,sent:58,user:"@cantina",
    rel:"Loud and everywhere ahead of the next release, but the discourse is louder than the love.",
    watch:"Lots of trailers and takes, fewer new ideas. A fan cool-off may be near.",
    forecasters:"540 curators",theme:["#0B0B0F","#E8B923","#2B6CB0"],img:"media/img/assets/428b1820-1c4b-4d57-9e13-129fc6699ac8.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Stormtrooper_Star_Wars_Cosplay_-_MCM_Comic_Con_2016_(27122905180).jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Cosplay_de_Stormtrooper_F%C3%A9minin_et_Masculin_%C3%A0_Star_Wars_%C3%A0_Japan_Expo_2014_(14506269310).jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Imperial_stormtrooper_costume.JPG?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"A galaxy that never logs off.",c:["#0B0B0F","#2B6CB0"]}]},
  cgm:{name:"CGM & Metabolic Biohacking",kind:"niche",fc:64,deg:220,zone:"Cult following",up:true,sent:89,user:"@glucose",
    rel:"A growing health crowd wearing glucose monitors and treating every meal like a data point.",
    watch:"Wearables, supplements and influencers all converging on the blood-sugar graph.",
    forecasters:"64 curators",theme:["#2F9E44","#E03131","#1B1B1B"],img:"media/img/assets/d80692b0-b72f-41a5-8e77-1bccd2e0e2bd.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Your breakfast is now a chart.",c:["#2F9E44","#1B1B1B"]}]},
  blindboxes:{name:"Blind Boxes",kind:"niche",fc:95,deg:260,zone:"Cult following",up:true,sent:87,user:"@popmart",
    rel:"Collectible mystery figures turning unboxing into a habit with serious resale energy.",
    watch:"Toy drops, resale and ASMR unboxings feeding a tight, obsessive loop.",
    forecasters:"95 curators",theme:["#F06595","#FFD43B","#3B1F2B"],img:"media/img/assets/223281d8-b247-417a-9fee-e4d3fdd2168f.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"You never know what you paid for.",c:["#F06595","#3B1F2B"]}]},
  tastewashing:{name:"Tastewashing",kind:"niche",fc:33,deg:165,zone:"Cult following",up:true,sent:91,user:"@thequietedit",
    rel:"A sharp little crowd naming the way brands borrow taste to look deeper than they are.",
    watch:"Critics and designers calling out curation used as a costume.",
    forecasters:"33 curators",theme:["#A8A296","#E7E2D6","#3A3833"],img:"media/img/assets/5f7ec7eb-5f3c-477d-a984-8b1cc3a2a413.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Curation as camouflage.",c:["#A8A296","#3A3833"]}]},
  snapspecs:{name:"Snap Specs",kind:"niche",fc:41,deg:175,zone:"Cult following",up:true,sent:86,user:"@dirkdiggler",
    rel:"Early adopters betting camera glasses finally cross from gimmick to everyday wear.",
    watch:"Creators testing hands-free capture while the privacy debate simmers.",
    forecasters:"41 curators",theme:["#FFD400","#1A1A1A","#444444"],img:"media/img/submission-images/eed68849-8dfb-4fdd-bae6-822bf38a8fa4.png",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/A_Google_Glass_wearer.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Google_executive_Amanda_Rosenberg_modeling_the_Google_Glass_face_mounted_wearable_computer.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Google_Glass_detail.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The camera moved to your face.",c:["#FFD400","#444444"]}]},
  irl:{name:"IRL",kind:"trending",fc:290,deg:445,zone:"Rising",up:true,sent:66,user:"@offline",
    rel:"A backlash crowd pushing real-world hangs over screens, and meaning it this time.",
    watch:"Run clubs, supper clubs and phone-free events feeding the same offline urge.",
    forecasters:"290 curators",theme:["#E8A87C","#C38D9E","#41B3A3"],img:"media/img/assets/0d7c47f6-b997-406f-ac11-6525a1f88a33.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Touch grass, but make it a scene.",c:["#E8A87C","#41B3A3"]}]},
  prowrestling:{name:"Pro Wrestling",kind:"niche",fc:88,deg:235,zone:"Cult following",up:true,sent:85,user:"@kayfabe",
    rel:"A loyal base riding a new ratings high as storylines spill onto every timeline.",
    watch:"Promos, returns and clips crossing over to people who swore they didn't watch.",
    forecasters:"88 curators",theme:["#C92A2A","#1A1A1A","#FCC419"],img:"media/img/assets/5943048b-358c-4e7a-ad63-3687e18609aa.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/TNA_ring.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Fake fights, very real feelings.",c:["#C92A2A","#FCC419"]}]},
  analog:{name:"Analog",kind:"niche",fc:52,deg:190,zone:"Cult following",up:true,sent:92,user:"@grain",
    rel:"Film cameras, tapes and paper as a quiet rebellion against the frictionless feed.",
    watch:"Photographers and writers choosing slow, physical media on purpose.",
    forecasters:"52 curators",theme:["#8C7B6B","#D8C3A5","#3E3A35"],img:"media/img/assets/9801a004-ac42-4b7d-a7fc-3ecef457c5bd.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Vintage_Honeywell_Pentax_Spotmatic_F_35mm_SLR_Film_Camera%2C_Made_In_Japan%2C_Model_Introduced_In_1973_(25683132294).jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Friction is the feature.",c:["#8C7B6B","#3E3A35"]}]},
  bearmarket:{name:"Bear Market",kind:"trending",fc:433,deg:410,zone:"Loud but empty",up:false,sent:38,user:"@redcandle",
    rel:"Fear is loud and everywhere as red candles dominate the feed and the mood.",
    watch:"Lots of doom takes, little conviction. Sentiment looks washed out.",
    forecasters:"433 curators",theme:["#C92A2A","#1A1A1A","#6B1414"],img:"media/img/assets/60da7ddd-3b63-4141-aac5-7aa553b68b16.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Stockbrokers_at_the_New_York_Stock_Exchange.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Wall_Street%2C_1890.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Everyone's an analyst when it's red.",c:["#C92A2A","#6B1414"]}]},
  obsession:{name:"Obsession",kind:"niche",fc:49,deg:210,zone:"Cult following",up:true,sent:89,user:"@fixation",
    rel:"A small crowd romanticizing total fixation, from hobbies to people, with no apology.",
    watch:"Creators turning single-minded obsession into an aesthetic and a flex.",
    forecasters:"49 curators",theme:["#7B1E2B","#E0635A","#1A0E10"],img:"media/img/assets/512626af-c2cf-450a-8e9b-570f9944a22f.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Go all in or go home.",c:["#7B1E2B","#1A0E10"]}]},
  slop:{name:"Slop",kind:"trending",fc:372,deg:480,zone:"Loud but empty",up:false,sent:44,user:"@feedlot",
    rel:"AI-generated junk is flooding every feed and the backlash is now louder than the output.",
    watch:"Platforms, creators and users all fighting over what counts as real anymore.",
    forecasters:"372 curators",theme:["#6B705C","#A5A58D","#2B2B26"],img:"media/img/assets/e79bd26e-e00a-40f5-bce4-f23272b378a4.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The feed is full and empty.",c:["#6B705C","#2B2B26"]}]},
  coinbase:{name:"Coinbase",kind:"trending",fc:388,deg:450,zone:"Rising",up:true,sent:61,user:"@onchain",
    rel:"Back in the spotlight as crypto rallies and the exchange becomes the mainstream on-ramp.",
    watch:"Earnings, listings and policy moves all landing on the same ticker.",
    forecasters:"388 curators",theme:["#1652F0","#0A1F66","#9DB7FF"],img:"media/img/assets/markets/coinbase.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The front door to on-chain.",c:["#1652F0","#9DB7FF"]}]},
  claude:{name:"Claude",kind:"trending",fc:410,deg:520,zone:"Rising",up:true,sent:74,user:"@claudehead",
    rel:"Climbing fast as devs and writers make it the default for serious work, not just chat.",
    watch:"New model drops and agent demos pulling builders over in waves.",
    forecasters:"410 curators",theme:["#D97757","#1F1B17","#E8DCC8"],img:"media/img/assets/markets/claude.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Quietly becoming the workhorse.",c:["#D97757","#E8DCC8"]}]},
  calisthenics:{name:"Calisthenics",kind:"niche",fc:90,deg:245,zone:"Cult following",up:true,sent:88,user:"@barstar",
    rel:"Bodyweight training crowd growing as parks become the new gym and the new content set.",
    watch:"Street workouts, skill progressions and minimalist fitness all feeding it.",
    forecasters:"90 curators",theme:["#495057","#ADB5BD","#212529"],img:"media/img/assets/fb12630b-5256-450e-8b9b-bc74b4fb1a5c.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"No gym, no excuses.",c:["#495057","#212529"]}]},
  chatgpt:{name:"ChatGPT",kind:"trending",fc:612,deg:540,zone:"Rising",up:true,sent:66,user:"@promptly",
    rel:"Still the household name for AI, setting the pace every other tool gets measured against.",
    watch:"Feature drops and outages alike move the whole category's mood.",
    forecasters:"612 curators",theme:["#10A37F","#0E2A24","#74E0C0"],img:"media/img/assets/markets/chatgpt.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The word that became the category.",c:["#10A37F","#74E0C0"]}]},
  agi:{name:"AGI",kind:"trending",fc:455,deg:580,zone:"Rising",up:true,sent:69,user:"@singular",
    rel:"The biggest bet in tech: every lab milestone reignites the timeline debate at full volume.",
    watch:"Researchers, founders and doomers all arguing the same charts.",
    forecasters:"455 curators",theme:["#5F3DC4","#3B5BDB","#0B1026"],img:"media/img/assets/04945dd8-fc2f-4271-91b9-e8694f58c1cc.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The argument that won't end.",c:["#5F3DC4","#0B1026"]}]},
  looksmaxxing:{name:"Looksmaxxing",kind:"trending",fc:360,deg:470,zone:"Rising",up:true,sent:63,user:"@mewing",
    rel:"Self-optimization for the face and physique gone mainstream, and slightly out of control.",
    watch:"Skincare, surgery and pseudo-science colliding in the same feeds.",
    forecasters:"360 curators",theme:["#495867","#BDC3C7","#1C2833"],img:"media/img/assets/c3b8ab2d-a8c3-4a67-b773-d1591b7457bd.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Self-improvement, dialed to eleven.",c:["#495867","#1C2833"]}]},
  tcm:{name:"Traditional Chinese Medicine",kind:"niche",fc:76,deg:215,zone:"Cult following",up:true,sent:87,user:"@meridian",
    rel:"Ancient remedies finding a young wellness audience hunting alternatives to the pharmacy.",
    watch:"Herbs, acupuncture and rituals reframed as modern self-care.",
    forecasters:"76 curators",theme:["#A61E22","#E0A030","#1A1010"],img:"media/img/assets/21ac1748-8d38-48e4-84c5-92738874e95e.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Old medicine, new believers.",c:["#A61E22","#1A1010"]}]},
  zyns:{name:"Zyns",kind:"niche",fc:84,deg:230,zone:"Cult following",up:true,sent:85,user:"@upperdecky",
    rel:"Nicotine pouches turning into an office-and-gym habit with its own loud subculture.",
    watch:"Flavors, memes and moral panic all keeping it on the timeline.",
    forecasters:"84 curators",theme:["#E9ECEF","#1971C2","#212529"],img:"media/img/assets/markets/zyns.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/ZYN_US_Nicotine_Pouches.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Nicotine_pouches.png?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The pocket habit went mainstream.",c:["#E9ECEF","#212529"]}]},
  vibecoding:{name:"Vibe Coding",kind:"trending",fc:430,deg:500,zone:"Rising",up:true,sent:72,user:"@shipfast",
    rel:"Building software by describing it to AI is minting a new wave of one-person shippers.",
    watch:"Founders, designers and total beginners all shipping apps over a weekend.",
    forecasters:"430 curators",theme:["#37B24D","#0B1F12","#8CE99A"],img:"media/img/assets/markets/vibecoding.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Describe it, ship it.",c:["#37B24D","#8CE99A"]}]},
  wearables:{name:"Wearables",kind:"trending",fc:340,deg:420,zone:"Rising",up:true,sent:64,user:"@quantified",
    rel:"Rings, watches and patches racing to own your sleep, stress and recovery scores.",
    watch:"New sensors and subscriptions turning the body into a dashboard.",
    forecasters:"340 curators",theme:["#0C8599","#0B1E22","#63E6E2"],img:"media/img/assets/bc166043-464b-401f-a9a3-e6cfea32deac.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Fitbit_Alta_HR.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Your body, now a subscription.",c:["#0C8599","#63E6E2"]}]},
  runclubs:{name:"Run Clubs",kind:"trending",fc:264,deg:495,zone:"Rising",up:true,sent:72,user:"@pacers",
    rel:"Surging as social run clubs turn into the new nightlife and the new dating app.",
    watch:"Brands, cafes and singles scenes all colliding around the morning long run.",
    forecasters:"264 curators",theme:["#E8552B","#1C1C1C","#F2B33D"],img:"media/img/assets/2e59e47d-a903-4547-9b9b-3b2cd5ebf1a7.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Marathon_Runners.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/USMC_Marathon.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The 6am run became the after-party.",c:["#E8552B","#F2B33D"]}]},
  gtavi:{name:"GTA VI",kind:"trending",fc:580,deg:560,zone:"Rising",up:true,sent:68,user:"@viceloop",
    rel:"The most anticipated game in years, where every leak and trailer detonates across the feed.",
    watch:"Release-date rumors and frame-by-frame trailer reads keeping it red-hot.",
    forecasters:"580 curators",theme:["#E64980","#0CA678","#1A0E1A"],img:"media/img/assets/771f317a-6c23-41ff-b096-e091177e551b.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"A whole internet waiting on one game.",c:["#E64980","#1A0E1A"]}]},
  silvertsunami:{name:"Silver Tsunami",kind:"trending",fc:210,deg:380,zone:"Loud but empty",up:false,sent:55,user:"@greypower",
    rel:"The aging-population wave reshaping housing, care and labor faster than policy can react.",
    watch:"Boomers retiring and downsizing all at once, rippling across markets.",
    forecasters:"210 curators",theme:["#ADB5BD","#495057","#DEE2E6"],img:"media/img/assets/markets/silvertsunami.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Old_couple_in_love.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Demographics are destiny.",c:["#ADB5BD","#DEE2E6"]}]},
  pokemon:{name:"Pokémon",kind:"trending",fc:520,deg:460,zone:"Rising",up:true,sent:62,user:"@pallet",
    rel:"The card market is roaring again as nostalgia and resale collide on every pull.",
    watch:"Set drops, grading and influencer openings driving prices and views.",
    forecasters:"520 curators",theme:["#E3350D","#FFCB05","#1A1A1A"],img:"media/img/assets/db9242ec-8607-4efe-939a-52a8c06a002a.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Pok%C3%A9mon_Trading_Card_Vending_machine.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Gotta resell 'em all.",c:["#E3350D","#1A1A1A"]}]},
  microdramas:{name:"Micro Dramas",kind:"trending",fc:300,deg:440,zone:"Rising",up:true,sent:65,user:"@verticut",
    rel:"Vertical, minute-long soap operas are exploding into a real, money-making format.",
    watch:"Studios and apps racing to feed an audience that binges in the elevator.",
    forecasters:"300 curators",theme:["#D6336C","#2B0B1A","#F783AC"],img:"media/img/assets/9a680df5-a77c-42d0-8dc6-11d8ef18ba56.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"A whole season before your floor.",c:["#D6336C","#F783AC"]}]},
  ukunderground:{name:"UK Underground",kind:"niche",fc:70,deg:250,zone:"Cult following",up:true,sent:86,user:"@bassline",
    rel:"A devoted scene pushing the next wave of UK club sounds before the mainstream catches on.",
    watch:"Pirate-radio energy, dubplates and warehouse nights feeding it from below.",
    forecasters:"70 curators",theme:["#5F3DC4","#0B0B14","#22B8CF"],img:"media/img/assets/b05feea4-95a4-4c73-ae96-c822d66b60d1.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/BCM-nightclub-mallorca-20.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The sound gets here before the trend.",c:["#5F3DC4","#22B8CF"]}]},
  privatecredit:{name:"Private Credit",kind:"trending",fc:240,deg:400,zone:"Rising",up:true,sent:57,user:"@directlend",
    rel:"The trillion-dollar shadow-lending boom that's quietly eating the banks' lunch.",
    watch:"Funds, defaults and regulators all circling the same fast-growing pool.",
    forecasters:"240 curators",theme:["#1C3D5A","#C9A227","#0B1A26"],img:"media/img/assets/dd624377-ff84-47af-8213-8f4d28323a61.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The banks' lunch, eaten quietly.",c:["#1C3D5A","#0B1A26"]}]},
  unemployment:{name:"Unemployment",kind:"trending",fc:280,deg:390,zone:"Loud but empty",up:false,sent:40,user:"@pinkslip",
    rel:"Layoff anxiety is everywhere as white-collar cuts and AI fears feed the same dread.",
    watch:"Jobs data and layoff posts setting the mood for the whole market.",
    forecasters:"280 curators",theme:["#868E96","#343A40","#CED4DA"],img:"media/img/assets/10124e42-a821-4c93-91e5-dabebf482828.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Everyone's updating their resume.",c:["#868E96","#CED4DA"]}]},
  peptides:{name:"Peptides",kind:"niche",fc:86,deg:240,zone:"Cult following",up:true,sent:88,user:"@reconst",
    rel:"A biohacking crowd chasing recovery and longevity through a gray-market pharmacy.",
    watch:"Influencers and clinics normalizing compounds the FDA hasn't blessed.",
    forecasters:"86 curators",theme:["#1971C2","#E9ECEF","#0B1E2E"],img:"media/img/assets/markets/peptides.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"The gray-market fountain of youth.",c:["#1971C2","#0B1E2E"]}]},
  eggs:{name:"Eggs",kind:"trending",fc:260,deg:405,zone:"Loud but empty",up:false,sent:47,user:"@gradea",
    rel:"The humble egg became a macro story: prices, shortages and politics in one carton.",
    watch:"Bird-flu headlines and grocery sticker shock keeping it weirdly loud.",
    forecasters:"260 curators",theme:["#F1E3C6","#C9A24B","#3A2E1A"],img:"media/img/assets/70de2e31-7ad9-4611-b3dc-8986adc61e48.avif",
    imgs:["https://commons.wikimedia.org/wiki/Special:FilePath/Freerange_eggs.jpg?width=900","https://commons.wikimedia.org/wiki/Special:FilePath/Evergreen_Fresh_Eggs_Carton_at_HKCT_Kwun_Tong.jpg?width=900"],
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"A dozen reasons to panic.",c:["#F1E3C6","#3A2E1A"]}]},
  attentioneconomy:{name:"Attention Economy",kind:"trending",fc:350,deg:470,zone:"Rising",up:true,sent:60,user:"@doomscroll",
    rel:"The fight for your eyeballs is the real market, and everyone's finally naming the game.",
    watch:"Platforms, creators and critics all trading takes on the cost of the scroll.",
    forecasters:"350 curators",theme:["#212529","#F03E3E","#868E96"],img:"media/img/assets/markets/attentioneconomy.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Your attention is the product.",c:["#212529","#868E96"]}]},
  sportsbetting:{name:"Sports Betting",kind:"trending",fc:470,deg:510,zone:"Rising",up:true,sent:64,user:"@parlay",
    rel:"Legal betting is now woven into every broadcast, group chat and bad Sunday decision.",
    watch:"Apps, odds and bad-beat clips turning every game into a position.",
    forecasters:"470 curators",theme:["#2F9E44","#0B1F12","#FFD43B"],img:"media/img/assets/markets/sportsbetting.avif",
    media:[{k:"img"},{k:"img"},{k:"img"},{k:"quote",src:"editorial · NOISE",q:"Every game is a position now.",c:["#2F9E44","#FFD43B"]}]}
};
var REL_MAX=700;
var ORDERS={
  all:["humanoidrobots","dopaminesites","gameboymod","ninetiesnostalgia","starwars","cgm","blindboxes","tastewashing","snapspecs","irl","prowrestling","analog","bearmarket","obsession","slop","coinbase","claude","calisthenics","chatgpt","agi","looksmaxxing","tcm","zyns","vibecoding","wearables","runclubs","gtavi","silvertsunami","pokemon","microdramas","ukunderground","privatecredit","unemployment","peptides","eggs","attentioneconomy","sportsbetting","tesla","figureai","elonmusk","onex"],
  trending:["humanoidrobots","claude","chatgpt","agi","gtavi","irl","runclubs","vibecoding","sportsbetting","looksmaxxing","coinbase","pokemon","wearables","microdramas","starwars","slop","bearmarket","attentioneconomy","unemployment","eggs","privatecredit","silvertsunami"],
  niche:["dopaminesites","gameboymod","ninetiesnostalgia","cgm","blindboxes","tastewashing","snapspecs","prowrestling","analog","obsession","calisthenics","tcm","zyns","ukunderground","peptides"]};
var order=ORDERS.all.slice();

// ===== Forces: cultural drivers behind each trend (navigable + searchable) =====
var FP=[["#3A2F55","#9A86E0","#D8CFF0"],["#1E3B33","#54D9A6","#CFEAD9"],["#2A3550","#8AA1F2","#CBD6F5"],["#2A3B2F","#7FAE8A","#D8E6DC"],["#4A2B1C","#E0876A","#F2D8CC"],["#4B1528","#ED93B1","#F7D6E2"],["#3A2A0E","#F2B33D","#F7E2B8"],["#26262B","#8A8A92","#D6D6DC"],["#3A241B","#D9866B","#F0D3C6"],["#3A1A1A","#E0635A","#F2C9C6"]];
var FORCEDEFS=[
 ["tiktok","TikTok",590,true,62,2,5,"Quietly mints most of culture's short-form fads."],
 ["tamagotchi","Tamagotchi",260,true,83,14,5,"The pocket pet re-released to '90s kids with money now."],
 ["kurtcobain","Kurt Cobain",520,true,78,5,3,"Patron saint of '90s authenticity every nostalgia wave circles back to."],
 ["grogu","Grogu",360,true,80,9,3,"Baby Yoda — the merch-printing heart of modern Star Wars."],
 ["disney","Disney",420,false,52,-4,2,"The IP machine the whole franchise economy orbits."],
 ["bryanjohnson","Bryan Johnson",470,true,66,7,2,"'Don't Die' turned one longevity protocol into a spectator sport."],
 ["levels","Levels",300,true,79,11,1,"The CGM startup that made glucose a status metric."],
 ["labubu","Labubu",410,true,86,20,5,"The toothy monster that turned blind boxes into a frenzy."],
 ["popmart","Pop Mart",380,true,81,11,4,"Gamified collecting into a dopamine machine."],
 ["metaraybans","Meta Ray-Bans",350,true,76,13,7,"Making face-computers feel normal first."],
 ["wwe","WWE",360,true,75,6,9,"The kayfabe empire turning scripted rivalries into real money."],
 ["vinyl","Vinyl Revival",280,true,82,8,4,"The format that refuses to die and keeps pulling analog forward."],
 ["filmcameras","Film Cameras",270,true,84,9,7,"Point-and-shoots back as the aesthetic of choice."],
 ["thefed","The Fed",420,false,48,-2,7,"The rate-setter every market trend answers to."],
 ["bitcoin","Bitcoin",580,true,60,6,6,"Its mood sets the tone for every on-chain trend."],
 ["openai","OpenAI",600,true,70,4,1,"The default face of the AI era; every release resets the category."],
 ["anthropic","Anthropic",540,true,75,9,8,"Making safe, steerable AI the quiet workhorse of the boom."],
 ["samaltman","Sam Altman",560,true,64,3,2,"The operator the AI market reads like scripture."],
 ["nvidia","Nvidia",640,true,72,6,3,"The picks-and-shovels king every AI trend runs on."],
 ["cursor","Cursor",480,true,79,16,0,"Made 'vibe coding' a way of building, not a meme."],
 ["clavicular","Clavicular",330,true,84,18,0,"The looksmaxxing influencer who turned bone structure into a scoreboard."],
 ["mewing","Mewing",285,true,80,12,1,"The jaw technique that became looksmaxxing's gateway."],
 ["acupuncture","Acupuncture",250,true,83,7,9,"The most legible on-ramp into TCM for skeptics."],
 ["nicotinepouches","Nicotine Pouches",320,true,80,11,2,"The category Zyns turned into a lifestyle."],
 ["whoop","Whoop",360,true,70,8,2,"Made recovery scores a personality trait."],
 ["oura","Oura",370,true,73,9,0,"Put biometrics on the dinner table."],
 ["strava","Strava",430,true,74,10,4,"Turned running into a public, social scoreboard."],
 ["rockstar","Rockstar Games",560,true,71,7,7,"Every leak moves an entire entertainment cycle."],
 ["poketcg","Pokémon TCG",430,true,77,12,6,"Cards that turned nostalgia into a speculative asset."],
 ["reelshort","ReelShort",410,true,74,15,4,"Industrializing vertical soap operas."],
 ["grime","Grime",300,true,80,10,0,"Underwrites a lot of UK underground's energy."],
 ["jungle","Jungle",290,true,79,9,3,"The 30-year-old genre powering today's club revival."],
 ["apollo","Apollo",380,true,58,4,2,"The asset manager synonymous with private credit."],
 ["aiagents","AI Agents",520,true,71,14,1,"Autonomous software reshaping what 'unemployment' means."],
 ["birdflu","Bird Flu",300,true,58,9,4,"Turning egg prices into a national storyline."],
 ["inflation","Inflation",380,false,44,-3,7,"The macro mood pricing every everyday trend."],
 ["draftkings","DraftKings",500,true,63,5,3,"Half the duopoly normalizing a bet on every screen."],
 ["fanduel","FanDuel",505,true,64,6,2,"Same screens, same dopamine, bigger spend."],
 ["chrisheria","Chris Heria",320,true,78,10,7,"The bodyweight evangelist who made calisthenics aspirational."]
];
FORCEDEFS.forEach(function(f){ if(!T[f[0]]){T[f[0]]={name:f[1],kind:"trending",fc:Math.round(40+f[2]*0.6),deg:f[2],zone:f[3]?"Rising":"Cooling",up:f[3],sent:f[4],user:"@"+f[0],chg:f[5],theme:FP[f[6]],rel:f[7],media:[{k:"img"}]}; if(ORDERS.all.indexOf(f[0])<0){ORDERS.all.push(f[0]);order.push(f[0]);}} });
var SUBMAP={
 claude:[["anthropic",46],["chatgpt",30],["agi",26],["vibecoding",20]],
 chatgpt:[["samaltman",34],["agi",28],["claude",24],["anthropic",20]],
 agi:[["elonmusk",40],["samaltman",34],["claude",28],["chatgpt",22]],
 anthropic:[["claude",46],["agi",30],["chatgpt",24],["samaltman",20]],
 openai:[["samaltman",40],["chatgpt",30],["agi",26],["anthropic",20]],
 samaltman:[["chatgpt",36],["agi",30],["anthropic",24],["elonmusk",20]],
 vibecoding:[["claude",38],["chatgpt",30],["agi",24],["anthropic",20]],
 slop:[["chatgpt",34],["agi",28],["tiktok",24],["attentioneconomy",20]],
 humanoidrobots:[["figureai",44],["onex",36],["tesla",26],["agi",20]],
 figureai:[["humanoidrobots",44],["onex",34],["tesla",26],["agi",20]],
 onex:[["humanoidrobots",42],["figureai",34],["tesla",26],["agi",20]],
 tesla:[["elonmusk",46],["humanoidrobots",30],["figureai",24],["onex",20]],
 elonmusk:[["tesla",44],["samaltman",30],["agi",26],["humanoidrobots",22]],
 coinbase:[["bearmarket",40]],
 bearmarket:[["privatecredit",44],["coinbase",36],["unemployment",24]],
 privatecredit:[["bearmarket",42],["coinbase",30],["unemployment",22]],
 unemployment:[["agi",38],["bearmarket",28],["slop",22],["privatecredit",18]],
 eggs:[["bearmarket",38],["unemployment",28],["privatecredit",20]],
 gtavi:[["rockstar",50],["pokemon",26],["gameboymod",22],["starwars",18]],
 rockstar:[["gtavi",50],["pokemon",26],["gameboymod",22],["starwars",18]],
 pokemon:[["blindboxes",38],["gameboymod",28],["gtavi",22],["ninetiesnostalgia",18]],
 gameboymod:[["ninetiesnostalgia",38],["analog",30],["pokemon",24],["filmcameras",20]],
 starwars:[["pokemon",36],["blindboxes",28],["ninetiesnostalgia",24],["gtavi",20]],
 looksmaxxing:[["clavicular",42],["mewing",34],["calisthenics",26],["wearables",20]],
 clavicular:[["looksmaxxing",42],["mewing",34],["calisthenics",24],["wearables",18]],
 mewing:[["looksmaxxing",40],["clavicular",34],["calisthenics",24],["wearables",18]],
 calisthenics:[["looksmaxxing",36],["runclubs",28],["wearables",24],["mewing",20]],
 runclubs:[["calisthenics",38],["wearables",28],["irl",24],["cgm",18]],
 wearables:[["agi",36],["cgm",30],["calisthenics",24],["peptides",20]],
 cgm:[["wearables",40],["peptides",30],["calisthenics",24],["looksmaxxing",18]],
 peptides:[["cgm",38],["wearables",28],["looksmaxxing",22],["calisthenics",18]],
 zyns:[["looksmaxxing",34],["calisthenics",28],["peptides",22],["irl",18]],
 attentioneconomy:[["dopaminesites",44],["tiktok",34],["slop",24],["irl",20]],
 dopaminesites:[["attentioneconomy",44],["tiktok",34],["slop",24],["irl",20]],
 tiktok:[["attentioneconomy",40],["dopaminesites",32],["slop",26],["irl",20]],
 irl:[["tiktok",38],["attentioneconomy",28],["dopaminesites",24],["runclubs",18]],
 obsession:[["dopaminesites",36],["blindboxes",28],["attentioneconomy",24],["looksmaxxing",18]],
 ninetiesnostalgia:[["kurtcobain",38],["gameboymod",30],["analog",26],["filmcameras",20]],
 kurtcobain:[["ninetiesnostalgia",40],["analog",30],["filmcameras",24],["gameboymod",18]],
 analog:[["filmcameras",40],["ninetiesnostalgia",30],["gameboymod",24],["kurtcobain",18]],
 filmcameras:[["analog",42],["ninetiesnostalgia",30],["kurtcobain",24],["gameboymod",18]],
 blindboxes:[["pokemon",38],["tastewashing",28],["obsession",24],["starwars",18]],
 tastewashing:[["blindboxes",34],["analog",26],["obsession",22],["slop",18]],
 prowrestling:[["wwe",50],["irl",24],["obsession",20],["gtavi",18]],
 wwe:[["prowrestling",50],["irl",24],["obsession",20],["gtavi",18]]
};
Object.keys(SUBMAP).forEach(function(k){ if(!T[k])return; T[k].sub=SUBMAP[k].map(function(p){return {id:p[0],impact:p[1]};});
  SUBMAP[k].forEach(function(p){var st=T[p[0]]; if(st&&st.chg==null)st.chg=(st.up?1:-1)*Math.max(1,Math.round((st.sent-50)/4));}); });
var feedKind="trending";
var CUR={
  humanoidrobots:{calls:47,hit:0.76,rallied:229,yf:4,col:"#9fb6ef"},
  dopaminesites:{calls:17,hit:0.89,rallied:34,yf:2,col:"#ff8fb0"},
  gameboymod:{calls:16,hit:0.87,rallied:27,yf:2,col:"#b8d6b8"},
  ninetiesnostalgia:{calls:20,hit:0.86,rallied:52,yf:2,col:"#a99cf0"},
  starwars:{calls:71,hit:0.58,rallied:389,yf:4,col:"#e8cf7a"},
  cgm:{calls:19,hit:0.85,rallied:46,yf:2,col:"#7ec98a"},
  blindboxes:{calls:22,hit:0.88,rallied:68,yf:2,col:"#f59ac0"},
  tastewashing:{calls:16,hit:0.89,rallied:24,yf:2,col:"#cfc8b8"},
  snapspecs:{calls:17,hit:0.9,rallied:30,yf:2,col:"#ffe066"},
  irl:{calls:18,hit:0.86,rallied:42,yf:2,col:"#eec4a8"},
  prowrestling:{calls:22,hit:0.88,rallied:63,yf:2,col:"#e36a6a"},
  analog:{calls:18,hit:0.87,rallied:37,yf:2,col:"#cbb7a0"},
  bearmarket:{calls:60,hit:0.61,rallied:312,yf:4,col:"#e36a6a"},
  obsession:{calls:17,hit:0.84,rallied:35,yf:2,col:"#e89089"},
  slop:{calls:53,hit:0.6,rallied:268,yf:4,col:"#b3b39a"},
  coinbase:{calls:55,hit:0.8,rallied:279,yf:4,col:"#7e9cf5"},
  claude:{calls:57,hit:0.78,rallied:295,yf:4,col:"#e8a98f"},
  calisthenics:{calls:22,hit:0.9,rallied:65,yf:2,col:"#aeb4ba"},
  chatgpt:{calls:79,hit:0.76,rallied:441,yf:4,col:"#6fd9bc"},
  agi:{calls:62,hit:0.81,rallied:328,yf:4,col:"#9d8ae0"},
  looksmaxxing:{calls:52,hit:0.76,rallied:259,yf:4,col:"#c2c8cd"},
  tcm:{calls:20,hit:0.9,rallied:55,yf:2,col:"#e0a86a"},
  zyns:{calls:21,hit:0.84,rallied:60,yf:2,col:"#74a9e0"},
  vibecoding:{calls:59,hit:0.8,rallied:310,yf:4,col:"#86d693"},
  wearables:{calls:49,hit:0.8,rallied:245,yf:4,col:"#7fe3df"},
  runclubs:{calls:41,hit:0.76,rallied:190,yf:4,col:"#f0a36a"},
  gtavi:{calls:76,hit:0.8,rallied:418,yf:4,col:"#ef85ad"},
  silvertsunami:{calls:35,hit:0.58,rallied:151,yf:4,col:"#c4cacf"},
  pokemon:{calls:69,hit:0.8,rallied:374,yf:4,col:"#f0a85a"},
  microdramas:{calls:45,hit:0.76,rallied:216,yf:4,col:"#ef9bb8"},
  ukunderground:{calls:20,hit:0.84,rallied:50,yf:2,col:"#9d8ae0"},
  privatecredit:{calls:38,hit:0.76,rallied:173,yf:4,col:"#6f93b0"},
  unemployment:{calls:43,hit:0.58,rallied:202,yf:4,col:"#b0b6bb"},
  peptides:{calls:21,hit:0.86,rallied:62,yf:2,col:"#74a9e0"},
  eggs:{calls:41,hit:0.58,rallied:187,yf:4,col:"#e0cb94"},
  attentioneconomy:{calls:51,hit:0.78,rallied:252,yf:4,col:"#cfc8b8"},
  sportsbetting:{calls:64,hit:0.78,rallied:338,yf:4,col:"#86d693"}
};
var SIGNALS={
  humanoidrobots:[
    {src:"YouTube",head:"Factory demo of a folding-laundry bot tops 8M views",time:"3h",dir:"up",m:16},
    {src:"X",head:"Three labs tease humanoid pricing in the same week",time:"10h",dir:"up",m:10},
    {src:"Polymarket",head:"“Ships in 2026” odds slip after a stumble clip",time:"1d",dir:"down",m:6}],
  dopaminesites:[
    {src:"Substack",head:"Essay on “infinite-scroll as a drug” goes around",time:"5h",dir:"up",m:9},
    {src:"Reddit",head:"r/web_design thread picks apart a dopamine UI",time:"1d",dir:"up",m:6},
    {src:"X",head:"Critic calls the pattern “dark by design”",time:"2d",dir:"down",m:4}],
  gameboymod:[
    {src:"YouTube",head:"IPS-screen mod tutorial crosses 500k views",time:"6h",dir:"up",m:10},
    {src:"Etsy",head:"Custom shell shop sells out a color drop",time:"1d",dir:"up",m:7},
    {src:"Reddit",head:"r/Gameboy debates whether mods kill resale",time:"2d",dir:"down",m:4}],
  ninetiesnostalgia:[
    {src:"TikTok",head:"’90s mall haul format takes off again",time:"4h",dir:"up",m:11},
    {src:"Spotify",head:"Decade playlist re-enters viral charts",time:"12h",dir:"up",m:8},
    {src:"Substack",head:"Writer asks if nostalgia has gone stale",time:"2d",dir:"down",m:5}],
  starwars:[
    {src:"YouTube",head:"New series trailer breaks franchise view record",time:"5h",dir:"up",m:12},
    {src:"Reddit",head:"r/StarWars splits hard over a casting leak",time:"1d",dir:"down",m:9},
    {src:"X",head:"Box-office tracking trends below hopes",time:"2d",dir:"down",m:7}],
  cgm:[
    {src:"Instagram",head:"Influencer posts a “glucose-friendly” day of eating",time:"6h",dir:"up",m:9},
    {src:"Amazon",head:"Sensor kit hits bestseller in wellness",time:"1d",dir:"up",m:7},
    {src:"Substack",head:"Doctor warns the data is being over-read",time:"2d",dir:"down",m:5}],
  blindboxes:[
    {src:"TikTok",head:"Unboxing of a rare chase figure goes viral",time:"3h",dir:"up",m:12},
    {src:"StockX",head:"Secondary prices on a sold-out series jump",time:"1d",dir:"up",m:8},
    {src:"Reddit",head:"Collectors debate the odds being rigged",time:"2d",dir:"down",m:5}],
  tastewashing:[
    {src:"Substack",head:"Essay coining the term gets widely shared",time:"5h",dir:"up",m:9},
    {src:"X",head:"Thread lists brands “tastewashing” culture",time:"1d",dir:"up",m:6},
    {src:"Instagram",head:"A campaign gets called out for it",time:"2d",dir:"down",m:4}],
  snapspecs:[
    {src:"YouTube",head:"First-person glasses vlog format catches on",time:"6h",dir:"up",m:10},
    {src:"X",head:"Spec leak hints at a lighter next model",time:"1d",dir:"up",m:7},
    {src:"Reddit",head:"Privacy thread pushes back hard",time:"2d",dir:"down",m:6}],
  irl:[
    {src:"Eventbrite",head:"Phone-free dinner series sells out citywide",time:"4h",dir:"up",m:11},
    {src:"Instagram",head:"“leave your phone at the door” party trends",time:"12h",dir:"up",m:8},
    {src:"Substack",head:"Writer asks if offline is just new content",time:"2d",dir:"down",m:5}],
  prowrestling:[
    {src:"YouTube",head:"A surprise return clip racks up 6M views",time:"3h",dir:"up",m:13},
    {src:"X",head:"Promo line becomes the week's meme",time:"1d",dir:"up",m:8},
    {src:"Reddit",head:"Booking decision splits the fanbase",time:"2d",dir:"down",m:6}],
  analog:[
    {src:"Instagram",head:"Film-photo dump format keeps spreading",time:"5h",dir:"up",m:9},
    {src:"Etsy",head:"Film stock resale prices climb again",time:"1d",dir:"up",m:7},
    {src:"Substack",head:"Piece warns analog is now a luxury pose",time:"2d",dir:"down",m:4}],
  bearmarket:[
    {src:"X",head:"“Capitulation” trends as indexes slide",time:"2h",dir:"down",m:14},
    {src:"Bloomberg",head:"Strategist cuts year-end target",time:"1d",dir:"down",m:9},
    {src:"Reddit",head:"r/investing sentiment hits a low",time:"2d",dir:"down",m:7}],
  obsession:[
    {src:"TikTok",head:"“obsession era” format spreads fast",time:"5h",dir:"up",m:10},
    {src:"Substack",head:"Essay defends being obsessed with one thing",time:"1d",dir:"up",m:6},
    {src:"X",head:"Counter-take calls it just burnout",time:"2d",dir:"down",m:4}],
  slop:[
    {src:"X",head:"“AI slop” becomes the week's insult",time:"3h",dir:"up",m:12},
    {src:"YouTube",head:"Channel exposes a slop content farm",time:"1d",dir:"down",m:8},
    {src:"Substack",head:"Editor bans AI submissions, goes viral",time:"2d",dir:"up",m:6}],
  coinbase:[
    {src:"Bloomberg",head:"Beats on earnings, stock pops",time:"4h",dir:"up",m:12},
    {src:"X",head:"New token listing sparks volume spike",time:"1d",dir:"up",m:8},
    {src:"Reuters",head:"Regulatory headline rattles the tape",time:"2d",dir:"down",m:6}],
  claude:[
    {src:"X",head:"New model release tops the benchmarks",time:"3h",dir:"up",m:15},
    {src:"YouTube",head:"Agent demo coding a full app goes viral",time:"12h",dir:"up",m:10},
    {src:"Reddit",head:"Users debate limits vs the competition",time:"2d",dir:"down",m:5}],
  calisthenics:[
    {src:"YouTube",head:"Muscle-up tutorial crosses 2M views",time:"5h",dir:"up",m:10},
    {src:"Instagram",head:"Park-workout reel format spreads",time:"1d",dir:"up",m:7},
    {src:"Reddit",head:"Debate: calisthenics vs weights for size",time:"2d",dir:"down",m:5}],
  chatgpt:[
    {src:"The Verge",head:"New feature rollout dominates headlines",time:"4h",dir:"up",m:11},
    {src:"X",head:"Outage sends users scrambling",time:"1d",dir:"down",m:7},
    {src:"YouTube",head:"Workflow video racks up millions",time:"2d",dir:"up",m:8}],
  agi:[
    {src:"X",head:"Lab exec floats a shorter timeline",time:"3h",dir:"up",m:13},
    {src:"arXiv",head:"New scaling paper makes the rounds",time:"1d",dir:"up",m:9},
    {src:"Substack",head:"Skeptic essay cools the hype",time:"2d",dir:"down",m:6}],
  looksmaxxing:[
    {src:"TikTok",head:"“mewing” explainer hits tens of millions",time:"4h",dir:"up",m:12},
    {src:"YouTube",head:"Dermatologist debunks a viral routine",time:"1d",dir:"down",m:7},
    {src:"Reddit",head:"Thread warns the advice is going too far",time:"2d",dir:"down",m:5}],
  tcm:[
    {src:"TikTok",head:"“liver-cleanse” tea trend takes off",time:"5h",dir:"up",m:9},
    {src:"Instagram",head:"Acupuncture-for-stress reel spreads",time:"1d",dir:"up",m:7},
    {src:"Substack",head:"Doctor flags the missing evidence",time:"2d",dir:"down",m:5}],
  zyns:[
    {src:"X",head:"“zynfluencer” meme blows up",time:"4h",dir:"up",m:10},
    {src:"CNBC",head:"Maker reports surging pouch sales",time:"1d",dir:"up",m:7},
    {src:"Reddit",head:"Health thread pushes back on the hype",time:"2d",dir:"down",m:5}],
  vibecoding:[
    {src:"X",head:"Solo dev ships an app in a weekend, goes viral",time:"3h",dir:"up",m:14},
    {src:"YouTube",head:"“build with me” vibe-coding stream blows up",time:"12h",dir:"up",m:9},
    {src:"Reddit",head:"Engineers debate if the code is maintainable",time:"2d",dir:"down",m:6}],
  wearables:[
    {src:"The Verge",head:"New smart ring launch grabs headlines",time:"4h",dir:"up",m:11},
    {src:"Instagram",head:"Sleep-score flex format spreads",time:"1d",dir:"up",m:7},
    {src:"Reddit",head:"Users question the accuracy claims",time:"2d",dir:"down",m:5}],
  runclubs:[
    {src:"Instagram",head:"City run club hits 1,000 weekly runners",time:"4h",dir:"up",m:12},
    {src:"Strava",head:"Club leaderboards trend on the app",time:"1d",dir:"up",m:8},
    {src:"Substack",head:"Writer asks if run clubs are just networking",time:"2d",dir:"down",m:5}],
  gtavi:[
    {src:"YouTube",head:"Trailer 2 breaks first-day view records",time:"3h",dir:"up",m:16},
    {src:"X",head:"Delay rumor sends fans into a spiral",time:"1d",dir:"down",m:9},
    {src:"Reddit",head:"Map-size theory thread explodes",time:"2d",dir:"up",m:7}],
  silvertsunami:[
    {src:"WSJ",head:"Boomer downsizing reshapes the housing map",time:"5h",dir:"down",m:8},
    {src:"Bloomberg",head:"Elder-care demand outpaces supply",time:"1d",dir:"up",m:6},
    {src:"Reddit",head:"Debate over who inherits the boom",time:"2d",dir:"down",m:5}],
  pokemon:[
    {src:"YouTube",head:"Booster-box opening pulls a chase card",time:"3h",dir:"up",m:13},
    {src:"eBay",head:"Graded card sells for a record price",time:"1d",dir:"up",m:9},
    {src:"Reddit",head:"Collectors warn of a bubble",time:"2d",dir:"down",m:6}],
  microdramas:[
    {src:"Bloomberg",head:"Micro-drama app tops the charts",time:"4h",dir:"up",m:12},
    {src:"TikTok",head:"Cliffhanger clip format goes viral",time:"1d",dir:"up",m:8},
    {src:"Substack",head:"Critic calls it TV's fast food",time:"2d",dir:"down",m:5}],
  ukunderground:[
    {src:"SoundCloud",head:"An unreleased dub racks up plays",time:"5h",dir:"up",m:10},
    {src:"Instagram",head:"Warehouse night sells out in minutes",time:"1d",dir:"up",m:7},
    {src:"Substack",head:"Writer warns it's about to be co-opted",time:"2d",dir:"down",m:5}],
  privatecredit:[
    {src:"FT",head:"Private-credit assets cross a new milestone",time:"5h",dir:"up",m:9},
    {src:"Bloomberg",head:"Analyst flags rising default risk",time:"1d",dir:"down",m:7},
    {src:"WSJ",head:"Regulator signals a closer look",time:"2d",dir:"down",m:5}],
  unemployment:[
    {src:"CNBC",head:"Monthly jobs report misses badly",time:"2h",dir:"down",m:12},
    {src:"LinkedIn",head:"“Open to work” posts surge",time:"1d",dir:"down",m:8},
    {src:"Reddit",head:"r/jobs threads hit record activity",time:"2d",dir:"down",m:6}],
  peptides:[
    {src:"YouTube",head:"Longevity podcast pushes a peptide stack",time:"5h",dir:"up",m:10},
    {src:"Instagram",head:"“recovery protocol” reel spreads",time:"1d",dir:"up",m:7},
    {src:"Substack",head:"Doctor warns on unregulated sourcing",time:"2d",dir:"down",m:6}],
  eggs:[
    {src:"CNBC",head:"Egg prices spike on a new outbreak",time:"3h",dir:"down",m:11},
    {src:"X",head:"Empty-shelf photos go viral again",time:"1d",dir:"down",m:7},
    {src:"Reddit",head:"Backyard-chicken interest surges",time:"2d",dir:"up",m:6}],
  attentioneconomy:[
    {src:"Substack",head:"Essay on “attention as currency” goes wide",time:"4h",dir:"up",m:10},
    {src:"X",head:"Creator quits over the algorithm grind",time:"1d",dir:"down",m:7},
    {src:"The Atlantic",head:"Piece on focus collapse gets shared",time:"2d",dir:"up",m:6}],
  sportsbetting:[
    {src:"ESPN",head:"Handle hits a record for the weekend",time:"3h",dir:"up",m:12},
    {src:"X",head:"A brutal bad-beat parlay goes viral",time:"1d",dir:"up",m:8},
    {src:"Reuters",head:"New state moves to legalize",time:"2d",dir:"up",m:7}]
};
// ---- Timeline: pad each trend to 7 entries + live top-of-feed updates ----

var TL_SRC=["X","YouTube","Reddit","TikTok","Substack","Bloomberg","Discord","Polymarket","The Verge","Threads"];
var TL_EVENTS=[
  {t:"A creator breakdown crosses 1M views",d:"up",m:11},
  {t:"Mods lock a megathread as replies spike",d:"up",m:7},
  {t:"A skeptic thread questions the hype",d:"down",m:5},
  {t:"Three newsletters cover it the same morning",d:"up",m:9},
  {t:"Prediction-market odds tick higher",d:"up",m:8},
  {t:"A rival launch steals the spotlight",d:"down",m:6},
  {t:"Screenshot of the leak makes the rounds",d:"up",m:13},
  {t:"Commentary clip gets stitched everywhere",d:"up",m:10},
  {t:"Early adopters report mixed results",d:"down",m:4},
  {t:"A big account co-signs the trend",d:"up",m:12},
  {t:"Volume cools after the morning spike",d:"down",m:7},
  {t:"A how-to guide tops the subreddit",d:"up",m:6}
];

var COLL_TRENDS={};
var COLLECTIONS={
  humanoidrobots:[{u:"@servo",coll:"Best lab demos",n:26},{u:"@gaitlab",coll:"Walking & balance clips",n:14},{u:"@teardown",coll:"Hardware teardowns",n:11},{u:"@actuator",coll:"Dexterous hands",n:19},{u:"@factoryfloor",coll:"Pilots in the wild",n:8},{u:"@uncanny",coll:"Most human-like gaits",n:22}],
  dopaminesites:[{u:"@loops",coll:"Worst (best) loops",n:13},{u:"@uxdark",coll:"Dark-pattern teardowns",n:9},{u:"@tapfeed",coll:"Endless feeds",n:7}],
  gameboymod:[{u:"@backlit",coll:"Screen mod builds",n:12},{u:"@shells",coll:"Shell color drops",n:8},{u:"@solder",coll:"Soldering guides",n:6}],
  ninetiesnostalgia:[{u:"@vhsbox",coll:"VHS & TV cuts",n:15},{u:"@mallcore",coll:"Mall fits",n:11},{u:"@dialup",coll:"Web 1.0 finds",n:7}],
  starwars:[{u:"@holocron",coll:"Trailer breakdowns",n:24},{u:"@sabers",coll:"Saber & prop builds",n:16},{u:"@cantina",coll:"Deep-cut lore",n:12}],
  cgm:[{u:"@inrange",coll:"Best glucose hacks",n:14},{u:"@sensorlife",coll:"Monitor reviews",n:9},{u:"@platemath",coll:"Meal experiments",n:8}],
  blindboxes:[{u:"@chasefig",coll:"Rare pulls",n:18},{u:"@unbox",coll:"Best unboxings",n:13},{u:"@resale",coll:"Resale watch",n:9}],
  tastewashing:[{u:"@receipts",coll:"Caught in the act",n:12},{u:"@curated",coll:"Real vs borrowed taste",n:8},{u:"@signal",coll:"Signals & tells",n:6}],
  snapspecs:[{u:"@povcam",coll:"Best POV clips",n:13},{u:"@specsheet",coll:"Spec leaks",n:8},{u:"@handsfree",coll:"Capture tests",n:7}],
  irl:[{u:"@nophone",coll:"Phone-free events",n:15},{u:"@meetcute",coll:"IRL scenes",n:10},{u:"@thirdplace",coll:"Third places",n:8}],
  prowrestling:[{u:"@promo",coll:"Best promos",n:19},{u:"@swerve",coll:"Surprise returns",n:14},{u:"@bumps",coll:"Match of the week",n:10}],
  analog:[{u:"@filmonly",coll:"Best film shots",n:16},{u:"@tapehead",coll:"Cassette finds",n:11},{u:"@papertrail",coll:"Paper & print",n:8}],
  bearmarket:[{u:"@redcandle",coll:"Worst charts",n:17},{u:"@hedge",coll:"Defensive plays",n:12},{u:"@capitul",coll:"Capitulation watch",n:9}],
  obsession:[{u:"@allin",coll:"Total fixations",n:13},{u:"@deepdive",coll:"Rabbit holes",n:9},{u:"@onlyone",coll:"One-thing energy",n:7}],
  slop:[{u:"@feedlot",coll:"Worst slop spotted",n:16},{u:"@realcheck",coll:"Real vs generated",n:11},{u:"@farm",coll:"Content farms",n:8}],
  coinbase:[{u:"@onchain",coll:"Listing watch",n:15},{u:"@volume",coll:"Volume spikes",n:10},{u:"@policy",coll:"Policy moves",n:8}],
  claude:[{u:"@agents",coll:"Best agent demos",n:18},{u:"@prompts",coll:"Prompt patterns",n:12},{u:"@bench",coll:"Benchmark talk",n:9}],
  calisthenics:[{u:"@barstar",coll:"Skill progressions",n:15},{u:"@parkset",coll:"Best park workouts",n:11},{u:"@formcheck",coll:"Form checks",n:8}],
  chatgpt:[{u:"@promptly",coll:"Best workflows",n:20},{u:"@features",coll:"Feature drops",n:13},{u:"@uptime",coll:"Outage watch",n:7}],
  agi:[{u:"@singular",coll:"Milestone watch",n:17},{u:"@timelines",coll:"Timeline takes",n:12},{u:"@scaling",coll:"Scaling debates",n:9}],
  looksmaxxing:[{u:"@mewing",coll:"Routine breakdowns",n:16},{u:"@skinmax",coll:"Skincare stacks",n:11},{u:"@debunk",coll:"Debunks",n:8}],
  tcm:[{u:"@meridian",coll:"Herb guides",n:13},{u:"@needles",coll:"Acupuncture clips",n:9},{u:"@ritual",coll:"Daily rituals",n:7}],
  zyns:[{u:"@upperdecky",coll:"Flavor rankings",n:12},{u:"@pocket",coll:"Habit memes",n:9},{u:"@quit",coll:"Quit talk",n:6}],
  vibecoding:[{u:"@shipfast",coll:"Weekend builds",n:18},{u:"@stack",coll:"Tool stacks",n:12},{u:"@mess",coll:"Maintainability takes",n:8}],
  wearables:[{u:"@quantified",coll:"Device reviews",n:15},{u:"@sleepscore",coll:"Sleep data",n:10},{u:"@recovery",coll:"Recovery hacks",n:8}],
  runclubs:[{u:"@pacers",coll:"Best club runs",n:18},{u:"@kitcheck",coll:"Run fits",n:13},{u:"@afterrun",coll:"Post-run cafes",n:9}],
  gtavi:[{u:"@viceloop",coll:"Trailer breakdowns",n:26},{u:"@maptheory",coll:"Map theories",n:15},{u:"@leaks",coll:"Leak watch",n:11}],
  silvertsunami:[{u:"@greypower",coll:"Demographic charts",n:13},{u:"@caregap",coll:"Elder-care watch",n:9},{u:"@handover",coll:"Wealth transfer",n:7}],
  pokemon:[{u:"@pallet",coll:"Best pulls",n:22},{u:"@graded",coll:"Grading watch",n:14},{u:"@vintage",coll:"Vintage sets",n:10}],
  microdramas:[{u:"@verticut",coll:"Best cliffhangers",n:16},{u:"@studios",coll:"Who's making them",n:11},{u:"@binge",coll:"Binge picks",n:9}],
  ukunderground:[{u:"@bassline",coll:"Defining dubs",n:15},{u:"@warehouse",coll:"Night clips",n:11},{u:"@dubplate",coll:"Dubplate finds",n:8}],
  privatecredit:[{u:"@directlend",coll:"Deal flow",n:13},{u:"@default",coll:"Default watch",n:9},{u:"@yield",coll:"Yield hunt",n:7}],
  unemployment:[{u:"@pinkslip",coll:"Layoff tracker",n:14},{u:"@reskill",coll:"Reskill plays",n:10},{u:"@jobsdata",coll:"Data watch",n:8}],
  peptides:[{u:"@reconst",coll:"Protocol guides",n:13},{u:"@recovery",coll:"Recovery stacks",n:9},{u:"@sourcing",coll:"Sourcing talk",n:7}],
  eggs:[{u:"@gradea",coll:"Price watch",n:12},{u:"@henhouse",coll:"Backyard chickens",n:9},{u:"@swap",coll:"Egg swaps",n:6}],
  attentioneconomy:[{u:"@doomscroll",coll:"Best critiques",n:15},{u:"@focus",coll:"Focus fixes",n:10},{u:"@algo",coll:"Algorithm talk",n:8}],
  sportsbetting:[{u:"@parlay",coll:"Bad beats",n:18},{u:"@oddsmaker",coll:"Line moves",n:12},{u:"@props",coll:"Prop bets",n:9}]
};
// ===== Ensure EVERY trend has the same full detail structure =====
// (related + collections), no matter how deeply nested, and make each
// collection a real collection OF TRENDS for the gallery view.
// ===== Removed trends (per client doc): fully delete from data, feed order, forces, and related =====
(function(){
  // ===== Allowlist: ONLY the trends specified in the clip doc may appear in the prototype. =====
  // Anything not listed here is fully removed from data, feed order, forces, and related sections.
  var ALLOWED={humanoidrobots:1,claude:1,chatgpt:1,agi:1,gtavi:1,irl:1,runclubs:1,vibecoding:1,looksmaxxing:1,coinbase:1,
    pokemon:1,wearables:1,starwars:1,slop:1,bearmarket:1,attentioneconomy:1,unemployment:1,eggs:1,privatecredit:1,
    dopaminesites:1,gameboymod:1,ninetiesnostalgia:1,cgm:1,blindboxes:1,tastewashing:1,prowrestling:1,analog:1,obsession:1,
    calisthenics:1,zyns:1,peptides:1,tesla:1,elonmusk:1,figureai:1,onex:1,tiktok:1,kurtcobain:1,wwe:1,filmcameras:1,
    openai:1,anthropic:1,samaltman:1,clavicular:1,mewing:1,rockstar:1};
  window.__ALLOWED=ALLOWED;
  var DEL={}; Object.keys(T).forEach(function(id){if(!ALLOWED[id])DEL[id]=1;});
  Object.keys(DEL).forEach(function(id){delete T[id];});
  function flt(a){return (a||[]).filter(function(x){return !DEL[x];});}
  if(typeof ORDERS!=='undefined'&&ORDERS){ORDERS.all=flt(ORDERS.all);ORDERS.trending=flt(ORDERS.trending);ORDERS.niche=flt(ORDERS.niche);}
  if(typeof order!=='undefined')order=flt(order);
  Object.keys(T).forEach(function(id){if(T[id].sub)T[id].sub=T[id].sub.filter(function(s){return !DEL[s.id];});});
})();
(function ensureUniformDetail(){
  var ALL=Object.keys(T);
  ALL.forEach(function(id){T[id].id=id;T[id].img=null;T[id].imgs=null;});
  // Pairs that should never be shown as related to each other.
  var EXCLUDE={irl:['runclubs'],runclubs:['irl'],chatgpt:['openai'],elonmusk:['gtavi','kurtcobain','rockstar']};
  function pickRelated(id,count){
    var ex=EXCLUDE[id]||[],t=T[id],pool=ALL.filter(function(x){return x!==id && ex.indexOf(x)<0;});
    // prefer same kind, then by closeness of degree
    pool.sort(function(a,b){
      var ka=(T[a].kind===t.kind?0:1), kb=(T[b].kind===t.kind?0:1);
      if(ka!==kb)return ka-kb;
      return Math.abs(T[a].deg-t.deg)-Math.abs(T[b].deg-t.deg);
    });
    // stable rotation by id hash so it isn't always the same first items
    var seed=0;for(var i=0;i<id.length;i++)seed=(seed*31+id.charCodeAt(i))%997;
    var start=seed%Math.max(1,Math.floor(pool.length/3));
    return pool.slice(start,start+count);
  }
  // related fallback
  ALL.forEach(function(id){
    if(!T[id].sub||!T[id].sub.length){
      T[id].sub=pickRelated(id,6).map(function(rid){
        var st=T[rid]; if(st.chg==null)st.chg=(st.up?1:-1)*Math.max(1,Math.round((st.sent-50)/4));
        return {id:rid,impact:Math.max(8,Math.round(30 - Math.abs(T[id].deg-st.deg)/12))};
      });
    }
  });
  // collection → real trend ids (a collection is a set of trends)
  window.COLL_TRENDS=COLL_TRENDS={};
  function trendsForColl(id,coll,n){
    var rel=(T[id].sub||[]).map(function(s){return s.id;});
    var extra=pickRelated(id,10);
    var ids=[id].concat(rel).concat(extra);
    var seen={},out=[];
    ids.forEach(function(x){if(!seen[x]){seen[x]=1;out.push(x);}});
    // length driven by the collection's n (clamped)
    return out.slice(0,Math.max(4,Math.min(n||8,12)));
  }
  // collections fallback + attach trend ids to every collection entry
  var COLL_NAMES=["Ones to watch","The deep cuts","Going mainstream","Underrated picks","Cooling off","Curator's shelf"];
  ALL.forEach(function(id){
    if(!COLLECTIONS[id]||!COLLECTIONS[id].length){
      COLLECTIONS[id]=COLL_NAMES.slice(0,3).map(function(nm,i){return {u:"@noise",coll:nm,n:6+i*3};});
    }
    COLLECTIONS[id].forEach(function(cl,i){
      COLL_TRENDS[id+'#'+i]=trendsForColl(id,cl,cl.n);
      cl.n=COLL_TRENDS[id+'#'+i].length; // count reflects real trends
    });
  });
})();
var POSTS=[
  {id:"claude",u:"@claudehead",t:"2h",text:"shipped a 12-file refactor in one prompt today. this is the workhorse now.",up:14,c:6},
  {id:"gtavi",u:"@viceloop",t:"4h",text:"map theory: the trailer water physics basically confirm the full coastline. calling it.",up:22,c:11},
  {id:"runclubs",u:"@pacers",t:"6h",text:"the 6am crew hit 1000 runners this week. it really is the new nightlife.",up:12,c:5},
  {id:"slop",u:"@feedlot",t:"8h",text:"every other post on my feed is generated now. we need a real-only filter yesterday.",up:9,c:7},
  {id:"blindboxes",u:"@popmart",t:"14h",text:"pulled the chase figure on the third box. resale already 4x. send help.",up:8,c:4},
  {id:"bearmarket",u:"@redcandle",t:"1d",text:"capitulation candle printed. either the bottom or i'm about to look very dumb.",up:11,c:9},
  {id:"humanoidrobots",u:"@eloquent",t:"1d",text:"the laundry-folding demo is staged but the hands are real progress. underrated week.",up:7,c:3},
  {id:"vibecoding",u:"@shipfast",t:"2d",text:"shipped a whole app this weekend without writing a function by hand. wild times.",up:13,c:5}
];
var PROFILES={
  "@you":{tag:"Just getting started on NOISE.",followers:12,following:8,domains:"Finding your taste",leads:[],active:["claude","runclubs"],calls:4,hit:0.5,col:"#aab2c8"},
  "@eloquent":{tag:"Reads the future through hardware.",followers:1310,domains:"Robotics · Tech",leads:["humanoidrobots"],active:["agi","wearables"]},
  "@jerry":{tag:"Studies why we can't put the phone down.",followers:870,domains:"Internet · Design",leads:["dopaminesites"],active:["attentioneconomy","slop"]},
  "@dumb":{tag:"Solders old plastic back to life.",followers:540,domains:"Hardware · Retro",leads:["gameboymod"],active:["analog"]},
  "@barry":{tag:"Lives one decade in the past, on purpose.",followers:760,domains:"Aesthetics",leads:["ninetiesnostalgia"],active:["analog","gameboymod"]},
  "@dirkdiggler":{tag:"Tests every camera you can wear.",followers:690,domains:"Gadgets",leads:["snapspecs"],active:["wearables"]},
  "@thequietedit":{tag:"Calls the cool-offs nobody wants to hear.",followers:2110,domains:"Fashion",leads:["tastewashing"],active:["looksmaxxing"]},
  "@pacers":{tag:"Turns the morning run into a scene.",followers:980,domains:"Fitness · IRL",leads:["runclubs"],active:["irl","calisthenics"]},
  "@viceloop":{tag:"Frame-by-frame on the biggest game ever.",followers:1880,domains:"Gaming",leads:["gtavi"],active:["pokemon"]},
  "@parlay":{tag:"Finds the edge, eats the bad beat.",followers:1240,domains:"Betting · Sport",leads:["sportsbetting"],active:["bearmarket"]}
};
// Drop any posts/profile references to trends removed by the allowlist (prevents broken rows).
(function(){var A=window.__ALLOWED||{};
  if(typeof POSTS!=='undefined')POSTS=POSTS.filter(function(p){return A[p.id];});
  if(typeof PROFILES!=='undefined')Object.keys(PROFILES).forEach(function(h){var p=PROFILES[h];
    if(p.leads)p.leads=p.leads.filter(function(id){return A[id];});
    if(p.active)p.active=p.active.filter(function(id){return A[id];});});
})();

// ===== Video manifest: which trends have clips (and how many). Prevents 404s + caps memory. =====
// As clips are added to media/<slug>/, list the slug here with its clip count.
var CLIPS={agi:3,analog:3,anthropic:3,attentioneconomy:3,bearmarket:3,blindboxes:3,calisthenics:3,cgm:2,chatgpt:3,claude:3,clavicular:3,coinbase:3,dopaminesites:3,eggs:3,elonmusk:3,figureai:3,filmcameras:3,gameboymod:3,gtavi:3,humanoidrobots:3,irl:3,kurtcobain:3,looksmaxxing:3,mewing:2,ninetiesnostalgia:3,obsession:3,onex:3,peptides:3,pokemon:3,privatecredit:3,prowrestling:3,rockstar:3,runclubs:3,samaltman:3,slop:3,starwars:3,tastewashing:3,tesla:3,tiktok:3,unemployment:3,vibecoding:3,wearables:3,wwe:3,zyns:3};
