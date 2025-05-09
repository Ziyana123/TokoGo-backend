const ContactQuery = require("../models/ContactQuery");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const newQuery = new ContactQuery({ name, email, subject, message });
    await newQuery.save();
    res.status(201).json({ message: "Query submitted successfully." });
  } catch (error) {
    console.error("Error submitting contact form:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
