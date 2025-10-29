/**
 * data.js
 *
 * Contains all the static game data for the DM Screen.
 * This keeps the main logic file (main.js) clean and data-driven.
 */

const characterNames = [
  "Robert", "Louis", "Stevenson", "Spike", "Straker", "Carroll", "Hellsing", "Wells", "Mary", "Cushing",
  "Ned", "Shelly", "Shreck", "Jonathan", "Corinthian", "Morris", "Modroon", "Bree", "Harker", "Meater",
  "Lucy", "Clerval", "Drumschlik", "Lavenza", "Victor", "Ahab", "Ruthven", "Tithar", "Ada", "Forte",
  "Faust", "Gray", "Oscar", "Todd", "Basker", "Dicken", "Dodger", "Victor", "Vlad", "George",
  "William", "Alice", "Rowlveress", "Louis", "Rice", "Federico", "Douglas", "Madge", "Schmek", "Ordinary",
  "Lee", "Sater", "Dedlock", "Dolly", "Mason", "Tallywag", "Ceridwen", "Pipes", "Twist", "Griffin",
  "Kemp", "Prendick", "Dolly", "Gregson", "Lestrade", "Kessler", "Gilgamesh", "Aino", "Lovelace", "Talbot",
  "Lipwig", "Wolfgang", "Fryderi", "Lugosi", "Holmwood", "Vanko", "Villarias", "Carradine", "D'Arcy", "Naschy",
  "O'Keeffe", "Oldman", "Warren", "McTavish", "Babbage", "Carpenter", "Sam", "Coraline", "Numiner", "Dante",
  "Montgomery", "Marley", "Grendel", "Barker", "Summerson", "Riou", "Dorothy", "Gray", "Hyde", "Moriarty"
];

const occupations = [
  { occupation: "Teurastaja", benefit: "+1 STR" }, { occupation: "Leipuri", benefit: "+1 PRC" },
  { occupation: "Kynttiläntekijä", benefit: "Kantaa aina kynttilää" }, { occupation: "Rotanpyydystäjä", benefit: "+1 TGH" },
  { occupation: "Konstaapeli", benefit: "Pamppu" }, { occupation: "Kulkuri", benefit: "1 Satunainen Esine" },
  { occupation: "Vartija", benefit: "+1 PRC" }, { occupation: "Rahakas", benefit: "5 Shillinkiä" },
  { occupation: "Akateemikko", benefit: "+1 PRC" }, { occupation: "Apteekkari", benefit: "+1 TGH" },
  { occupation: "Savimaakari", benefit: "+1 AGT" }, { occupation: "Panimomies", benefit: "Viski" },
  { occupation: "Kirurki", benefit: "1 Tohtorin laukku" }, { occupation: "Leikkaaja", benefit: "1 Veitsi" },
  { occupation: "Haudankaivaja", benefit: "1 Lapio" }, { occupation: "Valelääkäri", benefit: "1 Ihmeparannusaine" },
  { occupation: "Lalvamies", benefit: "1 Kalastusverkko" }, { occupation: "Patomies", benefit: "1 Kivivasara" },
  { occupation: "Teloittaja", benefit: "1 Kirves" }, { occupation: "Tohtori", benefit: "1 Tohtorin laukku" },
  { occupation: "Kalastaja", benefit: "1 Kala" }, { occupation: "Lasipuhaltaja", benefit: "1 Oil Lamp" },
  { occupation: "Asoseppä", benefit: "1 Pistooli" }, { occupation: "Vaatturi", benefit: "5 Shillinkiä" },
  { occupation: "Rottiensyöjä", benefit: "1 Satunainen esine" }, { occupation: "Käsityöläinen", benefit: "1 Varras" },
  { occupation: "Tanssija", benefit: "+1 AGT" }, { occupation: "Asekeräiljä", benefit: "1 Satunainen Ase" },
  { occupation: "Viemärityöläinen", benefit: "1 Lapio" }, { occupation: "Sahaaja", benefit: "1 Saha" },
  { occupation: "Mylläri", benefit: "1 Suolapussi" }, { occupation: "Varastoija", benefit: "1 Valkosipuli" },
  { occupation: "Trokari", benefit: "1 Ihmeparannusaine" }, { occupation: "Neuloja", benefit: "1 Hat Pin" },
  { occupation: "Hautavaras", benefit: "1 Lapio" }, { occupation: "Varas", benefit: "1 Tiirikka" },
  { occupation: "Historioitsija", benefit: "1 Satunainen artifakti" }, { occupation: "Pastori", benefit: "+1 PRC" },
  { occupation: "Seilori", benefit: "1 Vahattu takki" }, { occupation: "Ihmissusien Kauhu", benefit: "1 Silver Bullet" },
  { occupation: "Valkosipulifarmare", benefit: "1 Valkosipuli" }, { occupation: "Nuorallakävelijä", benefit: "+1 AGT" },
  { occupation: "Ruumilnavaaja", benefit: "+1 TGH" }, { occupation: "Peruukklentekijä", benefit: "1 Peruukki" },
  { occupation: "Nuohooja", benefit: "1 Viski" }, { occupation: "Outo akateemikko", benefit: "1 Satunainen Pimeä Manuskripti" },
  { occupation: "Portinvartija", benefit: "1 Satunainen Esine" }, { occupation: "Metallityöläinen", benefit: "1 Satunainen Ase" },
  { occupation: "Dilleri", benefit: "Oopium!" }, { occupation: "Kaksoisvuoro", benefit: "Pyöritä kahdesti, ota molemmat." }
];

const guildNamePart1 = [
  "The Bow", "The Legged", "The Dusty", "The Cossack", "The Crypt", "The Beast", "The Wet", "The Small", "The Tidy", "The Left",
  "The Right", "The Lockwith", "The Bay", "The Angels", "The Red", "The Blue", "The Green", "The Immature", "The Poor", "The Wise",
  "The Dead", "The Dense", "The Wednesday", "The Diabolical", "The Heavy", "The Panda", "The Penny", "The Dog", "The Cat", "The Dodo",
  "The Police", "The Faith", "The Hidden", "The Silly", "The Hog", "The Dice", "The Terrible", "The Awful", "The Beautiful", "The Appalling",
  "The Fearful", "The Grim", "The Silent", "The Long", "The Shocking", "The Harrowing", "The Shocking", "The Bloodless", "The Unspeakable", "The Stern",
  "The Cynical", "The Ghastly", "The Bright", "The Dark", "The Cruel", "The Kind", "The Dingy", "The Bleak", "The Raven", "The Poe",
  "The Dismal", "The Vicious", "The Savage", "The Broken", "The Fatalistic", "The Comedy", "The Neutral", "The Nameless", "The Sexy", "The Macabre",
  "The Concerning", "The Worried", "The Morbid", "The Happy", "The Swell", "The Down", "The Up", "The Savage", "The Brutal", "The Pig",
  "The Hatter", "The Mirthless", "The Mirthful", "The Harsh", "The Slack", "The Dutch", "The Unseen", "The Fresh", "The Breaded", "The Baked",
  "The Crusty", "The Grumpy", "The Austere", "The Barbarous", "The Surely", "The Scowling", "The Sulky", "The Sour", "The Cold", "The Grave"
];

const guildNamePart2 = [
  "Gang", "Crew", "Team", "Company", "Rooster", "Posse", "Corps", "Squad", "Crowd", "Collective",
  "Force", "Herd", "Pack", "Tables", "Party", "Band", "Horde", "Throng", "Mob", "Detachment",
  "Troop", "Faction", "Division", "Society", "Club", "League", "Circle", "Union", "Squares", "Box",
  "Association", "Inc.", "Ring", "Set", "Coterie", "Section", "Partnership", "Cooperative", "Consortium", "Pub",
  "Clique", "Batch", "Classification", "Class", "Category", "Guild", "Caucus", "Bloc", "Cabal", "Confederacy",
  "Junta", "Cell", "Sect", "Clan", "Fellowship", "Fraternity", "Sorority", "Community", "Syndicate", "Nucleus",
  "Commerce", "Society", "Lodge", "Affiliation", "Alliance", "Order", "Nation", "Federation", "Body", "College",
  "School", "Relation", "Family", "Connection", "Link", "Amalgamation", "Trust", "Charity", "Business", "Private Entity",
  "Cooperative", "Organization", "Structure", "Warband", "Administration", "Government", "Method", "System", "Operation", "Criminals",
  "Prison", "Firm", "Film", "Fast", "Zoo", "Click", "Balance", "Streets", "Ghosts", "Demons"
];

const virtues = [
  { virtue: "Aloittelija", description: "Ei hyvettä" },
  { virtue: "Metsästäjä", description: "Kaatuneen vampyyrin lähellä voit käyttää varrasta ilmaiseksi." },
  { virtue: "Toinen mahdollisuus", description: "Kuolonpelastuksen voi heittää uudelleen." },
  { virtue: "Takoja", description: "Kaikki aseesi ovat aina hopeoituja." },
  { virtue: "Epäuskoinen", description: "Pro testit joita pedot laittavat tekemään läpäistään aina." },
  { virtue: "Verivala", description: "Immuuni infektioille." },
  { virtue: "Kissansilmät", description: "Pimeys ei haittaa." },
  { virtue: "Ei mitään", description: "Heitä uudelleen." },
  { virtue: "Mighty Blow", description: "When using a Stone Hammer always deal 1 damage." },
  { virtue: "Nopeat kädet", description: "Lataa ilmaisena tekona." },
  { virtue: "Organisoitu", description: "Tilaa kolmelle lisätavaralle." },
  { virtue: "Yhteyksissa", description: "Jos kaadut, saat kuolonpelastuksen automaattisesti ja uuden aseen." },
  { virtue: "Puutyötaitoinen", description: "Vaarnat eivät vie tilaa ja omaa aina yhden." },
  { virtue: "Tohtori", description: "Aloittaa aina ilmaisella tohtorin salkulla." },
  { virtue: "Valkosipulifarmari", description: "Haisee niin pahalta että vampyyrit saavat -3 hyökkäyksiinsä häneen." },
  { virtue: "Ylimistö", description: "Jos elää skenaarion lopussa, joukko saa 5 lisäshillinkiä." },
  { virtue: "Ei mitään", description: "Heitä uudelleen" },
  { virtue: "Kirottu", description: "Ei voi kuolla, mutta ei voi parantaa HPta." },
  { virtue: "Likainen tappelija", description: "Nyrkit tekevät D4 vahinkoa ja saavat julma lisäosan." },
  { virtue: "Koulutettu", description: "Valitse hyveesi itse!" },
];

const vices = [
  { vice: "Sadekuuro", description: "Pyöritä kahdesti uudestaan. Molemmat." },
  { vice: "Tupakanpolttaja", description: "Tgh -1 Agt -1" },
  { vice: "Epäonnekas", description: "Pyöritä aina 20 uudestaan." },
  { vice: "Kauhujen kangistama", description: "-3 etäiskuihin." },
  { vice: "Lukutaidoton", description: "Ei voi lukea manuskripteja." },
  { vice: "Anaphylaxis", description: "Ei voi kantaa valkosipulia." },
  { vice: "Pelokas", description: "-3 Moraalitesteihin." },
  { vice: "Selenophobia", description: "-3 kaikkeon täysikuun aikaan." },
  { vice: "Heikkomieli", description: "Et läpäise infektiotestejä." },
  { vice: "Epäkuolleiden pelko", description: "-3 kun taistelet epäkuolleita." },
  { vice: "Kipeänä", description: "-1 Agt -1 Tgh" },
  { vice: "Varastelija", description: "Varastaa 5 shillinkiä satunnaiselta jäseneltä." },
  { vice: "Pimeän pelko", description: "Pitää aina olla valon lähellä." },
  { vice: "Oppimaton", description: "Ei voi parantaa XP:llä." },
  { vice: "Uninen", description: "-2 Pre." },
  { vice: "Tautinen", description: "Joka skenaario alussa D4. +3 on sairas." },
  { vice: "Vampyyripeko", description: "Jos vampyyreja on läsnä. Moraalitesti jatkuvasti." },
  { vice: "Allergikko", description: "-1 jos vihollinen on eläimellinen." },
  { vice: "Ylityö", description: "-1 Str" },
  { vice: "Onnekas", description: "Ei pahetta." },
];