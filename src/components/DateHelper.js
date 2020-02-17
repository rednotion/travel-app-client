import React from "react";

export function changeDate(input) {
	const month = input.slice(0, 2)
	const day = input.slice(3, 5)
	const year = input.slice(6, 10)
	return `{year}-{month}-{day}`
}