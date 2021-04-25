import Category from '../models/category';
import Product from '../models/product';
import Sub from '../models/sub';

const CategoryController = {

  async listCategories(req, res) {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.send(categories);
  },
  async getOneCategory(req, res) {
    const category = await Category.findOne({ _id: req.params.id });
    const products = await Product.find({ category }).populate('category');
    return res.json({
      category,
      products
    });
  },

  async createCategory(req, res) {
    const { name } = req.body;
    const category = await Category.findOne({ name });
    if (category) return res.status(400).json({ message: 'This category already exists.' });

    const newCategory = new Category({ name });

    await newCategory.save();
    return res.status(201).send({ message: 'Created a category' });
  },

  async updateCategory(req, res) {
    const { name } = req.body;
    await Category.findOneAndUpdate({ _id: req.params.id }, { name });
    return res.status(200).send({ message: 'Category Updated' });
  },

  async deleteCategory(req, res) {
    const products = await Product.findOne({ category: req.params.id });
    if (products) {
      return res.status(400).send({
        message: 'Please delete all products with a relationship.'
      });
    }
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: 'Category Deleted' });
  },

  async getCategorySubs(req, res) {
    const subs = await Sub.find({ parent: req.params.id });
    return res.json(subs);
  }
};

export default CategoryController;
