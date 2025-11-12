/**
 * data.js
 *
 * Contains all the static game data for the DM Screen.
 * This keeps the main logic file (main.js) clean and data-driven.
 */

// Data separated from main.js
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
  { id: "teurastaja", occupation: "Teurastaja", benefit: "+1 STR" }, { id: "leipuri", occupation: "Leipuri", benefit: "+1 PRC" },
  { id: "kynttilantekija", occupation: "Kynttiläntekijä", benefit: "Kynttilä" }, { id: "rotanpyydystaja", occupation: "Rotanpyydystäjä", benefit: "+1 TGH" },
  { id: "konstaapeli", occupation: "Konstaapeli", benefit: "Tamppu" }, { id: "kulkuri", occupation: "Kulkuri", benefit: "1 Satunainen Esine" },
  { id: "vartija", occupation: "Vartija", benefit: "+1 PRC" }, { id: "rahakas", occupation: "Rahakas", benefit: "5 Shillinkiä" },
  { id: "akateemikko", occupation: "Akateemikko", benefit: "+1 PRC" }, { id: "apteekkari", occupation: "Apteekkari", benefit: "+1 TGH" },
  { id: "savimaakari", occupation: "Savimaakari", benefit: "+1 AGT" }, { id: "panimomies", occupation: "Panimomies", benefit: "Viski" },
  { id: "kirurki", occupation: "Kirurki", benefit: "Tohtorin laukku" }, { id: "leikkaaja", occupation: "Leikkaaja", benefit: "Veitsi" },
  { id: "haudankaivaja", occupation: "Haudankaivaja", benefit: "Lapio" }, { id: "valelääkäri", occupation: "Valelääkäri", benefit: "Ihmeparannusaine" },
  { id: "lalvamies", occupation: "Lalvamies", benefit: "1 Kalastusverkko" }, { id: "patomies", occupation: "Patomies", benefit: "Kivivasara" },
  { id: "teloittaja", occupation: "Teloittaja", benefit: "Puukirves" }, { id: "tohtori", occupation: "Tohtori", benefit: "Tohtorin laukku" },
  { id: "kalastaja", occupation: "Kalastaja", benefit: "Kala" }, { id: "lasipuhaltaja", occupation: "Lasipuhaltaja", benefit: "Öljylamppu" },
  { id: "asoseppa", occupation: "Asoseppä", benefit: "Flintlock Pistooli" }, { id: "vaatturi", occupation: "Vaatturi", benefit: "5 Shillinkiä" },
  { id: "rottiensyoja", occupation: "Rottiensyöjä", benefit: "1 Satunainen esine" }, { id: "kasityolainen", occupation: "Käsityöläinen", benefit: "Vaarna" },
  { id: "tanssija", occupation: "Tanssija", benefit: "+1 AGT" }, { id: "asekerailija", occupation: "Asekeräiljä", benefit: "1 Satunainen Ase" },
  { id: "viemarityolainen", occupation: "Viemärityöläinen", benefit: "Lapio" }, { id: "sahaaja", occupation: "Sahaaja", benefit: "1 Saha" },
  { id: "myllari", occupation: "Mylläri", benefit: "Suolapussi" }, { id: "varastoija", occupation: "Varastoija", benefit: "Valkosipuli" },
  { id: "trokari", occupation: "Trokari", benefit: "Ihmeparannusaine" }, { id: "neuloja", occupation: "Neuloja", benefit: "Hattuneula" },
  { id: "hautavaras", occupation: "Hautavaras", benefit: "Lapio" }, { id: "varas", occupation: "Varas", benefit: "Tiirikka" },
  { id: "historioitsija", occupation: "Historioitsija", benefit: "1 Satunainen artifakti" }, { id: "pastori", occupation: "Pastori", benefit: "+1 PRC" },
  { id: "seilori", occupation: "Seilori", benefit: "Vahattu Takki" }, { id: "ihmissusien-kauhu", occupation: "Ihmissusien Kauhu", benefit: "Hopeoidut ammukset" },
  { id: "valkosipulifarmare", occupation: "Valkosipulifarmare", benefit: "Valkosipuli" }, { id: "nuorallakavelija", occupation: "Nuorallakävelijä", benefit: "+1 AGT" },
  { id: "ruumilnavaaja", occupation: "Ruumilnavaaja", benefit: "+1 TGH" }, { id: "peruukklentekija", occupation: "Peruukklentekijä", benefit: "Peruukki" },
  { id: "nuohooja", occupation: "Nuohooja", benefit: "Viski" }, { id: "outo-akateemikko", occupation: "Outo akateemikko", benefit: "1 Satunainen Pimeä Manuskripti" },
  { id: "portinvartija", occupation: "Portinvartija", benefit: "1 Satunainen Esine" }, { id: "metallityolainen", occupation: "Metallityöläinen", benefit: "1 Satunainen Ase" },
  { id: "dilleri", occupation: "Dilleri", benefit: "Oopium" }, { id: "kaksoisvuoro", occupation: "Kaksoisvuoro", benefit: "Pyöritä kahdesti, ota molemmat." }
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
  { virtue: "Valkosipulifarmari", description: "Haisee niin pahalta että vampyrit saavat -3 hyökkäyksiinsä häneen." },
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

// Data for Quick Generator Tool
const quickGeneratorData = {
  "Tavern Name": [
    "The Prancing Pony", "The Green Dragon", "The Leaky Cauldron", "The Eager Beaver", "The Drunken Huntsman", 
    "The Queen's Head", "The King's Head", "The Ragged Flagon", "The Bannered Mare", "The Winking Skeever"
  ],
  "Rumor": [
    "I heard old man Hemlock is a werewolf.",
    "The guards are taking bribes down at the docks.",
    "Someone saw a ghost ship in the fog last night.",
    "The harvest is failing... people say it's a curse.",
    "A nobleman's daughter ran off with a vampire!"
  ],
  "Loot (Common)": [
    "1d6 Shillings", "Tattered Rope (10m)", "Half-empty Viski Flask", "Flint & Steel", "Stale Bread", "A single boot", "Kynttilä", "Rätit"
  ],
  "Loot (Rare)": [
    "Ihmeparannusaine", "Hopeoidut ammukset", "Flintlock Pistooli", "Map to a hidden cache", "Noble's Signet Ring", "Tohtorin laukku"
  ]
};

// *** NEW SHOP ITEMS FROM PDF ***
const shopItems = [
    // TAVARAT (SOURCE 1)
    { id: "ratit", name: "Rätit", type: "Tavara", price: "1 Shillinki", description: "Parantaa verenvuodon." },
    { id: "kynttila", name: "Kynttilä", type: "Tavara", price: "1 Shillinki", description: "Lyhytaikainen valonlähde." },
    { id: "viski", name: "Viski", type: "Tavara", price: "2 Shillinkiä", description: "Juotuasi läpäiset hetken kaikki moraalitesti." },
    { id: "valkosipuli", name: "Valkosipuli", type: "Tavara", price: "2 Shillinkiä", description: "Pelottaa vampyyreja." },
    { id: "vaarnavyo", name: "Vaarnavyö", type: "Tavara", price: "5 Shillinkiä", description: "Vie 1 tavaratilan, mutta voi sisältää max. 5 vaarnaa." },
    { id: "oopium", name: "Oopium", type: "Tavara", price: "5 Shillinkiä", description: "Parantaa heti 2HP. Moraalitestejä ei tarvitse tehdä hetkeen." },
    { id: "reppu", name: "Reppu", type: "Tavara", price: "5 Shillinkiä", description: "Vie yhden tavaratilan, mutta sisään mahtuu 3 tavaraa." },
    { id: "oljylamppu", name: "Öljylamppu", type: "Tavara", price: "6 Shillinkiä", description: "[D6] [STR] Lamppu tuhoutuu, jos lyö! Pitkäaikainen valonlähde!" },
    { id: "tohtorin-laukku", name: "Tohtorin laukku", type: "Tavara", price: "7 Shillinkiä", description: "Kaatuneelle tai kenelle vain voi parantaa D4 HP. Parantaa myös myrkyt." },
    { id: "suolapussi", name: "Suolapussi", type: "Tavara", price: "7 Shillinkiä", description: "Luo pyhän suolaringin johon kuolemattomat eivät pääse... Ainakaan hetkeksi." },
    { id: "ihmeparannusaine", name: "Ihmeparannusaine", type: "Tavara", price: "7 Shillinkiä", description: "Parantaa myrkyt ja sairaudet. Infektioita tosin ei... kirottua..." },
    { id: "peruukki", name: "Peruukki", type: "Tavara", price: "10 Shillinkiä", description: "+1 PRC" },
    
    // PANSSARIT (SOURCE 4)
    { id: "kotikutoinen-panssari", name: "Kotikutoinen panssari", type: "Panssari", price: "Ilmainen", description: "Suoja: 1. Extra: -1 AGT" },
    { id: "nahkatakki", name: "Nahkatakki", type: "Panssari", price: "1 Shillinki", description: "Suoja: 1. Extra: Kovetettu nahkahattu! Ei kovia tainnuttavia osumia päähän!" },
    { id: "vahattu-takki", name: "Vahattu Takki", type: "Panssari", price: "3 Shillinkiä", description: "Suoja: 1. Extra: Sade ei vaikuta. Mukavasti ropisee." },
    { id: "kaulapanssari", name: "Kaulapanssari", type: "Panssari", price: "4 Shillinkiä", description: "Suoja: 0. Extra: Vampyyrin hyökkäys puolustetaan mutta menee heti rikki." },
    { id: "kovetettu-nahkahattu", name: "Kovetettu nahkahattu", type: "Panssari", price: "5 Shillinkiä", description: "Suoja: 0. Extra: Suojelee päätä osumilta." },
    { id: "rintapanssari", name: "Rintapanssari", type: "Panssari", price: "10 Shillinkiä", description: "Suoja: 2." },
    { id: "hopeaketju", name: "Hopeaketju", type: "Panssari", price: "12 Shillinkiä", description: "Suoja: 2. Extra: Kaikkiin ihmissusien tekemiin hyökkäyksiin -2." },
    { id: "haarniska", name: "Haarniska", type: "Panssari", price: "20 Shillinkiä", description: "Suoja: 3." },
    
    // YHDENKÄDEN LYÖMÄASEET (SOURCE 8)
    { id: "nyrkkisi", name: "Nyrkkisi", type: "Lyömäase (1H)", price: "Ilmainen", description: "Stat: STR. Damage: 1. Extra: Fumble 1 vahinko SINUUN!" },
    { id: "improvisoitu-lyontiase", name: "Improvisoitu lyöntiase", type: "Lyömäase (1H)", price: "Ilmainen", description: "Stat: STR. Damage: D4." },
    { id: "vaarna", name: "Vaarna", type: "Lyömäase (1H)", price: "1 Shillinki", description: "Stat: AGT. Damage: D4. Extra: Aina vähintään 1 vahinko!" },
    { id: "veitsi", name: "Veitsi", type: "Lyömäase (1H)", price: "1 Shillinki", description: "Stat: AGT. Damage: D4. Extra: Voi heittää." },
    { id: "kala", name: "Kala", type: "Lyömäase (1H)", price: "1 Shillinki", description: "Stat: STR. Damage: D4." },
    { id: "kalakoukku", name: "Kalakoukku", type: "Lyömäase (1H)", price: "2 Shillinkiä", description: "Stat: AGT. Damage: D4. Extra: Julma, aina vähintään 1 vahinko!" },
    { id: "hattuneula", name: "Hattuneula", type: "Lyömäase (1H)", price: "2 Shillinkiä", description: "Stat: AGT. Damage: 2 Vahinkoa. Extra: Lävistää kaikki panssarit!" },
    { id: "sateenvarjo", name: "Sateenvarjo", type: "Lyömäase (1H)", price: "2 Shillinkiä", description: "Stat: AGT. Damage: D4. Extra: Sateen vaikutus ei ole sinuun juuri mitään. Mukava ilmahan täällä on." },
    { id: "nyrkkiraudat", name: "Nyrkkiraudat", type: "Lyömäase (1H)", price: "3 Shillinkiä", description: "Stat: STR. Damage: D4. Extra: Et voi tiputtaa näitä!" },
    { id: "nuija", name: "Nuija", type: "Lyömäase (1H)", price: "3 Shillinkiä", description: "Stat: STR. Damage: D4. Extra: Kriittinen aiheuttaa pökertymisen!" },
    { id: "partaveitsi", name: "Partaveitsi", type: "Lyömäase (1H)", price: "3 Shillinkiä", description: "Stat: AGT. Damage: 2 Vahinkoa. Extra: Menee panssareista läpi. Kriittinen aiheuttaa vuolasta verenvuotoa." },
    { id: "tamppu", name: "Tamppu", type: "Lyömäase (1H)", price: "4 Shillinkiä", description: "Stat: STR. Damage: D6. Extra: Kriittinen aiheuttaa pyörtymän." },
    { id: "teurastajan-veitsi", name: "Teurastajan veitsi", type: "Lyömäase (1H)", price: "4 Shillinkiä", description: "Stat: STR. Damage: D6. Extra: Julma, vähintään 1 vahinko AINA." },
    { id: "lapio", name: "Lapio", type: "Lyömäase (1H)", price: "5 Shillinkiä", description: "Stat: STR. Damage: D6. Extra: Lapio. Voit... kaivaa? Sitä tuskin tultiin tekemään." },
    { id: "puukirves", name: "Puukirves", type: "Lyömäase (1H)", price: "5 Shillinkiä", description: "Stat: STR. Damage: D8. Extra: Heitettynä kätevä!" },
    { id: "miekkailumiekka", name: "Miekkailumiekka", type: "Lyömäase (1H)", price: "8 Shillinkiä", description: "Stat: AGT. Damage: D6. Extra: Julma, aina vähintään 1 vahinko. Kriittinen aiheuttaa verenvuodon." },
    { id: "kavelykeppimiekka", name: "Kävelykeppimiekka", type: "Lyömäase (1H)", price: "10 Shillinkiä", description: "Stat: AGT. Damage: D8." },

    // KAHDENKÄDEN LYÖMÄASEET (SOURCE 11)
    { id: "improvisoitu-ase-2h", name: "Improvisoitu ase (2H)", type: "Lyömäase (2H)", price: "Ilmainen", description: "Stat: STR. Damage: D6. Extra: Vie yhden vuoron laittaa pois ja ottaa esiin. Niin pitkä, että vihollinen ei voi samalla vuorolla vielä lyödä takaisin!" },
    { id: "kalastuskeihas", name: "Kalastuskeihäs", type: "Lyömäase (2H)", price: "3 Shillinkiä", description: "Stat: AGT. Damage: D8. Extra: Niin pitkä, että vihollinen ei voi samalla vuorolla vielä lyödä takaisin!" },
    { id: "kivivasara", name: "Kivivasara", type: "Lyömäase (2H)", price: "10 Shillinkiä", description: "Stat: STR. Damage: D10. Extra: Painava. Vie kaksi tavarapaikkaa. Vie yhden vuoron laittaa pois ja ottaa esiin." },

    // ASEIDEN HOPEOINTI (SOURCE 13-18)
    { id: "aseen-hopeointi", name: "Aseen Hopeointi", type: "Palvelu", price: "10 Shillinkiä", description: "Lisää 10 aseen hintaan TAI maksa 10 jo omistuksessa olevan aseesi hopeoinnista. Polttaa petojen epäpyhää lihaa." },

    // YHDENKÄDEN AMMUNTA (SOURCE 20)
    { id: "flintlock-pistooli", name: "Flintlock Pistooli", type: "Ammunta-ase (1H)", price: "10 Shillinkiä", description: "Stat: PRC. Damage: D6. Extra: Yhden kuulan muskettipistooli. Samoin epävakaa." },
    { id: "lancaster-pistooli", name: "Lancaster Pistooli", type: "Ammunta-ase (1H)", price: "12 Shillinkiä", description: "Stat: PRC. Damage: D4. Extra: Neljä piippua. Neljä panosta. Voi tosin räjähtää päin näköäsi!" },
    { id: "ultimate-tool", name: "Ultimate Tool", type: "Ammunta-ase (1H)", price: "15 Shillinkiä", description: "Stat: AGT. Damage: Etä D4, Lähi D4. Extra: Itsekehitelty aseen ja veitsen yhdistelmä." },
    { id: "revolveri", name: "Revolveri", type: "Ammunta-ase (1H)", price: "20 Shillinkiä", description: "Stat: PRC. Damage: D8. Extra: 6 panosta. Tehokas kuin synti." },

    // "YHDENKÄDEN" (KAHDENKÄDEN) AMMUNTA (SOURCE 22)
    { id: "dreyssilainen-kivaari", name: "Dreyssiläinen Kivääri", type: "Ammunta-ase (2H)", price: "15 Shillinkiä", description: "Stat: PRC. Damage: D8. Extra: Vanha kivääri etelänaapurista. Yksi luoti mahtuu piippuun. Epävakaa." },
    { id: "haulikko", name: "Haulikko", type: "Ammunta-ase (2H)", price: "12 Shillinkiä", description: "Stat: PRC. Damage: D10. Extra: Kaksi luotia mahtuu piippuun. Valitettavan epävakaa." },
    { id: "vipulukkokuvaari", name: "Vipulukkokivääri", type: "Ammunta-ase (2H)", price: "15 Shillinkiä", description: "Stat: PRC. Damage: D8. Extra: Huomattava teknologinen uutuus. Vipulukkotekniikka. 5 luotia mahtuu piippuun. Saattaa jumittua. Harvoin." },
    
    // LUODIT (SOURCE 24)
    { id: "pistoolin-ammukset", name: "Pistoolin ammukset", type: "Ammus", price: "1 Shillinki", description: "5 ammusta per laatikko." },
    { id: "haulikon-haulit", name: "Haulikon haulit", type: "Ammus", price: "1 Shillinki", description: "4 ammusta per laatikko." },
    { id: "revolverin-ammukset", name: "Revolverin ammukset", type: "Ammus", price: "2 Shillinkiä", description: "6 ammusta per laatikko." },
    { id: "kivaarin-ammukset", name: "Kiväärin ammukset", type: "Ammus", price: "4 Shillinkiä", description: "5 ammusta per laatikko." },
    { id: "hopeoidut-ammukset", name: "Hopeoidut ammukset", type: "Ammus", price: "10 Shillinkiä!", description: "5 ammusta per laatikko. Mihin vain aseeseen!" },

    // HEITETTÄVÄÄ (SOURCE 26)
    { id: "molotov", name: "Molotov", type: "Heitettävä", price: "3 shillinkiä!", description: "Stat: AGT. Damage: D8. Extra: Helppo heittää. Lasketaan myös viskiksi." },
    { id: "improvisoitu-rahahde", name: "Improvisoitu rähähde", type: "Heitettävä", price: "3 shillinkiä", description: "Stat: STR. Damage: D8. Extra: Vaivalloinen heittää. Vaarallinen. Halpa." },
    { id: "tnt", name: "TNT", type: "Heitettävä", price: "8 shillinkiä", description: "Stat: AGT. Damage: D10. Extra: VARO." },

    // LISÄTTY (KOSKA AMMATTI VIITTAA SIIHEN)
    { id: "tiirikka", name: "Tiirikka", type: "Tavara", price: "10 Shillinkiä", description: "Työkaluja lukkojen tiirikointiin." }
];