/*
  USER_PROPS_SAFELIST is to contain any string deemed safe for user props.
  The startsWidth array will contain the start of any accepted user-prop that 
  starts with these characters.
  The exactMatch will contain a list of exact prop names that are accepted.
*/
const USER_PROPS_SAFELIST = {
  startsWith: ["data-", "aria-"],
  exactMatch: []
};

/**
 * doesPropStartWith: Function that takes a prop's key and runs it against all
 * options in the USER_PROPS_SAFELIST and checks to see if it starts with any
 * of those options.
 * @param {string} key: prop key to be tested against whitelist
 * @returns {Boolean}: returns true if the key starts with an option or false if
 * otherwise
 */
const doesPropStartWith = (key) => {
  let startsWith = false;

  USER_PROPS_SAFELIST.startsWith.forEach((starterString) => {
    const regex = new RegExp(`\\b(${starterString})(\\w|-)+`, "g");
    if (regex.test(key)) startsWith = true;
  });

  return startsWith;
};

/**
 * isExactMatch: checks to see if the given key matches any of the 'exactMatch'
 * items in the whitelist
 * @param {String} key: prop key to be tested against the whitelist-exact match
 * array.
 * @returns {Boolean}: return true if whitelist contains that key, otherwise
 * returns false.
 */
const isExactMatch = (key) => USER_PROPS_SAFELIST.exactMatch.includes(key);

/**
 * testIfSafeProp: tests prop's key against both startsWith and exactMatch values
 * @param {String} key: prop key to be tested against the whitelist
 * @returns {Boolean}: returns true if found in whitelist, otherwise returns false
 */
const testIfSafeProp = (key) => {
  if (doesPropStartWith(key) || isExactMatch(key)) return true;
  return false;
};

/**
 * getSafeUserProps - function that takes in a props object and removes any
 * key-value entries that do not match filter strings in the USER_PROPS_SAFELIST
 * object.
 *
 * @param {Object} props: props to be filtered against USER_PROPS_SAFELIST
 * @returns {Object}: object containing remaining acceptable props
 */
export const getSafeUserProps = (props) => {
  const propsToFilter = { ...props };
  return Object.fromEntries(
    Object.entries(propsToFilter).filter(([key]) => testIfSafeProp(key))
  );
};
