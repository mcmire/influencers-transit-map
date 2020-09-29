import React from "react";

const companies = [
  {
    id: "harvard-lampoon",
    name() {
      return <em>Harvard Lampoon</em>;
    },
  },
  {
    id: "the-wilton-north-report",
    name() {
      return <em>The Wilton North Report</em>;
    },
  },
  {
    id: "not-necessarily-the-news",
    name() {
      return <em>Not Necessarily the News</em>;
    },
  },
  {
    id: "second-city-chicago",
    name() {
      return "Second City Chicago";
    },
  },
  {
    id: "happy-happy-good-show",
    name() {
      return <em>Happy Happy Good Show</em>;
    },
  },
  {
    id: "snl",
    name() {
      return <em>Saturday Night Live</em>;
    },
  },
  {
    id: "simpsons",
    name() {
      return <em>The Simpsons</em>;
    },
  },
  {
    id: "catch-a-rising-star",
    name() {
      return "Catch a Rising Star comedy scene";
    },
  },
  {
    id: "the-ben-stiller-show",
    name() {
      return <em>The Ben Stiller Show</em>;
    },
  },
  {
    id: "late-night-with-conan-o-brien",
    name() {
      return <em>Late Night with Conan O'Brien</em>;
    },
  },
  {
    id: "mr-show",
    name() {
      return <em>Mr. Show</em>;
    },
  },
  {
    id: "the-dana-carvey-show",
    name() {
      return <em>The Dana Carvey Show</em>;
    },
  },
  {
    id: "the-daily-show",
    name() {
      return <em>The Daily Show</em>;
    },
  },
  {
    id: "madtv",
    name() {
      return <em>madTV</em>;
    },
  },
  {
    id: "scrubs",
    name() {
      return <em>Scrubs</em>;
    },
  },
  {
    id: "arrested-development",
    name() {
      return <em>Arrested Development</em>;
    },
  },
  {
    id: "The Larry Sanders Show",
    name() {
      return <em>The Larry Sanders Show</em>;
    },
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
    player: "conan",
    roles: ["writer", "president"],
    dateRange: { start: "1981", end: "1985" },
  },
  {
    company: "harvard-lampoon",
    player: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1981", end: "1985" },
  },
  {
    company: "not-necessarily-the-news",
    player: "conan",
    roles: ["writer"],
    dateRange: { start: "1985", end: "1987" },
  },
  {
    company: "not-necessarily-the-news",
    player: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1985", end: "1987" },
  },
  {
    company: "the-wilton-north-report",
    player: "conan",
    roles: ["writer"],
    dateRange: { start: "1987", end: "1987" },
  },
  {
    company: "the-wilton-north-report",
    player: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1987", end: "1987" },
  },
  {
    company: "snl",
    player: "conan",
    roles: ["writer"],
    dateRange: { start: "1988-01", end: "1991" },
  },
  {
    company: "snl",
    player: "greg-daniels",
    roles: ["writer"],
    dateRange: { start: "1988-01", end: "1990" },
  },
  {
    company: "simpsons",
    player: "conan",
    roles: ["writer", "producer"],
    dateRange: { start: "1991", end: "1993" },
  },
  {
    company: "simpsons",
    player: "greg-daniels",
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
