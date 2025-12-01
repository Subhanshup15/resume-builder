import Resume from "../models/Resume.js";

export const saveResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const resume = await Resume.findOne({ userId });
    res.json(resume || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const resume = await Resume.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
