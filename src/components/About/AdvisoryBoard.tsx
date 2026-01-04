"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Advisor {
  name: string;
  position: string[];
  expertise: string[];
  bio: string;
  achievements: string[];
  image: string;
}

interface AdvisoryBoardProps {
  title: string;
  advisors: Advisor[];
  id: string;
}

export const AdvisoryBoard: React.FC<AdvisoryBoardProps> = ({
  title,
  advisors,
  id,
}) => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(advisors.length).fill(false)
  );
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Observer for card animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardsRef.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1 && entry.isIntersecting) {
            setVisibleCards((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      { rootMargin: "-50px" }
    );

    // Store current refs to use in cleanup
    const currentRefs = cardsRef.current;

    currentRefs.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      currentRefs.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [advisors.length]);

  return (
    <section
      className="py-16 bg-gradient-to-b from-background to-muted"
      id={id}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-blue-700 mb-4">
            {title}
          </h2>
          <Separator className="w-24 h-1 mx-auto bg-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {advisors.map((advisor, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`w-full max-w-sm transition-all duration-500 opacity-0 translate-y-8 ${
                visibleCards[index] ? "opacity-100 translate-y-0" : ""
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <Card
                className="h-full flex flex-col overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:shadow-xl rounded-xl backdrop-blur-sm bg-card/80"
                onClick={() => setSelectedAdvisor(advisor)}
              >
                <div className="relative p-4 flex justify-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={advisor.image}
                        alt={advisor.name}
                        className="object-scale-down bg-white" // Changed from object-cover to object-scale-down
                      />
                      <AvatarFallback className="text-4xl bg-primary/10">
                        {advisor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <CardContent className="text-center flex-grow flex flex-col">
                  <h3 className="text-2xl font-semibold text-foreground mb-1">
                    {advisor.name}
                  </h3>
                  <div className="space-y-1 mb-4">
                    {advisor.position.map((pos, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">
                        {pos}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Dialog
          open={!!selectedAdvisor}
          onOpenChange={(open) => !open && setSelectedAdvisor(null)}
        >
          <DialogContent className="max-w-4xl h-[80vh] w-[95vw] p-0 overflow-hidden rounded-xl border-2 border-primary/20">
            {selectedAdvisor && (
              <>
                <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-r from-primary/10 to-background">
                  <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                    {selectedAdvisor.name}
                  </DialogTitle>
                  <DialogDescription className="text-center max-w-xl mx-auto">
                    {selectedAdvisor.position[0]}
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="profile" className="w-full p-6">
                  <TabsList className="w-full justify-center mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="bio">Biography</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="w-full h-[50vh]">
                    <TabsContent value="profile" className="space-y-6 p-4">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="md:w-1/3 flex justify-center">
                          <div className="w-52 h-52 rounded-xl overflow-hidden border-4 border-primary/20">
                            <Avatar className="w-full h-full">
                              <AvatarImage
                                src={selectedAdvisor.image}
                                alt={selectedAdvisor.name}
                                className="object-scale-down bg-white" // Changed from object-cover to object-scale-down
                              />
                              <AvatarFallback className="text-6xl bg-primary/10">
                                {selectedAdvisor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <div className="space-y-2 mb-4">
                            {selectedAdvisor.position.map((pos, idx) => (
                              <p key={idx} className="text-muted-foreground">
                                {pos}
                              </p>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {selectedAdvisor.expertise.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-primary/5"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bio" className="p-4">
                      <div className="prose prose-lg max-w-none dark:prose-invert">
                        <p className="text-justify leading-relaxed">
                          &quot;{selectedAdvisor.bio}&quot;
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="achievements" className="p-4">
                      <div className="space-y-6">
                        <h4 className="font-semibold text-xl text-center mb-6 text-primary">
                          Key Accomplishments
                        </h4>
                        <ul className="space-y-4">
                          {selectedAdvisor.achievements.map(
                            (achievement, idx) => (
                              <li
                                key={idx}
                                className="flex items-start p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                              >
                                <span className="mr-3 text-primary text-xl">
                                  •
                                </span>
                                <p className="text-foreground">{achievement}</p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default AdvisoryBoard;
