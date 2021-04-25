/* eslint-disable prefer-template */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import Filter from '../helpers/filters';
import Product from '../models/product';
import User from '../models/user';

const ProductController = {

  // list products by count
  async getProductsByCount(req, res) {
    const products = await Product.find()
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      .sort([['createdAt', 'desc']]);

    res.json(products);
  },

  // get paginated product list
  async getProductList(req, res) {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3; // 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage);

    res.json(products);
  },

  async getProductById(req, res) {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    res.status(200).json({ product });
  },

  async getProductsTotal(req, res) {
    const total = await Product.find().estimatedDocumentCount();
    res.json(total);
  },

  async updateProduct(req, res) {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(productId, req.body);
    res.json({ product });
  },

  async createProduct(req, res) {
    const newProduct = new Product(req.body);
    const { _id, firstName, lastName } = await User.findById(req.user.id);
    newProduct.seller.id = _id;
    newProduct.seller.name = firstName + ' ' + lastName;
    const product = await newProduct.save();
    return res.status(201).json({ product });
  },

  async deleteProduct(req, res) {
    const { productId } = req.params;

    await Product.findByIdAndRemove(productId);
    res.json({ message: 'Product Deleted' });
  },

  async listRelatedProducts(req, res, next) {
    const product = await Product.findById(req.params.productId);

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    })
      .limit(3)
      .populate('category')
      .populate('subs')
      .populate('postedBy');

    return res.json(related);
  },
  async listCategories(req, res) {
    const category = await Product.distinct('category', {});
    return res.json(category);
  },

  async productStar(req, res) {
    const product = await Product.findById(req.params.productId);
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    const existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === req.user.id.toString()
    );
      // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      const ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: req.user.id } }
        },
        { new: true }
      );
      return res.json(ratingAdded);
    }
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject }
      },
      { $set: { 'ratings.$.star': star } },
      { new: true }
    );
    return res.json(ratingUpdated);
  },

  // SEARCH / FILTER
  async searchProducts(req, res, next) {
    const {
      query,
      price,
      category,
      stars,
      sub,
      shipping
    } = req.body;
    if (query) {
      await Filter.handleQuery(req, res, next, query);
    }

    // price [20, 200]
    if (price !== undefined) {
      await Filter.handlePrice(req, res, next, price);
    }

    if (category) {
      await Filter.handleCategory(req, res, next, category);
    }

    if (stars) {
      await Filter.handleStar(req, res, next, stars);
    }

    if (sub) {
      await Filter.handleSub(req, res, next, sub);
    }

    if (shipping) {
      await Filter.handleShipping(req, res, next, shipping);
    }
  }

};

export default ProductController;
