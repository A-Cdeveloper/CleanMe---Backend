import { MAX_PAGE_SIZE } from "@/app/config";
import prisma from "../db/db";
//import tailwindConfig from "../../../tailwind.config";

export const getAllPartners = async (
  sortBy: string = "pid-asc",
  startIndex?: number,
  pageSize: number = 1000
) => {
  const [field, order] = sortBy.split("-");

  // Ensure valid sorting inputs
  const validFields = ["pid", "partnerName"]; // Add more valid fields as needed
  const validOrder = ["asc", "desc"];

  if (!validFields.includes(field) || !validOrder.includes(order)) {
    throw new Error("Invalid sorting parameters.");
  }

  try {
    const [partners, totalPartners] = await Promise.all([
      prisma.partners.findMany({
        orderBy: {
          [field]: order, // Dynamically set sorting field and order
        },
        skip: startIndex || 0,
        take: pageSize || MAX_PAGE_SIZE,
      }),
      prisma.partners.count(),
    ]);

    return { partners, totalPartners };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Greška prilikom preuzimanja partnera.`);
    }
  }
};

export const getPartner = async (pid: string) => {
  try {
    const partner = await prisma.partners.findUnique({
      where: {
        pid: +pid,
      },
    });
    return partner;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Greška prilikom preuzimanja partnera.`);
    }
  }
};
