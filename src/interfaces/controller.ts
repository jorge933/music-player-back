import { Router } from "express";

export interface Controller {
  prefix: string;
  router: Router;
}
