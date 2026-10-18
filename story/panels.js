// Four Roads to the Capitol: the comic script.
//
// Each panel's `art` is a file in art/story/chibi/. Lettering is set by the
// page, never painted into the art:
//   captions: [{ text, at }]  at = tl | tr | bl | br | bc (corner of the art)
//   bubbles:  [{ who, text, x, y, tail, w, shout }]  x/y = bubble center in % of
//             the art, tail = s | sw | se | n | w | e | none, w = width in %
//   sfx:      { text, x, y, rot }
// `cites` are numbers in SOURCES. `prompt` is the art prompt; it is not shown.
//
// Rules: a real person only says words they are on the record saying, with a
// source. Captions are short enough to letter on the art. Panels p08, p09, p12,
// p15, p21, p25, p26, p27 and p37 are also shown by the game (play/src), so keep
// those ids.
//
// Original fact check: October 11, 2026. Copy consistency and revised achievement claims reviewed October 18, 2026.

export const STYLE = "Chibi comic illustration matching the Capitol Crashers comic: big heads, short bodies, clean black outlines, soft cel shading, rich painterly light. No text, no lettering, no speech bubbles, no signs with words.";

export const PAGES = [
  {
    "id": "issue-1",
    "label": "Issue #1",
    "chapter": "Four lives in public service",
    "panels": [
      {
        "id": "open-n",
        "kind": "narration",
        "where": "both",
        "tag": "About this issue",
        "captions": [
          {
            "text": "Four lives. Four paths into public service.",
            "big": true
          },
          {
            "text": "Zohran Mamdani, Abdul El-Sayed, James Talarico and Alexandria Ocasio-Cortez: where they grew up, the work they have done, and what they want to change next. Their histories are sourced. Scenes showing them together are imagined."
          }
        ],
        "cites": [
          1,
          3,
          61,
          149
        ]
      }
    ]
  },
  {
    "id": "mamdani",
    "label": "Chapter 1 · Zohran Mamdani",
    "chapter": "Growing up and working in Queens",
    "panels": [
      {
        "id": "p01",
        "where": "queens",
        "size": "half",
        "art": "p01.webp",
        "tag": "Kampala · 1991",
        "alt": "A newborn in Kampala, held by his mother, a filmmaker, and his father, a scholar.",
        "captions": [
          {
            "text": "Kampala, Uganda. October 18, 1991. Zohran Kwame Mamdani is born.",
            "at": "tl"
          },
          {
            "text": "Mom makes movies: Mira Nair. Dad studies empires: Mahmood Mamdani.",
            "at": "tr"
          },
          {
            "text": "Mom’s advice: “You have to have the heart of a poet and the skin of an elephant.”",
            "at": "br"
          }
        ],
        "cites": [
          1,
          2,
          142,
          143
        ],
        "prompt": "Warm golden-hour Kampala hillside with red-earth roads and jacaranda trees. A young South Asian woman filmmaker with long dark wavy hair and a middle-aged Ugandan-Indian scholar in his mid-forties cradle a newborn wrapped in a patterned cloth. The scholar has round glasses, receding salt-and-pepper hair, a thin scholarly face, and no full beard. They are parents, not the young bearded fighters. Loving, hopeful. No lettering."
      },
      {
        "id": "p04",
        "where": "queens",
        "size": "half",
        "art": "p04.webp",
        "tag": "The Bronx",
        "alt": "A teenage Mamdani swings a cricket bat on a patchy Bronx field.",
        "captions": [
          {
            "text": "His family moves to New York when he is seven.",
            "at": "tl"
          },
          {
            "text": "At Bronx Science, nobody plays cricket. So he helps start the school’s first team.",
            "at": "br"
          }
        ],
        "sfx": {
          "text": "THWACK!",
          "x": 80,
          "y": 30,
          "rot": -10
        },
        "cites": [
          1,
          2,
          10
        ],
        "prompt": "Skinny teenage South Asian boy on a patchy Bronx cricket field in white cricket kit, swinging a bat, red ball exploding off. Younger version of the adult with a full dark beard and thick styled dark hair: less beard, still dark hair with volume, not a professional cricket star. Split background Table Mountain and New York skyline. No readable text."
      },
      {
        "id": "p08",
        "where": "queens",
        "size": "half",
        "art": "p08.webp",
        "tag": "Queens · 2018",
        "alt": "Mamdani as a housing counselor goes over foreclosure papers with an older immigrant couple at their kitchen table.",
        "captions": [
          {
            "text": "2018. He becomes a foreclosure counselor in Queens, helping families keep their homes.",
            "at": "tl"
          },
          {
            "text": "He says this job is the reason he ran for office.",
            "at": "br"
          }
        ],
        "cites": [
          9,
          10
        ],
        "prompt": "Night in a small Queens kitchen. A young South Asian housing counselor: full dark beard, thick styled dark hair, light blue shirt, leaning over foreclosure papers. Across from him an anxious older immigrant couple who do not look like him: a gray-haired father and a mother, different faces. Warm lamp, cold blue window. He is the only young bearded man. No second politician. No short-cropped hair. No henley. No stethoscope. No lettering."
      },
      {
        "id": "p07",
        "where": "queens",
        "size": "half",
        "art": "p07.webp",
        "tag": "Queens · 2019",
        "alt": "Mamdani raps in a tracksuit under the 7 train beside an elderly woman in a sari.",
        "captions": [
          {
            "text": "He also makes music, rapping as “Mr. Cardamom.”",
            "at": "tl"
          },
          {
            "text": "His 2019 video “Nani” stars Madhur Jaffrey as his grandmother.",
            "at": "br"
          }
        ],
        "cites": [
          2,
          8
        ],
        "prompt": "Landscape 4:3. A young South Asian man in a bright tracksuit raps on a busy Jackson Heights, Queens street under the elevated 7 train, beside a regal elderly Indian grandmother in a sari who is clearly the star. Halal cart steam, colorful shop signs (no readable words), playful magenta and gold lighting."
      }
    ]
  },
  {
    "id": "mamdani-2",
    "label": "Mamdani · 2020–2023",
    "chapter": "From housing counselor to legislator",
    "panels": [
      {
        "id": "p13",
        "where": "queens",
        "size": "half",
        "art": "p13.webp",
        "tag": "Astoria · 2020",
        "alt": "Mamdani knocks on a row-house door under the elevated train at night.",
        "captions": [
          {
            "text": "He runs for the State Assembly against a ten-year incumbent and knocks on doors until they open.",
            "at": "tl"
          },
          {
            "text": "He wins by 423 votes.",
            "at": "br"
          }
        ],
        "sfx": {
          "text": "423!",
          "x": 80,
          "y": 62,
          "rot": -8
        },
        "cites": [
          18,
          54
        ],
        "prompt": "Night in Astoria, Queens. One young South Asian man only: full dark beard, thick styled dark hair with volume on top, dark suit and blue polka-dot tie, clipboard, knocking on a brick row-house door under the elevated train. He is the only politician. No second man. No short-cropped hair. No black henley. No stethoscope. No lettering."
      },
      {
        "id": "p15",
        "where": "queens",
        "size": "wide",
        "art": "p15.webp",
        "tag": "City Hall · 2021",
        "alt": "Mamdani sits with older taxi drivers on folding chairs outside City Hall at night.",
        "captions": [
          {
            "text": "Taxi drivers are drowning in medallion debt. He joins their hunger strike outside City Hall.",
            "at": "tl"
          },
          {
            "text": "Day 6: arrested blocking traffic. Day 15: a deal. Loans cut to $170,000, payments capped at $1,122 a month.",
            "at": "br"
          }
        ],
        "sfx": {
          "text": "DAY 15",
          "x": 84,
          "y": 30,
          "rot": -6
        },
        "cites": [
          20,
          21,
          57
        ],
        "prompt": "Night outside a grand city hall. Older immigrant taxi drivers in jackets on folding chairs with blankets, yellow cabs behind them. One thin young South Asian man with a full dark beard and styled dark hair sits among them, exhausted but unbowed. He is the only young man. No second politician. No short-cropped hair. No henley. Rain, yellow cab lights. No readable text."
      },
      {
        "id": "p14",
        "where": "queens",
        "size": "half",
        "art": "p14.webp",
        "tag": "New York · 2023",
        "alt": "Riders of every age board a city bus through all its doors.",
        "captions": [
          {
            "text": "He wins a free-bus pilot on five routes. Weekday ridership jumps 30 percent.",
            "at": "tl"
          }
        ],
        "cites": [
          19
        ],
        "prompt": "A crowded blue-and-white New York City bus at dusk, riders of every age boarding through all doors, no fare box, big smiles. Everyday riders only. No politicians. No henley. No stethoscope. No lettering."
      }
    ]
  },
  {
    "id": "mamdani-3",
    "label": "Mamdani · 2024–2026",
    "chapter": "Running for mayor, then governing",
    "panels": [
      {
        "id": "pplunge",
        "where": "queens",
        "size": "wide",
        "art": "pplunge.webp",
        "tag": "Coney Island · Jan 1, 2025",
        "alt": "Mamdani leaps into the icy ocean in a thrift-store suit while a crowd cheers on the beach.",
        "captions": [
          {
            "text": "October 2024: he announces for mayor. He’s polling in the single digits.",
            "at": "tl"
          },
          {
            "text": "So on New Year’s Day he jumps into the Atlantic in a thrift-store suit.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Mamdani",
            "text": "I’m freezing… your rent as the next mayor of New York City.",
            "x": 72,
            "y": 18,
            "tail": "sw",
            "w": 28
          }
        ],
        "cites": [
          1,
          97
        ],
        "prompt": "Coney Island, freezing New Year's Day: Mamdani in a cheap thrift-store suit mid-leap into icy surf, cheering crowd, Wonder Wheel in mist."
      },
      {
        "id": "pcuomo",
        "where": "queens",
        "size": "wide",
        "art": "pcuomo.webp",
        "tag": "The debate · June 12, 2025",
        "alt": "Mamdani delivers a line at a debate podium while Andrew Cuomo recoils at his.",
        "captions": [
          {
            "text": "The front-runner: Andrew Cuomo, who resigned as governor in 2021.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Cuomo",
            "text": "He’s accomplished nothing… It is laughable and it is dangerous.",
            "x": 80,
            "y": 16,
            "tail": "s",
            "w": 28
          },
          {
            "who": "Mamdani",
            "text": "I have never had to resign in disgrace… because I am not you, Mr. Cuomo.",
            "x": 22,
            "y": 74,
            "tail": "ne",
            "w": 30
          }
        ],
        "cites": [
          90
        ],
        "prompt": "NYC mayoral debate: Mamdani at the left podium, calm, finger raised; Andrew Cuomo at the right podium recoiling, red-faced."
      },
      {
        "id": "p17",
        "where": "queens",
        "size": "half",
        "art": "p17.webp",
        "tag": "Manhattan · June 2025",
        "alt": "Mamdani walks an empty Manhattan avenue at night, followers trailing behind.",
        "captions": [
          {
            "text": "The last weekend before the primary, he walks the length of Manhattan overnight.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Mamdani",
            "text": "New Yorkers need to see their mayor… They need to even yell at their mayor.",
            "x": 74,
            "y": 78,
            "tail": "n",
            "w": 40
          }
        ],
        "cites": [
          24
        ],
        "prompt": "Landscape 4:3. Summer night on an empty Manhattan avenue, a lone young South Asian man in sneakers and rolled sleeves walks toward the camera, followers with phones trailing behind, skyscrapers glowing magenta and gold, steam rising from a manhole."
      },
      {
        "id": "p18",
        "where": "queens",
        "size": "half",
        "art": "p18.webp",
        "tag": "June 24, 2025",
        "alt": "Mamdani raises both arms at a podium as confetti falls on a cheering crowd.",
        "captions": [
          {
            "text": "He beats Cuomo in the primary: 56 to 44 in the final ranked-choice count.",
            "at": "tl"
          },
          {
            "text": "Cuomo doesn’t quit. He stays in as an independent.",
            "at": "br"
          }
        ],
        "cites": [
          26,
          28,
          59,
          105
        ],
        "bubbles": [
          {
            "who": "Mamdani",
            "text": "Hope is alive.",
            "x": 74,
            "y": 16,
            "tail": "sw",
            "w": 18
          }
        ],
        "prompt": "Wide 16:9 splash. Election night in a packed Brooklyn venue: a young South Asian man in a dark suit raises both arms at the podium, a sea of cheering supporters, confetti and phone lights, huge gold and magenta stage lighting. Ecstatic, triumphant."
      },
      {
        "id": "ptrump",
        "where": "queens",
        "size": "wide",
        "art": "ptrump.webp",
        "tag": "Florida · July 1, 2025",
        "alt": "Trump jabs a finger at a camera at an outdoor podium in front of a swamp and airboats.",
        "captions": [
          {
            "text": "Then the president weighs in.",
            "at": "tl"
          },
          {
            "text": "Mamdani has been a U.S. citizen since 2018. His answer: “We will not accept this intimidation.”",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Trump",
            "text": "Well then, we’ll have to arrest him.",
            "x": 62,
            "y": 18,
            "tail": "sw",
            "w": 22
          }
        ],
        "cites": [
          93,
          94
        ],
        "prompt": "Satire: Trump at an outdoor podium by a Florida swamp, alligators and airboats behind, jabbing a finger at a camera."
      },
      {
        "id": "padams",
        "where": "queens",
        "size": "wide",
        "art": "padams.webp",
        "tag": "Fall 2025",
        "alt": "Eric Adams points angrily at Andrew Cuomo with a snake on his shoulders, then the two hug stiffly for the cameras.",
        "captions": [
          {
            "text": "Mayor Eric Adams on Andrew Cuomo: “a snake and a liar.”",
            "at": "tl"
          },
          {
            "text": "October 2025: Adams drops out and endorses Cuomo.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Adams",
            "text": "Brothers fight, but when families are attacked, brothers come together.",
            "x": 75,
            "y": 20,
            "tail": "s",
            "w": 26
          }
        ],
        "cites": [
          145
        ],
        "prompt": "Two-part satire: Eric Adams points furiously at Andrew Cuomo, a cartoon snake on Cuomo's shoulders; then the two hug stiffly for news cameras, the snake clapping in a bow tie."
      },
      {
        "id": "pvolume",
        "where": "queens",
        "size": "wide",
        "art": "pvolume.webp",
        "tag": "Election night · Nov 4, 2025",
        "alt": "Mamdani points into a TV camera lens from the podium as the crowd roars.",
        "captions": [
          {
            "text": "He wins with just over half the vote. Turnout tops two million, the most since 1969.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Mamdani",
            "text": "So, Donald Trump, since I know you’re watching, I have four words for you:",
            "x": 70,
            "y": 16,
            "tail": "sw",
            "w": 30
          },
          {
            "who": "Mamdani",
            "text": "Turn the volume up.",
            "x": 78,
            "y": 46,
            "tail": "w",
            "w": 18,
            "shout": true
          }
        ],
        "cites": [
          27,
          95
        ],
        "prompt": "Election night in Brooklyn: Mamdani leans toward a TV camera and points straight into the lens with a sly grin, confetti, roaring crowd."
      },
      {
        "id": "poval",
        "where": "queens",
        "size": "wide",
        "art": "poval.webp",
        "tag": "The Oval Office · Nov 21, 2025",
        "alt": "Trump, beaming at the Resolute desk, pats the arm of a politely smiling Mamdani as reporters crowd in.",
        "captions": [
          {
            "text": "Seventeen days later, they meet. A reporter asks Mamdani if he still thinks Trump is a fascist.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Trump",
            "text": "That’s okay, you can just say yes… It’s easier than explaining it. I don’t mind.",
            "x": 22,
            "y": 16,
            "tail": "se",
            "w": 28
          },
          {
            "who": "Trump",
            "text": "I’ll be cheering for him.",
            "x": 18,
            "y": 62,
            "tail": "e",
            "w": 18
          }
        ],
        "cites": [
          96
        ],
        "prompt": "The Oval Office: Trump beaming at the Resolute desk pats the arm of Mamdani, who stands politely bemused; reporters with cameras."
      },
      {
        "id": "p19",
        "where": "queens",
        "size": "half",
        "art": "p19.webp",
        "tag": "Jan 1, 2026",
        "alt": "Mamdani takes the oath with his hand on two Qurans in a tiled, closed subway station.",
        "captions": [
          {
            "text": "Just after midnight, in a closed subway station under City Hall, he takes the oath.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Mamdani",
            "text": "We may not always succeed, but never will we be accused of lacking the courage to try.",
            "x": 72,
            "y": 80,
            "tail": "n",
            "w": 44
          }
        ],
        "cites": [
          29,
          30
        ],
        "prompt": "Landscape 4:3. The decommissioned City Hall subway station at midnight: curved Guastavino tile arches, brass chandeliers, skylights. A young South Asian man in a dark coat raises his right hand, left hand on two Qurans held by his wife; a small circle of witnesses. Glowing gold and green tile light."
      },
      {
        "id": "p21",
        "where": "queens",
        "size": "half",
        "art": "p21.webp",
        "tag": "June 2026",
        "alt": "Tenants cheer on the steps of a city building as frost breaks off an apartment facade; Mamdani raises a fist.",
        "captions": [
          {
            "text": "The Rent Guidelines Board approves a freeze on one- and two-year rent-stabilized leases, covering about one million apartments.",
            "at": "tl"
          },
          {
            "text": "The first freeze on two-year leases in city history.",
            "at": "br"
          }
        ],
        "sfx": {
          "text": "FROZEN!",
          "x": 78,
          "y": 30,
          "rot": -8
        },
        "cites": [
          161,
          33
        ],
        "prompt": "Tenants cheering on the steps of a city building at dusk. Frost and ice crystals breaking off an apartment facade. One young South Asian man in a dark suit and blue polka-dot tie, full dark beard, thick styled dark hair, raising a fist with the crowd. He is the only politician in the frame. No second man. No black henley. No stethoscope. Blank protest signs with no readable words. No logos, no names."
      },
      {
        "id": "p22",
        "where": "queens",
        "size": "half",
        "art": "p22.webp",
        "tag": "September 2026",
        "alt": "Two-year-olds paint and stack blocks in a bright classroom as a parent waves goodbye.",
        "captions": [
          {
            "text": "Free childcare for two-year-olds begins with 2,000 seats across the first four communities.",
            "at": "tl"
          }
        ],
        "cites": [
          162
        ],
        "prompt": "A bright New York toddler classroom. Two-year-olds painting and stacking blocks. One parent waving goodbye at the door with relief. Warm joyful light. No politicians. No bearded men in suits. No henley. No stethoscope. No lettering on the walls."
      },
      {
        "id": "p24",
        "where": "queens",
        "size": "wide",
        "art": "p24.webp",
        "tag": "September 2026",
        "alt": "Delivery workers on e-bikes cheer in the rain as gold coins fall around them.",
        "captions": [
          {
            "text": "$131.5 million secured in a DoorDash settlement. More than $115 million is designated for over 260,000 underpaid workers.",
            "at": "tl"
          },
          {
            "text": "Payments are due to begin in fall 2026. The rest covers civil penalties and costs.",
            "at": "br"
          }
        ],
        "sfx": {
          "text": "WON!",
          "x": 66,
          "y": 16,
          "rot": -6
        },
        "cites": [
          36
        ],
        "prompt": "Wide 2:1. A line of food-delivery workers on e-bikes in the rain on a New York avenue, insulated bags on their backs, raising fists and cheering as gold coins rain down around them. Neon storefront reflections, cyan and gold."
      },
      {
        "id": "p23",
        "where": "queens",
        "size": "half",
        "art": "p23.webp",
        "tag": "East Harlem · Hunts Point",
        "alt": "La Marqueta under the elevated viaduct, market stalls being built.",
        "captions": [
          {
            "text": "He names the first sites for city-owned grocery stores: La Marqueta in East Harlem and The Peninsula in Hunts Point.",
            "at": "tl"
          },
          {
            "text": "The plan: no rent, no property tax, and the savings go to shoppers.",
            "at": "br"
          }
        ],
        "cites": [
          35,
          40
        ],
        "prompt": "La Marqueta in East Harlem under an elevated railroad viaduct at dusk, market stalls being built out, crates of fresh produce, construction lights. Everyday shoppers and workers. No politicians. No henley. No stethoscope. No lettering."
      },
      {
        "id": "n2b",
        "kind": "narration",
        "where": "queens",
        "tag": "What has changed, and what comes next",
        "captions": [
          {
            "text": "A rent freeze. Free childcare. A win for delivery workers.",
            "big": true
          },
          {
            "text": "The Rent Guidelines Board approved a freeze on one- and two-year rent-stabilized leases. The first 2,000 free 2-K seats opened in September. His administration secured a $131.5 million DoorDash settlement, with more than $115 million designated for workers."
          },
          {
            "text": "The next goals include citywide free buses and broader childcare access. His proposed tax on millionaires has faced opposition from Governor Hochul, and landlords filed a lawsuit challenging the rent freeze. Those fights continue alongside the gains already made."
          }
        ],
        "cites": [
          161,
          162,
          36,
          40,
          101,
          102
        ]
      }
    ]
  },
  {
    "id": "el-sayed",
    "label": "Chapter 2 · Abdul El-Sayed",
    "chapter": "Growing up in Michigan and studying medicine",
    "panels": [
      {
        "id": "p02",
        "where": "detroit",
        "size": "half",
        "art": "p02.webp",
        "tag": "Michigan · 1984",
        "alt": "A young Egyptian engineer with textbooks on a Detroit campus at dusk.",
        "captions": [
          {
            "text": "Southeast Michigan. Halloween, 1984. Abdul El-Sayed is born.",
            "at": "tl"
          },
          {
            "text": "His dad came from Alexandria, Egypt, for an engineering PhD at Wayne State.",
            "at": "br"
          },
          {
            "text": "His dad’s question: “Abdulrahman, wouldn’t it be better to learn why people die, then teach everyone around you to save lives?”",
            "at": "bl"
          }
        ],
        "cites": [
          3,
          4,
          5
        ],
        "prompt": "Early-1980s autumn campus at dusk. A young Egyptian engineer in his late twenties, short dark hair, thin mustache only, no full beard, brown corduroy jacket, stack of engineering textbooks, brick university buildings, Detroit skyline, faded Mediterranean lighthouse in the clouds. Not the bearded fighter. No readable text."
      },
      {
        "id": "p03",
        "where": "detroit",
        "size": "half",
        "art": "p03.webp",
        "tag": "Bloomfield Hills",
        "alt": "A teenage El-Sayed whips a lacrosse shot under stadium lights.",
        "captions": [
          {
            "text": "High school: captain of football, wrestling and lacrosse. All three.",
            "at": "tl"
          }
        ],
        "sfx": {
          "text": "CRACK!",
          "x": 22,
          "y": 72,
          "rot": -8
        },
        "cites": [
          3
        ],
        "prompt": "Landscape 4:3. A determined Egyptian-American high-school athlete in a lacrosse helmet mid-shot, stick whipping forward, under Friday-night stadium lights in suburban Michigan. Dynamic action lines, sparks of neon cyan on the ball. Football and wrestling gear visible on a bench in the background."
      },
      {
        "id": "p05",
        "where": "detroit",
        "size": "wide",
        "art": "p05.webp",
        "tag": "Ann Arbor · 2007",
        "alt": "El-Sayed in a graduation gown speaks at a podium before a stadium crowd.",
        "captions": [
          {
            "text": "University of Michigan, 2007. The keynote speaker is Bill Clinton. The student speaker is Abdul El-Sayed.",
            "at": "tl"
          },
          {
            "text": "“I realized I loved Michigan because the person who leaves here today is better than the one who came.”",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "We need to have the audacity to believe we can change the world.",
            "x": 76,
            "y": 22,
            "tail": "sw",
            "w": 30
          }
        ],
        "cites": [
          5,
          110
        ],
        "prompt": "Square 1:1. A young Egyptian-American graduate in a black gown and maize-and-blue stole speaks at a podium, huge stadium crowd behind him in the rain of confetti. Low heroic angle, gold and blue light."
      },
      {
        "id": "p06",
        "where": "detroit",
        "size": "wide",
        "art": "p06.webp",
        "tag": "Oxford · New York",
        "alt": "El-Sayed as an Oxford scholar, a doctor in a hospital corridor, and a lecturer at a chalkboard.",
        "captions": [
          {
            "text": "Rhodes Scholar. Oxford doctorate. Columbia medical degree.",
            "at": "tl"
          },
          {
            "text": "After one patient’s case, he withdraws his residency application. He wants to fix what makes people sick in the first place.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "I think I want to be the health commissioner for Detroit.",
            "x": 50,
            "y": 14,
            "tail": "s",
            "w": 26
          }
        ],
        "cites": [
          5,
          6,
          11
        ],
        "prompt": "Wide 16:9 montage in three overlapping beats, left to right: the spires of Oxford at dusk with a young man in an academic gown; the same man pulling on a white doctor's coat in a New York hospital corridor; the same man at a chalkboard covered in charts and maps of a city, lecturing. One continuous figure, gold-to-cyan lighting gradient."
      }
    ]
  },
  {
    "id": "el-sayed-2",
    "label": "El-Sayed · 2015–2018",
    "chapter": "Rebuilding public health in Detroit",
    "panels": [
      {
        "id": "p09",
        "where": "detroit",
        "size": "wide",
        "art": "p09.webp",
        "tag": "Detroit · 2015",
        "alt": "A young El-Sayed walks into a nearly empty Detroit city office, morning light cutting through the windows.",
        "captions": [
          {
            "text": "Detroit privatized its health department in 2012. By 2015 it’s down to five people.",
            "at": "tl"
          },
          {
            "text": "The mayor gives it to a 30-year-old doctor with one instruction: rebuild it.",
            "at": "br"
          }
        ],
        "cites": [
          11,
          12
        ],
        "prompt": "Wide 16:9 splash. A young Egyptian-American man in a suit and loosened tie walks into a nearly empty, dusty Detroit city office: overturned chairs, dead fluorescent lights, a few boxes. Morning light cuts through tall windows onto him like a spotlight. Detroit's east-side skyline through the glass. Heroic low angle, gold light, deep blue shadows."
      },
      {
        "id": "p10",
        "where": "detroit",
        "size": "half",
        "art": "p10.webp",
        "tag": "Detroit schools",
        "alt": "A grinning schoolgirl puts on her first pair of glasses in a mobile eye clinic.",
        "captions": [
          {
            "text": "Free eye exams and free glasses for Detroit schoolkids, from a van parked outside the school.",
            "at": "bl"
          }
        ],
        "cites": [
          13
        ],
        "prompt": "Square 1:1. Inside a mobile eye-clinic van parked outside a Detroit school, a grinning Black schoolgirl puts on her first pair of glasses and sees clearly; the blurry world behind her snaps into focus. Bright, joyful cyan and gold."
      },
      {
        "id": "p11",
        "where": "detroit",
        "size": "half",
        "art": "p11.webp",
        "tag": "Detroit",
        "alt": "A young mother holds her baby on a porch with two volunteer mentors.",
        "captions": [
          {
            "text": "Too many Detroit babies die before their first birthday. His team helps launch SisterFriends: volunteer mentors for new moms.",
            "at": "bl"
          }
        ],
        "cites": [
          14
        ],
        "prompt": "Square 1:1. A young Detroit mother holding her baby on a porch, surrounded by two smiling volunteer women mentors with a bag of baby supplies. Warm sunrise light, soft magenta glow."
      },
      {
        "id": "p12",
        "where": "detroit",
        "size": "wide",
        "art": "p12.webp",
        "tag": "Michigan · 2018",
        "alt": "El-Sayed raises a fist at a packed rally while Bernie Sanders claps beside him.",
        "captions": [
          {
            "text": "He runs for governor on single-payer health care. Bernie Sanders endorses him.",
            "at": "tl"
          },
          {
            "text": "He loses the primary. He goes back to work.",
            "at": "br"
          }
        ],
        "cites": [
          15,
          16,
          17
        ],
        "prompt": "Square 1:1. A packed Michigan rally at night, confetti and phone lights. A young Egyptian-American candidate raises a fist at the mic; a white-haired older senator in a rumpled suit claps beside him. Then a hint of rain starting. Magenta and cyan stage light."
      }
    ]
  },
  {
    "id": "el-sayed-3",
    "label": "El-Sayed · 2020–2026",
    "chapter": "Back to government, then the Senate race",
    "panels": [
      {
        "id": "p16",
        "where": "detroit",
        "size": "half",
        "art": "p16.webp",
        "tag": "Detroit · 2020–2025",
        "alt": "El-Sayed records a podcast at night, a hardcover book on the desk.",
        "captions": [
          {
            "text": "A book. A podcast. Then Wayne County’s health department.",
            "at": "tl"
          },
          {
            "text": "Narcan stations, about $95 million in medical debt wiped out, 10,000 pairs of glasses.",
            "at": "br"
          }
        ],
        "cites": [
          22,
          23,
          111
        ],
        "prompt": "Landscape 4:3. Late night in a Detroit home studio: an Egyptian-American man in a sweater talks into a podcast microphone, a hardcover book on the desk, the Detroit skyline and the Guardian Building glowing through the window. Cozy gold light, cyan monitor glow."
      },
      {
        "id": "p20",
        "where": "detroit",
        "size": "half",
        "art": "p20.webp",
        "tag": "Detroit · April 2025",
        "alt": "El-Sayed grins in a small campaign office at night, staffers on laptops.",
        "captions": [
          {
            "text": "He runs for the U.S. Senate in three lines: money out of politics, money in your pocket, Medicare for All.",
            "at": "tl"
          },
          {
            "text": "“Now, it’s time to bring that Michigan grit to Washington.”",
            "at": "tr"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "If you want a fighter, I’ve got my receipts.",
            "x": 74,
            "y": 82,
            "tail": "n",
            "w": 36
          }
        ],
        "cites": [
          31,
          32,
          41,
          112
        ],
        "prompt": "Landscape 4:3. A small rented Detroit campaign office at night, folding tables, four staffers on laptops, a hand-painted banner (no readable text). An Egyptian-American man in rolled shirtsleeves grins and holds up a fistful of paper receipts. Gold desk lamps, cyan laptop glow."
      },
      {
        "id": "p25",
        "where": "detroit",
        "size": "wide",
        "art": "p25.webp",
        "tag": "Aug 4, 2026",
        "alt": "El-Sayed bursts through a wall of floating dollar bills and attack-ad screens, fists raised.",
        "captions": [
          {
            "text": "AIPAC’s super PAC spends about $30 million in the primary, most of it against him.",
            "at": "tl"
          },
          {
            "text": "He wins by about 15,000 votes.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "The power of our money is greater than the power of their money.",
            "x": 24,
            "y": 74,
            "tail": "ne",
            "w": 34
          }
        ],
        "sfx": {
          "text": "WON!",
          "x": 82,
          "y": 30,
          "rot": -8
        },
        "cites": [
          37,
          113,
          114
        ],
        "prompt": "Wide 16:9 splash. Primary night in Detroit: an Egyptian-American man in a dark suit bursts through a wall of floating dollar bills and attack-ad TV screens, fists raised, cheering crowd behind him. Detroit skyline and the Renaissance Center glowing magenta and gold. Explosive, triumphant."
      }
    ]
  },
  {
    "id": "talarico",
    "label": "Chapter 3 · James Talarico",
    "chapter": "Family, faith and the classroom",
    "panels": [
      {
        "id": "t01",
        "where": "texas",
        "size": "wide",
        "art": "t01.webp",
        "tag": "Round Rock · 1989",
        "alt": "A young mother holds her newborn beside a packed Ford Escort while a man kneels by the car.",
        "captions": [
          {
            "text": "Round Rock, Texas. May 17, 1989. James Talarico is born. His mom, Tamara, is a preacher’s daughter from Laredo.",
            "at": "tl"
          },
          {
            "text": "He has written that his birth father drank and turned violent. After one abusive night, she packed everything into her Ford Escort and left with him.",
            "at": "bl"
          },
          {
            "text": "Her manager at the hotel where she worked let them stay until they found a small apartment in East Austin.",
            "at": "br"
          }
        ],
        "cites": [
          61,
          140,
          141,
          144
        ],
        "prompt": "Warm suburban Texas evening, 1989. A young white mother holds a newborn on a porch in Round Rock, live oak and a pickup in the yard, Baptist-church steeple far off. She is the parent, not a politician. No lettering."
      },
      {
        "id": "t01b",
        "where": "texas",
        "size": "wide",
        "art": "t01b.webp",
        "tag": "East Austin",
        "alt": "A dad mows the lawn while an elderly neighbor waves and a little boy watches; a mother decorates a crib tucked in a closet.",
        "captions": [
          {
            "text": "In their small East Austin apartment, Tamara has no room for a nursery. She puts James’s crib in her closet and decorates it with toys and pictures.",
            "at": "tr"
          },
          {
            "text": "James: “Like my students, my mom was a fighter.”",
            "at": "tr"
          },
          {
            "text": "Later, Mark Talarico adopts James. Every Saturday, Mark mows their lawn, then the elderly widow’s next door, without being asked.",
            "at": "bl"
          },
          {
            "text": "James: “He never talked about it. He just did it. Because that’s what a man does.”",
            "at": "bl"
          }
        ],
        "cites": [
          140,
          141,
          144
        ],
        "prompt": "Two-part panel: a dad in glasses mows the lawn as an elderly neighbor waves and young James (round face, big ears, side-parted hair) watches from the steps; a mother decorates a crib inside a closet."
      },
      {
        "id": "tyouth",
        "where": "texas",
        "size": "wide",
        "art": "tyouth.webp",
        "tag": "Round Rock",
        "alt": "A lanky teenage Talarico carries a too-tall stack of folding chairs at a church potluck while church ladies cheer.",
        "captions": [
          {
            "text": "He grows up in Round Rock’s public schools and at St. Andrew’s Presbyterian Church.",
            "at": "tl"
          },
          {
            "text": "He calls himself an eighth-generation Texan.",
            "at": "br"
          }
        ],
        "cites": [
          61
        ],
        "prompt": "Round Rock church potluck, around 2004: lanky teenage Talarico carries a too-tall stack of folding chairs while church ladies and kids cheer."
      },
      {
        "id": "t02",
        "where": "texas",
        "size": "wide",
        "art": "t02.webp",
        "tag": "San Antonio · 2011",
        "alt": "A young Talarico teaches a lively sixth-grade English class.",
        "captions": [
          {
            "text": "Teach For America. Sixth-grade English on San Antonio’s west side.",
            "at": "tl"
          },
          {
            "text": "His promise on his last day of teaching: “I would fight for them every single day of my life.”",
            "at": "bl"
          }
        ],
        "cites": [
          61,
          62
        ],
        "prompt": "A west-side San Antonio classroom, 2011: young Talarico at a whiteboard with a paperback, sixth-graders with hands up."
      }
    ]
  },
  {
    "id": "talarico-2",
    "label": "Talarico · 2018–2025",
    "chapter": "Serving in the Texas House",
    "panels": [
      {
        "id": "t03",
        "where": "texas",
        "size": "half",
        "art": "t03.webp",
        "tag": "Texas · 2018",
        "alt": "Talarico, sweaty, shakes hands with a homeowner on a hot suburban doorstep.",
        "captions": [
          {
            "text": "He runs for a Texas House seat Republicans have held since 2010.",
            "at": "tl"
          },
          {
            "text": "To meet voters, he walks the whole district: about 25 miles.",
            "at": "br"
          }
        ],
        "cites": [
          61,
          73
        ],
        "prompt": "Texas suburb, summer 2018: Talarico, sweaty, clipboard, boots, shakes hands with an older homeowner on a doorstep."
      },
      {
        "id": "thosp",
        "where": "texas",
        "size": "half",
        "art": "thosp.webp",
        "tag": "The hospital",
        "alt": "An exhausted Talarico in a hospital bed with an IV, his campaign boots on the chair.",
        "captions": [
          {
            "text": "Over the last 12 miles he keeps throwing up. Then he sleeps for 36 hours.",
            "at": "tl"
          },
          {
            "text": "Blood sugar: about 900. Diagnosis: Type 1 diabetes. Five days in the hospital.",
            "at": "br"
          }
        ],
        "cites": [
          73
        ],
        "prompt": "Hospital room at night, 2018: exhausted Talarico in a bed with an IV, dusty campaign boots on the chair, a nurse."
      },
      {
        "id": "tdiab",
        "where": "texas",
        "size": "wide",
        "art": "tdiab.webp",
        "tag": "The bill",
        "alt": "Talarico checks his blood sugar at a kitchen table covered in campaign walk lists.",
        "captions": [
          {
            "text": "His first month of insulin costs $684. He puts it on a credit card.",
            "at": "tl"
          },
          {
            "text": "He wins the seat at 29, the youngest member of the legislature. In 2021 he helps pass a law capping insulin copays for people on state-regulated plans.",
            "at": "br"
          }
        ],
        "cites": [
          61,
          73
        ],
        "prompt": "Late night kitchen table, 2018: Talarico in a grey t-shirt pricks his finger with a glucose meter, insulin pen, campaign clipboards."
      },
      {
        "id": "t04",
        "where": "texas",
        "size": "wide",
        "art": "t04.webp",
        "tag": "Austin · 2023",
        "alt": "Talarico testifies at a microphone before a committee of stern legislators, a Bible on the table.",
        "captions": [
          {
            "text": "2023. A bill would hang the Ten Commandments in every classroom. He’s a seminary student. He testifies against it.",
            "at": "bl"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "I know you’re a devout Christian, and so am I.",
            "x": 19,
            "y": 52,
            "tail": "e",
            "w": 24
          },
          {
            "who": "Talarico",
            "text": "A religion that has to force people to put up a poster to prove its legitimacy is a dead religion.",
            "x": 82,
            "y": 62,
            "tail": "w",
            "w": 26
          }
        ],
        "cites": [
          61,
          72
        ],
        "prompt": "Texas House committee room: Talarico at the witness microphone, a small Bible beside his notes, stern legislators on a wooden dais."
      },
      {
        "id": "tvoucher",
        "where": "texas",
        "size": "wide",
        "art": "tvoucher.webp",
        "tag": "Austin · 2025",
        "alt": "Talarico at a House floor microphone points at a giant golden funnel draining money from a public school into a private academy.",
        "captions": [
          {
            "text": "2025: Texas passes private-school vouchers, moving public money to private schools.",
            "at": "tl"
          },
          {
            "text": "On the House floor he calls the bill a “scam.”",
            "at": "br"
          }
        ],
        "cites": [
          124
        ],
        "prompt": "Satire on the Texas House floor: Talarico at a microphone points at a golden funnel sucking money out of a public schoolhouse into a gated private academy."
      },
      {
        "id": "tquorum",
        "where": "texas",
        "size": "wide",
        "art": "tquorum.webp",
        "tag": "August 2025",
        "alt": "Talarico turns back on the stairs of a chartered jet at night as other Texas Democrats board.",
        "captions": [
          {
            "text": "Texas Republicans try to redraw the congressional map in the middle of the decade. He and other House Democrats leave the state to block the vote.",
            "at": "tl"
          },
          {
            "text": "Republican leaders go to court to throw them out of office. In May 2026 the Texas Supreme Court rules against it.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "It’s time to fight back.",
            "x": 17,
            "y": 72,
            "tail": "e",
            "w": 18
          }
        ],
        "cites": [
          86,
          87
        ],
        "prompt": "Night tarmac, Austin, 2025: Texas Democratic legislators with suitcases board a chartered jet; Talarico turns back on the stairs."
      }
    ]
  },
  {
    "id": "talarico-3",
    "label": "Talarico · 2025–2026",
    "chapter": "Running for the U.S. Senate",
    "panels": [
      {
        "id": "trogan",
        "where": "texas",
        "size": "half",
        "art": "trogan.webp",
        "tag": "July 2025",
        "alt": "A bald podcast host leans across the microphones, impressed, as Talarico laughs.",
        "captions": [
          {
            "text": "He goes on The Joe Rogan Experience and talks faith, Texas and loving your enemies.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Rogan",
            "text": "You need to run for president.",
            "x": 80,
            "y": 20,
            "tail": "s",
            "w": 22
          }
        ],
        "cites": [
          125
        ],
        "prompt": "Podcast studio: a muscular bald host in headphones leans in, impressed, pointing at Talarico, who laughs across the microphones."
      },
      {
        "id": "tpulled",
        "where": "texas",
        "size": "half",
        "art": "tpulled.webp",
        "tag": "2026",
        "alt": "A network executive yanks the plug on a TV studio while every phone in the city shows Talarico grinning.",
        "captions": [
          {
            "text": "CBS pulls Stephen Colbert’s interview with him, citing equal-time rules. On YouTube it gets 8.4 million views.",
            "at": "tl"
          },
          {
            "text": "In September ABC pulls Jimmy Kimmel’s. 8.3 million views in three days.",
            "at": "br"
          }
        ],
        "cites": [
          126,
          127
        ],
        "prompt": "Satire: a faceless network executive yanks a giant plug in a TV studio while every phone screen in the city outside shows Talarico grinning."
      },
      {
        "id": "t05",
        "where": "texas",
        "size": "half",
        "art": "t05.webp",
        "tag": "March 3, 2026",
        "alt": "Talarico raises both arms on a stage as a crowd cheers on primary night.",
        "captions": [
          {
            "text": "He wins the Democratic Senate primary over Congresswoman Jasmine Crockett, 52 to 46.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "Tonight, the people of our state gave this country a little bit of hope.",
            "x": 26,
            "y": 78,
            "tail": "ne",
            "w": 40
          }
        ],
        "cites": [
          64,
          65
        ],
        "prompt": "Primary night in Austin: Talarico on stage, both arms raised, cheering crowd, blank signs, confetti."
      },
      {
        "id": "tcogdell",
        "where": "texas",
        "size": "half",
        "art": "tcogdell.webp",
        "tag": "June 2026",
        "alt": "An older defense lawyer shakes Talarico's hand at a podcast desk while Paxton presses his face to the window in shock.",
        "captions": [
          {
            "text": "Paxton’s own lawyer from the impeachment trial endorses Talarico.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Cogdell",
            "text": "I think Ken has lost sight of his core mission, which is to represent the people of Texas.",
            "x": 24,
            "y": 74,
            "tail": "n",
            "w": 34
          }
        ],
        "cites": [
          128
        ],
        "prompt": "A Houston law office: an older silver-haired defense lawyer shakes Talarico's hand at a podcast mic; Paxton presses his face to the window, jaw dropped."
      },
      {
        "id": "tdream",
        "where": "texas",
        "size": "wide",
        "art": "tdream.webp",
        "tag": "Arlington · Aug 2026",
        "alt": "Talarico, sleeves rolled up, pounds the podium at a packed rally of working Texans.",
        "captions": [
          {
            "text": "He calls his plan the New American Dream.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "We have an affordability crisis because we have a corruption crisis.",
            "x": 80,
            "y": 36,
            "tail": "w",
            "w": 28
          },
          {
            "who": "Talarico",
            "text": "Trickle-down economics isn’t a theory. It’s theft.",
            "x": 26,
            "y": 78,
            "tail": "ne",
            "w": 28
          }
        ],
        "cites": [
          71
        ],
        "prompt": "Arlington rally, August 2026: Talarico with sleeves rolled up pounds the podium, a huge cheering crowd of working Texans."
      }
    ]
  },
  {
    "id": "aoc",
    "label": "Chapter 4 · Alexandria Ocasio-Cortez",
    "chapter": "Bronx, Yorktown, and the bar",
    "panels": [
      {
        "id": "a01",
        "where": "bronx",
        "size": "wide",
        "art": "a01.webp",
        "tag": "Parkchester · 1989",
        "alt": "A Puerto Rican father and mother hold their toddler daughter in a Bronx courtyard, then sit with her on the steps of a small suburban house.",
        "captions": [
          {
            "text": "Parkchester, the Bronx. October 13, 1989. Alexandria Ocasio-Cortez is born.",
            "at": "tl"
          },
          {
            "text": "Her father, Sergio, is a Bronx architect. Her mother, Blanca, grew up in Arecibo, Puerto Rico, and cleaned houses.",
            "at": "bl"
          },
          {
            "text": "They move about 30 minutes north to Yorktown for stronger public schools. She still spends weekends with family in the Bronx. The gap in what a ZIP code can buy is the first politics she notices.",
            "at": "br"
          }
        ],
        "cites": [
          149,
          150,
          151
        ],
        "prompt": "Split Bronx 1990s: Parkchester courtyard family with a toddler girl; same family on a Yorktown stoop with a school bus. No lettering."
      },
      {
        "id": "a01b",
        "where": "bronx",
        "size": "wide",
        "art": "a01b.webp",
        "tag": "2008",
        "alt": "A college-age daughter stands with her mother at a kitchen table covered in envelopes; an empty drafting table and a photo of her father sit in the background.",
        "captions": [
          {
            "text": "Sophomore year at Boston University. Sergio dies of cancer at 48. Medical bills put the house at risk.",
            "at": "tl"
          },
          {
            "text": "Blanca takes another job driving a school bus. Alexandria interned in Ted Kennedy’s office on immigration cases; after graduation she works two jobs to keep the family afloat.",
            "at": "br"
          }
        ],
        "cites": [
          150,
          151,
          149
        ],
        "prompt": "Night kitchen, 2008: mother at a table of envelopes, daughter with a hand on her shoulder, empty drafting table. No lettering."
      },
      {
        "id": "a02",
        "where": "bronx",
        "size": "wide",
        "art": "a02.webp",
        "tag": "Manhattan · Flats Fix",
        "alt": "Ocasio-Cortez behind a taqueria bar, shaking a cocktail tin for regulars.",
        "captions": [
          {
            "text": "She bartends and waits tables at Flats Fix, a taqueria by Union Square, to help her mother and pay student loans.",
            "at": "tl"
          },
          {
            "text": "Years later, when a president mocks the job, she answers on the record:",
            "at": "tr"
          }
        ],
        "bubbles": [
          {
            "who": "Ocasio-Cortez",
            "text": "I’m proud to be a bartender.",
            "x": 28,
            "y": 22,
            "tail": "s",
            "w": 24
          },
          {
            "who": "Ocasio-Cortez",
            "text": "Ain’t nothing wrong with that.",
            "x": 78,
            "y": 70,
            "tail": "w",
            "w": 24
          }
        ],
        "cites": [
          152,
          153,
          150
        ],
        "prompt": "Manhattan taqueria bar: young Latina bartender with gold hoops shaking a tin. No lettering."
      }
    ]
  },
  {
    "id": "aoc-2",
    "label": "Ocasio-Cortez · 2018–2019",
    "chapter": "The upset, then the House",
    "panels": [
      {
        "id": "a03",
        "where": "bronx",
        "size": "half",
        "art": "a03.webp",
        "tag": "NY-14 · 2018",
        "alt": "Ocasio-Cortez in a red dress knocks on a Bronx walk-up while a neighbor waves from a folding chair.",
        "captions": [
          {
            "text": "After Standing Rock she runs for Congress. Joe Crowley has held the seat since 1999. She takes no corporate PAC money.",
            "at": "tl"
          },
          {
            "text": "Staff write their job titles on Post-its. Time later quoted her: everyone said she was cute, maybe next time.",
            "at": "br"
          }
        ],
        "cites": [
          150,
          154
        ],
        "prompt": "Bronx stoop, 2018: young woman in a red dress knocks with a clipboard. No lettering."
      },
      {
        "id": "a04",
        "where": "bronx",
        "size": "half",
        "art": "a04.webp",
        "tag": "June 26, 2018",
        "alt": "Ocasio-Cortez in a white blazer throws her arms up on election night as the room cheers.",
        "captions": [
          {
            "text": "She beats Crowley about 57 percent to 43. The New York Times calls it the most significant loss for a Democratic incumbent in more than a decade.",
            "at": "tl"
          },
          {
            "text": "At 29 she becomes the youngest woman ever sworn into Congress.",
            "at": "br"
          }
        ],
        "cites": [
          154,
          150
        ],
        "prompt": "Election-night Bronx: young Latina in a white blazer, arms up, confetti. No lettering."
      },
      {
        "id": "aoc-results",
        "kind": "narration",
        "where": "bronx",
        "tag": "Results from her first term",
        "captions": [
          {
            "text": "From the House floor to help for families.",
            "big": true
          },
          {
            "text": "Three of her amendments became law in her first term, including $5 million for opioid treatment and $10 million to clean up former military sites in Puerto Rico. She also worked with Senator Chuck Schumer to include funeral assistance in COVID relief."
          }
        ],
        "cites": [
          150
        ]
      },
      {
        "id": "a05",
        "where": "bronx",
        "size": "wide",
        "art": "a05.webp",
        "tag": "February 7, 2019",
        "alt": "Ocasio-Cortez and an older white senator hold a blank green document on the Capitol steps, wind turbines behind them.",
        "captions": [
          {
            "text": "Her first legislation is the Green New Deal resolution, introduced with Senator Ed Markey.",
            "at": "tl"
          },
          {
            "text": "It is a ten-year mobilization: union jobs, infrastructure, and cutting carbon. It is a resolution, not an enacted law.",
            "at": "br"
          }
        ],
        "cites": [
          150,
          156
        ],
        "prompt": "Capitol steps: young Latina and older white senator hold a blank green document, turbines in the sky. No lettering."
      }
    ]
  },
  {
    "id": "aoc-3",
    "label": "Ocasio-Cortez · Hearings",
    "chapter": "The clips in Greatest Hits",
    "panels": [
      {
        "id": "a06",
        "where": "bronx",
        "size": "half",
        "art": "a06.webp",
        "tag": "February 2019",
        "alt": "Ocasio-Cortez at a House dais points at two sweating witnesses.",
        "captions": [
          {
            "text": "Oversight hearing. She walks witnesses through a five-minute ethics hypothetical about money in the White House.",
            "at": "tl"
          },
          {
            "text": "That clip, uncut, is in Greatest Hits.",
            "at": "br"
          }
        ],
        "cites": [
          159,
          158
        ],
        "prompt": "House oversight room: young Latina at a dais pointing at two nervous witnesses. No lettering."
      },
      {
        "id": "a07",
        "where": "bronx",
        "size": "half",
        "art": "a07.webp",
        "tag": "October 2019",
        "alt": "Ocasio-Cortez at a microphone questions a man in a gray t-shirt at the witness table.",
        "captions": [
          {
            "text": "She asks Mark Zuckerberg whether Facebook will run a political ad it knows is a lie.",
            "at": "tl"
          },
          {
            "text": "That hearing is in Greatest Hits too.",
            "at": "br"
          }
        ],
        "cites": [
          160,
          158
        ],
        "prompt": "House hearing: young Latina at a microphone, tech-CEO type in a gray shirt at the table. No lettering."
      },
      {
        "id": "a08",
        "where": "bronx",
        "size": "wide",
        "art": "a08.webp",
        "tag": "July 23, 2020",
        "alt": "Ocasio-Cortez speaks at a House floor microphone, calm and direct.",
        "captions": [
          {
            "text": "A Florida Republican accosts her on the Capitol steps. On the floor he cites his wife and daughters. She answers from the Congressional Record:",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "Ocasio-Cortez",
            "text": "I am someone’s daughter too.",
            "x": 22,
            "y": 28,
            "tail": "e",
            "w": 26
          },
          {
            "who": "Ocasio-Cortez",
            "text": "They did not raise me to accept abuse from men.",
            "x": 78,
            "y": 72,
            "tail": "w",
            "w": 28
          }
        ],
        "cites": [
          157
        ],
        "prompt": "House floor: young Latina at a microphone, dignified. No lettering."
      },
      {
        "id": "aoc-hits",
        "kind": "narration",
        "where": "bronx",
        "tag": "Greatest Hits",
        "captions": [
          {
            "text": "Watch Ocasio-Cortez question witnesses and speak on the House floor in Greatest Hits.",
            "big": true
          },
          {
            "text": "Clips keep their original publishers’ edits, with no narration added by Political Arcades."
          }
        ],
        "cites": [
          158
        ]
      }
    ]
  },
  {
    "id": "issue-1-end",
    "label": "Issue #1 · Conclusion",
    "chapter": "Four paths, and the work ahead",
    "panels": [
      {
        "id": "concl",
        "kind": "narration",
        "where": "both",
        "tag": "October 2026",
        "captions": [
          {
            "text": "Mamdani is mayor of New York. El-Sayed and Talarico are running for the U.S. Senate. Ocasio-Cortez serves in the House.",
            "big": true
          },
          {
            "text": "Their work has already reached tenants, patients, students and working families. Their next goals build on that record. In the following issue, we follow the Michigan and Texas Senate races and the opponents El-Sayed and Talarico face."
          }
        ],
        "cites": [
          33,
          34,
          36,
          111,
          61,
          150
        ]
      }
    ]
  },
  {
    "id": "issue-2",
    "label": "Issue #2",
    "chapter": "Show up and debate",
    "panels": [
      {
        "id": "open",
        "where": "both",
        "size": "wide",
        "art": "open.webp",
        "tag": "An imagined scene · October 2026",
        "alt": "Mamdani, El-Sayed and Talarico walk side by side up a rain-slick avenue, the Capitol dome lit behind them.",
        "captions": [
          {
            "text": "October 2026. El-Sayed is running for Senate in Michigan. Talarico is running in Texas.",
            "at": "tl"
          },
          {
            "text": "Mamdani’s work continues at City Hall; Ocasio-Cortez’s continues in the House. This scene brings three of our characters together in an imagined walk. The debate stories that follow are sourced.",
            "at": "br"
          }
        ],
        "cites": [
          27,
          37,
          64,
          66
        ],
        "prompt": "Three men walk side by side up a rain-slick avenue at night toward the lit U.S. Capitol: Mamdani (dark suit, polka-dot tie), El-Sayed (navy suit, short beard), Talarico (navy suit, open collar, cowboy boots). Neon reflections."
      },
      {
        "id": "n3",
        "kind": "narration",
        "where": "both",
        "tag": "Fall 2026",
        "captions": [
          {
            "text": "Fall 2026. Time to face them.",
            "big": true
          },
          {
            "text": "In Michigan, Mike Rogers. In Texas, Ken Paxton. One skips the first debate. The other skips all of them."
          }
        ]
      },
      {
        "id": "who-1",
        "kind": "person",
        "where": "detroit",
        "name": "Abdul El-Sayed",
        "line": "vs. Mike Rogers"
      },
      {
        "id": "rflorida",
        "where": "detroit",
        "size": "wide",
        "art": "rflorida.webp",
        "tag": "Cape Coral, Florida",
        "alt": "Mike Rogers lounges in a hammock outside a pink Florida house, a Michigan snow globe forgotten on the lawn.",
        "captions": [
          {
            "text": "Meet Mike Rogers, former Michigan congressman. In 2022 he buys a $1.6 million house in Cape Coral, Florida.",
            "at": "tl"
          },
          {
            "text": "In 2023 he claims it as his permanent residence for a tax break. In 2024 he re-registers in Michigan to run for Senate.",
            "at": "br"
          }
        ],
        "cites": [
          115
        ],
        "prompt": "Satire: stout grey-haired Mike Rogers in a palm-print shirt lounges in a hammock outside a pink Cape Coral house, a Michigan snow globe in the grass."
      },
      {
        "id": "pmoney",
        "where": "detroit",
        "size": "wide",
        "art": "pmoney.webp",
        "tag": "April 2026",
        "alt": "Suits aim a fire hose of dollar bills at a snowy Michigan town while Rogers rides the cash wave on a pool float.",
        "captions": [
          {
            "text": "A Washington super PAC, the Senate Leadership Fund, commits $45 million to win Michigan’s Senate seat for Rogers’ side.",
            "at": "tl"
          },
          {
            "text": "El-Sayed’s pitch is the opposite: no corporate PAC money at all.",
            "at": "br"
          }
        ],
        "cites": [
          147,
          43
        ],
        "prompt": "Satire: four faceless suits brace a fire hose blasting dollar bills toward a snowy Michigan town; Rogers in a palm-print shirt rides the money wave on a pool float."
      },
      {
        "id": "pspy",
        "where": "detroit",
        "size": "wide",
        "art": "pspy.webp",
        "tag": "The side gig",
        "alt": "Rogers hands a giant telephone receiver to a faceless officer while phone cords run out to thousands of homes.",
        "captions": [
          {
            "text": "For about six years Rogers sat on a security advisory council for the phone giant Telefónica. Pay: about $94,000.",
            "at": "tl"
          },
          {
            "text": "The company admitted intercepting the communications of 1.58 million Venezuelans for Maduro’s government. His campaign says he didn’t know.",
            "at": "br"
          }
        ],
        "cites": [
          146
        ],
        "prompt": "Satire: Rogers in a suit hands a giant old telephone receiver to a faceless officer in sunglasses; phone cords run out the window to thousands of tiny houses; an envelope of cash on the table."
      },
      {
        "id": "emptypod",
        "where": "detroit",
        "size": "wide",
        "art": "emptypod.webp",
        "tag": "Detroit · Sept 15, 2026",
        "alt": "El-Sayed gestures at an empty podium on a TV debate set as the moderator checks his watch.",
        "captions": [
          {
            "text": "Fox 2 Detroit holds a debate. Rogers doesn’t come. The station leaves his podium up.",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "I appreciate the Libertarian candidate has now participated more than the Republican candidate has in this debate.",
            "x": 76,
            "y": 80,
            "tail": "n",
            "w": 36
          }
        ],
        "cites": [
          116,
          117
        ],
        "prompt": "Detroit TV debate set: El-Sayed at the right podium gestures at an empty left podium; the moderator checks his watch."
      },
      {
        "id": "emptypod-b",
        "kind": "narration",
        "where": "detroit",
        "tag": "Where was he?",
        "captions": [
          {
            "text": "The week before, Rogers gave a speech at a convention in Dallas. Rogers said the Detroit event was “a town hall,” not a debate."
          },
          {
            "text": "El-Sayed, afterward: “It tells you who he is. He’s a coward.”"
          }
        ],
        "cites": [
          116,
          117
        ]
      },
      {
        "id": "yachts",
        "where": "detroit",
        "size": "wide",
        "art": "yachts.webp",
        "tag": "Grand Rapids · Oct 8, 2026",
        "alt": "At the debate, El-Sayed holds up two fingers to the camera while a sweating Rogers grips his podium.",
        "captions": [
          {
            "text": "October 8. Rogers shows up.",
            "at": "tl"
          },
          {
            "text": "El-Sayed holds up two fingers for the camera.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "How many yachts do you own?",
            "x": 68,
            "y": 14,
            "tail": "s",
            "w": 20
          }
        ],
        "cites": [
          118,
          119
        ],
        "prompt": "Debate stage: El-Sayed grins and holds up two fingers to the camera; Mike Rogers in a charcoal suit grips his podium, sweating."
      },
      {
        "id": "slackjaw",
        "where": "detroit",
        "size": "half",
        "bubblesFirst": true,
        "art": "slackjaw.webp",
        "tag": "The answer",
        "alt": "Close-up: Rogers frozen at his podium, jaw hanging open, a bead of sweat, a tumbleweed rolling past.",
        "bubbles": [
          {
            "who": "Rogers",
            "text": "I never owned a yacht in Florida, brother.",
            "x": 22,
            "y": 20,
            "tail": "se",
            "w": 30
          }
        ],
        "captions": [
          {
            "text": "Records from El-Sayed’s campaign show two boats registered in Maryland.",
            "at": "br"
          }
        ],
        "cites": [
          119,
          120
        ],
        "prompt": "Close-up satire: Mike Rogers at a debate podium, jaw hanging open, eyes blank, a bead of sweat, a tumbleweed rolling past."
      },
      {
        "id": "blockm",
        "where": "detroit",
        "size": "half",
        "bubblesFirst": true,
        "art": "blockm.webp",
        "tag": "Oxford vs. the block M",
        "alt": "Rogers tugs on a too-small maize-and-blue sweater with the price tag on while El-Sayed laughs at his podium.",
        "bubbles": [
          {
            "who": "Rogers",
            "text": "You learn that in Oxford, I guess — how to talk pretty.",
            "x": 24,
            "y": 14,
            "tail": "s",
            "w": 32
          },
          {
            "who": "El-Sayed",
            "text": "I don’t just parade around in the block M.",
            "x": 76,
            "y": 16,
            "tail": "s",
            "w": 28
          }
        ],
        "captions": [
          {
            "text": "El-Sayed went to the University of Michigan. Rogers went to Adrian College.",
            "at": "bl"
          }
        ],
        "cites": [
          119
        ],
        "prompt": "Debate satire: Rogers tugs a too-small maize-and-blue varsity sweater over his suit, price tag dangling; El-Sayed laughs, arms folded."
      },
      {
        "id": "albin",
        "kind": "narration",
        "where": "detroit",
        "tag": "The moderator",
        "captions": [
          {
            "text": "It gets so loud the moderator, Rick Albin, has to ask: “I’d like to be part of the debate, too.”"
          },
          {
            "text": "Afterward: “In 30 years of doing debates… I’ve never seen it continue during the commercial. But it did.”"
          }
        ],
        "cites": [
          119,
          121
        ]
      },
      {
        "id": "h07",
        "where": "detroit",
        "size": "wide",
        "art": "h07.webp",
        "tag": "Same night",
        "alt": "Rogers shouts and jabs a finger from his podium; El-Sayed stands calm at his.",
        "captions": [
          {
            "text": "Then Rogers goes after El-Sayed’s mother. Her story is Issue #3.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Rogers",
            "text": "Let’s open up this can of worms.",
            "x": 22,
            "y": 14,
            "tail": "s",
            "w": 24
          },
          {
            "who": "El-Sayed",
            "text": "You talking about my mom?",
            "x": 80,
            "y": 14,
            "tail": "s",
            "w": 20
          },
          {
            "who": "Rogers",
            "text": "What your mom was working at — I was going after that organization that was indicted for funneling money to al-Qaida.",
            "x": 30,
            "y": 84,
            "tail": "n",
            "w": 44
          }
        ],
        "cites": [
          123,
          122,
          47
        ],
        "prompt": "TV debate studio with two wooden podiums and harsh spotlights. Empty LED walls with abstract gold graphics and no readable words. Left podium: older white man in his sixties, thinning steel-gray hair combed back, receding hairline, charcoal suit, shouting, jabbing a finger. Right podium: the same Egyptian-American man as the attached references, now in a navy suit and dark tie. Short close-cropped dark hair covering the whole scalp, no receding hairline, short full jaw beard that is not a goatee and not a long bushy beard, thick eyebrows, rounder cheeks, slight closed-mouth smile, unbothered. Only two people. No statue, no golden figure, no nurse, no children, no halo, no lettering."
      },
      {
        "id": "pmohammad",
        "where": "detroit",
        "size": "wide",
        "art": "pmohammad.webp",
        "tag": "After the debate",
        "alt": "Trump jabs at his phone in a gold bedroom; El-Sayed reads his phone at a kitchen table, deadpan.",
        "captions": [
          {
            "text": "The president posts that Rogers “completely obliterated Mohammad El-Sayed.”",
            "at": "tl"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "He knows my name is Abdul. He says it everyday.",
            "x": 76,
            "y": 18,
            "tail": "s",
            "w": 26
          }
        ],
        "cites": [
          148
        ],
        "prompt": "Two-part satire: Trump hunched over a glowing phone in a gold bedroom at night; El-Sayed at a kitchen table reads his phone and looks at the camera, deadpan, tapping a blank name badge."
      },
      {
        "id": "who-2",
        "kind": "person",
        "where": "texas",
        "name": "James Talarico",
        "line": "vs. Ken Paxton"
      },
      {
        "id": "pintro",
        "where": "texas",
        "size": "wide",
        "art": "pintro.webp",
        "tag": "Meet Ken Paxton",
        "alt": "Ken Paxton smirks on the Texas Capitol steps as an endless blank scroll unrolls behind him.",
        "captions": [
          {
            "text": "His opponent: Ken Paxton, Texas attorney general. In May 2026 he beats Sen. John Cornyn in the runoff, with Trump’s endorsement. No Democrat has won statewide in Texas since 1994.",
            "at": "tl"
          },
          {
            "text": "His record: indicted for securities fraud in 2015, resolved with a deal in 2024. Impeached by the Texas House in 2023, 121 to 23. Acquitted by the Senate.",
            "at": "br"
          }
        ],
        "cites": [
          66,
          74,
          78
        ],
        "prompt": "Satire: Ken Paxton smirks on the pink-granite Texas Capitol steps as an endless blank scroll unrolls down the stairs; an armadillo stares."
      },
      {
        "id": "ptruck",
        "where": "texas",
        "size": "wide",
        "art": "ptruck.webp",
        "tag": "2022",
        "alt": "Paxton sprints across a lawn toward a waiting pickup while a process server holds out an envelope.",
        "captions": [
          {
            "text": "A process server comes to his house with a subpoena.",
            "at": "tl"
          },
          {
            "text": "NBC News: “Texas AG Paxton fled home in a truck driven by his wife to avoid subpoena, process server alleges.” Paxton cited safety concerns.",
            "at": "bl"
          }
        ],
        "sfx": {
          "text": "VROOM!",
          "x": 84,
          "y": 82,
          "rot": -6
        },
        "cites": [
          77
        ],
        "prompt": "Comedy chase: Ken Paxton sprints across a suburban lawn to a pickup with its door open; a polite process server holds out an envelope."
      },
      {
        "id": "puppet",
        "where": "texas",
        "size": "wide",
        "art": "puppet.webp",
        "tag": "The oil money",
        "alt": "Two faceless billionaires in Stetsons atop oil derricks work Paxton like a marionette.",
        "captions": [
          {
            "text": "Before his impeachment trial, a PAC bankrolled by oil billionaires Tim Dunn and Farris Wilks gives the trial’s judge, Lt. Gov. Dan Patrick, $1 million and a $2 million loan.",
            "at": "bl"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "Did Tim Dunn and Farris Wilks, your top two billionaire mega-donors, buy an acquittal in your impeachment trial?",
            "x": 74,
            "y": 86,
            "tail": "none",
            "w": 42
          }
        ],
        "cites": [
          75,
          76,
          84
        ],
        "prompt": "Satire: two faceless billionaires in white Stetsons sit atop oil derricks working puppet controls; Ken Paxton dangles as a marionette."
      },
      {
        "id": "tnodebate",
        "where": "texas",
        "size": "wide",
        "art": "tnodebate.webp",
        "tag": "Texas · 2026",
        "alt": "Talarico waits at a debate podium beside an empty one with puppet strings dangling onto it.",
        "captions": [
          {
            "text": "Talarico challenges Paxton to three TV debates. Paxton says the hosts are biased.",
            "at": "tl"
          },
          {
            "text": "As of October 11: zero debates.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "He is a puppet politician, and I want him to prove me wrong.",
            "x": 74,
            "y": 16,
            "tail": "s",
            "w": 28
          }
        ],
        "cites": [
          84,
          85
        ],
        "prompt": "Texas debate stage: Talarico waits at the right podium; the left podium is empty except for limp puppet strings and a tiny cowboy hat."
      },
      {
        "id": "prally",
        "where": "texas",
        "size": "wide",
        "art": "prally.webp",
        "tag": "San Antonio · Oct 2026",
        "alt": "Paxton shades his eyes at a rally podium, pretending to search the crowd.",
        "captions": [
          {
            "text": "Talarico is home with the flu. Paxton mocks him at a rally.",
            "at": "tl"
          },
          {
            "text": "Even Trump says Paxton is “ready, willing and able” to debate. Talarico: “I agree… Ball’s in your court.”",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Paxton",
            "text": "Where do you think they hid that little socialist?",
            "x": 22,
            "y": 40,
            "tail": "e",
            "w": 26
          }
        ],
        "cites": [
          83
        ],
        "prompt": "San Antonio rally: Ken Paxton at a podium shades his eyes and peers over the crowd as if searching for someone hiding."
      }
    ]
  },
  {
    "id": "n-h",
    "label": "Issue #3",
    "chapter": "The Healer",
    "panels": [
      {
        "id": "h01",
        "where": "detroit",
        "size": "wide",
        "art": "h01.webp",
        "tag": "Issue #3 · Fatten Elkomy",
        "alt": "An older Egyptian woman in a white coat that flares like a cape, children safe behind her, attack ads tearing into confetti.",
        "captions": [
          {
            "text": "Fatten Elkomy: Abdul El-Sayed’s mother, and a psychiatric nurse practitioner in Missouri.",
            "at": "tl"
          },
          {
            "text": "On live TV, Mike Rogers brought up a charity she worked at twenty years ago. Here’s what the record actually says.",
            "at": "br"
          }
        ],
        "cites": [
          47,
          48,
          49
        ],
        "prompt": "Bold American comic-book splash, heavy black ink, halftone dots, rain-slick night with neon gold, magenta, and cyan. No text, no lettering, no logos, no names. An older Egyptian woman in her late sixties, short dark hair silver at the temples, warm brown eyes, dignified closed-mouth smile. Chibi proportions: large head, short athletic body, same face language as the rest of this fighter-select comic. White nurse-practitioner coat flaring behind her like a gold-lined cape. Teal scrubs underneath. A stethoscope across her chest glowing like a gold shield. Small children of several backgrounds stand safe behind the coat, holding the hem. Attack-ad headlines and a watchlist form bounce off the gold light and tear into confetti. Low heroic angle, clinic windows blazing gold behind her. She looks like a superhero because the work is the power."
      },
      {
        "id": "h02",
        "where": "detroit",
        "size": "half",
        "art": "h02.webp",
        "tag": "Alexandria · 1983",
        "alt": "A young woman in a fresh white coat on stone steps by the sea.",
        "captions": [
          {
            "text": "Alexandria, Egypt, 1983: she graduates from medical school.",
            "at": "tl"
          },
          {
            "text": "Then she keeps studying in the U.S., in psychiatric and mental-health nursing.",
            "at": "br"
          }
        ],
        "cites": [
          49
        ],
        "prompt": "Bold American comic-book illustration, heavy black ink, halftone, gold Mediterranean light. No text. Portrait 3:4. A young Egyptian woman in a fresh white medical coat on stone steps beside a seafront medical school, lighthouse ghosted in the sky. Hopeful, proud, not grim. Chibi proportions matching the series. Warm gold with a cyan rim light."
      },
      {
        "id": "h05",
        "where": "detroit",
        "size": "half",
        "art": "h05.webp",
        "tag": "1999–2004",
        "alt": "The woman in a white coat holds a child's crayon drawing in a modest aid office.",
        "captions": [
          {
            "text": "1999 to 2004: she works at a humanitarian aid office in Missouri. Its records include requests for child sponsorship and orphan support.",
            "at": "tl"
          },
          {
            "text": "2004, to a local paper: “I’ve been working there serving orphans and children with at least one deceased parent.”",
            "at": "br"
          }
        ],
        "cites": [
          48
        ],
        "prompt": "Modest humanitarian aid office around 2000. An older Egyptian woman matching the clinic nurse: short dark hair going silver, weathered brown skin, laugh lines, white coat over street clothes, no hijab, no nurse cap. She holds a child's crayon drawing of a house like it is the most important document in the room. Desk stacked with folders and more crayon drawings. Gray American street through the window. Gold light on the drawings. No flags, no weapons, no lettering."
      },
      {
        "id": "h06",
        "where": "detroit",
        "size": "half",
        "art": "h06.webp",
        "tag": "The record",
        "alt": "The woman in the white coat walks down federal-building steps into gold light.",
        "captions": [
          {
            "text": "FBI agents interview her for three hours.",
            "at": "tl"
          },
          {
            "text": "She is never charged or named as a defendant. Fact-checkers find no evidence she knew of any crime.",
            "at": "br"
          }
        ],
        "cites": [
          48
        ],
        "prompt": "Tall comic panel, heavy ink, halftone, no text. An Egyptian woman in a white coat walks down the steps of a gray federal building into a column of gold light. Behind her, a stack of files sits unmarked. She does not look hunted. She looks finished with the questions and late for the next patient. Chibi, chin up, cape-coat catching wind. Cyan rain, gold sunbreak."
      },
      {
        "id": "h08",
        "where": "detroit",
        "size": "half",
        "art": "h08.webp",
        "tag": "The federal case · 2008",
        "alt": "The woman pins a court paper over a screaming red attack-ad poster.",
        "captions": [
          {
            "text": "2008: the charity and several people tied to it face federal sanctions charges. She isn’t one of them.",
            "at": "tl"
          },
          {
            "text": "The Justice Department said the case did not charge anyone with material support of terrorism.",
            "at": "br"
          }
        ],
        "cites": [
          48,
          52
        ],
        "prompt": "Older Egyptian woman matching the clinic nurse: short dark hair going silver, weathered brown skin, white coat, teal scrubs, no hijab. She pins a blank court paper to a wall with a gold stethoscope, covering a crumpled screaming red attack-ad poster with no readable words. Calm face. Magenta scare-poster vs gold clinical light. No lettering."
      },
      {
        "id": "h03",
        "where": "detroit",
        "size": "half",
        "art": "h03-chibi.webp",
        "tag": "Columbia, Missouri",
        "alt": "The woman listens to a tired young man across her clinic desk.",
        "captions": [
          {
            "text": "Two master’s degrees, then a master’s and a doctorate in psychiatric and mental-health nursing.",
            "at": "tl"
          },
          {
            "text": "Since 2018: a community mental-health agency in Missouri.",
            "at": "br"
          }
        ],
        "cites": [
          49,
          50
        ],
        "prompt": "Small rain-streaked clinic office. Ordinary desk lamp, no halo. An older Egyptian woman matching the clinic nurse: short dark hair going silver, weathered brown skin, laugh lines, white coat over teal scrubs, no hijab. She sits across from a tired young man, listening, slight smile. Clipboard on the desk. Rain on the windows. She is in her fifties, not a child, not a young kawaii girl. No lettering."
      },
      {
        "id": "h04",
        "where": "detroit",
        "size": "half",
        "art": "h04.webp",
        "tag": "Columbia, Missouri · 2026",
        "alt": "The woman sits in a classroom circle as a child shows her a crayon drawing.",
        "captions": [
          {
            "text": "2026: a school in Columbia, Missouri, announces she’ll counsel students every other Friday, 8 to 3.",
            "at": "tl"
          },
          {
            "text": "Thirteen years as a mental-health provider.",
            "at": "br"
          }
        ],
        "cites": [
          49
        ],
        "prompt": "One older Egyptian woman only, matching the attached clinic nurse: short dark hair silver at the temples, weathered brown skin, laugh lines, white coat over teal scrubs, teal clogs, no hijab. She sits in a small classroom circle with schoolchildren of several backgrounds. One child shows her a crayon drawing of a house. Soft gold light around her chair. The children do not look like her. No second nurse. No duplicate of her face among the kids. No lettering."
      },
      {
        "id": "h09",
        "where": "detroit",
        "size": "half",
        "art": "h09.webp",
        "tag": "The answer",
        "alt": "El-Sayed stands unbothered at his podium while Rogers points at him.",
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "He wants this to be about anything but his own record.",
            "x": 70,
            "y": 18,
            "tail": "s",
            "w": 34
          },
          {
            "who": "El-Sayed",
            "text": "Go ahead and say it. You’ve been tiptoeing around it the whole time, just say it.",
            "x": 36,
            "y": 78,
            "tail": "e",
            "w": 40
          }
        ],
        "cites": [
          47,
          122
        ],
        "prompt": "Closer on the same two-podium debate. Egyptian-American man matching the attached fighter: short close-cropped dark hair covering the whole scalp, short full jaw beard, thick eyebrows, rounder cheeks, navy suit, slight closed-mouth smile, unbothered at his podium. Older gray-haired man pointing from the left. Only two people. No statue, no golden figure, no nurse, no children, no halo, no lettering."
      },
      {
        "id": "h11",
        "where": "detroit",
        "size": "half",
        "art": "h11.webp",
        "tag": "Still on the job",
        "alt": "The woman in the white coat walks toward a small clinic at dawn, patients waving.",
        "captions": [
          {
            "text": "The public registry still lists her as a psychiatric and mental-health nurse practitioner in Missouri.",
            "at": "tl"
          },
          {
            "text": "She still has her license. She still goes to work.",
            "at": "br"
          }
        ],
        "cites": [
          50,
          48
        ],
        "prompt": "One older Egyptian woman only, matching the attached clinic nurse: short dark hair silver at the temples, weathered brown skin, laugh lines, white coat flaring like a cape over teal scrubs, teal clogs, no hijab. She walks toward a small clinic at dawn, patients waving in the windows, gold sunrise at her back. Adult face in her late fifties, not a child. No lettering."
      }
    ]
  },
  {
    "id": "issue-4",
    "label": "Issue #4",
    "chapter": "What they want to do next",
    "panels": [
      {
        "id": "n4",
        "kind": "narration",
        "where": "both",
        "tag": "The next goals",
        "captions": [
          {
            "text": "They have a record to build on.",
            "big": true
          },
          {
            "text": "Rent protection and childcare in New York. Health programs in Michigan. An insulin copay cap in Texas. Community funding and relief work in Congress. The following pages show the broader changes they propose. These imagined futures are goals, not a claim that every policy is already in place."
          }
        ],
        "cites": [
          161,
          162,
          111,
          61,
          150
        ]
      },
      {
        "id": "p27",
        "where": "queens",
        "size": "wide",
        "art": "fny.webp",
        "tag": "New York · The proposed future",
        "alt": "A future New York morning: riders board a free bus in a red bus lane, a dad drops a toddler at daycare, Mamdani rides along.",
        "captions": [
          {
            "text": "Mamdani’s next goals: extend the gains from the rent freeze and free 2-K to more families, make every city bus free and fast, and offer free childcare from six weeks to five years old.",
            "at": "tl"
          },
          {
            "text": "His platform also calls for a $30 minimum wage by 2030, a higher corporate tax and a 2 percent tax on income over $1 million. These are proposals, not completed changes.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Mamdani",
            "text": "New York, this power, it’s yours. This city belongs to you.",
            "x": 57,
            "y": 15,
            "tail": "s",
            "w": 26
          }
        ],
        "cites": [
          40,
          46,
          95
        ],
        "prompt": "Future NYC morning: a free bus in a red bus lane boarding riders of every kind through all doors, a daycare drop-off, Mamdani riding along."
      },
      {
        "id": "p37",
        "where": "detroit",
        "size": "wide",
        "art": "fmi.webp",
        "tag": "Michigan · The proposed future",
        "alt": "A future Detroit street: a family leaves a clinic with no bill, a crew swaps lead pipes for copper, El-Sayed waves from the clinic steps.",
        "captions": [
          {
            "text": "El-Sayed’s campaign rejects corporate PAC money. His next goals include curbing super PACs and getting money out of politics.",
            "at": "tl"
          },
          {
            "text": "His platform calls for Medicare for All with no premiums, copays or deductibles, broader medical-debt relief, and replacing every lead pipe in Michigan by 2030.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "Money out of politics. Money in your pocket. Medicare for All.",
            "x": 76,
            "y": 22,
            "tail": "s",
            "w": 26
          }
        ],
        "cites": [
          42,
          43,
          114
        ],
        "prompt": "Future Detroit morning: a family leaves a clinic smiling, a union crew swaps a lead pipe for copper, El-Sayed in a white coat waves from the steps."
      },
      {
        "id": "ftx",
        "where": "texas",
        "size": "wide",
        "art": "ftx.webp",
        "tag": "Texas · The proposed future",
        "alt": "A future Texas public school: teachers welcome families, Talarico high-fives a kid on the steps.",
        "captions": [
          {
            "text": "After helping pass an insulin copay cap in Texas, Talarico wants broader limits on drug costs, stronger public schools, and universal pre-K and childcare. He opposes private-school vouchers.",
            "at": "tl"
          },
          {
            "text": "His Senate platform also calls for banning super PACs and congressional stock trading. These are the changes he is campaigning for.",
            "at": "br"
          }
        ],
        "bubbles": [
          {
            "who": "Talarico",
            "text": "I’ll fight to unrig this economy. I’ll fight to raise your pay. I’ll fight to lower your costs.",
            "x": 70,
            "y": 16,
            "tail": "sw",
            "w": 30
          }
        ],
        "cites": [
          61,
          67,
          69,
          70,
          71
        ],
        "prompt": "Future Texas public school: teachers welcome families at a renovated brick school; Talarico kneels to high-five a kid."
      },
      {
        "id": "aoc-next",
        "kind": "narration",
        "where": "bronx",
        "tag": "Ocasio-Cortez · The proposed future",
        "captions": [
          {
            "text": "The work continues in the House.",
            "big": true
          },
          {
            "text": "Ocasio-Cortez’s Green New Deal resolution calls for union jobs, cleaner energy and investment in infrastructure. She has introduced the resolution and related legislation; that is different from having the full agenda enacted."
          }
        ],
        "cites": [
          150,
          156
        ]
      },
      {
        "id": "p26",
        "where": "both",
        "size": "wide",
        "art": "finale.webp",
        "tag": "The work continues · Imagined scene",
        "alt": "At dawn, Mamdani, El-Sayed and Talarico stand at the foot of the Capitol steps with a huge crowd of ordinary Americans behind them.",
        "captions": [
          {
            "text": "Four paths into public service. Work at City Hall, in the House, and on the Senate campaign trail.",
            "at": "tl"
          },
          {
            "text": "Their records show what has changed. Their proposals show what they want to do next. Follow both.",
            "at": "br"
          }
        ],
        "cites": [
          27,
          37,
          64,
          66,
          150
        ],
        "prompt": "Dawn over the Capitol after rain: Mamdani, El-Sayed and Talarico at the foot of the steps, a huge crowd of nurses, workers, teachers, farmers, parents behind them."
      }
    ]
  }
];

export const PLANKS = [
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "Freeze the rent",
    "cites": [
      161,
      102
    ],
    "text": "The Rent Guidelines Board approved a freeze on one- and two-year rent-stabilized leases in June 2026. Landlords filed a lawsuit challenging the decision in July."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "No-cost child care",
    "cites": [
      162,
      40
    ],
    "text": "The first 2,000 free 2-K seats opened in September 2026. His broader goal is free childcare from six weeks to five years, with childcare workers paid like public-school teachers."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "Fast, fare-free buses",
    "cites": [
      19,
      40
    ],
    "text": "A five-route fare-free pilot ran in 2023–24. His broader proposal is free, faster buses citywide, with priority lanes and signals. The pilot did not make the whole network fare-free."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "Community safety",
    "cites": [
      40
    ],
    "text": "A Department of Community Safety: mental-health crisis response, outreach workers in 100 subway stations, gun-violence programs, and an 800 percent increase for hate-violence prevention."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "City-owned groceries",
    "cites": [
      40,
      35
    ],
    "text": "City-owned stores with no rent and no property tax, selling near wholesale. The first site, La Marqueta in East Harlem, is projected to open in 2027."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "200,000 homes",
    "cites": [
      40
    ],
    "text": "Triple production of permanently affordable, union-built, rent-stabilized homes: 200,000 over ten years."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "Bad landlords",
    "cites": [
      40
    ],
    "text": "One office for code enforcement. If the owner will not make the repair, the city does it and sends the bill."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "Who pays",
    "cites": [
      40,
      101
    ],
    "text": "His platform proposes a higher corporate tax and an extra 2 percent on income over $1 million. Governor Hochul has opposed the income-tax increase; a proposal is not an enacted tax."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "$30 by 2030",
    "cites": [
      46
    ],
    "text": "Raise New York City's minimum wage to $30 an hour by 2030."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Medicare for All",
    "cites": [
      42
    ],
    "text": "Medicare for every American, including vision, dental and hearing. No premiums, copays or deductibles. Medical debt abolished."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Money out of politics",
    "cites": [
      43,
      114
    ],
    "text": "No corporate PAC money. Overturn Citizens United. Ban outside spending by super PACs and dark-money groups. Public election funding."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Put money in your pocket",
    "cites": [
      44
    ],
    "text": "Tax capital gains over $1 million like wages, close the stepped-up basis loophole, and exempt the first $50,000 of income from federal tax."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Housing",
    "cites": [
      44
    ],
    "text": "A building boom and a federal renter bill of rights. Stop big corporations from speculating on homes and ban rent-fixing software."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Clean water",
    "cites": [
      43
    ],
    "text": "Water bills capped at 2 percent of household income, no shutoffs for families who cannot pay, and every lead pipe in Michigan out by 2030."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Schools",
    "cites": [
      44
    ],
    "text": "Universal child care and pre-K, a $60,000 minimum teacher salary, and a tuition-free path through college or an apprenticeship."
  },
  {
    "where": "detroit",
    "who": "El-Sayed",
    "title": "Data centers",
    "cites": [
      45
    ],
    "text": "Data centers pay for their own power and water so household bills do not rise, and neighbors get a say."
  },
  {
    "where": "texas",
    "who": "Talarico",
    "title": "Public schools",
    "cites": [
      67
    ],
    "text": "No private-school vouchers. Universal pre-K for 3- and 4-year-olds, more teachers, more counselors, and phonics-based reading help."
  },
  {
    "where": "texas",
    "who": "Talarico",
    "title": "Raise pay",
    "cites": [
      68,
      71
    ],
    "text": "Raise the minimum wage, expand overtime, and pass paid family leave."
  },
  {
    "where": "texas",
    "who": "Talarico",
    "title": "Money out",
    "cites": [
      69
    ],
    "text": "Ban super PACs and corporate PACs, ban partisan gerrymandering, and ban members of Congress from trading individual stocks."
  },
  {
    "where": "texas",
    "who": "Talarico",
    "title": "Lower costs",
    "cites": [
      70,
      71
    ],
    "text": "A public health-insurance option, caps on insulin and drug prices, medical-debt relief, and down-payment help for first-time buyers."
  },
  {
    "where": "texas",
    "who": "Talarico",
    "title": "Child care",
    "cites": [
      71
    ],
    "text": "Universal child care, paid family leave and a bigger Child Tax Credit: his New American Dream agenda from August 2026."
  },
  {
    "where": "bronx",
    "who": "Ocasio-Cortez",
    "title": "Green New Deal",
    "cites": [
      150,
      156
    ],
    "text": "She introduced the Green New Deal resolution with Senator Ed Markey in 2019. It proposes union jobs, infrastructure investment and lower emissions. Introducing the resolution did not make its agenda law."
  },
  {
    "where": "bronx",
    "who": "Ocasio-Cortez",
    "title": "Medicare for All",
    "cites": [
      154
    ],
    "text": "A national single-payer health program. She has argued it would lower overall health-care costs."
  },
  {
    "where": "bronx",
    "who": "Ocasio-Cortez",
    "title": "Housing",
    "cites": [
      154
    ],
    "text": "Housing as a right in NY-14, including for families facing eviction and rising rents in the Bronx and Queens."
  },
  {
    "where": "bronx",
    "who": "Ocasio-Cortez",
    "title": "Workers",
    "cites": [
      153,
      150
    ],
    "text": "Dignity for bartenders, retail workers and bus drivers. She has refused corporate PAC money since the 2018 campaign."
  }
];

export const SOURCES = [
  {
    "n": 1,
    "label": "CNN, Zohran Mamdani fast facts.",
    "url": "https://www.cnn.com/politics/zohran-mamdani-fast-facts"
  },
  {
    "n": 2,
    "label": "The Africa Report, 10 things about Zohran Mamdani.",
    "url": "https://www.theafricareport.com/386712/zohran-mamdani-10-things-about-uganda-born-democratic-nominee-for-new-york-city-mayor/"
  },
  {
    "n": 3,
    "label": "Bridge Michigan, who is Abdul El-Sayed.",
    "url": "https://bridgemi.com/michigan-government/who-is-abdul-el-sayed-what-to-know-about-michigan-democrats-us-senate-winner/"
  },
  {
    "n": 4,
    "label": "El-Sayed for Senate, about.",
    "url": "https://abdulforsenate.com/about/"
  },
  {
    "n": 5,
    "label": "University of Michigan Record, Rhodes Scholar announcement.",
    "url": "https://record.umich.edu/articles/u-m-dual-md-phd-student-named-rhodes-scholar/"
  },
  {
    "n": 6,
    "label": "Columbia Medicine, alumni profile.",
    "url": "https://www.vagelos.columbia.edu/about-us/columbia-medicine-magazine/archives/fall-winter-2016/alumni-news-notes/alumni-profile-abdul-el-sayed14"
  },
  {
    "n": 8,
    "label": "Vice, Madhur Jaffrey stars in \"Nani.\"",
    "url": "https://www.vice.com/en/article/madhur-jaffrey-nani-rap-video/"
  },
  {
    "n": 9,
    "label": "Brick Underground, housing counselors at Chhaya.",
    "url": "https://www.brickunderground.com/live/how-owners-facing-foreclosure-get-help-housing-counselors-chhaya-mamdani"
  },
  {
    "n": 10,
    "label": "PBS NewsHour, how Mamdani rose from Queens lawmaker to mayor.",
    "url": "https://www.pbs.org/newshour/politics/how-zohran-mamdani-rose-from-queens-lawmaker-to-mayor-of-new-york"
  },
  {
    "n": 11,
    "label": "STAT, Detroit's health director.",
    "url": "https://www.statnews.com/2016/05/03/detroit-health-director/"
  },
  {
    "n": 12,
    "label": "American Rhodes Scholars, El-Sayed named Detroit health director.",
    "url": "https://www.americanrhodes.org/news-1071.html"
  },
  {
    "n": 13,
    "label": "WDET, free eye exams and glasses for DPSCD students.",
    "url": "https://wdet.org/posts/2016/10/12/83985-new-program-provides-free-eye-exam-and-glasses-to-dpscd-students"
  },
  {
    "n": 14,
    "label": "City of Detroit, infant mortality drop and SisterFriends.",
    "url": "https://detroitmi.gov/news/mayor-duggan-and-dr-khaldun-announce-historic-drop-infant-mortality-rate-city-detroit-2019-had"
  },
  {
    "n": 15,
    "label": "Detroit News, El-Sayed's MichCare plan.",
    "url": "https://www.detroitnews.com/story/news/local/michigan/2018/06/06/el-sayed-universal-health-michigan/677394002/"
  },
  {
    "n": 16,
    "label": "WKAR, Bernie Sanders endorses El-Sayed.",
    "url": "https://www.wkar.org/politics-government/2018-07-26/bernie-sanders-endorses-el-sayed-in-michigans-governors-race"
  },
  {
    "n": 17,
    "label": "Bridge Michigan, Whitmer wins 2018 primary.",
    "url": "https://bridgemi.com/michigan-government/gretchen-whitmer-wins-democratic-primary-michigan-governor/"
  },
  {
    "n": 18,
    "label": "PoliticsNY, Mamdani unseats Simotas.",
    "url": "https://politicsny.com/2020/07/22/dsa-backed-mamdani-unseats-simotas-in-36-ad-race/"
  },
  {
    "n": 19,
    "label": "MTA, fare-free bus pilot report.",
    "url": "https://www.mta.info/document/177466"
  },
  {
    "n": 20,
    "label": "THE CITY, cabbies go on hunger strike.",
    "url": "https://www.thecity.nyc/2021/10/21/nyc-cabbies-go-on-hunger-strike-taxi-medallion-debts/"
  },
  {
    "n": 21,
    "label": "City & State, taxi drivers' victory.",
    "url": "https://www.cityandstateny.com/politics/2021/11/activist-lawmakers-share-taxi-drivers-victory/186641/"
  },
  {
    "n": 22,
    "label": "Abrams Books, Healing Politics.",
    "url": "https://www.abramsbooks.com/product/healing-politics_9781683358138/"
  },
  {
    "n": 23,
    "label": "Wayne County, El-Sayed joins Health, Human & Veterans Services.",
    "url": "https://www.waynecountymi.gov/News/Executive/2022/Dr.-Abdul-El-Sayed-joins-Health-Human-Veterans-Services-Department"
  },
  {
    "n": 24,
    "label": "Hell Gate, Mamdani goes the distance.",
    "url": "https://hellgatenyc.com/zohran-mamdani-goes-the-distance/"
  },
  {
    "n": 26,
    "label": "amNY, ranked-choice primary results.",
    "url": "https://www.amny.com/news/mamdani-democratic-primary-ranked-choice-vote-win/"
  },
  {
    "n": 27,
    "label": "NBC News, New York City mayor results.",
    "url": "https://www.nbcnews.com/politics/2025-elections/new-york-city-mayor-results"
  },
  {
    "n": 28,
    "label": "TIME, Mamdani's victory speech.",
    "url": "https://time.com/7331243/watch-zohran-mamdani-victory-speech/"
  },
  {
    "n": 29,
    "label": "CBS New York, swearing-in at the old City Hall station.",
    "url": "https://www.cbsnews.com/newyork/news/zohran-mamdani-swearing-in-old-city-hall-station/"
  },
  {
    "n": 30,
    "label": "NYC Mayor's Office, inaugural address.",
    "url": "https://www.nyc.gov/mayors-office/news/2026/01/mayor-zohran-mamdani-inaugural-address"
  },
  {
    "n": 31,
    "label": "Michigan Advance, El-Sayed enters U.S. Senate race.",
    "url": "https://michiganadvance.com/2025/04/17/el-sayed-enters-race-for-michigans-u-s-senate-seat/"
  },
  {
    "n": 32,
    "label": "Bridge Michigan, \"If you want a fighter, I've got receipts.\"",
    "url": "https://bridgemi.com/michigan-government/abdul-el-sayed-us-senate-run-if-you-want-fighter-ive-got-receipts/"
  },
  {
    "n": 33,
    "label": "Gothamist, Rent Guidelines Board approves rent freeze.",
    "url": "https://gothamist.com/news/nyc-rent-guidelines-board-approves-2-year-rent-freeze-fulfilling-mamdani-campaign-pledge"
  },
  {
    "n": 34,
    "label": "NYC Mayor's Office, first 2-K communities.",
    "url": "https://www.nyc.gov/mayors-office/news/2026/03/mayor-mamdani-and-governor-hochul-announce-first-four-communitie"
  },
  {
    "n": 35,
    "label": "TIME, city-owned grocery stores.",
    "url": "https://time.com/article/2026/05/21/mamdani-city-owned-grocery-stores-east-harlem-manhattan-the-bronx/"
  },
  {
    "n": 36,
    "label": "NYC Mayor's Office, $131.5 million from DoorDash.",
    "url": "https://www.nyc.gov/mayors-office/news/2026/09/mayor-mamdani-wins-record--131-5-million-from-doordash-for-deliv"
  },
  {
    "n": 37,
    "label": "Michigan Advance, El-Sayed wins the Senate primary.",
    "url": "https://michiganadvance.com/2026/08/05/abdul-el-sayed-squeaks-out-win-over-haley-stevens-in-hotly-contested-democratic-us-senate-primary/"
  },
  {
    "n": 39,
    "label": "Washington Post, Michigan Senate poll.",
    "url": "https://www.washingtonpost.com/politics/2026/09/17/michigan-senate-race-poll-finds-abdul-el-sayed-has-narrow-edge-over-mike-rogers/"
  },
  {
    "n": 40,
    "label": "Zohran for NYC, platform.",
    "url": "https://web.archive.org/web/20250702081752/https://www.zohranfornyc.com/"
  },
  {
    "n": 41,
    "label": "El-Sayed for Senate, priorities.",
    "url": "https://abdulforsenate.com/priorities/"
  },
  {
    "n": 42,
    "label": "El-Sayed for Senate, Medicare for All.",
    "url": "https://abdulforsenate.com/priority/medicare-for-all-the-path-to-a-healthier-america/"
  },
  {
    "n": 43,
    "label": "El-Sayed for Senate, money out of politics.",
    "url": "https://abdulforsenate.com/priority/money-out-of-politics/"
  },
  {
    "n": 44,
    "label": "El-Sayed for Senate, money in your pocket.",
    "url": "https://abdulforsenate.com/priority/money-in-your-pocket/"
  },
  {
    "n": 45,
    "label": "El-Sayed for Senate, data-center terms of engagement.",
    "url": "https://abdulforsenate.com/2026/01/datacenters/"
  },
  {
    "n": 46,
    "label": "Zohran for NYC, $30-by-2030 canvass.",
    "url": "https://volunteer.zohranfornyc.com/canvass-for-zohran-with-the-uaw"
  },
  {
    "n": 47,
    "label": "HuffPost, Rogers goes after El-Sayed's mother in the Michigan Senate debate.",
    "url": "https://www.huffpost.com/entry/mike-rogers-pulls-the-your-mom-card-on-el-sayed-in-michigan-senate-debate_n_6ac7b573e4b09d2661d5b26c"
  },
  {
    "n": 48,
    "label": "Snopes, claim linking El-Sayed's mother to a charity and terrorist groups is missing key context.",
    "url": "https://www.snopes.com/news/2026/08/25/el-sayed-mother-charity-terrorism/"
  },
  {
    "n": 49,
    "label": "Islamic School of Columbia-Missouri, counselor biography for Fatten Elkomy.",
    "url": "http://www.theiscm.net/councellor.html"
  },
  {
    "n": 50,
    "label": "NPPES NPI Registry, Fatten F. Elkomy, psychiatric / mental-health nurse practitioner.",
    "url": "https://npiregistry.cms.hhs.gov/provider-view/1316388754"
  },
  {
    "n": 52,
    "label": "Justice Department, Jan. 16, 2008: the indictment does not charge material support of terrorism.",
    "url": "https://www.justice.gov/archive/opa/pr/2008/January/08_nsd_029.html"
  },
  {
    "n": 54,
    "label": "New York City Board of Elections, certified 2020 Assembly District 36 Democratic primary.",
    "url": "https://vote.nyc/sites/default/files/pdf/election_results/2020/20200623Primary%20Election/01402400036Queens%20Democratic%20Member%20of%20the%20Assembly%2036th%20Assembly%20District%20Recap.pdf"
  },
  {
    "n": 57,
    "label": "City & State, taxi hunger strike day 7: Mamdani arrested blocking traffic.",
    "url": "https://www.cityandstateny.com/politics/2021/10/taxi-drivers-plan-hunger-strike-debt-relief/186185/"
  },
  {
    "n": 59,
    "label": "New York City Board of Elections, 2025 Democratic mayor ranked-choice recap.",
    "url": "https://www.vote.nyc/sites/default/files/pdf/election_results/2025/20250624Primary%20Election/rcv/DEM_Mayor_Citywide.pdf"
  },
  {
    "n": 61,
    "label": "Encyclopaedia Britannica, James Talarico.",
    "url": "https://www.britannica.com/biography/James-Talarico"
  },
  {
    "n": 62,
    "label": "Texas Tribune, how teaching middle school spurred Talarico's Senate bid.",
    "url": "https://www.texastribune.org/2026/01/16/james-talarico-texas-senate-democrat-teacher-election-2026/"
  },
  {
    "n": 64,
    "label": "Associated Press, Talarico wins the Texas Senate Democratic nomination.",
    "url": "https://apnews.com/article/texas-election-senate-crockett-talarico-cornyn-paxton-hunt-4d2fa601c0dab451c2cbd7c6f1483547"
  },
  {
    "n": 65,
    "label": "Ballotpedia, 2026 Texas Democratic Senate primary results.",
    "url": "https://ballotpedia.org/United_States_Senate_election_in_Texas,_2026_(March_3_Democratic_primary)"
  },
  {
    "n": 66,
    "label": "Associated Press, Paxton wins the Republican Senate runoff.",
    "url": "https://apnews.com/article/texas-senate-cornyn-paxton-trump-talarico-4fa609e7ddb93b47ac4e3398a12a472e"
  },
  {
    "n": 67,
    "label": "Talarico for Texas, public education.",
    "url": "https://jamestalarico.com/issue/public-education/"
  },
  {
    "n": 68,
    "label": "Talarico for Texas, labor and business.",
    "url": "https://jamestalarico.com/issue/labor-business/"
  },
  {
    "n": 69,
    "label": "Talarico for Texas, corruption and democracy.",
    "url": "https://jamestalarico.com/issue/corruption-democracy/"
  },
  {
    "n": 70,
    "label": "Talarico for Texas, taxes and cost of living.",
    "url": "https://jamestalarico.com/issue/taxes-cost-of-living/"
  },
  {
    "n": 71,
    "label": "Texas Tribune, Talarico's New American Dream economic agenda.",
    "url": "https://www.texastribune.org/2026/08/05/texas-senate-james-talarico-economic-agenda-ken-paxton/"
  },
  {
    "n": 72,
    "label": "Christian Post, Talarico calls the Ten Commandments bill “deeply un-Christian” (May 2023 hearing).",
    "url": "https://www.christianpost.com/news/texas-lawmaker-ten-commandments-in-schools-deeply-un-christian.html"
  },
  {
    "n": 73,
    "label": "FOX 7 Austin, Talarico reveals his diabetes while introducing insulin legislation.",
    "url": "https://fox7austin.com/news/talarico-reveals-he-has-diabetes-while-introducing-insulin-legislation"
  },
  {
    "n": 74,
    "label": "Texas Tribune, Texas House impeaches Ken Paxton, 121–23.",
    "url": "https://www.texastribune.org/2023/05/27/ken-paxton-texas-house-impeachment-vote"
  },
  {
    "n": 75,
    "label": "Texas Tribune, Dunn and Wilks money around the Paxton impeachment.",
    "url": "https://www.texastribune.org/2023/07/24/ken-paxton-impeachment-dunn-wilks/"
  },
  {
    "n": 76,
    "label": "Texas Tribune, Defend Texas Liberty PAC gives Dan Patrick $1 million and lends $2 million.",
    "url": "https://www.texastribune.org/2023/07/18/ken-paxton-impeachment-dan-patrick/"
  },
  {
    "n": 77,
    "label": "NBC News, Paxton fled home in a truck to avoid a subpoena, process server alleges.",
    "url": "https://www.nbcnews.com/politics/politics-news/texas-ag-paxton-fled-home-truck-driven-wife-avoid-subpoena-process-ser-rcna49558"
  },
  {
    "n": 78,
    "label": "Texas Tribune, Paxton's pretrial diversion deal in the securities-fraud case.",
    "url": "https://www.texastribune.org/2024/03/25/ken-paxton-plea-deal-securities-fraud-felony/"
  },
  {
    "n": 83,
    "label": "FOX 7 Austin, Paxton's rally remarks and Trump's call for a debate.",
    "url": "https://www.fox7austin.com/news/texas-senate-talarico-paxton-debate-trump"
  },
  {
    "n": 84,
    "label": "TheWrap, Talarico on Morning Joe challenges Paxton to debates.",
    "url": "https://www.thewrap.com/media-platforms/politics/morning-joe-james-talarico-ken-paxton-debate-challenge/"
  },
  {
    "n": 85,
    "label": "Washington Examiner, Talarico ad on Paxton refusing to debate.",
    "url": "https://www.washingtonexaminer.com/?p=4709396"
  },
  {
    "n": 86,
    "label": "The Hill via Yahoo, Talarico joins the 2025 quorum break.",
    "url": "https://www.yahoo.com/news/articles/texas-legislator-james-talarico-democratic-232949168.html"
  },
  {
    "n": 87,
    "label": "KSAT, Texas Supreme Court rejects removing Democratic lawmakers over the quorum break.",
    "url": "https://www.ksat.com/news/texas/2026/05/15/texas-supreme-court-rejects-abbotts-request-to-remove-democratic-rep-gene-wu-from-office-over-redistricting-protest/"
  },
  {
    "n": 90,
    "label": "CNN via KVIA, Cuomo and Mamdani in the final primary debate.",
    "url": "https://kvia.com/news/2025/06/12/cuomo-and-mamdani-tear-into-each-other-in-final-new-york-city-mayoral-debate/"
  },
  {
    "n": 93,
    "label": "JNS, Trump calls Mamdani a “100% Communist Lunatic.”",
    "url": "https://www.jns.org/trump-post-new-york-primary-mamdani-a-100-communist-lunatic"
  },
  {
    "n": 94,
    "label": "Straight Arrow News, Mamdani responds to Trump's arrest threat.",
    "url": "https://san.com/cc/we-wont-accept-this-intimidation-mamdani-responds-to-trump-threat/"
  },
  {
    "n": 95,
    "label": "Newsweek, Mamdani's victory speech in full.",
    "url": "https://www.newsweek.com/zohran-mamdanis-victory-speech-in-full-10994437"
  },
  {
    "n": 96,
    "label": "CBS News, Trump and Mamdani in the Oval Office.",
    "url": "https://www.cbsnews.com/news/trump-mamdani-biggest-points-of-praise-oval-office-meeting-white-house/"
  },
  {
    "n": 97,
    "label": "THE CITY, Mamdani's polar plunge and social videos.",
    "url": "https://www.thecityreporter.nyc/2025/01/21/zohran-mamdani-instagram-tiktok-social-media/"
  },
  {
    "n": 100,
    "label": "Washington Times, Mamdani concedes free buses won't happen this year.",
    "url": "https://www.washingtontimes.com/news/2026/apr/9/zohran-mamdani-concedes-free-bus-pledge-wont-fulfilled-year/"
  },
  {
    "n": 101,
    "label": "Gothamist, lawmakers back Mamdani's tax on the rich, setting up a clash with Hochul.",
    "url": "https://gothamist.com/news/ny-lawmakers-back-mamdani-push-to-tax-the-rich-setting-up-clash-with-hochul"
  },
  {
    "n": 102,
    "label": "Bloomberg Law, landlords sue to void the rent freeze.",
    "url": "https://news.bloomberglaw.com/new-york-brief/nyc-landlords-sue-to-invalidate-mamdani-backed-rent-freeze"
  },
  {
    "n": 104,
    "label": "Al Jazeera, Mamdani's record DoorDash settlement.",
    "url": "https://aljazeera.com/economy/2026/9/22/nyc-mayor-mamdani-reaches-record-doordash-settlement-for-underpaid-workers"
  },
  {
    "n": 105,
    "label": "Associated Press via ADN, Cuomo stays in the race as an independent.",
    "url": "https://www.adn.com/nation-world/2025/07/14/cuomo-stays-in-nyc-mayors-race-as-an-independent-after-losing-democratic-primary-to-mamdani/"
  },
  {
    "n": 110,
    "label": "Michigan Daily, Clinton rallies grads (2007 commencement).",
    "url": "https://www.michigandaily.com/uncategorized/clinton-rallies-grads/"
  },
  {
    "n": 111,
    "label": "Bridge Michigan, El-Sayed's Wayne County record.",
    "url": "https://bridgemi.com/michigan-government/abdul-el-sayed-under-the-microscope-from-public-health-to-politics/"
  },
  {
    "n": 112,
    "label": "ClickOnDetroit, El-Sayed launches his Senate campaign.",
    "url": "https://clickondetroit.com/news/local/2025/04/17/abdul-el-sayed-launches-campaign-for-michigans-us-senate-seat"
  },
  {
    "n": 113,
    "label": "Newsweek, AIPAC money in Michigan's Senate primary.",
    "url": "https://www.newsweek.com/aipac-soros-money-shaping-michigans-senate-race-12532088"
  },
  {
    "n": 114,
    "label": "FOX 2 Detroit, El-Sayed after his primary win.",
    "url": "https://www.fox2detroit.com/news/senate-primary-winner-abdul-el-sayed-talks-upset-over-haley-stevens-we-shook-up-world"
  },
  {
    "n": 115,
    "label": "Michigan Public, fact check: the Florida tag follows Mike Rogers.",
    "url": "https://www.michiganpublic.org/politics-government/2026-09-08/fact-check-florida-man-tag-follows-mike-rogers-in-new-u-s-senate-bid"
  },
  {
    "n": 116,
    "label": "Daily Beast, El-Sayed debates an empty podium on Fox 2.",
    "url": "https://www.thedailybeast.com/dem-star-abdul-el-sayed-skewers-coward-trump-pick-mike-rogers-on-live-tv/"
  },
  {
    "n": 117,
    "label": "CBS News, Rogers skips the Fox 2 event.",
    "url": "https://www.cbsnews.com/news/mike-rogers-senate-debate-abdul-el-sayed/"
  },
  {
    "n": 118,
    "label": "Mediaite, El-Sayed holds up two fingers.",
    "url": "https://www.mediaite.com/politics/how-many-yachts-do-you-have-el-sayed-holds-up-two-fingers-as-mike-rogers-dodges-debate-jab/"
  },
  {
    "n": 119,
    "label": "Detroit News via KDH News, the Oct. 8 debate decoded.",
    "url": "https://kdhnews.com/news/politics/el-sayed-rogers-debate-rife-with-interruptions-we-decoded-the-insults/article_f3f10016-ecd6-50a4-ace8-fe3d77993cf9.html"
  },
  {
    "n": 120,
    "label": "PolitiFact, fact-checking the Michigan Senate debate.",
    "url": "https://politifact.com/article/2026/oct/08/michigan-senate-debate-fact-check-el-sayed-rogers/"
  },
  {
    "n": 121,
    "label": "Associated Press via AJC, the first Michigan Senate debate grows hostile.",
    "url": "https://www.ajc.com/news/2026/10/rogers-and-el-sayed-attack-each-other-forcefully-as-first-michigan-senate-debate-grows-hostile/"
  },
  {
    "n": 122,
    "label": "PolitiFact, the debate exchange about El-Sayed's mother.",
    "url": "https://politifact.com/article/2026/oct/08/michigan-senate-debate-fact-check-el-sayed-rogers/"
  },
  {
    "n": 123,
    "label": "Newsweek, the first Michigan Senate debate.",
    "url": "https://www.newsweek.com/mike-rogers-abdul-el-sayed-first-debate-michigan-12543810"
  },
  {
    "n": 124,
    "label": "KUT, the Texas House passes school vouchers.",
    "url": "https://www.kut.org/politics/2025-04-16/texas-house-billions-school-funding-voucher"
  },
  {
    "n": 125,
    "label": "Mediaite, Joe Rogan urges Talarico to run for president.",
    "url": "https://www.mediaite.com/media/podcasts/joe-rogan-urges-texas-progressive-you-need-to-run-for-president"
  },
  {
    "n": 126,
    "label": "KSAT, Colbert blasts CBS for nixing the Talarico interview.",
    "url": "https://www.ksat.com/news/texas/2026/02/17/stephen-colbert-blasts-cbs-for-nixing-james-talarico-interview/"
  },
  {
    "n": 127,
    "label": "KEDT, Kimmel's Talarico interview won't air on ABC.",
    "url": "https://www.kedt.org/texas-news/2026-09-10/jimmy-kimmels-interview-with-james-talarico-wont-air-on-abc-will-go-to-youtube-instead"
  },
  {
    "n": 128,
    "label": "Texas Tribune, Paxton's impeachment lawyer endorses Talarico.",
    "url": "https://www.texastribune.org/2026/06/08/texas-ken-paxton-impeachment-lawyer-dan-cogdell-james-talarico-endorsement-senate/"
  },
  {
    "n": 140,
    "label": "Talarico for Texas, Meet James.",
    "url": "https://jamestalarico.com/meet-james-talarico/"
  },
  {
    "n": 141,
    "label": "USA Today, Talarico on what his dad taught him a man does.",
    "url": "https://www.usatoday.com/story/opinion/columnist/2026/06/06/james-talarico-texas-masculinity/90420159007/"
  },
  {
    "n": 142,
    "label": "Vulture, what Mira Nair taught Zohran Mamdani.",
    "url": "https://www.vulture.com/article/what-mira-nair-taught-zohran-mamdani.html"
  },
  {
    "n": 143,
    "label": "The Indian Eye, Mamdani on the meaning of Zohran.",
    "url": "https://theindianeye.com/2025/10/07/qa-with-zohran-mamdani-the-values-and-ideals-given-by-my-family-make-me-a-proud-indian-american/"
  },
  {
    "n": 144,
    "label": "James Talarico, My mom taught me how to fight.",
    "url": "https://jamestalarico.substack.com/p/my-mom-taught-me-how-to-fight"
  },
  {
    "n": 145,
    "label": "NBC News, Eric Adams backs Andrew Cuomo.",
    "url": "https://www.nbcnews.com/politics/elections/new-york-city-mayor-eric-adams-backs-andrew-cuomo-race-succeed-rcna239364"
  },
  {
    "n": 146,
    "label": "Michigan Advance, Rogers made almost $100K advising a company that helped Maduro's regime spy on citizens.",
    "url": "https://michiganadvance.com/2026/01/20/mike-rogers-made-almost-100k-advising-a-company-that-helped-maduro-regime-spy-on-its-citizens/"
  },
  {
    "n": 147,
    "label": "Iron Mountain Daily News, GOP super PAC commits $45M to Michigan's Senate race.",
    "url": "https://www.ironmountaindailynews.com/news/local-news/2026/04/gop-super-pac-commits-45m-to-michigan-us-senate-race/"
  },
  {
    "n": 148,
    "label": "Yahoo News, Trump's post and El-Sayed's reply.",
    "url": "https://www.yahoo.com/news/politics/articles/panicked-trump-loses-dem-star-084813690.html"
  },
  {
    "n": 149,
    "label": "National Women's History Museum, Alexandria Ocasio-Cortez biography.",
    "url": "https://www.womenshistory.org/education-resources/biographies/alexandria-ocasio-cortez"
  },
  {
    "n": 150,
    "label": "U.S. House, About Representative Ocasio-Cortez.",
    "url": "https://ocasio-cortez.house.gov/about"
  },
  {
    "n": 151,
    "label": "Ocasio-Cortez for Congress, About.",
    "url": "https://www.ocasiocortez.com/about"
  },
  {
    "n": 152,
    "label": "Bon Appétit, Ocasio-Cortez on lessons from restaurants.",
    "url": "https://www.bonappetit.com/story/alexandria-ocasio-cortez-lessons-from-restaurants"
  },
  {
    "n": 153,
    "label": "Yahoo Finance, Ocasio-Cortez: I'm proud to be a bartender.",
    "url": "https://finance.yahoo.com/news/aoc-bartender-proud-comments-174354768.html"
  },
  {
    "n": 154,
    "label": "Ballotpedia, Alexandria Ocasio-Cortez.",
    "url": "https://ballotpedia.org/Alexandria_Ocasio-Cortez"
  },
  {
    "n": 156,
    "label": "CBS News, Ocasio-Cortez and Markey introduce the Green New Deal, February 7, 2019.",
    "url": "https://www.cbsnews.com/news/green-new-deal-alexandria-ocasio-cortez-introduces-2020-policy-test/"
  },
  {
    "n": 157,
    "label": "Congressional Record, July 23, 2020, Ocasio-Cortez remarks on the House floor.",
    "url": "https://www.govinfo.gov/content/pkg/CREC-2020-07-23/html/CREC-2020-07-23-pt1-PgH3702-2.htm"
  },
  {
    "n": 158,
    "label": "Political Arcades, Greatest Hits.",
    "url": "https://politicalarcades.com/greatest-hits/"
  },
  {
    "n": 159,
    "label": "CNN, Ocasio-Cortez five-minute ethics hypothetical, February 8, 2019.",
    "url": "https://www.youtube.com/watch?v=TJlpS4vhKP0"
  },
  {
    "n": 160,
    "label": "NowThis, Ocasio-Cortez questions Mark Zuckerberg, October 2019.",
    "url": "https://www.youtube.com/watch?v=LFQZFFq7sis"
  },
  {
    "n": 161,
    "label": "NYC Mayor’s Office, June 25, 2026 statement on the rent-freeze vote.",
    "url": "https://www.nyc.gov/mayors-office/news/2026/06/mayor-mamdani-s-statement-on-the-rent-guidelines-board-s-final-v"
  },
  {
    "n": 162,
    "label": "NYC Mayor’s Office, September 10, 2026 launch of free 2-K.",
    "url": "https://www.nyc.gov/mayors-office/news/2026/09/transcript--mayor-mamdani-holds-a-press-conference-with-governor"
  }
];
