function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export function renderRole(role) {
  let roleType = role.split('_');
  return roleType[1];
}
export function renderRaceAndEthnicity(raceAndEthnicity) {
  let selectedRaceAndEthnicity = [];
  if (!raceAndEthnicity) {
    return '';
  } else {
    //Check if race is saved as a string or object(Existing users -> string, New Users -> Object)
    if (IsJsonString(raceAndEthnicity)) {
      let raceEthnicity = Object.entries(
        JSON.parse(raceAndEthnicity).ethnicGroup
      );
      for (let i = 0; i < raceEthnicity.length; i++) {
        //Check if ethnicity is a simple boolean { "English": false }
        if (typeof raceEthnicity[i][1] === 'boolean' && raceEthnicity[i][1]) {
          selectedRaceAndEthnicity.push(raceEthnicity[i][0]);
        } else if (typeof raceEthnicity[i][1] === 'object') {
          //Check if ethnicity has a sub-category "White": {
          //  "English": false}
          let subRaceAndEthnicity = Object.entries(raceEthnicity[i][1]);
          for (let j = 0; j < subRaceAndEthnicity.length; j++) {
            if (subRaceAndEthnicity[j][1]) {
              selectedRaceAndEthnicity.push(subRaceAndEthnicity[j][0]);
            }
          }
        }
      }
      return selectedRaceAndEthnicity.join(',');
    } else {
      return raceAndEthnicity;
    }
  }
}

export function renderDate(dt) {
  let formattedDate =
    new Date(dt).getMonth() +
    1 +
    '/' +
    new Date(dt).getDate() +
    '/' +
    new Date(dt).getFullYear();
  return formattedDate;
}
