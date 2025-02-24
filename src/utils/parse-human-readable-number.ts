export function parseHumanReadableNumber(input) {
	if (typeof input !== "string") {
		return NaN; // Return NaN for invalid input
	}

	const suffixes = {
		K: 1000,
		M: 1000000,
		B: 1000000000,
		T: 1000000000000,
	};

	const suffixRegex = /([KMBT])$/i; // Case-insensitive match

	const match = input.match(suffixRegex);

	if (match) {
		const suffix = match[1].toUpperCase(); // Get the suffix and convert to uppercase
		const numberPart = input.slice(0, -1); // Remove the suffix

		const parsedNumber = parseNumberWithCommas(numberPart);

		if (isNaN(parsedNumber)) {
			return NaN; // Return NaN if the number part is invalid
		}

		if (suffixes[suffix]) {
			return parsedNumber * suffixes[suffix];
		} else {
			return NaN; // Invalid suffix
		}
	} else {
		// No suffix, parse as a regular number
		return parseNumberWithCommas(input);
	}
}

function parseNumberWithCommas(str) {
	if (typeof str !== "string") {
		return NaN;
	}

	const cleanedStr = str.replace(/,/g, ""); // Remove commas

	if (!/^-?\d+(\.\d+)?$/.test(cleanedStr)) {
		// Check if it's a valid number
		return NaN;
	}

	const parsed = parseFloat(cleanedStr);
	return isNaN(parsed) ? NaN : parsed;
}
