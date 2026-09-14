import Coupon from '../models/Coupon.js';

// @desc   Validate coupon and calculate discount
// @route  POST /api/coupons/validate
// @access Public / Private
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive promotional code' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit has been reached' });
    }

    const subtotal = Number(orderAmount) || 0;
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        message: `Minimum order amount of $${coupon.minOrder.toFixed(2)} required for this code`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountAmount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountAmount, subtotal);
    }

    discount = Number(discount.toFixed(2));

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountRate: coupon.discountAmount,
      discount,
      message: `Coupon "${coupon.code}" applied! You saved $${discount.toFixed(2)}.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all coupons
// @route  GET /api/coupons
// @access Private/Admin
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create coupon
// @route  POST /api/coupons
// @access Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountAmount, minOrder, maxDiscount, expiryDate, usageLimit } = req.body;

    const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (exists) {
      return res.status(400).json({ message: 'A coupon with this code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType: discountType || 'percentage',
      discountAmount: Number(discountAmount),
      minOrder: Number(minOrder) || 0,
      maxDiscount: Number(maxDiscount) || 1000,
      expiryDate: new Date(expiryDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: Number(usageLimit) || 100
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update coupon
// @route  PUT /api/coupons/:id
// @access Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    Object.assign(coupon, req.body);
    if (req.body.code) coupon.code = req.body.code.toUpperCase().trim();

    const updated = await coupon.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete coupon
// @route  DELETE /api/coupons/:id
// @access Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.findByIdAndDelete(req.params.id);
      res.json({ message: 'Coupon deleted' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
