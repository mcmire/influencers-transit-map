const NATURAL_MONTH_PARSERS = [
  [/^Jan(?:uary)?$/, () => 0],
  [/^Feb(?:ruary)$/, () => 1],
  [/^Mar(?:ch)?$/, () => 2],
  [/^Apr(?:il)?$/, () => 3],
  [/^May$/, () => 4],
  [/^June?$/, () => 5],
  [/^July?$/, () => 6],
  [/^Aug(?:ust)?$/, () => 7],
  [/^Sep(?:t?ember)?$/, () => 8],
  [/^Oct(?:ober)?$/, () => 9],
  [/^Nov(?:ember)?$/, () => 10],
  [/^Dec(?:ember)?$/, () => 11],
];

const naturalMonthPattern =
  "(" +
  NATURAL_MONTH_PARSERS.map(([regex, _]) => regex.source.slice(1, -1)).join(
    "|"
  ) +
  ")\\.?";

function findParserFor(string, parsers) {
  for (const [regex, parser] of parsers) {
    const match = string.match(regex);

    if (match != null) {
      return { parser, match };
    }
  }

  return null;
}

function parseNaturalMonth(string) {
  const result = findParserFor(string, NATURAL_MONTH_PARSERS);

  if (result != null) {
    return result.parser(result.match);
  } else {
    return null;
  }
}

function parseDateStringAsISO8601Like(match) {
  if (match[3] != null) {
    return new Date(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1,
      parseInt(match[3], 10)
    );
  } else if (match[2] != null) {
    return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, 1);
  } else {
    return new Date(parseInt(match[1], 10), 0, 1);
  }
}

function parseDateStringAsMonthYear(match) {
  return new Date(parseInt(match[2], 10), parseInt(match[1], 10) + 1, 1);
}

function parseDateStringAsMonthDayYear(match) {
  return new Date(
    parseInt(match[3], 10),
    parseInt(match[1], 10) + 1,
    parseInt(match[2], 10)
  );
}

function parseDateStringAsNaturalMonthYear(match) {
  const month = parseNaturalMonth(match[1]);

  if (month != null) {
    return new Date(parseInt(match[2], 10), month, 1);
  } else {
    return null;
  }
}

function parseDateStringAsNaturalMonthDayYear(match) {
  const month = parseNaturalMonth(match[1]);

  if (month != null) {
    return new Date(parseInt(match[3], 10), month, parseInt(match[2], 10));
  } else {
    return null;
  }
}

const DATE_STRING_PARSERS = [
  [/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/, parseDateStringAsISO8601Like],
  [/^(\d{1,2})\/(\d{4})$/, parseDateStringAsMonthYear],
  [/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parseDateStringAsMonthDayYear],
  [
    new RegExp(`^${naturalMonthPattern} (\\d{4})$`),
    parseDateStringAsNaturalMonthYear,
  ],
  [
    new RegExp(`^${naturalMonthPattern} (\\d{1,2}),? (\\d{4})$`),
    parseDateStringAsNaturalMonthDayYear,
  ],
];

export default function parseDateString(value) {
  if (value instanceof Date) {
    return value;
  } else {
    const result = findParserFor(value, DATE_STRING_PARSERS);

    if (result != null) {
      const parsedDate = result.parser(result.match);

      if (parsedDate != null) {
        return parsedDate;
      } else {
        throw new Error(`Could not parse "${value}" as a date!`);
      }
    } else {
      throw new Error(`Could not parse "${value}" as a date!`);
    }
  }
}
