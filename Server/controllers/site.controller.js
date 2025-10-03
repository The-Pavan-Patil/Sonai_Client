import Site from '../models/Site.js';

// Get all sites
const getSites = async (req, res) => {
  try {
    const sites = await Site.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: sites.length,
      sites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single site
const getSiteById = async (req, res) => {
  try {
    const site = await Site.findOne({ siteId: req.params.id });
    if (!site) {
      return res.status(404).json({ success: false, message: 'Site not found' });
    }
    res.json({ success: true, site });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new site
const createSite = async (req, res) => {
  try {
    // Always generate a new Site ID
    let siteId;
    let isUnique = false;
    let attempts = 0;

    // Try to generate a unique ID (max 10 attempts)
    while (!isUnique && attempts < 10) {
      attempts++;

      // Get count of existing sites and add 1
      const count = await Site.countDocuments();
      siteId = `SITE${String(count + attempts).padStart(4, '0')}`;

      // Check if this ID already exists
      const existingSite = await Site.findOne({ siteId });
      if (!existingSite) {
        isUnique = true;
      }
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Unable to generate unique Site ID after multiple attempts'
      });
    }

    // Create site with generated ID
    const siteData = {
      ...req.body,
      siteId
    };

    const site = new Site(siteData);
    const savedSite = await site.save();

    res.status(201).json({
      success: true,
      message: 'Site created successfully',
      site: savedSite
    });

  } catch (error) {
    console.error('Error creating site:', error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Site ID conflict. Please try again.',
        error: 'DUPLICATE_KEY'
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

// Update site
const updateSite = async (req, res) => {
  try {
    const site = await Site.findOneAndUpdate(
      { siteId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!site) {
      return res.status(404).json({ success: false, message: 'Site not found' });
    }

    res.json({
      success: true,
      message: 'Site updated successfully',
      site
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete site
const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;

    const site = await Site.findOneAndDelete({ siteId: id });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    res.json({
      success: true,
      message: 'Site deleted successfully',
      deletedSite: site
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { getSites, getSiteById, createSite, updateSite, deleteSite };
