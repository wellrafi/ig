`use strict`
let {IgApiClient} = require('instagram-private-api');
let ig = new IgApiClient();
let { readFile } =  require('fs');
let { promisify } =  require('util');
const readFileAsync = promisify(readFile);
let prompt = require("prompt-sync")({
    sigint: false
})

async function login(username, password) {
    try {
        ig.state.generateDevice(username);
        const res = await ig.account.login(username, password);
        if (!res) {
            return {
                error : 1,
                message: "sorry account not found"
            };
        }
        return {
            error : 0,
            message: "data founded",
            data: res
        }
    } catch (error) {
        console.log("ups something error");
    }

}

async function doLogin(params) {

    const username = prompt("username ? ")
    const password = prompt.hide("password ? ")

    console.log(" - sedang login.....");

    const userData = await login(username, password)

    console.log(" - login berhasil, welcome " + userData.data.username);

    const pathImage = prompt("path nya ? yang detail ")
    const caption = prompt("caption ? ")
    const location = prompt("lokasi ? ")

    const { latitude, longitude, searchQuery } = {
        latitude: 0.0,
        longitude: 0.0,
        // not required
        searchQuery: location,
    };

    const locations = await ig.search.location(latitude, longitude, searchQuery);

    const mediaLocation = locations[0];
    console.log(mediaLocation);
    console.log(" - uploading....");
    const publishResult = await ig.publish.photo({
        // read the file into a Buffer
        file: await readFileAsync(pathImage),
        // optional, default ''
        caption: caption,

    });

    if(!publishResult) return console.log(" - upload gagal")

    console.log(' - upload berhasil');

}

doLogin()

