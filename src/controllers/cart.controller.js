const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cart-item.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");
const { recalculateCartTotal } = require("../utils/cart");

const getCart = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      return res.status(200).json({
        status: "success",
        message: "Cart successfully retrieved",
        data: {
          cart: null,
          items: paginatedResponse({
            content: [],
            page,
            size,
            totalElements: 0,
            sortField,
            sortDirection,
          }),
        },
      });
    }

    const query = { cart_id: cart._id };

    const totalElements = await CartItem.countDocuments(query);

    const items = await CartItem.find(query)
      .populate("book_id")
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Cart successfully retrieved",
      data: {
        cart,
        items: paginatedResponse({
          content: items,
          page,
          size,
          totalElements,
          sortField,
          sortDirection,
        }),
      },
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const addCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        total_amount: 0,
      });
    }

    const item = await CartItem.create({
      cart_id: cart._id,
      book_id: req.body.book_id,
      quantity: req.body.quantity,
    });

    const totalAmount = await recalculateCartTotal(cart._id);

    await Cart.findByIdAndUpdate(cart._id, {
      total_amount: totalAmount,
    });

    res.status(201).json({
      status: "success",
      message: "Item added to cart",
      data: item,
    });
  } catch (error) {
    console.error(error);
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByIdAndUpdate(
      req.params.itemId,
      { quantity: req.body.quantity },
      { new: true }
    );

    if (!item) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Cart item not found"));
    }

    const totalAmount = await recalculateCartTotal(item.cart_id);

    await Cart.findByIdAndUpdate(item.cart_id, {
      total_amount: totalAmount,
    });

    res.status(200).json({
      status: "success",
      message: "Cart item successfully updated",
      data: item,
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.itemId);

    if (!deleted) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Cart item not found"));
    }

    const totalAmount = await recalculateCartTotal(deleted.cart_id);

    await Cart.findByIdAndUpdate(deleted.cart_id, {
      total_amount: totalAmount,
    });

    res.status(200).json({
      status: "success",
      message: "Item removed from cart",
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
