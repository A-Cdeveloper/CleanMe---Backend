/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

//import { LogoutUserAction } from "@/app/(auth)/_actions";
import { hashPassword } from "@/app/_utils/auth";
import prisma from "@/app/_utils/db/db";
import { handleError } from "@/app/_utils/errorHandler";
import { registerPasswordSchema } from "@/app/_utils/zod/authSchemas";
import { UserFormSchema } from "@/app/_utils/zod/userSchemas";

export const updateProfileAction = async (
  prevFormData: any,
  formData: FormData
) => {
  const updateProfileData = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  const uid = formData.get("uid") as string;

  const validation = UserFormSchema.safeParse(updateProfileData);
  if (!validation.success) {
    const errors = validation.error.issues.map(
      (issue: { message: string }) => issue.message
    );
    return {
      success: false,
      message: [...errors] as string[],
    };
  }

  const existingUserEmail = await prisma.user.findUnique({
    where: {
      email: updateProfileData.email as string,
      NOT: {
        uid: +uid, // Exclude the current user
      },
    },
  });

  if (existingUserEmail) {
    return {
      success: false,
      message: ["Već postoji korisnik sa ovom email adresom!"],
    };
  }

  await prisma.user.update({
    where: {
      uid: +uid,
    },
    data: {
      firstname: updateProfileData.firstname as string,
      lastname: updateProfileData.lastname as string,
      email: updateProfileData.email as string,
      phone: updateProfileData.phone as string,
    },
  });

  return {
    success: true,
    message: ["Profil je uspešno ažuriran!"],
  };
};

export const updateProfilePasswordAction = async (
  prevFormData: any,
  formData: FormData
) => {
  const updateProfilePassword = {
    passwordAgain: formData.get("passwordAgain") as string,
  };

  const uid = formData.get("uid") as string;

  console.log(updateProfilePassword);

  const validation = registerPasswordSchema.safeParse(
    updateProfilePassword.passwordAgain
  );
  if (!validation.success) {
    const errors = validation.error.issues.map(
      (issue: { message: string }) => issue.message
    );

    return {
      success: false,
      message: [...errors] as string[],
    };
  }

  const passwordHash = await hashPassword(updateProfilePassword.passwordAgain);

  await prisma.user.update({
    where: {
      uid: +uid,
    },
    data: {
      passwordHash: passwordHash,
    },
  });

  // LogoutUserAction();

  return {
    success: true,
    message: [
      "Lozinka je uspešno promenjena! Molimo Vas da se ponovo prijavite.",
    ],
  };
};

export const deleteProfileAction = async (userId: number) => {
  try {
    await prisma.user.delete({
      where: {
        uid: userId,
      },
    });
    return {
      success: true,
      message: ["Profil je uspešno obrisan!"],
    };
  } catch (error) {
    if (error instanceof Error) {
      handleError(error);
    }
    return {
      success: false,
      message: ["Greška prilikom brisanja profila!"],
    };
  }
};
