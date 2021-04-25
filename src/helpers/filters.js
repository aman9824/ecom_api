import Product from '../models/product';

const Filter = {
  handleQuery: async (req, res, next, query) => {
    try {
      const products = await Product.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name');
      return res.json(products);
    } catch (error) {
      return next(new Error(error));
    }
  },

  handlePrice: async (req, res, next, price) => {
    try {
      const products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1]
        }
      })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name');

      return res.json(products);
    } catch (error) {
      return next(new Error(error));
    }
  },

  handleCategory: async (req, res, next, category) => {
    try {
      const products = await Product.find({ category })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();

      return res.json(products);
    } catch (error) {
      return next(new Error(error));
    }
  },

  handleStar: async (req, res, next, stars) => {
    try {
      const aggregates = await Product.aggregate([
        {
          $project: {
            document: '$$ROOT',
            // title: "$title",
            floorAverage: {
              $floor: { $avg: '$ratings.star' } // floor value of 3.33 will be 3
            }
          }
        },
        { $match: { floorAverage: stars } }
      ])
        .limit(12);
      const products = await Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name');

      return res.json(products);
    } catch (error) {
      return next(new Error(error));
    }
  },

  handleSub: async (req, res, next, sub) => {
    try {
      const products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name');
      return res.json(products);
    } catch (error) {
      return next(new Error(error));
    }
  },

  handleShipping: async (req, res, next, shipping) => {
    try {
      const products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name');


      return res.json(products);
    } catch (error) {
      return next(new Error(error));
    }
  }
};

export default Filter;
