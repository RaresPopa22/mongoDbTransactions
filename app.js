const express = require('express');
const mongoose = require('mongoose');
const app = express();


// connect to mongoDB
const host = '192.168.1.3';
const url = `mongodb://${host}:30001,${host}:30002,${host}:30003/test`;

mongoose.connect(url, {
  useNewUrlParser: true,
  replicaSet: 'mongo-replica-set'
}).then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error))



// models
const shopSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  location: String,
  description: String
});
const Shop = mongoose.model('Shop', shopSchema);

const shopTitleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
});
const ShopTitle = mongoose.model('ShopTitle', shopTitleSchema);



// repos
const saveShop = (shop, opts) => shop.save(opts);

const saveShopTitle = (shopTitle, opts) => shopTitle.save(opts);



// service
const save = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session };

    const shop = new Shop();
    shop._id = mongoose.Types.ObjectId();
    shop.name = 'joe-shop';
    shop.location = 'nowhereland';
    shop.description = 'awesome place. would buy here again';

    const shopTitle = new ShopTitle();
    shopTitle._id = mongoose.Types.ObjectId();
    shopTitle.name = shop.name;

    await saveShop(shop, opts);
    await saveShopTitle(shopTitle, opts);
    throw new Error("where bad stuff happens");

    await session.commitTransaction();

    res.json('successful');
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}


// routing
app.post("/shops", (req,res,next) => save(req,res,next).catch(next));



// global err handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message
  });
});


const port = 8080;
app.listen(port, () => console.log(`Server is up and running on port ${port}`));
