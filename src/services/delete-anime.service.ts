import { DeleteAnimeRepository } from "../repositories/delete-anime.repository";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";

export class DeleteAnimeService {
  private readonly deleteAnimeRepository: DeleteAnimeRepository;

  constructor() {
    this.deleteAnimeRepository = new DeleteAnimeRepository();
  }

  async execute(animeId: number, userId: number): Promise<void> {
    if (!Number.isInteger(animeId) || animeId <= 0) {
      throw new Error("Invalid anime ID.");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const deletedAnime = await this.deleteAnimeRepository.delete(
      animeId,
      userId,
    );

    if (!deletedAnime) {
      throw new Error("Anime not found.");
    }

    if (deletedAnime.image_public_id) {
      try {
        await deleteFromCloudinary(deletedAnime.image_public_id);
      } catch (cleanupError) {
        console.error(
          "Failed to delete the anime cover from Cloudinary:",
          cleanupError,
        );
      }
    }
  }
}
