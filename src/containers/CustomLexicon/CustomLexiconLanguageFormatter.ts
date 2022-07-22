const capitalizeFirstLetter = (value) => {
  if (!value) return null;
  return value.charAt(0).toUpperCase().concat(value.slice(1));
}

const capitalizeFirstLetterOnly = (value) => {
  if (!value) return null;
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
}

const splitCamelCase = (value) => {
  if (!value) return null;
  return value.replace(/([a-z])([A-Z])/g, '$1 $2');
};

const reverseString = str => {
    return str.split("").reverse().join("");
};

const reWord = str => {
    const reversedString = reverseString(str);
    const indexOfLastUnderscore = reversedString.indexOf("_") + 1;
    const subWord = reversedString.substring(indexOfLastUnderscore, str.length);
    return reverseString(subWord);
}

export { capitalizeFirstLetter, capitalizeFirstLetterOnly, splitCamelCase, reWord };