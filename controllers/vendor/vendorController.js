const { Vendor, User } = require("../../models");

// Reusable validation function
const validateVendorData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.vendor_name !== undefined) {
    if (!data.vendor_name?.trim()) errors.push("Vendor name is required");
  }
  if (!isUpdate || data.vendor_address !== undefined) {
    if (!data.vendor_address?.trim()) errors.push("Vendor address is required");
  }
  if (!isUpdate || data.vendor_identity_type !== undefined) {
    if (!data.vendor_identity_type) errors.push("Identity type is required");
  }
  if (!isUpdate || data.vendor_identity_number !== undefined) {
    if (!data.vendor_identity_number?.trim())
      errors.push("Identity number is required");
  }
  if (!isUpdate || data.phone !== undefined) {
    if (!data.phone?.trim()) errors.push("Phone number is required");
  }
  if (!isUpdate || data.email !== undefined) {
    if (!data.email?.trim()) errors.push("Email is required");
  }
  if (!isUpdate || data.event_name !== undefined) {
    if (!data.event_name?.trim()) errors.push("Event name is required");
  }
  if (!isUpdate || data.event_description !== undefined) {
    if (!data.event_description?.trim())
      errors.push("Event description is required");
  }
  if (!isUpdate || data.organizing_committee !== undefined) {
    if (!data.organizing_committee)
      errors.push("Organizing committee is required");
  }
  if (!isUpdate || data.event_type !== undefined) {
    if (!data.event_type) errors.push("Event type is required");
  }
  if (!isUpdate || data.event_date !== undefined) {
    if (!data.event_date) errors.push("Event date is required");
  }
  if (!isUpdate || data.start_time !== undefined) {
    if (!data.start_time) errors.push("Start time is required");
  }
  if (!isUpdate || data.end_time !== undefined) {
    if (!data.end_time) errors.push("End time is required");
  }
  if (!isUpdate || data.event_pincode !== undefined) {
    if (!data.event_pincode?.trim()) errors.push("Pincode is required");
  }
  if (!isUpdate || data.expected_capacity !== undefined) {
    if (!data.expected_capacity) errors.push("Expected capacity is required");
  }
  if (!isUpdate || data.venue_address !== undefined) {
    if (!data.venue_address?.trim()) errors.push("Venue address is required");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Please enter a valid email address");
  }

  return errors;
};

// ====================== CREATE VENDOR ======================
exports.createVendor = async (req, res) => {
  try {
    const validationErrors = validateVendorData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const existing = await Vendor.findOne({
      where: { user_id: req.user.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile already exists",
      });
    }

    const vendor = await Vendor.create({
      ...req.body,
      user_id: req.user.id,
      is_completed: true,
    });

    await User.update(
      { vendor_completed: true },
      { where: { id: req.user.id } },
    );

    return res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      vendor,
    });
  } catch (error) {
    console.error("Vendor Creation Error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create vendor profile",
    });
  }
};

// ====================== UPDATE VENDOR ======================
// ====================== UPDATE VENDOR ======================
exports.updateVendor = async (req, res) => {
  try {
    const validationErrors = validateVendorData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const vendor = await Vendor.findOne({
      where: { user_id: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // Allow updating is_completed (don't force true)
    const updateData = { ...req.body };

    // Optional: Only allow setting is_completed = true (uncomment if you want strict control)
    // if (updateData.is_completed === false) {
    //   delete updateData.is_completed;
    // }

    const updatedVendor = await vendor.update(updateData);

    // Update user status if needed
    if (updatedVendor.is_completed === true) {
      await User.update(
        { vendor_completed: true },
        { where: { id: req.user.id } },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Vendor Update Error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update vendor profile",
    });
  }
};

// ====================== GET MY VENDOR ======================
exports.getMyVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("Get Vendor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor profile",
    });
  }
};
