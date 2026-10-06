import type { CreatedAnime } from "../interface/create-anime.interface";
import { GetAnimeRepository } from "../repositories/get-anime.repository";

export class GetAnimeService {
  private readonly getAnimeRepository: GetAnimeRepository;

  constructor() {
    this.getAnimeRepository = new GetAnimeRepository();
  }

  async execute(userId: number): Promise<CreatedAnime[]> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    return this.getAnimeRepository.findAllByUserId(userId);
  }

  async executeById(animeId: number, userId: number): Promise<CreatedAnime> {
    if (!Number.isInteger(animeId) || animeId <= 0) {
      throw new Error("Invalid anime ID.");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID.");
    }

    const anime = await this.getAnimeRepository.findByIdAndUserId(
      animeId,
      userId,
    );

    if (!anime) {
      throw new Error("Anime not found.");
    }

    return anime;
  }
}
