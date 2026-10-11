// Three Roads to the Capitol: the comic script.
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
// Facts checked against the sources as of October 11, 2026.

export const STYLE = "Chibi comic illustration matching the Capitol Crashers comic: big heads, short bodies, clean black outlines, soft cel shading, rich painterly light. No text, no lettering, no speech bubbles, no signs with words.";

export const PAGES = [
  {
    "id": "issue-1",
    "label": "Issue #1 · Prologue",
    "chapter": "Three roads, one building",
    "panels": [
      {
        "id": "open",
        "where": "both",
        "size": "wide",
        "art": "open.webp",
        "tag": "October 2026",
        "alt": "Mamdani, El-Sayed and Talarico walk side by side up a rain-slick avenue, the Capitol dome lit behind them.",
        "captions": [
          {
            "text": "October 2026. Three men are walking toward the same building.",
            "at": "tl"
          },
          {
            "text": "One already runs America’s biggest city. The other two are on the ballot November 3.",
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
        "id": "open-n",
        "kind": "narration",
        "where": "both",
        "tag": "How they got here",
        "captions": [
          {
            "text": "A filmmaker’s son from Uganda. An engineer’s son from Michigan. A preacher’s grandson from Texas.",
            "big": true
          },
          {
            "text": "None of them was supposed to win. This is how they got here, who tried to stop them, and where they say they’re taking us."
          }
        ],
        "cites": [
          1,
          3,
          61
        ]
      }
    ]
  },
  {
    "id": "maps",
    "label": "Issue #1 · Part 1",
    "chapter": "Born on three maps",
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
            "at": "bl"
          }
        ],
        "cites": [
          1,
          2
        ],
        "prompt": "Warm golden-hour Kampala hillside with red-earth roads and jacaranda trees. A young South Asian woman filmmaker with long dark wavy hair and a middle-aged Ugandan-Indian scholar in his mid-forties cradle a newborn wrapped in a patterned cloth. The scholar has round glasses, receding salt-and-pepper hair, a thin scholarly face, and no full beard. They are parents, not the young bearded fighters. Loving, hopeful. No lettering."
      },
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
          }
        ],
        "cites": [
          3,
          4
        ],
        "prompt": "Early-1980s autumn campus at dusk. A young Egyptian engineer in his late twenties, short dark hair, thin mustache only, no full beard, brown corduroy jacket, stack of engineering textbooks, brick university buildings, Detroit skyline, faded Mediterranean lighthouse in the clouds. Not the bearded fighter. No readable text."
      },
      {
        "id": "t01",
        "where": "texas",
        "size": "wide",
        "art": "t01.webp",
        "tag": "Round Rock · 1989",
        "alt": "A young mother holds her newborn on a porch swing in Round Rock, Texas, at sunset.",
        "captions": [
          {
            "text": "Round Rock, Texas. May 17, 1989. James Talarico is born.",
            "at": "tl"
          },
          {
            "text": "His mom’s father is a Baptist preacher. Later, Mark Talarico adopts him and gives him his name.",
            "at": "bl"
          }
        ],
        "cites": [
          61
        ],
        "prompt": "Round Rock, Texas, 1989: a young mother on a porch swing cradles a newborn, live oak, old pickup, church steeple, sunset."
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
      }
    ]
  },
  {
    "id": "before",
    "label": "Issue #1 · Part 2",
    "chapter": "Before politics",
    "panels": [
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
            "text": "College in Maine. Then a detour: he raps as “Mr. Cardamom.”",
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
      },
      {
        "id": "t02",
        "where": "texas",
        "size": "half",
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
      },
      {
        "id": "p08",
        "where": "queens",
        "size": "wide",
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
      }
    ]
  },
  {
    "id": "first-fights",
    "label": "Issue #1 · Part 3",
    "chapter": "First fights",
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
            "text": "He wins the seat at 29, the youngest member of the legislature. In 2021 he helps pass a law capping insulin copays.",
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
        "id": "p12",
        "where": "detroit",
        "size": "half",
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
      },
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
      }
    ]
  },
  {
    "id": "issue-2",
    "label": "Issue #2",
    "chapter": "The money comes",
    "panels": [
      {
        "id": "n2",
        "kind": "narration",
        "where": "both",
        "tag": "2024–2026",
        "captions": [
          {
            "text": "Then they ran for the big jobs.",
            "big": true
          },
          {
            "text": "And every time one of them got close, the people with the most to lose came after them."
          }
        ]
      },
      {
        "id": "pplunge",
        "where": "queens",
        "size": "wide",
        "art": "pplunge.webp",
        "tag": "Coney Island · Jan 1, 2025",
        "alt": "Mamdani leaps into the icy ocean in a thrift-store suit while a crowd cheers on the beach.",
        "captions": [
          {
            "text": "He’s running for mayor and polling in the single digits.",
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
          59,
          105
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
            "text": "The Rent Guidelines Board freezes the rent on about one million apartments.",
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
            "text": "Free, full-day child care for two-year-olds starts: more than 2,000 seats in the first four neighborhoods.",
            "at": "tl"
          }
        ],
        "cites": [
          34
        ],
        "prompt": "A bright New York toddler classroom. Two-year-olds painting and stacking blocks. One parent waving goodbye at the door with relief. Warm joyful light. No politicians. No bearded men in suits. No henley. No stethoscope. No lettering on the walls."
      },
      {
        "id": "p24",
        "where": "queens",
        "size": "half",
        "art": "p24.webp",
        "tag": "September 2026",
        "alt": "Delivery workers on e-bikes cheer in the rain as gold coins fall around them.",
        "captions": [
          {
            "text": "$131.5 million from DoorDash for about 260,000 underpaid delivery workers.",
            "at": "tl"
          },
          {
            "text": "DoorDash’s own statement: “Simply put, we screwed up.”",
            "at": "br"
          }
        ],
        "sfx": {
          "text": "PAID!",
          "x": 66,
          "y": 16,
          "rot": -6
        },
        "cites": [
          36,
          104
        ],
        "prompt": "Wide 2:1. A line of food-delivery workers on e-bikes in the rain on a New York avenue, insulated bags on their backs, raising fists and cheering as gold coins rain down around them. Neon storefront reflections, cyan and gold."
      },
      {
        "id": "n2b",
        "kind": "narration",
        "where": "queens",
        "tag": "The score so far",
        "captions": [
          {
            "text": "Not everything lands."
          },
          {
            "text": "Albany hasn’t paid for free buses. The governor blocked his tax on millionaires. Landlords are suing to undo the freeze. He keeps pushing."
          }
        ],
        "cites": [
          100,
          101,
          102
        ]
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
          }
        ],
        "bubbles": [
          {
            "who": "El-Sayed",
            "text": "Now, it’s time to bring that Michigan grit to Washington.",
            "x": 74,
            "y": 82,
            "tail": "n",
            "w": 40
          }
        ],
        "cites": [
          31,
          41,
          112
        ],
        "prompt": "Landscape 4:3. A small rented Detroit campaign office at night, folding tables, four staffers on laptops, a hand-painted banner (no readable text). An Egyptian-American man in rolled shirtsleeves grins and holds up a fistful of paper receipts. Gold desk lamps, cyan laptop glow."
      },
      {
        "id": "p25",
        "where": "detroit",
        "size": "half",
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
            "x": 52,
            "y": 22,
            "tail": "s",
            "w": 18
          }
        ],
        "cites": [
          86,
          87
        ],
        "prompt": "Night tarmac, Austin, 2025: Texas Democratic legislators with suitcases board a chartered jet; Talarico turns back on the stairs."
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
        "id": "pintro",
        "where": "texas",
        "size": "half",
        "art": "pintro.webp",
        "tag": "Meet Ken Paxton",
        "alt": "Ken Paxton smirks on the Texas Capitol steps as an endless blank scroll unrolls behind him.",
        "captions": [
          {
            "text": "His opponent: Attorney General Ken Paxton. Indicted for securities fraud in 2015; resolved in 2024 with a deal: community service, ethics classes and about $271,000 in restitution.",
            "at": "tl"
          },
          {
            "text": "Impeached by the Texas House in 2023, 121 to 23. Acquitted by the Senate.",
            "at": "br"
          }
        ],
        "cites": [
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
      }
    ]
  },
  {
    "id": "issue-3",
    "label": "Issue #3",
    "chapter": "Show up and debate",
    "panels": [
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
        "where": "detroit",
        "size": "wide",
        "art": "h09.webp",
        "tag": "The moderator",
        "alt": "El-Sayed stands unbothered at his podium while Rogers points at him.",
        "captions": [
          {
            "text": "It gets so loud the moderator, Rick Albin, can’t get a word in.",
            "at": "tl"
          },
          {
            "text": "Albin: “I’d like to be part of the debate, too.”",
            "at": "tl"
          },
          {
            "text": "After: “In 30 years of doing debates… I’ve never seen it continue during the commercial. But it did.”",
            "at": "br"
          }
        ],
        "cites": [
          119,
          121
        ],
        "prompt": "Closer on the same two-podium debate. Egyptian-American man matching the attached fighter: short close-cropped dark hair covering the whole scalp, short full jaw beard, thick eyebrows, rounder cheeks, navy suit, slight closed-mouth smile, unbothered at his podium. Older gray-haired man pointing from the left. Only two people. No statue, no golden figure, no nurse, no children, no halo, no lettering."
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
            "text": "Then Rogers goes after El-Sayed’s mother.",
            "at": "tl"
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
        "id": "healer",
        "where": "detroit",
        "size": "wide",
        "art": "h01.webp",
        "tag": "Who she is",
        "alt": "An older Egyptian woman in a white coat that flares like a cape, children safe behind her, attack ads tearing into confetti.",
        "captions": [
          {
            "text": "Her name is Fatten Elkomy. She trained as a doctor in Alexandria. Today she’s a psychiatric nurse practitioner in Missouri.",
            "at": "tl"
          },
          {
            "text": "From 1999 to 2004 she worked at a Missouri aid office. She said she served orphans. Officers there were later convicted of sanctions crimes. She was never charged.",
            "at": "br"
          }
        ],
        "cites": [
          48,
          49,
          50,
          122
        ],
        "prompt": "Bold American comic-book splash, heavy black ink, halftone dots, rain-slick night with neon gold, magenta, and cyan. No text, no lettering, no logos, no names. An older Egyptian woman in her late sixties, short dark hair silver at the temples, warm brown eyes, dignified closed-mouth smile. Chibi proportions: large head, short athletic body, same face language as the rest of this fighter-select comic. White nurse-practitioner coat flaring behind her like a gold-lined cape. Teal scrubs underneath. A stethoscope across her chest glowing like a gold shield. Small children of several backgrounds stand safe behind the coat, holding the hem. Attack-ad headlines and a watchlist form bounce off the gold light and tear into confetti. Low heroic angle, clinic windows blazing gold behind her. She looks like a superhero because the work is the power."
      },
      {
        "id": "h06",
        "where": "detroit",
        "size": "half",
        "art": "h06.webp",
        "tag": "The record",
        "alt": "The woman in the white coat walks down federal-building steps into a column of gold light.",
        "captions": [
          {
            "text": "The Justice Department said that case did not charge anyone with material support of terrorism.",
            "at": "tl"
          }
        ],
        "cites": [
          48,
          52
        ],
        "prompt": "Tall comic panel, heavy ink, halftone, no text. An Egyptian woman in a white coat walks down the steps of a gray federal building into a column of gold light. Behind her, a stack of files sits unmarked. She does not look hunted. She looks finished with the questions and late for the next patient. Chibi, chin up, cape-coat catching wind. Cyan rain, gold sunbreak."
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
            "text": "On stage, her son dared Rogers: “Go ahead and say it. You’ve been tiptoeing around it the whole time, just say it.”",
            "at": "tl"
          },
          {
            "text": "She still has her license. She still goes to work.",
            "at": "br"
          }
        ],
        "cites": [
          50,
          122
        ],
        "prompt": "One older Egyptian woman only, matching the attached clinic nurse: short dark hair silver at the temples, weathered brown skin, laugh lines, white coat flaring like a cape over teal scrubs, teal clogs, no hijab. She walks toward a small clinic at dawn, patients waving in the windows, gold sunrise at her back. Adult face in her late fifties, not a child. No lettering."
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
            "y": 20,
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
    "id": "issue-4",
    "label": "Issue #4",
    "chapter": "Where they’re taking us",
    "panels": [
      {
        "id": "n4",
        "kind": "narration",
        "where": "both",
        "tag": "Not yet",
        "captions": [
          {
            "text": "The next pages haven’t happened yet.",
            "big": true
          },
          {
            "text": "Everything on them is a promise these three put in writing. Read it. Then hold them to it."
          }
        ],
        "cites": [
          40,
          41,
          67
        ]
      },
      {
        "id": "p27",
        "where": "queens",
        "size": "wide",
        "art": "fny.webp",
        "tag": "New York",
        "alt": "A future New York morning: riders board a free bus in a red bus lane, a dad drops a toddler at daycare, Mamdani rides along.",
        "captions": [
          {
            "text": "In New York: the rent stays frozen. Every city bus is free and fast. Child care is free from six weeks to five years old.",
            "at": "tl"
          },
          {
            "text": "A $30 minimum wage by 2030. Paid for with a higher corporate tax and 2 percent more on income over $1 million.",
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
        "tag": "Michigan",
        "alt": "A future Detroit street: a family leaves a clinic with no bill, a crew swaps lead pipes for copper, El-Sayed waves from the clinic steps.",
        "captions": [
          {
            "text": "In Michigan: money out of politics. No corporate PAC money, and a fight to end super PACs.",
            "at": "tl"
          },
          {
            "text": "Medicare for All: no premiums, no copays, no deductibles. Medical debt wiped out. Every lead pipe gone by 2030.",
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
        "tag": "Texas",
        "alt": "A future Texas public school: teachers welcome families, Talarico high-fives a kid on the steps.",
        "captions": [
          {
            "text": "In Texas: no private-school vouchers. More teachers and counselors. Universal pre-K and child care. Caps on insulin and drug prices.",
            "at": "tl"
          },
          {
            "text": "Ban super PACs. Ban members of Congress from trading stocks.",
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
          67,
          69,
          70,
          71
        ],
        "prompt": "Future Texas public school: teachers welcome families at a renovated brick school; Talarico kneels to high-five a kid."
      },
      {
        "id": "p26",
        "where": "both",
        "size": "wide",
        "art": "finale.webp",
        "tag": "November 3, 2026",
        "alt": "At dawn, Mamdani, El-Sayed and Talarico stand at the foot of the Capitol steps with a huge crowd of ordinary Americans behind them.",
        "captions": [
          {
            "text": "November 3, 2026. Two of these roads go through the ballot box. The third goes through City Hall every day.",
            "at": "tl"
          },
          {
            "text": "How the story ends is up to whoever shows up.",
            "at": "br"
          }
        ],
        "cites": [
          27,
          37,
          64,
          66
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
      40,
      33
    ],
    "text": "Freeze the rent for every stabilized tenant. The Rent Guidelines Board voted a freeze in June 2026; landlords are suing to undo it."
  },
  {
    "where": "queens",
    "who": "Mamdani",
    "title": "Fast, fare-free buses",
    "cites": [
      40,
      100
    ],
    "text": "End the fare on every city bus and speed them up with priority lanes, queue-jump signals and loading zones. Albany has not funded it yet."
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
    "title": "No-cost child care",
    "cites": [
      40,
      34
    ],
    "text": "Free child care from six weeks to five years, with child-care workers paid like public-school teachers. The first 2-K seats opened in September 2026."
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
    "text": "Match New Jersey's 11.5 percent corporate tax and add 2 percent on income over $1 million. The governor blocked the millionaires tax in 2026."
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
  }
];
