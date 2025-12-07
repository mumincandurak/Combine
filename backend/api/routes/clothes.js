var express = require('express');
var router = express.Router();
console.log("Clothes.js dosyası okundu!"); // <--- BU SATIRI EKLE
var ClothingItems = require('../db/models/ClothingItems'); // Model yolunu kontrol et
var response = require("../lib/Response");
var _enum = require("../config/enum");
var verifyToken = require("../lib/authToken");
const upload = require("../lib/upload");
const cloudinary = require("../config/cloudinary");

router.get('/test', (req, res) => {
    res.send("Bağlantı başarılı! Clothes rotasına ulaştın.");
});

/* GET all clothes for the logged-in user */
router.get("/", verifyToken, async (req, res) => {
    try {
        // Sadece token'daki kullanıcıya ait kıyafetleri getir
        const items = await ClothingItems.find({ userId: req.user.id });

        return res.status(_enum.HTTP_STATUS.OK).json(
            response.successResponse(_enum.HTTP_STATUS.OK, items)
        );
    } catch (err) {
        console.error("Error: get clothes", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

/* POST add a new cloth */
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const {
            name,
            category,
            subCategory,
            occasionId,
            description,
            size,
            color,
            material,
            brand,
            season,
            tempratureRange
        } = req.body;
        console.log(req.file);
        console.log(req.body);

        // Zorunlu alan kontrolü (Modelde required olanlar)
        if (!name || !category || !color || !occasionId || !season) {
            return res.status(_enum.HTTP_STATUS.BAD_REQUEST).json(
                response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
                    message: "Missing required fields",
                    description: "Name, Category, SubCategory, Season and OccasionId are required."
                })
            );
        }

        let imageUrl = null;
        let imagePublicId = null;

        if (!req.file) {
            return response.errorResponse(_enum.HTTP_STATUS.BAD_REQUEST, {
                message: "missing required fields",
                description: "photo is required"
            })
        } else {
            const cloudinaryUpload = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "CombineApp" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            imageUrl = cloudinaryUpload.secure_url;
            imagePublicId = cloudinaryUpload.public_id
        }

        const newCloth = new ClothingItems({
            userId: req.user.id, // Token'dan gelen user ID'yi kullanıyoruz
            name,
            category,
            subCategory,
            occasionId,
            description,
            size,
            color,
            imageUrl,
            imagePublicId,
            material,
            brand,
            season,
            tempratureRange,
            isActive: true
        });

        const savedCloth = await newCloth.save();

        return res.status(_enum.HTTP_STATUS.CREATED).json(
            response.successResponse(_enum.HTTP_STATUS.CREATED, {
                message: "Clothing item added successfully",
                item: savedCloth
            })
        );

    } catch (err) {
        console.error("Error: add cloth", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

/* PUT update a cloth */
router.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const updates = req.body;
        
        // Güvenlik: Kullanıcı başkasının kıyafetini güncelleyememeli
        // Hem ID eşleşmeli hem de userId token'daki ile aynı olmalı
        const updatedCloth = await ClothingItems.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updates,
            { new: true } // Güncellenmiş veriyi döndür
        );

        if (!updatedCloth) {
            return res.status(_enum.HTTP_STATUS.NOT_FOUND).json(
                response.errorResponse(_enum.HTTP_STATUS.NOT_FOUND, {
                    message: "Item not found or unauthorized",
                    description: "Could not find the clothing item to update."
                })
            );
        }

        return res.status(_enum.HTTP_STATUS.OK).json(
            response.successResponse(_enum.HTTP_STATUS.OK, {
                message: "Item updated successfully",
                item: updatedCloth
            })
        );

    } catch (err) {
        console.error("Error: update cloth", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

/* DELETE a cloth */
router.delete("/delete/:id", verifyToken, async (req, res) => {
    console.log("User ID:", req.user.id);
    console.log("Param ID:", req.params.id);
    try {
        // Güvenlik: Sadece kendi eklediği kıyafeti silebilir
        const deletedCloth = await ClothingItems.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });


        if (deletedCloth.imagePublicId) {
            await cloudinary.uploader.destroy(deletedCloth.imagePublicId);
        }

        if (!deletedCloth) {
            return res.status(_enum.HTTP_STATUS.NOT_FOUND).json(
                response.errorResponse(_enum.HTTP_STATUS.NOT_FOUND, {
                    message: "Error: delete item",
                    description: "Item not found or you are not authorized to delete it."
                })
            );
        }

        return res.status(_enum.HTTP_STATUS.OK).json(
            response.successResponse(_enum.HTTP_STATUS.OK, "Item deleted successfully")
        );

    } catch (err) {
        console.error("Delete error:", err);
        return res.status(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            response.errorResponse(_enum.HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
        );
    }
});

module.exports = router;