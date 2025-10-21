"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { masters } from "@/lib/config";
import { Scissors } from "lucide-react";

export default function MastersSection() {
  return (
    <section id="masters" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши мастера</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            8 сертифицированных барберов с опытом от 3 до 15 лет
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.filter((m) => m.id !== "auto").map((master) => (
            <Card key={master.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                    {master.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{master.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    {master.title}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Опыт:</strong> {master.experience}
                </p>
                <p className="text-sm text-gray-600">
                  <Scissors className="w-4 h-4 inline mr-1" />
                  {master.specialization}
                </p>
                <p className="text-sm text-emerald-700 font-medium">
                  {master.description}
                </p>
                {master.priceAdd > 0 && (
                  <p className="text-xs text-gray-500">
                    +{master.priceAdd} ₽ к базовой цене
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
