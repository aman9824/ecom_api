import Category from '../models/category';
import Product from '../models/product';
import Sub from '../models/sub';

const CategoryController = {

  async listSubs(req, res) {
    const subs = await Sub.find().sort({ createdAt: -1 });
    return res.json(subs);
  },

  async getOneSubCategory(req, res) {
    const sub = await Sub.findOne({ _id: req.params.id });
    const products = await Product.find({ subs: sub }).populate('category');
    return res.json({
      sub,
      products
    });
  },


  async createSub(req, res) {
    const { name, parent } = req.body;
    const newSub = new Sub({ name, parent });

    await newSub.save();
    return res.status(201).json({ message: 'Created a sub category' });
  },

  async updateSubCategory(req, res) {
    const { name } = req.body;
    await Sub.findOneAndUpdate({ _id: req.params.id }, { name });
    return res.status(200).send({ message: 'Sub Category Updated' });
  },

  async deleteSubCategory(req, res) {
    await Sub.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: 'Sub Category Deleted' });
  }
};

export default CategoryController;
