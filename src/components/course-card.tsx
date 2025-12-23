"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Course } from "@/type/course";

interface CourseCardProps {
  course: Course;
  onOpenPreview: () => void;
  className?: string;
}

export function CourseCard({ course, onOpenPreview, className }: CourseCardProps) {
  return (
    <Card className={`${className ? className + " " : ""}overflow-hidden transition-all hover:shadow-md`}>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={course.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
          alt={course.title}
          fill
          className="object-cover"
        />
        {course.bestseller && (
          <Badge className="absolute left-2 top-2 bg-yellow-500 hover:bg-yellow-600">
            Bestseller
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{course.instructor}</p>
        <div className="flex items-center mb-2">
          <span className="text-amber-500 font-bold mr-1">{course.rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(course.rating) ? "fill-amber-500 text-amber-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">({course.reviewCount})</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{course.enrollmentCount} students</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg font-bold">₹{course.price - course.discount}</span>
          <span className="text-sm text-muted-foreground line-through ml-2">₹{course.price}</span>
        </div>
        <Button variant="outline" onClick={onOpenPreview}>
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;