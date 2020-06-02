`use strict`;
let { IgApiClient } = require('instagram-private-api');
let ig = new IgApiClient();
let { readFile } = require('fs');
let { promisify } = require('util');
const readFileAsync = promisify(readFile);
const prompt = require('inquirer');

let questions = [
	{
		type: 'input',
		name: 'username',
		message: 'username ? ',
	},
	{
		type: 'password',
		name: 'password',
		message: 'password ? ',
	},
];

const questionsPost = [
	{
		type: 'input',
		name: 'path',
		message: 'path file ? ',
    },
    {
        type: "input",
        name: "caption",
        message: "caption ? "
    },
	{
		type: 'input',
		name: 'location',
		message: 'lokasi ? ',
	},
];

async function login(username, password) {
	try {
		ig.state.generateDevice(username);
		const res = await ig.account.login(username, password);
		if (!res) {
			return {
				error: 1,
				message: 'sorry account not found',
			};
		}
		return {
			error: 0,
			message: 'data founded',
			data: res,
		};
	} catch (error) {
		console.log('ups something error');
	}
}

async function doLoginTwo() {
	const inputs = await prompt.prompt(questions);
	const userData = await login(inputs.username, inputs.password);
	if (login.error) return console.log(login.message);
	console.log('- login sukses ' + userData.data.username);
	const inputPost = await prompt.prompt(questionsPost);
    console.log(inputPost);
    
	const { latitude, longitude, searchQuery } = {
		latitude: 0.0,
		longitude: 0.0,
		// not required
		searchQuery: inputPost.location,
    };
    const locations = await ig.search.location(latitude, longitude, searchQuery);
	let mediaLocation = locations[0];
    console.log(mediaLocation);
    
    const publishResult = await ig.publish.photo({
		// read the file into a Buffer
		file: await readFileAsync(inputPost.path),
		// optional, default ''
		caption: inputPost.caption,
    });
    console.log(publishResult);

}

doLoginTwo();