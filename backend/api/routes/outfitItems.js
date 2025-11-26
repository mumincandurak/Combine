var express = require('express');
var router = express.Router();
var OutfitItems = require('../db/models/OutfitItems'); // Adjust path if necessary
var response = require("../lib/Response");
var _enum = require("../config/enum");
var verifyToken = require("../lib/authToken");

/* GET all outfit items for the logged-in user */
router.get("/", verifyToken, async (req, res) => {
    try {
        const items = await OutfitItems.find({ userId: req.user.id });

        return res.status(_enum.HTTP_STATUS.OK).json(
            response.successResponse(_enum.HTTP_STATUS.OK, items)
        );
    } catch (err) {
        console.error("Error: get outfit items", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

/* POST add a new outfit item (log/rating) */
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { itemId, rating, description, liked } = req.body;

        // Check required fields based on Schema
        if (!itemId) {
            return res.status(_enum.HTTP_STATUS.BAD_REQUEST).json(
                response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
                    message: "Missing required fields",
                    description: "itemId is required."
                })
            );
        }

        const newOutfitItem = new OutfitItems({
            userId: req.user.id, // From Token
            itemId,
            rating,
            description,
            liked: liked || false
        });

        const savedItem = await newOutfitItem.save();

        return res.status(_enum.HTTP_STATUS.CREATED).json(
            response.successResponse(_enum.HTTP_STATUS.CREATED, {
                message: "Outfit item added successfully",
                item: savedItem
            })
        );

    } catch (err) {
        console.error("Error: add outfit item", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

/* PUT update an outfit item */
router.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const updates = req.body;

        // Security: Ensure the item belongs to the logged-in user
        const updatedItem = await OutfitItems.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updates,
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(_enum.HTTP_STATUS.NOT_FOUND).json(
                response.errorResponse(_enum.HTTP_STATUS.NOT_FOUND, {
                    message: "Item not found or unauthorized",
                    description: "Could not find the outfit item to update."
                })
            );
        }

        return res.status(_enum.HTTP_STATUS.OK).json(
            response.successResponse(_enum.HTTP_STATUS.OK, {
                message: "Outfit item updated successfully",
                item: updatedItem
            })
        );

    } catch (err) {
        console.error("Error: update outfit item", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

/* DELETE an outfit item */
router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        // Security: Ensure the item belongs to the logged-in user
        const deletedItem = await OutfitItems.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deletedItem) {
            return res.status(_enum.HTTP_STATUS.NOT_FOUND).json(
                response.errorResponse(_enum.HTTP_STATUS.NOT_FOUND, {
                    message: "Error: delete item",
                    description: "Item not found or you are not authorized to delete it."
                })
            );
        }

        return res.status(_enum.HTTP_STATUS.OK).json(
            response.successResponse(_enum.HTTP_STATUS.OK, "Outfit item deleted successfully")
        );

    } catch (err) {
        console.error("Delete error:", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

module.exports = router;