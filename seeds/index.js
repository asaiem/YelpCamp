const Campground = require('../models/campground')
const mongoose = require('mongoose')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
        console.log(" Mongo CONNECTEDD")
    })
    .catch((err)=>{
        console.log("OHH Mongo Error Connection")
        console.log(err);

    });

    
const sample = array => array[Math.floor(Math.random()*(array.length))]
const seedDB = async()=>{
    await Campground.deleteMany({});
    for( let i = 0; i < 50 ;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price =Math.floor(Math.random()*20) + 10;
            const camp =new Campground({
                author: '64d8c6e34501d224e30fec34',
                location:`${cities[random1000].city} , ${ cities[random1000].state} `,
                
                title :`${sample(descriptors)} ${sample(places)}`,
                geometry: { type: 'Point', coordinates: [ 31.235726, 30.044388 ] },
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

seedDB().then(()=>{
    mongoose.connection.close();
})