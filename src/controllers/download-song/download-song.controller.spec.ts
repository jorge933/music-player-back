import { Request } from "express";
import { DownloadSongController } from "./download-song.controller";

import fs from "fs";
import { ApiError } from "../../classes/api-error";

const FILE_NAME = "/folder/output-file";

jest.mock("fs");
jest.mock("express");
jest.mock("../../decorators/post.decorator", () => ({
  Post: jest
    .fn()
    .mockImplementation(() => (target, key, descriptor) => descriptor),
}));
jest.mock("../../services/download-song/download-song.service", () => {
  return {
    DownloadSongService: jest.fn().mockImplementation(() => ({
      downloadSong: jest.fn().mockResolvedValue(FILE_NAME),
    })),
  };
});

describe("DownloadSongController", () => {
  let downloadSongController: DownloadSongController;

  const mockRequestAndResponse = (videoId: string) => ({
    req: { body: { videoId } } as Request,
    res: {
      sendFile: jest.fn((filePath: string, callback: () => void) => callback()),
    } as any,
  });

  beforeEach(() => {
    downloadSongController = new DownloadSongController();
  });

  it("should call res.sendFile and fs.rmSync", async () => {
    const { req, res } = mockRequestAndResponse("XqZsoesa55w");
    await downloadSongController.downloadVideo(req, res);

    expect(res.sendFile).toHaveBeenCalledWith(FILE_NAME, expect.any(Function));
    expect(fs.rmSync).toHaveBeenCalledWith(FILE_NAME);
  });
});
