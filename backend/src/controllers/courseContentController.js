const CourseContent = require('../models/courseContentModel');

// Create new course content
const createContent = async (req, res) => {
    const { course_id, title, content_url } = req.body;

    try {
        const content = await CourseContent.create({ course_id, title, content_url });
        res.status(201).json({ message: 'Content created successfully.', content });
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ message: 'Error creating content', error });
    }
};

// Get all content for a specific course
const getContentByCourseId = async (req, res) => {
    const { course_id } = req.params;

    try {
        const content = await CourseContent.findByCourseId(course_id);
        if (!content.length) {
            return res.status(404).json({ message: 'No content found for this course.' });
        }
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Error fetching content', error });
    }
};

// Get specific content by its ID
const getContentById = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await CourseContent.findById(id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found.' });
        }
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Error fetching content', error });
    }
};

// Delete course content by ID
const deleteContent = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await CourseContent.delete(id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found.' });
        }
        res.status(200).json({ message: 'Content deleted successfully.', content });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ message: 'Error deleting content', error });
    }
};

module.exports = {
    createContent,
    getContentByCourseId,
    getContentById,
    deleteContent,
};