import type { CreatedAnime } from "../interface/create-anime.interface";
import type {
  UpdateAnimeData,
  UpdateAnimeInput,
} from "../interface/update-anime.interface";
import { UpdateAnimeRepository } from "../repositories/update-anime.repository";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const VALID_STATUSES = [
  "Watching",
  "Completed",
  "Plan to Watch",
  "On Hold",
  "Dropped",
] as const;

type ProgressStatus = "Watching" | "Completed" | "Plan to Watch";

export class UpdateAnimeService {
  private readonly updateAnimeRepository: UpdateAnimeRepository;

  constructor() {
    this.updateAnimeRepository = new UpdateAnimeRepository();
  }

  async execute(
    animeId: number,
    userId: number,
    data: UpdateAnimeInput,
    imageBuffer?: Buffer,
  ): Promise<CreatedAnime> {
    if (!Number.isInteger(animeId) || animeId <= 0) {
      throw new Error("Invalid anime ID.");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const existingAnime = await this.updateAnimeRepository.findByIdAndUserId(
      animeId,
      userId,
    );

    if (!existingAnime) {
      throw new Error("Anime not found.");
    }

    const title =
      data.title !== undefined ? data.title.trim() : existingAnime.title;

    if (!title) {
      throw new Error("Anime title is required.");
    }

    const episodes =
      data.episodes !== undefined ? data.episodes : existingAnime.episodes;

    if (!Number.isInteger(episodes) || episodes <= 0) {
      throw new Error("Episodes must be a positive whole number.");
    }

    const status = data.status ?? existingAnime.status;

    if (!VALID_STATUSES.includes(status)) {
      throw new Error("Invalid anime status.");
    }

    const description =
      data.description !== undefined
        ? data.description
        : existingAnime.description;

    const isFavorite =
      data.is_favorite !== undefined
        ? data.is_favorite
        : existingAnime.is_favorite;

    const websiteUrl =
      data.website_url !== undefined
        ? data.website_url
        : existingAnime.website_url;

    let imageUrl = existingAnime.image_url;
    let imagePublicId = existingAnime.image_public_id;

    let uploadedImage: {
      imageUrl: string;
      publicId: string;
    } | null = null;

    if (imageBuffer) {
      uploadedImage = await uploadToCloudinary(imageBuffer);

      imageUrl = uploadedImage.imageUrl;
      imagePublicId = uploadedImage.publicId;
    }

    const animeData: UpdateAnimeData = {
      title,
      description,
      episodes,
      status,
      is_favorite: isFavorite,
      website_url: websiteUrl,
      image_url: imageUrl,
      image_public_id: imagePublicId,
    };

    try {
      const updatedAnime = await this.updateAnimeRepository.update(
        animeId,
        userId,
        animeData,
      );

      if (!updatedAnime) {
        if (uploadedImage) {
          try {
            await deleteFromCloudinary(uploadedImage.publicId);
          } catch (cleanupError) {
            console.error(
              "Failed to clean up the newly uploaded anime cover:",
              cleanupError,
            );
          }
        }

        throw new Error("Anime could not be updated.");
      }

      if (
        uploadedImage &&
        existingAnime.image_public_id &&
        existingAnime.image_public_id !== uploadedImage.publicId
      ) {
        try {
          await deleteFromCloudinary(existingAnime.image_public_id);
        } catch (cleanupError) {
          console.error(
            "Failed to delete the old anime cover from Cloudinary:",
            cleanupError,
          );
        }
      }

      return updatedAnime;
    } catch (error) {
      if (uploadedImage) {
        try {
          await deleteFromCloudinary(uploadedImage.publicId);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up the uploaded anime cover:",
            cleanupError,
          );
        }
      }

      throw error;
    }
  }

  async executeProgress(
    animeId: number,
    userId: number,
    progress: number,
  ): Promise<CreatedAnime> {
    if (!Number.isInteger(animeId) || animeId <= 0) {
      throw new Error("Invalid anime ID.");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    if (!Number.isInteger(progress) || progress < 0) {
      throw new Error("Progress must be a non-negative whole number.");
    }

    const existingAnime = await this.updateAnimeRepository.findByIdAndUserId(
      animeId,
      userId,
    );

    if (!existingAnime) {
      throw new Error("Anime not found.");
    }

    if (progress > existingAnime.episodes) {
      throw new Error(
        `Progress cannot exceed the total number of episodes (${existingAnime.episodes}).`,
      );
    }

    let status: ProgressStatus;

    if (progress === existingAnime.episodes) {
      status = "Completed";
    } else if (progress === 0) {
      status = "Plan to Watch";
    } else {
      status = "Watching";
    }

    const updatedAnime = await this.updateAnimeRepository.updateProgress(
      animeId,
      userId,
      progress,
      status,
    );

    if (!updatedAnime) {
      throw new Error("Anime could not be updated.");
    }

    return updatedAnime;
  }

  async executeFavorite(
    animeId: number,
    userId: number,
    isFavorite: boolean,
  ): Promise<CreatedAnime> {
    if (!Number.isInteger(animeId) || animeId <= 0) {
      throw new Error("Invalid anime ID.");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    if (typeof isFavorite !== "boolean") {
      throw new Error("Favorite status must be a boolean.");
    }

    const existingAnime = await this.updateAnimeRepository.findByIdAndUserId(
      animeId,
      userId,
    );

    if (!existingAnime) {
      throw new Error("Anime not found.");
    }

    const updatedAnime = await this.updateAnimeRepository.updateFavorite(
      animeId,
      userId,
      isFavorite,
    );

    if (!updatedAnime) {
      throw new Error("Anime favorite status could not be updated.");
    }

    return updatedAnime;
  }

  async executeStatus(
    animeId: number,
    userId: number,
    status: "Watching" | "Completed" | "Plan to Watch" | "On Hold" | "Dropped",
  ): Promise<CreatedAnime> {
    if (!Number.isInteger(animeId) || animeId <= 0) {
      throw new Error("Invalid anime ID.");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    if (!VALID_STATUSES.includes(status)) {
      throw new Error("Invalid anime status.");
    }

    const existingAnime = await this.updateAnimeRepository.findByIdAndUserId(
      animeId,
      userId,
    );

    if (!existingAnime) {
      throw new Error("Anime not found.");
    }

    let progress = existingAnime.progress;

    if (status === "Completed") {
      progress = existingAnime.episodes;
    } else if (status === "Plan to Watch") {
      progress = 0;
    }

    const updatedAnime = await this.updateAnimeRepository.updateStatus(
      animeId,
      userId,
      progress,
      status,
    );

    if (!updatedAnime) {
      throw new Error("Anime status could not be updated.");
    }

    return updatedAnime;
  }
}
