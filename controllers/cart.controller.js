const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({ message: 'User not authenticated. Use local storage for cart.' });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');
    res.status(200).json(cart);
  } catch (err) {
    console.error('Error in addToCart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({ message: 'User not authenticated. Use local storage for cart.', items: [] });
    }

    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }

    // Filter out items with null productId (invalid references)
    cart.items = cart.items.filter(item => item.productId !== null);

    // Save the cart if any items were removed
    if (cart.isModified()) {
      cart.updatedAt = Date.now();
      await cart.save();
    }

    const cartWithEnquiry = {
      ...cart.toObject(),
      items: cart.items.map(item => ({
        ...item.toObject(),
        enquiryAction: item.productId
          ? {
              url: `/api/enquiries/from-cart`,
              method: 'POST',
              payload: {
                productId: item.productId._id,
                name: req.user?.name || '',
                email: req.user?.email || '',
                phone: '',
                message: `Enquiry about ${item.productId.name}`
              }
            }
          : null // Skip enquiryAction if productId is missing
      }))
    };

    res.status(200).json(cartWithEnquiry);
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');
    res.status(200).json(cart);
  } catch (err) {
    console.error('Error in updateCartItem:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');
    res.status(200).json(cart);
  } catch (err) {
    console.error('Error in removeFromCart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error('Error in clearCart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart, clearCart };