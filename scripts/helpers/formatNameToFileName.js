const formatName = (name) => {
	const nameToArray = name.split(' ');
	const firstName = nameToArray[0];
	return firstName.replace('-', ' ');
};
