import PrayerRequest from "../models/PrayerRequest";
import { getIO } from "../socket";



export const emitEventForUser = async (prayerId: string, event: string) => {
    try {
        const prayer = await PrayerRequest.findById(prayerId).populate('authorId');
        if (!prayer || !prayer.authorId) {
            throw new Error("Prière introuvable ou auteur de la prière");
        }

        const userId = prayer.authorId._id.toString();

        if (userId) {

            getIO().to(userId).emit(event, {
                message: `Quelqu’un a prié pour toi !`,
                prayerId,
            });

        } else {
            console.log("⚠️ Aucun socket trouvé pour l'utilisateur", userId);
        }

    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error);
    }
};