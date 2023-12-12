const router = require('express').Router();
const { createCipheriv } = require('crypto');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products

  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
        },
      ],
  });
  res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
        },
      ],
    });
    if (!category) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
  }
  res.json(category);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

router.post('/', async (req, res) => {
  // create a new category

try {
  const Category = await Category.create(req.body);
  res.status(201).json(Category);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

router.put('/:id', async (req, res) => {
  try {
    const [affectedRows, updatedRows] = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (affectedRows === 0) {
      res.json({ message: 'Category Updated Successfully' });
  } else {
    res.status(404).json({ message: 'No category found with this id' });
  }
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value

  try { 
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!category > 0) {
      res.json({ message: 'No category found with this id!' });
    } else {
      res.status(200).json({ message: 'Category deleted!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

