const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
  });
  res.json(products);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data

  try{
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
  }
  res.json(product);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

// create new product
// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// update product
// Assuming you're using Sequelize for database operations

router.put('/:product_id/tags', async (req, res) => {
  try {
    const productId = req.params.product_id;
    const tagIds = req.body.tags;

    // Check if the product exists
    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    // Remove existing tags for the product
    await ProductTag.destroy({
      where: {
        product_id: productId,
      },
    });

    // Add new tags for the product
    await ProductTag.bulkCreate(tagIds.map(tagId => ({
      product_id: productId,
      tag_id: tagId,
    })));

    // Respond with the updated product (including tags)
    const updatedProduct = await Product.findByPk(productId, {
      include: [
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// delete product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProductCount = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedProductCount > 0) {
      // Product was deleted
      res.status(200).json({ message: 'Product deleted!' });
    } else {
      // No product found with the given id
      res.status(404).json({ message: 'No product found with this id!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
