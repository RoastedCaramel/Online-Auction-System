const mongoose = require('mongoose');
const title = require('./title');
const cities = require('./cities');
const price = require('./price');
const Product = require('../models/product');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/miniProject-sem3');
  console.log("Data Base Connected");
}

const db = mongoose.connection;

const seedDB = async () => {
  await Product.deleteMany({});
  for (let i = 0; i < 10; i++) {
    //const random10 = Math.floor(Math.random() * 10);
    const price = Math.floor(Math.random() * 200000) + 1000;
    const prod = new Product({
      title: `${title[i]}`,
      location: `${cities[i]}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dksttypxf/image/upload/v1637515488/Miniproject-Sem3/bzfoc7cxw7korrzsooyj.png',
          filename: 'Miniproject-Sem3/bzfoc7cxw7korrzsooyj',
          
        },
        {
          url: 'https://res.cloudinary.com/dksttypxf/image/upload/v1637515488/Miniproject-Sem3/xyfja252a6zysmt3uzzq.jpg',
          filename: 'Miniproject-Sem3/xyfja252a6zysmt3uzzq',
          
        }
      ],
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium repudiandae quas est, consequuntur maxime placeat, quibusdam, cumque minima aperiam obcaecati deleniti repellat! Deserunt porro nam amet non explicabo autem provident?',
      price, 
      certificate:'Yes',
      endTime: '20-11-2021 14:00',
      category: 'antique',
      seller: "6198b238bd031533cbb7b977"
    })
    await prod.save();
  }
}

seedDB();