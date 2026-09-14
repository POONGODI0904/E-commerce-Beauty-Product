import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Auth user & get token
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('wishlist');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({ message: 'This account has been deactivated. Please contact support.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        wishlist: user.wishlist
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.email) {
        const emailTaken = await User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: user._id } });
        if (emailTaken) {
          return res.status(400).json({ message: 'Email address already in use' });
        }
        user.email = req.body.email.toLowerCase();
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const populated = await User.findById(updatedUser._id).populate('wishlist');

      res.json({
        _id: populated._id,
        name: populated.name,
        email: populated.email,
        phone: populated.phone,
        role: populated.role,
        avatar: populated.avatar,
        addresses: populated.addresses,
        wishlist: populated.wishlist,
        token: generateToken(populated._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add an address
// @route  POST /api/auth/addresses
// @access Private
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAddress = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      houseFlat: req.body.houseFlat,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country || 'United States',
      isDefault: req.body.isDefault || user.addresses.length === 0
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update an address
// @route  PUT /api/auth/addresses/:id
// @access Private
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    Object.assign(address, req.body);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete an address
// @route  DELETE /api/auth/addresses/:id
// @access Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses.pull(req.params.id);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Toggle Wishlist item
// @route  POST /api/auth/wishlist/toggle
// @access Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updated = await User.findById(user._id).populate('wishlist');
    res.json(updated.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
