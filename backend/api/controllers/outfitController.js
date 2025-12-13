
const ClothingItem = require('../db/models/ClothingItems');
const Outfit = require('../db/models/Outfits');
const OutfitItem = require('../db/models/OutfitItems');
const { generateOutfitWithGemini } = require('../services/geminiService');
const { Response } = require('../lib/Response');
const { CustomError } = require('../lib/CustomError');

/**
 * Gemini kullanarak yeni bir kombin oluşturur, kaydeder ve döndürür.
 */
const generateAndSaveOutfit = async (req, res, next) => {
  console.log("generateAndSaveOutfit called");
  try {
    const userId = req.user.id;
    console.log("userId:", userId);

    if (!userId) {
      throw new CustomError("User not authenticated.", 401);
    }

    // Kullanıcının tüm kıyafetlerini ve hariç tutulacak kombinlerini çek
    const [userClothingItems, excludedOutfits] = await Promise.all([
      ClothingItem.find({ userId: userId }),
      Outfit.find({ 
        userId: userId, 
        status: { $in: ['disliked', 'suggested'] } 
      }).populate('items') // Gemini'ye daha iyi bilgi vermek için item detaylarını al
    ]);
    console.log("userClothingItems count:", userClothingItems.length);
    console.log("excludedOutfits count:", excludedOutfits.length);


    if (!userClothingItems || userClothingItems.length < 3) {
      throw new CustomError("Not enough clothing items to generate an outfit. Please add more items to your wardrobe.", 400);
    }

    // Gemini servisinden kombin için kıyafet ID'lerini al (hariç tutulacakları da gönder)
    const outfitItemIds = await generateOutfitWithGemini(userClothingItems, excludedOutfits);
    console.log("outfitItemIds from geminiService:", outfitItemIds);


    if (!outfitItemIds || outfitItemIds.length === 0) {
      throw new CustomError("Could not generate a new unique outfit with the available items.", 500);
    }
    
    // Yeni bir Outfit nesnesi oluştur ve Gemini'den gelen item'ları direkt ekle
    const newOutfit = new Outfit({
      userId: userId,
      name: `New Outfit - ${new Date().toLocaleDateString()}`, // Örnek bir isim
      items: outfitItemIds, // Gemini'den gelen ID'leri direkt ata
      status: 'suggested', // Yeni status alanını kullan
    });
    console.log("newOutfit before saving:", newOutfit);


    await newOutfit.save();

    // Oluşturulan kombini detaylarıyla birlikte geri döndür
    const finalOutfit = await Outfit.findById(newOutfit._id).populate('items');
    console.log("finalOutfit after saving and populating:", finalOutfit);


    res.status(201).json(Response.success(finalOutfit, "Outfit generated and saved successfully."));

  } catch (error) {
    // Hata durumunda loglama yap
    console.error("Error during outfit generation:", error.message, error.stack);
    
    // CustomError'ı istemciye daha anlaşılır bir şekilde gönder
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(Response.fail(error.message));
    }
    
    // Diğer beklenmedik hatalar için
    next(error);
  }
};

const updateOutfitStatus = async (req, res, next) => {
  try {
    const { id: outfitId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['suggested', 'worn', 'disliked'].includes(status)) {
      throw new CustomError("Invalid status provided.", 400);
    }

    const outfit = await Outfit.findOne({ _id: outfitId, userId: userId });

    if (!outfit) {
      throw new CustomError("Outfit not found or you don't have permission to change it.", 404);
    }

    outfit.status = status;
    await outfit.save();

    res.status(200).json(Response.success(outfit, "Outfit status updated successfully."));

  } catch (error) {
    // Hata durumunda loglama yap
    console.error("Error during outfit status update:", error.message);
    
    // CustomError'ı istemciye daha anlaşılır bir şekilde gönder
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(Response.fail(error.message));
    }
    
    // Diğer beklenmedik hatalar için
    next(error);
  }
};

module.exports = {
  generateAndSaveOutfit,
  updateOutfitStatus,
};
