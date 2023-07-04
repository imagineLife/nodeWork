import express, { Request, Response } from 'express';
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

let items: string[] = [];

function getItems(req: Request, res: Response){
  return res.json(items);
}

function postItems(req: Request, res: Response){
  const newItem: string = req.body.item;
  items.push(newItem);
  return res.sendStatus(201);
}

function putItemById(req: Request, res: Response){
  const itemId: number = Number(req.params.id);
  const updatedItem: string = req.body.item;
  if (itemId >= 0 && itemId < items.length) {
    items[itemId] = updatedItem;
    return res.sendStatus(204);
  } else {
    return res.sendStatus(404);
  }
}

function deleteItemById(req: Request, res: Response){
  const itemId: number = Number(req.params.id);
  if (itemId >= 0 && itemId < items.length) {
    items.splice(itemId, 1);
    return res.sendStatus(204);
  } else {
    return res.sendStatus(404);
  }
}

app.get('/items', getItems);
app.post('/items', postItems);
app.put('/items/:id', putItemById);
app.delete('/items/:id', deleteItemById);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
