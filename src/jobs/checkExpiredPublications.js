import cron from 'node-cron';
import Publication from '../publications/publication.model.js';
import Comment from '../comments/comment.model.js';

const checkExpiredPublications = () => {
    // Ejecuta cada minuto
    cron.schedule('* * * * *', async () => {
        const now = new Date();

        try {
            const expiredPublications = await Publication.find({
                expirationDate: { $lte: now },
                status: true
            });

            for (const pub of expiredPublications) {
                await Publication.findByIdAndUpdate(pub._id, { status: false });
                await Comment.updateMany({ publication: pub._id }, { $set: { status: false } });
                console.log(`Publicación ${pub._id} marcada como inactiva por expiración.`);
            }
        } catch (error) {
            console.error('Error revisando publicaciones expiradas:', error.message);
        }
    });
};

export default checkExpiredPublications;