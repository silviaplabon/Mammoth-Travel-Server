const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4200;
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const admin = require('firebase-admin');

app.use(express.static('images'));
app.use(fileUpload());

var serviceAccount = require("./.configs/mammoth-travel-firebase-adminsdk-3sftc-d726a17f4d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.DB_NAME}.firebaseio.com`
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcsxh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db('travelia_services').collection("services");
  const testimonialsCollection = client.db('travelia_services').collection("testimonial");
  const adminCollection = client.db('travelia_services').collection("admins");
  const bookingsCollection = client.db('travelia_services').collection("bookings");
  console.log("database connected");




  app.post('/addServices', (req, res) => {
    const newService = req.body;
    console.log(req.body, "come from client site")
    servicesCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
    app.get('/serviceData', (req, res) => {
    servicesCollection.find({})
      .toArray((err, services) => {
        res.send(services)
      })
  })

  app.post('/addTestimonial', (req, res) => {
    const newtestimonial = req.body;
    console.log(req.body, "come from client site")
    testimonialsCollection.insertOne(newtestimonial)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/testimonialsData', (req, res) => {
    testimonialsCollection.find({})
      .toArray((err, services) => {
        res.send(services)
      })
  })
  app.get('/allBookingsData', (req, res) => {
    bookingsCollection.find({})
      .toArray((err, bookings) => {
        res.send(bookings);
      })
  })
  app.delete('/delete/:id',(req,res)=>{
    servicesCollection.deleteOne({_id: ObjectID(req.params.id) })
    .then(result => {
      console.log(result)
      res.send(result.deletedCount > 0)
    })
  })
  app.post('/adminMaker', (req, res) => {
    const newAdmin = req.body;
    console.log(req.body, "come from client site")
    adminsCollection.insertOne(newAdmin)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  
  app.get('/service/:id', (req, res) => {
    servicesCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, products) => {
        res.send(products[0])
      })
  })

  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log(req.body, "come from client site")
    bookingsCollection.insertOne(newBook)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/userbookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer')) {
      const idToken = bearer.split(' ')[1];//extracting second part
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          let tokenEmail = decodedToken.email;
          let queryEmail = req.query.email;
          if (tokenEmail == queryEmail) {
            bookingsCollection.find({ email: req.query.email })
              .toArray((err, documents) => {
                res.send(documents);
              })
          }
          else {
            res.send("unauthorized access");
          }
        })
        .catch((error) => {
          
        });
    }
  });
  app.patch('/update/:id',(req,res)=>{
    bookingsCollection.updateOne({_id: ObjectID(req.params.id)},
     {
      $set:{status:req.body.status}
     })
     .then (result=>{
        res.send(result.modifiedCount>0)
        console.log(result);
     })
  })
  
//   app.post('/addOrder', (req, res) => {
//     const order = req.body;
//     orderCollection.insertOne(order)
//       .then(result => {
//         res.send(result.insertedCount > 0)
//       })
//   })
//   app.delete('/deleteProduct/:id',(req,res)=>{
//     productCollection.deleteOne({_id: ObjectID(req.params.id) })
//     .then(result => {
//       console.log(result)
//       res.send(result.deletedCount > 0)
//     })
//   })
//   app.get('/orders', (req, res) => {
//     const bearer = req.headers.authorization;
//     if (bearer && bearer.startsWith('Bearer')) {
//       const idToken = bearer.split(' ')[1];//extracting second part
//       admin.auth().verifyIdToken(idToken)
//         .then((decodedToken) => {
//           let tokenEmail = decodedToken.email;
//           let queryEmail = req.query.email;
//           if (tokenEmail == queryEmail) {
//             orderCollection.find({ email: req.query.email })
//               .toArray((err, documents) => {
//                 res.send(documents);
//               })
//           }
//           else {
//             res.send("unauthorized access");
//           }
//         })
//         .catch((error) => {
//         });
//     }
//////////////////////////////////////////////////////Inserting Home page Data///////////////////////////////////////////////////////
// app.get('/productdata/PopularDrinks', (req, res) => {
//   PopularDrinksCollection.find({})
//     .toArray((err, products) => {
//       res.send(products)
//     })
// })


// //delete start

// app.delete('/deleteProduct/PopularDrinks/:id',(req,res)=>{
//   PopularDrinksCollection.deleteOne({_id: ObjectID(req.params.id) })
//   .then(result => {
//     console.log(result)
//     res.send(result.deletedCount > 0)
//   })
// })


//   app.post('/adddata/PopularDrink', (req, res) => {
//     const newProduct = req.body;
//     console.log(newProduct);
//     console.log(req.body, "come from client site")
//     PopularDrinksCollection.insertOne(newProduct)
//       .then(result => {
//         console.log('inserted count', result.insertedCount);
//         res.send(result.insertedCount > 0)
//       })
//   })
  


//   app.get('/product/PopularDrinks/:id', (req, res) => {
//     PopularDrinksCollection.find({ _id:ObjectID(req.params.id) })
//       .toArray((err, products) => {
//         res.send(products[0])
//       })
//   })
   


//   // 

// app.patch('/update/PopularDrinks/:id',(req,res)=>{
//   PopularDrinksCollection.updateOne({_id: ObjectID(req.params.id)},
//    {
//     $set:{name:req.body.name,imageURL:req.body.imageURL}
//    })
//    .then (result=>{
//       res.send(result.modifiedCount>0)
//       console.log(result);
//    })
// })



});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})