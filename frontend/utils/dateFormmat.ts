const convertEpochStringToLocale = (epoch: string): string => {
  const parsedEpoch = Number.parseInt(epoch);
  if (isNaN(parsedEpoch)) {
    return "";
  }
  const date = new Date(parsedEpoch);
  return `${date.toLocaleDateString(
    "ko-KR"
  )} ${date.getHours()}:${date.getMinutes()}`;
};

export { convertEpochStringToLocale };
