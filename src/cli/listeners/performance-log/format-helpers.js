const chalk = require("chalk");

const MS_PER_SECOND = 1000;
const MS_PER_MICRO_SECOND = 0.001;
const MAX_LENGTH_EXPECTED = 12;
const NUMBER_OF_COLUMNS = 8;
const K = 1024;
/*
 * using `undefined` as the first parameter to Intl.NumberFormat so
 * it will fall back to the 'current' locale. Another way to
 * accomplish this is to use a non-existent language (e.g. `zz`) also works,
 * but this seems to be the lesser of the two evil as `undefined` is closer
 * to the intent of just skipping the optional parameter.
 */
// eslint-disable-next-line no-undefined
const LOCALE = undefined;

const gTimeFormat = new Intl.NumberFormat(LOCALE, {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;
const gSizeFormat = new Intl.NumberFormat(LOCALE, {
  signDisplay: "exceptZero",
  style: "unit",
  unit: "kilobyte",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;

const pad = (pString) => pString.padStart(MAX_LENGTH_EXPECTED);

function formatHeader() {
  return chalk
    .bold(
      `${pad("elapsed real")} ${pad("user")} ${pad("system")} ${pad(
        "∆ rss"
      )} ${pad("∆ heapTotal")} ${pad("∆ heapUsed")} ${pad(
        "∆ external"
      )} after step...\n`
    )
    .concat(
      `${`${"-".repeat(MAX_LENGTH_EXPECTED)} `.repeat(NUMBER_OF_COLUMNS)}\n`
    );
}

function formatTime(pNumber, pConversionMultiplier = MS_PER_SECOND) {
  return gTimeFormat(pConversionMultiplier * pNumber).padStart(
    MAX_LENGTH_EXPECTED
  );
}

function formatMemory(pBytes) {
  const lReturnValue = gSizeFormat(pBytes / K).padStart(MAX_LENGTH_EXPECTED);

  return pBytes < 0 ? chalk.blue(lReturnValue) : lReturnValue;
}

function formatPerfLine({
  elapsedTime,
  elapsedUser,
  elapsedSystem,
  deltaRss,
  deltaHeapUsed,
  deltaHeapTotal,
  deltaExternal,
  message,
}) {
  return `${formatTime(elapsedTime)} ${formatTime(
    elapsedUser,
    MS_PER_MICRO_SECOND
  )} ${formatTime(elapsedSystem, MS_PER_MICRO_SECOND)} ${formatMemory(
    deltaRss
  )} ${formatMemory(deltaHeapTotal)} ${formatMemory(
    deltaHeapUsed
  )} ${formatMemory(deltaExternal)} ${message}\n`;
}

module.exports = {
  formatTime,
  formatMemory,
  formatPerfLine,
  formatHeader,
};
