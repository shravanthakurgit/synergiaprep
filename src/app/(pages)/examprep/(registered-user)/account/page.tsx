"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  deleteServerSide,
} from "@/app/actions/img";

export default function ProfileAccount() {
  const { data: session, update } = useSession();

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialDataRef = useRef({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(" ") || ["", ""];
      const [first, ...last] = nameParts;

      const newFirstName = first || "";
      const newLastName = last.join(" ") || "";
      const newEmail = session.user.email || "";
      const newPhone = session.user.ph_no?.toString() || "";

      setImage(session.user.image || null);
      setFirstName(newFirstName);
      setLastName(newLastName);
      setEmail(newEmail);
      setPhone(newPhone);

      initialDataRef.current = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
      };
    }
  }, [session]);

  useEffect(() => {
    const currentData = { firstName, lastName, email, phone };
    setHasChanges(
      JSON.stringify(currentData) !==
        JSON.stringify(initialDataRef.current)
    );
  }, [firstName, lastName, email, phone]);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (image) {
        await removeImage();
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result;
        if (!fileData) return;

        const presignedURL = new URL(
          "/api/presigned-upload",
          window.location.href
        );
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);

        // REMOVED: const smallerPayload = await getResizedImage(fileData as ArrayBuffer);
        // Use original file data instead
        const originalFileData = fileData as ArrayBuffer;

        // Pass the original file data to uploadImg
        await fetch(presignedURL.toString(), {
  method: "PUT",
  headers: {
    "Content-Type": file.type,
  },
  body: originalFileData, // ArrayBuffer is valid here
});


        const imageUrl = `/uploads/${file.name}`;
        setImage(imageUrl);

        await updateUserProfile({ image: imageUrl });
        await update();

        toast.success("Profile photo updated successfully (original quality preserved)");
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading profile photo");
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const removeImage = async () => {
    if (!image) return;

    try {
      const fileName = image.split("/").pop() as string;

      const presignedURL = new URL(
        "/api/presigned-delete",
        window.location.href
      );
      presignedURL.searchParams.set("fileName", fileName);

      await deleteServerSide(
        presignedURL.toString(),
        window.location.origin
      );

      await updateUserProfile({ image: null });
      setImage(null);
      await update();

      toast.success("Profile photo removed");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error removing profile photo");
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!firstName.trim()) errors.push("First name is required");
    if (!lastName.trim()) errors.push("Last name is required");

    if (!email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Email is invalid");
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      errors.push("Phone number must be exactly 10 digits or empty");
    }

    return errors;
  };

  const updateUserProfile = async (data: {
    name?: string;
    email?: string;
    image?: string | null;
    ph_no?: number | null;
  }) => {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update profile");
    }

    return result;
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length) {
      validationErrors.forEach((err) => toast.error(err));
      return;
    }

    setIsSaving(true);

    try {
      const updateData: {
        name: string;
        email: string;
        ph_no?: number | null;
      } = {
        name: `${firstName} ${lastName}`.trim(),
        email,
      };

      if (phone.trim() === "") {
        updateData.ph_no = null;
      } else {
        updateData.ph_no = Number(phone);
      }

      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      await update();

      initialDataRef.current = {
        firstName,
        lastName,
        email,
        phone,
      };

      setHasChanges(false);
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred while saving";

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    toast.info("Password update feature coming soon");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile photo
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={image || undefined} />
                    <AvatarFallback>
                      {firstName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* <div className="space-y-2">
                    <Button onClick={handleChangePhoto}>
                      Change Photo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={uploadFile}
                      accept="image/*"
                    />
                    <Button variant="ghost" onClick={removeImage}>
                      Remove
                    </Button>
                  </div> */}

                  
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone No.</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit phone number (optional)"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Manage your app preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">English</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={handleUpdatePassword}>
                Update Password
              </Button>
              <Separator />
              <div className="flex justify-between">
                <Label>Two-Factor Authentication</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}