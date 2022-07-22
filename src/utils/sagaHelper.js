/**
 * Converts an object to comma-separated value `string`
 * @param {array} objects having the properties `label`, `value` and possibly `input` in the case of fields having `Others` option
 * @returns {string} string of comma-separated values
 */
export function labelObjectsToCsv(objects) {
  if (!Array.isArray(objects)) {
    if (objects.value === 'Others') {
      return `Others: ${objects.input.trim()}`;
    }
    return objects.value;
  }

  let otherObject = objects
    .filter(object => object.value === 'Others')
    .map(object => `Other: ${object.input.trim()}`);
  let objectArray = objects
    .filter(object => object.value !== 'Others')
    .map(object => object.value)
    .concat(otherObject);

  return objectArray.join(',');
}

/**
 * Recursive function that converts object and its child objects with properties `label` and `value` to just the value of `value`
 * Function also checks if any of the property contains `null` value and delete the property if true
 * Unfortunately, due to the design of the react-select which mandates the {label, value} structure, this ends up being rather convoluted
 * @param {object} object with `label` and `value` properties
 * @returns {object} object with just the value of the `value` property
 */
export function labelObjectsToValue(object) {
  if (!object) return object;
  let newObject = JSON.parse(JSON.stringify(object));

  for (let property in newObject) {
    // Deleting properties that are empty either because of erroneous input or user chose to clear those inputs
    // This ensures that those properties will not show up as [Object object] on the product screen
    if (
      newObject.hasOwnProperty(property) &&
      (!newObject[property] ||
        (logicalXor(
          newObject[property].hasOwnProperty('unit'), // this condition is to deal with input with type `TEXT_INPUT_SUFFIX`
          newObject[property].hasOwnProperty('value')
        ) &&
          !newObject[property].hasOwnProperty('label'))) // this additional condition ensures react-select fields are not deleted
    ) {
      delete newObject[property];
      continue;
    }

    if (newObject.hasOwnProperty(property) && newObject[property]) {
      if (
        newObject[property].hasOwnProperty('label') &&
        newObject[property].hasOwnProperty('value')
      ) {
        newObject[property] = newObject[property].value;
      } else if (typeof newObject[property] === 'object') {
        newObject[property] = labelObjectsToValue(newObject[property]);
      }
    }
  }

  return newObject;
}

/**
 * Comparator function for product attributes utilizing react-tags
 * @param a
 * @param b
 * @return {boolean}
 */
export function tagComparator(a, b) {
  return a.label === b.label && a.id === b.id;
}

/**
 * Logical exclusive-or operator
 * @param a
 * @param b
 * @returns {*|boolean}
 */
export function logicalXor(a, b) {
  return (a || b) && !(a && b);
}
