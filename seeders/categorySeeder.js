/*
seeders/categorySeeder.js
Based on your SQL seed data
*/

const { Category } = require("../models");

const categorySeeder = async () => {
  const categories = [
    {
      name: "Concerts",
      slug: "concerts",
      icon: "MusicNote",
      color: "#f59e0b",
    },
    {
      name: "Sports",
      slug: "sports",
      icon: "SportsSoccer",
      color: "#22c55e",
    },
    {
      name: "Seminars",
      slug: "seminars",
      icon: "School",
      color: "#6366f1",
    },
    {
      name: "Comedy",
      slug: "comedy",
      icon: "EmojiEmotions",
      color: "#f472b6",
    },
    {
      name: "Theatre",
      slug: "theatre",
      icon: "TheaterComedy",
      color: "#2563eb",
    },
    {
      name: "Clubs",
      slug: "clubs",
      icon: "Nightlife",
      color: "#ec4899",
    },
    {
      name: "Workshops",
      slug: "workshops",
      icon: "Build",
      color: "#14b8a6",
    },
    {
      name: "Exhibitions",
      slug: "exhibitions",
      icon: "Museum",
      color: "#f97316",
    },
  ];

  for (const item of categories) {
    await Category.findOrCreate({
      where: { slug: item.slug },
      defaults: item,
    });
  }

  console.log("Categories seeded successfully");
};

module.exports = categorySeeder;
