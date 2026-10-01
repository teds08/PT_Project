import { cloudinary } from "../config/cloudinary";
import type {
  CreateAnimeData,
  CreateAnimeInput,
  CreatedAnime,
} from "../interface/create-anime.interface";
import { CreateAnimeRepository } from "../repositories/create-anime.repository";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const VALID_STATUSES = [
  "Watching",
  "Completed",
  "Plan to Watch",
  "On Hold",
  "Dropped",
] as const;

export class CreateAnimeService {
  private readonly createAnimeRepository: CreateAnimeRepository;

  constructor() {
    this.createAnimeRepository = new CreateAnimeRepository();
  }

  async execute(
    data: CreateAnimeInput,
    imageBuffer?: Buffer,
  ): Promise<CreatedAnime> {
    const title = data.title.trim();

    if (!title) {
      throw new Error("Anime title is required.");
    }

    if (!Number.isInteger(data.episodes) || data.episodes <= 0) {
      throw new Error("Episodes must be a positive whole number.");
    }

    if (!VALID_STATUSES.includes(data.status)) {
      throw new Error("Invalid anime status.");
    }

    if (data.status === "Completed") {
      throw new Error(
        "New anime must start with zero progress. Update its progress to mark it completed.",
      );
    }

    let uploadedImage: {
      imageUrl: string;
      publicId: string;
    } | null = null;

    if (imageBuffer) {
      uploadedImage = await uploadToCloudinary(imageBuffer);
    }

    const animeData: CreateAnimeData = {
      ...data,
      title,
      image_url: uploadedImage?.imageUrl ?? null,
      image_public_id: uploadedImage?.publicId ?? null,
    };

    try {
      return await this.createAnimeRepository.create(animeData);
    } catch (error) {
      // Clean up the Cloudinary image if the database insert fails.
      if (uploadedImage) {
        try {
          await cloudinary.uploader.destroy(uploadedImage.publicId);
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
}
