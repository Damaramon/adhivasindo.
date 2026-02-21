import { Request, Response, NextFunction } from "express";
import { fetchRemoteData, filterByNama, filterByNim, filterByYmd } from "../services/remoteDataService.js";

export const searchController = {
  byName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nama = String(req.params.nama ?? "");
      const rows = await fetchRemoteData();
      const result = filterByNama(rows, nama);
      return res.json({ success: true, query: { nama }, count: result.length, data: result });
    } catch (err) {
      return next(err);
    }
  },

  byNim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nim = String(req.params.nim ?? "");
      const rows = await fetchRemoteData();
      const result = filterByNim(rows, nim);
      return res.json({ success: true, query: { nim }, count: result.length, data: result });
    } catch (err) {
      return next(err);
    }
  },

  byYmd: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ymd = String(req.params.ymd ?? "");
      const rows = await fetchRemoteData();
      const result = filterByYmd(rows, ymd);
      return res.json({ success: true, query: { ymd }, count: result.length, data: result });
    } catch (err) {
      return next(err);
    }
  }
};
