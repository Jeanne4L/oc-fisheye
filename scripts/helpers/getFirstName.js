const getFirstName = (name) => {
  const nameToArray = name.split(' ');
  const firstName = nameToArray[0];
  return firstName.replace('-', ' ');
};

export default getFirstName;
