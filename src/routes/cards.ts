import { Router, Request, Response } from "express";

const cardRouter = Router();

cardRouter.get("/", (req: Request, res: Response) => {
  console.log("Контроллер для получения всех карточек");
});

cardRouter.post("/", (req: Request, res: Response) => {
  console.log("Контроллер для создания карточки");
});

cardRouter.delete("/:cardId", (req: Request, res: Response) => {
  console.log("Контроллер для удаления карточки по id");
});

cardRouter.put("/:cardId/likes", (req: Request, res: Response) => {
  console.log("Контроллер для постановки лайка на карточку");
});

cardRouter.delete("/:cardId/likes", (req: Request, res: Response) => {
  console.log("Контроллер для убрать лайк с карточки");
});

export default cardRouter;
