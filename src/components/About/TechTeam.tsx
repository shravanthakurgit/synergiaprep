"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2Icon, PaintbrushIcon } from "lucide-react";

interface DepartmentHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-center space-x-4 mb-8">
    <div className="p-3 bg-primary/10 rounded-lg">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const TechTeam = () => {
  const teamMembers = [
    {
      name: "Mourya Saha",
      role: "Frontend Developer",
      expertise: ["React", "UI/UX", "NextJs"],
      department: "Frontend",
      dept: "Computer Science and Engineering",
      bio: "Jadavpur University",
    },
    {
      name: "Arka Dutta",
      role: "Backend Developer",
      expertise: ["NextJs", "Database"],
      department: "Backend",
      dept: "Computer Science and Engineering",
      bio: "Jadavpur University",
    },
    {
      name: "Arpan Koley",
      role: "Backend Developer",
      expertise: ["Machine Learning", "Python"],
      department: "Backend",
      dept: "Computer Science and Engineering",
      bio: "Jadavpur University",
    },
    {
      name: "Md Khalid Saifullah",
      role: "Frontend Developer",
      expertise: ["React", "UI/UX"],
      department: "Frontend",
      dept: "Computer Science and Engineering",
      bio: "Jadavpur University",
    },
  ];

  const frontendTeam = teamMembers.filter(
    (member) => member.department === "Frontend"
  );
  const backendTeam = teamMembers.filter(
    (member) => member.department === "Backend"
  );

  const TeamMemberCard: React.FC<{ member: (typeof teamMembers)[0] }> = ({
    member,
  }) => (
    <Card className="bg-background hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col justify-around space-y-4 text-center">
        <h3 className="text-lg md:text-xl font-bold">{member.name}</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          {member.role}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">
          {member.dept}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">{member.bio}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {member.expertise.map((skill, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs md:text-sm text-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-8 md:py-16 bg-muted/50" id="team">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            The Synergy
          </h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
            Our technology team brings together talented engineers and
            developers who are passionate about building innovative solutions.
          </p>
        </div>

        <div className="space-y-16">
          {/* Frontend Section */}
          <div>
            <DepartmentHeader
              icon={PaintbrushIcon}
              title="Frontend Team"
              description="Crafting beautiful and intuitive user experiences"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {frontendTeam.map((member, index) => (
                <TeamMemberCard key={index} member={member} />
              ))}
            </div>
          </div>

          {/* Backend Section */}
          <div>
            <DepartmentHeader
              icon={Code2Icon}
              title="Backend Team"
              description="Building robust and scalable system architecture"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {backendTeam.map((member, index) => (
                <TeamMemberCard key={index} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechTeam;
