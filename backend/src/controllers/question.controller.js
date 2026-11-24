import { QuestionModel } from "../models/question.model.js";

export class QuestionController {
  static async getCategories(req, res) {
    const categories = await QuestionModel.getCategories();
    res.json(categories);
  }

  static async getAll(req, res) {
    const { category } = req.query;
    const questions = await QuestionModel.getAll({ category });
    res.json(questions);
  }

  static async getById(req, res) {
    const question = await QuestionModel.getById(req.params.id);
    res.json(question);
  }

  static async create(req, res) {
    const question = await QuestionModel.create(req.body);
    res.status(201).json(question);
  }

  static async update(req, res) {
    const question = await QuestionModel.update(req.params.id, req.body);
    res.json(question);
  }

  static async remove(req, res) {
    await QuestionModel.remove(req.params.id);
    res.json({ message: "Pregunta eliminada" });
  }
}
