import { Router, Request, Response } from "express";

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {
  console.log("Контроллер для получения всех юзеров");
});
userRouter.get("/:userId", (req: Request, res: Response) => {
  console.log("Контроллер для получения юзера по id");
});

userRouter.post("/", (req: Request, res: Response) => {
  console.log("Контроллер для создания юзера");
});

userRouter.patch("/me", (req: Request, res: Response) => {
  console.log("Контроллер для изменения профиля");
});

userRouter.patch("/me/avatar", (req: Request, res: Response) => {
  console.log("Контроллер для изменения аватара");
});

export default userRouter;
