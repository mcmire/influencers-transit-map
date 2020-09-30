import React from "react";

const companies = [
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
];

const people = [
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
];

const relationships = [
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
];

const data = {
  companies,
  people,
  relationships,
};

export default data;
