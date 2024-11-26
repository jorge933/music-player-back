import ytdl from "@distube/ytdl-core";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { ApiError } from "../classes/api-error";
import { DownloadSongService } from "./downloadSong.service";

jest.mock("fs");
jest.mock("path");
jest.mock("@distube/ytdl-core");

describe("DownloadSongService", () => {
  let downloadSongService: DownloadSongService;

  describe("downloadSong", () => {
    const buffer = Buffer.from("mock video data");
    const bufferPromise: Promise<Buffer> = new Promise((resolve) =>
      resolve(buffer)
    );
    const mockDate = { getTime: () => 12345 };
    const folder = "/mock/folder/";

    beforeEach(() => {
      downloadSongService = new DownloadSongService();

      downloadSongService.downloadVideo = jest.fn(() => bufferPromise);
      (global as any).Date = jest.fn(() => mockDate);

      jest.spyOn(path, "join").mockReturnValue(folder);
    });

    it("should download the song and return the file path", async () => {
      const id = "testId";

      jest.spyOn(fs, "existsSync").mockReturnValue(true);

      const result = await downloadSongService.downloadSong(id);
      const expectedResult = folder + 12345 + id + ".mp3";

      expect(result).toBe(expectedResult);
    });

    it("should create folder musics if dont exist", async () => {
      const folder = "/mock/folder/";

      jest.spyOn(fs, "existsSync").mockReturnValue(false);
      jest.spyOn(fs, "mkdirSync").mockImplementation(jest.fn(() => ""));

      downloadSongService.downloadSong("test");

      expect(fs.mkdirSync).toHaveBeenLastCalledWith(folder);
    });
  });

  describe("downloadVideo", () => {
    beforeEach(() => {
      downloadSongService = new DownloadSongService();
    });

    it("should return buffer if have success", async () => {
      const buffers = [Buffer.from("chunk1"), Buffer.from("chunk2")];

      const mockStream = new Readable({
        read() {
          this.push(buffers[0]);
          this.push(buffers[1]);
          this.push(null);
        },
      });

      jest.spyOn(ytdl, "downloadFromInfo").mockReturnValue(mockStream);

      const info = { videoDetails: { title: "test video" } };
      const result = await downloadSongService.downloadVideo(info as any);

      expect(result).toEqual(Buffer.concat(buffers));
    });

    it("should throw ApiError if a download error occurs", async () => {
      const mockStream = new Readable();

      jest.spyOn(ytdl, "downloadFromInfo").mockReturnValue(mockStream);

      setImmediate(() => {
        mockStream.emit("error", new Error("Erro no stream"));
      });

      const info = { videoDetails: { title: "test video" } };

      await expect(
        downloadSongService.downloadVideo(info as any)
      ).rejects.toThrow(ApiError);
    });
  });
});
