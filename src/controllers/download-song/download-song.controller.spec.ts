import { DownloadSongController } from "./download-song.controller";

import { FastifyRequest } from "fastify";
import fs from "fs";

const FILE_NAME = "/folder/output-file";

jest.mock("fs");
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
    req: { body: { videoId } } as FastifyRequest<{ Body: { videoId: string } }>,
    res: {
      send: jest.fn(),
      header: jest.fn(),
    },
  });

  beforeEach(() => {
    downloadSongController = new DownloadSongController();
  });

  it("should call res.sendFile and fs.rmSync", async () => {
    const { req, res } = mockRequestAndResponse("XqZsoesa55w");

    res.send.mockResolvedValueOnce({});

    await downloadSongController.downloadVideo(req, res as any);

    expect(res.send).toHaveBeenCalled();
    expect(fs.rmSync).toHaveBeenCalledWith(FILE_NAME);
  });
});
