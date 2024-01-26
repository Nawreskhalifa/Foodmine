import {Router} from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler'; 
import { FoodModel } from '../models/food.model';

const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
       const foodsCount = await FoodModel.countDocuments();
       if(foodsCount> 0){
         res.send("Seed is already done!");
         return;
       }
   
       await FoodModel.create(sample_foods);
       res.send("Seed Is Done!");
   }
   ))

   router.get("/",asyncHandler(
    async (req, res) => {
      const foods = await FoodModel.find();
        res.send(foods);
    }
  ))
  router.get("/search/:searchTerm", asyncHandler(
    async (req, res) => {
      const searchRegex = new RegExp(req.params.searchTerm, 'i');
      const foods = await FoodModel.find({name: {$regex:searchRegex}})
      res.send(foods);
    }
  ))
  router.get("/tags", asyncHandler(
    async (req, res) => {
      const tags = await FoodModel.aggregate([
        {
          $unwind:'$tags'
        },
        {
          $group:{
            _id: '$tags',
            count: {$sum: 1}
          }
        },
        {
          $project:{
            _id: 0,
            name:'$_id',
            count: '$count'
          }
        }
      ]).sort({count: -1});
  
      const all = {
        name : 'All',
        count: await FoodModel.countDocuments()
      }
  
      tags.unshift(all);
      res.send(tags);
    }
  ))
  router.get("/tag/:tagName",asyncHandler(
    async (req, res) => {
      const foods = await FoodModel.find({tags: req.params.tagName})
      res.send(foods);
    }
  ))
// router.get("/tag/:tagName", (req,res) => { 
//     const tagName = req.params.tagName;
//     const foods = sample_foods
//     .filter(food => food.tags?.includes(tagName));
//      res.send(foods);
//  })
 router.get("/:foodId", asyncHandler(
    async (req, res) => {
      const food = await FoodModel.findById(req.params.foodId);
      res.send(food);
    }
  ))
  // router.delete('/:foodId', (req :any, res:any) => {
  //   const id = req.params.foodId;
  //   FoodModel.findByIdAndDelete(id, (err: any, FoodModel: any) => {
  //     if (err) {
  //       console.error(err);
  //       res.status(500).send(err);
  //     } else {
  //       res.status(200).send(`Product ${id} deleted`);
  //     }
  //   });
  // });
  router.delete('/:foodId', async (req: any, res: any) => {
    try {
      const id = req.params.foodId;
      const deletedFood = await FoodModel.findByIdAndDelete(id);
      res.status(200).send(`Product ${id} deleted`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });
  
  // router.post('/', (req, res) => {
  //   const foods = new FoodModel({
  //     name: req.body.name,
  //     tags: req.body.tags,
  //     price: req.body.price,
  //     imageUrl: req.body.imageUrl,
  //    stars:req.body.stars,
  //   origins:req.body.origins,
  //    cookTime:req.body.cookTime,
  //   }
  // );
  //   if (!foods.stars) {
  //     res.status(400).send('Stars field is required');
  //     return;
  //   }
  //   foods.save((err: any) =>  {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send('Error saving product to database');
  //     }
  
  //     return res.status(201).send('Food created successfully');
  //   });
  // });
  router.post('/', async (req, res) => {
    const foods = new FoodModel({
      name: req.body.name,
      tags: req.body.tags,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      stars: req.body.stars,
      origins: req.body.origins,
      cookTime: req.body.cookTime,
    });
  
    if (!foods.stars) {
      res.status(400).send('Stars field is required');
      return;
    }
  
    try {
      await foods.save();
      return res.status(201).send('Food created successfully');
    } catch (err) {
      console.log(err);
      return res.status(500).send('Error saving product to database');
    }
  });
  



  export default router;