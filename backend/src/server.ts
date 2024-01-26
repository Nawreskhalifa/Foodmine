import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";


import foodRouter from './routers/food.router'
import userRouter from "./routers/user.router";
import { dbConnect } from './configs/database.config';
dbConnect();

const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));
// app.delete('http://localhost:5000/:foodId', async (req: any, res: any) => {
//     try {
//       const id = req.params.foodId;
//       const deletedFood = await FoodModel.findByIdAndDelete(id);
//       res.status(200).send(`Product ${id} deleted`);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send(err);
//     }
//   });
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

const port = 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})