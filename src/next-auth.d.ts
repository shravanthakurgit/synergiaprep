import { RoleType } from "@prisma/client";
import { type DefaultSession } from "next-auth";

interface Enrollment {
  courseId: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      image: string;
      name: string;
      ph_no: number;
      role: RoleType;
      enrollments: Enrollment[];
    };
  }
}
