"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reviews, awards } from "@/lib/config";
import { Star, Award } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Отзывы и награды
          </h2>
          <p className="text-xl text-gray-600">
            Более 1200 отзывов на Яндекс, Google и 2ГИС
          </p>
        </div>

        {/* Отзывы */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-gray-900">{review.name}</p>
                  <Badge variant="outline">{review.source}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">{review.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Награды */}
        <div className="bg-white rounded-2xl p-8 border border-emerald-100">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-emerald-700 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Наши достижения</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {awards.map((award, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-emerald-50/50 rounded-lg"
              >
                <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />
                <p className="text-gray-700">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
