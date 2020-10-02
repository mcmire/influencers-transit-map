const companies = [
  /*
  {
    id: "harvard-lampoon",
    name: "*Harvard Lampoon*",
  },
  {
    id: "the-wilton-north-report",
    name: "*The Wilton North Report*",
  },
  {
    id: "not-necessarily-the-news",
    name: "*Not Necessarily the News*",
  },
  {
    id: "second-city-chicago",
    name: "Second City Chicago",
  },
  {
    id: "happy-happy-good-show",
    name: "*Happy Happy Good Show*",
  },
  {
    id: "snl",
    name: "*Saturday Night Live*",
  },
  {
    id: "simpsons",
    name: "*The Simpsons*",
  },
  {
    id: "catch-a-rising-star",
    name: "Catch a Rising Star comedy scene",
  },
  {
    id: "the-ben-stiller-show",
    name: "*The Ben Stiller Show*",
  },
  {
    id: "late-night-with-conan-o-brien",
    name: "*Late Night with Conan O'Brien*",
  },
  {
    id: "mr-show",
    name: "*Mr. Show*",
  },
  {
    id: "the-dana-carvey-show",
    name: "*The Dana Carvey Show*",
  },
  {
    id: "the-daily-show",
    name: "*The Daily Show*",
  },
  {
    id: "madtv",
    name: "*madTV*",
  },
  {
    id: "scrubs",
    name: "*Scrubs*",
  },
  {
    id: "arrested-development",
    name: "*Arrested Development*",
  },
  {
    id: "The Larry Sanders Show",
    name: "*The Larry Sanders Show*",
  },
  */
];

const people = [
  /*
  {
    id: "conan",
    name: "Conan O'Brien",
  },
  {
    id: "greg-daniels",
    name: "Greg Daniels",
  },
  {
    id: "colbert",
    name: "Stephen Colbert",
  },
  {
    id: "bob-odenkirk",
    name: "Bob Odenkirk",
  },
  {
    id: "smigel",
    name: "Robert Smigel",
  },
  {
    id: "david-cross",
    name: "David Cross",
  },
  {
    id: "janeane-garofalo",
    name: "Janeane Garofalo",
  },
  {
    id: "louis-ck",
    name: "Louis C.K.",
  },
  {
    id: "judd-apatow",
    name: "Judd Apatow",
  },
  {
    id: "brian-posehn",
    name: "Brian Posehn",
  },
  {
    id: "steve-carell",
    name: "Steve Carell",
  },
  {
    id: "jon-stewart",
    name: "Jon Stewart",
  },
  {
    id: "john-oliver",
    name: "John Oliver",
  },
  {
    id: "keegan-michael-key",
    name: "Keegan-Michael Key",
  },
  {
    id: "jordan-peele",
    name: "Jordan Peele",
  },
  {
    id: "michael-mcdonald",
    name: "Michael McDonald",
  },
  {
    id: "nicole-sullivan",
    name: "Nicole Sullivan",
  },
  {
    id: "bill-lawrence",
    name: "Bill Lawrenc",
  },
  {
    id: "will-arnett",
    name: "Will Arnett",
  },
  {
    id: "jason-bateman",
    name: "Jason Bateman",
  },
  {
    id: "jeffrey-tambor",
    name: "Jeffrey Tambor",
  },
  {
    id: "garry-shandling",
    name: "Garry Shandling",
  },
  {
    id: "mary-lynn-rajskub",
    name: "Mary Lynn Rajskub",
  },
  */
];

const relationships = [
  /*
  {
    company: "harvard-lampoon",
    person: "conan",
    roles: ["writer", "president"],
    dateRange: { start: "1981", end: "1985" },
  },
  {
    company: "harvard-lampoon",
    person: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1981", end: "1985" },
  },
  {
    company: "not-necessarily-the-news",
    person: "conan",
    roles: ["writer"],
    dateRange: { start: "1985", end: "1987" },
  },
  {
    company: "not-necessarily-the-news",
    person: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1985", end: "1987" },
  },
  {
    company: "the-wilton-north-report",
    person: "conan",
    roles: ["writer"],
    dateRange: { start: "1987", end: "1987" },
  },
  {
    company: "the-wilton-north-report",
    person: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1987", end: "1987" },
  },
  {
    company: "snl",
    person: "conan",
    roles: ["writer"],
    dateRange: { start: "1988-01", end: "1991" },
  },
  {
    company: "snl",
    person: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1988-01", end: "1990" },
  },
  {
    company: "simpsons",
    person: "conan",
    roles: ["writer", "producer"],
    dateRange: { start: "1991", end: "1993" },
  },
  {
    company: "simpsons",
    person: "greg-daniels",
    roles: ["writer", "producer"],
    dateRange: { start: "1993", end: "1997" },
  },
  */
];

const model = `
Wikipedia/Conan is a source with URL "https://en.wikipedia.org/wiki/Conan_O%27Brien".
Wikipedia/Greg Daniels is a source with URL "https://en.wikipedia.org/wiki/Greg_Daniels".
Wikipedia/The Office is a source with URL "https://en.wikipedia.org/wiki/The_Office_(American_TV_series)".
Wikipedia/Parks and Rec is a source with URL "https://en.wikipedia.org/wiki/Parks_and_Recreation".
Wikipedia/Colbert is a source with URL "https://en.wikipedia.org/wiki/Stephen_Colbert".
Wikipedia/Odenkirk is a source with URL "https://en.wikipedia.org/wiki/Bob_Odenkirk".

# TODO: Reordering this list changes the graph?
The Harvard Lampoon is an organization. When displaying The Harvard Lampoon, use "*Harvard Lampoon*".
Not Necessarily the News is a show.
The Wilton North Report is a show.
Saturday Night Live is a show. "SNL" is short for Saturday Night Live.
The Simpsons is a show.
The King of the Hill is a show.
Late Night with Conan O'Brien is a show.
The Tonight Show with Conan O'Brien is a show.
Conan is a show.
The Office is a show.
Parks and Recreation is a show. "Parks and Rec" is short for Parks and Recreation.
Second City Chicago is an organization.
Exit 57 is a show.
The Dana Carvey Show is a show.
Strangers with Candy is a show.
The Daily Show is a show.
The Colbert Report is a show.
The Late Show with Stephen Colbert is a show.
Happy Happy Good Show is a show.
Get a Life is a show.
The Dennis Miller Show is a show.
The Ben Stiller Show is a show.
Mr Show is a show.
Breaking Bad is a show.
Better Call Saul is a show.
Tom Goes to the Mayor is a show.
Tim and Eric Awesome Show, Great Job! is a show.
W/ Bob and David is a show.

Conan O'Brien is a person. "Conan" is short for Conan O'Brien.
Conan was a writer for and president of the Harvard Lampoon between 1981 and 1985 (source: Wikipedia/Conan).
Conan was a writer for Not Necessarily the News between 1985 and 1987 (source: Wikipedia/Conan).
Conan was a writer for the Wilton North Report in 1987 (source: Wikipedia/Conan).
Conan was a writer for SNL between January 1988 and some time in 1991 (source: Wikipedia/Conan).
Conan was a writer and producer for the Simpsons between 1991 and 1993 (source: Wikipedia/Conan).
Conan was the host, creator, showrunner, and writer for Late Night with Conan O'Brien between 1993 and 2009 (source: Wikipedia/Conan).
Conan was the host, creator, showrunner, and writer for the Tonight Show with Conan O'Brien between 2009 and 2010 (source: Wikipedia/Conan).
Conan has been the host, creator, showrunner, and writer for Conan since 2010 (source: Wikipedia/Conan).

Greg Daniels is a person.
Greg Daniels was a writer for the Harvard Lampoon between 1981 and 1985 (source: Wikipedia/Greg Daniels).
Greg Daniels was a writer for Not Necessarily the News between 1985 and 1987 (source: Wikipedia/Greg Daniels).
Greg Daniels was a writer for the Wilton North Report in 1987 (source: Wikipedia/Greg Daniels).
Greg Daniels was a writer for SNL between January 1988 and some time in 1990 (source: Wikipedia/Greg Daniels).
Greg Daniels was a writer and producer for the Simpsons between 1993 and 1997 (source: Wikipedia/Greg Daniels).
Greg Daniels was the developer and showrunner of The Office between 2005 and 2009 (source: Wikipedia/The Office).
Greg Daniels was the co-creator and showrunner of Parks and Rec between 2009 and 2013 (sources: Wikipedia/Parks and Rec, Wikipedia/The Office).
Greg Daniels was the showrunner of The Office in 2013 (sources: Wikipedia/Greg Daniels, Wikipedia/The Office).

Stephen Colbert is a person. "Colbert" is short for Stephen Colbert.
Colbert was a performer at Second City Chicago from 1986 to 1995 (source: Wikipedia/Colbert).
Colbert was a writer on Exit 57 between 1995 and 1996 (source: Wikipedia/Colbert).
Colbert was a performer and writer for the Dana Carvey Show in 1996 (source: Wikipedia/Colbert).
Colbert was a writer for SNL in 1996 (source: Wikipedia/Colbert).
Colbert was a writer and performer for Strangers with Candy between 1999 and 2000 (source: Wikipedia/Colbert).
Colbert was a writer and performer for the Daily Show between 1997 and 2005 (source: Wikipedia/Colbert).
Colbert was the creator, host, and writer for the Colbert Report between 2005 and 2014 (source: Wikipedia/Colbert).
Colbert has been the creator, host, and writer for the Late Show with Stephen Colbert since 2015 (source: Wikipedia/Colbert).

Bob Odenkirk is a person. "Odenkirk" is short for Bob Odenkirk.
Odenkirk was a student and performer for Second City Chicago from 1984 to 1987 (source: Wikipedia/Odenkirk).
Odenkirk was a writer for SNL between 1987 and 1991 (source: Wikipedia/Odenkirk).
Odenkirk was a writer and performer for Happy Happy Good Show in 1988 (source: Wikipedia/Odenkirk).
Odenkirk was a writer for Get a Life in 1991 (source: Wikipedia/Odenkirk).
Odenkirk was a writer for the Dennis Miller Show in 1991 (source: Wikipedia/Odenkirk).
Odenkirk was a writer and performer for the Ben Stiller Show in 1992 (source: Wikipedia/Odenkirk).
Odenkirk was a writer for Late Night with Conan O'Brien from 1993 to 1994 (source: Wikipedia/Odenkirk).
# TODO: Odenkirk was the co-creator of and a writer and performer for Mr. Show from 1995 to 1998 (source: Wikipedia/Odenkirk).
Odenkirk was the co-creator of and a writer and performer for Mr Show from 1995 to 1998 (source: Wikipedia/Odenkirk).
Odenkirk was a executive producer and guest actor for Tom Goes to the Mayor between 2004 and 2006 (source: Wikipedia/Odenkirk).
Odenkirk was a guest actor for Tim and Eric Awesome Show, Great Job! between 2007 and 2010 (source: Wikipedia/Odenkirk).
# TODO: Odenkirk was an actor in Breaking Bad between 2009 and 2013 (source: Wikipedia/Odenkirk).
Odenkirk was an actor for Breaking Bad between 2009 and 2013 (source: Wikipedia/Odenkirk).
Odenkirk was an actor for W/ Bob and David in 2015 (source: Wikipedia/Odenkirk).
# TODO: Odenkirk has been an actor in Better Call Saul since 2015 (source: Wikipedia/Odenkirk).
Odenkirk has been an actor for Better Call Saul since 2015 (source: Wikipedia/Odenkirk).
`;

export default model;
