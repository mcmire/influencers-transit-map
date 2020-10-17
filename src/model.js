const companies = [
  /*
  {
    id: "madtv",
    name: "*madTV*",
  },
  {
    id: "scrubs",
    name: "*Scrubs*",
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
    id: "janeane-garofalo",
    name: "Janeane Garofalo",
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

const model = `
Wikipedia/Ambiguously Gay Duo is a source with URL "https://en.wikipedia.org/wiki/The_Ambiguously_Gay_Duo".
Wikipedia/Colbert is a source with URL "https://en.wikipedia.org/wiki/Stephen_Colbert".
Wikipedia/Conan is a source with URL "https://en.wikipedia.org/wiki/Conan_O%27Brien".
Wikipedia/David Cross is a source with URL "https://en.wikipedia.org/wiki/David_Cross".
Wikipedia/Greg Daniels is a source with URL "https://en.wikipedia.org/wiki/Greg_Daniels".
Wikipedia/Louis C.K. is a source with URL "https://en.wikipedia.org/wiki/Louis_C.K.".
Wikipedia/Odenkirk is a source with URL "https://en.wikipedia.org/wiki/Bob_Odenkirk".
Wikipedia/Pamela Adlon is a source with URL "https://en.wikipedia.org/wiki/Pamela_Adlon".
Wikipedia/Parks and Rec is a source with URL "https://en.wikipedia.org/wiki/Parks_and_Recreation".
Wikipedia/Smigel is a source with URL "https://en.wikipedia.org/wiki/Robert_Smigel".
Wikipedia/The Office is a source with URL "https://en.wikipedia.org/wiki/The_Office_(American_TV_series)".

Arrested Development is a show.
Better Call Saul is a show.
Boston comedy scene is a scene.
Breaking Bad is a show.
Catch a Rising Star is a club.
Conan is a show.
Exit 57 is a show.
Get a Life is a show.
Happy Happy Good Show is a show.
Late Night with Conan O'Brien is a show.
Louie is a show.
Lucky Louie is a show.
Mr. Show is a show.
Not Necessarily the News is a show.
Parks and Recreation is a show. "Parks and Rec" is short for Parks and Recreation.
Pootie Tang is a movie.
Saturday Night Live is a show. "SNL" is short for Saturday Night Live.
Second City Chicago is an organization.
Strangers with Candy is a show.
The Ambiguously Gay Duo is a show.
The Ben Stiller Show is a show.
The Chris Rock Show is a show.
The Colbert Report is a show.
The Daily Show is a show.
The Dana Carvey Show is a show.
The Dennis Miller Show is a show.
The Harvard Lampoon is an organization. When displaying The Harvard Lampoon, use "*Harvard Lampoon*".
The King of the Hill is a show.
The Late Show with Stephen Colbert is a show.
The Office is a show.
The Simpsons is a show.
The Tonight Show with Conan O'Brien is a show.
The Wilton North Report is a show.
Tim and Eric Awesome Show, Great Job! is a show.
Tom Goes to the Mayor is a show.
Un-Cabaret is a club.
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
Greg Daniels was the co-creator, writer and producer for King of the Hill between 1997 and 2001 (source: Wikipedia/Greg Daniels).
Greg Daniels was the developer and showrunner of The Office between 2005 and 2009 (source: Wikipedia/The Office).
Greg Daniels was the co-creator and showrunner of Parks and Rec between 2009 and 2013 (sources: Wikipedia/Parks and Rec, Wikipedia/The Office).
Greg Daniels was the showrunner of The Office in 2013 (sources: Wikipedia/Greg Daniels, Wikipedia/The Office).

Stephen Colbert is a person. "Colbert" is short for Stephen Colbert.
Colbert was a performer at Second City Chicago from 1986 to 1995 (source: Wikipedia/Colbert).
Colbert was a writer on Exit 57 between 1995 and 1996 (source: Wikipedia/Colbert).
Colbert was a performer and writer for the Dana Carvey Show in 1996 (source: Wikipedia/Colbert).
Colbert was a writer for SNL in 1996 (source: Wikipedia/Colbert).
Colbert was a writer and actor for the Ambiguously Gay Duo between 1996 and 2011 (source: Wikipedia/Ambiguously Gay Duo).
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
Odenkirk was the co-creator of and a writer and performer for Mr. Show from 1995 to 1998 (source: Wikipedia/Odenkirk).
Odenkirk was a executive producer and guest actor for Tom Goes to the Mayor between 2004 and 2006 (source: Wikipedia/Odenkirk).
Odenkirk was a guest actor for Tim and Eric Awesome Show, Great Job! between 2007 and 2010 (source: Wikipedia/Odenkirk).
Odenkirk was an actor in Breaking Bad between 2009 and 2013 (source: Wikipedia/Odenkirk).
Odenkirk was an executive producer, writer, and actor for W/ Bob and David in 2015 (source: Wikipedia/Odenkirk).
Odenkirk has been an actor in Better Call Saul since 2015 (source: Wikipedia/Odenkirk).

Robert Smigel is a person. "Smigel" is short for Robert Smigel.
Smigel was a student and performer for Second City Chicago from 1983 to 1985 (source: Wikipedia/Smigel).
Smigel was a writer on SNL from 1985 to 1993 (source: Wikipedia/Smigel).
Smigel was a writer for Happy Happy Good Show in 1988 (source: Wikipedia/Smigel).
Smigel was head writer for Late Night with Conan O'Brien from 1992 to 1996 (source: Wikipedia/Smigel).
Smigel was a writer and performer for the Dana Carvey Show in 1996 (source: Wikipedia/Smigel).
Smigel was a writer and actor for the Ambiguously Gay Duo between 1996 and 2011 (source: Wikipedia/Smigel).

David Cross is a person.
David Cross was a comic at Catch a Rising Star between 1990 and 1993 (source: Wikipedia/David Cross).
David Cross was a comic at Un-Cabaret in 1993 (source: Wikipedia/David Cross).
David Cross was a writer and performer for the Ben Stiller Show in 1993 (source: Wikipedia/David Cross).
David Cross was the co-creator of and a writer and performer for Mr. Show from 1995 to 1998 (source: Wikipedia/Odenkirk).
David Cross was an actor on Arrested Development between 2003 and 2006 (source: Wikipedia/David Cross).
David Cross was an executive producer, writer, and actor for W/ Bob and David in 2015 (source: Wikipedia/David Cross).

Louis C.K. is a person.
Louis C.K. was a comic within the Boston comedy scene from 1987 to 1989 (source: Wikipedia/Louis C.K.).
Louis C.K. was a writer for Late Night with Conan O'Brien from 1993 to 1994 (source: Wikipedia/Louis C.K.).
Louis C.K. was head writer for the Dana Carvey Show in 1996 (source: Wikipedia/Louis C.K.).
Louis C.K. was writer for the Chris Rock Show from 1997 to 1999 (source: Wikipedia/Louis C.K.).
Louis C.K. was writer and director of Pootie Tang in 2001 (source: Wikipedia/Louis C.K.).
Louis C.K. was the creator of and writer and actor for Lucky Louie in 2006 (source: Wikipedia/Louis C.K.).
Louis C.K. was the creator of and writer and actor for Louie between 2009 and 2015 (source: Wikipedia/Louis C.K.).

Pamela Adlon is a person.
Pamela Adlon was a voice actor on King of the Hill between 1997 and 2010 (source: Wikipedia/Pamela Adlon).
Pamela Adlon was an actor for Lucky Louie in 2006 (source: Wikipedia/Pamela Adlon).
Pamela Adlon was an actor and producer for Louie between 2010 and 2015 (source: Wikipedia/Pamela Adlon).
`;

export default model;
