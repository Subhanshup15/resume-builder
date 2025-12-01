import Resume from "../models/Resume.js";

// In-memory fallback store when MongoDB is not configured (development convenience)
const IN_MEMORY = new Map();

export const saveResume = async (req, res) => {
  try {
    const data = req.body;
    // If mongoose is connected, persist; otherwise use in-memory store
    if (process.env.MONGO_URI) {
      const resume = new Resume(data);
      await resume.save();
      return res.json({ success: true, resume });
    }

    if (!data.userId) data.userId = `local-${Date.now()}`;
    IN_MEMORY.set(data.userId, { ...data, _id: data.userId });
    return res.json({ success: true, resume: IN_MEMORY.get(data.userId) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const { userId } = req.params;
    if (process.env.MONGO_URI) {
      const resume = await Resume.findOne({ userId });
      return res.json(resume || {});
    }

    return res.json(IN_MEMORY.get(userId) || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { userId } = req.params;
    if (process.env.MONGO_URI) {
      const resume = await Resume.findOneAndUpdate({ userId }, req.body, { new: true });
      return res.json(resume);
    }

    const existing = IN_MEMORY.get(userId) || {};
    const updated = { ...existing, ...req.body, userId };
    IN_MEMORY.set(userId, updated);
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
