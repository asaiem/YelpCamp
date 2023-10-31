
// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config({ path: "../.env" });
// }
require('dotenv').config();
const Campground = require('../models/campground')
const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
// const dbUrl = process.env.DB_URL 
const dbUrl = process.env.DB_URL
// 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl
)
    .then(() => {
        console.log(" Mongo CONNECTEDD")
    })
    .catch((err) => {
        console.log("OHH Mongo Error Connection")
        console.log(err);

    });
console.log(dbUrl)
require('dotenv').config();
const sample = array => array[Math.floor(Math.random() * (array.length))]
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 2; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // '64fdcfe699786ea1f7219dc2' mongoAtlas
            // local id "64d8c6e34501d224e30fec34"
            author: '64d8c6e34501d224e30fec34',
            location: `${cities[random1000].city} , ${cities[random1000].state} `,
            // latitude: 37.9974219, longitude:
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dnsw1mkyu/image/upload/v1693089659/YelpCamp/fpi9aa4fn6xlbycbbji9.jpg',
                    filename: 'YelpCamp/fpi9aa4fn6xlbycbbji9',

                },
                {
                    url: 'https://res.cloudinary.com/dnsw1mkyu/image/upload/v1693089639/YelpCamp/oytkedqylq3ghygvoowb.jpg',
                    filename: 'YelpCamp/oytkedqylq3ghygvoowb',

                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum adipisci at pariatur similique dolorem perferendis magnam illum libero, ad alias eos nesciunt a accusamus, dolorum praesentium vero porro molestiae illo.',
            price

        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})