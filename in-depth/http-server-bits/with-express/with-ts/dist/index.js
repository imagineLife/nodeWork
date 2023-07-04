"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var PORT = process.env.PORT || 3000;
var app = (0, express_1.default)();
app.use(express_1.default.json());
var items = [];
function getItems(req, res) {
    return res.json(items);
}
function postItems(req, res) {
    var newItem = req.body.item;
    items.push(newItem);
    return res.sendStatus(201);
}
function putItemById(req, res) {
    var itemId = Number(req.params.id);
    var updatedItem = req.body.item;
    if (itemId >= 0 && itemId < items.length) {
        items[itemId] = updatedItem;
        return res.sendStatus(204);
    }
    else {
        return res.sendStatus(404);
    }
}
function deleteItemById(req, res) {
    var itemId = Number(req.params.id);
    if (itemId >= 0 && itemId < items.length) {
        items.splice(itemId, 1);
        return res.sendStatus(204);
    }
    else {
        return res.sendStatus(404);
    }
}
app.get('/items', getItems);
app.post('/items', postItems);
app.put('/items/:id', putItemById);
app.delete('/items/:id', deleteItemById);
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
